let notes = [];
let habits = [];
let reminders = [];

/* NOTES */
function addNote() {
  const input = document.getElementById("noteInput");
  if (!input.value) return;

  notes.push(input.value);
  input.value = "";
  renderNotes();
}

function renderNotes() {
  const ul = document.getElementById("notesList");
  ul.innerHTML = "";
  notes.forEach(n => {
    const li = document.createElement("li");
    li.innerText = n;
    ul.appendChild(li);
  });
  document.getElementById("noteCount").innerText = notes.length;
}

/* HABITS */
function addHabit() {
  const input = document.getElementById("habitInput");
  if (!input.value) return;

  habits.push(input.value);
  input.value = "";
  renderHabits();
}

function renderHabits() {
  const ul = document.getElementById("habitsList");
  ul.innerHTML = "";
  habits.forEach(h => {
    const li = document.createElement("li");
    li.innerText = h;
    ul.appendChild(li);
  });
  document.getElementById("habitCount").innerText = habits.length;
}

/* REMINDERS */
function addReminder() {
  const input = document.getElementById("reminderInput");
  if (!input.value) return;

  reminders.push(input.value);
  input.value = "";
  renderReminders();
}

function renderReminders() {
  const ul = document.getElementById("remindersList");
  ul.innerHTML = "";
  reminders.forEach(r => {
    const li = document.createElement("li");
    li.innerText = r;
    ul.appendChild(li);
  });
  document.getElementById("reminderCount").innerText = reminders.length;
}
