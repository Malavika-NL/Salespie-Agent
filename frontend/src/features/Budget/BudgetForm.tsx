import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation, useBlocker } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../app/store';
import {
  fetchBudgetDashboard, fetchSalesPersons,
  createBudget, updateBudget, resetSaveStatus, clearDashboard,
} from './slice/budgetSlice';
import { fetchAccountFormSettings } from '../FormSettings/formSettingsSlice';
import { useBudgetPrefix } from './useBudgetPrefix';
import { ChevronLeft, Save, Plus, Check, Trash2, BarChart2, Target, Users } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const FY_MONTHS = ['April','May','June','July','August','September','October','November','December','January','February','March'];
const QUARTERS: Record<string, string[]> = { Q1: ['April','May','June'], Q2: ['July','August','September'], Q3: ['October','November','December'], Q4: ['January','February','March'] };
const QUARTER_LABELS: Record<string, string> = { Q1: 'Q1 (Apr–Jun)', Q2: 'Q2 (Jul–Sep)', Q3: 'Q3 (Oct–Dec)', Q4: 'Q4 (Jan–Mar)' };

const getCurrentFYStartYear = (): number => {
  const now = new Date();
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
};

const formatFYLabel = (year: number): string => `FY ${year}-${String(year + 1).slice(2)}`;

const getFYDateRange = (year: number) => ({
  startDate: `${year}-04-01`,
  endDate: `${year + 1}-03-31`,
});

const getYearForFYMonth = (fyStartYear: number, month: string): number =>
  FY_MONTHS.indexOf(month) <= FY_MONTHS.indexOf('December') ? fyStartYear : fyStartYear + 1;

const BUDGET_TITLE_DRAFT_KEY = 'salespie_budget_title_draft';

const getStoredBudgetTitleDraft = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(BUDGET_TITLE_DRAFT_KEY) || '';
  } catch {
    return '';
  }
};

const setStoredBudgetTitleDraft = (value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BUDGET_TITLE_DRAFT_KEY, value);
  } catch {
    // Ignore storage errors silently (private mode / quota / policy)
  }
};

const toDateOnly = (value: unknown): string => {
  if (!value) return '';
  return String(value).slice(0, 10);
};

const getBudgetFYStartYear = (budget: any): number | null => {
  const startDate = toDateOnly(budget?.start_date) || toDateOnly(budget?.created_at);
  if (!startDate) return null;
  const [year, month] = startDate.split('-').map(Number);
  if (!year || !month) return null;
  return month >= 4 ? year : year - 1;
};

const fmt = (v: number): string =>
  v >= 1_00_00_000 ? `₹${(v/1_00_00_000).toFixed(1)}Cr`
  : v >= 1_00_000  ? `₹${(v/1_00_000).toFixed(1)}L`
  : v >= 1_000     ? `₹${(v/1_000).toFixed(1)}K`
  : `₹${v.toLocaleString()}`;

// ─── Types ────────────────────────────────────────────────────────────────────

const HIDDEN_GLOBAL_CATEGORY_NAME = '__GLOBAL__';
const HIDDEN_GLOBAL_SUBCATEGORY_NAME = '__GLOBAL__';
const LEGACY_UNCATEGORIZED_NAME = 'uncategorized';

interface SubEntry { catId: string; subId: string; amount: string; }
interface MonthlyPlanEntry { userId: string; month: string; amount: string; }

const mapProductCategoriesToBudgetCategories = (productCategories: any[]): any[] => {
  if (!Array.isArray(productCategories)) return [];

  const categoryMap = new Map<string, Set<string>>();
  const addCategory = (categoryName: string, subNames: string[]) => {
    const cat = (categoryName || "").trim();
    if (!cat) return;
    if (!categoryMap.has(cat)) categoryMap.set(cat, new Set<string>());
    const subSet = categoryMap.get(cat)!;
    subNames.forEach((s) => {
      const sub = (s || "").trim();
      if (sub) subSet.add(sub);
    });
  };

  productCategories.forEach((root: any) => {
    const rootSubs = Array.isArray(root?.subdivisions) ? root.subdivisions : [];
    const hasLevel1 = rootSubs.length > 0;
    const level1LooksLikeCategory = hasLevel1 && rootSubs.some((n: any) => Array.isArray(n?.subdivisions));

    if (level1LooksLikeCategory) {
      rootSubs.forEach((l1: any) => {
        const l2 = Array.isArray(l1?.subdivisions) ? l1.subdivisions : [];
        addCategory(l1?.category, l2.map((n: any) => n?.category).filter(Boolean));
      });
      return;
    }

    addCategory(root?.category, rootSubs.map((n: any) => n?.category).filter(Boolean));
  });

  return Array.from(categoryMap.entries()).map(([name, subSet], catIdx) => {
    const subNames = Array.from(subSet);
    const ensuredSubs = subNames.length ? subNames : [name];
    return {
      id: `fs-cat-${catIdx}`,
      name,
      subcategories: ensuredSubs.map((subName, subIdx) => ({
        id: `fs-sub-${catIdx}-${subIdx}`,
        name: subName,
      })),
    };
  });
};

// ─── Shared input styles ──────────────────────────────────────────────────────

const inputCls = "w-full h-11 px-3.5 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200 placeholder:text-slate-400 disabled:opacity-55 disabled:cursor-not-allowed read-only:bg-slate-50 read-only:cursor-default";
const selectCls = `${inputCls} cursor-pointer appearance-none`;

// ─── Component ────────────────────────────────────────────────────────────────

const BudgetForm: React.FC = () => {
  const { id }   = useParams();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const prefix   = useBudgetPrefix();
  const viewMode = location.pathname.endsWith('/view');

  const { dashboard, salesPersons, saveStatus } = useSelector((s: RootState) => s.budget);
  const accountFormSettings = useSelector((s: RootState) => s.formSettings.account);
  const currentUser = useSelector((s: RootState) => s.userLoginAuth?.user);
  const isAdmin     = currentUser?.role === 'admin';
  const globalCategories = useMemo(
    () => mapProductCategoriesToBudgetCategories(accountFormSettings?.productCategories || []),
    [accountFormSettings?.productCategories]
  );

  const [form, setForm]           = useState(() => ({
    title: getStoredBudgetTitleDraft(),
    revenue_target: '',
    currency: 'INR',
    notes: '',
    fy_start_year: String(getCurrentFYStartYear()),
  }));
  const [cellData, setCellData]   = useState<Record<string, string>>({});
  const [dataReady, setDataReady] = useState(false);
  const [titleEditEnabled, setTitleEditEnabled] = useState(() => !Boolean(id));

  const [entryMonth, setEntryMonth]                 = useState('April');
  const [entryUserId, setEntryUserId]               = useState('');
  const [entryOverallAmount, setEntryOverallAmount] = useState('');
  const [monthlyPlanEntries, setMonthlyPlanEntries] = useState<MonthlyPlanEntry[]>([]);
  const [subEntries, setSubEntries]                 = useState<SubEntry[]>([]);
  const [showBreakdown, setShowBreakdown]           = useState(false);
  const baselineSnapshotRef = useRef<string>('');
  const [baselineReady, setBaselineReady] = useState(false);

  useEffect(() => {
    dispatch(fetchSalesPersons());
    dispatch(fetchAccountFormSettings() as any);
    if (id) dispatch(fetchBudgetDashboard(Number(id)));
    return () => { dispatch(clearDashboard()); dispatch(resetSaveStatus()); };
  }, [dispatch, id]);

  useEffect(() => {
    if (!id || !dashboard || globalCategories.length === 0) return;
    const dashboardFYStartYear = getBudgetFYStartYear(dashboard) ?? getCurrentFYStartYear();
    setForm({
      title: dashboard.title || '',
      revenue_target: String(dashboard.revenue_target || ''),
      currency: dashboard.currency || 'INR',
      notes: dashboard.notes || '',
      fy_start_year: String(dashboardFYStartYear),
    });
    setTitleEditEnabled(false);
    const monthlyMap = new Map<string, number>();
    const rebuilt: Record<string, string> = {};
    (dashboard.period_entries || []).forEach((pe: any) => {
      const categoryName = String(pe.category_name || '').trim().toLowerCase();
      const isGlobalEntry =
        categoryName === LEGACY_UNCATEGORIZED_NAME ||
        categoryName === HIDDEN_GLOBAL_CATEGORY_NAME.toLowerCase();
      if (isGlobalEntry && pe.user_id && pe.month) {
        const monthKey = `${pe.user_id}__${pe.month}`;
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + Number(pe.allocated || 0));
        return;
      }
      const gCat = globalCategories.find((gc: any) => gc.name === pe.category_name) || globalCategories.find((gc: any) => gc.id === pe.category_id);
      const gSub = gCat?.subcategories?.find((gs: any) => gs.name === pe.subcategory_name) || gCat?.subcategories?.find((gs: any) => gs.id === pe.subcategory_id);
      if (gCat && gSub && pe.user_id) rebuilt[`${pe.user_id}__${gCat.id}__${pe.month}__${gSub.id}`] = String(pe.allocated || 0);
    });
    setMonthlyPlanEntries(
      Array.from(monthlyMap.entries()).map(([key, amount]) => {
        const [userId, month] = key.split('__');
        return { userId, month, amount: String(amount) };
      })
    );
    setCellData(rebuilt);
    setDataReady(true);
  }, [dashboard, id, globalCategories]);

  useEffect(() => {
    if (!id) {
      setTitleEditEnabled(true);
    }
  }, [id]);

  const draftSnapshot = useMemo(() => JSON.stringify({
    form,
    cellData,
    monthlyPlanEntries,
    entryMonth,
    entryUserId,
    entryOverallAmount,
    subEntries,
    showBreakdown,
  }), [
    form,
    cellData,
    monthlyPlanEntries,
    entryMonth,
    entryUserId,
    entryOverallAmount,
    subEntries,
    showBreakdown,
  ]);

  useEffect(() => {
    if (baselineReady) return;
    if (id && !dataReady) return;
    baselineSnapshotRef.current = draftSnapshot;
    setBaselineReady(true);
  }, [baselineReady, id, dataReady, draftSnapshot]);

  const hasUnsavedChanges = Boolean(
    baselineReady &&
    !viewMode &&
    isAdmin &&
    draftSnapshot !== baselineSnapshotRef.current
  );

  const blocker = useBlocker(hasUnsavedChanges);

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    const shouldLeave = window.confirm('You have unsaved changes. Do you want to leave this page without saving?');
    if (shouldLeave) blocker.proceed();
    else blocker.reset();
  }, [blocker]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (saveStatus !== 'saved') return;
    baselineSnapshotRef.current = draftSnapshot;
    setTimeout(() => { dispatch(resetSaveStatus()); navigate(-1); }, 800);
  }, [saveStatus, dispatch, navigate, draftSnapshot]);

  const overallNum     = parseFloat(entryOverallAmount) || 0;
  const allocatedSoFar = subEntries.reduce((sum, se) => sum + (parseFloat(se.amount) || 0), 0);
  const remaining      = overallNum - allocatedSoFar;
  const canSaveMonthlyPlan = Boolean(!showBreakdown && entryUserId && entryMonth && overallNum > 0);

  const upsertMonthlyPlanEntry = (userId: string, month: string, amount: string) => {
    setMonthlyPlanEntries(prev => {
      const next = prev.filter(entry => !(entry.userId === userId && entry.month === month));
      return [...next, { userId, month, amount }];
    });
  };

  const removeMonthlyPlanEntry = (userId: string, month: string) => {
    setMonthlyPlanEntries(prev => prev.filter(entry => !(entry.userId === userId && entry.month === month)));
  };

  const saveMonthlyPlanEntry = () => {
    if (!canSaveMonthlyPlan) {
      alert('Please select Sales PIC, Month, and enter Overall Month Amount.');
      return;
    }
    upsertMonthlyPlanEntry(entryUserId, entryMonth, String(overallNum));
  };

  const startBreakdown = () => {
    if (!entryMonth || !entryUserId || !entryOverallAmount || overallNum <= 0) { alert('Please select Month, Sales PIC, and enter Overall Month Amount.'); return; }
    setSubEntries([{ catId: '', subId: '', amount: '' }]);
    setShowBreakdown(true);
  };

  const addSubEntryRow    = () => { if (remaining <= 0) return; setSubEntries(prev => [...prev, { catId: '', subId: '', amount: '' }]); };
  const removeSubEntry    = (i: number) => setSubEntries(prev => prev.filter((_, idx) => idx !== i));
  const updateSubEntry    = (index: number, field: keyof SubEntry, value: string) => setSubEntries(prev => { const u = [...prev]; u[index] = { ...u[index], [field]: value }; if (field === 'catId') u[index].subId = ''; return u; });
  const getMaxForRow      = (i: number) => overallNum - subEntries.reduce((sum, se, idx) => idx !== i ? sum + (parseFloat(se.amount) || 0) : sum, 0);
  const cancelBreakdown   = () => { setSubEntries([]); setShowBreakdown(false); };

  const pushBreakdownToMatrix = () => {
    for (let i = 0; i < subEntries.length; i++) {
      const se = subEntries[i];
      if (!se.amount || parseFloat(se.amount) <= 0) { alert(`Row ${i+1}: Please enter a valid amount.`); return; }
    }
    if (Math.abs(remaining) > 0.01) { alert(`Total ≠ Overall. Remaining: ₹${remaining.toLocaleString()}`); return; }
    const n = { ...cellData };
    let globalAmountFromRows = 0;
    subEntries.forEach(se => {
      const rowAmount = parseFloat(se.amount) || 0;
      if (!se.catId) {
        globalAmountFromRows += rowAmount;
        return;
      }
      const catId = se.catId;
      let subId = se.subId;
      if (!subId) {
        subId = String(
          globalCategories.find((c: any) => String(c.id) === catId)?.subcategories?.[0]?.id || ''
        );
      }
      if (!subId) return;
      const k = `${entryUserId}__${catId}__${entryMonth}__${subId}`;
      n[k] = String((parseFloat(n[k] || '0')) + rowAmount);
    });
    if (globalAmountFromRows > 0) {
      upsertMonthlyPlanEntry(entryUserId, entryMonth, String(globalAmountFromRows));
    } else {
      removeMonthlyPlanEntry(entryUserId, entryMonth);
    }
    setCellData(n);
    setSubEntries([]); setShowBreakdown(false); setEntryOverallAmount('');
  };

  const getUserLabel       = (uId: string) => { const sp = salesPersons.find((p: any) => String(p.id) === uId); return sp ? (sp.full_name || sp.username) : `User #${uId}`; };
  const getCategoryName    = (catId: string) => globalCategories.find((c: any) => String(c.id) === catId)?.name || `Cat #${catId}`;
  const getSubcategoryName = (catId: string, subId: string) => { const cat = globalCategories.find((c: any) => String(c.id) === catId); return cat?.subcategories?.find((s: any) => String(s.id) === subId)?.name || `Sub #${subId}`; };

  const getTableRows = useMemo(() => {
    const catSubMap: Record<string, Set<string>> = {};
    if (!viewMode) globalCategories.forEach((gc: any) => { const k = String(gc.id); if (!catSubMap[k]) catSubMap[k] = new Set(); (gc.subcategories || []).forEach((gs: any) => catSubMap[k].add(String(gs.id))); });
    Object.keys(cellData).forEach(key => { const [, catId, , subId] = key.split('__'); if (!catSubMap[catId]) catSubMap[catId] = new Set(); catSubMap[catId].add(subId); });
    const rows: any[] = [];
    Object.entries(catSubMap).forEach(([catId, subIds]) => {
      const catName  = getCategoryName(catId);
      const subArray = Array.from(subIds);
      const catTotal = FY_MONTHS.reduce((sum, m) => sum + subArray.reduce((s2, subId) => s2 + Object.entries(cellData).reduce((s3, [k, v]) => { const [,kC,kM,kS] = k.split('__'); return kC===catId&&kM===m&&kS===subId ? s3+Number(v) : s3; }, 0), 0), 0);
      if (viewMode && catTotal === 0) return;
      const filteredSubs = viewMode ? subArray.filter(subId => FY_MONTHS.some(m => Object.entries(cellData).some(([k]) => { const [,kC,kM,kS]=k.split('__'); return kC===catId&&kM===m&&kS===subId; }))) : subArray;
      if (filteredSubs.length === 0) return;
      filteredSubs.forEach((subId, idx) => rows.push({ catId, catName, subId, subName: getSubcategoryName(catId, subId), isFirstOfCat: idx===0, catRowSpan: filteredSubs.length, catTotal }));
    });
    return rows;
  }, [cellData, globalCategories, viewMode]);

  const getCellAmount        = (catId: string, subId: string, month: string) => Object.entries(cellData).reduce((sum, [k, v]) => { const [,kC,kM,kS]=k.split('__'); return kC===catId&&kM===month&&kS===subId ? sum+Number(v) : sum; }, 0);
  const getCellEntriesDetailed = (catId: string, subId: string, month: string) => Object.entries(cellData).filter(([k]) => { const [,kC,kM,kS]=k.split('__'); return kC===catId&&kM===month&&kS===subId; });
  const getSubRowTotal       = (catId: string, subId: string) => FY_MONTHS.reduce((sum, m) => sum + getCellAmount(catId, subId, m), 0);
  const getMonthTotal        = (month: string) => {
    const brokenDownTotal = Object.entries(cellData).reduce((sum, [k, v]) => k.split('__')[2]===month ? sum+Number(v) : sum, 0);
    const savedMonthlyTotal = monthlyPlanEntries.reduce((sum, entry) => entry.month === month ? sum + (Number(entry.amount) || 0) : sum, 0);
    return brokenDownTotal + savedMonthlyTotal;
  };
  const getQuarterTotal      = (qMonths: string[]) => qMonths.reduce((sum, m) => sum + getMonthTotal(m), 0);
  const getAnnualTotal       = useMemo(() => {
    const brokenDownTotal = Object.values(cellData).reduce((sum, v) => sum + Number(v), 0);
    const savedMonthlyTotal = monthlyPlanEntries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
    return brokenDownTotal + savedMonthlyTotal;
  }, [cellData, monthlyPlanEntries]);
  const monthlyPlanRows      = useMemo(() => {
    const totals = new Map<string, { userId: string; month: string; amount: number }>();

    Object.entries(cellData).forEach(([key, value]) => {
      const [userId, , month] = key.split('__');
      const rowKey = `${userId}__${month}`;
      const existing = totals.get(rowKey);
      totals.set(rowKey, {
        userId,
        month,
        amount: (existing?.amount || 0) + Number(value),
      });
    });

    monthlyPlanEntries.forEach(entry => {
      const rowKey = `${entry.userId}__${entry.month}`;
      const existing = totals.get(rowKey);
      totals.set(rowKey, {
        userId: entry.userId,
        month: entry.month,
        amount: (existing?.amount || 0) + (Number(entry.amount) || 0),
      });
    });

    return Array.from(totals.values()).sort((a, b) => {
      const monthDiff = FY_MONTHS.indexOf(a.month) - FY_MONTHS.indexOf(b.month);
      if (monthDiff !== 0) return monthDiff;
      return getUserLabel(a.userId).localeCompare(getUserLabel(b.userId));
    });
  }, [cellData, monthlyPlanEntries, salesPersons]);
  const monthlyPlanMatrixRows = useMemo(() => {
    const grouped = new Map<string, { userId: string; monthAmounts: Record<string, number>; total: number }>();
    monthlyPlanRows.forEach(row => {
      const existing = grouped.get(row.userId) || {
        userId: row.userId,
        monthAmounts: {},
        total: 0,
      };
      existing.monthAmounts[row.month] = row.amount;
      existing.total += row.amount;
      grouped.set(row.userId, existing);
    });
    return Array.from(grouped.values()).sort((a, b) =>
      getUserLabel(a.userId).localeCompare(getUserLabel(b.userId))
    );
  }, [monthlyPlanRows, salesPersons]);
  const selectedFYStartYear  = Number(form.fy_start_year) || getCurrentFYStartYear();
  const selectedFYRange      = getFYDateRange(selectedFYStartYear);
  const selectedFYLabel      = formatFYLabel(selectedFYStartYear);
  const monthOptionsWithYear = useMemo(
    () => FY_MONTHS.map(month => ({
      value: month,
      label: `${month} ${getYearForFYMonth(selectedFYStartYear, month)}`,
    })),
    [selectedFYStartYear]
  );

  useEffect(() => {
    if (id || viewMode || !isAdmin) return;
    setStoredBudgetTitleDraft(form.title || '');
  }, [id, viewMode, isAdmin, form.title]);

  const canToggleTitleEdit   = Boolean(isAdmin && !viewMode);
  const titleIsLocked        = Boolean(id && canToggleTitleEdit && !titleEditEnabled);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || viewMode) return;
    const usedCatIds = new Set(Object.keys(cellData).map(k => k.split('__')[1]));
    const categories_payload = globalCategories
      .filter((gc: any) => usedCatIds.has(String(gc.id)))
      .map((gc: any, i: number) => ({
        name: gc.name,
        order: i,
        subcategories: (gc.subcategories || []).map((gs: any, si: number) => ({ name: gs.name, order: si })),
      }));
    const period_entries_payload = Object.entries(cellData).map(([key, val]) => {
      const [uId, cId, month, sId] = key.split('__');
      const gc = globalCategories.find((c: any) => String(c.id) === String(cId));
      const gs = gc?.subcategories?.find((s: any) => String(s.id) === String(sId));
      const catIdx = categories_payload.findIndex((cp: any) => cp.name === gc?.name);
      return { month, category_index: catIdx, subcategory_name: gs?.name || '', user_id: parseInt(uId), allocated: parseFloat(val) };
    }).filter((entry: any) => entry.category_index >= 0);

    let globalCategoryIndex: number | null = null;
    if (monthlyPlanEntries.length > 0) {
      globalCategoryIndex = categories_payload.length;
      categories_payload.push({
        name: HIDDEN_GLOBAL_CATEGORY_NAME,
        order: globalCategoryIndex,
        subcategories: [{ name: HIDDEN_GLOBAL_SUBCATEGORY_NAME, order: 0 }],
      });
    }

    const monthly_plan_payload = monthlyPlanEntries.map(entry => ({
      month: entry.month,
      category_index: globalCategoryIndex,
      subcategory_name: HIDDEN_GLOBAL_SUBCATEGORY_NAME,
      user_id: parseInt(entry.userId),
      allocated: parseFloat(entry.amount),
    })).filter((entry: any) => entry.category_index !== null);
    const all_period_entries_payload = [...period_entries_payload, ...monthly_plan_payload];
    let rootUserId: number | null = null;
    if (id && dashboard) rootUserId = dashboard?.user?.id ?? dashboard?.user_id ?? null;
    if (!rootUserId && all_period_entries_payload.length > 0) rootUserId = all_period_entries_payload[0].user_id;
    if (!rootUserId) { alert('Please assign at least one entry.'); return; }
    const formPayload = {
      title: form.title.trim(),
      revenue_target: form.revenue_target,
      currency: form.currency,
      notes: form.notes,
    };
    const payload = {
      ...formPayload,
      period: 'annual',
      quarter: null,
      selected_month: null,
      start_date: selectedFYRange.startDate,
      end_date: selectedFYRange.endDate,
      user_id: rootUserId,
      categories: categories_payload,
      period_entries: all_period_entries_payload,
    };
    id ? dispatch(updateBudget({ id: Number(id), data: payload })) : dispatch(createBudget(payload));
  };

  const isLoading = id && !dashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50 font-sans">
      <main className="max-w-[1600px] mx-auto px-7 py-6 flex flex-col gap-5">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 shadow-sm"
          style={{ animation: 'fadeDown 0.4s ease both' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:-translate-x-0.5 transition-all duration-200 cursor-pointer shadow-sm">
              <ChevronLeft size={15} /> Back
            </button>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-bold text-indigo-700 m-0 leading-tight">
                {viewMode ? 'Sales Target Overview' : id ? 'Edit Sales Target' : 'Create New Sales Target'}
              </h1>
              <span className="text-sm text-indigo-500 font-medium">Monitor and distribute company sales targets</span>
            </div>
          </div>
          {viewMode && (
            <span className="text-[11px] font-bold text-cyan-600 px-3 py-1.5 bg-cyan-50 border border-cyan-200 rounded-full uppercase tracking-wider">
              View Only
            </span>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <svg className="animate-spin w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2"/>
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-semibold">Loading budget data…</span>
          </div>
        )}

        {/* No access */}
        {!isLoading && id && !dashboard && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="text-5xl">🔒</div>
            <p className="text-sm font-bold text-slate-600">Budget not found or access denied</p>
            <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl border-none cursor-pointer hover:-translate-y-0.5 transition-all">← Go Back</button>
          </div>
        )}

        {(!id || dashboard) && !isLoading && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* ── Step 1: Budget Planning ── */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              style={{ animation: 'fadeUp 0.35s ease both' }}>
              <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-200">1</div>
                  <span className="text-sm font-bold text-slate-800">Budget Planning</span>
                </div>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target Title</label>
                      {canToggleTitleEdit && (
                        <button
                          type="button"
                          onClick={() => setTitleEditEnabled(prev => !prev)}
                          className="px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                        >
                          {titleEditEnabled ? 'Lock Title' : 'Edit Title'}
                        </button>
                      )}
                    </div>
                    <input className={inputCls} value={form.title} onChange={e => setForm({...form, title: e.target.value})} readOnly={viewMode || !isAdmin || titleIsLocked} placeholder={`e.g. ${selectedFYLabel} Revenue Target`} required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Annual Revenue Goal</label>
                    <input className={inputCls} type="number" value={form.revenue_target} onChange={e => setForm({...form, revenue_target: e.target.value})} readOnly={viewMode} placeholder="0.00" required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Currency</label>
                    <select className={selectCls} value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} disabled={viewMode}>
                      <option value="INR">INR — Indian Rupee</option>
                      <option value="USD">USD — US Dollar</option>
                    </select>
                  </div>
                </div>

                {/* View mode assigned PICs */}
                {viewMode && dashboard && (
                  <div className="mt-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Sales PICs</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set((dashboard.period_entries||[]).map((pe: any) => pe.user_id).filter(Boolean))).map((uid: any) => (
                        <span key={uid} className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-semibold">
                          {getUserLabel(String(uid))}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Step 2: Monthly Wise Planning ── */}
            {!viewMode && isAdmin && (
              <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                style={{ animation: 'fadeUp 0.4s ease both' }}>
                <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
                  <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-200">2</div>
                  <span className="text-sm font-bold text-slate-800">Monthly Wise Planning</span>
                </div>
                <div className="px-6 py-5">
                  {/* Sales PIC / Month / Amount row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Sales PIC</label>
                      <select className={selectCls} value={entryUserId} onChange={e => setEntryUserId(e.target.value)} disabled={showBreakdown}>
                        <option value="">Select Person</option>
                        {salesPersons.map((p: any) => <option key={p.id} value={p.id}>{p.full_name || p.username}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Month</label>
                      <select className={selectCls} value={entryMonth} onChange={e => setEntryMonth(e.target.value)} disabled={showBreakdown}>
                        {monthOptionsWithYear.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Overall Month Amount</label>
                      <input className={inputCls} type="number" value={entryOverallAmount} onChange={e => setEntryOverallAmount(e.target.value)} placeholder="e.g. 800000" disabled={showBreakdown} />
                    </div>
                  </div>

                  {!showBreakdown && (
                    <div className="flex justify-end gap-3 mb-4">
                      <button
                        type="button"
                        onClick={saveMonthlyPlanEntry}
                        disabled={!canSaveMonthlyPlan}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-none transition-all ${canSaveMonthlyPlan ? 'bg-emerald-500 text-white cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                      >
                        <Save size={15} /> Save PIC Month
                      </button>
                      <button type="button" onClick={startBreakdown}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-xl border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 transition-all shadow-md">
                        <Plus size={15} /> Break Down
                      </button>
                    </div>
                  )}

                  {/* Breakdown panel */}
                  {showBreakdown && (
                    <div className="bg-slate-50 rounded-2xl border-2 border-indigo-100 p-5" style={{ animation: 'fadeUp 0.3s ease both' }}>
                      {/* Status bar */}
                      <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
                        <div className="text-sm font-semibold text-slate-600">
                          Breakdown for <span className="text-indigo-600">{getUserLabel(entryUserId)}</span>
                          <span className="text-slate-300 mx-2">·</span>
                          <span className="text-amber-500">{entryMonth}</span>
                        </div>
                        <div className="flex gap-4 text-xs font-semibold">
                          <span className="text-slate-500">Total: <strong className="text-slate-800">₹{overallNum.toLocaleString()}</strong></span>
                          <span className="text-indigo-600">Allocated: <strong>₹{allocatedSoFar.toLocaleString()}</strong></span>
                          <span className={remaining === 0 ? 'text-emerald-600' : remaining < 0 ? 'text-red-500' : 'text-amber-500'}>
                            Remaining: <strong>₹{remaining.toLocaleString()}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2 bg-slate-200 rounded-full mb-5 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${remaining === 0 ? 'bg-emerald-500' : remaining < 0 ? 'bg-red-500' : 'bg-indigo-500'}`}
                          style={{ width: `${Math.min(100, overallNum > 0 ? (allocatedSoFar/overallNum)*100 : 0)}%` }} />
                      </div>

                      {/* Sub rows */}
                      {subEntries.map((se, idx) => {
                        const selCat = globalCategories.find((c: any) => String(c.id) === se.catId);
                        const selSubs = selCat?.subcategories || [];
                        const maxAmt  = getMaxForRow(idx);
                        return (
                          <div key={idx} className={`grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end py-3 ${idx < subEntries.length-1 ? 'border-b border-slate-200' : ''}`}>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Category {idx+1}</label>
                              <select className={selectCls} value={se.catId} onChange={e => updateSubEntry(idx, 'catId', e.target.value)}>
                                <option value="">Choose category</option>
                                {globalCategories.map((c: any) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                              </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Subcategory</label>
                              <select className={selectCls} value={se.subId} onChange={e => updateSubEntry(idx, 'subId', e.target.value)} disabled={!se.catId}>
                                <option value="">Choose subcategory</option>
                                {selSubs.map((s: any) => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
                              </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                                Amount <span className="text-slate-400 text-[9px] font-normal">(max: ₹{maxAmt.toLocaleString()})</span>
                              </label>
                              <input className={inputCls} type="number" value={se.amount}
                                onChange={e => { const v = parseFloat(e.target.value)||0; updateSubEntry(idx,'amount', v > maxAmt ? String(maxAmt) : e.target.value); }}
                                placeholder="0" max={maxAmt} />
                            </div>
                            <div className="pb-0.5">
                              {subEntries.length > 1 && (
                                <button type="button" onClick={() => removeSubEntry(idx)}
                                  className="w-9 h-11 flex items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-colors cursor-pointer">
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Breakdown action buttons */}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                        <div>
                          {remaining > 0 && (
                            <button type="button" onClick={addSubEntryRow}
                              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                              <Plus size={13} /> Add Category
                              <span className="text-amber-500 ml-1">(₹{remaining.toLocaleString()} left)</span>
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={cancelBreakdown}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                            Cancel
                          </button>
                          <button type="button" onClick={pushBreakdownToMatrix} disabled={Math.abs(remaining) > 0.01}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white border-none transition-all cursor-pointer ${Math.abs(remaining) <= 0.01 ? 'bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-200' : 'bg-slate-300 cursor-not-allowed opacity-60'}`}>
                            <Check size={14} />
                            {Math.abs(remaining) <= 0.01 ? 'Push to Matrix' : `₹${remaining.toLocaleString()} remaining`}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Saved PIC Monthly Data</span>
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                        {monthlyPlanMatrixRows.length} PICs
                      </span>
                    </div>
                    {monthlyPlanMatrixRows.length === 0 ? (
                      <div className="px-4 py-5 text-sm text-slate-400">No monthly Sales PIC assignment saved yet.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] border-collapse text-sm">
                          <thead>
                            <tr className="bg-white border-b border-slate-200">
                              <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sales PIC</th>
                              {FY_MONTHS.map(month => (
                                <th key={month} className="px-3 py-3 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                  {month.slice(0, 3)}
                                </th>
                              ))}
                              <th className="px-4 py-3 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {monthlyPlanMatrixRows.map(row => (
                              <tr key={row.userId} className="border-b border-slate-100 last:border-b-0">
                                <td className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">{getUserLabel(row.userId)}</td>
                                {FY_MONTHS.map(month => {
                                  const amount = row.monthAmounts[month] || 0;
                                  return (
                                    <td key={month} className={`px-3 py-3 text-center text-xs ${amount > 0 ? 'font-bold text-indigo-700' : 'text-slate-300'}`}>
                                      {amount > 0 ? `₹${amount.toLocaleString()}` : '—'}
                                    </td>
                                  );
                                })}
                                <td className="px-4 py-3 text-right font-bold text-indigo-700 whitespace-nowrap">₹{row.total.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Category Table ── */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              style={{ animation: 'fadeUp 0.45s ease both' }}>
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BarChart2 size={16} className="text-indigo-500" />
                  <span className="text-sm font-bold text-slate-800">Budget / Category & Subcategory Wise</span>
                </div>
                <div className="flex items-center gap-2">
                  {viewMode && <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">View Only</span>}
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">12 Months</span>
                </div>
              </div>

              {Object.keys(cellData).length === 0 && id && dataReady && (
                <div className="text-center py-10 text-sm text-slate-400">No allocations found for this budget.</div>
              )}

              {(Object.keys(cellData).length > 0 || !id) && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[780px] text-sm font-sans">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-600 to-violet-500 text-[10.5px] font-bold uppercase tracking-widest">
                        <th className="px-5 py-3 text-left text-slate-300 sticky left-0 z-10 bg-indigo-600 min-w-[130px]">Category</th>
                        <th className="px-3 py-3 text-left text-slate-300 sticky z-10 bg-indigo-500 min-w-[120px]" style={{left:130}}>Subcategory</th>
                        {FY_MONTHS.map(m => <th key={m} className="px-2 py-3 text-center text-indigo-100 font-bold">{m.slice(0,3)}</th>)}
                        <th className="px-4 py-3 text-center text-white bg-violet-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getTableRows.map((row) => {
                        const subTotal = getSubRowTotal(row.catId, row.subId);
                        return (
                          <tr key={`${row.catId}-${row.subId}`} className="border-b border-slate-50 hover:bg-indigo-50/20 transition-colors">
                            {row.isFirstOfCat && (
                              <td rowSpan={row.catRowSpan} className="px-5 py-3 sticky left-0 z-[1] bg-indigo-50 border-r-2 border-indigo-200 align-top">
                                <div className="font-bold text-indigo-800 text-sm">{row.catName}</div>
                                <div className="text-[10px] text-slate-400 font-medium mt-0.5">{fmt(row.catTotal)}</div>
                              </td>
                            )}
                            <td className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50/80 border-r border-slate-100 sticky z-[1]" style={{left:130}}>
                              {row.subName}
                            </td>
                            {FY_MONTHS.map(m => {
                              const entries = getCellEntriesDetailed(row.catId, row.subId, m);
                              return (
                                <td key={m} className="px-1 py-2 text-center align-top min-w-[70px]">
                                  {entries.length > 0 && (
                                    <div className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Allocated</div>
                                  )}
                                  {entries.map(([key, val]) => {
                                    const [uId] = key.split('__');
                                    return (
                                      <div key={key} className="flex items-center justify-center gap-1 text-[10px] mb-0.5">
                                        <span className="text-slate-500 font-medium">{getUserLabel(uId)}:</span>
                                        <span className="text-slate-800 font-bold">₹{Number(val).toLocaleString()}</span>
                                        {!viewMode && isAdmin && (
                                          <button type="button" onClick={() => setCellData(prev => { const n={...prev}; delete n[key]; return n; })}
                                            className="text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer text-[10px] leading-none">✕</button>
                                        )}
                                      </div>
                                    );
                                  })}
                                </td>
                              );
                            })}
                            <td className="px-4 py-2 text-right font-bold text-indigo-600 text-xs bg-indigo-50/50">
                              {subTotal > 0 ? `₹${subTotal.toLocaleString()}` : '—'}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gradient-to-r from-indigo-700 to-violet-600">
                        <td colSpan={2} className="px-5 py-3 sticky left-0 z-[1] bg-indigo-700 text-[11px] font-bold text-white uppercase tracking-wider">Month Total</td>
                        {FY_MONTHS.map(m => <td key={m} className="px-2 py-3 text-center text-[11px] font-bold text-indigo-100">₹{getMonthTotal(m).toLocaleString()}</td>)}
                        <td className="px-4 py-3 text-center text-sm font-extrabold text-white bg-violet-600">₹{getAnnualTotal.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ── Quarterly Table ── */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              style={{ animation: 'fadeUp 0.5s ease both' }}>
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
                <div className="flex items-center gap-2"><Target size={16} className="text-indigo-500" /><span className="text-sm font-bold text-slate-800">Budget / Quarterly</span></div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">4 Quarters</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[400px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-violet-500">
                      <th className="px-5 py-3 text-left bg-indigo-600 sticky left-0 min-w-[160px]"></th>
                      {Object.entries(QUARTER_LABELS).map(([q, label]) => (
                        <th key={q} className="px-4 py-3 text-center">
                          <div className="text-sm font-extrabold text-indigo-200">{q}</div>
                          <div className="text-[10px] font-semibold text-indigo-400 mt-0.5">{label.replace(`${q} `, '')}</div>
                        </th>
                      ))}
                      <th className="px-4 py-3 text-center bg-violet-600 text-white text-[11px] font-bold uppercase tracking-wider">Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-50 hover:bg-indigo-50/20 transition-colors">
                      <td className="px-5 py-4 sticky left-0 bg-indigo-50 border-r-2 border-indigo-200 font-bold text-indigo-700 text-sm uppercase tracking-wider">Allocated</td>
                      {Object.entries(QUARTERS).map(([q, months]) => (
                        <td key={q} className="px-4 py-4 text-center text-lg font-extrabold text-emerald-600">₹{getQuarterTotal(months).toLocaleString()}</td>
                      ))}
                      <td className="px-4 py-4 text-center text-lg font-extrabold text-emerald-600 bg-emerald-50">₹{getAnnualTotal.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Per-User Summary (View Mode) ── */}
            {viewMode && Object.keys(cellData).length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md overflow-hidden"
                style={{ animation: 'fadeUp 0.55s ease both' }}>
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
                  <div className="flex items-center gap-2"><Users size={16} className="text-indigo-500" /><span className="text-sm font-bold text-slate-800">Allocation Summary — Per Person</span></div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">Per Person</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[780px] text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-600 to-violet-500 text-[10.5px] font-bold uppercase tracking-widest">
                        <th className="px-5 py-3 text-left text-white sticky left-0 bg-indigo-600">Sales PIC</th>
                        {FY_MONTHS.map(m => <th key={m} className="px-2 py-3 text-center text-indigo-100 font-bold">{m.slice(0,3)}</th>)}
                        <th className="px-4 py-3 text-center text-white bg-violet-600">FY Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(new Set(Object.keys(cellData).map(k => k.split('__')[0]))).map(uid => (
                        <tr key={uid} className="border-b border-slate-50 hover:bg-indigo-50/20 transition-colors">
                          <td className="px-5 py-3 sticky left-0 bg-indigo-50 border-r-2 border-indigo-200">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-indigo-700 text-xs font-bold">{getUserLabel(uid)[0]?.toUpperCase()}</div>
                              <span className="text-sm font-semibold text-slate-800">{getUserLabel(uid)}</span>
                            </div>
                          </td>
                          {FY_MONTHS.map(month => {
                            const total = Object.entries(cellData).reduce((sum, [k, v]) => { const [kU,,kM]=k.split('__'); return kU===uid&&kM===month ? sum+Number(v) : sum; }, 0);
                            return <td key={month} className={`px-2 py-3 text-center text-[11px] font-semibold ${total > 0 ? 'text-indigo-700 bg-indigo-50/50' : 'text-slate-300'}`}>{total > 0 ? `₹${total.toLocaleString()}` : '—'}</td>;
                          })}
                          <td className="px-4 py-3 text-center font-bold text-indigo-600 bg-indigo-50">₹{Object.entries(cellData).reduce((sum,[k,v]) => k.split('__')[0]===uid ? sum+Number(v) : sum, 0).toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="bg-gradient-to-r from-indigo-700 to-violet-600">
                        <td className="px-5 py-3 sticky left-0 bg-indigo-700 text-[11px] font-bold text-white uppercase tracking-wider">Grand Total</td>
                        {FY_MONTHS.map(m => <td key={m} className="px-2 py-3 text-center text-[11px] font-bold text-indigo-100">₹{getMonthTotal(m).toLocaleString()}</td>)}
                        <td className="px-4 py-3 text-center font-extrabold text-white bg-violet-600">₹{getAnnualTotal.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Footer ── */}
            <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-500 rounded-2xl shadow-lg border border-indigo-400" style={{ animation: 'fadeUp 0.6s ease both' }}>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-indigo-100 uppercase tracking-wider">Annual Calculation</span>
                <div className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'Sora, system-ui, sans-serif' }}>
                  ₹{getAnnualTotal.toLocaleString()}
                </div>
              </div>
              {!viewMode && isAdmin && (
                <button type="submit" disabled={saveStatus === 'saving'}
                  className="flex items-center gap-2 px-9 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200 border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                  <Save size={16} />
                  {saveStatus === 'saving' ? 'Saving…' : 'Save Target'}
                </button>
              )}
            </div>

          </form>
        )}
      </main>

      <style>{`
        @keyframes fadeUp   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
};

export default BudgetForm;

