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

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    bookingDate: "",
    eventDate: "",
    packages: [],
    extraCharges: 0,
    discount: 0,
    advancePayment: 0,
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
      advancePayment: booking.advancePayment,
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      notes: booking.notes,
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

  const handlePackageChange = (e) => {
    const values = [...e.target.selectedOptions].map((option) => option.value);

    setFormData({
      ...formData,
      packages: values,
    });
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

  <select
    multiple
    value={formData.packages}
    onChange={handlePackageChange}
    className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-3 text-white"
  >
    {packages.map((item) => (
      <option
        key={item._id}
        value={item._id}
        className="bg-slate-900"
      >
        {item.packageName} - Rs. {item.price}
      </option>
    ))}
  </select>
</div>
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

  <div>
    <label className="block text-gray-300 mb-2">
      Advance Payment
    </label>

    <input
      type="number"
      name="advancePayment"
      value={formData.advancePayment}
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

    <select
      name="paymentStatus"
      value={formData.paymentStatus}
      onChange={handleChange}
      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
    >
      <option className="bg-slate-900">Pending</option>
      <option className="bg-slate-900">Partially Paid</option>
      <option className="bg-slate-900">Paid</option>
    </select>
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