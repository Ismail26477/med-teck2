# MediSync - MongoDB Setup Guide

## Overview
This healthcare application (MediSync) is now connected to MongoDB for persistent data storage. Both frontend (React/Vite) and backend (Express/Node.js) run with a single command.

## Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)
- MongoDB Atlas account with database "demo1" created

## MongoDB Credentials
Database: `demo1`
Connection String: `mongodb+srv://Rumisha:rumisha1125@cluster0.hv4zzlu.mongodb.net/?appName=Cluster0`

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database with Dummy Data
Before running the app, populate the database with sample data:
```bash
npm run seed
```

This will create:
- 2 test users (for login/testing)
- Sample medications
- Sample allergies  
- Sample medical conditions
- Sample medical files

**Test Credentials:**
- Email: `user1@example.com` | Password: `password123`
- Email: `user2@example.com` | Password: `password123`

### 3. Start Development Server
Run both backend and frontend with one command:
```bash
npm run dev
```

The app will start on:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend + backend together |
| `npm run dev:frontend` | Run only frontend (Vite) |
| `npm run dev:backend` | Run only backend (Express) |
| `npm run seed` | Populate database with dummy data |
| `npm run build` | Build frontend for production |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

## Database Collections

The app creates these MongoDB collections:

1. **users** - User accounts and authentication
   - email, name, password, createdAt, updatedAt

2. **medications** - Medication records
   - userId, name, dosage, frequency, prescribedDate, notes

3. **allergies** - Allergy information
   - userId, name, severity, reaction, notes

4. **medicalconditions** - Chronic conditions
   - userId, name, diagnosisDate, status, notes

5. **medicalfiles** - Document storage
   - userId, fileName, fileType, uploadDate, content

## Features

✓ User authentication (login/signup)
✓ Medication management
✓ Allergy tracking
✓ Medical condition management
✓ Medical file uploads
✓ QR code generation
✓ Health reports
✓ Emergency contacts
✓ Search and filtering

## Troubleshooting

### "Connection refused" error
- Make sure backend is running: `npm run dev:backend`
- Check if port 3001 is not in use
- Verify MongoDB connection string in `.env`

### "Cannot find module" errors
- Run `npm install` again
- Delete node_modules and package-lock.json, then reinstall

### Database is empty
- Run `npm run seed` to populate with test data

### Port already in use
- Frontend uses port 5173 (configurable in vite.config.ts)
- Backend uses port 3001 (configurable in server/index.ts)

## Environment Variables

The `.env` file contains:
```
MONGODB_URI=mongodb+srv://Rumisha:rumisha1125@cluster0.hv4zzlu.mongodb.net/?appName=Cluster0
DB_NAME=demo1
PORT=3001
```

## Project Structure

```
├── src/                 # React frontend
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── lib/            # Utilities (api.ts, session.ts, store.ts)
│   └── main.tsx        # Entry point
├── server/             # Express backend
│   ├── index.ts        # Main server file
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   └── seed.ts         # Database seeding script
└── package.json        # Dependencies and scripts
```

## API Endpoints

All API endpoints are prefixed with `/api/v1/`

### Auth
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user

### Medications
- `GET /api/v1/medications/:userId` - Get user medications
- `POST /api/v1/medications` - Add medication
- `PUT /api/v1/medications/:id` - Update medication
- `DELETE /api/v1/medications/:id` - Delete medication

### Allergies
- `GET /api/v1/allergies/:userId` - Get user allergies
- `POST /api/v1/allergies` - Add allergy
- `PUT /api/v1/allergies/:id` - Update allergy
- `DELETE /api/v1/allergies/:id` - Delete allergy

(Similar structure for conditions and files)

## Next Steps

1. Start the app: `npm run dev`
2. Login with test credentials
3. Explore features and verify everything works
4. Modify dummy data in `server/seed.ts` as needed
5. Deploy to Vercel when ready

For production deployment, update environment variables in your hosting platform.
