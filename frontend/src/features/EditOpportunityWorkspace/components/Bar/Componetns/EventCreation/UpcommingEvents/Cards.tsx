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
// import styles from "./Cards.module.css";
// import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
// import EditEventCard from "./EditEventCard/EditEventCard";
// import { useDispatch } from "react-redux";
// import { removeEvent } from "../../../../../slice/EditOpportunityWorkspace";

// interface CardsProps {
//   eventIndex: number;
//   event: string;
//   remark: string;
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
// }

// const Cards: React.FC<CardsProps> = ({
//   event,
//   remark,
//   start_date,
//   start_time,
//   end_date,
//   end_time,
//   eventIndex,
// }) => {
//   const dispatch = useDispatch();
//   const [showEditCard, setShowEditCard] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   const handleDeleteConfirm = () => {
//     dispatch(removeEvent(eventIndex));
//     setShowDeleteConfirm(false);
//   };

//   return (
//     <div className={styles.cardWrapper}>

//       {/* Action Icons */}
//       <div className={styles.iconContainer}>
//         <FaRegEdit
//           className={styles.icon}
//           onClick={() => setShowEditCard(true)}
//           title="Edit"
//         />
//         <FaRegTrashAlt
//           onClick={() => setShowDeleteConfirm(true)}
//           title="Delete"
//           style={{ color: "#e53e3e", cursor: "pointer", marginLeft: "8px", fontSize: "14px" }}
//         />
//       </div>

//       {/* Card Content */}
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

//       {/* Edit Modal */}
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

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div style={{
//           position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
//           display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
//         }}>
//           <div style={{
//             background: "#fff", borderRadius: "14px", padding: "28px 24px",
//             width: "300px", textAlign: "center",
//             boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
//           }}>
//             <div style={{ fontSize: "2.2rem", marginBottom: "10px" }}>🗑️</div>
//             <h3 style={{ fontWeight: 700, marginBottom: "8px", color: "#1a202c", fontSize: "16px" }}>
//               Delete Event
//             </h3>
//             <p style={{ color: "#718096", fontSize: "13px", marginBottom: "20px" }}>
//               Are you sure you want to delete this event? This cannot be undone.
//             </p>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 style={{
//                   flex: 1, padding: "9px", border: "1px solid #e2e8f0",
//                   borderRadius: "8px", background: "#fff", cursor: "pointer",
//                   fontSize: "13px", fontWeight: 500,
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteConfirm}
//                 style={{
//                   flex: 1, padding: "9px", border: "none",
//                   borderRadius: "8px", background: "#e53e3e", color: "#fff",
//                   cursor: "pointer", fontSize: "13px", fontWeight: 600,
//                 }}
//               >
//                 Yes, Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cards;


import React, { useState } from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { removeEvent } from "../../../../../slice/EditOpportunityWorkspace";
import EditEventCard from "./EditEventCard/EditEventCard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardsProps {
  eventIndex: number;
  event: string;
  remark: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Cards: React.FC<CardsProps> = ({
  event,
  remark,
  start_date,
  start_time,
  end_date,
  end_time,
  eventIndex,
}) => {
  const dispatch = useDispatch();
  const [showEditCard, setShowEditCard] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteConfirm = () => {
    dispatch(removeEvent(eventIndex));
    setShowDeleteConfirm(false);
  };

  return (
    <div className="rounded-xl border-2 border-indigo-100 shadow-md overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all duration-200">

      {/* Card Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-2 flex items-center justify-between">
        <p className="text-xs font-bold text-white leading-tight line-clamp-1 flex-1 mr-2">
          {event}
        </p>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowEditCard(true)}
            title="Edit"
            className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <FaRegEdit size={11} />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            title="Delete"
            className="p-1 rounded-md bg-white/20 hover:bg-red-400/60 text-white transition-colors"
          >
            <FaRegTrashAlt size={11} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="bg-white px-3 py-2.5 flex flex-col gap-2">

        {/* Remark pill */}
        {remark && (
          <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md px-2 py-0.5 line-clamp-1 font-medium">
            {remark}
          </span>
        )}

        {/* Date & Time */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide w-8 shrink-0">Date</span>
            <span className="text-[10px] font-semibold text-slate-700">{start_date} – {end_date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide w-8 shrink-0">Time</span>
            <span className="text-[10px] font-semibold text-indigo-600">{start_time} – {end_time}</span>
          </div>
        </div>

      </div>

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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border-2 border-red-100 shadow-2xl w-72 overflow-hidden">
            {/* Delete modal header */}
            <div className="bg-gradient-to-r from-red-500 to-rose-500 px-5 py-3 flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-base">🗑️</div>
              <h3 className="text-sm font-bold text-white">Delete Event</h3>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-sm text-slate-600 mb-5">
                Are you sure you want to delete this event? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors shadow-md"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Cards;