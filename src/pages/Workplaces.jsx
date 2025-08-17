import React, { useState, useEffect, useContext } from "react";
import { apiRequest } from "../utils/apiClient";
import { AuthContext } from "../context/AuthContext";
import API from "../config/api";

// import your existing layout components
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Workplaces() {
  const { token } = useContext(AuthContext);
  const [workplaces, setWorkplaces] = useState([]);
  const [mode, setMode] = useState("list");
  const [selectedWorkplace, setSelectedWorkplace] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        {
          name: formData.name.trim(),
          location: formData.location.trim(),
        },
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
        {
          name: formData.name.trim(),
          location: formData.location.trim(),
        },
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
    setFormData({
      name: workplace.name,
      location: workplace.location || "",
    });
    setMode("edit");
  };

  const resetForm = () => {
    setFormData({ name: "", location: "" });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Workplace Management</h2>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-semibold mt-2">{workplaces.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-semibold mt-2">
                {workplaces.filter((w) => w.status === "Active").length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <p className="text-sm text-gray-500">Inactive</p>
              <p className="text-2xl font-semibold mt-2">
                {workplaces.filter((w) => w.status === "Inactive").length}
              </p>
            </div>
          </div>

          {/* Workplace List */}
          {mode === "list" && (
            <div className="bg-white shadow rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Workplace Details</h3>
                <button
                  onClick={() => {
                    resetForm();
                    setMode("add");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Add New Workplace
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-gray-600">
                      <th className="p-3">Workplace Name</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workplaces.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center py-6 text-gray-500"
                        >
                          No workplaces found
                        </td>
                      </tr>
                    ) : (
                      workplaces.map((workplace) => (
                        <tr
                          key={workplace._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3">{workplace.name}</td>
                          <td className="p-3">{workplace.location || "-"}</td>
                          <td className="p-3 flex gap-3">
                            <button
                              onClick={() => startEdit(workplace)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(workplace._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add / Edit Form */}
          {(mode === "add" || mode === "edit") && (
            <div className="bg-white shadow rounded-xl p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">
                {mode === "add" ? "Add Workplace" : "Edit Workplace"}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mode === "add" ? handleAdd() : handleEdit();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {mode === "add" ? "Add" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setSelectedWorkplace(null);
                      setMode("list");
                    }}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
