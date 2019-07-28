const fs = require('fs');
const { join } = require('path');
const BaseRoute = require('../Structure/BaseRoute');
const Renderer = require('../Structure/Markdown');

class IndexRoute extends BaseRoute {
    constructor(client, db) {
        super('/');
        this.router = require('express').Router();
        this.client = client;
        this.db = db;
        this.renderer = new Renderer();
        this.routes();
    }

    routes() {
        this.router.get('/', (req, res) => {
            this.db.run('SELECT * FROM lists WHERE discord_only = ? AND display = ? AND defunct = ? ORDER BY RAND() LIMIT 2', [1, 1, 0]).then((lists) => {
                res.render('home', { lists });
            }).catch((e) => {
                res.status(500).render('error', {title: 'Database Error'});
            })
        });

        this.router.get('/about', (req, res) => {
            this.db.run('SELECT * FROM about ORDER BY position ASC').then((data) => {
                const sections = data.map(section => {
                    section.title = this.renderer.variables(section.title);
                    section.content = this.renderer.render(section.content);
                    return section;
                });
                res.render('about', { title: 'About', sections });
            }).catch((e) => {
                res.status(500).render('error', {title: 'Database Error'});
            })
        });

        this.router.get([
            '/invite',
            '/support',
            '/guild',
            '/server',
            '/discord',
            '/contact',
            '/help'
        ], (req, res) => {
            res.redirect(301, 'https://discord.gg/npjccFR');
        });

        this.router.get([
            '/donate',
            '/pledge',
            '/patreon'
        ], (req, res) => {
            res.redirect(301, 'https://patreon.com/botblock');
        });

        this.router.get([
            '/reddit',
            '/subreddit'
        ], (req, res) => {
            res.redirect(301, 'https://reddit.com/r/botblock');
        });

        this.router.get([
            '/twitter',
            '/tweets',
            '/tweet'
        ], (req, res) => {
            res.redirect(301, 'https://twitter.com/botblockorg');
        });

        this.router.get([
            '/badge',
            '/shield'
        ], (req, res) => {
            fs.readFile(join(__dirname, '..', 'Assets/img/icon.svg'), 'utf8', function (err, contents) {
                const logo = Buffer.from(contents).toString('base64');
                res.redirect(301, `https://img.shields.io/badge/-BotBlock.org-blue.svg?colorA=2D3237&colorB=359DC4&style=flat&logoWidth=20&logo=data:image/svg+xml;base64,${logo}`);
            });
        });
    }

    get getRouter() {
        return this.router;
    }
}

module.exports = IndexRoute;
