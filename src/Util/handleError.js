module.exports = (db, verb, route, error) => {
    try {
        return db.run('INSERT INTO errors (verb, route, error, datetime) VALUES (?, ?, ?, ?)', [verb, route, error, Date.now() / 1000]);
    } catch (e) {
        console.error('[Handle Error] Failed to log error. Error: %s\n Error to log:', e, error);
        return null;
    }
}
