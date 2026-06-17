// import React, { useState } from 'react';
// import { MdPowerSettingsNew } from "react-icons/md";
// import styles from './Header.module.css';

// import CreateTask from '../CreateTask/CreateTask';
// import type { IoChevronForward } from "react-icons/io5";
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';

// const Header: React.FC = () => {
//     const [showForm, setShowForm] = useState(false);
//     const today = new Date();
//     const dateNumber = today.getDate();
//     const day = today.toLocaleDateString('en-US', { weekday: 'long' });
//     const month = today.toLocaleDateString('en-US', { month: 'long' });

//     const handleButtonClick = () => {
//         setShowForm(true);
//     };

//     const handleCloseForm = () => {
//         setShowForm(false);
//     };

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const location = useLocation();

//     const isUser = location.pathname.startsWith("/user");
//     const handlelistButtonClick = () => {
//         if (isUser) {
//             navigate("/user/TaskWorkspaceList");
//         } else {
//             navigate("/AdminTaskWorkspaceList ");
//         }
//     };


//     return (
//         <>
//          {/* <div className={styles.mainhead}>
//             Task Dashbaord
//          </div> */}
//         <div className={styles.headerContainer}>
//             <div className={styles.dateSection}>
//                 <div className={styles.dateNumber}>{dateNumber}</div>
//                 <div className={styles.dateDetails}>
//                     <div className={styles.day}>{day}</div>
//                     <div className={styles.month}>{month}</div>
//                 </div>
//             </div>
//             <div className={styles.mainhead}>
//             Task Dashbaord
//          </div>
//             <div className={styles.rightSection}>
//                 <button className={styles.createTaskButton} onClick={handleButtonClick}>Create Task +</button>

//                 <button className={styles.tasklist} onClick={handlelistButtonClick}> Task List {'>>'}</button>
//             </div>

//             {showForm && <CreateTask onClose={handleCloseForm} />}
//         </div>
//         </>
//     );
// };

// export default Header;


import React, { useState } from 'react';
import { MdPowerSettingsNew } from "react-icons/md";
import { ClipboardList, Plus } from "lucide-react";
import CreateTask from '../CreateTask/CreateTask';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    const today = new Date();
    const dateNumber = today.getDate();
    const day = today.toLocaleDateString('en-US', { weekday: 'long' });
    const month = today.toLocaleDateString('en-US', { month: 'long' });

    const handleButtonClick = () => setShowForm(true);
    const handleCloseForm  = () => setShowForm(false);

    const dispatch  = useDispatch();
    const navigate  = useNavigate();
    const location  = useLocation();

    const isUser = location.pathname.startsWith("/user");

    const handlelistButtonClick = () => {
        if (isUser) { navigate("/user/TaskWorkspaceList"); }
        else { navigate("/AdminTaskWorkspaceList"); }
    };

    return (
        <>
            <div className="flex items-center justify-between flex-wrap gap-4 px-1">

                {/* ── Date Section ── */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
                        <span className="text-xl font-extrabold text-white leading-none">{dateNumber}</span>
                        <span className="text-[10px] font-semibold text-indigo-200 uppercase tracking-wider leading-none mt-0.5">{month.slice(0,3)}</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-indigo-600 m-0 leading-tight">Task Dashboard</p>
                        <p className="text-sm text-slate-400 m-0 mt-0.5">{day}, {month}</p>
                    </div>
                </div>

                {/* ── Right Actions ── */}
                <div className="flex items-center gap-3">
                    {/* Create Task */}
                    <button
                        onClick={handleButtonClick}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-200 border-none cursor-pointer"
                    >
                        <Plus size={16} />
                        Create Task
                    </button>

                    {/* Task List */}
                    <button
                        onClick={handlelistButtonClick}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 text-sm font-bold rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                        <ClipboardList size={15} />
                        Task List
                    </button>
                </div>
            </div>

            {showForm && <CreateTask onClose={handleCloseForm} />}
        </>
    );
};

export default Header;