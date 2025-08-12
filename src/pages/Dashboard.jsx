import React from "react";
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
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Dashboard</h1>
      <div style={styles.grid}>
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            style={styles.card}
            className="dashboard-card"
          >
            {item.name}
          </Link>
        ))}
      </div>
      <style>{`
        .dashboard-card:hover {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white !important;
          box-shadow: 0 8px 20px rgba(118, 75, 162, 0.4);
          transform: translateY(-6px);
        }
        .dashboard-card:active {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(118, 75, 162, 0.3);
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: 960,
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: "2.8rem",
    fontWeight: "900",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: "1.5px",
    textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "25px",
  },
  card: {
    backgroundColor: "#f7f9fc",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    textDecoration: "none",
    color: "#34495e",
    fontWeight: "700",
    fontSize: "1.15rem",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.07)",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    userSelect: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 110,
    letterSpacing: "0.04em",
  },
};

export default Dashboard;
