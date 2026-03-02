import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { submitDonation } from "../services/donationService.js";

const ITEM_TYPES = ["Books", "Electronics", "Furniture", "Clothing", "Appliances", "Other"];

export default function DonatePage() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    itemType: "",
    estimatedValue: "",
    pickupPreferred: "yes",
    message: "",
  });

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.itemType || !form.estimatedValue) {
      toast.error("Please complete all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await submitDonation({
        userId: user?.uid || null,
        name: form.name,
        email: form.email,
        itemType: form.itemType,
        estimatedValue: Number(form.estimatedValue),
        pickupPreferred: form.pickupPreferred === "yes",
        message: form.message.trim(),
      });
      toast.success("Donation submitted successfully");
      setForm((prev) => ({
        ...prev,
        itemType: "",
        estimatedValue: "",
        pickupPreferred: "yes",
        message: "",
      }));
    } catch {
      toast.error("Failed to submit donation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-bg-neutral min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-poppins text-3xl font-bold text-gray-900">Donate an Item</h1>
        <p className="text-gray-600 mt-1">
          Share usable items with the community and keep resources in circulation.
        </p>

        <form onSubmit={onSubmit} className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" required>
              <input value={form.name} onChange={update("name")} className="input-field" />
            </Field>
            <Field label="Email" required>
              <input type="email" value={form.email} onChange={update("email")} className="input-field" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Item Type" required>
              <select value={form.itemType} onChange={update("itemType")} className="input-field">
                <option value="">Select item type</option>
                {ITEM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Estimated Value (₹)" required>
              <input
                type="number"
                min="0"
                value={form.estimatedValue}
                onChange={update("estimatedValue")}
                className="input-field"
              />
            </Field>
          </div>

          <Field label="Pickup Preferred">
            <select value={form.pickupPreferred} onChange={update("pickupPreferred")} className="input-field">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>

          <Field label="Message">
            <textarea
              rows={4}
              value={form.message}
              onChange={update("message")}
              className="input-field resize-none"
              placeholder="Any details the team should know..."
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Donation"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({ label, required = false, children }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700 font-medium">
        {label} {required ? <span className="text-primary">*</span> : null}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
