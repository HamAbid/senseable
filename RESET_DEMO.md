# Reset Demo Application

The application has been simplified to remove authentication for demo purposes.

## Steps to Reset:

### 1. Clear Browser Data
Open browser console (F12) and run:
```javascript
localStorage.clear();
location.reload();
```

### 2. Stop and Restart Backend (WSL terminal)
```bash
cd /mnt/c/Users/t-ha/projects/senseable/backend
# Press Ctrl+C to stop the server
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### 3. Stop and Restart Frontend (PowerShell)
```powershell
# Press Ctrl+C to stop the dev server
cd C:\Users\t-ha\projects\senseable\frontend
npm run dev
```

### 4. Delete Old Database (Optional - Fresh Start)
If you want to start completely fresh:
```bash
# In WSL
cd /mnt/c/Users/t-ha/projects/senseable/backend
rm senseable.db
```

Then restart the backend server.

## Testing Registration Flow

1. Go to http://localhost:3000/account
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Select accessibility preferences
3. Click "Create Account & Continue"
4. Should redirect to home page with user info saved

## Current Simplified Architecture

- **No Authentication**: No JWT tokens, no login required
- **Simple User ID**: User ID passed directly in URL paths
- **Auto-create on Register**: If email exists, returns existing user
- **Direct API Calls**: No auth headers needed
- **LocalStorage**: User data persisted in browser only

## API Endpoints

- `POST /api/users/register` - Create new user
- `GET /api/users/profile/{user_id}` - Get user profile
- `PUT /api/users/profile/{user_id}` - Update user profile
- `GET /api/users/preferences/{user_id}` - Get preferences
- `PUT /api/users/preferences/{user_id}` - Update preferences
