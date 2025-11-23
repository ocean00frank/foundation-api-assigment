import { Elysia } from "elysia";
import { rsvpToEvent, getEventRSVPs, getUserRSVPs } from "../controllers/rsvp.controller";
import { requireAuth } from "../middleware/auth.middleware";

// Define a proper context type that matches both Elysia and your auth middleware
interface AppContext {
  user?: {
    id: string;
    role: string;
    email: string;
  };
  params?: any;
  body?: any;
  query?: any;
  set?: any;
  request?: any;
  store?: any;
  cookie?: any;
  path?: string;
}

export const rsvpRoutes = new Elysia({ prefix: "/api/events" })
  .post("/:id/rsvp", async (context: AppContext) => {
    const authResult = await requireAuth(context);
    if (!authResult.success) {
      return authResult;
    }
    return rsvpToEvent(context);
  }, {
    detail: {
      tags: ["RSVP"],
      summary: "RSVP to event",
      description: "Create or update RSVP for an event",
    },
  })
  .get("/:id/rsvps", getEventRSVPs, {
    detail: {
      tags: ["RSVP"],
      summary: "Get event RSVPs",
      description: "Get all RSVPs for an event",
    },
  })
  .get("/user/rsvps", async (context: AppContext) => {
    const authResult = await requireAuth(context);
    if (!authResult.success) {
      return authResult;
    }
    return getUserRSVPs(context);
  }, {
    detail: {
      tags: ["RSVP"],
      summary: "Get user RSVPs",
      description: "Get all RSVPs for the authenticated user",
    },
  });