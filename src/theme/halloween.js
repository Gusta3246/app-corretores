// ─────────────────────────────────────────────────────────────
// Tema de Halloween — ativo de 20/10 até 03/11 (inclusive).
// Para mudar o período, edite as duas datas abaixo.
// Para testar fora do período: abra o app com ?halloween=1 (ou ?halloween=0 para desligar).
// ─────────────────────────────────────────────────────────────
const START = { month: 9, day: 20 };  // mês 0-indexado: 9 = outubro
const END   = { month: 10, day: 3 };  // 3 de novembro

export function isHalloween(now = new Date()) {
  try {
    const q = new URLSearchParams(window.location.search).get('halloween');
    if (q === '1') return true;
    if (q === '0') return false;
  } catch (_) { /* noop */ }
  const y = now.getFullYear();
  const start = new Date(y, START.month, START.day, 0, 0, 0);
  const end   = new Date(y, END.month, END.day, 23, 59, 59, 999);
  return now >= start && now <= end;
}

export const HALLOWEEN = isHalloween();

// Logotipo: emblema de Halloween durante o período, logo normal depois
export const LOGO_NORMAL = 'https://i.postimg.cc/XpWRf9pj/logo.png';
export const LOGO_HALLOWEEN = 'https://i.postimg.cc/PxWVM06G/Emblema-DESTEMIDOS-de-Halloween.png';
export const LOGO_URL = HALLOWEEN ? LOGO_HALLOWEEN : LOGO_NORMAL;

// Aplica a classe no <html> (os estilos de src/theme/halloween.css dependem dela)
export function applyHalloweenClass() {
  const root = document.documentElement;
  root.classList.toggle('hw', HALLOWEEN);
  if (HALLOWEEN) {
    const meta = document.getElementById('theme-color-meta');
    if (meta) meta.setAttribute('content', '#1a0b2e');
    // favicon, ícone do iOS e logo do popup de instalação
    document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(l => l.setAttribute('href', LOGO_HALLOWEEN));
    document.querySelectorAll('#install-popup img').forEach(i => i.setAttribute('src', LOGO_HALLOWEEN));
  }
}

// Mensagens do dia (substituem as frases normais durante o Halloween)
export const frasesHalloween = [
  { texto: "Não tenha medo de fechar negócio. O verdadeiro susto é deixar a 'oportunidade' passar.", autor: "Equipe Destemidos" },
  { texto: "Destemidos não temem fantasmas. Eles temem ficar sem meta batida!", autor: "Motivação Destemidos" },
  { texto: "Cada visita é uma poção mágica. Misture preparo, simpatia e 'persistência'.", autor: "Equipe Destemidos" },
  { texto: "Hoje o único truque é trabalhar com garra. O doce vem na hora de entregar as 'chaves'.", autor: "Equipe Destemidos" },
  { texto: "Quem enfrenta o escuro com coragem encontra o melhor negócio do 'dia'.", autor: "Motivação Destemidos" },
  { texto: "Vendas são como abóboras: com paciência e cuidado, viram algo 'extraordinário'.", autor: "Equipe Destemidos" },
  { texto: "Nenhum cliente assusta quem está bem preparado. Estude, simule e 'conquiste'.", autor: "Motivação Destemidos" },
  { texto: "Em noite de bruxas, a magia de verdade é a 'dedicação' de quem não desiste.", autor: "Equipe Destemidos" },
  { texto: "Transforme cada 'não' em um fantasma que passa. O próximo 'sim' já está a caminho.", autor: "Motivação Destemidos" },
  { texto: "Corretor destemido não corre do escuro: acende a luz e mostra o 'caminho' para casa nova.", autor: "Equipe Destemidos" },
  { texto: "Doce ou travessura? Escolha o doce: atendimento 'nota dez' e cliente feliz.", autor: "Equipe Destemidos" },
];

export const robotFrasesHalloween = [
  "Buuu! Posso te ajudar? 👻",
  "Doce ou travessura? 🎃",
  "Bora bater a meta, Destemido! 🦇",
  "Vamos subir uma pasta? 🕸️",
  "Tô aqui, até no escuro! 🌙",
  "Quer criar um PDF agora? 🧙",
  "Dúvida em algum apê? 🏚️",
];