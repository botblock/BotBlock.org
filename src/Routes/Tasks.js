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
        this.router.use(this.requiresAuth.bind(this), this.isMod.bind(this));

        this.router.get('/', (req, res) => {
            const tasks = this.jobs.map((job, idx) => {
                return {
                    id: idx,
                    name: job.name,
                    nextInvocation: job.nextInvocation()
                }
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
                this.jobs[req.params.id].job();
            } catch(e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).json({
                    error: true,
                    status: 500,
                    message: 'An unexpected error occurred'
                });
            }
            res.status(200).json({});
        });

    }

    get getRouter() {
        return this.router;
    }
}

module.exports = TasksRoute;
