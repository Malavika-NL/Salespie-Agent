// import React, { useEffect } from 'react';
// import styles from './registerForm.module.css';
// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux'
// import { registerForm ,clearRegisterData } from './slice/registerFormSlice';
// import type { RootState } from '../../app/store';
// import { useNavigate } from 'react-router-dom';

// interface FormData {
//     username: string;
//     password: any;
//     employeeid: string;
//     role:string;
//     email:string;
// }

// const RegisterForm = () => {
//     const dispatch = useDispatch();

//     const [isFormSubmitted, setIsFormSubmitted] = useState(false);

//     const data = useSelector((state: RootState) => state.registerForm.data);
//     console.log(data)

//     const navigate = useNavigate();
//     useEffect(() => {
//         if (isFormSubmitted) {
//           if (data?.message === 'Success') {
//             console.log(data);
//             dispatch(clearRegisterData());
//             alert('New User Added successfully!');
//             navigate('/home');
//             setIsFormSubmitted(false);
//           } else if (data?.message === 'Failed to submit form') {
//             console.log(data.message);
//             alert(' Failed to  Add New User.');
//             setIsFormSubmitted(false);
//             dispatch(clearRegisterData());
//             // Optionally handle failure state or additional logic here
//           }
//           // Reset the form submission state
          
//         }
//       }, [isFormSubmitted, data, dispatch, navigate]);

//     const [formData, setFormData] = useState<FormData>({
//         username: '',
//         password: '',
//         employeeid: '',
//         role:'',
//         email:'',


//     });
//     console.log(formData)

//     const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = event.target;
//         setFormData(prevFormData => ({
//             ...prevFormData,
//             [name]: value
//         }));
//     };


//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         dispatch(registerForm(formData) as any);
//         setIsFormSubmitted(true);
//     };

//     console.log(formData)

//     return (
//         <div className={styles.container}>
//             <div className={styles.formContainer}>
//             <div className={styles.title}>New User</div>
//             <form className={styles.form} onSubmit={handleSubmit}>
//                 <input
//                     type='text'
//                     name='username'
//                     placeholder='User Name'
//                     onChange={handleChange}
//                     value={formData.username}
//                     className={styles.inputItem}
//                 />
//                 <input
//                     type='email'
//                     name='email'
//                     placeholder='Enter Email'
//                     onChange={handleChange}
//                     value={formData.email}
//                     className={styles.inputItem}
//                 />
//                 <input
//                     type='password'
//                     name='password'
//                     placeholder='Password'
//                     onChange={handleChange}
//                     value={formData.password}
//                     className={styles.inputItem}
//                 />
                
//                 <input
//                     type='text'
//                     name='employeeid'
//                     placeholder='Employee ID'
//                     onChange={handleChange}
//                     value={formData.employeeid}
//                     className={styles.inputItem}
//                 />

//                <select
//                  className={styles.select}
//                  onChange={handleChange}
//                  value={formData.role}
//                  name='role'
//                >
//                     <option value=''> select Role </option>
//                     <option value='admin'>Admin</option>
//                     <option value='user'>User</option>
//                     <option value='lead'>Lead</option>
//                </select>

//                 <div className={styles.buttonContainer}>
//                     <button type='submit'
//                         className={styles.Registerbutton}
//                     >Register</button>
                   
//                 </div>
//             </form>


//         </div>
//         </div>
//     );
// }

// export default RegisterForm;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { registerForm, clearRegisterData } from './slice/registerFormSlice';
// import type { RootState } from '../../app/store';
// import { useNavigate } from 'react-router-dom';

// interface FormData {
//   username: string;
//   password: string;
//   confirmPassword: string;
//   employeeid: string;
//   role: string;
//   email: string;
// }

// interface FormErrors {
//   username?: string;
//   password?: string;
//   confirmPassword?: string;
//   employeeid?: string;
//   role?: string;
//   email?: string;
// }

// const RegisterForm = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [isFormSubmitted, setIsFormSubmitted] = useState(false);
//   const [formErrors, setFormErrors] = useState<FormErrors>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const { data, loading } = useSelector((state: RootState) => state.registerForm);

//   const [formData, setFormData] = useState<FormData>({
//     username: '',
//     password: '',
//     confirmPassword: '',
//     employeeid: '',
//     role: '',
//     email: '',
//   });

//   useEffect(() => {
//     if (isFormSubmitted) {
//       if (data?.message === 'Success') {
//         setSuccessMessage('New user registered successfully!');
//         setErrorMessage('');
//         dispatch(clearRegisterData());
//         setIsFormSubmitted(false);
//         setTimeout(() => navigate('/home'), 1500);
//       } else if (data?.message) {
//         setErrorMessage('Registration failed. Please check your details and try again.');
//         setSuccessMessage('');
//         setIsFormSubmitted(false);
//         dispatch(clearRegisterData());
//       }
//     }
//   }, [isFormSubmitted, data, dispatch, navigate]);

//   const validate = (): boolean => {
//     const errors: FormErrors = {};

//     if (!formData.username.trim()) {
//       errors.username = 'Username is required.';
//     } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
//       errors.username = 'Username must be alphanumeric only.';
//     }

//     if (!formData.email.trim()) {
//       errors.email = 'Email is required.';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       errors.email = 'Enter a valid email address.';
//     }

//     if (!formData.password) {
//       errors.password = 'Password is required.';
//     } else if (formData.password.length < 6) {
//       errors.password = 'Password must be at least 6 characters.';
//     } else if (!/[A-Z]/.test(formData.password)) {
//       errors.password = 'Password must contain at least one uppercase letter.';
//     } else if (!/[a-z]/.test(formData.password)) {
//       errors.password = 'Password must contain at least one lowercase letter.';
//     } else if (!/[0-9]/.test(formData.password)) {
//       errors.password = 'Password must contain at least one number.';
//     } else if (!/[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/]/.test(formData.password)) {
//       errors.password = 'Password must contain at least one special character.';
//     }

//     if (!formData.confirmPassword) {
//       errors.confirmPassword = 'Please confirm your password.';
//     } else if (formData.password !== formData.confirmPassword) {
//       errors.confirmPassword = 'Passwords do not match.';
//     }

//     if (!formData.employeeid.trim()) {
//       errors.employeeid = 'Employee ID is required.';
//     }

//     if (!formData.role) {
//       errors.role = 'Please select a role.';
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     // Clear error for field being edited
//     setFormErrors(prev => ({ ...prev, [name]: undefined }));
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setSuccessMessage('');
//     setErrorMessage('');
//     if (!validate()) return;

//     const { confirmPassword, ...submitData } = formData;
//     dispatch(registerForm(submitData) as any);
//     setIsFormSubmitted(true);
//   };

//   const inputClass = (field: keyof FormErrors) =>
//     `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all duration-200 bg-white
//     ${formErrors[field]
//       ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
//       : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">

//         {/* Header */}
//         <div className="bg-gradient-to-r from-[#00183F] to-[#003580] px-8 py-6">
//           <h1 className="text-2xl font-bold text-white">Register New User</h1>
//           <p className="text-blue-200 text-sm mt-1">Fill in the details to create a new account</p>
//         </div>

//         {/* Form */}
//         <div className="px-8 py-6">

//           {/* Success Message */}
//           {successMessage && (
//             <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
//               <span>âœ“</span> {successMessage}
//             </div>
//           )}

//           {/* Error Message */}
//           {errorMessage && (
//             <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
//               <span>âœ•</span> {errorMessage}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} noValidate className="space-y-4">

//             {/* Username */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//               <input
//                 type="text"
//                 name="username"
//                 placeholder="Enter username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className={inputClass('username')}
//               />
//               {formErrors.username && (
//                 <p className="mt-1 text-xs text-red-500">{formErrors.username}</p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter email address"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={inputClass('email')}
//               />
//               {formErrors.email && (
//                 <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   placeholder="Enter password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={inputClass('password')}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//                 >
//                   {showPassword ? 'Hide' : 'Show'}
//                 </button>
//               </div>
//               {formErrors.password && (
//                 <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//               <div className="relative">
//                 <input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   name="confirmPassword"
//                   placeholder="Confirm password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className={inputClass('confirmPassword')}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//                 >
//                   {showConfirmPassword ? 'Hide' : 'Show'}
//                 </button>
//               </div>
//               {formErrors.confirmPassword && (
//                 <p className="mt-1 text-xs text-red-500">{formErrors.confirmPassword}</p>
//               )}
//             </div>

//             {/* Employee ID & Role row */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
//                 <input
//                   type="text"
//                   name="employeeid"
//                   placeholder="e.g. EMP001"
//                   value={formData.employeeid}
//                   onChange={handleChange}
//                   className={inputClass('employeeid')}
//                 />
//                 {formErrors.employeeid && (
//                   <p className="mt-1 text-xs text-red-500">{formErrors.employeeid}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   className={`${inputClass('role')} cursor-pointer`}
//                 >
//                   <option value="">Select role</option>
//                   <option value="admin">Admin</option>
//                   <option value="user">User</option>
//                   <option value="lead">Lead</option>
//                 </select>
//                 {formErrors.role && (
//                   <p className="mt-1 text-xs text-red-500">{formErrors.role}</p>
//                 )}
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-2">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 bg-[#00183F] hover:bg-[#003580] text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                     </svg>
//                     Registering...
//                   </>
//                 ) : (
//                   'Register User'
//                 )}
//               </button>
//             </div>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterForm;


// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { registerForm, clearRegisterData, editUser, deleteUser } from './slice/registerFormSlice';
// import type { RootState } from '../../app/store';
// import axios from 'axios';

// interface FormData {
//   username: string;
//   password: string;
//   confirmPassword: string;
//   employeeid: string;
//   role: string;
//   email: string;
// }

// interface FormErrors {
//   username?: string;
//   password?: string;
//   confirmPassword?: string;
//   employeeid?: string;
//   role?: string;
//   email?: string;
// }

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   role: string;
//   employeeid: string;
// }

// const normalizeUsers = (payload: unknown): User[] => {
//   if (Array.isArray(payload)) {
//     return payload as User[];
//   }

//   if (payload && typeof payload === 'object') {
//     const candidateLists = [
//       (payload as { results?: unknown }).results,
//       (payload as { users?: unknown }).users,
//       (payload as { data?: unknown }).data,
//     ];

//     const firstArray = candidateLists.find(Array.isArray);
//     if (firstArray) {
//       return firstArray as User[];
//     }
//   }

//   console.error('Unexpected users payload:', payload);
//   return [];
// };

// const RegisterForm = () => {
//   const dispatch = useDispatch();

//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [isFormSubmitted, setIsFormSubmitted] = useState(false);
//   const [formErrors, setFormErrors] = useState<FormErrors>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   // User table state
//   const [users, setUsers] = useState<User[]>([]);
//   const [tableLoading, setTableLoading] = useState(false);
//   const [tableError, setTableError] = useState('');
//   const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

//   // Edit modal state
//   const [editUserData, setEditUserData] = useState<User | null>(null);
//   const [editSuccess, setEditSuccess] = useState('');
//   const [editErrorMsg, setEditErrorMsg] = useState('');

//   const { data, loading, editLoading, deleteLoading, editError, deleteError } = useSelector(
//     (state: RootState) => state.registerForm
//   );
//   const token = useSelector((state: RootState) => state.userLoginAuth.user.tokens?.access);

//   const [formData, setFormData] = useState<FormData>({
//     username: '',
//     password: '',
//     confirmPassword: '',
//     employeeid: '',
//     role: '',
//     email: '',
//   });

//   const fetchUsers = async () => {
//     setTableLoading(true);
//     setTableError('');
//     try {
//       const response = await axios.get('/api/users/', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(normalizeUsers(response.data));
//     } catch {
//       setUsers([]);
//       setTableError('Failed to load users.');
//     } finally {
//       setTableLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     if (isFormSubmitted) {
//       if (data?.message === 'Success') {
//         setSuccessMessage('New user registered successfully!');
//         setErrorMessage('');
//         setFormData({
//           username: '',
//           password: '',
//           confirmPassword: '',
//           employeeid: '',
//           role: '',
//           email: '',
//         });
//         dispatch(clearRegisterData());
//         setIsFormSubmitted(false);
//         fetchUsers();
//         setTimeout(() => {
//           setShowCreateModal(false);
//           setSuccessMessage('');
//         }, 1500);
//       } else if (data?.message) {
//         setErrorMessage('Registration failed. Please check your details and try again.');
//         setSuccessMessage('');
//         setIsFormSubmitted(false);
//         dispatch(clearRegisterData());
//       }
//     }
//   }, [isFormSubmitted, data, dispatch]);

//   const validate = (): boolean => {
//     const errors: FormErrors = {};
//     if (!formData.username.trim()) errors.username = 'Username is required.';
//     if (!formData.email.trim()) errors.email = 'Email is required.';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Enter a valid email address.';
//     if (!formData.password) errors.password = 'Password is required.';
//     else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters.';
//     else if (!/[A-Z]/.test(formData.password)) errors.password = 'Must contain at least one uppercase letter.';
//     else if (!/[a-z]/.test(formData.password)) errors.password = 'Must contain at least one lowercase letter.';
//     else if (!/[0-9]/.test(formData.password)) errors.password = 'Must contain at least one number.';
//     else if (!/[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/]/.test(formData.password))
//       errors.password = 'Must contain at least one special character.';
//     if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
//     else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
//     if (!formData.employeeid.trim()) errors.employeeid = 'Employee ID is required.';
//     if (!formData.role) errors.role = 'Please select a role.';
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setFormErrors(prev => ({ ...prev, [name]: undefined }));
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setSuccessMessage('');
//     setErrorMessage('');
//     if (!validate()) return;
//     const { confirmPassword, ...submitData } = formData;
//     dispatch(registerForm(submitData) as any);
//     setIsFormSubmitted(true);
//   };

//   const handleCloseModal = () => {
//     setShowCreateModal(false);
//     setFormData({
//       username: '',
//       password: '',
//       confirmPassword: '',
//       employeeid: '',
//       role: '',
//       email: '',
//     });
//     setFormErrors({});
//     setSuccessMessage('');
//     setErrorMessage('');
//   };

//   const handleDelete = async (id: number) => {
//     const result = await dispatch(deleteUser(id) as any);
//     if (deleteUser.fulfilled.match(result)) {
//       setUsers(prev => prev.filter(u => u.id !== id));
//       setDeleteConfirmId(null);
//     } else {
//       alert(deleteError || 'Failed to delete user.');
//     }
//   };

//   const handleEditSave = async () => {
//     if (!editUserData) return;
//     setEditSuccess('');
//     setEditErrorMsg('');
//     const result = await dispatch(editUser(editUserData) as any);
//     if (editUser.fulfilled.match(result)) {
//       setEditSuccess('User updated successfully!');
//       fetchUsers();
//       setTimeout(() => {
//         setEditUserData(null);
//         setEditSuccess('');
//       }, 1200);
//     } else {
//       setEditErrorMsg(editError || 'Failed to update user.');
//     }
//   };

//   const inputClass = (field: keyof FormErrors) =>
//     `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all duration-200 bg-white ${
//       formErrors[field]
//         ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
//         : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
//     }`;

//   const roleColor = (role: string) => {
//     if (role === 'admin') return 'bg-purple-100 text-purple-700';
//     if (role === 'lead') return 'bg-blue-100 text-blue-700';
//     return 'bg-green-100 text-green-700';
//   };

//   return (
//     <div className="w-full p-6">

//       {/* ── Page Header ── */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
//           <p className="text-sm text-gray-500 mt-0.5">Manage all registered users</p>
//         </div>
//         <button
//           onClick={() => setShowCreateModal(true)}
//           className="flex items-center gap-2 px-5 py-2.5 bg-[#00183F] hover:bg-[#003580] text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
//         >
//           <span className="text-lg leading-none">+</span>
//           Create New User
//         </button>
//       </div>

//       {/* ── Users Table ── */}
//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <div>
//             <h2 className="text-base font-bold text-gray-800">Registered Users</h2>
//             <p className="text-xs text-gray-500 mt-0.5">
//               {users.length} user{users.length !== 1 ? 's' : ''} found
//             </p>
//           </div>
//           <button
//             onClick={fetchUsers}
//             className="text-sm px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg border border-gray-200 transition-all"
//           >
//             ↻ Refresh
//           </button>
//         </div>

//         {tableLoading ? (
//           <div className="flex items-center justify-center py-20">
//             <svg className="animate-spin h-8 w-8 text-[#00183F]" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//             </svg>
//           </div>
//         ) : tableError ? (
//           <div className="text-center py-16 text-red-500 text-sm">{tableError}</div>
//         ) : users.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="text-4xl mb-3">👤</div>
//             <p className="text-gray-500 text-sm">No users registered yet.</p>
//             <p className="text-gray-400 text-xs mt-1">Click "Create New User" to add one.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-50 text-left">
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee ID</th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {users.map((user, index) => (
//                   <tr key={user.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 text-gray-400">{index + 1}</td>
//                     <td className="px-6 py-4 font-medium text-gray-800">{user.username}</td>
//                     <td className="px-6 py-4 text-gray-600">{user.email}</td>
//                     <td className="px-6 py-4 text-gray-600">{user.employeeid || '—'}</td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleColor(user.role)}`}>
//                         {user.role || '—'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => {
//                             setEditUserData({ ...user });
//                             setEditErrorMsg('');
//                             setEditSuccess('');
//                           }}
//                           className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium transition-all"
//                         >
//                           ✎ Edit
//                         </button>
//                         <button
//                           onClick={() => setDeleteConfirmId(user.id)}
//                           className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-all"
//                         >
//                           🗑 Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ── Create New User Modal ── */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//             <div className="bg-gradient-to-r from-[#00183F] to-[#003580] px-6 py-5 rounded-t-2xl flex items-center justify-between">
//               <div>
//                 <h2 className="text-xl font-bold text-white">Create New User</h2>
//                 <p className="text-blue-200 text-xs mt-0.5">Fill in the details to register a new account</p>
//               </div>
//               <button
//                 onClick={handleCloseModal}
//                 className="text-white/70 hover:text-white text-2xl leading-none transition-colors"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="px-6 py-5">
//               {successMessage && (
//                 <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
//                   <span>✔</span> {successMessage}
//                 </div>
//               )}
//               {errorMessage && (
//                 <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
//                   <span>✕</span> {errorMessage}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} noValidate className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//                   <input
//                     type="text" name="username" placeholder="Enter username"
//                     value={formData.username} onChange={handleChange} className={inputClass('username')}
//                   />
//                   {formErrors.username && <p className="mt-1 text-xs text-red-500">{formErrors.username}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                   <input
//                     type="email" name="email" placeholder="Enter email address"
//                     value={formData.email} onChange={handleChange} className={inputClass('email')}
//                   />
//                   {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter password"
//                       value={formData.password} onChange={handleChange} className={inputClass('password')}
//                     />
//                     <button
//                       type="button" onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//                     >
//                       {showPassword ? 'Hide' : 'Show'}
//                     </button>
//                   </div>
//                   {formErrors.password && <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//                   <div className="relative">
//                     <input
//                       type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
//                       placeholder="Confirm password" value={formData.confirmPassword}
//                       onChange={handleChange} className={inputClass('confirmPassword')}
//                     />
//                     <button
//                       type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//                     >
//                       {showConfirmPassword ? 'Hide' : 'Show'}
//                     </button>
//                   </div>
//                   {formErrors.confirmPassword && (
//                     <p className="mt-1 text-xs text-red-500">{formErrors.confirmPassword}</p>
//                   )}
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
//                     <input
//                       type="text" name="employeeid" placeholder="e.g. EMP001"
//                       value={formData.employeeid} onChange={handleChange} className={inputClass('employeeid')}
//                     />
//                     {formErrors.employeeid && <p className="mt-1 text-xs text-red-500">{formErrors.employeeid}</p>}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//                     <select
//                       name="role" value={formData.role} onChange={handleChange}
//                       className={`${inputClass('role')} cursor-pointer`}
//                     >
//                       <option value="">Select role</option>
//                       <option value="admin">Admin</option>
//                       <option value="user">User</option>
//                       <option value="lead">Lead</option>
//                     </select>
//                     {formErrors.role && <p className="mt-1 text-xs text-red-500">{formErrors.role}</p>}
//                   </div>
//                 </div>
//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="button" onClick={handleCloseModal}
//                     className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit" disabled={loading}
//                     className="flex-1 py-2.5 bg-[#00183F] hover:bg-[#003580] text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
//                   >
//                     {loading ? (
//                       <>
//                         <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                         </svg>
//                         Registering...
//                       </>
//                     ) : 'Register User'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Delete Confirmation Modal ── */}
//       {deleteConfirmId !== null && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
//             <div className="text-center">
//               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
//                 🗑
//               </div>
//               <h3 className="text-lg font-bold text-gray-800 mb-2">Delete User</h3>
//               <p className="text-sm text-gray-500 mb-6">Are you sure? This action cannot be undone.</p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setDeleteConfirmId(null)}
//                   className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleDelete(deleteConfirmId)}
//                   disabled={deleteLoading}
//                   className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-60"
//                 >
//                   {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Edit Modal ── */}
//       {editUserData && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
//             <div className="bg-gradient-to-r from-[#00183F] to-[#003580] px-6 py-4 rounded-t-2xl flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg font-bold text-white">Edit User</h3>
//                 <p className="text-blue-200 text-xs mt-0.5">Update user details</p>
//               </div>
//               <button
//                 onClick={() => { setEditUserData(null); setEditErrorMsg(''); setEditSuccess(''); }}
//                 className="text-white/70 hover:text-white text-2xl leading-none"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="p-6 space-y-4">
//               {editSuccess && (
//                 <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
//                   ✔ {editSuccess}
//                 </div>
//               )}
//               {editErrorMsg && (
//                 <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//                   ✕ {editErrorMsg}
//                 </div>
//               )}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//                 <input
//                   type="text" value={editUserData.username}
//                   onChange={e => setEditUserData({ ...editUserData, username: e.target.value })}
//                   className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email" value={editUserData.email}
//                   onChange={e => setEditUserData({ ...editUserData, email: e.target.value })}
//                   className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
//                   <input
//                     type="text" value={editUserData.employeeid}
//                     onChange={e => setEditUserData({ ...editUserData, employeeid: e.target.value })}
//                     className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//                   <select
//                     value={editUserData.role}
//                     onChange={e => setEditUserData({ ...editUserData, role: e.target.value })}
//                     className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white cursor-pointer"
//                   >
//                     <option value="admin">Admin</option>
//                     <option value="user">User</option>
//                     <option value="lead">Lead</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <button
//                   onClick={() => { setEditUserData(null); setEditErrorMsg(''); setEditSuccess(''); }}
//                   className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleEditSave}
//                   disabled={editLoading}
//                   className="flex-1 py-2.5 bg-[#00183F] hover:bg-[#003580] text-white rounded-lg text-sm font-medium transition-all disabled:opacity-60"
//                 >
//                   {editLoading ? 'Saving...' : 'Save Changes'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default RegisterForm;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerForm, clearRegisterData, editUser, deleteUser } from './slice/registerFormSlice';
import type { RootState } from '../../app/store';
import axiosInstance from '../../app/axiosInstance';
import { Users } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  username: string; password: string; confirmPassword: string;
  employeeid: string; role: string; email: string;
}

interface FormErrors {
  username?: string; password?: string; confirmPassword?: string;
  employeeid?: string; role?: string; email?: string;
}

interface User {
  id: number; username: string; email: string; role: string; employeeid: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normalizeUsers = (payload: unknown): User[] => {
  if (Array.isArray(payload)) return payload as User[];
  if (payload && typeof payload === 'object') {
    const candidateLists = [
      (payload as { results?: unknown }).results,
      (payload as { users?: unknown }).users,
      (payload as { data?: unknown }).data,
    ];
    const firstArray = candidateLists.find(Array.isArray);
    if (firstArray) return firstArray as User[];
  }
  console.error('Unexpected users payload:', payload);
  return [];
};

// ─── Component ────────────────────────────────────────────────────────────────

const RegisterForm = () => {
  const dispatch = useDispatch();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [users, setUsers] = useState<User[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [editUserData, setEditUserData] = useState<User | null>(null);
  const [editSuccess, setEditSuccess] = useState('');
  const [editErrorMsg, setEditErrorMsg] = useState('');

  const { data, loading, editLoading, deleteLoading, editError, deleteError } = useSelector(
    (state: RootState) => state.registerForm
  );
  const [formData, setFormData] = useState<FormData>({
    username: '', password: '', confirmPassword: '', employeeid: '', role: '', email: '',
  });

  const fetchUsers = async () => {
    setTableLoading(true);
    setTableError('');
    try {
      const response = await axiosInstance.get('/users/');
      setUsers(normalizeUsers(response.data));
    } catch {
      setUsers([]);
      setTableError('Failed to load users.');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (isFormSubmitted) {
      if (data?.message === 'Success') {
        setSuccessMessage('New user registered successfully!');
        setErrorMessage('');
        setFormData({ username: '', password: '', confirmPassword: '', employeeid: '', role: '', email: '' });
        dispatch(clearRegisterData());
        setIsFormSubmitted(false);
        fetchUsers();
        setTimeout(() => { setShowCreateModal(false); setSuccessMessage(''); }, 1500);
      } else if (data?.message) {
        setErrorMessage(data.message);
        setSuccessMessage('');
        setIsFormSubmitted(false);
        dispatch(clearRegisterData());
      }
    }
  }, [isFormSubmitted, data, dispatch]);

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.username.trim()) errors.username = 'Username is required.';
    if (!formData.email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Enter a valid email address.';
    if (!formData.password) errors.password = 'Password is required.';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters.';
    else if (!/[A-Z]/.test(formData.password)) errors.password = 'Must contain at least one uppercase letter.';
    else if (!/[a-z]/.test(formData.password)) errors.password = 'Must contain at least one lowercase letter.';
    else if (!/[0-9]/.test(formData.password)) errors.password = 'Must contain at least one number.';
    else if (!/[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/]/.test(formData.password)) errors.password = 'Must contain at least one special character.';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    if (!formData.employeeid.trim()) errors.employeeid = 'Employee ID is required.';
    if (!formData.role) errors.role = 'Please select a role.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    if (!validate()) return;
    const { confirmPassword, ...submitData } = formData;
    dispatch(registerForm(submitData) as any);
    setIsFormSubmitted(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({ username: '', password: '', confirmPassword: '', employeeid: '', role: '', email: '' });
    setFormErrors({});
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleDelete = async (id: number) => {
    const result = await dispatch(deleteUser(id) as any);
    if (deleteUser.fulfilled.match(result)) {
      setUsers(prev => prev.filter(u => u.id !== id));
      setDeleteConfirmId(null);
    } else {
      alert(deleteError || 'Failed to delete user.');
    }
  };

  const handleEditSave = async () => {
    if (!editUserData) return;
    setEditSuccess('');
    setEditErrorMsg('');
    const result = await dispatch(editUser(editUserData) as any);
    if (editUser.fulfilled.match(result)) {
      setEditSuccess('User updated successfully!');
      fetchUsers();
      setTimeout(() => { setEditUserData(null); setEditSuccess(''); }, 1200);
    } else {
      setEditErrorMsg(editError || 'Failed to update user.');
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-3 py-2.5 rounded-xl border-2 text-sm outline-none transition-all duration-200 bg-white font-medium ${
      formErrors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
        : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
    }`;

  const roleColor = (role: string) => {
    if (role === 'admin') return 'bg-purple-100 text-purple-700 border border-purple-200';
    if (role === 'lead') return 'bg-blue-100 text-blue-700 border border-blue-200';
    return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
  };

  const editInputClass = "w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white font-medium transition-all";

  return (
    <div className="w-full p-6 flex flex-col gap-5">


{/* ── Page Header ── */}
<div className="flex items-center justify-between flex-wrap gap-4">
  <div className="flex items-center gap-4">
    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
      <Users size={28} color="white" />
    </div>
    <div>
      <h1 className="text-3xl font-bold text-indigo-700 m-0">User Management</h1>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="text-slate-400 text-sm">↗</span>
        <p className="text-sm text-slate-500 m-0">Manage all registered users</p>
      </div>
    </div>
  </div>
  <button
    onClick={() => setShowCreateModal(true)}
    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-xl whitespace-nowrap"
  >
    <span className="text-lg leading-none">+</span>
    Create New User
  </button>
</div>

      {/* ── Users Table ── */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">

        {/* Table top bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
            <span className="text-sm font-bold text-slate-800">Registered Users</span>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {users.length} user{users.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={fetchUsers}
            className="text-sm px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-all font-medium"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Table Header */}
        <div className="grid px-4 py-3 mx-3 mb-1 rounded-xl bg-gradient-to-r from-indigo-700 to-blue-600 text-[10.5px] font-bold uppercase tracking-widest text-white/90"
          style={{ gridTemplateColumns: '48px 1fr 1.5fr 1fr 0.8fr 1fr' }}>
          <span>#</span>
          <span>Username</span>
          <span>Email</span>
          <span>Employee ID</span>
          <span>Role</span>
          <span>Actions</span>
        </div>

        {tableLoading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : tableError ? (
          <div className="text-center py-16 text-red-500 text-sm">{tableError}</div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl">👤</div>
            <p className="text-sm font-bold text-slate-600 m-0">No users registered yet.</p>
            <p className="text-xs text-slate-400 m-0">Click "Create New User" to add one.</p>
          </div>
        ) : (
          <div className="pb-2">
            {users.map((user, index) => (
              <div
                key={user.id}
                className="grid px-4 py-3.5 mx-3 mb-1 rounded-xl items-center hover:bg-indigo-50/60 transition-colors border border-transparent hover:border-slate-200/50"
                style={{ gridTemplateColumns: '48px 1fr 1.5fr 1fr 0.8fr 1fr' }}
              >
                <span className="text-xs font-bold text-slate-600">{index + 1}</span>
                <span className="text-sm font-bold text-slate-800 truncate">{user.username}</span>
                <span className="text-sm text-slate-600 truncate">{user.email}</span>
                <span className="text-sm text-slate-600">{user.employeeid || '—'}</span>
                <span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${roleColor(user.role)}`}>
                    {user.role || '—'}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditUserData({ ...user }); setEditErrorMsg(''); setEditSuccess(''); }}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition-all border border-indigo-200"
                  >
                    ✎ Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(user.id)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all border border-red-200"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create New User Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border-2 border-indigo-100">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users size={15} color="white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white m-0">Create New User</h2>
                  <p className="text-indigo-100 text-xs mt-0.5 m-0">Fill in the details to register a new account</p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xl leading-none transition-colors">×</button>
            </div>

            <div className="px-6 py-5">
              {successMessage && (
                <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-2">
                  <span>✔</span> {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                  <span>✕</span> {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Username</label>
                  <input type="text" name="username" placeholder="Enter username" value={formData.username} onChange={handleChange} className={inputClass('username')} />
                  {formErrors.username && <p className="text-xs text-red-500 m-0">{formErrors.username}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Email</label>
                  <input type="email" name="email" placeholder="Enter email address" value={formData.email} onChange={handleChange} className={inputClass('email')} />
                  {formErrors.email && <p className="text-xs text-red-500 m-0">{formErrors.email}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} className={inputClass('password')} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 text-xs font-semibold transition-colors">
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {formErrors.password && <p className="text-xs text-red-500 m-0">{formErrors.password}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} className={inputClass('confirmPassword')} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 text-xs font-semibold transition-colors">
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {formErrors.confirmPassword && <p className="text-xs text-red-500 m-0">{formErrors.confirmPassword}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Employee ID</label>
                    <input type="text" name="employeeid" placeholder="e.g. EMP001" value={formData.employeeid} onChange={handleChange} className={inputClass('employeeid')} />
                    {formErrors.employeeid && <p className="text-xs text-red-500 m-0">{formErrors.employeeid}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className={`${inputClass('role')} cursor-pointer [&>option]:text-slate-800`}>
                      <option value="">Select role</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="lead">Lead</option>
                    </select>
                    {formErrors.role && <p className="text-xs text-red-500 m-0">{formErrors.role}</p>}
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={handleCloseModal} className="flex-1 py-2.5 border-2 border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-lg">
                    {loading ? (
                      <><svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Registering...</>
                    ) : 'Register User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 border-2 border-red-100">
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🗑</div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Delete User</h3>
              <p className="text-sm text-slate-500 mb-6">Are you sure? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 border-2 border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirmId)} disabled={deleteLoading} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-60 shadow-md shadow-red-200">
                  {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editUserData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 border-2 border-indigo-100">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white text-xs font-bold">✎</div>
                <div>
                  <h3 className="text-sm font-bold text-white m-0">Edit User</h3>
                  <p className="text-indigo-100 text-xs m-0">Update user details</p>
                </div>
              </div>
              <button onClick={() => { setEditUserData(null); setEditErrorMsg(''); setEditSuccess(''); }} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xl leading-none transition-colors">×</button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {editSuccess && <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">✔ {editSuccess}</div>}
              {editErrorMsg && <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">✕ {editErrorMsg}</div>}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Username</label>
                <input type="text" value={editUserData.username} onChange={e => setEditUserData({ ...editUserData, username: e.target.value })} className={editInputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input type="email" value={editUserData.email} onChange={e => setEditUserData({ ...editUserData, email: e.target.value })} className={editInputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Employee ID</label>
                  <input type="text" value={editUserData.employeeid} onChange={e => setEditUserData({ ...editUserData, employeeid: e.target.value })} className={editInputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Role</label>
                  <select value={editUserData.role} onChange={e => setEditUserData({ ...editUserData, role: e.target.value })} className={`${editInputClass} cursor-pointer [&>option]:text-slate-800`}>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setEditUserData(null); setEditErrorMsg(''); setEditSuccess(''); }} className="flex-1 py-2.5 border-2 border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">Cancel</button>
                <button onClick={handleEditSave} disabled={editLoading} className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-60 shadow-md shadow-indigo-200 hover:-translate-y-0.5">
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RegisterForm;
