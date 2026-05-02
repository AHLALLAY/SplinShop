import express from 'express';
import 'dotenv/config';


// constants
const PORT = 3000;
const API_BASE_URL = '/api/v1';
const URI = process.env.DATABASE_URL;

const app = express();

const run = async () => {
    try {
        // connecting to database


        // creating defealt admin

        
        // listening
        app.listen(PORT, () => {
            console.info(`server running on http://localhost:${PORT}/`);
        });
    } catch (e) {
        console.error(e.message);
    }
}

run();