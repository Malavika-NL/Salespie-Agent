// import React, { useEffect, useState } from 'react';
// import styles from './PopupForm.module.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { postAdminLeadWorkspaceStatus } from '../../AdminLeadDashboard/LeadStatus/Slice/AdminLeadStatusSlice';
// import { getUserDetails } from '../../lead/slice/leadFormSlice';
// import type { RootState } from '../../../app/store';

// interface Stage {
//     stages: string;
//     ranks: string;
//     lost_reason?: string;
// }

// interface PicDetails {
//     pic_department: string;
//     pic_name: string;
//     pic_designation: string;
//     pic_email: string;
//     pic_phnone: string;
//     pic_phntwo: string;
// }




// interface Lead {
//     id:string;
//     account_holder: string;
//     account_name: string;
//     assign_to: string;
//     business_type: string;
//     lead: string;
//     make: string;
//     sub_make: string;
//     sub_make_brand: string;
//     pic: string;
//     contact_person: string;
//     designation: string;
//     department: string;
//     mobile_number: string;
//     description: string;
//     location: string;
//     state: string;
//     city: string;
//     address: string;
//     qty: string;
//     values: number | null;
//     email_id:string;
//     exp_closure_date: string;
//     exp_po_date: string;
//     remarks?: string | null;
//     acct_created_date: string;
//     hardware_amount: number | null;
//     software_amount: number | null;
//     consumables_amount: number | null;
//     automation_amount: number | null;
//     solution_amount: number | null;
//     maintenance_amount: number | null;
//     others_amount: number | null;
//     total_amount: number | null;
//     status: string | null;
//     vertical: string | null;
//     lead_stages: Stage[];
//     lead_pic: PicDetails[];
//     user:string;
// }

// interface PopupFormProps {
//     lead: Lead;
//     onSave: (formData: Lead) => void;
//     onClose: () => void;
// }

// const PopupForm: React.FC<PopupFormProps> = ({ lead, onSave, onClose }) => {
//     const dispatch = useDispatch();
//     const [formData, setformData] = useState<Lead>({ ...lead });
//     console.log('lead data', formData)
//     const userData = useSelector((state: RootState) => state.getUserData.userData);


//     useEffect(() => {
//             dispatch(getUserDetails() as any);
//         }, []);
    

        
//     const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setformData((prev) => ({ ...prev, [name]: value }));
//     };
//     console.log(formData)
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSave(formData);
//     };

 
//     // const handleConvertToOpportunity = () => {
//     //    const id = formData.id
//     //    dispatch(postAdminLeadWorkspaceStatus({id}) as any); 
//     // };
//     return (
//         <>
//             {/* Blurred background overlay */}
//             <div className={styles.overlay} onClick={onClose}></div>

//             {/* Popup form */}
//             <div className={styles.popupForm}>
//                 <div className={styles.formContent}>
//                     <h3>Update Lead</h3>
//                     <form onSubmit={handleSubmit}>
//                     <label>
//                             Account Name:
//                             <input type="text" name="account_name" value={formData.account_name} disabled />
//                         </label>
//                         <label>
//                             Lead:
//                             <input type="text" name="lead" value={formData.lead} disabled />
//                         </label>
//                         <label>
//                             Status:
//                             <select name="status" value={formData.status ?? ''} onChange={handleChange}>

//                                 <option value="new_lead">New Lead</option>
//                                 <option value="follow_up">Follow Up</option>
//                                 <option value="marketing_review">Marketing Review</option>
//                                 <option value="opportunity">Opportunity</option>
//                             </select>
//                         </label>
                       
                      
//                         <label>
//                             PIC:
//                             <input type="text" name="pic" value={formData.pic} disabled />
//                         </label>
//                         <label>
//                             Mobile Number:
//                             <input type="text" name="mobile_number" value={formData.mobile_number} disabled />
//                         </label>
//                         <label>
//                             Assigned By:
//                             <select
//                                 // value={formData.business}
//                                 value={formData?.assign_to ?? ''}
//                                 name="assign_to"
//                                 className={styles.select}
//                                 onChange={handleChange}
//                             >
//                                 <option>Select User</option>
//                                 {userData.map((option, index) => (
//                                     <option key={index} value={option.username}>
//                                         {option.username}
//                                     </option>
//                                 ))}
//                             </select>
//                         </label>
//                         {/* <button type="button" onClick={handleConvertToOpportunity}>convert to opportuntiy</button> */}
//                         <div className={styles.buttonGroup}>
//                             <button type="submit">Save</button>
//                             <button type="button" onClick={onClose}>Cancel</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default PopupForm;





import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postAdminLeadWorkspaceStatus } from '../../AdminLeadDashboard/LeadStatus/Slice/AdminLeadStatusSlice';
import { getUserDetails } from '../../lead/slice/leadFormSlice';
import type { RootState } from '../../../app/store';
import { FaRegEdit } from 'react-icons/fa';
import { X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stage { stages: string; ranks: string; lost_reason?: string; }
interface PicDetails { pic_department: string; pic_name: string; pic_designation: string; pic_email: string; pic_phnone: string; pic_phntwo: string; }

interface Lead {
  id: string; account_holder: string; account_name: string; assign_to: string;
  business_type: string; lead: string; make: string; sub_make: string;
  sub_make_brand: string; pic: string; contact_person: string; designation: string;
  department: string; mobile_number: string; description: string; location: string;
  state: string; city: string; address: string; qty: string; values: number | null;
  email_id: string; exp_closure_date: string; exp_po_date: string;
  remarks?: string | null; acct_created_date: string;
  hardware_amount: number | null; software_amount: number | null;
  consumables_amount: number | null; automation_amount: number | null;
  solution_amount: number | null; maintenance_amount: number | null;
  others_amount: number | null; total_amount: number | null;
  status: string | null; vertical: string | null;
  lead_stages: Stage[]; lead_pic: PicDetails[]; user: string;
}

interface PopupFormProps { lead: Lead; onSave: (formData: Lead) => void; onClose: () => void; }

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputClass = "w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200";
const disabledClass = "w-full px-3 py-2 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm text-slate-400 font-medium cursor-not-allowed";
const selectClass = `${inputClass} [&>option]:text-slate-800 [&>option]:font-medium`;

// ─── Component ────────────────────────────────────────────────────────────────

const PopupForm: React.FC<PopupFormProps> = ({ lead, onSave, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setformData] = useState<Lead>({ ...lead });
  const userData = useSelector((state: RootState) => state.getUserData.userData);

  useEffect(() => { dispatch(getUserDetails() as any); }, []);

  console.log('lead data', formData);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setformData(prev => ({ ...prev, [name]: value }));
  };

  console.log(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2000] w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-violet-100 overflow-hidden">

          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                <FaRegEdit size={13} color="white" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide m-0">Update Lead</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors border-none cursor-pointer" aria-label="Close">
              <X size={15} color="white" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4 rounded-b-2xl">

            {/* Account Name — disabled */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Account Name</label>
              <input type="text" name="account_name" value={formData.account_name} disabled className={disabledClass} />
            </div>

            {/* Lead — disabled */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Lead</label>
              <input type="text" name="lead" value={formData.lead} disabled className={disabledClass} />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Status</label>
              <select name="status" value={formData.status ?? ''} onChange={handleChange} className={selectClass}>
                <option value="new_lead">New Lead</option>
                <option value="follow_up">Follow Up</option>
                <option value="marketing_review">Marketing Review</option>
                <option value="opportunity">Opportunity</option>
              </select>
            </div>

            {/* PIC — disabled */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">PIC</label>
              <input type="text" name="pic" value={formData.pic} disabled className={disabledClass} />
            </div>

            {/* Mobile Number — disabled */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
              <input type="text" name="mobile_number" value={formData.mobile_number} disabled className={disabledClass} />
            </div>

            {/* Assigned By */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Assigned By</label>
              <select value={formData?.assign_to ?? ''} name="assign_to" onChange={handleChange} className={selectClass}>
                <option>Select User</option>
                {userData.map((option: any, index: number) => (
                  <option key={index} value={option.username}>{option.username}</option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors shadow-md cursor-pointer border-none">
                Save
              </button>
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors cursor-pointer border-none">
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default PopupForm;
