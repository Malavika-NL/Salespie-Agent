// import React, { useEffect, useState } from 'react';
// import { useDrag, useDrop, DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import styles from './TaskStatus.module.css';
// import { FiPlusCircle } from "react-icons/fi";
// import { CgArrowsExpandRight } from "react-icons/cg";
// import { FaChevronCircleRight } from "react-icons/fa";
// import priorityimg from '../../../images/priority 1.png';
// import PopupForm from '../PopupForm/PopupForm';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchTaskDetails } from '../NewTaskDetails/TaskDetails/TaskDetails';
// import type { RootState } from '../../../../app/store';
// import { updateStatus, updateTaskWorkspaceStatusData } from './Slice/TaskStatusSlice';


// const ItemType = {
//     TASK: 'task',
// };

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


// const TaskStatus: React.FC = () => {
//     const dispatch = useDispatch();
//     const { data, loading, error } = useSelector((state: RootState) => state.fetchTaskDetailsData);
//     console.log('task data',data)
//     const [taskData, setTaskData] = useState<Task[]>([]);
//     console.log('tasktaskData',taskData)
//     const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//     const [showForm, setShowForm] = useState(false);
//     const token = useSelector((state: RootState) => state.userLoginAuth?.user?.tokens.access) || localStorage.getItem('token');
//     const [reload, setReload] = useState(false);
//     // console.log('taskdata', taskData)
//     useEffect(() => {
//         dispatch(fetchTaskDetails() as any);
//         console.log('reloaded')
//     }, [dispatch,reload]);

//     useEffect(() => {
//         if (data) {
//             setTaskData(data); // Directly setting task data from API response
//         }
//     }, [data]);

//     // console.log('current list' , taskData)

//     const updateTaskStatus = (id: number,outcome : string, newStatus: string) => {
//         setTaskData((prevTasks) =>
//             prevTasks.map((task) =>
//                 task.id === id ? { ...task, status: newStatus } : task
//             )
//         );
       
      
//         const updateData = {
//             id: id,
//             status: newStatus,
//             outcome: outcome,
//         };
//         dispatch(updateTaskWorkspaceStatusData(updateData) as any);
//         setReload((prev) => !prev);
      
//     };

//     const updateTaskDetails = (updatedTask: Task) => {
//         setTaskData((prevTasks) =>
//             prevTasks.map((task) =>
//                 task.id === updatedTask.id ? updatedTask : task
//             )
//         );
    
//         console.log( 'updtated task data', updatedTask)
      
//         const updateData = {
//             id: updatedTask.id,
//             status: updatedTask.status,
//             outcome: updatedTask.outcome,
//         };
//         dispatch(updateTaskWorkspaceStatusData(updateData) as any);
//         setReload((prev) => !prev);
    
//         setShowForm(false);
//     };
    
//     const today = new Date();
//     const upcomingDate = new Date();
//     upcomingDate.setDate(today.getDate() + 3);

//     const upcomingTasks = taskData.filter(
//         (task) =>
//             new Date(task.end_date).toDateString() === upcomingDate.toDateString() &&
//             task.status !== 'Completed' &&
//             task.status !== 'In Progress' &&
//             task.is_accepted === 'yes' 
//     );

//     const overdueTasks = taskData.filter(
//         (task) => new Date(task.end_date) < today && task.status !== 'Completed'  &&  task.is_accepted === 'yes' 
//     );

//     return (
//         <div className={styles.taskStatus}>
//             <div className={styles.heading}>Task Status</div>
//             <DndProvider backend={HTML5Backend}>
//                 <div className={styles.taskcontent}>
//                     <TaskContainer
//                         title="To-Do"
//                         tasks={taskData.filter(
//                             (task) =>
//                                 task.status === 'Pending' &&
//                                 task.is_accepted === 'yes' &&  // Ensure task is accepted
//                                 !upcomingTasks.some((up) => up.id === task.id)
//                         ).reverse()}
//                         onDrop={(id, outcome) => updateTaskStatus(id,outcome, 'Pending')}
//                         onTaskClick={(task) => {
//                             setSelectedTask(task);
//                             setShowForm(true);
//                         }}
//                     />

//                     <TaskContainer
//                         title="In Progress"
//                         tasks={taskData.filter((task) => task.status === 'In Progress' &&  task.is_accepted === 'yes'  ).reverse()}
//                         onDrop={(id, outcome) => updateTaskStatus(id, outcome, 'In Progress')}
//                         onTaskClick={(task) => { setSelectedTask(task); setShowForm(true); }}
//                     />
//                     <TaskList title="Upcoming Tasks" tasks={upcomingTasks.reverse()} />
//                     {/* <TaskList title="Overdue Tasks" tasks={overdueTasks} /> */}
                    
//                     <TaskContainer
//                         title="Overdue"
//                         tasks={overdueTasks.reverse()}
//                         onDrop={(id, outcome) => updateTaskStatus(id, outcome, 'Overdue')}
//                         onTaskClick={(task) => { setSelectedTask(task); setShowForm(true); }}
//                     />
//                 </div>
//             </DndProvider>

//             {showForm && selectedTask && (
//                 <PopupForm
//                     task={selectedTask}
//                     onSave={updateTaskDetails}
//                     onClose={() => setShowForm(false)}
//                 />
//             )}
//         </div>
//     );
// };

// interface TaskContainerProps {
//     title: string;
//     tasks: Task[];
//     onDrop: (id: number, outcome: string) => void;  // Accept id and outcome
//     droppable?: boolean;
//     onTaskClick: (task: Task) => void;
// }

// const TaskContainer: React.FC<TaskContainerProps> = ({ title, tasks, onDrop, droppable = true, onTaskClick }) => {
//     const [, drop] = useDrop({
//         accept: ItemType.TASK,
//         canDrop: () => droppable,
//         drop: (item: { id: number; outcome: string }) => {
//             onDrop(item.id, item.outcome);
//             // console.log( 'itemssdfsdj', item)
//         },
//     });

//     return (
//         <div ref={drop as any} className={styles.taskContainer}>
//             <div className={styles.title}>
//                 <div>{title}</div>
//                 <div className={styles.iconcontainer}>
//                     <FiPlusCircle className={styles.icon} />
//                     <CgArrowsExpandRight className={styles.icon} />
//                 </div>
//             </div>
//             <div className={styles.container}>
//                 {tasks.map((task) => (
//                     <TaskCard
//                         key={task.id}
//                         task={task}
//                         onTaskClick={() => onTaskClick(task)}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };


// interface TaskListProps {
//     title: string;
//     tasks: Task[];
// }
// const TaskList: React.FC<TaskListProps> = ({ title, tasks }) => (
//     <div className={styles.taskList}>
//         <div className={styles.title}>
//             <div>{title}</div>
//             <div className={styles.iconcontainer}>
//                 <FiPlusCircle className={styles.icon} />
//                 <CgArrowsExpandRight className={styles.icon} />
//             </div>
//         </div>
//         <div className={styles.container}>
//             {tasks.map((task) => (
//                 <TaskCard key={task.id} task={task} />
//             ))}
//         </div>
//     </div>
// );

// interface TaskCardProps {
//     task: Task;
//     onTaskClick?: () => void;
// }
// type TaskStatusType =  'Pending' | 'In Progress' | 'Upcoming' | 'Overdue' ;

// const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskClick }) => {
//     const [, drag] = useDrag({
//         type: ItemType.TASK,
//         item: { id: task.id, outcome: task.outcome },
//     });

//     // Define background colors for each status
//     const statusColors: Record<TaskStatusType, string> = {
        
//         'Pending': '#D7C8FD',     // Pending status color
//         'In Progress': '#CEE594', // In Progress status color
//         'Upcoming': '#96B2FF',    // Upcoming status color
//         'Overdue': '#F5EBAB',     // Overdue status color (same as "Pending")
//          // Completed status color (can be changed if needed)
//     };

//     // Use the status to determine the background color
//     const backgroundColor = statusColors[task.status as TaskStatusType] || '#FFFFFF';  // Default to white if no match

//     return (
//         <div
//             className={styles.taskCardDetails}
//             ref={drag as any}
           
//             style={{
//                 cursor: 'pointer',
//                 backgroundColor: backgroundColor,  // Use the background color based on status
//             }}
//         >
//             <div className={styles.taskrow}>
//                 <p className={styles.taskhead}>{task.task}</p>
//                 <p><FaChevronCircleRight  onClick={onTaskClick} /></p>
//             </div>
//             <div className={styles.taskgroup}>
//                 <div className={styles.taskrow}>
//                     <p className={styles.tasksubhead}>Start Date: {task.start_date}</p>
//                     <img src={priorityimg} alt='priorityimg' className={styles.priorityimg} />
//                 </div>
//                 <div className={styles.taskrow}>
//                     <p className={styles.tasksubhead}>End Date: {task.end_date}</p>
//                     <p
//                         className={styles.tasksubhead}
//                         style={{
//                             color:
//                                 task.priority.toLowerCase() === 'high'
//                                     ? 'red'
//                                     : task.priority.toLowerCase() === 'medium'
//                                     ? 'orange'
//                                     : 'green',
//                         }}
//                     >
//                         {task.priority}
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };



// export default TaskStatus;

import React, { useEffect, useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiPlusCircle } from "react-icons/fi";
import { CgArrowsExpandRight } from "react-icons/cg";
import { FaChevronCircleRight } from "react-icons/fa";
import priorityimg from '../../../images/priority 1.png';
import PopupForm from '../PopupForm/PopupForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTaskDetails } from '../NewTaskDetails/TaskDetails/TaskDetails';
import type { RootState } from '../../../../app/store';
import { updateStatus, updateTaskWorkspaceStatusData } from './Slice/TaskStatusSlice';
import { CheckSquare } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const ItemType = { TASK: 'task' };

// ─── Types ────────────────────────────────────────────────────────────────────

interface Task {
    id: number; task: string; description: string; priority: string;
    start_date: string; end_date: string; assignedto_username: string;
    status: string; outcome: string; last_update_date: string;
    is_accepted: string; assigned_by: string;
}

type TaskStatusType = 'Pending' | 'In Progress' | 'Upcoming' | 'Overdue';

// ─── Column config ────────────────────────────────────────────────────────────

const COLUMN_CONFIG: Record<string, { gradient: string; border: string; dot: string; cardBg: string; cardBorder: string }> = {
    'To-Do':          { gradient: 'from-violet-600 to-purple-500',  border: 'border-violet-200',  dot: 'bg-violet-500',  cardBg: 'bg-violet-50',  cardBorder: 'border-violet-200' },
    'In Progress':    { gradient: 'from-blue-600 to-cyan-500',      border: 'border-blue-200',    dot: 'bg-blue-500',    cardBg: 'bg-blue-50',    cardBorder: 'border-blue-200'   },
    'Upcoming Tasks': { gradient: 'from-indigo-600 to-blue-500',    border: 'border-indigo-200',  dot: 'bg-indigo-500',  cardBg: 'bg-indigo-50',  cardBorder: 'border-indigo-200' },
    'Overdue':        { gradient: 'from-amber-500 to-orange-400',   border: 'border-amber-200',   dot: 'bg-amber-500',   cardBg: 'bg-amber-50',   cardBorder: 'border-amber-200'  },
};

const getPriorityClass = (priority: string) => {
    const map: Record<string, string> = {
        high:   'text-red-600 font-bold',
        medium: 'text-orange-500 font-bold',
        low:    'text-emerald-600 font-bold',
    };
    return map[priority?.toLowerCase()] ?? 'text-slate-500';
};

// ─── TaskCard ─────────────────────────────────────────────────────────────────

interface TaskCardProps { task: Task; onTaskClick?: () => void; colTitle?: string; }

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskClick, colTitle = 'To-Do' }) => {
    const [, drag] = useDrag({ type: ItemType.TASK, item: { id: task.id, outcome: task.outcome } });
    const cfg = COLUMN_CONFIG[colTitle] ?? COLUMN_CONFIG['To-Do'];

    return (
        <div
            ref={drag as any}
            className={`${cfg.cardBg} border-2 ${cfg.cardBorder} rounded-xl p-3 mb-2.5 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-150`}
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs font-bold text-slate-800 leading-tight m-0 flex-1">{task.task}</p>
                {onTaskClick && (
                    <button onClick={onTaskClick} className="text-slate-400 hover:text-indigo-600 transition-colors shrink-0 mt-0.5">
                        <FaChevronCircleRight size={14} />
                    </button>
                )}
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">Start: {task.start_date}</span>
                    <img src={priorityimg} alt="priority" className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">End: {task.end_date}</span>
                    <span className={`text-[10px] ${getPriorityClass(task.priority)}`}>{task.priority}</span>
                </div>
            </div>
        </div>
    );
};

// ─── TaskContainer (droppable) ────────────────────────────────────────────────

interface TaskContainerProps {
    title: string; tasks: Task[];
    onDrop: (id: number, outcome: string) => void;
    droppable?: boolean;
    onTaskClick: (task: Task) => void;
}

const TaskContainer: React.FC<TaskContainerProps> = ({ title, tasks, onDrop, droppable = true, onTaskClick }) => {
    const [{ isOver }, drop] = useDrop({
        accept: ItemType.TASK,
        canDrop: () => droppable,
        drop: (item: { id: number; outcome: string }) => { onDrop(item.id, item.outcome); },
        collect: monitor => ({ isOver: monitor.isOver() }),
    });

    const cfg = COLUMN_CONFIG[title] ?? COLUMN_CONFIG['To-Do'];

    return (
        <div ref={drop as any} className={`flex flex-col rounded-2xl border-2 ${cfg.border} shadow-md overflow-hidden transition-all duration-200 ${isOver ? 'ring-2 ring-indigo-400 ring-offset-2 scale-[1.01]' : ''}`}>
            {/* Column Header */}
            <div className={`bg-gradient-to-r ${cfg.gradient} px-3 py-2.5 flex items-center justify-between shrink-0`}>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-white/60`} />
                    <span className="text-xs font-bold text-white tracking-wide">{title}</span>
                    {tasks.length > 0 && (
                        <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white/30">
                            {tasks.length}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    <FiPlusCircle size={13} className="text-white/70 hover:text-white cursor-pointer transition-colors" />
                    <CgArrowsExpandRight size={13} className="text-white/70 hover:text-white cursor-pointer transition-colors" />
                </div>
            </div>

            {/* Cards */}
            <div className="flex-1 px-3 py-2 overflow-y-auto min-h-[180px] max-h-[420px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                {tasks.length === 0 ? (
                    <div className="flex items-center justify-center h-full py-8">
                        <p className="text-xs text-slate-300 font-semibold">Drop tasks here</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <TaskCard key={task.id} task={task} onTaskClick={() => onTaskClick(task)} colTitle={title} />
                    ))
                )}
            </div>
        </div>
    );
};

// ─── TaskList (non-droppable) ─────────────────────────────────────────────────

interface TaskListProps { title: string; tasks: Task[]; }

const TaskList: React.FC<TaskListProps> = ({ title, tasks }) => {
    const cfg = COLUMN_CONFIG[title] ?? COLUMN_CONFIG['Upcoming Tasks'];

    return (
        <div className={`flex flex-col rounded-2xl border-2 ${cfg.border} shadow-md overflow-hidden`}>
            <div className={`bg-gradient-to-r ${cfg.gradient} px-3 py-2.5 flex items-center justify-between shrink-0`}>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                    <span className="text-xs font-bold text-white tracking-wide">{title}</span>
                    {tasks.length > 0 && (
                        <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white/30">
                            {tasks.length}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    <FiPlusCircle size={13} className="text-white/70 hover:text-white cursor-pointer transition-colors" />
                    <CgArrowsExpandRight size={13} className="text-white/70 hover:text-white cursor-pointer transition-colors" />
                </div>
            </div>
            <div className="flex-1 px-3 py-2 overflow-y-auto min-h-[120px] max-h-[420px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                {tasks.length === 0 ? (
                    <div className="flex items-center justify-center h-full py-8">
                        <p className="text-xs text-slate-300 font-semibold">No upcoming tasks</p>
                    </div>
                ) : (
                    tasks.map(task => <TaskCard key={task.id} task={task} colTitle={title} />)
                )}
            </div>
        </div>
    );
};

// ─── TaskStatus (main) ────────────────────────────────────────────────────────

const TaskStatus: React.FC = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state: RootState) => state.fetchTaskDetailsData);
    console.log('task data', data);
    const [taskData, setTaskData] = useState<Task[]>([]);
    console.log('tasktaskData', taskData);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showForm, setShowForm] = useState(false);
    const token = useSelector((state: RootState) => state.userLoginAuth?.user?.tokens.access) || localStorage.getItem('token');
    const [reload, setReload] = useState(false);

    useEffect(() => {
        dispatch(fetchTaskDetails() as any);
        console.log('reloaded');
    }, [dispatch, reload]);

    useEffect(() => {
        if (data) setTaskData(data);
    }, [data]);

    const updateTaskStatus = (id: number, outcome: string, newStatus: string) => {
        setTaskData(prev => prev.map(task => task.id === id ? { ...task, status: newStatus } : task));
        const updateData = { id, status: newStatus, outcome };
        dispatch(updateTaskWorkspaceStatusData(updateData) as any);
        setReload(prev => !prev);
    };

    const updateTaskDetails = (updatedTask: Task) => {
        setTaskData(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
        console.log('updtated task data', updatedTask);
        const updateData = { id: updatedTask.id, status: updatedTask.status, outcome: updatedTask.outcome };
        dispatch(updateTaskWorkspaceStatusData(updateData) as any);
        setReload(prev => !prev);
        setShowForm(false);
    };

    const today = new Date();
    const upcomingDate = new Date();
    upcomingDate.setDate(today.getDate() + 3);

    const upcomingTasks = taskData.filter(task =>
        new Date(task.end_date).toDateString() === upcomingDate.toDateString() &&
        task.status !== 'Completed' && task.status !== 'In Progress' && task.is_accepted === 'yes'
    );

    const overdueTasks = taskData.filter(task =>
        new Date(task.end_date) < today && task.status !== 'Completed' && task.is_accepted === 'yes'
    );

    return (
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md overflow-hidden">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-3 flex items-center gap-3">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckSquare size={15} color="white" />
                </div>
                <h2 className="text-sm font-bold text-white tracking-wide m-0">Task Status</h2>
                <div className="ml-auto flex items-center gap-2">
                    {[
                        { label: 'To-Do',       color: 'bg-violet-400' },
                        { label: 'In Progress', color: 'bg-blue-400'   },
                        { label: 'Upcoming',    color: 'bg-indigo-400' },
                        { label: 'Overdue',     color: 'bg-amber-400'  },
                    ].map(({ label, color }) => (
                        <div key={label} className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${color}`} />
                            <span className="text-[10px] text-white/70 font-semibold">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Kanban Board */}
            <div className="p-4">
                <DndProvider backend={HTML5Backend}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <TaskContainer
                            title="To-Do"
                            tasks={taskData.filter(task =>
                                task.status === 'Pending' && task.is_accepted === 'yes' &&
                                !upcomingTasks.some(up => up.id === task.id)
                            ).reverse()}
                            onDrop={(id, outcome) => updateTaskStatus(id, outcome, 'Pending')}
                            onTaskClick={task => { setSelectedTask(task); setShowForm(true); }}
                        />
                        <TaskContainer
                            title="In Progress"
                            tasks={taskData.filter(task => task.status === 'In Progress' && task.is_accepted === 'yes').reverse()}
                            onDrop={(id, outcome) => updateTaskStatus(id, outcome, 'In Progress')}
                            onTaskClick={task => { setSelectedTask(task); setShowForm(true); }}
                        />
                        <TaskList title="Upcoming Tasks" tasks={upcomingTasks.reverse()} />
                        <TaskContainer
                            title="Overdue"
                            tasks={overdueTasks.reverse()}
                            onDrop={(id, outcome) => updateTaskStatus(id, outcome, 'Overdue')}
                            onTaskClick={task => { setSelectedTask(task); setShowForm(true); }}
                        />
                    </div>
                </DndProvider>
            </div>

            {showForm && selectedTask && (
                <PopupForm task={selectedTask} onSave={updateTaskDetails} onClose={() => setShowForm(false)} />
            )}
        </div>
    );
};

export default TaskStatus;