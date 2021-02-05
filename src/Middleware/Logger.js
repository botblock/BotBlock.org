class Logger {
    constructor(db) {
        this.db = db;
        this.storeResponseBody = false;
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

        const store = this.store.bind(this);

        // Capture the response data as it gets sent, if we need to store it
        if (this.storeResponseBody) {
            res.write = (...restArgs) => {
                // Handle as normal first
                defaultWrite.apply(res, restArgs);

                // Store in mem to log to db
                chunks.push(Buffer.from(restArgs[0]));
            };
        }

        // Nothing else will touch res.end so this won't be a race condition ever
        // eslint-disable-next-line require-atomic-updates
        res.end = (...restArgs) => {
            // Handle as normal first
            defaultEnd.apply(res, restArgs);

            // Get the response body if we need it, store in the DB
            if (this.storeResponseBody) {
                if (restArgs[0]) chunks.push(Buffer.from(restArgs[0]));
                const body = Buffer.concat(chunks).toString('utf8');
                store(req, res, body).then(() => {}).catch(() => {});
                return;
            }

            // Don't need to store body, just store request
            store(req, res, null).then(() => {}).catch(() => {});
        };

        next();
    }

    logger() {
        return this.log.bind(this);
    }
}

module.exports = Logger;
