/** Gọi API kèm sẵn accessToken -- dùng thay cho fetch() thường ở các route cần đăng nhập */
async function authFetch(url, options = {}) {
  const store = getAuthStore();

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "access-token": store.accessToken,
    },
  });

  if (!res.ok && res.status === 401) {
    const refreshResponse = await fetch(`${apiUrl}/user/refresh-token`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!refreshResponse.ok) {
      // Nếu refresh token cũng lỗi, logout luôn
      handleLogout();
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    const refreshData = await refreshResponse.json();
    setAuthStore({
      accessToken: refreshData.accessToken,
      user: refreshData.user,
    });

    const resp = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "access-token": refreshData.accessToken || "",
      },
    });

    return resp;
  }

  return res;
}
