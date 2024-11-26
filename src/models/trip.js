const pool = require('../db');

const createTrip = async (data) => {
    const { startLocation, endLocation, startDate, endDate, creatorId } = data;
    const result = await pool.query(
        'INSERT INTO trips (start_location, end_location, start_date, end_date, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [startLocation, endLocation, startDate, endDate, creatorId]
    );
    return result.rows[0];
};

const getTrips = async (filters) => {
    const result = await pool.query('SELECT * FROM trips');
    return result.rows;
};

module.exports = { createTrip, getTrips };
