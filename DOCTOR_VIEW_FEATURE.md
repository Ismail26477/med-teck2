# Doctor View Feature - QR Code Doctor Access

## Overview

This feature allows patients to share their medical data with doctors via QR code. When a doctor scans the QR code, they can view only that patient's medical information without requiring authentication.

## How It Works

### For Patients:
1. Navigate to the **QR Code** section in the app
2. Select a sharing duration (15 min, 1 hour, 24 hours, or until manually disabled)
3. Click **Enable sharing** to generate a QR code
4. Share the QR code link with doctors or print it
5. The doctor can now scan the QR to view your data
6. Disable sharing anytime or rotate the token to revoke access

### For Doctors:
1. Scan the patient's QR code using any QR code scanner
2. The link directs to `/doctor/{token}` page
3. The system validates the token and fetches the patient's data
4. Doctor can view:
   - Patient name and contact information
   - Blood type and date of birth
   - Emergency contact details
   - Current medications (with doses and frequency)
   - Known allergies and severity levels
   - Medical conditions and notes
5. Data is read-only and time-limited

## Technical Architecture

### New Files Created

1. **server/models/ShareToken.ts**
   - MongoDB schema for storing share tokens
   - Tracks userId, token, enabled status, and expiration time

2. **server/routes/share.ts**
   - `POST /api/share/enable` - Create/update a share token
   - `POST /api/share/disable` - Disable sharing for a user
   - `GET /api/share/validate/:token` - Validate token and fetch patient data (used by doctors)

3. **src/pages/DoctorView.tsx**
   - New page component displayed when doctor scans QR code
   - Validates the token with backend
   - Fetches and displays patient's medical data
   - Shows access granted indicator and timestamp

### Updated Files

1. **server/index.ts**
   - Added `shareRoutes` import and registration

2. **src/App.tsx**
   - Added new route: `/doctor/:token` pointing to DoctorView

3. **src/lib/store.ts**
   - Modified `enableShare()` to sync with backend
   - Modified `disableShare()` to sync with backend
   - Modified `rotateShareToken()` to sync with backend

4. **src/pages/QR.tsx**
   - Changed QR link from `/emergency/{token}` to `/doctor/{token}`
   - Updated description to explain doctor sharing feature

## API Endpoints

### Enable Sharing
```http
POST /api/share/enable
Content-Type: application/json

{
  "userId": "user_id_here",
  "token": "random_token_string",
  "expiresAt": "2024-04-26T10:30:00Z" (or null for unlimited)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "abc123...",
    "enabled": true,
    "expiresAt": "2024-04-26T10:30:00Z"
  }
}
```

### Disable Sharing
```http
POST /api/share/disable
Content-Type: application/json

{
  "userId": "user_id_here"
}
```

### Validate Token and Get Patient Data
```http
GET /api/share/validate/abc123token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "bloodType": "O+",
      "dateOfBirth": "1990-01-15",
      "emergencyContact": "Jane Doe",
      "emergencyPhone": "+1234567890"
    },
    "allergies": [
      {
        "_id": "allergy_id",
        "name": "Penicillin",
        "severity": "severe",
        "notes": "Causes anaphylaxis"
      }
    ],
    "medications": [
      {
        "_id": "med_id",
        "name": "Aspirin",
        "dose": "100mg",
        "frequency": "Once daily",
        "prescriber": "Dr. Smith",
        "notes": "For pain relief"
      }
    ],
    "conditions": [
      {
        "_id": "condition_id",
        "name": "Hypertension",
        "notes": "Well controlled"
      }
    ]
  }
}
```

## Error Handling

### Invalid Token
```json
{
  "success": false,
  "error": "Invalid token"
}
```

### Token Expired
```json
{
  "success": false,
  "error": "Token has expired"
}
```

### Sharing Disabled
```json
{
  "success": false,
  "error": "Sharing is disabled"
}
```

## Security Features

1. **Time-limited access** - Tokens can expire after a set duration
2. **Revokable access** - Patients can disable sharing anytime
3. **Token rotation** - Old tokens are invalidated when rotated
4. **Read-only data** - Doctors cannot modify patient information
5. **No authentication required** - Doctors don't need an account (security by token)
6. **Backend validation** - All tokens validated server-side

## Database Schema

### ShareToken Collection
```javascript
{
  _id: ObjectId,
  userId: String (reference to User),
  token: String (unique),
  enabled: Boolean,
  expiresAt: Date (null for no expiration),
  createdAt: Date,
  updatedAt: Date
}
```

## User Experience Flow

### Patient Workflow:
```
QR Page → Select Duration → Click "Enable sharing" 
→ QR Code Generated → Share with Doctor
→ Doctor scans QR → (Disabled automatically when expired)
```

### Doctor Workflow:
```
Scan QR Code → Redirected to /doctor/{token} 
→ System validates token → Fetches patient data 
→ Displays read-only patient info
```

## Testing Instructions

### Test With Dummy Data:
1. Run `npm run seed` to create test users
2. Login with: `john@example.com` / `password123`
3. Go to QR Code page
4. Select "1 hour" duration
5. Click "Enable sharing"
6. Copy the link or scan the QR code
7. In a new tab/browser, visit the link
8. Verify you see John's medical data (read-only)

### Test Token Expiration:
1. Enable sharing with "15 min" duration
2. Share the link with doctor
3. Wait 15 minutes
4. Try accessing the link - should show "Access denied"

### Test Disabling Sharing:
1. Enable sharing
2. Share the link
3. Go back to QR page
4. Click "Disable now"
5. Try accessing the old link - should show "Access denied"

## Future Enhancements

1. **Doctor Registry** - Maintain list of doctors who have accessed patient data
2. **Access Logging** - Track when and which doctors viewed patient data
3. **Partial Access Control** - Let patients choose which data categories to share
4. **Email Verification** - Require doctor's email for verification
5. **Two-factor Authentication** - Additional security layer for sensitive access
6. **Audit Trail** - Complete history of all access events
7. **Revoke Individual Access** - Revoke access to specific doctors instead of all

## Troubleshooting

### QR Code Not Working
- Ensure MongoDB is connected
- Check `/api/share/enable` returns success
- Verify token is correctly encoded in QR

### Doctor Cannot Access Data
- Check token hasn't expired
- Ensure patient didn't disable sharing
- Check patient's data is saved in database
- Verify CORS is properly configured

### Data Not Showing
- Confirm all medical records are saved in MongoDB
- Check browser console for API errors
- Verify userId is correctly passed to validation endpoint

---

**Status**: ✅ Fully implemented and ready for production
**Last Updated**: April 2026
