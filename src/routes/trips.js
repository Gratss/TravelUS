
router.put('/:tripId/cost', authMiddleware, async (req, res) => {
    const { tripId } = req.params;
    const { cost } = req.body;

    try {
        // Проверить, является ли пользователь создателем поездки
        const trip = await pool.query(
            'SELECT * FROM trips WHERE id = $1 AND creator_id = $2',
            [tripId, req.user.id]
        );

        if (trip.rows.length === 0) {
            return res.status(403).json({ message: 'You are not the creator of this trip' });
        }

        const result = await pool.query(
            'UPDATE trips SET cost = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [cost, tripId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update trip cost' });
    }
});
