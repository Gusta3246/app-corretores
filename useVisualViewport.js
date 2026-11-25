import { useEffect, useState } from 'react';

// Acompanha a área realmente visível da tela (descontando o teclado virtual).
// No celular — principalmente no app instalado (PWA) — o teclado cobre a parte de
// baixo SEM encolher a página; por isso uma folha presa ao rodapé fica escondida
// atrás dele. Com altura/topo da área visível dá para manter o modal acima do teclado.
const ler = () => {
  const v = typeof window !== 'undefined' ? window.visualViewport : null;
  const cheia = typeof window !== 'undefined' ? window.innerHeight : 0;
  return v
    ? { altura: Math.round(v.height), topo: Math.round(v.offsetTop), cheia }
    : { altura: cheia, topo: 0, cheia };
};

export function useVisualViewport(ativo = true) {
  const [vv, setVv] = useState(ler);

  useEffect(() => {
    if (!ativo) return undefined;
    const v = window.visualViewport;
    const atualizar = () => setVv(ler());
    atualizar();
    if (v) {
      v.addEventListener('resize', atualizar);
      v.addEventListener('scroll', atualizar);
    }
    window.addEventListener('resize', atualizar);
    window.addEventListener('orientationchange', atualizar);
    return () => {
      if (v) {
        v.removeEventListener('resize', atualizar);
        v.removeEventListener('scroll', atualizar);
      }
      window.removeEventListener('resize', atualizar);
      window.removeEventListener('orientationchange', atualizar);
    };
  }, [ativo]);

  // teclado = quanto da parte de baixo da tela (layout) está coberta; usado como padding-bottom do modal fixo
  const teclado = Math.max(0, vv.cheia - vv.altura - vv.topo);
  return { altura: vv.altura, topo: vv.topo, teclado: teclado > 80 ? teclado : 0, tecladoAberto: vv.cheia - vv.altura > 120 };
}
