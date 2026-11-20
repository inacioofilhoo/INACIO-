import React from "react";
import { AbsoluteFill, Audio, Composition, interpolate, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BG, Grain, MONO, ORANGE, Vignette } from "./lib";
import { CriaTudo } from "./scenesB";
import { IMPACT, ScreenCrack } from "./impact";
import {
  AgoraNaoV,
  AtencaoOuro,
  BalaoV,
  BallShotVideo,
  ChecklistV,
  ComoEsseV,
  EightV,
  EspionaV,
  FifteenV,
  MasV,
  MasVoceV,
  MesmoQueV,
  PhoneV,
  StillHereV,
} from "./scenesC";

const FPS = 30;
/** O vídeo interno começa em 0:02 do vídeo final; o cronômetro mostra o tempo do vídeo final. */
const OFFSET_S = 2;

/** Cenas na ordem. As durações seguem a narração (frames a 30 fps). */
const TIMELINE: { name: string; dur: number; C: React.FC<{ globalFrom: number }> }[] = [
  { name: "Bola + impacto", dur: 210, C: BallShotVideo },
  { name: "8 segundos", dur: 96, C: EightV },
  { name: "Ainda aqui", dur: 42, C: StillHereV },
  { name: "Atenção = ouro", dur: 135, C: AtencaoOuro },
  { name: "Mas", dur: 21, C: MasV },
  { name: "Não sabe", dur: 168, C: MasVoceV },
  { name: "Mesmo que soubesse", dur: 307, C: MesmoQueV },
  { name: "Agora não precisa", dur: 75, C: AgoraNaoV },
  { name: "15 profissionais", dur: 155, C: FifteenV },
  { name: "Balão", dur: 40, C: BalaoV },
  { name: "Como esse", dur: 40, C: ComoEsseV },
  { name: "Vídeo seu", dur: 64, C: PhoneV },
  { name: "Checklist", dur: 128, C: ChecklistV },
  { name: "Espiona", dur: 186, C: EspionaV },
  { name: "Cria tudo", dur: 63, C: CriaTudo },
];
const STARTS = TIMELINE.reduce<number[]>((acc, s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + TIMELINE[i - 1].dur], []);
const TOTAL = TIMELINE.reduce((a, s) => a + s.dur, 0);
const at = (name: string) => STARTS[TIMELINE.findIndex((s) => s.name === name)];

/** Narração: arquivo e frame de início. */
const VOZ: { src: string; from: number; dur: number }[] = [
  { src: "voz/v1.mp3", from: at("8 segundos"), dur: 89 },
  { src: "voz/v2.mp3", from: at("Ainda aqui"), dur: 36 },
  { src: "voz/v3.mp3", from: at("Atenção = ouro"), dur: 131 },
  { src: "voz/v4.mp3", from: at("Mas"), dur: 183 },
  { src: "voz/v5.mp3", from: at("Mesmo que soubesse"), dur: 301 },
  { src: "voz/v6.mp3", from: at("Agora não precisa"), dur: 224 },
  { src: "voz/v7.mp3", from: at("Balão"), dur: 510 },
];

/** Efeitos sonoros pontuais. */
const SFX: { src: string; from: number; vol: number }[] = [
  { src: "sfx/bola-whoosh.mp3", from: IMPACT - 36, vol: 0.9 },
  { src: "sfx/impacto-tela.mp3", from: IMPACT, vol: 1 },
  { src: "sfx/hit.mp3", from: at("8 segundos") + 16, vol: 0.6 },
  { src: "sfx/hit.mp3", from: at("Ainda aqui") + 4, vol: 0.45 },
  { src: "sfx/whoosh.mp3", from: at("Atenção = ouro") - 4, vol: 0.5 },
  { src: "sfx/hit.mp3", from: at("Atenção = ouro") + 106, vol: 0.5 },
  { src: "sfx/hit.mp3", from: at("Mas"), vol: 0.7 },
  { src: "sfx/whoosh.mp3", from: at("Não sabe") - 3, vol: 0.4 },
  { src: "sfx/whoosh.mp3", from: at("Mesmo que soubesse") - 4, vol: 0.45 },
  { src: "sfx/hit.mp3", from: at("Mesmo que soubesse") + 217, vol: 0.55 },
  { src: "sfx/hit.mp3", from: at("Agora não precisa"), vol: 0.8 },
  { src: "sfx/whoosh.mp3", from: at("15 profissionais") - 4, vol: 0.5 },
  { src: "sfx/hit.mp3", from: at("15 profissionais") + 72, vol: 0.6 },
  { src: "sfx/whoosh.mp3", from: at("Balão") - 4, vol: 0.4 },
  { src: "sfx/hit.mp3", from: at("Como esse"), vol: 0.5 },
  { src: "sfx/whoosh.mp3", from: at("Vídeo seu") - 4, vol: 0.4 },
  { src: "sfx/whoosh.mp3", from: at("Checklist") - 4, vol: 0.4 },
  { src: "sfx/whoosh.mp3", from: at("Espiona") - 4, vol: 0.45 },
  { src: "sfx/hit.mp3", from: at("Cria tudo"), vol: 0.6 },
];

/** Volume da trilha: baixa sob a voz, some enquanto a tela "morre". */
const musicVolume = (f: number) => {
  const dead = interpolate(f, [146, 152, 206, 212], [1, 0, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const talking = VOZ.some((v) => f >= v.from - 4 && f < v.from + v.dur + 4);
  const end = interpolate(f, [TOTAL - 20, TOTAL], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (talking ? 0.2 : 0.42) * dead * end;
};

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
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ transform: shake }}>
        {TIMELINE.map(({ name, dur, C }, i) => (
          <Sequence key={name} name={name} from={STARTS[i]} durationInFrames={dur}>
            <C globalFrom={STARTS[i]} />
          </Sequence>
        ))}
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

      <Audio src={staticFile("sfx/musica.mp3")} volume={musicVolume} />
      {VOZ.map((v) => (
        <Sequence key={v.src} name={`Voz ${v.src}`} from={v.from}>
          <Audio src={staticFile(v.src)} volume={1} />
        </Sequence>
      ))}
      {SFX.map((s, i) => (
        <Sequence key={`${s.src}-${i}`} name={`Som ${s.src}`} from={s.from}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <>
    <Composition id="Bloco2" component={Bloco2} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="Impacto" component={Bloco2} durationInFrames={330} fps={FPS} width={1080} height={1920} />
  </>
);
