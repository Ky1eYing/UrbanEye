let sexChoices;

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch complete user data from API
  if (userInfo && userInfo._id) {
    try {
      const response = await fetch(`/api/users/${userInfo._id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.code === 200 && data.data) {
          const completeUserInfo = data.data;

          // Update userInfo
          userInfo.name = completeUserInfo.name || userInfo.name;
          userInfo.introduction = completeUserInfo.introduction || "";
          userInfo.sex = completeUserInfo.sex || "";
          userInfo.email = completeUserInfo.email || "";
          userInfo.phone = completeUserInfo.phone || "";

          document.getElementById("nameDisplay").textContent = userInfo.name;
          document.getElementById(
            "usernameDisplay"
          ).textContent = `@${userInfo.userName}`;
          document.getElementById("introductionDisplay").textContent =
            userInfo.introduction || "No introduction provided";
          document.getElementById("sexDisplay").textContent =
            userInfo.sex || "Not specified";
          document.getElementById("emailDisplay").textContent =
            userInfo.email || "No email provided";
          document.getElementById("phoneDisplay").textContent =
            userInfo.phone || "No phone provided";

          // Update the form fields for editing
          document.getElementById("editName").value = userInfo.name || "";
          document.getElementById("editIntroduction").value =
            userInfo.introduction || "";
          document.getElementById("editEmail").value = userInfo.email || "";
          document.getElementById("editPhone").value = userInfo.phone || "";

          const sexSelect = document.getElementById("editSex");
          if (sexSelect && sexChoices && userInfo.sex) {
            sexChoices.setChoiceByValue(userInfo.sex);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching complete user data:", error);
    }
  }

  // Hide all error messages on page load
  const errorMessages = document.querySelectorAll('[id="errorMessage"]');
  errorMessages.forEach((element) => {
    element.style.display = "none";
  });

  const profileView = document.getElementById("profileView");
  const editProfileView = document.getElementById("editProfileView");
  const editProfileBtn = document.getElementById("editProfileBtn");
  const signOutBtn = document.getElementById("signOutBtn");
  const backToProfileBtn = document.getElementById("backToProfileBtn");
  // Go to edit profile button
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      profileView.style.display = "none";
      editProfileView.style.display = "flex";
    });
  }
  // Back to profile button
  if (backToProfileBtn) {
    backToProfileBtn.addEventListener("click", function () {
      editProfileView.style.display = "none";
      profileView.style.display = "flex";
    });
  }
  // Sign out button
  if (signOutBtn) {
    signOutBtn.addEventListener("click", function () {
      // Redirect to logout route
      window.location.href = "/logout";
    });
  }

  // // get old user info
  const oldAvatar = document.getElementById("avatarDisplay").src;
  // const oldName = document.getElementById("nameDisplay").textContent.trim();
  // const oldUsername = document.getElementById("usernameDisplay").textContent.trim();
  // const oldIntroduction = document.getElementById("introductionDisplay").textContent.trim();
  // const oldSex = document.getElementById("sexDisplay").textContent.trim();
  // const oldEmail = document.getElementById("emailDisplay").textContent.trim();
  // const oldPhone = document.getElementById("phoneDisplay").textContent.trim();

  document.getElementById("avatarPreview").src = oldAvatar;
  // document.getElementById("editName").value = oldName;
  // document.getElementById("editUsername").value = oldUsername;
  // document.getElementById("editIntroduction").value = oldIntroduction;
  // document.getElementById("editEmail").value = oldEmail;
  // document.getElementById("editPhone").value = oldPhone;

  // disable username editing
  document.getElementById("editUsername").disabled = true;
  document.getElementById("editUsername").style.opacity = "0.7";

  const sexSelect = document.getElementById("editSex");
  //let sexChoices;
  if (sexSelect) {
    sexChoices = new Choices(sexSelect, {
      searchEnabled: false,
      itemSelectText: "",
      shouldSort: false,
      allowHTML: true,
    });

    // Set default value
    if (userInfo && userInfo.sex) {
      sexChoices.setChoiceByValue(userInfo.sex);
    }
  }

  // 监听所有 cancel/save 按钮
  const cancelBtns = document.querySelectorAll(".cancel-btn");
  const saveBtns = document.querySelectorAll(".save-btn");

  // 更新头像事件
  const avatarUpload = document.getElementById("avatarUpload");
  if (avatarUpload) {
    avatarUpload.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        // TODO: 上传头像到服务器
        console.log("Selected avatar file:", file);
        // 预览可直接用 FileReader
        previewAvatar(file);
      }
    });
  }

  // form submission handlers for profile updates
  setupFormSubmitHandlers();
});

/**
 * 用于回退字段更改
 */
function revertField(field) {
  if (field === "name") {
    document.getElementById("editName").value = userInfo.name || "";
  } else if (field === "sex") {
    document.getElementById("editSex").value = userInfo.sex || "";
    if (sexChoices) {
      if (userInfo.sex) {
        sexChoices.setChoiceByValue(userInfo.sex);
      } else {
        sexChoices.setChoiceByValue("");
      }
    }
  } else if (field === "email") {
    document.getElementById("editEmail").value = userInfo.email || "";
  } else if (field === "phone") {
    document.getElementById("editPhone").value = userInfo.phone || "";
  }
}

/**
 * 演示用：发送AJAX更新信息
 */
async function updateProfileField(fieldKey, newValue) {
  try {
    const resp = await fetch("/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [fieldKey]: newValue }),
    });
    if (!resp.ok) throw new Error("Update failed");

    const updatedUser = await resp.json();
    // 更新界面显示
    if (fieldKey === "username") {
      document.getElementById("usernameDisplay").textContent =
        updatedUser.username;
      document.getElementById("editName").value = updatedUser.username;
    } else if (fieldKey === "sex") {
      document.getElementById("sexDisplay").textContent = updatedUser.sex;
      document.getElementById("editSex").value = updatedUser.sex;
    } else if (fieldKey === "email") {
      document.getElementById("emailDisplay").textContent = updatedUser.email;
      document.getElementById("editEmail").value = updatedUser.email;
    }
    console.log("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to update profile: " + err.message);
  }
}

/**
 * 更新密码
 */
async function updatePassword(oldPwd, newPwd, confirmPwd) {
  if (newPwd !== confirmPwd) {
    alert("New password & confirm password do not match!");
    return;
  }
  try {
    const resp = await fetch("/profile/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd }),
    });
    if (!resp.ok) throw new Error("Password update failed");

    alert("Password changed successfully!");
    // 清空输入
    document.getElementById("oldPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
  } catch (err) {
    console.error(err);
    alert("Error changing password: " + err.message);
  }
}

/**
 * 预览头像
 */
function previewAvatar(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataURL = e.target.result;
    const avatarPreview = document.getElementById("avatarPreview");
    avatarPreview.style.backgroundImage = `url('${dataURL}')`;
    avatarPreview.style.backgroundSize = "cover";
    avatarPreview.style.backgroundPosition = "center";
  };
  reader.readAsDataURL(file);
}

function setupFormSubmitHandlers() {
  // save buttons
  const introSaveBtn = document.querySelector(
    'button.submit-button[data-field="introduction"]:not(.cancel-btn)'
  );
  const profileSaveBtn = document.querySelector(
    'button.submit-button[data-field="profile"]:not(.cancel-btn)'
  );
  const passwordSaveBtn = document.querySelector(
    'button.submit-button[data-field="password"]:not(.cancel-btn)'
  );

  if (introSaveBtn) {
    introSaveBtn.addEventListener("click", function (e) {
      e.preventDefault();
      saveIntroduction();
    });
  }

  if (profileSaveBtn) {
    profileSaveBtn.addEventListener("click", function (e) {
      e.preventDefault();
      saveProfileInfo();
    });
  }

  if (passwordSaveBtn) {
    passwordSaveBtn.addEventListener("click", function (e) {
      e.preventDefault();
      savePassword();
    });
  }

  // Cancel button handlers
  const cancelBtns = document.querySelectorAll(".cancel-btn");
  cancelBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const field = this.getAttribute("data-field");

      const errorMsg = document.querySelector(
        `[data-field="${field}"]#errorMessage`
      );
      if (errorMsg) {
        errorMsg.style.display = "none";
      }

      if (field === "name" || field === "sex" || field === "email") {
        revertField(field);
      } else if (field === "introduction") {
        document.getElementById("editIntroduction").value =
          userInfo.introduction || "";
      } else if (field === "profile") {
        revertField("name");
        revertField("email");
        revertField("phone");

        const oldSex = document.getElementById("sexDisplay").textContent.trim();
        const sexSelect = document.getElementById("editSex");

        // Destroy and recreate the Choices instance
        if (sexSelect && typeof Choices !== "undefined") {
          if (sexChoices) {
            sexChoices.destroy();
          }

          sexSelect.value = oldSex;

          sexChoices = new Choices(sexSelect, {
            searchEnabled: false,
            itemSelectText: "",
            shouldSort: false,
            allowHTML: true,
          });

          if (userInfo.sex) {
            sexChoices.setChoiceByValue(userInfo.sex);
          }
        }
      } else if (field === "password") {
        document.getElementById("oldPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";
      }
    });
  });
}

// Save introduction
function saveIntroduction() {
  const introduction = document.getElementById("editIntroduction").value.trim();

  clearErrorMessage("introduction");

  // Validate introduction (max 200 characters)
  if (introduction && introduction.length > 200) {
    showErrorMessage(
      "introduction",
      "Introduction must be less than 200 characters"
    );
    return;
  }

  if (userInfo && userInfo._id) {
    // Get current values for other fields to include in the update
    updateUserIntroduction(userInfo._id, {
      introduction: introduction,
    })
      .then((result) => {
        if (result.success) {
          document.getElementById("introductionDisplay").textContent =
            introduction;

          userInfo.introduction = introduction;

          showSuccessMessage(
            "introduction",
            "Introduction updated successfully"
          );
        } else {
          showErrorMessage(
            "introduction",
            result.message || "Failed to update introduction"
          );
        }
      })
      .catch((error) => {
        console.error("Error updating introduction:", error);
        showErrorMessage(
          "introduction",
          "An error occurred. Please try again later."
        );
      });
  }
}

// Save profile information
function saveProfileInfo() {
  const name = document.getElementById("editName").value.trim();
  const sex = document.getElementById("editSex").value;
  const email = document.getElementById("editEmail").value.trim();
  const phone = document.getElementById("editPhone").value.trim();

  clearErrorMessage("profile");

  if (!name) {
    showErrorMessage("profile", "Name is required");
    return;
  }

  if (email && !isValidEmail(email)) {
    showErrorMessage("profile", "Invalid email format");
    return;
  }

  if (phone && !isValidPhone(phone)) {
    showErrorMessage(
      "profile",
      "Phone number must contain only digits and an optional leading '+', and be 7 to 15 characters long"
    );
    return;
  }

  if (sex && sex.length > 20) {
    showErrorMessage("profile", "Sex must be less than 20 characters");
    return;
  }

  // Save profile information
  if (userInfo && userInfo._id) {
    const updatedData = {
      name: name,
      sex: sex,
      email: email,
      phone: phone,
    };

    updateUserProfile(userInfo._id, updatedData)
      .then((result) => {
        if (result.success) {
          // Update the display elements with the new values
          document.getElementById("nameDisplay").textContent = name;
          document.getElementById("sexDisplay").textContent =
            sex || "Not specified";
          document.getElementById("emailDisplay").textContent =
            email || "No email provided";
          document.getElementById("phoneDisplay").textContent =
            phone || "No phone provided";
          // document.getElementById("introductionDisplay").textContent = updatedData.introduction || "No introduction provided";

          userInfo.name = name;
          userInfo.sex = sex;
          userInfo.email = email;
          userInfo.phone = phone;
          // userInfo.introduction = updatedData.introduction;

          showSuccessMessage("profile", "Profile updated successfully");
        } else {
          showErrorMessage(
            "profile",
            result.message || "Failed to update profile"
          );
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        showErrorMessage(
          "profile",
          "An error occurred. Please try again later."
        );
      });
  }
}

// Save password
function savePassword() {
  const oldPassword = document.getElementById("oldPassword").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  clearErrorMessage("password");

  // Validate passwords
  if (!oldPassword) {
    showErrorMessage("password", "Current password is required");
    return;
  }

  if (!newPassword) {
    showErrorMessage("password", "New password is required");
    return;
  }

  if (newPassword !== confirmPassword) {
    showErrorMessage("password", "Passwords do not match");
    return;
  }

  if (newPassword === oldPassword) {
    showErrorMessage(
      "password",
      "New password must be different from current password"
    );
    return;
  }

  if (userInfo && userInfo._id) {
    updateUserPassword(userInfo._id, oldPassword, newPassword)
      .then((result) => {
        if (result.success) {
          document.getElementById("oldPassword").value = "";
          document.getElementById("newPassword").value = "";
          document.getElementById("confirmPassword").value = "";

          showSuccessMessage("password", "Password updated successfully");

          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        } else {
          showErrorMessage(
            "password",
            result.message || "Failed to update password"
          );
        }
      })
      .catch((error) => {
        console.error("Error updating password:", error);
        showErrorMessage(
          "password",
          "An error occurred. Please try again later."
        );
      });
  }
}

// Helper functions for validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^\+?\d{7,15}$/;
  return phoneRegex.test(phone);
}

function showErrorMessage(field, message) {
  const errorElement = document.querySelector(
    `[data-field="${field}"]#errorMessage`
  );
  if (errorElement) {
    errorElement.classList.remove("success-message");
    errorElement.classList.add("error-message");
    errorElement.innerHTML = `<i class="fas fa-triangle-exclamation"></i> ${message}`;
    errorElement.style.display = "flex";
  }
}

function showSuccessMessage(field, message) {
  const errorElement = document.querySelector(
    `[data-field="${field}"]#errorMessage`
  );
  if (errorElement) {
    errorElement.classList.remove("error-message");
    errorElement.classList.add("success-message");
    errorElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    errorElement.style.display = "flex";
  }
}

function clearErrorMessage(field) {
  const errorElement = document.querySelector(
    `[data-field="${field}"]#errorMessage`
  );
  if (errorElement) {
    errorElement.style.display = "none";
  }
}
