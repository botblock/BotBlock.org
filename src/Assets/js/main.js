document.addEventListener('DOMContentLoaded', function () {
    // Navigation
    var burger = document.getElementsByClassName('navbar-burger')[0];
    var menu = document.getElementsByClassName('navbar-menu')[0];
    burger.onclick = function () {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
    };

    (document.querySelectorAll('.notification .delete') || []).forEach(function (deleteBtn) {
        var notification = deleteBtn.parentNode;
        deleteBtn.addEventListener('click', function () {
            notification.parentNode.removeChild(notification);
        });
    });
});

// Nav search functionality
function navbar_lists_go() {
    window.location.href = '/lists/search/' + encodeURIComponent(document.getElementById('navbar_lists_query').value);
}

document.getElementById('navbar_lists_search').addEventListener('submit', function (e) {
    e.preventDefault();
    navbar_lists_go();
});

// Google ads tries to mess with height of stuff, it won't win
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
        if (mutationRecord.target.style.height) mutationRecord.target.style.height = '';
        if (mutationRecord.target.style.minHeight) mutationRecord.target.style.minHeight = '';
    });
});
var target = document.querySelector('body > main');
observer.observe(target, { attributes : true, attributeFilter : ['style'] });
