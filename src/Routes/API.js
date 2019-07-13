const BaseRoute = require('../Structure/BaseRoute');
const Ratelimitter = require('../Structure/RateLimiter');
const handleServerCount = require('../Util/handleServerCount');

class APIRoute extends BaseRoute {
    constructor(client, db) {
        super('/api');
        this.router = require('express').Router();
        this.client = client;
        this.db = db;
        this.ratelimit = new Ratelimitter();
        this.routes();
    }

    routes() {
        this.router.get('/lists', this.ratelimit.checkRatelimit(1, 1, ''), (req, res) => {
            const data = { };
            this.db.run('SELECT id, api_docs, api_post, api_field, api_shard_id, api_shard_count, api_shards, api_get FROM lists WHERE defunct = ? ORDER BY discord_only DESC, LOWER(name) ASC', [0]).then((lists) => {
                if (!lists) return res.status(200).json({  });
                for (let i = 0; i < lists.length; i++) {
                    data[lists[i].id] = {
                        ...lists[i]
                    };
                    delete data[lists[i].id].id;
                    if (i + 1 === lists.length) {
                        res.status(200).json({ ...data });
                    }
                }
            }).catch(() => {
                res.status(500).json({ error: true, status: 500, message: 'An unexpected database error occurred' });
            })
        });

        this.router.post('/count', (req, res) => {
            if (!req.body.bot_id) return res.status(400).json({ error: true, status: 400, message: '\'bot_id\' is required' });
            if (!req.body.server_count) return res.status(400).json({ error: true, status: 400, message: '\'server_count\' is required' });
            if (isNaN(req.body.bot_id)) return res.status(400).json({ error: true, status: 400, message: '\'bot_id\' must be a number' });
            if (isNaN(req.body.server_count)) return res.status(400).json({ error: true, status: 400, message: '\'server_count\' must be a number' });
            if (req.body.shard_id) {
                if (isNaN(req.body.shard_id)) return res.status(400).json({ error: true, status: 400, message: '\'shard_id\' must be a number' });
            }
            if (req.body.shards) {
                if (!Array.isArray(req.body.shards)) return res.status(400).json({ error: true, status: 400, message: '\'shards\' must be an array' });
                if (req.body.shards.some((n) => typeof n !== 'number')) return res.status(400).json({ error: true, status: 400, message: '\'shards\' contains incorrect values' });
            }
            let success = { };
            let failure = { };
            this.db.run('SELECT id, api_docs, api_post, api_field, api_shard_id, api_shard_count, api_shards, api_get FROM lists WHERE defunct = ? AND api_post != \'\' AND api_post IS NOT NULL ORDER BY discord_only DESC, LOWER(name) ASC', [0]).then(async (lists) => {
                const data = Object.keys(req.body);
                for (let i = 0; i < data.length; i++) {
                    const list = lists.filter((l) => l.id === data[i])[0];
                    if (list) {
                        let payload = {};
                        if (req.body.shards && list.api_shards) {
                            payload[list.api_shards] = req.body.shards;
                        } else if (req.body.server_count && list.api_field) {
                            payload[list.api_field] = req.body.server_count;
                        }
                        if (req.body.shard_id && list.api_shard_id) payload[list.api_shard_id] = req.body.shard_id;
                        let userAgent = require('../Util/getUserAgent')().random;
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
            }).catch(() => {
                res.status(500).json({ error: true, status: 500, message: 'An unexpected database error occurred' });
            })
        })

        this.router.use('*', (req, res) => {
            res.status(404).json({ error: true, status: 404, message: 'Endpoint not found' });
        })


        this.router.use('*', (err, req, res) => {
            res.status(404).json({ error: true, status: 404, message: 'Endpoint not found' });
        })
    }

    get getRouter() {
        return this.router;
    }
}

module.exports = APIRoute;
