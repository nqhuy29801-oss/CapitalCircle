async function renderRegistrationsTable() {
  const tbody = document.getElementById("registrationsTableBody");
  tbody.innerHTML = "";

  // const user = getCurrentUser();
  const allowed = canManageRegistrations();

  if (!allowed) {
    tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-10 text-slate-400">
                            <i class="fa-solid fa-lock text-3xl mb-2 text-slate-300 block"></i>
                            Tài khoản vai trò <b>Viết bài</b> không có quyền xem thông tin đăng ký học viên.
                        </td>
                    </tr>
                `;
    document.getElementById("regCountBadge").innerText = `Giới hạn quyền`;
    return;
  }

  try {
    const res = await authFetch(`${apiUrl}/user/all-guests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Không thể lấy dữ liệu đăng ký học từ server");

    const { guests } = await res.json();

    const filtered = guests;

    document.getElementById("statTotalRegistrations").innerText =
      filtered.length;
    document.getElementById("regCountBadge").innerText =
      `${filtered.length} học viên`;

    if (filtered.length === 0) {
      tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-8 text-slate-400">
                            <i class="fa-solid fa-user-slash text-2xl mb-2 block"></i>
                            Không tìm thấy danh sách đăng ký học nào.
                        </td>
                    </tr>
                `;
      return;
    }

    filtered.forEach((reg) => {
      let statusBadge = "";
      if (reg.status === "experience") {
        statusBadge = `<span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md">Trải nghiệm</span>`;
      } else if (reg.status === "joined") {
        statusBadge = `<span class="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">Đã vào nhóm</span>`;
      } //else {
      //   statusBadge = `<span class="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-md">Mới đăng ký</span>`;
      // }

      const tr = document.createElement("tr");
      tr.className =
        "hover:bg-slate-50/80 transition-colors border-b border-slate-100";
      tr.innerHTML = `
                    <td class="py-4 px-6 font-semibold text-slate-900">${reg.fullName}</td>
                    <td class="py-4 px-6 text-slate-600 font-mono text-xs">${reg.email}</td>
                    <td class="py-4 px-6 text-slate-700 font-medium">${reg.phoneNumber}</td>
                    <td class="py-4 px-6">
                        <span class="inline-block bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded">
                            ${reg.activationCode}
                        </span>
                    </td>
                    <td class="py-4 px-6 text-slate-500 font-medium">${formatVietnameseDate(reg.createdAt, "datetime")}</td>
                    <td class="py-4 px-6">${statusBadge}</td>
                    <td class="py-4 px-6 text-right space-x-3 font-medium">
                        <button onclick="openEditRegistrationModal('${reg._id}')" class="text-slate-600 hover:text-slate-900 transition-colors">Sửa</button>
                        ${
                          canDeleteItems()
                            ? `<button onclick="deleteRegistration('${reg._id}')" class="text-red-600 hover:text-red-800 transition-colors">Xoá</button>`
                            : `<span class="text-slate-300 cursor-not-allowed">Xoá</span>`
                        }
                    </td>
                `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error rendering registration:", error);
    showToast("Đã xảy ra lỗi khi lấy dữ liệu đăng ký học!", "error");
    return;
  }
}

function closeRegistrationModal() {
  document.getElementById("registrationModal").classList.add("hidden");
}

// Done
async function openEditRegistrationModal(id) {
  // const reg = registrations.find((r) => r.id === id);
  // if (!reg) return;
  document.getElementById("activationCodeContainer").classList.remove("hidden");

  try {
    const res = await authFetch(`${apiUrl}/user/info/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Không thể lấy dữ liệu đăng ký học từ server");
    }
    const { user: reg } = await res.json();
    console.log("Fetched registration details:", reg);
    document.getElementById("regId").value = reg._id;
    document.getElementById("regName").value = reg.fullName;
    document.getElementById("regEmail").value = reg.email;
    document.getElementById("regPhone").value = reg.phoneNumber;
    document.getElementById("regCourse").value = reg.activationCode;
    document.getElementById("regStatus").value = reg.status;

    document.getElementById("regModalTitle").innerText =
      "Sửa thông tin đăng ký";
    document.getElementById("registrationModal").classList.remove("hidden");
  } catch (error) {
    console.error("Error opening edit registration modal:", error);
    showToast("Đã xảy ra lỗi khi mở thông tin đăng ký học!", "error");
    return;
  }
}

// Done
async function saveRegistration(e) {
  e.preventDefault();
  const id = document.getElementById("regId").value;
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const course = document.getElementById("regCourse").value;
  const status = document.getElementById("regStatus").value;

  // const today = new Date();
  // const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  if (id) {
    try {
      const res = await authFetch(`${apiUrl}/user/update-user-info/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: name,
          email,
          phoneNumber: phone,
          activationCode: course,
          status,
        }),
      });
      if (!res.ok) {
        throw new Error("Không thể cập nhật thông tin đăng ký học");
      }

      showToast("Đã cập nhật thông tin học viên!", "success");
    } catch (error) {
      console.error("Error updating registration:", error);
      showToast("Đã xảy ra lỗi khi cập nhật thông tin đăng ký học!", "error");
      return;
    }
  } else {
    try {
      const res = await authFetch(`${apiUrl}/user/registration-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: name,
          email,
          phoneNumber: phone,
        }),
      });
      if (!res.ok) {
        throw new Error("Không thể thêm thông tin đăng ký học");
      }

      showToast("Đã thêm thông tin đăng ký học!", "success");
    } catch (error) {
      console.error("Error updating registration:", error);
      showToast("Đã xảy ra lỗi khi cập nhật thông tin đăng ký học!", "error");
      return;
    }
  }

  closeRegistrationModal();
  renderAll();
}

// Done
function deleteRegistration(id) {
  if (!canDeleteItems()) {
    showToast("Chỉ Quản lý (Admin) mới có quyền xoá đăng ký học viên!", "info");
    return;
  }

  showConfirmModal(`Bạn có muốn xoá người đăng ký học này ?`, async () => {
    try {
      const res = await authFetch(`${apiUrl}/user/delete-single-user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Không thể xoá đăng ký học này");
      }

      showToast("Đã xoá hồ sơ đăng ký!", "success");
      renderAll();
    } catch (error) {
      console.error("Error deleting registration:", error);
      showToast("Đã xảy ra lỗi khi xoá đăng ký học!", "error");
      return;
    }
  });
}

// USER / PERMISSIONS MODAL LOGIC
