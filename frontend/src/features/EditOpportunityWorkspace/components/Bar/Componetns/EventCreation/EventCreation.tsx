// import React from 'react';
// import styles from './EventCreation.module.css';
// import EventCreationForm from './EventCreationForm/EventCreationForm';
// import UpcomingEvents from './UpcommingEvents/UpcommingEvents';

// const EventCreation: React.FC = () => {
//     return (
//         <div className={styles.eventCreationContainer}>
//                 <div className={styles.financeInformation}>
//                     <EventCreationForm />
//                 </div>
//                 <div className={styles.upcomingInfo}>
//                     <UpcomingEvents />
//                 </div>
            
//         </div>
//     );
// };

// export default EventCreation;

// import React from "react";
// import EventCreationForm from "./EventCreationForm/EventCreationForm";
// import UpcomingEvents from "./UpcommingEvents/UpcommingEvents";

// const EventCreation: React.FC = () => {
//   return (
//     // <div className="flex gap-0 w-full min-h-[420px]">
//     //   {/* Left — Event Creation Form */}
//     //   <div className="w-[420px] shrink-0 border border-gray-200 rounded-lg bg-white">
//     //     <EventCreationForm />
//     //   </div>

//     //   {/* Right — Upcoming Events */}
//     //   <div className="flex-1 border border-gray-200 border-l-0 rounded-r-lg bg-white">
//     //     <UpcomingEvents />
//     //   </div>
//     // </div>
//     <div style={{
//         display: "grid",
//         gridTemplateColumns: "420px 1fr",
//         gap: "16px",
//         width: "100%",
//         alignItems: "start",
//         padding: "4px 0",
//       }}>
//         {/* Left – creation form */}
//         <div style={{
//           background: "#f8fafc",
//           border: "1px solid #e5e7eb",
//           borderRadius: "12px",
//           overflow: "hidden",
//         }}>
//           <EventCreationForm />
//         </div>
  
//         {/* Right – upcoming events panel */}
//         <div style={{
//           background: "#f8fafc",
//           border: "1px solid #e5e7eb",
//           borderRadius: "12px",
//           minHeight: "320px",
//           overflow: "hidden",
//         }}>
//           <UpcomingEvents />
//         </div>
//       </div>
//   );
// };

// export default EventCreation;



import React from "react";
import EventCreationForm from "./EventCreationForm/EventCreationForm";
import UpcomingEvents from "./UpcommingEvents/UpcommingEvents";

const EventCreation: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5 w-full items-start">

      {/* Left — Event Creation Form */}
      <div className="min-h-0">
        <EventCreationForm />
      </div>

      {/* Right — Upcoming Events Panel */}
      <div className="min-h-[320px]">
        <UpcomingEvents />
      </div>

    </div>
  );
};

export default EventCreation;