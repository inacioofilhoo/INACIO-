import React from "react";
import { AbsoluteFill, Audio, Composition, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BG, Grain, MONO, ORANGE, Vignette } from "./lib";
import { Attention, Eight, Gold, Mas, StillHere } from "./scenesA";
import { AgoraNao, BalloonScene, Checklist, ComoEsse, CriaTudo, Espiona, Fifteen, MasVoce, MesmoQue, PhoneScene } from "./scenesB";
import { BallShot, IMPACT, ScreenCrack } from "./impact";

const FPS = 30;
/** O vídeo interno começa em 0:02 do vídeo final; o cronômetro mostra o tempo do vídeo final. */
const OFFSET_S = 2;

const TIMELINE: { name: string; dur: number; C: React.FC }[] = [
  { name: "Bola + impacto", dur: 210, C: BallShot },
  { name: "8 segundos", dur: 120, C: Eight },
  { name: "Ainda aqui", dur: 30, C: StillHere },
  { name: "Ouro", dur: 45, C: Gold },
  { name: "Atenção vende", dur: 75, C: Attention },
  { name: "Mas", dur: 30, C: Mas },
  { name: "Não sabe", dur: 150, C: MasVoce },
  { name: "Mesmo que soubesse", dur: 300, C: MesmoQue },
  { name: "Agora não", dur: 60, C: AgoraNao },
  { name: "15 profissionais", dur: 165, C: Fifteen },
  { name: "Balão", dur: 45, C: BalloonScene },
  { name: "Como esse", dur: 30, C: ComoEsse },
  { name: "Vídeo seu", dur: 60, C: PhoneScene },
  { name: "Checklist", dur: 90, C: Checklist },
  { name: "Espiona", dur: 120, C: Espiona },
  { name: "Cria tudo", dur: 60, C: CriaTudo },
];
const TOTAL = TIMELINE.reduce((a, s) => a + s.dur, 0);

const TimerPill: React.FC = () => {
  const f = useCurrentFrame();
  const s = Math.floor(f / FPS) + OFFSET_S;
  const txt = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const on = 0.55 + 0.45 * Math.abs(Math.sin(f * 0.1));
  return (
    <div style={{ position: "absolute", top: 70, right: 60, display: "flex", alignItems: "center", gap: 14, padding: "14px 26px", borderRadius: 40, background: "rgba(12,12,12,.78)", border: "1.5px solid rgba(255,255,255,.14)", fontFamily: MONO, fontWeight: 700, fontSize: 36, color: "#fff" }}>
      <div style={{ width: 16, height: 16, borderRadius: 8, background: ORANGE, opacity: on, boxShadow: `0 0 12px ${ORANGE}` }} />
      {txt}
    </div>
  );
};

/** Tela "morta" depois do impacto: apaga piscando e cobre também o cronômetro. */
const ScreenDead: React.FC = () => {
  const f = useCurrentFrame() + IMPACT;
  if (f < 150 || f >= 210) return null;
  const o = f < 168 ? (random(`sd${f}`) > 0.5 ? 1 : 0.2) : 1;
  return <AbsoluteFill style={{ background: "#000", opacity: o }} />;
};

export const Bloco2: React.FC = () => {
  const frame = useCurrentFrame();
  // tranco do impacto no conteúdo (o vidro fica parado, como num celular de verdade)
  const k = frame >= IMPACT && frame < IMPACT + 14 ? 1 - (frame - IMPACT) / 14 : 0;
  const shake = k > 0 ? `translate(${(random(`kx${frame}`) - 0.5) * 60 * k}px, ${(random(`ky${frame}`) - 0.5) * 60 * k}px)` : undefined;
  let from = 0;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ transform: shake }}>
        {TIMELINE.map(({ name, dur, C }) => {
          const el = (
            <Sequence key={name} name={name} from={from} durationInFrames={dur}>
              <C />
            </Sequence>
          );
          from += dur;
          return el;
        })}
        <Vignette />
        <Grain />
        <TimerPill />
      </AbsoluteFill>
      <Sequence name="Tela apagada" from={IMPACT} durationInFrames={90}>
        <ScreenDead />
      </Sequence>
      <Sequence name="Vidro do celular" from={IMPACT} durationInFrames={170}>
        <ScreenCrack />
      </Sequence>
      <Audio src={staticFile("sfx/trilha.wav")} volume={0.55} />
      <Sequence name="Som: bola" from={IMPACT - 36}>
        <Audio src={staticFile("sfx/bola-whoosh.mp3")} volume={0.9} />
      </Sequence>
      <Sequence name="Som: tela quebrando" from={IMPACT}>
        <Audio src={staticFile("sfx/impacto-tela.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <>
    <Composition id="Bloco2" component={Bloco2} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="Impacto" component={Bloco2} durationInFrames={330} fps={FPS} width={1080} height={1920} />
  </>
);
