import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Menu, X, Sparkles, User, Wallet } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/color-match", label: "Color Match", highlight: true },
  { to: "/wishlist", label: "Wishlist" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { user, walletBalance } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
          TONE<span className="text-plum">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive ? "text-plum" : "text-ink-soft hover:text-ink"
                }`
              }
            >
              {l.highlight && <Sparkles size={14} className="text-gold" aria-hidden="true" />}
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-plum/10 border border-plum/20">
              <Wallet size={16} className="text-plum" />
              <span className="text-xs font-semibold text-plum">₹{walletBalance.toLocaleString("en-IN")}</span>
            </div>
          )}
          {user ? (
            <Link
              to="/profile"
              className="hidden items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink md:flex"
            >
              <User size={18} />
              {user.name}
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink md:flex"
            >
              <User size={18} />
              Account
            </Link>
          )}
          <Link to="/cart" className="relative text-ink hover:text-plum" aria-label="Cart">
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-plum px-1 text-[10px] font-semibold text-paper">
                {count}
              </span>
            )}
          </Link>
          <button
            className="text-ink md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink/10 bg-paper px-5 pb-5 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 text-base font-medium text-ink"
              >
                {l.highlight && <Sparkles size={14} className="text-gold" aria-hidden="true" />}
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <Link to="/profile" onClick={() => setOpen(false)} className="text-base font-medium text-ink">
                {user.name} (Profile)
              </Link>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="text-base font-medium text-ink">
                Account
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
