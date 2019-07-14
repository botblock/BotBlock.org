function runTests() {
    var btn = document.getElementById('run');
    if (btn.hasAttribute('disabled')) return;
    btn.setAttribute('disabled', true);
    btn.classList.add('disabled');

    var code = document.getElementById('tests');
    code.textContent = 'Initialising';

    var state = 0;
    var spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    var interval = setInterval(function () {
        code.textContent = 'Running tests ' + spinner[state];
        state++;
        if (state >= spinner.length) state = 0;
    }, 50);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            clearInterval(interval);
            code.innerHTML = xhr.responseText;
            btn.removeAttribute('disabled');
            btn.classList.remove('disabled');
        }
    };
    xhr.open('GET', '/test/run', true);
    xhr.send();
}
