const BaseRoute = require('../Structure/BaseRoute');
const handleError = require('../Util/handleError');

class TasksRoute extends BaseRoute {
    constructor(client, db, jobs) {
        super('/tasks');
        this.router = require('express').Router();
        this.client = client;
        this.db = db;
        this.jobs = jobs;
        this.routes();
    }

    routes() {
        this.router.get('/', this.requiresAuth.bind(this), this.isMod.bind(this), (req, res) => {
            const tasks = this.jobs.map((job, idx) => {
                const locale = req.locale.replace('_', '-');
                return {
                    id: idx,
                    name: job.schedule.name,
                    interval: job.interval,
                    lastRun: job.lastRun ? job.lastRun.toLocaleString(locale) : 'N/A',
                    nextRun: job.schedule.nextInvocation().toDate().toLocaleString(locale),
                    lastStatus: job.lastRunSucceeded === null ? 'N/A' : job.lastRunSucceeded ? 'Successful' : 'Failed',
                    statusClass: job.lastRunSucceeded === null ? '' : job.lastRunSucceeded ? 'has-text-success' : 'has-text-danger'
                };
            });
            res.render('tasks', { tasks });
        });

        this.router.post('/run/:id', this.requiresAuth.bind(this), this.isAdmin.bind(this), (req, res) => {
            if (!this.jobs[req.params.id]) return res.status(404).render('error', {
                title: 'Page not found',
                status: 404,
                message: 'The page you were looking for could not be found.'
            });
            try {
                this.jobs[req.params.id].execute().then(() => res.status(200).json({}));
            } catch (e) {
                handleError(this.db, req, res, e.stack);
            }
        });

    }

    get getRouter() {
        return this.router;
    }
}

module.exports = TasksRoute;
