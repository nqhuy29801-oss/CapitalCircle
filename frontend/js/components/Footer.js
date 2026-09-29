function Footer() {
  document.getElementById("footer").innerHTML = `
    <footer class="bg-[#070c18] border-t border-slate-800 text-slate-400 py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <!-- Main Footer Row -->
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <!-- Left: Brand Logo & Slogan -->
          <div class="flex items-center space-x-3">
            <div
              class="w-9 h-9 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center text-amber-400 text-sm font-bold"
            >
              CC
            </div>
            <div>
              <div
                class="text-sm font-extrabold tracking-wider text-white uppercase"
              >
                CAPITAL CIRCLE
              </div>
              <div class="text-[9px] tracking-[0.2em] text-slate-500 uppercase">
                KIẾN THỨC • TƯ DUY • GIÁ TRỊ DÀI HẠN
              </div>
            </div>
          </div>

          <!-- Middle: Navigation Links -->
          <div
            class="flex flex-wrap justify-center gap-6 text-xs text-slate-400"
          >
            <a href="./about.html" class="hover:text-white transition"
              >Giới thiệu</a
            >
            <a href="#newsletter-widget" class="hover:text-white transition"
              >Liên hệ</a
            >
            <a href="#about-section" class="hover:text-white transition"
              >Điều khoản</a
            >
            <a href="#about-section" class="hover:text-white transition"
              >Chính sách</a
            >
          </div>

          <!-- Right: Social Media Icons -->
          <div class="flex items-center space-x-4 text-sm text-slate-400">
            <a href="#" class="hover:text-white transition"
              ><i class="fa-brands fa-facebook-f"></i
            ></a>
            <a href="#" class="hover:text-white transition"
              ><i class="fa-brands fa-youtube"></i
            ></a>
            <a href="#" class="hover:text-white transition"
              ><i class="fa-brands fa-tiktok"></i
            ></a>
            <a href="#" class="hover:text-white transition"
              ><i class="fa-brands fa-linkedin-in"></i
            ></a>
          </div>
        </div>

        <!-- Copyright Note -->
        <div
          class="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2"
        >
          <p>© 2026 Capital Circle. All rights reserved.</p>
          <p class="italic">Đầu tư là một hành trình học hỏi không ngừng.</p>
        </div>
      </div>
    </footer>
    `;
}

Footer();
