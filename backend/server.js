const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const db = new sqlite3.Database("./moti.db");

/* ========= TABLES ========= */
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
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

/* ========= AUTH ========= */
app.post("/api/register", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  db.run(
    "INSERT INTO users(username,password) VALUES(?,?)",
    [req.body.username, hash],
    err => err
      ? res.status(400).json({ error: "User exists" })
      : res.json({ success: true })
  );
});

app.post("/api/login", (req, res) => {
  db.get(
    "SELECT * FROM users WHERE username=?",
    [req.body.username],
    async (_, user) => {
      if (!user) return res.json({ error: "Invalid credentials" });
      const ok = await bcrypt.compare(req.body.password, user.password);
      ok
        ? res.json({ userId: user.id, username: user.username })
        : res.json({ error: "Invalid credentials" });
    }
  );
});

/* ========= NOTES ========= */
app.post("/api/notes", (req, res) => {
  db.run(
    `INSERT INTO notes(user_id,content,created_at)
     VALUES(?,?,datetime('now'))`,
    [req.body.userId, req.body.content],
    () => res.json({ success: true })
  );
});

app.get("/api/notes/:uid", (req, res) => {
  db.all(
    "SELECT * FROM notes WHERE user_id=? ORDER BY id DESC",
    [req.params.uid],
    (_, rows) => res.json(rows)
  );
});

/* ========= HABITS ========= */
app.post("/api/habits", (req, res) => {
  db.run(
    `INSERT INTO habits(user_id,name,done,created_at)
     VALUES(?,?,0,datetime('now'))`,
    [req.body.userId, req.body.name],
    () => res.json({ success: true })
  );
});

app.get("/api/habits/:uid", (req, res) => {
  db.all(
    "SELECT * FROM habits WHERE user_id=?",
    [req.params.uid],
    (_, rows) => res.json(rows)
  );
});

app.post("/api/habits/toggle/:id", (req, res) => {
  db.run(
    "UPDATE habits SET done = CASE WHEN done=1 THEN 0 ELSE 1 END WHERE id=?",
    [req.params.id],
    () => res.json({ success: true })
  );
});

/* ========= REMINDERS ========= */
app.post("/api/reminders", (req, res) => {
  db.run(
    `INSERT INTO reminders(user_id,text,remind_at,created_at)
     VALUES(?,?,?,datetime('now'))`,
    [req.body.userId, req.body.text, req.body.time],
    () => res.json({ success: true })
  );
});

app.get("/api/reminders/:uid", (req, res) => {
  db.all(
    "SELECT * FROM reminders WHERE user_id=?",
    [req.params.uid],
    (_, rows) => res.json(rows)
  );
});

/* ========= ANALYTICS ========= */
app.get("/api/stats/:uid", (req, res) => {
  db.get(
    `
    SELECT
      (SELECT COUNT(*) FROM notes WHERE user_id=?) AS notes,
      (SELECT COUNT(*) FROM habits WHERE user_id=?) AS habits,
      (SELECT COUNT(*) FROM reminders WHERE user_id=?) AS reminders
    `,
    [req.params.uid, req.params.uid, req.params.uid],
    (_, row) => res.json(row)
  );
});

app.listen(PORT, () => console.log("MOTI backend running", PORT));
