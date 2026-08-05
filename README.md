# Plei Outcomes

A public, outcome-based product roadmap backed by Linear. The application is read-only: every page request fetches initiatives, projects, milestones, and status updates from Linear on the server, sanitizes them, and renders the company-facing view.

## Local preview

```bash
npm install
npm run dev
```

Without credentials, local development uses representative preview data and bypasses sign-in. Production never enables that bypass.

## First deployment

1. Put this code in a private GitHub repository.
2. In Vercel, choose **Add New → Project**, import the repository, and keep the detected Next.js settings.
3. Before deploying, add one environment variable named `LINEAR_API_KEY` with a read-only Linear API key.
4. Select **Deploy**. Vercel will provide a public `vercel.app` link.

There is no authentication, database, webhook, or scheduled job to provision. Linear is queried server-side when a page loads. The two portfolio queries run in parallel, the API key is never sent to the browser, and only sanitized roadmap fields are included in the public response.

Because the link is public, anyone who obtains it can view the displayed goals, project summaries, owners, health, updates, dates, and milestones. The app cannot edit Linear.

## Commands

- `npm run dev` — local preview
- `npm test` — business-rule tests
- `npm run lint` — static checks
- `npm run build` — production build

No files in `sources/` are changed by this project.
