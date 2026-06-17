// // src/components/ResumeScan/ResumeScanningPage.tsx
// // Folder-based batch resume scanner — EasyOCR + Groq AI backend
// // Processes resumes one-by-one with review → save workflow

// import React, {
//   useState, useRef, useEffect, useCallback,
// } from 'react';
// import axios from 'axios';
// import {
//   FileText, Upload, Loader2, CheckCircle, XCircle,
//   RefreshCw, User, Mail, Phone, Briefcase, MapPin,
//   Eye, EyeOff, Download, Trash2, Edit3, Save, X,
//   FileSearch, Table2, ChevronUp, ChevronDown, Search,
//   AlertCircle, FileCheck, Clock, FolderOpen, Play,
//   SkipForward, RotateCcw, ListOrdered, CheckSquare,
//   AlertTriangle, Minus, ScanLine, Zap,
// } from 'lucide-react';

// const API_BASE_URL = '/api';
// const getAuthHeaders = () => ({
//   Authorization: `Bearer ${localStorage.getItem('access_token')}`,
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────────────────────────────────────

// type QueueStatus = 'pending' | 'processing' | 'completed' | 'failed';

// interface ResumeQueueItem {
//   id: string;
//   file: File;
//   status: QueueStatus;
//   parsedData?: ResumeForm;
//   rawText?: string;
//   error?: string;
//   savedId?: number;
//   action?: 'created' | 'updated';
// }

// interface ResumeForm {
//   name: string;
//   email: string;
//   phone: string;
//   designation: string;
//   address: string;
// }

// interface ResumeRecord {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   designation: string;
//   address: string;
//   raw_text: string;
//   status: string;
//   file_url: string | null;
//   created_at: string;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Constants
// // ─────────────────────────────────────────────────────────────────────────────

// const RESUME_FIELDS: {
//   key: keyof ResumeForm;
//   label: string;
//   icon: React.FC<any>;
//   placeholder: string;
//   type: string;
// }[] = [
//   { key: 'name',        label: 'Full Name',   icon: User,      placeholder: 'John Doe',              type: 'text'     },
//   { key: 'email',       label: 'Email',        icon: Mail,      placeholder: 'john@company.com',      type: 'email'    },
//   { key: 'phone',       label: 'Phone',        icon: Phone,     placeholder: '+91 98765 43210',       type: 'text'     },
//   { key: 'designation', label: 'Designation',  icon: Briefcase, placeholder: 'Software Engineer',    type: 'text'     },
//   { key: 'address',     label: 'Address',      icon: MapPin,    placeholder: 'City, State, Country',  type: 'textarea' },
// ];

// const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];
// const isValidResume = (file: File) =>
//   ACCEPTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));

// const uid = () => Math.random().toString(36).slice(2, 10);

// // ─────────────────────────────────────────────────────────────────────────────
// // Status Badge
// // ─────────────────────────────────────────────────────────────────────────────

// const StatusBadge: React.FC<{ status: QueueStatus; action?: 'created' | 'updated' }> = ({ status, action }) => {
//   if (status === 'completed' && action === 'updated') {
//     return (
//       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
//         <RefreshCw size={10} /> Updated
//       </span>
//     );
//   }
//   if (status === 'completed' && action === 'created') {
//     return (
//       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
//         <CheckCircle size={11} /> Saved
//       </span>
//     );
//   }
//   const map: Record<QueueStatus, { label: string; cls: string; icon: React.ReactNode }> = {
//     pending:    { label: 'Pending',    cls: 'bg-slate-100 text-slate-500', icon: <Minus size={11} /> },
//     processing: { label: 'Scanning…', cls: 'bg-amber-100 text-amber-700', icon: <Loader2 size={11} className="animate-spin" /> },
//     completed:  { label: 'Completed', cls: 'bg-teal-100 text-teal-700',   icon: <CheckCircle size={11} /> },
//     failed:     { label: 'Failed',    cls: 'bg-red-100 text-red-600',     icon: <AlertTriangle size={11} /> },
//   };
//   const { label, cls, icon } = map[status];
//   return (
//     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
//       {icon} {label}
//     </span>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Queue Panel
// // ─────────────────────────────────────────────────────────────────────────────

// const QueuePanel: React.FC<{
//   queue: ResumeQueueItem[];
//   currentIndex: number;
//   onRemove: (id: string) => void;
//   onRetry: (id: string) => void;
// }> = ({ queue, currentIndex, onRemove, onRetry }) => {
//   const completed = queue.filter(q => q.status === 'completed').length;
//   const failed    = queue.filter(q => q.status === 'failed').length;
//   const total     = queue.length;
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const itemRefs  = useRef<Record<string, HTMLDivElement | null>>({});

//   useEffect(() => {
//     if (currentIndex < 0 || currentIndex >= queue.length) return;
//     const currentId = queue[currentIndex].id;
//     const el = itemRefs.current[currentId];
//     if (el && scrollRef.current) {
//       el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
//     }
//   }, [currentIndex, queue]);

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
//       {/* Header */}
//       <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
//         <div className="flex items-center gap-2">
//           <ListOrdered size={15} className="text-teal-600" />
//           <span className="text-sm font-bold text-slate-700">Queue</span>
//         </div>
//         <div className="flex items-center gap-2 text-xs font-semibold">
//           <span className="text-teal-600">{completed}/{total}</span>
//           {failed > 0 && <span className="text-red-500">{failed} failed</span>}
//         </div>
//       </div>

//       {/* Live summary */}
//       {(queue.some(q => q.action === 'created') || queue.some(q => q.action === 'updated')) && (
//         <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-3 text-xs font-semibold shrink-0">
//           {queue.filter(q => q.action === 'created').length > 0 && (
//             <span className="text-teal-600 flex items-center gap-1">
//               <CheckCircle size={11} /> {queue.filter(q => q.action === 'created').length} new
//             </span>
//           )}
//           {queue.filter(q => q.action === 'updated').length > 0 && (
//             <span className="text-violet-600 flex items-center gap-1">
//               <RefreshCw size={10} /> {queue.filter(q => q.action === 'updated').length} updated
//             </span>
//           )}
//         </div>
//       )}

//       {/* Progress bar */}
//       <div className="px-4 py-2 border-b border-slate-100 shrink-0">
//         <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
//           <div
//             className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
//             style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
//           />
//         </div>
//         <p className="text-xs text-slate-400 mt-1">{total - completed} remaining</p>
//       </div>

//       {/* Items list */}
//       <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-50">
//         {queue.map((item, idx) => {
//           const isCurrent = idx === currentIndex;
//           const ext       = item.file.name.split('.').pop()?.toLowerCase();
//           return (
//             <div
//               key={item.id}
//               ref={el => { itemRefs.current[item.id] = el; }}
//               className={`px-4 py-3 flex items-start gap-3 transition-colors
//                 ${isCurrent ? 'bg-teal-50/60 border-l-2 border-teal-500' : 'border-l-2 border-transparent'}`}
//             >
//               <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5
//                 ${ext === 'pdf' ? 'bg-red-100' : 'bg-blue-100'}`}>
//                 <FileText size={14} className={ext === 'pdf' ? 'text-red-500' : 'text-blue-500'} />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-teal-700' : 'text-slate-700'}`}>
//                   {item.file.name}
//                 </p>
//                 <p className="text-xs text-slate-400">{(item.file.size / 1024).toFixed(0)} KB</p>
//                 <div className="mt-1"><StatusBadge status={item.status} action={item.action} /></div>
//                 {item.error && (
//                   <p className="text-xs text-red-500 mt-1 truncate" title={item.error}>{item.error}</p>
//                 )}
//               </div>
//               <div className="flex flex-col gap-1 shrink-0">
//                 {item.status === 'failed' && (
//                   <button onClick={() => onRetry(item.id)} title="Retry"
//                     className="p-1 rounded hover:bg-amber-50 text-amber-500 transition-colors">
//                     <RotateCcw size={13} />
//                   </button>
//                 )}
//                 {item.status === 'pending' && (
//                   <button onClick={() => onRemove(item.id)} title="Remove"
//                     className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
//                     <X size={13} />
//                   </button>
//                 )}
//                 {item.status === 'completed' && (
//                   <CheckSquare size={14} className={item.action === 'updated' ? 'text-violet-500 mt-1' : 'text-teal-500 mt-1'} />
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Folder / Multi-File Drop Zone
// // ─────────────────────────────────────────────────────────────────────────────

// const MultiFileDropZone: React.FC<{
//   onFiles: (files: File[]) => void;
//   disabled?: boolean;
// }> = ({ onFiles, disabled }) => {
//   const fileInputRef   = useRef<HTMLInputElement>(null);
//   const folderInputRef = useRef<HTMLInputElement>(null);
//   const [dragging, setDragging] = useState(false);

//   const processFileList = useCallback((fileList: FileList | File[]) => {
//     const files = Array.from(fileList).filter(isValidResume);
//     if (files.length) onFiles(files);
//   }, [onFiles]);

//   // Recursively traverse dropped folder entries (Chrome / Edge)
//   const traverseEntry = (entry: any, collected: File[]): Promise<void> =>
//     new Promise<void>((resolve) => {
//       if (entry.isFile) {
//         entry.getFile((f: File) => {
//           if (isValidResume(f)) collected.push(f);
//           resolve();
//         });
//       } else if (entry.isDirectory) {
//         const reader = entry.createReader();
//         const readBatch = () => {
//           reader.readEntries(async (entries: any[]) => {
//             if (!entries.length) { resolve(); return; }
//             await Promise.all(entries.map((e: any) => traverseEntry(e, collected)));
//             readBatch();
//           });
//         };
//         readBatch();
//       } else {
//         resolve();
//       }
//     });

//   const handleDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setDragging(false);
//     if (disabled) return;

//     const items = e.dataTransfer.items;
//     if (items?.length) {
//       const files: File[] = [];
//       const promises: Promise<void>[] = [];
//       for (let i = 0; i < items.length; i++) {
//         const item = items[i];
//         if (item.webkitGetAsEntry) {
//           const entry = item.webkitGetAsEntry();
//           if (entry) { promises.push(traverseEntry(entry, files)); continue; }
//         }
//         const f = item.getAsFile();
//         if (f && isValidResume(f)) files.push(f);
//       }
//       Promise.all(promises).then(() => { if (files.length) onFiles(files); });
//     } else {
//       processFileList(e.dataTransfer.files);
//     }
//   }, [disabled, onFiles, processFileList]);

//   return (
//     <div
//       onDragOver={e => { e.preventDefault(); if (!disabled) setDragging(true); }}
//       onDragLeave={() => setDragging(false)}
//       onDrop={handleDrop}
//       className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
//         ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-default'}
//         ${dragging ? 'border-teal-400 bg-teal-50 scale-[1.01]' : 'border-slate-300 hover:border-teal-300 hover:bg-teal-50/10'}`}
//     >
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept=".pdf,.docx"
//         multiple
//         className="hidden"
//         disabled={disabled}
//         onChange={e => { if (e.target.files) processFileList(e.target.files); e.target.value = ''; }}
//       />
//       {/* @ts-ignore webkitdirectory is non-standard */}
//       <input
//         ref={folderInputRef}
//         type="file"
//         webkitdirectory="true"
//         multiple
//         className="hidden"
//         disabled={disabled}
//         onChange={e => { if (e.target.files) processFileList(e.target.files); e.target.value = ''; }}
//       />

//       <div className="flex flex-col items-center gap-4">
//         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors
//           ${dragging ? 'bg-teal-100' : 'bg-slate-100'}`}>
//           {dragging
//             ? <FolderOpen size={28} className="text-teal-500" />
//             : <Upload    size={28} className="text-slate-400" />}
//         </div>
//         <div>
//           <p className="font-bold text-slate-700 mb-1">
//             {dragging ? 'Drop files or folder here!' : 'Drop a folder or individual resumes here'}
//           </p>
//           <p className="text-xs text-slate-400">
//             PDF and DOCX · Scanned PDFs supported via EasyOCR · Folder picks up all files inside
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
//           <button
//             type="button"
//             disabled={disabled}
//             onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
//             className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50"
//           >
//             <Upload size={14} /> Select Files
//           </button>
//           <button
//             type="button"
//             disabled={disabled}
//             onClick={e => { e.stopPropagation(); folderInputRef.current?.click(); }}
//             className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
//           >
//             <FolderOpen size={14} /> Select Folder
//           </button>
//         </div>
//         <p className="text-xs text-slate-400">
//           Folder selection works in Chrome & Edge · Drag-and-drop folder works in most browsers
//         </p>
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Inline Editable Row (Records table)
// // ─────────────────────────────────────────────────────────────────────────────

// const EditableRow: React.FC<{
//   resume: ResumeRecord;
//   onSave: (id: number, data: Partial<ResumeRecord>) => Promise<void>;
//   onDelete: (id: number) => void;
// }> = ({ resume, onSave, onDelete }) => {
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving]   = useState(false);
//   const [draft, setDraft]     = useState({
//     name: resume.name, email: resume.email,
//     phone: resume.phone, designation: resume.designation, address: resume.address,
//   });

//   const handleSave = async () => {
//     setSaving(true);
//     await onSave(resume.id, draft);
//     setSaving(false);
//     setEditing(false);
//   };

//   const cell = 'px-3 py-3 text-sm text-slate-700 whitespace-nowrap';
//   const inp  = 'w-full px-2 py-1 text-xs border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none bg-white';

//   return (
//     <tr className={`border-b border-slate-100 transition-colors ${editing ? 'bg-teal-50/40' : 'hover:bg-slate-50'}`}>
//       {editing ? (
//         <>
//           <td className="px-3 py-2"><input className={inp} value={draft.name}        onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}        placeholder="Name" /></td>
//           <td className="px-3 py-2"><input className={inp} value={draft.email}       onChange={e => setDraft(p => ({ ...p, email: e.target.value }))}       placeholder="Email" /></td>
//           <td className="px-3 py-2"><input className={inp} value={draft.phone}       onChange={e => setDraft(p => ({ ...p, phone: e.target.value }))}       placeholder="Phone" /></td>
//           <td className="px-3 py-2"><input className={inp} value={draft.designation} onChange={e => setDraft(p => ({ ...p, designation: e.target.value }))} placeholder="Designation" /></td>
//           <td className="px-3 py-2"><input className={inp} value={draft.address}     onChange={e => setDraft(p => ({ ...p, address: e.target.value }))}     placeholder="Address" /></td>
//           <td className="px-3 py-2 whitespace-nowrap">
//             <div className="flex items-center gap-1.5">
//               <button onClick={handleSave} disabled={saving}
//                 className="flex items-center gap-1 px-2.5 py-1 bg-teal-600 text-white text-xs rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50">
//                 {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />} Save
//               </button>
//               <button onClick={() => setEditing(false)}
//                 className="px-2 py-1 border border-slate-200 text-slate-500 text-xs rounded-lg hover:bg-slate-100">
//                 Cancel
//               </button>
//             </div>
//           </td>
//         </>
//       ) : (
//         <>
//           <td className={cell}>{resume.name        || <span className="text-slate-300 italic">—</span>}</td>
//           <td className={cell}>{resume.email       || <span className="text-slate-300 italic">—</span>}</td>
//           <td className={cell}>{resume.phone       || <span className="text-slate-300 italic">—</span>}</td>
//           <td className={cell}>{resume.designation || <span className="text-slate-300 italic">—</span>}</td>
//           <td className={`${cell} max-w-[180px] truncate`}>{resume.address || <span className="text-slate-300 italic">—</span>}</td>
//           <td className="px-3 py-3 whitespace-nowrap">
//             <div className="flex items-center gap-1.5">
//               <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-teal-600 transition-colors" title="Edit">
//                 <Edit3 size={14} />
//               </button>
//               <button onClick={() => onDelete(resume.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
//                 <Trash2 size={14} />
//               </button>
//             </div>
//           </td>
//         </>
//       )}
//     </tr>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Main Page
// // ─────────────────────────────────────────────────────────────────────────────

// const ResumeScanningPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'scan' | 'records'>('scan');

//   // Queue state
//   const [queue, setQueue]               = useState<ResumeQueueItem[]>([]);
//   const [currentIndex, setCurrentIndex] = useState<number>(-1);
//   const [queueStarted, setQueueStarted] = useState(false);

//   // Per-file review state
//   const [scanStep, setScanStep]       = useState<'upload' | 'review'>('upload');
//   const [isScanning, setIsScanning]   = useState(false);
//   const [isSaving, setIsSaving]       = useState(false);
//   const [rawText, setRawText]         = useState('');
//   const [showRaw, setShowRaw]         = useState(false);
//   const [scanError, setScanError]     = useState<string | null>(null);
//   const [allDone, setAllDone]         = useState(false);
//   const [emailExists, setEmailExists] = useState<boolean | null>(null);
//   const [form, setForm]               = useState<ResumeForm>({
//     name: '', email: '', phone: '', designation: '', address: '',
//   });

//   // Records tab state
//   const [resumes, setResumes]               = useState<ResumeRecord[]>([]);
//   const [loadingRecords, setLoadingRecords] = useState(false);
//   const [recordsError, setRecordsError]     = useState<string | null>(null);
//   const [exportingExcel, setExportingExcel] = useState(false);
//   const [searchQuery, setSearchQuery]       = useState('');
//   const [sortKey, setSortKey]               = useState<keyof ResumeRecord>('created_at');
//   const [sortAsc, setSortAsc]               = useState(false);
//   const [deleteConfirm, setDeleteConfirm]   = useState<number | null>(null);

//   // ── Helpers ───────────────────────────────────────────────────────────────

//   const updateQueueItem = useCallback(
//     (id: string, patch: Partial<ResumeQueueItem>) =>
//       setQueue(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item)),
//     [],
//   );

//   // ── Add files / folder ────────────────────────────────────────────────────

//   const handleAddFiles = useCallback((files: File[]) => {
//     const newItems: ResumeQueueItem[] = files.map(file => ({
//       id: uid(), file, status: 'pending',
//     }));
//     setQueue(prev => {
//       const existing = new Set(prev.map(p => `${p.file.name}_${p.file.size}`));
//       return [...prev, ...newItems.filter(n => !existing.has(`${n.file.name}_${n.file.size}`))];
//     });
//     setAllDone(false);
//   }, []);

//   // ── Scan one file ─────────────────────────────────────────────────────────
//   // Backend does: pdfplumber → PyMuPDF → EasyOCR → Groq AI parsing

//   const scanFile = useCallback(async (item: ResumeQueueItem) => {
//     setScanError(null);
//     setShowRaw(false);
//     setIsScanning(true);
//     updateQueueItem(item.id, { status: 'processing' });

//     const fd = new FormData();
//     fd.append('file', item.file);

//     try {
//       const res = await axios.post(`${API_BASE_URL}/resumes/scan/`, fd, {
//         headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' },
//       });
//       const { parsed, raw_text } = res.data;
//       const parsedData: ResumeForm = {
//         name:        parsed.name        || '',
//         email:       parsed.email       || '',
//         phone:       parsed.phone       || '',
//         designation: parsed.designation || '',
//         address:     parsed.address     || '',
//       };
//       updateQueueItem(item.id, { parsedData, rawText: raw_text || '' });
//       setRawText(raw_text || '');
//       setForm(parsedData);
//       setEmailExists(null);
//       setScanStep('review');
//     } catch (err: any) {
//       const msg = err.response?.data?.error || 'Scan failed.';
//       updateQueueItem(item.id, { status: 'failed', error: msg });
//       setScanError(msg);
//       setScanStep('upload');
//     } finally {
//       setIsScanning(false);
//     }
//   }, [updateQueueItem]);

//   // ── Start queue ───────────────────────────────────────────────────────────

//   const startQueue = useCallback(() => {
//     const firstPending = queue.findIndex(q => q.status === 'pending');
//     if (firstPending === -1) return;
//     setQueueStarted(true);
//     setAllDone(false);
//     setCurrentIndex(firstPending);
//   }, [queue]);

//   useEffect(() => {
//     if (!queueStarted || currentIndex < 0 || currentIndex >= queue.length) return;
//     const item = queue[currentIndex];
//     if (item.status === 'pending') scanFile(item);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentIndex, queueStarted]);

//   // ── Email duplicate check ─────────────────────────────────────────────────

//   useEffect(() => {
//     if (scanStep !== 'review' || !form.email.trim()) {
//       setEmailExists(null);
//       return;
//     }
//     const needle = form.email.toLowerCase().trim();
//     const match  = resumes.some(r => (r.email || '').toLowerCase().trim() === needle);
//     setEmailExists(match);
//   }, [scanStep, form.email, resumes]);

//   // ── Advance to next pending ───────────────────────────────────────────────

//   const advanceQueue = useCallback((currentQueue: ResumeQueueItem[]) => {
//     const nextIdx = currentQueue.findIndex(
//       (q, i) => i > currentIndex && q.status === 'pending',
//     );
//     if (nextIdx !== -1) {
//       setCurrentIndex(nextIdx);
//     } else {
//       setCurrentIndex(-1);
//       setQueueStarted(false);
//       setAllDone(true);
//       setScanStep('upload');
//     }
//   }, [currentIndex]);

//   // ── Save ──────────────────────────────────────────────────────────────────

//   const handleSave = useCallback(async () => {
//     if (currentIndex < 0) return;
//     const item = queue[currentIndex];
//     setIsSaving(true);
//     setScanError(null);

//     const fd = new FormData();
//     Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//     fd.append('raw_text', rawText);
//     fd.append('file', item.file);

//     try {
//       const res = await axios.post(`${API_BASE_URL}/resumes/save/`, fd, {
//         headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' },
//       });
//       const nextQueue = queue.map(q =>
//         q.id === item.id
//           ? { ...q, status: 'completed' as QueueStatus, savedId: res.data.id, action: res.data.action }
//           : q,
//       );
//       setQueue(nextQueue);

//       if (res.data.action === 'created') {
//         setResumes(prev => [...prev, {
//           id: res.data.id, name: form.name, email: form.email,
//           phone: form.phone, designation: form.designation,
//           address: form.address, raw_text: rawText,
//           status: 'processed', file_url: null,
//           created_at: new Date().toISOString(),
//         }]);
//       } else {
//         setResumes(prev => prev.map(r =>
//           r.email?.toLowerCase().trim() === form.email.toLowerCase().trim()
//             ? { ...r, name: form.name, phone: form.phone, designation: form.designation, address: form.address }
//             : r,
//         ));
//       }

//       advanceQueue(nextQueue);
//     } catch (err: any) {
//       const msg = err.response?.data?.error || 'Save failed.';
//       updateQueueItem(item.id, { status: 'failed', error: msg });
//       setScanError(msg);
//     } finally {
//       setIsSaving(false);
//     }
//   }, [currentIndex, queue, form, rawText, updateQueueItem, advanceQueue]);

//   // ── Skip ──────────────────────────────────────────────────────────────────

//   const handleSkip = useCallback(() => {
//     if (currentIndex < 0) return;
//     const item = queue[currentIndex];
//     const nextQueue = queue.map(q =>
//       q.id === item.id ? { ...q, status: 'failed' as QueueStatus, error: 'Skipped by user' } : q,
//     );
//     setQueue(nextQueue);
//     advanceQueue(nextQueue);
//   }, [currentIndex, queue, advanceQueue]);

//   // ── Retry ─────────────────────────────────────────────────────────────────

//   const handleRetry = useCallback((id: string) => {
//     const idx = queue.findIndex(q => q.id === id);
//     if (idx === -1) return;
//     setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'pending', error: undefined } : q));
//     setCurrentIndex(idx);
//     setQueueStarted(true);
//     setAllDone(false);
//     setScanStep('upload');
//   }, [queue]);

//   // ── Remove pending ────────────────────────────────────────────────────────

//   const handleRemoveFromQueue = useCallback((id: string) => {
//     setQueue(prev => prev.filter(q => q.id !== id));
//   }, []);

//   // ── Full reset ────────────────────────────────────────────────────────────

//   const handleReset = useCallback(() => {
//     setQueue([]);
//     setCurrentIndex(-1);
//     setQueueStarted(false);
//     setAllDone(false);
//     setScanStep('upload');
//     setEmailExists(null);
//     setForm({ name: '', email: '', phone: '', designation: '', address: '' });
//     setRawText('');
//     setShowRaw(false);
//     setScanError(null);
//   }, []);

//   // ── Records ───────────────────────────────────────────────────────────────

//   const fetchRecords = async () => {
//     setLoadingRecords(true);
//     setRecordsError(null);
//     try {
//       const res = await axios.get(`${API_BASE_URL}/resumes/`, { headers: getAuthHeaders() });
//       setResumes(res.data.results ?? res.data);
//     } catch {
//       setRecordsError('Failed to load records.');
//     } finally {
//       setLoadingRecords(false);
//     }
//   };

//   useEffect(() => { fetchRecords(); }, []); // eslint-disable-line
//   useEffect(() => { if (activeTab === 'records') fetchRecords(); }, [activeTab]);

//   const handleUpdateRecord = async (id: number, data: Partial<ResumeRecord>) => {
//     await axios.patch(`${API_BASE_URL}/resumes/${id}/`, data, { headers: getAuthHeaders() });
//     setResumes(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
//   };

//   const handleDeleteRecord = async (id: number) => {
//     await axios.delete(`${API_BASE_URL}/resumes/${id}/`, { headers: getAuthHeaders() });
//     setResumes(prev => prev.filter(r => r.id !== id));
//     setDeleteConfirm(null);
//   };

//   const handleExport = async () => {
//     setExportingExcel(true);
//     try {
//       const res = await axios.get(`${API_BASE_URL}/resumes/export/`, {
//         headers: getAuthHeaders(), responseType: 'blob',
//       });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const a = document.createElement('a');
//       a.href = url; a.download = 'resumes.xlsx'; a.click();
//       window.URL.revokeObjectURL(url);
//     } catch {
//       setRecordsError('Export failed.');
//     } finally {
//       setExportingExcel(false);
//     }
//   };

//   const toggleSort = (key: keyof ResumeRecord) => {
//     if (sortKey === key) setSortAsc(p => !p);
//     else { setSortKey(key); setSortAsc(true); }
//   };

//   const filtered = resumes
//     .filter(r => {
//       const q = searchQuery.toLowerCase();
//       return !q || [r.name, r.email, r.phone, r.designation, r.address]
//         .some(v => (v || '').toLowerCase().includes(q));
//     })
//     .sort((a, b) => {
//       const va = String(a[sortKey] || ''), vb = String(b[sortKey] || '');
//       return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
//     });

//   const SortIcon = ({ col }: { col: keyof ResumeRecord }) => (
//     <span className="ml-1 inline-flex flex-col opacity-40">
//       <ChevronUp   size={10} className={sortKey === col && sortAsc  ? 'opacity-100 text-teal-600' : ''} />
//       <ChevronDown size={10} className={sortKey === col && !sortAsc ? 'opacity-100 text-teal-600' : ''} style={{ marginTop: -3 }} />
//     </span>
//   );

//   // ── Derived stats ──────────────────────────────────────────────────────────

//   const qStats = {
//     total:     queue.length,
//     completed: queue.filter(q => q.status === 'completed').length,
//     failed:    queue.filter(q => q.status === 'failed').length,
//     pending:   queue.filter(q => q.status === 'pending').length,
//     created:   queue.filter(q => q.action === 'created').length,
//     updated:   queue.filter(q => q.action === 'updated').length,
//   };

//   const currentItem = currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex] : null;
//   const hasQueue    = queue.length > 0;

//   // ── Render ─────────────────────────────────────────────────────────────────

//   return (
//     <div className="min-h-screen bg-[#f8fafb] font-sans pb-20">

//       {/* Page Header */}
//       <div className="bg-white border-b border-slate-200 px-6 py-5 shadow-sm">
//         <div className="flex items-center gap-3 mb-5">
//           <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
//             <FileSearch className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resume Scanner</h1>
//             <p className="text-sm text-slate-500 flex items-center gap-1.5">
//               <FolderOpen size={13} className="text-teal-500" />
//               Select a folder · AI extracts contact info (EasyOCR + Groq) · Export to Excel
//             </p>
//           </div>
//         </div>

//         <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
//           {([
//             { id: 'scan',    label: 'Scan Resumes', Icon: ScanLine },
//             { id: 'records', label: 'All Records',  Icon: Table2   },
//           ] as const).map(({ id, label, Icon }) => (
//             <button key={id} onClick={() => setActiveTab(id)}
//               className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200
//                 ${activeTab === id ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
//               <Icon size={15} /> {label}
//               {id === 'records' && resumes.length > 0 && (
//                 <span className="bg-teal-100 text-teal-700 text-xs font-bold px-1.5 py-0.5 rounded-full">{resumes.length}</span>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="px-4 py-6 max-w-7xl mx-auto">

//         {/* ══ TAB 1 — SCAN ══════════════════════════════════════════════════ */}
//         {activeTab === 'scan' && (
//           <>
//             {/* All done state */}
//             {allDone ? (
//               <div className="w-full text-center py-16">
//                 <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
//                   <CheckCircle className="w-10 h-10 text-teal-600" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Queue Complete!</h2>
//                 <div className="flex flex-wrap items-center justify-center gap-2 mb-3 mt-2">
//                   {qStats.created > 0 && (
//                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-teal-100 text-teal-700">
//                       <CheckCircle size={14} /> {qStats.created} new saved
//                     </span>
//                   )}
//                   {qStats.updated > 0 && (
//                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-violet-100 text-violet-700">
//                       <RefreshCw size={13} /> {qStats.updated} updated
//                     </span>
//                   )}
//                   {qStats.failed > 0 && (
//                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-600">
//                       <AlertTriangle size={13} /> {qStats.failed} failed / skipped
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
//                   <button onClick={handleReset}
//                     className="flex items-center gap-2 px-6 py-3 border-2 border-teal-200 text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-colors">
//                     <FolderOpen size={16} /> Scan Another Folder
//                   </button>
//                   <button onClick={() => { setActiveTab('records'); fetchRecords(); }}
//                     className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md">
//                     <Table2 size={16} /> View All Records
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {scanError && (
//                   <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700">
//                     <XCircle size={18} className="mt-0.5 shrink-0" />
//                     <p className="text-sm font-medium">{scanError}</p>
//                   </div>
//                 )}

//                 <div className={hasQueue
//                   ? 'grid grid-cols-1 lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_2.5fr] gap-5 items-stretch'
//                   : ''
//                 }>

//                   {/* ── Queue sidebar ─────────────────────────────────────── */}
//                   {hasQueue && (
//                     <div className="flex flex-col gap-3">
//                       <div className="flex-1 min-h-0">
//                         <QueuePanel
//                           queue={queue}
//                           currentIndex={currentIndex}
//                           onRemove={handleRemoveFromQueue}
//                           onRetry={handleRetry}
//                         />
//                       </div>

//                       <div className="flex flex-col gap-2 shrink-0">
//                         {!queueStarted && qStats.pending > 0 && (
//                           <button onClick={startQueue}
//                             className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold text-sm shadow-md hover:from-teal-700 hover:to-cyan-700 transition-all">
//                             <Play size={15} /> Start Processing ({qStats.pending} file{qStats.pending !== 1 ? 's' : ''})
//                           </button>
//                         )}

//                         <label className="flex items-center justify-center gap-2 w-full py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white">
//                           <Upload size={13} /> Add More Files
//                           <input type="file" accept=".pdf,.docx" multiple className="hidden"
//                             onChange={e => { if (e.target.files) handleAddFiles(Array.from(e.target.files).filter(isValidResume)); e.currentTarget.value = ''; }} />
//                         </label>

//                         <button onClick={handleReset}
//                           className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-slate-400 hover:text-red-500 transition-colors">
//                           <RefreshCw size={11} /> Clear Queue
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {/* ── Main area ──────────────────────────────────────────── */}
//                   <div className="flex flex-col">

//                     {/* No files yet — show drop zone + info card */}
//                     {!hasQueue && (
//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
//                           <h2 className="text-base font-bold text-slate-800 mb-1">Upload Resumes</h2>
//                           <p className="text-xs text-slate-400 mb-4">
//                             Select an entire folder — every PDF/DOCX inside will be queued automatically.
//                           </p>
//                           <MultiFileDropZone onFiles={handleAddFiles} />
//                         </div>

//                         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
//                           {/* How it works */}
//                           <div>
//                             <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
//                               <Zap size={14} className="text-teal-500" /> How it works
//                             </h3>
//                             {[
//                               { step: '1', label: 'Select folder',    desc: 'All PDFs & DOCX files inside are queued' },
//                               { step: '2', label: 'Text extraction',  desc: 'pdfplumber → PyMuPDF → EasyOCR (scanned)' },
//                               { step: '3', label: 'Groq AI parsing',  desc: 'LLM extracts name, email, phone, role' },
//                               { step: '4', label: 'Review & save',    desc: 'Confirm each resume before saving' },
//                               { step: '5', label: 'Export Excel',     desc: 'Download all saved resumes as .xlsx' },
//                             ].map(({ step, label, desc }) => (
//                               <div key={step} className="flex items-start gap-3 mb-2 last:mb-0">
//                                 <div className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{step}</div>
//                                 <div>
//                                   <p className="text-sm font-semibold text-slate-700">{label}</p>
//                                   <p className="text-xs text-slate-400">{desc}</p>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>

//                           {/* What gets extracted */}
//                           <div>
//                             <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
//                               <AlertCircle size={14} className="text-teal-500" /> Extracted fields
//                             </h3>
//                             {RESUME_FIELDS.map(({ icon: Icon, label, placeholder }) => (
//                               <div key={label} className="flex items-center gap-3 mb-2 last:mb-0">
//                                 <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
//                                   <Icon size={13} className="text-teal-600" />
//                                 </div>
//                                 <div>
//                                   <span className="text-sm font-semibold text-slate-700">{label}</span>
//                                   <span className="text-xs text-slate-400 ml-2">{placeholder}</span>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Files added but queue not started yet */}
//                     {hasQueue && !queueStarted && !isScanning && scanStep === 'upload' && (
//                       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1">
//                         <h2 className="text-base font-bold text-slate-800 mb-1">
//                           {qStats.total} file{qStats.total !== 1 ? 's' : ''} ready to process
//                         </h2>
//                         <p className="text-xs text-slate-400 mb-4">
//                           Press <strong>Start Processing</strong> in the sidebar to begin scanning one by one.
//                         </p>
//                         <MultiFileDropZone onFiles={handleAddFiles} />
//                       </div>
//                     )}

//                     {/* Scanning spinner + review form */}
//                     {queueStarted && currentItem && (
//                       <div className={`bg-white rounded-2xl shadow-sm border-2 transition-colors duration-300 overflow-hidden flex flex-col flex-1
//                         ${emailExists === true ? 'border-violet-300' : 'border-slate-200'}`}>

//                         {/* Card top bar */}
//                         <div className={`flex items-center justify-between px-5 py-3.5 border-b shrink-0
//                           ${emailExists === true ? 'border-violet-100 bg-violet-50/40' : 'border-slate-100 bg-slate-50/60'}`}>

//                           <div className="flex items-center gap-2.5 min-w-0">
//                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
//                               ${currentItem.file.name.endsWith('.pdf') ? 'bg-red-100' : 'bg-blue-100'}`}>
//                               <FileText size={15} className={currentItem.file.name.endsWith('.pdf') ? 'text-red-500' : 'text-blue-500'} />
//                             </div>
//                             <div className="min-w-0">
//                               <p className="text-sm font-semibold text-slate-700 truncate max-w-[280px]">{currentItem.file.name}</p>
//                               <p className="text-xs text-slate-400">{(currentItem.file.size / 1024).toFixed(1)} KB</p>
//                             </div>
//                           </div>

//                           <div className="flex items-center gap-3 shrink-0 ml-4">
//                             {emailExists === true && (
//                               <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold">
//                                 <RefreshCw size={11} /> Will update existing
//                               </span>
//                             )}
//                             <span className="text-xs text-slate-400 font-semibold">
//                               {currentIndex + 1} / {qStats.total}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Scanning spinner */}
//                         {isScanning && (
//                           <div className="flex flex-col items-center justify-center py-20 gap-5">
//                             <div className="relative">
//                               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
//                                 <ScanLine size={28} className="text-teal-600 animate-pulse" />
//                               </div>
//                               <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
//                                 <Loader2 size={13} className="text-amber-500 animate-spin" />
//                               </div>
//                             </div>
//                             <div className="text-center">
//                               <p className="text-sm font-bold text-slate-700">Scanning resume…</p>
//                               <p className="text-xs text-slate-400 mt-1">
//                                 Extracting text (EasyOCR if needed) · Parsing with Groq AI
//                               </p>
//                             </div>
//                           </div>
//                         )}

//                         {/* Review form */}
//                         {!isScanning && scanStep === 'review' && (
//                           <div className="p-5 flex-1 overflow-y-auto">
//                             {emailExists === true && (
//                               <div className="mb-4 flex items-start gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
//                                 <RefreshCw size={15} className="text-violet-600 mt-0.5 shrink-0" />
//                                 <div>
//                                   <p className="text-sm font-bold text-violet-800">Duplicate detected</p>
//                                   <p className="text-xs text-violet-600 mt-0.5">
//                                     A resume with this email already exists. Saving will update that record.
//                                   </p>
//                                 </div>
//                               </div>
//                             )}

//                             <div className="space-y-3">
//                               {RESUME_FIELDS.map(({ key, label, icon: Icon, placeholder, type }) => (
//                                 <div key={key}>
//                                   <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-1.5">
//                                     <Icon size={12} className="text-teal-500" /> {label}
//                                   </label>
//                                   {type === 'textarea' ? (
//                                     <textarea
//                                       value={form[key]}
//                                       onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
//                                       placeholder={placeholder}
//                                       rows={2}
//                                       className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 outline-none resize-none bg-slate-50 focus:bg-white transition-colors"
//                                     />
//                                   ) : (
//                                     <input
//                                       type={type}
//                                       value={form[key]}
//                                       onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
//                                       placeholder={placeholder}
//                                       className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 outline-none bg-slate-50 focus:bg-white transition-colors"
//                                     />
//                                   )}
//                                 </div>
//                               ))}
//                             </div>

//                             {/* Raw text toggle */}
//                             {rawText && (
//                               <div className="mt-4">
//                                 <button
//                                   onClick={() => setShowRaw(p => !p)}
//                                   className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
//                                 >
//                                   {showRaw ? <EyeOff size={13} /> : <Eye size={13} />}
//                                   {showRaw ? 'Hide' : 'Show'} raw extracted text
//                                 </button>
//                                 {showRaw && (
//                                   <pre className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 overflow-auto max-h-48 whitespace-pre-wrap font-mono">
//                                     {rawText}
//                                   </pre>
//                                 )}
//                               </div>
//                             )}

//                             {/* Save / Skip */}
//                             <div className="flex gap-3 mt-5">
//                               <button
//                                 onClick={handleSave}
//                                 disabled={isSaving}
//                                 className={`flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-xl font-bold text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed
//                                   ${emailExists === true
//                                     ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700'
//                                     : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700'}`}
//                               >
//                                 {isSaving ? (
//                                   <><Loader2 size={16} className="animate-spin" /> {emailExists === true ? 'Updating…' : 'Saving…'}</>
//                                 ) : emailExists === true ? (
//                                   <>
//                                     <RefreshCw size={15} /> Update & Next
//                                     {qStats.pending > 0 && <span className="ml-1 opacity-70 text-xs font-normal">({qStats.pending} left)</span>}
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Save size={16} /> Save & Next
//                                     {qStats.pending > 0 && <span className="ml-1 opacity-70 text-xs font-normal">({qStats.pending} left)</span>}
//                                   </>
//                                 )}
//                               </button>
//                               <button
//                                 onClick={handleSkip}
//                                 className="flex items-center gap-1.5 px-5 py-3 border border-slate-200 text-slate-500 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
//                               >
//                                 <SkipForward size={15} /> Skip
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}
//           </>
//         )}

//         {/* ══ TAB 2 — RECORDS ══════════════════════════════════════════════ */}
//         {activeTab === 'records' && (
//           <div className="space-y-4">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//               <div className="relative w-full sm:w-72">
//                 <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={e => setSearchQuery(e.target.value)}
//                   placeholder="Search by name, email, role…"
//                   className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-teal-400 outline-none shadow-sm"
//                 />
//               </div>
//               <div className="flex items-center gap-3">
//                 <button onClick={fetchRecords}
//                   className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors bg-white shadow-sm">
//                   <RefreshCw size={14} /> Refresh
//                 </button>
//                 <button onClick={handleExport} disabled={exportingExcel || resumes.length === 0}
//                   className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold text-sm hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
//                   {exportingExcel
//                     ? <><Loader2 size={14} className="animate-spin" /> Exporting…</>
//                     : <><Download size={14} /> Export Excel</>}
//                 </button>
//               </div>
//             </div>

//             {/* Stats row */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//               {[
//                 { label: 'Total Resumes', value: resumes.length,                                                                     icon: FileText,  color: 'teal'  },
//                 { label: 'Processed',     value: resumes.filter(r => r.status === 'processed').length,                               icon: FileCheck, color: 'cyan'  },
//                 { label: 'This Month',    value: resumes.filter(r => {
//                     const d = new Date(r.created_at), n = new Date();
//                     return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
//                   }).length,                                                                                                          icon: Clock,     color: 'slate' },
//               ].map(({ label, value, icon: Icon, color }) => (
//                 <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex items-center gap-3">
//                   <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
//                     ${color === 'teal' ? 'bg-teal-50' : color === 'cyan' ? 'bg-cyan-50' : 'bg-slate-100'}`}>
//                     <Icon size={16} className={color === 'teal' ? 'text-teal-600' : color === 'cyan' ? 'text-cyan-600' : 'text-slate-500'} />
//                   </div>
//                   <div>
//                     <p className="text-xl font-bold text-slate-800 leading-none">{value}</p>
//                     <p className="text-xs text-slate-500 mt-0.5">{label}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {recordsError && (
//               <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700">
//                 <XCircle size={18} className="mt-0.5 shrink-0" />
//                 <p className="text-sm font-medium">{recordsError}</p>
//               </div>
//             )}

//             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//               {loadingRecords ? (
//                 <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
//                   <Loader2 size={28} className="animate-spin text-teal-500" />
//                   <p className="text-sm font-medium">Loading records…</p>
//                 </div>
//               ) : filtered.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
//                   <FileText size={36} className="opacity-30" />
//                   <p className="text-sm font-medium">
//                     {searchQuery ? 'No results match your search.' : 'No resumes yet. Scan a folder to get started!'}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-left min-w-[700px]">
//                     <thead>
//                       <tr className="bg-slate-50 border-b border-slate-200">
//                         {[
//                           { label: 'Name',        key: 'name'        },
//                           { label: 'Email',       key: 'email'       },
//                           { label: 'Phone',       key: 'phone'       },
//                           { label: 'Designation', key: 'designation' },
//                           { label: 'Address',     key: 'address'     },
//                           { label: 'Actions',     key: null          },
//                         ].map(({ label, key }) => (
//                           <th
//                             key={label}
//                             onClick={() => key && toggleSort(key as keyof ResumeRecord)}
//                             className={`px-3 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider ${key ? 'cursor-pointer hover:text-teal-600 select-none' : ''}`}
//                           >
//                             <span className="flex items-center">
//                               {label}{key && <SortIcon col={key as keyof ResumeRecord} />}
//                             </span>
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filtered.map(resume => (
//                         <EditableRow
//                           key={resume.id}
//                           resume={resume}
//                           onSave={handleUpdateRecord}
//                           onDelete={id => setDeleteConfirm(id)}
//                         />
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//               {filtered.length > 0 && (
//                 <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
//                   Showing {filtered.length} of {resumes.length} records
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Delete Confirm Modal */}
//       {deleteConfirm !== null && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                 <Trash2 size={18} className="text-red-500" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-slate-800">Delete Resume?</h3>
//                 <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
//               </div>
//             </div>
//             <div className="flex gap-3 mt-5">
//               <button
//                 onClick={() => setDeleteConfirm(null)}
//                 className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDeleteRecord(deleteConfirm)}
//                 className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResumeScanningPage;

// import React, {
//   useState, useRef, useEffect, useCallback,
// } from 'react';
// import { useDispatch, useSelector } from 'react-redux'; // Added useSelector
// import axios from 'axios';
// import {
//   FileText, Upload, Loader2, CheckCircle, XCircle,
//   RefreshCw, User, Mail, Phone, Briefcase, MapPin,
//   Eye, EyeOff, Download, Trash2, Edit3, Save, X,
//   FileSearch, Table2, ChevronUp, ChevronDown, Search,
//   AlertCircle, FileCheck, Clock, FolderOpen, Play,
//   SkipForward, RotateCcw, ListOrdered, CheckSquare,
//   AlertTriangle, Minus, ScanLine, Zap,
// } from 'lucide-react';

// // Import your RootState type
// import type { RootState } from '../../app/store';

// const API_BASE_URL = '/api'; // Use Proxy

// // ─────────────────────────────────────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────────────────────────────────────

// type QueueStatus = 'pending' | 'processing' | 'completed' | 'failed';

// interface ResumeQueueItem {
//   id: string;
//   file: File;
//   status: QueueStatus;
//   parsedData?: ResumeForm;
//   rawText?: string;
//   error?: string;
//   savedId?: number;
//   action?: 'created' | 'updated';
// }

// interface ResumeForm {
//   name: string;
//   email: string;
//   phone: string;
//   designation: string;
//   address: string;
// }

// interface ResumeRecord {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   designation: string;
//   address: string;
//   raw_text: string;
//   status: string;
//   file_url: string | null;
//   created_at: string;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Constants
// // ─────────────────────────────────────────────────────────────────────────────

// const RESUME_FIELDS: {
//   key: keyof ResumeForm;
//   label: string;
//   icon: React.FC<any>;
//   placeholder: string;
//   type: string;
// }[] = [
//   { key: 'name',        label: 'Full Name',   icon: User,      placeholder: 'John Doe',              type: 'text'     },
//   { key: 'email',       label: 'Email',        icon: Mail,      placeholder: 'john@company.com',      type: 'email'    },
//   { key: 'phone',       label: 'Phone',        icon: Phone,     placeholder: '+91 98765 43210',       type: 'text'     },
//   { key: 'designation', label: 'Designation',  icon: Briefcase, placeholder: 'Software Engineer',    type: 'text'     },
//   { key: 'address',     label: 'Address',      icon: MapPin,    placeholder: 'City, State, Country',  type: 'textarea' },
// ];

// const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];
// const isValidResume = (file: File) =>
//   ACCEPTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));

// const uid = () => Math.random().toString(36).slice(2, 10);

// // ─────────────────────────────────────────────────────────────────────────────
// // Status Badge
// // ─────────────────────────────────────────────────────────────────────────────

// const StatusBadge: React.FC<{ status: QueueStatus; action?: 'created' | 'updated' }> = ({ status, action }) => {
//   if (status === 'completed' && action === 'updated') {
//     return (
//       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
//         <RefreshCw size={10} /> Updated
//       </span>
//     );
//   }
//   if (status === 'completed' && action === 'created') {
//     return (
//       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
//         <CheckCircle size={11} /> Saved
//       </span>
//     );
//   }
//   const map: Record<QueueStatus, { label: string; cls: string; icon: React.ReactNode }> = {
//     pending:    { label: 'Pending',    cls: 'bg-slate-100 text-slate-50', icon: <Minus size={11} /> },
//     processing: { label: 'Scanning…', cls: 'bg-amber-100 text-amber-700', icon: <Loader2 size={11} className="animate-spin" /> },
//     completed:  { label: 'Completed', cls: 'bg-teal-100 text-teal-700',   icon: <CheckCircle size={11} /> },
//     failed:     { label: 'Failed',    cls: 'bg-red-100 text-red-600',     icon: <AlertTriangle size={11} /> },
//   };
//   const { label, cls, icon } = map[status];
//   return (
//     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
//       {icon} {label}
//     </span>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Queue Panel
// // ─────────────────────────────────────────────────────────────────────────────

// const QueuePanel: React.FC<{
//   queue: ResumeQueueItem[];
//   currentIndex: number;
//   onRemove: (id: string) => void;
//   onRetry: (id: string) => void;
// }> = ({ queue, currentIndex, onRemove, onRetry }) => {
//   const completed = queue.filter(q => q.status === 'completed').length;
//   const failed    = queue.filter(q => q.status === 'failed').length;
//   const total     = queue.length;
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const itemRefs  = useRef<Record<string, HTMLDivElement | null>>({});

//   useEffect(() => {
//     if (currentIndex < 0 || currentIndex >= queue.length) return;
//     const currentId = queue[currentIndex].id;
//     const el = itemRefs.current[currentId];
//     if (el && scrollRef.current) {
//       el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
//     }
//   }, [currentIndex, queue]);

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
//       <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
//         <div className="flex items-center gap-2">
//           <ListOrdered size={15} className="text-teal-600" />
//           <span className="text-sm font-bold text-slate-700">Queue</span>
//         </div>
//         <div className="flex items-center gap-2 text-xs font-semibold">
//           <span className="text-teal-600">{completed}/{total}</span>
//           {failed > 0 && <span className="text-red-500">{failed} failed</span>}
//         </div>
//       </div>

//       {(queue.some(q => q.action === 'created') || queue.some(q => q.action === 'updated')) && (
//         <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-3 text-xs font-semibold shrink-0">
//           {queue.filter(q => q.action === 'created').length > 0 && (
//             <span className="text-teal-600 flex items-center gap-1">
//               <CheckCircle size={11} /> {queue.filter(q => q.action === 'created').length} new
//             </span>
//           )}
//           {queue.filter(q => q.action === 'updated').length > 0 && (
//             <span className="text-violet-600 flex items-center gap-1">
//               <RefreshCw size={10} /> {queue.filter(q => q.action === 'updated').length} updated
//             </span>
//           )}
//         </div>
//       )}

//       <div className="px-4 py-2 border-b border-slate-100 shrink-0">
//         <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
//           <div
//             className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
//             style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
//           />
//         </div>
//         <p className="text-xs text-slate-400 mt-1">{total - completed} remaining</p>
//       </div>

//       <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-50">
//         {queue.map((item, idx) => {
//           const isCurrent = idx === currentIndex;
//           const ext       = item.file.name.split('.').pop()?.toLowerCase();
//           return (
//             <div
//               key={item.id}
//               ref={el => { itemRefs.current[item.id] = el; }}
//               className={`px-4 py-3 flex items-start gap-3 transition-colors
//                 ${isCurrent ? 'bg-teal-50/60 border-l-2 border-teal-500' : 'border-l-2 border-transparent'}`}
//             >
//               <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5
//                 ${ext === 'pdf' ? 'bg-red-100' : 'bg-blue-100'}`}>
//                 <FileText size={14} className={ext === 'pdf' ? 'text-red-500' : 'text-blue-500'} />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-teal-700' : 'text-slate-700'}`}>
//                   {item.file.name}
//                 </p>
//                 <p className="text-xs text-slate-400">{(item.file.size / 1024).toFixed(0)} KB</p>
//                 <div className="mt-1"><StatusBadge status={item.status} action={item.action} /></div>
//                 {item.error && (
//                   <p className="text-xs text-red-500 mt-1 truncate" title={item.error}>{item.error}</p>
//                 )}
//               </div>
//               <div className="flex flex-col gap-1 shrink-0">
//                 {item.status === 'failed' && (
//                   <button onClick={() => onRetry(item.id)} title="Retry"
//                     className="p-1 rounded hover:bg-amber-50 text-amber-500 transition-colors">
//                     <RotateCcw size={13} />
//                   </button>
//                 )}
//                 {item.status === 'pending' && (
//                   <button onClick={() => onRemove(item.id)} title="Remove"
//                     className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
//                     <X size={13} />
//                   </button>
//                 )}
//                 {item.status === 'completed' && (
//                   <CheckSquare size={14} className={item.action === 'updated' ? 'text-violet-500 mt-1' : 'text-teal-500 mt-1'} />
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// const MultiFileDropZone: React.FC<{
//   onFiles: (files: File[]) => void;
//   disabled?: boolean;
// }> = ({ onFiles, disabled }) => {
//   const fileInputRef   = useRef<HTMLInputElement>(null);
//   const folderInputRef = useRef<HTMLInputElement>(null);
//   const [dragging, setDragging] = useState(false);

//   const processFileList = useCallback((fileList: FileList | File[]) => {
//     const files = Array.from(fileList).filter(isValidResume);
//     if (files.length) onFiles(files);
//   }, [onFiles]);

//   const traverseEntry = (entry: any, collected: File[]): Promise<void> =>
//     new Promise<void>((resolve) => {
//       if (entry.isFile) {
//         entry.getFile((f: File) => {
//           if (isValidResume(f)) collected.push(f);
//           resolve();
//         });
//       } else if (entry.isDirectory) {
//         const reader = entry.createReader();
//         const readBatch = () => {
//           reader.readEntries(async (entries: any[]) => {
//             if (!entries.length) { resolve(); return; }
//             await Promise.all(entries.map((e: any) => traverseEntry(e, collected)));
//             readBatch();
//           });
//         };
//         readBatch();
//       } else {
//         resolve();
//       }
//     });

//   const handleDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setDragging(false);
//     if (disabled) return;

//     const items = e.dataTransfer.items;
//     if (items?.length) {
//       const files: File[] = [];
//       const promises: Promise<void>[] = [];
//       for (let i = 0; i < items.length; i++) {
//         const item = items[i];
//         if (item.webkitGetAsEntry) {
//           const entry = item.webkitGetAsEntry();
//           if (entry) { promises.push(traverseEntry(entry, files)); continue; }
//         }
//         const f = item.getAsFile();
//         if (f && isValidResume(f)) files.push(f);
//       }
//       Promise.all(promises).then(() => { if (files.length) onFiles(files); });
//     } else {
//       processFileList(e.dataTransfer.files);
//     }
//   }, [disabled, onFiles, processFileList]);

//   return (
//     <div
//       onDragOver={e => { e.preventDefault(); if (!disabled) setDragging(true); }}
//       onDragLeave={() => setDragging(false)}
//       onDrop={handleDrop}
//       className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
//         ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-default'}
//         ${dragging ? 'border-teal-400 bg-teal-50 scale-[1.01]' : 'border-slate-300 hover:border-teal-300 hover:bg-teal-50/10'}`}
//     >
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept=".pdf,.docx"
//         multiple
//         className="hidden"
//         disabled={disabled}
//         onChange={e => { if (e.target.files) processFileList(e.target.files); e.target.value = ''; }}
//       />
//       <input
//         ref={folderInputRef}
//         type="file"
//         {...({ webkitdirectory: "true" } as any)}
//         multiple
//         className="hidden"
//         disabled={disabled}
//         onChange={e => { if (e.target.files) processFileList(e.target.files); e.target.value = ''; }}
//       />

//       <div className="flex flex-col items-center gap-4">
//         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors
//           ${dragging ? 'bg-teal-100' : 'bg-slate-100'}`}>
//           {dragging
//             ? <FolderOpen size={28} className="text-teal-500" />
//             : <Upload    size={28} className="text-slate-400" />}
//         </div>
//         <div>
//           <p className="font-bold text-slate-700 mb-1">
//             {dragging ? 'Drop files or folder here!' : 'Drop a folder or individual resumes here'}
//           </p>
//           <p className="text-xs text-slate-400">
//             PDF and DOCX · Scanned PDFs supported via EasyOCR · Folder picks up all files inside
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
//           <button
//             type="button"
//             disabled={disabled}
//             onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
//             className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50"
//           >
//             <Upload size={14} /> Select Files
//           </button>
//           <button
//             type="button"
//             disabled={disabled}
//             onClick={e => { e.stopPropagation(); folderInputRef.current?.click(); }}
//             className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
//           >
//             <FolderOpen size={14} /> Select Folder
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const EditableRow: React.FC<{
//   resume: ResumeRecord;
//   onSave: (id: number, data: Partial<ResumeRecord>) => Promise<void>;
//   onDelete: (id: number) => void;
// }> = ({ resume, onSave, onDelete }) => {
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving]   = useState(false);
//   const [draft, setDraft]     = useState({
//     name: resume.name, email: resume.email,
//     phone: resume.phone, designation: resume.designation, address: resume.address,
//   });

//   const handleSave = async () => {
//     setSaving(true);
//     await onSave(resume.id, draft);
//     setSaving(false);
//     setEditing(false);
//   };

//   const cell = 'px-3 py-3 text-sm text-slate-700 whitespace-nowrap';
//   const inp  = 'w-full px-2 py-1 text-xs border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none bg-white';

//   return (
//     <tr className={`border-b border-slate-100 transition-colors ${editing ? 'bg-teal-50/40' : 'hover:bg-slate-50'}`}>
//       {editing ? (
//         <>
//           <td className="px-3 py-2"><input className={inp} value={draft.name}        onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}        placeholder="Name" /></td>
//           <td className="px-3 py-2"><input className={inp} value={draft.email}       onChange={e => setDraft(p => ({ ...p, email: e.target.value }))}       placeholder="Email" /></td>
//           <td className="px-3 py-2"><input className={inp} value={draft.phone}       onChange={e => setDraft(p => ({ ...p, phone: e.target.value }))}       placeholder="Phone" /></td>
//           <td className="px-3 py-2"><input className={inp} value={draft.designation} onChange={e => setDraft(p => ({ ...p, designation: e.target.value }))} placeholder="Designation" /></td>
//           <td className="px-3 py-2"><input className={inp} value={draft.address}     onChange={e => setDraft(p => ({ ...p, address: e.target.value }))}     placeholder="Address" /></td>
//           <td className="px-3 py-2 whitespace-nowrap">
//             <div className="flex items-center gap-1.5">
//               <button onClick={handleSave} disabled={saving}
//                 className="flex items-center gap-1 px-2.5 py-1 bg-teal-600 text-white text-xs rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50">
//                 {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />} Save
//               </button>
//               <button onClick={() => setEditing(false)}
//                 className="px-2 py-1 border border-slate-200 text-slate-500 text-xs rounded-lg hover:bg-slate-100">
//                 Cancel
//               </button>
//             </div>
//           </td>
//         </>
//       ) : (
//         <>
//           <td className={cell}>{resume.name        || <span className="text-slate-300 italic">—</span>}</td>
//           <td className={cell}>{resume.email       || <span className="text-slate-300 italic">—</span>}</td>
//           <td className={cell}>{resume.phone       || <span className="text-slate-300 italic">—</span>}</td>
//           <td className={cell}>{resume.designation || <span className="text-slate-300 italic">—</span>}</td>
//           <td className={`${cell} max-w-[180px] truncate`}>{resume.address || <span className="text-slate-300 italic">—</span>}</td>
//           <td className="px-3 py-3 whitespace-nowrap">
//             <div className="flex items-center gap-1.5">
//               <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-teal-600 transition-colors" title="Edit">
//                 <Edit3 size={14} />
//               </button>
//               <button onClick={() => onDelete(resume.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
//                 <Trash2 size={14} />
//               </button>
//             </div>
//           </td>
//         </>
//       )}
//     </tr>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Main Page
// // ─────────────────────────────────────────────────────────────────────────────

// const ResumeScanningPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'scan' | 'records'>('scan');

//   // ── FIX: Auth Token from Redux Store ──
//   const token = useSelector((state: RootState) => state.userLoginAuth?.user?.tokens?.access);

//   // Queue state
//   const [queue, setQueue]               = useState<ResumeQueueItem[]>([]);
//   const [currentIndex, setCurrentIndex] = useState<number>(-1);
//   const [queueStarted, setQueueStarted] = useState(false);

//   // Per-file review state
//   const [scanStep, setScanStep]       = useState<'upload' | 'review'>('upload');
//   const [isScanning, setIsScanning]   = useState(false);
//   const [isSaving, setIsSaving]       = useState(false);
//   const [rawText, setRawText]         = useState('');
//   const [showRaw, setShowRaw]         = useState(false);
//   const [scanError, setScanError]     = useState<string | null>(null);
//   const [allDone, setAllDone]         = useState(false);
//   const [emailExists, setEmailExists] = useState<boolean | null>(null);
//   const [form, setForm]               = useState<ResumeForm>({
//     name: '', email: '', phone: '', designation: '', address: '',
//   });

//   // Records tab state
//   const [resumes, setResumes]               = useState<ResumeRecord[]>([]);
//   const [loadingRecords, setLoadingRecords] = useState(false);
//   const [recordsError, setRecordsError]     = useState<string | null>(null);
//   const [exportingExcel, setExportingExcel] = useState(false);
//   const [searchQuery, setSearchQuery]       = useState('');
//   const [sortKey, setSortKey]               = useState<keyof ResumeRecord>('created_at');
//   const [sortAsc, setSortAsc]               = useState(false);
//   const [deleteConfirm, setDeleteConfirm]   = useState<number | null>(null);

//   // ── Auth Header Helper ──
//   const getHeaders = useCallback(() => ({
//     headers: {
//       Authorization: `Bearer ${token}`,
//     }
//   }), [token]);

//   const updateQueueItem = useCallback(
//     (id: string, patch: Partial<ResumeQueueItem>) =>
//       setQueue(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item)),
//     [],
//   );

//   const handleAddFiles = useCallback((files: File[]) => {
//     const newItems: ResumeQueueItem[] = files.map(file => ({
//       id: uid(), file, status: 'pending',
//     }));
//     setQueue(prev => {
//       const existing = new Set(prev.map(p => `${p.file.name}_${p.file.size}`));
//       return [...prev, ...newItems.filter(n => !existing.has(`${n.file.name}_${n.file.size}`))];
//     });
//     setAllDone(false);
//   }, []);

//   const scanFile = useCallback(async (item: ResumeQueueItem) => {
//     if (!token) return;
//     setScanError(null);
//     setShowRaw(false);
//     setIsScanning(true);
//     updateQueueItem(item.id, { status: 'processing' });

//     const fd = new FormData();
//     fd.append('file', item.file);

//     try {
//       const res = await axios.post(`${API_BASE_URL}/resumes/scan/`, fd, {
//         ...getHeaders(),
//         headers: { ...getHeaders().headers, 'Content-Type': 'multipart/form-data' },
//       });
//       const { parsed, raw_text } = res.data;
//       const parsedData: ResumeForm = {
//         name:        parsed.name        || '',
//         email:       parsed.email       || '',
//         phone:       parsed.phone       || '',
//         designation: parsed.designation || '',
//         address:     parsed.address     || '',
//       };
//       updateQueueItem(item.id, { parsedData, rawText: raw_text || '' });
//       setRawText(raw_text || '');
//       setForm(parsedData);
//       setEmailExists(null);
//       setScanStep('review');
//     } catch (err: any) {
//       const msg = err.response?.data?.error || 'Scan failed.';
//       updateQueueItem(item.id, { status: 'failed', error: msg });
//       setScanError(msg);
//       setScanStep('upload');
//     } finally {
//       setIsScanning(false);
//     }
//   }, [token, getHeaders, updateQueueItem]);

//   const startQueue = useCallback(() => {
//     const firstPending = queue.findIndex(q => q.status === 'pending');
//     if (firstPending === -1) return;
//     setQueueStarted(true);
//     setAllDone(false);
//     setCurrentIndex(firstPending);
//   }, [queue]);

//   useEffect(() => {
//     if (!queueStarted || currentIndex < 0 || currentIndex >= queue.length) return;
//     const item = queue[currentIndex];
//     if (item.status === 'pending') scanFile(item);
//   }, [currentIndex, queueStarted, scanFile, queue]);

//   useEffect(() => {
//     if (scanStep !== 'review' || !form.email.trim()) {
//       setEmailExists(null);
//       return;
//     }
//     const needle = form.email.toLowerCase().trim();
//     const match  = resumes.some(r => (r.email || '').toLowerCase().trim() === needle);
//     setEmailExists(match);
//   }, [scanStep, form.email, resumes]);

//   const advanceQueue = useCallback((currentQueue: ResumeQueueItem[]) => {
//     const nextIdx = currentQueue.findIndex(
//       (q, i) => i > currentIndex && q.status === 'pending',
//     );
//     if (nextIdx !== -1) {
//       setCurrentIndex(nextIdx);
//     } else {
//       setCurrentIndex(-1);
//       setQueueStarted(false);
//       setAllDone(true);
//       setScanStep('upload');
//     }
//   }, [currentIndex]);

//   const handleSave = useCallback(async () => {
//     if (currentIndex < 0 || !token) return;
//     const item = queue[currentIndex];
//     setIsSaving(true);
//     setScanError(null);

//     const fd = new FormData();
//     Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//     fd.append('raw_text', rawText);
//     fd.append('file', item.file);

//     try {
//       const res = await axios.post(`${API_BASE_URL}/resumes/save/`, fd, {
//         ...getHeaders(),
//         headers: { ...getHeaders().headers, 'Content-Type': 'multipart/form-data' },
//       });
//       const nextQueue = queue.map(q =>
//         q.id === item.id
//           ? { ...q, status: 'completed' as QueueStatus, savedId: res.data.id, action: res.data.action }
//           : q,
//       );
//       setQueue(nextQueue);
//       advanceQueue(nextQueue);
//     } catch (err: any) {
//       setScanError(err.response?.data?.error || 'Save failed.');
//     } finally {
//       setIsSaving(false);
//     }
//   }, [token, getHeaders, currentIndex, queue, form, rawText, advanceQueue]);

//   const handleSkip = useCallback(() => {
//     if (currentIndex < 0) return;
//     const item = queue[currentIndex];
//     const nextQueue = queue.map(q =>
//       q.id === item.id ? { ...q, status: 'failed' as QueueStatus, error: 'Skipped by user' } : q,
//     );
//     setQueue(nextQueue);
//     advanceQueue(nextQueue);
//   }, [currentIndex, queue, advanceQueue]);

//   const handleRetry = useCallback((id: string) => {
//     const idx = queue.findIndex(q => q.id === id);
//     if (idx === -1) return;
//     setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'pending', error: undefined } : q));
//     setCurrentIndex(idx);
//     setQueueStarted(true);
//     setAllDone(false);
//     setScanStep('upload');
//   }, [queue]);

//   const handleRemoveFromQueue = useCallback((id: string) => {
//     setQueue(prev => prev.filter(q => q.id !== id));
//   }, []);

//   const handleReset = useCallback(() => {
//     setQueue([]);
//     setCurrentIndex(-1);
//     setQueueStarted(false);
//     setAllDone(false);
//     setScanStep('upload');
//     setEmailExists(null);
//     setForm({ name: '', email: '', phone: '', designation: '', address: '' });
//     setRawText('');
//     setShowRaw(false);
//     setScanError(null);
//   }, []);

//   const fetchRecords = async () => {
//     if (!token) return;
//     setLoadingRecords(true);
//     try {
//       const res = await axios.get(`${API_BASE_URL}/resumes/`, getHeaders());
//       setResumes(res.data.results ?? res.data);
//     } catch {
//       setRecordsError('Failed to load records.');
//     } finally {
//       setLoadingRecords(false);
//     }
//   };

//   useEffect(() => { if (token) fetchRecords(); }, [token]); // eslint-disable-line
//   useEffect(() => { if (activeTab === 'records' && token) fetchRecords(); }, [activeTab, token]);

//   const handleUpdateRecord = async (id: number, data: Partial<ResumeRecord>) => {
//     await axios.patch(`${API_BASE_URL}/resumes/${id}/`, data, getHeaders());
//     setResumes(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
//   };

//   const handleDeleteRecord = async (id: number) => {
//     await axios.delete(`${API_BASE_URL}/resumes/${id}/`, getHeaders());
//     setResumes(prev => prev.filter(r => r.id !== id));
//     setDeleteConfirm(null);
//   };

//   const handleExport = async () => {
//     setExportingExcel(true);
//     try {
//       const res = await axios.get(`${API_BASE_URL}/resumes/export/`, {
//         ...getHeaders(), responseType: 'blob',
//       });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const a = document.createElement('a');
//       a.href = url; a.download = 'resumes.xlsx'; a.click();
//       window.URL.revokeObjectURL(url);
//     } catch {
//       setRecordsError('Export failed.');
//     } finally {
//       setExportingExcel(false);
//     }
//   };

//   const toggleSort = (key: keyof ResumeRecord) => {
//     if (sortKey === key) setSortAsc(p => !p);
//     else { setSortKey(key); setSortAsc(true); }
//   };

//   const filtered = resumes
//     .filter(r => {
//       const q = searchQuery.toLowerCase();
//       return !q || [r.name, r.email, r.phone, r.designation, r.address]
//         .some(v => (v || '').toLowerCase().includes(q));
//     })
//     .sort((a, b) => {
//       const va = String(a[sortKey] || ''), vb = String(b[sortKey] || '');
//       return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
//     });

//   const SortIcon = ({ col }: { col: keyof ResumeRecord }) => (
//     <span className="ml-1 inline-flex flex-col opacity-40">
//       <ChevronUp   size={10} className={sortKey === col && sortAsc  ? 'opacity-100 text-teal-600' : ''} />
//       <ChevronDown size={10} className={sortKey === col && !sortAsc ? 'opacity-100 text-teal-600' : ''} style={{ marginTop: -3 }} />
//     </span>
//   );

//   const qStats = {
//     total:     queue.length,
//     completed: queue.filter(q => q.status === 'completed').length,
//     failed:    queue.filter(q => q.status === 'failed').length,
//     pending:   queue.filter(q => q.status === 'pending').length,
//     created:   queue.filter(q => q.action === 'created').length,
//     updated:   queue.filter(q => q.action === 'updated').length,
//   };

//   const currentItem = currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex] : null;
//   const hasQueue    = queue.length > 0;

//   return (
//     <div className="min-h-screen bg-[#f8fafb] font-sans pb-20">

//       <div className="bg-white border-b border-slate-200 px-6 py-5 shadow-sm">
//         <div className="flex items-center gap-3 mb-5">
//           <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
//             <FileSearch className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resume Scanner</h1>
//             <p className="text-sm text-slate-500 flex items-center gap-1.5">
//               <FolderOpen size={13} className="text-teal-500" />
//               Select a folder · AI extracts contact info (EasyOCR + Groq) · Export to Excel
//             </p>
//           </div>
//         </div>

//         <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
//           {([
//             { id: 'scan',    label: 'Scan Resumes', Icon: ScanLine },
//             { id: 'records', label: 'All Records',  Icon: Table2   },
//           ] as const).map(({ id, label, Icon }) => (
//             <button key={id} onClick={() => setActiveTab(id)}
//               className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200
//                 ${activeTab === id ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
//               <Icon size={15} /> {label}
//               {id === 'records' && resumes.length > 0 && (
//                 <span className="bg-teal-100 text-teal-700 text-xs font-bold px-1.5 py-0.5 rounded-full">{resumes.length}</span>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="px-4 py-6 max-w-7xl mx-auto">
//         {activeTab === 'scan' && (
//           <>
//             {allDone ? (
//               <div className="w-full text-center py-16">
//                 <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
//                   <CheckCircle className="w-10 h-10 text-teal-600" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Queue Complete!</h2>
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
//                   <button onClick={handleReset}
//                     className="flex items-center gap-2 px-6 py-3 border-2 border-teal-200 text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-colors">
//                     <FolderOpen size={16} /> Scan Another Folder
//                   </button>
//                   <button onClick={() => { setActiveTab('records'); fetchRecords(); }}
//                     className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md">
//                     <Table2 size={16} /> View All Records
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {scanError && (
//                   <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700">
//                     <XCircle size={18} className="mt-0.5 shrink-0" />
//                     <p className="text-sm font-medium">{scanError}</p>
//                   </div>
//                 )}

//                 <div className={hasQueue ? 'grid grid-cols-1 lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_2.5fr] gap-5 items-stretch' : ''}>
//                   {hasQueue && (
//                     <div className="flex flex-col gap-3">
//                       <div className="flex-1 min-h-0">
//                         <QueuePanel queue={queue} currentIndex={currentIndex} onRemove={handleRemoveFromQueue} onRetry={handleRetry} />
//                       </div>
//                       <div className="flex flex-col gap-2 shrink-0">
//                         {!queueStarted && qStats.pending > 0 && (
//                           <button onClick={startQueue}
//                             className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold text-sm shadow-md hover:from-teal-700 hover:to-cyan-700 transition-all">
//                             <Play size={15} /> Start Processing ({qStats.pending} files)
//                           </button>
//                         )}
//                         <label className="flex items-center justify-center gap-2 w-full py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white">
//                           <Upload size={13} /> Add More Files
//                           <input type="file" accept=".pdf,.docx" multiple className="hidden" onChange={e => { if (e.target.files) handleAddFiles(Array.from(e.target.files).filter(isValidResume)); e.currentTarget.value = ''; }} />
//                         </label>
//                         <button onClick={handleReset} className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-slate-400 hover:text-red-500 transition-colors"><RefreshCw size={11} /> Clear Queue</button>
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex flex-col">
//                     {!hasQueue && (
//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
//                           <h2 className="text-base font-bold text-slate-800 mb-1">Upload Resumes</h2>
//                           <p className="text-xs text-slate-400 mb-4">Select an entire folder — every PDF/DOCX inside will be queued automatically.</p>
//                           <MultiFileDropZone onFiles={handleAddFiles} />
//                         </div>
//                         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
//                            <div>
//                             <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Zap size={14} className="text-teal-500" /> How it works</h3>
//                             {[ { step: '1', label: 'Select folder', desc: 'All PDFs & DOCX files inside are queued' }, { step: '2', label: 'Text extraction', desc: 'pdfplumber → PyMuPDF → EasyOCR (scanned)' }, { step: '3', label: 'Groq AI parsing', desc: 'LLM extracts name, email, phone, role' }, { step: '4', label: 'Review & save', desc: 'Confirm each resume before saving' }, { step: '5', label: 'Export Excel', desc: 'Download all saved resumes as .xlsx' } ].map(({ step, label, desc }) => (
//                               <div key={step} className="flex items-start gap-3 mb-2 last:mb-0">
//                                 <div className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{step}</div>
//                                 <div><p className="text-sm font-semibold text-slate-700">{label}</p><p className="text-xs text-slate-400">{desc}</p></div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {hasQueue && !queueStarted && !isScanning && scanStep === 'upload' && (
//                       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1">
//                         <h2 className="text-base font-bold text-slate-800 mb-1">{qStats.total} files ready to process</h2>
//                         <MultiFileDropZone onFiles={handleAddFiles} />
//                       </div>
//                     )}

//                     {queueStarted && currentItem && (
//                       <div className={`bg-white rounded-2xl shadow-sm border-2 transition-colors duration-300 overflow-hidden flex flex-col flex-1 ${emailExists === true ? 'border-violet-300' : 'border-slate-200'}`}>
//                         <div className={`flex items-center justify-between px-5 py-3.5 border-b shrink-0 ${emailExists === true ? 'border-violet-100 bg-violet-50/40' : 'border-slate-100 bg-slate-50/60'}`}>
//                           <div className="flex items-center gap-2.5 min-w-0">
//                             <FileText size={15} className={currentItem.file.name.endsWith('.pdf') ? 'text-red-500' : 'text-blue-500'} />
//                             <p className="text-sm font-semibold text-slate-700 truncate max-w-[280px]">{currentItem.file.name}</p>
//                           </div>
//                         </div>

//                         {isScanning && (
//                           <div className="flex flex-col items-center justify-center py-20 gap-5">
//                             <ScanLine size={28} className="text-teal-600 animate-pulse" />
//                             <p className="text-sm font-bold text-slate-700">Scanning resume…</p>
//                           </div>
//                         )}

//                         {!isScanning && scanStep === 'review' && (
//                           <div className="p-5 flex-1 overflow-y-auto">
//                             {emailExists === true && (
//                               <div className="mb-4 flex items-start gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
//                                 <RefreshCw size={15} className="text-violet-600 mt-0.5 shrink-0" />
//                                 <div><p className="text-sm font-bold text-violet-800">Duplicate detected</p></div>
//                               </div>
//                             )}
//                             <div className="space-y-3">
//                               {RESUME_FIELDS.map(({ key, label, icon: Icon, placeholder, type }) => (
//                                 <div key={key}>
//                                   <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-1.5"><Icon size={12} className="text-teal-500" /> {label}</label>
//                                   {type === 'textarea' ? (
//                                     <textarea value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 outline-none resize-none bg-slate-50" />
//                                   ) : (
//                                     <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 outline-none bg-slate-50" />
//                                   )}
//                                 </div>
//                               ))}
//                             </div>
//                             <div className="flex gap-3 mt-5">
//                               <button onClick={handleSave} disabled={isSaving} className={`flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-xl font-bold text-sm shadow-md ${emailExists === true ? 'bg-violet-600' : 'bg-teal-600'}`}>
//                                 {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save & Next'}
//                               </button>
//                               <button onClick={handleSkip} className="px-5 py-3 border border-slate-200 text-slate-500 rounded-xl text-sm font-semibold">Skip</button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}
//           </>
//         )}

//         {activeTab === 'records' && (
//           <div className="space-y-4">
//              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//               <div className="relative w-full sm:w-72">
//                 <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search records…" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white shadow-sm" />
//               </div>
//               <div className="flex items-center gap-3">
//                 <button onClick={handleExport} disabled={exportingExcel || resumes.length === 0}
//                   className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm shadow-md">
//                   {exportingExcel ? <Loader2 size={14} className="animate-spin" /> : 'Export Excel'}
//                 </button>
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//               <table className="w-full text-left min-w-[700px]">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-200">
//                     {['Name', 'Email', 'Phone', 'Designation', 'Address', 'Actions'].map(l => (
//                       <th key={l} className="px-3 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">{l}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map(r => <EditableRow key={r.id} resume={r} onSave={handleUpdateRecord} onDelete={id => setDeleteConfirm(id)} />)}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {deleteConfirm !== null && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
//             <h3 className="font-bold text-slate-800">Delete Resume?</h3>
//             <div className="flex gap-3 mt-5">
//               <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border rounded-xl text-sm">Cancel</button>
//               <button onClick={() => handleDeleteRecord(deleteConfirm)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm">Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResumeScanningPage;

// import React, {
//   useState, useRef, useEffect, useCallback,
// } from 'react';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import {
//   FileText, Upload, Loader2, CheckCircle, XCircle,
//   RefreshCw, User, Mail, Phone, Briefcase, MapPin,
//   Eye, EyeOff, Download, Trash2, Edit3, Save, X,
//   FileSearch, Table2, ChevronUp, ChevronDown, Search,
//   AlertCircle, FileCheck, Clock, FolderOpen, Play,
//   SkipForward, RotateCcw, ListOrdered, CheckSquare,
//   AlertTriangle, Minus, ScanLine, Zap,
// } from 'lucide-react';

// // Import your RootState type
// import type { RootState } from '../../app/store';

// const API_BASE_URL = '/api'; // Use Proxy

// // ─────────────────────────────────────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────────────────────────────────────

// type QueueStatus = 'pending' | 'processing' | 'completed' | 'failed';

// interface ResumeQueueItem {
//   id: string;
//   file: File;
//   status: QueueStatus;
//   parsedData?: ResumeForm;
//   rawText?: string;
//   error?: string;
//   savedId?: number;
//   action?: 'created' | 'updated';
// }

// interface ResumeForm {
//   name: string;
//   email: string;
//   phone: string;
//   designation: string;
//   address: string;
// }

// interface ResumeRecord {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   designation: string;
//   address: string;
//   raw_text: string;
//   status: string;
//   file_url: string | null;
//   created_at: string;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Constants
// // ─────────────────────────────────────────────────────────────────────────────

// const RESUME_FIELDS: {
//   key: keyof ResumeForm;
//   label: string;
//   icon: React.FC<any>;
//   placeholder: string;
//   type: string;
// }[] = [
//   { key: 'name',        label: 'Full Name',   icon: User,      placeholder: 'John Doe',              type: 'text'     },
//   { key: 'email',       label: 'Email',        icon: Mail,      placeholder: 'john@company.com',      type: 'email'    },
//   { key: 'phone',       label: 'Phone',        icon: Phone,     placeholder: '+91 98765 43210',       type: 'text'     },
//   { key: 'designation', label: 'Designation',  icon: Briefcase, placeholder: 'Software Engineer',    type: 'text'     },
//   { key: 'address',     label: 'Address',      icon: MapPin,    placeholder: 'City, State, Country',  type: 'textarea' },
// ];

// const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];
// const isValidResume = (file: File) =>
//   ACCEPTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));

// const uid = () => Math.random().toString(36).slice(2, 10);

// // ─────────────────────────────────────────────────────────────────────────────
// // Status Badge
// // ─────────────────────────────────────────────────────────────────────────────

// const StatusBadge: React.FC<{ status: QueueStatus; action?: 'created' | 'updated' }> = ({ status, action }) => {
//   if (status === 'completed' && action === 'updated') {
//     return (
//       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
//         <RefreshCw size={10} /> Updated
//       </span>
//     );
//   }
//   if (status === 'completed' && action === 'created') {
//     return (
//       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
//         <CheckCircle size={11} /> Saved
//       </span>
//     );
//   }
//   const map: Record<QueueStatus, { label: string; cls: string; icon: React.ReactNode }> = {
//     pending:    { label: 'Pending',    cls: 'bg-slate-100 text-slate-500', icon: <Clock size={11} /> },
//     processing: { label: 'Scanning…', cls: 'bg-amber-100 text-amber-700', icon: <Loader2 size={11} className="animate-spin" /> },
//     completed:  { label: 'Completed', cls: 'bg-teal-100 text-teal-700',   icon: <CheckCircle size={11} /> },
//     failed:     { label: 'Failed',    cls: 'bg-red-100 text-red-600',     icon: <AlertTriangle size={11} /> },
//   };
//   const { label, cls, icon } = map[status];
//   return (
//     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
//       {icon} {label}
//     </span>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Queue Panel
// // ─────────────────────────────────────────────────────────────────────────────

// const QueuePanel: React.FC<{
//   queue: ResumeQueueItem[];
//   currentIndex: number;
//   onRemove: (id: string) => void;
//   onRetry: (id: string) => void;
// }> = ({ queue, currentIndex, onRemove, onRetry }) => {
//   const completed = queue.filter(q => q.status === 'completed').length;
//   const failed    = queue.filter(q => q.status === 'failed').length;
//   const total     = queue.length;
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const itemRefs  = useRef<Record<string, HTMLDivElement | null>>({});

//   useEffect(() => {
//     if (currentIndex < 0 || currentIndex >= queue.length) return;
//     const currentId = queue[currentIndex].id;
//     const el = itemRefs.current[currentId];
//     if (el && scrollRef.current) {
//       el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
//     }
//   }, [currentIndex, queue]);

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
//       <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
//         <div className="flex items-center gap-2">
//           <ListOrdered size={15} className="text-teal-600" />
//           <span className="text-sm font-bold text-slate-700">Queue</span>
//         </div>
//         <div className="flex items-center gap-2 text-xs font-semibold">
//           <span className="text-teal-600">{completed}/{total}</span>
//           {failed > 0 && <span className="text-red-500">{failed} failed</span>}
//         </div>
//       </div>

//       {(queue.some(q => q.action === 'created') || queue.some(q => q.action === 'updated')) && (
//         <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-3 text-xs font-semibold shrink-0">
//           {queue.filter(q => q.action === 'created').length > 0 && (
//             <span className="text-teal-600 flex items-center gap-1">
//               <CheckCircle size={11} /> {queue.filter(q => q.action === 'created').length} new
//             </span>
//           )}
//           {queue.filter(q => q.action === 'updated').length > 0 && (
//             <span className="text-violet-600 flex items-center gap-1">
//               <RefreshCw size={10} /> {queue.filter(q => q.action === 'updated').length} updated
//             </span>
//           )}
//         </div>
//       )}

//       <div className="px-4 py-2 border-b border-slate-100 shrink-0">
//         <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
//           <div
//             className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
//             style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
//           />
//         </div>
//         <p className="text-xs text-slate-400 mt-1">{total - completed} remaining</p>
//       </div>

//       <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-50">
//         {queue.map((item, idx) => {
//           const isCurrent = idx === currentIndex;
//           const ext       = item.file.name.split('.').pop()?.toLowerCase();
//           return (
//             <div
//               key={item.id}
//               ref={el => { itemRefs.current[item.id] = el; }}
//               className={`px-4 py-3 flex items-start gap-3 transition-colors
//                 ${isCurrent ? 'bg-teal-50/60 border-l-2 border-teal-500' : 'border-l-2 border-transparent'}`}
//             >
//               <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5
//                 ${ext === 'pdf' ? 'bg-red-100' : 'bg-blue-100'}`}>
//                 <FileText size={14} className={ext === 'pdf' ? 'text-red-500' : 'text-blue-500'} />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-teal-700' : 'text-slate-700'}`}>
//                   {item.file.name}
//                 </p>
//                 <p className="text-xs text-slate-400">{(item.file.size / 1024).toFixed(0)} KB</p>
//                 <div className="mt-1"><StatusBadge status={item.status} action={item.action} /></div>
//                 {item.error && (
//                   <p className="text-xs text-red-500 mt-1 truncate" title={item.error}>{item.error}</p>
//                 )}
//               </div>
//               <div className="flex flex-col gap-1 shrink-0">
//                 {item.status === 'failed' && (
//                   <button onClick={() => onRetry(item.id)} title="Retry"
//                     className="p-1 rounded hover:bg-amber-50 text-amber-500 transition-colors">
//                     <RotateCcw size={13} />
//                   </button>
//                 )}
//                 {item.status === 'pending' && (
//                   <button onClick={() => onRemove(item.id)} title="Remove"
//                     className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
//                     <X size={13} />
//                   </button>
//                 )}
//                 {item.status === 'completed' && (
//                   <CheckSquare size={14} className={item.action === 'updated' ? 'text-violet-500 mt-1' : 'text-teal-500 mt-1'} />
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// const MultiFileDropZone: React.FC<{
//   onFiles: (files: File[]) => void;
//   disabled?: boolean;
// }> = ({ onFiles, disabled }) => {
//   const fileInputRef   = useRef<HTMLInputElement>(null);
//   const folderInputRef = useRef<HTMLInputElement>(null);
//   const [dragging, setDragging] = useState(false);

//   const processFileList = useCallback((fileList: FileList | File[]) => {
//     const files = Array.from(fileList).filter(isValidResume);
//     if (files.length) onFiles(files);
//   }, [onFiles]);

//   const traverseEntry = (entry: any, collected: File[]): Promise<void> =>
//     new Promise<void>((resolve) => {
//       if (entry.isFile) {
//         entry.getFile((f: File) => {
//           if (isValidResume(f)) collected.push(f);
//           resolve();
//         });
//       } else if (entry.isDirectory) {
//         const reader = entry.createReader();
//         const readBatch = () => {
//           reader.readEntries(async (entries: any[]) => {
//             if (!entries.length) { resolve(); return; }
//             await Promise.all(entries.map((e: any) => traverseEntry(e, collected)));
//             readBatch();
//           });
//         };
//         readBatch();
//       } else {
//         resolve();
//       }
//     });

//   const handleDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setDragging(false);
//     if (disabled) return;

//     const items = e.dataTransfer.items;
//     if (items?.length) {
//       const files: File[] = [];
//       const promises: Promise<void>[] = [];
//       for (let i = 0; i < items.length; i++) {
//         const item = items[i];
//         if (item.webkitGetAsEntry) {
//           const entry = item.webkitGetAsEntry();
//           if (entry) { promises.push(traverseEntry(entry, files)); continue; }
//         }
//         const f = item.getAsFile();
//         if (f && isValidResume(f)) files.push(f);
//       }
//       Promise.all(promises).then(() => { if (files.length) onFiles(files); });
//     } else {
//       processFileList(e.dataTransfer.files);
//     }
//   }, [disabled, onFiles, processFileList]);

//   return (
//     <div
//       onDragOver={e => { e.preventDefault(); if (!disabled) setDragging(true); }}
//       onDragLeave={() => setDragging(false)}
//       onDrop={handleDrop}
//       className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
//         ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-default'}
//         ${dragging ? 'border-teal-400 bg-teal-50 scale-[1.01]' : 'border-slate-300 hover:border-teal-300 hover:bg-teal-50/10'}`}
//     >
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept=".pdf,.docx"
//         multiple
//         className="hidden"
//         disabled={disabled}
//         onChange={e => { if (e.target.files) processFileList(e.target.files); e.target.value = ''; }}
//       />
//       <input
//         ref={folderInputRef}
//         type="file"
//         {...({ webkitdirectory: "true" } as any)}
//         multiple
//         className="hidden"
//         disabled={disabled}
//         onChange={e => { if (e.target.files) processFileList(e.target.files); e.target.value = ''; }}
//       />

//       <div className="flex flex-col items-center gap-4">
//         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors
//           ${dragging ? 'bg-teal-100' : 'bg-slate-100'}`}>
//           {dragging
//             ? <FolderOpen size={28} className="text-teal-500" />
//             : <Upload    size={28} className="text-slate-400" />}
//         </div>
//         <div>
//           <p className="font-bold text-slate-700 mb-1">
//             {dragging ? 'Drop files or folder here!' : 'Drop a folder or individual resumes here'}
//           </p>
//           <p className="text-xs text-slate-400">
//             PDF and DOCX · Scanned PDFs supported via EasyOCR · Folder picks up all files inside
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
//           <button
//             type="button"
//             disabled={disabled}
//             onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
//             className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50"
//           >
//             <Upload size={14} /> Select Files
//           </button>
//           <button
//             type="button"
//             disabled={disabled}
//             onClick={e => { e.stopPropagation(); folderInputRef.current?.click(); }}
//             className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
//           >
//             <FolderOpen size={14} /> Select Folder
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const EditableRow: React.FC<{
//   resume: ResumeRecord;
//   onSave: (id: number, data: Partial<ResumeRecord>) => Promise<void>;
//   onDelete: (id: number) => void;
// }> = ({ resume, onSave, onDelete }) => {
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving]   = useState(false);
//   const [draft, setDraft]     = useState({
//     name: resume.name, email: resume.email,
//     phone: resume.phone, designation: resume.designation, address: resume.address,
//   });

//   const handleSave = async () => {
//     setSaving(true);
//     await onSave(resume.id, draft);
//     setSaving(false);
//     setEditing(false);
//   };

//   const cell = 'px-3 py-3 text-sm text-slate-700 whitespace-nowrap';
//   const inp  = 'w-full px-2 py-1 text-xs border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none bg-white';

//   return (
//     <tr className={`border-b border-slate-100 transition-colors ${editing ? 'bg-teal-50/40' : 'hover:bg-slate-50'}`}>
//       {editing ? (
//         <>
//           <td className="px-3 py-2"><input className={inp} value={draft.name}        onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}        placeholder="Name" /></td>
//           <td className="px-3 py-2"><input className={inp} value={draft.email}       onChange={e => setDraft(p => ({ ...p, email: e.target.value }))}       placeholder="Email" /></td>
//           <td className="px-3 py-2"><input className={inp} value={draft.phone}       onChange={e => setDraft(p => ({ ...p, phone: e.target.value }))}       placeholder="Phone" /></td>
//           <td className="px-3 py-2"><input className={inp} value={draft.designation} onChange={e => setDraft(p => ({ ...p, designation: e.target.value }))} placeholder="Designation" /></td>
//           <td className="px-3 py-2"><input className={inp} value={draft.address}     onChange={e => setDraft(p => ({ ...p, address: e.target.value }))}     placeholder="Address" /></td>
//           <td className="px-3 py-2 whitespace-nowrap">
//             <div className="flex items-center gap-1.5">
//               <button onClick={handleSave} disabled={saving}
//                 className="flex items-center gap-1 px-2.5 py-1 bg-teal-600 text-white text-xs rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50">
//                 {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />} Save
//               </button>
//               <button onClick={() => setEditing(false)}
//                 className="px-2 py-1 border border-slate-200 text-slate-500 text-xs rounded-lg hover:bg-slate-100">
//                 Cancel
//               </button>
//             </div>
//           </td>
//         </>
//       ) : (
//         <>
//           <td className={cell}>{resume.name        || <span className="text-slate-300 italic">—</span>}</td>
//           <td className={cell}>{resume.email       || <span className="text-slate-300 italic">—</span>}</td>
//           <td className={cell}>{resume.phone       || <span className="text-slate-300 italic">—</span>}</td>
//           <td className={cell}>{resume.designation || <span className="text-slate-300 italic">—</span>}</td>
//           <td className={`${cell} max-w-[180px] truncate`}>{resume.address || <span className="text-slate-300 italic">—</span>}</td>
//           <td className="px-3 py-3 whitespace-nowrap">
//             <div className="flex items-center gap-1.5">
             
//               <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-teal-600 transition-colors" title="Edit">
//                 <Edit3 size={14} />
//               </button>
//               <button onClick={() => onDelete(resume.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
//                 <Trash2 size={14} />
//               </button>
//             </div>
//           </td>
//         </>
//       )}
//     </tr>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Main Page
// // ─────────────────────────────────────────────────────────────────────────────

// const ResumeScanningPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'scan' | 'records'>('scan');

//   const token = useSelector((state: RootState) => state.userLoginAuth?.user?.tokens?.access);

//   // Queue state
//   const [queue, setQueue]               = useState<ResumeQueueItem[]>([]);
//   const [currentIndex, setCurrentIndex] = useState<number>(-1);
//   const [queueStarted, setQueueStarted] = useState(false);
//   const [autoSaveEnabled, setAutoSaveEnabled] = useState(false); // New state for auto-save

//   // Per-file review state
//   const [scanStep, setScanStep]       = useState<'upload' | 'review'>('upload');
//   const [isScanning, setIsScanning]   = useState(false);
//   const [isSaving, setIsSaving]       = useState(false);
//   const [rawText, setRawText]         = useState('');
//   const [showRaw, setShowRaw]         = useState(false);
//   const [scanError, setScanError]     = useState<string | null>(null);
//   const [allDone, setAllDone]         = useState(false);
//   const [emailExists, setEmailExists] = useState<boolean | null>(null);
//   const [form, setForm]               = useState<ResumeForm>({
//     name: '', email: '', phone: '', designation: '', address: '',
//   });

//   // Records tab state
//   const [resumes, setResumes]               = useState<ResumeRecord[]>([]);
//   const [loadingRecords, setLoadingRecords] = useState(false);
//   const [recordsError, setRecordsError]     = useState<string | null>(null);
//   const [exportingExcel, setExportingExcel] = useState(false);
//   const [searchQuery, setSearchQuery]       = useState('');
//   const [sortKey, setSortKey]               = useState<keyof ResumeRecord>('created_at');
//   const [sortAsc, setSortAsc]               = useState(false);
//   const [deleteConfirm, setDeleteConfirm]   = useState<number | null>(null);

//   const getHeaders = useCallback(() => ({
//     headers: { Authorization: `Bearer ${token}` }
//   }), [token]);

//   const updateQueueItem = useCallback(
//     (id: string, patch: Partial<ResumeQueueItem>) =>
//       setQueue(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item)),
//     [],
//   );

//   const handleAddFiles = useCallback((files: File[]) => {
//     const newItems: ResumeQueueItem[] = files.map(file => ({
//       id: uid(), file, status: 'pending',
//     }));
//     setQueue(prev => {
//       const existing = new Set(prev.map(p => `${p.file.name}_${p.file.size}`));
//       return [...prev, ...newItems.filter(n => !existing.has(`${n.file.name}_${n.file.size}`))];
//     });
//     setAllDone(false);
//   }, []);

//   const advanceQueue = useCallback((currentQueue: ResumeQueueItem[]) => {
//     const nextIdx = currentQueue.findIndex(
//       (q, i) => i > currentIndex && q.status === 'pending',
//     );
//     if (nextIdx !== -1) {
//       setCurrentIndex(nextIdx);
//     } else {
//       setCurrentIndex(-1);
//       setQueueStarted(false);
//       setAllDone(true);
//       setScanStep('upload');
//     }
//   }, [currentIndex]);

//   const saveScannedData = useCallback(async (item: ResumeQueueItem, parsedData: ResumeForm, rawTextVal: string) => {
//     if (!token) return;

//     const fd = new FormData();
//     Object.entries(parsedData).forEach(([k, v]) => fd.append(k, v));
//     fd.append('raw_text', rawTextVal);
//     fd.append('file', item.file);

//     try {
//       const res = await axios.post(`${API_BASE_URL}/resumes/save/`, fd, {
//         ...getHeaders(),
//         headers: { ...getHeaders().headers, 'Content-Type': 'multipart/form-data' },
//       });

//       setQueue(currentQueue => {
//         const nextQueue = currentQueue.map(q =>
//           q.id === item.id
//             ? { ...q, status: 'completed' as QueueStatus, savedId: res.data.id, action: res.data.action }
//             : q,
//         );
//         advanceQueue(nextQueue);
//         return nextQueue;
//       });
//     } catch (err: any) {
//       const msg = err.response?.data?.error || 'Auto-save failed.';
//       setQueue(currentQueue => {
//         const nextQueue = currentQueue.map(q =>
//           q.id === item.id ? { ...q, status: 'failed' as QueueStatus, error: msg } : q,
//         );
//         advanceQueue(nextQueue);
//         return nextQueue;
//       });
//     }
//   }, [token, getHeaders, advanceQueue]);

//   const scanFile = useCallback(async (item: ResumeQueueItem) => {
//     if (!token) return;
//     setScanError(null);
//     setShowRaw(false);
//     setIsScanning(true);
//     updateQueueItem(item.id, { status: 'processing' });

//     const fd = new FormData();
//     fd.append('file', item.file);

//     try {
//       const res = await axios.post(`${API_BASE_URL}/resumes/scan/`, fd, {
//         ...getHeaders(),
//         headers: { ...getHeaders().headers, 'Content-Type': 'multipart/form-data' },
//       });
//       const { parsed, raw_text } = res.data;
//       const parsedData: ResumeForm = {
//         name: parsed.name || '', email: parsed.email || '', phone: parsed.phone || '',
//         designation: parsed.designation || '', address: parsed.address || '',
//       };

//       // ALWAYS update the form state so the UI shows the latest data
//       updateQueueItem(item.id, { parsedData, rawText: raw_text || '' });
//       setRawText(raw_text || '');
//       setForm(parsedData);
//       setEmailExists(null); // Reset for new item

//       // Now, decide whether to auto-save or wait for user
//       if (autoSaveEnabled) {
//         await saveScannedData(item, parsedData, raw_text || '');
//       } else {
//         setScanStep('review');
//         setIsScanning(false);
//       }
//     } catch (err: any) {
//       const msg = err.response?.data?.error || 'Scan failed.';
//       updateQueueItem(item.id, { status: 'failed', error: msg });

//       if (autoSaveEnabled) {
//         // If auto-saving, just advance the queue on failure
//         setQueue(currentQueue => {
//           advanceQueue(currentQueue);
//           return currentQueue;
//         });
//       } else {
//         // In manual mode, show the error and stop
//         setScanError(msg);
//         setScanStep('upload');
//         setIsScanning(false);
//       }
//     }
//   }, [token, getHeaders, updateQueueItem, autoSaveEnabled, saveScannedData, advanceQueue]);

//   const startQueue = useCallback(() => {
//     const firstPending = queue.findIndex(q => q.status === 'pending');
//     if (firstPending === -1) return;
//     setQueueStarted(true);
//     setAllDone(false);
//     setCurrentIndex(firstPending);
//   }, [queue]);

//   useEffect(() => {
//     if (!queueStarted || currentIndex < 0 || currentIndex >= queue.length) return;
//     const item = queue[currentIndex];
//     if (item.status === 'pending') {
//       scanFile(item);
//     }
//   }, [currentIndex, queueStarted, scanFile, queue]);

//   useEffect(() => {
//     if (scanStep !== 'review' || !form.email.trim() || autoSaveEnabled) {
//       setEmailExists(null);
//       return;
//     }
//     const needle = form.email.toLowerCase().trim();
//     const match  = resumes.some(r => (r.email || '').toLowerCase().trim() === needle);
//     setEmailExists(match);
//   }, [scanStep, form.email, resumes, autoSaveEnabled]);

//   const handleSave = useCallback(async () => {
//     if (currentIndex < 0 || !token) return;
//     const item = queue[currentIndex];
//     setIsSaving(true);
//     setScanError(null);

//     const fd = new FormData();
//     Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//     fd.append('raw_text', rawText);
//     fd.append('file', item.file);

//     try {
//       const res = await axios.post(`${API_BASE_URL}/resumes/save/`, fd, {
//         ...getHeaders(),
//         headers: { ...getHeaders().headers, 'Content-Type': 'multipart/form-data' },
//       });
//       const nextQueue = queue.map(q =>
//         q.id === item.id
//           ? { ...q, status: 'completed' as QueueStatus, savedId: res.data.id, action: res.data.action }
//           : q,
//       );
//       setQueue(nextQueue);
//       advanceQueue(nextQueue);
//     } catch (err: any) {
//       setScanError(err.response?.data?.error || 'Save failed.');
//     } finally {
//       setIsSaving(false);
//     }
//   }, [token, getHeaders, currentIndex, queue, form, rawText, advanceQueue]);

//   const handleSkip = useCallback(() => {
//     if (currentIndex < 0) return;
//     const item = queue[currentIndex];
//     const nextQueue = queue.map(q =>
//       q.id === item.id ? { ...q, status: 'failed' as QueueStatus, error: 'Skipped by user' } : q,
//     );
//     setQueue(nextQueue);
//     advanceQueue(nextQueue);
//   }, [currentIndex, queue, advanceQueue]);

//   const handleRetry = useCallback((id: string) => {
//     const idx = queue.findIndex(q => q.id === id);
//     if (idx === -1) return;
//     setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'pending', error: undefined } : q));
//     if (!queueStarted) {
//         setCurrentIndex(idx);
//         setQueueStarted(true);
//         setAllDone(false);
//         setScanStep('upload');
//     }
//   }, [queue, queueStarted]);

//   const handleRemoveFromQueue = useCallback((id: string) => {
//     setQueue(prev => prev.filter(q => q.id !== id));
//   }, []);

//   const handleReset = useCallback(() => {
//     setQueue([]);
//     setCurrentIndex(-1);
//     setQueueStarted(false);
//     setAllDone(false);
//     setScanStep('upload');
//     setAutoSaveEnabled(false);
//     setEmailExists(null);
//     setForm({ name: '', email: '', phone: '', designation: '', address: '' });
//     setRawText('');
//     setShowRaw(false);
//     setScanError(null);
//   }, []);

//   const fetchRecords = async () => {
//     if (!token) return;
//     setLoadingRecords(true);
//     try {
//       const res = await axios.get(`${API_BASE_URL}/resumes/`, getHeaders());
//       setResumes(res.data.results ?? res.data);
//     } catch {
//       setRecordsError('Failed to load records.');
//     } finally {
//       setLoadingRecords(false);
//     }
//   };

//   useEffect(() => { if (token) fetchRecords(); }, [token]); // eslint-disable-line
//   useEffect(() => { if (activeTab === 'records' && token) fetchRecords(); }, [activeTab, token]);

//   const handleUpdateRecord = async (id: number, data: Partial<ResumeRecord>) => {
//     await axios.patch(`${API_BASE_URL}/resumes/${id}/`, data, getHeaders());
//     setResumes(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
//   };

//   const handleDeleteRecord = async (id: number) => {
//     await axios.delete(`${API_BASE_URL}/resumes/${id}/`, getHeaders());
//     setResumes(prev => prev.filter(r => r.id !== id));
//     setDeleteConfirm(null);
//   };

//   const handleExport = async () => {
//     setExportingExcel(true);
//     setRecordsError(null);
//     try {
//       const res = await axios.get(`${API_BASE_URL}/resumes/export/`, {
//         ...getHeaders(), responseType: 'blob',
//       });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const a = document.createElement('a');
//       a.href = url; a.download = 'resumes.xlsx'; a.click();
//       window.URL.revokeObjectURL(url);
//     } catch {
//       setRecordsError('Export failed.');
//     } finally {
//       setExportingExcel(false);
//     }
//   };

//   const toggleSort = (key: keyof ResumeRecord) => {
//     if (sortKey === key) setSortAsc(p => !p);
//     else { setSortKey(key); setSortAsc(true); }
//   };

//   const filtered = resumes
//     .filter(r => {
//       const q = searchQuery.toLowerCase();
//       return !q || [r.name, r.email, r.phone, r.designation, r.address]
//         .some(v => (v || '').toLowerCase().includes(q));
//     })
//     .sort((a, b) => {
//       const va = String(a[sortKey] || ''), vb = String(b[sortKey] || '');
//       return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
//     });

//   const SortIcon = ({ col }: { col: keyof ResumeRecord }) => (
//     <span className="ml-1 inline-flex flex-col opacity-40">
//       <ChevronUp   size={10} className={sortKey === col && sortAsc  ? 'opacity-100 text-teal-600' : ''} />
//       <ChevronDown size={10} className={sortKey === col && !sortAsc ? 'opacity-100 text-teal-600' : ''} style={{ marginTop: -3 }} />
//     </span>
//   );

//   const qStats = {
//     total:     queue.length,
//     pending:   queue.filter(q => q.status === 'pending').length,
//   };

//   const currentItem = currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex] : null;
//   const hasQueue    = queue.length > 0;

//   return (
//     <div className="min-h-screen bg-[#f8fafb] font-sans pb-20">

//       <div className="bg-white border-b border-slate-200 px-6 py-5 shadow-sm">
//         <div className="flex items-center gap-3 mb-5">
//           <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
//             <FileSearch className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resume Scanner</h1>
//             <p className="text-sm text-slate-500 flex items-center gap-1.5">
//               <FolderOpen size={13} className="text-teal-500" />
//               Select a folder · 
//             </p>
//           </div>
//         </div>

//         <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
//           {([
//             { id: 'scan',    label: 'Scan Resumes', Icon: ScanLine },
//             { id: 'records', label: 'All Records',  Icon: Table2   },
//           ] as const).map(({ id, label, Icon }) => (
//             <button key={id} onClick={() => setActiveTab(id)}
//               className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200
//                 ${activeTab === id ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
//               <Icon size={15} /> {label}
//               {id === 'records' && resumes.length > 0 && (
//                 <span className="bg-teal-100 text-teal-700 text-xs font-bold px-1.5 py-0.5 rounded-full">{resumes.length}</span>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="px-4 py-6 max-w-7xl mx-auto">
//         {activeTab === 'scan' && (
//           <>
//             {allDone ? (
//               <div className="w-full text-center py-16">
//                 <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
//                   <CheckCircle className="w-10 h-10 text-teal-600" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Queue Complete!</h2>
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
//                   <button onClick={handleReset}
//                     className="flex items-center gap-2 px-6 py-3 border-2 border-teal-200 text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-colors">
//                     <FolderOpen size={16} /> Scan Another Folder
//                   </button>
//                   <button onClick={() => { setActiveTab('records'); fetchRecords(); }}
//                     className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md">
//                     <Table2 size={16} /> View All Records
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {scanError && (
//                   <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700">
//                     <XCircle size={18} className="mt-0.5 shrink-0" />
//                     <p className="text-sm font-medium">{scanError}</p>
//                   </div>
//                 )}

//                 <div className={hasQueue ? 'grid grid-cols-1 lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_2.5fr] gap-5 items-stretch' : ''}>
//                   {hasQueue && (
//                     <div className="flex flex-col gap-3">
//                       <div className="flex-1 min-h-0">
//                         <QueuePanel queue={queue} currentIndex={currentIndex} onRemove={handleRemoveFromQueue} onRetry={handleRetry} />
//                       </div>
//                       <div className="flex flex-col gap-2 shrink-0">
//                         {!queueStarted && qStats.pending > 0 && (
//                           <>
//                             <button onClick={startQueue}
//                               className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold text-sm shadow-md hover:from-teal-700 hover:to-cyan-700 transition-all">
//                               <Play size={15} /> Start Processing ({qStats.pending} files)
//                             </button>
//                             <label className="flex items-center gap-2.5 cursor-pointer bg-white p-2 rounded-xl border border-slate-200 text-sm">
//                                 <input
//                                   type="checkbox"
//                                   checked={autoSaveEnabled}
//                                   onChange={(e) => setAutoSaveEnabled(e.target.checked)}
//                                   className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
//                                 />
//                                 <span className="font-semibold text-slate-600">Enable Auto-Save</span>
//                             </label>
//                           </>
//                         )}
//                         <label className="flex items-center justify-center gap-2 w-full py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white">
//                           <Upload size={13} /> Add More Files
//                           <input type="file" accept=".pdf,.docx" multiple className="hidden" onChange={e => { if (e.target.files) handleAddFiles(Array.from(e.target.files).filter(isValidResume)); e.currentTarget.value = ''; }} />
//                         </label>
//                         <button onClick={handleReset} className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-slate-400 hover:text-red-500 transition-colors"><RefreshCw size={11} /> Clear Queue</button>
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex flex-col">
//                     {!hasQueue && (
//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
//                           <h2 className="text-base font-bold text-slate-800 mb-1">Upload Resumes</h2>
//                           <p className="text-xs text-slate-400 mb-4">Select an entire folder — every PDF/DOCX inside will be queued automatically.</p>
//                           <MultiFileDropZone onFiles={handleAddFiles} />
//                         </div>
//                         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
//                            <div>
//                             <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Zap size={14} className="text-teal-500" /> How it works</h3>
//                             {[ { step: '1', label: 'Select folder', desc: 'All PDFs & DOCX files inside are queued' }, { step: '2', label: 'Text extraction', desc: 'pdfplumber → PyMuPDF → EasyOCR (scanned)' }, { step: '3', label: 'Groq AI parsing', desc: 'LLM extracts name, email, phone, role' }, { step: '4', label: 'Review & save', desc: 'Confirm each resume before saving' }, { step: '5', label: 'Export Excel', desc: 'Download all saved resumes as .xlsx' } ].map(({ step, label, desc }) => (
//                               <div key={step} className="flex items-start gap-3 mb-2 last:mb-0">
//                                 <div className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{step}</div>
//                                 <div><p className="text-sm font-semibold text-slate-700">{label}</p><p className="text-xs text-slate-400">{desc}</p></div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {hasQueue && !queueStarted && !isScanning && scanStep === 'upload' && (
//                       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1">
//                         <h2 className="text-base font-bold text-slate-800 mb-1">{qStats.total} files ready to process</h2>
//                         <MultiFileDropZone onFiles={handleAddFiles} />
//                       </div>
//                     )}

//                     {queueStarted && currentItem && (
//                       <div className={`bg-white rounded-2xl shadow-sm border-2 transition-colors duration-300 overflow-hidden flex flex-col flex-1 ${emailExists === true ? 'border-violet-300' : 'border-slate-200'}`}>
//                         <div className={`flex items-center justify-between px-5 py-3.5 border-b shrink-0 ${emailExists === true ? 'border-violet-100 bg-violet-50/40' : 'border-slate-100 bg-slate-50/60'}`}>
//                           <div className="flex items-center gap-2.5 min-w-0">
//                             <FileText size={15} className={currentItem.file.name.endsWith('.pdf') ? 'text-red-500' : 'text-blue-500'} />
//                             <p className="text-sm font-semibold text-slate-700 truncate max-w-[280px]">{currentItem.file.name}</p>
//                           </div>
//                         </div>

//                         {isScanning && (
//                           <div className="flex flex-col items-center justify-center py-20 gap-5">
//                             <ScanLine size={28} className="text-teal-600 animate-pulse" />
//                             <p className="text-sm font-bold text-slate-700">Scanning resume…</p>
//                           </div>
//                         )}

//                         {!isScanning && (scanStep === 'review' || (autoSaveEnabled && form.email)) && (
//                           <div className="p-5 flex-1 overflow-y-auto">
//                             {emailExists === true && (
//                               <div className="mb-4 flex items-start gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
//                                 <RefreshCw size={15} className="text-violet-600 mt-0.5 shrink-0" />
//                                 <div><p className="text-sm font-bold text-violet-800">Duplicate detected</p></div>
//                               </div>
//                             )}
//                             <div className="space-y-3">
//                               {RESUME_FIELDS.map(({ key, label, icon: Icon, placeholder, type }) => (
//                                 <div key={key}>
//                                   <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-1.5"><Icon size={12} className="text-teal-500" /> {label}</label>
//                                   {type === 'textarea' ? (
//                                     <textarea value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 outline-none resize-none bg-slate-50" readOnly={autoSaveEnabled}/>
//                                   ) : (
//                                     <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 outline-none bg-slate-50" readOnly={autoSaveEnabled}/>
//                                   )}
//                                 </div>
//                               ))}
//                             </div>
//                             <div className="flex gap-3 mt-5">
//                               <button onClick={handleSave} disabled={isSaving || autoSaveEnabled} className={`flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-xl font-bold text-sm shadow-md disabled:opacity-50 ${emailExists === true ? 'bg-violet-600' : 'bg-teal-600'}`}>
//                                 {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save & Next'}
//                               </button>
//                               <button onClick={handleSkip} disabled={autoSaveEnabled} className="px-5 py-3 border border-slate-200 text-slate-500 rounded-xl text-sm font-semibold disabled:opacity-50">Skip</button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}
//           </>
//         )}

//         {activeTab === 'records' && (
//           <div className="space-y-4">
//              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//               <div className="relative w-full sm:w-72">
//                 <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search records…" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white shadow-sm" />
//               </div>
//               <div className="flex items-center gap-3">
//                  <button onClick={handleExport} disabled={exportingExcel || resumes.length === 0}
//                   className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-xl font-bold text-sm shadow-md hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//                   {exportingExcel ? <Loader2 size={15} className="animate-spin" /> : <Download size={15}/>}
//                   <span>Export Excel</span>
//                 </button>
//               </div>
//             </div>
//             {recordsError && (
//                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700">
//                     <AlertCircle size={16} />
//                     <span className="text-sm font-medium">{recordsError}</span>
//                  </div>
//             )}
//             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
//               <table className="w-full text-left min-w-[900px]">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-200">
//                     {['Name', 'Email', 'Phone', 'Designation', 'Address', 'Actions'].map(l => (
//                       <th key={l} className="px-3 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">{l}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loadingRecords ? (
//                       <tr><td colSpan={6} className="text-center p-8"><Loader2 className="mx-auto animate-spin text-teal-500"/></td></tr>
//                   ) : filtered.length === 0 ? (
//                       <tr><td colSpan={6} className="text-center p-8 text-slate-500">No records found.</td></tr>
//                   ) : (
//                       filtered.map(r => <EditableRow key={r.id} resume={r} onSave={handleUpdateRecord} onDelete={id => setDeleteConfirm(id)} />)
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {deleteConfirm !== null && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
//             <AlertTriangle className="mx-auto w-12 h-12 text-red-400 mb-2"/>
//             <h3 className="font-bold text-lg text-slate-800">Delete Resume Record?</h3>
//             <p className="text-sm text-slate-500 mt-2">Are you sure? This will permanently delete the record from the database. This action cannot be undone.</p>
//             <div className="flex gap-3 mt-6">
//               <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-slate-200 bg-white rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
//               <button onClick={() => handleDeleteRecord(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResumeScanningPage;



import React, {
  useState, useRef, useEffect, useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  FileText, Upload, Loader2, CheckCircle, XCircle,
  RefreshCw, User, Mail, Phone, Briefcase, MapPin,
  Eye, EyeOff, Download, Trash2, Edit3, Save, X,
  FileSearch, Table2, ChevronUp, ChevronDown, Search,
  AlertCircle, FileCheck, Clock, FolderOpen, Play,
  SkipForward, RotateCcw, ListOrdered, CheckSquare,
  AlertTriangle, Minus, ScanLine, Zap,
} from 'lucide-react';
import type { RootState } from '../../app/store';

const API_BASE_URL = '/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type QueueStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface ResumeQueueItem {
  id: string; file: File; status: QueueStatus;
  parsedData?: ResumeForm; rawText?: string;
  error?: string; savedId?: number; action?: 'created' | 'updated';
}

interface ResumeForm {
  name: string; email: string; phone: string; designation: string; address: string;
}

interface ResumeRecord {
  id: number; name: string; email: string; phone: string;
  designation: string; address: string; raw_text: string;
  status: string; file_url: string | null; created_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RESUME_FIELDS: {
  key: keyof ResumeForm; label: string; icon: React.FC<any>; placeholder: string; type: string;
}[] = [
  { key: 'name',        label: 'Full Name',  icon: User,      placeholder: 'John Doe',             type: 'text'     },
  { key: 'email',       label: 'Email',       icon: Mail,      placeholder: 'john@company.com',     type: 'email'    },
  { key: 'phone',       label: 'Phone',       icon: Phone,     placeholder: '+91 98765 43210',      type: 'text'     },
  { key: 'designation', label: 'Designation', icon: Briefcase, placeholder: 'Software Engineer',   type: 'text'     },
  { key: 'address',     label: 'Address',     icon: MapPin,    placeholder: 'City, State, Country', type: 'textarea' },
];

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];
const isValidResume = (file: File) => ACCEPTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));
const uid = () => Math.random().toString(36).slice(2, 10);

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: QueueStatus; action?: 'created' | 'updated' }> = ({ status, action }) => {
  if (status === 'completed' && action === 'updated') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700 border border-violet-200">
      <RefreshCw size={10} /> Updated
    </span>
  );
  if (status === 'completed' && action === 'created') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-700 border border-teal-200">
      <CheckCircle size={11} /> Saved
    </span>
  );
  const map: Record<QueueStatus, { label: string; cls: string; icon: React.ReactNode }> = {
    pending:    { label: 'Pending',    cls: 'bg-slate-100 text-slate-500 border-slate-200',   icon: <Clock size={11} /> },
    processing: { label: 'Scanning…', cls: 'bg-amber-100 text-amber-700 border-amber-200',   icon: <Loader2 size={11} className="animate-spin" /> },
    completed:  { label: 'Completed', cls: 'bg-teal-100 text-teal-700 border-teal-200',     icon: <CheckCircle size={11} /> },
    failed:     { label: 'Failed',    cls: 'bg-red-100 text-red-600 border-red-200',         icon: <AlertTriangle size={11} /> },
  };
  const { label, cls, icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${cls}`}>
      {icon} {label}
    </span>
  );
};

// ─── Queue Panel ──────────────────────────────────────────────────────────────

const QueuePanel: React.FC<{
  queue: ResumeQueueItem[]; currentIndex: number;
  onRemove: (id: string) => void; onRetry: (id: string) => void;
}> = ({ queue, currentIndex, onRemove, onRetry }) => {
  const completed = queue.filter(q => q.status === 'completed').length;
  const failed    = queue.filter(q => q.status === 'failed').length;
  const total     = queue.length;
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs  = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (currentIndex < 0 || currentIndex >= queue.length) return;
    const el = itemRefs.current[queue[currentIndex].id];
    if (el && scrollRef.current) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentIndex, queue]);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-3 flex items-center justify-between shrink-0 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            <ListOrdered size={13} className="text-white" />
          </div>
          <span className="text-sm font-bold text-white">Queue</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="bg-white/20 text-white px-2 py-0.5 rounded-full">{completed}/{total}</span>
          {failed > 0 && <span className="bg-red-400/30 text-white px-2 py-0.5 rounded-full">{failed} failed</span>}
        </div>
      </div>

      {(queue.some(q => q.action === 'created') || queue.some(q => q.action === 'updated')) && (
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-3 text-xs font-semibold shrink-0">
          {queue.filter(q => q.action === 'created').length > 0 && (
            <span className="text-teal-600 flex items-center gap-1"><CheckCircle size={11} /> {queue.filter(q => q.action === 'created').length} new</span>
          )}
          {queue.filter(q => q.action === 'updated').length > 0 && (
            <span className="text-violet-600 flex items-center gap-1"><RefreshCw size={10} /> {queue.filter(q => q.action === 'updated').length} updated</span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="px-4 py-2.5 border-b border-slate-100 shrink-0">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1 font-medium">{total - completed} remaining</p>
      </div>

      {/* Queue Items */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-50">
        {queue.map((item, idx) => {
          const isCurrent = idx === currentIndex;
          const ext = item.file.name.split('.').pop()?.toLowerCase();
          return (
            <div
              key={item.id}
              ref={el => { itemRefs.current[item.id] = el; }}
              className={`px-4 py-3 flex items-start gap-3 transition-all ${isCurrent ? 'bg-teal-50/70' : 'hover:bg-slate-50'}`}
              style={{ borderLeft: isCurrent ? '3px solid #0d9488' : '3px solid transparent' }}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${ext === 'pdf' ? 'bg-red-100' : 'bg-blue-100'}`}>
                <FileText size={14} className={ext === 'pdf' ? 'text-red-500' : 'text-blue-500'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-teal-700' : 'text-slate-700'}`}>{item.file.name}</p>
                <p className="text-xs text-slate-400">{(item.file.size / 1024).toFixed(0)} KB</p>
                <div className="mt-1"><StatusBadge status={item.status} action={item.action} /></div>
                {item.error && <p className="text-xs text-red-500 mt-1 truncate" title={item.error}>{item.error}</p>}
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                {item.status === 'failed' && (
                  <button onClick={() => onRetry(item.id)} title="Retry" className="p-1 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors"><RotateCcw size={13} /></button>
                )}
                {item.status === 'pending' && (
                  <button onClick={() => onRemove(item.id)} title="Remove" className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><X size={13} /></button>
                )}
                {item.status === 'completed' && (
                  <CheckSquare size={14} className={item.action === 'updated' ? 'text-violet-500 mt-1' : 'text-teal-500 mt-1'} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Drop Zone ────────────────────────────────────────────────────────────────

const MultiFileDropZone: React.FC<{ onFiles: (files: File[]) => void; disabled?: boolean }> = ({ onFiles, disabled }) => {
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const processFileList = useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter(isValidResume);
    if (files.length) onFiles(files);
  }, [onFiles]);

  const traverseEntry = (entry: any, collected: File[]): Promise<void> =>
    new Promise<void>((resolve) => {
      if (entry.isFile) {
        entry.getFile((f: File) => { if (isValidResume(f)) collected.push(f); resolve(); });
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const readBatch = () => {
          reader.readEntries(async (entries: any[]) => {
            if (!entries.length) { resolve(); return; }
            await Promise.all(entries.map((e: any) => traverseEntry(e, collected)));
            readBatch();
          });
        };
        readBatch();
      } else { resolve(); }
    });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    if (disabled) return;
    const items = e.dataTransfer.items;
    if (items?.length) {
      const files: File[] = [];
      const promises: Promise<void>[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.webkitGetAsEntry) {
          const entry = item.webkitGetAsEntry();
          if (entry) { promises.push(traverseEntry(entry, files)); continue; }
        }
        const f = item.getAsFile();
        if (f && isValidResume(f)) files.push(f);
      }
      Promise.all(promises).then(() => { if (files.length) onFiles(files); });
    } else { processFileList(e.dataTransfer.files); }
  }, [disabled, onFiles, processFileList]);

  return (
    <div
      onDragOver={e => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-default'}
        ${dragging ? 'border-teal-400 bg-teal-50 scale-[1.01]' : 'border-slate-200 hover:border-teal-300 hover:bg-teal-50/20'}`}
    >
      <input ref={fileInputRef} type="file" accept=".pdf,.docx" multiple className="hidden" disabled={disabled}
        onChange={e => { if (e.target.files) processFileList(e.target.files); e.target.value = ''; }} />
      <input ref={folderInputRef} type="file" {...({ webkitdirectory: "true" } as any)} multiple className="hidden" disabled={disabled}
        onChange={e => { if (e.target.files) processFileList(e.target.files); e.target.value = ''; }} />

      <div className="flex flex-col items-center gap-5">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all shadow-inner
          ${dragging ? 'bg-teal-100 scale-110' : 'bg-gradient-to-br from-slate-100 to-slate-50'}`}>
          {dragging
            ? <FolderOpen size={32} className="text-teal-500" />
            : <Upload size={32} className="text-slate-400" />}
        </div>
        <div>
          <p className="font-bold text-slate-700 text-base mb-1">
            {dragging ? 'Drop files or folder here!' : 'Drop a folder or individual resumes here'}
          </p>
          <p className="text-xs text-slate-400">PDF and DOCX · Scanned PDFs supported via EasyOCR · Folder picks up all files inside</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
          <button type="button" disabled={disabled}
            onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-sm font-bold rounded-xl hover:from-teal-700 hover:to-cyan-600 transition-all shadow-md shadow-teal-200 disabled:opacity-50">
            <Upload size={14} /> Select Files
          </button>
          <button type="button" disabled={disabled}
            onClick={e => { e.stopPropagation(); folderInputRef.current?.click(); }}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-200 bg-white text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50">
            <FolderOpen size={14} /> Select Folder
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Editable Row ─────────────────────────────────────────────────────────────

const EditableRow: React.FC<{
  resume: ResumeRecord;
  onSave: (id: number, data: Partial<ResumeRecord>) => Promise<void>;
  onDelete: (id: number) => void;
}> = ({ resume, onSave, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [draft, setDraft]     = useState({
    name: resume.name, email: resume.email, phone: resume.phone,
    designation: resume.designation, address: resume.address,
  });

  const handleSave = async () => {
    setSaving(true);
    await onSave(resume.id, draft);
    setSaving(false);
    setEditing(false);
  };

  const inp = 'w-full px-2 py-1.5 text-xs border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none bg-white font-medium';

  return (
    <tr className={`border-b border-slate-100 transition-all ${editing ? 'bg-teal-50/40' : 'hover:bg-indigo-50/30'}`}>
      {editing ? (
        <>
          <td className="px-3 py-2"><input className={inp} value={draft.name}        onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}        placeholder="Name" /></td>
          <td className="px-3 py-2"><input className={inp} value={draft.email}       onChange={e => setDraft(p => ({ ...p, email: e.target.value }))}       placeholder="Email" /></td>
          <td className="px-3 py-2"><input className={inp} value={draft.phone}       onChange={e => setDraft(p => ({ ...p, phone: e.target.value }))}       placeholder="Phone" /></td>
          <td className="px-3 py-2"><input className={inp} value={draft.designation} onChange={e => setDraft(p => ({ ...p, designation: e.target.value }))} placeholder="Designation" /></td>
          <td className="px-3 py-2"><input className={inp} value={draft.address}     onChange={e => setDraft(p => ({ ...p, address: e.target.value }))}     placeholder="Address" /></td>
          <td className="px-3 py-2 whitespace-nowrap">
            <div className="flex items-center gap-1.5">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white text-xs rounded-lg font-bold hover:bg-teal-700 disabled:opacity-50 shadow-sm">
                {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />} Save
              </button>
              <button onClick={() => setEditing(false)}
                className="px-2.5 py-1.5 border-2 border-slate-200 text-slate-500 text-xs rounded-lg font-semibold hover:bg-slate-100">
                Cancel
              </button>
            </div>
          </td>
        </>
      ) : (
        <>
          <td className="px-4 py-3.5 text-sm font-bold text-slate-800 whitespace-nowrap">{resume.name || <span className="text-slate-300 italic font-normal">—</span>}</td>
          <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{resume.email || <span className="text-slate-300 italic">—</span>}</td>
          <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{resume.phone || <span className="text-slate-300 italic">—</span>}</td>
          <td className="px-4 py-3.5 text-sm whitespace-nowrap">
            {resume.designation
              ? <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold">{resume.designation}</span>
              : <span className="text-slate-300 italic text-sm">—</span>}
          </td>
          <td className="px-4 py-3.5 text-sm text-slate-600 max-w-[180px] truncate">{resume.address || <span className="text-slate-300 italic">—</span>}</td>
          <td className="px-4 py-3.5 whitespace-nowrap">
            <div className="flex items-center gap-1.5">
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition-all border border-indigo-200" title="Edit">
                <Edit3 size={12} /> Edit
              </button>
              <button onClick={() => onDelete(resume.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs font-bold transition-all border border-red-200" title="Delete">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </td>
        </>
      )}
    </tr>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const ResumeScanningPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scan' | 'records'>('scan');
  const token = useSelector((state: RootState) => state.userLoginAuth?.user?.tokens?.access);

  const [queue, setQueue]               = useState<ResumeQueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [queueStarted, setQueueStarted] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [scanStep, setScanStep]         = useState<'upload' | 'review'>('upload');
  const [isScanning, setIsScanning]     = useState(false);
  const [isSaving, setIsSaving]         = useState(false);
  const [rawText, setRawText]           = useState('');
  const [showRaw, setShowRaw]           = useState(false);
  const [scanError, setScanError]       = useState<string | null>(null);
  const [allDone, setAllDone]           = useState(false);
  const [emailExists, setEmailExists]   = useState<boolean | null>(null);
  const [form, setForm]                 = useState<ResumeForm>({ name: '', email: '', phone: '', designation: '', address: '' });
  const [resumes, setResumes]           = useState<ResumeRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [recordsError, setRecordsError] = useState<string | null>(null);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [sortKey, setSortKey]           = useState<keyof ResumeRecord>('created_at');
  const [sortAsc, setSortAsc]           = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const getHeaders = useCallback(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  const updateQueueItem = useCallback(
    (id: string, patch: Partial<ResumeQueueItem>) =>
      setQueue(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item)),
    [],
  );

  const handleAddFiles = useCallback((files: File[]) => {
    const newItems: ResumeQueueItem[] = files.map(file => ({ id: uid(), file, status: 'pending' }));
    setQueue(prev => {
      const existing = new Set(prev.map(p => `${p.file.name}_${p.file.size}`));
      return [...prev, ...newItems.filter(n => !existing.has(`${n.file.name}_${n.file.size}`))];
    });
    setAllDone(false);
  }, []);

  const advanceQueue = useCallback((currentQueue: ResumeQueueItem[]) => {
    const nextIdx = currentQueue.findIndex((q, i) => i > currentIndex && q.status === 'pending');
    if (nextIdx !== -1) { setCurrentIndex(nextIdx); }
    else { setCurrentIndex(-1); setQueueStarted(false); setAllDone(true); setScanStep('upload'); }
  }, [currentIndex]);

  const saveScannedData = useCallback(async (item: ResumeQueueItem, parsedData: ResumeForm, rawTextVal: string) => {
    if (!token) return;
    const fd = new FormData();
    Object.entries(parsedData).forEach(([k, v]) => fd.append(k, v));
    fd.append('raw_text', rawTextVal); fd.append('file', item.file);
    try {
      const res = await axios.post(`${API_BASE_URL}/resumes/save/`, fd, { ...getHeaders(), headers: { ...getHeaders().headers, 'Content-Type': 'multipart/form-data' } });
      setQueue(currentQueue => {
        const nextQueue = currentQueue.map(q => q.id === item.id ? { ...q, status: 'completed' as QueueStatus, savedId: res.data.id, action: res.data.action } : q);
        advanceQueue(nextQueue); return nextQueue;
      });
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Auto-save failed.';
      setQueue(currentQueue => {
        const nextQueue = currentQueue.map(q => q.id === item.id ? { ...q, status: 'failed' as QueueStatus, error: msg } : q);
        advanceQueue(nextQueue); return nextQueue;
      });
    }
  }, [token, getHeaders, advanceQueue]);

  const scanFile = useCallback(async (item: ResumeQueueItem) => {
    if (!token) return;
    setScanError(null); setShowRaw(false); setIsScanning(true);
    updateQueueItem(item.id, { status: 'processing' });
    const fd = new FormData(); fd.append('file', item.file);
    try {
      const res = await axios.post(`${API_BASE_URL}/resumes/scan/`, fd, { ...getHeaders(), headers: { ...getHeaders().headers, 'Content-Type': 'multipart/form-data' } });
      const { parsed, raw_text } = res.data;
      const parsedData: ResumeForm = { name: parsed.name || '', email: parsed.email || '', phone: parsed.phone || '', designation: parsed.designation || '', address: parsed.address || '' };
      updateQueueItem(item.id, { parsedData, rawText: raw_text || '' });
      setRawText(raw_text || ''); setForm(parsedData); setEmailExists(null);
      if (autoSaveEnabled) { await saveScannedData(item, parsedData, raw_text || ''); }
      else { setScanStep('review'); setIsScanning(false); }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Scan failed.';
      updateQueueItem(item.id, { status: 'failed', error: msg });
      if (autoSaveEnabled) { setQueue(currentQueue => { advanceQueue(currentQueue); return currentQueue; }); }
      else { setScanError(msg); setScanStep('upload'); setIsScanning(false); }
    }
  }, [token, getHeaders, updateQueueItem, autoSaveEnabled, saveScannedData, advanceQueue]);

  const startQueue = useCallback(() => {
    const firstPending = queue.findIndex(q => q.status === 'pending');
    if (firstPending === -1) return;
    setQueueStarted(true); setAllDone(false); setCurrentIndex(firstPending);
  }, [queue]);

  useEffect(() => {
    if (!queueStarted || currentIndex < 0 || currentIndex >= queue.length) return;
    const item = queue[currentIndex];
    if (item.status === 'pending') scanFile(item);
  }, [currentIndex, queueStarted, scanFile, queue]);

  useEffect(() => {
    if (scanStep !== 'review' || !form.email.trim() || autoSaveEnabled) { setEmailExists(null); return; }
    const needle = form.email.toLowerCase().trim();
    setEmailExists(resumes.some(r => (r.email || '').toLowerCase().trim() === needle));
  }, [scanStep, form.email, resumes, autoSaveEnabled]);

  const handleSave = useCallback(async () => {
    if (currentIndex < 0 || !token) return;
    const item = queue[currentIndex];
    setIsSaving(true); setScanError(null);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('raw_text', rawText); fd.append('file', item.file);
    try {
      const res = await axios.post(`${API_BASE_URL}/resumes/save/`, fd, { ...getHeaders(), headers: { ...getHeaders().headers, 'Content-Type': 'multipart/form-data' } });
      const nextQueue = queue.map(q => q.id === item.id ? { ...q, status: 'completed' as QueueStatus, savedId: res.data.id, action: res.data.action } : q);
      setQueue(nextQueue); advanceQueue(nextQueue);
    } catch (err: any) { setScanError(err.response?.data?.error || 'Save failed.'); }
    finally { setIsSaving(false); }
  }, [token, getHeaders, currentIndex, queue, form, rawText, advanceQueue]);

  const handleSkip = useCallback(() => {
    if (currentIndex < 0) return;
    const item = queue[currentIndex];
    const nextQueue = queue.map(q => q.id === item.id ? { ...q, status: 'failed' as QueueStatus, error: 'Skipped by user' } : q);
    setQueue(nextQueue); advanceQueue(nextQueue);
  }, [currentIndex, queue, advanceQueue]);

  const handleRetry = useCallback((id: string) => {
    const idx = queue.findIndex(q => q.id === id);
    if (idx === -1) return;
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'pending', error: undefined } : q));
    if (!queueStarted) { setCurrentIndex(idx); setQueueStarted(true); setAllDone(false); setScanStep('upload'); }
  }, [queue, queueStarted]);

  const handleRemoveFromQueue = useCallback((id: string) => { setQueue(prev => prev.filter(q => q.id !== id)); }, []);

  const handleReset = useCallback(() => {
    setQueue([]); setCurrentIndex(-1); setQueueStarted(false); setAllDone(false);
    setScanStep('upload'); setAutoSaveEnabled(false); setEmailExists(null);
    setForm({ name: '', email: '', phone: '', designation: '', address: '' });
    setRawText(''); setShowRaw(false); setScanError(null);
  }, []);

  const fetchRecords = async () => {
    if (!token) return; setLoadingRecords(true);
    try { const res = await axios.get(`${API_BASE_URL}/resumes/`, getHeaders()); setResumes(res.data.results ?? res.data); }
    catch { setRecordsError('Failed to load records.'); }
    finally { setLoadingRecords(false); }
  };

  useEffect(() => { if (token) fetchRecords(); }, [token]); // eslint-disable-line
  useEffect(() => { if (activeTab === 'records' && token) fetchRecords(); }, [activeTab, token]);

  const handleUpdateRecord = async (id: number, data: Partial<ResumeRecord>) => {
    await axios.patch(`${API_BASE_URL}/resumes/${id}/`, data, getHeaders());
    setResumes(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  };

  const handleDeleteRecord = async (id: number) => {
    await axios.delete(`${API_BASE_URL}/resumes/${id}/`, getHeaders());
    setResumes(prev => prev.filter(r => r.id !== id)); setDeleteConfirm(null);
  };

  const handleExport = async () => {
    setExportingExcel(true); setRecordsError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/resumes/export/`, { ...getHeaders(), responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url; a.download = 'resumes.xlsx'; a.click();
      window.URL.revokeObjectURL(url);
    } catch { setRecordsError('Export failed.'); }
    finally { setExportingExcel(false); }
  };

  const toggleSort = (key: keyof ResumeRecord) => {
    if (sortKey === key) setSortAsc(p => !p); else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = resumes
    .filter(r => { const q = searchQuery.toLowerCase(); return !q || [r.name, r.email, r.phone, r.designation, r.address].some(v => (v || '').toLowerCase().includes(q)); })
    .sort((a, b) => { const va = String(a[sortKey] || ''), vb = String(b[sortKey] || ''); return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va); });

  const SortIcon = ({ col }: { col: keyof ResumeRecord }) => (
    <span className="ml-1 inline-flex flex-col opacity-50">
      <ChevronUp   size={10} className={sortKey === col && sortAsc  ? 'opacity-100 text-white' : ''} />
      <ChevronDown size={10} className={sortKey === col && !sortAsc ? 'opacity-100 text-white' : ''} style={{ marginTop: -3 }} />
    </span>
  );

  const qStats = { total: queue.length, pending: queue.filter(q => q.status === 'pending').length };
  const currentItem = currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex] : null;
  const hasQueue = queue.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 shadow-sm">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
            <FileSearch className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-teal-600 to-cyan-600 tracking-tight m-0">Resume Scanner</h1>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 m-0 mt-0.5">
              <FolderOpen size={13} className="text-teal-500" />
              AI-powered resume parsing · Select a folder to begin
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
          {([
            { id: 'scan',    label: 'Scan Resumes', Icon: ScanLine },
            { id: 'records', label: 'All Records',  Icon: Table2   },
          ] as const).map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200
                ${activeTab === id
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-200'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'}`}>
              <Icon size={15} /> {label}
              {id === 'records' && resumes.length > 0 && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeTab === id ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-700'}`}>{resumes.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-6 py-6 w-full">
        {activeTab === 'scan' && (
          <>
            {allDone ? (
              <div className="w-full text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <CheckCircle className="w-12 h-12 text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Queue Complete!</h2>
                <p className="text-slate-500 text-sm mb-8">All resumes have been processed successfully.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={handleReset}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-teal-200 text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-colors">
                    <FolderOpen size={16} /> Scan Another Folder
                  </button>
                  <button onClick={() => { setActiveTab('records'); fetchRecords(); }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-teal-200 hover:from-teal-700 hover:to-cyan-600 transition-all">
                    <Table2 size={16} /> View All Records
                  </button>
                </div>
              </div>
            ) : (
              <>
                {scanError && (
                  <div className="mb-5 flex items-start gap-3 bg-red-50 border-2 border-red-200 rounded-2xl px-5 py-4 text-red-700">
                    <XCircle size={18} className="mt-0.5 shrink-0" />
                    <p className="text-sm font-semibold">{scanError}</p>
                  </div>
                )}

                <div className={hasQueue ? 'grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr] gap-5 items-stretch' : ''}>
                  {hasQueue && (
                    <div className="flex flex-col gap-3">
                      <div className="flex-1 min-h-0" style={{ maxHeight: '600px' }}>
                        <QueuePanel queue={queue} currentIndex={currentIndex} onRemove={handleRemoveFromQueue} onRetry={handleRetry} />
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        {!queueStarted && qStats.pending > 0 && (
                          <>
                            <button onClick={startQueue}
                              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-200 hover:from-teal-700 hover:to-cyan-600 transition-all">
                              <Play size={15} /> Start Processing ({qStats.pending} files)
                            </button>
                            <label className="flex items-center gap-2.5 cursor-pointer bg-white p-3 rounded-xl border-2 border-slate-200 text-sm hover:border-teal-300 transition-colors">
                              <input type="checkbox" checked={autoSaveEnabled} onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 accent-teal-600" />
                              <span className="font-bold text-slate-700">Enable Auto-Save</span>
                            </label>
                          </>
                        )}
                        <label className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer bg-white">
                          <Upload size={13} /> Add More Files
                          <input type="file" accept=".pdf,.docx" multiple className="hidden"
                            onChange={e => { if (e.target.files) handleAddFiles(Array.from(e.target.files).filter(isValidResume)); e.currentTarget.value = ''; }} />
                        </label>
                        <button onClick={handleReset}
                          className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-slate-400 hover:text-red-500 transition-colors font-semibold">
                          <RefreshCw size={11} /> Clear Queue
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col">
                    {!hasQueue && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md p-6 w-full">
                          <h2 className="text-base font-bold text-slate-800 mb-1">Upload Resumes</h2>
                          <p className="text-xs text-slate-400 mb-4">Select an entire folder — every PDF/DOCX inside will be queued automatically.</p>
                          <MultiFileDropZone onFiles={handleAddFiles} />
                        </div>
                        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md p-6 w-full">
                          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                            <div className="w-6 h-6 bg-teal-100 rounded-lg flex items-center justify-center">
                              <Zap size={13} className="text-teal-600" />
                            </div>
                            How it works
                          </h3>
                          {[
                            { step: '1', label: 'Select folder',    desc: 'All PDFs & DOCX files inside are queued' },
                            { step: '2', label: 'Text extraction',  desc: 'pdfplumber → PyMuPDF → EasyOCR (scanned)' },
                            { step: '3', label: 'Groq AI parsing',  desc: 'LLM extracts name, email, phone, role' },
                            { step: '4', label: 'Review & save',    desc: 'Confirm each resume before saving' },
                            { step: '5', label: 'Export Excel',     desc: 'Download all saved resumes as .xlsx' },
                          ].map(({ step, label, desc }) => (
                            <div key={step} className="flex items-start gap-3 mb-3 last:mb-0">
                              <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-cyan-400 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">{step}</div>
                              <div><p className="text-sm font-bold text-slate-700">{label}</p><p className="text-xs text-slate-400">{desc}</p></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {hasQueue && !queueStarted && !isScanning && scanStep === 'upload' && (
                      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md p-6 flex-1">
                        <h2 className="text-base font-bold text-slate-800 mb-1">{qStats.total} files ready to process</h2>
                        <MultiFileDropZone onFiles={handleAddFiles} />
                      </div>
                    )}

                    {queueStarted && currentItem && (
                      <div className={`bg-white rounded-2xl shadow-md border-2 transition-colors duration-300 flex flex-col flex-1 overflow-hidden
                        ${emailExists === true ? 'border-violet-300' : 'border-teal-200'}`}>
                        <div className={`flex items-center justify-between px-5 py-3.5 border-b shrink-0 rounded-t-2xl
                          ${emailExists === true ? 'bg-gradient-to-r from-violet-50 to-purple-50 border-violet-100' : 'bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-100'}`}>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentItem.file.name.endsWith('.pdf') ? 'bg-red-100' : 'bg-blue-100'}`}>
                              <FileText size={15} className={currentItem.file.name.endsWith('.pdf') ? 'text-red-500' : 'text-blue-500'} />
                            </div>
                            <p className="text-sm font-bold text-slate-700 truncate max-w-[280px]">{currentItem.file.name}</p>
                          </div>
                        </div>

                        {isScanning && (
                          <div className="flex flex-col items-center justify-center py-20 gap-5">
                            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center">
                              <ScanLine size={28} className="text-teal-600 animate-pulse" />
                            </div>
                            <p className="text-sm font-bold text-slate-700">Scanning resume with AI…</p>
                            <p className="text-xs text-slate-400">Extracting text and parsing fields</p>
                          </div>
                        )}

                        {!isScanning && (scanStep === 'review' || (autoSaveEnabled && form.email)) && (
                          <div className="p-5 flex-1 overflow-y-auto">
                            {emailExists === true && (
                              <div className="mb-4 flex items-start gap-3 bg-violet-50 border-2 border-violet-200 rounded-xl px-4 py-3">
                                <RefreshCw size={15} className="text-violet-600 mt-0.5 shrink-0" />
                                <div><p className="text-sm font-bold text-violet-800">Duplicate detected — will update existing record</p></div>
                              </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {RESUME_FIELDS.map(({ key, label, icon: Icon, placeholder, type }) => (
                                <div key={key} className={type === 'textarea' ? 'sm:col-span-2' : ''}>
                                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-1.5">
                                    <Icon size={12} className="text-teal-500" /> {label}
                                  </label>
                                  {type === 'textarea' ? (
                                    <textarea value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} rows={2}
                                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none resize-none bg-slate-50 font-medium transition-all"
                                      readOnly={autoSaveEnabled} />
                                  ) : (
                                    <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none bg-slate-50 font-medium transition-all"
                                      readOnly={autoSaveEnabled} />
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-3 mt-5">
                              <button onClick={handleSave} disabled={isSaving || autoSaveEnabled}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-xl font-bold text-sm shadow-md disabled:opacity-50 transition-all
                                  ${emailExists === true
                                    ? 'bg-gradient-to-r from-violet-600 to-purple-500 shadow-violet-200 hover:from-violet-700 hover:to-purple-600'
                                    : 'bg-gradient-to-r from-teal-600 to-cyan-500 shadow-teal-200 hover:from-teal-700 hover:to-cyan-600'}`}>
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save & Next →'}
                              </button>
                              <button onClick={handleSkip} disabled={autoSaveEnabled}
                                className="px-5 py-3 border-2 border-slate-200 text-slate-500 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-slate-50 transition-colors">
                                Skip
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'records' && (
          <div className="flex flex-col gap-4">
            {/* Records toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search records…"
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none font-medium transition-all" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                  {filtered.length} record{filtered.length !== 1 ? 's' : ''}
                </span>
                <button onClick={handleExport} disabled={exportingExcel || resumes.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-200 hover:from-emerald-700 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {exportingExcel ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                  Export Excel
                </button>
              </div>
            </div>

            {recordsError && (
              <div className="flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 text-red-700">
                <AlertCircle size={16} /> <span className="text-sm font-semibold">{recordsError}</span>
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-teal-700 to-cyan-600 text-white text-[10.5px] font-bold uppercase tracking-widest">
                      {[
                        { label: 'Name',        key: 'name'        },
                        { label: 'Email',       key: 'email'       },
                        { label: 'Phone',       key: 'phone'       },
                        { label: 'Designation', key: 'designation' },
                        { label: 'Address',     key: 'address'     },
                        { label: 'Actions',     key: null          },
                      ].map(({ label, key }) => (
                        <th key={label}
                          className={`px-4 py-3.5 ${key ? 'cursor-pointer hover:bg-white/10 transition-colors select-none' : ''}`}
                          onClick={() => key && toggleSort(key as keyof ResumeRecord)}>
                          <span className="flex items-center gap-1">
                            {label}
                            {key && <SortIcon col={key as keyof ResumeRecord} />}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loadingRecords ? (
                      <tr><td colSpan={6} className="text-center p-12">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="animate-spin text-teal-500 w-8 h-8" />
                          <p className="text-sm text-slate-400 font-medium">Loading records…</p>
                        </div>
                      </td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td colSpan={6} className="text-center p-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">📄</div>
                          <p className="text-sm font-bold text-slate-600">No records found</p>
                          <p className="text-xs text-slate-400">Try adjusting your search or scan some resumes</p>
                        </div>
                      </td></tr>
                    ) : (
                      filtered.map(r => <EditableRow key={r.id} resume={r} onSave={handleUpdateRecord} onDelete={id => setDeleteConfirm(id)} />)
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Modal ── */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border-2 border-red-100">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">Delete Resume Record?</h3>
            <p className="text-sm text-slate-500 mt-2">This will permanently delete the record. This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border-2 border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDeleteRecord(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-md shadow-red-200 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeScanningPage;