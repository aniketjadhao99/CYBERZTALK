# Backend Setup and Installation Guide

## System Requirements

- **Node.js**: v16.0.0 or higher
- **MongoDB**: v4.4.0 or higher
- **npm**: v8.0.0 or higher

## Installation Steps

### 1. Install Dependencies

Navigate to the project root and install all required packages:

```bash
npm install
```

This will install:
- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database and ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment configuration

### 2. Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017/cyberztalk

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Socket.io Configuration
SOCKET_IO_CORS_ORIGIN=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows with MongoDB installed
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Seed Database (Optional)

Populate the database with initial resources and demo users:

```bash
npm run seed
```

This creates:
- 10 sample resources/guides
- 3 demo expert users
- Sample categories and tags

### 5. Start the Backend Server

```bash
# Development mode (with nodemon auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Cases
- `POST /api/cases/create` - Create new case (protected)
- `GET /api/cases/all` - Get all cases (protected)
- `GET /api/cases/user` - Get user's cases (protected)
- `GET /api/cases/:id` - Get case details (protected)
- `PUT /api/cases/:id` - Update case (protected)
- `GET /api/cases/stats` - Get dashboard statistics (protected)

### Chat
- `POST /api/chat/conversation/create` - Create conversation (protected)
- `GET /api/chat/conversations` - Get user's conversations (protected)
- `GET /api/chat/conversation/:id` - Get conversation messages (protected)
- `POST /api/chat/message/send` - Send message (protected)
- `PUT /api/chat/message/:id/read` - Mark message as read (protected)

### Resources
- `GET /api/resources/all` - Get all resources (public)
- `GET /api/resources/featured` - Get featured resources (public)
- `GET /api/resources/:id` - Get resource details (public)
- `GET /api/resources/category/:category` - Get resources by category (public)
- `PUT /api/resources/:id/helpful` - Mark resource helpful (protected)

## Socket.io Events

### Client → Server
- `join-conversation` - Join a conversation room
- `send-message` - Send message to conversation
- `user-typing` - User is typing
- `user-stopped-typing` - User stopped typing
- `leave-conversation` - Leave conversation room

### Server → Client
- `receive-message` - Receive new message
- `user-typing` - Another user is typing
- `user-stopped-typing` - User stopped typing

## Database Collections

### Users
```
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (victim|expert|admin),
  expertise: Array,
  isVerified: Boolean,
  createdAt: Date
}
```

### Cases
```
{
  caseId: String (auto-generated),
  victim: ObjectId (ref: User),
  victimInfo: Object,
  incidentType: String,
  description: String,
  priority: String (low|medium|high|critical),
  status: String (new|assigned|in-progress|resolved),
  assignedExpert: ObjectId (ref: User),
  createdAt: Date
}
```

### Conversations
```
{
  participants: [ObjectId],
  relatedCase: ObjectId,
  lastMessage: Object,
  createdAt: Date
}
```

### ChatMessages
```
{
  conversationId: ObjectId,
  sender: ObjectId,
  message: String,
  isEncrypted: Boolean,
  readBy: Array,
  createdAt: Date
}
```

### Resources
```
{
  title: String,
  description: String,
  category: String,
  resourceType: String (guide|article|toolkit|report),
  tags: Array,
  views: Number,
  helpful: Number,
  isPublished: Boolean,
  createdAt: Date
}
```

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Verify MongoDB is accessible on localhost:27017

### Port 5000 Already in Use
- Change PORT in .env file
- Or kill the process using port 5000

### JWT Token Invalid
- Generate a new JWT_SECRET in .env
- Clear browser localStorage and login again

### CORS Errors
- Ensure FRONTEND_URL and SOCKET_IO_CORS_ORIGIN match your frontend URL
- Default is http://localhost:3000

## Security Notes

1. **Change JWT_SECRET** before deploying to production
2. **Never commit .env** file with real secrets
3. **Use HTTPS** in production
4. **Hash passwords** are stored with bcryptjs (never plain text)
5. **Tokens expire** after specified duration (default 7 days)

## Development Tips

- Use `npm run dev` for development with auto-reload
- Check server logs for errors
- Use Postman or Thunder Client to test API endpoints
- MongoDB Compass for visual database inspection
- Browser DevTools Network tab to debug Socket.io connections

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in .env
2. Use a production MongoDB instance (Atlas, etc.)
3. Generate strong JWT_SECRET
4. Use environment-specific configuration
5. Set up HTTPS/SSL certificates
6. Configure proper CORS origins
7. Set up monitoring and logging
8. Use reverse proxy (Nginx) if needed

---

**For questions or issues**: Contact Cyberztalk support
