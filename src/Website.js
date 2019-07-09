const express = require('express');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const i18n = require('i18n');
const fs = require('fs');
const path = require('path');
const config = require('./config');

class Website {
    constructor(options) {
        this.db = options.db;
        this.app =  express();
    }

    async start() {
        this.app.set('view engine', 'pug');
        this.app.set('views', path.join(__dirname, 'Dynamic'));
        i18n.configure({
            cookie: 'lang',
            defaultLocale: 'en-US',
            autoReload: true,
            updateFiles: true,
            directory: path.join(__dirname, '..', 'locales')
        });
        this.app.use(i18n.init);
        this.app.use(cookieParser(config.secret));
        this.app.use(cookieSession({
            name: 'session',
            secret: config.secret,
            maxAge: 6.048e+8,
            expires: Date.now() + 6.048e+8
        }));
        this.app.use((req, res, next) => {
            res.locals.baseURL = req.connection.encrypted ? 'https://' : 'http://' + req.get('host');
            res.locals.route = req.connection.encrypted ? 'https://' : 'http://' + req.get('host') + req.path;
            res.locals.language = req.cookies.lang;
            next();
        });
        await this.loadRoutes(path.join(__dirname, 'Routes'));
        this.app.use('/assets', express.static(path.join(__dirname, 'Assets')));
        this.launch();
    }

    loadRoutes(dir) {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (error, routes) => {
                if (error) return reject(error);
                if (routes.length === 0) return resolve();
                for (let i = 0; i < routes.length; i++) {
                    if (!routes[i].endsWith('.js')) continue;
                    try {
                        const Route = require(path.join(dir, routes[i]));
                        const route = new Route(this.db);
                        this.app.use(route.route, route.getRouter);
                    } catch (e) {
                        console.error('[Route Loader] Failed loading ' + routes[i] + ' - ', e);
                    } finally {
                        if (i + 1 === routes.length) {
                            resolve();
                        }
                    }
                }
            })
        })
    }

    launch() {
        this.app.listen(config.port, () => {
            console.log('[Website] Website is listening on port: '+ config.port);
        });
    }
}

module.exports = Website;
