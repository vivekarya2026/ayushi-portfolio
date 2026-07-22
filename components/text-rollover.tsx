"use client";

interface TextRolloverProps {
  children: string;
  className?: string;
}

export function TextRollover({ children, className = "" }: TextRolloverProps) {
  return (
    <span className={`group/rollover relative inline-block overflow-hidden ${className}`}>
      <span className="block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/rollover:-translate-y-full">
        {children}
      </span>
      <span
        className="absolute left-0 top-full block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/rollover:-translate-y-full"
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  );
}
