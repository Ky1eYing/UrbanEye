document.addEventListener("DOMContentLoaded", () => {
    const profileView = document.getElementById("profileView");
    const editProfileContainer = document.getElementById("editProfileContainer");
    const editProfileBtn = document.getElementById("editProfileBtn");

    // 初始化性别选择框
    const currentSex = document.getElementById("sexDisplay").textContent.trim();
    const sexSelect = document.getElementById("editSex");
    if (sexSelect) {
        for (let i = 0; i < sexSelect.options.length; i++) {
            if (sexSelect.options[i].value === currentSex) {
                sexSelect.options[i].selected = true;
                break;
            }
        }
    }

    // 切换到编辑资料视图
    editProfileBtn.addEventListener("click", () => {
        profileView.style.display = "none";
        editProfileContainer.style.display = "block";
    });

    // 监听所有 cancel/save 按钮
    const cancelBtns = document.querySelectorAll(".cancel-btn");
    const saveBtns = document.querySelectorAll(".save-btn");

    cancelBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const field = e.target.getAttribute("data-field");
            if (field === "name" || field === "sex" || field === "email") {
                // 对于这类字段，点 cancel 则恢复原值
                revertField(field);
            } else if (field === "password") {
                // 清空密码输入
                document.getElementById("oldPassword").value = "";
                document.getElementById("newPassword").value = "";
                document.getElementById("confirmPassword").value = "";
            } else {
                // 其他处理
            }
        });
    });

    saveBtns.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            const field = e.target.getAttribute("data-field");
            if (field === "name") {
                // 发送AJAX请求更新name
                const newName = document.getElementById("editName").value.trim();
                await updateProfileField("username", newName);
            } else if (field === "sex") {
                const newSex = document.getElementById("editSex").value;
                await updateProfileField("sex", newSex);
            } else if (field === "email") {
                const newEmail = document.getElementById("editEmail").value.trim();
                await updateProfileField("email", newEmail);
            } else if (field === "password") {
                const oldPwd = document.getElementById("oldPassword").value.trim();
                const newPwd = document.getElementById("newPassword").value.trim();
                const confirmPwd = document.getElementById("confirmPassword").value.trim();
                await updatePassword(oldPwd, newPwd, confirmPwd);
            }
        });
    });

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
});

/**
 * 用于回退字段更改
 */
function revertField(field) {
    // 例如从DOM中获取旧值
    if (field === "name") {
        const oldName = document.getElementById("usernameDisplay").textContent;
        document.getElementById("editName").value = oldName;
    } else if (field === "sex") {
        const oldSex = document.getElementById("sexDisplay").textContent;
        document.getElementById("editSex").value = oldSex;
    } else if (field === "email") {
        const oldEmail = document.getElementById("emailDisplay").textContent;
        document.getElementById("editEmail").value = oldEmail;
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
            body: JSON.stringify({ [fieldKey]: newValue })
        });
        if (!resp.ok) throw new Error("Update failed");

        const updatedUser = await resp.json();
        // 更新界面显示
        if (fieldKey === "username") {
            document.getElementById("usernameDisplay").textContent = updatedUser.username;
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
            body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd })
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