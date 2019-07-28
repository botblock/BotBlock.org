const formatListMessage = require('./formatListDiscordMessage');
const config = require('../config');

module.exports = async (client, db, list, newListID) => {
    let msg;
    try {
        let message = formatListMessage(list);
        const messageid = await db.run('SELECT * FROM lists_messages WHERE list = ?', [list.id]);
        if (messageid[0]) {
            msg = await client.editMessage(config.discord.lists_log, messageid[0].message, message);
        } else {
            msg = await client.createMessage(config.discord.lists_log, message);
        }
        await db.run('DELETE FROM lists_messages WHERE list = ?', [list.id]);
        await db.run('INSERT INTO lists_messages (list, message) VALUES (?, ?)', [newListID, msg.id]);
    } catch (e) {
        return null;
    }
}
