import { motion } from "motion/react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}

export function BlurText({ text, className = "", delay = 0, as = "h2" }: BlurTextProps) {
  const words = text.split(" ");
  const MotionTag = motion[as] as typeof motion.h2;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden: { filter: "blur(10px)", opacity: 0, y: 20 },
            visible: { filter: "blur(0px)", opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
