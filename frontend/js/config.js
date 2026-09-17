tailwind.config = {
  theme: {
    extend: {
      colors: {
        gold: {
          400: "#f1c40f",
          500: "#d4af37",
          600: "#b8860b",
          700: "#996515",
        },
        darkBg: "#0f1117",
        darkCard: "#181b24",
        darkBorder: "#272b38",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
};

// const isLocal =
//   window.location.hostname === "localhost" ||
//   window.location.hostname === "127.0.0.1" ||
//   !window.location.hostname;
// const apiHost = isLocal ? "localhost" : 'https://capitalcircle-on-render.onrender.com';
// const apiUrl = `http://${apiHost}:8000/api/v1`;

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  !window.location.hostname;

// Khai báo trọn vẹn URL gốc (Base URL)
const apiBase = isLocal
  ? "http://localhost:8000"
  : "https://capitalcircle-on-render.onrender.com";

// Tái sử dụng để tạo đường dẫn API hoàn chỉnh
const apiUrl = `${apiBase}/api/v1`;

const AUTH_STORAGE_KEY = "authStore";

async function handleLogout(link) {
  try {
    const res = await authFetch(`${apiUrl}/user/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      alert("Capital Circle\n\nĐã đăng xuất tài khoản thất bại.");
      window.location.href = "./auth.html";
      throw new Error("Đăng xuất thất bại");
    }
    if (!link) {
      window.location.href = "./auth.html"; // đổi thành trang bạn muốn chuyển tới sau khi đăng xuất
      alert("Capital Circle\n\nĐã đăng xuất tài khoản quản trị.");
      return;
    }
    alert("Capital Circle\n\nĐã đăng xuất tài khoản quản trị.");
  } catch (error) {
    console.error("Error during logout:", error);
    window.location.href = "./auth.html";
    alert("Capital Circle\n\nĐã đăng xuất tài khoản thất bại.");
  } finally {
    clearAuthStore();
  }
}

/** Đọc lại toàn bộ thông tin đã lưu, trả về null nếu chưa đăng nhập hoặc dữ liệu hỏng */
function getAuthStore() {
  const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Xóa toàn bộ thông tin xác thực -- dùng khi logout */
function clearAuthStore() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

/** Kiểm tra nhanh đã đăng nhập chưa (dùng để ẩn/hiện nút Đăng nhập/Đăng xuất...) */
function isAuthenticated() {
  return !!getAuthStore()?.accessToken;
}

function formatVietnameseDate(timestamp, format = "date") {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return ""; // timestamp không hợp lệ

  const options = {
    date: { dateStyle: "short" },
    datetime: { dateStyle: "short", timeStyle: "short" },
    full: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
  };

  return new Intl.DateTimeFormat("vi-VN", {
    ...options[format],
    timeZone: "Asia/Ho_Chi_Minh", // bắt buộc -- nếu bỏ, giờ sẽ bị lệch theo múi giờ server
  }).format(date);
}

/** Chuyển đổi và format nội dung bài viết HTML an toàn & mượt mà */
function renderNewsHtmlContent(content) {
  if (!content)
    return "<p class='text-slate-400 italic'>Chưa có nội dung bài viết.</p>";
  const hasHtml = /<[a-z][\s\S]*>/i.test(content);
  if (hasHtml) {
    return content;
  }
  return content
    .split(/\n{2,}/)
    .map((p) => `<p class="mb-3">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}
