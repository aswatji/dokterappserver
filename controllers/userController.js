const pool = require("../db");
const bcrypt = require("bcrypt");

// Input user baru
// POST /api/users
// Body: { username, email, password, role }
async function createUser(req, res) {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at",
      [username, email, hashedPassword, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      res.status(409).json({ error: "Email sudah terdaftar" });
    } else {
      res
        .status(500)
        .json({ error: "Gagal menambah user", detail: err.message });
    }
  }
}

module.exports = { createUser };
