"""Recorta as figuras dos manuais Vonder e monta o mapa de zonas de manutenção.

Uso: python3 gerar_figuras.py <manual_empilhadeira.pdf> <manual_carregador.pdf>
Saída: pasta figuras/ ao lado deste script.
"""
import os
import subprocess
import sys
import tempfile
import textwrap

from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "figuras")
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
RED = (192, 0, 0)
NAVY = (31, 58, 95)

# Zonas: código, título, conteúdo, ponto na foto (coords do recorte da capa), lado do texto
ZONAS = [
    ("Z1", "Timão", "Botões de emergência/reversão, aceleração, modo lento, elevação, buzina. Interruptor de trava A/B/C na base.", (75, 560), "L"),
    ("Z2", "Capô / painel", "Chave, medidor de carga da bateria, botão de parada de emergência (liga/desliga).", (150, 640), "L"),
    ("Z3", "Bateria (porta lateral)", "Porta lateral: bateria 24 V, eletrólito, conector da bateria e tomada de carga.", (265, 770), "L"),
    ("Z7", "Base sob o timão", "Roda de tração, motor de tração, freio eletromagnético (ponta do eixo do motor), caixa de redução, engrenagem de giro.", (190, 975), "L"),
    ("Z8", "Adesivos e placas", "Placa de capacidade, advertências e identificação (mastro e chassi).", (488, 195), "R"),
    ("Z5", "Mastro", "Cilindro de elevação, correntes, roletes, tela de proteção. Ponto de içamento no topo.", (380, 380), "R"),
    ("Z4", "Compartimento técnico", "Sob a tampa do chassi: unidade hidráulica (bomba, reservatório 12 L, válvulas), contator, controlador, fusíveis.", (432, 800), "R"),
    ("Z6", "Garfos e rodas", "Garfos; rodas e rolamentos sob a ponta dos garfos.", (690, 880), "R"),
]


def font(size, bold=False):
    return ImageFont.truetype(FONT_B if bold else FONT, size)


def render(pdf, page, tmp):
    prefix = os.path.join(tmp, f"p{page}")
    subprocess.run(["pdftoppm", "-r", "200", "-f", str(page), "-l", str(page), "-png", "-singlefile", pdf, prefix], check=True)
    return Image.open(prefix + ".png").convert("RGB")


def titled(im, title, legend=None, width=None):
    """Adiciona faixa de título (e legenda opcional) a uma figura recortada."""
    pad = 24
    legend = legend or []
    lw = width or max(im.width + 2 * pad, 900)
    lines = []
    for item in legend:
        lines += textwrap.wrap(item, 70) or [""]
    h = 70 + im.height + pad + (len(lines) * 30 + pad if lines else 0)
    canvas = Image.new("RGB", (lw, h), "white")
    d = ImageDraw.Draw(canvas)
    d.rectangle((0, 0, lw, 56), fill=NAVY)
    d.text((pad, 12), title, font=font(26, True), fill="white")
    canvas.paste(im, ((lw - im.width) // 2, 70))
    y = 70 + im.height + pad
    for ln in lines:
        d.text((pad, y), ln, font=font(21), fill=(30, 30, 30))
        y += 30
    d.rectangle((0, 0, lw - 1, h - 1), outline=(150, 150, 150), width=2)
    return canvas


def mapa(cover):
    photo = cover.crop((360, 430, 1130, 1500))
    d = ImageDraw.Draw(photo)
    # apaga textos da capa que entraram no recorte
    for box in [(0, 0, 140, 90), (0, 870, 90, 1070), (500, 1010, 770, 1070)]:
        d.rectangle(box, fill="white")
    margin, top = 440, 100
    W, H = photo.width + 2 * margin, photo.height + top + 60
    canvas = Image.new("RGB", (W, H), "white")
    canvas.paste(photo, (margin, top))
    d = ImageDraw.Draw(canvas)
    d.text((24, 20), "Mapa de manutenção — Empilhadeira Vonder EEV 1500", font=font(34, True), fill=NAVY)
    d.text((24, 64), "Cada tarefa do plano indica a zona (Z1 a Z8). Imagem do manual Vonder; localização interna de Z4/Z7: confirmar na 1ª abertura com a Assistência.", font=font(18), fill=(80, 80, 80))
    tops = {"L": [420, 610, 800, 990], "R": [200, 390, 800, 990]}
    slots = {"L": 0, "R": 0}
    for code, name, body, (px, py), side in ZONAS:
        x, y = px + margin, py + top
        bw, bh = margin - 40, 175
        by = tops[side][slots[side]]
        slots[side] += 1
        bx = 20 if side == "L" else W - margin + 20
        d.rounded_rectangle((bx, by, bx + bw, by + bh), radius=14, outline=RED, width=3, fill=(255, 245, 245))
        d.text((bx + 16, by + 12), f"{code}  {name}", font=font(24, True), fill=RED)
        ty = by + 50
        for ln in textwrap.wrap(body, 34):
            d.text((bx + 16, ty), ln, font=font(18), fill=(30, 30, 30))
            ty += 24
        ax = bx + bw if side == "L" else bx
        d.line((ax, by + bh // 2, x, y), fill=RED, width=3)
        r = 24
        d.ellipse((x - r, y - r, x + r, y + r), fill=RED, outline="white", width=3)
        d.text((x, y), code[1:], font=font(24, True), fill="white", anchor="mm")
    return canvas


def main(man, car):
    os.makedirs(OUT, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        p = {n: render(man, n, tmp) for n in (1, 4, 9, 10, 18, 23)}
        c = {n: render(car, n, tmp) for n in (1, 6, 7)}
    mapa(p[1]).save(os.path.join(OUT, "00_mapa_zonas.png"))
    figs = [
        ("01_Z1_timao_controles.png", p[10], (40, 140, 585, 790), "Z1 — Timão: controles (manual, Fig. 4)",
         ["Posições do timão: A (alto) e C (baixo) = freado, só sobe/desce o garfo; B (meio, 45° ± 35°) = desloca."]),
        ("02_Z2_painel_bateria.png", p[9], (600, 150, 1130, 570), "Z2 — Capô: chave, medidor de carga e liga/desliga (Fig. 3)",
         ["Barra da esquerda acesa no medidor = bateria sem carga: recarregar imediatamente."]),
        ("03_Z7_freio.png", p[18], (110, 1012, 580, 1515), "Z7 — Freio eletromagnético: folga (Fig. 5)",
         ["1 Parafuso · 2 Parafuso de ajuste · 3 Mola · 4 Induzido · 5 Eixo do motor · 6 Carcaça · 7 Placa de fricção · 8 Bobina eletromagnética · 9 Placa de cobertura · 10 Parafuso",
          "Folga medida entre a placa do freio e o aço magnético. Ajuste somente N3/Assistência."]),
        ("04_Z4_unidade_hidraulica.png", p[23], (630, 330, 1150, 890), "Z4 — Unidade hidráulica (Fig. 6)",
         ["Bomba + reservatório (12 L de HLP ISO VG 46). Ajuste de pressão (16 MPa) SOMENTE pela Assistência Autorizada.",
          "A tampa com ranhuras à esquerda é, provavelmente, o bocal de abastecimento/respiro: confirmar na máquina."]),
        ("05_dimensoes.png", p[4], (80, 200, 1130, 1530), "Dimensões gerais (Fig. 2 / Tabela 2)", []),
        ("06_ZC_carregador.png", c[1], (140, 740, 1030, 1230), "ZC — Carregador CIB 330 E (estação de carga)",
         ["Uso interno, longe de chuva. Nunca sobre a bateria nem com a bateria sobre ele."]),
        ("07_ZC_carregador_componentes.png", c[6], (40, 190, 570, 1130), "ZC — Componentes do carregador (Fig. 1)",
         ["1 Cabo de alimentação · 2 Visor · 3 Botão MODO · 4 Alternar parâmetros · 5 Selecionar parâmetros · 6 Iniciar/interromper · 7 Cabo de saída · 8 Extensão com garras · 9 Extensão com conector 175 A"]),
        ("08_ZC_sequencia_ligacao.png", c[7], (140, 200, 590, 462), "ZC — Sequência para ligar o carregador (Fig. 2)",
         ["1 Garra vermelha no polo + · 2 Garra preta no polo − · 3 Só então o plugue na tomada. Para desligar, ordem inversa."]),
        ("09_ZC_painel_carregador.png", c[7], (60, 900, 530, 1190), "ZC — Configuração: 24 V · STD · 30 A (Fig. 3)",
         ["STD = chumbo-ácido convencional (bateria da EEV 1500). 30 A = baterias de 175 a 240 Ah."]),
    ]
    for name, page, box, title, legend in figs:
        titled(page.crop(box), title, legend).save(os.path.join(OUT, name))
    print("figuras em", OUT)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
