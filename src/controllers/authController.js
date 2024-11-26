const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const token = await authService.login(req.body);
        res.json({ token });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

const checkToken = async (req, res) => {
    try {
        const user = await authService.verifyToken(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

module.exports = { register, login, checkToken };
