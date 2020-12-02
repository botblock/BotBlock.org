exports.up = async function (knex) {
    await knex.schema.table('lists', function (t) {
        t.text('add_bot');
        t.text('add_bot_key');
    });
};

exports.down = async function (knex) {
    await knex.schema.table('lists', function (t) {
        t.dropColumn('add_bot');
        t.dropColumn('add_bot_key');
    });
};
