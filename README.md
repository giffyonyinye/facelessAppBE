# Faceless Backend

A Node.js/Express backend for the Faceless social media application.

## Features

- User authentication (JWT-based)
- Pseudonymous sessions for guest users
- MongoDB integration with Mongoose
- CORS configuration for cross-origin requests
- TypeScript support
- Input validation and error handling

## Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database (local or cloud)
- npm or yarn

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_jwt_secret_key
NODE_ENV=development
```

### Running the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/pseudonymous` - Create pseudonymous session

### Health Check

- `GET /` - Basic health check
- `GET /api/health` - Detailed health check with database status

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port (default: 5000) | No |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT tokens | Yes |
| NODE_ENV | Environment (development/production) | No |

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Environment variable protection
- Error handling without sensitive data exposure

## Development

### Project Structure
```
src/
├── index.ts          # Main server file
├── models/           # Database models
│   ├── User.ts
│   └── Session.ts
├── routes/           # API routes
│   └── auth.ts
└── middleware/       # Custom middleware
    └── auth.ts
```

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run start` - Build and start production server
- `npm run build` - Build TypeScript to JavaScript

## CORS Configuration

The server is configured to accept requests from:
- `http://localhost:8081` (Expo web)
- `http://localhost:19006` (Expo Go)
- `http://localhost:3000` (React web)
- `exp://localhost:*` (Expo mobile)

## Database Models

### User
- email (unique, optional for OAuth users)
- password (hashed)
- nickname (required)
- googleId (optional, for OAuth)

### Session
- token (unique UUID)
- nickname (for pseudonymous users)
- user (optional reference to User)
