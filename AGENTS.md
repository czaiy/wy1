# AGENTS.md

## 工作区概览

当前工作区根目录是：

`D:\xz\WY\wy1`

根目录目前包含：

- `lovable-project`：主要可运行项目，Lovable 导出的 TanStack Start / React 单页落地页应用。
- `lovable-project-3b9c8aa1-8007-4ae5-b24b-42b80ff5f00b-2026-06-08`：目前看起来是空目录。
- `lovable-project-3b9c8aa1-8007-4ae5-b24b-42b80ff5f00b-2026-06-08.zip`：Lovable 导出压缩包。
- `tp`：目前为空目录。

根目录和 `lovable-project` 目录都不是 Git 仓库，运行 `git status` 会得到 `not a git repository`。

## 必须遵守的文件操作限制

禁止批量删除文件或目录。

不要使用：

- `del /s`
- `rd /s`
- `rmdir /s`
- `Remove-Item -Recurse`
- `rm -rf`

需要删除文件时，只能一次删除一个明确路径的文件。

正确示例：

```powershell
Remove-Item "C:\path\to\file.txt"
```

如果确实需要批量删除文件，应停止操作，并请求用户手动删除。

## 主项目概览

主项目目录：

`D:\xz\WY\wy1\lovable-project`

这是一个 Lovable 导出的 TanStack Start 项目，当前被改造成深色、沉浸式风景展示 landing page，主题大致是 `Landscape Atlas`：山脉、湖泊、森林、海岸、光线和旅行/观景手记。

首页是单页应用，通过导航锚点滚动到不同 section。

主要技术栈：

- React 19
- TypeScript
- TanStack Router / TanStack Start
- Vite 7
- Tailwind CSS v4
- Radix UI / shadcn 风格基础组件
- `motion` 用于入场动画和滚动动画
- `lucide-react` 用于图标
- `hls.js` 用于 Mux / HLS 视频播放
- `ogl` 用于 WebGL 圆弧画廊

## 常用命令

在 `lovable-project` 目录运行：

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

## 目录结构

核心源码在 `lovable-project/src`：

- `src/routes/index.tsx`：首页入口，组合所有 landing section。
- `src/routes/__root.tsx`：根路由、HTML shell、全局 Provider、字体链接、错误页。
- `src/router.tsx`：创建 TanStack Router，并启用 scroll restoration。
- `src/contexts/LanguageContext.tsx`：中英文文案和语言切换状态。
- `src/styles.css`：Tailwind v4 入口、主题变量、字体类、毛玻璃工具类。
- `src/components/landing/*`：页面主要视觉区块。
- `src/components/ui/*`：shadcn/Radix 风格基础 UI 组件。
- `src/lib/*`：工具函数、错误捕获、SSR 错误页等。

不要手动编辑这些生成物或依赖目录：

- `node_modules`
- `dist`
- `.tanstack`
- `src/routeTree.gen.ts`
- `.codex-ssr-server.mjs`
- `.codex-static-server.cjs`

调试残留文件：

- `chrome-cdp-profile`
- `page-*.png`
- `*.err.log` / `*.out.log`

这些不属于页面源码。注意：即使要清理，也不能批量删除，必须遵守上面的删除限制。

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
- `#work`：风景场景区
- `#features`：季节/时刻区
- `#journal`：手记区
- `#process`：观景流程区
- `#gallery`：圆弧画廊区

## 关键组件

### `Hero.tsx`

Hero 使用 Mux HLS 视频作为全屏背景：

- playback id: `UJyrVRVtpnd201YxDj00cgMGtZlz5LtOkLBWoUPiq01OUI`
- HLS 地址来自 `https://stream.mux.com/...m3u8`
- poster 来自 `https://image.mux.com/.../thumbnail.jpg`

组件内动态加载 `hls.js`，优先用最高视频 level 播放。中心内容使用 `hero-glass-panel` 毛玻璃面板，文案来自 `LanguageContext.tsx` 的 `t.hero`。

### `LandscapeGallery.tsx`

这是 `#gallery` 区域。它使用 `CircularGallery` 渲染一个可拖动的圆弧 WebGL 图片画廊。

图片目前使用 Unsplash 远程图，点击图片会打开大图预览弹层。中文和英文标签会跟随语言状态切换。

### `CircularGallery.tsx`

这是基于 React Bits 风格移植来的 TypeScript WebGL 组件，核心依赖是：

```json
"ogl": "^1.0.11"
```

组件行为：

- 使用 `ogl` 创建 renderer、camera、scene 和 plane。
- 每张图片是一个弯曲排列的 WebGL plane。
- 标签文字先绘制到 canvas，再作为 texture 渲染。
- 支持鼠标拖拽、触摸拖拽、滚轮滚动和点击预览。
- 支持 `items`、`bend`、`textColor`、`borderRadius`、`font`、`fontUrl`、`scrollSpeed`、`scrollEase`、`onItemClick` 等 props。

CSS 在 `CircularGallery.css`，主要负责容器尺寸、overflow 和 grab cursor。

### `LanguageContext.tsx`

语言默认值是中文：

```tsx
const [language, setLanguage] = useState<Language>("zh");
```

`LanguageSwitcher` 通过 `toggle()` 在 `zh` 和 `en` 之间切换。

当前重要问题：这个文件里的大量中文字符串已经出现 mojibake 乱码，导致页面中文显示异常。后续修复中文内容时，应优先处理这里。

### `VideoBg.tsx`

通用视频背景组件：

- 如果 `src` 以 `.m3u8` 结尾，会动态加载 `hls.js`。
- 普通 mp4 会直接赋给 video。
- 默认 `autoPlay`、`loop`、`muted`、`playsInline`。

`HowItWorks`、`StatsSection`、`CtaFooter` 等 section 当前使用远程示例视频资源。

### `BlurText.tsx`

把文本按空格拆成多个 word，然后逐个 blur/fade in。中文没有空格时会整体作为一个片段动画。若未来需要更细的中文动画，需要改成按字拆分或手动传入分词。

## 样式和字体约定

全局样式在 `src/styles.css`。

不要在 `styles.css` 顶部加入远程字体导入：

```css
@import url("https://fonts.googleapis.com/...");
```

之前这样做会触发 Lightning CSS 把 URL 当成本地路径读取，导致类似错误：

`ENOENT: no such file or directory, open '...\https:\fonts.googleapis.com\...'`

当前正确做法是在 `src/routes/__root.tsx` 的 `head.links` 中加载 Google Fonts。

已定义字体类：

- `.font-heading`：`Instrument Serif`
- `.font-body`：`Barlow`
- `.font-zh-serif`：优先使用 `Noto Serif SC`

毛玻璃类：

- `.liquid-glass`
- `.liquid-glass-strong`
- `.hero-glass-panel`

整体设计语言：

- 黑色背景
- 森林、山海、湖泊远程图
- 半透明边框和 backdrop blur
- 慢速、柔和、带 blur 的 motion 入场动画
- 英文偏 italic serif，中文偏宋体/思源宋体风格 serif

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
- sandbox 检测

不要手动重复添加这些插件，否则容易出现重复插件或构建异常。

### TypeScript

`tsconfig.json` 只包含：

- `src/**/*.ts`
- `src/**/*.tsx`
- `vite.config.ts`
- `eslint.config.js`

没有启用 `allowJs`，所以新增组件应优先写 `.ts` / `.tsx`，不要直接新增 `.jsx`。

路径别名：

```json
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

## 已知问题

1. `lovable-project/AGENTS.md` 当前是乱码，不能作为可靠中文说明使用。
2. `LanguageContext.tsx` 中文文案大面积乱码。
3. `LandscapeGallery.tsx` 中文标题、描述和 aria-label 也有乱码。
4. `vite.config.ts` 和 `server.ts` 注释里有少量乱码字符，不影响运行。
5. 项目依赖远程资源：Mux、Unsplash、Google Fonts、Google 示例视频。离线或网络受限时，视觉可能不完整。
6. `lovable-project` 目录中有 `node_modules`、`dist`、Chrome profile 和截图文件，体积较大；不要把它们当作源码修改。

## 后续修改建议

继续优化页面时，建议优先顺序：

1. 修复 `LanguageContext.tsx` 和 `LandscapeGallery.tsx` 的中文乱码。
2. 保持字体通过 `__root.tsx` 加载，不要改回 CSS `@import url(...)`。
3. 修改 landing section 时优先复用现有的 `liquid-glass`、`font-heading`、`font-body`、`font-zh-serif`。
4. 新增图片尽量使用可公开引用的 URL 或项目内资源。
5. 修改 `CircularGallery` 后同时跑 `npm run build`，并在浏览器检查 `#gallery` 是否有 canvas 且能交互。
6. 不要编辑 `dist`、`node_modules`、`.tanstack`、`routeTree.gen.ts`。

## 验证建议

常规改动后至少运行：

```bash
npm run build
```

如果改了格式或大范围源码，也可以运行：

```bash
npm run lint
```

视觉相关改动建议启动 dev server 后检查：

`http://localhost:5173/`

重点看：

- 首屏视频是否播放。
- 中英文切换是否正常。
- 导航锚点是否能滚动到对应区域。
- `#gallery` 内是否渲染 WebGL canvas。
- 点击画廊图片是否能打开并关闭预览弹层。
