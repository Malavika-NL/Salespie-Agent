// import React, { useState } from "react";
// import styles from "./Cards.module.css";
// import { FaRegEdit } from "react-icons/fa";
// import EditTaskCard from "./EditTaskCard/EditTaskCard";

// interface CardsProps {
//   eventIndex: number;
//   event: string;
//   remark:string;
//   start_date: string;
//   end_date: string;
 
// }

// const Cards: React.FC<CardsProps> = ({ event, remark, start_date,end_date, eventIndex }) => {
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
//             {/* <div>{`${start_date} - ${end_date}`}</div> */}
//             <div>{start_date}</div>
//           </div>
//           <div className={styles.time}>
//             <div>Time</div>
//             {/* <div>{`${start_time} - ${end_time}`}</div> */}
//             {/* <div>{start_time}</div> */}
//           </div>
//         </div>
//       </div>

//       {showEditCard && (
//         <EditTaskCard
//           eventIndex={eventIndex}
//           event={event} // Use 'event' for the title
//           remark={remark} // Use 'remark' for the subtitle
//           start_date={start_date}// Format the date range
//           end_date={end_date}
        
//           close={handleCloseEditCard} // Passing close function as prop
//         />
//       )}
//     </div>
//   );
// };

// export default Cards;



import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import EditTaskCard from "./EditTaskCard/EditTaskCard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardsProps {
  eventIndex: number;
  event: string;
  remark: string;
  start_date: string;
  end_date: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Cards: React.FC<CardsProps> = ({ event, remark, start_date, end_date, eventIndex }) => {
  const [showEditCard, setShowEditCard] = useState(false);

  const handleEditClick = () => setShowEditCard(true);
  const handleCloseEditCard = () => setShowEditCard(false);

  return (
    <div className="rounded-xl border-2 border-blue-100 shadow-md overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-200">

      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-3 py-2 flex items-center justify-between">
        <p className="text-xs font-bold text-white leading-tight line-clamp-1 flex-1 mr-2">
          {event}
        </p>
        <button
          onClick={handleEditClick}
          title="Edit"
          className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white transition-colors shrink-0"
        >
          <FaRegEdit size={11} />
        </button>
      </div>

      {/* Card Body */}
      <div className="bg-white px-3 py-2.5 flex flex-col gap-2">

        {/* Remark pill */}
        {remark && (
          <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5 line-clamp-1 font-medium">
            {remark}
          </span>
        )}

        {/* Date */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide w-8 shrink-0">Date</span>
          <span className="text-[10px] font-semibold text-slate-700">{start_date}</span>
        </div>

      </div>

      {/* Edit Modal */}
      {showEditCard && (
        <EditTaskCard
          eventIndex={eventIndex}
          event={event}
          remark={remark}
          start_date={start_date}
          end_date={end_date}
          close={handleCloseEditCard}
        />
      )}

    </div>
  );
};

export default Cards;
