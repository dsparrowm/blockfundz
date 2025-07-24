import dotenv from 'dotenv';
dotenv.config()
import app from './server'
import http from 'http';
import { Server } from 'socket.io';
import prisma from './db';
import editTransaction from './handlers/transactions/editTransactions';
import { InterestCalculationService } from './services/InterestCalculationService';


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

let users = {};

io.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`);
    socket.on('userConnected', (userId) => {
        users[userId] = socket.id;
        console.log(users, 'shewhoiphwi');
    });

    socket.on('disconnect', () => {
        for (let userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
                break;
            }
        }
    });

})


app.put('/api/transactions/:id', editTransaction);

// Start the interest calculation scheduler
InterestCalculationService.startInterestCalculationScheduler();

server.listen(3001, () => {
    console.log('server running on http://localhost:3001');
    console.log('Interest calculation scheduler started');
})