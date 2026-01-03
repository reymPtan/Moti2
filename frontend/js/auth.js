const API_URL = "https://moti2.onrender.com/api"; 
// ⚠️ SIGURADUHIN TAMA ANG URL NG BACKEND MO

/* =========================
   REGISTER
========================= */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;

    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registered successfully! Please login.");
      window.location.href = "index.html"; // ✅ LOGIN PAGE
    } else {
      alert(data.error || "Registration failed");
    }
  });
}

/* =========================
   LOGIN
========================= */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);

      window.location.href = "dashboard.html"; // ✅ DASHBOARD
    } else {
      alert(data.error || "Login failed");
    }
  });
}

/* =========================
   SESSION GUARD
========================= */
function requireLogin() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    window.location.href = "index.html";
  }
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
