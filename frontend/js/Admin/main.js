// System Accounts & Roles Definition
// ROLES: 'ADMIN' (Quản lý), 'DEPUTY' (Phó quản lý), 'AUTHOR' (Viết bài)
let systemUsers = [
  // {
  //   id: "usr-1",
  //   name: "Chuyên gia BlueInvest",
  //   email: "admin@blueinvest.vn",
  //   role: "ADMIN",
  //   status: "Hoạt động",
  //   registeredDate: "01/01/2026",
  // },
  // {
  //   id: "usr-2",
  //   name: "Minh Tuấn (Phó quản lý)",
  //   email: "minhtuan@blueinvest.vn",
  //   role: "DEPUTY",
  //   status: "Hoạt động",
  //   registeredDate: "15/02/2026",
  // },
  // {
  //   id: "usr-3",
  //   name: "Hoàng Nam (Cộng tác viên viết bài)",
  //   email: "hoangnam@blueinvest.vn",
  //   role: "AUTHOR",
  //   status: "Hoạt động",
  //   registeredDate: "10/03/2026",
  // },
];

// Active Logged-In User ID (Defaults to Admin)
let currentUserId = "usr-1";

// Articles Mock Data
let articles = [];

// Course Registrations Mock Data
let registrations = [];

// Banner Slideshow Data
let bannersList = [];

// State variables
let currentTab = "articles"; // 'articles', 'banners', 'registrations', or 'users'
let currentView = "admin"; // 'admin' or 'public'
let searchQuery = "";
let categoryFilter = "ALL";
let confirmCallback = null;

window.addEventListener("DOMContentLoaded", () => {
  if (!isAuthenticated()) {
    window.location.href = "./auth.html";
    return;
  }
  renderUser();
  renderAdminTab();
  renderAll();
});

// USER ROLE UTILITIES & CONTROLS
function getCurrentUser() {
  const store = getAuthStore();
  return store && store.user ? store.user : { fullName: "Admin", role: "admin" };
}

function renderUser() {
  const user = getCurrentUser();
  const currUserEl = document.getElementById("currUser");
  if (currUserEl && user) {
    currUserEl.innerText = user.fullName || "Admin";
  }
}

function renderAdminTab() {
  const role = getCurrentUser().role;

  role === "admin"
    ? document.getElementById("tabUsersBtn").classList.remove("hidden")
    : "";
  role === "deputy" || role === "admin"
    ? document
        .getElementById("tabSwitchingDashboard")
        .classList.remove("hidden")
    : "";
}

// PERMISSION CHECKERS
function canManageUsers() {
  // Only ADMIN can view and edit user accounts/roles
  return getCurrentUser().role === "admin";
}

function canDeleteItems() {
  // Only admin can delete
  return getCurrentUser().role === "admin";
}

function canManageRegistrations() {
  // admin & DEPUTY can view and edit course registrations
  return (
    getCurrentUser().role === "admin" || getCurrentUser().role === "deputy"
  );
}

async function canEditArticle(postAuthor) {
  const user = getCurrentUser();
  if (user.role === "admin") return true;
  // AUTHOR can only edit their own articles
  return postAuthor === user._id || postAuthor === user.fullName;
}

// VIEW & TAB SWITCHING LOGIC
function toggleAdminView() {
  switchView(currentView === "admin" ? "public" : "admin");
}

function switchAdminTab(tab) {
  currentTab = tab;
  const articlesTabContent = document.getElementById("articlesTabContent");
  const bannersTabContent = document.getElementById("bannersTabContent");
  const registrationsTabContent = document.getElementById(
    "registrationsTabContent",
  );
  const usersTabContent = document.getElementById("usersTabContent");

  const tabArticlesBtn = document.getElementById("tabArticlesBtn");
  const tabBannersBtn = document.getElementById("tabBannersBtn");
  const tabRegistrationsBtn = document.getElementById("tabRegistrationsBtn");
  const tabUsersBtn = document.getElementById("tabUsersBtn");
  const mainActionButtonText = document.getElementById("mainActionButtonText");

  // Hide all tab contents first
  if (articlesTabContent) articlesTabContent.classList.add("hidden");
  if (bannersTabContent) bannersTabContent.classList.add("hidden");
  if (registrationsTabContent) registrationsTabContent.classList.add("hidden");
  if (usersTabContent) usersTabContent.classList.add("hidden");

  const activeClass =
    "px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-sm bg-slate-900 text-white";
  const inactiveClass =
    "px-4 py-2 rounded-md text-sm font-semibold text-slate-700 hover:text-slate-900 transition-all";

  if (tabArticlesBtn) tabArticlesBtn.className = inactiveClass;
  if (tabBannersBtn) tabBannersBtn.className = inactiveClass;
  if (tabRegistrationsBtn) tabRegistrationsBtn.className = inactiveClass;
  if (tabUsersBtn) tabUsersBtn.className = inactiveClass;

  if (tab === "articles") {
    if (articlesTabContent) articlesTabContent.classList.remove("hidden");
    if (tabArticlesBtn) tabArticlesBtn.className = activeClass;
    if (mainActionButtonText) mainActionButtonText.innerText = " Bài viết mới";
  } else if (tab === "banners") {
    if (bannersTabContent) bannersTabContent.classList.remove("hidden");
    if (tabBannersBtn) tabBannersBtn.className = activeClass;
    if (mainActionButtonText) mainActionButtonText.innerText = " Thêm banner mới";
    getBannersData();
  } else if (tab === "registrations") {
    if (registrationsTabContent) registrationsTabContent.classList.remove("hidden");
    if (tabRegistrationsBtn) tabRegistrationsBtn.className = activeClass;
    if (mainActionButtonText) mainActionButtonText.innerText = " Đăng ký học mới";
  } else if (tab === "users") {
    if (usersTabContent) usersTabContent.classList.remove("hidden");
    if (tabUsersBtn) tabUsersBtn.className = activeClass;
    if (mainActionButtonText) mainActionButtonText.innerText = " Thêm tài khoản mới";
  }
  renderAll();
}

function handleMainActionClick() {
  if (currentTab === "articles") {
    openCreateModal("articles");
  } else if (currentTab === "banners") {
    openBannerModal();
  } else if (currentTab === "registrations") {
    if (!canManageRegistrations()) {
      showToast("Tài khoản của bạn không có quyền thêm Đăng ký học!", "info");
      return;
    }
    openCreateModal("registrations");
  } else if (currentTab === "users") {
    if (!canManageUsers()) {
      showToast("Chỉ Quản lý (Admin) mới có quyền thêm tài khoản!", "info");
      return;
    }
    openCreateModal("users");
  }
}

// Done
async function renderArticlesTable() {
  const tbody = document.getElementById("articlesTableBody");
  tbody.innerHTML = "";

  try {
    const res = await authFetch(`${apiUrl}/news/all-news`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Không thể lấy dữ liệu bài viết");
    }
    const { news } = await res.json();

    const filtered = news.reverse().filter((art) => {
      const matchesSearch =
        art.postTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.postAuthor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        categoryFilter === "ALL" ||
        art.category.toLowerCase().includes(categoryFilter.toLowerCase());
      return matchesSearch && matchesCat;
    });

    document.getElementById("statTotalArticles").innerText = news.length;
    document.getElementById("articleCountBadge").innerText =
      `${filtered.length} bài viết`;

    if (filtered.length === 0) {
      tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center py-8 text-slate-400">
                            <i class="fa-regular fa-folder-open text-2xl mb-2 block"></i>
                            Chưa có bài viết nào phù hợp.
                        </td>
                    </tr>
                `;
      return;
    }

    filtered.forEach((art) => {
      const editable = canEditArticle(art.postAuthor);
      const deletable = canDeleteItems();

      const tr = document.createElement("tr");
      tr.className =
        "hover:bg-slate-50/80 transition-colors border-b border-slate-100";
      tr.innerHTML = `
                    <td class="py-4 px-6 font-medium text-slate-900 max-w-xs">
                        <div class="truncate cursor-pointer hover:text-gold-accent font-semibold" onclick="viewArticleDetail('${art.slug}')">
                            ${art.postTitle}
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-semibold">
                            ${art.category || "Khác"}
                        </span>
                    </td>
                    <td class="py-4 px-6 text-slate-600">${art.postAuthor || "Admin"}</td>
                    <td class="py-4 px-6 text-slate-600 font-medium">${art.postDate}</td>
                    <td class="py-4 px-6">
                        ${
                          art.status
                            ? `<span class="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Xuất bản</span>`
                            : `<span class="inline-flex items-center gap-1 text-slate-500 text-xs font-medium bg-slate-100 px-2 py-0.5 rounded-full"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Nháp</span>`
                        }
                    </td>
                    <td class="py-4 px-6 text-right space-x-3 font-medium">
                        <button onclick="viewArticleDetail('${art.slug}')" class="text-slate-500 hover:text-slate-800 transition-colors">Xem</button>
                        ${
                          editable
                            ? `<button onclick="openEditArticleModal('${art.slug}', '${art.postAuthor}')" class="text-slate-600 hover:text-slate-900 transition-colors">Sửa</button>`
                            : `<span class="text-slate-300 cursor-not-allowed">Sửa</span>`
                        }
                        ${
                          deletable
                            ? `<button onclick="deleteArticle('${art._id}')" class="text-red-600 hover:text-red-800 transition-colors">Xoá</button>`
                            : `<span class="text-slate-300 cursor-not-allowed">Xoá</span>`
                        }
                    </td>
                `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error rendering articles table:", error);
  }
}

// Progress...
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

function renderPublicArticles() {
  const grid = document.getElementById("publicArticlesGrid");
  grid.innerHTML = "";

  const publishedArts = articles.filter((a) => a.published);

  if (publishedArts.length === 0) {
    grid.innerHTML = `<div class="col-span-full text-center py-10 text-slate-400">Chưa có bài viết xuất bản.</div>`;
    return;
  }

  publishedArts.forEach((art) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col";
    card.innerHTML = `
                    <div class="h-48 bg-slate-200 overflow-hidden relative">
                        <img src="${art.imageUrl || "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80"}" alt="${art.title}" class="w-full h-full object-cover">
                        <span class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-gold-300 text-xs font-bold px-2.5 py-1 rounded">
                            ${art.category}
                        </span>
                    </div>
                    <div class="p-5 flex-grow flex flex-col justify-between space-y-3">
                        <div>
                            <div class="text-xs text-slate-400 font-medium mb-1">${art.date} — Bởi ${art.author}</div>
                            <h3 class="font-serif-heading font-bold text-lg text-slate-900 line-clamp-2 hover:text-gold-accent cursor-pointer" onclick="viewArticleDetail('${art.id}')">
                                ${art.title}
                            </h3>
                            <p class="text-slate-600 text-xs line-clamp-3 mt-2 leading-relaxed">
                                ${art.summary || art.content}
                            </p>
                        </div>
                        <button onclick="viewArticleDetail('${art.id}')" class="text-xs font-bold text-gold-accent hover:underline flex items-center gap-1 pt-2">
                            Đọc tiếp <i class="fa-solid fa-chevron-right text-[10px]"></i>
                        </button>
                    </div>
                `;
    grid.appendChild(card);
  });
}

function renderAll() {
  renderArticlesTable();
  renderRegistrationsTable();
  renderUsersTable();
  getBannersData();
  //renderPublicArticles();
}

function updateImagePreview(source) {
  const img = document.getElementById("artImgPreview");
  const container = img.parentElement; // = previewContainer

  // 1. Trường hợp chọn File từ máy
  if (source && source.target && source.target.files) {
    const file = source.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        img.src = e.target.result;
        container.classList.remove("hidden"); // sửa: đổi từ img -> container
      };
      reader.readAsDataURL(file);
    }
    return;
  }

  // 2. Trường hợp nhập URL ảnh (Edit bài viết)
  if (typeof source === "string" && source.trim() !== "") {
    const tempImg = new Image();
    tempImg.src = source;

    tempImg.onload = function () {
      img.src = source;
      container.classList.remove("hidden"); // sửa
    };

    tempImg.onerror = function () {
      img.src = "";
      container.classList.add("hidden"); // sửa
    };
    return;
  }

  // 3. Không có dữ liệu -> ẩn
  img.src = "";
  container.classList.add("hidden"); // sửa
}

function handleSearch() {
  searchQuery = document.getElementById("searchInput").value;
  renderAll();
}

function handleFilterChange() {
  categoryFilter = document.getElementById("filterCategorySelect").value;
  renderAll();
}

function openCreateModal(type) {
  if (type === "articles") {
    document.getElementById("articleForm").reset();
    document.getElementById("artId").value = "";
    document.getElementById("artAuthor").value = getCurrentUser().fullName || "Admin";
    document.getElementById("articleModalTitle").innerText = "Bài viết mới";
    document.getElementById("artPublished").checked = true; // Default to published
    updateImagePreview("");
    switchArticleEditorTab("write");
    document.getElementById("articleModal").classList.remove("hidden");
  } else if (type === "registrations") {
    document.getElementById("registrationForm").reset();
    document.getElementById("regId").value = "";
    document.getElementById("regModalTitle").innerText = "Thêm đăng ký học mới";
    document.getElementById("registrationModal").classList.remove("hidden");
    document.getElementById("regStatus").value = "experience"; // Default status
    document.getElementById("regStatus").disabled = false; // Default status
  } else if (type === "users") {
    document.getElementById("userForm").reset();
    document.getElementById("userId").value = "";
    document.getElementById("userModalTitle").innerText =
      "Thêm tài khoản & Phân quyền";
    document.getElementById("userModal").classList.remove("hidden");
  }
}

// ARTICLE MODALS
function closeArticleModal() {
  document.getElementById("articleModal").classList.add("hidden");
  switchArticleEditorTab("write");
}

// Helper chèn thẻ HTML vào vị trí con trỏ trong textarea
function insertHtmlTag(tagOpen, tagClose, defaultText) {
  const textarea = document.getElementById("artContent");
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end) || defaultText;
  const replacement = `${tagOpen}${selectedText}${tagClose}`;

  textarea.value =
    textarea.value.substring(0, start) +
    replacement +
    textarea.value.substring(end);

  textarea.focus();
  textarea.setSelectionRange(
    start + tagOpen.length,
    start + tagOpen.length + selectedText.length,
  );
}

function insertLinkPrompt() {
  const url = prompt("Nhập địa chỉ URL liên kết (https://...):", "https://");
  if (!url) return;
  const textarea = document.getElementById("artContent");
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end) || "tại đây";
  const replacement = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;
  textarea.value =
    textarea.value.substring(0, start) +
    replacement +
    textarea.value.substring(end);
}

function insertImagePrompt() {
  const url = prompt("Nhập đường dẫn ảnh (URL https://...):", "https://");
  if (!url) return;
  const alt = prompt("Nhập mô tả ảnh (alt):", "Hình ảnh minh họa") || "";
  const replacement = `\n<figure class="my-4 text-center">\n  <img src="${url}" alt="${alt}" class="rounded-xl shadow-md mx-auto" />\n  <figcaption class="text-xs text-slate-500 mt-1 italic">${alt}</figcaption>\n</figure>\n`;
  insertHtmlTag(replacement, "", "");
}

// Chuyển tab Soạn thảo / Xem trước HTML trong Modal Thêm & Sửa
function switchArticleEditorTab(tab) {
  const btnWrite = document.getElementById("tabEditorWrite");
  const btnPreview = document.getElementById("tabEditorPreview");
  const writeArea = document.getElementById("artWriteContainer");
  const previewArea = document.getElementById("artPreviewContainer");
  const toolbar = document.getElementById("artHtmlToolbar");
  const content = document.getElementById("artContent") ? document.getElementById("artContent").value : "";

  if (tab === "preview") {
    if (btnWrite) btnWrite.className = "px-3 py-1 rounded-md text-slate-500 hover:text-slate-800 transition";
    if (btnPreview) btnPreview.className = "px-3 py-1 rounded-md bg-white text-slate-900 shadow-sm transition";
    if (writeArea) writeArea.classList.add("hidden");
    if (toolbar) toolbar.classList.add("opacity-50", "pointer-events-none");
    if (previewArea) {
      previewArea.classList.remove("hidden");
      previewArea.innerHTML = renderNewsHtmlContent(content);
    }
  } else {
    if (btnWrite) btnWrite.className = "px-3 py-1 rounded-md bg-white text-slate-900 shadow-sm transition";
    if (btnPreview) btnPreview.className = "px-3 py-1 rounded-md text-slate-500 hover:text-slate-800 transition";
    if (previewArea) previewArea.classList.add("hidden");
    if (toolbar) toolbar.classList.remove("opacity-50", "pointer-events-none");
    if (writeArea) writeArea.classList.remove("hidden");
  }
}

// Chuyển tab Giao diện / Mã nguồn HTML trong Modal Xem chi tiết
function switchViewArticleTab(tab) {
  const btnRendered = document.getElementById("tabViewRendered");
  const btnSource = document.getElementById("tabViewSource");
  const bodyEl = document.getElementById("viewArtBody");
  const sourceWrapper = document.getElementById("viewArtSourceWrapper");

  if (tab === "source") {
    if (btnRendered) btnRendered.className = "px-3 py-1 rounded-md text-slate-500 hover:text-slate-800 transition";
    if (btnSource) btnSource.className = "px-3 py-1 rounded-md bg-white text-slate-900 shadow-sm transition";
    if (bodyEl) bodyEl.classList.add("hidden");
    if (sourceWrapper) sourceWrapper.classList.remove("hidden");
  } else {
    if (btnRendered) btnRendered.className = "px-3 py-1 rounded-md bg-white text-slate-900 shadow-sm transition";
    if (btnSource) btnSource.className = "px-3 py-1 rounded-md text-slate-500 hover:text-slate-800 transition";
    if (sourceWrapper) sourceWrapper.classList.add("hidden");
    if (bodyEl) bodyEl.classList.remove("hidden");
  }
}

// Done
async function openEditArticleModal(slug, author) {
  if (!canEditArticle(author)) {
    showToast("Bạn không có quyền chỉnh sửa bài viết của người khác!", "info");
    return;
  }

  try {
    const res = await authFetch(`${apiUrl}/news/single-news/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Không thể lấy dữ liệu bài viết");
    }

    const { newsDetail } = await res.json();

    document.getElementById("artId").value = newsDetail._id;
    document.getElementById("artTitle").value = newsDetail.postTitle;
    document.getElementById("artCategory").value = newsDetail.category || "";
    document.getElementById("artAuthor").value = newsDetail.postAuthor || "";
    updateImagePreview(newsDetail.postImage);
    document.getElementById("artSummary").value = newsDetail.postHeading || "";
    document.getElementById("artContent").value = newsDetail.postContent || "";
    document.getElementById("artPublished").checked = newsDetail.status !== false;

    switchArticleEditorTab("write");

    document.getElementById("articleModalTitle").innerText =
      "Chỉnh sửa bài viết";
    document.getElementById("articleModal").classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching article details:", error);
    showToast("Không thể tải thông tin bài viết để sửa!", "error");
  }
}

// Hàm phụ: đọc File -> base64, trả về Promise để dùng được với async/await
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve("");
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function saveArticle(e) {
  e.preventDefault();
  const user = getCurrentUser();
  const id = document.getElementById("artId").value;
  const title = document.getElementById("artTitle").value.trim();
  const category =
    document.getElementById("artCategory").value.trim() || "Tài sản số";
  const author = document.getElementById("artAuthor").value.trim() || user.fullName || "Admin";
  const imageInput = document.getElementById("artImage");
  const imageFile = imageInput && imageInput.files ? imageInput.files[0] : null;
  const summary = document.getElementById("artSummary").value.trim();
  const content = document.getElementById("artContent").value.trim();
  const published = document.getElementById("artPublished").checked;

  const today = new Date();
  const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  let fileImageBase64 = "";
  if (imageFile) {
    try {
      fileImageBase64 = await fileToBase64(imageFile);
    } catch (err) {
      console.error("Lỗi đọc file ảnh:", err);
    }
  } else {
    // Giữ nguyên ảnh đã có nếu đang chỉnh sửa
    const imgPreview = document.getElementById("artImgPreview");
    if (imgPreview && imgPreview.src && !imgPreview.src.endsWith("#")) {
      fileImageBase64 = imgPreview.src;
    }
  }

  if (id) {
    // Editing existing article
    try {
      const res = await authFetch(`${apiUrl}/news/edit-news`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          _id: id,
          postTitle: title,
          category,
          postAuthor: author,
          postImage: fileImageBase64,
          postHeading: summary,
          postContent: content,
          postDate: formattedDate,
          status: published,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Lỗi khi cập nhật bài viết");
      }

      showToast("Chỉnh sửa bài viết thành công!", "success");
      closeArticleModal();
      renderAll();
    } catch (error) {
      console.error("Error editing article:", error);
      showToast(error.message || "Đã xảy ra lỗi khi chỉnh sửa bài viết!", "error");
      return;
    }
  } else {
    // Creating new article
    try {
      const res = await authFetch(`${apiUrl}/news/update-news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postTitle: title,
          category,
          postAuthor: author,
          postImage: fileImageBase64,
          postHeading: summary,
          postContent: content,
          postDate: formattedDate,
          status: published,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Lỗi khi tạo bài viết");
      }

      showToast("Thêm bài viết mới thành công!", "success");
      closeArticleModal();
      renderAll();
    } catch (error) {
      console.error("Error creating article:", error);
      showToast(error.message || "Đã xảy ra lỗi khi tạo bài viết!", "error");
      return;
    }
  }
}

// Done
function deleteArticle(id) {
  if (!canDeleteItems()) {
    showToast("Chỉ Quản lý (Admin) mới có quyền xoá bài viết!", "info");
    return;
  }
  if (!id) return;

  showConfirmModal(`Bạn có chắc muốn xoá bài viết này không?`, async () => {
    try {
      const res = await authFetch(`${apiUrl}/news/delete-news/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Không thể xoá bài viết");
      }
      showToast("Đã xoá bài viết thành công!", "info");
      renderAll();
    } catch (error) {
      console.error("Error deleting article:", error);
      showToast("Đã xảy ra lỗi khi xoá bài viết!", "error");
      return;
    }
  });
}

// Quản trị nội dung HTML: Bấm vào xem chi tiết bài viết
async function viewArticleDetail(slug) {
  try {
    const res = await authFetch(`${apiUrl}/news/single-news/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Không thể lấy dữ liệu bài viết");
    }

    const { newsDetail } = await res.json();
    if (!newsDetail) return;

    // Reset về tab hiển thị giao diện HTML
    switchViewArticleTab("rendered");

    document.getElementById("viewArtTitle").innerText = newsDetail.postTitle || "";
    document.getElementById("viewArtCategory").innerText =
      newsDetail.category || "Tài sản số";

    // Trạng thái bài viết
    const statusBadge = document.getElementById("viewArtStatusBadge");
    if (statusBadge) {
      if (newsDetail.status) {
        statusBadge.className =
          "text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200";
        statusBadge.innerHTML =
          '<span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 me-1"></span> Đã xuất bản';
      } else {
        statusBadge.className =
          "text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200";
        statusBadge.innerHTML =
          '<span class="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 me-1"></span> Bản nháp';
      }
    }

    const author = newsDetail.postAuthor || "BlueInvest";
    document.getElementById("viewArtAuthor").innerText = `Tác giả: ${author}`;

    const displayDate =
      newsDetail.postDate ||
      (newsDetail.createdAt ? formatVietnameseDate(newsDetail.createdAt) : "");
    document.getElementById("viewArtDate").innerText = `Ngày đăng: ${displayDate}`;

    const viewsEl = document.getElementById("viewArtViews");
    if (viewsEl) {
      viewsEl.innerHTML = `<i class="fa-regular fa-eye me-1 text-slate-400"></i> ${newsDetail.views || 0} lượt xem`;
    }

    // Ảnh thumbnail
    const imgWrapper = document.getElementById("viewArtImageWrapper");
    const img = document.getElementById("viewArtImage");
    if (newsDetail.postImage) {
      img.src = newsDetail.postImage;
      imgWrapper.classList.remove("hidden");
    } else {
      img.src = "";
      imgWrapper.classList.add("hidden");
    }

    // Mô tả ngắn
    const summaryEl = document.getElementById("viewArtSummary");
    if (newsDetail.postHeading) {
      summaryEl.innerText = newsDetail.postHeading;
      summaryEl.classList.remove("hidden");
    } else {
      summaryEl.classList.add("hidden");
    }

    // Render HTML nội dung chi tiết
    const bodyEl = document.getElementById("viewArtBody");
    bodyEl.innerHTML = renderNewsHtmlContent(newsDetail.postContent);

    // Xem mã nguồn HTML thô
    const rawSource = document.getElementById("viewArtRawSource");
    if (rawSource) {
      rawSource.innerText = newsDetail.postContent || "<!-- Chưa có nội dung HTML -->";
    }

    // Link nguồn gốc bài viết
    const sourceUrlContainer = document.getElementById("viewArtSourceUrl");
    const sourceUrlLink = document.getElementById("viewArtSourceUrlLink");
    if (newsDetail.postSource && sourceUrlContainer && sourceUrlLink) {
      sourceUrlLink.href = newsDetail.postSource;
      sourceUrlLink.innerText = newsDetail.postSource;
      sourceUrlContainer.classList.remove("hidden");
    } else if (sourceUrlContainer) {
      sourceUrlContainer.classList.add("hidden");
    }

    // Nút chỉnh sửa trực tiếp từ modal xem chi tiết
    const actionContainer = document.getElementById("viewArtActionContainer");
    if (actionContainer) {
      const viewOnWebBtn = `
        <a
          href="./article.html?slug=${newsDetail.slug}"
          target="_blank"
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition shadow-sm flex items-center gap-1.5"
        >
          <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i> Xem trên web
        </a>
      `;

      if (canEditArticle(newsDetail.postAuthor)) {
        actionContainer.innerHTML = `
          ${viewOnWebBtn}
          <button
            onclick="closeViewArticleModal(); openEditArticleModal('${newsDetail.slug}', '${newsDetail.postAuthor || ''}')"
            class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-sm transition shadow-sm flex items-center gap-1.5"
          >
            <i class="fa-solid fa-pen-to-square text-xs"></i> Chỉnh sửa bài viết
          </button>
        `;
      } else {
        actionContainer.innerHTML = viewOnWebBtn;
      }
    }

    document.getElementById("viewArticleModal").classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching article details:", error);
    showToast("Không thể tải chi tiết bài viết!", "error");
  }
}

function closeViewArticleModal() {
  document.getElementById("viewArticleModal").classList.add("hidden");
}

// REGISTRATION MODAL LOGIC
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
async function handlePublicRegister(e) {
  e.preventDefault();
  const name = document.getElementById("pubName").value.trim();
  const phone = document.getElementById("pubPhone").value.trim();
  const email = document.getElementById("pubEmail").value.trim();

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
      throw new Error("Không thể gửi thông tin đăng ký học từ server");
    }
    document.getElementById("publicRegisterForm").reset();
    showToast(
      "Đăng ký tư vấn khóa học thành công! Cố vấn sẽ liên hệ bạn sớm nhất.",
      "success",
    );
    renderAll();
  } catch (error) {
    console.error("Error submitting public registration:", error);
  }
}

// CUSTOM CONFIRM MODAL
function showConfirmModal(text, callback) {
  document.getElementById("confirmModalText").innerText = text;
  confirmCallback = callback;
  document.getElementById("confirmModal").classList.remove("hidden");
}

function closeConfirmModal(accepted) {
  document.getElementById("confirmModal").classList.add("hidden");
  if (accepted && confirmCallback) {
    confirmCallback();
  }
  confirmCallback = null;
}

// TOAST NOTIFICATION UTILITY
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");

  let bgColors = "bg-slate-900 text-white";
  let icon = "fa-check-circle text-emerald-400";

  if (type === "info") {
    bgColors = "bg-slate-800 text-white";
    icon = "fa-info-circle text-blue-400";
  }

  if (type === "error") {
    bgColors = "bg-slate-800 text-white";
    icon = "fa-exclamation-circle text-red-400";
  }

  toast.className = `p-4 rounded-xl shadow-xl flex items-center gap-3 text-sm border border-slate-700 pointer-events-auto transition-all duration-300 opacity-0 transform translate-y-2 ${bgColors}`;
  toast.innerHTML = `
                <i class="fa-solid ${icon} text-lg"></i>
                <span class="flex-grow font-medium">${message}</span>
            `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-y-2");
  }, 10);

  setTimeout(() => {
    toast.classList.add("opacity-0", "-translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==================== BANNER SLIDESHOW MANAGEMENT ====================
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
