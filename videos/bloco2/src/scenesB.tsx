import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import {
  Backdrop,
  Caption,
  Card,
  ci,
  Embers,
  Extruded,
  glow,

  headline,
  Icon,
  ICONS,
  MONO,
  ORANGE,
  Pop,
  RED,
  SANS,
  Scene,
  Sparks,
  useSpring,
  W,
} from "./lib";

/**
 * VALORES DO PAINEL: substitua por números reais das suas campanhas
 * antes de publicar (resultado fictício em anúncio = propaganda enganosa).
 */
export const PAINEL = {
  faturamento: 45982.63,
  lucro: 34629.22,
  gastos: 11353.41,
};

const brl = (v: number) =>
  "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Header: React.FC<{ text: string; top?: number; size?: number; color?: string }> = ({ text, top = 220, size = 96, color = "#fff" }) => (
  <Pop delay={0} y={-50} style={{ position: "absolute", top, left: 60, right: 60 }}>
    <p style={{ ...headline(size, color), textShadow: color === ORANGE ? glow(ORANGE, 0.6) : undefined }}>{text}</p>
  </Pop>
);

/* ---------- 11. "MAS VOCÊ… NÃO SABE" ---------- */
export const MasVoce: React.FC = () => {
  const f = useCurrentFrame();
  const chart = ci(f, 30, 110, 0, 1, Easing.inOut(Easing.cubic));
  const pts = [
    [0, 40], [120, 70], [220, 50], [330, 150], [430, 130], [560, 250], [680, 230], [800, 330], [900, 380],
  ];
  const clips = [
    ["#ff6a00", 0, 220], ["#3a7bff", 240, 140], ["#2dd4a0", 400, 260], ["#b45cff", 680, 200],
    ["#ffcc33", 60, 180], ["#ff4d6d", 260, 300], ["#3a7bff", 580, 280],
  ] as const;
  return (
    <Scene dur={150} drift={0.04}>
      <Backdrop intensity={0.25} glowAt={[50, 30]} />
      <Header text="Mas você…" top={250} size={110} />
      <Card delay={8} top={470} icon={<Icon d={ICONS.cut} />} pre="não sabe" bold="editar" />
      <Card delay={30} top={650} icon={<Icon d={ICONS.pen} />} pre="não sabe" bold="escrever o roteiro" />
      <Card delay={66} top={830} icon={<Icon d={ICONS.text} />} pre="não sabe" bold="copy" />
      <Card delay={84} top={1010} icon={<Icon d={ICONS.rocket} />} pre="não sabe" bold="subir campanhas" />
      {/* timeline de edição */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 1250, height: 150, opacity: ci(f, 20, 34, 0, 0.9), borderRadius: 18, background: "#0f0f0f", border: "2px solid #222", overflow: "hidden" }}>
        {clips.map(([c, x, w], i) => (
          <div key={i} style={{ position: "absolute", left: 20 + x, top: i < 4 ? 22 : 84, width: w * ci(f, 20 + i * 3, 40 + i * 3, 0, 1), height: 46, borderRadius: 8, background: c, opacity: 0.8 }} />
        ))}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 20 + ((f * 7) % 860), width: 4, background: "#fff" }} />
      </div>
      {/* gráfico caindo + alerta */}
      <svg width={W} height={460} style={{ position: "absolute", top: 1420, left: 0 }}>
        <polyline points={pts.map(([x, y]) => `${x + 90},${y}`).join(" ")} fill="none" stroke={RED} strokeWidth={10} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - chart} style={{ filter: `drop-shadow(0 0 12px ${RED})` }} />
      </svg>
      <Pop delay={100} elastic style={{ position: "absolute", top: 1450, right: 90 }}>
        <svg width={170} height={150} viewBox="0 0 24 21">
          <path d="M12 1L1 20h22L12 1z" fill={ORANGE} style={{ filter: `drop-shadow(0 0 2px ${ORANGE})` }} />
          <path d="M12 8v5M12 16v.5" stroke="#130800" strokeWidth={2.4} strokeLinecap="round" />
        </svg>
      </Pop>
      {[0, 1, 2].map((i) => (
        <Pop key={i} delay={110 + i * 6} y={-200} style={{ position: "absolute", top: 1690 + i * 10, left: 140 + i * 230 }}>
          <svg width={140} height={110} viewBox="0 0 140 110">
            <polygon points={`10,${30 + i * 5} 50,8 95,20 132,${12 + i * 8} 125,70 98,102 46,94 8,80`} fill="#d9d4cc" stroke="#888" strokeWidth={2} />
            <polyline points="30,40 70,52 110,36 M40,70 85,60" fill="none" stroke="#999" strokeWidth={2} />
          </svg>
        </Pop>
      ))}
    </Scene>
  );
};

/* ---------- Ampulheta ---------- */
const Hourglass: React.FC<{ p: number }> = ({ p }) => {
  const f = useCurrentFrame();
  const top = 1 - p;
  return (
    <svg width={260} height={420} viewBox="0 0 260 420" style={{ filter: `drop-shadow(0 0 30px ${ORANGE}55)` }}>
      <defs>
        <linearGradient id="wood" x1="0" x2="1"><stop offset="0" stopColor="#3b2210" /><stop offset=".5" stopColor="#8a5a2b" /><stop offset="1" stopColor="#3b2210" /></linearGradient>
        <linearGradient id="sand" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ffb15c" /><stop offset="1" stopColor={ORANGE} /></linearGradient>
        <clipPath id="topGlass"><path d="M50 40 H210 C210 120 140 170 132 210 H128 C120 170 50 120 50 40Z" /></clipPath>
        <clipPath id="botGlass"><path d="M128 210 H132 C140 250 210 300 210 380 H50 C50 300 120 250 128 210Z" /></clipPath>
      </defs>
      <rect x={20} y={14} width={220} height={28} rx={8} fill="url(#wood)" />
      <rect x={20} y={378} width={220} height={28} rx={8} fill="url(#wood)" />
      <rect x={34} y={40} width={10} height={340} fill="url(#wood)" />
      <rect x={216} y={40} width={10} height={340} fill="url(#wood)" />
      <rect x={0} y={210 - top * 160} width={260} height={top * 170} fill="url(#sand)" clipPath="url(#topGlass)" />
      <path d={`M50 380 Q130 ${380 - p * 170} 210 380 Z`} fill="url(#sand)" clipPath="url(#botGlass)" />
      {p < 0.98 ? <rect x={128.5} y={208} width={3} height={172 - p * 150} fill="#ffc27a" opacity={0.7 + Math.sin(f) * 0.3} /> : null}
      <path d="M50 40 H210 C210 120 140 170 132 210 C140 250 210 300 210 380 H50 C50 300 120 250 128 210 C120 170 50 120 50 40Z" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.45)" strokeWidth={3} />
      <path d="M68 60 C70 110 100 150 118 180" stroke="rgba(255,255,255,.35)" strokeWidth={5} fill="none" strokeLinecap="round" />
    </svg>
  );
};

const Wallet: React.FC = () => (
  <div style={{ position: "relative", width: 380, height: 260, borderRadius: 34, background: "linear-gradient(160deg,#7a4524 0%,#4a2612 60%,#2c1608 100%)", boxShadow: "0 30px 60px rgba(0,0,0,.7), inset 0 2px 0 rgba(255,255,255,.12)" }}>
    <div style={{ position: "absolute", inset: 14, borderRadius: 24, border: "3px dashed rgba(230,180,130,.45)" }} />
    <div style={{ position: "absolute", right: -10, top: 80, width: 170, height: 100, borderRadius: "26px 0 0 26px", background: "linear-gradient(160deg,#6b3b1e,#3a1d0c)", boxShadow: "-8px 6px 20px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 30, top: 32, width: 36, height: 36, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#fff,#bbb 40%,#666)" }} />
    </div>
  </div>
);

/* ---------- 12. "MESMO QUE SOUBESSE…" ---------- */
export const MesmoQue: React.FC = () => {
  const f = useCurrentFrame();
  const big = useSpring(236, { damping: 11, stiffness: 120 });
  const count = Math.round(ci(f, 240, 262, 0, 3000, Easing.out(Easing.cubic)));
  const smallOut = 228;
  return (
    <Scene dur={300} drift={0.05}>
      <Backdrop intensity={0.28} glowAt={[50, 35]} />
      <Embers n={25} seed="mq" />
      <Header text="Mesmo que soubesse…" top={200} size={90} />
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 70, opacity: ci(f, smallOut, smallOut + 10, 1, 0.25) }}>
        <Pop delay={6} y={60}><div style={{ transform: `rotate(${Math.sin(f * 0.04) * 4}deg)` }}><Hourglass p={ci(f, 0, 300, 0.05, 0.9, Easing.linear)} /></div></Pop>
        <Pop delay={14} y={60}><Wallet /></Pop>
      </div>
      <Card delay={72} top={900} out={smallOut} icon={<Icon d={ICONS.clock} />} pre="não tem" bold="tempo" />
      <Card delay={100} top={1080} out={smallOut} icon={<Icon d={ICONS.coin} />} pre="ou" bold="recursos" />
      <Card delay={186} top={1260} out={smallOut} icon={<Icon d={ICONS.alert} />} pre="tudo isso" bold="custa caro" />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 960,
          height: 420,
          borderRadius: 40,
          background: "linear-gradient(180deg,#1d130d,#0c0807)",
          border: `3px solid ${ORANGE}`,
          boxShadow: glow(ORANGE, 0.6),
          transform: `scale(${interpolate(big, [0, 1], [0.3, 1])})`,
          opacity: Math.min(1, big * 2),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, color: "#cfc6c0", textTransform: "uppercase", letterSpacing: "0.02em" }}>Só o editor:</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 170, color: ORANGE, letterSpacing: "-0.04em", textShadow: glow(ORANGE, 0.8), lineHeight: 1 }}>
          R$ {count.toLocaleString("pt-BR")}
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: "#fff" }}>/MÊS</div>
      </div>
    </Scene>
  );
};

/* ---------- 13. "AGORA NÃO" ---------- */
export const AgoraNao: React.FC = () => {
  const f = useCurrentFrame();
  const wipe = ci(f, 0, 7, 0, 100, Easing.out(Easing.cubic));
  const w2 = ci(f, 16, 24, 0, 100, Easing.out(Easing.cubic));
  const s = useSpring(3, { damping: 12, stiffness: 200 });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ background: `linear-gradient(135deg,#ff7d1f,${ORANGE} 60%,#e85a00)`, clipPath: `inset(0 ${100 - wipe}% 0 0)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${1 + f * 0.002})` }}>
        <p style={{ ...headline(250, "#0a0300"), transform: `scale(${interpolate(s, [0, 1], [1.6, 1])})`, opacity: Math.min(1, s * 2) }}>Agora</p>
        <p style={{ ...headline(250, "#0a0300"), clipPath: `inset(0 ${100 - w2}% 0 0)` }}>não</p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Figura humana neon ---------- */
const TOOLS = ["camera", "laptop", "clapper", "megaphone", "chart"] as const;
const NeonPerson: React.FC<{ tool: (typeof TOOLS)[number]; size?: number; lens?: boolean }> = ({ tool, size = 190, lens }) => {
  const s = { stroke: ORANGE, strokeWidth: 5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size * 0.7} height={size} viewBox="0 0 70 100" style={{ filter: `drop-shadow(0 0 3px ${ORANGE}) drop-shadow(0 0 10px ${ORANGE}) drop-shadow(0 0 22px #ff4d00)`, overflow: "visible" }}>
      <circle cx={35} cy={14} r={9} {...s} />
      <path d="M35 24 V58 M35 58 L24 92 M35 58 L46 92 M35 32 L18 50 M35 32 L54 44" {...s} />
      {tool === "camera" && <><rect x={50} y={34} width={18} height={13} rx={2} {...s} strokeWidth={3} /><circle cx={59} cy={40.5} r={3.5} {...s} strokeWidth={2.5} /></>}
      {tool === "laptop" && <path d="M48 36 h16 v11 h-16z M45 50 h22" {...s} strokeWidth={3} />}
      {tool === "clapper" && <path d="M48 38 h18 v12 h-18z M48 38 l4 -6 h14 l-4 6 M54 32 l-3 6 M60 32 l-3 6" {...s} strokeWidth={3} />}
      {tool === "megaphone" && <path d="M50 40 l14 -8 v20 l-14 -8z M50 40 v4" {...s} strokeWidth={3} />}
      {tool === "chart" && <path d="M50 50 v-8 M56 50 v-13 M62 50 v-18" {...s} strokeWidth={3} />}
      {lens && <><circle cx={62} cy={34} r={11} {...s} strokeWidth={3.5} /><path d="M55 42 L50 47" {...s} strokeWidth={4} /></>}
    </svg>
  );
};

const Fire: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ filter: "blur(50px)", opacity: 0.85 }}>
      {new Array(6).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: -200 + i * 40, right: -200, top: 1050 + i * 120 + Math.sin(f * 0.06 + i) * 70, height: 260, borderRadius: "50%", background: i % 2 ? `${ORANGE}aa` : "#ff2a0088", transform: `rotate(${Math.sin(f * 0.03 + i) * 8}deg)` }} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -200, height: 700, background: "radial-gradient(ellipse at 50% 100%, #ffb15c 0%, #ff6a00aa 30%, transparent 70%)" }} />
    </AbsoluteFill>
  );
};

/* ---------- 14. 15 profissionais ---------- */
export const Fifteen: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Scene dur={165} drift={0.05}>
      <AbsoluteFill style={{ background: "#070302" }} />
      <Fire />
      <Embers n={60} seed="15" speed={1.6} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <p style={{ ...headline(1000, "transparent"), WebkitTextStroke: `4px ${ORANGE}55`, opacity: ci(f, 0, 20, 0, 0.6), transform: `scale(${1 + f * 0.001})`, marginTop: -100 }}>15</p>
      </AbsoluteFill>
      <Header text="Com" top={170} size={110} color={ORANGE} />
      {[0, 1, 2].map((row) => (
        <div key={row} style={{ position: "absolute", top: 400 + row * 270, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 36 }}>
          {[0, 1, 2, 3, 4].map((c) => {
            const i = row * 5 + c;
            return (
              <Pop key={c} delay={8 + i * 4} y={80} from={0.6}>
                <NeonPerson tool={TOOLS[(i + row) % TOOLS.length]} />
              </Pop>
            );
          })}
        </div>
      ))}
      <Caption
        y={1300}
        chunks={[
          { from: 0, to: 38, text: "Uma agência inteira", hl: ["agência", "inteira"] },
          { from: 38, to: 76, text: "dentro do seu Claude", hl: ["dentro"] },
          { from: 76, to: 115, text: "com 15 profissionais", hl: ["15"] },
          { from: 115, to: 142, text: "pra fazer tudo isso", hl: ["tudo"] },
          { from: 142, to: 165, text: "e muito mais", hl: ["mais"] },
        ]}
      />
    </Scene>
  );
};

/* ---------- Balão ---------- */
const Balloon: React.FC<{ size?: number }> = ({ size = 340 }) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f * 0.07) * 6;
  return (
    <div style={{ transform: `rotate(${sway}deg) translateY(${Math.sin(f * 0.09) * 12}px)`, transformOrigin: "50% 100%" }}>
      <div style={{ width: size, height: size * 1.2, borderRadius: "50% 50% 48% 48% / 55% 55% 45% 45%", background: `radial-gradient(circle at 34% 28%, #ffe2c2 0%, #ffa24d 10%, ${ORANGE} 38%, #b33f00 85%)`, boxShadow: `${glow(ORANGE, 0.5)}, inset -20px -30px 60px rgba(0,0,0,.35)` }} />
      <div style={{ width: 26, height: 22, margin: "-4px auto 0", background: "#c44700", clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
      <svg width={size} height={420} style={{ display: "block" }}>
        <path d={`M${size / 2} 0 C ${size / 2 + 30} 100, ${size / 2 - 40 + sway * 4} 220, ${size / 2 + 10} 420`} stroke="#cfc6c0" strokeWidth={3} fill="none" />
      </svg>
    </div>
  );
};

const Needle: React.FC<{ x: number }> = ({ x }) => (
  <div style={{ position: "absolute", top: 640, left: x, width: 420, height: 10, transform: "rotate(-14deg)" }}>
    <div style={{ width: "100%", height: 8, background: "linear-gradient(180deg,#fff,#9a9a9a 50%,#555)", clipPath: "polygon(0 50%, 12% 0, 100% 0, 100% 100%, 12% 100%)", borderRadius: 4 }} />
    <div style={{ position: "absolute", right: -40, top: -16, width: 60, height: 40, borderRadius: 20, background: RED }} />
  </div>
);

/* ---------- 15. "ATÉ MESMO UM VÍDEO EDITADO" ---------- */
export const BalloonScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Scene dur={45} drift={0.05}>
      <Backdrop intensity={0.3} glowAt={[40, 40]} />
      <div style={{ position: "absolute", left: 250, top: 340 }}><Balloon /></div>
      <Needle x={ci(f, 0, 45, 980, 640, Easing.inOut(Easing.quad))} />
      <Caption y={1420} chunks={[{ from: 0, to: 22, text: "Até mesmo um", hl: ["um"] }, { from: 22, to: 45, text: "vídeo editado", hl: ["editado"] }]} />
    </Scene>
  );
};

/* ---------- 16. "COMO ESSE AQUI." ---------- */
export const ComoEsse: React.FC = () => (
  <Scene dur={30} drift={0.08}>
    <Backdrop intensity={0.5} glowAt={[50, 40]} />
    <Embers n={30} seed="ce" />
    <Pop delay={0} elastic from={0.2} style={{ position: "absolute", top: 420, left: 0, right: 0 }}>
      <Extruded text="8" size={460} depth={18} />
    </Pop>
    <Sparks cx={W / 2} cy={650} r={300} n={14} />
    <Pop delay={5} style={{ position: "absolute", top: 1060, left: 0, right: 0 }}>
      <p style={{ ...headline(140, ORANGE), textShadow: glow(ORANGE, 0.8) }}>Como esse<br />aqui.</p>
    </Pop>
  </Scene>
);

/* ---------- iPhone no tripé ---------- */
const PhoneTripod: React.FC = () => {
  const f = useCurrentFrame();
  const rec = Math.floor(f / 12) % 2 === 0;
  return (
    <div style={{ position: "relative", width: 300, height: 900 }}>
      <div style={{ position: "absolute", left: 30, top: 0, width: 240, height: 480, borderRadius: 40, background: "linear-gradient(160deg,#2b2b2e,#0b0b0c)", border: "6px solid #3a3a3d", boxShadow: "0 30px 70px rgba(0,0,0,.7)" }}>
        <div style={{ position: "absolute", inset: 14, borderRadius: 28, background: "linear-gradient(180deg,#1a0d06,#2b1306)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 18, top: 22, display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: "#fff" }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: RED, opacity: rec ? 1 : 0.25, boxShadow: rec ? `0 0 14px ${RED}` : undefined }} />
            REC
          </div>
          <div style={{ position: "absolute", left: "50%", bottom: 26, width: 70, height: 70, marginLeft: -35, borderRadius: 35, border: "5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 46, height: 46, borderRadius: 23, background: RED }} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 130, top: 480, width: 40, height: 60, background: "#222" }} />
      <svg width={300} height={380} style={{ position: "absolute", top: 520, left: 0 }}>
        <path d="M150 0 L40 370 M150 0 L260 370 M150 0 L150 380" stroke="#555" strokeWidth={12} strokeLinecap="round" />
      </svg>
    </div>
  );
};

/* ---------- 17. "OU QUEM SABE UM VÍDEO SEU" ---------- */
export const PhoneScene: React.FC = () => (
  <Scene dur={60} drift={0.05}>
    <Backdrop intensity={0.3} glowAt={[30, 40]} />
    <Embers n={20} seed="ph" />
    <div style={{ position: "absolute", left: 90, top: 330, transform: "scale(.8)" }}><Balloon /></div>
    <Pop delay={4} y={120} style={{ position: "absolute", left: 640, top: 360 }}><PhoneTripod /></Pop>
    <Caption y={1420} chunks={[{ from: 0, to: 28, text: "Ou quem sabe", hl: ["sabe"] }, { from: 28, to: 60, text: "um vídeo seu", hl: ["seu"] }]} />
  </Scene>
);

/* ---------- Item de checklist ---------- */
const Check: React.FC<{ delay: number; text: string; top: number; plus?: boolean }> = ({ delay, text, top, plus }) => {
  const s = useSpring(delay, { damping: 14, stiffness: 180 });
  const tick = ci(useCurrentFrame(), delay + 4, delay + 12, 0, 1);
  return (
    <div style={{ position: "absolute", top, left: 100, right: 80, display: "flex", alignItems: "center", gap: 30, opacity: Math.min(1, s * 2), transform: `translateX(${(1 - s) * -200}px)` }}>
      <div style={{ width: 92, height: 92, borderRadius: 46, background: ORANGE, boxShadow: glow(ORANGE, 0.5), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: SANS, fontWeight: 900, fontSize: 60, color: "#130800" }}>
        {plus ? "+" : (
          <svg width={56} height={56} viewBox="0 0 24 24"><path d={ICONS.check} stroke="#130800" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} /></svg>
        )}
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 66, color: "#fff", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1 }}>{text}</div>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: number; color: string; delay: number }> = ({ label, value, color, delay }) => {
  const f = useCurrentFrame();
  const v = ci(f, delay, delay + 30, 0, value, Easing.out(Easing.cubic));
  return (
    <div style={{ padding: "22px 0", borderBottom: "2px solid #241a14" }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "#9a8f88" }}>{label}</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 66, color }}>{brl(v)}</div>
    </div>
  );
};

/* ---------- 18. Checklist + painel ---------- */
export const Checklist: React.FC = () => (
  <Scene dur={90} drift={0.04}>
    <Backdrop intensity={0.22} glowAt={[50, 30]} />
    <Check delay={0} top={260} text="Escreve os roteiros" />
    <Check delay={24} top={400} text="Sobe as campanhas" />
    <Check delay={50} top={540} text="Analisa os resultados" />
    <Pop delay={26} y={80} style={{ position: "absolute", top: 760, left: 90, right: 90 }}>
      <div style={{ borderRadius: 36, background: "linear-gradient(180deg,#15100d,#0b0807)", border: "2px solid #2c2019", padding: "30px 50px", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
        <Metric label="Faturamento líquido" value={PAINEL.faturamento} color="#fff" delay={32} />
        <Metric label="Lucro" value={PAINEL.lucro} color="#33d17a" delay={38} />
        <Metric label="Gastos com anúncios" value={PAINEL.gastos} color={ORANGE} delay={44} />
      </div>
    </Pop>
  </Scene>
);

/* ---------- 19. Espiona os concorrentes ---------- */
export const Espiona: React.FC = () => {
  const f = useCurrentFrame();
  const lx = 300 + Math.sin(f * 0.05) * 260;
  const ly = 760 + Math.cos(f * 0.07) * 120;
  return (
    <Scene dur={120} drift={0.05}>
      <Backdrop intensity={0.3} glowAt={[50, 45]} />
      <Check delay={0} top={200} text="Espiona os concorrentes" plus />
      <div style={{ position: "absolute", top: 400, left: 60, right: 60, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22, transform: "perspective(1400px) rotateX(10deg)" }}>
        {new Array(16).fill(0).map((_, i) => {
          const hue = Math.floor(random(`h${i}`) * 360);
          const near = Math.hypot((i % 4) * 245 + 120 - lx, Math.floor(i / 4) * 200 + 490 - ly) < 220;
          return (
            <Pop key={i} delay={4 + i * 2} from={0.7}>
              <div style={{ height: 178, borderRadius: 16, overflow: "hidden", border: `2px solid ${near ? ORANGE : "#2a2a2a"}`, background: `linear-gradient(160deg,hsl(${hue},55%,30%),hsl(${(hue + 40) % 360},45%,12%))`, boxShadow: near ? glow(ORANGE, 0.4) : undefined, position: "relative" }}>
                <div style={{ position: "absolute", left: 10, top: 10, right: 40, height: 12, borderRadius: 6, background: "rgba(255,255,255,.35)" }} />
                <div style={{ position: "absolute", left: 10, bottom: 12, width: 70, height: 22, borderRadius: 11, background: near ? ORANGE : "rgba(255,255,255,.25)" }} />
              </div>
            </Pop>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: lx - 120, top: ly - 120, width: 240, height: 240, borderRadius: 120, border: `8px solid ${ORANGE}`, boxShadow: `${glow(ORANGE, 0.6)}, inset 0 0 60px ${ORANGE}55`, background: "rgba(255,160,80,.08)", backdropFilter: "brightness(1.6) contrast(1.2)" }} />
      <Pop delay={10} y={100} style={{ position: "absolute", top: 1180, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <NeonPerson tool="chart" size={300} lens />
      </Pop>
      <Caption y={1560} chunks={[{ from: 24, to: 58, text: "na biblioteca de", hl: ["biblioteca"] }, { from: 58, to: 90, text: "anúncios da Meta", hl: ["Meta"] }, { from: 90, to: 120, text: "ou nos mais virais", hl: ["virais"] }]} />
    </Scene>
  );
};

/* ---------- 20. Cria tudo por você ---------- */
export const CriaTudo: React.FC<{ globalFrom?: number }> = ({ globalFrom = 0 }) => {
  const f = useCurrentFrame();
  const ctrl = ci(f, 26, 36, 0, 1);
  return (
    <Scene dur={60} drift={0.04}>
      <Backdrop intensity={0.35} glowAt={[50, 70]} />
      <Embers n={30} seed="ct" />
      <Check delay={0} top={220} text="Cria tudo por você" plus />
      <div style={{ position: "absolute", left: 140, right: 140, bottom: 420, height: 800, display: "flex", alignItems: "flex-end", gap: 24 }}>
        {[0.25, 0.42, 0.6, 0.8, 1].map((h, i) => {
          const s = ci(f, 4 + i * 4, 18 + i * 4, 0, 1, Easing.out(Easing.back(1.8)));
          return <div key={i} style={{ flex: 1, height: `${h * 100}%`, transform: `scaleY(${s})`, transformOrigin: "bottom", borderRadius: 18, background: `linear-gradient(180deg,#ffb15c,${ORANGE} 40%,#b33f00)`, boxShadow: glow(ORANGE, 0.4) }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 120, height: 150, opacity: ctrl, transform: `translateY(${(1 - ctrl) * 40}px)`, borderRadius: 30, background: "rgba(10,10,10,.85)", border: "2px solid #2a2a2a", display: "flex", alignItems: "center", gap: 30, padding: "0 40px" }}>
        <svg width={50} height={56} viewBox="0 0 10 12"><path d="M0 0 L10 6 L0 12z" fill="#fff" /></svg>
        <div style={{ flex: 1, height: 10, borderRadius: 5, background: "#333", overflow: "hidden" }}>
          <div style={{ width: `${96 + ctrl * 4}%`, height: "100%", background: ORANGE }} />
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, color: "#fff" }}>{"00:" + String(Math.floor((globalFrom + f) / 30) + 2).padStart(2, "0")}</div>
      </div>
    </Scene>
  );
};

