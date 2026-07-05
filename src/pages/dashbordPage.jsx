import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaMoneyBillWave,
  FaCalendarCheck,
  FaClock,
  FaBox,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    monthlyIncome: 0,
    todayIncome: 0,
    pendingPayment: 0,
    totalBookings: 0,
    totalPackages: 0,
    chart: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(res.data.data);
    } catch (err) {
      console.log("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-400 text-sm">
          Manage your photography business easily
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Monthly Income */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 p-6 shadow-xl hover:scale-[1.02] transition">
          <FaMoneyBillWave size={30} />
          <p className="mt-4 text-sm opacity-80">Monthly Income</p>
          <h2 className="text-3xl font-bold mt-1">
            Rs. {dashboard.monthlyIncome.toLocaleString()}
          </h2>
        </div>

        {/* Today Income */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-6 shadow-xl hover:scale-[1.02] transition">
          <FaCalendarCheck size={30} />
          <p className="mt-4 text-sm opacity-80">Today's Income</p>
          <h2 className="text-3xl font-bold mt-1">
            Rs. {dashboard.todayIncome.toLocaleString()}
          </h2>
        </div>

        {/* Pending */}
        <div className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 p-6 shadow-xl hover:scale-[1.02] transition">
          <FaClock size={30} />
          <p className="mt-4 text-sm opacity-80">Pending Payments</p>
          <h2 className="text-3xl font-bold mt-1">
            Rs. {dashboard.pendingPayment.toLocaleString()}
          </h2>
        </div>

        {/* Bookings */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 p-6 shadow-xl hover:scale-[1.02] transition">
          <FaCalendarCheck size={30} />
          <p className="mt-4 text-sm opacity-80">Total Bookings</p>
          <h2 className="text-3xl font-bold mt-1">
            {dashboard.totalBookings}
          </h2>
        </div>

        {/* Packages */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 p-6 shadow-xl hover:scale-[1.02] transition">
          <FaBox size={30} />
          <p className="mt-4 text-sm opacity-80">Total Packages</p>
          <h2 className="text-3xl font-bold mt-1">
            {dashboard.totalPackages}
          </h2>
        </div>

      </div>

      {/* CHART */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">
            Monthly Income Report
          </h2>
          <p className="text-gray-400 text-sm">
            Last 6 months revenue
          </p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboard.chart}>
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "10px",
                }}
              />
              <Bar
                dataKey="income"
                fill="#3b82f6"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}