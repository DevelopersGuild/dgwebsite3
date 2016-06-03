var tokenRequired = false;
var form = document.getElementById('join-form');
var email = document.getElementById('slack-email');
var token = document.getElementById('slack-token');
form.addEventListener('submit', function(evt) {
    if (!email.value) {
        evt.preventDefault();
    }
    if (tokenRequired && !token.value) {
        evt.preventDefault();
    }
});