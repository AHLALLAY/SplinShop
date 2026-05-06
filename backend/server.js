import express from 'express';
import 'dotenv/config';
import db from './databases/connection.js';
import createDefaultAdmin from './utils/addAdmin.js';
import authRoute from './routes/auth/auth.routes.js';

// constants
const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || '/api/v1';

const app = express();

app.use(express.json());

// routes
app.use(`${API_BASE_URL}/auth`, authRoute)

const run = async () => {
    try {
        // connecting to database
        await db.connectToDb();

        // creating defealt admin
        await createDefaultAdmin();

        // listening
        app.listen(PORT, () => {
            console.info(`server running on http://localhost:${PORT}/`);
        });
    } catch (e) {
        console.error(e.message);
    }
}

run();

// Gérer l'arrêt propre du serveur (Ctrl+C)
process.on('SIGINT', async () => {
    await db.disconnect();
    process.exit(0)
})