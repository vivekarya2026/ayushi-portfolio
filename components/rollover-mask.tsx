"use client";

interface RolloverMaskProps {
  children: string;
  /**
   * When true, this element also acts as the hover trigger. Set false when a
   * parent element carries the `.rollover-trigger` class (e.g. a whole button).
   */
  standalone?: boolean;
  className?: string;
}

/**
 * Shared double-text hover swap. The top copy slides up (-100%) while the
 * bottom copy slides in from 100% over 0.35s cubic-bezier(0.6,0,0.2,1).
 *
 * Wrap it in an element with the `rollover-trigger` class to swap on that
 * element's hover/focus (e.g. an entire pill button), or pass `standalone`
 * to make the mask its own trigger.
 */
export function RolloverMask({
  children,
  standalone = false,
  className = "",
}: RolloverMaskProps) {
  return (
    <span className={`rollover-mask ${standalone ? "rollover-trigger" : ""} ${className}`}>
      <span className="rollover-top">{children}</span>
      <span className="rollover-bottom" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
