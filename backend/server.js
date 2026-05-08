import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import db from './databases/connection.js';
import createDefaultAdmin from './utils/addAdmin.js';
import authRoute from './routes/auth/auth.routes.js';
import userRoute from './routes/admin/user.routes.js';

// constants
const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || '/api/v1';

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// routes
app.use(`${API_BASE_URL}/auth`, authRoute);
app.use(`${API_BASE_URL}/seller`, userRoute);

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