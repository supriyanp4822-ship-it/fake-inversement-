# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints except auth routes require a Bearer token:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
Success response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

Error response:
```json
{
  "success": false,
  "message": "Error message",
  "error": { /* error details */ }
}
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "fullName": "..." },
    "token": "jwt-token"
  }
}
```

### Login
**POST** `/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response: Same as register

### Logout
**POST** `/auth/logout`

---

## Investment Endpoints

### Get All Investments (User's)
**GET** `/investments`

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Tech Startup Fund",
      "description": "Investment in emerging tech",
      "amount": 50000,
      "expectedReturn": 25,
      "riskLevel": "high",
      "fraudScore": 35,
      "status": "flagged",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Investment Analysis
**POST** `/investments`

Request body:
```json
{
  "name": "Tech Startup Fund",
  "description": "Investment opportunity in emerging technology",
  "amount": 50000,
  "expectedReturn": 25,
  "riskLevel": "high",
  "investorName": "John Smith"
}
```

Response: Returns created investment with calculated fraud score

### Get Investment Details
**GET** `/investments/:id`

Response: Single investment object

### Update Investment
**PUT** `/investments/:id`

Request body: Same as create

Response: Updated investment object

### Delete Investment
**DELETE** `/investments/:id`

Response:
```json
{
  "success": true,
  "message": "Investment deleted"
}
```

---

## Report Endpoints

### Get All Reports (User's)
**GET** `/reports`

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "investmentId": { "name": "..." },
      "riskScore": 45,
      "fraudIndicators": ["High expected returns", "Insufficient documentation"],
      "recommendations": ["Verify documents", "Check investor credentials"],
      "summary": "Investment scored 45/100 risk points",
      "generatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Generate Report
**POST** `/reports`

Request body:
```json
{
  "investmentId": "investment-id"
}
```

Response: Returns generated report

### Get Report Details
**GET** `/reports/:id`

Response: Single report object

---

## Status Codes

- **200** - OK
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Server Error

---

## Error Examples

Unauthorized:
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "status": 401
}
```

Validation Error:
```json
{
  "success": false,
  "message": "Validation failed",
  "details": ["Email must be valid", "Password must be at least 6 characters"]
}
```

Not Found:
```json
{
  "success": false,
  "message": "Investment not found",
  "status": 404
}
```
