const { describe, it, expect, compareObjects } = require('./base');
const templateConfig = require('../src/config.example');
const liveConfig = require('../src/config');

describe('Config', () => {
    it('contains all the correct properties', done => {
        compareObjects(templateConfig, liveConfig);
        done();
    });
});
