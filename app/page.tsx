import { HeroSection } from "@/components/home/hero";
import { FlipDeck } from "@/components/home/flip-deck";
import { AboutSection } from "@/components/home/about-section";
import { SkillsSection } from "@/components/home/skills-section";
import { ServicesSection } from "@/components/home/services-section";
import { LottieHeart } from "@/components/home/lottie-heart";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FlipDeck />
      <AboutSection />
      <SkillsSection />
      <ServicesSection />
      {/* CreativeLab hidden — component kept in components/home/creative-lab.tsx
          so it can be restored by re-adding the import and this line. */}
      <LottieHeart />
    </>
  );
}
