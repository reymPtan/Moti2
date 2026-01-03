const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const db = new sqlite3.Database("./moti.db");

/* ======================
   DATABASE
====================== */
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

/* ======================
   AUTH
====================== */
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" });

  const hash = await bcrypt.hash(password, 10);
  db.run(
    "INSERT INTO users(username,password) VALUES(?,?)",
    [username, hash],
    err =>
      err
        ? res.status(400).json({ error: "User exists" })
        : res.json({ success: true })
  );
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username=?",
    [username],
    async (_, user) => {
      if (!user) return res.status(401).json({ error: "Invalid login" });
      const ok = await bcrypt.compare(password, user.password);
      ok
        ? res.json({ userId: user.id, username: user.username })
        : res.status(401).json({ error: "Invalid login" });
    }
  );
});

/* ======================
   NOTES
====================== */
app.post("/api/notes", (req, res) => {
  const { userId, content } = req.body;
  if (!userId || !content)
    return res.status(400).json({ error: "Missing data" });

  db.run(
    "INSERT INTO notes(user_id,content) VALUES(?,?)",
    [userId, content],
    () => res.json({ success: true })
  );
});

app.get("/api/notes/:userId", (req, res) => {
  db.all(
    "SELECT * FROM notes WHERE user_id=? ORDER BY created_at DESC",
    [req.params.userId],
    (_, rows) => res.json(rows)
  );
});

/* ======================
   HABITS
====================== */
app.post("/api/habits", (req, res) => {
  const { userId, title } = req.body;
  if (!userId || !title)
    return res.status(400).json({ error: "Missing data" });

  db.run(
    "INSERT INTO habits(user_id,title) VALUES(?,?)",
    [userId, title],
    () => res.json({ success: true })
  );
});

app.get("/api/habits/:userId", (req, res) => {
  db.all(
    "SELECT * FROM habits WHERE user_id=?",
    [req.params.userId],
    (_, rows) => res.json(rows)
  );
});

app.listen(PORT, () =>
  console.log("✅ MOTI backend running on", PORT)
);
