import React, { useEffect, useState, useContext } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

import { apiRequest } from "../utils/apiClient";
import API from "../config/api";
import { AuthContext } from "../context/AuthContext";

export default function DashboardCharts() {
  const [wageLabels, setWageLabels] = useState([]);
  const [wageData, setWageData] = useState([]);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    apiRequest(API.DASHSTATS, "GET", null, token)
      .then((data) => {
        if (!data) return;

        const monthsOrder = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // Get current month index (0-based), e.g. August is 7
        const currentMonthIndex = new Date().getMonth();

        // Slice months array to current month inclusive
        const monthsUpToNow = monthsOrder.slice(0, currentMonthIndex + 1);

        // Map month wages by month name for easy lookup
        const wagesMap = (data.monthlyWages || []).reduce((acc, m) => {
          acc[m.month] = m.wage;
          return acc;
        }, {});

        setWageLabels(monthsUpToNow);
        setWageData(monthsUpToNow.map((month) => wagesMap[month] ?? 0));

        if (data.today) {
          setPresent(data.today.present ?? 0);
          setAbsent(data.today.absent ?? 0);
        }
      })
      .catch((err) => console.error("Error fetching dashstats:", err));
  }, [token]);

  // Wage Line Chart
  const wageChartData = {
    labels: wageLabels,
    datasets: [
      {
        label: "Wages (₹)",
        data: wageData,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.12)",
        tension: 0.3,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const wageOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed.y ?? ctx.raw;
            return new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(val);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) =>
            new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(value),
        },
      },
    },
  };

  // Attendance Doughnut
  const attendanceData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: ["#10b981", "#ef4444"],
        hoverOffset: 8,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-5 shadow">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Monthly Wages</h4>
          <div className="text-sm text-slate-500">Wage trend</div>
        </div>
        <div style={{ height: 300 }}>
          <Line data={wageChartData} options={wageOptions} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Attendance Overview</h4>
          <div className="text-sm text-slate-500">Today</div>
        </div>
        <div
          style={{ height: 300 }}
          className="flex items-center justify-center"
        >
          <Doughnut data={attendanceData} options={donutOptions} />
        </div>
      </div>
    </div>
  );
}
