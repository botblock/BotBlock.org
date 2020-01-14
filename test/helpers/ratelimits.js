const config = require('../../config');
const request = require('./request');

const ratelimitBypass = (req) => req.set('X-Ratelimit-Bypass', config.secret);
const resetRatelimits = () => ratelimitBypass(request().get('/api/reset'));

module.exports = { ratelimitBypass, resetRatelimits };
