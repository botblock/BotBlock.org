window.addEventListener('load', function (event) {
    var elm = document.getElementById('feature_toggle');
    var elms = [].slice.call(document.getElementsByClassName('checkbox disallowed')); // array not htmlcollection

    elm.onclick = function (e) {
        if (parseInt(elm.getAttribute('data-toggled')) == 0) {
            elms.forEach(function (thiselm) {
                thiselm.classList.remove('is-hidden');
            });
            elm.setAttribute('data-toggled', '1');
            elm.innerText = 'Hide Unchecked';
        } else {
            elms.forEach(function (thiselm) {
                thiselm.classList.add('is-hidden');
            });
            elm.setAttribute('data-toggled', '0');
            elm.innerText = 'Show All';
        }
    };
});
