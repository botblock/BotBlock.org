const axios = require('axios');

class RequestHandler {
    constructor(client) {
        this.client = client;
    }

    request(method, endpoint, data = {}) {
        return new Promise((resolve, reject) => {
            let structure = {
                method,
                url: 'https://discordapp.com/api' + endpoint,
                headers: {
                    Authorization: this.client.token.startsWith('Bot ') ? this.client.token : 'Bot ' + this.client.token
                }
            };
            if (method.toLowerCase() !== 'get') structure.data = data;
            axios({ ...structure }).then((response) => {
                resolve(response.data)
            }).catch((e) => {
                reject(e);
            })
        })
    }
}

module.exports = RequestHandler;
