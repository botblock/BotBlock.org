const i18n = require('i18n');
const { join } = require('path');

i18n.configure({
    cookie: 'lang',
    defaultLocale: 'en_US',
    autoReload: true,
    updateFiles: true,
    directory: join(__dirname, '..', '..', 'locales')
});

module.exports = i18n;
