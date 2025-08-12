import React from "react";
import {
  FaBars,
  FaTimes,
  FaChartLine,
  FaUsers,
  FaMoneyBillWave,
  FaRegClock,
} from "react-icons/fa";
import { Link } from "react-router-dom";
export default function Sidebar({ open = false, setOpen = () => {} }) {
  const menu = [
    { name: "Employees", path: "/employees", icon: <FaUsers /> },
    { name: "View Deduction", path: "/deductions", icon: <FaMoneyBillWave /> },
    { name: "View Loan", path: "/loans", icon: <FaMoneyBillWave /> },
    { name: "Profile", path: "/profile", icon: <FaUsers /> },
    { name: "Workplaces", path: "/workplaces", icon: <FaUsers /> },
    { name: "Attendance", path: "/attendance", icon: <FaRegClock /> },
    {
      name: "Attendance Summary",
      path: "/attendance-summary",
      icon: <FaRegClock />,
    },
    {
      name: "Salary Summary",
      path: "/salary-summary",
      icon: <FaMoneyBillWave />,
    },
    { name: "Daily Stats", path: "/stats-daily", icon: <FaChartLine /> },
  ];

  return (
    <>
      {/* overlay for mobile when open */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform
          ${
            open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300`}
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center text-lg font-bold">
              EMS
            </div>
            <span className="text-lg font-semibold">EMS</span>
          </div>

          {/* mobile close */}
          <button
            className="md:hidden p-2 rounded hover:bg-white/10"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="px-3 py-6 space-y-1">
          {menu.map((m) => (
            <Link
              key={m.name}
              to={m.path}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/6 transition"
            >
              <span className="text-lg">{m.icon}</span>
              <span className="font-medium">{m.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-6 py-6 border-t border-slate-700">
          <p className="text-sm text-slate-300">
            © {new Date().getFullYear()} EMS
          </p>
        </div>
      </aside>

      {/* desktop sidebar placeholder (keeps layout) */}
      <div className="hidden md:block w-64 flex-shrink-0" aria-hidden />
    </>
  );
}
