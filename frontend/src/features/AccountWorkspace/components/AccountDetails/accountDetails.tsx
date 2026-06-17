// import React, { useEffect, useRef, useState } from "react";
// import styles from "./accountDetails.module.css";

// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../app/store";
// import { setFormData } from "../../Slice/AccountWorkspaceSlice";
// import { useLocation } from "react-router-dom";
// import type { ICity, State } from 'country-state-city';
// import type { IState } from 'country-state-city'; import { getAllCities, getAllStates } from "../../../CommonAPI/Common";
// import { fetchRequestedAccountData } from "../../../CommonAPI/FetchRequestedAccountData/FetchRequestedAccountDataSlice";
// import { fetchAccountNamesData } from "../../../CommonAPI/FetchAccountNames/FetchAccountNamesSlice";
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
//     {category: 'Logistics'},
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

// interface AccountDetailsValues {
//     account_holder: string;
//     account_name: string;
//     department: string;
//     vertical: string;
//     vertical_sub: string | null;
//     pic: string;
//     designation: string;
//     business: string;
//     region: string;
//     mobile_number: string;
//     email_id: string;
//     location: string;
//     state: string;
//     city: string;
//     address: string;
//     acct_created_date: string | null;
//     last_update: string | null;
// }

// type AccountType = {
//     id: number;
//     account_name: string;
// };




// interface AccountDetailsProps {

//     errors: { [key: string]: string };
// }

// interface LocationState {
//     focusField?: string;
// }

// interface AccountDataType {
//     vertical?: string;
//     mobile_number?: string;
//     address?: string;
//     email_id?: string;
//     department?: string;
//     designation?: string;
//     pic?: string;
//     state?: string;
//     city?: string;
//     location?: string;
// }


// const AccountDetails: React.FC<AccountDetailsProps> = ({ errors }) => {
//     const dispatch = useDispatch();
//     const location = useLocation() as { state: LocationState };
//     const [showDetails, setShowDetails] = useState(true);

//     const { loading, data, error, formData } = useSelector(
//         (state: RootState) => state.postAccountWorkspaceForm
//     );


//     useEffect(() => {
//         dispatch(fetchAccountNamesData() as any)

//     }, []);



//     // useEffect(() => {
//     //     if (formData?.account_name) {
//     //         const accountName = formData.account_name;
//     //         console.log('accountName', accountName);

//     //         // Reset fields to empty before fetching new data
//     //         const fieldsToReset = [
//     //             "vertical", "mobile_number", "address", "email_id",
//     //             "department", "designation", "pic", "state", "city", "location"
//     //         ];

//     //         fieldsToReset.forEach(field => {
//     //             dispatch(setFormData({ id: field, value: '' }));
//     //         });

//     //         // Fetch new account data
//     //         // dispatch(fetchRequestedAccountData({ accountName }) as any);
//     //     }
//     // }, [formData?.account_name, dispatch]);


//     const { AllAccountNames } = useSelector(
//         (state: RootState) => state.fetchAllAccountNamesDetails
//     );
//     // console.log(AllAccountNames)
//     const [searchQuery, setSearchQuery] = useState("");




//     // console.log('AllAccountNames', AllAccountNames)
//     const { AccountData } = useSelector(
//         (state: RootState) => state.fetchRequestedAccountDetails
//     );
//     // console.log('AccountData', AccountData)

//     // useEffect(() => {
//     //     if (AccountData) {
//     //         const fields: (keyof AccountDataType)[] = [
//     //             "vertical", "mobile_number", "address", "email_id",
//     //             "department", "designation", "pic", "state", "city", "location"
//     //         ];

//     //         fields.forEach((field) => {
//     //             if (AccountData[field]) {
//     //                 dispatch(setFormData({ id: field, value: AccountData[field] }));
//     //             }
//     //         });

//     //         console.log("Updating formData with:", fields.reduce((acc, field) => {
//     //             if (AccountData[field]) acc[field] = AccountData[field];
//     //             return acc;
//     //         }, {} as Partial<AccountDataType>));
//     //     }
//     // }, [AccountData, dispatch]);



//     const [states, setStates] = useState<IState[]>([]);
//     const [city, setcity] = useState<ICity[]>([]);
//     useEffect(() => {

//         setStates(getAllStates());
//     }, []);
//     useEffect(() => {
//         if (formData?.state) {
//             setcity(getAllCities(formData?.state))
//         }
//     }, [formData?.state]);





//     // console.log('AllAccountNames', AllAccountNames)


//     const accountNameRef = useRef<HTMLInputElement>(null);

//     useEffect(() => {
//         if (location.state?.focusField === "account_name" && accountNameRef.current) {
//             accountNameRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
//             accountNameRef.current.focus();
//         }
//     }, [location]);


//     // const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);

//     // useEffect(() => {
//     //     console.log('formData?.account_name',formData?.account_name)
//     //     if (!formData?.account_name) {
//     //         setFilteredAccounts([]);  
//     //         return;
//     //     }
//     //     const filtered = AccountData.filter((account: { account_name: string }) =>
//     //         account.account_name.toLowerCase().includes(formData.account_name.toLowerCase())
//     //     );

//     //     console.log("Filtered Accounts:", filtered)

//     //     setFilteredAccounts(filtered);
//     // // }, [formData?.account_name, AccountData]);

//     // const searchTerm = formData?.account_name?.toLowerCase() || "";

//     // if (searchTerm !== '') {
//     //     const filtered = AccountData.filter((account: { account_name: string, id: number }) => {
//     //         console.log("Checking account:", account.account_name);
//     //         return account.account_name.toLowerCase().includes(searchTerm);
//     //     });

//     //     console.log("Filtered Accounts:", filtered);
//     //     setFilteredAccounts(filtered);
//     // }

//     // useEffect(() => {
//     //     console.log("formData?.account_name:", formData?.account_name);
//     //     if (!formData?.account_name || !AccountData?.length) {
//     //         setFilteredAccounts([]);
//     //         return;
//     //     }


//     //     const searchTerm = formData.account_name.toLowerCase();

//     //     const filtered = AccountData.filter((account: { account_name: string; id: number }) =>
//     //         account.account_name.toLowerCase().includes(searchTerm)
//     //     );

//     //     console.log("Filtered Accounts:", filtered);
//     //     setFilteredAccounts(filtered);
//     // }, [formData?.account_name, AccountData]);



//     const [filteredAccounts, setFilteredAccounts] = useState<AccountType[]>([]);
//     const accountBoxRef = useRef<HTMLDivElement>(null);

//     const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { value } = e.target;

//         const searchTerm = value.trim().toLowerCase();
//         console.log("searchTerm :", searchTerm);
//         if (searchTerm) {
//             const filtered = AllAccountNames.filter((account: AccountType) =>
//                 account.account_name.toLowerCase().includes(searchTerm)
//             );

//             console.log("Filtered :", filtered);
//             setFilteredAccounts(filtered);
//             // console.log("Filtered Accounts:", filteredAccounts);
//         } else {
//             setFilteredAccounts([]);
//         }

//         dispatch(setFormData({ id: "account_name", value })); // Ensure `id` is correctly passed
//     };
//     // console.log("AccountData Type:", typeof AllAccountNames);

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (accountBoxRef.current && !accountBoxRef.current.contains(event.target as Node)) {
//                 setFilteredAccounts([]); // Close dropdown if clicked outside
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);
//     const handleAccountSelect = (accountName: string) => {
//         dispatch(setFormData({ id: "account_name", value: accountName }));
//         setFilteredAccounts([]); // Close the dropdown
//     };
//     // console.log('filteredAccounts',filteredAccounts)
//     console.log('formData',formData)
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { id, value } = e.target;
//         dispatch(setFormData({ id, value }));


//     };



//     // console.log('validation error account', errors)
//     return (

//         <div className={styles.accountDetails}>
//             <div className={styles.topDiv}>
//                 <div className={styles.box} ref={accountBoxRef}>
//                     <label htmlFor="account_name" className={styles.texthead}>
//                         Account Name<span className={styles.required}>*</span>
//                     </label>
//                     <input
//                         type="text"
//                         id="account_name"
//                         value={formData ? formData.account_name : ''}  // Fallback to empty string if formData is null
//                         onChange={handleAccountChange}
//                         placeholder="Enter  Account Holder"
//                         className={styles.additionalInput}
//                         autoComplete="off"
//                         autoCorrect="off"
//                     />
//                     {filteredAccounts.length > 0 && (
//                         <div className={styles.accountdata}>
//                             {filteredAccounts.map((account) => (
//                                 <div
//                                     key={account.id}
//                                     onClick={() => handleAccountSelect(account.account_name)}
//                                     className={styles.accountItem} // Add styling for dropdown items
//                                 >
//                                     {account.account_name}
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                     {errors.account_name && (
//                         <div className={styles.errorMessage}>Account Holder is required.</div> // Error message div
//                     )}
//                 </div>
//                 {/* <div className={styles.box}>
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
//                 </div> */}
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



// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../../../app/store";
// import { setFormData } from "../../Slice/AccountWorkspaceSlice";
// import { useLocation } from "react-router-dom";
// import type { ICity, IState } from 'country-state-city';
// import { getAllCities, getAllStates } from "../../../CommonAPI/Common";
// import { fetchRequestedAccountData } from "../../../CommonAPI/FetchRequestedAccountData/FetchRequestedAccountDataSlice";
// import { fetchAccountNamesData } from "../../../CommonAPI/FetchAccountNames/FetchAccountNamesSlice";

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
//     { category: 'Logistics' },
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

// interface AccountDetailsValues {
//     account_holder: string;
//     account_name: string;
//     department: string;
//     vertical: string;
//     vertical_sub: string | null;
//     pic: string;
//     designation: string;
//     business: string;
//     region: string;
//     mobile_number: string;
//     email_id: string;
//     location: string;
//     state: string;
//     city: string;
//     address: string;
//     acct_created_date: string | null;
//     last_update: string | null;
// }

// type AccountType = {
//     id: number;
//     account_name: string;
// };

// interface AccountDetailsProps {
//     errors: { [key: string]: string };
// }

// interface LocationState {
//     focusField?: string;
// }

// interface AccountDataType {
//     vertical?: string;
//     mobile_number?: string;
//     address?: string;
//     email_id?: string;
//     department?: string;
//     designation?: string;
//     pic?: string;
//     state?: string;
//     city?: string;
//     location?: string;
// }

// const inputClass = "w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent  transition-all duration-200";

// const selectClass = (value: string | null | undefined) =>
//     `w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent  transition-all duration-200 ${!value ? 'text-slate-400 font-normal' : 'text-slate-800'}`;

// const AccountDetails: React.FC<AccountDetailsProps> = ({ errors }) => {
//     const dispatch = useDispatch();
//     const location = useLocation() as { state: LocationState };
//     const [showDetails, setShowDetails] = useState(true);

//     const { loading, data, error, formData } = useSelector(
//         (state: RootState) => state.postAccountWorkspaceForm
//     );

//     useEffect(() => {
//         dispatch(fetchAccountNamesData() as any);
//     }, []);

//     const { AllAccountNames } = useSelector(
//         (state: RootState) => state.fetchAllAccountNamesDetails
//     );

//     const [searchQuery, setSearchQuery] = useState("");

//     const { AccountData } = useSelector(
//         (state: RootState) => state.fetchRequestedAccountDetails
//     );

//     const [states, setStates] = useState<IState[]>([]);
//     const [city, setcity] = useState<ICity[]>([]);

//     useEffect(() => {
//         setStates(getAllStates());
//     }, []);

//     useEffect(() => {
//         if (formData?.state) {
//             setcity(getAllCities(formData?.state));
//         }
//     }, [formData?.state]);

//     const accountNameRef = useRef<HTMLInputElement>(null);

//     useEffect(() => {
//         if (location.state?.focusField === "account_name" && accountNameRef.current) {
//             accountNameRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
//             accountNameRef.current.focus();
//         }
//     }, [location]);

//     const [filteredAccounts, setFilteredAccounts] = useState<AccountType[]>([]);
//     const accountBoxRef = useRef<HTMLDivElement>(null);

//     const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { value } = e.target;
//         const searchTerm = value.trim().toLowerCase();
//         console.log("searchTerm :", searchTerm);
//         if (searchTerm) {
//             const filtered = AllAccountNames.filter((account: AccountType) =>
//                 account.account_name.toLowerCase().includes(searchTerm)
//             );
//             console.log("Filtered :", filtered);
//             setFilteredAccounts(filtered);
//         } else {
//             setFilteredAccounts([]);
//         }
//         dispatch(setFormData({ id: "account_name", value }));
//     };

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (accountBoxRef.current && !accountBoxRef.current.contains(event.target as Node)) {
//                 setFilteredAccounts([]);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const handleAccountSelect = (accountName: string) => {
//         dispatch(setFormData({ id: "account_name", value: accountName }));
//         setFilteredAccounts([]);
//     };

//     console.log('formData', formData);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { id, value } = e.target;
//         dispatch(setFormData({ id, value }));
//     };

//     return (
//         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//             {/* Card Header */}
//             <div className="flex items-center gap-2 mb-6">
//                 <div className="w-1 h-5 rounded-full bg-indigo-500" />
//                 <h2 className="text-base font-semibold text-slate-800">Account Details</h2>
//             </div>

//             <div className="border-t border-slate-100 mb-6" />

//             {/* Fields Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-5">

//                 {/* Account Name */}
//                 <div className="flex flex-col gap-1.5 relative" ref={accountBoxRef}>
//                     <label htmlFor="account_name" className="text-sm font-semibold text-slate-700">
//                         Account Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                         ref={accountNameRef}
//                         type="text"
//                         id="account_name"
//                         value={formData ? formData.account_name : ''}
//                         onChange={handleAccountChange}
//                         placeholder="Enter Account Holder"
//                         className={inputClass}
//                         autoComplete="off"
//                         autoCorrect="off"
//                     />
//                     {filteredAccounts.length > 0 && (
//                         <div className="absolute top-full left-0 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto z-50 mt-1">
//                             {filteredAccounts.map((account) => (
//                                 <div
//                                     key={account.id}
//                                     onClick={() => handleAccountSelect(account.account_name)}
//                                     className="px-3 py-2 text-sm text-slate-700 cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
//                                 >
//                                     {account.account_name}
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                     {errors.account_name && (
//                         <span className="text-red-500 text-xs mt-0.5">Account Holder is required.</span>
//                     )}
//                 </div>

//                 {/* PIC */}
//                 <div className="flex flex-col gap-1.5">
//                     <label htmlFor="pic" className="text-sm font-semibold text-slate-700">PIC</label>
//                     <input
//                         type="text"
//                         id="pic"
//                         value={formData ? formData.pic : ''}
//                         onChange={handleInputChange}
//                         placeholder="Enter PIC"
//                         className={inputClass}
//                     />
//                 </div>

//                 {/* Vertical */}
//                 <div className="flex flex-col gap-1.5">
//                     <label htmlFor="vertical" className="text-sm font-semibold text-slate-700">Vertical</label>
//                     <select
//                         id="vertical"
//                         className={selectClass(formData?.vertical)}
//                         value={formData?.vertical ?? ''}
//                         onChange={handleInputChange}
//                     >
//                         <option value="">Select Vertical</option>
//                         {verticals.map((vertical, index) => (
//                             <option key={index} value={vertical.category}>{vertical.category}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Sub Vertical */}
//                 <div className="flex flex-col gap-1.5">
//                     <label htmlFor="vertical_sub" className="text-sm font-semibold text-slate-700">Sub Vertical</label>
//                     <select
//                         id="vertical_sub"
//                         className={selectClass(formData?.vertical_sub)}
//                         value={formData?.vertical_sub ?? ''}
//                         onChange={handleInputChange}
//                     >
//                         <option>Select Sub-Vertical</option>
//                         {verticals
//                             .find(v => v.category === formData?.vertical)
//                             ?.subdivisions?.map((subdivision, index) => (
//                                 <option key={index} value={subdivision.category}>{subdivision.category}</option>
//                             ))}
//                     </select>
//                 </div>

//                 {/* Business Type */}
//                 <div className="flex flex-col gap-1.5">
//                     <label htmlFor="business" className="text-sm font-semibold text-slate-700">Business Type</label>
//                     <select
//                         id="business"
//                         className={selectClass(formData?.business)}
//                         value={formData ? formData.business : ''}
//                         onChange={handleInputChange}
//                     >
//                         <option>Select Business</option>
//                         {businessOptions.map((option, index) => (
//                             <option key={index} value={option.type}>{option.type}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Department */}
//                 <div className="flex flex-col gap-1.5">
//                     <label htmlFor="department" className="text-sm font-semibold text-slate-700">Department</label>
//                     <select
//                         id="department"
//                         className={selectClass(formData?.department)}
//                         value={formData ? formData.department : ''}
//                         onChange={handleInputChange}
//                     >
//                         <option>Select Department</option>
//                         {departments.map((dept, index) => (
//                             <option key={index} value={dept.name}>{dept.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Designation */}
//                 <div className="flex flex-col gap-1.5">
//                     <label htmlFor="designation" className="text-sm font-semibold text-slate-700">Designation</label>
//                     <select
//                         id="designation"
//                         className={selectClass(formData?.designation)}
//                         value={formData ? formData.designation : ''}
//                         onChange={handleInputChange}
//                     >
//                         <option>Select designation</option>
//                         {designations.map((designation, index) => (
//                             <option key={index} value={designation.abbreviation}>{designation.title}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Mobile No */}
//                 <div className="flex flex-col gap-1.5">
//                     <label htmlFor="mobile_number" className="text-sm font-semibold text-slate-700">Mobile No.</label>
//                     <input
//                         type="text"
//                         id="mobile_number"
//                         value={formData ? formData.mobile_number : ''}
//                         onChange={handleInputChange}
//                         placeholder="Enter Mobile Number"
//                         className={inputClass}
//                     />
//                 </div>

//                 {/* Region */}
//                 <div className="flex flex-col gap-1.5">
//                     <label htmlFor="region" className="text-sm font-semibold text-slate-700">Region</label>
//                     <select
//                         id="region"
//                         className={selectClass(formData?.region)}
//                         value={formData ? formData.region : ''}
//                         onChange={handleInputChange}
//                     >
//                         <option>Select Region</option>
//                         {regions.map((region, index) => (
//                             <option key={index} value={region.name}>{region.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* State */}
//                 <div className="flex flex-col gap-1.5">
//                     <label htmlFor="state" className="text-sm font-semibold text-slate-700">State</label>
//                     <select
//                         id="state"
//                         className={selectClass(formData?.state)}
//                         value={formData ? formData.state : ''}
//                         onChange={handleInputChange}
//                     >
//                         <option>Select state</option>
//                         {states.map((state) => (
//                             <option key={state.name} value={state.name}>{state.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* City */}
//                 <div className="flex flex-col gap-1.5">
//                     <label htmlFor="city" className="text-sm font-semibold text-slate-700">City</label>
//                     <select
//                         id="city"
//                         className={selectClass(formData?.city)}
//                         value={formData ? formData.city : ''}
//                         onChange={handleInputChange}
//                     >
//                         <option>Select city</option>
//                         {city.map((city) => (
//                             <option key={city.name} value={city.name}>{city.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Location */}
//                 <div className="flex flex-col gap-1.5">
//                     <label htmlFor="location" className="text-sm font-semibold text-slate-700">Location</label>
//                     <input
//                         type="text"
//                         id="location"
//                         value={formData ? formData.location : ''}
//                         onChange={handleInputChange}
//                         placeholder="Enter Location"
//                         className={inputClass}
//                     />
//                 </div>

//                 {/* Email */}
//                 <div className="flex flex-col gap-1.5">
//                     <label htmlFor="email_id" className="text-sm font-semibold text-slate-700">Email</label>
//                     <input
//                         type="email"
//                         id="email_id"
//                         value={formData ? formData.email_id : ''}
//                         onChange={handleInputChange}
//                         placeholder="Enter Email"
//                         className={inputClass}
//                     />
//                 </div>

//                 {/* Address */}
//                 <div className="flex flex-col gap-1.5 sm:col-span-2">
//                     <label htmlFor="address" className="text-sm font-semibold text-slate-700">Address</label>
//                     <textarea
//                         id="address"
//                         className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent  transition-all duration-200 resize-none h-[72px]"
//                         value={formData ? formData.address : ''}
//                         onChange={handleInputChange}
//                         placeholder="Enter Address"
//                     />
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default AccountDetails;


import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { setFormData } from "../../Slice/AccountWorkspaceSlice";
import { useLocation } from "react-router-dom";
import type { ICity, IState } from 'country-state-city';
import { getAllCities, getAllStates } from "../../../CommonAPI/Common";
import { fetchRequestedAccountData } from "../../../CommonAPI/FetchRequestedAccountData/FetchRequestedAccountDataSlice";
import { fetchAccountNamesData } from "../../../CommonAPI/FetchAccountNames/FetchAccountNamesSlice";
import { UserCircle } from 'lucide-react';

interface Vertical { category: string; subdivisions?: Vertical[]; }
interface Designation { title: string; abbreviation: string; }

type AccountType = { id: number; account_name: string; };
interface AccountDetailsProps { errors: { [key: string]: string }; }
interface LocationState { focusField?: string; }
interface AccountDataType { vertical?: string; mobile_number?: string; address?: string; email_id?: string; department?: string; designation?: string; pic?: string; state?: string; city?: string; location?: string; }

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border-2 border-indigo-100 bg-gradient-to-br from-white to-indigo-50/40 text-sm text-slate-800 font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 focus:bg-white hover:border-indigo-300 hover:shadow-sm transition-all duration-200 shadow-sm";
const selectClass = (value: string | null | undefined) =>
  `w-full px-3.5 py-2.5 rounded-xl border-2 border-indigo-100 bg-gradient-to-br from-white to-indigo-50/40 text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 focus:bg-white hover:border-indigo-300 hover:shadow-sm transition-all duration-200 shadow-sm cursor-pointer [&>option]:bg-white [&>option]:text-slate-800 ${!value ? 'text-slate-400 font-normal' : 'text-slate-800'}`;

const AccountDetails: React.FC<AccountDetailsProps> = ({ errors }) => {
  const dispatch = useDispatch();
  const location = useLocation() as { state: LocationState };
  const [showDetails, setShowDetails] = useState(true);
  const { loading, data, error, formData } = useSelector((state: RootState) => state.postAccountWorkspaceForm);

  useEffect(() => { dispatch(fetchAccountNamesData() as any); }, []);

  const { AllAccountNames } = useSelector((state: RootState) => state.fetchAllAccountNamesDetails);
  const accountFormSettings = useSelector((state: RootState) => state.formSettings.account);
  const verticals = accountFormSettings.verticals as Vertical[];
  const regions = accountFormSettings.regions;
  const departments = accountFormSettings.departments;
  const businessTypes = accountFormSettings.businessTypes;
  const designations = accountFormSettings.designations as Designation[];
  const [searchQuery, setSearchQuery] = useState("");
  const { AccountData } = useSelector((state: RootState) => state.fetchRequestedAccountDetails);
  const [states, setStates] = useState<IState[]>([]);

  useEffect(() => { setStates(getAllStates()); }, []);
  const cityOptions = useMemo(() => {
    if (!formData?.state) return [];

    const citiesFromLibrary = getAllCities(formData.state).map((c: ICity) => c.name);
    const citiesFromSettings = accountFormSettings?.stateCities?.[formData.state] || [];

    return [...new Set([...citiesFromLibrary, ...citiesFromSettings])]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [formData?.state, accountFormSettings?.stateCities]);

  const accountNameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (location.state?.focusField === "account_name" && accountNameRef.current) {
      accountNameRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      accountNameRef.current.focus();
    }
  }, [location]);

  const [filteredAccounts, setFilteredAccounts] = useState<AccountType[]>([]);
  const accountBoxRef = useRef<HTMLDivElement>(null);

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const searchTerm = value.trim().toLowerCase();
    console.log("searchTerm :", searchTerm);
    if (searchTerm) {
      const filtered = AllAccountNames.filter((account: AccountType) => account.account_name.toLowerCase().includes(searchTerm));
      console.log("Filtered :", filtered);
      setFilteredAccounts(filtered);
    } else {
      setFilteredAccounts([]);
    }
    dispatch(setFormData({ id: "account_name", value }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountBoxRef.current && !accountBoxRef.current.contains(event.target as Node)) { setFilteredAccounts([]); }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAccountSelect = (accountName: string) => {
    dispatch(setFormData({ id: "account_name", value: accountName }));
    setFilteredAccounts([]);
  };

  console.log('formData', formData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    dispatch(setFormData({ id, value }));
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 0 0 2px rgba(99,102,241,0.2), 0 12px 40px rgba(79,70,229,0.15), 0 2px 8px rgba(0,0,0,0.06)' }}
    >
      {/* Rich Gradient Header */}
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0891b2 100%)' }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
          <UserCircle size={20} color="white" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white m-0 tracking-tight">Account Details</h2>
          <p className="text-xs m-0" style={{ color: 'rgba(255,255,255,0.65)' }}>Fill in the account information below</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.25)' }}>📋 New Entry</span>
        </div>
      </div>

      {/* Fields Grid */}
      <div
        className="px-6 py-5"
        style={{ background: 'linear-gradient(135deg, #fafafe 0%, #f3f4ff 40%, #edfcff 100%)' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-5">

          {/* Account Name */}
          <div className="flex flex-col gap-1.5 relative" ref={accountBoxRef}>
            <label htmlFor="account_name" className="text-[10.5px] font-black uppercase tracking-widest" style={{ color: '#4f46e5' }}>
              Account Name <span style={{ color: '#f43f5e' }}>*</span>
            </label>
            <input
              ref={accountNameRef}
              type="text"
              id="account_name"
              value={formData ? formData.account_name : ''}
              onChange={handleAccountChange}
              placeholder="Enter Account Holder"
              className={inputClass}
              autoComplete="off"
              autoCorrect="off"
            />
            {filteredAccounts.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border-2 border-indigo-200 rounded-xl shadow-2xl max-h-52 overflow-y-auto z-50 mt-1">
                {filteredAccounts.map((account) => (
                  <div key={account.id} onClick={() => handleAccountSelect(account.account_name)}
                    className="px-3.5 py-2.5 text-sm text-slate-700 font-medium cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-violet-50 hover:text-indigo-700 transition-all">
                    {account.account_name}
                  </div>
                ))}
              </div>
            )}
            {errors.account_name && <span className="text-[10px] font-bold" style={{ color: '#f43f5e' }}>⚠ Account Holder is required.</span>}
          </div>

          {/* PIC */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pic" className="text-[10.5px] font-black uppercase tracking-widest" style={{ color: '#7c3aed' }}>PIC</label>
            <input type="text" id="pic" value={formData ? formData.pic : ''} onChange={handleInputChange} placeholder="Enter PIC" className={inputClass} />
          </div>

          {/* Vertical */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="vertical" className="text-[10.5px] font-black uppercase tracking-widest" style={{ color: '#0891b2' }}>Vertical</label>
            <select id="vertical" className={selectClass(formData?.vertical)} value={formData?.vertical ?? ''} onChange={handleInputChange}>
              <option value="">Select Vertical</option>
              {verticals.map((v, i) => <option key={i} value={v.category}>{v.category}</option>)}
            </select>
          </div>

          {/* Sub Vertical */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="vertical_sub" className="text-[10.5px] font-black uppercase tracking-widest" style={{ color: '#0891b2' }}>Sub Vertical</label>
            <select id="vertical_sub" className={selectClass(formData?.vertical_sub)} value={formData?.vertical_sub ?? ''} onChange={handleInputChange}>
              <option>Select Sub-Vertical</option>
              {verticals.find(v => v.category === formData?.vertical)?.subdivisions?.map((s, i) => <option key={i} value={s.category}>{s.category}</option>)}
            </select>
          </div>

          {/* Business Type */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="business" className="text-[10.5px] font-black uppercase tracking-widest" style={{ color: '#059669' }}>Business Type</label>
            <select id="business" className={selectClass(formData?.business)} value={formData ? formData.business : ''} onChange={handleInputChange}>
              <option>Select Business</option>
              {businessTypes.map((businessType, i) => <option key={i} value={businessType}>{businessType}</option>)}
            </select>
          </div>

          {/* Department */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="department" className="text-[10.5px] font-black uppercase tracking-widest" style={{ color: '#d97706' }}>Department</label>
            <select id="department" className={selectClass(formData?.department)} value={formData ? formData.department : ''} onChange={handleInputChange}>
              <option>Select Department</option>
              {departments.map((department, i) => <option key={i} value={department}>{department}</option>)}
            </select>
          </div>

          {/* Designation */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="designation" className="text-[10.5px] font-black uppercase tracking-widest" style={{ color: '#d97706' }}>Designation</label>
            <select id="designation" className={selectClass(formData?.designation)} value={formData ? formData.designation : ''} onChange={handleInputChange}>
              <option>Select designation</option>
              {designations.map((d, i) => <option key={i} value={d.abbreviation}>{d.title}</option>)}
            </select>
          </div>

          {/* Mobile No */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mobile_number" className="text-[10.5px] font-black uppercase tracking-widest" style={{ color: '#4f46e5' }}>Mobile No.</label>
            <input type="text" id="mobile_number" value={formData ? formData.mobile_number : ''} onChange={handleInputChange} placeholder="Enter Mobile Number" className={inputClass} />
          </div>

          {/* Region */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="region" className="text-[10.5px] font-black uppercase tracking-widest" style={{ color: '#7c3aed' }}>Region</label>
            <select id="region" className={selectClass(formData?.region)} value={formData ? formData.region : ''} onChange={handleInputChange}>
              <option>Select Region</option>
              {regions.map((region, i) => <option key={i} value={region}>{region}</option>)}
            </select>
          </div>

          {/* State */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="state" className="text-[10.5px] font-black uppercase tracking-widest" style={{ color: '#0891b2' }}>State</label>
            <select
              id="state"
              className={selectClass(formData?.state)}
              value={formData ? formData.state : ''}
              onChange={(e) => {
                handleInputChange(e);
                if (formData?.city) {
                  dispatch(setFormData({ id: "city", value: "" }));
                }
              }}
            >
              <option>Select state</option>
              {states.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          {/* City */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="city" className="text-[10.5px] font-black uppercase tracking-widest" style={{ color: '#0891b2' }}>City</label>
            <select id="city" className={selectClass(formData?.city)} value={formData ? formData.city : ''} onChange={handleInputChange}>
              <option>Select city</option>
              {cityOptions.map((cityName) => <option key={cityName} value={cityName}>{cityName}</option>)}
            </select>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="location" className="text-[10.5px] font-black uppercase tracking-widest" style={{ color: '#059669' }}>Location</label>
            <input type="text" id="location" value={formData ? formData.location : ''} onChange={handleInputChange} placeholder="Enter Location" className={inputClass} />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email_id" className="text-[10.5px] font-black uppercase tracking-widest" style={{ color: '#4f46e5' }}>Email</label>
            <input type="email" id="email_id" value={formData ? formData.email_id : ''} onChange={handleInputChange} placeholder="Enter Email" className={inputClass} />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="address" className="text-[10.5px] font-black uppercase tracking-widest" style={{ color: '#7c3aed' }}>Address</label>
            <textarea
              id="address"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-indigo-100 bg-gradient-to-br from-white to-indigo-50/40 text-sm text-slate-800 font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 focus:bg-white hover:border-indigo-300 transition-all duration-200 resize-none shadow-sm"
              style={{ minHeight: '72px' }}
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
