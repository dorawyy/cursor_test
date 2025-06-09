import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import groupRoutes from './routes/groups';
import restaurantRoutes from './routes/restaurants';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BiteSwipe API' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join a group room
  socket.on('joinGroup', (groupId: string) => {
    socket.join(groupId);
    console.log(`Client ${socket.id} joined group ${groupId}`);
  });

  // Leave a group room
  socket.on('leaveGroup', (groupId: string) => {
    socket.leave(groupId);
    console.log(`Client ${socket.id} left group ${groupId}`);
  });

  // Handle new swipe
  socket.on('newSwipe', (data: { groupId: string, swipe: any }) => {
    socket.to(data.groupId).emit('swipeUpdate', data.swipe);
  });

  // Handle group match
  socket.on('groupMatch', (data: { groupId: string, restaurant: any }) => {
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