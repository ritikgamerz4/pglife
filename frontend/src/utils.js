// Backend Render base URL
export const base_path = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL.replace(/\/$/, '')
  : "https://pglife-2.onrender.com";
