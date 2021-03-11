const config = require('../../config');

const clear = req => req.unset('X-Auth-As-Anon').unset('X-Auth-As-User').unset('X-Auth-As-Mod').unset('X-Auth-As-Admin');

const asAnon = req => clear(req).set('X-Auth-As-Anon', config.secret);
const asUser = req => clear(req).set('X-Auth-As-User', config.secret);
const asMod = req => clear(req).set('X-Auth-As-Mod', config.secret);
const asAdmin = req => clear(req).set('X-Auth-As-Admin', config.secret);
const asPrevious = req => clear(req);

module.exports = { asAnon, asUser, asMod, asAdmin, asPrevious };
