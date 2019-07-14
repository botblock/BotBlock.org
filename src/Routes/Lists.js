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
            this.db.run('SELECT discord_only FROM lists WHERE defunct = ? AND display = ?', [0, 1]).then((active) => {
                this.db.run('SELECT COUNT(id) as count FROM lists WHERE defunct = ? AND display = ?', [1, 1]).then((defunct) => {
                    const discordOnly = active.filter(list => list.discord_only);
                    resolve({active: active.length, discordOnly: discordOnly.length, defunct: defunct[0].count});
                }).catch(reject);
            }).catch(reject);
        });
    }

    routes() {
        this.router.get('/', (req, res) => {
            try {
                this.db.run('SELECT * FROM lists WHERE defunct = ? AND display = ? ORDER BY discord_only DESC, LOWER(name) ASC', [0, 1]).then((lists) => {
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
                this.db.run('SELECT * FROM lists WHERE defunct = ? AND display = ? ORDER BY added DESC LIMIT 4', [0, 1]).then((lists) => {
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
                this.db.run('SELECT * FROM lists WHERE defunct = ? ORDER BY discord_only DESC, LOWER(name) ASC', [1, 1]).then((lists) => {
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

        this.router.get('/:id', (req, res) => {
            this.db.run('SELECT * FROM lists WHERE id = ? LIMIT 1', [req.params.id]).then((lists) => {
                if (!lists.length) return res.status(404).render('error', {
                    title: 'Page not found',
                    status: 400,
                    message: 'The page you were looking for could not be found.'
                });
                this.db.run('SELECT features.name as name, IFNULL(temp.value, 0) as value, features.display as display, features.type as type, features.id as id FROM features LEFT OUTER JOIN (SELECT * FROM feature_map WHERE feature_map.list = ?) temp ON temp.feature = features.id ORDER BY temp.value DESC, features.display DESC, features.name ASC', [lists[0].id]).then((features) => {
                    res.render('lists/list', {title: 'All Lists', list: lists[0], features: features[0]});
                }).catch((e) => {
                    res.status(500).render('error', {title: 'Database Error'});
                })
            }).catch(() => {
                res.status(500).render('error', {title: 'Database Error'});
            })
        });
    }

    get getRouter() {
        return this.router;
    }
}

module.exports = ListsRoute;
