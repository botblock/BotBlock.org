const BaseRoute = require('../Structure/BaseRoute');

class APIRoute extends BaseRoute {
    constructor(client, db) {
        super('/api');
        this.router = require('express').Router();
        this.client = client;
        this.db = db;
        this.routes();
    }

    routes() {
        this.router.get('/lists', (req, res) => {
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
            if (!req.body.bot_id) return res.status(400).json({ error: true, status: 400, message: 'bot_id is required' });
            if (!req.body.server_count) return res.status(400).json({ error: true, status: 400, message: 'server_count is required' });
            if (isNaN(req.body.server_count)) return res.status(400).json({ error: true, status: 400, message: 'server_count is required' });
            if (req.body.shard_id) {
                if (isNaN(req.body.shard_id)) return res.status(400).json({ error: true, status: 400, message: 'shard_id must be a number' });
            }
            if (req.body.shards) {
                if (!Array.isArray(req.body.shards)) return res.status(400).json({ error: true, status: 400, message: 'shards must be an array' });
            }
            this.db.run('SELECT id, api_docs, api_post, api_field, api_shard_id, api_shard_count, api_shards, api_get FROM lists WHERE defunct = ? ORDER BY discord_only DESC, LOWER(name) ASC', [0]).then((lists) => {
                const data = Object.keys(req.body);

                res.sendStatus(200);
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
