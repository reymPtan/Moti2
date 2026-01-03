const API = "https://moti2.onrender.com/api";
const uid=localStorage.getItem("userId");

/* ===== TOAST ===== */
function toast(msg){
  const t=document.createElement("div");
  t.innerText=msg;
  t.style.cssText="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#111;color:#fff;padding:12px 18px;border-radius:14px;";
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2500);
}

/* ===== MOTIVATION ===== */
const quotes=[
 "Small steps every day.",
 "Progress, not perfection.",
 "Consistency beats motivation.",
 "Your future self will thank you."
];
function showMotivation(){
  const d=new Date().toDateString();
  if(localStorage.qd!==d){
    localStorage.qd=d;
    localStorage.q=quotes[Math.random()*quotes.length|0];
  }
  motivation.innerText=localStorage.q;
}

/* ===== FOLDERS ===== */
function addFolder(){
  fetch(API+"/folders",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({userId:uid,name:folderName.value,color:folderColor.value})})
  .then(()=>{folderName.value="";loadFolders();});
}
function loadFolders(){
  fetch(API+"/folders/"+uid).then(r=>r.json()).then(d=>{
    folderSelect.innerHTML="<option value=''>No Folder</option>";
    folderList.innerHTML="";
    d.forEach(f=>{
      folderSelect.innerHTML+=`<option value="${f.id}">${f.name}</option>`;
      folderList.innerHTML+=`<li style="color:${f.color}">${f.name}</li>`;
    });
  });
}

/* ===== NOTES ===== */
function addNote(){
  fetch(API+"/notes",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({userId:uid,folderId:folderSelect.value,content:noteInput.value})})
  .then(()=>{noteInput.value="";loadNotes();loadStats();toast("Note saved");});
}
function loadNotes(){
  fetch(API+"/notes/"+uid).then(r=>r.json()).then(d=>{
    notesList.innerHTML=d.length?"":"<li><i>No notes yet</i></li>";
    d.forEach(n=>{
      notesList.innerHTML+=`
      <li>${n.content}
        <button onclick="editNote(${n.id},'${n.content.replace(/'/g,"\\'")}')">✏️</button>
        <button onclick="deleteNote(${n.id})">🗑</button>
      </li>`;
    });
  });
}
function editNote(id,old){
  const n=prompt("Edit note",old);
  if(!n)return;
  fetch(API+"/notes/"+id,{method:"PUT",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({content:n})})
  .then(()=>{loadNotes();toast("Updated");});
}
function deleteNote(id){
  if(!confirm("Delete?"))return;
  fetch(API+"/notes/"+id,{method:"DELETE"})
  .then(()=>{loadNotes();loadStats();});
}
function searchNotes(v){
  document.querySelectorAll("#notesList li").forEach(li=>{
    li.style.display=li.innerText.toLowerCase().includes(v.toLowerCase())?"block":"none";
  });
}

/* ===== HABITS ===== */
function addHabit(){
  fetch(API+"/habits",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({userId:uid,name:habitInput.value})})
  .then(()=>{habitInput.value="";loadHabits();loadStats();});
}
function loadHabits(){
  fetch(API+"/habits/"+uid).then(r=>r.json()).then(d=>{
    habitsList.innerHTML=d.length?"":"<li><i>No habits yet</i></li>";
    d.forEach(h=>{
      habitsList.innerHTML+=`
      <li>
        <input type="checkbox" ${h.done?"checked":""}
        onclick="toggleHabit(${h.id})">
        ${h.name}
        <button onclick="editHabit(${h.id},'${h.name.replace(/'/g,"\\'")}')">✏️</button>
      </li>`;
    });
  });
}
function toggleHabit(id){
  fetch(API+"/habits/toggle/"+id,{method:"POST"})
  .then(()=>{loadHabits();loadStats();});
}
function editHabit(id,old){
  const n=prompt("Edit habit",old);
  if(!n)return;
  fetch(API+"/habits/"+id,{method:"PUT",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name:n})})
  .then(()=>{loadHabits();});
}

/* ===== REMINDERS ===== */
function addReminder(){
  fetch(API+"/reminders",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({userId:uid,text:reminderText.value,time:reminderTime.value})})
  .then(()=>{reminderText.value="";loadReminders();loadStats();});
}
function loadReminders(){
  fetch(API+"/reminders/"+uid).then(r=>r.json()).then(d=>{
    remindersList.innerHTML=d.length?"":"<li><i>No reminders</i></li>";
    d.forEach(r=>remindersList.innerHTML+=`<li>${r.text} @ ${r.remind_at}</li>`);
  });
}

/* ===== ANALYTICS ===== */
function loadStats(){
  fetch(API+"/stats/"+uid).then(r=>r.json()).then(s=>{
    stats.innerText=`Notes:${s.notes} | Habits:${s.habits} | Reminders:${s.reminders}`;
  });
}

/* INIT */
showMotivation();
loadFolders();
loadNotes();
loadHabits();
loadReminders();
loadStats();
