import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal > 0 ? (subtotal > 3000 ? 0 : 149) : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="font-display text-2xl text-ink">Your bag is empty.</p>
        <p className="mt-2 text-sm text-ink-soft">Find pieces matched to your colors, or browse everything.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/color-match" className="rounded-full bg-plum px-6 py-3 text-sm font-semibold text-paper">
            Find my colors
          </Link>
          <Link to="/shop" className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink">
            Browse shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">Your bag</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-ink/10">
          {items.map((item) => (
            <li key={item.key} className="flex gap-4 py-5">
              <div className="h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-ink/5">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                    <span>No image</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-medium text-ink">{item.name}</p>
                    <p className="text-xs text-ink-soft">{item.colorName} · Size {item.size}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    aria-label={`Remove ${item.name}`}
                    className="text-ink-soft hover:text-rust"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-full border border-ink/15 px-2 py-1">
                    <button onClick={() => updateQty(item.key, item.qty - 1)} aria-label="Decrease quantity" className="text-ink-soft hover:text-ink">
                      <Minus size={14} />
                    </button>
                    <span className="w-4 text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.key, item.qty + 1)} aria-label="Increase quantity" className="text-ink-soft hover:text-ink">
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-display text-sm font-semibold text-ink">
                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-ink/10 bg-white/60 p-6">
          <h2 className="font-display text-lg font-medium text-ink">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-ink-soft">Free shipping on orders over ₹3,000.</p>
            )}
          </div>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-display text-base font-semibold text-ink">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full rounded-full bg-plum py-3.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.01]"
          >
            Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
