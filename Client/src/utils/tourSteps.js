export const TOUR_STORAGE_KEY = 'hasSeenTour';

function createTourStep({
  content,
  id,
  placement = 'auto',
  route,
  spotlightPadding = 20,
  target,
  title,
}) {
  return {
    content,
    data: { route },
    id,
    placement,
    spotlightPadding,
    target,
    title,
    beforeTimeout: 5000,
    closeButtonAction: 'skip',
    dismissKeyAction: 'close',
    overlayClickAction: false,
    scrollDuration: 450,
    showProgress: true,
    skipBeacon: true,
  };
}

export function buildTourSteps({ getCurrentPath, navigate, waitForTarget, scrollTargetIntoView }) {
  const waitForRouteStep = async (step) => {
    const stepRoute = step.data?.route;

    if (stepRoute && getCurrentPath() !== stepRoute) {
      navigate(stepRoute);
      await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
    }

    const target = await waitForTarget(step.target);

    if (target && typeof scrollTargetIntoView === 'function') {
      await scrollTargetIntoView(step.scrollTarget ?? target, { margin: 24 });
    }
  };

  return [
    createTourStep({
      id: 'welcome',
      route: '/dashboard',
      target: () => document.body,
      placement: 'center',
      spotlightPadding: 0,
      scrollDuration: 350,
      title: 'Welcome to Panchayat',
      content:
        'Welcome to Panchayat, your AI-powered Society Management Platform. Manage complaints, connect with your community, stay informed, and access society services from one intelligent dashboard.',
    }),
    createTourStep({
      id: 'dashboard',
      route: '/dashboard',
      target: '[data-tour="dashboard"]',
      title: 'Dashboard',
      content:
        'This is your personalized dashboard where you can quickly access notices, community updates, complaint summaries, daily quotes, upcoming events, and quick actions.',
    }),
    createTourStep({
      id: 'raise-complaint',
      route: '/complaints',
      target: '[data-tour="raise-complaint"]',
      title: 'Raise Complaint',
      content:
        'Report society issues using text or voice. Our AI automatically summarizes your complaint before sending it to society management. Residents can also upload photos and track complaint progress.',
    }),
    createTourStep({
      id: 'my-complaints',
      route: '/complaints',
      target: '[data-tour="my-complaints"]',
      title: 'My Complaints',
      content:
        'View all your submitted complaints. Track their status from Reported to Resolved and view maintenance updates in real time.',
    }),
    createTourStep({
      id: 'rulebook',
      route: '/rulebook',
      target: '[data-tour="rulebook"]',
      title: 'Rule Book',
      content:
        'Browse the complete Society Rule Book. Search rules, filter by category, download the latest Rule Book PDF, and stay updated with recently added rules.',
    }),
    createTourStep({
      id: 'assistant',
      route: '/dashboard',
      target: '[data-tour="assistant"]',
      title: 'AI Assistant',
      content:
        'Ask questions naturally right from the dashboard. For example: What are gym timings? Where is the clubhouse? Visitor policy? Parking rules? The assistant searches the society knowledge base and provides instant answers.',
    }),
    createTourStep({
      id: 'maintenance',
      route: '/complaints',
      target: '[data-tour="maintenance"]',
      title: 'Maintenance',
      content:
        'Request maintenance services such as plumbing, electrical, carpenter, and AC repair. Track service progress and maintenance history.',
    }),
    createTourStep({
      id: 'community',
      route: '/community',
      target: '[data-tour="community"]',
      title: 'Community',
      content:
        'Stay connected with your neighbours. View announcements, society events, buy and sell listings, rental properties, polls, discussions, and community posts.',
    }),
    createTourStep({
      id: 'analytics',
      route: '/analytics',
      target: '[data-tour="analytics"]',
      title: 'Analytics',
      content:
        'Monitor your personal activity. View complaint trends, resolution statistics, service history, community participation, and personalized AI insights.',
    }),
    createTourStep({
      id: 'notifications',
      route: '/dashboard',
      target: '[data-tour="notifications"]',
      title: 'Notifications',
      content:
        'Receive instant notifications whenever complaint status changes, new rules are added, notices are published, or society events are announced.',
    }),
    createTourStep({
      id: 'profile',
      route: '/dashboard',
      target: '[data-tour="profile"]',
      title: 'Profile',
      content:
        'Manage your personal profile. Update your profile photo, contact details, house information, and account settings.',
    }),
    createTourStep({
      id: 'help',
      route: '/dashboard',
      target: '[data-tour="help"]',
      title: 'Settings & Help',
      content:
        'Access the website tour anytime, change preferences, and get support whenever you need assistance.',
    }),
    createTourStep({
      id: 'finished',
      route: '/dashboard',
      target: () => document.body,
      placement: 'center',
      spotlightPadding: 0,
      scrollDuration: 350,
      title: 'Congratulations!',
      content:
        "You've completed the Panchayat onboarding tour. You're now ready to explore all society features and enjoy a smarter residential experience.",
    }),
  ].map((step) => ({
    ...step,
    before: async () => {
      await waitForRouteStep(step);
    },
  }));
}
