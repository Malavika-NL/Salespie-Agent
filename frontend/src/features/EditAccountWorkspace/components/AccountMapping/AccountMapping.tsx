// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../../../../app/store';

// import styles from './AccountMapping.module.css';
// import Cards from './Cards';
// import AddContactForm from './AddContactForm/AddContactForm';
// import { IoAddCircleOutline } from 'react-icons/io5';
// import { addContact, updateContact } from '../../Slice/EditAccountWorkspaceSlice';

// interface Contact {
//   category: string;
//   name: string;
//   designation: string;
//   mobile_no: string;
//   email_id: string;
// }

// const AccountMapping: React.FC = () => {
//   const dispatch = useDispatch();

//   // Access contacts from formData in the Redux state
//   const contacts = useSelector(
//     (state: RootState) => state.AccountWorkspaceEditFormData.formData?.contacts || []
//   );

//   const [showForm, setShowForm] = useState(false);

//   const handleAddContactClick = () => {
//     setShowForm(!showForm);
//   };

//   const handleAddContact = (newContact: Contact) => {
//     dispatch(addContact(newContact)); // Dispatch addContact action
//     setShowForm(false); // Close the form
//   };

//   const handleSaveContact = (updatedDetails: Contact, index: number) => {
//     dispatch(updateContact({ updatedContact: updatedDetails, index })); // Dispatch updateContact action
//   };

//   const chunkData = (data: typeof contacts, size: number) => {
//     const chunks = [];
//     for (let i = 0; i < data.length; i += size) {
//       chunks.push(data.slice(i, i + size));
//     }
//     return chunks;
//   };

//   const addPlaceholders = (rows: typeof contacts[]) => {
//     return rows.map((row) => {
//       const placeholdersNeeded = 5 - row.length;
//       return [...row, ...Array(placeholdersNeeded).fill(null)];
//     });
//   };

//   const rows = addPlaceholders(chunkData(contacts, 5));

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <p className={styles.heading}>Account Mapping</p>
//       </div>
//       <div className={styles.dashedLine}></div>
//       <div className={styles.gridContainer}>
//         <div className={styles.fixedWidthDiv}>
//           <div className={styles.hq}>HQ</div>
//           <div className={styles.arrow}>
//             <div className={styles.arrowTail}></div>
//             <div className={styles.arrowHead}></div>
//           </div>
//         </div>
//         <div className={styles.flexibleWidthDiv}>
//           {rows.map((row, rowIndex) => (
//             <div key={rowIndex} className={styles.row}>
//               {row.map((contact, index) =>
//                 contact ? (
//                   <div key={index} className={styles.box}>
//                     <Cards
//                       category={contact.category}
//                       name={contact.name}
//                       designation={contact.designation}
//                       mobile_no={contact.mobile_no}
//                       email_id={contact.email_id}
//                       index={index}
//                       onSave={handleSaveContact} // Handle save
//                     />
//                   </div>
//                 ) : (
//                   <div key={index} className={styles.hiddenCard}></div>
//                 )
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className={styles.buttonContainer}>
//         {!showForm && (
//           <button onClick={handleAddContactClick} className={styles.addButton}>
//             <IoAddCircleOutline /> Add Contact
//           </button>
//         )}
//       </div>
//       {showForm && (
//         <AddContactForm
//           onAddContact={handleAddContact}
//           onCancel={handleAddContactClick}
//         />
//       )}
//     </div>
//   );
// };

// export default AccountMapping;

// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../../../../app/store';
// import axios from 'axios';

// import styles from './AccountMapping.module.css';
// import Cards from './Cards';
// import AddContactForm from './AddContactForm/AddContactForm';
// import { IoAddCircleOutline } from 'react-icons/io5';
// import { addContact, updateContact } from '../../Slice/EditAccountWorkspaceSlice';
// import store from '../../../../app/store';

// import {
//   Camera, Upload, Loader2, CheckCircle, XCircle,
//   RefreshCw, User, Building2, Mail, Phone, Briefcase,
//   MapPin, Eye, EyeOff, X, ZoomIn, ScanLine,
// } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Contact {
//   category: string;
//   name: string;
//   designation: string;
//   mobile_no: string;
//   email_id: string;
// }

// interface ScannedForm {
//   name: string;
//   company_name: string;
//   email_id: string;
//   mobile_no: string;
//   designation: string;
//   address: string;
//   category: string;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const API_BASE_URL = '/api';

// const CATEGORY_OPTIONS = [
//   { value: 'plant_head',      label: 'Plant Head' },
//   { value: 'purchase_head',   label: 'Purchase Head' },
//   { value: 'it_head',         label: 'IT Head' },
//   { value: 'quality_head',    label: 'Quality Head' },
//   { value: 'production_head', label: 'Production Head' },
//   { value: 'plant_pic',       label: 'Plant PIC' },
//   { value: 'purchase_pic',    label: 'Purchase PIC' },
//   { value: 'it_pic',          label: 'IT PIC' },
//   { value: 'quality_pic',     label: 'Quality PIC' },
//   { value: 'production_pic',  label: 'Production PIC' },
// ];

// const SCAN_FIELDS: {
//   key: keyof ScannedForm;
//   label: string;
//   Icon: any;
//   placeholder: string;
//   isSelect?: boolean;
// }[] = [
//   { key: 'name',         label: 'Name',        Icon: User,      placeholder: 'John Doe' },
//   { key: 'designation',  label: 'Designation', Icon: Briefcase, placeholder: 'Sales Manager' },
//   { key: 'mobile_no',    label: 'Phone',       Icon: Phone,     placeholder: '+91 98765 43210' },
//   { key: 'email_id',     label: 'Email',       Icon: Mail,      placeholder: 'john@acme.com' },
//   { key: 'company_name', label: 'Company',     Icon: Building2, placeholder: 'Acme Corp' },
//   { key: 'address',      label: 'Address',     Icon: MapPin,    placeholder: '123 Main St' },
//   { key: 'category',     label: 'Category',    Icon: Briefcase, placeholder: 'plant_head', isSelect: true },
// ];

// const getAuthHeaders = () => {
//   const token = store.getState().userLoginAuth.user.tokens.access;
//   return { Authorization: `Bearer ${token}` };
// };

// // ─── Camera Modal ─────────────────────────────────────────────────────────────

// const CameraModal: React.FC<{
//   onCapture: (f: File) => void;
//   onClose: () => void;
// }> = ({ onCapture, onClose }) => {
//   const videoRef  = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const streamRef = useRef<MediaStream | null>(null);

//   const [ready,    setReady]    = useState(false);
//   const [captured, setCaptured] = useState<string | null>(null);
//   const [camErr,   setCamErr]   = useState<string | null>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const s = await navigator.mediaDevices.getUserMedia({
//           video: {
//             facingMode: 'environment',
//             width:  { ideal: 1280 },
//             height: { ideal: 720 },
//           },
//         });
//         streamRef.current = s;
//         if (videoRef.current) {
//           videoRef.current.srcObject = s;
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current?.play();
//             setReady(true);
//           };
//         }
//       } catch (e: any) {
//         setCamErr(
//           e.name === 'NotAllowedError'
//             ? 'Camera access denied. Allow camera in browser settings.'
//             : `Camera error: ${e.message}`
//         );
//       }
//     })();
//     return () => {
//       streamRef.current?.getTracks().forEach(t => t.stop());
//     };
//   }, []);

//   const capture = useCallback(() => {
//     if (!videoRef.current || !canvasRef.current) return;
//     const v = videoRef.current;
//     const c = canvasRef.current;
//     c.width  = v.videoWidth;
//     c.height = v.videoHeight;
//     c.getContext('2d')?.drawImage(v, 0, 0);
//     setCaptured(c.toDataURL('image/jpeg', 0.9));
//     streamRef.current?.getTracks().forEach(t => t.stop());
//   }, []);

//   const retake = useCallback(async () => {
//     setCaptured(null);
//     try {
//       const s = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: 'environment' },
//       });
//       streamRef.current = s;
//       if (videoRef.current) {
//         videoRef.current.srcObject = s;
//         videoRef.current.play();
//       }
//     } catch {
//       setCamErr('Could not restart camera.');
//     }
//   }, []);

//   const usePhoto = useCallback(() => {
//     if (!captured || !canvasRef.current) return;
//     canvasRef.current.toBlob(blob => {
//       if (blob) {
//         onCapture(new File([blob], 'capture.jpg', { type: 'image/jpeg' }));
//         onClose();
//       }
//     }, 'image/jpeg', 0.9);
//   }, [captured, onCapture, onClose]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
//       <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">

//         <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
//           <div className="flex items-center gap-2 text-slate-800 font-bold">
//             <Camera size={16} className="text-indigo-500" /> Take Photo
//           </div>
//           <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
//             <X size={16} className="text-slate-500" />
//           </button>
//         </div>

//         {camErr && (
//           <div className="m-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm flex items-start gap-2">
//             <XCircle size={15} className="mt-0.5 shrink-0" /> {camErr}
//           </div>
//         )}

//         <div className="relative bg-black">
//           {!captured
//             ? <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-80 object-contain" />
//             : <img src={captured} alt="captured" className="w-full max-h-80 object-contain" />
//           }
//           {ready && !captured && (
//             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//               <div className="border-2 border-white/50 rounded-lg w-4/5 h-3/4 flex items-center justify-center">
//                 <span className="text-white/50 text-xs">Position card here</span>
//               </div>
//             </div>
//           )}
//           <canvas ref={canvasRef} className="hidden" />
//         </div>

//         <div className="flex gap-3 p-4 border-t border-slate-100">
//           {!captured ? (
//             <>
//               <button
//                 onClick={onClose}
//                 className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={capture}
//                 disabled={!ready}
//                 className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 hover:bg-indigo-700"
//               >
//                 <Camera size={15} /> Capture
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={retake}
//                 className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
//               >
//                 <RefreshCw size={14} /> Retake
//               </button>
//               <button
//                 onClick={usePhoto}
//                 className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700"
//               >
//                 <CheckCircle size={15} /> Use Photo
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Card Scan Modal ──────────────────────────────────────────────────────────

// const CardScanModal: React.FC<{
//   onClose: () => void;
//   onSaved: () => void;
// }> = ({ onClose, onSaved }) => {
//   const dispatch = useDispatch();

//   // ── Get current contacts from Redux (User Edit slice) ─────────────────────
//   const currentContacts = useSelector(
//     (state: RootState) =>
//       state.AccountWorkspaceEditFormData.formData?.contacts || []
//   );

//   const [scanStep,     setScanStep]     = useState<'upload' | 'review' | 'done'>('upload');
//   const [imageFile,    setImageFile]    = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [isScanning,   setIsScanning]   = useState(false);
//   const [rawText,      setRawText]      = useState('');
//   const [showRaw,      setShowRaw]      = useState(false);
//   const [showCamera,   setShowCamera]   = useState(false);
//   const [error,        setError]        = useState<string | null>(null);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [form, setForm] = useState<ScannedForm>({
//     name: '', company_name: '', email_id: '', mobile_no: '',
//     designation: '', address: '', category: 'plant_head',
//   });

//   const handleFile = (file: File) => {
//     setImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//     setError(null);
//   };

//   // ── Step 1: OCR + Groq scan ───────────────────────────────────────────────
//   const handleScan = async () => {
//     if (!imageFile) { setError('Please select an image first.'); return; }
//     setIsScanning(true);
//     setError(null);

//     const fd = new FormData();
//     fd.append('image', imageFile);

//     try {
//       const res = await axios.post(
//         `${API_BASE_URL}/visiting-cards/scan/`, fd,
//         { headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' } }
//       );
//       const { parsed, raw_text } = res.data;
//       setRawText(raw_text || '');
//       setForm(prev => ({
//         ...prev,
//         name:         parsed.person_name  || '',
//         company_name: parsed.company_name || '',
//         email_id:     parsed.email        || '',
//         mobile_no:    parsed.phone        || '',
//         designation:  parsed.designation  || '',
//         address:      parsed.address      || '',
//       }));
//       setScanStep('review');
//     } catch (e: any) {
//       setError(e.response?.data?.error || 'Scanning failed. Please try again.');
//     } finally {
//       setIsScanning(false);
//     }
//   };

//   // ── Step 2: Duplicate check + dispatch to Redux (User Edit slice) ─────────
//   const handleSaveToContacts = () => {
//     // Validate name
//     if (!form.name.trim()) {
//       setError('Please enter a name for the contact.');
//       return;
//     }

//     // ── Duplicate check against existing contacts in Redux ────────────────
//     const isDuplicate = currentContacts.some(contact => {
//       const emailMatch =
//         form.email_id.trim() &&
//         contact.email_id?.trim() &&
//         form.email_id.trim().toLowerCase() ===
//         contact.email_id.trim().toLowerCase();

//       const mobileMatch =
//         form.mobile_no.trim() &&
//         contact.mobile_no?.trim() &&
//         form.mobile_no.trim().replace(/\s+/g, '') ===
//         contact.mobile_no.trim().replace(/\s+/g, '');

//       const nameMatch =
//         form.name.trim() &&
//         contact.name?.trim() &&
//         form.name.trim().toLowerCase() ===
//         contact.name.trim().toLowerCase();

//       return emailMatch || mobileMatch || nameMatch;
//     });

//     if (isDuplicate) {
//       setError(
//         `This contact already exists. "${form.name}" has already been added.`
//       );
//       return;
//     }
//     // ── End duplicate check ───────────────────────────────────────────────

//     // Dispatch to User Edit slice
//     dispatch(addContact({
//       category:    form.category,
//       name:        form.name,
//       designation: form.designation,
//       mobile_no:   form.mobile_no,
//       email_id:    form.email_id,
//     }));

//     setScanStep('done');
//     onSaved();
//   };

//   const resetScan = () => {
//     setScanStep('upload');
//     setImageFile(null);
//     setImagePreview(null);
//     setForm({
//       name: '', company_name: '', email_id: '',
//       mobile_no: '', designation: '', address: '',
//       category: 'plant_head',
//     });
//     setRawText('');
//     setError(null);
//     setShowRaw(false);
//   };

//   return (
//     <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/50 overflow-y-auto p-4 pt-10">
//       <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl mb-10">

//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
//               <ScanLine size={18} className="text-white" />
//             </div>
//             <div>
//               <h2 className="font-bold text-slate-900 text-base">Scan Visiting Card</h2>
//               <p className="text-xs text-slate-400">OCR + AI parsing → auto-fill contact</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
//           >
//             <X size={18} className="text-slate-500" />
//           </button>
//         </div>

//         {/* Step indicators */}
//         <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 border-b border-slate-100">
//           {['Upload Card', 'Review & Edit', 'Saved!'].map((label, i) => {
//             const stepKeys = ['upload', 'review', 'done'];
//             const idx    = stepKeys.indexOf(scanStep);
//             const done   = idx > i;
//             const active = idx === i;
//             return (
//               <React.Fragment key={label}>
//                 {i > 0 && <div className="flex-1 h-px bg-slate-200" />}
//                 <div className="flex items-center gap-1.5">
//                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
//                     ${done   ? 'bg-indigo-600 text-white'
//                     : active ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-400'
//                              : 'bg-slate-200 text-slate-400'}`}>
//                     {done ? <CheckCircle size={12} /> : i + 1}
//                   </div>
//                   <span className={`text-xs font-semibold hidden sm:block
//                     ${active ? 'text-indigo-700' : done ? 'text-indigo-500' : 'text-slate-400'}`}>
//                     {label}
//                   </span>
//                 </div>
//               </React.Fragment>
//             );
//           })}
//         </div>

//         <div className="p-6">
//           {/* Error banner */}
//           {error && (
//             <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
//               <XCircle size={15} className="mt-0.5 shrink-0" /> {error}
//             </div>
//           )}

//           {/* ── STEP 1: UPLOAD ── */}
//           {scanStep === 'upload' && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <div
//                   onClick={() => fileInputRef.current?.click()}
//                   className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
//                     ${imagePreview
//                       ? 'border-indigo-300 bg-indigo-50'
//                       : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}
//                 >
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={e => {
//                       const f = e.target.files?.[0];
//                       if (f) handleFile(f);
//                     }}
//                   />
//                   {imagePreview ? (
//                     <img
//                       src={imagePreview}
//                       alt="preview"
//                       className="max-h-44 mx-auto rounded-xl shadow object-contain"
//                     />
//                   ) : (
//                     <>
//                       <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
//                         <Upload size={24} className="text-indigo-400" />
//                       </div>
//                       <p className="font-semibold text-slate-700 mb-1 text-sm">Click to upload</p>
//                       <p className="text-xs text-slate-400">PNG, JPG, JPEG</p>
//                     </>
//                   )}
//                 </div>

//                 <button
//                   onClick={() => setShowCamera(true)}
//                   className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
//                 >
//                   <Camera size={14} className="text-indigo-500" /> Use Camera
//                 </button>

//                 {imagePreview && (
//                   <button
//                     onClick={() => { setImageFile(null); setImagePreview(null); }}
//                     className="mt-1 w-full text-xs text-red-400 hover:underline"
//                   >
//                     Remove image
//                   </button>
//                 )}
//               </div>

//               <div className="space-y-4">
//                 <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
//                   <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
//                     <ZoomIn size={13} className="text-indigo-500" /> Tips for Best Results
//                   </h4>
//                   {[
//                     ['Good Lighting',     'Ensure the card is well-lit, no shadows'],
//                     ['Flat Surface',      'Place card flat before photographing'],
//                     ['Clear & Sharp',     'Make sure text is in focus'],
//                     ['Full Card Visible', 'Include all edges in the photo'],
//                   ].map(([t, d]) => (
//                     <div key={t} className="flex gap-2 mb-2 last:mb-0">
//                       <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded text-xs font-bold flex items-center justify-center shrink-0">✓</div>
//                       <div>
//                         <p className="text-xs font-semibold text-slate-700">{t}</p>
//                         <p className="text-xs text-slate-400">{d}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <button
//                   onClick={handleScan}
//                   disabled={!imageFile || isScanning}
//                   className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
//                 >
//                   {isScanning
//                     ? <><Loader2 size={16} className="animate-spin" /> Scanning...</>
//                     : <><ScanLine size={16} /> Scan Card</>}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* ── STEP 2: REVIEW & EDIT ── */}
//           {scanStep === 'review' && (
//             <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

//               {/* Left: image + raw text */}
//               <div className="lg:col-span-2 space-y-3">
//                 {imagePreview && (
//                   <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
//                     <p className="text-xs font-bold text-slate-500 mb-2">Scanned Card</p>
//                     <img
//                       src={imagePreview}
//                       alt="card"
//                       className="w-full rounded-lg object-contain max-h-44"
//                     />
//                   </div>
//                 )}
//                 {rawText && (
//                   <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
//                     <button
//                       onClick={() => setShowRaw(v => !v)}
//                       className="flex items-center justify-between w-full text-xs font-bold text-slate-500"
//                     >
//                       <span className="flex items-center gap-1.5">
//                         {showRaw ? <EyeOff size={12} /> : <Eye size={12} />} Raw OCR Text
//                       </span>
//                       <span className="text-slate-300">{showRaw ? 'Hide' : 'Show'}</span>
//                     </button>
//                     {showRaw && (
//                       <pre className="mt-2 text-xs text-slate-500 bg-white rounded-lg p-2 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto border border-slate-100">
//                         {rawText}
//                       </pre>
//                     )}
//                   </div>
//                 )}
//                 <button
//                   onClick={resetScan}
//                   className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 font-medium"
//                 >
//                   <RefreshCw size={12} /> Scan different card
//                 </button>
//               </div>

//               {/* Right: editable fields */}
//               <div className="lg:col-span-3">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-bold text-slate-800 text-sm">Review & Edit Details</h3>
//                   <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-semibold">
//                     Auto-filled
//                   </span>
//                 </div>

//                 <div className="space-y-3">
//                   {SCAN_FIELDS.map(({ key, label, Icon, placeholder, isSelect }) => (
//                     <div key={key}>
//                       <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
//                         <Icon size={11} className="text-indigo-400" /> {label}
//                       </label>
//                       {isSelect ? (
//                         <select
//                           value={form[key]}
//                           onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
//                           className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
//                         >
//                           {CATEGORY_OPTIONS.map(o => (
//                             <option key={o.value} value={o.value}>{o.label}</option>
//                           ))}
//                         </select>
//                       ) : key === 'address' ? (
//                         <textarea
//                           rows={2}
//                           value={form[key]}
//                           onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
//                           placeholder={placeholder}
//                           className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
//                         />
//                       ) : (
//                         <input
//                           type="text"
//                           value={form[key]}
//                           onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
//                           placeholder={placeholder}
//                           className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 <button
//                   onClick={handleSaveToContacts}
//                   className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md"
//                 >
//                   <CheckCircle size={15} /> Add to Contacts
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* ── STEP 3: DONE ── */}
//           {scanStep === 'done' && (
//             <div className="text-center py-10">
//               <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <CheckCircle size={32} className="text-indigo-600" />
//               </div>
//               <h3 className="text-lg font-bold text-slate-900 mb-1">Contact Added!</h3>
//               <p className="text-sm text-slate-500 mb-6">
//                 <span className="font-semibold text-indigo-700">
//                   {form.name || 'Contact'}
//                 </span>
//                 {form.company_name ? ` from ${form.company_name}` : ''}{' '}
//                 has been added to Account Mapping.
//               </p>
//               <div className="flex gap-3 justify-center">
//                 <button
//                   onClick={resetScan}
//                   className="flex items-center gap-2 px-5 py-2.5 border-2 border-indigo-200 text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-50"
//                 >
//                   <ScanLine size={14} /> Scan Another
//                 </button>
//                 <button
//                   onClick={onClose}
//                   className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700"
//                 >
//                   <CheckCircle size={14} /> Done
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Camera sub-modal */}
//       {showCamera && (
//         <CameraModal
//           onCapture={f => { handleFile(f); setShowCamera(false); }}
//           onClose={() => setShowCamera(false)}
//         />
//       )}
//     </div>
//   );
// };

// // ─── Main AccountMapping Component ───────────────────────────────────────────

// const AccountMapping: React.FC = () => {
//   const dispatch = useDispatch();

//   // ── User Edit slice state path ────────────────────────────────────────────
//   const contacts = useSelector(
//     (state: RootState) =>
//       state.AccountWorkspaceEditFormData.formData?.contacts || []
//   );

//   const [showForm,      setShowForm]      = useState(false);
//   const [showScanModal, setShowScanModal] = useState(false);

//   const handleAddContact = (newContact: Contact) => {
//     dispatch(addContact(newContact));
//     setShowForm(false);
//   };

//   const handleSaveContact = (updatedDetails: Contact, index: number) => {
//     dispatch(updateContact({ updatedContact: updatedDetails, index }));
//   };

//   const chunkData = (data: typeof contacts, size: number) => {
//     const chunks = [];
//     for (let i = 0; i < data.length; i += size)
//       chunks.push(data.slice(i, i + size));
//     return chunks;
//   };

//   const addPlaceholders = (rows: typeof contacts[]) =>
//     rows.map(row => [...row, ...Array(5 - row.length).fill(null)]);

//   const rows = addPlaceholders(chunkData(contacts, 5));

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <p className={styles.heading}>Account Mapping</p>
//       </div>
//       <div className={styles.dashedLine}></div>

//       <div className={styles.gridContainer}>
//         <div className={styles.fixedWidthDiv}>
//           <div className={styles.hq}>HQ</div>
//           <div className={styles.arrow}>
//             <div className={styles.arrowTail}></div>
//             <div className={styles.arrowHead}></div>
//           </div>
//         </div>

//         <div className={styles.flexibleWidthDiv}>
//           {rows.map((row, rowIndex) => (
//             <div key={rowIndex} className={styles.row}>
//               {row.map((contact, index) =>
//                 contact ? (
//                   <div key={index} className={styles.box}>
//                     <Cards
//                       category={contact.category}
//                       name={contact.name}
//                       designation={contact.designation}
//                       mobile_no={contact.mobile_no}
//                       email_id={contact.email_id}
//                       index={index}
//                       onSave={handleSaveContact}
//                     />
//                   </div>
//                 ) : (
//                   <div key={index} className={styles.hiddenCard}></div>
//                 )
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Action buttons */}
//       <div className={styles.buttonContainer}>
//         {!showForm && (
//           <>
//             {/* Manual add */}
//             <button
//               onClick={() => setShowForm(true)}
//               className={styles.addButton}
//             >
//               <IoAddCircleOutline /> Add Contact
//             </button>

//             {/* Scan card */}
//             <button
//               onClick={() => setShowScanModal(true)}
//               className={styles.addButton}
//               style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
//             >
//               <ScanLine size={16} /> Scan Card
//             </button>
//           </>
//         )}
//       </div>

//       {/* Manual add form */}
//       {showForm && (
//         <AddContactForm
//           onAddContact={handleAddContact}
//           onCancel={() => setShowForm(false)}
//         />
//       )}

//       {/* Card scan modal */}
//       {showScanModal && (
//         <CardScanModal
//           onClose={() => setShowScanModal(false)}
//           onSaved={() => {
//             // modal stays open to show "done" step
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default AccountMapping;

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import axios from "axios";
import Cards from "./Cards";
import AddContactForm from "./AddContactForm/AddContactForm";
import store from "../../../../app/store";
import { IoAddCircleOutline } from "react-icons/io5";
import {
  Camera,
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
  User,
  Building2,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Eye,
  EyeOff,
  X,
  ZoomIn,
  ScanLine,
} from "lucide-react";
import {
  addContact,
  updateContact,
} from "../../Slice/EditAccountWorkspaceSlice";
import { GitBranch } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Contact {
  category: string;
  name: string;
  designation: string;
  mobile_no: string;
  email_id: string;
}

interface ScannedForm {
  name: string;
  company_name: string;
  email_id: string;
  mobile_no: string;
  designation: string;
  address: string;
  category: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE_URL = "/api";

const CATEGORY_OPTIONS = [
  { value: "plant_head", label: "Plant Head" },
  { value: "purchase_head", label: "Purchase Head" },
  { value: "it_head", label: "IT Head" },
  { value: "quality_head", label: "Quality Head" },
  { value: "production_head", label: "Production Head" },
  { value: "plant_pic", label: "Plant PIC" },
  { value: "purchase_pic", label: "Purchase PIC" },
  { value: "it_pic", label: "IT PIC" },
  { value: "quality_pic", label: "Quality PIC" },
  { value: "production_pic", label: "Production PIC" },
];

const SCAN_FIELDS: {
  key: keyof ScannedForm;
  label: string;
  Icon: any;
  placeholder: string;
  isSelect?: boolean;
}[] = [
  { key: "name", label: "Name", Icon: User, placeholder: "John Doe" },
  {
    key: "designation",
    label: "Designation",
    Icon: Briefcase,
    placeholder: "Sales Manager",
  },
  {
    key: "mobile_no",
    label: "Phone",
    Icon: Phone,
    placeholder: "+91 98765 43210",
  },
  { key: "email_id", label: "Email", Icon: Mail, placeholder: "john@acme.com" },
  {
    key: "company_name",
    label: "Company",
    Icon: Building2,
    placeholder: "Acme Corp",
  },
  // {
  //   key: "address",
  //   label: "Address",
  //   Icon: MapPin,
  //   placeholder: "123 Main St",
  // },
  {
    key: "category",
    label: "Category",
    Icon: Briefcase,
    placeholder: "plant_head",
    isSelect: true,
  },
];

const getAuthHeaders = () => {
  const token = store.getState().userLoginAuth.user.tokens.access;
  return { Authorization: `Bearer ${token}` };
};

// ─── Camera Modal ─────────────────────────────────────────────────────────────

const CameraModal: React.FC<{
  onCapture: (f: File) => void;
  onClose: () => void;
}> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [ready, setReady] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const [camErr, setCamErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setReady(true);
          };
        }
      } catch (e: any) {
        setCamErr(
          e.name === "NotAllowedError"
            ? "Camera access denied. Allow camera in browser settings."
            : `Camera error: ${e.message}`,
        );
      }
    })();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current,
      c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")?.drawImage(v, 0, 0);
    setCaptured(c.toDataURL("image/jpeg", 0.9));
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const retake = useCallback(async () => {
    setCaptured(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
      }
    } catch {
      setCamErr("Could not restart camera.");
    }
  }, []);

  const usePhoto = useCallback(() => {
    if (!captured || !canvasRef.current) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          onCapture(new File([blob], "capture.jpg", { type: "image/jpeg" }));
          onClose();
        }
      },
      "image/jpeg",
      0.9,
    );
  }, [captured, onCapture, onClose]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Camera size={16} className="text-indigo-500" /> Take Photo
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X size={16} className="text-slate-500" />
          </button>
        </div>
        {camErr && (
          <div className="m-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm flex items-start gap-2">
            <XCircle size={15} className="mt-0.5 shrink-0" /> {camErr}
          </div>
        )}
        <div className="relative bg-black">
          {!captured ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-h-80 object-contain"
            />
          ) : (
            <img
              src={captured}
              alt="captured"
              className="w-full max-h-80 object-contain"
            />
          )}
          {ready && !captured && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-white/50 rounded-lg w-4/5 h-3/4 flex items-center justify-center">
                <span className="text-white/50 text-xs">
                  Position card here
                </span>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="flex gap-3 p-4 border-t border-slate-100">
          {!captured ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={capture}
                disabled={!ready}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 hover:bg-indigo-700"
              >
                <Camera size={15} /> Capture
              </button>
            </>
          ) : (
            <>
              <button
                onClick={retake}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw size={14} /> Retake
              </button>
              <button
                onClick={usePhoto}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700"
              >
                <CheckCircle size={15} /> Use Photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Card Scan Modal ──────────────────────────────────────────────────────────

const CardScanModal: React.FC<{
  onClose: () => void;
  onSaved: () => void;
}> = ({ onClose, onSaved }) => {
  const dispatch = useDispatch();

  // ── Get current contacts from Redux (User Edit slice) ─────────────────────
  const currentContacts = useSelector(
    (state: RootState) =>
      state.AccountWorkspaceEditFormData.formData?.contacts || [],
  );

  const [scanStep, setScanStep] = useState<"upload" | "review" | "done">(
    "upload",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [rawText, setRawText] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ScannedForm>({
    name: "",
    company_name: "",
    email_id: "",
    mobile_no: "",
    designation: "",
    address: "",
    category: "plant_head",
  });

  const handleFile = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  // ── Step 1: OCR + Groq scan ───────────────────────────────────────────────
  const handleScan = async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }
    setIsScanning(true);
    setError(null);
    const fd = new FormData();
    fd.append("image", imageFile);
    try {
      const res = await axios.post(`${API_BASE_URL}/visiting-cards/scan/`, fd, {
        headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
      });
      const { parsed, raw_text } = res.data;
      setRawText(raw_text || "");
      setForm((prev) => ({
        ...prev,
        name: parsed.person_name || "",
        company_name: parsed.company_name || "",
        email_id: parsed.email || "",
        mobile_no: parsed.phone || "",
        designation: parsed.designation || "",
        address: parsed.address || "",
      }));
      setScanStep("review");
    } catch (e: any) {
      setError(e.response?.data?.error || "Scanning failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  // ── Step 2: Duplicate check + dispatch to Redux (User Edit slice) ─────────
  const handleSaveToContacts = () => {
    if (!form.name.trim()) {
      setError("Please enter a name for the contact.");
      return;
    }
    const isDuplicate = currentContacts.some((contact) => {
      const emailMatch =
        form.email_id.trim() &&
        contact.email_id?.trim() &&
        form.email_id.trim().toLowerCase() ===
          contact.email_id.trim().toLowerCase();
      const mobileMatch =
        form.mobile_no.trim() &&
        contact.mobile_no?.trim() &&
        form.mobile_no.trim().replace(/\s+/g, "") ===
          contact.mobile_no.trim().replace(/\s+/g, "");
      const nameMatch =
        form.name.trim() &&
        contact.name?.trim() &&
        form.name.trim().toLowerCase() === contact.name.trim().toLowerCase();
      return emailMatch || mobileMatch || nameMatch;
    });
    if (isDuplicate) {
      setError(
        `This contact already exists. "${form.name}" has already been added.`,
      );
      return;
    }
    dispatch(
      addContact({
        category: form.category,
        name: form.name,
        designation: form.designation,
        mobile_no: form.mobile_no,
        email_id: form.email_id,
      }),
    );
    setScanStep("done");
    onSaved();
  };

  const resetScan = () => {
    setScanStep("upload");
    setImageFile(null);
    setImagePreview(null);
    setForm({
      name: "",
      company_name: "",
      email_id: "",
      mobile_no: "",
      designation: "",
      address: "",
      category: "plant_head",
    });
    setRawText("");
    setError(null);
    setShowRaw(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 overflow-y-auto p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl mb-10">
        {/* <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center"><ScanLine size={18} className="text-white" /></div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Scan Visiting Card</h2>
              <p className="text-xs text-slate-400">OCR + AI parsing → auto-fill contact</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><X size={18} className="text-slate-500" /></button>
        </div> */}

        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-500 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <ScanLine size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">
                Scan Visiting Card
              </h2>
              <p className="text-xs text-indigo-100">
                OCR + AI parsing → auto-fill contact
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 border-b border-slate-100">
          {["Upload Card", "Review & Edit", "Saved!"].map((label, i) => {
            const stepKeys = ["upload", "review", "done"];
            const idx = stepKeys.indexOf(scanStep);
            const done = idx > i,
              active = idx === i;
            return (
              <React.Fragment key={label}>
                {i > 0 && <div className="flex-1 h-px bg-slate-200" />}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-indigo-600 text-white" : active ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-400" : "bg-slate-200 text-slate-400"}`}
                  >
                    {done ? <CheckCircle size={12} /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:block ${active ? "text-indigo-700" : done ? "text-indigo-500" : "text-slate-400"}`}
                  >
                    {label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
              <XCircle size={15} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}

          {/* ── STEP 1: UPLOAD ── */}
          {scanStep === "upload" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${imagePreview ? "border-indigo-300 bg-indigo-50" : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30"}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="max-h-44 mx-auto rounded-xl shadow object-contain"
                    />
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload size={24} className="text-indigo-400" />
                      </div>
                      <p className="font-semibold text-slate-700 mb-1 text-sm">
                        Click to upload
                      </p>
                      <p className="text-xs text-slate-400">PNG, JPG, JPEG</p>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setShowCamera(true)}
                  className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Camera size={14} className="text-indigo-500" /> Use Camera
                </button>
                {imagePreview && (
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="mt-1 w-full text-xs text-red-400 hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                    <ZoomIn size={13} className="text-indigo-500" /> Tips for
                    Best Results
                  </h4>
                  {[
                    [
                      "Good Lighting",
                      "Ensure the card is well-lit, no shadows",
                    ],
                    ["Flat Surface", "Place card flat before photographing"],
                    ["Clear & Sharp", "Make sure text is in focus"],
                    ["Full Card Visible", "Include all edges in the photo"],
                  ].map(([t, d]) => (
                    <div key={t} className="flex gap-2 mb-2 last:mb-0">
                      <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded text-xs font-bold flex items-center justify-center shrink-0">
                        ✓
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          {t}
                        </p>
                        <p className="text-xs text-slate-400">{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleScan}
                  disabled={!imageFile || isScanning}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isScanning ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Scanning...
                    </>
                  ) : (
                    <>
                      <ScanLine size={16} /> Scan Card
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: REVIEW & EDIT ── */}
          {scanStep === "review" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-2 space-y-3">
                {imagePreview && (
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                    <p className="text-xs font-bold text-slate-500 mb-2">
                      Scanned Card
                    </p>
                    <img
                      src={imagePreview}
                      alt="card"
                      className="w-full rounded-lg object-contain max-h-44"
                    />
                  </div>
                )}
                {rawText && (
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                    <button
                      onClick={() => setShowRaw((v) => !v)}
                      className="flex items-center justify-between w-full text-xs font-bold text-slate-500"
                    >
                      <span className="flex items-center gap-1.5">
                        {showRaw ? <EyeOff size={12} /> : <Eye size={12} />} Raw
                        OCR Text
                      </span>
                      <span className="text-slate-300">
                        {showRaw ? "Hide" : "Show"}
                      </span>
                    </button>
                    {showRaw && (
                      <pre className="mt-2 text-xs text-slate-500 bg-white rounded-lg p-2 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto border border-slate-100">
                        {rawText}
                      </pre>
                    )}
                  </div>
                )}
                <button
                  onClick={resetScan}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 font-medium"
                >
                  <RefreshCw size={12} /> Scan different card
                </button>
              </div>
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 text-sm">
                    Review & Edit Details
                  </h3>
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-semibold">
                    Auto-filled
                  </span>
                </div>
                <div className="space-y-3">
                  {SCAN_FIELDS.map(
                    ({ key, label, Icon, placeholder, isSelect }) => (
                      <div key={key}>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          <Icon size={11} className="text-indigo-400" /> {label}
                        </label>
                        {isSelect ? (
                          <select
                            value={form[key]}
                            onChange={(e) =>
                              setForm((p) => ({ ...p, [key]: e.target.value }))
                            }
                            className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white [&>option]:text-slate-800"
                          >
                            {CATEGORY_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        ) : key === "address" ? (
                          <textarea
                            rows={2}
                            value={form[key]}
                            onChange={(e) =>
                              setForm((p) => ({ ...p, [key]: e.target.value }))
                            }
                            placeholder={placeholder}
                            className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={form[key]}
                            onChange={(e) =>
                              setForm((p) => ({ ...p, [key]: e.target.value }))
                            }
                            placeholder={placeholder}
                            className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                          />
                        )}
                      </div>
                    ),
                  )}
                </div>
                <button
                  onClick={handleSaveToContacts}
                  className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md"
                >
                  <CheckCircle size={15} /> Add to Contacts
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: DONE ── */}
          {scanStep === "done" && (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Contact Added!
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                <span className="font-semibold text-indigo-700">
                  {form.name || "Contact"}
                </span>
                {form.company_name ? ` from ${form.company_name}` : ""} has been
                added to Account Mapping.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={resetScan}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-indigo-200 text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-50"
                >
                  <ScanLine size={14} /> Scan Another
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700"
                >
                  <CheckCircle size={14} /> Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showCamera && (
        <CameraModal
          onCapture={(f) => {
            handleFile(f);
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

// ─── Main AccountMapping Component ───────────────────────────────────────────

const AccountMapping: React.FC = () => {
  const dispatch = useDispatch();

  // ── User Edit slice state path ────────────────────────────────────────────
  const contacts = useSelector(
    (state: RootState) =>
      state.AccountWorkspaceEditFormData.formData?.contacts || [],
  );

  const [showForm, setShowForm] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  const handleAddContact = (newContact: Contact) => {
    dispatch(addContact(newContact));
    setShowForm(false);
  };

  const handleSaveContact = (updatedDetails: Contact, index: number) => {
    dispatch(updateContact({ updatedContact: updatedDetails, index }));
  };

  const chunkData = (data: typeof contacts, size: number) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += size)
      chunks.push(data.slice(i, i + size));
    return chunks;
  };

  const addPlaceholders = (rows: (typeof contacts)[]) =>
    rows.map((row) => [...row, ...Array(5 - row.length).fill(null)]);

  const rows = addPlaceholders(chunkData(contacts, 5));

  return (
    <div className="rounded-2xl border-2 border-blue-100 shadow-lg overflow-hidden">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <GitBranch size={15} color="white" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">
            Account Mapping
          </h2>
        </div>
        <div className="flex gap-2">
          {!showForm && (
            <>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors"
              >
                <IoAddCircleOutline size={14} /> Add Contact
              </button>
              <button
                onClick={() => setShowScanModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors"
              >
                <ScanLine size={14} /> Scan Card
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4">
        <div className="flex gap-4 w-full">
          {/* HQ node */}
          <div className="flex flex-col items-center justify-start pt-1 shrink-0">
            <div className="bg-gradient-to-b from-indigo-600 to-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow">
              HQ
            </div>
            {contacts.length > 0 && (
              <div className="w-0.5 flex-1 bg-indigo-200 mt-2" />
            )}
          </div>

          {/* Contacts grid */}
          <div className="flex flex-col gap-3 w-full">
            {contacts.length === 0 ? (
              <div className="flex items-center justify-center h-20 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 text-sm text-indigo-400 font-medium">
                No contacts yet — click "Add Contact" to begin
              </div>
            ) : (
              rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
                >
                  {row.map((contact, index) =>
                    contact ? (
                      <Cards
                        key={index}
                        category={contact.category}
                        name={contact.name}
                        designation={contact.designation}
                        mobile_no={contact.mobile_no}
                        email_id={contact.email_id}
                        index={index}
                        onSave={handleSaveContact}
                      />
                    ) : (
                      <div key={index} className="invisible" />
                    ),
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Manual add form */}
      {showForm && (
        <AddContactForm
          onAddContact={handleAddContact}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Card scan modal */}
      {showScanModal && (
        <CardScanModal
          onClose={() => setShowScanModal(false)}
          onSaved={() => {
            // modal stays open to show "done" step
          }}
        />
      )}
    </div>
  );
};

export default AccountMapping;
