async function getDataNewsPage() {
  try {
    const res = await fetch(`${apiUrl}/news/all-published-news`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Không thể lấy dữ liệu");
    }
    const { news } = await res.json();

    if (news && news.length > 0) {
      const sortedNews = [...news].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );

      const newsContainer = document.querySelector(".Articles_Grid_Cards");
      const defaultImg =
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80";

      newsContainer.innerHTML = sortedNews
        .map(
          (item, idx) => `
          <div
            class="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group cursor-pointer"
            onclick="window.location.href='./article.html?slug=${item.slug}'"
          >
            <div>
              <div class="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src="${item.postImage || defaultImg}"
                  alt="${item.postTitle || ''}"
                  onerror="this.src='${defaultImg}'"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                />
                <div class="absolute bottom-3 left-3">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-slate-950/70 border border-slate-700/60 text-white">
                    ${item.category || item.postCategory || "KIẾN THỨC"}
                  </span>
                </div>
              </div>
              <div class="p-5">
                <h3
                  class="font-bold text-base text-slate-900 group-hover:text-amber-600 transition duration-200 leading-snug line-clamp-2"
                >
                  ${item.postTitle}
                </h3>
                <p
                  class="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed"
                >
                  ${item.postHeading || ""}
                </p>
              </div>
            </div>
            <div class="px-5 pb-5 pt-0 text-[11px] text-slate-400 flex items-center justify-between font-medium">
              <span><i class="fa-regular fa-calendar me-1"></i> ${item.postDate || (item.createdAt ? formatVietnameseDate(item.createdAt) : "07/09/2026")}</span>
              <span><i class="fa-regular fa-clock me-1"></i> ${5 + (idx % 4)} phút đọc</span>
            </div>
          </div>
        `,
        )
        .join("");
    }
  } catch (error) {
    console.error("Lỗi tải tin tức:", error);
  }
}

getDataNewsPage();
