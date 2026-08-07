# Plei Product Hub

A public, outcome-based product roadmap backed by two Google Sheets that are synchronized from Linear. The application reads only the columns required by the roadmap, sanitizes them on the server, and renders the company-facing view.

## Local preview

```bash
npm install
npm run dev
```

Without credentials, local development uses representative preview data.

## First deployment

1. Put this code in a GitHub repository.
2. In Vercel, choose **Add New → Project**, import the repository, and keep the detected Next.js settings.
3. Select **Deploy**. Vercel will provide a public `vercel.app` link showing the built-in preview roadmap.
4. Add `GOOGLE_PROJECTS_SHEET_ID`, `GOOGLE_INITIATIVES_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY`, then redeploy. Share both source sheets with the service-account email as a Viewer.

There is no user authentication, database, webhook, or scheduled job to provision. Without Google credentials, the app displays clearly labeled preview data. Once configured, the two spreadsheets are read in parallel on the server. Service-account credentials are never sent to the browser, and only sanitized roadmap fields are included in the public response.

Because the link is public, anyone who obtains it can view the displayed goals, project summaries, owners, health, updates, and dates. The app has read-only access to the source sheets.

## Commands

- `npm run dev` — local preview
- `npm test` — business-rule tests
- `npm run lint` — static checks
- `npm run build` — production build

No files in `sources/` are changed by this project.
