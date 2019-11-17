exports.up = async function (knex) {
    await knex.schema.createTable('legacy_ids', function (t) {
        t.string('id').primary().unique();
        t.string('target').notNullable();
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTable('legacy_ids');
};
