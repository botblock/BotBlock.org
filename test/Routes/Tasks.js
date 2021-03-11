const { describe, it, request, checks } = require('../base');

describe('/tasks', () => {
    describe('GET', () => {
        const test = () => request().get('/tasks');
        it('returns the authentication required message', done => {
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
        it('returns the authentication required message', done => {
            test().end((err, res) => {
                checks.authRequired(res);
                done();
            });
        });
    });
});
