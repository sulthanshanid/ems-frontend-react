import React, { useState, useEffect } from "react";
import API from "../config/api";
import { apiRequest } from "../utils/apiClient";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const statusClasses = {
  success: "bg-green-100 text-green-700",
  info: "bg-blue-100 text-blue-700",
  warning: "bg-yellow-100 text-yellow-700",
};

export default function RecentActivity() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);
  useEffect(() => {
    async function fetchActivity() {
      try {
        setLoading(true);
        const res = await apiRequest(API.RECENT,"GET",null,token); // replace with your actual endpoint path
        setItems(res); // assuming your API client returns { data: [...] }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch activity");
        setLoading(false);
      }
    }
    fetchActivity();
  }, []);

  const TitleLoading = () => (
    <div className="w-32 h-6 rounded bg-gray-300 animate-pulse" />
  );

  return (
    <div className="bg-white rounded-2xl p-5 shadow">
      <div className="flex items-center justify-between mb-3">
        {loading ? <TitleLoading /> : <h4 className="font-semibold">Recent Activity</h4>}
        <span className="text-sm text-slate-500">Activity log</span>
      </div>

      {error && <div className="text-red-500 mb-3">{error}</div>}

      {loading ? (
        <ul>
          {[1, 2, 3].map((n) => (
            <li key={n} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
                <div className="flex flex-col gap-1">
                  <div className="w-24 h-4 rounded bg-slate-200 animate-pulse" />
                  <div className="w-32 h-3 rounded bg-slate-200 animate-pulse" />
                </div>
              </div>
              <div className="w-16 h-5 rounded bg-slate-200 animate-pulse" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((it) => (
            <li key={it.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                  {it.user
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="font-medium">{it.user}</div>
                  <div className="text-sm text-slate-500">{it.action}</div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
                    statusClasses[it.status]
                  }`}
                >
                  {it.time}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
