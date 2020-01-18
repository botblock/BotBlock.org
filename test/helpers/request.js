const config = require('../../config');
const { asAnon } = require('./auth');
const chai = require('chai');

const target = `${config.baseURL}:${config.port}`;
const base = () => chai.request(target);

module.exports = () => new Proxy(base, {
    get(target, method) {
        return function (...args) {
            return asAnon(target()[method].apply(this, args));
        };
    }
});
