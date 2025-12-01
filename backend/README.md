# SaaS Analytics Dashboard Backend

A fully functional Express.js and Node.js backend API for the SaaS Analytics Dashboard.

## Features

- **Authentication**: JWT-based authentication with user registration and login
- **Dashboard**: KPI metrics, revenue charts, user activity, and traffic sources
- **Analytics**: Detailed analytics with time period filtering
- **User Management**: Full CRUD operations for users with search, filter, and sort
- **Notifications**: Real-time notifications with read/unread status
- **Reports**: Report generation and management
- **Profile**: User profile management
- **Settings**: User preferences and settings management

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/saas-analytics
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

3. Make sure MongoDB is running on your system.

4. Seed the database with initial data:
```bash
npm run seed
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Dashboard
- `GET /api/dashboard/kpis` - Get KPI metrics
- `GET /api/dashboard/revenue` - Get revenue data
- `GET /api/dashboard/activity` - Get user activity data
- `GET /api/dashboard/traffic` - Get traffic source data
- `GET /api/dashboard/users` - Get users table data

### Analytics
- `GET /api/analytics/revenue?period=30d` - Get revenue analytics (period: 24h, 7d, 30d, 90d)
- `GET /api/analytics/activity?period=7d` - Get activity analytics
- `GET /api/analytics/traffic?period=30d` - Get traffic analytics
- `GET /api/analytics/revenue-breakdown` - Get revenue breakdown

### Users
- `GET /api/users` - Get all users (supports search, filter, sort, pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/:id` - Get notification by ID
- `POST /api/notifications` - Create notification (Admin only)
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/scheduled` - Get scheduled reports
- `POST /api/reports` - Generate new report
- `GET /api/reports/:id` - Get report by ID
- `DELETE /api/reports/:id` - Delete report

### Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile
- `GET /api/profile/activity` - Get user activity history

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings
- `PUT /api/settings/password` - Update password
- `PUT /api/settings/2fa` - Toggle 2FA

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Default Users

After seeding, you can login with:
- **Email**: alex@example.com
- **Password**: password123
- **Role**: Admin

Or use any of the other seeded users (all have password: `password123`).

## Database Models

- **User**: User accounts with roles, status, and settings
- **Revenue**: Monthly revenue and target data
- **Activity**: Daily user activity metrics
- **Traffic**: Traffic source data
- **Notification**: System and user notifications
- **Report**: Generated reports

## Development

The backend uses ES6 modules. Make sure your Node.js version supports ES modules (Node 14+).

## License

ISC

