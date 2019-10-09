module.exports = async (db, id) => {
    const allFeatures = await db.select().from('features');
    const listFeatures = await db.select().from('feature_map').where({ list: id });
    const map = listFeatures.reduce((obj, item) => {
        obj[item.feature] = item.value;
        return obj;
    }, {});
    return allFeatures.map(feature => {
        return {
            name: feature.name,
            id: feature.id,
            display: feature.display,
            type: feature.type,
            value: feature.id in map ? map[feature.id] : 0
        };
    }).sort((a, b) => {
        if (a.value === b.value) {
            if (a.display === b.display) {
                return a.name > b.name ? 1 : -1;
            }
            return b.display - a.display;
        }
        return b.value - a.value;
    });
};
