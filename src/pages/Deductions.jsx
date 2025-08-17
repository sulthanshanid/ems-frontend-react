import React, { useState, useEffect, useContext, useMemo } from "react";
import { apiRequest } from "../utils/apiClient";
import { AuthContext } from "../context/AuthContext";
import API from "../config/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

export default function Deductions() {
  const { token } = useContext(AuthContext);
  const [deductions, setDeductions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [mode, setMode] = useState("list");
  const [selectedDeduction, setSelectedDeduction] = useState(null);
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
      fetchDeductions();
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

  const fetchDeductions = async () => {
    try {
      const res = await apiRequest(API.DEDUCTIONS, "GET", null, token);
      setDeductions(res);
    } catch (error) {
      console.error("Error fetching deductions", error);
      setDeductions([]);
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
        API.DEDUCTIONS,
        "POST",
        {
          employeeId: formData.employeeId,
          amount: parseFloat(formData.amount),
          remark: formData.remark,
          date: formData.date,
        },
        token
      );
      setDeductions((prev) => [...prev, res.deduction]);
      resetForm();
      setMode("list");
    } catch (error) {
      console.error("Error adding deduction", error);
    }
  };

  const handleEdit = async () => {
    if (!formData.employeeId || !formData.amount || !formData.date) {
      alert("Please fill employee, amount, and date");
      return;
    }
    try {
      const res = await apiRequest(
        `${API.DEDUCTIONS}/${selectedDeduction._id}`,
        "PUT",
        {
          employeeId: formData.employeeId,
          amount: parseFloat(formData.amount),
          remark: formData.remark,
          date: formData.date,
        },
        token
      );
      setDeductions((prev) =>
        prev.map((d) => (d._id === selectedDeduction._id ? res.deduction : d))
      );
      resetForm();
      setSelectedDeduction(null);
      setMode("list");
    } catch (error) {
      console.error("Error updating deduction", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this deduction?")) return;
    try {
      await apiRequest(`${API.DEDUCTIONS}/${id}`, "DELETE", null, token);
      setDeductions((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Error deleting deduction", error);
    }
  };

  const startEdit = (deduction) => {
    setSelectedDeduction(deduction);
    setFormData({
      employeeId: deduction.employeeId.toString(),
      amount: deduction.amount.toString(),
      remark: deduction.remark || "",
      date: deduction.date,
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

  // filter deductions by date
  const filteredDeductions = useMemo(() => {
    return deductions.filter((d) => {
      const dDate = new Date(d.date);
      const startOk = filterStart ? dDate >= new Date(filterStart) : true;
      const endOk = filterEnd ? dDate <= new Date(filterEnd) : true;
      return startOk && endOk;
    });
  }, [deductions, filterStart, filterEnd]);

  // calculate total dynamically
  const totalDeductions = useMemo(() => {
    return filteredDeductions.reduce((sum, d) => sum + d.amount, 0);
  }, [filteredDeductions]);

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-semibold mb-6">
            Loan & Deduction Management
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">Total Deductions</p>
              <p className="text-2xl font-bold">
                ${totalDeductions.toLocaleString()}
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

          {/* Employee Financial Records */}
          {mode === "list" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Employee Financial Records
                </h2>
                <button
                  onClick={() => {
                    resetForm();
                    setMode("add");
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  + Add New Deduction
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
                  {filteredDeductions.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 text-gray-500"
                      >
                        No deductions found
                      </td>
                    </tr>
                  )}
                  {filteredDeductions.map((deduction) => {
                    const employee = employees.find(
                      (e) => e._id === deduction.employeeId
                    );
                    return (
                      <tr
                        key={deduction._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">{deduction._id}</td>
                        <td className="p-3">
                          {employee ? employee.name : "Unknown"}
                        </td>
                        <td className="p-3">${deduction.amount.toFixed(2)}</td>
                        <td className="p-3">{deduction.remark}</td>
                        <td className="p-3">{deduction.date}</td>
                        <td className="p-3 space-x-2">
                          <button
                            onClick={() => startEdit(deduction)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(deduction._id)}
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

          {/* Add / Edit Deduction Form */}
          {(mode === "add" || mode === "edit") && (
            <div className="bg-white p-6 rounded-xl shadow mt-6">
              <h2 className="text-lg font-semibold mb-4">
                {mode === "add" ? "Add Deduction" : "Edit Deduction"}
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
                      setSelectedDeduction(null);
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
