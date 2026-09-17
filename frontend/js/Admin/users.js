async function renderUsersTable() {
  const tbody = document.getElementById("usersTableBody");
  tbody.innerHTML = "";
  if (!canManageUsers()) {
    tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center py-10 text-slate-400">
                            <i class="fa-solid fa-user-lock text-3xl mb-2 text-slate-300 block"></i>
                            Chỉ tài khoản <b>Quản lý (Admin)</b> mới có quyền xem & chỉnh sửa Phân quyền tài khoản.
                        </td>
                    </tr>
                `;
    return;
  }

  try {
    const res = await authFetch(`${apiUrl}/user/all-users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      console.error("Failed to fetch users:", res);
      throw new Error("Không thể lấy dữ liệu người dùng từ server");
    }
    const { users } = await res.json();
    systemUsers = users;

    document.getElementById("statTotalUsers").innerText = systemUsers.length;
    document.getElementById("userCountBadge").innerText =
      `${systemUsers.length} tài khoản`;

    const filtered = systemUsers;
    //.filter((usr) => {
    //   return (
    //     usr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     usr.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     usr.role.toLowerCase().includes(searchQuery.toLowerCase())
    //   );
    // });

    filtered.forEach((usr) => {
      let roleBadge = "";
      let roleDesc = "";

      if (usr.role === "admin") {
        roleBadge = `<span class="px-2.5 py-1 bg-gold-100 text-gold-900 text-xs font-bold rounded-md border border-gold-300">Quản lý (Admin)</span>`;
        roleDesc = "Toàn quyền điều hành, phân quyền & xoá dữ liệu";
      } else if (usr.role === "deputy") {
        roleBadge = `<span class="px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-md border border-blue-200">Phó quản lý</span>`;
        roleDesc = "Duyệt/Sửa bài viết, quản lý đăng ký học viên";
      } else {
        roleBadge = `<span class="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-md border border-slate-200">Viết bài (Author)</span>`;
        roleDesc = "Chỉ được thêm & sửa bài viết do chính mình tạo";
      }

      const tr = document.createElement("tr");
      tr.className =
        "hover:bg-slate-50/80 transition-colors border-b border-slate-100";
      tr.innerHTML = `
                    <td class="py-4 px-6 font-semibold text-slate-900">
                        ${usr.fullName}
                    </td>
                    <td class="py-4 px-6 text-slate-600 font-mono text-xs">${usr.email}</td>
                    <td class="py-4 px-6">${roleBadge}</td>
                    <td class="py-4 px-6 text-xs text-slate-500">${roleDesc}</td>
                    <td class="py-4 px-6">
                        <span class="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${usr.status}
                        </span>
                    </td>
                    <td class="py-4 px-6 text-right space-x-3 font-medium">
                        <button onclick="openEditUserModal('${usr._id}')" class="text-slate-600 hover:text-slate-900 transition-colors">Sửa</button>
                            <button onclick="deleteUser('${usr._id}')" class="text-red-600 hover:text-red-800 transition-colors">Xoá</button>
                    </td>
                `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error rendering users:", error);
    showToast("Đã xảy ra lỗi khi lấy dữ liệu người dùng!", "error");
    return;
  }
}

function closeUserModal() {
  document.getElementById("userModal").classList.add("hidden");
}

function resetPassword() {
  const isAuth = getCurrentUser();
  if (!isAuth) {
    showToast("Bạn cần đăng nhập để đặt lại mật khẩu!", "info");
    return;
  }
  try {
    const res = authFetch(`${apiUrl}/user/reset-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: isAuth._id,
      }),
    });
    if (!res.ok) {
      throw new Error("Không thể đặt lại mật khẩu");
    }
    showToast("Đã gửi yêu cầu đặt lại mật khẩu!", "success");
  } catch (error) {
    console.error("Error resetting password:", error);
    showToast("Đã xảy ra lỗi khi đặt lại mật khẩu!", "error");
  }
}

async function openEditUserModal(id) {
  const admin = getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    showToast("Chỉ Quản lý (Admin) mới có quyền chỉnh sửa tài khoản!", "info");
    return;
  }
  document.getElementById("passwordFieldContainer").classList.add("hidden");
  document.getElementById("resetPasswordBtn").classList.remove("hidden");
  document.getElementById("saveUserBtn").disabled = true;
  try {
    const res = authFetch(`${apiUrl}/user/info/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Không thể lấy dữ liệu người dùng từ server");
    }
    const usr = await res.json();

    document.getElementById("userName").value = usr.name;
    document.getElementById("userEmail").value = usr.email;
    document.getElementById("userRole").value = usr.role;
    document.getElementById("userStatus").value = usr.status;
    document.getElementById("userName").disabled = true;
    document.getElementById("userEmail").disabled = true;
    document.getElementById("userStatus").disabled = true;

    document.getElementById("userModalTitle").innerText = "Chỉnh sửa tài khoản";
    document.getElementById("userModal").classList.remove("hidden");
  } catch (error) {
    console.error("Error opening edit user modal:", error);
    showToast("Đã xảy ra lỗi khi mở modal chỉnh sửa tài khoản!", "error");
  } finally {
    document.getElementById("saveUserBtn").disabled = false;
  }
}

async function saveUser(e) {
  e.preventDefault();
  const admin = getCurrentUser();
  if (!admin || admin.role !== "admin") {
    showToast("Chỉ Quản lý (Admin) mới có quyền chỉnh sửa tài khoản!", "info");
    return;
  }
  const id = document.getElementById("userId").value;
  const email = document.getElementById("userEmail").value.trim();
  const name = document.getElementById("userName").value;
  const role = document.getElementById("userRole").value;
  const status = document.getElementById("userStatus").value;

  if (id) {
    try {
      const res = await authFetch(`${apiUrl}/user/update-user-info/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: name,
          role,
          status,
        }),
      });
      if (!res.ok) {
        throw new Error("Không thể cập nhật thông tin người dùng");
      }

      showToast("Cập nhật phân quyền tài khoản thành công!", "success");
    } catch (error) {
      console.error("Error updating user info:", error);
      showToast("Đã xảy ra lỗi khi cập nhật thông tin người dùng!", "error");
    }
  } else {
    try {
      const res = await authFetch(`${apiUrl}/user/registration-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: name,
          email,
          password: "TangDoan123", // Default password for new users
          role,
          status,
        }),
      });
      if (!res.ok) {
        throw new Error("Không thể cập nhật thông tin người dùng");
      }

      showToast("Cập nhật phân quyền tài khoản thành công!", "success");
    } catch (error) {
      console.error("Error updating user info:", error);
      showToast("Đã xảy ra lỗi khi cập nhật thông tin người dùng!", "error");
    }
  }

  closeUserModal();
  renderAll();
}

function deleteUser(id) {
  if (!canManageUsers()) return;

  showConfirmModal(
    `Bạn có chắc chắn muốn xoá tài khoản thành viên này ?`,
    async () => {
      try {
        const res = await authFetch(`${apiUrl}/user/delete-single-user/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Không thể xoá người dùng này");
        }

        showToast("Đã xoá tài khoản thành viên!", "success");
        renderAll();
      } catch (error) {
        console.error("Error deleting user:", error);
        showToast("Đã xảy ra lỗi khi xoá người dùng!", "error");
        return;
      }
    },
  );
}

// PUBLIC LANDING FORM REGISTER
// Done
