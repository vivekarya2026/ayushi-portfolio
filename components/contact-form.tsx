"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { t } from "@/content/copy";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  function validate(data: FormData): boolean {
    const errs: Record<string, string> = {};
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const message = data.get("message") as string;

    if (!name.trim()) errs.name = t.contact.form.nameRequired;
    if (!email.trim()) errs.email = t.contact.form.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = t.contact.form.emailInvalid;
    if (!message.trim()) errs.message = t.contact.form.messageRequired;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    if (!validate(data)) return;

    setState("submitting");

    try {
      // Web3Forms endpoint — replace access_key with real one [VERIFY]
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "YOUR_ACCESS_KEY", // [VERIFY: replace with real key]
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });

      if (res.ok) {
        setState("success");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        className="space-y-6"
      >
        {/* Success celebration — Peak-End Rule */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: EASE_OUT_EXPO }}
          className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center"
        >
          <Check size={24} className="text-accent" />
        </motion.div>

        <div>
          <h3 className="font-sans text-xl font-medium">{t.contact.form.successTitle}</h3>
          <p className="mt-2 text-ink-soft text-sm">{t.contact.form.successBody}</p>
        </div>

        {/* Suggested project — keeps the loop going */}
        <div className="pt-6 border-t border-line">
          <p className="type-eyebrow mb-3">{t.contact.form.whileYouWait}</p>
          <Link
            href="/work/nebula"
            className="text-sm font-medium text-ink hover:text-accent transition-colors duration-[var(--duration-fast)]"
          >
            Check out NEBULA, A Badminton Collection →
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-8">
      <FormField
        name="name"
        label={t.contact.form.name}
        type="text"
        error={errors.name}
        disabled={state === "submitting"}
      />
      <FormField
        name="email"
        label={t.contact.form.email}
        type="email"
        error={errors.email}
        disabled={state === "submitting"}
      />
      <FormField
        name="message"
        label={t.contact.form.message}
        type="textarea"
        error={errors.message}
        disabled={state === "submitting"}
      />

      {/* Submit button with state morph */}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="btn-primary relative px-8 min-w-[120px] disabled:opacity-70"
      >
        <AnimatePresence mode="wait">
          {state === "submitting" ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader2 size={16} className="animate-spin" />
              {t.contact.form.submitting}
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {t.contact.form.submit}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {state === "error" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-600"
        >
          {t.contact.form.error}
        </motion.p>
      )}
    </form>
  );
}

function FormField({
  name,
  label,
  type,
  error,
  disabled,
}: {
  name: string;
  label: string;
  type: "text" | "email" | "textarea";
  error?: string;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isActive = focused || hasValue;

  const fieldClasses = `
    w-full bg-white border rounded-lg px-4 pt-5 pb-2 text-base text-ink
    transition-all duration-[var(--duration-fast)]
    focus:outline-none focus:ring-0
    ${error
      ? "border-red-400 focus:border-red-500"
      : "border-line focus:border-accent"
    }
    ${disabled ? "opacity-60 cursor-not-allowed" : ""}
  `;

  const labelClasses = `
    absolute left-4 transition-all duration-[var(--duration-normal)] pointer-events-none
    ${isActive
      ? "top-2 text-[11px] font-mono uppercase tracking-[0.06em]"
      : "top-1/2 -translate-y-1/2 text-sm"
    }
    ${focused ? "text-accent" : "text-ink-soft"}
    ${error ? "text-red-400" : ""}
  `;

  const commonProps = {
    name,
    id: name,
    disabled,
    onFocus: () => setFocused(true),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFocused(false);
      setHasValue(e.target.value.length > 0);
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setHasValue(e.target.value.length > 0);
    },
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${name}-error` : undefined,
  };

  return (
    <div className="relative">
      {type === "textarea" ? (
        <textarea
          {...commonProps}
          rows={4}
          className={`${fieldClasses} resize-none`}
        />
      ) : (
        <input
          {...commonProps}
          type={type}
          className={fieldClasses}
        />
      )}
      <label htmlFor={name} className={type === "textarea" && !isActive ? `${labelClasses} !top-4 !translate-y-0` : labelClasses}>
        {label}
      </label>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          id={`${name}-error`}
          className="mt-1.5 text-xs text-red-500"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
