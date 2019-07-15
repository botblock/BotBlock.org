const axios = require('axios');

module.exports = (endpoint, headers) => {
    if (!endpoint || !headers) return;
    return new Promise((resolve, reject) => {
        axios({
            url: endpoint,
            timeout: 2 * 1000, // 2 Seconds,
            headers
        }).then((response) => {
            resolve([ response.data, response.status ]);
        }).catch((e) => {
            if (e.response) {
                reject([ e.response.data, e.response.status ]);
            } else {
                reject([ {}, 500 ]);
            }
        });
    })
}
