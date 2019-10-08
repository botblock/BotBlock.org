module.exports = (client, db, list) => {
    return new Promise((resolve, reject) => {
        let newList = Object.assign({}, list);
        const icon = new RegExp(/^\s*https?:\/\/cdn\.discordapp\.com\/icons\/\d+\/[\w\d]+\.png/g).exec(list.icon);
        if (!icon) return reject('Failed to update, list does not have a Discord icon saved.');
        let inviteRegex = new RegExp(/^\s*https?:\/\/discord\.gg\/([\w\d]+)\s*$/i);
        if (!list.discord) return reject('No invite saved.');
        if (list.discord && inviteRegex.test(list.discord)) {
            const code = inviteRegex.exec(list.discord);
            client.getInvite(code[1]).then((i) => {
                const newIcon = 'https://cdn.discordapp.com/icons/' + i.guild.id + '/' + i.guild.icon + '.png';
                if (list.icon === newIcon) return reject('Icon has not changed.');
                db('lists').where({ id: list.id }).update({ icon: newIcon }).then(() => {
                    newList['icon'] = newIcon;
                    client.updateEditLog(list, newList);
                    resolve('Icon has been updated.');
                }).catch(() => {
                    reject('Failed to update icon in database.');
                })
            }).catch(() => {
                reject('Failed to update, invite has expired.');
            })
        } else return reject('Failed to update, list does not have a Discord icon saved.');
    })
}
