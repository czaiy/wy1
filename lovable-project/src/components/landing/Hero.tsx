import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const MUX_PLAYBACK_ID = "UJyrVRVtpnd201YxDj00cgMGtZlz5LtOkLBWoUPiq01OUI";
const HLS_SRC = `https://stream.mux.com/${MUX_PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${MUX_PLAYBACK_ID}/thumbnail.jpg?time=0`;

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { language, t } = useLanguage();
  const isZh = language === "zh";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: import("hls.js").default | undefined;

    import("hls.js").then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        hls = new Hls({ capLevelToPlayerSize: false });
        hls.loadSource(HLS_SRC);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          hls!.currentLevel = hls!.levels.length - 1;
          video.play().catch((e) => console.log("Play failed", e));
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = HLS_SRC;
        video.addEventListener("loadedmetadata", () => {
          video.play().catch((e) => console.log("Play failed", e));
        });
      }
    });

    return () => {
      hls?.destroy();
    };
  }, []);

  return (
    <section id="about" className="relative h-screen w-full overflow-hidden">
      <video
        ref={videoRef}
        poster={POSTER}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover brightness-110 contrast-110 saturate-110"
      />

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/25 via-black/5 to-black/60" />

      <div className="container relative z-20 mx-auto flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
          >
            <div className="h-[84%] w-[84%] rounded-full bg-white/6 blur-[110px]" />
          </div>

          <motion.div
            initial={{ filter: "blur(14px)", opacity: 0, y: 24 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hero-glass-panel relative flex flex-col items-center overflow-hidden rounded-[2.25rem] px-8 py-8 md:px-16 md:py-12"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-40 w-[58%] -translate-x-1/2 rounded-full bg-white/18 blur-[54px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[2.25rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.025)_42%,rgba(255,255,255,0.09))]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-[-2px] left-1/2 z-0 h-[12px] w-[30%] -translate-x-1/2 rounded-full bg-white/30 blur-[8px] md:w-[20%]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-[-1px] left-1/2 z-20 h-px w-[50%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white to-transparent md:w-[40%]"
            />

            <motion.div
              initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`liquid-glass mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium text-white ${isZh ? "font-zh-serif pl-4 pr-3.5 tracking-[0.3em]" : "font-body"}`}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/90 shadow-[0_0_16px_rgba(255,255,255,0.9)]" />
              {t.hero.badge}
            </motion.div>

            <motion.h1
              initial={{ filter: "blur(14px)", opacity: 0, y: 24 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                textShadow:
                  "0 0 15px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.15)",
              }}
              className={`text-white ${isZh ? "font-zh-serif text-5xl font-light leading-[1.15] tracking-[0.18em] [text-indent:0.18em] md:text-7xl lg:text-8xl" : "font-heading text-6xl italic leading-[0.95] tracking-tight md:text-8xl lg:text-9xl"}`}
            >
              {t.hero.titleLine1} <br /> {t.hero.titleLine2}
            </motion.h1>

            <motion.p
              initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className={`mt-8 max-w-xl text-base font-light text-white/80 md:text-lg ${isZh ? "font-zh-serif leading-[2] tracking-[0.12em]" : "font-body"}`}
            >
              {t.hero.subtitle}
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#work"
            className={`liquid-glass-strong flex rounded-full px-6 py-3 text-white transition-all hover:bg-white/20 ${isZh ? "font-zh-serif gap-2 pl-7 pr-6 tracking-[0.25em]" : "font-body items-center gap-2"}`}
          >
            {t.hero.primaryCta}
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#features"
            className={`flex rounded-full border border-white/15 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 ${isZh ? "font-zh-serif gap-2 pl-6 pr-7 tracking-[0.25em]" : "font-body items-center gap-2"}`}
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            {t.hero.secondaryCta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
