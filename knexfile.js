const config = {...require('./config')};
const client = config.database.client;
delete config.database.client;

module.exports = {
    development: {
        client,
        connection: config.database,
        migrations: {
            tableName: 'migrations',
            directory: './db/migrations'
        },
        seeds: {
            directory: './db/seeds'
        }
    }
};
