const axios = require('axios');

module.exports = (list, bot, payload, token, userAgent) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: list.api_post.replace(':id', bot),
            timeout: 10 * 1000, // 10 seconds,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'User-Agent': userAgent
            },
            data: payload
        }).then((response) => {
            resolve([ response.status, JSON.stringify(response.data), JSON.stringify(payload) ]);
        }).catch((e) => {
            if (e.response) {
                reject([ e.response.status, JSON.stringify(e.response.data), JSON.stringify(payload) ]);
            } else {
                reject([ 500, JSON.stringify({}), JSON.stringify(payload) ]);
            }
        });
    })
}
