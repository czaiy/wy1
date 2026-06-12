import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BlurText } from "./BlurText";
import { useLanguage } from "@/contexts/LanguageContext";

const journalImages = [
  "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=1800&q=88&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1800&q=88&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1800&q=88&auto=format&fit=crop",
];

export function Testimonials() {
  const { t } = useLanguage();
  const [activeQuote, setActiveQuote] = useState(0);
  const quotes = t.testimonials.quotes;

  return (
    <section id="journal" className="relative overflow-hidden bg-[#071f33] py-32 md:py-48">
      <AnimatePresence mode="wait">
        <motion.img
          key={journalImages[activeQuote]}
          src={journalImages[activeQuote]}
          alt=""
          initial={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
          animate={{ opacity: 0.62, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(170,215,255,0.12),transparent_42%),linear-gradient(180deg,rgba(4,18,28,0.5),rgba(4,18,28,0.56))]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body mb-6">
            {t.testimonials.badge}
          </div>
          <BlurText
            text={t.testimonials.title}
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.n}
              tabIndex={0}
              onClick={() => setActiveQuote(i)}
              onFocus={() => setActiveQuote(i)}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`liquid-glass group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl p-8 transition duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                activeQuote === i ? "border-white/36 bg-white/14" : "hover:bg-white/10"
              }`}
            >
              <img
                src={journalImages[i]}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.24] transition duration-700 group-hover:scale-105 group-hover:opacity-[0.36]"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.46),rgba(0,0,0,0.72)_55%,rgba(0,0,0,0.84)),radial-gradient(circle_at_30%_0%,rgba(200,230,255,0.16),transparent_44%)]" />
              <blockquote className="relative font-heading italic text-white text-2xl leading-snug">
                "{q.q}"
              </blockquote>
              <figcaption className="relative mt-8 pt-6 border-t border-white/10">
                <div className="text-white font-body text-sm">{q.n}</div>
                <div className="text-white/50 font-body font-light text-xs mt-1">{q.r}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
