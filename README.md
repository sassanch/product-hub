# Plei Product Hub

A private, outcome-based product roadmap backed by two Google Sheets that are synchronized from Linear. The application reads only the columns required by the roadmap, sanitizes them on the server, and requires a verified `plei.com` Google Workspace account.

## Local preview

```bash
npm install
npm run dev
```

Without Google Sheets credentials, local development uses representative preview data. Authentication credentials are required to sign in.

## First deployment

1. Put this code in a GitHub repository.
2. In Vercel, choose **Add New → Project**, import the repository, and keep the detected Next.js settings.
3. Select **Deploy**. Vercel will provide a `vercel.app` deployment URL.
4. Add `GOOGLE_PROJECTS_SHEET_ID`, `GOOGLE_INITIATIVES_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY`. Share both source sheets with the service-account email as a Viewer.
5. Complete the Google Workspace authentication setup below, add its environment variables, and redeploy.

There is no user database, webhook, or scheduled job to provision. Without Google Sheets credentials, the app displays clearly labeled preview data after login. Once configured, the two spreadsheets are read in parallel on the server. Service-account credentials are never sent to the browser, and only sanitized roadmap fields are returned to authenticated users.

The app has read-only access to the source sheets. Page routes and `/api/roadmap` require an authenticated `plei.com` Workspace session.

## Google Workspace login

Authentication uses Auth.js with Google OAuth and encrypted cookie/JWT sessions; it does not require a paid identity provider or database.

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create or select a project owned by the Plei Google Workspace organization.
2. Configure the OAuth consent screen for **Internal** users.
3. Create an **OAuth client ID** with application type **Web application**.
4. Register `http://localhost:3000/api/auth/callback/google` as a local authorized redirect URI and `https://<production-domain>/api/auth/callback/google` as the production redirect URI.
5. Generate a secret with `npx auth secret`, then configure these values in `.env.local` and in the Vercel project:

```env
AUTH_SECRET=<generated-secret>
AUTH_GOOGLE_ID=<google-oauth-client-id>
AUTH_GOOGLE_SECRET=<google-oauth-client-secret>
AUTH_ALLOWED_DOMAIN=plei.com
```

`AUTH_ALLOWED_DOMAIN` is checked against Google's signed hosted-domain (`hd`) claim in addition to the Internal consent-screen restriction. Sessions last eight hours. The existing `GOOGLE_SERVICE_ACCOUNT_*` values are separate credentials used only for server-side Sheets access.

## Commands

- `npm run dev` — local preview
- `npm test` — business-rule tests
- `npm run lint` — static checks
- `npm run build` — production build

No files in `sources/` are changed by this project.
