import React from "react";
import Navbar from "./Navbar";

function ProtectedLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default ProtectedLayout;
