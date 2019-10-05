const YAML = require('yaml');
const fs = require('fs').promises;
const path = require('path');

module.exports = async (db, table) => {
    // Deletes ALL existing entries
    await db(table).del();

    // Get seed data
    const yaml = await fs.readFile(path.join(__dirname, 'seeds', 'data', `${table}.yml`), 'utf8');
    const data = YAML.parse(yaml);

    // Inserts seed entries
    await db(table).insert(data);
};
