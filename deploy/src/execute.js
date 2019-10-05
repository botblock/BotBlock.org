const plesk = require('./plesk');

const main = async (domain, command) => {
    // Get repo info
    const info = await plesk.getRepoInfo(domain);

    // Set deploy actions
    const actions = await plesk.setDeployActions(info.domain_name, info.repository_name, command);
    console.log('Plesk git actions message: ', actions);

    // Run deploy to trigger actions
    const deploy = await plesk.gitDeploy(info.domain_name, info.repository_name);
    console.log('Plesk git deploy message: ', deploy);
};

main(process.argv[2], process.argv.slice(3).join(' '));
