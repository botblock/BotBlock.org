exports.up = async function (knex) {
    await knex.schema.createTable('requests', function (t) {
        t.string('ip').notNullable();
        t.string('verb').notNullable();
        t.string('route').notNullable();
        t.text('req_headers');
        t.text('req_body');
        t.text('res_headers');
        t.text('res_body');
        t.bigInteger('datetime').notNullable();
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTable('requests');
};
