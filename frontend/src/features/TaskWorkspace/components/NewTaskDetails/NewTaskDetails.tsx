// import React, { useEffect, useState } from 'react';
// import styles from './NewTaskDetails.module.css';
// import { FaCircleChevronRight } from "react-icons/fa6";
// import { IoCheckmarkDone } from "react-icons/io5";
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../../../../app/store';
// import { fetchTaskDetails } from './TaskDetails/TaskDetails';

// interface Task {
//     id: number;  // Task ID
//     task: string;
//     description: string;
//     priority: string;
//     start_date: string;
//     end_date: string;
//     assignedto: number;  // ID of the person assigned to the task
//     assignedto_username: string;
//     status: string;
//     outcome: string;
//     last_update_date: string;
//     is_accepted: string; // Is accepted field (yes or no)
//     assigned_by: string;
// }

// const generateAbbreviation = (name: string | null) => {
//     if (!name) return 'NA';
//     const words = name.split(' ');
//     return words.map(word => word[0]).join('').toUpperCase();
// };

// const NewTaskDetails: React.FC = () => {
//     const dispatch = useDispatch();
//     const [taskData, setTaskData] = useState<Task[]>([]);

//     // Fetch token at the top level
//     const token = useSelector((state: RootState) => state.userLoginAuth?.user?.tokens.access) || localStorage.getItem('token');

//     useEffect(() => {
//         dispatch(fetchTaskDetails() as any);
//     }, [dispatch]);

//     const { data, loading, error } = useSelector((state: RootState) => state.fetchTaskDetailsData);

//     useEffect(() => {
//         if (data) {
//             // Filter tasks where is_accepted is 'no'
//             const filteredTasks = data.filter((task: Task) => task.is_accepted === 'No');
//             setTaskData(filteredTasks);
//         }
//     }, [data]);

//     // Pass token as an argument
//     const handleAcceptTask = (taskId: number, token: string | null) => {
//         fetch(`http://localhost:8000/task/${taskId}/accept/`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//                 is_accepted: 'yes',
//             }),
//         })
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error('Failed to accept the task');
//             }
//             console.log(response , 'response')
//             return response.json();
//         })
//         .then(() => {
//             alert("New Task Added successfully");
//             dispatch(fetchTaskDetails() as any);
//         })
//         .catch((error) => {
//             console.error('Error accepting task:', error);
//         });
//     };

//     return (
//         <div className={styles.newTaskDetails}>
//             <h2 className={styles.heading}>New Task Details</h2>
//             <div className={styles.taskList}>
//                 {taskData && taskData.map((task: Task, index: number) => (
//                     <div key={index} className={styles.taskCard}>
//                         <div className={styles.taskdetails}>
//                             <div className={styles.initials}>{generateAbbreviation(task.assigned_by)}</div>
//                             <div className={styles.taskInfo}>
//                                 <p className={styles.name}>{task.assigned_by || 'N/A'}</p>
//                                 <p className={styles.task}>{task.task}</p>
//                             </div>
//                         </div>
//                         <div className={styles.iconcontainer}>
//                             <IoCheckmarkDone
//                                 size={20}
//                                 onClick={() => handleAcceptTask(task.id, token)}  // Handle task acceptance on click
//                             />
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default NewTaskDetails;



import React, { useEffect, useState } from 'react';
import { IoCheckmarkDone } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { fetchTaskDetails } from './TaskDetails/TaskDetails';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Task {
    id: number;
    task: string;
    description: string;
    priority: string;
    start_date: string;
    end_date: string;
    assignedto: number;
    assignedto_username: string;
    status: string;
    outcome: string;
    last_update_date: string;
    is_accepted: string;
    assigned_by: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateAbbreviation = (name: string | null) => {
    if (!name) return 'NA';
    const words = name.split(' ');
    return words.map(word => word[0]).join('').toUpperCase();
};

const AVATAR_COLORS = [
    'from-indigo-500 to-violet-500',
    'from-blue-500 to-cyan-400',
    'from-emerald-500 to-teal-400',
    'from-amber-500 to-orange-400',
    'from-rose-500 to-pink-400',
    'from-purple-500 to-indigo-400',
];

// ─── Component ────────────────────────────────────────────────────────────────

const NewTaskDetails: React.FC = () => {
    const dispatch = useDispatch();
    const [taskData, setTaskData] = useState<Task[]>([]);

    const token = useSelector((state: RootState) => state.userLoginAuth?.user?.tokens.access) || localStorage.getItem('token');

    useEffect(() => {
        dispatch(fetchTaskDetails() as any);
    }, [dispatch]);

    const { data, loading, error } = useSelector((state: RootState) => state.fetchTaskDetailsData);

    useEffect(() => {
        if (data) {
            const filteredTasks = data.filter((task: Task) => task.is_accepted === 'No');
            setTaskData(filteredTasks);
        }
    }, [data]);

    const handleAcceptTask = (taskId: number, token: string | null) => {
        fetch(`http://localhost:8000/task/${taskId}/accept/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ is_accepted: 'yes' }),
        })
        .then((response) => {
            if (!response.ok) throw new Error('Failed to accept the task');
            console.log(response, 'response');
            return response.json();
        })
        .then(() => {
            alert("New Task Added successfully");
            dispatch(fetchTaskDetails() as any);
        })
        .catch((error) => {
            console.error('Error accepting task:', error);
        });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-4 py-3 flex items-center gap-2 rounded-t-2xl shrink-0">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <IoCheckmarkDone size={14} color="white" />
                </div>
                <h2 className="text-sm font-bold text-white tracking-wide m-0">New Task Details</h2>
                {taskData.length > 0 && (
                    <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white/30">
                        {taskData.length}
                    </span>
                )}
            </div>

            {/* Task List */}
            <div className="px-4 py-3 overflow-y-auto flex flex-col gap-3 max-h-[220px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-indigo-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">

                {loading && (
                    <div className="flex flex-col gap-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl animate-pulse">
                                <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0" />
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                                    <div className="h-2.5 bg-slate-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && taskData.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                            <IoCheckmarkDone size={22} className="text-indigo-300" />
                        </div>
                        <p className="text-sm font-semibold text-slate-400 m-0">No new tasks</p>
                        <p className="text-xs text-slate-300 m-0">All tasks have been accepted</p>
                    </div>
                )}

                {!loading && taskData.map((task: Task, index: number) => (
                    <div key={index}
                        className="flex items-center justify-between bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2.5 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-150 group">

                        {/* Avatar + Info */}
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 bg-gradient-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} text-white font-bold text-sm flex items-center justify-center rounded-xl shrink-0 shadow-sm`}>
                                {generateAbbreviation(task.assigned_by)}
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <p className="text-sm font-bold text-slate-800 m-0 truncate">{task.assigned_by || 'N/A'}</p>
                                <p className="text-xs text-slate-500 m-0 truncate">{task.task}</p>
                            </div>
                        </div>

                        {/* Accept Button */}
                        <button
                            onClick={() => handleAcceptTask(task.id, token)}
                            className="ml-3 w-8 h-8 flex items-center justify-center rounded-xl bg-white border-2 border-emerald-200 text-emerald-500 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-200 shrink-0 shadow-sm group-hover:scale-110"
                            title="Accept task"
                        >
                            <IoCheckmarkDone size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewTaskDetails;
