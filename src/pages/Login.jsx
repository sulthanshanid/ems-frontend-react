
import React, { useEffect,useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../config/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "../ui/Toast";
import InputField from "../ui/InputField";
import LoadingButton from "../ui/LoadingButton";  
import { Link } from "react-router-dom";

  
export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const [showToast, setShowToast] = useState(false);
const [loading, setLoading] = useState(false);
useEffect(() => {
  if (showToast) {
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }
}, [showToast]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  setError("");
    try {
      const res = await axios.post(API.LOGIN, { email, password });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
        console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    setShowToast(true);
    }
    finally {
      setLoading(false);
    }
  };
  return (
    <>
    <div className="flex flex-col min-h-screen">
      {showToast && (<Toast message={error} onClose={() => setError("")} />

  
)}

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center bg-white">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-2">Login to WorkWise</h2>
          <p className="text-center text-gray-600 mb-6">
            Enter your credentials to access your account.
          </p>
           
          <form className="space-y-4" onSubmit={handleSubmit}>
             <InputField
              id="username"
              label="Username"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            >
              <Link
            
            to="/forgot-password"
            
            className="text-sm text-[#3075b5] hover:underline"
          >
             Forgot your password?
          </Link>
              
            </InputField>

            <LoadingButton
              type="submit"
              className="w-full bg-[#3075b5] text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
              loading={loading}
            >
              Login
            </LoadingButton>
          </form>

          <p className="text-center mt-6 text-gray-700">
            Don't have an account?{" "}
            <a href="#" className="text-[#3075b5] hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#3075b5] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between">
          <div className="mb-6 md:mb-0 md:flex-1">
            <p className="mb-4 max-w-xs">
              Sign in to your WorkWise account to manage your employees efficiently.
            </p>
            <div className="flex space-x-4 text-xl">
              {/* LinkedIn icon */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-gray-300"
                dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path d="M4.98 3.5C4.98 4.88071 3.88071 6 2.5 6C1.11929 6 0 4.88071 0 3.5C0 2.11929 1.11929 1 2.5 1C3.88071 1 4.98 2.11929 4.98 3.5ZM0 24V7.98H5V24H0ZM7.5 7.98H12V10.1C12.804 9.01062 14.492 7.95299 17.082 7.95299C22.123 7.95299 23.999 11.296 23.999 16.956V24H19V17.81C19 14.66 18.15 12.74 15.13 12.74C12.898 12.74 12.2 14.36 12.2 17.05V24H7.5V7.98Z"/></svg>` }}
              />
              {/* Twitter icon */}
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-gray-300"
                dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path d="M23.954 4.569c-.885.392-1.83.656-2.825.775a4.93 4.93 0 002.163-2.724c-.95.564-2.005.974-3.127 1.195a4.916 4.916 0 00-8.38 4.482c-4.083-.205-7.7-2.157-10.12-5.134a4.822 4.822 0 00-.665 2.475c0 1.708.869 3.213 2.188 4.096a4.904 4.904 0 01-2.229-.616c-.054 1.981 1.37 3.84 3.415 4.258a4.996 4.996 0 01-2.224.084c.63 1.953 2.445 3.377 4.604 3.418a9.866 9.866 0 01-6.102 2.105c-.396 0-.79-.023-1.175-.069a13.945 13.945 0 007.557 2.209c9.054 0 14-7.5 14-14v-.64a9.936 9.936 0 002.457-2.548l-.047-.02z"/></svg>` }}
              />
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
    <style>{`@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-slideIn {
  animation: slideIn 0.3s ease forwards;
}
`}</style>
    </>
  );
}



 