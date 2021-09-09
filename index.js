const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const messageFormat = require('./utils/messageFormat');
const {userJoin,currentUser, leaveChat, getRoomUsers} = require('./utils/users');
const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const bot = "BOT";

io.on("connection", socket => {

    socket.on('join-room', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);


        socket.emit("message", messageFormat(bot, "Welcome to chat"));

        socket.broadcast.to(user.room).emit("message", messageFormat(bot, `${user.username} has joined the chat`));

        io.to(user.room).emit('roomUsers', {
            room:user.room,
            users: getRoomUsers(user.room)
        })

        socket.on("chatMessage", msg => {
            const user = currentUser(socket.id);

            io.to(user.room).emit("message", messageFormat(user.username, msg));
        })

    })

    socket.on('disconnect', () => {
        const user = leaveChat(socket.id);
        
        if(user) {
            io.to(user.room).emit("message",messageFormat(bot, `${user.username} has left the chat`));
        }

        io.to(user.room).emit('roomUsers', {
            room:user.room,
            users:getRoomUsers(user.room),
        })


    })


})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})