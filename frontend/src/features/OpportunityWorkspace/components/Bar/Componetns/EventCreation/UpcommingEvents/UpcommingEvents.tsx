// import React from "react";
// import { useSelector } from "react-redux";
// import styles from "./UpcommingEvents.module.css";
// import Cards from "./Cards";
// import type { RootState } from "../../../../../../../app/store";

// const UpcomingEvents: React.FC = () => {
//     // Fetch formData from Redux store
//     const { formData } = useSelector((state: RootState) => state.postOpportunityWorkspaceData);
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
// import { removeEvent } from "../../../../../slice/opportunitySlice";

// const fmt = (d: string) => {
//   if (!d) return "—";
//   const [y, m, day] = d.split("-");
//   const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//   return `${day} ${months[parseInt(m) - 1]} ${y}`;
// };

// const fmtTime = (t: string) => {
//   if (!t) return "—";
//   const [h, m] = t.split(":");
//   const hour = parseInt(h);
//   return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
// };

// const badgeColor = (event: string) => {
//   const map: Record<string, { bg: string; text: string }> = {
//     "Event 1": { bg: "#eff6ff", text: "#2563eb" },
//     "Event 2": { bg: "#fdf4ff", text: "#9333ea" },
//     "Event 3": { bg: "#fff7ed", text: "#ea580c" },
//   };
//   return map[event] ?? { bg: "#f3f4f6", text: "#374151" };
// };

// interface EventCardProps {
//   event: string;
//   remark: string;
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
//   onRemove: () => void;
// }

// const EventCard: React.FC<EventCardProps> = ({
//   event, remark, start_date, end_date, start_time, end_time, onRemove,
// }) => {
//   const { bg, text } = badgeColor(event);

//   const handleDelete = () => {
//     if (window.confirm("Are you sure you want to delete this event?")) {
//       onRemove();
//     }
//   };

//   return (
//     <div style={{
//       background: "#fff",
//       border: "1px solid #e5e7eb",
//       borderRadius: "10px",
//       padding: "14px 16px",
//       display: "flex",
//       flexDirection: "column",
//       gap: "8px",
//       boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//     }}>
//       {/* Badge row */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <span style={{
//           background: bg, color: text,
//           fontSize: "11px", fontWeight: 600,
//           padding: "3px 10px", borderRadius: "20px",
//           letterSpacing: "0.3px",
//         }}>
//           {event}
//         </span>
//       </div>

//       {/* Date */}
//       <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "12px", color: "#374151" }}>
//         <span>📅</span>
//         <span>{fmt(start_date)}</span>
//         <span style={{ color: "#9ca3af" }}>→</span>
//         <span>{fmt(end_date)}</span>
//       </div>

//       {/* Time */}
//       <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "12px", color: "#374151" }}>
//         <span>🕐</span>
//         <span>{fmtTime(start_time)}</span>
//         <span style={{ color: "#9ca3af" }}>→</span>
//         <span>{fmtTime(end_time)}</span>
//       </div>

//       {/* Remark */}
//       {remark && (
//         <p style={{
//           margin: 0, fontSize: "12px", color: "#6b7280",
//           borderTop: "1px solid #f3f4f6", paddingTop: "8px", lineHeight: 1.5,
//         }}>
//           {remark}
//         </p>
//       )}

//       {/* Delete button */}
//       <button
//         onClick={handleDelete}
//         style={{
//           marginTop: "4px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: "5px",
//           width: "100%",
//           padding: "7px 0",
//           background: "#fff1f2",
//           border: "1px solid #fecdd3",
//           borderRadius: "7px",
//           color: "#e11d48",
//           fontSize: "12px",
//           fontWeight: 600,
//           cursor: "pointer",
//           transition: "background 0.15s, border-color 0.15s",
//         }}
//         onMouseEnter={e => {
//           e.currentTarget.style.background = "#ffe4e6";
//           e.currentTarget.style.borderColor = "#fda4af";
//         }}
//         onMouseLeave={e => {
//           e.currentTarget.style.background = "#fff1f2";
//           e.currentTarget.style.borderColor = "#fecdd3";
//         }}
//       >
//         🗑️ Delete Event
//       </button>
//     </div>
//   );
// };

// // ── Container ─────────────────────────────────────────────────────────────────
// const UpcomingEvents: React.FC = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector((state: RootState) => state.postOpportunityWorkspaceData);
//   const events = formData?.opportunity_event || [];

//   return (
//     <div style={{ background: "#ffffff", borderRadius: "12px", padding: "24px", height: "100%", boxSizing: "border-box" }}>
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
//           {events.map((event, i) => (
//             <EventCard
//               key={i}
//               event={event.event}
//               remark={event.remark}
//               start_date={event.start_date}
//               end_date={event.end_date}
//               start_time={event.start_time}
//               end_time={event.end_time}
//               onRemove={() => dispatch(removeEvent(i))}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpcomingEvents;


import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../../../../app/store";
import { removeEvent } from "../../../../../slice/opportunitySlice";
import { CalendarCheck } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${day} ${months[parseInt(m) - 1]} ${y}`;
};

const fmtTime = (t: string) => {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

const badgeClass = (event: string): string => {
  const map: Record<string, string> = {
    "Event 1": "bg-blue-100 text-blue-700 border-blue-200",
    "Event 2": "bg-purple-100 text-purple-700 border-purple-200",
    "Event 3": "bg-orange-100 text-orange-700 border-orange-200",
  };
  return map[event] ?? "bg-indigo-100 text-indigo-700 border-indigo-200";
};

// ─── EventCard ────────────────────────────────────────────────────────────────

interface EventCardProps {
  event: string;
  remark: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  onRemove: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event, remark, start_date, end_date, start_time, end_time, onRemove,
}) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      onRemove();
    }
  };

  return (
    <div className="rounded-xl border-2 border-indigo-100 shadow-md overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all duration-200">

      {/* Card Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-2">
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-white/20 text-white tracking-wide`}>
          {event}
        </span>
      </div>

      {/* Card Body */}
      <div className="bg-white px-3 py-3 flex flex-col gap-2">

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-slate-700">
          <span>📅</span>
          <span className="font-semibold">{fmt(start_date)}</span>
          <span className="text-slate-400">→</span>
          <span className="font-semibold">{fmt(end_date)}</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5 text-xs">
          <span>🕐</span>
          <span className="font-bold text-indigo-600">{fmtTime(start_time)}</span>
          <span className="text-slate-400">→</span>
          <span className="font-bold text-indigo-600">{fmtTime(end_time)}</span>
        </div>

        {/* Remark */}
        {remark && (
          <p className="text-xs text-slate-600 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1.5 leading-relaxed m-0">
            {remark}
          </p>
        )}

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="mt-1 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-50 border-2 border-red-100 text-red-500 text-xs font-bold hover:bg-red-100 hover:border-red-200 transition-colors duration-150"
        >
          🗑️ Delete Event
        </button>

      </div>
    </div>
  );
};

// ─── UpcomingEvents Container ─────────────────────────────────────────────────

const UpcomingEvents: React.FC = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.postOpportunityWorkspaceData);
  const events = Array.isArray(formData?.opportunity_event)
    ? formData.opportunity_event
    : [];

  return (
    <div className="rounded-2xl border-2 border-violet-100 shadow-lg overflow-hidden h-full flex flex-col">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <CalendarCheck size={15} color="white" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">Upcoming Events</h2>
        </div>
        {events.length > 0 && (
          <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/30">
            {events.length}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4 flex-1 flex flex-col overflow-hidden">

        {/* Empty State */}
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 py-10">
            <div className="text-4xl opacity-30">📅</div>
            <p className="text-sm text-slate-400 font-semibold m-0">No events yet</p>
            <p className="text-xs text-slate-300 m-0">Create an event using the form</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto">
            {events.map((event, i) => (
              <EventCard
                key={i}
                event={event.event}
                remark={event.remark}
                start_date={event.start_date}
                end_date={event.end_date}
                start_time={event.start_time}
                end_time={event.end_time}
                onRemove={() => dispatch(removeEvent(i))}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default UpcomingEvents;
