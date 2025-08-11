import React, { useState, useEffect, useContext } from "react";
import { apiRequest } from "../utils/apiClient";
import { AuthContext } from "../context/AuthContext";
import API from "../config/api";
import Navbar from "../components/Navbar";

export default function Attendance() {
  const { token } = useContext(AuthContext);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [employees, setEmployees] = useState([]);
  const [workplaces, setWorkplaces] = useState([]);
  const [attendanceRows, setAttendanceRows] = useState([]);

  const [employeesLoaded, setEmployeesLoaded] = useState(false);
  const [workplacesLoaded, setWorkplacesLoaded] = useState(false);

  // Fetch employees and workplaces on load
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

  // Fetch attendance records for the selected date only after employees loaded
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
        // no attendance yet for date: initialize one row per employee with defaults
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
        // load existing attendance and keep employees not yet recorded with empty rows
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
      // fallback: init blank rows
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
    }
  };

  // Handle field changes in attendance rows
  const onRowChange = (index, field, value) => {
    setAttendanceRows((rows) => {
      const newRows = [...rows];
      newRows[index] = { ...newRows[index], [field]: value };
      return newRows;
    });
  };

  // Add duplicate row for same employee
  const duplicateRow = (index) => {
    const rowToCopy = attendanceRows[index];
    const newRow = { ...rowToCopy, id: null };
    setAttendanceRows((rows) => {
      const newRows = [...rows];
      newRows.splice(index + 1, 0, newRow);
      return newRows;
    });
  };

  // Delete a row (if it has id, will be removed on save if missing from client data)
  const deleteRow = (index) => {
    setAttendanceRows((rows) => {
      const newRows = [...rows];
      newRows.splice(index, 1);
      return newRows;
    });
  };

  // Save all attendance rows for selected date
  const saveAttendance = async () => {
    // Validation: no empty workplace, wage must be number, no duplicate emp+date+workplace in rows
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
        alert(
          "Duplicate employee/workplace entry found. Each employee can have only one record per workplace and date."
        );
        return;
      }
      seen.add(key);
    }

    try {
      await apiRequest(API.ATTENDANCE, "POST", attendanceRows, token);
      alert("Attendance saved successfully!");
      // Refetch to sync with backend
      fetchAttendance(date);
    } catch (e) {
      console.error("Failed to save attendance", e);
      alert("Failed to save attendance.");
    }
  };

  return (
    <>
      
      <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
        <h2>Attendance</h2>

        <div style={{ marginBottom: 20 }}>
          <label>
            Select Date:{" "}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>

        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th>Employee</th>
              <th>Workplace</th>
              <th>Status</th>
              <th>Wage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRows.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : (
              attendanceRows.map((row, i) => {
                const emp = employees.find((e) => e._id === row.employee_id);
                return (
                  <tr key={i}>
                    <td>{emp ? emp.name : "Unknown"}</td>
                    <td>
                      <select
                        value={row.workplace_id}
                        onChange={(e) =>
                          onRowChange(i, "workplace_id", e.target.value)
                        }
                      >
                        <option value="">Select Workplace</option>
                        {workplaces.map((wp) => (
                          <option key={wp._id} value={wp._id}>
                            {wp.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={row.status}
                        onChange={(e) =>
                          onRowChange(i, "status", e.target.value)
                        }
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.wage}
                        onChange={(e) => onRowChange(i, "wage", e.target.value)}
                      />
                    </td>
                    <td>
                      <button onClick={() => duplicateRow(i)}>+</button>{" "}
                      <button
                        onClick={() => deleteRow(i)}
                        disabled={attendanceRows.length <= employees.length}
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div style={{ marginTop: 20 }}>
          <button
            onClick={saveAttendance}
            disabled={attendanceRows.length === 0}
          >
            Save Attendance
          </button>
        </div>
      </div>
    </>
  );
}
