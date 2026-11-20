import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, random, staticFile, useCurrentFrame } from "remotion";
import {
  Backdrop,
  Caption,
  ci,
  Embers,
  Extruded,
  glow,
  H,
  headline,
  Icon,
  ICONS,
  MONO,
  ORANGE,
  Pop,
  SANS,
  Sparks,
  useSpring,
  W,
} from "./lib";
import { IMPACT } from "./impact";
import { PAINEL } from "./scenesB";

const brl = (v: number) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ---------- Fundo em vídeo (clipe do Kairogen) ---------- */
export const VideoBg: React.FC<{
  src: string;
  clipSec: number;
  dur: number;
  push?: number;
  shadeTop?: number;
  shadeBottom?: number;
  dim?: number;
}> = ({ src, clipSec, dur, push = 0.06, shadeTop = 0.75, shadeBottom = 0.6, dim = 0 }) => {
  const f = useCurrentFrame();
  // desacelera o clipe se a cena for mais longa que ele, para nunca acabar antes
  const rate = Math.min(1, ((clipSec - 0.08) * 30) / dur);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1.02 + (f / dur) * push})` }}>
        <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: W, height: H, objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,${shadeTop}) 0%, rgba(0,0,0,0) 38%, rgba(0,0,0,0) 62%, rgba(0,0,0,${shadeBottom}) 100%)`,
        }}
      />
      {dim > 0 ? <AbsoluteFill style={{ background: "#000", opacity: dim }} /> : null}
    </AbsoluteFill>
  );
};

/* ---------- Bola (clipe real) até o impacto, depois imagem congelada ---------- */
export const BallShotVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const flick = frame >= 150 && frame < 168 ? (random(`fl${frame}`) > 0.5 ? 1 : 0.15) : frame >= 168 ? 0 : 1;
  const punch = ci(frame, IMPACT - 12, IMPACT, 1, 1.18, Easing.in(Easing.quad));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: flick * (frame >= IMPACT ? 0.85 : 1), transform: `scale(${Math.min(punch, 1.18)})` }}>
        {frame < IMPACT ? (
          <OffthreadVideo src={staticFile("clip/bola.mp4")} muted playbackRate={1.25} style={{ width: W, height: H, objectFit: "cover" }} />
        ) : (
          <Img src={staticFile("img/bola-fim.png")} style={{ width: W, height: H, objectFit: "cover" }} />
        )}
      </AbsoluteFill>
      {frame < IMPACT ? <Embers n={18} seed="bv" speed={0.6} /> : null}
    </AbsoluteFill>
  );
};

/* ---------- "VOCÊ FICOU 8 SEGUNDOS" (sincronizado com a fala) ---------- */
export const EightV: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f * 0.18) * 0.02;
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + f * 0.0006})` }}>
      <Backdrop intensity={0.45} glowAt={[50, 46]} />
      <Embers n={40} seed="8v" />
      <Pop delay={0} y={-60} style={{ position: "absolute", top: 260, left: 0, right: 0 }}>
        <p style={headline(104)}>Você ficou</p>
      </Pop>
      <Pop delay={16} elastic from={0.1} style={{ position: "absolute", top: 400, left: 0, right: 0, transform: `scale(${pulse})` }}>
        <Extruded text="8" size={720} depth={26} />
      </Pop>
      <Sparks cx={W / 2} cy={790} r={420} n={18} />
      <Pop delay={27} y={40} style={{ position: "absolute", top: 1180, left: 0, right: 0 }}>
        <p style={headline(120)}>Segundos</p>
      </Pop>
      <Pop delay={58} y={40} style={{ position: "absolute", top: 1340, left: 0, right: 0 }}>
        <p style={{ ...headline(92, ORANGE), textShadow: glow(ORANGE, 0.6) }}>
          quebrar a<br />sua tela?
        </p>
      </Pop>
    </AbsoluteFill>
  );
};

/* ---------- "E AINDA ESTÁ 00:12 AQUI?" (o número é o tempo real do vídeo) ---------- */
export const StillHereV: React.FC<{ globalFrom: number }> = ({ globalFrom }) => {
  const f = useCurrentFrame();
  const s = Math.floor((globalFrom + f) / 30) + 2;
  const txt = `00:${String(s).padStart(2, "0")}`;
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + f * 0.002})` }}>
      <Backdrop intensity={0.6} />
      <Embers n={30} seed="sh3" />
      <Pop delay={0} style={{ position: "absolute", top: 560, left: 0, right: 0 }}>
        <p style={headline(100)}>E ainda está</p>
      </Pop>
      <Pop delay={4} elastic from={0.3} style={{ position: "absolute", top: 740, left: 0, right: 0 }}>
        <p style={{ ...headline(300), fontFamily: MONO, fontWeight: 700, letterSpacing: "-0.04em", textShadow: glow(ORANGE, 1) }}>{txt}</p>
      </Pop>
      <Pop delay={14} style={{ position: "absolute", top: 1100, left: 0, right: 0 }}>
        <p style={{ ...headline(180, ORANGE), textShadow: glow(ORANGE, 0.8) }}>Aqui?</p>
      </Pop>
    </AbsoluteFill>
  );
};

/* ---------- "O NOME DISSO É ATENÇÃO / ATENÇÃO = OURO / VENDE." ---------- */
export const AtencaoOuro: React.FC = () => {
  const f = useCurrentFrame();
  const DUR = 135;
  const venda = 101;
  const line = ci(f, 58, 70, 0, 1);
  const bars = [0.3, 0.45, 0.58, 0.76, 1];
  return (
    <AbsoluteFill>
      <VideoBg src="clip/ouro.mp4" clipSec={4.04} dur={DUR} shadeTop={0.85} dim={ci(f, venda - 4, venda + 6, 0, 0.55)} />
      <Caption y={1500} chunks={[{ from: 0, to: 20, text: "O nome disso", hl: ["disso"] }, { from: 20, to: 54, text: "é atenção", hl: ["atenção"] }]} />
      {f >= 54 ? (
        <>
          <Pop delay={54} style={{ position: "absolute", top: 210, left: 0, right: 0 }}>
            <p style={headline(140)}>Atenção</p>
            <div style={{ margin: "22px auto 0", width: 600, height: 14, borderRadius: 7, background: ORANGE, boxShadow: glow(ORANGE, 0.5), transform: `scaleX(${line})` }} />
          </Pop>
          <Pop delay={64} elastic style={{ position: "absolute", top: 410, left: 0, right: 0 }}>
            <p style={headline(140, "#e8e0da")}>=</p>
          </Pop>
          <Pop delay={72} out={venda - 6} elastic from={0.3} style={{ position: "absolute", top: 560, left: 0, right: 0 }}>
            <p style={{ ...headline(190), background: "linear-gradient(180deg,#fff3b0,#f5c542 45%,#b8860b)", WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 30px rgba(245,180,40,.6))" }}>Ouro</p>
          </Pop>
        </>
      ) : null}
      {f >= venda ? (
        <>
          <div style={{ position: "absolute", left: 180, right: 180, top: 640, height: 520, display: "flex", alignItems: "flex-end", gap: 34 }}>
            {bars.map((b, i) => {
              const s = ci(f, venda + i * 3, venda + 14 + i * 3, 0, 1, Easing.out(Easing.back(1.6)));
              return <div key={i} style={{ flex: 1, height: `${b * 100 * s}%`, borderRadius: "14px 14px 4px 4px", background: i === 4 ? `linear-gradient(180deg,#ffb15c,${ORANGE})` : `linear-gradient(180deg,${ORANGE}dd,${ORANGE}33)`, boxShadow: i === 4 ? glow(ORANGE, 0.6) : undefined }} />;
            })}
          </div>
          <Pop delay={venda + 6} elastic from={0.3} style={{ position: "absolute", top: 1250, left: 0, right: 0 }}>
            <p style={{ ...headline(220, ORANGE), textShadow: glow(ORANGE, 1) }}>Vende.</p>
          </Pop>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- "MAS" ---------- */
export const MasV: React.FC = () => {
  const s = useSpring(0, { damping: 8, stiffness: 160, mass: 0.6 });
  return (
    <AbsoluteFill>
      <Backdrop intensity={0.55} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <p style={{ ...headline(370), transform: `scale(${interpolate(s, [0, 1], [2.2, 1])})`, opacity: Math.min(1, s * 2), textShadow: glow(ORANGE, 1.4) }}>Mas</p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Card compacto alinhado à esquerda (estilo da referência) ---------- */
const CardSm: React.FC<{ delay: number; top: number; icon: string; pre: string; bold: string; out?: number }> = ({ delay, top, icon, pre, bold, out }) => {
  const f = useCurrentFrame();
  const s = useSpring(delay, { damping: 16, stiffness: 170 });
  const o = out !== undefined ? ci(f, out, out + 8, 1, 0) : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top,
        minWidth: 640,
        height: 116,
        borderRadius: 26,
        background: "rgba(14,11,10,.86)",
        backdropFilter: "blur(10px)",
        border: `2px solid ${ORANGE}55`,
        boxShadow: `0 18px 50px rgba(0,0,0,.6)`,
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "0 34px 0 22px",
        transform: `translateX(${(1 - s) * -900}px)`,
        opacity: Math.min(1, s * 2) * o,
      }}
    >
      <div style={{ width: 74, height: 74, borderRadius: 20, background: `linear-gradient(145deg,#ff8a2a,${ORANGE} 55%,#c44700)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon d={icon} />
      </div>
      <div style={{ fontFamily: SANS, textTransform: "uppercase", lineHeight: 1.05 }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: "#a89d95" }}>{pre}</div>
        <div style={{ fontSize: 50, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>{bold}</div>
      </div>
    </div>
  );
};

const HeaderV: React.FC<{ text: string; top?: number; size?: number }> = ({ text, top = 170, size = 92 }) => (
  <Pop delay={0} y={-50} style={{ position: "absolute", top, left: 60, right: 60 }}>
    <p style={{ ...headline(size), textShadow: "0 6px 30px rgba(0,0,0,.8)" }}>{text}</p>
  </Pop>
);

/* ---------- "MAS VOCÊ… NÃO SABE" ---------- */
export const MasVoceV: React.FC = () => (
  <AbsoluteFill>
    <VideoBg src="clip/alerta.mp4" clipSec={5.04} dur={168} shadeTop={0.95} />
    <HeaderV text="Mas você…" />
    <CardSm delay={17} top={340} icon={ICONS.cut} pre="não sabe" bold="editar" />
    <CardSm delay={41} top={472} icon={ICONS.pen} pre="não sabe" bold="escrever o roteiro" />
    <CardSm delay={83} top={604} icon={ICONS.text} pre="não sabe" bold="copy" />
    <CardSm delay={102} top={736} icon={ICONS.rocket} pre="não sabe" bold="subir campanhas" />
  </AbsoluteFill>
);

/* ---------- "MESMO QUE SOUBESSE…" ---------- */
export const MesmoQueV: React.FC = () => {
  const f = useCurrentFrame();
  const BIG = 217;
  const big = useSpring(BIG, { damping: 11, stiffness: 120 });
  const count = Math.round(ci(f, BIG + 20, BIG + 55, 0, 3000, Easing.out(Easing.cubic)));
  return (
    <AbsoluteFill>
      <VideoBg src="clip/ampulheta.mp4" clipSec={5.04} dur={307} shadeTop={0.95} shadeBottom={0.85} />
      <HeaderV text="Mesmo que soubesse…" size={84} />
      <CardSm delay={54} top={330} out={BIG - 6} icon={ICONS.clock} pre="não tem" bold="tempo" />
      <CardSm delay={78} top={462} out={BIG - 6} icon={ICONS.coin} pre="ou" bold="recursos" />
      <CardSm delay={186} top={594} out={BIG - 6} icon={ICONS.alert} pre="tudo isso" bold="custa caro" />
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1380,
          height: 380,
          borderRadius: 40,
          background: "rgba(18,12,9,.9)",
          border: `3px solid ${ORANGE}`,
          boxShadow: glow(ORANGE, 0.6),
          transform: `scale(${interpolate(big, [0, 1], [0.3, 1])})`,
          opacity: Math.min(1, big * 2),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: "#cfc6c0", textTransform: "uppercase" }}>Só o editor:</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 160, color: ORANGE, letterSpacing: "-0.04em", textShadow: glow(ORANGE, 0.8), lineHeight: 1 }}>
          R$ {count.toLocaleString("pt-BR")}
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 58, color: "#fff" }}>/MÊS</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- "AGORA NÃO PRECISA MAIS" ---------- */
export const AgoraNaoV: React.FC = () => {
  const f = useCurrentFrame();
  const wipe = ci(f, 0, 7, 0, 100, Easing.out(Easing.cubic));
  const w2 = ci(f, 28, 36, 0, 100, Easing.out(Easing.cubic));
  const s = useSpring(3, { damping: 12, stiffness: 200 });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ background: `linear-gradient(135deg,#ff7d1f,${ORANGE} 60%,#e85a00)`, clipPath: `inset(0 ${100 - wipe}% 0 0)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${1 + f * 0.002})` }}>
        <p style={{ ...headline(250, "#0a0300"), transform: `scale(${interpolate(s, [0, 1], [1.6, 1])})`, opacity: Math.min(1, s * 2) }}>Agora</p>
        <p style={{ ...headline(120, "#0a0300"), marginTop: 20, clipPath: `inset(0 ${100 - w2}% 0 0)` }}>não precisa</p>
        <p style={{ ...headline(120, "#0a0300"), clipPath: `inset(0 ${100 - ci(f, 40, 48, 0, 100)}% 0 0)` }}>mais.</p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- 15 profissionais ---------- */
export const FifteenV: React.FC = () => (
  <AbsoluteFill>
    <VideoBg src="clip/quinze.mp4" clipSec={6.04} dur={155} shadeTop={0.6} shadeBottom={0.8} />
    <Pop delay={72} elastic from={0.2} style={{ position: "absolute", top: 120, left: 0, right: 0 }}>
      <Extruded text="15" size={300} depth={16} />
    </Pop>
    <Caption
      y={1480}
      chunks={[
        { from: 0, to: 16, text: "Você pode ter", hl: ["ter"] },
        { from: 16, to: 48, text: "uma agência inteira", hl: ["agência", "inteira"] },
        { from: 48, to: 72, text: "dentro do seu Claude", hl: ["Claude"] },
        { from: 72, to: 100, text: "com 15 profissionais", hl: ["15"] },
        { from: 100, to: 124, text: "pra fazer tudo isso", hl: ["tudo"] },
        { from: 124, to: 155, text: "e muito mais", hl: ["mais"] },
      ]}
    />
  </AbsoluteFill>
);

/* ---------- Balão ---------- */
export const BalaoV: React.FC = () => (
  <AbsoluteFill>
    <VideoBg src="clip/balao.mp4" clipSec={3.04} dur={40} shadeTop={0.3} shadeBottom={0.8} />
    <Caption y={1480} chunks={[{ from: 0, to: 18, text: "Até mesmo um", hl: ["um"] }, { from: 18, to: 40, text: "vídeo editado", hl: ["editado"] }]} />
  </AbsoluteFill>
);

/* ---------- "COMO ESSE AQUI." ---------- */
export const ComoEsseV: React.FC = () => (
  <AbsoluteFill style={{ transform: `scale(${1 + useCurrentFrame() * 0.002})` }}>
    <Backdrop intensity={0.5} glowAt={[50, 40]} />
    <Embers n={30} seed="ce2" />
    <Pop delay={0} elastic from={0.2} style={{ position: "absolute", top: 420, left: 0, right: 0 }}>
      <Extruded text="8" size={460} depth={18} />
    </Pop>
    <Sparks cx={W / 2} cy={650} r={300} n={14} />
    <Pop delay={4} style={{ position: "absolute", top: 1060, left: 0, right: 0 }}>
      <p style={{ ...headline(140, ORANGE), textShadow: glow(ORANGE, 0.8) }}>
        Como esse
        <br />
        aqui.
      </p>
    </Pop>
  </AbsoluteFill>
);

/* ---------- "OU QUEM SABE UM VÍDEO SEU" ---------- */
export const PhoneV: React.FC = () => (
  <AbsoluteFill>
    <VideoBg src="clip/iphone.mp4" clipSec={3.04} dur={64} shadeTop={0.3} shadeBottom={0.8} />
    <Caption y={1480} chunks={[{ from: 0, to: 30, text: "Ou quem sabe", hl: ["sabe"] }, { from: 30, to: 64, text: "um vídeo seu", hl: ["seu"] }]} />
  </AbsoluteFill>
);

/* ---------- Checklist + painel ---------- */
const CheckV: React.FC<{ delay: number; text: string; top: number; plus?: boolean }> = ({ delay, text, top, plus }) => {
  const s = useSpring(delay, { damping: 14, stiffness: 180 });
  const tick = ci(useCurrentFrame(), delay + 4, delay + 12, 0, 1);
  return (
    <div style={{ position: "absolute", top, left: 90, right: 70, display: "flex", alignItems: "center", gap: 28, opacity: Math.min(1, s * 2), transform: `translateX(${(1 - s) * -200}px)` }}>
      <div style={{ width: 84, height: 84, borderRadius: 42, background: ORANGE, boxShadow: glow(ORANGE, 0.5), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: SANS, fontWeight: 900, fontSize: 56, color: "#130800" }}>
        {plus ? "+" : (
          <svg width={50} height={50} viewBox="0 0 24 24"><path d={ICONS.check} stroke="#130800" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} /></svg>
        )}
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 60, color: "#fff", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1, textShadow: "0 4px 20px rgba(0,0,0,.8)" }}>{text}</div>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: number; color: string; delay: number }> = ({ label, value, color, delay }) => {
  const v = ci(useCurrentFrame(), delay, delay + 30, 0, value, Easing.out(Easing.cubic));
  return (
    <div style={{ padding: "20px 0", borderBottom: "2px solid #241a14" }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "#9a8f88" }}>{label}</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 64, color }}>{brl(v)}</div>
    </div>
  );
};

export const ChecklistV: React.FC = () => (
  <AbsoluteFill style={{ transform: `scale(${1 + useCurrentFrame() * 0.0004})` }}>
    <Backdrop intensity={0.22} glowAt={[50, 30]} />
    <CheckV delay={0} top={230} text="Escreve os roteiros" />
    <CheckV delay={30} top={360} text="Sobe as campanhas" />
    <CheckV delay={72} top={490} text="Analisa os resultados" />
    <Pop delay={76} y={80} style={{ position: "absolute", top: 700, left: 90, right: 90 }}>
      <div style={{ borderRadius: 36, background: "linear-gradient(180deg,#15100d,#0b0807)", border: "2px solid #2c2019", padding: "26px 48px", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
        <Metric label="Faturamento líquido" value={PAINEL.faturamento} color="#fff" delay={80} />
        <Metric label="Lucro" value={PAINEL.lucro} color="#33d17a" delay={86} />
        <Metric label="Gastos com anúncios" value={PAINEL.gastos} color={ORANGE} delay={92} />
      </div>
    </Pop>
  </AbsoluteFill>
);

/* ---------- Espiona os concorrentes ---------- */
export const EspionaV: React.FC = () => (
  <AbsoluteFill>
    <VideoBg src="clip/espiao.mp4" clipSec={6.04} dur={186} shadeTop={0.85} shadeBottom={0.75} />
    <CheckV delay={0} top={190} text="Espiona os concorrentes" plus />
    <Caption
      y={1560}
      chunks={[
        { from: 37, to: 70, text: "na biblioteca de", hl: ["biblioteca"] },
        { from: 70, to: 104, text: "anúncios da Meta", hl: ["Meta"] },
        { from: 112, to: 140, text: "ou nos vídeos", hl: ["vídeos"] },
        { from: 140, to: 186, text: "mais viralizados", hl: ["viralizados"] },
      ]}
    />
  </AbsoluteFill>
);
