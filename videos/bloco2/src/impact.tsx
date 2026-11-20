import React from "react";
import { AbsoluteFill, Easing, Img, random, staticFile, useCurrentFrame } from "remotion";
import { ci, Embers, H, W } from "./lib";

/**
 * Sequência da bola + "o vidro do SEU celular quebrou".
 *
 * Linha do tempo (frames, 30 fps, relativo ao início do vídeo interno):
 *   0–96    bola balançando (pêndulo) com push-in lento
 *   96–120  bola avança contra a câmera
 *   120     IMPACTO (o cronômetro do vídeo final marca 00:06)
 *   120–150 imagem congela com defeito de LCD
 *   150–210 tela "morre" (apaga piscando), só a trinca fica
 *   210     tela "religa" já na cena do 8 (sob a trinca)
 *   240–285 os cacos de vidro caem e a tela fica limpa
 */
export const IMPACT = 120;

/** Ponto de impacto na tela (em px de 1080x1920), igual ao centro da trinca na textura. */
const IX = 422;
const IY = 830;
/** Centro da bola na imagem original redimensionada para 1080x1920. */
const BX = 527;
const BY = 1097;

export const BallShot: React.FC = () => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, IMPACT); // congela no impacto
  const t = f / 30;

  // pêndulo: o pivô fica no topo da corrente (canto superior direito)
  const swing = 7 * Math.sin(t * Math.PI * 0.9) * (f < 96 ? 1 : 1);
  const push = 1 + t * 0.03;

  // avanço contra a câmera (acelera)
  const rush = ci(f, 96, IMPACT, 0, 1, Easing.in(Easing.cubic));
  const scale = push * (1 + rush * 3.6);
  const tx = (IX - BX) * rush;
  const ty = (IY - BY) * rush;
  const blur = rush * 6;

  // depois do impacto: LCD falhando e apagando
  const dead = frame >= 150;
  const flick = frame >= 150 && frame < 168 ? (random(`fl${frame}`) > 0.5 ? 1 : 0.15) : dead ? 0 : 1;
  const freezeDim = frame > IMPACT ? 0.85 : 1;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: flick * freezeDim }}>
        <AbsoluteFill
          style={{
            transformOrigin: `${BX}px ${BY}px`,
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
          }}
        >
          <AbsoluteFill style={{ transformOrigin: "900px -40px", transform: `rotate(${swing}deg)` }}>
            <Img src={staticFile("img/bola.png")} style={{ width: W, height: H, objectFit: "cover" }} />
          </AbsoluteFill>
        </AbsoluteFill>
        {f < IMPACT ? <Embers n={25} seed="bola" speed={0.6} /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Pedaços do vidro (setores a partir do ponto de impacto) ---------- */
const N_SECT = 13;
const RINGS = [0, 230, 640, 2600];
const sectPt = (i: number, j: number): [number, number] => {
  const ii = ((i % N_SECT) + N_SECT) % N_SECT;
  const a = (ii / N_SECT) * Math.PI * 2 + (random(`sa${ii}`) - 0.5) * 0.35;
  const r = RINGS[j] * (j === 0 ? 0 : 1 + (random(`sr${ii}-${j}`) - 0.5) * 0.3);
  return [IX + Math.cos(a) * r, IY + Math.sin(a) * r];
};

const CrackLayer: React.FC<{ clip?: string; style?: React.CSSProperties }> = ({ clip, style }) => (
  <AbsoluteFill style={{ clipPath: clip, ...style }}>
    <Img src={staticFile("img/trinca-alpha.png")} style={{ width: W, height: H }} />
  </AbsoluteFill>
);

/**
 * Camada que fica ACIMA de tudo (inclusive do cronômetro): é o vidro do celular de quem assiste.
 * Começa no frame IMPACT do vídeo interno.
 */
export const ScreenCrack: React.FC = () => {
  const f = useCurrentFrame(); // 0 = impacto
  const FALL = 120; // início da queda dos cacos (frame 240 do vídeo interno)

  // a trinca se propaga a partir do ponto de impacto em ~4 frames
  const reveal = ci(f, 0, 5, 0, 2300, Easing.out(Easing.cubic));
  const revealClip = `circle(${reveal}px at ${IX}px ${IY}px)`;

  // flash do impacto
  const flash = ci(f, 0, 5, 0.95, 0);

  // mancha de LCD (tinta preta se espalhando sob o vidro) e linhas de pixel queimado
  const blob = ci(f, 1, 60, 40, 330, Easing.out(Easing.quad));
  const lcdOut = ci(f, FALL - 4, FALL + 4, 1, 0);
  const linesOn = f >= 2 && f < FALL && (f < 30 || random(`ln${f}`) > 0.25);

  // religar a tela (frame 210 do vídeo interno = f 90): flicker
  const powerOn = f >= 88 && f < 100 ? (random(`po${f}`) > 0.5 ? 0.85 : 0) : 0;

  const pieces: React.ReactNode[] = [];
  if (f >= FALL) {
    const tt = (f - FALL) / 30;
    for (let i = 0; i < N_SECT; i++) {
      for (let j = 0; j < 3; j++) {
        const q = [sectPt(i, j), sectPt(i, j + 1), sectPt(i + 1, j + 1), sectPt(i + 1, j)];
        const cx = (q[1][0] + q[2][0]) / 2;
        const cy = (q[1][1] + q[2][1]) / 2;
        const delay = (2 - j) * 0.08 + random(`d${i}${j}`) * 0.12; // o miolo esmagado cai primeiro
        const tl = Math.max(0, tt - delay);
        const dy = 0.5 * 5200 * tl * tl;
        const dx = (cx - IX) * 0.12 * tl * 3;
        const rot = (random(`r${i}${j}`) - 0.5) * 90 * tl;
        const rx = 25 * tl;
        pieces.push(
          <AbsoluteFill
            key={`${i}-${j}`}
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              transform: `translate(${dx}px, ${dy}px) perspective(1600px) rotateX(${rx}deg) rotate(${rot}deg)`,
              opacity: 1 - ci(tl, 0.35, 0.6, 0, 1),
            }}
          >
            <CrackLayer clip={`polygon(${q.map((p) => `${p[0]}px ${p[1]}px`).join(",")})`} />
            <AbsoluteFill style={{ clipPath: `polygon(${q.map((p) => `${p[0]}px ${p[1]}px`).join(",")})`, background: "linear-gradient(135deg, rgba(255,255,255,.07), rgba(255,255,255,0) 60%)" }} />
          </AbsoluteFill>,
        );
      }
    }
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* defeito de LCD, por baixo do vidro */}
      <AbsoluteFill style={{ opacity: lcdOut }}>
        <div
          style={{
            position: "absolute",
            left: IX - blob,
            top: IY - blob * 0.9,
            width: blob * 2,
            height: blob * 1.8,
            borderRadius: "46% 54% 41% 59% / 52% 44% 56% 48%",
            background: "radial-gradient(circle, #000 0%, #000 55%, rgba(60,0,90,.85) 68%, rgba(0,120,255,.35) 78%, rgba(0,255,120,.15) 86%, transparent 100%)",
            filter: "blur(3px)",
          }}
        />
        {linesOn ? (
          <>
            <div style={{ position: "absolute", left: 618, top: 0, bottom: 0, width: 3, background: "#22ff88", opacity: 0.85 }} />
            <div style={{ position: "absolute", left: 371, top: 0, bottom: 0, width: 2, background: "#ff2bd6", opacity: 0.7 }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 1310, height: 2, background: "#ffffff", opacity: 0.35 }} />
          </>
        ) : null}
      </AbsoluteFill>

      {/* o vidro trincado: inteiro até a queda, depois em pedaços */}
      {f < FALL ? (
        <>
          <CrackLayer clip={revealClip} style={{ transform: "translate(-2px, 0)", opacity: 0.35, filter: "hue-rotate(-40deg) saturate(3)" }} />
          <CrackLayer clip={revealClip} style={{ transform: "translate(2px, 0)", opacity: 0.35, filter: "hue-rotate(160deg) saturate(3)" }} />
          <CrackLayer clip={revealClip} />
        </>
      ) : (
        pieces
      )}

      <AbsoluteFill style={{ background: "#000", opacity: powerOn }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};
