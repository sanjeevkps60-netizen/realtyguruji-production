# Realty Guruji — Deployment Guide

**Stack:** Next.js (App Router, SSR) · Tailwind v4 · TypeScript · Supabase (DB + Auth + Storage) · Vercel (hosting) · Hostinger (DNS only).

The site runs **without** Supabase/OpenAI — it falls back to curated seed data and a guided chat. Adding the env vars turns on the live database, admin dashboard and AI chatbot.

---

## 1. Push to GitHub
You have a GitHub account. Create an **empty** repo named `realtyguruji-production` (no README), then:

```bash
git remote add origin https://github.com/<your-username>/realtyguruji-production.git
git branch -M main
git push -u origin main
```
(The repo is already initialized and committed locally.)

## 2. Create the Supabase project
1. Go to https://supabase.com → **New project** (region: Mumbai/Singapore). Save the DB password.
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**. This creates tables, RLS, the storage bucket and seeds categories.
3. **Project Settings → API**: copy the **Project URL** and the **anon public** key.
4. **Authentication → Users → Add user** → create your admin (email + password). Then run in SQL Editor (replace the email):
   ```sql
   update public.profiles set role = 'super_admin'
   where id = (select id from auth.users where email = 'you@example.com');
   ```
5. **Authentication → Providers → Email**: turn **off** "Confirm email" (so password login works immediately), or confirm the user manually.

## 3. Deploy to Vercel
1. Sign up at https://vercel.com with your GitHub.
2. **Add New → Project → Import** `realtyguruji-production`. Framework auto-detects Next.js.
3. **Environment Variables** (add for Production + Preview):
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon public key |
   | `NEXT_PUBLIC_SITE_URL` | `https://realtyguruji.com` |
   | `OPENAI_API_KEY` | *(optional)* your OpenAI key for the AI chatbot |
4. **Deploy**. Test the `*.vercel.app` URL — styling, navigation, properties, admin login at `/admin/login`.

## 4. Connect the domain (Hostinger DNS → Vercel)
1. In Vercel → **Project → Settings → Domains** → add `realtyguruji.com` and `www.realtyguruji.com`. Vercel shows the exact records.
2. In **Hostinger hPanel → Domains → DNS / Nameservers → DNS Zone Editor**:
   - **A record:** host `@` → `76.76.21.21`
   - **CNAME:** host `www` → `cname.vercel-dns.com`
   - **Delete** any old/conflicting `@` A records and `www` CNAME (e.g. old Hostinger hosting records).
3. Back in Vercel, wait for the domains to verify and SSL to issue (usually minutes, up to a few hours for DNS).

> Keep the Hostinger plan for the **domain/DNS only**. The website itself is served by Vercel. The old static + PHP files are no longer used.

## 5. Add your first properties
Log in at `https://realtyguruji.com/admin/login` → **Add property** (all categories, image upload to Supabase Storage). Use **Feature / Mark sold / Delete** from the dashboard, and manage enquiries under **Leads**.

---

## Local development
```bash
cp .env.example .env.local   # fill in your keys (optional)
npm install
npm run dev                  # http://localhost:3000
```

## Roles
- **Super Admin / Property Manager** — full CRUD incl. delete.
- **Sales Executive** — add/edit/feature/mark-sold + leads (no delete).
Set roles in Supabase `profiles.role`.
