const { describe, it } = require('mocha');
const { expect } = require('chai');
const locale = require('../../src/Util/i18n').__;
const { resetRatelimits } = require('./ratelimits');
const fetchPage = require('./fetchPage');
const auth = require('./auth');

const ratelimit = (context, limit, test, done, status = 200) => {
    context.retries(0);
    context.slow((limit * 1.15 + 1.5) * 1000);
    context.timeout((limit * 1.25 + 3) * 1000);
    resetRatelimits().end(() => {
        test().end(() => {
        });
        setTimeout(() => {
            test().end((err, res) => {
                expect(res).to.have.status(status);
                expect(res).to.be.json;
                done();
            });
        }, (limit * 1.05 + 0.5) * 1000);
    });
};

const authRequired = res => {
    expect(res).to.have.status(403);
    expect(res).to.be.html;
    expect(res.text).to.include('This page requires authentication to access');
    expect(res.text).to.include(`Sign in to ${locale('site_name')}`);
    expect(res.text).to.include('A 403 error has occurred... :(');
};

const title = (res, expectedTitle) => {
    expect(res).to.be.html;

    // Generic
    expect(res.text).to.include(`<title>${expectedTitle}</title>`);
    expect(res.text).to.include(`<meta name="description" content="${locale('site_name')} - ${locale('full_desc')}">`);

    // OG
    expect(res.text).to.include(`<meta property="og:title" content="${expectedTitle}">`);
    expect(res.text).to.include(`<meta property="og:site_name" content="${locale('site_name')}">`);
    expect(res.text).to.include(`<meta property="og:description" content="${locale('full_desc')}">`);

    // Twitter
    expect(res.text).to.include(`<meta name="twitter:title" content="${expectedTitle}">`);
    expect(res.text).to.include(`<meta name="twitter:description" content="${locale('full_desc')}">`);
};

const meta = expectedTitle => {
    describe('has the correct page metadata', () => {
        it('is a valid HTML page', function (done) {
            expect(this.res).to.be.html;
            done();
        });
        it('has the correct title', function (done) {
            const title = this.page.querySelector('title');
            expect(title).to.exist;
            expect(title.textContent).to.eq(expectedTitle);
            done();
        });
        it('has the correct description', function (done) {
            const description = this.page.querySelector('meta[name="description"]');
            expect(description).to.exist;
            expect(description.hasAttribute('content')).to.be.true;
            expect(description.getAttribute('content')).to.eq(`${locale('site_name')} - ${locale('full_desc')}`);
            done();
        });
        describe('OpenGraph', () => {
            it('has the correct title', function (done) {
                const title = this.page.querySelector('meta[property="og:title"]');
                expect(title).to.exist;
                expect(title.hasAttribute('content')).to.be.true;
                expect(title.getAttribute('content')).to.eq(expectedTitle);
                done();
            });
            it('has the correct site name', function (done) {
                const title = this.page.querySelector('meta[property="og:site_name"]');
                expect(title).to.exist;
                expect(title.hasAttribute('content')).to.be.true;
                expect(title.getAttribute('content')).to.eq(locale('site_name'));
                done();
            });
            it('has the correct description', function (done) {
                const description = this.page.querySelector('meta[property="og:description"]');
                expect(description).to.exist;
                expect(description.hasAttribute('content')).to.be.true;
                expect(description.getAttribute('content')).to.eq(locale('full_desc'));
                done();
            });
        });
        describe('Twitter', () => {
            it('has the correct title', function (done) {
                const title = this.page.querySelector('meta[name="twitter:title"]');
                expect(title).to.exist;
                expect(title.hasAttribute('content')).to.be.true;
                expect(title.getAttribute('content')).to.eq(expectedTitle);
                done();
            });
            it('has the correct description', function (done) {
                const description = this.page.querySelector('meta[name="twitter:description"]');
                expect(description).to.exist;
                expect(description.hasAttribute('content')).to.be.true;
                expect(description.getAttribute('content')).to.eq(locale('full_desc'));
                done();
            });
        });
    });
};

const listCards = (test, db, where) => {
    describe('contains the list cards', () => {
        fetchPage(test);

        before('fetch list cards', function(done) {
            db.select('id', 'name', 'url').from('lists').where(where).then(lists => {
                this.listCards = lists;
                done();
            });
        });

        it('has the list names', function(done) {
            this.listCards.forEach(list => {
                expect(this.res.text).to.include(list.name);
            });
            done();
        });
        it('has the list urls', function(done) {
            this.listCards.forEach(list => {
                expect(this.res.text).to.include(list.url);
            });
            done();
        });

        describe('card buttons', () => {
            it('has the list information button', function(done) {
                this.listCards.forEach(list => {
                    expect(this.page.querySelector(`.card a.button[href="/lists/${list.id}"]`)).to.exist;
                });
                done();
            });

            describe('as an anonymous user', () => {
                fetchPage(() => auth.asAnon(test()));
                it('does not have the edit button', function(done) {
                    this.listCards.forEach(list => {
                        expect(this.page.querySelector(`.card a.button[href="/lists/${list.id}/edit"]`)).to.not.exist;
                    });
                    done();
                });
            });

            describe('as a logged in user', () => {
                fetchPage(() => auth.asUser(test()));
                it('does not have the edit button', function(done) {
                    this.listCards.forEach(list => {
                        expect(this.page.querySelector(`.card a.button[href="/lists/${list.id}/edit"]`)).to.not.exist;
                    });
                    done();
                });
            });

            describe('as a moderator', () => {
                fetchPage(() => auth.asMod(test()));
                it('has the edit button', function(done) {
                    this.listCards.forEach(list => {
                        expect(this.page.querySelector(`.card a.button[href="/lists/${list.id}/edit"]`)).to.exist;
                    });
                    done();
                });
            });
        });
    });
};

module.exports = { ratelimit, authRequired, title, meta, listCards };
