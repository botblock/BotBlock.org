const { describe, it, expect, secret } = require('./base');
const path = require('path');
const exec = require('child_process').exec;

describe('editorconfig', () => {
    it('should follow editorconfig conventions', done => {
        exec('npm run lint:editorconfig', { cwd: path.join(__dirname, '..') }, (err, stdout, stderr) => {
            if (err) {
                return done(new Error(stdout));
            }
            done();
        });
    });
});
