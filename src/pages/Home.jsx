import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const PALETTE_BAR = [
  { name: "Rust", hex: "#B4472C" },
  { name: "Olive", hex: "#6E7A3F" },
  { name: "Mustard", hex: "#D6A431" },
  { name: "Powder Blue", hex: "#A9C6D8" },
  { name: "Lavender", hex: "#B7A6D9" },
  { name: "Emerald", hex: "#1E7A5B" },
  { name: "Sapphire", hex: "#20509E" },
  { name: "Magenta", hex: "#B0246E" },
  { name: "Camel", hex: "#C29A6B" },
  { name: "Charcoal", hex: "#26282B" },
];

export default function Home() {
  const featured = products.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-14 md:px-8 md:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-plum/10 px-3 py-1 text-xs font-semibold text-plum">
              <Sparkles size={13} /> New: photo-based color match
            </span>
            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.05] text-ink sm:text-5xl md:text-6xl">
              Wear the colors your skin already agrees with.
            </h1>
            <p className="mt-5 max-w-md text-base text-ink-soft md:text-lg">
              Upload one photo. We read your undertone and depth, then hand you a
              clothing palette built for your coloring — and shop it instantly.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/color-match"
                className="inline-flex items-center gap-2 rounded-full bg-plum px-6 py-3.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.02]"
              >
                Find my colors <ArrowRight size={16} />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3.5 text-sm font-semibold text-ink hover:bg-ink/5"
              >
                Browse the shop
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-3 gap-3">
              {PALETTE_BAR.slice(0, 9).map((c, i) => (
                <div
                  key={c.hex}
                  className="aspect-square rounded-2xl shadow-sm"
                  style={{
                    backgroundColor: c.hex,
                    marginTop: i % 3 === 1 ? "1.5rem" : 0,
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Signature: Palette Bar — shop by color, scrollable strip */}
      <section className="border-y border-ink/10 bg-paper-dim py-8">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-soft">Shop by color</p>
          <div className="scrollbar-thin flex gap-4 overflow-x-auto pb-2">
            {PALETTE_BAR.map((c) => (
              <Link
                key={c.hex}
                to={`/shop?color=${encodeURIComponent(c.hex)}`}
                className="group flex shrink-0 flex-col items-center gap-2"
              >
                <span
                  className="h-14 w-14 rounded-full border border-ink/10 shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs font-medium text-ink-soft">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">Featured pieces</h2>
          <Link to="/shop" className="flex items-center gap-1 text-sm font-semibold text-plum">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="grid gap-6 rounded-3xl bg-plum px-8 py-12 text-paper md:grid-cols-3 md:px-14">
          <div>
            <p className="font-display text-3xl">1</p>
            <p className="mt-2 text-sm text-paper/80">Upload a well-lit photo of your face.</p>
          </div>
          <div>
            <p className="font-display text-3xl">2</p>
            <p className="mt-2 text-sm text-paper/80">We sample your undertone and depth on-device.</p>
          </div>
          <div>
            <p className="font-display text-3xl">3</p>
            <p className="mt-2 text-sm text-paper/80">Get a palette and shop clothes tagged to match it.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
