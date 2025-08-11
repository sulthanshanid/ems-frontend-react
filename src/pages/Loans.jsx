import React, { useState, useEffect, useContext } from "react";
import { apiRequest } from "../utils/apiClient";
import { AuthContext } from "../context/AuthContext";
import API from "../config/api";
import Navbar from "../components/Navbar"; // Assuming you have a Navbar component
export default function Loans() {
  const { token } = useContext(AuthContext); // get token from context
  const [deductions, setDeductions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [mode, setMode] = useState("list"); // 'list', 'add', 'edit'
  const [selectedDeduction, setSelectedDeduction] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    amount: "",
    remark: "",
    date: "",
  });

  useEffect(() => {
    if (token) {
      fetchEmployees();
      fetchDeductions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const res = await apiRequest(API.LOANS, "GET", null, token);
      setDeductions(res);
      console.log("Fetched deductions:", res);
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
      setDeductions((prev) => [...prev, res.loan]);
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
        `${API.LOANS}/${selectedDeduction._id}`,
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
        prev.map((d) =>
          d._id === selectedDeduction._id ? res.deduction : d
        )
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
      await apiRequest(`${API.LOANS}/${id}`, "DELETE", null, token);
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

  return (<>
    
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2>Loans</h2>
      
      {mode === "list" && (
        <>
          <button
            onClick={() => {
              resetForm();
              setMode("add");
            }}
          >
            Add Deduction
          </button>
          <table
            border="1"
            cellPadding="8"
            cellSpacing="0"
            style={{ width: "100%", marginTop: 10 }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Amount</th>
                <th>Remark</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(deductions.length === 0) && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No deductions found
                  </td>
                </tr>
              )}
              {
                deductions.map((deduction) => {
                  const employee = employees.find(
                    (e) => e._id === deduction.employeeId
                  );
                  return (
                    <tr key={deduction._id}>
                      <td>{deduction._id}</td>
                      <td>{employee ? employee.name : "Unknown"}</td>
                      <td>{deduction.amount.toFixed(2)}</td>
                      <td>{deduction.remark}</td>
                      <td>{deduction.date}</td>
                      <td>
                        <button onClick={() => startEdit(deduction)}>
                          Edit
                        </button>{" "}
                        <button onClick={() => handleDelete(deduction._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </>
      )}

      {(mode === "add" || mode === "edit") && (
        <div style={{ marginTop: 20 }}>
          <h3>{mode === "add" ? "Add Deduction" : "Edit Deduction"}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mode === "add" ? handleAdd() : handleEdit();
            }}
          >
            <div style={{ marginBottom: 10 }}>
              <label>
                Employee:{" "}
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>
                Amount:{" "}
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>
                Remark:{" "}
                <input
                  type="text"
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>
                Date:{" "}
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <button type="submit">{mode === "add" ? "Add" : "Save"}</button>{" "}
            <button
              type="button"
              onClick={() => {
                resetForm();
                setSelectedDeduction(null);
                setMode("list");
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  </>);
}
