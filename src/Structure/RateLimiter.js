const { secret } = require('../../config.js');
const isSnowflake = require('../Util/isSnowflake');

class RateLimiter {
    constructor(db) {
        this.db = db;
    }

    checkRatelimit(requestLimit = 1, timeLimit = 1, bot = '') {
        return async (req, res, next) => {
            // Test suite ratelimit bypass
            const ratelimitBypass = req.get('X-Ratelimit-Bypass');
            if (ratelimitBypass === secret) return next();
            // Ratelimit as normal
            if (req.body.bot_id && !bot) bot = req.body.bot_id;
            if (typeof bot !== "string" || !isSnowflake(bot)) bot = '';
            try {
                await this.db.run('DELETE FROM ratelimit WHERE ip = ? AND bot_id = ? AND route = ? AND expiry < ?', [req.ip, bot, req.originalUrl, Date.now()]);
                const recent = await this.db.run('SELECT * FROM ratelimit WHERE ip = ? AND bot_id = ? AND route = ? ORDER BY datetime DESC', [req.ip, bot, req.originalUrl]);
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
