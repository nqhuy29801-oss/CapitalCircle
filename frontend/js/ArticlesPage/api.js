async function loadArticlesPage() {
  const container = document.getElementById("articles-grid");
  const selectedCategory =
    new URLSearchParams(window.location.search).get("category")?.trim() || "";
  const fallbackImage =
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80";

  const normalizeCategory = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const pageTitle = document.getElementById("articles-page-title");
  if (pageTitle && selectedCategory) {
    pageTitle.textContent = `Bài viết: ${selectedCategory}`;
  }

  try {
    const response = await fetch(`${apiUrl}/article/all-published-articles`);
    if (!response.ok) throw new Error("Không thể tải bài viết");
    const { articles = [] } = await response.json();
    const normalizedSelectedCategory = normalizeCategory(selectedCategory);
    const filteredArticles = normalizedSelectedCategory
      ? articles.filter((article) => {
          const articleCategory = normalizeCategory(article.category || "");
          if (!articleCategory) return false;
          return (
            articleCategory.includes(normalizedSelectedCategory) ||
            normalizedSelectedCategory.includes(articleCategory)
          );
        })
      : articles;

    if (!filteredArticles.length) {
      container.innerHTML = `<p class="col-span-full py-12 text-center text-slate-500">${selectedCategory ? `Chưa có bài viết thuộc chủ đề &quot;${selectedCategory}&quot;.` : "Chưa có bài viết."}</p>`;
      return;
    }

    container.innerHTML = filteredArticles
      .map(
        (article) => `
      <a href="./article.html?slug=${encodeURIComponent(article.slug)}" class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div class="relative h-48 overflow-hidden bg-slate-900">
          <img src="${article.image || fallbackImage}" alt="${article.title || ""}" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" onerror="this.src='${fallbackImage}'" />
          <span class="absolute bottom-3 left-3 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">${article.category || "KIẾN THỨC"}</span>
        </div>
        <div class="p-5">
          <h2 class="line-clamp-2 font-bold leading-snug text-slate-900 group-hover:text-amber-600">${article.title || "Không có tiêu đề"}</h2>
          <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">${article.heading || ""}</p>
          <p class="mt-4 text-xs font-medium text-slate-400">${article.author || "Capital Circle"}</p>
        </div>
      </a>
    `,
      )
      .join("");
  } catch (error) {
    console.error("Lỗi tải bài viết:", error);
    container.innerHTML =
      '<p class="col-span-full py-12 text-center text-red-500">Không thể tải danh sách bài viết.</p>';
  }
}

loadArticlesPage();
