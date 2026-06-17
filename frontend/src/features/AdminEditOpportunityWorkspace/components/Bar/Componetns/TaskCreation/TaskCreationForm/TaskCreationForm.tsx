// // src/features/AdminEditopportunityworkspace/components/Bar/componetns/Taskcreation/Taskcreationform/Taskcreationform.tsx
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";

// import styles from "./TaskCreationForm.module.css";
// import { addTaskDetails } from "../../../../../slice/AdminEditOpportunityWorkspaceSlice";

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
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Task Creation</h2>
//       <hr className={styles.line} />
//       <form className={styles.form} onSubmit={handleSubmit}>
//         <div className={styles.row}>
//           <div className={styles.field}>
//             <label htmlFor="task" className={styles.rowlabel}>
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
//         </div>

//         <div className={styles.row}>
//           <div className={styles.field}>
//             <label htmlFor="assign_to" className={styles.rowlabel}>
//               Assigned To:
//             </label>
//             <select
//               id="assign_to"
//               name="assign_to"
//               className={styles.input}
//               value={taskFormValues.assign_to}
//               onChange={handleInputChange}
//             >
//               <option value="">Select Assignee</option>
//               <option value="event1">Event 1</option>
//               <option value="event2">Event 2</option>
//               <option value="event3">Event 3</option>
//             </select>
//           </div>
//         </div>

//         <div className={styles.row}>
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
//         </div>

//         <div className={styles.row}>
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
//         </div>

//         <div className={styles.row}>
//           <div className={styles.field}>
//             <label htmlFor="status" className={styles.rowlabel}>
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
//         </div>

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
// import styles from "./TaskCreationForm.module.css";
// import { addTaskDetails } from "../../../../../slice/AdminEditOpportunityWorkspaceSlice";

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

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setTaskFormValues({ ...taskFormValues, [name]: value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     dispatch(addTaskDetails(taskFormValues));
//     setTaskFormValues({ start_date: "", end_date: "", task: "", assign_to: "", status: "" });
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Task Creation</h2>
//       <hr className={styles.line} />
      
//       <form className={styles.form} onSubmit={handleSubmit}>
        
//         {/* TASK */}
//         <div className={styles.field}>
//           <label htmlFor="task" className={styles.label}>
//             TASK <span className={styles.asterisk}>*</span>
//           </label>
//           <input
//             type="text"
//             id="task"
//             name="task"
//             className={styles.input}
//             value={taskFormValues.task}
//             onChange={handleInputChange}
//             placeholder="Enter the task description"
//             required
//           />
//         </div>

//         {/* ASSIGNED TO */}
//         <div className={styles.field}>
//           <label htmlFor="assign_to" className={styles.label}>
//             ASSIGNED TO <span className={styles.asterisk}>*</span>
//           </label>
//           <select
//             id="assign_to"
//             name="assign_to"
//             className={styles.select}
//             value={taskFormValues.assign_to}
//             onChange={handleInputChange}
//             required
//           >
//             <option value="">Select Assignee</option>
//             <option value="event1">Event 1</option>
//             <option value="event2">Event 2</option>
//             <option value="event3">Event 3</option>
//           </select>
//         </div>

//         {/* DATES */}
//         <div className={styles.row}>
//           <div className={styles.field}>
//             <label htmlFor="start_date" className={styles.label}>
//               START DATE <span className={styles.asterisk}>*</span>
//             </label>
//             <input
//               type="date"
//               id="start_date"
//               name="start_date"
//               className={styles.input}
//               value={taskFormValues.start_date}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className={styles.field}>
//             <label htmlFor="end_date" className={styles.label}>
//               END DATE <span className={styles.asterisk}>*</span>
//             </label>
//             <input
//               type="date"
//               id="end_date"
//               name="end_date"
//               className={styles.input}
//               value={taskFormValues.end_date}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//         </div>

//         {/* STATUS */}
//         <div className={styles.field}>
//           <label htmlFor="status" className={styles.label}>
//             STATUS <span className={styles.asterisk}>*</span>
//           </label>
//           <select
//             id="status"
//             name="status"
//             className={styles.select}
//             value={taskFormValues.status}
//             onChange={handleInputChange}
//             required
//           >
//             <option value="">Select Status</option>
//             <option value="Pending">Pending</option>
//             <option value="In Progress">In Progress</option>
//             <option value="Completed">Completed</option>
//           </select>
//         </div>

//         {/* SUBMIT BUTTON */}
//         <button type="submit" className={styles.submitBtn}>
//           + Create Task
//         </button>
//       </form>
//     </div>
//   );
// };

// export default TaskCreationForm;






import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTaskDetails } from "../../../../../slice/AdminEditOpportunityWorkspaceSlice";
import { ClipboardCheck } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EventData {
  start_date: string;
  end_date:   string;
  task:       string;
  assign_to:  string;
  status:     string;
}

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all duration-200 bg-white text-slate-800";

const selectClass =
  "w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all duration-200 bg-white text-slate-800 [&>option]:text-slate-800 [&>option]:font-medium";

// ─── Component ────────────────────────────────────────────────────────────────

const TaskCreationForm: React.FC = () => {
  const dispatch = useDispatch();

  const [taskFormValues, setTaskFormValues] = useState<EventData>({
    start_date: "",
    end_date:   "",
    task:       "",
    assign_to:  "",
    status:     "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskFormValues({ ...taskFormValues, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addTaskDetails(taskFormValues));
    setTaskFormValues({ start_date: "", end_date: "", task: "", assign_to: "", status: "" });
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
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          {/* Task */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task" className="text-sm font-semibold text-slate-700">
              Task <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="task"
              name="task"
              value={taskFormValues.task}
              onChange={handleInputChange}
              placeholder="Enter the task description"
              className={inputClass}
              required
            />
          </div>

          {/* Assigned To */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="assign_to" className="text-sm font-semibold text-slate-700">
              Assigned To <span className="text-red-500">*</span>
            </label>
            <select
              id="assign_to"
              name="assign_to"
              value={taskFormValues.assign_to}
              onChange={handleInputChange}
              className={selectClass}
              required
            >
              <option value="">Select Assignee</option>
              <option value="event1">Event 1</option>
              <option value="event2">Event 2</option>
              <option value="event3">Event 3</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="start_date" className="text-sm font-semibold text-slate-700">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={taskFormValues.start_date}
                onChange={handleInputChange}
                className={inputClass}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="end_date" className="text-sm font-semibold text-slate-700">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={taskFormValues.end_date}
                onChange={handleInputChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className="text-sm font-semibold text-slate-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={taskFormValues.status}
              onChange={handleInputChange}
              className={selectClass}
              required
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
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