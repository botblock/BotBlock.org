const config = require('../config');
const Database = require('../src/Structure/Database');
const i18n = require('../src/Util/i18n');

const {describe, it} = require('mocha');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const target = `${config.baseURL}:${config.port}`;
const request = () => chai.request(target);
const ratelimitBypass = (req) => req.set('X-Ratelimit-Bypass', config.secret);

const dbc = new Database(config.database);
const db = async (query, data) => {
    if (!dbc.db._connectCalled) await dbc.connect();
    return dbc.run(query, data);
};

const locale = i18n.__;

const authCheck = res => {
    expect(res).to.be.html;
    expect(res.text).to.include('This page requires authentication to access');
    expect(res.text).to.include(`Sign in to ${locale('site_name')}`);
    expect(res.text).to.include('A 403 error has occurred... :(');
};

const titleCheck = (res, expectedTitle) => {
    expect(res).to.be.html;

    // Generic
    expect(res.text).to.include(`<title>${expectedTitle}</title>`);
    expect(res.text).to.include(`<meta name="description" content="${locale('site_name')} - ${locale('full_desc')}">`);

    // OG
    expect(res.text).to.include(`<meta property="og:title" content="${expectedTitle}">`);
    expect(res.text).to.include(`<meta property="og:site_name" content="${locale('site_name')}">`);
    expect(res.text).to.include(`<meta property="og:description" content="${locale('full_desc')}">`);

    // Twitter
    expect(res.text).to.include(`<meta name="twitter:title" content="${expectedTitle}">`);
    expect(res.text).to.include(`<meta name="twitter:description" content="${locale('full_desc')}">`);
};

const compareObjectProps = (a, b) => {
    const missing = [];
    const aProps = Object.keys(a);
    const bProps = Object.keys(b);
    aProps.forEach(prop => {
        if(!bProps.includes(prop)) {
            missing.push(prop);
            return;
        }
        if(a[prop] != null && a[prop].constructor.name === "Object") {
            const subMissing = compareObjectProps(a[prop], b[prop]).map(x => `${prop}.${x}`);
            missing.push(...subMissing);
            return;
        }
    });
    return missing;
};

const compareObjects = (template, actual) => {
    const missing = compareObjectProps(template, actual);
    if (missing && missing.length) throw new chai.AssertionError(`Expected to find ${missing.map(x => `'${x}'`).join(', ')} in object`);
};

module.exports = {describe, it, expect, target, secret: config.secret, request, ratelimitBypass, db, locale, authCheck, titleCheck, compareObjects};
