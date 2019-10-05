const discord = require('./src/discord');
const run = require('./src/run');
const deploy = require('./src/deploy');

const main = async () => {
    // Discord message
    await discord('📦 Deploying to staging...');

    // Get local branch
    const branch = (await run('git rev-parse --abbrev-ref HEAD')).stdout.split('\n')[0];
    console.log('Local branch: ', branch);

    // Push to remote
    await run(`git push origin ${branch}:staging -f`);

    // Discord message
    await discord('🚀 Starting remote deployment...');

    // Do full Plesk deploy
    await deploy('staging.botblock.org');

    // Discord message
    await discord('**Successfully deployed to <https://staging.botblock.org> 🎉**');
};

main();
