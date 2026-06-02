import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Bot,
  Building2,
  Globe,
  Lightbulb,
  Megaphone,
  Mic,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const sections = [
  {
    id: 'problem',
    title: 'The problem',
    subtitle: 'Why societies feel chaotic',
    Icon: Target,
    accent: 'from-rose-500/15 to-orange-500/10 text-rose-600 dark:text-[#C8A45D]',
    body: 'Water leaks, electrical faults, and slow maintenance pile up. Complaints live in chats and calls—hard to track. Notices and rules scatter across notice boards and PDFs, so residents miss what matters.',
  },
  {
    id: 'solution',
    title: 'Our solution',
    subtitle: 'One calm operating system',
    Icon: Lightbulb,
    accent: 'from-amber-500/15 to-yellow-500/10 text-amber-600 dark:text-[#C8A45D]',
    body: 'Panchayat unifies voice and text complaints, AI summarization, and a management dashboard. Everyone sees status in one place—less back-and-forth, faster resolution, fewer dropped threads.',
  },
  {
    id: 'vision',
    title: 'Our vision',
    subtitle: 'Smarter, kinder communities',
    Icon: Globe,
    accent: 'from-sky-500/15 to-indigo-500/10 text-sky-600 dark:text-[#C8A45D]',
    body: 'We want every society to feel organized and heard: clearer communication, fair processes, and problems that move to “resolved” without the stress.',
  },
  {
    id: 'future',
    title: 'What’s next',
    subtitle: 'Roadmap we’re building toward',
    Icon: TrendingUp,
    accent: 'from-violet-500/15 to-fuchsia-500/10 text-violet-600 dark:text-[#C8A45D]',
    body: 'Native mobile apps, maintenance payments, stronger regional language support, and deeper AI—so the platform keeps pace with how your society actually works.',
  },
];

const highlights = [
  { text: 'Voice complaints — speak, don’t scramble', Icon: Mic },
  { text: 'AI summarization & assistant', Icon: Bot },
  { text: 'Live complaint tracking', Icon: TrendingUp },
  { text: 'Digital notice board', Icon: Megaphone },
  { text: 'Society rule book', Icon: BookOpen },
  { text: 'To-let & property listings', Icon: Building2 },
  { text: 'Quick services: plumber, electrician, carpenter', Icon: Wrench },
  { text: 'Resident & committee tools', Icon: Users },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f8fafc] font-sans text-slate-900 dark:bg-[#151210] dark:text-[#F5F1EA]">
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-indigo-400/12 blur-[100px] dark:bg-[#6B4F3A]/20" />
        <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-violet-400/10 blur-[110px] dark:bg-[#C8A45D]/15" />
        <div
          className="absolute left-1/2 top-1/3 h-[40vh] w-[80%] -translate-x-1/2 opacity-30 dark:opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center top, rgb(99 102 241 / 0.2), transparent 65%)',
          }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />

        <header className="px-4 pb-16 pt-28 md:pb-24 md:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <Motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700 shadow-sm backdrop-blur-md dark:border-[#6B4F3A]/50 dark:bg-[#221C18]/60 dark:text-[#C8A45D]"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" strokeWidth={2} />
              Our story
            </Motion.div>
            <Motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl"
            >
              About{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-[#C8A45D] dark:via-[#C8A45D] dark:to-[#6B4F3A]">
                Panchayat
              </span>
            </Motion.h1>
            <Motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600 dark:text-[#B8AEA3]"
            >
              A refined society platform for residents and committees—complaints, notices, rules,
              and help in one place, without the noise of scattered chats and missed updates.
            </Motion.p>
          </div>
        </header>

        <section className="px-4 pb-20 md:pb-28">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
            {sections.map((block, i) => (
              <Motion.article
                key={block.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-card backdrop-blur-md transition-[box-shadow,border-color] duration-300 hover:z-10 hover:border-violet-400/60 hover:shadow-xl hover:shadow-violet-500/15 dark:border-[#6B4F3A] dark:bg-[#221C18]/50 dark:shadow-card-dark dark:hover:border-[#C8A45D]/40 dark:hover:shadow-[#C8A45D]/10 md:p-9"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(90% 60% at 0% 0%, rgb(167 139 250 / 0.12), transparent 55%)',
                  }}
                />
                <div
                  className={`relative z-[1] mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${block.accent} ring-1 ring-inset ring-black/5 dark:ring-[#6B4F3A]/50`}
                >
                  <block.Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <p className="relative z-[1] text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#B8AEA3]">
                  {block.subtitle}
                </p>
                <h2 className="relative z-[1] mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F1EA]">
                  {block.title}
                </h2>
                <p className="relative z-[1] mt-4 text-sm leading-relaxed text-slate-600 dark:text-[#B8AEA3] md:text-base">
                  {block.body}
                </p>
              </Motion.article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200/70 bg-slate-50/80 px-4 py-20 dark:border-[#6B4F3A]/80 dark:bg-[#151210]/40 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:text-[#C8A45D]">
                Platform
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                What you get in one workspace
              </h2>
              <p className="mt-3 text-slate-600 dark:text-[#B8AEA3]">
                Built for daily society operations—not a generic chat app with extras bolted on.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((row, index) => (
                <Motion.div
                  key={row.text}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group flex gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition-[box-shadow,border-color] duration-300 hover:border-violet-400/55 hover:shadow-lg hover:shadow-violet-500/10 dark:border-[#6B4F3A] dark:bg-[#221C18]/60 dark:hover:border-[#C8A45D]/35 dark:hover:shadow-[#C8A45D]/10"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20 transition group-hover:shadow-violet-500/30">
                    <row.Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <p className="text-sm font-medium leading-snug text-slate-800 dark:text-[#F5F1EA]">
                    {row.text}
                  </p>
                </Motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 md:py-24">
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-700 p-10 text-center shadow-glow md:p-12 dark:border-[#6B4F3A] dark:from-[#221C18] dark:via-[#151210] dark:to-[#221C18]"
          >
            <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
            <Building2 className="relative mx-auto mb-5 h-10 w-10 text-white/90" strokeWidth={1.5} />
            <h2 className="relative text-2xl font-bold text-white md:text-3xl">
              Ready to run your society from one place?
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-sm text-indigo-100 md:text-base">
              See pricing, start a trial, or sign in if your committee already uses Panchayat.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
              >
                Get started
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
              <Link
                to="/"
                className="text-sm font-semibold text-white/90 underline-offset-4 transition hover:text-white hover:underline"
              >
                Back to home
              </Link>
            </div>
          </Motion.div>
        </section>

        <footer className="border-t border-slate-200/80 bg-white/80 px-4 py-10 text-center text-sm text-slate-500 backdrop-blur-md dark:border-[#6B4F3A] dark:bg-[#151210]/90 dark:text-[#B8AEA3]">
          © {new Date().getFullYear()} Panchayat · Built for better living together
        </footer>
      </div>
    </div>
  );
}
