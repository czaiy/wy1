import { motion } from "motion/react";
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import CircularGallery, { type CircularGalleryItem } from "./CircularGallery";

const gallery = [
  {
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&q=85&auto=format&fit=crop",
    en: ["Misty Valley", "Dawn after rain"],
    zh: ["雾谷清晨", "雨后的第一束光"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1400&q=85&auto=format&fit=crop",
    en: ["Alpine Lake", "Cold mirror water"],
    zh: ["高山湖泊", "冰冷的镜面水色"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=85&auto=format&fit=crop",
    en: ["Deep Forest", "Canopy and shadow"],
    zh: ["深林之下", "树冠与阴影"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1400&q=85&auto=format&fit=crop",
    en: ["Quiet Mountain", "Blue hour ridge"],
    zh: ["静默山脊", "蓝调时刻"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=85&auto=format&fit=crop",
    en: ["Open Coast", "Wind across water"],
    zh: ["开阔海岸", "风掠过水面"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&q=85&auto=format&fit=crop",
    en: ["Desert Light", "Stone and distance"],
    zh: ["旷野光线", "岩石与远方"],
  },
];

export function LandscapeGallery() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  const items = useMemo<CircularGalleryItem[]>(
    () =>
      gallery.map((item) => {
        const [title, caption] = isZh ? item.zh : item.en;
        return {
          image: item.image,
          text: isZh ? title : `${title} / ${caption}`,
        };
      }),
    [isZh],
  );

  return (
    <section id="gallery" className="relative overflow-hidden bg-black py-24 md:py-36">
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ delay: 0.08, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex min-h-[85vh] flex-col overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.015))] shadow-[0_30px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl p-8 md:p-12"
        >
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.12),transparent_32%),linear-gradient(90deg,rgba(0,0,0,0.38),transparent_22%,transparent_78%,rgba(0,0,0,0.38))]" />

          <div className="relative z-20 mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className={`liquid-glass mb-4 inline-flex rounded-full px-3.5 py-1 text-xs font-medium text-white/80 ${
                  isZh ? "font-zh-serif tracking-[0.18em]" : "font-body uppercase tracking-[0.18em]"
                }`}
              >
                {isZh ? "灵感图集" : "Mood gallery"}
              </div>
              <h2
                className={`max-w-3xl text-white ${
                  isZh
                    ? "font-zh-serif text-3xl font-light leading-[1.18] tracking-[0.08em] md:text-5xl"
                    : "font-heading text-4xl italic leading-[0.9] md:text-6xl"
                }`}
              >
                {isZh ? "像从收藏夹里取出的风景。" : "Landscapes pulled from the moodboard."}
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`mt-4 max-w-md text-sm leading-7 text-white/58 md:text-base ${
                isZh ? "font-zh-serif tracking-[0.06em]" : "font-body"
              }`}
            >
              {isZh
                ? "参考 Pinterest 上暗森林、雾湖、山脊和海岸的视觉氛围，使用可公开引用的风景图片完成页面展示。"
                : "Inspired by Pinterest boards for dark forests, misty lakes, ridgelines, and coastal air, using publicly referenceable landscape imagery."}
            </motion.p>
          </div>

          <div className="relative z-20 flex flex-1 items-center justify-center">
            <CircularGallery
              items={items}
              bend={2.65}
              textColor="#f8fbff"
              borderRadius={0.065}
              scrollSpeed={1.7}
              scrollEase={0.035}
              fontUrl={
                isZh
                  ? "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600;700&display=swap"
                  : undefined
              }
              font={isZh ? 'bold 30px "Noto Serif SC"' : "bold 30px Barlow"}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
