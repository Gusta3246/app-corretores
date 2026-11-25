// Vídeo do hero por período do dia. Ao terminar, o hero mostra a foto do dia daquele período.
//   manhã: 00h–11h59 | tarde: 12h–17h59 | noite: 18h–23h59
//
// COMO FUNCIONA: todos os vídeos ficam na lista VIDEOS abaixo. Cada dia o app gira a lista,
// e os três períodos do mesmo dia mostram vídeos diferentes entre si.
// Para trocar ou adicionar vídeos, é só mexer na lista (quanto mais vídeos, menos repete).
// Lista vazia = o hero mostra só a foto do dia.
const VIDEOS = [
  'https://files.catbox.moe/cxw1ws.mp4',
  'https://files.catbox.moe/h6ppgz.mp4',
  'https://files.catbox.moe/1j8htd.mp4',
  // 'https://SEU-NOVO-VIDEO-1.mp4',
  // 'https://SEU-NOVO-VIDEO-2.mp4',
];

const PERIODOS = ['manha', 'tarde', 'noite'];

// Número do dia no horário do aparelho (muda à meia-noite local)
function diaAtual() {
  const agora = new Date();
  return Math.floor((agora.getTime() - agora.getTimezoneOffset() * 60000) / 86400000);
}

function escolherVideo(periodo) {
  if (!VIDEOS.length) return '';
  const i = (diaAtual() + Math.max(0, PERIODOS.indexOf(periodo))) % VIDEOS.length;
  return VIDEOS[i];
}

// Mesmo formato de antes ({ manha, tarde, noite }), agora calculado a cada leitura
export const VIDEOS_POR_PERIODO = {
  get manha() { return escolherVideo('manha'); },
  get tarde() { return escolherVideo('tarde'); },
  get noite() { return escolherVideo('noite'); },
};
