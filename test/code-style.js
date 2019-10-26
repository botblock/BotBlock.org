const { describe, it } = require('./base');
const path = require('path');
const exec = require('child_process').exec;


describe('code style', () => {
    it('should follow editorconfig conventions', function (done) {
        this.retries(0);
        this.slow(2000);
        try {
            exec('npm run lint:editorconfig', { cwd: path.join(__dirname, '..') }, (err, stdout) => {
                if (err) return done(new Error(stdout));
                done();
            });
        } catch {
            this.skip();
        }
    });

    it('should follow eslint standards', function (done) {
        this.retries(0);
        this.slow(2000);
        try {
            exec('npm run lint:eslint', { cwd: path.join(__dirname, '..') }, (err, stdout) => {
                if (err) return done(new Error(stdout));
                done();
            });
        } catch {
            this.skip();
        }
    });
});
