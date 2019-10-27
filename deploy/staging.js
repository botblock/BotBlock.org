const discordMessage = require('./src/discord');
const config = require('./config');
const run = require('./src/run');
const test = require('./src/test');
const deploy = require('./src/deploy');

const discord = async message => {
    await discordMessage(message, config.discord_staging_channel);
};

const main = async () => {
    // Get local branch
    const branch = (await run('git rev-parse --abbrev-ref HEAD')).stdout.split('\n')[0];
    console.log('Local branch:', branch);

    // Get commit ID
    const commit = (await run('git rev-parse --short HEAD')).stdout.split('\n')[0];
    console.log('Commit ID:', commit);

    // Notify
    await discord(`📦 **Deploying \`${branch}@${commit}\` to staging...**`);
    console.log('Deploying to staging...');

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

main().catch(async () => {
    // Notify of failure
    await discord('❌ **Deploy script failed, aborting deploy.**');
    console.log('Deploy script failed, aborting deploy');
});
