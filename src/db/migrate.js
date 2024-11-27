const fs = require('fs');
const path = require('path');
const pool = require('./index');

const runMigrations = async () => {
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        console.log(`Running migration: ${file}`);
        await pool.query(sql);
    }

    console.log('All migrations applied successfully!');
    process.exit();
};

runMigrations().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
