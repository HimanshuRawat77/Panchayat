import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { Check, Loader2 } from 'lucide-react'
import {
  activateFreeTrial,
  createPaymentOrder,
  getSubscription,
  loadRazorpayCheckout,
  verifyPayment,
} from '../../services/paymentService'
import { getAuthToken, getAuthUser, updateStoredUser } from '../../utils/authStorage'

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
  const navigate = useNavigate()
  const [selectedPlanId, setSelectedPlanId] = useState('')
  const [subscription, setSubscription] = useState(getAuthUser()?.subscription || null)

  React.useEffect(() => {
    if (!getAuthToken()) return

    getSubscription()
      .then((data) => setSubscription(data.subscription))
      .catch(() => {})
  }, [])

  const mergeSubscriptionIntoUser = (subscription) => {
    const user = getAuthUser()
    if (!user) return

    updateStoredUser({
      ...user,
      subscriptionMode: subscription.currentPlan,
      planStatus: subscription.planStatus,
      planActivatedAt: subscription.activationDate,
      planExpiresAt: subscription.expiryDate,
      subscription,
    })
  }

  const requireLogin = () => {
    if (getAuthToken()) return true

    toast.error('Please sign in to select a plan.')
    setTimeout(() => navigate('/login'), 900)
    return false
  }

  const hasActivePaidPlan = () =>
    subscription?.planStatus === 'active' &&
    subscription?.currentPlan &&
    subscription.currentPlan !== 'Free' &&
    subscription.daysRemaining > 0

  const blockExistingPlan = () => {
    if (!hasActivePaidPlan()) return false

    toast.error('You already have a plan.')
    return true
  }

  const handleFreePlan = async () => {
    if (!requireLogin()) return
    if (blockExistingPlan()) return

    setSelectedPlanId('trial')
    try {
      const data = await activateFreeTrial()
      mergeSubscriptionIntoUser(data.subscription)
      setSubscription(data.subscription)
      toast.success('Your free trial activated!')
      setTimeout(() => navigate('/dashboard'), 900)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSelectedPlanId('')
    }
  }

  const handlePaidPlan = async (plan) => {
    if (!requireLogin()) return
    if (blockExistingPlan()) return

    setSelectedPlanId(plan.id)
    try {
      await loadRazorpayCheckout()
      const order = await createPaymentOrder(plan.id)
      const user = getAuthUser()

      const razorpay = new window.Razorpay({
        key: order.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Panchayat',
        description: `${order.plan.name} Plan`,
        order_id: order.orderId,
        prefill: {
          name: order.prefill?.name || user?.fullName || '',
          email: order.prefill?.email || user?.email || '',
          contact: order.prefill?.contact || user?.phoneNumber || '',
        },
        theme: {
          color: '#C8A45D',
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'UPI / Scan & Pay',
                instruments: [
                  {
                    method: 'upi',
                  },
                ],
              },
            },
            sequence: ['block.upi'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: async (response) => {
          try {
            const data = await verifyPayment({
              planId: plan.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            mergeSubscriptionIntoUser(data.subscription)
            setSubscription(data.subscription)
            navigate('/dashboard?plan=activated')
          } catch (error) {
            toast.error(error.message)
          }
        },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled.')
            setSelectedPlanId('')
          },
        },
      })

      razorpay.open()
    } catch (error) {
      toast.error(error.message)
      setSelectedPlanId('')
    }
  }

  const handlePlanClick = (plan) => {
    if (plan.id === 'trial') {
      handleFreePlan()
      return
    }

    handlePaidPlan(plan)
  }

  return (
    <section id="pricing" className="relative px-4 py-24 md:py-32">
      <Toaster position="top-center" />
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
              <Motion.div
                aria-hidden="true"
                className={`absolute inset-0 rounded-2xl ${
                  plan.highlighted
                    ? 'bg-[linear-gradient(115deg,rgba(200,164,93,0.35)_0%,rgba(224,194,122,1)_18%,rgba(255,245,214,1)_32%,rgba(200,164,93,0.6)_46%,rgba(200,164,93,0.18)_62%,rgba(200,164,93,0.8)_78%,rgba(255,238,182,1)_88%,rgba(200,164,93,0.4)_100%)]'
                    : 'bg-[linear-gradient(115deg,rgba(148,163,184,0.22)_0%,rgba(200,164,93,0.14)_24%,rgba(255,235,178,0.92)_42%,rgba(200,164,93,0.34)_58%,rgba(148,163,184,0.16)_74%,rgba(200,164,93,0.45)_88%,rgba(148,163,184,0.22)_100%)]'
                } bg-[length:220%_220%] opacity-0 blur-[0.5px] transition-opacity duration-300 group-hover:opacity-100`}
                animate={{ backgroundPosition: ['200% 50%', '-20% 50%'] }}
                transition={{ duration: 2.8, ease: 'linear', repeat: Infinity }}
              />

              <div
                className={`relative flex h-full flex-col rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? 'm-px bg-amber-50/80 shadow-lg shadow-amber-600/10 dark:bg-[#221C18] dark:shadow-[#C8A45D]/10'
                    : 'm-px bg-white shadow-sm group-hover:shadow-lg dark:bg-[#221C18]'
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
                <button
                  type="button"
                  onClick={() => handlePlanClick(plan)}
                  disabled={Boolean(selectedPlanId)}
                  className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-[#C8A45D] text-[#151210] shadow-md shadow-[#C8A45D]/25 hover:bg-[#E0C27A] hover:shadow-lg hover:shadow-[#C8A45D]/35'
                      : 'border border-slate-200 text-slate-700 hover:border-[#C8A45D] hover:bg-[#C8A45D] hover:text-[#151210] hover:shadow-lg hover:shadow-[#C8A45D]/25 dark:border-[#6B4F3A]/30 dark:text-[#F5F1EA] dark:hover:border-[#C8A45D] dark:hover:bg-[#C8A45D] dark:hover:text-[#151210] dark:hover:shadow-[#C8A45D]/30'
                  } ${selectedPlanId ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  {selectedPlanId === plan.id || (selectedPlanId === 'trial' && plan.id === 'trial') ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </section>
  )
}
