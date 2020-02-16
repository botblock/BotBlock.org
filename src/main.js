const Website = require('./Website');
const db = require('../db/db');

return new Promise(() => {
    try {
        const knex = db();
        console.log('[Database] Successfully connected to MySQL database.');
        new Website({
            db: knex
        }).start();
    } catch (e) {
        console.error('[Website] Failed to start Website.', e);
    }
});
