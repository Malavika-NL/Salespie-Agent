// import React, { useEffect, useState } from 'react';
// import styles from './OpportunityStatus.module.css';
// import { opportunityFormData } from '../../OpportunityTable/slice/opportunityTableSlice';
// import { useDispatch } from 'react-redux';
// import { MdOutlineSearch } from "react-icons/md";
// import { adminOpportunityFormData } from '../../OpportunityAdminTable/slice/opportunityTableSlice';

// const AdminOpportunityStatus = () => {

//     const dispatch = useDispatch();
//      const [tableData, setTableData] = useState<any[]>([]);
    
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const result = await dispatch(adminOpportunityFormData() as any);
//       const alldata = result.payload;

//       console.log('alldata', alldata);

//       // SAFETY CHECK – THIS IS WHAT WAS MISSING!
//       if (!alldata || !Array.isArray(alldata)) {
//         console.warn('alldata is not an array:', alldata);
//         setTableData([]); // prevent crash
//         return;
//       }

//       const formattedData = alldata.map((item: any, index: number) => ({
//         no: index + 1,
//         orderDate: item.exp_closure_date || '',
//         productName: item.opportunity || '',
//         customer: item.account_name || '',
//         totalAmount: item.total_amount || '',
//         status: item.status || '',
//         id: item.id || '',
//         acct_created_date: item.acct_created_date || '',
//         ranks: item?.opportunity_stages?.[0]?.ranks || '',
//         exp_closure_date: item.exp_closure_date || '',
//         pic: item.pic || '',
//       }));

//       setTableData(formattedData);
//     } catch (err) {
//       console.error('Error fetching opportunity data:', err);
//       setTableData([]);
//     }
//   };

//   fetchData();
// }, [dispatch]);
      

//       const filterByDate = (dateString: string) => {
//         if (!dateString) return false;
    
//         const today = new Date();
//         const expDate = new Date(dateString);
    
//         const diffMonths = (today.getFullYear() - expDate.getFullYear()) * 12 + (today.getMonth() - expDate.getMonth());
    
//         switch (selectedFrequency) {
//             case "Monthly":
//                 return diffMonths === 0;
//             case "Quarterly":
//                 return diffMonths >= 0 && diffMonths < 3;
//             case "Half-Yearly":
//                 return diffMonths >= 0 && diffMonths < 6;
//             case "Yearly":
//                 return diffMonths >= 0 && diffMonths < 12;
//             default:
//                 return true; // "All" case
//         }
//     };
    

    
//   const [selectedRank, setSelectedRank] = useState("All");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedFrequency, setSelectedFrequency] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");

 

//   const filteredSearchData = tableData.filter((row) => {
//     const matchesSearch =
//          row.pic.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesRank = selectedRank === "All" || row.ranks === selectedRank;
//     const matchesCategory = selectedCategory === "All" || row.productName === selectedCategory;
//     const matchesDate = selectedFrequency === "All" || filterByDate(row.exp_closure_date);

//     return matchesRank && matchesCategory && matchesDate && matchesSearch;
// });

// console.log(' filteredSearchData ', filteredSearchData)
//   return (
//     <div className={styles.opportunitystatus}>
//     <div className={styles.boxFull}>
//       <div className={styles.barChartContainer}>
//       <p className={styles.head}>Opportunity Status</p>
//         <div className={styles.rightContainer}>
//           <select className={styles.select} value={selectedRank} onChange={(e) => setSelectedRank(e.target.value)}>
//             <option value="All">All Rank</option>
//             <option value="Rank A">Rank A</option>
//             <option value="Rank B">Rank B</option>
//             <option value="Rank C">Rank C</option>
//             <option value="Rank D">Rank D</option>
//             <option value="Rank E">Rank E</option>
//           </select>

//           <select className={styles.select} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
//             <option value="All">Category</option>
//             <option value="Printer">Printer</option>
//             <option value="Scanner">Scanner</option>
//             <option value="HHT">HHT</option>
//             <option value="Consumables">Consumables</option>
//             <option value="Software">Software</option>
//             <option value="Automation">Automation</option>
//           </select>

//           <select className={styles.select} value={selectedFrequency} onChange={(e) => setSelectedFrequency(e.target.value)}>
//             <option value="All">All Frequency</option>
//             <option value="Yearly">Yearly</option>
//             <option value="Half-Yearly">Half-Yearly</option>
//             <option value="Quarterly">Quarterly</option>
//             <option value="Monthly">Monthly</option>
//           </select>

//           <div className={styles.searchBar}>
//             <MdOutlineSearch className={styles.searchicon} />
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className={styles.search}
//             />
//           </div>
//         </div>

//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>No</th>
//               <th>Order Date</th>
//               <th>Product Name</th>
//               <th>PIC</th>
//               <th>Customer</th>
//               <th>Total Amount</th>
//               <th>Status</th>
              
            

//             </tr>
//           </thead>
//           <tbody>
//             {filteredSearchData.map((item, index) => (
//               <tr key={index}>
//                 <td>{item.no}</td>
//                 <td>{item.orderDate}</td>
//                 <td>{item.productName}</td>
//                 <td>{item.pic}</td>
//                 <td>{item.customer}</td>
//                 <td>{item.totalAmount}</td>
//                 <td>{item.status}</td>


//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>
//   );
// };

// export default AdminOpportunityStatus;


// import React, { useEffect, useState } from 'react';
// import styles from './OpportunityStatus.module.css';
// import { adminOpportunityFormData } from '../../OpportunityAdminTable/slice/opportunityTableSlice';
// import { useDispatch } from 'react-redux';
// import { MdOutlineSearch } from 'react-icons/md';

// /* ── Helpers ── */
// const formatAmount = (val: number | string): string => {
//   const n = Number(val);
//   if (isNaN(n) || n === 0) return '—';
//   if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)}Cr`;
//   if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)}L`;
//   return `₹${n.toLocaleString('en-IN')}`;
// };

// const statusClass = (status: string): string => {
//   switch ((status || '').toLowerCase().trim()) {
//     case 'won':         return styles.badgeWon;
//     case 'lost':        return styles.badgeLost;
//     case 'pending':     return styles.badgePending;
//     case 'in progress':
//     case 'inprogress':  return styles.badgeProgress;
//     default:            return styles.badgeDefault;
//   }
// };

// const statusLabel = (status: string): string =>
//   (status || '').trim() || 'Pending';

// const rankClass = (rank: string): string => {
//   switch ((rank || '').replace(/\s/g, '').toUpperCase()) {
//     case 'RANKA': return styles.rankA;
//     case 'RANKB': return styles.rankB;
//     case 'RANKC': return styles.rankC;
//     case 'RANKD': return styles.rankD;
//     case 'RANKE': return styles.rankE;
//     default:      return styles.badgeDefault;
//   }
// };

// /* ── Empty state ── */
// const EmptyState = () => (
//   <tr>
//     <td colSpan={8} style={{ padding: 0, border: 'none' }}>
//       <div className={styles.emptyState}>
//         <svg className={styles.emptyIcon} viewBox="0 0 48 48" fill="none">
//           <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2"/>
//           <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2"/>
//           <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
//         </svg>
//         <p className={styles.emptyText}>No opportunities match the current filters</p>
//       </div>
//     </td>
//   </tr>
// );

// /* ── Component ── */
// const AdminOpportunityStatus = () => {
//   const dispatch = useDispatch();
//   const [tableData, setTableData] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         /* ── Admin action (kept from admin version) ── */
//         const result = await dispatch(adminOpportunityFormData() as any);
//         const alldata = result.payload;

//         if (!alldata || !Array.isArray(alldata)) {
//           console.warn('alldata is not an array:', alldata);
//           setTableData([]);
//           return;
//         }

//         const formattedData = alldata.map((item: any, index: number) => ({
//           no:               index + 1,
//           orderDate:        item.exp_closure_date || '',
//           productName:      item.opportunity || '',
//           customer:         item.account_name || '',
//           totalAmount:      item.total_amount || '',
//           status:           item.status || '',
//           id:               item.id || '',
//           acct_created_date: item.acct_created_date || '',
//           ranks:            item?.opportunity_stages?.[0]?.ranks || '',
//           exp_closure_date: item.exp_closure_date || '',
//           pic:              item.pic || '',
//         }));

//         setTableData(formattedData);
//       } catch (err) {
//         console.error('Error fetching opportunity data:', err);
//         setTableData([]);
//       }
//     };
//     fetchData();
//   }, [dispatch]);

//   const filterByDate = (dateString: string) => {
//     if (!dateString) return false;
//     const today = new Date();
//     const expDate = new Date(dateString);
//     const diffMonths =
//       (today.getFullYear() - expDate.getFullYear()) * 12 +
//       (today.getMonth() - expDate.getMonth());

//     switch (selectedFrequency) {
//       case 'Monthly':     return diffMonths === 0;
//       case 'Quarterly':   return diffMonths >= 0 && diffMonths < 3;
//       case 'Half-Yearly': return diffMonths >= 0 && diffMonths < 6;
//       case 'Yearly':      return diffMonths >= 0 && diffMonths < 12;
//       default:            return true;
//     }
//   };

//   const [selectedRank,      setSelectedRank]      = useState('All');
//   const [selectedCategory,  setSelectedCategory]  = useState('All');
//   const [selectedFrequency, setSelectedFrequency] = useState('All');
//   const [searchQuery,       setSearchQuery]       = useState('');

//   const filteredSearchData = tableData.filter((row) => {
//     const matchesSearch =
//       !searchQuery ||
//       (row.pic && typeof row.pic === 'string' &&
//         row.pic.toLowerCase().includes(searchQuery.toLowerCase()));

//     const matchesRank     = selectedRank === 'All'      || row.ranks === selectedRank;
//     const matchesCategory = selectedCategory === 'All'  || row.productName === selectedCategory;
//     const matchesDate     = selectedFrequency === 'All' || filterByDate(row.exp_closure_date);

//     return matchesRank && matchesCategory && matchesDate && matchesSearch;
//   });

//   return (
//     <div className={styles.opportunitystatus}>
//       <div className={styles.boxFull}>
//         <div className={styles.barChartContainer}>

//           {/* ── Filter toolbar ── */}
//           <div className={styles.rightContainer}>
//             <select className={styles.select} value={selectedRank} onChange={e => setSelectedRank(e.target.value)}>
//               <option value="All">All Ranks</option>
//               <option value="Rank A">Rank A</option>
//               <option value="Rank B">Rank B</option>
//               <option value="Rank C">Rank C</option>
//               <option value="Rank D">Rank D</option>
//               <option value="Rank E">Rank E</option>
//             </select>

//             <select className={styles.select} value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
//               <option value="All">Category</option>
//               <option value="Printer">Printer</option>
//               <option value="Scanner">Scanner</option>
//               <option value="HHT">HHT</option>
//               <option value="Consumables">Consumables</option>
//               <option value="Software">Software</option>
//               <option value="Automation">Automation</option>
//             </select>

//             <select className={styles.select} value={selectedFrequency} onChange={e => setSelectedFrequency(e.target.value)}>
//               <option value="All">All Frequency</option>
//               <option value="Yearly">Yearly</option>
//               <option value="Half-Yearly">Half-Yearly</option>
//               <option value="Quarterly">Quarterly</option>
//               <option value="Monthly">Monthly</option>
//             </select>

//             <div className={styles.searchBar}>
//               <MdOutlineSearch className={styles.searchicon} />
//               <input
//                 type="text"
//                 placeholder="Search by PIC..."
//                 value={searchQuery}
//                 onChange={e => setSearchQuery(e.target.value)}
//                 className={styles.search}
//               />
//             </div>
//           </div>

//           {/* ── Table ── */}
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>No</th>
//                 <th>Order Date</th>
//                 <th>Product</th>
//                 <th>PIC</th>
//                 <th>Customer</th>
//                 <th>Rank</th>
//                 <th>Amount</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredSearchData.length === 0
//                 ? <EmptyState />
//                 : filteredSearchData.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.no}</td>
//                     <td>{item.orderDate || '—'}</td>
//                     <td>{item.productName || '—'}</td>
//                     <td>{item.pic || '—'}</td>
//                     <td>{item.customer || '—'}</td>
//                     <td>
//                       {item.ranks
//                         ? <span className={`${styles.rankBadge} ${rankClass(item.ranks)}`}>{item.ranks}</span>
//                         : <span style={{ color: '#CBD5E1' }}>—</span>
//                       }
//                     </td>
//                     <td>{formatAmount(item.totalAmount)}</td>
//                     <td>
//                       <span className={`${styles.statusBadge} ${statusClass(item.status)}`}>
//                         {statusLabel(item.status)}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               }
//             </tbody>
//           </table>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminOpportunityStatus;

import React, { useEffect, useState, useMemo } from 'react';
import styles from './OpportunityStatus.module.css';
import { adminOpportunityFormData } from '../../OpportunityAdminTable/slice/opportunityTableSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineSearch } from 'react-icons/md';
import type { RootState } from '../../../app/store';

/* ── Helpers ── */
const formatAmount = (val: number | string): string => {
  const n = Number(val);
  if (isNaN(n) || n === 0) return '—';
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)}Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

const statusClass = (status: string): string => {
  switch ((status || '').toLowerCase().trim()) {
    case 'won':         return styles.badgeWon;
    case 'lost':        return styles.badgeLost;
    case 'pending':     return styles.badgePending;
    case 'in progress':
    case 'inprogress':  return styles.badgeProgress;
    default:            return styles.badgeDefault;
  }
};

const statusLabel = (status: string): string =>
  (status || '').trim() || 'Pending';

const rankClass = (rank: string): string => {
  switch ((rank || '').replace(/\s/g, '').toUpperCase()) {
    case 'RANKA': return styles.rankA;
    case 'RANKB': return styles.rankB;
    case 'RANKC': return styles.rankC;
    case 'RANKD': return styles.rankD;
    case 'RANKE': return styles.rankE;
    default:      return styles.badgeDefault;
  }
};

/* ══════════════════════════════════════════════════════════════
   ACTIVITY FILTER LOGIC
   
   Each opportunity has:
     - last_update        (on the Opportunity model)
     - opportunity_stages (array, each has last_update)
   
   We pick the MOST RECENT activity date from:
     max(opportunity.last_update, max(stage.last_update))
   
   Then compare against today:
     "Not followed up last 7 days"    → last activity > 7 days ago
     "No activity for last 15 days"   → last activity > 15 days ago
     "No updates in last 3 months"    → last activity > 90 days ago
══════════════════════════════════════════════════════════════ */

const getLastActivityDate = (item: any): Date | null => {
  const dates: Date[] = [];

  // From opportunity.last_update
  if (item.last_update) {
    const d = new Date(item.last_update);
    if (!isNaN(d.getTime())) dates.push(d);
  }

  // From opportunity_stages[].last_update
  if (Array.isArray(item.opportunity_stages)) {
    item.opportunity_stages.forEach((stage: any) => {
      if (stage.last_update) {
        const d = new Date(stage.last_update);
        if (!isNaN(d.getTime())) dates.push(d);
      }
    });
  }

  // From opportunity_followup[].end_date
  if (Array.isArray(item.opportunity_followup)) {
    item.opportunity_followup.forEach((f: any) => {
      if (f.end_date) {
        const d = new Date(f.end_date);
        if (!isNaN(d.getTime())) dates.push(d);
      }
    });
  }

  if (dates.length === 0) return null;
  return new Date(Math.max(...dates.map(d => d.getTime())));
};

const daysSinceActivity = (item: any): number | null => {
  const lastDate = getLastActivityDate(item);
  if (!lastDate) return null;
  const today = new Date();
  const diffMs = today.getTime() - lastDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

type ActivityFilter =
  | 'All'
  | 'no_followup_7'
  | 'no_activity_15'
  | 'no_updates_90';

const ACTIVITY_OPTIONS: { value: ActivityFilter; label: string }[] = [
  { value: 'All',            label: 'All Activity'                  },
  { value: 'no_followup_7',  label: 'No Activity up — last 7 days' },
  { value: 'no_activity_15', label: 'No Activity — last 15 days'    },
  { value: 'no_updates_90',  label: 'No Activity — last 3 months'    },
];

const matchesActivityFilter = (
  item: any,
  filter: ActivityFilter
): boolean => {
  if (filter === 'All') return true;

  const days = daysSinceActivity(item);

  // If we have no date info, include in "stale" filters
  // (these are definitely not recently followed up)
  if (days === null) {
    return filter === 'no_followup_7'  ? true
         : filter === 'no_activity_15' ? true
         : filter === 'no_updates_90'  ? true
         : true;
  }

  switch (filter) {
    case 'no_followup_7':  return days > 7;
    case 'no_activity_15': return days > 15;
    case 'no_updates_90':  return days > 90;
    default:               return true;
  }
};

const MONTH_NAME_TO_NUM: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const isWithinGlobalFilter = (
  item: any,
  selectedYear: number,
  selectedMonth: string,
  filterType: 'monthly' | 'yearly'
) => {
  const activityDate =
    getLastActivityDate(item) ||
    (item?.exp_closure_date ? new Date(item.exp_closure_date) : null) ||
    (item?.acct_created_date ? new Date(item.acct_created_date) : null);

  if (!activityDate || Number.isNaN(activityDate.getTime())) return false;

  if (filterType === 'yearly') {
    const fyStart = new Date(selectedYear, 3, 1);
    const fyEnd = new Date(selectedYear + 1, 2, 31, 23, 59, 59, 999);
    return activityDate >= fyStart && activityDate <= fyEnd;
  }

  const monthNum = MONTH_NAME_TO_NUM[selectedMonth];
  if (!monthNum) return true;
  const calendarYear = monthNum <= 3 ? selectedYear + 1 : selectedYear;
  return (
    activityDate.getFullYear() === calendarYear &&
    activityDate.getMonth() + 1 === monthNum
  );
};

const getActivitySortMeta = (item: any): { ageInDays: number; timestamp: number } => {
  const activityDate =
    getLastActivityDate(item) ||
    (item?.last_update ? new Date(item.last_update) : null) ||
    (item?.acct_created_date ? new Date(item.acct_created_date) : null) ||
    (item?.exp_closure_date ? new Date(item.exp_closure_date) : null);

  if (!activityDate || Number.isNaN(activityDate.getTime())) {
    return {
      ageInDays: Number.POSITIVE_INFINITY,
      timestamp: Number.NEGATIVE_INFINITY,
    };
  }

  const diffMs = Date.now() - activityDate.getTime();
  const ageInDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  return {
    ageInDays,
    timestamp: activityDate.getTime(),
  };
};

/* ── Empty state ── */
const EmptyState = () => (
  <tr>
    <td colSpan={9} style={{ padding: 0, border: 'none' }}>
      <div className={styles.emptyState}>
        <svg className={styles.emptyIcon} viewBox="0 0 48 48" fill="none">
          <rect x="8" y="12" width="32" height="28" rx="3" stroke="#94A3B8" strokeWidth="2"/>
          <path d="M16 12V10a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#94A3B8" strokeWidth="2"/>
          <path d="M17 22h14M17 28h10" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p className={styles.emptyText}>No opportunities match the current filters</p>
      </div>
    </td>
  </tr>
);

/* ── Last activity badge ── */
const ActivityBadge: React.FC<{ item: any }> = ({ item }) => {
  const days = daysSinceActivity(item);
  if (days === null) {
    return <span style={{ color: '#CBD5E1', fontSize: 12 }}>—</span>;
  }

  const color =
    days > 90 ? { bg: '#FEE2E2', text: '#B91C1C' }
    : days > 15 ? { bg: '#FEF3C7', text: '#92400E' }
    : days > 7  ? { bg: '#FEF9C3', text: '#A16207' }
    :              { bg: '#DCFCE7', text: '#15803D' };

  const label =
    days === 0 ? 'Today'
    : days === 1 ? '1 day ago'
    : `${days}d ago`;

  return (
    <span style={{
      background:   color.bg,
      color:        color.text,
      borderRadius: 6,
      padding:      '2px 8px',
      fontSize:     11,
      fontWeight:   600,
      whiteSpace:   'nowrap',
    }}>
      {label}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const AdminOpportunityStatus = () => {
  const dispatch = useDispatch<any>();
  const { selectedYear, selectedMonth, filterType, selectedPic } = useSelector(
    (s: RootState) => s.globalFilter
  );
  const salesPersons = useSelector((s: RootState) => s.budget.salesPersons);

  const [rawData, setRawData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const result  = await dispatch(adminOpportunityFormData());
        if (!adminOpportunityFormData.fulfilled.match(result)) {
          const msg = typeof result.payload === 'string'
            ? result.payload
            : 'Failed to load opportunities.';
          setRawData([]);
          setFetchError(msg);
          return;
        }

        const alldata = result.payload;
        if (!alldata || !Array.isArray(alldata)) {
          setRawData([]);
          setFetchError('Unexpected opportunity response format.');
          return;
        }

        // Store raw data for activity filter (needs full item for stage dates)
        setRawData(alldata);
      } catch (err) {
        console.error('Error fetching opportunity data:', err);
        setRawData([]);
        setFetchError('Failed to load opportunities.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, selectedYear, selectedMonth, filterType]);

  // ── Filter state ────────────────────────────────────────────
  const [selectedRank,     setSelectedRank]     = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFrequency,setSelectedFrequency]= useState('All');
  const [activityFilter,   setActivityFilter]   = useState<ActivityFilter>('All');
  const [searchQuery,      setSearchQuery]       = useState('');

  const categoryOptions = useMemo(() => {
    return Array.from(
      new Set(
        rawData
          .map((item) => (item?.opportunity || '').trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [rawData]);

  const selectedPicUsername = useMemo(() => {
    if (!selectedPic || selectedPic === 'all') return null;
    const pic = (Array.isArray(salesPersons) ? salesPersons : []).find(
      (user: any) => String(user.id) === String(selectedPic)
    );
    return (pic?.username || '').toString();
  }, [selectedPic, salesPersons]);

  useEffect(() => {
    if (selectedCategory !== 'All' && !categoryOptions.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
  }, [selectedCategory, categoryOptions]);

  // ── Date filter helper ──────────────────────────────────────
  const filterByDate = (dateString: string) => {
    if (!dateString) return false;
    const today   = new Date();
    const expDate = new Date(dateString);
    const diffMonths =
      (today.getFullYear() - expDate.getFullYear()) * 12 +
      (today.getMonth()   - expDate.getMonth());

    switch (selectedFrequency) {
      case 'Monthly':     return diffMonths === 0;
      case 'Quarterly':   return diffMonths >= 0 && diffMonths < 3;
      case 'Half-Yearly': return diffMonths >= 0 && diffMonths < 6;
      case 'Yearly':      return diffMonths >= 0 && diffMonths < 12;
      default:            return true;
    }
  };

  // ── Apply all filters (memoized) ───────────────────────────
  const filteredData = useMemo(() => {
    return rawData
      .filter(item => {
        if (!isWithinGlobalFilter(item, selectedYear, selectedMonth, filterType)) return false;

        if (selectedPic !== 'all') {
          if (!selectedPicUsername) return false;
          const rowUser = (item?.user || '').toString().toLowerCase();
          if (rowUser !== selectedPicUsername.toLowerCase()) return false;
        }

        // Rank filter
        const rank = item?.opportunity_stages?.[0]?.ranks || '';
        if (selectedRank !== 'All' && rank !== selectedRank) return false;

        // Category filter
        const category = item.opportunity || '';
        if (selectedCategory !== 'All' && category !== selectedCategory) return false;

        // Closure date frequency filter
        if (selectedFrequency !== 'All' && !filterByDate(item.exp_closure_date)) return false;

        // Activity filter ← NEW
        if (!matchesActivityFilter(item, activityFilter)) return false;

        // Search filter (by PIC)
        if (
          searchQuery &&
          !(item.pic || '').toLowerCase().includes(searchQuery.toLowerCase())
        ) return false;

        return true;
      })
      .sort((a, b) => {
        const aSort = getActivitySortMeta(a);
        const bSort = getActivitySortMeta(b);

        if (aSort.ageInDays !== bSort.ageInDays) {
          return aSort.ageInDays - bSort.ageInDays;
        }

        return bSort.timestamp - aSort.timestamp;
      })
      .map((item, index) => ({
        no:               index + 1,
        orderDate:        item.exp_closure_date  || '',
        productName:      item.opportunity       || '',
        customer:         item.account_name      || '',
        totalAmount:      item.total_amount      || '',
        status:           item.status            || '',
        id:               item.id                || '',
        acct_created_date: item.acct_created_date || '',
        ranks:            item?.opportunity_stages?.[0]?.ranks || '',
        exp_closure_date: item.exp_closure_date  || '',
        pic:              item.pic               || '',
        last_update:      item.last_update       || '',
        // Keep raw item for ActivityBadge
        _raw:             item,
      }));
  }, [
    rawData,
    selectedRank,
    selectedCategory,
    selectedFrequency,
    activityFilter,
    searchQuery,
    selectedYear,
    selectedMonth,
    filterType,
    selectedPic,
    selectedPicUsername,
  ]);

  return (
    <div className={styles.opportunitystatus}>
      <div className={styles.boxFull}>
        <div className={styles.barChartContainer}>

          {/* ── Filter toolbar ── */}
          <div className={styles.rightContainer}>

            {/* Rank */}
            <select
              className={styles.select}
              value={selectedRank}
              onChange={e => setSelectedRank(e.target.value)}
            >
              <option value="All">All Ranks</option>
              <option value="Rank A">Rank A</option>
              <option value="Rank B">Rank B</option>
              <option value="Rank C">Rank C</option>
              <option value="Rank D">Rank D</option>
              <option value="Rank E">Rank E</option>
            </select>

            {/* Category */}
            <select
              className={styles.select}
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="All">Category</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Frequency */}
            <select
              className={styles.select}
              value={selectedFrequency}
              onChange={e => setSelectedFrequency(e.target.value)}
            >
              <option value="All">All Frequency</option>
              <option value="Yearly">Yearly</option>
              <option value="Half-Yearly">Half-Yearly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Monthly">Monthly</option>
            </select>

            {/* ── Activity Filter ── NEW ── */}
            <select
              className={styles.select}
              value={activityFilter}
              onChange={e => setActivityFilter(e.target.value as ActivityFilter)}
              style={{
                // Highlight if active filter
                borderColor: activityFilter !== 'All' ? '#F59E0B' : undefined,
                color:       activityFilter !== 'All' ? '#92400E' : undefined,
                background:  activityFilter !== 'All' ? '#FFFBEB' : undefined,
                fontWeight:  activityFilter !== 'All' ? 600       : undefined,
              }}
            >
              {ACTIVITY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Search */}
            <div className={styles.searchBar}>
              <MdOutlineSearch className={styles.searchicon} />
              <input
                type="text"
                placeholder="Search by PIC..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={styles.search}
              />
            </div>

          </div>

          {/* ── Active filter info banner ── */}
          {activityFilter !== 'All' && (
            <div style={{
              background:   '#FFFBEB',
              border:       '1px solid #FDE68A',
              borderRadius: 8,
              padding:      '8px 14px',
              marginBottom: 12,
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'space-between',
              fontSize:     13,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <span style={{ color: '#92400E', fontWeight: 600 }}>
                  {ACTIVITY_OPTIONS.find(o => o.value === activityFilter)?.label}
                </span>
                <span style={{ color: '#92400E' }}>
                  — {filteredData.length} opportunit{filteredData.length !== 1 ? 'ies' : 'y'} found
                </span>
              </div>
              <button
                onClick={() => setActivityFilter('All')}
                style={{
                  background: 'none', border: 'none',
                  color: '#92400E', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                Clear filter
              </button>
            </div>
          )}

          {/* ── Table ── */}
          <div style={{ overflowX: 'auto' }}>
            {fetchError && (
              <div style={{
                marginBottom: 10,
                color: '#B91C1C',
                fontSize: 12,
                fontWeight: 600,
              }}>
                {fetchError}
              </div>
            )}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Order Date</th>
                  <th>Product</th>
                  <th>PIC</th>
                  <th>Customer</th>
                  <th>Rank</th>
                  <th>Amount</th>
                  <th>Last Activity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? (
                    <tr>
                      <td colSpan={9} style={{ padding: 20, textAlign: 'center', color: '#94A3B8' }}>
                        Loading opportunities...
                      </td>
                    </tr>
                  )
                  : filteredData.length === 0
                  ? <EmptyState />
                  : filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.no}</td>
                      <td>{item.orderDate || '—'}</td>
                      <td>{item.productName || '—'}</td>
                      <td>{item.pic || '—'}</td>
                      <td>{item.customer || '—'}</td>
                      <td>
                        {item.ranks
                          ? <span className={`${styles.rankBadge} ${rankClass(item.ranks)}`}>
                              {item.ranks}
                            </span>
                          : <span style={{ color: '#CBD5E1' }}>—</span>
                        }
                      </td>
                      <td>{formatAmount(item.totalAmount)}</td>
                      <td>
                        {/* NEW: shows "3d ago", "15d ago" etc with color */}
                        <ActivityBadge item={item._raw} />
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${statusClass(item.status)}`}>
                          {statusLabel(item.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminOpportunityStatus;
