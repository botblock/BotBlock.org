module.exports = {
    // Website Settings
    port: 80,

    secret: '',

    GACode: 'UA-113826252-4',

    baseURL: 'http://localhost',

    discord: {
        client_id: '',
        client_secret: '',
        token: '',
        scopes: ['identify'],
        guild_id: '',
        edit_log: '',
        lists_log: '',
        mod_role: '',
        admin_role: '',
        notifications: true
    },

    // SQL Database
    database: {
        host: '',
        user: '',
        password: '',
        database: '',
        client: 'mysql'
    },

    // SQL Database for Seed Data Exports
    // This can be left blank unless you need to export seed data
    seedDatabase: {
        host: '',
        user: '',
        password: '',
        database: '',
        client: 'mysql'
    }
};
