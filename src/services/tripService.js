import { query } from '../db/index.js'; // Подключение к базе данных
import { calculateTripCost, getTripCostBreakdown } from '../utils/costCalculator.js'; // Импортируем утилиту для расчета стоимости

// Функция для создания поездки
export const createTrip = async (tripData) => {
    const { userId, startLocation, endLocation, distance, duration, pricePerKm, pricePerMin, additionalFees } = tripData;

    const totalCost = calculateTripCost(distance, duration, pricePerKm, pricePerMin, additionalFees);
    
    const insertQuery = `
        INSERT INTO trips (user_id, start_location, end_location, distance, duration, price_per_km, price_per_min, additional_fees, total_cost)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, user_id, start_location, end_location, distance, duration, total_cost;
    `;
    const insertResult = await query(insertQuery, [userId, startLocation, endLocation, distance, duration, pricePerKm, pricePerMin, additionalFees, totalCost]);

    return insertResult.rows[0]; 
};


export const getTrip = async (tripId) => {
    const tripQuery = 'SELECT * FROM trips WHERE id = $1';
    const tripResult = await query(tripQuery, [tripId]);

    if (tripResult.rows.length === 0) {
        throw new Error('Trip not found');
    }

    return tripResult.rows[0]; 
};


export const updateTrip = async (tripId, updatedData) => {
    const { startLocation, endLocation, distance, duration, pricePerKm, pricePerMin, additionalFees } = updatedData;

    const totalCost = calculateTripCost(distance, duration, pricePerKm, pricePerMin, additionalFees);

    
    const updateQuery = `
        UPDATE trips
        SET start_location = $1, end_location = $2, distance = $3, duration = $4, price_per_km = $5, price_per_min = $6, additional_fees = $7, total_cost = $8
        WHERE id = $9
        RETURNING id, start_location, end_location, distance, duration, total_cost;
    `;
    const updateResult = await query(updateQuery, [startLocation, endLocation, distance, duration, pricePerKm, pricePerMin, additionalFees, totalCost, tripId]);

    if (updateResult.rows.length === 0) {
        throw new Error('Trip update failed');
    }

    return updateResult.rows[0]; 
};


export const addParticipantToTrip = async (tripId, userId) => {
    const checkQuery = 'SELECT * FROM trip_participants WHERE trip_id = $1 AND user_id = $2';
    const checkResult = await query(checkQuery, [tripId, userId]);

    if (checkResult.rows.length > 0) {
        throw new Error('User is already a participant');
    }

    const insertParticipantQuery = 'INSERT INTO trip_participants (trip_id, user_id) VALUES ($1, $2) RETURNING trip_id, user_id';
    const insertParticipantResult = await query(insertParticipantQuery, [tripId, userId]);

    return insertParticipantResult.rows[0]; 
};


export const getTripParticipants = async (tripId) => {
    const participantsQuery = 'SELECT * FROM users INNER JOIN trip_participants ON users.id = trip_participants.user_id WHERE trip_participants.trip_id = $1';
    const participantsResult = await query(participantsQuery, [tripId]);

    return participantsResult.rows; 
};


export const getTripCostBreakdown = async (tripId) => {
    const tripQuery = 'SELECT * FROM trips WHERE id = $1';
    const tripResult = await query(tripQuery, [tripId]);

    if (tripResult.rows.length === 0) {
        throw new Error('Trip not found');
    }

    const trip = tripResult.rows[0];

    const costBreakdown = getTripCostBreakdown(trip.distance, trip.duration, trip.price_per_km, trip.price_per_min, trip.additional_fees);
    return costBreakdown; 
};
