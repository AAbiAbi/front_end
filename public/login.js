document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Get the entered username
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value;

    // Store the username in localStorage
    localStorage.setItem("username", username);

    // Redirect to index.html
    window.location.href = "index1.html";
});
