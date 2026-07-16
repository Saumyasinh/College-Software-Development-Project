import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, matchLabel }) {
  const { toggleWishlist, wishlist } = useCart();
  const isSaved = wishlist.includes(product.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white/60 transition-shadow hover:shadow-lg">
      <Link to={`/product/${product.id}`} className="block">
        <div className="flex aspect-[4/5] items-center justify-center bg-ink/5 overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              <span>No image</span>
            </div>
          )}
        </div>
      </Link>

      <button
        onClick={() => toggleWishlist(product.id)}
        aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
        aria-pressed={isSaved}
        className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-ink-soft shadow-sm hover:text-rust"
      >
        <Heart size={16} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-rust" : ""} />
      </button>

      {matchLabel && (
        <span className="absolute left-3 top-3 rounded-full bg-plum px-2.5 py-1 text-[11px] font-semibold text-paper">
          {matchLabel}
        </span>
      )}

      <div className="flex flex-1 flex-col gap-1 px-4 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{product.category}</p>
        <Link to={`/product/${product.id}`} className="font-display text-base font-medium text-ink hover:text-plum">
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span
            className="h-3.5 w-3.5 rounded-full border border-ink/15"
            style={{ backgroundColor: product.color }}
            aria-hidden="true"
          />
          <span className="text-xs text-ink-soft">{product.colorName}</span>
        </div>
        <p className="mt-2 font-display text-lg font-semibold text-ink">₹{product.price.toLocaleString("en-IN")}</p>
      </div>
    </div>
  );
}
