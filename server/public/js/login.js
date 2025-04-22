document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".login-form");
    
    if (loginForm) {
        const usernameInput = document.querySelector(".username-input");
        const passwordInput = document.querySelector(".password-input");
        const loginButton = document.querySelector(".login-submit-btn");
        const errorMessages = document.querySelectorAll(".error-message");
        
        loginButton.addEventListener("click", async (e) => {
            e.preventDefault();
            
            // Clear previous errors
            errorMessages.forEach(error => error.textContent = "");
            
            // Get form data
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Form validation
            let isValid = true;
            
            if (!username) {
                isValid = false;
                usernameInput.nextElementSibling.textContent = "Username is required";
            }
            
            if (!password) {
                isValid = false;
                passwordInput.nextElementSibling.textContent = "Password is required";
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
                        loginForm.querySelector(".login-actions").previousElementSibling.querySelector(".error-message").textContent = data.message || "Invalid username or password";
                    }
                } catch (error) {
                    console.error("Login error:", error);
                    loginForm.querySelector(".login-actions").previousElementSibling.querySelector(".error-message").textContent = "An error occurred. Please try again later.";
                }
            }
        });
    }
});