import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  Building2,
  Camera,
  ChevronLeft,
  LayoutDashboard,
  Loader2,
  LogOut,
  UserRound,
} from 'lucide-react';
import API_BASE_URL from '../config';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';


const Profile = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setPreviewImage(data.avatar);
        } else {
          toast.error('Session expired. Please sign in again.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be under 5 MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewImage(base64String);
        setUser({ ...user, avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Profile updated');
        setEditMode(false);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Network error. Try again.');
      console.error('Update error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const fields = [
    { label: 'Full name', name: 'fullName' },
    { label: 'Phone', name: 'phoneNumber' },
    { label: 'Email', name: 'email' },
    { label: 'House no.', name: 'houseNumber' },
    { label: 'Block', name: 'block' },
    { label: 'Nationality', name: 'nationality' },
    { label: 'Religion', name: 'religion' },
    { label: 'Mode', name: 'subscriptionMode', disabled: true },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 dark:bg-[#151210] dark:text-[#F5F1EA]">
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'dark:bg-[#221C18] dark:text-[#F5F1EA]',
        }}
      />

      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-indigo-400/10 blur-[100px] dark:bg-[#C8A45D]/12" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-400/10 blur-[110px] dark:bg-[#6B4F3A]/10" />
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-[#6B4F3A]/80 dark:bg-[#151210]/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3.5">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-[#B8AEA3] dark:hover:bg-[#221C18] dark:hover:text-[#F5F1EA]"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            <LayoutDashboard className="h-4 w-4 sm:hidden" strokeWidth={2} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-900 dark:text-[#F5F1EA]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 dark:from-[#C8A45D] dark:to-[#6B4F3A] dark:text-[#151210] dark:shadow-[#C8A45D]/25">
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

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-10 md:py-14">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-[#C8A45D]">
            Account
          </p>
          <h1 className="mt-2 flex items-center justify-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
            <UserRound className="h-7 w-7 text-indigo-600 dark:text-[#C8A45D]" strokeWidth={1.75} />
            Your profile
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-[#B8AEA3]">
            Details stay in sync with your society dashboard.
          </p>
        </div>

        <div data-tour="profile" className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-card backdrop-blur-md dark:border-[#6B4F3A] dark:bg-[#221C18]/90 dark:shadow-card-dark md:p-10">
          <div className="mb-10 flex flex-col items-center">
            <div className="relative">
              <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-slate-100 to-slate-200 shadow-xl ring-2 ring-indigo-500/20 dark:border-[#221C18] dark:from-[#221C18] dark:to-[#151210] dark:ring-[#C8A45D]/30">
                {previewImage && (previewImage.startsWith('data') || previewImage.startsWith('http')) ? (
                  <img src={previewImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-5xl opacity-40">{user.avatar || '👤'}</span>
                )}
              </div>
              {editMode && (
                <label className="absolute bottom-1 right-1 flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 p-3 text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 dark:from-[#C8A45D] dark:to-[#6B4F3A] dark:text-[#151210] dark:shadow-[#C8A45D]/30">
                  <Camera className="h-5 w-5" strokeWidth={2} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
            <p className="mt-4 text-xs font-medium text-slate-500 dark:text-[#B8AEA3]">
              {previewImage ? 'Photo active' : 'No photo set'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2 md:col-span-1">
                <label
                  htmlFor={field.name}
                  className="ml-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#B8AEA3]"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  type="text"
                  name={field.name}
                  value={user[field.name] || ''}
                  onChange={handleChange}
                  disabled={!editMode || field.disabled}
                  className={`w-full rounded-xl border px-4 py-3.5 text-sm font-medium outline-none transition ${
                    (!editMode || field.disabled)
                      ? 'cursor-not-allowed border-transparent bg-slate-50 text-slate-600 dark:bg-[#151210]/50 dark:text-[#B8AEA3]'
                      : 'border-indigo-200 bg-white text-slate-900 ring-indigo-500/0 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-[#6B4F3A] dark:bg-[#151210] dark:text-[#F5F1EA] dark:focus:border-[#C8A45D] dark:focus:ring-[#C8A45D]/10'
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {editMode ? (
              <button
                type="button"
                onClick={handleUpdate}
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-sm font-semibold text-white shadow-glow-sm transition hover:shadow-glow disabled:opacity-60 sm:min-w-[200px] dark:from-[#C8A45D] dark:to-[#6B4F3A] dark:text-[#151210]"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />}
                {loading ? 'Saving…' : 'Save changes'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 dark:border-[#C8A45D] dark:bg-[#C8A45D] dark:text-[#151210] dark:hover:bg-[#b39150] sm:min-w-[200px]"
              >
                Edit profile
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 rounded-2xl border border-slate-200/90 bg-white px-6 py-4 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 dark:border-[#6B4F3A] dark:bg-[#221C18] dark:text-[#F5F1EA] dark:hover:bg-[#6B4F3A]/40 sm:min-w-[160px]"
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/60"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} />
              Sign out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
