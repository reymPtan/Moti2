const API = "https://moti2.onrender.com/api";
const userId = localStorage.getItem("userId");

function loadNotes() {
  fetch(`${API}/notes/${userId}`)
    .then(r => r.json())
    .then(notes => {
      notesList.innerHTML = "";
      notes.forEach(n => {
        const li = document.createElement("li");
        li.innerHTML = `${n.content}
          <button onclick="deleteNote(${n.id})">❌</button>`;
        notesList.appendChild(li);
      });
    });
}

function addNote() {
  fetch(`${API}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      content: noteInput.value
    })
  }).then(() => {
    noteInput.value = "";
    loadNotes();
  });
}

function deleteNote(id) {
  fetch(`${API}/notes/${id}`, { method: "DELETE" })
    .then(() => loadNotes());
}

loadNotes();
