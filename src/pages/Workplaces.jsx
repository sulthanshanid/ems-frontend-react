import React, { useState, useEffect, useContext } from "react";
import { apiRequest } from "../utils/apiClient";
import { AuthContext } from "../context/AuthContext";
import API from "../config/api";
import Navbar from "../components/Navbar";

export default function Workplaces() {
  const { token } = useContext(AuthContext);
  const [workplaces, setWorkplaces] = useState([]);
  const [mode, setMode] = useState("list"); // list, add, edit
  const [selectedWorkplace, setSelectedWorkplace] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (token) fetchWorkplaces();
  }, [token]);

  const fetchWorkplaces = async () => {
    try {
      const res = await apiRequest(API.WORKPLACES, "GET", null, token);
      setWorkplaces(res);
    } catch (error) {
      console.error("Error fetching workplaces", error);
      setWorkplaces([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      alert("Please enter workplace name");
      return;
    }
    try {
      const res = await apiRequest(
        API.WORKPLACES,
        "POST",
        { name: formData.name.trim() },
        token
      );
      setWorkplaces((prev) => [...prev, res.workplace]);
      resetForm();
      setMode("list");
    } catch (error) {
      console.error("Error adding workplace", error);
    }
  };

  const handleEdit = async () => {
    if (!formData.name.trim()) {
      alert("Please enter workplace name");
      return;
    }
    try {
      const res = await apiRequest(
        `${API.WORKPLACES}/${selectedWorkplace._id}`,
        "PUT",
        { name: formData.name.trim() },
        token
      );
      setWorkplaces((prev) =>
        prev.map((w) => (w._id === selectedWorkplace._id ? res.workplace : w))
      );
      resetForm();
      setSelectedWorkplace(null);
      setMode("list");
    } catch (error) {
      console.error("Error updating workplace", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workplace?")) return;
    try {
      await apiRequest(`${API.WORKPLACES}/${id}`, "DELETE", null, token);
      setWorkplaces((prev) => prev.filter((w) => w._id !== id));
    } catch (error) {
      console.error("Error deleting workplace", error);
    }
  };

  const startEdit = (workplace) => {
    setSelectedWorkplace(workplace);
    setFormData({ name: workplace.name });
    setMode("edit");
  };

  const resetForm = () => {
    setFormData({ name: "" });
  };

  return (
    <>
      
      <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
        <h2>Workplaces</h2>

        {mode === "list" && (
          <>
            <button
              onClick={() => {
                resetForm();
                setMode("add");
              }}
            >
              Add Workplace
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
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workplaces.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center" }}>
                      No workplaces found
                    </td>
                  </tr>
                ) : (
                  workplaces.map((workplace) => (
                    <tr key={workplace._id}>
                      <td>{workplace._id}</td>
                      <td>{workplace.name}</td>
                      <td>
                        <button onClick={() => startEdit(workplace)}>
                          Edit
                        </button>{" "}
                        <button onClick={() => handleDelete(workplace._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {(mode === "add" || mode === "edit") && (
          <div style={{ marginTop: 20 }}>
            <h3>{mode === "add" ? "Add Workplace" : "Edit Workplace"}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mode === "add" ? handleAdd() : handleEdit();
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <label>
                  Name:{" "}
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </label>
              </div>
              <button type="submit">{mode === "add" ? "Add" : "Save"}</button>{" "}
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setSelectedWorkplace(null);
                  setMode("list");
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
