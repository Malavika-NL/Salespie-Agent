
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchTeamSummary, deleteBudget } from './slice/budgetSlice';
import { useBudgetPrefix } from './useBudgetPrefix';
import { LayoutDashboard, Plus, Eye, Pencil, Trash2, Target, RefreshCw, AlertTriangle, Wallet } from 'lucide-react';

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <tr>
    {[40, 60, 50, 50, 50, 30, 40].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-3.5 rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse" style={{ width: `${w}%`, marginLeft: i === 6 ? 'auto' : undefined }} />
      </td>
    ))}
  </tr>
);

// ─── Component ────────────────────────────────────────────────────────────────

const BudgetOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate  = useNavigate();
  const prefix    = useBudgetPrefix();

  const { teamSummary, loading, teamSummaryError } = useSelector((s: RootState) => s.budget);
  const currentUser = useSelector((s: RootState) => s.userLoginAuth?.user);
  const isAdmin     = currentUser?.role === 'admin';

  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { dispatch(fetchTeamSummary()); }, [dispatch]);

  const handleView = (id: number) => navigate(`${prefix}/budget/${id}/view`);
  const handleEdit = (id: number) => navigate(`${prefix}/budget/${id}/edit`);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await dispatch(deleteBudget(deleteTarget.id)).unwrap();
      dispatch(fetchTeamSummary());
    } catch {
      alert('Failed to delete the target. Please try again.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 font-sans">
      <main className="max-w-[1600px] mx-auto px-7 py-6 flex flex-col gap-5">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
              <Wallet size={22} color="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-indigo-700 m-0 leading-tight">
                {isAdmin ? 'Budget Overview' : 'My Sales Target'}
              </h1>
              <p className="text-sm text-indigo-500 m-0 mt-0.5">
                {isAdmin
                  ? 'Overview of all company budgets with PIC-wise monthly allocations'
                  : 'Your assigned sales targets for this financial year'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {isAdmin ? (
              <>
                <button
                  onClick={() => navigate(`${prefix}/budget/dashboard`)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-700 text-sm font-bold rounded-xl border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 cursor-pointer shadow-sm"
                >
                  <LayoutDashboard size={15} /> Dashboard
                </button>
                <button
                  onClick={() => navigate(`${prefix}/budget/new`)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-200 border-none cursor-pointer"
                >
                  <Plus size={15} /> Create New Budget
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate(`${prefix}/budget/my-dashboard`)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 border-none cursor-pointer"
              >
                <LayoutDashboard size={15} /> My Dashboard
              </button>
            )}
          </div>
        </div>

        {/* ── Error Banner ── */}
        {teamSummaryError && (
          <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-semibold">
            <AlertTriangle size={16} className="shrink-0" /> {teamSummaryError}
          </div>
        )}

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">

          {/* Table Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-800">
                {isAdmin ? '📋 All Budgets' : '🎯 My Targets'}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {teamSummary.length} budget{teamSummary.length !== 1 ? 's' : ''} found
              </span>
            </div>
            <button
              onClick={() => dispatch(fetchTeamSummary())}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>

          {/* Spinner */}
          {loading && teamSummary.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <svg className="animate-spin w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          )}

          {!(loading && teamSummary.length === 0) && (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-[11px] font-bold uppercase tracking-widest text-white/80">
                    <th className="px-5 py-3">#</th>
                    <th className="px-5 py-3">Budget Title</th>
                    <th className="px-5 py-3">Assigned PICs</th>
                    <th className="px-5 py-3 text-right">FY Total</th>
                    <th className="px-5 py-3 text-right">This Quarter</th>
                    <th className="px-5 py-3 text-right">This Month</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Loading skeleton rows */}
                  {loading && teamSummary.length > 0 && <><SkeletonRow /><SkeletonRow /></>}

                  {/* Data rows */}
                  {!loading && teamSummary.map((row: any, index: number) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-100 hover:bg-indigo-50/30 transition-colors duration-150"
                    >
                      <td className="px-5 py-4 text-xs text-slate-400 font-medium">{index + 1}</td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-700 text-sm font-extrabold shrink-0">
                            {(row.title || '?')[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-slate-800">{row.title}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(row.sales_persons || []).map((name: string, i: number) => (
                            <span key={i} className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[11px] font-semibold">
                              {name}
                            </span>
                          ))}
                          {(!row.sales_persons || row.sales_persons.length === 0) && (
                            <span className="text-xs text-slate-400 italic">No PICs assigned</span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right text-sm font-bold text-slate-800 font-mono">
                        ₹{(row.budget_this_fy || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-slate-800 font-mono">
                        ₹{(row.this_quarter || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-slate-800 font-mono">
                        ₹{(row.this_month || 0).toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => handleView(row.id)} title="View"
                            className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 hover:border-indigo-300 hover:-translate-y-0.5 transition-all cursor-pointer">
                            <Eye size={14} />
                          </button>
                          {isAdmin && (
                            <button onClick={() => handleEdit(row.id)} title="Edit"
                              className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-100 hover:border-slate-300 hover:-translate-y-0.5 transition-all cursor-pointer">
                              <Pencil size={14} />
                            </button>
                          )}
                          {isAdmin && (
                            <button onClick={() => setDeleteTarget({ id: row.id, name: row.title || `Budget #${row.id}` })} title="Delete"
                              className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-100 hover:border-red-300 hover:-translate-y-0.5 transition-all cursor-pointer">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Empty state */}
                  {!loading && teamSummary.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                            <Target size={26} className="text-indigo-400" />
                          </div>
                          <p className="text-sm font-bold text-slate-600 m-0">
                            {isAdmin ? 'No budgets created yet' : 'No target assigned to you yet'}
                          </p>
                          <p className="text-xs text-slate-400 m-0">
                            {isAdmin ? 'Click "Create New Budget" to get started.' : 'Please contact your admin.'}
                          </p>
                          {isAdmin && (
                            <button onClick={() => navigate(`${prefix}/budget/new`)}
                              className="flex items-center gap-2 mt-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-xl shadow-md hover:-translate-y-0.5 transition-all border-none cursor-pointer">
                              <Plus size={14} /> Create New Budget
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Delete Modal ── */}
        {isAdmin && deleteTarget && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl border-2 border-slate-200 w-[90%] max-w-sm p-7 flex flex-col items-center gap-4"
              onClick={e => e.stopPropagation()}
              style={{ animation: 'slideUp 0.22s ease' }}
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                <AlertTriangle size={26} className="text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 m-0 text-center">Delete Budget?</h2>
              <p className="text-sm text-slate-500 text-center leading-relaxed m-0">
                Are you sure you want to delete{' '}
                <span className="font-bold text-red-500">{deleteTarget.name}</span>?{' '}
                All allocation data will be permanently removed.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-bold text-white shadow-md transition-colors disabled:opacity-60 cursor-pointer border-none"
                >
                  {deleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BudgetOverview;