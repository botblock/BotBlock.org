const config = require('../../config');
const { asAnon } = require('./auth');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const target = `${config.baseURL}:${config.port}`;
const base = () => chai.request(target);

module.exports = () => new Proxy(base, {
    get(target, method) {
        return function (...args) {
            return asAnon(target()[method].apply(this, args));
        };
    }
});
