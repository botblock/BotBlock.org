const { describe, it, expect, target, secret } = require('./base');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const launchChromeAndRunLighthouse = (url, opts, config = null) => {
    return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
        opts.port = chrome.port;
        return lighthouse(url, opts, config).then(results => {
            return chrome.kill().then(() => results.lhr)
        });
    });
};

const runLighthouse = (type, indent) => {
    const baseConfig = type === 'mobile' ? require('lighthouse/lighthouse-core/config/lr-mobile-config') : (type === 'desktop' ? require('lighthouse/lighthouse-core/config/lr-desktop-config') : require('lighthouse/lighthouse-core/config/default-config'));

    baseConfig.settings.extraHeaders = {
        'X-Disable-Adsense': secret
    };

    /*baseConfig.settings.onlyCategories = [
        'accessibility',
        'best-practices',
        'performance',
        'seo'
    ];*/

    baseConfig.settings.skipAudits.push(...[
        'is-on-https', // Fails on localhost dev env
        'redirects-http', // Fails on localhost dev env
        'uses-http2' // Fails on localhost dev env
    ]);

    return launchChromeAndRunLighthouse(target, {}, baseConfig).then(results => {
        console.log(indent);
        console.log(`${indent}Non-perfect audits:`);
        console.log(Object.values(results.audits)
            .filter(x => x.score !== 1 && x.score !== null)
            .map(x => `${indent}  ${x.title}: ${x.displayValue} (${x.id}: ${x.score})`)
            .join("\n"));
        console.log(`${indent}Categories:`);
        console.log(Object.values(results.categories)
            .map(x => `${indent}  ${x.title}: ${x.score}`)
            .join("\n"));
        console.log(indent);
        return results
    });
};

describe('Lighthouse', () => {
    describe('Mobile', () => {
        let result;

        before('Run test', function (done) {
            this.slow(0);
            this.timeout(0);

            runLighthouse('mobile', '      ').then(results => {
                result = results;
                done();
            });
        });

        it('scores 0.95 or above in Performance', done => {
            expect(result.categories['performance'].score).to.be.at.least(0.95);
            done();
        });

        it('scores 0.95 or above in Accessibility', done => {
            expect(result.categories['accessibility'].score).to.be.at.least(0.95);
            done();
        });

        it('scores 0.99 or above in Best Practices', done => {
            expect(result.categories['best-practices'].score).to.be.at.least(0.99);
            done();
        });

        it('scores 0.95 or above in SEO', done => {
            expect(result.categories['seo'].score).to.be.at.least(0.95);
            done();
        });
    });

    describe('Desktop', () => {
        let result;

        before('Run test', function (done) {
            this.slow(0);
            this.timeout(0);

            runLighthouse('desktop', '      ').then(results => {
                result = results;
                done();
            });
        });

        it('scores 0.99 or above in Performance', done => {
            expect(result.categories['performance'].score).to.be.at.least(0.99);
            done();
        });

        it('scores 0.90 or above in Accessibility', done => {
            expect(result.categories['accessibility'].score).to.be.at.least(0.90);
            done();
        });

        it('scores 0.99 or above in Best Practices', done => {
            expect(result.categories['best-practices'].score).to.be.at.least(0.99);
            done();
        });

        it('scores 0.99 or above in SEO', done => {
            expect(result.categories['seo'].score).to.be.at.least(0.99);
            done();
        });
    });
});
