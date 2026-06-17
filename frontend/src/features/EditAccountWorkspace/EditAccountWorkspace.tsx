// import React, { useEffect, useState } from 'react';
// import styles from './EditAccountWorkspace.module.css';
// import AccountDetails from './components/AccountDetails/accountDetails';
// import SummaryOverview from './components/SummaryOverview/SummaryOverview';
// import ListOfOpportunities from './components/OpportunityList/OpportunityList';
// import FinanceInformation from './components/FinanceInformation/FinanceInformation';
// import CompanyDetails from './components/CompanyDetails/CompanyDetails';
// import AccountMapping from './components/AccountMapping/AccountMapping';
// import { CiBookmark } from 'react-icons/ci';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import type { RootState } from '../../app/store';
// import { clearAccountData, editUser, fetchUserById } from '../EditAccountForm/slice/accountFormEdit';
// import { editAccountWorkspaceFetchUserById, editPostAccountWorkspace } from './Slice/EditAccountWorkspaceSlice';

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
//   id: string;
//   account_holder: string;
//   account_name: string;
//   department: string;
//   vertical: string;
//   vertical_sub: string | null;
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
//   last_update: string | null;
//   contacts: Contact[];
//   finance: Finance[];
//   company: Company[];
// };

// const EditAccountWorkspace: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const Userdata = useSelector((state: RootState) => state.accountFetchUserByid.selectedUser);



//   const { loading, data, error, formData } = useSelector(
//     (state: RootState) => state.AccountWorkspaceEditFormData
//   );

//   const { user } = useSelector((state: RootState) => state.userLoginAuth);

//   useEffect(() => {

//     if (data?.message === "success") {
//       alert("Account Form Submitted successfully");
//       navigate("/user/AccountWorkspaceTable");
//       dispatch(clearAccountData());
//     } else if (data?.message && data.message !== "success") {
//       alert("Submission failed");
//       dispatch(clearAccountData());
//     }
//   }, [data, navigate]);


//   useEffect(() => {
//     if (id) {
//       dispatch(editAccountWorkspaceFetchUserById(id) as any);
//     }
//   }, [dispatch, id]);

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const handleSave = () => {

//     const newErrors: { [key: string]: string } = {};

//     // Validate required fields
//     if (!formData?.account_name) {
//       newErrors.account_name = "Account Name is required";
//     }

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
//         dispatch(editPostAccountWorkspace({ formData }) as any);
//       }
//     } else {
//       console.log("User canceled the save action.");
//     }
//   };
//   return (
//     <div className={styles.mainContent}>
//       <div className={styles.head}>
//         <p className={styles.subhead}>Account Workspace</p>
//         <p className={styles.subtext}>Monitor and edit all your data</p>
//       </div>
//       <div className={styles.accountwrapper}>
//         <AccountDetails
//           errors={errors} />
//       </div>
//       <AccountMapping />
//       <div className={styles.row}>
//         <div className={styles.summaryOverview}>
//           <SummaryOverview />
//         </div>
//         <div className={styles.listOfOpportunities}>
//           {formData && (
//             <ListOfOpportunities account_name={formData.account_name} />
//           )}
//         </div>
//       </div>
//       <div className={styles.row1}>
//         <div className={styles.financeInformation}>
//           <FinanceInformation />
//         </div>
//         <div className={styles.financeInformation}>
//           <CompanyDetails />
//         </div>
//       </div>
//       <div className={styles.buttonContainer}>
//         <button type="button" className={styles.savebutton} onClick={handleSave}>
//           <CiBookmark color="white" size={20} style={{ marginRight: '5px' }} />
//           Save
//         </button>
//       </div>
//     </div>

//   );
// };

// export default EditAccountWorkspace;





import React, { useEffect, useState } from 'react';
import AccountDetails from './components/AccountDetails/accountDetails';
import SummaryOverview from './components/SummaryOverview/SummaryOverview';
import ListOfOpportunities from './components/OpportunityList/OpportunityList';
import FinanceInformation from './components/FinanceInformation/FinanceInformation';
import CompanyDetails from './components/CompanyDetails/CompanyDetails';
import AccountMapping from './components/AccountMapping/AccountMapping';
import { CiBookmark } from 'react-icons/ci';
import { Briefcase } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { RootState } from '../../app/store';
import { clearAccountData, editUser, fetchUserById } from '../EditAccountForm/slice/accountFormEdit';
import { editAccountWorkspaceFetchUserById, editPostAccountWorkspace } from './Slice/EditAccountWorkspaceSlice';

// ─── Types ────────────────────────────────────────────────────────────────────

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
  id: string;
  account_holder: string;
  account_name: string;
  department: string;
  vertical: string;
  vertical_sub: string | null;
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
  last_update: string | null;
  contacts: Contact[];
  finance: Finance[];
  company: Company[];
};

// ─── Component ────────────────────────────────────────────────────────────────

const EditAccountWorkspace: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const Userdata = useSelector((state: RootState) => state.accountFetchUserByid.selectedUser);

  const { loading, data, error, formData } = useSelector(
    (state: RootState) => state.AccountWorkspaceEditFormData
  );

  const { user } = useSelector((state: RootState) => state.userLoginAuth);

  useEffect(() => {
    if (data?.message === "success") {
      alert("Account Form Submitted successfully");
      navigate("/user/AccountWorkspaceTable");
      dispatch(clearAccountData());
    } else if (data?.message && data.message !== "success") {
      alert("Submission failed");
      dispatch(clearAccountData());
    }
  }, [data, navigate]);

  useEffect(() => {
    if (id) {
      dispatch(editAccountWorkspaceFetchUserById(id) as any);
    }
  }, [dispatch, id]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate required fields
    if (!formData?.account_name) {
      newErrors.account_name = "Account Name is required";
    }

    // Set errors
    setErrors(newErrors);

    // If there are errors, scroll to the first field with an error
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
        dispatch(editPostAccountWorkspace({ formData }) as any);
      }
    } else {
      console.log("User canceled the save action.");
    }
  };

  return (
    <div className="w-full p-5 flex flex-col gap-5">

      {/* Page Header */}
      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 shadow-md mt-2">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Briefcase size={18} color="white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">Account Workspace</h1>
          <p className="text-indigo-100 text-xs mt-0.5">Monitor and edit all your data</p>
        </div>
      </div>

      {/* Account Details */}
      <AccountDetails errors={errors} />

      {/* Account Mapping */}
      <AccountMapping />

      {/* Summary Overview + List of Opportunities — equal height row */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <div className="lg:flex-[2_2_0%] min-w-0">
          <SummaryOverview />
        </div>
        <div className="lg:flex-[3_3_0%] min-w-0">
          {formData && (
            <ListOfOpportunities account_name={formData.account_name} />
          )}
        </div>
      </div>

      {/* Finance + Company side by side */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <FinanceInformation />
        </div>
        <div className="flex-1 min-w-0">
          <CompanyDetails />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-2 mb-4">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center justify-center gap-2 w-full max-w-sm py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold transition-colors duration-200 shadow-md"
        >
          <CiBookmark size={20} />
          Save
        </button>
      </div>

    </div>
  );
};

export default EditAccountWorkspace;
