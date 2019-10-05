const seedsImport = require('../seedsImport');

exports.seed = async function (knex) {
    await seedsImport(knex, 'about');
};
