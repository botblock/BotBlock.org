const { describe, it, expect, compareObjects } = require('./base');
const templateConfig = require('../config.example');
const liveConfig = require('../config');

describe('Config', () => {
    it('contains all the correct properties', done => {
        compareObjects(templateConfig, liveConfig);
        done();
    });
    it('contains no empty values', done => {
        const vals = Object.values(liveConfig).filter(val => !val);
        expect(vals.length).to.equal(0);
        done();
    });
});
