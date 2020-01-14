const BaseJob = require('../Structure/BaseJob');
const axios = require('axios');

class BestPracticesUpdater extends BaseJob {
    constructor(client, db) {
        super('@daily');
        this.client = client;
        this.db = db;
    }

    jobFunc() {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const data = await axios.get('https://raw.githubusercontent.com/botblock/discord-botlist-best-practices/master/README.md');
                const bestPractices = await this.db.select().from('kv_cache').where({ key: 'list_best_practices' });
                if (bestPractices.length) {
                    await this.db.select().from('kv_cache').where({ key: 'list_best_practices' }).update({ value: data.data });
                } else {
                    await this.db('kv_cache').insert({ key: 'list_best_practices', value: data.data, datetime: Date.now() / 1000 });
                }
                resolve();
            } catch (e) {
                console.error(e);
                reject('Failed to update best practice, error has been logged.');
            }
        });
    }
}

module.exports = BestPracticesUpdater;
