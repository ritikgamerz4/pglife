// API base path - configured via REACT_APP_API_BASE_URL for Vercel -> Render connection
export const base_path = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL.replace(/\/$/, '')
  : '';
