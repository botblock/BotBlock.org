window.addEventListener('load', function () {
    document.getElementById('search').addEventListener('submit', function (e) {
        e.preventDefault();
        window.location.href = '/lists/search/' + encodeURIComponent(document.getElementById('query').value);
    });
});
