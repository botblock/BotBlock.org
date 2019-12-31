const FormValidator = require('../Structure/FormValidator');
const getListFeature = require('../Util/getListFeature');

module.exports = class ListController {
    constructor(client, db) {
        this.client = client;
        this.db = db;
    }

    handle(data, user, edit = false, list) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const validation = await this._validate(data, user);
                if (Array.isArray(validation)) return resolve(validation);
                validation['added'] = edit ? list.added : Date.now() / 1000;
                if (edit) {
                    await this.db('lists').where({ id: data.id }).update(validation);
                } else {
                    await this.db('lists').insert(validation);
                }
                let oldFeatures = [];
                let addedFeatures = [];
                if (edit) {
                    oldFeatures = await this.db.select().from('feature_map').where({
                        list: data.id,
                        value: true
                    });
                    await this.db('feature_map').where({ list: data.id }).del();
                }
                for (let [key, value] of Object.entries(data)) {
                    if (key.substring(0, 8) === 'feature_') {
                        key = key.replace('feature_', '');
                        value = value === 'on';
                        await this.db('feature_map').insert({
                            list: validation.id,
                            feature: key,
                            value
                        });
                        if (edit && value) {
                            addedFeatures.push(Number(key));
                        }
                    }
                }
                if (edit) this.client.updateEditLog(
                    list,
                    validation,
                    await Promise.all(addedFeatures.map((f) => getListFeature(this.db, Number(f)))),
                    await Promise.all(oldFeatures.map((f) => getListFeature(this.db, Number(f.feature))))
                );
                require('../Util/updateListMessage')(this.client, this.db, validation, data.id);
                resolve(validation);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Validates and structures data
     * @param data
     * @param user
     * @param edit
     * @returns {Object}
     * @private
     */
    async _validate(data, user, edit = false) {
        const validate = FormValidator.validateList(data.id, data, user, edit);
        if (validate.length > 0) return validate;
        const columns = Object.keys(await this.db('lists').columnInfo());
        let changes = {};
        for (const column of columns) {
            if (data[column]) {
                changes[column] = data[column];
            } else {
                changes[column] = null;
            }
        }
        return changes;
    }
};
