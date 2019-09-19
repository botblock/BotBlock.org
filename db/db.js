const databaseConfig = require('../database');
const databaseConnection = databaseConfig[databaseConfig.defaultEnv];

const db = require('knex')({
    client: databaseConnection.driver,
    connection: {
        host: databaseConnection.host,
        user: databaseConnection.user,
        password: databaseConnection.password,
        database: databaseConnection.database
    }
});
