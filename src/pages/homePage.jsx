import {
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { BsGraphUp } from "react-icons/bs";
import { MdPayments } from "react-icons/md";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { FaAmazonPay } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { BiSolidBookAdd } from "react-icons/bi";

import Dashboard from "./dashbordPage";
import Packages from "./Packeges/home";
import Payment from "./Payment";
import Booking from "./booking";
import ViewBooking from "./viewBooking";
import BookingUpdate from "./bookingUpdate";
import PaymentEdit from "./updatePayment";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const menuItem = (to, icon, label) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
      ${
        location.pathname === to
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
          : "hover:bg-white/10 hover:translate-x-1"
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-white">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 z-50">
        <h1 className="font-bold text-blue-400">Photography POS</h1>

        <button onClick={() => setOpen(!open)}>
          <HiOutlineMenuAlt3 size={24} />
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-72 bg-slate-900/70 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col z-40 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >

        {/* USER CARD */}
        <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-black-500 to-black-600 flex items-center justify-center font-bold text-xl">
            <img src="/logo.png" alt="User Avatar" className="w-16 h-16" />
          </div>

          <h2 className="mt-3 font-semibold">
            {user?.name || "Admin"}
          </h2>

          <p className="text-xs text-gray-400">
            System Administrator
          </p>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-2">
          {menuItem("/", <BsGraphUp />, "Dashboard")}
          {menuItem("/packages", <MdPayments />, "Packages")}
          {menuItem("/payments", <FaAmazonPay />, "Payments")}
          {menuItem("/bookings", <FaBookOpenReader />, "Bookings")}
          {menuItem("/addBooking", <BiSolidBookAdd />, "Add Booking")}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center justify-center gap-3 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white py-3 rounded-xl transition-all"
        >
          <FiLogOut />
          Logout
        </button>

        {/* FOOTER */}
        <div className="text-xs text-gray-500 text-center mt-4">
          © 2026 TN International
        </div>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 md:hidden z-30"
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-72 pt-16 md:pt-6 p-4 md:p-6 overflow-auto flex justify-center">

        <div className="w-full max-w-[1400px]">

          {/* PAGE CONTAINER */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl min-h-full">

            <Routes>

              <Route path="/" element={<Dashboard />} />

              <Route
                path="/packages"
                element={
                  <Packages/>
                }
              />

              <Route
                path="/payments"
                element={
                  <Payment/>
                }
              />

              <Route
                path="/bookings"
                element={
                  <ViewBooking/>
                }
              />

              <Route
                path="/addBooking"
                element={
                  <Booking/>
                }
              />

              <Route
                path="/*"
                element={
                  <h1 className="text-red-400 text-xl">
                    404 Page Not Found
                  </h1>
                }
              />
              <Route path="/updateBooking/:id" element={<BookingUpdate />} />

              <Route 
path="/payment/edit/:id"
element={<PaymentEdit/>}
/>

            </Routes>

          </div>

        </div>
      </div>

    </div>
  );
}