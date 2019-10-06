const discord = require('./src/discord');
const run = require('./src/run');
const test = require('./src/test');
const deploy = require('./src/deploy');

const main = async () => {
    // Notify
    await discord('📦 Deploying to staging...');
    console.log('Deploying to staging...');

    // Get local branch
    const branch = (await run('git rev-parse --abbrev-ref HEAD')).stdout.split('\n')[0];
    console.log('Local branch:', branch);

    // Tests
    if (!process.argv.includes('--skip-tests')) {
        // Notify
        await discord('🧪 Running tests...');
        console.log('Running tests...');

        // Run tests
        try {
            await test();
        } catch (e) {
            // Notify
            console.log('Tests failed:', e.stdout);
            console.log('Use --skip-tests to skip the test suite');
            await discord('❌ **Tests failed, aborting deploy.**');
            return;
        }
    } else {
        // Notify
        await discord('🧪 *Tests skipped*');
        console.log('Tests skipped');
    }

    // Push to remote
    await run(`git push origin ${branch}:staging -f`);

    // Notify
    await discord('🚀 Starting remote deployment...');
    console.log('Starting remote deployment...');

    // Do full Plesk deploy
    await deploy('staging.botblock.org');

    // Notify
    await discord('🎉 **Successfully deployed to <https://staging.botblock.org>**');
    console.log('Successfully deployed to staging');
};

main();
