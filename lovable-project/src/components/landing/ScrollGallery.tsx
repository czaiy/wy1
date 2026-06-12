import { useState } from "react";
import { motion } from "motion/react";
import "./ScrollGallery.css";

export type ScrollGalleryItem = {
  image: string;
  text: string;
};

type ScrollGalleryProps = {
  items: ScrollGalleryItem[];
};

export default function ScrollGallery({ items }: ScrollGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="scroll-gallery-wrapper relative w-full">
      <div className="scroll-gallery flex items-center gap-6 overflow-x-auto px-8 py-4 scrollbar-hide">
        {items.map((item, i) => {
          const isHovered = hoveredIndex === i;
          const isAnyHovered = hoveredIndex !== null;

          return (
            <motion.div
              key={item.image + i}
              className="scroll-gallery-card relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10"
              style={{
                width: 280,
                height: 380,
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              animate={{
                scale: isHovered ? 1.08 : 1,
                y: isHovered ? -12 : 0,
                zIndex: isHovered ? 20 : 1,
                filter: isAnyHovered && !isHovered ? "brightness(0.35) blur(3px)" : "brightness(1) blur(0px)",
              }}
              transition={{
                duration: 0.5,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <img
                src={item.image}
                alt={item.text}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="font-zh-serif text-lg text-white drop-shadow-lg">
                  {item.text}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
