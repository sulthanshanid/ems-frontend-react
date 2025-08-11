// src/pages/Dashboard.jsx
import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const menuItems = [
    { name: "Employees", path: "/employees" },
    { name: "View Deduction", path: "/deductions" },
     { name: "View Loan", path: "/loans" },
    { name: "Profile", path: "/profile" },
    { name: "Workplaces", path: "/workplaces" },

    { name: "Attendance", path: "/attendance" },
 
    { name: "Attendance Summary", path: "/attendance-summary" },
    { name: "Salary Summary", path: "/salary-summary" },
  
   
    
    { name: "Daily Stats", path: "/stats-daily" },
    { name: "Super Admin", path: "/super-admin" },


  ];

  return (
    <div>
      
      <div style={styles.container}>
        <h1>Dashboard</h1>
        <div style={styles.grid}>
          {menuItems.map((item, index) => (
            <Link key={index} to={item.path} style={styles.card}>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },
  card: {
    backgroundColor: "#f4f4f4",
    padding: "15px",
    textAlign: "center",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#333",
    fontWeight: "bold",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    transition: "background 0.2s ease",
  },
};

export default Dashboard;
