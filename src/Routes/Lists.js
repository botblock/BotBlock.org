const BaseRoute = require('../Structure/BaseRoute');
const ListController = require('../Controllers/ListController');
const ListFeatureController = require('../Controllers/ListFeaturesController');
const handleError = require('../Util/handleError');
const getList = require('../Util/getList');

class ListsRoute extends BaseRoute {
    constructor(client, db) {
        super('/lists');
        this.router = require('express').Router();
        this.client = client;
        this.db = db;
        this.routes();
        this.listController = new ListController(this.client, this.db);
        this.featureContoller = new ListFeatureController(this.client, this.db);
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
                            res.render('lists/lists', {
                                title: 'All Bot Lists',
                                subtitle: `${res.__('site_name')} - ${res.__('short_desc')}`,
                                lists,
                                footer
                            });
                        });
                    });
            } catch (e) {
                handleError(this.db, req, res, e.stack);
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
                handleError(this.db, req, res, e.stack);
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
                handleError(this.db, req, res, e.stack);
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
                                subtitle: `These lists are currently hidden on ${res.__('site_name')}.
                                To find out more about why each list here is hidden, press the Information button on the list card.`,
                                lists, footer
                            });
                        });
                    });
            } catch (e) {
                handleError(this.db, req, res, e.stack);
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
                handleError(this.db, req, res, e.stack);
            }
        });

        this.router.get('/features/manage', this.requiresAuth.bind(this), this.isMod.bind(this), (req, res) => {
            try {
                this.db.select().from('features')
                    .orderBy([
                        { column: 'display', order: 'desc' },
                        { column: 'name', order: 'asc' }
                    ])
                    .then((checkboxes) => {
                        res.render('lists/features/manage', {
                            title: 'Manage List Features',
                            checkboxes
                        });
                    });
            } catch (e) {
                handleError(this.db, req, res, e.stack);
            }
        });

        this.router.get('/features/manage/add', this.requiresAuth.bind(this), this.isMod.bind(this), (req, res) => {
            try {
                res.render('lists/features/edit', {
                    title: 'Add Feature',
                    data: {}
                });
            } catch (e) {
                handleError(this.db, req, res, e.stack);
            }
        });

        this.router.post('/features/manage/add', this.requiresAuth.bind(this), this.isMod.bind(this), async (req, res) => {
            try {
                const handle = await this.featureContoller.handle(req.body);
                if (Array.isArray(handle)) return res.render('lists/features/edit', {
                    title: 'Add Feature',
                    data: req.body,
                    errors: handle
                });
                res.redirect('/lists/features/manage');
            } catch (e) {
                handleError(this.db, req, res, e.stack);
            }
        });

        this.router.get('/features/manage/:id', this.requiresAuth.bind(this), this.isMod.bind(this), (req, res) => {
            try {
                this.db.select().from('features').where({ id: req.params.id }).limit(1).then((features) => {
                    if (!features.length) return res.status(404).render('error', {
                        title: 'Page not found',
                        status: 404,
                        message: 'The page you were looking for could not be found.'
                    });
                    res.render('lists/features/edit', {
                        title: `Edit Feature '${features[0].name}'`,
                        data: features[0]
                    });
                });
            } catch (e) {
                handleError(this.db, req, res, e.stack);
            }
        });

        this.router.post('/features/manage/:id', this.requiresAuth.bind(this), this.isMod.bind(this), (req, res) => {
            try {
                this.db.select().from('features').where({ id: req.params.id }).limit(1).then(async (features) => {
                    if (!features.length) return res.status(404).render('error', {
                        title: 'Page not found',
                        status: 404,
                        message: 'The page you were looking for could not be found.'
                    });
                    const handle = await this.featureContoller.handle(req.body, true, features[0]);
                    if (Array.isArray(handle)) return res.render('lists/features/edit', {
                        title: 'Edit Feature "' + features[0].name + '"',
                        data: features[0],
                        errors: handle
                    });
                    res.redirect('/lists/features/manage');
                });
            } catch (e) {
                handleError(this.db, req, res, e.stack);
            }
        });

        this.router.get('/features/manage/:id/delete', this.requiresAuth.bind(this), this.isAdmin.bind(this), (req, res) => {
            try {
                this.db.select().from('features').where({ id: req.params.id }).limit(1).then(async (features) => {
                    if (!features.length) return res.status(404).render('error', {
                        title: 'Page not found',
                        status: 404,
                        message: 'The page you were looking for could not be found.'
                    });
                    await this.db('features').where({ id: req.params.id }).del();
                    await this.db('feature_map').where({ feature: req.params.id }).del();
                    this.client.listFeaturesEdited(null, features[0]);
                    res.redirect('/lists/features/manage');
                });
            } catch (e) {
                handleError(this.db, req, res, e.stack);
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
                                        return obj;
                                    }, {});
                                    const lists = allLists.filter(list => list.id in map && map[list.id]);
                                    this.footerData().then((footer) => {
                                        res.render('lists/lists', {
                                            title: features[0].name,
                                            subtitle: `Bot lists on ${res.__('site_name')} with the feature '${features[0].name}'`,
                                            lists, footer
                                        });
                                    });
                                });
                        });
                });
            } catch (e) {
                handleError(this.db, req, res, e.stack);
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
                handleError(this.db, req, res, e.stack);
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
                handleError(this.db, req, res, e.stack);
            }
        });

        this.router.post('/add', this.requiresAuth.bind(this), this.isMod.bind(this), async (req, res) => {
            try {
                const features = await this.db.select().from('features').orderBy([
                    { column: 'display', order: 'desc' },
                    { column: 'name', order: 'asc' }
                ]);
                const handle = await this.listController.handle(req.body, res.locals.user);
                if (Array.isArray(handle)) return res.render('lists/edit', {
                    title: 'Add List',
                    edit: false,
                    checkboxes: features,
                    interactiveCheckboxes: true,
                    data: req.body,
                    errors: handle
                });
                res.redirect('/lists/' + req.body.id);
            } catch (e) {
                handleError(this.db, req, res, e.stack);
            }
        });

        this.router.get('/legacy-ids', this.requiresAuth.bind(this), this.isMod.bind(this), (req, res) => {
            try {
                this.db.select().from('legacy_ids').then((data) => {
                    res.render('lists/legacy_ids', {
                        title: 'Legacy IDs',
                        data
                    });
                });
            } catch (e) {
                handleError(this.db, req, res, e.stack);
            }
        });

        this.router.post('/legacy-ids', this.requiresAuth.bind(this), this.isMod.bind(this), (req, res) => {
            try {
                this.db.select().from('legacy_ids').then((data) => {
                    if ('template' in req.body) delete req.body.template;
                    const db_data = data.map(item => { return { id: item.id.toLowerCase().trim(), target: item.target.toLowerCase().trim() }; });
                    const post_data = Object.entries(req.body).map(item => { return { id: item[0].toLowerCase().trim(), target: item[1].toLowerCase().trim() }; });
                    const added = post_data.filter(item => {
                        const matches = db_data.filter(db_item => db_item.id === item.id && db_item.target === item.target);
                        return matches.length === 0;
                    });
                    const removed = db_data.filter(item => {
                        const matches = post_data.filter(post_item => post_item.id === item.id && post_item.target === item.target);
                        return matches.length === 0;
                    });
                    this.db('legacy_ids').whereIn('id', removed.map(item => item.id)).del().then(() => {
                        this.db('legacy_ids').insert(added).then(() => {
                            this.client.legacyIdsEditLog(added, removed);
                            res.render('lists/legacy_ids', {
                                title: 'Legacy IDs',
                                data: post_data
                            });
                        });
                    });
                });
            } catch (e) {
                handleError(this.db, req, res, e.stack);
            }
        });

        // *************
        // List ID specific routes
        // *************

        this.router.get('/:id', (req, res) => {
            try {
                getList(this.db, req.params.id).then(data => {
                    if (!data) return res.status(404).render('error', {
                        title: 'Page not found',
                        status: 404,
                        message: 'The page you were looking for could not be found.'
                    });
                    res.render('lists/list', {
                        title: `${data.name} (${data.id})`,
                        list: data,
                        checkboxes: data.features,
                        hideUncheckedBoxes: true
                    });
                });
            } catch (e) {
                handleError(this.db, req, res, e.stack);
            }
        });

        this.router.get('/:id/edit', this.requiresAuth.bind(this), this.isMod.bind(this), (req, res) => {
            try {
                getList(this.db, req.params.id).then(data => {
                    if (!data) return res.status(404).render('error', {
                        title: 'Page not found',
                        status: 404,
                        message: 'The page you were looking for could not be found.'
                    });
                    res.render('lists/edit', {
                        title: 'Edit ' + data.id,
                        data: data,
                        checkboxes: data.features,
                        edit: true,
                        hideUncheckedBoxes: false,
                        interactiveCheckboxes: true
                    });
                });
            } catch (e) {
                handleError(this.db, req, res, e.stack);
            }
        });

        this.router.post('/:id/edit', this.requiresAuth.bind(this), this.isMod.bind(this), (req, res) => {
            try {
                getList(this.db, req.params.id).then(async data => {
                    if (!data) return res.status(404).render('error', {
                        title: 'Page not found',
                        status: 404,
                        message: 'The page you were looking for could not be found.'
                    });
                    try {
                        const handle = await this.listController.handle(req.body, res.locals.user, true, data);
                        if (Array.isArray(handle)) return res.render('lists/edit', {
                            title: 'Edit ' + data.id,
                            data: data,
                            checkboxes: data.features,
                            edit: true,
                            hideUncheckedBoxes: false,
                            interactiveCheckboxes: true,
                            errors: handle
                        });
                        res.redirect('/lists/' + handle.id);
                    } catch (e) {
                        handleError(this.db, req, res, e.stack);
                    }
                });
            } catch (e) {
                handleError(this.db, req, res, e.stack);
            }
        });

        this.router.get('/:id/icon', this.requiresAuth.bind(this), this.isMod.bind(this), async (req, res) => {
            try {
                const data = await getList(this.db, req.params.id);
                if (!data) return res.status(404).render('error', {
                    title: 'Page not found',
                    status: 404,
                    message: 'The page you were looking for could not be found.'
                });
                try {
                    await require('../Util/updateIcon')(this.client, this.db, data);
                    res.render('error', { title: 'Success', status: 200, message: 'Icon has been updated' });
                } catch {
                    res.status(500).render('error', {
                        title: 'Error',
                        status: 400,
                        message: 'Icon has not been updated'
                    });
                }
            } catch (e) {
                handleError(this.db, req, res, e.stack);
            }
        });

    }

    get getRouter() {
        return this.router;
    }
}

module.exports = ListsRoute;
