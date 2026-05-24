// Central Supabase env access. Lets the whole app degrade gracefully to the
// curated seed data when Supabase isn't configured yet (e.g. first Vercel
// deploy before you add env vars).

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
