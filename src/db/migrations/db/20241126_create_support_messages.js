const { Pool } = require('pg');
const pool = new Pool();

const createSupportMessagesTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS support_messages (
            id SERIAL PRIMARY KEY,
            chat_id INT NOT NULL,
            sender_type VARCHAR(50) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            FOREIGN KEY (chat_id) REFERENCES support_chats(id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
        console.log('support_messages table created');
    } catch (err) {
        console.error('Error creating support_messages table', err);
    }
};

createSupportMessagesTable();
