const {describe, it, expect, request, db, locale} = require('../base');
const renderer = new (require('../../src/Structure/Markdown'))();

describe('/', () => {
    describe('GET', () => {
        const test = () => request().get('/');
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('renders the expected content', done => {
            test().end((err, res) => {
                expect(res).to.be.html;

                // Confirm header
                expect(res.text).to.include(locale('slogan'));
                expect(res.text).to.include(`${locale('site_name')} - ${locale('short_desc')}`);

                // Confirm buttons
                expect(res.text).to.include('href="/lists">View all the lists');
                expect(res.text).to.include('href="/api/docs">Read the API Docs');
                done();
            });
        });
    });
});

describe('/helloworld', () => {
    describe('GET', () => {
        const test = () => request().get('/helloworld');
        it('returns a Not Found status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
        });
        it('renders the error content', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                expect(res.text).to.include('The page you were looking for could not be found.');
                expect(res.text).to.include('A 404 error has occurred... :(');
                done();
            });
        });
    });
});

describe('/about', () => {
    describe('GET', () => {
        const test = () => request().get('/about');
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('renders the expected information', done => {
            db('SELECT id, title FROM about').then(sections => {
                test().end((err, res) => {
                    expect(res).to.be.html;

                    // Confirm header
                    expect(res.text).to.include(`${locale('site_name')} - ${locale('short_desc')}`);

                    // Confirm sections
                    sections.forEach(section => {
                        expect(res.text).to.include(`id="${section.id}"`);
                        expect(res.text).to.include(`href="#${section.id}"`);
                        expect(res.text).to.include(renderer.variables(section.title));
                    });

                    done();
                });
            });
        });
    });
});

describe('Discord Invite', () => {
    const routes = [
        '/invite',
        '/support',
        '/guild',
        '/server',
        '/discord',
        '/contact',
        '/help'
    ];
    routes.forEach(route => {
        describe(route, () => {
            describe('GET', () => {
                const test = () => request().get(route).redirects(0);
                it('redirects to a discord.gg URL', done => {
                    test().end((err, res) => {
                        expect(res).to.redirect;
                        expect(res.headers).to.have.property('location');
                        expect(res.headers.location).to.include('https://discord.gg/');
                        done();
                    });
                });
            });
        });
    });
});

describe('Patreon Page', () => {
    const routes = [
        '/donate',
        '/pledge',
        '/patreon'
    ];
    routes.forEach(route => {
        describe(route, () => {
            describe('GET', () => {
                const test = () => request().get(route).redirects(0);
                it('redirects to the Patreon page', done => {
                    test().end((err, res) => {
                        expect(res).to.redirectTo('https://patreon.com/botblock');
                        done();
                    });
                });
            });
        });
    });
});

describe('Subreddit Page', () => {
    const routes = [
        '/reddit',
        '/subreddit'
    ];
    routes.forEach(route => {
        describe(route, () => {
            describe('GET', () => {
                const test = () => request().get(route).redirects(0);
                it('redirects to the subreddit page', done => {
                    test().end((err, res) => {
                        expect(res).to.redirectTo('https://reddit.com/r/botblock');
                        done();
                    });
                });
            });
        });
    });
});

describe('Twitter Profile', () => {
    const routes = [
        '/twitter',
        '/tweets',
        '/tweet'
    ];
    routes.forEach(route => {
        describe(route, () => {
            describe('GET', () => {
                const test = () => request().get(route).redirects(0);
                it('redirects to the Twitter profile', done => {
                    test().end((err, res) => {
                        expect(res).to.redirectTo('https://twitter.com/botblockorg');
                        done();
                    });
                });
            });
        });
    });
});

describe('Shields.io Badge', () => {
    const routes = [
        '/badge',
        '/shield'
    ];
    routes.forEach(route => {
        describe(route, () => {
            describe('GET', () => {
                const test = () => request().get(route).redirects(0);
                it('redirects to a img.shields.io URL', done => {
                    test().end((err, res) => {
                        expect(res).to.redirect;
                        expect(res.headers).to.have.property('location');
                        expect(res.headers.location).to.include('https://img.shields.io/badge/');
                        done();
                    });
                });
            });
        });
    });
});
