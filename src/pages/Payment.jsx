import { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2, FiPlus, FiFileText, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
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
      const pendingBookings = bookRes.data.data.filter(
  (b)=> b.balance > 0
);

setBookings(pendingBookings);
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
  {b.customerName} | 
  Rs.{b.balance} Balance
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

      {/* PAYMENT TABLE */}

<div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

  <div className="p-5 border-b border-white/10">
    <h2 className="text-lg font-semibold text-white">
      Payment History
    </h2>

    <p className="text-sm text-gray-400">
      Total Payments: {payments.length}
    </p>
  </div>


  <div className="overflow-x-auto">

    <table className="w-full text-left text-white">

      <thead className="bg-white/10 text-gray-300 text-sm uppercase">

        <tr>

          <th className="px-6 py-4">
            #
          </th>

          <th className="px-6 py-4">
            Customer
          </th>

          <th className="px-6 py-4">
            Packages
          </th>

          <th className="px-6 py-4">
            Total
          </th>

          <th className="px-6 py-4">
            Paid
          </th>

          <th className="px-6 py-4">
            Balance
          </th>

          <th className="px-6 py-4">
            Method
          </th>

          <th className="px-6 py-4 text-center">
            Actions
          </th>

        </tr>

      </thead>



      <tbody>


      {
        payments.length === 0 ? (

          <tr>

            <td
              colSpan="8"
              className="text-center py-8 text-gray-400"
            >
              No Payments Found
            </td>

          </tr>


        ) : (


        payments.map((p,index)=>(


          <tr

          key={p._id}

          className="border-t border-white/10 hover:bg-white/5 transition"

          >


            <td className="px-6 py-4">
              {index+1}
            </td>



            <td className="px-6 py-4">

              <p className="font-semibold">
                {p.booking?.customerName}
              </p>

              <p className="text-xs text-gray-400">
                {p.booking?.phone}
              </p>

            </td>





            <td className="px-6 py-4 max-w-xs">


            <div className="flex flex-wrap gap-1">


            {
              p.booking?.packages?.map((pkg)=>(

                <span

                key={pkg._id}

                className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs"

                >

                  {pkg.packageName}

                </span>


              ))
            }


            </div>


            </td>






            <td className="px-6 py-4">

              Rs. {p.booking?.totalAmount}

            </td>





            <td className="px-6 py-4">

              <span className="text-green-400 font-semibold">

                Rs. {p.amount}

              </span>

            </td>





            <td className="px-6 py-4">

              {
                p.booking?.balance === 0 ? (

                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                    Paid
                  </span>


                ) : (

                  <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs">
                    Rs. {p.booking?.balance}
                  </span>

                )
              }


            </td>





            <td className="px-6 py-4">

              <span className="bg-white/10 px-3 py-1 rounded-full text-xs">

                {p.paymentMethod}

              </span>

            </td>





            <td className="px-6 py-4">


              <div className="flex justify-center gap-2">


                {/* Invoice */}

                <button

                onClick={() => downloadInvoice(p._id)}

                className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30"

                >

                  <FiFileText/>

                </button>


<button
    onClick={() => navigate(`/payment/edit/${p._id}`)}
    className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:scale-110 transition"
>
  <FiEdit />
</button>


                {/* Delete */}

                <button

                onClick={()=>handleDelete(p._id)}

                disabled={deletingId === p._id}

                className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50"

                >

                {
                  deletingId === p._id
                  ?
                  "..."
                  :
                  <FiTrash2/>
                }


                </button>


              </div>


            </td>


          </tr>


        ))


        )

      }



      </tbody>


    </table>


  </div>


</div>

    </div>
  );
}