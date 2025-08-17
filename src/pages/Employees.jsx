// src/pages/Employees.jsx 
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../utils/apiClient";
import API from "../config/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

export default function Employees() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // States
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Add Employee form toggle and state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: "",
    jobTitle: "",
    status: "Active",
    wage: "",
  });
  const [formError, setFormError] = useState("");

  // Edit mode tracking by employee id
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  // Edit form data for employee being edited
  const [editEmployeeData, setEditEmployeeData] = useState({});

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const data = await apiRequest(API.EMPLOYEES, "GET", null, token);
      setEmployees(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
      if (err.message.toLowerCase().includes("unauthorized")) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filters & Pagination
  const filteredEmployees = employees.filter((emp) => {
    const deptMatch = filterDept === "All" || emp.department === filterDept;
    const statusMatch =
      filterStatus === "All" ||
      emp.status?.toLowerCase() === filterStatus.toLowerCase();
    return deptMatch && statusMatch;
  });
  const pagedEmployees = filteredEmployees.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Summary calculations
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const avgAttendanceRate =
    employees.length === 0
      ? 0
      : (
          employees.reduce((sum, emp) => sum + (emp.attendanceRate || 0), 0) /
          employees.length
        ).toFixed(1);
  const departments = [...new Set(employees.map((e) => e.department))];

  // Add Employee Form Handlers
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!newEmployee.name.trim() || !newEmployee.department.trim()) {
      setFormError("Name and Department are required.");
      return;
    }
    try {
      const payload = {
        name: newEmployee.name.trim(),
        department: newEmployee.department.trim(),
        jobTitle: newEmployee.jobTitle.trim(),
        status: newEmployee.status,
        wage: newEmployee.wage ? parseFloat(newEmployee.wage) : 0,
        status: newEmployee.status || "Active",
        
        
      };
      await apiRequest(API.EMPLOYEES, "POST", payload, token);
      setShowAddForm(false);
      setNewEmployee({
        name: "",
        department: "",
        jobTitle: "",
        status: "Active",
        wage: "",
        
       
      });
      fetchEmployees();
    } catch (err) {
      setFormError(err.message || "Failed to add employee.");
    }
  };

  // Edit handlers
  const handleEditClick = (emp) => {
    setEditEmployeeId(emp._id);
    setEditEmployeeData({
      name: emp.name || "",
      department: emp.department || "",
      jobTitle: emp.jobTitle || emp.role || "",
      status: emp.status || "Active",
      wage: emp.wage || "",
      status: emp.status || "Active",
      
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCancel = () => {
    setEditEmployeeId(null);
    setEditEmployeeData({});
  };

  const handleEditSave = async (id) => {
    if (!editEmployeeData.name.trim() || !editEmployeeData.department.trim()) {
      alert("Name and Department are required.");
      return;
    }
    try {
      const payload = {
        name: editEmployeeData.name.trim(),
        department: editEmployeeData.department.trim(),
        jobTitle: editEmployeeData.jobTitle.trim(),
        status: editEmployeeData.status,

      };
      await apiRequest(`${API.EMPLOYEES}/${id}`, "PUT", payload, token);
      setEditEmployeeId(null);
      setEditEmployeeData({});
      fetchEmployees();
    } catch (err) {
      alert(err.message || "Failed to update employee.");
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      await apiRequest(`${API.EMPLOYEES}/${id}`, "DELETE", null, token);
      fetchEmployees();
    } catch (err) {
      alert(err.message || "Failed to delete employee.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Employee Summary</h1>

          {/* Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-5 rounded-lg shadow text-center">
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-3xl font-bold">{totalEmployees}</p>
              <p className="text-xs text-gray-400 mt-1">
                All active and inactive staff members.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow text-center">
              <p className="text-sm text-gray-500">Active Employees</p>
              <p className="text-3xl font-bold">{activeEmployees}</p>
              <p className="text-xs text-gray-400 mt-1">
                Currently working and on payroll.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow text-center">
              <p className="text-sm text-gray-500">Avg. Attendance Rate</p>
              <p className="text-3xl font-bold">{avgAttendanceRate}%</p>
              <p className="text-xs text-gray-400 mt-1">
                Across all employees for the last month.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow text-center">
              <p className="text-sm text-gray-500 font-semibold mb-2">
                Employees by Department
              </p>
              <div className="flex justify-center space-x-2">
                {departments.map((dept) => {
                  const count = employees.filter(
                    (e) => e.department === dept
                  ).length;
                  const maxCount = Math.max(
                    ...departments.map(
                      (d) => employees.filter((e) => e.department === d).length
                    )
                  );
                  const heightPercent = (count / maxCount) * 100;
                  return (
                    <div key={dept} className="flex flex-col items-center">
                      <div
                        className="bg-blue-600 w-6 rounded-t"
                        style={{ height: `${heightPercent}%` }}
                        title={`${dept}: ${count}`}
                      />
                      <span className="text-xs mt-1">{dept}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Filters and Add Button */}
          <section className="flex items-center justify-between mb-4">
            <div className="flex space-x-4">
              <select
                value={filterDept}
                onChange={(e) => {
                  setFilterDept(e.target.value);
                  setPage(1);
                }}
                className="border rounded px-3 py-1"
              >
                <option value="All">Filter by Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setPage(1);
                }}
                className="border rounded px-3 py-1"
              >
                <option value="All">Filter by Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Add New Employee
              </button>
            )}
          </section>

          {/* Add Employee Form */}
          {showAddForm && (
            <section className="bg-white p-6 rounded shadow mb-6 max-w-xl">
              <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
              {formError && (
                <div className="mb-3 text-red-600 font-semibold">
                  {formError}
                </div>
              )}
              <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
                {/* Form inputs */}
                <div>
                  <label className="block font-medium mb-1" htmlFor="name">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newEmployee.name}
                    onChange={handleAddInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block font-medium mb-1"
                    htmlFor="department"
                  >
                    Department <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={newEmployee.department}
                    onChange={handleAddInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1" htmlFor="jobTitle">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={newEmployee.jobTitle}
                    onChange={handleAddInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1" htmlFor="jobTitle">
                    Wage
                  </label>
                  <input
                    type="number"
                    id="wage"
                    name="wage"
                    value={newEmployee.wage}
                    onChange={handleAddInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newEmployee.status}
                    onChange={handleAddInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                  
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save Employee
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setFormError("");
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Employee Table */}
          <section className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 px-4 py-2">
                    Employee ID
                  </th>
                  <th className="border border-gray-200 px-4 py-2">Name</th>
                  <th className="border border-gray-200 px-4 py-2">
                    Department
                  </th>
                  <th className="border border-gray-200 px-4 py-2">
                    Job Title
                  </th>
                  <th className="border border-gray-200 px-4 py-2">
                    Wage
                  </th>
                  <th className="border border-gray-200 px-4 py-2">Status</th>
                  <th className="border border-gray-200 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center p-4 text-gray-500">
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  pagedEmployees.map((emp) => (
                    <tr
                      key={emp._id}
                      className="hover:bg-gray-50 border-b border-gray-200"
                    >
                      <td className="border border-gray-200 px-4 py-2 font-semibold">
                        {emp.employeeId || emp._id}
                      </td>

                      {/* If editing this employee, show inputs */}
                      {editEmployeeId === emp._id ? (
                        <>
                          <td className="border border-gray-200 px-4 py-2">
                            <input
                              type="text"
                              name="name"
                              value={editEmployeeData.name}
                              onChange={handleEditInputChange}
                              className="w-full border rounded px-2 py-1"
                            />
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            <input
                              type="text"
                              name="department"
                              value={editEmployeeData.department}
                              onChange={handleEditInputChange}
                              className="w-full border rounded px-2 py-1"
                            />
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            <input
                              type="text"
                              name="jobTitle"
                              value={editEmployeeData.jobTitle}
                              onChange={handleEditInputChange}
                              className="w-full border rounded px-2 py-1"
                            />
                          </td>
                         <td className="border border-gray-200 px-4 py-2">
                            <input  type="number"
                              name="wage"
                              value={editEmployeeData.wage}
                              onChange={handleEditInputChange}
                              className="w-full border rounded px-2 py-1"
                            />
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            <select
                              name="status"
                              value={editEmployeeData.status}
                              onChange={handleEditInputChange}
                              className="w-full border rounded px-2 py-1"
                            >
                              <option value="Active">Active</option>
                              <option value="On Leave">On Leave</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-center space-x-1">
                            <button
                              onClick={() => handleEditSave(emp._id)}
                              className="text-green-600 hover:text-green-800 font-semibold"
                              title="Save"
                            >
                              ✔
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="text-red-600 hover:text-red-800 font-semibold"
                              title="Cancel"
                            >
                              ✖
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          {/* Display row data */}
                          <td className="border border-gray-200 px-4 py-2">
                            {emp.name}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {emp.department}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {emp.jobTitle || emp.role}
                          </td>
                         <td className="border border-gray-200 px-4 py-2">
                          {emp.wage}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                emp.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : emp.status === "On Leave"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {emp.status || "Unknown"}
                            </span>
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-center space-x-2">
                            <button
                              onClick={() => handleEditClick(emp)}
                              className="text-blue-600 hover:text-blue-800 font-semibold"
                              title="Edit"
                            >
                              ✎
                            </button>
                            <button
                              onClick={() => handleDelete(emp._id)}
                              className="text-red-600 hover:text-red-800 font-semibold"
                              title="Delete"
                            >
                              🗑
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          {/* Pagination */}
          <nav
            className="flex justify-center items-center space-x-3 mt-6 text-gray-600"
            aria-label="Pagination"
          >
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`px-3 py-1 rounded border border-gray-300 hover:bg-gray-200 ${
                page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              &lt; Previous
            </button>
            <span className="px-3 py-1 border border-blue-600 rounded bg-blue-100 font-semibold">
              {page}
            </span>
            <button
              disabled={page * pageSize >= filteredEmployees.length}
              onClick={() => setPage(page + 1)}
              className={`px-3 py-1 rounded border border-gray-300 hover:bg-gray-200 ${
                page * pageSize >= filteredEmployees.length
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next &gt;
            </button>
          </nav>
        </main>
        <Footer />
      </div>
    </div>
  );
}
