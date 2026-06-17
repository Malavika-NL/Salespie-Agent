// // src/features/Editopportunityworkspace/components/Bar/componetns/Taskcreation/UpcomingTasks/EditTaskCard/EditTaskCard.tsx

// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { updateTask } from "../../../../../../slice/EditOpportunityWorkspace";

// interface EditTaskCardProps {
//   taskIndex: number;
//   task: string;
//   assign_to: string;
//   start_date: string;
//   end_date: string;
//   status: string;
//   close: () => void;
// }

// const statusOptions = ["Pending", "In Progress", "Completed"];

// const EditTaskCard: React.FC<EditTaskCardProps> = ({
//   taskIndex, task, assign_to, start_date, end_date, status, close,
// }) => {
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState({ task, assign_to, start_date, end_date, status });

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({ ...prev, [id]: value }));
//   };

//   const handleSave = () => {
//     dispatch(updateTask({ taskIndex, updatedTask: formData }));
//     close();
//   };

//   return (
//     <div style={{
//       position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       zIndex: 1000,
//     }}>
//       <div style={{
//         background: "#fff", borderRadius: "12px", padding: "24px",
//         width: "100%", maxWidth: "420px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
//         display: "flex", flexDirection: "column", gap: "14px",
//       }}>
//         <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#111827" }}>
//           Edit Task
//         </h3>
//         <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: 0 }} />

//         {[
//           { label: "Task", id: "task", type: "text" },
//           { label: "Assign To", id: "assign_to", type: "text" },
//           { label: "Start Date", id: "start_date", type: "date" },
//           { label: "End Date", id: "end_date", type: "date" },
//         ].map(({ label, id, type }) => (
//           <div key={id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
//             <label style={{ fontSize: "12px", fontWeight: 500, color: "#374151" }}>{label}</label>
//             <input
//               type={type}
//               id={id}
//               value={formData[id as keyof typeof formData]}
//               onChange={handleInputChange}
//               style={{
//                 padding: "8px 10px", fontSize: "13px",
//                 border: "1px solid #d1d5db", borderRadius: "7px",
//                 outline: "none", color: "#111827",
//               }}
//             />
//           </div>
//         ))}

//         {/* Status dropdown */}
//         <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
//           <label style={{ fontSize: "12px", fontWeight: 500, color: "#374151" }}>Status</label>
//           <select
//             id="status"
//             value={formData.status}
//             onChange={handleInputChange}
//             style={{
//               padding: "8px 10px", fontSize: "13px",
//               border: "1px solid #d1d5db", borderRadius: "7px",
//               outline: "none", color: "#111827", background: "#fff",
//             }}
//           >
//             {statusOptions.map(s => (
//               <option key={s} value={s}>{s}</option>
//             ))}
//           </select>
//         </div>

//         {/* Buttons */}
//         <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
//           <button
//             onClick={handleSave}
//             style={{
//               flex: 1, padding: "9px 0", background: "#2563eb",
//               border: "none", borderRadius: "7px", color: "#fff",
//               fontSize: "13px", fontWeight: 600, cursor: "pointer",
//             }}
//           >
//             Save
//           </button>
//           <button
//             onClick={close}
//             style={{
//               flex: 1, padding: "9px 0", background: "#f3f4f6",
//               border: "1px solid #e5e7eb", borderRadius: "7px", color: "#374151",
//               fontSize: "13px", fontWeight: 600, cursor: "pointer",
//             }}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditTaskCard;


// src/features/Editopportunityworkspace/components/Bar/componetns/Taskcreation/UpcomingTasks/EditTaskCard/EditTaskCard.tsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../../../../../../slice/EditOpportunityWorkspace";
import { X, ClipboardCheck } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EditTaskCardProps {
  taskIndex: number;
  task: string;
  assign_to: string;
  start_date: string;
  end_date: string;
  status: string;
  close: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const statusOptions = ["Pending", "In Progress", "Completed"];

// ─── Style helper ─────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200";

const selectClass = (value: string) =>
  `w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 [&>option]:text-slate-800 [&>option]:font-medium ${
    !value ? "text-slate-400 font-normal" : "text-slate-800"
  }`;

// ─── Component ────────────────────────────────────────────────────────────────

const EditTaskCard: React.FC<EditTaskCardProps> = ({
  taskIndex, task, assign_to, start_date, end_date, status, close,
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ task, assign_to, start_date, end_date, status });

  // ── Handlers (unchanged) ─────────────────────────────────────────────────

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    dispatch(updateTask({ taskIndex, updatedTask: formData }));
    close();
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border-2 border-blue-100 overflow-hidden">

        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <ClipboardCheck size={15} color="white" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">Edit Task</h3>
          </div>
          <button
            onClick={close}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X size={15} color="white" />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-5 py-4 flex flex-col gap-4 bg-white">

          {/* Task */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task" className="text-sm font-semibold text-slate-700">
              Task
            </label>
            <input
              type="text"
              id="task"
              value={formData.task}
              onChange={handleInputChange}
              placeholder="Enter task description"
              className={inputClass}
            />
          </div>

          {/* Assign To */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="assign_to" className="text-sm font-semibold text-slate-700">
              Assign To
            </label>
            <input
              type="text"
              id="assign_to"
              value={formData.assign_to}
              onChange={handleInputChange}
              placeholder="Enter assignee"
              className={inputClass}
            />
          </div>

          {/* Start / End Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="start_date" className="text-sm font-semibold text-slate-700">
                Start Date
              </label>
              <input
                type="date"
                id="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="end_date" className="text-sm font-semibold text-slate-700">
                End Date
              </label>
              <input
                type="date"
                id="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className="text-sm font-semibold text-slate-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={handleInputChange}
              className={selectClass(formData.status)}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors duration-200 shadow-md"
          >
            Save
          </button>
          <button
            type="button"
            onClick={close}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors duration-200"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditTaskCard;