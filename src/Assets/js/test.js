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

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            start = parseInt(xhr.responseText);
            var index = 0;
            var spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
            interval = setInterval(function () {
                var since = Date.now() - start;
                var d = new Date(since);
                var h = d.getUTCHours();
                var m = d.getUTCMinutes();
                var s = d.getUTCSeconds();
                var ms = d.getUTCMilliseconds();
                var time = (h ? h + 'h:' : '') + (m ? m + 'm:' : '') + s.toString().padStart(2, '0') + 's.' + ms.toString().padStart(3, '0') + 'ms';
                state.textContent = '\nRunning tests (' + time + ') ' + spinner[index];
                index++;
                if (index >= spinner.length) index = 0;
            }, 50);
            setTimeout(function () {
                fetchOutput()
            }, 50);
        }
    };
    xhr.open('GET', '/test/start', true);
    xhr.send();
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
    xhr.open('GET', '/test/progress?_=' + encodeURIComponent(Date.now().toString()), true);
    xhr.send();
}
