// import React from 'react';
// import styles from './CompanyDetails.module.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { addCompanyDetails } from '../../Slice/AccountWorkspaceSlice';
// import type { RootState } from '../../../../app/store';

// type Company = {
//   company_type: string;
//   account_type: string;
//   company_scale: string;
// };

// const CompanyDetails: React.FC = () => {
//   const dispatch = useDispatch();

//   // Access formData from Redux store
//   const { formData } = useSelector(
//     (state: RootState) => state.postAccountWorkspaceForm
//   );

//   // console.log('account formdata company', formData?.company[0]?.company_type);
//   // console.log('account formdata company', formData);

//   const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;

//     if (formData?.company) {
//       // Prepare the updated company details
//       const updatedCompany = {
//         ...formData.company[0],
//         [name]: value,
//       };

//       // Dispatch the updated company details
//       dispatch(addCompanyDetails(updatedCompany));
//     }
//   };


//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <p className={styles.heading}>Company Details</p>
//       </div>
//       <div className={styles.dottedLine}></div>
//       <form className={styles.form}>
//         <div className={styles.formRow}>
//           <div>
//             <span className={styles.dot}></span>
//             <label htmlFor="company_type" className={styles.label}>
//               Company Type :
//             </label>
//           </div>
//           <select
//             id="company_type"
//             name="company_type"
//             className={`${styles.input} ${formData?.company[0]?.company_type === '' ? styles.defaultselect : ''}`}
//             value={formData?.company[0]?.company_type || ''}
//             onChange={handleCompanyChange}
//           >
//             <option value="" disabled>
//               Select Company Type
//             </option>
//             <option value="New">New</option>
//             <option value="Existing">Existing</option>
//           </select>
//         </div>
//         <div className={styles.formRow}>
//           <div>
//             <span className={styles.dot}></span>
//             <label htmlFor="account_type" className={styles.label}>
//               Account Type :
//             </label>
//           </div>
//           <select
//             name="account_type"
//             className={`${styles.input} ${formData?.company[0]?.account_type === '' ? styles.defaultselect : ''}`}
//             value={formData?.company[0]?.account_type || ''}
//             onChange={handleCompanyChange}
//           >
//             <option value="" disabled>
//               Select Account Type
//             </option>
//             <option value="General">General</option>
//             <option value="Key Account">Key Account</option>
//           </select>
//         </div>
//         <div className={styles.formRow}>
//           <div>
//             <span className={styles.dot}></span>
//             <label htmlFor="company_scale" className={styles.label}>
//               Company Scale :
//             </label>
//           </div>
//           <select
//             name="company_scale"
//             className={`${styles.input} ${formData?.company[0]?.company_scale === '' ? styles.defaultselect : ''}`}
//             value={formData?.company[0]?.company_scale || ''}
//             onChange={handleCompanyChange}
//           >
//             <option value="" disabled>
//               Select Company Scale
//             </option>
//             <option value="Small">Small</option>
//             <option value="Medium">Medium</option>
//             <option value="Large">Large</option>
//           </select>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CompanyDetails;



// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { addCompanyDetails } from '../../Slice/AccountWorkspaceSlice';
// import type { RootState } from '../../../../app/store';

// type Company = {
//   company_type: string;
//   account_type: string;
//   company_scale: string;
// };

// const CompanyDetails: React.FC = () => {
//   const dispatch = useDispatch();

//   const { formData } = useSelector(
//     (state: RootState) => state.postAccountWorkspaceForm
//   );

//   const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;

//     if (formData?.company) {
//       const updatedCompany = {
//         ...formData.company[0],
//         [name]: value,
//       };

//       dispatch(addCompanyDetails(updatedCompany));
//     }
//   };

//   const selectClass = (value: string | undefined) =>
//     `w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 cursor-pointer [&>option]:text-slate-800 [&>option]:font-medium ${
//       !value ? 'text-slate-400 font-normal' : 'text-slate-800'
//     }`;

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full">
//       {/* Card Header */}
//       <div className="flex items-center gap-2 mb-5">
//         <div className="w-1 h-5 rounded-full bg-indigo-500" />
//         <h2 className="text-base font-semibold text-slate-800">
//           Company Details
//         </h2>
//       </div>

//       {/* Divider */}
//       <div className="border-t border-slate-100 mb-5" />

//       {/* Form Fields */}
//       <div className="flex flex-col gap-5">

//         {/* Company Type */}
//         <div className="flex flex-col gap-1.5">
//           <label htmlFor="company_type" className="text-sm font-semibold text-slate-700">
//             Company Type
//           </label>
//           <div className="relative">
//             <select
//               id="company_type"
//               name="company_type"
//               className={selectClass(formData?.company[0]?.company_type)}
//               value={formData?.company[0]?.company_type || ''}
//               onChange={handleCompanyChange}
//             >
//               <option value="" disabled>Select Company Type</option>
//               <option value="New">New</option>
//               <option value="Existing">Existing</option>
//             </select>
//             <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
//               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="m6 9 6 6 6-6"/>
//               </svg>
//             </span>
//           </div>
//         </div>

//         {/* Account Type */}
//         <div className="flex flex-col gap-1.5">
//           <label htmlFor="account_type" className="text-sm font-semibold text-slate-700">
//             Account Type
//           </label>
//           <div className="relative">
//             <select
//               id="account_type"
//               name="account_type"
//               className={selectClass(formData?.company[0]?.account_type)}
//               value={formData?.company[0]?.account_type || ''}
//               onChange={handleCompanyChange}
//             >
//               <option value="" disabled>Select Account Type</option>
//               <option value="General">General</option>
//               <option value="Key Account">Key Account</option>
//             </select>
//             <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
//               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="m6 9 6 6 6-6"/>
//               </svg>
//             </span>
//           </div>
//         </div>

//         {/* Company Scale */}
//         <div className="flex flex-col gap-1.5">
//           <label htmlFor="company_scale" className="text-sm font-semibold text-slate-700">
//             Company Scale
//           </label>
//           <div className="relative">
//             <select
//               id="company_scale"
//               name="company_scale"
//               className={selectClass(formData?.company[0]?.company_scale)}
//               value={formData?.company[0]?.company_scale || ''}
//               onChange={handleCompanyChange}
//             >
//               <option value="" disabled>Select Company Scale</option>
//               <option value="Small">Small</option>
//               <option value="Medium">Medium</option>
//               <option value="Large">Large</option>
//             </select>
//             <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
//               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="m6 9 6 6 6-6"/>
//               </svg>
//             </span>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default CompanyDetails;



import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCompanyDetails } from '../../Slice/AccountWorkspaceSlice';
import type { RootState } from '../../../../app/store';
import { Building2 } from 'lucide-react';

type Company = {
  company_type: string;
  account_type: string;
  company_scale: string;
};

const selectClass = (value: string | undefined) =>
  `w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-600 transition-all duration-200 cursor-pointer [&>option]:text-slate-800 [&>option]:font-medium ${!value ? 'text-slate-400 font-normal' : 'text-slate-800'}`;

const CompanyDetails: React.FC = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.postAccountWorkspaceForm);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (formData?.company) {
      const updatedCompany = { ...formData.company[0], [name]: value };
      dispatch(addCompanyDetails(updatedCompany));
    }
  };

  return (
    <div className="rounded-2xl border-2 border-violet-100 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-3 flex items-center gap-2">
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
          <Building2 size={15} color="white" />
        </div>
        <h2 className="text-sm font-bold text-white tracking-wide">Company Details</h2>
      </div>
      <div className="bg-white px-5 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company_type" className="text-sm font-semibold text-slate-700">Company Type</label>
          <select id="company_type" name="company_type" className={selectClass(formData?.company[0]?.company_type)} value={formData?.company[0]?.company_type || ''} onChange={handleCompanyChange}>
            <option value="">Select Company Type</option>
            <option value="New">New</option>
            <option value="Existing">Existing</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="account_type" className="text-sm font-semibold text-slate-700">Account Type</label>
          <select id="account_type" name="account_type" className={selectClass(formData?.company[0]?.account_type)} value={formData?.company[0]?.account_type || ''} onChange={handleCompanyChange}>
            <option value="">Select Account Type</option>
            <option value="General">General</option>
            <option value="Key Account">Key Account</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company_scale" className="text-sm font-semibold text-slate-700">Company Scale</label>
          <select id="company_scale" name="company_scale" className={selectClass(formData?.company[0]?.company_scale)} value={formData?.company[0]?.company_scale || ''} onChange={handleCompanyChange}>
            <option value="">Select Company Scale</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
