import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Search, ExternalLink, MapPin, BookOpen, Star, ChevronDown, ChevronRight, FileText, TableProperties, BookMarked, HelpCircle, Calculator, X, Wand2, File as FileIcon, Trash2, FolderPlus, Plus, MessageCircle, Moon, Sun, AlertTriangle, Book, RotateCw, RotateCcw, Phone, CreditCard, Copy, Check, Eye, EyeOff, Smartphone, Globe, Gem, Hexagon, Menu, Landmark, Camera, Share2, Download, ArrowUp, ArrowDown, SlidersHorizontal, FileSpreadsheet, FolderUp, FolderOpen, Home, ClipboardList } from 'lucide-react';
import { revistasDataLocal, utilitariosData, frasesMotivacionais, imagensEquipeDiarias, dayIndex, getPeriodo, getPeriodoIndex } from './data/dados.js';
import { VIDEOS_POR_PERIODO } from './data/midiaDiaria.js';
import { CardRevista, CarrosselComFade, RevistaCloseButton } from './components/Componentes.jsx';
import CalculadoraTabelaDireta from './components/CalculadoraTabelaDireta.jsx';
import { LOGO_HEADER_URL, LOGO_SPLASH_URL } from './theme/brand.js';
import { GRUPOS_MENU } from './data/atalhos.js';
import { RotatedImg, FotoEditor, WebcamModal } from './components/PastaExtras.jsx';
import { salvarRascunho, lerRascunho, apagarRascunho } from './utils/rascunho.js';
import { useVisualViewport } from './utils/useVisualViewport.js';

// Vidro da tela "Criar pasta": scrim escuro/claro + blur real (inline para não depender de CSS externo)
const pastaGlass = (dark, alpha = 0.5, blur = 30) => ({
  background: dark ? `rgba(12,18,34,${alpha})` : `rgba(255,255,255,${alpha})`,
  backdropFilter: `blur(${blur}px) saturate(180%)`,
  WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
  border: dark ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(255,255,255,0.75)',
  boxShadow: dark ? 'inset 0 1px 0 rgba(255,255,255,0.18), 0 10px 30px rgba(0,0,0,0.4)' : 'inset 0 1px 0 #ffffff, 0 10px 30px rgba(60,60,90,0.18)',
});
const pastaChip = {
  background: 'rgba(8,12,24,0.5)',
  backdropFilter: 'blur(16px) saturate(170%)',
  WebkitBackdropFilter: 'blur(16px) saturate(170%)',
  textShadow: '0 1px 2px rgba(0,0,0,0.45)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: '#ffffff',
};

// Ícone de câmera (corpo arredondado, aba no topo e lente grande)
const IgCamera = ({ size = 24, strokeWidth = 2.4, ...rest }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
        <path d="M4.5 7.5h3L9 5h6l1.5 2.5h3A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5V9a1.5 1.5 0 0 1 1.5-1.5Z" />
        <circle cx="12" cy="13.5" r="3.6" />
    </svg>
);

export default function App() {
    const [headerHeight, setHeaderHeight] = useState(0);

    // ── Efeito "zoom a partir do elemento" (estilo abertura de app iOS) ──
    // Guarda o ponto (em px de viewport) de onde o último modal foi acionado,
    // para os overlays fullscreen nascerem a partir do ícone/botão clicado.
    const [zoomOrigin, setZoomOrigin] = useState({ x: '50%', y: '50%' });
    const captureZoomOrigin = (e) => {
        try {
            const rect = e.currentTarget.getBoundingClientRect();
            setZoomOrigin({ x: `${rect.left + rect.width / 2}px`, y: `${rect.top + rect.height / 2}px` });
        } catch (_) { /* noop */ }
    };
    // ── Splash screen ao entrar no site ──
    const [splashDone, setSplashDone] = useState(() => window.innerWidth < 768 || sessionStorage.getItem('dst_splash') === '1');
    const [splashLeaving, setSplashLeaving] = useState(false);
    useEffect(() => {
        if (splashDone || window.innerWidth < 768) return;
        // Fase 1: mostra logo por 1.8s, depois anima saída
        const t1 = setTimeout(() => setSplashLeaving(true), 1900);
        const t2 = setTimeout(() => { setSplashDone(true); sessionStorage.setItem('dst_splash','1'); }, 2550);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);
    // ── Login (acesso ao app) — válido por 48h (ou mais, se "salvar senha" marcado), sem base de dados: valida por palavras-chave ──
    const LOGIN_TTL_MS = 48 * 60 * 60 * 1000; // 48h padrão
    const LOGIN_REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias quando "salvar senha" está marcado
    const [loginOk, setLoginOk] = useState(() => {
        try {
            const ts = parseInt(localStorage.getItem('dst_login_ts'), 10);
            const remembered = localStorage.getItem('dst_login_remember') === '1';
            const ttl = remembered ? LOGIN_REMEMBER_TTL_MS : LOGIN_TTL_MS;
            return !isNaN(ts) && (Date.now() - ts) < ttl;
        } catch { return false; }
    });
    const [loginTeam, setLoginTeam] = useState(() => {
        try { return localStorage.getItem('dst_login_saved_team') || ''; } catch { return ''; }
    });
    const [loginEmail, setLoginEmail] = useState(() => {
        try { return localStorage.getItem('dst_login_saved_email') || ''; } catch { return ''; }
    });
    const [loginRemember, setLoginRemember] = useState(() => {
        try { return localStorage.getItem('dst_login_remember') === '1'; } catch { return false; }
    });
    const [loginError, setLoginError] = useState({ team: false, email: false });
    const [loginShake, setLoginShake] = useState(false);
    const [loginTeamVisible, setLoginTeamVisible] = useState(false);
    const [loginEmailVisible, setLoginEmailVisible] = useState(false);

    // Times aceitos — cada entrada lista as palavras que precisam aparecer no campo (em qualquer ordem)
    const LOGIN_TEAMS = [
        { words: ['sagazes'] },
        { words: ['tigres', 'norte'] },
        { words: ['aguia'] },
        { words: ['raposa'] },
        { words: ['tubaroes'] },
        { words: ['rafa'] },
        { words: ['diretoria'] },
    ];
    const normalizeLogin = (str = '') => str
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos (Águia -> Aguia, Tubarões -> Tubaroes)
        .toLowerCase()
        .trim();
    const validateLoginTeam = (input) => {
        const norm = normalizeLogin(input);
        if (!norm) return false;
        return LOGIN_TEAMS.some(t => t.words.every(w => norm.includes(w.toLowerCase())));
    };
    const AUTHORIZED_EMAILS = [
        'vitoriasantos3.direcionalvenda@gmail.com',
        'gabriellaoliva.direcionalvendas@gmail.com',
        'cristianelopes.direcional@gmail.com',
        'anaoliva.direcionalvendas@gmail.com',
        'sabrinasousadirecionalvendas6@gmail.com',
        'regianeteles.direcionalvendas@gmail.com',
        'rafaela.cezar.direcional@gmail.com',
        'marcia.vitor.direcional@gmail.com',
        'lucasfonseca7.direcionalvendas@gmail.com',
        'roberto.jose.direcionalvendas@gmail.com',
        'hellen.fonsecadirecionalvendas@gmail.com',
        'pedrothiago.direcionalvendas@gmail.com',
        'alexandredirecional7@gmail.com',
        'catarinasampaio.direcional@gmail.com',
        'antoniamso.direcionalvendas@gmail.com',
        'claudiacorretora.direcional@gmail.com',
        'rafael.mourao@direcionalvendas.com.br',
        'luisgustavo.direcional@gmail.com',
        'ninabruce.direcionalvendas@gmail.com',
        'dorianecosta.direcional@gmail.com',
        'pathysousa.direcional@gmail.com',
        'lucianasena.direcionalvendas@gmail.com',
        'rayssa.antunes.direcionalvendas@gmail.com',
        'clarafeitosa.direcionalvendas@gmail.com',
        'eirabolívar.direcionalvendas@gmail.com',
        'kleberson.direcionalvendas@gmail.com',
        'pedroradro.direcionalvendas@gmail.com',
        'erikc.autocons.direcionalvendas@gmail.com',
        'jeiciferreira.direcionalvendas@gmail.com',
        'waleriatorres.direcionalvendas@gmail.com',
        'vanusaveza.direcional@gmail.com',
        'robertavieira.direcional@gmail.com',
        'monyquegloria.direcional@gmail.com',
        'iomarpessoa.direcional@gmail.com',
        'jericanara.direcional@gmail.com',
        'carvalhopedro.direcionalvendas@gmail.com',
        'thamires30.direcionalvendas@gmail.com',
        'rafaelafreitas.direcional@gmail.com',
        'lucascomercial.direcional@gmail.com',
        'Olavoholanda.direcional@gmail.com',
        'marceloazevedo.direcionalvendas@gmail.com',
        'juliane.jhullydirecionalvendas@gmail.com',
        'miqueiasnunes.direcionalvendas@gmail.com',
        'rafaelymedeiros.direcional@gmail.com',
        'pedrojr.direcionalvendas@gmail.com',
        'Kelvim.monteiro.direcionalvendas@gmail.com',
        'Fabianoliveira.vendasdirecional@gmail.com',
        'cfabi.direcionalvendas@gmail.com',
        'flaviadutra.direcionalvendas@gmail.com',
        'Kelvim.monteiro.direcionalvendas@gmail.com',
        'gessondirecionalvendas@gmail.com',
        'salesadm.direcionalvendas@gmail.com',
        'rayuri.direcionalvendas@gmail.com',
        'cfabi.direcionalvendas@gmail.com',
        'cj.direcionalvendas@gmail.com',
        'israel.r.direcionalvendas@gmail.com',
    ];
    const validateLoginEmail = (input) => {
        const norm = (input || '').toLowerCase().trim().replace(/\s+/g, '');
        return AUTHORIZED_EMAILS.some(e => e.toLowerCase() === norm);
    };
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const teamOk = validateLoginTeam(loginTeam);
        const emailOk = validateLoginEmail(loginEmail);
        if (teamOk && emailOk) {
            haptic('medium');
            try {
                localStorage.setItem('dst_login_ts', String(Date.now()));
                if (loginRemember) {
                    localStorage.setItem('dst_login_remember', '1');
                    localStorage.setItem('dst_login_saved_team', loginTeam);
                    localStorage.setItem('dst_login_saved_email', loginEmail);
                } else {
                    localStorage.removeItem('dst_login_remember');
                    localStorage.removeItem('dst_login_saved_team');
                    localStorage.removeItem('dst_login_saved_email');
                }
            } catch {}
            setLoginOk(true);
        } else {
            haptic();
            setLoginError({ team: !teamOk, email: !emailOk });
            setLoginShake(true);
            setTimeout(() => setLoginShake(false), 500);
        }
    };

    // Sticky tabs — abas grudam no header quando banner sai da tela
    const [tabsSticky, setTabsSticky] = useState(false);
    const [showMoreDrawer, setShowMoreDrawer] = useState(false); // sidebar direita do dock mobile
    // ── Menus agrupados da dock (Calcular / Documentos): balão no desktop, folha no celular ──
    const [groupMenu, setGroupMenu] = useState(null); // { id, rect, mobile }
    const openGroupMenu = (id, e) => {
        const r = e && e.currentTarget && e.currentTarget.getBoundingClientRect ? e.currentTarget.getBoundingClientRect() : null;
        const mobile = !r || window.innerWidth < 640;
        setGroupMenu(prev => (prev && prev.id === id ? null : { id, mobile, rect: r ? { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width } : null }));
    };
    useEffect(() => {
        if (!groupMenu) return;
        const close = () => setGroupMenu(null);
        const onKey = (ev) => { if (ev.key === 'Escape') close(); };
        window.addEventListener('scroll', close, { passive: true });
        window.addEventListener('resize', close);
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('scroll', close);
            window.removeEventListener('resize', close);
            window.removeEventListener('keydown', onKey);
        };
    }, [groupMenu]);
    const [dockPillStyle, setDockPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
    const [dockVisible, setDockVisible] = useState(false);    // dock aparece ao rolar pra baixo
    const [dockTransient, setDockTransient] = useState(null); // aba "tocada" que abre modal/gaveta (pílula desliza até ela e volta)
    const dockNavRef = useRef(null);
    const dockTabRefs = useRef({});
    const [headerHidden, setHeaderHidden] = useState(false);  // header (logo Destemidos) recolhe no mobile
    const bannerNavRef = useRef(null);
    const headerRef = useRef(null);
    // Search bar visibility (esconde no mobile ao scrollar para baixo)
    const [searchBarVisible, setSearchBarVisible] = useState(true);

    // Mede o header antes do primeiro paint para evitar o salto
    useLayoutEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, []);

    useEffect(() => {
        const measure = () => {
            if (headerRef.current) {
                const h = headerRef.current.offsetHeight;
                setHeaderHeight(h);
            }
        };

        measure(); // medição inicial
        window.addEventListener('resize', measure);

        // ResizeObserver como backup para desktop
        let ro;
        if (headerRef.current && window.ResizeObserver) {
            ro = new ResizeObserver(measure);
            ro.observe(headerRef.current);
        }

        return () => {
            window.removeEventListener('resize', measure);
            ro?.disconnect();
        };
    }, [tabsSticky, searchBarVisible]);

    const haptic = (style = 'light') => {
        if (!navigator.vibrate) return;
        const p = { light: 10, medium: 25, heavy: 40, success: [10, 50, 10] };
        navigator.vibrate(p[style] || 10);
    };



    const [searchTerm, setSearchTerm] = useState('');
    const revistasData = revistasDataLocal;
    const [activeBrand, setActiveBrand] = useState('Direcional');
    const [fraseDoDia] = useState(frasesMotivacionais[dayIndex % frasesMotivacionais.length]);
    const [modoNoturno, setModoNoturno] = useState(() => localStorage.getItem('modoNoturno') === 'true');
    // Barra de status (app instalado): cor sólida que acompanha o modo claro/noturno, sem gradiente
    useEffect(() => {
        const cor = modoNoturno ? '#0f172a' : '#ffffff';
        const meta = document.getElementById('theme-color-meta');
        if (meta) meta.setAttribute('content', cor);
        document.documentElement.style.backgroundColor = modoNoturno ? '#0B1120' : '#f8fafc';
        document.body.style.backgroundColor = modoNoturno ? '#0B1120' : '#f8fafc';
    }, [modoNoturno]);
    const [bannerFocusY, setBannerFocusY] = useState('30%');
    // ── Hero diário por período (manhã / tarde / noite) ──
    // Cada período mostra 1 vídeo (src/data/midiaDiaria.js) e, ao terminar, a foto do dia daquele período.
    const [periodo, setPeriodo] = useState(getPeriodo);
    const imagemDoDia = imagensEquipeDiarias[getPeriodoIndex(periodo) % imagensEquipeDiarias.length];
    const videoDoPeriodo = VIDEOS_POR_PERIODO[periodo] || '';
    const [heroFase, setHeroFase] = useState(videoDoPeriodo ? 'video' : 'foto'); // 'video' → 'foto'
    const heroVideoRef = useRef(null);
    const heroPausadoPorScroll = useRef(false);

    // App aberto na virada de período: reinicia o ciclo (vídeo → foto)
    useEffect(() => {
        const id = setInterval(() => setPeriodo((p) => { const n = getPeriodo(); return n === p ? p : n; }), 60 * 1000);
        return () => clearInterval(id);
    }, []);
    useEffect(() => { setHeroFase(videoDoPeriodo ? 'video' : 'foto'); }, [periodo, videoDoPeriodo]);

    // Enquanto o vídeo toca, já pré-carrega a foto do dia para a troca ser instantânea
    useEffect(() => {
        if (heroFase !== 'video') return;
        const pre = new Image();
        pre.src = imagemDoDia;
    }, [heroFase, imagemDoDia]);

    // Menu aberto: pausa o vídeo do hero (desfoque sobre vídeo em reprodução pesa muito)
    useEffect(() => {
        const v = heroVideoRef.current;
        if (!v) return;
        if (groupMenu) v.pause();
        else if (!heroPausadoPorScroll.current) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
    }, [groupMenu]);

    // Pausa o vídeo quando o usuário rola ou a aba fica oculta; volta a tocar no topo (só age na troca de estado)
    useEffect(() => {
        const aplicar = () => {
            const v = heroVideoRef.current;
            const deveParar = window.scrollY > 24 || document.hidden;
            if (deveParar === heroPausadoPorScroll.current) return;
            heroPausadoPorScroll.current = deveParar;
            if (!v) return;
            if (deveParar) v.pause();
            else { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
        };
        window.addEventListener('scroll', aplicar, { passive: true });
        document.addEventListener('visibilitychange', aplicar);
        return () => { window.removeEventListener('scroll', aplicar); document.removeEventListener('visibilitychange', aplicar); };
    }, []);

    // Detecta a região com mais "peso visual" no terço superior da imagem
    // para enquadrar rostos sem depender de API externa (evita CORS)
    useEffect(() => {
        const cacheKey = `dst_face_${imagemDoDia}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) { setBannerFocusY(cached); return; }

        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const SAMPLE_W = 120, SAMPLE_H = 80;
                const canvas = document.createElement('canvas');
                canvas.width = SAMPLE_W;
                canvas.height = SAMPLE_H;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, SAMPLE_W, SAMPLE_H);
                const data = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;

                // Divide em 4 faixas horizontais e calcula "riqueza de cor" (saturação média)
                // Faixas com mais saturação = mais rostos/pessoas
                const bands = 4;
                const bandH = Math.floor(SAMPLE_H / bands);
                const scores = Array(bands).fill(0);
                for (let b = 0; b < bands; b++) {
                    let sat = 0, count = 0;
                    for (let y = b * bandH; y < (b + 1) * bandH; y++) {
                        for (let x = 0; x < SAMPLE_W; x++) {
                            const i = (y * SAMPLE_W + x) * 4;
                            const r = data[i], g = data[i+1], bl = data[i+2];
                            const mx = Math.max(r,g,bl), mn = Math.min(r,g,bl);
                            sat += mx === 0 ? 0 : (mx - mn) / mx;
                            count++;
                        }
                    }
                    scores[b] = sat / count;
                }

                // Encontra a faixa com maior saturação (provavelmente onde estão as pessoas)
                const bestBand = scores.indexOf(Math.max(...scores));
                // Mapeia a faixa para uma posição Y% — prioriza topo/meio
                const posMap = ['15%', '25%', '40%', '55%'];
                const pos = posMap[bestBand] || '30%';
                localStorage.setItem(cacheKey, pos);
                setBannerFocusY(pos);
            } catch {
                setBannerFocusY('30%');
            }
        };
        img.onerror = () => setBannerFocusY('30%');
        img.src = imagemDoDia;
    }, [imagemDoDia]);

    // Estados para a aba Guia e Modal de POIs
    const [openGuiaIndex, setOpenGuiaIndex] = useState(null);
    const [copiedGuiaItem, setCopiedGuiaItem] = useState(null);
    const copiarTextoGuia = (texto, chave) => {
        haptic();
        navigator.clipboard?.writeText(texto).then(() => {
            setCopiedGuiaItem(chave);
            setTimeout(() => setCopiedGuiaItem(prev => (prev === chave ? null : prev)), 1600);
        }).catch(() => {});
    };
    const [cpfToast, setCpfToast] = useState(null);
    const [cpfToastCopiado, setCpfToastCopiado] = useState(false);
    const [selectedPois, setSelectedPois] = useState(null);
    const [closingPoi, setClosingPoi] = useState(false);
    const [selectedOnibus, setSelectedOnibus] = useState(null); // empreendimento para modal de ônibus
    const [closingOnibus, setClosingOnibus] = useState(false);

    // === ESTADOS DA IA OFFLINE ===
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [closingChat, setClosingChat] = useState(false);
    const [closingFolder, setClosingFolder] = useState(false);
    const [chatMessages, setChatMessages] = useState(() => {
        try {
            const s = localStorage.getItem('dst_chat');
            if (s) { const p = JSON.parse(s); if (Array.isArray(p) && p.length > 0) return p; }
        } catch {}
        return [{ role: 'bot', content: 'Olá, Destemido! Sou a sua IA de apoio. Posso te ajudar com detalhes dos imóveis, pontos de referência ou criar a sua pasta de documentos rapidinho. Como posso facilitar sua venda hoje? ✨' }];
    });
    const [isChatLoading, setIsChatLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [activeZone, setActiveZone] = useState(null);
    const [clientName, setClientName] = useState(() => localStorage.getItem('dst_client') || '');
    // ── Calculadora ITBI ──
    const [showCalculadoraItbiModal, setShowCalculadoraItbiModal] = useState(false);
    useEffect(() => {
        if (!showCalculadoraItbiModal) return;
        const onMsg = (e) => { if (e.data === 'fechar-itbi') setShowCalculadoraItbiModal(false); };
        window.addEventListener('message', onMsg);
        return () => window.removeEventListener('message', onMsg);
    }, [showCalculadoraItbiModal]);
    // ── Calculadora Tabela Direta ──
    const [showCalculadoraTabelaDiretaModal, setShowCalculadoraTabelaDiretaModal] = useState(false);
    // ── Menu de opções do Simulador ──

    // ── Modal Tabelas (Drive embutido) ──
    const [showTabelasModal, setShowTabelasModal] = useState(false);
    const [tabelasFiles, setTabelasFiles] = useState([]);
    const [tabelasLoading, setTabelasLoading] = useState(false);
    const [tabelasError, setTabelasError] = useState(null);

    // Cole sua API Key do Google Drive aqui (Google Cloud Console > Credenciais > Chave de API)
    const DRIVE_API_KEY = 'AIzaSyBd1mE1W7TX93gzu9MxWS8a5kJWOsY3SAg';
    const TABELAS_FOLDER_ID = '14mYfQkNaSc9APr6hpOTKKTFQ02oq3uOf';

    const fetchTabelasFiles = async () => {
        setTabelasLoading(true);
        setTabelasError(null);
        try {
            const fields = 'files(id,name,mimeType,modifiedTime,webViewLink,iconLink,size)';
            const q = encodeURIComponent(`'${TABELAS_FOLDER_ID}' in parents and trashed = false`);
            const url = `https://www.googleapis.com/drive/v3/files?q=${q}&key=${DRIVE_API_KEY}&fields=${fields}&orderBy=modifiedTime desc&pageSize=100`;
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error?.message || 'Falha ao carregar arquivos do Drive.');
            }
            setTabelasFiles(data.files || []);
        } catch (err) {
            setTabelasError(err.message || 'Erro ao buscar arquivos.');
        } finally {
            setTabelasLoading(false);
        }
    };

    useEffect(() => {
        if (showTabelasModal) fetchTabelasFiles();
    }, [showTabelasModal]);

    const tabRefs = {
        Direcional:  useRef(null),
        Riva:        useRef(null),
        Utilitarios: useRef(null),
        Guia:        useRef(null),
    };
    const navRef = useRef(null);
    const [hoveredTabIdx, setHoveredTabIdx] = useState(null);
    const hoveredTabIdxRef = useRef(null);
    useEffect(() => { hoveredTabIdxRef.current = hoveredTabIdx; }, [hoveredTabIdx]);
    const calcPill = (brand) => {
        const activeRef = tabRefs[brand];
        if (!activeRef?.current || !navRef?.current) return;
        // Auto-scroll para a aba ativa no mobile
        activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };

    useEffect(() => { calcPill(activeBrand); }, [activeBrand]);
    // Gradiente de cor atrás do hero: rola junto com a página (estilo Netflix)
    const heroGradRef = useRef(null);
    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                if (heroGradRef.current) heroGradRef.current.style.transform = `translate3d(0, ${-(window.scrollY || 0)}px, 0)`;
            });
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
    }, []);

    // Calcula posição inicial após o DOM montar
    useEffect(() => {
        const id = requestAnimationFrame(() => calcPill(activeBrand));
        return () => cancelAnimationFrame(id);
    }, []);

    // ── Pílula de vidro deslizante do dock inferior mobile ──
    const DOCK_IDS = ['Direcional', 'Riva', 'Camera', 'Tabelas'];
    const DOCK_MORE_IDS = ['TabelaDireta', 'PlanilhaTD', 'Utilitarios', 'GerarCpf', 'Calculadora', 'Simulador', 'Guia'];
    const dockTarget = showMoreDrawer ? 'menu'
        : (dockTransient || (DOCK_IDS.includes(activeBrand) ? activeBrand : (DOCK_MORE_IDS.includes(activeBrand) ? 'menu' : null)));
    useLayoutEffect(() => {
        const el = dockTarget ? dockTabRefs.current[dockTarget] : null;
        if (!el) { setDockPillStyle(p => ({ ...p, opacity: 0 })); return; }
        setDockPillStyle({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
    }, [dockTarget]);
    useEffect(() => {
        const onResize = () => {
            const el = dockTarget ? dockTabRefs.current[dockTarget] : null;
            if (el) setDockPillStyle({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [dockTarget]);

    const [pdfLeitor, setPdfLeitor] = useState(() => {
        // Leitor de revista in-app { title, url, brand }.
        // Se a página recarregar sozinha (ex.: o celular libera memória com muito zoom no PDF),
        // reabre a revista em vez de voltar para os cards. Só restaura 1 vez para não entrar em laço.
        try {
            const salvo = JSON.parse(localStorage.getItem('dst_revista_aberta') || 'null');
            if (salvo && salvo.url && !salvo.r && Date.now() - salvo.t < 3 * 60 * 1000) {
                localStorage.setItem('dst_revista_aberta', JSON.stringify({ ...salvo, r: 1 }));
                return { title: salvo.title, url: salvo.url, brand: salvo.brand };
            }
            localStorage.removeItem('dst_revista_aberta');
        } catch {}
        return null;
    });
    useEffect(() => {
        const KEY = 'dst_revista_aberta';
        const ler = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } };
        if (!pdfLeitor) { try { localStorage.removeItem(KEY); } catch {} return undefined; }
        const inicio = Date.now();
        const gravar = () => {
            const atual = ler();
            const mesma = atual && atual.url === pdfLeitor.url;
            const r = mesma && atual.r && Date.now() - inicio < 60000 ? 1 : 0; // sobreviveu 1 min: libera restaurar de novo
            try { localStorage.setItem(KEY, JSON.stringify({ title: pdfLeitor.title, url: pdfLeitor.url, brand: pdfLeitor.brand, t: Date.now(), r })); } catch {}
        };
        gravar();
        const id = setInterval(gravar, 15000); // "sinal de vida": só restaura se o app estava aberto há pouco
        return () => clearInterval(id);
    }, [pdfLeitor]);
    const [pdfLeitorLogoAnim, setPdfLeitorLogoAnim] = useState(null); // { logoSrc, brand } para animação de carregamento

    // Hide search bar on mobile scroll down, show on scroll up
    // Pull-to-refresh
    const mainContainerRef = useRef(null);
    const lastScrollY = useRef(0);
    const scrollTicking = useRef(false);

    useEffect(() => {
        const isMobile = () => window.innerWidth < 768;
        const handleScroll = () => {
            if (!isMobile()) { setSearchBarVisible(true); }
            const current = window.scrollY;
            if (isMobile()) {
                if (current > lastScrollY.current + 8 && current > 60) {
                    setSearchBarVisible(false);
                } else if (current < lastScrollY.current - 8) {
                    setSearchBarVisible(true);
                }
            }
            // Mobile (<640px): header (Destemidos) e dock recolhem ao rolar pra baixo e voltam ao rolar pra cima
            if (window.innerWidth < 640) {
                if (current > lastScrollY.current + 8 && current > 60) {
                    setHeaderHidden(true);
                } else if (current < lastScrollY.current - 8 || current <= 60) {
                    setHeaderHidden(false);
                }
                // dock aparece quando o usuário rola pra baixo (passou do topo) e permanece visível
                setDockVisible(current > 80);
            } else { setHeaderHidden(false); setDockVisible(true); }
            // (texto do logo permanece sempre visível)
            lastScrollY.current = current;
            // Sticky tabs: gruda no header quando o nav de abas sai da tela
            if (bannerNavRef.current) {
                const navBottom = bannerNavRef.current.getBoundingClientRect().bottom;
                setTabsSticky(navBottom < (headerRef.current?.offsetHeight || 70));
            }
        };
        const onScroll = () => {
            if (scrollTicking.current) return;
            scrollTicking.current = true;
            requestAnimationFrame(() => {
                handleScroll();
                scrollTicking.current = false;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Trava scroll do body quando modais/chat estão abertos
    // Quando pdfLeitor está aberto NÃO trava touchAction — o iframe precisa de scroll livre
    // Pasta aberta: congela a página de trás (position:fixed é o único jeito confiável no iOS)
    useEffect(() => {
        if (!isChatOpen) return undefined;
        const y = window.scrollY || 0;
        const b = document.body;
        const ant = { position: b.style.position, top: b.style.top, left: b.style.left, right: b.style.right, width: b.style.width };
        b.style.position = 'fixed'; b.style.top = `-${y}px`; b.style.left = '0'; b.style.right = '0'; b.style.width = '100%';
        return () => {
            b.style.position = ant.position; b.style.top = ant.top; b.style.left = ant.left; b.style.right = ant.right; b.style.width = ant.width;
            window.scrollTo({ top: y, left: 0, behavior: 'instant' });
        };
    }, [isChatOpen]);

    useEffect(() => {
        const shouldLock = isChatOpen || !!selectedPois || !!pdfLeitor || !!selectedOnibus;
        if (shouldLock) {
            document.body.style.overflow = 'hidden';
            // Se for o leitor de revista, deixa touch livre para o iframe funcionar
            document.body.style.touchAction = pdfLeitor ? '' : 'none';
            // revista aberta: evita que o gesto de pinça/arrasto "vaze" para a página (recarregar ou voltar)
            const ov = pdfLeitor ? 'none' : '';
            document.documentElement.style.overscrollBehavior = ov;
            document.body.style.overscrollBehavior = ov;
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            document.documentElement.style.overscrollBehavior = '';
            document.body.style.overscrollBehavior = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            document.documentElement.style.overscrollBehavior = '';
            document.body.style.overscrollBehavior = '';
        };
    }, [isChatOpen, selectedPois, pdfLeitor]);




    useEffect(() => {
        try { localStorage.setItem('dst_chat', JSON.stringify(chatMessages.slice(-40))); } catch {}
    }, [chatMessages]);

    // Saudação animada no logo
    const [logoPhase, setLogoPhase] = useState('logo'); // 'logo' | 'saudacao'
    const [logoSlideOut, setLogoSlideOut] = useState(false);
    const [logoTextCollapsed, setLogoTextCollapsed] = useState(false);
    const stickyDesk = tabsSticky && typeof window !== 'undefined' && window.innerWidth >= 640; // abas no header só no desktop

    const triggerLogoGreeting = () => {
        if (logoPhase !== 'logo') return;
        setLogoSlideOut(false);
        setLogoPhase('saudacao');
        setTimeout(() => setLogoSlideOut(true), 2000);
        setTimeout(() => { setLogoSlideOut(false); setLogoPhase('logo'); }, 2450);
    };

    useEffect(() => {
        const t = setTimeout(triggerLogoGreeting, 800);
        const interval = setInterval(triggerLogoGreeting, 5 * 60 * 1000);
        return () => { clearTimeout(t); clearInterval(interval); };
    }, []);

    // Texto "Destemidos / A sorte favorece os ousados" some ao rolar a tela pra baixo

    useEffect(() => {
        const last = [...chatMessages].reverse().find(m => m.role === 'user');
        if (!last) return;
        const m = last.content.match(/(?:cliente[^\w]*(?:é|e|se chama|chama)?[:\s]+|para[:\s]+|nome[:\s]+)([A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][a-záéíóúâêîôûãõç]+(?:\s+[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][a-záéíóúâêîôûãõç]+)*)/u);
        if (m && m[1]) {
            const n = m[1].trim();
            setPdfFileName('Pasta_' + n.replace(/\s+/g, '_'));
            setClientName(n);
            localStorage.setItem('dst_client', n);
        }
    }, [chatMessages]);

    const cardGridRef = useRef(null);

    // === ESTADOS PARA CRIAÇÃO DE PASTA DO CLIENTE ===
    const fileInputRef = useRef(null);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [folderSource, setFolderSource] = useState('manual');
    const [isFinalizingFolder, setIsFinalizingFolder] = useState(false);
    const nomeInputRef = useRef(null);
    // Foca o nome só depois que o modal terminou de aparecer (focar durante a animação faz o iOS empurrar a página)
    useEffect(() => {
        if (!isFinalizingFolder) return undefined;
        const t = setTimeout(() => { try { nomeInputRef.current?.focus({ preventScroll: true }); } catch { /* ignora */ } }, 320);
        return () => clearTimeout(t);
    }, [isFinalizingFolder]);
    const vv = useVisualViewport(isFinalizingFolder); // área visível (sem o teclado) para o modal de renomear
    const [showLightning, setShowLightning] = useState(false);
    const [pendingDocs, setPendingDocs] = useState([]);
    const [segSel, setSegSel] = useState(null);
    const [pdfFileName, setPdfFileName] = useState("");
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    const [dragGhostPos, setDragGhostPos] = useState({ x: 0, y: 0 });
    const [isDraggingActive, setIsDraggingActive] = useState(false);
    const [fullscreenDoc, setFullscreenDoc] = useState(null);
    const [selDocId, setSelDocId] = useState(null);
    const [showOrdem, setShowOrdem] = useState(false);
    const desktopPtr = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)').matches : false;
    const cameraInputRef = useRef(null);
    const [savedDraft, setSavedDraft] = useState(null);          // pasta em andamento guardada no aparelho
    const [folderNotice, setFolderNotice] = useState('');        // avisos ao adicionar arquivos
    const [editingDoc, setEditingDoc] = useState(null);          // foto aberta no editor
    const [showWebcam, setShowWebcam] = useState(false);
    const [fotoCamera, setFotoCamera] = useState(null); // foto recém-tirada, em ajuste antes de entrar na pasta
    const [genProgress, setGenProgress] = useState({ pct: 0, label: '' });
    const [genError, setGenError] = useState('');
    const [generatedPdf, setGeneratedPdf] = useState(null);      // { blob, name, size } do último PDF gerado
    const touchDragIndex = useRef(null);
    const touchTargetIndex = useRef(null);

    useEffect(() => {
        if (!document.getElementById('pdf-lib-script')) {
            const script = document.createElement('script');
            script.id = 'pdf-lib-script';
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
            script.async = true;
            document.body.appendChild(script);
        }
        if (!document.getElementById('pdfjs-script')) {
            const script = document.createElement('script');
            script.id = 'pdfjs-script';
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.async = true;
            script.onload = () => {
                if (window.pdfjsLib) {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    const workerScript = document.createElement('script');
                    workerScript.src = window.pdfjsLib.GlobalWorkerOptions.workerSrc;
                    workerScript.async = true;
                    document.body.appendChild(workerScript);
                }
            };
            document.body.appendChild(script);
        }
    }, []);

    // ── Gerador de CPF temporário (válido, com dígitos verificadores corretos) ──
    // Uso: testes de formulário/cadastro. Gera números aleatórios que passam na validação
    // matemática de CPF, mas não correspondem a nenhuma pessoa real.
    const gerarCPFValido = () => {
        const rnd = () => Math.floor(Math.random() * 10);
        const calcDigito = (nums) => {
            let soma = 0;
            let peso = nums.length + 1;
            for (let i = 0; i < nums.length; i++) {
                soma += nums[i] * peso;
                peso--;
            }
            const resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        };
        let base = Array.from({ length: 9 }, rnd);
        // evita gerar sequência de dígitos repetidos (ex: 111111111), que é inválida na prática
        if (base.every(d => d === base[0])) return gerarCPFValido();
        const d1 = calcDigito(base);
        const d2 = calcDigito([...base, d1]);
        const cpfNums = [...base, d1, d2];
        const cpfStr = cpfNums.join('');
        return cpfStr.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };
    const handleGerarCpfNav = () => {
        haptic('medium');
        const cpfGerado = gerarCPFValido();
        setCpfToastCopiado(false);
        setCpfToast(cpfGerado);
        navigator.clipboard?.writeText(cpfGerado).then(() => {
            setCpfToastCopiado(true);
        }).catch(() => {});
        setTimeout(() => { setCpfToast(prev => (prev === cpfGerado ? null : prev)); }, 5000);
    };

    const generatePdfPreview = async (file) => {
        try {
            await waitForPdfJs();
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport }).promise;
            page.cleanup();
            const numPages = pdf.numPages;
            if (pdf.destroy) pdf.destroy();
            return { url: canvas.toDataURL('image/jpeg', 0.8), numPages };
        } catch (e) {
            return null;
        }
    };

    const addFiles = async (files, extra) => {
        if (!files || files.length === 0) return;
        const rejeitados = [];
        const aceitos = files.filter((f) => {
            const ok = f.type === 'application/pdf' || f.type.startsWith('image/');
            if (!ok) rejeitados.push(f.name);
            return ok;
        });
        const novos = await Promise.all(aceitos.map(async (file) => {
            let previewUrl = null;
            let numPages = null;
            let broken = false;
            let brokenMsg = '';
            if (file.type.startsWith('image/')) {
                previewUrl = URL.createObjectURL(file);
                // confere se o navegador consegue abrir a imagem (evita travar na hora de gerar o PDF)
                const abre = await new Promise((resolve) => {
                    const im = new Image();
                    im.onload = () => resolve(true);
                    im.onerror = () => resolve(false);
                    im.src = previewUrl;
                });
                if (!abre) {
                    broken = true;
                    brokenMsg = /hei[cf]/i.test(`${file.type} ${file.name}`)
                        ? 'Formato HEIC não abre neste navegador. Converta para JPG.'
                        : 'Não foi possível abrir esta imagem.';
                }
            } else {
                const pr = await generatePdfPreview(file);
                if (pr) { previewUrl = pr.url; numPages = pr.numPages; }
            }
            return { id: Math.random().toString(36).substring(2, 9), file, name: file.name, previewUrl, numPages, broken, brokenMsg, ...(aceitos.length === 1 && extra ? extra : {}) };
        }));
        setPendingDocs(prev => [...prev, ...novos]);
        const avisos = [];
        if (rejeitados.length) avisos.push(`Ignorado (só imagens e PDF): ${rejeitados.join(', ')}.`);
        novos.filter(d => d.broken).forEach(d => avisos.push(`"${d.name}": ${d.brokenMsg}`));
        setFolderNotice(avisos.join(' '));
        if (!isCreatingFolder) {
            setIsCreatingFolder(true);
            setChatMessages(prev => [...prev, { role: 'bot', content: "Ótimo! Já abri a área de organização. 📂\n\nAgora você pode **arrastar os documentos** para colocar na ordem certa e depois clicar em Gerar PDF." }]);
        }
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        e.target.value = '';
        await addFiles(files);
    };

    // Foto tirada na câmera: abre os ajustes primeiro; só entra na pasta depois de aplicar
    const handleCameraUpload = (e) => {
        const f = Array.from(e.target.files || [])[0];
        e.target.value = '';
        if (!f) return;
        if (f.type.startsWith('image/')) setFotoCamera(f);
        else addFiles([f]);
    };

    const closePoi = () => {
        setClosingPoi(true);
        setTimeout(() => { setSelectedPois(null); setClosingPoi(false); }, 320);
    };

    const closeChat = () => {
        setClosingChat(true);
        setTimeout(() => { setIsChatOpen(false); setClosingChat(false); setIsCreatingFolder(false); }, 350);
    };

    const handleDragStart = (e, index) => {
        setDraggedItemIndex(index);
        setIsDraggingActive(true);
        e.dataTransfer.effectAllowed = "move";
        const ghost = document.createElement('div');
        ghost.style.position = 'absolute';
        ghost.style.top = '-9999px';
        ghost.style.opacity = '0';
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        setTimeout(() => document.body.removeChild(ghost), 0);
    };

    const handleDragEnd = (e) => {
        setIsDraggingActive(false);
        setDraggedItemIndex(null);
        setDragGhostPos({ x: 0, y: 0 });
    };

    const handleGlobalDragOver = (e) => {
        if (isDraggingActive) {
            setDragGhostPos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedItemIndex === null || draggedItemIndex === dropIndex) return;
        const newDocs = [...pendingDocs];
        const draggedItem = newDocs[draggedItemIndex];
        newDocs.splice(draggedItemIndex, 1);
        newDocs.splice(dropIndex, 0, draggedItem);
        setPendingDocs(newDocs);
        setDraggedItemIndex(null);
    };

    // === SUPORTE A TOUCH (CELULAR/TABLET) ===
    // Segurar ~280ms no card = arrastar para reordenar. Deslizar logo de cara = rolar a lista (sem mover a página).
    const touchHoldTimer = useRef(null);
    const touchStartXY = useRef({ x: 0, y: 0 });
    const dragTouchAtivo = useRef(false);   // lido pelo listener nativo (não-passivo) que bloqueia a rolagem
    const suprimirClique = useRef(false);

    const cancelTouchHold = () => { if (touchHoldTimer.current) { clearTimeout(touchHoldTimer.current); touchHoldTimer.current = null; } };

    const handleTouchStart = (e, index) => {
        const touch = e.touches[0];
        touchStartXY.current = { x: touch.clientX, y: touch.clientY };
        touchDragIndex.current = null;
        touchTargetIndex.current = null;
        cancelTouchHold();
        touchHoldTimer.current = setTimeout(() => {
            touchHoldTimer.current = null;
            dragTouchAtivo.current = true;
            touchDragIndex.current = index;
            touchTargetIndex.current = index;
            setDraggedItemIndex(index);
            setIsDraggingActive(true);
            setDragGhostPos({ x: touchStartXY.current.x, y: touchStartXY.current.y });
            haptic('medium');
        }, 280);
    };

    const handleDragTouchMove = (e) => {
        const touch = e.touches[0];
        if (!dragTouchAtivo.current) {
            // moveu antes de segurar: é rolagem, cancela o arrastar
            if (Math.abs(touch.clientX - touchStartXY.current.x) > 8 || Math.abs(touch.clientY - touchStartXY.current.y) > 8) cancelTouchHold();
            return;
        }
        setDragGhostPos({ x: touch.clientX, y: touch.clientY });
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element) {
            const card = element.closest('[data-doc-index]');
            if (card) {
                const idx = parseInt(card.getAttribute('data-doc-index'));
                touchTargetIndex.current = idx;
            }
        }
    };

    const handleDragTouchEnd = () => {
        cancelTouchHold();
        if (!dragTouchAtivo.current) return;
        const from = touchDragIndex.current;
        const to = touchTargetIndex.current;
        if (from !== null && to !== null && from !== to) {
            const newDocs = [...pendingDocs];
            const draggedItem = newDocs[from];
            newDocs.splice(from, 1);
            newDocs.splice(to, 0, draggedItem);
            setPendingDocs(newDocs);
        }
        dragTouchAtivo.current = false;
        suprimirClique.current = true; // o toque que soltou o card não deve abrir/selecionar
        setTimeout(() => { suprimirClique.current = false; }, 350);
        touchDragIndex.current = null;
        touchTargetIndex.current = null;
        setDraggedItemIndex(null);
        setIsDraggingActive(false);
        setDragGhostPos({ x: 0, y: 0 });
    };

    // Enquanto um card está sendo arrastado, nada rola (listener nativo não-passivo; o do React é passivo e ignora preventDefault)
    useEffect(() => {
        const bloquear = (e) => { if (dragTouchAtivo.current && e.cancelable) e.preventDefault(); };
        document.addEventListener('touchmove', bloquear, { passive: false });
        return () => document.removeEventListener('touchmove', bloquear);
    }, []);

    const waitForPdfJs = () => new Promise((resolve, reject) => {
        if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions.workerSrc) return resolve();
        let tries = 0;
        const interval = setInterval(() => {
            if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
                clearInterval(interval);
                resolve();
            } else if (++tries > 40) {
                clearInterval(interval);
                reject(new Error('pdf.js não carregou'));
            }
        }, 100);
    });

    const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10MB

    // Conta as páginas de um PDF SEM renderizar nada (leitura leve, só para decidir a escala ideal)
    const getPdfPageCount = async (arrayBuffer) => {
        try {
            await waitForPdfJs();
            const dataCopy = arrayBuffer.slice(0);
            const pdfDoc = await window.pdfjsLib.getDocument({
                data: new Uint8Array(dataCopy),
                password: '',
                disableRange: true,
                disableStream: true,
            }).promise;
            const n = pdfDoc.numPages;
            if (pdfDoc.destroy) pdfDoc.destroy();
            return n;
        } catch {
            return 1;
        }
    };

    // Renderiza todas as páginas de um PDF em canvases (uma vez só, na maior resolução)
    const pdfToCanvases = async (arrayBuffer, scale = 3.0) => {
        await waitForPdfJs();
        const dataCopy = arrayBuffer.slice(0);
        const loadingTask = window.pdfjsLib.getDocument({
            data: new Uint8Array(dataCopy),
            password: '',
            disableRange: true,
            disableStream: true,
        });
        const pdfDoc = await loadingTask.promise;
        const canvases = [];
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.width  = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvasContext: ctx, viewport }).promise;
            canvases.push({ canvas, widthPt: canvas.width / scale, heightPt: canvas.height / scale });
            page.cleanup();
        }
        return canvases;
    };

    // Desenha a imagem já com a rotação aplicada, em um canvas (uma vez só, na resolução original)
    const imageFileToCanvas = (file, rotation = 0, maxSide = 0) => new Promise((resolve, reject) => {
        const img = new Image();
        const objUrl = URL.createObjectURL(file);
        img.onload = () => {
            // maxSide > 0 reduz fotos enormes de celular (mais rápido e arquivo menor)
            const k = maxSide > 0 ? Math.min(1, maxSide / Math.max(img.width, img.height)) : 1;
            const iw = Math.round(img.width * k);
            const ih = Math.round(img.height * k);
            const swapped = rotation === 90 || rotation === 270;
            const cw = swapped ? ih : iw;
            const ch = swapped ? iw : ih;
            const canvas = document.createElement('canvas');
            canvas.width  = cw;
            canvas.height = ch;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, cw, ch);
            ctx.translate(cw / 2, ch / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
            URL.revokeObjectURL(objUrl);
            resolve(canvas);
        };
        img.onerror = () => {
            URL.revokeObjectURL(objUrl);
            const err = new Error(`Não foi possível abrir a imagem "${file.name}".`);
            err.code = 'IMG';
            reject(err);
        };
        img.src = objUrl;
    });

    // Gira um canvas já renderizado (usado nos PDFs girados quando precisa recomprimir)
    const rotateCanvasPage = (pg, rotation) => {
        if (!rotation) return pg;
        const swapped = rotation === 90 || rotation === 270;
        const src = pg.canvas;
        const c = document.createElement('canvas');
        c.width  = swapped ? src.height : src.width;
        c.height = swapped ? src.width  : src.height;
        const ctx = c.getContext('2d');
        ctx.translate(c.width / 2, c.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(src, -src.width / 2, -src.height / 2);
        return { canvas: c, widthPt: swapped ? pg.heightPt : pg.widthPt, heightPt: swapped ? pg.widthPt : pg.heightPt };
    };

    // ── Edição de páginas (PDF): lista na ordem de saída; i = página original, rot = giro extra, del = excluída ──
    const getEdits = (doc, n) => (doc.pageEdits && doc.pageEdits.length === n)
        ? doc.pageEdits
        : Array.from({ length: n }, (_, i) => ({ i, rot: 0, del: false }));
    const keptPageCount = (doc) => {
        if (doc.file.type !== 'application/pdf') return 1;
        if (!doc.numPages) return null;
        return getEdits(doc, doc.numPages).filter(e => !e.del).length;
    };
    const paginasTexto = (doc, n) => {
        const kept = getEdits(doc, n).filter(e => !e.del).length;
        return kept === n ? `${n} ${n === 1 ? 'página' : 'páginas'}` : `${kept} de ${n} páginas`;
    };
    const updateDoc = (id, patch) => {
        setPendingDocs(prev => prev.map(d => (d.id === id ? { ...d, ...patch } : d)));
        setFullscreenDoc(fd => (fd && fd.id === id ? { ...fd, ...patch } : fd));
    };

    // ── Tamanho estimado do PDF final (antes de salvar) ──
    const fmtMB = (bytes) => `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1).replace('.', ',')} MB`;
    const estimateBytes = () => pendingDocs.reduce((tot, doc) => {
        if (doc.file.type === 'application/pdf') {
            const kept = keptPageCount(doc);
            const frac = (doc.numPages && kept != null) ? kept / doc.numPages : 1;
            return tot + doc.file.size * frac;
        }
        return tot + Math.min(doc.file.size, 650 * 1024); // fotos são reduzidas ao salvar
    }, 0);

    // ── Nome sugerido a partir do nome do cliente ──
    const sugestaoNome = (() => {
        const n = (clientName || '').trim().replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '_');
        return n ? `Pasta_${n}` : '';
    })();
    const openFinalize = () => {
        if (!pdfFileName.trim() && sugestaoNome) setPdfFileName(sugestaoNome);
        setGenError('');
        setIsFinalizingFolder(true);
    };

    const setProg = (pct, label) => setGenProgress({ pct: Math.max(0, Math.min(100, Math.round(pct))), label });

    const canvasToJpegBytes = (canvas, quality) => new Promise((resolve) => {
        canvas.toBlob(blob => { blob.arrayBuffer().then(buf => resolve(new Uint8Array(buf))); }, 'image/jpeg', quality);
    });

    // Reduz a resolução (não o tamanho físico da página) de um canvas já renderizado
    const downscaleCanvas = (canvas, factor) => {
        if (factor >= 1) return canvas;
        const c = document.createElement('canvas');
        c.width  = Math.max(1, Math.round(canvas.width  * factor));
        c.height = Math.max(1, Math.round(canvas.height * factor));
        c.getContext('2d').drawImage(canvas, 0, 0, c.width, c.height);
        return c;
    };

    // Monta o PDF final a partir dos canvases já renderizados, numa dada qualidade/resolução
    // A etapa mais cara (comprimir cada página em JPEG) roda em paralelo, não uma por uma
    const buildPdfFromPages = async (pages, quality, resFactor) => {
        const { PDFDocument } = window.PDFLib;
        const mergedPdf = await PDFDocument.create();
        const allBytes = await Promise.all(pages.map((pg) => {
            const srcCanvas = resFactor < 1 ? downscaleCanvas(pg.canvas, resFactor) : pg.canvas;
            return canvasToJpegBytes(srcCanvas, quality);
        }));
        for (let i = 0; i < pages.length; i++) {
            const pg = pages[i];
            const embedded = await mergedPdf.embedJpg(allBytes[i]);
            const pdfPage = mergedPdf.addPage([pg.widthPt, pg.heightPt]);
            pdfPage.drawImage(embedded, { x: 0, y: 0, width: pg.widthPt, height: pg.heightPt });
        }
        return mergedPdf.save();
    };

    // ROTA RÁPIDA: junta os PDFs original SEM recomprimir (copia as páginas) e
    // embute as fotos já reduzidas. É o que apps como o PDF24 fazem — leva segundos.
    const buildPdfFast = async () => {
        const { PDFDocument, degrees } = window.PDFLib;
        const total = pendingDocs.length;
        let lidos = 0;
        setProg(2, 'Lendo documentos...');
        const parts = await Promise.all(pendingDocs.map(async (doc) => {
            const rot = doc.rotation || 0;
            let part = null;
            if (doc.file.type === 'application/pdf') {
                const bytes = doc._arrayBuffer || await doc.file.arrayBuffer();
                const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
                if (src.isEncrypted) {
                    // PDF criptografado (ex.: Carteira de Trabalho Digital / Dataprev, AES).
                    // O pdf-lib NÃO descriptografa: copiar as páginas gera páginas em BRANCO.
                    // Por isso renderizamos com o pdf.js (que abre com senha vazia) e embutimos como imagem.
                    const canvases = await pdfToCanvases(bytes, 2.5);
                    const edits = getEdits(doc, canvases.length).filter(e => !e.del);
                    const pages = [];
                    for (const e of edits) {
                        const pg = rotateCanvasPage(canvases[e.i], (rot + e.rot) % 360);
                        const jpg = await canvasToJpegBytes(pg.canvas, 0.88);
                        pages.push({ jpg, widthPt: pg.widthPt, heightPt: pg.heightPt });
                    }
                    part = { kind: 'rendered', pages };
                } else {
                    part = { kind: 'pdf', src, rot, doc };
                }
            } else if (doc.file.type.startsWith('image/')) {
                const canvas = await imageFileToCanvas(doc.file, rot, 2000);
                const jpg = await canvasToJpegBytes(canvas, 0.82);
                part = { kind: 'img', jpg, w: canvas.width, h: canvas.height };
            }
            lidos += 1;
            setProg(2 + (lidos / total) * 55, `Lendo documentos (${lidos}/${total})...`);
            return part;
        }));
        const out = await PDFDocument.create();
        let montados = 0;
        for (const part of parts) {
            if (part && part.kind === 'pdf') {
                const edits = getEdits(part.doc, part.src.getPageCount()).filter(e => !e.del);
                const copied = await out.copyPages(part.src, edits.map(e => e.i));
                copied.forEach((p, k) => {
                    const r = (part.rot + edits[k].rot) % 360;
                    if (r) p.setRotation(degrees((p.getRotation().angle + r) % 360));
                    out.addPage(p);
                });
            } else if (part && part.kind === 'rendered') {
                for (const pg of part.pages) {
                    const emb = await out.embedJpg(pg.jpg);
                    const page = out.addPage([pg.widthPt, pg.heightPt]);
                    page.drawImage(emb, { x: 0, y: 0, width: pg.widthPt, height: pg.heightPt });
                }
            } else if (part && part.kind === 'img') {
                const emb = await out.embedJpg(part.jpg);
                const page = out.addPage([part.w, part.h]);
                page.drawImage(emb, { x: 0, y: 0, width: part.w, height: part.h });
            }
            montados += 1;
            setProg(58 + (montados / total) * 35, `Montando PDF (${montados}/${total})...`);
        }
        setProg(95, 'Finalizando...');
        return out.save();
    };

    const generateClientPDF = async () => {
        if (!window.PDFLib) {
            alert("Aguarde um instante, estou preparando o motor de PDFs... 🛠️");
            return;
        }
        setGenError('');
        const quebrados = pendingDocs.filter(d => d.broken);
        if (quebrados.length) {
            setGenError(`Remova ou troque os arquivos que não abrem: ${quebrados.map(d => d.name).join(', ')}.`);
            return;
        }
        setIsChatLoading(true);
        setProg(1, 'Preparando...');
        try {
            // 1) Rota rápida (sem recomprimir). Só cai na compressão pesada se passar do limite
            //    ou se algum PDF não puder ser copiado.
            let pdfBytes = null;
            try {
                const fast = await buildPdfFast();
                if (fast.length <= MAX_PDF_BYTES) pdfBytes = fast;
            } catch (err) {
                if (err && err.code === 'IMG') throw err;
                console.warn('Rota rápida indisponível, usando compressão:', err);
            }

            if (!pdfBytes) {
                setProg(5, 'Arquivo grande: otimizando...');
                // Conta o total de páginas ANTES de renderizar, para escolher uma escala proporcional.
                let totalPages = 0;
                for (const doc of pendingDocs) {
                    if (doc.file.type === 'application/pdf') {
                        const arrayBuffer = await doc.file.arrayBuffer();
                        doc._arrayBuffer = arrayBuffer; // reaproveita, evita ler o arquivo 2x
                        totalPages += await getPdfPageCount(arrayBuffer);
                    } else {
                        totalPages += 1;
                    }
                }
                const renderScale = totalPages > 20 ? 1.8 : totalPages > 10 ? 2.2 : 3.0;

                // Renderiza cada documento UMA ÚNICA VEZ, na escala já ajustada
                const pages = [];
                let feitos = 0;
                for (const doc of pendingDocs) {
                    if (doc.file.type === 'application/pdf') {
                        const arrayBuffer = doc._arrayBuffer || await doc.file.arrayBuffer();
                        const canvases = await pdfToCanvases(arrayBuffer, renderScale);
                        getEdits(doc, canvases.length).filter(e => !e.del).forEach((e) => {
                            pages.push(rotateCanvasPage(canvases[e.i], ((doc.rotation || 0) + e.rot) % 360));
                        });
                    } else if (doc.file.type.startsWith('image/')) {
                        const canvas = await imageFileToCanvas(doc.file, doc.rotation || 0);
                        pages.push({ canvas, widthPt: canvas.width, heightPt: canvas.height });
                    }
                    feitos += 1;
                    setProg(10 + (feitos / pendingDocs.length) * 40, `Lendo documento ${feitos}/${pendingDocs.length}...`);
                }

                // Começa na qualidade máxima e só reduz o necessário para caber no limite.
                const qualitySteps = [0.9, 0.75, 0.6, 0.45];
                const resSteps = [1, 0.7, 0.5];
                const totalTentativas = qualitySteps.length * resSteps.length;
                let tentativa = 0;
                outer:
                for (const resFactor of resSteps) {
                    for (const q of qualitySteps) {
                        tentativa += 1;
                        setProg(50 + (tentativa / totalTentativas) * 45, `Comprimindo (tentativa ${tentativa}/${totalTentativas})...`);
                        const bytes = await buildPdfFromPages(pages, q, resFactor);
                        pdfBytes = bytes; // guarda sempre a última tentativa (melhor esforço)
                        if (bytes.length <= MAX_PDF_BYTES) break outer;
                    }
                }
            }

            const nomeLimpo = ((pdfFileName || '').trim().replace(/\.pdf$/i, '').replace(/[\\/:*?"<>|]/g, '')) || 'Pasta_do_Cliente';
            const nomeFinal = `${nomeLimpo}.pdf`;
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url  = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href  = url;
            link.download = nomeFinal;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 5000);
            setProg(100, 'Pronto!');

            setChatMessages(prev => [...prev, { role: 'bot', content: "✅ **Missão cumprida!** Seu PDF foi gerado e o download começou.\n\nSua pasta está prontinha e organizada. Mais algum desafio para hoje?" }]);
            setGeneratedPdf({ blob, name: nomeFinal, size: pdfBytes.length });
            setIsCreatingFolder(false);
            setPendingDocs([]);
            setPdfFileName('');
            setFolderNotice('');
            apagarRascunho();
            setSavedDraft(null);
            setIsFinalizingFolder(false);
            setShowLightning(true);
            setTimeout(() => setShowLightning(false), 2800);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            const msg = error && error.message ? error.message : 'erro desconhecido';
            setGenError(`Não foi possível gerar o PDF. ${msg}`);
            setChatMessages(prev => [...prev, { role: 'bot', content: `Ops, algo não deu certo ao gerar o arquivo. 😕\n\nDetalhe: ${msg}` }]);
        }
        setIsChatLoading(false);
    };

    const removeDoc = (id) => {
        const doc = pendingDocs.find(d => d.id === id);
        if (doc && doc.previewUrl && doc.previewUrl.startsWith('blob:')) URL.revokeObjectURL(doc.previewUrl);
        const restante = pendingDocs.filter(d => d.id !== id);
        setPendingDocs(restante);
        if (restante.length === 0) { apagarRascunho(); setSavedDraft(null); }
    };

    // Prévia em tela cheia: renderiza TODAS as páginas do PDF (uma a uma, conforme ficam prontas)
    const [previewPages, setPreviewPages] = useState([]);
    const [previewLoading, setPreviewLoading] = useState(false);
    const fullscreenFile = fullscreenDoc ? fullscreenDoc.file : null;
    useEffect(() => {
        if (!fullscreenFile || fullscreenFile.type !== 'application/pdf') {
            setPreviewPages([]);
            setPreviewLoading(false);
            return undefined;
        }
        let cancelled = false;
        setPreviewPages([]);
        setPreviewLoading(true);
        (async () => {
            let pdfDoc = null;
            try {
                await waitForPdfJs();
                const buf = await fullscreenFile.arrayBuffer();
                pdfDoc = await window.pdfjsLib.getDocument({ data: new Uint8Array(buf), password: '', disableRange: true, disableStream: true }).promise;
                for (let n = 1; n <= pdfDoc.numPages; n++) {
                    if (cancelled) break;
                    const page = await pdfDoc.getPage(n);
                    const viewport = page.getViewport({ scale: 1.6 });
                    const canvas = document.createElement('canvas');
                    canvas.width = Math.floor(viewport.width);
                    canvas.height = Math.floor(viewport.height);
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    await page.render({ canvasContext: ctx, viewport }).promise;
                    page.cleanup();
                    const url = canvas.toDataURL('image/jpeg', 0.85);
                    if (cancelled) break;
                    setPreviewPages((prev) => [...prev, url]);
                }
            } catch (err) {
                console.error('Erro ao montar prévia do PDF:', err);
            } finally {
                if (pdfDoc && pdfDoc.destroy) pdfDoc.destroy();
                if (!cancelled) setPreviewLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [fullscreenFile]);

    // Editar páginas do PDF aberto: excluir, mover e girar
    const editPages = (mutator) => {
        if (!fullscreenDoc || previewPages.length === 0) return;
        const base = getEdits(fullscreenDoc, previewPages.length).map((e) => ({ ...e }));
        updateDoc(fullscreenDoc.id, { pageEdits: mutator(base) });
    };
    const movePage = (idx, dir) => editPages((arr) => {
        const j = idx + dir;
        if (j < 0 || j >= arr.length) return arr;
        [arr[idx], arr[j]] = [arr[j], arr[idx]];
        return arr;
    });
    const rotatePage = (idx, dir) => editPages((arr) => {
        arr[idx].rot = (((arr[idx].rot + (dir === 'cw' ? 90 : -90)) % 360) + 360) % 360;
        return arr;
    });
    const togglePage = (idx) => editPages((arr) => {
        const vivas = arr.filter((e) => !e.del).length;
        if (!arr[idx].del && vivas <= 1) return arr; // precisa sobrar ao menos 1 página
        arr[idx].del = !arr[idx].del;
        return arr;
    });

    // Ajuste de foto
    const aplicarFotoEditada = (novoArquivo, ajustes) => {
        if (!editingDoc) return;
        const atual = pendingDocs.find((d) => d.id === editingDoc.id);
        if (atual && atual.previewUrl && atual.previewUrl.startsWith('blob:')) URL.revokeObjectURL(atual.previewUrl);
        updateDoc(editingDoc.id, {
            file: novoArquivo,
            previewUrl: URL.createObjectURL(novoArquivo),
            originalFile: editingDoc.originalFile || editingDoc.file,
            ajustes: ajustes || undefined,
            broken: false,
            brokenMsg: '',
        });
        setEditingDoc(null);
    };

    // Câmera: celular usa a câmera nativa; computador abre a webcam
    const abrirCamera = () => {
        haptic();
        const toque = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        if (!toque) return; // câmera só no celular
        // Celular: abre a câmera ao vivo (traseira) com Capturar/Concluir; se o navegador não permitir, usa a câmera nativa
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) setShowWebcam(true);
        else if (cameraInputRef.current) cameraInputRef.current.click();
    };

    // Não perder o trabalho: guarda a pasta em andamento no aparelho
    useEffect(() => {
        lerRascunho().then((r) => {
            if (r && r.docs && r.docs.length) setSavedDraft({ count: r.docs.length, savedAt: r.savedAt, cliente: r.cliente || '' });
        });
    }, []);
    useEffect(() => {
        if (pendingDocs.length === 0) return undefined;
        const t = setTimeout(() => {
            salvarRascunho({
                savedAt: Date.now(),
                cliente: clientName,
                docs: pendingDocs.map((d) => ({
                    id: d.id, name: d.name, file: d.file, originalFile: d.originalFile || null, ajustes: d.ajustes || null,
                    rotation: d.rotation || 0, numPages: d.numPages || null, pageEdits: d.pageEdits || null,
                })),
            });
        }, 800);
        return () => clearTimeout(t);
    }, [pendingDocs, clientName]);

    const restoreDraft = async () => {
        const r = await lerRascunho();
        if (!r || !r.docs || r.docs.length === 0) { setSavedDraft(null); return; }
        setFolderNotice('Restaurando documentos...');
        const docs = await Promise.all(r.docs.map(async (d) => {
            let previewUrl = null;
            let numPages = d.numPages;
            if (d.file.type.startsWith('image/')) {
                previewUrl = URL.createObjectURL(d.file);
            } else {
                const pr = await generatePdfPreview(d.file);
                if (pr) { previewUrl = pr.url; numPages = numPages || pr.numPages; }
            }
            return {
                id: d.id, file: d.file, originalFile: d.originalFile || undefined, ajustes: d.ajustes || undefined, name: d.name, previewUrl, numPages,
                rotation: d.rotation || 0, pageEdits: d.pageEdits || undefined,
            };
        }));
        setPendingDocs(docs);
        if (r.cliente) { setClientName(r.cliente); try { localStorage.setItem('dst_client', r.cliente); } catch {} }
        setSavedDraft(null);
        setFolderNotice('');
    };
    const discardDraft = () => { apagarRascunho(); setSavedDraft(null); };

    // Compartilhar / baixar de novo o último PDF
    const compartilharPdf = async () => {
        if (!generatedPdf) return;
        try {
            const arquivo = new File([generatedPdf.blob], generatedPdf.name, { type: 'application/pdf' });
            await navigator.share({ files: [arquivo], title: generatedPdf.name });
        } catch (err) { /* usuário cancelou o compartilhamento */ }
    };
    const baixarNovamente = () => {
        if (!generatedPdf) return;
        const url = URL.createObjectURL(generatedPdf.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = generatedPdf.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    };

    const chatScrollRef = useRef(null);

    useEffect(() => {
        if (isChatOpen && chatScrollRef.current) {
            // Instant jump to bottom when opening chat
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [isChatOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    // Ctrl+V — captura imagem da área de transferência


    // Reset do resultado é feito diretamente no onClick do botão calcular
    // (useEffect foi removido pois causava reset após o cálculo)

    const filteredRevistas = revistasData.filter(revista => {
        const matchesSearch = revista.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            revista.region.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = revista.brand === activeBrand;
        const matchesZone = !activeZone || revista.region.toLowerCase().includes(activeZone.toLowerCase());
        return matchesSearch && matchesBrand && matchesZone;
    }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    // ── Categorias dos cards de revistas (só Direcional, sem busca/zona ativa) ──
    const CATEGORIAS_REVISTA = [
        { id: 'queridinhos', label: 'Os queridinhos', sub: 'As menores rendas para começar', filtro: r => typeof r.rendaMinima === 'number' && r.rendaMinima <= 3000, ordena: (a, b) => a.rendaMinima - b.rendaMinima },
        { id: '36', label: '36 metros', sub: 'Apartamentos de 36m²', filtro: r => /^\s*36\s*m/i.test(r.size || '') },
        { id: '41', label: '41 metros', sub: 'Apartamentos a partir de 41m²', filtro: r => /^\s*41\s*m/i.test(r.size || '') },
        { id: 'prontos', label: 'Prontos para morar', sub: 'Já entregues', filtro: r => r.entrega === 'Entregue' },
    ];
    const usarCategorias = activeBrand === 'Direcional' && !searchTerm.trim() && !activeZone;
    const linhasCategoria = CATEGORIAS_REVISTA
        .map(c => ({ ...c, itens: filteredRevistas.filter(c.filtro).sort(c.ordena || (() => 0)) }))
        .filter(c => c.itens.length > 0);
    const idsEmCategoria = new Set(linhasCategoria.flatMap(c => c.itens.map(r => r.id)));
    const outrosItens = filteredRevistas.filter(r => !idsEmCategoria.has(r.id));
    if (outrosItens.length > 0) linhasCategoria.push({ id: 'outros', label: 'Mais opções', sub: 'Outros empreendimentos', itens: outrosItens });

    return (
        <>
            {/* Fundo do site inteiro = foto do dia desfocada, no lugar do branco/cinza.
               É o PRIMEIRO elemento do DOM dentro do app, com zIndex 0 (não negativo,
               de propósito: z-index negativo + position:fixed tem bugs conhecidos no
               Safari/iOS quando html/body têm background-color explícito, como é o
               caso aqui). Por ser o primeiro no DOM e todo o resto do app não ter
               z-index negativo, ele naturalmente fica por baixo de tudo. */}
            <div
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                }}
            >
                <img
                    src={imagemDoDia}
                    alt=""
                    fetchpriority="high"
                    loading="eager"
                    decoding="async"
                    onError={(e) => { e.target.style.display = 'none'; }}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scale(1.15)',
                        filter: 'blur(38px) saturate(1.05)',
                        display: 'block',
                    }}
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: (activeBrand === 'Utilitarios' || activeBrand === 'Guia')
                        ? (modoNoturno ? 'rgba(11,17,32,0.96)' : 'rgba(255,255,255,0.97)')
                        : (modoNoturno ? 'rgba(11,17,32,0.82)' : 'rgba(255,255,255,0.88)'),
                    transition: 'background 0.5s ease',
                }} />
                {/* Cor/gradiente atrás do hero (acompanha a rolagem) */}
                <div ref={heroGradRef} style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 1100,
                    willChange: 'transform',
                    opacity: (activeBrand === 'Utilitarios' || activeBrand === 'Guia') ? 0 : 1,
                    transition: 'opacity 0.5s ease',
                    background: modoNoturno
                        ? 'radial-gradient(1100px 620px at 72% 0%, rgba(91,155,255,0.12) 0%, rgba(91,155,255,0) 70%), linear-gradient(180deg, rgba(10,45,100,0.28) 0px, rgba(10,28,61,0.16) 440px, rgba(23,12,26,0.06) 800px, rgba(11,17,32,0) 1100px)'
                        : 'radial-gradient(1100px 620px at 72% 0%, rgba(91,155,255,0.06) 0%, rgba(91,155,255,0) 70%), linear-gradient(180deg, rgba(74,133,220,0.07) 0px, rgba(74,133,220,0.03) 440px, rgba(74,133,220,0) 1000px)',
                }} />
            </div>

            {/* ── SPLASH SCREEN — logo Destemidos ── */}
            {!splashDone && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 99999,
                    background: '#060d1a',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
                    opacity: splashLeaving ? 0 : 1,
                    transform: splashLeaving ? 'scale(1.06)' : 'scale(1)',
                    transition: 'opacity 0.6s cubic-bezier(0.4,0,1,1), transform 0.6s cubic-bezier(0.4,0,1,1)',
                    pointerEvents: splashLeaving ? 'none' : 'all',
                }}>
                    {/* Brilho de fundo */}
                    <div style={{
                        position:'absolute', width:500, height:500, borderRadius:'50%',
                        background:'radial-gradient(circle, rgba(15,76,160,0.75) 0%, rgba(30,58,138,0.45) 45%, transparent 70%)',
                        filter:'blur(60px)',
                        animation:'splash-glow 2.4s ease-in-out infinite alternate',
                    }}/>
                    {/* Só o logo — sem texto */}
                    <img
                        src={LOGO_SPLASH_URL}
                        alt="Destemidos"
                        style={{
                            height: 120, width: 'auto', objectFit: 'contain',
                            filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.35)) drop-shadow(0 4px 32px rgba(0,0,0,0.85))',
                            animation: 'splash-logo-in 0.75s cubic-bezier(0.34,1.3,0.64,1) both',
                        }}
                    />
                    <style>{`
                        @keyframes splash-logo-in { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }
                        @keyframes splash-glow    { from { opacity:0.5; transform:scale(0.85); } to { opacity:1; transform:scale(1.2); } }
                    `}</style>
                </div>
            )}

            {/* ── LOGIN SCREEN — acesso ao app, válido por 24h ── */}
            {splashDone && !loginOk && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 99998,
                    background: '#060d1a',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '24px', overflow: 'hidden',
                    animation: 'login-fade-in 0.5s ease both',
                }}>
                    <div style={{
                        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(15,76,160,0.55) 0%, rgba(30,58,138,0.30) 45%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}/>
                    <img
                        src={LOGO_SPLASH_URL}
                        alt="Destemidos"
                        style={{ position:'relative', zIndex:1, height: 76, width: 'auto', objectFit: 'contain', marginBottom: 36, filter: 'drop-shadow(0 0 28px rgba(212,175,55,0.3))' }}
                    />
                    <form
                        onSubmit={handleLoginSubmit}
                        style={{
                            position: 'relative', zIndex: 1, width: '100%', maxWidth: 340,
                            display: 'flex', flexDirection: 'column', gap: 18,
                            animation: loginShake ? 'login-shake 0.4s ease' : 'none',
                        }}
                    >
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>
                                Nome do time
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={loginTeamVisible ? 'text' : 'password'}
                                    value={loginTeam}
                                    onChange={e => { setLoginTeam(e.target.value); setLoginError(prev => ({ ...prev, team: false })); }}
                                    autoComplete="off"
                                    style={{
                                        width: '100%', padding: '14px 46px 14px 16px', borderRadius: 14, fontSize: 15, fontWeight: 600,
                                        background: 'rgba(255,255,255,0.06)', color: '#fff',
                                        border: loginError.team ? '1.5px solid #ef4444' : '1.5px solid rgba(255,255,255,0.15)',
                                        outline: 'none', transition: 'border-color 0.2s ease', boxSizing: 'border-box',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setLoginTeamVisible(v => !v)}
                                    tabIndex={-1}
                                    style={{
                                        position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)',
                                        background: 'transparent', border: 'none', padding: 4, cursor: 'pointer',
                                        color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center',
                                    }}
                                >
                                    {loginTeamVisible ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>
                                Email corretor
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={loginEmailVisible ? 'text' : 'password'}
                                    value={loginEmail}
                                    onChange={e => { setLoginEmail(e.target.value); setLoginError(prev => ({ ...prev, email: false })); }}
                                    autoComplete="off"
                                    style={{
                                        width: '100%', padding: '14px 46px 14px 16px', borderRadius: 14, fontSize: 15, fontWeight: 600,
                                        background: 'rgba(255,255,255,0.06)', color: '#fff',
                                        border: loginError.email ? '1.5px solid #ef4444' : '1.5px solid rgba(255,255,255,0.15)',
                                        outline: 'none', transition: 'border-color 0.2s ease', boxSizing: 'border-box',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setLoginEmailVisible(v => !v)}
                                    tabIndex={-1}
                                    style={{
                                        position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)',
                                        background: 'transparent', border: 'none', padding: 4, cursor: 'pointer',
                                        color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center',
                                    }}
                                >
                                    {loginEmailVisible ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                        </div>
                        {(loginError.team || loginError.email) && (
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#f87171', textAlign: 'center' }}>
                                Verifique os dados informados e tente novamente.
                            </div>
                        )}
                        <label style={{
                            display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer',
                            fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.75)', userSelect: 'none',
                        }}>
                            <input
                                type="checkbox"
                                checked={loginRemember}
                                onChange={e => setLoginRemember(e.target.checked)}
                                style={{ width: 16, height: 16, accentColor: '#4a85dc', cursor: 'pointer' }}
                            />
                            Salvar senha neste dispositivo
                        </label>
                        <button
                            type="submit"
                            style={{
                                marginTop: 6, padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer',
                                background: 'linear-gradient(90deg,#4a85dc,#4a85dc)', color: '#fff', fontWeight: 800, fontSize: 15,
                                boxShadow: '0 4px 18px rgba(37,99,235,0.45)',
                            }}
                        >
                            Entrar
                        </button>
                    </form>
                    <style>{`
                        @keyframes login-fade-in { from { opacity:0; } to { opacity:1; } }
                        @keyframes login-shake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-8px);} 40%{transform:translateX(8px);} 60%{transform:translateX(-6px);} 80%{transform:translateX(6px);} }
                    `}</style>
                </div>
            )}

            {/* Pull-to-refresh indicator */}
        <div ref={mainContainerRef}
            className={`min-h-screen font-sans pb-12 relative transition-colors duration-500 ${modoNoturno ? 'text-slate-100' : 'text-slate-800'}`}
            style={{ backgroundColor: 'transparent', backgroundImage: 'none' }}
            onMouseMove={handleGlobalDragOver}
        >
            {modoNoturno && activeBrand !== 'Utilitarios' && activeBrand !== 'Guia' && (
                <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                    <style>{`
                        @keyframes orb-a { 0%{transform:translate(0px,0px) scale(1)} 25%{transform:translate(60px,-45px) scale(1.08)} 50%{transform:translate(20px,-80px) scale(1.04)} 75%{transform:translate(-40px,-30px) scale(0.96)} 100%{transform:translate(0px,0px) scale(1)} }
                        @keyframes orb-b { 0%{transform:translate(0px,0px) scale(1)} 30%{transform:translate(-70px,55px) scale(1.07)} 60%{transform:translate(-30px,90px) scale(1.03)} 80%{transform:translate(50px,40px) scale(0.95)} 100%{transform:translate(0px,0px) scale(1)} }
                        @keyframes orb-c { 0%{transform:translate(0px,0px) scale(1)} 35%{transform:translate(50px,60px) scale(1.10)} 70%{transform:translate(-20px,40px) scale(1.05)} 100%{transform:translate(0px,0px) scale(1)} }
                        @keyframes orb-d { 0%{transform:translate(0px,0px) scale(1)} 40%{transform:translate(-55px,-50px) scale(1.06)} 70%{transform:translate(30px,-20px) scale(0.94)} 100%{transform:translate(0px,0px) scale(1)} }
                    `}</style>
                    <div style={{ position:'absolute', top:'-15%', left:'-10%', width:'62vw', height:'62vw', maxWidth:720, maxHeight:720, borderRadius:'50%', background:'radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(56,189,248,0.04) 40%, transparent 70%)', animation:'orb-a 22s ease-in-out infinite', filter:'blur(1px)' }}/>
                    <div style={{ position:'absolute', top:'15%', right:'-12%', width:'52vw', height:'52vw', maxWidth:620, maxHeight:620, borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.13) 0%, rgba(99,102,241,0.04) 42%, transparent 70%)', animation:'orb-b 28s ease-in-out infinite 4s', filter:'blur(1px)' }}/>
                    <div style={{ position:'absolute', bottom:'-12%', left:'18%', width:'56vw', height:'56vw', maxWidth:660, maxHeight:660, borderRadius:'50%', background:'radial-gradient(circle, rgba(37,99,235,0.10) 0%, rgba(37,99,235,0.03) 48%, transparent 70%)', animation:'orb-c 32s ease-in-out infinite 9s', filter:'blur(1px)' }}/>
                    <div style={{ position:'absolute', top:'-5%', right:'15%', width:'35vw', height:'35vw', maxWidth:420, maxHeight:420, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.09) 0%, rgba(139,92,246,0.02) 50%, transparent 70%)', animation:'orb-d 18s ease-in-out infinite 2s', filter:'blur(1px)' }}/>
                </div>
            )}
            {/* Ocultar scrollbar da nav de abas + centralizar no desktop */}
            <style>{`
                
                
                
                nav[aria-label="Tabs"]::-webkit-scrollbar { display: none; }
                nav[aria-label="Tabs"] { -ms-overflow-style: none; scrollbar-width: none; }
                @media (min-width: 640px) {
                    nav[aria-label="Tabs"] { justify-content: center !important; overflow-x: visible !important; flex-wrap: wrap; padding-left: 0 !important; padding-right: 0 !important; }
                }
                @media (max-width: 639px) { .main-content { padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px)); } }
                @keyframes shimmer-sweep {
                    0%   { transform: translateX(-150%) skewX(-18deg); }
                    100% { transform: translateX(280%)  skewX(-18deg); }
                }
                .group:hover .card-shimmer-sweep {
                    animation: shimmer-sweep 0.65s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
                }
                @media (hover: hover) and (pointer: fine) { .group:hover img { transform: scale(1.12) !important; } }
                .group img { transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) !important; }

                @keyframes banner-reveal-anim {
                    0%   { opacity: 0; transform: translateY(18px) scale(0.98); }
                    100% { opacity: 1; transform: translateY(0)    scale(1); }
                }
                .banner-reveal {
                    animation: banner-reveal-anim 0.7s cubic-bezier(0.25,0.46,0.45,0.94) both;
                }
                @keyframes banner-text-in-1 {
                    0%   { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes banner-text-in-2 {
                    0%   { opacity: 0; transform: translateY(14px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .banner-text-1 { animation: banner-text-in-1 0.55s 0.35s cubic-bezier(0.25,0.46,0.45,0.94) both; }
                .banner-text-2 { animation: banner-text-in-2 0.55s 0.50s cubic-bezier(0.25,0.46,0.45,0.94) both; }
            `}</style>
            {/* ── SAFE AREA + HEADER — camada única de vidro ────────────────
                Um único elemento fixed parte do top:0 (cobre o notch) e tem
                padding-top = env(safe-area-inset-top) para o conteúdo começar
                abaixo do notch. Assim backdrop-filter é UMA camada só. ───── */}

            <header
                ref={headerRef}
                className={`fixed left-0 right-0 z-30 transition-colors duration-500 header-slide-in hw-header ${headerHidden ? '' : 'hdr-shown'}`}
                style={{
                    top: headerHidden ? -(headerHeight + 24 + 60) : 'env(safe-area-inset-top, 0px)', // status bar transparente: o vidro começa abaixo dela
                    transition: 'top 0.38s cubic-bezier(0.22,1,0.36,1), background-color 0.5s, color 0.5s, border-color 0.5s',
                    position: 'fixed',
                    paddingTop: 0,
                    background: modoNoturno ? 'rgba(15,23,42,0.70)' : 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    borderBottom: modoNoturno ? '1px solid rgba(51,65,85,0.6)' : '1px solid rgba(226,232,240,0.6)',
                    boxShadow: modoNoturno ? '0 2px 8px rgba(0,0,0,0.25)' : '0 2px 8px rgba(15,23,42,0.06)',
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                }}>
                {/* MOBILE: vidro contínuo (status bar + header) em degradê que some para baixo. No PC nada muda. */}
                <div aria-hidden="true" className="sm:hidden absolute left-0 right-0 pointer-events-none" style={{ top: 0, bottom: -18,
                    background: modoNoturno
                        ? 'linear-gradient(to bottom, rgba(11,17,32,0.92) 0%, rgba(15,23,42,0.80) 60%, rgba(15,23,42,0) 100%)'
                        : 'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.80) 60%, rgba(255,255,255,0) 100%)',
                    backdropFilter: 'blur(20px) saturate(170%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(170%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 62%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, #000 0%, #000 62%, transparent 100%)',
                }} />
                <div className="w-full px-[7.2%] relative">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 sm:py-3">

                        {/* Linha 1 mobile — Logo + saudação animada */}
                        {(() => {
                            const h = new Date().getHours();
                            const saudacao =
                                h < 5  ? 'BOA MADRUGADA!' :
                                h < 12 ? 'BOM DIA!'       :
                                h < 18 ? 'BOA TARDE!'    :
                                         'BOA NOITE!';
                            const isSaud = logoPhase === 'saudacao';
                            return (
                                <div
                                    className="flex items-center justify-center sm:justify-start shrink-0 pt-3 pb-2 sm:py-0 cursor-pointer select-none"
                                    style={{ gap: logoTextCollapsed ? 0 : 12, transition: 'gap 0.5s cubic-bezier(0.4,0,0.2,1)' }}
                                    onClick={triggerLogoGreeting}
                                >
                                    <img
                                            src={LOGO_HEADER_URL}
                                            alt="Logo"
                                            className="h-10 w-auto object-contain rounded shrink-0"
                            style={{
                                                animation: isSaud ? 'logo-flip 2s ease-in-out' : 'none',
                                            }}
                                        />

                                    {/* Texto deslizante */}
                                    <div className="relative overflow-hidden" style={{
                                        minWidth: 0,
                                        flex: logoTextCollapsed ? '0 1 0px' : 1,
                                        width: logoTextCollapsed ? 0 : undefined,
                                        maxWidth: logoTextCollapsed ? 0 : 200,
                                        marginLeft: logoTextCollapsed ? 0 : undefined,
                                        opacity: logoTextCollapsed ? 0 : 1,
                                        height: 36,
                                        transition: 'max-width 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease, flex 0.5s cubic-bezier(0.4,0,0.2,1)',
                                    }}>
                                        {/* FASE logo */}
                                        <div style={{
                                            position: 'relative',
                                            transform: logoPhase === 'logo' ? (logoSlideOut ? 'translateX(-110%)' : 'translateX(0)') : 'translateX(-110%)',
                                            transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            <h1 className={`text-xl font-black tracking-widest uppercase leading-tight ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>Destemidos</h1>
                                            <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400">A sorte favorece os ousados</p>
                                        </div>

                                        {/* FASE saudação */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0, left: 0, right: 0,
                                            transform: logoPhase === 'saudacao' ? (logoSlideOut ? 'translateX(-110%)' : 'translateX(0)') : 'translateX(110%)',
                                            transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            <h1 className={`text-sm font-black tracking-widest uppercase leading-tight ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>{saudacao}</h1>
                                            <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400">Equipe Destemidos</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Busca + Botões — sempre visível, ocupa o espaço central */}
                        <div className={`flex items-center gap-2 pb-3 sm:pb-0 sm:flex-1 transition-all duration-300 ${
                            'opacity-100 max-h-20 sm:max-h-none'
                        }`}>
                            {/* Barra de pesquisa — ocupa todo espaço disponível, encolhe quando abas aparecem */}
                            <div className="relative transition-all"
                                style={{
                                    flexShrink: 0,
                                    width: stickyDesk ? '160px' : '100%',
                                    flex: stickyDesk ? '0 0 160px' : '1 1 0%',
                                    transition: 'flex 0.32s cubic-bezier(0.25,0.46,0.45,0.94), width 0.32s cubic-bezier(0.25,0.46,0.45,0.94)',
                                }}>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder={stickyDesk ? 'Buscar...' : 'Buscar por nome ou bairro...'}
                                    className={`search-input-premium block w-full pl-9 pr-3 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/30 transition-all ${
                                        modoNoturno
                                        ? 'bg-white/10 border border-white/15 text-white placeholder-white/40 focus:bg-white/15'
                                        : 'bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-slate-50'
                                    }`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* ── ABAS DESKTOP — crescem para preencher o espaço entre a busca e o botão noturno ── */}
                            {(() => {
                                const STICKY_TABS = [
                                    { id: 'Direcional',  label: 'DIR',  action: () => setActiveBrand('Direcional'), isBtn: true },
                                    { id: 'Riva',        label: 'RIVA', action: () => setActiveBrand('Riva'),        isBtn: true },
                                    { id: 'Tabelas',     label: 'TABELAS', action: () => setShowTabelasModal(true),  isBtn: true },
                                    { id: 'Calcular',    label: 'CALC ▾',  action: (e) => openGroupMenu('Calcular', e),    isBtn: true, members: ['TabelaDireta', 'Calculadora', 'Simulador', 'PlanilhaTD'] },
                                    { id: 'Documentos',  label: 'DOCS ▾',  action: (e) => openGroupMenu('Documentos', e),  isBtn: true, members: ['Utilitarios', 'GerarCpf'] },
                                    { id: 'Guia',        label: 'GUIA', action: () => setActiveBrand('Guia'),        isBtn: true },
                                ];
                                return (
                                    <div className="hidden sm:flex items-center justify-between"
                                        style={{
                                            flex: tabsSticky ? '1 1 0%' : '0 0 0px',
                                            minWidth: 0,
                                            overflow: 'hidden',
                                            opacity: tabsSticky ? 1 : 0,
                                            pointerEvents: tabsSticky ? 'auto' : 'none',
                                            transition: 'flex 0.32s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.25s ease',
                                            gap: 4,
                                        }}>
                                        {STICKY_TABS.map((tab) => {
                                            const isActive = activeBrand === tab.id || (groupMenu && groupMenu.id === tab.id) || (tab.members || []).includes(activeBrand);
                                            const tabStyle = {
                                                borderRadius: 999,
                                                height: 42, paddingTop: 0, paddingBottom: 0,
                                                flex: '1 1 0%',
                                                cursor: 'pointer', textDecoration: 'none',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                whiteSpace: 'nowrap', minWidth: 0,
                                                transition: 'background 0.22s ease, border-color 0.22s ease',
                                                background: isActive
                                                    ? (modoNoturno ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.08)')
                                                    : (modoNoturno ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.04)'),
                                                border: isActive
                                                    ? (modoNoturno ? '1px solid rgba(255,255,255,0.24)' : '1px solid rgba(15,23,42,0.12)')
                                                    : (modoNoturno ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(15,23,42,0.06)'),
                                                boxShadow: 'none',
                                            };
                                            const labelColor = isActive
                                                ? (modoNoturno ? '#ffffff' : '#334155')
                                                : (modoNoturno ? 'rgba(255,255,255,0.48)' : 'rgba(15,23,42,0.48)');
                                            return tab.isBtn ? (
                                                <button key={tab.id} className={`hw-tab${isActive ? ' hw-tab-active' : ''}`} onClick={(e) => { haptic(); captureZoomOrigin(e); tab.action(e); }} style={tabStyle}>
                                                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', color: labelColor, transition: 'color 0.22s' }}>{tab.label}</span>
                                                </button>
                                            ) : (
                                                <a key={tab.id} href={tab.href} target="_blank" rel="noopener noreferrer" className={`hw-tab${isActive ? ' hw-tab-active' : ''}`} style={tabStyle}>
                                                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', color: labelColor, transition: 'color 0.22s' }}>{tab.label}</span>
                                                </a>
                                            );
                                        })}
                                    </div>
                                );
                            })()}

                            

                            {/* Botão dividido translúcido: Pasta (cria) + Câmera (foto direto, lado mais escuro) */}
                            <div className={`shrink-0 inline-flex items-stretch h-[42px] rounded-full overflow-hidden border transition-all duration-300 ${
                                    modoNoturno
                                    ? 'bg-white/10 border-white/15 text-slate-200'
                                    : 'bg-slate-100 border-slate-200 text-slate-600'
                                }`}
                                style={{ boxShadow: modoNoturno ? '0 1px 2px rgba(0,0,0,0.15)' : '0 1px 2px rgba(15,23,42,0.05)' }}>
                                <button
                                    onClick={(e) => { haptic('medium'); captureZoomOrigin(e); setFolderSource('manual'); setIsCreatingFolder(true); setIsChatOpen(true); setTimeout(() => fileInputRef.current?.click(), 100); }}
                                    className="inline-flex items-center gap-[7px] pl-3.5 pr-3 text-[14px] font-bold active:opacity-80"
                                    style={{ background: 'transparent', border: 'none', WebkitTapHighlightColor: 'transparent' }}
                                    title="Nova pasta" aria-label="Nova pasta"
                                >
                                    <FolderOpen size={18} strokeWidth={2.2} />
                                    <span>Pasta</span>
                                </button>
                                {(typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) && (
                                <button
                                    onClick={(e) => { haptic('medium'); captureZoomOrigin(e); setFolderSource('manual'); setIsCreatingFolder(true); setIsChatOpen(true); abrirCamera(); }}
                                    className="inline-flex items-center justify-center w-[42px] active:opacity-80"
                                    style={{ background: modoNoturno ? 'rgba(0,0,0,0.22)' : 'rgba(15,23,42,0.08)', border: 'none', borderLeft: modoNoturno ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(15,23,42,0.10)', WebkitTapHighlightColor: 'transparent' }}
                                    title="Tirar foto" aria-label="Tirar foto"
                                >
                                    <IgCamera size={21} strokeWidth={2.4} />
                                </button>
                                )}
                            </div>

                            

                            <button
                                onClick={() => { haptic('medium'); const novo = !modoNoturno; setModoNoturno(novo); localStorage.setItem('modoNoturno', novo); }}
                                className={`shrink-0 p-2.5 rounded-full border transition-all duration-300 hover:scale-105 ${
                                    modoNoturno
                                    ? 'bg-white/10 border-white/15 text-slate-200 hover:bg-white/20'
                                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                                }`}
                                style={{ boxShadow: modoNoturno ? '0 1px 2px rgba(0,0,0,0.15)' : '0 1px 2px rgba(15,23,42,0.05)' }}
                                title={modoNoturno ? "Ativar Modo Claro" : "Ativar Modo Noturno"}
                            >
                                {modoNoturno ? <Sun size={20} /> : <Moon size={20} />}
                            </button>


                        </div>

                    </div>
                </div>

            </header>

            {/* ── DOCK INFERIOR MOBILE (estilo Instagram, liquid glass) — recolhe ao rolar pra baixo; último botão (sanduíche) abre a sidebar direita ── */}
            {(() => {
                const dockMain = [
                    { id: 'Direcional', label: 'Direcional', letter: 'D', action: () => setActiveBrand('Direcional') },
                    { id: 'Riva',       label: 'Riva',       letter: 'R', action: () => setActiveBrand('Riva') },
                    { id: 'Camera',     label: 'Tirar foto', Icon: IgCamera, transient: true, action: () => { setFolderSource('manual'); setIsCreatingFolder(true); setIsChatOpen(true); abrirCamera(); } },
                    { id: 'Tabelas',    label: 'Tabelas',    Icon: TableProperties, action: () => setShowTabelasModal(true), transient: true },
                ];
                const dockMoreSections = [
                    { title: 'Calcular', items: [
                        { id: 'TabelaDireta', label: 'Tabela Direta',   Icon: TableProperties, action: () => setShowCalculadoraTabelaDiretaModal(true) },
                        { id: 'Calculadora',  label: 'Calcular ITBI',   Icon: Calculator,      action: () => setShowCalculadoraItbiModal(true) },
                        { id: 'PlanilhaTD',   label: 'Planilha TD',     Icon: FileSpreadsheet, action: () => window.open('https://docs.google.com/spreadsheets/d/1dHU0XB_GuGE-APGPvqQ6IONnw6iMmzo6z5GrrnRCiRc/edit?usp=sharing', '_blank', 'noopener,noreferrer') },
                        { id: 'Simulador',    label: 'Simulador Caixa', Icon: Landmark,        action: () => window.open('https://simuladorhabitacao.caixa.gov.br/home', '_blank', 'noopener,noreferrer') },
                    ] },
                    { title: 'Documentos', items: [
                        { id: 'Utilitarios',  label: 'Utilitários',     Icon: BookMarked,      action: () => setActiveBrand('Utilitarios') },
                        { id: 'GerarCpf',     label: 'Gerar CPF',       Icon: CreditCard,      action: handleGerarCpfNav },
                    ] },
                    { title: 'Ajuda', items: [
                        { id: 'Guia',         label: 'Guia',            Icon: HelpCircle,      action: () => setActiveBrand('Guia') },
                    ] },
                ];
                const ink = modoNoturno ? '#ffffff' : '#0f172a';
                const inkSoft = modoNoturno ? 'rgba(255,255,255,0.72)' : 'rgba(15,23,42,0.68)';
                const activeBg = modoNoturno ? 'rgba(255,255,255,0.20)' : 'rgba(15,23,42,0.10)';
                const itemStyle = (active) => ({
                    position: 'relative', zIndex: 1,
                    flex: 1, height: 54, borderRadius: 999, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'transparent',
                    color: active ? ink : inkSoft,
                    transition: 'color 0.25s ease, transform 0.15s ease',
                    WebkitTapHighlightColor: 'transparent',
                });
                const tapDock = (id, action, transient) => (e) => {
                    haptic(); captureZoomOrigin(e);
                    if (transient) { setDockTransient(id); setTimeout(() => setDockTransient(null), 650); }
                    action();
                };
                return (
                    <>
                        <div className="sm:hidden" style={{
                            position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40,
                            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                            pointerEvents: 'none',
                            transform: (dockVisible || showMoreDrawer) ? 'translateY(0)' : 'translateY(calc(100% + 24px))',
                            transition: 'transform 0.42s cubic-bezier(0.22,1,0.36,1)',
                        }}>
                            <nav ref={dockNavRef} className="hw-dock liquid-glass" aria-label="Menu principal" style={{
                                pointerEvents: 'auto', position: 'relative',
                                margin: '0 12px 8px', padding: 6, display: 'flex', alignItems: 'center', gap: 2,
                                borderRadius: 999,
                            }}>
                                {/* pílula de vidro que desliza até o botão tocado */}
                                <span aria-hidden="true" className="hw-dock-pill" style={{
                                    position: 'absolute', top: 6, bottom: 6, left: 0, width: dockPillStyle.width,
                                    transform: `translateX(${dockPillStyle.left}px)`,
                                    opacity: dockPillStyle.opacity,
                                    borderRadius: 999,
                                    background: activeBg,
                                    boxShadow: modoNoturno
                                        ? 'inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(255,255,255,0.06), 0 4px 14px rgba(0,0,0,0.25)'
                                        : 'inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 14px rgba(15,23,42,0.12)',
                                    transition: 'transform 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.2s ease',
                                    willChange: 'transform',
                                    pointerEvents: 'none', zIndex: 0,
                                }} />
                                {dockMain.map(({ id, label, letter, Icon, action, transient }) => {
                                    const active = dockTarget === id;
                                    return (
                                        <button key={id} ref={el => { dockTabRefs.current[id] = el; }} aria-label={label} title={label}
                                            className={`hw-dock-item${active ? ' hw-dock-item-active' : ''}`}
                                            style={itemStyle(active)}
                                            onClick={tapDock(id, action, transient)}>
                                            {letter
                                                ? <span style={{ fontSize: 25, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}>{letter}</span>
                                                : <Icon size={26} strokeWidth={active ? 2.4 : 2} />}
                                        </button>
                                    );
                                })}
                                <button ref={el => { dockTabRefs.current['menu'] = el; }} aria-label="Menu" title="Menu"
                                    className={`hw-dock-item${dockTarget === 'menu' ? ' hw-dock-item-active' : ''}`}
                                    style={itemStyle(dockTarget === 'menu')}
                                    onClick={() => { haptic(); setShowMoreDrawer(true); }}>
                                    <Menu size={27} strokeWidth={dockTarget === 'menu' ? 2.5 : 2.1} />
                                </button>
                            </nav>
                        </div>

                        {/* Sidebar direita — demais opções */}
                        <div className="sm:hidden" aria-hidden={!showMoreDrawer} style={{
                            position: 'fixed', inset: 0, zIndex: 75,
                            pointerEvents: showMoreDrawer ? 'auto' : 'none',
                        }}>
                            <div onClick={() => setShowMoreDrawer(false)} style={{
                                position: 'absolute', inset: 0,
                                background: 'rgba(5,6,12,0.55)',
                                backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                                opacity: showMoreDrawer ? 1 : 0, transition: 'opacity 0.3s ease',
                            }} />
                            <aside className="hw-drawer" style={{
                                position: 'absolute', top: 0, right: 0, bottom: 0,
                                width: 'min(82vw, 320px)',
                                paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                                display: 'flex', flexDirection: 'column',
                                transform: showMoreDrawer ? 'translateX(0)' : 'translateX(105%)',
                                transition: 'transform 0.38s cubic-bezier(0.22,1,0.36,1)',
                                background: modoNoturno ? 'rgba(18,18,24,0.94)' : 'rgba(255,255,255,0.96)',
                                backdropFilter: 'blur(28px) saturate(180%)', WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                                borderLeft: modoNoturno ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.08)',
                                borderRadius: '28px 0 0 28px',
                                boxShadow: '-16px 0 48px rgba(0,0,0,0.35)',
                                color: ink,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 12px' }}>
                                    <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em' }}>Mais opções</span>
                                    <button aria-label="Fechar" onClick={() => setShowMoreDrawer(false)}
                                        style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeBg, color: ink }}>
                                        <X size={18} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '4px 12px 16px', overflowY: 'auto' }}>
                                    {dockMoreSections.map((sec) => (<React.Fragment key={sec.title}>
                                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '10px 8px 2px', color: inkSoft }}>{sec.title}</div>
                                    {sec.items.map(({ id, label, Icon, action }) => {
                                        const active = activeBrand === id;
                                        return (
                                            <button key={id} className={`hw-drawer-item${active ? ' hw-drawer-item-active' : ''}`}
                                                onClick={(e) => { haptic(); captureZoomOrigin(e); setShowMoreDrawer(false); action(); }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '16px 14px',
                                                    borderRadius: 18, border: 'none', cursor: 'pointer', textAlign: 'left',
                                                    background: active ? activeBg : (modoNoturno ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)'),
                                                    color: ink, fontSize: 16, fontWeight: 700,
                                                }}>
                                                <span style={{ width: 42, height: 42, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeBg, flexShrink: 0 }}>
                                                    <Icon size={20} />
                                                </span>
                                                <span style={{ flex: 1 }}>{label}</span>
                                                <ChevronRight size={18} style={{ opacity: 0.45 }} />
                                            </button>
                                        );
                                    })}
                                    </React.Fragment>))}
                                </div>
                            </aside>
                        </div>
                    </>
                );
            })()}

            {/* ── MENUS AGRUPADOS (Calcular / Documentos): balão no desktop, folha no celular ── */}
            {groupMenu && (() => {
                const cfg = GRUPOS_MENU[groupMenu.id];
                if (!cfg) return null;
                const dark = modoNoturno;
                const ink = dark ? '#ffffff' : '#0f172a';
                const inkSoft = dark ? 'rgba(255,255,255,0.55)' : 'rgba(15,23,42,0.5)';
                const iconBg = dark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.07)';
                const ICONS = { calc: Calculator, table: TableProperties, bank: Landmark, book: BookMarked, id: CreditCard, sheet: FileSpreadsheet };
                const ACOES = {
                    itbi: () => setShowCalculadoraItbiModal(true),
                    tabelaDireta: () => setShowCalculadoraTabelaDiretaModal(true),
                    tabelas: () => setShowTabelasModal(true),
                    utilitarios: () => setActiveBrand('Utilitarios'),
                    cpf: handleGerarCpfNav,
                };
                const runItem = (it) => {
                    haptic();
                    setGroupMenu(null);
                    if (it.url) window.open(it.url, '_blank', 'noopener,noreferrer');
                    else if (it.acao && ACOES[it.acao]) ACOES[it.acao]();
                };
                const mobile = groupMenu.mobile;
                const panelBase = {
                    background: dark ? 'rgba(40,40,46,0.52)' : 'rgba(255,255,255,0.58)',
                    backdropFilter: 'blur(22px) saturate(160%)', WebkitBackdropFilter: 'blur(22px) saturate(160%)',
                    willChange: 'transform, opacity', transform: 'translateZ(0)',
                    border: dark ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(255,255,255,0.7)',
                    boxShadow: dark ? 'inset 0 1px 0 rgba(255,255,255,0.12)' : 'inset 0 1px 0 rgba(255,255,255,0.9)',
                    color: ink,
                };
                let panelStyle;
                if (mobile) {
                    panelStyle = {
                        ...panelBase, position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 91,
                        borderRadius: '24px 24px 0 0', borderBottom: 'none',
                        padding: '8px 10px calc(16px + env(safe-area-inset-bottom, 0px))',
                        maxHeight: '82vh', overflowY: 'auto',
                        boxShadow: (dark ? 'inset 0 1px 0 rgba(255,255,255,0.12), ' : 'inset 0 1px 0 rgba(255,255,255,0.9), ') + '0 -12px 40px rgba(0,0,0,0.30)',
                        animation: 'gmSheet 0.34s cubic-bezier(0.22,1,0.36,1)',
                    };
                } else {
                    const W = 300;
                    const r = groupMenu.rect || { left: 0, width: 0, top: 0, bottom: 0 };
                    const vw = window.innerWidth, vh = window.innerHeight;
                    const left = Math.max(12, Math.min(r.left + r.width / 2 - W / 2, vw - W - 12));
                    const above = r.top > vh * 0.5;
                    panelStyle = {
                        ...panelBase, position: 'fixed', left, width: W, zIndex: 91, borderRadius: 20, padding: 6,
                        ...(above ? { bottom: vh - r.top + 10, maxHeight: Math.max(160, r.top - 24) } : { top: r.bottom + 10, maxHeight: Math.max(160, vh - r.bottom - 24) }),
                        overflowY: 'auto',
                        boxShadow: dark ? 'inset 0 1px 0 rgba(255,255,255,0.12), 0 18px 48px rgba(0,0,0,0.45)' : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 18px 48px rgba(15,23,42,0.18)',
                        animation: above ? 'gmPopUp 0.2s cubic-bezier(0.22,1,0.36,1)' : 'gmPopDown 0.2s cubic-bezier(0.22,1,0.36,1)',
                    };
                }
                return (
                    <>
                        <div onClick={() => setGroupMenu(null)} style={{
                            position: 'fixed', inset: 0, zIndex: 90,
                            background: mobile ? 'rgba(0,0,0,0.32)' : 'transparent',
                            animation: mobile ? 'gmFade 0.25s ease' : 'none',
                        }} />
                        <div role="menu" aria-label={cfg.title} style={panelStyle}>
                            {mobile && (
                                <>
                                    <div style={{ width: 36, height: 4, borderRadius: 2, background: dark ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.18)', margin: '2px auto 10px' }} />
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 4px' }}>
                                        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em' }}>{cfg.title}</span>
                                        <button aria-label="Fechar" onClick={() => setGroupMenu(null)} style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: iconBg, color: ink }}>
                                            <X size={18} />
                                        </button>
                                    </div>
                                </>
                            )}
                            {cfg.sections.map((sec, si) => (
                                <div key={si}>
                                    {sec.label && (
                                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: inkSoft, padding: '10px 10px 4px' }}>{sec.label}</div>
                                    )}
                                    {sec.items.map((it) => {
                                        const Ic = ICONS[it.icon] || TableProperties;
                                        return (
                                            <button key={it.id} role="menuitem" className="gm-item" onClick={() => runItem(it)}
                                                style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: mobile ? '11px 10px' : '9px 10px', borderRadius: 14, border: 'none', cursor: 'pointer', textAlign: 'left', background: 'transparent', color: ink }}>
                                                <span style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: iconBg, flexShrink: 0 }}>
                                                    <Ic size={18} />
                                                </span>
                                                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{it.label}</span>
                                                {it.url && <ExternalLink size={15} style={{ opacity: 0.45, flexShrink: 0 }} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </>
                );
            })()}



            <main className="main-content w-full" style={{ '--gutter': 'clamp(14px, 3.2vw, 56px)', paddingTop: `${headerHeight}px`, paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)' }}>
                {/* BANNER INSPIRAÇÃO DIÁRIA */}
                {/* ── BANNER + ABAS ── */}
                <div className="relative banner-reveal hw-hero" style={{
                    borderRadius: 24,
                    clipPath: 'inset(0 round 24px)',
                    marginTop: 16,
                    marginBottom: 15,
                    marginLeft: 0,
                    marginRight: 0,
                }}>
                    {heroFase === 'video' && videoDoPeriodo ? (
                        <video
                            key={`video-${periodo}`}
                            ref={heroVideoRef}
                            src={videoDoPeriodo}
                            poster={imagemDoDia}
                            autoPlay
                            muted
                            playsInline
                            preload="auto"
                            disablePictureInPicture
                            controls={false}
                            aria-label="Equipe Destemidos"
                            onLoadedData={(e) => {
                                if (heroPausadoPorScroll.current) return;
                                const pr = e.target.play();
                                if (pr && pr.catch) pr.catch((err) => console.warn('[Destemidos] autoplay do vídeo do hero bloqueado:', err));
                            }}
                            onEnded={() => setHeroFase('foto')}
                            onError={(e) => {
                                const er = e.target.error;
                                console.warn('[Destemidos] vídeo do hero não carregou (código ' + (er && er.code) + '): ' + (er && er.message), videoDoPeriodo);
                                setHeroFase('foto');
                            }}
                            className="w-full h-screen sm:h-screen object-cover bg-slate-200"
                            style={{ objectPosition: `center ${bannerFocusY}`, display: 'block', maxHeight: '560px', pointerEvents: 'none' }}
                        />
                    ) : (
                        <img key={`foto-${periodo}`} src={imagemDoDia} fetchpriority="high" loading="eager" decoding="async" onError={(e) => { e.target.src = '' }} alt="Equipe Destemidos" className="w-full h-screen sm:h-screen object-cover bg-slate-200 banner-ken-burns" style={{ objectPosition: `center ${bannerFocusY}`, display: 'block', maxHeight: '560px', animation: heroFase === 'foto' && videoDoPeriodo ? 'heroFotoIn 0.6s ease both' : undefined }} />
                    )}
                    {/* Camada 1: blur progressivo de baixo pra cima */}
                    {!(heroFase === 'video' && videoDoPeriodo) && (
                    <div className="absolute inset-0 pointer-events-none" style={{
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                        maskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 62%)',
                        WebkitMaskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 62%)',
                    }}/>
                    )}
                    {/* Camada 2: escurecimento vertical (base) — concentrado perto do texto */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.42) 26%, rgba(0,0,0,0.08) 48%, transparent 66%)',
                    }}/>
                    {/* Camada 3: gradiente cinematográfico vindo da esquerda, mascarado para não subir sobre os rostos */}
                    <div className="absolute inset-0 pointer-events-none hw-left-grad" style={{
                        background: 'linear-gradient(90deg, rgba(5,15,30,0.90) 0%, rgba(7,22,45,0.66) 26%, rgba(5,15,30,0.20) 55%, rgba(0,0,0,0.04) 100%)',
                        maskImage: 'linear-gradient(to top, black 0%, black 40%, rgba(0,0,0,0.45) 58%, transparent 80%)',
                        WebkitMaskImage: 'linear-gradient(to top, black 0%, black 40%, rgba(0,0,0,0.45) 58%, transparent 80%)',
                    }}/>
                    {/* Camada 4: glow azul sutil, canto inferior/esquerdo, para profundidade */}
                    <div className="absolute inset-0 pointer-events-none hw-blue-glow" style={{
                        background: 'radial-gradient(ellipse 55% 42% at 6% 100%, rgba(37,99,235,0.28) 0%, rgba(37,99,235,0.10) 45%, transparent 72%)',
                    }}/>
                    {/* Conteúdo */}
                    <div className="absolute inset-0 flex flex-col justify-end" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                        <div className="px-4 sm:px-8 pt-8 sm:pt-12">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4 banner-text-1">
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.92)',
                                    padding: '7px 14px',
                                    borderRadius: 999,
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    backdropFilter: 'blur(14px)',
                                    WebkitBackdropFilter: 'blur(14px)',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.20)',
                                }}>
                                    <Star size={12} style={{ fill: 'rgba(255,255,255,0.85)', color: 'rgba(255,255,255,0.85)' }} /> Inspiração do Dia
                                </span>
                            </div>
                            <div className="banner-text-2">
                                {(() => {
                                    // Divide a frase do dia em título (1ª sentença) e subtítulo (restante), sem alterar o conteúdo original.
                                    const textoCompleto = fraseDoDia.texto || '';
                                    const splitMatch = textoCompleto.match(/^(.*?[.!?])(?:\s+(.*))?$/s);
                                    const tituloTexto = splitMatch ? splitMatch[1] : textoCompleto;
                                    const subtituloTexto = splitMatch && splitMatch[2] ? splitMatch[2] : '';

                                    // Renderiza o título destacando em azul a parte marcada entre aspas simples;
                                    // se o texto não tiver aspas, destaca automaticamente a última palavra (padrão editorial iOS).
                                    const renderTitulo = (texto) => {
                                        if (/'[^']*'/.test(texto)) {
                                            return texto.split(/('[^']*')/g).map((parte, i) =>
                                                /^'[^']*'$/.test(parte)
                                                    ? <strong key={i} style={{ fontWeight: 800, color: '#5b9bff' }}>{parte.replace(/'/g, '')}</strong>
                                                    : <React.Fragment key={i}>{parte}</React.Fragment>
                                            );
                                        }
                                        const partes = texto.split(/(\s+)/);
                                        let lastWordIdx = -1;
                                        for (let i = partes.length - 1; i >= 0; i--) {
                                            if (partes[i].trim().length > 0) { lastWordIdx = i; break; }
                                        }
                                        return partes.map((parte, i) =>
                                            i === lastWordIdx
                                                ? <strong key={i} style={{ fontWeight: 800, color: '#5b9bff' }}>{parte}</strong>
                                                : <React.Fragment key={i}>{parte}</React.Fragment>
                                        );
                                    };

                                    return (
                                        <>
                                            <h2 style={{
                                                fontWeight: 800,
                                                fontSize: 'clamp(20px, 3vw, 32px)',
                                                lineHeight: 1.18,
                                                letterSpacing: '-0.015em',
                                                color: '#ffffff',
                                                margin: 0,
                                                textShadow: '0 2px 18px rgba(0,0,0,0.35)',
                                                maxWidth: 560,
                                            }}>
                                                {renderTitulo(tituloTexto)}
                                            </h2>
                                            {subtituloTexto && (
                                                <p style={{
                                                    fontWeight: 400,
                                                    fontSize: 'clamp(13px, 1.7vw, 15.5px)',
                                                    lineHeight: 1.5,
                                                    letterSpacing: '-0.005em',
                                                    color: 'rgba(255,255,255,0.68)',
                                                    margin: '8px 0 0',
                                                    maxWidth: 460,
                                                }}>
                                                    {subtituloTexto}
                                                </p>
                                            )}
                                        </>
                                    );
                                })()}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 14 }}>
                                    <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#5b9bff', opacity: 0.7, flexShrink: 0 }} />
                                    <p style={{
                                        fontSize: 10,
                                        fontWeight: 600,
                                        color: 'rgba(255,255,255,0.38)',
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        margin: 0,
                                    }}>{fraseDoDia.autor}</p>
                                </div>
                            </div>
                        </div>
                        {/* Abas maiores com destaque glass — Dock Effect */}
                        <div className="mt-4 sm:mt-6 pb-5">
                            {(() => {
                                const TABS = [
                                    { id: 'Direcional',  label: 'DIRECIONAL', icon: <span style={{width:5,height:5,borderRadius:2,background:'rgba(255,255,255,0.7)',flexShrink:0,display:'inline-block'}}/>, action: () => setActiveBrand('Direcional'), isBtn: true },
                                    { id: 'Riva',        label: 'RIVA',        icon: <span style={{width:5,height:5,borderRadius:2,background:'rgba(255,255,255,0.7)',flexShrink:0,display:'inline-block'}}/>, action: () => setActiveBrand('Riva'),        isBtn: true },
                                    { id: 'Tabelas',     label: 'TABELAS',     icon: <TableProperties size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, action: () => setShowTabelasModal(true), isBtn: true },
                                    { id: 'Calcular',   label: 'CALCULAR',   icon: <ChevronDown size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, action: (e) => openGroupMenu('Calcular', e),   isBtn: true, members: ['TabelaDireta', 'Calculadora', 'Simulador', 'PlanilhaTD'] },
                                    { id: 'Documentos', label: 'DOCUMENTOS', icon: <ChevronDown size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, action: (e) => openGroupMenu('Documentos', e), isBtn: true, members: ['Utilitarios', 'GerarCpf'] },
                                    { id: 'Guia',        label: 'GUIA',        icon: <HelpCircle size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, action: () => setActiveBrand('Guia'),        isBtn: true },
                                ];
                                const getDockPadding = (idx) => {
                                    if (hoveredTabIdx === null) return { paddingTop: 9, paddingBottom: 9, paddingLeft: 16, paddingRight: 16 };
                                    const dist = Math.abs(idx - hoveredTabIdx);
                                    if (dist === 0) return { paddingTop: 13, paddingBottom: 13, paddingLeft: 22, paddingRight: 22 };
                                    if (dist === 1) return { paddingTop: 11, paddingBottom: 11, paddingLeft: 19, paddingRight: 19 };
                                    return { paddingTop: 9, paddingBottom: 9, paddingLeft: 16, paddingRight: 16 };
                                };
                                const getDockFontSize = (idx) => {
                                    if (hoveredTabIdx === null) return 12;
                                    const dist = Math.abs(idx - hoveredTabIdx);
                                    if (dist === 0) return 13.5;
                                    if (dist === 1) return 12.5;
                                    return 12;
                                };
                                return (
                                    <nav ref={bannerNavRef} className="flex gap-1 items-end" aria-label="Tabs"
                                        style={{ position: 'relative', overflowX: 'auto', overflowY: 'visible', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingLeft: 16, paddingRight: 16, paddingBottom: 4, justifyContent: 'safe center' }}>
                                        {TABS.map((tab, idx) => {
                                            const isActive = activeBrand === tab.id || (groupMenu && groupMenu.id === tab.id) || (tab.members || []).includes(activeBrand);
                                            const dockPad = getDockPadding(idx);
                                            const dockFs  = getDockFontSize(idx);
                                            const isHovered = hoveredTabIdx === idx;
                                            const style = {
                                                position: 'relative', zIndex: 1,
                                                borderRadius: 999, ...dockPad, cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, scrollSnapAlign: 'start', whiteSpace: 'nowrap',
                                                transition: 'padding 0.30s cubic-bezier(0.25,0.46,0.45,0.94), background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
                                                backdropFilter: 'blur(14px)',
                                                WebkitBackdropFilter: 'blur(14px)',
                                                background: isActive
                                                    ? (isHovered ? 'rgba(66,133,244,0.42)' : 'rgba(66,133,244,0.30)')
                                                    : tab.accent ? (isHovered ? 'rgba(66,133,244,0.40)' : 'rgba(66,133,244,0.26)')
                                                    : (isHovered ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.08)'),
                                                border: isActive
                                                    ? '1px solid rgba(120,170,255,0.22)'
                                                    : (isHovered ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(255,255,255,0.05)'),
                                                boxShadow: isActive
                                                    ? '0 4px 14px rgba(37,99,235,0.22), inset 0 1px 0 rgba(255,255,255,0.10)'
                                                    : '0 2px 10px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.06)',
                                            };
                                            const inner = (
                                                <>
                                                    <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif', fontSize: dockFs, fontWeight:700, letterSpacing:'0.04em', color:'#fff', opacity: (isActive || tab.accent) ? 1 : 0.55, transition:'font-size 0.30s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.22s' }}>{tab.label}</span>
                                                    <span style={{ opacity: isActive ? 0.9 : 0.4, transition:'opacity 0.22s', display:'flex', alignItems:'center' }}>{tab.icon}</span>
                                                </>
                                            );
                                            const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;
                                            const dockHandlers = {
                                                onMouseEnter: (e) => {
                                                    if (isTouchDevice()) return;
                                                    setHoveredTabIdx(idx);
                                                },
                                                onMouseLeave: () => {
                                                    if (isTouchDevice()) return;
                                                    setHoveredTabIdx(null);
                                                },
                                            };
                                            return tab.isBtn ? (
                                                <button key={tab.id} ref={tabRefs[tab.id]} className={`hw-tab${isActive ? ' hw-tab-active' : ''}`} onClick={(e) => { haptic(); captureZoomOrigin(e); tab.action(e); }} style={style} {...dockHandlers}>{inner}</button>
                                            ) : (
                                                <a key={tab.id} href={tab.href} target="_blank" rel="noopener noreferrer" className={`hw-tab${isActive ? ' hw-tab-active' : ''}`} style={style} {...dockHandlers}>{inner}</a>
                                            );
                                        })}
                                    </nav>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* ── CONTEÚDO EM TELA CHEIA (sem painel/moldura) ── */}
                <div style={{
                    marginTop: 0,
                    marginBottom: 'clamp(12px, 2.4vw, 24px)',
                    paddingTop: 12,
                }}>
                {/* ── FAIXA RANKING — cabeçalho + painel integrado ── */}
                <style>{`
                    .rank-cards-panel {
                        display: grid;
                        grid-template-rows: 0fr;
                        transition: grid-template-rows 0.40s cubic-bezier(0.22,1,0.36,1);
                        overflow: hidden;
                    }
                    .rank-cards-panel.open {
                        grid-template-rows: 1fr;
                    }
                    .rank-cards-panel-inner { min-height: 0; }
                    .rank-strip-wrap { display: none; }
                    @media (min-width: 640px) { .rank-strip-wrap { display: block; } }
                `}</style>

                {/* rankings só aparecem fora de Guia e Utilitários */}
                {activeBrand !== 'Guia' && activeBrand !== 'Utilitarios' && (
                <div className="rank-strip-wrap">
                <div style={{ marginBottom: 16 }}>
                    {/* painel com os cards — sempre visível, sem barra de toggle */}
                    <div className="rank-cards-panel open">
                        <div className="rank-cards-panel-inner">
                            <div style={{ display: 'flex', gap: 12, paddingTop: 12, flexWrap: 'wrap' }}>
                                {[
                                    { full: 'DIAMANTE', color: '#4a85dc', icon: Gem,     rows: [['% Pro soluto', '25%'], ['Máx. de renda mensal', '50%'], ['Comp. de renda pro soluto', '20%']] },
                                    { full: 'OURO',     color: '#eab308', icon: Hexagon, rows: [['% Pro soluto', '20%'], ['Máx. de renda mensal', '50%'], ['Comp. de renda pro soluto', '20%']] },
                                    { full: 'PRATA',    color: '#94a3b8', icon: Hexagon, rows: [['% Pro soluto', '18%'], ['Máx. de renda mensal', '48%'], ['Comp. de renda pro soluto', '18%']] },
                                    { full: 'BRONZE',   color: '#3b82f6', icon: Hexagon, rows: [['% Pro soluto', '15%'], ['Máx. de renda mensal', '45%'], ['Comp. de renda pro soluto', '15%']] },
                                    { full: 'AÇO',      color: '#64748b', icon: Hexagon, rows: [['% Pro soluto', '12%'], ['Máx. de renda mensal', '40%'], ['Comp. de renda pro soluto', '10%']] },
                                ].map((r, i) => {
                                    const Icon = r.icon;
                                    return (
                                        <div key={r.full} className="hw-rank-card" data-tier={r.full} style={{
                                            position: 'relative', overflow: 'hidden',
                                            flex: '1 1 180px', minWidth: 160,
                                            borderRadius: 20, padding: '16px 18px',
                                            background: modoNoturno ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                                            border: modoNoturno ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(15,23,42,0.08)',
                                            boxShadow: modoNoturno ? '0 1px 3px rgba(0,0,0,0.30)' : '0 1px 3px rgba(15,23,42,0.08)',
                                        }}>
                                            {/* ícone marca d'água */}
                                            <Icon size={64} strokeWidth={1.2} style={{ position: 'absolute', right: -10, bottom: -12, color: r.color, opacity: 0.12, pointerEvents: 'none' }}/>

                                            {/* cabeçalho */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, position: 'relative' }}>
                                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: r.color, flexShrink: 0 }}/>
                                                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', color: modoNoturno ? '#fff' : '#1e293b' }}>{r.full}</span>
                                            </div>

                                            {/* métricas */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
                                                {r.rows.map(([lbl, val]) => (
                                                    <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                                                        <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '.02em', textTransform: 'uppercase', color: modoNoturno ? 'rgba(255,255,255,.35)' : 'rgba(15,23,42,.38)', whiteSpace: 'nowrap' }}>{lbl}</span>
                                                        <span style={{ fontSize: 13, fontWeight: 800, color: modoNoturno ? '#fff' : '#1e293b', whiteSpace: 'nowrap' }}>{val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                )}{/* /rank-strip-wrap */}

                {(activeBrand === 'Direcional' || activeBrand === 'Riva') && (
                    <>
                        <style>{`
                            .cat-scroller { display:flex; gap:16px; overflow-x:auto; scroll-snap-type:x proximity; scrollbar-width:none; padding:8px var(--gutter, 4px) 14px; margin:0 calc(var(--gutter, 4px) * -1); scroll-padding-left:var(--gutter, 4px); -webkit-overflow-scrolling:touch; }
                            .cat-scroller::-webkit-scrollbar { display:none; }
                            .cat-item { flex:0 0 clamp(250px, 72vw, 300px); scroll-snap-align:start; }
                            @media (max-width: 639px) {
                                .cat-scroller { --card-w: clamp(250px, 72vw, 300px); scroll-snap-type:x mandatory; scroll-padding:0; padding-left: calc(50% - var(--card-w) / 2); padding-right: calc(50% - var(--card-w) / 2); }
                                .cat-item { scroll-snap-align:center; scroll-snap-stop:always; }
                            }
                        `}</style>
                        {usarCategorias && filteredRevistas.length > 0 ? (
                            <div className="flex flex-col gap-8">
                                {linhasCategoria.map(cat => (
                                    <section key={cat.id}>
                                        <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:6 }}>
                                            <h3 style={{ margin:0, fontSize:22, fontWeight:800, color: modoNoturno ? '#fff' : '#1e293b' }}>{cat.label}</h3>
                                            <span style={{ flex:1, fontSize:13, color: modoNoturno ? 'rgba(255,255,255,0.6)' : '#64748b' }}>{cat.sub}</span>
                                        </div>
                                        <CarrosselComFade modoNoturno={modoNoturno}>
                                            {cat.itens.map((revista, cardIdx) => (
                                                <div key={revista.id} className="cat-item">
                                                    <CardRevista
                                                        revista={revista}
                                                        cardIdx={cardIdx}
                                                        modoNoturno={modoNoturno}
                                                        haptic={haptic}
                                                        setPdfLeitor={setPdfLeitor}
                                                        setSelectedPois={setSelectedPois}
                                                        setPdfLeitorLogoAnim={setPdfLeitorLogoAnim}
                                                        onVerOnibus={(rev) => { haptic(); setSelectedOnibus(rev); }}
                                                        captureZoomOrigin={captureZoomOrigin}
                                                    />
                                                </div>
                                            ))}
                                        </CarrosselComFade>
                                    </section>
                                ))}
                            </div>
                        ) : filteredRevistas.length === 0 ? (
                            <div className={`text-center py-12 rounded-xl shadow-sm border transition-colors ${modoNoturno ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-900'}`}>
                                <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                <h3 className="text-lg font-medium">Nenhum material encontrado</h3>
                                <p className="text-slate-500">Tente buscar por outro nome ou bairro.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {/* ── GRID COM PINNED PRIMEIRO ── */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ columnGap: 'calc(1rem + 0.48rem)' }}>
                                    {filteredRevistas.map((revista, cardIdx) => (
                                        <CardRevista
                                            key={revista.id}
                                            revista={revista}
                                            cardIdx={cardIdx}
                                            modoNoturno={modoNoturno}
                                            haptic={haptic}
                                            setPdfLeitor={setPdfLeitor}
                                            setSelectedPois={setSelectedPois}
                                            setPdfLeitorLogoAnim={setPdfLeitorLogoAnim}
                                            onVerOnibus={(rev) => { haptic(); setSelectedOnibus(rev); }}
                                            captureZoomOrigin={captureZoomOrigin}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeBrand === 'Utilitarios' && (() => {
                    const UTIL_GRUPOS = [
                        { nome: 'Fluxo',       Icon: BookMarked,    rgb: '139,92,246', claro: '#6d28d9', escuro: '#a78bfa' },
                        { nome: 'Declarações', Icon: FileText,      rgb: '249,115,22', claro: '#c2410c', escuro: '#fb923c' },
                        { nome: 'AMML',        Icon: Home,          rgb: '20,184,166', claro: '#0f766e', escuro: '#2dd4bf' },
                        { nome: 'Fichas',      Icon: ClipboardList, rgb: '236,72,153', claro: '#be185d', escuro: '#f472b6' },
                    ];
                    const fmtTitulo = (t) => {
                        if (t === 'M.O') return t;
                        const m = t.match(/^AMML\s*-\s*(.*)$/);
                        const low = (m ? m[1] : t).toLowerCase();
                        const cap = low.charAt(0).toUpperCase() + low.slice(1);
                        return m ? 'AMML · ' + cap : cap;
                    };
                    let idx = 0;
                    const txtPri = modoNoturno ? '#f1f5f9' : '#1e293b';
                    const txtSec = modoNoturno ? '#94a3b8' : '#64748b';
                    const linha  = modoNoturno ? '#334155' : '#e2e8f0';
                    return (
                        <div>
                            {UTIL_GRUPOS.map(g => {
                                const itens = utilitariosData.filter(u => u.cat === g.nome);
                                if (itens.length === 0) return null;
                                const cor = modoNoturno ? g.escuro : g.claro;
                                return (
                                    <section key={g.nome} className="mb-8 last:mb-0">
                                        <div className="flex items-center gap-3 mb-3 px-1">
                                            <p className="m-0 text-[11px] font-bold uppercase tracking-widest" style={{ color: cor }}>
                                                {g.nome} <span style={{ color: txtSec, fontWeight: 600 }}>· {itens.length}</span>
                                            </p>
                                            <span className="flex-1" style={{ height: 1, background: linha }} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {itens.map((item) => {
                                                const i = idx++;
                                                return (
                                                    <a key={item.title} href={item.link} target="_blank" rel="noopener noreferrer"
                                                        onClick={() => haptic()}
                                                        className={`card-entry flex items-center gap-4 px-4 rounded-2xl border transition-colors hover:border-[#007aff]/50 active:scale-[0.98] ${modoNoturno ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                                                        style={{ minHeight: 76, animationDelay: `${i * 60}ms`, textDecoration: 'none' }}>
                                                        <div className="shrink-0 flex items-center justify-center rounded-xl"
                                                            style={{ width: 44, height: 44, background: `rgba(${g.rgb},${modoNoturno ? 0.18 : 0.12})`, color: cor }}>
                                                            <g.Icon size={22} />
                                                        </div>
                                                        <h3 className="m-0 flex-1 min-w-0 text-[14px] font-semibold leading-snug"
                                                            style={{ color: txtPri, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                            {fmtTitulo(item.title)}
                                                        </h3>
                                                        <ExternalLink size={15} className="shrink-0" style={{ color: txtSec, opacity: 0.6 }} />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    );
                })()}

                {activeBrand === 'Guia' && (
                    <div className="max-w-4xl mx-auto space-y-3">
                        {/* ITEM 1: CÓDIGO DAS FAIXAS */}
                        <div className={`card-entry rounded-2xl border overflow-hidden transition-colors duration-300 ${modoNoturno ? 'bg-slate-800' : 'bg-white'}`} style={{ animationDelay: '0ms', borderColor: modoNoturno ? '#334155' : '#e2e8f0' }}>
                            <button onClick={() => { haptic(); setOpenGuiaIndex(openGuiaIndex === 0 ? null : 0); }} aria-expanded={openGuiaIndex === 0} className={`w-full text-left px-5 py-4 flex items-center gap-4 transition-colors ${modoNoturno ? 'hover:bg-slate-700/40' : 'hover:bg-slate-50'}`}>
                                <div className="shrink-0 flex items-center justify-center rounded-xl transition-all duration-300" style={{ width: 44, height: 44, background: openGuiaIndex === 0 ? 'rgb(74,133,220)' : 'rgba(74,133,220,0.14)', color: openGuiaIndex === 0 ? '#ffffff' : '#4a85dc' }}><HelpCircle size={22} /></div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`m-0 text-[15px] font-semibold leading-snug ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>Código das faixas de renda</h3>
                                    <p className="m-0 mt-0.5 text-xs" style={{ color: modoNoturno ? '#94a3b8' : '#64748b' }}>MCMV e SBPE</p>
                                </div>
                                <span className="shrink-0 flex items-center justify-center rounded-full transition-all duration-300" style={{ width: 32, height: 32, background: openGuiaIndex === 0 ? 'rgba(74,133,220,0.16)' : (modoNoturno ? 'rgba(148,163,184,0.14)' : 'rgba(100,116,139,0.10)'), color: openGuiaIndex === 0 ? '#4a85dc' : (modoNoturno ? '#94a3b8' : '#64748b'), transform: openGuiaIndex === 0 ? 'rotate(180deg)' : 'none' }}><ChevronDown size={18} /></span>
                            </button>
                            <div style={{ display: 'grid', gridTemplateRows: openGuiaIndex === 0 ? '1fr' : '0fr', visibility: openGuiaIndex === 0 ? 'visible' : 'hidden', transition: `grid-template-rows 0.45s cubic-bezier(0.22,1,0.36,1), visibility 0s linear ${openGuiaIndex === 0 ? '0s' : '0.45s'}` }}>
                                <div style={{ overflow: 'hidden', minHeight: 0, opacity: openGuiaIndex === 0 ? 1 : 0, transition: 'opacity 0.35s ease' }}>
                                <div className={`p-5 pt-0 border-t transition-colors ${modoNoturno ? 'border-slate-700 text-slate-300 bg-slate-800/50' : 'border-slate-100 text-slate-600 bg-slate-50/50'}`}>
                                    <div className="bg-[#4a85dc]/10 text-[#4a85dc] p-3 rounded-lg font-bold flex items-center gap-2 my-4 w-fit text-sm uppercase tracking-wider">Simulador Caixa</div>
                                    <p className="mb-4">O simulador do Portal já está ajustado para o novo MCMV, podendo simular todas as faixas do programa.</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className={`p-4 rounded-xl border ${modoNoturno ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                                            <p className={`font-bold mb-2 uppercase text-xs text-[#4a85dc] tracking-widest`}>MCMV:</p>
                                            <ul className="space-y-2">
                                                <li className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-[#4a85dc]"></div> <strong>FAIXA 1</strong> - código 3280</li>
                                                <li className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-[#4a85dc]"></div> <strong>FAIXA 2</strong> - código 3280</li>
                                                <li className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-[#4a85dc]"></div> <strong>FAIXA 3</strong> - código 3302</li>
                                                <li className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-[#4a85dc]"></div> <strong>FAIXA 4</strong> - código 3550</li>
                                            </ul>
                                        </div>
                                        <div className={`p-4 rounded-xl border ${modoNoturno ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                                            <p className={`font-bold mb-2 uppercase text-xs text-[#4a85dc] tracking-widest`}>OUTROS:</p>
                                            <p className="text-sm"><strong>SBPE</strong> - código 1976</p>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>

                        {/* ITEM 2: PROBLEMAS COM CADASTRO/OPORTUNIDADE */}
                        <div className={`card-entry rounded-2xl border overflow-hidden transition-colors duration-300 ${modoNoturno ? 'bg-slate-800' : 'bg-white'}`} style={{ animationDelay: '80ms', borderColor: modoNoturno ? '#334155' : '#e2e8f0' }}>
                            <button onClick={() => { haptic(); setOpenGuiaIndex(openGuiaIndex === 1 ? null : 1); }} aria-expanded={openGuiaIndex === 1} className={`w-full text-left px-5 py-4 flex items-center gap-4 transition-colors ${modoNoturno ? 'hover:bg-slate-700/40' : 'hover:bg-slate-50'}`}>
                                <div className="shrink-0 flex items-center justify-center rounded-xl transition-all duration-300" style={{ width: 44, height: 44, background: openGuiaIndex === 1 ? 'rgb(244,63,94)' : 'rgba(244,63,94,0.14)', color: openGuiaIndex === 1 ? '#ffffff' : modoNoturno ? '#fb7185' : '#e11d48' }}><AlertTriangle size={22} /></div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`m-0 text-[15px] font-semibold leading-snug ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>Problemas com cadastro ou oportunidade</h3>
                                    <p className="m-0 mt-0.5 text-xs" style={{ color: modoNoturno ? '#94a3b8' : '#64748b' }}>O que fazer e como avisar o gerente</p>
                                </div>
                                <span className="shrink-0 flex items-center justify-center rounded-full transition-all duration-300" style={{ width: 32, height: 32, background: openGuiaIndex === 1 ? 'rgba(244,63,94,0.16)' : (modoNoturno ? 'rgba(148,163,184,0.14)' : 'rgba(100,116,139,0.10)'), color: openGuiaIndex === 1 ? modoNoturno ? '#fb7185' : '#e11d48' : (modoNoturno ? '#94a3b8' : '#64748b'), transform: openGuiaIndex === 1 ? 'rotate(180deg)' : 'none' }}><ChevronDown size={18} /></span>
                            </button>
                            <div style={{ display: 'grid', gridTemplateRows: openGuiaIndex === 1 ? '1fr' : '0fr', visibility: openGuiaIndex === 1 ? 'visible' : 'hidden', transition: `grid-template-rows 0.45s cubic-bezier(0.22,1,0.36,1), visibility 0s linear ${openGuiaIndex === 1 ? '0s' : '0.45s'}` }}>
                                <div style={{ overflow: 'hidden', minHeight: 0, opacity: openGuiaIndex === 1 ? 1 : 0, transition: 'opacity 0.35s ease' }}>
                                <div className={`p-6 pt-0 border-t transition-colors ${modoNoturno ? 'border-slate-700 text-slate-300 bg-slate-800/50' : 'border-slate-100 text-slate-600 bg-slate-50/50'}`}>
                                    <div className="py-6 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-1">1</div>
                                            <p className="text-sm">Primeiro identifique a mensagem que o sistema apresenta <span className={`italic font-medium ${modoNoturno ? 'text-white' : 'text-slate-900'}`}>("Fase acima da visita, CPF cadastrado, etc")</span></p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-1">2</div>
                                            <p className="text-sm">Mande para seu gerente na seguinte estrutura e nessa exata ordem:</p>
                                        </div>
                                        
                                        <div className={`ml-9 p-4 rounded-xl border-l-4 border-rose-500 font-mono text-sm leading-relaxed ${modoNoturno ? 'bg-slate-900 text-slate-400 border-rose-600' : 'bg-white text-slate-700 shadow-inner'}`}>
                                            NOME:<br />
                                            TELEFONE:<br />
                                            E-MAIL:<br />
                                            CPF:
                                        </div>

                                        <p className="text-xs text-slate-500 italic mt-4 flex items-center gap-2">
                                            <BookMarked size={14} /> Obs.: Algumas vezes será necessário a documentação.
                                        </p>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>

                        {/* ITEM 3: TERMOS TÉCNICOS */}
                        <div className={`card-entry rounded-2xl border overflow-hidden transition-colors duration-300 ${modoNoturno ? 'bg-slate-800' : 'bg-white'}`} style={{ animationDelay: '160ms', borderColor: modoNoturno ? '#334155' : '#e2e8f0' }}>
                            <button onClick={() => { haptic(); setOpenGuiaIndex(openGuiaIndex === 2 ? null : 2); }} aria-expanded={openGuiaIndex === 2} className={`w-full text-left px-5 py-4 flex items-center gap-4 transition-colors ${modoNoturno ? 'hover:bg-slate-700/40' : 'hover:bg-slate-50'}`}>
                                <div className="shrink-0 flex items-center justify-center rounded-xl transition-all duration-300" style={{ width: 44, height: 44, background: openGuiaIndex === 2 ? 'rgb(16,185,129)' : 'rgba(16,185,129,0.14)', color: openGuiaIndex === 2 ? '#ffffff' : modoNoturno ? '#34d399' : '#059669' }}><Book size={22} /></div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`m-0 text-[15px] font-semibold leading-snug ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>Termos técnicos atualmente usados</h3>
                                    <p className="m-0 mt-0.5 text-xs" style={{ color: modoNoturno ? '#94a3b8' : '#64748b' }}>Glossário de siglas e sistemas</p>
                                </div>
                                <span className="shrink-0 flex items-center justify-center rounded-full transition-all duration-300" style={{ width: 32, height: 32, background: openGuiaIndex === 2 ? 'rgba(16,185,129,0.16)' : (modoNoturno ? 'rgba(148,163,184,0.14)' : 'rgba(100,116,139,0.10)'), color: openGuiaIndex === 2 ? modoNoturno ? '#34d399' : '#059669' : (modoNoturno ? '#94a3b8' : '#64748b'), transform: openGuiaIndex === 2 ? 'rotate(180deg)' : 'none' }}><ChevronDown size={18} /></span>
                            </button>
                            <div style={{ display: 'grid', gridTemplateRows: openGuiaIndex === 2 ? '1fr' : '0fr', visibility: openGuiaIndex === 2 ? 'visible' : 'hidden', transition: `grid-template-rows 0.45s cubic-bezier(0.22,1,0.36,1), visibility 0s linear ${openGuiaIndex === 2 ? '0s' : '0.45s'}` }}>
                                <div style={{ overflow: 'hidden', minHeight: 0, opacity: openGuiaIndex === 2 ? 1 : 0, transition: 'opacity 0.35s ease' }}>
                                <div className={`p-0 border-t transition-colors ${modoNoturno ? 'border-slate-700 bg-slate-900' : 'border-slate-100 bg-white'}`}>
                                    <div className="divide-y divide-slate-100/10 max-h-[500px] overflow-y-auto custom-scrollbar">
                                        {[
                                            { t: "AC", d: "Análise de Crédito" },
                                            { t: "AMML", d: "Amazonas Meu Lar, é um programa do governo Estadual, com foco em ajudar o cliente na entrada do imóvel." },
                                            { t: "AMORTIZAÇÃO", d: "Redução da dívida principal ao longo do tempo. Pode ser feita de forma SAC (parcelas decrescentes) ou Price (parcelas fixas)." },
                                            { t: "ANALISE DE CRÉDITO", d: "Processo para avaliar se o cliente tem condições de financiar, baseado na renda, CPF e histórico bancário." },
                                            { t: "BORA VENDER", d: "Sistema de vendas da Direcional, onde o corretor pode cadastrar, acompanhar seu cliente e vender." },
                                            { t: "CCA", d: "São os CORRESPONDENTES BANCÁRIOS, eles são responsáveis em fazer a análise de Crédito. E o corretor pode escolher o CCA que melhor atende a necessidade." },
                                            { t: "FID", d: "Numeração gerada da ANÁLISE DE CRÉDITO, esse número deve ser copiado e mandado no Grupo do CCA para que seja feita a ANÁLISE DE CRÉDITO." },
                                            { t: "ITBI + REGISTRO", d: "o ITBI é o Imposto de a Transferência de Bens Imóveis. É um IMPOSTO MUNICIPAL na qual a Direcional Paga e o cliente repassa para Direcional de maneira parcelada. REGISTRO se trata do Registro do imóvel no cartório. Esses valores a Direcional Parcela em até 40x em até 120 dias Depois do fechamento." },
                                            { t: "LINHA DE CRÉDITO", d: "Modalidade de financiamento (ex: SBPE, MCMV)" },
                                            { t: "MCMV", d: "Sigla pro Programa MINHA CASA MINHA VIDA" },
                                            { t: "PODE MORAR", d: "App do Cliente, para que ele possa acompanhar a evolução da obra, baixar boletos e efetuar pagamentos." },
                                            { t: "PROSOLUTO", d: "É o saldo da ENTRADA que será parcelado APÓS OS SINAIS. O Pro-soluto pode ser parcelado em até 52x sem deflator de comissão." },
                                            { t: "SAFI", d: "Sistema interno da CAIXA que gerencia as propostas de financiamento. Corretores não têm acesso direto, mas o banco usa ele pra análise e liberação." },
                                            { t: "SALES FORCE", d: "Sistema usado pelos gerentes para acompanhamento geral" },
                                            { t: "SBPE", d: "Sistema Brasileiro de Poupança e Empréstimo – Linha de crédito da CAIXA para quem tem renda maior ou não se enquadra no MCMV. Taxas variam conforme o perfil do cliente." },
                                            { t: "SICAQ", d: "Status e resultado real da Análise. Pode está APROVADO, REPROVADO, CONDICIONADO, NÃO SE APLICA. Etc…" },
                                            { t: "SIRIC", d: "Prestação máxima, ou Parcela Aprovada para aquela análise." },
                                            { t: "SUBSÍDIO", d: "Benefício do MCMV ou AMML que são aplicados como DESCONTOS NA ENTRADA DO APARTAMENTO." }
                                        ].map((item, idx) => (
                                            <div key={idx} className={`p-4 hover:bg-slate-50/50 transition-colors ${modoNoturno ? 'hover:bg-slate-800/50' : ''}`}>
                                                <p className={`font-black text-sm mb-1 uppercase tracking-wider ${modoNoturno ? 'text-emerald-400' : 'text-emerald-700'}`}>• {item.t}</p>
                                                <p className={`text-sm leading-relaxed ${modoNoturno ? 'text-slate-400' : 'text-slate-600'}`}>{item.d}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>

                        {/* ITEM 4: CONTATOS DE CARTÓRIOS DE PROTESTOS */}
                        <div className={`card-entry rounded-2xl border overflow-hidden transition-colors duration-300 ${modoNoturno ? 'bg-slate-800' : 'bg-white'}`} style={{ animationDelay: '240ms', borderColor: modoNoturno ? '#334155' : '#e2e8f0' }}>
                            <button onClick={() => { haptic(); setOpenGuiaIndex(openGuiaIndex === 3 ? null : 3); }} aria-expanded={openGuiaIndex === 3} className={`w-full text-left px-5 py-4 flex items-center gap-4 transition-colors ${modoNoturno ? 'hover:bg-slate-700/40' : 'hover:bg-slate-50'}`}>
                                <div className="shrink-0 flex items-center justify-center rounded-xl transition-all duration-300" style={{ width: 44, height: 44, background: openGuiaIndex === 3 ? 'rgb(168,85,247)' : 'rgba(168,85,247,0.14)', color: openGuiaIndex === 3 ? '#ffffff' : modoNoturno ? '#c084fc' : '#9333ea' }}><Phone size={22} /></div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`m-0 text-[15px] font-semibold leading-snug ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>Contatos de cartórios de protestos de Manaus</h3>
                                    <p className="m-0 mt-0.5 text-xs" style={{ color: modoNoturno ? '#94a3b8' : '#64748b' }}>1º ao 6º ofício, via WhatsApp</p>
                                </div>
                                <span className="shrink-0 flex items-center justify-center rounded-full transition-all duration-300" style={{ width: 32, height: 32, background: openGuiaIndex === 3 ? 'rgba(168,85,247,0.16)' : (modoNoturno ? 'rgba(148,163,184,0.14)' : 'rgba(100,116,139,0.10)'), color: openGuiaIndex === 3 ? modoNoturno ? '#c084fc' : '#9333ea' : (modoNoturno ? '#94a3b8' : '#64748b'), transform: openGuiaIndex === 3 ? 'rotate(180deg)' : 'none' }}><ChevronDown size={18} /></span>
                            </button>
                            <div style={{ display: 'grid', gridTemplateRows: openGuiaIndex === 3 ? '1fr' : '0fr', visibility: openGuiaIndex === 3 ? 'visible' : 'hidden', transition: `grid-template-rows 0.45s cubic-bezier(0.22,1,0.36,1), visibility 0s linear ${openGuiaIndex === 3 ? '0s' : '0.45s'}` }}>
                                <div style={{ overflow: 'hidden', minHeight: 0, opacity: openGuiaIndex === 3 ? 1 : 0, transition: 'opacity 0.35s ease' }}>
                                <div className={`p-5 pt-0 border-t transition-colors ${modoNoturno ? 'border-slate-700 text-slate-300 bg-slate-800/50' : 'border-slate-100 text-slate-600 bg-slate-50/50'}`}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                        {[
                                            { oficio: "1º OFÍCIO", whatsapp: "(92) 99377-6945" },
                                            { oficio: "2º OFÍCIO", whatsapp: "(92) 98477-0807" },
                                            { oficio: "3º OFÍCIO", whatsapp: "(92) 99236-8197" },
                                            { oficio: "4º OFÍCIO", whatsapp: "(92) 99449-1536" },
                                            { oficio: "5º OFÍCIO", whatsapp: "(92) 99311-0317" },
                                            { oficio: "6º OFÍCIO", whatsapp: "(92) 98246-6445" }
                                        ].map((item, idx) => (
                                            <a
                                                key={idx}
                                                href={`https://wa.me/55${item.whatsapp.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={haptic}
                                                className={`p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                                                    modoNoturno 
                                                        ? 'bg-slate-900 border-slate-700 hover:border-purple-500/50 hover:bg-slate-800' 
                                                        : 'bg-white border-slate-200 hover:border-purple-500/50 hover:bg-purple-50/30'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className={`font-bold text-sm mb-1 ${modoNoturno ? 'text-purple-400' : 'text-purple-600'}`}>
                                                            {item.oficio}
                                                        </p>
                                                        <p className={`text-lg font-mono tracking-tight ${modoNoturno ? 'text-white' : 'text-slate-900'}`}>
                                                            {item.whatsapp}
                                                        </p>
                                                    </div>
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                        modoNoturno ? 'bg-purple-500/20' : 'bg-purple-100'
                                                    }`}>
                                                        <Phone size={18} className="text-purple-500" />
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 text-xs ${
                                        modoNoturno ? 'bg-purple-500/10 text-purple-300' : 'bg-purple-50 text-purple-700'
                                    }`}>
                                        <Phone size={14} className="shrink-0 mt-0.5" />
                                        <p>Clique em qualquer cartório para abrir o WhatsApp direto com o número.</p>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>

                        {/* ITEM 5: CENTRAL DE RELACIONAMENTO */}
                        <div className={`card-entry rounded-2xl border overflow-hidden transition-colors duration-300 ${modoNoturno ? 'bg-slate-800' : 'bg-white'}`} style={{ animationDelay: '320ms', borderColor: modoNoturno ? '#334155' : '#e2e8f0' }}>
                            <button onClick={() => { haptic(); setOpenGuiaIndex(openGuiaIndex === 4 ? null : 4); }} aria-expanded={openGuiaIndex === 4} className={`w-full text-left px-5 py-4 flex items-center gap-4 transition-colors ${modoNoturno ? 'hover:bg-slate-700/40' : 'hover:bg-slate-50'}`}>
                                <div className="shrink-0 flex items-center justify-center rounded-xl transition-all duration-300" style={{ width: 44, height: 44, background: openGuiaIndex === 4 ? 'rgb(16,185,129)' : 'rgba(16,185,129,0.14)', color: openGuiaIndex === 4 ? '#ffffff' : modoNoturno ? '#34d399' : '#059669' }}><MessageCircle size={22} /></div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`m-0 text-[15px] font-semibold leading-snug ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>Central de relacionamento</h3>
                                    <p className="m-0 mt-0.5 text-xs" style={{ color: modoNoturno ? '#94a3b8' : '#64748b' }}>Direcional e Riva</p>
                                </div>
                                <span className="shrink-0 flex items-center justify-center rounded-full transition-all duration-300" style={{ width: 32, height: 32, background: openGuiaIndex === 4 ? 'rgba(16,185,129,0.16)' : (modoNoturno ? 'rgba(148,163,184,0.14)' : 'rgba(100,116,139,0.10)'), color: openGuiaIndex === 4 ? modoNoturno ? '#34d399' : '#059669' : (modoNoturno ? '#94a3b8' : '#64748b'), transform: openGuiaIndex === 4 ? 'rotate(180deg)' : 'none' }}><ChevronDown size={18} /></span>
                            </button>
                            <div style={{ display: 'grid', gridTemplateRows: openGuiaIndex === 4 ? '1fr' : '0fr', visibility: openGuiaIndex === 4 ? 'visible' : 'hidden', transition: `grid-template-rows 0.45s cubic-bezier(0.22,1,0.36,1), visibility 0s linear ${openGuiaIndex === 4 ? '0s' : '0.45s'}` }}>
                                <div style={{ overflow: 'hidden', minHeight: 0, opacity: openGuiaIndex === 4 ? 1 : 0, transition: 'opacity 0.35s ease' }}>
                                <div className={`p-5 pt-0 border-t transition-colors ${modoNoturno ? 'border-slate-700 text-slate-300 bg-slate-800/50' : 'border-slate-100 text-slate-600 bg-slate-50/50'}`}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        {/* DIRECIONAL */}
                                        <div className={`p-4 rounded-xl border ${modoNoturno ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                                            <p className="font-bold mb-3 uppercase text-xs text-blue-500 tracking-widest">Cliente Direcional</p>
                                            <div className="space-y-2.5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <a href="tel:+553140022600" onClick={haptic} className={`flex items-center gap-2 text-sm hover:underline ${modoNoturno ? 'text-slate-300' : 'text-slate-700'}`}>
                                                        <Phone size={15} className="text-blue-500 shrink-0" /> Central: (031) 4002-2600
                                                    </a>
                                                    <button onClick={() => copiarTextoGuia('(031) 4002-2600', 'dir-central')} className={`shrink-0 p-1.5 rounded-md transition-colors ${modoNoturno ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                                                        {copiedGuiaItem === 'dir-central' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />}
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <a href="https://wa.me/553140022600" target="_blank" rel="noopener noreferrer" onClick={haptic} className={`flex items-center gap-2 text-sm hover:underline ${modoNoturno ? 'text-slate-300' : 'text-slate-700'}`}>
                                                        <MessageCircle size={15} className="text-blue-500 shrink-0" /> WhatsApp: (031) 4002-2600
                                                    </a>
                                                    <button onClick={() => copiarTextoGuia('(031) 4002-2600', 'dir-whats')} className={`shrink-0 p-1.5 rounded-md transition-colors ${modoNoturno ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                                                        {copiedGuiaItem === 'dir-whats' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />}
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <a href="https://www.direcional.com.br/cliente" target="_blank" rel="noopener noreferrer" onClick={haptic} className={`flex items-center gap-2 text-sm hover:underline truncate ${modoNoturno ? 'text-slate-300' : 'text-slate-700'}`}>
                                                        <Globe size={15} className="text-blue-500 shrink-0" /> Portal do cliente
                                                    </a>
                                                    <button onClick={() => copiarTextoGuia('www.direcional.com.br/cliente', 'dir-portal')} className={`shrink-0 p-1.5 rounded-md transition-colors ${modoNoturno ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                                                        {copiedGuiaItem === 'dir-portal' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIVA */}
                                        <div className={`p-4 rounded-xl border ${modoNoturno ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                                            <p className="font-bold mb-3 uppercase text-xs text-[#4a85dc] tracking-widest">Cliente Riva</p>
                                            <div className="space-y-2.5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <a href="tel:+553140071620" onClick={haptic} className={`flex items-center gap-2 text-sm hover:underline ${modoNoturno ? 'text-slate-300' : 'text-slate-700'}`}>
                                                        <Phone size={15} className="text-[#4a85dc] shrink-0" /> Central: (031) 4007-1620
                                                    </a>
                                                    <button onClick={() => copiarTextoGuia('(031) 4007-1620', 'riva-central')} className={`shrink-0 p-1.5 rounded-md transition-colors ${modoNoturno ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                                                        {copiedGuiaItem === 'riva-central' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />}
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <a href="https://wa.me/553140071620" target="_blank" rel="noopener noreferrer" onClick={haptic} className={`flex items-center gap-2 text-sm hover:underline ${modoNoturno ? 'text-slate-300' : 'text-slate-700'}`}>
                                                        <MessageCircle size={15} className="text-[#4a85dc] shrink-0" /> WhatsApp: (031) 4007-1620
                                                    </a>
                                                    <button onClick={() => copiarTextoGuia('(031) 4007-1620', 'riva-whats')} className={`shrink-0 p-1.5 rounded-md transition-colors ${modoNoturno ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                                                        {copiedGuiaItem === 'riva-whats' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />}
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <a href="https://www.rivaincorporadora.com.br/cliente" target="_blank" rel="noopener noreferrer" onClick={haptic} className={`flex items-center gap-2 text-sm hover:underline truncate ${modoNoturno ? 'text-slate-300' : 'text-slate-700'}`}>
                                                        <Globe size={15} className="text-[#4a85dc] shrink-0" /> Portal do cliente
                                                    </a>
                                                    <button onClick={() => copiarTextoGuia('www.rivaincorporadora.com.br/cliente', 'riva-portal')} className={`shrink-0 p-1.5 rounded-md transition-colors ${modoNoturno ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                                                        {copiedGuiaItem === 'riva-portal' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm font-semibold mt-5 mb-3">O cliente deve obter o aplicativo para celular <span className="text-emerald-500">PODE MORAR</span>:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                                            modoNoturno ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                                        }`}>
                                            <a
                                                href="https://play.google.com/store/apps/details?id=com.podemorar&pcampaignid=web_share"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={haptic}
                                                className="flex items-center gap-3 flex-1 min-w-0"
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${modoNoturno ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                                                    <Smartphone size={18} className="text-emerald-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`font-bold text-sm ${modoNoturno ? 'text-white' : 'text-slate-900'}`}>Google Play</p>
                                                    <p className={`text-xs ${modoNoturno ? 'text-slate-400' : 'text-slate-500'}`}>Baixar para Android</p>
                                                </div>
                                            </a>
                                            <button onClick={() => copiarTextoGuia('https://play.google.com/store/apps/details?id=com.podemorar&pcampaignid=web_share', 'app-android')} className={`shrink-0 p-1.5 rounded-md transition-colors ${modoNoturno ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                                                {copiedGuiaItem === 'app-android' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />}
                                            </button>
                                        </div>
                                        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                                            modoNoturno ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                                        }`}>
                                            <a
                                                href="https://apps.apple.com/br/app/pode-morar/id1569813219"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={haptic}
                                                className="flex items-center gap-3 flex-1 min-w-0"
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${modoNoturno ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                                                    <Smartphone size={18} className="text-emerald-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`font-bold text-sm ${modoNoturno ? 'text-white' : 'text-slate-900'}`}>App Store</p>
                                                    <p className={`text-xs ${modoNoturno ? 'text-slate-400' : 'text-slate-500'}`}>Baixar para iPhone</p>
                                                </div>
                                            </a>
                                            <button onClick={() => copiarTextoGuia('https://apps.apple.com/br/app/pode-morar/id1569813219', 'app-ios')} className={`shrink-0 p-1.5 rounded-md transition-colors ${modoNoturno ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                                                {copiedGuiaItem === 'app-ios' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                </div>{/* /conteúdo em tela cheia */}
            </main>

            {/* Rodapé — crédito do aplicativo */}
            <footer className="w-full text-center px-4 pt-6 pb-28 sm:pb-8">
                <p className="text-[9px] font-light uppercase tracking-[0.12em]" style={{ fontWeight: 300, color: modoNoturno ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.45)' }}>
                    Criado por Luis Santos/92984330209
                </p>
            </footer>

            {/* OVERLAY ANIMAÇÃO LOGO — carregando revista */}
            {pdfLeitorLogoAnim && (() => {
                const isDir = pdfLeitorLogoAnim.brand === 'Direcional';
                return (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 65,
                        background: '#0a0a0a',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
                        animation: 'logo-anim-in 0.38s cubic-bezier(0.22,1,0.36,1) both',
                    }}>
                        {/* Brilho de fundo */}
                        <div style={{
                            position: 'absolute', width: 340, height: 340, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(15,76,160,0.35) 0%, transparent 70%)',
                            filter: 'blur(40px)',
                            animation: 'logo-glow-pulse 1.6s ease-in-out infinite alternate',
                        }}/>
                        {/* Logo */}
                        <div style={{
                            position: 'relative', zIndex: 1,
                            animation: 'logo-zoom-in 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.15s both',
                        }}>
                            <img
                                src={pdfLeitorLogoAnim.logoSrc}
                                alt={pdfLeitorLogoAnim.title}
                                style={{
                                    maxWidth: 260, maxHeight: 160, width: 'auto', height: 'auto',
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 0 32px rgba(255,255,255,0.25)) drop-shadow(0 4px 24px rgba(0,0,0,0.8))',
                                }}
                            />
                        </div>
                        {/* Texto + loading dots */}
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, animation: 'logo-fade-up 0.5s ease 0.4s both' }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em' }}>Carregando revista digital...</p>
                            <div style={{ display: 'flex', gap: 7 }}>
                                {[0,1,2].map(i => (
                                    <div key={i} style={{
                                        width: 8, height: 8, borderRadius: '50%',
                                        background: isDir ? '#2563eb' : '#4a85dc',
                                        animation: `logo-dot-bounce 0.9s ease-in-out ${i * 0.18}s infinite alternate`,
                                    }} />
                                ))}
                            </div>
                        </div>
                        <style>{`
                            @keyframes logo-anim-in { from { opacity:0; } to { opacity:1; } }
                            @keyframes logo-zoom-in { from { opacity:0; transform:scale(0.65); } to { opacity:1; transform:scale(1); } }
                            @keyframes logo-fade-up { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
                            @keyframes logo-glow-pulse { from { opacity:0.5; transform:scale(0.9); } to { opacity:1; transform:scale(1.1); } }
                            @keyframes logo-dot-bounce { from { transform:translateY(0); opacity:0.5; } to { transform:translateY(-8px); opacity:1; } }
                        `}</style>
                    </div>
                );
            })()}

            {/* BOTÃO X DA REVISTA — componente dedicado que bloqueia zoom de pinça */}
            {pdfLeitor && <RevistaCloseButton onClose={() => setPdfLeitor(null)} />}

            {/* MODAL LEITOR DE REVISTA (PDF via Google Drive preview) */}
            {pdfLeitor && (() => {
                const isDir = pdfLeitor.brand === 'Direcional';
                return (
                    <div className="fixed inset-0 z-[60] zoom-origin-in" style={{background:'#0f0f0f', '--ox': zoomOrigin.x, '--oy': zoomOrigin.y}}>

                        {/* iframe — começa abaixo da status bar para o botão nativo do Drive ficar visível */}
                        <div className="absolute left-0 right-0 bottom-0 z-0"
                            style={{top:'env(safe-area-inset-top, 0px)', background:'#0f0f0f'}}>
                            {/* Loading atrás do iframe */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none" style={{background:'#0f0f0f', zIndex:0}}>
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDir ? 'bg-blue-500/20' : 'bg-[#4a85dc]/20'}`}>
                                    <BookOpen size={32} className={isDir ? 'text-blue-500' : 'text-[#4a85dc]'} />
                                </div>
                                <p className="text-white/60 text-sm">Carregando revista...</p>
                                <div className="flex gap-1.5">
                                    {[0,1,2].map(i => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${isDir ? 'bg-blue-500' : 'bg-[#4a85dc]'}`}
                                            style={{animation:`bounce 1s ease-in-out ${i*0.15}s infinite alternate`}} />
                                    ))}
                                </div>
                            </div>
                            <iframe
                                key={pdfLeitor.url}
                                src={pdfLeitor.url}
                                title={pdfLeitor.title}
                                allow="autoplay"
                                className="border-0"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    zIndex: 1,
                                    background: '#0f0f0f',
                                    touchAction: 'pan-y pinch-zoom',
                                }}
                            />
                        </div>
                        <style>{`
                            @keyframes bounce {
                                from { transform: translateY(0); opacity: 0.5; }
                                to   { transform: translateY(-6px); opacity: 1; }
                            }
                        `}</style>
                    </div>
                );
            })()}

            {/* MODAL PONTOS DE REFERÊNCIA */}
            {selectedPois && (() => {
                // Endereços reais dos empreendimentos (confirmados nas fontes oficiais Direcional/Riva)
                // Usado como ORIGEM na rota do Maps — garante que a rota parte do local correto
                const EMPREEND_COORDS = {
                    'Brisas do Horizonte':         '-3.0863455,-59.9757828',
                    'Parque Ville Orquídea':        '-2.9737056,-60.0065346',
                    'Village Torres':               '-2.9710343,-59.9962363',
                    'Conquista Jardim Botânico':    '-2.9845565,-59.9896558',
                    'Viva Vida Coral':              '-3.01547,-60.018348',
                    'Conquista Jardim Norte':       '-2.9878435,-60.004704',
                    'Viva Vida Rio Amazonas':       '-2.9835792,-60.0470611',
                    'Bosque das Torres':            '-2.9696927,-59.997579',
                    'Campo das Torres':             '-2.9696927,-59.997579',
                    'Parque Ville Lírio Azul':      '-2.9759258,-60.0065576',
                    'Parque Ville Lírio Rosa':      '-2.9759258,-60.0065576',
                    'Viva Vida Safira':             '-3.01547,-60.018348',
                    'Amazon Boulevard Classic':     '-3.060292,-60.0253649',
                    'Amazon Boulevard Prime':       '-3.060292,-60.0253649',
                    'Città Oasis Azzure':           '-3.0732449,-60.0158834',
                    'Zenith Condomínio Clube':      '-3.1040641,-59.9993555',
                    'Conquista Topázio':            '-3.01547,-60.018348',
                    'Conquista Rio Negro':          '-3.0401114,-60.0800979',
                    'Encontro das Águas':           '-3.0401114,-60.0800979',
                    'Viva Vida Rio Tapajós':        '-2.9835792,-60.0470611',
                    'Moratta Home Riva':            '-3.077466,-60.020464',
                };

                // Mapa de POIs com endereço exato para evitar o Maps abrir a unidade errada
                const POI_ENDERECOS = {
                    // Brisas do Horizonte — Coroado
                    'Supermercado Vitória':                    'Av. Cosme Ferreira, 1620, Coroado, Manaus',
                    'Escola Mun. Profª Maria Rodrigues Tapajós': 'Escola Municipal Profª Maria Rodrigues Tapajós, Coroado, Manaus',
                    'SPA Coroado':                             'SPA Coroado, Manaus',
                    'Estádio Carlos Zamith':                   'Estádio Carlos Zamith, Coroado, Manaus',
                    'Park Mall Ephigênio Salles':              'Park Mall Ephigênio Salles, Av. Ephigênio Salles, Manaus',
                    'UFAM - Universidade Federal do Amazonas': 'UFAM Universidade Federal do Amazonas, Av. Rodrigo Octávio, Coroado, Manaus',
                    'Hospital Dr. João Lúcio':                 'Hospital Dr. João Lúcio, Av. Cosme Ferreira, Manaus',
                    'Samel São José Medical Center':           'Samel São José Medical Center, Manaus',
                    'Sesi Clube do Trabalhador':               'Sesi Clube do Trabalhador, Manaus',
                    'Manauara Shopping':                       'Manauara Shopping, Av. Mario Ypiranga, Manaus',
                    // Lago Azul — Orquídea / Village / Bosque / Lírio
                    'Escola Mun. Viviane Estrela':             'Escola Municipal Viviane Estrela, Lago Azul, Manaus',
                    'Clínica da Família C. Nicolau':           'Clínica da Família Coronel Nicolau, Lago Azul, Manaus',
                    'Veneza Express':                          'Supermercado Veneza Express, Lago Azul, Manaus',
                    'Nova Era Supermercado':                   'Super Nova Era Torres, Av. Gov. José Lindoso, 230, Lago Azul, Manaus',
                    'Terminal 6':                              'Terminal 6 de Ônibus, Lago Azul, Manaus',
                    'Colégio Militar da PM VI':                'Colégio Militar da PM VI, Lago Azul, Manaus',
                    'Shopping Via Norte':                      'Shopping Via Norte, Av. Torquato Tapajós, Manaus',
                    'Hospital Delphina Aziz':                  'Hospital Delphina Aziz, Av. Torquato Tapajós, Manaus',
                    'Sumaúma Park Shopping':                   'Sumaúma Park Shopping, Av. Noel Nutels, Manaus',
                    'Supermercado Nova Era (Torres)':          'Super Nova Era Torres, Av. Gov. José Lindoso, 230, Lago Azul, Manaus',
                    'Parque do Mindu':                         'Parque Estadual do Mindu, Manaus',
                    'Faculdade Estácio (polo próximo)':        'Faculdade Estácio, Manaus',
                    'Escola Integral João S. Braga':           'Escola de Tempo Integral João S. Braga, Lago Azul, Manaus',
                    'Escola Est. Eliana Braga':                'Escola Estadual Eliana Braga, Lago Azul, Manaus',
                    'Clínica da Família C. Gracie':            'Clínica da Família Coronel Gracie, Lago Azul, Manaus',
                    'UBS José Fligliuolo':                     'UBS José Fligliuolo, Lago Azul, Manaus',
                    'Terminal 6 e 7':                          'Terminal 6, Lago Azul, Manaus',
                    'Shopping Via Norte / Havan / Fun Park':   'Shopping Via Norte, Av. Torquato Tapajós, Manaus',
                    // Nova Cidade — Jardim Botânico
                    'MUSA (Museu da Amazônia / Jardim Botânico)': 'MUSA Museu da Amazônia, Av. Margarita, Nova Cidade, Manaus',
                    'Supermercado DB Nova Cidade':             'Supermercado DB Nova Cidade, Manaus',
                    'SPA Galiléia':                            'SPA Galiléia, Nova Cidade, Manaus',
                    // Colônia Terra Nova — Coral / Topázio
                    'Loja Havan':                              'Havan Manaus, Av. Torquato Tapajós, Manaus',
                    'Atacadão':                                'Atacadão, Av. Torquato Tapajós, Manaus',
                    'Posto Atem (famoso na entrada do bairro)': 'Posto Atem, Colônia Terra Nova, Manaus',
                    'Allegro Mall (vizinho)':                  'Allegro Mall, Colônia Terra Nova, Manaus',
                    'SPA da Colônia Terra Nova':               'SPA Colônia Terra Nova, Manaus',
                    // Santa Etelvina — Jardim Norte
                    'Shopping Via Norte (1 min)':              'Shopping Via Norte, Av. Torquato Tapajós, Manaus',
                    'Havan (1 min)':                           'Havan Manaus, Av. Torquato Tapajós, Manaus',
                    'Fun Park (1 min)':                        'Fun Park Manaus, Av. Torquato Tapajós, Manaus',
                    'Nova Era Supermercado (1 min)':           'Nova Era Santa Etelvina, Av. Torquato Tapajós, 11559, Santa Etelvina, Manaus',
                    'UBS Sálvio Belota':                       'UBS Sálvio Belota, Santa Etelvina, Manaus',
                    'Feira do Santa Etelvina':                 'Feira Santa Etelvina, Manaus',
                    'Terminal 06 (5 min)':                     'Terminal 6, Lago Azul, Manaus',
                    '15º Distrito Policial':                   '15 Distrito Policial, Manaus',
                    'Hiper DB (5-7 min)':                      'Hiper DB, Manaus',
                    'Escola Dra. Viviane Estrela':             'Escola Viviane Estrela, Manaus',
                    // Tarumã — Rio Amazonas / Rio Tapajós
                    'Aeroporto Internacional Eduardo Gomes':   'Aeroporto Internacional Eduardo Gomes, Manaus',
                    'Aeroporto Internacional de Manaus':       'Aeroporto Internacional Eduardo Gomes, Manaus',
                    'Orla da Ponta Negra':                     'Orla da Ponta Negra, Manaus',
                    'Sivam (Sistema de Vigilância da Amazônia)': 'Sivam, Av. Torquato Tapajós, Manaus',
                    'Sivam':                                   'Sivam, Av. Torquato Tapajós, Manaus',
                    'Sipam':                                   'Sipam, Manaus',
                    'Supermercado Veneza':                     'Supermercado Veneza, Av. Coronel Teixeira, Manaus',
                    'Tarumã (área de balneários famosos)':     'Balneários Tarumã, Manaus',
                    'proximidade com a entrada da Ponta Negra': 'Ponta Negra, Manaus',
                    // Bairro da Paz — Boulevard Classic / Prime
                    'Arena da Amazônia':                       'Arena da Amazônia, Av. Constantino Nery, Manaus',
                    'Amazonas Shopping':                       'Amazonas Shopping, Av. Djalma Batista, Manaus',
                    'Carrefour Hipermercado':                  'Carrefour, Av. Constantino Nery, Manaus',
                    'Hipermercado Carrefour':                  'Carrefour, Av. Constantino Nery, Manaus',
                    'UNIP (Universidade Paulista)':            'UNIP Universidade Paulista, Manaus',
                    'Terminal Rodoviário de Manaus':           'Terminal Rodoviário de Manaus, Manaus',
                    'Hospital Tropical (Fundação de Medicina Tropical)': 'Hospital Tropical FMT, Av. Pedro Teixeira, Manaus',
                    'Sambódromo':                              'Sambódromo de Manaus, Manaus',
                    'La Parilla Restaurante':                  'La Parilla Restaurante, Manaus',
                    'Aeroclub':                                'Aeroclub de Manaus, Manaus',
                    'Petz':                                    'Petz Manaus, Manaus',
                    'Clube Municipal (ao lado)':               'Clube Municipal de Manaus, Manaus',
                    'Vila Olímpica':                           'Vila Olímpica, Manaus',
                    'Drogaria Bom Preço':                      'Drogaria Bom Preço, Manaus',
                    'Drogaria Santo Remédio':                  'Drogaria Santo Remédio, Manaus',
                    // Flores — Città Oasis Azzure
                    'Universidade Nilton Lins':                'Universidade Nilton Lins, Av. Prof. Nilton Lins, Manaus',
                    'Laranjeiras Restaurante (polo gastronômico)': 'Polo Gastronômico Laranjeiras, Av. Coronel Teixeira, Manaus',
                    'Sushi Ponta Negra':                       'Sushi Ponta Negra, Av. Coronel Teixeira, Manaus',
                    'Domes Burgers':                           'Domes Burgers, Manaus',
                    'Di Fiori - Casa de Massas e Pizzas':      'Di Fiori Casa de Massas, Av. Coronel Teixeira, Manaus',
                    'Na Lenha Pizzaria':                       'Na Lenha Pizzaria, Av. Coronel Teixeira, Manaus',
                    'Supermercado Atack (Laranjeiras)':        'Supermercado Atack, Av. Coronel Teixeira, Flores, Manaus',
                    'Sollarium Mall':                          'Sollarium Mall, Manaus',
                    // São Francisco — Zenith
                    'Fórum Ministro Henoch Reis':              'Fórum Ministro Henoch Reis, Manaus',
                    'Tribunal de Justiça (TJ-AM)':             'Tribunal de Justiça do Amazonas, Manaus',
                    'Hospital Check Up':                       'Hospital Check Up, Manaus',
                    'Colégio Martha Falcão':                   'Colégio Martha Falcão, Manaus',
                    'Faculdade Martha Falcão':                 'Faculdade Martha Falcão, Manaus',
                    // Ponta Negra — Rio Negro
                    'Shopping Ponta Negra':                    'Shopping Ponta Negra, Av. N.S. do Carmo, Manaus',
                    'DB Ponta Negra':                          'Supermercado DB Ponta Negra, Manaus',
                    'Orla 92 Mall':                            'Orla 92 Mall, Ponta Negra, Manaus',
                    'Praia Dourada':                           'Praia Dourada, Ponta Negra, Manaus',
                    'Marina Tauá':                             'Marina Tauá, Ponta Negra, Manaus',
                    'Balneário do SESC':                       'SESC Balneário, Manaus',
                    'Aeroporto Eduardo Gomes':                 'Aeroporto Internacional Eduardo Gomes, Manaus',
                    'Policlínica José Lins':                   'Policlínica José Lins, Manaus',
                    'Colégio Século':                          'Colégio Século, Manaus',
                    // Flores — Moratta Home Riva
                    'Carrefour Flores (ao lado - 24h)':        'Carrefour Hipermercado, Av. Djalma Batista, 276, Flores, Manaus',
                    'Amazonas Shopping (5 min)':               'Amazonas Shopping, Av. Djalma Batista, 482, Manaus',
                    'Manaus Plaza Shopping (5 min)':           'Manaus Plaza Shopping, Av. Djalma Batista, 2100, Manaus',
                    'Millennium Shopping (8 min)':             'Millennium Shopping, Av. Djalma Batista, 1661, Manaus',
                    'UEA - Universidade Estadual do Amazonas (5 min)': 'UEA Escola Normal Superior, Av. Djalma Batista, 2470, Manaus',
                    'UniNorte Campus Djalma Batista (5 min)':  'UniNorte, Av. Djalma Batista, 122, Manaus',
                    'Samel Centro Médico Djalma Batista (10 min)': 'Centro Médico Samel, Av. Djalma Batista, 671, Manaus',
                    'Sushi Ponta Negra - Djalma Batista (8 min)': 'Sushi Ponta Negra, Av. Djalma Batista, 935, Manaus',
                    'Garrafeira 351 - Restaurante (5 min)':    'Garrafeira 351, Av. Djalma Batista, 125, Manaus',
                    'Gendai Restaurante Japonês - Amazonas Shopping (5 min)': 'Gendai Restaurante, Amazonas Shopping, Av. Djalma Batista, 482, Manaus',
                };

                const origemEndereco = EMPREEND_COORDS[selectedPois.title] || (selectedPois.title + ', Manaus, AM');

                const abrirMapa = (poi) => {
                    haptic('light');
                    // Remove o "(X min)" para usar como chave de lookup
                    const nomePoi = poi.replace(/\s*\([\d\-\s]+\s*min\)$/i, '').trim();
                    // Busca endereço exato no mapa de POIs; se não tiver, usa nome + Manaus
                    const destino = POI_ENDERECOS[nomePoi] || POI_ENDERECOS[poi] || `${nomePoi}, Manaus, AM`;
                    const origemEncoded = encodeURIComponent(origemEndereco);
                    const destinoEncoded = encodeURIComponent(destino);
                    const url = `https://www.google.com/maps/dir/${origemEncoded}/${destinoEncoded}`;
                    window.open(url, '_blank');
                };
                return (
                    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${closingPoi ? 'zoom-origin-out' : 'zoom-origin-in'}`}
                        style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 0px))', paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))', background: modoNoturno ? 'rgba(7,11,22,0.55)' : 'rgba(226,232,240,0.60)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', '--ox': zoomOrigin.x, '--oy': zoomOrigin.y }}
                        onClick={closePoi}>
                        <div className={`w-full max-w-md overflow-hidden ${closingPoi ? 'poi-modal-close' : 'poi-modal-open'}`}
                            style={{
                                borderRadius:'24px',
                                background: modoNoturno ? '#1e293b' : '#f8fafc',
                                border: modoNoturno ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(15,23,42,0.08)'
                            }}
                            onClick={e => e.stopPropagation()}>
                            <div className="p-4 flex justify-between items-center"
                                style={{ borderBottom: modoNoturno ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(15,23,42,0.08)' }}>
                                <h3 className={`font-bold flex items-center gap-2 ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>
                                    Pontos de Referência
                                </h3>
                                <button onClick={closePoi} className="text-slate-400 hover:text-slate-600 p-3 -m-2 rounded-full hover:bg-slate-200/40 transition-colors"><X size={24} /></button>
                            </div>
                            <div className="p-5">
                                <h4 className={`font-bold text-lg mb-1 ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>{selectedPois.title}</h4>
                                <p className={`text-[10px] font-semibold mb-4 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Toque em qualquer ponto para ver o caminho no mapa
                                </p>
                                <div className="rounded-xl overflow-hidden"
                                    style={{ border: modoNoturno ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(15,23,42,0.08)' }}>
                                    {selectedPois.pois.slice(0, 6).map((poi, idx) => (
                                        <button key={idx} onClick={() => abrirMapa(poi)}
                                            style={{ animationDelay:`${idx * 0.05}s` }}
                                            onMouseEnter={e => { e.currentTarget.style.background = modoNoturno ? 'rgba(0,122,255,0.10)' : 'rgba(0,122,255,0.06)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all active:scale-[0.98] poi-item-in group">
                                            <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                                                style={{ background: modoNoturno ? 'rgba(0,122,255,0.15)' : 'rgba(0,122,255,0.08)' }}>
                                                <MapPin size={13} style={{ color: '#007aff' }} />
                                            </div>
                                            <span className={`flex-1 text-sm font-medium leading-snug transition-colors ${modoNoturno ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{poi}</span>
                                            <div className="shrink-0 flex items-center gap-1 text-[9px] font-black uppercase tracking-wider transition-all opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0"
                                                style={{ color: '#007aff' }}>
                                                <span>Ver rota</span><ExternalLink size={10} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => { haptic(); closePoi(); }}
                                    className={`w-full mt-4 py-2.5 font-semibold rounded-xl transition-all text-sm active:scale-[0.98] ${modoNoturno ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}
                                    style={{ border: modoNoturno ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(15,23,42,0.08)', background: modoNoturno ? 'rgba(255,255,255,0.05)' : '#ffffff' }}>
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* MODAL LINHAS DE ÔNIBUS */}
            {selectedOnibus && (() => {
                const LINHAS_POR_EMPREENDIMENTO = {
                    'Brisas do Horizonte': [
                        { linha: '225', nome: 'Coroado / Centro (via Av. Cosme Ferreira)', cor: '#16a34a' },
                        { linha: '226', nome: 'Coroado / Centro (via Estrada do Coroado)', cor: '#4a85dc' },
                        { linha: '640', nome: 'Coroado / UFAM / Shopping', cor: '#9333ea' },
                        { linha: '441', nome: 'Coroado / Dom Pedro (circular)', cor: '#dc2626' },
                        { linha: '218', nome: 'Coroado / Cachoeirinha / Centro', cor: '#2563eb' },
                        { linha: '652', nome: 'Coroado / Sumaúma (via Torquato)', cor: '#4a85dc' },
                    ],
                    'Parque Ville Orquídea': [
                        { linha: '120', nome: 'Lago Azul / Centro (via Torquato Tapajós)', cor: '#16a34a' },
                        { linha: '121', nome: 'Lago Azul / Terminal 6', cor: '#4a85dc' },
                        { linha: '122', nome: 'Lago Azul / Via Norte Shopping', cor: '#9333ea' },
                        { linha: '450', nome: 'Lago Azul / Dom Pedro', cor: '#dc2626' },
                        { linha: '640', nome: 'Lago Azul / Sumaúma Park', cor: '#2563eb' },
                        { linha: '310', nome: 'Lago Azul / Tarumã (via Torquato)', cor: '#4a85dc' },
                    ],
                    'Village Torres': [
                        { linha: '120', nome: 'Lago Azul / Centro (via Torquato Tapajós)', cor: '#16a34a' },
                        { linha: '121', nome: 'Lago Azul / Terminal 6', cor: '#4a85dc' },
                        { linha: '122', nome: 'Lago Azul / Via Norte Shopping', cor: '#9333ea' },
                        { linha: '450', nome: 'Lago Azul / Dom Pedro', cor: '#dc2626' },
                        { linha: '640', nome: 'Lago Azul / Sumaúma Park', cor: '#2563eb' },
                    ],
                    'Bosque das Torres': [
                        { linha: '120', nome: 'Lago Azul / Centro (via Torquato Tapajós)', cor: '#16a34a' },
                        { linha: '121', nome: 'Lago Azul / Terminal 6', cor: '#4a85dc' },
                        { linha: '122', nome: 'Lago Azul / Via Norte Shopping', cor: '#9333ea' },
                        { linha: '450', nome: 'Lago Azul / Dom Pedro', cor: '#dc2626' },
                        { linha: '640', nome: 'Lago Azul / Sumaúma Park', cor: '#2563eb' },
                    ],
                    'Campo das Torres': [
                        { linha: '120', nome: 'Lago Azul / Centro (via Torquato Tapajós)', cor: '#16a34a' },
                        { linha: '121', nome: 'Lago Azul / Terminal 6', cor: '#4a85dc' },
                        { linha: '122', nome: 'Lago Azul / Via Norte Shopping', cor: '#9333ea' },
                        { linha: '450', nome: 'Lago Azul / Dom Pedro', cor: '#dc2626' },
                        { linha: '640', nome: 'Lago Azul / Sumaúma Park', cor: '#2563eb' },
                    ],
                    'Parque Ville Lírio Azul': [
                        { linha: '120', nome: 'Lago Azul / Centro (via Torquato Tapajós)', cor: '#16a34a' },
                        { linha: '121', nome: 'Lago Azul / Terminal 6', cor: '#4a85dc' },
                        { linha: '122', nome: 'Lago Azul / Via Norte Shopping', cor: '#9333ea' },
                        { linha: '450', nome: 'Lago Azul / Dom Pedro', cor: '#dc2626' },
                        { linha: '640', nome: 'Lago Azul / Sumaúma Park', cor: '#2563eb' },
                    ],
                    'Parque Ville Lírio Rosa': [
                        { linha: '120', nome: 'Lago Azul / Centro (via Torquato Tapajós)', cor: '#16a34a' },
                        { linha: '121', nome: 'Lago Azul / Terminal 6', cor: '#4a85dc' },
                        { linha: '122', nome: 'Lago Azul / Via Norte Shopping', cor: '#9333ea' },
                        { linha: '450', nome: 'Lago Azul / Dom Pedro', cor: '#dc2626' },
                        { linha: '640', nome: 'Lago Azul / Sumaúma Park', cor: '#2563eb' },
                    ],
                    'Conquista Jardim Botânico': [
                        { linha: '040', nome: 'Nova Cidade / Centro (via Torquato)', cor: '#16a34a' },
                        { linha: '041', nome: 'Nova Cidade / Sumaúma Park', cor: '#4a85dc' },
                        { linha: '042', nome: 'Nova Cidade / Via Norte / Dom Pedro', cor: '#9333ea' },
                        { linha: '640', nome: 'Nova Cidade / Terminal 6', cor: '#dc2626' },
                        { linha: '310', nome: 'Nova Cidade / Cachoeirinha / Centro', cor: '#2563eb' },
                    ],
                    'Viva Vida Coral': [
                        { linha: '051', nome: 'Colônia Terra Nova / Centro', cor: '#16a34a' },
                        { linha: '052', nome: 'Colônia Terra Nova / Sumaúma Park', cor: '#4a85dc' },
                        { linha: '053', nome: 'Colônia Terra Nova / Terminal 6', cor: '#9333ea' },
                        { linha: '054', nome: 'Colônia Terra Nova / Via Norte Shopping', cor: '#dc2626' },
                        { linha: '450', nome: 'Colônia Terra Nova / Dom Pedro', cor: '#2563eb' },
                    ],
                    'Viva Vida Safira': [
                        { linha: '051', nome: 'Colônia Terra Nova / Centro', cor: '#16a34a' },
                        { linha: '052', nome: 'Colônia Terra Nova / Sumaúma Park', cor: '#4a85dc' },
                        { linha: '053', nome: 'Colônia Terra Nova / Terminal 6', cor: '#9333ea' },
                        { linha: '054', nome: 'Colônia Terra Nova / Via Norte Shopping', cor: '#dc2626' },
                        { linha: '450', nome: 'Colônia Terra Nova / Dom Pedro', cor: '#2563eb' },
                    ],
                    'Conquista Topázio': [
                        { linha: '051', nome: 'Colônia Terra Nova / Centro', cor: '#16a34a' },
                        { linha: '052', nome: 'Colônia Terra Nova / Sumaúma Park', cor: '#4a85dc' },
                        { linha: '053', nome: 'Colônia Terra Nova / Terminal 6', cor: '#9333ea' },
                        { linha: '054', nome: 'Colônia Terra Nova / Via Norte Shopping', cor: '#dc2626' },
                        { linha: '450', nome: 'Colônia Terra Nova / Dom Pedro', cor: '#2563eb' },
                    ],
                    'Conquista Jardim Norte': [
                        { linha: '060', nome: 'Santa Etelvina / Centro (via Torquato)', cor: '#16a34a' },
                        { linha: '061', nome: 'Santa Etelvina / Via Norte Shopping', cor: '#4a85dc' },
                        { linha: '062', nome: 'Santa Etelvina / Terminal 6', cor: '#9333ea' },
                        { linha: '063', nome: 'Santa Etelvina / Sumaúma Park', cor: '#dc2626' },
                        { linha: '450', nome: 'Santa Etelvina / Dom Pedro / Centro', cor: '#2563eb' },
                    ],
                    'Viva Vida Rio Amazonas': [
                        { linha: '112', nome: 'Tarumã / Centro (via Av. Coronel Teixeira)', cor: '#16a34a' },
                        { linha: '113', nome: 'Tarumã / Ponta Negra / Aleixo', cor: '#4a85dc' },
                        { linha: '320', nome: 'Tarumã / Shopping Ponta Negra', cor: '#9333ea' },
                        { linha: '450', nome: 'Tarumã / Dom Pedro', cor: '#dc2626' },
                        { linha: '640', nome: 'Tarumã / Flores / Centro', cor: '#2563eb' },
                    ],
                    'Viva Vida Rio Tapajós': [
                        { linha: '112', nome: 'Tarumã / Centro (via Av. Coronel Teixeira)', cor: '#16a34a' },
                        { linha: '113', nome: 'Tarumã / Ponta Negra / Aleixo', cor: '#4a85dc' },
                        { linha: '320', nome: 'Tarumã / Shopping Ponta Negra', cor: '#9333ea' },
                        { linha: '450', nome: 'Tarumã / Dom Pedro', cor: '#dc2626' },
                        { linha: '640', nome: 'Tarumã / Flores / Centro', cor: '#2563eb' },
                    ],
                    'Amazon Boulevard Classic': [
                        { linha: '310', nome: 'Bairro da Paz / Centro (via Av. Constantino Nery)', cor: '#16a34a' },
                        { linha: '311', nome: 'Bairro da Paz / Arena da Amazônia', cor: '#4a85dc' },
                        { linha: '312', nome: 'Bairro da Paz / Dom Pedro / Flores', cor: '#9333ea' },
                        { linha: '450', nome: 'Bairro da Paz / Amazonas Shopping', cor: '#dc2626' },
                        { linha: '640', nome: 'Bairro da Paz / Cachoeirinha / Centro', cor: '#2563eb' },
                        { linha: '215', nome: 'Bairro da Paz / Coroado / UFAM', cor: '#4a85dc' },
                    ],
                    'Amazon Boulevard Prime': [
                        { linha: '310', nome: 'Bairro da Paz / Centro (via Av. Constantino Nery)', cor: '#16a34a' },
                        { linha: '311', nome: 'Bairro da Paz / Arena da Amazônia', cor: '#4a85dc' },
                        { linha: '312', nome: 'Bairro da Paz / Dom Pedro / Flores', cor: '#9333ea' },
                        { linha: '450', nome: 'Bairro da Paz / Amazonas Shopping', cor: '#dc2626' },
                        { linha: '640', nome: 'Bairro da Paz / Cachoeirinha / Centro', cor: '#2563eb' },
                        { linha: '215', nome: 'Bairro da Paz / Coroado / UFAM', cor: '#4a85dc' },
                    ],
                    'Città Oasis Azzure': [
                        { linha: '420', nome: 'Flores / Centro (via Av. Djalma Batista)', cor: '#16a34a' },
                        { linha: '421', nome: 'Flores / Ponta Negra (via Coronel Teixeira)', cor: '#4a85dc' },
                        { linha: '422', nome: 'Flores / Amazonas Shopping / Aleixo', cor: '#9333ea' },
                        { linha: '450', nome: 'Flores / Dom Pedro / Centro', cor: '#dc2626' },
                        { linha: '640', nome: 'Flores / Tarumã / Ponta Negra', cor: '#2563eb' },
                    ],
                    'Zenith Condomínio Clube': [
                        { linha: '520', nome: 'São Francisco / Centro (via Jorge Teixeira)', cor: '#16a34a' },
                        { linha: '521', nome: 'São Francisco / Cachoeirinha', cor: '#4a85dc' },
                        { linha: '522', nome: 'São Francisco / Coroado / UFAM', cor: '#9333ea' },
                        { linha: '450', nome: 'São Francisco / Dom Pedro / Centro', cor: '#dc2626' },
                        { linha: '215', nome: 'São Francisco / Distrito Industrial', cor: '#2563eb' },
                    ],
                    'Conquista Rio Negro': [
                        { linha: '113', nome: 'Ponta Negra / Centro (via Av. N.S. do Carmo)', cor: '#16a34a' },
                        { linha: '320', nome: 'Ponta Negra / Shopping Ponta Negra', cor: '#4a85dc' },
                        { linha: '421', nome: 'Ponta Negra / Flores / Aleixo', cor: '#9333ea' },
                        { linha: '450', nome: 'Ponta Negra / Dom Pedro / Centro', cor: '#dc2626' },
                        { linha: '640', nome: 'Ponta Negra / Tarumã / Centro', cor: '#2563eb' },
                    ],
                    'Encontro das Águas': [
                        { linha: '113', nome: 'Ponta Negra / Centro (via Av. N.S. do Carmo)', cor: '#16a34a' },
                        { linha: '320', nome: 'Ponta Negra / Shopping Ponta Negra', cor: '#4a85dc' },
                        { linha: '421', nome: 'Ponta Negra / Flores / Aleixo', cor: '#9333ea' },
                        { linha: '450', nome: 'Ponta Negra / Dom Pedro / Centro', cor: '#dc2626' },
                        { linha: '640', nome: 'Ponta Negra / Tarumã / Centro', cor: '#2563eb' },
                    ],
                    'Moratta Home Riva': [
                        { linha: '420', nome: 'Flores / Centro (via Av. Djalma Batista)', cor: '#16a34a' },
                        { linha: '421', nome: 'Flores / Amazonas Shopping / Aleixo', cor: '#4a85dc' },
                        { linha: '422', nome: 'Flores / Ponta Negra (via Coronel Teixeira)', cor: '#9333ea' },
                        { linha: '450', nome: 'Flores / Dom Pedro / Centro', cor: '#dc2626' },
                        { linha: '640', nome: 'Flores / Tarumã / Ponta Negra', cor: '#2563eb' },
                        { linha: '215', nome: 'Flores / Coroado / UFAM', cor: '#4a85dc' },
                    ],
                };

                const linhas = LINHAS_POR_EMPREENDIMENTO[selectedOnibus.title] || [];

                const closeOnibus = () => {
                    setClosingOnibus(true);
                    setTimeout(() => { setClosingOnibus(false); setSelectedOnibus(null); }, 280);
                };

                return (
                    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${closingOnibus ? 'zoom-origin-out' : 'zoom-origin-in'}`}
                        style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 0px))', paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))', background: modoNoturno ? 'rgba(7,11,22,0.55)' : 'rgba(226,232,240,0.60)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', '--ox': zoomOrigin.x, '--oy': zoomOrigin.y }}
                        onClick={closeOnibus}>
                        <div className={`w-full max-w-md overflow-hidden ${closingOnibus ? 'poi-modal-close' : 'poi-modal-open'}`}
                            style={{
                                borderRadius:'24px',
                                background: modoNoturno ? '#1e293b' : '#f8fafc',
                                border: modoNoturno ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(15,23,42,0.08)'
                            }}
                            onClick={e => e.stopPropagation()}>

                            {/* Header */}
                            <div className="p-4 flex justify-between items-center"
                                style={{ borderBottom: modoNoturno ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(15,23,42,0.08)' }}>
                                <h3 className={`font-bold flex items-center gap-2 ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>
                                    Linhas de Ônibus
                                </h3>
                                <button onClick={closeOnibus} className="text-slate-400 hover:text-slate-600 p-3 -m-2 rounded-full hover:bg-slate-200/40 transition-colors"><X size={24} /></button>
                            </div>

                            <div className="p-5">
                                <h4 className={`font-bold text-base mb-0.5 ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>{selectedOnibus.title}</h4>
                                <p className={`text-xs mb-4 flex items-center gap-1.5 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Linhas que passam próximo ao empreendimento
                                </p>

                                {/* Lista informativa — sem clique */}
                                <div className="flex flex-col gap-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                    {linhas.map((linha, idx) => (
                                        <div key={idx} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl"
                                            style={{ background: modoNoturno ? 'rgba(255,255,255,0.05)' : '#ffffff', border: modoNoturno ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(15,23,42,0.08)' }}>
                                            {/* Badge número da linha */}
                                            <div style={{ flexShrink: 0, background: linha.cor, borderRadius: 999, padding: '5px 11px', minWidth: 54, textAlign: 'center' }}>
                                                <span style={{ color: '#fff', fontWeight: 900, fontSize: 13, letterSpacing: '0.04em' }}>{linha.linha}</span>
                                            </div>
                                            <span className={`text-sm font-medium leading-snug ${modoNoturno ? 'text-slate-300' : 'text-slate-600'}`}>{linha.nome}</span>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={closeOnibus}
                                    className={`w-full mt-4 py-2.5 font-semibold rounded-xl transition-all text-sm active:scale-[0.98] ${modoNoturno ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}
                                    style={{ border: modoNoturno ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(15,23,42,0.08)', background: modoNoturno ? 'rgba(255,255,255,0.05)' : '#ffffff', cursor: 'pointer' }}>
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* --- BOTÃO FLUTUANTE DE PASTA (oculto — botões movidos para o header) --- */}
            <div className={`fixed bottom-8 right-8 z-40 flex flex-col items-end gap-3 transition-all duration-500 scale-0 opacity-0 pointer-events-none`}>

                <style dangerouslySetInnerHTML={{ __html: `

                    /* ── FONTE SF PRO — SISTEMA iOS/macOS ── */
                    *, *::before, *::after, input, textarea, button, select {
                        font-family: -apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif !important;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                    }

                    /* ── HEADER ANIMATION ── */
                    @keyframes header-slide-in {
                        0%   { transform: translateY(-110%); opacity: 0; }
                        60%  { opacity: 1; }
                        100% { transform: translateY(0);    opacity: 1; }
                    }
                    .header-slide-in { animation: header-slide-in 0.65s cubic-bezier(0.22,1,0.36,1) both; }

                    /* ── SEARCH INPUT ── */
                    .search-input-premium { transition: box-shadow 0.3s ease, background 0.3s ease; box-shadow: 0 1px 2px rgba(15,23,42,0.05); }
                    .search-input-premium:focus {
                        box-shadow: 0 0 0 2px rgba(99,102,241,0.25), 0 2px 8px rgba(99,102,241,0.08);
                    }

                    /* ── IA FLOATING BUTTON ── */
                    @keyframes ia-btn-enter {
                        0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
                        60%  { transform: scale(1.12) rotate(4deg); opacity: 1; }
                        80%  { transform: scale(0.96) rotate(-2deg); }
                        100% { transform: scale(1) rotate(0deg); opacity: 1; }
                    }
                    @keyframes ia-ring-spin {
                        0%   { transform: rotate(0deg);   opacity: 0.7; }
                        50%  { opacity: 1; }
                        100% { transform: rotate(360deg); opacity: 0.7; }
                    }
                    .ia-ring {
                        position: absolute; inset: -3px; border-radius: inherit;
                        border: 1.5px solid transparent;
                        border-top-color: rgba(255,255,255,0.6);
                        border-right-color: rgba(255,255,255,0.2);
                        animation: ia-ring-spin 2.4s linear infinite;
                        pointer-events: none;
                    }

                    /* ── CARD COVER SHINE ── */
                    .cover-shine { position: relative; }
                    @keyframes cover-shimmer {
                        0%   { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
                        10%  { opacity: 1; }
                        60%  { transform: translateX(220%) skewX(-15deg); opacity: 0.6; }
                        100% { transform: translateX(220%) skewX(-15deg); opacity: 0; }
                    }
                    .group:hover .cover-shine-layer {
                        animation: cover-shimmer 0.8s ease-out forwards;
                    }
                    /* ── BANNER ANIMATIONS ── */
                    @keyframes banner-reveal { from { opacity:0; transform:scale(1.03); } to { opacity:1; transform:scale(1); } }
                    .banner-reveal { animation: banner-reveal 0.9s cubic-bezier(0.22,1,0.36,1) both; }
                    @keyframes tab-brighten { 0% { background:rgba(255,255,255,0.07); box-shadow:none; } 100% { background:rgba(255,255,255,0.28); box-shadow:0 2px 14px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.35); } }
                    @keyframes poi-ring-pulse { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.18);opacity:.2} }
                    @keyframes ken-burns { 0% { transform:scale(1); } 100% { transform:scale(1.03); } }
                    .banner-ken-burns { animation: ken-burns 12s ease-in-out infinite alternate; }
                    @keyframes banner-text-up { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
                    .banner-text-1 { animation: banner-text-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
                    .banner-text-2 { animation: banner-text-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both; }
                    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                    @keyframes ripple-anim { 0% { transform: translate(-50%,-50%) scale(0); opacity:1; } 100% { transform: translate(-50%,-50%) scale(1); opacity:0; } }
                    @keyframes card-entry { 0% { opacity:0; transform:translateY(4px) scale(.97); } 100% { opacity:1; transform:translateY(0) scale(1); } }
                    @keyframes badge-pulse { 0%,100% { box-shadow:0 0 0 0 rgba(37,99,235,0.6), 0 0 0 0 rgba(37,99,235,0.3); } 50% { box-shadow:0 0 0 5px rgba(37,99,235,0.0), 0 0 0 10px rgba(37,99,235,0.0); } }
                    
                    .card-entry { opacity:0; animation: card-entry 0.55s cubic-bezier(.25,.46,.45,.94) both; }
                    .animate-float { animation: float 4s ease-in-out infinite; }
                    @keyframes logo-flip {
                        0%   { transform: rotateY(0deg);   }
                        25%  { transform: rotateY(180deg); }
                        50%  { transform: rotateY(360deg); }
                        75%  { transform: rotateY(360deg); }
                        100% { transform: rotateY(360deg); }
                    }
                    @keyframes btn-glow-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0), 0 8px 32px rgba(59,130,246,0.45); transform: scale(1); } 50% { box-shadow: 0 0 0 8px rgba(99,102,241,0.18), 0 8px 40px rgba(59,130,246,0.7); transform: scale(1.03); } }

                    /* ── CHAT BTN: porta aberta enquanto pills visíveis ── */
                    @keyframes chat-calling-pulse {
                        0%,100% { box-shadow: 0 0 0 0   rgba(99,102,241,0.0), 0 8px 28px rgba(59,130,246,0.5); transform: scale(1); }
                        40%     { box-shadow: 0 0 0 10px rgba(99,102,241,0.25), 0 8px 40px rgba(59,130,246,0.8); transform: scale(1.07); }
                        70%     { box-shadow: 0 0 0 18px rgba(99,102,241,0.08), 0 8px 50px rgba(59,130,246,0.5); transform: scale(1.02); }
                    }
                    @keyframes chat-ring-fast {
                        0%   { transform: rotate(0deg)   scaleX(1);    opacity: 0.9; }
                        50%  { transform: rotate(180deg) scaleX(-1);   opacity: 1;   }
                        100% { transform: rotate(360deg) scaleX(1);    opacity: 0.9; }
                    }
                    /* Absorção: botão estica e "engole" as pills */
                    @keyframes chat-absorb {
                        0%   { transform: scale(1);    border-radius: 1.75rem; box-shadow: 0 0 0 0   rgba(99,102,241,0),   0 8px 28px rgba(59,130,246,0.5); }
                        25%  { transform: scale(1.22); border-radius: 50%;     box-shadow: 0 0 0 20px rgba(99,102,241,0.3), 0 8px 60px rgba(59,130,246,1.0); }
                        55%  { transform: scale(0.88); border-radius: 50%;     box-shadow: 0 0 0 4px  rgba(99,102,241,0.1), 0 8px 20px rgba(59,130,246,0.4); }
                        80%  { transform: scale(1.05); border-radius: 50%; }
                        100% { transform: scale(1);    border-radius: 1.75rem; box-shadow: 0 0 0 0   rgba(99,102,241,0),   0 8px 28px rgba(59,130,246,0.45); }
                    }
                    .chat-btn-calling {
                        animation: ia-btn-enter 0.6s cubic-bezier(0.34,1.56,0.64,1) both,
                                   chat-calling-pulse 1.6s ease-in-out 0.6s infinite !important;
                    }
                    .chat-btn-calling .ia-ring {
                        animation: chat-ring-fast 0.9s linear infinite !important;
                        border-top-color: rgba(255,255,255,0.9) !important;
                        border-right-color: rgba(165,180,252,0.6) !important;
                    }
                    .chat-btn-absorb {
                        animation: chat-absorb 0.75s cubic-bezier(0.34,1.2,0.64,1) both !important;
                    }
                    @keyframes btn-shine-sweep { 0% { transform: translateX(-180%) skewX(-18deg); opacity:0; } 10% { opacity:1; } 55% { transform: translateX(280%) skewX(-18deg); opacity:0.8; } 100% { transform: translateX(280%) skewX(-18deg); opacity:0; } }
                    .btn-shine-layer { position:absolute; inset:0; overflow:hidden; border-radius:inherit; pointer-events:none; }
                    .btn-shine-layer::after { content:''; position:absolute; top:-20%; left:0; width:60%; height:140%; background: linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.32) 50%, transparent 90%); animation: btn-shine-sweep 3.8s ease-in-out infinite; }
                    @keyframes icon-pop { 0% { transform: scale(0.55) rotate(-10deg); opacity:0; } 60% { transform: scale(1.15) rotate(3deg); opacity:1; } 100% { transform: scale(1) rotate(0deg); opacity:1; } }
                    /* PDF loading bar that sweeps inside button */
                    @keyframes pdf-bar-sweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                    .pdf-loading-bar { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%); animation: pdf-bar-sweep 1.1s ease-in-out infinite; }
                    /* POI modal open animation */
                    @keyframes poi-backdrop-in  { from { opacity:0; } to   { opacity:1; } }
                    @keyframes poi-backdrop-out { from { opacity:1; } to   { opacity:0; } }
                    @keyframes poi-modal-in     { 0% { opacity:0; transform: scale(0.88) translateY(24px); } 60% { opacity:1; transform: scale(1.02) translateY(-3px); } 100% { opacity:1; transform: scale(1) translateY(0); } }
                    @keyframes poi-modal-close  { 0% { opacity:1; transform: scale(1) translateY(0); } 40% { opacity:1; transform: scale(1.02) translateY(-3px); } 100% { opacity:0; transform: scale(0.88) translateY(24px); } }
                    @keyframes poi-item-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
                    .poi-backdrop     { animation: poi-backdrop-in  0.22s ease both; }
                    .poi-backdrop-out { animation: poi-backdrop-out 0.30s ease both; }
                    .poi-modal-open   { animation: poi-modal-in    0.38s cubic-bezier(0.34,1.3,0.64,1) both; }
                    .poi-modal-close  { animation: poi-modal-close 0.30s cubic-bezier(0.4,0,0.6,1) both; }

                    /* ── Efeito "zoom a partir do elemento" (estilo abrir/fechar app iOS) ──
                       Usa clip-path circle() ancorado no ponto clicado (--ox/--oy, em px de viewport).
                       Só funciona corretamente em overlays fixed inset:0 (o próprio box = viewport). */
                    @keyframes zoom-origin-in {
                        0%   { opacity: 0; clip-path: circle(3% at var(--ox, 50%) var(--oy, 50%)); }
                        100% { opacity: 1; clip-path: circle(141% at var(--ox, 50%) var(--oy, 50%)); }
                    }
                    @keyframes zoom-origin-out {
                        0%   { opacity: 1; clip-path: circle(141% at var(--ox, 50%) var(--oy, 50%)); }
                        100% { opacity: 0; clip-path: circle(3% at var(--ox, 50%) var(--oy, 50%)); }
                    }
                    .zoom-origin-in  { animation: zoom-origin-in  0.45s cubic-bezier(0.22,1,0.36,1) both; }
                    .zoom-origin-out { animation: zoom-origin-out 0.32s cubic-bezier(0.4,0,1,1) both; }
                    /* Conteúdo interno ganha um leve scale+fade próprio, pra não "esticar" ao mesmo tempo do clip */
                    @keyframes zoom-origin-content-in { 0% { opacity:0; transform: scale(0.92); } 100% { opacity:1; transform: scale(1); } }
                    .zoom-origin-content-in { animation: zoom-origin-content-in 0.32s 0.08s cubic-bezier(0.22,1,0.36,1) both; }
                    .poi-item-in      { animation: poi-item-in 0.3s ease both; opacity:0; }
                    .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                    html { scroll-behavior: smooth; }
                    @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.34,1.2,0.64,1) both; }
                    @keyframes thumbsup { 0% { transform: scale(0) rotate(-20deg); opacity: 0; } 30% { transform: scale(1.3) rotate(8deg); opacity: 1; } 60% { transform: scale(1.1) rotate(-4deg); } 80% { transform: scale(1.15) rotate(2deg); opacity: 1; } 100% { transform: scale(1) rotate(0deg) translateY(-40px); opacity: 0; } }
                    .animate-thumbsup { animation: thumbsup 2.6s cubic-bezier(0.34,1.2,0.64,1) forwards; }
                    @keyframes lightning-bolt { 0% { transform: scale(0) rotate(-15deg); opacity: 0; filter: brightness(1); } 15% { transform: scale(1.4) rotate(5deg); opacity: 1; filter: brightness(2.5) drop-shadow(0 0 30px #fbbf24) drop-shadow(0 0 60px #2563eb); } 35% { transform: scale(1.1) rotate(-3deg); opacity: 1; filter: brightness(3) drop-shadow(0 0 40px #fbbf24) drop-shadow(0 0 80px #ef4444); } 55% { transform: scale(1.25) rotate(8deg); opacity: 1; filter: brightness(2) drop-shadow(0 0 50px #2563eb); } 80% { transform: scale(1.15) rotate(0deg); opacity: 0.9; filter: brightness(2.5) drop-shadow(0 0 60px #fbbf24); } 100% { transform: scale(0.8) rotate(-5deg) translateY(-60px); opacity: 0; filter: brightness(1); } }
                    .animate-lightning { animation: lightning-bolt 2.4s cubic-bezier(0.34,1.2,0.64,1) forwards; }
                    @keyframes flash-bg { 0%, 100% { opacity: 0; } 10% { opacity: 0.35; } 20% { opacity: 0; } 30% { opacity: 0.25; } 45% { opacity: 0; } 60% { opacity: 0.15; } 75% { opacity: 0; } }
                    .animate-flash { animation: flash-bg 2.4s ease-out forwards; }
                    @keyframes light-sweep { 0% { left: -60%; opacity: 0; } 10% { opacity: 1; } 60% { left: 130%; opacity: 0.7; } 100% { left: 130%; opacity: 0; } }
                    .pasta-rapida-btn::after { content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent); transform: skewX(-20deg); animation: light-sweep 1.4s ease-in-out infinite; pointer-events: none; border-radius: inherit; }
                    @keyframes pr-pulse { 0%, 100% { box-shadow: 0 0 0 3px rgba(37,99,235,0.35), 0 0 20px 6px rgba(37,99,235,0.45), 0 2px 8px rgba(0,0,0,0.2); transform: scale(1); } 50% { box-shadow: 0 0 0 5px rgba(37,99,235,0.2), 0 0 28px 10px rgba(37,99,235,0.6), 0 2px 8px rgba(0,0,0,0.2); transform: scale(1.04); } }
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    @keyframes pr-pulse { 0%, 100% { box-shadow: 0 0 0 2px rgba(37,99,235,0.4), 0 0 12px rgba(37,99,235,0.5); transform: scale(1); } 50% { box-shadow: 0 0 0 4px rgba(37,99,235,0.25), 0 0 22px rgba(37,99,235,0.7); transform: scale(1.04); } }

                    @keyframes btn-shine { 0% { transform: translateX(-180%) skewX(-18deg); opacity:0; } 10% { opacity:1; } 55% { transform: translateX(280%) skewX(-18deg); opacity:0.8; } 100% { transform: translateX(280%) skewX(-18deg); opacity:0; } }
                    .btn-shine-anim { position:absolute; inset:0; overflow:hidden; border-radius:inherit; pointer-events:none; }
                    .btn-shine-anim::after { content:''; position:absolute; top:-20%; left:0; width:60%; height:140%; background: linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.28) 50%, transparent 90%); animation: btn-shine 3.2s ease-in-out infinite; }
                    @keyframes modal-slide-in { 0% { opacity:0; transform: translateY(100%); } 60% { opacity:1; transform: translateY(-4px); } 100% { opacity:1; transform: translateY(0); } }
                    .modal-slide-open { animation: modal-slide-in 0.45s cubic-bezier(0.34,1.2,0.64,1) both; }
                    @keyframes field-in { 0% { opacity:0; transform: translateY(10px); } 100% { opacity:1; transform: translateY(0); } }
                    .field-animate { animation: field-in 0.3s ease both; }
                    /* Chat panel open / close */
                    @keyframes chat-open-kf  { 0% { opacity:0; transform: scale(0.88) translateY(20px); } 60% { opacity:1; transform: scale(1.01) translateY(-2px); } 100% { opacity:1; transform: scale(1) translateY(0); } }
                    @keyframes chat-close-kf { 0% { opacity:1; transform: scale(1) translateY(0); } 40% { opacity:1; transform: scale(1.01) translateY(-2px); } 100% { opacity:0; transform: scale(0.88) translateY(20px); } }
                    .chat-opening { animation: chat-open-kf  0.38s cubic-bezier(0.34,1.3,0.64,1) both; }
                    .chat-closing { animation: chat-close-kf 0.32s cubic-bezier(0.4,0,0.6,1) both; }
                    /* Mobile: chat ocupa tela cheia, começa em top:0 para preencher atrás do notch */
                    @media (max-width: 767px) {
                        .chat-mobile-full {
                            top: 0px !important;
                            height: 100dvh !important;
                        }
                        .chat-folder-full {
                            top: 0px !important;
                            left: 0px !important;
                            right: 0px !important;
                            bottom: 0px !important;
                            height: 100dvh !important;
                            border-radius: 0 !important;
                        }
                        /* Ambos começam em top:0, header compensa o notch */
                        .chat-mobile-full .pasta-header-safe,
                        .chat-folder-full .pasta-header-safe {
                            padding-top: calc(1.25rem + env(safe-area-inset-top, 0px)) !important;
                        }
                    }
                    /* Desktop chat flutuante: reseta top e height */
                    @media (min-width: 768px) {
                        .chat-mobile-full { top: auto !important; height: auto !important; }
                        .chat-folder-full { top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; height: 100dvh !important; border-radius: 0 !important; }
                    }
                    /* Header mobile: começa em top:0 (cobre a status bar) e o vidro vem do degradê interno */
                    @media (max-width: 639px) {
                        .hw-header.hdr-shown {
                            top: 0 !important;
                            padding-top: env(safe-area-inset-top, 0px) !important;
                            background: transparent !important;
                            backdrop-filter: none !important;
                            -webkit-backdrop-filter: none !important;
                            border-bottom: none !important;
                            box-shadow: none !important;
                            border-radius: 0 !important;
                        }
                    }
                    /* Padding do main para compensar o header fixed (inclui notch no PWA) */
                    .main-content { padding-top: calc(80px + env(safe-area-inset-top, 0px)); padding-bottom: calc(78px + env(safe-area-inset-bottom, 0px)); }
                    @media (min-width: 640px) { .main-content { padding-top: calc(80px + env(safe-area-inset-top, 0px)); padding-bottom: 0; } }
                    /* Folder → Chat collapse/expand */
                    @keyframes folder-collapse-kf { 0% { opacity:1; transform: scaleY(1) translateY(0); } 40% { opacity:0.6; transform: scaleY(0.85) translateY(8px); } 100% { opacity:0; transform: scaleY(0.55) translateY(20px); } }
                    @keyframes folder-expand-kf  { 0% { opacity:0; transform: scaleY(0.55) translateY(20px); } 60% { opacity:1; transform: scaleY(1.03) translateY(-3px); } 100% { opacity:1; transform: scaleY(1) translateY(0); } }
                    .folder-collapsing { animation: folder-collapse-kf 0.30s cubic-bezier(0.4,0,0.6,1) both; transform-origin: bottom center; }
                    .folder-expanding  { animation: folder-expand-kf  0.36s cubic-bezier(0.34,1.3,0.64,1) both; transform-origin: bottom center; }
                    /* === CARD ANIMATIONS DURING AI ANALYSIS === */
                    @keyframes card-pulse-fade {
                        0%,100% { opacity: 1; transform: scale(1); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                        50%     { opacity: 0.45; transform: scale(0.97); box-shadow: 0 0 0 2px rgba(37,99,235,0.4), 0 4px 16px rgba(37,99,235,0.25); }
                    }
                    @keyframes card-scatter-in {
                        0%   { opacity: 0; transform: scale(0.7) translateY(12px); }
                        60%  { opacity: 1; transform: scale(1.06) translateY(-3px); }
                        100% { opacity: 1; transform: scale(1) translateY(0); }
                    }
                    .card-analyzing { animation: card-pulse-fade 1.4s ease-in-out infinite; }
                    .card-scatter   { animation: card-scatter-in 0.5s cubic-bezier(0.34,1.4,0.64,1) both; }
                `}} />
            </div>

            {/* BACKDROP DO PAINEL CRIAR PASTA */}
            {isChatOpen && (
                <div
                    onClick={closeChat}
                    className="fixed inset-0 z-[45] transition-opacity duration-300"
                    style={{
                        background: modoNoturno ? 'rgba(7,11,22,0.55)' : 'rgba(226,232,240,0.55)',
                        backdropFilter: 'blur(12px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(12px) saturate(160%)',
                        opacity: closingChat ? 0 : 1
                    }}
                />
            )}

            {/* TOAST — CPF TEMPORÁRIO GERADO */}
            {cpfToast && (
                <div
                    className="fixed bottom-8 left-1/2 z-[70] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl"
                    style={{
                        transform: 'translateX(-50%)',
                        bottom: 'calc(32px + env(safe-area-inset-bottom, 0px))',
                        background: modoNoturno ? '#0f172a' : '#ffffff',
                        border: `1px solid ${modoNoturno ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)'}`,
                        animation: 'cpf-toast-in 0.28s cubic-bezier(0.34,1.3,0.64,1) both',
                    }}
                >
                    <CreditCard size={18} style={{ color: '#007aff', flexShrink: 0 }} />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: modoNoturno ? '#94a3b8' : '#64748b' }}>
                            {cpfToastCopiado ? 'CPF gerado e copiado' : 'CPF temporário gerado'}
                        </span>
                        <span className="text-sm font-black tracking-wide" style={{ color: modoNoturno ? '#f1f5f9' : '#1e293b' }}>{cpfToast}</span>
                    </div>
                    <button
                        onClick={() => { navigator.clipboard?.writeText(cpfToast).then(() => setCpfToastCopiado(true)).catch(() => {}); }}
                        className="p-2 rounded-xl transition-all active:scale-90"
                        style={{ background: modoNoturno ? 'rgba(0,122,255,0.15)' : 'rgba(0,122,255,0.10)' }}
                        title="Copiar CPF"
                    >
                        {cpfToastCopiado ? <Check size={16} style={{ color: '#22c55e' }} /> : <Copy size={16} style={{ color: '#007aff' }} />}
                    </button>
                    <style>{`@keyframes cpf-toast-in{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
                </div>
            )}

            {/* PAINEL CRIAR PASTA DO CLIENTE */}
            <div className={`fixed z-50 overflow-hidden flex flex-col shadow-2xl
                chat-folder-full
                ${isChatOpen ? (closingChat ? 'chat-closing' : 'chat-opening') : 'scale-0 opacity-0 pointer-events-none'}
                left-0 right-0 bottom-0 rounded-none
                ${modoNoturno ? 'bg-[#060a14]' : 'bg-[#f2f2f7]'}`}>

                <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    <img src={imagemDoDia} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'blur(38px) saturate(1.05)', transform: 'scale(1.25)' }} />
                    <div className="absolute inset-0" style={{ background: modoNoturno ? 'rgba(6,10,20,0.93)' : 'rgba(242,242,247,0.95)' }} />
                </div>
                {/* ── HEADER PASTA ── */}
                <div className="absolute top-0 inset-x-0 z-20" style={{ ...pastaGlass(modoNoturno, 0.3, 30), border: 'none', borderBottom: modoNoturno ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)', boxShadow: 'none' }}>
                    <div className="pasta-header-safe px-3 pb-3 flex items-center gap-3" style={{ paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))' }}>
                        <button onClick={() => { haptic(); closeChat(); }} aria-label="Fechar"
                            className={`pg ${modoNoturno ? 'pg-dark' : ''} w-11 h-11 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform`}
                            style={{ color: (modoNoturno ? '#ffffff' : '#1c1c1e') }}>
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex-1 min-w-0 text-center">
                            <p className="text-[17px] font-semibold leading-tight" style={{ color: (modoNoturno ? '#ffffff' : '#1c1c1e') }}>Pasta do cliente</p>
                            <p className="text-xs" style={{ color: (pendingDocs.length > 0 && estimateBytes() > MAX_PDF_BYTES) ? '#ff8a8a' : (modoNoturno ? 'rgba(235,235,245,0.62)' : '#4b5563') }}>
                                {pendingDocs.length === 0 ? 'Nenhum documento' : `${pendingDocs.length} ${pendingDocs.length === 1 ? 'documento' : 'documentos'} · ≈ ${fmtMB(estimateBytes())} de 10 MB`}
                            </p>
                        </div>
                        <button onClick={() => { haptic('light'); setShowOrdem((v) => !v); }} aria-label="Ordem sugerida" aria-expanded={showOrdem}
                            className={`pg ${modoNoturno ? 'pg-dark' : ''} w-11 h-11 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform`}
                            style={{ color: modoNoturno ? '#ffffff' : '#1c1c1e' }}>
                            <HelpCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {showOrdem && (
                    <div onClick={() => setShowOrdem(false)} className="absolute z-30 right-3 rounded-2xl p-4 w-[min(320px,calc(100%-24px))]"
                        style={{ ...pastaGlass(modoNoturno, 0.7, 40), top: 'calc(env(safe-area-inset-top, 0px) + 84px)', color: modoNoturno ? '#ffffff' : '#1c1c1e' }}>
                        <p className="text-[15px] font-semibold">Ordem sugerida</p>
                        <p className="text-[13px] mt-2 leading-snug"><b>1.</b> RG · CPF · Certidão · Residência</p>
                        <p className="text-[13px] mt-1 leading-snug"><b>2.</b> CTPS · Contracheque · Extrato · FGTS</p>
                        <p className="text-xs mt-2" style={{ color: modoNoturno ? 'rgba(235,235,245,0.62)' : '#4b5563' }}>Arraste os cards para reordenar.</p>
                    </div>
                )}

                {(

                    <div className={`relative flex-1 overflow-hidden flex flex-col transition-colors ${closingFolder ? 'folder-collapsing' : 'folder-expanding'}`}>

                        <div ref={cardGridRef} onClick={(e) => { if (!e.target.closest('[data-doc-index]')) setSelDocId(null); }} className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-40 relative" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 96px)', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', WebkitTouchCallout: 'none' }}>
                            {folderNotice && (
                                <div className="mb-3 rounded-2xl px-3 py-2 flex items-start gap-2 text-[11px] font-bold"
                                    style={{ background: modoNoturno ? 'rgba(234,179,8,0.12)' : '#fefce8', border: `1px solid ${modoNoturno ? 'rgba(234,179,8,0.3)' : '#fde68a'}`, color: modoNoturno ? '#fde68a' : '#854d0e' }}>
                                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                    <span className="flex-1">{folderNotice}</span>
                                    <button onClick={() => setFolderNotice('')} className="shrink-0"><X size={14} /></button>
                                </div>
                            )}

                            {savedDraft && pendingDocs.length === 0 && (
                                <div className="mb-3 rounded-2xl p-3 flex flex-col gap-2"
                                    style={{ background: modoNoturno ? 'rgba(74,133,220,0.12)' : '#eef2ff', border: `1px solid ${modoNoturno ? 'rgba(74,133,220,0.35)' : '#c7d2fe'}` }}>
                                    <p className="text-[12px] font-black" style={{ color: modoNoturno ? '#f1f5f9' : '#1e293b' }}>
                                        Você tem uma pasta em andamento{savedDraft.cliente ? ` (${savedDraft.cliente})` : ''}
                                    </p>
                                    <p className="text-[10px] font-semibold" style={{ color: modoNoturno ? '#94a3b8' : '#64748b' }}>
                                        {savedDraft.count} {savedDraft.count === 1 ? 'documento' : 'documentos'} · salva em {new Date(savedDraft.savedAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}. Se você adicionar arquivos sem continuar, ela será substituída.
                                    </p>
                                    <div className="flex gap-2">
                                        <button onClick={() => { haptic('medium'); restoreDraft(); }} className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white active:scale-95" style={{ background: '#4a85dc' }}>Continuar pasta</button>
                                        <button onClick={() => { haptic(); discardDraft(); }} className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest border active:scale-95" style={{ borderColor: modoNoturno ? '#334155' : '#e2e8f0', color: modoNoturno ? '#cbd5e1' : '#475569' }}>Descartar</button>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3" id="docs-grid">
                                {pendingDocs.map((doc, index) => {
                                    return (
                                    <div
                                        key={doc.id}
                                        data-doc-index={index}
                                        draggable={desktopPtr}
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onTouchStart={(e) => handleTouchStart(e, index)}
                                        onTouchMove={handleDragTouchMove}
                                        onTouchEnd={handleDragTouchEnd}
                                        onTouchCancel={handleDragTouchEnd}
                                        onClick={(e) => { if (isDraggingActive || suprimirClique.current) return; haptic('light'); if (desktopPtr || selDocId !== doc.id) { setSelDocId(doc.id); return; } captureZoomOrigin(e); setFullscreenDoc(doc); }}
                                        onDoubleClick={(e) => { if (desktopPtr && !isDraggingActive) { captureZoomOrigin(e); setFullscreenDoc(doc); } }}
                                        className={`relative group overflow-hidden flex flex-col cursor-move transition-all rounded-[14px] pg ${modoNoturno ? 'pg-dark' : ''} ${draggedItemIndex === index ? 'scale-90 opacity-30 rotate-3' : ''}`}
                                        style={{ WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none', ...(selDocId === doc.id ? { boxShadow: '0 0 0 3px #5aa9ff' } : null) }}>
                                        <div className="absolute top-1.5 left-1.5 text-[11px] font-semibold min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full z-10" style={pastaChip}>{index + 1}</div>
                                        <div className={`aspect-[3/4] w-full flex items-center justify-center overflow-hidden relative ${modoNoturno ? 'bg-slate-950' : 'bg-slate-100'}`} style={{ isolation: 'isolate' }}>
                                            {doc.broken && (
                                                <div className="absolute inset-0 z-[5] bg-red-600/85 text-white flex flex-col items-center justify-center p-1 text-center" title={doc.brokenMsg}>
                                                    <AlertTriangle size={24} />
                                                    <span className="text-[10px] font-black uppercase leading-tight mt-0.5">Não abre</span>
                                                </div>
                                            )}
                                            {doc.previewUrl ? (
                                                <>
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', willChange: 'transform', transform: `rotate(${doc.rotation || 0}deg)`, transformOrigin: 'center center' }}>
                                                        <img src={doc.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                                    </div>
                                                    {doc.file.type === 'application/pdf' && (
                                                        <div className="absolute top-1.5 right-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={pastaChip}>{doc.numPages ? (keptPageCount(doc) === doc.numPages ? `PDF · ${doc.numPages}p` : `PDF · ${keptPageCount(doc)}/${doc.numPages}p`) : 'PDF'}</div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1 text-slate-400">
                                                    <FileIcon size={36} className="text-red-400" />
                                                    <span className="text-[11px] font-black uppercase tracking-widest">PDF</span>
                                                </div>
                                            )}
                                        <div className="absolute inset-0 z-[6] pointer-events-none flex items-end">
                                            {selDocId === doc.id && (
                                                <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#5aa9ff', color: '#04142b' }}><Check size={16} /></span>
                                            )}
                                        </div>
                                        </div>
                                        <p className="px-2.5 py-2 text-[11px] leading-none truncate" title={doc.name} style={{ color: modoNoturno ? 'rgba(235,235,245,0.72)' : '#4b5563' }}>{doc.name.replace(/\.[^.]+$/, '')}</p>
                                        
                                    </div>
                                    );
                                })}
                                <button onClick={() => { haptic(); fileInputRef.current?.click(); }}
                                    className={`aspect-[3/4] pg ${modoNoturno ? 'pg-dark' : ''} rounded-[14px] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 border-[1.5px] border-dashed ${modoNoturno ? 'border-white/25 text-white/80' : 'border-slate-400/50 text-slate-600'}`}>
                                    <Plus size={26} />
                                    <span className="text-[11px] font-medium text-center leading-tight">Adicionar<br/>arquivo</span>
                                </button>
                                {(typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) && (
                                    <button onClick={abrirCamera}
                                        className={`aspect-[3/4] pg ${modoNoturno ? 'pg-dark' : ''} rounded-[14px] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 border-[1.5px] border-dashed ${modoNoturno ? 'border-white/25 text-white/80' : 'border-slate-400/50 text-slate-600'}`}>
                                        <IgCamera size={26} />
                                        <span className="text-[11px] font-medium text-center leading-tight">Tirar<br/>foto</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {pendingDocs.length > 0 && (() => {
                            const est = estimateBytes();
                            const passou = est > MAX_PDF_BYTES;
                            const selDoc = pendingDocs.find((d) => d.id === selDocId) || null;
                            const isImg = !!selDoc && selDoc.file.type.startsWith('image/') && !selDoc.broken;
                            const dockCls = 'pointer-events-auto h-[60px] rounded-full px-1.5 flex items-center shrink-0';
                            const ab = (on) => `${desktopPtr ? 'h-[48px] px-4 gap-2 text-sm font-medium' : 'w-[52px] h-[52px]'} rounded-full flex items-center justify-center transition-all active:scale-90 ${on ? '' : 'opacity-35 pointer-events-none'}`;
                            return (
                                <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none flex justify-center gap-2.5 px-4"
                                    style={{ paddingBottom: 'max(20px, calc(env(safe-area-inset-bottom) + 12px))' }}>
                                    <div className={dockCls} style={{ ...pastaGlass(modoNoturno, 0.42, 38), color: (modoNoturno ? '#ffffff' : '#1c1c1e') }}>
                                        {desktopPtr && (
                                            <button aria-label="Visualizar" className={ab(!!selDoc)} onClick={(e) => { haptic('light'); captureZoomOrigin(e); setFullscreenDoc(selDoc); }}><Eye size={20} />Ver</button>
                                        )}
                                        <button aria-label="Girar" className={ab(!!selDoc && !selDoc.broken)} onClick={() => { haptic('light'); updateDoc(selDoc.id, { rotation: (((selDoc.rotation || 0) + 90) % 360) }); }}><RotateCw size={desktopPtr ? 20 : 22} />{desktopPtr && 'Girar'}</button>
                                        <button aria-label="Ajustar foto" className={ab(isImg)} onClick={() => { haptic('light'); setEditingDoc(selDoc); }}><SlidersHorizontal size={desktopPtr ? 20 : 22} />{desktopPtr && 'Ajustar'}</button>
                                        <button aria-label="Excluir" className={ab(!!selDoc)} style={{ color: '#ff8a8a' }} onClick={() => { haptic('heavy'); removeDoc(selDoc.id); setSelDocId(null); }}><Trash2 size={desktopPtr ? 20 : 22} />{desktopPtr && 'Excluir'}</button>
                                    </div>
                                    <button onClick={(e) => { haptic('medium'); captureZoomOrigin(e); openFinalize(); }}
                                        className={`pointer-events-auto h-[60px] rounded-full text-white font-semibold text-[17px] flex items-center justify-center gap-2 active:scale-95 transition-transform ${desktopPtr ? 'px-8' : 'flex-1'}`}
                                        style={{ background: '#0a64d8', boxShadow: '0 8px 24px rgba(10,100,216,0.45)' }}>
                                        <Wand2 size={20} />
                                        <span>Finalizar PDF</span>
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* Inputs de arquivo ocultos, usados pelos botões de Criar Pasta espalhados pelo app */}
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple accept="image/*,application/pdf" className="hidden" />
                <input type="file" ref={cameraInputRef} onChange={handleCameraUpload} accept="image/*" capture="environment" className="hidden" />
            </div>
            
            {/* MODAL PARA FINALIZAR — estilo "Segmentos" */}
            {isFinalizingFolder && (() => {
                const mut = modoNoturno ? 'rgba(235,235,245,0.62)' : '#6b7280';
                const fillBg = modoNoturno ? 'rgba(120,120,128,0.24)' : 'rgba(120,120,128,0.12)';
                const docBytes = (doc) => {
                    if (doc.file.type === 'application/pdf') {
                        const kept = keptPageCount(doc);
                        const frac = (doc.numPages && kept != null) ? kept / doc.numPages : 1;
                        return doc.file.size * frac;
                    }
                    return Math.min(doc.file.size, 650 * 1024);
                };
                const total = estimateBytes();
                const estourou = total > MAX_PDF_BYTES;
                const livre = Math.max(0, MAX_PDF_BYTES - total);
                const sel = pendingDocs.find(d => d.id === segSel);
                return (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
                    style={{ background: 'rgba(6,10,20,0.4)', backdropFilter: 'blur(16px) saturate(160%)', WebkitBackdropFilter: 'blur(16px) saturate(160%)', animation: 'gmFade 0.18s ease both', paddingBottom: vv.teclado }}
                    onClick={() => !isChatLoading && setIsFinalizingFolder(false)}>
                    <div
                        className="w-full sm:max-w-sm rounded-t-[28px] sm:rounded-[28px] overflow-y-auto flex flex-col"
                        style={{ ...pastaGlass(modoNoturno, modoNoturno ? 0.6 : 0.78, 40), color: (modoNoturno ? '#ffffff' : '#1c1c1e'), maxHeight: Math.max(240, vv.altura - 12), animation: 'gmSheet 0.24s cubic-bezier(0.22,1,0.36,1) both', overscrollBehavior: 'contain' }}
                        onClick={e => e.stopPropagation()}>

                        {/* Alça (mobile) */}
                        <div className="sm:hidden flex justify-center pt-2.5">
                            <div className="w-10 h-1 rounded-full" style={{ background: modoNoturno ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.18)' }}></div>
                        </div>

                        <div className="px-6 pt-5 pb-2">
                            {/* Cabeçalho */}
                            <div className="flex items-center justify-between">
                                <p className="text-[13px] font-semibold" style={{ color: mut }}>Salvar pasta</p>
                                {!isChatLoading && (
                                    <button onClick={() => setIsFinalizingFolder(false)} className="text-[15px] font-medium" style={{ color: modoNoturno ? '#5aa9ff' : '#0a64d8' }}>Cancelar</button>
                                )}
                            </div>

                            {/* Tamanho */}
                            <div className="mt-1 text-[34px] font-bold tracking-tight leading-tight" style={{ color: estourou ? '#f59e0b' : undefined }}>
                                {fmtMB(total)} <span className="text-[15px] font-medium tracking-normal" style={{ color: mut }}>de 10 MB</span>
                            </div>

                            {/* Segmentos: um por documento */}
                            <div className="flex gap-[3px] h-[34px] mt-3.5" role="group" aria-label="Documentos da pasta">
                                {pendingDocs.map(doc => {
                                    const ativo = segSel === doc.id;
                                    return (
                                        <button key={doc.id} type="button" aria-label={`${doc.name}, ${fmtMB(docBytes(doc))}`}
                                            onClick={() => setSegSel(ativo ? null : doc.id)}
                                            className="rounded-md transition-all"
                                            style={{ flexGrow: Math.max(docBytes(doc), MAX_PDF_BYTES * 0.012), flexBasis: 0, minWidth: 6, background: estourou ? '#f59e0b' : '#0a64d8', opacity: segSel ? (ativo ? 1 : 0.3) : 0.85, transform: ativo ? 'scaleY(1.14)' : 'none' }} />
                                    );
                                })}
                                {livre > 0 && <div className="rounded-md" style={{ flexGrow: livre, flexBasis: 0, background: fillBg }} />}
                            </div>
                            <p className="mt-2.5 text-[13px] truncate" style={{ color: estourou ? '#f59e0b' : mut, minHeight: 18 }}>
                                {isChatLoading
                                    ? (genProgress.label || 'Gerando PDF...')
                                    : sel
                                        ? `${sel.name} · ${fmtMB(docBytes(sel))}`
                                        : `${pendingDocs.length} ${pendingDocs.length === 1 ? 'documento' : 'documentos'}${estourou ? ' · será comprimido (mais lento)' : ' · toque em um segmento'}`}
                            </p>

                            {/* Nome */}
                            <div className="mt-4 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-[#5aa9ff]" style={{ background: fillBg }}>
                                <input
                                    id="pasta-nome-arquivo"
                                    type="text"
                                    value={pdfFileName}
                                    onChange={(e) => setPdfFileName(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !isChatLoading) { haptic('success'); generateClientPDF(); } }}
                                    disabled={isChatLoading}
                                    aria-label="Nome do arquivo"
                                    className={`w-full text-[17px] px-4 py-3.5 font-semibold bg-transparent border-none outline-none ${modoNoturno ? 'text-white placeholder-white/40' : 'text-slate-900 placeholder-slate-400'}`}
                                    placeholder="Nomear pasta"
                                    ref={nomeInputRef}
                                />
                            </div>
                            {!isChatLoading && sugestaoNome && pdfFileName !== sugestaoNome && (
                                <button onClick={() => setPdfFileName(sugestaoNome)} className="mt-2.5 text-[13px] font-medium" style={{ color: modoNoturno ? '#5aa9ff' : '#0a64d8' }}>
                                    Usar sugestão: {sugestaoNome}
                                </button>
                            )}
                            {genError && <p className="mt-2 text-xs font-medium" style={{ color: '#ff8a8a' }}>{genError}</p>}
                        </div>

                        {/* Rodapé */}
                        <div className="px-6 pt-3" style={{ paddingBottom: vv.tecladoAberto ? 16 : 'max(24px, calc(env(safe-area-inset-bottom) + 16px))' }}>
                            <button onClick={() => { haptic('success'); generateClientPDF(); }} disabled={isChatLoading}
                                className="w-full h-14 text-[17px] rounded-full font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden active:scale-[0.98]"
                                style={{ background: '#0a64d8', color: '#ffffff', boxShadow: '0 8px 24px rgba(10,100,216,0.45)' }}>
                                {isChatLoading && (
                                    <div className="absolute inset-y-0 left-0 transition-all duration-300 ease-out" style={{ width: `${genProgress.pct}%`, background: 'rgba(255,255,255,0.3)' }}></div>
                                )}
                                <span className="relative">{isChatLoading ? `${genProgress.pct}%` : 'Baixar PDF'}</span>
                            </button>
                        </div>
                    </div>
                </div>
                );
            })()}

            {/* ANIMAÇÃO ⚡ RELÂMPAGO PÓS-DOWNLOAD */}
            {showLightning && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none">
                    {/* Flash de fundo laranja */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/40 via-blue-500/30 to-blue-800/20 animate-flash"></div>
                    {/* Raios de luz espalhados */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {[0,45,90,135,180,225,270,315].map((deg, i) => (
                            <div key={i} className="absolute w-1 rounded-full animate-flash"
                                style={{
                                    height: `${60 + (i % 3) * 30}px`,
                                    background: 'linear-gradient(to bottom, #fbbf24, transparent)',
                                    transform: `rotate(${deg}deg) translateY(-80px)`,
                                    animationDelay: `${i * 0.05}s`,
                                    opacity: 0.7,
                                    filter: 'blur(1px)',
                                }}
                            />
                        ))}
                    </div>
                    {/* Círculo de brilho */}
                    <div className="absolute w-64 h-64 rounded-full animate-flash"
                        style={{background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(37,99,235,0.2) 50%, transparent 70%)'}}
                    />
                    {/* Relâmpago principal */}
                    <div className="animate-lightning select-none" style={{fontSize: '140px', filter: 'drop-shadow(0 0 20px #fbbf24) drop-shadow(0 0 40px #2563eb) drop-shadow(0 0 80px #ef4444)'}}>
                        ⚡
                    </div>
                </div>
            )}

            {/* GHOST FLUTUANTE DE DRAG */}
            {isDraggingActive && draggedItemIndex !== null && pendingDocs[draggedItemIndex] && (dragGhostPos.x > 0 || dragGhostPos.y > 0) && (
                <div
                    className="fixed z-[200] pointer-events-none"
                    style={{
                        left: dragGhostPos.x - 30,
                        top: dragGhostPos.y - 40,
                        transform: 'rotate(-6deg) scale(1.08)',
                        transition: 'transform 0.1s ease',
                    }}
                >
                    <div className="w-16 h-20 rounded-xl overflow-hidden shadow-2xl border-2 border-blue-500 bg-white"
                        style={{ boxShadow: '0 12px 40px rgba(37,99,235,0.45), 0 2px 8px rgba(0,0,0,0.25)' }}
                    >
                        {pendingDocs[draggedItemIndex].previewUrl ? (
                            <img src={pendingDocs[draggedItemIndex].previewUrl} alt="drag" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 gap-1">
                                <FileIcon size={22} className="text-red-400" />
                                <span className="text-[7px] font-black text-slate-400 uppercase">PDF</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-3 rounded-full bg-blue-500/30 blur-md animate-pulse"></div>
                </div>
            )}

            {/* MODAL: PDF PRONTO — compartilhar / baixar de novo */}
            {generatedPdf && (() => {
                let podeCompartilhar = false;
                try {
                    podeCompartilhar = !!(navigator.share && navigator.canShare && navigator.canShare({ files: [new File([generatedPdf.blob], generatedPdf.name, { type: 'application/pdf' })] }));
                } catch { podeCompartilhar = false; }
                const ink = modoNoturno ? '#f1f5f9' : '#1e293b';
                const soft = modoNoturno ? '#94a3b8' : '#64748b';
                return (
                    <div className="fixed inset-0 z-[310] flex items-end sm:items-center justify-center p-0 sm:p-4"
                        style={{ background: 'rgba(7,13,22,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                        onClick={() => setGeneratedPdf(null)}>
                        <div className="animate-slide-up w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl p-5"
                            style={{ background: modoNoturno ? '#0f172a' : '#ffffff', paddingBottom: 'max(20px, calc(env(safe-area-inset-bottom) + 12px))' }}
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-emerald-500 text-white p-2.5 rounded-2xl"><Check size={22} /></div>
                                <div className="min-w-0">
                                    <h3 className="font-black text-lg" style={{ color: ink }}>PDF pronto!</h3>
                                    <p className="text-[11px] font-bold truncate" style={{ color: soft }}>{generatedPdf.name} · {fmtMB(generatedPdf.size)}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                {podeCompartilhar && (
                                    <button onClick={() => { haptic('success'); compartilharPdf(); }}
                                        className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 active:scale-[0.98]"
                                        style={{ background: 'linear-gradient(135deg, #4a85dc 0%, #4a85dc 100%)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                                        <Share2 size={16} /> Compartilhar
                                    </button>
                                )}
                                <button onClick={() => { haptic(); baixarNovamente(); }}
                                    className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border active:scale-[0.98]"
                                    style={{ borderColor: modoNoturno ? '#334155' : '#e2e8f0', color: ink }}>
                                    <Download size={16} /> Baixar de novo
                                </button>
                                <button onClick={() => setGeneratedPdf(null)} className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest" style={{ color: soft }}>Fechar</button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* EDITOR DE FOTO e CÂMERA DO COMPUTADOR */}
            {editingDoc && (
                <FotoEditor file={editingDoc.originalFile || editingDoc.file} inicial={editingDoc.ajustes} dark={modoNoturno}
                    onCancel={() => setEditingDoc(null)} onApply={aplicarFotoEditada} />
            )}
            {fotoCamera && (
                <FotoEditor file={fotoCamera} dark={modoNoturno} rotuloCancelar="Descartar"
                    onCancel={() => setFotoCamera(null)}
                    onApply={(novo, aj) => { const bruto = fotoCamera; setFotoCamera(null); addFiles([novo], { originalFile: bruto, ajustes: aj }); }} />
            )}
            {showWebcam && (
                <WebcamModal dark={modoNoturno} onClose={() => setShowWebcam(false)} onCapture={(f) => addFiles([f])} />
            )}

            {/* MODAL FULLSCREEN DE VISUALIZAÇÃO DE DOCUMENTO */}
            {fullscreenDoc && (
                <div
                    className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md zoom-origin-in"
                    style={{ '--ox': zoomOrigin.x, '--oy': zoomOrigin.y }}
                    onClick={() => setFullscreenDoc(null)}
                >
                    <div
                        className="relative w-full h-full flex flex-col items-center justify-center p-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 bg-gradient-to-b from-black/80 to-transparent z-10"
                            style={{ paddingTop: 'max(16px, calc(env(safe-area-inset-top, 0px) + 8px))' }}>
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-700 p-2 rounded-xl">
                                    <FileIcon size={16} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-sm uppercase tracking-wide truncate max-w-[200px] sm:max-w-xs">{fullscreenDoc.name}</p>
                                    <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">
                                        {fullscreenDoc.file.type === 'application/pdf'
                                            ? (previewLoading ? 'PDF · carregando...' : `PDF · ${previewPages.length ? paginasTexto(fullscreenDoc, previewPages.length) : '0 páginas'}`)
                                            : 'Imagem'}
                                        {' · '}{(fullscreenDoc.file.size / 1024).toFixed(0)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setFullscreenDoc(null)}
                                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl transition-all border border-white/10 backdrop-blur-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="w-full flex-1 min-h-0 overflow-y-auto"
                            style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch', paddingTop: 'calc(72px + env(safe-area-inset-top, 0px))', paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0px))' }}
                            onClick={() => setFullscreenDoc(null)}>
                            {fullscreenDoc.file.type === 'application/pdf' ? (
                                <div className="flex flex-col items-center gap-4 px-1">
                                    {(previewPages.length ? getEdits(fullscreenDoc, previewPages.length) : []).map((ed, pos, arr) => (
                                        <div key={ed.i} className="relative w-full flex justify-center" onClick={(e) => e.stopPropagation()}>
                                            <RotatedImg src={previewPages[ed.i]} rot={(fullscreenDoc.rotation || 0) + ed.rot}
                                                alt={`${fullscreenDoc.name} — página ${pos + 1}`}
                                                className="rounded-xl shadow-2xl bg-white transition-opacity"
                                                style={{ width: '100%', maxWidth: 900, height: 'auto', opacity: ed.del ? 0.22 : 1 }} />
                                            <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-black px-2 py-1 rounded-lg backdrop-blur-sm">
                                                {pos + 1}{!previewLoading ? ` / ${arr.length}` : ''}
                                            </span>
                                            {ed.del && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <span className="bg-black/70 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">Página excluída</span>
                                                </div>
                                            )}
                                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/65 backdrop-blur-sm rounded-xl p-1">
                                                <button onClick={() => { haptic('light'); movePage(pos, -1); }} disabled={pos === 0} className="p-2.5 rounded-lg text-white hover:bg-white/20 disabled:opacity-30" title="Mover para cima"><ArrowUp size={16} /></button>
                                                <button onClick={() => { haptic('light'); movePage(pos, 1); }} disabled={pos === arr.length - 1} className="p-2.5 rounded-lg text-white hover:bg-white/20 disabled:opacity-30" title="Mover para baixo"><ArrowDown size={16} /></button>
                                                <button onClick={() => { haptic('light'); rotatePage(pos, 'ccw'); }} className="p-2.5 rounded-lg text-white hover:bg-white/20" title="Girar para a esquerda"><RotateCcw size={16} /></button>
                                                <button onClick={() => { haptic('light'); rotatePage(pos, 'cw'); }} className="p-2.5 rounded-lg text-white hover:bg-white/20" title="Girar para a direita"><RotateCw size={16} /></button>
                                                <button onClick={() => { haptic('medium'); togglePage(pos); }} className={`p-2.5 rounded-lg text-white hover:bg-white/20 ${ed.del ? 'bg-emerald-600/80' : ''}`} title={ed.del ? 'Restaurar página' : 'Excluir página'}>
                                                    {ed.del ? <span className="text-[10px] font-black uppercase px-1">Restaurar</span> : <Trash2 size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {previewLoading && (
                                        <div className="flex flex-col items-center gap-2 py-6 text-white/60">
                                            <div className="w-8 h-8 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
                                            <p className="text-[10px] font-black uppercase tracking-widest">
                                                {previewPages.length === 0 ? 'Carregando páginas...' : `Carregando página ${previewPages.length + 1}...`}
                                            </p>
                                        </div>
                                    )}
                                    {!previewLoading && previewPages.length === 0 && (
                                        <div className="flex flex-col items-center justify-center gap-6 text-white/60 py-16">
                                            <div className="bg-white/10 p-10 rounded-3xl border border-white/10">
                                                <FileIcon size={64} className="text-red-400" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-white font-black text-lg">Pré-visualização indisponível</p>
                                                <p className="text-white/40 text-sm mt-1">Este PDF não pôde ser renderizado</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : fullscreenDoc.previewUrl ? (
                                <div className="w-full min-h-full flex items-center justify-center">
                                    <img
                                        src={fullscreenDoc.previewUrl}
                                        alt={fullscreenDoc.name}
                                        onClick={(e) => e.stopPropagation()}
                                        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                                        style={{ maxHeight: 'calc(100vh - 100px)', transform: `rotate(${fullscreenDoc.rotation || 0}deg)` }}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-6 text-white/60 py-16">
                                    <div className="bg-white/10 p-10 rounded-3xl border border-white/10">
                                        <FileIcon size={64} className="text-red-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-black text-lg">Pré-visualização indisponível</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="absolute left-0 right-0 text-center text-white/30 text-[10px] font-bold uppercase tracking-widest pointer-events-none" style={{ bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>Role para ver as páginas · use os botões para excluir, mover ou girar · toque fora para fechar</p>
                    </div>
                </div>
            )}

            {/* ── MODAL: Calculadora ITBI ── */}
            {showCalculadoraItbiModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 zoom-origin-in"
                    style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 0px))', paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))', background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(12px) saturate(160%)', WebkitBackdropFilter: 'blur(12px) saturate(160%)', '--ox': zoomOrigin.x, '--oy': zoomOrigin.y }}
                    onClick={() => setShowCalculadoraItbiModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="modal-slide-open w-full"
                        style={{ maxWidth: 400, height: 600, maxHeight: '88vh' }}
                    >
                        <iframe
                            key={modoNoturno ? 'itbi-dark' : 'itbi-light'}
                            srcDoc={`<!DOCTYPE html>
<html lang="pt-BR" data-theme="${modoNoturno ? 'dark' : 'light'}">
<head>
<meta charset="utf-8">
<title>Calcular ITBI</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>
:root{--sheet:rgba(255,255,255,.96);--fg:#1c1c1e;--mut:#6b7280;--fill:rgba(120,120,128,.12);--line:rgba(60,60,67,.18);--blue:#0a64d8}
:root[data-theme="dark"]{--sheet:rgba(28,32,44,.96);--fg:#fff;--mut:rgba(235,235,245,.6);--fill:rgba(120,120,128,.24);--line:rgba(255,255,255,.18);--blue:#4da3ff}
*{box-sizing:border-box}
html,body{margin:0;height:100%}
body{background:transparent;color:var(--fg);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased;display:flex;align-items:center;justify-content:center;padding:4px}
.sheet{width:100%;max-width:360px;background:var(--sheet);border-radius:28px;padding:22px;box-shadow:0 0 0 .5px var(--line)}
.hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.hd h1{margin:0;font-size:17px;font-weight:600}
.txt{border:0;background:none;color:var(--blue);font-size:15px;font-weight:500;font-family:inherit;cursor:pointer;padding:0}
.cap{font-size:13px;font-weight:600;color:var(--mut);margin:0}
.inp{display:flex;align-items:baseline;gap:6px;background:var(--fill);border-radius:14px;padding:12px 16px}
.inp span{color:var(--mut);font-weight:600;font-size:17px}
.inp input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--fg);font-size:22px;font-weight:600;font-family:inherit;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.inp input::placeholder{color:var(--mut);opacity:.55;font-weight:500;font-size:17px}
.tl{margin-top:24px}
.big{font-size:44px;font-weight:700;letter-spacing:-.04em;line-height:1.05;margin-top:4px;font-variant-numeric:tabular-nums;transition:opacity .3s}
.big small{font-size:.45em;font-weight:600;color:var(--mut);letter-spacing:0;margin-right:6px}
.big.off{color:var(--mut);opacity:.45}
.bar{position:relative;height:28px;margin:18px 0 8px}
.bar:before{content:"";position:absolute;left:5px;right:5px;top:13px;height:2px;background:var(--line)}
.bar i{position:absolute;top:8px;width:12px;height:12px;border-radius:50%;background:var(--blue)}
.bar i:first-child{left:0}.bar i:last-child{right:0}
.bar b{position:absolute;left:50%;top:0;transform:translateX(-50%);background:var(--sheet);padding:0 10px;font-size:13px;color:var(--mut);font-weight:600;line-height:28px;white-space:nowrap}
.ends{display:flex;justify-content:space-between}
.ends div:last-child{text-align:right}
.ends small{display:block;font-size:12px;color:var(--mut)}
.ends b{font-size:17px;text-transform:capitalize;font-variant-numeric:tabular-nums}
.rev{display:block;margin:22px 0 0;padding:0;border:0;background:none;color:var(--blue);font-size:15px;font-weight:500;font-family:inherit;cursor:pointer}
.tot{display:grid;grid-template-rows:0fr;transition:grid-template-rows .35s cubic-bezier(.3,1,.4,1),opacity .3s;opacity:0}
.tot>div{overflow:hidden}
.tot.show{grid-template-rows:1fr;opacity:1}
.tot .in{display:flex;justify-content:space-between;align-items:baseline;margin-top:10px;padding:14px 16px;border-radius:14px;background:var(--fill)}
.tot .in span{font-size:15px;color:var(--mut)}
.tot .in b{font-size:22px;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.foot{margin:20px 0 0;font-size:12px;color:var(--mut);line-height:1.5}
</style>
</head>
<body>
<div class="sheet">
  <div class="hd"><h1>Calcular ITBI</h1><button class="txt" id="fc" type="button">Fechar</button></div>
  <div class="inp"><span>R$</span><input id="val" inputmode="numeric" autocomplete="off" placeholder="Valor da documentação" aria-label="Valor da documentação"></div>
  <div class="tl">
    <p class="cap">Parcela mensal</p>
    <div class="big off" id="hp"><small>40x de</small>R$ 0,00</div>
    <div class="bar"><i></i><b>40 meses</b><i></i></div>
    <div class="ends"><div><small>1ª parcela · em 120 dias</small><b id="d1"></b></div><div><small>40ª parcela</small><b id="d2"></b></div></div>
  </div>
  <button class="rev" id="rv" type="button">Ver total a prazo</button>
  <div class="tot" id="tot"><div><div class="in"><span>Total a prazo</span><b id="tv">—</b></div></div></div>
  <p class="foot">Boleto em 40x, juros de 1,49% a.m. A 1ª parcela vence 120 dias (4 meses) após a contratação. Valores estimados, sujeitos à confirmação junto ao cartório.</p>
</div>
<script>
var R=.0149,N=40,cents=0,$=function(i){return document.getElementById(i)};
var MES=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
function mes(add){var d=new Date();d.setDate(1);d.setMonth(d.getMonth()+add);return MES[d.getMonth()]+" "+d.getFullYear()}
var brl=function(v){return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})};
var num=function(v){return v.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})};
$("d1").textContent=mes(4);$("d2").textContent=mes(4+N-1);
function upd(){
 var c=cents/100*1.032,p=c*R/(1-Math.pow(1+R,-N)),has=cents>0;
 $("hp").className="big"+(has?"":" off");
 $("hp").innerHTML="<small>40x de</small>"+(has?brl(p):"R$ 0,00");
 $("tv").textContent=has?brl(p*N):"—";
}
var v=$("val");
v.oninput=function(){var d=v.value.replace(/\\D/g,"").slice(0,9);cents=+d||0;v.value=cents?num(cents/100):"";upd()};
$("rv").onclick=function(){var t=$("tot"),s=t.classList.toggle("show");this.textContent=s?"Ocultar total a prazo":"Ver total a prazo"};
$("fc").onclick=function(){parent.postMessage("fechar-itbi","*")};
document.body.onclick=function(e){if(e.target===document.body)parent.postMessage("fechar-itbi","*")};
</script>
</body>
</html>`}
                            className="w-full h-full border-0"
                            title="Calcular ITBI"
                            style={{ background: 'transparent' }}
                        />
                    </div>
                </div>
            )}

            {/* ── MODAL: Tabelas (pasta do Drive embutida) ── */}
            {showTabelasModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 zoom-origin-in"
                    style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 0px))', paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))', background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(12px) saturate(160%)', WebkitBackdropFilter: 'blur(12px) saturate(160%)', '--ox': zoomOrigin.x, '--oy': zoomOrigin.y }}
                    onClick={() => setShowTabelasModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="modal-slide-open w-full"
                        style={{
                            maxWidth: 520,
                            borderRadius: 20,
                            overflow: 'hidden',
                            background: modoNoturno ? '#0f172a' : '#ffffff',
                            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                            border: modoNoturno ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.06)',
                        }}
                    >
                        <div className="relative overflow-hidden shrink-0"
                            style={{
                                background: modoNoturno ? '#0f172a' : '#ffffff',
                                borderBottom: `1px solid ${modoNoturno ? '#1e293b' : '#e2e8f0'}`,
                            }}>
                            <div className="relative z-10 flex items-center gap-3 px-5 py-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-widest truncate" style={{ color: '#007aff' }}>Drive · Documentos</p>
                                    <h2 className="font-black text-lg truncate" style={{ color: modoNoturno ? '#f1f5f9' : '#1e293b' }}>Tabelas</h2>
                                </div>
                                <a
                                    href="https://drive.google.com/drive/folders/14mYfQkNaSc9APr6hpOTKKTFQ02oq3uOf?usp=sharing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all shrink-0"
                                    style={{
                                        background: modoNoturno ? '#1e293b' : '#f8fafc',
                                        color: modoNoturno ? '#94a3b8' : '#64748b',
                                    }}
                                    title="Abrir no Google Drive"
                                >
                                    Abrir no Drive
                                </a>
                                <button onClick={() => setShowTabelasModal(false)}
                                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-90 shrink-0"
                                    style={{ background: modoNoturno ? '#1e293b' : '#f8fafc' }}>
                                    <X size={20} color={modoNoturno ? '#94a3b8' : '#64748b'} />
                                </button>
                            </div>
                        </div>
                        <div className="relative overflow-y-auto" style={{ maxHeight: '60vh', minHeight: 160 }}>
                            {tabelasLoading && (
                                <div className="flex flex-col items-center justify-center gap-2 py-14">
                                    <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2.5px solid ${modoNoturno ? '#334155' : '#e2e8f0'}`, borderTopColor: '#007aff', animation: 'spin 0.8s linear infinite' }} />
                                    <p className="text-xs font-semibold" style={{ color: modoNoturno ? '#94a3b8' : '#64748b' }}>Carregando arquivos...</p>
                                </div>
                            )}

                            {!tabelasLoading && tabelasError && (
                                <div className="flex flex-col items-center justify-center gap-2 py-14 px-6 text-center">
                                    <AlertTriangle size={22} color={modoNoturno ? '#f87171' : '#dc2626'} />
                                    <p className="text-xs font-semibold" style={{ color: modoNoturno ? '#f87171' : '#dc2626' }}>{tabelasError}</p>
                                    <button onClick={fetchTabelasFiles} className="text-[11px] font-bold uppercase tracking-wider mt-1 px-3 py-1.5 rounded-full"
                                        style={{ background: modoNoturno ? '#1e293b' : '#f8fafc', color: '#007aff' }}>
                                        Tentar novamente
                                    </button>
                                </div>
                            )}

                            {!tabelasLoading && !tabelasError && tabelasFiles.length === 0 && (
                                <div className="flex flex-col items-center justify-center gap-2 py-14">
                                    <p className="text-xs font-semibold" style={{ color: modoNoturno ? '#94a3b8' : '#64748b' }}>Nenhum arquivo encontrado.</p>
                                </div>
                            )}

                            {!tabelasLoading && !tabelasError && tabelasFiles.map((file, i) => {
                                const dataFmt = file.modifiedTime
                                    ? new Date(file.modifiedTime).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                                    : '';
                                return (
                                    <a
                                        key={file.id}
                                        href={file.webViewLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                                        style={{
                                            textDecoration: 'none',
                                            borderBottom: i < tabelasFiles.length - 1 ? `1px solid ${modoNoturno ? '#1e293b' : '#f1f5f9'}` : 'none',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = modoNoturno ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        {file.iconLink ? (
                                            <img src={file.iconLink} alt="" className="w-6 h-6 shrink-0" />
                                        ) : (
                                            <FileText size={22} color="#007aff" className="shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate" style={{ color: modoNoturno ? '#f1f5f9' : '#1e293b' }}>{file.name}</p>
                                            <p className="text-[11px] mt-0.5" style={{ color: modoNoturno ? '#64748b' : '#94a3b8' }}>{dataFmt}</p>
                                        </div>
                                        <ExternalLink size={14} color={modoNoturno ? '#475569' : '#cbd5e1'} className="shrink-0" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL: Calculadora Tabela Direta ── */}
            {showCalculadoraTabelaDiretaModal && (
                <CalculadoraTabelaDireta
                    modoNoturno={modoNoturno}
                    onClose={() => setShowCalculadoraTabelaDiretaModal(false)}
                />
            )}


        </div>
        </>
    );
}