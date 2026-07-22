/**
 * Site copy — single source for every user-facing string, in two voices.
 *
 * "light" — mostly English with signature desi accents (Namastey, chai).
 * "full"  — full shaam-ki-chai: Hinglish phrases + Devanagari sign-off,
 *           modeled on Ayushi's own voice (IG @_shaamkichai).
 *
 * Flip VOICE and rebuild to switch the whole site.
 *
 * Deliberately English in BOTH voices: form labels, validation, aria-labels,
 * information labels (Category/Year/Role), and SEO metadata.
 */
export type Voice = "light" | "full";

export const VOICE = "light" as Voice;

/** Pick the voice variant; strings without a `full` variant are shared. */
const v = (light: string, full?: string): string =>
  VOICE === "full" && full !== undefined ? full : light;

export const t = {
  meta: {
    siteTitle: "Ayushi Dubey — Graphic Designer",
    siteDescription:
      "Graphic designer making things you can hold, sip, play and peel — packaging, brand identity, print, and illustration, brewed with a lot of chai.",
    ogDescription: "Graphic designer making things you can hold, sip, play and peel.",
    aboutTitle: "About — Ayushi Dubey",
    aboutDescription:
      "Graphic designer from India making packaging, sports gear, bar fronts, and stickers — brands you can touch, hold, and take with you.",
    workTitle: "Work — Ayushi Dubey",
    workDescription: (count: number) =>
      `${count} projects in packaging, brand identity, sports collections, and environmental graphics.`,
    contactTitle: "Contact — Ayushi Dubey",
    contactDescription:
      "Get in touch for packaging, brand identity, sports collections, and graphic design projects.",
  },

  nav: {
    brand: "PORTFOLIO",
    resume: "Resume",
    scheduleCall: v("Schedule a call", "Chai pe charcha?"),
    links: {
      about: "About",
      work: "Work",
      contact: "Contact",
      blogs: "Blogs",
    },
  },

  footer: {
    name: "I'm Ayushi",
    taglines: [
      v("Packaging you can hold.", "Packaging jo haath mein aaye."),
      v("Brands you can feel.", "Brands jo dil se mehsoos ho."),
      v("Stickers you can peel.", "Stickers jo har jagah chipke."),
    ],
    cta: v("Start your project", "Chalo, kuch banaate hain"),
    signature: "ayushi",
    copyright: "© 2026 Ayushi Dubey. All rights reserved.",
    signOff: v("made with love and too much chai by", "प्यार और बहुत सारी chai से बनाया —"),
  },

  home: {
    hero: {
      eyebrow: "Graphic Designer",
      headline: v("Hey, I'm", "Aur, main"),
      name: "Ayushi",
      tagline: v(
        "Packaging, brand identity & stickers — design you can actually touch.",
        "Packaging, brand identity aur stickers — design jo haath se mehsoos ho.",
      ),
      bio: v(
        "I'm an independent designer making packaging, brand identity, and stickers you can actually hold — bold typography, quiet detail, and a little too much chai.",
        "Main ek independent designer — packaging, brand identity aur stickers banaati hoon jo haath mein aa sakein. Bold typography, quiet detail, aur thodi zyada chai.",
      ),
      ctaWork: v("See Work", "Kaam Dekho"),
      clickHint: v("click her ✦", "usse click karo ✦"),
      characterAlt: v(
        "Ayushi Dubey, illustrated — click to see more poses",
        "Ayushi Dubey, illustration — aur poses dekhne ke liye click karo",
      ),
      poses: [
        { alt: "Namaste pose", bubble: "Namaste! 🙏" },
        { alt: "Waving hello pose", bubble: v("Hi, I'm Ayushi ✦", "Hii, main Ayushi ✦") },
        { alt: "Peek-a-boo pose", bubble: v("Peek-a-boo!", "Dekho toh!") },
        { alt: "You found me pose", bubble: v("You found me!", "Mil gayi na!") },
        { alt: "Let's create pose", bubble: v("Let's create ✦", "Chalo, banaate hain ✦") },
        { alt: "Tadaa pose", bubble: "Tadaa!" },
        { alt: "Double thumbs-up pose", bubble: v("Yesss! 🙌", "Bilkul sahi! 🙌") },
        { alt: "Laughing pose", bubble: v("Oops, hehe! 😄", "Arre, hehe! 😄") },
      ],
    },
    stacked: {
      eyebrow: "Featured Work",
      heading: v("Made to be held", "Haath mein lo, phir samjho"),
      subheading: v(
        "Six favourite projects — packaging, gear, and brands that live off-screen.",
        "Chhe favourite kaam — packaging, gear, aur brands jo screen ke bahar jeete hain.",
      ),
      viewCaseStudy: v("View Case Study", "Poori kahaani dekho"),
      outro: (count: number) =>
        v(
          `${count} case studies · scroll to explore`,
          `${count} kahaaniyan · scroll karte raho`,
        ),
    },
    services: {
      eyebrow: "Services",
      heading: "How I can help",
      subheading: v(
        "Four ways we can make something together.",
        "Chaar tareeke jinse hum saath kuch banaa sakte hain.",
      ),
    },
    skills: {
      eyebrow: "Skills & Craft",
      heading: "My toolkit",
      body: v(
        "Drag them around — everything I reach for, in one messy, happy pile.",
        "Sab kuch drag karo — meri poori toolkit, ek masaledaar pile mein.",
      ),
    },
    creativeLab: {
      eyebrow: "Creative Lab",
      heading: "Pixels at Play",
      subheading: v(
        "Explorations, Experiments, and Escapades",
        "Experiments, masti, aur thodi si jadoogari",
      ),
      dragHint: v("Drag to explore", "Ghumao, dekho"),
      arrowsHint: "Use arrows",
    },
    outro: {
      eyebrow: v("Thanks for scrolling", "Scroll karne ke liye shukriya"),
      captionLine1: v("Crafted with love.", "Made with pyaar,"),
      captionLine2: v("Fueled by chai. ☕", "shaam ki chai ke saath ☕"),
    },
  },

  about: {
    eyebrow: "About",
    heading: v("Design you can touch", "Design jo haath se mehsoos ho"),
    portraitAlt: "Ayushi Dubey",
    bio1: v(
      "I'm Ayushi — a graphic designer who studied at NIFT and never quite got over how much fun packaging and stickers are. If it's got a shelf, a court, or a laptop lid, chances are I've designed something to go on it.",
      "Main Ayushi — NIFT se design padha, aur tab se packaging aur stickers ke pyaar se bahar nahi nikal payi. Shelf ho, court ho, ya laptop ka lid — kahin na kahin mera design chipka hoga.",
    ),
    bio2: v(
      "Since then I've worked across packaging, brand identity, environmental graphics, and illustration — always chasing the same thing: design you can actually touch.",
      "Tab se packaging, brand identity, environmental graphics aur illustration mein kaam kar rahi hoon — ek hi cheez ke peeche: design jo haath se mehsoos ho.",
    ),
    bio3: v(
      "When I'm not designing, I'm collecting stickers, watching badminton, or brewing one more round of chai.",
      "Design nahi kar rahi hoon toh stickers jama kar rahi hoon, badminton dekh rahi hoon, ya ek aur cup chai chadha rahi hoon.",
    ),
    whatIDo: "What I do",
    tools: "Tools",
    downloadResume: "Download Resume",
    getInTouch: "Get in touch",
  },

  work: {
    eyebrow: "Selected work",
    heading: v("Design you can feel", "Design you can feel"),
    subheading: v(
      "Eleven things designed to be touched, not just scrolled past — brewed with a little too much chai.",
      "Gyaarah cheezein — chhoone ke liye banayi, sirf scroll karne ke liye nahi. Thodi zyada chai ke saath.",
    ),
    projectCount: (count: number) => `${count} projects`,
  },

  caseStudy: {
    category: "Category",
    year: "Year",
    role: "Role",
    theBrief: "The Brief",
    challenge: "Challenge",
    approach: "Approach",
    outcome: "Outcome",
    nextProject: v("Next project", "Agli kahaani"),
  },

  contact: {
    eyebrow: "Contact",
    heading: v("Let's make something", "Chalo, kuch banaate hain"),
    subheading: v(
      "Have a project in mind? Drop me a message — I reply within a day, usually with chai in hand.",
      "Project hai dimaag mein? Message chhodo — ek din ke andar reply, haath mein chai ke saath.",
    ),
    preferEmail: v("Prefer email directly?", "Seedha email karna hai?"),
    form: {
      name: "Name",
      email: "Email",
      message: "Message",
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Please enter a valid email",
      messageRequired: "Message is required",
      submit: "Send message",
      submitting: "Sending",
      error: "Something went wrong. Please try again or email directly.",
      successTitle: v("Message sent", "Message mil gaya!"),
      successBody: v(
        "Thanks for reaching out! I'll get back to you soon.",
        "Jaldi reply karungi — tab tak ek cup chai bana lo ☕",
      ),
      whileYouWait: v("While you wait", "Tab tak ke liye"),
    },
  },

  notFound: {
    heading: "This page peeled off.",
    body: v(
      "Looks like this sticker didn't stick. Let's get you back to the good stuff.",
      "Yeh sticker chipak nahi paya. Chalo wapas asli maal pe.",
    ),
    cta: "View all work",
    imageAlt: "A playful sticker illustration",
  },
} as const;
