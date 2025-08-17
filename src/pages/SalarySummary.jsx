// src/pages/SalarySummary.jsx
import React, { useState, useContext } from "react";
import { apiRequest } from "../utils/apiClient";
import API from "../config/api";
import { AuthContext } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Topbar from "../components/Topbar";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import plugin

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

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Salary Summary - ${month}/${year}`, 14, 20);

    const tableColumn = [
      "Employee ID",
      "Name",
      "Total Salary",
      "Loan Deductions",
      "Deductions",
      "Final Salary",
    ];
    const tableRows = summary.map((emp) => [
      emp.employeeId,
      emp.name,
      emp.totalSalary,
      emp.loanDeductions,
      emp.deductions,
      emp.finalSalary,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [30, 144, 255] }, // header color
      theme: "grid",
    });

    doc.save(`SalarySummary_${month}_${year}.pdf`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Salary Summary
          </h2>

          {/* Filters */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-4 mb-4 items-center"
          >
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
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
              className="border border-gray-300 rounded-lg px-4 py-2 w-28 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-600 transition"
            >
              View
            </button>

            {summary.length > 0 && (
              <button
                type="button"
                onClick={downloadPDF}
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
              >
                Download PDF
              </button>
            )}
          </form>

          {/* Salary Table */}
          {loading && <p className="text-gray-500">Loading...</p>}
          {!loading && summary.length === 0 && (
            <p className="text-gray-400 italic">
              No salary data available for selected month/year.
            </p>
          )}

          {summary.length > 0 && (
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gradient-to-r from-blue-200 to-indigo-200 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Employee ID</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Total Salary</th>
                    <th className="px-4 py-3 text-left">Loan Deductions</th>
                    <th className="px-4 py-3 text-left">Deductions</th>
                    <th className="px-4 py-3 text-left">Final Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((emp) => (
                    <tr
                      key={emp.employeeId}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="border px-4 py-2">{emp.employeeId}</td>
                      <td className="border px-4 py-2">{emp.name}</td>
                      <td className="border px-4 py-2">{emp.totalSalary}</td>
                      <td className="border px-4 py-2 text-red-600">
                        {emp.loanDeductions}
                      </td>
                      <td className="border px-4 py-2 text-yellow-600">
                        {emp.deductions}
                      </td>
                      <td className="border px-4 py-2 text-green-600 font-bold">
                        {emp.finalSalary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
