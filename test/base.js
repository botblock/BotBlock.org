const config = require('../config');
const i18n = require('../src/Util/i18n');
const db = require('../db/db')();
const checks = require('./helpers/checks');

const { describe, it } = require('mocha');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const target = `${config.baseURL}:${config.port}`;
const request = () => chai.request(target);
const ratelimitBypass = (req) => req.set('X-Ratelimit-Bypass', config.secret);
const resetRatelimits = () => ratelimitBypass(request().get('/api/reset'));

const locale = i18n.__;

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
    target,
    secret: config.secret,
    request,
    ratelimitBypass,
    resetRatelimits,
    db,
    locale,
    checks,
    compareObjects
};
