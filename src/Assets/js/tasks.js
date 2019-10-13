// eslint-disable-next-line no-unused-vars
function runTask(id) {
    var btn = document.getElementById('runBtn' + id);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                btn.textContent = 'Execution done!';
            } else {
                btn.textContent = 'Execution failed!';
            }
            btn.classList.remove('is-loading');
        }
    };
    xhr.open('POST', '/tasks/run/' + id, true);
    xhr.send();

    btn.classList.add('is-loading');
}
