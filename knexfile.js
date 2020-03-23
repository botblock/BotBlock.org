const path = require('path');
const config = require('./config');

module.exports = {
    development: {
        client: config.database.client,
        connection: config.database,
        migrations: {
            tableName: 'migrations',
            directory: path.join(__dirname, 'db', 'migrations')
        },
        seeds: {
            directory: path.join(__dirname, 'db', 'seeds')
        },
        pool: {
            createRetryIntervalMillis: 100,
            propagateCreateError: false
        }
    },
    seedExport: {
        client: config.seedDatabase.client,
        connection: config.seedDatabase
    }
};
