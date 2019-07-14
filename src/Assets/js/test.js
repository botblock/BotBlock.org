var interval;
var previous;
var btn = document.getElementById('run');
var code = document.getElementById('tests');
var state = document.getElementById('state');

function runTests() {
    if (btn.hasAttribute('disabled')) return;
    btn.setAttribute('disabled', true);
    btn.classList.add('disabled');
    state.textContent = 'Initialising';
    var index = 0;
    var spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    interval = setInterval(function () {
        state.textContent = '\nRunning tests ' + spinner[index];
        index++;
        if (index >= spinner.length) index = 0;
    }, 50);
    fetchOutput();
}

function fetchOutput() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            if (xhr.responseText.trim() === "end") {
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
