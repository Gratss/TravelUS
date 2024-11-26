const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
    const { email, login, password, phoneNumber, fullName } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, login, password, phone_number, full_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, login',
            [email, login, hashedPassword, phoneNumber, fullName]
        );

        const user = result.rows[0];
        const token = generateToken(user);

        res.status(201).json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Логин
router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed' });
    }
});

module.exports = router;
