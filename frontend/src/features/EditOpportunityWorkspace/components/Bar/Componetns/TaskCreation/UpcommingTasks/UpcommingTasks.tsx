// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../../../../app/store"; // update path as needed
// import { removeTask } from "../../../../../slice/EditOpportunityWorkspace"


// const UpcomingTasks: React.FC = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector(
//     (state: RootState) => state.postEditOpportunityWorkspaceForm
//   );
//   const tasks = formData?.opportunity_task || [];

//   return (
//     <div style={{ background: "#ffffff", borderRadius: "12px", padding: "24px", height: "100%", boxSizing: "border-box" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
//         <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#111827", letterSpacing: "-0.2px" }}>
//           Upcoming Tasks
//         </h2>
//         {tasks.length > 0 && (
//           <span style={{
//             background: "#eff6ff", color: "#2563eb",
//             fontSize: "11px", fontWeight: 700,
//             padding: "2px 9px", borderRadius: "20px",
//           }}>
//             {tasks.length}
//           </span>
//         )}
//       </div>
//       <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "10px 0 16px 0" }} />

//       {tasks.length === 0 ? (
//         <div style={{
//           display: "flex", flexDirection: "column", alignItems: "center",
//           justifyContent: "center", padding: "40px 20px", gap: "10px",
//         }}>
//           <div style={{ fontSize: "36px", opacity: 0.3 }}>✅</div>
//           <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af", fontWeight: 500 }}>No tasks yet</p>
//           <p style={{ margin: 0, fontSize: "12px", color: "#d1d5db" }}>Create a task using the form</p>
//         </div>
//       ) : (
//         <div style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//           gap: "12px",
//           overflowY: "auto",
//           maxHeight: "calc(100% - 70px)",
//         }}>
//           {tasks.map((t, i) => (
//             <TaskCards
//               key={i}
//               taskIndex={i}
//               task={t.task}
//               assign_to={t.assign_to}
//               start_date={t.start_date}
//               end_date={t.end_date}
//               status={t.status}
//               onRemove={() => dispatch(removeTask(i))}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpcomingTasks;
// src/features/Editopportunityworkspace/components/Bar/componetns/Taskcreation/UpcommingTasks/UpcommingTasks.tsx

// import React from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../../../../../app/store";
// import Cards from "./Cards";

// const UpcomingTasks: React.FC = () => {
//   const { formData } = useSelector(
//     (state: RootState) => state.postEditOpportunityWorkspaceForm
//   );
//   const tasks = formData?.opportunity_task || [];

//   return (
//     <div style={{ background: "#ffffff", borderRadius: "12px", padding: "24px", height: "100%", boxSizing: "border-box" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
//         <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#111827", letterSpacing: "-0.2px" }}>
//           Upcoming Tasks
//         </h2>
//         {tasks.length > 0 && (
//           <span style={{
//             background: "#eff6ff", color: "#2563eb",
//             fontSize: "11px", fontWeight: 700,
//             padding: "2px 9px", borderRadius: "20px",
//           }}>
//             {tasks.length}
//           </span>
//         )}
//       </div>
//       <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "10px 0 16px 0" }} />

//       {tasks.length === 0 ? (
//         <div style={{
//           display: "flex", flexDirection: "column", alignItems: "center",
//           justifyContent: "center", padding: "40px 20px", gap: "10px",
//         }}>
//           <div style={{ fontSize: "36px", opacity: 0.3 }}>✅</div>
//           <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af", fontWeight: 500 }}>No tasks yet</p>
//           <p style={{ margin: 0, fontSize: "12px", color: "#d1d5db" }}>Create a task using the form</p>
//         </div>
//       ) : (
//         <div style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//           gap: "12px",
//           overflowY: "auto",
//           maxHeight: "calc(100% - 70px)",
//         }}>
//           {tasks.map((t, i) => (
//             <Cards // ✅ correct component name
//               key={i}
//               taskIndex={i}
//               task={t.task}
//               assign_to={t.assign_to}
//               start_date={t.start_date}
//               end_date={t.end_date}
//               status={t.status}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpcomingTasks;

// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../../../../../app/store";
// import Cards from "./Cards";
// import styles from "./UpcommingTasks.module.css";
// import { FaFolderOpen, FaFolder } from "react-icons/fa";

// const UpcomingTasks: React.FC = () => {
//   const { formData } = useSelector(
//     (state: RootState) => state.postEditOpportunityWorkspaceForm
//   );
  
//   // Local state to toggle between Upcoming and Completed (History)
//   const [showHistory, setShowHistory] = useState(false);

//   const allTasks = formData?.opportunity_task || [];

//   // Logic: If showing history, show "Completed". Otherwise, show anything NOT "Completed".
//   const displayTasks = allTasks.filter((t: any) => 
//     showHistory ? t.status === "Completed" : t.status !== "Completed"
//   );

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <h2 className={styles.heading}>
//           {showHistory ? "Task History" : "Upcoming Tasks"}
//         </h2>
        
//         <button 
//           className={`${styles.historyBtn} ${showHistory ? styles.historyBtnActive : ''}`}
//           onClick={() => setShowHistory(!showHistory)}
//         >
//           {showHistory ? <FaFolderOpen className={styles.historyIconActive} /> : <FaFolder className={styles.historyIcon} />}
//           {showHistory ? "View Upcoming" : "History"}
//         </button>
//       </div>

//       <hr className={styles.line} />

//       {displayTasks.length === 0 ? (
//         <div className={styles.emptyState}>
//           <div className={styles.emptyIconWrap}>
//             {/* Greyed out Clipboard/Task icon matching empty state styling */}
//             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
//               <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
//               <path d="M9 14h6"></path>
//               <path d="M9 10h6"></path>
//               <path d="M9 18h6"></path>
//             </svg>
//           </div>
//           <p className={styles.emptyText}>
//             {showHistory ? "No task history" : "No tasks yet"}
//           </p>
//           <p className={styles.emptySubText}>
//             {showHistory ? "Completed tasks will appear here" : "Create a task using the form"}
//           </p>
//         </div>
//       ) : (
//         <div className={styles.tasksGrid}>
//           {displayTasks.map((t: any, i: number) => (
//             <Cards 
//               key={i}
//               taskIndex={allTasks.indexOf(t)} // Use original index for correct deletion/editing
//               task={t.task}
//               assign_to={t.assign_to}
//               start_date={t.start_date}
//               end_date={t.end_date}
//               status={t.status}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpcomingTasks;

// src/features/Editopportunityworkspace/components/Bar/componetns/Taskcreation/UpcommingTasks/UpcommingTasks.tsx

// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../../../../../app/store";
// import Cards from "./Cards";
// import { FaFolderOpen, FaFolder } from "react-icons/fa";

// const UpcomingTasks: React.FC = () => {
//   const { formData } = useSelector(
//     (state: RootState) => state.postEditOpportunityWorkspaceForm
//   );
  
//   // Toggle between Upcoming and History (Completed tasks)
//   const [showHistory, setShowHistory] = useState(false);

//   const allTasks = formData?.opportunity_task || [];

//   const displayTasks = allTasks.filter((t: any) => 
//     showHistory ? t.status === "Completed" : t.status !== "Completed"
//   );

//   return (
//     <div style={{
//       background: "#ffffff",
//       borderRadius: "12px",
//       padding: "24px",
//       height: "100%", // Inherits height matched with the form
//       minHeight: "480px",
//       boxSizing: "border-box",
//       border: "1px solid #e5e7eb",
//       fontFamily: "'DM Sans', system-ui, sans-serif",
//       display: "flex",
//       flexDirection: "column",
//     }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
//         <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: "10px" }}>
//           {showHistory ? "Task History" : "Upcoming Tasks"}
//           {!showHistory && displayTasks.length > 0 && (
//             <span style={{
//               background: "#eff6ff", color: "#2563eb",
//               fontSize: "12px", fontWeight: 700,
//               padding: "2px 10px", borderRadius: "20px",
//             }}>
//               {displayTasks.length}
//             </span>
//           )}
//         </h2>
        
//         <button 
//           onClick={() => setShowHistory(!showHistory)}
//           style={{
//             display: "flex", alignItems: "center", gap: "6px",
//             backgroundColor: showHistory ? "#fef2f2" : "#ffffff",
//             border: showHistory ? "1px solid #fecaca" : "1px solid #e5e7eb",
//             color: showHistory ? "#b91c1c" : "#374151",
//             padding: "6px 14px", borderRadius: "20px",
//             fontSize: "12px", fontWeight: 700, cursor: "pointer",
//             transition: "all 0.2s ease",
//             boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
//           }}
//           onMouseEnter={(e) => {
//             if (!showHistory) e.currentTarget.style.backgroundColor = "#f3f4f6";
//           }}
//           onMouseLeave={(e) => {
//             if (!showHistory) e.currentTarget.style.backgroundColor = "#ffffff";
//           }}
//         >
//           {showHistory ? (
//             <FaFolderOpen style={{ color: "#ef4444", fontSize: "14px" }} />
//           ) : (
//             <FaFolder style={{ color: "#d97706", fontSize: "14px" }} />
//           )}
//           {showHistory ? "View Upcoming" : "History"}
//         </button>
//       </div>

//       <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "10px 0 20px 0" }} />

//       {displayTasks.length === 0 ? (
//         <div style={{
//           flex: 1, display: "flex", flexDirection: "column",
//           alignItems: "center", justifyContent: "center", gap: "8px", padding: "20px",
//         }}>
//           <div style={{
//             width: "64px", height: "64px", backgroundColor: "#f3f4f6",
//             borderRadius: "12px", display: "flex", alignItems: "center",
//             justifyContent: "center", marginBottom: "8px",
//           }}>
//             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
//               <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
//               <path d="M9 14h6"></path><path d="M9 10h6"></path><path d="M9 18h6"></path>
//             </svg>
//           </div>
//           <p style={{ margin: 0, fontSize: "13px", color: "#6b7280", fontWeight: 600 }}>
//             {showHistory ? "No completed tasks yet" : "No tasks yet"}
//           </p>
//           <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
//             {showHistory ? "Completed tasks will appear here" : "Create a task using the form"}
//           </p>
//         </div>
//       ) : (
//         <div style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
//           gap: "16px",
//           overflowY: "auto",
//           alignContent: "start",
//           paddingRight: "4px",
//           maxHeight: "calc(100vh - 350px)",
//         }}>
//           {displayTasks.map((t: any, i: number) => (
//             <Cards 
//               key={i}
//               taskIndex={allTasks.indexOf(t)} 
//               task={t.task}
//               assign_to={t.assign_to}
//               start_date={t.start_date}
//               end_date={t.end_date}
//               status={t.status}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpcomingTasks;





// src/features/Editopportunityworkspace/components/Bar/componetns/Taskcreation/UpcommingTasks/UpcomingTasks.tsx

import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../../../app/store";
import Cards from "./Cards";
import { CheckSquare } from "lucide-react";
import { FaFolderOpen, FaFolder } from "react-icons/fa";

// ─── Component ────────────────────────────────────────────────────────────────

const UpcomingTasks: React.FC = () => {
  const { formData } = useSelector(
    (state: RootState) => state.postEditOpportunityWorkspaceForm
  );

  // Toggle between Upcoming and History (Completed tasks)
  const [showHistory, setShowHistory] = useState(false);

  const allTasks = formData?.opportunity_task || [];

  const displayTasks = allTasks.filter((t: any) =>
    showHistory ? t.status === "Completed" : t.status !== "Completed"
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-2xl border-2 border-blue-100 shadow-lg overflow-hidden h-full min-h-[480px] flex flex-col">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <CheckSquare size={15} color="white" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">
            {showHistory ? "Task History" : "Upcoming Tasks"}
          </h2>
          {!showHistory && displayTasks.length > 0 && (
            <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/30">
              {displayTasks.length}
            </span>
          )}
        </div>

        {/* History Toggle Button */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
            showHistory
              ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              : "bg-white/20 border-white/30 text-white hover:bg-white/30"
          }`}
        >
          {showHistory ? (
            <FaFolderOpen size={12} className={showHistory ? "text-red-500" : "text-white"} />
          ) : (
            <FaFolder size={12} className="text-amber-300" />
          )}
          {showHistory ? "View Upcoming" : "History"}
        </button>
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4 flex-1 flex flex-col overflow-hidden">

        {/* Empty State */}
        {displayTasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-10">
            <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mb-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <path d="M9 14h6"></path><path d="M9 10h6"></path><path d="M9 18h6"></path>
              </svg>
            </div>
            <p className="text-sm text-slate-500 font-semibold m-0">
              {showHistory ? "No completed tasks yet" : "No tasks yet"}
            </p>
            <p className="text-xs text-slate-400 m-0">
              {showHistory ? "Completed tasks will appear here" : "Create a task using the form"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-track]:bg-transparent" style={{ maxHeight: "calc(100vh - 350px)", alignContent: "start" }}>
            {displayTasks.map((t: any, i: number) => (
              <Cards
                key={i}
                taskIndex={allTasks.indexOf(t)}
                task={t.task}
                assign_to={t.assign_to}
                start_date={t.start_date}
                end_date={t.end_date}
                status={t.status}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default UpcomingTasks;