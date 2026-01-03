
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const db = new sqlite3.Database("./moti.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
});

// REGISTER
app.post("/api/register", async (req,res)=>{
  const {username,password}=req.body;
  if(!username || !password) return res.status(400).json({error:"All fields required"});
  const hash = await bcrypt.hash(password,10);
  db.run("INSERT INTO users(username,password) VALUES(?,?)",
    [username,hash],
    err => err ? res.status(400).json({error:"User exists"}) : res.json({message:"Registered"})
  );
});

// LOGIN
app.post("/api/login",(req,res)=>{
  const {username,password}=req.body;
  db.get("SELECT * FROM users WHERE username=?",[username],async(_,user)=>{
    if(!user) return res.status(401).json({error:"Invalid credentials"});
    const ok = await bcrypt.compare(password,user.password);
    ok ? res.json({userId:user.id,username:user.username}) :
         res.status(401).json({error:"Invalid credentials"});
  });
});

app.listen(PORT,()=>console.log("MOTI backend running on",PORT));
