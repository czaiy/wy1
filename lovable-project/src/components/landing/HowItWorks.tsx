import { BlurText } from "./BlurText";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const processVisuals = [
  {
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1800&q=88&auto=format&fit=crop",
    alt: "Misty valley ridges at dawn",
    accent: "from-sky-200/30",
  },
  {
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1800&q=88&auto=format&fit=crop",
    alt: "Clear alpine lake with mountain reflections",
    accent: "from-cyan-200/30",
  },
  {
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1800&q=88&auto=format&fit=crop",
    alt: "Open coastline at soft light",
    accent: "from-amber-200/25",
  },
];

export function HowItWorks() {
  const { t } = useLanguage();
  const steps = t.howItWorks.steps;
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="relative overflow-hidden bg-[#071f33] py-32 md:py-48">
      <AnimatePresence mode="wait">
        <motion.img
          key={processVisuals[activeStep].image}
          src={processVisuals[activeStep].image}
          alt={processVisuals[activeStep].alt}
          initial={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
          animate={{ opacity: 0.66, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(171,221,255,0.16),transparent_42%),linear-gradient(180deg,rgba(4,19,32,0.44),rgba(4,19,32,0.54))]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <div className="liquid-glass mb-6 inline-flex rounded-full px-3.5 py-1 text-xs font-medium text-white font-body">
            {t.howItWorks.badge}
          </div>
          <BlurText
            text={t.howItWorks.title}
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6 text-white/60 font-body font-light text-base md:text-lg"
          >
            {t.howItWorks.subtitle}
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.button
              key={s.n}
              type="button"
              onClick={() => setActiveStep(i)}
              onFocus={() => setActiveStep(i)}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-2xl border p-0 text-left transition duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                activeStep === i
                  ? "border-white/45 bg-white/16 shadow-[0_28px_80px_rgba(115,185,230,0.25)]"
                  : "border-white/14 bg-white/8 hover:border-white/30 hover:bg-white/12"
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={processVisuals[i].image}
                  alt={processVisuals[i].alt}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${processVisuals[i].accent} via-black/10 to-transparent`}
                />
              </div>
              <div className="relative p-6 md:p-8">
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-heading text-5xl italic text-white/46">{s.n}</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      activeStep === i
                        ? "bg-white shadow-[0_0_18px_rgba(255,255,255,0.8)]"
                        : "bg-white/24"
                    }`}
                  />
                </div>
                <h3 className="mb-3 font-heading text-3xl italic text-white">{s.t}</h3>
                <p className="font-body text-sm font-light leading-6 text-white/66">{s.d}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
