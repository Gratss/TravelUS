const { Pool } = require('pg');
const pool = new Pool();

const createTripChatsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS trip_chats (
            id SERIAL PRIMARY KEY,
            trip_id INT NOT NULL,
            user_id INT NOT NULL,
            driver_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;
    try {
        await pool.query(query);
        console.log('trip_chats table created');
    } catch (err) {
        console.error('Error creating trip_chats table', err);
    }
};

createTripChatsTable();
