// import React, { useEffect, useState } from 'react';
// import { FaAngleRight } from 'react-icons/fa6';
// import { useDispatch, useSelector } from 'react-redux';

// import styles from './TodaysTasks.module.css';
// import priorityimg from '../../../images/priority 1.png';
// import { fetchTaskDetails } from '../NewTaskDetails/TaskDetails/TaskDetails';
// import type { RootState } from '../../../../app/store';
// import { fetchTodaysTasksData } from './TodaysTasksSlice/TodaysTasksSlice';

// interface Task {
//     id: number;
//     task: string;
//     assignedto: number;
//     priority: string;
//     start_date: string;
//     end_date: string;
//     status: string;
//     outcome: string;
//     last_update_date: string;
//     is_accepted: string;
//     assigned_by:string;
// }

// const TodaysTasks: React.FC = () => {
//     const dispatch = useDispatch();
//     const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

//     const { data, loading, error } = useSelector((state: RootState) => state.TodaysTasksData);

//     useEffect(() => {
//         dispatch(fetchTodaysTasksData() as any);
//     }, [dispatch]);

  
//     if (loading) return <p>Loading tasks...</p>;
//     if (error) return <p>Error fetching tasks!</p>;

//     return (
//         <div className={styles.todaysTasks}>
//             <div className={styles.headerSection}>
//                 <div className={styles.taskHeader}>
//                     Today's Tasks ({filteredTasks.length})
//                 </div>
//                 <div className={styles.taskDate}>
//                     Manage <FaAngleRight className={styles.icon} />
//                 </div>
//             </div>

//             <div className={styles.taskContainer}>
//                 {data.map((task, index) => (
//                     <div key={index} className={styles.taskCard}>
//                         <div className={styles.topcontent}>
//                             <p className={styles.taskTitle}>{task.task}</p>
//                             <img src={priorityimg} alt='priorityimg' className={styles.priorityimg} />
//                         </div>

//                         <div className={styles.bottomcontent}>
//                             <p className={styles.taskAssigned}>
//                                 Assigned by: <span>{task.assigned_by}</span>
//                             </p>
//                             <p className={styles.taskPriority}  style={{
//                             color:
//                                 task.priority.toLowerCase() === 'high'
//                                     ? 'red'
//                                     : task.priority.toLowerCase() === 'medium'
//                                     ? 'orange'
//                                     : 'green',
//                         }}>{task.priority}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default TodaysTasks;






import React, { useEffect, useState } from 'react';
import { FaAngleRight } from 'react-icons/fa6';
import { Calendar } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import priorityimg from '../../../images/priority 1.png';
import { fetchTaskDetails } from '../NewTaskDetails/TaskDetails/TaskDetails';
import type { RootState } from '../../../../app/store';
import { fetchTodaysTasksData } from './TodaysTasksSlice/TodaysTasksSlice';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Task {
    id: number; task: string; assignedto: number; priority: string;
    start_date: string; end_date: string; status: string; outcome: string;
    last_update_date: string; is_accepted: string; assigned_by: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getPriorityClass = (priority: string) => {
    const map: Record<string, string> = {
        high:   'text-red-600 font-bold',
        medium: 'text-orange-500 font-bold',
        low:    'text-emerald-600 font-bold',
    };
    return map[priority?.toLowerCase()] ?? 'text-slate-500';
};

const getPriorityBg = (priority: string) => {
    const map: Record<string, string> = {
        high:   'bg-red-50 border-red-200',
        medium: 'bg-orange-50 border-orange-200',
        low:    'bg-emerald-50 border-emerald-200',
    };
    return map[priority?.toLowerCase()] ?? 'bg-slate-50 border-slate-200';
};

// ─── Component ────────────────────────────────────────────────────────────────

const TodaysTasks: React.FC = () => {
    const dispatch = useDispatch();
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

    const { data, loading, error } = useSelector((state: RootState) => state.TodaysTasksData);

    useEffect(() => {
        dispatch(fetchTodaysTasksData() as any);
    }, [dispatch]);

    if (loading) return (
        <div className="flex flex-col h-full">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-500 px-4 py-3 flex items-center gap-2 rounded-t-2xl shrink-0">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center"><Calendar size={13} color="white" /></div>
                <h2 className="text-sm font-bold text-white m-0">Today's Tasks</h2>
            </div>
            <div className="flex-1 px-4 py-3 flex flex-col gap-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col h-full">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-500 px-4 py-3 rounded-t-2xl">
                <h2 className="text-sm font-bold text-white m-0">Today's Tasks</h2>
            </div>
            <div className="flex-1 flex items-center justify-center text-sm text-red-500 font-semibold">Error fetching tasks!</div>
        </div>
    );

    return (
        <div className="flex flex-col h-full">

            {/* Card Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-500 px-4 py-3 flex items-center justify-between gap-2 rounded-t-2xl shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                        <Calendar size={13} color="white" />
                    </div>
                    <h2 className="text-sm font-bold text-white tracking-wide m-0">
                        Today's Tasks
                        {data.length > 0 && (
                            <span className="ml-2 bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white/30">
                                {data.length}
                            </span>
                        )}
                    </h2>
                </div>
                <button className="flex items-center gap-1 text-white/80 hover:text-white text-xs font-semibold transition-colors cursor-pointer bg-transparent border-none">
                    Manage <FaAngleRight size={10} />
                </button>
            </div>

            {/* Task List */}
            <div className="px-4 py-3 overflow-y-auto flex flex-col gap-2.5 max-h-[220px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-cyan-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">

                {/* Empty state */}
                {(!data || data.length === 0) && (
                    <div className="flex flex-col items-center justify-center flex-1 gap-2 py-8">
                        <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center">
                            <Calendar size={22} className="text-cyan-300" />
                        </div>
                        <p className="text-sm font-semibold text-slate-400 m-0">No tasks for today</p>
                        <p className="text-xs text-slate-300 m-0">Enjoy your free time!</p>
                    </div>
                )}

                {data.map((task: Task, index: number) => (
                    <div
                        key={index}
                        className={`border-2 ${getPriorityBg(task.priority)} rounded-xl px-3 py-2.5 hover:shadow-md transition-all duration-150`}
                    >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold text-slate-800 leading-tight m-0 flex-1">{task.task}</p>
                            <img src={priorityimg} alt="priority" className="w-4 h-4 shrink-0 mt-0.5" />
                        </div>

                        {/* Bottom row */}
                        <div className="flex items-center justify-between mt-1.5">
                            <p className="text-[10px] text-slate-500 font-medium m-0">
                                By: <span className="font-semibold text-slate-600">{task.assigned_by}</span>
                            </p>
                            <span className={`text-[10px] ${getPriorityClass(task.priority)}`}>
                                {task.priority}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodaysTasks;
