// import React from "react";
// import { useSelector } from "react-redux";
// import styles from "./UpcommingEvents.module.css";
// import Cards from "./Cards";
// import type { RootState } from "../../../../../../../app/store";

// const UpcomingEvents: React.FC = () => {
//     // Fetch formData from Redux store
//     const { formData } = useSelector((state: RootState) => state.EditAdminOpportunityWorkspaceData);
//     const events = formData?.opportunity_event || [];

//     // Function to chunk data into rows of 3 cards
//     const chunkData = (data: typeof events, size: number) => {
//         const chunks = [];
//         for (let i = 0; i < data.length; i += size) {
//             chunks.push(data.slice(i, i + size));
//         }
//         return chunks;
//     };

//     // Function to add placeholder cards for rows with fewer than 3 cards
//     const addPlaceholders = (rows: typeof events[]) => {
//         return rows.map((row) => {
//             const placeholdersNeeded = 3 - row.length; // Calculate missing cards
//             return [...row, ...Array(placeholdersNeeded).fill(null)];
//         });
//     };

//     // Chunk event data into groups of 3 and add placeholders
//     const rows = addPlaceholders(chunkData(events, 3));

//     return (
//         <div className={styles.container}>
//             <div>
//                 <h2 className={styles.heading}>Upcoming Events</h2>
//                 <hr className={styles.line} />
//                 <div className={styles.flexibleWidthDiv}>
//                     {rows.map((row, rowIndex) => (
//                         <div key={rowIndex} className={styles.row}>
//                             {row.map((event, index) =>
//                                 event ? (
//                                     <div key={index} className={styles.box}>
//                                         <Cards
//                                             eventIndex={events.findIndex(e => e === event)}  // Pass the position of event in the formData array
//                                             event={event.event} // Use 'event' for the title
//                                             remark={event.remark} // Use 'remark' for the subtitle
//                                             start_date={event.start_date}// Format the date range
//                                             end_date={event.end_date}
//                                             start_time={event.start_time}
//                                             end_time= {event.end_time}

//                                         />
//                                     </div>
//                                 ) : (
//                                     <div key={index} className={styles.hiddenCard}></div> // Placeholder card
//                                 )
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>
            
//         </div>
//     );
// };

// export default UpcomingEvents;

// import React from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../../../../../app/store";
// import Cards from "./Cards";

// const EmptyCalendarIcon = () => (
//   <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <rect x="3" y="9" width="48" height="42" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1.8" />
//     <rect x="3" y="9" width="48" height="14" rx="4" fill="#e5e7eb" />
//     <rect x="3" y="17" width="48" height="6" fill="#e5e7eb" />
//     <line x1="15" y1="3" x2="15" y2="17" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
//     <line x1="39" y1="3" x2="39" y2="17" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
//     <rect x="11" y="28" width="6" height="6" rx="1" fill="#d1d5db" />
//     <rect x="24" y="28" width="6" height="6" rx="1" fill="#d1d5db" />
//     <rect x="37" y="28" width="6" height="6" rx="1" fill="#d1d5db" />
//     <rect x="11" y="39" width="6" height="6" rx="1" fill="#d1d5db" />
//     <rect x="24" y="39" width="6" height="6" rx="1" fill="#d1d5db" />
//   </svg>
// );

// const UpcomingEvents: React.FC = () => {
//   const { formData } = useSelector(
//     (state: RootState) => state.EditAdminOpportunityWorkspaceData
//   );
//   const events = formData?.opportunity_event || [];

//   return (
//     <div className="bg-gray-50 h-full p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-3">
//         <h2 className="text-[15px] font-semibold text-gray-800">Upcoming Events</h2>
//         {events.length > 0 && (
//           <span className="text-blue-600 text-[13px] font-semibold" style={{ lineHeight: 1 }}>
//             {events.length}
//           </span>
//         )}
//       </div>
//       <hr className="border-gray-200 mb-4" />

//       {/* Empty State */}
//       {events.length === 0 ? (
//         <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
//           <EmptyCalendarIcon />
//           <p className="text-[13px] text-gray-500 font-medium">No events yet</p>
//           <p className="text-[12px] text-gray-400">Create an event using the form</p>
//         </div>
//       ) : (
//         <div className="flex flex-col gap-3">
//           {events.map((event, index) => (
//             <Cards
//               key={index}
//               eventIndex={index}
//               event={event.event}
//               remark={event.remark}
//               start_date={event.start_date}
//               end_date={event.end_date}
//               start_time={event.start_time}
//               end_time={event.end_time}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpcomingEvents;


// import React from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../../../../../app/store";
// import Cards from "./Cards";

// const UpcomingEvents: React.FC = () => {
//   const { formData } = useSelector(
//     (state: RootState) => state.EditAdminOpportunityWorkspaceData
//   );
//   const events = formData?.opportunity_event || [];

//   return (
//     <div style={{ background: "#ffffff", borderRadius: "12px", padding: "24px", height: "100%", boxSizing: "border-box" }}>
//       {/* Header */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
//         <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#111827", letterSpacing: "-0.2px" }}>
//           Upcoming Events
//         </h2>
//         {events.length > 0 && (
//           <span style={{
//             background: "#eff6ff", color: "#2563eb",
//             fontSize: "11px", fontWeight: 700,
//             padding: "2px 9px", borderRadius: "20px",
//           }}>
//             {events.length}
//           </span>
//         )}
//       </div>
//       <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "10px 0 16px 0" }} />

//       {/* Empty State */}
//       {events.length === 0 ? (
//         <div style={{
//           display: "flex", flexDirection: "column", alignItems: "center",
//           justifyContent: "center", padding: "40px 20px", gap: "10px",
//         }}>
//           <div style={{ fontSize: "36px", opacity: 0.3 }}>📅</div>
//           <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af", fontWeight: 500 }}>No events yet</p>
//           <p style={{ margin: 0, fontSize: "12px", color: "#d1d5db" }}>Create an event using the form</p>
//         </div>
//       ) : (
//         <div style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//           gap: "12px",
//           overflowY: "auto",
//           maxHeight: "calc(100% - 70px)",
//         }}>
//           {events.map((event, index) => (
//             <Cards
//               key={index}
//               eventIndex={index}
//               event={event.event}
//               remark={event.remark}
//               start_date={event.start_date}
//               end_date={event.end_date}
//               start_time={event.start_time}
//               end_time={event.end_time}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpcomingEvents;

// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../../../../app/store";
// import { removeEvent } from "../../../../../slice/AdminEditOpportunityWorkspaceSlice";
// import { FaFolderOpen, FaFolder } from "react-icons/fa";
// import Cards from "./Cards";
// import styles from "./UpcommingEvents.module.css";

// const UpcomingEvents: React.FC = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector(
//     (state: RootState) => state.EditAdminOpportunityWorkspaceData
//   );
//   const events = formData?.opportunity_event || [];

//   // State to toggle between Upcoming and History
//   const [showHistory, setShowHistory] = useState(false);

//   // Logic to determine if an event is completed based on its end_date
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // Normalize to the start of the day

//   const displayEvents = events.filter((e: any) => {
//     if (!e.end_date) return !showHistory; // If no end date, always treat as Upcoming

//     const eventEndDate = new Date(e.end_date);
//     eventEndDate.setHours(0, 0, 0, 0);

//     const isPast = eventEndDate < today;
//     return showHistory ? isPast : !isPast;
//   });

//   return (
//     <div className={styles.container}>
//       {/* Header */}
//       <div className={styles.header}>
//         <h2 className={styles.heading}>
//           {showHistory ? "Event History" : "Upcoming Events"}
//           {!showHistory && displayEvents.length > 0 && (
//             <span className={styles.countBadge}>{displayEvents.length}</span>
//           )}
//         </h2>
        
//         <button 
//           className={`${styles.historyBtn} ${showHistory ? styles.historyBtnActive : ''}`}
//           onClick={() => setShowHistory(!showHistory)}
//         >
//           {showHistory ? <FaFolderOpen className={styles.historyIconActive} /> : <FaFolder className={styles.historyIcon} />}
//           {showHistory ? "View Upcoming" : "History"}
//         </button>
//       </div>

//       <hr className={styles.line} />

//       {/* Empty State */}
//       {displayEvents.length === 0 ? (
//         <div className={styles.emptyState}>
//           <div className={styles.emptyIconWrap}>
//             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
//             </svg>
//           </div>
//           <p className={styles.emptyText}>
//             {showHistory ? "No past events" : "No events yet"}
//           </p>
//           <p className={styles.emptySubText}>
//             {showHistory ? "Past events will appear here" : "Create an event using the form"}
//           </p>
//         </div>
//       ) : (
//         <div className={styles.eventsGrid}>
//           {displayEvents.map((event, index) => (
//             <Cards
//               key={index}
//               eventIndex={events.indexOf(event)} // Pass original index for deletion
//               event={event.event}
//               remark={event.remark}
//               start_date={event.start_date}
//               end_date={event.end_date}
//               start_time={event.start_time}
//               end_time={event.end_time}
//               isHistory={showHistory}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpcomingEvents;



import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../../../../app/store";
import { removeEvent } from "../../../../../slice/AdminEditOpportunityWorkspaceSlice";
import { FaFolderOpen, FaFolder } from "react-icons/fa";
import { CalendarCheck } from "lucide-react";
import Cards from "./Cards";

// ─── Component ────────────────────────────────────────────────────────────────

const UpcomingEvents: React.FC = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector(
    (state: RootState) => state.EditAdminOpportunityWorkspaceData
  );
  const events = formData?.opportunity_event || [];

  // State to toggle between Upcoming and History
  const [showHistory, setShowHistory] = useState(false);

  // Logic to determine if an event is completed based on its end_date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to the start of the day

  const displayEvents = events.filter((e: any) => {
    if (!e.end_date) return !showHistory; // If no end date, always treat as Upcoming

    const eventEndDate = new Date(e.end_date);
    eventEndDate.setHours(0, 0, 0, 0);

    const isPast = eventEndDate < today;
    return showHistory ? isPast : !isPast;
  });

  return (
    <div className="rounded-2xl border-2 border-violet-100 shadow-lg overflow-hidden h-full flex flex-col">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 flex items-center justify-between shrink-0 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <CalendarCheck size={15} color="white" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">
            {showHistory ? "Event History" : "Upcoming Events"}
          </h2>
          {!showHistory && displayEvents.length > 0 && (
            <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/30">
              {displayEvents.length}
            </span>
          )}
        </div>

        {/* History toggle */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            showHistory
              ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              : "bg-white/20 border-white/30 text-white hover:bg-white/30"
          }`}
        >
          {showHistory
            ? <FaFolderOpen className="text-red-500 text-sm" />
            : <FaFolder className="text-amber-400 text-sm" />}
          {showHistory ? "View Upcoming" : "History"}
        </button>
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4 flex-1 flex flex-col overflow-hidden rounded-b-2xl">

        {/* Empty State */}
        {displayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 py-10">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-1">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <p className="text-sm text-slate-500 font-semibold m-0">
              {showHistory ? "No past events" : "No events yet"}
            </p>
            <p className="text-xs text-slate-400 m-0">
              {showHistory ? "Past events will appear here" : "Create an event using the form"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1">
            {displayEvents.map((event, index) => (
              <Cards
                key={index}
                eventIndex={events.indexOf(event)} // Pass original index for deletion
                event={event.event}
                remark={event.remark}
                start_date={event.start_date}
                end_date={event.end_date}
                start_time={event.start_time}
                end_time={event.end_time}
                isHistory={showHistory}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default UpcomingEvents;