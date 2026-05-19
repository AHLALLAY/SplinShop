import app from './app.js';
import { config } from './config/index.js';
import db from './databases/connection.js';
import createDefaultAdmin from './utils/defaultAdmin.js';

const run = async () => {
    try {
        await db.connectToDb();
        await createDefaultAdmin();

        app.listen(config.PORT, () => {
            console.info(`Server listening on http://localhost:${config.PORT}/`);
        });
    } catch (e) {
        console.error(`Server error: ${e.message}`);
        process.exit(1);
    }
};

run();

process.on('SIGINT', async () => {
    await db.disconnect();
    process.exit(0);
});
