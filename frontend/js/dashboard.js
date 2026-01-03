const API = "https://moti2.onrender.com";
const userId = localStorage.getItem("userId");
if(!userId) location.href="index.html";

/* NOTES */
async function loadNotes(){
  const res = await fetch(`${API}/api/notes/${userId}`);
  const notes = await res.json();
  notesList.innerHTML = notes.map(n=>`<li>${n.content}</li>`).join("");
}

addNote.onclick = async ()=>{
  await fetch(`${API}/api/notes`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({userId,content:newNote.value})
  });
  newNote.value="";
  loadNotes();
};

/* HABITS */
async function loadHabits(){
  const res = await fetch(`${API}/api/habits/${userId}`);
  const habits = await res.json();
  habitList.innerHTML = habits.map(h=>`<li>${h.name}</li>`).join("");
}

addHabit.onclick = async ()=>{
  await fetch(`${API}/api/habits`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({userId,name:newHabit.value})
  });
  newHabit.value="";
  loadHabits();
};

/* MOTIVATION */
async function loadMotivation(){
  const res = await fetch(`${API}/api/motivation/${userId}`);
  const data = await res.json();
  motivation.innerText = data.text;
}

loadNotes();
loadHabits();
loadMotivation();
