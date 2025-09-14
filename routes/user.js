const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/userController");

// Endpoint input user baru
router.post("/", createUser);

const pool = require("../db");
// Endpoint GET semua user dari database
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users"
    );
    res.json(result.rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Gagal mengambil data user", detail: err.message });
  }
});

module.exports = router;
