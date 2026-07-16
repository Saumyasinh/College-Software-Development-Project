import { useState } from "react";
import { DollarSign, CreditCard, QrCode, Truck, AlertCircle, Wallet } from "lucide-react";

export default function PaymentMethod({ onMethodChange, selectedMethod, walletBalance = 0 }) {
  const [showQRModal, setShowQRModal] = useState(false);

  const methods = [
    {
      id: "wallet",
      name: "Tone Wallet",
      description: `Use your wallet balance (₹${walletBalance})`,
      icon: Wallet,
      color: "bg-plum/10 border-plum text-plum"
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay when your order is delivered",
      icon: Truck,
      color: "bg-sage/10 border-sage text-sage"
    },
    {
      id: "card",
      name: "Debit/Credit Card",
      description: "Visa, Mastercard, or Rupay",
      icon: CreditCard,
      color: "bg-plum/10 border-plum text-plum"
    },
    {
      id: "upi",
      name: "UPI / QR Code",
      description: "Scan QR or pay via UPI",
      icon: QrCode,
      color: "bg-gold/10 border-gold text-gold"
    }
  ];

  return (
    <div>
      <h3 className="mb-4 font-semibold text-ink">Payment Method</h3>
      <div className="space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <div key={method.id}>
              <button
                type="button"
                onClick={() => {
                  onMethodChange(method.id);
                  if (method.id === "upi") {
                    setShowQRModal(true);
                  }
                }}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                  isSelected
                    ? `border-ink bg-ink/5`
                    : "border-ink/10 bg-white/60 hover:border-ink/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div className={`flex items-center justify-center p-2 rounded-lg ${method.color}`}>
                        <Icon size={20} />
                      </div>
                      <p className="font-semibold text-ink">{method.name}</p>
                    </div>
                    <p className="text-xs text-ink-soft ml-11">{method.description}</p>
                  </div>
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "border-ink bg-ink" : "border-ink/20"
                  }`}>
                    {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </div>
              </button>

              {/* Wallet Info */}
              {isSelected && method.id === "wallet" && (
                <div className="mt-3 rounded-lg bg-plum/5 border border-plum/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-ink">Tone Wallet Balance</p>
                    <p className="text-lg font-bold text-plum">₹{walletBalance.toLocaleString("en-IN")}</p>
                  </div>
                  <p className="text-xs text-ink-soft">
                    You can use any amount from your wallet to pay for this order
                  </p>
                </div>
              )}

              {/* Card Details Form */}
              {isSelected && method.id === "card" && (
                <div className="mt-3 rounded-lg bg-white/60 border border-ink/10 p-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number (16 digits)"
                    maxLength={19}
                    className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      maxLength={3}
                      className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
                  />
                  <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3">
                    <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800">Demo: Use any 16-digit number for testing</p>
                  </div>
                </div>
              )}

              {/* UPI Info */}
              {isSelected && method.id === "upi" && (
                <div className="mt-3 rounded-lg bg-gold/5 border border-gold/20 p-4">
                  <p className="text-sm text-ink-soft">
                    Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, etc.) to complete payment
                  </p>
                </div>
              )}

              {/* COD Info */}
              {isSelected && method.id === "cod" && (
                <div className="mt-3 rounded-lg bg-sage/5 border border-sage/20 p-4">
                  <p className="text-sm text-ink-soft">
                    You'll pay ₹{" "}
                    <span className="font-semibold text-ink">
                      [Order Total]
                    </span>{" "}
                    when the delivery partner arrives at your doorstep
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-5 max-w-sm rounded-2xl bg-white p-8 text-center">
            <h3 className="font-display text-xl font-semibold text-ink">Scan to Pay</h3>
            <p className="mt-2 text-sm text-ink-soft">Use any UPI app to scan this QR code</p>

            {/* QR Code Placeholder */}
            <div className="mt-6 flex items-center justify-center h-64 bg-ink/5 rounded-xl border-2 border-dashed border-ink/20">
              <div className="text-center">
                <QrCode size={60} className="mx-auto text-ink-soft mb-3" />
                <p className="text-xs text-ink-soft font-mono">QR Code Placeholder</p>
                <p className="text-xs text-ink-soft mt-2">Demo UPI ID: store@demo</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-ink-soft">
              This is a demo. No actual payment will be processed.
            </p>

            <button
              type="button"
              onClick={() => setShowQRModal(false)}
              className="mt-6 w-full rounded-full bg-plum px-4 py-2.5 text-sm font-semibold text-white hover:bg-plum/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
