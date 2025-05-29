import dotenv from 'dotenv';
dotenv.config()
import app from './server'
import http from 'http';
import { Server } from 'socket.io';
import prisma from './db';
import editTransaction from './handlers/transactions/editTransactions';


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

function getSocketIdFromUserId(userId) {
    console.log(users, 'getSocketIdFromUserId');
    return users[userId];
}

app.put('/api/transactions/:id', editTransaction);

server.listen(3001, () => {
    console.log('server running on http://localhost:3001');
})