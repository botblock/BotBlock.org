const express = require('express');
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
        await this.loadRoutes(path.join(__dirname, 'Routes'));
        this.app.use(express.static(path.join(__dirname, 'Static')));
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
        })
    }
}

module.exports = Website;
