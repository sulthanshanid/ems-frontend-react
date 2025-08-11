// src/pages/AttendanceSummary.jsx
import React, { useState, useEffect, useContext } from "react";
import { apiRequest } from "../utils/apiClient";
import API from "../config/api";
import { AuthContext } from "../context/AuthContext";

export default function AttendanceSummary() {
  const { token } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch employees on mount
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

      if (res?.data?.length > 0) {
        setSummary(res.data[0]); // take first item from array
      } else {
        setSummary(null);
      }
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Attendance Summary</h2>

      {/* Filters */}
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6 flex-wrap">
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="border p-2"
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

      {/* Summary Table */}
      {loading && <p>Loading...</p>}
      {summary && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {summary.employee?.name} - {month}/{year}
          </h3>

          <table className="border-collapse border w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Workplace</th>
                <th className="border p-2">Wage</th>
                <th className="border p-2">Overtime Wage</th>
              </tr>
            </thead>
            <tbody>
              {summary.days?.map((day, idx) => (
                <tr key={idx}>
                  <td className="border p-2">
                    {new Date(day.date).toLocaleDateString()}
                  </td>
                  <td className="border p-2">{day.status}</td>
                  <td className="border p-2">{day.workplace || "-"}</td>
                  <td className="border p-2">{day.wage}</td>
                  <td className="border p-2">{day.overtimeWage}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-4 p-4 border bg-gray-50">
            <p>Total Present Days: {summary.totalPresent}</p>
            <p>Total Absent Days: {summary.totalAbsent}</p>
            <p>Total Wage: {summary.totalWage}</p>
            <p>Total Overtime Wage: {summary.totalOvertimeWage}</p>

            {summary.workplaces &&
              Object.keys(summary.workplaces).length > 0 && (
                <>
                  <p className="mt-2">Days Worked in Each Workplace:</p>
                  <ul>
                    {Object.entries(summary.workplaces).map(([wp, count]) => (
                      <li key={wp}>
                        {wp}: {count} days
                      </li>
                    ))}
                  </ul>
                </>
              )}
          </div>

          {/* Loan & Deduction Details */}
          <div className="mt-4 p-4 border bg-gray-50">
            <h4 className="font-semibold mb-2">Loan Details</h4>
            {summary.loans?.length > 0 ? (
              <table className="border-collapse border w-full mb-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.loans.map((loan, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{loan.amount}</td>
                      <td className="border p-2">{loan.remark || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No loans for this month</p>
            )}
            <p className="font-medium">
              Total Loan Amount: {summary.totalLoanAmount}
            </p>

            <h4 className="font-semibold mt-4 mb-2">Deduction Details</h4>
            {summary.deductions?.length > 0 ? (
              <table className="border-collapse border w-full mb-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.deductions.map((ded, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{ded.amount}</td>
                      <td className="border p-2">{ded.remark || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No deductions for this month</p>
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
    </div>
  );
}
