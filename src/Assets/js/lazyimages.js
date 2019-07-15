window.addEventListener("load", function () {
    var elms = [].slice.call(document.getElementsByTagName("img")); // array not htmlcollection

    elms.forEach(function (elm) {
        if (elm.hasAttribute("data-lazysrc")) {
            elm.addEventListener("error", function() {
                elm.setAttribute("src", "/assets/img/question-mark.png");
                elm.style.opacity = "0.1";
            });
            elm.setAttribute("src", elm.getAttribute("data-lazysrc"));
            elm.removeAttribute("data-lazysrc");
        }
    });
});
