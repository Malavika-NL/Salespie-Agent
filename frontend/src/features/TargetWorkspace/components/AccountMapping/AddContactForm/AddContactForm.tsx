// import React, { useState } from 'react';
// import styles from './AddContactForm.module.css';

// type Contact = {
//   category: string;
//   name: string;
//   designation: string;
//   mobile_no: string;
//   email_id: string;
// };

// type AddContactFormProps = {
//   onAddContact: (newContact: Contact) => void;
//   onCancel: () => void;
// };

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

// const AddContactForm: React.FC<AddContactFormProps> = ({ onAddContact, onCancel }) => {
//   const [newContact, setNewContact] = useState<Contact>({
//     category: '',
//     name: '',
//     designation: '',
//     mobile_no: '',
//     email_id: '',
//   });

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setNewContact((prevContact) => ({
//       ...prevContact,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onAddContact(newContact); // Pass the newContact data to the parent component
//     setNewContact({
//       category: '',
//       name: '',
//       designation: '',
//       mobile_no: '',
//       email_id: '',
//     });
    
//   };

//   return (
//     <div className={styles.formContainer}>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         {/* Category Dropdown */}
//         <div className={styles.formGroup}>
//           <label htmlFor="category">Category</label>
//           <select
//             id="category"
//             name="category"
//             value={newContact.category}
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
//             value={newContact.name}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="designation">Designation</label>
//           <input
//             type="text"
//             id="designation"
//             name="designation"
//             value={newContact.designation}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="mobile_no">Mobile No</label>
//           <input
//             type="text"
//             id="mobile_no"
//             name="mobile_no"
//             value={newContact.mobile_no}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="email_id">Email ID</label>
//           <input
//             type="email"
//             id="email_id"
//             name="email_id"
//             value={newContact.email_id}
//             onChange={handleInputChange}
//           />
//         </div>
//         <button type="submit" className={styles.submitButton}>Submit</button>
//         <button type="button" onClick={onCancel} className={styles.cancelButton}>Cancel</button>
//       </form>
//     </div>
//   );
// };

// export default AddContactForm;



// import React, { useState } from 'react';
// import { UserPlus } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// type Contact = {
//   category: string;
//   name: string;
//   designation: string;
//   mobile_no: string;
//   email_id: string;
// };

// type AddContactFormProps = {
//   onAddContact: (newContact: Contact) => void;
//   onCancel: () => void;
// };

// // ─── Constants ────────────────────────────────────────────────────────────────

// const CATEGORY_CHOICES = [
//   ['plant_head', 'Plant Head'], ['purchase_head', 'Purchase Head'],
//   ['it_head', 'IT Head'], ['quality_head', 'Quality Head'],
//   ['production_head', 'Production Head'], ['plant_pic', 'Plant PIC'],
//   ['purchase_pic', 'Purchase PIC'], ['it_pic', 'IT PIC'],
//   ['quality_pic', 'Quality PIC'], ['production_pic', 'Production PIC'],
// ];

// // ─── Style helper ─────────────────────────────────────────────────────────────

// const inputClass =
//   "w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200";

// // ─── Component ────────────────────────────────────────────────────────────────

// const AddContactForm: React.FC<AddContactFormProps> = ({ onAddContact, onCancel }) => {
//   const [newContact, setNewContact] = useState<Contact>({
//     category: '', name: '', designation: '', mobile_no: '', email_id: '',
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setNewContact((prevContact) => ({ ...prevContact, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onAddContact(newContact);
//     setNewContact({ category: '', name: '', designation: '', mobile_no: '', email_id: '' });
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-2 border-indigo-100 overflow-hidden">

//         {/* Gradient Header */}
//         <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4 flex items-center gap-3">
//           <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
//             <UserPlus size={16} color="white" />
//           </div>
//           <h2 className="text-base font-bold text-white">Add Contact</h2>
//         </div>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">

//           {/* Category */}
//           <div className="flex flex-col gap-1.5">
//             <label htmlFor="category" className="text-sm font-semibold text-slate-700">Category</label>
//             <select id="category" name="category" value={newContact.category} onChange={handleInputChange}
//               className={`${inputClass} [&>option]:text-slate-800 [&>option]:font-medium ${!newContact.category ? 'text-slate-400 font-normal' : 'text-slate-800'}`}>
//               <option value="">Select Category</option>
//               {CATEGORY_CHOICES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
//             </select>
//           </div>

//           {/* Name */}
//           <div className="flex flex-col gap-1.5">
//             <label htmlFor="name" className="text-sm font-semibold text-slate-700">Name</label>
//             <input type="text" id="name" name="name" value={newContact.name} onChange={handleInputChange} placeholder="Enter Name" className={inputClass} />
//           </div>

//           {/* Designation */}
//           <div className="flex flex-col gap-1.5">
//             <label htmlFor="designation" className="text-sm font-semibold text-slate-700">Designation</label>
//             <input type="text" id="designation" name="designation" value={newContact.designation} onChange={handleInputChange} placeholder="Enter Designation" className={inputClass} />
//           </div>

//           {/* Mobile No */}
//           <div className="flex flex-col gap-1.5">
//             <label htmlFor="mobile_no" className="text-sm font-semibold text-slate-700">Mobile No</label>
//             <input type="text" id="mobile_no" name="mobile_no" value={newContact.mobile_no} onChange={handleInputChange} placeholder="Enter Mobile Number" className={inputClass} />
//           </div>

//           {/* Email ID */}
//           <div className="flex flex-col gap-1.5">
//             <label htmlFor="email_id" className="text-sm font-semibold text-slate-700">Email ID</label>
//             <input type="email" id="email_id" name="email_id" value={newContact.email_id} onChange={handleInputChange} placeholder="Enter Email Address" className={inputClass} />
//           </div>

//           <div className="border-t border-slate-100 pt-3 flex gap-3">
//             <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors shadow-md">Submit</button>
//             <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors">Cancel</button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddContactForm;





// AddContactForm.tsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';   // ← add this
import { UserPlus } from 'lucide-react';

type Contact = {
  category: string;
  name: string;
  designation: string;
  mobile_no: string;
  email_id: string;
};

type AddContactFormProps = {
  onAddContact: (newContact: Contact) => void;
  onCancel: () => void;
};

const CATEGORY_CHOICES = [
  ['plant_head', 'Plant Head'], ['purchase_head', 'Purchase Head'],
  ['it_head', 'IT Head'], ['quality_head', 'Quality Head'],
  ['production_head', 'Production Head'], ['plant_pic', 'Plant PIC'],
  ['purchase_pic', 'Purchase PIC'], ['it_pic', 'IT PIC'],
  ['quality_pic', 'Quality PIC'], ['production_pic', 'Production PIC'],
];

const inputClass =
  "w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200";

const AddContactForm: React.FC<AddContactFormProps> = ({ onAddContact, onCancel }) => {
  const [newContact, setNewContact] = useState<Contact>({
    category: '', name: '', designation: '', mobile_no: '', email_id: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewContact((prevContact) => ({ ...prevContact, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddContact(newContact);
    setNewContact({ category: '', name: '', designation: '', mobile_no: '', email_id: '' });
  };

  // ← createPortal renders directly into document.body,
  //   completely bypassing any parent overflow-y-auto context
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-2 border-indigo-100 overflow-hidden">

        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <UserPlus size={16} color="white" />
          </div>
          <h2 className="text-base font-bold text-white">Add Contact</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-semibold text-slate-700">
              Category
            </label>
            <select
              id="category" name="category"
              value={newContact.category}
              onChange={handleInputChange}
              className={`${inputClass} [&>option]:text-slate-800 [&>option]:font-medium ${
                !newContact.category ? 'text-slate-400 font-normal' : 'text-slate-800'
              }`}
            >
              <option value="">Select Category</option>
              {CATEGORY_CHOICES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-semibold text-slate-700">Name</label>
            <input
              type="text" id="name" name="name"
              value={newContact.name}
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
              type="text" id="designation" name="designation"
              value={newContact.designation}
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
              type="text" id="mobile_no" name="mobile_no"
              value={newContact.mobile_no}
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
              type="email" id="email_id" name="email_id"
              value={newContact.email_id}
              onChange={handleInputChange}
              placeholder="Enter Email Address"
              className={inputClass}
            />
          </div>

          <div className="border-t border-slate-100 pt-3 flex gap-3">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors shadow-md"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body  // ← escapes the overflow-y-auto trap
  );
};

export default AddContactForm;