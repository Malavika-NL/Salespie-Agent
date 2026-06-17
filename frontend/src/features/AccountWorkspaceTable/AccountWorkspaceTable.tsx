
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { accountFormData } from "../tables/slice/tablesSlice";

/* ── Time Period Options ── */
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

/* ── Date Filter Helper ── */
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

/* ── Style helpers ── */
const filterSelectClass =
  "h-10 px-4 pr-9 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all cursor-pointer shadow-sm appearance-none";

// Grid columns — no delete button, so last col is just edit (48px)
const GRID_COLS          = "40px 1.8fr 0.8fr 1fr 1fr 1fr 1.4fr 1.1fr 48px";
const GRID_COLS_SKELETON = "40px 1.8fr 0.8fr 1fr 1fr 1fr 1.4fr";

const AccountWorkspaceTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [searchQuery,        setSearchQuery]        = useState("");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
  const [expandedRows,       setExpandedRows]       = useState<Set<string>>(new Set());
  const [visibleCount,       setVisibleCount]       = useState(15);

  const { data, loading, error } = useSelector((state: RootState) => state.accountData);

  useEffect(() => {
    dispatch(accountFormData() as any);
  }, [dispatch]);

  /* ── KPI calculations ── */
  const totalAccounts   = data.length;
  const uniqueVerticals = new Set(data.map((r: any) => r.vertical).filter(Boolean)).size;

  const thisMonth    = new Date().getMonth();
  const thisYear     = new Date().getFullYear();
  const newThisMonth = data.filter((r: any) => {
    const d = new Date(r.acct_created_date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  // ✅ MEANINGFUL NEW KPI: States Covered (Unique Locations)
  const statesCovered = new Set(data.map((r: any) => r.state).filter(Boolean)).size;

  /* ── Filter Logic ── */
  const reversedData = [...data].reverse();
  const filteredData = reversedData.filter((row) => {
    const matchesSearch =
      row.account_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.vertical?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTime = isInTimePeriod(row.acct_created_date, selectedTimePeriod);
    return matchesSearch && matchesTime;
  });

  /* ── Infinite scroll ── */
  const sentinelRef    = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && visibleCount < filteredData.length) {
      setVisibleCount(c => c + 15);
    }
  }, [visibleCount, filteredData.length]);

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
      label: "Total Accounts",   value: totalAccounts,   gradient: "from-indigo-600 to-indigo-500",
      icon: null,
    },
    {
      label: "Verticals",        value: uniqueVerticals, gradient: "from-cyan-600 to-cyan-400",
      icon: null,
    },
    {
      label: "Added This Month", value: newThisMonth,    gradient: "from-emerald-600 to-emerald-400",
      icon: null,
    },
    {
      label: "States Covered",   value: statesCovered,   gradient: "from-amber-500 to-yellow-400",
      // ✅ NEW KPI CARD: States Covered
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full min-h-full bg-slate-100 p-7 pb-28 flex flex-col gap-6 overflow-y-auto overflow-x-hidden">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Title — violet text, no banner */}
        <div>
          <h1 className="text-[22px] font-bold text-violet-700 m-0 tracking-tight leading-tight">
            Account Workspace
          </h1>
          <p className="text-[13px] text-violet-400 mt-1 m-0 font-normal">
            Manage and view all account records
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            className={filterSelectClass}
            value={selectedTimePeriod}
            onChange={(e) => { setSelectedTimePeriod(e.target.value); setVisibleCount(15); }}
          >
            {TIME_PERIODS.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl px-4 h-10 w-72 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all">
            <MdOutlineSearch className="text-slate-400 text-lg shrink-0" />
            <input
              className="border-none outline-none bg-transparent text-sm text-slate-800 w-full placeholder:text-slate-300"
              placeholder="Search accounts..."
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
            {icon && (
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 text-white">
                {icon}
              </div>
            )}
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
          <span className="text-sm font-bold text-slate-800">All Accounts</span>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
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
        {!loading && !error && visibleData.map((row: any) => (
          <div
            key={row.id}
            className="border-b border-slate-100 last:border-none"
            style={{ borderLeft: expandedRows.has(row.id) ? '4px solid #6366f1' : '4px solid transparent' }}
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

              <div className="text-sm font-bold text-slate-900 truncate">{row.account_name}</div>

              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600 rounded-full text-[11px] font-bold border border-indigo-200 whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
                  {row.pic}
                </span>
              </div>

              <div className="text-sm text-slate-500 truncate">{row.vertical || '—'}</div>

              <div className="text-sm text-slate-500 truncate">{row.mobile_number}</div>

              <div>
                <span className="font-mono text-[11.5px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                  {row.acct_created_date}
                </span>
              </div>

              <div className="text-xs text-slate-500 truncate">{row.email_id}</div>

              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 rounded-full text-[11px] font-bold border border-orange-200 whitespace-nowrap">
                  {row.user}
                </span>
              </div>

              {/* Edit only — no delete button for user workspace */}
              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:scale-110 transition-all"
                onClick={() => navigate(`/user/editaccountworkspace/${row.id}`)}
              >
                <FaRegEdit size={14} />
              </button>
            </div>

            {/* Expanded Detail Panel */}
            {expandedRows.has(row.id) && (
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 border-t border-slate-200 w-full">
                <div className="px-14 py-5 pb-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      { label: 'Designation',  value: row.designation,  icon: '👤' },
                      { label: 'Department',   value: row.department,   icon: '🏢' },
                      { label: 'Vertical Sub', value: row.vertical_sub, icon: '📂' },
                      { label: 'State',        value: row.state,        icon: '📍' },
                      { label: 'City',         value: row.city,         icon: '🏙️' },
                      { label: 'Business',     value: row.business,     icon: '💼' },
                      { label: 'Region',       value: row.region,       icon: '🌐' },
                      { label: 'Address',      value: row.address,      icon: '📮' },
                    ].map(({ label, value, icon }) => (
                      <div
                        key={label}
                        className="flex flex-col gap-1 bg-white/70 border border-slate-200 rounded-xl px-3 py-2.5 hover:bg-white hover:shadow-sm transition-all"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <span className="text-[11px]">{icon}</span>
                          {label}
                        </span>
                        <span className="text-sm font-semibold text-slate-700 truncate">{value || '—'}</span>
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

export default AccountWorkspaceTable;