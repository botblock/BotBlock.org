const axios = require('axios');

module.exports = (endpoint, headers) => {
    if (!endpoint || !headers) return;
    return new Promise((resolve, reject) => {
        axios({
            url: endpoint,
            timeout: 2 * 1000, // 2 Seconds,
            headers
        }).then((response) => {
            resolve([ typeof response.data === 'object' ? response.data : null, response.status ]);
        }).catch((e) => {
            if (e.response) {
                reject([ typeof e.response.data === 'object' ? e.response.data : null, e.response.status ]);
            } else {
                reject([ {}, 500 ]);
            }
        });
    });
};
