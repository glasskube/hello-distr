export function getApiUrl() {
  if (typeof process.env.NEXT_PUBLIC_API_URL === "string") {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Local development fallback
  return "http://localhost:5000";
}
