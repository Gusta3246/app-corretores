/* Destemidos — funcionamento offline (PWA).
   - App (HTML + JS + CSS): guardado por inteiro e aberto NA HORA, com ou sem internet.
     Se houver versão nova, ela é baixada em segundo plano e o app avisa para atualizar.
   - Tailwind (CDN), fontes e bibliotecas de PDF: guardados para o app ficar com o visual completo offline.
   - Imagens dos empreendimentos (postimg, apto): guardadas ao serem vistas, com limite de quantidade.
   - Lista de tabelas do Drive: tenta a rede; sem internet, mostra a última lista vista.
   - Vídeos, documentos do Drive e demais APIs: sempre vão à rede. */
const VERSAO = 'destemidos-v4';
const CACHE = `destemidos-cache-${VERSAO}`;
const CACHE_IMG = 'destemidos-imagens';
const CACHE_DADOS = 'destemidos-dados';
const MAX_IMAGENS = 250;

const NUCLEO = ['/manifest.json', '/favicon.png', '/apple-touch-icon.png', '/logo-destemidos-192.png', '/logo-destemidos-512.png'];
const BIBLIOTECAS = [
  'https://cdn.tailwindcss.com/',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
];
const HOSTS_CACHE = ['cdn.tailwindcss.com', 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];
const HOSTS_IMAGEM = ['i.postimg.cc', 'api.apto.vc'];

// ── Baixa o app inteiro (HTML + JS + CSS do build atual) e só então troca a cópia guardada ──
let atualizando = null;
const atualizarShell = () => {
  if (atualizando) return atualizando;
  atualizando = (async () => {
    const resp = await fetch('/', { cache: 'no-cache' });
    if (!resp.ok) throw new Error('shell');
    const html = await resp.text();
    if (!/id=["']root["']/.test(html)) throw new Error('shell-invalido'); // não guarda página de erro
    const assets = [...new Set([...html.matchAll(/(?:src|href)=["']\.?(\/static\/[^"']+)["']/g)].map((m) => m[1]))];
    const cache = await caches.open(CACHE);
    // Se algum arquivo falhar, nada é trocado: o app guardado continua inteiro.
    await Promise.all(assets.map(async (u) => {
      if (await cache.match(u)) return;
      const r = await fetch(u);
      if (!r.ok) throw new Error(u);
      await cache.put(u, r);
    }));
    const anterior = await cache.match('/index.html');
    const htmlAnterior = anterior ? await anterior.text() : null;
    const limpo = () => new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    await cache.put('/index.html', limpo());
    await cache.put('/', limpo());
    for (const req of await cache.keys()) {
      const p = new URL(req.url).pathname;
      if (p.startsWith('/static/') && !assets.includes(p)) await cache.delete(req);
    }
    if (htmlAnterior && htmlAnterior !== html) {
      const clientes = await self.clients.matchAll({ type: 'window' });
      clientes.forEach((c) => c.postMessage({ tipo: 'nova-versao' }));
    }
  })().finally(() => { atualizando = null; });
  return atualizando;
};

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(NUCLEO.map((url) => cache.add(url).catch(() => {})));
    await Promise.all(BIBLIOTECAS.map(async (url) => {
      try { await cache.put(new Request(url, { mode: 'no-cors' }), await fetch(url, { mode: 'no-cors' })); } catch (e) { /* tenta de novo no uso */ }
    }));
    try { await atualizarShell(); } catch (e) { /* tenta de novo na próxima abertura */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const chaves = await caches.keys();
    await Promise.all(chaves.filter((k) => k.startsWith('destemidos-cache-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

const guardar = async (request, response) => {
  if (response && (response.ok || response.type === 'opaque')) {
    const cache = await caches.open(CACHE);
    cache.put(request, response.clone()).catch(() => {});
  }
  return response;
};

const imagem = async (request, event) => {
  const cache = await caches.open(CACHE_IMG);
  const guardado = await cache.match(request.url);
  if (guardado) return guardado;
  let resp;
  // Tenta com CORS (ocupa pouco espaço); se o servidor não permitir, usa a resposta comum.
  try { resp = await fetch(request.url, { mode: 'cors', credentials: 'omit' }); }
  catch (e) { try { resp = await fetch(request); } catch (e2) { return Response.error(); } }
  if (resp && (resp.ok || resp.type === 'opaque')) {
    await cache.put(request.url, resp.clone()).catch(() => {});
    event.waitUntil((async () => {
      const chaves = await cache.keys();
      for (let i = 0; i < chaves.length - MAX_IMAGENS; i++) await cache.delete(chaves[i]);
    })());
  }
  return resp;
};

const redePrimeiro = async (request) => {
  const cache = await caches.open(CACHE_DADOS);
  try {
    const resp = await Promise.race([
      fetch(request),
      new Promise((_, rej) => setTimeout(() => rej(new Error('lento')), 6000)),
    ]);
    if (resp.ok) cache.put(request, resp.clone()).catch(() => {});
    return resp;
  } catch (e) {
    return (await cache.match(request)) || Response.error();
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  if (request.destination === 'video' || request.destination === 'audio') return;
  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Telas: abre a cópia guardada na hora e confere se há versão nova em segundo plano.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const guardado = (await cache.match('/index.html')) || (await cache.match('/'));
      const atualizacao = atualizarShell().catch(() => {});
      event.waitUntil(atualizacao);
      if (guardado) return guardado;
      try { return await fetch(request); } catch (e) { return Response.error(); }
    })());
    return;
  }

  if (url.origin === self.location.origin) {
    if (url.pathname === '/service-worker.js') return;
    // Arquivos do build têm nome com código: o que está guardado nunca fica desatualizado.
    if (url.pathname.startsWith('/static/')) {
      event.respondWith((async () => (await caches.match(request)) || guardar(request, await fetch(request)))());
      return;
    }
    event.respondWith((async () => {
      const guardado = await caches.match(request);
      const rede = fetch(request).then((r) => guardar(request, r)).catch(() => null);
      return guardado || (await rede) || Response.error();
    })());
    return;
  }

  if (HOSTS_IMAGEM.includes(url.hostname)) { event.respondWith(imagem(request, event)); return; }

  if (url.hostname === 'www.googleapis.com' && url.pathname.startsWith('/drive/v3/files')) {
    event.respondWith(redePrimeiro(request));
    return;
  }

  if (HOSTS_CACHE.includes(url.hostname)) {
    event.respondWith((async () => {
      const guardado = await caches.match(request);
      const rede = fetch(request).then((r) => guardar(request, r)).catch(() => null);
      return guardado || (await rede) || Response.error();
    })());
  }
  // Demais endereços (Drive, WhatsApp, vídeos…): direto na rede.
});