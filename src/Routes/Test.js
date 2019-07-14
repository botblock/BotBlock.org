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
        this.output = null;
        this.done = true;
        this.started = null;
        this.routes();
    }

    // TODO: this all needs to be protected behind auth
    routes() {
        this.router.get('/', (req, res) => {
            res.render('test');
        });

        this.router.get('/start', (req, res) => {
            if (this.started === null) this.started = Date.now();

            res.set('Content-Type', 'text/plain');
            res.send(Buffer.from(this.started.toString()));

            if (this.done !== true) return;

            this.output = [];
            this.done = false;
            const processData = data => {
                const raw = data.toString().replace(/^\n|\n$/g, '').split('\n');
                raw.forEach(line => {
                    ansiHTML.reset();
                    this.output.push(ansiHTML(line));
                });
            };

            const cwd = join(__dirname, '..', '..');
            const child = exec(`"${join('node_modules', '.bin', 'mocha')}"`, {cwd});

            child.stdout.setEncoding('utf8');
            child.stdout.on('data', processData);
            child.stderr.setEncoding('utf8');
            child.stderr.on('data', processData);
            child.on('error', () => { this.done = true; });
            child.on('close', () => { this.done = true; });
        });

        this.router.get('/progress', (req, res) => {
            if (this.output !== null || this.done === true) {
                if (this.output !== null) {
                    res.set('Content-Type', 'text/html');
                    res.send(Buffer.from(this.output.join('\n')));
                    if (this.done === true) {
                        this.output = null;
                    }
                    return;
                }
                res.set('Content-Type', 'text/plain');
                res.send(Buffer.from("end"));
                return;
            }
            res.set('Content-Type', 'text/plain');
            res.send(Buffer.from(""));
        });

    }

    get getRouter() {
        return this.router;
    }
}

module.exports = TestRoute;
