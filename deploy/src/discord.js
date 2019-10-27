const axios = require('axios');
const config = require('../config');

module.exports = async (message, channelId) => {
    return await axios.post(
        `https://discordapp.com/api/channels/${channelId}/messages`,
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
