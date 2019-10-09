module.exports = async (db, id) => {
    try {
        const feature = await db.select().from('features').where({ id });
        if (!feature) return null;
        return feature[0];
    } catch {
        return null;
    }
};
