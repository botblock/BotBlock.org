const { describe, it, expect } = require('../base');
const { slugify, librarySlug } = require('../../src/Util/slugs');

describe('Slugs', () => {
    describe('Slugify', () => {
        it('converts periods correctly to hyphens', done => {
            const test = slugify('hello.world');
            expect(test).to.equal('hello-world');
            done();
        });

        it('converts spaces correctly to hyphens', done => {
            const test = slugify('hello world');
            expect(test).to.equal('hello-world');
            done();
        });

        it('converts hash correctly to "sharp"', done => {
            const test = slugify('hello#');
            expect(test).to.equal('hellosharp');
            done();
        });

        it('forces everything to be lowercase', done => {
            const test = slugify('HelloWorld');
            expect(test).to.equal('helloworld');
            done();
        });
    });

    describe('Library Slug', () => {
        it('uses the name and language of a library', done => {
            const test = librarySlug({
                repo: 'botblock/hello.world',
                language: 'Javascript',
                name: 'Hello.World',
                description: 'Hello World. This is a test library.',
                package_link: 'https://package.manager/hello-world',
                package_link_name: 'Package Manager',
                badge_image: 'https://img.shields.io/pypi/v/discordlists.py.svg?style=flat-square',
                badge_url: 'https://img.shields.io/pypi/v/discordlists.py.svg?style=flat-square',
                example_usage: 'const helloWorld = require(\'hello.world\');\n\nhelloWorld.post()'
            });
            expect(test).to.equal('javascript-hello-world');
            done();
        });
    });
});
