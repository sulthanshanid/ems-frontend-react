// src/pages/Employees.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../utils/apiClient";
import API from "../config/api";

export default function Employees() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [mode, setMode] = useState("list"); // list | add | edit
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "",wage: "" });
  const [error, setError] = useState("");

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const data = await apiRequest(API.EMPLOYEES, "GET", null, token);
      setEmployees(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
      if (err.message.toLowerCase().includes("unauthorized")) {
        navigate("/"); // redirect to login if token invalid
      }
    }
  };

  useEffect(() => {
    if (mode === "list") {
      fetchEmployees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Handle form submit (add/edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "add") {
        await apiRequest(API.EMPLOYEES, "POST", formData, token);
      } else if (mode === "edit") {
        await apiRequest(`${API.EMPLOYEES}/${selectedEmployee._id}`, "PUT", formData, token);
      }
      setMode("list"); // return to list after save
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await apiRequest(`${API.EMPLOYEES}/${id}`, "DELETE", null, token);
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    }
  };

  return (
    <div className="p-4">
      {error && <p className="text-red-500">{error}</p>}

      {mode === "list" && (
        <>
          <h2 className="text-2xl mb-4">All Employees</h2>
          <button 
            onClick={() => { setFormData({ name: "", email: "", role: "" ,wage:""}); setMode("add"); }}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Employee
          </button>
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id}>
                  <td className="border p-2">{emp.name}</td>
                  <td className="border p-2">{emp.email}</td>
                  <td className="border p-2">{emp.role}</td>
                  <td className="border p-2">
                    <button 
                      className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                      onClick={() => { setSelectedEmployee(emp); setFormData(emp); setMode("edit"); }}
                    >
                      Edit
                    </button>
                    <button 
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDelete(emp._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(mode === "add" || mode === "edit") && (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <h2 className="text-xl mb-4">{mode === "add" ? "Add Employee" : "Edit Employee"}</h2>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="block w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="block w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="block w-full mb-4 p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="wage"
            value={formData.wage}
            onChange={(e) => setFormData({ ...formData, wage: e.target.value })}
            className="block w-full mb-4 p-2 border rounded"
            required
          />
          <div>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded mr-2">
              Save
            </button>
            <button type="button" onClick={() => setMode("list")} className="px-4 py-2 bg-gray-500 text-white rounded">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
