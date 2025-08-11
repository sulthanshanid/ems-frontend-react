// src/components/Navbar.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <h3 style={styles.logo}>My App</h3>
      <div style={styles.navLinks}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <span style={styles.userName}>Hello, {user?.name || "User"}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "#fff",
  },
  logo: { margin: 0 },
  navLinks: { display: "flex", alignItems: "center", gap: "15px" },
  userName: { fontWeight: "bold" },
  logoutBtn: {
    background: "#ff4d4d",
    border: "none",
    color: "#fff",
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default Navbar;
