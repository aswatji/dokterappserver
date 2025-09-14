-- Tabel chat_room untuk menyimpan pasangan user yang chat
CREATE TABLE IF NOT EXISTS chat_room (
    id SERIAL PRIMARY KEY,
    chat_id VARCHAR(255) UNIQUE NOT NULL, -- format: uid1_uid2 (urutkan agar unik)
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL
);

-- Tabel chat_message untuk menyimpan pesan per chat
CREATE TABLE IF NOT EXISTS chat_message (
    id SERIAL PRIMARY KEY,
    chat_id VARCHAR(255) NOT NULL, -- relasi ke chat_room
    sent_by INTEGER NOT NULL,      -- user id pengirim
    chat_date DATE NOT NULL,       -- tanggal chat (YYYY-MM-DD)
    chat_time TIME NOT NULL,       -- waktu chat (HH:MM:SS)
    chat_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
