// import React, { useState } from "react";
// import styles from "./Cards.module.css";
// import { FaRegEdit } from "react-icons/fa";
// import EditEventCard from "./EditEventCard/EditEventCard";


// interface CardsProps {
//   eventIndex: number;
//   event: string;
//   remark:string;
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time:string;
// }

// const Cards: React.FC<CardsProps> = ({ event, remark, start_date,start_time,end_date,end_time, eventIndex }) => {
//   const [showEditCard, setShowEditCard] = useState(false); // State to control popup visibility

//   const handleEditClick = () => {
//     setShowEditCard(true); // Show the edit card when the icon is clicked
//   };

//   const handleCloseEditCard = () => {
//     setShowEditCard(false); // Close the edit card
//   };

//   return (
//     <div className={styles.cardWrapper}>
//       <div className={styles.iconContainer}>
//         <FaRegEdit className={styles.icon} onClick={handleEditClick} /> {/* Edit icon */}
//       </div>

//       <div className={styles.card}>
//         <h3 className={styles.head}>{event}</h3>
//         <p className={styles.subhead}>{remark}</p>
//         <div className={styles.footer}>
//           <div className={styles.date}>
//             <div>Date</div>
//             <div>{`${start_date} - ${end_date}`}</div>
//           </div>
//           <div className={styles.time}>
//             <div>Time</div>
//             <div>{`${start_time} - ${end_time}`}</div>
//           </div>
//         </div>
//       </div>

//       {showEditCard && (
//         <EditEventCard
//           eventIndex={eventIndex}
//           event={event} // Use 'event' for the title
//           remark={remark} // Use 'remark' for the subtitle
//           start_date={start_date}// Format the date range
//           end_date={end_date}
//           start_time={start_time}
//           end_time= {end_time}
//           close={handleCloseEditCard} // Passing close function as prop
//         />
//       )}
//     </div>
//   );
// };

// export default Cards;


// import React, { useState } from "react";
// import { FaRegEdit } from "react-icons/fa";
// import { useDispatch } from "react-redux";
// import { removeEvent } from "../../../../../slice/AdminEditOpportunityWorkspaceSlice"; // ← your admin slice path
// import EditEventCard from "./EditEventCard/EditEventCard";

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

// interface CardsProps {
//   eventIndex: number;
//   event: string;
//   remark: string;
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
//   isHistory?: boolean;
// }

// const Cards: React.FC<CardsProps> = ({
//   event, remark, start_date, start_time, end_date, end_time, eventIndex,
// }) => {
//   const dispatch = useDispatch();
//   const [showEditCard, setShowEditCard] = useState(false);
//   const { bg, text } = badgeColor(event);

//   const handleDelete = () => {
//     if (window.confirm("Are you sure you want to delete this event?")) {
//       dispatch(removeEvent(eventIndex));
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
//       position: "relative",
//     }}>
//       {/* Badge row + Edit icon */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <span style={{
//           background: bg, color: text,
//           fontSize: "11px", fontWeight: 600,
//           padding: "3px 10px", borderRadius: "20px",
//           letterSpacing: "0.3px",
//         }}>
//           {event}
//         </span>
//         <FaRegEdit
//           onClick={() => setShowEditCard(true)}
//           style={{ color: "#9ca3af", fontSize: "14px", cursor: "pointer" }}
//           onMouseEnter={e => (e.currentTarget.style.color = "#6b7280")}
//           onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
//         />
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

//       {showEditCard && (
//         <EditEventCard
//           eventIndex={eventIndex}
//           event={event}
//           remark={remark}
//           start_date={start_date}
//           end_date={end_date}
//           start_time={start_time}
//           end_time={end_time}
//           close={() => setShowEditCard(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Cards;




import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { removeEvent } from "../../../../../slice/AdminEditOpportunityWorkspaceSlice";
import EditEventCard from "./EditEventCard/EditEventCard";

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

const badgeColor = (event: string) => {
  const map: Record<string, { bg: string; text: string }> = {
    "Event 1": { bg: "#eff6ff", text: "#2563eb" },
    "Event 2": { bg: "#fdf4ff", text: "#9333ea" },
    "Event 3": { bg: "#fff7ed", text: "#ea580c" },
  };
  return map[event] ?? { bg: "#f3f4f6", text: "#374151" };
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardsProps {
  eventIndex: number;
  event: string;
  remark: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  isHistory?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Cards: React.FC<CardsProps> = ({
  event, remark, start_date, start_time, end_date, end_time, eventIndex,
}) => {
  const dispatch = useDispatch();
  const [showEditCard, setShowEditCard] = useState(false);
  const { bg, text } = badgeColor(event);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(removeEvent(eventIndex));
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col gap-0 hover:shadow-md transition-shadow">

      {/* Badge row + Edit icon */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <span
          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
          style={{ background: bg, color: text }}
        >
          {event}
        </span>
        <button
          onClick={() => setShowEditCard(true)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Edit"
        >
          <FaRegEdit size={13} />
        </button>
      </div>

      <div className="px-4 pb-3 flex flex-col gap-2">

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <span>📅</span>
          <span className="font-semibold">{fmt(start_date)}</span>
          <span className="text-slate-400">→</span>
          <span className="font-semibold">{fmt(end_date)}</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <span>🕐</span>
          <span className="font-semibold">{fmtTime(start_time)}</span>
          <span className="text-slate-400">→</span>
          <span className="font-semibold">{fmtTime(end_time)}</span>
        </div>

        {/* Remark */}
        {remark && (
          <p className="m-0 text-xs text-slate-500 border-t border-slate-100 pt-2 leading-relaxed">
            {remark}
          </p>
        )}

      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="w-full flex items-center justify-center gap-1.5 py-2 border-t border-red-100 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
      >
        🗑️ Delete Event
      </button>

      {/* Edit Modal */}
      {showEditCard && (
        <EditEventCard
          eventIndex={eventIndex}
          event={event}
          remark={remark}
          start_date={start_date}
          end_date={end_date}
          start_time={start_time}
          end_time={end_time}
          close={() => setShowEditCard(false)}
        />
      )}

    </div>
  );
};

export default Cards;
