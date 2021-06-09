const BaseRoute = require('../Structure/BaseRoute');
const axios = require('axios');
const handleError = require('../Util/handleError');

class BotRoute extends BaseRoute {
    constructor(client, db) {
        super('/bot');
        this.router = require('express').Router();
        this.client = client;
        this.db = db;
        this.routes();
    }

    async postBot(req, res) {
        const responses = [];
        return await this.db.select().from('lists').whereNot({ add_bot: null, add_bot_key: null }).then(lists => {
            for (var list of lists) {
                if (req.body[list.name] == 'on') {
                    return axios.post(list.add_bot, req.body, {
                        headers: { Authorization: list.add_bot_key }
                    }).then(resp => {
                        responses.push({ ...resp.data, error: false, name: list.name });
                        return responses;
                    }).catch(err => {
                        responses.push({ ...err.response.data, error: true, name: list.name });
                        return responses;
                    });
                }
                delete req.body[list.name];
            }
        }).catch((e) => {
            handleError(this.db, req, res, e.stack);
        });
    }

    routes() {
        this.router.get('/add', this.requiresAuth.bind(this), (req, res) => {
            res.render('bot/add');
        });


        this.router.post('/add', async (req, res) => {
            try {
                const data = await this.client.getUser(req.body.botid);
                if (!data['bot']) { res.render('bot/add', { error: true }); }
                this.db.select().from('lists').whereNot({ add_bot: null, add_bot_key: null }).then(supportedLists => {
                    res.render('bot/add', { error: false, bot: data, supportedLists: supportedLists });
                }).catch((e) => {
                    handleError(this.db, req, res, e.stack);
                });
            } catch {
                res.render('bot/add', { error: true });
            }
        });


        this.router.post('/add/:id', async (req, res) => {
            const [bot, user] = await Promise.all([this.client.getUser(req.params.id), this.client.getUser(req.session.user.id)]);

            user.locale = req.session.user.locale;
            user.mfa_enabled = req.session.user.mfa_enabled;
            user.premium_type = req.session.user.premium_type;

            req.body.nsfw = 'on' ? true : false;
            req.body.slash_commands = 'on' ? true : false;
            req.body.id = bot.id;
            req.body.owner_id = user.id;
            req.body.owner_oauth = req.session.user.access_token;
            req.body.bot_details = bot;
            req.body.owner_details = user;

            const results = await this.postBot(req, res);

            res.render('bot/add', { after: true, results: results });
        });
    }

    get getRouter() {
        return this.router;
    }
}

module.exports = BotRoute;
