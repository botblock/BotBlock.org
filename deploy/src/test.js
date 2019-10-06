const run = require('./run');
const { port } = require('../../config');
const kill = require('kill-port');

module.exports = async () => {
    let err, out;

    // Kill any existing server
    await kill(port, 'tcp');

    // Start the server
    run('npm run start').catch(() => {
        console.log('Web server killed')
    });

    // Run the test suite
    try {
        out = await run('npm run test -- --skip-lighthouse --reporter dot');
    } catch (e) {
        err = e;
    }

    // Kill the server
    await kill(port, 'tcp');

    // Throw any test error
    if (err) throw err;
    return out;
};
