import type { Project } from "./types";

export const projects: Project[] = [
  // === FLAGSHIPS ===
  {
    title: "NEBULA, A Badminton Collection",
    slug: "nebula",
    year: 2026,
    categories: ["Sports", "Packaging", "Brand Identity"],
    role: "Graphic Designer", // [VERIFY]
    tools: ["Adobe Illustrator", "Photoshop"], // [VERIFY]
    theme: "#2D1B69",
    isFlagship: true,
    overview: {
      challenge:
        "Badminton equipment often defaults to aggressive, hyper-masculine branding that alienates casual players and younger audiences. [VERIFY]",
      approach:
        "Drew from deep-space nebula imagery to create a collection identity that feels cosmic and aspirational—packaging that players want to keep, not discard. Bold gradients, holographic foils, and modular layouts across shuttlecocks, grips, and racket bags.",
      outcome:
        "A full collection spanning packaging, merchandise, and point-of-sale materials—over 30 deliverables unified under one visual system. [VERIFY]",
    },
    heroImage: "/images/nebula/020934ba-ab6d-4630-a6ba-aa5da0a3f98f.png",
    secondaryImage: "/images/nebula/0484db01-d873-412e-97fe-277ad514698f.png",
    ogImage: "/images/nebula/020934ba-ab6d-4630-a6ba-aa5da0a3f98f.png",
    images: [
      { src: "/images/nebula/020934ba-ab6d-4630-a6ba-aa5da0a3f98f.png", alt: "NEBULA collection hero shot", layout: "full-bleed" },
      { src: "/images/nebula/0484db01-d873-412e-97fe-277ad514698f.png", alt: "NEBULA packaging detail", layout: "single" },
      { src: "/images/nebula/09f3eabd-4746-4114-900c-208b5114a250.png", alt: "NEBULA shuttlecock box design", layout: "diptych" },
      { src: "/images/nebula/1846a7c2-8b28-418d-8b3e-ed2f724861b3.png", alt: "NEBULA racket bag", layout: "diptych" },
      { src: "/images/nebula/27d42c95-807c-4196-8389-fa9c79050b19.png", alt: "NEBULA grip tape packaging", layout: "single" },
      { src: "/images/nebula/3a5c6a7e-2b2c-40f3-bcf2-1e3d4f5a6b7c.png", alt: "NEBULA brand pattern", layout: "full-bleed" },
    ],
  },
  {
    title: "ACCEXX, A Pickleball Collection",
    slug: "accexx",
    year: 2026,
    categories: ["Sports", "Packaging", "Brand Identity"],
    role: "Graphic Designer", // [VERIFY]
    tools: ["Adobe Illustrator", "Photoshop"], // [VERIFY]
    theme: "#1A5C3A",
    isFlagship: true,
    overview: {
      challenge:
        "Pickleball is booming, but the gear market is flooded with generic neon-on-black designs that blur together on store shelves. The collection needed to stand apart while speaking to a young, style-conscious audience. [VERIFY]",
      approach:
        "Developed a nature-meets-geometry identity: organic textures paired with sharp typographic lockups. Every SKU—paddles, balls, bags, apparel—shares a modular grid system that flexes across formats.",
      outcome:
        "A cohesive 40+ piece collection ready for retail. Packaging designed to double as display: boxes that open into countertop stands. [VERIFY]",
    },
    heroImage: "/images/accexx/016b8d7c-c460-46c1-8d8b-8157a7111038.png",
    secondaryImage: "/images/accexx/0b63ecfe-d37a-4c50-94a7-88582df348a2.png",
    ogImage: "/images/accexx/016b8d7c-c460-46c1-8d8b-8157a7111038.png",
    images: [
      { src: "/images/accexx/016b8d7c-c460-46c1-8d8b-8157a7111038.png", alt: "ACCEXX collection hero", layout: "full-bleed" },
      { src: "/images/accexx/0b63ecfe-d37a-4c50-94a7-88582df348a2.png", alt: "ACCEXX paddle packaging", layout: "single" },
      { src: "/images/accexx/1601fc52-9a7f-41c9-b096-7e648ab71bd7.png", alt: "ACCEXX ball container", layout: "diptych" },
      { src: "/images/accexx/16935ef6-62f2-4346-b427-d631f13ac939.png", alt: "ACCEXX bag design", layout: "diptych" },
      { src: "/images/accexx/1fcc1790-5948-402b-baf6-248b9ba7fc76.png", alt: "ACCEXX apparel tags", layout: "single" },
    ],
  },
  {
    title: "Virasat",
    slug: "virasat",
    year: 2025,
    categories: ["Brand Identity", "Packaging", "Digital"],
    role: "Graphic Designer", // [VERIFY]
    tools: ["Adobe Illustrator", "Photoshop", "Figma"], // [VERIFY]
    theme: "#8B4513",
    isFlagship: true,
    overview: {
      challenge:
        "Virasat needed a brand identity that honored Indian heritage craft traditions while feeling contemporary enough for a young urban audience. The name means 'legacy'—the design had to carry that weight without becoming kitsch. [VERIFY]",
      approach:
        "Rooted the identity in traditional Indian motifs redrawn with geometric precision. Earthy palette, handmade textures, and a bilingual type system that bridges Hindi and English seamlessly. Extended into packaging and landing page design.",
      outcome:
        "Complete brand system including packaging, digital touchpoints, and landing pages. Two distinct project phases delivered. [VERIFY]",
    },
    heroImage: "/images/virasat/48efc260-bdc9-45e8-a456-04596f13009f.png",
    secondaryImage: "/images/virasat/5322914d-b835-472d-883d-998b03d7c537.png",
    ogImage: "/images/virasat/48efc260-bdc9-45e8-a456-04596f13009f.png",
    images: [
      { src: "/images/virasat/48efc260-bdc9-45e8-a456-04596f13009f.png", alt: "Virasat brand hero", layout: "full-bleed" },
      { src: "/images/virasat/5322914d-b835-472d-883d-998b03d7c537.png", alt: "Virasat packaging", layout: "single" },
      { src: "/images/virasat/c25b6862-cf7b-4689-ba51-c3a46afba85b.png", alt: "Virasat patterns", layout: "diptych" },
      { src: "/images/virasat/d9332d4e-5919-4b5c-b9a8-2f1014728069.png", alt: "Virasat typography system", layout: "diptych" },
      { src: "/images/virasat/ecfa0ade-7f90-4fe4-832a-5871cc3cc380.png", alt: "Virasat collateral", layout: "single" },
      { src: "/images/virasat-landing-pages/0f1d7fce-935f-4b87-abf2-d3e66f8d37e6.png", alt: "Virasat landing page design", layout: "full-bleed" },
      { src: "/images/virasat-landing-pages/1f74c014-aeb7-460c-9e8f-9a064dc116ca.png", alt: "Virasat landing page mobile", layout: "single" },
    ],
  },

  // === STANDARD CASE STUDIES ===
  {
    title: "Pawfect Bowls, Pet Packaging",
    slug: "pawfect-bowls",
    year: 2026,
    categories: ["Packaging", "Illustration"],
    role: "Graphic Designer", // [VERIFY]
    tools: ["Adobe Illustrator", "Photoshop"], // [VERIFY]
    theme: "#E8A838",
    isFlagship: false,
    overview: {
      challenge:
        "The pet food aisle is a wall of sameness—cartoon dogs and stock-photo cats. Pawfect Bowls needed packaging that pet parents would proudly leave on the counter. [VERIFY]",
      approach:
        "Hand-illustrated pet portraits with a warm, sketchy line quality. Each flavor variant features a different breed in a playful pose. Muted pastels let the illustrations lead.",
      outcome:
        "Complete packaging system across 8 SKUs with consistent shelf presence. [VERIFY]",
    },
    heroImage: "/images/pawfect-bowls/1198bd33-32d1-4cf3-9f47-79e7e9342d20.png",
    secondaryImage: "/images/pawfect-bowls/11d5bdc8-bc43-41f4-b6b1-36ed9eb9db31.png",
    ogImage: "/images/pawfect-bowls/1198bd33-32d1-4cf3-9f47-79e7e9342d20.png",
    images: [
      { src: "/images/pawfect-bowls/1198bd33-32d1-4cf3-9f47-79e7e9342d20.png", alt: "Pawfect Bowls hero", layout: "full-bleed" },
      { src: "/images/pawfect-bowls/11d5bdc8-bc43-41f4-b6b1-36ed9eb9db31.png", alt: "Pawfect Bowls packaging detail", layout: "single" },
      { src: "/images/pawfect-bowls/2e31643e-cc46-4148-8df3-1e5e503c4ce7.png", alt: "Pawfect Bowls variant lineup", layout: "diptych" },
      { src: "/images/pawfect-bowls/5c423c32-1c69-4416-a242-9d90b8a7bd2b.png", alt: "Pawfect Bowls illustrations", layout: "diptych" },
    ],
  },
  {
    title: "MOOL Mule, Carousel Design",
    slug: "mool-mule",
    year: 2026,
    categories: ["Social", "Digital"],
    role: "Graphic Designer", // [VERIFY]
    tools: ["Adobe Illustrator", "Photoshop"], // [VERIFY]
    theme: "#6B3FA0",
    isFlagship: false,
    overview: {
      challenge:
        "Social carousels scroll past in milliseconds. MOOL Mule needed swipeable content that stopped thumbs and communicated complex information in under 10 slides. [VERIFY]",
      approach:
        "Designed a carousel system with strong typographic hierarchy, bold color blocking per slide, and visual continuity that rewards the full swipe. Each slide both stands alone and connects to the next.",
      outcome:
        "A set of carousel templates adaptable across product categories. [VERIFY]",
    },
    heroImage: "/images/mool-mule/055bb933-8f6a-4786-893a-e09845d398bc.png",
    secondaryImage: "/images/mool-mule/53d92d78-e625-407d-9e9a-1f8cfeef79b5.png",
    ogImage: "/images/mool-mule/055bb933-8f6a-4786-893a-e09845d398bc.png",
    images: [
      { src: "/images/mool-mule/055bb933-8f6a-4786-893a-e09845d398bc.png", alt: "MOOL Mule carousel hero", layout: "full-bleed" },
      { src: "/images/mool-mule/53d92d78-e625-407d-9e9a-1f8cfeef79b5.png", alt: "MOOL Mule slide detail", layout: "single" },
      { src: "/images/mool-mule/960b716b-082d-43c6-bece-96534ab284b6.png", alt: "MOOL Mule full carousel spread", layout: "diptych" },
      { src: "/images/mool-mule/a5b7eb0a-4aa4-4d9f-a10c-5ca3419dea95.png", alt: "MOOL Mule carousel sequence", layout: "diptych" },
    ],
  },
  {
    title: "KUIKMA, Decathlon Paddles",
    slug: "kuikma",
    year: 2026,
    categories: ["Sports", "Packaging"],
    role: "Graphic Designer", // [VERIFY]
    tools: ["Adobe Illustrator", "Photoshop"], // [VERIFY]
    theme: "#0052A5",
    isFlagship: false,
    overview: {
      challenge:
        "Decathlon's KUIKMA range needed paddle graphics that communicated performance tier at a glance while maintaining the parent brand's accessibility. [VERIFY]",
      approach:
        "Created a visual hierarchy system: entry paddles get clean geometric patterns, mid-range adds texture depth, and pro-level gets aggressive angular compositions. All share one color logic.",
      outcome:
        "Paddle graphics for 3 performance tiers, production-ready for manufacturing. [VERIFY]",
    },
    heroImage: "/images/kuikma/939a7860-a217-429e-9aab-ba420f2f44aa.png",
    secondaryImage: "/images/kuikma/a7db290b-174c-4d16-8f82-b254306b0809.png",
    ogImage: "/images/kuikma/939a7860-a217-429e-9aab-ba420f2f44aa.png",
    images: [
      { src: "/images/kuikma/939a7860-a217-429e-9aab-ba420f2f44aa.png", alt: "KUIKMA paddles hero", layout: "full-bleed" },
      { src: "/images/kuikma/a7db290b-174c-4d16-8f82-b254306b0809.png", alt: "KUIKMA paddle detail", layout: "single" },
      { src: "/images/kuikma/e26b7cee-d78b-4f78-bfe5-7931d05e588f.png", alt: "KUIKMA performance tiers", layout: "single" },
    ],
  },
  {
    title: "Goa Sticker Collective",
    slug: "goa-sticker-collective",
    year: 2025,
    categories: ["Illustration", "Print"],
    role: "Illustrator & Designer", // [VERIFY]
    tools: ["Adobe Illustrator", "Procreate"], // [VERIFY]
    theme: "#FF6B35",
    isFlagship: false,
    overview: {
      challenge:
        "Goa's visual culture is vibrant but under-represented in souvenir design. The collective wanted stickers that locals would actually use—not tourist kitsch. [VERIFY]",
      approach:
        "Illustrated Goa's everyday moments: feni bottles, tile patterns, tuk-tuks, Konkani lettering, beach dogs. Flat color, bold outlines, small enough to stick on laptops and water bottles.",
      outcome:
        "A collection of 20+ die-cut stickers sold through local shops and online. [VERIFY]",
    },
    heroImage: "/images/goa-sticker-collective/24fc85a9-55c6-4fd5-9b5c-c54f416bbb65.png",
    secondaryImage: "/images/goa-sticker-collective/6dcbd016-0adf-420f-917a-08e21599e41b.png",
    ogImage: "/images/goa-sticker-collective/24fc85a9-55c6-4fd5-9b5c-c54f416bbb65.png",
    images: [
      { src: "/images/goa-sticker-collective/24fc85a9-55c6-4fd5-9b5c-c54f416bbb65.png", alt: "Goa Sticker Collective hero", layout: "full-bleed" },
      { src: "/images/goa-sticker-collective/6dcbd016-0adf-420f-917a-08e21599e41b.png", alt: "Sticker sheet layout", layout: "single" },
      { src: "/images/goa-sticker-collective/9019daf7-96bb-4791-a55a-c8ffd04cc53a.png", alt: "Individual sticker designs", layout: "diptych" },
      { src: "/images/goa-sticker-collective/988d148a-e1b5-432e-a639-65ec4e4846be.png", alt: "Stickers in context", layout: "diptych" },
    ],
  },
  {
    title: "Budweiser, Bar Front Design",
    slug: "budweiser",
    year: 2024,
    categories: ["Environmental", "Brand Identity"],
    role: "Graphic Designer", // [VERIFY]
    tools: ["Adobe Illustrator", "Photoshop"], // [VERIFY]
    theme: "#C8102E",
    isFlagship: false,
    overview: {
      challenge:
        "Bar fronts are large-format canvases with strict brand guidelines. The challenge: make each location feel unique while staying unmistakably Budweiser. [VERIFY]",
      approach:
        "Designed modular graphic panels that recombine for different bar widths. Core Budweiser red with metallic gold accents, oversized bowtie motif, and venue-specific custom lettering panels.",
      outcome:
        "Bar front designs deployed across multiple venues. Production files delivered for large-format print. [VERIFY]",
    },
    heroImage: "/images/budweiser/139a4ebf-6ed3-440b-847f-9152b1de744f.png",
    secondaryImage: "/images/budweiser/162b79c0-4e35-4780-a3dd-212540be7c13.png",
    ogImage: "/images/budweiser/139a4ebf-6ed3-440b-847f-9152b1de744f.png",
    images: [
      { src: "/images/budweiser/139a4ebf-6ed3-440b-847f-9152b1de744f.png", alt: "Budweiser bar front hero", layout: "full-bleed" },
      { src: "/images/budweiser/162b79c0-4e35-4780-a3dd-212540be7c13.png", alt: "Budweiser panel detail", layout: "single" },
      { src: "/images/budweiser/502ccd7a-b5ca-43b1-ad9a-bef5689615eb.png", alt: "Budweiser in-venue mock", layout: "diptych" },
      { src: "/images/budweiser/6104ed2c-b37e-4b72-a900-1ffc0935a85e.png", alt: "Budweiser modular system", layout: "diptych" },
    ],
  },
  {
    title: "Rasbhari",
    slug: "rasbhari",
    year: 2025,
    categories: ["Packaging", "Brand Identity"],
    role: "Graphic Designer", // [VERIFY]
    tools: ["Adobe Illustrator", "Photoshop"], // [VERIFY]
    theme: "#D4507A",
    isFlagship: false,
    overview: {
      challenge:
        "Rasbhari needed packaging that felt fresh and fun for a young audience while communicating natural ingredients and Indian heritage. [VERIFY]",
      approach:
        "Developed a fruit-forward illustration style with hand-drawn botanicals. Vibrant pinks and greens on kraft textures create warmth. Typography mixes Devanagari and Latin scripts.",
      outcome:
        "Complete packaging system with consistent visual language across all product variants. [VERIFY]",
    },
    heroImage: "/images/rasbhari/232b7222-2b49-4199-832a-9c346859e5cc.png",
    secondaryImage: "/images/rasbhari/4ddee317-f58b-4321-81be-7f38d324fea8.png",
    ogImage: "/images/rasbhari/232b7222-2b49-4199-832a-9c346859e5cc.png",
    images: [
      { src: "/images/rasbhari/232b7222-2b49-4199-832a-9c346859e5cc.png", alt: "Rasbhari packaging hero", layout: "full-bleed" },
      { src: "/images/rasbhari/4ddee317-f58b-4321-81be-7f38d324fea8.png", alt: "Rasbhari variant lineup", layout: "single" },
      { src: "/images/rasbhari/5b61c023-6c62-447d-9751-c37defa9615d.png", alt: "Rasbhari botanical details", layout: "diptych" },
      { src: "/images/rasbhari/5cab28d8-9f30-4d80-8a01-1706b6c06ca8.png", alt: "Rasbhari in-context shot", layout: "diptych" },
    ],
  },
  {
    title: "Twiggle",
    slug: "twiggle",
    year: 2025,
    categories: ["Brand Identity", "Packaging"],
    role: "Graphic Designer", // [VERIFY]
    tools: ["Adobe Illustrator", "Photoshop"], // [VERIFY]
    theme: "#4A7C59",
    isFlagship: false,
    overview: {
      challenge:
        "Twiggle needed a brand identity that communicated sustainability and natural ingredients without falling into cliché green-and-brown eco branding. [VERIFY]",
      approach:
        "Built the identity around organic twig-like linework and a sophisticated earth-tone palette. Clean sans-serif logotype grounds the playful illustration system.",
      outcome:
        "Full brand identity including logo, packaging templates, and brand guidelines. [VERIFY]",
    },
    heroImage: "/images/twiggle/39023032-714e-47f6-9e09-333f81ec0dcf.png",
    secondaryImage: "/images/twiggle/3b1c089b-46df-463c-a87c-ee605032b769.png",
    ogImage: "/images/twiggle/39023032-714e-47f6-9e09-333f81ec0dcf.png",
    images: [
      { src: "/images/twiggle/39023032-714e-47f6-9e09-333f81ec0dcf.png", alt: "Twiggle brand hero", layout: "full-bleed" },
      { src: "/images/twiggle/3b1c089b-46df-463c-a87c-ee605032b769.png", alt: "Twiggle packaging", layout: "single" },
      { src: "/images/twiggle/5ec3abff-f0c4-4169-a702-9290371a70ec.png", alt: "Twiggle brand elements", layout: "diptych" },
      { src: "/images/twiggle/76fb0cda-001d-45a6-a38d-b53df492f6c3.png", alt: "Twiggle application", layout: "diptych" },
    ],
  },
  {
    title: "Curalink",
    slug: "curalink",
    year: 2025,
    categories: ["Brand Identity", "Digital"],
    role: "Graphic Designer", // [VERIFY]
    tools: ["Adobe Illustrator", "Figma"], // [VERIFY]
    theme: "#2563EB",
    isFlagship: false,
    overview: {
      challenge:
        "Curalink needed a digital-first brand identity that communicated trust and care in the health-tech space without feeling cold or clinical. [VERIFY]",
      approach:
        "Chose rounded geometric forms and a warm blue palette to balance professionalism with approachability. The logomark suggests connection—two shapes meeting. Interface components follow the same soft, human geometry.",
      outcome:
        "Brand identity system with logo, color palette, typography, and UI component guidelines. [VERIFY]",
    },
    heroImage: "/images/curalink/2c86a66b-aa0c-4695-8abd-d6912970cc7e.png",
    secondaryImage: "/images/curalink/47adf066-b705-4549-a952-992683c509d0.png",
    ogImage: "/images/curalink/2c86a66b-aa0c-4695-8abd-d6912970cc7e.png",
    images: [
      { src: "/images/curalink/2c86a66b-aa0c-4695-8abd-d6912970cc7e.png", alt: "Curalink brand hero", layout: "full-bleed" },
      { src: "/images/curalink/47adf066-b705-4549-a952-992683c509d0.png", alt: "Curalink logo system", layout: "single" },
      { src: "/images/curalink/91ca1fee-46c0-434f-9360-a1ed7f163d99.png", alt: "Curalink UI components", layout: "diptych" },
      { src: "/images/curalink/abdd46b4-5b48-48cc-9c26-5aa4404a92ef.png", alt: "Curalink brand applications", layout: "diptych" },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(currentSlug: string): Project | undefined {
  const idx = projects.findIndex((p) => p.slug === currentSlug);
  if (idx === -1) return undefined;
  return projects[(idx + 1) % projects.length];
}

export function getFlagships(): Project[] {
  return projects.filter((p) => p.isFlagship);
}

/** Returns 6 case studies for the stacked-cards section. */
export function getStackedCaseStudies(): Project[] {
  const flagships = getFlagships();
  const standards = projects.filter((p) => !p.isFlagship);
  return [
    flagships[0], // NEBULA
    flagships[1], // ACCEXX
    standards[0], // Pawfect Bowls
    standards[1], // MOOL Mule
    standards[2], // KUIKMA
    flagships[2], // Virasat
  ].filter(Boolean);
}

export function getSelectedWork(): Project[] {
  const flagships = getFlagships();
  const standards = projects.filter((p) => !p.isFlagship).slice(0, 3);
  return [...flagships.slice(0, 2), ...standards, flagships[2]];
}
