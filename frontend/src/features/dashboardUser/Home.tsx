// import React from 'react';
// import styles from './Home.module.css';
// import Header from './Header/Header';

// import UserSpeedometer from './speedometer/Speedometer';
// import CustomFunnelChart from './FunnelGraph/funnelgraph';
// import PieChartComponent from './PieChart/Piechart';
// import BarComponent from './MonthWiseBudget/month';
// import BarChartComponent from './Category Wise opportunity/BarChart';
// import OpportunityStatus from './OpportunityStatus/OpportunityStatus';

// const SalesUserDashboard: React.FC = () => {
//     return (
//         <div className={styles.mainContent}>
//             <Header />
//             <div className={styles.middleContainer}>

//                 <div className={styles.box7}>
//                     <BarChartComponent />
//                 </div>
//                 <div className={styles.box7}>
//                     <UserSpeedometer />
//                 </div>
//                 <div className={styles.box7}>
//                     <CustomFunnelChart />
//                 </div>
//                 <div className={styles.box6}>
//                     <PieChartComponent />
//                 </div>

//                 <div className={styles.box7}>
//                     <BarComponent />
//                 </div>

//                 {/* <div className={styles.box7}>
//                     <BarComponent />
//                 </div> */}


//             </div>
//             <OpportunityStatus />
//         </div>
//     );
// };

// export default SalesUserDashboard;
// src/features/dashboarduser/home.tsx
// import React from 'react';
// import Header from './Header/Header';
// import UserSpeedometer from './speedometer/Speedometer';
// import CustomFunnelChart from './FunnelGraph/funnelgraph';
// import PieChartComponent from './PieChart/Piechart';
// import BarComponent from './MonthWiseBudget/month';
// import BarChartComponent from './Category Wise opportunity/BarChart';
// import OpportunityStatus from './OpportunityStatus/OpportunityStatus';
// import styles from './Home.module.css';

// /* ── Inline SVG Icons ── */
// const IconRevenue = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//   </svg>
// );
// const IconOpps = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
//     <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
//   </svg>
// );
// const IconWon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="20 6 9 17 4 12" />
//   </svg>
// );
// const IconTarget = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
//   </svg>
// );

// interface KPICardProps {
//   icon: React.ReactNode;
//   color: 'indigo' | 'cyan' | 'emerald' | 'amber';
//   label: string;
//   value: string;
//   trend: string;
//   up: boolean;
// }

// const KPICard: React.FC<KPICardProps> = ({ icon, color, label, value, trend, up }) => (
//   <div className={styles.kpiCard}>
//     <div className={`${styles.kpiIconWrap} ${styles[color]}`}>{icon}</div>
//     <div className={styles.kpiBody}>
//       <span className={styles.kpiLabel}>{label}</span>
//       <span className={styles.kpiValue}>{value}</span>
//       <span className={`${styles.kpiBadge} ${up ? styles.up : styles.down}`}>
//         {up ? '↑' : '↓'} {trend}
//       </span>
//     </div>
//   </div>
// );

// const SalesUserDashboard: React.FC = () => {
//   return (
//     <div className={styles.dashboardRoot}>
//       <Header />

//       <main className={styles.mainContent}>

//         {/* ── KPI Row ── */}
//         <div className={styles.kpiGrid}>
//           <KPICard icon={<IconRevenue />} color="indigo"  label="Total Revenue"      value="₹84.2M" trend="12.4% vs last month" up={true}  />
//           <KPICard icon={<IconOpps />}    color="cyan"    label="Open Opportunities" value="248"    trend="8.1% vs last month"  up={true}  />
//           <KPICard icon={<IconWon />}     color="emerald" label="Deals Won"          value="63"     trend="3.2% vs last month"  up={false} />
//           <KPICard icon={<IconTarget />}  color="amber"   label="Target Achievement" value="74%"    trend="5.7% vs last month"  up={true}  />
//         </div>

//         {/* ── Row 1: Category Bar + Speedometer ── */}
//         <div className={styles.chartsRow}>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Category Wise Opportunity</span>
//               <span className={styles.cardBadge}>By Value</span>
//             </div>
//             <BarChartComponent />
//           </div>

//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Achievements</span>
//               {/* <span className={styles.cardBadge}>YTD</span> */}
//             </div>
//             <UserSpeedometer />
//           </div>
//         </div>

//         {/* ── Row 2: Funnel + Pie + Budget ── */}
//         <div className={styles.chartsRow3}>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Sales Funnel</span>
//               <span className={styles.cardBadge}>By Stage</span>
//             </div>
//             <CustomFunnelChart />
//           </div>

//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Business Bifurcation</span>
//               <span className={styles.cardBadge}>Vertical</span>
//             </div>
//             <PieChartComponent />
//           </div>

//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Month Wise Budget vs Sales</span>
//               <span className={styles.cardBadge}>FY 2024–25</span>
//             </div>
//             <BarComponent />
//           </div>
//         </div>

//         {/* ── Opportunity Status Table ── */}
//         <div className={styles.tableCard}>
//           <div className={styles.cardHeader}>
//             <span className={styles.cardTitle}>Opportunity Pipeline</span>
//             <span className={styles.cardBadge}>All Stages</span>
//           </div>
//           <OpportunityStatus />
//         </div>

//       </main>
//     </div>
//   );
// };

// export default SalesUserDashboard;


// ═══════════════════════════════════════════════════════════════
// src/features/dashboardUser/Home.tsx
// ═══════════════════════════════════════════════════════════════

// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import type { RootState, AppDispatch } from '../../app/store';
// import { fetchCurrentMonthBudget } from '../Budget/slice/budgetSlice';
// import Header from './Header/Header';
// import UserSpeedometer from './speedometer/Speedometer';
// import CustomFunnelChart from './FunnelGraph/funnelgraph';
// import PieChartComponent from './PieChart/Piechart';
// import BarComponent from './MonthWiseBudget/month';
// import BarChartComponent from './Category Wise opportunity/BarChart';
// import OpportunityStatus from './OpportunityStatus/OpportunityStatus';
// import styles from './Home.module.css';

// /* ══════════════════════════════════════════════════════════════
//    SVG ICONS
//    ══════════════════════════════════════════════════════════════ */

// const IconRevenue = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="12" y1="1" x2="12" y2="23" />
//     <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//   </svg>
// );

// const IconBudget = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="2" y="4" width="20" height="16" rx="2" />
//     <path d="M12 8v8" />
//     <path d="M8 12h8" />
//   </svg>
// );

// const IconSpent = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//   </svg>
// );

// const IconWallet = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
//     <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
//     <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
//   </svg>
// );

// const IconDeals = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//   </svg>
// );

// const IconOpps = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//     <circle cx="9" cy="7" r="4" />
//     <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
//     <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//   </svg>
// );

// const IconWon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="20 6 9 17 4 12" />
//   </svg>
// );

// const IconTarget = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <circle cx="12" cy="12" r="10" />
//     <circle cx="12" cy="12" r="6" />
//     <circle cx="12" cy="12" r="2" />
//   </svg>
// );

// /* ══════════════════════════════════════════════════════════════
//    HELPER FUNCTIONS
//    ══════════════════════════════════════════════════════════════ */

// const formatAmount = (value: number, currency: string = 'INR'): string => {
//   const symbol = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }[currency] || '₹';
//   if (!value || isNaN(value)) return `${symbol}0`;
//   if (value >= 10000000) return `${symbol}${(value / 10000000).toFixed(1)}Cr`;
//   if (value >= 100000) return `${symbol}${(value / 100000).toFixed(1)}L`;
//   if (value >= 1000) return `${symbol}${(value / 1000).toFixed(1)}K`;
//   return `${symbol}${value.toLocaleString()}`;
// };

// /* ══════════════════════════════════════════════════════════════
//    KPI CARD COMPONENT
//    ══════════════════════════════════════════════════════════════ */

// interface KPICardProps {
//   icon: React.ReactNode;
//   color: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate';
//   label: string;
//   value: string;
//   trend: string;
//   up: boolean;
//   onClick?: () => void;
//   subtitle?: string;
// }

// const KPICard: React.FC<KPICardProps> = ({ icon, color, label, value, trend, up, onClick, subtitle }) => (
//   <div className={`${styles.kpiCard} ${onClick ? styles.kpiClickable : ''}`} onClick={onClick}>
//     <div className={`${styles.kpiIconWrap} ${styles[color]}`}>{icon}</div>
//     <div className={styles.kpiBody}>
//       <span className={styles.kpiLabel}>{label}</span>
//       <span className={styles.kpiValue}>{value}</span>
//       <div className={styles.kpiFooter}>
//         {subtitle && <span className={styles.kpiSubtitle}>{subtitle}</span>}
//         <span className={`${styles.kpiBadge} ${up ? styles.up : styles.down}`}>
//             {up ? '↑' : '↓'} {trend}
//         </span>
//     </div>
//     </div>
//   </div>
// );

// /* ══════════════════════════════════════════════════════════════
//    CATEGORY MINI CHART
//    ══════════════════════════════════════════════════════════════ */

// interface CategoryMiniChartProps {
//   categories: any[];
//   currency: string;
// }

// const CategoryMiniChart: React.FC<CategoryMiniChartProps> = ({ categories, currency }) => {
//   if (!categories || categories.length === 0) {
//     return (
//       <div className={styles.noData}>
//         <span className={styles.noDataIcon}>📊</span>
//         <span>No categories allocated for this month</span>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.categoryMiniList}>
//       {categories.slice(0, 5).map((cat: any) => {
//         const pct = cat.utilization_pct || 0;
//         const isOver = pct >= 100;
//         const isWarn = pct >= (cat.alert_threshold || 80) && !isOver;

//         return (
//           <div key={cat.id || cat.category} className={styles.categoryMiniRow}>
//             <div className={styles.categoryMiniInfo}>
//               <span className={styles.categoryMiniIcon}>{cat.icon || '📦'}</span>
//               <span className={styles.categoryMiniName}>
//                 {cat.display_name || cat.category_label || cat.category}
//               </span>
//               <span className={`${styles.categoryMiniPct} ${isOver ? styles.pctRed : isWarn ? styles.pctAmber : styles.pctGreen}`}>
//                 {pct}%
//               </span>
//             </div>
//             <div className={styles.categoryMiniTrack}>
//               <div
//                 className={`${styles.categoryMiniFill} ${isOver ? styles.fillRed : isWarn ? styles.fillAmber : styles.fillGreen}`}
//                 style={{ width: `${Math.min(pct, 100)}%` }}
//               />
//             </div>
//             <div className={styles.categoryMiniAmounts}>
//               <span className={styles.categorySpent}>{formatAmount(cat.spent, currency)}</span>
//               <span className={styles.categorySeparator}>/</span>
//               <span className={styles.categoryAllocated}>{formatAmount(cat.allocated, currency)}</span>
//             </div>
//           </div>
//         );
//       })}
//       {categories.length > 5 && (
//         <div className={styles.categoryMiniMore}>+{categories.length - 5} more categories</div>
//       )}
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    MONTHLY PROGRESS CHART
//    ══════════════════════════════════════════════════════════════ */

// interface MonthlyProgressProps {
//   budgetData: any;
// }

// const MonthlyProgress: React.FC<MonthlyProgressProps> = ({ budgetData }) => {
//   if (!budgetData || !budgetData.has_data) {
//     return (
//       <div className={styles.noData}>
//         <span className={styles.noDataIcon}>📈</span>
//         <span>No progress data available</span>
//       </div>
//     );
//   }

//   const utilizationPct = budgetData.utilization_pct || 0;
//   const dealsProgress = budgetData.monthly_target_deals > 0
//     ? Math.round((budgetData.deals_closed_this_month / budgetData.monthly_target_deals) * 100)
//     : 0;
//   const daysProgress = budgetData.days_elapsed && budgetData.days_elapsed > 0
//     ? Math.round((budgetData.days_elapsed / 30) * 100)
//     : 0;

//   const isBudgetCritical = utilizationPct >= 100;
//   const isBudgetHealthy = utilizationPct < 80;

//   return (
//     <div className={styles.monthlyProgress}>
//       {/* Budget Used */}
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Budget Used</span>
//           <span className={styles.progressValue}>{utilizationPct}%</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div
//             className={`${styles.progressFill} ${isBudgetCritical ? styles.fillRed : isBudgetHealthy ? styles.fillGreen : styles.fillAmber}`}
//             style={{ width: `${Math.min(utilizationPct, 100)}%` }}
//           />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{formatAmount(budgetData.monthly_spent, budgetData.currency)} spent</span>
//           <span>of {formatAmount(budgetData.monthly_budget, budgetData.currency)}</span>
//         </div>
//       </div>

//       {/* Deals Progress */}
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Deals Closed</span>
//           <span className={styles.progressValue}>
//             {budgetData.deals_closed_this_month}/{budgetData.monthly_target_deals}
//           </span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div
//             className={`${styles.progressFill} ${styles.fillIndigo}`}
//             style={{ width: `${Math.min(dealsProgress, 100)}%` }}
//           />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{dealsProgress}% of target</span>
//           <span>{budgetData.monthly_target_deals - budgetData.deals_closed_this_month} remaining</span>
//         </div>
//       </div>

//       {/* Days Progress */}
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Month Progress</span>
//           <span className={styles.progressValue}>Day {budgetData.days_elapsed}</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div
//             className={`${styles.progressFill} ${styles.fillCyan}`}
//             style={{ width: `${daysProgress}%` }}
//           />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{budgetData.days_elapsed} days elapsed</span>
//           <span>{budgetData.days_remaining} days left</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    MAIN COMPONENT
//    ══════════════════════════════════════════════════════════════ */

// const SalesUserDashboard: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   // Get current month budget data from Redux
//   const { currentMonth, currentMonthLoading } = useSelector((s: RootState) => s.budget);

//   // Fetch current month's budget on mount
//   useEffect(() => {
//     dispatch(fetchCurrentMonthBudget());
//   }, [dispatch]);

//   // Extract data
//   const data = currentMonth || {};
//   const hasData = data.has_data === true;
//   const currency = data.currency || 'INR';

//   // Determine budget health
//   const utilizationPct = data.utilization_pct || 0;
//   const isBudgetHealthy = utilizationPct < 80;
//   const isBudgetCritical = utilizationPct >= 100;

//   return (
//     <div className={styles.dashboardRoot}>
//       <Header />

//       <main className={styles.mainContent}>

//         {/* ══════════════════════════════════════════════════════════════
//             CURRENT MONTH HEADER
//             ══════════════════════════════════════════════════════════════ */}
//         {hasData && (
//           <div className={styles.monthHeader}>
//             <div className={styles.monthHeaderLeft}>
//               <span className={styles.monthIcon}>📅</span>
//               <div className={styles.monthInfo}>
//                 <span className={styles.monthTitle}>{data.current_month}</span>
//                 <span className={styles.monthSubtitle}>{data.budget_title}</span>
//               </div>
//             </div>
//             <div className={styles.monthHeaderRight}>
//               <span className={styles.monthPeriodBadge}>{data.period?.toUpperCase()} Budget</span>
//               <button 
//                 className={styles.viewFullBudgetBtn}
//                 onClick={() => navigate('/user/budget')}
//               >
//                 View Full Budget →
//               </button>
//             </div>
//           </div>
//         )}

//         {/* ══════════════════════════════════════════════════════════════
//             KPI ROW - CURRENT MONTH DATA
//             ══════════════════════════════════════════════════════════════ */}
//         {hasData ? (
//           <div className={styles.kpiGrid}>
            
//             {/* 1. Monthly Revenue Target */}
//             <KPICard
//               icon={<IconRevenue />}
//               color="indigo"
//               label="Monthly Revenue Target"
//               value={formatAmount(data.monthly_revenue_target || 0, currency)}
//               trend={`Target for ${data.current_month}`}
//               up={true}
//               onClick={() => navigate('/user/budget')}
//             />

//             {/* 2. Monthly Budget */}
//             <KPICard
//               icon={<IconBudget />}
//               color="cyan"
//               label="Monthly Budget"
//               value={formatAmount(data.monthly_budget || 0, currency)}
//               subtitle={`${data.days_remaining || 0} days remaining`}
//               trend={`Day ${data.days_elapsed || 0} of month`}
//               up={true}
//               onClick={() => navigate('/user/budget')}
//             />

//             {/* 3. Monthly Spent */}
//             <KPICard
//               icon={<IconSpent />}
//               color={isBudgetCritical ? 'rose' : isBudgetHealthy ? 'emerald' : 'amber'}
//               label="Monthly Spent"
//               value={formatAmount(data.monthly_spent || 0, currency)}
//               subtitle={`${utilizationPct}% utilized`}
//               trend={`${formatAmount(data.burn_rate || 0, currency)}/month burn rate`}
//               up={!isBudgetHealthy}
//               onClick={() => navigate('/user/budget')}
//             />

//             {/* 4. Monthly Remaining */}
//             <KPICard
//               icon={<IconWallet />}
//               color={(data.monthly_remaining || 0) > 0 ? 'purple' : 'rose'}
//               label="Monthly Remaining"
//               value={formatAmount(Math.abs(data.monthly_remaining || 0), currency)}
//               subtitle={(data.monthly_remaining || 0) > 0 ? 'Available to spend' : 'Over budget!'}
//               trend={(data.monthly_remaining || 0) > 0 ? 'Within budget' : 'Exceeded limit'}
//               up={(data.monthly_remaining || 0) > 0}
//               onClick={() => navigate('/user/budget')}
//             />

//             {/* 5. Deals This Month */}
//             <KPICard
//               icon={<IconDeals />}
//               color="amber"
//               label="Deals Closed This Month"
//               value={`${data.deals_closed_this_month || 0} / ${data.monthly_target_deals || 0}`}
//               subtitle={`${data.monthly_target_deals - data.deals_closed_this_month} deals remaining`}
//               trend={`Target: ${data.monthly_target_deals || 0} deals`}
//               up={(data.deals_closed_this_month || 0) >= (data.monthly_target_deals || 0)}
//               onClick={() => navigate('/user/budget')}
//             />
//           </div>
//         ) : (
//           // Fallback to default KPIs if no budget data
//           <div className={styles.kpiGrid}>
//             <KPICard icon={<IconRevenue />} color="indigo"  label="Total Revenue"      value="₹84.2M" trend="12.4% vs last month" up={true}  />
//             <KPICard icon={<IconOpps />}    color="cyan"    label="Open Opportunities" value="248"    trend="8.1% vs last month"  up={true}  />
//             <KPICard icon={<IconWon />}     color="emerald" label="Deals Won"          value="63"     trend="3.2% vs last month"  up={false} />
//             <KPICard icon={<IconTarget />}  color="amber"   label="Target Achievement" value="74%"    trend="5.7% vs last month"  up={true}  />
//           </div>
//         )}

//         {/* ══════════════════════════════════════════════════════════════
//             NO DATA STATE
//             ══════════════════════════════════════════════════════════════ */}
//         {!hasData && !currentMonthLoading && (
//           <div className={styles.noDataCard}>
//             <div className={styles.noDataIconLarge}>💰</div>
//             <h3 className={styles.noDataTitle}>No Budget for This Month</h3>
//             <p className={styles.noDataText}>
//               Create a budget to track your monthly spending, targets, and ROI metrics.
//             </p>
//             <button 
//               className={styles.createBudgetBtn}
//               onClick={() => navigate('/user/budget/new')}
//             >
//               + Create Budget
//             </button>
//           </div>
//         )}

//         {/* ══════════════════════════════════════════════════════════════
//             ROW 1: Category Breakdown + Speedometer
//             ══════════════════════════════════════════════════════════════ */}
//         <div className={styles.chartsRow}>
          
//           {/* Monthly Category Breakdown */}
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>📊 Monthly Budget by Category</span>
//               <span 
//                 className={styles.cardBadge} 
//                 style={{ cursor: 'pointer' }}
//                 onClick={() => navigate('/user/budget')}
//               >
//                 View All →
//               </span>
//             </div>
//             {hasData ? (
//               <CategoryMiniChart 
//                 categories={data.categories || []} 
//                 currency={currency}
//               />
//             ) : (
//               <div className={styles.noData}>
//                 <span className={styles.noDataIcon}>📊</span>
//                 <span>No budget data available</span>
//               </div>
//             )}
//           </div>

//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Achievements</span>
//             </div>
//             <UserSpeedometer />
//           </div>
//         </div>

//         {/* ══════════════════════════════════════════════════════════════
//             ROW 2: Funnel + Pie + Monthly Progress
//             ══════════════════════════════════════════════════════════════ */}
//         <div className={styles.chartsRow3}>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Sales Funnel</span>
//               <span className={styles.cardBadge}>By Stage</span>
//             </div>
//             <CustomFunnelChart />
//           </div>

//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Business Bifurcation</span>
//               <span className={styles.cardBadge}>Vertical</span>
//             </div>
//             <PieChartComponent />
//           </div>

//           {/* Monthly Progress */}
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>📈 Monthly Progress</span>
//               <span className={styles.cardBadge}>{data.current_month || 'This Month'}</span>
//             </div>
//             <MonthlyProgress budgetData={data} />
//           </div>
//         </div>

//         {/* ══════════════════════════════════════════════════════════════
//             ROW 3: Category Opportunity + Month Wise Budget
//             ══════════════════════════════════════════════════════════════ */}
//         <div className={styles.chartsRow}>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Category Wise Opportunity</span>
//               <span className={styles.cardBadge}>By Value</span>
//             </div>
//             <BarChartComponent />
//           </div>

//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Month Wise Budget vs Sales</span>
//               <span className={styles.cardBadge}>FY 2024–25</span>
//             </div>
//             <BarComponent />
//           </div>
//         </div>

//         {/* ══════════════════════════════════════════════════════════════
//             Opportunity Status Table
//             ══════════════════════════════════════════════════════════════ */}
//         <div className={styles.tableCard}>
//           <div className={styles.cardHeader}>
//             <span className={styles.cardTitle}>Opportunity Pipeline</span>
//             <span className={styles.cardBadge}>All Stages</span>
//           </div>
//           <OpportunityStatus />
//         </div>

//       </main>
//     </div>
//   );
// };

// export default SalesUserDashboard;


// ═══════════════════════════════════════════════════════════════
// src/features/dashboardUser/Home.tsx
// ═══════════════════════════════════════════════════════════════

// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import type { RootState, AppDispatch } from '../../app/store';
// import { fetchCurrentMonthBudget } from '../Budget/slice/budgetSlice';
// import Header from './Header/Header';
// import UserSpeedometer from './speedometer/Speedometer';
// import CustomFunnelChart from './FunnelGraph/funnelgraph';
// import PieChartComponent from './PieChart/Piechart';
// import BarComponent from './MonthWiseBudget/month';
// import BarChartComponent from './Category Wise opportunity/BarChart';
// import OpportunityStatus from './OpportunityStatus/OpportunityStatus';
// import styles from './Home.module.css';

// /* ══════════════════════════════════════════════════════════════
//    SVG ICONS
//    ══════════════════════════════════════════════════════════════ */

// const IconRevenue = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="12" y1="1" x2="12" y2="23" />
//     <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//   </svg>
// );

// const IconBudget = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="2" y="4" width="20" height="16" rx="2" />
//     <path d="M12 8v8" />
//     <path d="M8 12h8" />
//   </svg>
// );

// const IconSpent = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//   </svg>
// );

// const IconWallet = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
//     <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
//     <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
//   </svg>
// );

// const IconDeals = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//   </svg>
// );

// const IconOpps = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//     <circle cx="9" cy="7" r="4" />
//     <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
//     <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//   </svg>
// );

// const IconWon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="20 6 9 17 4 12" />
//   </svg>
// );

// const IconTarget = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <circle cx="12" cy="12" r="10" />
//     <circle cx="12" cy="12" r="6" />
//     <circle cx="12" cy="12" r="2" />
//   </svg>
// );

// /* ══════════════════════════════════════════════════════════════
//    HELPER FUNCTIONS
//    ══════════════════════════════════════════════════════════════ */

// const formatAmount = (value: number, currency: string = 'INR'): string => {
//   const symbol = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }[currency] || '₹';
//   if (!value || isNaN(value)) return `${symbol}0`;
//   if (value >= 10000000) return `${symbol}${(value / 10000000).toFixed(1)}Cr`;
//   if (value >= 100000) return `${symbol}${(value / 100000).toFixed(1)}L`;
//   if (value >= 1000) return `${symbol}${(value / 1000).toFixed(1)}K`;
//   return `${symbol}${value.toLocaleString()}`;
// };

// /* ══════════════════════════════════════════════════════════════
//    KPI CARD COMPONENT
//    ══════════════════════════════════════════════════════════════ */

// interface KPICardProps {
//   icon: React.ReactNode;
//   color: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate';
//   label: string;
//   value: string;
//   trend: string;
//   up: boolean;
//   onClick?: () => void;
//   subtitle?: string;
// }

// const KPICard: React.FC<KPICardProps> = ({ icon, color, label, value, trend, up, onClick, subtitle }) => (
//   <div className={`${styles.kpiCard} ${onClick ? styles.kpiClickable : ''}`} onClick={onClick}>
//     <div className={`${styles.kpiIconWrap} ${styles[color]}`}>{icon}</div>
//     <div className={styles.kpiBody}>
//       <span className={styles.kpiLabel}>{label}</span>
//       <span className={styles.kpiValue}>{value}</span>
//       <div className={styles.kpiFooter}>
//         {subtitle && <span className={styles.kpiSubtitle}>{subtitle}</span>}
//         <span className={`${styles.kpiBadge} ${up ? styles.up : styles.down}`}>
//           {up ? '↑' : '↓'} {trend}
//         </span>
//       </div>
//     </div>
//   </div>
// );

// /* ══════════════════════════════════════════════════════════════
//    CATEGORY MINI CHART
//    ══════════════════════════════════════════════════════════════ */

// interface CategoryMiniChartProps {
//   categories: any[];
//   currency: string;
// }

// const CategoryMiniChart: React.FC<CategoryMiniChartProps> = ({ categories, currency }) => {
//   if (!categories || categories.length === 0) {
//     return (
//       <div className={styles.noData}>
//         <span className={styles.noDataIcon}>📊</span>
//         <span>No categories allocated for this month</span>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.categoryMiniList}>
//       {categories.slice(0, 5).map((cat: any) => {
//         const pct    = cat.utilization_pct || 0;
//         const isOver = pct >= 100;
//         const isWarn = pct >= (cat.alert_threshold || 80) && !isOver;

//         return (
//           <div key={cat.id} className={styles.categoryMiniRow}>
//             <div className={styles.categoryMiniInfo}>
//               <span className={styles.categoryMiniName}>
//                 {cat.name}                         {/* ← was cat.display_name/category */}
//               </span>
//               <span className={`${styles.categoryMiniPct} ${isOver ? styles.pctRed : isWarn ? styles.pctAmber : styles.pctGreen}`}>
//                 {pct}%
//               </span>
//             </div>
//             <div className={styles.categoryMiniTrack}>
//               <div
//                 className={`${styles.categoryMiniFill} ${isOver ? styles.fillRed : isWarn ? styles.fillAmber : styles.fillGreen}`}
//                 style={{ width: `${Math.min(pct, 100)}%` }}
//               />
//             </div>
//             <div className={styles.categoryMiniAmounts}>
//               <span className={styles.categorySpent}>{formatAmount(cat.spent, currency)}</span>
//               <span className={styles.categorySeparator}>/</span>
//               <span className={styles.categoryAllocated}>{formatAmount(cat.allocated, currency)}</span>
//             </div>
//           </div>
//         );
//       })}
//       {categories.length > 5 && (
//         <div className={styles.categoryMiniMore}>+{categories.length - 5} more categories</div>
//       )}
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    MONTHLY PROGRESS CHART
//    ══════════════════════════════════════════════════════════════ */

// interface MonthlyProgressProps {
//   budgetData: any;
// }

// const MonthlyProgress: React.FC<MonthlyProgressProps> = ({ budgetData }) => {
//   if (!budgetData || !budgetData.has_data) {
//     return (
//       <div className={styles.noData}>
//         <span className={styles.noDataIcon}>📈</span>
//         <span>No progress data available</span>
//       </div>
//     );
//   }

//   const utilizationPct = budgetData.utilization_pct || 0;
//   const dealsProgress = budgetData.monthly_target_deals > 0
//     ? Math.round((budgetData.deals_closed_this_month / budgetData.monthly_target_deals) * 100)
//     : 0;
//   const daysProgress = budgetData.days_elapsed && budgetData.days_elapsed > 0
//     ? Math.round((budgetData.days_elapsed / 30) * 100)
//     : 0;

//   const isBudgetCritical = utilizationPct >= 100;
//   const isBudgetHealthy = utilizationPct < 80;

//   return (
//     <div className={styles.monthlyProgress}>
//       {/* Budget Used */}
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Budget Used</span>
//           <span className={styles.progressValue}>{utilizationPct}%</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div
//             className={`${styles.progressFill} ${isBudgetCritical ? styles.fillRed : isBudgetHealthy ? styles.fillGreen : styles.fillAmber}`}
//             style={{ width: `${Math.min(utilizationPct, 100)}%` }}
//           />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{formatAmount(budgetData.monthly_spent, budgetData.currency)} spent</span>
//           <span>of {formatAmount(budgetData.monthly_budget, budgetData.currency)}</span>
//         </div>
//       </div>

//       {/* Deals Progress */}
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Deals Closed</span>
//           <span className={styles.progressValue}>
//             {budgetData.deals_closed_this_month}/{budgetData.monthly_target_deals}
//           </span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div
//             className={`${styles.progressFill} ${styles.fillIndigo}`}
//             style={{ width: `${Math.min(dealsProgress, 100)}%` }}
//           />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{dealsProgress}% of target</span>
//           <span>{budgetData.monthly_target_deals - budgetData.deals_closed_this_month} remaining</span>
//         </div>
//       </div>

//       {/* Days Progress */}
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Month Progress</span>
//           <span className={styles.progressValue}>Day {budgetData.days_elapsed}</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div
//             className={`${styles.progressFill} ${styles.fillCyan}`}
//             style={{ width: `${daysProgress}%` }}
//           />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{budgetData.days_elapsed} days elapsed</span>
//           <span>{budgetData.days_remaining} days left</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    MAIN COMPONENT
//    ══════════════════════════════════════════════════════════════ */

// const SalesUserDashboard: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const { currentMonth, currentMonthLoading } = useSelector((s: RootState) => s.budget);

//   useEffect(() => {
//     dispatch(fetchCurrentMonthBudget());
//   }, [dispatch]);

//   const data = currentMonth || {};
//   const hasData = data.has_data === true;
//   const currency = data.currency || 'INR';

//   const utilizationPct = data.utilization_pct || 0;
//   const isBudgetHealthy = utilizationPct < 80;
//   const isBudgetCritical = utilizationPct >= 100;

//   return (
//     <div className={styles.dashboardRoot}>
//       <Header />

//       <main className={styles.mainContent}>

//         {/* CURRENT MONTH HEADER */}
//         {hasData && (
//           <div className={styles.monthHeader}>
//             <div className={styles.monthHeaderLeft}>
//               {/* <span className={styles.monthIcon}>📅</span> */}
//               <div className={styles.monthInfo}>
//                 <span className={styles.monthTitle}>{data.current_month}</span>
//                 <span className={styles.monthSubtitle}>{data.budget_title}</span>
//               </div>
//             </div>
//             <div className={styles.monthHeaderRight}>
//               <span className={styles.monthPeriodBadge}>{data.period?.toUpperCase()} Budget</span>
//               <button
//                 className={styles.viewFullBudgetBtn}
//                 onClick={() => navigate('/user/budget/overview')}
//               >
//                 View Full Budget →
//               </button>
//             </div>
//           </div>
//         )}

//         {/* KPI ROW */}
//         {hasData ? (
//           <div className={styles.kpiGrid}>
//             <KPICard
//               icon={<IconRevenue />}
//               color="indigo"
//               label="Monthly Revenue Target"
//               value={formatAmount(data.monthly_revenue_target || 0, currency)}
//               trend={`Target for ${data.current_month}`}
//               up={true}
              
//             />
//             <KPICard
//               icon={<IconBudget />}
//               color="cyan"
//               label="Monthly Budget"
//               value={formatAmount(data.monthly_budget || 0, currency)}
//               subtitle={`${data.days_remaining || 0} days remaining`}
//               trend={`Day ${data.days_elapsed || 0} of month`}
//               up={true}
              
//             />
//             <KPICard
//               icon={<IconSpent />}
//               color={isBudgetCritical ? 'rose' : isBudgetHealthy ? 'emerald' : 'amber'}
//               label="Monthly Spent"
//               value={formatAmount(data.monthly_spent || 0, currency)}
//               subtitle={`${utilizationPct}% utilized`}
//               trend={`${formatAmount(data.burn_rate || 0, currency)}/month burn rate`}
//               up={!isBudgetHealthy}
              
//             />
//             <KPICard
//               icon={<IconWallet />}
//               color={(data.monthly_remaining || 0) > 0 ? 'purple' : 'rose'}
//               label="Monthly Remaining"
//               value={formatAmount(Math.abs(data.monthly_remaining || 0), currency)}
//               subtitle={(data.monthly_remaining || 0) > 0 ? 'Available to spend' : 'Over budget!'}
//               trend={(data.monthly_remaining || 0) > 0 ? 'Within budget' : 'Exceeded limit'}
//               up={(data.monthly_remaining || 0) > 0}
              
//             />
//             <KPICard
//               icon={<IconDeals />}
//               color="amber"
//               label="Deals Closed This Month"
//               value={`${data.deals_closed_this_month || 0} / ${data.monthly_target_deals || 0}`}
//               subtitle={`${data.monthly_target_deals - data.deals_closed_this_month} deals remaining`}
//               trend={`Target: ${data.monthly_target_deals || 0} deals`}
//               up={(data.deals_closed_this_month || 0) >= (data.monthly_target_deals || 0)}
              
//             />
//           </div>
//         ) : (
//           <div className={styles.kpiGrid}>
//             <KPICard icon={<IconRevenue />} color="indigo"  label="Total Revenue"      value="₹84.2M" trend="12.4% vs last month" up={true}  />
//             <KPICard icon={<IconOpps />}    color="cyan"    label="Open Opportunities" value="248"    trend="8.1% vs last month"  up={true}  />
//             <KPICard icon={<IconWon />}     color="emerald" label="Deals Won"          value="63"     trend="3.2% vs last month"  up={false} />
//             <KPICard icon={<IconTarget />}  color="amber"   label="Target Achievement" value="74%"    trend="5.7% vs last month"  up={true}  />
//           </div>
//         )}

//         {/* NO DATA STATE */}
//         {!hasData && !currentMonthLoading && (
//           <div className={styles.noDataCard}>
//             <div className={styles.noDataIconLarge}>💰</div>
//             <h3 className={styles.noDataTitle}>No Budget for This Month</h3>
//             <p className={styles.noDataText}>
//               Create a budget to track your monthly spending, targets, and ROI metrics.
//             </p>
//             <button
//               className={styles.createBudgetBtn}
//               onClick={() => navigate('/user/budget/new')}
//             >
//               + Create Budget
//             </button>
//           </div>
//         )}

//         {/* ROW 1: Category Breakdown + Speedometer */}
//         <div className={styles.chartsRow}>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}> Monthly Budget by Category</span>
//               <span
//                 className={styles.cardBadge}
//                 style={{ cursor: 'pointer' }}
//                 onClick={() => navigate('/user/budget/overview')}
//               >
//                 View All →
//               </span>
//             </div>
//             {hasData ? (
//               <CategoryMiniChart
//                 categories={data.categories || []}
//                 currency={currency}
//               />
//             ) : (
//               <div className={styles.noData}>
//                 <span className={styles.noDataIcon}>📊</span>
//                 <span>No budget data available</span>
//               </div>
//             )}
//           </div>

//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Achievements</span>
//             </div>
//             <UserSpeedometer />
//           </div>
//         </div>

//         {/* ROW 2: Funnel + Pie + Monthly Progress */}
//         <div className={styles.chartsRow3}>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Sales Funnel</span>
//               <span className={styles.cardBadge}>By Stage</span>
//             </div>
//             <CustomFunnelChart />
//           </div>

//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Business Bifurcation</span>
//               <span className={styles.cardBadge}>Vertical</span>
//             </div>
//             <PieChartComponent />
//           </div>

//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}> Monthly Progress</span>
//               <span className={styles.cardBadge}>{data.current_month || 'This Month'}</span>
//             </div>
//             <MonthlyProgress budgetData={data} />
//           </div>
//         </div>

//         {/* ROW 3: Category Opportunity + Month Wise Budget */}
//         <div className={styles.chartsRow}>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Category Wise Opportunity</span>
//               <span className={styles.cardBadge}>By Value</span>
//             </div>
//             <BarChartComponent />
//           </div>

//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Month Wise Budget vs Sales</span>
//               <span className={styles.cardBadge}>FY 2026-27</span>
//             </div>
//             <BarComponent />
//           </div>
//         </div>

//         {/* Opportunity Status Table */}
//         <div className={styles.tableCard}>
//           <div className={styles.cardHeader}>
//             <span className={styles.cardTitle}>Opportunity Pipeline</span>
//             <span className={styles.cardBadge}>All Stages</span>
//           </div>
//           <OpportunityStatus />
//         </div>

//       </main>
//     </div>
//   );
// };

// export default SalesUserDashboard;


// src/features/dashboardUser/Home.tsx

// import React, { useEffect, useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import type { RootState, AppDispatch } from '../../app/store';
// import { fetchCurrentMonthBudget } from '../Budget/slice/budgetSlice';
// import {
//   setFilterType,
//   setSelectedMonth,
//   setSelectedYear,
//   resetFilter,
//   FY_MONTHS,
// } from '../globalFilter/globalFilterSlice';
// import Header from './Header/Header';
// import UserSpeedometer from './speedometer/Speedometer';
// import CustomFunnelChart from './FunnelGraph/funnelgraph';
// import PieChartComponent from './PieChart/Piechart';
// import BarComponent from './MonthWiseBudget/month';
// import BarChartComponent from './Category Wise opportunity/BarChart';
// import OpportunityStatus from './OpportunityStatus/OpportunityStatus';
// import styles from './Home.module.css';

// /* ══════════════════════════════════════════════════════════════
//    SVG ICONS
// ══════════════════════════════════════════════════════════════ */
// const IconRevenue = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="12" y1="1" x2="12" y2="23" />
//     <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//   </svg>
// );
// const IconBudget = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="2" y="4" width="20" height="16" rx="2" />
//     <path d="M12 8v8" /><path d="M8 12h8" />
//   </svg>
// );
// const IconSpent = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//   </svg>
// );
// const IconWallet = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
//     <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
//     <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
//   </svg>
// );
// const IconDeals = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//   </svg>
// );
// const IconOpps = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//     <circle cx="9" cy="7" r="4" />
//     <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
//     <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//   </svg>
// );
// const IconWon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="20 6 9 17 4 12" />
//   </svg>
// );
// const IconTarget = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <circle cx="12" cy="12" r="10" />
//     <circle cx="12" cy="12" r="6" />
//     <circle cx="12" cy="12" r="2" />
//   </svg>
// );

// /* ══════════════════════════════════════════════════════════════
//    HELPERS
// ══════════════════════════════════════════════════════════════ */
// const formatAmount = (value: number, currency: string = 'INR'): string => {
//   const symbol = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }[currency] || '₹';
//   if (!value || isNaN(value)) return `${symbol}0`;
//   if (value >= 10000000) return `${symbol}${(value / 10000000).toFixed(1)}Cr`;
//   if (value >= 100000)   return `${symbol}${(value / 100000).toFixed(1)}L`;
//   if (value >= 1000)     return `${symbol}${(value / 1000).toFixed(1)}K`;
//   return `${symbol}${value.toLocaleString()}`;
// };

// /* ══════════════════════════════════════════════════════════════
//    KPI CARD
// ══════════════════════════════════════════════════════════════ */
// interface KPICardProps {
//   icon: React.ReactNode;
//   color: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate';
//   label: string; value: string; trend: string; up: boolean;
//   onClick?: () => void; subtitle?: string;
// }

// const KPICard: React.FC<KPICardProps> = ({
//   icon, color, label, value, trend, up, onClick, subtitle,
// }) => (
//   <div className={`${styles.kpiCard} ${onClick ? styles.kpiClickable : ''}`} onClick={onClick}>
//     <div className={`${styles.kpiIconWrap} ${styles[color]}`}>{icon}</div>
//     <div className={styles.kpiBody}>
//       <span className={styles.kpiLabel}>{label}</span>
//       <span className={styles.kpiValue}>{value}</span>
//       <div className={styles.kpiFooter}>
//         {subtitle && <span className={styles.kpiSubtitle}>{subtitle}</span>}
//         <span className={`${styles.kpiBadge} ${up ? styles.up : styles.down}`}>
//           {up ? '↑' : '↓'} {trend}
//         </span>
//       </div>
//     </div>
//   </div>
// );

// /* ══════════════════════════════════════════════════════════════
//    CATEGORY MINI CHART
// ══════════════════════════════════════════════════════════════ */
// const CategoryMiniChart: React.FC<{ categories: any[]; currency: string }> = ({
//   categories, currency,
// }) => {
//   const activeCategories = (categories || []).filter(
//     cat => (cat.allocated || 0) > 0
//   );

//   if (!categories || categories.length === 0) {
//     return (
//       <div className={styles.noData}>
//         <span className={styles.noDataIcon}>📊</span>
//         <span>No categories in budget</span>
//       </div>
//     );
//   }

//   if (activeCategories.length === 0) {
//     return (
//       <div className={styles.noData}>
//         <span className={styles.noDataIcon}>📊</span>
//         <span>No categories allocated for this month</span>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.categoryMiniList}>
//       {activeCategories.slice(0, 6).map((cat: any, idx: number) => {
//         const pct    = cat.monthly_share_pct || cat.utilization_pct || 0;
//         const isHigh = pct >= 40;
//         const isMid  = pct >= 20 && !isHigh;

//         return (
//           <div key={cat.id || idx} className={styles.categoryMiniRow}>
//             <div className={styles.categoryMiniInfo}>
//               <span className={styles.categoryMiniName}>{cat.name || 'Uncategorized'}</span>
//               <span className={`${styles.categoryMiniPct} ${
//                 isHigh ? styles.pctGreen : isMid ? styles.pctAmber : styles.pctGreen
//               }`}>
//                 {pct}%
//               </span>
//             </div>
//             <div className={styles.categoryMiniTrack}>
//               <div
//                 className={`${styles.categoryMiniFill} ${
//                   isHigh ? styles.fillGreen : isMid ? styles.fillAmber : styles.fillGreen
//                 }`}
//                 style={{ width: `${Math.min(pct, 100)}%` }}
//               />
//             </div>
//             <div className={styles.categoryMiniAmounts}>
//               <span className={styles.categorySpent}>
//                 {formatAmount(cat.allocated || 0, currency)}
//               </span>
//               <span className={styles.categorySeparator}>/</span>
//               <span className={styles.categoryAllocated}>
//                 {formatAmount(cat.fy_allocated || 0, currency)}
//               </span>
//             </div>
//             {cat.subcategories && cat.subcategories.length > 0 && (
//               <div style={{ paddingLeft: 16, marginTop: 4 }}>
//                 {cat.subcategories
//                   .filter((sub: any) => (sub.allocated || 0) > 0)
//                   .map((sub: any) => (
//                     <div key={sub.id} style={{
//                       display: 'flex', justifyContent: 'space-between',
//                       fontSize: 11, color: '#64748B', padding: '2px 0',
//                     }}>
//                       <span>↳ {sub.name}</span>
//                       <span>{formatAmount(sub.allocated || 0, currency)}</span>
//                     </div>
//                   ))}
//               </div>
//             )}
//           </div>
//         );
//       })}
//       {activeCategories.length > 6 && (
//         <div className={styles.categoryMiniMore}>
//           +{activeCategories.length - 6} more categories
//         </div>
//       )}
//       <div style={{
//         marginTop: 8, padding: '6px 0',
//         borderTop: '1px solid #F1F5F9',
//         fontSize: 11, color: '#94A3B8',
//       }}>
//         Left = This month · Right = Full FY · % = Share of monthly budget
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    MONTHLY PROGRESS
// ══════════════════════════════════════════════════════════════ */
// const MonthlyProgress: React.FC<{ budgetData: any }> = ({ budgetData }) => {
//   if (!budgetData || !budgetData.has_data) {
//     return (
//       <div className={styles.noData}>
//         <span className={styles.noDataIcon}>📈</span>
//         <span>No progress data available</span>
//       </div>
//     );
//   }

//   const utilizationPct   = budgetData.utilization_pct || 0;
//   const isBudgetCritical = utilizationPct >= 100;
//   const isBudgetHealthy  = utilizationPct < 80;

//   const dealsProgress = budgetData.monthly_target_deals > 0
//     ? Math.round((budgetData.deals_closed_this_month / budgetData.monthly_target_deals) * 100)
//     : 0;

//   const daysProgress = budgetData.days_elapsed > 0
//     ? Math.round((budgetData.days_elapsed / 30) * 100) : 0;

//   return (
//     <div className={styles.monthlyProgress}>
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Budget Used</span>
//           <span className={styles.progressValue}>{utilizationPct}%</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div
//             className={`${styles.progressFill} ${
//               isBudgetCritical ? styles.fillRed
//               : isBudgetHealthy ? styles.fillGreen
//               : styles.fillAmber
//             }`}
//             style={{ width: `${Math.min(utilizationPct, 100)}%` }}
//           />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{formatAmount(budgetData.monthly_spent, budgetData.currency)} spent</span>
//           <span>of {formatAmount(budgetData.monthly_budget, budgetData.currency)}</span>
//         </div>
//       </div>
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Deals Closed</span>
//           <span className={styles.progressValue}>
//             {budgetData.deals_closed_this_month}/{budgetData.monthly_target_deals}
//           </span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div className={`${styles.progressFill} ${styles.fillIndigo}`}
//             style={{ width: `${Math.min(dealsProgress, 100)}%` }} />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{dealsProgress}% of target</span>
//           <span>{Math.max(0, (budgetData.monthly_target_deals || 0) - (budgetData.deals_closed_this_month || 0))} remaining</span>
//         </div>
//       </div>
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Month Progress</span>
//           <span className={styles.progressValue}>Day {budgetData.days_elapsed}</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div className={`${styles.progressFill} ${styles.fillCyan}`}
//             style={{ width: `${daysProgress}%` }} />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{budgetData.days_elapsed} days elapsed</span>
//           <span>{budgetData.days_remaining} days left</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    UNIVERSAL FILTER BAR
// ══════════════════════════════════════════════════════════════ */
// const UniversalFilterBar: React.FC<{
//   filterType:    'monthly' | 'yearly';
//   selectedMonth: string;
//   selectedYear:  number;
//   onFilterType:  (v: 'monthly' | 'yearly') => void;
//   onMonth:       (v: string) => void;
//   onYear:        (v: number) => void;
//   onReset:       () => void;
//   isFiltered:    boolean;
// }> = ({
//   filterType, selectedMonth, selectedYear,
//   onFilterType, onMonth, onYear, onReset, isFiltered,
// }) => {
//   const now           = new Date();
//   const currentFYYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
//   const yearOptions   = [currentFYYear - 2, currentFYYear - 1, currentFYYear].filter(y => y > 2020);

//   return (
//     <div style={{
//       display: 'flex', alignItems: 'center', gap: 12,
//       padding: '12px 20px', background: '#fff', borderRadius: 12,
//       boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16,
//       flexWrap: 'wrap',
//       border: isFiltered ? '1px solid #C7D2FE' : '1px solid #F1F5F9',
//     }}>

//       <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
//         View by:
//       </span>

//       {/* Toggle: Year / Month */}
//       <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 8, padding: 3, gap: 2 }}>
//         {(['yearly', 'monthly'] as const).map(type => (
//           <button
//             key={type}
//             onClick={() => onFilterType(type)}
//             style={{
//               padding: '5px 14px', borderRadius: 6, border: 'none',
//               cursor: 'pointer', fontSize: 12, fontWeight: 600,
//               background: filterType === type ? '#4F46E5' : 'transparent',
//               color:      filterType === type ? '#fff'     : '#64748B',
//               transition: 'all 0.15s ease',
//             }}
//           >
//             {type === 'yearly' ? 'Year (FY)' : 'Month'}
//           </button>
//         ))}
//       </div>

//       {/* Year dropdown */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//         <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>FY</span>
//         <select
//           value={selectedYear}
//           onChange={e => onYear(Number(e.target.value))}
//           style={{
//             padding: '6px 10px', borderRadius: 8, border: '1px solid #E2E8F0',
//             fontSize: 13, background: '#fff', cursor: 'pointer',
//             fontWeight: 600, color: '#334155',
//           }}
//         >
//           {yearOptions.map(y => (
//             <option key={y} value={y}>{y}–{String(y + 1).slice(2)}</option>
//           ))}
//         </select>
//       </div>

//       {/* Month dropdown — only in monthly mode */}
//       {filterType === 'monthly' && (
//         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//           <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Month</span>
//           <select
//             value={selectedMonth}
//             onChange={e => onMonth(e.target.value)}
//             style={{
//               padding: '6px 10px', borderRadius: 8, border: '1px solid #E2E8F0',
//               fontSize: 13, background: '#fff', cursor: 'pointer',
//               fontWeight: 600, color: '#334155',
//             }}
//           >
//             {FY_MONTHS.map(m => (
//               <option key={m} value={m}>{m}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Active filter badge */}
//       {isFiltered && (
//         <div style={{
//           background: '#EEF2FF', color: '#4338CA', borderRadius: 6,
//           padding: '4px 10px', fontSize: 12, fontWeight: 600,
//           display: 'flex', alignItems: 'center', gap: 6,
//         }}>
//           <span>
//             {filterType === 'monthly'
//               ? `${selectedMonth} FY${selectedYear}–${String(selectedYear + 1).slice(2)}`
//               : `FY ${selectedYear}–${String(selectedYear + 1).slice(2)}`
//             }
//           </span>
//           <button
//             onClick={onReset}
//             style={{
//               background: 'none', border: 'none', cursor: 'pointer',
//               color: '#4338CA', fontWeight: 700, fontSize: 14,
//               lineHeight: 1, padding: '0 2px',
//             }}
//             title="Reset to current"
//           >×</button>
//         </div>
//       )}

//       <div style={{ flex: 1 }} />

//       <span style={{ fontSize: 12, color: '#94A3B8' }}>
//         Showing:{' '}
//         {filterType === 'monthly'
//           ? `${selectedMonth} FY${selectedYear}–${String(selectedYear + 1).slice(2)}`
//           : `Full FY ${selectedYear}–${String(selectedYear + 1).slice(2)}`
//         }
//       </span>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ══════════════════════════════════════════════════════════════ */
// const SalesUserDashboard: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const { currentMonth, currentMonthLoading } = useSelector(
//     (s: RootState) => s.budget
//   );

//   // ── Read globalFilter ──────────────────────────────────────
//   const { filterType, selectedMonth, selectedYear } = useSelector(
//     (s: RootState) => s.globalFilter
//   );

//   // Is filter different from defaults?
//   const now            = new Date();
//   const currentFYYear  = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
//   const currentMonthName = now.toLocaleString('default', { month: 'long' });
//   const isFiltered =
//     selectedYear !== currentFYYear ||
//     (filterType === 'monthly' && selectedMonth !== currentMonthName);

//   // ── Fetch budget data ──────────────────────────────────────
//   const fetchBudgetData = useCallback(() => {
//     dispatch(fetchCurrentMonthBudget());
//   }, [dispatch]);

//   useEffect(() => {
//     fetchBudgetData();
//   }, [fetchBudgetData]);

//   // ── Filter handlers ────────────────────────────────────────
//   const handleFilterType = (type: 'monthly' | 'yearly') => dispatch(setFilterType(type));
//   const handleMonth      = (month: string)               => dispatch(setSelectedMonth(month));
//   const handleYear       = (year: number)                => dispatch(setSelectedYear(year));
//   const handleReset      = ()                            => dispatch(resetFilter());

//   const data     = currentMonth || {};
//   const hasData  = data.has_data === true;
//   const currency = data.currency || 'INR';

//   const utilizationPct   = data.utilization_pct || 0;
//   const isBudgetHealthy  = utilizationPct < 80;
//   const isBudgetCritical = utilizationPct >= 100;

//   // key prop forces child components to re-mount when filter changes
//   const filterKey = `${selectedYear}-${filterType === 'monthly' ? selectedMonth : 'fy'}`;

//   return (
//     <div className={styles.dashboardRoot}>

//       {/* ══════════════════════════════════════════════════════
//           UNIVERSAL FILTER BAR — ABOVE HEADER
//           This is the FIRST thing on the page
//       ══════════════════════════════════════════════════════ */}
//       <UniversalFilterBar
//         filterType={filterType}
//         selectedMonth={selectedMonth}
//         selectedYear={selectedYear}
//         onFilterType={handleFilterType}
//         onMonth={handleMonth}
//         onYear={handleYear}
//         onReset={handleReset}
//         isFiltered={isFiltered}
//       />

//       {/* Header — reads globalFilter from store for its own data */}
//       <Header />

//       <main className={styles.mainContent}>

//         {/* CURRENT MONTH HEADER */}
//         {hasData && (
//           <div className={styles.monthHeader}>
//             <div className={styles.monthHeaderLeft}>
//               <div className={styles.monthInfo}>
//                 <span className={styles.monthTitle}>{data.current_month}</span>
//                 <span className={styles.monthSubtitle}>{data.budget_title}</span>
//               </div>
//             </div>
//             <div className={styles.monthHeaderRight}>
//               <span className={styles.monthPeriodBadge}>{data.period?.toUpperCase()} Budget</span>
//               <button
//                 className={styles.viewFullBudgetBtn}
//                 onClick={() => navigate('/user/budget/overview')}
//               >
//                 View Full Budget →
//               </button>
//             </div>
//           </div>
//         )}

//         {/* KPI ROW */}
//         {hasData ? (
//           <div className={styles.kpiGrid}>
//             <KPICard
//               icon={<IconRevenue />} color="indigo"
//               label="Monthly Revenue Target"
//               value={formatAmount(data.monthly_revenue_target || 0, currency)}
//               trend={`Target for ${data.current_month}`}
//               up={true}
//             />
//             <KPICard
//               icon={<IconBudget />} color="cyan"
//               label="Monthly Budget"
//               value={formatAmount(data.monthly_budget || 0, currency)}
//               subtitle={`${data.days_remaining || 0} days remaining`}
//               trend={`Day ${data.days_elapsed || 0} of month`}
//               up={true}
//             />
//             <KPICard
//               icon={<IconSpent />}
//               color={isBudgetCritical ? 'rose' : isBudgetHealthy ? 'emerald' : 'amber'}
//               label="Monthly Spent"
//               value={formatAmount(data.monthly_spent || 0, currency)}
//               subtitle={`${utilizationPct}% utilized`}
//               trend={`${formatAmount(data.burn_rate || 0, currency)}/month burn rate`}
//               up={!isBudgetHealthy}
//             />
//             <KPICard
//               icon={<IconWallet />}
//               color={(data.monthly_remaining || 0) > 0 ? 'purple' : 'rose'}
//               label="Monthly Remaining"
//               value={formatAmount(Math.abs(data.monthly_remaining || 0), currency)}
//               subtitle={(data.monthly_remaining || 0) > 0 ? 'Available to spend' : 'Over budget!'}
//               trend={(data.monthly_remaining || 0) > 0 ? 'Within budget' : 'Exceeded limit'}
//               up={(data.monthly_remaining || 0) > 0}
//             />
//             <KPICard
//               icon={<IconDeals />} color="amber"
//               label="Deals Closed This Month"
//               value={`${data.deals_closed_this_month || 0} / ${data.monthly_target_deals || 0}`}
//               subtitle={`${Math.max(0, (data.monthly_target_deals || 0) - (data.deals_closed_this_month || 0))} deals remaining`}
//               trend={`Target: ${data.monthly_target_deals || 0} deals`}
//               up={(data.deals_closed_this_month || 0) >= (data.monthly_target_deals || 0)}
//             />
//           </div>
//         ) : (
//           <div className={styles.kpiGrid}>
//             <KPICard icon={<IconRevenue />} color="indigo"  label="Total Revenue"      value="—" trend="No data" up={false} />
//             <KPICard icon={<IconOpps />}    color="cyan"    label="Open Opportunities" value="—" trend="No data" up={false} />
//             <KPICard icon={<IconWon />}     color="emerald" label="Deals Won"          value="—" trend="No data" up={false} />
//             <KPICard icon={<IconTarget />}  color="amber"   label="Target Achievement" value="—" trend="No data" up={false} />
//           </div>
//         )}

//         {/* NO DATA STATE */}
//         {!hasData && !currentMonthLoading && (
//           <div className={styles.noDataCard}>
//             <div className={styles.noDataIconLarge}>💰</div>
//             <h3 className={styles.noDataTitle}>No Budget for This Month</h3>
//             <p className={styles.noDataText}>
//               Create a budget to track your monthly spending, targets, and ROI metrics.
//             </p>
//             <button
//               className={styles.createBudgetBtn}
//               onClick={() => navigate('/user/budget/new')}
//             >
//               + Create Budget
//             </button>
//           </div>
//         )}

//         {/* ROW 1: Category Breakdown + Speedometer */}
//         <div className={styles.chartsRow}>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Monthly Budget by Category</span>
//               <span className={styles.cardBadge} style={{ cursor: 'pointer' }}
//                 onClick={() => navigate('/user/budget/overview')}>
//                 View All →
//               </span>
//             </div>
//             {hasData
//               ? <CategoryMiniChart categories={data.categories || []} currency={currency} />
//               : <div className={styles.noData}><span className={styles.noDataIcon}>📊</span><span>No budget data available</span></div>
//             }
//           </div>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Achievements</span>
//             </div>
//             <UserSpeedometer key={`speed-${filterKey}`} />
//           </div>
//         </div>

//         {/* ROW 2: Funnel + Pie + Monthly Progress */}
//         <div className={styles.chartsRow3}>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Sales Funnel</span>
//               <span className={styles.cardBadge}>By Stage</span>
//             </div>
//             <CustomFunnelChart key={`funnel-${filterKey}`} />
//           </div>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Business Bifurcation</span>
//               <span className={styles.cardBadge}>Vertical</span>
//             </div>
//             <PieChartComponent key={`pie-${filterKey}`} />
//           </div>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Monthly Progress</span>
//               <span className={styles.cardBadge}>{data.current_month || 'This Month'}</span>
//             </div>
//             <MonthlyProgress budgetData={data} />
//           </div>
//         </div>

//         {/* ROW 3: Category Opportunity + Month Wise Budget */}
//         <div className={styles.chartsRow}>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Category Wise Opportunity</span>
//               <span className={styles.cardBadge}>By Value</span>
//             </div>
//             <BarChartComponent key={`bar-${filterKey}`} />
//           </div>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Month Wise Budget vs Sales</span>
//               <span className={styles.cardBadge}>
//                 FY {selectedYear}–{String(selectedYear + 1).slice(2)}
//               </span>
//             </div>
//             <BarComponent key={`budget-${filterKey}`} />
//           </div>
//         </div>

//         {/* Opportunity Status — NOT affected by filter */}
//         <div className={styles.tableCard}>
//           <div className={styles.cardHeader}>
//             <span className={styles.cardTitle}>Opportunity Pipeline</span>
//             <span className={styles.cardBadge}>All Stages</span>
//           </div>
//           <OpportunityStatus />
//         </div>

//       </main>
//     </div>
//   );
// };

// export default SalesUserDashboard;


// import React, { useEffect, useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import type { RootState, AppDispatch } from '../../app/store';
// import { fetchCurrentMonthBudget } from '../Budget/slice/budgetSlice';
// import {
//   setFilterType, setSelectedMonth, setSelectedYear,
//   resetFilter, FY_MONTHS,
// } from '../globalFilter/globalFilterSlice';
// import Header from './Header/Header';
// import UserSpeedometer from './speedometer/Speedometer';
// import CustomFunnelChart from './FunnelGraph/funnelgraph';
// import PieChartComponent from './PieChart/Piechart';
// import BarComponent from './MonthWiseBudget/month';
// import BarChartComponent from './Category Wise opportunity/BarChart';
// import OpportunityStatus from './OpportunityStatus/OpportunityStatus';
// import styles from './Home.module.css';

// /* ══════════════════════════════════════════════════════════════
//    ICONS (same as admin dashboard)
// ══════════════════════════════════════════════════════════════ */
// const IconRevenue = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//   </svg>
// );
// const IconBudget = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M12 8v8" /><path d="M8 12h8" />
//   </svg>
// );
// const IconAchieved = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="20 6 9 17 4 12" />
//   </svg>
// );
// const IconWallet = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
//   </svg>
// );
// const IconDeals = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//   </svg>
// );

// /* ══════════════════════════════════════════════════════════════
//    HELPERS
// ══════════════════════════════════════════════════════════════ */
// const formatAmount = (value: number, currency: string = 'INR'): string => {
//   const symbol = { INR:'₹', USD:'$', EUR:'€', GBP:'£' }[currency] || '₹';
//   if (!value || isNaN(value)) return `${symbol}0`;
//   if (value >= 10000000) return `${symbol}${(value / 10000000).toFixed(1)}Cr`;
//   if (value >= 100000)   return `${symbol}${(value / 100000).toFixed(1)}L`;
//   if (value >= 1000)     return `${symbol}${(value / 1000).toFixed(1)}K`;
//   return `${symbol}${value.toLocaleString()}`;
// };

// /* ══════════════════════════════════════════════════════════════
//    KPI CARD (same as admin)
// ══════════════════════════════════════════════════════════════ */
// interface KPICardProps {
//   icon: React.ReactNode;
//   color: 'indigo'|'cyan'|'emerald'|'amber'|'purple'|'rose'|'slate';
//   label: string; value: string; trend: string; up: boolean;
//   onClick?: () => void; subtitle?: string;
// }

// const KPICard: React.FC<KPICardProps> = ({
//   icon, color, label, value, trend, up, onClick, subtitle,
// }) => (
//   <div className={`${styles.kpiCard} ${onClick ? styles.kpiClickable : ''}`} onClick={onClick}>
//     <div className={`${styles.kpiIconWrap} ${styles[color]}`}>{icon}</div>
//     <div className={styles.kpiBody}>
//       <span className={styles.kpiLabel}>{label}</span>
//       <span className={styles.kpiValue}>{value}</span>
//       <div className={styles.kpiFooter}>
//         {subtitle && <span className={styles.kpiSubtitle}>{subtitle}</span>}
//         <span className={`${styles.kpiBadge} ${up ? styles.up : styles.down}`}>
//           {up ? '↑' : '↓'} {trend}
//         </span>
//       </div>
//     </div>
//   </div>
// );

// /* ══════════════════════════════════════════════════════════════
//    CATEGORY MINI CHART (allocation breakdown)
// ══════════════════════════════════════════════════════════════ */
// const CategoryMiniChart: React.FC<{ categories: any[]; currency: string }> = ({
//   categories, currency,
// }) => {
//   const active = (categories || []).filter(c => (c.allocated || 0) > 0);

//   if (!categories || categories.length === 0) {
//     return (<div className={styles.noData}><span className={styles.noDataIcon}>📊</span><span>No categories in budget</span></div>);
//   }
//   if (active.length === 0) {
//     return (<div className={styles.noData}><span className={styles.noDataIcon}>📊</span><span>No categories allocated for this month</span></div>);
//   }

//   return (
//     <div className={styles.categoryMiniList}>
//       {active.slice(0, 6).map((cat: any, idx: number) => {
//         const pct = cat.monthly_share_pct || cat.utilization_pct || 0;
//         const isHigh = pct >= 40;
//         const isMid  = pct >= 20 && !isHigh;
//         return (
//           <div key={cat.id || idx} className={styles.categoryMiniRow}>
//             <div className={styles.categoryMiniInfo}>
//               <span className={styles.categoryMiniName}>{cat.name || 'Uncategorized'}</span>
//               <span className={`${styles.categoryMiniPct} ${isHigh ? styles.pctGreen : isMid ? styles.pctAmber : styles.pctGreen}`}>{pct}%</span>
//             </div>
//             <div className={styles.categoryMiniTrack}>
//               <div className={`${styles.categoryMiniFill} ${isHigh ? styles.fillGreen : isMid ? styles.fillAmber : styles.fillGreen}`} style={{ width:`${Math.min(pct, 100)}%` }} />
//             </div>
//             <div className={styles.categoryMiniAmounts}>
//               <span className={styles.categorySpent}>{formatAmount(cat.allocated || 0, currency)}</span>
//               <span className={styles.categorySeparator}>/</span>
//               <span className={styles.categoryAllocated}>{formatAmount(cat.fy_allocated || 0, currency)}</span>
//             </div>
//             {cat.subcategories?.length > 0 && (
//               <div style={{ paddingLeft:16, marginTop:4 }}>
//                 {cat.subcategories.filter((s: any) => (s.allocated||0) > 0).map((sub: any) => (
//                   <div key={sub.id} style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#64748B', padding:'2px 0' }}>
//                     <span>↳ {sub.name}</span>
//                     <span>{formatAmount(sub.allocated || 0, currency)}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         );
//       })}
//       {active.length > 6 && <div className={styles.categoryMiniMore}>+{active.length - 6} more</div>}
//       <div style={{ marginTop:8, padding:'6px 0', borderTop:'1px solid #F1F5F9', fontSize:11, color:'#94A3B8' }}>
//         Left = This month · Right = Full FY · % = Share of monthly budget
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    MONTHLY PROGRESS (uses achievement data — NOT spent)
// ══════════════════════════════════════════════════════════════ */
// const MonthlyProgress: React.FC<{ budgetData: any }> = ({ budgetData }) => {
//   if (!budgetData || !budgetData.has_data) {
//     return (<div className={styles.noData}><span className={styles.noDataIcon}>📈</span><span>No progress data available</span></div>);
//   }

//   const monthPct = budgetData.month_achievement_pct || 0;
//   const isOver   = monthPct >= 100;
//   const isGood   = monthPct >= 70;

//   const dealsProgress = budgetData.monthly_target_deals > 0
//     ? Math.round((budgetData.deals_closed_this_month / budgetData.monthly_target_deals) * 100) : 0;

//   const daysProgress = budgetData.days_elapsed > 0
//     ? Math.round((budgetData.days_elapsed / 30) * 100) : 0;

//   return (
//     <div className={styles.monthlyProgress}>
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Month Achievement</span>
//           <span className={styles.progressValue}>{monthPct}%</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div className={`${styles.progressFill} ${isOver ? styles.fillGreen : isGood ? styles.fillAmber : styles.fillRed}`}
//             style={{ width:`${Math.min(monthPct, 100)}%` }} />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{formatAmount(budgetData.month_achieved, budgetData.currency)} achieved</span>
//           <span>of {formatAmount(budgetData.monthly_budget, budgetData.currency)} target</span>
//         </div>
//       </div>
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Deals Closed</span>
//           <span className={styles.progressValue}>{budgetData.deals_closed_this_month}/{budgetData.monthly_target_deals}</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div className={`${styles.progressFill} ${styles.fillIndigo}`} style={{ width:`${Math.min(dealsProgress, 100)}%` }} />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{dealsProgress}% of target</span>
//           <span>{Math.max(0, (budgetData.monthly_target_deals||0) - (budgetData.deals_closed_this_month||0))} remaining</span>
//         </div>
//       </div>
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Month Progress</span>
//           <span className={styles.progressValue}>Day {budgetData.days_elapsed}</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div className={`${styles.progressFill} ${styles.fillCyan}`} style={{ width:`${daysProgress}%` }} />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{budgetData.days_elapsed} days elapsed</span>
//           <span>{budgetData.days_remaining} days left</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    UNIVERSAL FILTER BAR
// ══════════════════════════════════════════════════════════════ */
// const UniversalFilterBar: React.FC<{
//   filterType:'monthly'|'yearly'; selectedMonth:string; selectedYear:number;
//   onFilterType:(v:'monthly'|'yearly')=>void; onMonth:(v:string)=>void;
//   onYear:(v:number)=>void; onReset:()=>void; isFiltered:boolean;
// }> = ({ filterType, selectedMonth, selectedYear, onFilterType, onMonth, onYear, onReset, isFiltered }) => {
//   const now = new Date();
//   const currentFYYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
//   const yearOptions = [currentFYYear - 2, currentFYYear - 1, currentFYYear].filter(y => y > 2020);

//   return (
//     <div style={{
//       display:'flex', alignItems:'center', gap:12, padding:'12px 20px',
//       background:'#fff', borderRadius:12, boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
//       marginBottom:16, flexWrap:'wrap',
//       border: isFiltered ? '1px solid #C7D2FE' : '1px solid #F1F5F9',
//     }}>
//       <span style={{ fontSize:13, fontWeight:600, color:'#475569' }}>View by:</span>
//       <div style={{ display:'flex', background:'#F1F5F9', borderRadius:8, padding:3, gap:2 }}>
//         {(['yearly','monthly'] as const).map(type => (
//           <button key={type} onClick={() => onFilterType(type)} style={{
//             padding:'5px 14px', borderRadius:6, border:'none', cursor:'pointer',
//             fontSize:12, fontWeight:600,
//             background: filterType === type ? '#4F46E5' : 'transparent',
//             color: filterType === type ? '#fff' : '#64748B', transition:'all 0.15s ease',
//           }}>{type === 'yearly' ? 'Year (FY)' : 'Month'}</button>
//         ))}
//       </div>
//       <div style={{ display:'flex', alignItems:'center', gap:6 }}>
//         <span style={{ fontSize:12, color:'#64748B', fontWeight:500 }}>FY</span>
//         <select value={selectedYear} onChange={e => onYear(Number(e.target.value))} style={{
//           padding:'6px 10px', borderRadius:8, border:'1px solid #E2E8F0',
//           fontSize:13, background:'#fff', cursor:'pointer', fontWeight:600, color:'#334155',
//         }}>
//           {yearOptions.map(y => <option key={y} value={y}>{y}–{String(y+1).slice(2)}</option>)}
//         </select>
//       </div>
//       {filterType === 'monthly' && (
//         <div style={{ display:'flex', alignItems:'center', gap:6 }}>
//           <span style={{ fontSize:12, color:'#64748B', fontWeight:500 }}>Month</span>
//           <select value={selectedMonth} onChange={e => onMonth(e.target.value)} style={{
//             padding:'6px 10px', borderRadius:8, border:'1px solid #E2E8F0',
//             fontSize:13, background:'#fff', cursor:'pointer', fontWeight:600, color:'#334155',
//           }}>
//             {FY_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
//           </select>
//         </div>
//       )}
//       {isFiltered && (
//         <div style={{ background:'#EEF2FF', color:'#4338CA', borderRadius:6, padding:'4px 10px', fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
//           <span>{filterType === 'monthly' ? `${selectedMonth} FY${selectedYear}–${String(selectedYear+1).slice(2)}` : `FY ${selectedYear}–${String(selectedYear+1).slice(2)}`}</span>
//           <button onClick={onReset} style={{ background:'none', border:'none', cursor:'pointer', color:'#4338CA', fontWeight:700, fontSize:14, lineHeight:1, padding:'0 2px' }} title="Reset">×</button>
//         </div>
//       )}
//       <div style={{ flex:1 }} />
//       <span style={{ fontSize:12, color:'#94A3B8' }}>
//         Showing: {filterType === 'monthly' ? `${selectedMonth} FY${selectedYear}–${String(selectedYear+1).slice(2)}` : `Full FY ${selectedYear}–${String(selectedYear+1).slice(2)}`}
//       </span>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ══════════════════════════════════════════════════════════════ */
// const SalesUserDashboard: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const { currentMonth, currentMonthLoading } = useSelector((s: RootState) => s.budget);
//   const { filterType, selectedMonth, selectedYear } = useSelector((s: RootState) => s.globalFilter);

//   const now = new Date();
//   const currentFYYear    = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
//   const currentMonthName = now.toLocaleString('default', { month:'long' });
//   const isFiltered = selectedYear !== currentFYYear || (filterType === 'monthly' && selectedMonth !== currentMonthName);

//   // const fetchBudgetData = useCallback(() => {
//   //   dispatch(fetchCurrentMonthBudget());
//   // }, [dispatch]);

//   // useEffect(() => { fetchBudgetData(); }, [fetchBudgetData]);

//   useEffect(() => {
//   dispatch(fetchCurrentMonthBudget());
// }, [dispatch, selectedYear, selectedMonth, filterType]);

//   const handleFilterType = (type: 'monthly'|'yearly') => dispatch(setFilterType(type));
//   const handleMonth      = (month: string)             => dispatch(setSelectedMonth(month));
//   const handleYear       = (year: number)              => dispatch(setSelectedYear(year));
//   const handleReset      = ()                          => dispatch(resetFilter());

//   const data     = currentMonth || {};
//   const hasData  = data.has_data === true;
//   const currency = data.currency || 'INR';

//   // ── Achievement data (from Rank A — NOT spent) ─────────────
//   const fyPct    = data.fy_achievement_pct    || 0;
//   const monthPct = data.month_achievement_pct || 0;

//   const monthColor: KPICardProps['color'] =
//     monthPct >= 100 ? 'emerald' : monthPct >= 70 ? 'amber' : 'rose';

//   const filterKey = `${selectedYear}-${filterType === 'monthly' ? selectedMonth : 'fy'}`;

//   return (
//     <div className={styles.dashboardRoot}>

//       {/* FILTER BAR — above Header */}
//       <UniversalFilterBar
//         filterType={filterType} selectedMonth={selectedMonth} selectedYear={selectedYear}
//         onFilterType={handleFilterType} onMonth={handleMonth} onYear={handleYear}
//         onReset={handleReset} isFiltered={isFiltered}
//       />

//       <Header />

//       <main className={styles.mainContent}>

//         {/* MONTH HEADER */}
//         {hasData && (
//           <div className={styles.monthHeader}>
//             <div className={styles.monthHeaderLeft}>
//               <div className={styles.monthInfo}>
//                 <span className={styles.monthTitle}>{data.current_month} — FY {data.fy_label}</span>
//                 <span className={styles.monthSubtitle}>{data.budget_title}</span>
//               </div>
//             </div>
//             <div className={styles.monthHeaderRight}>
//               <span className={styles.monthPeriodBadge}>{data.period?.toUpperCase()} Budget</span>
//               <button className={styles.viewFullBudgetBtn} onClick={() => navigate('/user/budget/overview')}>
//                 View Full Budget →
//               </button>
//             </div>
//           </div>
//         )}

//         {/* ══════════════════════════════════════════════════════
//             KPI CARDS — SAME PATTERN AS ADMIN DASHBOARD
//             Target vs Achievement (NO spent concept)
//         ══════════════════════════════════════════════════════ */}
//         {hasData && (
//           <div className={styles.kpiGrid}>

//             {/* FY Total Target */}
//             <KPICard
//               icon={<IconRevenue />} color="indigo"
//               label="FY Revenue Target"
//               value={formatAmount(data.fy_total_target || 0, currency)}
//               trend={`FY ${data.fy_label || ''}`}
//               up={true}
//               subtitle="Your annual target"
//             />

//             {/* Month Target */}
//             <KPICard
//               icon={<IconBudget />} color="cyan"
//               label={`${data.current_month} Target`}
//               value={formatAmount(data.monthly_budget || 0, currency)}
//               subtitle={`${data.days_remaining || 0} days remaining`}
//               trend={`Day ${data.days_elapsed || 0} of month`}
//               up={true}
//             />

//             {/* Month Achieved (from Rank A) */}
//             <KPICard
//               icon={<IconAchieved />}
//               color={monthColor}
//               label={`${data.current_month} Achieved`}
//               value={formatAmount(data.month_achieved || 0, currency)}
//               subtitle={`${monthPct}% of month target`}
//               trend={
//                 monthPct >= 100
//                   ? 'Month target exceeded!'
//                   : `${formatAmount(data.month_remaining || 0, currency)} remaining`
//               }
//               up={monthPct >= 50}
//             />

//             {/* FY Remaining */}
//             <KPICard
//               icon={<IconWallet />}
//               color={(data.fy_remaining || 0) > 0 ? 'purple' : 'emerald'}
//               label="FY Remaining"
//               value={formatAmount(data.fy_remaining || 0, currency)}
//               subtitle={`${fyPct}% achieved so far`}
//               trend={
//                 (data.fy_remaining || 0) > 0
//                   ? `${(100 - fyPct).toFixed(1)}% to go`
//                   : 'Above target'
//               }
//               up={(data.fy_remaining || 0) <= 0}
//             />

//             {/* Deals Closed FY */}
//             <KPICard
//               icon={<IconDeals />} color="amber"
//               label="Deals Closed (FY)"
//               value={`${data.fy_deals_closed || 0} / ${data.total_target_deals || 0}`}
//               subtitle={`${data.deals_closed_this_month || 0} this month`}
//               trend={`Target: ${data.total_target_deals || 0} deals`}
//               up={(data.fy_deals_closed || 0) >= (data.total_target_deals || 0)}
//             />

//           </div>
//         )}

//         {/* NO DATA STATE */}
//         {!hasData && !currentMonthLoading && (
//           <div className={styles.noDataCard}>
//             <div className={styles.noDataIconLarge}>💰</div>
//             <h3 className={styles.noDataTitle}>No Budget Allocated</h3>
//             <p className={styles.noDataText}>Your admin hasn't created a budget for you yet.</p>
//           </div>
//         )}

//         {/* ROW 1: Category Breakdown + Speedometer */}
//         <div className={styles.chartsRow}>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Monthly Budget by Category</span>
//               <span className={styles.cardBadge} style={{ cursor:'pointer' }} onClick={() => navigate('/user/budget/overview')}>
//                 View All →
//               </span>
//             </div>
//             {hasData
//               ? <CategoryMiniChart categories={data.categories || []} currency={currency} />
//               : <div className={styles.noData}><span className={styles.noDataIcon}>📊</span><span>No budget data</span></div>
//             }
//           </div>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}><span className={styles.cardTitle}>Achievements</span></div>
//             <UserSpeedometer key={`speed-${filterKey}`} />
//           </div>
//         </div>

//         {/* ROW 2: Funnel + Pie + Monthly Progress */}
//         <div className={styles.chartsRow3}>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}><span className={styles.cardTitle}>Sales Funnel</span><span className={styles.cardBadge}>By Stage</span></div>
//             <CustomFunnelChart key={`funnel-${filterKey}`} />
//           </div>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}><span className={styles.cardTitle}>Business Bifurcation</span><span className={styles.cardBadge}>Vertical</span></div>
//             <PieChartComponent key={`pie-${filterKey}`} />
//           </div>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Monthly Progress</span>
//               <span className={styles.cardBadge}>{data.current_month || 'This Month'}</span>
//             </div>
//             <MonthlyProgress budgetData={data} />
//           </div>
//         </div>

//         {/* ROW 3: Category + Month Wise */}
//         <div className={styles.chartsRow}>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}><span className={styles.cardTitle}>Category Wise Opportunity</span><span className={styles.cardBadge}>By Value</span></div>
//             <BarChartComponent key={`bar-${filterKey}`} />
//           </div>
//           <div className={styles.chartCard}>
//             <div className={styles.cardHeader}>
//               <span className={styles.cardTitle}>Month Wise Budget vs Sales</span>
//               <span className={styles.cardBadge}>FY {selectedYear}–{String(selectedYear+1).slice(2)}</span>
//             </div>
//             <BarComponent key={`budget-${filterKey}`} />
//           </div>
//         </div>

//         {/* Opportunity — NOT filtered */}
//         <div className={styles.tableCard}>
//           <div className={styles.cardHeader}><span className={styles.cardTitle}>Opportunity Pipeline</span><span className={styles.cardBadge}>All Stages</span></div>
//           <OpportunityStatus />
//         </div>

//       </main>
//     </div>
//   );
// };

// export default SalesUserDashboard;


import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchCurrentMonthBudget } from '../Budget/slice/budgetSlice';
import { fetchOpportunityWorkspaceTableData } from '../OpportunityWorkspaceTable/Slice/OpportunityWorkspaceTableSlice';
import {
  setFilterType, setSelectedMonth, setSelectedYear,
  resetFilter, FY_MONTHS,
} from '../globalFilter/globalFilterSlice';
import Header from './Header/Header';
import UserSpeedometer from './speedometer/Speedometer';
import CustomFunnelChart from './FunnelGraph/funnelgraph';
import PieChartComponent from './PieChart/Piechart';
import BarComponent from './MonthWiseBudget/month';
import BarChartComponent from './Category Wise opportunity/BarChart';
import OpportunityStatus from './OpportunityStatus/OpportunityStatus';
import styles from './Home.module.css';

/* ══════════════════════════════════════════════════════════════
   SVG ICONS
══════════════════════════════════════════════════════════════ */
const IconRevenue = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const IconBudget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M12 8v8" /><path d="M8 12h8" />
  </svg>
);
const IconAchieved = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconWallet = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);
const IconDeals = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconFilter = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   HELPER
══════════════════════════════════════════════════════════════ */
const formatAmount = (value: number, currency: string = 'INR'): string => {
  const symbol = ({ INR: '₹', USD: '$', EUR: '€', GBP: '£' } as Record<string, string>)[currency] || '₹';
  if (!value || isNaN(value)) return `${symbol}0`;
  if (value >= 10000000) return `${symbol}${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000)   return `${symbol}${(value / 100000).toFixed(1)}L`;
  if (value >= 1000)     return `${symbol}${(value / 1000).toFixed(1)}K`;
  return `${symbol}${value.toLocaleString()}`;
};

/* ══════════════════════════════════════════════════════════════
   UNIVERSAL FILTER BAR
══════════════════════════════════════════════════════════════ */
interface FilterBarProps {
  filterType: 'monthly' | 'yearly';
  selectedMonth: string;
  selectedYear: number;
  currentPicLabel: string;
  onFilterType: (v: 'monthly' | 'yearly') => void;
  onMonth: (v: string) => void;
  onYear: (v: number) => void;
  onReset: () => void;
  isFiltered: boolean;
}

const UniversalFilterBar: React.FC<FilterBarProps> = ({
  filterType, selectedMonth, selectedYear, currentPicLabel,
  onFilterType, onMonth, onYear, onReset, isFiltered,
}) => {
  const now = new Date();
  const currentFYYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const yearOptions = [currentFYYear - 2, currentFYYear - 1, currentFYYear].filter(y => y > 2020);
  const showingLabel =
    filterType === 'monthly'
      ? `${selectedMonth} FY${selectedYear}-${String(selectedYear + 1).slice(2)}`
      : `Full FY ${selectedYear}-${String(selectedYear + 1).slice(2)}`;

  return (
    <div className={styles.filterBarWrapper}>
      <div className={`${styles.filterBar} ${isFiltered ? styles.filterBarActive : ''}`}>

        {/* Left label */}
        <div className={styles.filterLeft}>
          <span className={styles.filterIconBox}><IconFilter /></span>
          <div className={styles.filterLabelStack}>
            <span className={styles.filterHeading}>Views</span>
            {/* <span className={styles.filterSubtag}>Applies to all components</span> */}
          </div>
        </div>

        <div className={styles.filterSep} />

        {/* Mode toggle */}
        <div className={styles.filterToggle}>
          {(['yearly', 'monthly'] as const).map(t => (
            <button
              key={t}
              onClick={() => onFilterType(t)}
              className={`${styles.filterToggleBtn} ${filterType === t ? styles.filterToggleBtnActive : ''}`}
            >
              {t === 'yearly' ? 'Year (FY)' : 'Month'}
            </button>
          ))}
        </div>

        <div className={styles.filterSep} />

        {/* FY year */}
        <div className={styles.filterGroup}>
          <span className={styles.filterGroupLabel}><IconCalendar /> FY</span>
          <select
            value={selectedYear}
            onChange={e => onYear(Number(e.target.value))}
            className={styles.filterSelect}
          >
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}–{String(y + 1).slice(2)}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterGroupLabel}>PIC</span>
          <select
            value={currentPicLabel}
            className={`${styles.filterSelect} ${styles.filterSelectPic}`}
            disabled
            aria-label="Current PIC"
          >
            <option value={currentPicLabel}>{currentPicLabel}</option>
          </select>
        </div>

        {/* Month */}
        {filterType === 'monthly' && (
          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}><IconCalendar /> Month</span>
            <select
              value={selectedMonth}
              onChange={e => onMonth(e.target.value)}
              className={styles.filterSelect}
            >
              {FY_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        )}

        {/* Active chip */}
        {isFiltered && (
          <div className={styles.filterChip}>
            <span>
              {filterType === 'monthly'
                ? `${selectedMonth} FY${selectedYear}–${String(selectedYear + 1).slice(2)}`
                : `FY ${selectedYear}–${String(selectedYear + 1).slice(2)}`}
            </span>
            <button onClick={onReset} className={styles.filterChipX} title="Reset">×</button>
          </div>
        )}

        <div className={styles.filterGrow} />

        {/* Showing label */}
        <div className={styles.filterShowing}>
          <span>Showing:</span>
          <strong>
            {filterType === 'monthly'
              ? `${selectedMonth} FY${selectedYear}–${String(selectedYear + 1).slice(2)}`
              : `Full FY ${selectedYear}–${String(selectedYear + 1).slice(2)}`}
          </strong>
        </div>

      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   KPI CARD
══════════════════════════════════════════════════════════════ */
interface KPICardProps {
  icon: React.ReactNode;
  color: 'indigo' | 'sky' | 'emerald' | 'amber' | 'violet' | 'rose' | 'teal' | 'fuchsia';
  label: string;
  value: string;
  trend: string;
  up: boolean;
  onClick?: () => void;
  subtitle?: string;
}

const KPICard: React.FC<KPICardProps> = ({ icon, color, label, value, trend, up, onClick, subtitle }) => (
  <div
    className={`${styles.kpiCard} ${styles[`kpiAccent_${color}`]} ${onClick ? styles.kpiClickable : ''}`}
    onClick={onClick}
  >
    <div className={`${styles.kpiIconWrap} ${styles[`kpiIcon_${color}`]}`}>{icon}</div>
    <div className={styles.kpiBody}>
      <span className={styles.kpiLabel}>{label}</span>
      <span className={styles.kpiValue}>{value}</span>
      <div className={styles.kpiFooter}>
        {subtitle && <span className={styles.kpiSubtitle}>{subtitle}</span>}
        <span className={`${styles.kpiBadge} ${up ? styles.badgeUp : styles.badgeDown}`}>
          {up ? '↑' : '↓'} {trend}
        </span>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   CATEGORY MINI CHART
══════════════════════════════════════════════════════════════ */
const CategoryMiniChart: React.FC<{ categories: any[]; currency: string }> = ({ categories, currency }) => {
  const active = (categories || []).filter(c => (c.allocated || 0) > 0);

  if (!categories || categories.length === 0) {
    return (
      <div className={styles.noData}>
        <span className={styles.noDataIcon}>📊</span>
        <span>No categories in budget</span>
      </div>
    );
  }
  if (active.length === 0) {
    return (
      <div className={styles.noData}>
        <span className={styles.noDataIcon}>📊</span>
        <span>No categories allocated for this month</span>
      </div>
    );
  }

  return (
    <div className={styles.categoryMiniList}>
      {active.slice(0, 6).map((cat: any, idx: number) => {
        const pct    = cat.monthly_share_pct || cat.utilization_pct || 0;
        const isHigh = pct >= 40;
        const isMid  = pct >= 20 && !isHigh;
        return (
          <div key={cat.id || idx} className={styles.categoryMiniRow}>
            <div className={styles.categoryMiniInfo}>
              <span className={styles.categoryMiniName}>{cat.name || 'Uncategorized'}</span>
              <span className={`${styles.categoryMiniPct} ${isHigh ? styles.pctGreen : isMid ? styles.pctAmber : styles.pctGreen}`}>
                {pct}%
              </span>
            </div>
            <div className={styles.categoryMiniTrack}>
              <div
                className={`${styles.categoryMiniFill} ${isHigh ? styles.fillGreen : isMid ? styles.fillAmber : styles.fillGreen}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <div className={styles.categoryMiniAmounts}>
              <span className={styles.categorySpent}>{formatAmount(cat.allocated || 0, currency)}</span>
              <span className={styles.categorySeparator}>/</span>
              <span className={styles.categoryAllocated}>{formatAmount(cat.fy_allocated || 0, currency)}</span>
            </div>
            {cat.subcategories?.length > 0 && (
              <div style={{ paddingLeft: 12, marginTop: 4 }}>
                {cat.subcategories.filter((s: any) => (s.allocated || 0) > 0).map((sub: any) => (
                  <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', padding: '2px 0' }}>
                    <span>↳ {sub.name}</span>
                    <span>{formatAmount(sub.allocated || 0, currency)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {active.length > 6 && (
        <div className={styles.categoryMiniMore}>+{active.length - 6} more</div>
      )}
      <div style={{ marginTop: 8, padding: '6px 0', borderTop: '1px solid #F1F5F9', fontSize: 11, color: '#94A3B8' }}>
        Left = This month · Right = Full FY · % = Share of monthly budget
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MONTHLY PROGRESS
══════════════════════════════════════════════════════════════ */
// const MonthlyProgress: React.FC<{ budgetData: any }> = ({ budgetData }) => {
//   if (!budgetData || !budgetData.has_data) {
//     return (
//       <div className={styles.noData}>
//         <span className={styles.noDataIcon}>📈</span>
//         <span>No progress data available</span>
//       </div>
//     );
//   }

//   const monthPct      = budgetData.month_achievement_pct || 0;
//   const isOver        = monthPct >= 100;
//   const isGood        = monthPct >= 70;
//   const dealsProgress = budgetData.monthly_target_deals > 0
//     ? Math.round((budgetData.deals_closed_this_month / budgetData.monthly_target_deals) * 100) : 0;
//   const daysProgress  = budgetData.days_elapsed > 0
//     ? Math.round((budgetData.days_elapsed / 30) * 100) : 0;

//   return (
//     <div className={styles.monthlyProgress}>
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Month Achievement</span>
//           <span className={styles.progressValue}>{monthPct}%</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div
//             className={`${styles.progressFill} ${isOver ? styles.fillEmerald : isGood ? styles.fillAmberBar : styles.fillRoseBar}`}
//             style={{ width: `${Math.min(monthPct, 100)}%` }}
//           />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{formatAmount(budgetData.month_achieved, budgetData.currency)} achieved</span>
//           <span>of {formatAmount(budgetData.monthly_budget, budgetData.currency)} target</span>
//         </div>
//       </div>
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Deals Closed</span>
//           <span className={styles.progressValue}>{budgetData.deals_closed_this_month} / {budgetData.monthly_target_deals}</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div className={`${styles.progressFill} ${styles.fillIndigo}`} style={{ width: `${Math.min(dealsProgress, 100)}%` }} />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{dealsProgress}% of target</span>
//           <span>{Math.max(0, (budgetData.monthly_target_deals || 0) - (budgetData.deals_closed_this_month || 0))} remaining</span>
//         </div>
//       </div>
//       <div className={styles.progressItem}>
//         <div className={styles.progressHeader}>
//           <span className={styles.progressLabel}>Month Progress</span>
//           <span className={styles.progressValue}>Day {budgetData.days_elapsed}</span>
//         </div>
//         <div className={styles.progressTrack}>
//           <div className={`${styles.progressFill} ${styles.fillSky}`} style={{ width: `${daysProgress}%` }} />
//         </div>
//         <div className={styles.progressFooter}>
//           <span>{budgetData.days_elapsed} days elapsed</span>
//           <span>{budgetData.days_remaining} days left</span>
//         </div>
//       </div>
//     </div>
//   );
// };

const MonthlyProgress: React.FC<{ budgetData: any }> = ({ budgetData }) => {
  if (!budgetData || !budgetData.has_data) {
    return (
      <div className={styles.noData}>
        <span className={styles.noDataIcon}>📈</span>
        <span>No progress data available</span>
      </div>
    );
  }

  const currency      = budgetData.currency || 'INR';
  const monthlyBudget = budgetData.monthly_budget || 0;
  const monthAchieved = budgetData.month_achieved  || 0;
  const monthPct      = budgetData.month_achievement_pct || 0;

  // Rank counts
  const rankB = budgetData.month_rank_b_count || 0;
  const rankC = budgetData.month_rank_c_count || 0;
  const rankD = budgetData.month_rank_d_count || 0;
  const rankE = budgetData.month_rank_e_count || 0;
  const totalRankBCDE = rankB + rankC + rankD + rankE;

  // Colors for ranks
  const rankConfig = [
    { label: 'Rank B', count: rankB, color: '#6366F1', bgColor: '#EEF2FF' },
    { label: 'Rank C', count: rankC, color: '#F59E0B', bgColor: '#FFFBEB' },
    { label: 'Rank D', count: rankD, color: '#F97316', bgColor: '#FFF7ED' },
    { label: 'Rank E', count: rankE, color: '#EF4444', bgColor: '#FEF2F2' },
  ];

  const isAchievementOver = monthPct >= 100;
  const isAchievementGood = monthPct >= 70;

  return (
    <div className={styles.monthlyProgress}>

      {/* ── Monthly Budget ───────────────────────────────────── */}
      <div className={styles.progressItem}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Monthly Budget</span>
          <span className={styles.progressValue}>
            {formatAmount(monthlyBudget, currency)}
          </span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={`${styles.progressFill} ${styles.fillIndigo}`}
            style={{ width: '100%' }}
          />
        </div>
        <div className={styles.progressFooter}>
          <span>Allocated for this month</span>
          <span>{budgetData.days_remaining || 0} days left</span>
        </div>
      </div>

      {/* ── Monthly Achievement ──────────────────────────────── */}
      <div className={styles.progressItem}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Monthly Achievement</span>
          <span className={styles.progressValue}>{monthPct}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={`${styles.progressFill} ${
              isAchievementOver
                ? styles.fillEmerald
                : isAchievementGood
                  ? (styles.fillAmberBar || styles.fillAmber)
                  : (styles.fillRoseBar || styles.fillRose)
            }`}
            style={{ width: `${Math.min(monthPct, 100)}%` }}
          />
        </div>
        <div className={styles.progressFooter}>
          <span>{formatAmount(monthAchieved, currency)} achieved</span>
          <span>of {formatAmount(monthlyBudget, currency)}</span>
        </div>
      </div>

      {/* ── Monthly Rank Distribution (B, C, D, E) ───────────── */}
      <div className={styles.progressItem}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Monthly Rank Distribution</span>
          <span className={styles.progressValue}>
            {totalRankBCDE} deal{totalRankBCDE !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Rank bar segments */}
        <div style={{
          display: 'flex',
          width: '100%',
          height: 8,
          borderRadius: 6,
          overflow: 'hidden',
          background: '#F1F5F9',
          marginTop: 4,
          marginBottom: 6,
        }}>
          {totalRankBCDE > 0 ? (
            rankConfig.map((rank) => {
              const pct = totalRankBCDE > 0
                ? Math.max((rank.count / totalRankBCDE) * 100, rank.count > 0 ? 4 : 0)
                : 0;
              return (
                <div
                  key={rank.label}
                  style={{
                    width: `${pct}%`,
                    background: rank.color,
                    transition: 'width 0.4s ease',
                    minWidth: rank.count > 0 ? 4 : 0,
                  }}
                  title={`${rank.label}: ${rank.count} deal${rank.count !== 1 ? 's' : ''}`}
                />
              );
            })
          ) : (
            <div style={{ width: '100%', background: '#F1F5F9' }} />
          )}
        </div>

        {/* Individual rank pills */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
          marginTop: 2,
        }}>
          {rankConfig.map((rank) => (
            <div
              key={rank.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 10px',
                borderRadius: 8,
                background: rank.bgColor,
                border: `1px solid ${rank.color}20`,
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: 2,
                  background: rank.color,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: rank.color,
                  fontFamily: "'DM Sans', system-ui",
                }}>
                  {rank.label}
                </span>
              </div>
              <span style={{
                fontSize: 12,
                fontWeight: 700,
                color: rank.color,
                fontFamily: "'DM Sans', system-ui",
                minWidth: 28,
                textAlign: 'right',
              }}>
                {rank.count}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.progressFooter} style={{ marginTop: 6 }}>
          <span>Active pipeline this month</span>
          <span>
            {totalRankBCDE > 0 && rankB > 0
              ? `${Math.round((rankB / totalRankBCDE) * 100)}% at Rank B`
              : 'No Rank B deals'}
          </span>
        </div>
      </div>

    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const normalizeUserKey = (value: unknown): string =>
  String(value || '').trim().toLowerCase();

const getLeadStatusBucket = (value: unknown): 'open' | 'won' | 'lost' => {
  const status = normalizeUserKey(value);
  if (status.includes('won')) return 'won';
  if (status.includes('lost') || status.includes('drop')) return 'lost';
  return 'open';
};

const SalesUserDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentMonth, loading } = useSelector((s: RootState) => s.budget);
  const opportunityRows = useSelector((s: RootState) => s.OpportunityWorkspaceTableData?.OpportunityData ?? []);
  const { filterType, selectedMonth, selectedYear } = useSelector((s: RootState) => s.globalFilter);
  const currentUser = useSelector((s: RootState) => s.userLoginAuth?.user);

  const now              = new Date();
  const currentFYYear    = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const isFiltered =
    selectedYear !== currentFYYear ||
    (filterType === 'monthly' && selectedMonth !== currentMonthName);

  useEffect(() => {
    dispatch(fetchCurrentMonthBudget());
  }, [dispatch, selectedYear, selectedMonth, filterType]);

  useEffect(() => {
    dispatch(fetchOpportunityWorkspaceTableData() as any);
  }, [dispatch]);

  const handleFilterType = (type: 'monthly' | 'yearly') => dispatch(setFilterType(type));
  const handleMonth      = (month: string)               => dispatch(setSelectedMonth(month));
  const handleYear       = (year: number)                => dispatch(setSelectedYear(year));
  const handleReset      = ()                            => dispatch(resetFilter());

  const data     = currentMonth || {};
  const hasData  = data.has_data === true;
  const currency = data.currency || 'INR';
  const fyPct    = data.fy_achievement_pct    || 0;
  const monthPct = data.month_achievement_pct || 0;
  const currentPicLabel = String(currentUser?.username || currentUser?.email || 'My Dashboard').trim();
  const fyLabel = `${selectedYear}-${String(selectedYear + 1).slice(2)}`;
  const monthLabel =
    filterType === 'monthly'
      ? selectedMonth
      : (data.current_month || selectedMonth);
  const monthTarget = Number(data.month_target || data.monthly_budget || 0);
  const fyTarget = Number(data.fy_target || data.fy_total_target || 0);

  const monthKpiColor: KPICardProps['color'] =
    monthPct >= 100 ? 'emerald' : monthPct >= 70 ? 'amber' : 'rose';

  const myOpportunitySummary = useMemo(() => {
    const rows = Array.isArray(opportunityRows) ? opportunityRows : [];
    const userKeys = new Set(
      [
        currentUser?.username,
        (currentUser as any)?.name,
        (currentUser as any)?.full_name,
        currentUser?.email,
      ]
        .map(normalizeUserKey)
        .filter(Boolean)
    );

    const mine = rows.filter((row: any) => {
      const rowKeys = [
        row?.user,
        row?.pic,
        row?.account_holder,
        row?.assign_to,
        row?.username,
        row?.email_id,
      ]
        .map(normalizeUserKey)
        .filter(Boolean);
      return rowKeys.some((key) => userKeys.has(key));
    });

    const won = mine.filter((row: any) => getLeadStatusBucket(row?.status) === 'won').length;
    const lost = mine.filter((row: any) => getLeadStatusBucket(row?.status) === 'lost').length;
    const open = Math.max(0, mine.length - won - lost);
    const conversion = mine.length ? Math.round((won / mine.length) * 100) : 0;
    const activeCategories = (Array.isArray(data.categories) ? data.categories : []).filter(
      (cat: any) => Number(cat?.allocated || 0) > 0
    ).length;

    return {
      total: mine.length,
      won,
      open,
      conversion,
      categories: activeCategories,
    };
  }, [currentUser, data.categories, opportunityRows]);

  const filterKey = `${selectedYear}-${filterType === 'monthly' ? selectedMonth : 'fy'}`;

  return (
    <div className={styles.dashboardRoot}>

      {/* ── Universal Filter — above Header ─────────────────── */}
      <UniversalFilterBar
        filterType={filterType}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        currentPicLabel={currentPicLabel}
        onFilterType={handleFilterType}
        onMonth={handleMonth}
        onYear={handleYear}
        onReset={handleReset}
        isFiltered={isFiltered}
      />

      <div className={styles.topActionsRow}>
        <button className={styles.manageBudgetsBtn} onClick={() => navigate('/user/budget/overview')}>
          Manage Budgets
        </button>
      </div>

      <Header showRankBreakdownInSecondCard showPlanCard />

      <main className={styles.mainContent}>
        {hasData && (
          <section className={styles.entitySplitRow}>
            <article className={`${styles.entitySectionCard} ${styles.entitySectionUsers}`}>
              <div className={styles.entitySectionHeader}>
                <span className={styles.entitySectionTitle}>Budget Section</span>
                <span className={styles.entitySectionBadge}>Mine</span>
              </div>
              <div className={styles.entityMetricGrid}>
                <div className={styles.entityMetricItem}>
                  <span>FY Target</span>
                  <strong>{formatAmount(fyTarget, currency)}</strong>
                </div>
                <div className={styles.entityMetricItem}>
                  <span>{monthLabel} Target</span>
                  <strong>{formatAmount(monthTarget, currency)}</strong>
                </div>
                <div className={styles.entityMetricItem}>
                  <span>Active Categories</span>
                  <strong>{myOpportunitySummary.categories.toLocaleString()}</strong>
                </div>
              </div>
            </article>
            <article className={`${styles.entitySectionCard} ${styles.entitySectionLeads}`}>
              <div className={styles.entitySectionHeader}>
                <span className={styles.entitySectionTitle}>Leads Section</span>
                <span className={styles.entitySectionBadge}>Mine</span>
              </div>
              <div className={styles.entityMetricGrid}>
                <div className={styles.entityMetricItem}>
                  <span>Total Leads</span>
                  <strong>{myOpportunitySummary.total.toLocaleString()}</strong>
                </div>
                <div className={styles.entityMetricItem}>
                  <span>Won Leads</span>
                  <strong>{myOpportunitySummary.won.toLocaleString()}</strong>
                </div>
                <div className={styles.entityMetricItem}>
                  <span>Open Leads</span>
                  <strong>{myOpportunitySummary.open.toLocaleString()}</strong>
                </div>
                <div className={styles.entityMetricItem}>
                  <span>Conversion</span>
                  <strong>{myOpportunitySummary.conversion}%</strong>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* ── Month banner ─────────────────────────────────── */}
        {hasData && (
          <div className={styles.monthHeader}>
            <div className={styles.monthHeaderLeft}>
              <div className={styles.monthHeaderAccent} />
              <div className={styles.monthInfo}>
                <p className={styles.monthTitle}>
                  {filterType === 'monthly'
                    ? `${data.current_month} — FY ${data.fy_label}`
                    : `FY ${data.fy_label}`}
                </p>
                <p className={styles.monthSubtitle}>{data.budget_title}</p>
              </div>
            </div>
            <div className={styles.monthHeaderRight}>
              <span className={styles.monthPeriodBadge}>{(data.period || 'Monthly')?.toUpperCase()} Budget</span>
              <button className={styles.viewFullBudgetBtn} onClick={() => navigate('/user/budget/overview')}>
                View Full Budget →
              </button>
            </div>
          </div>
        )}

        {/* ── KPI Grid ─────────────────────────────────────── */}
        {hasData && (
          <div className={styles.kpiGrid}>
            <KPICard
              icon={<IconRevenue />} color="indigo"
              label="FY Revenue Target"
              value={formatAmount(fyTarget, currency)}
              subtitle="Your annual target"
              trend={`FY ${fyLabel}`} up={true}
              onClick={() => navigate('/user/budget/overview')}
            />
            <KPICard
              icon={<IconBudget />} color="sky"
              label={`${monthLabel} Target`}
              value={formatAmount(monthTarget, currency)}
              subtitle={`${data.days_remaining || 0} days remaining`}
              trend={`Day ${data.days_elapsed || 0} of month`} up={true}
              onClick={() => navigate('/user/budget/overview')}
            />
            <KPICard
              icon={<IconAchieved />} color={monthKpiColor}
              label={`${monthLabel} Achieved`}
              value={formatAmount(data.month_achieved || 0, currency)}
              subtitle={`${monthPct}% of month target`}
              trend={monthPct >= 100 ? 'Target exceeded!' : `${formatAmount(data.month_remaining || 0, currency)} remaining`}
              up={monthPct >= 50}
              onClick={() => navigate('/user/budget/overview')}
            />
            <KPICard
              icon={<IconWallet />}
              color={(data.fy_remaining || 0) > 0 ? 'violet' : 'emerald'}
              label="FY Remaining"
              value={formatAmount(data.fy_remaining || 0, currency)}
              subtitle={`${fyPct}% achieved so far`}
              trend={(data.fy_remaining || 0) > 0 ? `${(100 - fyPct).toFixed(1)}% to go` : 'Above target'}
              up={(data.fy_remaining || 0) <= 0}
              onClick={() => navigate('/user/budget/overview')}
            />
            <KPICard
              icon={<IconDeals />} color="amber"
              label="Deals Closed (FY)"
              value={`${data.fy_deals_closed || 0} / ${data.total_target_deals || 0}`}
              subtitle={`${data.deals_closed_this_month || 0} this month`}
              trend={`Target: ${data.total_target_deals || 0} deals`}
              up={(data.fy_deals_closed || 0) >= (data.total_target_deals || 0)}
              onClick={() => navigate('/user/budget/overview')}
            />
          </div>
        )}

        {/* ── No data ──────────────────────────────────────── */}
        {false && !hasData && !loading && (
          <div className={styles.noDataCard}>
            <div className={styles.noDataIconLarge}>💰</div>
            <h3 className={styles.noDataTitle}>No Budget Allocated</h3>
            <p className={styles.noDataText}>Your admin hasn't created a budget for you yet.</p>
          </div>
        )}

        {/* ── Row 1: Category Breakdown + Speedometer ──────── */}
        <div className={styles.chartsRow}>
          <div className={`${styles.chartCard} ${styles.cardBorderIndigo}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Monthly Budget by Category</span>
              <div className={styles.cardHeaderActions}>
                <span className={`${styles.cardBadge} ${styles.badgeIndigo}`}>FY {fyLabel}</span>
                <select
                  className={styles.cardMonthSelect}
                  value={selectedMonth}
                  onChange={(e) => handleMonth(e.target.value)}
                  aria-label="Select month in financial year"
                >
                  {FY_MONTHS.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            </div>
            {hasData
              ? <CategoryMiniChart categories={data.categories || []} currency={currency} />
              : <div className={styles.noData}><span className={styles.noDataIcon}>$</span><span>No budget data</span></div>
            }
          </div>
          <div className={`${styles.chartCard} ${styles.cardBorderSky}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Achievements</span>
              <span className={`${styles.cardBadge} ${styles.badgeSky}`}>Speedometer</span>
            </div>
            <UserSpeedometer key={`speed-${filterKey}`} />
          </div>
        </div>

        {/* Row 2: Funnel + Pie + Progress */}
        <div className={styles.chartsRow3}>
          <div className={`${styles.chartCard} ${styles.cardBorderViolet}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Sales Funnel</span>
              <span className={`${styles.cardBadge} ${styles.badgeViolet}`}>By Stage</span>
            </div>
            <CustomFunnelChart key={`funnel-${filterKey}`} />
          </div>
          <div className={`${styles.chartCard} ${styles.cardBorderTeal}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Business Bifurcation</span>
              <span className={`${styles.cardBadge} ${styles.badgeTeal}`}>Vertical</span>
            </div>
            <PieChartComponent key={`pie-${filterKey}`} />
          </div>
          <div className={`${styles.chartCard} ${styles.cardBorderAmber}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Monthly Progress</span>
              <span className={`${styles.cardBadge} ${styles.badgeAmber}`}>{monthLabel || 'This Month'}</span>
            </div>
            <MonthlyProgress budgetData={data} />
          </div>
        </div>

        {/* Row 3: Category Wise + Month Wise */}
        <div className={styles.chartsRow}>
          <div className={`${styles.chartCard} ${styles.cardBorderFuchsia}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Category Wise Opportunity</span>
              <span className={`${styles.cardBadge} ${styles.badgeFuchsia}`}>By Value</span>
            </div>
            <BarChartComponent key={`bar-${filterKey}`} />
          </div>
          <div className={`${styles.chartCard} ${styles.cardBorderEmerald}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Month Wise Budget vs Sales</span>
              <span className={`${styles.cardBadge} ${styles.badgeEmerald}`}>Trend</span>
            </div>
            <BarComponent key={`budget-${filterKey}`} />
          </div>
        </div>

        {/* ── Opportunity Pipeline ──────────────────────────── */}
        <div className={`${styles.tableCard} ${styles.cardBorderIndigo}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Opportunity Pipeline</span>
            <span className={`${styles.cardBadge} ${styles.badgeIndigo}`}>All Stages</span>
          </div>
          <OpportunityStatus />
        </div>

      </main>
    </div>
  );
};

export default SalesUserDashboard;
