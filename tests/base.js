const config = require('../src/config');

const {describe, it} = require('mocha');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const request = () => chai.request(`${config.baseURL}:${process.env.PORT || config.port}`);

module.exports = {describe, it, expect, request};
