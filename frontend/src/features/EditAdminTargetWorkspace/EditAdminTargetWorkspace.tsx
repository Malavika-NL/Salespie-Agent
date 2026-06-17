// import React, { useEffect, useState } from 'react';
// import styles from './EditAdminTargetWorkspace.module.css';
// import Navbar from '../UserDashboard/components/navbar/navbar';
// import UserSidebar from '../UserHome/components/UserSidebar/userSidebar';
// import AccountDetails from './components/AccountDetails/accountDetails';

// import AccountMapping from './components/AccountMapping/AccountMapping';
// import { CiBookmark } from 'react-icons/ci';
// import { useDispatch, useSelector } from 'react-redux';
// import { accountForm } from '../AccountForm/slice/accountFormSlice';
// import { getCurrentDate } from '../currentDate/date';
// import { useNavigate, useParams } from 'react-router-dom';
// import type { RootState } from '../../app/store';
// import { clearAccountData, editUser, fetchUserById } from '../EditAccountForm/slice/accountFormEdit';
// import { fetchAdminTargetWorkspaceUserById, editAdminTargetWorkspaceUser } from './Slice/EditAdminTargetWorkspaceSlice';

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

// const EditAdminTargetWorkspace: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();


//   const { loading, data, error, formData } = useSelector(
//     (state: RootState) => state.AdminTargetWorkspaceEditData
//   );

//   const { user } = useSelector((state: RootState) => state.userLoginAuth);
// console.log(user)
//   useEffect(() => {

//     if (data?.message === "success") {
//       alert("Target Form Editted successfully");
//       navigate("/AdminTargetWorkspaceTable");
//       dispatch(clearAccountData());
//     } else if (data?.message && data.message !== "success") {
//       alert("Submission failed");
//       dispatch(clearAccountData());
//     }
//   }, [data, navigate]);


//   useEffect(() => {
//     if (id) {
//       dispatch(fetchAdminTargetWorkspaceUserById(id) as any);
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
//         dispatch(editAdminTargetWorkspaceUser({ formData }) as any);
//       }
//     } else {
//       console.log("User canceled the save action.");
//     }
//   };
//   return (
//     <div className={styles.mainContent}>
//       <div className={styles.head}>
//         <p className={styles.subhead}>Target Workspace</p>
//         <p className={styles.subtext}>Monitor and edit all your data</p>
//       </div>
//       <div className={styles.accountwrapper}>
//         <AccountDetails
//           errors={errors} />
//       </div>
//       <AccountMapping />

//       <div className={styles.buttonContainer}>
//         <button type="button" className={styles.savebutton} onClick={handleSave}>
//           <CiBookmark color="white" size={20} style={{ marginRight: '5px' }} />
//           Save
//         </button>
//       </div>
//     </div>


//   );
// };

// export default EditAdminTargetWorkspace;


import React, { useEffect, useState } from 'react';
import AccountDetails from './components/AccountDetails/accountDetails';
import AccountMapping from './components/AccountMapping/AccountMapping';
import { CiBookmark } from 'react-icons/ci';
import { Crosshair } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { RootState } from '../../app/store';
import { clearAccountData, editUser, fetchUserById } from '../EditAccountForm/slice/accountFormEdit';
import { fetchAdminTargetWorkspaceUserById, editAdminTargetWorkspaceUser } from './Slice/EditAdminTargetWorkspaceSlice';
import { accountForm } from '../AccountForm/slice/accountFormSlice';
import { getCurrentDate } from '../currentDate/date';

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

const EditAdminTargetWorkspace: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { loading, data, error, formData } = useSelector(
    (state: RootState) => state.AdminTargetWorkspaceEditData
  );

  const { user } = useSelector((state: RootState) => state.userLoginAuth);
  console.log(user);

  useEffect(() => {
    if (data?.message === "success") {
      alert("Target Form Editted successfully");
      navigate("/AdminTargetWorkspaceTable");
      dispatch(clearAccountData());
    } else if (data?.message && data.message !== "success") {
      alert("Submission failed");
      dispatch(clearAccountData());
    }
  }, [data, navigate]);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminTargetWorkspaceUserById(id) as any);
    }
  }, [dispatch, id]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSave = () => {
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
        dispatch(editAdminTargetWorkspaceUser({ formData }) as any);
      }
    } else {
      console.log("User canceled the save action.");
    }
  };

  return (
    <div className="p-5 overflow-y-auto flex flex-col gap-5">

      {/* Page Header */}
      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 shadow-md mt-2">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Crosshair size={18} color="white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">Target Workspace</h1>
          <p className="text-blue-100 text-xs mt-0.5">Monitor and edit all your data</p>
        </div>
      </div>

      {/* Account Details */}
      <AccountDetails errors={errors} />

      {/* Account Mapping */}
      <AccountMapping />

      {/* Save Button */}
      <div className="flex justify-center mt-2 mb-4">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center justify-center gap-2 w-full max-w-sm py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold transition-colors duration-200 shadow-md"
        >
          <CiBookmark size={20} />
          Save
        </button>
      </div>

    </div>
  );
};

export default EditAdminTargetWorkspace;
