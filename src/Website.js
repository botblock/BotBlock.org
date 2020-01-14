const Discord = require('./Structure/Discord/Client');
const express = require('express');
const http = require('http');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const i18n = require('./Util/i18n');
const schedule = require('node-schedule');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const Logger = require('./Middleware/Logger');

class Website {
    constructor(options) {
        this.db = options.db;
        this.client = new Discord(config.discord.token);
        this.jobs = [];
        this.initializers = [];
        this.app = express();
    }

    async start() {
        this.app.enable('trust proxy');
        this.app.set('view engine', 'pug');
        this.app.set('views', path.join(__dirname, 'Dynamic'));
        this.app.set('json spaces', 4);
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(i18n.init);
        this.app.use(cookieParser(config.secret));
        this.app.use(cookieSession({
            name: 'session',
            secret: config.secret,
            maxAge: 6.048e+8,
            expires: Date.now() + 6.048e+8
        }));
        this.app.use(express.static(path.join(__dirname, 'Public')));
        this.app.use('/assets', express.static(path.join(__dirname, 'Assets')));
        this.app.use('/codemirror', express.static(path.join(__dirname, '..', 'node_modules', 'codemirror')));
        this.app.use((req, res, next) => {
            // Test suite logic
            res.locals.adblock = req.headers['x-disable-adsense'] === config.secret;
            if (req.headers['x-auth-as-user'] === config.secret ||
                req.headers['x-auth-as-admin'] === config.secret ||
                req.headers['x-auth-as-mod'] === config.secret) {
                req.session.user = {
                    id: '123456789012345678',
                    username: 'User',
                    avatar: '',
                    discriminator: '1234',
                    locale: 'en-US',
                    mfa_enabled: false,
                    flags: 0,
                    access_token: '',
                    expires_in: 604800,
                    refresh_token: '',
                    scope: 'identify',
                    token_type: 'Bearer',
                    admin: false,
                    mod: false
                };
                if (req.headers['x-auth-as-mod'] || req.headers['x-auth-as-admin']) req.session.user.mod = true;
                if (req.headers['x-auth-as-admin']) req.session.user.admin = true;
            }
            if (req.headers['x-auth-as-anon'] === config.secret) req.session.user = undefined;

            // App locals
            const host = req.get('host');
            res.locals.route = req.connection.encrypted ? 'https://' : 'http://' + host + req.path;
            res.locals.isProduction = host.toLowerCase().trim() === 'botblock.org';
            res.locals.isStaging = host.toLowerCase().trim() === 'staging.botblock.org';
            res.locals.isDevelopment = !res.locals.isProduction && !res.locals.isStaging;
            res.locals.language = req.cookies.lang;
            res.locals.breadcrumb = req.path.split('/').splice(1, 3, null);
            res.locals.user = req.session.user;
            res.cookie('url', req.path.startsWith('/auth') ? '/' : req.path);
            console.log('[' + req.method + '] ' + req.path + ' (' + req.ip + ')');
            next();
        });
        const logger = new Logger(this.db);
        this.app.use(logger.logger());
        await this.loadRoutes(path.join(__dirname, 'Routes'));
        await this.loadJobs(path.join(__dirname, 'Jobs'));
        await this.loadInitializers(path.join(__dirname, 'Initializers'));
        this.app.use(require('express-minify')());
        this.app.use((req, res) => {
            res.status(404).render('error', {
                title: 'Page not found',
                status: 404,
                message: 'The page you were looking for could not be found.'
            });
        });
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
                        const route = new Route(this.client, this.db, this.jobs);
                        this.app.use(route.route, route.getRouter);
                    } catch (e) {
                        console.error('[Route Loader] Failed loading ' + routes[i] + ' - ', e);
                    } finally {
                        if (i + 1 === routes.length) {
                            // eslint-disable-next-line no-unused-vars
                            this.app.use((err, req, res, _) => {
                                if (req.method === 'POST') {
                                    try {
                                        JSON.parse(req.body);
                                    } catch {
                                        return res.status(400).json({
                                            error: true,
                                            status: 400,
                                            message: 'Body is not parsable JSON'
                                        });
                                    }
                                }
                                console.error('[API] Internal Server Error: ', err);
                                res.status(500).json({ error: true, status: 500, message: 'Internal Server Error' });
                            });
                            resolve();
                        }
                    }
                }
            });
        });
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
                        job.schedule = schedule.scheduleJob(path.basename(jobs[i], '.js'), job.interval, () => {
                            job.execute();
                        });
                        this.jobs.push(job);
                    } catch (e) {
                        console.error('[Job Loader] Failed loading ' + jobs[i] + ' - ', e);
                    } finally {
                        if (i + 1 === jobs.length) {
                            resolve();
                        }
                    }
                }
            });
        });
    }

    loadInitializers(dir) {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, async (error, initializers) => {
                if (error) return reject(error);
                if (!initializers.length) return resolve();
                for (const i of initializers) {
                    if (!i.endsWith('.js')) continue;
                    try {
                        const Initializer = require(path.join(dir, i));
                        const initializer = new Initializer(this, this.db);
                        this.initializers.push(initializer);
                    } catch (e) {
                        console.error('[Initializer] Error while initializing', e);
                    }
                }
                this.initializers = this.initializers.sort((a, b) => a.position - b.position);
                for (const initializer of this.initializers) {
                    try {
                        await initializer.execute();
                    } catch (e) {
                        return console.error(e);
                    }
                }
                resolve();
            });
        });
    }

    launch() {
        http.createServer(this.app).listen(process.env.PORT || config.port, () => {
            console.log('[Website] Website is listening on port: ' + (process.env.PORT || config.port));
        });
    }
}

module.exports = Website;
