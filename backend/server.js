const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const db = new sqlite3.Database("./moti.db");

/* ===== DATABASE ===== */
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS folders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    color TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    folder_id INTEGER,
    content TEXT,
    created_at TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    done INTEGER DEFAULT 0,
    created_at TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    text TEXT,
    remind_at TEXT,
    created_at TEXT
  )`);
});

/* ===== AUTH ===== */
app.post("/api/register", async (req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);
  db.run(
    "INSERT INTO users(username,password) VALUES(?,?)",
    [req.body.username,hash],
    err => err ? res.json({error:"User exists"}) : res.json({success:true})
  );
});

app.post("/api/login",(req,res)=>{
  db.get(
    "SELECT * FROM users WHERE username=?",
    [req.body.username],
    async (_,u)=>{
      if(!u) return res.json({error:"Invalid"});
      const ok = await bcrypt.compare(req.body.password,u.password);
      ok ? res.json({userId:u.id,username:u.username})
         : res.json({error:"Invalid"});
    }
  );
});

/* ===== FOLDERS ===== */
app.post("/api/folders",(req,res)=>{
  db.run(
    "INSERT INTO folders(user_id,name,color) VALUES(?,?,?)",
    [req.body.userId,req.body.name,req.body.color],
    ()=>res.json({success:true})
  );
});
app.get("/api/folders/:uid",(req,res)=>{
  db.all("SELECT * FROM folders WHERE user_id=?",
    [req.params.uid],(_,r)=>res.json(r));
});

/* ===== NOTES ===== */
app.post("/api/notes",(req,res)=>{
  db.run(
    "INSERT INTO notes(user_id,folder_id,content,created_at) VALUES(?,?,?,datetime('now'))",
    [req.body.userId,req.body.folderId,req.body.content],
    ()=>res.json({success:true})
  );
});
app.get("/api/notes/:uid",(req,res)=>{
  db.all("SELECT * FROM notes WHERE user_id=? ORDER BY id DESC",
    [req.params.uid],(_,r)=>res.json(r));
});
app.put("/api/notes/:id",(req,res)=>{
  db.run("UPDATE notes SET content=? WHERE id=?",
    [req.body.content,req.params.id],()=>res.json({success:true}));
});
app.delete("/api/notes/:id",(req,res)=>{
  db.run("DELETE FROM notes WHERE id=?",
    [req.params.id],()=>res.json({success:true}));
});

/* ===== HABITS ===== */
app.post("/api/habits",(req,res)=>{
  db.run(
    "INSERT INTO habits(user_id,name,created_at) VALUES(?,?,datetime('now'))",
    [req.body.userId,req.body.name],()=>res.json({success:true})
  );
});
app.get("/api/habits/:uid",(req,res)=>{
  db.all("SELECT * FROM habits WHERE user_id=?",
    [req.params.uid],(_,r)=>res.json(r));
});
app.put("/api/habits/:id",(req,res)=>{
  db.run("UPDATE habits SET name=? WHERE id=?",
    [req.body.name,req.params.id],()=>res.json({success:true}));
});
app.post("/api/habits/toggle/:id",(req,res)=>{
  db.run("UPDATE habits SET done=1-done WHERE id=?",
    [req.params.id],()=>res.json({success:true}));
});

/* ===== REMINDERS ===== */
app.post("/api/reminders",(req,res)=>{
  db.run(
    "INSERT INTO reminders(user_id,text,remind_at,created_at) VALUES(?,?,?,datetime('now'))",
    [req.body.userId,req.body.text,req.body.time],
    ()=>res.json({success:true})
  );
});
app.get("/api/reminders/:uid",(req,res)=>{
  db.all("SELECT * FROM reminders WHERE user_id=?",
    [req.params.uid],(_,r)=>res.json(r));
});

/* ===== ANALYTICS ===== */
app.get("/api/stats/:uid",(req,res)=>{
  db.get(`
    SELECT
      (SELECT COUNT(*) FROM notes WHERE user_id=?) notes,
      (SELECT COUNT(*) FROM habits WHERE user_id=?) habits,
      (SELECT COUNT(*) FROM reminders WHERE user_id=?) reminders
  `,[req.params.uid,req.params.uid,req.params.uid],
  (_,r)=>res.json(r));
});

app.listen(PORT,()=>console.log("✅ MOTI backend running"));
