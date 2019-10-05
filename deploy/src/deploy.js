const plesk = require('./plesk');

module.exports = async name => {
    // Get Plesk repo info
    const info = await plesk.getRepoInfo(name);

    // Set deploy actions
    const actions = await plesk.setDeployActions(
        info.domain_name, info.repository_name,
        'npm install && npm run db:migrate'
    );
    console.log('Plesk git actions message: ', actions);

    // Fetch latest update into Plesk
    const fetch = await plesk.gitFetch(info.domain_name, info.repository_name);
    console.log('Plesk git fetch message: ', fetch);

    // Deploy latest update to Plesk
    const deploy = await plesk.gitDeploy(info.domain_name, info.repository_name);
    console.log('Plesk git deploy message: ', deploy);

    // Restart NodeJS app
    const node = await plesk.restartNode(info.domain_name);
    console.log('Plesk restart node message: ', node);
};
