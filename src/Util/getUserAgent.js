module.exports = () => {
    let userAgents = [];

    for (const a of ['4', '5', '6', '7']) {
        for (const v of ['3.4.4', '3.4.3', '3.4.2', '3.4.1', '3.4.0', '3.3.2', '3.3.1', '3.3.0']) {
            userAgents.push('Python/3.' + a + ' aiohttp/' + v)
        }
    }

    for (const a of ['2.20.0', '2.19.1', '2.19.0', '2.18.4', '2.18.3']) {
        userAgents.push('python-requests/' + a)
    }

    for (const a of ['2.2.0', '2.1.2', '2.1.1', '2.1.0', '2.0.0']) {
        userAgents.push('node-fetch/' + a + ' (https://github.com/bitinn/node-fetch)')
    }

    for (const a of ['4.0.4', '4.0.3', '4.0.2', '4.0.1', '4.0.0', '3.6.4', '3.6.3', '3.6.2']) {
        userAgents.push('snekfetch/' + a)
    }

    for (const a of ['3.11.0', '3.10.0', '3.9.1', '3.9.0']) {
        userAgents.push('okhttp/' + a)
    }
    return { userAgents, random: userAgents[Math.round(Math.random() * userAgents.length)] }
}
