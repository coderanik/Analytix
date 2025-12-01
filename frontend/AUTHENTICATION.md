# Authentication Setup

## Overview

The frontend is now fully connected to the backend API with complete authentication flow including login and registration pages.

## What Was Added

### 1. Register Page (`/app/register/page.tsx`)
- Full registration form with validation
- Password confirmation
- Error handling
- Redirects to dashboard after successful registration

### 2. Login Page (`/app/login/page.tsx`)
- Already existed, now fully connected to backend
- Form validation and error handling
- Redirects to dashboard after successful login

### 3. Route Protection
- Created `ProtectedRoute` component (`/components/auth/protected-route.tsx`)
- All dashboard pages are now protected
- Unauthenticated users are redirected to login page

### 4. Auth Context Integration
- AuthProvider added to root layout
- User information displayed in navbar
- Logout functionality added to navbar

### 5. API Integration
- API client already configured (`/lib/api.ts`)
- All endpoints connected to backend at `http://localhost:5000/api`
- JWT token stored in localStorage
- Automatic token inclusion in API requests

## Protected Routes

The following pages require authentication:
- `/` (Dashboard Overview)
- `/analytics`
- `/users`
- `/notifications`
- `/reports`
- `/profile`
- `/settings`

## Public Routes

- `/login` - Redirects to dashboard if already authenticated
- `/register` - Redirects to dashboard if already authenticated

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If not set, it defaults to `http://localhost:5000/api`.

## Usage

### Login Flow

1. User visits `/login`
2. Enters email and password
3. On success:
   - Token stored in localStorage
   - User data stored in localStorage
   - Redirected to dashboard (`/`)

### Register Flow

1. User visits `/register`
2. Fills in name, email, password, and confirm password
3. On success:
   - Token stored in localStorage
   - User data stored in localStorage
   - Redirected to dashboard (`/`)

### Logout Flow

1. User clicks logout in navbar dropdown
2. Token and user data cleared from localStorage
3. Redirected to `/login`

## Testing

### Default Test Credentials

After seeding the backend database:

- **Email**: `alex@example.com`
- **Password**: `password123`
- **Role**: Admin

Or use any other seeded user (all have password: `password123`)

### Test Registration

1. Go to `/register`
2. Fill in the form
3. Submit
4. Should redirect to dashboard

### Test Login

1. Go to `/login`
2. Enter credentials
3. Submit
4. Should redirect to dashboard

## API Endpoints Used

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

## Components

### Auth Context (`/contexts/auth-context.tsx`)

Provides:
- `user` - Current user object
- `token` - JWT token
- `loading` - Loading state
- `isAuthenticated` - Boolean authentication status
- `login(email, password)` - Login function
- `register(name, email, password, role?)` - Register function
- `logout()` - Logout function

### Protected Route (`/components/auth/protected-route.tsx`)

Wraps components that require authentication:
- Shows loading spinner while checking auth
- Redirects to login if not authenticated
- Renders children if authenticated

## Next Steps

1. Make sure backend is running on `http://localhost:5000`
2. Seed the database: `cd backend && npm run seed`
3. Start frontend: `npm run dev`
4. Visit `http://localhost:3000/login` or `/register`

## Troubleshooting

### "Network Error" or "Failed to fetch"
- Make sure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### "Invalid email or password"
- Check credentials
- Make sure database is seeded
- Check backend logs for errors

### Redirect Loop
- Clear localStorage: `localStorage.clear()`
- Check that AuthProvider is in root layout
- Verify ProtectedRoute is working correctly

### Token Expired
- Logout and login again
- Token expires after 30 days (configurable in backend)

