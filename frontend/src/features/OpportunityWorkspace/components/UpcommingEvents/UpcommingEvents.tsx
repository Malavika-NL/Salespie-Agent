// import React from "react";
// import styles from "./UpcommingEvents.module.css";
// import Cards from "./Cards";

// const UpcomingEvents: React.FC = () => {
//     const events = [
//         { head: "Team Meeting", subhead: "Discuss project milestones", date: "2024-11-30", time: "10:00 AM" },
//         { head: "Client Call", subhead: "Update on delivery schedule", date: "2024-12-01", time: "2:30 PM" },
//         { head: "Workshop", subhead: "New software training", date: "2024-12-05", time: "1:00 PM" },
//         { head: "Annual Review", subhead: "Performance evaluation", date: "2024-12-10", time: "11:00 AM" },
//         { head: "Workshop", subhead: "New software training", date: "2024-12-05", time: "1:00 PM" },
//         { head: "Annual Review", subhead: "Performance evaluation", date: "2024-12-10", time: "11:00 AM" },
//     ];

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
//             <h2 className={styles.heading}>Upcoming Events</h2>
//             <hr className={styles.line} />
//             <div className={styles.flexibleWidthDiv}>
//                 {rows.map((row, rowIndex) => (
//                     <div key={rowIndex} className={styles.row}>
//                         {row.map((event, index) =>
//                             event ? (
//                                 <div key={index} className={styles.box}>
//                                     <Cards
//                                         head={event.head}
//                                         subhead={event.subhead}
//                                         date={event.date}
//                                         time={event.time}
//                                     />
//                                 </div>
//                             ) : (
//                                 <div key={index} className={styles.hiddenCard}></div> // Placeholder card
//                             )
//                         )}
//                     </div>
//                 ))}
//             </div>
//             <div className={styles.buttonContainer}>
//           <button type="button" className={styles.editButton}>
//             Edit
//           </button>
//           <button type="submit" className={styles.saveButton}>
//             Save
//           </button>
//         </div>
//         </div>
//     );
// };

// export default UpcomingEvents;



import React from "react";
import Cards from "./Cards";
import { CalendarCheck } from "lucide-react";

// ─── Static data ──────────────────────────────────────────────────────────────

const events = [
  { head: "Team Meeting",   subhead: "Discuss project milestones",  date: "2024-11-30", time: "10:00 AM" },
  { head: "Client Call",    subhead: "Update on delivery schedule",  date: "2024-12-01", time: "2:30 PM"  },
  { head: "Workshop",       subhead: "New software training",        date: "2024-12-05", time: "1:00 PM"  },
  { head: "Annual Review",  subhead: "Performance evaluation",       date: "2024-12-10", time: "11:00 AM" },
  { head: "Workshop",       subhead: "New software training",        date: "2024-12-05", time: "1:00 PM"  },
  { head: "Annual Review",  subhead: "Performance evaluation",       date: "2024-12-10", time: "11:00 AM" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const chunkData = (data: typeof events, size: number) => {
  const chunks = [];
  for (let i = 0; i < data.length; i += size) chunks.push(data.slice(i, i + size));
  return chunks;
};

const addPlaceholders = (rows: typeof events[]) =>
  rows.map((row) => [...row, ...Array(3 - row.length).fill(null)]);

// ─── Component ────────────────────────────────────────────────────────────────

const UpcomingEvents: React.FC = () => {
  const rows = addPlaceholders(chunkData(events, 3));

  return (
    <div className="rounded-2xl border-2 border-violet-100 shadow-lg overflow-hidden">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <CalendarCheck size={15} color="white" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">Upcoming Events</h2>
        </div>
        <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/30">
          {events.length}
        </span>
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4">
        <div className="flex flex-col gap-3">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-3">
              {row.map((event, index) =>
                event ? (
                  <Cards
                    key={index}
                    head={event.head}
                    subhead={event.subhead}
                    date={event.date}
                    time={event.time}
                  />
                ) : (
                  <div key={index} className="invisible" />
                )
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t-2 border-slate-100">
          <button type="button" className="px-5 py-2 rounded-xl border-2 border-indigo-200 text-indigo-600 text-sm font-bold hover:bg-indigo-50 transition-colors">
            Edit
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors shadow-md">
            Save
          </button>
        </div>
      </div>

    </div>
  );
};

export default UpcomingEvents;
