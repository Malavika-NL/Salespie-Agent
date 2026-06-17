// import React, { useEffect, useState } from "react";
// import Navbar from "../UserDashboard/components/navbar/navbar";
// import UserSidebar from "../UserHome/components/UserSidebar/userSidebar";
// import styles from "./TaskWorkspaceList.module.css";
// import { IoIosSquare } from "react-icons/io";
// import { IoMdSquareOutline } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTaskDetails } from "../TaskWorkspace/components/NewTaskDetails/TaskDetails/TaskDetails";
// import type { RootState } from "../../app/store";
// import { AiOutlinePlusCircle } from "react-icons/ai";
// import { IoMdSearch } from "react-icons/io";
// import CreateTask from "../TaskWorkspace/components/CreateTask/CreateTask";
// import PopupForm from "../TaskWorkspace/components/PopupForm/PopupForm";


// interface Task {
//     id: number;
//     task: string;
//     description: string;
//     priority: string;
//     start_date: string;
//     end_date: string;
//     assignedto_username: string;
//     status: string;
//     outcome: string;
//     last_update_date: string;
//     is_accepted: string;
//     assigned_by: string;
// }

// const TaskWorkspaceList: React.FC = () => {
//     const dispatch = useDispatch();

//     useEffect(() => {
//         dispatch(fetchTaskDetails() as any);
//     }, [dispatch]);

//     const { data, loading, error } = useSelector((state: RootState) => state.fetchTaskDetailsData);
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [activeItem, setActiveItem] = useState<string>('All');  // Set 'All' as the default
//     const [showForm, setShowForm] = useState(false);
//     const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [searchQuery, setSearchQuery] = useState<string>("");
//     const token = useSelector((state: RootState) => state.userLoginAuth?.user?.tokens.access) || localStorage.getItem('token');

//     console.log(data)
//     const handleItemClick = (item: string) => {
//         setActiveItem(item === activeItem ? 'All' : item); // Toggle active item
//     };
//     const handleButtonClick = () => {
//         setShowForm(true);
//         console.log('opened')
//     };

//     const handleCloseForm = () => {
//         setShowForm(false);
//     };

//     const updateTaskDetails = (updatedTask: Task) => {
//         // Extract only necessary fields
//         const patchData = {
//             status: updatedTask.status,
//             outcome: updatedTask.outcome,
//         };
    
//         fetch(`http://localhost:8000/tasks/${updatedTask.id}/`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify(patchData), // Send only status and outcome
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error('Failed to update the task');
//                 }
//                 return response.json();
//             })
//             .then(() => {
//                 // Close the edit form after a successful update
//                 setShowEditForm(false);
    
//                 // Reload task details
//                 dispatch(fetchTaskDetails() as any);
//             })
//             .catch((error) => {
//                 console.error('Error updating task:', error);
//             });
//     };
    
//     // Filter tasks based on the selected status
//     const reversedData = [...data].reverse();
//     const filteredData = activeItem === 'All'
//         ? reversedData
//         : reversedData?.filter((task: any) => task.status === activeItem);

//         const searchedData = filteredData?.filter((task: Task) =>
//             [task.task, task.assigned_by, task.assignedto_username]
//                 .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
//         );
//      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//             setSearchQuery(e.target.value);
//         };

//     const getPriorityStyle = (priority: string) => {
//         switch (priority.toLowerCase()) {
//             case "high":
//                 return { color: "#C32C2C" };
//             case "medium":
//                 return { color: "#FF9C07" };
//             case "low":
//                 return { color: "#418F11" };
//             default:
//                 return { backgroundColor: "#ccc", color: "#000" };
//         }
//     };

//     const getStatusClass = (status: string) => {
//         switch (status.toLowerCase()) {
//             case "in progress":
//                 return styles.inProgress;
//             case "pending":
//                 return styles.pending;
//             case "completed":
//                 return styles.completed;
//             default:
//                 return styles.defaultStatus;
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div className={styles.mainContent }>
//                     {/* Header Row */}
//                     <div className={styles.header}>
//                         <div className={styles.title} >Task List</div>
//                         <button className={styles.createButton} onClick={handleButtonClick} >
//                             <span>Create New Task</span>
//                             <AiOutlinePlusCircle size={20} className={styles.icon} />
//                         </button>
//                     </div>
//                     <div className={styles.filterContainer}>
//                         <div className={styles.leftContainer}>
//                             <div
//                                 className={`${styles.divItem} ${activeItem === 'All' ? styles.active : ''}`}
//                                 onClick={() => handleItemClick('All')}
//                             >
//                                 All
//                             </div>
//                             <div
//                                 className={`${styles.divItem} ${activeItem === 'Pending' ? styles.active : ''}`}
//                                 onClick={() => handleItemClick('Pending')}
//                             >
//                                 Pending
//                             </div>
//                             <div
//                                 className={`${styles.divItem} ${activeItem === 'In Progress' ? styles.active : ''}`}
//                                 onClick={() => handleItemClick('In Progress')}
//                             >
//                                 In Progress
//                             </div>
//                             <div
//                                 className={`${styles.divItem} ${activeItem === 'Completed' ? styles.active : ''}`}
//                                 onClick={() => handleItemClick('Completed')}
//                             >
//                                 Completed
//                             </div>
//                         </div>
//                         <div className={styles.rightContainer}>
//                             <div className={styles.searchBar}>
//                                 <IoMdSearch size={20} className={styles.searchIcon} />
//                                 <input
//                                     type="text"
//                                     placeholder="Search"
//                                     className={styles.searchInput}
//                                     value={searchQuery}
//                                     onChange={handleSearchChange}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                     <div className={styles.gridContainer}>
//                         <div className={styles.div1}><IoIosSquare className={styles.icon} /></div>
//                         <div className={styles.div2}>Assigned By</div>
//                         <div className={styles.div3}>Task</div>
//                         <div className={styles.div4}>Priority</div>
//                         <div className={styles.div5}>Start Date</div>
//                         <div className={styles.div6}>End Date</div>
//                         <div className={styles.div7}>Status</div>
//                         <div className={styles.div8}></div>
//                     </div>

//                     {/* Map over filtered task data */}
//                     {searchedData && searchedData.map((task: any, index: number) => (
//                         <div key={index} className={styles.gridRow}>
//                             <div className={styles.div1}><IoMdSquareOutline className={styles.icon} /></div>
//                             <div className={styles.div2}>{task.assigned_by || "N/A"}</div>
//                             <div className={styles.div3}>{task.task || "N/A"}</div>
//                             <div
//                                 className={styles.div4}
//                                 style={getPriorityStyle(task.priority || "")}
//                             >
//                                 {task.priority || "N/A"}
//                             </div>
//                             <div className={styles.div5}>{task.start_date || "N/A"}</div>
//                             <div className={styles.div6}>{task.end_date || "N/A"}</div>
//                             <div className={styles.div7}>
//                                 <div className={getStatusClass(task.status || "")}>
//                                     {task.status || "N/A"}
//                                 </div>
//                             </div>
//                             <div className={styles.div8}
//                                ><FaRegEdit className={styles.editIcon} title="Edit" onClick={() => {
//                                 setSelectedTask(task); // Set the selected task
//                                 setShowEditForm(true); // Show the popup form
//                                } } /></div>
//                         </div>
//                     ))}
//                     {showForm && <CreateTask onClose={handleCloseForm} />}
//                     {showEditForm && selectedTask && (
//                         <PopupForm
//                             task={selectedTask}
//                             onSave={updateTaskDetails}
//                             onClose={() => setShowEditForm(false)}
//                         />
//                     )}

//                 </div>
        
//     );
// };

// export default TaskWorkspaceList;
// ===============================================================================================================================
// import React, { useEffect, useState } from "react";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch } from "react-icons/md";
// import { AiOutlinePlusCircle } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTaskDetails } from "../TaskWorkspace/components/NewTaskDetails/TaskDetails/TaskDetails";
// import type { RootState } from "../../app/store";
// import CreateTask from "../TaskWorkspace/components/CreateTask/CreateTask";
// import PopupForm from "../TaskWorkspace/components/PopupForm/PopupForm";
// import styles from "./TaskWorkspaceList.module.css";

// const STATUS_FILTERS = ["All", "Pending", "In Progress", "Completed"];

// interface Task {
//   id: number;
//   task: string;
//   description: string;
//   priority: string;
//   start_date: string;
//   end_date: string;
//   assignedto_username: string;
//   status: string;
//   outcome: string;
//   last_update_date: string;
//   is_accepted: string;
//   assigned_by: string;
// }

// const TaskWorkspaceList: React.FC = () => {
//   const dispatch = useDispatch<any>();

//   const [searchQuery,  setSearchQuery]  = useState("");
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
//   const [visibleCount, setVisibleCount] = useState(15);
//   const [showForm,     setShowForm]     = useState(false);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [showEditForm, setShowEditForm] = useState(false);

//   const { data, loading, error } = useSelector(
//     (state: RootState) => state.fetchTaskDetailsData
//   );
//   const token =
//     useSelector((state: RootState) => state.userLoginAuth?.user?.tokens.access) ||
//     localStorage.getItem("token");

//   useEffect(() => {
//     dispatch(fetchTaskDetails() as any);
//   }, [dispatch]);

//   /* ── filtering ── */
//   const reversedData = [...data].reverse();
//   const statusFiltered =
//     activeFilter === "All"
//       ? reversedData
//       : reversedData.filter((t: any) => t.status === activeFilter);

//   const filteredData = statusFiltered.filter((task: Task) =>
//     [task.task, task.assigned_by, task.assignedto_username].some((f) =>
//       f?.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   const visibleData = filteredData.slice(0, visibleCount);

//   const toggleRow = (id: number) =>
//     setExpandedRows((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });

//   const updateTaskDetails = (updatedTask: Task) => {
//     fetch(`http://localhost:8000/tasks/${updatedTask.id}/`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ status: updatedTask.status, outcome: updatedTask.outcome }),
//     })
//       .then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); })
//       .then(() => { setShowEditForm(false); dispatch(fetchTaskDetails() as any); })
//       .catch((e) => console.error("Error updating task:", e));
//   };

//   /* ── helpers ── */
//   const priorityColor: Record<string, string> = {
//     high:   "#EF4444",
//     medium: "#F59E0B",
//     low:    "#10B981",
//   };

//   const statusColor: Record<string, string> = {
//     "in progress": "#2188EF",
//     pending:       "#FF9C07",
//     completed:     "#418F11",
//   };

//   return (
//     <div className={styles.page}>

//       {/* ── Page header ── */}
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Task Workspace</h1>
//           <p className={styles.pageSubtitle}>Manage and view all task records</p>
//         </div>

//         <div className={styles.headerRight}>
//           {/* Filter pills */}
//           <div className={styles.filterPills}>
//             {STATUS_FILTERS.map((f) => (
//               <button
//                 key={f}
//                 className={`${styles.pill} ${activeFilter === f ? styles.pillActive : ""}`}
//                 onClick={() => { setActiveFilter(f); setVisibleCount(15); }}
//               >
//                 {f}
//               </button>
//             ))}
//           </div>

//           {/* Search */}
//           <div className={styles.searchBar}>
//             <MdOutlineSearch className={styles.searchIcon} />
//             <input
//               className={styles.searchInput}
//               placeholder="Search by task, assignee…"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             {searchQuery && (
//               <button className={styles.clearBtn} onClick={() => setSearchQuery("")}>✕</button>
//             )}
//           </div>

//           {/* Create button */}
//           <button className={styles.createBtn} onClick={() => setShowForm(true)}>
//             <AiOutlinePlusCircle size={16} />
//             Create Task
//           </button>
//         </div>
//       </div>

//       {/* ── Table card ── */}
//       <div className={styles.tableCard}>

//         {/* Header */}
//         <div className={styles.tableHeader}>
//           <div className={styles.thCell} />
//           <div className={styles.thCell}>Assigned By</div>
//           <div className={styles.thCell}>Task</div>
//           <div className={styles.thCell}>Priority</div>
//           <div className={styles.thCell}>Start Date</div>
//           <div className={styles.thCell}>End Date</div>
//           <div className={styles.thCell}>Status</div>
//           <div className={styles.thCell} />
//         </div>

//         {/* Loading skeleton */}
//         {loading && (
//           <div className={styles.stateBox}>
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className={styles.skeletonRow}>
//                 {[1, 2, 3, 4, 5, 6, 7].map((j) => (
//                   <div key={j} className={styles.skeletonCell} />
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Error */}
//         {error && !loading && (
//           <div className={styles.stateBox}>
//             <div className={styles.emptyState}>
//               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="1.5">
//                 <circle cx="12" cy="12" r="10"/>
//                 <line x1="12" y1="8"  x2="12"   y2="12"/>
//                 <line x1="12" y1="16" x2="12.01" y2="16"/>
//               </svg>
//               <p className={styles.emptyText}>Failed to load data. Please refresh.</p>
//             </div>
//           </div>
//         )}

//         {/* Empty */}
//         {!loading && !error && filteredData.length === 0 && (
//           <div className={styles.stateBox}>
//             <div className={styles.emptyState}>
//               <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
//                 <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2"/>
//                 <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2"/>
//                 <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
//               </svg>
//               <p className={styles.emptyText}>No tasks match your search</p>
//             </div>
//           </div>
//         )}

//         {/* Rows */}
//         {!loading && !error && visibleData.map((task: any, idx: number) => (
//           <div
//             key={task.id}
//             className={styles.rowGroup}
//             style={{ animationDelay: `${idx * 30}ms` }}
//           >
//             {/* Main row */}
//             <div className={`${styles.tableRow} ${expandedRows.has(task.id) ? styles.rowExpanded : ""}`}>
//               <button
//                 className={styles.chevronBtn}
//                 onClick={() => toggleRow(task.id)}
//                 aria-label="Expand row"
//               >
//                 <IoIosArrowDropdown
//                   size={20}
//                   className={`${styles.chevron} ${expandedRows.has(task.id) ? styles.chevronOpen : ""}`}
//                 />
//               </button>

//               <div className={styles.tdCell}>
//                 <span className={styles.assignedBy}>{task.assigned_by || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.taskName}>{task.task || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span
//                   className={styles.priorityBadge}
//                   style={{
//                     background: `${priorityColor[task.priority?.toLowerCase()] ?? "#94A3B8"}18`,
//                     color: priorityColor[task.priority?.toLowerCase()] ?? "#94A3B8",
//                   }}
//                 >
//                   {task.priority || "—"}
//                 </span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.dateCell}>{task.start_date || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.dateCell}>{task.end_date || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 {task.status ? (
//                   <span
//                     className={styles.statusBadge}
//                     style={{ background: statusColor[task.status?.toLowerCase()] ?? "#94A3B8" }}
//                   >
//                     {task.status}
//                   </span>
//                 ) : (
//                   <span className={styles.empty}>—</span>
//                 )}
//               </div>

//               <button
//                 className={styles.editBtn}
//                 onClick={() => { setSelectedTask(task); setShowEditForm(true); }}
//                 aria-label="Edit task"
//               >
//                 <FaRegEdit size={14} />
//               </button>
//             </div>

//             {/* Expanded detail panel */}
//             {expandedRows.has(task.id) && (
//               <div className={styles.detailPanel}>
//                 <div className={styles.detailPanelInner}>
//                   <div className={styles.detailHeader}>
//                     <span className={styles.detailTitle}>{task.task}</span>
//                     <span className={styles.detailSubtitle}>Task Details</span>
//                   </div>
//                   <div className={styles.detailGrid}>
//                     {[
//                       { label: "Assigned To",     value: task.assignedto_username },
//                       { label: "Description",     value: task.description         },
//                       { label: "Outcome",         value: task.outcome             },
//                       { label: "Last Updated",    value: task.last_update_date    },
//                       { label: "Accepted",        value: task.is_accepted         },
//                       { label: "Priority",        value: task.priority            },
//                     ].map(({ label, value }) => (
//                       <div key={label} className={styles.detailItem}>
//                         <span className={styles.detailLabel}>{label}</span>
//                         <span className={styles.detailValue}>{value || "—"}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Load more */}
//         {!loading && visibleCount < filteredData.length && (
//           <div className={styles.loadMoreWrap}>
//             <button
//               className={styles.loadMoreBtn}
//               onClick={() => setVisibleCount((c) => c + 15)}
//             >
//               Load more ({filteredData.length - visibleCount} remaining)
//             </button>
//           </div>
//         )}

//       </div>

//       {/* Modals */}
//       {showForm && <CreateTask onClose={() => setShowForm(false)} />}
//       {showEditForm && selectedTask && (
//         <PopupForm
//           task={selectedTask}
//           onSave={updateTaskDetails}
//           onClose={() => setShowEditForm(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default TaskWorkspaceList;

// ============================================================================================================================
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTaskDetails } from "../TaskWorkspace/components/NewTaskDetails/TaskDetails/TaskDetails";
// import type { RootState } from "../../app/store";
// import CreateTask from "../TaskWorkspace/components/CreateTask/CreateTask";
// import PopupForm from "../TaskWorkspace/components/PopupForm/PopupForm";
// import styles from "./TaskWorkspaceList.module.css";

// const STATUS_FILTERS = ["All", "Pending", "In Progress", "Completed"];

// interface Task {
//   id: number;
//   task: string;
//   description: string;
//   priority: string;
//   start_date: string;
//   end_date: string;
//   assignedto_username: string;
//   status: string;
//   outcome: string;
//   last_update_date: string;
//   is_accepted: string;
//   assigned_by: string;
// }

// const priorityColor: Record<string, string> = {
//   high:   "#EF4444",
//   medium: "#F59E0B",
//   low:    "#10B981",
// };

// const statusColor: Record<string, string> = {
//   "in progress": "#2188EF",
//   "In Progress": "#2188EF",
//   pending:       "#FF9C07",
//   Pending:       "#FF9C07",
//   completed:     "#418F11",
//   Completed:     "#418F11",
// };

// const TaskWorkspaceList: React.FC = () => {
//   const dispatch = useDispatch<any>();

//   const [searchQuery,  setSearchQuery]  = useState("");
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
//   const [visibleCount, setVisibleCount] = useState(15);
//   const [showForm,     setShowForm]     = useState(false);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [showEditForm, setShowEditForm] = useState(false);

//   const { data, loading, error } = useSelector(
//     (state: RootState) => state.fetchTaskDetailsData
//   );
//   const token =
//     useSelector((state: RootState) => state.userLoginAuth?.user?.tokens.access) ||
//     localStorage.getItem("token");

//   useEffect(() => {
//     dispatch(fetchTaskDetails() as any);
//   }, [dispatch]);

//   /* ── Filtering ── */
//   const reversedData = [...data].reverse();
//   const statusFiltered =
//     activeFilter === "All"
//       ? reversedData
//       : reversedData.filter((t: any) => t.status === activeFilter);

//   const filteredData = statusFiltered.filter((task: Task) =>
//     [task.task, task.assigned_by, task.assignedto_username].some((f) =>
//       f?.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   /* ── Infinite scroll ── */
//   const sentinelRef = useRef<HTMLDivElement>(null);
//   const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
//     if (entries[0].isIntersecting && visibleCount < filteredData.length) {
//       setVisibleCount(c => c + 15);
//     }
//   }, [visibleCount, filteredData.length]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
//     if (sentinelRef.current) observer.observe(sentinelRef.current);
//     return () => observer.disconnect();
//   }, [handleObserver]);

//   const visibleData = filteredData.slice(0, visibleCount);

//   const toggleRow = (id: number) =>
//     setExpandedRows((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });

//   const updateTaskDetails = (updatedTask: Task) => {
//     fetch(`/api/tasks/${updatedTask.id}/`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ status: updatedTask.status, outcome: updatedTask.outcome }),
//     })
//       .then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); })
//       .then(() => { setShowEditForm(false); dispatch(fetchTaskDetails() as any); })
//       .catch((e) => console.error("Error updating task:", e));
//   };

//   /* ── KPI calculations ── */
//   const totalTasks     = data.length;
//   const completedTasks = data.filter((t: any) => t.status === "Completed" || t.status === "completed").length;
//   const pendingTasks   = data.filter((t: any) => t.status === "Pending" || t.status === "pending").length;
//   const inProgressTasks = data.filter((t: any) => t.status === "In Progress" || t.status === "in progress").length;

//   return (
//     <div className={styles.page}>

//       {/* ── Page header ── */}
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Task Workspace</h1>
//           <p className={styles.pageSubtitle}>Manage and view all task records</p>
//         </div>

//         <div className={styles.headerRight}>
//           {/* Dropdown Filters */}
//           <div className={styles.filtersWrapper}>
//             <div className={styles.dropdownFilter}>
//               <select
//                 className={styles.selectInput}
//                 value={activeFilter}
//                 onChange={(e) => { setActiveFilter(e.target.value); setVisibleCount(15); }}
//               >
//                 {STATUS_FILTERS.map((f) => (
//                   <option key={f} value={f}>
//                     {f === "All" ? "All Status" : f}
//                   </option>
//                 ))}
//               </select>
//               <span className={styles.dropdownIcon}>
//                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
//               </span>
//             </div>

//             {/* Dummy drop-downs for exact visual match */}
//             <div className={styles.dropdownFilter}>
//               <select className={styles.selectInput} defaultValue="All Priorities">
//                 <option value="All Priorities">All Priorities</option>
//               </select>
//               <span className={styles.dropdownIcon}>
//                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
//               </span>
//             </div>

//             <div className={styles.dropdownFilter}>
//               <select className={styles.selectInput} defaultValue="All Time">
//                 <option value="All Time">All Time</option>
//               </select>
//               <span className={styles.dropdownIcon}>
//                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
//               </span>
//             </div>
//           </div>

//           {/* Search (Pill shaped) */}
//           <div className={styles.searchBar}>
//             <MdOutlineSearch className={styles.searchIcon} />
//             <input
//               className={styles.searchInput}
//               placeholder="Search by task, assignee…"
//               value={searchQuery}
//               onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(15); }}
//             />
//             {searchQuery && (
//               <button className={styles.clearBtn} onClick={() => setSearchQuery("")}>✕</button>
//             )}
//           </div>

//           {/* Primary Action Button (Purple Pill) */}
//           {/* Primary Action Button (Rounded Rectangle matching image) */}
//           <button className={styles.primaryActionBtn} onClick={() => setShowForm(true)}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <circle cx="12" cy="12" r="10"></circle>
//               <line x1="12" y1="8" x2="12" y2="16"></line>
//               <line x1="8" y1="12" x2="16" y2="12"></line>
//             </svg>
//             Create Task
//           </button>
//         </div>
//       </div>

//       {/* ── KPI strip — gradient cards ── */}
//       <div className={styles.kpiRow}>

//         <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M9 11l3 3L22 4"/>
//               <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{totalTasks}</div>
//             <div className={styles.kpiLabel}>Total Tasks</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{totalTasks}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiEmerald}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <polyline points="20 6 9 17 4 12"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{completedTasks}</div>
//             <div className={styles.kpiLabel}>Completed</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{completedTasks}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="12" cy="12" r="10"/>
//               <polyline points="12 6 12 12 16 14"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{pendingTasks}</div>
//             <div className={styles.kpiLabel}>Pending</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{pendingTasks}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiBlue}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{inProgressTasks}</div>
//             <div className={styles.kpiLabel}>In Progress</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{inProgressTasks}</div>
//         </div>

//       </div>

//       {/* ── Table card ── */}
//       <div className={styles.tableCard}>

//         {/* Table top bar */}
//         <div className={styles.tableTopBar}>
//           <div className={styles.tableTopLeft}>
//             <div className={styles.tableDot} />
//             <span className={styles.tableTopTitle}>All Tasks</span>
//             <span className={styles.tableTopCount}>{filteredData.length} records</span>
//           </div>
//         </div>

//         {/* Dark gradient header */}
//         <div className={styles.tableHeader}>
//           <div className={styles.thCell} />
//           <div className={styles.thCell}>Assigned By</div>
//           <div className={styles.thCell}>Task</div>
//           <div className={styles.thCell}>Priority</div>
//           <div className={styles.thCell}>Start Date</div>
//           <div className={styles.thCell}>End Date</div>
//           <div className={styles.thCell}>Status</div>
//           <div className={styles.thCell} />
//         </div>

//         {/* Loading skeleton */}
//         {loading && (
//           <div className={styles.stateBox}>
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className={styles.skeletonRow}>
//                 {[1, 2, 3, 4, 5, 6, 7].map((j) => (
//                   <div key={j} className={styles.skeletonCell}
//                     style={{ animationDelay: `${j * 80}ms` }} />
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Error */}
//         {error && !loading && (
//           <div className={styles.stateBox}>
//             <div className={styles.emptyState}>
//               <div className={styles.emptyIconWrap} style={{ background: '#FEE2E2' }}>
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
//                   <circle cx="12" cy="12" r="10"/>
//                   <line x1="12" y1="8"  x2="12"   y2="12"/>
//                   <line x1="12" y1="16" x2="12.01" y2="16"/>
//                 </svg>
//               </div>
//               <p className={styles.emptyTitle}>Failed to load data</p>
//               <p className={styles.emptyText}>Please check your connection and refresh.</p>
//             </div>
//           </div>
//         )}

//         {/* Empty */}
//         {!loading && !error && filteredData.length === 0 && (
//           <div className={styles.stateBox}>
//             <div className={styles.emptyState}>
//               <div className={styles.emptyIconWrap} style={{ background: '#F1F5F9' }}>
//                 <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
//                   <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2.5"/>
//                   <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2.5"/>
//                   <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
//                 </svg>
//               </div>
//               <p className={styles.emptyTitle}>No tasks found</p>
//               <p className={styles.emptyText}>Try adjusting your search or filter.</p>
//             </div>
//           </div>
//         )}

//         {/* Rows */}
//         {!loading && !error && visibleData.map((task: any, idx: number) => (
//           <div
//             key={task.id}
//             className={styles.rowGroup}
//             style={{ animationDelay: `${Math.min(idx, 10) * 35}ms` }}
//           >
//             {/* Main row */}
//             <div className={`${styles.tableRow} ${expandedRows.has(task.id) ? styles.rowExpanded : ""}`}>
//               <button
//                 className={styles.chevronBtn}
//                 onClick={() => toggleRow(task.id)}
//                 aria-label="Expand row"
//               >
//                 <IoIosArrowDropdown
//                   size={20}
//                   className={`${styles.chevron} ${expandedRows.has(task.id) ? styles.chevronOpen : ""}`}
//                 />
//               </button>

//               <div className={styles.tdCell}>
//                 <span className={styles.assignedBy}>{task.assigned_by || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.taskName}>{task.task || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span
//                   className={styles.priorityBadge}
//                   style={{
//                     background: `${priorityColor[task.priority?.toLowerCase()] ?? "#94A3B8"}18`,
//                     color: priorityColor[task.priority?.toLowerCase()] ?? "#94A3B8",
//                     border: `1px solid ${priorityColor[task.priority?.toLowerCase()] ?? "#94A3B8"}40`,
//                   }}
//                 >
//                   {task.priority || "—"}
//                 </span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.dateCell}>{task.start_date || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 <span className={styles.dateCell}>{task.end_date || "—"}</span>
//               </div>
//               <div className={styles.tdCell}>
//                 {task.status ? (
//                   <span
//                     className={styles.statusBadge}
//                     style={{ background: statusColor[task.status] ?? "#94A3B8" }}
//                   >
//                     {task.status}
//                   </span>
//                 ) : (
//                   <span className={styles.empty}>—</span>
//                 )}
//               </div>

//               <button
//                 className={styles.editBtn}
//                 onClick={() => { setSelectedTask(task); setShowEditForm(true); }}
//                 aria-label="Edit task"
//               >
//                 <FaRegEdit size={14} />
//               </button>
//             </div>

//             {/* Expanded detail panel */}
//             {expandedRows.has(task.id) && (
//               <div className={styles.detailPanel}>
//                 <div className={styles.detailPanelInner}>
//                   <div className={styles.detailHeader}>
//                     <div className={styles.detailTitleWrap}>
//                       <div className={styles.detailAvatar}>
//                         {(task.task || "T")[0].toUpperCase()}
//                       </div>
//                       <div>
//                         <div className={styles.detailTitle}>{task.task}</div>
//                         <div className={styles.detailTitleSub}>Task Details</div>
//                       </div>
//                     </div>
//                     {task.status && (
//                       <span
//                         className={styles.detailStatusBadge}
//                         style={{ background: statusColor[task.status] ?? "#94A3B8" }}
//                       >
//                         {task.status}
//                       </span>
//                     )}
//                   </div>
//                   <div className={styles.detailGrid}>
//                     {[
//                       { label: "Assigned To",     value: task.assignedto_username, icon: "👤" },
//                       { label: "Assigned By",     value: task.assigned_by,         icon: "📋" },
//                       { label: "Description",     value: task.description,         icon: "📝" },
//                       { label: "Priority",        value: task.priority,            icon: "🎯" },
//                       { label: "Start Date",      value: task.start_date,          icon: "📅" },
//                       { label: "End Date",        value: task.end_date,            icon: "🗓️" },
//                       { label: "Outcome",         value: task.outcome,             icon: "✅" },
//                       { label: "Last Updated",    value: task.last_update_date,    icon: "🕐" },
//                       { label: "Accepted",        value: task.is_accepted,         icon: "✓" },
//                     ].map(({ label, value, icon }) => (
//                       <div key={label} className={styles.detailItem}>
//                         <span className={styles.detailLabel}>
//                           <span className={styles.detailIcon}>{icon}</span>
//                           {label}
//                         </span>
//                         <span className={styles.detailValue}>{value || "—"}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Infinite scroll sentinel */}
//         <div ref={sentinelRef} className={styles.sentinel} />

//         {/* Load more fallback */}
//         {!loading && visibleCount < filteredData.length && (
//           <div className={styles.loadMoreWrap}>
//             <button
//               className={styles.loadMoreBtn}
//               onClick={() => setVisibleCount((c) => c + 15)}
//             >
//               Load more · {filteredData.length - visibleCount} remaining
//             </button>
//           </div>
//         )}

//       </div>

//       {/* Modals */}
//       {showForm && <CreateTask onClose={() => setShowForm(false)} />}
//       {showEditForm && selectedTask && (
//         <PopupForm
//           task={selectedTask}
//           onSave={updateTaskDetails}
//           onClose={() => setShowEditForm(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default TaskWorkspaceList;

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTaskDetails } from "../TaskWorkspace/components/NewTaskDetails/TaskDetails/TaskDetails";
// import type { RootState } from "../../app/store";
// import CreateTask from "../TaskWorkspace/components/CreateTask/CreateTask";
// import PopupForm from "../TaskWorkspace/components/PopupForm/PopupForm";
// import styles from "./TaskWorkspaceList.module.css";

// const STATUS_FILTERS   = ["All", "Pending", "In Progress", "Completed"];
// const PRIORITY_FILTERS = ["All", "High", "Medium", "Low"];

// interface Task {
//   id: number;
//   task: string;
//   description: string;
//   priority: string;
//   start_date: string;
//   end_date: string;
//   assignedto_username: string;
//   status: string;
//   outcome: string;
//   last_update_date: string;
//   is_accepted: string;
//   assigned_by: string;
// }

// const priorityColor: Record<string, string> = {
//   high:   "#EF4444",
//   medium: "#F59E0B",
//   low:    "#10B981",
// };

// const statusColor: Record<string, string> = {
//   "in progress": "#2188EF",
//   "In Progress": "#2188EF",
//   pending:       "#FF9C07",
//   Pending:       "#FF9C07",
//   completed:     "#418F11",
//   Completed:     "#418F11",
// };

// // ── Time Period Options ──────────────────────────────────────
// const TIME_PERIODS = [
//   { label: "All Time",      value: "all" },
//   { label: "Last 7 Days",   value: "7days" },
//   { label: "Last 15 Days",  value: "15days" },
//   { label: "This Month",    value: "this_month" },
//   { label: "Last 3 Months", value: "3months" },
//   { label: "Q1 (Apr–Jun)",  value: "q1" },
//   { label: "Q2 (Jul–Sep)",  value: "q2" },
//   { label: "Q3 (Oct–Dec)",  value: "q3" },
//   { label: "Q4 (Jan–Mar)",  value: "q4" },
//   { label: "This FY",       value: "this_fy" },
// ];

// // ── Date Filter Helper (Indian FY: April to March) ───────────
// const isInTimePeriod = (dateString: string, period: string): boolean => {
//   if (!dateString || period === "all") return true;

//   const today     = new Date();
//   const checkDate = new Date(dateString);
//   today.setHours(0, 0, 0, 0);
//   checkDate.setHours(0, 0, 0, 0);

//   const diffDays     = Math.floor(
//     (today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24)
//   );
//   const currentMonth = today.getMonth();
//   const currentYear  = today.getFullYear();
//   const fyYear       = currentMonth >= 3 ? currentYear : currentYear - 1;

//   switch (period) {
//     case "this_fy":
//       return (
//         checkDate >= new Date(fyYear, 3, 1) &&
//         checkDate <= new Date(fyYear + 1, 2, 31)
//       );
//     case "7days":
//       return diffDays >= 0 && diffDays <= 7;
//     case "15days":
//       return diffDays >= 0 && diffDays <= 15;
//     case "this_month":
//       return (
//         checkDate.getMonth()    === today.getMonth() &&
//         checkDate.getFullYear() === today.getFullYear()
//       );
//     case "3months": {
//       const threeMonthsAgo = new Date(today);
//       threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
//       return checkDate >= threeMonthsAgo && checkDate <= today;
//     }
//     case "q1":
//       return (
//         checkDate >= new Date(fyYear, 3, 1) &&
//         checkDate <= new Date(fyYear, 5, 30)
//       );
//     case "q2":
//       return (
//         checkDate >= new Date(fyYear, 6, 1) &&
//         checkDate <= new Date(fyYear, 8, 30)
//       );
//     case "q3":
//       return (
//         checkDate >= new Date(fyYear, 9, 1) &&
//         checkDate <= new Date(fyYear, 11, 31)
//       );
//     case "q4":
//       return (
//         checkDate >= new Date(fyYear + 1, 0, 1) &&
//         checkDate <= new Date(fyYear + 1, 2, 31)
//       );
//     default:
//       return true;
//   }
// };

// const TaskWorkspaceList: React.FC = () => {
//   const dispatch = useDispatch<any>();

//   const [searchQuery,        setSearchQuery]        = useState("");
//   const [activeFilter,       setActiveFilter]       = useState("All");
//   const [activePriority,     setActivePriority]     = useState("All");
//   const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
//   const [expandedRows,       setExpandedRows]       = useState<Set<number>>(new Set());
//   const [visibleCount,       setVisibleCount]       = useState(15);
//   const [showForm,           setShowForm]           = useState(false);
//   const [selectedTask,       setSelectedTask]       = useState<Task | null>(null);
//   const [showEditForm,       setShowEditForm]       = useState(false);

//   const { data, loading, error } = useSelector(
//     (state: RootState) => state.fetchTaskDetailsData
//   );
//   const token =
//     useSelector(
//       (state: RootState) => state.userLoginAuth?.user?.tokens.access
//     ) || localStorage.getItem("token");

//   useEffect(() => {
//     dispatch(fetchTaskDetails() as any);
//   }, [dispatch]);

//   // ── Safe data ────────────────────────────────────────────
//   const safeData = Array.isArray(data) ? data : [];

//   // ── Filtering ────────────────────────────────────────────
//   const reversedData = [...safeData].reverse();

//   const filteredData = reversedData
//     // 1. Status filter
//     .filter((task: Task) =>
//       activeFilter === "All"
//         ? true
//         : task.status === activeFilter
//     )
//     // 2. Priority filter
//     .filter((task: Task) =>
//       activePriority === "All"
//         ? true
//         : task.priority?.toLowerCase() === activePriority.toLowerCase()
//     )
//     // 3. Search filter
//     .filter((task: Task) =>
//       [task.task, task.assigned_by, task.assignedto_username].some((f) =>
//         f?.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     )
//     // 4. Time period filter
//     .filter((task: Task) =>
//       isInTimePeriod(task.start_date, selectedTimePeriod)
//     );

//   // ── Infinite scroll ──────────────────────────────────────
//   const sentinelRef    = useRef<HTMLDivElement>(null);
//   const handleObserver = useCallback(
//     (entries: IntersectionObserverEntry[]) => {
//       if (entries[0].isIntersecting && visibleCount < filteredData.length) {
//         setVisibleCount((c) => c + 15);
//       }
//     },
//     [visibleCount, filteredData.length]
//   );

//   useEffect(() => {
//     const observer = new IntersectionObserver(handleObserver, {
//       threshold: 0.1,
//     });
//     if (sentinelRef.current) observer.observe(sentinelRef.current);
//     return () => observer.disconnect();
//   }, [handleObserver]);

//   const visibleData = filteredData.slice(0, visibleCount);

//   const toggleRow = (id: number) =>
//     setExpandedRows((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });

//   const updateTaskDetails = (updatedTask: Task) => {
//     fetch(`/api/tasks/${updatedTask.id}/`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization:  `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         status:  updatedTask.status,
//         outcome: updatedTask.outcome,
//       }),
//     })
//       .then((r) => {
//         if (!r.ok) throw new Error("Failed");
//         return r.json();
//       })
//       .then(() => {
//         setShowEditForm(false);
//         dispatch(fetchTaskDetails() as any);
//       })
//       .catch((e) => console.error("Error updating task:", e));
//   };

//   // ── KPI calculations (always from safeData, unaffected by filters) ──
//   const totalTasks      = safeData.length;
//   const completedTasks  = safeData.filter(
//     (t: any) => t.status === "Completed" || t.status === "completed"
//   ).length;
//   const pendingTasks    = safeData.filter(
//     (t: any) => t.status === "Pending" || t.status === "pending"
//   ).length;
//   const inProgressTasks = safeData.filter(
//     (t: any) => t.status === "In Progress" || t.status === "in progress"
//   ).length;

//   return (
//     <div className={styles.page}>

//       {/* ── Page header ── */}
//       <div className={styles.pageHeader}>
//         <div>
//           <h1 className={styles.pageTitle}>Task Workspace</h1>
//           <p className={styles.pageSubtitle}>
//             Manage and view all task records
//           </p>
//         </div>

//         <div className={styles.headerRight}>

//           {/* ── Dropdown Filters ── */}
//           <div className={styles.filtersWrapper}>

//             {/* 1. Status filter */}
//             <div className={styles.dropdownFilter}>
//               <select
//                 className={styles.selectInput}
//                 value={activeFilter}
//                 onChange={(e) => {
//                   setActiveFilter(e.target.value);
//                   setVisibleCount(15);
//                 }}
//               >
//                 {STATUS_FILTERS.map((f) => (
//                   <option key={f} value={f}>
//                     {f === "All" ? "All Status" : f}
//                   </option>
//                 ))}
//               </select>
//               <span className={styles.dropdownIcon}>
//                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <polyline points="6 9 12 15 18 9" />
//                 </svg>
//               </span>
//             </div>

//             {/* 2. Priority filter — NOW WORKING ── */}
//             <div className={styles.dropdownFilter}>
//               <select
//                 className={styles.selectInput}
//                 value={activePriority}
//                 onChange={(e) => {
//                   setActivePriority(e.target.value);
//                   setVisibleCount(15);
//                 }}
//               >
//                 {PRIORITY_FILTERS.map((p) => (
//                   <option key={p} value={p}>
//                     {p === "All" ? "All Priorities" : p}
//                   </option>
//                 ))}
//               </select>
//               <span className={styles.dropdownIcon}>
//                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <polyline points="6 9 12 15 18 9" />
//                 </svg>
//               </span>
//             </div>

//             {/* 3. Time Period filter — NOW WORKING ── */}
//             <div className={styles.dropdownFilter}>
//               <select
//                 className={styles.selectInput}
//                 value={selectedTimePeriod}
//                 onChange={(e) => {
//                   setSelectedTimePeriod(e.target.value);
//                   setVisibleCount(15);
//                 }}
//               >
//                 {TIME_PERIODS.map((t) => (
//                   <option key={t.value} value={t.value}>
//                     {t.label}
//                   </option>
//                 ))}
//               </select>
//               <span className={styles.dropdownIcon}>
//                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <polyline points="6 9 12 15 18 9" />
//                 </svg>
//               </span>
//             </div>

//           </div>

//           {/* Search */}
//           <div className={styles.searchBar}>
//             <MdOutlineSearch className={styles.searchIcon} />
//             <input
//               className={styles.searchInput}
//               placeholder="Search by task, assignee…"
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 setVisibleCount(15);
//               }}
//             />
//             {searchQuery && (
//               <button
//                 className={styles.clearBtn}
//                 onClick={() => {
//                   setSearchQuery("");
//                   setVisibleCount(15);
//                 }}
//               >
//                 ✕
//               </button>
//             )}
//           </div>

//           {/* Create Task button */}
//           <button
//             className={styles.primaryActionBtn}
//             onClick={() => setShowForm(true)}
//           >
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <circle cx="12" cy="12" r="10" />
//               <line x1="12" y1="8"  x2="12" y2="16" />
//               <line x1="8"  y1="12" x2="16" y2="12" />
//             </svg>
//             Create Task
//           </button>
//         </div>
//       </div>

//       {/* ── KPI strip ── */}
//       <div className={styles.kpiRow}>

//         <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M9 11l3 3L22 4"/>
//               <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{totalTasks}</div>
//             <div className={styles.kpiLabel}>Total Tasks</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{totalTasks}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiEmerald}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <polyline points="20 6 9 17 4 12"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{completedTasks}</div>
//             <div className={styles.kpiLabel}>Completed</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{completedTasks}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="12" cy="12" r="10"/>
//               <polyline points="12 6 12 12 16 14"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{pendingTasks}</div>
//             <div className={styles.kpiLabel}>Pending</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{pendingTasks}</div>
//         </div>

//         <div className={`${styles.kpiCard} ${styles.kpiBlue}`}>
//           <div className={styles.kpiIconWrap}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
//             </svg>
//           </div>
//           <div className={styles.kpiContent}>
//             <div className={styles.kpiValue}>{inProgressTasks}</div>
//             <div className={styles.kpiLabel}>In Progress</div>
//           </div>
//           <div className={styles.kpiBgNumber}>{inProgressTasks}</div>
//         </div>

//       </div>

//       {/* ── Table card ── */}
//       <div className={styles.tableCard}>

//         {/* Table top bar */}
//         <div className={styles.tableTopBar}>
//           <div className={styles.tableTopLeft}>
//             <div className={styles.tableDot} />
//             <span className={styles.tableTopTitle}>All Tasks</span>
//             <span className={styles.tableTopCount}>
//               {filteredData.length} records
//             </span>
//           </div>
//         </div>

//         {/* Header */}
//         <div className={styles.tableHeader}>
//           <div className={styles.thCell} />
//           <div className={styles.thCell}>Assigned By</div>
//           <div className={styles.thCell}>Task</div>
//           <div className={styles.thCell}>Priority</div>
//           <div className={styles.thCell}>Start Date</div>
//           <div className={styles.thCell}>End Date</div>
//           <div className={styles.thCell}>Status</div>
//           <div className={styles.thCell} />
//         </div>

//         {/* Loading skeleton */}
//         {loading && (
//           <div className={styles.stateBox}>
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className={styles.skeletonRow}>
//                 {[1, 2, 3, 4, 5, 6, 7].map((j) => (
//                   <div
//                     key={j}
//                     className={styles.skeletonCell}
//                     style={{ animationDelay: `${j * 80}ms` }}
//                   />
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Error */}
//         {error && !loading && (
//           <div className={styles.stateBox}>
//             <div className={styles.emptyState}>
//               <div
//                 className={styles.emptyIconWrap}
//                 style={{ background: "#FEE2E2" }}
//               >
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
//                   <circle cx="12" cy="12" r="10"/>
//                   <line x1="12" y1="8"  x2="12"    y2="12"/>
//                   <line x1="12" y1="16" x2="12.01" y2="16"/>
//                 </svg>
//               </div>
//               <p className={styles.emptyTitle}>Failed to load data</p>
//               <p className={styles.emptyText}>
//                 Please check your connection and refresh.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Empty */}
//         {!loading && !error && filteredData.length === 0 && (
//           <div className={styles.stateBox}>
//             <div className={styles.emptyState}>
//               <div
//                 className={styles.emptyIconWrap}
//                 style={{ background: "#F1F5F9" }}
//               >
//                 <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
//                   <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2.5"/>
//                   <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2.5"/>
//                   <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
//                 </svg>
//               </div>
//               <p className={styles.emptyTitle}>No tasks found</p>
//               <p className={styles.emptyText}>
//                 Try adjusting your search or filter.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Rows */}
//         {!loading &&
//           !error &&
//           visibleData.map((task: any, idx: number) => (
//             <div
//               key={task.id}
//               className={styles.rowGroup}
//               style={{ animationDelay: `${Math.min(idx, 10) * 35}ms` }}
//             >
//               <div
//                 className={`${styles.tableRow} ${
//                   expandedRows.has(task.id) ? styles.rowExpanded : ""
//                 }`}
//               >
//                 <button
//                   className={styles.chevronBtn}
//                   onClick={() => toggleRow(task.id)}
//                   aria-label="Expand row"
//                 >
//                   <IoIosArrowDropdown
//                     size={20}
//                     className={`${styles.chevron} ${
//                       expandedRows.has(task.id) ? styles.chevronOpen : ""
//                     }`}
//                   />
//                 </button>

//                 <div className={styles.tdCell}>
//                   <span className={styles.assignedBy}>
//                     {task.assigned_by || "—"}
//                   </span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span className={styles.taskName}>{task.task || "—"}</span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span
//                     className={styles.priorityBadge}
//                     style={{
//                       background: `${
//                         priorityColor[task.priority?.toLowerCase()] ?? "#94A3B8"
//                       }18`,
//                       color:
//                         priorityColor[task.priority?.toLowerCase()] ??
//                         "#94A3B8",
//                       border: `1px solid ${
//                         priorityColor[task.priority?.toLowerCase()] ?? "#94A3B8"
//                       }40`,
//                     }}
//                   >
//                     {task.priority || "—"}
//                   </span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span className={styles.dateCell}>
//                     {task.start_date || "—"}
//                   </span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   <span className={styles.dateCell}>
//                     {task.end_date || "—"}
//                   </span>
//                 </div>
//                 <div className={styles.tdCell}>
//                   {task.status ? (
//                     <span
//                       className={styles.statusBadge}
//                       style={{
//                         background: statusColor[task.status] ?? "#94A3B8",
//                       }}
//                     >
//                       {task.status}
//                     </span>
//                   ) : (
//                     <span className={styles.empty}>—</span>
//                   )}
//                 </div>

//                 <button
//                   className={styles.editBtn}
//                   onClick={() => {
//                     setSelectedTask(task);
//                     setShowEditForm(true);
//                   }}
//                   aria-label="Edit task"
//                 >
//                   <FaRegEdit size={14} />
//                 </button>
//               </div>

//               {/* Expanded detail panel */}
//               {expandedRows.has(task.id) && (
//                 <div className={styles.detailPanel}>
//                   <div className={styles.detailPanelInner}>
//                     <div className={styles.detailHeader}>
//                       <div className={styles.detailTitleWrap}>
//                         <div className={styles.detailAvatar}>
//                           {(task.task || "T")[0].toUpperCase()}
//                         </div>
//                         <div>
//                           <div className={styles.detailTitle}>{task.task}</div>
//                           <div className={styles.detailTitleSub}>
//                             Task Details
//                           </div>
//                         </div>
//                       </div>
//                       {task.status && (
//                         <span
//                           className={styles.detailStatusBadge}
//                           style={{
//                             background:
//                               statusColor[task.status] ?? "#94A3B8",
//                           }}
//                         >
//                           {task.status}
//                         </span>
//                       )}
//                     </div>

//                     <div className={styles.detailGrid}>
//                       {[
//                         { label: "Assigned To",  value: task.assignedto_username, icon: "👤" },
//                         { label: "Assigned By",  value: task.assigned_by,         icon: "📋" },
//                         { label: "Description",  value: task.description,         icon: "📝" },
//                         { label: "Priority",     value: task.priority,            icon: "🎯" },
//                         { label: "Start Date",   value: task.start_date,          icon: "📅" },
//                         { label: "End Date",     value: task.end_date,            icon: "🗓️" },
//                         { label: "Outcome",      value: task.outcome,             icon: "✅" },
//                         { label: "Last Updated", value: task.last_update_date,    icon: "🕐" },
//                         { label: "Accepted",     value: task.is_accepted,         icon: "✓" },
//                       ].map(({ label, value, icon }) => (
//                         <div key={label} className={styles.detailItem}>
//                           <span className={styles.detailLabel}>
//                             <span className={styles.detailIcon}>{icon}</span>
//                             {label}
//                           </span>
//                           <span className={styles.detailValue}>
//                             {value || "—"}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}

//         {/* Infinite scroll sentinel */}
//         <div ref={sentinelRef} className={styles.sentinel} />

//         {/* Load more fallback */}
//         {!loading && visibleCount < filteredData.length && (
//           <div className={styles.loadMoreWrap}>
//             <button
//               className={styles.loadMoreBtn}
//               onClick={() => setVisibleCount((c) => c + 15)}
//             >
//               Load more · {filteredData.length - visibleCount} remaining
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       {showForm && <CreateTask onClose={() => setShowForm(false)} />}
//       {showEditForm && selectedTask && (
//         <PopupForm
//           task={selectedTask}
//           onSave={updateTaskDetails}
//           onClose={() => setShowEditForm(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default TaskWorkspaceList;



import React, { useEffect, useState, useRef, useCallback } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaskDetails } from "../TaskWorkspace/components/NewTaskDetails/TaskDetails/TaskDetails";
import type { RootState } from "../../app/store";
import CreateTask from "../TaskWorkspace/components/CreateTask/CreateTask";
import PopupForm from "../TaskWorkspace/components/PopupForm/PopupForm";

const STATUS_FILTERS   = ["All", "Pending", "In Progress", "Completed"];
const PRIORITY_FILTERS = ["All", "High", "Medium", "Low"];

interface Task {
  id: number;
  task: string;
  description: string;
  priority: string;
  start_date: string;
  end_date: string;
  assignedto_username: string;
  status: string;
  outcome: string;
  last_update_date: string;
  is_accepted: string;
  assigned_by: string;
}

const priorityColor: Record<string, string> = {
  high:   "#EF4444",
  medium: "#F59E0B",
  low:    "#10B981",
};

const statusColor: Record<string, string> = {
  "in progress": "#2188EF",
  "In Progress": "#2188EF",
  pending:       "#FF9C07",
  Pending:       "#FF9C07",
  completed:     "#418F11",
  Completed:     "#418F11",
};

const TIME_PERIODS = [
  { label: "All Time",      value: "all" },
  { label: "Last 7 Days",   value: "7days" },
  { label: "Last 15 Days",  value: "15days" },
  { label: "This Month",    value: "this_month" },
  { label: "Last 3 Months", value: "3months" },
  { label: "Q1 (Apr–Jun)",  value: "q1" },
  { label: "Q2 (Jul–Sep)",  value: "q2" },
  { label: "Q3 (Oct–Dec)",  value: "q3" },
  { label: "Q4 (Jan–Mar)",  value: "q4" },
  { label: "This FY",       value: "this_fy" },
];

const isInTimePeriod = (dateString: string, period: string): boolean => {
  if (!dateString || period === "all") return true;
  const today     = new Date();
  const checkDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);
  const diffDays     = Math.floor((today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentMonth = today.getMonth();
  const currentYear  = today.getFullYear();
  const fyYear       = currentMonth >= 3 ? currentYear : currentYear - 1;
  switch (period) {
    case "this_fy":    return checkDate >= new Date(fyYear, 3, 1)     && checkDate <= new Date(fyYear + 1, 2, 31);
    case "7days":      return diffDays >= 0 && diffDays <= 7;
    case "15days":     return diffDays >= 0 && diffDays <= 15;
    case "this_month": return checkDate.getMonth() === today.getMonth() && checkDate.getFullYear() === today.getFullYear();
    case "3months": {
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return checkDate >= threeMonthsAgo && checkDate <= today;
    }
    case "q1": return checkDate >= new Date(fyYear, 3, 1)     && checkDate <= new Date(fyYear, 5, 30);
    case "q2": return checkDate >= new Date(fyYear, 6, 1)     && checkDate <= new Date(fyYear, 8, 30);
    case "q3": return checkDate >= new Date(fyYear, 9, 1)     && checkDate <= new Date(fyYear, 11, 31);
    case "q4": return checkDate >= new Date(fyYear + 1, 0, 1) && checkDate <= new Date(fyYear + 1, 2, 31);
    default:   return true;
  }
};

/* ── Shared select class ── */
const filterSelectClass =
  "h-10 px-4 pr-9 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all cursor-pointer shadow-sm appearance-none";

const GRID_COLS          = "40px 1.2fr 1.8fr 0.8fr 1fr 1fr 1fr 48px";
const GRID_COLS_SKELETON = "40px 1.2fr 1.8fr 0.8fr 1fr 1fr 1fr 48px";

const TaskWorkspaceList: React.FC = () => {
  const dispatch = useDispatch<any>();

  const [searchQuery,        setSearchQuery]        = useState("");
  const [activeFilter,       setActiveFilter]       = useState("All");
  const [activePriority,     setActivePriority]     = useState("All");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
  const [expandedRows,       setExpandedRows]       = useState<Set<number>>(new Set());
  const [visibleCount,       setVisibleCount]       = useState(15);
  const [showForm,           setShowForm]           = useState(false);
  const [selectedTask,       setSelectedTask]       = useState<Task | null>(null);
  const [showEditForm,       setShowEditForm]       = useState(false);

  const { data, loading, error } = useSelector(
    (state: RootState) => state.fetchTaskDetailsData
  );
  const token =
    useSelector((state: RootState) => state.userLoginAuth?.user?.tokens.access) ||
    localStorage.getItem("token");

  useEffect(() => {
    dispatch(fetchTaskDetails() as any);
  }, [dispatch]);

  const safeData = Array.isArray(data) ? data : [];

  const reversedData = [...safeData].reverse();
  const filteredData = reversedData
    .filter((task: Task) => activeFilter === "All" ? true : task.status === activeFilter)
    .filter((task: Task) => activePriority === "All" ? true : task.priority?.toLowerCase() === activePriority.toLowerCase())
    .filter((task: Task) => [task.task, task.assigned_by, task.assignedto_username].some((f) => f?.toLowerCase().includes(searchQuery.toLowerCase())))
    .filter((task: Task) => isInTimePeriod(task.start_date, selectedTimePeriod));

  /* ── Infinite scroll ── */
  const sentinelRef    = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && visibleCount < filteredData.length)
      setVisibleCount((c) => c + 15);
  }, [visibleCount, filteredData.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const visibleData = filteredData.slice(0, visibleCount);

  const toggleRow = (id: number) =>
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const updateTaskDetails = (updatedTask: Task) => {
    fetch(`/api/tasks/${updatedTask.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: updatedTask.status, outcome: updatedTask.outcome }),
    })
      .then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then(() => { setShowEditForm(false); dispatch(fetchTaskDetails() as any); })
      .catch((e) => console.error("Error updating task:", e));
  };

  /* ── KPI calculations ── */
  const totalTasks      = safeData.length;
  const completedTasks  = safeData.filter((t: any) => t.status === "Completed" || t.status === "completed").length;
  const pendingTasks    = safeData.filter((t: any) => t.status === "Pending"   || t.status === "pending").length;
  const inProgressTasks = safeData.filter((t: any) => t.status === "In Progress" || t.status === "in progress").length;

  const kpiCards = [
    { label: "Total Tasks",  value: totalTasks,      gradient: "from-indigo-600 to-indigo-500" },
    { label: "Completed",    value: completedTasks,  gradient: "from-emerald-600 to-emerald-400" },
    { label: "Pending",      value: pendingTasks,    gradient: "from-amber-500 to-yellow-400" },
    { label: "In Progress",  value: inProgressTasks, gradient: "from-blue-600 to-blue-400" },
  ];

  return (
    <div className="w-full min-h-full bg-slate-100 p-7 pb-28 flex flex-col gap-6 overflow-y-auto overflow-x-hidden">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-violet-700 m-0 tracking-tight leading-tight">
            Task Workspace
          </h1>
          <p className="text-[13px] text-violet-400 mt-1 m-0 font-normal">
            Manage and view all task records
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter */}
          <select
            className={filterSelectClass}
            value={activeFilter}
            onChange={(e) => { setActiveFilter(e.target.value); setVisibleCount(15); }}
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f} value={f}>{f === "All" ? "All Status" : f}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            className={filterSelectClass}
            value={activePriority}
            onChange={(e) => { setActivePriority(e.target.value); setVisibleCount(15); }}
          >
            {PRIORITY_FILTERS.map((p) => (
              <option key={p} value={p}>{p === "All" ? "All Priorities" : p}</option>
            ))}
          </select>

          {/* Time Period Filter */}
          <select
            className={filterSelectClass}
            value={selectedTimePeriod}
            onChange={(e) => { setSelectedTimePeriod(e.target.value); setVisibleCount(15); }}
          >
            {TIME_PERIODS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 h-10 w-64 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all">
            <MdOutlineSearch className="text-slate-400 text-lg shrink-0" />
            <input
              className="border-none outline-none bg-transparent text-sm text-slate-800 w-full placeholder:text-slate-300"
              placeholder="Search by task, assignee…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(15); }}
            />
            {searchQuery && (
              <button
                className="text-slate-400 hover:text-indigo-500 text-xs shrink-0 transition-colors"
                onClick={() => { setSearchQuery(""); setVisibleCount(15); }}
              >✕</button>
            )}
          </div>

          {/* Create Task */}
          <button
            className="flex items-center gap-2 h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all whitespace-nowrap border-none cursor-pointer"
            onClick={() => setShowForm(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Create Task
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, gradient }) => (
          <div
            key={label}
            className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-default overflow-hidden relative`}
          >
            <div className="flex-1 min-w-0">
              <div className="text-[26px] font-extrabold text-white tracking-tight leading-none">{value}</div>
              <div className="text-[12px] font-medium text-white/75 mt-1 whitespace-nowrap">{label}</div>
            </div>
            <span className="absolute right-3 bottom-[-8px] text-[52px] font-extrabold text-white/10 pointer-events-none select-none leading-none">{value}</span>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md">

        {/* Table top bar */}
        <div className="flex items-center gap-2 px-5 pt-4 pb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.2)] animate-pulse" />
          <span className="text-sm font-bold text-slate-800">All Tasks</span>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {filteredData.length} records
          </span>
        </div>

        {/* Table Header */}
        <div
          className="grid gap-3 px-4 py-3 mx-3 mb-1 rounded-xl bg-gradient-to-r from-indigo-700 to-blue-600 text-[10.5px] font-bold uppercase tracking-widest text-white/90"
          style={{ gridTemplateColumns: GRID_COLS }}
        >
          <span></span>
          <span>Assigned By</span>
          <span>Task</span>
          <span>Priority</span>
          <span>Start Date</span>
          <span>End Date</span>
          <span>Status</span>
          <span></span>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="p-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="grid gap-3 px-4 py-4 border-b border-slate-100 items-center animate-pulse"
                style={{ gridTemplateColumns: GRID_COLS_SKELETON }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                  <div key={j} className="h-3.5 bg-slate-200 rounded-md" />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8"  x2="12"    y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-600 m-0">Failed to load data</p>
            <p className="text-xs text-slate-400 m-0">Please check your connection and refresh.</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredData.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2.5"/>
                <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2.5"/>
                <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-600 m-0">No tasks found</p>
            <p className="text-xs text-slate-400 m-0">Try adjusting your search or filter.</p>
          </div>
        )}

        {/* Data Rows */}
        {!loading && !error && visibleData.map((task: any) => (
          <div
            key={task.id}
            className="border-b border-slate-100 last:border-none"
            style={{ borderLeft: expandedRows.has(task.id) ? '4px solid #6366f1' : '4px solid transparent' }}
          >
            {/* Main Row */}
            <div
              className={`grid gap-3 px-4 items-center h-14 transition-all duration-150 cursor-default ${expandedRows.has(task.id) ? 'bg-indigo-50/60' : 'bg-white hover:bg-slate-50'}`}
              style={{ gridTemplateColumns: GRID_COLS }}
            >
              <button
                className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-indigo-100 transition-colors"
                onClick={() => toggleRow(task.id)}
                aria-label="Expand row"
              >
                <IoIosArrowDropdown
                  size={20}
                  className={`transition-all duration-200 ${expandedRows.has(task.id) ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`}
                />
              </button>

              {/* Assigned By */}
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 rounded-full text-[11px] font-bold border border-orange-200 whitespace-nowrap">
                  {task.assigned_by || "—"}
                </span>
              </div>

              {/* Task name */}
              <div className="text-sm font-bold text-slate-900 truncate">{task.task || "—"}</div>

              {/* Priority */}
              <div>
                {task.priority ? (
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap capitalize"
                    style={{
                      background: `${priorityColor[task.priority?.toLowerCase()] ?? "#94A3B8"}18`,
                      color: priorityColor[task.priority?.toLowerCase()] ?? "#94A3B8",
                      border: `1px solid ${priorityColor[task.priority?.toLowerCase()] ?? "#94A3B8"}40`,
                    }}
                  >
                    {task.priority}
                  </span>
                ) : <span className="text-slate-300 text-sm">—</span>}
              </div>

              {/* Start Date */}
              <div>
                <span className="font-mono text-[11.5px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                  {task.start_date || "—"}
                </span>
              </div>

              {/* End Date */}
              <div>
                <span className="font-mono text-[11.5px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                  {task.end_date || "—"}
                </span>
              </div>

              {/* Status */}
              <div>
                {task.status ? (
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white whitespace-nowrap capitalize shadow-sm"
                    style={{ background: statusColor[task.status] ?? "#94A3B8" }}
                  >
                    {task.status}
                  </span>
                ) : <span className="text-slate-300 text-sm">—</span>}
              </div>

              {/* Edit */}
              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:scale-110 transition-all"
                onClick={() => { setSelectedTask(task); setShowEditForm(true); }}
                aria-label="Edit task"
              >
                <FaRegEdit size={14} />
              </button>
            </div>

            {/* Expanded Detail Panel */}
            {expandedRows.has(task.id) && (
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 border-t border-slate-200 w-full">
                <div className="px-14 py-5 pb-8">
                  {/* Mini header */}
                  <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-base font-extrabold flex items-center justify-center shadow-md shrink-0">
                        {(task.task || "T")[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 leading-tight">{task.task}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Task Details</div>
                      </div>
                    </div>
                    {task.status && (
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-sm capitalize"
                        style={{ background: statusColor[task.status] ?? "#94A3B8" }}
                      >
                        {task.status}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
                    {[
                      { label: "Assigned To",  value: task.assignedto_username, icon: "👤" },
                      { label: "Assigned By",  value: task.assigned_by,         icon: "📋" },
                      { label: "Description",  value: task.description,         icon: "📝" },
                      { label: "Priority",     value: task.priority,            icon: "🎯" },
                      { label: "Start Date",   value: task.start_date,          icon: "📅" },
                      { label: "End Date",     value: task.end_date,            icon: "🗓️" },
                      { label: "Outcome",      value: task.outcome,             icon: "✅" },
                      { label: "Last Updated", value: task.last_update_date,    icon: "🕐" },
                      { label: "Accepted",     value: task.is_accepted,         icon: "✓" },
                    ].map(({ label, value, icon }) => (
                      <div
                        key={label}
                        className="flex flex-col gap-1 bg-white/70 border border-slate-200 rounded-xl px-3 py-2.5 hover:bg-white hover:shadow-sm transition-all"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <span className="text-[11px]">{icon}</span>
                          {label}
                        </span>
                        <span className="text-sm font-semibold text-slate-700 truncate">{value || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Sentinel — infinite scroll trigger */}
        <div ref={sentinelRef} className="h-px w-full" />

        {/* Load more fallback */}
        {!loading && visibleCount < filteredData.length && (
          <div className="flex justify-center p-5 border-t border-slate-100">
            <button
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all border-none cursor-pointer"
              onClick={() => setVisibleCount((c) => c + 15)}
            >
              Load more · {filteredData.length - visibleCount} remaining
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && <CreateTask onClose={() => setShowForm(false)} />}
      {showEditForm && selectedTask && (
        <PopupForm task={selectedTask} onSave={updateTaskDetails} onClose={() => setShowEditForm(false)} />
      )}
    </div>
  );
};

export default TaskWorkspaceList;