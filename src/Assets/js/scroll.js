function setHash(id) {
    if (window.history.pushState) {
        window.history.pushState(null, null, '#' + id);
    } else {
        window.location.hash = '#' + id;
    }
}

function scrollTo(element) {
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: element.getBoundingClientRect().top + window.scrollY - document.getElementsByClassName('navbar')[0].getBoundingClientRect().height
    });
    setHash(element.getAttribute('id'));
}

window.addEventListener('load', function (event) {
    var elms = [].slice.call(document.querySelectorAll('a[href^="#"]')); // array not htmlcollection

    elms.forEach(function (thiselm) {
        thiselm.onclick = function (e) {
            e.preventDefault();
            scrollTo(document.querySelector(thiselm.getAttribute('href')));
        };
    });

    if (window.location.hash) {
        var elm = document.querySelector(window.location.hash);
        if (elm) scrollTo(elm);
    }
});
