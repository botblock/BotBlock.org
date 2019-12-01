const { describe, it, expect, request, db, locale, titleCheck, authCheck } = require('../base');

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
            db.select('name', 'url').from('lists').where({ display: true, defunct: false }).then(lists => {
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
            db.select('name', 'url').from('lists')
                .where({ display: true, defunct: false })
                .orderBy('added', 'desc')
                .limit(4)
                .then(lists => {
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
            db.select('name', 'url').from('lists').where({ defunct: true }).then(lists => {
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
            db.select('name', 'url').from('lists').where({ display: false, defunct: false }).then(lists => {
                test().end((err, res) => {
                    expect(res).to.be.html;

                    // Confirm header
                    expect(res.text).to.include('Hidden Bot Lists');

                    // Confirm footer stats
                    expect(res.text).to.include(`${locale('site_name')} - Bot List Stats`);

                    // Confirm list cards
                    lists.forEach(list => {
                        expect(res.text).to.include(`<p class="title is-3">${list.name}</p>`);
                        expect(res.text).to.include(`<p class="subtitle is-6">${list.url}</p>`);
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
            db.select('name').from('features').then(features => {
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
            db.select('name', 'url').from('lists').where({ display: true, defunct: false }).then(lists => {
                lists = lists.filter(list => list.name.toLowerCase().includes('bots') || list.url.toLowerCase().includes('bots'));
                test().end((err, res) => {
                    // Confirm list cards
                    lists.forEach(list => {
                        expect(res.text).to.include(`<p class="title is-3">${list.name}</p>`);
                        expect(res.text).to.include(`<p class="subtitle is-6">${list.url}</p>`);
                    });
                    done();
                });
            });
        });
    });
});

describe('/lists/:id', () => {
    const listId = 'botlist.space';
    describe(`GET Valid (:id = ${listId})`, () => {
        const test = () => request().get(`/lists/${listId}`);
        let data;
        before('fetch list data', done => {
            db.select().from('lists').where({ id: listId }).then(lists => {
                data = lists[0];
                done();
            });
        });
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('has the correct page title', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                titleCheck(res, `${data.name} (${data.id}) - ${locale('site_name')} - ${locale('short_desc')}`);
                done();
            });
        });
        it('provides the basic list information', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                expect(res.text).to.include(`<p class="title is-3">${data.name}</p>`);
                expect(res.text).to.include(`<p class="subtitle is-6">${data.url}${data.description ? `<br><br>${data.description}` : ''}</p>`);
                done();
            });
        });
        it('provides the list owners', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                expect(res.text).to.include(`<b class="has-text-primary">Owners:</b><br>${data.owners}`);
                done();
            });
        });
        it('provides the list language', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                expect(res.text).to.include(`<b class="has-text-primary">Primary Language:</b><br>${data.language}`);
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

    describe('GET Legacy ID', () => {
        let id, target, data;
        before('fetch list data', done => {
            db.select().from('legacy_ids').limit(1).then(legacy => {
                id = legacy[0].id;
                target = legacy[0].target;
                db.select().from('lists').where({ id: target }).limit(1).then(lists => {
                    data = lists[0];
                    done();
                });
            });
        });
        it('returns the target list page', done => {
            const test = () => request().get(`/lists/${id}`);
            test().end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                titleCheck(res, `${data.name} (${data.id}) - ${locale('site_name')} - ${locale('short_desc')}`);
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

describe('/lists/:id/edit', () => {
    const listId = 'botlist.space';
    describe(`GET (:id = ${listId})`, () => {
        const test = () => request().get(`/lists/${listId}/edit`);
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

    describe(`POST (:id = ${listId})`, () => {
        const test = () => request().post(`/lists/${listId}/edit`);
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

describe('/lists/:id/icon', () => {
    const listId = 'botlist.space';
    describe(`GET (:id = ${listId})`, () => {
        const test = () => request().get(`/lists/${listId}/icon`);
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

describe('/lists/add', () => {
    describe('GET', () => {
        const test = () => request().get('/lists/add');
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

    describe('POST', () => {
        const test = () => request().post('/lists/add');
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

describe('/lists/legacy-ids', () => {
    describe('GET', () => {
        const test = () => request().get('/lists/legacy-ids');
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

    describe('POST', () => {
        const test = () => request().post('/lists/legacy-ids');
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

describe('/lists/features/manage', () => {
    describe('GET', () => {
        const test = () => request().get('/lists/features/manage');
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

describe('/lists/features/manage/add', () => {
    describe('GET', () => {
        const test = () => request().get('/lists/features/manage/add');
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

    describe('POST', () => {
        const test = () => request().post('/lists/features/manage/add');
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

describe('/lists/features/manage/:id', () => {
    describe('GET', () => {
        const test = () => request().get('/lists/features/manage/1');
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

    describe('POST', () => {
        const test = () => request().post('/lists/features/manage/1');
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

describe('/lists/features/manage/:id/delete', () => {
    describe('GET', () => {
        const test = () => request().get('/lists/features/manage/1/delete');
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
