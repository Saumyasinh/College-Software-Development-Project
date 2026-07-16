import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { validateCoupon, calculateDiscount } from "../data/coupons";
import PaymentMethod from "../components/PaymentMethod";
import { AlertCircle, Check } from "lucide-react";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user, getAddresses, getDefaultAddress, addAddress, addOrder, walletBalance, deductFromWallet } = useAuth();
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState(
    getDefaultAddress()?.id || ""
  );
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [walletAmountToUse, setWalletAmountToUse] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [placing, setPlacing] = useState(false);

  const addresses = getAddresses();

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const fallbackAddress = addresses.find((addr) => addr.isDefault) || addresses[0];
      if (fallbackAddress) {
        setSelectedAddressId(fallbackAddress.id);
      }
    }
  }, [addresses, selectedAddressId]);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const shippingCost = subtotal > 3000 ? 0 : 149;
  const discountAmount = couponApplied
    ? calculateDiscount(couponApplied, subtotal)
    : 0;
  const finalSubtotal = subtotal - discountAmount;
  const total = finalSubtotal + shippingCost;

  function handleApplyCoupon() {
    setCouponError("");
    const result = validateCoupon(couponCode, subtotal);

    if (!result.valid) {
      setCouponError(result.message);
      setCouponApplied(null);
      return;
    }

    setCouponApplied(result.coupon);
  }

  function handleAddNewAddress() {
    if (
      !newAddressForm.name ||
      !newAddressForm.address ||
      !newAddressForm.city ||
      !newAddressForm.pincode
    ) {
      alert("Please fill all required fields");
      return;
    }

    const newAddress = addAddress(newAddressForm);
    setNewAddressForm({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: ""
    });
    setIsNewAddress(false);
    setSelectedAddressId(newAddress.id);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!selectedAddressId && !isNewAddress) {
      alert("Please select or add a delivery address");
      return;
    }

    // Validate wallet payment if selected
    if (paymentMethod === "wallet") {
      if (walletAmountToUse <= 0) {
        alert("Please specify the amount to pay from your wallet");
        return;
      }
      if (walletAmountToUse > walletBalance) {
        alert("Insufficient wallet balance");
        return;
      }
      if (walletAmountToUse > total) {
        alert("Wallet amount cannot be more than order total");
        return;
      }
    }

    setPlacing(true);

    setTimeout(() => {
      const orderId = "TN" + Math.floor(100000 + Math.random() * 900000);

      // Get selected address
      const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
      const shippingDetails = isNewAddress ? newAddressForm : selectedAddr;

      // Generate tracking IDs for each product
      const itemsWithTracking = items.map((item) => ({
        ...item,
        trackingId:
          "TRK" + Math.random().toString(36).substring(2, 11).toUpperCase(),
        itemStatus: "Processing",
        deliveryDate: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ).toISOString()
      }));

      // Save order
      const order = {
        orderId,
        date: new Date().toISOString(),
        items: itemsWithTracking,
        subtotal,
        discount: discountAmount,
        couponCode: couponApplied?.code || null,
        shipping: shippingCost,
        total,
        walletUsed: paymentMethod === "wallet" ? walletAmountToUse : 0,
        remainingAmount: paymentMethod === "wallet" ? total - walletAmountToUse : total,
        status: "Order Confirmed",
        paymentMethod,
        shippingDetails,
        estimatedDelivery: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
        timeline: [
          { status: "Order Confirmed", date: new Date().toISOString(), completed: true },
          { status: "Processing", date: null, completed: false },
          { status: "Packed", date: null, completed: false },
          { status: "In Transit", date: null, completed: false },
          { status: "Delivered", date: null, completed: false }
        ]
      };

      if (user) {
        addOrder(order);
        // Deduct from wallet if wallet payment method used
        if (paymentMethod === "wallet") {
          deductFromWallet(walletAmountToUse);
        }
      }

      localStorage.setItem("tone_last_order_v1", JSON.stringify({ orderId, total, order }));
      clearCart();
      window.alert(`Order placed successfully! Your order #${orderId} is confirmed.`);
      navigate("/order-success", { replace: true, state: { orderId, total, order } });
    }, 900);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Complete your purchase securely
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Delivery Address */}
          <section className="rounded-2xl border border-ink/10 bg-white/60 p-6">
            <h2 className="mb-4 font-display text-lg font-medium text-ink">
              Delivery Address
            </h2>

            {!isNewAddress ? (
              <div>
                {addresses.length > 0 && (
                  <div className="mb-4 space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-plum bg-plum/5"
                            : "border-ink/10 hover:border-ink/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={(e) => setSelectedAddressId(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-ink">{addr.name}</p>
                          <p className="text-xs text-ink-soft">{addr.phone}</p>
                          <p className="text-sm text-ink-soft mt-1">
                            {addr.address}
                          </p>
                          <p className="text-sm text-ink-soft">
                            {addr.city}
                            {addr.state && `, ${addr.state}`} - {addr.pincode}
                          </p>
                          {addr.isDefault && (
                            <span className="mt-2 inline-block rounded-full bg-sage/10 px-2 py-1 text-xs font-semibold text-sage">
                              Default
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setIsNewAddress(true)}
                  className="w-full rounded-lg border-2 border-dashed border-plum px-4 py-3 text-sm font-semibold text-plum hover:bg-plum/5 transition-colors"
                >
                  + Add New Address
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newAddressForm.name}
                  onChange={(e) =>
                    setNewAddressForm({
                      ...newAddressForm,
                      name: e.target.value
                    })
                  }
                  className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-plum"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={newAddressForm.phone}
                  onChange={(e) =>
                    setNewAddressForm({
                      ...newAddressForm,
                      phone: e.target.value
                    })
                  }
                  className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-plum"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={newAddressForm.address}
                  onChange={(e) =>
                    setNewAddressForm({
                      ...newAddressForm,
                      address: e.target.value
                    })
                  }
                  className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-plum"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddressForm.city}
                    onChange={(e) =>
                      setNewAddressForm({
                        ...newAddressForm,
                        city: e.target.value
                      })
                    }
                    className="rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-plum"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddressForm.state}
                    onChange={(e) =>
                      setNewAddressForm({
                        ...newAddressForm,
                        state: e.target.value
                      })
                    }
                    className="rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-plum"
                  />
                </div>
                <input
                  type="text"
                  placeholder="PIN Code"
                  value={newAddressForm.pincode}
                  onChange={(e) =>
                    setNewAddressForm({
                      ...newAddressForm,
                      pincode: e.target.value
                    })
                  }
                  className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-plum"
                  required
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleAddNewAddress}
                    className="flex-1 rounded-lg bg-sage px-3 py-2.5 text-sm font-semibold text-white hover:bg-sage/90 transition-colors"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewAddress(false)}
                    className="flex-1 rounded-lg border border-ink/20 px-3 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Payment Method */}
          <section className="rounded-2xl border border-ink/10 bg-white/60 p-6">
            <PaymentMethod
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
              walletBalance={walletBalance}
            />

            {/* Wallet Amount Input */}
            {paymentMethod === "wallet" && (
              <div className="mt-6 rounded-xl bg-plum/5 border border-plum/20 p-4">
                <label className="block text-sm">
                  <span className="mb-2 block font-semibold text-ink">Amount to Use from Wallet</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-ink">₹</span>
                    <input
                      type="number"
                      value={walletAmountToUse}
                      onChange={(e) => {
                        const val = Math.max(0, parseFloat(e.target.value) || 0);
                        setWalletAmountToUse(Math.min(val, Math.min(walletBalance, total)));
                      }}
                      placeholder="0"
                      max={Math.min(walletBalance, total)}
                      className="flex-1 rounded-lg border border-plum/30 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
                    />
                  </div>
                  <p className="text-xs text-ink-soft mt-2">
                    Maximum: ₹{Math.min(walletBalance, total).toLocaleString("en-IN")}
                  </p>
                </label>
              </div>
            )}
          </section>

          {/* Coupon Code */}
          <section className="rounded-2xl border border-ink/10 bg-white/60 p-6">
            <h2 className="mb-4 font-display text-lg font-medium text-ink">
              Apply Coupon
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  setCouponError("");
                }}
                className="flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-plum"
                disabled={couponApplied}
              />
              {!couponApplied ? (
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="rounded-lg bg-plum px-4 py-2.5 text-sm font-semibold text-white hover:bg-plum/90 transition-colors"
                >
                  Apply
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCouponApplied(null);
                    setCouponCode("");
                    setCouponError("");
                  }}
                  className="rounded-lg border border-rust/30 px-4 py-2.5 text-sm font-semibold text-rust hover:bg-rust/10 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>

            {couponError && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-rust/10 p-3">
                <AlertCircle size={16} className="text-rust flex-shrink-0 mt-0.5" />
                <p className="text-xs text-rust">{couponError}</p>
              </div>
            )}

            {couponApplied && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-sage/10 p-3">
                <Check size={16} className="text-sage flex-shrink-0" />
                <p className="text-xs text-sage">
                  <span className="font-semibold">{couponApplied.code}</span> applied{" "}
                  {couponApplied.type === "percentage"
                    ? `(${couponApplied.discount}% off)`
                    : `(₹${couponApplied.discount} off)`}
                </p>
              </div>
            )}

            {/* Available Coupons Help */}
            <details className="mt-3 cursor-pointer">
              <summary className="text-xs font-semibold text-plum">
                View available coupons
              </summary>
              <div className="mt-2 text-xs space-y-1 text-ink-soft">
                <p>• WELCOME20 - 20% off</p>
                <p>• SUMMER15 - 15% off (min ₹2000)</p>
                <p>• SAVE500 - ₹500 off (min ₹3000)</p>
                <p>• FASHION30 - 30% off (min ₹1500)</p>
              </div>
            </details>
          </section>

          <button
            type="submit"
            disabled={placing || !selectedAddressId}
            className="w-full rounded-full bg-plum py-3.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {placing ? "Placing order…" : `Place order · ₹${total.toLocaleString("en-IN")}`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <aside className="h-fit rounded-2xl border border-ink/10 bg-white/60 p-6 sticky top-20">
          <h2 className="font-display text-lg font-medium text-ink mb-4">
            Order Summary
          </h2>

          <div className="mb-4 max-h-64 overflow-y-auto space-y-3">
            {items.map((item) => (
              <div key={item.key} className="flex gap-3">
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-ink/5 flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-ink-soft">No img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-ink truncate">{item.name}</p>
                  <p className="text-xs text-ink-soft">{item.colorName} · Size {item.size}</p>
                  <p className="text-xs text-ink-soft mt-1">Qty: {item.qty}</p>
                  <p className="text-sm font-semibold text-ink mt-1">
                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-ink/10 pt-4 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-ink-soft">Subtotal</span>
              <span className="text-ink-soft">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-sage font-medium">
                <span>Discount ({couponApplied.type === "percentage" ? `${couponApplied.discount}%` : ""})</span>
                <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-ink-soft">Shipping</span>
              <span className="text-ink-soft">
                {shippingCost === 0 ? "Free" : `₹${shippingCost}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between border-t border-ink/10 pt-4 font-display text-base font-semibold text-ink">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
