import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js'; 
import { query } from '../db/index.js'; 


const hashPassword = async (password) => {
    const saltRounds = 10;  
    return bcrypt.hash(password, saltRounds);
};


const checkPassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};


export const registerUser = async (userData) => {
    const { email, password, login, phone, fullName } = userData;

    const userExistsQuery = 'SELECT * FROM users WHERE email = $1 OR login = $2';
    const userExistsResult = await query(userExistsQuery, [email, login]);

    if (userExistsResult.rows.length > 0) {
        throw new Error('User with this email or login already exists');
    }


    const hashedPassword = await hashPassword(password);


    const insertQuery = `
        INSERT INTO users (email, password, login, phone, full_name)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, login, phone, full_name;
    `;
    const insertResult = await query(insertQuery, [email, hashedPassword, login, phone, fullName]);


    const newUser = insertResult.rows[0];
    return newUser;
};


export const loginUser = async (emailOrLogin, password) => {
    // Получаем пользователя по email или login
    const getUserQuery = 'SELECT * FROM users WHERE email = $1 OR login = $2';
    const getUserResult = await query(getUserQuery, [emailOrLogin, emailOrLogin]);

    if (getUserResult.rows.length === 0) {
        throw new Error('User not found');
    }

    const user = getUserResult.rows[0];


    const isPasswordValid = await checkPassword(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const token = generateToken(user);

    return { token, user: { id: user.id, email: user.email, login: user.login, full_name: user.full_name } };
};

export const verifyUserToken = async (token) => {
    try {
        const decoded = verifyToken(token);
        const getUserQuery = 'SELECT * FROM users WHERE id = $1';
        const getUserResult = await query(getUserQuery, [decoded.id]);

        if (getUserResult.rows.length === 0) {
            throw new Error('User not found');
        }

        return getUserResult.rows[0]; 
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
