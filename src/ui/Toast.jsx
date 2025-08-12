import React, { useEffect } from "react";

export default function Toast({
  message,
  type = "error",
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  // Color classes based on type
  const typeClasses = {
    error: "bg-red-600 text-white",
    success: "bg-green-600 text-white",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-600 text-white",
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg animate-slideIn ${
        typeClasses[type] || typeClasses.error
      }`}
    >
      {message}
    </div>
  );
}
