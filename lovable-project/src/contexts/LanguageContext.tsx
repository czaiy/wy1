import { createContext, useContext, useState, type ReactNode } from "react";

export type Language = "en" | "zh";

type Translations = {
  nav: { links: { label: string; href: string }[]; cta: string };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  howItWorks: {
    badge: string;
    title: string;
    subtitle: string;
    steps: { n: string; t: string; d: string }[];
  };
  featuresAlternating: {
    rows: { tag: string; title: string; body: string }[];
  };
  featuresGrid: {
    badge: string;
    title: string;
    items: { t: string; d: string }[];
  };
  stats: { v: string; l: string }[];
  testimonials: {
    badge: string;
    title: string;
    quotes: { q: string; n: string; r: string }[];
  };
  ctaFooter: {
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    copyright: string;
    links: { label: string; href: string }[];
  };
};

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      links: [
        { label: "Gallery", href: "#gallery" },
        { label: "Scenes", href: "#work" },
        { label: "Routes", href: "#process" },
        { label: "Seasons", href: "#features" },
        { label: "Journal", href: "#journal" },
      ],
      cta: "Start wandering",
    },
    hero: {
      badge: "Landscape field notes",
      titleLine1: "Where the light",
      titleLine2: "keeps moving.",
      subtitle:
        "A cinematic landscape gallery for mountains, lakes, forests, coastlines, and the quiet hours when the world changes color.",
      primaryCta: "Explore scenes",
      secondaryCta: "Watch the light",
    },
    howItWorks: {
      badge: "Viewing rhythm",
      title: "Read the landscape slowly.",
      subtitle:
        "Each scene is arranged like a field note: light, texture, air, and the path through it.",
      steps: [
        {
          n: "01",
          t: "Arrive",
          d: "Begin with the widest frame: terrain, horizon, weather, and the first tone of the place.",
        },
        {
          n: "02",
          t: "Notice",
          d: "Move closer to reflections, tree lines, mist, stone, water, and the small details that hold the view together.",
        },
        {
          n: "03",
          t: "Remember",
          d: "Leave with a compact visual note: the hour, the color, the sound, and the feeling worth returning to.",
        },
      ],
    },
    featuresAlternating: {
      rows: [
        {
          tag: "Alpine water",
          title: "Lakes that hold the sky.",
          body: "Still surfaces, snow lines, and blue-green depths composed for slow inspection.",
        },
        {
          tag: "Forest light",
          title: "Trails under a living canopy.",
          body: "Dense greens, broken sun, wet leaves, and quiet paths designed to feel immersive rather than distant.",
        },
        {
          tag: "Open horizon",
          title: "Coastlines and high passes.",
          body: "Wide edges of land and weather where the page opens up and gives the eye room to travel.",
        },
      ],
    },
    featuresGrid: {
      badge: "Season guide",
      title: "Choose the hour, not just the place.",
      items: [
        {
          t: "Dawn Mist",
          d: "Low contrast, pale gold, and soft silhouettes for reflective scenes.",
        },
        { t: "Midday Clarity", d: "Sharper stone, cleaner water, and high-definition terrain." },
        {
          t: "Blue Hour",
          d: "Cool gradients, luminous edges, and the last readable detail before night.",
        },
        { t: "Storm Light", d: "Heavy skies, sudden highlights, and landscapes with real drama." },
      ],
    },
    stats: [
      { v: "48", l: "Curated scenes" },
      { v: "12", l: "Terrain types" },
      { v: "4", l: "Season moods" },
      { v: "24h", l: "Light cycle" },
    ],
    testimonials: {
      badge: "Field notes",
      title: "Small records from the edge.",
      quotes: [
        {
          q: "The lake went silver for three minutes, then disappeared back into cloud.",
          n: "North Ridge",
          r: "06:18, early autumn",
        },
        {
          q: "Every tree held a different green. The path felt darker than the sky.",
          n: "Rain Forest Walk",
          r: "After rainfall",
        },
        {
          q: "The coast looked empty until the wind drew lines across the grass.",
          n: "Western Headland",
          r: "Blue hour",
        },
      ],
    },
    ctaFooter: {
      title: "Save a place for the next horizon.",
      subtitle:
        "Collect scenes, compare seasons, and build a visual route through quiet landscapes.",
      primaryCta: "Open the gallery",
      secondaryCta: "View seasons",
      copyright: "Copyright 2026 Landscape Atlas. All rights reserved.",
      links: [
        { label: "Archive", href: "#" },
        { label: "Map", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  },
  zh: {
    nav: {
      links: [
        { label: "图集", href: "#gallery" },
        { label: "风景", href: "#work" },
        { label: "路线", href: "#process" },
        { label: "季节", href: "#features" },
        { label: "手记", href: "#journal" },
      ],
      cta: "开始漫游",
    },
    hero: {
      badge: "风景观察手记",
      titleLine1: "光经过的",
      titleLine2: "山海之间",
      subtitle: "一个沉浸式风景展示页，收藏山脉、湖泊、森林、海岸线，以及世界变换颜色的安静时刻。",
      primaryCta: "探索风景",
      secondaryCta: "观看光影",
    },
    howItWorks: {
      badge: "观景节奏",
      title: "慢慢读懂一片风景。",
      subtitle: "每个场景都像一则野外手记：光线、纹理、空气，以及穿过它的路径。",
      steps: [
        { n: "01", t: "抵达", d: "先看最宽的画面：地形、天际线、天气，以及这个地方的第一层色调。" },
        { n: "02", t: "凝视", d: "再靠近水面、树线、薄雾、石头和那些支撑画面的细节。" },
        { n: "03", t: "记住", d: "留下一个清晰的视觉印象：时间、颜色、声音，以及值得再来的感受。" },
      ],
    },
    featuresAlternating: {
      rows: [
        {
          tag: "高山湖泊",
          title: "把天空收进水面的湖。",
          body: "静止的倒影、雪线与蓝绿色深处，适合慢慢观看。",
        },
        {
          tag: "森林光线",
          title: "活着的树冠下有路。",
          body: "浓密的绿色、碎裂的阳光、潮湿叶片和安静路径。",
        },
        {
          tag: "开阔地平线",
          title: "海岸与高地的边界。",
          body: "土地和天气交汇的宽阔边缘，让视线有足够空间远行。",
        },
      ],
    },
    featuresGrid: {
      badge: "季节指南",
      title: "选择时刻，而不只是地点。",
      items: [
        { t: "晨雾", d: "低对比、浅金色和柔软轮廓，适合安静的场景。" },
        { t: "正午清晰", d: "岩石更锐利，水面更干净，地形细节完整展开。" },
        { t: "蓝调时刻", d: "冷色渐变、发光边缘，以及入夜前最后的细节。" },
        { t: "风暴光", d: "厚重云层、突然亮起的高光，让风景带上戏剧性。" },
      ],
    },
    stats: [
      { v: "48", l: "精选场景" },
      { v: "12", l: "地貌类型" },
      { v: "4", l: "季节情绪" },
      { v: "24h", l: "光线周期" },
    ],
    testimonials: {
      badge: "野外手记",
      title: "来自边界的小记录。",
      quotes: [
        { q: "湖面有三分钟变成银色，然后又退回云里。", n: "北侧山脊", r: "06:18，初秋" },
        { q: "每棵树都有不同的绿色，路径比天空更暗。", n: "雨后森林", r: "降雨之后" },
        { q: "海岸看似空旷，直到风在草地上画出线条。", n: "西侧岬角", r: "蓝调时刻" },
      ],
    },
    ctaFooter: {
      title: "为下一道地平线留一个位置。",
      subtitle: "收藏场景、比较季节，建立一条穿过安静风景的视觉路线。",
      primaryCta: "打开图库",
      secondaryCta: "查看季节",
      copyright: "Copyright 2026 Landscape Atlas. 保留所有权利。",
      links: [
        { label: "档案", href: "#" },
        { label: "地图", href: "#" },
        { label: "联系", href: "#" },
      ],
    },
  },
};

type LanguageContextValue = {
  language: Language;
  toggle: () => void;
  setLanguage: (lang: Language) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh");
  const toggle = () => setLanguage((p) => (p === "en" ? "zh" : "en"));
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggle, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
