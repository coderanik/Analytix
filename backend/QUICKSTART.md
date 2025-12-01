# Quick Start Guide

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (running locally or MongoDB Atlas connection string)

## Setup Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/saas-analytics
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

**Note**: If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

### 3. Start MongoDB

Make sure MongoDB is running:

**macOS (Homebrew)**:
```bash
brew services start mongodb-community
```

**Linux**:
```bash
sudo systemctl start mongod
```

**Windows**:
```bash
net start MongoDB
```

Or use MongoDB Atlas (cloud) - no local installation needed.

### 4. Seed the Database

Populate the database with initial data:

```bash
npm run seed
```

This will create:
- 8 sample users (all with password: `password123`)
- Revenue data for the current year
- User activity data
- Traffic source data
- Sample notifications

### 5. Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## Testing the API

### 1. Health Check

```bash
curl http://localhost:5000/health
```

### 2. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response.

### 4. Get Dashboard KPIs

```bash
curl http://localhost:5000/api/dashboard/kpis
```

### 5. Get Users (with authentication)

```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Default Login Credentials

After seeding, you can login with any of these:

| Email | Password | Role |
|-------|----------|------|
| alex@example.com | password123 | Admin |
| sarah@example.com | password123 | User |
| emily@example.com | password123 | Editor |

## API Base URL

All API endpoints are prefixed with `/api`:

- Authentication: `/api/auth/*`
- Dashboard: `/api/dashboard/*`
- Analytics: `/api/analytics/*`
- Users: `/api/users/*`
- Notifications: `/api/notifications/*`
- Reports: `/api/reports/*`
- Profile: `/api/profile/*`
- Settings: `/api/settings/*`

## Connecting Frontend

Update your frontend to point to the backend API:

1. Create an API client in your frontend
2. Set the base URL to `http://localhost:5000/api`
3. Include JWT token in Authorization header for protected routes

Example frontend API call:

```javascript
const response = await fetch('http://localhost:5000/api/dashboard/kpis', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Troubleshooting

### MongoDB Connection Error

- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use

Change the `PORT` in `.env` to a different port (e.g., 5001)

### Module Not Found

Run `npm install` again to ensure all dependencies are installed

## Next Steps

1. Review the full API documentation in `README.md`
2. Integrate the backend with your frontend
3. Customize the data models as needed
4. Add additional features and endpoints

