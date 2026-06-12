import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";

import "./CircularGallery.css";

export type CircularGalleryItem = {
  image: string;
  text: string;
};

type FontDescriptors = ConstructorParameters<typeof FontFace>[2];

const DEFAULT_FONT = "bold 30px Figtree";
const DEFAULT_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Figtree:wght@400;700&display=swap";

function debounce<T extends (...args: never[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof window.setTimeout>;
  return (...args: Parameters<T>) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
}

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: object) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    const value = (instance as Record<string, unknown>)[key];
    if (key !== "constructor" && typeof value === "function") {
      (instance as Record<string, unknown>)[key] = value.bind(instance);
    }
  });
}

function deriveFontFamilyFromUrl(url: string) {
  const fileName = (url.split("/").pop() || "custom-font").split("?")[0];
  const base = fileName.replace(/\.(woff2?|ttf|otf|eot)$/i, "");
  return base.replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "CircularGalleryFont";
}

async function loadFontFromStylesheet(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch font stylesheet (${response.status})`);

  const cssText = await response.text();
  const faceBlocks = cssText.match(/@font-face\s*{[^}]*}/g) || [];
  let family: string | null = null;
  const fontFaces: FontFace[] = [];

  for (const block of faceBlocks) {
    const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)['"]?/);
    const urlMatch = block.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
    if (!familyMatch || !urlMatch) continue;

    family = familyMatch[1].trim();
    const descriptors: FontDescriptors = {};
    const weightMatch = block.match(/font-weight:\s*([^;]+);/);
    const styleMatch = block.match(/font-style:\s*([^;]+);/);
    const rangeMatch = block.match(/unicode-range:\s*([^;]+);/);

    if (weightMatch) descriptors.weight = weightMatch[1].trim();
    if (styleMatch) descriptors.style = styleMatch[1].trim();
    if (rangeMatch) descriptors.unicodeRange = rangeMatch[1].trim();

    fontFaces.push(new FontFace(family, `url(${urlMatch[1]})`, descriptors));
  }

  if (!family) throw new Error("No @font-face rule found in the stylesheet");

  await Promise.allSettled(
    fontFaces.map(async (face) => {
      await face.load();
      document.fonts.add(face);
    }),
  );

  return family;
}

async function loadFontFromFile(url: string) {
  const family = deriveFontFamilyFromUrl(url);
  const fontFace = new FontFace(family, `url(${url})`);
  await fontFace.load();
  document.fonts.add(fontFace);
  return family;
}

async function loadCustomFont(fontUrl: string) {
  const isStylesheet = fontUrl.includes("fonts.googleapis.com") || /\.css(\?.*)?$/i.test(fontUrl);
  return isStylesheet ? loadFontFromStylesheet(fontUrl) : loadFontFromFile(fontUrl);
}

async function resolveFont(font: string, fontUrl?: string) {
  const effectiveUrl = fontUrl || (font === DEFAULT_FONT ? DEFAULT_FONT_URL : null);

  if (!effectiveUrl) {
    if (document.fonts?.load) {
      try {
        await document.fonts.load(font);
        await document.fonts.ready;
      } catch {
        // The browser can still render with its fallback font.
      }
    }
    return font;
  }

  try {
    const family = await loadCustomFont(effectiveUrl);
    const sizeMatch = font.match(/^\s*(.*?\d+px)/);
    const prefix = sizeMatch ? sizeMatch[1].trim() : "bold 30px";
    const resolved = `${prefix} "${family}"`;

    if (document.fonts?.load) {
      try {
        await document.fonts.load(resolved);
      } catch {
        // The texture draw still attempts the requested font.
      }
    }

    return resolved;
  } catch (error) {
    console.error("CircularGallery: unable to load font from", fontUrl, error);
    return font;
  }
}

function getFontSize(font: string) {
  const match = font.match(/(\d+)px/);
  return match ? Number.parseInt(match[1], 10) : 30;
}

function createTextTexture(
  gl: WebGLRenderingContext,
  text: string,
  font = "bold 30px monospace",
  color = "black",
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create text canvas");

  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(getFontSize(font) * 1.2);

  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  gl: WebGLRenderingContext;
  plane: Mesh;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor({ gl, plane, text, textColor = "#ffffff", font = "30px sans-serif" }: TitleOptions) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor,
    );
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });

    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.10;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.45;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  extra = 0;
  geometry: Plane;
  gl: WebGLRenderingContext;
  image: string;
  index: number;
  length: number;
  scene: Transform;
  screen: Size;
  text: string;
  viewport: Size;
  bend: number;
  textColor: string;
  borderRadius: number;
  font: string;
  plane!: Mesh;
  program!: Program;
  title!: Title;
  scale = 1;
  padding = 2;
  width = 0;
  widthTotal = 0;
  x = 0;
  speed = 0;
  isBefore = false;
  isAfter = false;

  constructor(options: MediaOptions) {
    this.geometry = options.geometry;
    this.gl = options.gl;
    this.image = options.image;
    this.index = options.index;
    this.length = options.length;
    this.scene = options.scene;
    this.screen = options.screen;
    this.text = options.text;
    this.viewport = options.viewport;
    this.bend = options.bend;
    this.textColor = options.textColor;
    this.borderRadius = options.borderRadius;
    this.font = options.font;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true,
    });

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uHover;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          p.y += uHover * 0.15;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uHover;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          float brightness = mix(0.4, 1.0, uHover);
          gl_FragColor = vec4(color.rgb * brightness, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [1, 1] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uHover: { value: 1 },
      },
      transparent: true,
    });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(scroll: ScrollState, direction: Direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const halfViewportWidth = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const bendAbs = Math.abs(this.bend);
      const radius = (halfViewportWidth * halfViewportWidth + bendAbs * bendAbs) / (2 * bendAbs);
      const effectiveX = Math.min(Math.abs(x), halfViewportWidth);
      const arc = radius - Math.sqrt(radius * radius - effectiveX * effectiveX);

      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / radius);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / radius);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }

    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  setHover(hovered: boolean) {
    const target = hovered ? 1 : 0;
    this.program.uniforms.uHover.value = lerp(
      this.program.uniforms.uHover.value,
      target,
      0.12,
    );
  }

  onResize({ screen, viewport }: Partial<ResizeState> = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    this.scale = this.screen.height / 1400;
    this.plane.scale.y = (this.viewport.height * (950 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (750 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class GalleryApp {
  container: HTMLDivElement;
  bend: number;
  textColor: string;
  borderRadius: number;
  font: string;
  scrollSpeed: number;
  renderer!: Renderer;
  gl!: WebGLRenderingContext;
  camera!: Camera;
  scene!: Transform;
  screen!: Size;
  viewport!: Size;
  planeGeometry!: Plane;
  medias: Media[] = [];
  mediasImages: CircularGalleryItem[] = [];
  raf = 0;
  isDown = false;
  start = 0;
  startY = 0;
  hasDragged = false;
  scroll: ScrollState;
  onItemClick?: (item: CircularGalleryItem) => void;
  onCheckDebounce: () => void;
  boundOnResize!: () => void;
  boundOnWheel!: (event: WheelEvent) => void;
  boundOnTouchDown!: (event: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (event: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: (event: MouseEvent | TouchEvent) => void;
  boundOnMouseMove!: (event: MouseEvent) => void;
  hoveredMedia: Media | null = null;

  constructor(
    container: HTMLDivElement,
    {
      items,
      bend = 1,
      textColor = "#ffffff",
      borderRadius = 0,
      font = DEFAULT_FONT,
      scrollSpeed = 2,
      scrollEase = 0.05,
      onItemClick,
    }: GalleryAppOptions = {},
  ) {
    document.documentElement.classList.remove("no-js");
    this.container = container;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.scrollSpeed = scrollSpeed;
    this.onItemClick = onItemClick;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0, position: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }

  createMedias(items?: CircularGalleryItem[]) {
    const defaultItems = [
      { image: "https://picsum.photos/seed/1/800/600?grayscale", text: "Bridge" },
      { image: "https://picsum.photos/seed/2/800/600?grayscale", text: "Desk Setup" },
      { image: "https://picsum.photos/seed/3/800/600?grayscale", text: "Waterfall" },
      { image: "https://picsum.photos/seed/4/800/600?grayscale", text: "Strawberries" },
      { image: "https://picsum.photos/seed/5/800/600?grayscale", text: "Deep Diving" },
      { image: "https://picsum.photos/seed/21/800/600?grayscale", text: "Coastline" },
    ];
    const galleryItems = items && items.length ? items : defaultItems;

    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend: this.bend,
        textColor: this.textColor,
        borderRadius: this.borderRadius,
        font: this.font,
      });
    });
  }

  getEventX(event: MouseEvent | TouchEvent) {
    if ("touches" in event)
      return event.touches[0]?.clientX || event.changedTouches[0]?.clientX || this.start;
    return event.clientX;
  }

  getEventY(event: MouseEvent | TouchEvent) {
    if ("touches" in event)
      return event.touches[0]?.clientY || event.changedTouches[0]?.clientY || this.startY;
    return event.clientY;
  }

  onTouchDown(event: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.hasDragged = false;
    this.scroll.position = this.scroll.current;
    this.start = this.getEventX(event);
    this.startY = this.getEventY(event);
  }

  onTouchMove(event: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const x = this.getEventX(event);
    const y = this.getEventY(event);
    this.hasDragged ||= Math.hypot(this.start - x, this.startY - y) > 8;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }

  getItemAt(event: MouseEvent | TouchEvent) {
    const rect = this.container.getBoundingClientRect();
    const x = this.getEventX(event);
    const y = this.getEventY(event);
    const worldX = ((x - rect.left) / rect.width - 0.5) * this.viewport.width;
    const worldY = (0.5 - (y - rect.top) / rect.height) * this.viewport.height;

    const candidates = this.medias
      .filter((media) => {
        const halfWidth = media.plane.scale.x * 0.5;
        const halfHeight = media.plane.scale.y * 0.5;
        return (
          worldX >= media.plane.position.x - halfWidth &&
          worldX <= media.plane.position.x + halfWidth &&
          worldY >= media.plane.position.y - halfHeight &&
          worldY <= media.plane.position.y + halfHeight
        );
      })
      .sort(
        (a, b) => Math.abs(a.plane.position.x - worldX) - Math.abs(b.plane.position.x - worldX),
      );

    const media = candidates[0];
    if (!media) return undefined;
    const sourceItems = this.mediasImages.length
      ? this.mediasImages.slice(0, this.mediasImages.length / 2)
      : [];
    return sourceItems[media.index % sourceItems.length];
  }

  onTouchUp(event: MouseEvent | TouchEvent) {
    const wasClick = this.isDown && !this.hasDragged;
    this.isDown = false;
    this.onCheck();
    if (wasClick) {
      const item = this.getItemAt(event);
      if (item) this.onItemClick?.(item);
    }
  }

  onWheel(event: WheelEvent) {
    const delta = event.deltaY || event.deltaX;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer?.setSize(this.screen.width, this.screen.height);

    if (this.camera) {
      this.camera.perspective({
        aspect: this.screen.width / this.screen.height,
      });
      const fov = (this.camera.fov * Math.PI) / 180;
      const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
      const width = height * this.camera.aspect;
      this.viewport = { width, height };
    } else {
      this.viewport = { width: 0, height: 0 };
    }

    if (this.medias.length) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport }),
      );
    }
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction: Direction = this.scroll.current > this.scroll.last ? "right" : "left";
    this.medias.forEach((media) => media.update(this.scroll, direction));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  getMediaAtPosition(event: MouseEvent): Media | null {
    const rect = this.container.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    const worldX = ((x - rect.left) / rect.width - 0.5) * this.viewport.width;
    const worldY = (0.5 - (y - rect.top) / rect.height) * this.viewport.height;

    const candidates = this.medias
      .filter((media) => {
        const halfWidth = media.plane.scale.x * 0.5;
        const halfHeight = media.plane.scale.y * 0.5;
        return (
          worldX >= media.plane.position.x - halfWidth &&
          worldX <= media.plane.position.x + halfWidth &&
          worldY >= media.plane.position.y - halfHeight &&
          worldY <= media.plane.position.y + halfHeight
        );
      })
      .sort(
        (a, b) => Math.abs(a.plane.position.x - worldX) - Math.abs(b.plane.position.x - worldX),
      );

    return candidates[0] || null;
  }

  onMouseMove(event: MouseEvent) {
    const media = this.getMediaAtPosition(event);
    if (media !== this.hoveredMedia) {
      if (this.hoveredMedia) this.hoveredMedia.setHover(false);
      if (media) media.setHover(true);
      this.hoveredMedia = media;
      this.container.style.cursor = media ? "pointer" : "grab";
    }
  }

  onMouseLeave() {
    if (this.hoveredMedia) {
      this.hoveredMedia.setHover(false);
      this.hoveredMedia = null;
      this.container.style.cursor = "grab";
    }
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnMouseMove = this.onMouseMove.bind(this);

    window.addEventListener("resize", this.boundOnResize);
    this.container.addEventListener("wheel", this.boundOnWheel, { passive: true });
    this.container.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    this.container.addEventListener("mousemove", this.boundOnMouseMove);
    this.container.addEventListener("mouseleave", this.onMouseLeave.bind(this));
    this.container.addEventListener("touchstart", this.boundOnTouchDown, { passive: true });
    this.container.addEventListener("touchmove", this.boundOnTouchMove, { passive: true });
    this.container.addEventListener("touchend", this.boundOnTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    this.container.removeEventListener("wheel", this.boundOnWheel);
    this.container.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    this.container.removeEventListener("touchstart", this.boundOnTouchDown);
    this.container.removeEventListener("touchmove", this.boundOnTouchMove);
    this.container.removeEventListener("touchend", this.boundOnTouchUp);

    if (this.renderer?.gl?.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

type Size = {
  width: number;
  height: number;
};

type ScrollState = {
  ease: number;
  current: number;
  target: number;
  last: number;
  position: number;
};

type Direction = "left" | "right";

type ResizeState = {
  screen: Size;
  viewport: Size;
};

type TitleOptions = {
  gl: WebGLRenderingContext;
  plane: Mesh;
  text: string;
  textColor?: string;
  font?: string;
};

type MediaOptions = {
  geometry: Plane;
  gl: WebGLRenderingContext;
  image: string;
  index: number;
  length: number;
  scene: Transform;
  screen: Size;
  text: string;
  viewport: Size;
  bend: number;
  textColor: string;
  borderRadius: number;
  font: string;
};

type GalleryAppOptions = {
  items?: CircularGalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  onItemClick?: (item: CircularGalleryItem) => void;
};

type CircularGalleryProps = GalleryAppOptions & {
  fontUrl?: string;
};

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = DEFAULT_FONT,
  fontUrl,
  scrollSpeed = 2,
  scrollEase = 0.05,
  onItemClick,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let app: GalleryApp | undefined;
    let isMounted = true;

    resolveFont(font, fontUrl).then((resolvedFont) => {
      if (!isMounted || !containerRef.current) return;

      app = new GalleryApp(containerRef.current, {
        items,
        bend,
        textColor,
        borderRadius,
        font: resolvedFont,
        scrollSpeed,
        scrollEase,
        onItemClick,
      });
    });

    return () => {
      isMounted = false;
      app?.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, fontUrl, scrollSpeed, scrollEase, onItemClick]);

  return <div className="circular-gallery" ref={containerRef} />;
}
