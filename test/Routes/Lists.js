const {describe, it, expect, request, db} = require('../base');

describe('/lists', () => {
    describe('GET', () => {
        const test = () => request().get('/lists');
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('renders the expected content', done => {
            db('SELECT name, url FROM lists WHERE display = 1 AND defunct = 0').then(lists => {
                test().end((err, res) => {
                    expect(res).to.be.html;

                    // Confirm header
                    expect(res.text).to.include('All Bot Lists');

                    // Confirm footer stats
                    expect(res.text).to.include('BotBlock - Bot List Stats');

                    // Confirm list cards
                    lists.forEach(list => {
                        expect(res.text).to.include(list.name);
                        expect(res.text).to.include(list.url);
                    });

                    done();
                });
            });
        });
    });
});

describe('/lists/new', () => {
    describe('GET', () => {
        const test = () => request().get('/lists/new');
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('renders the expected content', done => {
            db('SELECT name, url FROM lists WHERE display = 1 AND defunct = 0 ORDER BY added DESC LIMIT 4').then(lists => {
                test().end((err, res) => {
                    expect(res).to.be.html;

                    // Confirm header
                    expect(res.text).to.include('New Bot Lists');

                    // Confirm footer stats
                    expect(res.text).to.include('BotBlock - Bot List Stats');

                    // Confirm list cards
                    lists.forEach(list => {
                        expect(res.text).to.include(list.name);
                        expect(res.text).to.include(list.url);
                    });

                    done();
                });
            });
        });
    });
});

