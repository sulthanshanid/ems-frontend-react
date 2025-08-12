import React from "react";
import {
  FaChartLine,
  FaUsers,
  FaMoneyBillWave,
  FaRegClock,
} from "react-icons/fa";

const ICONS = {
  chart: <FaChartLine />,
  users: <FaUsers />,
  clock: <FaRegClock />,
  money: <FaMoneyBillWave />,
};

export default function StatCard({ title, value, icon = "chart", gradientFrom = "#3b82f6", gradientTo = "#06b6d4" }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-xl font-semibold">{value}</h3>
        </div>

        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          }}
        >
          {ICONS[icon] ?? ICONS.chart}
        </div>
      </div>
    </div>
  );
}
