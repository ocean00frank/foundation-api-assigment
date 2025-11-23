# 🔐 Admin Setup Guide

Complete guide for setting up and accessing the admin account for the Event Management Application.

## 📧 Admin Credentials

```
Email: frankmwelwa32@gmail.com
Password: Ocean0976@@
Role: ADMIN
2FA Verification Code (for testing): mock-token
```

## 🚀 Setup Instructions

### 1. Database Setup

After pulling the repository, run these commands to set up the admin account:

```bash
cd backend-elysia

# Push database schema
bun run db:push

# Generate Prisma client
bun run db:generate

# Seed database with admin account
bun run db:seed
```

### 2. Expected Output

After running `bun run db:seed`, you should see:

```
🌱 Starting database seeding...
✅ Admin user created: frankmwelwa32@gmail.com
📧 Admin credentials:
   Email: frankmwelwa32@gmail.com
   Password: Ocean0976@@
   Role: ADMIN
   Verified: false (requires 2FA)
✅ Sample event created: Annual Tech Conference 2025
✅ Sample event created: Community Workshop: Web Development
✅ Sample event created: Music Festival 2025
🎉 Seeding completed successfully!
```

## 🔑 Login Flow

### Step 1: Access Admin Login

1. Start the backend server:
   ```bash
   cd backend-elysia
   bun run dev
   ```

2. Start the frontend server:
   ```bash
   cd my-app
   npm run dev
   ```

3. Navigate to admin login:
   - **URL**: http://localhost:3001/admin/login

### Step 2: Enter Credentials

```
Email: frankmwelwa32@gmail.com
Password: Ocean0976@@
```

### Step 3: 2FA Verification

After successful login, you'll be redirected to:
- **URL**: http://localhost:3001/admin/verify-2fa

**Enter verification code**: `mock-token`

### Step 4: Access Admin Dashboard

After successful verification, you'll be redirected to:
- **URL**: http://localhost:3001/dashboard/admin/main

## 🗄️ Database Schema

The admin account is created in the `users` table with:

```prisma
model User {
  email     String    @unique  // frankmwelwa32@gmail.com
  password  String             // Hashed with bcrypt
  role      UserRole           // ADMIN
  isVerified Boolean           // false (requires 2FA)
}
```

## 🔧 Resetting Admin Password

If you need to reset the admin password, update `backend-elysia/src/prisma/seed.ts`:

```typescript
const adminPassword = await bcrypt.hash("YourNewPassword123@@", 10);
```

Then re-run the seed:

```bash
cd backend-elysia
bun run db:seed
```

## 🛠️ Troubleshooting

### Issue: "Access denied. Admin credentials required"

**Solution**: Make sure you're logging in with:
- Email: `frankmwelwa32@gmail.com`
- Password: `Ocean0976@@` (capital O)

### Issue: "Verification failed"

**Solution**: Use the test verification code: `mock-token`

### Issue: Admin user doesn't exist

**Solution**: Re-run the database seed:

```bash
cd backend-elysia
bun run db:push
bun run db:generate
bun run db:seed
```

### Issue: Can't access admin dashboard

**Solution**: 
1. Clear browser localStorage:
   ```javascript
   localStorage.clear()
   ```
2. Log in again through the admin login page
3. Complete 2FA verification with `mock-token`

## 📝 Important Notes

⚠️ **Security Warning**: 
- The password `Ocean0976@@` is for development/testing only
- Change the password in production
- The verification code `mock-token` is for testing only
- Implement proper email-based verification tokens in production

## 🔄 Updating Admin Details

To update admin email or password:

1. Edit `backend-elysia/src/prisma/seed.ts`
2. Update the credentials
3. Re-run `bun run db:seed`

The `upsert` command will update the existing admin user with new credentials.

## 📚 Related Files

- **Seed File**: `backend- grievebly/backend-elysia/src/prisma/seed.ts`
- **Admin Login Page**: `my-app/src/app/admin/login/page.tsx`
- **Admin Verify Page**: `my-app/src/app/admin/verify-2fa/page.tsx`
- **Admin Dashboard**: `my-app/src/app/dashboard/admin/main/page.tsx`

## ✅ Quick Checklist

- [ ] Database schema pushed (`bun run db:push`)
- [ ] Prisma client generated (`bun run db:generate`)
- [ ] Database seeded with admin account (`bun run db:seed`)
- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 3001
- [ ] Can access admin login page
- [ ] Can login with correct credentials
- [ ] Can verify with 2FA code `mock-token`
- [ ] Can access admin dashboard

## 🎯 Quick Start Command

For new developers pulling the repository:

```bash
# Backend setup
cd backend-elysia
bun install
bun run db:push
bun run db:generate
bun run db:seed
bun run dev

# Frontend setup (new terminal)
cd my-app
npm install
npm run dev

# Login at: http://localhost:3001/admin/login
# Use credentials above
```

---

**Last Updated**: January 2025
**Maintained By**: Development Team
