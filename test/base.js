const config = require('../config');
const locale = require('../src/Util/i18n').__;
const db = require('../db/db')();
const checks = require('./helpers/checks');
const auth = require('./helpers/auth');
const request = require('./helpers/request');

const { describe, it } = require('mocha');
const { expect } = require('chai');

const ratelimitBypass = (req) => req.set('X-Ratelimit-Bypass', config.secret);
const resetRatelimits = () => ratelimitBypass(request().get('/api/reset'));

const compareObjectProps = (a, b) => {
    const missing = [];
    const aProps = Object.keys(a);
    const bProps = Object.keys(b);
    aProps.forEach(prop => {
        if (!bProps.includes(prop)) {
            missing.push(prop);
            return;
        }
        if (a[prop] !== null && a[prop].constructor.name === 'Object') {
            const subMissing = compareObjectProps(a[prop], b[prop]).map(x => `${prop}.${x}`);
            missing.push(...subMissing);
        }
    });
    return missing;
};

const compareObjects = (template, actual) => {
    const missing = compareObjectProps(template, actual);
    if (missing && missing.length) throw new chai.AssertionError(`Expected to find ${missing.map(x => `'${x}'`).join(', ')} in object`);
};

module.exports = {
    describe,
    it,
    expect,
    secret: config.secret,
    request,
    ratelimitBypass,
    resetRatelimits,
    db,
    locale,
    checks,
    auth,
    compareObjects
};
