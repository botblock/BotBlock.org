const BaseRoute = require('../Structure/BaseRoute');

class IndexRoute extends BaseRoute {
    constructor(db) {
        super('/');
        this.router = require('express').Router();
        this.db = db;
        this.routes();
    }

    routes() {
        this.router.get('/', (req, res) => {
            res.render('home')
        })

        this.router.get('/lists/all/test', (req, res) => {
            res.render('home')
        })
    }

    get getRouter() {
        return this.router;
    }
}

module.exports = IndexRoute;
