export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

// Elysia.js backend runs on port 3000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000";

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

function normalizeError(status: number, body: any): ApiError {
  let message = "Request failed";
  
  if (body?.error) {
    message = body.error;
  } else if (body?.detail) {
    message = body.detail;
  } else if (body?.message) {
    message = body.message;
  } else if (typeof body === "string" && body.trim()) {
    message = body;
  } else {
    // Provide more specific error messages based on status codes
    switch (status) {
      case 401:
        message = "Authentication required. Please log in again.";
        break;
      case 403:
        message = "Access denied. You don't have permission to access this resource.";
        break;
      case 404:
        message = "Resource not found. The requested endpoint may not exist.";
        break;
      case 500:
        message = "Internal server error. Please try again later.";
        break;
      case 502:
        message = "Bad gateway. The server is temporarily unavailable.";
        break;
      case 503:
        message = "Service unavailable. Please try again later.";
        break;
      default:
        message = `Request failed with status ${status}`;
    }
  }
  
  return { status, message, details: body };
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData;
  const headers: Record<string, string> = {
    ...getAuthHeaders(),
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (!isFormData) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  // Add CORS credentials for API requests
  const fetchOptions: RequestInit = {
    ...init,
    headers,
    credentials: 'include', // Include cookies for CORS
  };

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, fetchOptions);
    const body = await parseJsonSafe(res);
    
    if (!res.ok) {
      const err = normalizeError(res.status, body);
      console.error(`API Error [${res.status}]:`, {
        path,
        status: res.status,
        message: err.message,
        details: err.details
      });
      throw new Error(err.message);
    }
    
    return body as T;
  } catch (error) {
    // Handle network errors and other fetch failures
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error:', error);
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    // Re-throw API errors
    throw error;
  }
}

export function saveTokens(access?: string | null, refresh?: string | null) {
  if (typeof window === "undefined") return;
  if (access) localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}



