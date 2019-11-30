const builder = require('xmlbuilder');
const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');

const get = async db => {
    // Static pages
    const sitemap = [
        {
            loc: '/',
            priority: 1
        },
        {
            loc: '/api/docs',
            priority: .9
        },
        {
            loc: '/api/libs',
            priority: .9
        },
        {
            loc: '/lists',
            priority: .8
        },
        {
            loc: '/lists/search',
            priority: .8
        },
        {
            loc: '/lists/new',
            priority: .8
        },
        {
            loc: '/lists/features',
            priority: .8
        },
        {
            loc: '/lists/defunct',
            priority: .8
        },
        {
            loc: '/about',
            priority: .7
        },
        {
            loc: '/contact',
            priority: .6
        },
        {
            loc: '/patreon',
            priority: .6
        },
        {
            loc: '/reddit',
            priority: .6
        },
        {
            loc: '/twitter',
            priority: .6
        }
    ];

    // List pages
    const lists = await db.select('id').from('lists')
        .where({ display: true })
        .orderBy([
            { column: 'discord_only', order: 'desc' },
            { column: 'id', order: 'asc' }
        ]);
    lists.forEach(list => {
        sitemap.push({
            loc: '/lists/' + list.id,
            priority: .5
        });
    });

    // Features
    const features = await db.select('id').from('features')
        .orderBy([
            { column: 'display', order: 'desc' },
            { column: 'name', order: 'asc' }
        ]);
    features.forEach(feature => {
        sitemap.push({
            loc: '/lists/features/' + feature.id,
            priority: .4
        });
    });

    return sitemap;
};

const save = async sitemap => {
    // Build the XML
    const urlset = builder.create('urlset');
    urlset.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    urlset.att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
    urlset.att('xsi:schemaLocation', 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd');
    sitemap.forEach(item => {
        const url = urlset.ele('url');
        url.ele('loc', config.baseURL + item.loc);
        url.ele('priority', item.priority);
    });

    // Save the XML
    const xml = urlset.end({ pretty: true });
    await fs.writeFile(path.join(__dirname, '..', 'Public', 'sitemap.xml'), xml);
};

module.exports = { get, save };
