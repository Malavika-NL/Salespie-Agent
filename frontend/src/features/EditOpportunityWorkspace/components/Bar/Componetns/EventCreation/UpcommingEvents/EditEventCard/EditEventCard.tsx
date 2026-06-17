// import React, { useState } from "react";
// import styles from "./EditEventCard.module.css"; // Style for the edit card

// import { useDispatch } from "react-redux";
// import { updateEvent } from "../../../../../../slice/EditOpportunityWorkspace";
// interface EditEventCardProps {
//     eventIndex: number;
//     event: string;
//     remark: string;
//     start_date: string;
//     end_date: string;
//     start_time: string;
//     end_time: string;
//     close: () => void; // Function to close the edit card
// }

// const EditEventCard: React.FC<EditEventCardProps> = ({
//     eventIndex,
//     event,
//     start_date,
//     start_time,
//     end_date,
//     end_time, remark,
//     close,
// }) => {
//     const [formData, setFormData] = useState({
        
//         event,
//         remark,
//         start_date,
//         end_date,
//         start_time,
//         end_time
//     });

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { id, value } = e.target;
//         setFormData((prevState) => ({
//             ...prevState,
//             [id]: value,
//         }));
//     };

//     const dispatch = useDispatch(); 
//     const handleSave = () => {
//         // Dispatch the updateEvent action to update the form data in the slice
//         const updatedEvent = {
//           event: formData.event,
//           remark: formData.remark,
//           start_date: formData.start_date,
//           end_date: formData.end_date,
//           start_time: formData.start_time,
//           end_time: formData.end_time,
//         };
    
//         dispatch(updateEvent({ eventIndex, updatedEvent }));
    
//         // Close the form after saving
//         close();
//       };
//     return (
//         <div className={styles.editCardWrapper}>
//             <div className={styles.editCard}>
//                 <h3>Edit Event</h3>
//                 <div className={styles.form}>


//                     <label className={styles.label}>Event </label>
//                     <input
//                         type="text"
//                         id="event"
//                         value={formData.event}
//                         onChange={handleInputChange}
//                         className={styles.input}
//                     />

//                     <label  className={styles.label}>Remarks</label>
//                     <input
//                         type="text"
//                         id="remark"
//                         value={formData.remark}
//                         onChange={handleInputChange}
//                         className={styles.input}
//                     />

//                     <label  className={styles.label}>Start Date</label>
//                     <input
//                         type="date"
//                         id="start_date"
//                         value={formData.start_date}
//                         onChange={handleInputChange}
//                         className={styles.input}
//                     />

//                     <label  className={styles.label}>End Date</label>
//                     <input
//                         type="date"
//                         id="end_date"
//                         value={formData.end_date}
//                         onChange={handleInputChange}
//                         className={styles.input}
//                     />
//                     <label  className={styles.label}>Start Time</label>
//                     <input
//                         type="time"
//                         id="start_time"
//                         value={formData.start_time}
//                         onChange={handleInputChange}
//                         className={styles.input}
//                     />
//                     <label  className={styles.label}>End Time</label>
//                     <input
//                         type="time"
//                         id="end_time"
//                         value={formData.end_time}
//                         onChange={handleInputChange}
//                         className={styles.input}
//                     />


//                     <div className={styles.buttons}>
//                         <button className={styles.saveButton} onClick={handleSave}>
//                             Save
//                         </button>
//                         <button className={styles.closeButton} onClick={close}>
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditEventCard;
// function dispatch(arg0: any) {
//     throw new Error("Function not implemented.");
// }

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateEvent } from "../../../../../../slice/EditOpportunityWorkspace";
import { X, CalendarCog } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EditEventCardProps {
  eventIndex: number;
  event: string;
  remark: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  close: () => void;
}

// ─── Style helper ─────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200";

// ─── Component ────────────────────────────────────────────────────────────────

const EditEventCard: React.FC<EditEventCardProps> = ({
  eventIndex,
  event,
  start_date,
  start_time,
  end_date,
  end_time,
  remark,
  close,
}) => {
  const [formData, setFormData] = useState({
    event,
    remark,
    start_date,
    end_date,
    start_time,
    end_time,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const dispatch = useDispatch();

  const handleSave = () => {
    // Dispatch the updateEvent action to update the form data in the slice
    const updatedEvent = {
      event:      formData.event,
      remark:     formData.remark,
      start_date: formData.start_date,
      end_date:   formData.end_date,
      start_time: formData.start_time,
      end_time:   formData.end_time,
    };

    dispatch(updateEvent({ eventIndex, updatedEvent }));

    // Close the form after saving
    close();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border-2 border-indigo-100 overflow-hidden">

        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <CalendarCog size={15} color="white" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">Edit Event</h3>
          </div>
          <button
            onClick={close}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X size={15} color="white" />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-5 py-4 flex flex-col gap-4 bg-white">

          {/* Event */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="event" className="text-sm font-semibold text-slate-700">Event</label>
            <input
              type="text"
              id="event"
              value={formData.event}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Enter event name"
            />
          </div>

          {/* Remarks */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="remark" className="text-sm font-semibold text-slate-700">Remarks</label>
            <input
              type="text"
              id="remark"
              value={formData.remark}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Enter remarks"
            />
          </div>

          {/* Start / End Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="start_date" className="text-sm font-semibold text-slate-700">Start Date</label>
              <input
                type="date"
                id="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="end_date" className="text-sm font-semibold text-slate-700">End Date</label>
              <input
                type="date"
                id="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Start / End Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="start_time" className="text-sm font-semibold text-slate-700">Start Time</label>
              <input
                type="time"
                id="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="end_time" className="text-sm font-semibold text-slate-700">End Time</label>
              <input
                type="time"
                id="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors duration-200 shadow-md"
          >
            Save
          </button>
          <button
            type="button"
            onClick={close}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors duration-200"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditEventCard;

// Stray artifact from original file — preserved as-is
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
