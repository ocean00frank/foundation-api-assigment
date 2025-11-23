# How to Run the Application

Simple guide to start both servers.

## 🚀 Quick Start (2 Simple Steps)

### Step 1: Start Backend (Port 3000)

Open Terminal 1:

```bash
# Navigate to backend directory
cd backend-elysia

# Install dependencies (first time only)
bun install

# Set up database (first time only)
bun run db:push
bun run db:generate
bun run db:seed

# Start the server
bun run dev
```

**You should see:**
```
🚀 Server is running on http://localhost:3000
📚 API Documentation: http://localhost:3000/swagger
🔌 WebSocket Endpoint: ws://localhost:3000/ws
```

✅ **Keep this terminal open!**

---

### Step 2: Start Frontend (Port 3001)

Open Terminal 2:

```bash
# Navigate to frontend directory
cd my-app

# Install dependencies (first time only)
npm install

# Start the server
npm run dev
```

**You should see:**
```
✓ Ready in XXXms
✓ Local: http://localhost:3001
```

✅ **Keep this terminal open!**

---

## 🎯 Access the Application

Open your browser and visit:

- **Frontend**: http://localhost:3001
- **API Docs**: http://localhost:3000/swagger

## 👤 Test Users (From Database Seed)

Login credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@eventapp.com | admin123 |
| **Organizer** | organizer@eventapp.com | organizer123 |
| **Attendee** | attendee@eventapp.com | attendee123 |

## 📋 What Each Server Does

### Backend (Port 3000) - Elysia.js
- Handles API requests
- Database operations
- Authentication (JWT)
- WebSocket for realtime updates
- Serves Swagger documentation

### Frontend (Port 3001) - Next.js
- User interface
- Pages and components
- Calls backend API
- Manages state and routing

## 🛑 How to Stop

Press `Ctrl+C` in each terminal to stop the servers.

## 🔧 First Time Setup

If you haven't set up yet, run these commands **once**:

```bash
# Terminal 1: Backend Setup
cd backend-elysia
bun install                  # Install dependencies
cp .env.example .env        # Create .env file
# Edit .env with your database credentials
bun run db:push             # Create database tables
bun run db:generate         # Generate Prisma client
bun run db:seed             # Add test users

# Terminal 2: Frontend Setup
cd my-app
npm install                 # Install dependencies
```

## 🆘 Troubleshooting

### Backend won't start?

```bash
# Check if Bun is installed
bun --version

# If not installed: Install from https://bun.sh
# Or use npm instead:
cd backend-elysia
npm install
npm run dev
```

### Frontend won't start?

```bash
# Delete node_modules and reinstall
cd my-app
rm -rf node_modules
npm install
npm run dev
```

### Port already in use?

Change the port in:
- **Backend**: Edit `backend-elysia/.env` → `PORT=3001`
- **Frontend**: Edit `my-app/.env.local` → Port will adjust automatically

### Database connection error?

1. Check `.env` file exists in `backend-elysia/`
2. Verify `DATABASE_URL` is correct
3. Ensure PostgreSQL is running (if using local)
4. Or use Neon cloud database (free tier)

## 📚 More Information

- See `SETUP_GUIDE.md` for detailed instructions
- See `QUICK_START.md` for setup in 5 minutes
- See `structure.md` for project organization

## ✅ Checklist

- [ ] Backend running on http://localhost:3000
- [ ] Frontend running on http://localhost:3001
- [ ] Can access Swagger docs at /swagger
- [ ] Can login with test users
- [ ] Dashboard loads successfully

## 🎉 Ready!

Your Event Management Application is now running!

**Next Steps:**
1. Test login with provided credentials
2. Create an event (as organizer)
3. RSVP to events
4. Check WebSocket updates

