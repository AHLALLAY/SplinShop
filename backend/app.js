import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import authRoute from './routes/auth/auth.routes.js';
import sellerRoute from './routes/sellers/seller.routes.js';
import catalogRoute from './routes/catalogs/catalog.routes.js';
import productRoute from './routes/products/product.routes.js';

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: config.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

const authLimiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Trop de requêtes, réessayez plus tard',
    },
});

const apiBase = config.API_BASE_URL;

app.use(`${apiBase}/auth`, authLimiter, authRoute);
app.use(`${apiBase}/sellers`, sellerRoute);
app.use(`${apiBase}/catalogs`, catalogRoute);
app.use(`${apiBase}/products`, productRoute);

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const status = err.statusCode || 500;
    if (status >= 500) {
        console.error('[error]', err.message || err);
    }
    const clientMessage =
        status >= 500 ? 'Erreur serveur' : err.message || 'Erreur serveur';
    return res.status(status).json({
        success: false,
        message: clientMessage,
        ...(err.fieldErrors && { fieldErrors: err.fieldErrors }),
    });
});

export default app;
