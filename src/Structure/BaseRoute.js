class BaseRoute {
    constructor(route) {
        this.route = route;
    }

    requiresAuth(req, res, next) {
        if (!req.session.user) return res.render('error', { title: 'Authentication is required ', status: 403, message: 'You must be authorized to view that page.' });
        next();
    }

    isMod(req, res, next) {
        if (req.session.user.mod || req.session.user.admin) return next();
        res.render('error', { title: 'Page not found', status: 404, message: 'The page you were looking for could not be found.' });
    }

    isAdmin(req, res, next) {
        if (req.session.user.admin) return next();
        res.render('error', { title: 'Page not found', status: 404, message: 'The page you were looking for could not be found.' });
    }

}

module.exports = BaseRoute;
