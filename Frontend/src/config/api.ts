const envUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
let baseUrl = envUrl.replace(/\/+$/, "");

// Safety check: if the URL doesn't end with /api, add it
if (!baseUrl.endsWith("/api")) {
  baseUrl = `${baseUrl}/api`;
}

export const API_BASE_URL = baseUrl;
export const API_ROOT = API_BASE_URL.replace(/\/api\/?$/, "");
