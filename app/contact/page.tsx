import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { t } from "@/content/copy";

export const metadata: Metadata = {
  title: t.meta.contactTitle,
  description: t.meta.contactDescription,
};

export default function ContactPage() {
  return (
    <section className="page-top pb-24 md:pb-32 px-6 md:px-12">
      <div className="mx-auto max-w-[var(--container-max)]">
        <div className="max-w-2xl mx-auto">
          <div className="section-header">
            <p className="type-eyebrow">{t.contact.eyebrow}</p>
            <h1 className="type-h1">{t.contact.heading}</h1>
            <p className="type-body text-ink-soft">{t.contact.subheading}</p>
          </div>

          <div className="mt-12 md:mt-16">
            <ContactForm />
          </div>

          {/* Direct email fallback */}
          <div className="mt-12 pt-8 border-t border-line">
            <p className="text-sm text-ink-soft">
              {t.contact.preferEmail}{" "}
              <a
                href="mailto:ayushidubey1210@gmail.com"
                className="tap-safe text-ink hover:text-accent transition-colors duration-[var(--duration-fast)] underline underline-offset-2"
              >
                ayushidubey1210@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
