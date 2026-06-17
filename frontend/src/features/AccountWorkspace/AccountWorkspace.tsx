// import React, { useEffect, useState } from 'react';
// import styles from './AccountWorkspace.module.css';
// import Navbar from '../UserDashboard/components/navbar/navbar';
// import UserSidebar from '../UserHome/components/UserSidebar/userSidebar';
// import AccountDetails from './components/AccountDetails/accountDetails';
// import SummaryOverview from './components/SummaryOverview/SummaryOverview';
// import ListOfOpportunities from './components/OpportunityList/OpportunityList';
// import FinanceInformation from './components/FinanceInformation/FinanceInformation';
// import CompanyDetails from './components/CompanyDetails/CompanyDetails';
// import AccountMapping from './components/AccountMapping/AccountMapping';
// import { FaRegEdit } from "react-icons/fa";
// import { CiBookmark } from "react-icons/ci";
// import { useDispatch, useSelector } from 'react-redux';
// import { accountForm, clearAccountData } from '../AccountForm/slice/accountFormSlice';
// import { getCurrentDate } from '../currentDate/date';
// import type { AppDispatch, RootState } from '../../app/store';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { accountWorkspaceData, resetFormData, submitForm } from './Slice/AccountWorkspaceSlice';



// type Contact = {
//   category: string;
//   name: string;
//   designation: string;
//   mobile_no: string;
//   email_id: string;
// };

// type Finance = {
//   turn_over: number;
//   account_resumable: number;
//   credits: number;
// };

// type Company = {
//   company_type: string;
//   account_type: string;
//   company_scale: string;
// };

// type FormData = {
//   account_holder: string;
//   account_name: string;
//   department: string;
//   vertical: string;
//   vertical_sub: string;
//   pic: string;
//   designation: string;
//   business: string;
//   region: string;
//   mobile_number: string;
//   email_id: string;
//   location: string;
//   state: string;
//   city: string;
//   address: string;
//   acct_created_date: string;
//   last_update: string;
//   contacts: Contact[];
//   finance: Finance[];
//   company: Company[];
// };

// const AccountWorkspace: React.FC = () => {

//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [currentDate, setCurrentDate] = useState<string>('');

//   const { loading, data, error, formData } = useSelector(
//     (state: RootState) => state.postAccountWorkspaceForm
//   );



//    const isUser = location.pathname.startsWith("/user");
//   useEffect(() => {

//     if (data?.message === "Success") {
//       alert("Account Form Submitted successfully");
//       dispatch(resetFormData());
//       if (isUser) {
//         navigate("/user/AccountWorkspaceTable");
//         dispatch(clearAccountData());
//       } else {
//         navigate("/AdminAccountWorkspaceTable ");
//         dispatch(clearAccountData());
//       }
  

//     } else if (data?.message && data.message !== "Success") {
//       alert("Submission failed");
//       dispatch(clearAccountData());
//     }
//   }, [data, navigate]);
//   // Initialize the formData with the structure

//   // Set the current date on component mount
//   useEffect(() => {
//     const date = getCurrentDate();
//     setCurrentDate(date);
//   }, []);

//   // Handle input changes in the form for various fields
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, id, value } = e.target;
//     const field = id;

//     // setFormData((prevData) => ({
//     //   ...prevData,
//     //   [field]: value,
//     //   acct_created_date: currentDate,

//     // }));
//   };



//   const dispatch = useDispatch<AppDispatch>();
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});


//   // console.log('errors',errors)
//   const handleSubmit = () => {
//     const newErrors: { [key: string]: string } = {};

//     // Validate required fields
//     if (!formData?.account_name) {
//       newErrors.account_name = "Account Name is required";
//     }
//     // else if (!formData?.account_name) {
//     //   newErrors.account_name = "Account Name is required";
//     // }

//     // Set errors
//     setErrors(newErrors);

//     // If there are errors, scroll to the first field with an error
//     if (Object.keys(newErrors).length > 0) {
//       const focusField = Object.keys(newErrors)[0];
//       const fieldElement = document.getElementById(focusField); // Find the field by its `id`

//       if (fieldElement) {
//         fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
//         (fieldElement as HTMLInputElement).focus(); // Set focus to the field
//       }

//       return; // Stop submission
//     }

//     const userConfirmed = window.confirm("Do you want to save the changes?");
//     if (userConfirmed) {
//       if (formData) {
//         dispatch(accountWorkspaceData(formData)); // Dispatch the submitForm action with formData
//         console.log("Form submitted successfully:", formData);
//       } else {
//         console.error("Form data is missing.");
//       }
//     } else {
//       console.log("User canceled the save action.");
//     }
//     // Dispatch the submitForm action with formData if no errors


//     // Log the data for debugging
//     console.log("Form submitted successfully:", formData);
//   };




//   return (
//     <div className={styles.mainContent}>
//       <div className={styles.head}>
//         <p className={styles.subhead}>Account Workspace</p>
//         <p className={styles.subtext}>Monitor and edit all your data</p>
//       </div>
//       <div className={styles.accountwrapper}>
//         <AccountDetails
//           errors={errors}
//         />
//       </div>
//       <AccountMapping />

//       <div className={styles.row1}>
//         <div className={styles.financeInformation}>
//           <FinanceInformation />
//         </div>
//         <div className={styles.financeInformation}>
//           <CompanyDetails />
//         </div>
//       </div>

//       <div className={styles.buttonContainer}>
//         <button
//           type="button"
//           className={styles.savebutton}
//           onClick={handleSubmit}
//         >
//           <CiBookmark color="white" size={20} style={{ marginRight: "5px" }} />
//           Save
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AccountWorkspace;




// import React, { useEffect, useState } from 'react';
// import Navbar from '../UserDashboard/components/navbar/navbar';
// import UserSidebar from '../UserHome/components/UserSidebar/userSidebar';
// import AccountDetails from './components/AccountDetails/accountDetails';
// import SummaryOverview from './components/SummaryOverview/SummaryOverview';
// import ListOfOpportunities from './components/OpportunityList/OpportunityList';
// import FinanceInformation from './components/FinanceInformation/FinanceInformation';
// import CompanyDetails from './components/CompanyDetails/CompanyDetails';
// import AccountMapping from './components/AccountMapping/AccountMapping';
// import { CiBookmark } from "react-icons/ci";
// import { useDispatch, useSelector } from 'react-redux';
// import { clearAccountData } from '../AccountForm/slice/accountFormSlice';
// import { getCurrentDate } from '../currentDate/date';
// import type { AppDispatch, RootState } from '../../app/store';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { accountWorkspaceData, resetFormData } from './Slice/AccountWorkspaceSlice';

// type Contact = {
//   category: string;
//   name: string;
//   designation: string;
//   mobile_no: string;
//   email_id: string;
// };

// type Finance = {
//   turn_over: number;
//   account_resumable: number;
//   credits: number;
// };

// type Company = {
//   company_type: string;
//   account_type: string;
//   company_scale: string;
// };

// type FormData = {
//   account_holder: string;
//   account_name: string;
//   department: string;
//   vertical: string;
//   vertical_sub: string;
//   pic: string;
//   designation: string;
//   business: string;
//   region: string;
//   mobile_number: string;
//   email_id: string;
//   location: string;
//   state: string;
//   city: string;
//   address: string;
//   acct_created_date: string;
//   last_update: string;
//   contacts: Contact[];
//   finance: Finance[];
//   company: Company[];
// };

// const AccountWorkspace: React.FC = () => {

//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [currentDate, setCurrentDate] = useState<string>('');

//   const { loading, data, error, formData } = useSelector(
//     (state: RootState) => state.postAccountWorkspaceForm
//   );

//   const isUser = location.pathname.startsWith("/user");

//   useEffect(() => {
//     if (data?.message === "Success") {
//       alert("Account Form Submitted successfully");
//       dispatch(resetFormData());
//       if (isUser) {
//         navigate("/user/AccountWorkspaceTable");
//         dispatch(clearAccountData());
//       } else {
//         navigate("/AdminAccountWorkspaceTable ");
//         dispatch(clearAccountData());
//       }
//     } else if (data?.message && data.message !== "Success") {
//       alert("Submission failed");
//       dispatch(clearAccountData());
//     }
//   }, [data, navigate]);

//   useEffect(() => {
//     const date = getCurrentDate();
//     setCurrentDate(date);
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, id, value } = e.target;
//     const field = id;
//   };

//   const dispatch = useDispatch<AppDispatch>();
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const handleSubmit = () => {
//     const newErrors: { [key: string]: string } = {};

//     if (!formData?.account_name) {
//       newErrors.account_name = "Account Name is required";
//     }

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length > 0) {
//       const focusField = Object.keys(newErrors)[0];
//       const fieldElement = document.getElementById(focusField);

//       if (fieldElement) {
//         fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
//         (fieldElement as HTMLInputElement).focus();
//       }

//       return;
//     }

//     const userConfirmed = window.confirm("Do you want to save the changes?");
//     if (userConfirmed) {
//       if (formData) {
//         dispatch(accountWorkspaceData(formData));
//         console.log("Form submitted successfully:", formData);
//       } else {
//         console.error("Form data is missing.");
//       }
//     } else {
//       console.log("User canceled the save action.");
//     }

//     console.log("Form submitted successfully:", formData);
//   };

//   return (
//     <div className="p-5 overflow-y-auto">

//       {/* Page Header — Dojo-style gradient banner */}
//       <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 shadow-md mb-6 mt-2">
//         <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
//           <CiBookmark size={18} color="white" />
//         </div>
//         <div>
//           <h1 className="text-xl font-bold text-white leading-tight">Account Workspace</h1>
//           <p className="text-indigo-100 text-xs mt-0.5">Monitor and edit all your data</p>
//         </div>
//       </div>

//       {/* Account Details Card */}
//       <div className="mb-5">
//         <AccountDetails errors={errors} />
//       </div>

//       {/* Account Mapping Card */}
//       <div className="mb-5">
//         <AccountMapping />
//       </div>

//       {/* Finance + Company side by side */}
//       <div className="flex gap-4 mb-5">
//         <div className="flex-1 min-w-0">
//           <FinanceInformation />
//         </div>
//         <div className="flex-1 min-w-0">
//           <CompanyDetails />
//         </div>
//       </div>

//       {/* Save Button */}
//       <div className="flex justify-center mt-6 mb-4">
//         <button
//           type="button"
//           onClick={handleSubmit}
//           className="flex items-center justify-center gap-2 w-full max-w-sm py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold transition-colors duration-200 shadow-md"
//         >
//           <CiBookmark size={20} />
//           Save
//         </button>
//       </div>

//     </div>
//   );
// };

// export default AccountWorkspace;


import React, { useEffect, useState } from 'react';
import Navbar from '../UserDashboard/components/navbar/navbar';
import UserSidebar from '../UserHome/components/UserSidebar/userSidebar';
import AccountDetails from './components/AccountDetails/accountDetails';
import SummaryOverview from './components/SummaryOverview/SummaryOverview';
import ListOfOpportunities from './components/OpportunityList/OpportunityList';
import FinanceInformation from './components/FinanceInformation/FinanceInformation';
import CompanyDetails from './components/CompanyDetails/CompanyDetails';
import AccountMapping from './components/AccountMapping/AccountMapping';
import { CiBookmark } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { clearAccountData } from '../AccountForm/slice/accountFormSlice';
import { getCurrentDate } from '../currentDate/date';
import type { AppDispatch, RootState } from '../../app/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { accountWorkspaceData, resetFormData } from './Slice/AccountWorkspaceSlice';

type Contact = {
  category: string;
  name: string;
  designation: string;
  mobile_no: string;
  email_id: string;
};

type Finance = {
  turn_over: number;
  account_resumable: number;
  credits: number;
};

type Company = {
  company_type: string;
  account_type: string;
  company_scale: string;
};

type FormData = {
  account_holder: string;
  account_name: string;
  department: string;
  vertical: string;
  vertical_sub: string;
  pic: string;
  designation: string;
  business: string;
  region: string;
  mobile_number: string;
  email_id: string;
  location: string;
  state: string;
  city: string;
  address: string;
  acct_created_date: string;
  last_update: string;
  contacts: Contact[];
  finance: Finance[];
  company: Company[];
};

const AccountWorkspace: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('');

  const { loading, data, error, formData } = useSelector(
    (state: RootState) => state.postAccountWorkspaceForm
  );

  const isUser = location.pathname.startsWith("/user");

  useEffect(() => {
    if (data?.message === "Success") {
      alert("Account Form Submitted successfully");
      dispatch(resetFormData());
      if (isUser) {
        navigate("/user/AccountWorkspaceTable");
        dispatch(clearAccountData());
      } else {
        navigate("/AdminAccountWorkspaceTable");
        dispatch(clearAccountData());
      }
    } else if (data?.message && data.message !== "Success") {
      alert("Submission failed");
      dispatch(clearAccountData());
    }
  }, [data, navigate]);

  useEffect(() => {
    const date = getCurrentDate();
    setCurrentDate(date);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, id, value } = e.target;
    const field = id;
  };

  const dispatch = useDispatch<AppDispatch>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData?.account_name) {
      newErrors.account_name = "Account Name is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const focusField = Object.keys(newErrors)[0];
      const fieldElement = document.getElementById(focusField);

      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
        (fieldElement as HTMLInputElement).focus();
      }

      return;
    }

    const userConfirmed = window.confirm("Do you want to save the changes?");
    if (userConfirmed) {
      if (formData) {
        dispatch(accountWorkspaceData(formData));
        console.log("Form submitted successfully:", formData);
      } else {
        console.error("Form data is missing.");
      }
    } else {
      console.log("User canceled the save action.");
    }

    console.log("Form submitted successfully:", formData);
  };

  return (
    <div
      className="overflow-y-auto relative"
      style={{
        padding: '28px',
        minHeight: '100%',
        background: 'radial-gradient(ellipse 65% 45% at 0% 0%, rgba(3,105,161,0.2) 0%, transparent 55%), radial-gradient(ellipse 55% 45% at 100% 5%, rgba(20,184,166,0.16) 0%, transparent 58%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(245,158,11,0.12) 0%, transparent 62%), linear-gradient(180deg, #eff6ff 0%, #ecfeff 45%, #f8fafc 100%)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          top: '-80px',
          right: '-60px',
          background: 'radial-gradient(circle, rgba(14,165,233,0.25) 0%, rgba(14,165,233,0) 70%)',
          filter: 'blur(2px)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          bottom: '-120px',
          left: '-90px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0) 72%)',
          filter: 'blur(3px)',
          pointerEvents: 'none',
        }}
      />
      {/* ── Hero Header Banner ── */}
      <div
        className="flex items-center gap-4 px-7 py-5 rounded-2xl mb-7"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(120deg, #0369a1 0%, #0891b2 45%, #14b8a6 75%, #f59e0b 100%)',
          boxShadow: '0 10px 36px rgba(3,105,161,0.34), 0 2px 10px rgba(0,0,0,0.12)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(105deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 45%)',
          }}
        />
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', position: 'relative', zIndex: 1 }}
        >
          <CiBookmark size={24} color="white" />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="text-2xl font-extrabold text-white leading-tight m-0" style={{ letterSpacing: '-0.5px', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            Account Workspace
          </h1>
          <p className="text-sm m-0 mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Monitor and manage all your account data
          </p>
        </div>
      </div>

      {/* Account Details Card */}
      <div className="mb-5" style={{ borderRadius: '20px', padding: '2px', background: 'linear-gradient(135deg, rgba(2,132,199,0.35), rgba(20,184,166,0.24), rgba(245,158,11,0.22))' }}>
        <div style={{ borderRadius: '18px', background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(8px)' }}>
          <AccountDetails errors={errors} />
        </div>
      </div>

      {/* Account Mapping Card */}
      <div className="mb-5" style={{ borderRadius: '20px', padding: '2px', background: 'linear-gradient(135deg, rgba(14,165,233,0.35), rgba(20,184,166,0.28), rgba(5,150,105,0.22))' }}>
        <div style={{ borderRadius: '18px', background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(8px)' }}>
          <AccountMapping />
        </div>
      </div>

      {/* Finance + Company side by side */}
      <div className="flex gap-5 mb-5">
        <div className="flex-1 min-w-0" style={{ borderRadius: '20px', padding: '2px', background: 'linear-gradient(145deg, rgba(2,132,199,0.36), rgba(20,184,166,0.28))' }}>
          <div style={{ borderRadius: '18px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
            <FinanceInformation />
          </div>
        </div>
        <div className="flex-1 min-w-0" style={{ borderRadius: '20px', padding: '2px', background: 'linear-gradient(145deg, rgba(20,184,166,0.28), rgba(251,146,60,0.24))' }}>
          <div style={{ borderRadius: '18px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
            <CompanyDetails />
          </div>
        </div>
      </div>

      {/* ── Save Button ── */}
      <div className="flex justify-center mt-6 mb-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 py-3 px-10 rounded-2xl text-white text-sm font-bold uppercase tracking-wide transition-all duration-300"
          style={{
            background: 'linear-gradient(120deg, #0369a1 0%, #0891b2 45%, #14b8a6 78%, #f59e0b 100%)',
            boxShadow: '0 6px 24px rgba(3,105,161,0.45)',
            letterSpacing: '0.05em',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px) scale(1.04)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(79,70,229,0.6)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = '';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(79,70,229,0.45)';
          }}
        >
          <CiBookmark size={20} />
          Save Changes
        </button>
      </div>

    </div>
  );
};

export default AccountWorkspace;
