const API = "https://moti2.onrender.com/api";
const uid = localStorage.getItem("userId");

/* ===== DAILY MOTIVATION ===== */
const quotes = [
  "Small steps every day lead to big changes.",
  "Progress, not perfection.",
  "Your future self will thank you.",
  "Consistency beats motivation.",
  "You are capable of more than you think."
];

function showMotivation() {
  const today = new Date().toDateString();
  if (localStorage.getItem("quoteDay") !== today) {
    localStorage.setItem(
      "dailyQuote",
      quotes[Math.floor(Math.random() * quotes.length)]
    );
    localStorage.setItem("quoteDay", today);
  }
  motivation.innerText = localStorage.getItem("dailyQuote");
}

/* ===== NOTES ===== */
function addNote() {
  fetch(API + "/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: uid, content: noteInput.value })
  }).then(() => {
    noteInput.value = "";
    loadNotes();
    loadStats();
  });
}

function loadNotes() {
  fetch(API + "/notes/" + uid)
    .then(r => r.json())
    .then(d => {
      notesList.innerHTML = "";
      d.forEach(n => (notesList.innerHTML += `<li>${n.content}</li>`));
    });
}

/* ===== HABITS ===== */
function addHabit() {
  fetch(API + "/habits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: uid, name: habitInput.value })
  }).then(() => {
    habitInput.value = "";
    loadHabits();
    loadStats();
  });
}

function loadHabits() {
  fetch(API + "/habits/" + uid)
    .then(r => r.json())
    .then(d => {
      habitsList.innerHTML = "";
      d.forEach(
        h =>
          (habitsList.innerHTML += `
        <li>
          <input type="checkbox" ${h.done ? "checked" : ""}
            onclick="toggleHabit(${h.id})">
          ${h.name}
        </li>`)
      );
    });
}

function toggleHabit(id) {
  fetch(API + "/habits/toggle/" + id, { method: "POST" }).then(() => {
    loadHabits();
    loadStats();
  });
}

/* ===== REMINDERS ===== */
function addReminder() {
  fetch(API + "/reminders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: uid,
      text: reminderText.value,
      time: reminderTime.value
    })
  }).then(() => {
    reminderText.value = "";
    loadReminders();
    loadStats();
  });
}

function loadReminders() {
  fetch(API + "/reminders/" + uid)
    .then(r => r.json())
    .then(d => {
      remindersList.innerHTML = "";
      d.forEach(
        r =>
          (remindersList.innerHTML += `<li>${r.text} @ ${r.remind_at}</li>`)
      );
    });
}

/* ===== ANALYTICS ===== */
function loadStats() {
  fetch(API + "/stats/" + uid)
    .then(r => r.json())
    .then(s => {
      stats.innerText =
        `Notes: ${s.notes} | Habits: ${s.habits} | Reminders: ${s.reminders}`;
    });
}

/* ===== INIT ===== */
showMotivation();
loadNotes();
loadHabits();
loadReminders();
loadStats();
