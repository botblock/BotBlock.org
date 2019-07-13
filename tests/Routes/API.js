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
