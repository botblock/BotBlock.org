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
        this.output = [];
        this.started = null;
        this.finished = null;
        this.child = null;
        this.routes();
    }

    ts() {
        const since = Date.now() - this.started;
        const d = new Date(since);
        //const h = d.getUTCHours().toString().padStart(2, '0');
        const m = d.getUTCMinutes().toString().padStart(2, '0');
        const s = d.getUTCSeconds().toString().padStart(2, '0');
        const ms = d.getUTCMilliseconds().toString().padStart(3, '0');
        return `[${m}m:${s}s.${ms}ms]`;
    }

    addLine(line) {
        ansiHTML.reset();
        this.output.push(`${this.ts()} ${ansiHTML(line)}`);
    }

    processData(data) {
        const raw = data.toString().replace(/^\n|\n$/g, '').split('\n');
        raw.forEach(this.addLine.bind(this));
    };

    routes() {
        this.router.use(this.requiresAuth.bind(this), this.isMod.bind(this));

        this.router.get('/', (req, res) => {
            res.render('test');
        });

        this.router.get('/restart', (req, res) => {
            if (this.child) this.child.kill();
            this.started = Date.now();
            this.finished = null;
            this.output = [];

            const cwd = join(__dirname, '..', '..');
            this.child = exec(`"${join('node_modules', '.bin', 'mocha')}"`, {cwd});

            this.child.stdout.setEncoding('utf8');
            this.child.stdout.on('data', this.processData.bind(this));
            this.child.stderr.setEncoding('utf8');
            this.child.stderr.on('data', this.processData.bind(this));
            this.child.on('error', () => { this.finished = Date.now(); });
            this.child.on('close', () => { this.finished = Date.now(); });

            res.send({started: this.started});
        });

        this.router.get('/start', (req, res) => {
            if (this.started !== null) {
                res.send({started: this.started});
                return;
            }
            res.redirect('/test/restart');
        });

        this.router.get('/progress', (req, res) => {
            res.send({started: this.started, finished: this.finished, data: this.output.join('\n')});
        });

    }

    get getRouter() {
        return this.router;
    }
}

module.exports = TestRoute;
