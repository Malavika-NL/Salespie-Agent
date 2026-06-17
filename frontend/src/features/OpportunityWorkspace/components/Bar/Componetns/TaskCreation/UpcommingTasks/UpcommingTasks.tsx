// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../../../../app/store";
// import { removeTask } from "../../../../../slice/opportunitySlice";

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

// interface TaskCardProps {
//   task: string;
//   assign_to: string;
//   start_date: string;
//   end_date: string;
//   status: string;
//   onRemove: () => void;
// }

// const TaskCard: React.FC<TaskCardProps> = ({ task, assign_to, start_date, end_date, status, onRemove }) => {
//   const { bg, text, dot } = statusStyle(status);

//   const handleDelete = () => {
//     if (window.confirm("Are you sure you want to delete this task?")) {
//       onRemove();
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
//     }}>
//       {/* Task title */}
//       <p style={{
//         margin: 0,
//         fontSize: "13px",
//         fontWeight: 600,
//         color: "#111827",
//         lineHeight: 1.4,
//       }}>
//         {task}
//       </p>

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
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: "5px",
//           width: "100%",
//           padding: "7px 0",
//           background: "#fff1f2",
//           border: "1px solid #fecdd3",
//           borderRadius: "7px",
//           color: "#e11d48",
//           fontSize: "12px",
//           fontWeight: 600,
//           cursor: "pointer",
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
//     </div>
//   );
// };

// // ── Container ─────────────────────────────────────────────────────────────────
// const UpcomingTasks: React.FC = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector((state: RootState) => state.postOpportunityWorkspaceData);
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
//             <TaskCard
//               key={i}
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



import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../../../../app/store";
import { removeTask } from "../../../../../slice/opportunitySlice";
import { CheckSquare } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${day} ${months[parseInt(m) - 1]} ${y}`;
};

const statusConfig = (status: string) => {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    "Pending":     { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-400" },
    "In Progress": { bg: "bg-blue-100",   text: "text-blue-800",   dot: "bg-blue-500"   },
    "Completed":   { bg: "bg-emerald-100", text: "text-emerald-800", dot: "bg-emerald-500" },
  };
  return map[status] ?? { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400" };
};

// ─── TaskCard ─────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: string;
  assign_to: string;
  start_date: string;
  end_date: string;
  status: string;
  onRemove: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, assign_to, start_date, end_date, status, onRemove }) => {
  const { bg, text, dot } = statusConfig(status);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onRemove();
    }
  };

  return (
    <div className="rounded-xl border-2 border-blue-100 shadow-md overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-200">

      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-3 py-2">
        <p className="text-xs font-bold text-white leading-tight line-clamp-2">{task}</p>
      </div>

      {/* Card Body */}
      <div className="bg-white px-3 py-2.5 flex flex-col gap-2">

        {/* Status badge */}
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bg} ${text}`}>
            {status || "—"}
          </span>
        </div>

        {/* Assignee */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-medium">
          <span>👤</span>
          <span>{assign_to || "Unassigned"}</span>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-semibold border-t-2 border-slate-100 pt-2">
          <span>📅</span>
          <span>{fmt(start_date)}</span>
          <span className="text-slate-400">→</span>
          <span>{fmt(end_date)}</span>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="mt-1 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-50 border-2 border-red-100 text-red-500 text-[10px] font-bold hover:bg-red-100 hover:border-red-200 transition-colors duration-150"
        >
          🗑️ Delete Task
        </button>

      </div>
    </div>
  );
};

// ─── UpcomingTasks Container ──────────────────────────────────────────────────

const UpcomingTasks: React.FC = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.postOpportunityWorkspaceData);
  const tasks = Array.isArray(formData?.opportunity_task)
    ? formData.opportunity_task
    : [];

  return (
    <div className="rounded-2xl border-2 border-blue-100 shadow-lg overflow-hidden h-full flex flex-col">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <CheckSquare size={15} color="white" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">Upcoming Tasks</h2>
        </div>
        {tasks.length > 0 && (
          <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/30">
            {tasks.length}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4 flex-1 flex flex-col overflow-hidden">

        {/* Empty State */}
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 py-10">
            <div className="text-4xl opacity-30">✅</div>
            <p className="text-sm text-slate-400 font-semibold m-0">No tasks yet</p>
            <p className="text-xs text-slate-300 m-0">Create a task using the form</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto">
            {tasks.map((t, i) => (
              <TaskCard
                key={i}
                task={t.task}
                assign_to={t.assign_to}
                start_date={t.start_date}
                end_date={t.end_date}
                status={t.status}
                onRemove={() => dispatch(removeTask(i))}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default UpcomingTasks;
