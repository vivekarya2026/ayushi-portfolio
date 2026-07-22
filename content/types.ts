export type ImageLayout = "single" | "diptych" | "full-bleed";

export interface ImageBlock {
  src: string;
  alt: string;
  layout: ImageLayout;
  caption?: string;
}

export interface Project {
  title: string;
  slug: string;
  year: number;
  categories: string[];
  role: string;
  tools: string[];
  theme: string;
  isFlagship: boolean;
  overview: {
    challenge: string;
    approach: string;
    outcome: string;
  };
  images: ImageBlock[];
  heroImage: string;
  secondaryImage?: string;
  ogImage: string;
}
