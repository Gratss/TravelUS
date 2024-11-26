import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';  

const JWT_EXPIRATION = '1h';  


export const generateToken = (user) => {
    const payload = {
        id: user.id, 
        email: user.email,
        login: user.login,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    return token;
};


export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET); 
        return decoded;  
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
};


export const extractTokenFromHeader = (req) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        throw new Error('No token provided');
    }
    return token;
};
