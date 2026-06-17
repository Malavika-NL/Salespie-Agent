// import React, { useEffect, useRef, useState } from "react";
// import styles from "./accountDetails.module.css";
// import { FaRegEdit } from "react-icons/fa";
// import { CiBookmark } from "react-icons/ci";
// import type { IoIosArrowDropdown } from "react-icons/io";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
// import type { RootState } from "../../../../app/store";
// import { setFormData } from "../../Slice/EditAdminTargetWorkspaceSlice";
// import type { ICity, IState } from "country-state-city";
// import { getAllCities, getAllStates } from "../../../CommonAPI/Common";

// interface Vertical {
//     category: string;
//     subdivisions?: Vertical[];
// }

// const verticals: Vertical[] = [
//     {
//         category: 'Automobile',
//         subdivisions: [
//             { category: 'Automotive' },
//             { category: 'Auto Component' },
//             { category: 'Tier 1' },
//             { category: 'Tier 2' }
//         ]
//     },
//     { category: 'Health Care' },
//     { category: 'E-Commerce' },
//     {
//         category: 'E&E',
//         subdivisions: [
//             { category: 'Electronics' },
//             { category: 'Electrical Components' },
//             { category: 'Tier 1' }
//         ]
//     },
//     { category: 'FMCG' },
//     { category: 'Chemical Mfg' },
//     { category: 'Other Mfg' },
//     {
//         category: 'F&B',
//         subdivisions: [
//             { category: 'F&B Mfg' },
//             { category: 'Food Mfg' },
//             { category: 'Beverages Mfg' },
//             { category: 'Cloud Kitchen' }
//         ]
//     },
//     {
//         category: 'Pharmaceutical',
//         subdivisions: [
//             { category: 'Pharma/Health Care' },
//             { category: 'Hospitals' },
//             { category: 'Tier 1/Supplier' }
//         ]
//     },
//     {
//         category: 'Retails',
//         subdivisions: [
//             { category: 'E-Commerce' },
//             { category: 'Retails' }
//         ]
//     },
//     { category: 'Transport & Logistics' },
//     { category: 'Apparel' },
//     { category: 'Government' },
//     { category: 'Others' }
// ];

// interface Region {
//     name: string;
// }

// const regions: Region[] = [
//     { name: 'North' },
//     { name: 'South' },
//     { name: 'East' },
//     { name: 'West' },
//     { name: 'INT' }
// ];

// interface Department {
//     name: string;
// }

// const departments: Department[] = [
//     { name: 'Purchase' },
//     { name: 'Procurement' },
//     { name: 'PPC Head' },
//     { name: 'IT Head' },
//     { name: 'Plant Head' },
//     { name: 'Quality' },
//     { name: 'Logistics' },
//     { name: 'Supply Chain' },
//     { name: 'Operations' },
//     { name: 'Information System' },
//     { name: 'Vendor Development' },
//     { name: 'Commertials' },
//     { name: 'Project Development' },
//     { name: 'Maintenance' },
//     { name: 'Support & Services' },
//     { name: 'Manufacturing Head' },
//     { name: 'Production Head' },
//     { name: 'Warehouse Manager' },
//     { name: 'Business Development' },
//     { name: 'Sales Manager' },
//     { name: 'Marketing' },
//     { name: 'Admin/HR' }
// ];

// interface BusinessOption {
//     type: string;
// }

// const businessOptions: BusinessOption[] = [
//     { type: 'Direct Business' },
//     { type: 'Business Partner' }
// ];

// interface Designation {
//     title: string;
//     abbreviation: string;
// }

// const designations: Designation[] = [
//     { title: 'Assistant Manager', abbreviation: 'AM' },
//     { title: 'Senior Manager', abbreviation: 'Sr.M' },
//     { title: 'Assistant General Manager', abbreviation: 'AGM' },
//     { title: 'General Manager', abbreviation: 'GM' },
//     { title: 'Deputy Manager', abbreviation: 'DM' },
//     { title: 'Deputy General Manager', abbreviation: 'Dy.GM' },
//     { title: 'Vice President', abbreviation: 'VP' },
//     { title: 'Director', abbreviation: 'Director' },
//     { title: 'Director/Owner', abbreviation: 'Director/Owner' },
//     { title: 'Owner', abbreviation: 'Owner' },
//     { title: 'Senior Engineer', abbreviation: 'Sr.Engineer' },
//     { title: 'Executive', abbreviation: 'EX' },
//     { title: 'Senior Executive', abbreviation: 'Sr.EX' }
// ];


// interface ActivityOptions {
//     type: string;
// }

// const activityOptions: ActivityOptions[] = [
//     { type: 'Campaign' },
//     { type: 'Cold Call' },
//     { type: 'Sales Call' },
//     { type: 'Share Company Profile' },
//     { type: 'Introducing Meeting' },
//     { type: 'Demo' },
//     { type: ' Quotation Submission' },
//     { type: 'Q.Follow-Up' },
//     { type: 'Objection Handling' },
//     { type: 'OH.Follow-Up' },
//     { type: 'Negotiation' },
//     { type: 'N.Follow-Up' },
//     { type: 'Close' },
//     { type: 'C.Follow-Up' },
//     { type: 'Repeat Sales' },
//     { type: ' R.Follow-Up' },
//     { type: ' R.Close' },
//     { type: 'Up/Cross Sales' },
//     { type: 'U.C Follow-Up' },
//     { type: '   U.C Close' },
//     { type: ' RelationShip Maintenance' },

// ];


// interface AccountDetailsProps {

//     errors: { [key: string]: string };
// }

// interface LocationState {
//     focusField?: string;
// }

// const AccountDetails: React.FC<AccountDetailsProps> = ({ errors }) => {
//     const dispatch = useDispatch();
//     const location = useLocation() as { state: LocationState };
//     const [showDetails, setShowDetails] = useState(true);
//     // const [errors, setErrors] = useState<{ [key: string]: boolean }>({}); 
//     const toggleDetails = () => {
//         setShowDetails(!showDetails);
//     };
//     const { loading, data, error, formData } = useSelector(
//         (state: RootState) => state.AdminTargetWorkspaceEditData
//     );

//      const [states, setStates] = useState<IState[]>([]);
//         const [city, setcity] = useState<ICity[]>([]);
//         useEffect(() => {
    
//             setStates(getAllStates());
//         }, []);
//         useEffect(() => {
//             if (formData?.state) {
//                 setcity(getAllCities(formData?.state))
//             }
//         }, [formData?.state]);
        
//     console.log('formdata account', formData)


//     const accountNameRef = useRef<HTMLInputElement>(null);

//     useEffect(() => {
//         if (location.state?.focusField === "account_name" && accountNameRef.current) {
//             accountNameRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
//             accountNameRef.current.focus();
//         }
//     }, [location]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { id, value } = e.target;
//         dispatch(setFormData({ id, value }));
//     };


//     return (
//         <div className={styles.accountDetails}>
//             <div className={styles.topDiv}>
//                 {/* <div className={styles.box}>
//                     <label htmlFor="account_holder" className={styles.texthead}>
//                         Account Holder<span className={styles.required}>*</span>
//                     </label>
//                     <input
//                         type="text"
//                         id="account_holder"
//                         value={formData ? formData.account_holder : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         placeholder="Enter  Account Holder"
//                         className={styles.additionalInput}
//                     />
//                     {errors.account_holder && (
//                         <div className={styles.errorMessage}>Account Holder is required.</div> // Error message div
//                     )}
//                 </div> */}
//                 <div className={styles.box}>
//                     <label htmlFor="account_name" className={styles.texthead}>
//                         Account Name  <span className={styles.required}>*</span>
//                     </label>
//                     <input
//                         type="text"
//                         id="account_name"
//                         value={formData ? formData.account_name : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         placeholder="Enter Account Name"
//                         className={styles.additionalInput}
//                     />
//                     {errors.account_name && (
//                         <div className={styles.errorMessage}>Account Name is required.</div> // Error message div
//                     )}
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="pic" className={styles.texthead}>
//                         PIC
//                     </label>
//                     <input
//                         type="text"
//                         id="pic"
//                         value={formData ? formData.pic : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         placeholder="Enter  PIC"
//                         className={styles.additionalInput}
//                     />
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="vertical" className={styles.texthead}>
//                         Vertical
//                     </label>
//                     <select
//                         id="vertical"
//                         className={`${styles.additionalSelect} ${formData?.vertical === '' ? styles.defaultselect : ''}`}
//                         value={formData?.vertical ?? ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                     >
//                         <option value="">Select Vertical</option>
//                         {verticals.map((vertical, index) => (
//                             <option key={index} value={vertical.category}>
//                                 {vertical.category}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="business" className={styles.texthead}>
//                         Business Type
//                     </label>
//                     <select
//                         id="business"
//                         className={`${styles.additionalSelect} ${formData?.business === '' ? styles.defaultselect : ''}`}
//                         value={formData ? formData.business : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                     >
//                         <option>Select Business</option>
//                         {businessOptions.map((option, index) => (
//                             <option key={index} value={option.type}>
//                                 {option.type}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="vertical_sub" className={styles.texthead}>
//                         Sub Vertical
//                     </label>
//                     <select
//                         // value={formValues.vertical_sub || ''}
//                         value={formData?.vertical_sub ?? ''}
//                         id="vertical_sub"
//                         className={`${styles.additionalSelect} ${formData?.vertical_sub === '' ? styles.defaultselect : ''}`}
//                         onChange={handleInputChange}
//                     >
//                         <option>Select Sub-Vertical</option>
//                         {verticals
//                             .find(v => v.category === formData?.vertical)
//                             ?.subdivisions?.map((subdivision, index) => (
//                                 <option key={index} value={subdivision.category}>
//                                     {subdivision.category}
//                                 </option>
//                             ))}
//                     </select>
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="department" className={styles.texthead}>
//                         Department
//                     </label>
//                     <select
//                         id="department"
//                         className={`${styles.additionalSelect} ${formData?.department === '' ? styles.defaultselect : ''}`}

//                         value={formData ? formData.department : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                     >
//                         <option>Select Department</option>
//                         {departments.map((dept, index) => (
//                             <option key={index} value={dept.name}>
//                                 {dept.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="designation" className={styles.texthead}>
//                         Designation
//                     </label>
//                     <select
//                         id="designation"
//                         className={`${styles.additionalSelect} ${formData?.designation === '' ? styles.defaultselect : ''}`}
//                         value={formData ? formData.designation : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                     >
//                         <option>Select designation</option>
//                         {designations.map((designation, index) => (
//                             <option key={index} value={designation.abbreviation}>
//                                 {designation.title}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="mobile_number" className={styles.texthead}>
//                         Mobile No.
//                     </label>
//                     <input
//                         type="text"
//                         id="mobile_number"
//                         value={formData ? formData.mobile_number : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         placeholder="Enter Mobile Number"
//                         className={styles.additionalInput}
//                     />
//                 </div>
            
//                 <div className={styles.box}>
//                     <label htmlFor="region" className={styles.texthead}>
//                         Region
//                     </label>
//                     <select

//                         value={formData ? formData.region : ''}
//                         id="region"
//                         className={`${styles.additionalSelect} ${formData?.region === '' ? styles.defaultselect : ''}`}
//                         onChange={handleInputChange}
//                     >
//                         <option>Select Region</option>
//                         {regions.map((region, index) => (
//                             <option key={index} value={region.name}>
//                                 {region.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="state" className={styles.texthead}>
//                         state
//                     </label>
//                     <select

//                         value={formData ? formData.state : ''}
//                         id="state"
//                         className={`${styles.additionalSelect} ${formData?.state === '' ? styles.defaultselect : ''}`}
//                         onChange={handleInputChange}
//                     >
//                         <option>Select state</option>
//                         {states.map((state) => (
//                             <option key={state.name} value={state.name}>{state.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className={styles.box}>
//                     <label htmlFor="city" className={styles.texthead}>
//                         city
//                     </label>
//                     <select

//                         value={formData ? formData.city : ''}
//                         id="city"
//                         className={`${styles.additionalSelect} ${formData?.city === '' ? styles.defaultselect : ''}`}
//                         onChange={handleInputChange}
//                     >
//                         <option>Select city</option>
//                         {city.map((city) => (
//                             <option key={city.name} value={city.name}>{city.name}</option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="location" className={styles.texthead}>
//                         Enter  Location
//                     </label>
//                     <input
//                         type="text"
//                         id="location"
//                         value={formData ? formData.location : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         placeholder="Enter Location"
//                         className={styles.additionalInput}
//                     />
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="email_id" className={styles.texthead}>
//                         Email
//                     </label>
//                     <input
//                         type="email"
//                         id="email_id"
//                         value={formData ? formData.email_id : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         placeholder="Enter Email"
//                         className={styles.additionalInput}
//                     />
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="remarks" className={styles.texthead}>
//                         Remarks
//                     </label>
//                     <input
//                         type="text"
//                         id="remarks"
//                         value={formData ? formData.remarks : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         placeholder="Enter Remarks"
//                         className={styles.additionalInput}
//                     />
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="activity" className={styles.texthead}>
//                         Activity
//                     </label>
//                     <select

//                         value={formData ? formData.activity : ''}
//                         id="activity"
//                         className={`${styles.additionalSelect} ${formData?.activity === '' ? styles.defaultselect : ''}`}
//                         onChange={handleInputChange}
//                     >
//                         <option>Select a Activity</option>
//                         {activityOptions.map((option, index) => (
//                             <option key={index} value={option.type}>
//                                 {option.type}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="next_action" className={styles.texthead}>
//                         Next Action
//                     </label>
//                     <select

//                         value={formData ? formData.next_action : ''}
//                         id="next_action"
//                         className={`${styles.additionalSelect} ${formData?.next_action === '' ? styles.defaultselect : ''}`}
//                         onChange={handleInputChange}
//                     >
//                         <option>Select a Next Action</option>
//                         {activityOptions.map((option, index) => (
//                             <option key={index} value={option.type}>
//                                 {option.type}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="next_action_date" className={styles.texthead}>
//                         Next Action Date
//                     </label>
//                     <input
//                         type="date"
//                         id="next_action_date"
//                         value={formData ? formData.next_action_date : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         placeholder="Next Action Date "
//                         className={`${styles.additionalSelect} ${formData?.next_action_date === '' ? styles.defaultselect : ''}`}
//                     />
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="activity_date" className={styles.texthead}>
//                         Activity Date
//                     </label>
//                     <input
//                         type="date"
//                         id="activity_date"
//                         value={formData ? formData.activity_date : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         placeholder="Activity Date "
//                         className={`${styles.additionalSelect} ${formData?.activity_date === '' ? styles.defaultselect : ''}`}
//                     />
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="acct_created_date" className={styles.texthead}>
//                         Account Created Date
//                     </label>
//                     <input
//                         type="text"
//                         id="acct_created_date"
//                         value={formData?.acct_created_date}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         // placeholder="Enter  Account Holder"
//                         className={styles.additionalInput}
//                     />
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="address" className={styles.texthead}>
//                         Address
//                     </label>
//                     <textarea
//                         id="address"
//                         className={styles.textarea}
//                         value={formData ? formData.address : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         placeholder="Enter Address"
//                     />


//                 </div>
//             </div>
//             {/* <div className={styles.bottomDiv}>
//                 <div className={styles.box}>
//                     <label htmlFor="address" className={styles.texthead}>
//                         Address
//                     </label>
//                     <textarea
//                         id="address"
//                         className={styles.textarea}
//                         value={formData ? formData.address : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         placeholder="Enter Address"
//                     />


//                 </div>
//             </div> */}
//         </div>
//     );
// };

// export default AccountDetails;




import React, { useEffect, useRef, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import type { RootState } from "../../../../app/store";
import { setFormData } from "../../Slice/EditAdminTargetWorkspaceSlice";
import type { ICity, IState } from "country-state-city";
import { getAllCities, getAllStates } from "../../../CommonAPI/Common";
import { Activity } from "lucide-react";

// ─── Static Data ──────────────────────────────────────────────────────────────

interface Vertical { category: string; subdivisions?: Vertical[]; }
const verticals: Vertical[] = [
  { category: 'Automobile', subdivisions: [{ category: 'Automotive' }, { category: 'Auto Component' }, { category: 'Tier 1' }, { category: 'Tier 2' }] },
  { category: 'Health Care' }, { category: 'E-Commerce' },
  { category: 'E&E', subdivisions: [{ category: 'Electronics' }, { category: 'Electrical Components' }, { category: 'Tier 1' }] },
  { category: 'FMCG' }, { category: 'Chemical Mfg' }, { category: 'Other Mfg' },
  { category: 'F&B', subdivisions: [{ category: 'F&B Mfg' }, { category: 'Food Mfg' }, { category: 'Beverages Mfg' }, { category: 'Cloud Kitchen' }] },
  { category: 'Pharmaceutical', subdivisions: [{ category: 'Pharma/Health Care' }, { category: 'Hospitals' }, { category: 'Tier 1/Supplier' }] },
  { category: 'Retails', subdivisions: [{ category: 'E-Commerce' }, { category: 'Retails' }] },
  { category: 'Transport & Logistics' }, { category: 'Apparel' }, { category: 'Government' }, { category: 'Others' },
];

interface Region { name: string; }
const regions: Region[] = [{ name: 'North' }, { name: 'South' }, { name: 'East' }, { name: 'West' }, { name: 'INT' }];

interface Department { name: string; }
const departments: Department[] = [
  { name: 'Purchase' }, { name: 'Procurement' }, { name: 'PPC Head' }, { name: 'IT Head' },
  { name: 'Plant Head' }, { name: 'Quality' }, { name: 'Logistics' }, { name: 'Supply Chain' },
  { name: 'Operations' }, { name: 'Information System' }, { name: 'Vendor Development' },
  { name: 'Commertials' }, { name: 'Project Development' }, { name: 'Maintenance' },
  { name: 'Support & Services' }, { name: 'Manufacturing Head' }, { name: 'Production Head' },
  { name: 'Warehouse Manager' }, { name: 'Business Development' }, { name: 'Sales Manager' },
  { name: 'Marketing' }, { name: 'Admin/HR' },
];

interface BusinessOption { type: string; }
const businessOptions: BusinessOption[] = [{ type: 'Direct Business' }, { type: 'Business Partner' }];

interface Designation { title: string; abbreviation: string; }
const designations: Designation[] = [
  { title: 'Assistant Manager', abbreviation: 'AM' }, { title: 'Senior Manager', abbreviation: 'Sr.M' },
  { title: 'Assistant General Manager', abbreviation: 'AGM' }, { title: 'General Manager', abbreviation: 'GM' },
  { title: 'Deputy Manager', abbreviation: 'DM' }, { title: 'Deputy General Manager', abbreviation: 'Dy.GM' },
  { title: 'Vice President', abbreviation: 'VP' }, { title: 'Director', abbreviation: 'Director' },
  { title: 'Director/Owner', abbreviation: 'Director/Owner' }, { title: 'Owner', abbreviation: 'Owner' },
  { title: 'Senior Engineer', abbreviation: 'Sr.Engineer' }, { title: 'Executive', abbreviation: 'EX' },
  { title: 'Senior Executive', abbreviation: 'Sr.EX' },
];

interface ActivityOptions { type: string; }
const activityOptions: ActivityOptions[] = [
  { type: 'Campaign' }, { type: 'Cold Call' }, { type: 'Sales Call' },
  { type: 'Share Company Profile' }, { type: 'Introducing Meeting' }, { type: 'Demo' },
  { type: ' Quotation Submission' }, { type: 'Q.Follow-Up' }, { type: 'Objection Handling' },
  { type: 'OH.Follow-Up' }, { type: 'Negotiation' }, { type: 'N.Follow-Up' },
  { type: 'Close' }, { type: 'C.Follow-Up' }, { type: 'Repeat Sales' },
  { type: ' R.Follow-Up' }, { type: ' R.Close' }, { type: 'Up/Cross Sales' },
  { type: 'U.C Follow-Up' }, { type: '   U.C Close' }, { type: ' RelationShip Maintenance' },
];

interface AccountDetailsProps { errors: { [key: string]: string }; }
interface LocationState { focusField?: string; }

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputClass = "w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200";

const selectClass = (value: string | null | undefined) =>
  `w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200 [&>option]:text-slate-800 [&>option]:font-medium ${!value ? 'text-slate-400 font-normal' : 'text-slate-800'}`;

// ─── Component ────────────────────────────────────────────────────────────────

const AccountDetails: React.FC<AccountDetailsProps> = ({ errors }) => {
  const dispatch = useDispatch();
  const location = useLocation() as { state: LocationState };
  const [showDetails, setShowDetails] = useState(true);
  const toggleDetails = () => setShowDetails(!showDetails);

  const { loading, data, error, formData } = useSelector(
    (state: RootState) => state.AdminTargetWorkspaceEditData
  );

  const [states, setStates] = useState<IState[]>([]);
  const [city, setcity] = useState<ICity[]>([]);
  useEffect(() => { setStates(getAllStates()); }, []);
  useEffect(() => { if (formData?.state) { setcity(getAllCities(formData?.state)); } }, [formData?.state]);

  console.log('formdata account', formData);

  const accountNameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (location.state?.focusField === "account_name" && accountNameRef.current) {
      accountNameRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      accountNameRef.current.focus();
    }
  }, [location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    dispatch(setFormData({ id, value }));
  };

  return (
    <div className="rounded-2xl border-2 border-indigo-100 shadow-lg">

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-3 flex items-center gap-2 rounded-t-2xl">
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
          <Activity size={15} color="white" />
        </div>
        <h2 className="text-sm font-bold text-white tracking-wide">Target Details</h2>
      </div>

      {/* Fields Grid */}
      <div className="bg-white px-5 py-4 rounded-b-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-4">

          {/* Account Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="account_name" className="text-sm font-semibold text-slate-700">
              Account Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={accountNameRef}
              type="text"
              id="account_name"
              value={formData ? formData.account_name : ''}
              onChange={handleInputChange}
              placeholder="Enter Account Name"
              className={inputClass}
            />
            {errors.account_name && (
              <span className="text-red-500 text-xs mt-0.5">Account Name is required.</span>
            )}
          </div>

          {/* PIC */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pic" className="text-sm font-semibold text-slate-700">PIC</label>
            <input
              type="text"
              id="pic"
              value={formData ? formData.pic : ''}
              onChange={handleInputChange}
              placeholder="Enter PIC"
              className={inputClass}
            />
          </div>

          {/* Vertical */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="vertical" className="text-sm font-semibold text-slate-700">Vertical</label>
            <select
              id="vertical"
              className={selectClass(formData?.vertical)}
              value={formData?.vertical ?? ''}
              onChange={handleInputChange}
            >
              <option value="">Select Vertical</option>
              {verticals.map((v, i) => <option key={i} value={v.category}>{v.category}</option>)}
            </select>
          </div>

          {/* Business Type */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="business" className="text-sm font-semibold text-slate-700">Business Type</label>
            <select
              id="business"
              className={selectClass(formData?.business)}
              value={formData ? formData.business : ''}
              onChange={handleInputChange}
            >
              <option>Select Business</option>
              {businessOptions.map((o, i) => <option key={i} value={o.type}>{o.type}</option>)}
            </select>
          </div>

          {/* Sub Vertical */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="vertical_sub" className="text-sm font-semibold text-slate-700">Sub Vertical</label>
            <select
              id="vertical_sub"
              className={selectClass(formData?.vertical_sub)}
              value={formData?.vertical_sub ?? ''}
              onChange={handleInputChange}
            >
              <option>Select Sub-Vertical</option>
              {verticals.find(v => v.category === formData?.vertical)?.subdivisions?.map((s, i) => (
                <option key={i} value={s.category}>{s.category}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="department" className="text-sm font-semibold text-slate-700">Department</label>
            <select
              id="department"
              className={selectClass(formData?.department)}
              value={formData ? formData.department : ''}
              onChange={handleInputChange}
            >
              <option>Select Department</option>
              {departments.map((d, i) => <option key={i} value={d.name}>{d.name}</option>)}
            </select>
          </div>

          {/* Designation */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="designation" className="text-sm font-semibold text-slate-700">Designation</label>
            <select
              id="designation"
              className={selectClass(formData?.designation)}
              value={formData ? formData.designation : ''}
              onChange={handleInputChange}
            >
              <option>Select designation</option>
              {designations.map((d, i) => <option key={i} value={d.abbreviation}>{d.title}</option>)}
            </select>
          </div>

          {/* Mobile No */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mobile_number" className="text-sm font-semibold text-slate-700">Mobile No.</label>
            <input
              type="text"
              id="mobile_number"
              value={formData ? formData.mobile_number : ''}
              onChange={handleInputChange}
              placeholder="Enter Mobile Number"
              className={inputClass}
            />
          </div>

          {/* Region */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="region" className="text-sm font-semibold text-slate-700">Region</label>
            <select
              id="region"
              className={selectClass(formData?.region)}
              value={formData ? formData.region : ''}
              onChange={handleInputChange}
            >
              <option>Select Region</option>
              {regions.map((r, i) => <option key={i} value={r.name}>{r.name}</option>)}
            </select>
          </div>

          {/* State */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="state" className="text-sm font-semibold text-slate-700">State</label>
            <select
              id="state"
              className={selectClass(formData?.state)}
              value={formData ? formData.state : ''}
              onChange={handleInputChange}
            >
              <option>Select state</option>
              {states.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          {/* City */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="city" className="text-sm font-semibold text-slate-700">City</label>
            <select
              id="city"
              className={selectClass(formData?.city)}
              value={formData ? formData.city : ''}
              onChange={handleInputChange}
            >
              <option>Select city</option>
              {city.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="location" className="text-sm font-semibold text-slate-700">Location</label>
            <input
              type="text"
              id="location"
              value={formData ? formData.location : ''}
              onChange={handleInputChange}
              placeholder="Enter Location"
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email_id" className="text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              id="email_id"
              value={formData ? formData.email_id : ''}
              onChange={handleInputChange}
              placeholder="Enter Email"
              className={inputClass}
            />
          </div>

          {/* Remarks */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="remarks" className="text-sm font-semibold text-slate-700">Remarks</label>
            <input
              type="text"
              id="remarks"
              value={formData ? formData.remarks : ''}
              onChange={handleInputChange}
              placeholder="Enter Remarks"
              className={inputClass}
            />
          </div>

          {/* Activity */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="activity" className="text-sm font-semibold text-slate-700">Activity</label>
            <select
              id="activity"
              className={selectClass(formData?.activity)}
              value={formData ? formData.activity : ''}
              onChange={handleInputChange}
            >
              <option>Select a Activity</option>
              {activityOptions.map((o, i) => <option key={i} value={o.type}>{o.type}</option>)}
            </select>
          </div>

          {/* Next Action */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="next_action" className="text-sm font-semibold text-slate-700">Next Action</label>
            <select
              id="next_action"
              className={selectClass(formData?.next_action)}
              value={formData ? formData.next_action : ''}
              onChange={handleInputChange}
            >
              <option>Select a Next Action</option>
              {activityOptions.map((o, i) => <option key={i} value={o.type}>{o.type}</option>)}
            </select>
          </div>

          {/* Next Action Date */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="next_action_date" className="text-sm font-semibold text-slate-700">Next Action Date</label>
            <input
              type="date"
              id="next_action_date"
              value={formData ? formData.next_action_date : ''}
              onChange={handleInputChange}
              className={inputClass}
            />
          </div>

          {/* Activity Date */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="activity_date" className="text-sm font-semibold text-slate-700">Activity Date</label>
            <input
              type="date"
              id="activity_date"
              value={formData ? formData.activity_date : ''}
              onChange={handleInputChange}
              className={inputClass}
            />
          </div>

          {/* Account Created Date */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="acct_created_date" className="text-sm font-semibold text-slate-700">Account Created Date</label>
            <input
              type="text"
              id="acct_created_date"
              value={formData?.acct_created_date}
              onChange={handleInputChange}
              className={inputClass}
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="address" className="text-sm font-semibold text-slate-700">Address</label>
            <textarea
              id="address"
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200 resize-none h-[72px]"
              value={formData ? formData.address : ''}
              onChange={handleInputChange}
              placeholder="Enter Address"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
