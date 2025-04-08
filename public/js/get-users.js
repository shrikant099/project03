document.addEventListener("DOMContentLoaded" , async(e) => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');


    const username = document.getElementById("username")
    const email = document.getElementById("email")
    const role = document.getElementById("role")

    if(!userId){
        alert("User Not Found");
        return;
    };

    try {

        const findUserWithId = await fetch(`/api/admin/user/${userId}` , {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "applicaiton/json"
            }
        });


        const data = await findUserWithId.json();
        
        if(!data.success){
            alert(`${data.message}` || "Something Went Wrong");
            return;
        };

        username.value = data.user.username;
        email.value = data.user.email;
        role.value = data.user.role

        console.log(role.value);
        
    } catch (error) {
        alert("Some thing went wrong please try agian");
        console.log(`Internal Server error please try again !!`);
        return
    };
});