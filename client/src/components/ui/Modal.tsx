"use client";

import { ReactNode, useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  /** Sticky action row pinned to the bottom of the sheet */
  footer?: ReactNode;
  maxWidth?: string;
}

/**
 * Responsive dialog:
 *  - phones  → slides up as a bottom sheet with a drag handle
 *  - tablet+ → centred, scale-in card
 * Handles: portal, body scroll-lock, Esc, backdrop click, focus.
 */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "max-w-lg",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const subscribeToViewport = useCallback((notify: () => void) => {
    const mq = window.matchMedia("(min-width: 640px)");
    mq.addEventListener("change", notify);
    return () => mq.removeEventListener("change", notify);
  }, []);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isDesktop = useSyncExternalStore(
    subscribeToViewport,
    () => window.matchMedia("(min-width: 640px)").matches,
    () => false
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const motionProps = reduceMotion
    ? { initial: false as const }
    : isDesktop
      ? {
          initial: { opacity: 0, scale: 0.95, y: 12 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.97, y: 8 },
          transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
        }
      : {
          initial: { y: "100%" },
          animate: { y: 0 },
          exit: { y: "100%" },
          transition: { type: "spring" as const, stiffness: 360, damping: 38 },
        };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`relative flex max-h-[90dvh] w-full ${maxWidth} flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl outline-none sm:rounded-2xl`}
            {...motionProps}
          >
            {/* grab handle (mobile only) */}
            <div className="flex justify-center pt-3 sm:hidden">
              <span className="h-1.5 w-10 rounded-full bg-stone-300" />
            </div>

            {(title || subtitle) && (
              <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-4 sm:px-6 sm:pt-6">
                <div className="min-w-0">
                  {title && (
                    <h3 className="font-display text-xl text-stone-900 sm:text-2xl">{title}</h3>
                  )}
                  {subtitle && (
                    <p className="mt-1 text-xs text-stone-500 sm:text-sm">{subtitle}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6">{children}</div>

            {footer && (
              <div
                className="border-t border-stone-100 bg-white px-5 py-4 sm:px-6"
                style={{ paddingBottom: "calc(1rem + var(--safe-bottom))" }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default Modal;
