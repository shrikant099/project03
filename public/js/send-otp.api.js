const form = document.getElementById("forgotForm");
const message = document.getElementById("message");
const otpSection = document.getElementById("otpSection");
const verifyBtn = document.getElementById("verifyBtn");
const otpInputs = otpSection.querySelectorAll("input");
const loader = document.getElementById("loader-overlay");

// Utility to show/hide loader
const toggleLoader = (show) => {
    loader.style.display = show ? "flex" : "none";
};

// Show response message
const handleResponseMsg = (message, bgc, display) => {
    let msgBox = document.querySelector("#msgbox");
    msgBox.textContent = message;
    msgBox.style.display = display;
    msgBox.style.backgroundColor = bgc;
    return msgBox;
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;

    try {
        toggleLoader(true); // Show loader
        const res = await fetch("/api/auth/send-mail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await res.json();
        toggleLoader(false); // Hide loader

        if (data.success) {
            message.textContent = data.message;
            otpSection.classList.add("show");
            otpInputs[0].focus();
        } else {
            message.textContent = data.message;
        }
    } catch (err) {
        toggleLoader(false);
        console.error(err);
        message.textContent = "Something went wrong!";
    }
});

otpInputs.forEach((input, index) => {
    input.setAttribute("maxlength", "1");

    input.addEventListener("input", (e) => {
        const value = e.target.value;
        if (value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }

        const allFilled = Array.from(otpInputs).every(inp => inp.value.trim() !== "");
        verifyBtn.style.display = allFilled ? "block" : "none";
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace") {
            if (input.value !== "") {
                input.value = "";
            } else if (index > 0) {
                otpInputs[index - 1].focus();
                otpInputs[index - 1].value = "";
            }
            e.preventDefault();
        }
    });
});

verifyBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const otp = Array.from(otpInputs).map((input) => input.value).join("");

    try {
        toggleLoader(true);
        const verifyOtp = await fetch("/api/auth/verify-otp", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ otp })
        });

        const data = await verifyOtp.json();
        toggleLoader(false);

        if (!data.success) {
            handleResponseMsg(data.message || "Please try again", "#ff4d4d", "block");
            return;
        };
        
        handleResponseMsg("OTP Verify SuccessFull", "#4caf50", "block");
        setTimeout(() => {
            window.location.href = `../reset-password.html?userId=${data.userId}`; // redirect here
        }, 500);

    } catch (error) {
        toggleLoader(false);
        handleResponseMsg("Something Went Wrong please try again !!", "#ff4d4d", "block");
        console.log(`Error Otp verify:- ${error}`);
    }
});
