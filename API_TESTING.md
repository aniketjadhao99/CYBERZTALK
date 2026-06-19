# 🧪 API Testing Guide

## Prerequisites

- Postman or Thunder Client installed
- Backend server running (`npm run dev`)
- MongoDB running
- .env file configured

## Testing Steps

### 1. Health Check

**Test if server is running:**

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Cyberztalk API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. User Registration

**Test creating a new user account:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123!",
    "phone": "+1-555-0100",
    "role": "victim"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "role": "victim"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token for next requests:**
- Copy the `token` value
- Use as: `Authorization: Bearer <token>`

### 3. User Login

**Test authenticating existing user:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "role": "victim"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. Get Current User

**Test retrieving authenticated user profile:**

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_token>"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0100",
    "role": "victim",
    "isVerified": false,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5. Update User Profile

**Test updating user information:**

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "fullName": "John Doe Updated",
    "phone": "+1-555-0105",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe Updated",
    "phone": "+1-555-0105",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

### 6. Create an Incident Case

**Test reporting a cybercrime incident:**

```bash
curl -X POST http://localhost:5000/api/cases/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "victimInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-0100",
      "location": "New York, USA"
    },
    "incidentType": "phishing",
    "description": "Received suspicious email asking for password reset",
    "platform": "Email",
    "priority": "high",
    "suspectInfo": {
      "email": "attacker@malicious.com"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Case created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "caseId": "#CZ-202401150130",
    "victim": "507f1f77bcf86cd799439011",
    "incidentType": "phishing",
    "description": "Received suspicious email asking for password reset",
    "priority": "high",
    "status": "new",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Save the caseId for reference**

### 7. Get All Cases

**Test retrieving cases with filters:**

```bash
# All cases with pagination
curl "http://localhost:5000/api/cases/all?page=1&limit=10" \
  -H "Authorization: Bearer <your_token>"

# Filter by status
curl "http://localhost:5000/api/cases/all?status=new" \
  -H "Authorization: Bearer <your_token>"

# Filter by priority
curl "http://localhost:5000/api/cases/all?priority=high" \
  -H "Authorization: Bearer <your_token>"

# Search by case ID
curl "http://localhost:5000/api/cases/all?search=CZ-202401" \
  -H "Authorization: Bearer <your_token>"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "caseId": "#CZ-202401150130",
      "victim": {
        "id": "507f1f77bcf86cd799439011",
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "incidentType": "phishing",
      "status": "new",
      "priority": "high",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "pages": 1
  }
}
```

### 8. Get Case Details

**Test retrieving specific case:**

```bash
curl http://localhost:5000/api/cases/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <your_token>"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "caseId": "#CZ-202401150130",
    "victim": {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com"
    },
    "incidentType": "phishing",
    "description": "Received suspicious email asking for password reset",
    "priority": "high",
    "status": "new",
    "tags": [],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 9. Update Case Status

**Test updating case status:**

```bash
curl -X PUT http://localhost:5000/api/cases/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "status": "in-progress",
    "priority": "critical",
    "assignedExpert": "507f1f77bcf86cd799439020"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Case updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "status": "in-progress",
    "priority": "critical",
    "assignedExpert": "507f1f77bcf86cd799439020"
  }
}
```

### 10. Get Dashboard Statistics

**Test retrieving dashboard stats:**

```bash
curl http://localhost:5000/api/cases/stats \
  -H "Authorization: Bearer <your_token>"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalCases": 15,
    "newCases": 3,
    "activeCases": 5,
    "resolvedCases": 7,
    "highPriorityCases": 2,
    "casesByType": {
      "phishing": 5,
      "malware": 4,
      "fraud": 3,
      "identity-theft": 2,
      "other": 1
    },
    "casesByStatus": {
      "new": 3,
      "assigned": 2,
      "in-progress": 5,
      "resolved": 5
    }
  }
}
```

### 11. Get Resources

**Test retrieving knowledge base resources:**

```bash
# All resources
curl http://localhost:5000/api/resources/all

# With filters
curl "http://localhost:5000/api/resources/all?category=phishing&page=1&limit=6"

# Search resources
curl "http://localhost:5000/api/resources/all?search=phishing"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439030",
      "title": "Spear-Phishing Tactics of 2024",
      "description": "Cybercriminals are using LLMs to craft hyper-personalized attacks...",
      "category": "phishing",
      "resourceType": "article",
      "readTime": 8,
      "views": 245,
      "helpful": 89,
      "notHelpful": 5,
      "tags": ["phishing", "ai", "detection"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "pages": 3
  }
}
```

### 12. Get Featured Resources

**Test retrieving featured resources:**

```bash
curl http://localhost:5000/api/resources/featured
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439030",
      "title": "The Anatomy of a Zero-Day Exploit",
      "views": 1240,
      "resourceType": "guide"
    }
  ]
}
```

### 13. Get Resources by Category

**Test retrieving resources by specific category:**

```bash
curl http://localhost:5000/api/resources/category/phishing?limit=6
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439031",
      "title": "Spear-Phishing Tactics of 2024",
      "category": "phishing"
    }
  ]
}
```

### 14. Mark Resource as Helpful

**Test marking resource feedback:**

```bash
curl -X PUT http://localhost:5000/api/resources/507f1f77bcf86cd799439030/helpful \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "helpful": true
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Thank you for your feedback",
  "data": {
    "helpful": 90,
    "notHelpful": 5
  }
}
```

## Error Scenarios

### 401 - Unauthorized (Missing Token)

**Request:**
```bash
curl http://localhost:5000/api/cases/stats
```

**Response:**
```json
{
  "success": false,
  "message": "No authorization token provided"
}
```

### 401 - Invalid Token

**Request:**
```bash
curl http://localhost:5000/api/cases/stats \
  -H "Authorization: Bearer invalid_token"
```

**Response:**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 400 - Validation Error

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John",
    "email": "invalid-email"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Validation failed"
}
```

### 404 - Not Found

**Request:**
```bash
curl http://localhost:5000/api/cases/invalid_id \
  -H "Authorization: Bearer <your_token>"
```

**Response:**
```json
{
  "success": false,
  "message": "Case not found"
}
```

## Postman Collection

### Import Collection

1. Open Postman
2. Create new collection: "Cyberztalk API"
3. Add these requests with Environment variable `{{token}}`

### Environment Setup

1. Click "Environments" → New
2. Create variable:
   - Name: `token`
   - Value: `<paste_jwt_token_here>`
   - Type: secret

3. Create variable:
   - Name: `base_url`
   - Value: `http://localhost:5000/api`
   - Type: string

### Collection Structure

```
Cyberztalk API
├── Auth
│   ├── Register
│   ├── Login
│   ├── Get Current User
│   └── Update Profile
├── Cases
│   ├── Create Case
│   ├── Get All Cases
│   ├── Get Case by ID
│   ├── Update Case Status
│   └── Get Dashboard Stats
├── Chat
│   ├── Create Conversation
│   ├── Get Conversations
│   ├── Get Messages
│   ├── Send Message
│   └── Mark as Read
└── Resources
    ├── Get All Resources
    ├── Get Featured
    ├── Get by Category
    └── Mark Helpful
```

## cURL Cheat Sheet

```bash
# POST with JSON
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "pass"}'

# GET with Authorization
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"

# PUT with JSON
curl -X PUT http://localhost:5000/api/cases/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"status": "in-progress"}'

# Query Parameters
curl "http://localhost:5000/api/cases/all?status=new&priority=high"

# Pretty Print JSON (requires jq)
curl http://localhost:5000/api/health | jq .
```

## Debugging Tips

1. **Check Headers:** Ensure `Content-Type: application/json`
2. **Verify Token:** Make sure token hasn't expired
3. **Check MongoDB:** Verify database is running
4. **Server Logs:** Watch terminal for error messages
5. **Network Tab:** Use browser DevTools to inspect requests
6. **Error Response:** Read error message for clues

---

**Happy testing! 🚀**
