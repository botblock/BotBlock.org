document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    var burger = document.getElementsByClassName('navbar-burger')[0];
    var menu = document.getElementsByClassName('navbar-menu')[0];
    burger.onclick = function (e) {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
    };

    (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
        $notification = $delete.parentNode;
        $delete.addEventListener('click', () => {
            $notification.parentNode.removeChild($notification);
        });
    });
});

function navbar_lists_go() {
    window.location.href = '/lists/search/' + encodeURIComponent(document.getElementById('navbar_lists_query').value);
}
document.getElementById('navbar_lists_search').addEventListener('submit', function (e) {
    e.preventDefault();
    navbar_lists_go();
});
