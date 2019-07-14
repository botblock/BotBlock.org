const BaseRoute = require('../Structure/BaseRoute');
const axios = require('axios');
const config = require('../config');

class AuthenticationRoute extends BaseRoute {
    constructor(client, db) {
        super('/auth');
        this.router = require('express').Router();
        this.client = client;
        this.db = db;
        this.routes();
    }

    routes() {
        this.router.get('/', (req, res) => {
            res.redirect('https://discordapp.com/api/oauth2/authorize' +
                '?client_id=' + config.discord.client_id +
                '&redirect_uri=' + encodeURIComponent(req.protocol + '://' + req.get('Host') + '/auth/callback') +
                '&response_type=code' +
                '&scope=' + config.discord.scopes.join('%') +
                '&prompt=none'
            )
        });

        this.router.get('/callback', (req, res) => {
            let data = {};
            if (!req.query.code) return res.status(400).json({ error: true, status: 400, message: 'No code provided' });
            axios({
                method: 'POST',
                url: 'https://discordapp.com/api/oauth2/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'client_id=' + config.discord.client_id +
                    '&client_secret=' + config.discord.client_secret +
                    '&grant_type=authorization_code' +
                    '&code=' + req.query.code +
                    '&redirect_uri=' + req.protocol + '://' + req.get('Host') + '/auth/callback' +
                    '&scope=' + config.discord.scopes.join(' ')
            }).then((token) => {
               axios({
                   method: 'GET',
                   url: 'https://discordapp.com/api/users/@me',
                   headers: {
                       Authorization: token.data.token_type + ' ' + token.data.access_token
                   }
               }).then((user) => {
                   data = { ...user.data, ...token.data };
                   this.client.getMember(config.discord.guild_id, user.data.id).then((member) => {
                       // TODO: Fix issue with mods / admins not being checked.
                       // console.log(1)
                       // console.log(member.data.roles.includes(config.discord.admin_role))
                       // console.log(member.data.roles.includes(config.discord.mod_role));
                       if (member.data.roles.includes(config.discord.admin_role)) data.admin = true;
                       if (member.data.roles.includes(config.discord.mod_role)) data.mod = true;
                   }).catch(() => {
                        data.admin = false;
                        data.mod = false;
                   }).finally(() => {
                       console.log(data.mod, data.admin)
                       req.session.user = data;
                       res.redirect('/');
                   })
               }).catch((_) => {
                   res.status(400).json({ error: true, status: 400, message: 'Failed to get user information' });
               })
            }).catch(() => {
                res.status(400).json({ error: true, status: 400, message: 'Failed to get token' });
            })
        });

        this.router.get('/logout', (req, res) => {
            req.session = null;
            res.redirect('/');
        });

    }

    get getRouter() {
        return this.router;
    }
}

module.exports = AuthenticationRoute;
