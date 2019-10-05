const axios = require('axios');
const config = require('../config');

module.exports = async message => {
    return await axios.post(
        `https://discordapp.com/api/channels/${config.discord_channel}/messages`,
        {
            content: message
        },
        {
            headers: {
                Authorization: `Bot ${config.discord_token}`
            }
        }
    );
};
