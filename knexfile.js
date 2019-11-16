const config = require('./config');

module.exports = {
    development: {
        client: config.database.client,
        connection: config.database,
        migrations: {
            tableName: 'migrations',
            directory: './db/migrations'
        },
        seeds: {
            directory: './db/seeds'
        }
    },
    seedExport: {
        client: config.seedDatabase.client,
        connection: config.seedDatabase
    }
};
