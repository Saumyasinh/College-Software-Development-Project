import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Package, LogOut, MapPin, AlertCircle, DollarSign, Truck, ChevronRight, Settings, RefreshCw } from "lucide-react";
import { useState } from "react";
import AddressBook from "../components/AddressBook";

export default function Profile() {
  const { user, orders, logout, cancelOrder, getSupportRequests } = useAuth();
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const supportRequests = getSupportRequests();

  if (!user) return <Navigate to="/login" replace />;

  function handleLogout() {
    logout();
  }

  function handleCancel(orderId) {
    cancelOrder(orderId);
    setCancelConfirm(null);
  }

  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getDaysUntilDelivery(deliveryDate) {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days` : "Delivered";
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-4xl font-medium text-ink">My Account</h1>
          <p className="mt-2 text-sm text-ink-soft">Manage your profile, orders, and addresses</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-ink/20 px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* Profile Section */}
      <div className="mb-8 rounded-2xl border border-ink/10 bg-white/60 p-8">
        <h2 className="font-display text-2xl font-medium text-ink">Profile Information</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Full Name</p>
            <p className="mt-2 text-lg font-semibold text-ink capitalize">{user.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Email</p>
            <p className="mt-2 text-lg font-semibold text-ink">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-4 border-b border-ink/10">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-3 font-semibold text-sm transition-colors ${
            activeTab === "orders"
              ? "border-b-2 border-plum text-plum"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          <div className="flex items-center gap-2">
            <Package size={18} />
            Orders
          </div>
        </button>
        <button
          onClick={() => setActiveTab("addresses")}
          className={`px-4 py-3 font-semibold text-sm transition-colors ${
            activeTab === "addresses"
              ? "border-b-2 border-plum text-plum"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            Addresses
          </div>
        </button>
        <button
          onClick={() => setActiveTab("support")}
          className={`px-4 py-3 font-semibold text-sm transition-colors ${
            activeTab === "support"
              ? "border-b-2 border-plum text-plum"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          <div className="flex items-center gap-2">
            <RefreshCw size={18} />
            Support
          </div>
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          <h2 className="font-display text-2xl font-medium text-ink mb-6">Order History</h2>

          {orders.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-ink/20 py-16 text-center">
              <Package size={48} className="mx-auto text-ink-soft opacity-40" />
              <p className="mt-4 text-lg font-medium text-ink">No orders yet</p>
              <p className="mt-1 text-sm text-ink-soft">Start shopping to see your orders here</p>
              <Link
                to="/shop"
                className="mt-6 inline-block rounded-full bg-plum px-6 py-2.5 text-sm font-semibold text-paper hover:scale-105 transition-transform"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-5">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="group rounded-xl border border-ink/10 bg-white/60 overflow-hidden transition-all hover:shadow-lg hover:border-plum/30"
                >
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      {/* Order Summary */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-3 md:mb-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Order ID</p>
                            <p className="font-display text-lg font-semibold text-ink">#{order.orderId}</p>
                          </div>
                          <div className="flex items-center gap-2 rounded-full bg-sage/10 px-3 py-1 flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-sage" />
                            <span className="text-xs font-semibold text-sage">{order.status}</span>
                          </div>
                        </div>

                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                          <div>
                            <p className="font-semibold uppercase tracking-wide text-ink-soft mb-1">Date</p>
                            <p className="text-ink font-medium">{formatDate(order.date)}</p>
                          </div>
                          <div>
                            <p className="font-semibold uppercase tracking-wide text-ink-soft mb-1">Items</p>
                            <p className="text-ink font-medium">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                          </div>
                          <div>
                            <p className="font-semibold uppercase tracking-wide text-ink-soft mb-1">Delivery</p>
                            <p className="text-ink font-medium">{getDaysUntilDelivery(order.estimatedDelivery)}</p>
                          </div>
                          <div>
                            <p className="font-semibold uppercase tracking-wide text-ink-soft mb-1">Total</p>
                            <p className="font-display font-semibold text-ink">₹{order.total.toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-shrink-0 pt-4 md:pt-0 md:ml-4 border-t md:border-t-0 md:border-l md:border-ink/10 md:pl-4">
                        <Link
                          to={`/order/${order.orderId}`}
                          className="flex items-center gap-2 rounded-full bg-plum/10 px-4 py-2.5 text-sm font-semibold text-plum hover:bg-plum hover:text-white transition-colors whitespace-nowrap"
                        >
                          View Details
                          <ChevronRight size={16} />
                        </Link>
                        {order.status !== "Cancelled" && order.status !== "Delivered" && (
                          <button
                            onClick={() => setCancelConfirm(order.orderId)}
                            className="rounded-full border border-rust/30 p-2.5 text-rust hover:bg-rust/10 transition-colors flex-shrink-0"
                            title="Cancel order"
                          >
                            <AlertCircle size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Support Tab */}
      {activeTab === "support" && (
        <div>
          <h2 className="font-display text-2xl font-medium text-ink mb-6">Support Requests</h2>
          {supportRequests.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-ink/20 py-10 text-center text-sm text-ink-soft">
              No support requests yet. Return or refund requests will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {supportRequests.map((request) => (
                <div key={request.id} className="rounded-xl border border-ink/10 bg-white/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-ink">
                        {request.type === "exchange" ? "Exchange" : request.type === "refund" ? "Refund" : "Return"} request
                      </p>
                      <p className="text-sm text-ink-soft">Order #{request.orderId}</p>
                    </div>
                    <span className="rounded-full bg-plum/10 px-3 py-1 text-xs font-semibold text-plum">{request.status}</span>
                  </div>
                  <p className="mt-3 text-sm text-ink-soft">Reason: {request.reason}</p>
                  <p className="mt-1 text-sm text-ink-soft">Refund method: {request.refundMethod === "wallet" ? "Tone Wallet" : request.refundMethod === "upi" ? "UPI ID" : "Bank Account"}</p>
                  {request.refundDetails && (
                    <p className="mt-1 text-sm text-ink-soft">
                      {request.refundMethod === "wallet" ? "" : request.refundMethod === "upi" ? `UPI ID: ${request.refundDetails}` : `Account: ${request.refundDetails.accountNumber} | IFSC: ${request.refundDetails.ifscCode}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === "addresses" && <AddressBook />}

      {/* Cancel Order Confirmation Modal */}
      {cancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-5 max-w-sm rounded-2xl bg-white p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-rust/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-rust" />
            </div>
            <p className="font-display text-2xl font-semibold text-ink">Cancel Order?</p>
            <p className="mt-2 text-sm text-ink-soft">
              Are you sure you want to cancel order <span className="font-semibold">#{cancelConfirm}</span>? Once cancelled, you can request a refund.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setCancelConfirm(null)}
                className="flex-1 rounded-full border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={() => handleCancel(cancelConfirm)}
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
