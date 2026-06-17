// import React, { useState } from 'react';
// import styles from './TaskWorkspace.module.css';
// import NewTaskDetails from './components/NewTaskDetails/NewTaskDetails';
// import TodaysTasks from './components/TodaysTasks/TodaysTasks';
// import TaskAssignedByMe from './components/TaskAssignedByMe/TaskAssignedByMe';
// import TaskStatus from './components/TaskStatus/TaskStatus';
// import Navbar from '../UserDashboard/components/navbar/navbar';
// import UserSidebar from '../UserHome/components/UserSidebar/userSidebar';
// import Header from './components/Header/Header';

// const TaskWorkspace: React.FC = () => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     return (
//         <>


//             <div className={styles.mainContent}>
//                 <Header />
//                 <div className={styles.taskWorkspace}>
//                     <div className={styles.firstDiv}><NewTaskDetails /></div>
//                     <div className={styles.secondDiv}><TodaysTasks /></div>
//                     <div className={styles.thirdDiv}><TaskAssignedByMe /></div>
//                 </div>
//                 <TaskStatus />
//             </div>

//         </>
//     );
// };

// export default TaskWorkspace;



import React, { useState } from 'react';
import NewTaskDetails from './components/NewTaskDetails/NewTaskDetails';
import TodaysTasks from './components/TodaysTasks/TodaysTasks';
import TaskAssignedByMe from './components/TaskAssignedByMe/TaskAssignedByMe';
import TaskStatus from './components/TaskStatus/TaskStatus';
import Header from './components/Header/Header';

const TaskWorkspace: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background:
                    "radial-gradient(ellipse 60% 45% at 0% 0%, rgba(2,132,199,0.16) 0%, transparent 56%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(245,158,11,0.12) 0%, transparent 62%), linear-gradient(180deg, #f0fdfa 0%, #eff6ff 52%, #f8fafc 100%)",
            }}
        >

            {/* ── Page Content ── */}
            <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto">

                {/* Header */}
                <Header />

                {/* ── Top Three-Panel Row ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[35%_25%_1fr] gap-4 w-full items-stretch">

                    {/* New Task Details */}
                    <div className="rounded-2xl p-[2px] bg-gradient-to-b from-sky-500/40 to-cyan-400/30 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden h-full min-h-[200px] max-h-[260px]">
                        <div className="bg-white/85 backdrop-blur-sm rounded-2xl h-full overflow-hidden">
                            <NewTaskDetails />
                        </div>
                    </div>

                    {/* Today's Tasks */}
                    <div className="rounded-2xl p-[2px] bg-gradient-to-b from-cyan-500/35 to-emerald-400/30 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden h-full min-h-[200px] max-h-[260px]">
                        <div className="bg-white/85 backdrop-blur-sm rounded-2xl h-full overflow-hidden">
                            <TodaysTasks />
                        </div>
                    </div>

                    {/* Task Assigned By Me */}
                    <div className="rounded-2xl p-[2px] bg-gradient-to-b from-emerald-500/35 to-sky-500/30 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden h-full min-h-[200px] max-h-[260px]">
                        <div className="bg-white/85 backdrop-blur-sm rounded-2xl h-full overflow-hidden">
                            <TaskAssignedByMe />
                        </div>
                    </div>

                </div>

                {/* ── Task Status Section ── */}
                <div className="w-full rounded-2xl p-[2px] bg-gradient-to-r from-sky-500/35 to-emerald-500/30">
                    <div className="bg-white/85 backdrop-blur-sm rounded-2xl overflow-hidden">
                        <TaskStatus />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TaskWorkspace;
