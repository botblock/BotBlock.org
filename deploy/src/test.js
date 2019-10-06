const run = require('./run');
const { port } = require('../../config');
const kill = require('kill-port');

module.exports = async () => {
    let err;

    // Kill any existing server
    await kill(port, 'tcp');

    // Start the server
    try {
        run('npm run start')
    } catch (e) {
    }

    // Run the test suite
    const out = await run('npm test').catch(e => {
        err = e;
    });

    // Kill the server
    await kill(port, 'tcp');

    // Throw any test error
    if (err) throw err;
    return out;
};
