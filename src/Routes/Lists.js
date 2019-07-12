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
        });

        this.router.get('/:id', (req, res) => {
            this.db.run('SELECT * FROM lists WHERE id = ? LIMIT 1', [req.params.id]).then((lists) => {
                if (!lists.length) return res.status(404).render('error', { title: 'Page not found', status: 400, message: 'The page you were looking for could not be found.' });
                res.render('lists/list', { title: 'All Lists', list: lists[0] });
            }).catch((e) => {
                res.status(500).render('error', { title: 'Database Error' });
            })
        });
    }

    get getRouter() {
        return this.router;
    }
}

module.exports = ListsRoute;
