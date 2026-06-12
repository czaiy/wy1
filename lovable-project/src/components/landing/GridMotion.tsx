import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import "./GridMotion.css";

type GridMotionProps = {
  items?: ReactNode[];
  gradientColor?: string;
};

const totalItems = 28;
const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
const fallbackImages = [
  "https://picsum.photos/seed/atlas-motion-fallback-1/1200/800",
  "https://picsum.photos/seed/atlas-motion-fallback-2/1200/800",
  "https://picsum.photos/seed/atlas-motion-fallback-3/1200/800",
  "https://picsum.photos/seed/atlas-motion-fallback-4/1200/800",
];

export default function GridMotion({ items = [], gradientColor = "black" }: GridMotionProps) {
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mouseXRef = useRef(0);

  const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

  useEffect(() => {
    mouseXRef.current = window.innerWidth / 2;
    gsap.ticker.lagSmoothing(0);

    const handleMouseMove = (event: MouseEvent) => {
      mouseXRef.current = event.clientX;
    };

    const updateMotion = () => {
      const maxMoveAmount = 300;
      const baseDuration = 0.8;
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

      rowRefs.current.forEach((row, index) => {
        if (!row) return;

        const direction = index % 2 === 0 ? 1 : -1;
        const moveAmount =
          ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

        gsap.to(row, {
          x: moveAmount,
          duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    };

    gsap.ticker.add(updateMotion);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(updateMotion);
    };
  }, []);

  return (
    <div className="grid-motion">
      <section
        className="grid-motion__intro"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`,
        }}
      >
        <div className="grid-motion__container">
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid-motion__row"
              ref={(element) => {
                rowRefs.current[rowIndex] = element;
              }}
            >
              {Array.from({ length: 7 }).map((_, itemIndex) => {
                const content = combinedItems[rowIndex * 7 + itemIndex];
                const fallbackImage =
                  fallbackImages[(rowIndex * 7 + itemIndex) % fallbackImages.length];
                return (
                  <div key={itemIndex} className="grid-motion__item">
                    <div className="grid-motion__item-inner">
                      {typeof content === "string" && content.startsWith("http") ? (
                        <img
                          className="grid-motion__item-img"
                          src={content}
                          alt=""
                          draggable={false}
                          loading="eager"
                          decoding="async"
                          onError={(event) => {
                            const image = event.currentTarget;
                            if (image.dataset.fallbackApplied === "true") return;

                            image.dataset.fallbackApplied = "true";
                            image.src = fallbackImage;
                          }}
                        />
                      ) : (
                        <div className="grid-motion__item-content">{content}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="grid-motion__fullview" />
      </section>
    </div>
  );
}
