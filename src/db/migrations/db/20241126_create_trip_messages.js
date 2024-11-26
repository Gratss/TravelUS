const { Pool } = require('pg');
const pool = new Pool();

const createTripMessagesTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS trip_messages (
            id SERIAL PRIMARY KEY,
            chat_id INT NOT NULL,
            sender_id INT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            FOREIGN KEY (chat_id) REFERENCES trip_chats(id) ON DELETE CASCADE,
            FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
        console.log('trip_messages table created');
    } catch (err) {
        console.error('Error creating trip_messages table', err);
    }
};

createTripMessagesTable();
