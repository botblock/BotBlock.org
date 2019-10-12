const { describe, it, expect, request, authCheck } = require('../base');

describe('/test', () => {
    describe('GET', () => {
        const test = () => request().get('/test');
        it('returns a Forbidden status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
        });
        it('renders the authentication required message', done => {
            test().end((err, res) => {
                authCheck(res);
                done();
            });
        });
    });
});

describe('/test/start', () => {
    describe('GET', () => {
        const test = () => request().get('/test/start');
        it('returns a Forbidden status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
        });
        it('renders the authentication required message', done => {
            test().end((err, res) => {
                authCheck(res);
                done();
            });
        });
    });
});

describe('/test/restart', () => {
    describe('GET', () => {
        const test = () => request().get('/test/restart');
        it('returns a Forbidden status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
        });
        it('renders the authentication required message', done => {
            test().end((err, res) => {
                authCheck(res);
                done();
            });
        });
    });
});

describe('/test/progress', () => {
    describe('GET', () => {
        const test = () => request().get('/test/progress');
        it('returns a Forbidden status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
        });
        it('renders the authentication required message', done => {
            test().end((err, res) => {
                authCheck(res);
                done();
            });
        });
    });
});
