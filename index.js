// Entry point for Node.js Express server
require("dotenv").config();

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const pool = require("./db");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());

app.use("/api/users", require("./routes/user"));

// Endpoint REST untuk input pesan chat (bisa dicoba di Insomnia/Postman)
// POST /api/chats
// Body: { chat_id, user1_id, user2_id, sent_by, chat_date, chat_time, chat_content }
app.post("/api/chats", async (req, res) => {
  const {
    chat_id,
    user1_id,
    user2_id,
    sent_by,
    chat_date,
    chat_time,
    chat_content,
  } = req.body;
  if (
    !chat_id ||
    !user1_id ||
    !user2_id ||
    !sent_by ||
    !chat_date ||
    !chat_time ||
    !chat_content
  ) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }
  try {
    await pool.query(
      `INSERT INTO chat_room (chat_id, user1_id, user2_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (chat_id) DO NOTHING`,
      [chat_id, user1_id, user2_id]
    );
    const result = await pool.query(
      `INSERT INTO chat_message (chat_id, sent_by, chat_date, chat_time, chat_content)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [chat_id, sent_by, chat_date, chat_time, chat_content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Gagal menyimpan pesan", detail: err.message });
  }
});

// Endpoint GET chat per chat_id dan tanggal
// GET /api/chats/:chat_id/:chat_date
app.get("/api/chats/:chat_id/:chat_date", async (req, res) => {
  const { chat_id, chat_date } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM chat_message WHERE chat_id = $1 AND chat_date = $2 ORDER BY chat_time ASC`,
      [chat_id, chat_date]
    );
    res.json(result.rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Gagal mengambil chat", detail: err.message });
  }
});

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  // Listen for chat message
  // data: { chat_id, sent_by, chat_date, chat_time, chat_content }
  socket.on("chat_message", async (data) => {
    try {
      // Pastikan chat_room sudah ada, jika belum insert
      await pool.query(
        `INSERT INTO chat_room (chat_id, user1_id, user2_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (chat_id) DO NOTHING`,
        [data.chat_id, data.user1_id, data.user2_id]
      );

      // Simpan pesan ke chat_message
      const result = await pool.query(
        `INSERT INTO chat_message (chat_id, sent_by, chat_date, chat_time, chat_content)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          data.chat_id,
          data.sent_by,
          data.chat_date,
          data.chat_time,
          data.chat_content,
        ]
      );
      io.emit("chat_message", result.rows[0]);
    } catch (err) {
      socket.emit("error", {
        error: "Gagal menyimpan pesan",
        detail: err.message,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
