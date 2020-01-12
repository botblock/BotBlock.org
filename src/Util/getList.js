const getListFeatures = require('./getListFeatures');
const legacyListMap = require('./legacyListMap');

module.exports = async (db, id) => {
    const mappedId = await legacyListMap(db, id);
    const lists = await db.select().from('lists').where({ id: mappedId }).limit(1);
    if (!lists.length) return;
    const features = await getListFeatures(db, lists[0].id);
    return { ...lists[0], features };
};
