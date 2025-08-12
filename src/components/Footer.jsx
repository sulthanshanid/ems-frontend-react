import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#1e3a8a] text-white py-2 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-start gap-2">
        <div>
          <h3 className="font-semibold text-sm">EMS</h3>
          <p className="text-[11px] text-indigo-100">
            Manage employees, payroll and attendance effortlessly.
          </p>
        </div>

        <div className="flex gap-4">
          <div>
            <h4 className="font-semibold text-xs">Company</h4>
            <ul className="mt-1 space-y-0.5">
              <li>About</li>
              <li>Careers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-xs">Support</h4>
            <ul className="mt-1 space-y-0.5">
              <li>Help center</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-indigo-700 mt-2 pt-1 text-[10px] text-indigo-200 text-center">
        © {new Date().getFullYear()} EMS. All rights reserved.
      </div>
    </footer>
  );
}
