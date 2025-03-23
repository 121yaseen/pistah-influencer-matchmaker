// IMPORTANT: Replace these placeholder values with your actual Instagram API credentials
// You need to register an app on Facebook Developer Portal to get these credentials
// See: https://developers.facebook.com/docs/instagram-basic-display-api/getting-started
export const INSTAGRAM_CLIENT_ID = 'YOUR_INSTAGRAM_CLIENT_ID';
export const INSTAGRAM_CLIENT_SECRET = 'YOUR_INSTAGRAM_CLIENT_SECRET';
export const INSTAGRAM_REDIRECT_URI = 'YOUR_APP_SCHEME://instagram-auth';

// Instagram Graph API endpoints
export const INSTAGRAM_API_BASE_URL = 'https://graph.instagram.com';
export const INSTAGRAM_AUTH_URL = 'https://api.instagram.com/oauth/authorize';
export const INSTAGRAM_TOKEN_URL =
  'https://api.instagram.com/oauth/access_token';

// NOTE: The Instagram section in the app will not work until you replace the
// placeholder values above with real credentials from a registered Instagram app
// After updating, create a .env file (based on .env.example) and add these values there
// Then rebuild and rerun the app
