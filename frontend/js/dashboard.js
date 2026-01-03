const API = "https://moti2.onrender.com"; // palitan kung iba URL mo
const userId = localStorage.getItem("userId");

if (!userId) {
  location.href = "index.html";
}

/* ===== LOGOUT ===== */
function logout() {
  localStorage.clear();
  location.href = "index.html";
}

/* ===== NOTES ===== */
function addNote() {
  const content = document.getElementById("noteInput").value;
  if (!content) return;

  fetch(`${API}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, content })
  }).then(() => {
    document.getElementById("noteInput").value = "";
    loadNotes();
  });
}

function loadNotes() {
  fetch(`${API}/api/notes/${userId}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("notesList");
      list.innerHTML = "";
      data.forEach(note => {
        const li = document.createElement("li");
        li.textContent = note.content;
        list.appendChild(li);
      });
    });
}

/* ===== HABITS ===== */
function addHabit() {
  const title = document.getElementById("habitInput").value;
  if (!title) return;

  fetch(`${API}/api/habits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, title })
  }).then(() => {
    document.getElementById("habitInput").value = "";
    loadHabits();
  });
}

function loadHabits() {
  fetch(`${API}/api/habits/${userId}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("habitsList");
      list.innerHTML = "";
      data.forEach(habit => {
        const li = document.createElement("li");
        li.textContent = habit.title;
        list.appendChild(li);
      });
    });
}

/* INIT */
loadNotes();
loadHabits();
