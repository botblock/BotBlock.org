const BaseRoute = require('../Structure/BaseRoute');
const FormValidator = require('../Structure/FormValidator');
const getListFeature = require('../Util/getListFeature');
const getListFeatures = require('../Util/getListFeatures');
const handleError = require('../Util/handleError');
const updateIcon = require('../Util/updateIcon');

class ListsRoute extends BaseRoute {
    constructor(client, db) {
        super('/lists');
        this.router = require('express').Router();
        this.client = client;
        this.db = db;
        this.routes();
    }

    footerData() {
        return new Promise((resolve, reject) => {
            this.db.select('discord_only').from('lists')
                .where({ defunct: false, display: true })
                .then((active) => {
                    this.db.select('id').from('lists').where({ defunct: true }).then((defunct) => {
                        const discordOnly = active.filter(list => list.discord_only);
                        resolve({ active: active.length, discordOnly: discordOnly.length, defunct: defunct.length });
                    }).catch(reject);
                }).catch(reject);
        });
    }

    routes() {
        this.router.get('/', (req, res) => {
            try {
                this.db.select().from('lists')
                    .where({ defunct: false, display: true })
                    .orderBy([
                        { column: 'discord_only', order: 'desc' },
                        { column: 'id', order: 'asc' }
                    ])
                    .then((lists) => {
                        this.footerData().then((footer) => {
                            res.render('lists/lists', { title: 'All Bot Lists', lists, footer });
                        });
                    });
            } catch (e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).render('error', { title: 'Database Error' });
            }
        });

        this.router.get('/new', (req, res) => {
            try {
                this.db.select().from('lists')
                    .where({
                        defunct: false,
                        display: true
                    })
                    .orderBy('added', 'desc')
                    .limit(4)
                    .then((lists) => {
                        this.footerData().then((footer) => {
                            res.render('lists/lists', {
                                title: 'New Bot Lists',
                                subtitle: `These are the most recent bot lists to be added to ${res.__('site_name')}`,
                                lists, footer
                            });
                        });
                    });
            } catch (e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).render('error', { title: 'Database Error' });
            }
        });

        this.router.get('/icons', this.requiresAuth.bind(this), this.isMod.bind(this), async (req, res) => {
            try {
                const lists = await this.db.select().from('lists').where({ display: true, defunct: false });
                let messages = [];
                for (const list of lists) {
                    try {
                        const update = await updateIcon(this.client, this.db, list);
                        messages.push(list.id + ' - ' + update);
                    } catch (e) {
                        messages.push(list.id + ' - ' + e);
                    }
                }
                res.render('lists/iconupdater', { title: 'Icon Updater', lists: messages });
            } catch (e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).render('error', { title: 'Database Error' });
            }
        });

        this.router.get('/defunct', (req, res) => {
            try {
                this.db.select().from('lists')
                    .where({ defunct: true })
                    .orderBy([
                        { column: 'discord_only', order: 'desc' },
                        { column: 'id', order: 'asc' }
                    ])
                    .then((lists) => {
                        this.footerData().then((footer) => {
                            res.render('lists/lists', {
                                title: 'Defunct Bot Lists',
                                subtitle: `These lists are flagged as defunct on ${res.__('site_name')}`,
                                lists, footer
                            });
                        });
                    });
            } catch (e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).render('error', { title: 'Database Error' });
            }
        });

        this.router.get('/hidden', (req, res) => {
            try {
                this.db.select().from('lists')
                    .where({ defunct: false, display: false })
                    .orderBy([
                        { column: 'discord_only', order: 'desc' },
                        { column: 'id', order: 'asc' }
                    ])
                    .then((lists) => {
                        this.footerData().then((footer) => {
                            res.render('lists/lists', {
                                title: 'Hidden Bot Lists',
                                subtitle: `These lists are currently hidden on ${res.__('site_name')}.\nTo find out more about why each list here is hidden, press the Information button on the list card.`,
                                lists, footer
                            });
                        });
                    });
            } catch (e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).render('error', { title: 'Database Error' });
            }
        });

        this.router.get('/features', (req, res) => {
            try {
                this.db.select().from('features')
                    .orderBy([
                        { column: 'display', order: 'desc' },
                        { column: 'name', order: 'asc' }
                    ])
                    .then((checkboxes) => {
                        this.footerData().then((footer) => {
                            res.render('lists/features', {
                                title: 'All List Features',
                                checkboxes, footer
                            });
                        });
                    });
            } catch (e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).render('error', { title: 'Database Error' });
            }
        });

        this.router.get('/features/:id', (req, res) => {
            try {
                this.db.select().from('features').where({ id: req.params.id }).limit(1).then((features) => {
                    if (!features.length) return res.status(404).render('error', {
                        title: 'Page not found',
                        status: 404,
                        message: 'The page you were looking for could not be found.'
                    });
                    this.db.select().from('lists')
                        .where({ display: true, defunct: false })
                        .orderBy([
                            { column: 'discord_only', order: 'desc' },
                            { column: 'id', order: 'asc' }
                        ])
                        .then((allLists) => {
                            this.db.select().from('feature_map')
                                .where({ feature: req.params.id })
                                .then((featureMap) => {
                                    const map = featureMap.reduce((obj, item) => {
                                        obj[item.list] = item.value;
                                        return obj
                                    }, {});
                                    const lists = allLists.filter(list => (list.id in map && map[list.id]));
                                    this.footerData().then((footer) => {
                                        res.render('lists/lists', {
                                            title: `Bot Lists with feature '${features[0].name}'`,
                                            lists, footer
                                        });
                                    });
                                });
                        });
                });
            } catch
                (e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).render('error', { title: 'Database Error' });
            }
        });

        this.router.get('/search/:query*?', (req, res) => {
            try {
                const query = req.params.query || '';
                this.db.select().from('lists')
                    .where({ display: true, defunct: false })
                    .orderBy([
                        { column: 'discord_only', order: 'desc' },
                        { column: 'id', order: 'asc' }
                    ])
                    .then((allLists) => {
                        const names = allLists.filter(list => list.name.toLowerCase().includes(query.toLowerCase()));
                        const links = allLists.filter(list => !names.includes(list) && list.url.toLowerCase().includes(query.toLowerCase()));
                        const lists = [...names, ...links];
                        this.footerData().then((footer) => {
                            res.render('lists/search', {
                                title: 'Bot List Search',
                                query, lists, footer
                            });
                        });
                    });
            } catch (e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).render('error', { title: 'Database Error' });
            }
        });

        this.router.get('/add', this.requiresAuth.bind(this), this.isMod.bind(this), (req, res) => {
            try {
                this.db.select().from('features')
                    .orderBy([
                        { column: 'display', order: 'desc' },
                        { column: 'name', order: 'asc' }
                    ])
                    .then((features) => {
                        res.render('lists/edit', {
                            edit: false,
                            checkboxes: features,
                            interactiveCheckboxes: true,
                            data: {}
                        });
                    });
            } catch (e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).render('error', { title: 'Database Error' });
            }
        });

        this.router.post('/add', this.requiresAuth.bind(this), this.isMod.bind(this), async (req, res) => {
            try {
                const features = await this.db.select().from('features').orderBy([
                    { column: 'display', order: 'desc' },
                    { column: 'name', order: 'asc' }
                ]);
                const validate = FormValidator.validateList('', req.body, res.locals.user, false);
                if (validate && validate.length > 0) return res.render('lists/edit', {
                    title: 'Add List ',
                    edit: false,
                    checkboxes: features,
                    interactiveCheckboxes: true,
                    data: req.body,
                    errors: validate
                });
                const columns = Object.keys(await this.db('lists').columnInfo());
                let changes = {};
                for (const column of columns) {
                    if (req.body[column]) {
                        changes[column] = req.body[column];
                    } else {
                        changes[column] = null;
                    }
                }
                changes['added'] = (Date.now() / 1000);
                await this.db('lists').insert(changes);
                for (let [key, value] of Object.entries(req.body)) {
                    if (key.substring(0, 8) === 'feature_') {
                        key = key.replace('feature_', '');
                        value = value === 'on';
                        await this.db('feature_map').insert({
                            list: changes.id,
                            feature: key,
                            value
                        });
                    }
                }
                require('../Util/updateListMessage')(this.client, this.db, req.body, req.body.id);
                res.redirect('/lists/' + req.body.id)
            } catch (e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).render('error', { title: 'Database Error' });
            }
        });

        this.router.get('/:id', (req, res) => {
            try {
                this.db.select().from('lists').where({ id: req.params.id }).limit(1).then((lists) => {
                    if (!lists.length) return res.status(404).render('error', {
                        title: 'Page not found',
                        status: 404,
                        message: 'The page you were looking for could not be found.'
                    });
                    getListFeatures(this.db, lists[0].id).then((features) => {

                        res.render('lists/list', {
                            title: `${lists[0].name} (${lists[0].id})`,
                            list: lists[0],
                            checkboxes: features,
                            hideUncheckedBoxes: true
                        });
                    });
                });
            } catch (e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).render('error', { title: 'Database Error' });
            }
        });

        this.router.get('/:id/edit', this.requiresAuth.bind(this), this.isMod.bind(this), (req, res) => {
            try {
                this.db.select().from('lists').where({ id: req.params.id }).limit(1).then((lists) => {
                    if (!lists.length) return res.status(404).render('error', {
                        title: 'Page not found',
                        status: 404,
                        message: 'The page you were looking for could not be found.'
                    });
                    getListFeatures(this.db, lists[0].id).then((features) => {

                        res.render('lists/edit', {
                            title: 'Edit ' + lists[0].id,
                            data: lists[0],
                            checkboxes: features,
                            edit: true,
                            hideUncheckedBoxes: false,
                            interactiveCheckboxes: true
                        });
                    });
                });
            } catch (e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).render('error', { title: 'Database Error' });
            }
        });

        this.router.post('/:id/edit', this.requiresAuth.bind(this), this.isMod.bind(this), (req, res) => {
            try {
                this.db.select().from('lists').where({ id: req.params.id }).limit(1).then((lists) => {
                    if (!lists.length) return res.status(404).render('error', {
                        title: 'Page not found',
                        status: 404,
                        message: 'The page you were looking for could not be found.'
                    });
                    getListFeatures(this.db, lists[0].id).then(async (features) => {

                        const validate = FormValidator.validateList(req.params.id, req.body, res.locals.user);
                        let changes = {};
                        let addedFeatures = [];
                        if (validate && validate.length > 0) return res.render('lists/edit', {
                            title: 'Edit ' + lists[0].id,
                            data: lists[0],
                            checkboxes: features,
                            edit: true,
                            hideUncheckedBoxes: false,
                            interactiveCheckboxes: true,
                            errors: validate
                        });
                        try {
                            const columns = Object.keys(await this.db('lists').columnInfo());
                            for (const column of columns) {
                                if (req.body[column]) {
                                    changes[column] = req.body[column];
                                } else {
                                    changes[column] = null;
                                }
                            }
                            changes['added'] = lists[0].added;
                            await this.db('lists').where({ id: req.params.id }).del();
                            await this.db('lists').insert(changes);

                            const oldFeatures = await this.db.select().from('feature_map').where({
                                list: req.params.id,
                                value: true
                            });
                            await this.db('feature_map').where({ list: req.params.id }).del();
                            for (let [key, value] of Object.entries(req.body)) {
                                if (key.substring(0, 8) === 'feature_') {
                                    key = key.replace('feature_', '');
                                    value = value === 'on';
                                    await this.db('feature_map').insert({
                                        list: changes.id,
                                        feature: key,
                                        value
                                    });
                                    if (value) {
                                        addedFeatures.push(Number(key));
                                    }
                                }
                            }
                            this.client.updateEditLog(
                                lists[0],
                                changes,
                                await Promise.all(addedFeatures.map((f) => getListFeature(this.db, Number(f)))),
                                await Promise.all(oldFeatures.map((f) => getListFeature(this.db, Number(f.feature))))
                            );
                            require('../Util/updateListMessage')(this.client, this.db, changes, changes['id']);
                            res.redirect('/lists/' + changes.id)
                        } catch (e) {
                            handleError(this.db, req.method, req.originalUrl, e.stack);
                            res.status(500).render('error', { title: 'Database Error' });
                        }
                    });
                });
            } catch (e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).render('error', { title: 'Database Error' });
            }
        });

        this.router.get('/:id/icon', this.requiresAuth.bind(this), this.isMod.bind(this), async (req, res) => {
            try {
                const lists = await this.db.select().from('lists').where({ id: req.params.id }).limit(1);
                if (!lists.length) return res.status(404).render('error', {
                    title: 'Page not found',
                    status: 404,
                    message: 'The page you were looking for could not be found.'
                });
                try {
                    await require('../Util/updateIcon')(this.client, this.db, lists[0]);
                    res.render('error', { title: 'Success', status: 200, message: 'Icon has been updated' })
                } catch {
                    res.status(500).render('error', {
                        title: 'Error',
                        status: 400,
                        message: 'Icon has not been updated'
                    });
                }
            } catch (e) {
                handleError(this.db, req.method, req.originalUrl, e.stack);
                res.status(500).render('error', { title: 'Database Error' });
            }
        });
    }

    get getRouter() {
        return this.router;
    }
}

module.exports = ListsRoute;
