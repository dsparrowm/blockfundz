import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authenticationRoute from './routes/authentication';
import tokenValidationRouter from './routes/validateToken';
import routes from './routes/index';
import healthCheck from './handlers/healthCheck';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authMiddleware from './middleware/authMiddleware';
import NotificationRouter from './routes/adminNotifications';

const app = express();

const clientBaseUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({
    origin: clientBaseUrl, // Replace with your frontend's origin
    credentials: true // required for cookies
}));
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

//  Routers
app.use("/api/auth", authenticationRoute)
app.use("/api", authMiddleware, routes) // Protect routes with authMiddleware
app.use('/token', tokenValidationRouter)
app.use('/api', NotificationRouter);

app.get('/status', healthCheck)


export default app;