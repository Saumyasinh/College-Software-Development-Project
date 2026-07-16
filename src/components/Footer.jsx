import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-paper-dim">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="font-display text-xl font-semibold text-ink">
              TONE<span className="text-plum">.</span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">
              Clothing chosen by the science of your color palette, not by guesswork.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Shop</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li><Link to="/shop" className="hover:text-plum">All Products</Link></li>
              <li><Link to="/color-match" className="hover:text-plum">Color Match</Link></li>
              <li><Link to="/wishlist" className="hover:text-plum">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Account</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li><Link to="/login" className="hover:text-plum">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-plum">Create Account</Link></li>
              <li><Link to="/cart" className="hover:text-plum">Cart</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Project</p>
            <p className="mt-3 text-sm text-ink-soft">
              A final-year college demo project. All checkout flows are simulated — no real payments are processed.
            </p>
          </div>
        </div>
        <p className="mt-10 border-t border-ink/10 pt-6 text-xs text-ink-soft">
          © {new Date().getFullYear()} TONE. Demo project — not a real store.
        </p>
      </div>
    </footer>
  );
}
