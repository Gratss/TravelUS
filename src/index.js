import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { query } from './db/index.js';


dotenv.config();


const app = express();

app.use(cors());

app.use(bodyParser.json());


const PORT = process.env.PORT || 5000;


const pool = new Pool({
connectionString: process.env.DATABASE_URL,
ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const startServer = async () => {
    try {
        
        await pool.connect();
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection error', err);
        process.exit(1);
    }

    // Запуск сервера
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

// Миграции
const runMigrations = async () => {
    const migrationsDir = join(__dirname, 'db', 'migrations');
    const files = readdirSync(migrationsDir).sort(); // Сортируем файлы, если необходимо

    for (const file of files) {
        const filePath = join(migrationsDir, file);
        const sql = readFileSync(filePath, 'utf8');
        console.log(`Running migration: ${file}`);
        await query(sql);
    }

    console.log('All migrations applied successfully!');
};


const initializeApp = async () => {
    try {
        await runMigrations();  // Выполнение миграций
        await startServer();     // Запуск сервера
    } catch (err) {
        console.error('Error during initialization:', err);
        process.exit(1);
    }
};

initializeApp();


export { pool, query };
