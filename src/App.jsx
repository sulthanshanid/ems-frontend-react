import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Deductions from "./pages/Deductions";
import Loans from "./pages/Loans";
import Profile from "./pages/Profile";
import Workplaces from "./pages/Workplaces";
import Attendance from "./pages/Attendance";
import AttendanceSummary from "./pages/AttendanceSummary";
import SalarySummary from "./pages/SalarySummary";
import StatsDaily from "./pages/StatsDaily";

import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./components/ProtectedLayout"; // import the layout

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes without Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/forgot-password" element={<div>forgot paswordpage </div>} />
          {/* Protected routes with Navbar */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="employees" element={<Employees />} />
                    <Route path="employees/add" element={<Employees />} />
                    <Route path="employees/:id" element={<Employees />} />
                    <Route path="employees/:id/edit" element={<Employees />} />

                    <Route path="deductions" element={<Deductions />} />
                    <Route path="deductions/add" element={<Deductions />} />
                    <Route path="deductions/:id" element={<Deductions />} />
                    <Route
                      path="deductions/:id/edit"
                      element={<Deductions />}
                    />

                    <Route path="loans" element={<Loans />} />
                    <Route path="loans/add" element={<Loans />} />
                    <Route path="loans/:id" element={<Loans />} />
                    <Route path="loans/:id/edit" element={<Loans />} />

                    <Route path="profile" element={<Profile />} />

                    <Route path="workplaces" element={<Workplaces />} />
                    <Route path="workplaces/add" element={<Workplaces />} />
                    <Route path="workplaces/:id" element={<Workplaces />} />
                    <Route
                      path="workplaces/:id/edit"
                      element={<Workplaces />}
                    />

                    <Route path="attendance" element={<Attendance />} />
                    <Route
                      path="attendance-summary"
                      element={<AttendanceSummary />}
                    />
                    <Route path="salary-summary" element={<SalarySummary />} />
                    <Route path="stats-daily" element={<StatsDaily />} />
                  </Routes>
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
