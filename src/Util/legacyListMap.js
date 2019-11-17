module.exports = async (db, id) => {
    const res = await db.select('target').from('legacy_ids').where({ id }).limit(1);
    if (res.length) return res[0].target;
    return id;
};
