//                   <p className={styles.cardDesc}>
//                     Calculation based on Rank A sales and Rank A lead conversions · {formatFYLabel(reportFilterYear)}
//                   </p>
//                 </div>

//                 {/* ✅ NEW: FY Filter dropdown */}
//                 <div className={styles.fyFilterWrap}>
//                   <Calendar size={14} color="#4F46E5" />
//                   <select 
//                     className={styles.fySelect}
//                     value={reportFilterYear} 
//                     onChange={e => setReportFilterYear(Number(e.target.value))}
//                   >
//                     {fyOptions.map(y => (
//                       <option key={y} value={y}>{formatFYLabel(y)}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <button onClick={() => dispatch(fetchAttainmentReport(reportFilterYear))} className={styles.eyeBtn} style={{ marginLeft: 8 }}>
//                   <RefreshCw size={16} className={perfLoading ? 'animate-spin' : ''}/>
//                 </button>
//               </div>

//               <div className={styles.tableWrapper}>
//                 <table className={styles.attainmentTable}>
//                   <thead>
//                     <tr>
//                       <th>Employee</th>
//                       <th>Target Quota</th>
//                       <th>Actual Sales</th>
//                       <th>Success Rate %</th>
//                       <th>Lead Conversion</th>
//                       <th>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {reportData.length === 0 ? (
//                       <tr>
//                         <td colSpan={6} style={{ textAlign: 'center', color: '#94A3B8', padding: '24px' }}>
//                           {perfLoading ? 'Loading...' : `No data found for ${formatFYLabel(reportFilterYear)}.`}
//                         </td>
//                       </tr>
//                     ) : (
//                       reportData.map((row) => (
//                         <tr key={row.user_id}>
//                           <td>
//                             <div className={styles.empInfo}>
//                               <div className={styles.empAvatar}>{row.username.charAt(0).toUpperCase()}</div>
//                               <strong>{row.full_name}</strong>
//                             </div>
//                           </td>
//                           <td>₹{(row.target / 100000).toFixed(1)}L</td>
//                           <td>₹{(row.actual_sales / 100000).toFixed(1)}L</td>
//                           <td>
//                             <div className={styles.pctText} style={{ color: row.sales_success_rate >= 100 ? '#10B981' : '#4F46E5' }}>
//                               {row.sales_success_rate}%
//                             </div>
//                           </td>
//                           <td>
//                             <span className={styles.funnelBadge}>
//                               {row.converted_leads}/{row.total_leads} Leads ({row.funnel_conv_rate}%)
//                             </span>
//                           </td>
//                           <td>
//                               <span className={row.sales_success_rate >= 100 ? styles.badgeSuccess : styles.badgeWarning}>
//                                   {row.sales_success_rate >= 100 ? 'Achieved' : 'In Progress'}
//                               </span>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               <div className={styles.perfFooter}>
//                 <Info size={12} /> Success Rate = (Rank A Sales / Quota) · Funnel Rate = (Rank A Leads / Total Leads) · {formatFYLabel(reportFilterYear)}
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default Settings;


// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   Target, Award, Save, RefreshCw, BarChart2,
//   Settings as SettingsIcon, ShieldCheck,
//   Info, Calendar, Plus, Trash2, X, ChevronDown, ChevronUp, RotateCcw, Check, AlertCircle, Layers, MapPin, Briefcase, Building, CheckSquare,
// } from 'lucide-react';
// import type { AppDispatch, RootState } from '../../../app/store';
// import {
//   changePassword,
//   clearSettingsState,
//   fetchPerfEmployees,
//   fetchAttainmentReport,
//   savePerformanceQuota,
// } from './slice/settingsSlice';
// import {
//   resetAccountFormSettings,
//   updateAccountFormSettings,
//   fetchAccountFormSettings,
//   type VerticalOption,
//   type DesignationOption,
// } from '../../FormSettings/formSettingsSlice';
// import {
//   fetchGlobalCategories,
//   addGlobalCategory,
//   addGlobalSubCategory,
//   deleteGlobalCategory,
//   deleteGlobalSubCategory,
// } from '../../Budget/slice/budgetSlice';
// import { getAllCities } from '../../CommonAPI/Common';

// // ── Eye Icons ─────────────────────────────────────────────────────────────────
// const EyeOpen = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
//     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//     <circle cx="12" cy="12" r="3" />
//   </svg>
// );

// const EyeOff = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
//     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
//     <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
//     <line x1="1" x2="23" y2="23" />
//   </svg>
// );

// // ── Types ─────────────────────────────────────────────────────────────────────
// interface PasswordForm { old_password: string; new_password: string; confirm_password: string; }
// interface ShowFields { old_password: boolean; new_password: boolean; confirm_password: boolean; }

// // ── Helpers ───────────────────────────────────────────────────────────────────
// const getCurrentFY = (): number => {
//   const today = new Date();
//   const month = today.getMonth() + 1;
//   return month >= 4 ? today.getFullYear() : today.getFullYear() - 1;
// };

// const getFYOptions = (): number[] => {
//   const current = getCurrentFY();
//   return [current - 3, current - 2, current - 1, current, current + 1, current + 2];
// };

// const formatFYLabel = (year: number): string =>
//   `FY ${year}–${String(year + 1).slice(2)}`;

// // ── Password strength ─────────────────────────────────────────────────────────
// const getStrength = (pw: string): { level: number; label: string; color: string; tailwind: string } => {
//   if (!pw) return { level: 0, label: '', color: '', tailwind: '' };
//   let s = 0;
//   if (pw.length >= 8) s++;
//   if (pw.length >= 12) s++;
//   if (/[A-Z]/.test(pw)) s++;
//   if (/[0-9]/.test(pw)) s++;
//   if (/[^A-Za-z0-9]/.test(pw)) s++;
//   if (s <= 2) return { level: 1, label: 'Weak',   color: '#EF4444', tailwind: 'bg-red-500'    };
//   if (s <= 3) return { level: 2, label: 'Fair',   color: '#F59E0B', tailwind: 'bg-amber-400'  };
//   if (s <= 4) return { level: 3, label: 'Good',   color: '#3B82F6', tailwind: 'bg-blue-500'   };
//   return             { level: 4, label: 'Strong', color: '#10B981', tailwind: 'bg-emerald-500' };
// };

// const DOT_COLORS = ['#6366F1', '#0D9488', '#EA580C', '#7C3AED', '#0284C7', '#059669'];

// // ── Shared style helpers ──────────────────────────────────────────────────────
// const inputBase =
//   'w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 bg-white/95 text-sm text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200';

// // ── Card shell ────────────────────────────────────────────────────────────────
// const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
//   <div className={`bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.08)] hover:shadow-[0_16px_34px_rgba(15,23,42,0.12)] transition-shadow duration-300 overflow-hidden ${className}`}>
//     {children}
//   </div>
// );

// // ── Card gradient header ──────────────────────────────────────────────────────
// const CardHeader: React.FC<{
//   gradient: string;
//   icon: React.ReactNode;
//   title: string;
//   desc?: string;
//   right?: React.ReactNode;
// }> = ({ gradient, icon, title, desc, right }) => (
//   <div className={`${gradient} px-5 py-4 flex items-center gap-3`}>
//     <div className="w-9 h-9 bg-white/20 ring-1 ring-white/30 rounded-xl flex items-center justify-center shrink-0">
//       {icon}
//     </div>
//     <div className="flex-1 min-w-0">
//       <h2 className="text-sm font-extrabold tracking-wide text-white m-0 leading-tight">{title}</h2>
//       {desc && <p className="text-white/80 text-xs m-0 mt-0.5">{desc}</p>}
//     </div>
//     {right && <div className="shrink-0">{right}</div>}
//   </div>
// );

// // ── Component ─────────────────────────────────────────────────────────────────
// const Settings: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   // -- Selectors --
//   const { loading, error, success, employees, reportData, perfLoading } = useSelector(
//     (state: RootState) => state.settings
//   );
//   const authUser =
//     useSelector((state: RootState) => (state as any).auth?.user) ||
//     useSelector((state: RootState) => (state as any).userLoginAuth?.user);
//   const { categories: globalCategories } = useSelector((state: RootState) => state.budget);

//   const isAdmin = authUser?.role === 'admin';

//   // -- Component States --
//   const [form, setForm] = useState<PasswordForm>({ old_password: '', new_password: '', confirm_password: '' });
//   const [show, setShow] = useState<ShowFields>({ old_password: false, new_password: false, confirm_password: false });
//   const [activeTab, setActiveTab] = useState<'password' | 'profile' | 'categories' | 'formFields' | 'performance'>('password');
//   const [localError, setLocalError] = useState('');

//   // ── Category state ──
//   const [newCatName, setNewCatName] = useState('');
//   const [newSubNames, setNewSubNames] = useState<Record<number, string>>({});
//   const [catLoading, setCatLoading] = useState(false);
//   const [catError, setCatError] = useState('');

//   // ── Performance Management State ──
//   const [quotaForm, setQuotaForm] = useState({ userId: '', amount: '', year: getCurrentFY() });
//   const [reportFilterYear, setReportFilterYear] = useState<number>(getCurrentFY());
//   const accountFormSettings = useSelector((state: RootState) => state.formSettings.account);
//   // ── Interactive Form Fields State ──
//   const [localVerticals, setLocalVerticals] = useState<VerticalOption[]>([]);
//   const [localRegions, setLocalRegions] = useState<string[]>([]);
//   const [localDepartments, setLocalDepartments] = useState<string[]>([]);
//   const [localBusinessTypes, setLocalBusinessTypes] = useState<string[]>([]);
//   const [localDesignations, setLocalDesignations] = useState<DesignationOption[]>([]);
//   const [localRequiredFields, setLocalRequiredFields] = useState<string[]>([]);
//   const [localSalesTypes, setLocalSalesTypes] = useState<string[]>([]);
//   const [localOpportunities, setLocalOpportunities] = useState<string[]>([]);
//   const [localProductCategories, setLocalProductCategories] = useState<VerticalOption[]>([]);
//   const [localStates, setLocalStates] = useState<string[]>([]);
//   const [localCities, setLocalCities] = useState<string[]>([]);
//   const [localStateCities, setLocalStateCities] = useState<Record<string, string[]>>({});
//   const [localNextActions, setLocalNextActions] = useState<string[]>([]);

//   // Inputs for adding new options
//   const [newVerticalName, setNewVerticalName] = useState('');
//   const [newSubdivisionNames, setNewSubdivisionNames] = useState<Record<string, string>>({});
//   const [expandedVerticals, setExpandedVerticals] = useState<Record<string, boolean>>({});
//   const [newRegionName, setNewRegionName] = useState('');
//   const [newDepartmentName, setNewDepartmentName] = useState('');
//   const [newBusinessTypeName, setNewBusinessTypeName] = useState('');
//   const [newDesignationTitle, setNewDesignationTitle] = useState('');
//   const [newDesignationAbbreviation, setNewDesignationAbbreviation] = useState('');
//   const [newRequiredFieldName, setNewRequiredFieldName] = useState('');
//   const [activeModal, setActiveModal] = useState<'verticals' | 'regions' | 'departments' | 'businessTypes' | 'designations' | 'requiredFields' | 'productCategories' | 'salesTypes' | 'opportunities' | 'states' | 'cities' | 'nextActions' | null>(null);
//   const [selectedVerticalForSubs, setSelectedVerticalForSubs] = useState<string | null>(null);
//   const [selectedOpportunityForProductTree, setSelectedOpportunityForProductTree] = useState<string | null>(null);
//   const [selectedProductCategoryLevel1, setSelectedProductCategoryLevel1] = useState<string | null>(null);
//   const [selectedProductCategoryLevel2, setSelectedProductCategoryLevel2] = useState<string | null>(null);
//   const [newSalesType, setNewSalesType] = useState('');
//   const [newOpportunity, setNewOpportunity] = useState('');
//   const [newProductCategory1Name, setNewProductCategory1Name] = useState('');
//   const [newProductCategory2Name, setNewProductCategory2Name] = useState('');
//   const [newProductCategory3Name, setNewProductCategory3Name] = useState('');
//   const [newSettingsState, setNewSettingsState] = useState('');
//   const [newCity, setNewCity] = useState('');
//   const [newNextAction, setNewNextAction] = useState('');
//   const [verticalText, setVerticalText] = useState('');
//   const [regionText, setRegionText] = useState('');
//   const [departmentText, setDepartmentText] = useState('');
//   const [businessTypeText, setBusinessTypeText] = useState('');
//   const [designationText, setDesignationText] = useState('');
//   const [requiredFieldText, setRequiredFieldText] = useState('');
//   const [salesTypeText, setSalesTypeText] = useState('');
//   const [opportunityText, setOpportunityText] = useState('');
//   const [productCategoryText, setProductCategoryText] = useState('');
//   const [stateText, setStateText] = useState('');
//   const [cityText, setCityText] = useState('');
//   const [nextActionText, setNextActionText] = useState('');
//   const [fieldSaveMsg, setFieldSaveMsg] = useState('');

//   // ── Validation ──
//   const validatePassword = (pw: string): string => {
//     if (pw.length < 8) return 'Password must be at least 8 characters long.';
//     if (!/[A-Z]/.test(pw)) return 'Password must contain at least one uppercase letter.';
//     if (!/[a-z]/.test(pw)) return 'Password must contain at least one lowercase letter.';
//     if (!/[0-9]/.test(pw)) return 'Password must contain at least one number.';
//     if (!/[^A-Za-z0-9]/.test(pw)) return 'Password must contain at least one special character (!@#$%^&*).';
//     return '';
//   };

//   const serializeProductCategories = (categories: VerticalOption[]) => {
//     const lines: string[] = [];
//     categories.forEach((opportunity) => {
//       const level1 = opportunity.subdivisions || [];
//       if (!level1.length) {
//         lines.push(opportunity.category);
//         return;
//       }
//       level1.forEach((cat1) => {
//         const level2 = cat1.subdivisions || [];
//         if (!level2.length) {
//           lines.push(`${opportunity.category} > ${cat1.category}`);
//           return;
//         }
//         level2.forEach((cat2) => {
//           const level3 = cat2.subdivisions || [];
//           if (!level3.length) {
//             lines.push(`${opportunity.category} > ${cat1.category} > ${cat2.category}`);
//             return;
//           }
//           level3.forEach((cat3) => {
//             lines.push(`${opportunity.category} > ${cat1.category} > ${cat2.category} > ${cat3.category}`);
//           });
//         });
//       });
//     });
//     return lines.join('\n');
//   };

//   useEffect(() => () => { dispatch(clearSettingsState()); }, [dispatch]);

//   useEffect(() => {
//     if (success) {
//       const t = setTimeout(() => dispatch(clearSettingsState()), 4000);
//       return () => clearTimeout(t);
//     }
//   }, [success, dispatch]);

//   useEffect(() => {
//     if (activeTab === 'formFields') {
//       dispatch(fetchAccountFormSettings() as any);
//     }
//     if (activeTab === 'categories') dispatch(fetchGlobalCategories());
//     if (activeTab === 'performance' && isAdmin) {
//       dispatch(fetchPerfEmployees());
//       dispatch(fetchAttainmentReport(reportFilterYear));
//     }
//   }, [activeTab, isAdmin, dispatch, reportFilterYear]);

//   useEffect(() => {
//     const toVerticalLine = (vertical: VerticalOption) =>
//       `${vertical.category}${vertical.subdivisions?.length ? `: ${vertical.subdivisions.map((s) => s.category).join(', ')}` : ''}`;
//     setLocalVerticals(accountFormSettings.verticals || []);
//     setLocalRegions(accountFormSettings.regions || []);
//     setLocalDepartments(accountFormSettings.departments || []);
//     setLocalBusinessTypes(accountFormSettings.businessTypes || []);
//     setLocalDesignations(accountFormSettings.designations || []);
//     setLocalRequiredFields(accountFormSettings.requiredFields || []);
//     setLocalSalesTypes(accountFormSettings.salesTypes || []);
//     setLocalOpportunities(accountFormSettings.opportunities || []);
//     setLocalProductCategories(accountFormSettings.productCategories || []);
//     setLocalStates(accountFormSettings.states || []);
//     setLocalCities(accountFormSettings.cities || []);
//     setLocalStateCities(accountFormSettings.stateCities || {});
//     setLocalNextActions(accountFormSettings.nextActions || []);
//     setSalesTypeText((accountFormSettings.salesTypes || []).join('\n'));
//     setOpportunityText((accountFormSettings.opportunities || []).join('\n'));
//     setProductCategoryText(serializeProductCategories(accountFormSettings.productCategories || []));
//     setStateText((accountFormSettings.states || []).join('\n'));
//     setCityText((accountFormSettings.cities || []).join('\n'));
//     setNextActionText((accountFormSettings.nextActions || []).join('\n'));
//     // Bypassed old text setters for interactive UI state




//   }, [accountFormSettings]);


//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//     if (localError) setLocalError('');
//     if (error || success) dispatch(clearSettingsState());
//   };

//   const toggleShow = (f: keyof ShowFields) => setShow(prev => ({ ...prev, [f]: !prev[f] }));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const validationError = validatePassword(form.new_password);
//     if (validationError) { setLocalError(validationError); return; }
//     if (form.new_password !== form.confirm_password) { setLocalError('Passwords do not match.'); return; }
//     const result = await dispatch(changePassword(form));
//     if (changePassword.fulfilled.match(result)) {
//       setForm({ old_password: '', new_password: '', confirm_password: '' });
//       setLocalError('');
//     }
//   };

//   // ── Category handlers ─────────────────────────────────────────────────────
//   const handleAddCategory = async () => {
//     const name = newCatName.trim();
//     if (!name) return;
//     setCatLoading(true); setCatError('');
//     try { await dispatch(addGlobalCategory(name)); setNewCatName(''); }
//     catch { setCatError('Failed to add category.'); }
//     finally { setCatLoading(false); }
//   };

//   const handleAddSubCategory = async (catId: number) => {
//     const name = (newSubNames[catId] || '').trim();
//     if (!name) return;
//     setCatLoading(true); setCatError('');
//     try {
//       await dispatch(addGlobalSubCategory({ categoryId: catId, name }));
//       setNewSubNames(prev => ({ ...prev, [catId]: '' }));
//     } catch { setCatError('Failed to add subcategory.'); }
//     finally { setCatLoading(false); }
//   };

//   const handleDeleteCategory = async (id: number) => {
//     if (!window.confirm('Delete this category and all its subcategories?')) return;
//     setCatLoading(true);
//     try { await dispatch(deleteGlobalCategory(id)); }
//     finally { setCatLoading(false); }
//   };

//   const handleDeleteSubCategory = async (id: number) => {
//     setCatLoading(true);
//     try { await dispatch(deleteGlobalSubCategory(id)); }
//     finally { setCatLoading(false); }
//   };

//   // ── Performance handlers ──────────────────────────────────────────────────
//   const handleSaveQuota = async () => {
//     if (!quotaForm.userId || !quotaForm.amount) return;
//     const result = await dispatch(savePerformanceQuota({
//       user_id: quotaForm.userId,
//       target_amount: quotaForm.amount,
//       year: quotaForm.year,
//     }));
//     if (savePerformanceQuota.fulfilled.match(result)) {
//       dispatch(fetchAttainmentReport(reportFilterYear));
//       setQuotaForm({ ...quotaForm, amount: '', userId: '' });
//     }
//   };

//   const parseList = (value: string) =>
//     value.split('\n').map((line) => line.trim()).filter(Boolean);

//   const uniqueSorted = (items: string[]) =>
//     [...new Set(items.map((item) => item.trim()).filter(Boolean))]
//       .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

//   // ── Interactive Form Field Action Handlers ──
//   const handleAddVertical = () => {
//     const val = newVerticalName.trim();
//     if (!val) return;
//     if (localVerticals.some(v => v.category.toLowerCase() === val.toLowerCase())) {
//       alert('Vertical category already exists!');
//       return;
//     }
//     setLocalVerticals([...localVerticals, { category: val, subdivisions: [] }]);
//     setNewVerticalName('');
//     setExpandedVerticals(prev => ({ ...prev, [val]: true }));
//   };

//   const handleDeleteVertical = (categoryName: string) => {
//     if (window.confirm(`Delete the vertical "${categoryName}" and all its subdivisions?`)) {
//       setLocalVerticals(localVerticals.filter(v => v.category !== categoryName));
//     }
//   };

//   const handleAddSubdivision = (categoryName: string) => {
//     const subVal = (newSubdivisionNames[categoryName] || '').trim();
//     if (!subVal) return;
//     setLocalVerticals(localVerticals.map(v => {
//       if (v.category === categoryName) {
//         const subs = v.subdivisions || [];
//         if (subs.some(s => s.category.toLowerCase() === subVal.toLowerCase())) {
//           alert('Subdivision already exists in this vertical!');
//           return v;
//         }
//         return {
//           ...v,
//           subdivisions: [...subs, { category: subVal }]
//         };
//       }
//       return v;
//     }));
//     setNewSubdivisionNames(prev => ({ ...prev, [categoryName]: '' }));
//   };

//   const handleDeleteSubdivision = (categoryName: string, subCategoryName: string) => {
//     setLocalVerticals(localVerticals.map(v => {
//       if (v.category === categoryName) {
//         return {
//           ...v,
//           subdivisions: (v.subdivisions || []).filter(s => s.category !== subCategoryName)
//         };
//       }
//       return v;
//     }));
//   };

//   const handleAddRegion = () => {
//     const val = newRegionName.trim();
//     if (!val) return;
//     if (localRegions.some(r => r.toLowerCase() === val.toLowerCase())) {
//       alert('Region already exists!');
//       return;
//     }
//     setLocalRegions([...localRegions, val]);
//     setNewRegionName('');
//   };

//   const handleDeleteRegion = (region: string) => {
//     setLocalRegions(localRegions.filter(r => r !== region));
//   };

//   const handleAddDepartment = () => {
//     const val = newDepartmentName.trim();
//     if (!val) return;
//     if (localDepartments.some(d => d.toLowerCase() === val.toLowerCase())) {
//       alert('Department already exists!');
//       return;
//     }
//     setLocalDepartments([...localDepartments, val]);
//     setNewDepartmentName('');
//   };

//   const handleDeleteDepartment = (dept: string) => {
//     setLocalDepartments(localDepartments.filter(d => d !== dept));
//   };

//   const handleAddBusinessType = () => {
//     const val = newBusinessTypeName.trim();
//     if (!val) return;
//     if (localBusinessTypes.some(b => b.toLowerCase() === val.toLowerCase())) {
//       alert('Business type already exists!');
//       return;
//     }
//     setLocalBusinessTypes([...localBusinessTypes, val]);
//     setNewBusinessTypeName('');
//   };

//   const handleDeleteBusinessType = (type: string) => {
//     setLocalBusinessTypes(localBusinessTypes.filter(b => b !== type));
//   };

//   const handleAddDesignation = () => {
//     const title = newDesignationTitle.trim();
//     const abbrev = newDesignationAbbreviation.trim();
//     if (!title || !abbrev) return;
//     if (localDesignations.some(d => d.title.toLowerCase() === title.toLowerCase() || d.abbreviation.toLowerCase() === abbrev.toLowerCase())) {
//       alert('Designation title or abbreviation already exists!');
//       return;
//     }
//     setLocalDesignations([...localDesignations, { title, abbreviation: abbrev }]);
//     setNewDesignationTitle('');
//     setNewDesignationAbbreviation('');
//   };

//   const handleDeleteDesignation = (abbrev: string) => {
//     setLocalDesignations(localDesignations.filter(d => d.abbreviation !== abbrev));
//   };

//   const toggleRequiredField = (fieldKey: string) => {
//     if (localRequiredFields.includes(fieldKey)) {
//       setLocalRequiredFields(localRequiredFields.filter(f => f !== fieldKey));
//     } else {
//       setLocalRequiredFields([...localRequiredFields, fieldKey]);
//     }
//   };

//   const handleAddCustomRequiredField = () => {
//     const val = newRequiredFieldName.trim();
//     if (!val) return;
//     if (localRequiredFields.includes(val)) {
//       alert('Field already marked as required!');
//       return;
//     }
//     setLocalRequiredFields([...localRequiredFields, val]);
//     setNewRequiredFieldName('');
//   };

//   const handleAddSalesType = () => {
//     const val = newSalesType.trim();
//     if (!val) return;
//     if (localSalesTypes.some(x => x.toLowerCase() === val.toLowerCase())) {
//       alert('Sales type already exists!');
//       return;
//     }
//     const updated = [...localSalesTypes, val];
//     setLocalSalesTypes(updated);
//     setSalesTypeText(updated.join('\n'));
//     setNewSalesType('');
//   };

//   const handleDeleteSalesType = (val: string) => {
//     const updated = localSalesTypes.filter(x => x !== val);
//     setLocalSalesTypes(updated);
//     setSalesTypeText(updated.join('\n'));
//   };

//   const handleAddOpportunity = () => {
//     const val = newOpportunity.trim();
//     if (!val) return;
//     if (localOpportunities.some(x => x.toLowerCase() === val.toLowerCase())) {
//       alert('Opportunity already exists!');
//       return;
//     }
//     const updatedOpportunities = [...localOpportunities, val];
//     const updatedProductCategories = localProductCategories.some((item) => item.category.toLowerCase() === val.toLowerCase())
//       ? localProductCategories
//       : [...localProductCategories, { category: val, subdivisions: [] }];

//     setLocalOpportunities(updatedOpportunities);
//     setOpportunityText(updatedOpportunities.join('\n'));
//     setLocalProductCategories(updatedProductCategories);
//     setProductCategoryText(serializeProductCategories(updatedProductCategories));
//     setNewOpportunity('');
//   };

//   const handleDeleteOpportunity = (val: string) => {
//     const updatedOpportunities = localOpportunities.filter(x => x !== val);
//     const updatedProductCategories = localProductCategories.filter(x => x.category !== val);
//     setLocalOpportunities(updatedOpportunities);
//     setOpportunityText(updatedOpportunities.join('\n'));
//     setLocalProductCategories(updatedProductCategories);
//     setProductCategoryText(serializeProductCategories(updatedProductCategories));

//     if (selectedOpportunityForProductTree === val) {
//       setSelectedOpportunityForProductTree(null);
//       setSelectedProductCategoryLevel1(null);
//       setSelectedProductCategoryLevel2(null);
//     }
//   };

//   const handleAddProductCategory1 = () => {
//     if (!selectedOpportunityForProductTree) {
//       alert('Select an opportunity first.');
//       return;
//     }
//     const val = newProductCategory1Name.trim();
//     if (!val) return;
//     const existingLevel1 = localProductCategories
//       .find((item) => item.category === selectedOpportunityForProductTree)
//       ?.subdivisions || [];
//     if (existingLevel1.some((entry) => entry.category.toLowerCase() === val.toLowerCase())) {
//       alert('Product Category 1 already exists for this opportunity!');
//       return;
//     }

//     const updated = localProductCategories.map((item) => {
//       if (item.category !== selectedOpportunityForProductTree) return item;
//       const level1 = item.subdivisions || [];
//       return { ...item, subdivisions: [...level1, { category: val, subdivisions: [] }] };
//     });

//     const exists = localProductCategories.some((item) => item.category === selectedOpportunityForProductTree);
//     const finalUpdated = exists
//       ? updated
//       : [...localProductCategories, { category: selectedOpportunityForProductTree, subdivisions: [{ category: val, subdivisions: [] }] }];

//     setLocalProductCategories(finalUpdated);
//     setProductCategoryText(serializeProductCategories(finalUpdated));
//     setSelectedProductCategoryLevel1(val);
//     setSelectedProductCategoryLevel2(null);
//     setNewProductCategory1Name('');
//   };

//   const handleDeleteProductCategory1 = (category1Name: string) => {
//     if (!selectedOpportunityForProductTree) return;
//     const updated = localProductCategories.map((item) => {
//       if (item.category !== selectedOpportunityForProductTree) return item;
//       return {
//         ...item,
//         subdivisions: (item.subdivisions || []).filter((entry) => entry.category !== category1Name),
//       };
//     });

//     setLocalProductCategories(updated);
//     setProductCategoryText(serializeProductCategories(updated));
//     if (selectedProductCategoryLevel1 === category1Name) {
//       setSelectedProductCategoryLevel1(null);
//       setSelectedProductCategoryLevel2(null);
//     }
//   };

//   const handleAddProductCategory2 = () => {
//     if (!selectedOpportunityForProductTree || !selectedProductCategoryLevel1) {
//       alert('Select Product Category 1 first.');
//       return;
//     }
//     const val = newProductCategory2Name.trim();
//     if (!val) return;
//     const existingLevel2 = localProductCategories
//       .find((item) => item.category === selectedOpportunityForProductTree)
//       ?.subdivisions
//       ?.find((level1) => level1.category === selectedProductCategoryLevel1)
//       ?.subdivisions || [];
//     if (existingLevel2.some((entry) => entry.category.toLowerCase() === val.toLowerCase())) {
//       alert('Product Category 2 already exists for this Product Category 1!');
//       return;
//     }

//     const updated = localProductCategories.map((item) => {
//       if (item.category !== selectedOpportunityForProductTree) return item;
//       return {
//         ...item,
//         subdivisions: (item.subdivisions || []).map((level1) => {
//           if (level1.category !== selectedProductCategoryLevel1) return level1;
//           const level2 = level1.subdivisions || [];
//           return { ...level1, subdivisions: [...level2, { category: val, subdivisions: [] }] };
//         }),
//       };
//     });

//     setLocalProductCategories(updated);
//     setProductCategoryText(serializeProductCategories(updated));
//     setSelectedProductCategoryLevel2(val);
//     setNewProductCategory2Name('');
//   };

//   const handleDeleteProductCategory2 = (category2Name: string) => {
//     if (!selectedOpportunityForProductTree || !selectedProductCategoryLevel1) return;
//     const updated = localProductCategories.map((item) => {
//       if (item.category !== selectedOpportunityForProductTree) return item;
//       return {
//         ...item,
//         subdivisions: (item.subdivisions || []).map((level1) => {
//           if (level1.category !== selectedProductCategoryLevel1) return level1;
//           return {
//             ...level1,
//             subdivisions: (level1.subdivisions || []).filter((level2) => level2.category !== category2Name),
//           };
//         }),
//       };
//     });

//     setLocalProductCategories(updated);
//     setProductCategoryText(serializeProductCategories(updated));
//     if (selectedProductCategoryLevel2 === category2Name) {
//       setSelectedProductCategoryLevel2(null);
//     }
//   };

//   const handleAddProductCategory3 = () => {
//     if (!selectedOpportunityForProductTree || !selectedProductCategoryLevel1 || !selectedProductCategoryLevel2) {
//       alert('Select Product Category 2 first.');
//       return;
//     }
//     const val = newProductCategory3Name.trim();
//     if (!val) return;
//     const existingLevel3 = localProductCategories
//       .find((item) => item.category === selectedOpportunityForProductTree)
//       ?.subdivisions
//       ?.find((level1) => level1.category === selectedProductCategoryLevel1)
//       ?.subdivisions
//       ?.find((level2) => level2.category === selectedProductCategoryLevel2)
//       ?.subdivisions || [];
//     if (existingLevel3.some((entry) => entry.category.toLowerCase() === val.toLowerCase())) {
//       alert('Product Category 3 already exists for this Product Category 2!');
//       return;
//     }

//     const updated = localProductCategories.map((item) => {
//       if (item.category !== selectedOpportunityForProductTree) return item;
//       return {
//         ...item,
//         subdivisions: (item.subdivisions || []).map((level1) => {
//           if (level1.category !== selectedProductCategoryLevel1) return level1;
//           return {
//             ...level1,
//             subdivisions: (level1.subdivisions || []).map((level2) => {
//               if (level2.category !== selectedProductCategoryLevel2) return level2;
//               const level3 = level2.subdivisions || [];
//               return { ...level2, subdivisions: [...level3, { category: val }] };
//             }),
//           };
//         }),
//       };
//     });

//     setLocalProductCategories(updated);
//     setProductCategoryText(serializeProductCategories(updated));
//     setNewProductCategory3Name('');
//   };

//   const handleDeleteProductCategory3 = (category3Name: string) => {
//     if (!selectedOpportunityForProductTree || !selectedProductCategoryLevel1 || !selectedProductCategoryLevel2) return;
//     const updated = localProductCategories.map((item) => {
//       if (item.category !== selectedOpportunityForProductTree) return item;
//       return {
//         ...item,
//         subdivisions: (item.subdivisions || []).map((level1) => {
//           if (level1.category !== selectedProductCategoryLevel1) return level1;
//           return {
//             ...level1,
//             subdivisions: (level1.subdivisions || []).map((level2) => {
//               if (level2.category !== selectedProductCategoryLevel2) return level2;
//               return {
//                 ...level2,
//                 subdivisions: (level2.subdivisions || []).filter((level3) => level3.category !== category3Name),
//               };
//             }),
//           };
//         }),
//       };
//     });

//     setLocalProductCategories(updated);
//     setProductCategoryText(serializeProductCategories(updated));
//   };

//   const productOpportunityOptions = Array.from(new Set([
//     ...localOpportunities,
//     ...localProductCategories.map((item) => item.category),
//   ]));
//   const selectedOpportunityCategoryNode = localProductCategories.find((item) => item.category === selectedOpportunityForProductTree);
//   const productCategory1Options = selectedOpportunityCategoryNode?.subdivisions || [];
//   const selectedProductCategory1Node = productCategory1Options.find((item) => item.category === selectedProductCategoryLevel1);
//   const productCategory2Options = selectedProductCategory1Node?.subdivisions || [];
//   const selectedProductCategory2Node = productCategory2Options.find((item) => item.category === selectedProductCategoryLevel2);
//   const productCategory3Options = selectedProductCategory2Node?.subdivisions || [];
//   const productCategory1Count = productCategory1Options.length;
//   const productCategory2Count = productCategory2Options.length;
//   const productCategory3Count = productCategory3Options.length;

//   useEffect(() => {
//     if (activeModal !== 'productCategories') return;
//     if (!selectedOpportunityForProductTree || !productOpportunityOptions.includes(selectedOpportunityForProductTree)) {
//       setSelectedOpportunityForProductTree(productOpportunityOptions[0] || null);
//       setSelectedProductCategoryLevel1(null);
//       setSelectedProductCategoryLevel2(null);
//     }
//   }, [activeModal, selectedOpportunityForProductTree, productOpportunityOptions]);

//   const handleAddSettingsState = () => {
//     const val = newSettingsState.trim();
//     if (!val) return;
//     if (localStates.some(x => x.toLowerCase() === val.toLowerCase())) {
//       alert('State already exists!');
//       return;
//     }
//     const updated = [...localStates, val];
//     const autoCities = getAllCities(val).map((c) => c.name);
//     const updatedStateCities = {
//       ...localStateCities,
//       [val]: autoCities,
//     };
//     const mergedCities = [...new Set([...localCities, ...autoCities])];
//     setLocalStates(updated);
//     setLocalStateCities(updatedStateCities);
//     setLocalCities(mergedCities);
//     setStateText(updated.join('\n'));
//     setCityText(mergedCities.join('\n'));
//     setNewSettingsState('');
//   };

//   const handleDeleteSettingsState = (val: string) => {
//     const updated = localStates.filter(x => x !== val);
//     const updatedStateCities = { ...localStateCities };
//     delete updatedStateCities[val];
//     setLocalStates(updated);
//     setLocalStateCities(updatedStateCities);
//     setStateText(updated.join('\n'));
//   };

//   const handleAddCity = () => {
//     const val = newCity.trim();
//     if (!val) return;
//     if (localCities.some(x => x.toLowerCase() === val.toLowerCase())) {
//       alert('City already exists!');
//       return;
//     }
//     const updated = [...localCities, val];
//     setLocalCities(updated);
//     setCityText(updated.join('\n'));
//     setNewCity('');
//   };

//   const handleDeleteCity = (val: string) => {
//     const updated = localCities.filter(x => x !== val);
//     setLocalCities(updated);
//     setCityText(updated.join('\n'));
//   };

//   const handleAddNextAction = () => {
//     const val = newNextAction.trim();
//     if (!val) return;
//     if (localNextActions.some(x => x.toLowerCase() === val.toLowerCase())) {
//       alert('Next action already exists!');
//       return;
//     }
//     const updated = [...localNextActions, val];
//     setLocalNextActions(updated);
//     setNextActionText(updated.join('\n'));
//     setNewNextAction('');
//   };

//   const handleDeleteNextAction = (val: string) => {
//     const updated = localNextActions.filter(x => x !== val);
//     setLocalNextActions(updated);
//     setNextActionText(updated.join('\n'));
//   };

//   const handleSaveFormFields = () => {
//     const normalizedVerticals = [...localVerticals]
//       .map((vertical) => ({
//         category: vertical.category.trim(),
//         subdivisions: vertical.subdivisions?.length
//           ? [...vertical.subdivisions].sort((a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: 'base' }))
//           : undefined,
//       }))
//       .sort((a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: 'base' }));

//     const normalizedDesignations = [...localDesignations]
//       .reduce((acc: DesignationOption[], current) => {
//         const exists = acc.some((item) => item.abbreviation.toLowerCase() === current.abbreviation.toLowerCase());
//         return exists ? acc : [...acc, current];
//       }, [])
//       .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));

//     const uniqueSorted = (items: string[]) =>
//       [...new Set(items.map((item) => item.trim()).filter(Boolean))]
//         .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

//     dispatch(updateAccountFormSettings({
//       verticals: normalizedVerticals,
//       regions: uniqueSorted(localRegions),
//       departments: uniqueSorted(localDepartments),
//       businessTypes: uniqueSorted(localBusinessTypes),
//       designations: normalizedDesignations,
//       salesTypes: uniqueSorted(localSalesTypes),
//       opportunities: uniqueSorted([...localOpportunities, ...localProductCategories.map((item) => item.category)]),
//       productCategories: [...localProductCategories],
//       states: uniqueSorted(localStates),
//       cities: uniqueSorted(localCities),
//       stateCities: localStateCities,
//       nextActions: uniqueSorted(localNextActions),
//       requiredFields: uniqueSorted(localRequiredFields),
//     }));

//     setFieldSaveMsg('Form field settings saved successfully.');
//     setTimeout(() => setFieldSaveMsg(''), 2500);
//   };

//   const OLD_SAVE_FORM_FIELDS_BYPASS = () => { return; /*
//     const parsedVerticals: VerticalOption[] = parseList(verticalText).map((line) => {
//       const [head, tail] = line.split(':');
//       const category = (head || '').trim();
//       const subdivisions = uniqueSorted((tail || '')
//         .split(',')
//         .map((value) => value.trim())
//         .filter(Boolean))
//         .map((categoryName) => ({ category: categoryName }));
//       return { category, subdivisions: subdivisions.length ? subdivisions : undefined };
//     }).filter((item) => item.category);

//     const normalizedVerticals = parsedVerticals
//       .map((vertical) => ({
//         category: vertical.category.trim(),
//         subdivisions: vertical.subdivisions?.length
//           ? [...vertical.subdivisions].sort((a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: 'base' }))
//           : undefined,
//       }))
//       .sort((a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: 'base' }));

//     const parsedDesignations = parseList(designationText).map((line) => {
//       const [title, abbreviation] = line.split('|').map((v) => v.trim());
//       return { title, abbreviation: abbreviation || title };
//     }).filter((item) => item.title);

//     const normalizedDesignations = parsedDesignations
//       .reduce((acc: { title: string; abbreviation: string }[], current) => {
//         const exists = acc.some((item) => item.abbreviation.toLowerCase() === current.abbreviation.toLowerCase());
//         return exists ? acc : [...acc, current];
//       }, [])
//       .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));

//     dispatch(updateAccountFormSettings({
//       verticals: normalizedVerticals,
//       regions: uniqueSorted(parseList(regionText)),
//       departments: uniqueSorted(parseList(departmentText)),
//       businessTypes: uniqueSorted(parseList(businessTypeText)),
//       designations: normalizedDesignations,
//       requiredFields: uniqueSorted(parseList(requiredFieldText)),
//     }));
//     setFieldSaveMsg('Form field settings saved and arranged successfully.');
//     setTimeout(() => setFieldSaveMsg(''), 2500);
//   */ };

//   const strength = getStrength(form.new_password);
//   const passwordsMatch = form.confirm_password && form.new_password === form.confirm_password;
//   const passwordsMismatch = form.confirm_password && form.new_password !== form.confirm_password;
//   const totalSubCount = globalCategories.reduce((sum: number, c: any) => sum + (c.subcategories?.length || 0), 0);
//   const fyOptions = getFYOptions();

//   // ── Tab config ────────────────────────────────────────────────────────────
//   const tabs = [
//     { id: 'password'    as const, label: 'Change Password', icon: <SettingsIcon size={13} /> },
//     { id: 'profile'     as const, label: 'Profile',          icon: <ShieldCheck  size={13} /> },
//     { id: 'categories'  as const, label: 'Categories',       icon: <BarChart2    size={13} />,
//       badge: globalCategories.length > 0 ? globalCategories.length : undefined },
//     { id: 'formFields'  as const, label: 'Form Fields',      icon: <SettingsIcon size={13} /> },
//     ...(isAdmin
//       ? [{ id: 'performance' as const, label: 'Success Rates (Admin)', icon: <Target size={13} /> }]
//       : []),
//   ];

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="w-full p-5 flex flex-col gap-5 min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-blue-50/60">

//       {/* ── Page Header ── */}
//       <div className="flex items-center gap-4 px-2 py-2 rounded-2xl border border-indigo-100 bg-white/70 backdrop-blur-sm shadow-[0_8px_24px_rgba(99,102,241,0.10)]">
//         <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
//           <SettingsIcon size={22} color="white" />
//         </div>
//         <div>
//           <h1 className="text-2xl font-extrabold tracking-tight text-indigo-700 m-0 leading-tight">Settings</h1>
//           <p className="text-sm text-slate-600 m-0 mt-0.5">Manage your account preferences and security</p>
//         </div>
//       </div>

//       {/* ── Tab Bar ── */}
//       <div className="flex gap-1 bg-white/85 border border-indigo-100 rounded-2xl p-1.5 w-fit shadow-[0_6px_18px_rgba(15,23,42,0.08)] flex-wrap">
//         {tabs.map(({ id, label, icon, badge }: any) => (
//           <button
//             key={id}
//             onClick={() => setActiveTab(id)}
//             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
//               ${activeTab === id
//                 ? 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-200'
//                 : 'text-slate-600 hover:text-slate-800 hover:bg-indigo-50/70'}`}
//           >
//             {icon} {label}
//             {badge !== undefined && (
//               <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
//                 activeTab === id ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
//               }`}>
//                 {badge}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* ── Content ── */}
//       <div className="flex-1">

//         {/* ════ PASSWORD TAB ════ */}
//         {activeTab === 'password' && (
//           <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-5">

//             {/* Left — form */}
//             <Card className="xl:col-span-8">
//               <CardHeader
//                 gradient="bg-gradient-to-r from-indigo-600 to-violet-500"
//                 icon={<SettingsIcon size={15} color="white" />}
//                 title="Change Password"
//                 desc="Update your password to keep your account secure"
//               />
//               <form className="px-6 py-6 flex flex-col gap-5" onSubmit={handleSubmit}>

//                 {/* Current Password */}
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
//                     Current Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       className={inputBase}
//                       type={show.old_password ? 'text' : 'password'}
//                       name="old_password"
//                       placeholder="Enter current password"
//                       value={form.old_password}
//                       onChange={handleChange}
//                       required
//                       minLength={6}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => toggleShow('old_password')}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
//                     >
//                       {show.old_password ? <EyeOff /> : <EyeOpen />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* New Password */}
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
//                     New Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       className={inputBase}
//                       type={show.new_password ? 'text' : 'password'}
//                       name="new_password"
//                       placeholder="Enter new password"
//                       value={form.new_password}
//                       onChange={handleChange}
//                       required
//                       minLength={6}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => toggleShow('new_password')}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
//                     >
//                       {show.new_password ? <EyeOff /> : <EyeOpen />}
//                     </button>
//                   </div>
//                   {form.new_password.length > 0 && (
//                     <div className="flex items-center gap-2 mt-1">
//                       <div className="flex gap-1 flex-1">
//                         {[1, 2, 3, 4].map(i => (
//                           <div
//                             key={i}
//                             className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
//                               i <= strength.level ? strength.tailwind : 'bg-slate-200'
//                             }`}
//                           />
//                         ))}
//                       </div>
//                       <span className="text-xs font-bold" style={{ color: strength.color }}>
//                         {strength.label}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Confirm Password */}
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
//                     Confirm New Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       className={`${inputBase} ${
//                         passwordsMismatch
//                           ? '!border-red-400'
//                           : passwordsMatch
//                           ? '!border-emerald-400'
//                           : ''
//                       }`}
//                       type={show.confirm_password ? 'text' : 'password'}
//                       name="confirm_password"
//                       placeholder="Confirm new password"
//                       value={form.confirm_password}
//                       onChange={handleChange}
//                       required
//                       minLength={6}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => toggleShow('confirm_password')}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
//                     >
//                       {show.confirm_password ? <EyeOff /> : <EyeOpen />}
//                     </button>
//                   </div>
//                   {passwordsMismatch && (
//                     <p className="text-xs text-red-500 font-semibold mt-0.5">Passwords do not match</p>
//                   )}
//                   {passwordsMatch && (
//                     <p className="text-xs text-emerald-600 font-semibold mt-0.5">Passwords match ✓</p>
//                   )}
//                 </div>

//                 {localError && (
//                   <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
//                     {localError}
//                   </div>
//                 )}
//                 {error && (
//                   <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
//                     {error}
//                   </div>
//                 )}
//                 {success && (
//                   <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold">
//                     ✓ {success}
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={loading || !!passwordsMismatch}
//                   className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   {loading ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                       </svg>
//                       Updating...
//                     </span>
//                   ) : 'Update Password'}
//                 </button>

//               </form>
//             </Card>

//             {/* Right — security tips */}
//             <Card className="xl:col-span-4">
//               <CardHeader
//                 gradient="bg-gradient-to-r from-slate-700 to-slate-600"
//                 icon={<ShieldCheck size={15} color="white" />}
//                 title="Security Tips"
//                 desc="Best practices to keep your account safe"
//               />
//               <div className="px-6 py-6 flex flex-col gap-4">
//                 <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100">
//                   <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">
//                     Password Requirements
//                   </p>
//                   <ul className="flex flex-col gap-2">
//                     {[
//                       { rule: 'At least 8 characters',           met: form.new_password.length >= 8 },
//                       { rule: 'One uppercase letter (A–Z)',       met: /[A-Z]/.test(form.new_password) },
//                       { rule: 'One lowercase letter (a–z)',       met: /[a-z]/.test(form.new_password) },
//                       { rule: 'One number (0–9)',                 met: /[0-9]/.test(form.new_password) },
//                       { rule: 'One special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(form.new_password) },
//                     ].map(({ rule, met }) => (
//                       <li key={rule} className="flex items-center gap-2 text-sm">
//                         <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
//                           ${!form.new_password ? 'bg-slate-100 text-slate-400' : met ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
//                           {!form.new_password ? '○' : met ? '✓' : '✗'}
//                         </span>
//                         <span className={!form.new_password ? 'text-slate-500' : met ? 'text-emerald-700 font-semibold' : 'text-red-600'}>
//                           {rule}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
//                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
//                     Account Security
//                   </p>
//                   <ul className="flex flex-col gap-2">
//                     {['Change your password regularly', 'Never share your password with anyone'].map(tip => (
//                       <li key={tip} className="flex items-center gap-2 text-sm text-slate-600">
//                         <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
//                         {tip}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         )}

//         {/* ════ PROFILE TAB ════ */}
//         {activeTab === 'profile' && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//             <Card className="lg:col-span-2">
//               <CardHeader
//                 gradient="bg-gradient-to-r from-indigo-600 to-violet-500"
//                 icon={<ShieldCheck size={15} color="white" />}
//                 title="Profile Information"
//                 desc="Your account details and role"
//               />
//               <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {[
//                   { label: 'Username', value: authUser?.username || '—' },
//                   { label: 'Email',    value: authUser?.email    || '—' },
//                 ].map(({ label, value }) => (
//                   <div key={label} className="flex flex-col gap-1.5 bg-gradient-to-br from-white to-indigo-50/40 rounded-xl p-4 border border-indigo-100 shadow-sm">
//                     <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{label}</span>
//                     <span className="text-sm font-extrabold text-slate-800">{value}</span>
//                   </div>
//                 ))}
//                 <div className="flex flex-col gap-1.5 bg-gradient-to-br from-white to-indigo-50/40 rounded-xl p-4 border border-indigo-100 shadow-sm">
//                   <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Role</span>
//                   <span className="mt-0.5">
//                     <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 border border-indigo-200 rounded-full text-xs font-extrabold capitalize">
//                       {authUser?.role || '—'}
//                     </span>
//                   </span>
//                 </div>
//                 <div className="flex flex-col gap-1.5 bg-gradient-to-br from-white to-emerald-50/50 rounded-xl p-4 border border-emerald-100 shadow-sm">
//                   <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Account Status</span>
//                   <span className="mt-0.5">
//                     <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-extrabold">
//                       Active
//                     </span>
//                   </span>
//                 </div>
//               </div>
//             </Card>

//             <Card>
//               <CardHeader
//                 gradient="bg-gradient-to-r from-slate-700 to-slate-600"
//                 icon={<Info size={15} color="white" />}
//                 title="Profile Highlights"
//                 desc="Quick summary of your account"
//               />
//               <div className="px-6 py-6 flex flex-col gap-3">
//                 <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
//                   <p className="text-xs text-slate-500 m-0">Display Name</p>
//                   <p className="text-sm font-bold text-slate-800 m-0 mt-1">{authUser?.username || 'Not set'}</p>
//                 </div>
//                 <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
//                   <p className="text-xs text-slate-500 m-0">Primary Email</p>
//                   <p className="text-sm font-bold text-slate-800 m-0 mt-1 break-all">{authUser?.email || 'Not set'}</p>
//                 </div>
//                 <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
//                   <p className="text-xs text-slate-500 m-0">Security</p>
//                   <p className="text-sm font-bold text-emerald-700 m-0 mt-1">Account is protected</p>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         )}

//         {/* ════ CATEGORIES TAB ════ */}
//         {activeTab === 'categories' && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

//             {/* Left — manage */}
//             <Card>
//               <CardHeader
//                 gradient="bg-gradient-to-r from-indigo-600 to-violet-500"
//                 icon={<BarChart2 size={15} color="white" />}
//                 title="Manage Categories"
//                 desc="Add, organise, and remove budget categories"
//               />
//               <div className="px-5 py-5 flex flex-col gap-4">

//                 {catError && (
//                   <div className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
//                     <span>{catError}</span>
//                     <button onClick={() => setCatError('')} className="text-red-500 hover:text-red-700 font-bold ml-2">✕</button>
//                   </div>
//                 )}

//                 {/* Add category */}
//                 <div className="flex gap-2">
//                   <input
//                     className={`${inputBase} flex-1`}
//                     value={newCatName}
//                     onChange={e => { setNewCatName(e.target.value); setCatError(''); }}
//                     onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
//                     placeholder="New category name (e.g. Hardware)"
//                     disabled={catLoading}
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddCategory}
//                     disabled={catLoading || !newCatName.trim()}
//                     className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 whitespace-nowrap"
//                   >
//                     + Add
//                   </button>
//                 </div>

//                 {/* Category list */}
//                 {globalCategories.length === 0 ? (
//                   <div className="flex flex-col items-center gap-2 py-10 text-center">
//                     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
//                       <BarChart2 size={24} className="text-slate-300" />
//                     </div>
//                     <p className="text-sm text-slate-400 font-semibold m-0">No categories yet.</p>
//                     <p className="text-xs text-slate-300 m-0">Add one above to get started.</p>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
//                     {globalCategories.map((cat: any) => (
//                       <div key={cat.id} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">

//                         {/* Category header */}
//                         <div className="flex items-center justify-between px-3 py-2.5 bg-indigo-50 border-b border-indigo-100">
//                           <div className="flex items-center gap-2">
//                             <BarChart2 size={12} className="text-indigo-500" />
//                             <span className="text-sm font-bold text-slate-800">{cat.name}</span>
//                             <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold border border-indigo-200">
//                               {cat.subcategories?.length || 0} subs
//                             </span>
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => handleDeleteCategory(cat.id)}
//                             disabled={catLoading}
//                             className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
//                             title="Delete category"
//                           >
//                             <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                               <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
//                               <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
//                             </svg>
//                           </button>
//                         </div>

//                         {/* Subcategory pills + add input */}
//                         <div className="px-3 py-2.5">
//                           <div className="flex flex-wrap gap-1.5 mb-2.5">
//                             {cat.subcategories?.length > 0
//                               ? cat.subcategories.map((sub: any) => (
//                                   <span
//                                     key={sub.id}
//                                     className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:border-red-200 transition-colors group"
//                                   >
//                                     {sub.name}
//                                     <button
//                                       type="button"
//                                       onClick={() => handleDeleteSubCategory(sub.id)}
//                                       disabled={catLoading}
//                                       className="text-slate-300 hover:text-red-500 transition-colors font-bold group-hover:text-red-400 ml-0.5"
//                                     >✕</button>
//                                   </span>
//                                 ))
//                               : <span className="text-xs text-slate-400 italic">No subcategories yet</span>}
//                           </div>
//                           <div className="flex gap-1.5">
//                             <input
//                               className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
//                               value={newSubNames[cat.id] || ''}
//                               onChange={e => { setNewSubNames(prev => ({ ...prev, [cat.id]: e.target.value })); setCatError(''); }}
//                               onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSubCategory(cat.id))}
//                               placeholder="Add subcategory…"
//                               disabled={catLoading}
//                             />
//                             <button
//                               type="button"
//                               onClick={() => handleAddSubCategory(cat.id)}
//                               disabled={catLoading || !(newSubNames[cat.id] || '').trim()}
//                               className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors"
//                             >+</button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </Card>

//             {/* Right — preview / summary */}
//             <Card>
//               <CardHeader
//                 gradient="bg-gradient-to-r from-emerald-600 to-teal-500"
//                 icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>}
//                 title="Saved Categories"
//                 desc="Overview of all configured categories"
//               />
//               <div className="px-5 py-5 flex flex-col gap-4">

//                 {/* Summary chips */}
//                 <div className="grid grid-cols-2 gap-3">
//                   {[
//                     { count: globalCategories.length, label: globalCategories.length === 1 ? 'Category' : 'Categories', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700' },
//                     { count: totalSubCount, label: totalSubCount === 1 ? 'Subcategory' : 'Subcategories', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
//                   ].map(({ count, label, bg, text }) => (
//                     <div key={label} className={`flex items-center gap-3 p-3 rounded-xl border ${bg}`}>
//                       <span className={`text-2xl font-extrabold ${text}`}>{count}</span>
//                       <span className={`text-xs font-bold ${text}`}>{label}</span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Preview list */}
//                 {globalCategories.length === 0 ? (
//                   <div className="flex flex-col items-center gap-2 py-10 text-center">
//                     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
//                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
//                         <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
//                       </svg>
//                     </div>
//                     <p className="text-sm text-slate-400 font-semibold m-0">No saved categories yet.</p>
//                     <p className="text-xs text-slate-300 m-0">Add some on the left to see them here.</p>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
//                     {globalCategories.map((cat: any, ci: number) => (
//                       <div key={cat.id} className="bg-slate-50 rounded-xl border border-slate-200 p-3">
//                         <div className="flex items-center gap-2 mb-2">
//                           <div className="w-3 h-3 rounded-full shrink-0" style={{ background: DOT_COLORS[ci % 6] }} />
//                           <span className="text-sm font-bold text-slate-800">{cat.name}</span>
//                           <span className="ml-auto text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">
//                             {cat.subcategories?.length || 0}
//                           </span>
//                         </div>
//                         <div className="flex flex-wrap gap-1.5">
//                           {cat.subcategories?.length > 0
//                             ? cat.subcategories.map((sub: any) => (
//                                 <span key={sub.id} className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
//                                   {sub.name}
//                                 </span>
//                               ))
//                             : <span className="text-xs text-slate-400 italic">No subcategories added</span>}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </Card>
//           </div>
//         )}

//         {/* ════ PERFORMANCE TAB (ADMIN ONLY) ════ */}
        
//         {activeTab === 'formFields' && (
//           <div className="w-full flex flex-col gap-6 relative">
            
//             {/* Top Toolbar / Reset Defaults & Save Controls */}
//             <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-sm animate-fadeIn">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
//                   <SettingsIcon size={16} />
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-bold text-slate-800">Dynamic Form Customization Panel</h3>
//                   <p className="text-xs text-slate-500">Manage real-time form categories, subdivisions, and validation rules</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <button 
//                   type="button" 
//                   onClick={() => {
//                     if (window.confirm("Are you sure you want to reset all form settings to their default values?")) {
//                       dispatch(resetAccountFormSettings());
//                     }
//                   }} 
//                   className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 bg-white text-xs font-bold transition-all"
//                 >
//                   <RotateCcw size={13} /> Reset Defaults
//                 </button>
//                 <button 
//                   type="button" 
//                   onClick={handleSaveFormFields} 
//                   className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md shadow-indigo-200 hover:-translate-y-0.5 transition-all"
//                 >
//                   <Save size={13} /> Save Form Settings
//                 </button>
//               </div>
//             </div>

//             {fieldSaveMsg && (
//               <div className="px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold flex items-center gap-2 animate-pulse">
//                 <Check size={16} className="text-emerald-600 shrink-0" />
//                 {fieldSaveMsg}
//               </div>
//             )}

//             {/* Dashboard Control Buttons Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              
//               {/* Button 1: Verticals */}
//               <div 
//                 onClick={() => {
//                   setActiveModal('verticals');
//                   if (localVerticals.length > 0) {
//                     setSelectedVerticalForSubs(localVerticals[0].category);
//                   }
//                 }}
//                 className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
//               >
//                 <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-indigo-100/10 to-indigo-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
//                 <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
//                   <Layers size={22} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Verticals & Sub-categories</h4>
//                   <p className="text-xs text-slate-400 mt-1">Configure industry verticals and their nested subcategories or products</p>
//                 </div>
//                 <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-indigo-600 uppercase tracking-wider">
//                   <span>{localVerticals.length} Categories</span>
//                   <span className="bg-indigo-50 px-2 py-0.5 rounded group-hover:bg-indigo-100 transition-colors">Manage +</span>
//                 </div>
//               </div>

//               {/* Button 2: Regions */}
//               <div 
//                 onClick={() => setActiveModal('regions')}
//                 className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
//               >
//                 <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-emerald-100/10 to-emerald-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
//                 <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
//                   <MapPin size={22} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Regions</h4>
//                   <p className="text-xs text-slate-400 mt-1">Setup geographic territories and regional groupings for sales distribution</p>
//                 </div>
//                 <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-emerald-600 uppercase tracking-wider">
//                   <span>{localRegions.length} Regions</span>
//                   <span className="bg-emerald-50 px-2 py-0.5 rounded group-hover:bg-emerald-100 transition-colors">Manage +</span>
//                 </div>
//               </div>

//               {/* Button 3: Departments */}
//               <div 
//                 onClick={() => setActiveModal('departments')}
//                 className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
//               >
//                 <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-blue-100/10 to-blue-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
//                 <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
//                   <Briefcase size={22} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Departments</h4>
//                   <p className="text-xs text-slate-400 mt-1">Configure user departments such as Purchase, Operations, Sales, etc.</p>
//                 </div>
//                 <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-blue-600 uppercase tracking-wider">
//                   <span>{localDepartments.length} Options</span>
//                   <span className="bg-blue-50 px-2 py-0.5 rounded group-hover:bg-blue-100 transition-colors">Manage +</span>
//                 </div>
//               </div>

//               {/* Button 4: Business Types */}
//               <div 
//                 onClick={() => setActiveModal('businessTypes')}
//                 className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
//               >
//                 <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-purple-100/10 to-purple-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
//                 <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
//                   <Building size={22} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">Business Types</h4>
//                   <p className="text-xs text-slate-400 mt-1">Manage types of account engagements (e.g. Direct Business, Partner)</p>
//                 </div>
//                 <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-purple-600 uppercase tracking-wider">
//                   <span>{localBusinessTypes.length} Types</span>
//                   <span className="bg-purple-50 px-2 py-0.5 rounded group-hover:bg-purple-100 transition-colors">Manage +</span>
//                 </div>
//               </div>

//               {/* Button 5: Designations */}
//               <div 
//                 onClick={() => setActiveModal('designations')}
//                 className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
//               >
//                 <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-amber-100/10 to-amber-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
//                 <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
//                   <ShieldCheck size={22} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Designations</h4>
//                   <p className="text-xs text-slate-400 mt-1">Manage standard customer contact job titles and official abbreviations</p>
//                 </div>
//                 <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-amber-600 uppercase tracking-wider">
//                   <span>{localDesignations.length} Designations</span>
//                   <span className="bg-amber-50 px-2 py-0.5 rounded group-hover:bg-amber-100 transition-colors">Manage +</span>
//                 </div>
//               </div>

//               {/* Button 6: Required Fields */}
//               <div 
//                 onClick={() => setActiveModal('requiredFields')}
//                 className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
//               >
//                 <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-rose-100/10 to-rose-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
//                 <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
//                   <CheckSquare size={22} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors">Required Fields</h4>
//                   <p className="text-xs text-slate-400 mt-1">Control form verification rules by setting database fields to mandatory</p>
//                 </div>
//                 <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-rose-600 uppercase tracking-wider">
//                   <span>{localRequiredFields.length} Rules Active</span>
//                   <span className="bg-rose-50 px-2 py-0.5 rounded group-hover:bg-rose-100 transition-colors">Manage +</span>
//                 </div>
//               </div>

//               {/* Button 7: Sales Types */}
//               <div
//                 onClick={() => setActiveModal('salesTypes')}
//                 className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
//               >
//                 <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-indigo-100/10 to-indigo-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
//                 <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
//                   <Layers size={22} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Sales Types</h4>
//                   <p className="text-xs text-slate-400 mt-1">Manage sales type options for forms</p>
//                 </div>
//                 <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-indigo-600 uppercase tracking-wider">
//                   <span>{localSalesTypes.length} Types</span>
//                   <span className="bg-indigo-50 px-2 py-0.5 rounded group-hover:bg-indigo-100 transition-colors">Manage +</span>
//                 </div>
//               </div>

//               {/* Button 8: Opportunities */}
//               <div
//                 onClick={() => setActiveModal('opportunities')}
//                 className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
//               >
//                 <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-emerald-100/10 to-emerald-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
//                 <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
//                   <Briefcase size={22} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Opportunities</h4>
//                   <p className="text-xs text-slate-400 mt-1">Manage opportunity values for lead flow</p>
//                 </div>
//                 <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-emerald-600 uppercase tracking-wider">
//                   <span>{localOpportunities.length} Options</span>
//                   <span className="bg-emerald-50 px-2 py-0.5 rounded group-hover:bg-emerald-100 transition-colors">Manage +</span>
//                 </div>
//               </div>

//               {/* Button 9: Product Categories */}
//               <div
//                 onClick={() => setActiveModal('productCategories')}
//                 className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
//               >
//                 <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-violet-100/10 to-violet-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
//                 <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">
//                   <Building size={22} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-bold text-slate-800 group-hover:text-violet-600 transition-colors">Product Categories</h4>
//                   <p className="text-xs text-slate-400 mt-1">Manage category and nested subdivisions</p>
//                 </div>
//                 <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-violet-600 uppercase tracking-wider">
//                   <span>{localProductCategories.length} Categories</span>
//                   <span className="bg-violet-50 px-2 py-0.5 rounded group-hover:bg-violet-100 transition-colors">Manage +</span>
//                 </div>
//               </div>

//               {/* Button 12: Next Actions */}
//               <div
//                 onClick={() => setActiveModal('nextActions')}
//                 className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
//               >
//                 <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-amber-100/10 to-amber-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
//                 <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
//                   <CheckSquare size={22} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Next Actions</h4>
//                   <p className="text-xs text-slate-400 mt-1">Manage next-action values for target flow</p>
//                 </div>
//                 <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-amber-600 uppercase tracking-wider">
//                   <span>{localNextActions.length} Actions</span>
//                   <span className="bg-amber-50 px-2 py-0.5 rounded group-hover:bg-amber-100 transition-colors">Manage +</span>
//                 </div>
//               </div>

//             </div>

//             {/* ════════════════════════════════════════════════════════════════ */}
//             {/* ── MODAL 1: VERTICALS & NESTED SUB-CATEGORIES SPLIT VIEW FORM ── */}
//             {/* ════════════════════════════════════════════════════════════════ */}
//             {/* Unified modals below */}
//             {activeModal === 'verticals' && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//                 <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xl w-full max-w-5xl flex flex-col max-h-[85vh] overflow-hidden">
                  
//                   {/* Modal Header */}
//                   <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
//                         <Layers size={16} />
//                       </div>
//                       <div>
//                         <h3 className="text-base font-bold text-slate-800">Verticals & Sub-categories Form</h3>
//                         <p className="text-xs text-slate-400">Add industry verticals on the left, and assign subcategories on the right</p>
//                       </div>
//                     </div>
//                     <button 
//                       type="button" 
//                       onClick={() => setActiveModal(null)} 
//                       className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
//                     >
//                       <X size={15} />
//                     </button>
//                   </div>

//                   {/* Split Layout Modal Body */}
//                   <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                    
//                     {/* Left Section: Main Verticals List (Col Span 5) */}
//                     <div className="col-span-1 md:col-span-5 border-r border-slate-100 flex flex-col overflow-hidden bg-slate-50/50">
                      
//                       {/* Add Vertical Input Form */}
//                       <div className="p-4 border-b border-slate-100 bg-white">
//                         <label className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
//                           Add Industry Vertical
//                         </label>
//                         <div className="flex gap-2">
//                           <input
//                             className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
//                             type="text"
//                             placeholder="e.g. Finance, Aviation"
//                             value={newVerticalName}
//                             onChange={(e) => setNewVerticalName(e.target.value)}
//                             onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVertical())}
//                           />
//                           <button
//                             type="button"
//                             onClick={handleAddVertical}
//                             className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all shrink-0"
//                           >
//                             Add
//                           </button>
//                         </div>
//                       </div>

//                       {/* Main Verticals Vertical Option List */}
//                       <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
//                         {localVerticals.length === 0 ? (
//                           <div className="text-center py-10 text-slate-400 text-xs italic">No verticals added.</div>
//                         ) : (
//                           localVerticals.map((vert) => {
//                             const isSelected = selectedVerticalForSubs === vert.category;
//                             return (
//                               <div
//                                 key={vert.category}
//                                 onClick={() => setSelectedVerticalForSubs(vert.category)}
//                                 className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
//                                   isSelected 
//                                     ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
//                                     : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700 hover:bg-slate-50'
//                                 }`}
//                               >
//                                 <span className="text-xs font-bold truncate pr-2">{vert.category}</span>
//                                 <div className="flex items-center gap-1.5 shrink-0">
//                                   <span className={`text-3xs px-2 py-0.5 rounded-full font-bold ${
//                                     isSelected ? 'bg-indigo-700 text-indigo-200' : 'bg-slate-100 text-slate-600'
//                                   }`}>
//                                     {vert.subdivisions?.length || 0}
//                                   </span>
//                                   <button
//                                     type="button"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleDeleteVertical(vert.category);
//                                       if (selectedVerticalForSubs === vert.category) {
//                                         setSelectedVerticalForSubs(null);
//                                       }
//                                     }}
//                                     className={`p-1 rounded-md transition-colors ${
//                                       isSelected ? 'hover:bg-indigo-700 text-indigo-200 hover:text-white' : 'hover:bg-red-50 text-slate-300 hover:text-red-500'
//                                     }`}
//                                   >
//                                     <Trash2 size={11} />
//                                   </button>
//                                 </div>
//                               </div>
//                             );
//                           })
//                         )}
//                       </div>

//                     </div>

//                     {/* Right Section: Subcategories for Selected Vertical (Col Span 7) */}
//                     <div className="col-span-1 md:col-span-7 flex flex-col overflow-hidden bg-white">
//                       {selectedVerticalForSubs ? (
//                         <div className="flex flex-col h-full overflow-hidden">
                          
//                           {/* Selected Category Header */}
//                           <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
//                             <div>
//                               <span className="text-3xs font-extrabold text-indigo-600 uppercase tracking-wider block">Nested Subcategories For</span>
//                               <h4 className="text-sm font-bold text-slate-800">{selectedVerticalForSubs}</h4>
//                             </div>
//                             <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
//                               {(localVerticals.find(v => v.category === selectedVerticalForSubs)?.subdivisions || []).length} Subcategories
//                             </span>
//                           </div>

//                           {/* Add Subcategory input */}
//                           <div className="p-4 border-b border-slate-100">
//                             <label className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
//                               Add Sub-Category / Division Name
//                             </label>
//                             <div className="flex gap-2">
//                               <input
//                                 className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
//                                 type="text"
//                                 placeholder={`e.g. Retail Bank, Commercial (under ${selectedVerticalForSubs})`}
//                                 value={newSubdivisionNames[selectedVerticalForSubs] || ''}
//                                 onChange={(e) => {
//                                   setNewSubdivisionNames(prev => ({ ...prev, [selectedVerticalForSubs]: e.target.value }));
//                                 }}
//                                 onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubdivision(selectedVerticalForSubs))}
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => handleAddSubdivision(selectedVerticalForSubs)}
//                                 className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shrink-0"
//                               >
//                                 + Add subdivision
//                               </button>
//                             </div>
//                           </div>

//                           {/* Subdivision list */}
//                           <div className="flex-1 overflow-y-auto p-4 flex flex-wrap gap-2 items-start content-start">
//                             {(() => {
//                               const selectedVert = localVerticals.find(v => v.category === selectedVerticalForSubs);
//                               const subdivisions = selectedVert?.subdivisions || [];
//                               if (subdivisions.length === 0) {
//                                 return (
//                                   <div className="w-full text-center py-16 text-slate-400 text-xs italic">
//                                     No subcategories defined for {selectedVerticalForSubs}. Add one above!
//                                   </div>
//                                 );
//                               }
//                               return subdivisions.map((sub) => (
//                                 <span 
//                                   key={sub.category} 
//                                   className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-indigo-200 rounded-full text-xs font-semibold text-slate-700 transition-all"
//                                 >
//                                   {sub.category}
//                                   <button
//                                     type="button"
//                                     onClick={() => handleDeleteSubdivision(selectedVerticalForSubs, sub.category)}
//                                     className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-all font-extrabold ml-1.5"
//                                   >
//                                     <X size={10} />
//                                   </button>
//                                 </span>
//                               ));
//                             })()}
//                           </div>

//                         </div>
//                       ) : (
//                         <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-2">
//                           <AlertCircle size={32} className="text-slate-300" />
//                           <h5 className="text-sm font-bold text-slate-500">No Vertical Category Selected</h5>
//                           <p className="text-xs text-slate-400">Select an industry vertical on the left list to configure and edit its subcategories</p>
//                         </div>
//                       )}
//                     </div>

//                   </div>

//                   {/* Modal Footer */}
//                   <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
//                     <button 
//                       type="button" 
//                       onClick={() => setActiveModal(null)} 
//                       className="px-4 py-2 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-xs font-bold transition-all"
//                     >
//                       Close
//                     </button>
//                     <button 
//                       type="button" 
//                       onClick={() => {
//                         handleSaveFormFields();
//                         setActiveModal(null);
//                       }} 
//                       className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all"
//                     >
//                       Save & Apply Changes
//                     </button>
//                   </div>

//                 </div>
//               </div>
//             )}

//             {activeModal === 'productCategories' && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//                 <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xl w-[min(96vw,1260px)] h-[min(90vh,860px)] flex flex-col overflow-hidden">
                  
//                   {/* Modal Header */}
//                   <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-violet-50 via-white to-indigo-50 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-200">
//                         <Layers size={16} />
//                       </div>
//                       <div>
//                         <h3 className="text-base font-bold text-slate-800">Opportunity Product Hierarchy</h3>
//                         <p className="text-xs text-slate-400">Configure Product Category 1, 2, and 3 under each opportunity</p>
//                       </div>
//                     </div>
//                     <button 
//                       type="button" 
//                       onClick={() => setActiveModal(null)} 
//                       className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
//                     >
//                       <X size={15} />
//                     </button>
//                   </div>

//                   {/* Split Layout Modal Body */}
//                   <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">

//                     {/* Left Section: Opportunity List */}
//                     <div className="lg:col-span-4 xl:col-span-3 border-r border-slate-100 flex flex-col overflow-hidden min-w-0 bg-slate-50/50">

//                       {/* Quick Add Opportunity */}
//                       <div className="p-4 border-b border-slate-100 bg-white">
//                         <label className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
//                           Add Opportunity
//                         </label>
//                         <div className="flex gap-2">
//                           <input
//                             className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
//                             type="text"
//                             placeholder="e.g. Printer, Software"
//                             value={newOpportunity}
//                             onChange={(e) => setNewOpportunity(e.target.value)}
//                             onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOpportunity())}
//                           />
//                           <button
//                             type="button"
//                             onClick={handleAddOpportunity}
//                             className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all shrink-0"
//                           >
//                             Add
//                           </button>
//                         </div>
//                       </div>

//                       {/* Opportunity List */}
//                       <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
//                         {productOpportunityOptions.length === 0 ? (
//                           <div className="text-center py-10 text-slate-400 text-xs italic">No opportunities available. Add one above.</div>
//                         ) : (
//                           productOpportunityOptions.map((opportunityName) => {
//                             const isSelected = selectedOpportunityForProductTree === opportunityName;
//                             const level1Count = localProductCategories.find((item) => item.category === opportunityName)?.subdivisions?.length || 0;
//                             return (
//                               <div
//                                 key={opportunityName}
//                                 onClick={() => {
//                                   setSelectedOpportunityForProductTree(opportunityName);
//                                   setSelectedProductCategoryLevel1(null);
//                                   setSelectedProductCategoryLevel2(null);
//                                 }}
//                                 className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
//                                   isSelected 
//                                     ? 'bg-violet-600 border-violet-600 text-white shadow-md' 
//                                     : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700 hover:bg-slate-50'
//                                 }`}
//                               >
//                                 <span className="text-xs font-bold truncate pr-2">{opportunityName}</span>
//                                 <div className="flex items-center gap-1.5 shrink-0">
//                                   <span className={`text-3xs px-2 py-0.5 rounded-full font-bold ${
//                                     isSelected ? 'bg-violet-700 text-violet-250' : 'bg-slate-100 text-slate-600'
//                                   }`}>
//                                     {level1Count}
//                                   </span>
//                                   <button
//                                     type="button"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleDeleteOpportunity(opportunityName);
//                                     }}
//                                     className={`p-1 rounded-md transition-colors ${
//                                       isSelected ? 'hover:bg-violet-700 text-violet-200 hover:text-white' : 'hover:bg-red-50 text-slate-300 hover:text-red-500'
//                                     }`}
//                                   >
//                                     <Trash2 size={11} />
//                                   </button>
//                                 </div>
//                               </div>
//                             );
//                           })
//                         )}
//                       </div>

//                     </div>

//                     {/* Right Section: 3-level product category editor */}
//                     <div className="lg:col-span-8 xl:col-span-9 flex flex-col overflow-hidden min-w-0 bg-white overflow-x-hidden">
//                       {selectedOpportunityForProductTree ? (
//                         <div className="flex flex-col h-full overflow-hidden">
                          
//                           {/* Selected Opportunity Header */}
//                           <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
//                             <div>
//                               <span className="text-3xs font-extrabold text-violet-600 uppercase tracking-wider block">Managing Opportunity</span>
//                               <h4 className="text-sm font-bold text-slate-800">{selectedOpportunityForProductTree}</h4>
//                             </div>
//                             <div className="flex items-center gap-1.5">
//                               <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
//                                 L1 {productCategory1Count}
//                               </span>
//                               <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
//                                 L2 {productCategory2Count}
//                               </span>
//                               <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
//                                 L3 {productCategory3Count}
//                               </span>
//                             </div>
//                           </div>

//                           <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">

//                             {/* Product Category 1 */}
//                             <div className="rounded-2xl border border-violet-200 bg-violet-50/30 p-4 flex flex-col gap-3 min-h-[380px] min-w-0 shadow-sm">
//                               <div>
//                                 <p className="text-2xs font-extrabold text-violet-600 uppercase tracking-wider m-0">Level 1</p>
//                                 <h5 className="text-sm font-bold text-slate-800 m-0 mt-0.5">Product Category 1</h5>
//                               </div>
//                               <div className="flex items-center gap-2 min-w-0">
//                                 <input
//                                   className="min-w-0 flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
//                                   type="text"
//                                   placeholder="Add Product Category 1"
//                                   value={newProductCategory1Name}
//                                   onChange={(e) => setNewProductCategory1Name(e.target.value)}
//                                   onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProductCategory1())}
//                                 />
//                                 <button
//                                   type="button"
//                                   onClick={handleAddProductCategory1}
//                                   className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shrink-0 whitespace-nowrap"
//                                 >
//                                   Add
//                                 </button>
//                               </div>
//                               <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
//                                 {productCategory1Options.length === 0 ? (
//                                   <p className="text-xs text-slate-400 italic">No Product Category 1 added.</p>
//                                 ) : productCategory1Options.map((entry) => {
//                                   const isSelected = selectedProductCategoryLevel1 === entry.category;
//                                   return (
//                                     <div
//                                       key={entry.category}
//                                       onClick={() => {
//                                         setSelectedProductCategoryLevel1(entry.category);
//                                         setSelectedProductCategoryLevel2(null);
//                                       }}
//                                       className={`min-w-0 flex items-center justify-between rounded-xl border px-2.5 py-2 text-xs cursor-pointer transition-all ${
//                                         isSelected
//                                           ? 'bg-violet-600 text-white border-violet-600'
//                                           : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300'
//                                       }`}
//                                     >
//                                       <span className="font-bold truncate pr-2">{entry.category}</span>
//                                       <button
//                                         type="button"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           handleDeleteProductCategory1(entry.category);
//                                         }}
//                                         className={`p-1 rounded-md ${isSelected ? 'hover:bg-violet-700 text-violet-100' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
//                                       >
//                                         <X size={11} />
//                                       </button>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             </div>

//                             {/* Product Category 2 */}
//                             <div className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-4 flex flex-col gap-3 min-h-[380px] min-w-0 shadow-sm">
//                               <div>
//                                 <p className="text-2xs font-extrabold text-indigo-600 uppercase tracking-wider m-0">Level 2</p>
//                                 <h5 className="text-sm font-bold text-slate-800 m-0 mt-0.5">Product Category 2</h5>
//                               </div>
//                               <div className="flex items-center gap-2 min-w-0">
//                                 <input
//                                   className="min-w-0 flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:bg-slate-100 disabled:text-slate-400"
//                                   type="text"
//                                   disabled={!selectedProductCategoryLevel1}
//                                   placeholder={selectedProductCategoryLevel1 ? 'Add Product Category 2' : 'Select Product Category 1 first'}
//                                   value={newProductCategory2Name}
//                                   onChange={(e) => setNewProductCategory2Name(e.target.value)}
//                                   onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProductCategory2())}
//                                 />
//                                 <button
//                                   type="button"
//                                   disabled={!selectedProductCategoryLevel1}
//                                   onClick={handleAddProductCategory2}
//                                   className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shrink-0 whitespace-nowrap"
//                                 >
//                                   Add
//                                 </button>
//                               </div>
//                               <p className="text-[11px] font-semibold text-indigo-600/80">
//                                 Parent: {selectedProductCategoryLevel1 || 'Not selected'}
//                               </p>
//                               <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
//                                 {!selectedProductCategoryLevel1 ? (
//                                   <p className="text-xs text-slate-400 italic">Choose Product Category 1 to add Product Category 2.</p>
//                                 ) : productCategory2Options.length === 0 ? (
//                                   <p className="text-xs text-slate-400 italic">No Product Category 2 added.</p>
//                                 ) : productCategory2Options.map((entry) => {
//                                   const isSelected = selectedProductCategoryLevel2 === entry.category;
//                                   return (
//                                     <div
//                                       key={entry.category}
//                                       onClick={() => setSelectedProductCategoryLevel2(entry.category)}
//                                       className={`min-w-0 flex items-center justify-between rounded-xl border px-2.5 py-2 text-xs cursor-pointer transition-all ${
//                                         isSelected
//                                           ? 'bg-indigo-600 text-white border-indigo-600'
//                                           : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
//                                       }`}
//                                     >
//                                       <span className="font-bold truncate pr-2">{entry.category}</span>
//                                       <button
//                                         type="button"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           handleDeleteProductCategory2(entry.category);
//                                         }}
//                                         className={`p-1 rounded-md ${isSelected ? 'hover:bg-indigo-700 text-indigo-100' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
//                                       >
//                                         <X size={11} />
//                                       </button>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             </div>

//                             {/* Product Category 3 */}
//                             <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4 flex flex-col gap-3 min-h-[380px] min-w-0 shadow-sm">
//                               <div>
//                                 <p className="text-2xs font-extrabold text-emerald-600 uppercase tracking-wider m-0">Level 3</p>
//                                 <h5 className="text-sm font-bold text-slate-800 m-0 mt-0.5">Product Category 3</h5>
//                               </div>
//                               <div className="flex items-center gap-2 min-w-0">
//                                 <input
//                                   className="min-w-0 flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all disabled:bg-slate-100 disabled:text-slate-400"
//                                   type="text"
//                                   disabled={!selectedProductCategoryLevel2}
//                                   placeholder={selectedProductCategoryLevel2 ? 'Add Product Category 3' : 'Select Product Category 2 first'}
//                                   value={newProductCategory3Name}
//                                   onChange={(e) => setNewProductCategory3Name(e.target.value)}
//                                   onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProductCategory3())}
//                                 />
//                                 <button
//                                   type="button"
//                                   disabled={!selectedProductCategoryLevel2}
//                                   onClick={handleAddProductCategory3}
//                                   className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shrink-0 whitespace-nowrap"
//                                 >
//                                   Add
//                                 </button>
//                               </div>
//                               <p className="text-[11px] font-semibold text-emerald-600/80">
//                                 Parent: {selectedProductCategoryLevel2 || 'Not selected'}
//                               </p>
//                               <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
//                                 {!selectedProductCategoryLevel2 ? (
//                                   <p className="text-xs text-slate-400 italic">Choose Product Category 2 to add Product Category 3.</p>
//                                 ) : productCategory3Options.length === 0 ? (
//                                   <p className="text-xs text-slate-400 italic">No Product Category 3 added.</p>
//                                 ) : productCategory3Options.map((entry) => (
//                                   <div
//                                     key={entry.category}
//                                     className="min-w-0 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs"
//                                   >
//                                     <span className="font-bold text-slate-700 truncate pr-2">{entry.category}</span>
//                                     <button
//                                       type="button"
//                                       onClick={() => handleDeleteProductCategory3(entry.category)}
//                                       className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50"
//                                     >
//                                       <X size={11} />
//                                     </button>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>

//                           </div>

//                         </div>
//                       ) : (
//                         <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-2">
//                           <AlertCircle size={32} className="text-slate-300" />
//                           <h5 className="text-sm font-bold text-slate-500">No Opportunity Selected</h5>
//                           <p className="text-xs text-slate-400">Select or add an opportunity on the left to configure Product Category 1, 2, and 3.</p>
//                         </div>
//                       )}
//                     </div>

//                   </div>

//                   {/* Modal Footer */}
//                   <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
//                     <button 
//                       type="button" 
//                       onClick={() => setActiveModal(null)} 
//                       className="px-4 py-2 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-xs font-bold transition-all"
//                     >
//                       Close
//                     </button>
//                     <button 
//                       type="button" 
//                       onClick={() => {
//                         handleSaveFormFields();
//                         setActiveModal(null);
//                       }} 
//                       className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-100 transition-all"
//                     >
//                       Save & Apply Changes
//                     </button>
//                   </div>

//                 </div>
//               </div>
//             )}


//             {/* ═══════════════════════════════ */}
//             {/* ── MODAL 2: REGIONS OPTION FORM ── */}
//             {/* ═══════════════════════════════ */}
//             {activeModal === 'salesTypes' && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//                 <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xl w-full max-w-xl flex flex-col max-h-[80vh] overflow-hidden">
//                   <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 flex items-center justify-between">
//                     <h3 className="text-base font-bold text-slate-800">Sales Types</h3>
//                     <button type="button" onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"><X size={15} /></button>
//                   </div>
//                   <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
//                     <div className="flex gap-2">
//                       <input className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" type="text" placeholder="Add sales type..." value={newSalesType} onChange={(e) => setNewSalesType(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSalesType())} />
//                       <button type="button" onClick={handleAddSalesType} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">Add</button>
//                     </div>
//                     <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-1.5">
//                       {localSalesTypes.length === 0 ? <span className="text-xs text-slate-400 italic">No sales types added.</span> : localSalesTypes.map((v) => (
//                         <span key={v} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 group hover:border-red-200 hover:bg-red-50 transition-all">
//                           {v}<button type="button" onClick={() => handleDeleteSalesType(v)} className="text-slate-300 hover:text-red-500 ml-1 font-bold"><X size={10} /></button>
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
//                     <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border-2 border-slate-200 text-slate-600 rounded-xl text-xs font-bold">Close</button>
//                     <button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100">Save & Apply</button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeModal === 'opportunities' && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//                 <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xl w-full max-w-xl flex flex-col max-h-[80vh] overflow-hidden">
//                   <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 flex items-center justify-between">
//                     <h3 className="text-base font-bold text-slate-800">Opportunities</h3>
//                     <button type="button" onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"><X size={15} /></button>
//                   </div>
//                   <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
//                     <div className="flex gap-2">
//                       <input className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" type="text" placeholder="Add opportunity..." value={newOpportunity} onChange={(e) => setNewOpportunity(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOpportunity())} />
//                       <button type="button" onClick={handleAddOpportunity} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">Add</button>
//                     </div>
//                     <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-1.5">
//                       {localOpportunities.length === 0 ? <span className="text-xs text-slate-400 italic">No opportunities added.</span> : localOpportunities.map((v) => (
//                         <span key={v} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 group hover:border-red-200 hover:bg-red-50 transition-all">
//                           {v}<button type="button" onClick={() => handleDeleteOpportunity(v)} className="text-slate-300 hover:text-red-500 ml-1 font-bold"><X size={10} /></button>
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
//                     <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border-2 border-slate-200 text-slate-600 rounded-xl text-xs font-bold">Close</button>
//                     <button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100">Save & Apply</button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeModal === 'states' && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//                 <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xl w-full max-w-xl flex flex-col max-h-[80vh] overflow-hidden">
//                   <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-cyan-50 via-white to-cyan-50 flex items-center justify-between"><h3 className="text-base font-bold text-slate-800">States</h3><button type="button" onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"><X size={15} /></button></div>
//                   <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4"><div className="flex gap-2"><input className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all" type="text" placeholder="Add state..." value={newSettingsState} onChange={(e) => setNewSettingsState(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSettingsState())} /><button type="button" onClick={handleAddSettingsState} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">Add</button></div><div className="border-t border-slate-100 pt-4 flex flex-wrap gap-1.5">{localStates.length === 0 ? <span className="text-xs text-slate-400 italic">No states added.</span> : localStates.map((v) => (<span key={v} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 group hover:border-red-200 hover:bg-red-50 transition-all">{v}<button type="button" onClick={() => handleDeleteSettingsState(v)} className="text-slate-300 hover:text-red-500 ml-1 font-bold"><X size={10} /></button></span>))}</div></div>
//                   <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3"><button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border-2 border-slate-200 text-slate-600 rounded-xl text-xs font-bold">Close</button><button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }} className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-100">Save & Apply</button></div>
//                 </div>
//               </div>
//             )}

//             {activeModal === 'cities' && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//                 <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xl w-full max-w-xl flex flex-col max-h-[80vh] overflow-hidden">
//                   <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-blue-50 flex items-center justify-between"><h3 className="text-base font-bold text-slate-800">Cities</h3><button type="button" onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"><X size={15} /></button></div>
//                   <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4"><div className="flex gap-2"><input className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" type="text" placeholder="Add city..." value={newCity} onChange={(e) => setNewCity(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCity())} /><button type="button" onClick={handleAddCity} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">Add</button></div><div className="border-t border-slate-100 pt-4 flex flex-wrap gap-1.5">{localCities.length === 0 ? <span className="text-xs text-slate-400 italic">No cities added.</span> : localCities.map((v) => (<span key={v} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 group hover:border-red-200 hover:bg-red-50 transition-all">{v}<button type="button" onClick={() => handleDeleteCity(v)} className="text-slate-300 hover:text-red-500 ml-1 font-bold"><X size={10} /></button></span>))}</div></div>
//                   <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3"><button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border-2 border-slate-200 text-slate-600 rounded-xl text-xs font-bold">Close</button><button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-100">Save & Apply</button></div>
//                 </div>
//               </div>
//             )}

//             {activeModal === 'nextActions' && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//                 <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xl w-full max-w-xl flex flex-col max-h-[80vh] overflow-hidden">
//                   <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-amber-50 via-white to-amber-50 flex items-center justify-between"><h3 className="text-base font-bold text-slate-800">Next Actions</h3><button type="button" onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"><X size={15} /></button></div>
//                   <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4"><div className="flex gap-2"><input className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all" type="text" placeholder="Add next action..." value={newNextAction} onChange={(e) => setNewNextAction(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNextAction())} /><button type="button" onClick={handleAddNextAction} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">Add</button></div><div className="border-t border-slate-100 pt-4 flex flex-wrap gap-1.5">{localNextActions.length === 0 ? <span className="text-xs text-slate-400 italic">No next actions added.</span> : localNextActions.map((v) => (<span key={v} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 group hover:border-red-200 hover:bg-red-50 transition-all">{v}<button type="button" onClick={() => handleDeleteNextAction(v)} className="text-slate-300 hover:text-red-500 ml-1 font-bold"><X size={10} /></button></span>))}</div></div>
//                   <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3"><button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border-2 border-slate-200 text-slate-600 rounded-xl text-xs font-bold">Close</button><button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }} className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-100">Save & Apply</button></div>
//                 </div>
//               </div>
//             )}

//             {activeModal === 'regions' && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//                 <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xl w-full max-w-xl flex flex-col max-h-[80vh] overflow-hidden">
                  
//                   <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
//                         <MapPin size={16} />
//                       </div>
//                       <div>
//                         <h3 className="text-base font-bold text-slate-800">Regions Settings Form</h3>
//                         <p className="text-xs text-slate-400">Configure geographic sales territories and regions</p>
//                       </div>
//                     </div>
//                     <button type="button" onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center">
//                       <X size={15} />
//                     </button>
//                   </div>

//                   <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
//                     <div className="flex flex-col gap-1.5">
//                       <label className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider">Add Sales Region / Territory</label>
//                       <div className="flex gap-2">
//                         <input
//                           className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
//                           type="text"
//                           placeholder="e.g. North East, EMEA"
//                           value={newRegionName}
//                           onChange={(e) => setNewRegionName(e.target.value)}
//                           onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRegion())}
//                         />
//                         <button type="button" onClick={handleAddRegion} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
//                           Add Region
//                         </button>
//                       </div>
//                     </div>

//                     <div className="border-t border-slate-100 pt-4">
//                       <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Active Territories List</label>
//                       <div className="flex flex-wrap gap-1.5">
//                         {localRegions.length === 0 ? (
//                           <span className="text-xs text-slate-400 italic">No regions added.</span>
//                         ) : (
//                           localRegions.map((region) => (
//                             <span 
//                               key={region}
//                               className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 group hover:border-red-200 hover:bg-red-50 transition-all"
//                             >
//                               {region}
//                               <button type="button" onClick={() => handleDeleteRegion(region)} className="text-slate-300 hover:text-red-500 ml-1 font-bold">
//                                 <X size={10} />
//                               </button>
//                             </span>
//                           ))
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
//                     <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border-2 border-slate-200 text-slate-600 rounded-xl text-xs font-bold">Close</button>
//                     <button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100">Save & Apply</button>
//                   </div>

//                 </div>
//               </div>
//             )}

//             {/* ══════════════════════════════════ */}
//             {/* ── MODAL 3: DEPARTMENTS OPTION FORM ── */}
//             {/* ══════════════════════════════════ */}
//             {activeModal === 'departments' && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//                 <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xl w-full max-w-xl flex flex-col max-h-[80vh] overflow-hidden">
                  
//                   <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-blue-50 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200">
//                         <Briefcase size={16} />
//                       </div>
//                       <div>
//                         <h3 className="text-base font-bold text-slate-800">Departments Settings Form</h3>
//                         <p className="text-xs text-slate-400">Configure corporate department options for PIC assignment</p>
//                       </div>
//                     </div>
//                     <button type="button" onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center">
//                       <X size={15} />
//                     </button>
//                   </div>

//                   <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
//                     <div className="flex flex-col gap-1.5">
//                       <label className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider">Add Corporate Department</label>
//                       <div className="flex gap-2">
//                         <input
//                           className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
//                           type="text"
//                           placeholder="e.g. Quality Assurance, Strategy"
//                           value={newDepartmentName}
//                           onChange={(e) => setNewDepartmentName(e.target.value)}
//                           onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDepartment())}
//                         />
//                         <button type="button" onClick={handleAddDepartment} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
//                           Add Department
//                         </button>
//                       </div>
//                     </div>

//                     <div className="border-t border-slate-100 pt-4">
//                       <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Active Departments</label>
//                       <div className="flex flex-wrap gap-1.5 max-h-[220px] overflow-y-auto pr-1">
//                         {localDepartments.length === 0 ? (
//                           <span className="text-xs text-slate-400 italic">No departments added.</span>
//                         ) : (
//                           localDepartments.map((dept) => (
//                             <span 
//                               key={dept}
//                               className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 group hover:border-red-200 hover:bg-red-50 transition-all"
//                             >
//                               {dept}
//                               <button type="button" onClick={() => handleDeleteDepartment(dept)} className="text-slate-300 hover:text-red-500 ml-1 font-bold">
//                                 <X size={10} />
//                               </button>
//                             </span>
//                           ))
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
//                     <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border-2 border-slate-200 text-slate-600 rounded-xl text-xs font-bold">Close</button>
//                     <button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-100">Save & Apply</button>
//                   </div>

//                 </div>
//               </div>
//             )}

//             {/* ════════════════════════════════════ */}
//             {/* ── MODAL 4: BUSINESS TYPES OPTION FORM ── */}
//             {/* ════════════════════════════════════ */}
//             {activeModal === 'businessTypes' && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//                 <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xl w-full max-w-xl flex flex-col max-h-[80vh] overflow-hidden">
                  
//                   <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-purple-50 via-white to-purple-50 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-200">
//                         <Building size={16} />
//                       </div>
//                       <div>
//                         <h3 className="text-base font-bold text-slate-800">Business Types Settings Form</h3>
//                         <p className="text-xs text-slate-400">Configure account engagement types and classifications</p>
//                       </div>
//                     </div>
//                     <button type="button" onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center">
//                       <X size={15} />
//                     </button>
//                   </div>

//                   <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
//                     <div className="flex flex-col gap-1.5">
//                       <label className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider">Add Business Type</label>
//                       <div className="flex gap-2">
//                         <input
//                           className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
//                           type="text"
//                           placeholder="e.g. Sub-Dealer, Public Sector"
//                           value={newBusinessTypeName}
//                           onChange={(e) => setNewBusinessTypeName(e.target.value)}
//                           onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBusinessType())}
//                         />
//                         <button type="button" onClick={handleAddBusinessType} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
//                           Add Type
//                         </button>
//                       </div>
//                     </div>

//                     <div className="border-t border-slate-100 pt-4">
//                       <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Active Engagement Types</label>
//                       <div className="flex flex-wrap gap-1.5">
//                         {localBusinessTypes.length === 0 ? (
//                           <span className="text-xs text-slate-400 italic">No business types added.</span>
//                         ) : (
//                           localBusinessTypes.map((type) => (
//                             <span 
//                               key={type}
//                               className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 group hover:border-red-200 hover:bg-red-50 transition-all"
//                             >
//                               {type}
//                               <button type="button" onClick={() => handleDeleteBusinessType(type)} className="text-slate-300 hover:text-red-500 ml-1 font-bold">
//                                 <X size={10} />
//                               </button>
//                             </span>
//                           ))
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
//                     <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border-2 border-slate-200 text-slate-600 rounded-xl text-xs font-bold">Close</button>
//                     <button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }} className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-100">Save & Apply</button>
//                   </div>

//                 </div>
//               </div>
//             )}

//             {/* ════════════════════════════════════ */}
//             {/* ── MODAL 5: DESIGNATIONS OPTION FORM ── */}
//             {/* ════════════════════════════════════ */}
//             {activeModal === 'designations' && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//                 <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xl w-full max-w-xl flex flex-col max-h-[85vh] overflow-hidden">
                  
//                   <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-amber-50 via-white to-amber-50 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-200">
//                         <ShieldCheck size={16} />
//                       </div>
//                       <div>
//                         <h3 className="text-base font-bold text-slate-800">Designations Settings Form</h3>
//                         <p className="text-xs text-slate-400">Configure PIC corporate job titles and official abbreviations</p>
//                       </div>
//                     </div>
//                     <button type="button" onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center">
//                       <X size={15} />
//                     </button>
//                   </div>

//                   <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
//                     <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
//                       <div className="flex flex-col gap-1">
//                         <label className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider">Job Title</label>
//                         <input
//                           className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-amber-400 transition-all"
//                           type="text"
//                           placeholder="e.g. Senior Manager"
//                           value={newDesignationTitle}
//                           onChange={(e) => setNewDesignationTitle(e.target.value)}
//                         />
//                       </div>
//                       <div className="flex flex-col gap-1">
//                         <label className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider">Abbreviation</label>
//                         <div className="flex gap-2">
//                           <input
//                             className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-amber-400 transition-all"
//                             type="text"
//                             placeholder="e.g. Sr.M"
//                             value={newDesignationAbbreviation}
//                             onChange={(e) => setNewDesignationAbbreviation(e.target.value)}
//                             onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDesignation())}
//                           />
//                           <button type="button" onClick={handleAddDesignation} className="w-8 h-8 flex items-center justify-center bg-amber-600 text-white rounded-lg font-bold text-lg hover:bg-amber-700 transition-colors shrink-0 shadow-sm">+</button>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="border-t border-slate-100 pt-4 flex-1 overflow-hidden flex flex-col">
//                       <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Registered Designations List</label>
//                       <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5">
//                         {localDesignations.length === 0 ? (
//                           <span className="text-xs text-slate-400 italic text-center py-4">No designations added.</span>
//                         ) : (
//                           localDesignations.map((desig) => (
//                             <div 
//                               key={desig.abbreviation}
//                               className="flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-200 hover:border-amber-200 rounded-xl transition-all group shadow-sm hover:shadow"
//                             >
//                               <div className="flex items-center gap-2 min-w-0">
//                                 <span className="text-xs font-bold text-slate-800 truncate">{desig.title}</span>
//                                 <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-3xs font-extrabold uppercase shrink-0 border border-slate-200">
//                                   {desig.abbreviation}
//                                 </span>
//                               </div>
//                               <button
//                                 type="button"
//                                 onClick={() => handleDeleteDesignation(desig.abbreviation)}
//                                 className="text-slate-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
//                                 title="Delete designation"
//                               >
//                                 <Trash2 size={12} />
//                               </button>
//                             </div>
//                           ))
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
//                     <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border-2 border-slate-200 text-slate-600 rounded-xl text-xs font-bold">Close</button>
//                     <button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }} className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-100">Save & Apply</button>
//                   </div>

//                 </div>
//               </div>
//             )}

//             {/* ═════════════════════════════════════ */}
//             {/* ── MODAL 6: REQUIRED FIELDS VALIDATOR ── */}
//             {/* ═════════════════════════════════════ */}
//             {activeModal === 'requiredFields' && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//                 <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xl w-full max-w-xl flex flex-col max-h-[85vh] overflow-hidden">
                  
//                   <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-rose-50 via-white to-rose-50 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-200">
//                         <CheckSquare size={16} />
//                       </div>
//                       <div>
//                         <h3 className="text-base font-bold text-slate-800">Required Fields Settings Form</h3>
//                         <p className="text-xs text-slate-400">Configure global mandatory validation switches for all accounts forms</p>
//                       </div>
//                     </div>
//                     <button type="button" onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center">
//                       <X size={15} />
//                     </button>
//                   </div>

//                   <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                    
//                     {/* Toggle Switch Grid */}
//                     <div>
//                       <label className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider block mb-2.5">Standard Database Field Mandatory Toggles</label>
//                       <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
//                         {[
//                           { key: 'account_name', label: 'Account Name' },
//                           { key: 'pic', label: 'Person In Charge (PIC)' },
//                           { key: 'vertical', label: 'Vertical Category' },
//                           { key: 'department', label: 'Department' },
//                           { key: 'designation', label: 'Designation' },
//                           { key: 'business', label: 'Business Type' },
//                           { key: 'region', label: 'Territory/Region' },
//                           { key: 'mobile_number', label: 'Mobile Number' },
//                           { key: 'email_id', label: 'Email Address' },
//                           { key: 'location', label: 'Location' },
//                           { key: 'address', label: 'Street Address' },
//                         ].map((field) => {
//                           const isRequired = localRequiredFields.includes(field.key);
//                           return (
//                             <div 
//                               key={field.key} 
//                               onClick={() => toggleRequiredField(field.key)}
//                               className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer select-none transition-all ${
//                                 isRequired 
//                                   ? 'bg-rose-50/40 border-rose-200 shadow-sm' 
//                                   : 'bg-white border-slate-200 hover:border-rose-100 hover:bg-slate-50/40'
//                               }`}
//                             >
//                               <span className="text-xs font-bold text-slate-700 truncate">{field.label}</span>
//                               <div className={`w-8 h-4.5 rounded-full transition-all relative ${isRequired ? 'bg-rose-600' : 'bg-slate-200'}`}>
//                                 <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 shadow-sm transition-all ${isRequired ? 'right-0.5' : 'left-0.5'}`} />
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>

//                     {/* Add Custom Fields */}
//                     <div className="border-t border-slate-100 pt-4">
//                       <label className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Add Custom Required Field Key</label>
//                       <div className="flex gap-2">
//                         <input
//                           className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-rose-400 transition-all"
//                           type="text"
//                           placeholder="e.g. gst_number, industry_licence"
//                           value={newRequiredFieldName}
//                           onChange={(e) => setNewRequiredFieldName(e.target.value)}
//                           onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomRequiredField())}
//                         />
//                         <button type="button" onClick={handleAddCustomRequiredField} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">Add</button>
//                       </div>
//                     </div>

//                     {/* Custom fields active display */}
//                     {localRequiredFields.filter(f => ![
//                       'account_name', 'pic', 'vertical', 'department', 'designation', 'business', 'region', 'mobile_number', 'email_id', 'location', 'address'
//                     ].includes(f)).length > 0 && (
//                       <div className="border-t border-slate-100 pt-3">
//                         <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Active Custom Rules</label>
//                         <div className="flex flex-wrap gap-1.5">
//                           {localRequiredFields.filter(f => ![
//                             'account_name', 'pic', 'vertical', 'department', 'designation', 'business', 'region', 'mobile_number', 'email_id', 'location', 'address'
//                           ].includes(f)).map(cf => (
//                             <span 
//                               key={cf} 
//                               className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-700 group hover:border-red-200 hover:bg-red-50 transition-all"
//                             >
//                               {cf}
//                               <button type="button" onClick={() => setLocalRequiredFields(localRequiredFields.filter(f => f !== cf))} className="text-slate-400 hover:text-red-500 font-bold ml-1.5">
//                                 <X size={10} />
//                               </button>
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                   </div>

//                   <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
//                     <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border-2 border-slate-200 text-slate-600 rounded-xl text-xs font-bold">Close</button>
//                     <button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }} className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-100">Save & Apply</button>
//                   </div>

//                 </div>
//               </div>
//             )}

//           </div>
//         )}

//         {false && (
//           <Card>
//             <CardHeader
//               gradient="bg-gradient-to-r from-indigo-600 to-violet-500"
//               icon={<SettingsIcon size={15} color="white" />}
//               title="Account Form Field Settings"
//               desc="Configure verticals, dropdown options, and required fields"
//             />
//             <div className="px-5 py-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-xs font-semibold text-slate-600">Verticals (Vertical: Sub1, Sub2)</label>
//                 <textarea className={inputBase} value={verticalText} onChange={(e) => setVerticalText(e.target.value)} rows={8} />
//               </div>
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-xs font-semibold text-slate-600">Regions (one per line)</label>
//                 <textarea className={inputBase} value={regionText} onChange={(e) => setRegionText(e.target.value)} rows={8} />
//               </div>
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-xs font-semibold text-slate-600">Departments (one per line)</label>
//                 <textarea className={inputBase} value={departmentText} onChange={(e) => setDepartmentText(e.target.value)} rows={8} />
//               </div>
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-xs font-semibold text-slate-600">Business Types (one per line)</label>
//                 <textarea className={inputBase} value={businessTypeText} onChange={(e) => setBusinessTypeText(e.target.value)} rows={8} />
//               </div>
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-xs font-semibold text-slate-600">Designations (Title|Code per line)</label>
//                 <textarea className={inputBase} value={designationText} onChange={(e) => setDesignationText(e.target.value)} rows={8} />
//               </div>
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-xs font-semibold text-slate-600">Required Fields (field key per line)</label>
//                 <textarea className={inputBase} value={requiredFieldText} onChange={(e) => setRequiredFieldText(e.target.value)} rows={8} />
//               </div>
//               <div className="xl:col-span-2 flex gap-3">
//                 <button type="button" onClick={handleSaveFormFields} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold">
//                   Save Form Settings
//                 </button>
//                 <button type="button" onClick={() => dispatch(resetAccountFormSettings())} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold">
//                   Reset Defaults
//                 </button>
//               </div>
//               {fieldSaveMsg && (
//                 <div className="xl:col-span-2 px-3 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold">
//                   {fieldSaveMsg}
//                 </div>
//               )}
//               <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
//                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sub-Vertical Preview (Arranged)</p>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   {accountFormSettings.verticals.map((vertical) => (
//                     <div key={vertical.category} className="text-xs text-slate-700">
//                       <span className="font-bold">{vertical.category}</span>
//                       <span className="text-slate-500">: {(vertical.subdivisions || []).map((s) => s.category).join(', ') || 'No sub-verticals'}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </Card>
//         )}
//         {isAdmin && activeTab === 'performance' && (
//           <div className="flex flex-col gap-5">

//             {/* Set Quotas Card */}
//             <Card>
//               <CardHeader
//                 gradient="bg-gradient-to-r from-indigo-600 to-violet-500"
//                 icon={<Award size={15} color="white" />}
//                 title="Set Annual Employee Quotas"
//                 desc="Assign annual sales targets per employee"
//               />
//               <div className="px-5 py-5">
//                 <div className="flex flex-wrap gap-3 items-end">

//                   {/* Select Sales PIC */}
//                   <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
//                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
//                       Select Sales PIC
//                     </label>
//                     <select
//                       className={inputBase}
//                       value={quotaForm.userId}
//                       onChange={e => setQuotaForm({ ...quotaForm, userId: e.target.value })}
//                     >
//                       <option value="">Select Employee...</option>
//                       {employees.map((e: any) => (
//                         <option key={e.id} value={e.id}>{e.username}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Target Amount */}
//                   <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
//                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
//                       Target Amount (₹)
//                     </label>
//                     <input
//                       type="number"
//                       className={inputBase}
//                       placeholder="e.g. 3000000 for 30L"
//                       value={quotaForm.amount}
//                       onChange={e => setQuotaForm({ ...quotaForm, amount: e.target.value })}
//                     />
//                   </div>

//                   {/* Save Button */}
//                   <button
//                     onClick={handleSaveQuota}
//                     disabled={!quotaForm.userId || !quotaForm.amount}
//                     className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
//                   >
//                     <Save size={14} /> Save Quota
//                   </button>
//                 </div>
//               </div>
//             </Card>

//             {/* Attainment Report Card */}
//             <Card>
//               <CardHeader
//                 gradient="bg-gradient-to-r from-emerald-600 to-teal-500"
//                 icon={<Target size={15} color="white" />}
//                 title="Performance Attainment Report"
//                 desc={`Rank A sales & lead conversions · ${formatFYLabel(reportFilterYear)}`}
//                 right={
//                   <div className="flex items-center gap-2">
//                     {/* FY Filter */}
//                     <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2.5 py-1.5">
//                       <Calendar size={13} color="white" />
//                       <select
//                         className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
//                         value={reportFilterYear}
//                         onChange={e => setReportFilterYear(Number(e.target.value))}
//                       >
//                         {fyOptions.map(y => (
//                           <option key={y} value={y} className="text-slate-800 bg-white">{formatFYLabel(y)}</option>
//                         ))}
//                       </select>
//                     </div>
//                     {/* Refresh */}
//                     <button
//                       onClick={() => dispatch(fetchAttainmentReport(reportFilterYear))}
//                       className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-white"
//                     >
//                       <RefreshCw size={14} className={perfLoading ? 'animate-spin' : ''} />
//                     </button>
//                   </div>
//                 }
//               />

//               {/* Table */}
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm min-w-[700px]">
//                   <thead>
//                     <tr className="bg-slate-50 border-b border-slate-200">
//                       {['Employee', 'Target Quota', 'Actual Sales', 'Success Rate %', 'Lead Conversion', 'Status'].map(col => (
//                         <th
//                           key={col}
//                           className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap"
//                         >
//                           {col}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {reportData.length === 0 ? (
//                       <tr>
//                         <td colSpan={6} className="text-center text-sm text-slate-400 py-10">
//                           {perfLoading ? (
//                             <span className="flex items-center justify-center gap-2">
//                               <svg className="animate-spin w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                               </svg>
//                               Loading...
//                             </span>
//                           ) : (
//                             `No data found for ${formatFYLabel(reportFilterYear)}.`
//                           )}
//                         </td>
//                       </tr>
//                     ) : (
//                       reportData.map((row: any) => (
//                         <tr key={row.user_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
//                           {/* Employee */}
//                           <td className="px-4 py-3">
//                             <div className="flex items-center gap-2">
//                               <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
//                                 {row.username.charAt(0).toUpperCase()}
//                               </div>
//                               <span className="font-semibold text-slate-800">{row.full_name}</span>
//                             </div>
//                           </td>
//                           {/* Target */}
//                           <td className="px-4 py-3 text-slate-700 font-medium">
//                             ₹{(row.target / 100000).toFixed(1)}L
//                           </td>
//                           {/* Actual */}
//                           <td className="px-4 py-3 text-slate-700 font-medium">
//                             ₹{(row.actual_sales / 100000).toFixed(1)}L
//                           </td>
//                           {/* Success Rate */}
//                           <td className="px-4 py-3">
//                             <span
//                               className="font-bold text-sm"
//                               style={{ color: row.sales_success_rate >= 100 ? '#10B981' : '#4F46E5' }}
//                             >
//                               {row.sales_success_rate}%
//                             </span>
//                           </td>
//                           {/* Lead Conversion */}
//                           <td className="px-4 py-3">
//                             <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-semibold">
//                               {row.converted_leads}/{row.total_leads} Leads ({row.funnel_conv_rate}%)
//                             </span>
//                           </td>
//                           {/* Status */}
//                           <td className="px-4 py-3">
//                             <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
//                               row.sales_success_rate >= 100
//                                 ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
//                                 : 'bg-amber-50 text-amber-700 border-amber-200'
//                             }`}>
//                               {row.sales_success_rate >= 100 ? 'Achieved' : 'In Progress'}
//                             </span>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Footer note */}
//               <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
//                 <Info size={12} className="shrink-0" />
//                 Success Rate = (Rank A Sales / Quota) · Funnel Rate = (Rank A Leads / Total Leads) · {formatFYLabel(reportFilterYear)}
//               </div>
//             </Card>

//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// interface DropdownTabsProps {
//   localRegions: string[];
//   setLocalRegions: React.Dispatch<React.SetStateAction<string[]>>;
//   localDepartments: string[];
//   setLocalDepartments: React.Dispatch<React.SetStateAction<string[]>>;
//   localBusinessTypes: string[];
//   setLocalBusinessTypes: React.Dispatch<React.SetStateAction<string[]>>;
//   inputBase: string;
//   handleAddRegion: () => void;
//   handleDeleteRegion: (region: string) => void;
//   newRegionName: string;
//   setNewRegionName: (val: string) => void;
//   handleAddDepartment: () => void;
//   handleDeleteDepartment: (dept: string) => void;
//   newDepartmentName: string;
//   setNewDepartmentName: (val: string) => void;
//   handleAddBusinessType: () => void;
//   handleDeleteBusinessType: (type: string) => void;
//   newBusinessTypeName: string;
//   setNewBusinessTypeName: (val: string) => void;
// }

// const DropdownTabs: React.FC<DropdownTabsProps> = ({
//   localRegions,
//   localDepartments,
//   localBusinessTypes,
//   handleAddRegion,
//   handleDeleteRegion,
//   newRegionName,
//   setNewRegionName,
//   handleAddDepartment,
//   handleDeleteDepartment,
//   newDepartmentName,
//   setNewDepartmentName,
//   handleAddBusinessType,
//   handleDeleteBusinessType,
//   newBusinessTypeName,
//   setNewBusinessTypeName,
// }) => {
//   const [activeSubTab, setActiveSubTab] = useState<'regions' | 'departments' | 'businessTypes'>('regions');

//   return (
//     <div className="px-6 py-5 flex flex-col gap-4">
//       {/* Tab Buttons */}
//       <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
//         {(['regions', 'departments', 'businessTypes'] as const).map((tab) => (
//           <button
//             key={tab}
//             type="button"
//             onClick={() => setActiveSubTab(tab)}
//             className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
//               activeSubTab === tab
//                 ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
//                 : 'text-slate-500 hover:text-slate-800'
//             }`}
//           >
//             {tab === 'businessTypes' ? 'Business Types' : tab}
//           </button>
//         ))}
//       </div>

//       {/* Regions Tab Content */}
//       {activeSubTab === 'regions' && (
//         <div className="flex flex-col gap-3">
//           <div className="flex gap-2">
//             <input
//               className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-300"
//               type="text"
//               placeholder="Add Region (e.g. North, EMEA)..."
//               value={newRegionName}
//               onChange={(e) => setNewRegionName(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRegion())}
//             />
//             <button
//               type="button"
//               onClick={handleAddRegion}
//               className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all"
//             >
//               Add
//             </button>
//           </div>
//           <div className="flex flex-wrap gap-1.5 max-h-[180px] overflow-y-auto pr-1">
//             {localRegions.length === 0 ? (
//               <span className="text-xs text-slate-400 italic">No regions added</span>
//             ) : (
//               localRegions.map((region) => (
//                 <span
//                   key={region}
//                   className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:border-red-200 transition-all hover:bg-slate-50 group"
//                 >
//                   {region}
//                   <button
//                     type="button"
//                     onClick={() => handleDeleteRegion(region)}
//                     className="text-slate-300 hover:text-red-500 font-bold ml-1 transition-colors"
//                   >
//                     <X size={10} />
//                   </button>
//                 </span>
//               ))
//             )}
//           </div>
//         </div>
//       )}

//       {/* Departments Tab Content */}
//       {activeSubTab === 'departments' && (
//         <div className="flex flex-col gap-3">
//           <div className="flex gap-2">
//             <input
//               className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-300"
//               type="text"
//               placeholder="Add Department (e.g. Sales, HR)..."
//               value={newDepartmentName}
//               onChange={(e) => setNewDepartmentName(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDepartment())}
//             />
//             <button
//               type="button"
//               onClick={handleAddDepartment}
//               className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all"
//             >
//               Add
//             </button>
//           </div>
//           <div className="flex flex-wrap gap-1.5 max-h-[180px] overflow-y-auto pr-1">
//             {localDepartments.length === 0 ? (
//               <span className="text-xs text-slate-400 italic">No departments added</span>
//             ) : (
//               localDepartments.map((dept) => (
//                 <span
//                   key={dept}
//                   className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:border-red-200 transition-all hover:bg-slate-50 group"
//                 >
//                   {dept}
//                   <button
//                     type="button"
//                     onClick={() => handleDeleteDepartment(dept)}
//                     className="text-slate-300 hover:text-red-500 font-bold ml-1 transition-colors"
//                   >
//                     <X size={10} />
//                   </button>
//                 </span>
//               ))
//             )}
//           </div>
//         </div>
//       )}

//       {/* Business Types Tab Content */}
//       {activeSubTab === 'businessTypes' && (
//         <div className="flex flex-col gap-3">
//           <div className="flex gap-2">
//             <input
//               className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-300"
//               type="text"
//               placeholder="Add Business Type (e.g. Enterprise, SMB)..."
//               value={newBusinessTypeName}
//               onChange={(e) => setNewBusinessTypeName(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBusinessType())}
//             />
//             <button
//               type="button"
//               onClick={handleAddBusinessType}
//               className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all"
//             >
//               Add
//             </button>
//           </div>
//           <div className="flex flex-wrap gap-1.5 max-h-[180px] overflow-y-auto pr-1">
//             {localBusinessTypes.length === 0 ? (
//               <span className="text-xs text-slate-400 italic">No business types added</span>
//             ) : (
//               localBusinessTypes.map((type) => (
//                 <span
//                   key={type}
//                   className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:border-red-200 transition-all hover:bg-slate-50 group"
//                 >
//                   {type}
//                   <button
//                     type="button"
//                     onClick={() => handleDeleteBusinessType(type)}
//                     className="text-slate-300 hover:text-red-500 font-bold ml-1 transition-colors"
//                   >
//                     <X size={10} />
//                   </button>
//                 </span>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Settings;






import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Target, Award, Save, RefreshCw, BarChart2,
  Settings as SettingsIcon, ShieldCheck,
  Info, Calendar, Plus, Trash2, X, ChevronDown, ChevronUp, RotateCcw, Check, AlertCircle, Layers, MapPin, Briefcase, Building, CheckSquare, TrendingUp, ArrowRight, Building2, Pencil
} from 'lucide-react';
import type { AppDispatch, RootState } from '../../../app/store';
import {
  changePassword,
  clearSettingsState,
  fetchPerfEmployees,
  fetchAttainmentReport,
  savePerformanceQuota,
} from './slice/settingsSlice';
import {
  resetAccountFormSettings,
  updateAccountFormSettings,
  fetchAccountFormSettings,
  saveAccountFormSettings,
  type VerticalOption,
  type DesignationOption,
} from '../../FormSettings/formSettingsSlice';
import {
  fetchGlobalCategories,
  addGlobalCategory,
  addGlobalSubCategory,
  deleteGlobalCategory,
  deleteGlobalSubCategory,
} from '../../Budget/slice/budgetSlice';
import { getAllCities, getAllStates } from '../../CommonAPI/Common';

// ── Eye Icons ─────────────────────────────────────────────────────────────────
const EyeOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" x2="23" y2="23" />
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────
interface PasswordForm { old_password: string; new_password: string; confirm_password: string; }
interface ShowFields { old_password: boolean; new_password: boolean; confirm_password: boolean; }

// ── Helpers ───────────────────────────────────────────────────────────────────
const getCurrentFY = (): number => {
  const today = new Date();
  const month = today.getMonth() + 1;
  return month >= 4 ? today.getFullYear() : today.getFullYear() - 1;
};

const getFYOptions = (): number[] => {
  const current = getCurrentFY();
  return [current - 3, current - 2, current - 1, current, current + 1, current + 2];
};

const formatFYLabel = (year: number): string =>
  `FY ${year}–${String(year + 1).slice(2)}`;

// ── Password strength ─────────────────────────────────────────────────────────
const getStrength = (pw: string): { level: number; label: string; color: string; tailwind: string } => {
  if (!pw) return { level: 0, label: '', color: '', tailwind: '' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 2) return { level: 1, label: 'Weak',   color: '#EF4444', tailwind: 'bg-red-500'    };
  if (s <= 3) return { level: 2, label: 'Fair',   color: '#F59E0B', tailwind: 'bg-amber-400'  };
  if (s <= 4) return { level: 3, label: 'Good',   color: '#3B82F6', tailwind: 'bg-blue-500'   };
  return             { level: 4, label: 'Strong', color: '#10B981', tailwind: 'bg-emerald-500' };
};

const DOT_COLORS = ['#6366F1', '#0D9488', '#EA580C', '#7C3AED', '#0284C7', '#059669'];

// ── Shared style helpers ──────────────────────────────────────────────────────
const inputBase =
  'w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 bg-white/95 text-sm text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200';

// ── Card shell ────────────────────────────────────────────────────────────────
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.08)] hover:shadow-[0_16px_34px_rgba(15,23,42,0.12)] transition-shadow duration-300 overflow-hidden ${className}`}>
    {children}
  </div>
);

// ── Card gradient header ──────────────────────────────────────────────────────
const CardHeader: React.FC<{
  gradient: string;
  icon: React.ReactNode;
  title: string;
  desc?: string;
  right?: React.ReactNode;
}> = ({ gradient, icon, title, desc, right }) => (
  <div className={`${gradient} px-5 py-4 flex items-center gap-3`}>
    <div className="w-9 h-9 bg-white/20 ring-1 ring-white/30 rounded-xl flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h2 className="text-sm font-extrabold tracking-wide text-white m-0 leading-tight">{title}</h2>
      {desc && <p className="text-white/80 text-xs m-0 mt-0.5">{desc}</p>}
    </div>
    {right && <div className="shrink-0">{right}</div>}
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────
const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // -- Selectors --
  const { loading, error, success, employees, reportData, perfLoading } = useSelector(
    (state: RootState) => state.settings
  );
  const authUser =
    useSelector((state: RootState) => (state as any).auth?.user) ||
    useSelector((state: RootState) => (state as any).userLoginAuth?.user);
  const { categories: globalCategories } = useSelector((state: RootState) => state.budget);

  const isAdmin = authUser?.role === 'admin';

  // -- Component States --
  const [form, setForm] = useState<PasswordForm>({ old_password: '', new_password: '', confirm_password: '' });
  const [show, setShow] = useState<ShowFields>({ old_password: false, new_password: false, confirm_password: false });
  const [activeTab, setActiveTab] = useState<'password' | 'profile' | 'categories' | 'formFields' | 'performance'>('password');
  const [localError, setLocalError] = useState('');

  // ── Category state ──
  const [newCatName, setNewCatName] = useState('');
  const [newSubNames, setNewSubNames] = useState<Record<number, string>>({});
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState('');

  // ── Performance Management State ──
  const [quotaForm, setQuotaForm] = useState({ userId: '', amount: '', year: getCurrentFY() });
  const [reportFilterYear, setReportFilterYear] = useState<number>(getCurrentFY());
  const accountFormSettings = useSelector((state: RootState) => state.formSettings.account);
  // ── Interactive Form Fields State ──
  const [localVerticals, setLocalVerticals] = useState<VerticalOption[]>([]);
  const [localRegions, setLocalRegions] = useState<string[]>([]);
  const [localDepartments, setLocalDepartments] = useState<string[]>([]);
  const [localBusinessTypes, setLocalBusinessTypes] = useState<string[]>([]);
  const [localDesignations, setLocalDesignations] = useState<DesignationOption[]>([]);
  const [localRequiredFields, setLocalRequiredFields] = useState<string[]>([]);
  const [localSalesTypes, setLocalSalesTypes] = useState<string[]>([]);
  const [localOpportunities, setLocalOpportunities] = useState<string[]>([]);
  const [localProductCategories, setLocalProductCategories] = useState<VerticalOption[]>([]);
  const [localStates, setLocalStates] = useState<string[]>([]);
  const [localCities, setLocalCities] = useState<string[]>([]);
  const [localStateCities, setLocalStateCities] = useState<Record<string, string[]>>({});
  const [localNextActions, setLocalNextActions] = useState<string[]>([]);

  // Inputs for adding new options
  const [newVerticalName, setNewVerticalName] = useState('');
  const [newSubdivisionNames, setNewSubdivisionNames] = useState<Record<string, string>>({});
  const [expandedVerticals, setExpandedVerticals] = useState<Record<string, boolean>>({});
  const [newRegionName, setNewRegionName] = useState('');
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newBusinessTypeName, setNewBusinessTypeName] = useState('');
  const [newDesignationTitle, setNewDesignationTitle] = useState('');
  const [newDesignationAbbreviation, setNewDesignationAbbreviation] = useState('');
  const [newRequiredFieldName, setNewRequiredFieldName] = useState('');
  const [activeModal, setActiveModal] = useState<'verticals' | 'regions' | 'departments' | 'businessTypes' | 'designations' | 'requiredFields' | 'productCategories' | 'salesTypes' | 'opportunities' | 'states' | 'cities' | 'nextActions' | null>(null);
  const [selectedVerticalForSubs, setSelectedVerticalForSubs] = useState<string | null>(null);
  const [selectedOpportunityForProductTree, setSelectedOpportunityForProductTree] = useState<string | null>(null);
  const [selectedProductCategoryLevel1, setSelectedProductCategoryLevel1] = useState<string | null>(null);
  const [selectedProductCategoryLevel2, setSelectedProductCategoryLevel2] = useState<string | null>(null);
  const [newSalesType, setNewSalesType] = useState('');
  const [newOpportunity, setNewOpportunity] = useState('');
  const [newProductCategory1Name, setNewProductCategory1Name] = useState('');
  const [newProductCategory2Name, setNewProductCategory2Name] = useState('');
  const [newProductCategory3Name, setNewProductCategory3Name] = useState('');
  const [newSettingsState, setNewSettingsState] = useState('');
  const [selectedCityState, setSelectedCityState] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newNextAction, setNewNextAction] = useState('');
  const [verticalText, setVerticalText] = useState('');
  const [regionText, setRegionText] = useState('');
  const [departmentText, setDepartmentText] = useState('');
  const [businessTypeText, setBusinessTypeText] = useState('');
  const [designationText, setDesignationText] = useState('');
  const [requiredFieldText, setRequiredFieldText] = useState('');
  const [salesTypeText, setSalesTypeText] = useState('');
  const [opportunityText, setOpportunityText] = useState('');
  const [productCategoryText, setProductCategoryText] = useState('');
  const [stateText, setStateText] = useState('');
  const [cityText, setCityText] = useState('');
  const [nextActionText, setNextActionText] = useState('');
  const [fieldSaveMsg, setFieldSaveMsg] = useState('');
  const cityStateOptions = useMemo(() => {
    const masterStates = getAllStates().map((s) => s.name);
    const configuredStates = localStates || [];
    const mappedStates = Object.keys(localStateCities || {});
    return Array.from(new Set([...masterStates, ...configuredStates, ...mappedStates])).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [localStates, localStateCities]);

  // ── Validation ──
  const validatePassword = (pw: string): string => {
    if (pw.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(pw)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(pw)) return 'Password must contain at least one lowercase letter.';
    if (!/[0-9]/.test(pw)) return 'Password must contain at least one number.';
    if (!/[^A-Za-z0-9]/.test(pw)) return 'Password must contain at least one special character (!@#$%^&*).';
    return '';
  };

  const serializeProductCategories = (categories: VerticalOption[]) => {
    const lines: string[] = [];
    categories.forEach((opportunity) => {
      const level1 = opportunity.subdivisions || [];
      if (!level1.length) {
        lines.push(opportunity.category);
        return;
      }
      level1.forEach((cat1) => {
        const level2 = cat1.subdivisions || [];
        if (!level2.length) {
          lines.push(`${opportunity.category} > ${cat1.category}`);
          return;
        }
        level2.forEach((cat2) => {
          const level3 = cat2.subdivisions || [];
          if (!level3.length) {
            lines.push(`${opportunity.category} > ${cat1.category} > ${cat2.category}`);
            return;
          }
          level3.forEach((cat3) => {
            lines.push(`${opportunity.category} > ${cat1.category} > ${cat2.category} > ${cat3.category}`);
          });
        });
      });
    });
    return lines.join('\n');
  };

  const updateOpportunityAndProductCategoryState = (
    updatedProductCategories: VerticalOption[],
    updatedOpportunities: string[] = localOpportunities,
  ) => {
    setLocalOpportunities(updatedOpportunities);
    setOpportunityText(updatedOpportunities.join('\n'));
    setLocalProductCategories(updatedProductCategories);
    setProductCategoryText(serializeProductCategories(updatedProductCategories));
  };

  const isDuplicateName = (items: string[], nextValue: string, currentValue?: string) => {
    const normalizedNext = nextValue.trim().toLowerCase();
    const normalizedCurrent = currentValue?.trim().toLowerCase();
    return items.some((item) => {
      const normalizedItem = item.trim().toLowerCase();
      if (normalizedCurrent && normalizedItem === normalizedCurrent) return false;
      return normalizedItem === normalizedNext;
    });
  };

  useEffect(() => () => { dispatch(clearSettingsState()); }, [dispatch]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => dispatch(clearSettingsState()), 4000);
      return () => clearTimeout(t);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (activeTab === 'formFields') {
      dispatch(fetchAccountFormSettings() as any);
    }
    if (activeTab === 'performance' && isAdmin) {
      dispatch(fetchPerfEmployees());
      dispatch(fetchAttainmentReport(reportFilterYear));
    }
  }, [activeTab, isAdmin, dispatch, reportFilterYear]);

  useEffect(() => {
    const toVerticalLine = (vertical: VerticalOption) =>
      `${vertical.category}${vertical.subdivisions?.length ? `: ${vertical.subdivisions.map((s) => s.category).join(', ')}` : ''}`;
    setLocalVerticals(accountFormSettings.verticals || []);
    setLocalRegions(accountFormSettings.regions || []);
    setLocalDepartments(accountFormSettings.departments || []);
    setLocalBusinessTypes(accountFormSettings.businessTypes || []);
    setLocalDesignations(accountFormSettings.designations || []);
    setLocalRequiredFields(accountFormSettings.requiredFields || []);
    setLocalSalesTypes(accountFormSettings.salesTypes || []);
    setLocalOpportunities(accountFormSettings.opportunities || []);
    setLocalProductCategories(accountFormSettings.productCategories || []);
    setLocalStates(accountFormSettings.states || []);
    setLocalCities(accountFormSettings.cities || []);
    setLocalStateCities(accountFormSettings.stateCities || {});
    setLocalNextActions(accountFormSettings.nextActions || []);
    setSalesTypeText((accountFormSettings.salesTypes || []).join('\n'));
    setOpportunityText((accountFormSettings.opportunities || []).join('\n'));
    setProductCategoryText(serializeProductCategories(accountFormSettings.productCategories || []));
    setStateText((accountFormSettings.states || []).join('\n'));
    setCityText((accountFormSettings.cities || []).join('\n'));
    setNextActionText((accountFormSettings.nextActions || []).join('\n'));
    // Bypassed old text setters for interactive UI state




  }, [accountFormSettings]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (localError) setLocalError('');
    if (error || success) dispatch(clearSettingsState());
  };

  const toggleShow = (f: keyof ShowFields) => setShow(prev => ({ ...prev, [f]: !prev[f] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validatePassword(form.new_password);
    if (validationError) { setLocalError(validationError); return; }
    if (form.new_password !== form.confirm_password) { setLocalError('Passwords do not match.'); return; }
    const result = await dispatch(changePassword(form));
    if (changePassword.fulfilled.match(result)) {
      setForm({ old_password: '', new_password: '', confirm_password: '' });
      setLocalError('');
    }
  };

  // ── Category handlers ─────────────────────────────────────────────────────
  const handleAddCategory = async () => {
    const name = newCatName.trim();
    if (!name) return;
    setCatLoading(true); setCatError('');
    try { await dispatch(addGlobalCategory(name)); setNewCatName(''); }
    catch { setCatError('Failed to add category.'); }
    finally { setCatLoading(false); }
  };

  const handleAddSubCategory = async (catId: number) => {
    const name = (newSubNames[catId] || '').trim();
    if (!name) return;
    setCatLoading(true); setCatError('');
    try {
      await dispatch(addGlobalSubCategory({ categoryId: catId, name }));
      setNewSubNames(prev => ({ ...prev, [catId]: '' }));
    } catch { setCatError('Failed to add subcategory.'); }
    finally { setCatLoading(false); }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Delete this category and all its subcategories?')) return;
    setCatLoading(true);
    try { await dispatch(deleteGlobalCategory(id)); }
    finally { setCatLoading(false); }
  };

  const handleDeleteSubCategory = async (id: number) => {
    setCatLoading(true);
    try { await dispatch(deleteGlobalSubCategory(id)); }
    finally { setCatLoading(false); }
  };

  // ── Performance handlers ──────────────────────────────────────────────────
  const handleSaveQuota = async () => {
    if (!quotaForm.userId || !quotaForm.amount) return;
    const result = await dispatch(savePerformanceQuota({
      user_id: quotaForm.userId,
      target_amount: quotaForm.amount,
      year: quotaForm.year,
    }));
    if (savePerformanceQuota.fulfilled.match(result)) {
      dispatch(fetchAttainmentReport(reportFilterYear));
      setQuotaForm({ ...quotaForm, amount: '', userId: '' });
    }
  };

  const parseList = (value: string) =>
    value.split('\n').map((line) => line.trim()).filter(Boolean);

  const uniqueSorted = (items: string[]) =>
    [...new Set(items.map((item) => item.trim()).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  // ── Interactive Form Field Action Handlers ──
  const handleAddVertical = () => {
    const val = newVerticalName.trim();
    if (!val) return;
    if (localVerticals.some(v => v.category.toLowerCase() === val.toLowerCase())) {
      alert('Vertical category already exists!');
      return;
    }
    setLocalVerticals([...localVerticals, { category: val, subdivisions: [] }]);
    setNewVerticalName('');
    setExpandedVerticals(prev => ({ ...prev, [val]: true }));
  };

  const handleDeleteVertical = (categoryName: string) => {
    if (window.confirm(`Delete the vertical "${categoryName}" and all its subdivisions?`)) {
      setLocalVerticals(localVerticals.filter(v => v.category !== categoryName));
    }
  };

  const handleAddSubdivision = (categoryName: string) => {
    const subVal = (newSubdivisionNames[categoryName] || '').trim();
    if (!subVal) return;
    setLocalVerticals(localVerticals.map(v => {
      if (v.category === categoryName) {
        const subs = v.subdivisions || [];
        if (subs.some(s => s.category.toLowerCase() === subVal.toLowerCase())) {
          alert('Subdivision already exists in this vertical!');
          return v;
        }
        return {
          ...v,
          subdivisions: [...subs, { category: subVal }]
        };
      }
      return v;
    }));
    setNewSubdivisionNames(prev => ({ ...prev, [categoryName]: '' }));
  };

  const handleDeleteSubdivision = (categoryName: string, subCategoryName: string) => {
    setLocalVerticals(localVerticals.map(v => {
      if (v.category === categoryName) {
        return {
          ...v,
          subdivisions: (v.subdivisions || []).filter(s => s.category !== subCategoryName)
        };
      }
      return v;
    }));
  };

  const handleAddRegion = () => {
    const val = newRegionName.trim();
    if (!val) return;
    if (localRegions.some(r => r.toLowerCase() === val.toLowerCase())) {
      alert('Region already exists!');
      return;
    }
    setLocalRegions([...localRegions, val]);
    setNewRegionName('');
  };

  const handleDeleteRegion = (region: string) => {
    setLocalRegions(localRegions.filter(r => r !== region));
  };

  const handleAddDepartment = () => {
    const val = newDepartmentName.trim();
    if (!val) return;
    if (localDepartments.some(d => d.toLowerCase() === val.toLowerCase())) {
      alert('Department already exists!');
      return;
    }
    setLocalDepartments([...localDepartments, val]);
    setNewDepartmentName('');
  };

  const handleDeleteDepartment = (dept: string) => {
    setLocalDepartments(localDepartments.filter(d => d !== dept));
  };

  const handleAddBusinessType = () => {
    const val = newBusinessTypeName.trim();
    if (!val) return;
    if (localBusinessTypes.some(b => b.toLowerCase() === val.toLowerCase())) {
      alert('Business type already exists!');
      return;
    }
    setLocalBusinessTypes([...localBusinessTypes, val]);
    setNewBusinessTypeName('');
  };

  const handleDeleteBusinessType = (type: string) => {
    setLocalBusinessTypes(localBusinessTypes.filter(b => b !== type));
  };

  const handleAddDesignation = () => {
    const title = newDesignationTitle.trim();
    const abbrev = newDesignationAbbreviation.trim();
    if (!title || !abbrev) return;
    if (localDesignations.some(d => d.title.toLowerCase() === title.toLowerCase() || d.abbreviation.toLowerCase() === abbrev.toLowerCase())) {
      alert('Designation title or abbreviation already exists!');
      return;
    }
    setLocalDesignations([...localDesignations, { title, abbreviation: abbrev }]);
    setNewDesignationTitle('');
    setNewDesignationAbbreviation('');
  };

  const handleDeleteDesignation = (abbrev: string) => {
    setLocalDesignations(localDesignations.filter(d => d.abbreviation !== abbrev));
  };

  const toggleRequiredField = (fieldKey: string) => {
    if (localRequiredFields.includes(fieldKey)) {
      setLocalRequiredFields(localRequiredFields.filter(f => f !== fieldKey));
    } else {
      setLocalRequiredFields([...localRequiredFields, fieldKey]);
    }
  };

  const handleAddCustomRequiredField = () => {
    const val = newRequiredFieldName.trim();
    if (!val) return;
    if (localRequiredFields.includes(val)) {
      alert('Field already marked as required!');
      return;
    }
    setLocalRequiredFields([...localRequiredFields, val]);
    setNewRequiredFieldName('');
  };

  const handleAddSalesType = () => {
    const val = newSalesType.trim();
    if (!val) return;
    if (localSalesTypes.some(x => x.toLowerCase() === val.toLowerCase())) {
      alert('Sales type already exists!');
      return;
    }
    const updated = [...localSalesTypes, val];
    setLocalSalesTypes(updated);
    setSalesTypeText(updated.join('\n'));
    setNewSalesType('');
  };

  const handleDeleteSalesType = (val: string) => {
    const updated = localSalesTypes.filter(x => x !== val);
    setLocalSalesTypes(updated);
    setSalesTypeText(updated.join('\n'));
  };

  const handleAddOpportunity = () => {
    const val = newOpportunity.trim();
    if (!val) return;
    if (localOpportunities.some(x => x.toLowerCase() === val.toLowerCase())) {
      alert('Opportunity already exists!');
      return;
    }
    const updatedOpportunities = [...localOpportunities, val];
    const updatedProductCategories = localProductCategories.some((item) => item.category.toLowerCase() === val.toLowerCase())
      ? localProductCategories
      : [...localProductCategories, { category: val, subdivisions: [] }];

    setLocalOpportunities(updatedOpportunities);
    setOpportunityText(updatedOpportunities.join('\n'));
    setLocalProductCategories(updatedProductCategories);
    setProductCategoryText(serializeProductCategories(updatedProductCategories));
    setNewOpportunity('');
  };

  const handleEditOpportunity = (currentValue: string) => {
    const nextValue = window.prompt('Edit opportunity name', currentValue)?.trim();
    if (!nextValue || nextValue === currentValue) return;

    if (isDuplicateName(productOpportunityOptions, nextValue, currentValue)) {
      alert('Opportunity already exists!');
      return;
    }

    const updatedOpportunities = localOpportunities.map((item) => (item === currentValue ? nextValue : item));
    const updatedProductCategories = localProductCategories.map((item) =>
      item.category === currentValue ? { ...item, category: nextValue } : item,
    );

    updateOpportunityAndProductCategoryState(updatedProductCategories, updatedOpportunities);

    if (selectedOpportunityForProductTree === currentValue) {
      setSelectedOpportunityForProductTree(nextValue);
    }
  };

  const handleDeleteOpportunity = (val: string) => {
    if (!window.confirm(`Delete "${val}" and all its product categories?`)) return;

    const updatedOpportunities = localOpportunities.filter(x => x !== val);
    const updatedProductCategories = localProductCategories.filter(x => x.category !== val);
    updateOpportunityAndProductCategoryState(updatedProductCategories, updatedOpportunities);

    if (selectedOpportunityForProductTree === val) {
      setSelectedOpportunityForProductTree(null);
      setSelectedProductCategoryLevel1(null);
      setSelectedProductCategoryLevel2(null);
    }
  };

  const handleAddProductCategory1 = () => {
    if (!selectedOpportunityForProductTree) {
      alert('Select an opportunity first.');
      return;
    }
    const val = newProductCategory1Name.trim();
    if (!val) return;
    const existingLevel1 = localProductCategories
      .find((item) => item.category === selectedOpportunityForProductTree)
      ?.subdivisions || [];
    if (existingLevel1.some((entry) => entry.category.toLowerCase() === val.toLowerCase())) {
      alert('Product Category 1 already exists for this opportunity!');
      return;
    }

    const updated = localProductCategories.map((item) => {
      if (item.category !== selectedOpportunityForProductTree) return item;
      const level1 = item.subdivisions || [];
      return { ...item, subdivisions: [...level1, { category: val, subdivisions: [] }] };
    });

    const exists = localProductCategories.some((item) => item.category === selectedOpportunityForProductTree);
    const finalUpdated = exists
      ? updated
      : [...localProductCategories, { category: selectedOpportunityForProductTree, subdivisions: [{ category: val, subdivisions: [] }] }];

    setLocalProductCategories(finalUpdated);
    setProductCategoryText(serializeProductCategories(finalUpdated));
    setSelectedProductCategoryLevel1(val);
    setSelectedProductCategoryLevel2(null);
    setNewProductCategory1Name('');
  };

  const handleEditProductCategory1 = (currentValue: string) => {
    if (!selectedOpportunityForProductTree) return;

    const nextValue = window.prompt('Edit Product Category 1', currentValue)?.trim();
    if (!nextValue || nextValue === currentValue) return;

    if (isDuplicateName(productCategory1Options.map((item) => item.category), nextValue, currentValue)) {
      alert('Product Category 1 already exists for this opportunity!');
      return;
    }

    const updated = localProductCategories.map((item) => {
      if (item.category !== selectedOpportunityForProductTree) return item;
      return {
        ...item,
        subdivisions: (item.subdivisions || []).map((entry) =>
          entry.category === currentValue ? { ...entry, category: nextValue } : entry,
        ),
      };
    });

    setLocalProductCategories(updated);
    setProductCategoryText(serializeProductCategories(updated));
    if (selectedProductCategoryLevel1 === currentValue) {
      setSelectedProductCategoryLevel1(nextValue);
    }
  };

  const handleDeleteProductCategory1 = (category1Name: string) => {
    if (!selectedOpportunityForProductTree) return;
    if (!window.confirm(`Delete "${category1Name}" and all its child categories?`)) return;

    const updated = localProductCategories.map((item) => {
      if (item.category !== selectedOpportunityForProductTree) return item;
      return {
        ...item,
        subdivisions: (item.subdivisions || []).filter((entry) => entry.category !== category1Name),
      };
    });

    setLocalProductCategories(updated);
    setProductCategoryText(serializeProductCategories(updated));
    if (selectedProductCategoryLevel1 === category1Name) {
      setSelectedProductCategoryLevel1(null);
      setSelectedProductCategoryLevel2(null);
    }
  };

  const handleAddProductCategory2 = () => {
    if (!selectedOpportunityForProductTree || !selectedProductCategoryLevel1) {
      alert('Select Product Category 1 first.');
      return;
    }
    const val = newProductCategory2Name.trim();
    if (!val) return;
    const existingLevel2 = localProductCategories
      .find((item) => item.category === selectedOpportunityForProductTree)
      ?.subdivisions
      ?.find((level1) => level1.category === selectedProductCategoryLevel1)
      ?.subdivisions || [];
    if (existingLevel2.some((entry) => entry.category.toLowerCase() === val.toLowerCase())) {
      alert('Product Category 2 already exists for this Product Category 1!');
      return;
    }

    const updated = localProductCategories.map((item) => {
      if (item.category !== selectedOpportunityForProductTree) return item;
      return {
        ...item,
        subdivisions: (item.subdivisions || []).map((level1) => {
          if (level1.category !== selectedProductCategoryLevel1) return level1;
          const level2 = level1.subdivisions || [];
          return { ...level1, subdivisions: [...level2, { category: val, subdivisions: [] }] };
        }),
      };
    });

    setLocalProductCategories(updated);
    setProductCategoryText(serializeProductCategories(updated));
    setSelectedProductCategoryLevel2(val);
    setNewProductCategory2Name('');
  };

  const handleEditProductCategory2 = (currentValue: string) => {
    if (!selectedOpportunityForProductTree || !selectedProductCategoryLevel1) return;

    const nextValue = window.prompt('Edit Product Category 2', currentValue)?.trim();
    if (!nextValue || nextValue === currentValue) return;

    if (isDuplicateName(productCategory2Options.map((item) => item.category), nextValue, currentValue)) {
      alert('Product Category 2 already exists for this Product Category 1!');
      return;
    }

    const updated = localProductCategories.map((item) => {
      if (item.category !== selectedOpportunityForProductTree) return item;
      return {
        ...item,
        subdivisions: (item.subdivisions || []).map((level1) => {
          if (level1.category !== selectedProductCategoryLevel1) return level1;
          return {
            ...level1,
            subdivisions: (level1.subdivisions || []).map((level2) =>
              level2.category === currentValue ? { ...level2, category: nextValue } : level2,
            ),
          };
        }),
      };
    });

    setLocalProductCategories(updated);
    setProductCategoryText(serializeProductCategories(updated));
    if (selectedProductCategoryLevel2 === currentValue) {
      setSelectedProductCategoryLevel2(nextValue);
    }
  };

  const handleDeleteProductCategory2 = (category2Name: string) => {
    if (!selectedOpportunityForProductTree || !selectedProductCategoryLevel1) return;
    if (!window.confirm(`Delete "${category2Name}" and all its child categories?`)) return;

    const updated = localProductCategories.map((item) => {
      if (item.category !== selectedOpportunityForProductTree) return item;
      return {
        ...item,
        subdivisions: (item.subdivisions || []).map((level1) => {
          if (level1.category !== selectedProductCategoryLevel1) return level1;
          return {
            ...level1,
            subdivisions: (level1.subdivisions || []).filter((level2) => level2.category !== category2Name),
          };
        }),
      };
    });

    setLocalProductCategories(updated);
    setProductCategoryText(serializeProductCategories(updated));
    if (selectedProductCategoryLevel2 === category2Name) {
      setSelectedProductCategoryLevel2(null);
    }
  };

  const handleAddProductCategory3 = () => {
    if (!selectedOpportunityForProductTree || !selectedProductCategoryLevel1 || !selectedProductCategoryLevel2) {
      alert('Select Product Category 2 first.');
      return;
    }
    const val = newProductCategory3Name.trim();
    if (!val) return;
    const existingLevel3 = localProductCategories
      .find((item) => item.category === selectedOpportunityForProductTree)
      ?.subdivisions
      ?.find((level1) => level1.category === selectedProductCategoryLevel1)
      ?.subdivisions
      ?.find((level2) => level2.category === selectedProductCategoryLevel2)
      ?.subdivisions || [];
    if (existingLevel3.some((entry) => entry.category.toLowerCase() === val.toLowerCase())) {
      alert('Product Category 3 already exists for this Product Category 2!');
      return;
    }

    const updated = localProductCategories.map((item) => {
      if (item.category !== selectedOpportunityForProductTree) return item;
      return {
        ...item,
        subdivisions: (item.subdivisions || []).map((level1) => {
          if (level1.category !== selectedProductCategoryLevel1) return level1;
          return {
            ...level1,
            subdivisions: (level1.subdivisions || []).map((level2) => {
              if (level2.category !== selectedProductCategoryLevel2) return level2;
              const level3 = level2.subdivisions || [];
              return { ...level2, subdivisions: [...level3, { category: val }] };
            }),
          };
        }),
      };
    });

    setLocalProductCategories(updated);
    setProductCategoryText(serializeProductCategories(updated));
    setNewProductCategory3Name('');
  };

  const handleEditProductCategory3 = (currentValue: string) => {
    if (!selectedOpportunityForProductTree || !selectedProductCategoryLevel1 || !selectedProductCategoryLevel2) return;

    const nextValue = window.prompt('Edit Product Category 3', currentValue)?.trim();
    if (!nextValue || nextValue === currentValue) return;

    if (isDuplicateName(productCategory3Options.map((item) => item.category), nextValue, currentValue)) {
      alert('Product Category 3 already exists for this Product Category 2!');
      return;
    }

    const updated = localProductCategories.map((item) => {
      if (item.category !== selectedOpportunityForProductTree) return item;
      return {
        ...item,
        subdivisions: (item.subdivisions || []).map((level1) => {
          if (level1.category !== selectedProductCategoryLevel1) return level1;
          return {
            ...level1,
            subdivisions: (level1.subdivisions || []).map((level2) => {
              if (level2.category !== selectedProductCategoryLevel2) return level2;
              return {
                ...level2,
                subdivisions: (level2.subdivisions || []).map((level3) =>
                  level3.category === currentValue ? { ...level3, category: nextValue } : level3,
                ),
              };
            }),
          };
        }),
      };
    });

    setLocalProductCategories(updated);
    setProductCategoryText(serializeProductCategories(updated));
  };

  const handleDeleteProductCategory3 = (category3Name: string) => {
    if (!selectedOpportunityForProductTree || !selectedProductCategoryLevel1 || !selectedProductCategoryLevel2) return;
    if (!window.confirm(`Delete "${category3Name}"?`)) return;

    const updated = localProductCategories.map((item) => {
      if (item.category !== selectedOpportunityForProductTree) return item;
      return {
        ...item,
        subdivisions: (item.subdivisions || []).map((level1) => {
          if (level1.category !== selectedProductCategoryLevel1) return level1;
          return {
            ...level1,
            subdivisions: (level1.subdivisions || []).map((level2) => {
              if (level2.category !== selectedProductCategoryLevel2) return level2;
              return {
                ...level2,
                subdivisions: (level2.subdivisions || []).filter((level3) => level3.category !== category3Name),
              };
            }),
          };
        }),
      };
    });

    setLocalProductCategories(updated);
    setProductCategoryText(serializeProductCategories(updated));
  };

  const productOpportunityOptions = Array.from(new Set([
    ...localOpportunities,
    ...localProductCategories.map((item) => item.category),
  ]));
  const selectedOpportunityCategoryNode = localProductCategories.find((item) => item.category === selectedOpportunityForProductTree);
  const productCategory1Options = selectedOpportunityCategoryNode?.subdivisions || [];
  const selectedProductCategory1Node = productCategory1Options.find((item) => item.category === selectedProductCategoryLevel1);
  const productCategory2Options = selectedProductCategory1Node?.subdivisions || [];
  const selectedProductCategory2Node = productCategory2Options.find((item) => item.category === selectedProductCategoryLevel2);
  const productCategory3Options = selectedProductCategory2Node?.subdivisions || [];
  const productCategory1Count = productCategory1Options.length;
  const productCategory2Count = productCategory2Options.length;
  const productCategory3Count = productCategory3Options.length;

  useEffect(() => {
    if (activeModal !== 'productCategories') return;
    if (!selectedOpportunityForProductTree || !productOpportunityOptions.includes(selectedOpportunityForProductTree)) {
      setSelectedOpportunityForProductTree(productOpportunityOptions[0] || null);
      setSelectedProductCategoryLevel1(null);
      setSelectedProductCategoryLevel2(null);
    }
  }, [activeModal, selectedOpportunityForProductTree, productOpportunityOptions]);

  useEffect(() => {
    if (activeModal !== 'cities') return;
    if (!selectedCityState || !cityStateOptions.includes(selectedCityState)) {
      setSelectedCityState(cityStateOptions[0] || '');
    }
  }, [activeModal, cityStateOptions, selectedCityState]);

  const handleAddSettingsState = () => {
    const val = newSettingsState.trim();
    if (!val) return;
    if (localStates.some(x => x.toLowerCase() === val.toLowerCase())) {
      alert('State already exists!');
      return;
    }
    const updated = [...localStates, val];
    const autoCities = getAllCities(val).map((c) => c.name);
    const updatedStateCities = {
      ...localStateCities,
      [val]: autoCities,
    };
    const mergedCities = [...new Set([...localCities, ...autoCities])];
    setLocalStates(updated);
    setLocalStateCities(updatedStateCities);
    setLocalCities(mergedCities);
    setStateText(updated.join('\n'));
    setCityText(mergedCities.join('\n'));
    setNewSettingsState('');
  };

  const handleDeleteSettingsState = (val: string) => {
    const updated = localStates.filter(x => x !== val);
    const updatedStateCities = { ...localStateCities };
    delete updatedStateCities[val];
    setLocalStates(updated);
    setLocalStateCities(updatedStateCities);
    setStateText(updated.join('\n'));
  };

  const handleAddCity = () => {
    const val = newCity.trim();
    if (!selectedCityState) {
      alert('Please select a state first.');
      return;
    }
    if (!val) return;
    const currentStateCities = localStateCities[selectedCityState] || [];
    if (currentStateCities.some(x => x.toLowerCase() === val.toLowerCase())) {
      alert('City already exists for this state!');
      return;
    }
    const updatedStateCities = {
      ...localStateCities,
      [selectedCityState]: [...currentStateCities, val],
    };
    const mergedCities = [...new Set([...localCities, val])];
    const updatedStates = localStates.includes(selectedCityState)
      ? localStates
      : [...localStates, selectedCityState];

    setLocalStates(updatedStates);
    setLocalStateCities(updatedStateCities);
    setLocalCities(mergedCities);
    setStateText(updatedStates.join('\n'));
    setCityText(mergedCities.join('\n'));
    setNewCity('');
  };

  const handleDeleteCity = (val: string) => {
    if (!selectedCityState) return;
    const updatedStateCities = {
      ...localStateCities,
      [selectedCityState]: (localStateCities[selectedCityState] || []).filter((x) => x !== val),
    };
    const mergedCities = Array.from(
      new Set(Object.values(updatedStateCities).flat())
    );
    setLocalStateCities(updatedStateCities);
    setLocalCities(mergedCities);
    setCityText(mergedCities.join('\n'));
  };

  const handleAddNextAction = () => {
    const val = newNextAction.trim();
    if (!val) return;
    if (localNextActions.some(x => x.toLowerCase() === val.toLowerCase())) {
      alert('Next action already exists!');
      return;
    }
    const updated = [...localNextActions, val];
    setLocalNextActions(updated);
    setNextActionText(updated.join('\n'));
    setNewNextAction('');
  };

  const handleDeleteNextAction = (val: string) => {
    const updated = localNextActions.filter(x => x !== val);
    setLocalNextActions(updated);
    setNextActionText(updated.join('\n'));
  };

  const handleSaveFormFields = async () => {
    const normalizedVerticals = [...localVerticals]
      .map((vertical) => ({
        category: vertical.category.trim(),
        subdivisions: vertical.subdivisions?.length
          ? [...vertical.subdivisions].sort((a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: 'base' }))
          : undefined,
      }))
      .sort((a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: 'base' }));

    const normalizedDesignations = [...localDesignations]
      .reduce((acc: DesignationOption[], current) => {
        const exists = acc.some((item) => item.abbreviation.toLowerCase() === current.abbreviation.toLowerCase());
        return exists ? acc : [...acc, current];
      }, [])
      .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));

    const uniqueSorted = (items: string[]) =>
      [...new Set(items.map((item) => item.trim()).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    const accountPayload = {
      verticals: normalizedVerticals,
      regions: uniqueSorted(localRegions),
      departments: uniqueSorted(localDepartments),
      businessTypes: uniqueSorted(localBusinessTypes),
      designations: normalizedDesignations,
      salesTypes: uniqueSorted(localSalesTypes),
      opportunities: uniqueSorted([...localOpportunities, ...localProductCategories.map((item) => item.category)]),
      productCategories: [...localProductCategories],
      states: uniqueSorted(localStates),
      cities: uniqueSorted(localCities),
      stateCities: localStateCities,
      nextActions: uniqueSorted(localNextActions),
      requiredFields: uniqueSorted(localRequiredFields),
    };

    dispatch(updateAccountFormSettings(accountPayload));
    const result = await dispatch(saveAccountFormSettings(accountPayload));

    if (saveAccountFormSettings.fulfilled.match(result)) {
      setFieldSaveMsg('Form field settings saved successfully.');
    } else {
      setFieldSaveMsg('Saved locally, but server sync failed.');
    }

    setTimeout(() => setFieldSaveMsg(''), 2500);
  };

  const OLD_SAVE_FORM_FIELDS_BYPASS = () => { return; /*
    const parsedVerticals: VerticalOption[] = parseList(verticalText).map((line) => {
      const [head, tail] = line.split(':');
      const category = (head || '').trim();
      const subdivisions = uniqueSorted((tail || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean))
        .map((categoryName) => ({ category: categoryName }));
      return { category, subdivisions: subdivisions.length ? subdivisions : undefined };
    }).filter((item) => item.category);

    const normalizedVerticals = parsedVerticals
      .map((vertical) => ({
        category: vertical.category.trim(),
        subdivisions: vertical.subdivisions?.length
          ? [...vertical.subdivisions].sort((a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: 'base' }))
          : undefined,
      }))
      .sort((a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: 'base' }));

    const parsedDesignations = parseList(designationText).map((line) => {
      const [title, abbreviation] = line.split('|').map((v) => v.trim());
      return { title, abbreviation: abbreviation || title };
    }).filter((item) => item.title);

    const normalizedDesignations = parsedDesignations
      .reduce((acc: { title: string; abbreviation: string }[], current) => {
        const exists = acc.some((item) => item.abbreviation.toLowerCase() === current.abbreviation.toLowerCase());
        return exists ? acc : [...acc, current];
      }, [])
      .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));

    dispatch(updateAccountFormSettings({
      verticals: normalizedVerticals,
      regions: uniqueSorted(parseList(regionText)),
      departments: uniqueSorted(parseList(departmentText)),
      businessTypes: uniqueSorted(parseList(businessTypeText)),
      designations: normalizedDesignations,
      requiredFields: uniqueSorted(parseList(requiredFieldText)),
    }));
    setFieldSaveMsg('Form field settings saved and arranged successfully.');
    setTimeout(() => setFieldSaveMsg(''), 2500);
  */ };

  const strength = getStrength(form.new_password);
  const passwordsMatch = form.confirm_password && form.new_password === form.confirm_password;
  const passwordsMismatch = form.confirm_password && form.new_password !== form.confirm_password;
  const totalSubCount = globalCategories.reduce((sum: number, c: any) => sum + (c.subcategories?.length || 0), 0);
  const fyOptions = getFYOptions();

  // ── Tab config ────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'password'    as const, label: 'Change Password', icon: <SettingsIcon size={13} /> },
    { id: 'profile'     as const, label: 'Profile',          icon: <ShieldCheck  size={13} /> },
    { id: 'formFields'  as const, label: 'Form Fields',      icon: <SettingsIcon size={13} /> },
    ...(isAdmin
      ? [{ id: 'performance' as const, label: 'Success Rates (Admin)', icon: <Target size={13} /> }]
      : []),
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full p-5 flex flex-col gap-5 min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-blue-50/60">

      {/* ── Page Header ── */}
      <div className="flex items-center gap-4 px-2 py-2 rounded-2xl border border-indigo-100 bg-white/70 backdrop-blur-sm shadow-[0_8px_24px_rgba(99,102,241,0.10)]">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
          <SettingsIcon size={22} color="white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-indigo-700 m-0 leading-tight">Settings</h1>
          <p className="text-sm text-slate-600 m-0 mt-0.5">Manage your account preferences and security</p>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex gap-1 bg-white/85 border border-indigo-100 rounded-2xl p-1.5 w-fit shadow-[0_6px_18px_rgba(15,23,42,0.08)] flex-wrap">
        {tabs.map(({ id, label, icon, badge }: any) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${activeTab === id
                ? 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-800 hover:bg-indigo-50/70'}`}
          >
            {icon} {label}
            {badge !== undefined && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === id ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1">

        {/* ════ PASSWORD TAB ════ */}
        {activeTab === 'password' && (
          <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-5">

            {/* Left — form */}
            <Card className="xl:col-span-8">
              <CardHeader
                gradient="bg-gradient-to-r from-indigo-600 to-violet-500"
                icon={<SettingsIcon size={15} color="white" />}
                title="Change Password"
                desc="Update your password to keep your account secure"
              />
              <form className="px-6 py-6 flex flex-col gap-5" onSubmit={handleSubmit}>

                {/* Current Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      className={inputBase}
                      type={show.old_password ? 'text' : 'password'}
                      name="old_password"
                      placeholder="Enter current password"
                      value={form.old_password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => toggleShow('old_password')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                      {show.old_password ? <EyeOff /> : <EyeOpen />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      className={inputBase}
                      type={show.new_password ? 'text' : 'password'}
                      name="new_password"
                      placeholder="Enter new password"
                      value={form.new_password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => toggleShow('new_password')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                      {show.new_password ? <EyeOff /> : <EyeOpen />}
                    </button>
                  </div>
                  {form.new_password.length > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              i <= strength.level ? strength.tailwind : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      className={`${inputBase} ${
                        passwordsMismatch
                          ? '!border-red-400'
                          : passwordsMatch
                          ? '!border-emerald-400'
                          : ''
                      }`}
                      type={show.confirm_password ? 'text' : 'password'}
                      name="confirm_password"
                      placeholder="Confirm new password"
                      value={form.confirm_password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => toggleShow('confirm_password')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                      {show.confirm_password ? <EyeOff /> : <EyeOpen />}
                    </button>
                  </div>
                  {passwordsMismatch && (
                    <p className="text-xs text-red-500 font-semibold mt-0.5">Passwords do not match</p>
                  )}
                  {passwordsMatch && (
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5">Passwords match ✓</p>
                  )}
                </div>

                {localError && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
                    {localError}
                  </div>
                )}
                {error && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold">
                    ✓ {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !!passwordsMismatch}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Updating...
                    </span>
                  ) : 'Update Password'}
                </button>

              </form>
            </Card>

            {/* Right — security tips */}
            <Card className="xl:col-span-4">
              <CardHeader
                gradient="bg-gradient-to-r from-slate-700 to-slate-600"
                icon={<ShieldCheck size={15} color="white" />}
                title="Security Tips"
                desc="Best practices to keep your account safe"
              />
              <div className="px-6 py-6 flex flex-col gap-4">
                <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">
                    Password Requirements
                  </p>
                  <ul className="flex flex-col gap-2">
                    {[
                      { rule: 'At least 8 characters',           met: form.new_password.length >= 8 },
                      { rule: 'One uppercase letter (A–Z)',       met: /[A-Z]/.test(form.new_password) },
                      { rule: 'One lowercase letter (a–z)',       met: /[a-z]/.test(form.new_password) },
                      { rule: 'One number (0–9)',                 met: /[0-9]/.test(form.new_password) },
                      { rule: 'One special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(form.new_password) },
                    ].map(({ rule, met }) => (
                      <li key={rule} className="flex items-center gap-2 text-sm">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
                          ${!form.new_password ? 'bg-slate-100 text-slate-400' : met ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                          {!form.new_password ? '○' : met ? '✓' : '✗'}
                        </span>
                        <span className={!form.new_password ? 'text-slate-500' : met ? 'text-emerald-700 font-semibold' : 'text-red-600'}>
                          {rule}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Account Security
                  </p>
                  <ul className="flex flex-col gap-2">
                    {['Change your password regularly', 'Never share your password with anyone'].map(tip => (
                      <li key={tip} className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ════ PROFILE TAB ════ */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card className="lg:col-span-2">
              <CardHeader
                gradient="bg-gradient-to-r from-indigo-600 to-violet-500"
                icon={<ShieldCheck size={15} color="white" />}
                title="Profile Information"
                desc="Your account details and role"
              />
              <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Username', value: authUser?.username || '—' },
                  { label: 'Email',    value: authUser?.email    || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-1.5 bg-gradient-to-br from-white to-indigo-50/40 rounded-xl p-4 border border-indigo-100 shadow-sm">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{label}</span>
                    <span className="text-sm font-extrabold text-slate-800">{value}</span>
                  </div>
                ))}
                <div className="flex flex-col gap-1.5 bg-gradient-to-br from-white to-indigo-50/40 rounded-xl p-4 border border-indigo-100 shadow-sm">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Role</span>
                  <span className="mt-0.5">
                    <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 border border-indigo-200 rounded-full text-xs font-extrabold capitalize">
                      {authUser?.role || '—'}
                    </span>
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 bg-gradient-to-br from-white to-emerald-50/50 rounded-xl p-4 border border-emerald-100 shadow-sm">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Account Status</span>
                  <span className="mt-0.5">
                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-extrabold">
                      Active
                    </span>
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                gradient="bg-gradient-to-r from-slate-700 to-slate-600"
                icon={<Info size={15} color="white" />}
                title="Profile Highlights"
                desc="Quick summary of your account"
              />
              <div className="px-6 py-6 flex flex-col gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500 m-0">Display Name</p>
                  <p className="text-sm font-bold text-slate-800 m-0 mt-1">{authUser?.username || 'Not set'}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500 m-0">Primary Email</p>
                  <p className="text-sm font-bold text-slate-800 m-0 mt-1 break-all">{authUser?.email || 'Not set'}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500 m-0">Security</p>
                  <p className="text-sm font-bold text-emerald-700 m-0 mt-1">Account is protected</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ════ CATEGORIES TAB ════ */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Left — manage */}
            <Card>
              <CardHeader
                gradient="bg-gradient-to-r from-indigo-600 to-violet-500"
                icon={<BarChart2 size={15} color="white" />}
                title="Manage Categories"
                desc="Add, organise, and remove budget categories"
              />
              <div className="px-5 py-5 flex flex-col gap-4">

                {catError && (
                  <div className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
                    <span>{catError}</span>
                    <button onClick={() => setCatError('')} className="text-red-500 hover:text-red-700 font-bold ml-2">✕</button>
                  </div>
                )}

                {/* Add category */}
                <div className="flex gap-2">
                  <input
                    className={`${inputBase} flex-1`}
                    value={newCatName}
                    onChange={e => { setNewCatName(e.target.value); setCatError(''); }}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                    placeholder="New category name (e.g. Hardware)"
                    disabled={catLoading}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={catLoading || !newCatName.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    + Add
                  </button>
                </div>

                {/* Category list */}
                {globalCategories.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                      <BarChart2 size={24} className="text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-400 font-semibold m-0">No categories yet.</p>
                    <p className="text-xs text-slate-300 m-0">Add one above to get started.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                    {globalCategories.map((cat: any) => (
                      <div key={cat.id} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">

                        {/* Category header */}
                        <div className="flex items-center justify-between px-3 py-2.5 bg-indigo-50 border-b border-indigo-100">
                          <div className="flex items-center gap-2">
                            <BarChart2 size={12} className="text-indigo-500" />
                            <span className="text-sm font-bold text-slate-800">{cat.name}</span>
                            <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold border border-indigo-200">
                              {cat.subcategories?.length || 0} subs
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            disabled={catLoading}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete category"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        </div>

                        {/* Subcategory pills + add input */}
                        <div className="px-3 py-2.5">
                          <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {cat.subcategories?.length > 0
                              ? cat.subcategories.map((sub: any) => (
                                  <span
                                    key={sub.id}
                                    className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:border-red-200 transition-colors group"
                                  >
                                    {sub.name}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSubCategory(sub.id)}
                                      disabled={catLoading}
                                      className="text-slate-300 hover:text-red-500 transition-colors font-bold group-hover:text-red-400 ml-0.5"
                                    >✕</button>
                                  </span>
                                ))
                              : <span className="text-xs text-slate-400 italic">No subcategories yet</span>}
                          </div>
                          <div className="flex gap-1.5">
                            <input
                              className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                              value={newSubNames[cat.id] || ''}
                              onChange={e => { setNewSubNames(prev => ({ ...prev, [cat.id]: e.target.value })); setCatError(''); }}
                              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSubCategory(cat.id))}
                              placeholder="Add subcategory…"
                              disabled={catLoading}
                            />
                            <button
                              type="button"
                              onClick={() => handleAddSubCategory(cat.id)}
                              disabled={catLoading || !(newSubNames[cat.id] || '').trim()}
                              className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                            >+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Right — preview / summary */}
            <Card>
              <CardHeader
                gradient="bg-gradient-to-r from-emerald-600 to-teal-500"
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>}
                title="Saved Categories"
                desc="Overview of all configured categories"
              />
              <div className="px-5 py-5 flex flex-col gap-4">

                {/* Summary chips */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { count: globalCategories.length, label: globalCategories.length === 1 ? 'Category' : 'Categories', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700' },
                    { count: totalSubCount, label: totalSubCount === 1 ? 'Subcategory' : 'Subcategories', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
                  ].map(({ count, label, bg, text }) => (
                    <div key={label} className={`flex items-center gap-3 p-3 rounded-xl border ${bg}`}>
                      <span className={`text-2xl font-extrabold ${text}`}>{count}</span>
                      <span className={`text-xs font-bold ${text}`}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Preview list */}
                {globalCategories.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
                        <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-400 font-semibold m-0">No saved categories yet.</p>
                    <p className="text-xs text-slate-300 m-0">Add some on the left to see them here.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                    {globalCategories.map((cat: any, ci: number) => (
                      <div key={cat.id} className="bg-slate-50 rounded-xl border border-slate-200 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: DOT_COLORS[ci % 6] }} />
                          <span className="text-sm font-bold text-slate-800">{cat.name}</span>
                          <span className="ml-auto text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">
                            {cat.subcategories?.length || 0}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subcategories?.length > 0
                            ? cat.subcategories.map((sub: any) => (
                                <span key={sub.id} className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
                                  {sub.name}
                                </span>
                              ))
                            : <span className="text-xs text-slate-400 italic">No subcategories added</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ════ PERFORMANCE TAB (ADMIN ONLY) ════ */}
        
        {activeTab === 'formFields' && (
          <div className="w-full flex flex-col gap-6 relative">
            
            {/* Top Toolbar / Reset Defaults & Save Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <SettingsIcon size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Dynamic Form Customization Panel</h3>
                  <p className="text-xs text-slate-500">Manage real-time form categories, subdivisions, and validation rules</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to reset all form settings to their default values?")) {
                      dispatch(resetAccountFormSettings());
                    }
                  }} 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 bg-white text-xs font-bold transition-all"
                >
                  <RotateCcw size={13} /> Reset Defaults
                </button>
                <button 
                  type="button" 
                  onClick={handleSaveFormFields} 
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md shadow-indigo-200 hover:-translate-y-0.5 transition-all"
                >
                  <Save size={13} /> Save Form Settings
                </button>
              </div>
            </div>

            {fieldSaveMsg && (
              <div className="px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold flex items-center gap-2 animate-pulse">
                <Check size={16} className="text-emerald-600 shrink-0" />
                {fieldSaveMsg}
              </div>
            )}

            {/* Dashboard Control Buttons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              
              {/* Button 1: Verticals */}
              <div 
                onClick={() => {
                  setActiveModal('verticals');
                  if (localVerticals.length > 0) {
                    setSelectedVerticalForSubs(localVerticals[0].category);
                  }
                }}
                className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-indigo-100/10 to-indigo-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <Layers size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Verticals & Sub-categories</h4>
                  <p className="text-xs text-slate-400 mt-1">Configure industry verticals and their nested subcategories or products</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-indigo-600 uppercase tracking-wider">
                  <span>{localVerticals.length} Categories</span>
                  <span className="bg-indigo-50 px-2 py-0.5 rounded group-hover:bg-indigo-100 transition-colors">Manage +</span>
                </div>
              </div>

              {/* Button 2: Regions */}
              <div 
                onClick={() => setActiveModal('regions')}
                className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-emerald-100/10 to-emerald-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Regions</h4>
                  <p className="text-xs text-slate-400 mt-1">Setup geographic territories and regional groupings for sales distribution</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-emerald-600 uppercase tracking-wider">
                  <span>{localRegions.length} Regions</span>
                  <span className="bg-emerald-50 px-2 py-0.5 rounded group-hover:bg-emerald-100 transition-colors">Manage +</span>
                </div>
              </div>

              {/* Button 3: Departments */}
              <div 
                onClick={() => setActiveModal('departments')}
                className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-blue-100/10 to-blue-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <Briefcase size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Departments</h4>
                  <p className="text-xs text-slate-400 mt-1">Configure user departments such as Purchase, Operations, Sales, etc.</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-blue-600 uppercase tracking-wider">
                  <span>{localDepartments.length} Options</span>
                  <span className="bg-blue-50 px-2 py-0.5 rounded group-hover:bg-blue-100 transition-colors">Manage +</span>
                </div>
              </div>

              {/* Button 4: Business Types */}
              <div 
                onClick={() => setActiveModal('businessTypes')}
                className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-purple-100/10 to-purple-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                  <Building size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">Business Types</h4>
                  <p className="text-xs text-slate-400 mt-1">Manage types of account engagements (e.g. Direct Business, Partner)</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-purple-600 uppercase tracking-wider">
                  <span>{localBusinessTypes.length} Types</span>
                  <span className="bg-purple-50 px-2 py-0.5 rounded group-hover:bg-purple-100 transition-colors">Manage +</span>
                </div>
              </div>

              {/* Button 5: Designations */}
              <div 
                onClick={() => setActiveModal('designations')}
                className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-amber-100/10 to-amber-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Designations</h4>
                  <p className="text-xs text-slate-400 mt-1">Manage standard customer contact job titles and official abbreviations</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-amber-600 uppercase tracking-wider">
                  <span>{localDesignations.length} Designations</span>
                  <span className="bg-amber-50 px-2 py-0.5 rounded group-hover:bg-amber-100 transition-colors">Manage +</span>
                </div>
              </div>

              {/* Button 6: Required Fields */}
              <div 
                onClick={() => setActiveModal('requiredFields')}
                className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-rose-100/10 to-rose-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
                  <CheckSquare size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors">Required Fields</h4>
                  <p className="text-xs text-slate-400 mt-1">Control form verification rules by setting database fields to mandatory</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-rose-600 uppercase tracking-wider">
                  <span>{localRequiredFields.length} Rules Active</span>
                  <span className="bg-rose-50 px-2 py-0.5 rounded group-hover:bg-rose-100 transition-colors">Manage +</span>
                </div>
              </div>

              {/* Button 7: Sales Types */}
              <div
                onClick={() => setActiveModal('salesTypes')}
                className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-indigo-100/10 to-indigo-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <Layers size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Sales Types</h4>
                  <p className="text-xs text-slate-400 mt-1">Manage sales type options for forms</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-indigo-600 uppercase tracking-wider">
                  <span>{localSalesTypes.length} Types</span>
                  <span className="bg-indigo-50 px-2 py-0.5 rounded group-hover:bg-indigo-100 transition-colors">Manage +</span>
                </div>
              </div>

              {/* Button 8: Opportunities */}
              <div
                onClick={() => setActiveModal('opportunities')}
                className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-emerald-100/10 to-emerald-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                  <Briefcase size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Opportunities</h4>
                  <p className="text-xs text-slate-400 mt-1">Manage opportunity values for lead flow</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-emerald-600 uppercase tracking-wider">
                  <span>{localOpportunities.length} Options</span>
                  <span className="bg-emerald-50 px-2 py-0.5 rounded group-hover:bg-emerald-100 transition-colors">Manage +</span>
                </div>
              </div>

              {/* Button 9: Cities */}
              <div
                onClick={() => setActiveModal('cities')}
                className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-cyan-100/10 to-cyan-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-sm">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">Cities</h4>
                  <p className="text-xs text-slate-400 mt-1">Manage city values state-wise for account and lead forms</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-cyan-600 uppercase tracking-wider">
                  <span>{localCities.length} Cities</span>
                  <span className="bg-cyan-50 px-2 py-0.5 rounded group-hover:bg-cyan-100 transition-colors">Manage +</span>
                </div>
              </div>

              {/* Button 10: Product Categories */}
              <div
                onClick={() => setActiveModal('productCategories')}
                className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-violet-100/10 to-violet-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">
                  <Building size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-violet-600 transition-colors">Product Categories</h4>
                  <p className="text-xs text-slate-400 mt-1">Manage category and nested subdivisions</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-violet-600 uppercase tracking-wider">
                  <span>{localProductCategories.length} Categories</span>
                  <span className="bg-violet-50 px-2 py-0.5 rounded group-hover:bg-violet-100 transition-colors">Manage +</span>
                </div>
              </div>

              {/* Button 11: Next Actions */}
              <div
                onClick={() => setActiveModal('nextActions')}
                className="group p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-amber-100/10 to-amber-100/40 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                  <CheckSquare size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Next Actions</h4>
                  <p className="text-xs text-slate-400 mt-1">Manage next-action values for target flow</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-3xs font-extrabold text-amber-600 uppercase tracking-wider">
                  <span>{localNextActions.length} Actions</span>
                  <span className="bg-amber-50 px-2 py-0.5 rounded group-hover:bg-amber-100 transition-colors">Manage +</span>
                </div>
              </div>

            </div>

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* ── MODAL 1: VERTICALS & NESTED SUB-CATEGORIES SPLIT VIEW FORM ── */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {/* Unified modals below */}
            {activeModal === 'verticals' && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[88vh] overflow-hidden"
      style={{ border: '2px solid #ede9fe' }}>

      {/* ── Accent bar ── */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Layers size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-white leading-tight">
              Verticals & Sub-categories
            </h3>
            <p className="text-[12px] text-indigo-100 mt-0.5">
              Add industry verticals on the left · assign subcategories on the right
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setActiveModal(null)}
          className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all hover:rotate-90 duration-200"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Step indicator ── */}
      <div className="flex items-center gap-0 shrink-0 border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-center gap-2 px-6 py-2.5 border-r border-slate-200">
          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">1</div>
          <span className="text-[12px] font-bold text-indigo-700">Add Vertical</span>
        </div>
        <div className="flex items-center gap-2 px-6 py-2.5">
          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black">2</div>
          <span className="text-[12px] font-bold text-slate-500">Add Subcategories</span>
        </div>
        <div className="ml-auto px-6">
          <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
            {localVerticals.length} Verticals · {localVerticals.reduce((s, v) => s + (v.subdivisions?.length || 0), 0)} Subs
          </span>
        </div>
      </div>

      {/* ── Split body ── */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-0">

        {/* LEFT — vertical list */}
        <div className="md:col-span-5 border-r border-slate-100 flex flex-col overflow-hidden bg-slate-50/40">

          {/* Add input */}
          <div className="p-4 border-b border-slate-100 bg-white shrink-0">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
              Add Industry Vertical
            </label>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                type="text"
                placeholder="e.g. Finance, Aviation"
                value={newVerticalName}
                onChange={(e) => setNewVerticalName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVertical())}
              />
              <button
                type="button"
                onClick={handleAddVertical}
                className="px-4 py-2.5 text-white text-[13px] font-bold rounded-xl transition-all shrink-0"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Vertical list */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {localVerticals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <Layers size={28} className="text-slate-200" />
                <p className="text-[12px] text-slate-400 font-semibold">No verticals added yet</p>
              </div>
            ) : (
              localVerticals.map((vert) => {
                const isSelected = selectedVerticalForSubs === vert.category;
                return (
                  <div
                    key={vert.category}
                    onClick={() => setSelectedVerticalForSubs(vert.category)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer select-none transition-all"
                    style={isSelected ? {
                      background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                      borderColor: '#7c3aed',
                      boxShadow: '0 4px 12px rgba(124,58,237,0.25)'
                    } : {
                      background: 'white',
                      borderColor: '#e2e8f0'
                    }}
                  >
                    <span className={`text-[13px] font-bold truncate pr-2 ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                      {vert.category}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {vert.subdivisions?.length || 0}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVertical(vert.category);
                          if (selectedVerticalForSubs === vert.category) setSelectedVerticalForSubs(null);
                        }}
                        className={`p-1 rounded-md transition-colors ${
                          isSelected
                            ? 'text-white/60 hover:text-white hover:bg-white/20'
                            : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT — subcategories panel */}
        <div className="md:col-span-7 flex flex-col overflow-hidden bg-white">
          {selectedVerticalForSubs ? (
            <>
              {/* Selected vertical header */}
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block">
                    Nested Subcategories For
                  </span>
                  <h4 className="text-[15px] font-black text-slate-800 mt-0.5">{selectedVerticalForSubs}</h4>
                </div>
                <span className="text-[11px] font-black text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">
                  {(localVerticals.find(v => v.category === selectedVerticalForSubs)?.subdivisions || []).length} Subcategories
                </span>
              </div>

              {/* Add subdivision */}
              <div className="p-4 border-b border-slate-100 shrink-0">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                  Add Sub-Category / Division Name
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    type="text"
                    placeholder={`e.g. Retail Bank (under ${selectedVerticalForSubs})`}
                    value={newSubdivisionNames[selectedVerticalForSubs] || ''}
                    onChange={(e) => setNewSubdivisionNames(prev => ({ ...prev, [selectedVerticalForSubs]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubdivision(selectedVerticalForSubs))}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSubdivision(selectedVerticalForSubs)}
                    className="px-4 py-2.5 text-white text-[13px] font-bold rounded-xl transition-all shrink-0"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Subdivision chips */}
              <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {(() => {
                  const subs = localVerticals.find(v => v.category === selectedVerticalForSubs)?.subdivisions || [];
                  if (subs.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center h-32 gap-2">
                        <AlertCircle size={28} className="text-slate-200" />
                        <p className="text-[12px] text-slate-400 font-semibold text-center">
                          No subcategories yet for <span className="text-indigo-600">{selectedVerticalForSubs}</span>
                        </p>
                        <p className="text-[11px] text-slate-300">Add one using the field above</p>
                      </div>
                    );
                  }
                  return (
                    <div className="flex flex-wrap gap-2">
                      {subs.map((sub) => (
                        <span
                          key={sub.category}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl text-[12px] font-bold text-slate-700 transition-all group"
                        >
                          {sub.category}
                          <button
                            type="button"
                            onClick={() => handleDeleteSubdivision(selectedVerticalForSubs, sub.category)}
                            className="w-4 h-4 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-500 transition-all ml-1"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
                <AlertCircle size={28} className="text-slate-300" />
              </div>
              <h5 className="text-[14px] font-black text-slate-500">No Vertical Selected</h5>
              <p className="text-[12px] text-slate-400 max-w-xs">
                Select an industry vertical from the left panel to configure its subcategories
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
        <span className="text-[12px] text-slate-400 font-medium">
          Changes are applied when you click Save
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-[13px] font-bold transition-all"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => { handleSaveFormFields(); setActiveModal(null); }}
            className="px-6 py-2.5 text-white rounded-xl text-[13px] font-bold transition-all"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}
          >
            Save & Apply Changes
          </button>
        </div>
      </div>

    </div>
  </div>
)}

            {/* ════════════════════════════════════════ */}
            {/* ── MODAL: OPPORTUNITY PRODUCT HIERARCHY  */}
            {/* ════════════════════════════════════════ */}
            {activeModal === 'productCategories' && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-[min(96vw,1260px)] h-[min(90vh,860px)] flex flex-col overflow-hidden"
                  style={{ border: '2px solid #ede9fe' }}>

                  {/* ── Accent bar ── */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 shrink-0" />

                  {/* ── Header ── */}
                  <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-500 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <Layers size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white leading-tight">
                          Opportunity Product Hierarchy
                        </h3>
                        <p className="text-[12px] text-indigo-100 mt-0.5">
                          Configure Product Category 1, 2 and 3 under each opportunity
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all hover:rotate-90 duration-200"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* ── Step / counter strip ── */}
                  <div className="flex items-center shrink-0 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-2 px-6 py-2.5 border-r border-slate-200">
                      <div className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-black">1</div>
                      <span className="text-[12px] font-bold text-violet-700">Select Opportunity</span>
                    </div>
                    <div className="flex items-center gap-2 px-6 py-2.5 border-r border-slate-200">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black">2</div>
                      <span className="text-[12px] font-bold text-slate-500">Add Categories L1 → L3</span>
                    </div>
                    <div className="ml-auto px-6 flex items-center gap-2">
                      <span className="text-[11px] font-black text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">
                        L1 {productCategory1Count}
                      </span>
                      <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                        L2 {productCategory2Count}
                      </span>
                      <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        L3 {productCategory3Count}
                      </span>
                    </div>
                  </div>

                  {/* ── Split body ── */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">

                    {/* LEFT — Opportunity list */}
                    <div className="lg:col-span-3 border-r border-slate-100 flex flex-col overflow-hidden min-w-0 bg-slate-50/40">

                      {/* Add input */}
                      <div className="p-4 border-b border-slate-100 bg-white shrink-0">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                          Add Opportunity
                        </label>
                        <div className="flex gap-2">
                          <input
                            className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                            type="text"
                            placeholder="e.g. Printer, Software"
                            value={newOpportunity}
                            onChange={(e) => setNewOpportunity(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOpportunity())}
                          />
                          <button
                            type="button"
                            onClick={handleAddOpportunity}
                            className="px-4 py-2.5 text-white text-[13px] font-bold rounded-xl transition-all shrink-0"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Opportunity list */}
                      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {productOpportunityOptions.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-32 gap-2">
                            <Layers size={28} className="text-slate-200" />
                            <p className="text-[12px] text-slate-400 font-semibold text-center">
                              No opportunities yet — add one above
                            </p>
                          </div>
                        ) : (
                          productOpportunityOptions.map((opportunityName) => {
                            const isSelected = selectedOpportunityForProductTree === opportunityName;
                            const level1Count = localProductCategories.find((item) => item.category === opportunityName)?.subdivisions?.length || 0;
                            return (
                              <div
                                key={opportunityName}
                                onClick={() => {
                                  setSelectedOpportunityForProductTree(opportunityName);
                                  setSelectedProductCategoryLevel1(null);
                                  setSelectedProductCategoryLevel2(null);
                                }}
                                className="flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer select-none transition-all"
                                style={isSelected ? {
                                  background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                                  borderColor: '#7c3aed',
                                  boxShadow: '0 4px 12px rgba(124,58,237,0.25)',
                                } : {
                                  background: 'white',
                                  borderColor: '#e2e8f0',
                                }}
                              >
                                <span className={`text-[13px] font-bold truncate pr-2 ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                                  {opportunityName}
                                </span>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                                    isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  }`}>
                                    {level1Count}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditOpportunity(opportunityName);
                                    }}
                                    className={`p-1 rounded-md transition-colors ${
                                      isSelected
                                        ? 'text-white/70 hover:text-white hover:bg-white/20'
                                        : 'text-slate-300 hover:text-violet-600 hover:bg-violet-50'
                                    }`}
                                  >
                                    <Pencil size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteOpportunity(opportunityName);
                                    }}
                                    className={`p-1 rounded-md transition-colors ${
                                      isSelected
                                        ? 'text-white/60 hover:text-white hover:bg-white/20'
                                        : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
                                    }`}
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* RIGHT — 3-level category editor */}
                    <div className="lg:col-span-9 flex flex-col overflow-hidden min-w-0 bg-white">
                      {selectedOpportunityForProductTree ? (
                        <div className="flex flex-col h-full overflow-hidden">

                          {/* Selected opportunity sub-header */}
                          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between shrink-0">
                            <div>
                              <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest block">
                                Managing Opportunity
                              </span>
                              <h4 className="text-[15px] font-black text-slate-800 mt-0.5">{selectedOpportunityForProductTree}</h4>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-black text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">
                                L1 · {productCategory1Count}
                              </span>
                              <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                                L2 · {productCategory2Count}
                              </span>
                              <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                                L3 · {productCategory3Count}
                              </span>
                            </div>
                          </div>

                          {/* 3-column grid */}
                          <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 grid grid-cols-1 md:grid-cols-3 gap-5">

                            {/* ── Level 1 ── */}
                            <div className="flex flex-col gap-3 min-h-[380px] min-w-0 rounded-2xl overflow-hidden"
                              style={{ border: '2px solid #ede9fe', boxShadow: '0 2px 12px rgba(124,58,237,0.08)' }}>

                              {/* Column header */}
                              <div className="flex items-center gap-2.5 px-4 py-3"
                                style={{ background: 'linear-gradient(90deg,#f5f3ff,#ede9fe)', borderBottom: '2px solid #ede9fe' }}>
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }}>
                                  <span className="text-white text-[10px] font-black">L1</span>
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest leading-none">Level 1</p>
                                  <p className="text-[13px] font-black text-slate-800 leading-tight mt-0.5">Product Category 1</p>
                                </div>
                              </div>

                              <div className="px-4 pb-1 shrink-0">
                                <div className="flex gap-2">
                                  <input
                                    className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                                    type="text"
                                    placeholder="Add Category 1"
                                    value={newProductCategory1Name}
                                    onChange={(e) => setNewProductCategory1Name(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProductCategory1())}
                                  />
                                  <button
                                    type="button"
                                    onClick={handleAddProductCategory1}
                                    className="px-3 py-2.5 text-white text-[12px] font-bold rounded-xl shrink-0"
                                    style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 3px 10px rgba(124,58,237,0.3)' }}
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>

                              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {productCategory1Options.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center h-24 gap-1.5">
                                    <p className="text-[12px] text-slate-400 font-semibold">No categories added</p>
                                  </div>
                                ) : productCategory1Options.map((entry) => {
                                  const isSelected = selectedProductCategoryLevel1 === entry.category;
                                  return (
                                    <div
                                      key={entry.category}
                                      onClick={() => {
                                        setSelectedProductCategoryLevel1(entry.category);
                                        setSelectedProductCategoryLevel2(null);
                                      }}
                                      className="flex items-center justify-between px-3 py-2.5 rounded-xl border-2 cursor-pointer select-none transition-all"
                                      style={isSelected ? {
                                        background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                                        borderColor: '#7c3aed',
                                        boxShadow: '0 3px 10px rgba(124,58,237,0.22)',
                                      } : {
                                        background: 'white',
                                        borderColor: '#e2e8f0',
                                      }}
                                    >
                                      <span className={`text-[13px] font-bold truncate pr-2 ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                                        {entry.category}
                                      </span>
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          type="button"
                                          onClick={(e) => { e.stopPropagation(); handleEditProductCategory1(entry.category); }}
                                          className={`p-1 rounded-md transition-colors ${
                                            isSelected ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-slate-300 hover:text-violet-600 hover:bg-violet-50'
                                          }`}
                                        >
                                          <Pencil size={12} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => { e.stopPropagation(); handleDeleteProductCategory1(entry.category); }}
                                          className={`p-1 rounded-md transition-colors ${
                                            isSelected ? 'text-white/60 hover:text-white hover:bg-white/20' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
                                          }`}
                                        >
                                          <X size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* ── Level 2 ── */}
                            <div className="flex flex-col gap-3 min-h-[380px] min-w-0 rounded-2xl overflow-hidden"
                              style={{ border: '2px solid #e0e7ff', boxShadow: '0 2px 12px rgba(79,70,229,0.08)' }}>

                              <div className="flex items-center gap-2.5 px-4 py-3"
                                style={{ background: 'linear-gradient(90deg,#eef2ff,#e0e7ff)', borderBottom: '2px solid #e0e7ff' }}>
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ background: 'linear-gradient(135deg,#4f46e5,#3b82f6)', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }}>
                                  <span className="text-white text-[10px] font-black">L2</span>
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">Level 2</p>
                                  <p className="text-[13px] font-black text-slate-800 leading-tight mt-0.5">Product Category 2</p>
                                </div>
                              </div>

                              <div className="px-4 pb-1 shrink-0">
                                <div className="flex gap-2">
                                  <input
                                    className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                                    type="text"
                                    disabled={!selectedProductCategoryLevel1}
                                    placeholder={selectedProductCategoryLevel1 ? 'Add Category 2' : 'Select Level 1 first'}
                                    value={newProductCategory2Name}
                                    onChange={(e) => setNewProductCategory2Name(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProductCategory2())}
                                  />
                                  <button
                                    type="button"
                                    disabled={!selectedProductCategoryLevel1}
                                    onClick={handleAddProductCategory2}
                                    className="px-3 py-2.5 text-white text-[12px] font-bold rounded-xl shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    style={{ background: 'linear-gradient(135deg,#4f46e5,#3b82f6)', boxShadow: '0 3px 10px rgba(79,70,229,0.3)' }}
                                  >
                                    Add
                                  </button>
                                </div>
                                {selectedProductCategoryLevel1 && (
                                  <p className="text-[11px] font-semibold text-indigo-500 mt-1.5 px-1">
                                    Parent: <span className="font-black">{selectedProductCategoryLevel1}</span>
                                  </p>
                                )}
                              </div>

                              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {!selectedProductCategoryLevel1 ? (
                                  <div className="flex flex-col items-center justify-center h-24 gap-1.5">
                                    <p className="text-[12px] text-slate-400 font-semibold text-center">Select Level 1 to add here</p>
                                  </div>
                                ) : productCategory2Options.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center h-24 gap-1.5">
                                    <p className="text-[12px] text-slate-400 font-semibold">No categories added</p>
                                  </div>
                                ) : productCategory2Options.map((entry) => {
                                  const isSelected = selectedProductCategoryLevel2 === entry.category;
                                  return (
                                    <div
                                      key={entry.category}
                                      onClick={() => setSelectedProductCategoryLevel2(entry.category)}
                                      className="flex items-center justify-between px-3 py-2.5 rounded-xl border-2 cursor-pointer select-none transition-all"
                                      style={isSelected ? {
                                        background: 'linear-gradient(135deg,#4f46e5,#3b82f6)',
                                        borderColor: '#4f46e5',
                                        boxShadow: '0 3px 10px rgba(79,70,229,0.22)',
                                      } : {
                                        background: 'white',
                                        borderColor: '#e2e8f0',
                                      }}
                                    >
                                      <span className={`text-[13px] font-bold truncate pr-2 ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                                        {entry.category}
                                      </span>
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          type="button"
                                          onClick={(e) => { e.stopPropagation(); handleEditProductCategory2(entry.category); }}
                                          className={`p-1 rounded-md transition-colors ${
                                            isSelected ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-slate-300 hover:text-indigo-600 hover:bg-indigo-50'
                                          }`}
                                        >
                                          <Pencil size={12} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => { e.stopPropagation(); handleDeleteProductCategory2(entry.category); }}
                                          className={`p-1 rounded-md transition-colors ${
                                            isSelected ? 'text-white/60 hover:text-white hover:bg-white/20' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
                                          }`}
                                        >
                                          <X size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* ── Level 3 ── */}
                            <div className="flex flex-col gap-3 min-h-[380px] min-w-0 rounded-2xl overflow-hidden"
                              style={{ border: '2px solid #d1fae5', boxShadow: '0 2px 12px rgba(16,185,129,0.08)' }}>

                              <div className="flex items-center gap-2.5 px-4 py-3"
                                style={{ background: 'linear-gradient(90deg,#ecfdf5,#d1fae5)', borderBottom: '2px solid #d1fae5' }}>
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ background: 'linear-gradient(135deg,#059669,#0d9488)', boxShadow: '0 2px 8px rgba(5,150,105,0.3)' }}>
                                  <span className="text-white text-[10px] font-black">L3</span>
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Level 3</p>
                                  <p className="text-[13px] font-black text-slate-800 leading-tight mt-0.5">Product Category 3</p>
                                </div>
                              </div>

                              <div className="px-4 pb-1 shrink-0">
                                <div className="flex gap-2">
                                  <input
                                    className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                                    type="text"
                                    disabled={!selectedProductCategoryLevel2}
                                    placeholder={selectedProductCategoryLevel2 ? 'Add Category 3' : 'Select Level 2 first'}
                                    value={newProductCategory3Name}
                                    onChange={(e) => setNewProductCategory3Name(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProductCategory3())}
                                  />
                                  <button
                                    type="button"
                                    disabled={!selectedProductCategoryLevel2}
                                    onClick={handleAddProductCategory3}
                                    className="px-3 py-2.5 text-white text-[12px] font-bold rounded-xl shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    style={{ background: 'linear-gradient(135deg,#059669,#0d9488)', boxShadow: '0 3px 10px rgba(5,150,105,0.3)' }}
                                  >
                                    Add
                                  </button>
                                </div>
                                {selectedProductCategoryLevel2 && (
                                  <p className="text-[11px] font-semibold text-emerald-600 mt-1.5 px-1">
                                    Parent: <span className="font-black">{selectedProductCategoryLevel2}</span>
                                  </p>
                                )}
                              </div>

                              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {!selectedProductCategoryLevel2 ? (
                                  <div className="flex flex-col items-center justify-center h-24 gap-1.5">
                                    <p className="text-[12px] text-slate-400 font-semibold text-center">Select Level 2 to add here</p>
                                  </div>
                                ) : productCategory3Options.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center h-24 gap-1.5">
                                    <p className="text-[12px] text-slate-400 font-semibold">No categories added</p>
                                  </div>
                                ) : productCategory3Options.map((entry) => (
                                  <div
                                    key={entry.category}
                                    className="flex items-center justify-between px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 transition-all"
                                  >
                                    <span className="text-[13px] font-bold text-slate-700 truncate pr-2">{entry.category}</span>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => handleEditProductCategory3(entry.category)}
                                        className="p-1 rounded-md text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                      >
                                        <Pencil size={12} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteProductCategory3(entry.category)}
                                        className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-3">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
                            <AlertCircle size={28} className="text-slate-300" />
                          </div>
                          <h5 className="text-[14px] font-black text-slate-500">No Opportunity Selected</h5>
                          <p className="text-[12px] text-slate-400 max-w-xs">
                            Select or add an opportunity on the left to configure Product Category 1, 2 and 3
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Footer ── */}
                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                    <span className="text-[12px] text-slate-400 font-medium">Changes are applied when you click Save</span>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-[13px] font-bold transition-all"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleSaveFormFields(); setActiveModal(null); }}
                        className="px-6 py-2.5 text-white rounded-xl text-[13px] font-bold transition-all"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}
                      >
                        Save & Apply Changes
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}


            {/* ════════════════════════════════ */}
            {/* ── MODAL: SALES TYPES            */}
            {/* ════════════════════════════════ */}
            {activeModal === 'salesTypes' && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[82vh] overflow-hidden"
                  style={{ border: '2px solid #c7d2fe' }}>

                  <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />

                  <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <TrendingUp size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white leading-tight">Sales Types</h3>
                        <p className="text-[12px] text-indigo-100 mt-0.5">Configure sales classification options</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setActiveModal(null)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all hover:rotate-90 duration-200">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex items-center shrink-0 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-2 px-6 py-2.5">
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">1</div>
                      <span className="text-[12px] font-bold text-indigo-700">Add Sales Type</span>
                    </div>
                    <div className="ml-auto px-6">
                      <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                        {localSalesTypes.length} Types
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
                    <div className="p-4 border-b border-slate-100 bg-white shrink-0">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Add Sales Type</label>
                      <div className="flex gap-2">
                        <input
                          className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                          type="text" placeholder="e.g. Direct, Channel"
                          value={newSalesType} onChange={(e) => setNewSalesType(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSalesType())}
                        />
                        <button type="button" onClick={handleAddSalesType}
                          className="px-4 py-2.5 text-white text-[13px] font-bold rounded-xl transition-all shrink-0"
                          style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Active Sales Types</label>
                      {localSalesTypes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-2">
                          <TrendingUp size={28} className="text-slate-200" />
                          <p className="text-[12px] text-slate-400 font-semibold">No sales types added yet</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {localSalesTypes.map((v) => (
                            <span key={v} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl text-[12px] font-bold text-slate-700 transition-all">
                              {v}
                              <button type="button" onClick={() => handleDeleteSalesType(v)}
                                className="w-4 h-4 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-500 transition-all ml-1">
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                    <span className="text-[12px] text-slate-400 font-medium">Changes applied when you click Save</span>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setActiveModal(null)}
                        className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-[13px] font-bold transition-all">
                        Close
                      </button>
                      <button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }}
                        className="px-6 py-2.5 text-white rounded-xl text-[13px] font-bold transition-all"
                        style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 4px 16px rgba(79,70,229,0.35)' }}>
                        Save & Apply Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* ════════════════════════════════ */}
            {/* ── MODAL: OPPORTUNITIES          */}
            {/* ════════════════════════════════ */}
            {activeModal === 'opportunities' && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[82vh] overflow-hidden"
                  style={{ border: '2px solid #a7f3d0' }}>

                  <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />

                  <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <Briefcase size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white leading-tight">Opportunities</h3>
                        <p className="text-[12px] text-emerald-100 mt-0.5">Configure pipeline opportunity stages</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setActiveModal(null)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all hover:rotate-90 duration-200">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex items-center shrink-0 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-2 px-6 py-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">1</div>
                      <span className="text-[12px] font-bold text-emerald-700">Add Opportunity</span>
                    </div>
                    <div className="ml-auto px-6">
                      <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        {localOpportunities.length} Options
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
                    <div className="p-4 border-b border-slate-100 bg-white shrink-0">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Add Opportunity</label>
                      <div className="flex gap-2">
                        <input
                          className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                          type="text" placeholder="e.g. Expansion, Renewal"
                          value={newOpportunity} onChange={(e) => setNewOpportunity(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOpportunity())}
                        />
                        <button type="button" onClick={handleAddOpportunity}
                          className="px-4 py-2.5 text-white text-[13px] font-bold rounded-xl transition-all shrink-0"
                          style={{ background: 'linear-gradient(135deg,#059669,#0d9488)', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Active Opportunities</label>
                      {localOpportunities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-2">
                          <Briefcase size={28} className="text-slate-200" />
                          <p className="text-[12px] text-slate-400 font-semibold">No opportunities added yet</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {localOpportunities.map((v) => (
                            <span key={v} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl text-[12px] font-bold text-slate-700 transition-all">
                              {v}
                              <button type="button" onClick={() => handleDeleteOpportunity(v)}
                                className="w-4 h-4 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-500 transition-all ml-1">
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                    <span className="text-[12px] text-slate-400 font-medium">Changes applied when you click Save</span>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setActiveModal(null)}
                        className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-[13px] font-bold transition-all">
                        Close
                      </button>
                      <button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }}
                        className="px-6 py-2.5 text-white rounded-xl text-[13px] font-bold transition-all"
                        style={{ background: 'linear-gradient(135deg,#059669,#0d9488)', boxShadow: '0 4px 16px rgba(5,150,105,0.35)' }}>
                        Save & Apply Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* ════════════════════════════════ */}
            {/* ── MODAL: STATES                 */}
            {/* ════════════════════════════════ */}
            {activeModal === 'states' && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[82vh] overflow-hidden"
                  style={{ border: '2px solid #a5f3fc' }}>

                  <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-sky-500" />

                  <div className="bg-gradient-to-r from-cyan-600 to-sky-500 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white leading-tight">States</h3>
                        <p className="text-[12px] text-cyan-100 mt-0.5">Configure state / province options</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setActiveModal(null)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all hover:rotate-90 duration-200">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex items-center shrink-0 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-2 px-6 py-2.5">
                      <div className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px] font-black">1</div>
                      <span className="text-[12px] font-bold text-cyan-700">Add State</span>
                    </div>
                    <div className="ml-auto px-6">
                      <span className="text-[11px] font-black text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
                        {localStates.length} States
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
                    <div className="p-4 border-b border-slate-100 bg-white shrink-0">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Add State / Province</label>
                      <div className="flex gap-2">
                        <input
                          className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all"
                          type="text" placeholder="e.g. Maharashtra, Karnataka"
                          value={newSettingsState} onChange={(e) => setNewSettingsState(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSettingsState())}
                        />
                        <button type="button" onClick={handleAddSettingsState}
                          className="px-4 py-2.5 text-white text-[13px] font-bold rounded-xl transition-all shrink-0"
                          style={{ background: 'linear-gradient(135deg,#0891b2,#0284c7)', boxShadow: '0 4px 12px rgba(8,145,178,0.3)' }}>
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Active States</label>
                      {localStates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-2">
                          <MapPin size={28} className="text-slate-200" />
                          <p className="text-[12px] text-slate-400 font-semibold">No states added yet</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {localStates.map((v) => (
                            <span key={v} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border-2 border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 rounded-xl text-[12px] font-bold text-slate-700 transition-all">
                              {v}
                              <button type="button" onClick={() => handleDeleteSettingsState(v)}
                                className="w-4 h-4 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-500 transition-all ml-1">
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                    <span className="text-[12px] text-slate-400 font-medium">Changes applied when you click Save</span>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setActiveModal(null)}
                        className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-[13px] font-bold transition-all">
                        Close
                      </button>
                      <button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }}
                        className="px-6 py-2.5 text-white rounded-xl text-[13px] font-bold transition-all"
                        style={{ background: 'linear-gradient(135deg,#0891b2,#0284c7)', boxShadow: '0 4px 16px rgba(8,145,178,0.35)' }}>
                        Save & Apply Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* ════════════════════════════════ */}
            {/* ── MODAL: CITIES                 */}
            {/* ════════════════════════════════ */}
            {activeModal === 'cities' && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[82vh] overflow-hidden"
                  style={{ border: '2px solid #bfdbfe' }}>

                  <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />

                  <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white leading-tight">Cities</h3>
                        <p className="text-[12px] text-blue-100 mt-0.5">Configure city options for location assignment</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setActiveModal(null)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all hover:rotate-90 duration-200">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex items-center shrink-0 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-2 px-6 py-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">1</div>
                      <span className="text-[12px] font-bold text-blue-700">Add City</span>
                    </div>
                    <div className="ml-auto px-6">
                      <span className="text-[11px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                        {localCities.length} Cities
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
                    <div className="p-4 border-b border-slate-100 bg-white shrink-0">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Select State</label>
                      <select
                        className="w-full mb-3 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                        value={selectedCityState}
                        onChange={(e) => setSelectedCityState(e.target.value)}
                      >
                        <option value="">Select a state</option>
                        {cityStateOptions.map((stateName) => (
                          <option key={stateName} value={stateName}>{stateName}</option>
                        ))}
                      </select>

                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Add City</label>
                      <div className="flex gap-2">
                        <input
                          className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                          type="text" placeholder="e.g. Mumbai, Bangalore"
                          value={newCity} onChange={(e) => setNewCity(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCity())}
                          disabled={!selectedCityState}
                        />
                        <button type="button" onClick={handleAddCity} disabled={!selectedCityState}
                          className="px-4 py-2.5 text-white text-[13px] font-bold rounded-xl transition-all shrink-0"
                          style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                        Active Cities {selectedCityState ? `(${selectedCityState})` : ''}
                      </label>
                      {!selectedCityState ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-2">
                          <MapPin size={28} className="text-slate-200" />
                          <p className="text-[12px] text-slate-400 font-semibold">Select a state to manage cities</p>
                        </div>
                      ) : (localStateCities[selectedCityState] || []).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-2">
                          <Building2 size={28} className="text-slate-200" />
                          <p className="text-[12px] text-slate-400 font-semibold">No cities added for this state</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(localStateCities[selectedCityState] || []).map((v) => (
                            <span key={v} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl text-[12px] font-bold text-slate-700 transition-all">
                              {v}
                              <button type="button" onClick={() => handleDeleteCity(v)}
                                className="w-4 h-4 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-500 transition-all ml-1">
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                    <span className="text-[12px] text-slate-400 font-medium">Changes applied when you click Save</span>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setActiveModal(null)}
                        className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-[13px] font-bold transition-all">
                        Close
                      </button>
                      <button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }}
                        className="px-6 py-2.5 text-white rounded-xl text-[13px] font-bold transition-all"
                        style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}>
                        Save & Apply Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* ════════════════════════════════ */}
            {/* ── MODAL: NEXT ACTIONS           */}
            {/* ════════════════════════════════ */}
            {activeModal === 'nextActions' && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[82vh] overflow-hidden"
                  style={{ border: '2px solid #fde68a' }}>

                  <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-500" />

                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <ArrowRight size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white leading-tight">Next Actions</h3>
                        <p className="text-[12px] text-amber-100 mt-0.5">Configure follow-up action options</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setActiveModal(null)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all hover:rotate-90 duration-200">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex items-center shrink-0 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-2 px-6 py-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">1</div>
                      <span className="text-[12px] font-bold text-amber-700">Add Next Action</span>
                    </div>
                    <div className="ml-auto px-6">
                      <span className="text-[11px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                        {localNextActions.length} Actions
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
                    <div className="p-4 border-b border-slate-100 bg-white shrink-0">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Add Next Action</label>
                      <div className="flex gap-2">
                        <input
                          className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                          type="text" placeholder="e.g. Follow Up Call, Send Proposal"
                          value={newNextAction} onChange={(e) => setNewNextAction(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNextAction())}
                        />
                        <button type="button" onClick={handleAddNextAction}
                          className="px-4 py-2.5 text-white text-[13px] font-bold rounded-xl transition-all shrink-0"
                          style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Active Next Actions</label>
                      {localNextActions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-2">
                          <ArrowRight size={28} className="text-slate-200" />
                          <p className="text-[12px] text-slate-400 font-semibold">No next actions added yet</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {localNextActions.map((v) => (
                            <span key={v} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-[12px] font-bold text-slate-700 transition-all">
                              {v}
                              <button type="button" onClick={() => handleDeleteNextAction(v)}
                                className="w-4 h-4 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-500 transition-all ml-1">
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                    <span className="text-[12px] text-slate-400 font-medium">Changes applied when you click Save</span>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setActiveModal(null)}
                        className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-[13px] font-bold transition-all">
                        Close
                      </button>
                      <button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }}
                        className="px-6 py-2.5 text-white rounded-xl text-[13px] font-bold transition-all"
                        style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', boxShadow: '0 4px 16px rgba(245,158,11,0.35)' }}>
                        Save & Apply Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* ════════════════════════════════ */}
            {/* ── MODAL: REGIONS                */}
            {/* ════════════════════════════════ */}
            {activeModal === 'regions' && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[82vh] overflow-hidden"
                  style={{ border: '2px solid #a7f3d0' }}>

                  <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-green-500" />

                  <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white leading-tight">Regions</h3>
                        <p className="text-[12px] text-emerald-100 mt-0.5">Configure geographic sales territories and regions</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setActiveModal(null)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all hover:rotate-90 duration-200">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex items-center shrink-0 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-2 px-6 py-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">1</div>
                      <span className="text-[12px] font-bold text-emerald-700">Add Region</span>
                    </div>
                    <div className="ml-auto px-6">
                      <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        {localRegions.length} Regions
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
                    <div className="p-4 border-b border-slate-100 bg-white shrink-0">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Add Sales Region / Territory</label>
                      <div className="flex gap-2">
                        <input
                          className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                          type="text" placeholder="e.g. North East, EMEA"
                          value={newRegionName} onChange={(e) => setNewRegionName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRegion())}
                        />
                        <button type="button" onClick={handleAddRegion}
                          className="px-4 py-2.5 text-white text-[13px] font-bold rounded-xl transition-all shrink-0"
                          style={{ background: 'linear-gradient(135deg,#059669,#16a34a)', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Active Territories</label>
                      {localRegions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-2">
                          <MapPin size={28} className="text-slate-200" />
                          <p className="text-[12px] text-slate-400 font-semibold">No regions added yet</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {localRegions.map((region) => (
                            <span key={region} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl text-[12px] font-bold text-slate-700 transition-all">
                              {region}
                              <button type="button" onClick={() => handleDeleteRegion(region)}
                                className="w-4 h-4 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-500 transition-all ml-1">
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                    <span className="text-[12px] text-slate-400 font-medium">Changes applied when you click Save</span>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setActiveModal(null)}
                        className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-[13px] font-bold transition-all">
                        Close
                      </button>
                      <button type="button" onClick={() => { handleSaveFormFields(); setActiveModal(null); }}
                        className="px-6 py-2.5 text-white rounded-xl text-[13px] font-bold transition-all"
                        style={{ background: 'linear-gradient(135deg,#059669,#16a34a)', boxShadow: '0 4px 16px rgba(5,150,105,0.35)' }}>
                        Save & Apply Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* ══════════════════════════════════ */}
            {/* ── MODAL 3: DEPARTMENTS             */}
            {/* ══════════════════════════════════ */}
            {activeModal === 'departments' && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[82vh] overflow-hidden"
                  style={{ border: '2px solid #bfdbfe' }}>

                  {/* Accent bar */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />

                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <Briefcase size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white leading-tight">Departments</h3>
                        <p className="text-[12px] text-blue-100 mt-0.5">Configure corporate department options for PIC assignment</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all hover:rotate-90 duration-200"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Counter pill */}
                  <div className="flex items-center gap-0 shrink-0 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-2 px-6 py-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">1</div>
                      <span className="text-[12px] font-bold text-blue-700">Add Department</span>
                    </div>
                    <div className="ml-auto px-6">
                      <span className="text-[11px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                        {localDepartments.length} Departments
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto flex flex-col min-h-0">

                    {/* Add input */}
                    <div className="p-4 border-b border-slate-100 bg-white shrink-0">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                        Add Corporate Department
                      </label>
                      <div className="flex gap-2">
                        <input
                          className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                          type="text"
                          placeholder="e.g. Quality Assurance, Strategy"
                          value={newDepartmentName}
                          onChange={(e) => setNewDepartmentName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDepartment())}
                        />
                        <button
                          type="button"
                          onClick={handleAddDepartment}
                          className="px-4 py-2.5 text-white text-[13px] font-bold rounded-xl transition-all shrink-0"
                          style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Chips list */}
                    <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                        Active Departments
                      </label>
                      {localDepartments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-2">
                          <Briefcase size={28} className="text-slate-200" />
                          <p className="text-[12px] text-slate-400 font-semibold">No departments added yet</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {localDepartments.map((dept) => (
                            <span
                              key={dept}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl text-[12px] font-bold text-slate-700 transition-all group"
                            >
                              {dept}
                              <button
                                type="button"
                                onClick={() => handleDeleteDepartment(dept)}
                                className="w-4 h-4 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-500 transition-all ml-1"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                    <span className="text-[12px] text-slate-400 font-medium">Changes applied when you click Save</span>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-[13px] font-bold transition-all"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleSaveFormFields(); setActiveModal(null); }}
                        className="px-6 py-2.5 text-white rounded-xl text-[13px] font-bold transition-all"
                        style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}
                      >
                        Save & Apply Changes
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}


            {/* ════════════════════════════════════ */}
            {/* ── MODAL 4: BUSINESS TYPES           */}
            {/* ════════════════════════════════════ */}
            {activeModal === 'businessTypes' && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[82vh] overflow-hidden"
                  style={{ border: '2px solid #ede9fe' }}>

                  {/* Accent bar */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-purple-500" />

                  {/* Header */}
                  <div className="bg-gradient-to-r from-violet-600 to-purple-500 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <Building size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white leading-tight">Business Types</h3>
                        <p className="text-[12px] text-violet-100 mt-0.5">Configure account engagement types and classifications</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all hover:rotate-90 duration-200"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Counter pill */}
                  <div className="flex items-center shrink-0 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-2 px-6 py-2.5">
                      <div className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-black">1</div>
                      <span className="text-[12px] font-bold text-violet-700">Add Business Type</span>
                    </div>
                    <div className="ml-auto px-6">
                      <span className="text-[11px] font-black text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">
                        {localBusinessTypes.length} Types
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto flex flex-col min-h-0">

                    {/* Add input */}
                    <div className="p-4 border-b border-slate-100 bg-white shrink-0">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                        Add Business Type
                      </label>
                      <div className="flex gap-2">
                        <input
                          className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                          type="text"
                          placeholder="e.g. Sub-Dealer, Public Sector"
                          value={newBusinessTypeName}
                          onChange={(e) => setNewBusinessTypeName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBusinessType())}
                        />
                        <button
                          type="button"
                          onClick={handleAddBusinessType}
                          className="px-4 py-2.5 text-white text-[13px] font-bold rounded-xl transition-all shrink-0"
                          style={{ background: 'linear-gradient(135deg,#7c3aed,#9333ea)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Chips */}
                    <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                        Active Engagement Types
                      </label>
                      {localBusinessTypes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-2">
                          <Building size={28} className="text-slate-200" />
                          <p className="text-[12px] text-slate-400 font-semibold">No business types added yet</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {localBusinessTypes.map((type) => (
                            <span
                              key={type}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50 rounded-xl text-[12px] font-bold text-slate-700 transition-all group"
                            >
                              {type}
                              <button
                                type="button"
                                onClick={() => handleDeleteBusinessType(type)}
                                className="w-4 h-4 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-500 transition-all ml-1"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                    <span className="text-[12px] text-slate-400 font-medium">Changes applied when you click Save</span>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-[13px] font-bold transition-all"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleSaveFormFields(); setActiveModal(null); }}
                        className="px-6 py-2.5 text-white rounded-xl text-[13px] font-bold transition-all"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#9333ea)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}
                      >
                        Save & Apply Changes
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}


            {/* ════════════════════════════════════ */}
            {/* ── MODAL 5: DESIGNATIONS             */}
            {/* ════════════════════════════════════ */}
            {activeModal === 'designations' && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[88vh] overflow-hidden"
                  style={{ border: '2px solid #fde68a' }}>

                  {/* Accent bar */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-500" />

                  {/* Header */}
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <ShieldCheck size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white leading-tight">Designations</h3>
                        <p className="text-[12px] text-amber-100 mt-0.5">Configure PIC job titles and official abbreviations</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all hover:rotate-90 duration-200"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Step / counter strip */}
                  <div className="flex items-center shrink-0 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-2 px-6 py-2.5 border-r border-slate-200">
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">1</div>
                      <span className="text-[12px] font-bold text-amber-700">Add Title</span>
                    </div>
                    <div className="flex items-center gap-2 px-6 py-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-black">2</div>
                      <span className="text-[12px] font-bold text-slate-500">Assign Abbreviation</span>
                    </div>
                    <div className="ml-auto px-6">
                      <span className="text-[11px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                        {localDesignations.length} Designations
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto flex flex-col min-h-0">

                    {/* Add inputs */}
                    <div className="p-4 border-b border-slate-100 bg-white shrink-0">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                        Add Designation
                      </label>
                      <div className="flex gap-2">
                        <input
                          className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                          type="text"
                          placeholder="Job Title  e.g. Senior Manager"
                          value={newDesignationTitle}
                          onChange={(e) => setNewDesignationTitle(e.target.value)}
                        />
                        <input
                          className="w-28 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                          type="text"
                          placeholder="Abbr. Sr.M"
                          value={newDesignationAbbreviation}
                          onChange={(e) => setNewDesignationAbbreviation(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDesignation())}
                        />
                        <button
                          type="button"
                          onClick={handleAddDesignation}
                          className="px-4 py-2.5 text-white text-[13px] font-bold rounded-xl transition-all shrink-0"
                          style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Designation rows — same style as vertical list rows */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                        Registered Designations
                      </label>
                      {localDesignations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-2">
                          <ShieldCheck size={28} className="text-slate-200" />
                          <p className="text-[12px] text-slate-400 font-semibold">No designations added yet</p>
                        </div>
                      ) : (
                        localDesignations.map((desig) => (
                          <div
                            key={desig.abbreviation}
                            className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/40 cursor-default select-none transition-all group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Coloured abbreviation pill */}
                              <span className="px-2.5 py-1 rounded-lg text-[11px] font-black text-amber-700 shrink-0"
                                style={{ background:'#fef3c7', border:'1.5px solid #fcd34d' }}>
                                {desig.abbreviation}
                              </span>
                              <span className="text-[13px] font-bold text-slate-700 truncate">{desig.title}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteDesignation(desig.abbreviation)}
                              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                    <span className="text-[12px] text-slate-400 font-medium">Changes applied when you click Save</span>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-[13px] font-bold transition-all"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleSaveFormFields(); setActiveModal(null); }}
                        className="px-6 py-2.5 text-white rounded-xl text-[13px] font-bold transition-all"
                        style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', boxShadow: '0 4px 16px rgba(245,158,11,0.35)' }}
                      >
                        Save & Apply Changes
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeModal === 'requiredFields' && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[88vh] overflow-hidden"
      style={{ border: '2px solid #ffe4e6' }}>

      {/* ── Accent bar ── */}
      <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-pink-500" />

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-500 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <CheckSquare size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-white leading-tight">Required Fields</h3>
            <p className="text-[12px] text-rose-100 mt-0.5">
              Toggle mandatory validation rules for account forms
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setActiveModal(null)}
          className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all hover:rotate-90 duration-200"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Step / counter strip ── */}
      <div className="flex items-center shrink-0 border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-center gap-2 px-6 py-2.5 border-r border-slate-200">
          <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black">1</div>
          <span className="text-[12px] font-bold text-rose-700">Toggle Fields</span>
        </div>
        <div className="flex items-center gap-2 px-6 py-2.5">
          <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-black">2</div>
          <span className="text-[12px] font-bold text-slate-500">Add Custom Keys</span>
        </div>
        <div className="ml-auto px-6">
          <span className="text-[11px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
            {localRequiredFields.length} Rules Active
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0">

        {/* Toggle switch grid */}
        <div className="p-4 border-b border-slate-100 bg-white shrink-0">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
            Standard Database Field Toggles
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'account_name',  label: 'Account Name'         },
              { key: 'pic',           label: 'Person In Charge'      },
              { key: 'vertical',      label: 'Vertical Category'     },
              { key: 'department',    label: 'Department'            },
              { key: 'designation',   label: 'Designation'           },
              { key: 'business',      label: 'Business Type'         },
              { key: 'region',        label: 'Territory / Region'    },
              { key: 'mobile_number', label: 'Mobile Number'         },
              { key: 'email_id',      label: 'Email Address'         },
              { key: 'location',      label: 'Location'              },
              { key: 'address',       label: 'Street Address'        },
            ].map((field) => {
              const isRequired = localRequiredFields.includes(field.key);
              return (
                <div
                  key={field.key}
                  onClick={() => toggleRequiredField(field.key)}
                  className={`
                    flex items-center justify-between px-3 py-2.5 rounded-xl border-2
                    cursor-pointer select-none transition-all duration-200
                    ${isRequired
                      ? 'bg-rose-50 border-rose-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-rose-200 hover:bg-rose-50/30'
                    }
                  `}
                >
                  <span className={`text-[12px] font-semibold truncate pr-2 ${isRequired ? 'text-rose-700' : 'text-slate-600'}`}>
                    {field.label}
                  </span>
                  {/* Toggle pill */}
                  <div className={`
                    relative shrink-0 w-9 h-5 rounded-full transition-all duration-200
                    ${isRequired ? 'bg-rose-500' : 'bg-slate-200'}
                  `}>
                    <span className={`
                      absolute top-[3px] w-3.5 h-3.5 rounded-full bg-white shadow-sm
                      transition-all duration-200
                      ${isRequired ? 'right-[3px]' : 'left-[3px]'}
                    `} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom field add */}
        <div className="p-4 border-b border-slate-100 bg-white shrink-0">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
            Add Custom Required Field Key
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
              type="text"
              placeholder="e.g. gst_number, industry_licence"
              value={newRequiredFieldName}
              onChange={(e) => setNewRequiredFieldName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomRequiredField())}
            />
            <button
              type="button"
              onClick={handleAddCustomRequiredField}
              className="px-4 py-2.5 text-white text-[13px] font-bold rounded-xl transition-all shrink-0"
              style={{ background: 'linear-gradient(135deg,#e11d48,#db2777)', boxShadow: '0 4px 12px rgba(225,29,72,0.3)' }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Custom active rules chips */}
        <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
            Custom Field Rules
          </label>
          {(() => {
            const standardKeys = ['account_name','pic','vertical','department','designation','business','region','mobile_number','email_id','location','address'];
            const customFields = localRequiredFields.filter(f => !standardKeys.includes(f));
            if (customFields.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center h-24 gap-2">
                  <CheckSquare size={24} className="text-slate-200" />
                  <p className="text-[12px] text-slate-400 font-semibold">No custom rules added yet</p>
                </div>
              );
            }
            return (
              <div className="flex flex-wrap gap-2">
                {customFields.map((cf) => (
                  <span
                    key={cf}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border-2 border-slate-200 hover:border-rose-300 hover:bg-rose-50 rounded-xl text-[12px] font-bold text-slate-700 transition-all"
                  >
                    {cf}
                    <button
                      type="button"
                      onClick={() => setLocalRequiredFields(localRequiredFields.filter(f => f !== cf))}
                      className="w-4 h-4 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-500 transition-all ml-1"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
        <span className="text-[12px] text-slate-400 font-medium">
          Changes are applied when you click Save
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-[13px] font-bold transition-all"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => { handleSaveFormFields(); setActiveModal(null); }}
            className="px-6 py-2.5 text-white rounded-xl text-[13px] font-bold transition-all"
            style={{ background: 'linear-gradient(135deg,#e11d48,#db2777)', boxShadow: '0 4px 16px rgba(225,29,72,0.35)' }}
          >
            Save & Apply Changes
          </button>
        </div>
      </div>

    </div>
  </div>
)}

          </div>
        )}

        {false && (
          <Card>
            <CardHeader
              gradient="bg-gradient-to-r from-indigo-600 to-violet-500"
              icon={<SettingsIcon size={15} color="white" />}
              title="Account Form Field Settings"
              desc="Configure verticals, dropdown options, and required fields"
            />
            <div className="px-5 py-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Verticals (Vertical: Sub1, Sub2)</label>
                <textarea className={inputBase} value={verticalText} onChange={(e) => setVerticalText(e.target.value)} rows={8} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Regions (one per line)</label>
                <textarea className={inputBase} value={regionText} onChange={(e) => setRegionText(e.target.value)} rows={8} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Departments (one per line)</label>
                <textarea className={inputBase} value={departmentText} onChange={(e) => setDepartmentText(e.target.value)} rows={8} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Business Types (one per line)</label>
                <textarea className={inputBase} value={businessTypeText} onChange={(e) => setBusinessTypeText(e.target.value)} rows={8} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Designations (Title|Code per line)</label>
                <textarea className={inputBase} value={designationText} onChange={(e) => setDesignationText(e.target.value)} rows={8} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Required Fields (field key per line)</label>
                <textarea className={inputBase} value={requiredFieldText} onChange={(e) => setRequiredFieldText(e.target.value)} rows={8} />
              </div>
              <div className="xl:col-span-2 flex gap-3">
                <button type="button" onClick={handleSaveFormFields} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold">
                  Save Form Settings
                </button>
                <button type="button" onClick={() => dispatch(resetAccountFormSettings())} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold">
                  Reset Defaults
                </button>
              </div>
              {fieldSaveMsg && (
                <div className="xl:col-span-2 px-3 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold">
                  {fieldSaveMsg}
                </div>
              )}
              <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sub-Vertical Preview (Arranged)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {accountFormSettings.verticals.map((vertical) => (
                    <div key={vertical.category} className="text-xs text-slate-700">
                      <span className="font-bold">{vertical.category}</span>
                      <span className="text-slate-500">: {(vertical.subdivisions || []).map((s) => s.category).join(', ') || 'No sub-verticals'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
        {isAdmin && activeTab === 'performance' && (
          <div className="flex flex-col gap-5">

            {/* Set Quotas Card */}
            <Card>
              <CardHeader
                gradient="bg-gradient-to-r from-indigo-600 to-violet-500"
                icon={<Award size={15} color="white" />}
                title="Set Annual Employee Quotas"
                desc="Assign annual sales targets per employee"
              />
              <div className="px-5 py-5">
                <div className="flex flex-wrap gap-3 items-end">

                  {/* Select Sales PIC */}
                  <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Select Sales PIC
                    </label>
                    <select
                      className={inputBase}
                      value={quotaForm.userId}
                      onChange={e => setQuotaForm({ ...quotaForm, userId: e.target.value })}
                    >
                      <option value="">Select Employee...</option>
                      {employees.map((e: any) => (
                        <option key={e.id} value={e.id}>{e.username}</option>
                      ))}
                    </select>
                  </div>

                  {/* Target Amount */}
                  <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Target Amount (₹)
                    </label>
                    <input
                      type="number"
                      className={inputBase}
                      placeholder="e.g. 3000000 for 30L"
                      value={quotaForm.amount}
                      onChange={e => setQuotaForm({ ...quotaForm, amount: e.target.value })}
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSaveQuota}
                    disabled={!quotaForm.userId || !quotaForm.amount}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Save size={14} /> Save Quota
                  </button>
                </div>
              </div>
            </Card>

            {/* Attainment Report Card */}
            <Card>
              <CardHeader
                gradient="bg-gradient-to-r from-emerald-600 to-teal-500"
                icon={<Target size={15} color="white" />}
                title="Performance Attainment Report"
                desc={`Rank A sales & lead conversions · ${formatFYLabel(reportFilterYear)}`}
                right={
                  <div className="flex items-center gap-2">
                    {/* FY Filter */}
                    <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2.5 py-1.5">
                      <Calendar size={13} color="white" />
                      <select
                        className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                        value={reportFilterYear}
                        onChange={e => setReportFilterYear(Number(e.target.value))}
                      >
                        {fyOptions.map(y => (
                          <option key={y} value={y} className="text-slate-800 bg-white">{formatFYLabel(y)}</option>
                        ))}
                      </select>
                    </div>
                    {/* Refresh */}
                    <button
                      onClick={() => dispatch(fetchAttainmentReport(reportFilterYear))}
                      className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-white"
                    >
                      <RefreshCw size={14} className={perfLoading ? 'animate-spin' : ''} />
                    </button>
                  </div>
                }
              />

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {['Employee', 'Target Quota', 'Actual Sales', 'Success Rate %', 'Lead Conversion', 'Status'].map(col => (
                        <th
                          key={col}
                          className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-sm text-slate-400 py-10">
                          {perfLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                              </svg>
                              Loading...
                            </span>
                          ) : (
                            `No data found for ${formatFYLabel(reportFilterYear)}.`
                          )}
                        </td>
                      </tr>
                    ) : (
                      reportData.map((row: any) => (
                        <tr key={row.user_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          {/* Employee */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                                {row.username.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-slate-800">{row.full_name}</span>
                            </div>
                          </td>
                          {/* Target */}
                          <td className="px-4 py-3 text-slate-700 font-medium">
                            ₹{(row.target / 100000).toFixed(1)}L
                          </td>
                          {/* Actual */}
                          <td className="px-4 py-3 text-slate-700 font-medium">
                            ₹{(row.actual_sales / 100000).toFixed(1)}L
                          </td>
                          {/* Success Rate */}
                          <td className="px-4 py-3">
                            <span
                              className="font-bold text-sm"
                              style={{ color: row.sales_success_rate >= 100 ? '#10B981' : '#4F46E5' }}
                            >
                              {row.sales_success_rate}%
                            </span>
                          </td>
                          {/* Lead Conversion */}
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-semibold">
                              {row.converted_leads}/{row.total_leads} Leads ({row.funnel_conv_rate}%)
                            </span>
                          </td>
                          {/* Status */}
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                              row.sales_success_rate >= 100
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {row.sales_success_rate >= 100 ? 'Achieved' : 'In Progress'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer note */}
              <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
                <Info size={12} className="shrink-0" />
                Success Rate = (Rank A Sales / Quota) · Funnel Rate = (Rank A Leads / Total Leads) · {formatFYLabel(reportFilterYear)}
              </div>
            </Card>

          </div>
        )}

      </div>
    </div>
  );
};

interface DropdownTabsProps {
  localRegions: string[];
  setLocalRegions: React.Dispatch<React.SetStateAction<string[]>>;
  localDepartments: string[];
  setLocalDepartments: React.Dispatch<React.SetStateAction<string[]>>;
  localBusinessTypes: string[];
  setLocalBusinessTypes: React.Dispatch<React.SetStateAction<string[]>>;
  inputBase: string;
  handleAddRegion: () => void;
  handleDeleteRegion: (region: string) => void;
  newRegionName: string;
  setNewRegionName: (val: string) => void;
  handleAddDepartment: () => void;
  handleDeleteDepartment: (dept: string) => void;
  newDepartmentName: string;
  setNewDepartmentName: (val: string) => void;
  handleAddBusinessType: () => void;
  handleDeleteBusinessType: (type: string) => void;
  newBusinessTypeName: string;
  setNewBusinessTypeName: (val: string) => void;
}

const DropdownTabs: React.FC<DropdownTabsProps> = ({
  localRegions,
  localDepartments,
  localBusinessTypes,
  handleAddRegion,
  handleDeleteRegion,
  newRegionName,
  setNewRegionName,
  handleAddDepartment,
  handleDeleteDepartment,
  newDepartmentName,
  setNewDepartmentName,
  handleAddBusinessType,
  handleDeleteBusinessType,
  newBusinessTypeName,
  setNewBusinessTypeName,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'regions' | 'departments' | 'businessTypes'>('regions');

  return (
    <div className="px-6 py-5 flex flex-col gap-4">
      {/* Tab Buttons */}
      <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
        {(['regions', 'departments', 'businessTypes'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveSubTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              activeSubTab === tab
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'businessTypes' ? 'Business Types' : tab}
          </button>
        ))}
      </div>

      {/* Regions Tab Content */}
      {activeSubTab === 'regions' && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-300"
              type="text"
              placeholder="Add Region (e.g. North, EMEA)..."
              value={newRegionName}
              onChange={(e) => setNewRegionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRegion())}
            />
            <button
              type="button"
              onClick={handleAddRegion}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-[180px] overflow-y-auto pr-1">
            {localRegions.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No regions added</span>
            ) : (
              localRegions.map((region) => (
                <span
                  key={region}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:border-red-200 transition-all hover:bg-slate-50 group"
                >
                  {region}
                  <button
                    type="button"
                    onClick={() => handleDeleteRegion(region)}
                    className="text-slate-300 hover:text-red-500 font-bold ml-1 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Departments Tab Content */}
      {activeSubTab === 'departments' && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-300"
              type="text"
              placeholder="Add Department (e.g. Sales, HR)..."
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDepartment())}
            />
            <button
              type="button"
              onClick={handleAddDepartment}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-[180px] overflow-y-auto pr-1">
            {localDepartments.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No departments added</span>
            ) : (
              localDepartments.map((dept) => (
                <span
                  key={dept}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:border-red-200 transition-all hover:bg-slate-50 group"
                >
                  {dept}
                  <button
                    type="button"
                    onClick={() => handleDeleteDepartment(dept)}
                    className="text-slate-300 hover:text-red-500 font-bold ml-1 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Business Types Tab Content */}
      {activeSubTab === 'businessTypes' && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-300"
              type="text"
              placeholder="Add Business Type (e.g. Enterprise, SMB)..."
              value={newBusinessTypeName}
              onChange={(e) => setNewBusinessTypeName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBusinessType())}
            />
            <button
              type="button"
              onClick={handleAddBusinessType}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-[180px] overflow-y-auto pr-1">
            {localBusinessTypes.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No business types added</span>
            ) : (
              localBusinessTypes.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:border-red-200 transition-all hover:bg-slate-50 group"
                >
                  {type}
                  <button
                    type="button"
                    onClick={() => handleDeleteBusinessType(type)}
                    className="text-slate-300 hover:text-red-500 font-bold ml-1 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;







