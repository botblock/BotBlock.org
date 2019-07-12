const RequestHandler = require('./RequestHandler');
const config = require('../../config');

class Client {
    constructor(token) {
        if (typeof token !== 'string') throw new TypeError('token must be a string');
        this.token = token;
        this.requestHandler = new RequestHandler(this);
    }

    /** Discord Functions */
    createMessage(channel, content) {
        let payload = {};
        if (typeof content === 'string') payload.content = content;
        else payload = content;
        if (typeof channel != 'string') throw new TypeError('channel must be a string');
        return new Promise((resolve, reject) => {
            this.requestHandler.request('POST', '/channels/' + channel + '/messages', { ...payload }).then((msg) => {
                resolve(msg);
            }).catch((e) => {
                reject(e);
            })
        })
    }

    getInvite(code, counts = false) {
        if (typeof code !== 'string') throw new TypeError('code must be a string');
        if (typeof counts !== 'boolean') throw new TypeError('counts must be a boolean');
        return new Promise((resolve, reject) => {
            this.requestHandler.request('GET', '/invites/' + code + '?with_counts=' + counts).then((invite) => {
                resolve(invite);
            }).catch((e) => {
                reject(e);
            })
        })
    }

    /* BotBlock Functions */
    updateEditLog(oldEdit, newEdit) {
        if (!oldEdit || !newEdit) return;
        const updated = Object.keys(newEdit);
        let changes = [];
        for (let i = 0; i < updated.length; i++) {
            if (newEdit[updated[i]] !== oldEdit[updated[i]]) changes.push({ key: updated[i], oldValue: oldEdit[updated[i]], newValue: newEdit[updated[i] ]});
            if (i + 1 === updated.length) {
                this.createMessage(config.discord.edit_log,
                    ':pencil: | **__' + newEdit.name + ' (' + newEdit.id + ') has been edited__**' +
                    '**View at: <' + config.baseURL + '/lists/' + newEdit.id + '>**' +
                    (changes.length > 0
                         ? changes.map((c) => '**' + c.key + '** has changed....  from: `' + (c.oldValue || 'None') + ('`  to: `' + (c.newValue || 'None') + '`'))
                         : 'Nothing has been changed....')
                ).catch(() => console.error('[Discord] Failed to send to edit log.'));
            }
        }
    }
}

module.exports = Client;
