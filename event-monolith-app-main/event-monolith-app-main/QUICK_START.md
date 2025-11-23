# Quick Start Guide - Event Management Application

Get the Event Management Application up and running in 5 minutes!

## ⚡ Quick Setup (5 Minutes)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend-elysia

# Install dependencies
bun install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Set up database
bun run db:push
bun run db:generate

# Seed database (creates test users)
bun run db:seed

# Start server
bun run dev
```

✅ Backend running on: http://localhost:3000  
✅ API Docs: http://localhost:3000/swagger

### 2. Test Users (from seed)

- **Admin**: `admin@eventapp.com` / `admin123`
- **Organizer**: `organizer@eventapp.com` / `organizer123`
- **Attendee**: `attendee@eventapp.com` / `attendee123`

### 3. Frontend Setup (Optional)

```bash
# Navigate to frontend
cd my-app

# Install dependencies
npm install

# Start server
npm run dev
```

✅ Frontend running on: http://localhost:3001

## 🧪 Quick Test

### Using Browser

Visit http://localhost:3000/swagger and test the API directly!

### Using curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eventapp.com","password":"admin123"}'

# Copy the token, then:

# Get profile
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get events
curl http://localhost:3000/api/events
```

## 🎯 What's Included

✅ JWT Authentication  
✅ User Roles (ADMIN, ORGANIZER, ATTENDEE)  
✅ Event CRUD Operations  
✅ RSVP Functionality  
✅ WebSocket Realtime Updates  
✅ Email Notifications (Mock)  
✅ Swagger API Documentation  
✅ TypeScript Type Safety  
✅ PostgreSQL with Prisma ORM  

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## 🆘 Troubleshooting

**Port already in use?**
```bash
# Change port in .env
PORT=3001
```

**Database connection error?**
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Try using Neon (https://neon.tech)

**Module not found?**
```bash
bun install  # Reinstall dependencies
```

## 🚀 Ready for Production?

See [DEPLOYMENT.md](DEPLOYMENT.md) for deploying to Render.com

## 📖 Learn More

- [Elysia.js Docs](https://elysiajs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Neon Database](https://neon.tech)
- [Render Deployment](https://render.com/docs)

---

**Need Help?** Check the [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions!

