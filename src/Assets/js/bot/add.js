function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

function isSnowflake(value) {
    return isInt(value) && value.length >= 16;
}

document.getElementById('add').addEventListener('submit', function (e) {
    var value = document.getElementById('botid');
    if (!value) {
        var inputs = document.querySelectorAll('input[type=checkbox][id^=list-]:checked');
        if (inputs.length == 0) {
            document.getElementById('error').innerText = 'You must submit to at least one list!';
            return e.preventDefault();
        }
    }
    if (!value.value) { return e.preventDefault(); }
    if (!isSnowflake(value.value)) {
        document.getElementById('error').innerText = 'Please enter a valid snowflake ID to add';
        return e.preventDefault();
    }
});
