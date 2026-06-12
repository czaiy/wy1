import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navbar() {
  const { t, language } = useLanguage();
  const isZh = language === "zh";

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0, filter: "blur(10px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 liquid-glass rounded-full px-2 py-2 flex items-center gap-1"
    >
      <a href="#about" className="px-4 py-1.5 text-white font-heading italic text-xl">
        atlas
      </a>
      <div className="hidden md:flex items-center gap-1 px-2">
        {t.nav.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={`px-3 py-1.5 text-xs text-white/70 hover:text-white transition-colors ${isZh ? "font-zh-serif tracking-[0.12em]" : "font-body uppercase tracking-wider"}`}
          >
            {l.label}
          </a>
        ))}
      </div>
      <a
        href="#work"
        className={`liquid-glass-strong rounded-full px-4 py-2 flex items-center gap-1.5 text-xs text-white hover:bg-white/20 transition-all ${isZh ? "font-zh-serif tracking-[0.12em]" : "font-body uppercase tracking-wider"}`}
      >
        {t.nav.cta}
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    </motion.nav>
  );
}
