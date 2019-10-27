module.exports = async (db, id) => {
    const res = await db.select('target').from('legacy_ids').where({ id });
    if (res.length) return res[0].target;
    return id;
};
