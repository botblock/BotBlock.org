const { expect } = require('chai');
const locale = require('../../src/Util/i18n').__;
const { resetRatelimits } = require('./ratelimits');

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

module.exports = { ratelimit, authRequired, title };
