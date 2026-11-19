// Gera uma trilha provisória (batida tensa + impactos sincronizados) em WAV.
// Substitua por trilha/SFX profissionais na versão final.
import { writeFileSync } from "node:fs";
const SR = 48000, DUR = 53, N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const add = (t0, len, fn, pan = 0) => {
  const s0 = Math.floor(t0 * SR);
  for (let i = 0; i < len * SR && s0 + i < N; i++) {
    const v = fn(i / SR); L[s0 + i] += v * (1 - pan); R[s0 + i] += v * (1 + pan);
  }
};
const kick = (t, g = 0.9) => add(t, 0.35, (x) => g * Math.sin(2 * Math.PI * (45 * x + 90 * (1 - Math.exp(-x * 30)) / 30 * 1)) * Math.exp(-x * 9));
const boom = (t, g = 1) => add(t, 1.6, (x) => g * (Math.sin(2 * Math.PI * (32 * x + 60 * (1 - Math.exp(-x * 8)) / 8)) * Math.exp(-x * 2.6) + 0.25 * rnd() * Math.exp(-x * 14)));
const hat = (t, g = 0.08) => { let p = 0; add(t, 0.05, (x) => { const n = rnd(); const v = n - p; p = n; return g * v * Math.exp(-x * 90); }); };
const glass = (t) => { let p = 0; add(t, 1.2, (x) => { const n = rnd(); const v = n - p; p = n * 0.6; const ting = Math.sin(2 * Math.PI * (3200 + 900 * Math.sin(x * 40)) * x) * 0.15; return (0.7 * v + ting) * Math.exp(-x * 4.5); }); };
const whoosh = (t, len = 0.7, g = 0.35) => { let lp = 0; add(t, len, (x) => { const k = x / len; const a = 0.02 + 0.25 * k; lp += a * (rnd() - lp); return g * lp * 4 * Math.sin(Math.PI * k) ** 2; }); };
const pop = (t, g = 0.45) => add(t, 0.18, (x) => g * Math.sin(2 * Math.PI * (700 - 2500 * x) * x) * Math.exp(-x * 25));

// drone tenso
add(0, DUR, (x) => 0.07 * Math.sin(2 * Math.PI * 55 * x) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 0.6 * x)) + 0.03 * Math.sin(2 * Math.PI * 82.4 * x + Math.sin(x * 3)));
// batida 100 bpm a partir do "8"
const B = 0.6;
for (let t = 7.2; t < 52.5; t += B) {
  if (t > 32 && t < 34) continue; // respiro no "AGORA NÃO"
  kick(t, 0.6); hat(t + B / 2, 0.1); hat(t + B / 4, 0.04); hat(t + (3 * B) / 4, 0.04);
}
boom(0, 0.7); whoosh(0.9, 1.1); whoosh(2.4, 0.6, 0.5); boom(4, 1); glass(4.02); glass(6); boom(6, 0.6);
[7.2, 11, 12, 13.5, 16, 22, 29.9, 32, 34, 39.5, 41, 42, 44, 47, 51].forEach((t) => boom(t, 0.75));
[17.3, 18, 19.2, 19.8, 24.4, 25.3, 28.2].forEach((t) => whoosh(t - 0.25, 0.4, 0.3));
[44.1, 44.9, 45.8, 47.1, 51.1].forEach((t) => pop(t));
boom(53 - 1.6, 0.5);

// normaliza e grava WAV 16-bit estéreo
let pk = 0; for (let i = 0; i < N; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
const g = 0.89 / pk, buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(Math.tanh(L[i] * g) * 32000), 44 + i * 4); buf.writeInt16LE(Math.round(Math.tanh(R[i] * g) * 32000), 46 + i * 4); }
writeFileSync(process.argv[2], buf);
