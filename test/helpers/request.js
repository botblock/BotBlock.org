const config = require('../../config');
const { asAnon } = require('./auth');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const target = `${config.baseURL}:${config.port}`;
let agent;
const base = () => {
    if (!agent) agent = chai.request.agent(target);
    return agent;
};

module.exports = () => new Proxy(base, {
    get(target, method) {
        return function (...args) {
            return asAnon(target()[method].apply(agent, args));
        };
    }
});
