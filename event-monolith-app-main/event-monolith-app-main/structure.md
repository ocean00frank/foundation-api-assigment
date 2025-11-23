# Project Structure - Event Management Application

## 📁 Root Directory Structure

```
event-monolith-app/
├── backend-elysia/              # Elysia.js Backend API Server
│   ├── src/
│   │   ├── controllers/         # Business logic handlers
│   │   ├── middleware/          # Authentication & authorization
│   │   ├── routes/              # API route definitions
│   │   ├── services/            # External integrations
│   │   ├── utils/               # Helper functions
│   │   ├── prisma/              # Prisma schema & seed
│   │   └── index.ts             # Main entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                     # Environment variables
│   └── .gitignore
│
├── my-app/                      # Next.js Frontend Application
│   ├── src/
│   │   └── app/                 # Next.js App Router
│   │       ├── api/             # API client utilities
│   │       ├── auth/            # User authentication
│   │       ├── admin/           # Admin authentication
│   │       ├── dashboard/       # Dashboard pages
│   │       │   ├── admin/       # Admin dashboard
│   │       │   │   ├── main/
│   │       │   │   ├── addEvent/
│   │       │   │   ├── approveEvent/
│   │       │   │   └── profile/
│   │       │   └── users/       # User dashboard
│   │       │       ├── main/
│   │       │       ├── submitEvent/
│   │       │       ├── myEvents/
│   │       │       ├── favorite/
│   │       │       ├── notification/
│   │       │       └── profile/
│   │       ├── about/
│   │       ├── contacts/
│   │       ├── services/
│   │       ├── css/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── public/                  # Static files
│   ├── package.json
│   └── tsconfig.json
│
├── 📚 Documentation
├── README.md                    # Main documentation
├── structure.md                 # This file
├── COMPLETE_SETUP_GUIDE.md     # Setup instructions
├── ADMIN_SETUP.md              # Admin configuration
├── FEATURE_IMPLEMENTATION.md   # Features guide
├── DASHBOARDS_STATUS.md        # Dashboard status
└── .gitignore
```

---

## 🎯 Active Components

### Backend: `backend-elysia/`

**Technology**: Elysia.js + Bun + Prisma + PostgreSQL

```
backend-elysia/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts          # Authentication logic
│   │   ├── event.controller.ts         # Event CRUD
│   │   ├── rsvp.controller.ts         # RSVP management
│   │   └── favorite.controller.ts      # Favorites
│   │
│   ├── middleware/
│   │   └── auth.middleware.ts          # JWT authentication
│   │
│   ├── routes/
│   │   ├── auth.routes.ts             # /api/auth/*
│   │   ├── event.routes.ts            # /api/events/*
│   │   ├── rsvp.routes.ts             # /api/events/:id/rsvp
│   │   └── favorite.routes.ts         # /api/favorites/*
│   │
│   ├── services/
│   │   ├── email.service.ts           # Email notifications
│   │   └── websocket.service.ts       # WebSocket
│   │
│   ├── utils/
│   │   └── jwt.utils.ts              # JWT utilities
│   │
│   ├── prisma/
│   │   ├── client.ts                 # Prisma client
│   │   ├── schema.prisma             # Database schema
│   │   └── seed.ts                   # Database seed
│   │
│   └── index.ts                      # Main entry point
│
├── package.json
├── tsconfig.json
└── .env
```

**Commands**:
- `bun run dev` - Start server (port 3000)
- `bun run db:push` - Push schema
- `bun run db:generate` - Generate Prisma client
- `bun run db:seed` - Seed database

---

### Frontend: `my-app/`

**Technology**: Next.js + React + TypeScript

```
my-app/
├── src/app/
│   ├── api/
│   │   └── client.ts                  # API fetch wrapper
│   │
│   ├── auth/                          # User authentication
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify-2fa/page.tsx
│   │
│   ├── admin/                         # Admin authentication
│   │   ├── login/page.tsx
│   │   └── verify-2fa/page.tsx
│   │
│   ├── dashboard/
│   │   ├── layout.tsx                 # Auth check
│   │   │
│   │   ├── admin/                     # Admin dashboard
│   │   │   ├── layout.tsx            # Admin sidebar
│   │   │   ├── main/page.tsx         # All events
│   │   │   ├── addEvent/page.tsx     # Create event
│   │   │   ├── approveEvent/page.tsx # Approve events
│   │   │   └── profile/page.tsx      # Admin profile
│   │   │
│   │   └── users/                     # User dashboard
│   │       ├── main/page.tsx         # Browse events
│   │       ├── submitEvent/page.tsx  # Submit event
│   │       ├── myEvents/page.tsx     # My joined events
│   │       ├── favorite/page.tsx     # Favorite events
│   │       ├── notification/page.tsx # Notifications
│   │       └── profile/page.tsx      # User profile
│   │
│   ├── about/page.tsx
│   ├── contacts/page.tsx
│   ├── services/pageکس.tsx
│   ├── css/
│   ├── layout.tsx
│   └── page.tsx
│
└── public/
    ├── logo.svg
    └── icons/
```

**Commands**:
- `npm run dev` - Start server (port 3001)
- `npm run build` - Build for production

---

## 🗄️ Database Schema

### Models

```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  role      UserRole  @default(ATTENDEE)
  isVerified Boolean  @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  organizedEvents Event[]
  rsvps     RSVP[]
  favorites EventFavorite[]
}

model Event {
  id          String    @id @default(uuid())
  title       String
  description String
  date        DateTime
  location    String
  image       String?
  organizerId String
  approved    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  organizer   User
  rsvps       RSVP[]
  favorites   EventFavorite[]
}

model EventFavorite {
  id        String   @id @default(uuid())
  userId    String
  eventId   String
  createdAt DateTime @default(now())
  user      User
  event     Event
  @@unique([userId, eventId])
}

model RSVP {
  id        String      @id @default(uuid())
  userId    String
  eventId   String
  status    RSVPStatus
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  user      User
  event     Event
  @@unique([userId, eventId])
}

enum UserRole {
  ADMIN
  ORGANIZER
  ATTENDEE
}

enum RSVPStatus {
  GOING
  MAYBE
  NOT_GOING
}
```

---

## 🌐 API Routes

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify 2FA
- `GET /api/auth/profile` - Get profile

### Events
- `GET /api/events` - List approved events
- `GET /api/events/all` - List all events (admin)
- `GET /api/events/:id` - Get event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/approve` - Approve event (admin)

### RSVP
- `POST /api/events/:id/rsvp` - RSVP to event
- `GET /api/events/user/rsvps` - Get user RSVPs
- `GET /api/events/:id/rsvps` - Get event RSVPs

### Favorites
- `GET /api/favorites` - Get favorites
- `POST /api/favorites/:id` - Add favorite
- `DELETE /api/favorites/:id` - Remove favorite

---

## 🎯 User Roles

- **ADMIN** - Can create, approve, delete events
- **ORGANIZER** - Can create events
- **ATTENDEE** - Can view and RSVP to events

---

## 🔐 Test Accounts

**Admin**:
- Email: `frankmwelwa32@gmail.com`
- Password: `Ocean0976@@`

**User** (created via registration):
- Register at confederal `/auth/register`
- Admin approval required for events

---

## 🚀 Quick Start

```bash
# Backend
cd backend-elysia
bun install
bun run db:push
bun run db:generate
bun run db:seed
bun run dev

# Frontend (new terminal)
cd my-app
npm install
npm run dev
```

**Access**:
- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- Admin: http://localhost:3001/admin/login

---

## 📖 Documentation

- **Setup**: See `COMPLETE_SETUP_GUIDE.md`
- **Admin**: See `ADMIN_SETUP.md`
- **Features**: See `FEATURE_IMPLEMENTATION.md`
- **Dashboard Status**: See `DASHBOARDS_STATUS.md`
