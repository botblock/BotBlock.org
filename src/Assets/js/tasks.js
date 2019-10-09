function runTask(id) {
    var btn = document.getElementById('runBtn' + id);
    if (btn.getAttribute('disabled')) return alert('Please wait!');

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            btn.textContent = 'Execution done!';
          } else {
            btn.textContent = 'Execution failed!';
          }
          btn.setAttribute('onclick', 'runTask(' + id +')');
          btn.removeAttribute('disabled');
        }
    };
    xhr.open('POST', '/tasks/run/' + id, true);
    xhr.send();

    btn.textContent = 'Executing ...';
    btn.setAttribute('disabled', true);
}
