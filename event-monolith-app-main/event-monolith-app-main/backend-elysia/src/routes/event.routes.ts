import { Elysia } from "elysia";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  getAllEventsForAdmin,
} from "../controllers/event.controller";
import { requireAuth, requireAdmin, requireOrganizer } from "../middleware/auth.middleware";

export const eventRoutes = new Elysia({ prefix: "/api/events" })
  .get("/", getAllEvents, {
    detail: {
      tags: ["Events"],
      summary: "Get all approved events",
      description: "Retrieve all approved events",
    },
  })
  .get("/all", async (context: any) => {  // Add type annotation
    const authResult = await requireAdmin(context as any);  // Cast context to any
    if (!authResult.success) {
      return authResult;
    }
    return getAllEventsForAdmin(context);
  }, {
    detail: {
      tags: ["Events"],
      summary: "Get all events (Admin only)",
      description: "Retrieve all events including unapproved (Admin only)",
    },
  })
  .get("/:id", getEventById, {
    detail: {
      tags: ["Events"],
      summary: "Get event by ID",
      description: "Retrieve a specific event by its ID",
    },
  })
  .post("/", async (context: any) => {  // Add type annotation
    const authResult = await requireAuth(context as any);  // Allow any authenticated user to submit events
    if (!authResult.success) {
      return authResult;
    }
    return createEvent(context);
  }, {
    detail: {
      tags: ["Events"],
      summary: "Create event",
      description: "Create a new event (Authenticated users; will require admin approval)",
    },
  })
  .put("/:id", async (context: any) => {  // Add type annotation
    const authResult = await requireOrganizer(context as any);  // Cast context to any
    if (!authResult.success) {
      return authResult;
    }
    return updateEvent(context);
  }, {
    detail: {
      tags: ["Events"],
      summary: "Update event",
      description: "Update an existing event (Organizer/Admin only)",
    },
  })
  .delete("/:id", async (context: any) => {  // Add type annotation
    const authResult = await requireOrganizer(context as any);  // Cast context to any
    if (!authResult.success) {
      return authResult;
    }
    return deleteEvent(context);
  }, {
    detail: {
      tags: ["Events"],
      summary: "Delete event",
      description: "Delete an event (Organizer/Admin only)",
    },
  })
  .post("/:id/approve", async (context: any) => {  // Add type annotation
    const authResult = await requireAdmin(context as any);  // Cast context to any
    if (!authResult.success) {
      return authResult;
    }
    return approveEvent(context);
  }, {
    detail: {
      tags: ["Events"],
      summary: "Approve event",
      description: "Approve an event (Admin only)",
    },
  });