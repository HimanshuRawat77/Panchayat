import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Mic,
  Bot,
  Brain,
  BookOpen,
  Users,
  Megaphone,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import PricingSection from '@/components/ui/pricing-section';

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const stats = [
  { value: '50k+', label: 'ACTIVE RESIDENTS' },
  { value: '1M+', label: 'COMPLAINTS MANAGED' },
  { value: '500+', label: 'SOCIETIES ONBOARDED' },
];

const features = [
  {
    Icon: Mic,
    title: 'Voice Complaint System',
    description:
      'Residents can register complaints using voice memos. Our AI transcribes and categorizes them automatically for the maintenance team.',
    accentBg: 'bg-amber-100 dark:bg-[#C8A45D]/10',
    accentText: 'text-amber-700 dark:text-[#E0C27A]',
  },
  {
    Icon: Brain,
    title: 'AI Summarization',
    description:
      'Long community threads condensed into quick, actionable insights for the management committee.',
    accentBg: 'bg-orange-100 dark:bg-[#8B6B4A]/15',
    accentText: 'text-orange-700 dark:text-[#C8A45D]',
  },
  {
    Icon: Bot,
    title: 'AI Assistant',
    description:
      '24/7 support for residents to check their financial dues or voice amenities.',
    accentBg: 'bg-amber-100 dark:bg-[#C8A45D]/10',
    accentText: 'text-amber-700 dark:text-[#E0C27A]',
  },
  {
    Icon: BookOpen,
    title: 'Society Rulebook',
    description:
      'A digital, searchable archive of your society\'s bylaws and regulations, updated in real-time.',
    accentBg: 'bg-stone-100 dark:bg-[#6B4F3A]/15',
    accentText: 'text-stone-600 dark:text-[#B8AEA3]',
  },
  {
    Icon: Users,
    title: 'Community Feed',
    description:
      'Keep engagement high with interactive polls and posts.',
    accentBg: 'bg-amber-100 dark:bg-[#8B6B4A]/15',
    accentText: 'text-amber-700 dark:text-[#C8A45D]',
  },
  {
    Icon: Megaphone,
    title: 'Notice Board',
    description:
      'Digital broadcasts that reach every resident via push notifications.',
    accentBg: 'bg-orange-100 dark:bg-[#C8A45D]/10',
    accentText: 'text-orange-700 dark:text-[#E0C27A]',
  },
];

/* ------------------------------------------------------------------ */
/*  Animation Variants                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white font-sans transition-colors duration-300 selection:bg-amber-100 dark:bg-[#151210] dark:selection:bg-[#C8A45D]/20 dark:selection:text-[#F5F1EA]">
      {/* ── Ambient Background ──────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {/* Dark mode grid */}
        <div className="absolute inset-0 bg-grid opacity-0 dark:opacity-20" />
        {/* Light mode: subtle warm tint at top */}
        <div
          className="absolute left-1/2 top-0 h-[500px] w-full -translate-x-1/2 dark:hidden"
          style={{
            background:
              'radial-gradient(ellipse at center top, rgba(200, 164, 93, 0.06), transparent 60%)',
          }}
        />
        {/* Dark mode: warm golden glow top */}
        <div
          className="absolute left-1/2 top-0 hidden h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/4 dark:block"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(200, 164, 93, 0.07), transparent 70%)',
          }}
        />
        {/* Dark mode: subtle bronze glow bottom-right */}
        <div
          className="absolute bottom-0 right-0 hidden h-[400px] w-[600px] dark:block"
          style={{
            background:
              'radial-gradient(ellipse at bottom right, rgba(139, 107, 74, 0.06), transparent 70%)',
          }}
        />
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="relative z-10">
        <Navbar />

        {/* ════════════════════════════════════════════════════════ */}
        {/*  HERO SECTION                                            */}
        {/* ════════════════════════════════════════════════════════ */}
        <section className="relative px-4 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40">
          <div className="mx-auto max-w-[1440px]">
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge */}
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-amber-800 backdrop-blur-sm dark:border-[#C8A45D]/30 dark:bg-[#C8A45D]/8 dark:text-[#E0C27A]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8A45D]" />
                Modern Management Platform
              </Motion.div>

              {/* Headline */}
              <Motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="text-balance text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-slate-900 dark:text-[#F5F1EA] sm:text-5xl md:text-[48px] md:leading-[56px]"
              >
                The AI-Powered Operating{' '}
                <br className="hidden md:block" />
                System for Modern Housing{' '}
                <br className="hidden md:block" />
                Societies
              </Motion.h1>

              {/* Subtext */}
              <Motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.16 }}
                className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-[#B8AEA3]"
              >
                Manage complaints, announcements, residents, and society operations, from
                one intelligent platform.
              </Motion.p>

              {/* CTAs */}
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.24 }}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Link to="/signup" className="btn-primary px-8 py-3.5 text-base">
                  Start Free Trial
                </Link>
                <a
                  href="#features"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-slate-900 dark:text-[#B8AEA3] dark:hover:text-[#F5F1EA]"
                >
                  Book Demo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                </a>
              </Motion.div>
            </div>

            {/* Hero Image */}
            <Motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="relative mx-auto mt-16 max-w-5xl md:mt-20"
            >
              {/* Glow behind image */}
              <div
                className="pointer-events-none absolute inset-0 -z-10 translate-y-8 scale-[0.9]"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(200, 164, 93, 0.15), transparent 65%)',
                  filter: 'blur(60px)',
                }}
              />
              <img
                src="/Homepage.png"
                alt="Panchayat Dashboard Preview"
                className="w-full rounded-2xl border border-slate-200/80 shadow-xl dark:border-[#6B4F3A]/25 dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
              />
            </Motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════ */}
        {/*  STATS SECTION                                           */}
        {/* ════════════════════════════════════════════════════════ */}
        <section id="stats" className="relative px-4 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1440px]">
            <Motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-1 gap-12 sm:grid-cols-3 md:gap-8"
            >
              {stats.map((stat, i) => (
                <Motion.div
                  key={stat.label}
                  variants={fadeUp}
                  custom={i}
                  className="text-center"
                >
                  <div className="text-5xl font-bold tracking-tight text-slate-900 dark:text-[#F5F1EA] md:text-6xl">
                    {stat.value}
                  </div>
                  <p className="mt-3 font-label text-xs font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-[#B8AEA3]">
                    {stat.label}
                  </p>
                </Motion.div>
              ))}
            </Motion.div>
          </div>
        </section>

<<<<<<< HEAD
        {/* ════════════════════════════════════════════════════════ */}
        {/*  FEATURES SECTION                                        */}
        {/* ════════════════════════════════════════════════════════ */}
        <section id="features" className="relative px-4 py-20 md:px-12 md:py-28">
          {/* Section divider line */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(90%,600px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-[#6B4F3A]/20" />
=======
        <section id="flow" className="relative border-y border-slate-200/70 bg-slate-50/80 px-4 py-24 dark:border-slate-800/80 dark:bg-slate-950/40 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400">
                Flow
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                From first login to closed ticket
              </h2>
            </div>
>>>>>>> 7733c2ee97001110028121bf1f50363d3b5ef7bc

          <div className="mx-auto max-w-[1440px]">
            {/* Section Header */}
            <Motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16 text-center md:mb-20"
            >
              <h2 className="text-3xl font-semibold tracking-[-0.01em] text-slate-900 dark:text-[#F5F1EA] md:text-4xl">
                Precision-Engineered Features
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-slate-500 dark:text-[#B8AEA3]">
                Everything you need to automate your premium residential ecosystem.
              </p>
            </Motion.div>

            {/* Feature Cards Grid */}
            <Motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              className="grid gap-6 sm:grid-cols-2"
            >
              {features.map((feature, i) => (
                <Motion.div
                  key={feature.title}
                  variants={fadeUp}
                  custom={i}
                  className="group rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-slate-300 hover:shadow-lg dark:border-[#6B4F3A]/20 dark:bg-[#221C18] dark:hover:border-[#8B6B4A]/35 md:p-10"
                >
                  {/* Icon */}
                  <div
                    className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.accentBg}`}
                  >
                    <feature.Icon
                      className={`h-6 w-6 ${feature.accentText}`}
                      strokeWidth={1.75}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-[#F5F1EA]">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-[#B8AEA3]">
                    {feature.description}
                  </p>
                </Motion.div>
              ))}
            </Motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════ */}
        {/*  PRICING SECTION                                         */}
        {/* ════════════════════════════════════════════════════════ */}
        <PricingSection />

        {/* ════════════════════════════════════════════════════════ */}
        {/*  FOOTER                                                  */}
        {/* ════════════════════════════════════════════════════════ */}
        <footer className="border-t border-slate-200 bg-slate-50 px-4 pb-8 pt-16 transition-colors duration-300 dark:border-[#6B4F3A]/15 dark:bg-[#151210] md:px-12">
          <div className="mx-auto max-w-[1440px]">
            {/* Top row */}
            <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-8">
              {/* Brand */}
              <div>
                <Link to="/" className="flex items-center gap-2.5">
                  <img
                    src="/Panchayat.png"
                    alt="Panchayat"
                    className="h-8 w-8 rounded-lg"
                  />
                  <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-[#F5F1EA]">
                    Panchayat
                  </span>
                </Link>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-[#B8AEA3]">
                  Redefining the blueprint for premium residential
                  living through artificial intelligence and thoughtful
                  design.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-label text-xs font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-[#B8AEA3]">
                  Product
                </h4>
                <ul className="mt-4 space-y-3">
                  <li>
                    <a
                      href="#features"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-[#B8AEA3] dark:hover:text-[#F5F1EA]"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-[#B8AEA3] dark:hover:text-[#F5F1EA]"
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-label text-xs font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-[#B8AEA3]">
                  Company
                </h4>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link
                      to="/about"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-[#B8AEA3] dark:hover:text-[#F5F1EA]"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-[#B8AEA3] dark:hover:text-[#F5F1EA]"
                    >
                      Careers
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-label text-xs font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-[#B8AEA3]">
                  Legal
                </h4>
                <ul className="mt-4 space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-[#B8AEA3] dark:hover:text-[#F5F1EA]"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-[#B8AEA3] dark:hover:text-[#F5F1EA]"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-16 border-t border-slate-200 pt-6 dark:border-[#6B4F3A]/15">
              <p className="text-xs text-slate-400 dark:text-[#B8AEA3]">
                © 2024 Panchayat. All Reserved for IYS & their partners.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
