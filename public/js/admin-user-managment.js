function toggleLoadingSpinner(show = true) {
    const loader = document.getElementById("loader-overlay");
    loader.style.display = show ? "flex" : "none";
};
document.addEventListener("DOMContentLoaded", async () => {
    // Loading spinner handler function

    let currentPage = 1;
    const limit = 10;


    const fetchAndRenderUsers = async (page = 1) => {
        try {

            toggleLoadingSpinner(true);

            const res = await fetch(`/api/admin/paginateUsers?page=${page}`, {
                method: "GET",
                headers: {
                    Accept: "application/json"
                },
                credentials: "include"
            });

            if (!res.ok) throw new Error(`HTTP error! ${res.status}`);

            const data = await res.json();

            toggleLoadingSpinner(false);

            const tableBody = document.querySelector("#userTableBody");
            tableBody.innerHTML = "";

            data.users.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.number}</td>
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

            feather.replace();
            renderPagination(data.totalPages, data.currentPage);
        } catch (err) {
            console.error("Error loading users:", err);
        } finally {
            toggleLoadingSpinner(false);
        }
    };

    const renderPagination = (totalPages, currentPage) => {
        const pagination = document.querySelector("#pagination");
        pagination.innerHTML = "";

        // Previous arrow
        const prevBtn = document.createElement("button");
        prevBtn.innerHTML = "&#8592;";
        prevBtn.disabled = currentPage === 1;
        prevBtn.classList.add("arrow-btn");
        prevBtn.addEventListener("click", () => fetchAndRenderUsers(currentPage - 1));
        pagination.appendChild(prevBtn);

        // Page range calculation: show 3 buttons
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, startPage + 2);

        if (endPage - startPage < 2) {
            startPage = Math.max(1, endPage - 2);
        }

        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            if (i === currentPage) btn.classList.add("active");
            btn.addEventListener("click", () => fetchAndRenderUsers(i));
            pagination.appendChild(btn);
        }

        // Next arrow
        const nextBtn = document.createElement("button");
        nextBtn.innerHTML = "&#8594;";
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.classList.add("arrow-btn");
        nextBtn.addEventListener("click", () => fetchAndRenderUsers(currentPage + 1));
        pagination.appendChild(nextBtn);
    };

    fetchAndRenderUsers(currentPage);



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
                toggleLoadingSpinner(true);

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
            } finally {
                toggleLoadingSpinner(false);
            }
        }
    });
})