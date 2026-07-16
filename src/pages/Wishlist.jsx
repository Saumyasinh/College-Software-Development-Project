import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";

export default function Wishlist() {
  const { wishlist } = useCart();
  const saved = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">Wishlist</h1>

      {saved.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/15 p-12 text-center">
          <p className="font-display text-lg text-ink">Nothing saved yet.</p>
          <p className="mt-1 text-sm text-ink-soft">Tap the heart on any product to save it here.</p>
          <Link to="/shop" className="mt-5 inline-block rounded-full bg-plum px-6 py-3 text-sm font-semibold text-paper">
            Browse shop
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
