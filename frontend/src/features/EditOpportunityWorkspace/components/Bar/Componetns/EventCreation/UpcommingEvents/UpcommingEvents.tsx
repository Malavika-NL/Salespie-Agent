// import React from "react";
// import { useSelector } from "react-redux";
// import styles from "./UpcommingEvents.module.css";
// import Cards from "./Cards";
// import type { RootState } from "../../../../../../../app/store";

// const UpcomingEvents: React.FC = () => {
//     // Fetch formData from Redux store
//     const { formData } = useSelector((state: RootState) => state.postEditOpportunityWorkspaceForm);
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
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../../../../app/store";
// import { removeEvent } from "../../../../../slice/EditOpportunityWorkspace";

// const formatDate = (dateStr: string): string => {
//   if (!dateStr) return "";
//   return new Date(dateStr).toLocaleDateString("en-GB", {
//     day: "2-digit", month: "short", year: "numeric",
//   });
// };

// const formatTime = (timeStr: string): string => {
//   if (!timeStr) return "";
//   const [h, m] = timeStr.split(":");
//   const hour = parseInt(h, 10);
//   const ampm = hour >= 12 ? "PM" : "AM";
//   const display = hour % 12 === 0 ? 12 : hour % 12;
//   return `${display}:${m} ${ampm}`;
// };

// const UpcomingEvents: React.FC = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector(
//     (state: RootState) => state.postEditOpportunityWorkspaceForm
//   );
//   const events = formData?.opportunity_event || [];

//   return (
//     <div className="bg-white rounded-lg p-6 w-full">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-3">
//         <h2 className="text-base font-semibold text-gray-800">Upcoming Events</h2>
//         {events.length > 0 && (
//           <span className="bg-blue-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
//             {events.length}
//           </span>
//         )}
//       </div>
//       <hr className="border-gray-200 mb-5" />

//       {events.length === 0 ? (
//         <p className="text-sm text-gray-400 text-center py-8">
//           No upcoming events. Create one to get started.
//         </p>
//       ) : (
//         <div className="flex flex-col gap-3">
//           {events.map((event, index) => (
//             <div
//               key={index}
//               className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:shadow-sm transition"
//             >
//               {/* Tag */}
//               <div className="px-4 pt-3">
//                 <span className="inline-block bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold px-3 py-1 rounded">
//                   {event.event}
//                 </span>
//               </div>

//               {/* Info */}
//               <div className="px-4 py-3 flex flex-col gap-1.5">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm">📅</span>
//                   <span className="text-sm text-gray-700">
//                     {formatDate(event.start_date)} → {formatDate(event.end_date)}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm">🕐</span>
//                   <span className="text-sm text-gray-700">
//                     {formatTime(event.start_time)} → {formatTime(event.end_time)}
//                   </span>
//                 </div>
//                 {event.remark && (
//                   <p className="text-xs text-gray-500 italic mt-1">{event.remark}</p>
//                 )}
//               </div>

//               {/* Delete Button */}
//               <button
//                 type="button"
//                 onClick={() => dispatch(removeEvent(index))}
//                 className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border-t border-red-100 text-sm font-medium transition cursor-pointer"
//               >
//                 🗑 Delete Event
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpcomingEvents;

// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../../../../app/store";
// import { removeEvent } from "../../../../../slice/EditOpportunityWorkspace";

// const formatDate = (dateStr: string): string => {
//   if (!dateStr) return "";
//   return new Date(dateStr).toLocaleDateString("en-GB", {
//     day: "2-digit", month: "short", year: "numeric",
//   });
// };

// const formatTime = (timeStr: string): string => {
//   if (!timeStr) return "";
//   const [h, m] = timeStr.split(":");
//   const hour = parseInt(h, 10);
//   const ampm = hour >= 12 ? "PM" : "AM";
//   const display = hour % 12 === 0 ? 12 : hour % 12;
//   return `${display}:${m} ${ampm}`;
// };

// // Calendar SVG icon — matches the screenshot empty state
// const CalendarEmptyIcon = () => (
//   <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <rect x="4" y="10" width="48" height="42" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
//     <rect x="4" y="10" width="48" height="12" rx="4" fill="#e5e7eb" />
//     <rect x="4" y="16" width="48" height="6" fill="#e5e7eb" />
//     <line x1="16" y1="4" x2="16" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
//     <line x1="40" y1="4" x2="40" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
//     {/* Grid dots */}
//     <rect x="13" y="30" width="5" height="5" rx="1" fill="#d1d5db" />
//     <rect x="25" y="30" width="5" height="5" rx="1" fill="#d1d5db" />
//     <rect x="37" y="30" width="5" height="5" rx="1" fill="#d1d5db" />
//     <rect x="13" y="40" width="5" height="5" rx="1" fill="#d1d5db" />
//     <rect x="25" y="40" width="5" height="5" rx="1" fill="#d1d5db" />
//     <rect x="37" y="40" width="5" height="5" rx="1" fill="#e5e7eb" />
//   </svg>
// );

// const UpcomingEvents: React.FC = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector(
//     (state: RootState) => state.postEditOpportunityWorkspaceForm
//   );
//   const events = formData?.opportunity_event || [];

//   return (
//     <div style={{ padding: "24px", height: "100%" }}>
//       {/* Header */}
//       <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
//         <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: 0 }}>
//           Upcoming Events
//         </h2>
//         {events.length > 0 && (
//           <span style={{
//             background: "#2563eb", color: "#fff", fontSize: "11px", fontWeight: 700,
//             borderRadius: "50%", width: "20px", height: "20px",
//             display: "flex", alignItems: "center", justifyContent: "center",
//           }}>
//             {events.length}
//           </span>
//         )}
//       </div>
//       <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "0 0 20px 0" }} />

//       {/* Empty State — matches screenshot */}
//       {events.length === 0 ? (
//         <div style={{
//           display: "flex", flexDirection: "column", alignItems: "center",
//           justifyContent: "center", height: "calc(100% - 80px)", minHeight: "200px",
//           gap: "12px",
//         }}>
//           <CalendarEmptyIcon />
//           <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, fontWeight: 500 }}>
//             No events yet
//           </p>
//           <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
//             Create an event using the form
//           </p>
//         </div>
//       ) : (
//         /* Event Cards */
//         <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//           {events.map((event, index) => (
//             <div key={index} style={{
//               border: "1px solid #e5e7eb", borderRadius: "8px",
//               overflow: "hidden", background: "#fafafa",
//             }}>
//               {/* Tag */}
//               <div style={{ padding: "10px 14px 0 14px" }}>
//                 <span style={{
//                   display: "inline-block", background: "#eff6ff", color: "#2563eb",
//                   border: "1px solid #bfdbfe", fontSize: "12px", fontWeight: 600,
//                   padding: "3px 10px", borderRadius: "4px",
//                 }}>
//                   {event.event}
//                 </span>
//               </div>

//               {/* Info */}
//               <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                   <span style={{ fontSize: "13px" }}>📅</span>
//                   <span style={{ fontSize: "13px", color: "#374151" }}>
//                     {formatDate(event.start_date)} → {formatDate(event.end_date)}
//                   </span>
//                 </div>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                   <span style={{ fontSize: "13px" }}>🕐</span>
//                   <span style={{ fontSize: "13px", color: "#374151" }}>
//                     {formatTime(event.start_time)} → {formatTime(event.end_time)}
//                   </span>
//                 </div>
//                 {event.remark && (
//                   <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, fontStyle: "italic" }}>
//                     {event.remark}
//                   </p>
//                 )}
//               </div>

//               {/* Delete */}
//               <button
//                 type="button"
//                 onClick={() => dispatch(removeEvent(index))}
//                 style={{
//                   width: "100%", padding: "9px", background: "#fff0f0", color: "#dc2626",
//                   border: "none", borderTop: "1px solid #fecaca", fontSize: "13px",
//                   fontWeight: 500, cursor: "pointer", textAlign: "center",
//                 }}
//               >
//                 🗑 Delete Event
//               </button>
//             </div>
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
// import { removeEvent } from "../../../../../slice/EditOpportunityWorkspace";
// import { FaFolderOpen, FaFolder } from "react-icons/fa";
// import styles from "./UpcommingEvents.module.css";

// const formatDate = (dateStr: string): string => {
//   if (!dateStr) return "";
//   return new Date(dateStr).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const formatTime = (timeStr: string): string => {
//   if (!timeStr) return "";
//   const [h, m] = timeStr.split(":");
//   const hour = parseInt(h, 10);
//   const ampm = hour >= 12 ? "PM" : "AM";
//   const display = hour % 12 === 0 ? 12 : hour % 12;
//   return `${display}:${m} ${ampm}`;
// };

// // Icons
// const CalendarIcon = () => (
//   <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
//     <rect x="1" y="2.5" width="14" height="12" rx="2" stroke="#4b5563" strokeWidth="1.4" />
//     <path d="M1 6.5h14" stroke="#4b5563" strokeWidth="1.4" />
//     <path d="M5 1v3M11 1v3" stroke="#4b5563" strokeWidth="1.4" strokeLinecap="round" />
//   </svg>
// );

// const ClockIcon = () => (
//   <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
//     <circle cx="8" cy="8" r="6.5" stroke="#4b5563" strokeWidth="1.4" />
//     <path d="M8 4.5V8.2l2.3 1.8" stroke="#4b5563" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const TrashIcon = () => (
//   <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
//     <path d="M2 4h12M6.5 4V2.5A.5.5 0 017 2h2a.5.5 0 01.5.5V4M5.5 4l.5 9h4l.5-9" stroke="#dc2626" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const EmptyCalendarIcon = () => (
//   <svg width="54" height="54" viewBox="0 0 54 54" fill="none" style={{ marginBottom: "8px" }}>
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
//   const dispatch = useDispatch();
//   const { formData } = useSelector(
//     (state: RootState) => state.postEditOpportunityWorkspaceForm
//   );
//   const events = formData?.opportunity_event || [];

//   // Toggle state for History
//   const [showHistory, setShowHistory] = useState(false);

//   // Logic to determine if an event is completed based on its end_date
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // Strip time so we compare purely by date

//   const displayEvents = events.filter((e: any) => {
//     if (!e.end_date) return !showHistory; // If no end date, treat it as Upcoming

//     const eventEndDate = new Date(e.end_date);
//     eventEndDate.setHours(0, 0, 0, 0);

//     // It's considered "History" (past) if the end date is strictly before today
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
//           <EmptyCalendarIcon />
//           <p className={styles.emptyText}>
//             {showHistory ? "No event history" : "No events yet"}
//           </p>
//           <p className={styles.emptySubText}>
//             {showHistory ? "Completed events will appear here" : "Create an event using the form"}
//           </p>
//         </div>
//       ) : (
//         <div className={styles.eventsGrid}>
//           {displayEvents.map((event: any, index: number) => (
//             <div key={index} className={styles.eventCard}>
//               {/* Event type tag */}
//               <div className={styles.eventTagWrap}>
//                 <span className={styles.eventTag}>{event.event}</span>
//               </div>

//               {/* Date & Time */}
//               <div className={styles.eventDetails}>
//                 <div className={styles.detailRow}>
//                   <CalendarIcon />
//                   <span>{formatDate(event.start_date)}&nbsp; →&nbsp; {formatDate(event.end_date)}</span>
//                 </div>

//                 <div className={styles.detailRow}>
//                   <ClockIcon />
//                   <span>{formatTime(event.start_time)}&nbsp; →&nbsp; {formatTime(event.end_time)}</span>
//                 </div>

//                 {/* Remark */}
//                 {event.remark ? (
//                   <p className={styles.eventRemark}>{event.remark}</p>
//                 ) : (
//                   <div className={styles.emptyRemark}>&nbsp;</div>
//                 )}
//               </div>

//               {/* Delete button */}
//               <button
//                 type="button"
//                 onClick={() => dispatch(removeEvent(events.indexOf(event)))}
//                 className={styles.deleteBtn}
//               >
//                 <TrashIcon /> Delete Event
//               </button>
//             </div>
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
import { removeEvent } from "../../../../../slice/EditOpportunityWorkspace";
import { FaFolderOpen, FaFolder } from "react-icons/fa";
import { CalendarCheck } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (timeStr: string): string => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m} ${ampm}`;
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
    <rect x="1" y="2.5" width="14" height="12" rx="2" stroke="#4b5563" strokeWidth="1.4" />
    <path d="M1 6.5h14" stroke="#4b5563" strokeWidth="1.4" />
    <path d="M5 1v3M11 1v3" stroke="#4b5563" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
    <circle cx="8" cy="8" r="6.5" stroke="#4b5563" strokeWidth="1.4" />
    <path d="M8 4.5V8.2l2.3 1.8" stroke="#4b5563" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <path d="M2 4h12M6.5 4V2.5A.5.5 0 017 2h2a.5.5 0 01.5.5V4M5.5 4l.5 9h4l.5-9" stroke="#dc2626" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EmptyCalendarIcon = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none" style={{ marginBottom: "8px" }}>
    <rect x="3" y="9" width="48" height="42" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1.8" />
    <rect x="3" y="9" width="48" height="14" rx="4" fill="#e5e7eb" />
    <rect x="3" y="17" width="48" height="6" fill="#e5e7eb" />
    <line x1="15" y1="3" x2="15" y2="17" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="39" y1="3" x2="39" y2="17" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="11" y="28" width="6" height="6" rx="1" fill="#d1d5db" />
    <rect x="24" y="28" width="6" height="6" rx="1" fill="#d1d5db" />
    <rect x="37" y="28" width="6" height="6" rx="1" fill="#d1d5db" />
    <rect x="11" y="39" width="6" height="6" rx="1" fill="#d1d5db" />
    <rect x="24" y="39" width="6" height="6" rx="1" fill="#d1d5db" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

const UpcomingEvents: React.FC = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector(
    (state: RootState) => state.postEditOpportunityWorkspaceForm
  );
  const events = formData?.opportunity_event || [];

  // Toggle state for History
  const [showHistory, setShowHistory] = useState(false);

  // Logic to determine if an event is completed based on its end_date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Strip time so we compare purely by date

  const displayEvents = events.filter((e: any) => {
    if (!e.end_date) return !showHistory; // If no end date, treat it as Upcoming

    const eventEndDate = new Date(e.end_date);
    eventEndDate.setHours(0, 0, 0, 0);

    // It's considered "History" (past) if the end date is strictly before today
    const isPast = eventEndDate < today;

    return showHistory ? isPast : !isPast;
  });

  return (
    <div className="rounded-2xl border-2 border-violet-100 shadow-lg overflow-hidden h-full flex flex-col">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 flex items-center justify-between shrink-0">
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
      <div className="bg-white px-5 py-4 flex-1 flex flex-col overflow-hidden">

        {/* Empty State */}
        {displayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 py-10">
            <EmptyCalendarIcon />
            <p className="text-sm text-slate-500 font-semibold m-0">
              {showHistory ? "No event history" : "No events yet"}
            </p>
            <p className="text-xs text-slate-400 m-0">
              {showHistory ? "Completed events will appear here" : "Create an event using the form"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1">
            {displayEvents.map((event: any, index: number) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Event tag */}
                <div className="px-4 pt-3">
                  <span className="inline-block text-xs font-semibold px-3 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700">
                    {event.event}
                  </span>
                </div>

                {/* Details */}
                <div className="px-4 py-3 flex flex-col gap-1.5 flex-1">
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <CalendarIcon />
                    <span>{formatDate(event.start_date)}&nbsp;→&nbsp;{formatDate(event.end_date)}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <ClockIcon />
                    <span>{formatTime(event.start_time)}&nbsp;→&nbsp;{formatTime(event.end_time)}</span>
                  </div>
                  {event.remark ? (
                    <p className="text-xs text-slate-500 italic leading-relaxed m-0 mt-1">{event.remark}</p>
                  ) : (
                    <div className="mt-1" />
                  )}
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => dispatch(removeEvent(events.indexOf(event)))}
                  className="w-full flex items-center justify-center gap-1.5 py-2 border-t border-red-100 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  <TrashIcon /> Delete Event
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default UpcomingEvents;