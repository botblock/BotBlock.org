const run = require('./src/run');
const deploy = require('./src/deploy');

const main = async () => {
    // Get local branch
    const branch = (await run('git rev-parse --abbrev-ref HEAD')).stdout.split('\n')[0];
    console.log('Local branch: ', branch);

    // Check if there is a local copy of staging
    let localStaging = false;
    run('git rev-parse --verify staging').then(() => {
        localStaging = true;
    }).catch(() => {
        localStaging = false;
    });

    // Remove any local copy of staging
    if (localStaging) await run('git branch -D staging');

    // Checkout latest staging
    await run('git fetch && git checkout staging');

    // Push staging to production
    await run('git push origin staging:production -f');

    // Checkout back to original branch
    await run(`git checkout ${branch}`);

    // Remove local copy of staging
    await run('git branch -D staging');

    // Do full Plesk deploy
    await deploy('botblock.org');
};

main();
