import { useLocation, Link, Navigate } from "react-router-dom";
import { CheckCircle2, Package, Truck, ShoppingBag, Mail, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LAST_ORDER_KEY = "tone_last_order_v1";

function loadOrderSnapshot() {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function OrderSuccess() {
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state || loadOrderSnapshot();

  if (!state) return <Navigate to="/" replace />;

  const itemCount = state.order?.items?.length || 0;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:px-8">
      {/* Success Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-sage/15 via-plum/10 to-gold/5 p-8 text-center mb-12 md:p-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-sage/20 mb-4">
          <CheckCircle2 size={40} className="text-sage" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink">Order Confirmed!</h1>
        <p className="mt-3 text-lg text-ink-soft">Thank you for your purchase. Your order has been successfully placed.</p>
      </div>

      <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
        {/* Main Content - Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Number Card */}
          <div className="rounded-2xl border border-plum/20 bg-gradient-to-br from-plum/5 to-transparent p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Your Order Number</p>
            <p className="mt-3 font-display text-4xl font-bold text-ink">#{state.orderId}</p>
            <p className="mt-3 text-sm text-ink-soft">Save this number to track your order</p>
          </div>

          {/* Key Info Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-ink/10 bg-white/60 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-sage/10">
                  <ShoppingBag size={20} className="text-sage" />
                </div>
                <span className="font-semibold text-ink">Items Ordered</span>
              </div>
              <p className="font-display text-2xl font-bold text-ink">{itemCount}</p>
              <p className="text-xs text-ink-soft mt-1">item{itemCount !== 1 ? "s" : ""} in your order</p>
            </div>

            <div className="rounded-xl border border-ink/10 bg-white/60 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-plum/10">
                  <Package size={20} className="text-plum" />
                </div>
                <span className="font-semibold text-ink">Total Amount</span>
              </div>
              <p className="font-display text-2xl font-bold text-ink">₹{state.total.toLocaleString("en-IN")}</p>
              <p className="text-xs text-ink-soft mt-1">including all taxes & shipping</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="rounded-2xl border border-ink/10 bg-white/60 p-8">
            <h2 className="font-display text-2xl font-semibold text-ink mb-6">What Happens Next?</h2>
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-plum to-plum/60 text-white font-semibold text-sm">
                    1
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-ink">Confirmation Email</p>
                  <p className="text-sm text-ink-soft mt-1">You'll receive an email within 5 minutes with your order details and tracking information</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-sage to-sage/60 text-white font-semibold text-sm">
                    2
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-ink">Processing & Packing</p>
                  <p className="text-sm text-ink-soft mt-1">Your order will be carefully packed within 24-48 hours</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-gold to-gold/60 text-white font-semibold text-sm">
                    3
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-ink">On the Way</p>
                  <p className="text-sm text-ink-soft mt-1">Your package will be shipped and you can track it in real-time</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-ink to-ink/60 text-white font-semibold text-sm">
                    4
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-ink">Delivered</p>
                  <p className="text-sm text-ink-soft mt-1">Receive your order at your doorstep in 5-7 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-5">
            <p className="text-sm text-blue-900 font-medium">
              ℹ️ This is a simulated order for demonstration purposes. No actual payment was processed.
            </p>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="rounded-2xl border border-ink/10 bg-white/60 p-6 sticky top-20">
            <h3 className="font-display text-lg font-semibold text-ink mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-ink-soft">Subtotal</span>
                <span className="font-medium text-ink">₹{state.order?.subtotal?.toLocaleString("en-IN") || state.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Shipping</span>
                <span className="font-medium text-ink">
                  {state.order?.shipping === 0 ? "Free" : `₹${state.order?.shipping?.toLocaleString("en-IN") || "—"}`}
                </span>
              </div>
              <div className="border-t border-ink/10 pt-3 flex justify-between font-display text-base font-bold">
                <span>Total</span>
                <span>₹{state.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="rounded-2xl border border-ink/10 bg-white/60 p-6">
            <h3 className="font-display text-lg font-semibold text-ink mb-4">Delivery Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-plum flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-ink">Est. Delivery</p>
                  <p className="text-ink-soft text-xs mt-1">5-7 Business Days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck size={18} className="text-sage flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-ink">Tracking</p>
                  <p className="text-ink-soft text-xs mt-1">Updates will be sent via email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-ink">Confirmation</p>
                  <p className="text-ink-soft text-xs mt-1">Check your email for receipt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {user && (
          <Link
            to="/profile"
            className="rounded-full bg-plum px-8 py-3.5 text-sm font-semibold text-paper text-center transition-all hover:shadow-lg hover:scale-[1.02]"
          >
            View Full Order Details
          </Link>
        )}
        <Link
          to="/shop"
          className="rounded-full border border-ink/20 px-8 py-3.5 text-sm font-semibold text-ink text-center transition-colors hover:bg-ink/5"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
