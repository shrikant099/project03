const editForm = document.querySelector("#editForm");
editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');


    const username = document.querySelector("#username");
    const email = document.querySelector("#email");
    const role = document.querySelector("#role");

    const data = {
        username: username.value,
        email: email.value,
        role: role.value
    };

    
    try {

        const updateUser = await fetch(`/api/admin/user/${userId}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const updataData = await updateUser.json();

        if (!updataData.success) {
            alert(updataData.message ||   "Something Went wrong edit user please try agin!!");
            return;
        };

        alert("User Updated Succesfull");
        window.location.href = "../admin-users.html"; // ✅ Redirect
        
    } catch (error) {
        console.log(`Internal server error edit user:- ${error}`);
        alert("Something went wron for edit user please try again!!");
        return;
    };
});