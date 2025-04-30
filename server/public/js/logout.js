document.addEventListener("DOMContentLoaded", () => {

    const logoutButton = document.getElementById("logoutBtn");
    const cancelButton = document.getElementById("cancelBtn");
    const errorMessage = document.querySelector("#errorMessage");

    // Clear previous errors
    errorMessage.textContent = "";
    errorMessage.style.display = "none";

    cancelButton.addEventListener("click", async (e) => {
        history.back();
    }
    );

    logoutButton.addEventListener("click", async (e) => {

        // Clear previous errors
        errorMessage.textContent = "";
        errorMessage.style.display = "none";


        try {
            const response = await fetch("/api/users/logout", {
                method: "POST"
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful, redirect to events page
                window.location.href = "/login";
            } else {
                // Display error from server
                console.error("Login error:", data.message || "Invalid username or password");
                errorMessage.innerHTML = "<i class='fas fa-triangle-exclamation'></i>" + data.message || "Invalid username or password";
                errorMessage.style.display = "flex";
            }
        } catch (error) {
            console.error("Login error:", error);
            errorMessage.innerHTML = "<i class='fas fa-triangle-exclamation'></i>" + "An error occurred. Please try again later.";
            errorMessage.style.display = "flex";
        }

    });

});