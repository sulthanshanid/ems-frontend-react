import React, { useEffect, useState, useContext } from "react";

export default function Toast({ message, onClose, duration = 3000 }) {

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 bg-red-600 text-white px-4 py-2 rounded shadow-lg animate-slideIn">
      {message}
    </div>
  );
}
