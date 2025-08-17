// src/pages/AttendanceSummary.jsx
import React, { useState, useEffect, useContext } from "react";
import { apiRequest } from "../utils/apiClient";
import API from "../config/api";
import { AuthContext } from "../context/AuthContext";

import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function AttendanceSummary() {
  const { token } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await apiRequest(API.EMPLOYEES, "GET", null, token);
        setEmployees(res || []);
      } catch (err) {
        console.error("Failed to fetch employees", err);
      }
    };
    fetchEmployees();
  }, [token]);

  const fetchSummary = async () => {
    if (!selectedEmployee) return;
    setLoading(true);
    try {
      const res = await apiRequest(
        `${API.ATTENDANCE_SUMMARY}?employeeId=${selectedEmployee}&month=${month}&year=${year}`,
        "GET",
        null,
        token
      );
      setSummary(res?.data?.[0] || null);
    } catch (err) {
      console.error("Failed to fetch summary", err);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSummary();
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Attendance Summary
          </h1>

          {/* Filters */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-4 mb-8 items-center"
          >
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>

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
          </form>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
              <p className="text-gray-500 mb-2">Total Present Days</p>
              <h3 className="text-2xl font-bold text-green-600">
                {summary?.totalPresent || 0} Days
              </h3>
              <p className="text-gray-400 mt-1">Days marked as present</p>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
              <p className="text-gray-500 mb-2">Total Absent Days</p>
              <h3 className="text-2xl font-bold text-red-600">
                {summary?.totalAbsent || 0} Days
              </h3>
              <p className="text-gray-400 mt-1">Days marked as absent</p>
            </div>
          </div>

          {/* Detailed Records */}
          <div className="p-6 bg-white rounded-2xl shadow-lg mb-8 overflow-x-auto">
            <h3 className="font-semibold text-lg mb-4 text-gray-700">
              Detailed Records
            </h3>

            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 rounded-t-xl">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Workplace</th>
                  <th className="px-4 py-2 text-left">Wage</th>
                  <th className="px-4 py-2 text-left">Overtime Wage</th>
                </tr>
              </thead>
              <tbody>
                {summary?.days?.length > 0 ? (
                  summary.days.map((day, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-all">
                      <td className="px-4 py-2">
                        {new Date(day.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{day.status}</td>
                      <td className="px-4 py-2">{day.workplace || "-"}</td>
                      <td className="px-4 py-2">{day.wage}</td>
                      <td className="px-4 py-2">{day.overtimeWage}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-400 italic"
                    >
                      No records available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals, Loan & Deduction */}
          {summary && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl shadow-lg">
                <p>Total Present Days: {summary.totalPresent}</p>
                <p>Total Absent Days: {summary.totalAbsent}</p>
                <p>Total Wage: {summary.totalWage}</p>
                <p>Total Overtime Wage: {summary.totalOvertimeWage}</p>

                {summary.workplaces &&
                  Object.keys(summary.workplaces).length > 0 && (
                    <>
                      <p className="mt-2 font-medium">
                        Days Worked in Each Workplace:
                      </p>
                      <ul className="list-disc list-inside text-gray-600">
                        {Object.entries(summary.workplaces).map(
                          ([wp, count]) => (
                            <li key={wp}>
                              {wp}: {count} days
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}
              </div>

              <div className="p-6 bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl shadow-lg">
                <h4 className="font-semibold mb-2">Loan Details</h4>
                {summary.loans?.length > 0 ? (
                  <table className="w-full text-sm border-collapse mb-4">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.loans.map((loan, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2">{loan.amount}</td>
                          <td className="px-4 py-2">{loan.remark || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No loans for this month
                  </p>
                )}
                <p className="font-medium">
                  Total Loan Amount: {summary.totalLoanAmount}
                </p>
              </div>

              <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg">
                <h4 className="font-semibold mb-2">Deduction Details</h4>
                {summary.deductions?.length > 0 ? (
                  <table className="w-full text-sm border-collapse mb-4">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.deductions.map((ded, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2">{ded.amount}</td>
                          <td className="px-4 py-2">{ded.remark || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No deductions for this month
                  </p>
                )}
                <p className="font-medium">
                  Total Deduction Amount: {summary.totalDeductionAmount}
                </p>
                <h4 className="font-semibold mt-4">
                  Final Salary: {summary.finalSalary}
                </h4>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
