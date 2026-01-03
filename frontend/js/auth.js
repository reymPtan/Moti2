const API = "https://moti2.onrender.com";

document.getElementById("loginForm")?.addEventListener("submit", async e=>{
  e.preventDefault();
  const username = loginUser.value;
  const password = loginPass.value;

  const res = await fetch(`${API}/api/login`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username,password})
  });

  const data = await res.json();
  if(data.userId){
    localStorage.setItem("userId",data.userId);
    location.href="dashboard.html";
  } else alert("Login failed");
});

document.getElementById("registerForm")?.addEventListener("submit", async e=>{
  e.preventDefault();
  const username = regUser.value;
  const password = regPass.value;

  await fetch(`${API}/api/register`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username,password})
  });

  location.href="index.html";
});
