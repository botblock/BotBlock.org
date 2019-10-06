const path = require('path');
const fs = require('fs');
const test = require('../deploy/src/test');

const main = async () => {
    // Detect if there is an existing config
    const configLocation = path.join(__dirname, '..', 'config.js');
    let configExists = false, configBackupLocation;
    if (fs.existsSync(configLocation)) {
        configExists = true;
        configBackupLocation = path.join(__dirname, '..', 'config.backup.js');
        fs.renameSync(configLocation, configBackupLocation);
    }

    // Copy CI config to root
    const configCILocation = path.join(__dirname, 'config.ci.js');
    fs.copyFileSync(configCILocation, configLocation);

    // Run tests
    let out, err;
    out = await test().catch(e => {
        err = e;
    });

    // Restore original config
    fs.unlinkSync(configLocation);
    if (configExists) fs.renameSync(configBackupLocation, configLocation);

    // Throw/log tests result
    if (err) throw err;
    console.log(out);
};

main();
