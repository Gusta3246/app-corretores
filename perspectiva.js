// ─────────────────────────────────────────────────────────────
// Correção de perspectiva: recorta um quadrilátero (4 quinas) da foto
// e o transforma em um retângulo reto.
// ─────────────────────────────────────────────────────────────

function resolverSistema(A, b) {
  const n = b.length;
  for (let i = 0; i < n; i++) {
    let max = i;
    for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[max][i])) max = r;
    [A[i], A[max]] = [A[max], A[i]];
    [b[i], b[max]] = [b[max], b[i]];
    const piv = A[i][i] || 1e-12;
    for (let r = i + 1; r < n; r++) {
      const f = A[r][i] / piv;
      for (let c = i; c < n; c++) A[r][c] -= f * A[i][c];
      b[r] -= f * b[i];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i];
    for (let c = i + 1; c < n; c++) s -= A[i][c] * x[c];
    x[i] = s / (A[i][i] || 1e-12);
  }
  return x;
}

// homografia que leva o retângulo de saída (0,0)-(W,H) para as quinas da origem
function homografia(dst, src) {
  const A = [], b = [];
  for (let i = 0; i < 4; i++) {
    const [u, v] = dst[i];
    const [x, y] = src[i];
    A.push([u, v, 1, 0, 0, 0, -u * x, -v * x]); b.push(x);
    A.push([0, 0, 0, u, v, 1, -u * y, -v * y]); b.push(y);
  }
  return resolverSistema(A, b);
}

function tamanhoSaida(quinasPx, ladoMax = 2400) {
  const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  let W = Math.max(d(quinasPx[0], quinasPx[1]), d(quinasPx[3], quinasPx[2]));
  let H = Math.max(d(quinasPx[0], quinasPx[3]), d(quinasPx[1], quinasPx[2]));
  const k = Math.min(1, ladoMax / Math.max(W, H));
  W = Math.max(2, Math.round(W * k));
  H = Math.max(2, Math.round(H * k));
  return { W, H };
}

/**
 * Recorta e "desentorta" o documento.
 * @param src      { data, width, height }
 * @param quinasPx quinas em pixels da origem [TL,TR,BR,BL]
 */
export function corrigirPerspectiva(src, quinasPx, ladoMax = 2400) {
  const { W, H } = tamanhoSaida(quinasPx, ladoMax);
  const hm = homografia([[0, 0], [W, 0], [W, H], [0, H]], quinasPx);
  const out = new Uint8ClampedArray(W * H * 4);
  const sw = src.width, sh = src.height, sd = src.data;
  for (let v = 0; v < H; v++) {
    for (let u = 0; u < W; u++) {
      const den = hm[6] * u + hm[7] * v + 1;
      let x = (hm[0] * u + hm[1] * v + hm[2]) / den;
      let y = (hm[3] * u + hm[4] * v + hm[5]) / den;
      x = x < 0 ? 0 : x > sw - 1 ? sw - 1 : x;
      y = y < 0 ? 0 : y > sh - 1 ? sh - 1 : y;
      const x0 = x | 0, y0 = y | 0;
      const x1 = x0 + 1 < sw ? x0 + 1 : x0, y1 = y0 + 1 < sh ? y0 + 1 : y0;
      const fx = x - x0, fy = y - y0;
      const i00 = (y0 * sw + x0) * 4, i10 = (y0 * sw + x1) * 4, i01 = (y1 * sw + x0) * 4, i11 = (y1 * sw + x1) * 4;
      const o = (v * W + u) * 4;
      for (let c = 0; c < 3; c++) {
        const t = sd[i00 + c] * (1 - fx) + sd[i10 + c] * fx;
        const bt = sd[i01 + c] * (1 - fx) + sd[i11 + c] * fx;
        out[o + c] = t * (1 - fy) + bt * fy;
      }
      out[o + 3] = 255;
    }
  }
  return { data: out, width: W, height: H };
}
