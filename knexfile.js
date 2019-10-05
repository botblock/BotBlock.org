const config = require('./config');

module.exports = {
    development: {
        client: config.database.client,
        connection: {
            host: config.database.host,
            database: config.database.database,
            user: config.database.user,
            password: config.database.password
        },
        migrations: {
            tableName: 'migrations',
            directory: './db/migrations'
        },
        seeds: {
            directory: './db/seeds'
        }
    }
};
