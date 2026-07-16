import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <p className="font-display text-6xl text-plum">404</p>
      <h1 className="mt-4 font-display text-2xl text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-ink-soft">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-plum px-6 py-3 text-sm font-semibold text-paper">
        Back home
      </Link>
    </div>
  );
}
