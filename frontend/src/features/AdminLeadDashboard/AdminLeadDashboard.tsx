// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {type RootState,type AppDispatch } from "../../app/store";

// import styles from "./AdminLeadDashboard.module.css";

// import { Route, Routes, useNavigate } from "react-router-dom";
// import { AiOutlinePlusCircle } from "react-icons/ai";
// import LeadStatus from "./LeadStatus/LeadStatus";

// // Interfaces for Various Details


// // Main Component
// const AdminLeadDashboard: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { user } = useSelector((state: RootState) => state.userLoginAuth);

//   const handlelistButtonClick = () => {
//     if (user.role === "admin") {
//       navigate('/AdminLeadWorkspaceList');
//     } else if (user.role === "lead") {
//       navigate('/user/AdminLeadWorkspaceList');
//     } else {
//       console.warn("Unauthorized access");
//     }
//   };


//   const handleButtonClick = () => {
//     if (user.role === "admin") {
//       navigate('/LeadWorkspace');
//     } else if (user.role === "lead") {
//       navigate('/user/LeadWorkspace');
//     } else {
//       console.warn("Unauthorized access");
//     }
//   };

//   return (

//     <div className={styles.mainContent}>
//       <div className={styles.head}>

//         <div className={styles.leftSection}>
//           <p className={styles.subhead}>Lead Dashboard</p>
//           {/* <p className={styles.subtext}>Monitor and edit all your data</p> */}
//         </div>
//         <div className={styles.rightSection}>
//           <button className={styles.createTaskButton} onClick={handleButtonClick}>Create Lead +</button>

//           <button className={styles.tasklist} onClick={handlelistButtonClick}> Lead List {'>>'}</button>
//         </div>
//       </div>
//       <div className={styles.content}>
//       <LeadStatus />
//       </div>
     
//     </div>

//   );
// };

// export default AdminLeadDashboard;




import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { ClipboardList, Layers } from "lucide-react";
import LeadStatus from "./LeadStatus/LeadStatus";

// ─── Component ────────────────────────────────────────────────────────────────

const AdminLeadDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.userLoginAuth);

  const handlelistButtonClick = () => {
    if (user.role === "admin") { navigate('/AdminLeadWorkspaceList'); }
    else if (user.role === "lead") { navigate('/user/AdminLeadWorkspaceList'); }
    else { console.warn("Unauthorized access"); }
  };

  const handleButtonClick = () => {
    if (user.role === "admin") { navigate('/LeadWorkspace'); }
    else if (user.role === "lead") { navigate('/user/LeadWorkspace'); }
    else { console.warn("Unauthorized access"); }
  };

  // Date info for header
  const today = new Date();
  const dateNumber = today.getDate();
  const day = today.toLocaleDateString('en-US', { weekday: 'long' });
  const month = today.toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-4">

          {/* Date + Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-500 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-violet-200 shrink-0">
              <span className="text-xl font-extrabold text-white leading-none">{dateNumber}</span>
              <span className="text-[10px] font-semibold text-violet-200 uppercase tracking-wider leading-none mt-0.5">{month.slice(0,3)}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600 m-0 leading-tight">Lead Dashboard</p>
              <p className="text-sm text-slate-400 m-0 mt-0.5">{day}, {month}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleButtonClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-300 transition-all duration-200 border-none cursor-pointer"
            >
              <AiOutlinePlusCircle size={16} />
              Create Lead
            </button>

            <button
              onClick={handlelistButtonClick}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 text-sm font-bold rounded-xl border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all duration-200 cursor-pointer shadow-sm"
            >
              <ClipboardList size={15} />
              Lead List
            </button>
          </div>
        </div>

        {/* ── Lead Status Kanban ── */}
        <div className="w-full">
          <LeadStatus />
        </div>

      </div>
    </div>
  );
};

export default AdminLeadDashboard;
