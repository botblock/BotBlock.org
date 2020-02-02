class UpdateBestPractices {
    constructor(client, db) {
        this.client = client;
        this.db = db;
    }

    execute() {
        return new Promise((resolve) => {
            const job = this.client.jobs.find((job) => job.schedule.name === 'BestPracticesUpdater');
            if (!job) return resolve();
            job.execute().then(() => {
                resolve();
            });
        });
    }
}

module.exports = UpdateBestPractices;
