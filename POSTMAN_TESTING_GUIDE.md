# Postman Testing Guide for Faceless API

## Setup

1. **Import the Collection**
   - Open Postman
   - Click "Import" button
   - Select the `Faceless-API.postman_collection.json` file
   - The collection will be imported with all endpoints

2. **Environment Variables**
   The collection uses these variables:
   - `baseUrl`: http://localhost:5000 (automatically set)
   - `authToken`: Will be automatically set when you login/register

## Testing Endpoints

### 1. Health Checks

**Basic Health Check**
- Method: GET
- URL: `{{baseUrl}}/`
- Expected Response: 200 OK with server status

**API Health Check**
- Method: GET  
- URL: `{{baseUrl}}/api/health`
- Expected Response: 200 OK with database connection status

### 2. Authentication Endpoints

**Register User**
- Method: POST
- URL: `{{baseUrl}}/api/auth/register`
- Body:
```json
{
  "email": "test@example.com",
  "password": "password123",
  "nickname": "TestUser"
}
```
- Expected Response: 201 Created with token and user info
- Note: Token is automatically saved to `authToken` variable

**Login User**
- Method: POST
- URL: `{{baseUrl}}/api/auth/login`
- Body:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- Expected Response: 200 OK with token and user info
- Note: Token is automatically saved to `authToken` variable

**Create Pseudonymous Session**
- Method: POST
- URL: `{{baseUrl}}/api/auth/pseudonymous`
- Body:
```json
{
  "nickname": "GuestUser"
}
```
- Expected Response: 201 Created with session token
- Note: Token is automatically saved to `authToken` variable

### 3. Error Testing

**Invalid Registration - Missing Fields**
- Tests validation by sending incomplete data
- Expected Response: 400 Bad Request

**Invalid Login - Wrong Password**
- Tests authentication with wrong credentials
- Expected Response: 401 Unauthorized

**404 - Non-existent Route**
- Tests 404 handling
- Expected Response: 404 Not Found

## Testing Workflow

1. **Start with Health Checks**
   - Run "Basic Health Check" to ensure server is running
   - Run "API Health Check" to verify database connection

2. **Test Registration**
   - Run "Register User" with valid data
   - Verify you get a 201 response with token
   - Try "Invalid Registration" to test validation

3. **Test Login**
   - Run "Login User" with the same credentials from registration
   - Verify you get a 200 response with token
   - Try "Invalid Login" to test error handling

4. **Test Pseudonymous Sessions**
   - Run "Create Pseudonymous Session"
   - Verify you get a 201 response with session token

5. **Test Error Handling**
   - Run the error test cases to verify proper error responses

## Expected Response Formats

### Successful Registration/Login
```json
{
  "token": "jwt_token_here",
  "user": {
    "email": "test@example.com",
    "nickname": "TestUser"
  }
}
```

### Successful Pseudonymous Session
```json
{
  "token": "uuid_token_here",
  "nickname": "GuestUser"
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## Rate Limiting

The API has rate limiting enabled:
- General endpoints: 100 requests per 15 minutes
- Auth endpoints: 10 requests per 15 minutes

If you hit the rate limit, you'll get a 429 response.

## CORS Testing

The API is configured to accept requests from:
- http://localhost:8081 (Expo web)
- http://localhost:19006 (Expo Go)
- http://localhost:3000 (React web)
- exp://localhost:* (Expo mobile)

## Troubleshooting

1. **Server not responding**: Make sure the backend is running with `npm run dev`
2. **Database errors**: Check if MongoDB connection is working
3. **CORS errors**: Verify the origin is in the allowed list
4. **Rate limiting**: Wait 15 minutes or restart the server

## Advanced Testing

You can also test with curl commands:

```bash
# Health check
curl http://localhost:5000/

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","nickname":"TestUser"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
