const express = require('express');
const authMiddleware = require('../middleware/auth');
const pool = require('../db');

const router = express.Router();

// Получить данные пользователя
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query('SELECT id, email, login, phone_number, full_name FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch user data' });
    }
});

// Обновить данные пользователя
router.put('/me', authMiddleware, async (req, res) => {
    const { email, phoneNumber, fullName } = req.body;

    try {
        const userId = req.user.id;

        const result = await pool.query(
            'UPDATE users SET email = $1, phone_number = $2, full_name = $3, updated_at = NOW() WHERE id = $4 RETURNING id, email, phone_number, full_name',
            [email, phoneNumber, fullName, userId]
        );

        const updatedUser = result.rows[0];
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update user data' });
    }
});

module.exports = router;
