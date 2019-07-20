const {describe, it, expect, request} = require('../base');

describe('/auth', () => {
    describe('GET', () => {
        const test = () => request().get('/auth').redirects(0);
        it('redirects to a discordapp.com URL', done => {
            test().end((err, res) => {
                expect(res).to.redirect;
                expect(res.headers).to.have.property('location');
                expect(res.headers.location).to.include('https://discordapp.com/');
                done();
            });
        });
        it('redirects to the OAuth2 API authorize endpoint', done => {
            test().end((err, res) => {
                expect(res).to.redirect;
                expect(res.headers).to.have.property('location');
                expect(res.headers.location).to.include('/api/oauth2/authorize');
                done();
            });
        });
    });
});

describe('/auth/logout', () => {
    describe('GET', () => {
        const test = () => request().get('/auth/logout').redirects(0);
        it('redirects to back to the homepage', done => {
            test().end((err, res) => {
                expect(res).to.redirectTo('/');
                done();
            });
        });
    });
});
