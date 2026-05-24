import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center justify-center px-5 pt-24">
      <div className="text-center">
        <p className="font-display text-7xl font-bold text-gradient-gold">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-cream">Page not found</h1>
        <p className="mt-3 max-w-md text-muted">
          The page you're looking for has moved or doesn't exist. Let's get you back to finding your Gurgaon property.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-gold">Back to home</Link>
          <Link href="/properties" className="btn-ghost">Browse properties</Link>
        </div>
      </div>
    </section>
  );
}
