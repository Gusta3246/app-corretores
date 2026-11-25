import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './theme/liquid.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Aviso discreto quando há versão nova do app (sem recarregar sozinho).
function mostrarAvisoAtualizacao() {
  if (document.getElementById('aviso-nova-versao')) return;
  const aviso = document.createElement('div');
  aviso.id = 'aviso-nova-versao';
  aviso.setAttribute('role', 'status');
  aviso.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:max(16px,env(safe-area-inset-bottom,0px));z-index:100000;display:flex;align-items:center;gap:12px;padding:10px 12px 10px 16px;border-radius:999px;background:#0f172a;color:#f1f5f9;border:1px solid #334155;font:600 13px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';
  const texto = document.createElement('span');
  texto.textContent = 'Nova versão disponível';
  const atualizar = document.createElement('button');
  atualizar.type = 'button';
  atualizar.textContent = 'Atualizar';
  atualizar.style.cssText = 'border:0;border-radius:999px;background:#007aff;color:#fff;font:700 13px inherit;font-family:inherit;padding:7px 14px;cursor:pointer;';
  atualizar.onclick = () => window.location.reload();
  const fechar = document.createElement('button');
  fechar.type = 'button';
  fechar.setAttribute('aria-label', 'Fechar aviso');
  fechar.textContent = '×';
  fechar.style.cssText = 'border:0;background:none;color:#94a3b8;font-size:18px;line-height:1;cursor:pointer;padding:0 4px;';
  fechar.onclick = () => aviso.remove();
  aviso.append(texto, atualizar, fechar);
  document.body.appendChild(aviso);
}

// Funcionamento offline (app instalado): registra o service worker só em produção.
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  navigator.serviceWorker.addEventListener('message', (e) => {
    if (e.data && e.data.tipo === 'nova-versao') mostrarAvisoAtualizacao();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((reg) => {
      const verificar = () => reg.update().catch(() => {});
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') verificar(); });
      setInterval(verificar, 60 * 60 * 1000);
    }).catch(() => {});
    // Pede ao navegador para não apagar os dados guardados quando o aparelho estiver com pouco espaço.
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  });
}