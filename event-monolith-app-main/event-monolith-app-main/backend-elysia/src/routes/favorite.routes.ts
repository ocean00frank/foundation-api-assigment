import { Elysia } from "elysia";
import { favoriteEvent, unfavoriteEvent, getUserFavorites } from "../controllers/favorite.controller";
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

export const favoriteRoutes = new Elysia({ prefix: "/api/events" })
  .post("/:id/favorite", async (context: AppContext) => {
    const authResult = await requireAuth(context);
    if (!authResult.success) {
      return authResult;
    }
    return favoriteEvent(context);
  }, {
    detail: {
      tags: ["Favorites"],
      summary: "Favorite an event",
      description: "Add an event to favorites",
    },
  })
  .delete("/:id/favorite", async (context: AppContext) => {
    const authResult = await requireAuth(context);
    if (!authResult.success) {
      return authResult;
    }
    return unfavoriteEvent(context);
  }, {
    detail: {
      tags: ["Favorites"],
      summary: "Unfavorite an event",
      description: "Remove an event from favorites",
    },
  })
  .get("/user/favorites", async (context: AppContext) => {
    const authResult = await requireAuth(context);
    if (!authResult.success) {
      return authResult;
    }
    return getUserFavorites(context);
  }, {
    detail: {
      tags: ["Favorites"],
      summary: "Get user favorites",
      description: "Get all favorite events for the authenticated user",
    },
  });