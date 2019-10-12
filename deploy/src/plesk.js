const axios = require('axios');
const config = require('../config');

const pleskCommand = async params => {
    return await axios.post(`https://${config.plesk_host}:8443/api/v2/cli/plesk/call`, {
        params
    }, {
        headers: {
            Authorization: `Basic ${Buffer.from(`${config.plesk_user}:${config.plesk_password}`).toString('base64')}`
        }
    });
};

const getRepoInfo = async name => {
    let out;

    out = (await pleskCommand([
        'ext',
        'git',
        '--list',
        '-domain',
        name
    ])).data.stdout.split('\n')[1].trim().split(' ').filter(x => x.trim());
    const domain = out[0];
    const repo = out[1];

    out = (await pleskCommand([
        'ext',
        'git',
        '--info',
        '-domain',
        domain,
        '-name',
        repo
    ])).data.stdout.split('\n');

    return out.reduce(function (obj, item) {
        const data = item.split(/:(.*)/).map(x => x.trim());
        obj[data[0].toLowerCase().replace(/\s/g, '_')] = data[1];
        return obj;
    }, {});
};

const setDeployActions = async (domain, repo, command) => {
    const out = await pleskCommand([
        'ext',
        'git',
        '--update',
        '-domain',
        domain,
        '-name',
        repo,
        '-actions',
        command
    ]);
    return out.data.stdout;
};

const gitFetch = async (domain, repo) => {
    const out = await pleskCommand([
        'ext',
        'git',
        '--fetch',
        '-domain',
        domain,
        '-name',
        repo
    ]);
    return out.data.stdout;
};

const gitDeploy = async (domain, repo) => {
    const out = await pleskCommand([
        'ext',
        'git',
        '--deploy',
        '-domain',
        domain,
        '-name',
        repo
    ]);
    return out.data.stdout;
};

const restartNode = async domain => {
    await pleskCommand([
        'ext',
        'nodejs',
        '--disable',
        '-domain',
        domain
    ]);

    const out = await pleskCommand([
        'ext',
        'nodejs',
        '--enable',
        '-domain',
        domain
    ]);
    return out.data.stdout;
};

module.exports = {
    pleskCommand,
    getRepoInfo,
    setDeployActions,
    gitFetch,
    gitDeploy,
    restartNode
};
