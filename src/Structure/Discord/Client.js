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
            }).catch(() => {
                reject(null);
            });
        });
    }

    /* BotBlock Functions */
    updateEditLog(oldEdit, newEdit, addedFeatures = [], removedFeatures = []) {
        if (!config.discord.notifications) return;
        if (!oldEdit || !newEdit) return;
        let changes = [];
        for (const [key, value] of Object.entries(oldEdit)) {
            let oldValue;
            let newValue;

            if (key === 'features') continue;
            if (value === newEdit[key] || String(value) === String(newEdit[key])) continue;
            if (value === '' || value === null) oldValue = 'None';
            else oldValue = value;
            if (newEdit[key] === '' || newEdit[key] === null) newValue = 'None';
            else newValue = newEdit[key];

            changes.push({ key, oldValue, newValue });
        }
        if (changes.length === 0 && addedFeatures.length === 0 && removedFeatures.length === 0) return;
        this.createMessage(config.discord.edit_log,
            ':pencil: | ' + newEdit.name + ' (' + newEdit.id +') has been edited' +
            '\n<' + config.baseURL + '/lists/' + newEdit.id + '>\n\n**Changes**:\n' +
            (changes.length > 0
                ? changes.map((c) => '*' + c.key + '*: `' + c.oldValue + '` → `' + c.newValue + '`').join('\n') + '\n\n'
                : addedFeatures.length || removedFeatures.length ? '' : 'Nothing has been changed...')
            + (addedFeatures.length > 0 ? '*Added Features*: ' + addedFeatures.map((c) => c.name).join(', ') + '\n\n': '')
            + (removedFeatures.length > 0 ? '*Removed Features*: ' + removedFeatures.map((c) => c.name).join(', ') + '\n\n' : '')
        ).catch(() => console.error('[Discord] Failed to send to edit log.'));
    }

    legacyIdsEditLog(added, removed) {
        if (!config.discord.notifications) return;
        if (!added || !removed) return;
        if (!added.length && !removed.length) return;
        this.createMessage(config.discord.edit_log,
            ':map: | Legacy IDs have been updated'
            + (added.length > 0 ? '\n\n**Added**:\n' + added.map((c) => '`' + c.id + '` → `' + c.target + '`').join('\n') : '')
            + (removed.length > 0 ? '\n\n**Removed**:\n' + removed.map((c) => '`' + c.id + '` → `' + c.target + '`').join('\n') : '')
        ).catch(() => console.error('[Discord] Failed to send to edit log.'));
    }

    listFeaturesEdited(newFeature = null, oldFeature = null) {
        if (!config.discord.notifications) return;
        let changes = [];
        if (newFeature) {
            for (const [key, value] of Object.entries(newFeature)) {
                let oldValue;
                let newValue;

                if (!oldFeature) {
                    oldValue = 'None';
                    newValue = newFeature[key];
                } else {
                    if (String(value) === String(oldFeature[key])) continue;
                    if (value === '' || value === null) newValue = 'None';
                    else newValue = value;
                    if (oldFeature[key] === '' || oldFeature[key] === null) oldValue = 'None';
                    else oldValue = oldFeature[key];
                }
                changes.push({ key, oldValue, newValue });
            }
        }
        this.createMessage(config.discord.edit_log, ':pencil2: | ' +
            (!newFeature ? 'Feature **__' + oldFeature.name + '__** has been deleted.' : (!oldFeature ? 'A feature has been added.' : 'Feature **__' + newFeature.name + '__** has been edited') +
            '\n<' + config.baseURL + '/lists/features/' + (newFeature.id !== undefined ? newFeature.id : oldFeature.id) + '>\n\n**Changes**:\n' +
            (changes.length > 0 ? changes.map((c) => '*' + c.key + '*: `' + c.oldValue + '` → `' + c.newValue + '`').join('\n') : 'Nothing has been changed...'))
        ).catch(() => console.error('[Discord] Failed to send to edit log.'));
    }

}

module.exports = Client;
