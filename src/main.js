const Website = require('./Website');
const db = require('../db/db');

return new Promise(() => {
    try {
        const knex = db();
        console.log('[Database] Successfully connected to MySQL database.');
        knex.migrate.list().then(data => {
            if (data && data.length > 1 && data[1].length > 0)
                return console.log('[Database] Pending migrations need to be run before website can start.');

            new Website({
                db: knex
            }).start();
        });
    } catch (e) {
        console.error('[Website] Failed to start Website.', e);
    }
});
