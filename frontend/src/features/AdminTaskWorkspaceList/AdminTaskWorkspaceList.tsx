// import React, { useEffect, useState } from "react";
// import Navbar from "../UserDashboard/components/navbar/navbar";
// import UserSidebar from "../UserHome/components/UserSidebar/userSidebar";
// import styles from "./AdminTaskWorkspaceList.module.css";
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
// import { clearResponse, deleteAdminTaskWorkspaceTableData, taskAdminFormData } from "./Slice/AdminTaskWorkspaceListSlice";
// import { MdOutlineDelete } from "react-icons/md";

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

// const AdminTaskWorkspaceList: React.FC = () => {
//     const dispatch = useDispatch();

//     const { taskdata, loading, error } = useSelector((state: RootState) => state.fetchAdminTaskData);
//     const { response } = useSelector((state: RootState) => state.deleteAdminTaskWorkspaceData);
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [activeItem, setActiveItem] = useState<string>('All');  // Set 'All' as the default
//     const [showForm, setShowForm] = useState(false);
//     const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const token = useSelector((state: RootState) => state.userLoginAuth?.user?.tokens.access) || localStorage.getItem('token');
//     const [searchQuery, setSearchQuery] = useState<string>("");
//     console.log(taskdata)

//     useEffect(() => {
//         dispatch(taskAdminFormData() as any);
//     }, [dispatch,response]);

//    useEffect(() => {
//         if (response?.message === "Deleted successfully") {
//             alert("Task Deleted successfully");
//             dispatch(clearResponse())

//         } else if (response?.message && response.message !== "Deleted successfully") {
//             alert("Submission failed");
//             dispatch(clearResponse())
//         }
//     }, [taskdata, dispatch, response]);

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
//             method: 'PUT',
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
//                 dispatch(taskAdminFormData() as any);
//             })
//             .catch((error) => {
//                 console.error('Error updating task:', error);
//             });
//     };

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchQuery(e.target.value);
//     };

//     // Filter tasks based on the selected status
//     const filteredData = (activeItem === 'All'
//         ? [...taskdata] // Create a shallow copy of taskdata
//         : taskdata?.filter((task: any) => task.status === activeItem)
//     )?.reverse();

//     const searchedData = filteredData?.filter((task: Task) =>
//         [task.task, task.assigned_by, task.assignedto_username]
//             .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
//     );

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

//       const handleDeleteClick  = (id: number) => {
//             const isConfirmed = window.confirm("Are you sure you want to delete this account?");

//             if (isConfirmed) {
//                 dispatch(deleteAdminTaskWorkspaceTableData(id) as any);
//             }
//         };
//     return (

//         <div className={styles.mainContent}>
//             {/* Header Row */}
//             <div className={styles.header}>
//                 <div className={styles.title}>Task List</div>
//                 <button className={styles.createButton} onClick={() => setShowForm(true)}>
//                     <span>Create New Task</span>
//                     <AiOutlinePlusCircle size={20} className={styles.icon} />
//                 </button>
//             </div>
//             <div className={styles.filterContainer}>
//                 <div className={styles.leftContainer}>
//                     <div
//                         className={`${styles.divItem} ${activeItem === "All" ? styles.active : ""}`}
//                         onClick={() => handleItemClick("All")}
//                     >
//                         All
//                     </div>
//                     <div
//                         className={`${styles.divItem} ${activeItem === "Pending" ? styles.active : ""}`}
//                         onClick={() => handleItemClick("Pending")}
//                     >
//                         Pending
//                     </div>
//                     <div
//                         className={`${styles.divItem} ${activeItem === "In Progress" ? styles.active : ""}`}
//                         onClick={() => handleItemClick("In Progress")}
//                     >
//                         In Progress
//                     </div>
//                     <div
//                         className={`${styles.divItem} ${activeItem === "Completed" ? styles.active : ""}`}
//                         onClick={() => handleItemClick("Completed")}
//                     >
//                         Completed
//                     </div>
//                 </div>
//                 <div className={styles.rightContainer}>
//                     <div className={styles.searchBar}>
//                         <IoMdSearch size={20} className={styles.searchIcon} />
//                         <input
//                             type="text"
//                             placeholder="Search"
//                             className={styles.searchInput}
//                             value={searchQuery}
//                             onChange={handleSearchChange}
//                         />
//                     </div>
//                 </div>
//             </div>
//             {/* <div className={styles.gridContainer}>

//                         <div className={styles.div1}><IoIosSquare className={styles.icon} /></div>
//                         <div className={styles.div2}>Assigned By</div>
//                         <div className={styles.div2}>Assigned To</div>
//                         <div className={styles.div3}>Task</div>
//                         <div className={styles.div4}>Priority</div>
//                         <div className={styles.div5}>Start Date</div>
//                         <div className={styles.div6}>End Date</div>
//                         <div className={styles.div7}>Status</div>
//                         <div className={styles.div8}></div>
//                     </div>

//                     {searchedData && searchedData.map((task: Task, index: number) => (
//                         <div key={index} className={styles.gridRow}>
//                             <div className={styles.div1}><IoMdSquareOutline className={styles.icon} /></div>
//                             <div className={styles.div2}>{task.assigned_by || "N/A"}</div>
//                             <div className={styles.div2}>{task.assignedto_username || "N/A"}</div>
//                             <div className={styles.div3}>{task.task || "N/A"}</div>
//                             <div className={styles.div4} style={getPriorityStyle(task.priority || "")}>
//                                 {task.priority || "N/A"}
//                             </div>
//                             <div className={styles.div5}>{task.start_date || "N/A"}</div>
//                             <div className={styles.div6}>{task.end_date || "N/A"}</div>
//                             <div className={styles.div7}>
//                                 <div className={getStatusClass(task.status || "")}>
//                                     {task.status || "N/A"}
//                                 </div>
//                             </div>
//                             <div className={styles.div8}>
//                                 <FaRegEdit className={styles.editIcon} title="Edit" onClick={() => {
//                                     setSelectedTask(task);
//                                     setShowEditForm(true);
//                                 }} />
//                             </div>
//                         </div>
//                     ))} */}

//             <div className={styles.tableContainer}>
//                 <div className={styles.tableHeader}>
//                     <div className={styles.iconContainer}>
//                         <IoIosSquare className={styles.icon} style={{ width: "20px" }} />
//                     </div>
//                     <div className={styles.tableColumn}>Assigned By</div>
//                     <div className={styles.tableColumn}>Assigned To</div>
//                     <div className={styles.tableColumn}>Task</div>
//                     <div className={styles.tableColumn}>Priority</div>
//                     <div className={styles.tableColumn}>Start Date</div>
//                     <div className={styles.tableColumn}>End Date</div>
//                     <div className={styles.tableColumn}>Status</div>
//                     <div className={styles.tableColumn} style={{ width: "20px" }}></div>
//                     <div className={styles.tableColumn} style={{ width: "20px" }}></div>
//                 </div>

//                 <div className={styles.tableBody}>
//                     {searchedData && searchedData.map((task: Task, index: number) => (
//                         <div key={index}>
//                             <div className={styles.tableRow}>
//                                 <div className={styles.iconContainer}>
//                                     <IoMdSquareOutline className={styles.icon} style={{ width: "20px" }} />
//                                 </div>
//                                 <div className={styles.tableData}>{task.assigned_by || "N/A"}</div>
//                                 <div className={styles.tableData}>{task.assignedto_username || "N/A"}</div>
//                                 <div className={styles.tableData}>{task.task || "N/A"}</div>
//                                 <div className={styles.tableData} style={getPriorityStyle(task.priority || "")}>{task.priority || "N/A"}</div>
//                                 <div className={styles.tableData}>{task.start_date || "N/A"}</div>
//                                 <div className={styles.tableData}>{task.end_date || "N/A"}</div>

//                                 <div className={styles.tableData}><div className={getStatusClass(task.status || "")}>
//                                     {task.status || "N/A"}
//                                 </div></div>

//                                 <div className={styles.iconContainer}>
//                                 <FaRegEdit className={styles.editIcon} title="Edit" onClick={() => {
//                                     setSelectedTask(task);
//                                     setShowEditForm(true);
//                                 }} />
//                                 </div>
//                                 <div className={styles.iconContainer} onClick={() => handleDeleteClick(task.id)}>
//                                     <MdOutlineDelete className={styles.deleteIcon} style={{ width: "20px" }} title="Delete" />
//                                 </div>
//                             </div>

//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {showForm && <CreateTask onClose={() => setShowForm(false)} />}
//             {showEditForm && selectedTask && (
//                 <PopupForm
//                     task={selectedTask}
//                     onSave={updateTaskDetails}
//                     onClose={() => setShowEditForm(false)}
//                 />
//             )}
//         </div>

//     );
// };

// export default AdminTaskWorkspaceList;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
// import { AiOutlinePlusCircle } from "react-icons/ai";
// import {
//     clearResponse,
//     deleteAdminTaskWorkspaceTableData,
//     taskAdminFormData
// } from "./Slice/AdminTaskWorkspaceListSlice";
// import CreateTask from "../TaskWorkspace/components/CreateTask/CreateTask";
// import PopupForm from "../TaskWorkspace/components/PopupForm/PopupForm";
// import styles from "./AdminTaskWorkspaceList.module.css";

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

// const AdminTaskWorkspaceList: React.FC = () => {
//     const dispatch = useDispatch<AppDispatch>();

//     const { taskdata, loading, error } = useSelector((state: RootState) => state.fetchAdminTaskData);
//     const { response } = useSelector((state: RootState) => state.deleteAdminTaskWorkspaceData);
//     const token = useSelector((state: RootState) => state.userLoginAuth?.user?.tokens.access) || localStorage.getItem('token');

//     const [activeItem, setActiveItem] = useState<string>('All');
//     const [searchQuery, setSearchQuery] = useState<string>("");
//     const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
//     const [visibleCount, setVisibleCount] = useState(15);

//     const [showForm, setShowForm] = useState(false);
//     const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//     const [showEditForm, setShowEditForm] = useState(false);

//     useEffect(() => {
//         dispatch(taskAdminFormData() as any);
//     }, [dispatch, response]);

//     useEffect(() => {
//         if (response?.message === "Deleted successfully") {
//             alert("Task Deleted successfully");
//             dispatch(clearResponse());
//         } else if (response?.message && response.message !== "Deleted successfully") {
//             alert("Submission failed");
//             dispatch(clearResponse());
//         }
//     }, [taskdata, dispatch, response]);

//     const updateTaskDetails = (updatedTask: Task) => {
//         const patchData = {
//             status: updatedTask.status,
//             outcome: updatedTask.outcome,
//         };

//         fetch(`http://localhost:8000/tasks/${updatedTask.id}/`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify(patchData),
//         })
//             .then((response) => {
//                 if (!response.ok) throw new Error('Failed to update the task');
//                 return response.json();
//             })
//             .then(() => {
//                 setShowEditForm(false);
//                 dispatch(taskAdminFormData() as any);
//             })
//             .catch((error) => console.error('Error updating task:', error));
//     };

//     const handleDeleteClick = (id: number) => {
//         if (window.confirm("Are you sure you want to delete this task?")) {
//             dispatch(deleteAdminTaskWorkspaceTableData(id) as any);
//         }
//     };

//     const toggleRow = (id: number) => {
//         setExpandedRows((prev) => {
//             const next = new Set(prev);
//             next.has(id) ? next.delete(id) : next.add(id);
//             return next;
//         });
//     };

//     // Filter Logic
//     const safeData = taskdata || [];
//     const filteredData = (
//         activeItem === "All" ? [...safeData] : safeData.filter((task: any) => task.status === activeItem)
//     ).reverse();

//     const searchedData = filteredData.filter((task: Task) =>
//         [task.task, task.assigned_by, task.assignedto_username]
//             .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
//     );

//     const visibleData = searchedData.slice(0, visibleCount);

//     // KPI Calculations
//     const totalTasks = safeData.length;
//     const pendingTasks = safeData.filter((t: Task) => t.status === "Pending").length;
//     const inProgressTasks = safeData.filter((t: Task) => t.status === "In Progress").length;
//     const completedTasks = safeData.filter((t: Task) => t.status === "Completed").length;
//     const highPriorityTasks = safeData.filter((t: Task) => t.priority?.toLowerCase() === "high").length;

//     // Styles helpers
//     const getPriorityClass = (priority: string) => {
//         switch (priority?.toLowerCase()) {
//             case "high": return styles.priorityHigh;
//             case "medium": return styles.priorityMedium;
//             case "low": return styles.priorityLow;
//             default: return styles.priorityDefault;
//         }
//     };

//     const getStatusClass = (status: string) => {
//         switch (status?.toLowerCase()) {
//             case "in progress": return styles.statusInProgress;
//             case "pending": return styles.statusPending;
//             case "completed": return styles.statusCompleted;
//             default: return styles.statusDefault;
//         }
//     };

//     return (
//         <div className={styles.page}>
//             {/* ── Page header ── */}
//             <div className={styles.pageHeader}>
//                 <div>
//                     <h1 className={styles.pageTitle}>Task Workspace</h1>
//                     <p className={styles.pageSubtitle}>Manage, assign, and track tasks efficiently</p>
//                 </div>
//                 <div className={styles.headerRight}>
//                     <select
//                         value={activeItem}
//                         onChange={(e) => { setActiveItem(e.target.value); setVisibleCount(15); }}
//                         className={styles.filterSelect}
//                     >
//                         <option value="All">All Status</option>
//                         <option value="Pending">Pending</option>
//                         <option value="In Progress">In Progress</option>
//                         <option value="Completed">Completed</option>
//                     </select>

//                     <div className={styles.searchBar}>
//                         <MdOutlineSearch className={styles.searchIcon} />
//                         <input
//                             type="text"
//                             placeholder="Search tasks or assignees…"
//                             className={styles.searchInput}
//                             value={searchQuery}
//                             onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(15); }}
//                         />
//                         {searchQuery && (
//                             <button className={styles.clearBtn} onClick={() => { setSearchQuery(""); setVisibleCount(15); }}>✕</button>
//                         )}
//                     </div>
//                     <button className={styles.createBtn} onClick={() => setShowForm(true)}>
//                         <AiOutlinePlusCircle size={18} />
//                         <span>Create Task</span>
//                     </button>
//                 </div>
//             </div>

//             {/* ── KPI strip ── */}
//             <div className={styles.kpiRow}>
//                 <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{totalTasks}</div>
//                         <div className={styles.kpiLabel}>Total Tasks</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{totalTasks}</div>
//                 </div>

//                 <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{pendingTasks}</div>
//                         <div className={styles.kpiLabel}>Pending</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{pendingTasks}</div>
//                 </div>

//                 <div className={`${styles.kpiCard} ${styles.kpiCyan}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{inProgressTasks}</div>
//                         <div className={styles.kpiLabel}>In Progress</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{inProgressTasks}</div>
//                 </div>

//                 <div className={`${styles.kpiCard} ${styles.kpiEmerald}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 11.857l2.5 2.5L15.857 9"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{completedTasks}</div>
//                         <div className={styles.kpiLabel}>Completed</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{completedTasks}</div>
//                 </div>

//                 <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
//                     <div className={styles.kpiIconWrap}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
//                         </svg>
//                     </div>
//                     <div className={styles.kpiContent}>
//                         <div className={styles.kpiValue}>{highPriorityTasks}</div>
//                         <div className={styles.kpiLabel}>High Priority</div>
//                     </div>
//                     <div className={styles.kpiBgNumber}>{highPriorityTasks}</div>
//                 </div>
//             </div>

//             {/* ── Table card ── */}
//             <div className={styles.tableCard}>
//                 {/* Table title bar */}
//                 <div className={styles.tableTopBar}>
//                     <div className={styles.tableTopLeft}>
//                         <div className={styles.tableDot} />
//                         <span className={styles.tableTopTitle}>All Tasks</span>
//                         <span className={styles.tableTopCount}>{searchedData.length} records</span>
//                     </div>
//                 </div>

//                 {/* Header */}
//                 <div className={styles.tableHeader}>
//                     <div className={styles.thCell} />
//                     <div className={styles.thCell}>Task</div>
//                     <div className={styles.thCell}>Priority</div>
//                     <div className={styles.thCell}>Assigned By</div>
//                     <div className={styles.thCell}>Assigned To</div>
//                     <div className={styles.thCell}>Start Date</div>
//                     <div className={styles.thCell}>End Date</div>
//                     <div className={styles.thCell}>Status</div>
//                     <div className={styles.thCell} />
//                     <div className={styles.thCell} />
//                 </div>

//                 {/* Loading skeleton */}
//                 {loading && (
//                     <div className={styles.stateBox}>
//                         {[1, 2, 3, 4, 5].map((i) => (
//                             <div key={i} className={styles.skeletonRow}>
//                                 {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
//                                     <div key={j} className={styles.skeletonCell} />
//                                 ))}
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {/* Error */}
//                 {error && !loading && (
//                     <div className={styles.stateBox}>
//                         <div className={styles.emptyState}>
//                             <div className={styles.emptyIconWrap} style={{ background: '#FEE2E2' }}>
//                                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
//                                     <circle cx="12" cy="12" r="10" />
//                                     <line x1="12" y1="8"  x2="12"   y2="12" />
//                                     <line x1="12" y1="16" x2="12.01" y2="16" />
//                                 </svg>
//                             </div>
//                             <p className={styles.emptyTitle}>Failed to load data</p>
//                             <p className={styles.emptyText}>{error}</p>
//                         </div>
//                     </div>
//                 )}

//                 {/* Empty */}
//                 {!loading && !error && searchedData.length === 0 && (
//                     <div className={styles.stateBox}>
//                         <div className={styles.emptyState}>
//                             <div className={styles.emptyIconWrap} style={{ background: '#F1F5F9' }}>
//                                 <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
//                                     <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2.5"/>
//                                     <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2.5"/>
//                                     <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
//                                 </svg>
//                             </div>
//                             <p className={styles.emptyTitle}>No tasks found</p>
//                             <p className={styles.emptyText}>Try adjusting your filters or search query.</p>
//                         </div>
//                     </div>
//                 )}

//                 {/* Rows */}
//                 {!loading && !error && visibleData.map((row: Task, idx: number) => (
//                     <div
//                         key={row.id}
//                         className={styles.rowGroup}
//                         style={{ animationDelay: `${Math.min(idx, 10) * 35}ms` }}
//                     >
//                         {/* Main row */}
//                         <div className={`${styles.tableRow} ${expandedRows.has(row.id) ? styles.rowExpanded : ""}`}>
//                             <button
//                                 className={styles.chevronBtn}
//                                 onClick={() => toggleRow(row.id)}
//                                 aria-label="Expand row"
//                             >
//                                 <IoIosArrowDropdown
//                                     size={20}
//                                     className={`${styles.chevron} ${expandedRows.has(row.id) ? styles.chevronOpen : ""}`}
//                                 />
//                             </button>

//                             <div className={styles.tdCell}>
//                                 <span className={styles.taskName}>{row.task || "—"}</span>
//                             </div>
//                             <div className={styles.tdCell}>
//                                 <span className={`${styles.priorityBadge} ${getPriorityClass(row.priority)}`}>
//                                     {row.priority || "—"}
//                                 </span>
//                             </div>
//                             <div className={styles.tdCell}>
//                                 {row.assigned_by ? <span className={styles.userBadge}>{row.assigned_by}</span> : "—"}
//                             </div>
//                             <div className={styles.tdCell}>
//                                 {row.assignedto_username ? <span className={styles.userBadgeAssign}>{row.assignedto_username}</span> : "—"}
//                             </div>
//                             <div className={styles.tdCell}>
//                                 <span className={styles.dateCell}>{row.start_date || "—"}</span>
//                             </div>
//                             <div className={styles.tdCell}>
//                                 <span className={styles.dateCell}>{row.end_date || "—"}</span>
//                             </div>
//                             <div className={styles.tdCell}>
//                                 <span className={`${styles.statusBadge} ${getStatusClass(row.status)}`}>
//                                     {row.status || "—"}
//                                 </span>
//                             </div>

//                             <button
//                                 className={styles.editBtn}
//                                 onClick={(e) => { e.stopPropagation(); setSelectedTask(row); setShowEditForm(true); }}
//                                 aria-label="Edit"
//                             >
//                                 <FaRegEdit size={14} />
//                             </button>
//                             <button
//                                 className={styles.deleteBtn}
//                                 onClick={(e) => { e.stopPropagation(); handleDeleteClick(row.id); }}
//                                 aria-label="Delete"
//                             >
//                                 <MdOutlineDelete size={16} />
//                             </button>
//                         </div>

//                         {/* Expanded detail panel */}
//                         {expandedRows.has(row.id) && (
//                             <div className={styles.detailPanel}>
//                                 <div className={styles.detailPanelInner}>
//                                     <div className={styles.detailHeader}>
//                                         <div className={styles.detailTitleWrap}>
//                                             <div className={styles.detailAvatar}>
//                                                 {(row.assignedto_username || 'T')[0].toUpperCase()}
//                                             </div>
//                                             <div>
//                                                 <div className={styles.detailTitle}>{row.task}</div>
//                                                 <div className={styles.detailTitleSub}>Task Overview</div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Description full width */}
//                                     <div className={styles.descriptionBox}>
//                                         <span className={styles.detailLabel}>Description</span>
//                                         <p className={styles.detailText}>{row.description || "No description provided."}</p>
//                                     </div>

//                                     <div className={styles.detailGrid}>
//                                         {[
//                                             { label: "Outcome",          value: row.outcome || "N/A",              icon: "🎯" },
//                                             { label: "Last Update",      value: row.last_update_date || "N/A",     icon: "⏳" },
//                                             { label: "Accepted Status",  value: row.is_accepted ? "Yes" : "No",    icon: "✅" },
//                                         ].map(({ label, value, icon }) => (
//                                             <div key={label} className={styles.detailItem}>
//                                                 <span className={styles.detailLabel}>
//                                                     <span className={styles.detailIcon}>{icon}</span>{label}
//                                                 </span>
//                                                 <span className={styles.detailValue}>{value}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ))}

//                 {/* Load more */}
//                 {!loading && !error && visibleCount < searchedData.length && (
//                     <div className={styles.loadMoreWrap}>
//                         <button
//                             className={styles.loadMoreBtn}
//                             onClick={() => setVisibleCount((c) => c + 15)}
//                         >
//                             Load more · {searchedData.length - visibleCount} remaining
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {/* Modals */}
//             {showForm && <CreateTask onClose={() => setShowForm(false)} />}
//             {showEditForm && selectedTask && (
//                 <PopupForm
//                     task={selectedTask}
//                     onSave={updateTaskDetails}
//                     onClose={() => setShowEditForm(false)}
//                 />
//             )}
//         </div>
//     );
// };

// export default AdminTaskWorkspaceList;

// ===========================================================================================================================
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
// import { AiOutlinePlusCircle } from "react-icons/ai";
// import {
//     clearResponse,
//     deleteAdminTaskWorkspaceTableData,
//     taskAdminFormData
// } from "./Slice/AdminTaskWorkspaceListSlice";
// import CreateTask from "../TaskWorkspace/components/CreateTask/CreateTask";
// import PopupForm from "../TaskWorkspace/components/PopupForm/PopupForm";
// import styles from "./AdminTaskWorkspaceList.module.css";

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

// /* ── Time Period Options ── */
// const TIME_PERIODS = [
//   { label: "All Time", value: "all" },
//   { label: "Last 7 Days", value: "7days" },
//   { label: "Last 15 Days", value: "15days" },
//   { label: "This Month", value: "this_month" },
//   { label: "Last 3 Months", value: "3months" },
//   { label: "Q1 (Apr–Jun)", value: "q1" },
//   { label: "Q2 (Jul–Sep)", value: "q2" },
//   { label: "Q3 (Oct–Dec)", value: "q3" },
//   { label: "Q4 (Jan–Mar)", value: "q4" },
//   { label: "This FY", value: "this_fy" },
// ];

// /* ── Date Filter Helper (Indian FY: April to March) ── */
// const isInTimePeriod = (dateString: string, period: string): boolean => {
//   if (!dateString || period === "all") return true;

//   const today = new Date();
//   const checkDate = new Date(dateString);
//   today.setHours(0, 0, 0, 0);
//   checkDate.setHours(0, 0, 0, 0);

//   const diffDays = Math.floor((today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
//   const currentMonth = today.getMonth();
//   const currentYear = today.getFullYear();
//   const fyYear = currentMonth >= 3 ? currentYear : currentYear - 1;

//   switch (period) {
//     case "this_fy": return checkDate >= new Date(fyYear, 3, 1) && checkDate <= new Date(fyYear + 1, 2, 31);
//     case "7days": return diffDays >= 0 && diffDays <= 7;
//     case "15days": return diffDays >= 0 && diffDays <= 15;
//     case "this_month": return checkDate.getMonth() === today.getMonth() && checkDate.getFullYear() === today.getFullYear();
//     case "3months": {
//       const threeMonthsAgo = new Date(today);
//       threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
//       return checkDate >= threeMonthsAgo && checkDate <= today;
//     }
//     case "q1": return checkDate >= new Date(fyYear, 3, 1) && checkDate <= new Date(fyYear, 5, 30);
//     case "q2": return checkDate >= new Date(fyYear, 6, 1) && checkDate <= new Date(fyYear, 8, 30);
//     case "q3": return checkDate >= new Date(fyYear, 9, 1) && checkDate <= new Date(fyYear, 11, 31);
//     case "q4": return checkDate >= new Date(fyYear + 1, 0, 1) && checkDate <= new Date(fyYear + 1, 2, 31);
//     default: return true;
//   }
// };

// const AdminTaskWorkspaceList: React.FC = () => {
//     const dispatch = useDispatch<AppDispatch>();

//     const { taskdata, loading, error } = useSelector((state: RootState) => state.fetchAdminTaskData);
//     const { response } = useSelector((state: RootState) => state.deleteAdminTaskWorkspaceData);
//     const token = useSelector((state: RootState) => state.userLoginAuth?.user?.tokens.access) || localStorage.getItem('token');

//     /* ── Local State ── */
//     const [activeItem, setActiveItem] = useState<string>('All');
//     const [searchQuery, setSearchQuery] = useState<string>("");
//     const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
//     const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
//     const [visibleCount, setVisibleCount] = useState(15);

//     const [showForm, setShowForm] = useState(false);
//     const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//     const [showEditForm, setShowEditForm] = useState(false);

//     useEffect(() => {
//         dispatch(taskAdminFormData() as any);
//     }, [dispatch, response]);

//     useEffect(() => {
//         if (response?.message === "Deleted successfully") {
//             alert("Task Deleted successfully");
//             dispatch(clearResponse());
//         }
//     }, [response, dispatch]);

//     const updateTaskDetails = (updatedTask: Task) => {
//         fetch(`http://localhost:8000/tasks/${updatedTask.id}/`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify({ status: updatedTask.status, outcome: updatedTask.outcome }),
//         })
//             .then((res) => { if (res.ok) { setShowEditForm(false); dispatch(taskAdminFormData() as any); }})
//             .catch((err) => console.error('Error updating task:', err));
//     };

//     const handleDeleteClick = (id: number) => {
//         if (window.confirm("Are you sure you want to delete this task?")) {
//             dispatch(deleteAdminTaskWorkspaceTableData(id) as any);
//         }
//     };

//     const toggleRow = (id: number) => {
//         setExpandedRows((prev) => {
//             const next = new Set(prev);
//             if (next.has(id)) next.delete(id); else next.add(id);
//             return next;
//         });
//     };

//     /* ── Filtering Logic ── */
//     const safeData = taskdata || [];

//     const filteredData = [...safeData].reverse().filter((task: Task) => {
//         // 1. Status Filter
//         const matchesStatus = activeItem === "All" || task.status === activeItem;

//         // 2. Search Filter
//         const matchesSearch = [task.task, task.assigned_by, task.assignedto_username]
//             .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()));

//         // 3. Time Filter (checking against start_date)
//         const matchesTime = isInTimePeriod(task.start_date, selectedTimePeriod);

//         return matchesStatus && matchesSearch && matchesTime;
//     });

//     const visibleData = filteredData.slice(0, visibleCount);

//     /* ── KPI Calculations (Using safeData to remain unchanged as requested) ── */
//     const totalTasks = safeData.length;
//     const pendingTasks = safeData.filter((t: Task) => t.status === "Pending").length;
//     const inProgressTasks = safeData.filter((t: Task) => t.status === "In Progress").length;
//     const completedTasks = safeData.filter((t: Task) => t.status === "Completed").length;
//     const highPriorityTasks = safeData.filter((t: Task) => t.priority?.toLowerCase() === "high").length;

//     /* ── Style Helpers ── */
//     const getPriorityClass = (p: string) => styles[`priority${p?.charAt(0).toUpperCase() + p?.slice(1).toLowerCase()}`] || styles.priorityDefault;
//     const getStatusClass = (s: string) => styles[`status${s?.replace(" ", "")}`] || styles.statusDefault;

//     return (
//         <div className={styles.page}>
//             {/* ── Page header ── */}
//             <div className={styles.pageHeader}>
//                 <div>
//                     <h1 className={styles.pageTitle}>Task Workspace</h1>
//                     <p className={styles.pageSubtitle}>Manage, assign, and track tasks efficiently</p>
//                 </div>
//                 <div className={styles.headerRight}>

//                 <select
//                     value={activeItem}
//                     onChange={(e) => { setActiveItem(e.target.value); setVisibleCount(15); }}
//                     className={styles.inlineSelect}
//                 >
//                     <option value="All">All Status</option>
//                     <option value="Pending">Pending</option>
//                     <option value="In Progress">In Progress</option>
//                     <option value="Completed">Completed</option>
//                 </select>

//                     <select
//                         className={styles.headerSelect}
//                         value={selectedTimePeriod}
//                         onChange={(e) => { setSelectedTimePeriod(e.target.value); setVisibleCount(15); }}
//                     >
//                         {TIME_PERIODS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
//                     </select>

//                     <div className={styles.searchBar}>
//                         <MdOutlineSearch className={styles.searchIcon} />
//                         <input
//                             type="text"
//                             placeholder="Search tasks..."
//                             className={styles.searchInput}
//                             value={searchQuery}
//                             onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(15); }}
//                         />
//                     </div>

//                     <button className={styles.createBtn} onClick={() => setShowForm(true)}>
//                         <AiOutlinePlusCircle size={18} />
//                         <span>Create Task</span>
//                     </button>
//                 </div>
//             </div>

//             {/* ── KPI strip ── */}
//             <div className={styles.kpiRow}>
//                 <div className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
//                     <div className={styles.kpiContent}><div className={styles.kpiValue}>{totalTasks}</div><div className={styles.kpiLabel}>Total Tasks</div></div>
//                     <div className={styles.kpiBgNumber}>{totalTasks}</div>
//                 </div>
//                 <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
//                     <div className={styles.kpiContent}><div className={styles.kpiValue}>{pendingTasks}</div><div className={styles.kpiLabel}>Pending</div></div>
//                     <div className={styles.kpiBgNumber}>{pendingTasks}</div>
//                 </div>
//                 <div className={`${styles.kpiCard} ${styles.kpiCyan}`}>
//                     <div className={styles.kpiContent}><div className={styles.kpiValue}>{inProgressTasks}</div><div className={styles.kpiLabel}>In Progress</div></div>
//                     <div className={styles.kpiBgNumber}>{inProgressTasks}</div>
//                 </div>
//                 <div className={`${styles.kpiCard} ${styles.kpiEmerald}`}>
//                     <div className={styles.kpiContent}><div className={styles.kpiValue}>{completedTasks}</div><div className={styles.kpiLabel}>Completed</div></div>
//                     <div className={styles.kpiBgNumber}>{completedTasks}</div>
//                 </div>
//                 <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
//                     <div className={styles.kpiContent}><div className={styles.kpiValue}>{highPriorityTasks}</div><div className={styles.kpiLabel}>High Priority</div></div>
//                     <div className={styles.kpiBgNumber}>{highPriorityTasks}</div>
//                 </div>
//             </div>

//             {/* ── Filter Strip (Status Filter moved here for cleaner UI) ── */}

//             {/* ── Table card ── */}
//             <div className={styles.tableCard}>
//                 <div className={styles.tableTopBar}>
//                     <div className={styles.tableTopLeft}><div className={styles.tableDot} /><span className={styles.tableTopTitle}>All Tasks</span></div>
//                 </div>

//                 <div className={styles.tableHeader}>
//                     <div className={styles.thCell} />
//                     <div className={styles.thCell}>Task</div>
//                     <div className={styles.thCell}>Priority</div>
//                     <div className={styles.thCell}>Assigned By</div>
//                     <div className={styles.thCell}>Assigned To</div>
//                     <div className={styles.thCell}>Start Date</div>
//                     <div className={styles.thCell}>End Date</div>
//                     <div className={styles.thCell}>Status</div>
//                     <div className={styles.thCell} />
//                     <div className={styles.thCell} />
//                 </div>

//                 {visibleData.map((row: Task) => (
//                     <div key={row.id} className={styles.rowGroup}>
//                         <div className={`${styles.tableRow} ${expandedRows.has(row.id) ? styles.rowExpanded : ""}`}>
//                             <button className={styles.chevronBtn} onClick={() => toggleRow(row.id)}>
//                                 <IoIosArrowDropdown size={20} className={`${styles.chevron} ${expandedRows.has(row.id) ? styles.chevronOpen : ""}`} />
//                             </button>
//                             <div className={styles.tdCell}><span className={styles.taskName}>{row.task}</span></div>
//                             <div className={styles.tdCell}><span className={`${styles.priorityBadge} ${getPriorityClass(row.priority)}`}>{row.priority}</span></div>
//                             <div className={styles.tdCell}><span className={styles.userBadge}>{row.assigned_by}</span></div>
//                             <div className={styles.tdCell}><span className={styles.userBadgeAssign}>{row.assignedto_username}</span></div>
//                             <div className={styles.tdCell}><span className={styles.dateCell}>{row.start_date}</span></div>
//                             <div className={styles.tdCell}><span className={styles.dateCell}>{row.end_date}</span></div>
//                             <div className={styles.tdCell}><span className={`${styles.statusBadge} ${getStatusClass(row.status)}`}>{row.status}</span></div>
//                             <button className={styles.editBtn} onClick={() => { setSelectedTask(row); setShowEditForm(true); }}><FaRegEdit size={14} /></button>
//                             <button className={styles.deleteBtn} onClick={() => handleDeleteClick(row.id)}><MdOutlineDelete size={16} /></button>
//                         </div>

//                         {expandedRows.has(row.id) && (
//                             <div className={styles.detailPanel}>
//                                 <div className={styles.detailPanelInner}>
//                                     <div className={styles.descriptionBox}>
//                                         <span className={styles.detailLabel}>Description</span>
//                                         <p className={styles.detailText}>{row.description || "No description provided."}</p>
//                                     </div>
//                                     <div className={styles.detailGrid}>
//                                         <div className={styles.detailItem}><span className={styles.detailLabel}>Outcome</span><span className={styles.detailValue}>{row.outcome || "N/A"}</span></div>
//                                         <div className={styles.detailItem}><span className={styles.detailLabel}>Last Update</span><span className={styles.detailValue}>{row.last_update_date}</span></div>
//                                         <div className={styles.detailItem}><span className={styles.detailLabel}>Accepted</span><span className={styles.detailValue}>{row.is_accepted}</span></div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>

//             {showForm && <CreateTask onClose={() => setShowForm(false)} />}
//             {showEditForm && selectedTask && <PopupForm task={selectedTask} onSave={updateTaskDetails} onClose={() => setShowEditForm(false)} />}
//         </div>
//     );
// };

// export default AdminTaskWorkspaceList;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  clearResponse,
  deleteAdminTaskWorkspaceTableData,
  taskAdminFormData,
} from "./Slice/AdminTaskWorkspaceListSlice";
import CreateTask from "../TaskWorkspace/components/CreateTask/CreateTask";
import PopupForm from "../TaskWorkspace/components/PopupForm/PopupForm";

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

const TIME_PERIODS = [
  { label: "All Time", value: "all" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 15 Days", value: "15days" },
  { label: "This Month", value: "this_month" },
  { label: "Last 3 Months", value: "3months" },
  { label: "Q1 (Apr–Jun)", value: "q1" },
  { label: "Q2 (Jul–Sep)", value: "q2" },
  { label: "Q3 (Oct–Dec)", value: "q3" },
  { label: "Q4 (Jan–Mar)", value: "q4" },
  { label: "This FY", value: "this_fy" },
];

const isInTimePeriod = (dateString: string, period: string): boolean => {
  if (!dateString || period === "all") return true;
  const today = new Date();
  const checkDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(
    (today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const fyYear = currentMonth >= 3 ? currentYear : currentYear - 1;
  switch (period) {
    case "this_fy":
      return (
        checkDate >= new Date(fyYear, 3, 1) &&
        checkDate <= new Date(fyYear + 1, 2, 31)
      );
    case "7days":
      return diffDays >= 0 && diffDays <= 7;
    case "15days":
      return diffDays >= 0 && diffDays <= 15;
    case "this_month":
      return (
        checkDate.getMonth() === today.getMonth() &&
        checkDate.getFullYear() === today.getFullYear()
      );
    case "3months": {
      const d = new Date(today);
      d.setMonth(d.getMonth() - 3);
      return checkDate >= d && checkDate <= today;
    }
    case "q1":
      return (
        checkDate >= new Date(fyYear, 3, 1) &&
        checkDate <= new Date(fyYear, 5, 30)
      );
    case "q2":
      return (
        checkDate >= new Date(fyYear, 6, 1) &&
        checkDate <= new Date(fyYear, 8, 30)
      );
    case "q3":
      return (
        checkDate >= new Date(fyYear, 9, 1) &&
        checkDate <= new Date(fyYear, 11, 31)
      );
    case "q4":
      return (
        checkDate >= new Date(fyYear + 1, 0, 1) &&
        checkDate <= new Date(fyYear + 1, 2, 31)
      );
    default:
      return true;
  }
};

const getPriorityClass = (p: string) => {
  const map: Record<string, string> = {
    high: "bg-red-100 text-red-700 border border-red-200",
    medium: "bg-orange-100 text-orange-700 border border-orange-200",
    low: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };
  return (
    map[p?.toLowerCase()] ??
    "bg-slate-100 text-slate-600 border border-slate-200"
  );
};

const getStatusClass = (s: string) => {
  const map: Record<string, string> = {
    "In Progress": "bg-blue-100 text-blue-700 border border-blue-200",
    Pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };
  return map[s] ?? "bg-slate-100 text-slate-600 border border-slate-200";
};

const selectClass =
  "h-10 px-3 pr-8 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all cursor-pointer shadow-sm";

const GRID_COLS = "40px 1.5fr 0.8fr 1fr 1fr 1fr 1fr 1fr 44px 44px";

const AdminTaskWorkspaceList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { taskdata, loading, error } = useSelector(
    (state: RootState) => state.fetchAdminTaskData,
  );
  const { response } = useSelector(
    (state: RootState) => state.deleteAdminTaskWorkspaceData,
  );
  const token =
    useSelector(
      (state: RootState) => state.userLoginAuth?.user?.tokens.access,
    ) || localStorage.getItem("token");

  const [activeItem, setActiveItem] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [visibleCount, setVisibleCount] = useState(15);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    dispatch(taskAdminFormData() as any);
  }, [dispatch, response]);

  useEffect(() => {
    if (response?.message === "Deleted successfully") {
      alert("Task Deleted successfully");
      dispatch(clearResponse());
    }
  }, [response, dispatch]);

  const updateTaskDetails = (updatedTask: Task) => {
    fetch(`http://localhost:8000/tasks/${updatedTask.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: updatedTask.status,
        outcome: updatedTask.outcome,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setShowEditForm(false);
          dispatch(taskAdminFormData() as any);
        }
      })
      .catch((err) => console.error("Error updating task:", err));
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteAdminTaskWorkspaceTableData(id) as any);
    }
  };

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const safeData = taskdata || [];
  const filteredData = [...safeData].reverse().filter((task: Task) => {
    const matchesStatus = activeItem === "All" || task.status === activeItem;
    const matchesSearch = [
      task.task,
      task.assigned_by,
      task.assignedto_username,
    ].some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTime = isInTimePeriod(task.start_date, selectedTimePeriod);
    return matchesStatus && matchesSearch && matchesTime;
  });
  const visibleData = filteredData.slice(0, visibleCount);

  const totalTasks = safeData.length;
  const pendingTasks = safeData.filter(
    (t: Task) => t.status === "Pending",
  ).length;
  const inProgressTasks = safeData.filter(
    (t: Task) => t.status === "In Progress",
  ).length;
  const completedTasks = safeData.filter(
    (t: Task) => t.status === "Completed",
  ).length;
  const highPriorityTasks = safeData.filter(
    (t: Task) => t.priority?.toLowerCase() === "high",
  ).length;

  const kpiCards = [
    {
      label: "Total Tasks",
      value: totalTasks,
      gradient: "from-indigo-600 to-indigo-500",
    },
    {
      label: "Pending",
      value: pendingTasks,
      gradient: "from-amber-500 to-yellow-400",
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      gradient: "from-cyan-600 to-cyan-400",
    },
    {
      label: "Completed",
      value: completedTasks,
      gradient: "from-emerald-600 to-emerald-400",
    },
    {
      label: "High Priority",
      value: highPriorityTasks,
      gradient: "from-purple-700 to-purple-500",
    },
  ];

  return (
    <div className="w-full min-h-full bg-slate-50 p-7 pb-28 flex flex-col gap-6 overflow-y-auto overflow-x-hidden">
      {/* ── Page Header ── */}
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-violet-700 m-0 tracking-tight leading-tight">
            Task Workspace
          </h1>
          <p className="text-[13px] text-violet-400 mt-1 m-0 font-normal">
            Manage, assign, and track tasks efficiently
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={activeItem}
            onChange={(e) => {
              setActiveItem(e.target.value);
              setVisibleCount(15);
            }}
            className={selectClass}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className={selectClass}
            value={selectedTimePeriod}
            onChange={(e) => {
              setSelectedTimePeriod(e.target.value);
              setVisibleCount(15);
            }}
          >
            {TIME_PERIODS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 h-10 w-64 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all">
            <MdOutlineSearch className="text-slate-400 text-lg shrink-0" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="border-none outline-none bg-transparent text-sm text-slate-800 w-full placeholder:text-slate-300"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(15);
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-indigo-500 text-xs transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          <button
            className="flex items-center gap-2 h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all whitespace-nowrap border-none cursor-pointer"
            onClick={() => setShowForm(true)}
          >
            <AiOutlinePlusCircle size={18} />
            Create Task
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map(({ label, value, gradient }) => (
          <div
            key={label}
            className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 flex flex-col gap-1 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-default overflow-hidden relative`}
          >
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {value}
            </span>
            <span className="text-xs font-semibold text-white/75">{label}</span>
            <span className="absolute right-3 bottom-[-8px] text-[52px] font-extrabold text-white/10 pointer-events-none select-none leading-none">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md">
        {/* Table top bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.2)] animate-pulse" />
            <span className="text-sm font-bold text-slate-800">All Tasks</span>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {filteredData.length}
            </span>
          </div>
        </div>

        {/* Table Header */}
        <div
          className="grid gap-3 px-4 py-3 mx-3 mb-1 rounded-xl bg-gradient-to-r from-indigo-700 to-blue-600 text-[10.5px] font-bold uppercase tracking-widest text-white/90"
          style={{ gridTemplateColumns: GRID_COLS }}
        >
          <span></span>
          <span>Task</span>
          <span>Priority</span>
          <span>Assigned By</span>
          <span>Assigned To</span>
          <span>Start Date</span>
          <span>End Date</span>
          <span>Status</span>
          <span></span>
          <span></span>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="p-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="grid gap-3 px-4 py-4 border-b border-slate-100 items-center animate-pulse"
                style={{ gridTemplateColumns: GRID_COLS }}
              >
                {[...Array(8)].map((_, j) => (
                  <div key={j} className="h-3.5 bg-slate-200 rounded-md" />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && visibleData.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl">
              📋
            </div>
            <p className="text-sm font-bold text-slate-600 m-0">
              No tasks found
            </p>
            <p className="text-xs text-slate-400 m-0">
              Try adjusting your filters or search query
            </p>
          </div>
        )}

        {/* Data Rows */}
        {!loading &&
          visibleData.map((row: Task) => (
            <div
              key={row.id}
              className="border-b border-slate-100 last:border-none"
              style={{
                borderLeft: expandedRows.has(row.id)
                  ? "4px solid #6366f1"
                  : "4px solid transparent",
              }}
            >
              {/* Main Row */}
              <div
                className={`grid gap-3 px-4 items-center h-14 transition-all duration-150 cursor-default ${expandedRows.has(row.id) ? "bg-indigo-50/60" : "bg-white hover:bg-slate-50"}`}
                style={{ gridTemplateColumns: GRID_COLS }}
              >
                <button
                  className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-indigo-100 transition-colors"
                  onClick={() => toggleRow(row.id)}
                >
                  <IoIosArrowDropdown
                    size={20}
                    className={`transition-all duration-200 ${expandedRows.has(row.id) ? "rotate-180 text-indigo-500" : "text-slate-400"}`}
                  />
                </button>

                <div className="text-sm font-bold text-slate-900 truncate">
                  {row.task}
                </div>

                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getPriorityClass(row.priority)}`}
                  >
                    {row.priority}
                  </span>
                </div>

                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 rounded-full text-[11px] font-bold border border-slate-200 whitespace-nowrap">
                    {row.assigned_by}
                  </span>
                </div>

                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600 rounded-full text-[11px] font-bold border border-indigo-200 whitespace-nowrap">
                    {row.assignedto_username}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[11.5px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                    {row.start_date}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[11.5px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                    {row.end_date}
                  </span>
                </div>

                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusClass(row.status)}`}
                  >
                    {row.status}
                  </span>
                </div>

                <button
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:scale-110 transition-all"
                  onClick={() => {
                    setSelectedTask(row);
                    setShowEditForm(true);
                  }}
                >
                  <FaRegEdit size={14} />
                </button>

                <button
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 hover:scale-110 transition-all"
                  onClick={() => handleDeleteClick(row.id)}
                >
                  <MdOutlineDelete size={16} />
                </button>
              </div>

              {/* Expanded Detail Panel */}
              {expandedRows.has(row.id) && (
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 border-t border-slate-200 w-full">
                  <div className="px-14 py-5 pb-8">
                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                        Description
                      </span>
                      <p className="text-sm text-slate-600 leading-relaxed mt-1 mb-0">
                        {row.description || "No description provided."}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/80 border border-slate-200 rounded-xl px-3 py-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                          Outcome
                        </span>
                        <p className="text-sm font-semibold text-slate-700 mt-1 mb-0 truncate">
                          {row.outcome || "N/A"}
                        </p>
                      </div>
                      <div className="bg-white/80 border border-slate-200 rounded-xl px-3 py-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                          Last Update
                        </span>
                        <p className="text-sm font-semibold text-slate-700 mt-1 mb-0 truncate">
                          {row.last_update_date}
                        </p>
                      </div>
                      <div className="bg-white/80 border border-slate-200 rounded-xl px-3 py-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                          Accepted
                        </span>
                        <p className="text-sm font-semibold text-slate-700 mt-1 mb-0 truncate">
                          {row.is_accepted}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

        {/* Load More */}
        {visibleCount < filteredData.length && (
          <div className="flex justify-center p-5 border-t border-slate-100">
            <button
              onClick={() => setVisibleCount((v) => v + 15)}
              className="px-7 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-none rounded-xl text-sm font-semibold cursor-pointer shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {showForm && <CreateTask onClose={() => setShowForm(false)} />}
      {showEditForm && selectedTask && (
        <PopupForm
          task={selectedTask}
          onSave={updateTaskDetails}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
};

export default AdminTaskWorkspaceList;
