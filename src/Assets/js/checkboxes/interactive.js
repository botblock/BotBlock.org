window.addEventListener('load', function () {
    var elms = [].slice.call(document.getElementsByClassName('checkbox')); // array not htmlcollection

    function handleClick(elm) {
        if (elm.classList.contains('disallowed')) {
            elm.classList.remove('disallowed');
            elm.getElementsByTagName('input')[0].checked = true;
        } else {
            elm.classList.add('disallowed');
            elm.getElementsByTagName('input')[0].checked = false;
        }
        if ('createEvent' in document) {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('change', false, true);
            elm.getElementsByTagName('input')[0].dispatchEvent(evt);
        }
    }

    elms.forEach(function (thisElm) {
        thisElm.onclick = function () {
            handleClick(thisElm);
        };
    });
});
