# MediSync - MongoDB Setup Quick Start

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account with a cluster (already set up: `demo1` database)
- Your MongoDB connection string: `mongodb+srv://Rumisha:rumisha1125@cluster0.hv4zzlu.mongodb.net/?appName=Cluster0`

## One-Command Setup

The app has been fully configured to work with MongoDB. Just follow these two simple steps:

### Step 1: Seed the Database with Dummy Data
```bash
npm run seed
```

This command will:
- Connect to your MongoDB database
- Create all necessary collections (users, medications, allergies, conditions, files)
- Insert dummy data for testing
- Display success messages in the console

### Step 2: Run the App (Frontend + Backend)
```bash
npm run dev
```

This single command will:
- Start the backend Express server on `http://localhost:5000`
- Start the frontend Vite dev server on `http://localhost:5173`
- Both run simultaneously with hot-reload enabled

## What's Configured

### Backend (Express + MongoDB)
- **Port**: 5000
- **Database**: MongoDB (`demo1` database)
- **API Endpoints**:
  - `POST /api/auth/signup` - Register new user
  - `POST /api/auth/login` - Login user
  - `GET /api/medications` - Get user's medications
  - `POST /api/medications` - Add medication
  - `DELETE /api/medications/:id` - Delete medication
  - `GET /api/allergies` - Get user's allergies
  - `POST /api/allergies` - Add allergy
  - `DELETE /api/allergies/:id` - Delete allergy
  - `GET /api/conditions` - Get medical conditions
  - `POST /api/conditions` - Add condition
  - `DELETE /api/conditions/:id` - Delete condition
  - `GET /api/files` - Get medical files
  - `POST /api/files` - Upload file
  - `DELETE /api/files/:id` - Delete file

### Frontend (React + Vite)
- **Port**: 5173
- **Architecture**: React with routing
- **Storage**: MongoDB backend (no more localStorage)
- **Authentication**: Session-based with email/password

## Test Credentials (from seed data)
- **Email**: john@example.com
- **Password**: password123
- **Email**: jane@example.com
- **Password**: password456

## Troubleshooting

### "Cannot connect to MongoDB"
- Verify your internet connection
- Check MongoDB Atlas is running at https://cloud.mongodb.com
- Ensure IP whitelist includes your IP address
- Check `.env.local` has the correct connection string

### "Port 5000 already in use"
```bash
# Kill the process using port 5000
# On Mac/Linux:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Port 5173 already in use"
The same process as above but for port 5173.

### "Cannot find module 'mongoose'"
```bash
npm install
```

## File Structure

```
/server
  /models          - MongoDB schemas (User, Medication, Allergy, etc.)
  /routes          - API route handlers (auth, medications, allergies, etc.)
  index.ts         - Express server setup
  seed.ts          - Database seeding script
  start.js         - Startup helper

/src
  /pages           - React pages
  /components      - React components
  /lib
    api.ts         - API client functions
    session.ts     - Session/auth management
    store.ts       - UI state management (localStorage for UI only)
```

## Development Commands

```bash
# Run everything (frontend + backend)
npm run dev

# Run only backend server
npm run dev:backend

# Run only frontend
npm run dev:frontend

# Seed database with test data
npm run seed

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

The app uses `.env.local` for configuration:

```env
MONGODB_URI=mongodb+srv://Rumisha:rumisha1125@cluster0.hv4zzlu.mongodb.net/?appName=Cluster0
DB_NAME=demo1
PORT=5000
VITE_API_URL=http://localhost:5000
```

These are already set up for you!

## Next Steps

1. Run `npm run seed` to populate test data
2. Run `npm run dev` to start the app
3. Open `http://localhost:5173` in your browser
4. Login with credentials from the seed data above
5. Explore the app!

## Support

For issues, check:
- MongoDB Atlas dashboard for cluster status
- Browser console for frontend errors (F12)
- Terminal output for backend logs
- Make sure both backend (5000) and frontend (5173) are running

---

Happy coding! 🎉
