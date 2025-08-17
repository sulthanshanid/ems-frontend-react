import React, { useState, useEffect, useContext } from "react";
import { apiRequest } from "../utils/apiClient";
import { AuthContext } from "../context/AuthContext";
import API from "../config/api";

// Layout Components
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Attendance() {
  const { token } = useContext(AuthContext);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [employees, setEmployees] = useState([]);
  const [workplaces, setWorkplaces] = useState([]);
  const [attendanceRows, setAttendanceRows] = useState([]);

  const [employeesLoaded, setEmployeesLoaded] = useState(false);
  const [workplacesLoaded, setWorkplacesLoaded] = useState(false);

  useEffect(() => {
    if (!token) return;
    const loadData = async () => {
      await fetchEmployees();
      await fetchWorkplaces();
      setEmployeesLoaded(true);
      setWorkplacesLoaded(true);
    };
    loadData();
  }, [token]);

  useEffect(() => {
    if (!token || !date || !employeesLoaded) return;
    fetchAttendance(date);
  }, [token, date, employeesLoaded]);

  const fetchEmployees = async () => {
    try {
      const res = await apiRequest(API.EMPLOYEES, "GET", null, token);
      setEmployees(res);
    } catch (e) {
      console.error("Failed to fetch employees", e);
    }
  };

  const fetchWorkplaces = async () => {
    try {
      const res = await apiRequest(API.WORKPLACES, "GET", null, token);
      setWorkplaces(res);
    } catch (e) {
      console.error("Failed to fetch workplaces", e);
    }
  };

  const fetchAttendance = async (attendanceDate) => {
    try {
      const res = await apiRequest(
        `${API.ATTENDANCE}?date=${attendanceDate}`,
        "GET",
        null,
        token
      );
      if (res.length === 0) {
        setAttendanceRows(
          employees.map((emp) => ({
            id: null,
            employee_id: emp._id,
            workplace_id: "",
            status: "present",
            wage: "",
            date: attendanceDate,
          }))
        );
      } else {
        const presentEmpIds = new Set(res.map((r) => r.employee_id));
        const missingEmployees = employees.filter(
          (e) => !presentEmpIds.has(e._id)
        );
        const missingRows = missingEmployees.map((emp) => ({
          id: null,
          employee_id: emp._id,
          workplace_id: "",
          status: "present",
          wage: "",
          date: attendanceDate,
        }));
        setAttendanceRows([...res, ...missingRows]);
      }
    } catch (e) {
      console.error("Failed to fetch attendance", e);
    }
  };

  const onRowChange = (index, field, value) => {
    setAttendanceRows((rows) => {
      const newRows = [...rows];
      newRows[index] = { ...newRows[index], [field]: value };
      return newRows;
    });
  };

  const duplicateRow = (index) => {
    const rowToCopy = attendanceRows[index];
    const newRow = { ...rowToCopy, id: null };
    setAttendanceRows((rows) => {
      const newRows = [...rows];
      newRows.splice(index + 1, 0, newRow);
      return newRows;
    });
  };

  const deleteRow = (index) => {
    setAttendanceRows((rows) => {
      const newRows = [...rows];
      newRows.splice(index, 1);
      return newRows;
    });
  };

  const saveAttendance = async () => {
    const seen = new Set();
    for (const row of attendanceRows) {
      if (!row.workplace_id) {
        alert("All rows must have a workplace selected.");
        return;
      }
      if (row.wage === "" || isNaN(Number(row.wage))) {
        alert("All rows must have a valid wage.");
        return;
      }
      const key = `${row.employee_id}_${row.date}_${row.workplace_id}`;
      if (seen.has(key)) {
        alert("Duplicate entry found.");
        return;
      }
      seen.add(key);
    }

    try {
      await apiRequest(API.ATTENDANCE, "POST", attendanceRows, token);
      alert("Attendance saved successfully!");
      fetchAttendance(date);
    } catch (e) {
      console.error("Failed to save attendance", e);
      alert("Failed to save attendance.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto backdrop-blur-xl bg-white/70 shadow-2xl rounded-2xl p-6 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              📅 Attendance
            </h2>

            {/* Date Picker */}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-gray-700 font-medium">Select Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto rounded-xl shadow-md">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Workplace</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Wage</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-gray-800 divide-y divide-gray-200">
                  {attendanceRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-4 text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    attendanceRows.map((row, i) => {
                      const emp = employees.find(
                        (e) => e._id === row.employee_id
                      );
                      return (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium">
                            {emp ? emp.name : "Unknown"}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={row.workplace_id}
                              onChange={(e) =>
                                onRowChange(i, "workplace_id", e.target.value)
                              }
                              className="px-3 py-2 rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-indigo-400 outline-none"
                            >
                              <option value="">Select Workplace</option>
                              {workplaces.map((wp) => (
                                <option key={wp._id} value={wp._id}>
                                  {wp.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={row.status}
                              onChange={(e) =>
                                onRowChange(i, "status", e.target.value)
                              }
                              className="px-3 py-2 rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-indigo-400 outline-none"
                            >
                              <option value="present">Present</option>
                              <option value="absent">Absent</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={row.wage}
                              onChange={(e) =>
                                onRowChange(i, "wage", e.target.value)
                              }
                              className="px-3 py-2 rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-indigo-400 outline-none"
                            />
                          </td>
                          <td className="px-4 py-3 flex gap-2">
                            <button
                              onClick={() => duplicateRow(i)}
                              className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white transition"
                            >
                              +
                            </button>
                            <button
                              onClick={() => deleteRow(i)}
                              disabled={
                                attendanceRows.length <= employees.length
                              }
                              className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-40"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Save Button */}
            <div className="mt-6 text-right">
              <button
                onClick={saveAttendance}
                disabled={attendanceRows.length === 0}
                className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-lg transition disabled:opacity-40"
              >
                💾 Save Attendance
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
