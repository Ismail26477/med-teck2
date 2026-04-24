# MediSync - MongoDB Integration Setup Guide

## Overview
Your MediSync healthcare app has been successfully configured to work with MongoDB. This guide explains everything you need to know to get started.

## Quick Start

### 1. Environment Configuration
Your MongoDB credentials are already configured in the `.env` and `.env.local` files:

```
MONGODB_URI=mongodb+srv://Rumisha:rumisha1125@cluster0.hv4zzlu.mongodb.net/?appName=Cluster0
DB_NAME=demo1
```

### 2. Running the Application

Start the entire application with a single command:

```bash
npm run dev
```

This command will:
- ✅ Start the Express backend server on `http://localhost:5000`
- ✅ Start the Vite frontend development server on `http://localhost:5173`
- ✅ Both servers run concurrently in your terminal

### 3. Database Setup

The database has already been seeded with dummy data. To reseed the database at any time, run:

```bash
npm run seed
```

This will:
- Create/update all required collections in MongoDB
- Populate with realistic healthcare data
- Create test users for login testing

## Testing the Application

### Create a New Account
1. Navigate to http://localhost:5173
2. Click "Sign Up"
3. Fill in the form with any email and password (password must be 6+ characters)
4. Click "Create Health Hub"
5. You'll be redirected to the dashboard

### Login with Demo User
Run the seed script to populate demo users, then login with:
- **Email:** demo@medisync.com
- **Password:** Demo@123456

## Database Collections

The MongoDB database includes the following collections:

### 1. **users**
Stores user account information
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### 2. **medications**
Tracks user medications
```
{
  _id: ObjectId,
  userId: ObjectId (reference to user),
  name: String,
  dosage: String,
  frequency: String,
  prescribedBy: String,
  startDate: Date,
  endDate: Date (optional),
  createdAt: Date
}
```

### 3. **allergies**
Records user allergies
```
{
  _id: ObjectId,
  userId: ObjectId (reference to user),
  allergen: String,
  severity: String (mild/moderate/severe),
  reaction: String,
  createdAt: Date
}
```

### 4. **medicalConditions**
Stores medical conditions/diagnoses
```
{
  _id: ObjectId,
  userId: ObjectId (reference to user),
  condition: String,
  diagnosis Date: Date,
  status: String (active/resolved),
  notes: String,
  createdAt: Date
}
```

### 5. **medicalFiles**
Manages document uploads
```
{
  _id: ObjectId,
  userId: ObjectId (reference to user),
  fileName: String,
  fileType: String,
  uploadDate: Date,
  size: Number,
  createdAt: Date
}
```

## Project Structure

```
medisync/
├── server/
│   ├── models/           # MongoDB Mongoose schemas
│   ├── routes/           # Express API routes
│   ├── index.ts          # Main server file
│   └── seed.ts           # Database seeding script
├── src/
│   ├── pages/            # React pages
│   ├── components/       # React components
│   ├── lib/
│   │   ├── api.ts        # API client for frontend
│   │   ├── session.ts    # Session management
│   │   └── store.ts      # Zustand store (local UI state)
│   └── App.tsx           # Main app component
├── .env                  # MongoDB connection string
├── .env.local            # Local environment overrides
└── package.json          # Dependencies and scripts
```

## Available Scripts

```bash
# Start both frontend and backend
npm run dev

# Start only backend server
npm run dev:backend

# Start only frontend (for separate terminal)
npm run dev:frontend

# Seed database with dummy data
npm run seed

# Build for production
npm run build

# Run tests
npm run test

# Preview production build
npm run preview
```

## API Endpoints

The backend provides the following REST API endpoints:

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Create new account

### Medications
- `GET /api/medications` - Get user's medications
- `POST /api/medications` - Add new medication
- `PUT /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication

### Allergies
- `GET /api/allergies` - Get user's allergies
- `POST /api/allergies` - Add new allergy
- `PUT /api/allergies/:id` - Update allergy
- `DELETE /api/allergies/:id` - Delete allergy

### Medical Conditions
- `GET /api/conditions` - Get user's conditions
- `POST /api/conditions` - Add new condition
- `PUT /api/conditions/:id` - Update condition
- `DELETE /api/conditions/:id` - Delete condition

### Medical Files
- `GET /api/files` - Get user's files
- `POST /api/files` - Upload file
- `DELETE /api/files/:id` - Delete file

## Frontend Architecture

The frontend uses:
- **React** - UI framework
- **React Router** - Navigation
- **Zustand** - Local state management (UI state)
- **Sonner** - Toast notifications
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling

All user data is persisted to MongoDB via the Express backend. Session/authentication state is managed in `sessionManager` (stored in localStorage for convenience).

## Troubleshooting

### "Cannot find module 'mongoose'"
Solution: Run `npm install` to install all dependencies

### "MongooseError: Cannot find module"
Solution: Make sure `.env` file exists with MongoDB URI. Run `npm run seed` to ensure connection works.

### Port Already in Use
If port 5000 or 5173 are already in use:
```bash
# Change backend port in server/index.ts
# Change frontend port in vite.config.ts
```

### Authentication Not Working
1. Ensure the seed script ran successfully: `npm run seed`
2. Check that both servers are running with `npm run dev`
3. Check browser console for API errors
4. Verify `.env` file has correct MongoDB URI

### Data Not Persisting
1. Check MongoDB connection string in `.env`
2. Verify database "demo1" exists in MongoDB Atlas
3. Run `npm run seed` to create collections
4. Check server logs for MongoDB connection errors

## Next Steps

1. **Run the application:**
   ```bash
   npm run dev
   ```

2. **Test login:**
   - Sign up a new account OR
   - Use demo credentials after running seed

3. **Explore the app:**
   - Add medications
   - Record allergies
   - Store medical conditions
   - Upload documents

4. **Customize:**
   - Modify schemas in `server/models/`
   - Add new API routes in `server/routes/`
   - Update frontend pages in `src/pages/`

## Support

For issues or questions:
1. Check the logs in your terminal running `npm run dev`
2. Verify MongoDB connection in `.env`
3. Ensure all dependencies are installed: `npm install`
4. Try restarting with: `npm run dev`

## Technology Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Real-time Updates:** RESTful API (easily upgradeable to WebSockets)
- **Authentication:** Session-based with password hashing (bcrypt)

Happy coding! Your MediSync app is now fully connected to MongoDB! 🚀
