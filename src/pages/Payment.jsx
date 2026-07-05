import { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2, FiPlus, FiFileText } from "react-icons/fi";

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [form, setForm] = useState({
    booking: "",
    amount: "",
    paymentMethod: "Cash",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [payRes, bookRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/payment`),
        axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/booking`),
      ]);

      setPayments(payRes.data.data);
      setBookings(bookRes.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/payment`,
        form
      );

      setForm({
        booking: "",
        amount: "",
        paymentMethod: "Cash",
      });

      fetchData();
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this payment?")) return;

    setDeletingId(id);

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/payment/${id}`
      );

      fetchData();
    } catch (err) {
      console.log(err);
    } finally {
      setDeletingId(null);
    }
  };

  // 👉 INVOICE DOWNLOAD
  const downloadInvoice = (id) => {
    window.open(
      `${import.meta.env.VITE_BACKEND_URI}/api/invoice/${id}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Payment Management
        </h1>
        <p className="text-gray-400 text-sm">
          Manage all customer payments & invoices
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Add New Payment
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >

          {/* Booking */}
          <select
            name="booking"
            value={form.booking}
            onChange={handleChange}
            className="p-3 rounded-xl bg-black/30 border border-white/10 text-white"
            required
          >
            <option value="">Select Booking</option>
            {bookings.map((b) => (
              <option key={b._id} value={b._id}>
                {b.customerName} - Rs.{b.totalAmount}
              </option>
            ))}
          </select>

          {/* Amount */}
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"
            required
          />

          {/* Method */}
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="p-3 rounded-xl bg-black/30 border border-white/10 text-white"
          >
            <option>Cash</option>
            <option>Card</option>
            <option>Bank Transfer</option>
            <option>Online</option>
          </select>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-3 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 py-3 rounded-xl font-semibold"
          >
            {submitting ? "Processing..." : (
              <>
                <FiPlus />
                Add Payment
              </>
            )}
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {payments.map((p) => (
          <div
            key={p._id}
            className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:scale-[1.02] transition"
          >

            <h3 className="font-bold text-lg text-white">
              {p.booking?.customerName}
            </h3>

            <p className="text-gray-400 text-sm">
              Package: {p.booking?.package?.packageName}
            </p>

            <p className="mt-2 text-green-400 font-bold">
              Rs. {p.amount}
            </p>

            <p className="text-sm text-gray-400">
              Method: {p.paymentMethod}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-4">

              {/* INVOICE */}
              <button
                onClick={() => downloadInvoice(p._id)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg"
              >
                <FiFileText /> Invoice
              </button>

              {/* DELETE */}
              <button
                onClick={() => handleDelete(p._id)}
                disabled={deletingId === p._id}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg disabled:opacity-50"
              >
                {deletingId === p._id ? "Deleting..." : (
                  <>
                    <FiTrash2 /> Delete
                  </>
                )}
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}