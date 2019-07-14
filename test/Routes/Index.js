const {describe, it, expect, request} = require('../base');

describe('/', () => {
    describe('GET', () => {
        const test = () => request().get('/');
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('renders the expected landing content', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                expect(res.text).to.include('BotBlock - The List of Discord Bot Lists and Services');
                expect(res.text).to.include('Coming Soon');
                done();
            });
        });
    });
});

// Known issue - Not implemented yet
describe.skip('/discord', () => {
    describe('GET', () => {
        const test = () => request().get('/discord').redirects(0);
        it('redirects to a discord.gg URL', done => {
            test().end((err, res) => {
                expect(res).to.redirect;
                expect(res.headers).to.have.property('location');
                expect(res.headers.location).to.include('https://discord.gg/');
                expect(res).to.be.html;
                expect(res.text).to.include('<script>window.location.replace(\'https://discord.gg');
                done();
            });
        });
    });
});

// Known issue - Not implemented yet
describe.skip('/patreon', () => {
    describe('GET', () => {
        const test = () => request().get('/patreon').redirects(0);
        it('redirects to the Patreon page', done => {
            test().end((err, res) => {
                expect(res).to.redirectTo('https://www.patreon.com/botblock');
                done();
            });
        });
    });
});

// Known issue - Not implemented yet
describe.skip('/reddit', () => {
    describe('GET', () => {
        const test = () => request().get('/reddit').redirects(0);
        it('redirects to the subreddit page', done => {
            test().end((err, res) => {
                expect(res).to.redirectTo('https://www.reddit.com/r/botblock');
                done();
            });
        });
    });
});

// Known issue - Not implemented yet
describe.skip('/twitter', () => {
    describe('GET', () => {
        const test = () => request().get('/twitter').redirects(0);
        it('redirects to the Twitter profile', done => {
            test().end((err, res) => {
                expect(res).to.redirectTo('https://twitter.com/botblockorg');
                done();
            });
        });
    });
});
