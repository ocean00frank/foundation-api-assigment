# Event Management Backend (Elysia.js)

This is the backend for the Event Management Application, built with Elysia.js, Prisma, and Neon PostgreSQL.

## Architecture & Design Principles

This application follows several key software design principles:

### SOLID Principles
- **Single Responsibility**: Each controller handles one aspect (auth, events, RSVP)
- **Open-Closed**: Extensible through plugin architecture
- **Liskov Substitution**: Interface-based design with consistent error handling
- **Interface Segregation**: Separate routes for different concerns
- **Dependency Inversion**: Services depend on abstractions

### Separation of Concerns
- **Controllers**: Handle business logic
- **Routes**: Define API endpoints
- **Middleware**: Handle authentication and authorization
- **Services**: External integrations (email, websockets)
- **Utils**: Helper functions

### Modularity
The codebase is organized into clear modules:
- `src/controllers/` - Business logic
- `src/routes/` - API route definitions
- `src/middleware/` - Authentication and authorization
- `src/services/` - External service integrations
- `src/utils/` - Utility functions

## Features

- ✅ JWT-based authentication
- ✅ User roles (ADMIN, ORGANIZER, ATTENDEE)
- ✅ Event CRUD operations
- ✅ RSVP functionality
- ✅ WebSocket realtime updates
- ✅ Email notifications (Ethereal mock)
- ✅ Swagger API documentation
- ✅ Type-safe with TypeScript
- ✅ PostgreSQL database with Prisma ORM

## Prerequisites

- Bun runtime (latest)
- PostgreSQL database (Neon free tier recommended)
- Node.js 18+ (if not using Bun)

## Setup

1. **Install dependencies:**
```bash
bun install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your database URL and JWT secret.

3. **Set up the database:**
```bash
bun run db:push
bun run db:generate
```

4. **Seed the database (optional):**
```bash
bun run db:seed
```

5. **Start the development server:**
```bash
bun run dev
```

The server will run on `http://localhost:3000`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/swagger

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment | No (default: development) |

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (authenticated)

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

### WebSocket
- `ws://localhost:3000/ws` - WebSocket connection for realtime updates

## User Roles

- **ADMIN**: Full access, can approve events
- **ORGANIZER**: Can create and manage events
- **ATTENDEE**: Can RSVP to events

## Testing with Insomnia

Import the API endpoints into Insomnia:

1. Create a new request collection
2. Set base URL: `http://localhost:3000`
3. Test the following flow:
   - Signup → Get token
   - Login → Get token
   - Use token in Authorization header: `Bearer <token>`
   - Create event
   - RSVP to event
   - Connect to WebSocket endpoint

## Deployment

### Render.com

1. Connect your GitHub repository
2. Set build command: `bun install && bun run db:push && bun run db:generate`
3. Set start command: `bun run start`
4. Add environment variables in Render dashboard:
   - `DATABASE_URL` (from Neon)
   - `JWT_SECRET`
   - `PORT` (optional)
   - `NODE_ENV=production`

## Database Schema

```
User {
  id: UUID
  email: String (unique)
  password: String (hashed)
  role: ADMIN | ORGANIZER | ATTENDEE
}

Event {
  id: UUID
  title: String
  description: String
  date: DateTime
  location: String
  organizerId: UUID (FK to User)
  approved: Boolean
}

RSVP {
  id: UUID
  userId: UUID (FK to User)
  eventId: UUID (FK to Event)
  status: GOING | MAYBE | NOT_GOING
  unique: [userId, eventId]
}
```

## Troubleshooting

### Database Connection Issues
- Check `DATABASE_URL` is correct
- Ensure database is accessible
- Verify SSL mode is set correctly

### JWT Errors
- Verify `JWT_SECRET` is set
- Check token is being sent in Authorization header
- Ensure token hasn't expired

### WebSocket Issues
- Ensure WebSocket connections are allowed
- Check firewall settings
- Verify WebSocket endpoint is correct

## License

MIT

