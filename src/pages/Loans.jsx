import React, { useState, useEffect, useContext, useMemo } from "react";
import { apiRequest } from "../utils/apiClient";
import { AuthContext } from "../context/AuthContext";
import API from "../config/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

export default function Loans() {
  const { token } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [mode, setMode] = useState("list");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    amount: "",
    remark: "",
    date: "",
  });

  // filters
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");

  useEffect(() => {
    if (token) {
      fetchEmployees();
      fetchLoans();
    }
    // eslint-disable-next-line
  }, [token]);

  const fetchEmployees = async () => {
    try {
      const res = await apiRequest(API.EMPLOYEES, "GET", null, token);
      setEmployees(res);
    } catch (error) {
      console.error("Error fetching employees", error);
      setEmployees([]);
    }
  };

  const fetchLoans = async () => {
    try {
      const res = await apiRequest(API.LOANS, "GET", null, token);
      setLoans(res);
    } catch (error) {
      console.error("Error fetching loans", error);
      setLoans([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleAdd = async () => {
    if (!formData.employeeId || !formData.amount || !formData.date) {
      alert("Please fill employee, amount, and date");
      return;
    }
    try {
      const res = await apiRequest(
        API.LOANS,
        "POST",
        {
          employeeId: formData.employeeId,
          amount: parseFloat(formData.amount),
          remark: formData.remark,
          date: formData.date,
        },
        token
      );
      setLoans((prev) => [...prev, res.loan]);
      resetForm();
      setMode("list");
    } catch (error) {
      console.error("Error adding loan", error);
    }
  };

  const handleEdit = async () => {
    if (!formData.employeeId || !formData.amount || !formData.date) {
      alert("Please fill employee, amount, and date");
      return;
    }
    try {
      const res = await apiRequest(
        `${API.LOANS}/${selectedLoan._id}`,
        "PUT",
        {
          employeeId: formData.employeeId,
          amount: parseFloat(formData.amount),
          remark: formData.remark,
          date: formData.date,
        },
        token
      );
      setLoans((prev) =>
        prev.map((l) => (l._id === selectedLoan._id ? res.loan : l))
      );
      resetForm();
      setSelectedLoan(null);
      setMode("list");
    } catch (error) {
      console.error("Error updating loan", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this loan?")) return;
    try {
      await apiRequest(`${API.LOANS}/${id}`, "DELETE", null, token);
      setLoans((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      console.error("Error deleting loan", error);
    }
  };

  const startEdit = (loan) => {
    setSelectedLoan(loan);
    setFormData({
      employeeId: loan.employeeId.toString(),
      amount: loan.amount.toString(),
      remark: loan.remark || "",
      date: loan.date,
    });
    setMode("edit");
  };

  const resetForm = () => {
    setFormData({
      employeeId: "",
      amount: "",
      remark: "",
      date: "",
    });
  };

  // filter loans by date
  const filteredLoans = useMemo(() => {
    return loans.filter((l) => {
      const lDate = new Date(l.date);
      const startOk = filterStart ? lDate >= new Date(filterStart) : true;
      const endOk = filterEnd ? lDate <= new Date(filterEnd) : true;
      return startOk && endOk;
    });
  }, [loans, filterStart, filterEnd]);

  // calculate total dynamically
  const totalLoans = useMemo(() => {
    return filteredLoans.reduce((sum, l) => sum + l.amount, 0);
  }, [filteredLoans]);

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-semibold mb-6">
            Loan & Financial Management
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">Total Loans</p>
              <p className="text-2xl font-bold">
                ${totalLoans.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                Based on selected date range.
              </p>
            </div>
          </div>

          {/* Filters */}
          {mode === "list" && (
            <div className="bg-white p-4 rounded-xl shadow mb-6 flex space-x-4">
              <div>
                <label className="block text-sm text-gray-600">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filterStart}
                  onChange={(e) => setFilterStart(e.target.value)}
                  className="border rounded px-3 py-1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">End Date</label>
                <input
                  type="date"
                  value={filterEnd}
                  onChange={(e) => setFilterEnd(e.target.value)}
                  className="border rounded px-3 py-1"
                />
              </div>
              <button
                onClick={() => {
                  setFilterStart("");
                  setFilterEnd("");
                }}
                className="self-end bg-gray-200 px-3 py-1 rounded"
              >
                Clear
              </button>
            </div>
          )}

          {/* Employee Loan Records */}
          {mode === "list" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Employee Loan Records</h2>
                <button
                  onClick={() => {
                    resetForm();
                    setMode("add");
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  + Add New Loan
                </button>
              </div>

              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Remark</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 text-gray-500"
                      >
                        No loans found
                      </td>
                    </tr>
                  )}
                  {filteredLoans.map((loan) => {
                    const employee = employees.find(
                      (e) => e._id === loan.employeeId
                    );
                    return (
                      <tr key={loan._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{loan._id}</td>
                        <td className="p-3">
                          {employee ? employee.name : "Unknown"}
                        </td>
                        <td className="p-3">${loan.amount.toFixed(2)}</td>
                        <td className="p-3">{loan.remark}</td>
                        <td className="p-3">{loan.date}</td>
                        <td className="p-3 space-x-2">
                          <button
                            onClick={() => startEdit(loan)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(loan._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Add / Edit Loan Form */}
          {(mode === "add" || mode === "edit") && (
            <div className="bg-white p-6 rounded-xl shadow mt-6">
              <h2 className="text-lg font-semibold mb-4">
                {mode === "add" ? "Add Loan" : "Edit Loan"}
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mode === "add" ? handleAdd() : handleEdit();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block mb-1">Employee</label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Remark</label>
                  <input
                    type="text"
                    name="remark"
                    value={formData.remark}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    {mode === "add" ? "Add" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setSelectedLoan(null);
                      setMode("list");
                    }}
                    className="bg-gray-300 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
