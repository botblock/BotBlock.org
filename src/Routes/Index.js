const md = require('markdown-it')();
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
                res.status(500).render('error', {title: 'Database Error'});
            })
        });

        this.router.get('/about', (req, res) => {
            this.db.run('SELECT * FROM about ORDER BY position ASC').then((data) => {
                const insertVars = text => {
                    return text
                        .replace(/{{NAME}}/g, res.__('site_name'))
                        .replace(/{{SHORT_DESC}}/g, res.__('short_desc'))
                        .replace(/{{SLOGAN}}/g, res.__('slogan'))
                };
                const sections = data.map(section => {
                    section.title = insertVars(section.title);
                    section.content = md.render(insertVars(section.content))
                        .replace(/<a href=/g, '<a target="_blank" href=');
                    return section;
                });
                res.render('about', { sections });
            }).catch((e) => {
                res.status(500).render('error', {title: 'Database Error'});
            })
        });

        this.router.get('/discord', (req, res) => {
            res.redirect(301, 'https://discord.gg/npjccFR');
        });

        this.router.get('/patreon', (req, res) => {
            res.redirect(301, 'https://patreon.com/botblock');
        });

        this.router.get('/reddit', (req, res) => {
            res.redirect(301, 'https://reddit.com/r/botblock');
        });

        this.router.get('/twitter', (req, res) => {
            res.redirect(301, 'https://twitter.com/botblockorg');
        });
    }

    get getRouter() {
        return this.router;
    }
}

module.exports = IndexRoute;
