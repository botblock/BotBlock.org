const axios = require('axios');

module.exports = (client, db, list) => {
    return new Promise((resolve, reject) => {
        const invite = new RegExp(/^\s*https?:\/\/cdn\.discordapp\.com\/icons\/\d+\/[\w\d]+\.png/g).exec(list.icon);
        if (!invite) {
            console.log(2)
         // Not a Discord invite
        } else {
            console.log(1);
            // Discord invite
        }
    })
}
