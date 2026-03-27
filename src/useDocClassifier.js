import { useState, useRef } from 'react';

export const ORDER_MAP = {
  cancelamento: 0, autorizacao: 0, reserva: 0,
  rg_frente: 1, rg_verso: 2, rg: 1, cnh: 3, oab: 3, creci: 3, cpf: 4,
  certidao_nascimento: 5, certidao_casamento: 6, certidao_obito: 7,
  residencia: 8, ctps: 9, contracheque: 10,
  imposto_renda: 11, extrato_bancario: 12, fgts: 13, outros: 99,
};

const VISION_MODELS = [
  'google/gemini-2.0-flash-001',
  'google/gemini-flash-1.5',
  'meta-llama/llama-3.2-90b-vision-instruct',
];

const CLASSIFY_PROMPT = `Você é especialista em classificar documentos brasileiros. Analise esta imagem com atenção — pode ser foto de celular, com ângulo ou parcialmente visível.

Responda APENAS com JSON válido, sem texto adicional: {"category":"CATEGORIA","label":"NOME DO DOCUMENTO"}

CATEGORIAS POSSÍVEIS:
- "rg" → RG ou Identidade
- "cnh" → CNH
- "cpf" → CPF
- "oab" → OAB
- "creci" → CRECI
- "rg_frente" → RG Frente: lado com foto 3x4
- "rg_verso" → RG Verso: lado com impressão digital
- "residencia" → Comprovante de Residência
- "certidao_casamento" → Certidão de Casamento
- "certidao_nascimento" → Certidão de Nascimento
- "certidao_obito" → Certidão de Óbito
- "ctps" → Carteira de Trabalho
- "contracheque" → Contracheque ou Holerite
- "imposto_renda" → Imposto de Renda
- "extrato_bancario" → Extrato Bancário
- "fgts" → FGTS
- "outros" → use apenas se não se encaixar em nenhuma categoria acima

Responda SOMENTE o JSON. Exemplo: {"category":"rg","label":"RG / Identidade"}`;

const KEYWORD_MAP = [
  { keywords: ['cancelamento','carta de cancelamento','distrato'], category: 'cancelamento', label: 'Carta de Cancelamento' },
  { keywords: ['autorizacao cadastral','autorização cadastral','declaracao de esclarecimento','declaração de esclarecimento'], category: 'autorizacao', label: 'Autorização / Declaração' },
  { keywords: ['reserva de unidade','reserva','proposta de compra'], category: 'reserva', label: 'Reserva de Unidade' },
  { keywords: ['rg frente','rg_frente','identidade frente','frente rg'], category: 'rg_frente', label: 'RG / Identidade (Frente)' },
  { keywords: ['rg verso','rg_verso','identidade verso','verso rg'], category: 'rg_verso', label: 'RG / Identidade (Verso)' },
  { keywords: ['holerite','contracheque','folha de pagamento','salario','salário','vencimentos','inss','cbo'], category: 'contracheque', label: 'Contracheque / Holerite' },
  { keywords: ['declaracao de ajuste anual','declaração de ajuste anual','dirpf','imposto de renda','irpf'], category: 'imposto_renda', label: 'Imposto de Renda' },
  { keywords: ['extrato bancario','extrato bancário','extrato','saldo','movimentacao','nubank','bradesco','itau','santander','caixa economica','banco do brasil','inter'], category: 'extrato_bancario', label: 'Extrato Bancário' },
  { keywords: ['fgts','fundo de garantia','pis','pasep','caixa fgts','fins rescisórios'], category: 'fgts', label: 'FGTS' },
  { keywords: ['carteira de trabalho','ctps','previdencia social','previdência social','ctps digital','ministerio do trabalho'], category: 'ctps', label: 'Carteira de Trabalho (CTPS)' },
  { keywords: ['certidao de casamento','certidão de casamento','casamento','contraentes'], category: 'certidao_casamento', label: 'Certidão de Casamento' },
  { keywords: ['certidao de nascimento','certidão de nascimento','registro de nascimento'], category: 'certidao_nascimento', label: 'Certidão de Nascimento' },
  { keywords: ['certidao de obito','certidão de óbito','obito','óbito','falecimento'], category: 'certidao_obito', label: 'Certidão de Óbito' },
  { keywords: ['cadastro de pessoas fisicas','cadastro de pessoas físicas','cpf','receita federal do brasil'], category: 'cpf', label: 'CPF' },
  { keywords: ['carteira nacional de habilitacao','cnh','detran','habilitacao','habilitação'], category: 'cnh', label: 'CNH' },
  { keywords: ['ordem dos advogados','oab','advogado'], category: 'oab', label: 'OAB' },
  { keywords: ['conselho regional de corretores','creci','corretor de imoveis'], category: 'creci', label: 'CRECI' },
  { keywords: ['registro geral','identidade','instituto de identificacao','filiacao','naturalidade'], category: 'rg', label: 'RG / Identidade' },
  { keywords: [' rg ','_rg_','-rg-'], category: 'rg', label: 'RG / Identidade' },
  { keywords: ['comprovante de residencia','comprovante de residência','residencia','cep','conta de luz','energia eletrica','amazonas energia','conta de agua','saneamento','cosama','fatura','conta de telefone','internet','banda larga','vencimento','valor a pagar'], category: 'residencia', label: 'Comprovante de Residência' },
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const matchKeywords = (text) => {
  const n = normalize(text);
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some(kw => n.includes(normalize(kw)))) {
      return { category: entry.category, order: ORDER_MAP[entry.category] ?? 99, label: entry.label };
    }
  }
  return null;
};

export function useDocClassifier({ setPendingDocs, setOrganizeProgress, setCardAnimPhase, setChatMessages }) {
  const OPENROUTER_KEY = process.env.REACT_APP_OPENROUTER_KEY;

  const waitForPdfJs = () => new Promise((resolve, reject) => {
    if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions.workerSrc) return resolve();
    let tries = 0;
    const interval = setInterval(() => {
      if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        clearInterval(interval); resolve();
      } else if (++tries > 40) {
        clearInterval(interval); reject(new Error('pdf.js não carregou'));
      }
    }, 100);
  });

  const pdfFirstPageToBase64 = async (arrayBuffer) => {
    await waitForPdfJs();
    const copy = arrayBuffer.slice(0);
    const pdfDoc = await window.pdfjsLib.getDocument({ data: new Uint8Array(copy), password: '', disableRange: true, disableStream: true }).promise;
    const page = await pdfDoc.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    page.cleanup();
    return canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
  };

  const resizeImageForAI = (file) => new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1280;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else { w = Math.round(w * MAX / h); h = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.88).split(',')[1]);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });

  const classifyByFilename = (filename) => {
    const name = normalize(filename).replace(/[_\-\.]/g, ' ');
    return matchKeywords(name);
  };

  const classifyByPdfMetadata = async (arrayBuffer) => {
    try {
      if (!window.pdfjsLib) return null;
      const pdfDoc = await window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)), password: '', disableRange: true, disableStream: true }).promise;
      const meta = await pdfDoc.getMetadata().catch(() => null);
      if (!meta) return null;
      const info = meta.info || {};
      const combined = [info.Title, info.Subject, info.Keywords, info.Author].filter(Boolean).join(' ');
      if (!combined.trim()) return null;
      return matchKeywords(combined);
    } catch { return null; }
  };

  const classifyByPdfProducer = async (arrayBuffer) => {
    try {
      if (!window.pdfjsLib) return null;
      const pdfDoc = await window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)), password: '', disableRange: true, disableStream: true }).promise;
      const meta = await pdfDoc.getMetadata().catch(() => null);
      if (!meta) return null;
      const info = meta.info || {};
      const combined = [info.Producer, info.Creator].filter(Boolean).join(' ').toLowerCase();
      if (!combined.trim()) return null;
      if (/serpro|receita federal|dirpf|rfb/.test(combined)) return { category: 'imposto_renda', order: ORDER_MAP['imposto_renda'] ?? 99, label: 'Imposto de Renda' };
      if (/detran/.test(combined)) return { category: 'cnh', order: ORDER_MAP['cnh'] ?? 99, label: 'CNH' };
      if (/caixa|cef|fgts/.test(combined)) return { category: 'fgts', order: ORDER_MAP['fgts'] ?? 99, label: 'FGTS' };
      if (/esocial|ministerio do trabalho|mte/.test(combined)) return { category: 'ctps', order: ORDER_MAP['ctps'] ?? 99, label: 'Carteira de Trabalho (CTPS)' };
      return matchKeywords(combined);
    } catch { return null; }
  };

  const classifyByPdfText = async (arrayBuffer) => {
    try {
      if (!window.pdfjsLib) return null;
      const pdfDoc = await window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)), password: '', disableRange: true, disableStream: true }).promise;
      const numPages = Math.min(pdfDoc.numPages, 3);
      let fullText = '';
      for (let p = 1; p <= numPages; p++) {
        const page = await pdfDoc.getPage(p);
        const content = await page.getTextContent();
        fullText += content.items.map(i => i.str).join(' ') + ' ';
        page.cleanup();
      }
      if (fullText.trim().length < 20) return null;
      return matchKeywords(fullText);
    } catch { return null; }
  };

  const loadTesseract = () => new Promise((resolve, reject) => {
    if (window.Tesseract) { resolve(window.Tesseract); return; }
    const existing = document.getElementById('tesseract-script');
    if (existing) { existing.addEventListener('load', () => resolve(window.Tesseract)); return; }
    const s = document.createElement('script');
    s.id = 'tesseract-script';
    s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    s.onload = () => resolve(window.Tesseract);
    s.onerror = reject;
    document.body.appendChild(s);
  });

  const classifyByOCR = async (arrayBuffer, mime) => {
    try {
      const Tesseract = await loadTesseract();
      let imageData;
      if (mime === 'image/jpeg') {
        imageData = `data:image/jpeg;base64,${arrayBuffer}`;
      } else {
        const blob = new Blob([arrayBuffer], { type: mime });
        imageData = URL.createObjectURL(blob);
      }
      const { data: { text } } = await Tesseract.recognize(imageData, 'por', { logger: () => {} });
      if (imageData.startsWith('blob:')) URL.revokeObjectURL(imageData);
      if (!text || text.trim().length < 15) return null;
      return matchKeywords(text);
    } catch { return null; }
  };

  const tryModel = async (model, b64, mime) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'HTTP-Referer': window.location.origin, 'X-Title': 'Destemidos Imoveis' },
        body: JSON.stringify({ model, max_tokens: 100, temperature: 0.1, messages: [{ role: 'user', content: [{ type: 'image_url', image_url: { url: `data:${mime};base64,${b64}` } }, { type: 'text', text: CLASSIFY_PROMPT }] }] }),
      });
      clearTimeout(timeoutId);
      if (res.status === 429) { await sleep(2000); return null; }
      if (!res.ok) return null;
      const json = await res.json();
      const text = json.choices?.[0]?.message?.content || '';
      const match = text.match(/\{[^}]+\}/);
      if (!match) return null;
      const parsed = JSON.parse(match[0]);
      const cat = parsed.category || 'outros';
      return { category: cat, order: ORDER_MAP[cat] ?? 99, label: parsed.label || 'Outro Documento' };
    } catch (err) {
      clearTimeout(timeoutId);
      return null;
    }
  };

  const classifyDoc = async (file) => {
    try {
      const arm1 = classifyByFilename(file.name);
      if (arm1) return arm1;

      const masterBuffer = await file.arrayBuffer();
      let b64, mime;

      if (file.type === 'application/pdf') {
        const arm5 = await classifyByPdfMetadata(masterBuffer.slice(0));
        if (arm5) return arm5;
        const arm6 = await classifyByPdfProducer(masterBuffer.slice(0));
        if (arm6) return arm6;
        const arm2 = await classifyByPdfText(masterBuffer.slice(0));
        if (arm2) return arm2;
        b64 = await pdfFirstPageToBase64(masterBuffer.slice(0));
        mime = 'image/jpeg';
        const arm4 = await classifyByOCR(b64, 'image/jpeg');
        if (arm4) return arm4;
      } else if (file.type.startsWith('image/')) {
        mime = 'image/jpeg';
        b64 = await resizeImageForAI(file);
        if (!b64) return { category: 'outros', order: 99, label: 'Outro Documento' };
        const arm4img = await classifyByOCR(masterBuffer.slice(0), mime);
        if (arm4img) return arm4img;
      } else {
        return { category: 'outros', order: 99, label: 'Outro Documento' };
      }

      for (const model of VISION_MODELS) {
        const result = await tryModel(model, b64, mime);
        if (result) return result;
        await sleep(300);
      }

      return { category: 'outros', order: 99, label: 'Outro Documento' };
    } catch {
      return { category: 'outros', order: 99, label: 'Outro Documento' };
    }
  };

  const classifyInBatches = async (docs, batchSize = 3) => {
    const results = new Array(docs.length);
    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = docs.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (doc, batchIdx) => {
          setPendingDocs(prev => prev.map(d => d.id === doc.id ? { ...d, aiLabel: '🔍' } : d));
          setOrganizeProgress(prev => ({ ...prev, current: i + batchIdx + 1, label: doc.name.length > 22 ? doc.name.substring(0, 22) + '…' : doc.name }));
          const result = await classifyDoc(doc.file);
          const done = { ...doc, aiLabel: result.label, aiOrder: result.order };
          setPendingDocs(prev => prev.map(d => d.id === doc.id ? done : d));
          return done;
        })
      );
      batchResults.forEach((r, batchIdx) => { results[i + batchIdx] = r; });
      if (i + batchSize < docs.length) await sleep(500);
    }
    return results;
  };

  const handleOrganizeAll = async (pendingDocs, isOrganizingDocs) => {
    if (!OPENROUTER_KEY || pendingDocs.length === 0 || isOrganizingDocs) return;
    setOrganizeProgress({ current: 0, total: pendingDocs.length, label: 'Preparando...' });
    setCardAnimPhase('pulse');
    setChatMessages(prev => [...prev, { role: 'bot', content: `🔄 **Reorganizando ${pendingDocs.length} documento${pendingDocs.length > 1 ? 's' : ''}...**\n\nAnalisando tudo com IA... ✨` }]);
    const classified = await classifyInBatches([...pendingDocs], 3);
    const sorted = [...classified].sort((a, b) => (a.aiOrder ?? 99) - (b.aiOrder ?? 99));
    setPendingDocs(sorted);
    setCardAnimPhase('scatter');
    setTimeout(() => { setCardAnimPhase('idle'); }, 800);
    setOrganizeProgress({ current: 0, total: 0, label: '' });
    const resumo = sorted.map((d, i) => `${i + 1}. ${d.aiLabel}`).join('\n');
    setChatMessages(prev => [...prev, { role: 'bot', content: `✅ **Tudo organizado na ordem certa:**\n\n${resumo}\n\nAjuste arrastando se precisar e clique em **Finalizar PDF**! 📄` }]);
  };

  return { classifyDoc, classifyInBatches, handleOrganizeAll, OPENROUTER_KEY };
}
