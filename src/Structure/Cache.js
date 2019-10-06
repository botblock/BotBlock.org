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
        } catch (e) {
            return null;
        }
    }

    delete() {

    }

    async deleteExpired() {
        try {
            return await this.db('cache').where('expiry', '<', new Date().getSeconds()).del();
        } catch {
            return null;
        }
    }


    getAll() {

    }
}

module.exports = Cache;
