// Central API configuration for vibecheck.ai
// In local development, falls back to http://localhost:8000
// In production on Vercel, set VITE_API_URL in Vercel Environment Variables
export const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

/**
 * Builds a full API URL given an endpoint path.
 * e.g., apiUrl('/api/classify/url') => 'https://vibecheck-api.onrender.com/api/classify/url'
 */
export const apiUrl = (endpoint) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};

/**
 * Resolves static audio paths (/audio/uploads/... or /audio/samples/...) to full URLs.
 * If audioUrl is already a full http/https link, returns it as is.
 */
export const resolveAudioUrl = (audioUrl) => {
  if (!audioUrl) return "";
  if (audioUrl.startsWith("http://") || audioUrl.startsWith("https://")) {
    return audioUrl;
  }
  const cleanPath = audioUrl.startsWith('/') ? audioUrl : `/${audioUrl}`;
  return `${API_BASE_URL}${cleanPath}`;
};
