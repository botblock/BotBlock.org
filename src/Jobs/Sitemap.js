const BaseJob = require('../Structure/BaseJob');
const { get, save } = require('../Util/sitemap');

class SitemapUpdater extends BaseJob {
    constructor(client, db) {
        super('*/30 * * * *');
        this.client = client;
        this.db = db;
    }

    jobFunc() {
        return new Promise((resolve, reject) => {
            get(this.db)
                .then(sitemap => {
                    save(sitemap)
                        .then(() => resolve())
                        .catch(e => {
                            console.log(e);
                            reject('[Sitemap] Error while saving sitemap');
                        });
                })
                .catch(e => {
                    console.log(e);
                    reject('[Sitemap] Error while fetching sitemap');
                });
        });
    }
}

module.exports = SitemapUpdater;
