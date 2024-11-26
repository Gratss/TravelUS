const { Pool } = require('pg');
const pool = new Pool();

const createSupportChatsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS support_chats (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            status VARCHAR(50) DEFAULT 'open',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
        console.log('support_chats table created');
    } catch (err) {
        console.error('Error creating support_chats table', err);
    }
};

createSupportChatsTable();
