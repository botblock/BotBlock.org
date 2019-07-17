const i18n = require('i18n');
const { join } = require('path');

i18n.config = {
    cookie: 'lang',
    defaultLocale: 'en_US',
    autoReload: true,
    updateFiles: false,
    directory: join(__dirname, '..', '..', 'locales')
};

i18n.configure(i18n.config);

module.exports = i18n;
