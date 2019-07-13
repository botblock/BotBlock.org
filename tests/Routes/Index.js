const {describe, it, expect, request} = require('../base');

describe('/', () => {
    describe('GET', () => {
        const test = () => request().get('/');
        it('returns an OK status code', () => {
            test().end((err, res) => {
                expect(res).to.have.status(200);
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
