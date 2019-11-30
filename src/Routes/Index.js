const fs = require('fs');
const { join } = require('path');
const BaseRoute = require('../Structure/BaseRoute');
const Renderer = require('../Structure/Markdown');
const shuffle = require('../Util/shuffle');
const handleError = require('../Util/handleError');
const sitemap = require('../Util/sitemap');

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
            this.db.select().from('lists').where({
                discord_only: true,
                display: true,
                defunct: false
            }).then(lists => {
                lists = shuffle(lists).slice(0, 2);
                res.render('home', { lists });
            }).catch((e) => {
                handleError(this.db, req, res, e.stack);
            });
        });

        this.router.get('/about', (req, res) => {
            this.db.select().from('about').orderBy('position', 'asc').then((data) => {
                const sections = data.map(section => {
                    section.title = this.renderer.variables(section.title);
                    section.content = this.renderer.render(section.content);
                    return section;
                });
                res.render('about', { title: 'About', sections });
            }).catch((e) => {
                handleError(this.db, req, res, e.stack);
            });
        });

        this.router.get('/sitemap', (req, res) => {
            sitemap.get(this.db).then(data => {
                sitemap.save(data).then(() => {
                    res.render('sitemap', { title: 'Sitemap', data });
                });
            }).catch((e) => {
                handleError(this.db, req, res, e.stack);
            });
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
