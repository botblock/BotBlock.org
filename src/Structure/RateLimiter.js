class RateLimiter {
    constructor(db) {
        this.db = db;
    }

    checkRatelimit(requestLimit = 1, timeLimit = 1, bot = '') {
        return async (req, res, next) => {
            try {
                await this.db.run('DELETE FROM ratelimit WHERE ip = ? AND bot_id = ? AND route = ? AND expiry > ?', [req.ip, bot, req.originalUrl, Date.now()]);
                const recent = await this.db.run('SELECT * FROM ratelimit WHERE ip = ? AND bot_id = ? AND route = ? ORDER BY datetime DESC', [req.ip, bot, req.originalUrl]);
                console.log(recent)
                if (recent && recent.length >= requestLimit) {
                    console.log(1)
                    const lastRequest = recent[0].datetime;
                    const expiry = recent[0].expiry;
                    res.set('Retry-After', expiry);
                    res.set('X-Rate-Limit-Reset', expiry);
                    res.set('X-Rate-Limit-IP', req.ip);
                    res.set('X-Rate-Limit-Route', req.originalUrl);
                    res.set('X-Rate-Limit-Bot-ID', bot);
                    return res.status(429).json({
                        error: true,
                        status: 429,
                        retry_after: expiry,
                        ratelimit_reset: expiry,
                        ratelimit_ip: req.ip,
                        ratelimit_route: req.originalUrl,
                        ratelimit_bot_id: bot
                    });
                }
                await this.db.run('INSERT INTO ratelimit (ip, bot_id, route, datetime, expiry) VALUES (?, ?, ?, ?, ?)', [req.ip, bot, req.originalUrl, Date.now(), Date.now() + timeLimit * 1000]);
                next();
            } catch (_) {
                res.status(500).json({ error: true, status: 500, message: 'An unexpected error occurred' });
            }
        }
    }
}

module.exports = RateLimiter;
