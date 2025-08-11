import React, { useState, useEffect, useContext } from "react";
import { apiRequest } from "../utils/apiClient";
import API from "../config/api";
import { AuthContext } from "../context/AuthContext";

export default function SalarySummary() {
  const { token } = useContext(AuthContext);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(
        `${API.SALARY_SUMMARY}?month=${month}&year=${year}`,
        "GET",
        null,
        token
      );
      setSummary(res || []);
    } catch (err) {
      console.error("Failed to fetch salary summary", err);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSummary();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Salary Summary</h2>

      {/* Filters */}
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6 flex-wrap">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border p-2"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border p-2"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          View
        </button>
      </form>

      {/* Table */}
      {loading && <p>Loading...</p>}
      {summary.length > 0 && (
        <table className="border-collapse border w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Employee ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Total Salary</th>
              <th className="border p-2">Loan Deductions</th>
              <th className="border p-2">Deductions</th>
              <th className="border p-2">Final Salary</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((emp) => (
              <tr key={emp.employeeId}>
                <td className="border p-2">{emp.employeeId}</td>
                <td className="border p-2">{emp.name}</td>
                <td className="border p-2">{emp.totalSalary}</td>
                <td className="border p-2">{emp.loanDeductions}</td>
                <td className="border p-2">{emp.deductions}</td>
                <td className="border p-2 font-bold">{emp.finalSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
