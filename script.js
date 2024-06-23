function checkLogin() {
    // Get username and password from the form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username == "demo" && password == "admin") {
        sessionStorage.setItem('authToken', Math.random().toString(36).substring(7));
        location.href = 'dashboard.html'; // Redirect to dashboard on successful login
    } else {
        loginBtn.style.background = "red";
        loginBtn.innerText = "Invalid Username or Password";

        setTimeout(() => {
            loginBtn.style.background = "#1abc9c";
            loginBtn.innerText = "Login";
        }, 2000);

        return false;
    }
}