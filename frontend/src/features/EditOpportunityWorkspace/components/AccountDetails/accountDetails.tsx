// import React, { useEffect, useState } from "react";
// import styles from "./accountDetails.module.css";
// import { FaRegEdit } from "react-icons/fa";
// import { CiBookmark } from "react-icons/ci";
// import type { IoIosArrowDropdown } from "react-icons/io";
// import { useDispatch, useSelector } from "react-redux";

// import type { RootState } from "../../../../app/store";
// import { setFormData } from "../../slice/EditOpportunityWorkspace";
// import type { ICity, IState } from "country-state-city";
// import { getAllCities, getAllStates } from "../../../CommonAPI/Common";
// import { calculateTotal } from "../../../CalculateTotalAmount/totalAmount";


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


// interface Option {
//     category: string;
//     subdivisions?: Option[];
// }
// const makes: Option[] = [
//     {
//         category: 'Printer',
//         subdivisions: [
//             { category: 'Zebra' },
//             { category: 'Sato' },
//             { category: 'Argox' },
//             { category: 'Godex' },
//             { category: 'Bixolon' },
//             { category: 'TSC' },
//             { category: 'Printronix' },
//             { category: 'Others' }
//         ]
//     },
//     {
//         category: 'Scanners',
//         subdivisions: [
//             { category: 'Zebra' },
//             { category: 'Honey Well' },
//             { category: 'Argox' }
//         ]
//     },
//     {
//         category: 'HHT',
//         subdivisions: [
//             { category: 'Zebra' },
//             { category: 'Seuic' },
//             { category: 'Cipherlab' }
//         ]
//     },
//     {
//         category: 'Consumables',
//         subdivisions: [
//             {
//                 category: 'Label', subdivisions: [
//                     {
//                         category: 'Paper', subdivisions: [
//                             { category: 'Normal Chrome' },
//                             { category: 'AD Chrome' }
//                         ]
//                     },
//                     { category: 'Polyster' },
//                     { category: 'Tafatta' },
//                     { category: 'PET' },
//                     { category: 'PP' }
//                 ]
//             },
//             {
//                 category: 'Ribbon', subdivisions: [
//                     {
//                         category: 'Wax', subdivisions: [
//                             { category: 'Economical' },
//                             { category: 'Standard' },
//                             { category: 'Premium' }
//                         ]
//                     },
//                     {
//                         category: 'Wax Resin', subdivisions: [
//                             { category: 'Economical' },
//                             { category: 'Standard' },
//                             { category: 'Premium' }
//                         ]
//                     },
//                     {
//                         category: 'Resin', subdivisions: [
//                             { category: 'Economical' },
//                             { category: 'Standard' },
//                             { category: 'Premium' }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         category: 'Software',
//         subdivisions: [
//             { category: 'WMS Solution' },
//             { category: 'WIP Solution' },
//             { category: 'Asset Management Solution' },
//             { category: 'Life Science Solutions' },
//             { category: 'Printing Software' },
//             { category: 'Scanning Software' },
//             { category: 'RFID Truck management solutions' },
//             { category: 'Customised software' }
//         ]
//     },
//     {
//         category: 'Automation',
//         subdivisions: [
//             { category: 'Line Automation' },
//             { category: 'Visual Inspection System' },
//             { category: 'Poka Yoke System' },
//             { category: 'Print and Apply System' },
//             { category: 'Conveyor Scanning' },
//             { category: 'Direct part Marking' },
//             { category: 'SPM' },
//             { category: 'Vision Guided Robots' }
//         ]
//     }
// ];


// interface AccountDetailsProps {

//     errors: { [key: string]: string };
// }

// interface LocationState {
//     focusField?: string;
// }

// const AccountDetails: React.FC<AccountDetailsProps> = ({ errors }) => {

//     const dispatch = useDispatch();
//     const [showDetails, setShowDetails] = useState(true);

//     const toggleDetails = () => {
//         setShowDetails(!showDetails);
//     };

//     //   };
//     const { loading, data, error, formData } = useSelector(
//         (state: RootState) => state.postEditOpportunityWorkspaceForm
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
      
        
//         useEffect(() => {
//             const amountsToCalculate = {
//                 hardware_amount: formData?.hardware_amount ?? 0,
//                 software_amount: formData?.software_amount ?? 0,
//                 consumables_amount: formData?.consumables_amount ?? 0,
//                 automation_amount: formData?.automation_amount ?? 0,
//                 solution_amount: formData?.solution_amount ?? 0,
//                 maintenance_amount: formData?.maintenance_amount ?? 0,
//                 others_amount: formData?.others_amount ?? 0,
//             };
        
//             const total = calculateTotal(amountsToCalculate);
        
//             // Only dispatch if total_amount actually changed
//             if (formData?.total_amount !== total) {
//                 dispatch(setFormData({ id: "total_amount", value: total }));
//             }
        
//         }, [
//             formData?.hardware_amount,
//             formData?.software_amount,
//             formData?.consumables_amount,
//             formData?.automation_amount,
//             formData?.solution_amount,
//             formData?.maintenance_amount,
//             formData?.others_amount
//         ]);
        
//     //  console.log('account data', formData)
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { id, value } = e.target;
//         dispatch(setFormData({ id, value }));
//     };




//     const [selectedOpportunity, setSelectedOpportunity] = useState<string>('');
//     const [selectedMake, setSelectedMake] = useState<string>('');
//     const [selectedSubOption, setSelectedSubOption] = useState<string>('');
//     const [selectedSubSubOption, setSelectedSubSubOption] = useState<string>('');

//     // Handle the change for Opportunity selection
//     const handleOpportunityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedOpportunity(event.target.value);
//         const { id, value } = event.target;
//         dispatch(setFormData({ id, value }));

//     };

//     // Handle the change for Make selection
//     const handleMakeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedMake(event.target.value);
//         const { id, value } = event.target;
//         dispatch(setFormData({ id, value }));
//     };

//     // Handle the change for SubOption selection
//     const handleMakeSubOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedSubOption(event.target.value);
//         const { id, value } = event.target;
//         dispatch(setFormData({ id, value }));
//     };

//     // Handle the change for SubSubOption selection
//     const handleSubSubOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedSubSubOption(event.target.value);
//         const { id, value } = event.target;
//         dispatch(setFormData({ id, value }));
//     };

//     // Find the selected make from 'makes' data
//     const makeCategory = makes.find(option => option.category === selectedOpportunity);
//     const subdivisions = makeCategory?.subdivisions || [];
//     // console.log('subdivisions', subdivisions)
//     // Find the selected sub-make from subdivisions
//     const subMakeCategory = subdivisions.find(sub => sub.category === selectedMake);
//     const subMakeSubdivisions = subMakeCategory?.subdivisions || [];
//     // console.log('subMakeSubdivisions', subMakeSubdivisions)
//     // Find the selected sub-sub-make from subMakeSubdivisions
//     const subSubMakeCategory = subMakeSubdivisions.find(subSub => subSub.category === selectedSubOption);
//     const subSubMakeSubdivisions = subSubMakeCategory?.subdivisions || [];
//     // console.log('Opportunity Group:', opportunityGroup);

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

//                 {/* <div className={styles.box}>
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
//                 </div> */}

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
//                         <option>select Department</option>
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
//                         <option>select designation</option>
//                         {designations.map((designation, index) => (
//                             <option key={index} value={designation.abbreviation}>
//                                 {designation.title}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="exp_closure_date" className={styles.texthead}>
//                         Exp Cl Date
//                     </label>
//                     <input
//                         type="date"
//                         id="exp_closure_date"
//                         value={formData ? formData.exp_closure_date : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         placeholder="Enter Exp Cl Date"
//                         className={`${styles.additionalInput} ${formData?.exp_closure_date === '' ? styles.defaultselect : ''}`}
//                     />
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="exp_po_date" className={styles.texthead}>
//                         Exp PO Date
//                     </label>
//                     <input
//                         type="date"
//                         id="exp_po_date"
//                         value={formData ? formData.exp_po_date : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         placeholder="Enter  Exp PO Date"
//                         className={`${styles.additionalInput} ${formData?.exp_po_date === '' ? styles.defaultselect : ''}`}
//                     />
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
//                         Opportunity
//                     </label>
//                     <select
//                         value={selectedOpportunity}
//                         className={`${styles.additionalSelect} ${formData?.opportunity === '' ? styles.defaultselect : ''}`}
//                         onChange={handleOpportunityChange}
//                         id="opportunity"
//                     >
//                         <option value="">Select Opportunity</option>
//                         {makes.length > 0 ? (
//                             makes.map((option, index) => (
//                                 <option key={index} value={option.category}>
//                                     {option.category}
//                                 </option>
//                             ))
//                         ) : (
//                             <option value="" disabled>Not Available</option>
//                         )}
//                     </select>
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="make" className={styles.texthead}>
//                         Make
//                     </label>
//                     {selectedOpportunity && makeCategory?.subdivisions ? (
//                         <select
//                             value={selectedMake}
//                             className={`${styles.additionalSelect} ${formData?.make === '' ? styles.defaultselect : ''}`}
//                             onChange={handleMakeChange}
//                             id="make"
//                         >
//                             <option value="">Select Make</option>
//                             {makeCategory.subdivisions.length > 0 ? (
//                                 makeCategory.subdivisions.map((subOption, index) => (
//                                     <option key={index} value={subOption.category}>
//                                         {subOption.category}
//                                     </option>
//                                 ))
//                             ) : (
//                                 <option value="" disabled>Not Available</option>
//                             )}
//                         </select>
//                     ) : (
//                         <select disabled className={`${styles.additionalSelect} ${formData?.make === '' ? styles.defaultselect : ''}`}>
//                             <option value="">Not Available</option>
//                         </select>
//                     )}
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="sub_make" className={styles.texthead}>
//                         Sub Make
//                     </label>
//                     {selectedMake && subMakeCategory?.subdivisions ? (
//                         <select
//                             value={selectedSubOption}
//                             className={`${styles.additionalSelect} ${formData?.sub_make === '' ? styles.defaultselect : ''}`}
//                             onChange={handleMakeSubOptionChange}
//                             id="sub_make"
//                         >
//                             <option value="">Select a sub-make</option>
//                             {subMakeCategory.subdivisions.length > 0 ? (
//                                 subMakeCategory.subdivisions.map((subSubOption, index) => (
//                                     <option key={index} value={subSubOption.category}>
//                                         {subSubOption.category}
//                                     </option>
//                                 ))
//                             ) : (
//                                 <option value="" disabled >Not Available</option>
//                             )}
//                         </select>
//                     ) : (
//                         <select disabled className={`${styles.additionalSelect} ${formData?.sub_make === '' ? styles.defaultselect : ''}`}>
//                             <option value="">Not Available</option>
//                         </select>
//                     )}
//                 </div>
//                 <div className={styles.box}>
//                     <label htmlFor="sub_make_brand" className={styles.texthead}>
//                         Sub-Make Brand
//                     </label>
//                     {selectedSubOption && subSubMakeCategory?.subdivisions ? (
//                         <select
//                             value={selectedSubSubOption}
//                             className={`${styles.additionalSelect} ${formData?.sub_make_brand === '' ? styles.defaultselect : ''}`}
//                             onChange={handleSubSubOptionChange}
//                             id="sub_make_brand"
//                         >
//                             <option value="">Select Sub-make brand</option>
//                             {subSubMakeCategory.subdivisions.length > 0 ? (
//                                 subSubMakeCategory.subdivisions.map((subSubSubOption, index) => (
//                                     <option key={index} value={subSubSubOption.category}>
//                                         {subSubSubOption.category}
//                                     </option>
//                                 ))
//                             ) : (
//                                 <option value="" disabled>Not Available</option>
//                             )}
//                         </select>
//                     ) : (
//                         <select disabled className={`${styles.additionalSelect} ${formData?.sub_make_brand === '' ? styles.defaultselect : ''}`}>
//                             <option value="">Not Available</option>
//                         </select>
//                     )}
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
//                     <label htmlFor=" opportunity_description" className={styles.texthead}>
//                         Opportunity Description
//                     </label>
//                     <input
//                         type="text"
//                         id="opportunity_description"
//                         value={formData ? formData.opportunity_description : ''}  // Fallback to empty string if formData is null
//                         onChange={handleInputChange}
//                         placeholder="Enter Opportunity Description"
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
//             <div className={styles.otherDetails}>
//                 <div className={styles.smallDiv}>
//                     <div className={styles.heading}>Details Section</div>
//                     <hr className={styles.line} />
//                     <div className={styles.inputContainer}>
//                         <label htmlFor="qty" className={styles.texthead}>Quantity :</label>
//                         <input
//                             type="text"
//                             id="qty"
//                             value={formData ? formData.qty : ''}  // Fallback to empty string if formData is null
//                             onChange={handleInputChange}
//                             placeholder="Enter the quantity"
//                             className={styles.input}
//                         />
//                     </div>
//                     <div className={styles.inputContainer}>
//                         <label htmlFor="value" className={styles.texthead}>Value :</label>
//                         <input
//                             type="text"
//                             id="values"
//                             value={formData?.values ?? ''}
//                             onChange={handleInputChange}
//                             placeholder="Enter the value"
//                             className={styles.input}
//                         />
//                     </div>
//                     <div className={styles.inputContainer}>
//                         <label htmlFor="remarks" className={styles.texthead}>Remarks :</label>
//                         <input
//                             type="text"
//                             id="remarks"
//                             value={formData?.remarks ?? ''}
//                             onChange={handleInputChange}
//                             placeholder="Enter the remarks"
//                             className={styles.input}
//                         />
//                     </div>
//                 </div>
//                 <div className={styles.largeDiv}>
//                     <h3 className={styles.heading}>Additional Information</h3>
//                     <hr className={styles.line} />
//                     <div className={styles.innerContainer}>
//                         <div className={styles.row}>
//                             <label htmlFor="hardware_amount" className={styles.texthead}>Hardware :</label>
//                             <input
//                                 type="number"
//                                 id="hardware_amount"
//                                 value={formData?.hardware_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the amount"
//                                 className={styles.input}
//                             />
//                         </div>
//                         <div className={styles.row}>
//                             <label htmlFor="software_amount" className={styles.texthead}>Software :</label>
//                             <input
//                                 type="number"
//                                 id="software_amount"
//                                 value={formData?.software_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the amount"
//                                 className={styles.input}
//                             />
//                         </div>
//                         <div className={styles.row}>
//                             <label htmlFor="consumables_amount" className={styles.texthead}>Consumables :</label>
//                             <input
//                                 type="number"
//                                 id="consumables_amount"
//                                 value={formData?.consumables_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the amount"
//                                 className={styles.input}
//                             />
//                         </div>
//                     </div>
//                     <div className={styles.innerContainer}>
//                         <div className={styles.row}>
//                             <label htmlFor="automation_amount" className={styles.texthead}>Automation :</label>
//                             <input
//                                 type="number"
//                                 id="automation_amount"
//                                 value={formData?.automation_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the amount"
//                                 className={styles.input}
//                             />
//                         </div>
//                         <div className={styles.row}>
//                             <label htmlFor="solution_amount" className={styles.texthead}>Solution :</label>
//                             <input
//                                 type="number"
//                                 id="solution_amount"
//                                 value={formData?.solution_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the amount"
//                                 className={styles.input}
//                             />
//                         </div>
//                         <div className={styles.row}>
//                             <label htmlFor="maintenance_amount" className={styles.texthead}>Maintenance :</label>
//                             <input
//                                 type="number"
//                                 id="maintenance_amount"
//                                 value={formData?.maintenance_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the amount"
//                                 className={styles.input}
//                             />
//                         </div>
//                     </div>
//                     <div className={styles.innerContainer}>
//                         <div className={styles.row}>
//                             <label htmlFor="others_amount" className={styles.texthead}>Others :</label>
//                             <input
//                                 type="number"
//                                 id="others_amount"
//                                 value={formData?.others_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the amount"
//                                 className={styles.input}
//                             />
//                         </div>
//                         <div className={styles.row}>
//                             <label htmlFor="total_amount" className={styles.texthead}>Total :</label>
//                             <input
//                                 type="number"
//                                 id="total_amount"
//                                 value={formData?.total_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the total"
//                                 className={styles.input}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* <div className={styles.bottomDiv}>
//             <div className={styles.box}>
//                 <label htmlFor="address" className={styles.texthead}>
//                     Address
//                 </label>
//                 <textarea
//                     id="address"
//                     className={styles.textarea}
//                     value={formData ? formData.address : ''}  // Fallback to empty string if formData is null
//                     onChange={handleInputChange}
//                     placeholder="Enter Address"
//                 />


//             </div>
//         </div> */}
//         </div>
//     );
// };

// export default AccountDetails;

// import React, { useEffect, useState } from "react";
// import styles from "./accountDetails.module.css";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../app/store";
// import { setFormData } from "../../slice/EditOpportunityWorkspace";
// import type { ICity, IState } from "country-state-city";
// import { getAllCities, getAllStates } from "../../../CommonAPI/Common";
// import { calculateTotal } from "../../../CalculateTotalAmount/totalAmount";

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

// interface Department { name: string; }
// const departments: Department[] = [
//     { name: 'Purchase' }, { name: 'Procurement' }, { name: 'PPC Head' },
//     { name: 'IT Head' }, { name: 'Plant Head' }, { name: 'Quality' },
//     { name: 'Logistics' }, { name: 'Supply Chain' }, { name: 'Operations' },
//     { name: 'Information System' }, { name: 'Vendor Development' },
//     { name: 'Commertials' }, { name: 'Project Development' },
//     { name: 'Maintenance' }, { name: 'Support & Services' },
//     { name: 'Manufacturing Head' }, { name: 'Production Head' },
//     { name: 'Warehouse Manager' }, { name: 'Business Development' },
//     { name: 'Sales Manager' }, { name: 'Marketing' }, { name: 'Admin/HR' }
// ];

// interface Designation { title: string; abbreviation: string; }
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

// interface Option {
//     category: string;
//     subdivisions?: Option[];
// }

// const makes: Option[] = [
//     {
//         category: 'Printer',
//         subdivisions: [
//             { category: 'Zebra' }, { category: 'Sato' }, { category: 'Argox' },
//             { category: 'Godex' }, { category: 'Bixolon' }, { category: 'TSC' },
//             { category: 'Printronix' }, { category: 'Others' }
//         ]
//     },
//     {
//         category: 'Scanners',
//         subdivisions: [
//             { category: 'Zebra' }, { category: 'Honey Well' }, { category: 'Argox' }
//         ]
//     },
//     {
//         category: 'HHT',
//         subdivisions: [
//             { category: 'Zebra' }, { category: 'Seuic' }, { category: 'Cipherlab' }
//         ]
//     },
//     {
//         category: 'Consumables',
//         subdivisions: [
//             {
//                 category: 'Label', subdivisions: [
//                     {
//                         category: 'Paper', subdivisions: [
//                             { category: 'Normal Chrome' },
//                             { category: 'AD Chrome' }
//                         ]
//                     },
//                     { category: 'Polyster' }, { category: 'Tafatta' },
//                     { category: 'PET' }, { category: 'PP' }
//                 ]
//             },
//             {
//                 category: 'Ribbon', subdivisions: [
//                     {
//                         category: 'Wax', subdivisions: [
//                             { category: 'Economical' }, { category: 'Standard' }, { category: 'Premium' }
//                         ]
//                     },
//                     {
//                         category: 'Wax Resin', subdivisions: [
//                             { category: 'Economical' }, { category: 'Standard' }, { category: 'Premium' }
//                         ]
//                     },
//                     {
//                         category: 'Resin', subdivisions: [
//                             { category: 'Economical' }, { category: 'Standard' }, { category: 'Premium' }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         category: 'Software',
//         subdivisions: [
//             { category: 'WMS Solution' }, { category: 'WIP Solution' },
//             { category: 'Asset Management Solution' }, { category: 'Life Science Solutions' },
//             { category: 'Printing Software' }, { category: 'Scanning Software' },
//             { category: 'RFID Truck management solutions' }, { category: 'Customised software' }
//         ]
//     },
//     {
//         category: 'Automation',
//         subdivisions: [
//             { category: 'Line Automation' }, { category: 'Visual Inspection System' },
//             { category: 'Poka Yoke System' }, { category: 'Print and Apply System' },
//             { category: 'Conveyor Scanning' }, { category: 'Direct part Marking' },
//             { category: 'SPM' }, { category: 'Vision Guided Robots' }
//         ]
//     }
// ];

// const salesTypeOptions = ["Repeat", "Upselling", "Cross selling"];

// interface AccountDetailsProps {
//     errors: { [key: string]: string };
// }

// const AccountDetails: React.FC<AccountDetailsProps> = ({ errors }) => {
//     const dispatch = useDispatch();

//     const { formData } = useSelector(
//         (state: RootState) => state.postEditOpportunityWorkspaceForm
//     );

//     const [states, setStates] = useState<IState[]>([]);
//     const [city, setCity] = useState<ICity[]>([]);

//     // ── Local state for cascading dropdowns ──────────────────────────────────
//     const [selectedOpportunity, setSelectedOpportunity] = useState<string>('');
//     const [selectedMake, setSelectedMake] = useState<string>('');
//     const [selectedSubOption, setSelectedSubOption] = useState<string>('');
//     const [selectedSubSubOption, setSelectedSubSubOption] = useState<string>('');

//     // ── Sync cascading dropdowns FROM fetched formData ───────────────────────
//     useEffect(() => {
//         if (formData) {
//             if (formData.opportunity) setSelectedOpportunity(formData.opportunity);
//             if (formData.make) setSelectedMake(formData.make);
//             if (formData.sub_make) setSelectedSubOption(formData.sub_make);
//             if (formData.sub_make_brand) setSelectedSubSubOption(formData.sub_make_brand);
//         }
//     }, [
//         formData?.opportunity,
//         formData?.make,
//         formData?.sub_make,
//         formData?.sub_make_brand,
//     ]);

//     // ── States list ──────────────────────────────────────────────────────────
//     useEffect(() => {
//         setStates(getAllStates());
//     }, []);

//     // ── Cities list based on selected state ──────────────────────────────────
//     useEffect(() => {
//         if (formData?.state) {
//             setCity(getAllCities(formData.state));
//         }
//     }, [formData?.state]);

//     // ── Auto-calculate total amount ──────────────────────────────────────────
//     useEffect(() => {
//         const amountsToCalculate = {
//             hardware_amount: formData?.hardware_amount ?? 0,
//             software_amount: formData?.software_amount ?? 0,
//             consumables_amount: formData?.consumables_amount ?? 0,
//             automation_amount: formData?.automation_amount ?? 0,
//             solution_amount: formData?.solution_amount ?? 0,
//             maintenance_amount: formData?.maintenance_amount ?? 0,
//             others_amount: formData?.others_amount ?? 0,
//         };
//         const total = calculateTotal(amountsToCalculate);
//         if (formData?.total_amount !== total) {
//             dispatch(setFormData({ id: "total_amount", value: total }));
//         }
//     }, [
//         formData?.hardware_amount,
//         formData?.software_amount,
//         formData?.consumables_amount,
//         formData?.automation_amount,
//         formData?.solution_amount,
//         formData?.maintenance_amount,
//         formData?.others_amount,
//     ]);

//     // ── Generic input/select/textarea handler ────────────────────────────────
//     const handleInputChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//     ) => {
//         const { id, value } = e.target;
//         dispatch(setFormData({ id, value }));
//     };

//     // ── Cascading dropdown handlers ──────────────────────────────────────────
//     const handleOpportunityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const { id, value } = e.target;
//         setSelectedOpportunity(value);
//         // Reset downstream selections
//         setSelectedMake('');
//         setSelectedSubOption('');
//         setSelectedSubSubOption('');
//         dispatch(setFormData({ id, value }));
//         dispatch(setFormData({ id: 'make', value: '' }));
//         dispatch(setFormData({ id: 'sub_make', value: '' }));
//         dispatch(setFormData({ id: 'sub_make_brand', value: '' }));
//     };

//     const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const { id, value } = e.target;
//         setSelectedMake(value);
//         // Reset downstream selections
//         setSelectedSubOption('');
//         setSelectedSubSubOption('');
//         dispatch(setFormData({ id, value }));
//         dispatch(setFormData({ id: 'sub_make', value: '' }));
//         dispatch(setFormData({ id: 'sub_make_brand', value: '' }));
//     };

//     const handleMakeSubOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const { id, value } = e.target;
//         setSelectedSubOption(value);
//         // Reset downstream selection
//         setSelectedSubSubOption('');
//         dispatch(setFormData({ id, value }));
//         dispatch(setFormData({ id: 'sub_make_brand', value: '' }));
//     };

//     const handleSubSubOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const { id, value } = e.target;
//         setSelectedSubSubOption(value);
//         dispatch(setFormData({ id, value }));
//     };

//     // ── Derived cascade options ──────────────────────────────────────────────
//     const makeCategory = makes.find(o => o.category === selectedOpportunity);
//     const subdivisions = makeCategory?.subdivisions || [];

//     const subMakeCategory = subdivisions.find(s => s.category === selectedMake);
//     const subMakeSubdivisions = subMakeCategory?.subdivisions || [];

//     const subSubMakeCategory = subMakeSubdivisions.find(s => s.category === selectedSubOption);
//     const subSubMakeSubdivisions = subSubMakeCategory?.subdivisions || [];

//     return (
//         <div className={styles.accountDetails}>
//             <div className={styles.topDiv}>

//                 {/* Account Name */}
//                 <div className={styles.box}>
//                     <label htmlFor="account_name" className={styles.texthead}>
//                         Account Name <span className={styles.required}>*</span>
//                     </label>
//                     <input
//                         type="text"
//                         id="account_name"
//                         value={formData?.account_name ?? ''}
//                         onChange={handleInputChange}
//                         placeholder="Enter Account Name"
//                         className={styles.additionalInput}
//                     />
//                     {errors.account_name && (
//                         <div className={styles.errorMessage}>Account Name is required.</div>
//                     )}
//                 </div>

//                 {/* PIC */}
//                 <div className={styles.box}>
//                     <label htmlFor="pic" className={styles.texthead}>PIC</label>
//                     <input
//                         type="text"
//                         id="pic"
//                         value={formData?.pic ?? ''}
//                         onChange={handleInputChange}
//                         placeholder="Enter PIC"
//                         className={styles.additionalInput}
//                     />
//                 </div>
                
//                 {/* --- NEW FIELDS START HERE --- */}
//                 <div className={styles.box}>
//                     <label htmlFor="sales_type" className={styles.texthead}>
//                         Sales Type
//                     </label>
//                     <select
//                         id="sales_type"
//                         className={`${styles.additionalSelect} ${!formData?.sales_type ? styles.defaultselect : ''}`}
//                         value={formData?.sales_type ?? ''}
//                         onChange={handleInputChange}
//                     >
//                         <option value="">Select Sales Type</option>
//                         {salesTypeOptions.map((type, index) => (
//                             <option key={index} value={type}>
//                                 {type}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className={styles.box}>
//                     <label htmlFor="sales_type_value" className={styles.texthead}>
//                         Value
//                     </label>
//                     <input
//                         type="number"
//                         id="sales_type_value"
//                         value={formData?.sales_type_value ?? ''}
//                         onChange={handleInputChange}
//                         placeholder="Enter value"
//                         className={styles.additionalInput}
//                     />
//                 </div>
//                 {/* --- NEW FIELDS END HERE --- */}

//                 {/* Vertical */}
//                 <div className={styles.box}>
//                     <label htmlFor="vertical" className={styles.texthead}>Vertical</label>
//                     <select
//                         id="vertical"
//                         className={`${styles.additionalSelect} ${!formData?.vertical ? styles.defaultselect : ''}`}
//                         value={formData?.vertical ?? ''}
//                         onChange={handleInputChange}
//                     >
//                         <option value="">Select Vertical</option>
//                         {verticals.map((v, i) => (
//                             <option key={i} value={v.category}>{v.category}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Department */}
//                 <div className={styles.box}>
//                     <label htmlFor="department" className={styles.texthead}>Department</label>
//                     <select
//                         id="department"
//                         className={`${styles.additionalSelect} ${!formData?.department ? styles.defaultselect : ''}`}
//                         value={formData?.department ?? ''}
//                         onChange={handleInputChange}
//                     >
//                         <option value="">Select Department</option>
//                         {departments.map((d, i) => (
//                             <option key={i} value={d.name}>{d.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Designation */}
//                 <div className={styles.box}>
//                     <label htmlFor="designation" className={styles.texthead}>Designation</label>
//                     <select
//                         id="designation"
//                         className={`${styles.additionalSelect} ${!formData?.designation ? styles.defaultselect : ''}`}
//                         value={formData?.designation ?? ''}
//                         onChange={handleInputChange}
//                     >
//                         <option value="">Select Designation</option>
//                         {designations.map((d, i) => (
//                             <option key={i} value={d.abbreviation}>{d.title}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Exp Closure Date */}
//                 <div className={styles.box}>
//                     <label htmlFor="exp_closure_date" className={styles.texthead}>Exp Cl Date</label>
//                     <input
//                         type="date"
//                         id="exp_closure_date"
//                         value={formData?.exp_closure_date ?? ''}
//                         onChange={handleInputChange}
//                         className={`${styles.additionalInput} ${!formData?.exp_closure_date ? styles.defaultselect : ''}`}
//                     />
//                 </div>

//                 {/* Exp PO Date */}
//                 <div className={styles.box}>
//                     <label htmlFor="exp_po_date" className={styles.texthead}>Exp PO Date</label>
//                     <input
//                         type="date"
//                         id="exp_po_date"
//                         value={formData?.exp_po_date ?? ''}
//                         onChange={handleInputChange}
//                         className={`${styles.additionalInput} ${!formData?.exp_po_date ? styles.defaultselect : ''}`}
//                     />
//                 </div>

//                 {/* Mobile Number */}
//                 <div className={styles.box}>
//                     <label htmlFor="mobile_number" className={styles.texthead}>Mobile No.</label>
//                     <input
//                         type="text"
//                         id="mobile_number"
//                         value={formData?.mobile_number ?? ''}
//                         onChange={handleInputChange}
//                         placeholder="Enter Mobile Number"
//                         className={styles.additionalInput}
//                     />
//                 </div>

//                 {/* Opportunity (cascade level 1) */}
//                 <div className={styles.box}>
//                     <label htmlFor="opportunity" className={styles.texthead}>Opportunity</label>
//                     <select
//                         id="opportunity"
//                         className={`${styles.additionalSelect} ${!selectedOpportunity ? styles.defaultselect : ''}`}
//                         value={selectedOpportunity}
//                         onChange={handleOpportunityChange}
//                     >
//                         <option value="">Select Opportunity</option>
//                         {makes.map((o, i) => (
//                             <option key={i} value={o.category}>{o.category}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Make (cascade level 2) */}
//                 <div className={styles.box}>
//                     <label htmlFor="make" className={styles.texthead}>Make</label>
//                     {selectedOpportunity && makeCategory?.subdivisions ? (
//                         <select
//                             id="make"
//                             className={`${styles.additionalSelect} ${!selectedMake ? styles.defaultselect : ''}`}
//                             value={selectedMake}
//                             onChange={handleMakeChange}
//                         >
//                             <option value="">Select Make</option>
//                             {makeCategory.subdivisions.map((s, i) => (
//                                 <option key={i} value={s.category}>{s.category}</option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select disabled className={styles.additionalSelect}>
//                             <option value="">Not Available</option>
//                         </select>
//                     )}
//                 </div>

//                 {/* Sub Make (cascade level 3) */}
//                 <div className={styles.box}>
//                     <label htmlFor="sub_make" className={styles.texthead}>Sub Make</label>
//                     {selectedMake && subMakeCategory?.subdivisions ? (
//                         <select
//                             id="sub_make"
//                             className={`${styles.additionalSelect} ${!selectedSubOption ? styles.defaultselect : ''}`}
//                             value={selectedSubOption}
//                             onChange={handleMakeSubOptionChange}
//                         >
//                             <option value="">Select Sub Make</option>
//                             {subMakeCategory.subdivisions.map((s, i) => (
//                                 <option key={i} value={s.category}>{s.category}</option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select disabled className={styles.additionalSelect}>
//                             <option value="">Not Available</option>
//                         </select>
//                     )}
//                 </div>

//                 {/* Sub Make Brand (cascade level 4) */}
//                 <div className={styles.box}>
//                     <label htmlFor="sub_make_brand" className={styles.texthead}>Sub-Make Brand</label>
//                     {selectedSubOption && subSubMakeCategory?.subdivisions ? (
//                         <select
//                             id="sub_make_brand"
//                             className={`${styles.additionalSelect} ${!selectedSubSubOption ? styles.defaultselect : ''}`}
//                             value={selectedSubSubOption}
//                             onChange={handleSubSubOptionChange}
//                         >
//                             <option value="">Select Sub-Make Brand</option>
//                             {subSubMakeCategory.subdivisions.map((s, i) => (
//                                 <option key={i} value={s.category}>{s.category}</option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select disabled className={styles.additionalSelect}>
//                             <option value="">Not Available</option>
//                         </select>
//                     )}
//                 </div>

//                 {/* State */}
//                 <div className={styles.box}>
//                     <label htmlFor="state" className={styles.texthead}>State</label>
//                     <select
//                         id="state"
//                         className={`${styles.additionalSelect} ${!formData?.state ? styles.defaultselect : ''}`}
//                         value={formData?.state ?? ''}
//                         onChange={handleInputChange}
//                     >
//                         <option value="">Select State</option>
//                         {states.map((s) => (
//                             <option key={s.name} value={s.name}>{s.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* City */}
//                 <div className={styles.box}>
//                     <label htmlFor="city" className={styles.texthead}>City</label>
//                     <select
//                         id="city"
//                         className={`${styles.additionalSelect} ${!formData?.city ? styles.defaultselect : ''}`}
//                         value={formData?.city ?? ''}
//                         onChange={handleInputChange}
//                     >
//                         <option value="">Select City</option>
//                         {city.map((c) => (
//                             <option key={c.name} value={c.name}>{c.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Location */}
//                 <div className={styles.box}>
//                     <label htmlFor="location" className={styles.texthead}>Location</label>
//                     <input
//                         type="text"
//                         id="location"
//                         value={formData?.location ?? ''}
//                         onChange={handleInputChange}
//                         placeholder="Enter Location"
//                         className={styles.additionalInput}
//                     />
//                 </div>

//                 {/* Email */}
//                 <div className={styles.box}>
//                     <label htmlFor="email_id" className={styles.texthead}>Email</label>
//                     <input
//                         type="email"
//                         id="email_id"
//                         value={formData?.email_id ?? ''}
//                         onChange={handleInputChange}
//                         placeholder="Enter Email"
//                         className={styles.additionalInput}
//                     />
//                 </div>

//                 {/* Opportunity Description */}
//                 <div className={styles.box}>
//                     <label htmlFor="opportunity_description" className={styles.texthead}>
//                         Opportunity Description
//                     </label>
//                     <input
//                         type="text"
//                         id="opportunity_description"
//                         value={formData?.opportunity_description ?? ''}
//                         onChange={handleInputChange}
//                         placeholder="Enter Opportunity Description"
//                         className={styles.additionalInput}
//                     />
//                 </div>

//                 {/* Address */}
//                 <div className={styles.box}>
//                     <label htmlFor="address" className={styles.texthead}>Address</label>
//                     <textarea
//                         id="address"
//                         className={styles.textarea}
//                         value={formData?.address ?? ''}
//                         onChange={handleInputChange}
//                         placeholder="Enter Address"
//                     />
//                 </div>

//             </div>

//             {/* ── Details & Additional Information ── */}
//             <div className={styles.otherDetails}>
//                 <div className={styles.smallDiv}>
//                     <div className={styles.heading}>Details Section</div>
//                     <hr className={styles.line} />
//                     <div className={styles.inputContainer}>
//                         <label htmlFor="qty" className={styles.texthead}>Quantity :</label>
//                         <input
//                             type="text"
//                             id="qty"
//                             value={formData?.qty ?? ''}
//                             onChange={handleInputChange}
//                             placeholder="Enter the quantity"
//                             className={styles.input}
//                         />
//                     </div>
//                     <div className={styles.inputContainer}>
//                         <label htmlFor="values" className={styles.texthead}>Value :</label>
//                         <input
//                             type="text"
//                             id="values"
//                             value={formData?.values ?? ''}
//                             onChange={handleInputChange}
//                             placeholder="Enter the value"
//                             className={styles.input}
//                         />
//                     </div>
//                     <div className={styles.inputContainer}>
//                         <label htmlFor="remarks" className={styles.texthead}>Remarks :</label>
//                         <input
//                             type="text"
//                             id="remarks"
//                             value={formData?.remarks ?? ''}
//                             onChange={handleInputChange}
//                             placeholder="Enter the remarks"
//                             className={styles.input}
//                         />
//                     </div>
//                 </div>

//                 <div className={styles.largeDiv}>
//                     <h3 className={styles.heading}>Additional Information</h3>
//                     <hr className={styles.line} />
//                     <div className={styles.innerContainer}>
//                         <div className={styles.row}>
//                             <label htmlFor="hardware_amount" className={styles.texthead}>Hardware :</label>
//                             <input
//                                 type="number" id="hardware_amount"
//                                 value={formData?.hardware_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the amount" className={styles.input}
//                             />
//                         </div>
//                         <div className={styles.row}>
//                             <label htmlFor="software_amount" className={styles.texthead}>Software :</label>
//                             <input
//                                 type="number" id="software_amount"
//                                 value={formData?.software_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the amount" className={styles.input}
//                             />
//                         </div>
//                         <div className={styles.row}>
//                             <label htmlFor="consumables_amount" className={styles.texthead}>Consumables :</label>
//                             <input
//                                 type="number" id="consumables_amount"
//                                 value={formData?.consumables_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the amount" className={styles.input}
//                             />
//                         </div>
//                     </div>
//                     <div className={styles.innerContainer}>
//                         <div className={styles.row}>
//                             <label htmlFor="automation_amount" className={styles.texthead}>Automation :</label>
//                             <input
//                                 type="number" id="automation_amount"
//                                 value={formData?.automation_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the amount" className={styles.input}
//                             />
//                         </div>
//                         <div className={styles.row}>
//                             <label htmlFor="solution_amount" className={styles.texthead}>Solution :</label>
//                             <input
//                                 type="number" id="solution_amount"
//                                 value={formData?.solution_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the amount" className={styles.input}
//                             />
//                         </div>
//                         <div className={styles.row}>
//                             <label htmlFor="maintenance_amount" className={styles.texthead}>Maintenance :</label>
//                             <input
//                                 type="number" id="maintenance_amount"
//                                 value={formData?.maintenance_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the amount" className={styles.input}
//                             />
//                         </div>
//                     </div>
//                     <div className={styles.innerContainer}>
//                         <div className={styles.row}>
//                             <label htmlFor="others_amount" className={styles.texthead}>Others :</label>
//                             <input
//                                 type="number" id="others_amount"
//                                 value={formData?.others_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the amount" className={styles.input}
//                             />
//                         </div>
//                         <div className={styles.row}>
//                             <label htmlFor="total_amount" className={styles.texthead}>Total :</label>
//                             <input
//                                 type="number" id="total_amount"
//                                 value={formData?.total_amount ?? ''}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter the total" className={styles.input}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AccountDetails;






import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { setFormData } from "../../slice/EditOpportunityWorkspace";
import type { ICity, IState } from "country-state-city";
import { getAllCities, getAllStates } from "../../../CommonAPI/Common";
import { calculateTotal } from "../../../CalculateTotalAmount/totalAmount";
import { Target, ClipboardList, DollarSign } from "lucide-react";
import { fetchAccountFormSettings } from "../../../FormSettings/formSettingsSlice";
import { buildOpportunityHierarchy, buildOpportunityNames } from "../../../FormSettings/opportunityOptions";

// ─── Static Data ──────────────────────────────────────────────────────────────

interface Vertical { category: string; subdivisions?: Vertical[]; }
const verticals: Vertical[] = [
  { category: "Automobile", subdivisions: [{ category: "Automotive" }, { category: "Auto Component" }, { category: "Tier 1" }, { category: "Tier 2" }] },
  { category: "Health Care" }, { category: "E-Commerce" },
  { category: "E&E", subdivisions: [{ category: "Electronics" }, { category: "Electrical Components" }, { category: "Tier 1" }] },
  { category: "FMCG" }, { category: "Chemical Mfg" }, { category: "Other Mfg" },
  { category: "F&B", subdivisions: [{ category: "F&B Mfg" }, { category: "Food Mfg" }, { category: "Beverages Mfg" }, { category: "Cloud Kitchen" }] },
  { category: "Pharmaceutical", subdivisions: [{ category: "Pharma/Health Care" }, { category: "Hospitals" }, { category: "Tier 1/Supplier" }] },
  { category: "Retails", subdivisions: [{ category: "E-Commerce" }, { category: "Retails" }] },
  { category: "Transport & Logistics" }, { category: "Apparel" }, { category: "Government" }, { category: "Others" },
];

interface Department { name: string; }
const departments: Department[] = [
  { name: "Purchase" }, { name: "Procurement" }, { name: "PPC Head" }, { name: "IT Head" },
  { name: "Plant Head" }, { name: "Quality" }, { name: "Logistics" }, { name: "Supply Chain" },
  { name: "Operations" }, { name: "Information System" }, { name: "Vendor Development" },
  { name: "Commertials" }, { name: "Project Development" }, { name: "Maintenance" },
  { name: "Support & Services" }, { name: "Manufacturing Head" }, { name: "Production Head" },
  { name: "Warehouse Manager" }, { name: "Business Development" }, { name: "Sales Manager" },
  { name: "Marketing" }, { name: "Admin/HR" },
];

interface Designation { title: string; abbreviation: string; }
const designations: Designation[] = [
  { title: "Assistant Manager", abbreviation: "AM" }, { title: "Senior Manager", abbreviation: "Sr.M" },
  { title: "Assistant General Manager", abbreviation: "AGM" }, { title: "General Manager", abbreviation: "GM" },
  { title: "Deputy Manager", abbreviation: "DM" }, { title: "Deputy General Manager", abbreviation: "Dy.GM" },
  { title: "Vice President", abbreviation: "VP" }, { title: "Director", abbreviation: "Director" },
  { title: "Director/Owner", abbreviation: "Director/Owner" }, { title: "Owner", abbreviation: "Owner" },
  { title: "Senior Engineer", abbreviation: "Sr.Engineer" }, { title: "Executive", abbreviation: "EX" },
  { title: "Senior Executive", abbreviation: "Sr.EX" },
];

interface Option { category: string; subdivisions?: Option[]; }
const makes: Option[] = [
  { category: "Printer", subdivisions: [{ category: "Zebra" }, { category: "Sato" }, { category: "Argox" }, { category: "Godex" }, { category: "Bixolon" }, { category: "TSC" }, { category: "Printronix" }, { category: "Others" }] },
  { category: "Scanners", subdivisions: [{ category: "Zebra" }, { category: "Honey Well" }, { category: "Argox" }] },
  { category: "HHT", subdivisions: [{ category: "Zebra" }, { category: "Seuic" }, { category: "Cipherlab" }] },
  { category: "Consumables", subdivisions: [
    { category: "Label", subdivisions: [{ category: "Paper", subdivisions: [{ category: "Normal Chrome" }, { category: "AD Chrome" }] }, { category: "Polyster" }, { category: "Tafatta" }, { category: "PET" }, { category: "PP" }] },
    { category: "Ribbon", subdivisions: [
      { category: "Wax", subdivisions: [{ category: "Economical" }, { category: "Standard" }, { category: "Premium" }] },
      { category: "Wax Resin", subdivisions: [{ category: "Economical" }, { category: "Standard" }, { category: "Premium" }] },
      { category: "Resin", subdivisions: [{ category: "Economical" }, { category: "Standard" }, { category: "Premium" }] },
    ]},
  ]},
  { category: "Software", subdivisions: [{ category: "WMS Solution" }, { category: "WIP Solution" }, { category: "Asset Management Solution" }, { category: "Life Science Solutions" }, { category: "Printing Software" }, { category: "Scanning Software" }, { category: "RFID Truck management solutions" }, { category: "Customised software" }] },
  { category: "Automation", subdivisions: [{ category: "Line Automation" }, { category: "Visual Inspection System" }, { category: "Poka Yoke System" }, { category: "Print and Apply System" }, { category: "Conveyor Scanning" }, { category: "Direct part Marking" }, { category: "SPM" }, { category: "Vision Guided Robots" }] },
];

const salesTypeOptions = ["Repeat", "Upselling", "Cross selling"];

interface AccountDetailsProps { errors: { [key: string]: string }; }

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputClass = "w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200";

const selectClass = (value: string | number | null | undefined) =>
  `w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200 [&>option]:text-slate-800 [&>option]:font-medium ${!value ? "text-slate-400 font-normal" : "text-slate-800"}`;

const disabledSelectClass = "w-full px-3 py-2 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm text-slate-400 font-normal cursor-not-allowed";

// ─── Component ────────────────────────────────────────────────────────────────

const AccountDetails: React.FC<AccountDetailsProps> = ({ errors }) => {
  const dispatch = useDispatch();
  const accountFormSettings = useSelector((state: RootState) => state.formSettings.account);

  const { formData } = useSelector(
    (state: RootState) => state.postEditOpportunityWorkspaceForm
  );
  useEffect(() => { dispatch(fetchAccountFormSettings() as any); }, [dispatch]);

  const [states, setStates] = useState<IState[]>([]);
  const [city, setCity] = useState<ICity[]>([]);

  // ── Local state for cascading dropdowns ──────────────────────────────────
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>('');
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedSubOption, setSelectedSubOption] = useState<string>('');
  const [selectedSubSubOption, setSelectedSubSubOption] = useState<string>('');

  // ── Sync cascading dropdowns FROM fetched formData ───────────────────────
  useEffect(() => {
    if (formData) {
      if (formData.opportunity) setSelectedOpportunity(formData.opportunity);
      if (formData.make) setSelectedMake(formData.make);
      if (formData.sub_make) setSelectedSubOption(formData.sub_make);
      if (formData.sub_make_brand) setSelectedSubSubOption(formData.sub_make_brand);
    }
  }, [formData?.opportunity, formData?.make, formData?.sub_make, formData?.sub_make_brand]);

  // ── States list ──────────────────────────────────────────────────────────
  useEffect(() => { setStates(getAllStates()); }, []);

  // ── Cities list based on selected state ──────────────────────────────────
  useEffect(() => {
    if (formData?.state) { setCity(getAllCities(formData.state)); }
  }, [formData?.state]);

  // ── Auto-calculate total amount ──────────────────────────────────────────
  useEffect(() => {
    const amountsToCalculate = {
      hardware_amount:    formData?.hardware_amount    ?? 0,
      software_amount:    formData?.software_amount    ?? 0,
      consumables_amount: formData?.consumables_amount ?? 0,
      automation_amount:  formData?.automation_amount  ?? 0,
      solution_amount:    formData?.solution_amount    ?? 0,
      implementation_amount: formData?.implementation_amount ?? 0,
      others_amount:      formData?.others_amount      ?? 0,
    };
    const total = calculateTotal(amountsToCalculate);
    if (formData?.total_amount !== total) {
      dispatch(setFormData({ id: "total_amount", value: total }));
    }
  }, [formData?.hardware_amount, formData?.software_amount, formData?.consumables_amount, formData?.automation_amount, formData?.solution_amount, formData?.implementation_amount, formData?.others_amount]);

  // ── Generic input/select/textarea handler ────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    dispatch(setFormData({ id, value }));
  };

  // ── Cascading dropdown handlers ──────────────────────────────────────────
  const handleOpportunityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setSelectedOpportunity(value);
    // Reset downstream selections
    setSelectedMake('');
    setSelectedSubOption('');
    setSelectedSubSubOption('');
    dispatch(setFormData({ id, value }));
    dispatch(setFormData({ id: 'make', value: '' }));
    dispatch(setFormData({ id: 'sub_make', value: '' }));
    dispatch(setFormData({ id: 'sub_make_brand', value: '' }));
  };

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setSelectedMake(value);
    // Reset downstream selections
    setSelectedSubOption('');
    setSelectedSubSubOption('');
    dispatch(setFormData({ id, value }));
    dispatch(setFormData({ id: 'sub_make', value: '' }));
    dispatch(setFormData({ id: 'sub_make_brand', value: '' }));
  };

  const handleMakeSubOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setSelectedSubOption(value);
    // Reset downstream selection
    setSelectedSubSubOption('');
    dispatch(setFormData({ id, value }));
    dispatch(setFormData({ id: 'sub_make_brand', value: '' }));
  };

  const handleSubSubOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setSelectedSubSubOption(value);
    dispatch(setFormData({ id, value }));
  };

  // ── Derived cascade options ──────────────────────────────────────────────
  const baseHierarchyOptions = accountFormSettings.productCategories?.length
    ? accountFormSettings.productCategories
    : (accountFormSettings.leadHierarchy?.length ? accountFormSettings.leadHierarchy : makes);
  const leadHierarchyOptions = buildOpportunityHierarchy(baseHierarchyOptions, [
    selectedOpportunity,
    selectedMake,
    selectedSubOption,
    selectedSubSubOption,
  ]) as Option[];
  const opportunityOptions = buildOpportunityNames(
    accountFormSettings.opportunities || [],
    leadHierarchyOptions,
    selectedOpportunity
  );
  const salesTypeOptions = accountFormSettings.salesTypes?.length
    ? accountFormSettings.salesTypes
    : ["Repeat", "Upselling", "Cross selling"];
  const verticalOptions = accountFormSettings.verticals?.length ? accountFormSettings.verticals : verticals;
  const departmentOptions = accountFormSettings.departments?.length
    ? accountFormSettings.departments.map((name) => ({ name }))
    : departments;
  const designationOptions = accountFormSettings.designations?.length ? accountFormSettings.designations : designations;
  const makeCategory = leadHierarchyOptions.find(o => o.category === selectedOpportunity);
  const subdivisions = makeCategory?.subdivisions || [];
  const subMakeCategory = subdivisions.find(s => s.category === selectedMake);
  const subMakeSubdivisions = subMakeCategory?.subdivisions || [];
  const subSubMakeCategory = subMakeSubdivisions.find(s => s.category === selectedSubOption);
  const subSubMakeSubdivisions = subSubMakeCategory?.subdivisions || [];
  const hasCategory1Options = subdivisions.length > 0;
  const hasCategory2Options = subMakeSubdivisions.length > 0;
  const hasCategory3Options = subSubMakeSubdivisions.length > 0;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Card 1: Opportunity Details ───────────────────────────────────── */}
      <div className="rounded-2xl border-2 border-indigo-100 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-3 flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <Target size={15} color="white" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">Opportunity Details</h2>
        </div>
        <div className="bg-white px-5 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-4">

            {/* Account Name — plain text input in EDIT (not a dropdown) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="account_name" className="text-sm font-semibold text-slate-700">
                Account Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="account_name"
                value={formData?.account_name ?? ''}
                onChange={handleInputChange}
                placeholder="Enter Account Name"
                className={inputClass}
              />
              {errors.account_name && <span className="text-red-500 text-xs mt-0.5">Account Name is required.</span>}
            </div>

            {/* PIC */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pic" className="text-sm font-semibold text-slate-700">PIC</label>
              <input type="text" id="pic" value={formData?.pic ?? ''} onChange={handleInputChange} placeholder="Enter PIC" className={inputClass} />
            </div>

            {/* Sales Type */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sales_type" className="text-sm font-semibold text-slate-700">Sales Type</label>
              <select id="sales_type" className={selectClass(formData?.sales_type)} value={formData?.sales_type ?? ''} onChange={handleInputChange}>
                <option value="">Select Sales Type</option>
                {salesTypeOptions.map((type, index) => <option key={index} value={type}>{type}</option>)}
              </select>
            </div>

            {/* Value */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sales_type_value" className="text-sm font-semibold text-slate-700">Value</label>
              <input type="number" id="sales_type_value" value={formData?.sales_type_value ?? ''} onChange={handleInputChange} placeholder="Enter value" className={inputClass} />
            </div>

            {/* Vertical */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="vertical" className="text-sm font-semibold text-slate-700">Vertical</label>
              <select id="vertical" className={selectClass(formData?.vertical)} value={formData?.vertical ?? ''} onChange={handleInputChange}>
                <option value="">Select Vertical</option>
                {verticalOptions.map((v, i) => <option key={i} value={v.category}>{v.category}</option>)}
              </select>
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="department" className="text-sm font-semibold text-slate-700">Department</label>
              <select id="department" className={selectClass(formData?.department)} value={formData?.department ?? ''} onChange={handleInputChange}>
                <option value="">Select Department</option>
                {departmentOptions.map((d, i) => <option key={i} value={d.name}>{d.name}</option>)}
              </select>
            </div>

            {/* Designation */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="designation" className="text-sm font-semibold text-slate-700">Designation</label>
              <select id="designation" className={selectClass(formData?.designation)} value={formData?.designation ?? ''} onChange={handleInputChange}>
                <option value="">Select Designation</option>
                {designationOptions.map((d, i) => <option key={i} value={d.abbreviation}>{d.title}</option>)}
              </select>
            </div>

            {/* Exp Closure Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exp_closure_date" className="text-sm font-semibold text-slate-700">Exp Cl Date</label>
              <input type="date" id="exp_closure_date" value={formData?.exp_closure_date ?? ''} onChange={handleInputChange} className={inputClass} />
            </div>

            {/* Exp PO Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exp_po_date" className="text-sm font-semibold text-slate-700">
                Exp PO Date <span className="text-red-500">*</span>
              </label>
              <input type="date" id="exp_po_date" value={formData?.exp_po_date ?? ''} onChange={handleInputChange} className={inputClass} required />
              {errors.exp_po_date && <span className="text-red-500 text-xs mt-0.5">Exp PO Date is required.</span>}
            </div>

            {/* Mobile No */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="mobile_number" className="text-sm font-semibold text-slate-700">Mobile No.</label>
              <input type="text" id="mobile_number" value={formData?.mobile_number ?? ''} onChange={handleInputChange} placeholder="Enter Mobile Number" className={inputClass} />
            </div>

            {/* Opportunity (cascade level 1) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="opportunity" className="text-sm font-semibold text-slate-700">Opportunity</label>
              <select id="opportunity" className={selectClass(selectedOpportunity)} value={selectedOpportunity} onChange={handleOpportunityChange}>
                <option value="">Select Opportunity</option>
                {opportunityOptions.map((name, i) => <option key={i} value={name}>{name}</option>)}
              </select>
            </div>

            {/* Make (cascade level 2) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="make" className="text-sm font-semibold text-slate-700">Make</label>
              {selectedOpportunity && hasCategory1Options ? (
                <select id="make" className={selectClass(selectedMake)} value={selectedMake} onChange={handleMakeChange}>
                  <option value="">Select Make</option>
                  {subdivisions.map((s, i) => <option key={i} value={s.category}>{s.category}</option>)}
                </select>
              ) : <select disabled className={disabledSelectClass}><option value="">{selectedOpportunity ? "No Category 1 mapped" : "Select Opportunity first"}</option></select>}
            </div>

            {/* Sub Make (cascade level 3) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sub_make" className="text-sm font-semibold text-slate-700">Sub Make</label>
              {selectedMake && hasCategory2Options ? (
                <select id="sub_make" className={selectClass(selectedSubOption)} value={selectedSubOption} onChange={handleMakeSubOptionChange}>
                  <option value="">Select Sub Make</option>
                  {subMakeSubdivisions.map((s, i) => <option key={i} value={s.category}>{s.category}</option>)}
                </select>
              ) : <select disabled className={disabledSelectClass}><option value="">{selectedMake ? "No Category 2 mapped" : "Select Category 1 first"}</option></select>}
            </div>

            {/* Sub Make Brand (cascade level 4) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sub_make_brand" className="text-sm font-semibold text-slate-700">Sub-Make Brand</label>
              {selectedSubOption && hasCategory3Options ? (
                <select id="sub_make_brand" className={selectClass(selectedSubSubOption)} value={selectedSubSubOption} onChange={handleSubSubOptionChange}>
                  <option value="">Select Sub-Make Brand</option>
                  {subSubMakeSubdivisions.map((s, i) => <option key={i} value={s.category}>{s.category}</option>)}
                </select>
              ) : <select disabled className={disabledSelectClass}><option value="">{selectedSubOption ? "No Category 3 mapped" : "Select Category 2 first"}</option></select>}
            </div>

            {/* State */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="state" className="text-sm font-semibold text-slate-700">State</label>
              <select id="state" className={selectClass(formData?.state)} value={formData?.state ?? ''} onChange={handleInputChange}>
                <option value="">Select State</option>
                {states.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="city" className="text-sm font-semibold text-slate-700">City</label>
              <select id="city" className={selectClass(formData?.city)} value={formData?.city ?? ''} onChange={handleInputChange}>
                <option value="">Select City</option>
                {city.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="location" className="text-sm font-semibold text-slate-700">Location</label>
              <input type="text" id="location" value={formData?.location ?? ''} onChange={handleInputChange} placeholder="Enter Location" className={inputClass} />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email_id" className="text-sm font-semibold text-slate-700">Email</label>
              <input type="email" id="email_id" value={formData?.email_id ?? ''} onChange={handleInputChange} placeholder="Enter Email" className={inputClass} />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="address" className="text-sm font-semibold text-slate-700">Address</label>
              <textarea id="address" className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200 resize-none h-[72px]" value={formData?.address ?? ''} onChange={handleInputChange} placeholder="Enter Address" />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="description" className="text-sm font-semibold text-slate-700">Description</label>
              <textarea
                id="description"
                className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all duration-200 resize-none h-[72px]"
                value={formData?.description ?? ''}
                onChange={handleInputChange}
                placeholder="Enter Description"
              />
            </div>

          </div>
        </div>
      </div>

      {/* ── Row: Details Section + Additional Information ──────────────────── */}
      <div className="flex flex-col md:flex-row gap-5">

        {/* Details Section */}
        <div className="rounded-2xl border-2 border-violet-100 shadow-lg overflow-hidden md:w-[32%] shrink-0">
          <div className="bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-3 flex items-center gap-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <ClipboardList size={15} color="white" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide">Details Section</h2>
          </div>
          <div className="bg-white px-5 py-4 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="qty" className="text-sm font-semibold text-slate-700 whitespace-nowrap min-w-[80px]">Quantity</label>
              <input type="text" id="qty" value={formData?.qty ?? ''} onChange={handleInputChange} placeholder="Enter the quantity" className={inputClass} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="values" className="text-sm font-semibold text-slate-700 whitespace-nowrap min-w-[80px]">Value</label>
              <input type="text" id="values" value={formData?.values ?? ''} onChange={handleInputChange} placeholder="Enter the value" className={inputClass} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="remarks" className="text-sm font-semibold text-slate-700 whitespace-nowrap min-w-[80px]">Remarks</label>
              <input type="text" id="remarks" value={formData?.remarks ?? ''} onChange={handleInputChange} placeholder="Enter the remarks" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="rounded-2xl border-2 border-emerald-100 shadow-lg overflow-hidden flex-1">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-3 flex items-center gap-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign size={15} color="white" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide">Additional Information</h2>
          </div>
          <div className="bg-white px-5 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
              {[
                { id: 'hardware_amount',    label: 'Hardware' },
                { id: 'software_amount',    label: 'Software' },
                { id: 'consumables_amount', label: 'Consumables' },
                { id: 'automation_amount',  label: 'Automation' },
                { id: 'implementation_amount', label: 'Implementation' },
                { id: 'solution_amount',    label: 'Solution' },
                { id: 'others_amount',      label: 'Others' },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center gap-3">
                  <label htmlFor={id} className="text-sm font-semibold text-slate-700 whitespace-nowrap w-28 shrink-0">{label}</label>
                  <input type="number" id={id} value={(formData as any)?.[id] ?? ''} onChange={handleInputChange} placeholder="Enter the amount" className={inputClass} />
                </div>
              ))}
              {/* Total */}
              <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-2">
                <label htmlFor="total_amount" className="text-sm font-bold text-emerald-700 whitespace-nowrap w-28 shrink-0">Total</label>
                <input
                  type="number"
                  id="total_amount"
                  value={formData?.total_amount ?? ''}
                  onChange={handleInputChange}
                  placeholder="Enter the total"
                  className="w-full px-3 py-2 rounded-xl border-2 border-emerald-300 bg-emerald-50 text-sm text-emerald-800 font-bold placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AccountDetails;




