import { Elysia } from "elysia";
import { signup, login, getProfile, verifyUser } from "../controllers/auth.controller";
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

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .post("/signup", signup, {
    detail: {
      tags: ["Authentication"],
      summary: "User signup",
      description: "Register a new user account (requires email verification)",
    },
  })
  .post("/login", login, {
    detail: {
      tags: ["Authentication"],
      summary: "User login",
      description: "Authenticate user and receive JWT token",
    },
  })
  .post("/verify", verifyUser, {
    detail: {
      tags: ["Authentication"],
      summary: "Verify user email",
      description: "Verify user account with email verification token",
    },
  })
  .get("/profile", async (context: AppContext) => {
    const authResult = await requireAuth(context);
    if (!authResult.success) {
      return authResult;
    }
    return getProfile(context);
  }, {
    detail: {
      tags: ["Authentication"],
      summary: "Get user profile",
      description: "Get authenticated user's profile",
    },
  });