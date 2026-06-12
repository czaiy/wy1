import { motion } from "motion/react";
import AnimatedContent from "./AnimatedContent";
import { BlurText } from "./BlurText";
import { useLanguage } from "@/contexts/LanguageContext";

const media = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1400&q=88&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=88&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1400&q=88&auto=format&fit=crop",
];

export function FeaturesAlternating() {
  const { t } = useLanguage();
  const rows = t.featuresAlternating.rows.map((r, i) => ({ ...r, media: media[i] }));

  return (
    <section id="work" className="relative py-32 md:py-48">
      <div className="max-w-6xl mx-auto px-6 space-y-32 md:space-y-48">
        {rows.map((r, i) => {
          const reverse = i % 2 === 1;
          return (
            <div
              key={r.tag}
              className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <AnimatedContent
                direction="horizontal"
                reverse={reverse}
                distance={150}
                duration={1.05}
                ease="power3.out"
                initialOpacity={0.1}
                animateOpacity
                scale={0.98}
                threshold={0.22}
              >
                <div className="inline-flex liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body mb-6">
                  {r.tag}
                </div>
                <BlurText
                  text={r.title}
                  as="h2"
                  className="text-4xl md:text-5xl font-heading italic text-white tracking-tight leading-[0.95]"
                />
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="mt-6 text-white/60 font-body font-light text-base md:text-lg max-w-md"
                >
                  {r.body}
                </motion.p>
              </AnimatedContent>

              <AnimatedContent
                direction="horizontal"
                reverse={!reverse}
                distance={180}
                duration={1.15}
                ease="power3.out"
                initialOpacity={0.08}
                animateOpacity
                scale={0.94}
                threshold={0.24}
                className="relative liquid-glass rounded-3xl p-2 overflow-hidden aspect-[4/3]"
              >
                <img
                  src={r.media}
                  alt={r.title}
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
              </AnimatedContent>
            </div>
          );
        })}
      </div>
    </section>
  );
}
