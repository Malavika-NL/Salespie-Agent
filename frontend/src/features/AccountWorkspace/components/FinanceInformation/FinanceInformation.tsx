// import React from 'react';
// import styles from './FinanceInformation.module.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { addFinanceDetails } from '../../Slice/AccountWorkspaceSlice';
// import type { RootState } from '../../../../app/store';

// type Finance = {
//   turn_over: number;
//   account_resumable: number;
//   credits: number;
// };

// const FinanceInformation: React.FC = () => {
//   const dispatch = useDispatch();

//   // Access formData from Redux store
//   const { formData } = useSelector(
//     (state: RootState) => state.postAccountWorkspaceForm
//   );

//   // console.log('account formdata finance', formData);

//   const handleFinanceChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;

//     if (formData?.finance) {
//       // Prepare the updated finance details
//       const updatedFinance = {
//         ...formData.finance[0],
//         [name]: Number(value),
//       };

//       // Dispatch the updated finance details
//       dispatch(addFinanceDetails(updatedFinance));
//     }
//   };

//   // Define defaults for controlled inputs
//   const financeDefaults = formData?.finance?.[0] || {
//     turn_over: '',
//     account_resumable: '',
//     credits: '',
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <p className={styles.heading}>Finance Information</p>
//       </div>
//       <div className={styles.dottedLine}></div>
//       <form className={styles.form}>
//         <div className={styles.formRow}>
//           <div>
//             <span className={styles.dot}></span>
//             <label htmlFor="turn_over" className={styles.label}>
//               Turn Over :
//             </label>
//           </div>
//           <input
//             type="number"
//             name="turn_over"
//             className={styles.input}
//             value={financeDefaults.turn_over}
//             onChange={handleFinanceChange}
//             placeholder='Enter Turn Over Amount'
//           />
//         </div>
//         <div className={styles.formRow}>
//           <div>
//             <span className={styles.dot}></span>
//             <label htmlFor="account_resumable" className={styles.label}>
//               Account Receivable :
//             </label>
//           </div>
//           <input
//             type="number"
//             name="account_resumable"
//             className={styles.input}
//             value={financeDefaults.account_resumable}
//             onChange={handleFinanceChange}
//             placeholder='Enter Account Receivable'
//           />
//         </div>
//         <div className={styles.formRow}>
//           <div>
//             <span className={styles.dot}></span>
//             <label htmlFor="credits" className={styles.label}>
//               Field Credits :
//             </label>
//           </div>
//           <input
//             type="number"
//             name="credits"
//             className={styles.input}
//             value={financeDefaults.credits}
//             onChange={handleFinanceChange}
//             placeholder='Enter  Field Credits'
//           />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default FinanceInformation;




// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { addFinanceDetails } from '../../Slice/AccountWorkspaceSlice';
// import type { RootState } from '../../../../app/store';

// type Finance = {
//   turn_over: number;
//   account_resumable: number;
//   credits: number;
// };

// const FinanceInformation: React.FC = () => {
//   const dispatch = useDispatch();

//   const { formData } = useSelector(
//     (state: RootState) => state.postAccountWorkspaceForm
//   );

//   const handleFinanceChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;

//     if (formData?.finance) {
//       const updatedFinance = {
//         ...formData.finance[0],
//         [name]: Number(value),
//       };

//       dispatch(addFinanceDetails(updatedFinance));
//     }
//   };

//   const financeDefaults = formData?.finance?.[0] || {
//     turn_over: '',
//     account_resumable: '',
//     credits: '',
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full">
//       {/* Card Header */}
//       <div className="flex items-center gap-2 mb-5">
//         <div className="w-1 h-5 rounded-full bg-indigo-500" />
//         <h2 className="text-base font-semibold text-slate-800">
//           Finance Information
//         </h2>
//       </div>

//       {/* Divider */}
//       <div className="border-t border-slate-100 mb-5" />

//       {/* Form Fields */}
//       <div className="flex flex-col gap-5">

//         {/* Turn Over */}
//         <div className="flex flex-col gap-1.5">
//           <label
//             htmlFor="turn_over"
//             className="text-sm font-semibold text-slate-700"
//           >
//             Turn Over
//           </label>
//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
//               ₹
//             </span>
//             <input
//               type="number"
//               id="turn_over"
//               name="turn_over"
//               className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent  transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//               value={financeDefaults.turn_over}
//               onChange={handleFinanceChange}
//               placeholder="Enter Turn Over Amount"
//             />
//           </div>
//         </div>

//         {/* Account Receivable */}
//         <div className="flex flex-col gap-1.5">
//           <label
//             htmlFor="account_resumable"
//             className="text-sm font-semibold text-slate-700"
//           >
//             Account Receivable
//           </label>
//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
//               ₹
//             </span>
//             <input
//               type="number"
//               id="account_resumable"
//               name="account_resumable"
//               className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent  transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//               value={financeDefaults.account_resumable}
//               onChange={handleFinanceChange}
//               placeholder="Enter Account Receivable"
//             />
//           </div>
//         </div>

//         {/* Field Credits */}
//         <div className="flex flex-col gap-1.5">
//           <label
//             htmlFor="credits"
//             className="text-sm font-semibold text-slate-700"
//           >
//             Field Credits
//           </label>
//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
//               ₹
//             </span>
//             <input
//               type="number"
//               id="credits"
//               name="credits"
//               className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent  transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//               value={financeDefaults.credits}
//               onChange={handleFinanceChange}
//               placeholder="Enter Field Credits"
//             />
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default FinanceInformation;


import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFinanceDetails } from '../../Slice/AccountWorkspaceSlice';
import type { RootState } from '../../../../app/store';
import { TrendingUp } from 'lucide-react';

type Finance = {
  turn_over: number;
  account_resumable: number;
  credits: number;
};

const inputClass = "w-full pl-7 pr-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

const FinanceInformation: React.FC = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.postAccountWorkspaceForm);

  const handleFinanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (formData?.finance) {
      const updatedFinance = { ...formData.finance[0], [name]: value === '' ? '' : Number(value) };
      dispatch(addFinanceDetails(updatedFinance));
    }
  };

  const financeDefaults = formData?.finance?.[0] || { turn_over: '', account_resumable: '', credits: '' };

  return (
    <div className="rounded-2xl border-2 border-indigo-100 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 flex items-center gap-2">
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
          <TrendingUp size={15} color="white" />
        </div>
        <h2 className="text-sm font-bold text-white tracking-wide">Finance Information</h2>
      </div>
      <div className="bg-white px-5 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="turn_over" className="text-sm font-semibold text-slate-700">Turn Over</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 text-sm font-bold">₹</span>
            <input type="number" id="turn_over" name="turn_over" className={inputClass} value={financeDefaults.turn_over} onChange={handleFinanceChange} placeholder="Enter Turn Over Amount" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="account_resumable" className="text-sm font-semibold text-slate-700">Account Receivable</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 text-sm font-bold">₹</span>
            <input type="number" id="account_resumable" name="account_resumable" className={inputClass} value={financeDefaults.account_resumable} onChange={handleFinanceChange} placeholder="Enter Account Receivable" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="credits" className="text-sm font-semibold text-slate-700">Field Credits</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 text-sm font-bold">₹</span>
            <input type="number" id="credits" name="credits" className={inputClass} value={financeDefaults.credits} onChange={handleFinanceChange} placeholder="Enter Field Credits" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceInformation;
