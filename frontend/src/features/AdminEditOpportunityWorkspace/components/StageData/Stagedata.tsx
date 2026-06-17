// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import styles from "./Stagedata.module.css"; // Importing the CSS module
// import type { RootState } from "../../../../app/store";
// import { addStage, updateStatus } from "../../slice/AdminEditOpportunityWorkspaceSlice";

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
//     (state: RootState) => state.EditAdminOpportunityWorkspaceData
//   );

//   const currentStage = formData?.opportunity_stages?.[0]?.stages || ""; 

//   const [stage, setStage] = useState<string>(currentStage);
//   console.log('stage',stage)
//   const [lostReason, setLostReason] = useState<string>();
//   const [showLostReason, setShowLostReason] = useState<boolean>(false); 
//   const rank = stageRankMap[stage] || "";
//   const newStatus = statusMap[rank] || formData?.status || "";

//   useEffect(() => {
      
//     if(formData){
//       setStage(formData?.opportunity_stages?.[0]?.stages);
//       setLostReason(formData?.opportunity_stages?.[0]?.lost_reason);

//       if (formData?.opportunity_stages?.[0]?.lost_reason?.trim()) {
//         setShowLostReason(true);
//     } else {
//         setShowLostReason(false);
//     }  
//     }
 
//   }, [formData, dispatch]);

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
// import { addStage, updateStatus } from "../../slice/AdminEditOpportunityWorkspaceSlice";

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
//     (state: RootState) => state.EditAdminOpportunityWorkspaceData
//   );

//   const [stage, setStage] = useState<string>("");
//   const [lostReason, setLostReason] = useState<string>("");
//   const [showLostReason, setShowLostReason] = useState<boolean>(false); 

//   // Populate data from Redux on load
//   useEffect(() => {
//     if (formData) {
//       const currentStage = formData?.opportunity_stages?.[0]?.stages || "";
//       const currentLostReason = formData?.opportunity_stages?.[0]?.lost_reason || "";
      
//       setStage(currentStage);
//       setLostReason(currentLostReason);

//       if (currentLostReason.trim()) {
//         setShowLostReason(true);
//       } else {
//         setShowLostReason(false);
//       }
//     }
//   }, [formData]);

//   // Handle Dispatch logic
//   useEffect(() => {
//     if (!stage) return;

//     const rank = stageRankMap[stage] || "";
    
//     // Logic: If Lost Reason is active, status is "lost". 
//     // Otherwise, follow the rank-to-status map.
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
//         // Default to first reason if none selected
//         if(!lostReason) setLostReason(LOST_REASONS[0]);
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

//         {/* Rank Display (Read Only) */}
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
//             style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
//           />
//         </div>

//         {/* Lost Toggle */}
//         <div className={styles.formRow}>
//           <label className={styles.label}>Is it a Lost Opportunity?</label>
//           <div className={styles.checkboxGroup}>
//             <label>
//               <input
//                 type="radio"
//                 name="lostReasonToggle"
//                 value="yes"
//                 checked={showLostReason}
//                 onChange={handleCheckboxChange}
//               />{" "}
//               Yes
//             </label>
//             <label style={{ marginLeft: "15px" }}>
//               <input
//                 type="radio"
//                 name="lostReasonToggle"
//                 value="no"
//                 checked={!showLostReason}
//                 onChange={handleCheckboxChange}
//               />{" "}
//               No
//             </label>
//           </div>
//         </div>

//         {/* Predefined Lost Reasons Dropdown */}
//         {showLostReason && (
//           <div className={styles.formRow}>
//             <label htmlFor="lost_reason" className={styles.label}>
//               Lost Reason:
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
import { addStage, updateStatus } from "../../slice/AdminEditOpportunityWorkspaceSlice";
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

const rankColors: { [key: string]: string } = {
  "Rank E": "bg-slate-100 text-slate-600",
  "Rank D": "bg-blue-100 text-blue-700",
  "Rank C": "bg-violet-100 text-violet-700",
  "Rank B": "bg-indigo-100 text-indigo-700",
  "Rank A": "bg-emerald-100 text-emerald-700",
};

const statusMap: { [key: string]: string } = {
  "Rank D": "progress",
  "Rank C": "progress",
  "Rank B": "negotiation",
  "Rank A": "won",
};

// ── New Lost Reasons List ─────────────────────────────────────────────────────
const LOST_REASONS = [
  "Due to competitive pricing value",
  "Due to late introduction",
  "Due to out of scope",
  "Due to less knowledge and know-how",
  "Due to project cancellations",
  "Others",
];

const todayIsoDate = () => new Date().toISOString().slice(0, 10);
const getCurrentYear = () => new Date().getFullYear();

// ─── Style helper ─────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200";

const selectClass = (value: string) =>
  `w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200 [&>option]:text-slate-800 [&>option]:font-medium ${!value ? "text-slate-400 font-normal" : "text-slate-800"}`;

// ─── Component ────────────────────────────────────────────────────────────────

const StageData: React.FC = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector(
    (state: RootState) => state.EditAdminOpportunityWorkspaceData
  );

  const [stage, setStage] = useState<string>("");
  const [stageMonth, setStageMonth] = useState<string>("");
  const [lostReason, setLostReason] = useState<string>("");
  const [showLostReason, setShowLostReason] = useState<boolean>(false);

  // Populate data from Redux on load
  useEffect(() => {
    if (formData) {
      const currentStage = formData?.opportunity_stages?.[0]?.stages || "";
      const currentStageMonth = formData?.opportunity_stages?.[0]?.month || "";
      const currentLostReason = formData?.opportunity_stages?.[0]?.lost_reason || "";

      setStage(currentStage);
      setStageMonth(currentStageMonth);
      setLostReason(currentLostReason);

      if (currentLostReason.trim()) {
        setShowLostReason(true);
      } else {
        setShowLostReason(false);
      }
    }
  }, [formData]);

  // Handle Dispatch logic
  useEffect(() => {
    if (!stage || !stageMonth) return;

    const rank = stageRankMap[stage] || "";

    // Logic: If Lost Reason is active, status is "lost".
    // Otherwise, follow the rank-to-status map.
    const calculatedStatus = showLostReason ? "lost" : (statusMap[rank] || formData?.status || "pending");

    const stageData = {
      stages: stage,
      month: stageMonth,
      ranks: rank,
      lost_reason: showLostReason ? lostReason : "",
      last_update: todayIsoDate(),
    };

    dispatch(addStage(stageData));
    dispatch(updateStatus(calculatedStatus));

  }, [stage, stageMonth, lostReason, showLostReason, dispatch, formData?.status]);

  const handleStageChange = (selectedStage: string) => {
    setStage(selectedStage);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isLost = e.target.value === "yes";
    setShowLostReason(isLost);
    if (!isLost) {
      setLostReason("");
    } else {
      // Default to first reason if none selected
      if (!lostReason) setLostReason(LOST_REASONS[0]);
    }
  };

  const rank = stageRankMap[stage] || "";
  const currentYear = getCurrentYear();

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
                className={selectClass(stage)}
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
                className={selectClass(stageMonth)}
              >
                <option value="" disabled>Select month</option>
                {monthOptions.map((month) => (
                  <option key={month} value={`${month} ${currentYear}`}>{month} {currentYear}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Rank — Read Only */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rank" className="text-sm font-semibold text-slate-700">Rank</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                id="rank"
                value={rank}
                readOnly
                className={`${inputClass} bg-slate-50 cursor-not-allowed`}
                placeholder="Auto-filled from stage"
              />
              {rank && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${rankColors[rank] ?? "bg-slate-100 text-slate-600"}`}>
                  {rank}
                </span>
              )}
            </div>
          </div>

          {/* Lost Toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Is it a Lost Opportunity?</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="radio"
                  name="lostReasonToggle"
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
                  name="lostReasonToggle"
                  value="no"
                  checked={!showLostReason}
                  onChange={handleCheckboxChange}
                  className="accent-indigo-600 w-4 h-4"
                />
                No
              </label>
            </div>
          </div>

          {/* Predefined Lost Reasons Dropdown */}
          {showLostReason && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lost_reason" className="text-sm font-semibold text-slate-700">
                Lost Reason <span className="text-red-500">*</span>
              </label>
              <select
                id="lost_reason"
                value={lostReason || ""}
                onChange={(e) => setLostReason(e.target.value)}
                className={selectClass(lostReason)}
                required={showLostReason}
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
