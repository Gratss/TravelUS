const tripService = require('../services/tripService');

const createTrip = async (req, res) => {
    try {
        const trip = await tripService.createTrip(req.body, req.user.id);
        res.status(201).json(trip);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getTrips = async (req, res) => {
    try {
        const trips = await tripService.getTrips(req.query);
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createTrip, getTrips };
