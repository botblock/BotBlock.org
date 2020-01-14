class Logger {
    constructor(db) {
        this.db = db;
    }

    async purge() {
        await this.db('requests')
            .where('datetime', '<', Date.now() / 1000 - 24 * 3600)
            .del();
    }

    json(data) {
        return JSON.stringify(data, null, 2);
    }

    async store(req, res, body) {
        try {
            return await this.db('requests').insert({
                ip: req.ip,
                verb: req.method,
                route: req.originalUrl,
                req_headers: this.json(req.headers),
                req_body: this.json(req.body),
                res_headers: this.json(res.getHeaders()),
                res_body: body,
                datetime: Date.now() / 1000
            });
        } catch (e) {
            console.error('[Logger Error] Failed to log request. Error: ', e);
            return null;
        }
    }

    async log(req, res, next) {
        const defaultWrite = res.write;
        const defaultEnd = res.end;
        const chunks = [];

        await this.purge();
        const store = this.store.bind(this);

        res.write = (...restArgs) => {
            chunks.push(Buffer.from(restArgs[0]));
            defaultWrite.apply(res, restArgs);
        };

        // Nothing else will touch res.end so this won't be a race condition ever
        // eslint-disable-next-line require-atomic-updates
        res.end = async (...restArgs) => {
            if (restArgs[0]) chunks.push(Buffer.from(restArgs[0]));
            const body = Buffer.concat(chunks).toString('utf8');
            await store(req, res, body);
            defaultEnd.apply(res, restArgs);
        };

        next();
    }

    logger() {
        return this.log.bind(this);
    }
}

module.exports = Logger;
