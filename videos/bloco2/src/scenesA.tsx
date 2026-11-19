import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import {
  Backdrop,
  Caption,
  ci,
  Embers,
  Extruded,
  glow,
  H,
  headline,
  MONO,
  Orb,
  ORANGE,
  Pop,
  RED,
  Scene,
  Sparks,
  useSpring,
  W,
} from "./lib";

const CX = W / 2;
const CY = H / 2;

/* ---------- 1. Esfera entra com zoom ---------- */
export const OrbIntro: React.FC = () => {
  const f = useCurrentFrame();
  const s = ci(f, 0, 30, 0.15, 1.15, Easing.bezier(0.16, 1, 0.3, 1));
  return (
    <Scene dur={30} enter={false}>
      <Backdrop intensity={0.25 + s * 0.15} />
      <Embers n={30} seed="o" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Orb size={640} style={{ transform: `scale(${s}) rotate(${f * 2}deg)` }} />
      </AbsoluteFill>
    </Scene>
  );
};

/* ---------- Corrente ---------- */
const Chain: React.FC<{ length: number }> = ({ length }) => {
  const links = Math.ceil(length / 44);
  return (
    <svg width={60} height={length} style={{ position: "absolute", left: -30, top: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="metal" x1="0" x2="1">
          <stop offset="0" stopColor="#3a3a3a" />
          <stop offset="0.45" stopColor="#d8d8d8" />
          <stop offset="1" stopColor="#4a4a4a" />
        </linearGradient>
      </defs>
      {new Array(links).fill(0).map((_, i) =>
        i % 2 === 0 ? (
          <ellipse key={i} cx={30} cy={i * 44 + 26} rx={15} ry={28} fill="none" stroke="url(#metal)" strokeWidth={9} />
        ) : (
          <rect key={i} x={26} y={i * 44} width={8} height={54} rx={4} fill="url(#metal)" />
        ),
      )}
    </svg>
  );
};

/* ---------- 2. Bola de demolição em pêndulo ---------- */
export const Wrecking: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const angle = 24 * Math.cos(t * Math.PI * 1.25) * Math.exp(-0.15 * t);
  const vel = Math.abs(Math.sin(t * Math.PI * 1.25));
  const depth = 0.62 + 0.18 * (1 - Math.cos(t * Math.PI * 1.25)) / 2 + t * 0.06;
  const L = 1050;
  return (
    <Scene dur={60} drift={0.04}>
      <Backdrop intensity={0.3} glowAt={[50, 60]} />
      <Embers n={35} seed="w" />
      <div
        style={{
          position: "absolute",
          left: CX,
          top: -120,
          transformOrigin: "0 0",
          transform: `scale(${depth}) rotate(${angle}deg)`,
        }}
      >
        <Chain length={L} />
        <div style={{ position: "absolute", left: -290, top: L - 40, filter: `blur(${vel * 3}px)` }}>
          <div style={{ position: "absolute", left: 250, top: -30, width: 80, height: 70, borderRadius: 14, background: "linear-gradient(90deg,#2a2a2a,#bbb,#333)" }} />
          <Orb size={580} />
        </div>
      </div>
    </Scene>
  );
};

/* ---------- 3. A bola avança e enche a tela ---------- */
export const BallRush: React.FC = () => {
  const f = useCurrentFrame();
  const s = ci(f, 0, 30, 1, 7, Easing.in(Easing.cubic));
  return (
    <Scene dur={30} enter={false}>
      <Backdrop intensity={0.4} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Orb size={560} style={{ transform: `scale(${s})`, filter: `blur(${ci(f, 10, 30, 0, 10)}px)` }} />
      </AbsoluteFill>
    </Scene>
  );
};

/* ---------- Geometria do vidro ---------- */
const N_RAD = 15;
const RADII = [0, 110, 230, 400, 640, 980, 1500];
const pt = (i: number, j: number): [number, number] => {
  const ii = ((i % N_RAD) + N_RAD) % N_RAD;
  const a = (ii / N_RAD) * Math.PI * 2 + (random(`a${ii}`) - 0.5) * 0.32 + (j > 0 ? (random(`aj${ii}-${j}`) - 0.5) * 0.12 : 0);
  const r = RADII[j] * (1 + (j > 0 ? (random(`r${ii}-${j}`) - 0.5) * 0.25 : 0));
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
};
const poly = (p: [number, number][]) => p.map((q) => q.join(",")).join(" ");

/* ---------- 4. Impacto: vidro trinca ---------- */
export const Crack: React.FC = () => {
  const f = useCurrentFrame();
  const shake = Math.max(0, 1 - f / 16);
  const sx = (random(`sx${f}`) - 0.5) * 50 * shake;
  const sy = (random(`sy${f}`) - 0.5) * 50 * shake;
  const flash = ci(f, 0, 9, 1, 0);
  return (
    <AbsoluteFill style={{ transform: `translate(${sx}px,${sy}px) scale(${1.04 + f * 0.0012})` }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #2a0f05 0%, #0a0503 60%, #000 100%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Orb size={300} red />
      </AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", filter: "drop-shadow(0 0 6px #fff) drop-shadow(0 0 18px rgba(255,255,255,.5))" }}>
        {new Array(N_RAD).fill(0).map((_, i) => {
          const p = ci(f, 0, 9, 0, 1);
          return (
            <polyline key={`r${i}`} points={poly(RADII.map((_, j) => pt(i, j)))} fill="none" stroke="#fff" strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
          );
        })}
        {RADII.slice(1, 6).map((_, jj) => {
          const j = jj + 1;
          const p = ci(f, 3 + jj * 2, 12 + jj * 2, 0, 1);
          const pts = new Array(N_RAD + 1).fill(0).map((__, i) => pt(i, j));
          return <polyline key={`c${j}`} points={poly(pts)} fill="none" stroke="#fff" strokeWidth={3 - jj * 0.4} opacity={0.9} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
        })}
      </svg>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

/* ---------- 5. Estilhaços voando para a câmera ---------- */
export const Shatter: React.FC = () => {
  const f = useCurrentFrame();
  const p = ci(f, 0, 30, 0, 1, Easing.in(Easing.quad));
  const shards: React.ReactNode[] = [];
  for (let i = 0; i < N_RAD; i++) {
    for (let j = 0; j < 5; j++) {
      const q = [pt(i, j), pt(i, j + 1), pt(i + 1, j + 1), pt(i + 1, j)];
      const c = [(q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4];
      const k = 0.6 + random(`k${i}${j}`) * 1.2;
      const dx = (c[0] - CX) * p * k * 1.6;
      const dy = (c[1] - CY) * p * k * 1.6;
      const sc = 1 + p * (1.5 + random(`s${i}${j}`) * 3);
      const rot = (random(`rot${i}${j}`) - 0.5) * 240 * p;
      const colors = [ORANGE, RED, "#ff8a2a", "#ffb15c"];
      shards.push(
        <polygon
          key={`${i}-${j}`}
          points={poly(q)}
          fill={colors[Math.floor(random(`c${i}${j}`) * 4)]}
          fillOpacity={0.85}
          stroke="#fff"
          strokeWidth={2}
          transform={`translate(${dx} ${dy}) translate(${c[0]} ${c[1]}) rotate(${rot}) scale(${sc}) translate(${-c[0]} ${-c[1]})`}
          opacity={1 - ci(f, 18, 30, 0, 1)}
        />,
      );
    }
  }
  return (
    <AbsoluteFill>
      <Backdrop intensity={0.5} />
      <Embers n={60} seed="sh" speed={3} />
      <svg width={W} height={H} style={{ position: "absolute", filter: `drop-shadow(0 0 20px ${ORANGE})` }}>
        {shards}
      </svg>
      <AbsoluteFill style={{ background: "#fff", opacity: ci(f, 0, 5, 0.6, 0) }} />
    </AbsoluteFill>
  );
};

/* ---------- 6. "VOCÊ FICOU 8 SEGUNDOS" ---------- */
export const Eight: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f * 0.18) * 0.02;
  return (
    <Scene dur={120} drift={0.06}>
      <Backdrop intensity={0.45} glowAt={[50, 46]} />
      <Embers n={40} seed="8" />
      <Pop delay={0} style={{ position: "absolute", top: 260, left: 0, right: 0 }} y={-60}>
        <p style={headline(104)}>Você ficou</p>
      </Pop>
      <Pop delay={6} elastic from={0.1} style={{ position: "absolute", top: 400, left: 0, right: 0, transform: `scale(${pulse})` }}>
        <Extruded text="8" size={720} depth={26} />
      </Pop>
      <Sparks cx={CX} cy={790} r={420} n={18} />
      <Pop delay={18} style={{ position: "absolute", top: 1180, left: 0, right: 0 }} y={40}>
        <p style={headline(120)}>Segundos</p>
      </Pop>
      <Pop delay={66} style={{ position: "absolute", top: 1340, left: 0, right: 0 }} y={40}>
        <p style={{ ...headline(92, ORANGE), textShadow: glow(ORANGE, 0.6) }}>
          quebrar a<br />sua tela?
        </p>
      </Pop>
    </Scene>
  );
};

/* ---------- 7. "E AINDA ESTÁ 00:13 AQUI." ---------- */
export const StillHere: React.FC = () => (
  <Scene dur={30} drift={0.08}>
    <Backdrop intensity={0.6} glowAt={[50, 50]} />
    <Embers n={30} seed="sh2" />
    <Pop delay={0} style={{ position: "absolute", top: 560, left: 0, right: 0 }}>
      <p style={headline(100)}>E ainda está</p>
    </Pop>
    <Pop delay={4} elastic from={0.3} style={{ position: "absolute", top: 740, left: 0, right: 0 }}>
      <p style={{ ...headline(300), fontFamily: MONO, fontWeight: 700, letterSpacing: "-0.04em", textShadow: glow(ORANGE, 1) }}>00:13</p>
    </Pop>
    <Pop delay={9} style={{ position: "absolute", top: 1100, left: 0, right: 0 }}>
      <p style={{ ...headline(180, ORANGE), textShadow: glow(ORANGE, 0.8) }}>Aqui.</p>
    </Pop>
  </Scene>
);

/* ---------- Barra de ouro 3D (CSS 3D) ---------- */
export const GoldBar: React.FC<{ scale?: number; opacity?: number }> = ({ scale = 1, opacity = 1 }) => {
  const f = useCurrentFrame();
  const ry = -28 + f * 0.9;
  const w = 620;
  const h = 170;
  const d = 300;
  const gold = (a: number) =>
    `linear-gradient(${a}deg, #fff6c4 0%, #f7d35c 25%, #d9a521 55%, #9c6d05 85%, #6b4a00 100%)`;
  const sweep = ((f * 14) % 1400) - 400;
  const face = (t: string, ww: number, hh: number, bg: string, extra?: React.ReactNode): React.ReactNode => (
    <div
      style={{
        position: "absolute",
        width: ww,
        height: hh,
        left: -ww / 2,
        top: -hh / 2,
        transform: t,
        background: bg,
        backfaceVisibility: "hidden",
        overflow: "hidden",
        boxShadow: "inset 0 0 30px rgba(120,70,0,.5)",
      }}
    >
      {extra}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: CX, top: 760, perspective: 1800, opacity, transform: `scale(${scale})` }}>
      <div style={{ transformStyle: "preserve-3d", transform: `rotateX(-24deg) rotateY(${ry}deg)` }}>
        {face(
          `translateZ(${d / 2}px)`,
          w,
          h,
          gold(175),
          <>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: 44, color: "#7a5300", letterSpacing: "0.2em", textShadow: "0 2px 0 #ffeaa0" }}>
              999.9
            </div>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: sweep, width: 120, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent)", transform: "skewX(-20deg)" }} />
          </>,
        )}
        {face(`rotateY(180deg) translateZ(${d / 2}px)`, w, h, gold(185))}
        {face(`rotateY(90deg) translateZ(${w / 2}px)`, d, h, gold(160))}
        {face(`rotateY(-90deg) translateZ(${w / 2}px)`, d, h, gold(200))}
        {face(`rotateX(90deg) translateZ(${h / 2}px)`, w, d, gold(135))}
        {face(`rotateX(-90deg) translateZ(${h / 2}px)`, w, d, "#5a3d00")}
      </div>
      <div style={{ position: "absolute", left: -400, top: 120, width: 800, height: 140, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,190,60,.35), transparent 70%)", filter: "blur(10px)" }} />
    </div>
  );
};

/* ---------- 8. "O NOME DISSO" ---------- */
export const Gold: React.FC = () => (
  <Scene dur={45} drift={0.05}>
    <Backdrop intensity={0.35} color="#f5b52a" glowAt={[50, 40]} />
    <Embers n={70} seed="g" color="#ffd36b" speed={0.4} />
    <Pop delay={0} elastic from={0.5}>
      <GoldBar />
    </Pop>
    <Caption y={1250} chunks={[{ from: 0, to: 45, text: "O nome disso", hl: ["disso"] }]} />
  </Scene>
);

/* ---------- 9. "ATENÇÃO = VENDE." ---------- */
export const Attention: React.FC = () => {
  const f = useCurrentFrame();
  const bars = [0.28, 0.42, 0.55, 0.74, 1];
  const line = ci(f, 4, 16, 0, 1);
  return (
    <Scene dur={75} drift={0.05}>
      <Backdrop intensity={0.35} glowAt={[50, 60]} />
      <Embers n={30} seed="at" color="#ffd36b" speed={0.5} />
      <div style={{ opacity: ci(f, 0, 10, 1, 0) }}>
        <GoldBar scale={ci(f, 0, 10, 1, 0.5)} />
      </div>
      <Pop delay={0} style={{ position: "absolute", top: 280, left: 0, right: 0 }}>
        <p style={headline(150)}>Atenção</p>
        <div style={{ margin: "26px auto 0", width: 640, height: 16, borderRadius: 8, background: ORANGE, boxShadow: glow(ORANGE, 0.5), transform: `scaleX(${line})` }} />
      </Pop>
      <Pop delay={12} elastic style={{ position: "absolute", top: 500, left: 0, right: 0 }}>
        <p style={headline(170, "#cfc6c0")}>=</p>
      </Pop>
      <div style={{ position: "absolute", left: 160, right: 160, top: 760, height: 520, display: "flex", alignItems: "flex-end", gap: 36, borderBottom: "4px solid #333" }}>
        {bars.map((b, i) => {
          const s = ci(f, 14 + i * 5, 34 + i * 5, 0, 1, Easing.out(Easing.back(1.6)));
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${b * 100 * s}%`,
                borderRadius: "16px 16px 4px 4px",
                background: i === bars.length - 1 ? `linear-gradient(180deg,#ffb15c,${ORANGE})` : `linear-gradient(180deg,${ORANGE}cc,${ORANGE}44)`,
                boxShadow: i === bars.length - 1 ? glow(ORANGE, 0.6) : undefined,
              }}
            />
          );
        })}
      </div>
      <Pop delay={40} elastic from={0.3} style={{ position: "absolute", top: 1360, left: 0, right: 0 }}>
        <p style={{ ...headline(210, ORANGE), textShadow: glow(ORANGE, 1) }}>Vende.</p>
      </Pop>
    </Scene>
  );
};

/* ---------- 10. "MAS" ---------- */
export const Mas: React.FC = () => {
  const s = useSpring(0, { damping: 8, stiffness: 160, mass: 0.6 });
  return (
    <Scene dur={30} drift={0.1}>
      <Backdrop intensity={0.55} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <p style={{ ...headline(370), transform: `scale(${interpolate(s, [0, 1], [2.2, 1])})`, opacity: Math.min(1, s * 2), textShadow: glow(ORANGE, 1.4) }}>Mas</p>
      </AbsoluteFill>
    </Scene>
  );
};
