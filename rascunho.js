// Rascunho da pasta em andamento, guardado no aparelho (IndexedDB).
// IndexedDB aceita objetos File/Blob, então os documentos são salvos como estão.
// Nenhuma função lança erro: se o navegador não suportar ou bloquear o
// armazenamento (modo privado, cota cheia), o app continua funcionando sem rascunho.

const DB_NAME = 'destemidos-rascunho';
const STORE = 'rascunho';
const KEY = 'pasta-atual';

function abrirBanco() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB indisponível'));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('IndexedDB bloqueado'));
  });
}

function executar(modo, operacao) {
  return abrirBanco().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, modo);
        const req = operacao(tx.objectStore(STORE));
        tx.oncomplete = () => {
          db.close();
          resolve(req ? req.result : undefined);
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error);
        };
        tx.onabort = () => {
          db.close();
          reject(tx.error);
        };
      })
  );
}

export function salvarRascunho(dados) {
  return executar('readwrite', (store) => store.put(dados, KEY)).catch((err) => {
    console.warn('Não foi possível salvar o rascunho:', err);
  });
}

export function lerRascunho() {
  return executar('readonly', (store) => store.get(KEY))
    .then((r) => r || null)
    .catch(() => null);
}

export function apagarRascunho() {
  return executar('readwrite', (store) => store.delete(KEY)).catch(() => {});
}
