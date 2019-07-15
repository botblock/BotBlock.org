const BaseRoute = require('../Structure/BaseRoute');

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
                this.db.run('SELECT COUNT(id) as count FROM lists WHERE defunct = 1 AND display = 1').then((defunct) => {
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
                            title: 'All Lists',
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
    }

    get getRouter() {
        return this.router;
    }
}

module.exports = ListsRoute;
