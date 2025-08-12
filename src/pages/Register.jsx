import React, { useState, useEffect } from "react";
import API from "../config/api";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../ui/Toast";
import InputField from "../ui/InputField";
import LoadingButton from "../ui/LoadingButton";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(API.SIGNUP, formData);
      setSuccess("Signup successful! You can now log in.");
      setShowToast(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {showToast && (
        <Toast
          message={error || success}
          type={error ? "error" : "success"}
          onClose={() => setError("")}
        />
      )}

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center bg-white">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-2">
            Create Your WorkWise Account
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Fill in your details to sign up.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              id="name"
              label="Full Name"
              placeholder="Enter your full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <LoadingButton
              type="submit"
              className="w-full bg-[#3075b5] text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
              loading={loading}
            >
              Sign Up
            </LoadingButton>
          </form>

          <p className="text-center mt-6 text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="text-[#3075b5] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#3075b5] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between">
          <div className="mb-6 md:mb-0 md:flex-1">
            <p className="mb-4 max-w-xs">
              Join WorkWise and manage your workforce with ease.
            </p>
            <div className="flex space-x-4 text-xl">
              <a href="#" aria-label="LinkedIn" className="hover:text-gray-300">
                {/* LinkedIn Icon */}
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-gray-300">
                {/* Twitter Icon */}
              </a>
            </div>
          </div>

          <div className="flex space-x-16 md:space-x-24">
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-1 text-blue-200">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-1 text-blue-200">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="border-t border-blue-500 my-6 max-w-7xl mx-auto" />
        <p className="text-sm text-blue-200 max-w-7xl mx-auto">
          © 2024 WorkWise. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
