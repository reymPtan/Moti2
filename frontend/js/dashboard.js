
const user = JSON.parse(localStorage.getItem("user"));
if(!user) location.href="index.html";

document.getElementById("welcome").innerText = "Hello, " + user.username;

function logout(){
  localStorage.removeItem("user");
  location.href="index.html";
}
