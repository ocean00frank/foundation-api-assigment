// Remove any type import - use any for now
import { verifyToken, extractTokenFromHeader } from "../utils/jwt.utils";
import { prisma } from "../prisma/client";

// Define a proper context interface instead of extending 'any'
export interface AuthContext {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  request?: {
    headers: {
      get: (key: string) => string | null;
    };
  };
  // Add other properties that might be used in the context
  params?: any;
  body?: any;
  query?: any;
  set?: any;
  store?: any;
  cookie?: any;
  path?: string;
}

export async function authenticate(context: AuthContext) {
  // Add null check for request
  if (!context.request) {
    return {
      error: "Invalid request context",
      status: 400,
    };
  }

  const authHeader = context.request.headers.get("Authorization");
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return {
      error: "No token provided",
      status: 401,
    };
  }

  try {
    const payload = verifyToken(token);
    
    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return {
        error: "User not found",
        status: 401,
      };
    }

    context.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return { success: true };
  } catch (error) {
    return {
      error: "Invalid or expired token",
      status: 401,
    };
  }
}

export async function requireRole(context: AuthContext, allowedRoles: string[]) {
  const authResult = await authenticate(context);

  if (!authResult.success) {
    return authResult;
  }

  if (!context.user) {
    return {
      error: "Unauthorized",
      status: 401,
    };
  }

  if (!allowedRoles.includes(context.user.role)) {
    return {
      error: "Insufficient permissions",
      status: 403,
    };
  }

  return { success: true };
}

export async function requireAuth(context: AuthContext) {
  return requireRole(context, ["ADMIN", "ORGANIZER", "ATTENDEE"]);
}

export async function requireAdmin(context: AuthContext) {
  return requireRole(context, ["ADMIN"]);
}

export async function requireOrganizer(context: AuthContext) {
  return requireRole(context, ["ORGANIZER", "ADMIN"]);
}