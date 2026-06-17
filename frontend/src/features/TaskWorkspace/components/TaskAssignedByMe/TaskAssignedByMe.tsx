// import React, { useEffect } from 'react';
// import styles from './TaskAssignedByMe.module.css';
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../../../../app/store';
// import { fetchTaskAssignedByMeDetails } from './Slice/TaskAssignedByMeSlice';


// const TaskAssignedByMe: React.FC = () => {
//     const dispatch = useDispatch();

//     const {  Taskdata } = useSelector(
//         (state: RootState) => state.postCreateTask
//       );

//     useEffect(() => { 
//         dispatch(fetchTaskAssignedByMeDetails() as any);
//     }, [dispatch ,Taskdata ]);

//     const { data, loading, error } = useSelector((state: RootState) => state.fetchTaskAssignedByMeData);
    
    

//     const reversedData = data ? [...data].reverse() : [];
//     // console.log('reverse data' , reversedData)
//     console.log(' data' , data)
//     if (loading) return <div>Loading tasks...</div>;
//     if (error) return <div>Error loading tasks.</div>;

//     return (
//         <div className={styles.container}>
//             <div className={styles.heading}>Task Assigned by Me</div>
//             <div className={styles.tableContainer}>
//                 {/* Header Row */}
//                 <div className={styles.rowHeader}>
//                     <div className={styles.columnHeader}>Assign to</div>
//                     <div className={styles.columnHeader}>Task</div>
//                     <div className={styles.columnHeader}>Priority</div>
//                     <div className={styles.columnHeader}>End Date</div>
//                     <div className={styles.columnHeader}>Status</div>
//                 </div>

//                 {/* Task Rows */}
//                 {reversedData && reversedData.map((task: any, index: number) => (
//                     <div key={index} className={styles.taskRow}>
//                         <div className={styles.taskColumn}>{task.assignedto_username}</div>
//                         <div className={styles.taskColumn}>{task.task}</div>
//                         <div className={styles.taskColumn}
//                          style={{
//                             color:
//                                 task.priority.toLowerCase() === 'high'
//                                     ? 'red'
//                                     : task.priority.toLowerCase() === 'medium'
//                                     ? 'orange'
//                                     : 'green',
//                         }}
//                         >{task.priority}</div>
//                         <div className={styles.taskColumn}>{task.end_date}</div>
//                         <div className={styles.taskColumn}>{task.status}</div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default TaskAssignedByMe;



import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { fetchTaskAssignedByMeDetails } from './Slice/TaskAssignedByMeSlice';
import { Users } from 'lucide-react';

// ─── Style helpers ─────────────────────────────────────────────────────────────

const getPriorityClass = (priority: string) => {
    const map: Record<string, string> = {
        high:   'bg-red-100 text-red-700 border border-red-200',
        medium: 'bg-orange-100 text-orange-700 border border-orange-200',
        low:    'bg-emerald-100 text-emerald-700 border border-emerald-200',
    };
    return map[priority?.toLowerCase()] ?? 'bg-slate-100 text-slate-600 border border-slate-200';
};

const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
        'completed':   'bg-emerald-100 text-emerald-700 border border-emerald-200',
        'in progress': 'bg-blue-100 text-blue-700 border border-blue-200',
        'pending':     'bg-yellow-100 text-yellow-700 border border-yellow-200',
    };
    return map[status?.toLowerCase()] ?? 'bg-slate-100 text-slate-600 border border-slate-200';
};

// ─── Component ────────────────────────────────────────────────────────────────

const TaskAssignedByMe: React.FC = () => {
    const dispatch = useDispatch();

    const { Taskdata } = useSelector((state: RootState) => state.postCreateTask);

    useEffect(() => {
        dispatch(fetchTaskAssignedByMeDetails() as any);
    }, [dispatch, Taskdata]);

    const { data, loading, error } = useSelector((state: RootState) => state.fetchTaskAssignedByMeData);

    const reversedData = data ? [...data].reverse() : [];
    console.log('data', data);

    return (
        <div className="flex flex-col h-full">

            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-4 py-3 flex items-center gap-2 rounded-t-2xl shrink-0">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users size={13} color="white" />
                </div>
                <h2 className="text-sm font-bold text-white tracking-wide m-0">Task Assigned by Me</h2>
                {data && data.length > 0 && (
                    <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white/30">
                        {data.length}
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="px-4 py-3 overflow-y-auto flex flex-col gap-2 max-h-[220px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-indigo-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col gap-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="grid grid-cols-5 gap-2 p-2.5 bg-slate-50 rounded-xl animate-pulse">
                                {[...Array(5)].map((_, j) => <div key={j} className="h-3 bg-slate-200 rounded" />)}
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="flex items-center justify-center py-8 text-sm text-red-500 font-semibold">
                        Error loading tasks.
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Table Header */}
                        <div className="grid grid-cols-5 gap-2 px-2 py-2 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/80 shrink-0">
                            <div className="text-center">Assign To</div>
                            <div className="text-center">Task</div>
                            <div className="text-center">Priority</div>
                            <div className="text-center">End Date</div>
                            <div className="text-center">Status</div>
                        </div>

                        {/* Empty state */}
                        {reversedData.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 gap-2">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                    <Users size={20} className="text-indigo-300" />
                                </div>
                                <p className="text-sm font-semibold text-slate-400 m-0">No tasks assigned yet</p>
                            </div>
                        )}

                        {/* Task Rows */}
                        {reversedData.map((task: any, index: number) => (
                            <div
                                key={index}
                                className="grid grid-cols-5 gap-2 px-2 py-2.5 border-2 border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/20 transition-all duration-150"
                            >
                                <div className="text-center text-xs font-semibold text-slate-700 truncate">{task.assignedto_username}</div>
                                <div className="text-center text-xs font-semibold text-slate-700 truncate">{task.task}</div>
                                <div className="flex justify-center">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getPriorityClass(task.priority)}`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <div className="text-center text-xs font-mono text-slate-500">{task.end_date}</div>
                                <div className="flex justify-center">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusClass(task.status)}`}>
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskAssignedByMe;
