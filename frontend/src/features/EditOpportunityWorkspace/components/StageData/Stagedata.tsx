// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import styles from "./Stagedata.module.css"; // Importing the CSS module
// import type { RootState } from "../../../../app/store";
// import { addStage, updateStatus } from "../../slice/EditOpportunityWorkspace";

// const stageOrder = [
//   "Introduction Meeting",
//   "Demo",
//   "Quote Submit",
//   "Negotiation",
//   "Order Achievement",
// ];

// const stageRankMap: { [key: string]: string } = {
//   "Introduction Meeting": "Rank E",
//   "Demo": "Rank D",
//   "Quote Submit": "Rank C",
//   "Negotiation": "Rank B",
//   "Order Achievement": "Rank A",
// };

// const statusMap: { [key: string]: string } = {
//   "Rank D": "progress",
//   "Rank C": "progress",
//   "Rank B": "negotiation",
//   "Rank A": "won",
// };

// const StageData: React.FC = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector(
//     (state: RootState) => state.postEditOpportunityWorkspaceForm
//   );

//   const currentStage = formData?.opportunity_stages?.[0]?.stages || ""; // Default to empty string if not available
//   const initialLostReason = formData?.opportunity_stages?.[0]?.lost_reason || ""; // Default to empty string if not available

//   const [stage, setStage] = useState<string>(currentStage);
//   const [lostReason, setLostReason] = useState<string>(initialLostReason);
//   const [showLostReason, setShowLostReason] = useState<boolean>(
//     !!initialLostReason
//   ); // Set true if initialLostReason is not empty
//   const rank = stageRankMap[stage] || "";
//   const newStatus = statusMap[rank] || formData?.status || "";
//   // Dispatch addStage whenever stage or lostReason changes
//   useEffect(() => {
//     const stageData = {
//       stages: stage,
//       ranks: stageRankMap[stage] || "",
//       lost_reason: showLostReason ? lostReason : "",
//     };

//     if (stage) {
//       dispatch(addStage(stageData));
//       dispatch(updateStatus(newStatus));
//     }
//   }, [stage, lostReason, showLostReason, dispatch]);

//   const handleStageChange = (selectedStage: string) => {
//     setStage(selectedStage);
//   };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const isLost = e.target.value === "yes";
//     setShowLostReason(isLost);
//     if (!isLost) {
//       setLostReason("");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <p className={styles.heading}>Stage</p>
//       </div>
//       <div className={styles.line}></div>
//       <form className={styles.form}>
//         <div className={styles.formRow}>
//           <label htmlFor="stage" className={styles.label}>
//             Stage:
//           </label>
//           <select
//             id="stage"
//             value={stage || ""}
//             onChange={(e) => handleStageChange(e.target.value)}
//             className={`${styles.select} ${ stage === '' ? styles.defaultselect : ''}`}
//             required
//           >
//             <option value="" disabled>
//               Select an option
//             </option>
//             {stageOrder.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className={styles.formRow}>
//           <label htmlFor="rank" className={styles.label}>
//             Rank:
//           </label>
//           <input
//             type="text"
//             id="rank"
//             value={stageRankMap[stage] || ""}
//             readOnly
//             className={styles.input}
//           />
//         </div>

//         <div className={styles.formRow}>
//           <label className={styles.label}>Lost Reason:</label>
//           <div className={styles.checkboxGroup}>
//             <label>
//               <input
//                 type="radio"
//                 name="lostReason"
//                 value="yes"
//                 checked={showLostReason}
//                 onChange={handleCheckboxChange}
//               />{" "}
//               Yes
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="lostReason"
//                 value="no"
//                 checked={!showLostReason}
//                 onChange={handleCheckboxChange}
//               />{" "}
//               No
//             </label>
//           </div>
//         </div>

//         {showLostReason && (
//           <div className={styles.formRow}>
//             <label htmlFor="lost_reason" className={styles.label}>
//               Lost Reason:
//             </label>
//             <input
//               type="text"
//               id="lost_reason"
//               value={lostReason || ""}
//               onChange={(e) => setLostReason(e.target.value)}
//               className={styles.input}
//               placeholder="Enter lost reason"
//               required={showLostReason}
//             />
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default StageData;

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import styles from "./Stagedata.module.css"; 
// import type { RootState } from "../../../../app/store";
// import { addStage, updateStatus } from "../../slice/EditOpportunityWorkspace";

// const stageOrder = [
//   "Introduction Meeting",
//   "Demo",
//   "Quote Submit",
//   "Negotiation",
//   "Order Achievement",
// ];

// const stageRankMap: { [key: string]: string } = {
//   "Introduction Meeting": "Rank E",
//   "Demo": "Rank D",
//   "Quote Submit": "Rank C",
//   "Negotiation": "Rank B",
//   "Order Achievement": "Rank A",
// };

// const statusMap: { [key: string]: string } = {
//   "Rank D": "progress",
//   "Rank C": "progress",
//   "Rank B": "negotiation",
//   "Rank A": "won",
// };

// // ── New Lost Reasons List ─────────────────────────────────────────────────────
// const LOST_REASONS = [
//   "Due to competitive pricing value",
//   "Due to late introduction",
//   "Due to out of scope",
//   "Due to less knowledge and know-how",
//   "Due to project cancellations",
//   "Others",
// ];

// const StageData: React.FC = () => {
//   const dispatch = useDispatch();
//   const { formData } = useSelector(
//     (state: RootState) => state.postEditOpportunityWorkspaceForm
//   );

//   const [stage, setStage] = useState<string>("");
//   const [lostReason, setLostReason] = useState<string>("");
//   const [showLostReason, setShowLostReason] = useState<boolean>(false);

//   // Sync state with Redux formData on initial load and updates
//   useEffect(() => {
//     if (formData && formData.opportunity_stages?.length > 0) {
//       const dbStage = formData.opportunity_stages[0].stages || "";
//       const dbReason = formData.opportunity_stages[0].lost_reason || "";
      
//       setStage(dbStage);
//       setLostReason(dbReason);
//       setShowLostReason(!!dbReason.trim());
//     }
//   }, [formData]);

//   // Handle Dispatch logic for Stage, Rank, and Status
//   useEffect(() => {
//     if (!stage) return;

//     const rank = stageRankMap[stage] || "";
    
//     // Logic: If Lost Reason toggle is "Yes", status is "lost". 
//     // Otherwise, use the standard mapping.
//     const calculatedStatus = showLostReason ? "lost" : (statusMap[rank] || formData?.status || "pending");

//     const stageData = {
//       stages: stage,
//       ranks: rank,
//       lost_reason: showLostReason ? lostReason : "",
//     };

//     dispatch(addStage(stageData));
//     dispatch(updateStatus(calculatedStatus));
    
//   }, [stage, lostReason, showLostReason, dispatch, formData?.status]);

//   const handleStageChange = (selectedStage: string) => {
//     setStage(selectedStage);
//   };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const isLost = e.target.value === "yes";
//     setShowLostReason(isLost);
    
//     if (!isLost) {
//       setLostReason("");
//     } else {
//       // Default to first reason if current reason is empty
//       if (!lostReason) setLostReason(LOST_REASONS[0]);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <p className={styles.heading}>Stage</p>
//       </div>
//       <div className={styles.line}></div>
//       <form className={styles.form}>
        
//         {/* Stage Selection */}
//         <div className={styles.formRow}>
//           <label htmlFor="stage" className={styles.label}>
//             Stage:
//           </label>
//           <select
//             id="stage"
//             value={stage || ""}
//             onChange={(e) => handleStageChange(e.target.value)}
//             className={`${styles.select} ${ stage === '' ? styles.defaultselect : ''}`}
//             required
//           >
//             <option value="" disabled>
//               Select an option
//             </option>
//             {stageOrder.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Rank Display (Read-Only) */}
//         <div className={styles.formRow}>
//           <label htmlFor="rank" className={styles.label}>
//             Rank:
//           </label>
//           <input
//             type="text"
//             id="rank"
//             value={stageRankMap[stage] || ""}
//             readOnly
//             className={styles.input}
//             style={{ backgroundColor: "#f9f9f9", cursor: "not-allowed" }}
//           />
//         </div>

//         {/* Lost Opportunity Toggle */}
//         <div className={styles.formRow}>
//           <label className={styles.label}>Lost Opportunity?</label>
//           <div className={styles.checkboxGroup}>
//             <label>
//               <input
//                 type="radio"
//                 name="userLostToggle"
//                 value="yes"
//                 checked={showLostReason}
//                 onChange={handleCheckboxChange}
//               />{" "}
//               Yes
//             </label>
//             <label style={{ marginLeft: "15px" }}>
//               <input
//                 type="radio"
//                 name="userLostToggle"
//                 value="no"
//                 checked={!showLostReason}
//                 onChange={handleCheckboxChange}
//               />{" "}
//               No
//             </label>
//           </div>
//         </div>

//         {/* New Lost Reasons Dropdown */}
//         {showLostReason && (
//           <div className={styles.formRow}>
//             <label htmlFor="lost_reason" className={styles.label}>
//               Reason:
//             </label>
//             <select
//               id="lost_reason"
//               value={lostReason || ""}
//               onChange={(e) => setLostReason(e.target.value)}
//               className={styles.select}
//               required={showLostReason}
//             >
//               <option value="" disabled>
//                 Select a reason
//               </option>
//               {LOST_REASONS.map((reason) => (
//                 <option key={reason} value={reason}>
//                   {reason}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default StageData;




import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { addStage, updateStatus } from "../../slice/EditOpportunityWorkspace";
import { GitBranch } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const stageOrder = [
  "Introduction Meeting",
  "Demo",
  "Quote Submit",
  "Negotiation",
  "Order Achievement",
];

const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const stageRankMap: { [key: string]: string } = {
  "Introduction Meeting": "Rank E",
  "Demo":                 "Rank D",
  "Quote Submit":         "Rank C",
  "Negotiation":          "Rank B",
  "Order Achievement":    "Rank A",
};

const statusMap: { [key: string]: string } = {
  "Rank D": "progress",
  "Rank C": "progress",
  "Rank B": "negotiation",
  "Rank A": "won",
};

const LOST_REASONS = [
  "Due to competitive pricing value",
  "Due to late introduction",
  "Due to out of scope",
  "Due to less knowledge and know-how",
  "Due to project cancellations",
  "Others",
];

const rankColors: { [key: string]: string } = {
  "Rank E": "bg-slate-100 text-slate-600",
  "Rank D": "bg-blue-100 text-blue-700",
  "Rank C": "bg-violet-100 text-violet-700",
  "Rank B": "bg-indigo-100 text-indigo-700",
  "Rank A": "bg-emerald-100 text-emerald-700",
};

const getCurrentYear = () => new Date().getFullYear();

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200";

// ─── Component ────────────────────────────────────────────────────────────────

const StageData: React.FC = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector(
    (state: RootState) => state.postEditOpportunityWorkspaceForm
  );

  const [stage, setStage] = useState<string>("");
  const [stageMonth, setStageMonth] = useState<string>("");
  const [lostReason, setLostReason] = useState<string>("");
  const [showLostReason, setShowLostReason] = useState<boolean>(false);

  // ── Sync state with Redux formData on initial load and updates (unchanged) ──

  useEffect(() => {
    if (formData && formData.opportunity_stages?.length > 0) {
      const dbStage = formData.opportunity_stages[0].stages || "";
      const dbStageMonth = formData.opportunity_stages[0].month || "";
      const dbReason = formData.opportunity_stages[0].lost_reason || "";

      setStage(dbStage);
      setStageMonth(dbStageMonth);
      setLostReason(dbReason);
      setShowLostReason(!!dbReason.trim());
    }
  }, [formData]);

  // ── Dispatch logic for Stage, Rank, and Status (unchanged) ──────────────────

  useEffect(() => {
    if (!stage || !stageMonth) return;

    const rank = stageRankMap[stage] || "";
    const calculatedStatus = showLostReason
      ? "lost"
      : statusMap[rank] || formData?.status || "pending";

    const stageData = {
      stages: stage,
      month: stageMonth,
      ranks: rank,
      lost_reason: showLostReason ? lostReason : "",
    };

    dispatch(addStage(stageData));
    dispatch(updateStatus(calculatedStatus));
  }, [stage, stageMonth, lostReason, showLostReason, dispatch, formData?.status]);

  // ── Handlers (unchanged) ─────────────────────────────────────────────────

  const handleStageChange = (selectedStage: string) => setStage(selectedStage);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isLost = e.target.value === "yes";
    setShowLostReason(isLost);
    if (!isLost) {
      setLostReason("");
    } else {
      if (!lostReason) setLostReason(LOST_REASONS[0]);
    }
  };

  const rank = stageRankMap[stage] || "";
  const currentYear = getCurrentYear();

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-2xl border-2 border-indigo-100 shadow-lg overflow-hidden">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-3 flex items-center gap-2">
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
          <GitBranch size={15} color="white" />
        </div>
        <h2 className="text-sm font-bold text-white tracking-wide">Stage</h2>
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4">
        <form className="flex flex-col gap-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="stage" className="text-sm font-semibold text-slate-700">
                Stage <span className="text-red-500">*</span>
              </label>
              <select
                id="stage"
                value={stage || ""}
                onChange={(e) => handleStageChange(e.target.value)}
                required
                className={`${inputClass} [&>option]:text-slate-800 [&>option]:font-medium ${
                  !stage ? "text-slate-400 font-normal" : "text-slate-800"
                }`}
              >
                <option value="" disabled>Select an option</option>
                {stageOrder.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="stage_month" className="text-sm font-semibold text-slate-700">
                Month <span className="text-red-500">*</span>
              </label>
              <select
                id="stage_month"
                value={stageMonth}
                onChange={(e) => setStageMonth(e.target.value)}
                required
                className={`${inputClass} [&>option]:text-slate-800 [&>option]:font-medium ${
                  !stageMonth ? "text-slate-400 font-normal" : "text-slate-800"
                }`}
              >
                <option value="" disabled>Select month</option>
                {monthOptions.map((month) => (
                  <option key={month} value={`${month} ${currentYear}`}>{month} {currentYear}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Rank — display only */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rank" className="text-sm font-semibold text-slate-700">
              Rank
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                id="rank"
                value={rank}
                readOnly
                className={`${inputClass} cursor-default bg-slate-50`}
                placeholder="Auto-filled from stage"
              />
              {rank && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${rankColors[rank] ?? "bg-slate-100 text-slate-600"}`}>
                  {rank}
                </span>
              )}
            </div>
          </div>

          {/* Lost Opportunity Toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Lost Opportunity?</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="radio"
                  name="userLostToggle"
                  value="yes"
                  checked={showLostReason}
                  onChange={handleCheckboxChange}
                  className="accent-indigo-600 w-4 h-4"
                />
                Yes
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="radio"
                  name="userLostToggle"
                  value="no"
                  checked={!showLostReason}
                  onChange={handleCheckboxChange}
                  className="accent-indigo-600 w-4 h-4"
                />
                No
              </label>
            </div>
          </div>

          {/* Lost Reasons Dropdown — conditional */}
          {showLostReason && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lost_reason" className="text-sm font-semibold text-slate-700">
                Reason <span className="text-red-500">*</span>
              </label>
              <select
                id="lost_reason"
                value={lostReason || ""}
                onChange={(e) => setLostReason(e.target.value)}
                required={showLostReason}
                className={`${inputClass} [&>option]:text-slate-800 [&>option]:font-medium ${
                  !lostReason ? "text-slate-400 font-normal" : "text-slate-800"
                }`}
              >
                <option value="" disabled>Select a reason</option>
                {LOST_REASONS.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default StageData;
