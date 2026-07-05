import { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus } from "react-icons/fi";

export default function Booking() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    bookingDate: "",
    eventDate: "",
    package: "",
    extraCharges: 0,
    discount: 0,
    advancePayment: 0,
    notes: "",
  });

  const [selectedPackage, setSelectedPackage] = useState(null);

  // Load packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/package`
        );
        setPackages(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "package") {
      const pkg = packages.find((p) => p._id === value);
      setSelectedPackage(pkg || null);
    }
  };

  // calculations
  const basePrice = selectedPackage?.price || 0;
  const extra = Number(form.extraCharges) || 0;
  const discount = Number(form.discount) || 0;
  const advance = Number(form.advancePayment) || 0;

  const total = basePrice + extra - discount;
  const balance = total - advance;

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/booking`,
        {
          ...form,
          totalAmount: total,
          balance: balance,
        }
      );

      alert("Booking Created Successfully");

      setForm({
        customerName: "",
        phone: "",
        bookingDate: "",
        eventDate: "",
        package: "",
        extraCharges: 0,
        discount: 0,
        advancePayment: 0,
        notes: "",
      });

      setSelectedPackage(null);
    } catch (err) {
      console.log(err);
      alert("Error creating booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Create New Booking
        </h1>
        <p className="text-gray-400 text-sm">
          Fill details to create a photography booking
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">

          <input
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            placeholder="Customer Name"
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"
            required
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"
            required
          />

          {/* DATES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Booking Date */}
            <div>
              <label className="text-sm text-gray-300">
                Booking Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="bookingDate"
                value={form.bookingDate}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"
                required
              />
            </div>

            {/* Event Date */}
            <div>
              <label className="text-sm text-gray-300">
                Event Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"
                required
              />
            </div>

          </div>

          {/* PACKAGE */}
          <select
            name="package"
            value={form.package}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"
            required
          >
            <option value="">Select Package</option>
            {packages.map((p) => (
              <option key={p._id} value={p._id}>
                {p.packageName} - Rs.{p.price}
              </option>
            ))}
          </select>

          {/* COST INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="relative">
  <label className="absolute -top-2 left-3 text-xs text-gray-300 bg-black px-1">
    Extra Charges
  </label>

  <input
    type="number"
    name="extraCharges"
    value={form.extraCharges}
    onChange={handleChange}
    className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none focus:border-blue-500"
  />
</div>

<div className="relative">
  <label className="absolute -top-2 left-3 text-xs text-gray-300 bg-black px-1">
    Discount
  </label>

  <input
    type="number"
    name="discount"
    value={form.discount}
    onChange={handleChange}
    className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none focus:border-blue-500"
  />
</div>
<div className="relative">
  <label className="absolute -top-2 left-3 text-xs text-gray-300 bg-black px-1">
    Advance Payment
  </label>

  <input
    type="number"
    name="advancePayment"
    value={form.advancePayment}
    onChange={handleChange}
    className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none focus:border-blue-500"
  />
</div>

          </div>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes (optional)"
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"
          />

        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="space-y-4">

          <div className="bg-blue-600/80 p-5 rounded-2xl">
            <p className="text-sm">Package Price</p>
            <h2 className="text-2xl font-bold">Rs. {basePrice}</h2>
          </div>

          <div className="bg-green-600/80 p-5 rounded-2xl">
            <p className="text-sm">Total Amount</p>
            <h2 className="text-2xl font-bold">Rs. {total}</h2>
          </div>

          <div className="bg-red-600/80 p-5 rounded-2xl">
            <p className="text-sm">Balance</p>
            <h2 className="text-2xl font-bold">Rs. {balance}</h2>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl transition"
          >
            <FiPlus />
            {submitting ? "Creating..." : "Create Booking"}
          </button>

        </div>

      </form>
    </div>
  );
}