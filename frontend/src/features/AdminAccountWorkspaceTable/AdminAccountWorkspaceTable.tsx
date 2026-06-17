
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../../app/store";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  clearResponse,
  deleteAdminAccountWorkspaceTableData,
  fetchAdminAccountWorkspaceTableData,
} from "./AdminAccountWorkspaceTableSlice/AdminAccountWorkspaceTableSlice";

/* ── Time Period Options ── */
const TIME_PERIODS = [
  { label: "All Time",      value: "all" }, // ✅ Added This FY
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

/* ── Date Filter Helper ── */
const isInTimePeriod = (dateString: string, period: string): boolean => {
  if (!dateString || period === "all") return true;

  const today     = new Date();
  const checkDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);

  const diffDays    = Math.floor((today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentYear = today.getFullYear();

  // Logic: FY starts April (Month index 3).
  // If we are in Jan/Feb/Mar, the current FY started April last year.
  const fyYear = today.getMonth() >= 3 ? currentYear : currentYear - 1;

  switch (period) {
    case "this_fy": { // ✅ Logic for whole Financial Year
      const start = new Date(fyYear, 3, 1);    // April 1st
      const end   = new Date(fyYear + 1, 2, 31); // March 31st Next Year
      return checkDate >= start && checkDate <= end;
    }
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

/* ── Style helpers ── */
const filterSelectClass =
  "h-10 px-4 pr-9 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all cursor-pointer shadow-sm appearance-none";

const toDisplayText = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => toDisplayText(item)).filter(Boolean).join(", ");
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const preferred =
      obj.name ??
      obj.title ??
      obj.label ??
      obj.username ??
      obj.user ??
      obj.email ??
      obj.ranks ??
      obj.stages ??
      obj.id;
    if (preferred != null) return toDisplayText(preferred);
    return "";
  }
  return "";
};

// Grid columns
const GRID_COLS          = "40px 1.8fr 0.8fr 1fr 1fr 1fr 1.4fr 1.1fr 44px 44px";
const GRID_COLS_SKELETON = "40px 1.8fr 0.8fr 1fr 1fr 1fr 1.4fr";

const AdminAccountWorkspaceTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [searchQuery,        setSearchQuery]        = useState("");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
  const [expandedRows,       setExpandedRows]       = useState<Set<string>>(new Set());
  const [visibleCount,       setVisibleCount]       = useState(15);

  const { data, loading, error } = useSelector(
    (state: RootState) => state.fetchAdminAccountWorkspaceData
  );
  const { response } = useSelector(
    (state: RootState) => state.deleteAdminAccountWorkspaceTableData
  );

  useEffect(() => {
    dispatch(fetchAdminAccountWorkspaceTableData() as any);
  }, [dispatch, response]);

  useEffect(() => {
    if (response?.message === "Deleted successfully") {
      alert("Account deleted successfully");
      dispatch(clearResponse());
    } else if (response?.message && response.message !== "Deleted successfully") {
      alert("Deletion failed");
      dispatch(clearResponse());
    }
  }, [response, dispatch]);

  /* ── Filtering Logic ── */
  const reversedData = [...data].reverse();
  const filteredData = reversedData.filter((row) => {
    const matchesSearch =
      toDisplayText(row.account_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
      toDisplayText(row.user).toLowerCase().includes(searchQuery.toLowerCase()) ||
      toDisplayText(row.vertical).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTime = isInTimePeriod(row.acct_created_date, selectedTimePeriod);

    return matchesSearch && matchesTime;
  });

  /* ── KPI calculations ── */
  const totalAccounts   = data.length;
  const uniqueVerticals = new Set(data.map((r: any) => r.vertical).filter(Boolean)).size;
  const thisMonth       = new Date().getMonth();
  const thisYear        = new Date().getFullYear();
  const newThisMonth    = data.filter((r: any) => {
    const d = new Date(r.acct_created_date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  /* ── Infinite scroll ── */
  const sentinelRef = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && visibleCount < filteredData.length) {
        setVisibleCount((c) => c + 15);
      }
    },
    [visibleCount, filteredData.length]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const visibleData = filteredData.slice(0, visibleCount);

  const toggleRow = (id: string) =>
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const kpiCards = [
    {
      label: "Total Accounts",    value: totalAccounts,           gradient: "from-indigo-600 to-indigo-500",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
    {
      label: "Verticals",         value: uniqueVerticals,         gradient: "from-cyan-600 to-cyan-400",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    },
    {
      label: "Added This Month",  value: newThisMonth,            gradient: "from-emerald-600 to-emerald-400",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    },
    {
      label: "Filtered Results",  value: filteredData.length,     gradient: "from-amber-500 to-yellow-400",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    },
  ];

  return (
    <div className="w-full min-h-full p-7 pb-28 flex flex-col gap-6 overflow-y-auto overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #faf5ff 40%, #ecfeff 100%)' }}>

      {/* ── Page Header Banner ── */}
      <div
        className="rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 40%, #8b5cf6 70%, #06b6d4 100%)', boxShadow: '0 8px 32px rgba(79,70,229,0.3)' }}
      >
        <div>
          <h1 className="text-[26px] font-extrabold text-white m-0 tracking-tight leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            Account Workspace
          </h1>
          <p className="text-[13px] text-white/70 mt-1 m-0 font-medium">
            Manage and view all account records
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            className="h-10 px-4 pr-9 bg-white/15 backdrop-blur border-2 border-white/30 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-white/60 transition-all cursor-pointer appearance-none"
            value={selectedTimePeriod}
            onChange={(e) => {
              setSelectedTimePeriod(e.target.value);
              setVisibleCount(15);
            }}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
          >
            {TIME_PERIODS.map((t) => (
              <option key={t.value} value={t.value} style={{ color: '#1e293b', background: '#fff' }}>{t.label}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 rounded-xl px-4 h-10 w-72 transition-all" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.3)' }}>
            <MdOutlineSearch className="text-white/70 text-lg shrink-0" />
            <input
              className="border-none outline-none bg-transparent text-sm text-white w-full"
              placeholder="Search accounts…"
              style={{ color: 'white' }}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(15); }}
            />
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, gradient, icon }) => (
          <div
            key={label}
            className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-default overflow-hidden relative`}
          >
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 text-white">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[26px] font-extrabold text-white tracking-tight leading-none">{value}</div>
              <div className="text-[12px] font-medium text-white/75 mt-1 whitespace-nowrap">{label}</div>
            </div>
            <span className="absolute right-3 bottom-[-8px] text-[52px] font-extrabold text-white/10 pointer-events-none select-none leading-none">{value}</span>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="rounded-2xl shadow-lg overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(99,102,241,0.15)', boxShadow: '0 4px 24px rgba(79,70,229,0.08), 0 1px 4px rgba(0,0,0,0.06)' }}>

        {/* Table top bar */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-2" style={{ borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: 'linear-gradient(135deg,#4f46e5,#8b5cf6)', boxShadow: '0 0 0 3px rgba(99,102,241,0.2)' }} />
          <span className="text-sm font-bold" style={{ background: 'linear-gradient(135deg,#4f46e5,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>All Accounts</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', color: '#6366f1', border: '1px solid #c7d2fe' }}>
            {filteredData.length} records
          </span>
        </div>

        {/* Table Header — indigo/blue gradient matching Task Workspace */}
        <div
          className="grid gap-3 px-4 py-3 mx-3 mb-1 rounded-xl bg-gradient-to-r from-indigo-700 to-blue-600 text-[10.5px] font-bold uppercase tracking-widest text-white/90"
          style={{ gridTemplateColumns: GRID_COLS }}
        >
          <span></span>
          <span>Account Name</span>
          <span>PIC</span>
          <span>Vertical</span>
          <span>Mobile</span>
          <span>Created</span>
          <span>Email</span>
          <span>Holder</span>
          <span></span>
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
                {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                  <div key={j} className="h-3.5 bg-slate-200 rounded-md" />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="p-5">
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8"  x2="12"    y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-600 m-0">Failed to load data</p>
              <p className="text-xs text-slate-400 m-0">{error}</p>
            </div>
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
            <p className="text-sm font-bold text-slate-600 m-0">No accounts found</p>
            <p className="text-xs text-slate-400 m-0">Try adjusting your search or time filter.</p>
          </div>
        )}

        {/* Data Rows */}
        {!loading && !error && visibleData.map((row: any, idx: number) => (
          <div
            key={row.id}
            className="border-b border-slate-100 last:border-none"
            style={{
              borderLeft: expandedRows.has(row.id) ? '4px solid #6366f1' : '4px solid transparent',
              animationDelay: `${Math.min(idx, 10) * 35}ms`,
            }}
          >
            {/* Main Row */}
            <div
              className={`grid gap-3 px-4 items-center h-14 transition-all duration-150 cursor-default ${expandedRows.has(row.id) ? 'bg-indigo-50/60' : 'bg-white hover:bg-slate-50'}`}
              style={{ gridTemplateColumns: GRID_COLS }}
            >
              <button
                className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-indigo-100 transition-colors"
                onClick={() => toggleRow(row.id)}
              >
                <IoIosArrowDropdown
                  size={20}
                  className={`transition-all duration-200 ${expandedRows.has(row.id) ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`}
                />
              </button>

              <div className="text-sm font-bold text-slate-900 truncate">{toDisplayText(row.account_name) || "—"}</div>

              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600 rounded-full text-[11px] font-bold border border-indigo-200 whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
                  {toDisplayText(row.pic) || "—"}
                </span>
              </div>

              <div>
                {row.vertical ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-200 whitespace-nowrap">
                    {toDisplayText(row.vertical)}
                  </span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </div>

              <div className="text-sm text-slate-500 truncate">{toDisplayText(row.mobile_number) || "—"}</div>

              <div>
                <span className="font-mono text-[11.5px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                  {row.acct_created_date || "—"}
                </span>
              </div>

              <div className="text-xs text-slate-500 truncate">{toDisplayText(row.email_id) || "—"}</div>

              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 rounded-full text-[11px] font-bold border border-orange-200 whitespace-nowrap">
                  {toDisplayText(row.user) || "—"}
                </span>
              </div>

              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:scale-110 transition-all"
                onClick={() => navigate(`/EditAdminAccountWorkspace/${row.id}`)}
              >
                <FaRegEdit size={14} />
              </button>

              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 hover:scale-110 transition-all"
                onClick={() => { if (window.confirm("Delete?")) dispatch(deleteAdminAccountWorkspaceTableData(row.id)); }}
              >
                <MdOutlineDelete size={16} />
              </button>
            </div>

            {/* Expanded Detail Panel */}
            {expandedRows.has(row.id) && (
              <div className="w-full" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #eef2ff 50%, #ecfeff 100%)', borderTop: '1px solid rgba(99,102,241,0.15)' }}>
                <div className="px-14 py-5 pb-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Designation", value: row.designation, icon: "👤", accent: '#4f46e5' },
                      { label: "Department",  value: row.department,  icon: "🏢", accent: '#8b5cf6' },
                      { label: "Address",     value: row.address,     icon: "📮", accent: '#06b6d4' },
                    ].map(({ label, value, icon, accent }) => (
                      <div
                        key={label}
                        className="flex flex-col gap-1 rounded-xl px-3 py-2.5 transition-all"
                        style={{ background: 'rgba(255,255,255,0.85)', border: `1.5px solid ${accent}30`, borderLeft: `4px solid ${accent}`, boxShadow: `0 2px 8px ${accent}10` }}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: accent }}>
                          <span className="text-[11px]">{icon}</span>
                          {label}
                        </span>
                        <span className="text-sm font-semibold text-slate-700 truncate">{toDisplayText(value) || "—"}</span>
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
      </div>
    </div>
  );
};

export default AdminAccountWorkspaceTable;
