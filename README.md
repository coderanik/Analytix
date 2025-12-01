# SaaS Analytics Dashboard

A modern, full-stack SaaS analytics dashboard built with Next.js and Express.js. This application provides comprehensive business analytics, user management, reporting, and real-time insights for SaaS businesses.

![Dashboard Preview](https://img.shields.io/badge/Dashboard-Modern-blue) ![Next.js](https://img.shields.io/badge/Next.js-16.0-black) ![Express](https://img.shields.io/badge/Express-4.18-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)

## 🚀 Features

### Dashboard & Analytics
- **Real-time KPIs**: Revenue, active users, conversion rate, and retention metrics
- **Interactive Charts**: Revenue trends, user activity, and traffic source visualizations
- **Time Period Filtering**: View analytics for 24h, 7d, 30d, and 90d periods
- **Revenue Breakdown**: Detailed revenue analysis by source and category

### User Management
- **User CRUD Operations**: Create, read, update, and delete users
- **Advanced Filtering**: Search, filter by status, and sort users
- **Role-based Access**: Admin, Editor, and User roles with appropriate permissions
- **User Activity Tracking**: Monitor user engagement and activity patterns

### Reports
- **Report Generation**: Create custom reports (Revenue, Analytics, Growth, Team)
- **Download Reports**: Export reports as PDF files
- **Scheduled Reports**: Set up automated report generation
- **Report Management**: View, download, and delete reports

### Notifications
- **Real-time Notifications**: Get instant updates on important events
- **Read/Unread Status**: Track notification status
- **Notification Management**: Mark as read, delete, or mark all as read

### Profile & Settings
- **User Profiles**: Manage personal information and preferences
- **Currency Settings**: Multi-currency support with global currency switching
- **Theme Customization**: Light and dark mode support
- **Timezone & Language**: Configure timezone and language preferences
- **Password Management**: Secure password updates

### Security
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Route-level access control
- **Password Hashing**: bcryptjs for secure password storage
- **Role-based Authorization**: Fine-grained access control

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0 (React 19)
- **Styling**: Tailwind CSS 4.1
- **UI Components**: Radix UI primitives
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State Management**: React Context API
- **TypeScript**: Full type safety

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 4.18
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcryptjs
- **Validation**: express-validator

## 📁 Project Structure

```
saas-analytics-dashboard/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth and error handling
│   ├── models/          # MongoDB models
│   ├── routes/          # API route handlers
│   ├── scripts/         # Database seeding
│   └── server.js        # Express server
├── frontend/
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   │   ├── dashboard/   # Dashboard components
│   │   ├── pages/       # Page components
│   │   └── ui/          # Reusable UI components
│   ├── contexts/        # React contexts (Auth, Currency)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and API client
│   └── public/          # Static assets
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** v14 or higher
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd saas-analytics-dashboard
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Backend Environment Variables**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/saas-analytics
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   NODE_ENV=development
   ```

   **Note**: For MongoDB Atlas, use your Atlas connection string.

2. **Frontend Environment Variables**

   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

### Database Setup

1. **Start MongoDB**
   
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
   
   Or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud).

2. **Seed the Database**
   ```bash
   cd backend
   npm run seed
   ```
   
   This creates:
   - 8 sample users (password: `password123`)
   - Revenue data for the current year
   - User activity data
   - Traffic source data
   - Sample notifications

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev    # Development mode with auto-reload
   # or
   npm start      # Production mode
   ```
   
   Backend runs on `http://localhost:5001`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   
   Frontend runs on `http://localhost:3000`

3. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🔐 Default Login Credentials

After seeding the database, you can login with:

| Email | Password | Role |
|-------|----------|------|
| alex@example.com | password123 | Admin |
| sarah@example.com | password123 | User |
| emily@example.com | password123 | Editor |

**Note**: All seeded users have the password `password123`

## 📡 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

#### Dashboard
- `GET /api/dashboard/kpis` - Get KPI metrics
- `GET /api/dashboard/revenue` - Get revenue data
- `GET /api/dashboard/activity` - Get user activity data
- `GET /api/dashboard/traffic` - Get traffic source data
- `GET /api/dashboard/users` - Get users table data

#### Analytics
- `GET /api/analytics/revenue?period=30d` - Get revenue analytics
- `GET /api/analytics/activity?period=7d` - Get activity analytics
- `GET /api/analytics/traffic?period=30d` - Get traffic analytics
- `GET /api/analytics/revenue-breakdown` - Get revenue breakdown

**Period options**: `24h`, `7d`, `30d`, `90d`

#### Users
- `GET /api/users` - Get all users (supports search, filter, sort, pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

#### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/:id` - Get notification by ID
- `POST /api/notifications` - Create notification (Admin only)
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

#### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/scheduled` - Get scheduled reports
- `POST /api/reports` - Generate new report
- `GET /api/reports/:id` - Get report by ID
- `GET /api/reports/:id/download` - Download report PDF
- `DELETE /api/reports/:id` - Delete report

#### Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile
- `GET /api/profile/activity` - Get user activity history

#### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings
- `PUT /api/settings/password` - Update password
- `PUT /api/settings/2fa` - Toggle 2FA

For detailed API documentation, see [backend/README.md](./backend/README.md)

## 🎨 Frontend Features

### Pages
- **Dashboard/Overview**: Main analytics dashboard with KPIs and charts
- **Analytics**: Detailed analytics with time period filtering
- **Users**: User management with search, filter, and sort
- **Reports**: Report generation and management
- **Notifications**: Notification center
- **Profile**: User profile management
- **Settings**: Application settings and preferences
- **Help**: Help and documentation

### Key Components
- **Currency Context**: Global currency state management with multi-currency support
- **Auth Context**: Authentication state and user management
- **Theme Provider**: Light/dark mode support
- **Protected Routes**: Route-level authentication
- **Responsive Design**: Mobile-first, fully responsive UI

## 🧪 Development

### Backend Development
```bash
cd backend
npm run dev    # Starts with nodemon (auto-reload)
```

### Frontend Development
```bash
cd frontend
npm run dev    # Next.js development server
```

### Building for Production

**Backend**:
```bash
cd backend
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
npm start
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/saas-analytics
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 📦 Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Seed database with sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check your Atlas connection string
- Verify `MONGODB_URI` in `.env` is correct
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the `PORT` in backend `.env` to a different port (e.g., 5001)
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local` accordingly

### Module Not Found
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### CORS Issues
- Ensure backend CORS is configured correctly
- Check that `NEXT_PUBLIC_API_URL` matches your backend URL

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible (Atlas recommended for production)
3. Use a strong `JWT_SECRET` in production
4. Set `NODE_ENV=production`

### Frontend Deployment
1. Set `NEXT_PUBLIC_API_URL` to your production API URL
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or your preferred platform

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using Next.js and Express.js**

