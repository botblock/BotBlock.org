const cors = require('cors');
const BaseRoute = require('../Structure/BaseRoute');
const Ratelimiter = require('../Middleware/RateLimiter');
const Cache = require('../Structure/Cache');
const handleError = require('../Util/handleError');
const handleServerCount = require('../Util/handleServerCount');
const getBotInformation = require('../Util/getBotInformation');
const getUserAgent = require('../Util/getUserAgent');
const isSnowflake = require('../Util/isSnowflake');
const { slugify, librarySlug } = require('../Util/slugs');
const legacyListMap = require('../Util/legacyListMap');
const Renderer = require('../Structure/Markdown');
const { secret } = require('../../config.js');

class APIRoute extends BaseRoute {
    constructor(client, db) {
        super('/api');
        this.router = require('express').Router();
        this.client = client;
        this.db = db;
        this.ratelimit = new Ratelimiter(this.db);
        this.renderer = new Renderer();
        this.cache = new Cache(this.db);
        this.routes();
    }

    routes() {
        this.router.get('/docs', (req, res) => {
            this.db.select('id', 'name').from('lists')
                .where({
                    display: true,
                    defunct: false
                })
                .whereNot({ api_post: '' }).whereNot({ api_post: null })
                .whereNot({ api_field: '' }).whereNot({ api_field: null })
                .orderBy([{ column: 'discord_only', order: 'desc' }, { column: 'id', order: 'asc' }])
                .then((lists) => {
                    res.render('api/docs', { title: 'API Docs', lists, ip: req.ip });
                })
                .catch((e) => {
                    handleError(this.db, req, res, e.stack);
                });
        });

        this.router.get('/docs/libs', (req, res) => {
            this.db.select().from('libraries').orderBy([
                { column: 'language', order: 'asc' },
                { column: 'name', order: 'asc' }
            ]).then((libraries) => {
                libraries = libraries.map(lib => {
                    lib.slug = librarySlug(lib);
                    lib.highlight = `lang-${slugify(lib.language)}`;
                    lib.description = this.renderer.render(lib.description);
                    return lib;
                });
                res.render('api/libs', { title: 'Libraries - API Docs', libraries });
            }).catch((e) => {
                handleError(this.db, req, res, e.stack);
            });
        });

        this.router.get('/lists', cors(), this.ratelimit.checkRatelimit(1, 1), (req, res) => {
            const data = {};
            this.db
                .select('id', 'api_docs', 'api_post', 'api_field', 'api_shard_id', 'api_shard_count', 'api_shards', 'api_get')
                .from('lists')
                .where({
                    defunct: false
                })
                .orderBy([
                    { column: 'discord_only', order: 'desc' },
                    { column: 'id', order: 'asc' }
                ])
                .then((lists) => {
                    if (!lists) return res.status(200).json({});
                    for (let i = 0; i < lists.length; i++) {
                        const id = lists[i].id;
                        delete lists[i].id;

                        // If filtering: Drop if all values are null
                        if (req.query.filter === 'true')
                            if (Object.values(lists[i]).filter(val => val !== null).length === 0)
                                continue;

                        data[id] = {
                            ...lists[i]
                        };
                    }
                    res.status(200).json({ ...data });
                })
                .catch((e) => {
                    handleError(this.db, req, res, e.stack, true);
                });
        });

        this.router.get('/legacy-ids', cors(), this.ratelimit.checkRatelimit(1, 1), (req, res) => {
            this.db
                .select('id', 'target')
                .from('legacy_ids')
                .orderBy([
                    { column: 'id', order: 'desc' }
                ])
                .then((legacy) => {
                    const data = legacy.reduce(function(result, item) {
                        result[item.id] = item.target;
                        return result;
                    }, {});
                    res.status(200).json({ ...data });
                })
                .catch((e) => {
                    handleError(this.db, req, res, e.stack, true);
                });
        });

        this.router.post('/count', cors(), this.ratelimit.checkRatelimit(1, 120), (req, res) => {
            if (!req.body.bot_id) return res.status(400).json({
                error: true,
                status: 400,
                message: '\'bot_id\' is required'
            });
            if (typeof req.body.bot_id !== 'string') return res.status(400).json({
                error: true,
                status: 400,
                message: '\'bot_id\' must be a string'
            });
            if (!isSnowflake(req.body.bot_id)) return res.status(400).json({
                error: true,
                status: 400,
                message: '\'bot_id\' must be a snowflake'
            });
            if (!req.body.server_count) return res.status(400).json({
                error: true,
                status: 400,
                message: '\'server_count\' is required'
            });
            if (isNaN(req.body.server_count)) return res.status(400).json({
                error: true,
                status: 400,
                message: '\'server_count\' must be a number'
            });
            if (req.body.shard_id) {
                if (isNaN(req.body.shard_id)) return res.status(400).json({
                    error: true,
                    status: 400,
                    message: '\'shard_id\' must be a number'
                });
            }
            if (req.body.shards) {
                if (!Array.isArray(req.body.shards)) return res.status(400).json({
                    error: true,
                    status: 400,
                    message: '\'shards\' must be an array'
                });
                if (req.body.shards.some((n) => typeof n !== 'number')) return res.status(400).json({
                    error: true,
                    status: 400,
                    message: '\'shards\' contains incorrect values'
                });
            }
            if (req.body.shard_count) {
                if (isNaN(req.body.shard_count)) return res.status(400).json({
                    error: true,
                    status: 400,
                    message: '\'shard_count\' must be a number'
                });
            }
            let success = {};
            let failure = {};
            this.db
                .select('id', 'api_docs', 'api_post', 'api_field', 'api_shard_id', 'api_shard_count', 'api_shards', 'api_get')
                .from('lists')
                .where({ defunct: false })
                .whereNot({ api_post: '' }).whereNot({ api_post: null })
                .orderBy([
                    { column: 'discord_only', order: 'desc' },
                    { column: 'id', order: 'asc' }
                ])
                .then(async (lists) => {
                    const data = Object.keys(req.body);
                    for (let i = 0; i < data.length; i++) {
                        const dataId = await legacyListMap(this.db, data[i]);
                        const list = lists.filter((l) => l.id === dataId)[0];
                        if (list) {
                            let payload = {};
                            if (req.body.shards && list.api_shards) {
                                payload[list.api_shards] = req.body.shards;
                            } else if (req.body.server_count && list.api_field) {
                                payload[list.api_field] = req.body.server_count;
                            }
                            if (req.body.shard_id && list.api_shard_id) payload[list.api_shard_id] = req.body.shard_id;
                            if (req.body.shard_count && list.shard_count) payload[list.api_shard_count] = req.body.shard_count;
                            let userAgent = getUserAgent().random;
                            if (req.get('User-Agent')) {
                                userAgent = req.get('User-Agent');
                            }
                            try {
                                success[list.id] = await handleServerCount(list, req.body.bot_id, payload, req.body[data[i]], userAgent);
                            } catch (e) {
                                failure[list.id] = e;
                            }
                        }
                        if (i + 1 === data.length) {
                            res.status(200).json({ success, failure });
                        }
                    }
                })
                .catch((e) => {
                    handleError(this.db, req, res, e.stack, true);
                });
        });

        this.router.get('/bots/:id', cors(), this.cache.handler(), this.ratelimit.checkRatelimit(1, 30), async (req, res) => {
            if (!isSnowflake(req.params.id)) return res.status(400).json({
                error: true,
                status: 400,
                message: '\'id\' must be a snowflake'
            });
            let lists = [];
            let output = {
                id: String(req.params.id),
                username: [],
                discriminator: [],
                owners: [],
                server_count: [],
                invite: [],
                prefix: [],
                website: [],
                github: [],
                support: [],
                library: [],
                list_data: lists
            };
            this.db.select('id', 'api_get').from('lists')
                .where({ defunct: false })
                .whereNot({ api_get: '' }).whereNot({ api_get: null })
                .then(async (data) => {
                    for (const list of data) {
                        try {
                            lists[list.id] = await getBotInformation(list.api_get.replace(':id', req.params.id), {
                                'User-Agent': getUserAgent().random,
                                'X-Forwarded-For': req.ip,
                                REMOTE_ADDR: req.ip,
                                X_FORWARDED_FOR: req.ip,
                                HTTP_X_FORWARDED_FOR: req.ip,
                                HTTP_X_REAL_IP: req.ip,
                                HTTP_CLIENT_IP: req.ip
                            });
                        } catch (e) {
                            lists[list.id] = e;
                        }
                    }
                    for (let list of Object.keys(lists)) {
                        list = lists[list];
                        if (Number(list[1]) === 200) {
                            // TODO: discordsbestbots.xyz returns everything inside the 'bot' property of a parent object, we need to handle that
                            const fields = Object.keys(list[0]);
                            for (let key in fields) {
                                key = fields[Number(key)].toLowerCase();
                                const value = list[0][key];
                                if (!value) continue;
                                if (key === 'name' || key === 'username' || key === 'bot_name') {
                                    output.username.push(value);
                                }
                                if (key === 'discrim' || key === 'discriminator') {
                                    output.discriminator.push(String(value));
                                }
                                if (key === 'owner' || key === 'owners' || key === 'authors' || key === 'bot_owners') {
                                    if (!Array.isArray(value) && typeof value !== 'object') {
                                        output.owners.push(value);
                                    } else if (Array.isArray(value) && typeof value !== 'object') {
                                        for (const owner of value) {
                                            if (!Array.isArray(owner) && typeof owner !== 'object') {
                                                output.owners.push(owner);
                                            } else if (typeof value === 'object') {
                                                if (value['id']) output.owners.push(value['id']);
                                                else if (value['userId']) output.owners.push(value['userId']);
                                            }
                                        }
                                    } else if (typeof value === 'object') {
                                        if (value['id']) output.owners.push(value['id']);
                                        else if (value['userId']) output.owners.push(value['userId']);
                                    }
                                }
                                if (key === 'count' || key === 'servers' || key === 'server_count' || key === 'servercount' || key === 'serverCount'
                                    || key === 'bot_server_count' || key === 'guilds' || key === 'guild_count' || key === 'guildcount' || key === 'guildCount') {
                                    const temp = parseInt(value);
                                    if (typeof temp === 'number') output.server_count.push(temp);
                                }
                                if (key === 'links') {
                                    if (typeof value === 'object') {
                                        if (value['invite']) output.invite.push(value['invite']);
                                        if (value['support']) output.support.push(value['support']);
                                    }
                                }
                                if (key === 'invite' || key === 'bot_invite' || key === 'botInvite' || key === 'bot_invite_link') {
                                    if (typeof key === 'string') output.invite.push(value);
                                }
                                if (key === 'prefix' || key === 'bot_prefix') {
                                    if (typeof key === 'string') output.prefix.push(value);
                                }
                                if (key === 'website' || key === 'bot_website') {
                                    if (typeof key === 'string') output.website.push(value);
                                }
                                if (key === 'github' || key === 'bot_github_repo' || key === 'openSource' || key === 'git') {
                                    if (typeof key === 'string') output.github.push(value);
                                }
                                if (key === 'support' || key === 'supportInvite' || key === 'support_server' || key === 'discord'
                                    || key === 'server_invite' || key === 'bot_support_discord' || key === 'server') {
                                    if (typeof key === 'string') output.support.push(value);
                                }
                                if (key === 'library' || key === 'libraryName' || key === 'bot_library' || key === 'lang') {
                                    if (typeof key === 'string') output.library.push(value);
                                }
                            }
                        }
                    }
                    let response = {
                        id: output.id,
                        username: this.getMostCommon(output.username) || 'Unknown',
                        discriminator: this.getMostCommon(output.discriminator) || '0000',
                        owners: output.owners.filter((v, i, a) => a.indexOf(v) === i && isSnowflake(v)) || [],
                        server_count: Math.max(...output.server_count) || 0,
                        invite: this.getMostCommon(output.invite) || '',
                        prefix: this.getMostCommon(output.prefix) || '',
                        website: this.getMostCommon(output.website) || '',
                        github: this.getMostCommon(output.github) || '',
                        support: this.getMostCommon(output.support) || '',
                        library: this.getMostCommon(output.library) || '',
                        list_data: { ...lists } || {}
                    };
                    await this.cache.add(req.originalUrl, 300, response);
                    res.status(200).json({ ...response, cached: false });
                })
                .catch((e) => {
                    handleError(this.db, req, res, e.stack, true);
                });
        });

        this.router.get('/reset', (req, res) => {
            const ratelimitBypass = req.get('X-Ratelimit-Bypass');
            if (ratelimitBypass !== secret) {
                return res.status(404).json({ error: true, status: 404, message: 'Endpoint not found' });
            }

            this.db('ratelimit').where({ ip: req.ip }).del().then(() => {
                res.status(200).json({ error: false, status: 200, message: 'Ratelimit reset' });
            });
        });

        this.router.use('*', cors(), (req, res) => {
            res.status(404).json({ error: true, status: 404, message: 'Endpoint not found' });
        });


        this.router.use('*', cors(), (err, req, res) => {
            res.status(404).json({ error: true, status: 404, message: 'Endpoint not found' });
        });
    }

    /**
     * Get most common item in an array.
     * @param array
     * @return string | number | null
     */
    getMostCommon(array) {
        // Credit: https://codepen.io/AmJustSam/pen/JNmJBL
        if (!array || !Array.isArray(array)) return null;
        let counts = {};
        let compare = 0;
        let mostFrequent = null;
        for (let i = 0; i < array.length; i++) {
            if (!counts[array[i]]) counts[array[i]] = 1;
            else counts[array[i]] = counts[array[i]] + 1;

            if (counts[array[i]] > compare) {
                compare = counts[array[i]];
                mostFrequent = array[i];
            }
        }
        return mostFrequent;
    }

    get getRouter() {
        return this.router;
    }
}

module.exports = APIRoute;
