// import { useDispatch, useSelector } from "react-redux";
// import styles from "./AdminSpeedometer.module.css";
// import ReactSpeedometer, { CustomSegmentLabelPosition } from "react-d3-speedometer";
// import type { RootState } from "../../../app/store";
// import { useEffect, useState } from "react";
// import { fetchAdminSpeedometerData } from "./Slice/AdminSpeedometer";

// const AdminSpeedometer: React.FC = () => {
//   const dispatch = useDispatch();
//   const [speedValue, setSpeedValue] = useState(0); // Local state to avoid NaN

//   useEffect(() => {
//     dispatch(fetchAdminSpeedometerData() as any);
//   }, [dispatch]);

//   const { TotalAchived } = useSelector(
//     (state: RootState) => state.fetchAdminSpeedometer
//   );

//   useEffect(() => {
//     if (TotalAchived !== undefined && TotalAchived !== null) {
//       setSpeedValue(TotalAchived.total_sum); // Update only if valid
//     }
//   }, [TotalAchived]);

//   console.log("Speedometer Value:", speedValue); // Debugging

//   const maxValue = Math.max(5000000, speedValue * 2); // Dynamic max value

//   // Function to format values in millions
//   const formatValue = (val: number) => `${(val / 1000000).toFixed(2)} mil`;

//   return (
//     <div className={styles.Container}>
//       <p className={styles.head}>Achivements</p>
//       <div className={styles.Wrapper}>
//         <ReactSpeedometer
//           value={speedValue || 0} // Prevent NaN by setting default value
//           maxValue={maxValue}
//           needleColor="#5BE12C"
//           startColor="#EA4228"
//           endColor="#5BE12C"
//           segments={5}
//           width={350}
//           height={300}
//           needleTransitionDuration={400}
//           needleHeightRatio={0.8}
//           ringWidth={25}
//           valueTextFontSize="16px"
//           currentValueText={formatValue(speedValue)} // ✅ Fix: Use 'currentValueText' instead
//           customSegmentLabels={[
//             { text: formatValue(0), position: CustomSegmentLabelPosition.Outside, fontSize: "12px" },
//             { text: formatValue(maxValue * 0.25), position: CustomSegmentLabelPosition.Outside, fontSize: "12px" },
//             { text: formatValue(maxValue * 0.5), position: CustomSegmentLabelPosition.Outside, fontSize: "12px" },
//             { text: formatValue(maxValue * 0.75), position: CustomSegmentLabelPosition.Outside, fontSize: "12px" },
//             { text: formatValue(maxValue), position: CustomSegmentLabelPosition.Outside, fontSize: "12px" },
//           ]}
//         />
//       </div>
//     </div>
//   );
// };

// export default AdminSpeedometer;


// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import ReactSpeedometer, { CustomSegmentLabelPosition } from 'react-d3-speedometer';
// import styles from './AdminSpeedometer.module.css';
// import type { RootState } from '../../../app/store';
// import { fetchAdminSpeedometerData } from './Slice/AdminSpeedometer';

// /* ── Indian FY helper (auto-detects current year) ── */
// function getIndianFY() {
//   const now = new Date();
//   const m = now.getMonth();
//   const y = now.getFullYear();
//   const start      = m >= 3 ? new Date(y,     3, 1)          : new Date(y - 1, 3, 1);
//   const end        = m >= 3 ? new Date(y + 1, 2, 31, 23, 59) : new Date(y,     2, 31, 23, 59);
//   const label      = `FY ${String(start.getFullYear()).slice(2)}–${String(end.getFullYear()).slice(2)}`;
//   const totalDays  = (end.getTime()  - start.getTime()) / 86_400_000;
//   const elapsed    = Math.min((now.getTime() - start.getTime()) / 86_400_000, totalDays);
//   const daysLeft   = Math.max(0, Math.round(totalDays - elapsed));
//   const daysElapsed = Math.round(elapsed);
//   const timePct    = Math.round((elapsed / totalDays) * 100);
//   return { label, start, end, totalDays, daysLeft, daysElapsed, timePct, now };
// }

// const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// const fmt    = (v: number) => `₹${(v / 1_000_000).toFixed(2)}M`;
// const fmtK   = (v: number) => v >= 1_000_000 ? fmt(v) : `₹${(v / 1000).toFixed(1)}K`;

// const AdminSpeedometer: React.FC = () => {
//   const dispatch = useDispatch();
//   const [clock, setClock] = useState('');

//   useEffect(() => {
//     dispatch(fetchAdminSpeedometerData() as any);
//   }, [dispatch]);

//   /* ── Admin selector (kept from admin version) ── */
//   const { TotalAchived } = useSelector((state: RootState) => state.fetchAdminSpeedometer);
//   const achieved = TotalAchived?.total_sum ?? 0;
//   const TARGET   = Math.max(5_000_000, achieved * 2);
//   const fy       = getIndianFY();

//   /* ── Derived metrics ── */
//   const achPct     = Math.round((achieved / TARGET) * 100);
//   const gap        = Math.max(0, TARGET - achieved);
//   const dailyRate  = fy.daysElapsed > 0 ? achieved / fy.daysElapsed : 0;
//   const projected  = Math.round(dailyRate * fy.totalDays);
//   const maxValue   = TARGET;

//   /* ── Status ── */
//   const status =
//     achPct >= 75 ? { label: 'On Track',       bg: '#DCFCE7', color: '#15803D' } :
//     achPct >= 40 ? { label: 'Needs Attention', bg: '#FEF9C3', color: '#A16207' } :
//                    { label: 'Behind Target',   bg: '#FEE2E2', color: '#B91C1C' };

//   /* ── Live clock ── */
//   useEffect(() => {
//     const tick = () => {
//       const n = new Date();
//       setClock(
//         `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`
//       );
//     };
//     tick();
//     const id = setInterval(tick, 1000);
//     return () => clearInterval(id);
//   }, []);

//   /* ── Speedometer segment labels ── */
//   const segLabels = [0, 0.25, 0.5, 0.75, 1].map(f => ({
//     text:     fmt(maxValue * f),
//     position: CustomSegmentLabelPosition.Outside,
//     fontSize: '9px',
//     color:    '#94A3B8',
//   }));

//   return (
//     <div>

//       {/* ── Header ── */}
//       <div className={styles.header}>
//         <div className={styles.headerRight}>
//           <span className={styles.badge}>YTD · {fy.label}</span>
//         </div>
//       </div>
//       <div className={styles.subtitle}>
//         Apr {fy.start.getFullYear()} – Mar {fy.end.getFullYear()} &nbsp;·&nbsp;
//         {fy.now.getDate()} {MONTHS[fy.now.getMonth()]} {fy.now.getFullYear()}
//       </div>

//       {/* ── Gauge ── */}
//       <div className={styles.Wrapper}>
//         <ReactSpeedometer
//           value={achieved || 0}
//           maxValue={maxValue}
//           needleColor="#4F46E5"
//           startColor="#C7D2FE"
//           endColor="#4F46E5"
//           segments={5}
//           width={300}
//           height={220}
//           needleTransitionDuration={1400}
//           needleHeightRatio={0.75}
//           ringWidth={28}
//           valueTextFontSize="15px"
//           currentValueText={fmt(achieved)}
//           textColor="#1E293B"
//           customSegmentLabels={segLabels}
//         />
//       </div>

//       {/* ── Status pill ── */}
//       <div className={styles.pillRow}>
//         <span
//           className={styles.statusPill}
//           style={{ background: status.bg, color: status.color }}
//         >
//           {status.label}
//         </span>
//         <span className={styles.achPctBig}>{achPct}% of target</span>
//       </div>

//       <div className={styles.divider} />

//       {/* ── 4 Metric cards ── */}
//       <div className={styles.metrics}>
//         <div className={styles.met}>
//           <div className={styles.metLbl}>Annual target</div>
//           <div className={styles.metVal}>{fmt(TARGET)}</div>
//         </div>
//         <div className={styles.met}>
//           <div className={styles.metLbl}>Achieved</div>
//           <div className={styles.metVal} style={{ color: '#4F46E5' }}>{fmt(achieved)}</div>
//         </div>
//         <div className={styles.met}>
//           <div className={styles.metLbl}>Gap to close</div>
//           <div className={styles.metVal} style={{ color: gap === 0 ? '#16A34A' : '#DC2626' }}>
//             {gap === 0 ? 'Done!' : fmt(gap)}
//           </div>
//         </div>
//         <div className={styles.met}>
//           <div className={styles.metLbl}>Run rate EOY</div>
//           <div className={styles.metVal}>{fmt(projected)}</div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default AdminSpeedometer;


// src/features/AdminDashboard/AdminSpeedometer/AdminSpeedometer.tsx

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import ReactSpeedometer, { CustomSegmentLabelPosition } from 'react-d3-speedometer';
// import styles from './AdminSpeedometer.module.css';
// import type { RootState } from '../../../app/store';
// import { fetchAdminSpeedometerData } from './Slice/AdminSpeedometer';

// /* ── Indian FY helper ── */
// function getIndianFY() {
//   const now  = new Date();
//   const m    = now.getMonth();
//   const y    = now.getFullYear();
//   const start     = m >= 3 ? new Date(y,     3, 1)          : new Date(y - 1, 3, 1);
//   const end       = m >= 3 ? new Date(y + 1, 2, 31, 23, 59) : new Date(y,     2, 31, 23, 59);
//   const label     = `FY ${String(start.getFullYear()).slice(2)}–${String(end.getFullYear()).slice(2)}`;
//   const totalDays = (end.getTime()   - start.getTime()) / 86_400_000;
//   const elapsed   = Math.min(
//     (now.getTime() - start.getTime()) / 86_400_000,
//     totalDays
//   );
//   const daysLeft    = Math.max(0, Math.round(totalDays - elapsed));
//   const daysElapsed = Math.round(elapsed);
//   const timePct     = Math.round((elapsed / totalDays) * 100);
//   return { label, start, end, totalDays, daysLeft, daysElapsed, timePct, now };
// }

// const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// const fmt  = (v: number) => {
//   if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(2)}Cr`;
//   if (v >= 1_00_000)    return `₹${(v / 1_00_000).toFixed(2)}L`;
//   if (v >= 1_000)       return `₹${(v / 1_000).toFixed(1)}K`;
//   return `₹${v.toLocaleString()}`;
// };

// const AdminSpeedometer: React.FC = () => {
//   const dispatch = useDispatch<any>();
//   const [clock, setClock] = useState('');

//   useEffect(() => {
//     dispatch(fetchAdminSpeedometerData());
//   }, [dispatch]);

//   // ── Selectors ─────────────────────────────────────────────
//   // NOTE: update the state key to match your store registration
//   const { data, loading } = useSelector(
//     (state: RootState) => state.fetchAdminSpeedometer
//   );

//   const achieved = data?.total_achieved       || 0;
//   // ✅ Real annual target from budget — NOT hardcoded
//   const TARGET   = data?.total_annual_target  || 0;
//   const dealsWon = data?.fy_deals_closed      || 0;

//   const fy = getIndianFY();

//   // ── Derived metrics ───────────────────────────────────────
//   const achPct    = TARGET > 0 ? Math.round((achieved / TARGET) * 100) : 0;
//   const gap       = Math.max(0, TARGET - achieved);
//   const dailyRate = fy.daysElapsed > 0 ? achieved / fy.daysElapsed : 0;
//   const projected = Math.round(dailyRate * fy.totalDays);

//   // maxValue: use TARGET if > 0, else use achieved * 1.5 as fallback
//   const maxValue  = TARGET > 0 ? TARGET : Math.max(1_000_000, achieved * 1.5);

//   // ── Status ────────────────────────────────────────────────
//   const status =
//     achPct >= 75 ? { label: 'On Track',       bg: '#DCFCE7', color: '#15803D' } :
//     achPct >= 40 ? { label: 'Needs Attention', bg: '#FEF9C3', color: '#A16207' } :
//                    { label: 'Behind Target',   bg: '#FEE2E2', color: '#B91C1C' };

//   // ── Live clock ────────────────────────────────────────────
//   useEffect(() => {
//     const tick = () => {
//       const n = new Date();
//       setClock(
//         `${String(n.getHours()).padStart(2,'0')}:` +
//         `${String(n.getMinutes()).padStart(2,'0')}:` +
//         `${String(n.getSeconds()).padStart(2,'0')}`
//       );
//     };
//     tick();
//     const id = setInterval(tick, 1000);
//     return () => clearInterval(id);
//   }, []);

//   // ── Speedometer segment labels ────────────────────────────
//   const segLabels = [0, 0.25, 0.5, 0.75, 1].map(f => ({
//     text:     fmt(maxValue * f),
//     position: CustomSegmentLabelPosition.Outside,
//     fontSize: '9px',
//     color:    '#94A3B8',
//   }));

//   if (loading) {
//     return (
//       <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8', fontSize: 13 }}>
//         Loading…
//       </div>
//     );
//   }

//   return (
//     <div>

//       {/* ── Header ── */}
//       <div className={styles.header}>
//         <div className={styles.headerRight}>
//           <span className={styles.badge}>YTD · {fy.label}</span>
//         </div>
//       </div>
//       <div className={styles.subtitle}>
//         Apr {fy.start.getFullYear()} – Mar {fy.end.getFullYear()} &nbsp;·&nbsp;
//         {fy.now.getDate()} {MONTHS[fy.now.getMonth()]} {fy.now.getFullYear()}
//       </div>

//       {/* ── Gauge ── */}
//       <div className={styles.Wrapper}>
//         <ReactSpeedometer
//           value={Math.min(achieved, maxValue)}
//           maxValue={maxValue}
//           needleColor="#4F46E5"
//           startColor="#C7D2FE"
//           endColor="#4F46E5"
//           segments={5}
//           width={300}
//           height={220}
//           needleTransitionDuration={1400}
//           needleHeightRatio={0.75}
//           ringWidth={28}
//           valueTextFontSize="15px"
//           currentValueText={fmt(achieved)}
//           textColor="#1E293B"
//           customSegmentLabels={segLabels}
//         />
//       </div>

//       {/* ── Status pill ── */}
//       <div className={styles.pillRow}>
//         <span
//           className={styles.statusPill}
//           style={{ background: status.bg, color: status.color }}
//         >
//           {status.label}
//         </span>
//         <span className={styles.achPctBig}>{achPct}% of target</span>
//       </div>

//       <div className={styles.divider} />

//       {/* ── 4 Metric cards ── */}
//       <div className={styles.metrics}>
//         <div className={styles.met}>
//           <div className={styles.metLbl}>Annual Target</div>
//           {/* ✅ Real target from budgets — sum of all users' revenue_target */}
//           <div className={styles.metVal}>
//             {TARGET > 0 ? fmt(TARGET) : '—'}
//           </div>
//         </div>
//         <div className={styles.met}>
//           <div className={styles.metLbl}>Achieved</div>
//           <div className={styles.metVal} style={{ color: '#4F46E5' }}>
//             {fmt(achieved)}
//           </div>
//         </div>
//         <div className={styles.met}>
//           <div className={styles.metLbl}>Gap to Close</div>
//           <div className={styles.metVal} style={{ color: gap === 0 ? '#16A34A' : '#DC2626' }}>
//             {gap === 0 ? 'Done!' : fmt(gap)}
//           </div>
//         </div>
//         <div className={styles.met}>
//           <div className={styles.metLbl}>Run Rate EOY</div>
//           <div className={styles.metVal}>{fmt(projected)}</div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default AdminSpeedometer;


// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import ReactSpeedometer, { CustomSegmentLabelPosition } from 'react-d3-speedometer';
// import styles from './AdminSpeedometer.module.css';
// import type { RootState } from '../../../app/store';
// import { fetchAdminSpeedometerData } from './Slice/AdminSpeedometer';

// function getIndianFY() {
//   const now  = new Date();
//   const m    = now.getMonth();
//   const y    = now.getFullYear();
//   const start     = m >= 3 ? new Date(y,     3, 1)          : new Date(y - 1, 3, 1);
//   const end       = m >= 3 ? new Date(y + 1, 2, 31, 23, 59) : new Date(y,     2, 31, 23, 59);
//   const label     = `FY ${String(start.getFullYear()).slice(2)}–${String(end.getFullYear()).slice(2)}`;
//   const totalDays = (end.getTime()   - start.getTime()) / 86_400_000;
//   const elapsed   = Math.min((now.getTime() - start.getTime()) / 86_400_000, totalDays);
//   const daysLeft    = Math.max(0, Math.round(totalDays - elapsed));
//   const daysElapsed = Math.round(elapsed);
//   const timePct     = Math.round((elapsed / totalDays) * 100);
//   return { label, start, end, totalDays, daysLeft, daysElapsed, timePct, now };
// }

// const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// const fmt = (v: number) => {
//   if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(2)}Cr`;
//   if (v >= 1_00_000)    return `₹${(v / 1_00_000).toFixed(2)}L`;
//   if (v >= 1_000)       return `₹${(v / 1_000).toFixed(1)}K`;
//   return `₹${v.toLocaleString()}`;
// };

// const AdminSpeedometer: React.FC = () => {
//   const dispatch = useDispatch<any>();
//   const [clock, setClock] = useState('');

//   // ── Read globalFilter ──────────────────────────────────────
//   const { selectedYear, selectedMonth, filterType } = useSelector(
//     (s: RootState) => s.globalFilter
//   );

//   const { data, loading } = useSelector(
//     (state: RootState) => state.fetchAdminSpeedometer
//   );

//   // ✅ FIXED: re-fetch when filter changes
//   useEffect(() => {
//     dispatch(fetchAdminSpeedometerData());
//   }, [dispatch, selectedYear, selectedMonth, filterType]);

//   const achieved = data?.total_achieved       || 0;
//   const TARGET   = data?.total_annual_target  || 0;
//   const dealsWon = data?.fy_deals_closed      || 0;
//   const fy       = getIndianFY();

//   const achPct    = TARGET > 0 ? Math.round((achieved / TARGET) * 100) : 0;
//   const gap       = Math.max(0, TARGET - achieved);
//   const dailyRate = fy.daysElapsed > 0 ? achieved / fy.daysElapsed : 0;
//   const projected = Math.round(dailyRate * fy.totalDays);
//   const maxValue  = TARGET > 0 ? TARGET : Math.max(1_000_000, achieved * 1.5);

//   const status =
//     achPct >= 75 ? { label: 'On Track',       bg: '#DCFCE7', color: '#15803D' } :
//     achPct >= 40 ? { label: 'Needs Attention', bg: '#FEF9C3', color: '#A16207' } :
//                    { label: 'Behind Target',   bg: '#FEE2E2', color: '#B91C1C' };

//   useEffect(() => {
//     const tick = () => {
//       const n = new Date();
//       setClock(
//         `${String(n.getHours()).padStart(2,'0')}:` +
//         `${String(n.getMinutes()).padStart(2,'0')}:` +
//         `${String(n.getSeconds()).padStart(2,'0')}`
//       );
//     };
//     tick();
//     const id = setInterval(tick, 1000);
//     return () => clearInterval(id);
//   }, []);

//   const segLabels = [0, 0.25, 0.5, 0.75, 1].map(f => ({
//     text:     fmt(maxValue * f),
//     position: CustomSegmentLabelPosition.Outside,
//     fontSize: '9px',
//     color:    '#94A3B8',
//   }));

//   if (loading) {
//     return (
//       <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8', fontSize: 13 }}>
//         Loading…
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className={styles.header}>
//         <div className={styles.headerRight}>
//           <span className={styles.badge}>YTD · {fy.label}</span>
//         </div>
//       </div>
//       <div className={styles.subtitle}>
//         Apr {fy.start.getFullYear()} – Mar {fy.end.getFullYear()} &nbsp;·&nbsp;
//         {fy.now.getDate()} {MONTHS[fy.now.getMonth()]} {fy.now.getFullYear()}
//       </div>

//       <div className={styles.Wrapper}>
//         <ReactSpeedometer
//           value={Math.min(achieved, maxValue)}
//           maxValue={maxValue}
//           needleColor="#4F46E5"
//           startColor="#C7D2FE"
//           endColor="#4F46E5"
//           segments={5}
//           width={300}
//           height={220}
//           needleTransitionDuration={1400}
//           needleHeightRatio={0.75}
//           ringWidth={28}
//           valueTextFontSize="15px"
//           currentValueText={fmt(achieved)}
//           textColor="#1E293B"
//           customSegmentLabels={segLabels}
//         />
//       </div>

//       <div className={styles.pillRow}>
//         <span
//           className={styles.statusPill}
//           style={{ background: status.bg, color: status.color }}
//         >
//           {status.label}
//         </span>
//         <span className={styles.achPctBig}>{achPct}% of target</span>
//       </div>

//       <div className={styles.divider} />

//       <div className={styles.metrics}>
//         <div className={styles.met}>
//           <div className={styles.metLbl}>Annual Target</div>
//           <div className={styles.metVal}>{TARGET > 0 ? fmt(TARGET) : '—'}</div>
//         </div>
//         <div className={styles.met}>
//           <div className={styles.metLbl}>Achieved</div>
//           <div className={styles.metVal} style={{ color: '#4F46E5' }}>{fmt(achieved)}</div>
//         </div>
//         <div className={styles.met}>
//           <div className={styles.metLbl}>Gap to Close</div>
//           <div className={styles.metVal} style={{ color: gap === 0 ? '#16A34A' : '#DC2626' }}>
//             {gap === 0 ? 'Done!' : fmt(gap)}
//           </div>
//         </div>
//         <div className={styles.met}>
//           <div className={styles.metLbl}>Run Rate EOY</div>
//           <div className={styles.metVal}>{fmt(projected)}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSpeedometer;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactSpeedometer, { CustomSegmentLabelPosition } from 'react-d3-speedometer';
import styles from './AdminSpeedometer.module.css';
import type { RootState } from '../../../app/store';
import { fetchAdminSpeedometerData } from './Slice/AdminSpeedometer';

function getIndianFY() {
  const now       = new Date();
  const m         = now.getMonth();
  const y         = now.getFullYear();
  const start     = m >= 3 ? new Date(y, 3, 1)             : new Date(y - 1, 3, 1);
  const end       = m >= 3 ? new Date(y + 1, 2, 31, 23, 59): new Date(y, 2, 31, 23, 59);
  const label     = `FY ${String(start.getFullYear()).slice(2)}–${String(end.getFullYear()).slice(2)}`;
  const totalDays = (end.getTime() - start.getTime()) / 86_400_000;
  const elapsed   = Math.min((now.getTime() - start.getTime()) / 86_400_000, totalDays);
  const daysLeft    = Math.max(0, Math.round(totalDays - elapsed));
  const daysElapsed = Math.round(elapsed);
  return { label, start, end, totalDays, daysLeft, daysElapsed, now };
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
                 'Jul','Aug','Sep','Oct','Nov','Dec'];

const fmt = (v: number) => {
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(2)}Cr`;
  if (v >= 1_00_000)    return `₹${(v / 1_00_000).toFixed(2)}L`;
  if (v >= 1_000)       return `₹${(v / 1_000).toFixed(1)}K`;
  return `₹${v.toLocaleString()}`;
};

const AdminSpeedometer: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [clock, setClock] = useState('');

  // ── Read globalFilter ──────────────────────────────────────
  const { selectedYear, selectedMonth, filterType, selectedPic } = useSelector(
    (s: RootState) => s.globalFilter
  );

  const { data, loading } = useSelector(
    (state: RootState) => state.fetchAdminSpeedometer
  );

  // ✅ Re-fetch when year, month or filterType changes
  useEffect(() => {
    dispatch(fetchAdminSpeedometerData());
  }, [dispatch, selectedYear, selectedMonth, selectedPic, filterType]);

  const achieved = data?.total_achieved      || 0;
  const TARGET   = data?.total_annual_target || 0;
  const deals    = data?.fy_deals_closed     || 0;
  const fy       = getIndianFY();

  const achPct    = TARGET > 0 ? Math.round((achieved / TARGET) * 100) : 0;
  const gap       = Math.max(0, TARGET - achieved);
  const dailyRate = fy.daysElapsed > 0 ? achieved / fy.daysElapsed : 0;
  const projected = Math.round(dailyRate * fy.totalDays);
  const maxValue  = TARGET > 0 ? TARGET : Math.max(1_000_000, achieved * 1.5);

  const status =
    achPct >= 75 ? { label: 'On Track',       bg: '#DCFCE7', color: '#15803D' } :
    achPct >= 40 ? { label: 'Needs Attention', bg: '#FEF9C3', color: '#A16207' } :
                   { label: 'Behind Target',   bg: '#FEE2E2', color: '#B91C1C' };

  // Live clock
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setClock(
        `${String(n.getHours()).padStart(2,'0')}:` +
        `${String(n.getMinutes()).padStart(2,'0')}:` +
        `${String(n.getSeconds()).padStart(2,'0')}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const segLabels = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    text:     fmt(maxValue * f),
    position: CustomSegmentLabelPosition.Outside,
    fontSize: '9px',
    color:    '#94A3B8',
  }));

  // Period label for subtitle
  const periodLabel = filterType === 'monthly'
    ? `${selectedMonth} ${selectedYear}`
    : `Apr ${fy.start.getFullYear()} – Mar ${fy.end.getFullYear()}`;

  // Target label changes based on filter type
  const targetLabel = filterType === 'monthly' ? 'Month Target' : 'Annual Target';
  const achievedLabel = filterType === 'monthly' ? 'Month Achieved' : 'Achieved';
  const dealsLabel = filterType === 'monthly' ? 'Deals (Month)' : 'Deals Won';

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8', fontSize: 13 }}>
        Loading…
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerRight}>
          <span className={styles.badge}>
            {filterType === 'monthly'
              ? `${selectedMonth} · FY${String(selectedYear).slice(2)}–${String(selectedYear + 1).slice(2)}`
              : `YTD · ${fy.label}`
            }
          </span>
        </div>
      </div>
      <div className={styles.subtitle}>
        {periodLabel} &nbsp;·&nbsp;
        {fy.now.getDate()} {MONTHS[fy.now.getMonth()]} {fy.now.getFullYear()}
      </div>

      {/* Gauge */}
      <div className={styles.Wrapper}>
        <ReactSpeedometer
          value={Math.min(achieved, maxValue)}
          maxValue={maxValue}
          needleColor="#4F46E5"
          startColor="#C7D2FE"
          endColor="#4F46E5"
          segments={5}
          width={300}
          height={220}
          needleTransitionDuration={1400}
          needleHeightRatio={0.75}
          ringWidth={28}
          valueTextFontSize="15px"
          currentValueText={fmt(achieved)}
          textColor="#1E293B"
          customSegmentLabels={segLabels}
        />
      </div>

      {/* Status */}
      <div className={styles.pillRow}>
        <span
          className={styles.statusPill}
          style={{ background: status.bg, color: status.color }}
        >
          {status.label}
        </span>
        <span className={styles.achPctBig}>{achPct}% of target</span>
      </div>

      <div className={styles.divider} />

      {/* Metrics */}
      <div className={styles.metrics}>
        <div className={styles.met}>
          <div className={styles.metLbl}>{targetLabel}</div>
          <div className={styles.metVal}>{TARGET > 0 ? fmt(TARGET) : '—'}</div>
        </div>
        <div className={styles.met}>
          <div className={styles.metLbl}>{achievedLabel}</div>
          <div className={styles.metVal} style={{ color: '#4F46E5' }}>{fmt(achieved)}</div>
        </div>
        <div className={styles.met}>
          <div className={styles.metLbl}>Gap to Close</div>
          <div className={styles.metVal} style={{ color: gap === 0 ? '#16A34A' : '#DC2626' }}>
            {gap === 0 ? 'Done!' : fmt(gap)}
          </div>
        </div>
        <div className={styles.met}>
          <div className={styles.metLbl}>{dealsLabel}</div>
          <div className={styles.metVal}>{deals}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminSpeedometer;
