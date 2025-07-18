import express from 'express';
import authenticationRoute from './routes/authentication';

const app = express();

app.use(express.json());
app.use("/api/auth", authenticationRoute);

console.log('Routes registered:');
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`${middleware.route.stack[0].method.toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
        console.log(`Router: ${middleware.regexp}`);
        middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                console.log(`  ${handler.route.stack[0].method.toUpperCase()} ${handler.route.path}`);
            }
        });
    }
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});
