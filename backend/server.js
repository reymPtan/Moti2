const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const db = new sqlite3.Database("./moti.db");

/* ================= USERS ================= */
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)
`);

/* ================= NOTES ================= */
db.run(`
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  content TEXT,
  created_at TEXT
)
`);

/* ===== REGISTER ===== */
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users(username,password) VALUES(?,?)",
    [username, hash],
    err => {
      if (err) return res.status(400).json({ error: "User exists" });
      res.json({ success: true });
    }
  );
});

/* ===== LOGIN ===== */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=?",
    [username],
    async (_, user) => {
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ error: "Invalid credentials" });

      res.json({ userId: user.id, username: user.username });
    }
  );
});

/* ===== NOTES API ===== */
app.post("/api/notes", (req, res) => {
  const { userId, content } = req.body;

  db.run(
    "INSERT INTO notes(user_id,content,created_at) VALUES(?,?,datetime('now'))",
    [userId, content],
    () => res.json({ success: true })
  );
});

app.get("/api/notes/:userId", (req, res) => {
  db.all(
    "SELECT * FROM notes WHERE user_id=? ORDER BY id DESC",
    [req.params.userId],
    (_, rows) => res.json(rows)
  );
});

app.delete("/api/notes/:id", (req, res) => {
  db.run("DELETE FROM notes WHERE id=?", [req.params.id], () =>
    res.json({ success: true })
  );
});

app.listen(PORT, () =>
  console.log("MOTI backend running on port", PORT)
);
