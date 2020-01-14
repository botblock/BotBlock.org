const { describe, it, expect, request, checks } = require('../base');

describe('/tasks', () => {
    describe('GET', () => {
        const test = () => request().get('/tasks');
        it('returns a Forbidden status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
        });
        it('renders the authentication required message', done => {
            test().end((err, res) => {
                checks.authRequired(res);
                done();
            });
        });
    });
});

describe('/tasks/run/:id', () => {
    describe('POST', () => {
        const test = () => request().post('/tasks/run/0');
        it('returns a Forbidden status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
        });
        it('renders the authentication required message', done => {
            test().end((err, res) => {
                checks.authRequired(res);
                done();
            });
        });
    });
});
