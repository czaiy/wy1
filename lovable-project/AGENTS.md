# AGENTS.md

## 项目概览

这是一个 Lovable 导出的 TanStack Start 项目，当前目录为：

`D:\xz\WY\wy1\lovable-project`

项目当前被改造成一个暗色、沉浸式的风景展示页，主题大致是 `Landscape Atlas`：山脉、湖泊、森林、海岸、光线和旅行手记。首页是单页 landing page，通过锚点滚动到不同 section。

主要技术栈：

- React 19
- TypeScript
- TanStack Router / TanStack Start
- Vite
- Tailwind CSS v4
- Radix UI / shadcn 风格组件
- `motion` 用于入场动画和滚动动画
- `lucide-react` 用于图标
- `hls.js` 用于 Mux/HLS 视频播放
- `ogl` 用于 React Bits 的 WebGL 圆弧画廊

## 常用命令

在项目根目录运行：

```bash
npm run dev
npm run build
npm run build:dev
npm run lint
npm run format
```

本地开发常用地址：

`http://localhost:5173/`

如果浏览器显示 `127.0.0.1 拒绝建立连接`，通常是 Vite dev server 没有启动或已经退出。可以重新运行：

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

构建已验证过可以通过：

```bash
npm run build
```

## 目录结构

核心源码在 `src`：

- `src/routes/index.tsx`：首页入口，按顺序组合所有 landing section。
- `src/routes/__root.tsx`：根路由、HTML shell、字体链接、全局 Provider、错误页。
- `src/router.tsx`：创建 TanStack Router，并启用 scroll restoration。
- `src/contexts/LanguageContext.tsx`：中英文文案和语言切换状态。
- `src/styles.css`：Tailwind v4 入口、主题变量、字体类、毛玻璃工具类。
- `src/components/landing/*`：页面主要视觉区块。
- `src/components/ui/*`：shadcn/Radix 风格基础 UI 组件。
- `src/lib/*`：工具函数、错误捕获、SSR 错误页等。

生成物和依赖目录：

- `node_modules`：依赖目录，不要手动编辑。
- `dist`：构建产物，不要手动编辑。
- `.tanstack`、`src/routeTree.gen.ts`：TanStack 生成内容，通常不要手动编辑。
- `.codex-ssr-server.mjs`、`.codex-static-server.cjs`：SSR/静态服务器生成文件，不要手动编辑。
- `chrome-cdp-profile`、`page-*.png`：之前调试浏览器和截图留下的临时文件，不属于页面源码。
- `*.err.log`、`*.out.log`：调试日志，不属于页面源码。

## 首页结构

`src/routes/index.tsx` 当前组合顺序：

1. `Navbar`
2. `LanguageSwitcher`
3. `Hero`
4. `FeaturesAlternating`
5. `FeaturesGrid`
6. `StatsSection`
7. `Testimonials`
8. `HowItWorks`
9. `LandscapeGallery`
10. `CtaFooter`

重要锚点：

- `#about`：Hero 区
- `#gallery`：灵感图集 / CircularGallery 区
- `#work`：风景场景区
- `#process`：观景流程区
- `#features`：季节/时刻区
- `#journal`：手记区

## 关键组件说明

### `Hero.tsx`

Hero 使用 Mux HLS 视频作为全屏背景：

- playback id: `UJyrVRVtpnd201YxDj00cgMGtZlz5LtOkLBWoUPiq01OUI`
- HLS 地址来自 `https://stream.mux.com/...m3u8`
- poster 来自 `https://image.mux.com/.../thumbnail.jpg`

Hero 中央使用 `hero-glass-panel` 毛玻璃面板。文案来自 `LanguageContext.tsx` 的 `t.hero`。

### `LandscapeGallery.tsx`

这是 `#gallery` 区域。它现在引入了 React Bits 风格的 `CircularGallery`：

```tsx
import CircularGallery from "./CircularGallery";
```

图片目前使用 Unsplash 远程图，文字标签跟随语言切换。画廊容器是深色玻璃面板，内部由 WebGL canvas 渲染。

注意：当前磁盘上的 `LandscapeGallery.tsx` 中文文案看起来仍有乱码，浏览器里可能因为热更新/缓存显示过正常版本。以后如果继续改中文，优先直接检查并修复这个文件里的 `zh` 数组和中文标题。

### `CircularGallery.tsx`

这是从 React Bits 的 `CircularGallery` 移植来的 TypeScript 版本。核心依赖是：

```json
"ogl": "^1.0.11"
```

组件行为：

- 使用 `ogl` 创建 WebGL renderer、camera、scene、plane。
- 每张图片是一个弯曲排列的 WebGL plane。
- 标签文字先画到 canvas，再作为 texture 渲染。
- 支持鼠标拖拽、触摸拖拽和滚轮滚动。
- 支持 `items`、`bend`、`textColor`、`borderRadius`、`font`、`fontUrl`、`scrollSpeed`、`scrollEase` 等 props。

CSS 在 `CircularGallery.css`，只负责容器尺寸、overflow 和 grab cursor。

### `LanguageContext.tsx`

语言默认值是中文：

```tsx
const [language, setLanguage] = useState<Language>("zh");
```

`LanguageSwitcher` 通过 `toggle()` 在 `zh` 和 `en` 之间切换。

重要问题：当前文件里的大量中文字符串已经出现 mojibake 乱码，例如导航、Hero、流程、统计、footer 等。视觉上的“文字不对”多数不是字体问题，而是这里的中文源文案已经损坏。需要修复中文内容时，应优先处理这个文件。

### `VideoBg.tsx`

通用视频背景组件：

- 如果 `src` 以 `.m3u8` 结尾，会动态加载 `hls.js`。
- 普通 mp4 直接赋给 video。
- 默认 autoplay、loop、muted、playsInline。

`HowItWorks`、`StatsSection`、`CtaFooter` 当前使用 Google 示例 mp4 视频。

### `BlurText.tsx`

把文本按空格拆成多个 word，然后逐个 blur/fade in。中文没有空格时会整体作为一个片段动画。若未来需要更细中文动画，需要改成按字拆分或手动传入分词。

## 样式和字体约定

全局样式在 `src/styles.css`。

不要在 `styles.css` 顶部加入这种远程字体导入：

```css
@import url("https://fonts.googleapis.com/...");
```

之前这样做会触发 Lightning CSS 把 URL 当成本地路径读取，导致类似错误：

`ENOENT: no such file or directory, open '...\https:\fonts.googleapis.com\...'`

当前正确做法是在 `src/routes/__root.tsx` 的 `head.links` 中加载 Google Fonts。

已定义的字体类：

- `.font-heading`：`Instrument Serif`
- `.font-body`：`Barlow`
- `.font-zh-serif`：`Noto Serif SC` 优先

毛玻璃类：

- `.liquid-glass`
- `.liquid-glass-strong`
- `.hero-glass-panel`

整体设计语言：

- 黑色背景
- 森林/山海/湖泊远程图片
- 大量半透明边框和 backdrop blur
- 慢速、柔和、带 blur 的 motion 入场动画
- 英文用 italic serif，中文用宋/思源风格 serif

## 配置注意事项

### Vite / Lovable

`vite.config.ts` 使用：

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
```

这个 Lovable 配置已经内置：

- TanStack Start
- React plugin
- Tailwind plugin
- tsconfig paths
- Nitro build 配置
- `@` alias
- React/TanStack dedupe
- Lovable 错误日志插件

不要手动重复添加这些插件，否则容易出现重复插件或构建异常。

### TypeScript

`tsconfig.json` 只包含：

- `src/**/*.ts`
- `src/**/*.tsx`
- `vite.config.ts`
- `eslint.config.js`

没有启用 `allowJs`，所以新增组件应优先写 `.ts` / `.tsx`，不要直接放 `.jsx`。

路径别名：

```ts
"@/*": ["./src/*"]
```

### ESLint / Prettier

Prettier 配置：

```json
{
  "printWidth": 100,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all"
}
```

`.prettierignore` 忽略：

- `node_modules`
- `dist`
- `.output`
- `.vinxi`
- lock 文件（`package-lock.json`、`bun.lock`、`pnpm-lock.yaml`）
- `routeTree.gen.ts`

ESLint 关闭了 `@typescript-eslint/no-unused-vars`，但启用了 React hooks 推荐规则和 Prettier 推荐规则。

ESLint 还禁止从 `server-only` 导入（TanStack Start 不使用 Next.js 的 `server-only` 包）。如果需要服务端限定模块，用 `*.server.ts` 命名或 `@tanstack/react-start/server-only` 标记。

## 当前已知问题

1. `LanguageContext.tsx` 中文大面积乱码。
2. `LandscapeGallery.tsx` 磁盘内容中的中文也有乱码迹象。
3. `vite.config.ts` 和 `server.ts` 注释里也有少量乱码字符，不过不影响运行。
4. 项目当前目录看起来不是 git 仓库，`git status` 在这里会报 `not a git repository`。
5. 根目录有调试残留：`chrome-cdp-profile` 和 `page-*.png`，不是源码。
6. 页面依赖远程资源：Mux、Unsplash、Google Fonts、Google 示例视频；离线或网络受限时视觉可能不完整。

## 修改建议

继续优化页面时，优先顺序建议：

1. 修复 `LanguageContext.tsx` 和 `LandscapeGallery.tsx` 的中文乱码。
2. 保持字体通过 `__root.tsx` 加载，不要改回 CSS `@import url(...)`。
3. 修改 landing section 时优先复用现有 `liquid-glass`、`font-heading`、`font-body`、`font-zh-serif`。
4. 新增图片尽量使用可公开引用的 URL 或项目内资源，不要直接盗链 Pinterest 图片。
5. 修改 `CircularGallery` 后同时跑 `npm run build`，并在浏览器检查 `#gallery` 是否有 canvas。
6. 不要编辑 `dist`、`node_modules`、`.tanstack`、`routeTree.gen.ts`。

## 验证记录

最近一次有效验证：

- `npm run build` 通过。
- `http://localhost:5173/?v=circular-gallery-final#gallery` 返回 200。
- 浏览器运行时曾检查到 `#gallery` 内有 1 个 canvas，尺寸正常。

如果后续刷新页面显示旧内容、文字未变化或页面打不开，先确认 dev server 是否仍在运行，再清缓存参数，例如：

`http://localhost:5173/?v=check-1#gallery`
