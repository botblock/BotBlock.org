exports.up = async function (knex) {
    await knex.schema.table('features', function (t) {
        t.text('description');
    });
};

exports.down = async function (knex) {
    await knex.schema.table('features', function (t) {
        t.dropColumn('description');
    });
};
