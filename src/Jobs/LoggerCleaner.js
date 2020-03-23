const BaseJob = require('../Structure/BaseJob');

class LoggerCleaner extends BaseJob {
    constructor(client, db) {
        super('*/5 * * * *');
        this.client = client;
        this.db = db;
    }

    jobFunc() {
        return new Promise((resolve, reject) => {
            this.db('requests')
                .where('datetime', '<', Date.now() / 1000 - 12 * 3600)
                .del()
                .then(() => resolve())
                .catch(e => {
                    console.log(e);
                    reject('[LoggerCleaner] Error while cleaning old logged requests');
                });
        });
    }
}

module.exports = LoggerCleaner;
