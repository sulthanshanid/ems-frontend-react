// src/pages/Profile.jsx
import React, { useState, useEffect, useContext } from "react";
import { apiRequest } from "../utils/apiClient";
import { AuthContext } from "../context/AuthContext";
import API from "../config/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

export default function Profile() {
  const { token } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
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
      const res = await apiRequest(API.PROFILE, "PUT", profile, token);
      setProfile(res);
      alert("Profile saved successfully.");
    } catch (err) {
      setError("Failed to save profile.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Summary Card */}
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {profile.name || "-"}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {profile.email || "-"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {profile.phone || "-"}
                </p>
              </div>
            </div>

            {/* Edit Form */}
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Edit Profile
              </h2>
              {loading ? (
                <p className="text-gray-500">Loading profile...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-medium mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
