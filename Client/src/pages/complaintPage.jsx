import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  Building2,
  ChevronLeft,
  ClipboardList,
  LayoutDashboard,
  Loader2,
  MessageSquarePlus,
  Wrench,
  Zap,
  Hammer,
  MoreHorizontal,
  Camera,
  Upload,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { createComplaint, getMyComplaints } from '../services/complaintService';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';


const categoryMeta = {
  plumber: { label: 'Plumber', Icon: Wrench },
  electrician: { label: 'Electrician', Icon: Zap },
  carpenter: { label: 'Carpenter', Icon: Hammer },
  other: { label: 'Other', Icon: MoreHorizontal },
};

const statusStyle = {
  Pending: 'bg-amber-500/15 text-amber-800 dark:text-amber-200',
  'In progress': 'bg-indigo-500/15 text-indigo-700 dark:text-[#C8A45D]',
  Resolved: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-200',
};

const priorityMeta = {
  Low: { label: 'Regular', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  Medium: { label: 'Important', color: 'bg-amber-500/15 text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
  High: { label: 'Urgent', color: 'bg-rose-500/15 text-rose-700 dark:text-rose-400', dot: 'bg-rose-500' },
};

const ComplaintPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [priority, setPriority] = useState('Medium');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchComplaints = async () => {
    try {
      const data = await getMyComplaints();
      setComplaints(data);
    } catch (error) {
      toast.error(error.message || 'Unable to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchComplaints();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadstart = () => setUploading(true);
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImage(reader.result); // In production, upload to Cloudinary and store URL
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage('');
    setImagePreview(null);
  };

  const stats = useMemo(() => {
    const pending = complaints.filter((item) => item.status === 'Pending').length;
    const inProgress = complaints.filter((item) => item.status === 'In progress').length;
    const resolved = complaints.filter((item) => item.status === 'Resolved').length;

    return {
      total: complaints.length,
      pending,
      inProgress,
      resolved,
    };
  }, [complaints]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please describe your complaint');
      return;
    }

    setSubmitting(true);
    try {
      await createComplaint({ 
        description: description.trim(), 
        category, 
        priority, 
        image
      });
      toast.success('Complaint submitted successfully');
      setDescription('');
      setCategory('other');
      setPriority('Medium');
      setImage('');
      setImagePreview(null);
      await fetchComplaints();
    } catch (error) {
      toast.error(error.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 dark:bg-[#151210] dark:text-[#F5F1EA]">
      <Toaster position="top-center" />

      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-400/10 blur-[100px] dark:bg-[#C8A45D]/10" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-400/10 blur-[110px] dark:bg-[#6B4F3A]/10" />
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-[#6B4F3A] dark:bg-[#151210]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-[#B8AEA3] dark:hover:bg-[#221C18] dark:hover:text-[#F5F1EA]"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            <LayoutDashboard className="h-4 w-4 sm:hidden" strokeWidth={2} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-slate-900 dark:text-[#F5F1EA]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25">
              <Building2 className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
            </span>
            <span className="hidden font-bold tracking-tight sm:inline">Panchayat</span>
          </Link>
          <div className="flex items-center justify-end w-20 sm:w-24">
            <button
              type="button"
              onClick={toggleTheme}
              className="relative rounded-xl border border-slate-200/90 bg-white/90 p-2 text-slate-600 transition hover:border-slate-300 hover:bg-white dark:border-[#6B4F3A] dark:bg-[#221C18]/90 dark:text-[#F5F1EA] dark:hover:border-[#C8A45D]"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" strokeWidth={2} /> : <Sun className="h-4 w-4" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-[#C8A45D]">
            Resident support
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Complaints center</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-[#B8AEA3]">
            Raise issues quickly and track progress from one place.
          </p>
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Pending', value: stats.pending },
            { label: 'In progress', value: stats.inProgress },
            { label: 'Resolved', value: stats.resolved },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-card backdrop-blur-md dark:border-[#6B4F3A] dark:bg-[#221C18] dark:shadow-none"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#B8AEA3]">
                {item.label}
              </p>
              <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-indigo-200/50 bg-white/90 p-6 shadow-card backdrop-blur-md dark:border-[#6B4F3A] dark:bg-[#221C18] dark:shadow-none md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25">
                  <MessageSquarePlus className="h-5 w-5" strokeWidth={2} />
                </span>
                <h2 className="text-xl font-bold tracking-tight">Raise a complaint</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#B8AEA3]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-[#6B4F3A] dark:bg-[#151210] dark:text-[#F5F1EA]"
                  >
                    {Object.entries(categoryMeta).map(([value, meta]) => (
                      <option key={value} value={value}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#B8AEA3]">
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the issue clearly (location, urgency, helpful details)."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-[#6B4F3A] dark:bg-[#151210] dark:text-[#F5F1EA]"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#B8AEA3]">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(priorityMeta).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border py-2.5 transition ${
                          priority === p
                            ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20 dark:border-[#C8A45D] dark:bg-[#C8A45D]/10'
                            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-[#6B4F3A] dark:bg-[#151210]'
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${priorityMeta[p].dot}`} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{priorityMeta[p].label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#B8AEA3]">
                    Upload Proof (Optional)
                  </label>
                  
                  {imagePreview ? (
                    <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-[#6B4F3A]">
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute right-2 top-2 rounded-lg bg-rose-500 p-1.5 text-white shadow-lg transition hover:bg-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-6 transition hover:border-indigo-400 hover:bg-indigo-50/20 dark:border-[#6B4F3A] dark:bg-[#151210]/30 dark:hover:border-[#C8A45D]/50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-[#221C18]">
                        {uploading ? <Loader2 className="h-5 w-5 animate-spin text-indigo-500" /> : <Upload className="h-5 w-5 text-indigo-500" />}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-700 dark:text-[#F5F1EA]">
                          {uploading ? 'Uploading...' : 'Click to upload proof'}
                        </p>
                        <p className="text-[10px] text-slate-500">JPG, PNG (max 5MB)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={uploading} />
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow-sm transition hover:shadow-glow disabled:opacity-60 dark:bg-gradient-to-r dark:from-[#C8A45D] dark:to-[#6B4F3A] dark:text-[#151210]"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />}
                  {submitting ? 'Submitting...' : 'Submit complaint'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-card backdrop-blur-md dark:border-[#6B4F3A] dark:bg-[#221C18] dark:shadow-none md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-[#C8A45D]">
                  <ClipboardList className="h-5 w-5" strokeWidth={2} />
                </span>
                <h2 className="text-xl font-bold tracking-tight">My complaints</h2>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-10 text-slate-500 dark:text-[#B8AEA3]">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading complaints...
                </div>
              ) : complaints.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-300/80 bg-slate-50/80 px-5 py-8 text-center text-sm text-slate-500 dark:border-[#6B4F3A] dark:bg-[#151210] dark:text-[#B8AEA3]">
                  No complaints submitted yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {complaints.map((item) => {
                    const meta = categoryMeta[item.category] || categoryMeta.other;
                    const Icon = meta.Icon;
                    return (
                      <article
                        key={item._id}
                        className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 transition hover:border-indigo-200 hover:bg-white dark:border-[#6B4F3A] dark:bg-[#151210] dark:hover:border-[#C8A45D]"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyle[item.status] || statusStyle.Pending}`}>
                            {item.status}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${priorityMeta[item.priority]?.color || priorityMeta.Medium.color}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${priorityMeta[item.priority]?.dot || priorityMeta.Medium.dot}`} />
                            {priorityMeta[item.priority]?.label || 'Important'}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-lg bg-slate-200/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-700 dark:bg-[#221C18] dark:text-[#F5F1EA]">
                            <Icon className="h-3 w-3" />
                            {meta.label}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-[#F5F1EA]">{item.description}</p>

                        {item.image && (
                          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-[#6B4F3A]">
                            <img src={item.image} alt="Proof" className="max-h-60 w-full object-cover" />
                          </div>
                        )}
                        <p className="mt-3 text-xs text-slate-500 dark:text-[#B8AEA3]">
                          Submitted {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ComplaintPage;