const BaseRoute = require('../Structure/BaseRoute');
const FormValidator = require('../Structure/FormValidator');
const getListFeature = require('../Util/getListFeature');

class ListsRoute extends BaseRoute {
    constructor(client, db) {
        super('/lists');
        this.router = require('express').Router();
        this.client = client;
        this.db = db;
        this.routes();
    }

    footerData() {
        return new Promise((resolve, reject) => {
            this.db.run('SELECT discord_only FROM lists WHERE defunct = 0 AND display = 1').then((active) => {
                this.db.run('SELECT COUNT(id) as count FROM lists WHERE defunct = 1').then((defunct) => {
                    const discordOnly = active.filter(list => list.discord_only);
                    resolve({active: active.length, discordOnly: discordOnly.length, defunct: defunct[0].count});
                }).catch(reject);
            }).catch(reject);
        });
    }

    routes() {
        this.router.get('/', (req, res) => {
            try {
                this.db.run('SELECT * FROM lists WHERE defunct = 0 AND display = 1 ORDER BY discord_only DESC, LOWER(name) ASC').then((lists) => {
                    this.footerData().then((footer) => {
                        res.render('lists/lists', {title: 'All Bot Lists', lists, footer});
                    });
                });
            } catch {
                res.status(500).render('error', {title: 'Database Error'});
            }
        });

        this.router.get('/new', (req, res) => {
            try {
                this.db.run('SELECT * FROM lists WHERE defunct = 0 AND display = 1 ORDER BY added DESC LIMIT 4').then((lists) => {
                    this.footerData().then((footer) => {
                        res.render('lists/lists', {
                            title: 'New Bot Lists',
                            subtitle: `These are the most recent bot lists to be added to ${res.__('site_name')}`,
                            lists, footer
                        });
                    });
                });
            } catch {
                res.status(500).render('error', {title: 'Database Error'});
            }
        });

        this.router.get('/defunct', (req, res) => {
            try {
                this.db.run('SELECT * FROM lists WHERE defunct = 1 ORDER BY discord_only DESC, LOWER(name) ASC').then((lists) => {
                    this.footerData().then((footer) => {
                        res.render('lists/lists', {
                            title: 'Defunct Bot Lists',
                            subtitle: `These lists are flagged as defunct on ${res.__('site_name')}`,
                            lists, footer
                        });
                    });
                });
            } catch {
                res.status(500).render('error', {title: 'Database Error'});
            }
        });

        this.router.get('/hidden', (req, res) => {
            try {
                this.db.run('SELECT * FROM lists WHERE defunct = 0 AND display = 0 ORDER BY discord_only DESC, LOWER(name) ASC').then((lists) => {
                    this.footerData().then((footer) => {
                        res.render('lists/lists', {
                            title: 'Hidden Bot Lists',
                            subtitle: `These lists are currently hidden on ${res.__('site_name')}.\nTo find out more about why each list here is hidden, press the Information button on the list card.`,
                            lists, footer
                        });
                    });
                });
            } catch {
                res.status(500).render('error', {title: 'Database Error'});
            }
        });

        this.router.get('/features', (req, res) => {
            try {
                this.db.run('SELECT * FROM features ORDER BY display DESC, name ASC').then((checkboxes) => {
                    this.footerData().then((footer) => {
                        res.render('lists/features', {
                            title: 'All List Features',
                            checkboxes, footer
                        });
                    });
                });
            } catch {
                res.status(500).render('error', {title: 'Database Error'});
            }
        });

        this.router.get('/features/:id', (req, res) => {
            try {
                this.db.run('SELECT * FROM features WHERE id = ? LIMIT 1', [req.params.id]).then((features) => {
                    if (!features.length) return res.status(404).render('error', {
                        title: 'Page not found',
                        status: 404,
                        message: 'The page you were looking for could not be found.'
                    });
                    this.db.run('SELECT * FROM lists LEFT OUTER JOIN (SELECT * FROM feature_map WHERE feature_map.feature = ?) temp ON temp.list = lists.id WHERE display = 1 AND defunct = 0 AND temp.feature IS NOT NULL ORDER BY discord_only DESC, LOWER(name) ASC', [req.params.id]).then((lists) => {
                        this.footerData().then((footer) => {
                            res.render('lists/lists', {
                                title: `Bot Lists with feature '${features[0].name}'`,
                                lists, footer
                            });
                        });
                    });
                });
            } catch {
                res.status(500).render('error', {title: 'Database Error'});
            }
        });

        this.router.get('/search/:query*?', (req, res) => {
            try {
                const query = req.params.query || '';
                this.db.run('SELECT * FROM lists WHERE LOWER(name) LIKE ? AND display = 1 AND defunct = 0 ORDER BY discord_only DESC, LOWER(name) ASC', [`%${query}%`]).then((names) => {
                    this.db.run('SELECT * FROM lists WHERE LOWER(url) LIKE ? AND LOWER(name) NOT LIKE ? AND display = 1 AND defunct = 0 ORDER BY discord_only DESC, LOWER(name) ASC', [`%${query}%`, `%${query}%`]).then((links) => {
                        const lists = [...names, ...links];
                        this.footerData().then((footer) => {
                            res.render('lists/search', {
                                title: 'Bot List Search',
                                query, lists, footer
                            });
                        });
                    });
                });
            } catch {
                res.status(500).render('error', {title: 'Database Error'});
            }
        });

        this.router.get('/add', this.requiresAuth.bind(this), this.isMod.bind(this), async (req, res) => {
            try {
                const features = await this.db.run('SELECT * FROM features ORDER BY display DESC, name ASC');
                res.render('lists/edit', {
                    edit: false,
                    checkboxes: features,
                    interactiveCheckboxes: true,
                    data: {}
                })
            } catch (_) {
                res.status(500).render('error', {title: 'Database Error'});
            }
        });

        this.router.post('/add', this.requiresAuth.bind(this), this.isMod.bind(this), async (req, res) => {
            try {
                const features = await this.db.run('SELECT * FROM features ORDER BY display DESC, name ASC');
                const validate = FormValidator.validateList('', req.body, res.locals.user, false);
                if (validate && validate.length > 0) return res.render('lists/edit', {
                    title: 'Add List ',
                    edit: false,
                    checkboxes: features,
                    interactiveCheckboxes: true,
                    data: req.body,
                    errors: validate
                });
                const columns = await this.db.run('SHOW COLUMNS from lists');
                let changes = {};
                for (const column of columns) {
                    if (req.body[column.Field]) {
                        changes[column.Field] = req.body[column.Field];
                    } else {
                        changes[column.Field] = null;
                    }
                }
                changes['added'] = Date.now();
                await this.db.run('INSERT INTO lists (' + Object.keys(changes).map((c) => c).join(', ') + ') VALUES (' + Object.values(changes).map((c) => this.db.escape(c)).join(', ') + ')');
                for (let [key, value] of Object.entries(req.body)) {
                    if (key.substring(0, 8) === 'feature_') {
                        key = key.replace('feature_', '');
                        value = value === 'on';
                        await this.db.run('INSERT INTO feature_map (list, feature, value) VALUES (?, ?, ?)', [changes.id, key, value]);
                    }
                }
                require('../Util/updateListMessage')(this.client, this.db, req.body, req.body.id);
                res.redirect('/lists/' + req.body.id)
            } catch (e) {
                console.error('e', e)
                res.status(500).render('error', {title: 'Database Error'});
            }
        });

        this.router.get('/:id', (req, res) => {
            try {
                this.db.run('SELECT * FROM lists WHERE id = ? LIMIT 1', [req.params.id]).then((lists) => {
                    if (!lists.length) return res.status(404).render('error', {
                        title: 'Page not found',
                        status: 404,
                        message: 'The page you were looking for could not be found.'
                    });
                    this.db.run('SELECT features.name as name, IFNULL(temp.value, 0) as value, features.display as display, features.type as type, features.id as id FROM features LEFT OUTER JOIN (SELECT * FROM feature_map WHERE feature_map.list = ?) temp ON temp.feature = features.id ORDER BY temp.value DESC, features.display DESC, features.name ASC', [lists[0].id]).then((features) => {
                        res.render('lists/list', {
                            title: `${lists[0].name} (${lists[0].id})`,
                            list: lists[0],
                            checkboxes: features,
                            hideUncheckedBoxes: true
                        });
                    });
                });
            } catch {
                res.status(500).render('error', {title: 'Database Error'});
            }
        });

        this.router.get('/:id/edit', this.requiresAuth.bind(this), this.isMod.bind(this), (req, res) => {
            try {
                this.db.run('SELECT * FROM lists WHERE id = ? LIMIT 1', [req.params.id]).then((lists) => {
                    if (!lists.length) return res.status(404).render('error', {
                        title: 'Page not found',
                        status: 404,
                        message: 'The page you were looking for could not be found.'
                    });
                    this.db.run('SELECT features.name as name, IFNULL(temp.value, 0) as value, features.display as display, features.type as type, features.id as id FROM features LEFT OUTER JOIN (SELECT * FROM feature_map WHERE feature_map.list = ?) temp ON temp.feature = features.id ORDER BY temp.value DESC, features.display DESC, features.name ASC', [lists[0].id]).then((features) => {
                        res.render('lists/edit', {
                            title: 'Edit ' + lists[0].id,
                            data: lists[0],
                            checkboxes: features,
                            edit: true,
                            hideUncheckedBoxes: false,
                            interactiveCheckboxes: true
                        });
                    });
                });
            } catch {
                res.status(500).render('error', {title: 'Database Error'});
            }
        });

        this.router.post('/:id/edit', this.requiresAuth.bind(this), this.isMod.bind(this), (req, res) => {
            try {
                this.db.run('SELECT * FROM lists WHERE id = ? LIMIT 1', [req.params.id]).then((lists) => {
                    if (!lists.length) return res.status(404).render('error', {
                        title: 'Page not found',
                        status: 404,
                        message: 'The page you were looking for could not be found.'
                    });
                    this.db.run('SELECT features.name as name, IFNULL(temp.value, 0) as value, features.display as display, features.type as type, features.id as id FROM features LEFT OUTER JOIN (SELECT * FROM feature_map WHERE feature_map.list = ?) temp ON temp.feature = features.id ORDER BY temp.value DESC, features.display DESC, features.name ASC', [lists[0].id]).then(async (features) => {
                        const validate = FormValidator.validateList(req.params.id, req.body, res.locals.user);
                        let changes = {};
                        let addedFeatures = [];
                        if (validate && validate.length > 0) return res.render('lists/edit', {
                            title: 'Edit ' + lists[0].id,
                            data: lists[0],
                            checkboxes: features,
                            edit: true,
                            hideUncheckedBoxes: false,
                            interactiveCheckboxes: true,
                            errors: validate
                        });
                        try {
                            const columns = await this.db.run('SHOW COLUMNS from lists');
                            for (const column of columns) {
                                if (req.body[column.Field]) {
                                    changes[column.Field] = req.body[column.Field];
                                } else {
                                    changes[column.Field] = null;
                                }
                            }
                            changes['added'] = lists[0].added;
                            await this.db.run('DELETE FROM lists WHERE id = ?', [req.params.id]);
                            await this.db.run('INSERT INTO lists (' + Object.keys(changes).map((c) => c).join(', ') + ') VALUES (' + Object.values(changes).map((c) => this.db.escape(c)).join(', ') + ')');

                            const oldFeatures = await this.db.run('SELECT * FROM feature_map WHERE list = ? AND value = ?', [changes.id, true]);
                            await this.db.run('DELETE FROM feature_map WHERE list = ?' , [req.params.id]);
                            for (let [key, value] of Object.entries(req.body)) {
                                if (key.substring(0, 8) === 'feature_') {
                                    key = key.replace('feature_', '');
                                    value = value === 'on';
                                    await this.db.run('INSERT INTO feature_map (list, feature, value) VALUES (?, ?, ?)', [changes.id, key, value]);
                                    if (value) {
                                        addedFeatures.push(Number(key));
                                    }
                                }
                            }
                            this.client.updateEditLog(lists[0], changes, await Promise.all(addedFeatures.map(async(f) => getListFeature(this.db, Number(f)))), await Promise.all(oldFeatures.map((f) => getListFeature(this.db, Number(f.feature)))));
                            require('../Util/updateListMessage')(this.client, this.db, changes, changes['id']);
                            res.redirect('/lists/' + changes.id)
                        } catch (e) {
                            res.status(500).render('error', {title: 'Database Error'});
                        }
                    });
                });
            } catch {
                res.status(500).render('error', {title: 'Database Error'});
            }
        });

        this.router.get('/:id/icon', this.requiresAuth.bind(this), this.isMod.bind(this), async (req, res) => {
            try {
                const lists = await this.db.run('SELECT * FROM lists WHERE id = ? LIMIT 1', [req.params.id]);
                if (!lists.length) return res.status(404).render('error', {
                    title: 'Page not found',
                    status: 404,
                    message: 'The page you were looking for could not be found.'
                });
                try {
                    await require('../Util/updateIcon')(this.client, this.db, lists[0]);
                    res.render('error', { title: 'Success', status: 200, message: 'Icon has been updated' })
                } catch {
                    res.status(500).render('error', {title: 'Error', status: 400, message: 'Icon has not been updated' });
                }
            } catch (e) {
                res.status(500).render('error', {title: 'Error'});
            }
        });

    }

    get getRouter() {
        return this.router;
    }
}

module.exports = ListsRoute;
