import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Copy, Edit2, AlertCircle, Download, RotateCcw, DollarSign, CreditCard, Wallet, Landmark, RefreshCw } from "lucide-react";
import { useState } from "react";
import TrackingMap from "../components/TrackingMap";
import { findProduct } from "../data/products";
import { useCart } from "../context/CartContext";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, getOrderById, updateOrder, cancelOrder, addSupportRequest } = useAuth();
  const { addItem } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAddress, setEditedAddress] = useState(null);
  const [copied, setCopied] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showReturnPanel, setShowReturnPanel] = useState(false);
  const [requestType, setRequestType] = useState("return");
  const [reason, setReason] = useState("");
  const [refundMethod, setRefundMethod] = useState("wallet");
  const [refundDetails, setRefundDetails] = useState({
    wallet: "",
    upi: "",
    bank: {
      ifscCode: "",
      accountNumber: ""
    }
  });
  const [requestMessage, setRequestMessage] = useState("");

  if (!user) return <Navigate to="/login" replace />;

  const order = getOrderById(orderId);
  if (!order) return <Navigate to="/profile" replace />;

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleEditAddress = () => {
    setEditedAddress({ ...order.shippingDetails });
    setIsEditing(true);
  };

  const handleSaveAddress = () => {
    const updatedOrder = {
      ...order,
      shippingDetails: editedAddress
    };
    updateOrder(orderId, updatedOrder);
    setIsEditing(false);
    alert("Address updated successfully!");
  };

  const handleCancelOrder = () => {
    cancelOrder(orderId);
    setShowCancelConfirm(false);
    alert("Order cancelled successfully!");
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Please select or describe your reason for this request.");
      return;
    }

    // Validate refund details based on method
    if (refundMethod === "wallet") {
      // Wallet only needs reason
    } else if (refundMethod === "upi") {
      if (!refundDetails.upi.trim()) {
        alert("Please provide your UPI ID.");
        return;
      }
    } else if (refundMethod === "bank") {
      if (!refundDetails.bank.ifscCode.trim()) {
        alert("Please provide your IFSC Code.");
        return;
      }
      if (!refundDetails.bank.accountNumber.trim()) {
        alert("Please provide your Account Number.");
        return;
      }
    }

    const actionLabel = requestType === "exchange" ? "Exchange" : "Return";
    addSupportRequest({
      orderId: order.orderId,
      type: requestType,
      reason,
      refundMethod,
      refundDetails: refundMethod === "bank" ? refundDetails.bank : refundMethod === "upi" ? refundDetails.upi : "",
      status: "Pending",
    });
    setRequestMessage(`${actionLabel} request submitted successfully. We will update you within 24 hours.`);
    setShowReturnPanel(false);
    setReason("");
    setRefundDetails({
      wallet: "",
      upi: "",
      bank: { ifscCode: "", accountNumber: "" }
    });
  };

  const handleRepeatOrder = () => {
    order.items.forEach((item) => {
      addItem(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          color: item.color,
          colorName: item.colorName,
          icon: item.icon,
          image: item.image,
        },
        item.size,
        item.qty
      );
    });
    navigate("/cart");
    alert("Items added to your cart for reordering.");
  };

  const handleDownloadInvoice = () => {
    const invoiceContent = `
TONE. - Order Invoice
=====================================
Order ID: ${order.orderId}
Date: ${new Date(order.date).toLocaleDateString("en-IN")}
Status: ${order.status}

ITEMS:
${order.items.map((item, idx) => `${idx + 1}. ${item.name} (${item.colorName}, Size ${item.size}) x${item.qty}
   Price: ₹${(item.price * item.qty).toLocaleString("en-IN")}
   Tracking ID: ${item.trackingId}`).join("\n")}

PRICING:
Subtotal: ₹${order.subtotal.toLocaleString("en-IN")}
Shipping: ${order.shipping === 0 ? "Free" : `₹${order.shipping.toLocaleString("en-IN")}`}
Total: ₹${order.total.toLocaleString("en-IN")}

DELIVERY ADDRESS:
${order.shippingDetails.name}
${order.shippingDetails.address}
${order.shippingDetails.city}, ${order.shippingDetails.pincode}

Thank you for shopping with TONE.!
    `;
    
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="rounded-full p-2 hover:bg-ink/10 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-ink" />
          </button>
          <div>
            <h1 className="font-display text-3xl font-medium text-ink">Order Details</h1>
            <p className="text-sm text-ink-soft mt-1">Order #{order.orderId}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
          >
            <Download size={16} />
            Invoice
          </button>
          <button
            onClick={handleEditAddress}
            disabled={isEditing}
            className="flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5 transition-colors disabled:opacity-50"
          >
            <Edit2 size={16} />
            Edit
          </button>
          {order.status !== "Cancelled" && order.status !== "Delivered" && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="flex items-center gap-2 rounded-full border border-rust/30 px-4 py-2 text-sm font-semibold text-rust hover:bg-rust/5 transition-colors"
            >
              <AlertCircle size={16} />
              Cancel
            </button>
          )}
          <button
            onClick={handleRepeatOrder}
            className="flex items-center gap-2 rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage hover:bg-sage/5 transition-colors"
          >
            <RefreshCw size={16} />
            Repeat Order
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Status Card */}
          <div className="rounded-2xl border border-ink/10 bg-white/60 p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-medium text-ink">Order Status</h2>
              <div className="flex items-center gap-2 rounded-full bg-sage/10 px-4 py-2">
                <div className="h-2.5 w-2.5 rounded-full bg-sage" />
                <span className="text-sm font-semibold text-sage">{order.status}</span>
              </div>
            </div>
            <TrackingMap timeline={order.timeline} estimatedDelivery={order.estimatedDelivery} />
          </div>

          {/* Items Section */}
          <div className="rounded-2xl border border-ink/10 bg-white/60 p-8">
            <h2 className="font-display text-2xl font-medium text-ink mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => {
                const product = findProduct(item.id);
                return (
                  <div key={idx} className="rounded-xl border border-ink/10 bg-paper p-4 overflow-hidden">
                    <div className="grid gap-4 sm:grid-cols-[100px_1fr]">
                      {/* Product Image */}
                      <div className="flex items-center justify-center h-24 sm:h-auto rounded-lg bg-ink/5 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-4xl">{item.icon}</div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <p className="font-semibold text-ink">{item.name}</p>
                          <p className="text-xs text-ink-soft mt-1">
                            {item.colorName} • Size {item.size} • Qty {item.qty}
                          </p>

                          {/* Tracking ID */}
                          <div className="mt-3 flex items-center gap-2 rounded-lg bg-plum/5 px-3 py-2 w-fit">
                            <div className="text-xs">
                              <p className="font-semibold text-plum">Tracking ID</p>
                              <p className="text-xs text-ink-soft font-mono">{item.trackingId}</p>
                            </div>
                            <button
                              onClick={() => handleCopy(item.trackingId, item.trackingId)}
                              className="ml-auto p-1 hover:bg-plum/10 rounded transition-colors"
                              title="Copy tracking ID"
                            >
                              <Copy size={14} className={copied === item.trackingId ? "text-sage" : "text-plum"} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-xs text-ink-soft capitalize">
                            Status: <span className="font-semibold text-ink">{item.itemStatus}</span>
                          </p>
                          <p className="font-semibold text-ink">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="rounded-2xl border border-ink/10 bg-white/60 p-8">
            <h2 className="font-display text-lg font-medium text-ink mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-soft">Subtotal</span>
                <span className="font-medium text-ink">₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Shipping</span>
                <span className="font-medium text-ink">
                  {order.shipping === 0 ? "Free" : `₹${order.shipping.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="border-t border-ink/10 pt-3 flex justify-between font-display text-base font-semibold">
                <span>Total</span>
                <span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Info */}
          <div className="rounded-2xl border border-ink/10 bg-white/60 p-6">
            <h3 className="font-display text-lg font-medium text-ink mb-4">Order Information</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">Order Date</p>
                <p className="font-medium text-ink">{formatDate(order.date)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">Est. Delivery</p>
                <p className="font-medium text-ink">{formatDate(order.estimatedDelivery)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">Order ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-semibold text-ink">{order.orderId}</p>
                  <button
                    onClick={() => handleCopy(order.orderId, "orderId")}
                    className="p-1 hover:bg-ink/10 rounded transition-colors"
                  >
                    <Copy size={14} className={copied === "orderId" ? "text-sage" : "text-ink-soft"} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Return/Refund Card */}
          <div className="rounded-2xl border border-ink/10 bg-white/60 p-6">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-medium text-ink">Returns & Refunds</h3>
              <button
                type="button"
                onClick={() => setShowReturnPanel((prev) => !prev)}
                className="flex items-center gap-2 rounded-full bg-plum/10 px-3 py-2 text-sm font-semibold text-plum"
              >
                <RotateCcw size={16} />
                {showReturnPanel ? "Close" : "Request"}
              </button>
            </div>

            {showReturnPanel && (
              <form onSubmit={handleSubmitRequest} className="mt-4 space-y-3 rounded-xl border border-ink/10 bg-paper p-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="rounded-lg border border-ink/10 p-3 text-sm">
                    <input type="radio" name="requestType" checked={requestType === "return"} onChange={() => setRequestType("return")} className="mr-2" />
                    Return Order
                  </label>
                  <label className="rounded-lg border border-ink/10 p-3 text-sm">
                    <input type="radio" name="requestType" checked={requestType === "exchange"} onChange={() => setRequestType("exchange")} className="mr-2" />
                    Exchange Order
                  </label>
                </div>

                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-ink">Reason</span>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain why you want to return or exchange this order"
                    className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
                    rows="3"
                  />
                </label>

                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-ink">Refund Method</span>
                  <select value={refundMethod} onChange={(e) => setRefundMethod(e.target.value)} className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum">
                    <option value="wallet">Tone Wallet</option>
                    <option value="upi">UPI ID</option>
                    <option value="bank">Bank Account</option>
                  </select>
                </label>

                {/* Tone Wallet - No additional fields needed */}
                {refundMethod === "wallet" && (
                  <div className="rounded-lg bg-sage/10 p-3 text-sm text-sage border border-sage/20">
                    ✓ Refund will be credited to your Tone Wallet
                  </div>
                )}

                {/* UPI ID */}
                {refundMethod === "upi" && (
                  <label className="block text-sm">
                    <span className="mb-1 block font-semibold text-ink">UPI ID</span>
                    <input
                      type="text"
                      value={refundDetails.upi}
                      onChange={(e) => setRefundDetails({ ...refundDetails, upi: e.target.value })}
                      placeholder="e.g., yourname@upi"
                      className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
                    />
                  </label>
                )}

                {/* Bank Account */}
                {refundMethod === "bank" && (
                  <div className="space-y-3">
                    <label className="block text-sm">
                      <span className="mb-1 block font-semibold text-ink">IFSC Code</span>
                      <input
                        type="text"
                        value={refundDetails.bank.ifscCode}
                        onChange={(e) => setRefundDetails({
                          ...refundDetails,
                          bank: { ...refundDetails.bank, ifscCode: e.target.value.toUpperCase() }
                        })}
                        placeholder="e.g., SBIN0001234"
                        className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1 block font-semibold text-ink">Account Number</span>
                      <input
                        type="text"
                        value={refundDetails.bank.accountNumber}
                        onChange={(e) => setRefundDetails({
                          ...refundDetails,
                          bank: { ...refundDetails.bank, accountNumber: e.target.value }
                        })}
                        placeholder="e.g., 1234567890123456"
                        className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
                      />
                    </label>
                  </div>
                )}

                <button type="submit" className="w-full rounded-full bg-plum px-4 py-2.5 text-sm font-semibold text-white hover:bg-plum/90 transition-colors">
                  Submit {requestType === "exchange" ? "Exchange" : "Return"} Request
                </button>
              </form>
            )}

            {requestMessage && (
              <div className="mt-4 rounded-lg border border-sage/20 bg-sage/10 p-3 text-sm text-sage">
                {requestMessage}
              </div>
            )}
          </div>

          {/* Delivery Address */}
          <div className="rounded-2xl border border-ink/10 bg-white/60 p-6">
            <h3 className="font-display text-lg font-medium text-ink mb-4">Delivery Address</h3>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedAddress.name}
                  onChange={(e) => setEditedAddress({ ...editedAddress, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
                />
                <input
                  type="text"
                  value={editedAddress.address}
                  onChange={(e) => setEditedAddress({ ...editedAddress, address: e.target.value })}
                  placeholder="Street address"
                  className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editedAddress.city}
                    onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
                    placeholder="City"
                    className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
                  />
                  <input
                    type="text"
                    value={editedAddress.pincode}
                    onChange={(e) => setEditedAddress({ ...editedAddress, pincode: e.target.value })}
                    placeholder="PIN code"
                    className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveAddress}
                    className="flex-1 rounded-lg bg-sage px-3 py-2 text-sm font-semibold text-white hover:bg-sage/90 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 rounded-lg border border-ink/20 px-3 py-2 text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm space-y-2 text-ink-soft">
                <p className="font-semibold text-ink">{order.shippingDetails.name}</p>
                <p>{order.shippingDetails.address}</p>
                <p>{order.shippingDetails.city}, {order.shippingDetails.pincode}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-5 max-w-sm rounded-2xl bg-white p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-rust/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-rust" />
            </div>
            <p className="font-display text-2xl font-semibold text-ink">Cancel Order?</p>
            <p className="mt-2 text-sm text-ink-soft">
              Are you sure you want to cancel order <span className="font-semibold">#{order.orderId}</span>? Once cancelled, you can request a refund.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 rounded-full border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 rounded-full bg-rust px-4 py-2.5 text-sm font-semibold text-white hover:bg-rust/90 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
