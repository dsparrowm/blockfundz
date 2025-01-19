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

app.use(helmet())
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's origin
    credentials: true // required for cookies
}));
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

//  Routers
app.use("/api/auth", authenticationRoute)
app.use("/api", authMiddleware, routes) // Protect routes with authMiddleware
app.use('/token', tokenValidationRouter)

app.get('/status', healthCheck)


export default app;