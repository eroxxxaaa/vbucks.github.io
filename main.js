$(document).ready(function() {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        // User is logged in, show username and logout button
        $("#logoutBtn").show();
        $(".fa-user-circle").show();
        $("#loginBtn").hide();
        const username = localStorage.getItem('username');
        $("#username").text(username);
    } else {
        // User is not logged in, hide username and logout button
        $("#username").hide();
        $("#logoutBtn").hide();
    }

    // Signup form submission
    $("#signupForm").submit(function(event) {
        event.preventDefault();
        const username = $("#signupUsername").val();
        const password = $("#signupPassword").val();
        // Perform signup authentication here, for example, check if the username is already registered
        // If signup is successful, save the username to localStorage and redirect to the main page
        // Otherwise, display an error message
        if (username && password) {
            // Successful signup, save username and redirect to main page
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('username', username);
            window.location.href = "index.html";
        } else {
            $("#signupError").text("Please enter both username and password.");
        }
    });

    // Login form submission
    $("#loginForm").submit(function(event) {
        event.preventDefault();
        const username = $("#loginUsername").val();
        const password = $("#loginPassword").val();
        // Perform login authentication here, for example, check if the username and password match
        // If login is successful, save the username to localStorage and redirect to the main page
        // Otherwise, display an error message
        if (username && password) {
            // Successful login, save username and redirect to main page
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('username', username);
            window.location.href = "index.html";
        } else {
            $("#loginError").text("Please enter both username and password.");
        }
    });

    // Logout button click event
    $("#logoutBtn").click(function() {
        // Remove the logged-in status and username from localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        // Hide logout button and profile icon, show login button
        $("#logoutBtn").hide();
        $(".fa-user-circle").hide();
        $("#username").hide();
        $("#loginBtn").show();
    });
});
