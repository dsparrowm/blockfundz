import express from 'express';
import authenticationRoute from './routes/authentication';

const app = express();

app.use(express.json());
app.use("/api/auth", authenticationRoute);

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});
