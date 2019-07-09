document.addEventListener('DOMContentLoaded', function() {

    // Nav
    var burger = document.getElementsByClassName("navbar-burger")[0]; // Get the mobile control
    var menu = document.getElementsByClassName("navbar-menu")[0]; // Get the navbar menu
    burger.onclick = function (e) {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
    };

});