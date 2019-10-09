module.exports = (db, verb, route, error, api = false) => {
    try {
        return db('errors').insert({ verb, route, error, datetime: Date.now() / 1000 });
    } catch (e) {
        console.error('[Handle Error] Failed to log error. Error: %s\n Error to log:', e, error);
        return null;
    }
};
