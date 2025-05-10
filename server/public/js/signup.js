document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.querySelector(".login-form");

    if (signupForm) {
        const usernameInput = document.querySelector(".username-input");
        const passwordInput = document.querySelector(".password-input");
        const confirmPasswordInput = document.querySelector(".confirm-password-input");
        const signupButton = document.querySelector(".signup-submit-btn");

        hideErrorMessage();

        signupButton.addEventListener("click", async (e) => {
            e.preventDefault();

            hideErrorMessage();

            // Get form data
            const username = usernameInput.value.trim();
            // const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();

            let isValid = true;

            // Username validation
            if (!username) {
                isValid = false;
                return showErrorMessage("Username is required");
            }

            if (username.length > 20) {
                isValid = false;
                return showErrorMessage("Username must be a string with at most 20 characters.");
            }

            if (!/^[a-zA-Z0-9]+$/.test(username)) {
                isValid = false;
                return showErrorMessage("Username can only contain letters and numbers.");
            }

            // Password validation
            if (!password) {
                isValid = false;
                return showErrorMessage("Password is required");
            }

            if (password.length > 30 || password.length < 4) {
                isValid = false;
                return showErrorMessage("Password must be a string with at most 30 characters and at least 4 characters.");
            }

            if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/.test(password)) {
                isValid = false;
                return showErrorMessage("Password can only contain letters, numbers, and symbols.");
            }

            // Confirm password validation
            if (password !== confirmPassword) {
                isValid = false;
                return showErrorMessage("Passwords do not match");
            }

            // Submit form if valid
            if (isValid) {
                try {
                    const response = await fetch("/api/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            userName: username,
                            name: username, // Using username as name for now
                            password: password,
                            email: null,
                            introduction: null,
                            sex: null,
                            phone: null
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        // Signup successful, redirect to login page
                        window.location.href = "/login?registered=true";
                    } else {
                        // Display error from server
                        let message = data.message || "Registration failed";
                        console.error("Signup error:", message);
                        showErrorMessage(message);
                    }
                } catch (error) {
                    let message = data.message || "An error occurred. Please try again later.";
                    console.error("Signup error:", message);
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