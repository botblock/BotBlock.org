const { describe, it, expect, request, auth } = require('../base');

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
        describe('As an anonymous user', () => {
            it('redirects to back to the homepage', done => {
                auth.asAnon(request().get('/')).end((err1, res1) => {
                    expect(res1.text).to.include('<a href="/auth">Sign in with Discord</a>');

                    auth.asPrevious(request().get('/')).end((err2, res2) => {
                        expect(res2.text).to.include('<a href="/auth">Sign in with Discord</a>');

                        auth.asPrevious(request().get('/auth/logout')).redirects(0).end((err3, res3) => {
                            expect(res3).to.redirectTo('/');

                            auth.asPrevious(request().get('/')).end((err4, res4) => {
                                expect(res4.text).to.include('<a href="/auth">Sign in with Discord</a>');
                                done();
                            });
                        });
                    });
                });
            });
        });

        describe('As a logged in user', () => {
            it('redirects to back to the homepage', done => {
                auth.asUser(request().get('/')).end((err1, res1) => {
                    expect(res1.text).to.include('<p class="menu-label">User#1234</p>');

                    auth.asPrevious(request().get('/')).end((err2, res2) => {
                        expect(res2.text).to.include('<p class="menu-label">User#1234</p>');

                        auth.asPrevious(request().get('/auth/logout')).redirects(0).end((err3, res3) => {
                            expect(res3).to.redirectTo('/');

                            auth.asPrevious(request().get('/')).end((err4, res4) => {
                                expect(res4.text).to.include('<a href="/auth">Sign in with Discord</a>');
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
});
