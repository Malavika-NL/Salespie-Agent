
// src/features/Budget/BudgetDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../app/store';
import {
  fetchAdminBudgetSummary,
  fetchAdminPerUserBudget,
} from './slice/budgetSlice';
import { useBudgetPrefix } from './useBudgetPrefix';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';

// ── Constants ─────────────────────────────────────────────────────────────────
const FY_MONTHS = [
  'April','May','June','July','August','September',
  'October','November','December','January','February','March',
];

const COLORS = [
  '#4F46E5','#10B981','#F59E0B','#EF4444',
  '#8B5CF6','#06B6D4','#F97316','#84CC16',
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (v: number) => {
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(1)}Cr`;
  if (v >= 1_00_000)    return `₹${(v / 1_00_000).toFixed(1)}L`;
  if (v >= 1_000)       return `₹${(v / 1_000).toFixed(1)}K`;
  return `₹${v.toLocaleString()}`;
};

const nowMonth = () => new Date().toLocaleString('default', { month: 'long' });
const nowFY    = () => {
  const m = new Date().getMonth(); // 0-based, April = 3
  const y = new Date().getFullYear();
  return m >= 3 ? y : y - 1;
};

// ── Sub-components ────────────────────────────────────────────────────────────
const ProgressBar: React.FC<{ pct: number }> = ({ pct }) => {
  const clamp = Math.min(100, Math.max(0, pct));
  const color = clamp >= 100 ? '#10B981' : clamp >= 70 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ width:'100%', height:6, background:'#E2E8F0', borderRadius:3, overflow:'hidden' }}>
      <div style={{ width:`${clamp}%`, height:'100%', background:color, borderRadius:3, transition:'width 0.5s' }} />
    </div>
  );
};

const KpiCard: React.FC<{ label: string; value: string; color: string; sub?: string }> = ({ label, value, color, sub }) => (
  <div style={{
    background:'#fff', borderRadius:14, padding:'16px 18px',
    boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
    borderLeft:`4px solid ${color}`,
  }}>
    <div style={{ fontSize:11, color:'#64748B', fontWeight:500, textTransform:'uppercase', letterSpacing:0.5, marginBottom:6 }}>
      {label}
    </div>
    <div style={{ fontSize:22, fontWeight:700, color:'#0F172A' }}>{value}</div>
    {sub && <div style={{ fontSize:11, color:'#94A3B8', marginTop:3 }}>{sub}</div>}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const BudgetDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const prefix   = useBudgetPrefix();

  const { adminSummary, adminSummaryLoading, adminPerUserBudget, adminPerUserLoading } =
    useSelector((s: RootState) => s.budget);

  const [selectedYear,  setSelectedYear]  = useState<number>(nowFY());
  const [selectedMonth, setSelectedMonth] = useState<string>(nowMonth());

  useEffect(() => {
    dispatch(fetchAdminBudgetSummary({ year: selectedYear, month: selectedMonth }));
    dispatch(fetchAdminPerUserBudget({ year: selectedYear, month: selectedMonth }));
  }, [dispatch, selectedYear, selectedMonth]);

  const summary = adminSummary;
  const empData = adminPerUserBudget || [];
  const loading = adminSummaryLoading || adminPerUserLoading;

  // ── Chart: Per-user FY Target vs Achieved (Bar) ───────────────────────────
  const userBarData = empData.map((emp: any) => ({
    name:     emp.full_name || emp.username,
    Target:   Math.round(emp.fy_target),
    Achieved: Math.round(emp.fy_achieved),
  }));

  // ── Chart: Monthly combined Target vs Achieved (Bar) ─────────────────────
  const monthlyBarData = FY_MONTHS.map(month => {
    let totalTarget = 0, totalAchieved = 0;
    empData.forEach((emp: any) => {
      const md = (emp.monthly_data || []).find((m: any) => m.month === month);
      if (md) { totalTarget += md.target; totalAchieved += md.achieved; }
    });
    return { month: month.slice(0,3), Target: Math.round(totalTarget), Achieved: Math.round(totalAchieved) };
  });

  // ── Chart: Per-user monthly line data ────────────────────────────────────
  const lineChartData = FY_MONTHS.map(month => {
    const point: any = { month: month.slice(0,3) };
    empData.forEach((emp: any) => {
      const md = (emp.monthly_data || []).find((m: any) => m.month === month);
      const key = emp.full_name || emp.username;
      point[`${key}_T`] = md?.target   || 0;
      point[`${key}_A`] = md?.achieved || 0;
    });
    return point;
  });

  return (
    <div style={{ minHeight:'100vh', background:'#F1F5F9', padding:'24px 28px', fontFamily:'Inter, system-ui, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button
            onClick={() => navigate(`${prefix}/budget/overview`)}
            style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:8, padding:'7px 14px', cursor:'pointer', fontSize:13, fontWeight:600, color:'#475569' }}
          >
            ← Back
          </button>
          <div>
            <h1 style={{ fontSize:22, fontWeight:700, color:'#0F172A', margin:0 }}>
              Budget Dashboard
            </h1>
            <p style={{ fontSize:13, color:'#64748B', margin:'2px 0 0' }}>
              Company-wide Sales Target vs Achievement
            </p>
          </div>
        </div>

        {/* ── Filters ── */}
        <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            style={{ padding:'8px 14px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:13, background:'#fff', cursor:'pointer', fontWeight:500 }}
          >
            {[nowFY()-1, nowFY(), nowFY()+1].map(y => (
              <option key={y} value={y}>FY {y}–{String(y+1).slice(2)}</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            style={{ padding:'8px 14px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:13, background:'#fff', cursor:'pointer', fontWeight:500 }}
          >
            {FY_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ textAlign:'center', padding:80, color:'#94A3B8', fontSize:16, fontWeight:500 }}>
          Loading dashboard…
        </div>
      )}

      {!loading && (
        <>
          {/* ── KPI Cards ── */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(170px, 1fr))', gap:14, marginBottom:24 }}>
            <KpiCard label="FY Target"      value={fmt(summary?.fy_total_target  || 0)} color="#F59E0B" sub={`FY ${selectedYear}–${String(selectedYear+1).slice(2)}`} />
            <KpiCard label="FY Achieved"    value={fmt(summary?.fy_achieved       || 0)} color="#4F46E5" sub="Rank A opportunities" />
            <KpiCard label="Achievement %"  value={`${summary?.fy_achievement_pct || 0}%`} color={(summary?.fy_achievement_pct || 0) >= 70 ? '#10B981' : '#EF4444'} sub="Of FY target" />
            <KpiCard label="Month Target"   value={fmt(summary?.month_target      || 0)} color="#06B6D4" sub={selectedMonth} />
            <KpiCard label="Month Achieved" value={fmt(summary?.month_achieved    || 0)} color="#8B5CF6" sub={`${summary?.month_achievement_pct || 0}% of month target`} />
            <KpiCard label="FY Deals Closed" value={`${summary?.fy_deals_closed  || 0}`} color="#10B981" sub="Rank A count" />
            <KpiCard label="Month Deals"    value={`${summary?.deals_closed_this_month || 0}`} color="#F97316" sub="This month" />
          </div>

          {/* ── Monthly Combined Bar Chart ── */}
          <div style={{ background:'#fff', borderRadius:14, padding:24, marginBottom:20, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>
              Monthly Target vs Achievement — Team Combined
            </h2>
            <p style={{ fontSize:13, color:'#64748B', margin:'0 0 20px' }}>
              All sales persons combined, across the full financial year
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyBarData} barSize={22} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'#64748B' }} />
                <YAxis tickFormatter={fmt} tick={{ fontSize:11, fill:'#64748B' }} width={75} />
                <Tooltip
                  formatter={(v: any, name: string) => [fmt(Number(v)), name]}
                  contentStyle={{ borderRadius:8, fontSize:13 }}
                />
                <Legend wrapperStyle={{ fontSize:12 }} />
                <Bar dataKey="Target"   fill="#F59E0B" radius={[4,4,0,0]} name="Target" />
                <Bar dataKey="Achieved" fill="#4F46E5" radius={[4,4,0,0]} name="Achieved" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Per-User Monthly Line Chart ── */}
          <div style={{ background:'#fff', borderRadius:14, padding:24, marginBottom:20, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>
              Monthly Target vs Achievement — Per Sales Person
            </h2>
            <p style={{ fontSize:13, color:'#64748B', margin:'0 0 20px' }}>
              Solid line = Target &nbsp;·&nbsp; Dashed line = Achieved
            </p>
            {empData.length === 0 ? (
              <div style={{ textAlign:'center', padding:40, color:'#94A3B8' }}>No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize:11, fill:'#64748B' }} />
                  <YAxis tickFormatter={fmt} tick={{ fontSize:11, fill:'#64748B' }} width={75} />
                  <Tooltip
                    formatter={(v: any, name: string) => [
                      fmt(Number(v)),
                      name.endsWith('_T')
                        ? `${name.slice(0, -2)} — Target`
                        : `${name.slice(0, -2)} — Achieved`,
                    ]}
                    contentStyle={{ borderRadius:8, fontSize:12 }}
                  />
                  <Legend
                    formatter={(value: string) =>
                      value.endsWith('_T')
                        ? `${value.slice(0,-2)} — Target`
                        : `${value.slice(0,-2)} — Achieved`
                    }
                    wrapperStyle={{ fontSize:11 }}
                  />
                  {empData.map((emp: any, i: number) => {
                    const key   = emp.full_name || emp.username;
                    const color = COLORS[i % COLORS.length];
                    return (
                      <React.Fragment key={emp.user_id}>
                        {/* Target — solid */}
                        <Line
                          type="monotone"
                          dataKey={`${key}_T`}
                          stroke={color}
                          strokeWidth={2.5}
                          dot={{ r:4, fill:color }}
                          activeDot={{ r:6 }}
                          name={`${key}_T`}
                        />
                        {/* Achieved — dashed */}
                        <Line
                          type="monotone"
                          dataKey={`${key}_A`}
                          stroke={color}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ r:3, fill:color }}
                          activeDot={{ r:5 }}
                          name={`${key}_A`}
                        />
                      </React.Fragment>
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── Per-User FY Bar Chart ── */}
          <div style={{ background:'#fff', borderRadius:14, padding:24, marginBottom:20, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>
              FY Target vs Achievement — By Sales Person
            </h2>
            <p style={{ fontSize:13, color:'#64748B', margin:'0 0 20px' }}>
              Full financial year comparison per employee
            </p>
            {userBarData.length === 0 ? (
              <div style={{ textAlign:'center', padding:40, color:'#94A3B8' }}>No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(260, userBarData.length * 65)}>
                <BarChart data={userBarData} barSize={30} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize:12, fill:'#334155' }} />
                  <YAxis tickFormatter={fmt} tick={{ fontSize:11, fill:'#64748B' }} width={75} />
                  <Tooltip
                    formatter={(v: any, name: string) => [fmt(Number(v)), name]}
                    contentStyle={{ borderRadius:8, fontSize:13 }}
                  />
                  <Legend wrapperStyle={{ fontSize:12 }} />
                  <Bar dataKey="Target"   fill="#F59E0B" radius={[4,4,0,0]} name="Target" />
                  <Bar dataKey="Achieved" fill="#4F46E5" radius={[4,4,0,0]} name="Achieved" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── Team Performance Table ── */}
          <div style={{ background:'#fff', borderRadius:14, padding:24, marginBottom:20, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:'#0F172A', margin:'0 0 16px' }}>
              Team Performance
            </h2>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ background:'#F8FAFC' }}>
                    {['#','Sales Person','FY Target','FY Achieved','Deals Won','Gap','Month Target','Month Achieved','Progress'].map(h => (
                      <th key={h} style={{
                        padding:'10px 14px',
                        textAlign: ['#','Sales Person'].includes(h) ? 'left' : 'right',
                        color:'#475569', fontWeight:600,
                        borderBottom:'2px solid #E2E8F0',
                        fontSize:11, textTransform:'uppercase',
                        letterSpacing:0.3, whiteSpace:'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {empData.map((emp: any, i: number) => (
                    <tr key={emp.user_id} style={{ borderBottom:'1px solid #F1F5F9' }}>
                      <td style={{ padding:'12px 14px', color:'#94A3B8', fontSize:12 }}>{i+1}</td>
                      <td style={{ padding:'12px 14px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{
                            width:34, height:34, borderRadius:'50%',
                            background:`${COLORS[i % COLORS.length]}20`,
                            color: COLORS[i % COLORS.length],
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontWeight:700, fontSize:14,
                          }}>
                            {(emp.full_name || emp.username || '?')[0].toUpperCase()}
                          </div>
                          <div style={{ fontWeight:600, color:'#0F172A', fontSize:13 }}>
                            {emp.full_name || emp.username}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'12px 14px', textAlign:'right', fontWeight:600, color:'#F59E0B' }}>
                        {fmt(emp.fy_target)}
                      </td>
                      <td style={{ padding:'12px 14px', textAlign:'right', fontWeight:600, color:'#4F46E5' }}>
                        {fmt(emp.fy_achieved)}
                      </td>
                      <td style={{ padding:'12px 14px', textAlign:'right' }}>
                        <span style={{
                          background: emp.fy_deals > 0 ? '#EFF6FF' : '#F8FAFC',
                          color:      emp.fy_deals > 0 ? '#3B82F6' : '#94A3B8',
                          borderRadius:4, padding:'2px 8px', fontWeight:600, fontSize:12,
                        }}>
                          {emp.fy_deals}
                        </span>
                      </td>
                      <td style={{ padding:'12px 14px', textAlign:'right', fontWeight:600 }}>
                        {emp.fy_remaining > 0
                          ? <span style={{ color:'#EF4444' }}>{fmt(emp.fy_remaining)}</span>
                          : <span style={{ color:'#10B981' }}>✓ Done</span>
                        }
                      </td>
                      <td style={{ padding:'12px 14px', textAlign:'right', color:'#64748B' }}>
                        {fmt(emp.month_target)}
                      </td>
                      <td style={{ padding:'12px 14px', textAlign:'right', color:'#64748B' }}>
                        {fmt(emp.month_achieved)}
                      </td>
                      <td style={{ padding:'12px 14px', textAlign:'right', minWidth:130 }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:8 }}>
                          <div style={{ width:70 }}><ProgressBar pct={emp.fy_pct} /></div>
                          <span style={{
                            fontSize:12, fontWeight:700, minWidth:40, textAlign:'right',
                            color: emp.fy_pct >= 100 ? '#10B981' : emp.fy_pct >= 70 ? '#F59E0B' : '#EF4444',
                          }}>
                            {emp.fy_pct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Team Totals Row */}
                  {empData.length > 0 && (
                    <tr style={{ background:'#F8FAFC', borderTop:'2px solid #E2E8F0', fontWeight:700 }}>
                      <td style={{ padding:'12px 14px' }} />
                      <td style={{ padding:'12px 14px', color:'#0F172A', fontSize:13 }}>Team Total</td>
                      <td style={{ padding:'12px 14px', textAlign:'right', color:'#F59E0B' }}>
                        {fmt(summary?.fy_total_target || 0)}
                      </td>
                      <td style={{ padding:'12px 14px', textAlign:'right', color:'#4F46E5' }}>
                        {fmt(summary?.fy_achieved || 0)}
                      </td>
                      <td style={{ padding:'12px 14px', textAlign:'right' }}>
                        {summary?.fy_deals_closed || 0}
                      </td>
                      <td style={{ padding:'12px 14px', textAlign:'right', color:'#EF4444' }}>
                        {fmt(Math.max(0, (summary?.fy_total_target || 0) - (summary?.fy_achieved || 0)))}
                      </td>
                      <td style={{ padding:'12px 14px', textAlign:'right', color:'#64748B' }}>
                        {fmt(summary?.month_target || 0)}
                      </td>
                      <td style={{ padding:'12px 14px', textAlign:'right', color:'#64748B' }}>
                        {fmt(summary?.month_achieved || 0)}
                      </td>
                      <td style={{ padding:'12px 14px', textAlign:'right' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:8 }}>
                          <div style={{ width:70 }}><ProgressBar pct={summary?.fy_achievement_pct || 0} /></div>
                          <span style={{ fontSize:12, fontWeight:700, minWidth:40, textAlign:'right' }}>
                            {summary?.fy_achievement_pct || 0}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}

                  {empData.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ textAlign:'center', padding:40, color:'#94A3B8' }}>
                        No employee data found for the selected period
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Month-wise Target vs Achievement Table ── */}
          <div style={{ background:'#fff', borderRadius:14, padding:24, marginBottom:20, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>
              Month-wise Target vs Achievement — Per Sales Person
            </h2>
            <p style={{ fontSize:13, color:'#64748B', margin:'0 0 20px' }}>
              🟡 Target row &nbsp;·&nbsp; 🔵 Achieved row
            </p>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr style={{ background:'#F8FAFC' }}>
                    <th style={{ padding:'10px 14px', textAlign:'left', color:'#475569', fontWeight:600, borderBottom:'2px solid #E2E8F0', whiteSpace:'nowrap', minWidth:160 }}>
                      Sales Person
                    </th>
                    {FY_MONTHS.map(m => (
                      <th key={m} style={{ padding:'10px 8px', textAlign:'center', color:'#475569', fontWeight:600, borderBottom:'2px solid #E2E8F0', whiteSpace:'nowrap', fontSize:11 }}>
                        {m.slice(0,3)}
                      </th>
                    ))}
                    <th style={{ padding:'10px 14px', textAlign:'right', color:'#475569', fontWeight:600, borderBottom:'2px solid #E2E8F0', whiteSpace:'nowrap' }}>
                      FY Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {empData.map((emp: any, i: number) => (
                    <React.Fragment key={emp.user_id}>
                      {/* Target Row */}
                      <tr style={{ background:'#FAFBFF', borderBottom:'1px solid #F1F5F9' }}>
                        <td style={{ padding:'10px 14px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div style={{
                              width:28, height:28, borderRadius:'50%',
                              background:`${COLORS[i % COLORS.length]}20`,
                              color: COLORS[i % COLORS.length],
                              display:'flex', alignItems:'center', justifyContent:'center',
                              fontWeight:700, fontSize:12, flexShrink:0,
                            }}>
                              {(emp.full_name || emp.username || '?')[0].toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize:12, fontWeight:600, color:'#0F172A' }}>
                                {emp.full_name || emp.username}
                              </div>
                              <div style={{ fontSize:10, color:'#F59E0B', fontWeight:500 }}>Target</div>
                            </div>
                          </div>
                        </td>
                        {FY_MONTHS.map(month => {
                          const md = (emp.monthly_data || []).find((m: any) => m.month === month);
                          return (
                            <td key={month} style={{
                              padding:'10px 8px', textAlign:'center',
                              color:  md?.target > 0 ? '#92400E' : '#CBD5E1',
                              fontWeight: md?.target > 0 ? 600 : 400,
                              fontSize:11,
                              background: md?.target > 0 ? '#FFFBEB' : 'transparent',
                            }}>
                              {md?.target > 0 ? fmt(md.target) : '—'}
                            </td>
                          );
                        })}
                        <td style={{ padding:'10px 14px', textAlign:'right', fontWeight:700, color:'#F59E0B' }}>
                          {fmt(emp.fy_target)}
                        </td>
                      </tr>

                      {/* Achieved Row */}
                      <tr style={{ borderBottom:'2px solid #E2E8F0' }}>
                        <td style={{ padding:'8px 14px 8px 50px', color:'#4F46E5', fontSize:11, fontWeight:500 }}>
                          Achieved
                        </td>
                        {FY_MONTHS.map(month => {
                          const md = (emp.monthly_data || []).find((m: any) => m.month === month);
                          return (
                            <td key={month} style={{
                              padding:'8px 8px', textAlign:'center',
                              color:  md?.achieved > 0 ? '#1E40AF' : '#CBD5E1',
                              fontWeight: md?.achieved > 0 ? 600 : 400,
                              fontSize:11,
                              background: md?.achieved > 0 ? '#EFF6FF' : 'transparent',
                            }}>
                              {md?.achieved > 0 ? fmt(md.achieved) : '—'}
                            </td>
                          );
                        })}
                        <td style={{ padding:'8px 14px', textAlign:'right', fontWeight:700, color:'#4F46E5' }}>
                          {fmt(emp.fy_achieved)}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}

                  {/* Team Totals */}
                  {empData.length > 0 && (
                    <>
                      <tr style={{ background:'#FFF7ED', borderTop:'2px solid #E2E8F0' }}>
                        <td style={{ padding:'10px 14px', fontWeight:700, color:'#92400E', fontSize:12 }}>
                          Team Target
                        </td>
                        {FY_MONTHS.map(month => {
                          const total = empData.reduce((sum: number, emp: any) => {
                            const md = (emp.monthly_data || []).find((m: any) => m.month === month);
                            return sum + (md?.target || 0);
                          }, 0);
                          return (
                            <td key={month} style={{
                              padding:'10px 8px', textAlign:'center',
                              fontWeight:700, fontSize:11,
                              color: total > 0 ? '#92400E' : '#CBD5E1',
                            }}>
                              {total > 0 ? fmt(total) : '—'}
                            </td>
                          );
                        })}
                        <td style={{ padding:'10px 14px', textAlign:'right', fontWeight:700, color:'#F59E0B' }}>
                          {fmt(summary?.fy_total_target || 0)}
                        </td>
                      </tr>
                      <tr style={{ background:'#EFF6FF', borderBottom:'2px solid #E2E8F0' }}>
                        <td style={{ padding:'10px 14px', fontWeight:700, color:'#1E40AF', fontSize:12 }}>
                          Team Achieved
                        </td>
                        {FY_MONTHS.map(month => {
                          const total = empData.reduce((sum: number, emp: any) => {
                            const md = (emp.monthly_data || []).find((m: any) => m.month === month);
                            return sum + (md?.achieved || 0);
                          }, 0);
                          return (
                            <td key={month} style={{
                              padding:'10px 8px', textAlign:'center',
                              fontWeight:700, fontSize:11,
                              color: total > 0 ? '#1E40AF' : '#CBD5E1',
                            }}>
                              {total > 0 ? fmt(total) : '—'}
                            </td>
                          );
                        })}
                        <td style={{ padding:'10px 14px', textAlign:'right', fontWeight:700, color:'#4F46E5' }}>
                          {fmt(summary?.fy_achieved || 0)}
                        </td>
                      </tr>
                    </>
                  )}

                  {empData.length === 0 && (
                    <tr>
                      <td colSpan={14} style={{ textAlign:'center', padding:40, color:'#94A3B8' }}>
                        No data available for selected period
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={{ textAlign:'center', color:'#94A3B8', fontSize:11, paddingTop:16, borderTop:'1px solid #E2E8F0', marginTop:8, paddingBottom:20 }}>
            Target = BudgetPeriodEntry.allocated per employee · Achieved = Rank A Opportunity value · FY = April to March
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetDashboard;