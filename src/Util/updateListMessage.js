const formatListMessage = require('./formatListDiscordMessage');
const config = require('../../config');

module.exports = async (client, db, list, oldListId) => {
    if (!config.discord.notifications) return;
    let msg;
    try {
        let message = formatListMessage(list);
        const messageId = await db.select('message').from('lists_messages').where({ list: oldListId });
        if (messageId[0]) {
            msg = await client.editMessage(config.discord.lists_log, messageId[0].message, message);
        } else {
            msg = await client.createMessage(config.discord.lists_log, message);
        }
        await db('lists_messages').where({ list: oldListId }).del();
        await db('lists_messages').insert( { list: list.id, message: msg.id });
    } catch {
        return null;
    }
};
