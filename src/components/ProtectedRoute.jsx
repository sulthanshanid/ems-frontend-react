// src/components/ProtectedRoute.jsx
import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import API from "../config/api";

const ProtectedRoute = ({ children }) => {
  const { token, logout } = useContext(AuthContext);
  const [validating, setValidating] = React.useState(true);
  const [isValid, setIsValid] = React.useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        setValidating(false);
        return;
      }
      try {
        await axios.get(API.VALIDATE_TOKEN, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsValid(true);
      } catch {
        logout();
        setIsValid(false);
      }
      setValidating(false);
    };
    validateToken();
  }, [token, logout]);

  if (validating) return <p>Checking authentication...</p>;

  return isValid ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
