import React from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { Check } from 'lucide-react'

const plans = [
  {
    id: 'trial',
    label: 'TRIAL',
    price: '1 Month Free',
    description: 'Explore all features with no commitment.',
    features: [

      'Basic tracking',
      'Limited AI queries',
      'Rule book access',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    id: 'quarterly',
    label: 'QUARTERLY',
    price: '₹15k',
    description: 'For smaller communities and committees.',
    features: [
      'Everything in trial',
      'Unlimited complaints',
      'Full AI access',
      'Notice board',
      'Basic analytics',
    ],
    cta: 'Select Plan',
    highlighted: false,
  },
  {
    id: 'half-yearly',
    label: 'HALF YEARLY',
    price: '₹28k',
    description: 'The perfect balance for growing societies.',
    features: [
      'Everything in quarterly',
      'Priority handling',
      'Advanced analytics',
      'Notifications system',
      'Community feed',
    ],
    cta: 'Select Plan',
    highlighted: true,
  },
  {
    id: 'annual',
    label: 'ANNUAL',
    price: '₹55k',
    description: 'Maximum value for elite residential societies.',
    features: [
      'Everything in half yearly',
      'Dedicated support',
      'Custom features',
      'Data insights & reports',
      'Future updates included',
    ],
    cta: 'Select Plan',
    highlighted: false,
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function PricingSection() {
  return (
    <section id="pricing" className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-0 md:px-12">
        {/* Header */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-[#F5F1EA] md:text-4xl">
            Tailored for Your Community
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500 dark:text-[#B8AEA3]">
            Simple pricing to scale with your society&apos;s growth.
          </p>
        </Motion.div>

        {/* Cards Grid */}
        <Motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {plans.map((plan) => (
            <Motion.div
              key={plan.id}
              variants={item}
              className="group relative"
            >
              <div
                className={`flex h-full flex-col rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? 'border border-[#C8A45D] bg-amber-50/80 shadow-lg shadow-amber-600/10 dark:border-[#C8A45D]/60 dark:bg-[#221C18] dark:shadow-[#C8A45D]/10'
                    : 'border border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg dark:border-[#6B4F3A]/25 dark:bg-[#221C18] dark:hover:border-[#8B6B4A]/40'
                }`}
              >
                {/* Label */}
                <p className="font-label text-xs font-semibold uppercase tracking-[0.05em] text-slate-400 dark:text-[#B8AEA3]">
                  {plan.label}
                </p>

                {/* Price */}
                <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-[#F5F1EA] md:text-4xl">
                  {plan.price}
                </p>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-[#B8AEA3]">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-600 dark:text-[#B8AEA3]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500 dark:text-[#C8A45D]" strokeWidth={2.5} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to="/signup"
                  className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-[#C8A45D] text-[#151210] shadow-md shadow-[#C8A45D]/25 hover:bg-[#E0C27A] hover:shadow-lg hover:shadow-[#C8A45D]/35'
                      : 'border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-[#6B4F3A]/30 dark:text-[#F5F1EA] dark:hover:border-[#8B6B4A]/50 dark:hover:bg-[#6B4F3A]/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </section>
  )
}
