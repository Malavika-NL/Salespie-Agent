// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import styles from "./EventCreationForm.module.css";
// import { addEventDetails } from "../../../../../slice/EditOpportunityWorkspace";


//  interface EventData {
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
//   event: string;
//   remark: string;
// }

// const EventCreationForm: React.FC = () => {
//   const dispatch = useDispatch();

//   const [eventFormValues, setEventFormValues] = useState<EventData>({
//     start_date: "",
//     end_date: "",
//     start_time: "",
//     end_time: "",
//     event: "",
//     remark: "",
//   });

//   // Handle input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setEventFormValues({ ...eventFormValues, [name]: value });
//   };

//   // Handle form submission
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
    
//     // Dispatch the action to update Redux state
//     dispatch(addEventDetails(eventFormValues));
    
//     // Reset form
//     setEventFormValues({
//       start_date: "",
//       end_date: "",
//       start_time: "",
//       end_time: "",
//       event: "",
//       remark: "",
//     });

//     // console.log("Event created:", eventFormValues);
//   };

//   return (
//     <div className={styles.container}>
//           <h2 className={styles.heading}>Event Creation</h2>
//       <hr className={styles.line} />
//       <form className={styles.form} onSubmit={handleSubmit}>
        
//           <div className={styles.field}>
//             <label htmlFor="start_date" className={styles.label}>
//               Start Date:
//             </label>
//             <input
//               type="date"
//               id="start_date"
//               name="start_date"
//               className={styles.input}
//               value={eventFormValues.start_date}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className={styles.field}>
//             <label htmlFor="end_date" className={styles.label}>
//               End Date:
//             </label>
//             <input
//               type="date"
//               id="end_date"
//               name="end_date"
//               className={styles.input}
//               value={eventFormValues.end_date}
//               onChange={handleInputChange}
//             />
//           </div>
     

    
//           <div className={styles.field}>
//             <label htmlFor="start_time" className={styles.label}>
//               Start Time:
//             </label>
//             <input
//               type="time"
//               id="start_time"
//               name="start_time"
//               className={styles.input}
//               value={eventFormValues.start_time}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className={styles.field}>
//             <label htmlFor="end_time" className={styles.label}>
//               End Time:
//             </label>
//             <input
//               type="time"
//               id="end_time"
//               name="end_time"
//               className={styles.input}
//               value={eventFormValues.end_time}
//               onChange={handleInputChange}
//             />
//           </div>
     

//         <div className={styles.row}>
//           <div className={styles.field}>
//             <label htmlFor="event" className={styles.rowlabel}>
//               Events:
//             </label>
//             <select
//               id="event"
//               name="event"
//               className={styles.singleinput}
//               value={eventFormValues.event}
//               onChange={handleInputChange}
//             >
//               <option value="">Select the Event</option>
//               <option value="event1">Event 1</option>
//               <option value="event2">Event 2</option>
//               <option value="event3">Event 3</option>
//             </select>
//           </div>
//         </div>

//         <div className={styles.row}>
//           <div className={styles.field}>
//             <label htmlFor="remark" className={styles.rowlabel}>
//               Remarks:
//             </label>
//             <input
//               type="text"
//               id="remark"
//               name="remark"
//               className={styles.singleinput}
//               value={eventFormValues.remark}
//               onChange={handleInputChange}
//               placeholder="Enter the Remarks"
//             />
//           </div>
//         </div>

//         <div className={styles.buttonContainer}>
//           <button type="submit" className={styles.editButton}>
//             Create Event
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EventCreationForm;

// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import styles from "./EventCreationForm.module.css";
// import { addEventDetails } from "../../../../../slice/EditOpportunityWorkspace";

// interface EventData {
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
//   event: string;
//   remark: string;
// }

// interface EventErrors {
//   start_date?: string;
//   end_date?: string;
//   start_time?: string;
//   end_time?: string;
//   event?: string;
//   remark?: string;
// }

// const EVENT_CHOICES = [
//   "Event 1",
//   "Event 2",
//   "Event 3",
//   "Event 4",
//   "Event 5",
// ];

// const EventCreationForm: React.FC = () => {
//   const dispatch = useDispatch();

//   const [eventFormValues, setEventFormValues] = useState<EventData>({
//     start_date: "",
//     end_date: "",
//     start_time: "",
//     end_time: "",
//     event: "",
//     remark: "",
//   });

//   const [errors, setErrors] = useState<EventErrors>({});
//   const [successMsg, setSuccessMsg] = useState("");

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setEventFormValues({ ...eventFormValues, [name]: value });
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const validate = (): boolean => {
//     const newErrors: EventErrors = {};

//     if (!eventFormValues.event) {
//       newErrors.event = "Please select an event type.";
//     }
//     if (!eventFormValues.start_date) {
//       newErrors.start_date = "Start date is required.";
//     }
//     if (!eventFormValues.end_date) {
//       newErrors.end_date = "End date is required.";
//     }
//     if (eventFormValues.start_date && eventFormValues.end_date) {
//       if (eventFormValues.end_date < eventFormValues.start_date) {
//         newErrors.end_date = "End date cannot be before start date.";
//       }
//     }
//     if (!eventFormValues.start_time) {
//       newErrors.start_time = "Start time is required.";
//     }
//     if (!eventFormValues.end_time) {
//       newErrors.end_time = "End time is required.";
//     }
//     if (
//       eventFormValues.start_date === eventFormValues.end_date &&
//       eventFormValues.start_time &&
//       eventFormValues.end_time &&
//       eventFormValues.end_time <= eventFormValues.start_time
//     ) {
//       newErrors.end_time = "End time must be after start time on the same day.";
//     }
//     if (!eventFormValues.remark.trim()) {
//       newErrors.remark = "Remarks are required.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setSuccessMsg("");

//     if (!validate()) return;

//     dispatch(addEventDetails(eventFormValues));

//     setEventFormValues({
//       start_date: "",
//       end_date: "",
//       start_time: "",
//       end_time: "",
//       event: "",
//       remark: "",
//     });

//     setSuccessMsg("Event created successfully!");
//     setTimeout(() => setSuccessMsg(""), 3000);
//   };

//   const inputClass = (field: keyof EventErrors) =>
//     `${styles.input} ${errors[field] ? styles.inputError : ""}`;

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Event Creation</h2>
//       <hr className={styles.line} />

//       {successMsg && (
//         <div className={styles.successMsg}>✓ {successMsg}</div>
//       )}

//       <form className={styles.form} onSubmit={handleSubmit} noValidate>

//         {/* Start Date */}
//         <div className={styles.field}>
//           <label htmlFor="start_date" className={styles.label}>
//             Start Date: <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="date"
//             id="start_date"
//             name="start_date"
//             className={inputClass("start_date")}
//             value={eventFormValues.start_date}
//             onChange={handleInputChange}
//           />
//           {errors.start_date && (
//             <p className={styles.errorText}>{errors.start_date}</p>
//           )}
//         </div>

//         {/* End Date */}
//         <div className={styles.field}>
//           <label htmlFor="end_date" className={styles.label}>
//             End Date: <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="date"
//             id="end_date"
//             name="end_date"
//             className={inputClass("end_date")}
//             value={eventFormValues.end_date}
//             onChange={handleInputChange}
//           />
//           {errors.end_date && (
//             <p className={styles.errorText}>{errors.end_date}</p>
//           )}
//         </div>

//         {/* Start Time */}
//         <div className={styles.field}>
//           <label htmlFor="start_time" className={styles.label}>
//             Start Time: <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="time"
//             id="start_time"
//             name="start_time"
//             className={inputClass("start_time")}
//             value={eventFormValues.start_time}
//             onChange={handleInputChange}
//           />
//           {errors.start_time && (
//             <p className={styles.errorText}>{errors.start_time}</p>
//           )}
//         </div>

//         {/* End Time */}
//         <div className={styles.field}>
//           <label htmlFor="end_time" className={styles.label}>
//             End Time: <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="time"
//             id="end_time"
//             name="end_time"
//             className={inputClass("end_time")}
//             value={eventFormValues.end_time}
//             onChange={handleInputChange}
//           />
//           {errors.end_time && (
//             <p className={styles.errorText}>{errors.end_time}</p>
//           )}
//         </div>

//         {/* Event Type */}
//         <div className={styles.row}>
//           <div className={styles.field}>
//             <label htmlFor="event" className={styles.rowlabel}>
//               Events: <span className={styles.required}>*</span>
//             </label>
//             <select
//               id="event"
//               name="event"
//               className={`${styles.singleinput} ${errors.event ? styles.inputError : ""}`}
//               value={eventFormValues.event}
//               onChange={handleInputChange}
//             >
//               <option value="">Select the Event</option>
//               {EVENT_CHOICES.map((choice) => (
//                 <option key={choice} value={choice}>
//                   {choice}
//                 </option>
//               ))}
//             </select>
//             {errors.event && (
//               <p className={styles.errorText}>{errors.event}</p>
//             )}
//           </div>
//         </div>

//         {/* Remarks */}
//         <div className={styles.row}>
//           <div className={styles.field}>
//             <label htmlFor="remark" className={styles.rowlabel}>
//               Remarks: <span className={styles.required}>*</span>
//             </label>
//             <input
//               type="text"
//               id="remark"
//               name="remark"
//               className={`${styles.singleinput} ${errors.remark ? styles.inputError : ""}`}
//               value={eventFormValues.remark}
//               onChange={handleInputChange}
//               placeholder="Enter the Remarks"
//             />
//             {errors.remark && (
//               <p className={styles.errorText}>{errors.remark}</p>
//             )}
//           </div>
//         </div>

//         <div className={styles.buttonContainer}>
//           <button type="submit" className={styles.editButton}>
//             Create Event
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EventCreationForm;


// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addEventDetails } from "../../../../../slice/EditOpportunityWorkspace";

// interface EventData {
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
//   event: string;
//   remark: string;
// }

// interface EventErrors {
//   start_date?: string;
//   end_date?: string;
//   start_time?: string;
//   end_time?: string;
//   event?: string;
// }

// const EVENT_CHOICES = ["Event 1", "Event 2", "Event 3", "Event 4", "Event 5"];

// const EventCreationForm: React.FC = () => {
//   const dispatch = useDispatch();

//   const [form, setForm] = useState<EventData>({
//     start_date: "", end_date: "", start_time: "", end_time: "", event: "", remark: "",
//   });
//   const [errors, setErrors] = useState<EventErrors>({});
//   const [successMsg, setSuccessMsg] = useState("");

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const validate = (): boolean => {
//     const newErrors: EventErrors = {};
//     if (!form.event) newErrors.event = "Please select an event type.";
//     if (!form.start_date) newErrors.start_date = "Start date is required.";
//     if (!form.end_date) newErrors.end_date = "End date is required.";
//     if (form.start_date && form.end_date && form.end_date < form.start_date)
//       newErrors.end_date = "End date cannot be before start date.";
//     if (!form.start_time) newErrors.start_time = "Start time is required.";
//     if (!form.end_time) newErrors.end_time = "End time is required.";
//     if (
//       form.start_date === form.end_date &&
//       form.start_time && form.end_time &&
//       form.end_time <= form.start_time
//     ) newErrors.end_time = "End time must be after start time.";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setSuccessMsg("");
//     if (!validate()) return;
//     dispatch(addEventDetails(form));
//     setForm({ start_date: "", end_date: "", start_time: "", end_time: "", event: "", remark: "" });
//     setSuccessMsg("Event created successfully!");
//     setTimeout(() => setSuccessMsg(""), 3000);
//   };

//   const fieldClass = (err?: string) =>
//     `w-full h-9 px-3 border rounded-md text-sm text-gray-800 bg-white outline-none transition
//      focus:ring-2 ${err
//        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
//        : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
//      }`;

//   return (
//     <div className="bg-white rounded-lg p-6 w-full">
//       <h2 className="text-base font-semibold text-gray-800 mb-3">Event Creation</h2>
//       <hr className="border-gray-200 mb-5" />

//       {successMsg && (
//         <div className="bg-green-50 text-green-700 border border-green-200 rounded-md px-4 py-2 text-sm mb-4">
//           ✓ {successMsg}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

//         {/* Event Type */}
//         <div className="flex flex-col gap-1">
//           <label className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase">
//             Event Type <span className="text-red-500">*</span>
//           </label>
//           <select
//             name="event" value={form.event} onChange={handleChange}
//             className={`${fieldClass(errors.event)} appearance-none cursor-pointer`}
//           >
//             <option value="">Select an event</option>
//             {EVENT_CHOICES.map((c) => <option key={c} value={c}>{c}</option>)}
//           </select>
//           {errors.event && <p className="text-xs text-red-500">{errors.event}</p>}
//         </div>

//         {/* Date Row */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="flex flex-col gap-1">
//             <label className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase">
//               Start Date <span className="text-red-500">*</span>
//             </label>
//             <input type="date" name="start_date" value={form.start_date} onChange={handleChange}
//               className={fieldClass(errors.start_date)} />
//             {errors.start_date && <p className="text-xs text-red-500">{errors.start_date}</p>}
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase">
//               End Date <span className="text-red-500">*</span>
//             </label>
//             <input type="date" name="end_date" value={form.end_date} onChange={handleChange}
//               className={fieldClass(errors.end_date)} />
//             {errors.end_date && <p className="text-xs text-red-500">{errors.end_date}</p>}
//           </div>
//         </div>

//         {/* Time Row */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="flex flex-col gap-1">
//             <label className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase">
//               Start Time <span className="text-red-500">*</span>
//             </label>
//             <input type="time" name="start_time" value={form.start_time} onChange={handleChange}
//               className={fieldClass(errors.start_time)} />
//             {errors.start_time && <p className="text-xs text-red-500">{errors.start_time}</p>}
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase">
//               End Time <span className="text-red-500">*</span>
//             </label>
//             <input type="time" name="end_time" value={form.end_time} onChange={handleChange}
//               className={fieldClass(errors.end_time)} />
//             {errors.end_time && <p className="text-xs text-red-500">{errors.end_time}</p>}
//           </div>
//         </div>

//         {/* Remarks */}
//         <div className="flex flex-col gap-1">
//           <label className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase">
//             Remarks <span className="text-gray-400 normal-case font-normal text-[11px]">(optional)</span>
//           </label>
//           <textarea
//             name="remark" value={form.remark} onChange={handleChange} rows={3}
//             placeholder="Add any notes or remarks..."
//             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-y placeholder-gray-400"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-lg transition mt-1 cursor-pointer"
//         >
//           + Create Event
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EventCreationForm;

// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addEventDetails } from "../../../../../slice/EditOpportunityWorkspace";

// interface EventData {
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
//   event: string;
//   remark: string;
// }

// interface EventErrors {
//   start_date?: string;
//   end_date?: string;
//   start_time?: string;
//   end_time?: string;
//   event?: string;
// }

// const EVENT_CHOICES = ["Follow-up for meeting", "Follow-up after quotation", "Follow-up for negotiation", "Follow-up after negotiation", "Follow-up for new product/project "];

// const EventCreationForm: React.FC = () => {
//   const dispatch = useDispatch();

//   const [form, setForm] = useState<EventData>({
//     start_date: "",
//     end_date: "",
//     start_time: "",
//     end_time: "",
//     event: "",
//     remark: "",
//   });
//   const [errors, setErrors] = useState<EventErrors>({});
//   const [successMsg, setSuccessMsg] = useState("");

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const validate = (): boolean => {
//     const newErrors: EventErrors = {};
//     if (!form.event) newErrors.event = "Please select an event type.";
//     if (!form.start_date) newErrors.start_date = "Start date is required.";
//     if (!form.end_date) newErrors.end_date = "End date is required.";
//     if (form.start_date && form.end_date && form.end_date < form.start_date)
//       newErrors.end_date = "End date cannot be before start date.";
//     if (!form.start_time) newErrors.start_time = "Start time is required.";
//     if (!form.end_time) newErrors.end_time = "End time is required.";
//     if (
//       form.start_date === form.end_date &&
//       form.start_time &&
//       form.end_time &&
//       form.end_time <= form.start_time
//     )
//       newErrors.end_time = "End time must be after start time.";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setSuccessMsg("");
//     if (!validate()) return;
//     dispatch(addEventDetails(form));
//     setForm({ start_date: "", end_date: "", start_time: "", end_time: "", event: "", remark: "" });
//     setSuccessMsg("Event created successfully!");
//     setTimeout(() => setSuccessMsg(""), 3000);
//   };

//   const inputBase =
//     "w-full h-9 px-3 border rounded text-[13px] text-gray-700 bg-white outline-none transition-colors";
//   const inputNormal = `${inputBase} border-gray-300 focus:border-blue-400`;
//   const inputError = `${inputBase} border-red-400`;

//   return (
//     <div className="bg-white p-6 h-full">
//       {/* Title */}
//       <h2 className="text-[15px] font-semibold text-gray-800 mb-3">Event Creation</h2>
//       <hr className="border-gray-200 mb-5" />

//       {successMsg && (
//         <div className="bg-green-50 text-green-700 border border-green-200 rounded px-3 py-2 text-[13px] mb-4">
//           ✓ {successMsg}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[14px]">

//         {/* Event Type */}
//         <div className="flex flex-col gap-1">
//           <label className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase">
//             Event Type <span className="text-red-500">*</span>
//           </label>
//           <div className="relative">
//             <select
//               name="event"
//               value={form.event}
//               onChange={handleChange}
//               className={`${errors.event ? inputError : inputNormal} appearance-none cursor-pointer pr-8`}
//             >
//               <option value="">Select an event</option>
//               {EVENT_CHOICES.map((c) => (
//                 <option key={c} value={c}>{c}</option>
//               ))}
//             </select>
//             <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
//           </div>
//           {errors.event && <p className="text-[11px] text-red-500 mt-0.5">{errors.event}</p>}
//         </div>

//         {/* Date Row */}
//         <div className="grid grid-cols-2 gap-3">
//           <div className="flex flex-col gap-1">
//             <label className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase">
//               Start Date <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="date"
//               name="start_date"
//               value={form.start_date}
//               onChange={handleChange}
//               className={errors.start_date ? inputError : inputNormal}
//             />
//             {errors.start_date && <p className="text-[11px] text-red-500 mt-0.5">{errors.start_date}</p>}
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase">
//               End Date <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="date"
//               name="end_date"
//               value={form.end_date}
//               onChange={handleChange}
//               className={errors.end_date ? inputError : inputNormal}
//             />
//             {errors.end_date && <p className="text-[11px] text-red-500 mt-0.5">{errors.end_date}</p>}
//           </div>
//         </div>

//         {/* Time Row */}
//         <div className="grid grid-cols-2 gap-3">
//           <div className="flex flex-col gap-1">
//             <label className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase">
//               Start Time <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="time"
//               name="start_time"
//               value={form.start_time}
//               onChange={handleChange}
//               className={errors.start_time ? inputError : inputNormal}
//             />
//             {errors.start_time && <p className="text-[11px] text-red-500 mt-0.5">{errors.start_time}</p>}
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase">
//               End Time <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="time"
//               name="end_time"
//               value={form.end_time}
//               onChange={handleChange}
//               className={errors.end_time ? inputError : inputNormal}
//             />
//             {errors.end_time && <p className="text-[11px] text-red-500 mt-0.5">{errors.end_time}</p>}
//           </div>
//         </div>

//         {/* Remarks */}
//         <div className="flex flex-col gap-1">
//           <label className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase">
//             Remarks{" "}
//             <span className="normal-case font-normal text-gray-400 text-[11px] tracking-normal">
//               (optional)
//             </span>
//           </label>
//           <textarea
//             name="remark"
//             value={form.remark}
//             onChange={handleChange}
//             rows={3}
//             placeholder="Add any notes or remarks..."
//             className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] text-gray-700 bg-white outline-none focus:border-blue-400 resize-y placeholder-gray-400 transition-colors"
//           />
//         </div>

//         {/* Submit Button — dark navy matching screenshot */}
//         <button
//           type="submit"
//           className="w-full h-11 bg-[#1b3a5c] hover:bg-[#142d47] active:scale-[0.99] text-white text-[14px] font-semibold rounded-lg transition-all mt-1 cursor-pointer tracking-wide"
//         >
//           + Create Event
//         </button>

//       </form>
//     </div>
//   );
// };

// export default EventCreationForm;



import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addEventDetails } from "../../../../../slice/EditOpportunityWorkspace";
import { CalendarPlus } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EventData {
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  event: string;
  remark: string;
}

interface EventErrors {
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  event?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENT_CHOICES = [
  "Follow-up for meeting",
  "Follow-up after quotation",
  "Follow-up for negotiation",
  "Follow-up after negotiation",
  "Follow-up for new product/project ",
];

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputClass = (hasError: boolean) =>
  `w-full px-3 py-2 rounded-xl border-2 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200 bg-white text-slate-800 ${
    hasError ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400" : "border-slate-200"
  }`;

// ─── Component ────────────────────────────────────────────────────────────────

const EventCreationForm: React.FC = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState<EventData>({
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    event: "",
    remark: "",
  });
  const [errors, setErrors] = useState<EventErrors>({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: EventErrors = {};
    if (!form.event) newErrors.event = "Please select an event type.";
    if (!form.start_date) newErrors.start_date = "Start date is required.";
    if (!form.end_date) newErrors.end_date = "End date is required.";
    if (form.start_date && form.end_date && form.end_date < form.start_date)
      newErrors.end_date = "End date cannot be before start date.";
    if (!form.start_time) newErrors.start_time = "Start time is required.";
    if (!form.end_time) newErrors.end_time = "End time is required.";
    if (
      form.start_date === form.end_date &&
      form.start_time &&
      form.end_time &&
      form.end_time <= form.start_time
    )
      newErrors.end_time = "End time must be after start time.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMsg("");
    if (!validate()) return;
    dispatch(addEventDetails(form));
    setForm({ start_date: "", end_date: "", start_time: "", end_time: "", event: "", remark: "" });
    setSuccessMsg("Event created successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="rounded-2xl border-2 border-indigo-100 shadow-lg overflow-hidden h-full">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 flex items-center gap-2">
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
          <CalendarPlus size={15} color="white" />
        </div>
        <h2 className="text-sm font-bold text-white tracking-wide">Event Creation</h2>
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4">

        {/* Success Banner */}
        {successMsg && (
          <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold mb-4">
            <span className="text-emerald-500 font-bold">✓</span> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          {/* Event Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Event Type <span className="text-red-500">*</span>
            </label>
            <select
              name="event"
              value={form.event}
              onChange={handleChange}
              className={`${inputClass(!!errors.event)} ${!form.event ? "text-slate-400 font-normal" : "text-slate-800"} [&>option]:text-slate-800 [&>option]:font-medium`}
            >
              <option value="">Select an event</option>
              {EVENT_CHOICES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.event && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5">
                <span>⚠</span> {errors.event}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className={inputClass(!!errors.start_date)}
              />
              {errors.start_date && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><span>⚠</span> {errors.start_date}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className={inputClass(!!errors.end_date)}
              />
              {errors.end_date && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><span>⚠</span> {errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                className={inputClass(!!errors.start_time)}
              />
              {errors.start_time && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><span>⚠</span> {errors.start_time}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                className={inputClass(!!errors.end_time)}
              />
              {errors.end_time && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><span>⚠</span> {errors.end_time}</p>
              )}
            </div>
          </div>

          {/* Remarks — textarea in EDIT (not input) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Remarks{" "}
              <span className="text-slate-400 text-xs font-normal">(optional)</span>
            </label>
            <textarea
              name="remark"
              value={form.remark}
              onChange={handleChange}
              rows={3}
              placeholder="Add any notes or remarks..."
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200 resize-y"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors duration-200 shadow-md mt-1"
          >
            <CalendarPlus size={15} /> Create Event
          </button>

        </form>
      </div>
    </div>
  );
};

export default EventCreationForm;