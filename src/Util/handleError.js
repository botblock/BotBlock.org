const logError = async (db, verb, route, error) => {
    try {
        return await db('errors').insert({ verb, route, error, datetime: Date.now() / 1000 });
    } catch (e) {
        console.error('[Handle Error] Failed to log error. Error: %s\n Error to log:', e, error);
        return null;
    }
};

module.exports = (db, req, res, error, api = false) => {
    logError(db, req.method, req.originalUrl, error).then(() => {
        if (api) {
            res.status(500).json({
                error: true,
                status: 500,
                message: 'An unexpected database error occurred'
            });
        } else {
            res.status(500).render('error', { title: 'Database Error' });
        }
    });
};
