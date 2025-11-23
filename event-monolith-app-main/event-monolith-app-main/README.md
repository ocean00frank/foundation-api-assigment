# Event Management Monolith Application

A full-stack event management application demonstrating modern software design principles, authentication, user roles, and realtime features. This monolith application uses Elysia.js for the backend API and Next.js for the frontend.

## 🏗️ Project Structure

```
event-monolith-app/
├── backend-elysia/          # New Elysia.js backend (assignment requirement)
│   ├── src/
│   │   ├── controllers/     # Business logic (auth, events, RSVP)
│   │   ├── middleware/      # Authentication & authorization
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # External integrations (email, websockets)
│   │   ├── utils/           # Helper functions
│   │   ├── prisma/          # Prisma schema and seed
│   │   └── index.ts         # Main server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── my-app/                  # Next.js frontend
│   ├── src/
│   │   └── app/             # Next.js app router
│   ├── package.json
│   └── tsconfig.json
├── my-app/backend/          # Legacy Django backend (not used - kept for reference only)
├── README.md                # This file
└── render.yaml              # Render deployment config
```

## 🎯 Key Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **User Roles** - ADMIN, ORGANIZER, ATTENDEE with role-based access control
- ✅ **Event Management** - Create, update, delete, and approve events
- ✅ **RSVP System** - RSVP with status (GOING, MAYBE, NOT_GOING)
- ✅ **Realtime Updates** - WebSocket support for live updates
- ✅ **Email Notifications** - Mock email service using Ethereal
- ✅ **API Documentation** - Auto-generated Swagger docs
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Database** - PostgreSQL with Prisma ORM

## 🚀 Quick Start

### Prerequisites

- **Bun** runtime ([install here](https://bun.sh))
- **PostgreSQL** database (local or Neon free tier)
- **Node.js** 18+ (if not using Bun)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend-elysia

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up database
bun run db:push
bun run db:generate

# Seed database (optional)
bun run db:seed

# Start development server
bun run dev
```

The backend will run on `http://localhost:3000`

**Test Users (from seed):**
- Admin: `admin@eventapp.com` / `admin123`
- Organizer: `organizer@eventapp.com` / `organizer123`
- Attendee: `attendee@eventapp.com` / `attendee123`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3001`

## 📚 API Documentation

Once the backend is running, visit:

- **Swagger UI**: http://localhost:3000/swagger
- **API Base**: http://localhost:3000
- **WebSocket**: ws://localhost:3000/ws

## 🔐 Authentication

The backend uses JWT (JSON Web Tokens) for authentication.

### Signup

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "role": "ATTENDEE"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Using the Token

Include the token in the Authorization header:

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎫 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Events
- `GET /api/events` - Get all approved events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (Organizer/Admin)
- `PUT /api/events/:id` - Update event (Organizer/Admin)
- `DELETE /api/events/:id` - Delete event (Organizer/Admin)
- `POST /api/events/:id/approve` - Approve event (Admin only)

### RSVP
- `POST /api/events/:id/rsvp` - RSVP to event
- `GET /api/events/:id/rsvps` - Get event RSVPs
- `GET /api/events/user/rsvps` - Get user's RSVPs

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full access, can approve events |
| **ORGANIZER** | Can create and manage events |
| **ATTENDEE** | Can RSVP to events |

## 🔌 WebSocket Realtime Features

Connect to the WebSocket endpoint to receive realtime updates:

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Update:', message);
  
  // Handle different update types:
  // - event_created
  // - event_updated
  // - event_deleted
  // - event_approved
  // - rsvp_added
  // - rsvp_updated
};
```

## 🎨 Design Principles

This application demonstrates several key software design principles:

### 1. SOLID Principles
- **Single Responsibility**: Each controller handles one concern
- **Open-Closed**: Extensible through plugins and middleware
- **Liskov Substitution**: Consistent interface implementation
- **Interface Segregation**: Separate routes for different operations
- **Dependency Inversion**: Services depend on abstractions

### 2. Separation of Concerns
```
Controllers → Business Logic
Routes → API Endpoint Definitions
Middleware → Authentication/Authorization
Services → External Integrations
Utils → Reusable Helpers
```

### 3. Modularity
The codebase is organized into clear, reusable modules that can be independently tested and maintained.

### 4. Scalability Considerations
- Stateless JWT authentication
- Database indexing on frequently queried fields
- WebSocket pub/sub pattern for realtime updates
- Type-safe APIs with TypeScript

## 🧪 Testing with Insomnia

1. Import the API collection into [Insomnia](https://insomnia.rest)
2. Base URL: `http://localhost:3000`
3. Test the authentication flow:
   - Signup → Get token
   - Login → Get token
   - Add token to Authorization header for protected routes

## 🚀 Deployment

### Render.com

1. **Backend Deployment:**
   - Connect GitHub repository
   - Set root directory: `backend-elysia`
   - Build command: `bun install && bun run db:push && bun run db:generate`
   - Start command: `bun run start`
   - Add environment variables from `.env`

2. **Frontend Deployment:**
   - Set root directory: `my-app`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Set environment variable: `NEXT_PUBLIC_API_URL` to your backend URL

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=3000
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## 📦 Technologies Used

### Backend
- **Elysia.js** - Fast, type-safe web framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database (via Neon)
- **JWT** - Token-based authentication
- **WebSocket** - Realtime communication
- **Ethereal Email** - Mock email service
- **Swagger** - API documentation

### Frontend
- **Next.js 15** - React framework with app router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## 🗄️ Database Schema

```sql
User
├── id (UUID)
├── email (String, unique)
├── password (String, hashed)
├── role (ADMIN | ORGANIZER | ATTENDEE)
└── timestamps

Event
├── id (UUID)
├── title (String)
├── description (String)
├── date (DateTime)
├── location (String)
├── organizerId (FK to User)
├── approved (Boolean)
└── timestamps

RSVP
├── id (UUID)
├── userId (FK to User)
├── eventId (FK to Event)
├── status (GOING | MAYBE | NOT_GOING)
└── timestamps
```

## 🔧 Development

### Backend Development

```bash
cd backend-elysia

# Development with hot reload
bun run dev

# Database studio
bun run db:studio

# Database migrations
bun run db:migrate
```

### Frontend Development

```bash
cd my-app

# Development server
npm run dev

# Build for production
npm run build
```

## 📝 Assignment Checklist

- ✅ Monolith structure with clear separation of concerns
- ✅ User authentication with JWT
- ✅ User roles (ADMIN, ORGANIZER, ATTENDEE)
- ✅ Event CRUD operations
- ✅ RSVP functionality
- ✅ WebSocket realtime updates
- ✅ Email notifications (Ethereal mock)
- ✅ Swagger API documentation
- ✅ Prisma + PostgreSQL database
- ✅ Deployment configuration (Render)
- ✅ Comprehensive README
- ✅ TypeScript for type safety
- ✅ Design principles applied (SOLID, separation of concerns)

## 🎓 Learning Outcomes

This project demonstrates:

1. **Architecture**: Monolith structure with modular design
2. **Authentication**: JWT-based security with role-based access control
3. **API Design**: RESTful endpoints with proper HTTP methods
4. **Realtime**: WebSocket implementation for live updates
5. **Database**: ORM usage with Prisma
6. **Testing**: API testing with Insomnia
7. **Documentation**: Auto-generated API docs with Swagger
8. **Deployment**: Cloud deployment with Render.com

## 📖 Documentation

### Setup Guides
- 📘 [Complete Setup Guide](COMPLETE_SETUP_GUIDE.md) - Comprehensive setup instructions
- 🔐 [Admin Setup Guide](ADMIN_SETUP.md) - Admin account setup and login instructions
- 🗂️ [Project Structure](structure.md) - Detailed project architecture

### Additional Resources
- [Elysia.js Docs](https://elysiajs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Neon Database](https://neon.tech/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Render Docs](https://render.com/docs)

## 🤝 Contributing

This is an academic project for software design principles. For questions or improvements, please reach out.

## 📄 License

MIT License - See LICENSE file for details

---

**Built as part of Software Design Assignment**  
Demonstrating modern monolith architecture with Elysia.js, Prisma, and Next.js

