import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  Activity,
  BarChart3,
  BookOpen,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Plus,
  Shield,
  Trash2,
  UserCog,
  Users,
  Wrench,
} from 'lucide-react';
import {
  getComplaintAnalytics,
  getAllComplaintsAdmin,
  updateComplaintAdmin,
  getUsersAdmin,
  patchUserRoleAdmin,
  getWorkersAdmin,
  createWorkerAdmin,
  updateWorkerAdmin,
} from '../services/adminService';
import { getRules, addRule, updateRule, deleteRule } from '../services/ruleService';
import { clearAuth, getAuthUser } from '../utils/authStorage';

const STATUS_OPTIONS = ['Pending', 'In progress', 'Resolved'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const CATEGORY_OPTIONS = ['plumber', 'electrician', 'carpenter', 'other'];
const TRADE_OPTIONS = ['plumber', 'electrician', 'carpenter'];

function readStoredUser() {
  try {
    const u = getAuthUser();
    if (!u) return null;
    return {
      id: u.id,
      fullName: u.fullName || 'Admin',
      email: u.email,
      role: u.role || 'resident',
    };
  } catch {
    return null;
  }
}

const categoryLabel = (c) =>
  ({ plumber: 'Plumber', electrician: 'Electrician', carpenter: 'Carpenter', other: 'Other' }[c] || c);

const tradeLabel = (t) => categoryLabel(t);

function workersForComplaint(workers, category) {
  const active = workers.filter((w) => w.isActive);
  if (['plumber', 'electrician', 'carpenter'].includes(category)) {
    const match = active.filter((w) => w.trade === category);
    if (match.length) return match;
  }
  return active;
}

const NavButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
      active
        ? 'bg-teal-600 text-white shadow-sm'
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
    }`}
  >
    <Icon className="h-4 w-4 shrink-0 opacity-90" strokeWidth={2} />
    {label}
  </button>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [me] = useState(() => readStoredUser());
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [rules, setRules] = useState([]);
  const [fStatus, setFStatus] = useState('all');
  const [fPriority, setFPriority] = useState('all');
  const [fCategory, setFCategory] = useState('all');
  const [newRule, setNewRule] = useState({ title: '', description: '', category: 'General' });
  const [editingRule, setEditingRule] = useState(null);
  const [newWorker, setNewWorker] = useState({ name: '', phone: '', trade: 'plumber' });

  const refreshData = useCallback(async () => {
    const [a, c, u, w, r] = await Promise.all([
      getComplaintAnalytics(),
      getAllComplaintsAdmin(),
      getUsersAdmin(),
      getWorkersAdmin(),
      getRules(),
    ]);
    setAnalytics(a);
    setComplaints(Array.isArray(c) ? c : []);
    setUsers(Array.isArray(u) ? u : []);
    setWorkers(Array.isArray(w) ? w : []);
    setRules(Array.isArray(r) ? r : []);
  }, []);

  useEffect(() => {
    if (!me || me.role !== 'admin') {
      navigate('/login');
      return;
    }
    (async () => {
      try {
        setLoading(true);
        await refreshData();
      } catch (e) {
        toast.error(e.message || 'Failed to load admin data');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, [me, navigate, refreshData]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((row) => {
      if (fStatus !== 'all' && row.status !== fStatus) return false;
      if (fPriority !== 'all' && row.priority !== fPriority) return false;
      if (fCategory !== 'all' && row.category !== fCategory) return false;
      return true;
    });
  }, [complaints, fStatus, fPriority, fCategory]);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const patchComplaint = async (id, body, msg) => {
    try {
      const updated = await updateComplaintAdmin(id, body);
      setComplaints((prev) => prev.map((x) => (x._id === id ? updated : x)));
      const next = await getComplaintAnalytics();
      setAnalytics(next);
      toast.success(msg || 'Updated');
    } catch (e) {
      toast.error(e.message || 'Update failed');
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await patchUserRoleAdmin(userId, role);
      setUsers((prev) =>
        prev.map((u) => (String(u._id) === String(userId) ? { ...u, role } : u)),
      );
      toast.success('Role updated');
    } catch (e) {
      toast.error(e.message || 'Could not update role');
    }
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!newRule.title.trim() || !newRule.description.trim()) {
      toast.error('Title and description required');
      return;
    }
    try {
      const created = await addRule(newRule);
      setRules((prev) => [created, ...prev]);
      setNewRule({ title: '', description: '', category: 'General' });
      toast.success('Rule added');
    } catch (err) {
      toast.error(err.message || 'Failed to add rule');
    }
  };

  const handleSaveEditRule = async (e) => {
    e.preventDefault();
    if (!editingRule) return;
    try {
      const saved = await updateRule(editingRule._id, {
        title: editingRule.title,
        description: editingRule.description,
        category: editingRule.category,
      });
      setRules((prev) => prev.map((r) => (r._id === saved._id ? saved : r)));
      setEditingRule(null);
      toast.success('Rule saved');
    } catch (err) {
      toast.error(err.message || 'Save failed');
    }
  };

  const handleDeleteRule = async (id) => {
    if (!window.confirm('Delete this rule?')) return;
    try {
      await deleteRule(id);
      setRules((prev) => prev.filter((r) => r._id !== id));
      toast.success('Rule removed');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();
    if (!newWorker.name.trim() || !newWorker.phone.trim()) {
      toast.error('Name and phone required');
      return;
    }
    try {
      const w = await createWorkerAdmin(newWorker);
      setWorkers((prev) => [...prev, w]);
      setNewWorker({ name: '', phone: '', trade: 'plumber' });
      toast.success('Worker added');
    } catch (err) {
      toast.error(err.message || 'Failed to add worker');
    }
  };

  const toggleWorkerActive = async (worker) => {
    try {
      const w = await updateWorkerAdmin(worker._id, { isActive: !worker.isActive });
      setWorkers((prev) => prev.map((x) => (x._id === w._id ? w : x)));
      toast.success(w.isActive ? 'Worker active' : 'Worker deactivated');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  if (!me || me.role !== 'admin') {
    return null;
  }

  const maxCategoryCount = Math.max(
    1,
    ...CATEGORY_OPTIONS.map((c) => analytics?.byCategory?.[c] || 0),
  );

  return (
    <div className="min-h-screen bg-zinc-200 text-zinc-900">
      <Toaster position="top-center" toastOptions={{ className: 'text-sm font-medium' }} />
      <div className="flex min-h-screen">
        <aside className="flex w-60 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-500 text-zinc-950">
              <Shield className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Panchayat
              </p>
              <p className="truncate text-sm font-bold text-zinc-100">Admin console</p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-3">
            <NavButton
              active={tab === 'overview'}
              onClick={() => setTab('overview')}
              icon={LayoutDashboard}
              label="Overview & analytics"
            />
            <NavButton
              active={tab === 'complaints'}
              onClick={() => setTab('complaints')}
              icon={ClipboardList}
              label="Complaint desk"
            />
            <NavButton
              active={tab === 'users'}
              onClick={() => setTab('users')}
              icon={Users}
              label="Residents"
            />
            <NavButton
              active={tab === 'rules'}
              onClick={() => setTab('rules')}
              icon={BookOpen}
              label="Society rules"
            />
            <NavButton
              active={tab === 'workers'}
              onClick={() => setTab('workers')}
              icon={Wrench}
              label="Field workers"
            />
          </nav>

          <div className="border-t border-zinc-800 p-3">
            <Link
              to="/"
              className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
            >
              <ExternalLink className="h-4 w-4" strokeWidth={2} />
              Public site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} />
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-zinc-300 bg-white px-6 py-4 shadow-sm">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-900">
                {tab === 'overview' && 'Operations overview'}
                {tab === 'complaints' && 'Complaint desk'}
                {tab === 'users' && 'Resident accounts'}
                {tab === 'rules' && 'Rule book editor'}
                {tab === 'workers' && 'Workers & trades'}
              </h1>
              <p className="text-xs text-zinc-500">
                Signed in as <span className="font-medium text-zinc-700">{me.fullName}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600">
              <UserCog className="h-3.5 w-3.5" strokeWidth={2} />
              Advanced admin panel
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 lg:p-8">
            {loading ? (
              <div className="flex h-64 items-center justify-center text-sm font-medium text-zinc-500">
                Loading workspace…
              </div>
            ) : (
              <>
                {tab === 'overview' && analytics && (
                  <div className="space-y-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-lg border border-zinc-300 bg-white p-5 shadow-sm">
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          <Activity className="h-4 w-4 text-teal-600" strokeWidth={2} />
                          Total complaints
                        </div>
                        <p className="text-3xl font-bold tabular-nums text-zinc-900">{analytics.total}</p>
                      </div>
                      {STATUS_OPTIONS.map((s) => (
                        <div
                          key={s}
                          className="rounded-lg border border-zinc-300 bg-white p-5 shadow-sm"
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{s}</p>
                          <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-900">
                            {analytics.byStatus?.[s] ?? 0}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg border border-zinc-300 bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-teal-600" strokeWidth={2} />
                        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-800">
                          By category
                        </h2>
                      </div>
                      <div className="space-y-4">
                        {CATEGORY_OPTIONS.map((cat) => {
                          const count = analytics.byCategory?.[cat] ?? 0;
                          const pct = Math.round((count / maxCategoryCount) * 100);
                          return (
                            <div key={cat}>
                              <div className="mb-1 flex justify-between text-sm">
                                <span className="font-medium text-zinc-700">{categoryLabel(cat)}</span>
                                <span className="tabular-nums text-zinc-500">{count}</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
                                <div
                                  className="h-full rounded-full bg-teal-600 transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {tab === 'complaints' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-zinc-300 bg-white p-4 shadow-sm">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-500">Status</label>
                        <select
                          value={fStatus}
                          onChange={(e) => setFStatus(e.target.value)}
                          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium outline-none ring-teal-500/0 focus:ring-2 focus:ring-teal-500/30"
                        >
                          <option value="all">All</option>
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-500">Priority</label>
                        <select
                          value={fPriority}
                          onChange={(e) => setFPriority(e.target.value)}
                          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/30"
                        >
                          <option value="all">All</option>
                          {PRIORITY_OPTIONS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-500">Category</label>
                        <select
                          value={fCategory}
                          onChange={(e) => setFCategory(e.target.value)}
                          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/30"
                        >
                          <option value="all">All</option>
                          {CATEGORY_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {categoryLabel(c)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="ml-auto text-sm text-zinc-500">
                        Showing <span className="font-semibold text-zinc-800">{filteredComplaints.length}</span>{' '}
                        of {complaints.length}
                      </p>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[880px] text-left text-sm">
                          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            <tr>
                              <th className="px-4 py-3">Resident</th>
                              <th className="px-4 py-3">Issue</th>
                              <th className="px-4 py-3">Category</th>
                              <th className="px-4 py-3">Priority</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3">Assign</th>
                              <th className="px-4 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100">
                            {filteredComplaints.map((row) => {
                              const resident =
                                row.userId && typeof row.userId === 'object'
                                  ? `${row.userId.fullName || '—'} · ${row.userId.block || ''}`
                                  : '—';
                              const assignList = workersForComplaint(workers, row.category);
                              return (
                                <tr key={row._id} className="align-top hover:bg-zinc-50/80">
                                  <td className="px-4 py-3 text-xs text-zinc-600">
                                    <div className="max-w-[140px] font-medium text-zinc-800">{resident}</div>
                                    {row.userId?.email && (
                                      <div className="mt-0.5 truncate text-[11px] text-zinc-400">
                                        {row.userId.email}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <p className="max-w-xs text-zinc-800">{row.description}</p>
                                    <p className="mt-1 text-[11px] text-zinc-400">
                                      {row.createdAt
                                        ? new Date(row.createdAt).toLocaleString()
                                        : ''}
                                    </p>
                                  </td>
                                  <td className="px-4 py-3 text-xs font-medium text-zinc-700">
                                    {categoryLabel(row.category)}
                                  </td>
                                  <td className="px-4 py-3">
                                    <select
                                      value={row.priority}
                                      onChange={(e) =>
                                        patchComplaint(row._id, { priority: e.target.value }, 'Priority updated')
                                      }
                                      className="max-w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs font-medium"
                                    >
                                      {PRIORITY_OPTIONS.map((p) => (
                                        <option key={p} value={p}>
                                          {p}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="px-4 py-3">
                                    <select
                                      value={row.status}
                                      onChange={(e) =>
                                        patchComplaint(row._id, { status: e.target.value }, 'Status updated')
                                      }
                                      className="max-w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs font-medium"
                                    >
                                      {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s}>
                                          {s}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="px-4 py-3">
                                    <select
                                      value={row.assignedWorkerId?._id || row.assignedWorkerId || ''}
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        patchComplaint(
                                          row._id,
                                          { assignedWorkerId: v || null },
                                          v ? 'Worker assigned' : 'Assignment cleared',
                                        );
                                      }}
                                      className="max-w-[160px] rounded border border-zinc-200 bg-white px-2 py-1 text-xs"
                                    >
                                      <option value="">Unassigned</option>
                                      {assignList.map((w) => (
                                        <option key={w._id} value={w._id}>
                                          {w.name} ({tradeLabel(w.trade)})
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="px-4 py-3">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        patchComplaint(row._id, { status: 'Resolved' }, 'Marked resolved')
                                      }
                                      className="mb-1 block w-full rounded bg-teal-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-teal-500"
                                    >
                                      Mark resolved
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      {filteredComplaints.length === 0 && (
                        <p className="py-12 text-center text-sm text-zinc-500">No complaints match filters.</p>
                      )}
                    </div>
                  </div>
                )}

                {tab === 'users' && (
                  <div className="overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Block</th>
                          <th className="px-4 py-3">Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-zinc-50/80">
                            <td className="px-4 py-3 font-medium text-zinc-900">{u.fullName}</td>
                            <td className="px-4 py-3 text-zinc-600">{u.email}</td>
                            <td className="px-4 py-3 text-zinc-600">{u.block}</td>
                            <td className="px-4 py-3">
                              <select
                                value={u.role}
                                disabled={String(u._id) === String(me.id)}
                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50"
                                title={
                                  String(u._id) === String(me.id)
                                    ? 'Change your own role from another admin account'
                                    : ''
                                }
                              >
                                <option value="resident">Resident</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {tab === 'rules' && (
                  <div className="space-y-8">
                    <form
                      onSubmit={handleAddRule}
                      className="rounded-lg border border-zinc-300 bg-white p-6 shadow-sm"
                    >
                      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-zinc-800">
                        <Plus className="h-4 w-4 text-teal-600" strokeWidth={2} />
                        Add rule
                      </h2>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-xs font-semibold text-zinc-500">Title</label>
                          <input
                            value={newRule.title}
                            onChange={(e) => setNewRule((r) => ({ ...r, title: e.target.value }))}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/30"
                            placeholder="Short headline"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-zinc-500">Category</label>
                          <input
                            value={newRule.category}
                            onChange={(e) => setNewRule((r) => ({ ...r, category: e.target.value }))}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/30"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-xs font-semibold text-zinc-500">Description</label>
                          <textarea
                            value={newRule.description}
                            onChange={(e) => setNewRule((r) => ({ ...r, description: e.target.value }))}
                            rows={4}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/30"
                            placeholder="Full rule text"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                      >
                        Publish rule
                      </button>
                    </form>

                    <div className="space-y-3">
                      {rules.map((rule) => (
                        <div
                          key={rule._id}
                          className="rounded-lg border border-zinc-300 bg-white p-5 shadow-sm"
                        >
                          {editingRule?._id === rule._id ? (
                            <form onSubmit={handleSaveEditRule} className="space-y-3">
                              <input
                                value={editingRule.title}
                                onChange={(e) => setEditingRule((r) => ({ ...r, title: e.target.value }))}
                                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold"
                              />
                              <input
                                value={editingRule.category}
                                onChange={(e) => setEditingRule((r) => ({ ...r, category: e.target.value }))}
                                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                              />
                              <textarea
                                value={editingRule.description}
                                onChange={(e) => setEditingRule((r) => ({ ...r, description: e.target.value }))}
                                rows={4}
                                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingRule(null)}
                                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <h3 className="font-semibold text-zinc-900">{rule.title}</h3>
                                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
                                    {rule.category}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingRule({ ...rule })}
                                    className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-semibold hover:bg-zinc-50"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRule(rule._id)}
                                    className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                                  >
                                    <Trash2 className="h-3 w-3" strokeWidth={2} />
                                    Delete
                                  </button>
                                </div>
                              </div>
                              <p className="mt-3 text-sm leading-relaxed text-zinc-600">{rule.description}</p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 'workers' && (
                  <div className="grid gap-8 lg:grid-cols-3">
                    <form
                      onSubmit={handleAddWorker}
                      className="rounded-lg border border-zinc-300 bg-white p-6 shadow-sm lg:col-span-1"
                    >
                      <h2 className="mb-4 text-sm font-bold text-zinc-800">Register worker</h2>
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-zinc-500">Name</label>
                          <input
                            value={newWorker.name}
                            onChange={(e) => setNewWorker((w) => ({ ...w, name: e.target.value }))}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-zinc-500">Phone</label>
                          <input
                            value={newWorker.phone}
                            onChange={(e) => setNewWorker((w) => ({ ...w, phone: e.target.value }))}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-zinc-500">Trade</label>
                          <select
                            value={newWorker.trade}
                            onChange={(e) => setNewWorker((w) => ({ ...w, trade: e.target.value }))}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                          >
                            {TRADE_OPTIONS.map((t) => (
                              <option key={t} value={t}>
                                {tradeLabel(t)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="w-full rounded-md bg-teal-600 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                        >
                          Add worker
                        </button>
                      </div>
                    </form>

                    <div className="overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-sm lg:col-span-2">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Trade</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {workers.map((w) => (
                            <tr key={w._id} className="hover:bg-zinc-50/80">
                              <td className="px-4 py-3 font-medium text-zinc-900">{w.name}</td>
                              <td className="px-4 py-3 text-zinc-600">{w.phone}</td>
                              <td className="px-4 py-3 text-zinc-700">{tradeLabel(w.trade)}</td>
                              <td className="px-4 py-3">
                                <button
                                  type="button"
                                  onClick={() => toggleWorkerActive(w)}
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    w.isActive
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-zinc-200 text-zinc-600'
                                  }`}
                                >
                                  {w.isActive ? 'Active' : 'Inactive'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {workers.length === 0 && (
                        <p className="py-10 text-center text-sm text-zinc-500">No workers yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
