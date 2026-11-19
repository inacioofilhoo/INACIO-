import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const { fontFamily: SANS } = loadFont("normal", {
  weights: ["600", "700", "800", "900"],
  subsets: ["latin"],
});
export const { fontFamily: MONO } = loadMono("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});

export const ORANGE = "#FF6A00";
export const RED = "#E8261C";
export const BG = "#050505";
export const W = 1080;
export const H = 1920;

export const ci = (
  f: number,
  a: number,
  b: number,
  c = 0,
  d = 1,
  easing: (t: number) => number = Easing.bezier(0.22, 1, 0.36, 1),
) =>
  interpolate(f, [a, b], [c, d], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const useSpring = (
  delay = 0,
  config: { damping?: number; stiffness?: number; mass?: number } = {
    damping: 14,
    stiffness: 180,
  },
) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config });
};

export const glow = (c = ORANGE, s = 1) =>
  `0 0 ${24 * s}px ${c}cc, 0 0 ${70 * s}px ${c}88, 0 0 ${140 * s}px ${c}44`;

export const headline = (
  size: number,
  color = "#fff",
): React.CSSProperties => ({
  fontFamily: SANS,
  fontWeight: 900,
  fontSize: size,
  letterSpacing: "-0.035em",
  lineHeight: 0.92,
  color,
  textTransform: "uppercase",
  textAlign: "center",
  margin: 0,
});

/** Entrada com pop (opcionalmente elástico) e saída com fade. */
export const Pop: React.FC<{
  delay?: number;
  out?: number;
  from?: number;
  elastic?: boolean;
  y?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, out, from = 0.4, elastic, y = 0, style, children }) => {
  const f = useCurrentFrame();
  const s = useSpring(
    delay,
    elastic
      ? { damping: 7, stiffness: 150, mass: 0.7 }
      : { damping: 15, stiffness: 190 },
  );
  const o = out !== undefined ? ci(f, out, out + 6, 1, 0) : 1;
  const scale = interpolate(s, [0, 1], [from, 1]);
  return (
    <div
      style={{
        transform: `translateY(${(1 - s) * y}px) scale(${scale})`,
        opacity: Math.min(1, Math.max(0, s * 1.6)) * o,
        filter: `blur(${Math.max(0, (1 - s) * 12)}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Wrapper de cena: entrada com zoom-blur e leve push-in contínuo. */
export const Scene: React.FC<{
  children: React.ReactNode;
  enter?: boolean;
  drift?: number;
  dur: number;
}> = ({ children, enter = true, drift = 0.05, dur }) => {
  const f = useCurrentFrame();
  const e = enter ? ci(f, 0, 8, 1, 0) : 0;
  const push = 1 + (f / dur) * drift;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${push * (1 + e * 0.14)})`,
        filter: e > 0.01 ? `blur(${e * 14}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Backdrop: React.FC<{
  glowAt?: [number, number];
  intensity?: number;
  color?: string;
}> = ({ glowAt = [50, 50], intensity = 0.35, color = ORANGE }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 70% 45% at ${glowAt[0]}% ${glowAt[1]}%, ${color}${Math.round(
        intensity * 255,
      )
        .toString(16)
        .padStart(2, "0")} 0%, transparent 70%), ${BG}`,
    }}
  />
);

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.85) 100%)",
      pointerEvents: "none",
    }}
  />
);

export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: "screen" }}>
      <svg width={W} height={H}>
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed={f % 12}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Partículas subindo (brasas / poeira). */
export const Embers: React.FC<{
  n?: number;
  color?: string;
  seed?: string;
  speed?: number;
}> = ({ n = 40, color = ORANGE, seed = "e", speed = 1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(n).fill(0).map((_, i) => {
        const x = random(`${seed}x${i}`) * W;
        const y0 = random(`${seed}y${i}`) * H;
        const sp = (0.6 + random(`${seed}s${i}`) * 2.2) * speed;
        const size = 2 + random(`${seed}z${i}`) * 6;
        const y = (((y0 - f * sp * 3) % H) + H) % H;
        const fl = 0.4 + 0.6 * Math.abs(Math.sin(f * 0.15 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(f * 0.04 + i) * 20,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity: fl * 0.9,
              boxShadow: `0 0 ${size * 3}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Faíscas orbitando um centro (órbita inclinada em 3D). */
export const Sparks: React.FC<{
  cx: number;
  cy: number;
  r: number;
  n?: number;
  tilt?: number;
}> = ({ cx, cy, r, n = 16, tilt = 0.32 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(n).fill(0).map((_, i) => {
        const base = (i / n) * Math.PI * 2;
        const sp = 0.05 + random(`sp${i}`) * 0.04;
        const a = base + f * sp;
        const rr = r * (0.85 + random(`rr${i}`) * 0.3);
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr * tilt - Math.cos(a) * 40;
        const depth = (Math.sin(a) + 1) / 2;
        const len = 18 + depth * 34;
        const ang = (Math.atan2(Math.cos(a) * tilt, -Math.sin(a)) * 180) / Math.PI;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: len,
              height: 3 + depth * 4,
              borderRadius: 4,
              transform: `translate(-50%,-50%) rotate(${ang}deg)`,
              background: `linear-gradient(90deg, transparent, #ffd08a, #fff)`,
              opacity: 0.35 + depth * 0.65,
              boxShadow: `0 0 12px ${ORANGE}, 0 0 24px ${ORANGE}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Orb: React.FC<{
  size: number;
  red?: boolean;
  style?: React.CSSProperties;
}> = ({ size, red, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: red
        ? `radial-gradient(circle at 32% 28%, #ffe3d6 0%, #ff8a70 6%, #f0412a 24%, ${RED} 42%, #8a0d06 74%, #240200 100%)`
        : `radial-gradient(circle at 32% 28%, #fff6e0 0%, #ffc070 6%, #ff8a1a 22%, ${ORANGE} 40%, #c43d00 72%, #2e0a00 100%)`,
      boxShadow: `0 0 ${size * 0.22}px ${red ? RED : ORANGE}aa, 0 0 ${
        size * 0.6
      }px ${red ? RED : ORANGE}55, inset -${size * 0.08}px -${size * 0.1}px ${
        size * 0.2
      }px rgba(0,0,0,.55)`,
      ...style,
    }}
  />
);

/** Texto 3D: extrusão sólida atrás + face com gradiente na frente. */
export const Extruded: React.FC<{
  text: string;
  size: number;
  depth?: number;
  glowStrength?: number;
}> = ({ text, size, depth = 18, glowStrength = 1 }) => {
  const shadows = new Array(depth)
    .fill(0)
    .map((_, i) => `0 ${i + 1}px 0 hsl(22, 100%, ${32 - i * 1.2}%)`)
    .join(", ");
  const base: React.CSSProperties = {
    ...headline(size),
    position: "absolute",
    left: 0,
    right: 0,
    lineHeight: 1,
  };
  return (
    <div style={{ position: "relative", height: size, width: "100%" }}>
      <div
        style={{
          ...base,
          color: "#a83a00",
          textShadow: `${shadows}, 0 ${depth + 10}px 40px rgba(0,0,0,.6), ${glow(
            ORANGE,
            glowStrength * 1.6,
          )}`,
        }}
      >
        {text}
      </div>
      <div
        style={{
          ...base,
          background:
            "linear-gradient(170deg, #fff4d6 0%, #ffb347 22%, #FF6A00 52%, #d94a00 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Legenda interna do vídeo (2–4 palavras), com palavras em destaque. */
export const Caption: React.FC<{
  chunks: { from: number; to: number; text: string; hl?: string[] }[];
  y?: number;
}> = ({ chunks, y = 1480 }) => {
  const f = useCurrentFrame();
  const c = chunks.find((k) => f >= k.from && f < k.to);
  if (!c) return null;
  const local = f - c.from;
  const s = ci(local, 0, 6, 0, 1);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 80,
        right: 80,
        textAlign: "center",
        transform: `scale(${0.85 + s * 0.15})`,
        opacity: s,
      }}
    >
      <div style={{ display: "inline-block", padding: "14px 30px 18px 52px", borderRadius: 28, background: "rgba(0,0,0,.62)", backdropFilter: "blur(8px)" }}>
      {c.text.split(" ").map((w, i) => (
        <span
          key={i}
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 74,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: c.hl?.includes(w) ? ORANGE : "#fff",
            textShadow: c.hl?.includes(w)
              ? glow(ORANGE, 0.5)
              : "0 4px 18px rgba(0,0,0,.8)",
            marginRight: 22,
          }}
        >
          {w}
        </span>
      ))}
      </div>
    </div>
  );
};

/** Card escuro com ícone laranja que entra pela esquerda. */
export const Card: React.FC<{
  delay: number;
  icon: React.ReactNode;
  pre?: string;
  bold: string;
  top: number;
  out?: number;
  dim?: number;
}> = ({ delay, icon, pre, bold, top, out, dim = 1 }) => {
  const f = useCurrentFrame();
  const s = useSpring(delay, { damping: 16, stiffness: 170 });
  const o = out !== undefined ? ci(f, out, out + 8, 1, 0) : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top,
        height: 150,
        borderRadius: 30,
        background: "linear-gradient(180deg, #1a1411 0%, #0e0b0a 100%)",
        border: `2px solid ${ORANGE}55`,
        boxShadow: `0 20px 60px rgba(0,0,0,.6), 0 0 40px ${ORANGE}22`,
        display: "flex",
        alignItems: "center",
        gap: 32,
        padding: "0 36px",
        transform: `translateX(${(1 - s) * -1100}px) skewX(${(1 - s) * 12}deg)`,
        opacity: Math.min(1, s * 2) * o * dim,
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 22,
          background: `linear-gradient(145deg, #ff8a2a, ${ORANGE} 55%, #c44700)`,
          boxShadow: glow(ORANGE, 0.35),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ fontFamily: SANS, textTransform: "uppercase", lineHeight: 1.05 }}>
        {pre ? (
          <div style={{ fontSize: 36, fontWeight: 700, color: "#9a8f88", letterSpacing: "0.02em" }}>
            {pre}
          </div>
        ) : null}
        <div style={{ fontSize: 56, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
          {bold}
        </div>
      </div>
    </div>
  );
};

export const Icon: React.FC<{ d: string }> = ({ d }) => (
  <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke="#130800" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export const ICONS = {
  cut: "M6 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0M6 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0M8.1 8.1L20 20M8.1 15.9L20 4",
  pen: "M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4",
  text: "M4 6h16M4 12h10M4 18h14",
  rocket: "M12 3c3 2 5 6 5 10l-2 3H9l-2-3c0-4 2-8 5-10zM9 16l-2 4M15 16l2 4M12 10v.01",
  clock: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 7v5l3 2",
  coin: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M9 9.5c0-1 1.3-1.8 3-1.8s3 .8 3 1.8-1.3 1.5-3 1.8-3 .8-3 1.8 1.3 1.8 3 1.8 3-.8 3-1.8M12 6v12",
  alert: "M12 3L2 20h20L12 3zM12 10v4M12 17v.01",
  check: "M5 12l5 5L19 7",
};
