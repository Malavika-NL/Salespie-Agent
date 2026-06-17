// import React, { useEffect, useState } from 'react';
// import styles from './OpportunityStatus.module.css';
// import { opportunityFormData } from '../../OpportunityTable/slice/opportunityTableSlice';
// import { useDispatch } from 'react-redux';
// import { MdOutlineSearch } from "react-icons/md";

// const OpportunityStatus = () => {

//     const dispatch = useDispatch();
//      const [tableData, setTableData] = useState<any[]>([]);
    
//       useEffect(() => {
//         const fetchData = async () => {
//           const result = await dispatch(opportunityFormData() as any);
//           const alldata = result.payload;
//           // console.log('alldata',alldata);
    
    
//           const formattedData = alldata.map((item: any, index: number) => ({
//             no: index + 1,
//             orderDate: item.exp_closure_date,
//             productName: item.opportunity,
//             customer: item.account_name,
//             totalAmount: item.total_amount,
//             status: item.status,
//             id: item.id,
//             acct_created_date: item.acct_created_date,
//             ranks: item?.opportunity_stages[0]?.ranks,
//             exp_closure_date: item.exp_closure_date,
//             pic : item.pic,
    
//           }));
    
//           setTableData(formattedData);
//         };
    
//         fetchData();
//       }, [dispatch]);
      

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

//   // console.log(' tableData ', tableData)

//   const filteredSearchData = tableData.filter((row) => {
//     const matchesSearch =
//     row.pic && typeof row.pic === "string" && row.pic.toLowerCase().includes(searchQuery.toLowerCase());
   
//     const matchesRank = selectedRank === "All" || row.ranks === selectedRank;
//     const matchesCategory = selectedCategory === "All" || row.productName === selectedCategory;
//     const matchesDate = selectedFrequency === "All" || filterByDate(row.exp_closure_date);

//     return matchesRank && matchesCategory && matchesDate && matchesSearch;
//     // matchesSearch && 
   
// });

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

// export default OpportunityStatus;


// import React, { useEffect, useState } from 'react';
// import styles from './OpportunityStatus.module.css';
// import { opportunityFormData } from '../../OpportunityTable/slice/opportunityTableSlice';
// import { useDispatch } from 'react-redux';
// import { MdOutlineSearch } from 'react-icons/md';

// /* ── Helpers ──────────────────────────────────────────────────────── */

// /** Format raw number → ₹50.05L or ₹5.63M */
// const formatAmount = (val: number | string): string => {
//   const n = Number(val);
//   if (isNaN(n) || n === 0) return '—';
//   if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)}Cr`;
//   if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)}L`;
//   return `₹${n.toLocaleString('en-IN')}`;
// };

// /** Return the CSS module class for a given status string */
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

// /** Fallback label when status is empty */
// const statusLabel = (status: string): string =>
//   (status || '').trim() || 'Pending';

// /** Return CSS class for rank badge */
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

// /* ── Empty state ─────────────────────────────────────────────────── */
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

// /* ── Component ───────────────────────────────────────────────────── */
// const OpportunityStatus = () => {
//   const dispatch = useDispatch();
//   const [tableData, setTableData] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await dispatch(opportunityFormData() as any);
//       const raw = result.payload;
//       const alldata: any[] = Array.isArray(raw)
//         ? raw
//         : Array.isArray(raw?.data)
//           ? raw.data
//           : [];

//       const formattedData = alldata.map((item: any, index: number) => ({
//         no:              index + 1,
//         orderDate:       item.exp_closure_date,
//         productName:     item.opportunity,
//         customer:        item.account_name,
//         totalAmount:     item.total_amount,
//         status:          item.status,
//         id:              item.id,
//         acct_created_date: item.acct_created_date,
//         ranks:           item?.opportunity_stages[0]?.ranks,
//         exp_closure_date: item.exp_closure_date,
//         pic:             item.pic,
//       }));

//       setTableData(formattedData);
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
//       case 'Monthly':    return diffMonths === 0;
//       case 'Quarterly':  return diffMonths >= 0 && diffMonths < 3;
//       case 'Half-Yearly':return diffMonths >= 0 && diffMonths < 6;
//       case 'Yearly':     return diffMonths >= 0 && diffMonths < 12;
//       default:           return true;
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

//     const matchesRank     = selectedRank === 'All'     || row.ranks === selectedRank;
//     const matchesCategory = selectedCategory === 'All' || row.productName === selectedCategory;
//     const matchesDate     = selectedFrequency === 'All'|| filterByDate(row.exp_closure_date);

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

// export default OpportunityStatus;


import React, { useEffect, useState, useMemo } from 'react';
import styles from './OpportunityStatus.module.css';
import { opportunityFormData } from '../../OpportunityTable/slice/opportunityTableSlice';
import { useDispatch } from 'react-redux';
import { MdOutlineSearch } from 'react-icons/md';

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
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
   (copied from AdminOpportunityStatus for consistency)

   We pick the MOST RECENT activity date from:
     max(opportunity.last_update, max(stage.last_update),
         max(followup.end_date))
   Then compare against today.
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
  const today  = new Date();
  const diffMs = today.getTime() - lastDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

type ActivityFilter =
  | 'All'
  | 'no_followup_7'
  | 'no_activity_15'
  | 'no_updates_90'
  | 'no_updates_180'   // ← 6 months
  | 'no_updates_365';

const ACTIVITY_OPTIONS: { value: ActivityFilter; label: string }[] = [
  { value: 'All',            label: 'All Activity'                  },
  { value: 'no_followup_7',  label: 'No Activity up — last 7 days' },
  { value: 'no_activity_15', label: 'No Activity — last 15 days'    },
  { value: 'no_updates_90',  label: 'No Activity — last 3 months'   },
  { value: 'no_updates_180', label: 'No Activity — last 6 months'   }, 
  { value: 'no_updates_365', label: 'No Activity — last 1 year'     }, 
];

const matchesActivityFilter = (
  item: any,
  filter: ActivityFilter
): boolean => {
  if (filter === 'All') return true;

  const days = daysSinceActivity(item);

  // If no date info, treat as stale (include in all "inactive" filters)
  if (days === null) return true;

  switch (filter) {
    case 'no_followup_7':  return days > 7;
    case 'no_activity_15': return days > 15;
    case 'no_updates_90':  return days > 90;
    case 'no_updates_180': return days > 180;  
    case 'no_updates_365': return days > 365;
    default:               return true;
  }
};

/* ══════════════════════════════════════════════════════════════
   ACTIVITY BADGE — shows "3d ago", "15d ago" etc with color
══════════════════════════════════════════════════════════════ */
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
   EMPTY STATE
══════════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const OpportunityStatus = () => {
  const dispatch = useDispatch<any>();

  // ── Raw data (keep full items for activity badge) ─────────
  const [rawData, setRawData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(opportunityFormData() as any);
        const raw    = result.payload;

        const alldata: any[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : [];

        // Store raw items so activity filter can access stage dates
        setRawData(alldata);
      } catch (err) {
        console.error('Error fetching opportunity data:', err);
        setRawData([]);
      }
    };
    fetchData();
  }, [dispatch]);

  // ── Filter state ──────────────────────────────────────────
  const [selectedRank,      setSelectedRank]      = useState('All');
  const [selectedCategory,  setSelectedCategory]  = useState('All');
  const [selectedFrequency, setSelectedFrequency] = useState('All');
  const [activityFilter,    setActivityFilter]    = useState<ActivityFilter>('All');
  const [searchQuery,       setSearchQuery]       = useState('');

  // ── Date/frequency filter helper ──────────────────────────
  const filterByDate = (dateString: string): boolean => {
    if (!dateString) return false;
    const today    = new Date();
    const expDate  = new Date(dateString);
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

  // ── Apply all filters (memoized) ─────────────────────────
  const filteredData = useMemo(() => {
    return rawData
      .filter(item => {
        // ── Rank filter ──────────────────────────────────
        const rank = item?.opportunity_stages?.[0]?.ranks || '';
        if (selectedRank !== 'All' && rank !== selectedRank) return false;

        // ── Category filter ──────────────────────────────
        const category = item.opportunity || '';
        if (selectedCategory !== 'All' && category !== selectedCategory) return false;

        // ── Frequency / closure date filter ──────────────
        if (selectedFrequency !== 'All' && !filterByDate(item.exp_closure_date)) return false;

        // ── Activity filter ───────────────────────────────
        if (!matchesActivityFilter(item, activityFilter)) return false;

        // ── Search filter (by PIC name) ───────────────────
        if (
          searchQuery &&
          !(item.pic || '').toLowerCase().includes(searchQuery.toLowerCase())
        ) return false;

        return true;
      })
      .sort((a, b) => {
        const aTime = getLastActivityDate(a)?.getTime() ?? 0;
        const bTime = getLastActivityDate(b)?.getTime() ?? 0;

        if (bTime !== aTime) {
          return bTime - aTime;
        }

        const aCreated = new Date(a?.acct_created_date || 0).getTime() || 0;
        const bCreated = new Date(b?.acct_created_date || 0).getTime() || 0;
        return bCreated - aCreated;
      })
      .map((item, index) => ({
        no:               index + 1,
        orderDate:        item.exp_closure_date   || '',
        productName:      item.opportunity        || '',
        customer:         item.account_name       || '',
        totalAmount:      item.total_amount       || '',
        status:           item.status             || '',
        id:               item.id                 || '',
        acct_created_date: item.acct_created_date || '',
        ranks:            item?.opportunity_stages?.[0]?.ranks || '',
        exp_closure_date: item.exp_closure_date   || '',
        pic:              item.pic                || '',
        last_update:      item.last_update        || '',
        // Keep raw item reference for ActivityBadge
        _raw:             item,
      }));
  }, [
    rawData,
    selectedRank,
    selectedCategory,
    selectedFrequency,
    activityFilter,
    searchQuery,
  ]);

  /* ════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════ */
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
              <option value="Printer">Printer</option>
              <option value="Scanner">Scanner</option>
              <option value="HHT">HHT</option>
              <option value="Consumables">Consumables</option>
              <option value="Software">Software</option>
              <option value="Automation">Automation</option>
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

            {/* ── Activity Filter (same as AdminOpportunityStatus) ── */}
            <select
              className={styles.select}
              value={activityFilter}
              onChange={e => setActivityFilter(e.target.value as ActivityFilter)}
              style={{
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

          {/* ── Active activity filter banner ── */}
          {activityFilter !== 'All' && (
            <div style={{
              background:     '#FFFBEB',
              border:         '1px solid #FDE68A',
              borderRadius:   8,
              padding:        '8px 14px',
              marginBottom:   12,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              fontSize:       13,
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
                  background:     'none',
                  border:         'none',
                  color:          '#92400E',
                  cursor:         'pointer',
                  fontSize:       13,
                  fontWeight:     600,
                  textDecoration: 'underline',
                }}
              >
                Clear filter
              </button>
            </div>
          )}

          {/* ── Table ── */}
          <div style={{ overflowX: 'auto' }}>
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
                {filteredData.length === 0
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

                      {/* ── Last Activity badge (NEW) ── */}
                      <td>
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

export default OpportunityStatus;
