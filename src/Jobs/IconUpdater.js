const BaseJob = require('../Structure/BaseJob');
const updateIcon = require('../Util/updateIcon');

class IconUpdater extends BaseJob {
    constructor(client, db) {
        super('@daily');
        this.client = client;
        this.db = db;
    }

    updateLists(lists) {
        return Promise.all(lists.map(list => {
            return updateIcon(this.client, this.db, list)
                .then(console.log).catch(console.log);
        }));
    }

    jobFunc() {
        return new Promise((resolve, reject) => {
            this.db.select().from('lists').where({ display: true, defunct: false })
                .then(lists => {
                    this.updateLists(lists).then(resolve).catch(reject);
                })
                .catch(e => {
                    console.log(e);
                    reject('[Database] Error while updating icons');
                });
        });
    }
}

module.exports = IconUpdater;
