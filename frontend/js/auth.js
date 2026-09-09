// ===== Quản lý localStorage tập trung (store xác thực) =====

/** Lưu accessToken, refreshToken và thông tin user vào localStorage dưới 1 key duy nhất */
function setAuthStore({ accessToken, user }) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ accessToken, user }));
}

// ===== Hàm xử lý đăng nhập =====

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Vui lòng nhập đầy đủ email và mật khẩu");
    return;
  }

  const submitBtn = document.getElementById("loginSubmitBtn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Đang đăng nhập...";
  }

  try {
    const res = await fetch(`${apiUrl}/user/login-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      alert(`Email hoặc mật khẩu không đúng vui lòng đăng nhập lại!`);
      throw new Error(data.message || "Email hoặc mật khẩu không đúng");
    }

    const data = await res.json();

    // Lưu accessToken, refreshToken, user vào localStorage
    setAuthStore({
      accessToken: data.accessToken,
      user: data.user,
    });

    alert(`Đăng nhập thành công! Xin chào ${data.user.fullName}`);
    window.location.href = "./admin.html"; // đổi thành trang bạn muốn chuyển tới sau khi đăng nhập
  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Đăng nhập";
    }
  }
}

document.getElementById("loginForm").addEventListener("submit", handleLogin);
