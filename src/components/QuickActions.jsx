import React from "react";
import { FaUserPlus, FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">Quick Actions</h4>
        <span className="text-sm text-slate-500">Shortcuts</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        
           <Link to="/employees" className="flex items-center gap-2 justify-center py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:opacity-95 transition"><FaUserPlus /> Add Employee</Link>
        
        
           <Link to="/salary-summary" className="flex items-center gap-2 justify-center py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition"><FaFileAlt /> Generate Report</Link>
        
      </div>
    </div>
  );
}
