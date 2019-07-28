const config = require('../config');

module.exports = (list) => {
    if (!Boolean(Number(list.display))) return '*List entry currently hidden*';
    if (Boolean(Number(list.defunct))) return '*List flagged as defunct*';
    return '**__' + list.name + ' (' + list.id +')__**\n' +
        '**View at: <' + config.baseURL + '/lists/' + list.id + '>**\n' +
        '**Website**: <' + list.url + '>' + '\n' +
        '**Owners**: ' + (list.owners || 'None') + '\n' +
        '**Discord**: ' + (list.discord ? '<' + list.discord + '>' : 'None') + '\n' +
        '**Discord Bots Only**: ' + (list.discord_only ? ':white_check_mark:' : ':x:') + '\n' +
        '**Works with POST API**: ' + (list.api_post ? ':white_check_mark:' : ':x:') + '\n' +
        '**Works with GET API**: ' + (list.api_get ? ':white_check_mark:' : ':x:') + '\n' +
        '    <' + config.baseURL + '/api/docs#bots>'
}
