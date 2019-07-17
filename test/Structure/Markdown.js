const {describe, it, expect} = require('../base');
const renderer = new (require('../../src/Structure/Markdown'))();
const i18n = require('../../src/Util/i18n');

const localeCatalog = i18n.getCatalog(i18n.config.defaultLocale);
const localeKeys = Object.keys(localeCatalog);

describe('Markdown Renderer', () => {
    describe('Variables', () => {

        localeKeys.forEach(key => {
            it(`correctly substitutes {{${key}}}`, done => {
                const test = renderer.variables(`{{${key}}}`);
                expect(test).to.equal(localeCatalog[key]);
                done();
            });
        });

        it('renders repeated variables correctly', done => {
            const test = renderer.variables(`{{${localeKeys[0]}}} {{${localeKeys[0]}}}`);
            expect(test).to.equal(`${localeCatalog[localeKeys[0]]} ${localeCatalog[localeKeys[0]]}`);
            done();
        });

        it('renders multiple occurrences of variables correctly', done => {
            const test = renderer.variables(`{{${localeKeys[0]}}} hello world {{${localeKeys[0]}}}`);
            expect(test).to.equal(`${localeCatalog[localeKeys[0]]} hello world ${localeCatalog[localeKeys[0]]}`);
            done();
        });

        it('does not substitute an undefined variable', done => {
            const test = renderer.variables('{{hello world}}');
            expect(test).to.equal('{{hello world}}');
            done();
        });

        it('does not substitute undefined variables when mixed w/ defined variables', done => {
            const test = renderer.variables(`{{${localeKeys[0]}}} {{hello world}} {{${localeKeys[1]}}}`);
            expect(test).to.equal(`${localeCatalog[localeKeys[0]]} {{hello world}} ${localeCatalog[localeKeys[1]]}`);
            done();
        });
    });

    describe('Markdown', () => {
        describe('Links', () => {
            it('converts a markdown link to a html link w/ _blank target', done => {
                const test = renderer.markdown('[test](https://botblock.org)');
                expect(test).to.equal('<p><a href="https://botblock.org" target="_blank">test</a></p>\n');
                done();
            });

            it('converts a plain text link to a html link w/ _blank target', done => {
                const test = renderer.markdown('https://botblock.org');
                expect(test).to.equal('<p><a href="https://botblock.org" target="_blank">https://botblock.org</a></p>\n');
                done();
            });

            it('converts a markdown link w/ nofollow to a html link w/ _blank target & nofollow rel', done => {
                const test = renderer.markdown('[test nofollow](https://botblock.org)');
                expect(test).to.equal('<p><a href="https://botblock.org" target="_blank" rel="nofollow">test</a></p>\n');
                done();
            });
        });
    });

    describe('Render', () => {
        it('substitutes variables correctly', done => {
            const test = renderer.render(`{{${localeKeys[0]}}} {{${localeKeys[1]}}}`);
            expect(test).to.equal(`<p>${localeCatalog[localeKeys[0]]} ${localeCatalog[localeKeys[1]]}</p>`);
            done();
        });

        it('generates html from markdown correctly', done => {
            const test = renderer.render('https://botblock.org');
            expect(test).to.equal('<p><a href="https://botblock.org" target="_blank">https://botblock.org</a></p>\n');
            done();
        });

        it('renders variables and markdown correctly', done => {
            const test = renderer.render(`[{{${localeKeys[0]}}}](https://botblock.org)`);
            expect(test).to.equal(`<p><a href="https://botblock.org" target="_blank">${localeCatalog[localeKeys[0]]}</a></p>\n`);
            done();
        });
    });
});
