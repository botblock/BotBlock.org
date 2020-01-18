const { before } = require('mocha');
const dom = require('./dom');

module.exports = test => {
    before('fetch the page', function(done) {
        test().end((_, r) => {
            this.res = r;
            this.page = dom(r);
            done();
        });
    });
};
