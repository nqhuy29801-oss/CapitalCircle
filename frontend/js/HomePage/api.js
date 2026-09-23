// Capital Circle Homepage Data & Logic

// Mock dataset matching the user's design image perfectly
const DEFAULT_CAPITAL_NEWS = [
  {
    slug: "bitcoin-co-the-dat-150000-usd-trong-nam-2026",
    category: "CRYPTO",
    badgeBg: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    postTitle: "Bitcoin có thể đạt 150,000 USD trong năm 2026?",
    postHeading:
      "Phân tích chu kỳ halving, dòng vốn từ các quỹ ETF giao ngay và tác động của chính sách tiền tệ toàn cầu đến giá trị Bitcoin.",
    postImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    postDate: "07/09/2026",
    readingTime: "6 phút đọc",
    postAuthor: "Ban Phân Tích Capital Circle",
    postContent: `
      <h2>Triển vọng Bitcoin trong chu kỳ tài chính mới</h2>
      <p>Sau đợt halving gần nhất, nguồn cung Bitcoin mới phát hành mỗi ngày đã giảm một nửa, trong khi nhu cầu hấp thụ từ các định chế tài chính thông qua các quỹ ETF giao ngay tiếp tục duy trì ở mức cao kỷ lục.</p>
      <blockquote>"Sự khan hiếm tuyệt đối trong thế giới kỹ thuật số đang biến Bitcoin thành tài sản lưu trữ giá trị đáng tin cậy nhất trong thời đại lạm phát tiền tệ fiat."</blockquote>
      <h3>Các động lực thúc đẩy chính:</h3>
      <ul>
        <li><b>Dòng vốn tổ chức:</b> Các quỹ hưu trí và quỹ phòng hộ hàng đầu thế giới đang tăng tỷ trọng nắm giữ tài sản số lên 2-5% tổng danh mục.</li>
        <li><b>Chính sách nới lỏng tiền tệ:</b> Dự báo Fed tiếp tục cắt giảm lãi suất sẽ thúc đẩy thanh khoản quay trở lại thị trường tài sản rủi ro.</li>
        <li><b>Khung pháp lý minh bạch:</b> Việc hoàn thiện luật pháp tại Mỹ, EU và các trung tâm tài chính châu Á tạo niềm tin vững chắc cho nhà đầu tư tổ chức.</li>
      </ul>
    `,
  },
  {
    slug: "nhung-nhom-nganh-dang-chu-y-trong-quy-4-2026",
    category: "CHỨNG KHOÁN",
    badgeBg: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    postTitle: "Những nhóm ngành đáng chú ý trong quý 4/2026",
    postHeading:
      "Đánh giá triển vọng các nhóm cổ phiếu công nghệ, ngân hàng và bán lẻ trong giai đoạn phục hồi mạnh mẽ của nền kinh tế.",
    postImage:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    postDate: "06/09/2026",
    readingTime: "7 phút đọc",
    postAuthor: "Chuyên gia Minh Tuấn",
    postContent: `
      <h2>Tâm điểm đầu tư quý 4/2026</h2>
      <p>Quý cuối năm thường là thời điểm các doanh nghiệp đẩy mạnh doanh thu và hoàn thành kế hoạch lợi nhuận năm. Dưới đây là những nhóm ngành sở hữu câu chuyện tăng trưởng rõ ràng nhất:</p>
      <ul>
        <li><b>Nhóm Ngân hàng:</b> Tăng trưởng tín dụng khả quan kết hợp cùng chi phí vốn giảm giúp biên lãi ròng (NIM) tiếp tục cải thiện.</li>
        <li><b>Nhóm Công nghệ & Bán dẫn:</b> Hưởng lợi lớn từ làn sóng đầu tư vào trí tuệ nhân tạo và chuyển đổi hạ tầng đám mây.</li>
        <li><b>Nhóm Bán lẻ tiêu dùng:</b> Sức mua nội địa phục hồi nhờ các gói kích cầu và mùa mua sắm cuối năm.</li>
      </ul>
    `,
  },
  {
    slug: "gia-vang-se-di-ve-dau-khi-fed-ha-lai-suat",
    category: "VÀNG",
    badgeBg: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    postTitle: "Giá vàng sẽ đi về đâu khi Fed hạ lãi suất?",
    postHeading:
      "Tương quan giữa lợi suất thực tế, sức mạnh đồng USD và xu hướng tích trữ vàng vật chất của các ngân hàng trung ương.",
    postImage:
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
    postDate: "05/09/2026",
    readingTime: "5 phút đọc",
    postAuthor: "Capital Circle Research",
    postContent: `
      <h2>Vàng trong chu kỳ cắt giảm lãi suất</h2>
      <p>Lịch sử 50 năm qua cho thấy: mỗi khi Cục Dự trữ Liên bang Mỹ (Fed) bắt đầu chu kỳ nới lỏng tiền tệ, giá vàng thế giới bình quân tăng từ 15% đến 25% trong vòng 12 tháng kế tiếp.</p>
      <blockquote>"Vàng không sinh ra lợi tức hàng năm, nhưng khi lãi suất thực giảm xuống mức âm, chi phí cơ hội nắm giữ vàng gần như bằng không."</blockquote>
    `,
  },
  {
    slug: "hanh-trinh-tu-nguoi-moi-den-nha-dau-tu-co-ky-luat",
    category: "TƯ DUY ĐẦU TƯ",
    badgeBg: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    postTitle: "Hành trình từ người mới đến nhà đầu tư có kỷ luật",
    postHeading:
      "Những bài học xương máu giúp bạn xây dựng tư duy quản trị tài chính vững vàng, tránh xa bẫy FOMO và thua lỗ.",
    postImage:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    postDate: "04/09/2026",
    readingTime: "6 phút đọc",
    postAuthor: "Hoàng Nam",
    postContent: `
      <h2>Xây dựng hệ thống đầu tư cho riêng bạn</h2>
      <p>Khác biệt giữa một người đánh bạc và một nhà đầu tư thực thụ nằm ở việc họ có một hệ thống quy tắc rõ ràng và tuân thủ nó một cách máy móc, bất chấp cảm xúc cá nhân.</p>
      <ul>
        <li>Không bao giờ đầu tư vào thứ bạn không hiểu rõ mô hình kinh doanh.</li>
        <li>Luôn duy trì quỹ dự phòng khẩn cấp tối thiểu 6 tháng chi phí sinh hoạt.</li>
        <li>Chấp nhận cắt lỗ sớm khi luận điểm đầu tư ban đầu không còn đúng.</li>
      </ul>
    `,
  },
  {
    slug: "quan-tri-rui-ro-bai-hoc-khong-bao-gio-cu",
    category: "KIẾN THỨC",
    badgeBg: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
    postTitle: "Quản trị rủi ro – bài học không bao giờ cũ",
    postHeading:
      "Tại sao bảo toàn vốn luôn là mục tiêu tối thượng trước khi nghĩ đến việc tìm kiếm lợi nhuận trên thị trường?",
    postImage:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    postDate: "03/09/2026",
    readingTime: "7 phút đọc",
    postAuthor: "Capital Circle",
    postContent: `
      <h2>Quy tắc số 1: Đừng để mất tiền</h2>
      <p>Nhà đầu tư huyền thoại Warren Buffett từng đưa ra 2 quy tắc vàng: Quy tắc số 1: Không bao giờ để mất tiền. Quy tắc số 2: Không bao giờ quên quy tắc số 1. Khi bạn mất 50% vốn, bạn cần sinh lời 100% chỉ để hòa vốn ban đầu.</p>
    `,
  },
  {
    slug: "dau-tu-khong-chi-la-tien-ma-con-la-chinh-minh",
    category: "CUỘC SỐNG",
    badgeBg: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    postTitle: "Đầu tư không chỉ là tiền, mà còn là chính mình",
    postHeading:
      "Nâng cao năng lực cá nhân, sức khỏe tinh thần và trải nghiệm sống chính là khoản đầu tư mang lại tỷ suất sinh lời vô hạn.",
    postImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    postDate: "02/09/2026",
    readingTime: "5 phút đọc",
    postAuthor: "Đội ngũ Capital Circle",
    postContent: `
      <h2>Khoản đầu tư tốt nhất bạn từng thực hiện</h2>
      <p>Tiền bạc chỉ là công cụ để phục vụ cuộc sống tự do và an yên. Đừng đánh đổi sức khỏe, các mối quan hệ quý giá hay sự bình an nội tâm chỉ vì những biến động xanh đỏ ngắn hạn trên biểu đồ giá.</p>
    `,
  },
];

// Global articles store for in-page search
let allLoadedArticles = [];

// Featured article slug
let currentFeaturedSlug = "ky-luat-la-loi-the-lon-nhat-cua-nha-dau-tu-ca-nhan";

async function getDataNewsHomePage() {
  try {
    const res = await fetch(`${apiUrl}/news/all-published-news`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let dbNews = [];
    if (res.ok) {
      const data = await res.json();
      dbNews = data.news || [];
    }

    // Sort DB news newest first
    dbNews.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );

    // Combine DB news with default items to ensure full data
    allLoadedArticles = [...dbNews];
    DEFAULT_CAPITAL_NEWS.forEach((item) => {
      if (
        !allLoadedArticles.some(
          (a) => a.slug === item.slug || a.postTitle === item.postTitle,
        )
      ) {
        allLoadedArticles.push(item);
      }
    });

    // 1. Featured Article
    // Look for article with title "Kỷ luật..." or use the top 1 article
    const featured =
      dbNews.find(
        (n) =>
          n.slug === "ky-luat-la-loi-the-lon-nhat-cua-nha-dau-tu-ca-nhan" ||
          (n.postTitle && n.postTitle.includes("Kỷ luật")),
      ) ||
      dbNews[0] ||
      DEFAULT_CAPITAL_NEWS[0];

    if (featured) {
      currentFeaturedSlug = featured.slug;
      const featCard = document.getElementById("featuredArticleCard");
      if (featCard) {
        const featImg = document.getElementById("featImg");
        const featTitle = document.getElementById("featTitle");
        const featExcerpt = document.getElementById("featExcerpt");
        const featAuthor = document.getElementById("featAuthor");
        const featDate = document.getElementById("featDate");

        if (featImg && featured.postImage) featImg.src = featured.postImage;
        if (featTitle && featured.postTitle)
          featTitle.innerText = featured.postTitle;
        if (featExcerpt && (featured.postHeading || featured.postContent)) {
          featExcerpt.innerText =
            featured.postHeading ||
            featured.postContent.replace(/<[^>]*>?/gm, "").slice(0, 160) +
              "...";
        }
        if (featAuthor)
          featAuthor.innerText = featured.postAuthor || "Capital Circle";
        if (featDate) {
          featDate.innerText =
            featured.postDate ||
            (featured.createdAt
              ? formatVietnameseDate(featured.createdAt)
              : "07 Tháng 9, 2026");
        }
      }
    }

    // 2. Latest 6 Articles Grid
    // We want the 6 featured articles from the design screenshot to appear in order,
    // or newly published admin articles to appear at the beginning.
    const canonicalSlugs = [
      "bitcoin-co-the-dat-150000-usd-trong-nam-2026",
      "nhung-nhom-nganh-dang-chu-y-trong-quy-4-2026",
      "gia-vang-se-di-ve-dau-khi-fed-ha-lai-suat",
      "hanh-trinh-tu-nguoi-moi-den-nha-dau-tu-co-ky-luat",
      "quan-tri-rui-ro-bai-hoc-khong-bao-gio-cu",
      "dau-tu-khong-chi-la-tien-ma-con-la-chinh-minh",
    ];

    // Separate new custom admin articles from the canonical ones
    const customDbArticles = dbNews.filter(
      (n) =>
        n.slug !== currentFeaturedSlug &&
        !canonicalSlugs.includes(n.slug) &&
        n.slug !== "10-nguyen-tac-dau-tu-cua-warren-buffett" &&
        n.slug !== "stablecoin-va-co-hoi-cho-viet-nam" &&
        n.slug !== "so-sanh-vang-chung-khoan-va-bitcoin" &&
        n.slug !== "lam-sao-de-bat-dau-dau-tu-voi-10-trieu" &&
        n.slug !== "tu-duy-dai-han-trong-mot-the-gioi-ngan-han",
    );

    // Build the grid articles array:
    // If there are newly created articles by admin, put them first, then canonical items
    let gridArticles = [...customDbArticles];

    for (const slug of canonicalSlugs) {
      if (gridArticles.length >= 6) break;
      const fromDb = dbNews.find((n) => n.slug === slug);
      const fromMock = DEFAULT_CAPITAL_NEWS.find((n) => n.slug === slug);
      const itemToAdd = fromDb || fromMock;
      if (itemToAdd && !gridArticles.some((a) => a.slug === itemToAdd.slug)) {
        gridArticles.push(itemToAdd);
      }
    }

    gridArticles = gridArticles.slice(0, 6); // Reverse to show newest first

    const gridContainer = document.getElementById("latestArticlesGrid");
    if (gridContainer) {
      gridContainer.innerHTML = gridArticles
        .map((item, idx) => {
          const categoryName = item.category || "TÀI CHÍNH";
          const badgeClass =
            item.badgeBg ||
            (idx % 3 === 0
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
              : idx % 3 === 1
                ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30");
          const dateText =
            item.postDate ||
            (item.createdAt
              ? formatVietnameseDate(item.createdAt)
              : "07/09/2026");
          const readTime = item.readingTime || `${5 + (idx % 4)} phút đọc`;

          return `
            <div
              class="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group cursor-pointer"
              onclick="window.location.href='./article.html?slug=${item.slug}'"
            >
              <div>
                <div class="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src="${item.postImage || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80"}"
                    alt="${item.postTitle || ""}"
                    onerror="this.src='https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80'"
                    class="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                  />
                  <!-- Category Pill Badge on image bottom-left -->
                  <div class="absolute bottom-3 left-3">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-slate-950/70 border border-slate-700/60 text-white">
                      ${categoryName}
                    </span>
                  </div>
                </div>

                <div class="p-5">
                  <h4
                    class="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-600 transition duration-200 leading-snug line-clamp-2"
                  >
                    ${item.postTitle}
                  </h4>
                  <p class="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    ${item.postHeading || ""}
                  </p>
                </div>
              </div>

              <!-- Footer Date & Read Time -->
              <div class="px-5 pb-5 pt-0 text-[11px] text-slate-400 flex items-center justify-between font-medium">
                <span><i class="fa-regular fa-calendar me-1 text-slate-400"></i> ${dateText}</span>
                <span><i class="fa-regular fa-clock me-1 text-slate-400"></i> ${readTime}</span>
              </div>
            </div>
          `;
        })
        .join("");
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu trang chủ Capital Circle:", error);
  }
}

async function getTopViewedArticles() {
  try {
    const response = await fetch(`${apiUrl}/article/most-viewed-articles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Không thể tải bài viết xem nhiều nhất");
    }
    const { mostViewedArticles } = await response.json();

    const mostViewedContainer = document.getElementById("mostViewedArticles");
    if (mostViewedContainer) {
      let count = 0;
      mostViewedContainer.innerHTML = mostViewedArticles
        .map((article) => {
          return `
          <a
                href="./article.html?slug=${article.slug}"
                class="pt-2 flex items-start space-x-3 group cursor-pointer block"
              >
                <span
                  class="w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-white transition"
                >
                  ${++count}
                </span>
                <div>
                  <h5
                    class="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition leading-snug"
                  >
                    ${article.title}
                  </h5>
                  <p class="text-[11px] text-slate-400 mt-0.5">
                    ${article.viewed} lượt đọc
                  </p>
                </div>
              </a>`;
        })
        .join("");
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu bài viết xem nhiều nhất:", error);
  }
}

// Bài viết mới nhất
async function getLatestArticles() {
  try {
    const response = await fetch(`${apiUrl}/article/latest-articles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Không thể tải bài viết mới nhất");
    }
    const { latestArticles } = await response.json();

    const latestArticleContainer = document.getElementById("featured-article");
    if (latestArticleContainer) {
      latestArticleContainer.innerHTML = latestArticles
        .slice(0, 1)
        .map((article) => {
          return `
          <a
              id="featuredArticleCard"
              href="window.location.href='./article.html?slug=${article.slug}'"
              class="block bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition overflow-hidden group cursor-pointer"
            >
              <!-- Image Container with Pill Badge -->
              <div
                class="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-900"
              >
                <img
                  id="featImgHeader"
                  src="${article.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80"}"
                  alt="${article.title}"
                  class="w-full h-full object-cover group-hover:scale-[1.02] transition duration-700 ease-out"
                />
                
                <div class="absolute top-4 left-4 z-10">
                  <span
                    class="px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-white text-[11px] font-bold tracking-wider uppercase shadow-md"
                  >
                    BÀI VIẾT MỚI NHẤT
                  </span>
                </div>
              </div>

              <!-- Article Content -->
              <div class="p-6 sm:p-8 space-y-3.5">
                <h2
                  id="featTitleHeader"
                  class="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition"
                >
                  ${article.title}
                </h2>
                <p
                  id="featExcerptHeader"
                  class="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3 font-normal"
                >
                  Trong một thế giới đầy biến động, không phải ai dự đoán đúng
                  thị trường mới thành công, mà là người kiên trì với nguyên tắc
                  của mình.
                </p>

                <!-- Meta Footer -->
                <div
                  class="pt-3 flex items-center space-x-3 text-xs text-slate-500 font-medium"
                >
                  <div
                    class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-[10px]"
                  >
                    C
                  </div>
                  <span
                    id="featAuthorHeader"
                    class="text-slate-800 font-semibold"
                    >Capital Circle</span
                  >
                  <span>•</span>
                  <span id="featDateHeader">${formatVietnameseDate(article.createdAt)}</span>
                  <span>•</span>
                  <span
                    ><i class="fa-regular fa-clock me-1"></i> 8 phút đọc</span
                  >
                </div>
              </div>
            </a>
          `;
        })
        .join("");
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu bài viết xem nhiều nhất:", error);
  }
}

function openFeaturedArticleModal() {
  if (currentFeaturedSlug) {
    window.location.href = `./article.html?slug=${currentFeaturedSlug}`;
  }
}

// Navigate to article page directly
function openStaticArticleModal(slug, fallbackTitle) {
  window.location.href = `./article.html?slug=${slug}`;
}

function formatGlobalNewsAge(createdAt) {
  const createdTime = new Date(createdAt).getTime();
  if (!createdTime) return "Vừa cập nhật";

  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - createdTime) / 60000),
  );
  if (elapsedMinutes < 1) return "Vừa cập nhật";
  if (elapsedMinutes < 60) return `${elapsedMinutes} phút trước`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  return elapsedHours < 24
    ? `${elapsedHours} giờ trước`
    : `${Math.floor(elapsedHours / 24)} ngày trước`;
}

function renderGlobalNews(news) {
  const list = document.getElementById("global-news-list");
  if (!list) return;

  list.replaceChildren();
  if (!news.length) {
    const emptyState = document.createElement("p");
    emptyState.className =
      "rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500";
    emptyState.textContent = "Chưa có tin tức thị trường mới.";
    list.appendChild(emptyState);
    return;
  }

  news.slice(0, 8).forEach((item) => {
    const card = document.createElement("article");
    card.className =
      "rounded-xl border-l-4 border-rose-500 bg-rose-50/70 px-4 py-3 transition hover:bg-rose-50";

    const age = document.createElement("p");
    age.className = "mb-1 text-[11px] font-medium text-slate-400";
    age.textContent = formatGlobalNewsAge(item.createdAt);

    const content = document.createElement("p");
    content.className = "text-sm font-semibold leading-relaxed text-slate-800";
    content.textContent = item.content;

    card.append(age, content);
    list.appendChild(card);
  });
}

async function loadGlobalNews() {
  try {
    const response = await fetch(`${apiUrl}/news/global-news`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Global news request failed");

    const result = await response.json();
    renderGlobalNews(Array.isArray(result.news) ? result.news : []);

    const updatedLabel = document.getElementById("global-news-updated");
    if (updatedLabel) updatedLabel.textContent = "Cập nhật: vừa xong";
  } catch (error) {
    console.error("Lỗi khi tải tin tức thị trường:", error);
  }
}

loadGlobalNews();
window.setInterval(loadGlobalNews, 5000);

getTopViewedArticles();
getDataNewsHomePage();
getLatestArticles();
