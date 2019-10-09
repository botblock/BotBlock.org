const RequestHandler = require('./RequestHandler');
const config = require('../../../config');

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
        if (typeof channel !== 'string') throw new TypeError('channel must be a string');
        return new Promise((resolve, reject) => {
            this.requestHandler.request('POST', '/channels/' + channel + '/messages', { ...payload }).then((msg) => {
                resolve(msg);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    editMessage(channel, message, content) {
        let payload = {};
        if (typeof content === 'string') payload.content = content;
        else payload = content;
        if (typeof channel !== 'string') throw new TypeError('channel must be a string');
        if (typeof message !== 'string') throw new TypeError('message must be a string');
        return new Promise((resolve, reject) => {
            this.requestHandler.request('PATCH', '/channels/' + channel + '/messages/' + message, { ...payload }).then((msg) => {
                resolve(msg);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    getInvite(code, counts = false) {
        if (typeof code !== 'string') throw new TypeError('code must be a string');
        if (typeof counts !== 'boolean') throw new TypeError('counts must be a boolean');
        return new Promise((resolve, reject) => {
            this.requestHandler.request('GET', '/invites/' + code + '?with_counts=' + counts).then((invite) => {
                resolve(invite);
            }).catch(() => {
                reject(null);
            });
        });
    }

    getUser(id) {
        if (typeof id !== 'string') throw new TypeError('id must be a string');
        return new Promise((resolve, reject) => {
            this.requestHandler.request('GET', '/users/' + id).then((user) => {
                resolve(user);
            }).catch(() => {
                reject(null);
            });
        });
    }

    getMember(guild, id) {
        if (typeof guild !== 'string') throw new TypeError('guild must be a string');
        if (typeof id !== 'string') throw new TypeError('id must be a string');
        return new Promise((resolve, reject) => {
            this.requestHandler.request('GET', '/guilds/' + guild + '/members/' + id).then((member) => {
                resolve(member);
            }).catch((e) => {
                reject(null);
            });
        });
    }

    /* BotBlock Functions */
    updateEditLog(oldEdit, newEdit, addedFeatures = [], oldFeatures = []) {
        if (!oldEdit || !newEdit) return;
        let changes = [];
        let newFeatures = [];
        let removedFeatures = [];
        for (const [key, value] of Object.entries(oldEdit)) {
            let oldValue;
            let newValue;

            if (value === newEdit[key] || String(value) === String(newEdit[key])) continue;
            if (value === '' || value === null) oldValue = 'None';
            else oldValue = value;
            if (newEdit[key] === '' || newEdit[key] === null) newValue = 'None';
            else newValue = newEdit[key];

            changes.push({ key, oldValue, newValue });
        }
        if (addedFeatures.length > 0) {
            for (const feature of addedFeatures) {
                if (!feature) continue;
                if (oldFeatures.filter((f) => f && f.id === feature.id).length > 0) continue;
                newFeatures.push(feature);
            }
        }

        if (oldFeatures.length > 0) {
            for (const feature of oldFeatures) {
                if (!feature) continue;
                if (addedFeatures.filter((f) => f && f.id === feature.id).length > 0) continue;
                removedFeatures.push(feature);
            }
        }
        this.createMessage(config.discord.edit_log,
            ':pencil: | ' + newEdit.name + ' (' + newEdit.id +') has been edited' +
            '\n<' + config.baseURL + '/lists/' + newEdit.id + '>\n\n**Changes**:\n' +
            (changes.length > 0 ? changes.map((c) => '*' + c.key + '*: `' + c.oldValue + '` → `' + c.newValue + '`').join('\n') : 'Nothing has been changed...')
            + (newFeatures.length > 0 ? '\n\n*Added Features*: ' + newFeatures.map((c) => c.name).join(', ') : '')
            + (removedFeatures.length > 0 ? '\n\n*Removed Features*: ' + removedFeatures.map((c) => c.name).join(', ') : '')
        ).catch(() => console.error('[Discord] Failed to send to edit log.'));
        // this.createMessage(config.discord.edit_log,
        //     ':pencil: | **__' + newEdit.name + ' (' + newEdit.id + ') has been edited__**\n' +
        //     '**View at: <' + config.baseURL + '/lists/' + newEdit.id + '>**\n\n' +
        //     (changes.length > 0
        //         ? changes.map((c) => '**' + c.key + '** has changed....\n  from: `' + (c.oldValue) + ('\n`  to: `' + (c.newValue) + '`')).join(',\n')
        //         : 'Nothing has been changed....')
        //     + (newFeatures.length > 0 ? '\n\n**Features Added:** `' + newFeatures.map((f) => f.name).join(', ') + '`': '')
        //     + (removedFeatures.length > 0 ? '\n\n**Features Removed:** `' + removedFeatures.map((f) => f.name).join(', ') + '`': '')
        // ).catch(() => console.error('[Discord] Failed to send to edit log.'));
    }


}

module.exports = Client;
