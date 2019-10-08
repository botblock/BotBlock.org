function runTask(id) {
    var btn = document.getElementById('runBtn' + id);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState < 4) {
            btn.setAttribute('onclick', 'alert("Please wait!")');
            btn.textContent = 'Executing ...';
        } else {
          if(this.status === 200) {
            btn.setAttribute('onclick', 'runTask(' + id +')');
            btn.textContent = 'Execution done!';
          } else {
            btn.textContent = 'Execution failed!';
          }
        }
    };
    xhr.open('GET', '/tasks/run/' + id, true);
    xhr.send();
}
