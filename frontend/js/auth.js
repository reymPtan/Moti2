const API_URL = "https://moti2.onrender.com";

/* =====================
   REGISTER
===================== */
document.addEventListener("DOMContentLoaded", () => {

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("regUsername").value;
      const password = document.getElementById("regPassword").value;

      try {
        const res = await fetch(`${API_URL}/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (!res.ok) throw data;

        alert("✅ Registered successfully!");
        window.location.href = "login.html";
      } catch (err) {
        alert("❌ " + err.error);
      }
    });
  }

  /* =====================
     LOGIN
  ===================== */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;

      try {
        const res = await fetch(`${API_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (!res.ok) throw data;

        localStorage.setItem("motiUser", JSON.stringify(data));
        window.location.href = "dashboard.html";
      } catch (err) {
        alert("❌ " + err.error);
      }
    });
  }

});
