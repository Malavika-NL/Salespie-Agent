// import React from 'react';
// import styles from './EventCreation.module.css';
// import TaskCreationForm from './TaskCreationForm/TaskCreationForm';


// const EventCreation: React.FC = () => {
//     return (
//         <div className={styles.eventCreationContainer}>
//                 <div className={styles.financeInformation}>
//                     <TaskCreationForm />
//                 </div>
//                 <div className={styles.upcomingInfo}>
                    
//                 </div>
            
//         </div>
//     );
// };

// export default EventCreation;

// import React from "react";
// import TaskCreationForm from "./TaskCreationForm/TaskCreationForm";
// import UpcomingTasks from "./UpcommingTasks/UpcommingTasks";

// const TaskCreation: React.FC = () => {
//   return (
//     <div style={{
//       display: "grid",
//       gridTemplateColumns: "420px 1fr",
//       gap: "16px",
//       width: "100%",
//       alignItems: "start",
//       padding: "4px 0",
//     }}>
//       <div style={{
//         background: "#f8fafc",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         overflow: "hidden",
//       }}>
//         <TaskCreationForm />
//       </div>
//       <div style={{
//         background: "#f8fafc",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         minHeight: "320px",
//         overflow: "hidden",
//       }}>
//         <UpcomingTasks />
//       </div>
//     </div>
//   );
// };
// export default TaskCreation;

// import React from "react";
// // import TaskCreationForm from "./Taskcreationform/Taskcreationform";
// import TaskCreationForm from "./TaskCreationForm/TaskCreationForm";
// import UpcomingTasks from "./UpcommingTasks/UpcommingTasks";
// import styles from "./TaskCreation.module.css";

// const TaskCreation: React.FC = () => {
//   return (
//     <div className={styles.taskCreationContainer}>
//       <div className={styles.taskInformation}>
//         <TaskCreationForm />
//       </div>
//       <div className={styles.upcomingInfo}>
//         <UpcomingTasks />
//       </div>
//     </div>
//   );
// };

// export default TaskCreation;


import React from "react";
import TaskCreationForm from "./TaskCreationForm/TaskCreationForm";
import UpcomingTasks from "./UpcommingTasks/UpcommingTasks";

const TaskCreation: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5 w-full items-start">

      {/* Left — Task Creation Form */}
      <div className="min-h-0">
        <TaskCreationForm />
      </div>

      {/* Right — Upcoming Tasks Panel */}
      <div className="min-h-[320px]">
        <UpcomingTasks />
      </div>

    </div>
  );
};

export default TaskCreation;