# Admin Credentials

## Default Admin Account

This file documents the admin credentials used for accessing the Cyberztalk admin panel.

### Admin Login Details

| Field | Value |
|-------|-------|
| **Email** | `elena.vasquez@cyberztalk.com` |
| **Password** | `SecurePassword123!` |
| **Role** | `admin` |
| **Access URL** | `http://localhost:3000/admin-dashboard.html` |

---

## How Admin Authentication Works

1. **User Login**: Admin enters email and password on the login page
2. **Backend Validation**: Backend validates credentials against MongoDB Atlas
3. **Role Check**: If credentials match and role = 'admin', user is granted admin token
4. **Auto-Redirect**: After successful login, admin is automatically redirected to `/admin-dashboard.html`
5. **Session Management**: Admin session is stored in localStorage with authToken and currentUser

---

## Database Seeding

The admin account is automatically created when running:

```bash
node seedDatabase.js
```

This script seeds the following admin user in MongoDB Atlas:
- **Name**: Elena Vasquez
- **Email**: elena.vasquez@cyberztalk.com
- **Password**: SecurePassword123! (hashed in database)
- **Phone**: +1-555-0125
- **Status**: Verified & Active

---

## Testing Admin Login

1. Start the backend server: `npm start` or `node server.js`
2. Open login page: `http://localhost:3000/login.html`
3. Enter admin credentials:
   - Email: `elena.vasquez@cyberztalk.com`
   - Password: `SecurePassword123!`
4. Click "Sign In"
5. You will be automatically redirected to: `http://localhost:3000/admin-dashboard.html`

---

## Authentication Flow

### Login Process (login.html)
```javascript
// When admin credentials are submitted:
if (result.success) {
    localStorage.setItem('authToken', result.data.token);
    localStorage.setItem('currentUser', JSON.stringify(result.data.user));
    
    // Check user role
    if (result.data?.user?.role === 'admin') {
        window.location.href = 'admin-dashboard.html'; // Admin redirect
    } else {
        window.location.href = 'index.html'; // Regular user redirect
    }
}
```

### Navigation State (js/authNav.js)
After login, the nav automatically:
- Hides "Login" and "Get Started" buttons
- Shows "Admin Panel" link (for admin users)
- Shows "Logout" button

---

## Changing Admin Password

To change the admin password:

1. Update `seedDatabase.js` password field
2. Re-run: `node seedDatabase.js`
3. Or manually update the user in MongoDB Atlas

---

## Multiple Admin Accounts

To create additional admin accounts, add them to the `demoUsers` array in `seedDatabase.js`:

```javascript
{
    fullName: 'New Admin Name',
    email: 'newadmin@cyberztalk.com',
    password: 'SecurePassword123!',
    phone: '+1-555-0126',
    role: 'admin',
    isVerified: true,
    isActive: true
}
```

Then run: `node seedDatabase.js`

---

## Security Notes

⚠️ **Important**:
- Change default admin password in production
- Never commit real admin credentials to version control
- Use environment variables for sensitive data
- Implement password reset functionality
- Enable 2FA for production

---

## Related Files

- Backend: `backend/controllers/authController.js` (login logic)
- Frontend: `login.html` (login form & redirect)
- Navigation: `js/authNav.js` (auth state management)
- Seeding: `seedDatabase.js` (admin account creation)
- Database: MongoDB Atlas (credentials stored with hashed passwords)

---

**Last Updated**: 2026-06-20
