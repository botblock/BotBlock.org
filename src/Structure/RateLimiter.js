class RateLimiter {
    constructor() {

    }

    checkRatelimit(requestLimit, timeLimit, route, bot = null) {
        return (req, res, next) => {
            console.log(req.url)
            next();
        }
    }
}

module.exports = RateLimiter;
