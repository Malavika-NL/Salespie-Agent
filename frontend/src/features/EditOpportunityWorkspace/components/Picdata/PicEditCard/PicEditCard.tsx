// import React, { useState } from "react";
// import styles from "./PicEditCard.module.css";

// interface PicEditCardProps {
//   data: {
//     pic_department: string;
//     pic_name: string;
//     pic_designation: string;
//     pic_email: string;
//     pic_phnone: string;
//     pic_phntwo: string;
//   };
//   onSave: (updatedData: any) => void;
//   onClose: () => void;
// }

// const PicEditCard: React.FC<PicEditCardProps> = ({ data, onSave, onClose }) => {
//   const [editedData, setEditedData] = useState({ ...data });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEditedData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSave = () => {
//     onSave(editedData);
//   };

//   return (
//     <div className={styles.formContainer}>
//       <div className={styles.form}>
//         <h3>Edit PIC Details</h3>
//         <div className={styles.formGroup}>
//           <label>Department</label>
//           <input
//             type="text"
//             name="pic_department"
//             value={editedData.pic_department}
//             onChange={handleChange}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label>Name</label>
//           <input
//             type="text"
//             name="pic_name"
//             value={editedData.pic_name}
//             onChange={handleChange}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label>Designation</label>
//           <input
//             type="text"
//             name="pic_designation"
//             value={editedData.pic_designation}
//             onChange={handleChange}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label>Email</label>
//           <input
//             type="email"
//             name="pic_email"
//             value={editedData.pic_email}
//             onChange={handleChange}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label>Phone 1</label>
//           <input
//             type="text"
//             name="pic_phnone"
//             value={editedData.pic_phnone}
//             onChange={handleChange}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label>Phone 2</label>
//           <input
//             type="text"
//             name="pic_phntwo"
//             value={editedData.pic_phntwo}
//             onChange={handleChange}
//           />
//         </div>
//         <div className={styles.actions}>
//           <button onClick={handleSave} className={styles.submitButton}>Save</button>
//           <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PicEditCard;



import React, { useState } from "react";
import { User, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PicEditCardProps {
  data: {
    pic_department: string;
    pic_name: string;
    pic_designation: string;
    pic_email: string;
    pic_phnone: string;
    pic_phntwo: string;
  };
  onSave: (updatedData: any) => void;
  onClose: () => void;
}

// ─── Style helper ─────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200";

// ─── Component ────────────────────────────────────────────────────────────────

const PicEditCard: React.FC<PicEditCardProps> = ({ data, onSave, onClose }) => {
  const [editedData, setEditedData] = useState({ ...data });

  // ── Handlers (unchanged) ─────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedData);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-2 border-indigo-100 overflow-hidden">

        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <User size={15} color="white" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">Edit PIC Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X size={15} color="white" />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-5 py-4 flex flex-col gap-4 bg-white">
          <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Department</label>
              <input
                type="text"
                name="pic_department"
                value={editedData.pic_department}
                onChange={handleChange}
                placeholder="Enter Department"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Name</label>
              <input
                type="text"
                name="pic_name"
                value={editedData.pic_name}
                onChange={handleChange}
                placeholder="Enter Name"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Designation</label>
              <input
                type="text"
                name="pic_designation"
                value={editedData.pic_designation}
                onChange={handleChange}
                placeholder="Enter Designation"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                name="pic_email"
                value={editedData.pic_email}
                onChange={handleChange}
                placeholder="Enter Email"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Phone 1</label>
              <input
                type="text"
                name="pic_phnone"
                value={editedData.pic_phnone}
                onChange={handleChange}
                placeholder="Enter Phone No"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Phone 2</label>
              <input
                type="text"
                name="pic_phntwo"
                value={editedData.pic_phntwo}
                onChange={handleChange}
                placeholder="Enter Alt. Phone No"
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
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors duration-200"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default PicEditCard;
