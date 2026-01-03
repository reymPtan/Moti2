
const API="http://localhost:10000";

function login(){
  fetch(API+"/api/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username:username.value,password:password.value})
  }).then(r=>r.json()).then(d=>{
    if(d.error){alert(d.error);}
    else{
      localStorage.setItem("user",JSON.stringify(d));
      location.href="dashboard.html";
    }
  });
}

function register(){
  fetch(API+"/api/register",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username:username.value,password:password.value})
  }).then(r=>r.json()).then(d=>{
    if(d.error){alert(d.error);}
    else{
      alert("Registered successfully");
      location.href="index.html";
    }
  });
}
