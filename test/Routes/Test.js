const { describe, it, expect, request, checks } = require('../base');

describe('/test', () => {
    describe('GET', () => {
        const test = () => request().get('/test');
        it('returns the authentication required message', done => {
            test().end((err, res) => {
                checks.authRequired(res);
                done();
            });
        });
    });
});

describe('/test/start', () => {
    describe('GET', () => {
        const test = () => request().get('/test/start');
        it('returns the authentication required message', done => {
            test().end((err, res) => {
                checks.authRequired(res);
                done();
            });
        });
    });
});

describe('/test/restart', () => {
    describe('GET', () => {
        const test = () => request().get('/test/restart');
        it('returns the authentication required message', done => {
            test().end((err, res) => {
                checks.authRequired(res);
                done();
            });
        });
    });
});

describe('/test/progress', () => {
    describe('GET', () => {
        const test = () => request().get('/test/progress');
        it('returns the authentication required message', done => {
            test().end((err, res) => {
                checks.authRequired(res);
                done();
            });
        });
    });
});
