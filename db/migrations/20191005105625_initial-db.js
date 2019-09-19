exports.up = async function (knex) {
    await knex.schema.createTable('about', function (t) {
        t.string('id').primary().unique();
        t.integer('position').notNullable();
        t.text('title').notNullable();
        t.text('content').notNullable();
    });
    await knex.schema.createTable('cache', function (t) {
        t.string('route').primary().unique();
        t.bigInteger('expiry').notNullable();
        t.text('data');
    });
    await knex.schema.createTable('errors', function (t) {
        t.string('route').notNullable();
        t.string('verb').notNullable();
        t.bigInteger('datetime').notNullable();
        t.text('error');
    });
    await knex.schema.createTable('feature_map', function (t) {
        t.string('list').notNullable();
        t.integer('feature').notNullable();
        t.boolean('value').notNullable();
        t.primary(['list', 'feature']);
    });
    await knex.schema.createTable('features', function (t) {
        t.increments('id').primary().unique();
        t.text('name').notNullable();
        t.integer('display').defaultTo(0).notNullable();
        t.integer('type').defaultTo(0).notNullable();
    });
    await knex.schema.createTable('libraries', function (t) {
        t.string('repo').primary().unique();
        t.text('language').notNullable();
        t.text('name').notNullable();
        t.text('description').notNullable();
        t.text('package_link').notNullable();
        t.text('package_link_name').notNullable();
        t.text('badge_image');
        t.text('badge_url');
        t.text('example_usage');
    });
    await knex.schema.createTable('lists', function (t) {
        t.string('id').primary().unique();
        t.bigInteger('added').notNullable();
        t.text('name').notNullable();
        t.text('url').notNullable();
        t.text('icon').notNullable();
        t.text('language').notNullable();
        t.boolean('display').defaultTo(true).notNullable();
        t.boolean('defunct').defaultTo(false).notNullable();
        t.boolean('discord_only').defaultTo(true).notNullable();
        t.text('description');
        t.text('api_docs');
        t.text('api_post');
        t.text('api_field');
        t.text('api_shard_id');
        t.text('api_shard_count');
        t.text('api_shards');
        t.text('api_get');
        t.text('api_all');
        t.text('view_bot');
        t.text('bot_widget');
        t.text('content');
        t.text('owners');
        t.text('discord');
    });
    await knex.schema.createTable('lists_messages', function (t) {
        t.string('list').notNullable();
        t.string('message').notNullable();
        t.primary(['list', 'message']);
    });
    await knex.schema.createTable('ratelimit', function (t) {
        t.text('ip').notNullable();
        t.text('bot_id').notNullable();
        t.text('route').notNullable();
        t.bigInteger('datetime').notNullable();
        t.bigInteger('expiry').notNullable();
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTable('about');
    await knex.schema.dropTable('cache');
    await knex.schema.dropTable('errors');
    await knex.schema.dropTable('feature_map');
    await knex.schema.dropTable('features');
    await knex.schema.dropTable('libraries');
    await knex.schema.dropTable('lists');
    await knex.schema.dropTable('lists_messages');
    await knex.schema.dropTable('ratelimit');
};
