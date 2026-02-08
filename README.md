# Winch Zone (GitHub Pages + Supabase)

Matches the spec: landing login/signup/forgot, email verification, default role=user, dark theme,
dashboard tabs with role access, customers, trips with photos, approval lock, export to Excel, user roles.

## Supabase setup

1. Run `supabase/schema.sql` in Supabase SQL Editor.
2. Storage buckets:
   - `customer_docs` (Public)
   - `trip_photos` (Public)

3. Auth settings:
   - Enable Email provider
   - Enable Confirm email
   - Redirect URLs:
     - https://YOUR_USERNAME.github.io/YOUR_REPO/
     - https://YOUR_USERNAME.github.io/YOUR_REPO/#/
     - http://localhost:5173/#/ (optional dev)

## Local dev
Create `.env`:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Run:
```
npm i
npm run dev
```

## GitHub Pages deploy (Actions)
Add repo secrets:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Push to main and enable Pages -> "GitHub Actions" as source.

## First Admin
New signups are user by default. Promote first admin using SQL:
```sql
update public.profiles set role_id = 1 where user_id = 'YOUR_USER_UUID';
```
Then use the Users roles tab.



## If the deployed page is blank
- Ensure `vite.config.ts` base matches repo name: `/winch-zone/`.
- In browser DevTools Console, check for 404 assets or `Invalid supabaseUrl`.


### Photos behavior
- Trips can be saved with **no photos**.
- While trip status is **Pending**, you can upload/replace pickup & dropoff photos from **Edit trip**.
- After approval, editing/uploading is blocked.
