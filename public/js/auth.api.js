
const signUp = document.getElementById("signUpForm");

const msgFunction = (bgc, text) => {
    const msg = document.querySelector("#msgBox");
    msg.style.backgroundColor = bgc;
    msg.textContent = text;
    return msg;
};

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}



signUp.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputName = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;


    if (!inputName || !email || !password) {
        msgFunction("red", "Fields are required!");
        return;
    };

    if (!isValidEmail(email)) {
        msgFunction("red", "Incorrect email format !! Please Enter a valid format");
        return;
    };

    const formData = {
        username: inputName,
        email: email,
        password: password
    };
    try {
        const registerUser = await fetch('/api/auth/register', {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await registerUser.json();

        if (!registerUser.ok) {
            msgFunction("red", data.message || "Something Went Wrong. Please try again.");
            return;
        }
        msgFunction("green", "Register Succesfull");
        localStorage.setItem("UserName", data.RegisterUser.username);
        window.location.href = "../index.html";

    } catch (error) {
        console.log(`Error Register ${error}`);
        msgFunction("red", "Something went wrong !");

        return;
    }
});


document.querySelector("#signInForm").addEventListener("submit", async(e) => {
    e.preventDefault();
    const email = document.querySelector("#loginEmail").value.trim();
    const password = document.querySelector("#loginPass").value;

    if (!isValidEmail(email)) {
        msgFunction("red", "Please enter a Valid format");
        return;
    };

    if(!email || !password){
        msgFunction("red" , "Fileds are required !!");
        return;
    };

    try {

        const login = await fetch(`/api/auth/login` , {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: true,
            body: JSON.stringify({email , password})
        });

        const loginData = await login.json();

        if(!login.ok){
            msgFunction("red" , loginData.message || "Something Went Wrong");
            return;
        };
      
        
        if(loginData.user.role === "Admin"){    
            localStorage.setItem("Admin", loginData.user.role);
        };
        
        if(loginData.user.role === "User"){    
            localStorage.setItem("UserName", loginData.user.username);
        };



        msgFunction("green", "Login Succesfull");
        window.location.href = "../index.html";

    } catch (error) {
        console.log(`Error login please try again ${error}`);
        return;   
    }
})