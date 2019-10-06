const discord = require('./src/discord');
const run = require('./src/run');
const test = require('./src/test');
const deploy = require('./src/deploy');

const resetLocal = async branch => {
    // Checkout back to original branch
    await run(`git checkout ${branch}`);

    // Remove local copy of staging
    await run('git branch -D staging');
};

const main = async () => {
    // Notify
    await discord('📦 Deploying to production...');
    console.log('Deploying to production...');

    // Get local branch for reset
    const branch = (await run('git rev-parse --abbrev-ref HEAD')).stdout.split('\n')[0];

    // Check if there is a local copy of staging
    let localStaging = true;
    try {
        await run('git rev-parse --verify staging');
    } catch (e) {
        localStaging = false;
    }

    // Remove any local copy of staging
    if (localStaging) await run('git branch -D staging');

    // Checkout latest staging
    await run('git fetch && git checkout staging');

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

            // Reset local branch
            await resetLocal(branch);
            return;
        }
    } else {
        // Notify
        await discord('🧪 *Tests skipped*');
        console.log('Tests skipped');
    }

    // Push staging to production
    await run('git push origin staging:production -f');

    // Reset local branch
    await resetLocal(branch);

    // Notify
    await discord('🚀 Starting remote deployment...');
    console.log('Starting remote deployment...');

    // Do full Plesk deploy
    await deploy('botblock.org');

    // Notify
    await discord('**Successfully deployed to <https://botblock.org> 🎉**');
    console.log('Successfully deployed to production');
};

main().catch(async () => {
    // Notify of failure
    await discord('❌ **Deploy script failed, aborting deploy.**');
    console.log('Deploy script failed, aborting deploy');
});
