
exports.up = async function(knex) {
    await knex.schema.createTable('kv_cache', function (t) {
        t.string('key').primary().notNullable().unique();
        t.text('value', 'longtext').notNullable();
        t.bigInteger('datetime').notNullable();
    });
};

exports.down = async function(knex) {
    await knex.dropTable('kv_cache');
};
