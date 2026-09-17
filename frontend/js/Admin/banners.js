async function getBannersData() {
  try {
    const res = await authFetch(`${apiUrl}/banner/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Không thể tải danh sách banner");
    }
    const data = await res.json();
    bannersList = data.banners || [];

    const statEl = document.getElementById("statTotalBanners");
    if (statEl) statEl.innerText = bannersList.length;

    const badgeEl = document.getElementById("bannerCountBadge");
    if (badgeEl) badgeEl.innerText = `${bannersList.length} banner`;

    renderBannersTable();
  } catch (error) {
    console.error("Error fetching banners:", error);
  }
}

function renderBannersTable() {
  const tbody = document.getElementById("bannersTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (bannersList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-10 text-center text-slate-400 text-sm">
          <i class="fa-regular fa-image text-3xl mb-2 block text-slate-300"></i>
          Chưa có banner slideshow nào. Nhấn "Thêm banner mới" để tạo.
        </td>
      </tr>
    `;
    return;
  }

  bannersList.forEach((b) => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-50/80 transition-colors border-b border-slate-100";

    const statusBadge = b.isActive
      ? `<button onclick="toggleBannerActive('${b._id}')" title="Nhấp để ẩn khỏi trang chủ" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full transition cursor-pointer border border-emerald-200/60">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hiển thị
        </button>`
      : `<button onclick="toggleBannerActive('${b._id}')" title="Nhấp để kích hoạt hiển thị" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-full transition cursor-pointer border border-slate-200">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Đang ẩn
        </button>`;

    const deletable = canDeleteItems();
    const cleanTitle = (b.title || "").replace(/\\n/g, " ");
    const cleanSubtitle = (b.subtitle || "").replace(/\\n/g, " ");

    tr.innerHTML = `
      <td class="py-4 px-6 text-center">
        <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-700">
          ${b.order !== undefined ? b.order : 0}
        </span>
      </td>
      <td class="py-4 px-6">
        <div class="w-20 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 relative group cursor-pointer shadow-sm" onclick="openBannerModal('${b._id}')">
          <img src="${b.imageUrl}" alt="${cleanTitle}" class="w-full h-full object-cover group-hover:scale-105 transition duration-200" onerror="this.src='https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80'" />
        </div>
      </td>
      <td class="py-4 px-6 max-w-xs">
        <div class="font-bold text-slate-900 text-sm leading-snug cursor-pointer hover:text-amber-600 transition truncate" onclick="openBannerModal('${b._id}')" title="${cleanTitle}">
          ${cleanTitle}
        </div>
        ${cleanSubtitle ? `<div class="text-xs text-slate-500 truncate mt-0.5" title="${cleanSubtitle}">${cleanSubtitle}</div>` : ''}
      </td>
      <td class="py-4 px-6 text-xs text-slate-600">
        <div class="font-medium text-slate-800">${b.buttonText || "N/A"}</div>
        <div class="text-[11px] text-slate-400 truncate max-w-[160px] font-mono mt-0.5" title="${b.buttonLink}">${b.buttonLink || "#"}</div>
      </td>
      <td class="py-4 px-6">
        <div class="font-script text-base leading-tight ${b.scriptColor || 'text-slate-800'} whitespace-pre-line select-none">
          ${b.scriptText ? b.scriptText.replace(/\\n/g, ' ') : 'N/A'}
        </div>
      </td>
      <td class="py-4 px-6">
        ${statusBadge}
      </td>
      <td class="py-4 px-6 text-right space-x-2.5 font-medium whitespace-nowrap">
        <button onclick="openBannerModal('${b._id}')" class="text-slate-700 hover:text-amber-600 font-semibold text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 transition">
          <i class="fa-solid fa-pen-to-square mr-1"></i>Sửa
        </button>
        ${
          deletable
            ? `<button onclick="deleteBanner('${b._id}')" class="text-red-600 hover:text-red-800 font-semibold text-xs px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 transition">
                <i class="fa-solid fa-trash-can mr-1"></i>Xoá
              </button>`
            : `<span class="text-slate-300 text-xs px-2 py-1 cursor-not-allowed">Xoá</span>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openBannerModal(id = null) {
  const modal = document.getElementById("bannerModal");
  const form = document.getElementById("bannerForm");
  const modalTitle = document.getElementById("bannerModalTitle");
  if (!modal) {
    console.error("bannerModal element not found in DOM");
    return;
  }

  if (id) {
    const banner = bannersList.find(
      (b) => b._id === id || b.id === id || String(b._id) === String(id)
    );
    if (!banner) {
      console.warn("Banner not found in bannersList for ID:", id, bannersList);
      showToast("Không tìm thấy thông tin banner cần sửa!", "error");
      return;
    }

    modalTitle.innerText = "Chỉnh sửa Banner Slideshow";
    document.getElementById("bannerFormId").value = banner._id;
    document.getElementById("bannerFormTitle").value = banner.title || "";
    document.getElementById("bannerFormSubtitle").value = banner.subtitle || "";
    document.getElementById("bannerFormImageUrl").value = banner.imageUrl || "";
    document.getElementById("bannerFormButtonText").value = banner.buttonText || "";
    document.getElementById("bannerFormButtonLink").value = banner.buttonLink || "";
    document.getElementById("bannerFormScriptText").value = banner.scriptText || "";
    document.getElementById("bannerFormScriptColor").value = banner.scriptColor || "text-slate-200/90";
    document.getElementById("bannerFormOrder").value = banner.order !== undefined ? banner.order : 1;
    document.getElementById("bannerFormIsActive").checked = banner.isActive !== false;

    previewBannerImage(banner.imageUrl);
  } else {
    modalTitle.innerText = "Thêm Banner Slideshow Mới";
    if (form) form.reset();
    document.getElementById("bannerFormId").value = "";
    document.getElementById("bannerFormOrder").value = bannersList.length + 1;
    document.getElementById("bannerFormIsActive").checked = true;
    previewBannerImage("");
  }

  modal.classList.remove("hidden");
}

function closeBannerModal() {
  const modal = document.getElementById("bannerModal");
  if (modal) modal.classList.add("hidden");
  const form = document.getElementById("bannerForm");
  if (form) form.reset();
  previewBannerImage("");
}

function previewBannerImage(url) {
  const container = document.getElementById("bannerImagePreviewContainer");
  const img = document.getElementById("bannerImagePreview");
  if (!container || !img) return;

  if (url && url.trim() !== "") {
    img.src = url.trim();
    img.onload = () => container.classList.remove("hidden");
    img.onerror = () => {
      container.classList.add("hidden");
      img.src = "";
    };
  } else {
    container.classList.add("hidden");
    img.src = "";
  }
}

async function handleBannerFileUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  try {
    const base64 = await fileToBase64(file);
    document.getElementById("bannerFormImageUrl").value = base64;
    previewBannerImage(base64);
  } catch (err) {
    console.error("Error reading file:", err);
    showToast("Không thể tải ảnh từ máy tính!", "error");
  }
}

async function handleBannerFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("bannerFormId").value;
  const title = document.getElementById("bannerFormTitle").value.trim();
  const subtitle = document.getElementById("bannerFormSubtitle").value.trim();
  const imageUrl = document.getElementById("bannerFormImageUrl").value.trim();
  const buttonText = document.getElementById("bannerFormButtonText").value.trim();
  const buttonLink = document.getElementById("bannerFormButtonLink").value.trim();
  const scriptText = document.getElementById("bannerFormScriptText").value.trim();
  const scriptColor = document.getElementById("bannerFormScriptColor").value;
  const order = Number(document.getElementById("bannerFormOrder").value) || 0;
  const isActive = document.getElementById("bannerFormIsActive").checked;

  if (!title || !imageUrl) {
    showToast("Vui lòng nhập đầy đủ tiêu đề và hình ảnh!", "error");
    return;
  }

  const payload = {
    title,
    subtitle,
    imageUrl,
    buttonText,
    buttonLink,
    scriptText,
    scriptColor,
    order,
    isActive,
  };

  const submitBtn = document.getElementById("bannerSubmitBtn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...`;
  }

  try {
    let res;
    if (id) {
      res = await authFetch(`${apiUrl}/banner/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await authFetch(`${apiUrl}/banner/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Lỗi khi lưu banner");
    }

    showToast(data.message || "Lưu banner thành công!", "success");
    closeBannerModal();
    await getBannersData();
  } catch (err) {
    console.error("Error saving banner:", err);
    showToast(err.message || "Đã xảy ra lỗi khi lưu banner!", "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Lưu banner`;
    }
  }
}

async function toggleBannerActive(id) {
  try {
    const res = await authFetch(`${apiUrl}/banner/toggle/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Lỗi khi đổi trạng thái banner");
    }
    showToast(data.message || "Đã cập nhật trạng thái!", "success");
    await getBannersData();
  } catch (err) {
    console.error("Error toggling banner:", err);
    showToast(err.message || "Lỗi khi đổi trạng thái!", "error");
  }
}

function deleteBanner(id) {
  if (!canDeleteItems()) {
    showToast("Chỉ Quản lý (Admin) mới có quyền xoá banner!", "error");
    return;
  }

  showConfirmModal(
    "Bạn có chắc chắn muốn xoá banner này khỏi slideshow trang chủ?",
    async () => {
      try {
        const res = await authFetch(`${apiUrl}/banner/delete/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Lỗi khi xoá banner");
        }
        showToast("Đã xoá banner thành công!", "success");
        await getBannersData();
      } catch (err) {
        console.error("Error deleting banner:", err);
        showToast(err.message || "Lỗi khi xoá banner!", "error");
      }
    }
  );
}

// Expose banner functions globally to avoid any scoping issue
window.openBannerModal = openBannerModal;
window.closeBannerModal = closeBannerModal;
window.handleBannerFormSubmit = handleBannerFormSubmit;
window.previewBannerImage = previewBannerImage;
window.handleBannerFileUpload = handleBannerFileUpload;
window.toggleBannerActive = toggleBannerActive;
window.deleteBanner = deleteBanner;
window.getBannersData = getBannersData;
