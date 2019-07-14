const BaseRoute = require('../Structure/BaseRoute');
const ansiHTML = require('ansi-html');
const {exec} = require('child_process');
const {join} = require('path');

ansiHTML.setColors({
    reset: ['fff', '000']
});

class TestRoute extends BaseRoute {
    constructor(client, db) {
        super('/test');
        this.router = require('express').Router();
        this.client = client;
        this.db = db;
        this.routes();
    }

    routes() {
        this.router.get('/', (req, res) => {
            res.render('test');
        });

        this.router.get('/run', (req, res) => {
            exec('mocha', {cwd: join(__dirname, '..', '..')}, (error, stdout, stderr) => {
                res.set('Content-Type', 'text/html');
                res.send(Buffer.from(ansiHTML(stderr || stdout)));
            });
        });

    }

    get getRouter() {
        return this.router;
    }
}

module.exports = TestRoute;
