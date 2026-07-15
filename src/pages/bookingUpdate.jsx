import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function BookingUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [paymentInfo, setPaymentInfo] = useState({
  totalAmount: 0,
  paidAmount: 0,
  balance: 0,
  paymentStatus: "Pending",
});

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    bookingDate: "",
    eventDate: "",
    packages: [],
    extraCharges: 0,
    discount: 0,
    bookingStatus: "Booked",
    paymentStatus: "Pending",
    notes: "",
  });

  useEffect(() => {
    fetchBooking();
    fetchPackages();
  }, []);

  const fetchBooking = async () => {
  try {
    setLoading(true);

    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/api/booking/${id}`
    );

    const booking = res.data.data;

    setFormData({
      customerName: booking.customerName,
      phone: booking.phone,
      bookingDate: booking.bookingDate.slice(0, 10),
      eventDate: booking.eventDate.slice(0, 10),
      packages: booking.packages.map((p) => p._id),
      extraCharges: booking.extraCharges,
      discount: booking.discount,
      bookingStatus: booking.bookingStatus,
      notes: booking.notes,
    });

    setPaymentInfo({
      totalAmount: booking.totalAmount,
      paidAmount: booking.paidAmount,
      balance: booking.balance,
      paymentStatus: booking.paymentStatus,
    });

  } catch (err) {
    console.log(err);
    toast.error("Failed to load booking");
  } finally {
    setLoading(false);
  }
};

  const fetchPackages = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/package`
      );

      setPackages(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePackage = (id) => {
  setFormData((prev) => ({
    ...prev,
    packages: prev.packages.includes(id)
      ? prev.packages.filter((pkg) => pkg !== id)
      : [...prev.packages, id],
  }));
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setSaving(true);

    await axios.put(
      `${import.meta.env.VITE_BACKEND_URI}/api/booking/${id}`,
      formData
    );

    toast.success("Booking updated successfully");

navigate("/bookings");

  } catch (err) {
    console.log(err);
    toast.error("Update failed");
  } finally {
    setSaving(false);
  }
};
const packageTotal = packages
  .filter((pkg) => formData.packages.includes(pkg._id))
  .reduce((sum, pkg) => sum + pkg.price, 0);

const finalTotal =
  packageTotal +
  Number(formData.extraCharges) -
  Number(formData.discount);

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="flex flex-col items-center gap-4">

        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        <p className="text-gray-300 text-lg">
          Loading booking...
        </p>

      </div>
    </div>
  );
}

  return (
    
    <div className="container mt-4">
        
      <div className="min-h-screen bg-[#0f172a] p-8">
  <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-8">

    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white">
        Update Booking
      </h1>

      <p className="text-gray-400 mt-2">
        Edit customer booking details
      </p>
    </div>

    <form onSubmit={handleSubmit}>

    <fieldset disabled={saving} className="space-y-8">

      <div className="grid md:grid-cols-2 gap-6">

  <div>
    <label className="block text-gray-300 mb-2">
      Customer Name
    </label>

    <input
      type="text"
      name="customerName"
      value={formData.customerName}
      onChange={handleChange}
      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500"
    />
  </div>

  <div>
    <label className="block text-gray-300 mb-2">
      Phone Number
    </label>

    <input
      type="text"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500"
    />
  </div>

</div>
<div className="grid md:grid-cols-2 gap-6">

  <div>
    <label className="block text-gray-300 mb-2">
      Booking Date
    </label>

    <input
      type="date"
      name="bookingDate"
      value={formData.bookingDate}
      onChange={handleChange}
      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
    />
  </div>

  <div>
    <label className="block text-gray-300 mb-2">
      Event Date
    </label>

    <input
      type="date"
      name="eventDate"
      value={formData.eventDate}
      onChange={handleChange}
      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
    />
  </div>

</div>
<div>
  <label className="block text-gray-300 mb-2">
    Packages
  </label>

  <div>
  <div className="flex justify-between items-center mb-3">
    <label className="text-gray-300 font-medium">
      Select Packages
    </label>

    <span className="text-xs text-blue-400">
      {formData.packages.length} package(s) selected
    </span>
  </div>

  <div className="grid md:grid-cols-2 gap-3 max-h-72 overflow-y-auto border border-white/10 rounded-xl p-4 bg-white/5">

    {packages.map((pkg) => {
      const selected = formData.packages.includes(pkg._id);

      return (
        <div
          key={pkg._id}
          onClick={() => togglePackage(pkg._id)}
          className={`cursor-pointer rounded-xl border p-4 transition-all
          ${
            selected
              ? "border-blue-500 bg-blue-500/20"
              : "border-white/10 hover:border-blue-400 hover:bg-white/5"
          }`}
        >
          <div className="flex justify-between items-start">

            <div>
              <h3 className="text-white font-semibold">
                {pkg.packageName}
              </h3>

              <p className="text-green-400 text-sm">
                Rs. {pkg.price}
              </p>
            </div>

            <input
              type="checkbox"
              checked={selected}
              onChange={() => togglePackage(pkg._id)}
              className="w-5 h-5 accent-blue-500"
            />
            
          </div>
          
        </div>
      );
    })}
  </div>
</div>
</div>
{formData.packages.length > 0 && (
  <div className="mt-4">
    <p className="text-gray-400 mb-2">
      Selected Packages
    </p>

    <div className="flex flex-wrap gap-2">
      {packages
        .filter((pkg) => formData.packages.includes(pkg._id))
        .map((pkg) => (
          <span
            key={pkg._id}
            className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded-full text-sm"
          >
            {pkg.packageName}
          </span>
        ))}
    </div>
  </div>
)}
<div className="grid md:grid-cols-3 gap-6">

  <div>
    <label className="block text-gray-300 mb-2">
      Extra Charges
    </label>

    <input
      type="number"
      name="extraCharges"
      value={formData.extraCharges}
      onChange={handleChange}
      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
    />
  </div>

  <div>
    <label className="block text-gray-300 mb-2">
      Discount
    </label>

    <input
      type="number"
      name="discount"
      value={formData.discount}
      onChange={handleChange}
      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
    />
  </div>

</div>
<div className="grid md:grid-cols-2 gap-6">

  <div>
    <label className="block text-gray-300 mb-2">
      Booking Status
    </label>

    <select
      name="bookingStatus"
      value={formData.bookingStatus}
      onChange={handleChange}
      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
    >
      <option className="bg-slate-900">Booked</option>
      <option className="bg-slate-900">Confirmed</option>
      <option className="bg-slate-900">Completed</option>
      <option className="bg-slate-900">Cancelled</option>
    </select>
  </div>

  <div>
  <label className="block text-gray-300 mb-2">
    Payment Status
  </label>

  <span
    className={`inline-block px-4 py-2 rounded-xl font-medium
    ${
      paymentInfo.paymentStatus === "Paid"
        ? "bg-green-500/20 text-green-400"
        : paymentInfo.paymentStatus === "Partially Paid"
        ? "bg-yellow-500/20 text-yellow-400"
        : "bg-red-500/20 text-red-400"
    }`}
  >
    {paymentInfo.paymentStatus}
  </span>
</div>

</div>
<div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl border border-white/10 p-6">

  <h2 className="text-xl font-semibold text-white mb-5">
    Payment Summary
  </h2>

  <div className="grid md:grid-cols-4 gap-5">

    <div className="bg-white/5 rounded-xl p-4">
      <p className="text-gray-400 text-sm">
        Package Total
      </p>

      <h3 className="text-2xl font-bold text-green-400 mt-2">
        Rs. {packageTotal}
      </h3>
    </div>

    <div className="bg-white/5 rounded-xl p-4">
      <p className="text-gray-400 text-sm">
        Booking Total
      </p>

      <h3 className="text-2xl font-bold text-blue-400 mt-2">
        Rs. {finalTotal}
      </h3>
    </div>

    <div className="bg-white/5 rounded-xl p-4">
      <p className="text-gray-400 text-sm">
        Paid Amount
      </p>

      <h3 className="text-2xl font-bold text-green-500 mt-2">
        Rs. {paymentInfo.paidAmount}
      </h3>
    </div>

    <div className="bg-white/5 rounded-xl p-4">
      <p className="text-gray-400 text-sm">
        Remaining Balance
      </p>

      <h3 className="text-2xl font-bold text-yellow-400 mt-2">
        Rs. {Math.max(finalTotal - paymentInfo.paidAmount, 0)}
      </h3>
    </div>

  </div>

</div>
<div>
  <label className="block text-gray-300 mb-2">
    Notes
  </label>

  <textarea
    rows={5}
    name="notes"
    value={formData.notes}
    onChange={handleChange}
    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white resize-none"
  />
</div>
<div className="flex justify-end gap-4">

  <button
  type="button"
  disabled={saving}
  onClick={() => navigate("/bookings")}
  className="px-6 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white"
>
  Cancel
</button>

  <button
  type="submit"
  disabled={saving}
  className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition flex items-center gap-2
  ${
    saving
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
  } text-white`}
>
  {saving ? (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Updating...
    </>
  ) : (
    "Update Booking"
  )}
</button>

</div>

    </fieldset>
    </form>

  </div>
</div>

    </div>
  );
}