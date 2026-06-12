import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, toggle } = useLanguage();
  const label = language === "en" ? "EN" : "ZH";

  return (
    <div className="fixed top-6 right-6 md:top-8 md:right-8 z-[60]">
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.95 }}
        className="liquid-glass rounded-full w-10 h-8 flex items-center justify-center text-xs font-medium text-white cursor-pointer overflow-hidden"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={label}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute"
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
