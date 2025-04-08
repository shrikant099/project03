// Toggle navbar 
function toggleMenu() {
    var menu = document.getElementById("mobileMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Collect Variables 
const username = localStorage.getItem("UserName");
const loginBtn = document.getElementById("login");
const signUpBtn = document.getElementById("signUpBtn");
const usernameBox = document.getElementById("usernameBox");
const logout = document.getElementById("logout");

//check if username is available

if (!username) {
    loginBtn.style.display = "block";
    signUpBtn.style.display = "block";
    logout.style.display = "none";
} else {
    loginBtn.style.display = "none";
    signUpBtn.style.display = "none";
    usernameBox.textContent = username;
    logout.style.display = "block";
};


// Logout Btn;
document.querySelector("#logout").addEventListener("click", (e) => {
    e.preventDefault();

    if (localStorage.getItem("UserName")) {
        localStorage.removeItem("UserName");
        window.location.href = "../login-register.html"

    } else if (localStorage.getItem("Admin")) {
        localStorage.removeItem("Admin");
        window.location.href = "../login-register.html";
    }
    else {
        loginBtn.style.display = "block";
        signUpBtn.style.display = "block";
    }
});


// Msg Box
// const msgFunction = (bgc, text) => {
//     const msg = document.querySelector("#msgBox");
//     msg.style.backgroundColor = bgc;
//     msg.textContent = text;
//     return msg;
// };


// admin role 
const admin = localStorage.getItem("Admin");
if (admin) {
    const usernameBox = document.getElementById("usernameBox");
    usernameBox.textContent = admin;
    logout.style.display = "block";
    loginBtn.style.display = "none";
    signUpBtn.style.display = "none";

    const about = document.querySelector("#about");
    about.setAttribute("href", "../admin-users.html");
    about.textContent = "Users";
};

