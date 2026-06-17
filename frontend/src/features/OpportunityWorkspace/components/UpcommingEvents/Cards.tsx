// import React from "react";
// import styles from "./Cards.module.css";

// interface CardsProps {
//   head: string;
//   subhead: string;
//   date: string;
//   time: string;
// }

// const Cards: React.FC<CardsProps> = ({ head, subhead, date, time }) => {
//   return (
//     <div className={styles.card}>
//       <h3 className={styles.head}>{head}</h3>
//       <p className={styles.subhead}>{subhead}</p>
//       <div className={styles.footer}>
//         <div className={styles.date}>
//             <div>Date</div>
//             <div>{date}</div>
//             </div>
//         <div className={styles.time}>
//         <div>Time</div>
//         <div>{time}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cards;




import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardsProps {
  head: string;
  subhead: string;
  date: string;
  time: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Cards: React.FC<CardsProps> = ({ head, subhead, date, time }) => {
  return (
    <div className="rounded-xl border-2 border-violet-100 shadow-md overflow-hidden hover:shadow-lg hover:border-violet-300 transition-all duration-200">

      {/* Card Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-500 px-3 py-2">
        <h3 className="text-xs font-bold text-white leading-tight line-clamp-1">{head}</h3>
      </div>

      {/* Card Body */}
      <div className="bg-white px-3 py-2.5 flex flex-col gap-2">

        {/* Subhead pill */}
        {subhead && (
          <p className="text-[10px] text-violet-600 bg-violet-50 border border-violet-100 rounded-md px-2 py-0.5 line-clamp-2 font-medium m-0">
            {subhead}
          </p>
        )}

        {/* Date & Time */}
        <div className="flex items-center justify-between pt-1 border-t-2 border-slate-100">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wide">Date</span>
            <span className="text-[10px] font-semibold text-slate-700">{date || "—"}</span>
          </div>
          <div className="flex flex-col gap-0.5 text-right">
            <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wide">Time</span>
            <span className="text-[10px] font-bold text-violet-600">{time || "—"}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cards;
