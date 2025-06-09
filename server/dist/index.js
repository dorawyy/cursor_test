"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const database_1 = require("./config/database");
const auth_1 = __importDefault(require("./routes/auth"));
const groups_1 = __importDefault(require("./routes/groups"));
const restaurants_1 = __importDefault(require("./routes/restaurants"));
// Load environment variables
dotenv_1.default.config();
// Connect to MongoDB
(0, database_1.connectDB)();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/groups', groups_1.default);
app.use('/api/restaurants', restaurants_1.default);
// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to BiteSwipe API' });
});
// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    // Join a group room
    socket.on('joinGroup', (groupId) => {
        socket.join(groupId);
        console.log(`Client ${socket.id} joined group ${groupId}`);
    });
    // Leave a group room
    socket.on('leaveGroup', (groupId) => {
        socket.leave(groupId);
        console.log(`Client ${socket.id} left group ${groupId}`);
    });
    // Handle new swipe
    socket.on('newSwipe', (data) => {
        socket.to(data.groupId).emit('swipeUpdate', data.swipe);
    });
    // Handle group match
    socket.on('groupMatch', (data) => {
        socket.to(data.groupId).emit('matchFound', data.restaurant);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
