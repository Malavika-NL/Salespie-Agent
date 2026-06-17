// import React from 'react';
// import styles from './Progressbar.module.css';
// import { FaCheck } from 'react-icons/fa'; 
// import { IoMdSquare } from "react-icons/io";
// import { useSelector } from 'react-redux';
// import type { RootState } from '../../../../app/store';

// // Define step data directly in the component
// const steps = [
//   { step: 1, title: "Introduction Meeting" },
//   { step: 2, title: "Demo" },
//   { step: 3, title: "Quote Submit" },
//   { step: 4, title: "Negotiation" },
//   { step: 5, title: "Order Achievement" }
// ];

// const ProgressBar: React.FC = () => {
//   const { formData } = useSelector((state: RootState) => state.EditAdminOpportunityWorkspaceData);

//   // Get the current stage from the first item in opportunity_stages array
//   const currentStage = formData?.opportunity_stages?.[0]?.stages;  

//   // Function to determine the index of the current stage
//   const getCurrentStepIndex = () => {
//     return steps.findIndex(step => step.title === currentStage);
//   };

//   const currentStepIndex = getCurrentStepIndex();

//   return (
//     <div>
//       <div className={styles.progressBar}>
//         {steps.map((step, index) => (
//           <React.Fragment key={step.step}>
//             <div className={styles.step}>
//               <div className={styles.square}>
//                 {index < currentStepIndex+1 ? (
//                   <FaCheck className={styles.icon} /> // Completed steps
//                 ) : index === currentStepIndex+1 ? (
//                   <IoMdSquare className={styles.icon} /> // Next step
//                 ) : null}
//               </div>
//               <div className={styles.text}>Step {step.step}</div>
//               <div className={styles.head}>{step.title}</div>
//             </div>
//             {index < steps.length - 1 && <div className={styles.line}></div>}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProgressBar;





import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { IoMdSquare } from "react-icons/io";
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';

// ─── Step data ────────────────────────────────────────────────────────────────

const steps = [
  { step: 1, title: "Introduction Meeting" },
  { step: 2, title: "Demo" },
  { step: 3, title: "Quote Submit" },
  { step: 4, title: "Negotiation" },
  { step: 5, title: "Order Achievement" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ProgressBar: React.FC = () => {
  const { formData } = useSelector((state: RootState) => state.EditAdminOpportunityWorkspaceData);

  // Get the current stage from the first item in opportunity_stages array
  const currentStage = formData?.opportunity_stages?.[0]?.stages;

  // Function to determine the index of the current stage
  const getCurrentStepIndex = () => steps.findIndex(step => step.title === currentStage);

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="rounded-2xl border-2 border-indigo-100 shadow-lg">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 rounded-t-2xl">
        <h2 className="text-sm font-bold text-white tracking-wide">Opportunity Progress</h2>
        <p className="text-indigo-100 text-xs mt-0.5">
          {currentStage ? `Current stage: ${currentStage}` : "No stage selected yet"}
        </p>
      </div>

      {/* Steps */}
      <div className="bg-white px-6 py-5 rounded-b-2xl">
        <div className="flex items-start justify-between w-full">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex + 1;
            const isCurrent  = index === currentStepIndex + 1;
            const isPending  = !isCompleted && !isCurrent;

            return (
              <React.Fragment key={step.step}>
                {/* Step node */}
                <div className="flex flex-col items-center gap-1.5 min-w-0">
                  {/* Circle */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm transition-all duration-200 ${
                    isCompleted
                      ? "bg-gradient-to-br from-indigo-600 to-violet-500 shadow-indigo-200"
                      : isCurrent
                      ? "bg-gradient-to-br from-indigo-300 to-violet-300 ring-2 ring-indigo-400 ring-offset-2"
                      : "bg-slate-100"
                  }`}>
                    {isCompleted ? (
                      <FaCheck size={13} className="text-white" />
                    ) : isCurrent ? (
                      <IoMdSquare size={13} className="text-white" />
                    ) : (
                      <span className="text-xs font-bold text-slate-400">{step.step}</span>
                    )}
                  </div>

                  {/* Step label */}
                  <div className={`text-[10px] font-bold text-center ${
                    isCompleted ? "text-indigo-600" : isCurrent ? "text-indigo-400" : "text-slate-400"
                  }`}>
                    Step {step.step}
                  </div>

                  {/* Step title */}
                  <div className={`text-[10px] text-center leading-tight max-w-[72px] ${
                    isCompleted ? "text-slate-700 font-semibold" : isCurrent ? "text-indigo-500 font-medium" : "text-slate-400"
                  }`}>
                    {step.title}
                  </div>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mt-4 mx-1">
                    <div className={`h-1 rounded-full transition-all duration-300 ${
                      index < currentStepIndex + 1
                        ? "bg-gradient-to-r from-indigo-500 to-violet-500"
                        : "bg-slate-200"
                    }`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ProgressBar;
