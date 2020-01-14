const config = require('../../config');

const asAnon = (req) => req.set('X-Auth-As-Anon', config.secret);
const asUser = (req) => req.set('X-Auth-As-User', config.secret).unset('X-Auth-As-Anon');
const asMod = (req) => req.set('X-Auth-As-Mod', config.secret).unset('X-Auth-As-Anon');
const asAdmin = (req) => req.set('X-Auth-As-Admin', config.secret).unset('X-Auth-As-Anon');

module.exports = { asAnon, asUser, asMod, asAdmin };
