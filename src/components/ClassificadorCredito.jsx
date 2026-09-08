import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, Download, Search, ChevronDown, ChevronRight, AlertCircle, X, FileDown, Copy, Check, Filter, MessageSquare, Zap, Tag, Loader2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Regras de leitura do relatório (exportação do Salesforce "Avaliações de
// crédito da minha equipe") e de classificação por categoria.
// ---------------------------------------------------------------------------

const CATEGORY_ORDER = [
  { key: "Aprovado", label: "Aprovado", group: "aprovado", sheet: "Aprovados" },
  { key: "Pré-aprovado", label: "Pré-aprovado", group: "aprovado", sheet: "Pré-aprovados" },
  { key: "Enviado para Análise", label: "Enviado para análise", group: "pendente", sheet: "Enviado_para_Analise" },
  { key: "Rascunho", label: "Rascunho", group: "pendente", sheet: "Rascunho" },
  { key: "Reprovado - Comprometimento de Renda", label: "Reprovado — Comprometimento de renda", group: "reprovado", sheet: "Reprov_Comprometimento" },
  { key: "Reprovado - BACEN", label: "Reprovado — BACEN", group: "reprovado", sheet: "Reprov_BACEN" },
  { key: "Reprovado - SCR", label: "Reprovado — SCR", group: "reprovado", sheet: "Reprov_SCR" },
  { key: "Reprovado - SERASA/Restrição", label: "Reprovado — Serasa/Restrição", group: "reprovado", sheet: "Reprov_Serasa_Restricao" },
  { key: "Reprovado - Outros/Documentação", label: "Reprovado — Outros/Documentação", group: "reprovado", sheet: "Reprov_Outros_Documentacao" },
  { key: "Outros", label: "Não reconhecidos", group: "outros", sheet: "Outros" },
];

const GROUP_COLORS = {
  aprovado: { accent: "#2F6E51", soft: "#E4EFE8" },
  pendente: { accent: "#7A6A46", soft: "#F1ECDF" },
  reprovado: { accent: "#A6394A", soft: "#F5E4E6" },
  outros: { accent: "#5B6472", soft: "#E9EBEE" },
};

const JUST_BG_BY_GROUP = {
  aprovado: "#bfdbbf",
  pendente: "#bdb395",
  reprovado: "#f7cbcb",
  outros: "#E9EBEE",
};

const RANKING_PRIORITY = ["DIAMANTE", "OURO", "PRATA", "BRONZE", "AÇO", "NÃO ELEG", "INFORMAÇÃO NÃO DISPON"];

function rankingPriorityIndex(value) {
  const s = (value || "").toString().toUpperCase();
  const idx = RANKING_PRIORITY.findIndex((p) => s.includes(p));
  return idx === -1 ? RANKING_PRIORITY.length : idx;
}

const RANKING_STYLES = [
  { test: (s) => s.includes("OURO"), bg: "#F4E6BE", fg: "#7A5B12" },
  { test: (s) => s.includes("PRATA"), bg: "#E4E6E9", fg: "#5A5F66" },
  { test: (s) => s.includes("DIAMANTE"), bg: "#DBF0F1", fg: "#1F6E73" },
  { test: (s) => s.includes("BRONZE"), bg: "#E9D2B8", fg: "#7A4A1F" },
  { test: (s) => s.includes("AÇO") || s.includes("ACO"), bg: "#DCE4EC", fg: "#3F5872" },
  { test: (s) => s.includes("NÃO ELEG") || s.includes("NAO ELEG"), bg: "#F5DCDF", fg: "#8C2E3B" },
];
const DEFAULT_RANKING_STYLE = { bg: "#ECEAE5", fg: "#6B655A" };

function rankingStyle(value) {
  const s = (value || "").toString().toUpperCase();
  const hit = RANKING_STYLES.find((r) => r.test(s));
  return hit || DEFAULT_RANKING_STYLE;
}

function clean(v) {
  return v == null ? "" : v.toString().replace(/\s*↑\s*$/, "").trim();
}

// Tenta a Clipboard API moderna e, se falhar ou não estiver disponível
// (contexto não seguro, iframe sem permissão, foco perdido, etc.), cai para
// o fallback com textarea + execCommand. Retorna uma Promise<boolean>.
function copyToClipboard(text) {
  const fallback = () => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  };

  if (navigator.clipboard?.writeText) {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => fallback());
  }
  return Promise.resolve(fallback());
}

// ---------------------------------------------------------------------------
// Persistência local — guarda os dados já processados (planilhas, PDFs e
// tabelas de preço) no localStorage do navegador, para que o usuário não
// precise reenviar os arquivos toda vez que abrir o app novamente. Os dados
// ficam salvos só no computador/navegador do próprio usuário.
// ---------------------------------------------------------------------------

const STORAGE_PREFIX = "classificadorCredito_";

function saveToStorage(key, value) {
  try {
    if (value == null) {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } else {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    }
    return true;
  } catch (err) {
    // Provavelmente estourou a cota do localStorage (ex.: arquivo muito
    // grande). Não trava o app — só deixa de salvar localmente.
    console.warn(`Não foi possível salvar "${key}" localmente:`, err);
    return false;
  }
}

function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn(`Não foi possível carregar "${key}" salvo localmente:`, err);
    return null;
  }
}

function clearAllStoredData() {
  ["main", "raiox", "precos"].forEach((key) => localStorage.removeItem(STORAGE_PREFIX + key));
}

function norm(v) {
  return clean(v).toUpperCase();
}

function includesAny(haystack, needles) {
  return needles.some((n) => haystack.includes(n));
}

// Encontra a linha de cabeçalho procurando a coluna "Corretor" e mapeia os
// índices das colunas que interessam pelo texto do cabeçalho (não pela
// posição), para tolerar pequenas variações no relatório exportado.
function locateColumns(rows) {
  let headerIdx = -1;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] || [];
    if (row.some((c) => clean(c) === "Corretor")) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx === -1) {
    throw new Error(
      'Não encontrei a coluna "Corretor" neste arquivo. Confirme se é o relatório do Salesforce exportado com os campos de Corretor, Status, Ranking, Justificativa, Conta e Nome da Avaliação de crédito.'
    );
  }
  const header = rows[headerIdx].map(clean);
  const idx = {};
  header.forEach((h, i) => {
    if (!h) return;
    if (h === "Corretor") idx.corretor = i;
    else if (h.startsWith("Status")) idx.status = i;
    else if (h.includes("Ranking")) idx.ranking = i;
    else if (h === "Justificativa") idx.justificativa = i;
    else if (h.includes("Data de criação")) idx.dataCriacao = i;
    else if (h.includes("Nome da Avaliação")) idx.nomeAvaliacao = i;
    else if (h === "Conta") idx.conta = i;
    else if (h === "Empreendimento") idx.empreendimento = i;
    else if (h.includes("Nome Imobiliária") && !h.includes(":")) idx.nomeImobiliaria = i;
    else if (h.includes("Valor estimado")) idx.valorEstimado = i;
    else if (h.includes("Valor do Financiamento")) idx.valorFinanciamento = i;
    else if (h.includes("Valor Parcela")) idx.valorParcela = i;
    else if (h.includes("Renda Apurada")) idx.rendaApurada = i;
    else if (h.includes("Data da Análise")) idx.dataAnalise = i;
  });
  const required = ["corretor", "status", "nomeAvaliacao", "conta"];
  const missing = required.filter((k) => idx[k] == null);
  if (missing.length) {
    throw new Error(
      "Faltam colunas essenciais no relatório (" +
        missing.join(", ") +
        "). Verifique se o export do Salesforce inclui Corretor, Status, Conta e Nome da Avaliação de crédito."
    );
  }
  return { headerIdx, idx };
}

function parseWorkbook(arrayBuffer) {
  const wb = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: true });
  const { headerIdx, idx } = locateColumns(rows);

  let lastCorretor = "";
  let lastStatus = "";
  const records = [];

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;

    const corretorCell = clean(row[idx.corretor]);
    if (corretorCell) lastCorretor = corretorCell;

    const statusCell = clean(row[idx.status]);
    if (statusCell && statusCell !== "Subtotal") lastStatus = statusCell;

    const nomeAval = clean(row[idx.nomeAvaliacao]);
    if (!nomeAval.startsWith("AC-")) continue; // pula linhas de subtotal/contagem/rodapé

    records.push({
      id: `${nomeAval}-${i}`,
      corretor: lastCorretor,
      status: lastStatus,
      nomeAvaliacao: nomeAval,
      nomeDaConta: clean(row[idx.conta]),
      ranking: clean(row[idx.ranking]) || "—",
      justificativa: clean(row[idx.justificativa]),
      empreendimento: idx.empreendimento != null ? clean(row[idx.empreendimento]) : "",
      nomeImobiliaria: idx.nomeImobiliaria != null ? clean(row[idx.nomeImobiliaria]) : "",
      dataCriacao: idx.dataCriacao != null ? clean(row[idx.dataCriacao]) : "",
      dataAnalise: idx.dataAnalise != null ? clean(row[idx.dataAnalise]) : "",
      valorEstimado: idx.valorEstimado != null ? row[idx.valorEstimado] : null,
      valorFinanciamento: idx.valorFinanciamento != null ? row[idx.valorFinanciamento] : null,
      valorParcela: idx.valorParcela != null ? row[idx.valorParcela] : null,
      rendaApurada: idx.rendaApurada != null ? row[idx.rendaApurada] : null,
    });
  }

  if (records.length === 0) {
    throw new Error(
      "Encontrei o cabeçalho, mas nenhuma linha de avaliação (código iniciando em \"AC-\"). Confira se o relatório tem dados abaixo do cabeçalho."
    );
  }

  return records;
}

// Classifica um registro. Reprovados podem cair em mais de uma categoria
// (o mesmo caso pode ter, por ex., pendência no BACEN e no Serasa ao mesmo
// tempo) — isso é intencional e espelha como a triagem manual é feita.
function classify(rec) {
  const status = norm(rec.status);
  const just = norm(rec.justificativa);

  if (status.includes("RASCUNHO")) return ["Rascunho"];
  if (status.includes("ENVIADO")) return ["Enviado para Análise"];

  if (status.includes("REPROVADA")) {
    const cats = [];
    if (includesAny(just, ["COMPROMETIMENTO", "MARGEM INSUFICIENTE", "SEM CAPACIDADE", "COMPROMISSOS FINANCEIROS", "CAPACIDADE GERADA"]))
      cats.push("Reprovado - Comprometimento de Renda");
    if (just.includes("BACEN")) cats.push("Reprovado - BACEN");
    if (just.includes("SCR") || just.includes("SICAQ")) cats.push("Reprovado - SCR");
    if (includesAny(just, ["RESTRIÇÃO", "RESTRICAO", "SERASA", "CADIN"])) cats.push("Reprovado - SERASA/Restrição");
    if (cats.length === 0) cats.push("Reprovado - Outros/Documentação");
    return cats;
  }

  if (status.includes("APROVADA")) {
    const isPre = includesAny(just, ["PRÉ-APROVAD", "PRE-APROVAD", "PRE APROVAD", "PRÉ APROVAD"]);
    return [isPre ? "Pré-aprovado" : "Aprovado"];
  }

  return ["Outros"];
}

function categoryColorFor(rec) {
  const cats = classify(rec);
  const meta = CATEGORY_ORDER.find((c) => c.key === cats[0]);
  return meta ? GROUP_COLORS[meta.group] : GROUP_COLORS.outros;
}

function categoryGroupFor(rec) {
  const cats = classify(rec);
  const meta = CATEGORY_ORDER.find((c) => c.key === cats[0]);
  return meta ? meta.group : "outros";
}

function buildIndex(records) {
  const byCategory = {};
  CATEGORY_ORDER.forEach((c) => (byCategory[c.key] = []));
  records.forEach((rec) => {
    classify(rec).forEach((cat) => {
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(rec);
    });
  });
  return byCategory;
}

function downloadWorkbook(byCategory, totalRecords) {
  const wb = XLSX.utils.book_new();

  const resumoRows = [["Categoria", "Quantidade"]];
  CATEGORY_ORDER.forEach((c) => resumoRows.push([c.label, (byCategory[c.key] || []).length]));
  resumoRows.push(["TOTAL DE REGISTROS (únicos)", totalRecords]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resumoRows), "Resumo");

  CATEGORY_ORDER.forEach((c) => {
    const rows = byCategory[c.key] || [];
    if (rows.length === 0 && c.key === "Outros") return;
    const aoa = [["Corretor", "Nome da Conta", "Nome da Avaliação", "Ranking", "Justificativa"]];
    rows.forEach((r) => aoa.push([r.corretor, r.nomeDaConta, r.nomeAvaliacao, r.ranking, r.justificativa]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), c.sheet.slice(0, 31));
  });

  XLSX.writeFile(wb, "Avaliacoes_Classificadas.xlsx");
}

function downloadCategoryCsv(category, rows) {
  const aoa = [["Corretor", "Nome da Conta", "Nome da Avaliação", "Ranking", "Justificativa"]];
  rows.forEach((r) => aoa.push([r.corretor, r.nomeDaConta, r.nomeAvaliacao, r.ranking, r.justificativa]));
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${category.sheet}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Raio X — cruza Agendamentos, Visitas e Pastas por corretor.
//
// Cada um desses relatórios do Salesforce vem no mesmo formato "agrupado"
// (corretor preenchido só na 1ª linha do grupo, linhas de Subtotal/Total no
// fim). Aqui tratamos os 3 de forma genérica: localizamos a coluna do
// corretor, a coluna da conta (cliente) e a melhor coluna de data disponível
// para cada arquivo, na seguinte ordem de preferência: Data de criação >
// Data de comparecimento > Data Agendamento.
// ---------------------------------------------------------------------------

function parseDateBR(value) {
  if (value == null) return null;
  const s = value.toString().trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const dt = new Date(year, month - 1, day);
  return isNaN(dt.getTime()) ? null : dt;
}

function formatDateShort(date) {
  if (!date) return "—";
  const d = String(date.getDate()).padStart(2, "0");
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const y = String(date.getFullYear()).slice(-2);
  return `${d}/${mo}/${y}`;
}

// Os 3 relatórios trazem um título logo na primeira célula não vazia da
// planilha (ex.: "AGENDAMENTOS GUSTAVO", "VISITAS GUSTAVO", "Pastas Gustavo").
// Usamos isso para confirmar que o arquivo enviado é mesmo da categoria
// esperada, e não um arquivo trocado (ex.: mandar Agendamentos na caixa de
// Pastas).
function detectReportTitle(rows) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] || [];
    for (const cell of row) {
      const c = clean(cell);
      if (c) return c;
    }
  }
  return "";
}

const RAIOX_CATEGORY_LABELS = {
  agendamentos: "Agendamentos",
  visitas: "Visitas",
  pastas: "Pastas",
};

function detectCategoryFromTitle(title) {
  const t = norm(title);
  if (t.includes("AGENDAMENTO")) return "agendamentos";
  if (t.includes("VISITA")) return "visitas";
  if (t.includes("PASTA")) return "pastas";
  return null;
}

function locateRaioXColumns(rows) {
  let headerIdx = -1;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] || [];
    if (row.some((c) => norm(c).startsWith("CORRETOR"))) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx === -1) {
    throw new Error(
      'Não encontrei a coluna "Corretor" neste arquivo. Confirme se é um relatório do Salesforce exportado com Corretor, Conta e uma data (criação, comparecimento ou agendamento).'
    );
  }
  const header = rows[headerIdx].map(clean);
  const idx = {};
  header.forEach((h, i) => {
    if (!h) return;
    const hl = h.toLowerCase();
    if (hl.startsWith("corretor")) idx.corretor = i;
    else if (h === "Conta" || hl.includes("nome da conta")) idx.conta = i;
    else if (hl.includes("data de criação")) idx.dataCriacao = i;
    else if (hl.includes("data de comparecimento")) idx.dataComparecimento = i;
    else if (hl.includes("data agendamento")) idx.dataAgendamento = i;
  });
  if (idx.corretor == null || idx.conta == null) {
    throw new Error(
      "Não encontrei as colunas de Corretor e Conta neste relatório. Confira se é a exportação correta do Salesforce (Agendamentos, Visitas ou Pastas)."
    );
  }
  return { headerIdx, idx };
}

// Retorna uma lista de {corretor, conta, date} — uma linha por atividade,
// já com o corretor "preenchido para baixo" como no relatório agrupado.
function parseRaioXSheet(arrayBuffer, expectedCategory) {
  const wb = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: true });

  const title = detectReportTitle(rows);
  const detectedCategory = detectCategoryFromTitle(title);
  if (expectedCategory && detectedCategory && detectedCategory !== expectedCategory) {
    throw new Error(
      `Este arquivo parece ser o relatório de "${RAIOX_CATEGORY_LABELS[detectedCategory]}" (título: "${title}"), mas foi enviado na caixa de "${RAIOX_CATEGORY_LABELS[expectedCategory]}". Confira e envie o arquivo certo.`
    );
  }

  const { headerIdx, idx } = locateRaioXColumns(rows);

  const dateFields = ["dataCriacao", "dataComparecimento", "dataAgendamento"].filter((f) => idx[f] != null);

  let lastCorretor = "";
  const records = [];

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;

    const corretorCell = clean(row[idx.corretor]);
    const corretorCellNorm = norm(corretorCell);
    // As linhas de subtotal do Salesforce escrevem "Subtotal"/"Total" na própria
    // coluna do corretor — não pode virar o "corretor atual" do preenchimento
    // para baixo, senão contamina as linhas seguintes.
    if (corretorCell && corretorCellNorm !== "SUBTOTAL" && corretorCellNorm !== "TOTAL") {
      lastCorretor = corretorCell;
    }

    const contaCell = clean(row[idx.conta]);
    if (!contaCell) continue; // linha de Subtotal/Total/rodapé — sem cliente, ignora
    const contaCellNorm = norm(contaCell);
    // Dependendo do agrupamento, a coluna da conta pode receber "Contagem",
    // "Soma", "Subtotal"/"Total" ou até um número (a própria contagem) nas
    // linhas de resumo do relatório — nada disso é um cliente de verdade.
    if (["CONTAGEM", "SOMA", "SUBTOTAL", "TOTAL"].includes(contaCellNorm)) continue;
    if (/^-?\d+([.,]\d+)?$/.test(contaCell)) continue;

    let date = null;
    for (const f of dateFields) {
      const parsed = parseDateBR(row[idx[f]]);
      if (parsed) {
        date = parsed;
        break;
      }
    }

    records.push({ corretor: lastCorretor, conta: contaCell, date });
  }

  if (records.length === 0) {
    throw new Error(
      "Encontrei o cabeçalho, mas nenhuma linha com Conta preenchida. Confira se o arquivo tem dados abaixo do cabeçalho."
    );
  }

  return records;
}

// AGENDAMENTOS: desconsidera repetições apenas quando o MESMO cliente
// aparece MAIS DE UMA VEZ NO MESMO DIA (ex.: duplicidade de sistema, ou o
// mesmo horário lançado 2x). Reagendamento para outro dia conta como
// trabalho novo e soma no total — só a repetição no mesmo dia é descartada.
function aggregateAgendamentos(records) {
  const map = new Map();
  records.forEach((r) => {
    if (!r.corretor) return;
    if (!map.has(r.corretor)) map.set(r.corretor, { seen: new Set(), lastDate: null, total: 0 });
    const entry = map.get(r.corretor);
    // Chave de dedup: cliente + dia (repetições só são descartadas se caírem
    // no mesmo dia). Quando não há data disponível, cai de volta para dedup
    // só por cliente.
    const dayKey = r.date
      ? `${r.date.getFullYear()}-${r.date.getMonth()}-${r.date.getDate()}`
      : "SEM-DATA";
    const key = `${norm(r.conta)}|${dayKey}`;
    if (entry.seen.has(key)) return; // mesmo cliente, mesmo dia -> repetição, ignora
    entry.seen.add(key);
    entry.total += 1;
    if (r.date && (!entry.lastDate || r.date > entry.lastDate)) entry.lastDate = r.date;
  });
  const result = new Map();
  map.forEach((entry, corretor) => result.set(corretor, { total: entry.total, lastDate: entry.lastDate }));
  return result;
}

// VISITAS e PASTAS: desconsidera repetições do mesmo cliente independente do
// dia — a mesma pessoa que visitou/foi cadastrada em pasta mais de uma vez
// (mesmo dia ou dias diferentes, ex. visita retorno) conta só 1 vez.
function aggregateClientesUnicos(records) {
  const map = new Map();
  records.forEach((r) => {
    if (!r.corretor) return;
    if (!map.has(r.corretor)) map.set(r.corretor, { clients: new Set(), lastDate: null });
    const entry = map.get(r.corretor);
    entry.clients.add(norm(r.conta));
    if (r.date && (!entry.lastDate || r.date > entry.lastDate)) entry.lastDate = r.date;
  });
  const result = new Map();
  map.forEach((entry, corretor) => result.set(corretor, { total: entry.clients.size, lastDate: entry.lastDate }));
  return result;
}

function buildRaioXSummary(agMap, visMap, pastaMap) {
  const corretores = new Set([...agMap.keys(), ...visMap.keys(), ...pastaMap.keys()]);
  const empty = { total: 0, lastDate: null };
  return [...corretores]
    .sort((a, b) => a.localeCompare(b, "pt-BR"))
    .map((corretor) => ({
      corretor,
      agendamentos: agMap.get(corretor) || empty,
      visitas: visMap.get(corretor) || empty,
      pastas: pastaMap.get(corretor) || empty,
    }));
}

function raioXLine(row) {
  return (
    `Corretor ${row.corretor} ` +
    `agendamentos: ${row.agendamentos.total}/ ultimo dia de agendamento ${formatDateShort(row.agendamentos.lastDate)} ` +
    `visitas: ${row.visitas.total}/ ultimo dia de visita ${formatDateShort(row.visitas.lastDate)} ` +
    `pastas: ${row.pastas.total}/ ultimo dia de pasta ${formatDateShort(row.pastas.lastDate)}`
  );
}

// Usado apenas pelo ícone de copiar de cada linha: só os valores (sem nome
// do corretor nem rótulos), na mesma ordem das colunas da tabela.
function raioXRowValues(row) {
  return [
    row.agendamentos.total,
    formatDateShort(row.agendamentos.lastDate),
    row.visitas.total,
    formatDateShort(row.visitas.lastDate),
    row.pastas.total,
    formatDateShort(row.pastas.lastDate),
  ].join("\t");
}

function downloadRaioXWorkbook(rows) {
  const wb = XLSX.utils.book_new();
  const aoa = [
    ["Corretor", "Agendamentos", "Último dia agendamento", "Visitas", "Último dia visita", "Pastas", "Último dia pasta"],
  ];
  rows.forEach((r) =>
    aoa.push([
      r.corretor,
      r.agendamentos.total,
      formatDateShort(r.agendamentos.lastDate),
      r.visitas.total,
      formatDateShort(r.visitas.lastDate),
      r.pastas.total,
      formatDateShort(r.pastas.lastDate),
    ])
  );
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), "Raio X");
  XLSX.writeFile(wb, "RaioX_Corretores.xlsx");
}

// Caixa de upload compacta e reutilizável para os 3 arquivos do Raio X.
function MiniDropzone({ label, hint, fileName, error, loading, count, onFile, inputRef }) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div
      className={`rx-drop${dragOver ? " drag" : ""}${fileName ? " done" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        onFile(e.dataTransfer.files?.[0]);
      }}
    >
      <FileSpreadsheet size={22} color={fileName ? "#2F6E51" : "#5B6472"} />
      <div className="rx-drop-label">{label}</div>
      {loading ? (
        <div className="rx-drop-status">Lendo…</div>
      ) : fileName ? (
        <div className="rx-drop-status ok">
          {fileName} · {count} linha{count === 1 ? "" : "s"}
        </div>
      ) : (
        <div className="rx-drop-hint">{hint}</div>
      )}
      {error && (
        <div className="rx-drop-error">
          <AlertCircle size={13} /> <span>{error}</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabela de Preços — lê o PDF da Tabela Promocional Direcional e extrai, por
// empreendimento, as unidades priorizando maior Bônus Adimplência e menor
// diferença (Avaliação vs. Valor Final da Venda).
//
// A lógica é a mesma do leitor standalone: localizamos as colunas pelo texto
// do cabeçalho (posição X na página), agrupamos os itens de texto em linhas
// por coordenada Y, e casamos cada valor numérico com a coluna mais próxima
// horizontalmente. Está dividida em 3 funções, na ordem em que atuam:
//   1) parsePriceTablePdf   — função principal: percorre as páginas do PDF
//   2) exportPriceTableXlsx — exporta o resultado para Excel
//   (as funções utilitárias abaixo dão suporte às duas acima)
// ---------------------------------------------------------------------------

function parsePriceCurrency(valStr) {
  if (!valStr) return 0;
  let cleaned = valStr.replace(/[^\d.,-]/g, "");
  if (!cleaned) return 0;
  if (cleaned.includes(".") && cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (cleaned.includes(",")) {
    cleaned = cleaned.replace(",", ".");
  } else if ((cleaned.match(/\./g) || []).length > 1) {
    const parts = cleaned.split(".");
    const decimal = parts.pop();
    cleaned = parts.join("") + "." + decimal;
  }
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function groupPriceTextItemsIntoLines(items) {
  if (!items || items.length === 0) return [];
  const validItems = items.filter((i) => i.str && i.str.trim().length > 0);
  const lines = [];
  validItems.forEach((item) => {
    const x = item.transform[4];
    const y = item.transform[5];
    const fontSize = Math.abs(item.transform[0]) || Math.abs(item.transform[3]) || 10;
    let line = lines.find((l) => Math.abs(l.y - y) <= 2.5);
    const token = { str: item.str.trim(), x, y, fontSize, width: item.width || 0 };
    if (line) {
      line.items.push(token);
      line.y = (line.y * (line.items.length - 1) + y) / line.items.length;
    } else {
      lines.push({ y, items: [token] });
    }
  });
  lines.sort((a, b) => b.y - a.y);
  lines.forEach((line) => {
    line.items.sort((a, b) => a.x - b.x);
    line.fullText = line.items.map((i) => i.str).join(" ");
  });
  return lines;
}

function isPriceTitleExcluded(text) {
  if (!text || text.trim().length < 3) return true;
  const upper = text.toUpperCase().trim();
  const exclusions = [
    /^TABELA/i, /ITBI/i, /MINHA CASA/i, /DESCONTOS EXCLUSIVOS/i, /LANÇAMENTO/i, /LANCAMENTO/i,
    /ÚLTIMAS UNIDADES/i, /ULTIMAS UNIDADES/i, /PARA VENDAS/i, /^\d+/,
    /AGOSTO|JULHO|SETEMBRO|OUTUBRO|NOVEMBRO|DEZEMBRO|JANEIRO|FEVEREIRO|MARÇO|MARCO|ABRIL|MAIO|JUNHO/i,
    /QUINZENA|VERSÃO|VERSAO/i, /^BLOCO/i, /AVALIA/i, /VALOR/i, /DESCONTO/i, /MCMV/i, /SBPE/i,
    /CAMPANHA/i, /ADIMPL/i, /DIRECIONAL/i, /SISTEMA/i, /PÁGINA|PAGINA/i, /REVISÃO|REVISAO/i,
    /PREVISÃO|PREVISAO/i, /COORDENADOR/i, /FIQUE ATENTO/i, /ASSOCIATIVO/i, /TIPOLOGIA/i,
    /UNIDADES/i, /GARDEN/i, /AREA|ÁREA/i, /PRIVATIVA/i,
  ];
  return exclusions.some((regex) => regex.test(upper));
}

function extractPriceTableTitle(lines) {
  let bestTitle = null;
  let maxFontSize = 0;
  for (const line of lines) {
    for (const item of line.items) {
      if (item.fontSize >= 8 && !isPriceTitleExcluded(item.str)) {
        if (!isPriceTitleExcluded(line.fullText)) {
          const candidate = line.fullText.replace(/[:\-\–]+$/, "").trim();
          if (item.fontSize > maxFontSize) {
            maxFontSize = item.fontSize;
            bestTitle = candidate;
          }
        }
      }
    }
  }
  if (bestTitle) return bestTitle;
  for (const line of lines) {
    for (const item of line.items) {
      if (item.fontSize >= 7 && !isPriceTitleExcluded(item.str)) return item.str.trim();
    }
  }
  return null;
}

function identifyPriceTableColumns(lines) {
  const cols = {
    avaliacao: null, valorFinal: null, bonusAdimplencia: null, valorVenda: null,
    desconto: null, bonusCampanha: null, mcmv: null, sbpe1: null, sbpe2: null,
  };
  const headerLines = lines.slice(0, 25);
  headerLines.forEach((line) => {
    line.items.forEach((item) => {
      const text = item.str.toUpperCase().trim();
      const itemCenterX = item.x + item.width / 2;
      if (text.includes("AVALIA")) {
        cols.avaliacao = { x: itemCenterX };
      } else if (
        text.includes("VALOR FINAL") || text.includes("APÓS DESCONTO") || text.includes("APOS DESCONTO") ||
        text.includes("DESCONTOS E BÔNUS") || text.includes("DESCONTOS E BONUS") || text.includes("FINAL DA VEND")
      ) {
        cols.valorFinal = { x: itemCenterX };
      } else if (text.includes("ADIMPL")) {
        cols.bonusAdimplencia = { x: itemCenterX };
      } else if (text.includes("VALOR DE VENDA") || text.includes("VALOR VENDA")) {
        cols.valorVenda = { x: itemCenterX };
      } else if (text === "DESCONTO" || text.includes("DESCONTO")) {
        if (!cols.valorFinal) cols.desconto = { x: itemCenterX };
      } else if (text.includes("CAMPANHA")) {
        cols.bonusCampanha = { x: itemCenterX };
      } else if (text.includes("MCMV")) {
        cols.mcmv = { x: itemCenterX };
      } else if (text.includes("SBPE 1") || text.includes("SBPE1")) {
        cols.sbpe1 = { x: itemCenterX };
      } else if (text.includes("SBPE 2") || text.includes("SBPE2")) {
        cols.sbpe2 = { x: itemCenterX };
      }
    });
  });
  if (!cols.valorFinal || !cols.bonusAdimplencia) {
    headerLines.forEach((line) => {
      const lineUpper = line.fullText.toUpperCase();
      if (!cols.valorFinal && (lineUpper.includes("VALOR FINAL") || lineUpper.includes("APÓS DESCONTO") || lineUpper.includes("APOS DESCONTO"))) {
        line.items.forEach((item) => {
          const t = item.str.toUpperCase();
          if (t.includes("FINAL") || t.includes("DESCONTO") || t.includes("BONUS")) {
            cols.valorFinal = { x: item.x + item.width / 2 };
          }
        });
      }
      if (!cols.bonusAdimplencia && (lineUpper.includes("ADIMPL") || lineUpper.includes("BONUS ADIMPL"))) {
        line.items.forEach((item) => {
          const t = item.str.toUpperCase();
          if (t.includes("ADIMPL")) cols.bonusAdimplencia = { x: item.x + item.width / 2 };
        });
      }
    });
  }
  return cols;
}

// FUNÇÃO 1 — percorre todas as páginas do PDF, identifica colunas e monta,
// por empreendimento, a lista de unidades (com bônus de adimplência e menor
// diferença já ordenados e limitados às 8 melhores por empreendimento).
async function parsePriceTablePdf(file, onProgress) {
  if (!window.pdfjsLib) {
    throw new Error("A biblioteca pdfjs-dist ainda está carregando. Aguarde alguns instantes e tente novamente.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  const numPages = pdfDoc.numPages;
  const projectMap = new Map();

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (onProgress) onProgress(pageNum, numPages);

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent({ normalizeWhitespace: true });

    const lines = groupPriceTextItemsIntoLines(textContent.items);
    if (lines.length === 0) continue;

    const columns = identifyPriceTableColumns(lines);
    if (!columns.avaliacao || !columns.valorFinal) continue;

    let pageTitle = extractPriceTableTitle(lines) || "Empreendimento Indefinido";
    const projectKey = pageTitle.toLowerCase().trim();

    if (!projectMap.has(projectKey)) {
      projectMap.set(projectKey, { title: pageTitle, units: [], campanhaLines: [] });
    }
    const currentProject = projectMap.get(projectKey);

    const avaliacaoX = columns.avaliacao.x;
    const activeCols = [
      { key: "avaliacao", pos: columns.avaliacao },
      { key: "valorFinal", pos: columns.valorFinal },
      { key: "bonusAdimplencia", pos: columns.bonusAdimplencia },
      { key: "valorVenda", pos: columns.valorVenda },
      { key: "desconto", pos: columns.desconto },
      { key: "bonusCampanha", pos: columns.bonusCampanha },
      { key: "mcmv", pos: columns.mcmv },
      { key: "sbpe1", pos: columns.sbpe1 },
      { key: "sbpe2", pos: columns.sbpe2 },
    ].filter((c) => c.pos !== null);

    for (const line of lines) {
      const lineUpper = line.fullText.toUpperCase();
      if ((lineUpper.includes("AVALIA") && lineUpper.includes("VALOR")) || lineUpper.includes("TIPOLOGIA") || lineUpper.includes("AREA PRIVATIVA")) {
        continue;
      }

      const labelCutoffX = avaliacaoX - 20;
      const labelItems = line.items.filter((item) => item.x + item.width < labelCutoffX);
      const dataItems = line.items.filter((item) => item.x + item.width >= labelCutoffX);
      const unitLabel = labelItems.map((i) => i.str).join(" ").trim();

      let parsedAvaliacao = 0;
      let parsedValorFinal = 0;
      let parsedBonus = 0;

      dataItems.forEach((item) => {
        const val = parsePriceCurrency(item.str);
        if (val > 0) {
          const itemCenterX = item.x + item.width / 2;
          let closestKey = null;
          let minDistance = Infinity;
          activeCols.forEach((col) => {
            const dist = Math.abs(itemCenterX - col.pos.x);
            if (dist < minDistance) {
              minDistance = dist;
              closestKey = col.key;
            }
          });
          if (minDistance < 75) {
            if (closestKey === "avaliacao") parsedAvaliacao = val;
            else if (closestKey === "valorFinal") parsedValorFinal = val;
            else if (closestKey === "bonusAdimplencia") parsedBonus = val;
          }
        }
      });

      if (parsedAvaliacao > 0 && parsedValorFinal > 0) {
        const diferenca = Math.abs(parsedAvaliacao - parsedValorFinal);
        currentProject.units.push({
          unidade: unitLabel || `Unidade ${currentProject.units.length + 1}`,
          avaliacao: parsedAvaliacao,
          valorFinal: parsedValorFinal,
          diferenca,
          bonusAdimplencia: parsedBonus > 0 ? parsedBonus : 0,
        });
      } else {
        const isHeaderJunk =
          lineUpper.includes("AVALIA") || lineUpper.includes("TIPOLOGIA") || lineUpper.includes("AREA PRIVATIVA") ||
          lineUpper.includes("VALOR FINAL") || lineUpper.includes("DESCONTO") || lineUpper.includes("GARDEN") ||
          lineUpper.includes("SBPE") || lineUpper.includes("MCMV") || lineUpper.includes("IMÓVEL") ||
          lineUpper.includes("IMOVEL") || lineUpper.includes("M²") || lineUpper.includes("(M²)") ||
          lineUpper.includes("BONUS") || lineUpper.includes("BÔNUS") || lineUpper.includes("TABELA PROMOCIONAL -") ||
          lineUpper.includes("DESCONTOS EXCLUSIVOS") || lineUpper.includes("MINHA CASA") || lineUpper.includes("QUINZENA") ||
          lineUpper.includes("REVISÃO") || lineUpper.includes("REVISAO") || lineUpper.includes("DIRECIONAL") ||
          lineUpper.includes("COORDENADOR") || lineUpper.includes("PREVISÃO") || lineUpper.includes("PREVISAO") ||
          lineUpper.includes("TABELA SUJEITA") || lineUpper.includes("FIQUE ATENTO") || lineUpper.includes("APARTAMENTO DE 1 QUARTO") ||
          lineUpper.includes("MODULO") || lineUpper.includes("MÓDULO");

        const isCampaignKeyword =
          (lineUpper.includes("CAMPANHA") && !lineUpper.includes("BONUS CAMPANHA") && !lineUpper.includes("BÔNUS CAMPANHA")) ||
          lineUpper.includes("FOLGA COMERCIAL") || lineUpper.includes("BONIFICADO") ||
          lineUpper.includes("ITBI REGISTRO") || lineUpper.includes("TAXAS GRATIS");

        if (!isHeaderJunk && isCampaignKeyword && line.fullText.trim().length > 5) {
          const cleanObs = line.fullText.trim();
          if (!currentProject.campanhaLines.includes(cleanObs)) currentProject.campanhaLines.push(cleanObs);
        }
      }
    }
  }

  if (projectMap.size === 0) {
    throw new Error(
      "Não foram encontradas as colunas 'Avaliação' e 'Valor Final da Venda Após Descontos e Bônus' no PDF. Confirme se o arquivo enviado é a Tabela de Preços promocional no formato correto."
    );
  }

  const resultProjects = [];
  projectMap.forEach((project) => {
    if (project.units.length === 0) return;
    const totalUnitsCount = project.units.length;

    let campanhaFinal = "CONDIÇÃO PADRÃO";
    if (project.campanhaLines && project.campanhaLines.length > 0) {
      const activeCampaigns = project.campanhaLines.filter(
        (l) => !l.toUpperCase().includes("CONDIÇÃO PADRÃO") && !l.toUpperCase().includes("CONDICAO PADRAO")
      );
      if (activeCampaigns.length > 0) campanhaFinal = activeCampaigns.join("; ");
    }

    const withBonus = project.units
      .filter((u) => u.bonusAdimplencia > 0)
      .sort((a, b) => (b.bonusAdimplencia !== a.bonusAdimplencia ? b.bonusAdimplencia - a.bonusAdimplencia : a.diferenca - b.diferenca));

    const withoutBonus = project.units
      .filter((u) => !u.bonusAdimplencia || u.bonusAdimplencia <= 0)
      .sort((a, b) => a.diferenca - b.diferenca);

    const topUnits = [...withBonus, ...withoutBonus].slice(0, 8);

    resultProjects.push({ title: project.title, totalUnits: totalUnitsCount, units: topUnits, campanha: campanhaFinal });
  });

  if (resultProjects.length === 0) {
    throw new Error("As colunas foram identificadas, mas não foi possível extrair valores válidos de unidades deste PDF.");
  }

  resultProjects.sort((a, b) => {
    const maxBonusA = Math.max(0, ...a.units.map((u) => u.bonusAdimplencia || 0));
    const maxBonusB = Math.max(0, ...b.units.map((u) => u.bonusAdimplencia || 0));
    if (maxBonusA > 0 && maxBonusB === 0) return -1;
    if (maxBonusA === 0 && maxBonusB > 0) return 1;
    if (maxBonusA > 0 && maxBonusB > 0 && maxBonusB !== maxBonusA) return maxBonusB - maxBonusA;
    return a.title.localeCompare(b.title, "pt-BR");
  });

  return resultProjects;
}

// FUNÇÃO 2 — exporta os empreendimentos/unidades extraídos para .xlsx.
function exportPriceTableXlsx(projects, fileName = "Tabela_Precos_Menor_Diferenca.xlsx") {
  if (!window.XLSX) {
    alert("A biblioteca XLSX ainda está sendo carregada. Tente novamente em alguns segundos.");
    return;
  }

  const rows = [];
  projects.forEach((project) => {
    project.units.forEach((unit) => {
      rows.push({
        Empreendimento: project.title,
        "Campanha / Condição": project.campanha || "CONDIÇÃO PADRÃO",
        Unidade: unit.unidade,
        Avaliação: unit.avaliacao,
        "Valor Final da Venda": unit.valorFinal,
        Diferença: unit.diferenca,
        "Bônus Adimplência": unit.bonusAdimplencia > 0 ? unit.bonusAdimplencia : "",
        "Total de Unidades no Empreendimento": project.totalUnits,
      });
    });
  });

  const worksheet = window.XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 32 }, { wch: 55 }, { wch: 25 }, { wch: 18 }, { wch: 22 }, { wch: 18 }, { wch: 20 }, { wch: 32 },
  ];

  const workbook = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(workbook, worksheet, "Menor Diferença");
  window.XLSX.writeFile(workbook, fileName);
}

function formatPriceBRL(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "R$ 0,00";
  return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Carrega pdf.js e (se ainda não estiver disponível) xlsx via CDN, sob demanda.
function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// FUNÇÃO 3 — componente de UI da aba "Tabela de Preços": upload do PDF,
// progresso de leitura por página, listagem dos empreendimentos/unidades e
// botão de exportação para Excel.
function TabelaDePrecos() {
  const [libsReady, setLibsReady] = useState(!!window.pdfjsLib);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [projects, setProjects] = useState(() => loadFromStorage("precos")?.projects ?? null);
  const [precosFileName, setPrecosFileName] = useState(() => loadFromStorage("precos")?.fileName ?? "");
  const fileInputRef = useRef(null);

  // Salva os empreendimentos extraídos assim que forem processados, para não
  // precisar reenviar o PDF na próxima vez que o app for aberto.
  useEffect(() => {
    saveToStorage("precos", projects ? { projects, fileName: precosFileName } : null);
  }, [projects, precosFileName]);

  useEffect(() => {
    if (window.pdfjsLib) {
      setLibsReady(true);
      return;
    }
    Promise.all([
      loadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"),
      loadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"),
    ])
      .then(() => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
        setLibsReady(true);
      })
      .catch((err) => {
        console.error("Erro ao carregar bibliotecas externas:", err);
        setError("Falha ao carregar os módulos de leitura de PDF/Excel.");
      });
  }, []);

  const handleFileProcess = async (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      setError("Por favor, selecione um arquivo válido no formato PDF (.pdf).");
      return;
    }
    setFile(selectedFile);
    setError(null);
    setLoading(true);
    setProgress({ current: 0, total: 0 });
    setProjects(null);
    try {
      const extractedProjects = await parsePriceTablePdf(selectedFile, (current, total) => setProgress({ current, total }));
      setProjects(extractedProjects);
      setPrecosFileName(selectedFile.name);
    } catch (err) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao processar o arquivo PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileProcess(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };
  const resetPrecos = () => {
    setFile(null);
    setProjects(null);
    setPrecosFileName("");
    setError(null);
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <div className="cc-header">
        <div>
          <h1 className="cc-title">Tabela de Preços</h1>
          <p className="cc-subtitle">
            {projects
              ? `${precosFileName ? precosFileName + " · " : ""}${projects.length} empreendimento${projects.length > 1 ? "s" : ""} localizado${projects.length > 1 ? "s" : ""}`
              : "Envie o PDF da Tabela Promocional Direcional para extrair maior Bônus Adimplência e menor diferença"}
          </p>
        </div>
        {projects && (
          <div style={{ display: "flex", gap: 10 }}>
            <button className="cc-btn" onClick={resetPrecos}>
              <Upload size={15} /> Trocar arquivo
            </button>
            <button className="cc-btn cc-btn-primary" onClick={() => exportPriceTableXlsx(projects)}>
              <FileDown size={15} /> Baixar Excel
            </button>
          </div>
        )}
      </div>

      <div className="pt-body">
        {!projects && (
          <div
            className={`pt-drop${dragOver ? " drag" : ""}`}
            onClick={() => !loading && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
            />
            {loading ? (
              <>
                <Loader2 size={30} className="pt-spin" />
                <div className="pt-drop-label">
                  Lendo o PDF… {progress.total > 0 && `página ${progress.current} de ${progress.total}`}
                </div>
                <div className="pt-drop-hint">Mapeando coordenadas e colunas promocionais...</div>
                {progress.total > 0 && (
                  <div className="pt-progress">
                    <div className="pt-progress-fill" style={{ width: `${(progress.current / progress.total) * 100}%` }} />
                  </div>
                )}
              </>
            ) : (
              <>
                <FileSpreadsheet size={30} color="#5B6472" />
                <div className="pt-drop-label">Arraste e solte o PDF da Tabela Direcional aqui</div>
                <div className="pt-drop-hint">ou clique para selecionar o arquivo do seu computador</div>
                {!libsReady && <div className="pt-drop-hint" style={{ color: "#B08900" }}>Iniciando leitor de PDF...</div>}
              </>
            )}
          </div>
        )}

        {error && (
          <div className="pt-error">
            <AlertCircle size={16} />
            <div>
              <div className="pt-error-title">Não foi possível ler o arquivo PDF</div>
              <div className="pt-error-text">{error}</div>
            </div>
          </div>
        )}

        {projects && (
          <div className="pt-projects">
            {projects.map((project, idx) => (
              <div key={idx} className="pt-card">
                <div className="pt-card-head">
                  <div className="pt-card-head-top">
                    <div className="pt-card-title">
                      <span className="pt-card-num">{idx + 1}</span>
                      <h2>{project.title}</h2>
                    </div>
                    <span className="pt-card-count">Total de unidades encontradas: {project.totalUnits}</span>
                  </div>
                  <div className="pt-card-campanha">
                    {project.campanha && project.campanha !== "CONDIÇÃO PADRÃO" ? (
                      <span className="pt-badge-campanha">
                        <b>Campanha do Mês</b> {project.campanha}
                      </span>
                    ) : (
                      <span className="pt-badge-padrao">
                        <Check size={13} /> Condição Padrão
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-table-wrap">
                  <table className="pt-table">
                    <thead>
                      <tr>
                        <th>Unidade</th>
                        <th>Avaliação</th>
                        <th>Valor Final da Venda</th>
                        <th>Diferença</th>
                        <th>Bônus Adimplência</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.units.map((unit, uIdx) => {
                        const hasBonus = unit.bonusAdimplencia > 0;
                        return (
                          <tr key={uIdx} className={hasBonus ? "has-bonus" : ""}>
                            <td>
                              <span className="pt-unit-label">{unit.unidade}</span>
                              {hasBonus && <span className="pt-badge-bonus">BÔNUS ADIMPLÊNCIA</span>}
                            </td>
                            <td>{formatPriceBRL(unit.avaliacao)}</td>
                            <td>{formatPriceBRL(unit.valorFinal)}</td>
                            <td className="pt-diferenca">{formatPriceBRL(unit.diferenca)}</td>
                            <td>
                              {hasBonus ? (
                                <span className="pt-bonus-value">{formatPriceBRL(unit.bonusAdimplencia)}</span>
                              ) : (
                                <span className="pt-dash">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------

export default function ClassificadorCredito() {
  const [records, setRecords] = useState(() => loadFromStorage("main")?.records ?? null);
  const [fileName, setFileName] = useState(() => loadFromStorage("main")?.fileName ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("Todos");
  const [rankingFilter, setRankingFilter] = useState("Todos");
  const [corretorFilter, setCorretorFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const inputRef = useRef(null);

  // ---- Raio X ----
  const [view, setView] = useState("main"); // "main" | "raiox" | "precos"

  const [agFileName, setAgFileName] = useState(() => loadFromStorage("raiox")?.agFileName ?? "");
  const [agRecords, setAgRecords] = useState(() => loadFromStorage("raiox")?.agRecords ?? null);
  const [agError, setAgError] = useState("");
  const [agLoading, setAgLoading] = useState(false);
  const agInputRef = useRef(null);

  const [visFileName, setVisFileName] = useState(() => loadFromStorage("raiox")?.visFileName ?? "");
  const [visRecords, setVisRecords] = useState(() => loadFromStorage("raiox")?.visRecords ?? null);
  const [visError, setVisError] = useState("");
  const [visLoading, setVisLoading] = useState(false);
  const visInputRef = useRef(null);

  const [pastaFileName, setPastaFileName] = useState(() => loadFromStorage("raiox")?.pastaFileName ?? "");
  const [pastaRecords, setPastaRecords] = useState(() => loadFromStorage("raiox")?.pastaRecords ?? null);
  const [pastaError, setPastaError] = useState("");
  const [pastaLoading, setPastaLoading] = useState(false);
  const pastaInputRef = useRef(null);

  const [raioXCopiedAll, setRaioXCopiedAll] = useState(false);
  const [raioXCopiedRow, setRaioXCopiedRow] = useState(null);
  const [raioXCorretorFilter, setRaioXCorretorFilter] = useState("Todos");

  // Mantém o relatório principal salvo no navegador, para reabrir o app
  // sem precisar reenviar a planilha.
  useEffect(() => {
    saveToStorage("main", records ? { records, fileName } : null);
  }, [records, fileName]);

  // Mesma ideia para os três arquivos do Raio X — cada um é salvo assim que
  // é processado e some do armazenamento quando todos forem removidos.
  useEffect(() => {
    const hasData = agRecords || visRecords || pastaRecords;
    saveToStorage(
      "raiox",
      hasData ? { agFileName, agRecords, visFileName, visRecords, pastaFileName, pastaRecords } : null
    );
  }, [agFileName, agRecords, visFileName, visRecords, pastaFileName, pastaRecords]);

  const handleCopy = useCallback((e, text, id) => {
    e.stopPropagation();
    copyToClipboard(text).then((ok) => {
      if (!ok) return;
      setCopiedId(id);
      setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1400);
    });
  }, []);

  const handleFile = useCallback((file) => {
    if (!file) return;
    setLoading(true);
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseWorkbook(e.target.result);
        setRecords(parsed);
        setFileName(file.name);
        setSelected("Todos");
        setSearch("");
        setRankingFilter("Todos");
        setCorretorFilter("Todos");
      } catch (err) {
        setError(err.message || "Não consegui ler este arquivo.");
        setRecords(null);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Não consegui ler este arquivo. Tente novamente.");
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const makeRaioXFileHandler = useCallback(
    (expectedCategory, setRecordsFn, setFileNameFn, setErrorFn, setLoadingFn) => (file) => {
      if (!file) return;
      setLoadingFn(true);
      setErrorFn("");
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = parseRaioXSheet(e.target.result, expectedCategory);
          setRecordsFn(parsed);
          setFileNameFn(file.name);
        } catch (err) {
          setErrorFn(err.message || "Não consegui ler este arquivo.");
          setRecordsFn(null);
          setFileNameFn("");
        } finally {
          setLoadingFn(false);
        }
      };
      reader.onerror = () => {
        setErrorFn("Não consegui ler este arquivo. Tente novamente.");
        setLoadingFn(false);
      };
      reader.readAsArrayBuffer(file);
    },
    []
  );

  const handleAgFile = useMemo(
    () => makeRaioXFileHandler("agendamentos", setAgRecords, setAgFileName, setAgError, setAgLoading),
    [makeRaioXFileHandler]
  );
  const handleVisFile = useMemo(
    () => makeRaioXFileHandler("visitas", setVisRecords, setVisFileName, setVisError, setVisLoading),
    [makeRaioXFileHandler]
  );
  const handlePastaFile = useMemo(
    () => makeRaioXFileHandler("pastas", setPastaRecords, setPastaFileName, setPastaError, setPastaLoading),
    [makeRaioXFileHandler]
  );

  const resetRaioX = useCallback(() => {
    setAgRecords(null);
    setAgFileName("");
    setAgError("");
    setVisRecords(null);
    setVisFileName("");
    setVisError("");
    setPastaRecords(null);
    setPastaFileName("");
    setPastaError("");
    setRaioXCorretorFilter("Todos");
  }, []);

  const handleClearAllStoredData = useCallback(() => {
    if (!window.confirm("Isso vai apagar todos os arquivos salvos neste navegador (Classificador, Raio X e Tabela de Preços). Continuar?")) {
      return;
    }
    clearAllStoredData();
    setRecords(null);
    setFileName("");
    resetRaioX();
    window.location.reload();
  }, [resetRaioX]);

  const raioXSummary = useMemo(() => {
    if (!agRecords && !visRecords && !pastaRecords) return null;
    const agMap = agRecords ? aggregateAgendamentos(agRecords) : new Map();
    const visMap = visRecords ? aggregateClientesUnicos(visRecords) : new Map();
    const pastaMap = pastaRecords ? aggregateClientesUnicos(pastaRecords) : new Map();
    return buildRaioXSummary(agMap, visMap, pastaMap);
  }, [agRecords, visRecords, pastaRecords]);

  const raioXCorretorOptions = useMemo(() => {
    if (!raioXSummary) return [];
    return raioXSummary.map((r) => r.corretor);
  }, [raioXSummary]);

  const raioXVisibleRows = useMemo(() => {
    if (!raioXSummary) return [];
    if (raioXCorretorFilter === "Todos") return raioXSummary;
    return raioXSummary.filter((r) => r.corretor === raioXCorretorFilter);
  }, [raioXSummary, raioXCorretorFilter]);

  const handleCopyRaioXRow = useCallback((row) => {
    const text = raioXRowValues(row);
    copyToClipboard(text).then((ok) => {
      if (!ok) {
        alert("Não foi possível copiar automaticamente. Copie manualmente: " + text);
        return;
      }
      setRaioXCopiedRow(row.corretor);
      setTimeout(() => setRaioXCopiedRow((cur) => (cur === row.corretor ? null : cur)), 1400);
    });
  }, []);

  const handleCopyRaioXAll = useCallback(() => {
    if (!raioXSummary || raioXSummary.length === 0) return;
    const text = raioXSummary.map(raioXLine).join("\n");
    copyToClipboard(text).then((ok) => {
      if (!ok) {
        alert("Não foi possível copiar automaticamente.");
        return;
      }
      setRaioXCopiedAll(true);
      setTimeout(() => setRaioXCopiedAll(false), 1400);
    });
  }, [raioXSummary]);

  const byCategory = useMemo(() => (records ? buildIndex(records) : {}), [records]);

  const visibleCategories = useMemo(() => {
    if (!records) return [];
    return CATEGORY_ORDER.filter((c) => (byCategory[c.key] || []).length > 0);
  }, [records, byCategory]);

  const categoryBase = useMemo(() => {
    if (!records) return [];
    return selected === "Todos" ? records : byCategory[selected] || [];
  }, [records, byCategory, selected]);

  const rankingOptions = useMemo(() => {
    const seen = new Map();
    categoryBase.forEach((r) => {
      const label = r.ranking || "—";
      if (!seen.has(label)) seen.set(label, rankingPriorityIndex(label));
    });
    return [...seen.keys()].sort((a, b) => seen.get(a) - seen.get(b));
  }, [categoryBase]);

  const corretorOptions = useMemo(() => {
    const seen = new Set();
    categoryBase.forEach((r) => {
      if (r.corretor) seen.add(r.corretor);
    });
    return [...seen].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [categoryBase]);

  const currentRows = useMemo(() => {
    let base = categoryBase;
    if (rankingFilter !== "Todos") base = base.filter((r) => r.ranking === rankingFilter);
    if (corretorFilter !== "Todos") base = base.filter((r) => r.corretor === corretorFilter);
    if (!search.trim()) return base;
    const q = search.trim().toUpperCase();
    return base.filter(
      (r) => r.corretor.toUpperCase().includes(q) || r.nomeDaConta.toUpperCase().includes(q) || r.nomeAvaliacao.toUpperCase().includes(q)
    );
  }, [categoryBase, rankingFilter, corretorFilter, search]);

  const currentCategoryMeta = CATEGORY_ORDER.find((c) => c.key === selected);
  const groupColor = currentCategoryMeta ? GROUP_COLORS[currentCategoryMeta.group] : { accent: "#2C3542", soft: "#E9EBEE" };

  return (
    <div className="cc-root">
      <style>{`
        .cc-root {
          --ink: #1C2430;
          --ink-soft: #545F6E;
          --paper: #EEF0F0;
          --panel: #FFFFFF;
          --line: #DDE1E2;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          background: var(--paper);
          color: var(--ink);
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }
        .cc-shell {
          display: flex;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }
        .cc-nav {
          width: 104px;
          flex-shrink: 0;
          background: #1C2430;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 20px 10px;
        }
        .cc-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          border: none;
          background: transparent;
          color: #98A2AE;
          padding: 12px 6px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 11.5px;
          letter-spacing: 0.2px;
          transition: background 0.15s, color 0.15s;
        }
        .cc-nav-btn:hover { background: rgba(255,255,255,0.07); color: #E7EAEC; }
        .cc-nav-btn.active { background: rgba(255,255,255,0.14); color: #FFFFFF; }
        .cc-nav-clear {
          margin-top: auto;
          border: none;
          background: transparent;
          color: #5B6472;
          padding: 8px 6px;
          font-size: 11px;
          letter-spacing: 0.2px;
          cursor: pointer;
          text-align: center;
          transition: color 0.15s;
        }
        .cc-nav-clear:hover { color: #98A2AE; }
        .cc-app {
          flex: 1;
          min-width: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .cc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 22px 28px;
          border-bottom: 1px solid var(--line);
          background: var(--panel);
          flex-wrap: wrap;
          flex-shrink: 0;
        }
        .cc-title {
          font-family: Georgia, "Iowan Old Style", "Times New Roman", serif;
          font-size: 22px;
          letter-spacing: 0.2px;
          margin: 0;
        }
        .cc-subtitle {
          margin: 2px 0 0;
          font-size: 13px;
          color: var(--ink-soft);
        }
        .cc-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--line);
          background: var(--panel);
          color: var(--ink);
          padding: 9px 14px;
          border-radius: 7px;
          font-size: 13.5px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .cc-btn:hover { background: #F4F5F5; }
        .cc-btn-primary {
          background: #1C2430;
          color: #FFFFFF;
          border-color: #1C2430;
        }
        .cc-btn-primary:hover { background: #2A3444; }
        .cc-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .cc-body {
          display: flex;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }
        .cc-empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .cc-dropzone {
          width: 100%;
          max-width: 520px;
          border: 1.5px dashed #B7BEC2;
          border-radius: 12px;
          background: var(--panel);
          padding: 44px 32px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .cc-dropzone.drag { border-color: #1C2430; background: #F6F7F7; }
        .cc-dropzone h3 {
          font-family: Georgia, serif;
          font-size: 18px;
          margin: 14px 0 6px;
        }
        .cc-dropzone p {
          font-size: 13.5px;
          color: var(--ink-soft);
          margin: 0;
          line-height: 1.5;
        }
        .cc-error {
          margin-top: 18px;
          display: flex;
          gap: 8px;
          align-items: flex-start;
          background: #F5E4E6;
          border: 1px solid #E4B9BF;
          color: #7A2A36;
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 13px;
          text-align: left;
        }

        .cc-sidebar {
          width: 280px;
          flex-shrink: 0;
          border-right: 1px solid var(--line);
          background: var(--panel);
          padding: 18px 12px;
          overflow-y: auto;
          height: 100%;
        }
        .cc-sidebar-title {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: var(--ink-soft);
          padding: 0 10px 8px;
        }
        .cc-cat-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          border: none;
          background: transparent;
          padding: 10px 10px;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          font-size: 13.5px;
          color: var(--ink);
          margin-bottom: 2px;
        }
        .cc-cat-item:hover { background: #F2F3F3; }
        .cc-cat-item.active { background: var(--active-soft, #E9EBEE); }
        .cc-cat-left { display: flex; align-items: center; gap: 9px; min-width: 0; }
        .cc-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .cc-cat-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cc-count {
          font-size: 12px;
          font-variant-numeric: tabular-nums;
          color: var(--ink-soft);
          background: #EEF0F0;
          padding: 1px 8px;
          border-radius: 20px;
        }

        .cc-main {
          flex: 1;
          padding: 20px 28px 40px;
          overflow-y: auto;
          overflow-x: auto;
          min-height: 0;
        }
        .cc-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .cc-toolbar-title { display: flex; align-items: center; gap: 10px; }
        .cc-toolbar-title h2 {
          font-family: Georgia, serif;
          font-size: 19px;
          margin: 0;
        }
        .cc-ranking-filter {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #E9F1FF;
          border: 1.5px solid #B7D4FB;
          border-radius: 8px;
          padding: 7px 12px;
          color: #0B5FCC;
        }
        .cc-ranking-filter select {
          border: none;
          background: transparent;
          color: #0B5FCC;
          font-weight: 700;
          font-size: 13.5px;
          cursor: pointer;
          outline: none;
        }
        .cc-search {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--line);
          background: var(--panel);
          border-radius: 7px;
          padding: 7px 12px;
          min-width: 240px;
        }
        .cc-search input {
          border: none;
          outline: none;
          font-size: 13.5px;
          width: 100%;
          background: transparent;
          color: var(--ink);
        }

        table.cc-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 10px;
          overflow: hidden;
          font-size: 13.5px;
        }
        .cc-table thead th {
          text-align: left;
          font-weight: 600;
          font-size: 11.5px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: var(--ink-soft);
          padding: 11px 14px;
          border-bottom: 1px solid var(--line);
          background: #FAFAFA;
        }
        .cc-table td {
          padding: 11px 14px;
          border-bottom: 1px solid #EEF0F0;
          vertical-align: top;
        }
        .cc-table tr:last-child td { border-bottom: none; }
        .cc-table tr.expandable { cursor: pointer; }
        .cc-table tr.expandable:hover td { background: #FAFBFB; }
        .cc-corretor {
          color: #007AFF;
          font-weight: 600;
        }
        .cc-code-cell {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .cc-code {
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
          font-size: 12.5px;
          color: var(--ink-soft);
        }
        .cc-copy-btn {
          border: none;
          background: transparent;
          padding: 3px;
          margin: -3px;
          border-radius: 5px;
          cursor: pointer;
          color: #9AA3AC;
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }
        .cc-copy-btn:hover { background: #EEF2F6; color: #007AFF; }
        .cc-copy-btn.copied { color: #2F6E51; }
        .cc-table thead th.cc-th-just {
          color: var(--ink);
          font-weight: 700;
        }
        .cc-just-cell {
          padding: 8px 14px 8px 0 !important;
        }
        .cc-just-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1.5px solid var(--just-accent, #DDE1E2);
          background: var(--just-tint, transparent);
          color: var(--just-accent, var(--ink));
          border-radius: 20px;
          padding: 7px 8px 7px 14px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
        .cc-just-cta:hover { filter: brightness(0.97); }
        .cc-just-cta-chevron {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(255,255,255,0.6);
        }
        .cc-just-empty {
          font-size: 13px;
          color: #A9B0B8;
          font-style: italic;
        }
        .cc-just-expanded {
          background: var(--just-bg, #bfdbbf);
          border-left: 3px solid var(--exp-accent, #C98A2B);
          border-radius: 6px;
          padding: 12px 14px 16px;
          margin: -4px -6px 16px;
        }
        .cc-just-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }
        .cc-just-text {
          white-space: pre-wrap;
          margin: 0;
          font-weight: 500;
          line-height: 1.55;
          color: var(--ink);
        }
        .cc-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }
        .cc-detail-row td {
          background: var(--detail-tint, #EEF2F6);
          padding: 16px;
          font-size: 13px;
          color: var(--ink-soft);
        }
        .cc-detail-card {
          background: #FFFFFF;
          border: 1px solid #E7EAEC;
          border-radius: 12px;
          padding: 18px 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .cc-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px 24px;
        }
        .cc-detail-grid dt { font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; color: #8A939C; }
        .cc-detail-grid dd { margin: 2px 0 0; color: var(--ink); }
        .cc-nodata { padding: 60px 20px; text-align: center; color: var(--ink-soft); font-size: 14px; }

        .rx-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 24px 28px 40px;
        }
        .rx-uploads {
          display: grid;
          grid-template-columns: repeat(3, minmax(180px, 1fr));
          gap: 16px;
          max-width: 900px;
        }
        .rx-drop {
          border: 1.5px dashed #B7BEC2;
          border-radius: 12px;
          background: var(--panel);
          padding: 22px 16px;
          text-align: center;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          transition: border-color 0.15s, background 0.15s;
        }
        .rx-drop.drag { border-color: #1C2430; background: #F6F7F7; }
        .rx-drop.done { border-style: solid; border-color: #BFDBBF; background: #F3F9F3; }
        .rx-drop-label { font-family: Georgia, serif; font-size: 14.5px; margin-top: 2px; }
        .rx-drop-hint { font-size: 12px; color: var(--ink-soft); line-height: 1.4; }
        .rx-drop-status { font-size: 12px; color: var(--ink-soft); }
        .rx-drop-status.ok { color: #2F6E51; font-weight: 600; }
        .rx-drop-error {
          display: flex;
          align-items: flex-start;
          gap: 5px;
          margin-top: 4px;
          font-size: 11.5px;
          color: #A6394A;
          text-align: left;
        }
        .rx-summary-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          margin: 28px 0 14px;
        }
        .rx-summary-head h2 {
          font-family: Georgia, serif;
          font-size: 17px;
          margin: 0;
        }
        .rx-table-wrap {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 10px;
          overflow: hidden;
        }
        .rx-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .rx-table th {
          text-align: left;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: #8A939C;
          padding: 10px 14px;
          border-bottom: 1.5px solid var(--line);
          background: #F7F8F8;
          white-space: nowrap;
        }
        .rx-table td {
          padding: 10px 14px;
          border-bottom: 1px solid #E3E6E8;
          white-space: nowrap;
        }
        .rx-table tbody tr:nth-child(even) td { background: #F5F6F7; }
        .rx-table tr:last-child td { border-bottom: none; }
        .rx-table tr:hover td { background: #E9F1FF; }

        .pt-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 22px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .pt-drop {
          border: 2px dashed var(--line);
          border-radius: 14px;
          padding: 44px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-align: center;
          cursor: pointer;
          background: #FAFAFA;
          transition: border-color 0.15s, background 0.15s;
        }
        .pt-drop.drag { border-color: #1C2430; background: #F6F7F7; }
        .pt-drop-label { font-family: Georgia, serif; font-size: 16px; color: var(--ink); }
        .pt-drop-hint { font-size: 13px; color: var(--ink-soft); }
        .pt-spin { animation: pt-spin-anim 1s linear infinite; color: #1C2430; }
        @keyframes pt-spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .pt-progress {
          width: 100%;
          max-width: 320px;
          height: 6px;
          border-radius: 999px;
          background: #E4E6E9;
          overflow: hidden;
          margin-top: 4px;
        }
        .pt-progress-fill { height: 100%; background: #1C2430; transition: width 0.2s; }
        .pt-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 16px;
          border-radius: 10px;
          background: #F5E4E6;
          color: #A6394A;
        }
        .pt-error-title { font-weight: 700; font-size: 13.5px; }
        .pt-error-text { font-size: 13px; margin-top: 2px; }
        .pt-projects { display: flex; flex-direction: column; gap: 18px; }
        .pt-card {
          border: 1px solid var(--line);
          border-radius: 14px;
          overflow: hidden;
          background: var(--panel);
        }
        .pt-card-head { padding: 16px 18px; background: #F5F6F7; border-bottom: 1px solid var(--line); }
        .pt-card-head-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .pt-card-title { display: flex; align-items: center; gap: 10px; }
        .pt-card-title h2 { margin: 0; font-family: Georgia, serif; font-size: 16.5px; }
        .pt-card-num {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: #1C2430;
          color: #FFFFFF;
          font-size: 12.5px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pt-card-count {
          font-size: 12px;
          font-weight: 600;
          color: var(--ink-soft);
          background: #E4E6E9;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .pt-card-campanha { margin-top: 10px; padding-top: 10px; border-top: 1px solid #E4E6E9; }
        .pt-badge-campanha {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          padding: 6px 12px;
          border-radius: 10px;
          background: #F4E6BE;
          color: #7A5B12;
          border: 1px solid #E9D2B8;
        }
        .pt-badge-campanha b {
          background: #7A5B12;
          color: #FFFFFF;
          padding: 2px 7px;
          border-radius: 6px;
          font-size: 10px;
          text-transform: uppercase;
        }
        .pt-badge-padrao {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 10px;
          background: #E9EBEE;
          color: #2F6E51;
        }
        .pt-table-wrap { overflow-x: auto; }
        .pt-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .pt-table th {
          text-align: left;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: var(--ink-soft);
          padding: 10px 16px;
          border-bottom: 1px solid var(--line);
          background: #FAFAFA;
        }
        .pt-table td {
          padding: 11px 16px;
          border-bottom: 1px solid var(--line);
          white-space: nowrap;
        }
        .pt-table tr:last-child td { border-bottom: none; }
        .pt-table tr:hover td { background: #E9F1FF; }
        .pt-table tr.has-bonus td { background: #F3F9F3; }
        .pt-unit-label { font-weight: 600; }
        .pt-badge-bonus {
          margin-left: 8px;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
          background: #E4EFE8;
          color: #2F6E51;
          border: 1px solid #BFDBBF;
        }
        .pt-diferenca { font-weight: 700; color: #1C2430; }
        .pt-bonus-value { font-weight: 700; color: #2F6E51; }
        .pt-dash { color: #98A2AE; }

        @media (max-width: 780px) {
          .cc-body { flex-direction: column; }
          .cc-sidebar {
            width: 100%;
            height: auto;
            flex-shrink: 0;
            border-right: none;
            border-bottom: 1px solid var(--line);
            display: flex;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 10px 12px;
            gap: 4px;
          }
          .cc-sidebar-title { display: none; }
          .cc-cat-item { flex-shrink: 0; }
          .cc-just-cta span:not(.cc-just-cta-chevron) { display: none; }
          .cc-shell { flex-direction: column; }
          .cc-nav {
            width: 100%;
            flex-direction: row;
            justify-content: center;
            padding: 8px 10px;
          }
          .cc-nav-clear {
            margin-top: 0;
            margin-left: 8px;
            align-self: center;
          }
          .rx-uploads { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cc-shell">
      <nav className="cc-nav">
        <button
          className={`cc-nav-btn${view === "main" ? " active" : ""}`}
          onClick={() => setView("main")}
        >
          <FileSpreadsheet size={18} />
          <span>Classificador</span>
        </button>
        <button
          className={`cc-nav-btn${view === "raiox" ? " active" : ""}`}
          onClick={() => setView("raiox")}
        >
          <Zap size={18} />
          <span>Raio X</span>
        </button>
        <button
          className={`cc-nav-btn${view === "precos" ? " active" : ""}`}
          onClick={() => setView("precos")}
        >
          <Tag size={18} />
          <span>Tabela de Preços</span>
        </button>
        <button
          className="cc-nav-clear"
          title="Apaga os arquivos salvos neste navegador"
          onClick={handleClearAllStoredData}
        >
          Limpar dados
        </button>
      </nav>

      <div className="cc-app">
      {view === "raiox" ? (
        <>
      <div className="cc-header">
        <div>
          <h1 className="cc-title">Raio X dos Corretores</h1>
          <p className="cc-subtitle">
            {raioXSummary
              ? `${raioXSummary.length} corretor${raioXSummary.length === 1 ? "" : "es"} encontrados`
              : "Envie os 3 relatórios (Agendamentos, Visitas e Pastas) para cruzar a produção da equipe"}
          </p>
        </div>
        {raioXSummary && raioXSummary.length > 0 && (
          <div style={{ display: "flex", gap: 10 }}>
            <button className="cc-btn" onClick={resetRaioX}>
              <Upload size={15} /> Trocar arquivos
            </button>
            <button className="cc-btn" onClick={handleCopyRaioXAll}>
              {raioXCopiedAll ? <Check size={15} /> : <Copy size={15} />} Copiar resumo
            </button>
            <button className="cc-btn cc-btn-primary" onClick={() => downloadRaioXWorkbook(raioXSummary)}>
              <FileDown size={15} /> Baixar Excel
            </button>
          </div>
        )}
      </div>

      <div className="rx-body">
        <div className="rx-uploads">
          <MiniDropzone
            label="Agendamentos"
            hint="Arraste ou clique — .xlsx de Agendamentos"
            fileName={agFileName}
            error={agError}
            loading={agLoading}
            count={agRecords?.length || 0}
            onFile={handleAgFile}
            inputRef={agInputRef}
          />
          <MiniDropzone
            label="Visitas"
            hint="Arraste ou clique — .xlsx de Visitas"
            fileName={visFileName}
            error={visError}
            loading={visLoading}
            count={visRecords?.length || 0}
            onFile={handleVisFile}
            inputRef={visInputRef}
          />
          <MiniDropzone
            label="Pastas"
            hint="Arraste ou clique — .xlsx de Pastas"
            fileName={pastaFileName}
            error={pastaError}
            loading={pastaLoading}
            count={pastaRecords?.length || 0}
            onFile={handlePastaFile}
            inputRef={pastaInputRef}
          />
        </div>

        {raioXSummary && raioXSummary.length > 0 ? (
          <>
            <div className="rx-summary-head">
              <h2>Resumo por corretor</h2>
              <div className="cc-ranking-filter">
                <Filter size={14} />
                <select
                  className="cc-select"
                  value={raioXCorretorFilter}
                  onChange={(e) => setRaioXCorretorFilter(e.target.value)}
                >
                  <option value="Todos">Todos os corretores</option>
                  {raioXCorretorOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="rx-table-wrap">
              <table className="rx-table">
                <thead>
                  <tr>
                    <th>Corretor</th>
                    <th>Agendamentos</th>
                    <th>Último agend.</th>
                    <th>Visitas</th>
                    <th>Última visita</th>
                    <th>Pastas</th>
                    <th>Última pasta</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {raioXVisibleRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="cc-nodata" style={{ padding: "24px 14px" }}>
                        Nenhum corretor encontrado.
                      </td>
                    </tr>
                  ) : (
                  raioXVisibleRows.map((row) => (
                    <tr key={row.corretor}>
                      <td className="cc-corretor">{row.corretor}</td>
                      <td>{row.agendamentos.total}</td>
                      <td>{formatDateShort(row.agendamentos.lastDate)}</td>
                      <td>{row.visitas.total}</td>
                      <td>{formatDateShort(row.visitas.lastDate)}</td>
                      <td>{row.pastas.total}</td>
                      <td>{formatDateShort(row.pastas.lastDate)}</td>
                      <td>
                        <button
                          className={`cc-copy-btn${raioXCopiedRow === row.corretor ? " copied" : ""}`}
                          onClick={() => handleCopyRaioXRow(row)}
                          title="Copiar linha"
                        >
                          {raioXCopiedRow === row.corretor ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="cc-nodata">
            Envie ao menos um dos três relatórios acima para ver os números por corretor.
          </div>
        )}
      </div>
        </>
      ) : view === "precos" ? (
        <TabelaDePrecos />
      ) : (
        <>
      <div className="cc-header">
        <div>
          <h1 className="cc-title">Classificador de Avaliações de Crédito</h1>
          <p className="cc-subtitle">
            {records ? `${fileName} · ${records.length} avaliações` : "Envie o relatório da equipe para separar por categoria"}
          </p>
        </div>
        {records && (
          <div style={{ display: "flex", gap: 10 }}>
            <button className="cc-btn" onClick={() => inputRef.current?.click()}>
              <Upload size={15} /> Trocar arquivo
            </button>
            <button className="cc-btn cc-btn-primary" onClick={() => downloadWorkbook(byCategory, records.length)}>
              <FileDown size={15} /> Baixar Excel classificado
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {!records ? (
        <div className="cc-empty">
          <div
            className={`cc-dropzone${dragOver ? " drag" : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
          >
            <FileSpreadsheet size={34} color="#5B6472" />
            <h3>{loading ? "Lendo o arquivo…" : "Arraste a planilha aqui"}</h3>
            <p>
              Ou clique para escolher o arquivo .xlsx exportado do Salesforce
              <br />
              (relatório "Avaliações de crédito da minha equipe").
            </p>
            {error && (
              <div className="cc-error">
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="cc-body">
          <div className="cc-sidebar">
            <div className="cc-sidebar-title">Categorias</div>
            <button
              className={`cc-cat-item${selected === "Todos" ? " active" : ""}`}
              style={selected === "Todos" ? { "--active-soft": "#E9EBEE" } : undefined}
              onClick={() => {
                setSelected("Todos");
                setRankingFilter("Todos");
                setCorretorFilter("Todos");
              }}
            >
              <span className="cc-cat-left">
                <span className="cc-dot" style={{ background: "#1C2430" }} />
                <span className="cc-cat-label">Todos os registros</span>
              </span>
              <span className="cc-count">{records.length}</span>
            </button>
            {visibleCategories.map((c) => {
              const color = GROUP_COLORS[c.group];
              const count = (byCategory[c.key] || []).length;
              return (
                <button
                  key={c.key}
                  className={`cc-cat-item${selected === c.key ? " active" : ""}`}
                  style={selected === c.key ? { "--active-soft": color.soft } : undefined}
                  onClick={() => {
                    setSelected(c.key);
                    setRankingFilter("Todos");
                    setCorretorFilter("Todos");
                  }}
                >
                  <span className="cc-cat-left">
                    <span className="cc-dot" style={{ background: color.accent }} />
                    <span className="cc-cat-label">{c.label}</span>
                  </span>
                  <span className="cc-count">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="cc-main">
            <div className="cc-toolbar">
              <div className="cc-toolbar-title">
                <span className="cc-dot" style={{ background: groupColor.accent, width: 10, height: 10 }} />
                <h2>{selected === "Todos" ? "Todos os registros" : currentCategoryMeta?.label}</h2>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div className="cc-ranking-filter">
                  <Filter size={14} />
                  <select
                    className="cc-select"
                    value={corretorFilter}
                    onChange={(e) => setCorretorFilter(e.target.value)}
                  >
                    <option value="Todos">Todos os corretores</option>
                    {corretorOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="cc-ranking-filter">
                  <Filter size={14} />
                  <select
                    className="cc-select"
                    value={rankingFilter}
                    onChange={(e) => setRankingFilter(e.target.value)}
                  >
                    <option value="Todos">Todos os rankings</option>
                    {rankingOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="cc-search">
                  <Search size={14} color="#8A939C" />
                  <input
                    placeholder="Buscar por corretor ou conta…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <X size={14} color="#8A939C" style={{ cursor: "pointer" }} onClick={() => setSearch("")} />
                  )}
                </div>
                {selected !== "Todos" && currentCategoryMeta && (
                  <button
                    className="cc-btn"
                    onClick={() => downloadCategoryCsv(currentCategoryMeta, byCategory[selected] || [])}
                  >
                    <Download size={14} /> CSV
                  </button>
                )}
              </div>
            </div>

            {currentRows.length === 0 ? (
              <div className="cc-nodata">Nenhum registro encontrado.</div>
            ) : (
              <table className="cc-table">
                <thead>
                  <tr>
                    <th>Corretor</th>
                    <th>Nome da Conta</th>
                    <th>Nome da Avaliação</th>
                    <th>Ranking</th>
                    <th className="cc-th-just">Justificativa</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((r) => {
                    const isOpen = expandedRow === r.id;
                    const rs = rankingStyle(r.ranking);
                    const catColor = categoryColorFor(r);
                    const justBg = JUST_BG_BY_GROUP[categoryGroupFor(r)] || JUST_BG_BY_GROUP.outros;
                    return (
                      <React.Fragment key={r.id}>
                        <tr className="expandable" onClick={() => setExpandedRow(isOpen ? null : r.id)}>
                          <td className="cc-corretor">{r.corretor}</td>
                          <td>{r.nomeDaConta}</td>
                          <td>
                            <span className="cc-code-cell">
                              <span className="cc-code">{r.nomeAvaliacao}</span>
                              <button
                                className={`cc-copy-btn${copiedId === r.id ? " copied" : ""}`}
                                onClick={(e) => handleCopy(e, r.nomeAvaliacao, r.id)}
                                title="Copiar"
                              >
                                {copiedId === r.id ? <Check size={13} /> : <Copy size={13} />}
                              </button>
                            </span>
                          </td>
                          <td>
                            <span className="cc-badge" style={{ background: rs.bg, color: rs.fg }}>
                              {r.ranking}
                            </span>
                          </td>
                          <td className="cc-just-cell">
                            {r.justificativa ? (
                              <button
                                className="cc-just-cta"
                                style={{ "--just-accent": catColor.accent, "--just-tint": catColor.soft }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedRow(isOpen ? null : r.id);
                                }}
                              >
                                <MessageSquare size={14} />
                                <span>Veja a resposta do CCA</span>
                                <span className="cc-just-cta-chevron">
                                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </span>
                              </button>
                            ) : (
                              <span className="cc-just-empty">Sem justificativa registrada</span>
                            )}
                          </td>
                        </tr>
                        {isOpen && (
                          <tr className="cc-detail-row" style={{ "--detail-tint": groupColor.soft }}>
                            <td colSpan={5}>
                              <div className="cc-detail-card">
                                {r.justificativa && (
                                  <div
                                    className="cc-just-expanded"
                                    style={{
                                      "--exp-accent": catColor.accent,
                                      "--just-bg": justBg,
                                    }}
                                  >
                                    <span className="cc-just-label" style={{ color: catColor.accent }}>
                                      Justificativa
                                    </span>
                                    <p className="cc-just-text">{r.justificativa}</p>
                                  </div>
                                )}
                                <dl className="cc-detail-grid">
                                  <div>
                                    <dt>Empreendimento</dt>
                                    <dd>{r.empreendimento || "—"}</dd>
                                  </div>
                                  <div>
                                    <dt>Imobiliária</dt>
                                    <dd>{r.nomeImobiliaria || "—"}</dd>
                                  </div>
                                  <div>
                                    <dt>Status original</dt>
                                    <dd>{r.status || "—"}</dd>
                                  </div>
                                  <div>
                                    <dt>Data de criação</dt>
                                    <dd>{r.dataCriacao || "—"}</dd>
                                  </div>
                                  <div>
                                    <dt>Data da análise</dt>
                                    <dd>{r.dataAnalise || "—"}</dd>
                                  </div>
                                  <div>
                                    <dt>Valor financiamento</dt>
                                    <dd>{r.valorFinanciamento ? Number(r.valorFinanciamento).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}</dd>
                                  </div>
                                </dl>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}

            {currentCategoryMeta?.group === "reprovado" && (
              <p style={{ fontSize: 12, color: "#8A939C", marginTop: 14, maxWidth: 640 }}>
                O motivo da reprovação é identificado a partir do texto da justificativa e pode não ser
                perfeito — um caso pode aparecer em mais de um motivo, e alguns casos raros podem cair em
                "Outros/Documentação" mesmo sem ser bem esse o motivo. Vale conferir a justificativa antes de agir.
              </p>
            )}
          </div>
        </div>
      )}
        </>
      )}
      </div>
      </div>
    </div>
  );
}
