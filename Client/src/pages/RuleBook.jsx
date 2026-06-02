import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Bookmark,
  Building2,
  Search,
  ShieldAlert,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getRules } from '../services/ruleService';

const IMPORTANT_KEYWORDS = ['important', 'strict', 'mandatory', 'fine', 'safety', 'security'];

const RuleBook = () => {
  const [rules, setRules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarks, setBookmarks] = useState({});

  useEffect(() => {
    const loadRules = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getRules();
        setRules(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load rules');
      } finally {
        setLoading(false);
      }
    };

    loadRules();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(
      rules
        .map((rule) => rule.category?.trim())
        .filter(Boolean)
    );
    return ['All', ...Array.from(unique)];
  }, [rules]);

  const filteredRules = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return rules.filter((rule) => {
      const categoryMatch =
        selectedCategory === 'All' ||
        (rule.category || '').toLowerCase() === selectedCategory.toLowerCase();

      const title = (rule.title || '').toLowerCase();
      const description = (rule.description || '').toLowerCase();
      const searchMatch = !query || title.includes(query) || description.includes(query);

      return categoryMatch && searchMatch;
    });
  }, [rules, searchTerm, selectedCategory]);

  const isNewRule = (createdAt) => {
    if (!createdAt) return false;
    const created = new Date(createdAt).getTime();
    if (Number.isNaN(created)) return false;
    const ageInDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
    return ageInDays <= 7;
  };

  const isImportantRule = (rule) => {
    const content = `${rule.title || ''} ${rule.description || ''}`.toLowerCase();
    return IMPORTANT_KEYWORDS.some((word) => content.includes(word));
  };

  const toggleBookmark = (id) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 dark:bg-[#151210] dark:text-[#F5F1EA]">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-28 top-10 h-80 w-80 rounded-full bg-indigo-400/10 blur-[95px] dark:bg-[#C8A45D]/10" />
        <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-violet-400/10 blur-[110px] dark:bg-[#6B4F3A]/10" />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-14 pt-28 md:pb-20 md:pt-32">
        <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-card backdrop-blur-md dark:border-[#6B4F3A] dark:bg-[#221C18] dark:shadow-card-dark md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
                <BookOpen className="h-7 w-7 text-indigo-600 dark:text-[#C8A45D]" strokeWidth={2} />
                <span>📘 Society Rule Book</span>
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-[#B8AEA3]">
                Find all important rules and guidelines for your society
              </p>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-[#6B4F3A] dark:bg-[#221C18] dark:text-[#F5F1EA] dark:hover:bg-[#6B4F3A]"
            >
              <Building2 className="h-4 w-4" />
              Dashboard
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-[#B8AEA3]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-[#6B4F3A] dark:bg-[#221C18] dark:text-[#F5F1EA] dark:focus:border-[#C8A45D] dark:focus:ring-[#C8A45D]/10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                      active
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 dark:from-[#C8A45D] dark:to-[#9A7B4F] dark:text-[#151210] dark:shadow-[#C8A45D]/25'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-[#6B4F3A] dark:bg-[#221C18] dark:text-[#B8AEA3] dark:hover:bg-[#6B4F3A] dark:hover:text-[#F5F1EA]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-6">
          {loading ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-10 text-center text-sm font-medium text-slate-500 shadow-card dark:border-[#6B4F3A] dark:bg-[#221C18] dark:text-[#B8AEA3]">
              Loading rules...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-8 text-center text-sm font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-10 text-center shadow-card dark:border-[#6B4F3A] dark:bg-[#221C18]">
              <p className="text-4xl">📭</p>
              <p className="mt-3 text-base font-semibold text-slate-700 dark:text-[#F5F1EA]">No rules found</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-[#B8AEA3]">
                Try a different search or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredRules.map((rule) => {
                const important = isImportantRule(rule);
                const newRule = isNewRule(rule.createdAt);

                return (
                  <article
                    key={rule._id}
                    className={`rounded-2xl border bg-white/90 p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#221C18] ${
                      important
                        ? 'border-amber-200 dark:border-[#C8A45D]/50'
                        : 'border-slate-200/80 dark:border-[#6B4F3A]'
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F1EA]">{rule.title}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700 dark:bg-[#6B4F3A]/30 dark:text-[#C8A45D]">
                            {rule.category || 'General'}
                          </span>
                          {newRule && (
                            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                              New
                            </span>
                          )}
                          {important && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                              <ShieldAlert className="h-3.5 w-3.5" />
                              Important
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(rule._id)}
                        className={`rounded-lg p-2 transition ${
                          bookmarks[rule._id]
                            ? 'bg-indigo-500/15 text-indigo-700 dark:bg-[#6B4F3A]/50 dark:text-[#C8A45D]'
                            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-[#B8AEA3] dark:hover:bg-[#6B4F3A]/50 dark:hover:text-[#F5F1EA]'
                        }`}
                        aria-label="Bookmark rule"
                      >
                        <Bookmark className="h-4.5 w-4.5" fill={bookmarks[rule._id] ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-600 dark:text-[#B8AEA3]">
                      {rule.description}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default RuleBook;
