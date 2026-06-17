// import React, { useEffect, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import type { AppDispatch, RootState } from '../../../../app/store';
// import { fetchAdminAccountWorkspaceTableData } from '../../../AdminAccountWorkspaceTable/AdminAccountWorkspaceTableSlice/AdminAccountWorkspaceTableSlice';
// import { fetchAdminOpportunityWorkspaceTableData } from '../../../AdminOpportunityWorkspaceTable/AdminOpportunityWorkspaceTableSlice/AdminOpportunityWorkspaceTableSlice';
// import { fetchAdminLeadWorkspaceList } from '../../../AdminLeadWorkspaceList/Slice/AdminLeadWorkspaceListSlice';
// import { taskAdminFormData } from '../../../AdminTaskWorkspaceList/Slice/AdminTaskWorkspaceListSlice';
// import { fetchTeamSummary } from '../../../Budget/slice/budgetSlice';
// import { accountFormData } from '../../../tables/slice/tablesSlice';
// import { fetchOpportunityWorkspaceTableData } from '../../../OpportunityWorkspaceTable/Slice/OpportunityWorkspaceTableSlice';
// import { fetchLeadWorkspaceList } from '../../../LeadWorkspaceList/Slice/LeadWorkspaceList';
// import { taskFormData } from '../../../TaskTable/slice/taskTableSlice';
// import styles from './MainComponent.module.css';

// const quickLinks = [
//   { title: 'Open Sales Dashboard', path: '/SalesAdminDashboard' },
//   { title: 'Opportunity Workspace', path: '/opportunityspace' },
//   { title: 'Account Workspace', path: '/accountworkspace' },
//   { title: 'Lead Workspace', path: '/LeadWorkspace' },
//   { title: 'Task Workspace', path: '/TaskWorkspace' },
// ];

// const formatCurrencyINR = (value: number) =>
//   `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

// const toDisplayText = (value: unknown): string => {
//   if (value == null) return '';
//   if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
//     return String(value);
//   }
//   if (Array.isArray(value)) {
//     return value.map((item) => toDisplayText(item)).filter(Boolean).join(', ');
//   }
//   if (typeof value === 'object') {
//     const obj = value as Record<string, unknown>;
//     return toDisplayText(
//       obj.stages ??
//       obj.ranks ??
//       obj.lost_reason ??
//       obj.status ??
//       obj.name ??
//       obj.title ??
//       obj.label ??
//       obj.id ??
//       ''
//     );
//   }
//   return '';
// };

// const toTimestamp = (value: unknown): number => {
//   if (typeof value !== 'string' || !value.trim()) return 0;
//   const ts = new Date(value).getTime();
//   return Number.isFinite(ts) ? ts : 0;
// };

// const getLatestOpportunityStage = (opportunity: any): any => {
//   if (!Array.isArray(opportunity?.opportunity_stages) || opportunity.opportunity_stages.length === 0) {
//     return null;
//   }
//   return opportunity.opportunity_stages[opportunity.opportunity_stages.length - 1];
// };

// const ensureArray = (value: unknown): any[] => {
//   if (Array.isArray(value)) return value;
//   if (value && typeof value === 'object') {
//     const obj = value as Record<string, unknown>;
//     const candidate = obj.data ?? obj.results ?? obj.items ?? obj.rows ?? obj.payload;
//     if (Array.isArray(candidate)) return candidate;
//   }
//   return [];
// };

// interface MainComponentProps {
//   routePrefix?: string;
//   isUserMode?: boolean;
// }

// const MainComponent: React.FC<MainComponentProps> = ({
//   routePrefix = '',
//   isUserMode = false,
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const accounts = useSelector((state: RootState) =>
//     isUserMode
//       ? (state.accountData.data || [])
//       : (state.fetchAdminAccountWorkspaceData.data || [])
//   );
//   const opportunities = useSelector((state: RootState) =>
//     isUserMode
//       ? (state.OpportunityWorkspaceTableData.OpportunityData || [])
//       : (state.fetchAdminOpportunityWorkspaceData.data || [])
//   );
//   const leads = useSelector((state: RootState) =>
//     isUserMode
//       ? (state.fetchLeadWorkspaceListData.data || [])
//       : (state.fetchAdminLeadWorkspaceListData.data || [])
//   );
//   const tasks = useSelector((state: RootState) =>
//     isUserMode
//       ? (state.taskData.totaldata || [])
//       : (state.fetchAdminTaskData.taskdata || [])
//   );
//   const budgetTeamSummary = useSelector((state: RootState) => state.budget.teamSummary || []);

//   useEffect(() => {
//     const syncHomeData = () => {
//       const requests = isUserMode
//         ? [
//             dispatch(accountFormData()),
//             dispatch(fetchOpportunityWorkspaceTableData()),
//             dispatch(fetchLeadWorkspaceList()),
//             dispatch(taskFormData()),
//           ]
//         : [
//             dispatch(fetchAdminAccountWorkspaceTableData()),
//             dispatch(fetchAdminOpportunityWorkspaceTableData()),
//             dispatch(fetchAdminLeadWorkspaceList()),
//             dispatch(taskAdminFormData()),
//           ];

//       requests.push(dispatch(fetchTeamSummary()));
//       void Promise.allSettled(requests);
//     };

//     syncHomeData();

//     const handleWindowFocus = () => {
//       syncHomeData();
//     };

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'visible') {
//         syncHomeData();
//       }
//     };

//     const refreshTimer = window.setInterval(() => {
//       syncHomeData();
//     }, 30000);

//     window.addEventListener('focus', handleWindowFocus);
//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     return () => {
//       window.clearInterval(refreshTimer);
//       window.removeEventListener('focus', handleWindowFocus);
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [dispatch, isUserMode, location.pathname]);

//   const withPrefix = (path: string) => {
//     if (!routePrefix) return path;
//     if (path.startsWith(routePrefix + '/')) return path;
//     const normalized = path.startsWith('/') ? path : `/${path}`;
//     return `${routePrefix}${normalized}`;
//   };

//   const salesDashboardPath = isUserMode ? '/SalesUserDashboard' : '/SalesAdminDashboard';
//   const homeQuickLinks = quickLinks.map((item) =>
//     item.path === '/SalesAdminDashboard' ? { ...item, path: salesDashboardPath } : item
//   );

//   const derived = useMemo(() => {
//     const now = new Date();
//     const pipelineValue = opportunities.reduce((sum: number, item: any) => sum + (Number(item.total_amount) || Number(item.values) || 0), 0);
//     const thisMonthLeads = leads.filter((lead: any) => {
//       if (!lead?.acct_created_date) return false;
//       const created = new Date(lead.acct_created_date);
//       return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
//     }).length;
//     const pendingFollowUps = tasks.filter((task: any) => task?.status === 'Pending' || task?.status === 'In Progress').length;
//     const wonLeads = leads.filter((lead: any) => String(lead?.status || '').toLowerCase().includes('won')).length;
//     const conversion = leads.length ? `${Math.round((wonLeads / leads.length) * 100)}%` : '0%';
//     const completedTasks = tasks.filter((task: any) => task?.status === 'Completed').length;
//     const budgetThisMonth = budgetTeamSummary.reduce((sum: number, row: any) => sum + (Number(row?.this_month) || 0), 0);
//     const taskByPriority = {
//       high: tasks.filter((task: any) => String(task?.priority || '').toLowerCase() === 'high').length,
//       medium: tasks.filter((task: any) => String(task?.priority || '').toLowerCase() === 'medium').length,
//       low: tasks.filter((task: any) => String(task?.priority || '').toLowerCase() === 'low').length,
//     };

//     const pipelineStagesData = [
//       { label: 'Lead', count: leads.length },
//       { label: 'Qualify', count: leads.filter((l: any) => String(l.status || '').toLowerCase().includes('qualify')).length },
//       { label: 'Offer', count: leads.filter((l: any) => String(l.status || '').toLowerCase().includes('offer')).length },
//       { label: 'Won', count: wonLeads },
//       { label: 'Target', count: budgetTeamSummary.length },
//     ];
//     const maxCount = Math.max(...pipelineStagesData.map(d => d.count), 1);
//     const pipelineHeights = pipelineStagesData.map(d => `${Math.min(95, Math.max(15, Math.round((d.count / maxCount) * 100)))}%`);

//     const openLeads = Math.max(0, leads.length - wonLeads);
//     const openTasks = Math.max(0, tasks.length - completedTasks);
//     const communicationSeries = [
//       { label: 'Accounts', value: accounts.length, color: '#6366f1' },
//       { label: 'Opportunities', value: opportunities.length, color: '#06b6d4' },
//       { label: 'Leads', value: openLeads, color: '#f43f5e' },
//       { label: 'Tasks', value: openTasks, color: '#10b981' },
//       { label: 'Completed Tasks', value: completedTasks, color: '#f59e0b' },
//       { label: 'Won Leads', value: wonLeads, color: '#8b5cf6' },
//     ];
//     const commTotal = communicationSeries.reduce((sum, item) => sum + item.value, 0);
//     const safeTotal = commTotal || 1;
//     let cursor = 0;
//     const donutGradient = commTotal > 0
//       ? `conic-gradient(from 210deg, ${communicationSeries
//           .map((item) => {
//             const start = cursor;
//             const end = start + (item.value / safeTotal) * 100;
//             cursor = end;
//             return `${item.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
//           })
//           .join(', ')})`
//       : `conic-gradient(from 210deg, #e2e8f0 0 100%)`;

//     const opportunityStageStats = opportunities.reduce(
//       (acc: { open: number; followUp: number; won: number; lost: number }, item: any) => {
//         const latestStage = getLatestOpportunityStage(item);
//         const statusText = toDisplayText(latestStage?.stages ?? item?.status).toLowerCase();
//         if (statusText.includes('won') || statusText.includes('fund')) acc.won += 1;
//         else if (statusText.includes('lost')) acc.lost += 1;
//         else if (statusText.includes('follow')) acc.followUp += 1;
//         else acc.open += 1;
//         return acc;
//       },
//       { open: 0, followUp: 0, won: 0, lost: 0 }
//     );

//     const opportunityWinRateValue = opportunities.length
//       ? Math.round((opportunityStageStats.won / opportunities.length) * 100)
//       : 0;
//     const opportunityWinRateGradient = `conic-gradient(#4f46e5 0 ${opportunityWinRateValue}%, #e2e8f0 ${opportunityWinRateValue}% 100%)`;

//     const verticalCounts = opportunities.reduce((acc: Record<string, number>, item: any) => {
//       const verticalLabel =
//         toDisplayText(item?.vertical ?? item?.sub_make_brand ?? item?.sub_make ?? item?.make) || 'Unspecified';
//       acc[verticalLabel] = (acc[verticalLabel] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     const opportunityVerticals = Object.entries(verticalCounts)
//       .sort((a, b) => Number(b[1]) - Number(a[1]))
//       .slice(0, 4)
//       .map(([label, count]) => ({
//         label,
//         value: String(count),
//       }));

//     return {
//       kpiCards: [
//         { label: 'Pipeline Value', amount: formatCurrencyINR(pipelineValue), helper: 'From all active opportunities' },
//         { label: 'New Leads', amount: String(thisMonthLeads), helper: 'Leads created this month' },
//         { label: 'Follow Ups', amount: String(pendingFollowUps), helper: 'Pending + in progress tasks' },
//         { label: 'Conversion', amount: conversion, helper: 'Won leads vs total leads' },
//         { label: 'Team Activity', amount: String(completedTasks), helper: 'Completed tasks' },
//         { label: 'Revenue Added', amount: formatCurrencyINR(budgetThisMonth), helper: 'Budget achievement this month' },
//       ],
//       communicationItems: communicationSeries.map((item) => {
//         const percent = Math.round((item.value / safeTotal) * 100);
//         return {
//           label: item.label,
//           value: String(item.value),
//           color: item.color,
//           percent,
//           percentLabel: `${percent}%`,
//         };
//       }),
//       commTotal,
//       donutGradient,
//       communicationSummary: [
//         { label: 'High Priority', value: String(taskByPriority.high) },
//         { label: 'Medium Priority', value: String(taskByPriority.medium) },
//         { label: 'Low Priority', value: String(taskByPriority.low) },
//       ],
//       opportunityHealth: [
//         { label: 'Open Opportunities', value: String(opportunityStageStats.open) },
//         { label: 'Follow-ups', value: String(opportunityStageStats.followUp) },
//         { label: 'Won Opportunities', value: String(opportunityStageStats.won) },
//         { label: 'Lost Opportunities', value: String(opportunityStageStats.lost) },
//       ],
//       opportunityWinRateValue,
//       opportunityWinRateGradient,
//       opportunityVerticals,
//       pipelineHeights,
//       conversion,
//     };
//   }, [accounts, opportunities, leads, tasks, budgetTeamSummary]);

//   const taskItems = [...tasks]
//     .sort((a: any, b: any) => toTimestamp(a?.end_date) - toTimestamp(b?.end_date))
//     .slice(0, 3)
//     .map((task: any) => ({
//       task: toDisplayText(task?.task) || 'Untitled task',
//       priority: toDisplayText(task?.priority) || 'N/A',
//       due: toDisplayText(task?.end_date) || 'N/A',
//     }));

//   const activityItems = [
//     ...opportunities.map((op: any) => {
//       const stage = getLatestOpportunityStage(op);
//       return {
//         ts: Math.max(
//           toTimestamp(op?.last_update),
//           toTimestamp(stage?.last_update),
//           toTimestamp(op?.acct_created_date)
//         ),
//         text:
//           `${toDisplayText(op?.account_name) || 'Account'} updated opportunity ` +
//           `${toDisplayText(op?.opportunity) || 'Untitled'} (${toDisplayText(stage?.stages ?? op?.status) || 'No stage'}).`,
//       };
//     }),
//     ...leads.map((lead: any) => {
//       const stage = Array.isArray(lead?.lead_stages) && lead.lead_stages.length > 0
//         ? lead.lead_stages[lead.lead_stages.length - 1]
//         : null;
//       return {
//         ts: Math.max(
//           toTimestamp(lead?.last_update),
//           toTimestamp(stage?.last_update),
//           toTimestamp(lead?.acct_created_date)
//         ),
//         text:
//           `Lead ${toDisplayText(lead?.lead) || 'Untitled'} assigned to ` +
//           `${toDisplayText(lead?.assign_to) || 'Unassigned'} (${toDisplayText(stage?.stages ?? lead?.status) || 'No stage'}).`,
//       };
//     }),
//     ...tasks.map((task: any) => ({
//       ts: Math.max(toTimestamp(task?.end_date), toTimestamp(task?.start_date)),
//       text:
//         `Task ${toDisplayText(task?.task) || 'Untitled'} is ` +
//         `${toDisplayText(task?.status) || 'Open'} (${toDisplayText(task?.assignedto_username) || 'Unassigned'}).`,
//     })),
//   ]
//     .sort((a, b) => b.ts - a.ts)
//     .slice(0, 4)
//     .map((item) => item.text);

//   const scheduleItems = [...tasks]
//     .sort((a: any, b: any) => toTimestamp(a?.start_date) - toTimestamp(b?.start_date))
//     .slice(0, 3)
//     .map((task: any) => ({
//       time: toDisplayText(task?.start_date) || 'N/A',
//       title: toDisplayText(task?.task) || 'Task',
//       note: `${toDisplayText(task?.status) || 'N/A'} - ${toDisplayText(task?.assignedto_username) || 'Unassigned'}`,
//     }));

//   const openDeals = opportunities.length;
//   const topPerformer =
//     [...budgetTeamSummary]
//       .sort((a: any, b: any) => (Number(b?.this_month) || 0) - (Number(a?.this_month) || 0))[0]?.sales_person || 'N/A';
//   const criticalRows = [...opportunities]
//     .sort((a: any, b: any) => {
//       const aStage = getLatestOpportunityStage(a);
//       const bStage = getLatestOpportunityStage(b);
//       const aTs = Math.max(
//         toTimestamp(a?.last_update),
//         toTimestamp(aStage?.last_update),
//         toTimestamp(a?.acct_created_date)
//       );
//       const bTs = Math.max(
//         toTimestamp(b?.last_update),
//         toTimestamp(bStage?.last_update),
//         toTimestamp(b?.acct_created_date)
//       );
//       return bTs - aTs;
//     })
//     .slice(0, 6)
//     .map((op: any, index: number) => {
//     const stage = getLatestOpportunityStage(op);
//     const amount = Number(op?.total_amount) || Number(op?.values) || 0;
//     const efficiency = Math.min(100, Math.max(15, Math.round((amount / 1000000) * 100)));
//     const issue =
//       toDisplayText(
//         stage?.stages ??
//         stage?.ranks ??
//         stage?.lost_reason ??
//         stage
//       ) ||
//       toDisplayText(op?.status) ||
//       'Follow-up required';
//     const owner =
//       toDisplayText(op?.assign_to ?? op?.assignedto_username ?? op?.pic ?? op?.contact_person) || 'Unassigned';
//     const rankText = toDisplayText(stage?.ranks).toLowerCase();
//     const statusText = toDisplayText(op?.status).toLowerCase();
//     const risk =
//       rankText.includes('rank d') || statusText.includes('lost')
//         ? 'Critical'
//         : rankText.includes('rank c') || rankText.includes('rank b') || statusText.includes('follow')
//           ? 'Warning'
//           : 'Stable';

//       return {
//         id: op?.id || index + 1,
//         name: toDisplayText(op?.opportunity ?? op?.account_name) || `Deal ${index + 1}`,
//         line: toDisplayText(op?.vertical ?? op?.sub_make_brand ?? op?.sub_make ?? op?.make ?? op?.source ?? op?.lead_source) || 'N/A',
//         issue,
//         efficiency,
//         owner,
//         risk,
//       };
//     });
//   return (
//     <div className={styles.pageShell}>
//       <div className={styles.surface}>
//         <div className={styles.topRow}>
//           <h1 className={styles.pageTitle}>
//             <span className={styles.pageTitleMain}>Welcome to <span className={styles.brandHighlight}>SalesPie</span>!</span>
//             <span className={styles.pageTitleSub}>Empowering businesses with intelligent sales insights.</span>
//           </h1>
//         </div>

//         <section className={styles.quickLinks}>
//           {homeQuickLinks.map((item) => (
//             <button key={item.title} className={styles.linkBtn} onClick={() => navigate(withPrefix(item.path))}>
//               {item.title}
//             </button>
//           ))}
//         </section>

//         <section className={styles.kpiGrid}>
//           {derived.kpiCards.map((card) => (
//             <article key={card.label} className={styles.kpiCard}>
//               <p className={styles.kpiLabel}>{card.label}</p>
//               <p className={styles.kpiValue}>{card.amount}</p>
//               <p className={styles.kpiHelper}>{card.helper}</p>
//             </article>
//           ))}
//         </section>

//         <section className={styles.middleGrid}>
//           <article className={styles.panel}>
//             <div className={styles.panelHeader}>
//               <h3>Communication Overview</h3>
//               <span>Weekly</span>
//             </div>
//             <div className={styles.communicationWrap}>
//               <div className={styles.legendList}>
//                 {derived.communicationItems.map((item) => (
//                   <div
//                     key={item.label}
//                     className={styles.legendItem}
//                     style={{
//                       '--item-color': item.color,
//                       '--item-color-light': `${item.color}0a`,
//                       '--item-color-hover': `${item.color}15`,
//                       '--item-color-track': `${item.color}1c`,
//                     } as React.CSSProperties}
//                   >
//                     <div className={styles.legendHeader}>
//                       <span className={styles.legendLabel}>
//                         <i className={styles.legendDot} style={{ background: 'var(--item-color)' }} />
//                         {item.label} ({item.percentLabel})
//                       </span>
//                       <b style={{ color: 'var(--item-color)' }}>{item.value}</b>
//                     </div>
//                     <div className={styles.legendBarTrack}>
//                       <i
//                         className={styles.legendBarFill}
//                         style={{
//                           width: `${item.percent}%`,
//                           background: 'var(--item-color)',
//                         }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className={styles.donut} style={{ background: derived.donutGradient }}>
//                 <div className={styles.donutCenter}><span>Total</span><strong>{derived.commTotal.toLocaleString()}</strong></div>
//               </div>
//             </div>
//             <div className={styles.communicationSummary}>
//               {derived.communicationSummary.map((item) => (
//                 <div key={item.label}>
//                   <span>{item.label}</span>
//                   <strong>{item.value}</strong>
//                 </div>
//               ))}
//             </div>
//           </article>

//           <article className={styles.panel}>
//             <div className={styles.panelHeader}>
//               <h3>Opportunity Insights</h3>
//               <span>Project Data</span>
//             </div>
//             <div className={styles.statsPanel}>
//               <div className={styles.statsGrid}>
//                 {derived.opportunityHealth.map((item) => (
//                   <div key={item.label}>
//                     <strong>{item.value}</strong>
//                     <p>{item.label}</p>
//                   </div>
//                 ))}
//               </div>
//               <div className={styles.statsRingWrap}>
//                 <div className={styles.statsRing} style={{ background: derived.opportunityWinRateGradient }}>
//                   <div className={styles.statsRingInner}>
//                     <span>Win Rate</span>
//                     <strong>{derived.opportunityWinRateValue}%</strong>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className={styles.teamSummaryGrid}>
//               {derived.opportunityVerticals.length > 0 ? (
//                 derived.opportunityVerticals.map((item) => (
//                   <div key={item.label}>
//                     <span>{item.label}</span>
//                     <strong>{item.value}</strong>
//                   </div>
//                 ))
//               ) : (
//                 <div>
//                   <span>No opportunity verticals</span>
//                   <strong>0</strong>
//                 </div>
//               )}
//             </div>
//           </article>

//           <article className={styles.illustrationCard}>
//             <div className={styles.spotlightHeader}>
//               <span className={styles.spotlightTag}>Sales Spotlight</span>
//               <strong>Today</strong>
//             </div>
//             <div className={styles.spotlightVisual}>
//               <div className={styles.pipelineVisual}>
//                 <div className={styles.pipelineHeader}>
//                   <span>Pipeline Health</span>
//                   <strong>Strong</strong>
//                 </div>
//                 <div className={styles.pipelineBars}>
//                   {derived.pipelineHeights.map((h, i) => (
//                     <span key={i} style={{ height: h }} />
//                   ))}
//                 </div>
//                 <div className={styles.pipelineStages}>
//                   <span>Lead</span>
//                   <span>Qualify</span>
//                   <span>Offer</span>
//                   <span>Won</span>
//                 </div>
//               </div>
//             </div>
//             <div className={styles.spotlightMetrics}>
//               <div>
//                 <span>Best Performer</span>
//                 <strong>{topPerformer}</strong>
//               </div>
//               <div>
//                 <span>Open Deals</span>
//                 <strong>{openDeals}</strong>
//               </div>
//             </div>
//             <p>Keep momentum high with live pipeline visibility and direct access to your dashboard.</p>
//             <button onClick={() => navigate(withPrefix(salesDashboardPath))}>Go to Sales Dashboard</button>
//           </article>
//         </section>

//         <section className={styles.featureGrid}>
//           <article className={styles.featureCard}>
//             <div className={styles.featureHeader}>
//               <h4>Priority Tasks</h4>
//               <button onClick={() => navigate(withPrefix('/TaskWorkspace'))}>Open Tasks</button>
//             </div>
//             <div className={styles.featureList}>
//               {taskItems.map((item) => (
//                 <div key={item.task} className={styles.taskRow}>
//                   <div>
//                     <p>{item.task}</p>
//                     <small>Due: {item.due}</small>
//                   </div>
//                   <span className={styles.priorityTag}>{item.priority}</span>
//                 </div>
//               ))}
//             </div>
//           </article>

//           <article className={styles.featureCard}>
//             <div className={styles.featureHeader}>
//               <h4>Recent Activity</h4>
//               <button onClick={() => navigate(withPrefix('/LeadWorkspace'))}>View Leads</button>
//             </div>
//             <ul className={styles.activityList}>
//               {activityItems.map((item) => (
//                 <li key={item}>{item}</li>
//               ))}
//             </ul>
//           </article>

//           <article className={styles.featureCard}>
//             <div className={styles.featureHeader}>
//               <h4>Today's Schedule</h4>
//               <button onClick={() => navigate(withPrefix('/opportunityspace'))}>Open Workspace</button>
//             </div>
//             <div className={styles.scheduleList}>
//               {scheduleItems.map((item) => (
//                 <div key={`${item.time}-${item.title}`} className={styles.scheduleRow}>
//                   <span>{item.time}</span>
//                   <div>
//                     <p>{item.title}</p>
//                     <small>{item.note}</small>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </article>
//         </section>

//         <section className={styles.tableSection}>
//           <div className={styles.tableHeaderBar}>
//             <strong>Critical Pipeline Table</strong>
//             <button
//               onClick={() =>
//                 navigate(withPrefix(isUserMode ? '/OpportunityWorkspaceTable' : '/AdminOpportunityWorkspaceTable'))
//               }
//             >
//               View All
//             </button>
//           </div>
//           <div className={styles.tableWrap}>
//             <table className={styles.analyticsTable}>
//               <thead>
//                 <tr>
//                   <th>Deal Info</th>
//                   <th>Line</th>
//                   <th>Current Status</th>
//                   <th>Efficiency</th>
//                   <th>Assigned Owner</th>
//                   <th>Risk</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {criticalRows.map((row) => (
//                   <tr key={`${row.id}-${row.name}`}>
//                     <td>
//                       <div className={styles.dealInfo}>
//                         <span>{row.id}</span>
//                         <div>
//                           <p>{row.name}</p>
//                           <small>ID-{row.id}</small>
//                         </div>
//                       </div>
//                     </td>
//                     <td><span className={styles.lineTag}>{row.line}</span></td>
//                     <td>{row.issue}</td>
//                     <td>
//                       <div className={styles.efficiencyCell}>
//                         <div className={styles.efficiencyTrack}>
//                           <i style={{ width: `${row.efficiency}%` }} />
//                         </div>
//                         <b>{row.efficiency}%</b>
//                       </div>
//                     </td>
//                     <td>{row.owner}</td>
//                     <td>
//                       <span
//                         className={`${styles.riskBadge} ${
//                           row.risk === 'Critical'
//                             ? styles.riskCritical
//                             : row.risk === 'Warning'
//                               ? styles.riskWarning
//                               : styles.riskStable
//                         }`}
//                       >
//                         {row.risk}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default MainComponent;




import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../../../app/store';
import { fetchAdminAccountWorkspaceTableData } from '../../../AdminAccountWorkspaceTable/AdminAccountWorkspaceTableSlice/AdminAccountWorkspaceTableSlice';
import { fetchAdminOpportunityWorkspaceTableData } from '../../../AdminOpportunityWorkspaceTable/AdminOpportunityWorkspaceTableSlice/AdminOpportunityWorkspaceTableSlice';
import { fetchAdminLeadWorkspaceList } from '../../../AdminLeadWorkspaceList/Slice/AdminLeadWorkspaceListSlice';
import { taskAdminFormData } from '../../../AdminTaskWorkspaceList/Slice/AdminTaskWorkspaceListSlice';
import { fetchTeamSummary } from '../../../Budget/slice/budgetSlice';
import { accountFormData } from '../../../tables/slice/tablesSlice';
import { fetchOpportunityWorkspaceTableData } from '../../../OpportunityWorkspaceTable/Slice/OpportunityWorkspaceTableSlice';
import { fetchLeadWorkspaceList } from '../../../LeadWorkspaceList/Slice/LeadWorkspaceList';
import { taskFormData } from '../../../TaskTable/slice/taskTableSlice';
import { fetchPerfEmployees } from '../../../UserHome/Settings/slice/settingsSlice';
import styles from './MainComponent.module.css';

const quickLinks = [
  { title: 'Open Sales Dashboard', path: '/SalesAdminDashboard' },
  { title: 'Opportunity Workspace', path: '/opportunityspace' },
  { title: 'Account Workspace', path: '/accountworkspace' },
  { title: 'Lead Workspace', path: '/LeadWorkspace' },
  { title: 'Task Workspace', path: '/TaskWorkspace' },
];

const formatCurrencyINR = (value: number) =>
  `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const toDisplayText = (value: unknown): string => {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => toDisplayText(item)).filter(Boolean).join(', ');
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return toDisplayText(
      obj.stages ??
      obj.ranks ??
      obj.lost_reason ??
      obj.status ??
      obj.name ??
      obj.title ??
      obj.label ??
      obj.id ??
      ''
    );
  }
  return '';
};

const toTimestamp = (value: unknown): number => {
  if (typeof value !== 'string' || !value.trim()) return 0;
  const ts = new Date(value).getTime();
  return Number.isFinite(ts) ? ts : 0;
};

const getLatestOpportunityStage = (opportunity: any): any => {
  if (!Array.isArray(opportunity?.opportunity_stages) || opportunity.opportunity_stages.length === 0) {
    return null;
  }
  return opportunity.opportunity_stages[opportunity.opportunity_stages.length - 1];
};

const ensureArray = (value: unknown): any[] => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const candidate = obj.data ?? obj.results ?? obj.items ?? obj.rows ?? obj.payload;
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
};

const HOME_FY_MONTHS = [
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December', 'January', 'February', 'March',
];

const HOME_MONTH_TO_NUM: Record<string, number> = {
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

const normalizeText = (value: unknown): string => String(value ?? '').trim().toLowerCase();

const parseSafeDate = (value: unknown): Date | null => {
  if (typeof value !== 'string' || !value.trim()) return null;
  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

interface MainComponentProps {
  routePrefix?: string;
  isUserMode?: boolean;
}

interface PicUser {
  id?: number | string;
  name?: string | null;
  username?: string | null;
  employeeid?: string | null;
  employeeId?: string | null;
  email?: string | null;
  role?: string | null;
}

const MainComponent: React.FC<MainComponentProps> = ({
  routePrefix = '',
  isUserMode = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const accounts = useSelector((state: RootState) =>
    isUserMode
      ? (state.accountData.data || [])
      : (state.fetchAdminAccountWorkspaceData.data || [])
  );
  const opportunities = useSelector((state: RootState) =>
    isUserMode
      ? (state.OpportunityWorkspaceTableData.OpportunityData || [])
      : (state.fetchAdminOpportunityWorkspaceData.data || [])
  );
  const leads = useSelector((state: RootState) =>
    isUserMode
      ? (state.fetchLeadWorkspaceListData.data || [])
      : (state.fetchAdminLeadWorkspaceListData.data || [])
  );
  const tasks = useSelector((state: RootState) =>
    isUserMode
      ? (state.taskData.totaldata || [])
      : (state.fetchAdminTaskData.taskdata || [])
  );
  const budgetTeamSummary = useSelector((state: RootState) => state.budget.teamSummary || []);
  const picUsers = useSelector((state: RootState) => (state.settings.employees || []) as PicUser[]);
  const now = new Date();
  const defaultFYYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const defaultMonthName = now.toLocaleString('default', { month: 'long' });
  const [filterType, setFilterType] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedYear, setSelectedYear] = useState<number>(defaultFYYear);
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonthName);
  const [selectedPic, setSelectedPic] = useState<string>('all');

  const yearOptions = useMemo(
    () => [defaultFYYear - 2, defaultFYYear - 1, defaultFYYear].filter((y) => y > 2020),
    [defaultFYYear]
  );

  const picOptions = useMemo(() => {
    if (isUserMode) return [];
    return (Array.isArray(picUsers) ? picUsers : [])
      .filter((user) => String(user?.role || '').trim().toLowerCase() === 'user')
      .map((user) => ({
        value: String(user?.id ?? ''),
        label: toDisplayText(user?.username ?? user?.name) || '',
      }))
      .filter((item) => item.value && item.label)
      .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
  }, [isUserMode, picUsers]);

  const selectedPicUser = useMemo(
    () => (Array.isArray(picUsers) ? picUsers : []).find((user) => String(user?.id) === String(selectedPic)),
    [picUsers, selectedPic]
  );

  const selectedPicTerms = useMemo(() => {
    if (isUserMode || selectedPic === 'all' || !selectedPicUser) return new Set<string>();
    const emailPrefix = String(selectedPicUser.email || '').split('@')[0];
    const terms = [
      selectedPicUser.username,
      selectedPicUser.name,
      selectedPicUser.email,
      emailPrefix,
    ]
      .map((term) => normalizeText(term))
      .filter(Boolean);
    return new Set<string>(terms);
  }, [isUserMode, selectedPic, selectedPicUser]);

  const selectedPicLabel = useMemo(() => {
    if (selectedPic === 'all') return 'All PICs';
    return picOptions.find((item) => item.value === selectedPic)?.label || `PIC ${selectedPic}`;
  }, [picOptions, selectedPic]);

  const scopedData = useMemo(() => {
    const monthNum = HOME_MONTH_TO_NUM[selectedMonth] || 4;
    const monthYear = monthNum <= 3 ? selectedYear + 1 : selectedYear;
    const fyStart = new Date(selectedYear, 3, 1, 0, 0, 0, 0);
    const fyEnd = new Date(selectedYear + 1, 2, 31, 23, 59, 59, 999);

    const inDateScope = (row: any): boolean => {
      const candidates = [
        row?.acct_created_date,
        row?.created_at,
        row?.last_update,
        row?.start_date,
        row?.end_date,
        row?.updated_at,
      ];
      const date = candidates.map(parseSafeDate).find(Boolean) || null;
      if (!date) return true;
      if (filterType === 'monthly') {
        return date.getMonth() + 1 === monthNum && date.getFullYear() === monthYear;
      }
      return date >= fyStart && date <= fyEnd;
    };

    const rowPicMatch = (row: any): boolean => {
      if (isUserMode || selectedPic === 'all') return true;
      const ownerCandidates = [
        row?.assign_to,
        row?.assignedto_username,
        row?.user,
        row?.username,
        row?.pic,
        row?.contact_person,
        row?.sales_person,
        row?.name,
        row?.owner,
      ];
      const ownerValues = ownerCandidates
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .map((value) => normalizeText(value))
        .filter(Boolean);
      if (ownerValues.some((value) => selectedPicTerms.has(value))) return true;

      const idCandidates = [row?.user_id, row?.assigned_to_id, row?.pic_id, row?.owner_id]
        .map((value) => String(value ?? '').trim())
        .filter(Boolean);
      return idCandidates.includes(String(selectedPic));
    };

    const applyScope = (rows: any[]) =>
      rows.filter((row) => inDateScope(row) && rowPicMatch(row));

    const scopedAccounts = applyScope(ensureArray(accounts));
    const scopedOpportunities = applyScope(ensureArray(opportunities));
    const scopedLeads = applyScope(ensureArray(leads));
    const scopedTasks = applyScope(ensureArray(tasks));
    const scopedBudgetSummary = ensureArray(budgetTeamSummary).filter((row: any) => {
      if (isUserMode || selectedPic === 'all') return true;
      const ownerName = normalizeText(row?.sales_person ?? row?.username ?? row?.name);
      return ownerName ? selectedPicTerms.has(ownerName) : false;
    });

    return {
      accounts: scopedAccounts,
      opportunities: scopedOpportunities,
      leads: scopedLeads,
      tasks: scopedTasks,
      budgetSummary: scopedBudgetSummary,
    };
  }, [
    accounts,
    opportunities,
    leads,
    tasks,
    budgetTeamSummary,
    filterType,
    selectedMonth,
    selectedYear,
    selectedPic,
    selectedPicTerms,
    isUserMode,
  ]);

  const filteredAccounts = scopedData.accounts;
  const filteredOpportunities = scopedData.opportunities;
  const filteredLeads = scopedData.leads;
  const filteredTasks = scopedData.tasks;
  const filteredBudgetTeamSummary = scopedData.budgetSummary;

  const isMonthlyMode = filterType === 'monthly';
  const isFilterActive =
    isMonthlyMode ||
    selectedYear !== defaultFYYear ||
    selectedPic !== 'all' ||
    (isMonthlyMode && selectedMonth !== defaultMonthName);

  const resetHomeFilters = () => {
    setFilterType('yearly');
    setSelectedYear(defaultFYYear);
    setSelectedMonth(defaultMonthName);
    setSelectedPic('all');
  };

  useEffect(() => {
    const syncHomeData = () => {
      const requests = isUserMode
        ? [
            dispatch(accountFormData()),
            dispatch(fetchOpportunityWorkspaceTableData()),
            dispatch(fetchLeadWorkspaceList()),
            dispatch(taskFormData()),
          ]
        : [
            dispatch(fetchAdminAccountWorkspaceTableData()),
            dispatch(fetchAdminOpportunityWorkspaceTableData()),
            dispatch(fetchAdminLeadWorkspaceList()),
            dispatch(taskAdminFormData()),
          ];

      requests.push(dispatch(fetchTeamSummary()));
      requests.push(dispatch(fetchPerfEmployees()));
      void Promise.allSettled(requests);
    };

    syncHomeData();

    const handleWindowFocus = () => {
      syncHomeData();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncHomeData();
      }
    };

    const refreshTimer = window.setInterval(() => {
      syncHomeData();
    }, 30000);

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, isUserMode, location.pathname]);

  const withPrefix = (path: string) => {
    if (!routePrefix) return path;
    if (path.startsWith(routePrefix + '/')) return path;
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${routePrefix}${normalized}`;
  };

  const salesDashboardPath = isUserMode ? '/SalesUserDashboard' : '/SalesAdminDashboard';
  const homeQuickLinks = quickLinks.map((item) =>
    item.path === '/SalesAdminDashboard' ? { ...item, path: salesDashboardPath } : item
  );

  const derived = useMemo(() => {
    const pipelineValue = filteredOpportunities.reduce(
      (sum: number, item: any) => sum + (Number(item.total_amount) || Number(item.values) || 0),
      0
    );
    const thisMonthLeads = filteredLeads.length;
    const pendingFollowUps = filteredTasks.filter(
      (task: any) => task?.status === 'Pending' || task?.status === 'In Progress'
    ).length;
    const wonLeads = filteredLeads.filter((lead: any) =>
      String(lead?.status || '').toLowerCase().includes('won')
    ).length;
    const conversion = filteredLeads.length
      ? `${Math.round((wonLeads / filteredLeads.length) * 100)}%`
      : '0%';
    const completedTasks = filteredTasks.filter((task: any) => task?.status === 'Completed').length;
    const budgetThisMonth = filteredBudgetTeamSummary.reduce(
      (sum: number, row: any) => sum + (Number(row?.this_month) || 0),
      0
    );
    const taskByPriority = {
      high: filteredTasks.filter((task: any) => String(task?.priority || '').toLowerCase() === 'high').length,
      medium: filteredTasks.filter((task: any) => String(task?.priority || '').toLowerCase() === 'medium').length,
      low: filteredTasks.filter((task: any) => String(task?.priority || '').toLowerCase() === 'low').length,
    };

    const pipelineStagesData = [
      { label: 'Lead', count: filteredLeads.length },
      { label: 'Qualify', count: filteredLeads.filter((l: any) => String(l.status || '').toLowerCase().includes('qualify')).length },
      { label: 'Offer', count: filteredLeads.filter((l: any) => String(l.status || '').toLowerCase().includes('offer')).length },
      { label: 'Won', count: wonLeads },
      { label: 'Target', count: filteredBudgetTeamSummary.length },
    ];
    const maxCount = Math.max(...pipelineStagesData.map(d => d.count), 1);
    const pipelineHeights = pipelineStagesData.map(d => `${Math.min(95, Math.max(15, Math.round((d.count / maxCount) * 100)))}%`);

    const openLeads = Math.max(0, filteredLeads.length - wonLeads);
    const openTasks = Math.max(0, filteredTasks.length - completedTasks);
    const communicationSeries = [
  { label: 'Accounts', value: filteredAccounts.length, color: '#6366f1', userPath: '/AccountWorkspaceTable', adminPath: '/AdminAccountWorkspaceTable' },
  { label: 'Opportunities', value: filteredOpportunities.length, color: '#06b6d4', userPath: '/OpportunityWorkspaceTable', adminPath: '/AdminOpportunityWorkspaceTable' },
  { label: 'Leads', value: openLeads, color: '#f43f5e', userPath: '/LeadWorkspaceList', adminPath: '/AdminLeadWorkspaceList' },
  { label: 'Tasks', value: openTasks, color: '#10b981', userPath: '/TaskWorkspaceList', adminPath: '/AdminTaskWorkspaceList' },
  { label: 'Completed Tasks', value: completedTasks, color: '#f59e0b', userPath: '/TaskWorkspaceList', adminPath: '/AdminTaskWorkspaceList' },
  { label: 'Won Leads', value: wonLeads, color: '#8b5cf6', userPath: '/LeadWorkspaceList', adminPath: '/AdminLeadWorkspaceList' },
];
    const commTotal = communicationSeries.reduce((sum, item) => sum + item.value, 0);
    const safeTotal = commTotal || 1;
    let cursor = 0;
    const donutGradient = commTotal > 0
      ? `conic-gradient(from 210deg, ${communicationSeries
          .map((item) => {
            const start = cursor;
            const end = start + (item.value / safeTotal) * 100;
            cursor = end;
            return `${item.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
          })
          .join(', ')})`
      : `conic-gradient(from 210deg, #e2e8f0 0 100%)`;

    const opportunityStageStats = filteredOpportunities.reduce(
      (acc: { open: number; followUp: number; won: number; lost: number }, item: any) => {
        const latestStage = getLatestOpportunityStage(item);
        const statusText = toDisplayText(latestStage?.stages ?? item?.status).toLowerCase();
        if (statusText.includes('won') || statusText.includes('fund')) acc.won += 1;
        else if (statusText.includes('lost')) acc.lost += 1;
        else if (statusText.includes('follow')) acc.followUp += 1;
        else acc.open += 1;
        return acc;
      },
      { open: 0, followUp: 0, won: 0, lost: 0 }
    );

    const opportunityWinRateValue = filteredOpportunities.length
      ? Math.round((opportunityStageStats.won / filteredOpportunities.length) * 100)
      : 0;
    const opportunityWinRateGradient = `conic-gradient(#4f46e5 0 ${opportunityWinRateValue}%, #e2e8f0 ${opportunityWinRateValue}% 100%)`;

    const verticalCounts = filteredOpportunities.reduce((acc: Record<string, number>, item: any) => {
      const verticalLabel =
        toDisplayText(item?.vertical ?? item?.sub_make_brand ?? item?.sub_make ?? item?.make) || 'Unspecified';
      acc[verticalLabel] = (acc[verticalLabel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const opportunityVerticals = Object.entries(verticalCounts)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 4)
      .map(([label, count]) => ({
        label,
        value: String(count),
      }));

    return {
      kpiCards: [
        { label: 'Pipeline Value', amount: formatCurrencyINR(pipelineValue), helper: 'From all active opportunities' },
        { label: 'New Leads', amount: String(thisMonthLeads), helper: 'Leads created this month' },
        { label: 'Follow Ups', amount: String(pendingFollowUps), helper: 'Pending + in progress tasks' },
        { label: 'Conversion', amount: conversion, helper: 'Won leads vs total leads' },
        { label: 'Team Activity', amount: String(completedTasks), helper: 'Completed tasks' },
        { label: 'Revenue Added', amount: formatCurrencyINR(budgetThisMonth), helper: 'Budget achievement this month' },
      ],
      communicationItems: communicationSeries.map((item) => {
        const percent = Math.round((item.value / safeTotal) * 100);
        return {
  label: item.label,
  value: String(item.value),
  color: item.color,
  percent,
  percentLabel: `${percent}%`,
  path: isUserMode ? item.userPath : item.adminPath,
};
      }),
      commTotal,
      donutGradient,
      communicationSummary: [
        { label: 'High Priority', value: String(taskByPriority.high) },
        { label: 'Medium Priority', value: String(taskByPriority.medium) },
        { label: 'Low Priority', value: String(taskByPriority.low) },
      ],
      opportunityHealth: [
        { label: 'Open Opportunities', value: String(opportunityStageStats.open) },
        { label: 'Follow-ups', value: String(opportunityStageStats.followUp) },
        { label: 'Won Opportunities', value: String(opportunityStageStats.won) },
        { label: 'Lost Opportunities', value: String(opportunityStageStats.lost) },
      ],
      opportunityWinRateValue,
      opportunityWinRateGradient,
      opportunityVerticals,
      pipelineHeights,
      conversion,
    };
  }, [
    filteredAccounts,
    filteredOpportunities,
    filteredLeads,
    filteredTasks,
    filteredBudgetTeamSummary,
    isUserMode,
  ]);

  const taskItems = [...filteredTasks]
    .sort((a: any, b: any) => toTimestamp(a?.end_date) - toTimestamp(b?.end_date))
    .slice(0, 3)
    .map((task: any) => ({
      task: toDisplayText(task?.task) || 'Untitled task',
      priority: toDisplayText(task?.priority) || 'N/A',
      due: toDisplayText(task?.end_date) || 'N/A',
    }));

  const activityItems = [
    ...filteredOpportunities.map((op: any) => {
      const stage = getLatestOpportunityStage(op);
      return {
        ts: Math.max(
          toTimestamp(op?.last_update),
          toTimestamp(stage?.last_update),
          toTimestamp(op?.acct_created_date)
        ),
        text:
          `${toDisplayText(op?.account_name) || 'Account'} updated opportunity ` +
          `${toDisplayText(op?.opportunity) || 'Untitled'} (${toDisplayText(stage?.stages ?? op?.status) || 'No stage'}).`,
      };
    }),
    ...filteredLeads.map((lead: any) => {
      const stage = Array.isArray(lead?.lead_stages) && lead.lead_stages.length > 0
        ? lead.lead_stages[lead.lead_stages.length - 1]
        : null;
      return {
        ts: Math.max(
          toTimestamp(lead?.last_update),
          toTimestamp(stage?.last_update),
          toTimestamp(lead?.acct_created_date)
        ),
        text:
          `Lead ${toDisplayText(lead?.lead) || 'Untitled'} assigned to ` +
          `${toDisplayText(lead?.assign_to) || 'Unassigned'} (${toDisplayText(stage?.stages ?? lead?.status) || 'No stage'}).`,
      };
    }),
    ...filteredTasks.map((task: any) => ({
      ts: Math.max(toTimestamp(task?.end_date), toTimestamp(task?.start_date)),
      text:
        `Task ${toDisplayText(task?.task) || 'Untitled'} is ` +
        `${toDisplayText(task?.status) || 'Open'} (${toDisplayText(task?.assignedto_username) || 'Unassigned'}).`,
    })),
  ]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 4)
    .map((item) => item.text);

  const scheduleItems = [...filteredTasks]
    .sort((a: any, b: any) => toTimestamp(a?.start_date) - toTimestamp(b?.start_date))
    .slice(0, 3)
    .map((task: any) => ({
      time: toDisplayText(task?.start_date) || 'N/A',
      title: toDisplayText(task?.task) || 'Task',
      note: `${toDisplayText(task?.status) || 'N/A'} - ${toDisplayText(task?.assignedto_username) || 'Unassigned'}`,
    }));

  const openDeals = filteredOpportunities.length;
  const topPerformer =
    [...filteredBudgetTeamSummary]
      .sort((a: any, b: any) => (Number(b?.this_month) || 0) - (Number(a?.this_month) || 0))[0]?.sales_person || 'N/A';
  const criticalRows = [...filteredOpportunities]
    .sort((a: any, b: any) => {
      const aStage = getLatestOpportunityStage(a);
      const bStage = getLatestOpportunityStage(b);
      const aTs = Math.max(
        toTimestamp(a?.last_update),
        toTimestamp(aStage?.last_update),
        toTimestamp(a?.acct_created_date)
      );
      const bTs = Math.max(
        toTimestamp(b?.last_update),
        toTimestamp(bStage?.last_update),
        toTimestamp(b?.acct_created_date)
      );
      return bTs - aTs;
    })
    .slice(0, 6)
    .map((op: any, index: number) => {
    const stage = getLatestOpportunityStage(op);
    const amount = Number(op?.total_amount) || Number(op?.values) || 0;
    const efficiency = Math.min(100, Math.max(15, Math.round((amount / 1000000) * 100)));
    const issue =
      toDisplayText(
        stage?.stages ??
        stage?.ranks ??
        stage?.lost_reason ??
        stage
      ) ||
      toDisplayText(op?.status) ||
      'Follow-up required';
    const owner =
      toDisplayText(op?.assign_to ?? op?.assignedto_username ?? op?.pic ?? op?.contact_person) || 'Unassigned';
    const rankText = toDisplayText(stage?.ranks).toLowerCase();
    const statusText = toDisplayText(op?.status).toLowerCase();
    const risk =
      rankText.includes('rank d') || statusText.includes('lost')
        ? 'Critical'
        : rankText.includes('rank c') || rankText.includes('rank b') || statusText.includes('follow')
          ? 'Warning'
          : 'Stable';

      return {
        id: op?.id || index + 1,
        name: toDisplayText(op?.opportunity ?? op?.account_name) || `Deal ${index + 1}`,
        line: toDisplayText(op?.vertical ?? op?.sub_make_brand ?? op?.sub_make ?? op?.make ?? op?.source ?? op?.lead_source) || 'N/A',
        issue,
        efficiency,
        owner,
        risk,
      };
    });
  const picRows = picUsers
    .filter((user) => String(user.role ?? '').toLowerCase() === 'user')
    .filter((user) => selectedPic === 'all' || String(user.id ?? '') === String(selectedPic))
    .map((user, index) => ({
      id: user.id ?? `${user.email || 'pic'}-${index}`,
      name: toDisplayText(user.name ?? user.username) || 'N/A',
      employeeId: toDisplayText(user.employeeid ?? user.employeeId) || 'N/A',
      email: toDisplayText(user.email) || 'N/A',
    }));

  return (
    <div className={styles.pageShell}>
      <div className={styles.surface}>
        <div className={styles.topRow}>
          <h1 className={styles.pageTitle}>
            <span className={styles.pageTitleMain}>Welcome to <span className={styles.brandHighlight}>SalesPie</span>!</span>
            <span className={styles.pageTitleSub}>Empowering businesses with intelligent sales insights.</span>
          </h1>
        </div>

        <section className={styles.homeFilterBar}>
          <div className={styles.homeFilterHeading}>Views</div>

          <div className={styles.homeFilterToggle}>
            <button
              type="button"
              onClick={() => setFilterType('yearly')}
              className={filterType === 'yearly' ? styles.homeToggleActive : ''}
            >
              Year (FY)
            </button>
            <button
              type="button"
              onClick={() => setFilterType('monthly')}
              className={filterType === 'monthly' ? styles.homeToggleActive : ''}
            >
              Month
            </button>
          </div>

          <label className={styles.homeFilterGroup}>
            <span>FY</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className={`${styles.homeFilterSelect} ${styles.homeFilterSelectFy}`}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}-{String(year + 1).slice(2)}
                </option>
              ))}
            </select>
          </label>

          {!isUserMode && (
            <label className={styles.homeFilterGroup}>
              <span>PIC</span>
              <select
                value={selectedPic}
                onChange={(e) => setSelectedPic(e.target.value)}
                className={`${styles.homeFilterSelect} ${styles.homeFilterSelectPic}`}
              >
                <option value="all">All PICs</option>
                {picOptions.map((pic) => (
                  <option key={pic.value} value={pic.value}>
                    {pic.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {filterType === 'monthly' && (
            <label className={styles.homeFilterGroup}>
              <span>Month</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`${styles.homeFilterSelect} ${styles.homeFilterSelectMonth}`}
              >
                {HOME_FY_MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
          )}

          <button type="button" className={styles.homeFilterReset} onClick={resetHomeFilters}>
            Reset
          </button>

          <div className={styles.homeFilterMeta}>
            <span>Showing:</span>
            <strong>
              {filterType === 'monthly'
                ? `${selectedMonth} FY ${selectedYear}-${String(selectedYear + 1).slice(2)}`
                : `FY ${selectedYear}-${String(selectedYear + 1).slice(2)}`}
              {!isUserMode && selectedPic !== 'all' ? ` | ${selectedPicLabel}` : ''}
              {isFilterActive ? ' | Filtered' : ''}
            </strong>
          </div>
        </section>

        <section className={styles.quickLinks}>
          {homeQuickLinks.map((item) => (
            <button key={item.title} className={styles.linkBtn} onClick={() => navigate(withPrefix(item.path))}>
              {item.title}
            </button>
          ))}
        </section>

        <section className={styles.kpiGrid}>
          {derived.kpiCards.map((card) => (
            <article key={card.label} className={styles.kpiCard}>
              <p className={styles.kpiLabel}>{card.label}</p>
              <p className={styles.kpiValue}>{card.amount}</p>
              <p className={styles.kpiHelper}>{card.helper}</p>
            </article>
          ))}
        </section>

        <section className={styles.middleGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3>Communication Overview</h3>
              <span>Weekly</span>
            </div>
            <div className={styles.communicationWrap}>
              <div className={styles.legendList}>
                {derived.communicationItems.map((item) => (
                  <div
                    key={item.label}
                    className={styles.legendItem}
                    style={{
                      '--item-color': item.color,
                      '--item-color-light': `${item.color}0a`,
                      '--item-color-hover': `${item.color}15`,
                      '--item-color-track': `${item.color}1c`,
                    } as React.CSSProperties}
                  >
                    <div className={styles.legendHeader}>
                      <button
  className={styles.legendLabel}
  onClick={() => navigate(withPrefix(item.path))}
  style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
>
  <i className={styles.legendDot} style={{ background: 'var(--item-color)' }} />
  {item.label} ({item.percentLabel})
</button>
                      <b style={{ color: 'var(--item-color)' }}>{item.value}</b>
                    </div>
                    <div className={styles.legendBarTrack}>
                      <i
                        className={styles.legendBarFill}
                        style={{
                          width: `${item.percent}%`,
                          background: 'var(--item-color)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.donut} style={{ background: derived.donutGradient }}>
                <div className={styles.donutCenter}><span>Total</span><strong>{derived.commTotal.toLocaleString()}</strong></div>
              </div>
            </div>
            <div className={styles.communicationSummary}>
              {derived.communicationSummary.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3>Opportunity Insights</h3>
              <span>Project Data</span>
            </div>
            <div className={styles.statsPanel}>
              <div className={styles.statsGrid}>
                {derived.opportunityHealth.map((item) => (
                  <div key={item.label}>
                    <strong>{item.value}</strong>
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>
              <div className={styles.statsRingWrap}>
                <div className={styles.statsRing} style={{ background: derived.opportunityWinRateGradient }}>
                  <div className={styles.statsRingInner}>
                    <span>Win Rate</span>
                    <strong>{derived.opportunityWinRateValue}%</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.teamSummaryGrid}>
              {derived.opportunityVerticals.length > 0 ? (
                derived.opportunityVerticals.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))
              ) : (
                <div>
                  <span>No opportunity verticals</span>
                  <strong>0</strong>
                </div>
              )}
            </div>
          </article>

          <article className={styles.illustrationCard}>
            <div className={styles.spotlightHeader}>
              <span className={styles.spotlightTag}>Sales Spotlight</span>
              <strong>Today</strong>
            </div>
            <div className={styles.spotlightVisual}>
              <div className={styles.pipelineVisual}>
                <div className={styles.pipelineHeader}>
                  <span>Pipeline Health</span>
                  <strong>Strong</strong>
                </div>
                <div className={styles.pipelineBars}>
                  {derived.pipelineHeights.map((h, i) => (
                    <span key={i} style={{ height: h }} />
                  ))}
                </div>
                <div className={styles.pipelineStages}>
                  <span>Lead</span>
                  <span>Qualify</span>
                  <span>Offer</span>
                  <span>Won</span>
                </div>
              </div>
            </div>
            <div className={styles.spotlightMetrics}>
              <div>
                <span>Best Performer</span>
                <strong>{topPerformer}</strong>
              </div>
              <div>
                <span>Open Deals</span>
                <strong>{openDeals}</strong>
              </div>
            </div>
            <p>Keep momentum high with live pipeline visibility and direct access to your dashboard.</p>
            <button onClick={() => navigate(withPrefix(salesDashboardPath))}>Go to Sales Dashboard</button>
          </article>
        </section>

        <section className={styles.featureGrid}>
          <article className={styles.featureCard}>
            <div className={styles.featureHeader}>
              <h4>Priority Tasks</h4>
              <button onClick={() => navigate(withPrefix('/TaskWorkspace'))}>Open Tasks</button>
            </div>
            <div className={styles.featureList}>
              {taskItems.map((item) => (
                <div key={item.task} className={styles.taskRow}>
                  <div>
                    <p>{item.task}</p>
                    <small>Due: {item.due}</small>
                  </div>
                  <span className={styles.priorityTag}>{item.priority}</span>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.featureCard}>
            <div className={styles.featureHeader}>
              <h4>Recent Activity</h4>
              <button onClick={() => navigate(withPrefix('/LeadWorkspace'))}>View Leads</button>
            </div>
            <ul className={styles.activityList}>
              {activityItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className={styles.featureCard}>
            <div className={styles.featureHeader}>
              <h4>Today's Schedule</h4>
              <button onClick={() => navigate(withPrefix('/opportunityspace'))}>Open Workspace</button>
            </div>
            <div className={styles.scheduleList}>
              {scheduleItems.map((item) => (
                <div key={`${item.time}-${item.title}`} className={styles.scheduleRow}>
                  <span>{item.time}</span>
                  <div>
                    <p>{item.title}</p>
                    <small>{item.note}</small>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className={styles.tableSection}>
          <div className={styles.tableHeaderBar}>
            <strong>Critical Pipeline Table</strong>
            <button
              onClick={() =>
                navigate(withPrefix(isUserMode ? '/OpportunityWorkspaceTable' : '/AdminOpportunityWorkspaceTable'))
              }
            >
              View All
            </button>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.analyticsTable}>
              <thead>
                <tr>
                  <th>Deal Info</th>
                  <th>Line</th>
                  <th>Current Status</th>
                  <th>Efficiency</th>
                  <th>Assigned Owner</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {criticalRows.map((row) => (
                  <tr key={`${row.id}-${row.name}`}>
                    <td>
                      <div className={styles.dealInfo}>
                        <span>{row.id}</span>
                        <div>
                          <p>{row.name}</p>
                          <small>ID-{row.id}</small>
                        </div>
                      </div>
                    </td>
                    <td><span className={styles.lineTag}>{row.line}</span></td>
                    <td>{row.issue}</td>
                    <td>
                      <div className={styles.efficiencyCell}>
                        <div className={styles.efficiencyTrack}>
                          <i style={{ width: `${row.efficiency}%` }} />
                        </div>
                        <b>{row.efficiency}%</b>
                      </div>
                    </td>
                    <td>{row.owner}</td>
                    <td>
                      <span
                        className={`${styles.riskBadge} ${
                          row.risk === 'Critical'
                            ? styles.riskCritical
                            : row.risk === 'Warning'
                              ? styles.riskWarning
                              : styles.riskStable
                        }`}
                      >
                        {row.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.tableSection}>
          <div className={styles.tableHeaderBar}>
            <strong>PIC (Person In Charge)</strong>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.analyticsTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Employee ID</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {picRows.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.employeeId}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainComponent;

