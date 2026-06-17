// import React, { useEffect, useState } from 'react';
// import styles from './CreateTask.module.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { createTask } from './Slice/CreateTaskSlice';
// import type { RootState } from '../../../../app/store';
// import { getUserDetails } from '../../../lead/slice/leadFormSlice';
// import { useNavigate } from 'react-router-dom';
// import { IoIosCloseCircleOutline } from "react-icons/io";

// interface TaskFormProps {
//     onClose: () => void;
// }

// const CreateTask: React.FC<TaskFormProps> = ({ onClose }) => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { loading, Taskdata, error } = useSelector((state: RootState) => state.postCreateTask);

//     // Get the current date in YYYY-MM-DD format
//     const currentDate = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

//     const [formData, setFormData] = useState({
//         task: '',
//         description: '',
//         start_date: currentDate,  // Set the default start date to today
//         end_date: currentDate,    // Set the default end date to today
//         priority: '',
//         status: 'Pending',
//         assignedto: 0,
//     });

//     useEffect(() => {
//         dispatch(getUserDetails() as any);
//     }, [dispatch]);

//     const userData = useSelector((state: RootState) => state.getUserData.userData);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     console.log('task data', formData)

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
 
//         dispatch(createTask(formData) as any);
//         onClose();
//     };

//     return (
//         <div className={styles.modalBackdrop}>
//             <div className={styles.modalContent}>
//                 <div className={styles.headingWrapper}>
//                     <div className={styles.heading}>Create Task</div>
//                     <IoIosCloseCircleOutline 
//                         className={styles.closeIcon} 
//                         onClick={onClose} // Close the modal when the icon is clicked
//                     />
//                 </div>
//                 <form onSubmit={handleSubmit} className={styles.form}>
//                     {/* First Row for Task and Description */}
//                     <div className={styles.row}>
//                         <div className={styles.formRow}>
//                             <label className={styles.label}>Task:</label>
//                             <input
//                                 type="text"
//                                 name="task"
//                                 value={formData.task}
//                                 onChange={handleInputChange}
//                                 className={styles.input}
//                             />
//                         </div>
//                         <div className={styles.formRow}>
//                             <label className={styles.label}>Description:</label>
//                             <input
//                                 type="text"
//                                 name="description"
//                                 value={formData.description}
//                                 onChange={handleInputChange}
//                                 className={styles.input}
//                             />
//                         </div>
//                     </div>

//                     {/* Second Row for Start Date and End Date */}
//                     <div className={styles.row}>
//                         <div className={styles.formRow}>
//                             <label className={styles.label}>Start Date:</label>
//                             <input
//                                 type="date"
//                                 name="start_date"
//                                 value={formData.start_date}
//                                 onChange={handleInputChange}
//                                 className={styles.input}
//                             />
//                         </div>
//                         <div className={styles.formRow}>
//                             <label className={styles.label}>End Date:</label>
//                             <input
//                                 type="date"
//                                 name="end_date"
//                                 value={formData.end_date}
//                                 onChange={handleInputChange}
//                                 className={styles.input}
//                             />
//                         </div>
//                     </div>

//                     {/* Fourth Row for Assigned to */}
//                     <div className={styles.row}>
//                         <div className={styles.formRow}>
//                             <label className={styles.label}>Priority:</label>
//                             <select
//                                 name="priority"
//                                 value={formData.priority}
//                                 onChange={handleInputChange}
//                                 className={styles.select}
//                             >
//                                 <option value="">Select Priority</option>
//                                 <option value="High">High</option>
//                                 <option value="Medium">Medium</option>
//                                 <option value="Low">Low</option>
//                             </select>
//                         </div>
//                         <div className={styles.formRow}>
//                             <label className={styles.label}>Assigned to:</label>
//                             <select
//                                 className={styles.select}
//                                 onChange={handleInputChange}
//                                 value={formData.assignedto}
//                                 name="assignedto"
//                             >
//                                 <option value="">Select User</option>
//                                 {userData && userData.map((user, index) => (
//                                     <option key={index} value={user.id}>
//                                         {user.username}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     <div className={styles.modalActions}>
//                         {/* No Cancel button as per the request */}
//                         <button type="submit" className={styles.button}>Create Task</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CreateTask;




import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from './Slice/CreateTaskSlice';
import type { RootState } from '../../../../app/store';
import { getUserDetails } from '../../../lead/slice/leadFormSlice';
import { useNavigate } from 'react-router-dom';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { ClipboardCheck } from 'lucide-react';

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputClass = "w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200";

const selectClass = (value: string | number) =>
    `w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200 [&>option]:text-slate-800 cursor-pointer ${!value ? 'text-slate-400' : 'text-slate-800'}`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface TaskFormProps {
    onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CreateTask: React.FC<TaskFormProps> = ({ onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, Taskdata, error } = useSelector((state: RootState) => state.postCreateTask);

    const currentDate = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        task: '',
        description: '',
        start_date: currentDate,
        end_date: currentDate,
        priority: '',
        status: 'Pending',
        assignedto: 0,
    });

    useEffect(() => {
        dispatch(getUserDetails() as any);
    }, [dispatch]);

    const userData = useSelector((state: RootState) => state.getUserData.userData);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    console.log('task data', formData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(createTask(formData) as any);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border-2 border-indigo-100 overflow-hidden animate-[slideDown_0.3s_ease-out]">

                {/* Gradient Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                            <ClipboardCheck size={16} color="white" />
                        </div>
                        <h2 className="text-base font-bold text-white m-0">Create Task</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                        aria-label="Close"
                    >
                        <IoIosCloseCircleOutline size={22} color="white" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

                    {/* Row 1: Task + Description */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">Task</label>
                            <input
                                type="text"
                                name="task"
                                value={formData.task}
                                onChange={handleInputChange}
                                placeholder="Enter task name"
                                className={inputClass}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter description"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Row 2: Start Date + End Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Row 3: Priority + Assigned To */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                                className={selectClass(formData.priority)}
                            >
                                <option value="">Select Priority</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">Assigned to</label>
                            <select
                                name="assignedto"
                                value={formData.assignedto}
                                onChange={handleInputChange}
                                className={selectClass(formData.assignedto)}
                            >
                                <option value="">Select User</option>
                                {userData && userData.map((user: any, index: number) => (
                                    <option key={index} value={user.id}>{user.username}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center pt-2">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-10 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-200"
                        >
                            <ClipboardCheck size={15} />
                            Create Task
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateTask;
