// // src/features/AdminEditopportunityworkspace/components/Bar/Componetns/FollowupCreation/EditFollowupCreationForm/EditFollowupCreationForm.tsx
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addFollowupDetails } from "../../../../../slice/AdminEditOpportunityWorkspaceSlice";

// interface FollowupData {
//   followup: string;
//   followup_topic: string;
//   start_date: string;
//   end_date: string;
//   remark: string;
// }

// interface FollowupErrors {
//   followup?: string;
//   followup_topic?: string;
//   start_date?: string;
//   end_date?: string;
// }

// const FOLLOWUP_CHOICES = [
//   "Call", "Meeting", "Demo", "Proposal",
//   "Negotiation", "Follow-up Email", "Site Visit", "Other",
// ];

// const s: Record<string, React.CSSProperties> = {
//   container: { background: "#ffffff", borderRadius: "12px", padding: "24px", height: "100%", boxSizing: "border-box" },
//   heading:   { fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 4px 0", letterSpacing: "-0.2px" },
//   divider:   { border: "none", borderTop: "1px solid #e5e7eb", margin: "10px 0 18px 0" },
//   successBanner: {
//     display: "flex", alignItems: "center", gap: "8px",
//     background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d",
//     padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 500, marginBottom: "16px",
//   },
//   label:    { display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "5px", color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" } as React.CSSProperties,
//   required: { color: "#ef4444" },
//   optional: { color: "#9ca3af", fontSize: "10px", fontWeight: 400, textTransform: "none" } as React.CSSProperties,
//   errorText:{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" },
//   grid2:    { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" },
//   fieldWrap:{ marginBottom: "14px" },
//   submitBtn:{
//     width: "100%", padding: "11px",
//     background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
//     color: "#fff", border: "none", borderRadius: "8px",
//     fontSize: "14px", fontWeight: 600, cursor: "pointer",
//     letterSpacing: "0.2px", marginTop: "4px", transition: "opacity 0.2s",
//   },
// };

// const inputStyle = (hasError: boolean): React.CSSProperties => ({
//   width: "100%", padding: "9px 11px", borderRadius: "8px", fontSize: "13px",
//   border: hasError ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
//   outline: "none", boxSizing: "border-box",
//   background: hasError ? "#fff5f5" : "#f9fafb",
//   color: "#111827", transition: "border-color 0.15s, background 0.15s",
// });

// const EditFollowupCreationForm: React.FC = () => {
//   const dispatch = useDispatch();

//   const [form, setForm] = useState<FollowupData>({
//     followup: "", followup_topic: "", start_date: "", end_date: "", remark: "",
//   });
//   const [errors, setErrors]         = useState<FollowupErrors>({});
//   const [successMsg, setSuccessMsg] = useState("");

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//     setErrors(prev => ({ ...prev, [name]: undefined }));
//   };

//   const validate = (): boolean => {
//     const errs: FollowupErrors = {};
//     if (!form.followup)       errs.followup       = "Please select a followup type.";
//     if (!form.followup_topic) errs.followup_topic = "Followup topic is required.";
//     if (!form.start_date)     errs.start_date     = "Start date is required.";
//     if (!form.end_date)       errs.end_date       = "End date is required.";
//     if (form.start_date && form.end_date && form.end_date < form.start_date)
//       errs.end_date = "End date cannot be before start date.";
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setSuccessMsg("");
//     if (!validate()) return;
//     dispatch(addFollowupDetails(form));
//     setForm({ followup: "", followup_topic: "", start_date: "", end_date: "", remark: "" });
//     setSuccessMsg("Follow-up added successfully!");
//     setTimeout(() => setSuccessMsg(""), 3000);
//   };

//   return (
//     <div style={s.container}>
//       <h2 style={s.heading}>Follow-up Creation</h2>
//       <hr style={s.divider} />

//       {successMsg && (
//         <div style={s.successBanner}><span>✓</span> {successMsg}</div>
//       )}

//       <form onSubmit={handleSubmit} noValidate>

//         {/* Followup type */}
//         <div style={s.fieldWrap}>
//           <label style={s.label}>Follow-up <span style={s.required}>*</span></label>
//           <select name="followup" value={form.followup} onChange={handleChange} style={inputStyle(!!errors.followup)}>
//             <option value="">Select follow-up type</option>
//             {FOLLOWUP_CHOICES.map(c => <option key={c} value={c}>{c}</option>)}
//           </select>
//           {errors.followup && <p style={s.errorText}>⚠ {errors.followup}</p>}
//         </div>

//         {/* Topic */}
//         <div style={s.fieldWrap}>
//           <label style={s.label}>Follow-up Topic <span style={s.required}>*</span></label>
//           <input type="text" name="followup_topic" value={form.followup_topic} onChange={handleChange}
//             placeholder="e.g. Discuss Q3 pricing proposal" style={inputStyle(!!errors.followup_topic)} />
//           {errors.followup_topic && <p style={s.errorText}>⚠ {errors.followup_topic}</p>}
//         </div>

//         {/* Dates */}
//         <div style={s.grid2}>
//           <div>
//             <label style={s.label}>Start Date <span style={s.required}>*</span></label>
//             <input type="date" name="start_date" value={form.start_date} onChange={handleChange}
//               style={inputStyle(!!errors.start_date)} />
//             {errors.start_date && <p style={s.errorText}>⚠ {errors.start_date}</p>}
//           </div>
//           <div>
//             <label style={s.label}>End Date <span style={s.required}>*</span></label>
//             <input type="date" name="end_date" value={form.end_date} onChange={handleChange}
//               style={inputStyle(!!errors.end_date)} />
//             {errors.end_date && <p style={s.errorText}>⚠ {errors.end_date}</p>}
//           </div>
//         </div>

//         {/* Remark */}
//         <div style={s.fieldWrap}>
//           <label style={s.label}>Remark <span style={s.optional}>(optional)</span></label>
//           <textarea name="remark" value={form.remark} onChange={handleChange} rows={3}
//             placeholder="Any notes or context for this follow-up..."
//             style={{ ...inputStyle(false), resize: "vertical" }} />
//         </div>

//         <button type="submit" style={s.submitBtn}>+ Add Follow-up</button>
//       </form>
//     </div>
//   );
// };

// export default EditFollowupCreationForm;

// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addFollowupDetails } from "../../../../../slice/AdminEditOpportunityWorkspaceSlice";
// import styles from "./EditFollowupCreationForm.module.css";

// interface FollowupData {
//   followup: string;
//   followup_topic: string;
//   start_date: string;
//   end_date: string;
//   remark: string;
// }

// interface FollowupErrors {
//   followup?: string;
//   followup_topic?: string;
//   start_date?: string;
//   end_date?: string;
// }

// const FOLLOWUP_CHOICES = [
//   "Call", "Meeting", "Demo", "Proposal",
//   "Negotiation", "Follow-up Email", "Site Visit", "Other",
// ];

// const EditFollowupCreationForm: React.FC = () => {
//   const dispatch = useDispatch();

//   const [form, setForm] = useState<FollowupData>({
//     followup: "", followup_topic: "", start_date: "", end_date: "", remark: "",
//   });
//   const [errors, setErrors] = useState<FollowupErrors>({});
//   const [successMsg, setSuccessMsg] = useState("");

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//     setErrors(prev => ({ ...prev, [name]: undefined }));
//   };

//   const validate = (): boolean => {
//     const errs: FollowupErrors = {};
//     if (!form.followup)       errs.followup       = "Please select a follow-up type.";
//     if (!form.followup_topic) errs.followup_topic = "Follow-up topic is required.";
//     if (!form.start_date)     errs.start_date     = "Start date is required.";
//     if (!form.end_date)       errs.end_date       = "End date is required.";
//     if (form.start_date && form.end_date && form.end_date < form.start_date)
//       errs.end_date = "End date cannot be before start date.";
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setSuccessMsg("");
//     if (!validate()) return;
//     dispatch(addFollowupDetails(form));
//     setForm({ followup: "", followup_topic: "", start_date: "", end_date: "", remark: "" });
//     setSuccessMsg("Follow-up added successfully!");
//     setTimeout(() => setSuccessMsg(""), 3000);
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.heading}>Follow-up Creation</h2>
//       <hr className={styles.line} />

//       {successMsg && (
//         <div className={styles.successBanner}><span>✓</span> {successMsg}</div>
//       )}

//       <form className={styles.form} onSubmit={handleSubmit} noValidate>

//         {/* Followup type */}
//         <div className={styles.field}>
//           <label className={styles.label}>Follow-up <span className={styles.asterisk}>*</span></label>
//           <select 
//             name="followup" 
//             value={form.followup} 
//             onChange={handleChange} 
//             className={`${styles.select} ${errors.followup ? styles.inputError : ""}`}
//           >
//             <option value="">Select follow-up type</option>
//             {FOLLOWUP_CHOICES.map(c => <option key={c} value={c}>{c}</option>)}
//           </select>
//           {errors.followup && <p className={styles.errorText}>⚠ {errors.followup}</p>}
//         </div>

//         {/* Topic */}
//         <div className={styles.field}>
//           <label className={styles.label}>Follow-up Topic <span className={styles.asterisk}>*</span></label>
//           <input 
//             type="text" 
//             name="followup_topic" 
//             value={form.followup_topic} 
//             onChange={handleChange}
//             placeholder="e.g. Discuss Q3 pricing proposal" 
//             className={`${styles.input} ${errors.followup_topic ? styles.inputError : ""}`}
//           />
//           {errors.followup_topic && <p className={styles.errorText}>⚠ {errors.followup_topic}</p>}
//         </div>

//         {/* Dates */}
//         <div className={styles.row}>
//           <div className={styles.field}>
//             <label className={styles.label}>Start Date <span className={styles.asterisk}>*</span></label>
//             <input 
//               type="date" 
//               name="start_date" 
//               value={form.start_date} 
//               onChange={handleChange}
//               className={`${styles.input} ${errors.start_date ? styles.inputError : ""}`} 
//             />
//             {errors.start_date && <p className={styles.errorText}>⚠ {errors.start_date}</p>}
//           </div>
//           <div className={styles.field}>
//             <label className={styles.label}>End Date <span className={styles.asterisk}>*</span></label>
//             <input 
//               type="date" 
//               name="end_date" 
//               value={form.end_date} 
//               onChange={handleChange}
//               className={`${styles.input} ${errors.end_date ? styles.inputError : ""}`} 
//             />
//             {errors.end_date && <p className={styles.errorText}>⚠ {errors.end_date}</p>}
//           </div>
//         </div>

//         {/* Remark */}
//         <div className={styles.field}>
//           <label className={styles.label}>Remark <span className={styles.optional}>(optional)</span></label>
//           <textarea 
//             name="remark" 
//             value={form.remark} 
//             onChange={handleChange} 
//             rows={3}
//             placeholder="Any notes or context for this follow-up..."
//             className={styles.input}
//             style={{ resize: "vertical" }}
//           />
//         </div>

//         <button type="submit" className={styles.submitBtn}>+ Add Follow-up</button>
//       </form>
//     </div>
//   );
// };

// export default EditFollowupCreationForm;






import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addFollowupDetails } from "../../../../../slice/AdminEditOpportunityWorkspaceSlice";
import { PhoneCall } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FollowupData {
  followup:       string;
  followup_topic: string;
  start_date:     string;
  end_date:       string;
  remark:         string;
}

interface FollowupErrors {
  followup?:       string;
  followup_topic?: string;
  start_date?:     string;
  end_date?:       string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FOLLOWUP_CHOICES = [
  "Call", "Meeting", "Demo", "Proposal",
  "Negotiation", "Follow-up Email", "Site Visit", "Other",
];

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputClass = (hasError: boolean) =>
  `w-full px-3 py-2 rounded-xl border-2 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-600 transition-all duration-200 bg-white text-slate-800 ${
    hasError ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400" : "border-slate-200"
  }`;

// ─── Component ────────────────────────────────────────────────────────────────

const EditFollowupCreationForm: React.FC = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState<FollowupData>({
    followup: "", followup_topic: "", start_date: "", end_date: "", remark: "",
  });
  const [errors,     setErrors]     = useState<FollowupErrors>({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FollowupErrors = {};
    if (!form.followup)       errs.followup       = "Please select a follow-up type.";
    if (!form.followup_topic) errs.followup_topic = "Follow-up topic is required.";
    if (!form.start_date)     errs.start_date     = "Start date is required.";
    if (!form.end_date)       errs.end_date       = "End date is required.";
    if (form.start_date && form.end_date && form.end_date < form.start_date)
      errs.end_date = "End date cannot be before start date.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    if (!validate()) return;
    dispatch(addFollowupDetails(form));
    setForm({ followup: "", followup_topic: "", start_date: "", end_date: "", remark: "" });
    setSuccessMsg("Follow-up added successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="rounded-2xl border-2 border-violet-100 shadow-lg overflow-hidden h-full">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 flex items-center gap-2 rounded-t-2xl">
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
          <PhoneCall size={15} color="white" />
        </div>
        <h2 className="text-sm font-bold text-white tracking-wide">Follow-up Creation</h2>
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4 rounded-b-2xl">

        {/* Success Banner */}
        {successMsg && (
          <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold mb-4">
            <span className="text-emerald-500 font-bold">✓</span> {successMsg}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>

          {/* Follow-up Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Follow-up <span className="text-red-500">*</span>
            </label>
            <select
              name="followup"
              value={form.followup}
              onChange={handleChange}
              className={`${inputClass(!!errors.followup)} [&>option]:text-slate-800 [&>option]:font-medium ${!form.followup ? "text-slate-400 font-normal" : "text-slate-800"}`}
            >
              <option value="">Select follow-up type</option>
              {FOLLOWUP_CHOICES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.followup && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><span>⚠</span> {errors.followup}</p>
            )}
          </div>

          {/* Follow-up Topic */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Follow-up Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="followup_topic"
              value={form.followup_topic}
              onChange={handleChange}
              placeholder="e.g. Discuss Q3 pricing proposal"
              className={inputClass(!!errors.followup_topic)}
            />
            {errors.followup_topic && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><span>⚠</span> {errors.followup_topic}</p>
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

          {/* Remark */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Remark <span className="text-slate-400 text-xs font-normal">(optional)</span>
            </label>
            <textarea
              name="remark"
              value={form.remark}
              onChange={handleChange}
              rows={3}
              placeholder="Any notes or context for this follow-up..."
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-600 transition-all duration-200 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors duration-200 shadow-md mt-1"
          >
            <PhoneCall size={15} /> Add Follow-up
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditFollowupCreationForm;