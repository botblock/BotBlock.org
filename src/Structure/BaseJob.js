const schedule = require('node-schedule');

class BaseJob {
    constructor(interval) {
        this.interval = interval;
        this.schedule = schedule;
        this.lastRun = null;
        this.lastRunSucceeded = null;
    }

    jobFunc() {
        throw 'jobFunc not defined';
    }

    execute() {
        this.lastRun = new Date();
        this.jobFunc().then(() => {
            console.log('[Job] Execution successful');
            this.lastRunSucceeded = true;
        }).catch((e) => {
            console.log('[Job] Error while executing:', e);
            this.lastRunSucceeded = false;
        });
    }
}

module.exports = BaseJob;
