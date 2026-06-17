// // src/features/OpportunityWorkspace/components/Bar/Componetns/FollowupCreation/UpcomingFollowups/UpcomingFollowups.tsx

// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../../../../app/store";
// import { removeFollowup } from "../../../../../slice/opportunitySlice";

// // ── helpers ──────────────────────────────────────────────────────────────────
// const fmt = (d: string) => {
//   if (!d) return "—";
//   const [y, m, day] = d.split("-");
//   const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//   return `${day} ${months[parseInt(m) - 1]} ${y}`;
// };

// const today = () => new Date().toISOString().split("T")[0];

// const isExpired  = (end_date: string) => !!end_date && end_date < today();
// const isUpcoming = (end_date: string) => !end_date || end_date >= today();

// // ── badge palette ─────────────────────────────────────────────────────────────
// const badgeColor = (type: string): { bg: string; text: string } => {
//   const map: Record<string, { bg: string; text: string }> = {
//     "Call":              { bg: "#eff6ff", text: "#2563eb" },
//     "Meeting":           { bg: "#fdf4ff", text: "#9333ea" },
//     "Demo":              { bg: "#fff7ed", text: "#ea580c" },
//     "Proposal":          { bg: "#f0fdf4", text: "#16a34a" },
//     "Negotiation":       { bg: "#fef9c3", text: "#854d0e" },
//     "Follow-up Email":   { bg: "#fce7f3", text: "#be185d" },
//     "Site Visit":        { bg: "#ecfdf5", text: "#047857" },
//     "Other":             { bg: "#f3f4f6", text: "#374151" },
//   };
//   return map[type] ?? { bg: "#f3f4f6", text: "#374151" };
// };

// // ── FollowupCard ──────────────────────────────────────────────────────────────
// interface CardProps {
//   index:          number;
//   followup:       string;
//   followup_topic: string;
//   start_date:     string;
//   end_date:       string;
//   remark:         string;
//   isHistory:      boolean;
//   onRemove:       () => void;
// }

// const FollowupCard: React.FC<CardProps> = ({
//   followup, followup_topic, start_date, end_date, remark, isHistory, onRemove,
// }) => {
//   const [confirmDelete, setConfirmDelete] = useState(false);
//   const { bg, text } = badgeColor(followup);

//   const handleDelete = () => {
//     if (confirmDelete) { onRemove(); setConfirmDelete(false); }
//     else setConfirmDelete(true);
//   };

//   return (
//     <div style={{
//       background: isHistory ? "#fafafa" : "#fff",
//       border: `1px solid ${isHistory ? "#e5e7eb" : "#dbeafe"}`,
//       borderRadius: "10px",
//       padding: "14px 16px",
//       display: "flex",
//       flexDirection: "column",
//       gap: "8px",
//       boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//       opacity: isHistory ? 0.85 : 1,
//       position: "relative",
//     }}>

//       {/* history ribbon */}
//       {isHistory && (
//         <div style={{
//           position: "absolute", top: 0, right: 0,
//           background: "#6b7280", color: "#fff",
//           fontSize: "9px", fontWeight: 700,
//           padding: "2px 8px",
//           borderRadius: "0 10px 0 8px",
//           letterSpacing: "0.5px",
//           textTransform: "uppercase",
//         }}>
//           Past
//         </div>
//       )}

//       {/* Type badge + topic */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
//         <span style={{
//           background: bg, color: text,
//           fontSize: "11px", fontWeight: 600,
//           padding: "3px 10px", borderRadius: "20px",
//           letterSpacing: "0.3px", whiteSpace: "nowrap",
//         }}>
//           {followup}
//         </span>
//       </div>

//       {/* Topic */}
//       <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#111827", lineHeight: 1.4 }}>
//         {followup_topic}
//       </p>

//       {/* Date range */}
//       <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "12px", color: "#374151" }}>
//         <span>📅</span>
//         <span>{fmt(start_date)}</span>
//         <span style={{ color: "#9ca3af" }}>→</span>
//         <span>{fmt(end_date)}</span>
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
//           background: confirmDelete ? "#fee2e2" : "#fff1f2",
//           border: `1px solid ${confirmDelete ? "#fca5a5" : "#fecdd3"}`,
//           borderRadius: "7px",
//           color: "#e11d48",
//           fontSize: "12px",
//           fontWeight: 600,
//           cursor: "pointer",
//           transition: "background 0.15s, border-color 0.15s",
//         }}
//         onMouseEnter={e => { e.currentTarget.style.background = "#ffe4e6"; }}
//         onMouseLeave={e => { e.currentTarget.style.background = confirmDelete ? "#fee2e2" : "#fff1f2"; }}
//       >
//         {confirmDelete ? "Click again to confirm delete" : "🗑️ Remove"}
//       </button>
//     </div>
//   );
// };

// // ── HistoryPanel (slide-in drawer) ────────────────────────────────────────────
// interface HistoryPanelProps {
//   items: { followup: string; followup_topic: string; start_date: string; end_date: string; remark: string; originalIndex: number }[];
//   onClose: () => void;
//   onRemove: (i: number) => void;
// }

// const HistoryPanel: React.FC<HistoryPanelProps> = ({ items, onClose, onRemove }) => (
//   <div style={{
//     position: "fixed", inset: 0, zIndex: 1000,
//     display: "flex", justifyContent: "flex-end",
//   }}>
//     {/* overlay */}
//     <div
//       onClick={onClose}
//       style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }}
//     />

//     {/* drawer */}
//     <div style={{
//       position: "relative", zIndex: 1,
//       width: "360px", maxWidth: "90vw",
//       background: "#fff",
//       boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
//       display: "flex", flexDirection: "column",
//       borderRadius: "16px 0 0 16px",
//       overflow: "hidden",
//     }}>
//       {/* Header */}
//       <div style={{
//         padding: "18px 20px",
//         background: "#1e293b",
//         display: "flex", justifyContent: "space-between", alignItems: "center",
//       }}>
//         <div>
//           <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#fff" }}>
//             Follow-up History
//           </h3>
//           <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#94a3b8" }}>
//             {items.length} past follow-up{items.length !== 1 ? "s" : ""}
//           </p>
//         </div>
//         <button
//           onClick={onClose}
//           style={{
//             background: "rgba(255,255,255,0.12)", border: "none",
//             borderRadius: "8px", color: "#fff",
//             width: "32px", height: "32px",
//             cursor: "pointer", fontSize: "16px",
//             display: "flex", alignItems: "center", justifyContent: "center",
//           }}
//         >
//           ×
//         </button>
//       </div>

//       {/* Cards */}
//       <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
//         {items.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
//             <div style={{ fontSize: "32px", marginBottom: "8px" }}>📂</div>
//             <p style={{ margin: 0, fontSize: "13px" }}>No history yet</p>
//           </div>
//         ) : (
//           items.map((item, i) => (
//             <FollowupCard
//               key={i}
//               index={item.originalIndex}
//               followup={item.followup}
//               followup_topic={item.followup_topic}
//               start_date={item.start_date}
//               end_date={item.end_date}
//               remark={item.remark}
//               isHistory={true}
//               onRemove={() => onRemove(item.originalIndex)}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   </div>
// );

// // ── UpcomingFollowups (main container) ────────────────────────────────────────
// const UpcomingFollowups: React.FC = () => {
//   const dispatch   = useDispatch();
//   const { formData } = useSelector((state: RootState) => state.postOpportunityWorkspaceData);
//   const allFollowups = formData?.opportunity_followup || [];

//   const [showHistory, setShowHistory] = useState(false);

//   const upcomingItems = allFollowups
//     .map((f, i) => ({ ...f, originalIndex: i }))
//     .filter(f => isUpcoming(f.end_date));

//   const historyItems = allFollowups
//     .map((f, i) => ({ ...f, originalIndex: i }))
//     .filter(f => isExpired(f.end_date));

//   const handleRemove = (index: number) => dispatch(removeFollowup(index));

//   return (
//     <div style={{ background: "#ffffff", borderRadius: "12px", padding: "24px", height: "100%", boxSizing: "border-box" }}>

//       {/* Title row */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
//         <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#111827", letterSpacing: "-0.2px" }}>
//           Upcoming Follow-ups
//         </h2>
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           {upcomingItems.length > 0 && (
//             <span style={{
//               background: "#eff6ff", color: "#2563eb",
//               fontSize: "11px", fontWeight: 700,
//               padding: "2px 9px", borderRadius: "20px",
//             }}>
//               {upcomingItems.length}
//             </span>
//           )}
//           {/* History button */}
//           <button
//             onClick={() => setShowHistory(true)}
//             style={{
//               display: "flex", alignItems: "center", gap: "5px",
//               background: "#f1f5f9",
//               border: "1px solid #e2e8f0",
//               borderRadius: "8px",
//               padding: "5px 12px",
//               fontSize: "12px", fontWeight: 600,
//               color: "#475569",
//               cursor: "pointer",
//               transition: "background 0.15s",
//               position: "relative",
//             }}
//             onMouseEnter={e => { e.currentTarget.style.background = "#e2e8f0"; }}
//             onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; }}
//           >
//             📂 History
//             {historyItems.length > 0 && (
//               <span style={{
//                 background: "#6b7280", color: "#fff",
//                 fontSize: "10px", fontWeight: 700,
//                 padding: "1px 6px", borderRadius: "20px",
//                 minWidth: "16px", textAlign: "center",
//               }}>
//                 {historyItems.length}
//               </span>
//             )}
//           </button>
//         </div>
//       </div>

//       <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "10px 0 16px 0" }} />

//       {/* Upcoming cards grid */}
//       {upcomingItems.length === 0 ? (
//         <div style={{
//           display: "flex", flexDirection: "column", alignItems: "center",
//           justifyContent: "center", padding: "40px 20px", gap: "10px",
//         }}>
//           <div style={{ fontSize: "36px", opacity: 0.3 }}>🔔</div>
//           <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af", fontWeight: 500 }}>No upcoming follow-ups</p>
//           <p style={{ margin: 0, fontSize: "12px", color: "#d1d5db" }}>Create a follow-up using the form</p>
//         </div>
//       ) : (
//         <div style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//           gap: "12px",
//           overflowY: "auto",
//           maxHeight: "calc(100% - 70px)",
//         }}>
//           {upcomingItems.map((item, i) => (
//             <FollowupCard
//               key={i}
//               index={item.originalIndex}
//               followup={item.followup}
//               followup_topic={item.followup_topic}
//               start_date={item.start_date}
//               end_date={item.end_date}
//               remark={item.remark}
//               isHistory={false}
//               onRemove={() => handleRemove(item.originalIndex)}
//             />
//           ))}
//         </div>
//       )}

//       {/* History drawer */}
//       {showHistory && (
//         <HistoryPanel
//           items={historyItems}
//           onClose={() => setShowHistory(false)}
//           onRemove={handleRemove}
//         />
//       )}
//     </div>
//   );
// };

// export default UpcomingFollowups;







import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../../../../app/store";
import { removeFollowup } from "../../../../../slice/opportunitySlice";
import { PhoneCall, FolderOpen, X } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${day} ${months[parseInt(m) - 1]} ${y}`;
};

const today = () => new Date().toISOString().split("T")[0];
const isExpired  = (end_date: string) => !!end_date && end_date < today();
const isUpcoming = (end_date: string) => !end_date || end_date >= today();

// ─── Badge colors ─────────────────────────────────────────────────────────────

const badgeClass = (type: string): string => {
  const map: Record<string, string> = {
    "Call":            "bg-blue-100 text-blue-700 border-blue-200",
    "Meeting":         "bg-purple-100 text-purple-700 border-purple-200",
    "Demo":            "bg-orange-100 text-orange-700 border-orange-200",
    "Proposal":        "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Negotiation":     "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Follow-up Email": "bg-pink-100 text-pink-700 border-pink-200",
    "Site Visit":      "bg-teal-100 text-teal-700 border-teal-200",
    "Other":           "bg-slate-100 text-slate-600 border-slate-200",
  };
  return map[type] ?? "bg-indigo-100 text-indigo-700 border-indigo-200";
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

  const handleDelete = () => {
    if (confirmDelete) { onRemove(); setConfirmDelete(false); }
    else setConfirmDelete(true);
  };

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
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 bg-white/20 text-white`}>
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
          onClick={handleDelete}
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

// ─── History Panel ────────────────────────────────────────────────────────────

interface HistoryPanelProps {
  items: { followup: string; followup_topic: string; start_date: string; end_date: string; remark: string; originalIndex: number }[];
  onClose: () => void;
  onRemove: (i: number) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ items, onClose, onRemove }) => (
  <div className="fixed inset-0 z-[1000] flex justify-end">
    {/* Overlay */}
    <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

    {/* Drawer */}
    <div className="relative z-10 w-[360px] max-w-[90vw] bg-white shadow-2xl flex flex-col rounded-l-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <FolderOpen size={14} color="white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white m-0">Follow-up History</h3>
            <p className="text-xs text-slate-400 m-0">{items.length} past follow-up{items.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <button onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors">
          <X size={15} />
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">📂</div>
            <p className="text-sm font-semibold text-slate-500 m-0">No history yet</p>
          </div>
        ) : (
          items.map((item, i) => (
            <FollowupCard
              key={i}
              index={item.originalIndex}
              followup={item.followup}
              followup_topic={item.followup_topic}
              start_date={item.start_date}
              end_date={item.end_date}
              remark={item.remark}
              isHistory={true}
              onRemove={() => onRemove(item.originalIndex)}
            />
          ))
        )}
      </div>
    </div>
  </div>
);

// ─── UpcomingFollowups ────────────────────────────────────────────────────────

const UpcomingFollowups: React.FC = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.postOpportunityWorkspaceData);
  const allFollowups = Array.isArray(formData?.opportunity_followup)
    ? formData.opportunity_followup
    : [];

  const [showHistory, setShowHistory] = useState(false);

  const upcomingItems = allFollowups.map((f, i) => ({ ...f, originalIndex: i })).filter(f => isUpcoming(f.end_date));
  const historyItems  = allFollowups.map((f, i) => ({ ...f, originalIndex: i })).filter(f => isExpired(f.end_date));

  const handleRemove = (index: number) => dispatch(removeFollowup(index));

  return (
    <div className="rounded-2xl border-2 border-violet-100 shadow-lg overflow-hidden h-full flex flex-col">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 flex items-center justify-between shrink-0 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <PhoneCall size={15} color="white" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">Upcoming Follow-ups</h2>
          {upcomingItems.length > 0 && (
            <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/30">
              {upcomingItems.length}
            </span>
          )}
        </div>
        {/* History Button */}
        <button
          onClick={() => setShowHistory(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors"
        >
          <FolderOpen size={12} /> History
          {historyItems.length > 0 && (
            <span className="bg-white/30 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">
              {historyItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4 flex-1 flex flex-col overflow-hidden rounded-b-2xl">
        {upcomingItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 py-10">
            <div className="text-4xl opacity-30">🔔</div>
            <p className="text-sm text-slate-400 font-semibold m-0">No upcoming follow-ups</p>
            <p className="text-xs text-slate-300 m-0">Create a follow-up using the form</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto">
            {upcomingItems.map((item, i) => (
              <FollowupCard
                key={i}
                index={item.originalIndex}
                followup={item.followup}
                followup_topic={item.followup_topic}
                start_date={item.start_date}
                end_date={item.end_date}
                remark={item.remark}
                isHistory={false}
                onRemove={() => handleRemove(item.originalIndex)}
              />
            ))}
          </div>
        )}
      </div>

      {/* History Drawer */}
      {showHistory && (
        <HistoryPanel
          items={historyItems}
          onClose={() => setShowHistory(false)}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
};

export default UpcomingFollowups;
