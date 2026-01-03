const API = "https://moti2.onrender.com/api";
const uid = localStorage.getItem("userId");

/* MOTIVATION */
const quotes=[
 "Small steps every day.",
 "Progress not perfection.",
 "Your future self will thank you.",
 "Consistency beats motivation."
];
function showMotivation(){
  const d=new Date().toDateString();
  if(localStorage.getItem("qd")!==d){
    localStorage.setItem("qd",d);
    localStorage.setItem("q",quotes[Math.random()*quotes.length|0]);
  }
  motivation.innerText=localStorage.getItem("q");
}

/* NOTES */
function addNote(){
  fetch(API+"/notes",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({userId:uid,content:noteInput.value})})
  .then(()=>{noteInput.value="";loadNotes();loadStats();});
}
function loadNotes(){
  fetch(API+"/notes/"+uid).then(r=>r.json()).then(d=>{
    notesList.innerHTML="";
    d.forEach(n=>notesList.innerHTML+=`<li>${n.content}</li>`);
  });
}

/* HABITS */
function addHabit(){
  fetch(API+"/habits",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({userId:uid,name:habitInput.value})})
  .then(()=>{habitInput.value="";loadHabits();loadStats();});
}
function loadHabits(){
  fetch(API+"/habits/"+uid).then(r=>r.json()).then(d=>{
    habitsList.innerHTML="";
    d.forEach(h=>habitsList.innerHTML+=
      `<li><input type="checkbox" ${h.done?"checked":""}
      onclick="toggleHabit(${h.id})"> ${h.name}</li>`);
  });
}
function toggleHabit(id){
  fetch(API+"/habits/toggle/"+id,{method:"POST"})
    .then(()=>{loadHabits();loadStats();});
}

/* REMINDERS */
function addReminder(){
  fetch(API+"/reminders",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({userId:uid,text:reminderText.value,time:reminderTime.value})})
  .then(()=>{reminderText.value="";loadReminders();loadStats();});
}
function loadReminders(){
  fetch(API+"/reminders/"+uid).then(r=>r.json()).then(d=>{
    remindersList.innerHTML="";
    d.forEach(r=>remindersList.innerHTML+=`<li>${r.text}</li>`);
  });
}

/* ANALYTICS */
function loadStats(){
  fetch(API+"/stats/"+uid).then(r=>r.json()).then(s=>{
    stats.innerText=`Notes:${s.notes} | Habits:${s.habits} | Reminders:${s.reminders}`;
  });
}

showMotivation();
loadNotes(); loadHabits(); loadReminders(); loadStats();
