// import { useDispatch, useSelector } from "react-redux";
// import styles from "./Speedometer.module.css";
// import ReactSpeedometer, { CustomSegmentLabelPosition } from "react-d3-speedometer";
// import type { RootState } from "../../../app/store";
// import { useEffect, useState } from "react";
// import { fetchUserSpeedometerData } from "./Slice/UserSpeedometer";

// const UserSpeedometer: React.FC = () => {
//   const dispatch = useDispatch();
//   const [speedValue, setSpeedValue] = useState(0); // Local state to avoid NaN

//   useEffect(() => {
//     dispatch(fetchUserSpeedometerData() as any);
//   }, [dispatch]);

//   const { TotalAchived } = useSelector(
//     (state: RootState) => state.fetchUserSpeedometer
//   );

//   useEffect(() => {
//     if (TotalAchived !== undefined && TotalAchived !== null) {
//       setSpeedValue(TotalAchived.total_sum); // Update only if valid
//     }
//   }, [TotalAchived]);

//   // console.log("Speedometer Value:", speedValue);

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

// export default UserSpeedometer;
// ========================================================================================================================
// import { useDispatch, useSelector } from "react-redux";
// import styles from "./Speedometer.module.css";
// import ReactSpeedometer, { CustomSegmentLabelPosition } from "react-d3-speedometer";
// import type { RootState } from "../../../app/store";
// import { useEffect, useState } from "react";
// import { fetchUserSpeedometerData } from "./Slice/UserSpeedometer";

// const UserSpeedometer: React.FC = () => {
//   const dispatch = useDispatch();
//   const [speedValue, setSpeedValue] = useState(0);

//   useEffect(() => {
//     dispatch(fetchUserSpeedometerData() as any);
//   }, [dispatch]);

//   const { TotalAchived } = useSelector(
//     (state: RootState) => state.fetchUserSpeedometer
//   );

//   useEffect(() => {
//     if (TotalAchived !== undefined && TotalAchived !== null) {
//       setSpeedValue(TotalAchived.total_sum);
//     }
//   }, [TotalAchived]);

//   const maxValue = Math.max(5000000, speedValue * 2);
//   const formatValue = (val: number) => `₹${(val / 1_000_000).toFixed(2)}M`;

//   return (
//     <div className={styles.Container}>
//       <div className={styles.Wrapper}>
//         <ReactSpeedometer
//           value={speedValue || 0}
//           maxValue={maxValue}
//           needleColor="#4F46E5"
//           startColor="#C7D2FE"
//           endColor="#4F46E5"
//           segments={5}
//           width={300}
//           height={220}
//           needleTransitionDuration={600}
//           needleHeightRatio={0.75}
//           ringWidth={28}
//           valueTextFontSize="15px"
//           currentValueText={formatValue(speedValue)}
//           textColor="#1E293B"
//           customSegmentLabels={[
//             { text: formatValue(0),              position: CustomSegmentLabelPosition.Outside, fontSize: "10px", color: "#94A3B8" },
//             { text: formatValue(maxValue * 0.25),position: CustomSegmentLabelPosition.Outside, fontSize: "10px", color: "#94A3B8" },
//             { text: formatValue(maxValue * 0.5), position: CustomSegmentLabelPosition.Outside, fontSize: "10px", color: "#94A3B8" },
//             { text: formatValue(maxValue * 0.75),position: CustomSegmentLabelPosition.Outside, fontSize: "10px", color: "#94A3B8" },
//             { text: formatValue(maxValue),       position: CustomSegmentLabelPosition.Outside, fontSize: "10px", color: "#94A3B8" },
//           ]}
//         />
//       </div>
//     </div>
//   );
// };

// export default UserSpeedometer;

// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import ReactSpeedometer, { CustomSegmentLabelPosition } from 'react-d3-speedometer';
// import styles from './Speedometer.module.css';
// import type { RootState } from '../../../app/store';
// import { fetchUserSpeedometerData } from './Slice/UserSpeedometer';

// /* ── Indian FY helper (auto-detects current year) ── */
// function getIndianFY() {
//   const now = new Date();
//   const m = now.getMonth(); // 0-indexed
//   const y = now.getFullYear();
//   const start  = m >= 3 ? new Date(y,     3, 1)           : new Date(y - 1, 3, 1);
//   const end    = m >= 3 ? new Date(y + 1, 2, 31, 23, 59)  : new Date(y,     2, 31, 23, 59);
//   const label  = `FY ${String(start.getFullYear()).slice(2)}–${String(end.getFullYear()).slice(2)}`;
//   const totalDays   = (end.getTime()  - start.getTime()) / 86_400_000;
//   const elapsed     = Math.min((now.getTime() - start.getTime()) / 86_400_000, totalDays);
//   const daysLeft    = Math.max(0, Math.round(totalDays - elapsed));
//   const daysElapsed = Math.round(elapsed);
//   const timePct     = Math.round((elapsed / totalDays) * 100);
//   return { label, start, end, totalDays, daysLeft, daysElapsed, timePct, now };
// }

// const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// const fmt    = (v: number) => `₹${(v / 1_000_000).toFixed(2)}M`;
// const fmtK   = (v: number) => v >= 1_000_000 ? fmt(v) : `₹${(v / 1000).toFixed(1)}K`;

// const UserSpeedometer: React.FC = () => {
//   const dispatch = useDispatch();
//   const [clock, setClock] = useState('');

//   useEffect(() => {
//     dispatch(fetchUserSpeedometerData() as any);
//   }, [dispatch]);

//   const { TotalAchived } = useSelector((state: RootState) => state.fetchUserSpeedometer);
//   const achieved = TotalAchived?.total_sum ?? 0;
//   const TARGET   = Math.max(5_000_000, achieved * 2);
//   const fy       = getIndianFY();

//   /* Derived metrics */
//   const achPct     = Math.round((achieved / TARGET) * 100);
//   const gap        = Math.max(0, TARGET - achieved);
//   const dailyRate  = fy.daysElapsed > 0 ? achieved / fy.daysElapsed : 0;
//   const projected  = Math.round(dailyRate * fy.totalDays);
//   const paceNeeded = fy.daysLeft > 0 ? gap / fy.daysLeft : 0;
//   const maxValue   = TARGET;

//   /* Status */
//   const status =
//     achPct >= 75 ? { label: 'On Track',        bg: '#DCFCE7', color: '#15803D' } :
//     achPct >= 40 ? { label: 'Needs Attention',  bg: '#FEF9C3', color: '#A16207' } :
//                    { label: 'Behind Target',    bg: '#FEE2E2', color: '#B91C1C' };

//   /* Live clock */
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

//   /* Speedometer segment labels */
//   const segLabels = [0, 0.25, 0.5, 0.75, 1].map(f => ({
//     text:     fmt(maxValue * f),
//     position: CustomSegmentLabelPosition.Outside,
//     fontSize: '9px',
//     color:    '#94A3B8',
//   }));

//   return (
//     <div >

//       {/* ── Header ── */}
//       <div className={styles.header}>
//         {/* <span className={styles.title}>Achievements</span> */}
//         <div className={styles.headerRight}>
//           {/* <span className={styles.liveDot} /> */}
//           {/* <span className={styles.clock}>{clock}</span> */}
//           <span className={styles.badge}>YTD · {fy.label}</span>
//         </div>
//       </div>
//       <div className={styles.subtitle}>
//         Apr {fy.start.getFullYear()} – Mar {fy.end.getFullYear()} &nbsp;·&nbsp;
//         {fy.now.getDate()} {MONTHS[fy.now.getMonth()]} {fy.now.getFullYear()}
//       </div>

//       {/* ── react-d3-speedometer (unchanged gauge) ── */}
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

//       {/* ── Achievement vs time bar ── */}
//       {/* <div className={styles.progSection}>
//         <div className={styles.progRow}>
//           <span className={styles.progLbl}>Achievement vs time elapsed</span>
//           <span className={styles.progLbl} style={{ color: '#4338CA', fontWeight: 600 }}>
//             {achPct}% · {fy.timePct}% yr
//           </span>
//         </div>
//         <div className={styles.dualTrack}>
//           <div className={styles.segAch}  style={{ width: `${Math.min(achPct, 100)}%` }} />
//           <div className={styles.segTime} style={{ width: `${Math.max(0, fy.timePct - achPct)}%` }} />
//           <div className={styles.segRest} />
//         </div>
//         <div className={styles.legendRow}>
//           <span className={styles.legendDot} style={{ background: '#6366F1' }} />
//           <span className={styles.legendTxt}>Achieved</span>
//           <span className={styles.legendDot} style={{ background: '#FDE68A', marginLeft: 10 }} />
//           <span className={styles.legendTxt}>Time lapsed (not achieved)</span>
//           <span className={styles.legendDot} style={{ background: '#E2E8F0', marginLeft: 10 }} />
//           <span className={styles.legendTxt}>Remaining</span>
//         </div>
//       </div> */}

//       {/* ── Pace box ── */}
//       {/* <div className={styles.paceBox}>
//         <div>
//           <div className={styles.paceLbl}>
//             <strong>{fy.daysLeft}</strong> days left · need&nbsp;
//             <strong>{fmtK(paceNeeded)}</strong>/day to hit target
//           </div>
//           <div className={styles.paceSub}>Current pace: {fmtK(dailyRate)}/day</div>
//         </div>
//         <div
//           className={styles.paceChip}
//           style={{
//             background: dailyRate >= paceNeeded ? '#DCFCE7' : '#FEE2E2',
//             color:      dailyRate >= paceNeeded ? '#15803D' : '#B91C1C',
//           }}
//         >
//           {dailyRate >= paceNeeded ? 'Ahead' : 'Behind'}
//         </div>
//       </div> */}

//     </div>
//   );
// };

// export default UserSpeedometer;


// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import ReactSpeedometer, { CustomSegmentLabelPosition } from 'react-d3-speedometer';
// import styles from './Speedometer.module.css';
// import type { RootState } from '../../../app/store';
// import { fetchUserSpeedometerData } from './Slice/UserSpeedometer';

// function getIndianFY() {
//   const now       = new Date();
//   const m         = now.getMonth();
//   const y         = now.getFullYear();
//   const start     = m >= 3 ? new Date(y, 3, 1)              : new Date(y - 1, 3, 1);
//   const end       = m >= 3 ? new Date(y + 1, 2, 31, 23, 59) : new Date(y, 2, 31, 23, 59);
//   const label     = `FY ${String(start.getFullYear()).slice(2)}–${String(end.getFullYear()).slice(2)}`;
//   const totalDays = (end.getTime() - start.getTime()) / 86_400_000;
//   const elapsed   = Math.min((now.getTime() - start.getTime()) / 86_400_000, totalDays);
//   const daysLeft    = Math.max(0, Math.round(totalDays - elapsed));
//   const daysElapsed = Math.round(elapsed);
//   return { label, start, end, totalDays, daysLeft, daysElapsed, now };
// }

// const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// const fmt = (v: number) => {
//   if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(2)}Cr`;
//   if (v >= 1_00_000)    return `₹${(v / 1_00_000).toFixed(2)}L`;
//   if (v >= 1_000)       return `₹${(v / 1_000).toFixed(1)}K`;
//   return `₹${v.toLocaleString()}`;
// };

// const UserSpeedometer: React.FC = () => {
//   const dispatch    = useDispatch<any>();
//   const [clock, setClock] = useState('');

//   // ── Read globalFilter ──────────────────────────────────────
//   const { selectedYear, selectedMonth, filterType } = useSelector(
//     (s: RootState) => s.globalFilter
//   );

//   const { TotalAchived } = useSelector(
//     (state: RootState) => state.fetchUserSpeedometer
//   );

//   // ✅ Re-fetch when filter changes
//   useEffect(() => {
//     dispatch(fetchUserSpeedometerData());
//   }, [dispatch, selectedYear, selectedMonth, filterType]);

//   const achieved = TotalAchived?.total_sum ?? 0;
//   const fy       = getIndianFY();
//   const TARGET   = Math.max(5_000_000, achieved * 2);

//   const achPct    = TARGET > 0 ? Math.round((achieved / TARGET) * 100) : 0;
//   const gap       = Math.max(0, TARGET - achieved);
//   const dailyRate = fy.daysElapsed > 0 ? achieved / fy.daysElapsed : 0;
//   const projected = Math.round(dailyRate * fy.totalDays);
//   const maxValue  = TARGET;

//   const status =
//     achPct >= 75 ? { label: 'On Track',       bg: '#DCFCE7', color: '#15803D' } :
//     achPct >= 40 ? { label: 'Needs Attention', bg: '#FEF9C3', color: '#A16207' } :
//                    { label: 'Behind Target',   bg: '#FEE2E2', color: '#B91C1C' };

//   const periodLabel = filterType === 'monthly'
//     ? `${selectedMonth} FY${String(selectedYear).slice(2)}–${String(selectedYear + 1).slice(2)}`
//     : `YTD · ${fy.label}`;

//   const targetLabel   = filterType === 'monthly' ? 'Month Target'   : 'Annual target';
//   const achievedLabel = filterType === 'monthly' ? 'Month Achieved' : 'Achieved';

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

//   return (
//     <div>
//       <div className={styles.header}>
//         <div className={styles.headerRight}>
//           <span className={styles.badge}>{periodLabel}</span>
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
//         <span className={styles.statusPill} style={{ background: status.bg, color: status.color }}>
//           {status.label}
//         </span>
//         <span className={styles.achPctBig}>{achPct}% of target</span>
//       </div>

//       <div className={styles.divider} />

//       <div className={styles.metrics}>
//         <div className={styles.met}>
//           <div className={styles.metLbl}>{targetLabel}</div>
//           <div className={styles.metVal}>{fmt(TARGET)}</div>
//         </div>
//         <div className={styles.met}>
//           <div className={styles.metLbl}>{achievedLabel}</div>
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

// export default UserSpeedometer;


// src/features/dashboardUser/speedometer/Speedometer.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactSpeedometer, { CustomSegmentLabelPosition } from 'react-d3-speedometer';
import styles from './Speedometer.module.css';
import type { RootState } from '../../../app/store';
import { fetchUserSpeedometerData } from './Slice/UserSpeedometer';

function getIndianFY() {
  const now       = new Date();
  const m         = now.getMonth();
  const y         = now.getFullYear();
  const start     = m >= 3 ? new Date(y, 3, 1)              : new Date(y - 1, 3, 1);
  const end       = m >= 3 ? new Date(y + 1, 2, 31, 23, 59) : new Date(y, 2, 31, 23, 59);
  const label     = `FY ${String(start.getFullYear()).slice(2)}–${String(end.getFullYear()).slice(2)}`;
  const totalDays = (end.getTime() - start.getTime()) / 86_400_000;
  const elapsed   = Math.min((now.getTime() - start.getTime()) / 86_400_000, totalDays);
  const daysLeft    = Math.max(0, Math.round(totalDays - elapsed));
  const daysElapsed = Math.round(elapsed);
  return { label, start, end, totalDays, daysLeft, daysElapsed, now };
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const fmt = (v: number) => {
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(2)}Cr`;
  if (v >= 1_00_000)    return `₹${(v / 1_00_000).toFixed(2)}L`;
  if (v >= 1_000)       return `₹${(v / 1_000).toFixed(1)}K`;
  return `₹${v.toLocaleString()}`;
};

const UserSpeedometer: React.FC = () => {
  const dispatch    = useDispatch<any>();
  const [clock, setClock] = useState('');

  // ── Read globalFilter ──────────────────────────────────────
  const { selectedYear, selectedMonth, filterType } = useSelector(
    (s: RootState) => s.globalFilter
  );

  const { TotalAchived } = useSelector(
    (state: RootState) => state.fetchUserSpeedometer
  );

  // ✅ Read actual budget target from currentMonth budget
  const currentMonth = useSelector(
    (s: RootState) => s.budget.currentMonth
  );

  // ✅ Re-fetch when filter changes
  useEffect(() => {
    dispatch(fetchUserSpeedometerData());
  }, [dispatch, selectedYear, selectedMonth, filterType]);

  const achieved = TotalAchived?.total_sum ?? 0;
  const fy       = getIndianFY();

  // ✅ Use real target from budget data
  // Monthly mode: use monthly_budget
  // Yearly mode:  use fy_total_target
  const TARGET = (() => {
    if (!currentMonth || !currentMonth.has_data) {
      // Fallback if no budget assigned
      return Math.max(5_000_000, achieved * 2);
    }
    if (filterType === 'monthly') {
      return currentMonth.monthly_budget || currentMonth.month_target || 0;
    }
    return currentMonth.fy_total_target || 0;
  })();

  const achPct    = TARGET > 0 ? Math.round((achieved / TARGET) * 100) : 0;
  const gap       = Math.max(0, TARGET - achieved);
  const dailyRate = fy.daysElapsed > 0 ? achieved / fy.daysElapsed : 0;
  const projected = Math.round(dailyRate * fy.totalDays);
  const maxValue  = TARGET > 0 ? TARGET : Math.max(5_000_000, achieved * 2);

  const status =
    achPct >= 75 ? { label: 'On Track',       bg: '#DCFCE7', color: '#15803D' } :
    achPct >= 40 ? { label: 'Needs Attention', bg: '#FEF9C3', color: '#A16207' } :
                   { label: 'Behind Target',   bg: '#FEE2E2', color: '#B91C1C' };

  const periodLabel = filterType === 'monthly'
    ? `${selectedMonth} FY${String(selectedYear).slice(2)}–${String(selectedYear + 1).slice(2)}`
    : `YTD · ${fy.label}`;

  const targetLabel   = filterType === 'monthly' ? 'Month Target'   : 'Annual target';
  const achievedLabel = filterType === 'monthly' ? 'Month Achieved' : 'Achieved';

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

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerRight}>
          <span className={styles.badge}>{periodLabel}</span>
        </div>
      </div>
      <div className={styles.subtitle}>
        Apr {fy.start.getFullYear()} – Mar {fy.end.getFullYear()} &nbsp;·&nbsp;
        {fy.now.getDate()} {MONTHS[fy.now.getMonth()]} {fy.now.getFullYear()}
      </div>

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

      <div className={styles.metrics}>
        <div className={styles.met}>
          <div className={styles.metLbl}>{targetLabel}</div>
          <div className={styles.metVal}>
            {TARGET > 0 ? fmt(TARGET) : '—'}
          </div>
        </div>
        <div className={styles.met}>
          <div className={styles.metLbl}>{achievedLabel}</div>
          <div className={styles.metVal} style={{ color: '#4F46E5' }}>
            {fmt(achieved)}
          </div>
        </div>
        <div className={styles.met}>
          <div className={styles.metLbl}>Gap to close</div>
          <div className={styles.metVal}
            style={{ color: gap === 0 ? '#16A34A' : '#DC2626' }}>
            {gap === 0 ? 'Done!' : fmt(gap)}
          </div>
        </div>
        <div className={styles.met}>
          <div className={styles.metLbl}>Run rate EOY</div>
          <div className={styles.metVal}>{fmt(projected)}</div>
        </div>
      </div>
    </div>
  );
};

export default UserSpeedometer;