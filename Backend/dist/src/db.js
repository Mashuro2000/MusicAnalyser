"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Parse the DATABASE_URL
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
// Test the connection
pool.on('error', (err) => {
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
exports.default = pool;
//# sourceMappingURL=db.js.map