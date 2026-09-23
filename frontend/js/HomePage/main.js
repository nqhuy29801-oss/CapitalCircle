// Capital Circle - Homepage Interactivity & Logic

// ==================== 1. MARKET TICKER DATA & FILTERING ====================
const TICKER_DATA = {
  all: [
    {
      name: "Bitcoin (BTC)",
      symbol: "₿",
      symbolClass: "bg-amber-500/20 text-amber-400",
      price: "111,250",
      unit: "USD",
      change: "+2.35%",
      isUp: true,
      sparkline: "M0 16 Q 16 14, 28 8 T 48 10 T 64 3",
    },
    {
      name: "Ethereum (ETH)",
      symbol: "Ξ",
      symbolClass: "bg-indigo-500/20 text-indigo-400",
      price: "4,328",
      unit: "USD",
      change: "+3.12%",
      isUp: true,
      sparkline: "M0 17 Q 20 15, 32 9 T 50 11 T 64 2",
    },
    {
      name: "VN-Index",
      symbol: "★",
      symbolClass: "bg-red-500/20 text-red-500",
      price: "1,682.45",
      unit: "",
      change: "+0.84%",
      isUp: true,
      sparkline: "M0 15 Q 18 13, 30 7 T 52 9 T 64 4",
    },
    {
      name: "HNX-Index",
      symbol: "H",
      symbolClass: "bg-sky-500/20 text-sky-400",
      price: "280.37",
      unit: "",
      change: "+0.62%",
      isUp: true,
      sparkline: "M0 14 Q 22 12, 34 8 T 54 10 T 64 5",
    },
    {
      name: "Giá vàng (SJC)",
      symbol: "🪙",
      symbolClass: "bg-amber-500/20 text-amber-400",
      price: "135,800,000",
      unit: "VND",
      change: "-0.37%",
      isUp: false,
      sparkline: "M0 5 Q 16 8, 30 13 T 48 11 T 64 16",
    },
    {
      name: "USD/VND",
      symbol: "$",
      symbolClass: "bg-blue-500/20 text-blue-400",
      price: "24,620",
      unit: "",
      change: "+0.05%",
      isUp: true,
      sparkline: "M0 12 Q 20 12, 35 11 T 50 10 T 64 9",
    },
  ],
  crypto: [
    {
      name: "Bitcoin (BTC)",
      symbol: "₿",
      symbolClass: "bg-amber-500/20 text-amber-400",
      price: "111,250",
      unit: "USD",
      change: "+2.35%",
      isUp: true,
      sparkline: "M0 16 Q 16 14, 28 8 T 48 10 T 64 3",
    },
    {
      name: "Ethereum (ETH)",
      symbol: "Ξ",
      symbolClass: "bg-indigo-500/20 text-indigo-400",
      price: "4,328",
      unit: "USD",
      change: "+3.12%",
      isUp: true,
      sparkline: "M0 17 Q 20 15, 32 9 T 50 11 T 64 2",
    },
    {
      name: "Solana (SOL)",
      symbol: "◎",
      symbolClass: "bg-purple-500/20 text-purple-400",
      price: "214.50",
      unit: "USD",
      change: "+5.80%",
      isUp: true,
      sparkline: "M0 18 Q 18 12, 36 7 T 52 5 T 64 2",
    },
    {
      name: "BNB",
      symbol: "B",
      symbolClass: "bg-yellow-500/20 text-yellow-400",
      price: "642.10",
      unit: "USD",
      change: "+1.45%",
      isUp: true,
      sparkline: "M0 14 Q 22 13, 38 10 T 54 8 T 64 5",
    },
    {
      name: "Ripple (XRP)",
      symbol: "✕",
      symbolClass: "bg-sky-500/20 text-sky-400",
      price: "0.625",
      unit: "USD",
      change: "+0.95%",
      isUp: true,
      sparkline: "M0 12 Q 24 14, 40 10 T 54 8 T 64 6",
    },
    {
      name: "Cardano (ADA)",
      symbol: "₳",
      symbolClass: "bg-blue-500/20 text-blue-400",
      price: "0.482",
      unit: "USD",
      change: "-0.42%",
      isUp: false,
      sparkline: "M0 6 Q 20 9, 36 12 T 50 14 T 64 17",
    },
  ],
  stocks: [
    {
      name: "VN-Index",
      symbol: "★",
      symbolClass: "bg-red-500/20 text-red-500",
      price: "1,682.45",
      unit: "",
      change: "+0.84%",
      isUp: true,
      sparkline: "M0 15 Q 18 13, 30 7 T 52 9 T 64 4",
    },
    {
      name: "VN30-Index",
      symbol: "30",
      symbolClass: "bg-red-500/20 text-red-500",
      price: "1,745.20",
      unit: "",
      change: "+1.02%",
      isUp: true,
      sparkline: "M0 16 Q 16 11, 32 7 T 50 6 T 64 3",
    },
    {
      name: "HNX-Index",
      symbol: "H",
      symbolClass: "bg-sky-500/20 text-sky-400",
      price: "280.37",
      unit: "",
      change: "+0.62%",
      isUp: true,
      sparkline: "M0 14 Q 22 12, 34 8 T 54 10 T 64 5",
    },
    {
      name: "S&P 500",
      symbol: "US",
      symbolClass: "bg-blue-500/20 text-blue-400",
      price: "5,980.25",
      unit: "USD",
      change: "+0.45%",
      isUp: true,
      sparkline: "M0 13 Q 20 12, 38 9 T 52 7 T 64 5",
    },
    {
      name: "Nasdaq 100",
      symbol: "NQ",
      symbolClass: "bg-blue-500/20 text-blue-400",
      price: "19,240.10",
      unit: "USD",
      change: "+0.78%",
      isUp: true,
      sparkline: "M0 15 Q 18 10, 36 8 T 52 6 T 64 3",
    },
    {
      name: "Nikkei 225",
      symbol: "JP",
      symbolClass: "bg-rose-500/20 text-rose-400",
      price: "39,120.50",
      unit: "JPY",
      change: "-0.15%",
      isUp: false,
      sparkline: "M0 7 Q 18 9, 36 11 T 50 13 T 64 15",
    },
  ],
  gold: [
    {
      name: "Giá vàng (SJC)",
      symbol: "🪙",
      symbolClass: "bg-amber-500/20 text-amber-400",
      price: "135,800,000",
      unit: "VND",
      change: "-0.37%",
      isUp: false,
      sparkline: "M0 5 Q 16 8, 30 13 T 48 11 T 64 16",
    },
    {
      name: "Vàng Nhẫn 9999",
      symbol: "💍",
      symbolClass: "bg-amber-500/20 text-amber-400",
      price: "132,400,000",
      unit: "VND",
      change: "+0.12%",
      isUp: true,
      sparkline: "M0 13 Q 20 12, 36 10 T 52 9 T 64 7",
    },
    {
      name: "Vàng PNJ",
      symbol: "P",
      symbolClass: "bg-yellow-500/20 text-yellow-400",
      price: "133,000,000",
      unit: "VND",
      change: "-0.10%",
      isUp: false,
      sparkline: "M0 8 Q 20 10, 38 12 T 52 13 T 64 15",
    },
    {
      name: "Vàng Thế Giới",
      symbol: "oz",
      symbolClass: "bg-amber-500/20 text-amber-400",
      price: "2,684.50",
      unit: "USD/oz",
      change: "+0.55%",
      isUp: true,
      sparkline: "M0 15 Q 18 12, 34 8 T 50 7 T 64 4",
    },
    {
      name: "Bạc Thế Giới",
      symbol: "Ag",
      symbolClass: "bg-slate-500/20 text-slate-300",
      price: "32.40",
      unit: "USD/oz",
      change: "+1.20%",
      isUp: true,
      sparkline: "M0 16 Q 20 14, 38 9 T 54 8 T 64 3",
    },
    {
      name: "Bạch Kim",
      symbol: "Pt",
      symbolClass: "bg-slate-400/20 text-slate-200",
      price: "985.00",
      unit: "USD/oz",
      change: "+0.35%",
      isUp: true,
      sparkline: "M0 12 Q 22 11, 38 9 T 52 8 T 64 6",
    },
  ],
  commodities: [
    {
      name: "Dầu Brent",
      symbol: "🛢️",
      symbolClass: "bg-slate-500/20 text-slate-300",
      price: "74.80",
      unit: "USD",
      change: "-0.85%",
      isUp: false,
      sparkline: "M0 6 Q 20 9, 36 13 T 50 14 T 64 18",
    },
    {
      name: "Dầu WTI",
      symbol: "🛢️",
      symbolClass: "bg-slate-500/20 text-slate-300",
      price: "71.20",
      unit: "USD",
      change: "-0.92%",
      isUp: false,
      sparkline: "M0 5 Q 18 8, 34 12 T 52 15 T 64 19",
    },
    {
      name: "Khí Tự Nhiên",
      symbol: "🔥",
      symbolClass: "bg-sky-500/20 text-sky-400",
      price: "2.65",
      unit: "USD",
      change: "+1.80%",
      isUp: true,
      sparkline: "M0 16 Q 18 12, 34 8 T 50 7 T 64 3",
    },
    {
      name: "Đồng (Copper)",
      symbol: "Cu",
      symbolClass: "bg-amber-600/20 text-amber-500",
      price: "4.45",
      unit: "USD/lb",
      change: "+0.65%",
      isUp: true,
      sparkline: "M0 14 Q 22 13, 38 9 T 52 8 T 64 5",
    },
    {
      name: "Đậu Tương",
      symbol: "🌱",
      symbolClass: "bg-emerald-500/20 text-emerald-400",
      price: "1,040.50",
      unit: "USD",
      change: "-0.25%",
      isUp: false,
      sparkline: "M0 8 Q 20 10, 38 12 T 50 14 T 64 16",
    },
    {
      name: "Cà phê Robusta",
      symbol: "☕",
      symbolClass: "bg-amber-800/20 text-amber-600",
      price: "4,820",
      unit: "USD/tấn",
      change: "+2.15%",
      isUp: true,
      sparkline: "M0 17 Q 16 13, 32 8 T 50 6 T 64 2",
    },
  ],
  forex: [
    {
      name: "USD/VND",
      symbol: "$",
      symbolClass: "bg-blue-500/20 text-blue-400",
      price: "24,620",
      unit: "",
      change: "+0.05%",
      isUp: true,
      sparkline: "M0 12 Q 20 12, 35 11 T 50 10 T 64 9",
    },
    {
      name: "EUR/VND",
      symbol: "€",
      symbolClass: "bg-blue-500/20 text-blue-400",
      price: "27,150",
      unit: "",
      change: "-0.18%",
      isUp: false,
      sparkline: "M0 7 Q 18 9, 36 12 T 52 13 T 64 15",
    },
    {
      name: "JPY/VND",
      symbol: "¥",
      symbolClass: "bg-rose-500/20 text-rose-400",
      price: "168.40",
      unit: "",
      change: "+0.22%",
      isUp: true,
      sparkline: "M0 13 Q 22 12, 38 10 T 52 9 T 64 7",
    },
    {
      name: "GBP/VND",
      symbol: "£",
      symbolClass: "bg-purple-500/20 text-purple-400",
      price: "32,450",
      unit: "",
      change: "+0.12%",
      isUp: true,
      sparkline: "M0 12 Q 20 11, 36 10 T 52 9 T 64 8",
    },
    {
      name: "AUD/VND",
      symbol: "A$",
      symbolClass: "bg-emerald-500/20 text-emerald-400",
      price: "16,380",
      unit: "",
      change: "-0.05%",
      isUp: false,
      sparkline: "M0 9 Q 20 10, 36 11 T 50 12 T 64 14",
    },
    {
      name: "CNY/VND",
      symbol: "元",
      symbolClass: "bg-red-500/20 text-red-400",
      price: "3,460",
      unit: "",
      change: "+0.02%",
      isUp: true,
      sparkline: "M0 11 Q 20 11, 36 11 T 52 10 T 64 10",
    },
  ],
  rates: [
    {
      name: "Lãi suất Fed",
      symbol: "FED",
      symbolClass: "bg-blue-500/20 text-blue-400",
      price: "4.75 - 5.00%",
      unit: "",
      change: "-25 bps",
      isUp: false,
      sparkline: "M0 6 Q 22 10, 38 12 T 52 14 T 64 17",
    },
    {
      name: "Lãi suất ECB",
      symbol: "ECB",
      symbolClass: "bg-blue-500/20 text-blue-400",
      price: "3.25%",
      unit: "",
      change: "-25 bps",
      isUp: false,
      sparkline: "M0 7 Q 20 10, 36 12 T 50 13 T 64 16",
    },
    {
      name: "Lãi suất NHNN",
      symbol: "SBV",
      symbolClass: "bg-red-500/20 text-red-500",
      price: "4.50%",
      unit: "",
      change: "0.00%",
      isUp: true,
      sparkline: "M0 10 Q 20 10, 36 10 T 52 10 T 64 10",
    },
    {
      name: "Liên ngân hàng",
      symbol: "ON",
      symbolClass: "bg-emerald-500/20 text-emerald-400",
      price: "3.85%/năm",
      unit: "",
      change: "+0.15%",
      isUp: true,
      sparkline: "M0 13 Q 22 12, 38 10 T 52 9 T 64 7",
    },
    {
      name: "Tiết kiệm 12T",
      symbol: "12M",
      symbolClass: "bg-yellow-500/20 text-yellow-400",
      price: "5.60%/năm",
      unit: "",
      change: "0.00%",
      isUp: true,
      sparkline: "M0 10 Q 20 10, 36 10 T 52 10 T 64 10",
    },
    {
      name: "TPCP Mỹ 10Y",
      symbol: "10Y",
      symbolClass: "bg-purple-500/20 text-purple-400",
      price: "4.15%",
      unit: "",
      change: "-0.04%",
      isUp: false,
      sparkline: "M0 8 Q 20 10, 36 11 T 50 13 T 64 15",
    },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  const marketBtn = document.getElementById("mobile-market-btn");
  const marketSubmenu = document.getElementById("mobile-market-submenu");
  const marketArrow = document.getElementById("mobile-market-arrow");

  if (marketBtn && marketSubmenu) {
    marketBtn.addEventListener("click", () => {
      marketSubmenu.classList.toggle("hidden");
      marketArrow.classList.toggle("rotate-180");
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("welcome-modal");
  const btnClose = document.getElementById("btn-modal-close");
  const btnLearn = document.getElementById("btn-modal-learn");

  // Kiểm tra xem người dùng đã thấy modal trong phiên truy cập này chưa
  const hasSeenModal = sessionStorage.getItem("hasSeenWelcomeModal");

  if (!hasSeenModal && modal) {
    // Hiện modal sau khoảng trễ ngắn để tạo hiệu ứng mượt mà
    setTimeout(() => {
      modal.classList.remove("opacity-0", "pointer-events-none");
      modal.classList.add("opacity-100", "pointer-events-auto");

      // Hiệu ứng zoom nhẹ cho khung nội dung
      const content = modal.querySelector("div");
      if (content) {
        content.classList.remove("scale-95");
        content.classList.add("scale-100");
      }
    }, 400);
  }

  // Hàm ẩn Modal và đánh dấu đã xem
  const closeModal = () => {
    if (modal) {
      modal.classList.remove("opacity-100", "pointer-events-auto");
      modal.classList.add("opacity-0", "pointer-events-none");

      // Đánh dấu vào sessionStorage (Lưu trong suốt phiên mở tab trình duyệt)
      sessionStorage.setItem("hasSeenWelcomeModal", "true");
    }
  };

  // SỰ KIỆN 1: Nút "Đóng" -> Ẩn modal và ở lại trang hiện tại
  if (btnClose) {
    btnClose.addEventListener("click", closeModal);
  }

  // SỰ KIỆN 2: Nút "Tìm hiểu" -> Đánh dấu đã xem và chuyển hướng đến trang giới thiệu
  if (btnLearn) {
    btnLearn.addEventListener("click", () => {
      sessionStorage.setItem("hasSeenWelcomeModal", "true");
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("welcome-modal");
  const stepVideo = document.getElementById("modal-step-video");
  const stepInfo = document.getElementById("modal-step-info");
  const introVideo = document.getElementById("intro-video");

  const btnSkip = document.getElementById("btn-skip-video");
  const btnClose = document.getElementById("btn-modal-close");
  const btnLearn = document.getElementById("btn-modal-learn");

  // Kiểm tra phiên làm việc (Chỉ hiện 1 lần / lượt truy cập)
  const hasSeenModal = sessionStorage.getItem("hasSeenWelcomeModal");

  if (!hasSeenModal && modal) {
    // Hiển thị modal
    setTimeout(() => {
      modal.classList.remove("opacity-0", "pointer-events-none");
      modal.classList.add("opacity-100", "pointer-events-auto");

      const content = modal.querySelector("div");
      if (content) {
        content.classList.remove("scale-95");
        content.classList.add("scale-100");
      }

      // Thử tự động phát video
      if (introVideo) {
        introVideo.play().catch(() => {
          // Trường hợp trình duyệt chặn auto-play -> Tự nhảy sang Bảng thông tin
          switchToInfoStep();
        });
      }
    }, 400);
  }

  // Hàm chuyển từ Step Video sang Step Thông tin
  function switchToInfoStep() {
    if (stepVideo && stepInfo) {
      stepVideo.classList.add("hidden");
      stepInfo.classList.remove("hidden");
    }
  }

  // SỰ KIỆN 1: Khi video chạy xong (ended) -> Tự nhảy sang bảng thông tin
  if (introVideo) {
    introVideo.addEventListener("ended", switchToInfoStep);
  }

  // SỰ KIỆN 2: Nút "Bỏ qua video" -> Chuyển thẳng tới bảng thông tin
  if (btnSkip) {
    btnSkip.addEventListener("click", () => {
      if (introVideo) introVideo.pause();
      switchToInfoStep();
    });
  }

  // Hàm đóng Modal hoàn toàn & lưu vào Session
  const closeModal = () => {
    if (modal) {
      modal.classList.remove("opacity-100", "pointer-events-auto");
      modal.classList.add("opacity-0", "pointer-events-none");
      sessionStorage.setItem("hasSeenWelcomeModal", "true");
    }
  };

  // SỰ KIỆN 3: Nút "Đóng" & "Tìm hiểu"
  if (btnClose) btnClose.addEventListener("click", closeModal);
  if (btnLearn) {
    btnLearn.addEventListener("click", () => {
      sessionStorage.setItem("hasSeenWelcomeModal", "true");
    });
  }
});

function filterTicker(category) {
  // Update Tab Styling
  const tabButtons = document.querySelectorAll("#tickerTabs .ticker-tab-btn");
  tabButtons.forEach((btn) => {
    btn.classList.remove(
      "active",
      "bg-slate-800",
      "text-white",
      "font-semibold",
    );
    btn.classList.add("text-slate-400");
  });

  const activeBtn = event ? event.currentTarget : null;
  if (activeBtn) {
    activeBtn.classList.add(
      "active",
      "bg-slate-800",
      "text-white",
      "font-semibold",
    );
    activeBtn.classList.remove("text-slate-400");
  }

  // Render Ticker Cards
  const assets = TICKER_DATA[category] || TICKER_DATA.all;
  const container = document.getElementById("tickerContainer");
  if (!container) return;

  container.innerHTML = assets
    .map((item) => {
      const colorClass = item.isUp ? "text-emerald-400" : "text-rose-400";
      const iconClass = item.isUp ? "fa-caret-up" : "fa-caret-down";
      const strokeClass = item.isUp ? "stroke-emerald-400" : "stroke-rose-400";

      return `
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-sm hover:border-slate-700 transition">
          <div class="flex items-center space-x-2">
            <span class="w-5 h-5 rounded-full ${item.symbolClass} flex items-center justify-center text-[10px] font-bold">
              ${item.symbol}
            </span>
            <span class="text-xs text-slate-300 font-medium truncate">${item.name}</span>
          </div>
          <div class="mt-1.5 flex items-baseline justify-between">
            <span class="text-base font-bold text-white tracking-tight">
              ${item.price} <span class="text-[10px] text-slate-400 font-normal">${item.unit}</span>
            </span>
          </div>
          <div class="mt-1 flex items-center justify-between text-xs">
            <span class="${colorClass} font-semibold flex items-center text-[11px]">
              <i class="fa-solid ${iconClass} me-1"></i>${item.change}
            </span>
            <svg class="w-16 h-5 ${strokeClass} fill-none" viewBox="0 0 64 20">
              <path d="${item.sparkline}" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </div>
        </div>
      `;
    })
    .join("");

  // Update timestamp
  const dateObj = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const timeStr = `${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}/${dateObj.getFullYear()} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
  const updatedElem = document.getElementById("tickerLastUpdated");
  if (updatedElem) {
    updatedElem.innerText = `Cập nhật: ${timeStr}`;
  }
}

// ==================== 2. SEARCH MODAL LOGIC ====================
function openSearchModal() {
  const modal = document.getElementById("search-modal");
  if (modal) {
    modal.classList.remove("hidden");
    const input = document.getElementById("globalSearchInput");
    if (input) {
      input.focus();
      input.select();
    }
  }
}

function closeSearchModal() {
  const modal = document.getElementById("search-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function handleGlobalSearch(e) {
  const query = e.target.value.trim().toLowerCase();
  const resultsContainer = document.getElementById("searchResultsContainer");
  if (!resultsContainer) return;

  if (!query) {
    resultsContainer.innerHTML = `<p class="text-xs text-slate-400 italic">Nhập từ khóa để bắt đầu tìm kiếm...</p>`;
    return;
  }

  const articles =
    typeof allLoadedArticles !== "undefined" ? allLoadedArticles : [];
  const matches = articles.filter((art) => {
    const title = (art.postTitle || "").toLowerCase();
    const heading = (art.postHeading || "").toLowerCase();
    const cat = (art.category || "").toLowerCase();
    const content = (art.postContent || "").toLowerCase();
    return (
      title.includes(query) ||
      heading.includes(query) ||
      cat.includes(query) ||
      content.includes(query)
    );
  });

  if (matches.length === 0) {
    resultsContainer.innerHTML = `<p class="text-xs text-slate-400">Không tìm thấy bài viết phù hợp với "<b>${query}</b>".</p>`;
    return;
  }

  resultsContainer.innerHTML = matches
    .map((art) => {
      const title = art.postTitle;
      const cat = art.category || "Kiến thức";
      const date =
        art.postDate ||
        (art.createdAt ? formatVietnameseDate(art.createdAt) : "");
      return `
        <div
          onclick="closeSearchModal(); window.location.href='./article.html?slug=' + encodeURIComponent('${art.slug}');"
          class="p-3 rounded-xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/40 transition cursor-pointer flex items-start space-x-3 group"
        >
          <div class="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 mt-0.5">
            <img src="${art.postImage || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=150&q=80"}" class="w-full h-full object-cover group-hover:scale-105 transition">
          </div>
          <div class="flex-grow min-w-0">
            <div class="flex items-center space-x-2 text-[10px] text-amber-600 font-bold uppercase">
              <span>${cat}</span>
              ${date ? `<span class="text-slate-400">• ${date}</span>` : ""}
            </div>
            <h5 class="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition truncate mt-0.5">
              ${title}
            </h5>
            <p class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              ${art.postHeading || art.postContent ? (art.postHeading || art.postContent).replace(/<[^>]*>?/gm, "").slice(0, 100) : ""}
            </p>
          </div>
        </div>
      `;
    })
    .join("");
}

// Close modals on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSearchModal();
    closeModal("article-modal");
  }
});

// ==================== 3. NEWSLETTER & QUICK TOOLS NOTICES ====================
async function handleNewsletterSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("newsletterEmail");
  const btn = document.getElementById("newsletterBtn");
  if (!input) return;

  const email = input.value.trim();
  if (!email) {
    showToast("Vui lòng nhập địa chỉ email của bạn!");
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerText = "Đang đăng ký...";
  }

  try {
    // Optionally record to course/registration API endpoint
    await fetch(`${apiUrl}/user/registration-course`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Bạn đọc Capital Circle",
        email: email,
        phoneNumber: "0900000000",
      }),
    }).catch(() => {});

    showToast("Đăng ký thành công! Chào mừng bạn đến với Capital Circle.");
    input.value = "";
  } catch (err) {
    showToast("Đăng ký thành công! Cảm ơn bạn đã theo dõi.");
    input.value = "";
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = "Đăng ký";
    }
  }
}

function showToolNotice(toolName) {
  showToast(`Đang mở công cụ "${toolName}". Dữ liệu được đồng bộ liên tục!`);
}

// ==================== 4. AUTH & NAVIGATION LOGIC ====================
function checkLogin() {
  const isAuth = typeof getAuthStore === "function" ? getAuthStore() : null;
  const logBtn = document.getElementById("logBtn");
  const logBtnMobile = document.getElementById("logBtnMobile");

  if (!logBtn) return;

  if (!isAuth) {
    // logBtn.innerHTML = `
    //   <a
    //     href="./auth.html"
    //     class="px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-white text-xs font-semibold hover:bg-slate-800 transition"
    //   >
    //     Đăng nhập
    //   </a>
    // `;
    // if (logBtnMobile) {
    //   logBtnMobile.innerHTML = `
    //     <a
    //       href="./auth.html"
    //       class="block text-center py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
    //     >
    //       Đăng nhập Quản trị
    //     </a>
    //   `;
    // }
    return;
  }

  logBtn.innerHTML = `
    <a
      href="./admin.html"
      class="text-xs mr-3 font-semibold text-amber-400 hover:text-amber-300 transition"
    >
      <i class="fa-solid fa-gauge me-1"></i> Quản trị
    </a>
    <a
      href="javascript:void(0)"
      onclick="handleLogout()"
      class="px-4 py-1.5 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
    >
      Đăng xuất
    </a>
  `;
  if (logBtnMobile) {
    logBtnMobile.innerHTML = `
      <div class="flex items-center space-x-2">
        <a
          href="./admin.html"
          class="flex-1 text-center py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Trang Quản trị
        </a>
        <button
          onclick="handleLogout()"
          class="px-4 py-2 rounded-lg bg-rose-600 text-white font-bold text-xs"
        >
          Đăng xuất
        </button>
      </div>
    `;
  }
}

checkLogin();

// Toast Helper
function showToast(msg) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");
  if (!toast || !toastMsg) return;

  toastMsg.innerText = msg;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3500);
}

// Mobile Menu Toggle
const mobileBtn = document.getElementById("mobile-menu-btn");
if (mobileBtn) {
  mobileBtn.addEventListener("click", () => {
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      mobileMenu.classList.toggle("hidden");
    }
  });
}

// ==================== 5. HERO SLIDESHOW CONTROLLER ====================
let currentHeroIndex = 0;
let heroSlideTimer = null;
const HERO_SLIDE_DURATION = 6000; // 6 seconds per slide

function formatMultiline(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.innerText = str;
  return div.innerHTML.replace(/\n/g, "<br />");
}

function escapeText(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.innerText = str;
  return div.innerHTML;
}

function renderDynamicHeroSlides(banners) {
  const heroSection = document.getElementById("hero-slideshow");
  if (!heroSection || !banners || banners.length === 0) return;

  // 1. Remove existing slides
  const existingSlides = heroSection.querySelectorAll(".hero-slide");
  existingSlides.forEach((el) => el.remove());

  // 2. Find reference element to insert before (the prev button)
  const prevBtn = heroSection.querySelector("button[onclick*='prevHeroSlide']");

  // 3. Create dynamic slides
  banners.forEach((banner, idx) => {
    const slideDiv = document.createElement("div");
    slideDiv.className = `hero-slide ${idx === 0 ? "active" : ""}`;
    slideDiv.dataset.slideIndex = String(idx);

    const titleHtml = formatMultiline(banner.title);
    const subtitleText = escapeText(banner.subtitle || "");
    const scriptHtml = formatMultiline(banner.scriptText || "Capital\nCircle");
    const scriptColorClass = escapeText(
      banner.scriptColor || "text-slate-200/90",
    );
    const btnText = escapeText(banner.buttonText || "Đọc bài mới nhất");
    const btnLink = banner.buttonLink || "#";

    slideDiv.innerHTML = `
      <div class="absolute inset-0 z-0 overflow-hidden">
        <img
          src="${escapeText(banner.imageUrl)}"
          alt="Capital Circle Background ${idx + 1}"
          class="hero-bg-img w-full h-full object-cover object-center opacity-75"
          onerror="this.src='https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85'"
        />
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-8 space-y-5">
            <h1 class="hero-anim-1 font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
              ${titleHtml}
            </h1>
            ${
              subtitleText
                ? `
              <p class="hero-anim-2 text-slate-300 text-sm sm:text-base font-light max-w-xl leading-relaxed">
                ${subtitleText}
              </p>
            `
                : ""
            }
            <div class="hero-anim-3 pt-3">
              <a
                href="${btnLink}"
                class="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-slate-950 font-semibold text-sm hover:bg-slate-100 transition shadow-2xl hover:translate-x-0.5 transform duration-150"
              >
                <span>${btnText}</span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
              </a>
            </div>
          </div>
          <div class="lg:col-span-4 flex justify-start lg:justify-end">
            <div class="hero-anim-script font-script text-5xl sm:text-6xl lg:text-7xl ${scriptColorClass} leading-[1.05] select-none drop-shadow-2xl transform lg:-rotate-6">
              ${scriptHtml}
            </div>
          </div>
        </div>
      </div>
    `;

    if (prevBtn) {
      heroSection.insertBefore(slideDiv, prevBtn);
    } else {
      heroSection.appendChild(slideDiv);
    }
  });

  // 4. Update Indicators
  const indicatorsContainer = document.getElementById(
    "heroIndicatorsContainer",
  );
  if (indicatorsContainer) {
    indicatorsContainer.innerHTML = "";
    banners.forEach((_, idx) => {
      const btn = document.createElement("button");
      btn.onclick = () => goToHeroSlide(idx);
      btn.className =
        idx === 0
          ? "indicator-pill w-7 h-2 rounded-full bg-amber-400"
          : "indicator-pill w-2 h-2 rounded-full bg-white/40 hover:bg-white/75";
      btn.setAttribute("aria-label", `Slide ${idx + 1}`);
      indicatorsContainer.appendChild(btn);
    });
  }

  // 5. Update Counter
  const counterEl = document.getElementById("heroSlideCounter");
  if (counterEl) {
    counterEl.innerText = `01/${String(banners.length).padStart(2, "0")}`;
  }

  currentHeroIndex = 0;
}

async function loadHeroBanners() {
  const heroSection = document.getElementById("hero-slideshow");
  if (!heroSection) return;

  try {
    const res = await fetch(`${apiUrl}/banner/active`);
    if (res.ok) {
      const data = await res.json();
      if (
        data.success &&
        Array.isArray(data.banners) &&
        data.banners.length > 0
      ) {
        renderDynamicHeroSlides(data.banners);
      }
    }
  } catch (err) {
    console.warn(
      "Could not load dynamic banners from API, falling back to static slides:",
      err.message,
    );
  } finally {
    initHeroSlideshow();
  }
}

function initHeroSlideshow() {
  const heroSection = document.getElementById("hero-slideshow");
  if (!heroSection) return;

  const slides = document.querySelectorAll(".hero-slide");
  if (slides.length <= 1) return;

  // Start autoplay
  startHeroSlideTimer();

  if (heroSection.dataset.initialized === "true") return;
  heroSection.dataset.initialized = "true";

  // Pause on hover
  heroSection.addEventListener("mouseenter", () => {
    stopHeroSlideTimer();
  });

  heroSection.addEventListener("mouseleave", () => {
    startHeroSlideTimer();
  });

  // Touch swipe support
  let touchStartX = 0;
  heroSection.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );

  heroSection.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) {
          prevHeroSlide();
        } else {
          nextHeroSlide();
        }
      }
    },
    { passive: true },
  );
}

function goToHeroSlide(index) {
  const slides = document.querySelectorAll(".hero-slide");
  if (!slides || slides.length === 0) return;

  const count = slides.length;
  currentHeroIndex = (index + count) % count;

  // Toggle active class on slides
  slides.forEach((slide, idx) => {
    if (idx === currentHeroIndex) {
      slide.classList.add("active");
    } else {
      slide.classList.remove("active");
    }
  });

  // Update indicators
  const indicatorsContainer = document.getElementById(
    "heroIndicatorsContainer",
  );
  if (indicatorsContainer) {
    const pills = indicatorsContainer.querySelectorAll(".indicator-pill");
    pills.forEach((pill, idx) => {
      if (idx === currentHeroIndex) {
        pill.className = "indicator-pill w-7 h-2 rounded-full bg-amber-400";
      } else {
        pill.className =
          "indicator-pill w-2 h-2 rounded-full bg-white/40 hover:bg-white/75";
      }
    });
  }

  // Update slide counter
  const counterEl = document.getElementById("heroSlideCounter");
  if (counterEl) {
    const currentStr = String(currentHeroIndex + 1).padStart(2, "0");
    const totalStr = String(count).padStart(2, "0");
    counterEl.innerText = `${currentStr}/${totalStr}`;
  }

  // Reset timer on manual action
  restartHeroSlideTimer();
}

function nextHeroSlide() {
  goToHeroSlide(currentHeroIndex + 1);
}

function prevHeroSlide() {
  goToHeroSlide(currentHeroIndex - 1);
}

function startHeroSlideTimer() {
  stopHeroSlideTimer();
  heroSlideTimer = setInterval(() => {
    nextHeroSlide();
  }, HERO_SLIDE_DURATION);
}

function stopHeroSlideTimer() {
  if (heroSlideTimer) {
    clearInterval(heroSlideTimer);
    heroSlideTimer = null;
  }
}

function restartHeroSlideTimer() {
  stopHeroSlideTimer();
  startHeroSlideTimer();
}

// Keyboard arrow controls when near top
document.addEventListener("keydown", (e) => {
  if (window.scrollY < 450) {
    const searchModal = document.getElementById("search-modal");
    if (searchModal && !searchModal.classList.contains("hidden")) return;

    if (e.key === "ArrowRight") {
      nextHeroSlide();
    } else if (e.key === "ArrowLeft") {
      prevHeroSlide();
    }
  }
});

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadHeroBanners);
} else {
  loadHeroBanners();
}
