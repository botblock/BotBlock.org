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

        it('renders undefined variables as their contents', done => {
            const test = renderer.variables('{{hello world}}');
            expect(test).to.equal('hello world');
            done();
        });

        it('allows for escaped variables', done => {
            const test = renderer.variables(`{{{{${localeKeys[0]}}}}}`);
            expect(test).to.equal(`{{${localeKeys[0]}}}`);
            done();
        });
    });

    describe('Markdown', () => {
        describe('HTML', () => {
            it('allows existing html to be passed through', done => {
                const test = renderer.markdown('Hello there <b>friend</b>');
                expect(test).to.equal('<p>Hello there <b>friend</b></p>\n');
                done();
            });

            it('follows the xhtml self-closing rules', done => {
                const test = renderer.markdown('![](/image.png)');
                expect(test).to.equal('<p><img src="/image.png" alt="" /></p>\n');
                done();
            });
        });

        describe('Breaks', () => {
            it('converts a single linebreak to a html break', done => {
                const test = renderer.markdown('Line 1\nLine 2');
                expect(test).to.equal('<p>Line 1<br />\nLine 2</p>\n');
                done();
            });

            it('converts a double linebreak to a new html paragraph', done => {
                const test = renderer.markdown('Paragraph 1\n\nParagraph 2');
                expect(test).to.equal('<p>Paragraph 1</p>\n<p>Paragraph 2</p>\n');
                done();
            });
        });

        describe('Links', () => {
            it('does not convert a full plain text link to a html link', done => {
                const test = renderer.markdown('https://botblock.org');
                expect(test).to.equal('<p>https://botblock.org</p>\n');
                done();
            });

            it('does not convert a partial plain text link to a html link', done => {
                const test = renderer.markdown('botblock.org');
                expect(test).to.equal('<p>botblock.org</p>\n');
                done();
            });

            it('converts a markdown link to a html link w/ _blank target', done => {
                const test = renderer.markdown('[test](https://botblock.org)');
                expect(test).to.equal('<p><a href="https://botblock.org" target="_blank">test</a></p>\n');
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
            expect(test).to.equal(`<p>${localeCatalog[localeKeys[0]]} ${localeCatalog[localeKeys[1]]}</p>\n`);
            done();
        });

        it('generates html from markdown correctly', done => {
            const test = renderer.render('[botblock.org](https://botblock.org)');
            expect(test).to.equal('<p><a href="https://botblock.org" target="_blank">botblock.org</a></p>\n');
            done();
        });

        it('renders variables and markdown correctly', done => {
            const test = renderer.render(`[{{${localeKeys[0]}}}](https://botblock.org)`);
            expect(test).to.equal(`<p><a href="https://botblock.org" target="_blank">${localeCatalog[localeKeys[0]]}</a></p>\n`);
            done();
        });
    });
});
