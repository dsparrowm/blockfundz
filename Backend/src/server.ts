import express from 'express';
import path from "path";
import morgan from 'morgan';
import cors from 'cors';
import protect from './helpers/protect';
import authenticationRoute from './routes/authentication';
import tokenValidationRouter from './routes/validateToken';
import routes from './routes/index';
import healthCheck from './handlers/healthCheck';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authMiddleware from './middleware/authMiddleware';

const app = express();

const allowedOrigins = [
    'https://www.nexgencrypto.live',
    'https://nexgencrypto.live',
    'http://localhost:5173'
];

// Critical middleware order fix
app.use(helmet());
app.use(cookieParser()); // Should come before CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);

        if (allowedOrigins.some(allowedOrigin =>
            origin === allowedOrigin ||
            origin.startsWith(allowedOrigin)
        )) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Handle OPTIONS requests explicitly
app.options('*', cors());

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rest of middleware
app.use(morgan('dev'));

// Routes
app.use("/api/auth", authenticationRoute);
app.use("/api", authMiddleware, routes);
app.use('/token', tokenValidationRouter);
app.get('/status', healthCheck);

export default app;