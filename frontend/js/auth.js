const API_URL = "https://moti2.onrender.com/api";

/* ======================
   REGISTER
====================== */
function register() {
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;

  fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      alert(data.error);
    } else {
      alert("Registered successfully!");
      window.location.href = "index.html";
    }
  });
}

/* ======================
   LOGIN
====================== */
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      alert(data.error);
    } else {
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);
      window.location.href = "dashboard.html";
    }
  });
}

/* ======================
   SESSION GUARD
====================== */
function requireLogin() {
  if (!localStorage.getItem("userId")) {
    window.location.href = "index.html";
  }
}

/* ======================
   LOGOUT
====================== */
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
