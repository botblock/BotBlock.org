var interval;
var previous;
var start;
var btn = document.getElementById('run');
var code = document.getElementById('tests');
var state = document.getElementById('state');

function msToTimestamp(millis) {
    var d = new Date(millis);
    var h = d.getUTCHours();
    var m = d.getUTCMinutes();
    var s = d.getUTCSeconds();
    var ms = d.getUTCMilliseconds();
    return (h ? h + 'h:' : '') + (m ? m + 'm:' : '') + s.toString().padStart(2, '0') + 's.' + ms.toString().padStart(3, '0') + 'ms';
}

// eslint-disable-next-line no-unused-vars
function runTests(restart) {
    clearInterval(interval);
    btn.setAttribute('onclick', 'runTests(true)');
    btn.textContent = 'Restart Tests';
    state.textContent = 'Initialising';

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            start = JSON.parse(xhr.responseText).started;
            var index = 0;
            var spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
            interval = setInterval(function () {
                var since = Date.now() - start;
                var time = msToTimestamp(since);
                state.textContent = '\nRunning tests (' + time + ') ' + spinner[index];
                index++;
                if (index >= spinner.length) index = 0;
            }, 50);
            if(!restart) {
                setTimeout(function () {
                    fetchOutput();
                }, 50);
            }
        }
    };
    xhr.open('GET', '/test/' + (restart ? 'restart' : 'start'), true);
    xhr.send();
}

function fetchOutput() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var res = JSON.parse(xhr.responseText);

            if (res.finished !== null) {
                clearInterval(interval);
                state.textContent = '\nTests run in ' + msToTimestamp(res.finished - res.started);
            }

            code.innerHTML = res.data;
            setTimeout(function () {
                fetchOutput();
            }, 100);

            if (res.data !== previous) state.scrollIntoView();
            previous = res.data;
        }
    };
    xhr.open('GET', '/test/progress?_=' + encodeURIComponent(Date.now().toString()), true);
    xhr.send();
}
