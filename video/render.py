"""Vídeo institucional – Plataforma de Diagnóstico com IA (APM Terminals Pecém).
Uso: python3 render.py <largura> <fps> <saida.mp4>   ex.: 640 24 preview.mp4  |  3840 30 final_4k.mp4
Tudo é desenhado em coordenadas normalizadas (1920x1080) e escalado por S.
"""
import sys, math, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W = int(sys.argv[1]) if len(sys.argv) > 1 else 640
FPS = int(sys.argv[2]) if len(sys.argv) > 2 else 24
OUT = sys.argv[3] if len(sys.argv) > 3 else "preview.mp4"
H = W * 9 // 16
S = W / 1920
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FM = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
_fc = {}
def font(p, sz):
    k = (p, sz)
    if k not in _fc: _fc[k] = ImageFont.truetype(p, max(6, int(sz * S)))
    return _fc[k]

WHITE, BLACK = (240, 240, 240), (0, 0, 0)
ORANGE = (255, 102, 0)      # destaque
TEAL = (0, 200, 190)
GREY = (110, 110, 110)

def clamp(x, a=0., b=1.): return max(a, min(b, x))
def ease(x): x = clamp(x); return x * x * (3 - 2 * x)
def eio(x): x = clamp(x); return 4*x**3 if x < .5 else 1 - (-2*x+2)**3/2
def P(x, y): return (x * S, y * S)
def lw(w): return max(1, round(w * S))
def mix(c1, c2, t): return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))
def fade(c, a, bg=BLACK): return mix(bg, c, clamp(a))

def text(d, xy, s, sz, col, a=1., fnt=FB, anchor="mm"):
    if a <= 0: return
    d.text(P(*xy), s, font=font(fnt, sz), fill=fade(col, a), anchor=anchor)

def dot(d, x, y, r, col, glow=True):
    if glow:
        for k in range(4, 0, -1):
            rr = r * (1 + k * .9)
            d.ellipse([(x-rr)*S, (y-rr)*S, (x+rr)*S, (y+rr)*S], fill=fade(col, .12))
    d.ellipse([(x-r)*S, (y-r)*S, (x+r)*S, (y+r)*S], fill=col)

def polyline_point(pts, t):
    seg = [math.dist(pts[i], pts[i+1]) for i in range(len(pts)-1)]
    L = sum(seg) * clamp(t); acc = 0
    for i, s in enumerate(seg):
        if acc + s >= L:
            u = (L - acc) / s if s else 0
            return (pts[i][0] + (pts[i+1][0]-pts[i][0])*u, pts[i][1] + (pts[i+1][1]-pts[i][1])*u), i
        acc += s
    return pts[-1], len(pts) - 2

def draw_partial(d, pts, t, col, w):
    if t <= 0: return
    p, i = polyline_point(pts, t)
    d.line([P(*q) for q in pts[:i+1]] + [P(*p)], fill=col, width=lw(w))

# ---------------------------------------------------------------- caminhão (traço)
def rect(x, y, w, h): return [(x, y), (x+w, y), (x+w, y+h), (x, y+h), (x, y)]
def circ(cx, cy, r, n=40): return [(cx + r*math.cos(2*math.pi*i/n), cy + r*math.sin(2*math.pi*i/n)) for i in range(n+1)]

# cada peça: nome, lista de polilinhas, deslocamento na vista explodida, ponto de medição
PARTS = [
    ("CABINE", [[(560, 330), (560, 610), (800, 610), (800, 330), (760, 300), (600, 300), (560, 330)],
                rect(590, 340, 180, 110), [(560, 500), (800, 500)]], (-150, -170), (680, 390), "BAIXA TENSÃO · 24 V"),
    ("CHASSI", [[(520, 640), (1440, 640), (1440, 680), (520, 680), (520, 640)],
                [(560, 660), (1400, 660)]], (0, 40), (1000, 660), "LINHAS · PORTAS"),
    ("PACK DE BATERIAS", [rect(820, 470, 300, 150), [(870, 470), (870, 620)], [(920, 470), (920, 620)],
                          [(970, 470), (970, 620)], [(1020, 470), (1020, 620)], [(1070, 470), (1070, 620)]],
     (0, -330), (970, 545), "ALTA TENSÃO · 600 V"),
    ("MOTOR ELÉTRICO", [circ(1210, 560, 55), circ(1210, 560, 25), rect(1140, 500, 20, 120)],
     (150, -230), (1210, 560), "INVERSOR · FASES U V W"),
    ("TANQUE PNEUMÁTICO", [rect(640, 690, 220, 50), circ(640, 715, 25, 20)], (-170, 150), (750, 715), "PNEUMÁTICO · 8 bar"),
    ("QUINTA RODA · HIDRÁULICO", [[(1250, 600), (1420, 600), (1420, 630), (1250, 630), (1250, 600)],
                                  [(1300, 600), (1320, 560), (1380, 560), (1400, 600)]], (90, -60), (1335, 580), "HIDRÁULICO · 180 bar"),
    ("RODA DIANTEIRA", [circ(680, 720, 75), circ(680, 720, 30)], (-230, 230), None, None),
    ("RODA TRASEIRA", [circ(1200, 720, 75), circ(1200, 720, 30), circ(1360, 720, 75), circ(1360, 720, 30)], (230, 230), None, None),
]

def draw_truck(d, build=1., explode=0., highlight=-1, labels=0., cx_shift=0):
    for i, (name, lines, off, mp, tag) in enumerate(PARTS):
        e = eio(explode - i * 0.04) if explode > 0 else 0
        ox, oy = off[0] * e + cx_shift, off[1] * e
        b = clamp(build * len(PARTS) - i * .6)
        col = ORANGE if i == highlight else WHITE
        for ln in lines:
            draw_partial(d, [(x+ox, y+oy) for x, y in ln], b, col, 2.2)
        if labels > 0 and mp:
            a = clamp(labels * 3 - i * .25)
            mx, my = mp[0]+ox, mp[1]+oy
            dot(d, mx, my, 6, fade(ORANGE if i == highlight else TEAL, a), glow=a > .5)
            # chamada
            lx = mx + (140 if off[0] >= 0 else -140); ly = my - 60
            d.line([P(mx, my), P(lx, ly), P(lx + (160 if off[0] >= 0 else -160), ly)], fill=fade(WHITE, a*.7), width=lw(1))
            anc = "ls" if off[0] >= 0 else "rs"
            text(d, (lx, ly-10), name, 20, WHITE, a, FB, anc)
            text(d, (lx, ly+24), tag, 16, ORANGE if i == highlight else TEAL, a, FM, "lt" if off[0] >= 0 else "rt")

# ---------------------------------------------------------------- pontilhismo
N = 2600
rng = np.random.default_rng(7)
def shape_points(kind, label):
    m = Image.new("L", (480, 480), 0); g = ImageDraw.Draw(m)
    if kind == "bolt":
        g.polygon([(270, 30), (130, 260), (230, 260), (190, 450), (350, 200), (250, 200), (300, 30)], fill=255)
    elif kind == "hv":
        g.rounded_rectangle([90, 120, 390, 400], 30, fill=255); g.rectangle([170, 80, 220, 120], fill=255)
        g.rectangle([260, 80, 310, 120], fill=255); g.text((240, 260), "HV", font=ImageFont.truetype(FB, 120), fill=0, anchor="mm")
    elif kind == "air":
        g.ellipse([60, 60, 420, 420], fill=255); g.ellipse([100, 100, 380, 380], fill=0)
        g.polygon([(240, 240), (360, 150), (370, 165)], fill=255); g.ellipse([215, 215, 265, 265], fill=255)
        for a in range(-135, 136, 27):
            r = math.radians(a - 90); g.line([(240+150*math.cos(r), 240+150*math.sin(r)), (240+175*math.cos(r), 240+175*math.sin(r))], fill=255, width=10)
    elif kind == "drop":
        g.polygon([(240, 40), (110, 280), (370, 280)], fill=255); g.ellipse([110, 160, 370, 420], fill=255)
    elif kind == "port":
        for i in range(5): g.rectangle([60 + i*80, 150, 110 + i*80, 400], fill=255)
        g.rectangle([30, 110, 450, 150], fill=255); g.polygon([(150, 30), (330, 30), (380, 110), (100, 110)], fill=255)
    ys, xs = np.nonzero(np.array(m) > 128)
    idx = rng.choice(len(xs), N, replace=len(xs) < N)
    pts = np.stack([xs[idx], ys[idx]], 1).astype(float)
    pts = pts / 480 * 560 + np.array([960 - 280, 480 - 300])
    return pts + rng.normal(0, 2, pts.shape), label

SHAPES = [shape_points("bolt", ("BAIXA TENSÃO", "Chicotes, relés e módulos 24 V")),
          shape_points("hv", ("ALTA TENSÃO", "Pack de baterias, inversor e motor")),
          shape_points("air", ("PNEUMÁTICO", "Freios, válvulas e caminhos de pressão")),
          shape_points("drop", ("HIDRÁULICO", "Elevação da quinta roda e direção")),
          shape_points("port", ("OUTROS EQUIPAMENTOS", "A mesma lógica escala para a frota do porto"))]
SCATTER = rng.uniform([0, 0], [1920, 1080], (N, 2))
SIZES = rng.uniform(1.6, 3.6, N)
PCOL = np.array([WHITE, TEAL, ORANGE])[rng.choice(3, N, p=[.7, .2, .1])]

def pointillism(d, t, dur):
    seg = dur / len(SHAPES)
    k = min(int(t // seg), len(SHAPES)-1); u = (t - k*seg) / seg
    prev = SCATTER if k == 0 else SHAPES[k-1][0]
    cur = SHAPES[k][0]
    m = eio(u / .45)
    # cada ponto chega com pequeno atraso próprio -> transição fluida
    delay = (np.arange(N) % 97) / 97 * .35
    mm = np.clip((u / .55 - delay) / .65, 0, 1); mm = mm*mm*(3-2*mm)
    swirl = np.sin(mm * math.pi)[:, None] * 60 * np.stack([np.sin(np.arange(N)), np.cos(np.arange(N))], 1)
    pos = prev + (cur - prev) * mm[:, None] + swirl
    jitter = np.stack([np.sin(t*2 + np.arange(N)), np.cos(t*1.7 + np.arange(N)*1.3)], 1) * 1.5
    pos = pos + jitter
    for (x, y), r, c in zip(pos, SIZES, PCOL):
        rr = r * S * 1.2
        d.ellipse([x*S-rr, y*S-rr, x*S+rr, y*S+rr], fill=tuple(c))
    title, sub = SHAPES[k][1]
    a = ease((u - .5) / .15) * (1 - ease((u - .92) / .08))
    text(d, (960, 880), title, 54, WHITE, a)
    text(d, (960, 945), sub, 26, TEAL, a, FR)

# ---------------------------------------------------------------- telas do app
def phone(d, cx, cy, a=1.):
    w, h = 400, 780
    d.rounded_rectangle([(cx-w/2)*S, (cy-h/2)*S, (cx+w/2)*S, (cy+h/2)*S], radius=48*S, outline=fade(WHITE, a), width=lw(3), fill=(12, 12, 14))
    d.rounded_rectangle([(cx-50)*S, (cy-h/2+16)*S, (cx+50)*S, (cy-h/2+34)*S], radius=9*S, fill=BLACK)
    return cx - w/2 + 28, cy - h/2 + 60, w - 56

def app_screen(d, t):
    """t em segundos dentro da cena (12 s). 4 telas."""
    a = ease(t / .6)
    x0, y0, cw = phone(d, 1300, 540, a)
    scr = min(int(t // 3), 3); u = (t - scr*3) / 3
    hdr = ["Novo diagnóstico", "Analisando diagramas", "Rota de medição", "Falha isolada"][scr]
    text(d, (x0, y0+20), "TT-DIAG", 18, ORANGE, a, FB, "lm")
    text(d, (x0, y0+60), hdr, 26, WHITE, a, FB, "lm")
    y = y0 + 110
    if scr == 0:
        d.rounded_rectangle([x0*S, y*S, (x0+cw)*S, (y+60)*S], 14*S, outline=fade(GREY, a), width=lw(2))
        typed = "Código E-217 · sem tração"[:int(len("Código E-217 · sem tração") * clamp(u/.6))]
        text(d, (x0+18, y+30), typed + ("|" if int(t*3) % 2 else ""), 20, WHITE, a, FM, "lm")
        for i, s in enumerate(["Shacman TT · Elétrico", "Sistema: Alta tensão", "Sintoma: perda de tração"]):
            aa = a * ease((u - .3 - i*.12) / .15)
            d.rounded_rectangle([x0*S, (y+90+i*70)*S, (x0+cw)*S, (y+145+i*70)*S], 12*S, fill=fade((30, 30, 34), aa))
            text(d, (x0+18, y+117+i*70), s, 19, WHITE, aa, FR, "lm")
        bt = ease((u - .75) / .15)
        d.rounded_rectangle([x0*S, (y+330)*S, (x0+cw)*S, (y+395)*S], 32*S, fill=fade(ORANGE, bt))
        text(d, (x0+cw/2, y+362), "DIAGNOSTICAR", 22, BLACK if bt > .5 else WHITE, bt)
    elif scr == 1:
        for i, s in enumerate(["Diagrama HV-03 · 412 ligações", "Componentes relacionados: 27", "Pontos de medição: 14", "Histórico de falhas: 37 eventos"]):
            p = clamp(u * 1.4 - i * .2)
            text(d, (x0, y+20+i*70), s, 18, WHITE, a * ease(p * 3), FR, "lm")
            d.rectangle([x0*S, (y+42+i*70)*S, (x0+cw)*S, (y+48+i*70)*S], fill=(35, 35, 38))
            d.rectangle([x0*S, (y+42+i*70)*S, (x0+cw*ease(p))*S, (y+48+i*70)*S], fill=TEAL)
        # mini grafo
        nodes = [(x0+40+(j % 4)*90, y+330+(j//4)*70) for j in range(8)]
        for j in range(7): d.line([P(*nodes[j]), P(*nodes[j+1])], fill=GREY, width=lw(1))
        hit = int(u * 16) % 8
        for j, n in enumerate(nodes): dot(d, n[0], n[1], 7 if j == hit else 4, ORANGE if j == hit else WHITE, glow=j == hit)
    elif scr == 2:
        steps = [("1", "Medir tensão no barramento HV", "X12 pino 3 → GND · esperado 580–650 V"),
                 ("2", "Verificar contator principal K1", "Resistência bobina · 18–24 Ω"),
                 ("3", "Testar sinal CAN do inversor", "CAN-H / CAN-L · 2,5 V ± 1")]
        for i, (n, s1, s2) in enumerate(steps):
            aa = a * ease((u - i*.22) / .15)
            done = u > i*.22 + .2
            yy = y + 10 + i*120
            dot(d, x0+16, yy+20, 14, fade(ORANGE if done else GREY, aa), glow=False)
            text(d, (x0+16, yy+20), "✓" if done else n, 16, BLACK, aa, FB)
            text(d, (x0+46, yy+12), s1, 18, WHITE, aa, FB, "lm")
            text(d, (x0+46, yy+42), s2, 15, TEAL, aa, FM, "lm")
            if i < 2: d.line([P(x0+16, yy+40), P(x0+16, yy+110)], fill=fade(GREY, aa), width=lw(2))
    else:
        r = 90 * ease(u / .3)
        cx, cy = x0 + cw/2, y + 120
        d.ellipse([(cx-r)*S, (cy-r)*S, (cx+r)*S, (cy+r)*S], outline=ORANGE, width=lw(4))
        text(d, (cx, cy), "K1", 48, WHITE, ease(u/.3))
        text(d, (cx, y+250), "Contator principal K1", 22, WHITE, ease((u-.2)/.2))
        text(d, (cx, y+285), "bobina aberta · 0 Ω → substituir", 17, ORANGE, ease((u-.3)/.2), FM)
        text(d, (cx, y+360), "Tempo de diagnóstico", 18, GREY, ease((u-.45)/.2), FR)
        text(d, (cx, y+400), "04 min 12 s", 40, TEAL, ease((u-.5)/.2), FB)
    # narração (lado esquerdo)
    nar = ["Descreva a falha.", "O app cruza diagramas,\ncomponentes e histórico.", "E entrega a rota exata\nde medição.", "Falha isolada.\nEm minutos, não em horas."][scr]
    ta = ease(u / .15) * (1 - ease((u - .9) / .1)) if scr < 3 else ease(u / .15)
    for j, ln in enumerate(nar.split("\n")):
        text(d, (200, 470 + j*70), ln, 52, WHITE, ta, FB, "lm")

# ---------------------------------------------------------------- linha + ponto (raciocínio)
LINE_PATH = [(-20, 540), (300, 540), (380, 380), (520, 380), (600, 700), (760, 700), (840, 300), (1000, 300),
             (1060, 540), (1240, 540), (1300, 450), (1420, 450), (1480, 640), (1600, 640), (1660, 540), (1940, 540)]
BRANCHES = [((520, 380), (600, 220)), ((520, 380), (620, 450)), ((760, 700), (860, 820)), ((1000, 300), (1090, 180)),
            ((1240, 540), (1320, 680)), ((1420, 450), (1520, 330)), ((1600, 640), (1700, 760))]
NODE_TXT = {2: "SINTOMA", 4: "SISTEMA HV", 6: "DIAGRAMA", 8: "COMPONENTE", 10: "PONTO X12", 12: "MEDIÇÃO", 14: "CAUSA RAIZ"}

def reasoning(d, u, caption=None, trail=True):
    draw_partial(d, LINE_PATH, 1, fade(WHITE, .35), 1)
    for b0, b1 in BRANCHES:
        d.line([P(*b0), P(*b1)], fill=fade(WHITE, .18), width=lw(1))
        d.ellipse([(b1[0]-3)*S, (b1[1]-3)*S, (b1[0]+3)*S, (b1[1]+3)*S], outline=fade(WHITE, .3))
    tt = eio(u)
    draw_partial(d, LINE_PATH, tt, WHITE, 2)
    p, i = polyline_point(LINE_PATH, tt)
    for k, lab in NODE_TXT.items():
        nx, ny = LINE_PATH[k]
        on = i >= k
        d.ellipse([(nx-5)*S, (ny-5)*S, (nx+5)*S, (ny+5)*S], fill=WHITE if on else BLACK, outline=WHITE)
        text(d, (nx, ny + (-30 if ny < 540 else 34)), lab, 15, ORANGE if on else GREY, 1, FM)
    if trail:
        for k in range(1, 14):
            q, _ = polyline_point(LINE_PATH, tt - k * .006)
            dot(d, q[0], q[1], 7 - k*.4, fade(WHITE, 1 - k/14), glow=False)
    dot(d, p[0], p[1], 8, WHITE)

# ---------------------------------------------------------------- cenas
SCENES = []  # (duração, função(d, t, dur))
def scene(dur):
    def deco(f): SCENES.append((dur, f)); return f
    return deco

@scene(7)
def s_hook(d, t, dur):
    reasoning(d, t / dur * .55)
    a = ease((t - .8) / .5) * (1 - ease((t - 6.3) / .6))
    text(d, (960, 900), "37 falhas.  596 horas paradas.", 54, WHITE, a)
    text(d, (960, 965), "Tratores terminais elétricos · 3 meses de operação", 24, GREY, a, FR)

@scene(6)
def s_question(d, t, dur):
    draw_truck(d, build=ease(t / 4.5))
    a = ease((t - 1) / .6)
    text(d, (960, 140), "E se cada diagnóstico", 58, WHITE, a)
    text(d, (960, 215), "levasse minutos?", 58, ORANGE, ease((t - 1.8) / .6))

@scene(12)
def s_explode(d, t, dur):
    ex = ease((t - .5) / 2.5)
    hl = 2 if t > 7 else -1
    draw_truck(d, 1, ex, highlight=hl, labels=ease((t - 2.8) / 1.5))
    # varredura
    if 3 < t < 7:
        sx = 400 + (t - 3) / 4 * 1120
        d.line([P(sx, 120), P(sx, 980)], fill=fade(TEAL, .6), width=lw(1))
    a = ease((t - .3) / .6) * (1 - ease((t - 11.4) / .5))
    text(d, (960, 70), "ANATOMIA DO DIAGNÓSTICO", 30, ORANGE, a, FM)
    cap = "Cada componente, porta, linha e circuito mapeado." if t < 7 else "O app aponta onde medir — e por quê."
    text(d, (960, 1010), cap, 34, WHITE, a * ease(((t if t < 7 else t - 7) - .3) / .5), FB)

@scene(12)
def s_app(d, t, dur): app_screen(d, t)

@scene(15)
def s_points(d, t, dur): pointillism(d, t, dur)

@scene(7)
def s_reason(d, t, dur):
    reasoning(d, t / 4.5)
    a = ease((t - 4.3) / .5)
    text(d, (960, 150), "Raciocínio de engenharia,", 50, WHITE, a)
    text(d, (960, 220), "na velocidade de software.", 50, ORANGE, ease((t - 4.8) / .5))

@scene(9)
def s_numbers(d, t, dur):
    v = 16.13 - (16.13 - 10.89) * ease((t - .8) / 2.2)
    text(d, (960, 200), "MTTR · tempo médio de reparo", 28, GREY, ease(t / .5), FR)
    text(d, (960, 330), f"{v:05.2f} h".replace(".", ","), 120, WHITE, ease(t / .5), FB)
    # barra
    d.rectangle([P(560, 440), P(1360, 446)], fill=(40, 40, 40))
    d.rectangle([P(560, 440), P(560 + 800 * v / 16.13, 446)], fill=ORANGE)
    text(d, (960, 540), "−32,5%", 96, ORANGE, ease((t - 3) / .5))
    text(d, (960, 615), "com especialista em campo 24/7 (babysitting)", 24, GREY, ease((t - 3.3) / .5), FR)
    text(d, (960, 730), "O app leva esse conhecimento para cada técnico —", 32, WHITE, ease((t - 4.8) / .5), FR)
    text(d, (960, 780), "sem os USD 109,5 mil/ano de suporte presencial.", 32, TEAL, ease((t - 5.4) / .5), FR)

@scene(7)
def s_credits(d, t, dur):
    a = ease(t / .7)
    draw_partial(d, [(560, 430), (1360, 430)], ease(t / 1.2), WHITE, 1)
    text(d, (960, 340), "Plataforma de Diagnóstico com IA", 52, WHITE, a)
    text(d, (960, 395), "Tratores Terminais Elétricos Shacman", 26, GREY, a, FR)
    text(d, (960, 500), "Desenvolvimento do app", 22, ORANGE, ease((t - .8) / .5), FM)
    text(d, (960, 550), "Euller Gonçalves de Lima", 44, WHITE, ease((t - 1) / .5))
    text(d, (960, 640), "Thomaz Pereira · Leonardo Cavalcante · Leonardo de Godoy", 22, GREY, ease((t - 1.5) / .5), FR)
    text(d, (960, 760), "APM TERMINALS PECÉM · ENGENHARIA", 28, WHITE, ease((t - 2) / .5), FB)
    dot(d, 560 + 800 * ease(t / 1.2), 430, 6, WHITE)

# ---------------------------------------------------------------- render
total = sum(s[0] for s in SCENES)
cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-"]
cmd += (["-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p"] if W >= 3000
        else ["-c:v", "libx264", "-preset", "veryfast", "-crf", "28", "-pix_fmt", "yuv420p"])
pr = subprocess.Popen(cmd + ["-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
start = 0
for dur, f in SCENES:
    n = int(dur * FPS)
    for k in range(n):
        t = k / FPS
        im = Image.new("RGB", (W, H), BLACK); d = ImageDraw.Draw(im)
        f(d, t, dur)
        # fade de transição entre cenas
        fa = min(1, t / .35, (dur - t) / .35)
        arr = np.asarray(im, dtype=np.float32) * fa
        pr.stdin.write(arr.astype(np.uint8).tobytes())
    start += dur
    print(f.__name__, "ok", flush=True)
pr.stdin.close(); pr.wait()
print("total", total, "s ->", OUT)
