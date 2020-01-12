exports.up = async function (knex) {
    await knex.schema.alterTable('requests', function (t) {
        t.text('req_headers', 'longtext').alter();
        t.text('req_body', 'longtext').alter();
        t.text('res_headers', 'longtext').alter();
        t.text('res_body', 'longtext').alter();
    });
};

exports.down = async function (knex) {
    await knex.schema.alterTable('requests', function (t) {
        t.text('req_headers').alter();
        t.text('req_body').alter();
        t.text('res_headers').alter();
        t.text('res_body').alter();
    });
};
