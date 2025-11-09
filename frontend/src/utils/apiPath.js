// frontend/src/utils/apiPath.js

// ✅ Auto-detect environment: use Render in prod, localhost in dev
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://resumebuilder-backned.onrender.com"); // ✅ backend Render URL (check spelling!)

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },
  RESUME: {
    CREATE: "/api/resume",
    GET_ALL: "/api/resume",
    GET_BY_ID: (id) => `/api/resume/${id}`,
    UPDATE: (id) => `/api/resume/${id}`,
    DELETE: (id) => `/api/resume/${id}`,
    UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`,
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
  AI: {
    GENERATE: "/api/ai/generate",
  },
};
