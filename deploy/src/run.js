const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async cmd => {
    return await exec(cmd, { cwd: path.join(__dirname, '..', '..') });
};
