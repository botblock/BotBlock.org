const {describe, it, expect, request, ratelimitBypass} = require('../base');

describe('/api/lists', () => {
    describe('GET', () => {
        const test = () => ratelimitBypass(request().get('/api/lists'));
        it('returns an OK status code', () => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
            });
        });
        it('returns a valid JSON body', () => {
            test().end((err, res) => {
                expect(res).to.be.json;
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
});

describe('/api/count', () => {
    describe('GET', () => {
        const test = () => ratelimitBypass(request().get('/api/count'));
        it('returns a Not Found status code', () => {
            test().end((err, res) => {
                expect(res).to.have.status(404);
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
                it('returns a Bad Request status code', () => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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
                it('returns a Bad Request status code', () => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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
                it('returns a Bad Request status code', () => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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
                it('returns a Bad Request status code', () => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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

            describe('bot_id as not a valid snowflake (valid server_count)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '12345',
                    server_count: 10}));
                it('returns a Bad Request status code', () => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
                    });
                });
                // Known issue - We don't validate this yet
                it.skip('returns a correct error JSON body', done => {
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
                it('returns a Bad Request status code', () => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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
                it('returns a Bad Request status code', () => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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
                it('returns a Bad Request status code', () => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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
                it('returns a Bad Request status code', () => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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

            // Known issue - We don't have this supported in rewrite yet
            describe.skip('shard_count as random string (valid bot_id & server_count)', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789',
                    server_count: 10,
                    shard_count: 'Hello world'}));
                it('returns a Bad Request status code', () => {
                    test().end((err, res) => {
                        expect(res).to.have.status(400);
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
                it('returns an OK status code', () => {
                    test().end((err, res) => {
                        expect(res).to.have.status(200);
                    });
                });
                it('returns a valid JSON body', () => {
                    test().end((err, res) => {
                        expect(res).to.be.json;
                    });
                });
                it('contains success and failure objects', () => {
                    test().end((err, res) => {
                        expect(res.body).to.have.property('success');
                        expect(res.body).to.have.property('failure');
                    });
                });
            });

            describe('Fake list ID with fake token', () => {
                const test = () => ratelimitBypass(request().post('/api/count').send({
                    bot_id: '123456789123456789',
                    server_count: 10,
                    my_test_list: 'Hello world'}));
                it('returns a valid response', done => {
                    test().end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('success');
                        expect(res.body).to.have.property('failure');
                        done();
                    });
                });
                it('does not contain fake list ID in successes or failures', () => {
                    test().end((err, res) => {
                        expect(res.body.success).to.not.have.property('my_test_list');
                        expect(res.body.failure).to.not.have.property('my_test_list');
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
                it('contains list ID and data array in failures object and not in successes', () => {
                    test().end((err, res) => {
                        expect(res.body.failure).to.have.property('discordbots.group');
                        expect(res.body.failure['discordbots.group']).to.be.an('array');
                        expect(res.body.success).to.not.have.property('discordbots.group');
                    });
                });
                it('contains a valid status code in the list failure', () => {
                    test().end((err, res) => {
                        expect(res.body.failure['discordbots.group'][0]).to.be.a('number');
                    });
                });
                it('contains the correct JSON body that was sent to the list', () => {
                    test().end((err, res) => {
                        expect(res.body.failure['discordbots.group'][2]).to.be.equal('{"server_count":10}') // TODO: pull from DB
                    });
                });
            });
        });
    });
});
