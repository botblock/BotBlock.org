class Cache {
    constructor(db) {
        this.db = db;
    }

    async get(path) {
        try {
            return (await this.db.select().from('cache').where({ route: path }))[0];
        } catch {
            return null;
        }
    }

    /**
     * Insert data into cache.
     * @param {string} route - Route that is being cached
     * @param {number} expiry - Seconds until cache expires
     * @param {*} data - Data to be cached for the response
     * @return {Promise<null|*>}
     */
    async add(route, expiry, data) {
        try {
            return await this.db('cache').insert({
                route,
                expiry: (Date.now() / 1000) + expiry,
                data: JSON.stringify(data)
            });
        } catch {
            return null;
        }
    }

    async deleteExpired() {
        try {
            return await this.db('cache').where('expiry', '<', Date.now() / 1000).del();
        } catch {
            return null;
        }
    }

    handler() {
        return async (req, res, next) => {
            await this.deleteExpired();
            const cache = await this.get(req.originalUrl);
            if (cache) return res.status(200).json({
                ...JSON.parse(cache.data),
                cached: true,
                cache_expires_at: cache.expiry,
                cache_expires_in: cache.expiry - (Date.now() / 1000),
            });
            next();
        }
    }
}

module.exports = Cache;
