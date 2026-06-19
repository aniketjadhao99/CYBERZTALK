# 🚀 Cyberztalk Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Node.js v16+ installed
- MongoDB running locally or connection string ready

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
Create `.env` file in project root:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cyberztalk
JWT_SECRET=your_super_secret_key_change_in_production
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start MongoDB
```bash
# Windows/Mac/Linux
mongod
```

### Step 4: Start Backend Server
```bash
# Development with auto-reload
npm run dev

# Or production mode
npm start
```

You should see:
```
🚀 Cyberztalk API Server Running
✅ Server: http://localhost:5000
✅ API: http://localhost:5000/api
✅ Socket.io: ws://localhost:5000
```

### Step 5: Seed Demo Data (Optional)
In another terminal:
```bash
npm run seed
```

This creates sample resources and demo users.

## 📡 Test the API

### Using cURL:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "role": "victim"
  }'

# Login
curl -X POST http://localhost:5000/api/health \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

### Using Postman:
1. Create new workspace
2. Create POST request to `http://localhost:5000/api/auth/register`
3. Set body to JSON with user data
4. Send request

## 🗂️ Project Structure

```
stitch_cyberztalk_assistance_platform/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Case.js              # Case/incident schema
│   │   ├── ChatMessage.js        # Message schema
│   │   ├── Conversation.js       # Conversation schema
│   │   └── Resource.js           # Resource schema
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── caseController.js     # Case management
│   │   ├── chatController.js     # Chat system
│   │   └── resourceController.js # Resource management
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── utils/
│   │   └── tokenUtils.js         # Token generation
│   └── routes/
│       ├── authRoutes.js         # Auth endpoints
│       ├── caseRoutes.js         # Case endpoints
│       ├── chatRoutes.js         # Chat endpoints
│       └── resourceRoutes.js      # Resource endpoints
├── js/
│   ├── api.js                     # API client class
│   └── integration.js             # Frontend integration utilities
├── server.js                       # Express server entry point
├── seedDatabase.js                 # Database seeding script
├── package.json                    # Dependencies
├── .env                           # Environment variables
└── BACKEND_SETUP.md               # Detailed setup guide
```

## 🔌 Frontend Integration

### 1. Include API Client
```html
<script src="/js/api.js"></script>
<script src="/js/integration.js"></script>
```

### 2. Use API Functions
```javascript
// Login
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});

const { data } = await loginResponse.json();
localStorage.setItem('authToken', data.token);
```

### 3. Load Dashboard Data
```javascript
// Get statistics
const statsResponse = await fetch('http://localhost:5000/api/cases/stats', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
});
```

## 📚 API Documentation

### Authentication Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/register` | - | Register new user |
| POST | `/api/auth/login` | - | Login user |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/profile` | ✅ | Update profile |

### Case Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/cases/create` | ✅ | Create new case |
| GET | `/api/cases/all` | ✅ | Get all cases |
| GET | `/api/cases/:id` | ✅ | Get case details |
| PUT | `/api/cases/:id` | ✅ | Update case |
| GET | `/api/cases/stats` | ✅ | Get statistics |

### Chat Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/chat/conversation/create` | ✅ | Create conversation |
| GET | `/api/chat/conversations` | ✅ | Get conversations |
| GET | `/api/chat/conversation/:id` | ✅ | Get messages |
| POST | `/api/chat/message/send` | ✅ | Send message |
| PUT | `/api/chat/message/:id/read` | ✅ | Mark as read |

### Resource Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/api/resources/all` | - | Get all resources |
| GET | `/api/resources/featured` | - | Get featured |
| GET | `/api/resources/:id` | - | Get resource |
| GET | `/api/resources/category/:cat` | - | By category |
| PUT | `/api/resources/:id/helpful` | ✅ | Mark helpful |

## 🔐 Demo Credentials

After running `npm run seed`:

```
Email: sarah.jenkins@cyberztalk.com
Password: SecurePassword123!
Role: Expert

Email: alex.chen@cyberztalk.com
Password: SecurePassword123!
Role: Expert

Email: elena.vasquez@cyberztalk.com
Password: SecurePassword123!
Role: Admin
```

## ⚙️ Configuration

### Database
- MongoDB URI: `MONGODB_URI` in .env
- Default: `mongodb://localhost:27017/cyberztalk`

### Server
- Port: `PORT` in .env (default: 5000)
- Environment: `NODE_ENV` (development/production)

### JWT
- Secret: `JWT_SECRET` in .env
- Expiration: `7d` (configurable)

### CORS
- Frontend: `FRONTEND_URL` in .env
- Default: `http://localhost:3000`

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB with `mongod`

### Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in .env or kill process on port 5000

### JWT Token Invalid
```
Error: JsonWebTokenError: invalid token
```
**Solution**: Clear localStorage and login again

### CORS Error in Browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Verify FRONTEND_URL in .env matches your frontend URL

## 📱 Socket.io Real-Time Features

### Join Conversation
```javascript
socket.emit('join-conversation', conversationId);
```

### Send Message
```javascript
socket.emit('send-message', {
  conversationId: '123',
  message: 'Hello!',
  sender: userId,
  senderName: 'John'
});
```

### Listen for Messages
```javascript
socket.on('receive-message', (data) => {
  console.log('New message:', data.message);
});
```

## 🚀 Production Deployment

1. **Update .env**
   - Set `NODE_ENV=production`
   - Use production MongoDB URL
   - Generate strong `JWT_SECRET`
   - Set correct `FRONTEND_URL`

2. **Install PM2** for process management
   ```bash
   npm install -g pm2
   pm2 start server.js --name "cyberztalk-api"
   ```

3. **Setup Nginx** reverse proxy

4. **Enable HTTPS/SSL**

5. **Setup monitoring** (New Relic, DataDog)

## 📞 Support

For issues or questions:
- Check BACKEND_SETUP.md for detailed configuration
- Review API response messages
- Check server logs in terminal
- Test endpoints with Postman first

---

**Happy coding! 🎉**

Cyberztalk Platform - Making the internet safer, one report at a time.
