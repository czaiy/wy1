import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { LandscapeGallery } from "@/components/landing/LandscapeGallery";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesAlternating } from "@/components/landing/FeaturesAlternating";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { StatsSection } from "@/components/landing/StatsSection";
import { Testimonials } from "@/components/landing/Testimonials";
import { CtaFooter } from "@/components/landing/CtaFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Landscape Atlas - Where the light keeps moving" },
      {
        name: "description",
        content:
          "A cinematic landscape gallery for mountains, lakes, forests, coastlines, and quiet light.",
      },
      { property: "og:title", content: "Landscape Atlas - Where the light keeps moving" },
      {
        property: "og:description",
        content:
          "A cinematic landscape gallery for mountains, lakes, forests, coastlines, and quiet light.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative z-10 overflow-hidden bg-black text-white">
      <Navbar />
      <LanguageSwitcher />
      <Hero />
      <FeaturesAlternating />
      <FeaturesGrid />
      <StatsSection />
      <Testimonials />
      <HowItWorks />
      <LandscapeGallery />
      <CtaFooter />
    </main>
  );
}
