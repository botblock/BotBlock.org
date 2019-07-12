const BaseRoute = require('../Structure/BaseRoute');

class ListsRoute extends BaseRoute {
    constructor(client, db) {
        super('/lists');
        this.router = require('express').Router();
        this.client = client;
        this.db = db;
        this.routes();
    }

    routes() {
        this.router.get('/', (req, res) => {
            this.db.run('SELECT * FROM lists WHERE defunct = ? AND display = ? ORDER BY discord_only DESC, LOWER(name) ASC', [0, 1]).then((lists) => {
                res.render('lists/lists', { title: 'All Lists', lists });
            }).catch(() => {
                res.status(500).render('error', { title: 'Database Error' });
            })
        });

        this.router.get('/new', (req, res) => {
            this.db.run('SELECT * FROM lists WHERE defunct = ? AND display = ? ORDER BY added DESC LIMIT 4', [0, 1]).then((lists) => {
                res.render('lists/newlists', { title: 'New Lists', lists });
            }).catch(() => {
                res.status(500).render('error', { title: 'Database Error' });
            })
        })
    }

    get getRouter() {
        return this.router;
    }
}

module.exports = ListsRoute;
