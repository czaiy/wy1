import { AnimatePresence, motion } from "motion/react";
import { Zap, Palette, BarChart3, Shield, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { BlurText } from "./BlurText";
import { useLanguage } from "@/contexts/LanguageContext";

const icons: LucideIcon[] = [Zap, Palette, BarChart3, Shield];

const featureImages = [
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&q=82&auto=format&fit=crop",
];

export function FeaturesGrid() {
  const { t } = useLanguage();
  const [activeFeature, setActiveFeature] = useState(0);
  const items = t.featuresGrid.items.map((item, i) => ({
    ...item,
    icon: icons[i],
    image: featureImages[i],
  }));

  return (
    <section id="features" className="relative overflow-hidden bg-[#071f33] py-32 md:py-48">
      <AnimatePresence mode="wait">
        <motion.img
          key={featureImages[activeFeature]}
          src={featureImages[activeFeature]}
          alt=""
          initial={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
          animate={{ opacity: 0.64, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(164,214,255,0.14),transparent_42%),linear-gradient(180deg,rgba(3,17,30,0.48),rgba(3,17,30,0.5))]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body mb-6">
            {t.featuresGrid.badge}
          </div>
          <BlurText
            text={t.featuresGrid.title}
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.button
              key={item.t}
              type="button"
              onClick={() => setActiveFeature(i)}
              onFocus={() => setActiveFeature(i)}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-2xl border p-6 text-left shadow-[0_22px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                activeFeature === i
                  ? "border-white/44 bg-white/16"
                  : "border-white/12 bg-white/7 hover:border-white/28 hover:bg-white/12"
              }`}
            >
              <img
                src={item.image}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.34] transition duration-700 group-hover:scale-105 group-hover:opacity-[0.46]"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,12,22,0.3),rgba(3,12,22,0.74)_48%,rgba(0,0,0,0.86)),radial-gradient(circle_at_30%_0%,rgba(178,220,255,0.22),transparent_48%)]" />
              <div className="liquid-glass-strong relative mb-6 flex h-10 w-10 items-center justify-center rounded-full">
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <h3 className="relative mb-2 font-heading text-2xl text-white italic">{item.t}</h3>
              <p className="relative font-body text-sm font-light leading-6 text-white/68">
                {item.d}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
