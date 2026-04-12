import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  ClipboardList,
  Mic,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import { SparklesCore } from '@/components/ui/sparkles';
import PricingSection from '@/components/ui/pricing-section';
import { useTheme } from '../context/ThemeContext';

const features = [
  {
    Icon: Mic,
    title: 'Voice & text complaints',
    description: 'Report issues naturally—speech or typing—with context-aware intake.',
  },
  {
    Icon: Bot,
    title: 'AI assistant',
    description: 'Instant answers on rules, timings, amenities, and society policies.',
  },
  {
    Icon: ClipboardList,
    title: 'Live tracking',
    description: 'Transparent status from submission to resolution, without chasing.',
  },
  {
    Icon: BookOpen,
    title: 'Digital rule book',
    description: 'Always-on access to bylaws, notices, and guidelines in one place.',
  },
  {
    Icon: Bell,
    title: 'Smart notifications',
    description: 'Maintenance windows, announcements, and updates that actually matter.',
  },
  {
    Icon: Zap,
    title: 'Faster resolution',
    description: 'Routing to the right vendor—electrician, plumber, or facility—quickly.',
  },
];

const steps = [
  { step: '01', title: 'Onboard', desc: 'Register with unit details and verified access.' },
  { step: '02', title: 'Report', desc: 'Raise a ticket by voice or text in under a minute.' },
  { step: '03', title: 'Resolve', desc: 'Track progress and close the loop with confidence.' },
];

const Home = () => {
  const { theme } = useTheme();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f8fafc] font-sans transition-colors duration-500 selection:bg-indigo-500/20 selection:text-indigo-950 dark:bg-[#070a12] dark:selection:bg-indigo-500/30 dark:selection:text-white">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <SparklesCore
          id="panchayat-home-sparkles"
          background="transparent"
          minSize={0.3}
          maxSize={1.05}
          particleDensity={theme === 'dark' ? 85 : 48}
          className="h-full w-full"
          particleColor={theme === 'dark' ? '#a5b4fc' : '#6366f1'}
          speed={theme === 'dark' ? 0.9 : 0.55}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f8fafc]/92 via-[#f8fafc]/70 to-[#f8fafc]/95 dark:from-[#070a12]/90 dark:via-[#070a12]/55 dark:to-[#070a12]/92" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-indigo-500/[0.07] via-transparent to-transparent dark:from-indigo-400/[0.09]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <section className="relative px-4 pb-28 pt-40 md:pb-36 md:pt-44">
          <div className="pointer-events-none absolute left-1/2 top-24 h-px w-[min(90%,42rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent dark:via-indigo-400/25" />
          <div className="pointer-events-none absolute left-1/2 top-[5.5rem] h-4 w-[min(70%,28rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent blur-md dark:via-indigo-400/10" />

          <div className="mx-auto max-w-5xl text-center">
            <Motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700 shadow-sm backdrop-blur-md dark:border-indigo-500/25 dark:bg-slate-900/60 dark:text-indigo-200">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-300" strokeWidth={2} />
                Society operations
              </div>

              <h1 className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Run your society with{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400">
                  clarity and calm
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl">
                One refined workspace for complaints, rules, and resident communication—
                <span className="text-slate-800 dark:text-slate-300"> designed to feel as considered as the communities it serves.</span>
              </p>

              <div className="mt-12 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center">
                <Link to="/signup" className="group inline-flex">
                  <span className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-glow transition hover:shadow-glow-sm dark:shadow-indigo-950/50">
                    Get started
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200/90 bg-white/60 px-8 py-4 text-base font-semibold text-slate-800 shadow-card backdrop-blur-md transition hover:border-slate-300 hover:bg-white dark:border-slate-700/80 dark:bg-slate-900/50 dark:text-slate-100 dark:shadow-card-dark dark:hover:border-slate-600 dark:hover:bg-slate-900/70"
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-16 grid w-full max-w-2xl grid-cols-3 gap-6 border-t border-slate-200/80 pt-10 dark:border-slate-800/80">
                {[
                  { label: 'Faster triage', value: '3×' },
                  { label: 'Resident NPS', value: '4.9' },
                  { label: 'Uptime', value: '99.9%' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white md:text-3xl">
                      {item.value}
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-500">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </Motion.div>
          </div>
        </section>

        <section className="relative px-4 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400">
                Capabilities
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                Everything residents expect—nothing they have to figure out
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Polished surfaces, sensible defaults, and depth when you need it.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {features.map((feature, index) => (
                <Motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative z-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 p-7 shadow-card backdrop-blur-md transition-[box-shadow,border-color,transform,z-index] duration-300 ease-out hover:z-10 hover:border-violet-400/70 hover:shadow-xl hover:shadow-violet-500/20 dark:border-slate-800 dark:bg-slate-900/45 dark:shadow-card-dark dark:hover:border-violet-500/50 dark:hover:shadow-violet-600/15"
                >
                  <div
                    className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                    style={{
                      background:
                        'radial-gradient(100% 70% at 50% -10%, rgb(167 139 250 / 0.2), transparent 60%)',
                    }}
                  />
                  <div className="absolute -right-8 -top-8 z-[1] h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/10 to-violet-500/5 blur-2xl transition-opacity group-hover:opacity-100 dark:from-indigo-400/15" />
                  <div className="relative z-[2] flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-shadow duration-300 group-hover:shadow-violet-500/35">
                    <feature.Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="relative z-[2] mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="relative z-[2] mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </Motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative border-y border-slate-200/70 bg-slate-50/80 px-4 py-24 dark:border-slate-800/80 dark:bg-slate-950/40 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400">
                Flow
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                From first login to closed ticket
              </h2>
            </div>

            <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
              <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px md:block md:top-14">
                <div className="mx-auto h-px w-[calc(100%-8rem)] bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600" />
              </div>
              {steps.map((item, index) => (
                <Motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12, duration: 0.5 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/90 bg-white text-sm font-bold text-indigo-600 shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-indigo-300">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.desc}</p>
                </Motion.div>
              ))}
            </div>
          </div>
        </section>

        <PricingSection />

        <section className="px-4 py-24 md:py-28">
          <div className="mx-auto max-w-4xl">
            <Motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-700 p-10 text-center shadow-glow md:p-14 dark:border-indigo-500/30 dark:from-indigo-950 dark:via-violet-950 dark:to-fuchsia-950"
            >
              <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
              <ShieldCheck className="relative mx-auto mb-6 h-10 w-10 text-white/90" strokeWidth={1.5} />
              <h2 className="relative text-2xl font-bold tracking-tight text-white md:text-3xl">
                Ready for a calmer society inbox?
              </h2>
              <p className="relative mx-auto mt-4 max-w-lg text-sm leading-relaxed text-indigo-100 md:text-base">
                Join teams that replaced scattered WhatsApp threads with one premium hub.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
                >
                  Create account
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-white/90 underline-offset-4 transition hover:text-white hover:underline"
                >
                  Already registered? Sign in
                </Link>
              </div>
            </Motion.div>
          </div>
        </section>

        <footer className="border-t border-slate-200/80 bg-white/80 px-4 py-14 backdrop-blur-md dark:border-slate-800 dark:bg-[#070a12]/90">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 md:flex-row md:items-start">
            <div>
              <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Panchayat</div>
              <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                Society management with intention—built for residents and committees alike.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium text-slate-600 dark:text-slate-400">
              <a href="#" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
                Privacy
              </a>
              <a href="#" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
                Terms
              </a>
              <a href="#" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
                Contact
              </a>
            </div>
            <div className="text-center text-sm text-slate-500 dark:text-slate-500 md:text-right">
              © 2026 Panchayat
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
