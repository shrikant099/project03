const msgBox = document.querySelector("#message");

function handleMsgBox(msg, color) {
    msgBox.style.color = color;
    msgBox.textContent = msg
}
// Loading spinner
function toggleLoadingSpinner(show = true) {
    const loader = document.getElementById("loader-overlay");
    loader.style.display = show ? "flex" : "none";
};

const password = document.querySelector("#newPassword");
const confirmPassword = document.querySelector("#confirmPassword");
const resetForm = document.querySelector("#resetForm")

resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    if (!userId) {
        handleMsgBox("Unauthorize User", "#ff4d4d");
        return;
    };

    if (!newPassword.value || !confirmPassword.value) {
        handleMsgBox("Please enter both fields!", "#ff4d4d");
        return;
    }

    if (newPassword.value !== confirmPassword.value) {
        handleMsgBox("Password and Confirm Password do not match", "#ff4d4d");
        return;
    }


    // Show loader while request is in progress
    toggleLoadingSpinner(true);

    try {

        const res = await fetch(`/api/auth/reset-password/${userId}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password.value,
                confirmPassword: confirmPassword.value
            })
        });

        const data = await res.json();

        // Hide loader after response
        toggleLoadingSpinner(false);


        if (!data.success) {
            handleMsgBox(data.message || "Something Went Wrong Please try agian", "#ff4d4d");
            return;
        };

        handleMsgBox(data.message || "Reset password succesfull", "#4caf50")
        setTimeout(() => {
            window.location.href = "../index.html"
        },500)

    } catch (error) {
        toggleLoadingSpinner(false); // Hide loader on error too
        console.log(`Reset password error:- ${error}`);
        handleMsgBox("Please try again !", "#ff4d4d");
        return;
    };
});