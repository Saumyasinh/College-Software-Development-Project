import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, Edit2, Trash2, MapPin, Check } from "lucide-react";

export default function AddressBook() {
  const { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const [addresses, setAddresses] = useState(getAddresses());
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleAddAddress = () => {
    if (!formData.name || !formData.address || !formData.city || !formData.pincode) {
      alert("Please fill all required fields");
      return;
    }

    if (editingId) {
      updateAddress(editingId, formData);
      setEditingId(null);
    } else {
      addAddress(formData);
    }

    setAddresses(getAddresses());
    setFormData({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
    setIsAdding(false);
  };

  const handleEdit = (addr) => {
    setFormData(addr);
    setEditingId(addr.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    deleteAddress(id);
    setAddresses(getAddresses());
    setDeleteConfirm(null);
  };

  const handleSetDefault = (id) => {
    setDefaultAddress(id);
    setAddresses(getAddresses());
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-ink">Saved Addresses</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 rounded-full bg-plum px-4 py-2 text-sm font-semibold text-white hover:bg-plum/90 transition-colors"
          >
            <Plus size={16} />
            Add Address
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="mb-8 rounded-2xl border border-ink/10 bg-white/60 p-6">
          <p className="mb-4 font-semibold text-ink">
            {editingId ? "Edit Address" : "Add New Address"}
          </p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-plum"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-plum"
            />
            <input
              type="text"
              placeholder="Street Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-plum"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-plum"
              />
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-plum"
              />
            </div>
            <input
              type="text"
              placeholder="PIN Code"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-plum"
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddAddress}
                className="flex-1 rounded-lg bg-sage px-4 py-2.5 text-sm font-semibold text-white hover:bg-sage/90 transition-colors"
              >
                {editingId ? "Update Address" : "Save Address"}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 rounded-lg border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-ink/20 py-12 text-center">
          <MapPin size={40} className="mx-auto text-ink-soft opacity-40 mb-3" />
          <p className="text-ink-soft">No saved addresses yet</p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 inline-block rounded-full bg-plum px-6 py-2 text-sm font-semibold text-white hover:bg-plum/90 transition-colors"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`rounded-xl border-2 p-6 transition-all ${
                addr.isDefault
                  ? "border-sage bg-sage/5"
                  : "border-ink/10 bg-white/60 hover:border-plum/30"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-ink">{addr.name}</p>
                  {addr.phone && <p className="text-xs text-ink-soft">{addr.phone}</p>}
                </div>
                {addr.isDefault && (
                  <div className="flex items-center gap-1 rounded-full bg-sage/10 px-2 py-1">
                    <Check size={14} className="text-sage" />
                    <span className="text-xs font-semibold text-sage">Default</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-ink-soft mb-1">{addr.address}</p>
              <p className="text-sm text-ink-soft mb-4">
                {addr.city}
                {addr.state && `, ${addr.state}`} - {addr.pincode}
              </p>

              <div className="flex gap-2">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="flex-1 rounded-lg border border-sage px-3 py-2 text-xs font-semibold text-sage hover:bg-sage/10 transition-colors"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleEdit(addr)}
                  className="flex items-center justify-center gap-1 rounded-lg border border-ink/20 px-3 py-2 text-xs font-semibold text-ink hover:bg-ink/5 transition-colors flex-1"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(addr.id)}
                  className="flex items-center justify-center gap-1 rounded-lg border border-rust/30 px-3 py-2 text-xs font-semibold text-rust hover:bg-rust/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-5 max-w-sm rounded-2xl bg-white p-8 text-center">
            <p className="font-display text-lg font-semibold text-ink">Delete Address?</p>
            <p className="mt-2 text-sm text-ink-soft">This address will be permanently removed.</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 rounded-full bg-rust px-4 py-2 text-sm font-semibold text-white hover:bg-rust/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
