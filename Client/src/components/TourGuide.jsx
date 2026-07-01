import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import { EVENTS, STATUS, useJoyride } from "react-joyride";
import { buildTourSteps, TOUR_STORAGE_KEY } from "../utils/tourSteps";

const TourContext = createContext(null);

function resolveTarget(target) {
  if (typeof target === "function") {
    return target();
  }

  if (typeof target === "string") {
    return document.querySelector(target);
  }

  return target ?? null;
}

function waitForTarget(target, timeout = 3500) {
  const foundTarget = resolveTarget(target);

  if (foundTarget) {
    return Promise.resolve(foundTarget);
  }

  return new Promise((resolve) => {
    const startedAt = Date.now();
    const observer = new MutationObserver(() => {
      const nextTarget = resolveTarget(target);

      if (nextTarget) {
        observer.disconnect();
        clearTimeout(timerId);
        resolve(nextTarget);
      }
    });

    const timerId = window.setTimeout(() => {
      observer.disconnect();
      resolve(resolveTarget(target));
    }, timeout);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const firstMatch = resolveTarget(target);
    if (firstMatch) {
      observer.disconnect();
      clearTimeout(timerId);
      resolve(firstMatch);
    }

    if (Date.now() - startedAt >= timeout) {
      observer.disconnect();
      clearTimeout(timerId);
      resolve(resolveTarget(target));
    }
  });
}

function isElementVisibleInViewport(element, margin = 24) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= margin &&
    rect.left >= margin &&
    rect.bottom <= viewportHeight - margin &&
    rect.right <= viewportWidth - margin
  );
}

async function scrollTargetIntoView(
  target,
  { behavior = "smooth", margin = 24 } = {}
) {
  const element = resolveTarget(target);

  if (!element) {
    return;
  }

  const rect = element.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const block = rect.height > viewportHeight - margin * 2 ? "start" : "center";

  if (!isElementVisibleInViewport(element, margin)) {
    element.scrollIntoView({
      behavior,
      block,
      inline: "nearest",
    });

    await new Promise((resolve) => window.setTimeout(resolve, 500));
  }
}

function TourTooltip({
  backProps,
  closeProps,
  index,
  isLastStep,
  primaryProps,
  skipProps,
  tooltipProps,
  size,
  step,
}) {
  return (
    <Motion.div
      key={step.id || index}
      layout
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
      {...tooltipProps}
      className="relative flex w-[min(360px,calc(100vw-24px))] max-w-[360px] max-h-[calc(100vh-24px)] flex-col overflow-hidden rounded-[24px] border border-[#6B4F3A]/40 bg-[#1A1614]/94 text-[#F5F1EA] shadow-[0_22px_70px_rgba(0,0,0,0.42)] backdrop-blur-2xl will-change-transform"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#6B4F3A] via-[#C8A45D] to-[#E0C27A]" />
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#C8A45D]/10 blur-3xl" />
      <div className="flex-1 overflow-hidden px-4 pb-3 pt-4 sm:px-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#C8A45D]/20 bg-[#C8A45D]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#E0C27A]">
              <Sparkles className="h-3 w-3" />
              Panchayat Tour
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8AEA3]">
              Step {index + 1} of {size}
            </p>
          </div>

          <button
            type="button"
            {...closeProps}
            className="rounded-full border border-[#6B4F3A]/40 bg-[#221C18]/80 p-1.5 text-[#B8AEA3] transition duration-200 hover:border-[#C8A45D]/50 hover:text-[#F5F1EA]"
            aria-label="Close tour step"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {step.title && (
          <h3 className="text-[1rem] font-semibold leading-tight tracking-tight text-[#F5F1EA]">
            {step.title}
          </h3>
        )}
        <div className="mt-2 space-y-2 text-[13px] leading-5 text-[#DCCFBF]">
          {step.content}
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-5">
        <div className="mb-3 h-1 overflow-hidden rounded-full bg-[#221C18]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6B4F3A] via-[#C8A45D] to-[#E0C27A] transition-all duration-300 ease-out"
            style={{ width: `${((index + 1) / size) * 100}%` }}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            {...skipProps}
            className="inline-flex items-center justify-center rounded-xl border border-[#6B4F3A]/40 bg-transparent px-3.5 py-2.5 text-sm font-semibold text-[#B8AEA3] transition duration-200 hover:border-[#C8A45D]/50 hover:text-[#F5F1EA]"
          >
            Skip
          </button>

          <div className="flex items-center gap-2 sm:justify-end">
            <button
              type="button"
              {...backProps}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#6B4F3A]/40 bg-[#221C18]/80 px-3.5 py-2.5 text-sm font-semibold text-[#F5F1EA] transition duration-200 hover:border-[#C8A45D]/50 hover:bg-[#2a231e]"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              type="button"
              {...primaryProps}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C8A45D] to-[#E0C27A] px-3.5 py-2.5 text-sm font-semibold text-[#151210] shadow-[0_10px_24px_rgba(200,164,93,0.22)] transition duration-200 hover:brightness-105"
            >
              {isLastStep ? "Finish" : "Next"}
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </Motion.div>
  );
}

export function useTourGuide() {
  const context = useContext(TourContext);

  if (!context) {
    throw new Error("useTourGuide must be used inside TourProvider");
  }

  return context;
}

export function TourProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTourOpen, setIsTourOpen] = useState(false);
  const startIndexRef = useRef(0);
  const hasAutoStartedRef = useRef(false);

  const steps = useMemo(
    () =>
      buildTourSteps({
        getCurrentPath: () => location.pathname,
        navigate,
        waitForTarget,
        scrollTargetIntoView,
      }),
    [location.pathname, navigate]
  );

  const handleTourEvent = useCallback((data) => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
      setIsTourOpen(false);
      startIndexRef.current = 0;
    }
  }, []);

  const { controls, Tour } = useJoyride({
    continuous: true,
    locale: {
      back: "Previous",
      close: "Close",
      last: "Finish",
      next: "Next",
      nextWithProgress: "Next ({current} of {total})",
      open: "Open tour",
      skip: "Skip",
    },
    onEvent: handleTourEvent,
    options: {
      blockTargetInteraction: false,
      closeButtonAction: "skip",
      dismissKeyAction: "close",
      hideOverlay: false,
      overlayClickAction: false,
      primaryColor: "#C8A45D",
      scrollDuration: 450,
      scrollOffset: 16,
      showProgress: true,
      skipBeacon: true,
      spotlightPadding: 20,
      spotlightRadius: 26,
      zIndex: 1600,
    },
    scrollToFirstStep: true,
    steps,
    styles: {
      overlay: {
        backgroundColor: "rgba(10, 7, 5, 0.72)",
        transition: "background-color 220ms ease",
      },
      spotlight: {
        borderRadius: 26,
        filter:
          "drop-shadow(0 0 10px rgba(255,255,255,0.28)) drop-shadow(0 0 26px rgba(255,255,255,0.14))",
        stroke: "rgba(255,255,255,0.22)",
        strokeWidth: 1,
      },
      tooltip: {
        backgroundColor: "transparent",
        boxShadow: "none",
        padding: 0,
      },
      tooltipContainer: {
        backgroundColor: "transparent",
      },
      tooltipContent: {
        padding: 0,
      },
      tooltipFooter: {
        marginTop: 0,
      },
      tooltipFooterSpacer: {
        display: "none",
      },
      floater: {
        transition: "transform 240ms ease, opacity 180ms ease",
      },
    },
    tooltipComponent: TourTooltip,
  });

  const startTour = useCallback(
    (index = 0) => {
      startIndexRef.current = index;
      setIsTourOpen(true);
      controls.start(index);
    },
    [controls]
  );

  const stopTour = useCallback(() => {
    setIsTourOpen(false);
    controls.stop();
  }, [controls]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(TOUR_STORAGE_KEY) === "true";
    const isResidentRoute = location.pathname === "/dashboard";
    const hasToken = Boolean(localStorage.getItem("token"));

    if (
      !hasSeenTour &&
      isResidentRoute &&
      hasToken &&
      !hasAutoStartedRef.current
    ) {
      hasAutoStartedRef.current = true;
      startTour(0);
    }
  }, [location.pathname, startTour]);

  const value = useMemo(
    () => ({
      isTourOpen,
      startTour,
      stopTour,
    }),
    [isTourOpen, startTour, stopTour]
  );

  return (
    <TourContext.Provider value={value}>
      {children}
      {Tour}
    </TourContext.Provider>
  );
}

export default TourProvider;
