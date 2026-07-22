import type { Metadata } from "next";
import { AboutContent } from "@/components/about-content";
import { t } from "@/content/copy";

export const metadata: Metadata = {
  title: t.meta.aboutTitle,
  description: t.meta.aboutDescription,
};

export default function AboutPage() {
  return <AboutContent />;
}
