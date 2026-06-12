import { useEffect, useRef } from "react";

interface VideoBgProps {
  src: string;
  className?: string;
  saturate?: boolean;
  poster?: string;
}

export function VideoBg({ src, className = "", saturate = true, poster }: VideoBgProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (src.endsWith(".m3u8")) {
      // dynamic import to keep client-only
      import("hls.js").then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src;
        }
      });
    } else {
      video.src = src;
    }
  }, [src]);

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
      style={{ filter: saturate ? undefined : "saturate(0)" }}
    />
  );
}
