document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".login-form");



    if (loginForm) {
        const usernameInput = document.querySelector(".username-input");
        const passwordInput = document.querySelector(".password-input");
        const loginButton = document.querySelector(".login-submit-btn");
        const errorMessage = document.querySelector("#errorMessage");

        hideErrorMessage();

        loginButton.addEventListener("click", async (e) => {
            e.preventDefault();

            hideErrorMessage();

            // Get form data
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // TODO: Form validation
            let isValid = true;

            if (!username) {
                isValid = false;
                return showErrorMessage("Username is required");
            }

            if (!password) {
                isValid = false;
                return showErrorMessage("Password is required");
            }

            // Submit form if valid
            if (isValid) {
                try {
                    const response = await fetch("/api/users/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            userName: username,
                            password: password
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        // Login successful, redirect to events page
                        window.location.href = "/event";
                    } else {
                        // Display error from server
                        let message = data.error || "Invalid username or password";
                        console.error("Login error:", message);
                        showErrorMessage(message);
                    }
                } catch (error) {
                    let message = data.message || "An error occurred. Please try again later.";
                    console.error("Login error:", message);
                    showErrorMessage(message);
                }
            }
        });
    }
});

function showErrorMessage(msg) {
	const errorMessage = document.getElementById('errorMessage');
	errorMessage.innerHTML = `<i class="fas fa-triangle-exclamation"></i> ${msg}`;
	errorMessage.style.display = 'flex';
}

function hideErrorMessage() {
	const errorMessage = document.getElementById('errorMessage');
	errorMessage.style.display = 'flex';
	errorMessage.innerHTML = '';
}