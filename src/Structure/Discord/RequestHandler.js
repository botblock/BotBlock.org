const axios = require('axios');

class RequestHandler {
    constructor(client) {
        this.client = client;
    }

    request(method, endpoint, data) {
        return new Promise((resolve, reject) => {
            axios({
                method,
                url: 'https://discordapp.com/api' + endpoint,
                data,
                headers: {
                    Authorization: this.client.token.startsWith('Bot ') ? this.client.token : 'Bot ' + this.client.token
                }
            }).then((response) => {
                resolve(response.data)
            }).catch((e) => {
                reject(e);
            })
        })
    }
}

module.exports = RequestHandler;
