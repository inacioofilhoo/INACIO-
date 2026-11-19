import React from "react";
import { AbsoluteFill, Composition, Sequence, useCurrentFrame } from "remotion";
import { BG, Grain, MONO, ORANGE, Vignette } from "./lib";
import { Attention, BallRush, Crack, Eight, Gold, Mas, OrbIntro, Shatter, StillHere, Wrecking } from "./scenesA";
import { AgoraNao, BalloonScene, Checklist, ComoEsse, CriaTudo, Espiona, Fifteen, MasVoce, MesmoQue, PhoneScene } from "./scenesB";

const FPS = 30;
/** O vídeo interno começa em 0:02 do vídeo final; o cronômetro mostra o tempo do vídeo final. */
const OFFSET_S = 2;

const TIMELINE: { name: string; dur: number; C: React.FC }[] = [
  { name: "Esfera", dur: 30, C: OrbIntro },
  { name: "Pêndulo", dur: 60, C: Wrecking },
  { name: "Avanço", dur: 30, C: BallRush },
  { name: "Impacto", dur: 60, C: Crack },
  { name: "Estilhaços", dur: 30, C: Shatter },
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

export const Bloco2: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: BG }}>
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
  );
};

export const MyComposition = () => (
  <Composition id="Bloco2" component={Bloco2} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
