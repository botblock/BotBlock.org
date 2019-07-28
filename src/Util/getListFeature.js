module.exports = async (db, id) => {
    try {
        const feature = await db.run('SELECT * FROM features WHERE id = ?', [id]);
        if (!feature) return null;
        return feature[0];
    } catch (e) {
        return null;
    }
}
