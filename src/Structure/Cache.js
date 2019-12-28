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
     * @param route
     * @param expiry
     * @param data
     * @return {Promise<null|*>}
     */
    async add(route, expiry, data) {
        try {
            return await this.db('cache').insert({
                route,
                expiry: (Date.now() + expiry) / 1000,
                data: JSON.stringify(data)
            });
        } catch {
            return null;
        }
    }

    async deleteExpired() {
        try {
            return await this.db('cache').where('expiry', '<', new Date().getSeconds()).del();
        } catch {
            return null;
        }
    }

    handler() {
        return async (req, res, next) => {
            await this.deleteExpired();
            const cache = await this.get(req.originalUrl);
            if (cache) return res.status(200).json({ ...JSON.parse(cache.data), cached: true });
            next();
        }
    }
}

module.exports = Cache;
