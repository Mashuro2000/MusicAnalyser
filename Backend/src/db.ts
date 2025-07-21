import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Parse the DATABASE_URL
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  

// Test the connection
pool.on('error', (err: any) => {
    console.error('Unexpected error on idle client', err);
    console.error('Error details:', {
        code: err.code,
        message: err.message,
        detail: err.detail,
        hint: err.hint
    });
    process.exit(-1);
});

// Test the connection immediately
pool.connect()
    .then(client => {
        console.log('Successfully connected to the database');
        client.release();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
        process.exit(-1);
    });

export default pool; 