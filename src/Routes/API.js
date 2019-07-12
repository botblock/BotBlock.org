const BaseRoute = require('../Structure/BaseRoute');

class APIRoute extends BaseRoute {
    constructor(client, db) {
        super('/api');
        this.router = require('express').Router();
        this.client = client;
        this.db = db;
        this.routes();
    }

    routes() {
        this.router.get('/', (req, res) => {
            res.sendStatus(200)
        })
    }

    get getRouter() {
        return this.router;
    }
}

module.exports = APIRoute;
