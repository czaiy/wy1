import { motion } from "motion/react";
import GridMotion from "./GridMotion";
import { useLanguage } from "@/contexts/LanguageContext";

const motionImages = [
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498550744921-75f79806b8a7?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1455218873509-8097305ee378?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502780402662-acc019176e3a?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498855926480-d98e83099315?w=1200&q=82&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=82&auto=format&fit=crop",
];

export function StatsSection() {
  const { t } = useLanguage();
  const stats = t.stats;
  const gridMotionItems = motionImages;

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#071f33] flex items-center justify-center">
      <div className="absolute inset-0 opacity-[0.72] saturate-[0.9]">
        <GridMotion items={gridMotionItems} gradientColor="rgba(12, 48, 76, 0.55)" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(123,203,255,0.14),transparent_42%),linear-gradient(180deg,rgba(3,18,31,0.42),rgba(3,18,31,0.54))]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 flex items-center justify-center w-full">
        <div className="liquid-glass rounded-3xl border border-white/16 bg-black/20 p-12 shadow-[0_34px_120px_rgba(0,0,0,0.42)] md:p-16">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.v}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-center md:text-left"
              >
                <div className="font-heading text-5xl leading-none text-white italic md:text-6xl lg:text-7xl">
                  {s.v}
                </div>
                <div className="mt-3 font-body text-sm font-light tracking-wider text-white/60 uppercase">
                  {s.l}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
