// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addStage } from "../../../../features/OpportunityWorkspace/slice/opportunitySlice";
// import styles from "./Stagedata.module.css"; // Importing the CSS module
// import type { RootState } from "../../../../app/store";

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

// const StageData: React.FC = () => {
//   const dispatch = useDispatch();
//   const [stage, setStage] = useState<string>("");
//   const [lostReason, setLostReason] = useState<string>("");
//   const [showLostReason, setShowLostReason] = useState<boolean>(false);

//   const { formData } = useSelector(
//     (state: RootState) => state.postOpportunityWorkspaceData
//   );

//   const currentStage = formData?.opportunity_stages?.[0]?.stages;
//   const filteredStages = stageOrder.slice(stageOrder.indexOf(currentStage || "") + 1);

//   // Dispatch addStage whenever stage or lostReason changes
//   useEffect(() => {
//     const stageData = {
//       stages: stage,
//       ranks: stageRankMap[stage] || "",
//       lost_reason: showLostReason ? lostReason : "",
//     };

//     if (stage) {
//       dispatch(addStage(stageData));
//     }
//   }, [stage, lostReason, showLostReason, dispatch]);

//   const handleStageChange = (selectedStage: string) => {
//     setStage(selectedStage);
//   };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setShowLostReason(e.target.value === "yes");
//     if (e.target.value === "no") {
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



import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStage } from "../../../../features/OpportunityWorkspace/slice/opportunitySlice";
import type { RootState } from "../../../../app/store";
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

const getCurrentYear = () => new Date().getFullYear();

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

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200";

// ─── Component ────────────────────────────────────────────────────────────────

const StageData: React.FC = () => {
  const dispatch = useDispatch();
  const [stage, setStage] = useState<string>("");
  const [stageMonth, setStageMonth] = useState<string>("");
  const [lostReason, setLostReason] = useState<string>("");
  const [showLostReason, setShowLostReason] = useState<boolean>(false);

  const { formData } = useSelector((state: RootState) => state.postOpportunityWorkspaceData);

  const currentStage = formData?.opportunity_stages?.[0]?.stages;
  const filteredStages = stageOrder.slice(stageOrder.indexOf(currentStage || "") + 1);

  useEffect(() => {
    const current = formData?.opportunity_stages?.[0];
    if (!current) return;
    if (current.stages) setStage(current.stages);
    if (current.month) setStageMonth(current.month);
    if (current.lost_reason) {
      setShowLostReason(true);
      setLostReason(current.lost_reason);
    }
  }, [formData?.opportunity_stages]);

  useEffect(() => {
    const stageData = {
      stages: stage,
      month: stageMonth,
      ranks: stageRankMap[stage] || "",
      lost_reason: showLostReason ? lostReason : "",
    };
    if (stage && stageMonth) { dispatch(addStage(stageData)); }
  }, [stage, stageMonth, lostReason, showLostReason, dispatch]);

  const handleStageChange = (selectedStage: string) => setStage(selectedStage);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowLostReason(e.target.value === "yes");
    if (e.target.value === "no") setLostReason("");
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
            {/* Stage Select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="stage" className="text-sm font-semibold text-slate-700">
                Stage <span className="text-red-500">*</span>
              </label>
              <select
                id="stage"
                value={stage || ""}
                onChange={(e) => handleStageChange(e.target.value)}
                required
                className={`${inputClass} [&>option]:text-slate-800 [&>option]:font-medium ${!stage ? "text-slate-400 font-normal" : "text-slate-800"}`}
              >
                <option value="" disabled>Select an option</option>
                {stageOrder.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Stage Month */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="stage_month" className="text-sm font-semibold text-slate-700">
                Month <span className="text-red-500">*</span>
              </label>
              <select
                id="stage_month"
                value={stageMonth}
                onChange={(e) => setStageMonth(e.target.value)}
                required
                className={`${inputClass} [&>option]:text-slate-800 [&>option]:font-medium ${!stageMonth ? "text-slate-400 font-normal" : "text-slate-800"}`}
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
            <label htmlFor="rank" className="text-sm font-semibold text-slate-700">Rank</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                id="rank"
                value={rank}
                readOnly
                className={`${inputClass} cursor-default`}
                placeholder="Auto-filled from stage"
              />
              {rank && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${rankColors[rank] ?? "bg-slate-100 text-slate-600"}`}>
                  {rank}
                </span>
              )}
            </div>
          </div>

          {/* Lost Reason Radio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Lost Reason?</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="radio"
                  name="lostReason"
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
                  name="lostReason"
                  value="no"
                  checked={!showLostReason}
                  onChange={handleCheckboxChange}
                  className="accent-indigo-600 w-4 h-4"
                />
                No
              </label>
            </div>
          </div>

          {/* Lost Reason Input — conditional */}
          {showLostReason && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lost_reason" className="text-sm font-semibold text-slate-700">
                Lost Reason <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lost_reason"
                value={lostReason || ""}
                onChange={(e) => setLostReason(e.target.value)}
                className={inputClass}
                placeholder="Enter lost reason"
                required={showLostReason}
              />
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default StageData;
