import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Load environment variables FIRST before any other imports
dotenv.config();

import connectDB from './backend/config/database.js';
import authRoutes from './backend/routes/authRoutes.js';
import caseRoutes from './backend/routes/caseRoutes.js';
import chatRoutes from './backend/routes/chatRoutes.js';
import resourceRoutes from './backend/routes/resourceRoutes.js';

// Initialize Express
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: process.env.SOCKET_IO_CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Serve static files from root directory
app.use(express.static('.'));

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile('./index.html', { root: '.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/resources', resourceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Cyberztalk API is running',
        timestamp: new Date().toISOString()
    });
});

// Socket.io events
io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Join a conversation room
    socket.on('join-conversation', (conversationId) => {
        socket.join(`conversation-${conversationId}`);
        console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });

    // Send message to conversation
    socket.on('send-message', (data) => {
        const { conversationId, message, sender, senderName } = data;
        io.to(`conversation-${conversationId}`).emit('receive-message', {
            message,
            sender,
            senderName,
            timestamp: new Date()
        });
    });

    // User typing indicator
    socket.on('user-typing', (data) => {
        const { conversationId, userName } = data;
        socket.to(`conversation-${conversationId}`).emit('user-typing', {
            userName,
            isTyping: true
        });
    });

    socket.on('user-stopped-typing', (data) => {
        const { conversationId, userName } = data;
        socket.to(`conversation-${conversationId}`).emit('user-stopped-typing', {
            userName,
            isTyping: false
        });
    });

    // Leave conversation
    socket.on('leave-conversation', (conversationId) => {
        socket.leave(`conversation-${conversationId}`);
        console.log(`User ${socket.id} left conversation ${conversationId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`
    🚀 Cyberztalk API Server Running
    ✅ Server: http://localhost:${PORT}
    ✅ API: http://localhost:${PORT}/api
    ✅ Socket.io: ws://localhost:${PORT}
    ✅ Environment: ${process.env.NODE_ENV || 'development'}
    `);
});

export default app;
