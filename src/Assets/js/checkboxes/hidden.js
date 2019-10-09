window.addEventListener('load', function () {
    var elm = document.getElementById('feature_toggle');
    var elms = [].slice.call(document.getElementsByClassName('checkbox disallowed')); // array not htmlcollection

    elm.onclick = function () {
        if (parseInt(elm.getAttribute('data-toggled')) === 0) {
            elms.forEach(function (thisElm) {
                thisElm.classList.remove('is-hidden');
            });
            elm.setAttribute('data-toggled', '1');
            elm.innerText = 'Hide Unchecked';
        } else {
            elms.forEach(function (thisElm) {
                thisElm.classList.add('is-hidden');
            });
            elm.setAttribute('data-toggled', '0');
            elm.innerText = 'Show All';
        }
    };
});
