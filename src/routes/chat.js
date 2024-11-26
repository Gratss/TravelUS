const express = require('express');
const authMiddleware = require('../middleware/auth');
const pool = require('../db');

const router = express.Router();

// Получить сообщения для поездки
router.get('/:tripId', authMiddleware, async (req, res) => {
    const { tripId } = req.params;

    try {
        // Проверить, является ли пользователь участником поездки
        const participant = await pool.query(
            'SELECT * FROM trip_participants WHERE trip_id = $1 AND user_id = $2',
            [tripId, req.user.id]
        );

        if (participant.rows.length === 0) {
            return res.status(403).json({ message: 'You are not a participant of this trip' });
        }

        const messages = await pool.query(
            'SELECT m.*, u.full_name AS sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.trip_id = $1 ORDER BY m.created_at ASC',
            [tripId]
        );

        res.json(messages.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});

// Отправить сообщение
router.post('/:tripId', authMiddleware, async (req, res) => {
    const { tripId } = req.params;
    const { content } = req.body;

    try {
        // Проверить, является ли пользователь участником поездки
        const participant = await pool.query(
            'SELECT * FROM trip_participants WHERE trip_id = $1 AND user_id = $2',
            [tripId, req.user.id]
        );

        if (participant.rows.length === 0) {
            return res.status(403).json({ message: 'You are not a participant of this trip' });
        }

        const message = await pool.query(
            'INSERT INTO messages (trip_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *',
            [tripId, req.user.id, content]
        );

        res.status(201).json(message.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

module.exports = router;
