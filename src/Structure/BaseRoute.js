class BaseRoute {
    constructor(route) {
        this.route = route;
    }

    requiresAuth(req, res, next) {
        if (!req.session.user) return res.status(403).render('authRequired', { title: 'Authentication is required' });
        next();
    }

    isMod(req, res, next) {
        if (req.session.user.mod || req.session.user.admin) return next();
        // res.render('error', { title: 'Page not found', status: 404, message: 'The page you were looking for could not be found.' });
        res.status(403).render('authRequired', { title: 'Authentication is required' })
    }

    isAdmin(req, res, next) {
        if (req.session.user.admin) return next();
        // res.render('error', { title: 'Page not found', status: 404, message: 'The page you were looking for could not be found.' });
        res.status(403).render('authRequired', { title: 'Authentication is required' })
    }

}

module.exports = BaseRoute;
