import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import DashboardCharts from "../components/DashboardCharts";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";
import Footer from "../components/Footer";
import { apiRequest} from "../utils/apiClient";
import API from "../config/api";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiRequest(API.STATS, "GET", null, token);
        if (res && res.data) {
          // Map API response into StatCard-friendly format
          const newStats = [
            {
              title: "Workplaces",
              value: res.data.totalWorkplaces
                ? `${res.data.totalWorkplaces.toLocaleString("en-IN")}`
                : "0",
              icon: "chart",
              from: "#0ea5e9",
              to: "#3b82f6",
            },
            {
              title: "Employees",
              value: res.data.totalEmployees ?? 0,
              icon: "users",
              from: "#10b981",
              to: "#34d399",
            },
            {
              title: "Overtime Hours",
              value: res.data.overtimeHours ?? 0,
              icon: "clock",
              from: "#f59e0b",
              to: "#fb923c",
            },
            {
              title: "Wages Paid",
              value: res.data.totalWage
                ? `₹${res.data.totalWage.toLocaleString("en-IN")}`
                : "₹0",
              icon: "money",
              from: "#8b5cf6",
              to: "#ec4899",
            },
          ];
          setStats(newStats);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }

    fetchStats();
  }, [token]);

  return (
    <div className="min-h-screen flex bg-gray-50 text-slate-800">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content */}
      <div className={`flex-1 flex flex-col`}>
        <Topbar setSidebarOpen={setSidebarOpen} />

        <main className="p-6 md:p-8 flex-1">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.length > 0 ? (
              stats.map((s) => (
                <StatCard
                  key={s.title}
                  title={s.title}
                  value={s.value}
                  icon={s.icon}
                  gradientFrom={s.from}
                  gradientTo={s.to}
                />
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-500">
                Loading stats...
              </div>
            )}
          </div>

          {/* Charts + Right column */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DashboardCharts />
            </div>
            <div className="flex flex-col gap-6">
              <QuickActions />
              <RecentActivity />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
