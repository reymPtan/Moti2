const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// IMPORTANT: Render Disk path
const db = new sqlite3.Database("/data/moti.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS notes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS habits(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    done INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS motivation(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    text TEXT
  )`);
});

/* AUTH */
app.post("/api/register", async (req,res)=>{
  const {username,password} = req.body;
  const hash = await bcrypt.hash(password,10);
  db.run(
    "INSERT INTO users(username,password) VALUES(?,?)",
    [username,hash],
    err => err
      ? res.status(400).json({error:"User exists"})
      : res.json({success:true})
  );
});

app.post("/api/login",(req,res)=>{
  const {username,password} = req.body;
  db.get(
    "SELECT * FROM users WHERE username=?",
    [username],
    async (_,user)=>{
      if(!user) return res.status(401).json({error:"Invalid"});
      const ok = await bcrypt.compare(password,user.password);
      ok
        ? res.json({userId:user.id,username:user.username})
        : res.status(401).json({error:"Invalid"});
    }
  );
});

/* NOTES */
app.get("/api/notes/:uid",(req,res)=>{
  db.all("SELECT * FROM notes WHERE user_id=?",[req.params.uid],
    (_,rows)=>res.json(rows)
  );
});

app.post("/api/notes",(req,res)=>{
  const {userId,content} = req.body;
  db.run("INSERT INTO notes(user_id,content) VALUES(?,?)",
    [userId,content],
    ()=>res.json({success:true})
  );
});

/* HABITS */
app.get("/api/habits/:uid",(req,res)=>{
  db.all("SELECT * FROM habits WHERE user_id=?",[req.params.uid],
    (_,rows)=>res.json(rows)
  );
});

app.post("/api/habits",(req,res)=>{
  const {userId,name} = req.body;
  db.run("INSERT INTO habits(user_id,name) VALUES(?,?)",
    [userId,name],
    ()=>res.json({success:true})
  );
});

/* MOTIVATION */
app.get("/api/motivation/:uid",(req,res)=>{
  db.get(
    "SELECT text FROM motivation WHERE user_id=? ORDER BY id DESC LIMIT 1",
    [req.params.uid],
    (_,row)=>res.json(row || {text:"You can do this 💪"})
  );
});

app.listen(PORT,()=>console.log("MOTI backend running"));
