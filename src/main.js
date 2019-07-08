const config = require('./config');
const Website = require('./Website');
const Database = require('./Structure/Database');

return new Promise(async () => {
    const db = new Database(config.database);
    try {
        await db.connect();
        console.log('[Database] Successfully connected to MySQL database.');
        new Website({
            db: db.db
        }).start();
    } catch (e) {
        console.error('[Website] Failed to start Website.', e);
    }
})
