import React, { useState, useEffect, useContext } from "react";
import { apiRequest } from "../utils/apiClient";
import { AuthContext } from "../context/AuthContext";
import API from "../config/api";
import Navbar from "../components/Navbar"; // Assuming you have a Navbar component
export default function Profile() {
  const { token } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    name: "",
    email: "",  // add other fields if needed
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    apiRequest(API.PROFILE, "GET", null, token)
      .then((res) => {
        // assuming res.data has user profile object
        setProfile({
          name: res.name || "",
          email: res.email || "",
          phone: res.phone || "",
        });
        setError(null);
      })
      .catch((err) => {
        setError("Failed to load profile.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await apiRequest(
        API.PROFILE,
        "PUT", // or "PATCH" depending on your API
        profile,
        token
      );
      setProfile(res); // update with latest from server
      alert("Profile saved successfully.");
    } catch (err) {
      setError("Failed to save profile.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <>
    
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>My Profile</h2>
      <form onSubmit={handleSave}>
        <div style={{ marginBottom: 10 }}>
          <label>
            Name:{" "}
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            Email:{" "}
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            Phone:{" "}
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
    </>
  );
}
