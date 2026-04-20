import React from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import {
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Brain,
  CheckCheck,
  Gem,
  Headphones,
  Home,
  LineChart,
  ListChecks,
  Megaphone,
  MessageSquare,
  Mic,
  RefreshCw,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const formatInr = (n) =>
  n === 0
    ? '₹0'
    : `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

const plans = [
  {
    id: 'free',
    title: 'Free Trial',
    duration: '1 month',
    priceAmount: 0,
    badge: 'Most popular for new users',
    badgeStyle: 'bg-emerald-500/15 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-500/30',
    description: 'Try core features with no commitment—perfect for evaluating Panchayat.',
    features: [
      { text: 'Voice complaint system', Icon: Mic },
      { text: 'AI complaint summarization', Icon: Brain },
      { text: 'Basic complaint tracking', Icon: ListChecks },
      { text: 'Limited AI assistant queries', Icon: MessageSquare },
      { text: 'Access to rule book', Icon: BookOpen },
    ],
    cta: 'Start free trial',
    ctaVariant: 'outline',
    recommended: false,
  },
  {
    id: 'starter',
    title: 'Starter plan',
    duration: '3 months',
    priceAmount: 15000,
    badge: null,
    description: 'Everything in free trial, plus tools for an active society.',
    features: [
      { text: 'Everything in free trial', Icon: CheckCheck },
      { text: 'Unlimited complaints', Icon: ListChecks },
      { text: 'Full AI assistant access', Icon: Bot },
      { text: 'Notice board system', Icon: Megaphone },
      { text: 'To-let & property listings', Icon: Home },
      { text: 'Basic analytics', Icon: BarChart3 },
    ],
    cta: 'Choose plan',
    ctaVariant: 'outline',
    recommended: false,
  },
  {
    id: 'growth',
    title: 'Growth plan',
    duration: '6 months',
    priceAmount: 28000,
    badge: 'Best value',
    badgeStyle: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-0',
    description: 'Priority handling and deeper insights for growing communities.',
    features: [
      { text: 'Everything in starter', Icon: CheckCheck },
      { text: 'Priority complaint handling', Icon: Zap },
      { text: 'Advanced analytics dashboard', Icon: LineChart },
      { text: 'Notifications system', Icon: Bell },
      { text: 'Community feed access', Icon: Users },
    ],
    cta: 'Get started',
    ctaVariant: 'default',
    recommended: true,
  },
  {
    id: 'premium',
    title: 'Premium plan',
    duration: '12 months',
    priceAmount: 55000,
    badge: null,
    description: 'White-glove support and roadmap alignment for large societies.',
    features: [
      { text: 'Everything in growth plan', Icon: CheckCheck },
      { text: 'Dedicated support', Icon: Headphones },
      { text: 'Custom features for society', Icon: Sparkles },
      { text: 'Data insights & reports', Icon: BarChart3 },
      { text: 'Future updates included', Icon: RefreshCw },
    ],
    cta: 'Go premium',
    ctaVariant: 'outline',
    recommended: false,
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function PricingSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-25"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgb(99 102 241 / 0.25), transparent 55%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700 shadow-sm backdrop-blur-sm dark:border-indigo-500/30 dark:bg-slate-900/60 dark:text-indigo-200">
            <Gem className="h-3.5 w-3.5 text-indigo-500" strokeWidth={2} />
            Pricing plans
          </span>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mx-auto mb-4 max-w-3xl text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
            Plans that fit your{' '}
            <span className="rounded-xl border border-dashed border-indigo-400/60 bg-indigo-50 px-2 py-0.5 capitalize text-indigo-800 dark:border-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-200">
              society
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">
            From a one-month trial to a full year of premium operations—pick the runway that
            matches your committee and residents.
          </p>
        </Motion.div>

        <Motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {plans.map((plan) => (
            <Motion.div
              key={plan.id}
              variants={item}
              className="relative z-0 h-full transition-[transform,z-index] duration-300 hover:z-20"
            >
              <Card
                className={cn(
                  'group relative flex h-full flex-col overflow-hidden',
                  'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/70',
                  'transition-all duration-300 ease-out will-change-transform',
                  'hover:-translate-y-2 hover:scale-[1.03]',
                  'hover:border-violet-400/80 hover:shadow-xl hover:shadow-violet-500/25',
                  'hover:ring-2 hover:ring-violet-500/35 dark:hover:border-violet-500/60 dark:hover:shadow-violet-600/20 dark:hover:ring-violet-400/30',
                  'hover:bg-gradient-to-b hover:from-violet-50/90 hover:to-white dark:hover:from-violet-950/35 dark:hover:to-slate-900/95',
                  plan.recommended &&
                    'border-indigo-400/60 bg-gradient-to-b from-indigo-50/90 to-white shadow-glow-sm ring-2 ring-indigo-500/30 dark:border-indigo-500/40 dark:from-indigo-950/50 dark:to-slate-900/90 dark:ring-indigo-400/25',
                  plan.recommended &&
                    'hover:border-violet-400 hover:from-violet-50/95 hover:shadow-violet-500/30 hover:ring-violet-400/45 dark:hover:from-violet-950/45 dark:hover:ring-violet-400/35',
                )}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                  style={{
                    background:
                      'radial-gradient(120% 80% at 50% 0%, rgb(167 139 250 / 0.18), transparent 55%)',
                  }}
                />
                {plan.recommended && (
                  <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-indigo-500/10 blur-2xl transition-opacity group-hover:opacity-70" />
                )}
                <CardHeader className="relative z-10 flex-1 space-y-4 pb-2 text-left">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
                        {plan.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {plan.duration}
                      </p>
                    </div>
                    {plan.badge && (
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1',
                          plan.badgeStyle ||
                            'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600',
                        )}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {plan.description}
                  </p>
                  <div className="flex flex-wrap items-baseline gap-x-1 gap-y-1 pt-2">
                    <span className="text-3xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white md:text-4xl">
                      {formatInr(plan.priceAmount)}
                    </span>
                    {plan.priceAmount === 0 ? (
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        · {plan.duration} trial
                      </span>
                    ) : (
                      <span className="text-sm text-slate-500 dark:text-slate-400">per {plan.duration}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 mt-auto flex flex-col pt-0">
                  <Link
                    to="/signup"
                    className={cn(
                      'mb-6 block w-full rounded-xl py-3.5 text-center text-sm font-semibold transition',
                      plan.recommended || plan.ctaVariant === 'default'
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35'
                        : 'border border-slate-200/90 bg-slate-900 text-white hover:bg-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700',
                    )}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="space-y-3 border-t border-slate-200/80 pt-5 dark:border-slate-700/80">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex gap-3 text-sm">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                          {React.createElement(feature.Icon, {
                            className: 'h-3.5 w-3.5',
                            strokeWidth: 2,
                          })}
                        </span>
                        <span className="leading-snug text-slate-600 dark:text-slate-300">
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </section>
  )
}
