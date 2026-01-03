const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");

const app = express();

/* =========================
   CORS CONFIG (IMPORTANT)
========================= */
app.use(cors({
  origin: "*", // allow Netlify
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

/* =========================
   PORT (Render compatible)
========================= */
const PORT = process.env.PORT || 10000;

/* =========================
   DATABASE
========================= */
const db = new sqlite3.Database("./moti.db", (err) => {
  if (err) console.error("DB Error:", err);
  else console.log("Connected to SQLite database");
});

/* =========================
   CREATE TABLE
========================= */
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);
});

/* =========================
   HEALTH CHECK (OPTIONAL)
========================= */
app.get("/", (req, res) => {
  res.send("MOTI Backend is running 🚀");
});

/* =========================
   REGISTER
========================= */
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users(username,password) VALUES(?,?)",
      [username, hash],
      (err) => {
        if (err) {
          return res.status(400).json({ error: "User already exists" });
        }
        res.json({ message: "Registered successfully" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   LOGIN
========================= */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({
        userId: user.id,
        username: user.username
      });
    }
  );
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`MOTI backend running on port ${PORT}`);
});
