var backend_url = "https://pglife-2.onrender.com";

window.addEventListener("load", function () {
    var signup_form = document.getElementById("signup-form");
    if (signup_form) {
        signup_form.addEventListener("submit", function (event) {
            var XHR = new XMLHttpRequest();
            var form_data = new FormData(signup_form);

            // On success
            XHR.addEventListener("load", signup_success);

            // On error
            XHR.addEventListener("error", on_error);

            // Set up request to Render backend
            XHR.open("POST", backend_url + "/api/signup_submit.php");

            // Form data is sent with request
            XHR.send(form_data);

            var loader = document.getElementById("loading");
            if (loader) loader.style.display = 'block';
            event.preventDefault();
        });
    }

    var login_form = document.getElementById("login-form");
    if (login_form) {
        login_form.addEventListener("submit", function (event) {
            var XHR = new XMLHttpRequest();
            var form_data = new FormData(login_form);

            // On success
            XHR.addEventListener("load", login_success);

            // On error
            XHR.addEventListener("error", on_error);

            // Set up request to Render backend
            XHR.open("POST", backend_url + "/api/login_submit.php");

            // Form data is sent with request
            XHR.send(form_data);

            var loader = document.getElementById("loading");
            if (loader) loader.style.display = 'block';
            event.preventDefault();
        });
    }
});

var signup_success = function (event) {
    var loader = document.getElementById("loading");
    if (loader) loader.style.display = 'none';

    try {
        var response = JSON.parse(event.target.responseText);
        alert(response.message);
        if (response.success) {
            window.location.href = backend_url + "/index.php";
        }
    } catch (e) {
        alert("Operation completed.");
    }
};

var login_success = function (event) {
    var loader = document.getElementById("loading");
    if (loader) loader.style.display = 'none';

    try {
        var response = JSON.parse(event.target.responseText);
        if (response.success) {
            location.reload();
        } else {
            alert(response.message);
        }
    } catch (e) {
        alert("Operation completed.");
    }
};

var on_error = function (event) {
    var loader = document.getElementById("loading");
    if (loader) loader.style.display = 'none';

    alert('Oops! Something went wrong.');
};
