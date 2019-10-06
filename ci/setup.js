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
};

main();
