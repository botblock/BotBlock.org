const { describe, it, expect, request, ratelimitBypass, resetRatelimits, ratelimitTest, locale, titleCheck, db } = require('../base');

describe('Invalid route (/api/helloworld)', () => {
    describe('GET', () => {
        const test = () => ratelimitBypass(request().get('/api/helloworld'));
        it('returns a Not Found status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
        });
        it('has a permissive CORS header', done => {
            test().end((err, res) => {
                expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                done();
            });
        });
        it('returns an error JSON body', done => {
            test().end((err, res) => {
                expect(res).to.be.json;
                expect(res.body).to.have.property('error', true);
                expect(res.body).to.have.property('status', 404);
                expect(res.body).to.have.property('message', 'Endpoint not found');
                done();
            });
        });
    });

    describe('POST', () => {
        const test = () => ratelimitBypass(request().post('/api/helloworld'));
        it('returns a Not Found status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
        });
        it('has a permissive CORS header', done => {
            test().end((err, res) => {
                expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                done();
            });
        });
        it('returns an error JSON body', done => {
            test().end((err, res) => {
                expect(res).to.be.json;
                expect(res.body).to.have.property('error', true);
                expect(res.body).to.have.property('status', 404);
                expect(res.body).to.have.property('message', 'Endpoint not found');
                done();
            });
        });
    });
});

describe('/api/docs', () => {
    describe('GET', () => {
        const test = () => request().get('/api/docs');
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('has no CORS header', done => {
            test().end((err, res) => {
                expect(res).to.not.have.header('Access-Control-Allow-Origin');
                done();
            });
        });
        it('has the correct page title', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                titleCheck(res, `API Docs - ${locale('site_name')} - ${locale('short_desc')}`);
                done();
            });
        });
        it('renders the expected header content', done => {
            test().end((err, res) => {
                expect(res).to.be.html;

                // Confirm header
                expect(res.text).to.include('API Documentation');
                expect(res.text).to.include(`${locale('site_name')} provides a single API endpoint`);

                // Confirm CTA to libs
                expect(res.text).to.include('<a class="button is-brand is-size-5" href="/api/docs/libs">API Libraries</a>');

                // Confirm menu
                expect(res.text).to.include('<aside class="menu">');
                expect(res.text).to.include('<p class="menu-label">');
                expect(res.text).to.include('<ul class="menu-list">');

                done();
            });
        });
        it('renders the count docs', done => {
            test().end((err, res) => {
                expect(res.text).to.include('<h1 class="is-size-4 has-text-grey-lighter" id="count">Update bot/guild count');
                expect(res.text).to.include('<code>POST /api/count</code>');
                expect(res.text).to.include('<code>POST /api/count {"server_count": 200, "bot_id": "123456789012345678"}</code>');
                done();
            });
        });
        it('renders the bots docs', done => {
            test().end((err, res) => {
                expect(res.text).to.include('<h1 class="is-size-4 has-text-grey-lighter" id="bots">Get bot information from lists');
                expect(res.text).to.include('<code>GET /api/bots/:id</code>');
                expect(res.text).to.include('<code>GET /api/bots/123456789012345678</code>');
                done();
            });
        });
        it('renders the lists docs', done => {
            test().end((err, res) => {
                expect(res.text).to.include('<h1 class="is-size-4 has-text-grey-lighter" id="lists">Get all lists\' API details');
                expect(res.text).to.include('<code>GET /api/lists</code>');
                done();
            });
        });
        it('renders the errors docs', done => {
            test().end((err, res) => {
                expect(res.text).to.include('<h1 class="is-size-4 has-text-grey-lighter" id="errors">Errors');
                expect(res.text).to.include('<code>GET /api/helloworld</code>');
                done();
            });
        });
        it('renders the ratelimits docs', done => {
            test().end((err, res) => {
                expect(res.text).to.include('<h1 class="is-size-4 has-text-grey-lighter" id="ratelimits">Ratelimits');
                expect(res.text).to.include('<code>HTTP Status: 429 Too Many Requests</code>');
                done();
            });
        });
    });

    describe('POST', () => {
        const test = () => request().post('/api/docs');
        it('returns a Not Found status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
        });
        it('has a permissive CORS header', done => {
            test().end((err, res) => {
                expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                done();
            });
        });
        it('returns an error JSON body', done => {
            test().end((err, res) => {
                expect(res).to.be.json;
                expect(res.body).to.have.property('error', true);
                expect(res.body).to.have.property('status', 404);
                expect(res.body).to.have.property('message', 'Endpoint not found');
                done();
            });
        });
    });
});

describe('/api/docs/libs', () => {
    describe('GET', () => {
        const test = () => request().get('/api/docs/libs');
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('has no CORS header', done => {
            test().end((err, res) => {
                expect(res).to.not.have.header('Access-Control-Allow-Origin');
                done();
            });
        });
        it('has the correct page title', done => {
            test().end((err, res) => {
                expect(res).to.be.html;
                titleCheck(res, `Libraries - API Docs - ${locale('site_name')} - ${locale('short_desc')}`);
                done();
            });
        });
        it('renders the expected header content', done => {
            test().end((err, res) => {
                expect(res).to.be.html;

                // Confirm header
                expect(res.text).to.include('API Libraries');
                expect(res.text).to.include('Some libraries have been written making use of');

                // Confirm menu
                expect(res.text).to.include('<aside class="menu">');
                expect(res.text).to.include('<p class="menu-label">');
                expect(res.text).to.include('<ul class="menu-list">');

                done();
            });
        });
    });

    describe('POST', () => {
        const test = () => request().post('/api/docs/libs');
        it('returns a Not Found status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
        });
        it('has a permissive CORS header', done => {
            test().end((err, res) => {
                expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                done();
            });
        });
        it('returns an error JSON body', done => {
            test().end((err, res) => {
                expect(res).to.be.json;
                expect(res.body).to.have.property('error', true);
                expect(res.body).to.have.property('status', 404);
                expect(res.body).to.have.property('message', 'Endpoint not found');
                done();
            });
        });
    });
});

describe('/api/lists', () => {
    describe('GET', () => {
        const test = () => ratelimitBypass(request().get('/api/lists'));
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('has a permissive CORS header', done => {
            test().end((err, res) => {
                expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                done();
            });
        });
        it('returns a valid JSON body', done => {
            test().end((err, res) => {
                expect(res).to.be.json;
                done();
            });
        });
        it('contains an object of objects', done => {
            test().end((err, res) => {
                expect(res.body).to.be.a('object');
                expect(Object.values(res.body)[0]).to.be.a('object');
                done();
            });
        });
        it('has objects with correct list properties', done => {
            test().end((err, res) => {
                const entries = Object.values(res.body);
                entries.forEach(entry => {
                    expect(entry).to.have.property('api_docs');
                    expect(entry).to.have.property('api_post');
                    expect(entry).to.have.property('api_field');
                    expect(entry).to.have.property('api_shard_id');
                    expect(entry).to.have.property('api_shard_count');
                    expect(entry).to.have.property('api_shards');
                    expect(entry).to.have.property('api_get');
                });
                done();
            });
        });
    });

    describe('GET w/ ?filter=true', () => {
        const test = () => ratelimitBypass(request().get('/api/lists').query({ filter: true }));
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('has a permissive CORS header', done => {
            test().end((err, res) => {
                expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                done();
            });
        });
        it('returns a valid JSON body', done => {
            test().end((err, res) => {
                expect(res).to.be.json;
                done();
            });
        });
        it('has no objects with all values as null', done => {
            test().end((err, res) => {
                const entries = Object.values(res.body);
                entries.forEach(entry => {
                    const vals = Object.values(entry).filter(val => val !== null);
                    expect(vals.length).to.not.equal(0);
                });
                done();
            });
        });
    });

    describe('GET (Ratelimited)', () => {
        const test = () => request().get('/api/lists');
        it('ratelimits spam requests', done => {
            resetRatelimits().end(() => {
                test().end(() => {
                });
                setTimeout(() => {
                    test().end((err, res) => {
                        expect(res).to.have.status(429);
                        expect(res).to.be.json;

                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 429);

                        expect(res.body).to.have.property('retry_after');
                        expect(res.body.retry_after).to.be.a('number');

                        expect(res.body).to.have.property('ratelimit_reset');
                        expect(res.body.ratelimit_reset).to.be.a('number');

                        expect(res.body).to.have.property('ratelimit_ip');
                        expect(res.body.ratelimit_ip).to.be.a('string');

                        expect(res.body).to.have.property('ratelimit_route', '/api/lists');
                        expect(res.body).to.have.property('ratelimit_bot_id', '');
                        done();
                    });
                }, 200);
            });
        });
        it('does not ratelimit requests spaced correctly', function (done) {
            ratelimitTest(this, 1, test, done);
        });
    });

    describe('POST', () => {
        const test = () => ratelimitBypass(request().post('/api/lists'));
        it('returns a Not Found status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
        });
        it('has a permissive CORS header', done => {
            test().end((err, res) => {
                expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                done();
            });
        });
        it('returns an error JSON body', done => {
            test().end((err, res) => {
                expect(res).to.be.json;
                expect(res.body).to.have.property('error', true);
                expect(res.body).to.have.property('status', 404);
                expect(res.body).to.have.property('message', 'Endpoint not found');
                done();
            });
        });
    });
});

describe('/api/count', () => {
    describe('GET', () => {
        const test = () => ratelimitBypass(request().get('/api/count'));
        it('returns a Not Found status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
        });
        it('has a permissive CORS header', done => {
            test().end((err, res) => {
                expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                done();
            });
        });
        it('returns an error JSON body', done => {
            test().end((err, res) => {
                expect(res).to.be.json;
                expect(res.body).to.have.property('error', true);
                expect(res.body).to.have.property('status', 404);
                expect(res.body).to.have.property('message', 'Endpoint not found');
                done();
            });
        });
    });

    describe('POST', () => {
        describe('Invalid body', () => {
            describe('Random string body content', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send('Hello world'));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', '\'bot_id\' is required');
                        done();
                    });
                });
            });

            describe('Missing bot_id (empty body)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({}));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', '\'bot_id\' is required');
                        done();
                    });
                });
            });

            describe('bot_id as random string (valid server_count)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: 'Hello world',
                    server_count: 10
                }));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', '\'bot_id\' must be a snowflake');
                        done();
                    });
                });
            });

            describe('bot_id as an integer (valid server_count)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: 123456789,
                    server_count: 10
                }));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', '\'bot_id\' must be a string');
                        done();
                    });
                });
            });

            describe('bot_id as not a valid snowflake (valid server_count)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '12345',
                    server_count: 10
                }));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', '\'bot_id\' must be a snowflake');
                        done();
                    });
                });
            });

            describe('Missing server_count (valid bot_id)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789'
                }));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', '\'server_count\' is required');
                        done();
                    });
                });
            });

            describe('server_count as random string (valid bot_id)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789',
                    server_count: 'Hello world'
                }));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', '\'server_count\' must be a number');
                        done();
                    });
                });
            });

            describe('shard_id as random string (valid bot_id & server_count)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789',
                    server_count: 10,
                    shard_id: 'Hello world'
                }));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', '\'shard_id\' must be a number');
                        done();
                    });
                });
            });

            describe('shards as random string (valid bot_id & server_count)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789',
                    server_count: 10,
                    shards: 'Hello world'
                }));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', '\'shards\' must be an array');
                        done();
                    });
                });
            });

            describe('shards as an array with random string (valid bot_id & server_count)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789',
                    server_count: 10,
                    shards: ['Hello world']
                }));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', '\'shards\' contains incorrect values');
                        done();
                    });
                });
            });

            describe('shard_count as random string (valid bot_id & server_count)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789',
                    server_count: 10,
                    shard_count: 'Hello world'
                }));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', '\'shard_count\' must be a number');
                        done();
                    });
                });
            });
        });

        describe('Valid body', () => {
            describe('String bot_id w/ no tokens', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789',
                    server_count: 10
                }));
                it('returns an OK status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(200);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns a valid JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        done();
                    });
                });
                it('contains success and failure objects', done => {
                    test().end((err, res) => {
                        expect(res.body).to.have.property('success');
                        expect(res.body).to.have.property('failure');
                        done();
                    });
                });
            });

            describe('Fake list ID with fake token', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789',
                    server_count: 10,
                    'mytestlist.com': 'Hello world'
                }));
                it('returns a valid response', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('success');
                        expect(res.body).to.have.property('failure');
                        done();
                    });
                });
                it('does not contain fake list ID in successes or failures', done => {
                    test().end((err, res) => {
                        expect(res.body.success).to.not.have.property('mytestlist.com');
                        expect(res.body.failure).to.not.have.property('mytestlist.com');
                        done();
                    });
                });
            });

            describe('Legacy list ID with fake token', () => {
                let id, target, test;
                before('fetch list data', done => {
                    db.select().from('legacy_ids').limit(1).then(legacy => {
                        id = legacy[0].id;
                        target = legacy[0].target;
                        const data = {
                            bot_id: '123456789123456789',
                            server_count: 10
                        };
                        data[id] = 'Hello world';
                        test = () => ratelimitBypass(request().post('/api/count').send(data));
                        done();
                    });
                });
                it('returns a valid response', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('success');
                        expect(res.body).to.have.property('failure');
                        done();
                    });
                });
                it('contains the correct target id for the legacy id', done => {
                    test().end((err, res) => {
                        const keys = [...Object.keys(res.body.success), ...Object.keys(res.body.failure)];
                        expect(keys).to.contain(target);
                        expect(keys).to.not.contain(id);
                        done();
                    });
                });
            });

            // This suite will need updating if this list changes
            describe('Valid list ID with fake token and fake bot ID', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789',
                    server_count: 10,
                    'botlist.space': 'Hello world' // TODO: Use DB
                }));
                it('returns a valid response', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('success');
                        expect(res.body).to.have.property('failure');
                        done();
                    });
                });
                it('contains list ID and data array in failures object and not in successes', done => {
                    test().end((err, res) => {
                        expect(res.body.failure).to.have.property('botlist.space'); // TODO: Use DB
                        expect(res.body.failure['botlist.space']).to.be.an('array'); // TODO: Use DB
                        expect(res.body.failure['botlist.space'].length).to.be.equal(3); // TODO: Use DB
                        expect(res.body.success).to.not.have.property('botlist.space'); // TODO: Use DB
                        done();
                    });
                });
                it('contains a valid status code in the list failure', done => {
                    test().end((err, res) => {
                        expect(res.body.failure['botlist.space'][0]).to.be.a('number'); // TODO: Use DB
                        done();
                    });
                });
                it('contains the correct JSON body that was sent to the list', done => {
                    test().end((err, res) => {
                        expect(res.body.failure['botlist.space'][2]).to.be.equal('{"server_count":10}'); // TODO: Use DB
                        done();
                    });
                });
            });
        });
    });

    describe('POST (Ratelimited)', () => {
        it('ratelimits spam requests', done => {
            const test = () => request().post('/api/count').send({
                bot_id: '123456789123456789'
            });
            resetRatelimits().end(() => {
                test().end(() => {
                });
                setTimeout(() => {
                    test().end((err, res) => {
                        expect(res).to.have.status(429);
                        expect(res).to.be.json;

                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 429);

                        expect(res.body).to.have.property('retry_after');
                        expect(res.body.retry_after).to.be.a('number');

                        expect(res.body).to.have.property('ratelimit_reset');
                        expect(res.body.ratelimit_reset).to.be.a('number');

                        expect(res.body).to.have.property('ratelimit_ip');
                        expect(res.body.ratelimit_ip).to.be.a('string');

                        expect(res.body).to.have.property('ratelimit_route', '/api/count');
                        expect(res.body).to.have.property('ratelimit_bot_id', '123456789123456789');
                        done();
                    });
                }, 200);
            });
        });
        it.skip('does not use invalid bot ID in ratelimit', done => { // TODO: this test needs fixing
            const test = () => request().post('/api/count').send({
                bot_id: 12345
            });
            resetRatelimits().end(() => {
                test().end(() => {
                });
                setTimeout(() => {
                    test().end((err, res) => {
                        expect(res).to.have.status(429);
                        expect(res).to.be.json;

                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 429);

                        expect(res.body).to.have.property('retry_after');
                        expect(res.body.retry_after).to.be.a('number');

                        expect(res.body).to.have.property('ratelimit_reset');
                        expect(res.body.ratelimit_reset).to.be.a('number');

                        expect(res.body).to.have.property('ratelimit_ip');
                        expect(res.body.ratelimit_ip).to.be.a('string');

                        expect(res.body).to.have.property('ratelimit_route', '/api/count');
                        expect(res.body).to.have.property('ratelimit_bot_id', '');
                        done();
                    });
                }, 200);
            });
        });
        it('does not ratelimit requests spaced correctly', function (done) {
            const test = () => request().post('/api/count').send({
                bot_id: '123456789123456789',
                server_count: 10
            });
            ratelimitTest(this, 120, test, done);
        });
    });
});

describe('/api/bots/:id', () => {
    describe('GET', () => {
        describe('Invalid requests', () => {
            describe('No bot ID in URL', () => {
                const test = () => ratelimitBypass(request().get('/api/bots/'));
                it('returns an Not Found status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(404);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns an error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 404);
                        expect(res.body).to.have.property('message', 'Endpoint not found');
                        done();
                    });
                });
            });

            describe('Bot ID as a random string', () => {
                const test = () => ratelimitBypass(request().get('/api/bots/helloworld'));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', '\'id\' must be a snowflake');
                        done();
                    });
                });
            });

            describe('Bot ID as not a valid snowflake', () => {
                const test = () => ratelimitBypass(request().get('/api/bots/12345'));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('has a permissive CORS header', done => {
                    test().end((err, res) => {
                        expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', '\'id\' must be a snowflake');
                        done();
                    });
                });
            });
        });

        describe('Valid request (AltDentifier 372022813839851520)', function () {
            this.slow(15 * 1000);
            this.timeout(20 * 1000);
            const test = () => ratelimitBypass(request().get('/api/bots/372022813839851520'));
            it('returns an OK status code', done => {
                test().end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
            });
            it('has a permissive CORS header', done => {
                test().end((err, res) => {
                    expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                    done();
                });
            });
            it('returns a valid JSON body', done => {
                test().end((err, res) => {
                    expect(res).to.be.json;
                    done();
                });
            });
            it('contains the correct response body structure', done => {
                test().end((err, res) => {
                    expect(res.body).to.have.property('id', '372022813839851520');
                    expect(res.body).to.have.property('username', 'AltDentifier');
                    expect(res.body).to.have.property('discriminator', '5594');

                    expect(res.body).to.have.property('owners');
                    expect(res.body.owners).to.be.an('array');
                    expect(res.body.owners).to.contain('66166172835385344');

                    expect(res.body).to.have.property('server_count');
                    expect(res.body.server_count).to.be.a('number');

                    expect(res.body).to.have.property('invite');
                    expect(res.body.invite).to.be.a('string');

                    expect(res.body).to.have.property('prefix');
                    expect(res.body.prefix).to.be.a('string');

                    expect(res.body).to.have.property('website');
                    expect(res.body.website).to.be.a('string');
                    expect(res.body.website).equal('https://altdentifier.com');

                    expect(res.body).to.have.property('github');
                    expect(res.body.github).to.be.a('string');

                    expect(res.body).to.have.property('support');
                    expect(res.body.support).to.be.a('string');

                    expect(res.body).to.have.property('library');
                    expect(res.body.library).to.be.a('string');
                    expect(res.body.library).equal('discord.py');

                    expect(res.body).to.have.property('list_data');
                    expect(res.body.list_data).to.be.an('object');

                    const list_data = Object.values(res.body.list_data);
                    list_data.forEach(list => {
                        expect(list).to.be.an('array');
                        expect(list[1]).to.be.a('number');
                    });

                    done();
                });
            });
        });

        describe('Valid request (Test ID 12345678901234567890)', function () {
            this.slow(15 * 1000);
            this.timeout(20 * 1000);
            const test = () => ratelimitBypass(request().get('/api/bots/12345678901234567890'));
            it('does not have cached data for the first request', done => {
                db('cache').where({ route: '/api/bots/12345678901234567890' }).del().then(() => {
                    test().end((err, res) => {
                        expect(res.body).to.have.property('id', '12345678901234567890');
                        expect(res.body).to.have.property('cached', false);
                        done();
                    });
                });
            });
            it('uses cached data for any subsequent request', done => {
                test().end((err, res) => {
                    expect(res.body).to.have.property('id', '12345678901234567890');
                    expect(res.body).to.have.property('cached', true);
                    done();
                });
            });
        });
    });

    describe('GET (Ratelimited)', () => {
        const test = () => request().get('/api/bots/123456789123456789');
        it('ratelimits spam requests', function (done) {
            this.slow(15 * 1000);
            this.timeout(20 * 1000);
            resetRatelimits().end(() => {
                test().end(() => {
                });
                setTimeout(() => {
                    test().end((err, res) => {
                        expect(res).to.have.status(429);
                        expect(res).to.be.json;

                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 429);

                        expect(res.body).to.have.property('retry_after');
                        expect(res.body.retry_after).to.be.a('number');

                        expect(res.body).to.have.property('ratelimit_reset');
                        expect(res.body.ratelimit_reset).to.be.a('number');

                        expect(res.body).to.have.property('ratelimit_ip');
                        expect(res.body.ratelimit_ip).to.be.a('string');

                        expect(res.body).to.have.property('ratelimit_route', '/api/bots/123456789123456789');
                        expect(res.body).to.have.property('ratelimit_bot_id', '');
                        done();
                    });
                }, 200);
            });
        });
        it('does not ratelimit requests spaced correctly', function (done) {
            ratelimitTest(this, 30, test, done);
        });
    });

    describe('POST', () => {
        const test = () => ratelimitBypass(request().post('/api/bots/123456789123456789'));
        it('returns a Not Found status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
        });
        it('has a permissive CORS header', done => {
            test().end((err, res) => {
                expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                done();
            });
        });
        it('returns an error JSON body', done => {
            test().end((err, res) => {
                expect(res).to.be.json;
                expect(res.body).to.have.property('error', true);
                expect(res.body).to.have.property('status', 404);
                expect(res.body).to.have.property('message', 'Endpoint not found');
                done();
            });
        });
    });
});

describe('/api/legacy-ids', () => {
    describe('GET', () => {
        const test = () => ratelimitBypass(request().get('/api/legacy-ids'));
        it('returns an OK status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('has a permissive CORS header', done => {
            test().end((err, res) => {
                expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                done();
            });
        });
        it('returns a valid JSON body', done => {
            test().end((err, res) => {
                expect(res).to.be.json;
                done();
            });
        });
        it('contains an object of strings', done => {
            test().end((err, res) => {
                expect(res.body).to.be.a('object');
                const entries = Object.values(res.body);
                entries.forEach(entry => {
                    expect(entry).to.be.a('string');
                });
                done();
            });
        });
    });

    describe('GET (Ratelimited)', () => {
        const test = () => request().get('/api/legacy-ids');
        it('ratelimits spam requests', done => {
            resetRatelimits().end(() => {
                test().end(() => {
                });
                setTimeout(() => {
                    test().end((err, res) => {
                        expect(res).to.have.status(429);
                        expect(res).to.be.json;

                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 429);

                        expect(res.body).to.have.property('retry_after');
                        expect(res.body.retry_after).to.be.a('number');

                        expect(res.body).to.have.property('ratelimit_reset');
                        expect(res.body.ratelimit_reset).to.be.a('number');

                        expect(res.body).to.have.property('ratelimit_ip');
                        expect(res.body.ratelimit_ip).to.be.a('string');

                        expect(res.body).to.have.property('ratelimit_route', '/api/legacy-ids');
                        expect(res.body).to.have.property('ratelimit_bot_id', '');
                        done();
                    });
                }, 200);
            });
        });
        it('does not ratelimit requests spaced correctly', function (done) {
            ratelimitTest(this, 1, test, done);
        });
    });

    describe('POST', () => {
        const test = () => ratelimitBypass(request().post('/api/legacy-ids'));
        it('returns a Not Found status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
        });
        it('has a permissive CORS header', done => {
            test().end((err, res) => {
                expect(res).to.have.header('Access-Control-Allow-Origin', '*');
                done();
            });
        });
        it('returns an error JSON body', done => {
            test().end((err, res) => {
                expect(res).to.be.json;
                expect(res.body).to.have.property('error', true);
                expect(res.body).to.have.property('status', 404);
                expect(res.body).to.have.property('message', 'Endpoint not found');
                done();
            });
        });
    });
});
