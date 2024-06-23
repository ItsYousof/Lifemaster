document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('loginBtn');

    loginBtn.onclick = () => {
        // Get username and password from the form
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Fetch the JSON file using the proxy service
        fetch("https://api.allorigins.win/get?url=https://codebentodev.w3spaces.com/logins.json")
            .then(response => response.json())
            .then(data => {
                // The response data is wrapped in a contents property
                const logins = JSON.parse(data.contents);

                // Check if the entered username and password match any entry in the JSON data
                const user = logins.find(user => user.username === username && user.password === password);

                if (user) {
                    sessionStorage.setItem('authToken', Math.random().toString(36).substring(7));
                    location.href = 'dashboard.html'; // Redirect to dashboard on successful login
                } else {
                    alert('Invalid username or password');
                }
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
                alert('An error occurred. Please try again later.');
            });
    };
});
