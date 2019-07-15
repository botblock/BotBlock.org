const {describe, it, expect, request, ratelimitBypass} = require('../base');

describe('Invalid route (/api/helloworld)', () => {
    describe('GET', () => {
        const test = () => ratelimitBypass(request().get('/api/helloworld'));
        it('returns a Not Found status code', done => {
            test().end((err, res) => {
                expect(res).to.have.status(404);
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
                const obj = Object.values(res.body)[0];
                expect(obj).to.have.property('api_docs');
                expect(obj).to.have.property('api_post');
                expect(obj).to.have.property('api_field');
                expect(obj).to.have.property('api_shard_id');
                expect(obj).to.have.property('api_shard_count');
                expect(obj).to.have.property('api_shards');
                expect(obj).to.have.property('api_get');
                done();
            });
        });
    });

    describe('GET (Ratelimited)', () => {
        const test = () => request().get('/api/lists');
        it('ratelimits spam requests', done => {
            test().end(() => {
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
            });
        });
        it('does not ratelimit requests spaced correctly', function(done) {
            const limit = 1;
            this.slow(limit * 1000 + 1000);
            this.timeout(limit * 1000 + 1500);
            test().end(() => {
                setTimeout(() => {
                    test().end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        done();
                    });
                }, limit * 1000);
            });
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
                // Known issue currently - returns a HTML 400
                it.skip('returns a correct error JSON body', done => {
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

            describe('Missing server_count (valid bot_id)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789'}));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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

            describe('bot_id as random string (valid server_count)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: 'Hello world',
                    server_count: 10}));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', '\'bot_id\' must be a number');
                        done();
                    });
                });
            });

            // Known issue - We don't validate this yet
            describe.skip('bot_id as not a valid snowflake (valid server_count)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '12345',
                    server_count: 10}));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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

            describe('server_count as random string (valid bot_id)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789',
                    server_count: 'Hello world'}));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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
                    shard_id: 'Hello world'}));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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
                    shards: 'Hello world'}));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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
                    shards: ['Hello world']}));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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
                    shard_count: 'Hello world'}));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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
            describe('No list tokens', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789',
                    server_count: 10}));
                it('returns an OK status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(200);
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
                    'mytestlist.com': 'Hello world'}));
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

            describe('Valid list ID with fake token and fake bot ID', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789',
                    server_count: 10,
                    'discordbots.group': 'Hello world'})); // TODO: pull from DB
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
                        expect(res.body.failure).to.have.property('discordbots.group');
                        expect(res.body.failure['discordbots.group']).to.be.an('array');
                        expect(res.body.failure['discordbots.group'].length).to.be.equal(3);
                        expect(res.body.success).to.not.have.property('discordbots.group');
                        done();
                    });
                });
                it('contains a valid status code in the list failure', done => {
                    test().end((err, res) => {
                        expect(res.body.failure['discordbots.group'][0]).to.be.a('number');
                        done();
                    });
                });
                it('contains the correct JSON body that was sent to the list', done => {
                    test().end((err, res) => {
                        expect(res.body.failure['discordbots.group'][2]).to.be.equal('{"server_count":10}') // TODO: pull from DB
                        done();
                    });
                });
            });
        });
    });

    describe('POST (Ratelimited)', () => {
        const test = () => request().post('/api/count').send({
            bot_id: '123456789123456789',
            server_count: 10,
            'mytestlist.com': 'Hello world'});
        it('ratelimits spam requests', done => {
            test().end(() => {
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
            });
        });
        it('does not ratelimit requests spaced correctly', function(done) {
            const limit = 120;
            this.slow(limit * 1000 + 1000);
            this.timeout(limit * 1000 + 1500);
            test().end(() => {
                setTimeout(() => {
                    test().end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        done();
                    });
                }, limit * 1000);
            });
        });
    });
});

// Known issue - not yet implemented
describe.skip('/api/bots/:id', () => {
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

            describe('Random string bot ID', () => {
                const test = () => ratelimitBypass(request().get('/api/bots/helloworld'));
                it('returns a Bad Request status code', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
                });
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', 'Bot ID must be a number');
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
                it('returns a correct error JSON body', done => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('error', true);
                        expect(res.body).to.have.property('status', 400);
                        expect(res.body).to.have.property('message', 'Bot ID must be a snowflake');
                        done();
                    });
                });
            });
        });

        describe('Valid request (MEE6 159985870458322944)', () => {
            const test = () => ratelimitBypass(request().get('/api/bots/159985870458322944'));
            it('returns an OK status code', done => {
                test().end((err, res) => {
                    expect(res).to.have.status(200);
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
                    expect(res.body).to.have.property('id', '159985870458322944');
                    expect(res.body).to.have.property('username', 'MEE6');
                    expect(res.body).to.have.property('discriminator', 4876);

                    expect(res.body).to.have.property('owners');
                    expect(res.body.owners).to.be.an('array');

                    expect(res.body).to.have.property('server_count');
                    expect(res.body.server_count).to.be.a('number');

                    expect(res.body).to.have.property('invite');
                    expect(res.body.invite).to.be.a('string');

                    expect(res.body).to.have.property('list_data');
                    expect(res.body.list_data).to.be.an('object');

                    const list_data = Object.values(res.body.list_data)[0];
                    expect(list_data).to.be.an('array');
                    expect(list_data[0]).to.be.an('object');
                    expect(list_data[1]).to.be.a('number');
                    done();
                });
            });
        });
    });

    describe('GET (Ratelimited)', () => {
        const test = () => request().get('/api/bots/123456789123456789');
        it('ratelimits spam requests', done => {
            test().end(() => {
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
            });
        });
        it('does not ratelimit requests spaced correctly', function(done) {
            const limit = 30;
            this.slow(limit * 1000 + 1000);
            this.timeout(limit * 1000 + 1500);
            test().end(() => {
                setTimeout(() => {
                    test().end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        done();
                    });
                }, limit * 1000);
            });
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
