# Google OAuth Setup Instructions

Your app uses Google OAuth for authentication. Follow these steps to configure it:

## 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services > Credentials**
4. Find your OAuth 2.0 Client ID (or create one if needed)
5. Click to edit the client
6. Under **Authorized redirect URIs**, add ALL of these:
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:5173/api/auth/callback/google
   https://actly.app/api/auth/callback/google
   ```
7. Click **Save**

## 2. Environment Variables

Your `.env.local` already contains:
- `GOOGLE_CLIENT_ID`: 554895886534-84r56gkpvb921fa86e9l6dgdnmt413if.apps.googleusercontent.com
- `GOOGLE_CLIENT_SECRET`: (set in your .env.local)
- `NEXTAUTH_SECRET`: (already configured)

## 3. Running the App Locally

### Default (localhost:3000)
```powershell
cd 'c:\Users\ASUS\Downloads\FSD WEB\Web log in\Web log in'
npm run dev
```
Then open: http://localhost:3000

### On Port 5173 (if using Vite or testing)
Ensure `NEXTAUTH_URL` is set to `http://localhost:5173` in your environment.

### For Mobile Testing (HTTPS via ngrok)
```powershell
# Install ngrok globally
npm i -g ngrok

# In one terminal: Start dev server
npm run dev

# In another terminal: Expose via ngrok
ngrok http 3000
```
Then add the ngrok URL (e.g., `https://abc123.ngrok.io`) to Google Cloud Console redirect URIs.

## 4. PWA Configuration

PWA is disabled by default during development to avoid build issues. To enable it:

```powershell
$env:ENABLE_PWA='true'; npm run dev
```

Or add to production `.env`:
```
ENABLE_PWA=true
```

## Current OAuth Credentials

- **Client ID**: 554895886534-84r56gkpvb921fa86e9l6dgdnmt413if.apps.googleusercontent.com
- **Redirect URIs** (add all to Google Cloud):
  - http://localhost:3000/api/auth/callback/google
  - http://localhost:5173/api/auth/callback/google
  - https://actly.app/api/auth/callback/google

Once you've added the redirect URIs to Google Cloud Console, restart your dev server and test the login flow!
