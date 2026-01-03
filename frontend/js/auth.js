const API = "https://moti2.onrender.com/api";

function register(){
  fetch(API+"/register",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username:regUsername.value,password:regPassword.value})})
  .then(r=>r.json()).then(d=>{
    if(d.error) alert(d.error);
    else location.href="index.html";
  });
}

function login(){
  fetch(API+"/login",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username:username.value,password:password.value})})
  .then(r=>r.json()).then(d=>{
    if(d.error) alert(d.error);
    else{
      localStorage.setItem("userId",d.userId);
      localStorage.setItem("username",d.username);
      location.href="dashboard.html";
    }
  });
}

function requireLogin(){
  if(!localStorage.getItem("userId")) location.href="index.html";
}

function logout(){
  localStorage.clear();
  location.href="index.html";
}
