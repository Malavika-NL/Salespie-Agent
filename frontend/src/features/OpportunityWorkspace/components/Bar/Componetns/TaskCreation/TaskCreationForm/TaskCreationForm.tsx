// import React, { useState } from "react";
// import { useDispatch } from "react-redux";

// import styles from "./TaskCreationForm.module.css";
// import { addTaskDetails } from "../../../../../slice/opportunitySlice";

// export interface EventData {
//   start_date: string;
//   end_date: string;
//   task: string;  
//   assign_to: string;
//   status: string;
// }

// const TaskCreationForm: React.FC = () => {
//   const dispatch = useDispatch();

//   const [taskFormValues, setTaskFormValues] = useState<EventData>({
//     start_date: "",
//     end_date: "",
//     task: "",
//     assign_to: "",
//     status: "",
//   });

//   // Handle input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setTaskFormValues({ ...taskFormValues, [name]: value });
//   };

//   // Handle form submission
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     dispatch(addTaskDetails(taskFormValues));

//     setTaskFormValues({
//       start_date: "",
//       end_date: "",
//       task: "",
//       assign_to: "",
//       status: "",
//     });
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Task Creation</h2>
//       <hr className={styles.line} />
//       <form className={styles.form} onSubmit={handleSubmit}>
      
//           <div className={styles.field}>
//             <label htmlFor="task" className={styles.label}>
//               Task:
//             </label>
//             <input
//               type="text"
//               id="task"
//               name="task"
//               className={styles.input}
//               value={taskFormValues.task}
//               onChange={handleInputChange}
//               placeholder="Enter the Task"
//             />
//           </div>
  

        
//           <div className={styles.field}>
//             <label htmlFor="assign_to" className={styles.label}>
//               Assigned To:
//             </label>
//             <select
//               id="assign_to"
//               name="assign_to"
//               className={styles.singleinput}
//               value={taskFormValues.assign_to}
//               onChange={handleInputChange}
//             >
//               <option value="">Select Assignee</option>
//               <option value="event1">Event 1</option>
//               <option value="event2">Event 2</option>
//               <option value="event3">Event 3</option>
//             </select>
//           </div>
    

        
//           <div className={styles.field}>
//             <label htmlFor="start_date" className={styles.label}>
//               Start Date:
//             </label>
//             <input
//               type="date"
//               id="start_date"
//               name="start_date"
//               className={styles.input}
//               value={taskFormValues.start_date}
//               onChange={handleInputChange}
//             />
//           </div>
  

       
//           <div className={styles.field}>
//             <label htmlFor="end_date" className={styles.label}>
//               End Date:
//             </label>
//             <input
//               type="date"
//               id="end_date"
//               name="end_date"
//               className={styles.input}
//               value={taskFormValues.end_date}
//               onChange={handleInputChange}
//             />
//           </div>
    

       
//           <div className={styles.field}>
//             <label htmlFor="status" className={styles.label}>
//               Status:
//             </label>
//             <input
//               type="text"
//               id="status"
//               name="status"
//               className={styles.input}
//               value={taskFormValues.status}
//               onChange={handleInputChange}
//               placeholder="Enter the status"
//             />
//           </div>
   

//         <div className={styles.buttonContainer}>
//           <button type="submit" className={styles.editButton}>
//             Create Task
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default TaskCreationForm;


// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addTaskDetails } from "../../../../../slice/opportunitySlice";

// interface TaskData {
//   task: string;
//   assign_to: string;
//   start_date: string;
//   end_date: string;
//   status: string;
// }

// interface TaskErrors {
//   task?: string;
//   assign_to?: string;
//   start_date?: string;
//   end_date?: string;
//   status?: string;
// }

// const STATUS_CHOICES = ["Pending", "In Progress", "Completed"];

// const s: Record<string, React.CSSProperties> = {
//   container: {
//     background: "#ffffff",
//     borderRadius: "12px",
//     padding: "24px",
//     height: "100%",
//     boxSizing: "border-box",
//   },
//   heading: {
//     fontSize: "15px",
//     fontWeight: 600,
//     color: "#111827",
//     margin: "0 0 4px 0",
//     letterSpacing: "-0.2px",
//   },
//   divider: {
//     border: "none",
//     borderTop: "1px solid #e5e7eb",
//     margin: "10px 0 18px 0",
//   },
//   successBanner: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     background: "#f0fdf4",
//     border: "1px solid #bbf7d0",
//     color: "#15803d",
//     padding: "10px 14px",
//     borderRadius: "8px",
//     fontSize: "13px",
//     fontWeight: 500,
//     marginBottom: "16px",
//   },
//   label: {
//     display: "block",
//     fontSize: "12px",
//     fontWeight: 600,
//     marginBottom: "5px",
//     color: "#374151",
//     textTransform: "uppercase",
//     letterSpacing: "0.5px",
//   },
//   required: { color: "#ef4444" },
//   errorText: {
//     color: "#ef4444",
//     fontSize: "11px",
//     marginTop: "4px",
//     display: "flex",
//     alignItems: "center",
//     gap: "4px",
//   },
//   grid2: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: "14px",
//     marginBottom: "14px",
//   },
//   fieldWrap: { marginBottom: "14px" },
//   submitBtn: {
//     width: "100%",
//     padding: "11px",
//     background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
//     color: "#fff",
//     border: "none",
//     borderRadius: "8px",
//     fontSize: "14px",
//     fontWeight: 600,
//     cursor: "pointer",
//     letterSpacing: "0.2px",
//     marginTop: "4px",
//   },
// };

// const inputStyle = (hasError: boolean): React.CSSProperties => ({
//   width: "100%",
//   padding: "9px 11px",
//   borderRadius: "8px",
//   fontSize: "13px",
//   border: hasError ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
//   outline: "none",
//   boxSizing: "border-box",
//   background: hasError ? "#fff5f5" : "#f9fafb",
//   color: "#111827",
// });

// const TaskCreationForm: React.FC = () => {
//   const dispatch = useDispatch();

//   const [form, setForm] = useState<TaskData>({
//     task: "", assign_to: "", start_date: "", end_date: "", status: "",
//   });
//   const [errors, setErrors] = useState<TaskErrors>({});
//   const [successMsg, setSuccessMsg] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//     setErrors(prev => ({ ...prev, [name]: undefined }));
//   };

//   const validate = (): boolean => {
//     const newErrors: TaskErrors = {};
//     if (!form.task.trim()) newErrors.task = "Task name is required.";
//     if (!form.assign_to) newErrors.assign_to = "Please select an assignee.";
//     if (!form.start_date) newErrors.start_date = "Start date is required.";
//     if (!form.end_date) newErrors.end_date = "End date is required.";
//     if (form.start_date && form.end_date && form.end_date < form.start_date)
//       newErrors.end_date = "End date cannot be before start date.";
//     if (!form.status) newErrors.status = "Please select a status.";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setSuccessMsg("");
//     if (!validate()) return;
//     dispatch(addTaskDetails(form));
//     setForm({ task: "", assign_to: "", start_date: "", end_date: "", status: "" });
//     setSuccessMsg("Task created successfully!");
//     setTimeout(() => setSuccessMsg(""), 3000);
//   };

//   return (
//     <div style={s.container}>
//       <h2 style={s.heading}>Task Creation</h2>
//       <hr style={s.divider} />

//       {successMsg && (
//         <div style={s.successBanner}>
//           <span>✓</span> {successMsg}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} noValidate>
//         {/* Task Name */}
//         <div style={s.fieldWrap}>
//           <label style={s.label}>Task <span style={s.required}>*</span></label>
//           <input
//             type="text" name="task" value={form.task} onChange={handleChange}
//             placeholder="Enter the task description"
//             style={inputStyle(!!errors.task)}
//           />
//           {errors.task && <p style={s.errorText}>⚠ {errors.task}</p>}
//         </div>

//         {/* Assigned To */}
//         <div style={s.fieldWrap}>
//           <label style={s.label}>Assigned To <span style={s.required}>*</span></label>
//           <select name="assign_to" value={form.assign_to} onChange={handleChange} style={inputStyle(!!errors.assign_to)}>
//             <option value="">Select Assignee</option>
//             <option value="event1">Event 1</option>
//               <option value="event2">Event 2</option>
//               <option value="event3">Event 3</option>
//           </select>
//           {errors.assign_to && <p style={s.errorText}>⚠ {errors.assign_to}</p>}
//         </div>

//         {/* Dates */}
//         <div style={s.grid2}>
//           <div>
//             <label style={s.label}>Start Date <span style={s.required}>*</span></label>
//             <input type="date" name="start_date" value={form.start_date} onChange={handleChange} style={inputStyle(!!errors.start_date)} />
//             {errors.start_date && <p style={s.errorText}>⚠ {errors.start_date}</p>}
//           </div>
//           <div>
//             <label style={s.label}>End Date <span style={s.required}>*</span></label>
//             <input type="date" name="end_date" value={form.end_date} onChange={handleChange} style={inputStyle(!!errors.end_date)} />
//             {errors.end_date && <p style={s.errorText}>⚠ {errors.end_date}</p>}
//           </div>
//         </div>

//         {/* Status */}
//         <div style={s.fieldWrap}>
//           <label style={s.label}>Status <span style={s.required}>*</span></label>
//           <select name="status" value={form.status} onChange={handleChange} style={inputStyle(!!errors.status)}>
//             <option value="">Select Status</option>
//             {STATUS_CHOICES.map(st => <option key={st} value={st}>{st}</option>)}
//           </select>
//           {errors.status && <p style={s.errorText}>⚠ {errors.status}</p>}
//         </div>

//         <button type="submit" style={s.submitBtn}>
//           + Create Task
//         </button>
//       </form>
//     </div>
//   );
// };

// export default TaskCreationForm;


import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTaskDetails } from "../../../../../slice/opportunitySlice";
import { ClipboardCheck } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TaskData {
  task: string;
  assign_to: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface TaskErrors {
  task?: string;
  assign_to?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CHOICES = ["Pending", "In Progress", "Completed"];

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputClass = (hasError: boolean) =>
  `w-full px-3 py-2 rounded-xl border-2 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all duration-200 bg-white text-slate-800 ${
    hasError ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400" : "border-slate-200"
  }`;

const selectClass = (hasError: boolean, value: string) =>
  `w-full px-3 py-2 rounded-xl border-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all duration-200 bg-white [&>option]:text-slate-800 [&>option]:font-medium ${
    hasError ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400 text-slate-800" : "border-slate-200"
  } ${!value ? "text-slate-400 font-normal" : "text-slate-800"}`;

// ─── Component ────────────────────────────────────────────────────────────────

const TaskCreationForm: React.FC = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState<TaskData>({
    task: "", assign_to: "", start_date: "", end_date: "", status: "",
  });
  const [errors, setErrors] = useState<TaskErrors>({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: TaskErrors = {};
    if (!form.task.trim()) newErrors.task = "Task name is required.";
    if (!form.assign_to) newErrors.assign_to = "Please select an assignee.";
    if (!form.start_date) newErrors.start_date = "Start date is required.";
    if (!form.end_date) newErrors.end_date = "End date is required.";
    if (form.start_date && form.end_date && form.end_date < form.start_date)
      newErrors.end_date = "End date cannot be before start date.";
    if (!form.status) newErrors.status = "Please select a status.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    if (!validate()) return;
    dispatch(addTaskDetails(form));
    setForm({ task: "", assign_to: "", start_date: "", end_date: "", status: "" });
    setSuccessMsg("Task created successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="rounded-2xl border-2 border-blue-100 shadow-lg overflow-hidden h-full">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-3 flex items-center gap-2">
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
          <ClipboardCheck size={15} color="white" />
        </div>
        <h2 className="text-sm font-bold text-white tracking-wide">Task Creation</h2>
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4">

        {/* Success Banner */}
        {successMsg && (
          <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold mb-4">
            <span className="text-emerald-500 font-bold">✓</span> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          {/* Task Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Task <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="task" value={form.task} onChange={handleChange}
              placeholder="Enter the task description"
              className={inputClass(!!errors.task)}
            />
            {errors.task && <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><span>⚠</span> {errors.task}</p>}
          </div>

          {/* Assigned To */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Assigned To <span className="text-red-500">*</span>
            </label>
            <select name="assign_to" value={form.assign_to} onChange={handleChange} className={selectClass(!!errors.assign_to, form.assign_to)}>
              <option value="">Select Assignee</option>
              <option value="event1">Event 1</option>
              <option value="event2">Event 2</option>
              <option value="event3">Event 3</option>
            </select>
            {errors.assign_to && <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><span>⚠</span> {errors.assign_to}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className={inputClass(!!errors.start_date)} />
              {errors.start_date && <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><span>⚠</span> {errors.start_date}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                End Date <span className="text-red-500">*</span>
              </label>
              <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className={inputClass(!!errors.end_date)} />
              {errors.end_date && <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><span>⚠</span> {errors.end_date}</p>}
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select name="status" value={form.status} onChange={handleChange} className={selectClass(!!errors.status, form.status)}>
              <option value="">Select Status</option>
              {STATUS_CHOICES.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
            {errors.status && <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><span>⚠</span> {errors.status}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors duration-200 shadow-md mt-1"
          >
            <ClipboardCheck size={15} /> Create Task
          </button>

        </form>
      </div>
    </div>
  );
};

export default TaskCreationForm;