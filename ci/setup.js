const path = require('path');
const fs = require('fs');

const main = () => {
    // Detect if there is an existing config
    const configLocation = path.join(__dirname, '..', 'config.js');
    if (fs.existsSync(configLocation)) {
        fs.renameSync(configLocation, path.join(__dirname, '..', 'config.backup.js'));
    }

    // Copy CI config to root
    fs.copyFileSync(path.join(__dirname, 'config.ci.js'), configLocation);

    // If custom DB port, set it
    if (process.env.DB_PORT) {
        const rawConfig = fs.readFileSync(configLocation);
        rawConfig.replace('port: 3306,', `port: ${process.env.DB_PORT},`);
        fs.writeFileSync(configLocation, rawConfig);
    }
};

main();
