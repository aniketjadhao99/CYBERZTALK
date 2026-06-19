# 🏗️ Cyberztalk Platform - System Architecture

## Overview

Cyberztalk is a full-stack cybercrime assistance platform with real-time communication, incident case management, and knowledge base resources.

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                              │
│  (HTML/CSS/JS - 11 Pages, Responsive Design, Tailwind CSS)      │
│                                                                  │
│  ├── Public Pages: index.html, features.html, about-us.html    │
│  ├── Auth Pages: login.html, get-started.html                  │
│  ├── User Pages: expert-chat.html, report-incident.html        │
│  ├── Dashboard: admin-dashboard.html, case-management.html    │
│  └── Resources: resources.html                                 │
└─────────────────────────────────────────────────────────────────┘
              ↓         (REST API + Socket.io)
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API LAYER                             │
│                  (Express.js on Node.js)                         │
│                                                                  │
│  ├─ Auth Controller    → /api/auth/*                            │
│  ├─ Case Controller    → /api/cases/*                           │
│  ├─ Chat Controller    → /api/chat/*                            │
│  └─ Resource Controller → /api/resources/*                       │
│                                                                  │
│  Middleware:                                                    │
│  ├─ JWT Authentication (protect)                               │
│  ├─ CORS Configuration                                          │
│  ├─ Error Handling                                              │
│  └─ Input Validation                                            │
│                                                                  │
│  Real-time:                                                     │
│  └─ Socket.io (WebSocket for live chat)                         │
└─────────────────────────────────────────────────────────────────┘
              ↓         (Mongoose ODM)
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                    │
│                 (MongoDB Database)                              │
│                                                                  │
│  Collections:                                                   │
│  ├─ Users (authentication & profiles)                           │
│  ├─ Cases (incident reports)                                    │
│  ├─ Conversations (chat threads)                                │
│  ├─ ChatMessages (message history)                              │
│  └─ Resources (knowledge base)                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Architecture Patterns

### 1. MVC Pattern (Modified)
```
Models (Mongoose Schemas)
    ↓
Controllers (Business Logic)
    ↓
Routes (REST Endpoints)
    ↓
Middleware (Authentication, Validation)
    ↓
Frontend (HTML/JS)
```

### 2. Request Flow

```
HTTP Request from Frontend
    ↓
Express Router (routes/*)
    ↓
Middleware Chain
  ├─ CORS Check
  ├─ JWT Verification (if protected)
  └─ Body Parsing
    ↓
Controller Function
  ├─ Input Validation
  ├─ Business Logic
  ├─ Database Query (Mongoose)
  └─ Response Formatting
    ↓
HTTP Response to Frontend
```

### 3. Real-time Communication

```
Browser (Socket.io Client)
    ↓ (WebSocket)
Express Server with Socket.io
    ↓ (Room Broadcasting)
Connected Clients
```

## Core Components

### Authentication System

**Password Security:**
- Hashed with bcryptjs (10 salt rounds)
- Never stored in plain text
- Compared during login without exposing hash

**Token Generation:**
- JWT (JSON Web Token)
- Signed with JWT_SECRET
- Includes userId, issued date, expiration
- Sent in Authorization header: `Bearer <token>`

**Protected Routes:**
```javascript
// Middleware checks token
router.get('/protected', protect, controller);

// Token extracted from: Authorization: Bearer <token>
// Verified using JWT_SECRET
// userId stored in req.userId for use in controller
```

### Database Schema Design

#### User Schema
```
{
  fullName: String
  email: String (unique)
  password: String (hashed)
  phone: String
  avatar: String (URL)
  role: String (victim|expert|admin)
  expertise: Array[String]
  isVerified: Boolean
  isActive: Boolean
  timestamps
}

Indexes: email, role, createdAt
Pre-save: Auto-hash password
Methods: matchPassword(enteredPassword)
```

#### Case Schema
```
{
  caseId: String (auto-generated #CZ-XXXXXX)
  victim: ObjectId → User
  victimInfo: {
    name, email, phone, location
  }
  incidentType: String (enum)
  description: String
  platform: String
  suspectInfo: Object
  priority: String (low|medium|high|critical)
  status: String (new|assigned|in-progress|escalated|resolved)
  assignedExpert: ObjectId → User
  tags: Array[String]
  notes: String
  aiAnalysis: Object
  timestamps
}

Indexes: victim+createdAt, status+priority, assignedExpert
Pre-save: Generate caseId if new
```

#### Conversation Schema
```
{
  participants: Array[ObjectId → User]
  relatedCase: ObjectId → Case (optional)
  title: String
  description: String
  isActive: Boolean
  lastMessage: {
    content: String
    sender: ObjectId
    timestamp: Date
  }
  timestamps
}

Indexes: participants, relatedCase
```

#### ChatMessage Schema
```
{
  conversationId: ObjectId → Conversation
  sender: ObjectId → User
  message: String
  messageType: String (text|file|image|system)
  attachments: Array
  isEncrypted: Boolean
  readBy: Array[
    {
      user: ObjectId → User
      readAt: Date
    }
  ]
  timestamps
}

Indexes: conversationId+createdAt
```

#### Resource Schema
```
{
  title: String
  description: String
  content: String (markdown)
  category: String (cyber-fraud|phishing|privacy|...)
  tags: Array[String]
  author: ObjectId → User
  resourceType: String (guide|article|toolkit|report)
  readTime: Number (minutes)
  views: Number
  helpful: Number (counter)
  notHelpful: Number (counter)
  attachments: Array[URL]
  isPublished: Boolean
  timestamps
}

Indexes: category+isPublished, tags, createdAt
```

## API Endpoints

### Authentication (`/api/auth`)
```
POST   /register          - Create user account
POST   /login             - Authenticate user, return JWT
GET    /me                - Get logged-in user (protected)
PUT    /profile           - Update user profile (protected)
```

### Case Management (`/api/cases`)
```
POST   /create            - Create new incident case (protected)
GET    /all               - List cases with filters (protected)
GET    /user              - Get user's cases (protected)
GET    /stats             - Dashboard statistics (protected)
GET    /:id               - Get case details (protected)
PUT    /:id               - Update case status (protected)
```

### Chat System (`/api/chat`)
```
POST   /conversation/create       - Start conversation (protected)
GET    /conversations             - List user conversations (protected)
GET    /conversation/:id          - Get message history (protected)
POST   /message/send              - Send message (protected)
PUT    /message/:id/read          - Mark message as read (protected)
```

### Knowledge Base (`/api/resources`)
```
GET    /all              - List resources (public)
GET    /featured         - Get featured resources (public)
GET    /:id              - Get resource details (public)
GET    /category/:cat    - Get resources by category (public)
PUT    /:id/helpful      - Mark as helpful/not helpful (protected)
```

## Socket.io Events

### Client → Server
```
join-conversation(conversationId)
  - User joins conversation room for real-time updates

send-message(data)
  - Send message to conversation participants
  - data: {conversationId, message, sender, senderName}

user-typing(data)
  - Indicate user is typing
  - data: {conversationId, userName}

user-stopped-typing(data)
  - Clear typing indicator

leave-conversation(conversationId)
  - Leave conversation room
```

### Server → Client
```
receive-message(data)
  - Broadcast received message to room
  - data: {message, sender, senderName, timestamp}

user-typing(data)
  - Notify others user is typing

user-stopped-typing(data)
  - Clear typing indicator for other users
```

## Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend POST /api/auth/login with email/password
   ↓
3. Backend finds user, compares password hash
   ↓
4. If valid, generates JWT token
   ↓
5. Returns token to frontend
   ↓
6. Frontend stores token in localStorage
   ↓
7. For protected routes, includes token in Authorization header
   ↓
8. Backend middleware verifies token, extracts userId
   ↓
9. Controller executes with user context
```

## Data Flow Examples

### Creating an Incident Case

```
User fills form on report-incident.html
  ↓
JavaScript collects form data
  ↓
POST /api/cases/create with case details
  ↓
Backend caseController.createCase()
  ├─ Validates input
  ├─ Auto-generates caseId (#CZ-XXXXXX)
  ├─ Creates Case document in MongoDB
  └─ Returns case with caseId
  ↓
Frontend receives confirmation
  ↓
Redirects to case-management.html
  ↓
GET /api/cases/user fetches all user's cases
  ↓
Display cases in table
```

### Real-time Chat

```
User A sends message in expert-chat.html
  ↓
JavaScript emits Socket.io event: send-message
  ↓
Server broadcasts to conversation room
  ↓
POST /api/chat/message/send creates ChatMessage
  ↓
Socket.io sends receive-message to all participants
  ↓
User B's browser receives message
  ↓
JavaScript appends message to chat UI
  ↓
Message displays in real-time
```

### Dashboard Load

```
admin-dashboard.html loads
  ↓
JavaScript calls GET /api/cases/stats
  ↓
Backend queries MongoDB:
  ├─ Count total cases
  ├─ Count new (status: 'new')
  ├─ Count active (status: 'in-progress')
  ├─ Count resolved (status: 'resolved')
  └─ Count high priority
  ↓
Returns statistics object
  ↓
Frontend updates stat cards with numbers
  ↓
Dashboard displays live data
```

## Security Considerations

### Input Validation
- Express-validator on all endpoints
- Mongoose schema validation
- Type checking before database operations

### Authentication
- JWT tokens with expiration
- Bearer token in Authorization header
- Refresh token mechanism (optional)

### Authorization
- Role-based access control (victim/expert/admin)
- User can only access their own data
- Experts can only modify assigned cases

### Data Protection
- Passwords hashed with bcryptjs
- Sensitive data not logged
- CORS configured for frontend only
- Rate limiting recommended for production

### Encryption
- Messages can be marked isEncrypted
- SSL/TLS for transport (HTTPS in production)
- JWT signed with secret

## Performance Optimization

### Database Indexes
```
User: email, role, createdAt
Case: victim+createdAt, status+priority, assignedExpert
ChatMessage: conversationId+createdAt
Conversation: participants, relatedCase
Resource: category+isPublished, tags, createdAt
```

### Query Optimization
- Population only of necessary fields
- Pagination with skip/limit
- Sorting by indexed fields
- Lean queries when mutation not needed

### Caching Opportunities
- Featured resources (static, cached client-side)
- User profile (localStorage)
- Dashboard stats (refresh interval)

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers (load balancer compatible)
- JWT doesn't require session storage
- MongoDB replication sets
- Redis for session/cache layer

### Vertical Scaling
- Add more CPU/RAM to server
- Optimize database indexes
- Connection pooling
- CDN for static assets

## Deployment Architecture

```
Domain: cyberztalk.com
    ↓
CDN (CloudFlare)
    ↓
Load Balancer (nginx)
    ↓
Node.js Servers (multiple instances)
    ├─ server.js (port 5000)
    ├─ server.js (port 5001)
    └─ server.js (port 5002)
    ↓
MongoDB Cluster (replication)
    ├─ Primary
    ├─ Secondary 1
    └─ Secondary 2
    ↓
Redis (session/cache)
    ↓
S3 (file uploads)
```

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

### Response Format
```json
{
  "success": boolean,
  "message": "Human-readable message",
  "data": {/* response data */},
  "pagination": {/* if applicable */}
}
```

## Testing Strategy

### Unit Tests
- Model validation
- Controller business logic
- Utility functions

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### End-to-End Tests
- User registration and login
- Creating and retrieving cases
- Chat message sending/receiving
- Resource browsing

## Monitoring & Logging

### Production Monitoring
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Log aggregation (ELK Stack)
- Database monitoring
- Real-user monitoring

### Key Metrics
- Response time
- Error rate
- Database query performance
- Socket.io connection count
- Memory usage
- CPU usage

---

**This architecture is designed for scalability, maintainability, and real-time capability.**
