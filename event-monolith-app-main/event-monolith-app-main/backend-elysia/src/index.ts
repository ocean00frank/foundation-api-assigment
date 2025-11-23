import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
// import { swagger } from "@elysiajs/swagger";
// import { websocket } from "@elysiajs/websocket";
import { authRoutes } from "./routes/auth.routes";
import { eventRoutes } from "./routes/event.routes";
import { rsvpRoutes } from "./routes/rsvp.routes";
import { favoriteRoutes } from "./routes/favorite.routes";
// import {
//   addClient,
//   removeClient,
// } from "./services/websocket.service";

const PORT = process.env.PORT || 3000;

const app = new Elysia()
  .use(cors({
    origin: true, // Allow all origins in development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  }))
  // .use(swagger({
  //   documentation: {
  //     info: {
  //       title: "Event Management API",
  //       description: "API for managing events, users, and RSVPs with realtime features",
  //       version: "1.0.0",
  //     },
  //     tags: [
  //       { name: "Authentication", description: "User authentication endpoints" },
  //       { name: "Events", description: "Event management endpoints" },
  //       { name: "RSVP", description: "RSVP management endpoints" },
  //       { name: "Favorites", description: "Favorites management endpoints" },
  //     ],
  //   },
  // }))
  // .use(websocket())
  .get("/", () => {
    return {
      message: "Event Management API",
      version: "1.0.0",
      endpoints: {
        documentation: "/swagger",
        websocket: "/ws",
        auth: "/api/auth",
        events: "/api/events",
        rsvp: "/api/rsvp",
      },
    };
  })
  .use(authRoutes)
  .use(eventRoutes)
  .use(rsvpRoutes)
  .use(favoriteRoutes)
  // .ws("/ws", {
  //   open(ws) {
  //     const socketId = `${Math.random().toString(36).substring(7)}-${Date.now()}`;
  //     ws.data.socketId = socketId;
  //     addClient(socketId, ws);
  //     ws.send(JSON.stringify({
  //       type: "connection",
  //       message: "Connected to WebSocket server",
  //       socketId,
  //     }));
  //   },
  //   message(ws, message) {
  //     // Echo messages for testing
  //     ws.send(JSON.stringify({
  //       type: "echo",
  //       data: message,
  //     }));
  //   },
  //   close(ws) {
  //     if (ws.data.socketId) {
  //       removeClient(ws.data.socketId);
  //     }
  //   },
  // })
  .listen(PORT);

console.log(`
  🚀 Server is running on http://localhost:${PORT}
  📚 API Documentation: http://localhost:${PORT}/swagger
  🔌 WebSocket Endpoint: ws://localhost:${PORT}/ws
  🌐 Environment: ${process.env.NODE_ENV || "development"}
`);

export default app;

