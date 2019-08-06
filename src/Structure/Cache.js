class Cache {
    constructor(db) {
        this.db = db;
    }

    async get(path) {
        try {
            return (await this.db.run('SELECT * FROM cache WHERE route = ?', [path]))[0];
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
            return await this.db.run('INSERT INTO cache (route, expiry, data) VALUES (?, ?, ?)', [route, (Date.now() + expiry) / 1000, JSON.stringify(data)]);
        } catch (e) {
            return null;
        }
    }

    delete() {

    }

    async deleteExpired() {
        try {
            return await this.db.run('DELETE FROM cache WHERE expiry < ?', [new Date().getSeconds()])
        } catch {
            return null;
        }
    }


    getAll() {

    }
}

module.exports = Cache;
