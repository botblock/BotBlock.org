const i18n = require('i18n');
const { join } = require('path');

i18n.config = {
    cookie: 'lang',
    defaultLocale: 'en_US',
    autoReload: true,
    updateFiles: true,
    directory: join(__dirname, '..', '..', 'locales')
};

i18n.configure(config);

module.exports = i18n;
