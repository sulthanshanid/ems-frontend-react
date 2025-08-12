import React, { useContext } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Topbar({ setSidebarOpen = () => {}, name = "Admin" }) {
  const { logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* LEFT SECTION */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-500 sm:hidden"
            >
              <FaBars size={20} />
            </button>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4">
            <FaBell className="text-slate-500 cursor-pointer" />

            <Link to="/profile" className="flex items-center gap-3">
              <img
                src="https://placehold.co/400"
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="hidden sm:block text-sm text-slate-700">
                {name}
              </div>
            </Link>

            <button
              onClick={logout}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
