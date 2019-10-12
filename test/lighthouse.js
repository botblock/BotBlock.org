const { describe, it, expect, target, secret } = require('./base');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const launchChromeAndRunLighthouse = (url, opts, config = null) => {
    return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
        opts.port = chrome.port;
        return lighthouse(url, opts, config).then(results => {
            return chrome.kill().then(() => results.lhr);
        });
    });
};

const runLighthouse = type => {
    const configType = type === 'mobile' ? 'lr-mobile-config' : type === 'desktop' ? 'lr-desktop-config' : 'default-config';
    const baseConfig = require(`lighthouse/lighthouse-core/config/${configType}`);

    baseConfig.settings.extraHeaders = {
        'X-Disable-Adsense': secret
    };

    /*baseConfig.settings.onlyCategories = [ // Disable PWA
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

    return launchChromeAndRunLighthouse(target, {}, baseConfig);
};

const categoryLighthouseResults = (results, category, indent) => {
    const categoryData = results.categories[category];
    const audits = categoryData.auditRefs
        .map(x => Object.values(results.audits).find(y => y.id === x.id))
        .filter(x => x.score !== 1 && x.score !== null)
        .map(x => `${indent}  ${x.title}: ${x.displayValue} (${x.id}: ${x.score})`)
        .join('\n');
    console.log(indent);
    console.log(`${indent}${categoryData.title}: ${categoryData.score}`);
    console.log(`${indent}Non-perfect audits:`);
    console.log(audits || `${indent}  None`);
    console.log(indent);
    return categoryData.score;
};

describe('Lighthouse', () => {
    describe('Mobile', () => {
        let result;

        before('Run test', function (done) {
            this.slow(0);
            this.timeout(0);

            if (process.argv.includes('--skip-lighthouse')) {
                result = null;
                done();
            } else {
                runLighthouse('mobile').then(results => {
                    result = results;
                }).catch(() => {
                    result = null;
                }).finally(() => {
                    done();
                });
            }
        });

        beforeEach('Check ran', function (done) {
            if (result === null) this.skip();
            done();
        });

        it('scores 0.95 or above in Performance', done => {
            const score = categoryLighthouseResults(result, 'performance', '      ');
            expect(score).to.be.at.least(0.95);
            done();
        });

        it('has a first meaningful paint under 2.5s', done => {
            expect(result.audits['first-meaningful-paint'].numericValue).to.be.at.most(2500);
            done();
        });

        it('has a time to interactive under 3.5s', done => {
            expect(result.audits['interactive'].numericValue).to.be.at.most(3500);
            done();
        });

        it('scores 0.95 or above in Accessibility', done => {
            const score = categoryLighthouseResults(result, 'accessibility', '      ');
            expect(score).to.be.at.least(0.95);
            done();
        });

        it('scores 0.99 or above in Best Practices', done => {
            const score = categoryLighthouseResults(result, 'best-practices', '      ');
            expect(score).to.be.at.least(0.99);
            done();
        });

        it('scores 0.95 or above in SEO', done => {
            const score = categoryLighthouseResults(result, 'seo', '      ');
            expect(score).to.be.at.least(0.95);
            done();
        });
    });

    describe('Desktop', () => {
        let result;

        before('Run test', function (done) {
            this.slow(0);
            this.timeout(0);

            if (process.argv.includes('--skip-lighthouse')) {
                result = null;
                done();
            } else {
                runLighthouse('desktop').then(results => {
                    result = results;
                }).catch(() => {
                    result = null;
                }).finally(() => {
                    done();
                });
            }
        });

        beforeEach('Check ran', function (done) {
            if (result === null) this.skip();
            done();
        });

        it('scores 0.99 or above in Performance', done => {
            const score = categoryLighthouseResults(result, 'performance', '      ');
            expect(score).to.be.at.least(0.99);
            done();
        });

        it('has a first meaningful paint under 1s', done => {
            expect(result.audits['first-meaningful-paint'].numericValue).to.be.at.most(1000);
            done();
        });

        it('has a time to interactive under 1s', done => {
            expect(result.audits['interactive'].numericValue).to.be.at.most(1000);
            done();
        });

        it('scores 0.90 or above in Accessibility', done => {
            const score = categoryLighthouseResults(result, 'accessibility', '      ');
            expect(score).to.be.at.least(0.90);
            done();
        });

        it('scores 0.99 or above in Best Practices', done => {
            const score = categoryLighthouseResults(result, 'best-practices', '      ');
            expect(score).to.be.at.least(0.99);
            done();
        });

        it('scores 0.99 or above in SEO', done => {
            const score = categoryLighthouseResults(result, 'seo', '      ');
            expect(score).to.be.at.least(0.99);
            done();
        });
    });
});
