const BaseRoute = require('../Structure/BaseRoute');

class IndexRoute extends BaseRoute {
    constructor(client, db) {
        super('/');
        this.router = require('express').Router();
        this.client = client;
        this.db = db;
        this.routes();
    }

    routes() {
        this.router.get('/', (req, res) => {
            this.db.run('SELECT * FROM lists WHERE discord_only = ? AND display = ? AND defunct = ? ORDER BY RAND() LIMIT 2', [1, 1, 0]).then((lists) => {
                res.render('home', { lists });
            }).catch((e) => {
                res.sendStatus(400)
            })
        })
    }

    get getRouter() {
        return this.router;
    }
}

module.exports = IndexRoute;
