import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, Check } from "lucide-react";
import { findProduct, products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { bestMatchInPalette, getSeasonPalette } from "../utils/colorAnalysis";
import ProductCard from "../components/ProductCard";

const SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = findProduct(id);
  const { addItem, toggleWishlist, wishlist } = useCart();
  const { profile } = useAuth();
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="font-display text-2xl text-ink">Product not found.</p>
        <Link to="/shop" className="mt-4 inline-block text-sm font-semibold text-plum">
          Back to shop
        </Link>
      </div>
    );
  }

  const isSaved = wishlist.includes(product.id);
  const palette = profile ? getSeasonPalette(profile) : null;
  const match = palette ? bestMatchInPalette(product.color, palette) : null;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  function handleAdd() {
    addItem(product, size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="aspect-square rounded-3xl overflow-hidden bg-ink/5">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              <span>No image</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-medium text-ink md:text-4xl">{product.name}</h1>
          <p className="mt-3 font-display text-2xl font-semibold text-ink">₹{product.price.toLocaleString("en-IN")}</p>

          <div className="mt-4 flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border border-ink/15" style={{ backgroundColor: product.color }} />
            <span className="text-sm text-ink-soft">{product.colorName} · {product.fit} fit</span>
          </div>

          {match && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-plum/20 bg-plum/5 px-4 py-3">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-plum" />
              <p className="text-sm text-ink">
                <span className="font-semibold">{match.similarity}% match</span> with your {palette.label} palette —
                closest to {match.name}.
              </p>
            </div>
          )}
          {!profile && (
            <Link to="/color-match" className="mt-5 block text-sm font-semibold text-plum underline underline-offset-4">
              Find out if this color suits you →
            </Link>
          )}

          <div className="mt-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Size</p>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-11 w-11 rounded-full border text-sm font-medium ${
                    size === s ? "border-plum bg-plum text-paper" : "border-ink/15 text-ink hover:border-ink/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-plum px-6 py-3.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.01]"
            >
              {added ? <><Check size={16} /> Added to bag</> : "Add to bag"}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={isSaved}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink-soft hover:text-rust"
            >
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-rust" : ""} />
            </button>
          </div>

          <button
            onClick={() => navigate("/cart")}
            className="mt-3 w-full text-center text-xs font-semibold text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            Go to bag
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-medium text-ink">You may also like</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
