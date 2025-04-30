document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.querySelector(".login-form");
    
    if (signupForm) {
        const usernameInput = document.querySelector(".username-input");
        const emailInput = document.querySelector(".email-input");
        const passwordInput = document.querySelector(".password-input");
        const confirmPasswordInput = document.querySelector(".confirm-password-input");
        const signupButton = document.querySelector(".signup-submit-btn");
        const errorContainer = document.querySelector("#errorMessageContainer");
        const errorMessage = document.querySelector("#errorMessage");
        
        signupButton.addEventListener("click", async (e) => {
            e.preventDefault();
            
            // Clear previous errors
            errorMessage.textContent = "";
            errorContainer.style.display = "none";
            
            // Get form data
            const username = usernameInput.value.trim();
            // const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();
            
            // Form validation
            let isValid = true;
            
            // Username validation
            if (!username) {
                isValid = false;
                // usernameInput.nextElementSibling.textContent = "Username is required";
                errorMessage.textContent = "Username is required";
                        errorContainer.style.display = "flex";
            }
            
            // Email validation
            // if (email) {
            //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            //     if (!emailRegex.test(email)) {
            //         isValid = false;
            //         emailInput.nextElementSibling.textContent = "Invalid email format";
            //     }
            // }
            
            // Password validation
            if (!password) {
                isValid = false;
                // passwordInput.nextElementSibling.textContent = "Password is required";
                errorMessage.textContent = "Password is required";
                        errorContainer.style.display = "flex";
            }
            
            // Confirm password validation
            if (password !== confirmPassword) {
                isValid = false;
                // confirmPasswordInput.nextElementSibling.textContent = "Passwords do not match";
                errorMessage.textContent = "Passwords do not match";
                        errorContainer.style.display = "flex";
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
                        console.error("Signup error:", data.message || "Registration failed");
                        errorMessage.textContent = data.message || "Registration failed";
                        errorContainer.style.display = "flex";
                    }
                } catch (error) {
                    console.error("Signup error:", error);
                    errorMessage.textContent = error || "An error occurred. Please try again later.";
                    errorContainer.style.display = "flex";
                }
            }
        });
    }
});