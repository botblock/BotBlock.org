const { secret } = require('../../config.js');
const isSnowflake = require('../Util/isSnowflake');

class RateLimiter {
    constructor(db) {
        this.db = db;
    }

    checkRatelimit(requestLimit = 1, timeLimit = 1, bot = '') {
        // Remember: Ratelimiting uses milliseconds internally, but timeLimit is in seconds
        return async (req, res, next) => {
            await this.db('ratelimit')
                .where('expiry', '<', Date.now())
                .del();

            // Test suite ratelimit bypass
            const ratelimitBypass = req.get('X-Ratelimit-Bypass');
            if (ratelimitBypass === secret) return next();

            // Ratelimit as normal
            if (req.body.bot_id && !bot) bot = req.body.bot_id;
            if (typeof bot !== 'string' || !isSnowflake(bot)) bot = '';
            try {
                const recent = await this.db.select().from('ratelimit').where({
                    ip: req.ip,
                    bot_id: bot,
                    route: req.originalUrl
                }).orderBy('datetime', 'desc');

                if (recent && recent.length >= requestLimit) {
                    const expiry = recent[0].expiry;
                    const retry = Math.round((expiry - Date.now()) / 1000);
                    const reset = Math.round(expiry / 1000);

                    res.set('Retry-After', retry);
                    res.set('X-Rate-Limit-Reset', reset);
                    res.set('X-Rate-Limit-IP', req.ip);
                    res.set('X-Rate-Limit-Route', req.originalUrl);
                    res.set('X-Rate-Limit-Bot-ID', bot);

                    return res.status(429).json({
                        error: true,
                        status: 429,
                        retry_after: retry,
                        ratelimit_reset: reset,
                        timestamp: Math.round(Date.now() / 1000),
                        ratelimit_ip: req.ip,
                        ratelimit_route: req.originalUrl,
                        ratelimit_bot_id: bot
                    });
                }

                await this.db('ratelimit').insert({
                    ip: req.ip,
                    bot_id: bot,
                    route: req.originalUrl,
                    datetime: Date.now(),
                    expiry: Date.now() + timeLimit * 1000,
                });
                next();
            } catch (_) {
                res.status(500).json({ error: true, status: 500, message: 'An unexpected error occurred' });
            }
        };
    }
}

module.exports = RateLimiter;
