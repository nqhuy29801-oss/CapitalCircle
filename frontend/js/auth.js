// ===== Quản lý sessionStorage tập trung (store xác thực) =====

/** Lưu accessToken, refreshToken và thông tin user vào sessionStorage dưới 1 key duy nhất */
function setAuthStore({ accessToken, user }) {
  sessionStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ accessToken, user }),
  );
}

// ===== Hàm xử lý đăng nhập =====

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Capital Circle\n\nVui lòng nhập đầy đủ email và mật khẩu");
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

    const data = await res.json();
    if (!res.ok) {
      alert(`Capital Circle\n\nSai email hoặc mật khẩu. Vui lòng thử lại.`);
      throw new Error(data.message || "Email hoặc mật khẩu không đúng");
    }

    // Lưu accessToken, refreshToken, user vào sessionStorage
    setAuthStore({
      accessToken: data.accessToken,
      user: data.user,
    });

    alert(
      `Capital Circle\n\nĐăng nhập thành công! Xin chào ${data.user.fullName}`,
    );
    window.location.href = "./admin.html"; // đổi thành trang bạn muốn chuyển tới sau khi đăng nhập
  } catch (error) {
    console.error(error);
    alert(`Capital Circle\n\nSai email hoặc mật khẩu. Vui lòng thử lại.`);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Đăng nhập";
    }
  }
}

async function handleRegister(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const submitBtn = document.getElementById("registerSubmitBtn");
  const payload = {
    fullName: document.getElementById("registerFullName").value.trim(),
    email: document.getElementById("registerEmail").value.trim(),
    age: Number(document.getElementById("registerAge").value),
    gender: document.getElementById("registerGender").value,
    address: document.getElementById("registerAddress").value.trim(),
  };

  if (
    !payload.fullName ||
    !payload.email ||
    !payload.age ||
    !payload.gender ||
    !payload.address
  ) {
    alert("Capital Circle\n\nVui lòng điền đầy đủ thông tin đăng ký.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Đang đăng ký...";

  try {
    const res = await fetch(`${apiUrl}/user/registration-public`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");

    alert(
      `Capital Circle\n\n${data.message || "Đăng ký thành công. Vui lòng kiểm tra email."}`,
    );
    form.reset();
    showLoginForm();
  } catch (error) {
    console.error(error);
    alert(`Capital Circle\n\n${error.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Đăng ký";
  }
}

function showRegisterForm() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.remove("hidden");
  document
    .getElementById("showRegisterBtn")
    .closest("div")
    .classList.add("hidden");
  document.getElementById("registerBackLink").classList.remove("hidden");
  document.getElementById("authTitle").textContent = "Đăng ký";
  document.getElementById("authDescription").textContent =
    "Tạo tài khoản để bắt đầu trải nghiệm";
}

function showLoginForm() {
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("registerBackLink").classList.add("hidden");
  document
    .getElementById("showRegisterBtn")
    .closest("div")
    .classList.remove("hidden");
  document.getElementById("authTitle").textContent = "Đăng nhập";
  document.getElementById("authDescription").textContent =
    "Vui lòng nhập tài khoản quản trị viên để tiếp tục";
}

document.getElementById("loginForm").addEventListener("submit", handleLogin);
document
  .getElementById("registerForm")
  .addEventListener("submit", handleRegister);
document
  .getElementById("showRegisterBtn")
  .addEventListener("click", showRegisterForm);
document
  .getElementById("showLoginBtn")
  .addEventListener("click", showLoginForm);
