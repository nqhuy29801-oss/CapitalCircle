// Capital Circle - Article Detail Page Logic

const DEFAULT_FALLBACK_ARTICLES = [
  {
    slug: "ky-luat-la-loi-the-lon-nhat-cua-nha-dau-tu-ca-nhan",
    category: "TƯ DUY ĐẦU TƯ",
    postTitle: "Kỷ luật là lợi thế lớn nhất của nhà đầu tư cá nhân",
    postHeading: "Trong một thế giới đầy biến động, không phải ai dự đoán đúng thị trường mới thành công, mà là người kiên trì với nguyên tắc của mình.",
    postAuthor: "Capital Circle",
    postDate: "07 Tháng 9, 2026",
    readingTime: "8 phút đọc",
    views: 15200,
    postImage: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80",
    postContent: `
      <h2>Kỷ luật: Vũ khí tối thượng của nhà đầu tư nhỏ lẻ</h2>
      <p>Thị trường tài chính luôn tràn ngập những thông tin gây nhiễu, biến động giá chóng mặt và những lời mời chào làm giàu nhanh chóng. Tuy nhiên, qua hàng thế kỷ phát triển của các thị trường từ chứng khoán, vàng đến crypto, một chân lý vẫn luôn đúng:</p>
      <blockquote>"Sự kiên nhẫn và kỷ luật tuân thủ hệ thống đầu tư là thứ tạo nên 90% thành công lâu dài, chứ không phải tài tiên tri hay may mắn nhất thời."</blockquote>
      
      <h3>3 nguyên tắc vàng xây dựng kỷ luật:</h3>
      <ul>
        <li><b>1. Định rõ quy tắc vào lệnh và chốt lời/cắt lỗ:</b> Đừng bao giờ mua một tài sản mà không biết trước mình sẽ làm gì nếu giá giảm 10% hay tăng 50%.</li>
        <li><b>2. Quản trị quy mô vị thế (Position Sizing):</b> Không bao giờ đặt cược quá 5-10% tổng tài sản vào một cơ hội rủi ro cao.</li>
        <li><b>3. Tách biệt cảm xúc khỏi quyết định:</b> Lập kế hoạch khi tâm trí bình tĩnh và thực thi đúng kế hoạch khi thị trường hoảng loạn hoặc hưng phấn cực độ.</li>
      </ul>
      
      <p>Nhà đầu tư cá nhân có một lợi thế khổng lồ so với các quỹ phòng hộ lớn: <i>chúng ta không phải chịu áp lực báo cáo hiệu suất theo từng quý</i>. Chúng ta hoàn toàn có thể kiên nhẫn chờ đợi bóng tròn lăn đúng vùng giá mục tiêu trước khi tung cú swing quyết định.</p>
    `
  },
  {
    slug: "bitcoin-co-the-dat-150000-usd-trong-nam-2026",
    category: "CRYPTO",
    postTitle: "Bitcoin có thể đạt 150,000 USD trong năm 2026?",
    postHeading: "Phân tích chu kỳ halving, dòng vốn từ các quỹ ETF giao ngay và tác động của chính sách tiền tệ toàn cầu đến giá trị Bitcoin.",
    postAuthor: "Ban Phân Tích Capital Circle",
    postDate: "07/09/2026",
    readingTime: "6 phút đọc",
    views: 18450,
    postImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
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
    `
  },
  {
    slug: "nhung-nhom-nganh-dang-chu-y-trong-quy-4-2026",
    category: "CHỨNG KHOÁN",
    postTitle: "Những nhóm ngành đáng chú ý trong quý 4/2026",
    postHeading: "Đánh giá triển vọng các nhóm cổ phiếu công nghệ, ngân hàng và bán lẻ trong giai đoạn phục hồi mạnh mẽ của nền kinh tế.",
    postAuthor: "Chuyên gia Minh Tuấn",
    postDate: "06/09/2026",
    readingTime: "7 phút đọc",
    views: 14200,
    postImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>Tâm điểm đầu tư quý 4/2026</h2>
      <p>Quý cuối năm thường là thời điểm các doanh nghiệp đẩy mạnh doanh thu và hoàn thành kế hoạch lợi nhuận năm. Dưới đây là những nhóm ngành sở hữu câu chuyện tăng trưởng rõ ràng nhất:</p>
      <ul>
        <li><b>Nhóm Ngân hàng:</b> Tăng trưởng tín dụng khả quan kết hợp cùng chi phí vốn giảm giúp biên lãi ròng (NIM) tiếp tục cải thiện.</li>
        <li><b>Nhóm Công nghệ & Bán dẫn:</b> Hưởng lợi lớn từ làn sóng đầu tư vào trí tuệ nhân tạo và chuyển đổi hạ tầng đám mây.</li>
        <li><b>Nhóm Bán lẻ tiêu dùng:</b> Sức mua nội địa phục hồi nhờ các gói kích cầu và mùa mua sắm cuối năm.</li>
      </ul>
    `
  },
  {
    slug: "gia-vang-se-di-ve-dau-khi-fed-ha-lai-suat",
    category: "VÀNG",
    postTitle: "Giá vàng sẽ đi về đâu khi Fed hạ lãi suất?",
    postHeading: "Tương quan giữa lợi suất thực tế, sức mạnh đồng USD và xu hướng tích trữ vàng vật chất của các ngân hàng trung ương.",
    postAuthor: "Capital Circle Research",
    postDate: "05/09/2026",
    readingTime: "5 phút đọc",
    views: 11900,
    postImage: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>Vàng trong chu kỳ cắt giảm lãi suất</h2>
      <p>Lịch sử 50 năm qua cho thấy: mỗi khi Cục Dự trữ Liên bang Mỹ (Fed) bắt đầu chu kỳ nới lỏng tiền tệ, giá vàng thế giới bình quân tăng từ 15% đến 25% trong vòng 12 tháng kế tiếp.</p>
      <blockquote>"Vàng không sinh ra lợi tức hàng năm, nhưng khi lãi suất thực giảm xuống mức âm, chi phí cơ hội nắm giữ vàng gần như bằng không."</blockquote>
    `
  },
  {
    slug: "hanh-trinh-tu-nguoi-moi-den-nha-dau-tu-co-ky-luat",
    category: "TƯ DUY ĐẦU TƯ",
    postTitle: "Hành trình từ người mới đến nhà đầu tư có kỷ luật",
    postHeading: "Những bài học xương máu giúp bạn xây dựng tư duy quản trị tài chính vững vàng, tránh xa bẫy FOMO và thua lỗ.",
    postAuthor: "Hoàng Nam",
    postDate: "04/09/2026",
    readingTime: "6 phút đọc",
    views: 9800,
    postImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>Xây dựng hệ thống đầu tư cho riêng bạn</h2>
      <p>Khác biệt giữa một người đánh bạc và một nhà đầu tư thực thụ nằm ở việc họ có một hệ thống quy tắc rõ ràng và tuân thủ nó một cách máy móc, bất chấp cảm xúc cá nhân.</p>
      <ul>
        <li>Không bao giờ đầu tư vào thứ bạn không hiểu rõ mô hình kinh doanh.</li>
        <li>Luôn duy trì quỹ dự phòng khẩn cấp tối thiểu 6 tháng chi phí sinh hoạt.</li>
        <li>Chấp nhận cắt lỗ sớm khi luận điểm đầu tư ban đầu không còn đúng.</li>
      </ul>
    `
  },
  {
    slug: "quan-tri-rui-ro-bai-hoc-khong-bao-gio-cu",
    category: "KIẾN THỨC",
    postTitle: "Quản trị rủi ro – bài học không bao giờ cũ",
    postHeading: "Tại sao bảo toàn vốn luôn là mục tiêu tối thượng trước khi nghĩ đến việc tìm kiếm lợi nhuận trên thị trường?",
    postAuthor: "Capital Circle",
    postDate: "03/09/2026",
    readingTime: "7 phút đọc",
    views: 13400,
    postImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>Quy tắc số 1: Đừng để mất tiền</h2>
      <p>Nhà đầu tư huyền thoại Warren Buffett từng đưa ra 2 quy tắc vàng: Quy tắc số 1: Không bao giờ để mất tiền. Quy tắc số 2: Không bao giờ quên quy tắc số 1. Khi bạn mất 50% vốn, bạn cần sinh lời 100% chỉ để hòa vốn ban đầu.</p>
    `
  },
  {
    slug: "dau-tu-khong-chi-la-tien-ma-con-la-chinh-minh",
    category: "CUỘC SỐNG",
    postTitle: "Đầu tư không chỉ là tiền, mà còn là chính mình",
    postHeading: "Nâng cao năng lực cá nhân, sức khỏe tinh thần và trải nghiệm sống chính là khoản đầu tư mang lại tỷ suất sinh lời vô hạn.",
    postAuthor: "Đội ngũ Capital Circle",
    postDate: "02/09/2026",
    readingTime: "5 phút đọc",
    views: 16800,
    postImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>Khoản đầu tư tốt nhất bạn từng thực hiện</h2>
      <p>Tiền bạc chỉ là công cụ để phục vụ cuộc sống tự do và an yên. Đừng đánh đổi sức khỏe, các mối quan hệ quý giá hay sự bình an nội tâm chỉ vì những biến động xanh đỏ ngắn hạn trên biểu đồ giá.</p>
    `
  }
];

let currentArticle = null;
let allNewsList = [];

// Get slug from URL params: article.html?slug=...
function getSlugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug") || "ky-luat-la-loi-the-lon-nhat-cua-nha-dau-tu-ca-nhan";
}

async function loadArticleDetail() {
  const slug = getSlugFromUrl();

  try {
    // 1. Fetch single article
    const res = await fetch(`${apiUrl}/news/single-news/${slug}`);
    if (res.ok) {
      const data = await res.json();
      currentArticle = data.newsDetail;
    }
  } catch (err) {
    console.warn("Lỗi khi tải bài viết từ API, dùng dữ liệu dự phòng:", err);
  }

  // Fallback to local dataset if not found via API
  if (!currentArticle) {
    currentArticle = DEFAULT_FALLBACK_ARTICLES.find((a) => a.slug === slug) || DEFAULT_FALLBACK_ARTICLES[0];
  }

  renderArticleContent(currentArticle);

  // 2. Fetch all articles for related news and sidebar
  loadRelatedAndSidebarNews(slug, currentArticle.category);
}

function renderArticleContent(art) {
  if (!art) return;

  // Document Title
  document.title = `${art.postTitle} | Capital Circle`;

  // Breadcrumbs
  const categoryElem = document.getElementById("articleCategoryBreadcrumb");
  const titleBreadcrumb = document.getElementById("articleTitleBreadcrumb");
  if (categoryElem) categoryElem.innerText = art.category || "Kiến thức";
  if (titleBreadcrumb) titleBreadcrumb.innerText = art.postTitle;

  // Category Badge
  const badgeElem = document.getElementById("articleCategoryBadge");
  if (badgeElem) badgeElem.innerText = art.category || "TƯ DUY ĐẦU TƯ";

  // Article Title
  const titleElem = document.getElementById("articleTitle");
  if (titleElem) titleElem.innerText = art.postTitle;

  // Meta Elements
  const authorElem = document.getElementById("articleAuthor");
  const authorAvatar = document.getElementById("articleAuthorAvatar");
  const authorInitials = (art.postAuthor || "Capital Circle").slice(0, 2).toUpperCase();
  if (authorElem) authorElem.innerText = art.postAuthor || "Capital Circle";
  if (authorAvatar) authorAvatar.innerText = authorInitials;

  const dateElem = document.getElementById("articleDate");
  const displayDate = art.postDate || (art.createdAt ? formatVietnameseDate(art.createdAt) : "07/09/2026");
  if (dateElem) dateElem.innerText = displayDate;

  const readTimeElem = document.getElementById("articleReadingTime");
  if (readTimeElem) readTimeElem.innerText = art.readingTime || "7 phút đọc";

  const viewsElem = document.getElementById("articleViews");
  if (viewsElem) {
    const formattedViews = art.views ? Number(art.views).toLocaleString("vi-VN") : "12.5k";
    viewsElem.innerText = `${formattedViews} lượt đọc`;
  }

  // Hero Image
  const imgElem = document.getElementById("articleImage");
  if (imgElem) {
    if (art.postImage) {
      imgElem.src = art.postImage;
      imgElem.alt = art.postTitle;
      imgElem.classList.remove("hidden");
    } else {
      imgElem.classList.add("hidden");
    }
  }

  // Lead / Excerpt Block
  const excerptContainer = document.getElementById("articleExcerptContainer");
  const excerptElem = document.getElementById("articleExcerpt");
  if (art.postHeading && art.postHeading.trim()) {
    if (excerptElem) excerptElem.innerText = art.postHeading;
    if (excerptContainer) excerptContainer.classList.remove("hidden");
  } else {
    if (excerptContainer) excerptContainer.classList.add("hidden");
  }

  // Main Rich Body
  const bodyElem = document.getElementById("articleBody");
  if (bodyElem) {
    bodyElem.innerHTML = renderNewsHtmlContent(art.postContent);
  }

  // Source attribution
  const sourceElem = document.getElementById("articleSourceContainer");
  const sourceLink = document.getElementById("articleSourceLink");
  if (art.postSource && art.postSource.trim()) {
    if (sourceLink) {
      sourceLink.href = art.postSource;
      sourceLink.innerText = art.postSource;
    }
    if (sourceElem) sourceElem.classList.remove("hidden");
  } else {
    if (sourceElem) sourceElem.classList.add("hidden");
  }
}

async function loadRelatedAndSidebarNews(currentSlug, currentCategory) {
  try {
    const res = await fetch(`${apiUrl}/news/all-published-news`);
    if (res.ok) {
      const data = await res.json();
      allNewsList = data.news || [];
    }
  } catch (e) {}

  if (!allNewsList || allNewsList.length === 0) {
    allNewsList = [...DEFAULT_FALLBACK_ARTICLES];
  }

  // Render Related Articles (exclude current article, pick 3)
  const relatedList = allNewsList.filter((a) => a.slug !== currentSlug).slice(0, 3);
  const relatedContainer = document.getElementById("relatedArticlesGrid");
  if (relatedContainer) {
    relatedContainer.innerHTML = relatedList
      .map((item) => {
        const cat = item.category || "TÀI CHÍNH";
        const date = item.postDate || (item.createdAt ? formatVietnameseDate(item.createdAt) : "07/09/2026");
        return `
          <a
            href="./article.html?slug=${item.slug}"
            class="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div class="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src="${item.postImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80'}"
                  alt="${item.postTitle}"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                />
                <div class="absolute bottom-3 left-3">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-slate-950/70 border border-slate-700/60 text-white">
                    ${cat}
                  </span>
                </div>
              </div>
              <div class="p-5">
                <h4 class="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-600 transition leading-snug line-clamp-2">
                  ${item.postTitle}
                </h4>
                <p class="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  ${item.postHeading || ""}
                </p>
              </div>
            </div>
            <div class="px-5 pb-5 pt-0 text-[11px] text-slate-400 flex items-center justify-between font-medium">
              <span><i class="fa-regular fa-calendar me-1"></i> ${date}</span>
              <span class="text-amber-600 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-1">
                Đọc tiếp <i class="fa-solid fa-arrow-right text-[9px]"></i>
              </span>
            </div>
          </a>
        `;
      })
      .join("");
  }

  // Render Sidebar Trending Articles
  const trendingContainer = document.getElementById("sidebarTrendingList");
  if (trendingContainer) {
    const trendingItems = allNewsList.slice(0, 5);
    trendingContainer.innerHTML = trendingItems
      .map((item, idx) => `
        <a
          href="./article.html?slug=${item.slug}"
          class="pt-2 flex items-start space-x-3 group cursor-pointer border-b border-slate-100 last:border-0 pb-2.5"
        >
          <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-white transition">
            ${idx + 1}
          </span>
          <div class="min-w-0">
            <h5 class="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition leading-snug line-clamp-2">
              ${item.postTitle}
            </h5>
            <p class="text-[11px] text-slate-400 mt-0.5">
              ${item.views ? Number(item.views).toLocaleString('vi-VN') + ' lượt đọc' : (12 - idx * 1.5).toFixed(1) + 'k lượt đọc'}
            </p>
          </div>
        </a>
      `)
      .join("");
  }
}

// Reading Scroll Progress Indicator
window.addEventListener("scroll", () => {
  const docElem = document.documentElement;
  const docBody = document.body;
  const scrollTop = docElem.scrollTop || docBody.scrollTop;
  const scrollHeight = (docElem.scrollHeight || docBody.scrollHeight) - docElem.clientHeight;
  const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  const bar = document.getElementById("readingProgressBar");
  if (bar) {
    bar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
  }
});

// Copy Article Link
function copyArticleLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    if (typeof showToast === "function") {
      showToast("Đã sao chép liên kết bài viết vào clipboard!");
    } else {
      alert("Đã sao chép liên kết bài viết!");
    }
  }).catch(() => {
    prompt("Sao chép liên kết:", window.location.href);
  });
}

// Share on Social
function shareOnFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "width=600,height=400");
}

function shareOnTwitter() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, "_blank", "width=600,height=400");
}

function shareOnLinkedIn() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "width=600,height=400");
}

// Initialize on page load
loadArticleDetail();
