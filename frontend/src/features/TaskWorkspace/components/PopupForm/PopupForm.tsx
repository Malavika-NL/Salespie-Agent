// import React, { useState } from 'react';
// import styles from './PopupForm.module.css';

// interface Task {
//     id: number;
//     task: string;
//     description: string;
//     priority: string;
//     start_date: string;
//     end_date: string;
//     assignedto_username: string;
//     status: string;
//     outcome: string;
//     last_update_date: string;
//     is_accepted: string;
//     assigned_by: string;
// }


// interface PopupFormProps {
//     task: Task;
//     onSave: (updatedTask: Task) => void;
//     onClose: () => void;
// }

// const PopupForm: React.FC<PopupFormProps> = ({ task, onSave, onClose }) => {
//     const [updatedTask, setUpdatedTask] = useState<Task>({ ...task });

//     const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setUpdatedTask((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSave(updatedTask);
//     };

//     return (
//         <>
//             {/* Blurred background overlay */}
//             <div className={styles.overlay} onClick={onClose}></div>

//             {/* Popup form */}
//             <div className={styles.popupForm}>
//                 <div className={styles.formContent}>
//                     <h3>Edit Task</h3>
//                     <form onSubmit={handleSubmit}>
//                         <label>
//                             Task:
//                             <input type="text" name="task" value={updatedTask.task} disabled />
//                         </label>
//                         <label>
//                             Status:
//                             <select name="status" value={updatedTask.status} onChange={handleChange}>
//                                 <option value="Pending">Pending</option>
//                                 <option value="In Progress">In Progress</option>
//                                 <option value="Completed">Completed</option>
//                             </select>
//                         </label>
//                         <label>
//                             Outcome:
//                             <input type="text" name="outcome" value={updatedTask.outcome}  onChange={handleChange} />
//                         </label>
//                         <label>
//                             Start Date:
//                             <input
//                                 type="date"
//                                 name="start_date"
//                                 value={updatedTask.start_date}
//                                 onChange={handleChange}
//                                 disabled
//                             />
//                         </label>
//                         <label>
//                             Deadline:
//                             <input type="text" name="end_date" value={updatedTask.end_date} disabled />
//                         </label>
//                         <div className={styles.buttonGroup}>
//                             <button type="submit">Save</button>
//                             <button type="button" onClick={onClose}>Cancel</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default PopupForm;




import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Task {
    id: number;
    task: string;
    description: string;
    priority: string;
    start_date: string;
    end_date: string;
    assignedto_username: string;
    status: string;
    outcome: string;
    last_update_date: string;
    is_accepted: string;
    assigned_by: string;
}

interface PopupFormProps {
    task: Task;
    onSave: (updatedTask: Task) => void;
    onClose: () => void;
}

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputClass = "w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200";

const disabledInputClass = "w-full px-3 py-2 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm text-slate-400 font-medium cursor-not-allowed";

// ─── Component ────────────────────────────────────────────────────────────────

const PopupForm: React.FC<PopupFormProps> = ({ task, onSave, onClose }) => {
    const [updatedTask, setUpdatedTask] = useState<Task>({ ...task });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdatedTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(updatedTask);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Popup */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2000] w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-100 overflow-hidden">

                    {/* Gradient Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                                <FaRegEdit size={13} color="white" />
                            </div>
                            <h3 className="text-sm font-bold text-white tracking-wide m-0">Edit Task</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                            aria-label="Close"
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4">

                        {/* Task — disabled */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">Task</label>
                            <input
                                type="text"
                                name="task"
                                value={updatedTask.task}
                                disabled
                                className={disabledInputClass}
                            />
                        </div>

                        {/* Status */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">Status</label>
                            <select
                                name="status"
                                value={updatedTask.status}
                                onChange={handleChange}
                                className={`${inputClass} [&>option]:text-slate-800 [&>option]:font-medium`}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        {/* Outcome */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">Outcome</label>
                            <input
                                type="text"
                                name="outcome"
                                value={updatedTask.outcome}
                                onChange={handleChange}
                                placeholder="Enter outcome"
                                className={inputClass}
                            />
                        </div>

                        {/* Dates row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-slate-700">Start Date</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={updatedTask.start_date}
                                    onChange={handleChange}
                                    disabled
                                    className={disabledInputClass}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-slate-700">Deadline</label>
                                <input
                                    type="text"
                                    name="end_date"
                                    value={updatedTask.end_date}
                                    disabled
                                    className={disabledInputClass}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-1">
                            <button
                                type="submit"
                                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors shadow-md"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors"
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
};

export default PopupForm;
