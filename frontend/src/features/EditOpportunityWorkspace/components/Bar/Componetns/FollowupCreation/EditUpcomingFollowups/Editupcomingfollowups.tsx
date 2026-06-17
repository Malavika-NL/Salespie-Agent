// // src/features/EditOpportunityWorkspace/components/Bar/Componetns/FollowupCreation/EditUpcomingFollowups/EditUpcomingFollowups.tsx
// // Same UI as UpcomingFollowups but reads from the EDIT slice

// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../../../../app/store";
// import { removeFollowup } from "../../../../../slice/EditOpportunityWorkspace";

// // ── helpers ──────────────────────────────────────────────────────────────────
// const fmt = (d: string) => {
//   if (!d) return "—";
//   const [y, m, day] = d.split("-");
//   const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//   return `${day} ${months[parseInt(m) - 1]} ${y}`;
// };
// const today      = () => new Date().toISOString().split("T")[0];
// const isExpired  = (end_date: string) => !!end_date && end_date < today();
// const isUpcoming = (end_date: string) => !end_date || end_date >= today();

// const badgeColor = (type: string): { bg: string; text: string } => {
//   const map: Record<string, { bg: string; text: string }> = {
//     "Call":            { bg: "#eff6ff", text: "#2563eb" },
//     "Meeting":         { bg: "#fdf4ff", text: "#9333ea" },
//     "Demo":            { bg: "#fff7ed", text: "#ea580c" },
//     "Proposal":        { bg: "#f0fdf4", text: "#16a34a" },
//     "Negotiation":     { bg: "#fef9c3", text: "#854d0e" },
//     "Follow-up Email": { bg: "#fce7f3", text: "#be185d" },
//     "Site Visit":      { bg: "#ecfdf5", text: "#047857" },
//     "Other":           { bg: "#f3f4f6", text: "#374151" },
//   };
//   return map[type] ?? { bg: "#f3f4f6", text: "#374151" };
// };

// // ── FollowupCard ──────────────────────────────────────────────────────────────
// interface CardProps {
//   index: number;
//   followup: string;
//   followup_topic: string;
//   start_date: string;
//   end_date: string;
//   remark: string;
//   isHistory: boolean;
//   onRemove: () => void;
// }

// const FollowupCard: React.FC<CardProps> = ({
//   followup, followup_topic, start_date, end_date, remark, isHistory, onRemove,
// }) => {
//   const [confirmDelete, setConfirmDelete] = useState(false);
//   const { bg, text } = badgeColor(followup);

//   return (
//     <div style={{
//       background: isHistory ? "#fafafa" : "#fff",
//       border: `1px solid ${isHistory ? "#e5e7eb" : "#dbeafe"}`,
//       borderRadius: "10px", padding: "14px 16px",
//       display: "flex", flexDirection: "column", gap: "8px",
//       boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//       opacity: isHistory ? 0.85 : 1, position: "relative",
//     }}>
//       {isHistory && (
//         <div style={{
//           position: "absolute", top: 0, right: 0,
//           background: "#6b7280", color: "#fff",
//           fontSize: "9px", fontWeight: 700, padding: "2px 8px",
//           borderRadius: "0 10px 0 8px", letterSpacing: "0.5px", textTransform: "uppercase",
//         }}>Past</div>
//       )}
//       <span style={{ background: bg, color: text, fontSize: "11px", fontWeight: 600,
//         padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.3px",
//         whiteSpace: "nowrap", display: "inline-block", alignSelf: "flex-start" }}>
//         {followup}
//       </span>
//       <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#111827", lineHeight: 1.4 }}>
//         {followup_topic}
//       </p>
//       <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "12px", color: "#374151" }}>
//         <span>📅</span><span>{fmt(start_date)}</span>
//         <span style={{ color: "#9ca3af" }}>→</span><span>{fmt(end_date)}</span>
//       </div>
//       {remark && (
//         <p style={{ margin: 0, fontSize: "12px", color: "#6b7280",
//           borderTop: "1px solid #f3f4f6", paddingTop: "8px", lineHeight: 1.5 }}>
//           {remark}
//         </p>
//       )}
//       <button onClick={() => { if (confirmDelete) { onRemove(); setConfirmDelete(false); } else setConfirmDelete(true); }}
//         style={{
//           marginTop: "4px", display: "flex", alignItems: "center", justifyContent: "center",
//           gap: "5px", width: "100%", padding: "7px 0",
//           background: confirmDelete ? "#fee2e2" : "#fff1f2",
//           border: `1px solid ${confirmDelete ? "#fca5a5" : "#fecdd3"}`,
//           borderRadius: "7px", color: "#e11d48", fontSize: "12px", fontWeight: 600, cursor: "pointer",
//         }}>
//         {confirmDelete ? "Click again to confirm" : "🗑️ Remove"}
//       </button>
//     </div>
//   );
// };

// // ── History drawer ────────────────────────────────────────────────────────────
// interface HistoryPanelProps {
//   items: any[];
//   onClose: () => void;
//   onRemove: (i: number) => void;
// }

// const HistoryPanel: React.FC<HistoryPanelProps> = ({ items, onClose, onRemove }) => (
//   <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", justifyContent: "flex-end" }}>
//     <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
//     <div style={{
//       position: "relative", zIndex: 1, width: "360px", maxWidth: "90vw",
//       background: "#fff", boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
//       display: "flex", flexDirection: "column", borderRadius: "16px 0 0 16px", overflow: "hidden",
//     }}>
//       <div style={{ padding: "18px 20px", background: "#1e293b",
//         display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <div>
//           <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#fff" }}>Follow-up History</h3>
//           <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#94a3b8" }}>
//             {items.length} past follow-up{items.length !== 1 ? "s" : ""}
//           </p>
//         </div>
//         <button onClick={onClose} style={{
//           background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "8px",
//           color: "#fff", width: "32px", height: "32px", cursor: "pointer",
//           fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
//         }}>×</button>
//       </div>
//       <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
//         {items.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
//             <div style={{ fontSize: "32px", marginBottom: "8px" }}>📂</div>
//             <p style={{ margin: 0, fontSize: "13px" }}>No history yet</p>
//           </div>
//         ) : (
//           items.map((item, i) => (
//             <FollowupCard key={i} index={item.originalIndex}
//               followup={item.followup} followup_topic={item.followup_topic}
//               start_date={item.start_date} end_date={item.end_date}
//               remark={item.remark} isHistory={true}
//               onRemove={() => onRemove(item.originalIndex)} />
//           ))
//         )}
//       </div>
//     </div>
//   </div>
// );

// // ── Main container ────────────────────────────────────────────────────────────
// const EditUpcomingFollowups: React.FC = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector((state: RootState) => state.postEditOpportunityWorkspaceForm);
//   const allFollowups = formData?.opportunity_followup || [];

//   const [showHistory, setShowHistory] = useState(false);

//   const upcomingItems = allFollowups.map((f: any, i: number) => ({ ...f, originalIndex: i })).filter((f: any) => isUpcoming(f.end_date));
//   const historyItems  = allFollowups.map((f: any, i: number) => ({ ...f, originalIndex: i })).filter((f: any) => isExpired(f.end_date));

//   const handleRemove = (index: number) => dispatch(removeFollowup(index));

//   return (
//     <div style={{ background: "#ffffff", borderRadius: "12px", padding: "24px", height: "100%", boxSizing: "border-box" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
//         <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#111827", letterSpacing: "-0.2px" }}>
//           Upcoming Follow-ups
//         </h2>
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           {upcomingItems.length > 0 && (
//             <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: "11px", fontWeight: 700,
//               padding: "2px 9px", borderRadius: "20px" }}>
//               {upcomingItems.length}
//             </span>
//           )}
//           <button onClick={() => setShowHistory(true)} style={{
//             display: "flex", alignItems: "center", gap: "5px",
//             background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "8px",
//             padding: "5px 12px", fontSize: "12px", fontWeight: 600, color: "#475569", cursor: "pointer",
//           }}>
//             📂 History
//             {historyItems.length > 0 && (
//               <span style={{ background: "#6b7280", color: "#fff", fontSize: "10px", fontWeight: 700,
//                 padding: "1px 6px", borderRadius: "20px" }}>
//                 {historyItems.length}
//               </span>
//             )}
//           </button>
//         </div>
//       </div>

//       <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "10px 0 16px 0" }} />

//       {upcomingItems.length === 0 ? (
//         <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
//           justifyContent: "center", padding: "40px 20px", gap: "10px" }}>
//           <div style={{ fontSize: "36px", opacity: 0.3 }}>🔔</div>
//           <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af", fontWeight: 500 }}>No upcoming follow-ups</p>
//           <p style={{ margin: 0, fontSize: "12px", color: "#d1d5db" }}>Create a follow-up using the form</p>
//         </div>
//       ) : (
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//           gap: "12px", overflowY: "auto", maxHeight: "calc(100% - 70px)" }}>
//           {upcomingItems.map((item: any, i: number) => (
//             <FollowupCard key={i} index={item.originalIndex}
//               followup={item.followup} followup_topic={item.followup_topic}
//               start_date={item.start_date} end_date={item.end_date}
//               remark={item.remark} isHistory={false}
//               onRemove={() => handleRemove(item.originalIndex)} />
//           ))}
//         </div>
//       )}

//       {showHistory && (
//         <HistoryPanel items={historyItems} onClose={() => setShowHistory(false)} onRemove={handleRemove} />
//       )}
//     </div>
//   );
// };

// export default EditUpcomingFollowups;

// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../../../../app/store";
// import { removeFollowup } from "../../../../../slice/EditOpportunityWorkspace";
// import { FaFolderOpen, FaFolder } from "react-icons/fa";
// import styles from "./EditUpcomingFollowups.module.css";

// // ── helpers ──────────────────────────────────────────────────────────────────
// const fmt = (d: string) => {
//   if (!d) return "—";
//   const [y, m, day] = d.split("-");
//   const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//   return `${day} ${months[parseInt(m, 10) - 1]} ${y}`;
// };

// const today = () => new Date().toISOString().split("T")[0];
// const isExpired = (end_date: string) => !!end_date && end_date < today();
// const isUpcoming = (end_date: string) => !end_date || end_date >= today();

// const badgeColor = (type: string): { bg: string; text: string } => {
//   const map: Record<string, { bg: string; text: string }> = {
//     "Call":            { bg: "#eff6ff", text: "#2563eb" },
//     "Meeting":         { bg: "#fdf4ff", text: "#9333ea" },
//     "Demo":            { bg: "#fff7ed", text: "#ea580c" },
//     "Proposal":        { bg: "#f0fdf4", text: "#16a34a" },
//     "Negotiation":     { bg: "#fef9c3", text: "#854d0e" },
//     "Follow-up Email": { bg: "#fce7f3", text: "#be185d" },
//     "Site Visit":      { bg: "#ecfdf5", text: "#047857" },
//     "Other":           { bg: "#f3f4f6", text: "#374151" },
//   };
//   return map[type] ?? { bg: "#f3f4f6", text: "#374151" };
// };

// // ── FollowupCard ──────────────────────────────────────────────────────────────
// interface CardProps {
//   index: number;
//   followup: string;
//   followup_topic: string;
//   start_date: string;
//   end_date: string;
//   remark: string;
//   isHistory: boolean;
//   onRemove: () => void;
// }

// const FollowupCard: React.FC<CardProps> = ({
//   followup, followup_topic, start_date, end_date, remark, isHistory, onRemove,
// }) => {
//   const [confirmDelete, setConfirmDelete] = useState(false);
//   const { bg, text } = badgeColor(followup);

//   return (
//     <div className={styles.card}>
//       {isHistory && (
//         <div className={styles.pastBadge}>Past</div>
//       )}
      
//       <span className={styles.typeBadge} style={{ background: bg, color: text }}>
//         {followup}
//       </span>
      
//       <p className={styles.topicText}>{followup_topic}</p>
      
//       <div className={styles.dateRow}>
//         <span>📅</span>
//         <span>{fmt(start_date)}</span>
//         <span style={{ color: "#9ca3af" }}>→</span>
//         <span>{fmt(end_date)}</span>
//       </div>
      
//       {remark && (
//         <p className={styles.remarkText}>{remark}</p>
//       )}
      
//       <button 
//         onClick={() => { 
//           if (confirmDelete) { 
//             onRemove(); 
//             setConfirmDelete(false); 
//           } else {
//             setConfirmDelete(true); 
//           }
//         }}
//         className={styles.deleteBtn}
//         style={{
//           background: confirmDelete ? "#fee2e2" : "#fff5f5",
//           borderColor: confirmDelete ? "#fca5a5" : "#fecaca",
//         }}
//       >
//         {confirmDelete ? "Click again to confirm" : "🗑️ Remove"}
//       </button>
//     </div>
//   );
// };

// // ── Main container ────────────────────────────────────────────────────────────
// const EditUpcomingFollowups: React.FC = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector((state: RootState) => state.postEditOpportunityWorkspaceForm);
//   const allFollowups = formData?.opportunity_followup || [];

//   const [showHistory, setShowHistory] = useState(false);

//   // Map to preserve original index for Redux deletion, then filter based on the toggle
//   const displayFollowups = allFollowups
//     .map((f: any, i: number) => ({ ...f, originalIndex: i }))
//     .filter((f: any) => showHistory ? isExpired(f.end_date) : isUpcoming(f.end_date));

//   const handleRemove = (index: number) => dispatch(removeFollowup(index));

//   return (
//     <div className={styles.container}>
//       {/* Header */}
//       <div className={styles.header}>
//         <h2 className={styles.heading}>
//           {showHistory ? "Follow-up History" : "Upcoming Follow-ups"}
//           {!showHistory && displayFollowups.length > 0 && (
//             <span className={styles.countBadge}>{displayFollowups.length}</span>
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
//       {displayFollowups.length === 0 ? (
//         <div className={styles.emptyState}>
//           <div className={styles.emptyIconWrap}>
//             {/* Bell Icon for Follow-ups */}
//             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
//               <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
//             </svg>
//           </div>
//           <p className={styles.emptyText}>
//             {showHistory ? "No past follow-ups" : "No upcoming follow-ups"}
//           </p>
//           <p className={styles.emptySubText}>
//             {showHistory ? "Expired follow-ups will appear here" : "Create a follow-up using the form"}
//           </p>
//         </div>
//       ) : (
//         <div className={styles.grid}>
//           {displayFollowups.map((item: any) => (
//             <FollowupCard 
//               key={item.originalIndex} 
//               index={item.originalIndex}
//               followup={item.followup} 
//               followup_topic={item.followup_topic}
//               start_date={item.start_date} 
//               end_date={item.end_date}
//               remark={item.remark} 
//               isHistory={showHistory}
//               onRemove={() => handleRemove(item.originalIndex)} 
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default EditUpcomingFollowups;






import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../../../../app/store";
import { removeFollowup } from "../../../../../slice/EditOpportunityWorkspace";
import { FaFolderOpen, FaFolder } from "react-icons/fa";
import { PhoneCall } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${day} ${months[parseInt(m, 10) - 1]} ${y}`;
};

const today = () => new Date().toISOString().split("T")[0];
const isExpired  = (end_date: string) => !!end_date && end_date < today();
const isUpcoming = (end_date: string) => !end_date || end_date >= today();

// ─── Badge colors ─────────────────────────────────────────────────────────────

const badgeColor = (type: string): { bg: string; text: string } => {
  const map: Record<string, { bg: string; text: string }> = {
    "Call":            { bg: "#eff6ff", text: "#2563eb" },
    "Meeting":         { bg: "#fdf4ff", text: "#9333ea" },
    "Demo":            { bg: "#fff7ed", text: "#ea580c" },
    "Proposal":        { bg: "#f0fdf4", text: "#16a34a" },
    "Negotiation":     { bg: "#fef9c3", text: "#854d0e" },
    "Follow-up Email": { bg: "#fce7f3", text: "#be185d" },
    "Site Visit":      { bg: "#ecfdf5", text: "#047857" },
    "Other":           { bg: "#f3f4f6", text: "#374151" },
  };
  return map[type] ?? { bg: "#f3f4f6", text: "#374151" };
};

// ─── FollowupCard ─────────────────────────────────────────────────────────────

interface CardProps {
  index:          number;
  followup:       string;
  followup_topic: string;
  start_date:     string;
  end_date:       string;
  remark:         string;
  isHistory:      boolean;
  onRemove:       () => void;
}

const FollowupCard: React.FC<CardProps> = ({
  followup, followup_topic, start_date, end_date, remark, isHistory, onRemove,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { bg, text } = badgeColor(followup);

  return (
    <div className={`rounded-xl border-2 shadow-md overflow-hidden transition-all duration-200 ${
      isHistory ? 'opacity-80 border-slate-200' : 'border-violet-100 hover:shadow-lg hover:border-violet-300'
    }`}>
      {/* Card Header */}
      <div className={`px-3 py-2 flex items-center justify-between ${
        isHistory
          ? 'bg-gradient-to-r from-slate-600 to-slate-500'
          : 'bg-gradient-to-r from-violet-600 to-indigo-500'
      }`}>
        <span
          className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
          style={{ background: bg, color: text, borderColor: `${text}33` }}
        >
          {followup}
        </span>
        {isHistory && (
          <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">Past</span>
        )}
      </div>

      {/* Card Body */}
      <div className="bg-white px-3 py-3 flex flex-col gap-2">
        {/* Topic */}
        <p className="text-xs font-bold text-slate-800 leading-snug m-0">{followup_topic}</p>

        {/* Date range */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <span>📅</span>
          <span className="font-semibold">{fmt(start_date)}</span>
          <span className="text-slate-400">→</span>
          <span className="font-semibold">{fmt(end_date)}</span>
        </div>

        {/* Remark */}
        {remark && (
          <p className="text-xs text-slate-600 bg-violet-50 border border-violet-100 rounded-lg px-2.5 py-1.5 leading-relaxed m-0">
            {remark}
          </p>
        )}

        {/* Delete Button */}
        <button
          onClick={() => {
            if (confirmDelete) { onRemove(); setConfirmDelete(false); }
            else setConfirmDelete(true);
          }}
          className={`mt-1 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-colors duration-150
            ${confirmDelete
              ? 'bg-red-100 border-2 border-red-300 text-red-600'
              : 'bg-red-50 border-2 border-red-100 text-red-500 hover:bg-red-100 hover:border-red-200'}`}
        >
          🗑️ {confirmDelete ? "Click again to confirm" : "Remove"}
        </button>
      </div>
    </div>
  );
};

// ─── Main Container ───────────────────────────────────────────────────────────

const EditUpcomingFollowups: React.FC = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.postEditOpportunityWorkspaceForm);
  const allFollowups = formData?.opportunity_followup || [];

  const [showHistory, setShowHistory] = useState(false);

  // Map to preserve original index for Redux deletion, then filter based on the toggle
  const displayFollowups = allFollowups
    .map((f: any, i: number) => ({ ...f, originalIndex: i }))
    .filter((f: any) => showHistory ? isExpired(f.end_date) : isUpcoming(f.end_date));

  const handleRemove = (index: number) => dispatch(removeFollowup(index));

  return (
    <div className="rounded-2xl border-2 border-violet-100 shadow-lg overflow-hidden h-full flex flex-col">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 flex items-center justify-between shrink-0 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <PhoneCall size={15} color="white" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">
            {showHistory ? "Follow-up History" : "Upcoming Follow-ups"}
          </h2>
          {!showHistory && displayFollowups.length > 0 && (
            <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/30">
              {displayFollowups.length}
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
        {displayFollowups.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 py-10">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-1">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <p className="text-sm text-slate-500 font-semibold m-0">
              {showHistory ? "No past follow-ups" : "No upcoming follow-ups"}
            </p>
            <p className="text-xs text-slate-400 m-0">
              {showHistory ? "Expired follow-ups will appear here" : "Create a follow-up using the form"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pr-1">
            {displayFollowups.map((item: any) => (
              <FollowupCard
                key={item.originalIndex}
                index={item.originalIndex}
                followup={item.followup}
                followup_topic={item.followup_topic}
                start_date={item.start_date}
                end_date={item.end_date}
                remark={item.remark}
                isHistory={showHistory}
                onRemove={() => handleRemove(item.originalIndex)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default EditUpcomingFollowups;