import React from "react";
import Navbar from "./Navbar";

function ProtectedLayout({ children }) {
  return (
    <>
      
      <main>{children}</main>
    </>
  );
}

export default ProtectedLayout;
