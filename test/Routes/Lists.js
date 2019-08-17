const {describe, it, expect, request, db, locale, titleCheck} = require('../base');

describe('/lists', () => {
    describe('GET', () => {
        const test = () => request().get('/lists');
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('has the correct page title', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                titleCheck(res, `All Bot Lists - ${locale('site_name')} - ${locale('short_desc')}`);
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
                    expect(res.text).to.include(`${locale('site_name')} - Bot List Stats`);

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
        it('has the correct page title', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                titleCheck(res, `New Bot Lists - ${locale('site_name')} - ${locale('short_desc')}`);
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
                    expect(res.text).to.include(`${locale('site_name')} - Bot List Stats`);

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

describe('/lists/defunct', () => {
    describe('GET', () => {
        const test = () => request().get('/lists/defunct');
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('has the correct page title', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                titleCheck(res, `Defunct Bot Lists - ${locale('site_name')} - ${locale('short_desc')}`);
                done();
            });
        });
        it('renders the expected content', done => {
            db('SELECT name, url FROM lists WHERE defunct = 1').then(lists => {
                test().end((err, res) => {
                    expect(res).to.be.html;

                    // Confirm header
                    expect(res.text).to.include('Defunct Bot Lists');

                    // Confirm footer stats
                    expect(res.text).to.include(`${locale('site_name')} - Bot List Stats`);

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

describe('/lists/hidden', () => {
    describe('GET', () => {
        const test = () => request().get('/lists/hidden');
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('has the correct page title', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                titleCheck(res, `Hidden Bot Lists - ${locale('site_name')} - ${locale('short_desc')}`);
                done();
            });
        });
        it('renders the expected content', done => {
            db('SELECT name, url FROM lists WHERE display = 0 AND defunct = 0').then(lists => {
                test().end((err, res) => {
                    expect(res).to.be.html;

                    // Confirm header
                    expect(res.text).to.include('Hidden Bot Lists');

                    // Confirm footer stats
                    expect(res.text).to.include(`${locale('site_name')} - Bot List Stats`);

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

describe('/lists/features', () => {
    describe('GET', () => {
        const test = () => request().get('/lists/features');
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('has the correct page title', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                titleCheck(res, `All List Features - ${locale('site_name')} - ${locale('short_desc')}`);
                done();
            });
        });
        it('renders the expected content', done => {
            db('SELECT name FROM features').then(features => {
                test().end((err, res) => {
                    expect(res).to.be.html;

                    // Confirm header
                    expect(res.text).to.include('All List Features');

                    // Confirm features
                    features.forEach(feature => {
                        expect(res.text).to.include(feature.name);
                    });

                    done();
                });
            });
        });
    });
});

describe('/lists/features/:id', () => {
    // This suite will need updating if this feature changes
    describe('GET Valid (:id = 2)', () => {
        const test = () => request().get('/lists/features/2');
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('has the correct page title', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                titleCheck(res, `Bot Lists with feature 'Has Voting' - ${locale('site_name')} - ${locale('short_desc')}`);
                done();
            });
        });
        it('renders the expected content', done => {
            test().end((err, res) => {
                expect(res).to.be.html;

                // Confirm header
                expect(res.text).to.include('Bot Lists with feature \'Has Voting\'');

                // Confirm footer stats
                expect(res.text).to.include(`${locale('site_name')} - Bot List Stats`);

                done();
            });
        });
    });

    describe('GET Invalid (:id = helloworld)', () => {
        const test = () => request().get('/lists/features/helloworld');
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

describe('/lists/search', () => {
    describe('GET', () => {
        const test = () => request().get('/lists/search');
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('has the correct page title', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                titleCheck(res, `Bot List Search - ${locale('site_name')} - ${locale('short_desc')}`);
                done();
            });
        });
        it('renders the expected form', done => {
            test().end((err, res) => {
                expect(res).to.be.html;

                // Confirm header
                expect(res.text).to.include('Bot List Search');
                expect(res.text).to.include('Search for bot lists by name or website');

                // Confirm form
                expect(res.text).to.include('<label class="label" for="query">Search query</label>');
                expect(res.text).to.include('<input class="input" id="query" name="query" type="text" value="">');
                expect(res.text).to.include('<input class="button is-brand" type="submit" value="Search">');

                // Confirm footer stats
                expect(res.text).to.include(`${locale('site_name')} - Bot List Stats`);

                done();
            });
        });
    });
});

describe('/lists/search/:query', () => {
    describe('GET (:query = bots)', () => {
        const test = () => request().get('/lists/search/bots');
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('has the correct page title', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                titleCheck(res, `Bot List Search - ${locale('site_name')} - ${locale('short_desc')}`);
                done();
            });
        });
        it('renders the expected form', done => {
            test().end((err, res) => {
                expect(res).to.be.html;

                // Confirm header
                expect(res.text).to.include('Bot List Search');
                expect(res.text).to.include('Search for bot lists by name or website');

                // Confirm form
                expect(res.text).to.include('<label class="label" for="query">Search query</label>');
                expect(res.text).to.include('<input class="input" id="query" name="query" type="text" value="bots">');
                expect(res.text).to.include('<input class="button is-brand" type="submit" value="Search">');

                // Confirm footer stats
                expect(res.text).to.include(`${locale('site_name')} - Bot List Stats`);

                done();
            });
        });
        it('renders the expected results', done => {
            db('SELECT name, url FROM lists WHERE (LOWER(name) LIKE \'%bots%\' OR LOWER(url) LIKE \'%bots%\') AND display = 1 AND defunct = 0').then(lists => {
                test().end((err, res) => {
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

describe('/lists/:id', () => {
    // This suite will need updating if this list changes
    describe('GET Valid (:id = botlist.space)', () => { // TODO: Use DB
        const test = () => request().get('/lists/botlist.space'); // TODO: Use DB
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('has the correct page title', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                titleCheck(res, `botlist.space (botlist.space) - ${locale('site_name')} - ${locale('short_desc')}`); // TODO: Use DB
                done();
            });
        });
        it('provides the basic list information', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                expect(res.text).to.include('<p class="title is-3">botlist.space</p>'); // TODO: Use DB
                expect(res.text).to.include('<p class="subtitle is-6">https://botlist.space/</p>'); // TODO: Use DB
                done();
            });
        });
        it('provides the list owners', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                expect(res.text).to.include('<b class="has-text-primary">Owners:</b>');
                expect(res.text).to.include('PassTheMayo#8620 (507329700402561045)'); // TODO: Use DB
                done();
            });
        });
        it('provides the list language', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                expect(res.text).to.include('<b class="has-text-primary">Primary Language:</b>');
                expect(res.text).to.include('English'); // TODO: Use DB
                done();
            });
        });
        it('renders the list features', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                expect(res.text).to.include('<b class="has-text-grey-lighter">List features:</b>');
                expect(res.text).to.include('<div class="column is-full-mobile left">');
                expect(res.text).to.include('<div class="checkbox always');
                expect(res.text).to.include('<div class="checkbox-inner tooltip" data-tooltip="');
                expect(res.text).to.include('<a class="button is-light is-small" id="feature_toggle" data-toggled="0">Show All</a>');
                done();
            });
        });
        it('renders the list API information', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                expect(res.text).to.include('<b class="has-text-grey-lighter">List API information:</b>');

                expect(res.text).to.include('<b class="has-text-grey-lighter">This list has an API endpoint for posting server/guild count of a bot:</b>');
                expect(res.text).to.include('https://api.botlist.space/v1/bots/:id'); // TODO: Use DB

                expect(res.text).to.include('<b class="has-text-grey-lighter">This list\'s API provides the following shard support for server/guild count posting:</b>');

                expect(res.text).to.include('<b class="has-text-grey-lighter">BotBlock server/guild count API:</b>');
                expect(res.text).to.include('Provide your botlist.space API authorisation token as the value for the key'); // TODO: Use DB
                expect(res.text).to.include('<code>botlist.space</code> in your server/guild count API request'); // TODO: Use DB

                expect(res.text).to.include('<b class="has-text-grey-lighter">This list also has an API endpoint for getting information about a bot:</b>');
                expect(res.text).to.include('https://api.botlist.space/v1/bots/:id'); // TODO: Use DB

                done();
            });
        });
        it('renders the additional known URLs', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                expect(res.text).to.include('<b>Additional known URLs for this bot list:</b>');
                expect(res.text).to.include('https://botlist.space/bot/:id'); // TODO: Use DB
                expect(res.text).to.include('https://botlist.space/bot/:id/widget'); // TODO: Use DB
                done();
            });
        });
    });

    describe('GET Invalid (:id = helloworld)', () => {
        const test = () => request().get('/lists/helloworld');
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
