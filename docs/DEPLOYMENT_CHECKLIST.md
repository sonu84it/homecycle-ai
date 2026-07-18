# Production Deployment Checklist

## Vercel

- [ ] Import the repository into Vercel.
- [ ] Set framework preset to Next.js.
- [ ] Confirm build command is `npm run verify:env && npm run build`.
- [ ] Add all required environment variables.
- [ ] Deploy and confirm `/`, `/login`, `/dashboard`, `/upload`, and `/history` load.

## Environment Variables

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `OPENAI_API_KEY`
- [ ] `OPENAI_MODEL`
- [ ] `NEXT_PUBLIC_SITE_URL`

## Demo Mode

- [ ] Confirm `/dashboard`, `/upload`, and `/history` load without sign-in.
- [ ] Confirm browser-session image limit is visible on `/upload`.
- [ ] Confirm the API returns `429` after the configured session/IP limit.

## Optional Supabase Production Path

- [ ] Run `supabase/schema.sql` if restoring account-backed persistence.
- [ ] Confirm `public.items` exists.
- [ ] Confirm RLS is enabled on `public.items`.
- [ ] Confirm `item-images` storage bucket exists.
- [ ] Confirm upload/read/delete policies exist for `storage.objects`.
- [ ] Enable Google OAuth provider in Supabase Auth > Sign In / Providers > Google.
- [ ] Add Google OAuth client ID and client secret from Google Cloud Console.
- [ ] Add the Supabase callback URL to Google Cloud authorized redirect URIs:

```text
https://bkmezswnmflvyytqoahd.supabase.co/auth/v1/callback
```

- [ ] Add local and production callback URLs:

```text
http://localhost:3000/auth/callback
https://your-vercel-domain.vercel.app/auth/callback
```

## OpenAI

- [ ] Confirm `OPENAI_API_KEY` belongs to the right project.
- [ ] Confirm the project has access to the configured `OPENAI_MODEL`.
- [ ] Test one analysis using a non-sensitive household object.

## Demo Readiness

- [ ] Prepare 2-3 clear household item photos under 8 MB.
- [ ] Verify upload, analysis, save, dashboard, and history on production.
- [ ] Keep one previously saved scan in the account in case live image upload is slow.
- [ ] Open README architecture diagram in a browser tab.
- [ ] Keep Devpost script open in a second tab.

## Known Operational Notes

- The app uses public history image URLs for simple demo rendering, while OpenAI analysis uses short-lived signed URLs generated server-side.
- The in-memory API throttle is best-effort and suitable for MVP/demo protection, not a distributed production quota system.
- For production beyond MVP, move throttling to Redis or Supabase-backed counters and add server-side malware/content scanning.
