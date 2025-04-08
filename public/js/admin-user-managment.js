document.addEventListener("DOMContentLoaded", async () => {
    try {
        const users = await fetch("/api/admin/users", {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });

        const parseUser = await users.json();

        const tableBody = document.querySelector("#userTableBody");

        parseUser.allUsers.forEach((user) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${user.username}</td>
              <td>${user.email}</td>
              <td>${user.role}</td>
              <td class="action-buttons">
                <a href="../admin-edit-users.html?userId=${user._id}" class="edit-btn" style="color:black;">
                  <i data-feather="edit"></i>
                </a>
                <button class="delete-btn" data-id="${user._id}" data-role="${user.role}">
                  <i data-feather="trash-2"></i>
                </button>
              </td>
            `;
            tableBody.appendChild(row);
        });

        // Feather icons render
        feather.replace();

    } catch (error) {
        console.log(`Error Fetching Data: ${error}`);
    }
});


// ✅ Delete User with Event Delegation
document.querySelector("#userTableBody").addEventListener("click", async (event) => {
    const deleteButton = event.target.closest(".delete-btn");

    if (deleteButton) {
        const id = deleteButton.dataset.id;
        const role = deleteButton.dataset.role;

        if (!id) {
            alert("User ID Not Found");
            return;
        }

        if (role === "Admin") {
            alert("This user cannot be deleted because they are an Admin!");
            return;
        }

        try {
            const deleteUser = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            });

            const parseDeleteUser = await deleteUser.json();

            if (!deleteUser.ok) {
                alert(parseDeleteUser.message || "Something Went Wrong");
                return;
            }

            alert("User Deleted Successfully");
            deleteButton.closest("tr").remove();
            location.reload();

        } catch (error) {
            console.log(`Error Deleting User: ${error}`);
        }
    }
});
