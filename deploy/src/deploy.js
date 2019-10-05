const plesk = require('./plesk');
const axios = require('axios');
const config = require('../config');

const discord = async message => {
    return await axios.post(
        `https://discordapp.com/api/channels/${config.discord_channel}/messages`,
        {
            content: message
        },
        {
            headers: {
                Authorization: `Bot ${config.discord_token}`
            }
        }
    );
};

module.exports = async name => {
    // Discord message
    await discord(`🚀 Deploying to ${name}...`);

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

    // Discord message
    await discord(`**Successfully deployed to ${name} 🎉**`);
};
