// import React from 'react';
// import styles from './TaskCreation.module.css';
// import TaskCreationForm from './TaskCreationForm/TaskCreationForm';
// import UpcommingTasks from './UpcommingTasks/UpcommingTasks';


// const TaskCreation: React.FC = () => {
//     return (
//         <div className={styles.eventCreationContainer}>
//                 <div className={styles.financeInformation}>
//                     <TaskCreationForm />
//                 </div>
//                 <div className={styles.upcomingInfo}>
//                     <UpcommingTasks />
//                 </div>
            
//         </div>
//     );
// };

// export default TaskCreation;



// import React from "react";
// import TaskCreationForm from "./TaskCreationForm/TaskCreationForm";
// import UpcommingTasks from './UpcommingTasks/UpcommingTasks';

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
//       {/* Left – creation form */}
//       <div style={{
//         background: "#f8fafc",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         overflow: "hidden",
//       }}>
//         <TaskCreationForm />
//       </div>

//       {/* Right – upcoming tasks panel */}
//       <div style={{
//         background: "#f8fafc",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         minHeight: "320px",
//         overflow: "hidden",
//       }}>
//         <UpcommingTasks />
//       </div>
//     </div>
//   );
// };

// export default TaskCreation;


import React from "react";
import TaskCreationForm from "./TaskCreationForm/TaskCreationForm";
import UpcommingTasks from './UpcommingTasks/UpcommingTasks';

const TaskCreation: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5 w-full items-start">

      {/* Left — Task Creation Form */}
      <div className="min-h-0">
        <TaskCreationForm />
      </div>

      {/* Right — Upcoming Tasks Panel */}
      <div className="min-h-[320px]">
        <UpcommingTasks />
      </div>

    </div>
  );
};

export default TaskCreation;
