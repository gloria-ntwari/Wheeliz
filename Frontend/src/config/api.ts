const envUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const API_BASE_URL = envUrl.replace(/\/+$/, "");
export const API_ROOT = API_BASE_URL.replace(/\/api\/?$/, "");
