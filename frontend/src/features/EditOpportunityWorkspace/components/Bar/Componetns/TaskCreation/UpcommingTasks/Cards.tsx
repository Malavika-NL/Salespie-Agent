// // src/features/Editopportunityworkspace/components/Bar/componetns/Taskcreation/UpcomingTasks/Card.tsx

// import React, { useState } from "react";
// import { FaRegEdit } from "react-icons/fa";
// import { useDispatch } from "react-redux";
// import { removeTask } from "../../../../../slice/EditOpportunityWorkspace";
// import EditTaskCard from "./EditTaskCard/EditTaskCard";

// const fmt = (d: string) => {
//   if (!d) return "—";
//   const [y, m, day] = d.split("-");
//   const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//   return `${day} ${months[parseInt(m) - 1]} ${y}`;
// };

// const statusStyle = (status: string): { bg: string; text: string; dot: string } => {
//   const map: Record<string, { bg: string; text: string; dot: string }> = {
//     "Pending":     { bg: "#fef9c3", text: "#854d0e", dot: "#eab308" },
//     "In Progress": { bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
//     "Completed":   { bg: "#f0fdf4", text: "#15803d", dot: "#22c55e" },
//   };
//   return map[status] ?? { bg: "#f3f4f6", text: "#374151", dot: "#9ca3af" };
// };

// interface CardsProps {
//   taskIndex: number;
//   task: string;
//   assign_to: string;
//   start_date: string;
//   end_date: string;
//   status: string;
// }

// const Cards: React.FC<CardsProps> = ({
//   taskIndex, task, assign_to, start_date, end_date, status,
// }) => {
//   const dispatch = useDispatch();
//   const [showEditCard, setShowEditCard] = useState(false);
//   const { bg, text, dot } = statusStyle(status);

//   const handleDelete = () => {
//     if (window.confirm("Are you sure you want to delete this task?")) {
//       dispatch(removeTask(taskIndex));
//     }
//   };

//   return (
//     <div style={{
//       background: "#fff",
//       border: "1px solid #e5e7eb",
//       borderRadius: "10px",
//       padding: "14px 16px",
//       display: "flex",
//       flexDirection: "column",
//       gap: "8px",
//       boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//       position: "relative",
//     }}>
//       {/* Title row + Edit icon */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//         <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#111827", lineHeight: 1.4 }}>
//           {task}
//         </p>
//         <FaRegEdit
//           onClick={() => setShowEditCard(true)}
//           style={{ color: "#9ca3af", fontSize: "14px", cursor: "pointer", flexShrink: 0, marginLeft: "8px" }}
//           onMouseEnter={e => (e.currentTarget.style.color = "#6b7280")}
//           onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
//         />
//       </div>

//       {/* Status badge */}
//       <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//         <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot, flexShrink: 0 }} />
//         <span style={{
//           background: bg, color: text,
//           fontSize: "11px", fontWeight: 600,
//           padding: "2px 9px", borderRadius: "20px",
//         }}>
//           {status || "—"}
//         </span>
//       </div>

//       {/* Assignee */}
//       <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "12px", color: "#6b7280" }}>
//         <span>👤</span>
//         <span>{assign_to || "Unassigned"}</span>
//       </div>

//       {/* Date range */}
//       <div style={{
//         display: "flex", gap: "6px", alignItems: "center",
//         fontSize: "12px", color: "#374151",
//         borderTop: "1px solid #f3f4f6", paddingTop: "8px",
//       }}>
//         <span>📅</span>
//         <span>{fmt(start_date)}</span>
//         <span style={{ color: "#9ca3af" }}>→</span>
//         <span>{fmt(end_date)}</span>
//       </div>

//       {/* Delete button */}
//       <button
//         onClick={handleDelete}
//         style={{
//           marginTop: "4px",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           gap: "5px", width: "100%", padding: "7px 0",
//           background: "#fff1f2", border: "1px solid #fecdd3",
//           borderRadius: "7px", color: "#e11d48",
//           fontSize: "12px", fontWeight: 600, cursor: "pointer",
//           transition: "background 0.15s, border-color 0.15s",
//         }}
//         onMouseEnter={e => {
//           e.currentTarget.style.background = "#ffe4e6";
//           e.currentTarget.style.borderColor = "#fda4af";
//         }}
//         onMouseLeave={e => {
//           e.currentTarget.style.background = "#fff1f2";
//           e.currentTarget.style.borderColor = "#fecdd3";
//         }}
//       >
//         🗑️ Delete Task
//       </button>

//       {showEditCard && (
//         <EditTaskCard
//           taskIndex={taskIndex}
//           task={task}
//           assign_to={assign_to}
//           start_date={start_date}
//           end_date={end_date}
//           status={status}
//           close={() => setShowEditCard(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Cards;



// src/features/Editopportunityworkspace/components/Bar/componetns/Taskcreation/UpcomingTasks/Card.tsx

import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { removeTask } from "../../../../../slice/EditOpportunityWorkspace";
import EditTaskCard from "./EditTaskCard/EditTaskCard";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${day} ${months[parseInt(m) - 1]} ${y}`;
};

const statusConfig = (status: string): { badge: string; dot: string } => {
  const map: Record<string, { badge: string; dot: string }> = {
    "Pending":     { badge: "bg-yellow-50 text-yellow-800 border border-yellow-200",  dot: "bg-yellow-400" },
    "In Progress": { badge: "bg-blue-50 text-blue-700 border border-blue-200",        dot: "bg-blue-500"   },
    "Completed":   { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  };
  return map[status] ?? { badge: "bg-slate-100 text-slate-600 border border-slate-200", dot: "bg-slate-400" };
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardsProps {
  taskIndex: number;
  task: string;
  assign_to: string;
  start_date: string;
  end_date: string;
  status: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Cards: React.FC<CardsProps> = ({
  taskIndex, task, assign_to, start_date, end_date, status,
}) => {
  const dispatch = useDispatch();
  const [showEditCard, setShowEditCard] = useState(false);
  const { badge, dot } = statusConfig(status);

  // ── Handlers (unchanged) ─────────────────────────────────────────────────

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(removeTask(taskIndex));
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-xl border-2 border-blue-100 shadow-md overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-200">

      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-3 py-2 flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-white leading-tight line-clamp-1 flex-1">
          {task}
        </p>
        <button
          onClick={() => setShowEditCard(true)}
          title="Edit"
          className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white transition-colors shrink-0"
        >
          <FaRegEdit size={11} />
        </button>
      </div>

      {/* Card Body */}
      <div className="bg-white px-3 py-2.5 flex flex-col gap-2">

        {/* Status badge */}
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge}`}>
            {status || "—"}
          </span>
        </div>

        {/* Assignee */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide w-8 shrink-0">
            👤
          </span>
          <span className="text-[10px] font-semibold text-slate-700 truncate">
            {assign_to || "Unassigned"}
          </span>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-1 pt-1.5 border-t border-slate-100">
          <span className="text-[10px]">📅</span>
          <span className="text-[10px] font-semibold text-slate-700">{fmt(start_date)}</span>
          <span className="text-[10px] text-slate-400">→</span>
          <span className="text-[10px] font-semibold text-slate-700">{fmt(end_date)}</span>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="mt-1 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 text-red-600 text-[11px] font-semibold transition-colors duration-150"
        >
          🗑️ Delete Task
        </button>

      </div>

      {/* Edit Modal */}
      {showEditCard && (
        <EditTaskCard
          taskIndex={taskIndex}
          task={task}
          assign_to={assign_to}
          start_date={start_date}
          end_date={end_date}
          status={status}
          close={() => setShowEditCard(false)}
        />
      )}

    </div>
  );
};

export default Cards;