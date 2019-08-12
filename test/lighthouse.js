const { describe, it, expect, target, secret } = require('./base');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const launchChromeAndRunLighthouse = (url, opts, config = null) => {
    return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
        opts.port = chrome.port;
        return lighthouse(url, opts, config).then(results => {
            return chrome.kill().then(() => results.lhr)
        });
    });
};

describe('Lighthouse', () => {
    let result;

    it('runs', function(done) {
        this.slow(0);
        this.timeout(0);

        launchChromeAndRunLighthouse(target, {}, {
            extends: 'lighthouse:default',
            settings: {
                extraHeaders: {
                    'X-Disable-Adsense': secret // TODO: Implement this
                },
                onlyCategories: [
                    'accessibility',
                    'best-practices',
                    'performance',
                    'seo'
                ],
                skipAudits: [
                    'is-on-https', // Fails on localhost dev env
                    'redirects-http', // Fails on localhost dev env
                    'uses-http2' // Fails on localhost dev env
                ]
            }
        }).then(results => {
            result = results;
            done();
        });
    });

    it('scores 0.75 or above in Performance', done => {
        expect(result.categories['performance'].score).to.be.at.least(0.75);
        done();
    });

    it('scores 0.95 or above in Accessibility', done => {
        expect(result.categories['accessibility'].score).to.be.at.least(0.95);
        done();
    });

    it('scores 0.90 or above in Best Practices', done => {
        expect(result.categories['best-practices'].score).to.be.at.least(0.90);
        done();
    });

    it('scores 0.95 or above in SEO', done => {
        expect(result.categories['seo'].score).to.be.at.least(0.95);
        done();
    });
});
