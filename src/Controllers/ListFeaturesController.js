const FormValidator = require('../Structure/FormValidator');

module.exports = class ListFeatureController {
    constructor(client, db) {
        this.client = client;
        this.db = db;
    }

    handle(data, edit = false, feature) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const validation = await this._validate(data);
                if (Array.isArray(validation)) return resolve(validation);
                let listFeatureId = null;
                if (edit) {
                    await this.db('features').where({ id: feature.id }).update(validation);
                    this.client.listFeaturesEdited(validation, feature);
                } else {
                    listFeatureId = await this.db('features').insert(validation);
                }
                this.client.listFeaturesEdited(Object.assign(validation, { id: edit ? feature.id : listFeatureId[0] }), feature);
                resolve(Object.assign(validation, { id: edit ? feature.id : listFeatureId[0] }));
            } catch (e) {
                reject(e);
            }
        });
    }

    async _validate(data) {
        const validate = FormValidator.validateFeature(data);
        if (validate.length) return validate;
        const columns = Object.keys(await this.db('features').columnInfo());
        let changes = {};
        for (const column of columns) {
            if (column === 'id') continue;
            if (data[column]) {
                changes[column] = data[column];
            } else {
                changes[column] = null;
            }
        }
        return changes;
    }
};
