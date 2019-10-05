const run = require('./src/run');
const deploy = require('./src/deploy');

const main = async () => {
    // Get local branch
    const branch = (await run('git rev-parse --abbrev-ref HEAD')).stdout.split('\n')[0];
    console.log('Local branch: ', branch);

    // Push to remote
    await run(`git push origin ${branch}:staging -f`);

    // Do full Plesk deploy
    await deploy('staging.botblock.org');
};

main();
