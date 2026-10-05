function Header() {
  const headerContainer = document.getElementById("header");

  if (headerContainer && !document.querySelector("body > header")) {
    headerContainer.innerHTML = `
        <header
      class="bg-[#0b101d] border-b border-slate-800/80 sticky top-0 z-40 shadow-lg"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Logo & Brand Name -->
          <a href="./index.html" class="flex items-center space-x-3 group">
            <div
              class="w-11 h-11 rounded-full border border-slate-700/80 flex items-center justify-center relative bg-gradient-to-b from-slate-900 to-slate-950 shadow-inner group-hover:border-amber-400/60 transition"
            >
              <svg
                class="w-7 h-7 text-amber-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9.5"
                  stroke="currentColor"
                  stroke-opacity="0.9"
                />
                <path
                  d="M12 2.5 A9.5 9.5 0 0 1 21.5 12"
                  stroke="#d4af37"
                  stroke-width="2"
                />
                <line x1="8" y1="16" x2="16" y2="8" stroke="currentColor" />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="#f1c40f"
                  stroke-width="1.2"
                />
              </svg>
            </div>
            <div>
              <div
                class="text-base sm:text-lg font-extrabold tracking-wider text-white uppercase leading-none flex items-center"
              >
                CAPITAL CIRCLE
              </div>
              <div
                class="text-[9px] tracking-[0.25em] font-medium text-slate-400 uppercase mt-1"
              >
                KIẾN THỨC • TƯ DUY • GIÁ TRỊ DÀI HẠN
              </div>
            </div>
          </a>

          <!-- Navigation Links Desktop -->
          <nav
            class="hidden lg:flex items-center space-x-7 text-sm font-medium"
          >
            <a
              href="./index.html"
              class="text-slate-300 hover:text-white transition"
              >Trang chủ</a
            >
            <a
              href="./articles.html"
              class="text-slate-300 hover:text-white transition"
              >Bài viết</a
            >
            <div class="relative group py-2">
              <a
                href="#market-ticker"
                class="flex items-center space-x-1 text-slate-300 hover:text-white transition focus:outline-none cursor-pointer"
              >
                <span>Thị trường</span>
              </a>

              <!-- Submenu (Hiện ra ngay khi Hover vào thẻ cha) -->
              <div
                class="absolute left-0 top-full w-48 bg-[#0e1626] border border-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2"
              >
                <a
                  href="./articles.html?category=Crypto"
                  class="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >Crypto</a
                >
                <a
                  href="./articles.html?category=Vang"
                  class="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >Vàng</a
                >
                <a
                  href="./articles.html?category=B%E1%BA%A5t%20%C4%91%E1%BB%99ng%20s%E1%BA%A3n"
                  class="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >Bất động sản</a
                >
                <a
                  href="./articles.html?category=Ch%E1%BB%A9ng%20kho%C3%A1n"
                  class="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >Chứng khoán</a
                >
              </div>
            </div>
            <a
              href="./index.html#featured-article"
              class="text-slate-300 hover:text-white transition"
              >Kiến thức</a
            >
            <a
              href="./tools.html"
              class="text-slate-300 hover:text-white transition"
              >Công cụ</a
            >
            <a
              href="./about.html"
              class="text-slate-300 hover:text-white transition"
              >Giới thiệu</a
            >
          </nav>

          <!-- Right Action Buttons -->
          <div class="hidden lg:flex items-center space-x-4">
            <button
              onclick="openSearchModal()"
              class="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
              title="Tìm kiếm"
            >
              <i class="fa-solid fa-magnifying-glass text-xs"></i>
            </button>

            <div id="logBtn" class="flex items-center">
              <a
                href="#support-contact-modal"
                onclick="event.preventDefault(); openSupportContactModal()"
                class="px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-white text-xs font-semibold hover:bg-slate-800 transition"
            >
                Liên hệ hỗ trợ
            </a>
            </div>
          </div>

          <!-- Mobile Hamburger Button -->
          <div class="lg:hidden flex items-center space-x-2">
            <button
              onclick="openSearchModal()"
              class="p-2 text-slate-300 hover:text-white"
            >
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
            <button
              id="mobile-menu-btn"
              class="p-2 rounded-lg text-slate-300 hover:text-white focus:outline-none"
            >
              <i class="fa-solid fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div
        id="mobile-menu"
        class="hidden lg:hidden bg-[#0e1626] border-b border-slate-800 px-5 pt-3 pb-5 space-y-3"
      >
        <a
          href="./index.html"
          class="block py-1 text-sm font-medium text-slate-300 hover:text-white"
          >Trang chủ</a
        >
        <a
          href="./index.html#latest-articles"
          class="block py-1 text-sm font-medium text-slate-300 hover:text-white"
          >Bài viết</a
        >
        <a
          href="./index.html#market-ticker"
          class="block py-1 text-sm font-medium text-slate-300 hover:text-white"
          >Thị trường</a
        >
        <a
          href="./index.html#featured-article"
          class="block py-1 text-sm font-medium text-slate-300 hover:text-white"
          >Kiến thức</a
        >
        <a
          href="./tools.html"
          class="block py-1 text-sm font-medium text-slate-300 hover:text-white"
          >Công cụ</a
        >
        <a
          href="./about.html"
          class="block py-1 text-sm font-semibold text-white"
          >Về Capital Circle</a
        >
        <div id="logBtnMobile" class="pt-2 border-t border-slate-800">
         <a
          href="#support-contact-modal"
          onclick="event.preventDefault(); openSupportContactModal()"
          class="block text-center py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Liên hệ hỗ trợ
        </a>
        </div>
      </div>
    </header>
      `;
  }

  initializeHeaderInteractions();
}

function initializeHeaderInteractions() {
  const mobileMenuButton = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMarketButton = document.getElementById("mobile-market-btn");
  const mobileMarketSubmenu = document.getElementById("mobile-market-submenu");
  const mobileMarketArrow = document.getElementById("mobile-market-arrow");

  mobileMenuButton?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("hidden");
  });

  mobileMarketButton?.addEventListener("click", () => {
    mobileMarketSubmenu?.classList.toggle("hidden");
    mobileMarketArrow?.classList.toggle("rotate-180");
  });
}

// ==================== 4. AUTH & NAVIGATION LOGIC ====================
function checkLogin() {
  const isAuth = typeof getAuthStore === "function" ? getAuthStore() : null;
  const logBtn = document.getElementById("logBtn");
  const logBtnMobile = document.getElementById("logBtnMobile");

  if (!logBtn) return;

  if (!isAuth) {
    logBtn.innerHTML = `
      <a
        href="#support-contact-modal"
        onclick="event.preventDefault(); openSupportContactModal()"
        class="px-5 py-2 rounded-full bg-slate-900 border border-slate-700 text-white text-xs font-semibold hover:bg-slate-800 transition"
      >
        Liên hệ hỗ trợ
      </a>
    `;
    if (logBtnMobile) {
      logBtnMobile.innerHTML = `
        <a
          href="#support-contact-modal"
          onclick="event.preventDefault(); openSupportContactModal()"
          class="block text-center py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Liên hệ hỗ trợ
        </a>
      `;
    }
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

function SupportContactModal() {
  document.getnnerHTML = ``;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div
    id="support-contact-modal"
    class="fixed inset-0 z-[9998] hidden items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="support-contact-title"
  >
    <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <button
        type="button"
        onclick="closeSupportContactModal()"
        class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
        aria-label="Đóng cửa sổ liên hệ"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="pr-8">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
          Capital Circle
        </p>
        <h2
          id="support-contact-title"
          class="mt-2 text-xl font-bold text-slate-900"
        >
          Liên hệ hỗ trợ
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-slate-500">
          Chọn kênh bạn muốn sử dụng để kết nối với chúng tôi.
        </p>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3">
        <a
          href="https://zalo.me/0382813789"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center gap-2 rounded-xl border border-sky-100 bg-sky-50 px-4 py-5 text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
        >
          <span
            class="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-lg font-extrabold text-white"
            >Z</span
          >
          <span class="text-sm font-bold">ZALO</span>
        </a>
        <a
          href="https://t.me/capitalcircletony"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-5 text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
        >
          <span
            class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white"
            ><i class="fa-brands fa-telegram text-2xl"></i
          ></span>
          <span class="text-sm font-bold">TELEGRAM</span>
        </a>
      </div>
    </div>
  </div>
    `,
  );
}

function openSupportContactModal() {
  const modal = document.getElementById("support-contact-modal");
  if (!modal) return;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeSupportContactModal() {
  const modal = document.getElementById("support-contact-modal");
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

document.addEventListener("click", (event) => {
  const modal = document.getElementById("support-contact-modal");
  if (event.target === modal) closeSupportContactModal();
});

function SetupHeader() {
  Header();
  checkLogin();
  SupportContactModal();
}

SetupHeader();
