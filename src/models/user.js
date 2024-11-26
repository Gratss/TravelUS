const pool = require('../db');

const findByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

const createUser = async ({ fullName, email, password, phoneNumber }) => {
    const result = await pool.query(
        'INSERT INTO users (full_name, email, password, phone_number) VALUES ($1, $2, $3, $4) RETURNING *',
        [fullName, email, password, phoneNumber]
    );
    return result.rows[0];
};

module.exports = { findByEmail, createUser };
