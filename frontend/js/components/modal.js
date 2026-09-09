if (typeof renderNewsHtmlContent !== "function") {
  window.renderNewsHtmlContent = function (content) {
    if (!content) return "<p class='text-slate-400 italic'>Chưa có nội dung bài viết.</p>";
    const hasHtml = /<[a-z][\s\S]*>/i.test(content);
    if (hasHtml) return content;
    return content
      .split(/\n{2,}/)
      .map((p) => `<p class="mb-3">${p.replace(/\n/g, "<br/>")}</p>`)
      .join("");
  };
}

// Modal Handlers
async function openModal(slug) {
  let newsDetail = null;

  try {
    const res = await fetch(`${apiUrl}/news/single-news/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      newsDetail = data.newsDetail;
    }
  } catch (error) {
    console.warn("API fetch error, looking up in local articles...", error);
  }

  // Fallback to local articles if API didn't return detail
  if (!newsDetail && typeof allLoadedArticles !== "undefined" && Array.isArray(allLoadedArticles)) {
    newsDetail = allLoadedArticles.find((a) => a.slug === slug);
  }
  if (!newsDetail && typeof DEFAULT_CAPITAL_NEWS !== "undefined" && Array.isArray(DEFAULT_CAPITAL_NEWS)) {
    newsDetail = DEFAULT_CAPITAL_NEWS.find((a) => a.slug === slug);
  }

  if (newsDetail) {
    const displayDate =
      newsDetail.postDate ||
      (newsDetail.createdAt ? formatVietnameseDate(newsDetail.createdAt) : "07/09/2026");
    const author = newsDetail.postAuthor || "Capital Circle";

    document.getElementById("modal-content").innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between text-xs text-slate-500">
          <span class="font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            ${newsDetail.category || "Kiến thức đầu tư"}
          </span>
          <span class="text-slate-400">
            <i class="fa-regular fa-clock me-1"></i> ${displayDate}
          </span>
        </div>
        
        <h2 class="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
          ${newsDetail.postTitle}
        </h2>
        
        <div class="flex items-center space-x-3 text-xs text-slate-500 pb-3 border-b border-slate-100">
          <span class="font-semibold text-slate-700"><i class="fa-solid fa-user-pen me-1 text-amber-600"></i> ${author}</span>
          <span>•</span>
          <span><i class="fa-regular fa-eye me-1"></i> ${newsDetail.views ? Number(newsDetail.views).toLocaleString('vi-VN') : '12.5k'} lượt đọc</span>
        </div>

        ${
          newsDetail.postImage
            ? `<div class="rounded-2xl overflow-hidden shadow-md max-h-[400px] bg-slate-900"><img src="${newsDetail.postImage}" alt="${newsDetail.postTitle}" class="w-full h-full object-cover"></div>`
            : ""
        }

        ${
          newsDetail.postHeading
            ? `<div class="p-4 bg-slate-50 border-l-4 border-amber-500 rounded-r-xl text-slate-700 italic text-sm font-medium leading-relaxed">${newsDetail.postHeading}</div>`
            : ""
        }

        <div class="rich-news-content py-2">
          ${renderNewsHtmlContent(newsDetail.postContent)}
        </div>

        ${
          newsDetail.postSource
            ? `<div class="text-xs text-slate-400 pt-4 border-t border-slate-100">Nguồn: <a href="${newsDetail.postSource}" target="_blank" rel="noopener noreferrer" class="text-amber-600 hover:underline break-all">${newsDetail.postSource}</a></div>`
            : ""
        }
      </div>
    `;
    document.getElementById("article-modal").classList.remove("hidden");
  } else {
    console.error("Không tìm thấy chi tiết bài viết với slug:", slug);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
  }
}
