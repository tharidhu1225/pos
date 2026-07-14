import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiEye, FiTrash2, FiPlus, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ViewBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/booking`
      );
      setBookings(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/booking/${id}`
      );
      fetchBookings();
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = bookings.filter((b) =>
    b.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Bookings
          </h1>
          <p className="text-gray-400 text-sm">
            Manage all customer bookings easily
          </p>
        </div>

        {/* ADD BUTTON (FIXED + VISIBLE) */}
        <button
          onClick={() => navigate("/addBooking")}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-5 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200"
        >
          <FiPlus size={18} />
          Add Booking
        </button>

      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer..."
          className="bg-transparent w-full outline-none text-white"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl">

        {loading ? (
          <div className="p-6 text-gray-400">Loading bookings...</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-300">

            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="p-4">Customer</th>
                <th>Phone</th>
                <th>Package</th>
                <th>Event Date</th>
                <th>Total</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((b) => (
                <tr
                  key={b._id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-4 font-semibold text-white">
                    {b.customerName}
                  </td>

                  <td>{b.phone}</td>
                  <td>{b.package?.packageName}</td>

                  <td>
                    {new Date(b.eventDate).toLocaleDateString()}
                  </td>

                  <td className="text-green-400">
                    Rs. {b.totalAmount}
                  </td>

                  <td className="text-yellow-400">
                    Rs. {b.balance}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        b.paymentStatus === "Paid"
                          ? "bg-green-500/20 text-green-400"
                          : b.paymentStatus === "Partially Paid"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {b.paymentStatus}
                    </span>
                  </td>

                  <td className="flex gap-2 p-3">

  {/* View */}
  <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:scale-110 transition">
    <FiEye />
  </button>

  {/* Edit */}
  <button
    onClick={() => navigate(`/updateBooking/${b._id}`)}
    className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:scale-110 transition"
  >
    <FiEdit />
  </button>

  {/* Delete */}
  <button
    onClick={() => handleDelete(b._id)}
    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:scale-110 transition"
  >
    <FiTrash2 />
  </button>

</td>
                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
}