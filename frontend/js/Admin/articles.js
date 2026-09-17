async function canEditArticle(postAuthor) {
  const user = getCurrentUser();
  if (user.role === "admin") return true;
  // AUTHOR can only edit their own articles
  return postAuthor === user._id || postAuthor === user.fullName;
}

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
  const content = document.getElementById("artContent")
    ? document.getElementById("artContent").value
    : "";

  if (tab === "preview") {
    if (btnWrite)
      btnWrite.className =
        "px-3 py-1 rounded-md text-slate-500 hover:text-slate-800 transition";
    if (btnPreview)
      btnPreview.className =
        "px-3 py-1 rounded-md bg-white text-slate-900 shadow-sm transition";
    if (writeArea) writeArea.classList.add("hidden");
    if (toolbar) toolbar.classList.add("opacity-50", "pointer-events-none");
    if (previewArea) {
      previewArea.classList.remove("hidden");
      previewArea.innerHTML = renderNewsHtmlContent(content);
    }
  } else {
    if (btnWrite)
      btnWrite.className =
        "px-3 py-1 rounded-md bg-white text-slate-900 shadow-sm transition";
    if (btnPreview)
      btnPreview.className =
        "px-3 py-1 rounded-md text-slate-500 hover:text-slate-800 transition";
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
    if (btnRendered)
      btnRendered.className =
        "px-3 py-1 rounded-md text-slate-500 hover:text-slate-800 transition";
    if (btnSource)
      btnSource.className =
        "px-3 py-1 rounded-md bg-white text-slate-900 shadow-sm transition";
    if (bodyEl) bodyEl.classList.add("hidden");
    if (sourceWrapper) sourceWrapper.classList.remove("hidden");
  } else {
    if (btnRendered)
      btnRendered.className =
        "px-3 py-1 rounded-md bg-white text-slate-900 shadow-sm transition";
    if (btnSource)
      btnSource.className =
        "px-3 py-1 rounded-md text-slate-500 hover:text-slate-800 transition";
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
    document.getElementById("artPublished").checked =
      newsDetail.status !== false;

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
  const author =
    document.getElementById("artAuthor").value.trim() ||
    user.fullName ||
    "Admin";
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
  console.log("fileImageBase64:", content);
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
      showToast(
        error.message || "Đã xảy ra lỗi khi chỉnh sửa bài viết!",
        "error",
      );
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

    document.getElementById("viewArtTitle").innerText =
      newsDetail.postTitle || "";
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
    document.getElementById("viewArtDate").innerText =
      `Ngày đăng: ${displayDate}`;

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
      rawSource.innerText =
        newsDetail.postContent || "<!-- Chưa có nội dung HTML -->";
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
            onclick="closeViewArticleModal(); openEditArticleModal('${newsDetail.slug}', '${newsDetail.postAuthor || ""}')"
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
