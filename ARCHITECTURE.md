# System Architecture Diagram

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR BROWSER                            │
│  http://localhost:5173 (Vite Frontend)                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    HTTP Requests/JSON
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              EXPRESS BACKEND (Node.js)                          │
│              http://localhost:3001                              │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ API Routes (server/routes/)                           │   │
│  │ ├── POST   /api/auth/login                            │   │
│  │ ├── POST   /api/auth/signup                           │   │
│  │ ├── GET    /api/medications/:userId                   │   │
│  │ ├── POST   /api/medications/:userId                   │   │
│  │ ├── GET    /api/allergies/:userId                     │   │
│  │ ├── POST   /api/allergies/:userId                     │   │
│  │ ├── GET    /api/conditions/:userId                    │   │
│  │ ├── POST   /api/conditions/:userId                    │   │
│  │ ├── GET    /api/files/:userId                         │   │
│  │ └── POST   /api/files/:userId                         │   │
│  └────────────────────────────────────────────────────────┘   │
│                          │                                      │
│              Mongoose ODM (MongoDB Driver)                      │
│                          │                                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    MongoDB Wire Protocol
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│            MONGODB ATLAS (Cloud Database)                       │
│  mongodb+srv://Rumisha:rumisha1125@cluster0.hv4zzlu...         │
│  Database: demo1                                                │
│                                                                 │
│  Collections:                                                   │
│  ├── users (User documents)                                    │
│  ├── medications (Medication documents)                        │
│  ├── allergies (Allergy documents)                             │
│  ├── medicalconditions (Condition documents)                   │
│  └── medicalfiles (File documents)                             │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

```
REACT (src/)
│
├── pages/
│   ├── Login.tsx          ──────┐
│   ├── Signup.tsx         ──────┤ Connected to API
│   ├── Dashboard.tsx      ──────┤
│   ├── Medications.tsx    ──────┤
│   ├── Allergies.tsx      ──────┤
│   ├── Settings.tsx       ──────┤
│   └── ...                ──────┘
│
├── components/
│   ├── AppShell.tsx       ─────► Session Manager (knows if user is logged in)
│   ├── ProtectedRoute.tsx ─────► Guards pages (requires login)
│   └── ...
│
└── lib/
    ├── api.ts            ─────► Calls backend API (http://localhost:3001)
    ├── session.ts        ─────► Manages login state
    └── store.ts          ─────► Local UI state (zustand)
```

## Backend Architecture

```
EXPRESS SERVER (server/)
│
├── index.ts              ─────► Main server, connects to MongoDB
│
├── routes/
│   ├── auth.ts           ─────► Handles login/signup
│   ├── medications.ts    ─────► CRUD for medications
│   ├── allergies.ts      ─────► CRUD for allergies
│   ├── conditions.ts     ─────► CRUD for conditions
│   └── files.ts          ─────► CRUD for files
│
├── models/
│   ├── User.ts           ─────► MongoDB schema for users
│   ├── Medication.ts     ─────► MongoDB schema for medications
│   ├── Allergy.ts        ─────► MongoDB schema for allergies
│   ├── MedicalCondition.ts ──► MongoDB schema for conditions
│   └── MedicalFile.ts    ─────► MongoDB schema for files
│
└── seed.ts               ─────► Populates database with dummy data
```

## Data Flow Diagram

### Flow 1: User Login

```
User enters email/password
          ↓
    (Login.tsx)
          ↓
 api.ts calls POST /api/auth/login
          ↓
    (server/routes/auth.ts)
          ↓
    Finds user in MongoDB
          ↓
  Checks password hash
          ↓
Returns user data to frontend
          ↓
session.ts stores user info (localStorage)
          ↓
   User redirected to /dashboard
```

### Flow 2: Add New Medication

```
User fills medication form
          ↓
  (Medications.tsx)
          ↓
 api.ts calls POST /api/medications/:userId
          ↓
  (server/routes/medications.ts)
          ↓
  Validates medication data
          ↓
  Saves to MongoDB using Medication.ts model
          ↓
Returns saved medication to frontend
          ↓
Frontend updates UI with new medication
```

### Flow 3: View Protected Page

```
User navigates to /allergies
          ↓
  (App.tsx Router)
          ↓
 ProtectedRoute component checks:
 Is user logged in? (checks session.ts)
          ↓
      YES ─────► Load page (Allergies.tsx)
      │           Page calls api.ts to fetch allergies
      │           Display data from MongoDB
      │
      NO ──────► Redirect to /login
```

## Communication Protocols

### Frontend → Backend (HTTP/JSON)

Example Login Request:
```json
POST /api/auth/login HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Example Response:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Backend → MongoDB (Mongoose/Wire Protocol)

Example Medication Document:
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  name: "Aspirin",
  dosage: "500mg",
  frequency: "Daily",
  reason: "Pain relief",
  startDate: ISODate("2024-01-15T00:00:00Z"),
  endDate: null,
  notes: "Take with food",
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

## Environment Configuration

```
.env (Root)
├── MONGODB_URI         ─ MongoDB connection string with credentials
├── MONGODB_DB          ─ Database name (demo1)
├── PORT                ─ Backend server port (3001)
├── NODE_ENV            ─ Environment (development/production)
└── VITE_API_URL        ─ Frontend API base URL (http://localhost:3001)
```

## Port Allocation

```
Port 3001   ◄─────── Express Backend Server
            │
            ├─► Handles all /api/* requests
            ├─► Connected to MongoDB Atlas
            └─► REST API endpoints

Port 5173   ◄─────── Vite Frontend Dev Server
            │
            ├─► React application
            ├─► Makes HTTP calls to port 3001
            └─► Hot reload during development
```

## Component Dependencies

```
App.tsx (Main Router)
├── ProtectedRoute.tsx
│   └── Checks session.ts
│       └── Protected Pages
│           ├── Dashboard.tsx ──────┐
│           ├── Medications.tsx     │
│           ├── Allergies.tsx       ├─ Call api.ts
│           ├── Settings.tsx        │
│           └── ...                 │
│                                   ▼
│                               lib/api.ts
│                               (HTTP calls)
│                                   │
│                           ──────────┘
│
├── Login.tsx ─────────────┐
│   │                      │
│   └──► Calls api.ts ─────┼──► Express Server
│       Calls session.ts ──┤    (port 3001)
│                          │
├── Signup.tsx ────────────┤
│   │                      │
│   └──► Calls api.ts ─────┤
│       Calls session.ts ──┘
│
└── AppShell.tsx
    ├── Reads session.ts (knows user)
    └── Logout clears session.ts
```

## Session Management Flow

```
┌─────────────────────────────────────────┐
│      Browser LocalStorage               │
│  (Managed by session.ts)                │
│                                         │
│  {                                      │
│    "userId": "507f1f77bcf86cd799439",  │
│    "email": "john@example.com",        │
│    "name": "John Doe"                  │
│  }                                      │
└─────────────────────────────────────────┘
              │         ▲
              │         │
         Read │         │ Write
              │         │
              ▼         │
┌─────────────────────────────────────────┐
│      session.ts Functions               │
│                                         │
│  ├── setSession(user)                  │
│  ├── getSession()                      │
│  ├── isLoggedIn()                      │
│  ├── clearSession() [on logout]        │
│  └── sessionManager.userId [access]    │
└─────────────────────────────────────────┘
              │         ▲
              │         │
         Used │ Returns │
              │         │
              ▼         │
┌─────────────────────────────────────────┐
│      React Components                   │
│  (Pages, AppShell, ProtectedRoute)      │
│                                         │
│  Check if logged in:                   │
│  if (sessionManager.isLoggedIn()) { }  │
│                                         │
│  Get user data:                        │
│  const userId = sessionManager.userId  │
└─────────────────────────────────────────┘
```

## One Command Execution

```bash
$ npm run dev

Concurrently runs:

┌─ npm run dev:backend ──────────────────┐
│ ts-node server/index.ts                │
│                                        │
│ ✓ Connects to MongoDB Atlas            │
│ ✓ Starts Express on port 3001          │
│ ✓ All /api/* routes ready             │
│ ✓ Hot reload on code changes          │
└────────────────────────────────────────┘
         ▲                 ▲
         │                 │
    Runs Parallel      Runs Parallel
         │                 │
         ▼                 ▼
┌─ npm run dev:frontend ─────────────────┐
│ vite                                   │
│                                        │
│ ✓ Starts React dev server on 5173     │
│ ✓ Makes HTTP calls to port 3001       │
│ ✓ Hot reload on code changes          │
└────────────────────────────────────────┘
```

---

**Total System:** Frontend (React) ↔ Backend (Express) ↔ Database (MongoDB Atlas)

All running with `npm run dev` ✨
