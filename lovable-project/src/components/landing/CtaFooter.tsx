import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { VideoBg } from "./VideoBg";
import { BlurText } from "./BlurText";
import { useLanguage } from "@/contexts/LanguageContext";

export function CtaFooter() {
  const { t } = useLanguage();

  return (
    <section className="relative py-32 md:py-48 overflow-hidden">
      <VideoBg
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
        className="opacity-40"
        saturate={false}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-black to-transparent" />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <BlurText
          text={t.ctaFooter.title}
          as="h2"
          className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tight leading-[0.95]"
        />
        <motion.p
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 text-white/60 font-body font-light text-base md:text-lg max-w-xl mx-auto"
        >
          {t.ctaFooter.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center"
        >
          <button className="liquid-glass-strong rounded-full px-6 py-3 flex items-center gap-2 transition-all hover:bg-white/20 text-white font-body">
            {t.ctaFooter.primaryCta}
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button className="bg-white text-black rounded-full px-6 py-3 font-medium transition-all hover:bg-gray-200 font-body">
            {t.ctaFooter.secondaryCta}
          </button>
        </motion.div>

        <div className="mt-32 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white/40 text-xs font-body">{t.ctaFooter.copyright}</div>
          <div className="flex items-center gap-6 text-white/60 text-xs font-body">
            {t.ctaFooter.links.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
