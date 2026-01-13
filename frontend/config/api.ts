export function getApiUrl() {
  // Check if we're on the server (Node.js) or client (browser)
  const isServer = typeof window === "undefined";

  if (isServer) {
    // Server-side: use internal Docker network address
    // or environment variable for server-side API URL
    return process.env.API_URL || "http://backend:5000";
  }

  // Client-side: use NEXT_PUBLIC_API_URL (set at build time)
  if (typeof process.env.NEXT_PUBLIC_API_URL === "string") {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Local development fallback
  return "http://localhost:5000";
}
