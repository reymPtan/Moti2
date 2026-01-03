const API_URL = "https://moti2.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     REGISTER
  ====================== */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("regUsername").value.trim();
      const password = document.getElementById("regPassword").value.trim();

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
        alert("❌ " + (err.error || "Registration failed"));
      }
    });
  }

  /* ======================
     LOGIN
  ====================== */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

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

        // save session
        localStorage.setItem("motiUser", JSON.stringify(data));

        window.location.href = "dashboard.html";

      } catch (err) {
        alert("❌ " + (err.error || "Login failed"));
      }
    });
  }

});
