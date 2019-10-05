const db = require('./db')();
const YAML = require('yaml');
const fs = require('fs').promises;
const path = require('path');

const tables = [
    'about',
    'feature_map',
    'features',
    'libraries',
    'lists',
];

const main = async () => {
    for (let i = 0; i < tables.length; i++) {
        const data = await db.select().from(tables[i]);
        const yaml = YAML.stringify(data);
        await fs.writeFile(path.join(__dirname, 'seeds', 'data', `${tables[i]}.yml`), yaml);
    }

    db.destroy();
};

main();
