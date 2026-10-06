// Centralized CADELIBORA Application State Configuration
export const appConfig = {
  name: 'CADELIBORA Core Digital Ecosystem',
  version: '2.5.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
};
