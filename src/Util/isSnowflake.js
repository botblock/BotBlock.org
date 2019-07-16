module.exports = (snowflake) => {
    return !isNaN(snowflake) && snowflake.length >= 16;
}
