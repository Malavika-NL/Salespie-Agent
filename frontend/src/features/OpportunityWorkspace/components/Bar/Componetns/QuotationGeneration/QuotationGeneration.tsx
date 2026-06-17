// import React from 'react';
// import styles from './QuotationGeneration.module.css';
// import { useSelector } from 'react-redux';
// import type { RootState } from '../../../../../../app/store';

// const QuotationGeneration: React.FC = () => {

//     const { loading, data, error, formData } = useSelector(
//         (state: RootState) => state.postOpportunityWorkspaceData
//     );
//     return (
//         <div className={styles.Container}>
//             <div className={styles.topDiv}>
//                 <div className={styles.box}>
//                     <label htmlFor="account_name" className={styles.texthead}>
//                         Company Name
//                     </label>
//                     <input
//                         type="text"
//                         id="account_name"
//                         value={formData ? formData.account_name : ''}
//                         // onChange={handleInputChange}
//                         // placeholder="Enter  PIC"
//                         className={styles.additionalInput}
//                     />
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="pic" className={styles.texthead}>
//                         Person Name
//                     </label>
//                     <input
//                         type="text"
//                         id="pic"
//                         value={formData ? formData.pic : ''}
//                         // onChange={handleInputChange}
//                         // placeholder="Enter  PIC"
//                         className={styles.additionalInput}
//                     />
//                 </div>

//                 <div className={styles.box}>
//                     <label htmlFor="exp_closure_date" className={styles.texthead}>
//                         Date
//                     </label>
//                     <input
//                         type="date"
//                         id="exp_closure_date"
//                         value={formData ? formData.exp_closure_date : ''}
//                         // onChange={handleInputChange}
//                         // placeholder="Enter Exp Cl Date"
//                         className={`${styles.additionalInput} ${formData?.exp_closure_date === '' ? styles.defaultselect : ''}`}
//                     />
//                 </div>

//                 <div className={styles.box}>
//                     <label htmlFor="pic" className={styles.texthead}>
//                         Shipped From
//                     </label>
//                     <input
//                         type="text"
//                         id="pic"
//                         value={formData ? formData.pic : ''}
//                         // onChange={handleInputChange}
//                         // placeholder="Enter  PIC"
//                         className={styles.additionalInput}
//                     />
//                 </div>

//                 <div className={styles.box}>
//                     <label htmlFor="pic" className={styles.texthead}>
//                         Delivery
//                     </label>
//                     <input
//                         type="text"
//                         id="pic"
//                         value={formData ? formData.pic : ''}
//                         // onChange={handleInputChange}
//                         // placeholder="Enter  PIC"
//                         className={styles.additionalInput}
//                     />
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="pic" className={styles.texthead}>
//                         Payment Terms
//                     </label>
//                     <input
//                         type="text"
//                         id="pic"
//                         value={formData ? formData.pic : ''}
//                         // onChange={handleInputChange}
//                         // placeholder="Enter  PIC"
//                         className={styles.additionalInput}
//                     />
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="pic" className={styles.texthead}>
//                         Validity
//                     </label>
//                     <input
//                         type="text"
//                         id="pic"
//                         value={formData ? formData.pic : ''}
//                         // onChange={handleInputChange}
//                         // placeholder="Enter  PIC"
//                         className={styles.additionalInput}
//                     />
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="pic" className={styles.texthead}>
//                         Issued By
//                     </label>
//                     <input
//                         type="text"
//                         id="pic"
//                         value={formData ? formData.pic : ''}
//                         // onChange={handleInputChange}
//                         // placeholder="Enter  PIC"
//                         className={styles.additionalInput}
//                     />
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="loaction" className={styles.texthead}>
//                         Location
//                     </label>
//                     <input
//                         type="text"
//                         id="location"
//                         value={formData ? formData.location : ''}
//                         // onChange={handleInputChange}
//                         // placeholder="Enter  PIC"
//                         className={styles.additionalInput}
//                     />
//                 </div>

//             </div>
//             <div className={styles.bottomDiv}>
//                 <div className={styles.tableContainer}>
//                     <div className={styles.tableHeader}>
//                         <div>Product/Model</div>
//                         <div>Description</div>
//                         <div>Qty</div>
//                         <div>Unit Price(INR)</div>
//                         <div> Amount(INR)</div>
//                         <div>Remark</div>
//                         <div></div>
//                     </div>
//                     <div className={styles.tableRow}>
//                         <div>{formData?.opportunity}</div>
//                         <div>{formData?.opportunity_description}</div>
//                         <div>{formData?.qty}</div>
//                         <div>{formData?.values}</div>
//                         <div>{formData?.total_amount}</div>
//                         <div>{formData?.remarks}</div>
//                         <div></div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default QuotationGeneration;


import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../../app/store';
import { FileText } from 'lucide-react';

const inputClass =
  "w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200";

const QuotationGeneration: React.FC = () => {
  const { loading, data, error, formData } = useSelector(
    (state: RootState) => state.postOpportunityWorkspaceData
  );

  return (
    <div className="rounded-2xl border-2 border-teal-100 shadow-lg overflow-hidden">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-500 px-5 py-3 flex items-center gap-2">
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
          <FileText size={15} color="white" />
        </div>
        <h2 className="text-sm font-bold text-white tracking-wide">Quotation Generation</h2>
      </div>

      {/* Top Fields Grid */}
      <div className="bg-white px-5 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-4">

          <div className="flex flex-col gap-1.5">
            <label htmlFor="account_name" className="text-sm font-semibold text-slate-700">Company Name</label>
            <input type="text" id="account_name" value={formData ? formData.account_name : ''} readOnly className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="pic" className="text-sm font-semibold text-slate-700">Person Name</label>
            <input type="text" id="pic" value={formData ? formData.pic : ''} readOnly className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="exp_closure_date" className="text-sm font-semibold text-slate-700">Date</label>
            <input type="date" id="exp_closure_date" value={formData ? formData.exp_closure_date : ''} readOnly className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Shipped From</label>
            <input type="text" value={formData ? formData.pic : ''} readOnly className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Delivery</label>
            <input type="text" value={formData ? formData.pic : ''} readOnly className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Payment Terms</label>
            <input type="text" value={formData ? formData.pic : ''} readOnly className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Validity</label>
            <input type="text" value={formData ? formData.pic : ''} readOnly className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Issued By</label>
            <input type="text" value={formData ? formData.pic : ''} readOnly className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="location" className="text-sm font-semibold text-slate-700">Location</label>
            <input type="text" id="location" value={formData ? formData.location : ''} readOnly className={inputClass} />
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-teal-100 mx-5" />

      {/* Table */}
      <div className="bg-white px-5 py-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-teal-600 to-cyan-500">
              {['Product/Model', 'Description', 'Qty', 'Unit Price (INR)', 'Amount (INR)', 'Remark', ''].map((col) => (
                <th key={col} className="px-4 py-2.5 text-left text-xs font-bold text-white tracking-wide first:rounded-tl-xl last:rounded-tr-xl">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b-2 border-slate-100 hover:bg-teal-50 transition-colors">
              <td className="px-4 py-3 text-sm text-slate-700 font-medium">{formData?.opportunity || '—'}</td>
              <td className="px-4 py-3 text-sm text-slate-700 font-medium">{formData?.opportunity_description || '—'}</td>
              <td className="px-4 py-3 text-sm text-slate-700 font-medium">{formData?.qty || '—'}</td>
              <td className="px-4 py-3 text-sm text-slate-700 font-medium">{formData?.values || '—'}</td>
              <td className="px-4 py-3 text-sm font-bold text-teal-700">{formData?.total_amount || '—'}</td>
              <td className="px-4 py-3 text-sm text-slate-700 font-medium">{formData?.remarks || '—'}</td>
              <td className="px-4 py-3"></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default QuotationGeneration;