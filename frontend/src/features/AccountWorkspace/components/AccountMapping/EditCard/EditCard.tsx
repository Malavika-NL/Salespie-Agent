// import React, { useState } from 'react';
// import styles from './EditCard.module.css'; // Use the same styling as AddContactForm

// interface EditCardProps {
//   category: string;
//   name: string;
//   designation: string;
//   mobile_no: string;
//   email_id: string;
//   onSave: (updatedDetails: {
//     category: string;
//     name: string;
//     designation: string;
//     mobile_no: string;
//     email_id: string;
//   }) => void;
//   onClose: () => void;
// }

// const CATEGORY_CHOICES = [
//   ['plant_head', 'Plant Head'],
//   ['purchase_head', 'Purchase Head'],
//   ['it_head', 'IT Head'],
//   ['quality_head', 'Quality Head'],
//   ['production_head', 'Production Head'],
//   ['plant_pic', 'Plant PIC'],
//   ['purchase_pic', 'Purchase PIC'],
//   ['it_pic', 'IT PIC'],
//   ['quality_pic', 'Quality PIC'],
//   ['production_pic', 'Production PIC'],
// ];

// const EditCard: React.FC<EditCardProps> = ({ category, name, designation, mobile_no, email_id, onSave, onClose }) => {
//   const [editedCategory, setEditedCategory] = useState(category);
//   const [editedName, setEditedName] = useState(name);
//   const [editedDesignation, setEditedDesignation] = useState(designation);
//   const [editedMobile, setEditedMobile] = useState(mobile_no);
//   const [editedEmail, setEditedEmail] = useState(email_id);

//   const handleSave = () => {
//     onSave({
//       category: editedCategory,
//       name: editedName,
//       designation: editedDesignation,
//       mobile_no: editedMobile,
//       email_id: editedEmail,
//     });
//     onClose();
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     if (name === 'category') {
//       setEditedCategory(value);
//     } else if (name === 'name') {
//       setEditedName(value);
//     } else if (name === 'designation') {
//       setEditedDesignation(value);
//     } else if (name === 'mobile_no') {
//       setEditedMobile(value);
//     } else if (name === 'email_id') {
//       setEditedEmail(value);
//     }
//   };

//   return (
//     <div className={styles.formContainer}>
//       <div className={styles.form}>
//         <h3>Edit Card</h3>
//         <div className={styles.formGroup}>
//           <label htmlFor="category">Category</label>
//           <select
//             id="category"
//             name="category"
//             value={editedCategory}
//             onChange={handleInputChange}
//           >
//             <option value="">Select Category</option>
//             {CATEGORY_CHOICES.map(([value, label]) => (
//               <option key={value} value={value}>
//                 {label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="name">Name</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={editedName}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="designation">Designation</label>
//           <input
//             type="text"
//             id="designation"
//             name="designation"
//             value={editedDesignation}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="mobile_no">Mobile No</label>
//           <input
//             type="text"
//             id="mobile_no"
//             name="mobile_no"
//             value={editedMobile}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="email_id">Email ID</label>
//           <input
//             type="email"
//             id="email_id"
//             name="email_id"
//             value={editedEmail}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className={styles.actions}>
//           <button type="button" onClick={handleSave} className={styles.submitButton}>
//             Save
//           </button>
//           <button type="button" onClick={onClose} className={styles.cancelButton}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditCard;



import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface EditCardProps {
  category: string;
  name: string;
  designation: string;
  mobile_no: string;
  email_id: string;
  onSave: (updatedDetails: {
    category: string;
    name: string;
    designation: string;
    mobile_no: string;
    email_id: string;
  }) => void;
  onClose: () => void;
}

const CATEGORY_CHOICES = [
  ['plant_head', 'Plant Head'],
  ['purchase_head', 'Purchase Head'],
  ['it_head', 'IT Head'],
  ['quality_head', 'Quality Head'],
  ['production_head', 'Production Head'],
  ['plant_pic', 'Plant PIC'],
  ['purchase_pic', 'Purchase PIC'],
  ['it_pic', 'IT PIC'],
  ['quality_pic', 'Quality PIC'],
  ['production_pic', 'Production PIC'],
];

const inputClass =
  'w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200';

const EditCard: React.FC<EditCardProps> = ({ category, name, designation, mobile_no, email_id, onSave, onClose }) => {
  const [editedCategory, setEditedCategory] = useState(category);
  const [editedName, setEditedName] = useState(name);
  const [editedDesignation, setEditedDesignation] = useState(designation);
  const [editedMobile, setEditedMobile] = useState(mobile_no);
  const [editedEmail, setEditedEmail] = useState(email_id);

  const handleSave = () => {
    onSave({
      category: editedCategory,
      name: editedName,
      designation: editedDesignation,
      mobile_no: editedMobile,
      email_id: editedEmail,
    });
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setEditedCategory(value);
    } else if (name === 'name') {
      setEditedName(value);
    } else if (name === 'designation') {
      setEditedDesignation(value);
    } else if (name === 'mobile_no') {
      setEditedMobile(value);
    } else if (name === 'email_id') {
      setEditedEmail(value);
    }
  };

  return createPortal(
    /* Overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal Card */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-indigo-500" />
          <h2 className="text-base font-semibold text-slate-800">Edit Contact</h2>
        </div>

        <div className="border-t border-slate-100" />

        <div className="flex flex-col gap-4">

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-semibold text-slate-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={editedCategory}
              onChange={handleInputChange}
              className={`${inputClass} [&>option]:text-slate-800 [&>option]:font-medium ${
                !editedCategory ? 'text-slate-400 font-normal' : 'text-slate-800'
              }`}
            >
              <option value="">Select Category</option>
              {CATEGORY_CHOICES.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-semibold text-slate-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedName}
              onChange={handleInputChange}
              placeholder="Enter Name"
              className={inputClass}
            />
          </div>

          {/* Designation */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="designation" className="text-sm font-semibold text-slate-700">
              Designation
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={editedDesignation}
              onChange={handleInputChange}
              placeholder="Enter Designation"
              className={inputClass}
            />
          </div>

          {/* Mobile No */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mobile_no" className="text-sm font-semibold text-slate-700">
              Mobile No
            </label>
            <input
              type="text"
              id="mobile_no"
              name="mobile_no"
              value={editedMobile}
              onChange={handleInputChange}
              placeholder="Enter Mobile Number"
              className={inputClass}
            />
          </div>

          {/* Email ID */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email_id" className="text-sm font-semibold text-slate-700">
              Email ID
            </label>
            <input
              type="email"
              id="email_id"
              name="email_id"
              value={editedEmail}
              onChange={handleInputChange}
              placeholder="Enter Email Address"
              className={inputClass}
            />
          </div>

          <div className="border-t border-slate-100 mt-1" />

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors duration-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors duration-200"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>,
  document.body
  );
};

export default EditCard;
