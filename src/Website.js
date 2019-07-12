const Discord = require('./Structure/Discord/Client');
const express = require('express');
const http = require('http');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const i18n = require('i18n');
const schedule = require('node-schedule');
const fs = require('fs');
const path = require('path');
const config = require('./config');

class Website {
    constructor(options) {
        this.db = options.db;
        this.client = new Discord(config.discord.token);
        this.app =  express();
    }

    async start() {
        this.app.set('view engine', 'pug');
        this.app.set('views', path.join(__dirname, 'Dynamic'));
        i18n.configure({
            cookie: 'lang',
            defaultLocale: 'en_US',
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
            res.locals.route = req.connection.encrypted ? 'https://' : 'http://' + req.get('host') + req.path;
            res.locals.language = req.cookies.lang;
            res.locals.breadcrumb = req.path.split('/').splice(1, 3, null);
            next();
        });
        await this.loadRoutes(path.join(__dirname, 'Routes'));
        await this.loadJobs(path.join(__dirname, 'Jobs'));
        this.app.use(require('express-minify')());
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
                        const route = new Route(this.client, this.db);
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

    loadJobs(dir) {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (error, jobs) => {
                if (error) return reject(error);
                if (jobs.length === 0) return resolve();
                for (let i = 0; i < jobs.length; i++) {
                    if (!jobs[i].endsWith('.js')) continue;
                    try {
                        const Job = require(path.join(dir, jobs[i]));
                        const job = new Job(this.client, this.db);
                        schedule.scheduleJob(job.interval, () => {
                            job.execute();
                        })
                    } catch (e) {
                        console.error('[Job Loader] Failed loading ' + jobs[i] + ' - ', e);
                    } finally {
                        if (i + 1 === jobs.length) {
                            resolve();
                        }
                    }
                }
            })
        })
    }

    launch() {
        this.app.use((req, res) => res.render('error', { title: 'Page not found', status: 404, message: 'The page you were looking for could not be found.' }));
        this.app.use((err, req, res) => {
            console.error('[Internal Server Error] Error', err);
            res.render('error', { title: 'Internal Server Error', status: 500, message: 'Internal Server Error' })
        });
        http.createServer(this.app).listen(process.env.PORT || config.port, () => {
            console.log('[Website] Website is listening on port: ' + (process.env.PORT || config.port));
        });
    }
}

module.exports = Website;
