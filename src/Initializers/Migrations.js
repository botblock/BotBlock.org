class Migrations {
    constructor(client, db) {
        this.client = client;
        this.db = db;
        this.position = 1;
    }

    execute() {
        return new Promise((resolve, reject) => {
            this.db.migrate.list().then(data => {
                if (data && data.length > 1 && data[1].length > 0) {
                    return reject('[Database] Pending migrations need to be run before website can start.');
                }
                resolve();
            });
        });
    }
}

module.exports = Migrations;
