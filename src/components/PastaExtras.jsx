import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, Wand2, RotateCcw, RotateCw, Crop, Palette } from 'lucide-react';
import { corrigirPerspectiva } from '../utils/perspectiva';

// ─────────────────────────────────────────────────────────────
// Imagem com rotação "assada" (evita sobreposição de layout ao girar 90°/270°)
// ─────────────────────────────────────────────────────────────
export function RotatedImg({ src, rot = 0, ...props }) {
  const [saida, setSaida] = useState(src);
  useEffect(() => {
    const r = ((rot % 360) + 360) % 360;
    if (!r) { setSaida(src); return undefined; }
    let cancelado = false;
    const img = new Image();
    img.onload = () => {
      if (cancelado) return;
      const troca = r === 90 || r === 270;
      const c = document.createElement('canvas');
      c.width = troca ? img.height : img.width;
      c.height = troca ? img.width : img.height;
      const ctx = c.getContext('2d');
      ctx.translate(c.width / 2, c.height / 2);
      ctx.rotate((r * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      setSaida(c.toDataURL('image/jpeg', 0.88));
    };
    img.src = src;
    return () => { cancelado = true; };
  }, [src, rot]);
  return <img src={saida} {...props} />;
}

// ─────────────────────────────────────────────────────────────
// Editor de foto (recorte, brilho, contraste, preto e branco, "melhorar documento")
// ─────────────────────────────────────────────────────────────
const MAX_TRABALHO = 2400;
const MAX_PREVIA = 900;

const carregarImagem = (file) => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Não foi possível abrir a imagem.')); };
  img.src = url;
});

const desenharReduzida = (img, maxLado) => {
  const k = Math.min(1, maxLado / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(img.width * k));
  c.height = Math.max(1, Math.round(img.height * k));
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c;
};

// Níveis automáticos: ignora 1% mais escuro/claro e estica o resto (clareia fotos de documento)
const calcularNiveis = (canvas) => {
  const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  const hist = new Uint32Array(256);
  const passo = 4 * 3;
  let total = 0;
  for (let i = 0; i < data.length; i += passo) {
    hist[Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])]++;
    total++;
  }
  let acc = 0, lo = 0, hi = 255;
  for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= total * 0.01) { lo = v; break; } }
  acc = 0;
  for (let v = 255; v >= 0; v--) { acc += hist[v]; if (acc >= total * 0.01) { hi = v; break; } }
  if (hi - lo < 30) { lo = 0; hi = 255; }
  return { lo, hi };
};

const aplicarAjustes = (imageData, { brilho, contraste, modo, niveis }) => {
  const d = imageData.data;
  const c = contraste * 2.55;
  const f = (259 * (c + 255)) / (255 * (259 - c));
  const add = brilho * 2.55;
  const esticar = niveis ? 255 / Math.max(1, niveis.hi - niveis.lo) : 1;
  const lo = niveis ? niveis.lo : 0;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i + 1], b = d[i + 2];
    if (niveis) { r = (r - lo) * esticar; g = (g - lo) * esticar; b = (b - lo) * esticar; }
    if (modo !== 'cor') {
      const y = 0.299 * r + 0.587 * g + 0.114 * b;
      r = g = b = y;
    }
    r = f * (r + add - 128) + 128;
    g = f * (g + add - 128) + 128;
    b = f * (b + add - 128) + 128;
    d[i] = r < 0 ? 0 : r > 255 ? 255 : r;
    d[i + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
    d[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
  }
  return imageData;
};

// Gira um canvas em múltiplos de 90° (a rotação é "assada" na imagem)
const rotarCanvas = (canvas, rot) => {
  const r = ((rot % 360) + 360) % 360;
  if (!r) return canvas;
  const troca = r === 90 || r === 270;
  const c = document.createElement('canvas');
  c.width = troca ? canvas.height : canvas.width;
  c.height = troca ? canvas.width : canvas.height;
  const ctx = c.getContext('2d');
  ctx.translate(c.width / 2, c.height / 2);
  ctx.rotate((r * Math.PI) / 180);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  return c;
};

// Gira as 4 quinas junto com a foto, mantendo a ordem [topo-esq, topo-dir, base-dir, base-esq]
const girarQuinas = (q, dir) => (dir === 'cw'
  ? [[1 - q[3][1], q[3][0]], [1 - q[0][1], q[0][0]], [1 - q[1][1], q[1][0]], [1 - q[2][1], q[2][0]]]
  : [[q[1][1], 1 - q[1][0]], [q[2][1], 1 - q[2][0]], [q[3][1], 1 - q[3][0]], [q[0][1], 1 - q[0][0]]]);

// Nitidez (máscara de nitidez): realça os contornos do texto. quantidade de 0 a 100
const nitidez = (imageData, quantidade) => {
  if (!quantidade) return imageData;
  const { width: w, height: h, data } = imageData;
  const r = Math.max(1, Math.round(Math.max(w, h) / 700)); // raio proporcional ao tamanho da imagem
  const d = 2 * r + 1;
  const forca = (quantidade / 100) * 1.8;
  const horiz = new Uint8ClampedArray(w * h * 3);
  const borrada = new Uint8ClampedArray(w * h * 3);
  for (let y = 0; y < h; y++) {
    const lin = y * w;
    for (let c = 0; c < 3; c++) {
      let soma = 0;
      for (let x = -r; x <= r; x++) soma += data[(lin + Math.min(w - 1, Math.max(0, x))) * 4 + c];
      for (let x = 0; x < w; x++) {
        horiz[(lin + x) * 3 + c] = soma / d;
        soma += data[(lin + Math.min(w - 1, x + r + 1)) * 4 + c] - data[(lin + Math.max(0, x - r)) * 4 + c];
      }
    }
  }
  for (let x = 0; x < w; x++) {
    for (let c = 0; c < 3; c++) {
      let soma = 0;
      for (let y = -r; y <= r; y++) soma += horiz[(Math.min(h - 1, Math.max(0, y)) * w + x) * 3 + c];
      for (let y = 0; y < h; y++) {
        borrada[(y * w + x) * 3 + c] = soma / d;
        soma += horiz[(Math.min(h - 1, y + r + 1) * w + x) * 3 + c] - horiz[(Math.max(0, y - r) * w + x) * 3 + c];
      }
    }
  }
  for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
    for (let c = 0; c < 3; c++) {
      const v = data[i + c];
      data[i + c] = v + forca * (v - borrada[j + c]); // Uint8ClampedArray já limita em 0..255
    }
  }
  return imageData;
};

// Linhas de corte: 4 pontos (quinas) em coordenadas 0..1 — topo-esq, topo-dir, base-dir, base-esq
const QUINAS_PADRAO = [[0, 0], [1, 0], [1, 1], [0, 1]];
const PADRAO = { brilho: 0, contraste: 0, nitidez: 0, rot: 0, modo: 'cor', auto: false, quinas: QUINAS_PADRAO };

// recorte reto (retângulo alinhado) — não precisa corrigir perspectiva
const ehRetangulo = (q) => {
  const t = 0.003;
  return Math.abs(q[0][1] - q[1][1]) < t && Math.abs(q[3][1] - q[2][1]) < t
    && Math.abs(q[0][0] - q[3][0]) < t && Math.abs(q[1][0] - q[2][0]) < t;
};

// quadrilátero precisa ser convexo e ter área mínima (senão as linhas se cruzam)
const quadValido = (q) => {
  let sinal = 0, area = 0;
  for (let i = 0; i < 4; i++) {
    const a = q[i], b = q[(i + 1) % 4], c = q[(i + 2) % 4];
    const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
    if (Math.abs(cr) > 1e-9) {
      const sg = cr > 0 ? 1 : -1;
      if (sinal && sg !== sinal) return false;
      sinal = sg;
    }
    area += a[0] * b[1] - b[0] * a[1];
  }
  return Math.abs(area) / 2 > 0.02;
};

const LUPA = 124;        // diâmetro da lupa (px na tela)
const LUPA_ZOOM = 3;     // aumento dentro da lupa
const PAD_PALCO = 30;    // folga ao redor da foto: os pontos nunca ficam cortados
const trava = (v, a, b) => Math.min(b, Math.max(a, v));

const ABAS = [
  { id: 'cortar', rotulo: 'Cortar', Icone: Crop },
  { id: 'girar', rotulo: 'Girar', Icone: RotateCw },
  { id: 'cores', rotulo: 'Cores', Icone: Palette },
  { id: 'filtro', rotulo: 'Filtro', Icone: Wand2 },
];

const SliderLinha = ({ rotulo, valor, min, max, onChange, suave }) => (
  <label className="flex items-center gap-3">
    <span className="w-[76px] shrink-0 text-[11px] font-black uppercase tracking-widest" style={{ color: suave }}>{rotulo}</span>
    <input type="range" min={min} max={max} value={valor} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 min-w-0 h-9" style={{ accentColor: '#4a85dc' }} />
    <span className="w-9 shrink-0 text-right text-xs font-black tabular-nums" style={{ color: suave }}>{valor}</span>
  </label>
);

const Chip = ({ ativo, onClick, children, texto, borda }) => (
  <button onClick={onClick} className="px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all active:scale-95"
    style={{ background: ativo ? '#4a85dc' : 'transparent', color: ativo ? '#fff' : texto, borderColor: ativo ? '#4a85dc' : borda }}>
    {children}
  </button>
);

export function FotoEditor({ file, onApply, onCancel, dark, inicial, rotuloCancelar = 'Cancelar' }) {
  const [erro, setErro] = useState(null);
  const [pronto, setPronto] = useState(false);
  const [aj, setAj] = useState(() => ({ ...PADRAO, ...(inicial || {}) }));
  const [salvando, setSalvando] = useState(false);
  const [aba, setAba] = useState('cortar');
  const [ativo, setAtivo] = useState(-1);          // ponto sendo arrastado (mostra a lupa)
  const [palco, setPalco] = useState({ w: 0, h: 0 });
  const imgRef = useRef(null);
  const trabRef = useRef(null);   // canvas grande (até 2400px)
  const previaRef = useRef(null); // canvas pequeno para a tela
  const niveisRef = useRef(null);
  const telaRef = useRef(null);
  const lupaRef = useRef(null);
  const palcoRef = useRef(null);   // área disponível para a foto
  const caixaRef = useRef(null);   // contêiner da prévia (para arrastar as linhas de corte)
  const arrastando = useRef(-1);
  const desloc = useRef({ dx: 0, dy: 0 }); // distância entre o dedo e o centro do ponto

  useEffect(() => {
    let cancelado = false;
    carregarImagem(file).then((img) => {
      if (cancelado) return;
      imgRef.current = img;
      trabRef.current = desenharReduzida(img, MAX_TRABALHO);
      previaRef.current = desenharReduzida(img, MAX_PREVIA);
      niveisRef.current = calcularNiveis(previaRef.current);
      setPronto(true);
    }).catch((e) => !cancelado && setErro(e.message));
    return () => { cancelado = true; };
  }, [file]);

  // mede o palco (área da foto) para encaixar a foto INTEIRA, sem rolagem
  useEffect(() => {
    const el = palcoRef.current;
    if (!el) return undefined;
    const medir = () => setPalco({ w: el.clientWidth, h: el.clientHeight });
    medir();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', medir);
      return () => window.removeEventListener('resize', medir);
    }
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // redesenha a prévia sempre que algum ajuste muda
  useEffect(() => {
    if (!pronto || !telaRef.current) return;
    const base = rotarCanvas(previaRef.current, aj.rot);
    const tela = telaRef.current;
    tela.width = base.width;
    tela.height = base.height;
    const ctx = tela.getContext('2d');
    ctx.drawImage(base, 0, 0);
    const dados = ctx.getImageData(0, 0, base.width, base.height);
    aplicarAjustes(dados, { brilho: aj.brilho, contraste: aj.contraste, modo: aj.modo, niveis: aj.auto ? niveisRef.current : null });
    nitidez(dados, aj.nitidez);
    ctx.putImageData(dados, 0, 0);
  }, [pronto, aj.brilho, aj.contraste, aj.nitidez, aj.rot, aj.modo, aj.auto]);

  // tamanho da foto na tela (cabe inteira no palco, com folga para os pontos)
  const prev = pronto ? previaRef.current : null;
  const troca = aj.rot === 90 || aj.rot === 270;
  const cw = prev ? (troca ? prev.height : prev.width) : 0;
  const ch = prev ? (troca ? prev.width : prev.height) : 0;
  const areaW = Math.max(0, palco.w - 2 * PAD_PALCO);
  const areaH = Math.max(0, palco.h - 2 * PAD_PALCO);
  const esc = cw && ch && areaW && areaH ? Math.min(areaW / cw, areaH / ch) : 0;
  const bw = Math.floor(cw * esc);
  const bh = Math.floor(ch * esc);

  const set = (patch) => setAj((a) => ({ ...a, ...patch }));
  const girar = (dir) => setAj((a) => ({
    ...a,
    rot: (((a.rot + (dir === 'cw' ? 90 : -90)) % 360) + 360) % 360,
    quinas: girarQuinas(a.quinas, dir),
  }));
  const moverQuina = (clientX, clientY) => {
    const i = arrastando.current;
    if (i < 0 || !caixaRef.current) return;
    const bx = caixaRef.current.getBoundingClientRect();
    if (!bx.width || !bx.height) return;
    const x = trava((clientX - desloc.current.dx - bx.left) / bx.width, 0, 1);
    const y = trava((clientY - desloc.current.dy - bx.top) / bx.height, 0, 1);
    setAj((a) => ({ ...a, quinas: a.quinas.map((p, k) => (k === i ? [x, y] : p)) }));
  };
  const iniciarArraste = (e, i) => {
    e.preventDefault();
    if (caixaRef.current) {
      const bx = caixaRef.current.getBoundingClientRect();
      const [x, y] = aj.quinas[i];
      desloc.current = { dx: e.clientX - (bx.left + x * bx.width), dy: e.clientY - (bx.top + y * bx.height) };
    }
    arrastando.current = i;
    setAtivo(i);
  };

  useEffect(() => {
    const mm = (e) => { if (arrastando.current >= 0) { e.preventDefault(); moverQuina(e.clientX, e.clientY); } };
    const up = () => { arrastando.current = -1; setAtivo(-1); };
    window.addEventListener('pointermove', mm, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', mm);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, []);

  // lupa: desenha a região em volta do ponto, com aumento e a linha de corte por cima
  useEffect(() => {
    if (ativo < 0 || !bw) return;
    const c = lupaRef.current, src = telaRef.current;
    if (!c || !src || !src.width) return;
    const P = c.width;
    const ctx = c.getContext('2d');
    const S = LUPA / (LUPA_ZOOM * (bw / src.width)); // lado da região de origem (px da prévia)
    const [qx, qy] = aj.quinas[ativo];
    const sx = qx * src.width - S / 2, sy = qy * src.height - S / 2;
    const k = P / S;
    ctx.fillStyle = '#0b0b12';
    ctx.fillRect(0, 0, P, P);
    const x0 = Math.max(0, sx), y0 = Math.max(0, sy);
    const x1 = Math.min(src.width, sx + S), y1 = Math.min(src.height, sy + S);
    if (x1 > x0 && y1 > y0) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(src, x0, y0, x1 - x0, y1 - y0, (x0 - sx) * k, (y0 - sy) * k, (x1 - x0) * k, (y1 - y0) * k);
    }
    const poly = aj.quinas.map(([px, py]) => [(px * src.width - sx) * k, (py * src.height - sy) * k]);
    ctx.lineJoin = 'round';
    ctx.beginPath();
    poly.forEach(([x, y], n) => (n ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = quadValido(aj.quinas) ? '#ffffff' : '#ef4444'; ctx.stroke();
    // mira no centro (é exatamente o ponto de recorte)
    const m = P / 2;
    ctx.beginPath(); ctx.arc(m, m, 11, 0, Math.PI * 2);
    ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.stroke();
    ctx.lineWidth = 2.5; ctx.strokeStyle = '#5b9bff'; ctx.stroke();
    ctx.beginPath(); ctx.arc(m, m, 2.5, 0, Math.PI * 2); ctx.fillStyle = '#5b9bff'; ctx.fill();
  }, [ativo, aj.quinas, bw]);

  // posição da lupa: acima do dedo; se não couber em cima, vai para o lado
  let lupaPos = null;
  if (ativo >= 0 && bw) {
    const R = LUPA / 2;
    const px = (palco.w - bw) / 2 + aj.quinas[ativo][0] * bw;
    const py = (palco.h - bh) / 2 + aj.quinas[ativo][1] * bh;
    let lx = px, ly = py - R - 56;
    if (ly - R < 6) { lx = px + (px < palco.w / 2 ? 1 : -1) * (R + 70); ly = Math.max(R + 6, py); }
    lx = trava(lx, R + 6, Math.max(R + 6, palco.w - R - 6));
    ly = trava(ly, R + 6, Math.max(R + 6, palco.h - R - 6));
    lupaPos = { left: lx - R, top: ly - R };
  }

  const aplicar = () => {
    setSalvando(true);
    // dá um respiro para o "Salvando..." aparecer antes do processamento
    setTimeout(() => {
      try {
        const base = rotarCanvas(trabRef.current, aj.rot);
        const q = aj.quinas;
        let out, ctx, dados, sw, sh;
        if (ehRetangulo(q)) {
          const xs = q.map((p) => p[0]), ys = q.map((p) => p[1]);
          const sx = Math.round(Math.min(...xs) * base.width);
          const sy = Math.round(Math.min(...ys) * base.height);
          sw = Math.max(1, Math.round(Math.max(...xs) * base.width) - sx);
          sh = Math.max(1, Math.round(Math.max(...ys) * base.height) - sy);
          out = document.createElement('canvas');
          out.width = sw; out.height = sh;
          ctx = out.getContext('2d');
          ctx.drawImage(base, sx, sy, sw, sh, 0, 0, sw, sh);
          dados = ctx.getImageData(0, 0, sw, sh);
        } else {
          // corte inclinado: desentorta o quadrilátero e vira um retângulo
          const origem = base.getContext('2d').getImageData(0, 0, base.width, base.height);
          const res = corrigirPerspectiva(origem, q.map(([x, y]) => [x * base.width, y * base.height]), MAX_TRABALHO);
          sw = res.width; sh = res.height;
          out = document.createElement('canvas');
          out.width = sw; out.height = sh;
          ctx = out.getContext('2d');
          dados = new ImageData(res.data, sw, sh);
        }
        const niveisFull = aj.auto ? calcularNiveis(base) : null;
        aplicarAjustes(dados, { brilho: aj.brilho, contraste: aj.contraste, modo: aj.modo, niveis: niveisFull });
        nitidez(dados, aj.nitidez);
        ctx.putImageData(dados, 0, 0);
        out.toBlob((blob) => {
          if (!blob) { setErro('Não foi possível salvar a imagem.'); setSalvando(false); return; }
          const nome = (file.name || 'foto').replace(/\.[^.]+$/, '') + '.jpg';
          onApply(new File([blob], nome, { type: 'image/jpeg', lastModified: Date.now() }), aj);
        }, 'image/jpeg', 0.9);
      } catch (e) {
        setErro('Não foi possível salvar a imagem.');
        setSalvando(false);
      }
    }, 30);
  };

  const fundo = dark ? '#0f172a' : '#ffffff';
  const texto = dark ? '#e2e8f0' : '#1e293b';
  const suave = dark ? '#94a3b8' : '#64748b';
  const borda = dark ? '#334155' : '#e2e8f0';
  const valido = quadValido(aj.quinas);
  const btnBase = 'flex-1 px-3 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider border flex items-center justify-center gap-2 active:scale-95 transition-all';

  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(5,6,12,0.85)', backdropFilter: 'blur(8px)', overscrollBehavior: 'contain' }}>
      <div className="w-full h-full sm:h-[min(92vh,880px)] sm:max-w-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl" style={{ background: fundo, color: texto }}>
        {/* topo: cancelar · título · aplicar (sempre à vista) */}
        <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-2.5 border-b" style={{ borderColor: borda, paddingTop: 'max(10px, env(safe-area-inset-top, 0px))' }}>
          <button onClick={onCancel} className="px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 active:scale-95" style={{ background: dark ? '#1e293b' : '#f1f5f9' }}>
            <X size={18} /> {rotuloCancelar}
          </button>
          <span className="font-black text-sm uppercase tracking-widest truncate">Ajustar foto</span>
          <button onClick={aplicar} disabled={!pronto || salvando || !valido} className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white disabled:opacity-50 active:scale-95" style={{ background: '#4a85dc' }}>
            {salvando ? 'Salvando...' : 'Aplicar'}
          </button>
        </div>

        {/* palco: a foto inteira, sempre encaixada, com folga para os pontos */}
        <div ref={palcoRef} className="relative flex-1 min-h-0 overflow-hidden" style={{ background: dark ? '#020617' : '#f1f5f9' }}>
          {erro ? <p className="absolute inset-0 flex items-center justify-center p-6 text-sm font-bold text-red-500 text-center">{erro}</p>
            : !pronto ? <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-slate-300 border-t-[#4a85dc] animate-spin" /></div>
            : (
              <div ref={caixaRef} className="absolute select-none" style={{ left: (palco.w - bw) / 2, top: (palco.h - bh) / 2, width: bw, height: bh, touchAction: 'none', lineHeight: 0 }}>
                <canvas ref={telaRef} className="block rounded-sm shadow-lg" style={{ width: bw, height: bh }} />
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
                  <path fillRule="evenodd" fill="rgba(0,0,0,0.55)"
                    d={`M0 0H100V100H0Z M${aj.quinas.map(([x, y]) => `${x * 100} ${y * 100}`).join(' L')} Z`} />
                  <polygon points={aj.quinas.map(([x, y]) => `${x * 100},${y * 100}`).join(' ')} fill="none"
                    stroke={valido ? '#ffffff' : '#ef4444'} vectorEffect="non-scaling-stroke" style={{ strokeWidth: 2 }} />
                </svg>
                {aj.quinas.map(([x, y], i) => (
                  <div key={i}
                    onPointerDown={(e) => iniciarArraste(e, i)}
                    className="absolute flex items-center justify-center"
                    style={{ left: `${x * 100}%`, top: `${y * 100}%`, width: 56, height: 56, marginLeft: -28, marginTop: -28, touchAction: 'none', cursor: 'grab', zIndex: ativo === i ? 10 : 5 }}>
                    <span className="block rounded-full border-2 border-white shadow-lg transition-transform" style={{ width: 24, height: 24, background: '#4a85dc', transform: ativo === i ? 'scale(1.2)' : 'none' }} />
                  </div>
                ))}
              </div>
            )}

          {/* lupa — aparece fora do alcance do dedo enquanto o ponto é arrastado */}
          {lupaPos && (
            <div className="absolute pointer-events-none rounded-full overflow-hidden shadow-2xl"
              style={{ left: lupaPos.left, top: lupaPos.top, width: LUPA, height: LUPA, border: '3px solid #ffffff', zIndex: 30, background: '#0b0b12' }}>
              <canvas ref={lupaRef} width={LUPA * 2} height={LUPA * 2} style={{ width: LUPA, height: LUPA, display: 'block' }} />
            </div>
          )}
        </div>

        {/* painel da aba ativa + abas embaixo */}
        <div className="shrink-0 border-t" style={{ borderColor: borda }}>
          <div className="px-4 pt-3 pb-2 flex flex-col justify-center gap-2" style={{ minHeight: 136 }}>
            {aba === 'cortar' && (
              <>
                <p className="text-xs font-semibold leading-snug" style={{ color: valido ? suave : '#ef4444' }}>
                  {valido ? 'Arraste os 4 pontos até as quinas do documento. A lupa mostra o ponto acima do seu dedo.' : 'As linhas estão cruzadas. Ajuste os pontos para formar um quadrilátero.'}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => set({ quinas: QUINAS_PADRAO })} className={btnBase} style={{ borderColor: borda, color: texto }}>
                    <RotateCcw size={18} /> Refazer recorte
                  </button>
                  <button onClick={() => setAj(PADRAO)} className={btnBase} style={{ borderColor: borda, color: suave }}>
                    Redefinir tudo
                  </button>
                </div>
              </>
            )}
            {aba === 'girar' && (
              <div className="flex gap-2">
                <button onClick={() => girar('ccw')} className={btnBase} style={{ borderColor: borda, color: texto }}>
                  <RotateCcw size={22} /> Esquerda
                </button>
                <button onClick={() => girar('cw')} className={btnBase} style={{ borderColor: borda, color: texto }}>
                  <RotateCw size={22} /> Direita
                </button>
              </div>
            )}
            {aba === 'cores' && (
              <>
                <div className="flex gap-2">
                  <Chip texto={texto} borda={borda} ativo={aj.modo === 'cor'} onClick={() => set({ modo: 'cor' })}>Cores</Chip>
                  <Chip texto={texto} borda={borda} ativo={aj.modo === 'pb'} onClick={() => set({ modo: 'pb' })}>Preto e branco</Chip>
                </div>
                <SliderLinha suave={suave} rotulo="Brilho" valor={aj.brilho} min={-50} max={50} onChange={(v) => set({ brilho: v })} />
                <SliderLinha suave={suave} rotulo="Contraste" valor={aj.contraste} min={-50} max={100} onChange={(v) => set({ contraste: v })} />
              </>
            )}
            {aba === 'filtro' && (
              <>
                <div className="flex gap-2">
                  <Chip texto={texto} borda={borda} ativo={aj.auto} onClick={() => set({ auto: !aj.auto })}><Wand2 size={16} className="inline mr-1.5" />Melhorar documento</Chip>
                </div>
                <SliderLinha suave={suave} rotulo="Nitidez" valor={aj.nitidez} min={0} max={100} onChange={(v) => set({ nitidez: v })} />
              </>
            )}
          </div>

          <div role="tablist" className="grid grid-cols-4 border-t" style={{ borderColor: borda, paddingBottom: 'max(6px, env(safe-area-inset-bottom, 0px))' }}>
            {ABAS.map(({ id, rotulo, Icone }) => {
              const sel = aba === id;
              return (
                <button key={id} role="tab" aria-selected={sel} onClick={() => setAba(id)}
                  className="flex flex-col items-center gap-1 pt-2.5 pb-1.5 active:scale-95 transition-all"
                  style={{ color: sel ? '#4a85dc' : suave }}>
                  <Icone size={22} strokeWidth={sel ? 2.6 : 2} />
                  <span className="text-[11px] font-black uppercase tracking-wider">{rotulo}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Câmera do computador (webcam) — no celular o app usa a câmera nativa
// ─────────────────────────────────────────────────────────────
export function WebcamModal({ onCapture, onClose, dark }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [erro, setErro] = useState(null);
  const [fotos, setFotos] = useState(0);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
        if (cancelado) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setPronto(true);
        }
      } catch (e) {
        setErro(e && e.name === 'NotAllowedError'
          ? 'Permissão da câmera negada. Libere o acesso à câmera no navegador e tente de novo.'
          : 'Não foi possível acessar uma câmera neste aparelho.');
      }
    })();
    return () => {
      cancelado = true;
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capturar = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const c = document.createElement('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    c.toBlob((blob) => {
      if (!blob) return;
      const n = new Date();
      const pad = (x) => String(x).padStart(2, '0');
      onCapture(new File([blob], `foto_${pad(n.getHours())}${pad(n.getMinutes())}${pad(n.getSeconds())}.jpg`, { type: 'image/jpeg', lastModified: Date.now() }));
      setFotos((x) => x + 1);
    }, 'image/jpeg', 0.92);
  };

  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(5,6,12,0.9)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl" style={{ background: dark ? '#0f172a' : '#ffffff', color: dark ? '#e2e8f0' : '#1e293b' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ paddingTop: 'max(12px, env(safe-area-inset-top, 0px))' }}>
          <span className="font-black text-base uppercase tracking-widest flex items-center gap-2"><Camera size={20} /> Câmera {fotos > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white">{fotos} {fotos === 1 ? 'foto' : 'fotos'}</span>}</span>
          <button onClick={onClose} className="p-3 rounded-xl" style={{ background: dark ? '#1e293b' : '#f1f5f9' }}><X size={22} /></button>
        </div>
        <div className="flex-1 min-h-0 flex items-center justify-center bg-black">
          {erro ? <p className="p-6 text-center text-sm font-bold text-red-400">{erro}</p>
            : <video ref={videoRef} playsInline muted className="max-w-full max-h-[65vh]" />}
        </div>
        <div className="flex gap-3 justify-end px-4 py-3" style={{ paddingBottom: 'max(14px, calc(env(safe-area-inset-bottom, 0px) + 6px))' }}>
          <button onClick={capturar} disabled={!pronto} className="flex-1 sm:flex-none px-7 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-white disabled:opacity-40" style={{ background: '#4a85dc' }}>Capturar</button>
          <button onClick={onClose} className="flex-1 sm:flex-none px-7 py-4 rounded-2xl text-sm font-black uppercase tracking-widest border" style={{ borderColor: dark ? '#334155' : '#e2e8f0' }}>Concluir</button>
        </div>
      </div>
    </div>
  );
}
