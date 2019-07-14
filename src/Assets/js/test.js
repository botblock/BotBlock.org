var interval;
var previous;
var start;
var btn = document.getElementById('run');
var code = document.getElementById('tests');
var state = document.getElementById('state');

function runTests() {
    if (btn.hasAttribute('disabled')) return;
    btn.setAttribute('disabled', true);
    btn.classList.add('disabled');
    state.textContent = 'Initialising';
    start = Date.now();
    var index = 0;
    var spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    interval = setInterval(function () {
        var since = Date.now() - start;
        var d = new Date(since);
        var h = d.getUTCHours();
        var m = d.getUTCMinutes();
        var s = d.getUTCSeconds();
        var ms = d.getUTCMilliseconds();
        var time = (h ? h + 'h:' : '') + (m ? m + 'm:' : '') + s + 's.' + ms + 'ms';
        state.textContent = '\nRunning tests (' + time + ') ' + spinner[index];
        index++;
        if (index >= spinner.length) index = 0;
    }, 50);
    fetchOutput();
}

function fetchOutput() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (xhr.responseText.trim() === 'end') {
                clearInterval(interval);
                state.textContent = '';
                btn.removeAttribute('disabled');
                btn.classList.remove('disabled');
            } else {
                code.innerHTML = xhr.responseText;
                setTimeout(function () {
                    fetchOutput()
                }, 100);
            }
            if (xhr.responseText !== previous) state.scrollIntoView();
            previous = xhr.responseText;
        }
    };
    xhr.open('GET', '/test/run?_=' + encodeURIComponent(Date.now().toString()), true);
    xhr.send();
}
