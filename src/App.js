import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Search, Building, ExternalLink, MapPin, BookOpen, Maximize, Bed, LayoutGrid, Sparkles, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, FileText, TableProperties, BookMarked, HelpCircle, Calculator, Bot, X, Send, Wand2, Paperclip, File as FileIcon, Trash2, FolderPlus, GripVertical, Plus, MessageCircle, Moon, Sun, AlertTriangle, Book, Clock, Trophy, RotateCw, RotateCcw, Phone } from 'lucide-react';
import { buscarRespostaDoRobo, buscarRespostaGemini } from './bot/dadosFinanciamento.js';
import { revistasDataLocal, utilitariosData, frasesMotivacionais, imagensEquipeDiarias, dayIndex } from './data/dados.js';
import { RippleButton, CardRevista, HintPills, RevistaCloseButton } from './components/Componentes.jsx';
import { useDocClassifier } from './hooks/useDocClassifier.js';

export default function App() {
    const [headerHeight, setHeaderHeight] = useState(0);
    // ── HintPills phase — sincroniza estado do botão do chat ──
    const [hintPhase, setHintPhase] = useState('idle'); // idle | show | fly | gone
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
    // Sticky tabs — abas grudam no header quando banner sai da tela
    const [tabsSticky, setTabsSticky] = useState(false);
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
        let rafId;
        let measuring = false;

        const measure = () => {
            if (headerRef.current) {
                const h = headerRef.current.offsetHeight;
                setHeaderHeight(h);
            }
        };

        // Mede durante toda a duração da transição (~350ms) usando rAF
        const measureDuring = () => {
            if (measuring) return;
            measuring = true;
            const start = performance.now();
            const tick = () => {
                measure();
                if (performance.now() - start < 400) {
                    rafId = requestAnimationFrame(tick);
                } else {
                    measuring = false;
                    measure(); // medição final
                }
            };
            rafId = requestAnimationFrame(tick);
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
            cancelAnimationFrame(rafId);
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
    const [imagemDoDia] = useState(imagensEquipeDiarias[dayIndex % imagensEquipeDiarias.length]);
    const [modoNoturno, setModoNoturno] = useState(() => localStorage.getItem('modoNoturno') === 'true');
    const [bannerFocusY, setBannerFocusY] = useState('30%');

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
    const [rankingExpandido, setRankingExpandido] = useState(false);
    const rankingAnimDoneRef = useRef(false);
    useEffect(() => {
        if (rankingAnimDoneRef.current) return;
        rankingAnimDoneRef.current = true;
        // Aguarda splash + um momento, depois abre e fecha o ranking para mostrar o recurso
        const t1 = setTimeout(() => setRankingExpandido(true),  2900);
        const t2 = setTimeout(() => setRankingExpandido(false), 5200);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);
    const [selectedPois, setSelectedPois] = useState(null);
    const [closingPoi, setClosingPoi] = useState(false);

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
    const [chatInput, setChatInput] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatInputRef = useRef(null);
    const [activeZone, setActiveZone] = useState(null);
    const [clientName, setClientName] = useState(() => localStorage.getItem('dst_client') || '');
    const [showPastaRapidaInfo, setShowPastaRapidaInfo] = useState(false);
    const [showTaxasDocsModal, setShowTaxasDocsModal] = useState(false);
    const TAXAS_BASE_URL = "https://docs.google.com/spreadsheets/d/1PKNdiepf9c6q2MDQjROS62JNpaW77sN1FbyHN4yDD5g/edit?usp=sharing&rm=minimal";
    const [taxasIframeSrc, setTaxasIframeSrc] = useState(TAXAS_BASE_URL);

    const tabRefs = {
        Direcional:  useRef(null),
        Riva:        useRef(null),
        Utilitarios: useRef(null),
        Guia:        useRef(null),
    };
    const navRef = useRef(null);
    const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0, color: 'Direcional' });
    const [hoveredTabIdx, setHoveredTabIdx] = useState(null);
    const calcPill = (brand) => {
        const activeRef = tabRefs[brand];
        if (!activeRef?.current || !navRef?.current) return;
        const navRect = navRef.current.getBoundingClientRect();
        const tabRect = activeRef.current.getBoundingClientRect();
        setPillStyle({
            left:    tabRect.left - navRect.left + navRef.current.scrollLeft,
            width:   tabRect.width,
            opacity: 1,
            color:   brand,
        });
        // Auto-scroll para a aba ativa no mobile
        activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };

    useEffect(() => { calcPill(activeBrand); }, [activeBrand]);

    // Calcula posição inicial após o DOM montar
    useEffect(() => {
        const id = requestAnimationFrame(() => calcPill(activeBrand));
        return () => cancelAnimationFrame(id);
    }, []);
    const [perfilSelecionado, setPerfilSelecionado] = useState(null); // 'diamante'|'ouro'|'prata'|'bronze'|'aco'
    const [perfilExpandido, setPerfilExpandido] = useState(null);
    const [pastaRapidaCountdown, setPastaRapidaCountdown] = useState(10);
    const pastaRapidaClicksRef = useRef(parseInt(localStorage.getItem('dst_pr_clicks') || '0'));
    const [pdfLeitor, setPdfLeitor] = useState(null); // { title, url, brand } — leitor de revista in-app
    const [pdfLeitorLogoAnim, setPdfLeitorLogoAnim] = useState(null); // { logoSrc, brand } para animação de carregamento

    // Hide search bar on mobile scroll down, show on scroll up
    // Pull-to-refresh
    const mainContainerRef = useRef(null);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const isMobile = () => window.innerWidth < 768;
        const onScroll = () => {
            if (!isMobile()) { setSearchBarVisible(true); }
            const current = window.scrollY;
            if (isMobile()) {
                if (current > lastScrollY.current + 8 && current > 60) {
                    setSearchBarVisible(false);
                } else if (current < lastScrollY.current - 8) {
                    setSearchBarVisible(true);
                }
            }
            lastScrollY.current = current;
            // Sticky tabs: gruda no header quando o nav de abas sai da tela
            if (bannerNavRef.current) {
                const navBottom = bannerNavRef.current.getBoundingClientRect().bottom;
                setTabsSticky(navBottom < (headerRef.current?.offsetHeight || 70));
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Trava scroll do body quando modais/chat estão abertos
    // Quando pdfLeitor está aberto NÃO trava touchAction — o iframe precisa de scroll livre
    useEffect(() => {
        const shouldLock = isChatOpen || !!selectedPois || showPastaRapidaInfo || !!pdfLeitor;
        if (shouldLock) {
            document.body.style.overflow = 'hidden';
            // Se for o leitor de revista, deixa touch livre para o iframe funcionar
            document.body.style.touchAction = pdfLeitor ? '' : 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [isChatOpen, selectedPois, showPastaRapidaInfo, pdfLeitor]);

    // Countdown de 10s para o botão "Entendi" do modal Pasta Rápida
    useEffect(() => {
        if (!showPastaRapidaInfo) { setPastaRapidaCountdown(10); return; }
        setPastaRapidaCountdown(10);
        const interval = setInterval(() => {
            setPastaRapidaCountdown(prev => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [showPastaRapidaInfo]);



    // ESTADO PARA AS FRASES AMIGÁVEIS DO ROBÔ E CONTROLE DE SCROLL
    const [robotPhraseIndex, setRobotPhraseIndex] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef(null);

    const robotFloatingPhrases = [
        "Posso te ajudar? 😊",
        "Vamos subir uma pasta? 📂",
        "Bora bater a meta? 🚀",
        "Dúvida em algum apê? 🏠",
        "Tô aqui, Destemido! ✨",
        "Quer criar um PDF agora? 📄",
        "Precisando de algo? 👋"
    ];

    // Efeito para alternar frases e detectar rolagem
    useEffect(() => {
        const interval = setInterval(() => {
            setRobotPhraseIndex(prev => (prev + 1) % robotFloatingPhrases.length);
        }, 10000);

        const handleScroll = () => {
            setIsScrolling(true);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
            }, 600);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            clearInterval(interval);
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        try { localStorage.setItem('dst_chat', JSON.stringify(chatMessages.slice(-40))); } catch {}
    }, [chatMessages]);

    // Saudação animada no logo
    const [logoPhase, setLogoPhase] = useState('logo'); // 'logo' | 'saudacao'
    const [logoSlideOut, setLogoSlideOut] = useState(false);

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

    // 'idle' | 'gather' | 'shake' | 'scatter'
    const [cardAnimPhase, setCardAnimPhase] = useState('idle');
    // Stores {id, x, y, w, h} of each card's real DOM position for the pile animation
    const [cardRects, setCardRects] = useState([]);  // absolute positions of each card in viewport
    const [gridCenter, setGridCenter] = useState({ x: 0, y: 0 });
    const cardGridRef = useRef(null);

    // === ESTADOS PARA CRIAÇÃO DE PASTA DO CLIENTE ===
    const fileInputRef = useRef(null);
    const quickFolderInputRef = useRef(null);
    const [isOrganizingDocs, setIsOrganizingDocs] = useState(false);
    const [organizeProgress, setOrganizeProgress] = useState({ current: 0, total: 0, label: '' });
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [folderSource, setFolderSource] = useState('manual'); // 'manual' | 'rapida'
    const [isFinalizingFolder, setIsFinalizingFolder] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [compressionInfo, setCompressionInfo] = useState(null); // { before, after, saved }
    const [showThumbsUp, setShowThumbsUp] = useState(false);
    const [showLightning, setShowLightning] = useState(false);
    const [pendingDocs, setPendingDocs] = useState([]);
    const [pdfFileName, setPdfFileName] = useState("Pasta_do_Cliente");
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    const [dragGhostPos, setDragGhostPos] = useState({ x: 0, y: 0 });
    const [isDraggingActive, setIsDraggingActive] = useState(false);
    const [fullscreenDoc, setFullscreenDoc] = useState(null);
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

    const normalizeString = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const processChatMessage = (inputMsg) => {
    const input = normalizeString(inputMsg);
    let matchedProperties = [];

    const docs = dadosFinanciamento.documentos;
    
    if (input.includes("documento") || input.includes("precisa") || input.includes("papel")) {
      if (input.includes("autonomo")) {
        return `Para **Autônomos**, os documentos são: ${docs.autonomo.join(", ")}. \n\n⚠️ **Importante:** Solteiros devem apresentar Certidão de Nascimento. Se tiver filhos, envie a Certidão do dependente.`;
      }
      if (input.includes("servidor")) {
        return `Para **Servidor Público**, você precisa de: ${docs.servidor.join(", ")}. \n\n📍 Não esqueça os 3 últimos contracheques atualizados!`;
      }
      return `Para **CLT (Carteira Assinada)**, separe: ${docs.clt.join(", ")}. \n\n💡 Dica: A Carteira de Trabalho pode ser a Digital (PDF).`;
    }

    if (input.includes("investidor")) {
      return "Na **Tabela Investidor**, o ato é facilitado e o saldo é parcelado em até 28x sem juros ou correção durante a obra! 🚀";
    }
    if (input.includes("financiamento direto") || (input.includes("direto") && input.includes("construtora"))) {
      return "Temos a opção de **Financiamento Direto** com a construtora em até 120 meses após a entrega das chaves! Quer que eu verifique as taxas para você?";
    }

    revistasData.forEach(prop => {
        if (prop.aliases.some(alias => input.includes(normalizeString(alias)))) {
            if (!matchedProperties.some(p => p.id === prop.id)) {
                matchedProperties.push(prop);
            }
        }
    });

    if (matchedProperties.length === 0) {
        const regions = ["zona leste", "zona norte", "zona oeste", "zona sul", "centro-sul", "centro-oeste", "taruma", "flores", "coroado"];
        let detectedRegion = regions.find(r => input.includes(r));
        if (detectedRegion) {
            matchedProperties = revistasData.filter(p => normalizeString(p.region).includes(detectedRegion));
        }
    }

    const wantsMagazine = ["revista", "pdf", "link", "material", "apresentacao", "enviar", "mande", "mandar", "baixe", "baixar"].some(w => input.includes(w));
    const wantsPois = ["referencia", "referência", "perto", "proximo", "próximo", "localizacao", "localização", "onde fica"].some(w => input.includes(w));

    let botResponse = "";

    if (input.includes("criar pasta") || input.includes("pasta do cliente") || input.includes("subir pasta")) {
        setIsCreatingFolder(true);
        return "Com certeza! Modo **Criar Pasta do Cliente** ativado! 📂✨\n\nÉ só clicar no botão de anexo ou arrastar os documentos pra cá. Vou te ajudar a organizar tudo na ordem certinha para o seu PDF sair perfeito!";
    }

    if (matchedProperties.length > 0) {
        if (matchedProperties.length === 1) {
            const p = matchedProperties[0];
            if (wantsPois) {
                botResponse = `O **${p.title}** fica super bem localizado na região de ${p.region}.\n\n📍 **Principais Pontos de Referência:**\n`;
                p.pois.forEach(poi => botResponse += `• ${poi}\n`);
                botResponse += `\nQuer que eu te mande a revista dele para você mostrar pro cliente?`;
            } else {
                botResponse = `Com certeza! Falando do **${p.title}** (${p.brand}):\n\n📍 **Onde Fica:** ${p.region}\n📏 **Planta:** ${p.size} com ${p.bedrooms}\n🏢 **Referências próximas:** ${p.pois.slice(0, 3).join(', ')}.\n\n`;
                if (wantsMagazine || input.includes("revista")) {
                    botResponse += `Aqui está o material que você pediu: [Acessar Revista do ${p.title}](${p.link})`;
                } else {
                    botResponse += `Se o seu cliente quiser ver mais, posso te enviar o PDF da revista. É só me pedir! 😉`;
                }
            }
        } else {
            botResponse = `Boa! Encontrei essas opções ótimas para o que você procura:\n\n`;
matchedProperties.forEach(p => {
    botResponse += ` 🔹 **${p.title}** (${p.region}) - ${p.size} (${p.brand})\n`;
    if (wantsMagazine) botResponse += ` 🔗 [Baixar Revista PDF](${p.link})\n`;
});
if (!wantsMagazine) botResponse += `\nQual desses você gostaria de ver o PDF agora?`;
        }
    } else {
        if (input.includes("ola") || input.includes("bom dia") || input.includes("boa tarde") || input.includes("boa noite")) {
            botResponse = "Olá, Destemido! Bora bater essa meta? 🚀 Como posso te ajudar agora? Posso buscar empreendimentos por bairro, nome ou te ajudar a criar aquela pasta do cliente rapidinho.";
        } else if (input.includes("amml") || input.includes("amazonas meu lar")) {
            botResponse = "Para o **Amazonas Meu Lar**, temos todos os modelos de declarações que você precisa na aba **UTILITÁRIOS**. É só baixar e usar!";
        } else {
            botResponse = "Hmm, não consegui entender exatamente o que você precisa. 😅\n\nPode tentar algo como: 'Documentos para autônomo', 'Regras do investidor' ou 'Me mostra o Brisas'.";
        }
    }
    return botResponse;
  };
    const handleSendChatMessage = async () => {
        if (!chatInput.trim() || isChatLoading) return;
        const userMessage = chatInput;
        setChatInput('');
        const novasMensagens = [...chatMessages, { role: 'user', content: userMessage }];
        setChatMessages(novasMensagens);
        setIsChatLoading(true);

        if (userMessage.toLowerCase().includes('criar pasta') || userMessage.toLowerCase().includes('pasta do cliente') || userMessage.toLowerCase().includes('subir pasta')) {
            setIsCreatingFolder(true);
            setChatMessages(prev => [...prev, { role: 'bot', content: "Com certeza! Modo **Criar Pasta do Cliente** ativado! 📂✨\n\nÉ só clicar no botão de anexo ou arrastar os documentos pra cá. Vou te ajudar a organizar tudo na ordem certinha para o seu PDF sair perfeito!" }]);
            setIsChatLoading(false);
            return;
        }

        try {
            const historico = novasMensagens.slice(-4);
            const responseText = await buscarRespostaGemini(userMessage, historico.slice(0, -1));
            setChatMessages(prev => [...prev, { role: 'bot', content: responseText }]);
        } catch (e) {
            const responseText = buscarRespostaDoRobo(userMessage);
            setChatMessages(prev => [...prev, { role: 'bot', content: responseText }]);
        }
        setIsChatLoading(false);
        setTimeout(() => chatInputRef.current?.focus(), 100);
    };

    const generatePdfPreview = async (file) => {
        try {
            if (!window.pdfjsLib) return null;
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
            return canvas.toDataURL('image/jpeg', 0.8);
        } catch (e) {
            return null;
        }
    };

    // Versão alternativa: renderiza TODAS as páginas empilhadas num único can
    // para a IA ver o documento inteiro (parcela, entrega costumam ficar em pág 2+)
    const generatePdfAllPages = async (file) => {
        try {
            if (!window.pdfjsLib) return null;
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = Math.min(pdf.numPages, 6); // máx 6 páginas
            const scale = 1.2;
            // Renderiza todas as páginas e coleta os canvases
            const canvases = [];
            let totalHeight = 0;
            let maxWidth = 0;
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const vp = page.getViewport({ scale });
                const c = document.createElement('canvas');
                c.width = vp.width; c.height = vp.height;
                await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
                page.cleanup();
                canvases.push(c);
                totalHeight += vp.height + 4;
                if (vp.width > maxWidth) maxWidth = vp.width;
            }
            // Junta tudo num canvas único
            const merged = document.createElement('canvas');
            merged.width = maxWidth;
            merged.height = totalHeight;
            const ctx = merged.getContext('2d');
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, maxWidth, totalHeight);
            let y = 0;
            for (const c of canvases) { ctx.drawImage(c, 0, y); y += c.height + 4; }
            return merged.toDataURL('image/jpeg', 0.82);
        } catch (e) {
            return null;
        }
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        const newDocs = await Promise.all(files.map(async (file) => {
            let previewUrl = null;
            if (file.type.startsWith('image/')) {
                previewUrl = URL.createObjectURL(file);
            } else if (file.type === 'application/pdf') {
                previewUrl = await generatePdfPreview(file);
            }
            return {
                id: Math.random().toString(36).substring(7),
                file,
                name: file.name,
                previewUrl
            };
        }));
        setPendingDocs(prev => [...prev, ...newDocs]);
        if (!isCreatingFolder) {
            setIsCreatingFolder(true);
            setChatMessages(prev => [...prev, { role: 'bot', content: "Ótimo! Já abri a área de organização. 📂\n\nAgora você pode **arrastar os documentos** para colocar na ordem certa e depois clicar em Gerar PDF." }]);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };


    const { classifyDoc, classifyInBatches, handleOrganizeAll: _handleOrganizeAll, OPENROUTER_KEY } = useDocClassifier({
        setPendingDocs,
        setOrganizeProgress,
        setCardAnimPhase,
        setChatMessages,
    });

    const handleOrganizeAll = () => _handleOrganizeAll(pendingDocs, isOrganizingDocs);

    const handleQuickFolderUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        if (quickFolderInputRef.current) quickFolderInputRef.current.value = '';

        if (!OPENROUTER_KEY) {
            setIsChatOpen(true);
            setChatMessages(prev => [...prev, { role: 'bot', content: '⚠️ **Pasta Rápida precisa da chave do OpenRouter.**\n\n1. Acesse: https://openrouter.ai\n2. Crie conta gratuita (sem cartão)\n3. Vá em **Settings → Keys** e crie uma chave\n4. Adicione no `.env`:\n```\nREACT_APP_OPENROUTER_KEY=sk-or-...\n```\n5. Reinicie com `npm start` 🔑' }]);
            return;
        }

        setIsCreatingFolder(true);
        setFolderSource('rapida');
        setIsOrganizingDocs(true);
        setOrganizeProgress({ current: 0, total: files.length, label: 'Preparando...' });
        setCardAnimPhase('pulse');
        setChatMessages(prev => [...prev, { role: 'bot', content: `🧠 **Pasta Rápida ativada!** ${files.length} documento${files.length > 1 ? 's' : ''} recebido${files.length > 1 ? 's' : ''}.\n\nAnalisando com IA... ✨` }]);

        const newDocsBase = await Promise.all(files.map(async (file) => {
            let previewUrl = null;
            if (file.type.startsWith('image/')) previewUrl = URL.createObjectURL(file);
            else if (file.type === 'application/pdf') previewUrl = await generatePdfPreview(file);
            return { id: Math.random().toString(36).substring(7), file, name: file.name, previewUrl, aiLabel: '⏳', aiOrder: 99 };
        }));

        setPendingDocs(prev => [...prev, ...newDocsBase]);
        const classified = await classifyInBatches(newDocsBase, 3);

        setPendingDocs(prev => {
            const existing = prev.filter(d => !newDocsBase.some(n => n.id === d.id));
            return [...existing, ...classified].sort((a, b) => (a.aiOrder ?? 99) - (b.aiOrder ?? 99));
        });

        setCardAnimPhase('scatter');
        setTimeout(() => { setCardAnimPhase('idle'); }, 800);
        setIsOrganizingDocs(false);
        setOrganizeProgress({ current: 0, total: 0, label: '' });

        const resumo = classified.map((d, i) => `${i + 1}. ${d.aiLabel}`).join('\n');
        setChatMessages(prev => [...prev, { role: 'bot', content: `✅ **Novos documentos adicionados e organizados:**\n\n${resumo}\n\nAjuste arrastando se precisar e clique em **Finalizar PDF**! 📄` }]);
    };


    const closePoi = () => {
        setClosingPoi(true);
        setTimeout(() => { setSelectedPois(null); setClosingPoi(false); }, 320);
    };

    const closeChat = () => {
        setClosingChat(true);
        setTimeout(() => { setIsChatOpen(false); setClosingChat(false); setIsCreatingFolder(false); }, 350);
    };

    const backToChat = () => {
        setClosingFolder(true);
        setTimeout(() => { setIsCreatingFolder(false); setClosingFolder(false); }, 320);
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
    const handleTouchStart = (e, index) => {
        touchDragIndex.current = index;
        setDraggedItemIndex(index);
        setIsDraggingActive(true);
        const touch = e.touches[0];
        setDragGhostPos({ x: touch.clientX, y: touch.clientY });
    };

    const handleDragTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
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
        const from = touchDragIndex.current;
        const to = touchTargetIndex.current;
        if (from !== null && to !== null && from !== to) {
            const newDocs = [...pendingDocs];
            const draggedItem = newDocs[from];
            newDocs.splice(from, 1);
            newDocs.splice(to, 0, draggedItem);
            setPendingDocs(newDocs);
        }
        touchDragIndex.current = null;
        touchTargetIndex.current = null;
        setDraggedItemIndex(null);
        setIsDraggingActive(false);
        setDragGhostPos({ x: 0, y: 0 });
    };

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

    const pdfToImageBytes = async (arrayBuffer) => {
        await waitForPdfJs();
        const dataCopy = arrayBuffer.slice(0);
        const loadingTask = window.pdfjsLib.getDocument({
            data: new Uint8Array(dataCopy),
            password: '',
            disableRange: true,
            disableStream: true,
        });
        const pdfDoc = await loadingTask.promise;
        const pages = [];
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            // scale 3.0 + JPEG 0.97 = máxima resolução para documentos
            const viewport = page.getViewport({ scale: 3.0 });
            const canvas = document.createElement('canvas');
            canvas.width  = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvasContext: ctx, viewport }).promise;
            const dataUrl = canvas.toDataURL('image/jpeg', 0.97);
            const base64  = dataUrl.split(',')[1];
            const binaryStr = atob(base64);
            const bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
            pages.push({ bytes, widthPt: canvas.width / 3.0, heightPt: canvas.height / 3.0, isJpeg: true });
            page.cleanup();
        }
        return pages;
    };

    const generateClientPDF = async () => {
        if (!window.PDFLib) {
            alert("Aguarde um instante, estou preparando o motor de PDFs... 🛠️");
            return;
        }
        setIsChatLoading(true);
        try {
            const { PDFDocument } = window.PDFLib;
            const mergedPdf = await PDFDocument.create();

            for (const doc of pendingDocs) {
                const arrayBuffer = await doc.file.arrayBuffer();

                if (doc.file.type === 'application/pdf') {
                    const pages = await pdfToImageBytes(arrayBuffer);
                    for (const pg of pages) {
                        const embedded = pg.isJpeg ? await mergedPdf.embedJpg(pg.bytes) : await mergedPdf.embedPng(pg.bytes);
                        const pdfPage  = mergedPdf.addPage([pg.widthPt, pg.heightPt]);
                        pdfPage.drawImage(embedded, {
                            x: 0, y: 0,
                            width:  pg.widthPt,
                            height: pg.heightPt,
                        });
                    }
                } else if (doc.file.type.startsWith('image/')) {
                    const rot = doc.rotation || 0;

                    // Desenha a imagem num canvas já com a rotação aplicada nos pixels
                    const rotatedBytes = await new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => {
                            const swapped = rot === 90 || rot === 270;
                            const cw = swapped ? img.height : img.width;
                            const ch = swapped ? img.width  : img.height;
                            const canvas = document.createElement('canvas');
                            canvas.width  = cw;
                            canvas.height = ch;
                            const ctx = canvas.getContext('2d');
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, cw, ch);
                            ctx.translate(cw / 2, ch / 2);
                            ctx.rotate((rot * Math.PI) / 180);
                            ctx.drawImage(img, -img.width / 2, -img.height / 2);
                            canvas.toBlob(blob => {
                                blob.arrayBuffer().then(buf => resolve(new Uint8Array(buf)));
                            }, 'image/jpeg', 0.97);
                        };
                        img.src = URL.createObjectURL(doc.file);
                    });

                    const image = await mergedPdf.embedJpg(rotatedBytes);
                    const imgDims = image.scale(1);
                    const page = mergedPdf.addPage([imgDims.width, imgDims.height]);
                    page.drawImage(image, { x: 0, y: 0, width: imgDims.width, height: imgDims.height });
                }
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url  = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href  = url;
            link.download = `${pdfFileName || 'Pasta_do_Cliente'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 5000);

            setChatMessages(prev => [...prev, { role: 'bot', content: "✅ **Missão cumprida!** Seu PDF foi gerado e o download começou.\n\nSua pasta está prontinha e organizada. Mais algum desafio para hoje?" }]);
            setIsCreatingFolder(false);
            setPendingDocs([]);
            setIsFinalizingFolder(false);
            setShowThumbsUp(true);
            setTimeout(() => setShowThumbsUp(false), 2800);
            setShowLightning(true);
            setTimeout(() => setShowLightning(false), 2800);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            setChatMessages(prev => [...prev, { role: 'bot', content: `Ops, algo não deu certo ao gerar o arquivo. 😕\n\nDetalhe: ${error.message || 'erro desconhecido'}` }]);
        }
        setIsChatLoading(false);
    };

    const compressClientPDF = async () => {
        if (!window.PDFLib) {
            alert("Aguarde um instante, estou preparando o motor de PDFs... 🛠️");
            return;
        }
        setIsCompressing(true);
        setCompressionInfo(null);
        try {
            const { PDFDocument } = window.PDFLib;
            const mergedPdf = await PDFDocument.create();

            for (const doc of pendingDocs) {
                const arrayBuffer = await doc.file.arrayBuffer();

                if (doc.file.type === 'application/pdf') {
                    // Comprime PDFs convertendo páginas em JPEG com qualidade reduzida
                    const pages = await (async () => {
                        const pdfjsLib = window['pdfjs-dist/build/pdf'];
                        if (!pdfjsLib) return [];
                        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                        const pdfDoc = await loadingTask.promise;
                        const pages = [];
                        for (let i = 1; i <= pdfDoc.numPages; i++) {
                            const page = await pdfDoc.getPage(i);
                            // Compressão: scale 1.5 + JPEG 0.6
                            const viewport = page.getViewport({ scale: 1.5 });
                            const canvas = document.createElement('canvas');
                            canvas.width  = Math.floor(viewport.width);
                            canvas.height = Math.floor(viewport.height);
                            const ctx = canvas.getContext('2d');
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            await page.render({ canvasContext: ctx, viewport }).promise;
                            const dataUrl = canvas.toDataURL('image/jpeg', 0.60);
                            const base64  = dataUrl.split(',')[1];
                            const binaryStr = atob(base64);
                            const bytes = new Uint8Array(binaryStr.length);
                            for (let j = 0; j < binaryStr.length; j++) bytes[j] = binaryStr.charCodeAt(j);
                            pages.push({ bytes, widthPt: canvas.width / 1.5, heightPt: canvas.height / 1.5 });
                            page.cleanup();
                        }
                        return pages;
                    })();
                    for (const pg of pages) {
                        const embedded = await mergedPdf.embedJpg(pg.bytes);
                        const pdfPage  = mergedPdf.addPage([pg.widthPt, pg.heightPt]);
                        pdfPage.drawImage(embedded, { x: 0, y: 0, width: pg.widthPt, height: pg.heightPt });
                    }
                } else if (doc.file.type.startsWith('image/')) {
                    const rot = doc.rotation || 0;
                    const rotatedBytes = await new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => {
                            const swapped = rot === 90 || rot === 270;
                            const cw = swapped ? img.height : img.width;
                            const ch = swapped ? img.width  : img.height;
                            const canvas = document.createElement('canvas');
                            canvas.width  = cw;
                            canvas.height = ch;
                            const ctx = canvas.getContext('2d');
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, cw, ch);
                            ctx.translate(cw / 2, ch / 2);
                            ctx.rotate((rot * Math.PI) / 180);
                            ctx.drawImage(img, -img.width / 2, -img.height / 2);
                            // Compressão de imagens: JPEG 0.65
                            canvas.toBlob(blob => {
                                blob.arrayBuffer().then(buf => resolve(new Uint8Array(buf)));
                            }, 'image/jpeg', 0.65);
                        };
                        img.src = URL.createObjectURL(doc.file);
                    });
                    const image = await mergedPdf.embedJpg(rotatedBytes);
                    const imgDims = image.scale(1);
                    const page = mergedPdf.addPage([imgDims.width, imgDims.height]);
                    page.drawImage(image, { x: 0, y: 0, width: imgDims.width, height: imgDims.height });
                }
            }

            const pdfBytes = await mergedPdf.save();

            // Calcula tamanho original somando todos os arquivos
            const totalOriginalBytes = pendingDocs.reduce((acc, doc) => acc + doc.file.size, 0);
            const compressedBytes = pdfBytes.byteLength;
            const beforeMB = (totalOriginalBytes / 1048576).toFixed(2);
            const afterMB  = (compressedBytes / 1048576).toFixed(2);
            const savedPct = Math.max(0, Math.round((1 - compressedBytes / totalOriginalBytes) * 100));

            setCompressionInfo({ before: beforeMB, after: afterMB, saved: savedPct });

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url  = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href  = url;
            link.download = `${pdfFileName || 'Pasta_do_Cliente'}_comprimido.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 5000);

            setChatMessages(prev => [...prev, { role: 'bot', content: `✅ **PDF Comprimido gerado!**\n\nAntes: **${beforeMB} MB** → Depois: **${afterMB} MB** (${savedPct}% menor)\n\nDownload concluído com sucesso!` }]);
            setIsCreatingFolder(false);
            setPendingDocs([]);
            setIsFinalizingFolder(false);
            setCompressionInfo(null);
            setShowThumbsUp(true);
            setTimeout(() => setShowThumbsUp(false), 2800);
            setShowLightning(true);
            setTimeout(() => setShowLightning(false), 2800);
        } catch (error) {
            console.error('Erro ao comprimir PDF:', error);
            setChatMessages(prev => [...prev, { role: 'bot', content: `Ops, erro ao comprimir o PDF. 😕\n\nDetalhe: ${error.message || 'erro desconhecido'}` }]);
        }
        setIsCompressing(false);
    };

    const removeDoc = (id) => {
        setPendingDocs(prev => {
            const doc = prev.find(d => d.id === id);
            if (doc?.previewUrl) URL.revokeObjectURL(doc.previewUrl);
            return prev.filter(d => d.id !== id);
        });
    };

    const rotateDoc = (id, dir) => {
        setPendingDocs(prev => prev.map(d =>
            d.id === id ? { ...d, rotation: (((d.rotation || 0) + (dir === 'cw' ? 90 : -90)) + 360) % 360 } : d
        ));
    };

    const renderChatMessage = (text) => {
        const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/g);
        if (parts.length === 1) return <span className="whitespace-pre-wrap">{text}</span>;
        const result = [];
        for (let i = 0; i < parts.length; i += 3) {
            if (parts[i]) result.push(<span key={`text-${i}`} className="whitespace-pre-wrap">{parts[i]}</span>);
            if (i + 1 < parts.length) {
                result.push(
                    <a key={`link-${i}`} href={parts[i+2]} target="_blank" rel="noopener noreferrer" className="font-bold underline text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1">
                        {parts[i+1]} <ExternalLink size={14} className="inline" />
                    </a>
                );
            }
        }
        return result;
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

    const [chatBtnIcon, setChatBtnIcon] = useState('chat'); // 'chat' | 'folder'
    const [chatBtnIconVisible, setChatBtnIconVisible] = useState(true);
    useEffect(() => {
        const randomDelay = () => 2200 + Math.random() * 4800; // 2.2s – 7s random
        let timer;
        const schedule = () => {
            timer = setTimeout(() => {
                setChatBtnIconVisible(false);
                setTimeout(() => {
                    setChatBtnIcon(p => p === 'chat' ? 'folder' : 'chat');
                    setChatBtnIconVisible(true);
                }, 650);
                schedule();
            }, randomDelay());
        };
        schedule();
        return () => clearTimeout(timer);
    }, []);

    const ZONES = [
        { id: 'Norte', label: 'Norte', c: 'blue' },
        { id: 'Sul', label: 'Sul', c: 'rose' },
        { id: 'Leste', label: 'Leste', c: 'amber' },
        { id: 'Oeste', label: 'Oeste', c: 'emerald' },
        { id: 'Centro', label: 'Centro', c: 'violet' },
    ];
    const zoneColors = {
        blue:    a => a ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600',
        rose:    a => a ? 'bg-rose-500 text-white border-rose-500' : 'border-slate-200 text-slate-500 hover:border-rose-400 hover:text-rose-500',
        amber:   a => a ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-200 text-slate-500 hover:border-amber-400 hover:text-amber-500',
        emerald: a => a ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 text-slate-500 hover:border-emerald-400 hover:text-emerald-600',
        violet:  a => a ? 'bg-violet-600 text-white border-violet-600' : 'border-slate-200 text-slate-500 hover:border-violet-400 hover:text-violet-600',
    };
    const filteredRevistas = revistasData.filter(revista => {
        const matchesSearch = revista.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            revista.region.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = revista.brand === activeBrand;
        const matchesZone = !activeZone || revista.region.toLowerCase().includes(activeZone.toLowerCase());
        return matchesSearch && matchesBrand && matchesZone;
    }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    return (
        <>
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
                        src="https://i.postimg.cc/XpWRf9pj/logo.png"
                        alt="Destemidos"
                        style={{
                            height: 120, width: 'auto', objectFit: 'contain',
                            filter: 'drop-shadow(0 0 48px rgba(29,78,216,0.80)) drop-shadow(0 0 28px rgba(59,130,246,0.55)) drop-shadow(0 4px 32px rgba(0,0,0,0.85))',
                            animation: 'splash-logo-in 0.75s cubic-bezier(0.34,1.3,0.64,1) both',
                        }}
                    />
                    <style>{`
                        @keyframes splash-logo-in { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }
                        @keyframes splash-glow    { from { opacity:0.5; transform:scale(0.85); } to { opacity:1; transform:scale(1.2); } }
                    `}</style>
                </div>
            )}

            {/* Pull-to-refresh indicator */}
        <div ref={mainContainerRef}
            className={`min-h-screen font-sans pb-12 relative transition-colors duration-500 ${modoNoturno ? 'bg-[#0B1120] text-slate-100' : 'text-slate-800'}`}
            style={modoNoturno ? undefined : { background: '#f2f2f7' }}
            onMouseMove={handleGlobalDragOver}
        >
            {modoNoturno && (
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
                .sticky-tabs-bar::-webkit-scrollbar { display: none; }
                .sticky-tabs-bar { -ms-overflow-style: none; scrollbar-width: none; }
                @media (min-width: 640px) {
                    .sticky-tabs-bar { justify-content: center !important; }
                }
                @keyframes shimmer-sweep {
                    0%   { transform: translateX(-150%) skewX(-18deg); }
                    100% { transform: translateX(280%)  skewX(-18deg); }
                }
                .group:hover .card-shimmer-sweep {
                    animation: shimmer-sweep 0.65s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
                }
                .group:hover img { transform: scale(1.12) !important; }
                .group img { transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) !important; }

                /* ── LIQUID GLASS — card fixado ── */
                @keyframes lg-sweep {
                    0%   { transform: translateX(-140%) skewX(-18deg); opacity: 0; }
                    10%  { opacity: 1; }
                    80%  { opacity: 0.9; }
                    100% { transform: translateX(280%) skewX(-18deg); opacity: 0; }
                }
                .pinned-lg-card {
                    transition: transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94),
                                box-shadow 0.45s ease,
                                border-color 0.45s ease;
                    box-shadow: 0 4px 16px rgba(139,28,58,0.10);
                }
                .pinned-lg-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 32px rgba(139,28,58,0.22), 0 2px 6px rgba(0,0,0,0.08) !important;
                    border-color: rgba(210,80,120,0.75) !important;
                }
                .lg-img {
                    transition: transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94) !important;
                }
                .pinned-lg-card:hover .lg-img {
                    transform: scale(1.06) !important;
                }
                .lg-sweep-layer {
                    transition: none;
                }
                .pinned-lg-card:hover .lg-sweep-layer {
                    animation: lg-sweep 0.75s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
                }
                .lg-glass-overlay {
                    position: absolute; inset: 0; pointer-events: none; z-index: 8;
                    background: linear-gradient(135deg,
                        rgba(255,255,255,0.0) 0%,
                        rgba(255,255,255,0.09) 45%,
                        rgba(255,200,220,0.07) 65%,
                        rgba(255,255,255,0.0) 100%);
                    opacity: 0;
                    transition: opacity 0.45s ease;
                }
                .pinned-lg-card:hover .lg-glass-overlay { opacity: 1; }
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
                className="fixed left-0 right-0 z-30 transition-colors duration-500 header-slide-in"
                style={{
                    top: 0,
                    paddingTop: 'env(safe-area-inset-top, 0px)',
                    background: modoNoturno ? 'rgba(15,23,42,0.70)' : 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    borderBottom: modoNoturno ? '1px solid rgba(51,65,85,0.6)' : '1px solid rgba(226,232,240,0.6)',
                    boxShadow: modoNoturno ? '0 2px 8px rgba(0,0,0,0.25)' : '0 2px 8px rgba(148,163,184,0.3)',
                }}>
                <div className="w-full px-[7.2%]">
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
                                    className="flex items-center justify-center sm:justify-start gap-3 shrink-0 pt-3 pb-2 sm:py-0 cursor-pointer select-none"
                                    onClick={triggerLogoGreeting}
                                >
                                    <img
                                            src="https://i.postimg.cc/XpWRf9pj/logo.png"
                                            alt="Logo"
                                            className="h-10 w-auto object-contain rounded shrink-0"
                            style={{
                                                animation: isSaud ? 'logo-flip 2s ease-in-out' : 'none',
                                            }}
                                        />

                                    {/* Texto deslizante */}
                                    <div className="relative overflow-hidden" style={{minWidth: 0, flex: 1, maxWidth: 200, height: 36}}>
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
                            searchBarVisible && !tabsSticky
                            ? 'opacity-100 max-h-20'
                            : 'opacity-0 max-h-0 overflow-hidden pointer-events-none sm:opacity-100 sm:max-h-none sm:pointer-events-auto'
                        }`}>
                            {/* Barra de pesquisa — ocupa todo espaço disponível, encolhe quando abas aparecem */}
                            <div className="relative transition-all"
                                style={{
                                    flexShrink: 0,
                                    width: tabsSticky ? '160px' : '100%',
                                    flex: tabsSticky ? '0 0 160px' : '1 1 0%',
                                    transition: 'flex 0.32s cubic-bezier(0.25,0.46,0.45,0.94), width 0.32s cubic-bezier(0.25,0.46,0.45,0.94)',
                                }}>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder={tabsSticky ? 'Buscar...' : 'Buscar por nome ou bairro...'}
                                    className={`search-input-premium block w-full pl-9 pr-3 py-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all ${
                                        modoNoturno
                                        ? 'bg-white/10 border border-white/15 text-white placeholder-white/40 focus:bg-white/15'
                                        : 'bg-black/6 border border-black/8 text-slate-800 placeholder-slate-400 focus:bg-white/90'
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
                                    { id: 'Ranking',     label: 'RANK', href: 'https://ranking-direcional.streamlit.app/' },
                                    { id: 'Simulador',   label: 'SIM',  href: 'https://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso&isVoltar=true' },
                                    { id: 'Tabelas',     label: 'TAB',  href: 'https://drive.google.com/drive/folders/14mYfQkNaSc9APr6hpOTKKTFQ02oq3uOf?usp=sharing' },
                                    { id: 'Utilitarios', label: 'UTIL', action: () => setActiveBrand('Utilitarios'), isBtn: true },
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
                                            const isActive = activeBrand === tab.id;
                                            const tabStyle = {
                                                borderRadius: 12,
                                                paddingTop: 7, paddingBottom: 7,
                                                flex: '1 1 0%',
                                                cursor: 'pointer', textDecoration: 'none',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                whiteSpace: 'nowrap', minWidth: 0,
                                                transition: 'background 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
                                                background: isActive
                                                    ? (modoNoturno ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.11)')
                                                    : (modoNoturno ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'),
                                                border: isActive
                                                    ? (modoNoturno ? '1px solid rgba(255,255,255,0.30)' : '1px solid rgba(0,0,0,0.15)')
                                                    : (modoNoturno ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(0,0,0,0.08)'),
                                                boxShadow: isActive
                                                    ? (modoNoturno ? '0 2px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)' : '0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)')
                                                    : 'none',
                                            };
                                            const labelColor = isActive
                                                ? (modoNoturno ? '#ffffff' : '#334155')
                                                : (modoNoturno ? 'rgba(255,255,255,0.48)' : 'rgba(15,23,42,0.48)');
                                            return tab.isBtn ? (
                                                <button key={tab.id} onClick={() => { haptic(); tab.action(); }} style={tabStyle}>
                                                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', color: labelColor, transition: 'color 0.22s' }}>{tab.label}</span>
                                                </button>
                                            ) : (
                                                <a key={tab.id} href={tab.href} target="_blank" rel="noopener noreferrer" style={tabStyle}>
                                                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', color: labelColor, transition: 'color 0.22s' }}>{tab.label}</span>
                                                </a>
                                            );
                                        })}
                                    </div>
                                );
                            })()}

                            <button
                                onClick={() => { haptic('medium'); const novo = !modoNoturno; setModoNoturno(novo); localStorage.setItem('modoNoturno', novo); }}
                                className={`shrink-0 p-2.5 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                                    modoNoturno
                                    ? 'bg-white/10 border-white/15 text-amber-300 hover:bg-white/20'
                                    : 'bg-black/6 border-black/8 text-slate-600 hover:bg-black/10'
                                }`}
                                title={modoNoturno ? "Ativar Modo Claro" : "Ativar Modo Noturno"}
                            >
                                {modoNoturno ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            {/* Botão Pasta no Header */}
                            <button
                                onClick={() => { haptic('medium'); setFolderSource('manual'); setIsCreatingFolder(true); setIsChatOpen(true); setTimeout(() => fileInputRef.current?.click(), 100); }}
                                className={`shrink-0 p-2.5 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                                    modoNoturno
                                    ? 'bg-indigo-500/20 border-indigo-400/30 text-indigo-300 hover:bg-indigo-500/30'
                                    : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                                }`}
                                title="Criar Pasta"
                            >
                                <FolderPlus size={20} />
                            </button>

                            {/* Botão Chat no Header */}
                            <button
                                onClick={() => { haptic('medium'); setIsChatOpen(true); }}
                                className={`shrink-0 p-2.5 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                                    modoNoturno
                                    ? 'bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30'
                                    : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                                }`}
                                title="Abrir Chat IA"
                            >
                                <MessageCircle size={20} />
                            </button>

                            {/* Botão Taxas Docs no Header */}
                            <button
                                onClick={() => setShowTaxasDocsModal(true)}
                                className={`shrink-0 p-2.5 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                                    modoNoturno
                                    ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30'
                                    : 'bg-cyan-50 border-cyan-200 text-cyan-600 hover:bg-cyan-100'
                                }`}
                                title="Ver Taxas Docs"
                            >
                                <FileText size={20} />
                            </button>
                        </div>

                    </div>
                </div>

                {/* ── ABAS STICKY MOBILE — dentro do header, fundo transparente ── */}
                <div className="sm:hidden"
                    style={{
                        maxHeight: tabsSticky ? 72 : 0,
                        opacity: tabsSticky ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'max-height 0.28s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.22s ease',
                    }}>
                    <div className="sticky-tabs-bar" style={{ display: 'flex', gap: 7, alignItems: 'center', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingLeft: 14, paddingRight: 14, paddingTop: 11, paddingBottom: 11 }}>
                        {[
                            { id: 'Direcional',  label: 'DIRECIONAL',  icon: <span style={{width:5,height:5,borderRadius:2,background:'rgba(255,255,255,0.7)',flexShrink:0,display:'inline-block'}}/>, action: () => setActiveBrand('Direcional'), isBtn: true },
                            { id: 'Riva',        label: 'RIVA',        icon: <span style={{width:5,height:5,borderRadius:2,background:'rgba(255,255,255,0.7)',flexShrink:0,display:'inline-block'}}/>, action: () => setActiveBrand('Riva'),        isBtn: true },
                            { id: 'Ranking',     label: 'VER RANKING', icon: <Trophy size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, href: 'https://ranking-direcional.streamlit.app/' },
                            { id: 'Simulador',   label: 'SIMULADOR',   icon: <Calculator size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, href: 'https://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso&isVoltar=true' },
                            { id: 'Tabelas',     label: 'TABELAS',     icon: <TableProperties size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, href: 'https://drive.google.com/drive/folders/14mYfQkNaSc9APr6hpOTKKTFQ02oq3uOf?usp=sharing' },
                            { id: 'Utilitarios', label: 'UTILITÁRIOS', icon: <BookMarked size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, action: () => setActiveBrand('Utilitarios'), isBtn: true },
                            { id: 'Guia',        label: 'GUIA',        icon: <HelpCircle size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, action: () => setActiveBrand('Guia'),        isBtn: true },
                        ].map((tab) => {
                            const isActive = activeBrand === tab.id;
                            const tabStyle = {
                                borderRadius: 12,
                                paddingTop: 9, paddingBottom: 9, paddingLeft: 16, paddingRight: 16,
                                cursor: 'pointer', textDecoration: 'none',
                                display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, whiteSpace: 'nowrap',
                                transition: 'background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                                background: isActive
                                    ? (modoNoturno ? 'rgba(255,255,255,0.28)' : 'rgba(15,23,42,0.12)')
                                    : (modoNoturno ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.05)'),
                                border: isActive
                                    ? (modoNoturno ? '1px solid rgba(255,255,255,0.40)' : '1px solid rgba(15,23,42,0.25)')
                                    : (modoNoturno ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.10)'),
                                boxShadow: isActive
                                    ? (modoNoturno ? '0 2px 14px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.35)' : '0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)')
                                    : 'none',
                            };
                            const labelColor = modoNoturno ? '#fff' : '#1e293b';
                            const labelOpacity = isActive ? 1 : (modoNoturno ? 0.38 : 0.5);
                            const iconColor = modoNoturno ? 'rgba(255,255,255,0.6)' : 'rgba(30,41,59,0.6)';
                            const inner = (
                                <>
                                    <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.05em', color: labelColor, opacity: labelOpacity, transition: 'opacity 0.25s' }}>{tab.label}</span>
                                    <span style={{ opacity: isActive ? 0.85 : 0.28, display: 'flex', alignItems: 'center', transition: 'opacity 0.25s', color: iconColor }}>{tab.icon}</span>
                                </>
                            );
                            return tab.isBtn ? (
                                <button key={tab.id} onClick={() => { haptic(); tab.action(); }} style={tabStyle}>{inner}</button>
                            ) : (
                                <a key={tab.id} href={tab.href} target="_blank" rel="noopener noreferrer" style={tabStyle}>{inner}</a>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* ── PAINEL INFORMAÇÕES COMERCIAIS — visível até domingo 22/03/2026, some na segunda ── */}
            {(() => {
                const hoje = new Date();
                const expira = new Date('2026-03-23T00:00:00'); // segunda-feira 23/03
                if (hoje >= expira) return null;
                return (
            <aside className="hidden xl:block" style={{
                position: 'fixed',
                top: headerHeight + 16,
                left: 20,
                width: 260,
                maxHeight: `calc(100vh - ${headerHeight + 32}px)`,
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                zIndex: 30,
            }}>
                <div style={{ padding: '4px 0' }}>

                    {/* Título */}
                    <div style={{ padding: '0 4px 10px' }}>
                        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: modoNoturno ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.32)', margin: 0 }}>
                            Março 2026
                        </p>
                        <p style={{ fontSize: 15, fontWeight: 700, color: modoNoturno ? '#fff' : '#000', margin: '3px 0 0', letterSpacing: '-0.01em' }}>
                            Informações Comerciais
                        </p>
                    </div>

                    {/* Linha separadora */}
                    <div style={{ height: '0.5px', background: modoNoturno ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)', margin: '0 4px 8px' }} />

                    {/* Campanhas */}
                    <div style={{ padding: '0 4px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {[
                            { icon: '✓', label: 'ITBI + Registro Grátis' },
                            { icon: '·', label: 'Entrada facilitada' },
                            { icon: '·', label: 'Campanha G3% disponível' },
                        ].map((b, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: modoNoturno ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.28)', width: 10, flexShrink: 0 }}>{b.icon}</span>
                                <span style={{ fontSize: 12, color: modoNoturno ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)', fontWeight: 400 }}>{b.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Gerentes */}
                    {[
                        {
                            nome: 'Daniele',
                            items: [
                                { emp: 'Brisas do Horizonte',       note: 'ITBI Grátis · 20 un.', highlight: true },
                                { emp: 'Viva Vida Rio Tapajós',      note: 'G3%', highlight: false },
                                { emp: 'Viva Vida Rio Amazonas',     note: null, highlight: false },
                                { emp: 'Village Torres',            note: null, highlight: false },
                                { emp: 'Conquista Jardim Botânico',  note: null, highlight: false },
                                { emp: 'Reserva das Águas',         note: null, highlight: false },
                            ],
                        },
                        {
                            nome: 'Evelyn',
                            items: [
                                { emp: 'Viva Vida Coral',    note: 'ITBI Grátis · 50 un.', highlight: true },
                                { emp: 'Conquista Topázio',  note: null, highlight: false },
                                { emp: 'Conquista Rio Negro', note: null, highlight: false },
                                { emp: 'Reserva das Águas',  note: null, highlight: false },
                            ],
                        },
                        {
                            nome: 'Hidaka',
                            items: [
                                { emp: 'Bosque das Torres',       note: 'ITBI Grátis · 25 un.', highlight: true },
                                { emp: 'Conquista Ville Orquídea', note: null, highlight: false },
                            ],
                        },
                        {
                            nome: 'Mateus',
                            items: [
                                { emp: 'Parque Ville Lírio Azul',  note: null, highlight: false },
                                { emp: 'Conquista Jardim Norte',   note: 'ITBI Grátis · 25 un.', highlight: true },
                            ],
                        },
                    ].map((g, gi, arr) => (
                        <div key={gi}>
                            <div style={{ height: '0.5px', background: modoNoturno ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)', margin: '0 4px' }} />
                            {/* Nome gerente — destaque com fundo pill */}
                            <div style={{ padding: '9px 4px 5px' }}>
                                <span style={{
                                    display: 'inline-block',
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                    letterSpacing: '0.07em',
                                    textTransform: 'uppercase',
                                    color: modoNoturno ? '#93c5fd' : '#1e3a8a',
                                    background: modoNoturno ? 'rgba(59,130,246,0.12)' : 'rgba(30,58,138,0.08)',
                                    borderRadius: 5,
                                    padding: '2px 7px',
                                }}>
                                    {g.nome}
                                </span>
                            </div>
                            {/* Empreendimentos */}
                            <div style={{ padding: '0 4px', paddingBottom: gi === arr.length - 1 ? 4 : 4 }}>
                                {g.items.map((it, ii) => (
                                    <div key={ii} style={{
                                        padding: it.highlight ? '6px 8px' : '5px 8px',
                                        marginBottom: 2,
                                        borderRadius: it.highlight ? 8 : 6,
                                        background: it.highlight
                                            ? (modoNoturno ? 'rgba(59,130,246,0.08)' : 'rgba(30,58,138,0.06)')
                                            : 'transparent',
                                        borderLeft: it.highlight
                                            ? `2px solid ${modoNoturno ? '#3b82f6' : '#1e3a8a'}`
                                            : '2px solid transparent',
                                    }}>
                                        <p style={{
                                            fontSize: it.highlight ? 13 : 12.5,
                                            fontWeight: it.highlight ? 600 : 400,
                                            color: it.highlight
                                                ? (modoNoturno ? '#93c5fd' : '#1e3a8a')
                                                : (modoNoturno ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.52)'),
                                            margin: 0,
                                            lineHeight: 1.35,
                                        }}>
                                            {it.emp}
                                        </p>
                                        {it.note && (
                                            <p style={{
                                                fontSize: 11,
                                                fontWeight: it.highlight ? 500 : 400,
                                                color: it.highlight
                                                    ? (modoNoturno ? 'rgba(147,197,253,0.70)' : '#1d4ed8')
                                                    : (modoNoturno ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)'),
                                                margin: '1px 0 0',
                                            }}>
                                                {it.note}
                                            </p>
                                        )}
                                        {!it.note && (
                                            <p style={{ fontSize: 11, fontWeight: 400, color: modoNoturno ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.22)', margin: '1px 0 0' }}>
                                                Condição padrão
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                </div>
            </aside>
                );
            })()}

            <main className="main-content w-full" style={{ paddingTop: `${headerHeight}px`, paddingLeft: 'clamp(16px, calc((100vw - 640px) * 0.3 + 16px), 100px)', paddingRight: 'clamp(16px, calc((100vw - 640px) * 0.3 + 16px), 100px)' }}>
                {/* BANNER INSPIRAÇÃO DIÁRIA */}
                {/* ── BANNER + ABAS ── */}
                <div className="relative shadow-lg banner-reveal" style={{
                    borderRadius: 24,
                    clipPath: 'inset(0 round 24px)',
                    marginTop: 16,
                    marginBottom: 16,
                    marginLeft: 0,
                    marginRight: 0,
                }}>
                    <img src={imagemDoDia} onError={(e) => { e.target.src = '' }} alt="Equipe Destemidos" className="w-full h-screen sm:h-screen object-cover bg-slate-200 banner-ken-burns" style={{ objectPosition: `center ${bannerFocusY}`, display: 'block', maxHeight: '560px' }} />
                    {/* Camada 1: blur progressivo de baixo pra cima */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                        maskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 62%)',
                        WebkitMaskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 62%)',
                    }}/>
                    {/* Camada 2: escurecimento */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.50) 32%, rgba(0,0,0,0.12) 60%, transparent 80%)',
                    }}/>
                    {/* Conteúdo */}
                    <div className="absolute inset-0 flex flex-col justify-end">
                        <div className="px-4 sm:px-8 pt-8 sm:pt-12">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4 banner-text-1">
                                <span className="bg-amber-500 text-amber-950 text-[10px] sm:text-xs font-black uppercase tracking-wider py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-full flex items-center gap-1 shadow-lg">
                                    <Sparkles size={12} /> Inspiração do Dia
                                </span>
                            </div>
                            <div className="banner-text-2">
                                <div>
                                    <span style={{
                                        fontFamily: 'Georgia, serif',
                                        fontSize: 38,
                                        lineHeight: 0.75,
                                        color: '#e8c96a',
                                        opacity: 0.65,
                                        display: 'inline',
                                        verticalAlign: 'top',
                                        marginRight: 5,
                                        userSelect: 'none',
                                    }}>"</span>
                                    <p style={{
                                        fontFamily: 'Georgia, serif',
                                        fontStyle: 'italic',
                                        fontWeight: 400,
                                        fontSize: 'clamp(14px, 3vw, 21px)',
                                        color: '#f0e8d4',
                                        lineHeight: 1.6,
                                        display: 'inline',
                                        textShadow: '0 1px 8px rgba(0,0,0,0.4)',
                                    }}>
                                        {fraseDoDia.texto.split(/('[^']*')/g).map((parte, i) =>
                                            /^'[^']*'$/.test(parte)
                                                ? <strong key={i} style={{ fontStyle: 'normal', fontWeight: 700, color: '#fcd34d', fontFamily: 'Georgia, serif' }}>{parte}</strong>
                                                : <React.Fragment key={i}>{parte}</React.Fragment>
                                        )}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 12 }}>
                                    <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#c9a84c', opacity: 0.55, flexShrink: 0 }} />
                                    <p style={{
                                        fontSize: 9,
                                        color: 'rgba(255,255,255,0.25)',
                                        letterSpacing: '0.16em',
                                        textTransform: 'uppercase',
                                        fontFamily: 'Georgia, serif',
                                        fontStyle: 'italic',
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
                                    { id: 'Ranking',     label: 'VER RANKING', icon: <Trophy size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, href: 'https://ranking-direcional.streamlit.app/' },
                                    { id: 'Simulador',   label: 'SIMULADOR',   icon: <Calculator size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, href: 'https://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso&isVoltar=true' },
                                    { id: 'Tabelas',     label: 'TABELAS',     icon: <TableProperties size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, href: 'https://drive.google.com/drive/folders/14mYfQkNaSc9APr6hpOTKKTFQ02oq3uOf?usp=sharing' },
                                    { id: 'Utilitarios', label: 'UTILITÁRIOS', icon: <BookMarked size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, action: () => setActiveBrand('Utilitarios'), isBtn: true },
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
                                        style={{ overflowX: 'auto', overflowY: 'visible', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingLeft: 16, paddingRight: 16, paddingBottom: 4, justifyContent: 'safe center' }}>
                                        {TABS.map((tab, idx) => {
                                            const isActive = activeBrand === tab.id;
                                            const dockPad = getDockPadding(idx);
                                            const dockFs  = getDockFontSize(idx);
                                            const style = {
                                                borderRadius: 12, ...dockPad, border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, scrollSnapAlign: 'start', whiteSpace: 'nowrap',
                                                transition: 'padding 0.30s cubic-bezier(0.25,0.46,0.45,0.94), background 0.25s ease, box-shadow 0.25s ease',
                                                background: isActive ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.07)',
                                                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                                                border: isActive ? '1px solid rgba(255,255,255,0.40)' : '1px solid rgba(255,255,255,0.12)',
                                                boxShadow: isActive ? '0 2px 14px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.35)' : 'none',
                                                animation: isActive ? 'tab-brighten 0.30s ease forwards' : 'none',
                                            };
                                            const inner = (
                                                <>
                                                    <span style={{ fontSize: dockFs, fontWeight:800, letterSpacing:'0.05em', color:'#fff', opacity: isActive ? 1 : 0.38, transition:'font-size 0.30s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.25s' }}>{tab.label}</span>
                                                    <span style={{ opacity: isActive ? 0.85 : 0.28, transition:'opacity 0.25s', display:'flex', alignItems:'center' }}>{tab.icon}</span>
                                                </>
                                            );
                                            const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;
                                            const dockHandlers = {
                                                onMouseEnter: () => { if (!isTouchDevice()) setHoveredTabIdx(idx); },
                                                onMouseLeave: () => { if (!isTouchDevice()) setHoveredTabIdx(null); },
                                            };
                                            return tab.isBtn ? (
                                                <button key={tab.id} ref={tabRefs[tab.id]} onClick={() => { haptic(); tab.action(); }} style={style} {...dockHandlers}>{inner}</button>
                                            ) : (
                                                <a key={tab.id} href={tab.href} target="_blank" rel="noopener noreferrer" style={style} {...dockHandlers}>{inner}</a>
                                            );
                                        })}
                                    </nav>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* ── FAIXA RANKING HORIZONTAL ── */}
                <style>{`
                    @keyframes rank-expand { from { max-height:0; opacity:0; } to { max-height:320px; opacity:1; } }
                    @keyframes rank-collapse { from { max-height:320px; opacity:1; } to { max-height:0; opacity:0; } }
                    .rank-strip-expanded { animation: rank-expand 0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
                    .rank-strip-collapsed { animation: rank-collapse 0.26s cubic-bezier(0.4,0,1,1) forwards; overflow:hidden; }
                    @keyframes dst-bar-load { 0%{width:0%} 100%{width:var(--bar-w)} }
                    .dst-bar-fill { animation: dst-bar-load 1s cubic-bezier(0.22,1,0.36,1) both; }
                `}</style>

                {/* ── FAIXA RANKING — cabeçalho + painel integrado ── */}
                <style>{`
                    @keyframes dst-bar-load { 0%{width:0%} 100%{width:var(--bar-w)} }
                    .dst-bar-fill { animation: dst-bar-load 1s cubic-bezier(0.22,1,0.36,1) both; }
                    .rank-metrics {
                        display: grid;
                        grid-template-rows: 0fr;
                        transition: grid-template-rows 0.40s cubic-bezier(0.22,1,0.36,1);
                        overflow: hidden;
                    }
                    .rank-metrics.open {
                        grid-template-rows: 1fr;
                    }
                    .rank-metrics-inner { min-height: 0; }
                    .rank-label-text {
                        transition: font-size 0.30s cubic-bezier(0.22,1,0.36,1),
                                    font-weight 0.30s ease,
                                    letter-spacing 0.30s ease,
                                    color 0.30s ease;
                    }
                    .rank-val-text {
                        transition: opacity 0.20s ease, max-width 0.25s ease;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    .rank-strip-wrap { display: none; }
                    @media (min-width: 640px) { .rank-strip-wrap { display: block; } }
                `}</style>

                <div className="rank-strip-wrap">
                <div
                    onClick={() => setRankingExpandido(p => !p)}
                    style={{
                        marginBottom: 16,
                        borderRadius: 16,
                        background: modoNoturno ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                        border: modoNoturno ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.07)',
                        overflow: 'hidden',
                        userSelect: 'none',
                        cursor: 'pointer',
                    }}>
                    {/* linha de cabeçalho */}
                    <div style={{ display:'flex', alignItems:'stretch' }}>
                        {/* label RANKING — some quando expandido */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '9px 14px',
                            flexShrink: 0,
                            borderRight: modoNoturno ? '0.5px solid rgba(255,255,255,.08)' : '0.5px solid rgba(0,0,0,.07)',
                            overflow: 'hidden',
                            maxWidth: rankingExpandido ? 0 : 120,
                            paddingLeft: rankingExpandido ? 0 : 14,
                            paddingRight: rankingExpandido ? 0 : 14,
                            opacity: rankingExpandido ? 0 : 1,
                            transition: 'max-width 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.20s ease, padding 0.32s cubic-bezier(0.22,1,0.36,1)',
                            borderRightWidth: rankingExpandido ? 0 : undefined,
                        }}>
                            <span style={{ fontSize:8.5, fontWeight:700, letterSpacing:'.20em', textTransform:'uppercase', color: modoNoturno?'rgba(255,255,255,.22)':'rgba(0,0,0,.28)', whiteSpace:'nowrap' }}>RANKING</span>
                        </div>

                        {/* 5 colunas */}
                        {[
                            { short:'DIA',  full:'DIAMANTE', color:'#60a5fa', val:'25%', bar:1.00, rows:[['PRO SOLUTO','25%'],['FINANC. 84X','50%'],['COMP. RENDA','20%']] },
                            { short:'OURO', full:'OURO',     color:'#fbbf24', val:'20%', bar:.80,  rows:[['PRO SOLUTO','20%'],['FINANC. 84X','50%'],['COMP. RENDA','20%']] },
                            { short:'PRA',  full:'PRATA',    color:'#94a3b8', val:'18%', bar:.72,  rows:[['PRO SOLUTO','18%'],['FINANC. 84X','48%'],['COMP. RENDA','18%']] },
                            { short:'BRO',  full:'BRONZE',   color:'#fb923c', val:'15%', bar:.60,  rows:[['PRO SOLUTO','15%'],['FINANC. 84X','45%'],['COMP. RENDA','15%']] },
                            { short:'AÇO',  full:'AÇO',      color:'#64748b', val:'12%', bar:.48,  rows:[['PRO SOLUTO','12%'],['FINANC. 84X','40%'],['COMP. RENDA','10%']] },
                        ].map((r, i) => (
                            <div key={r.short} style={{ flex:'1 1 0%', borderRight: i<4 ? (modoNoturno?'0.5px solid rgba(255,255,255,.08)':'0.5px solid rgba(0,0,0,.07)') : 'none', display:'flex', flexDirection:'column' }}>

                                {/* cabeçalho da coluna */}
                                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'9px 8px' }}>
                                    <div style={{ width:6, height:6, borderRadius:'50%', background:r.color, flexShrink:0, transition:'all 0.22s ease' }}/>
                                    <span style={{
                                        fontWeight: rankingExpandido ? 800 : 500,
                                        letterSpacing: rankingExpandido ? '.06em' : '.02em',
                                        textTransform: 'uppercase',
                                        fontSize: rankingExpandido ? 10 : 9,
                                        color: rankingExpandido
                                            ? (modoNoturno?'rgba(255,255,255,.80)':'rgba(0,0,0,.72)')
                                            : (modoNoturno?'rgba(255,255,255,.45)':'rgba(0,0,0,.45)'),
                                        transition: 'font-size 0.28s cubic-bezier(0.22,1,0.36,1), font-weight 0.28s ease, letter-spacing 0.28s ease, color 0.28s ease',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {rankingExpandido ? r.full : r.short}
                                    </span>
                                    <span style={{ fontSize:12, fontWeight:800, color: modoNoturno?'rgba(255,255,255,.72)':'rgba(0,0,0,.65)', transition:'opacity 0.18s ease, max-width 0.22s ease', opacity: rankingExpandido ? 0 : 1, maxWidth: rankingExpandido ? 0 : 40, overflow:'hidden', whiteSpace:'nowrap' }}>{r.val}</span>
                                </div>

                                {/* métricas expansíveis */}
                                <div className={`rank-metrics${rankingExpandido ? ' open' : ''}`}>
                                    <div className="rank-metrics-inner">
                                        {/* barra — re-anima ao expandir via key */}
                                        <div style={{ height:2, margin:'0 14px 8px', borderRadius:2, overflow:'hidden', background: modoNoturno?'rgba(255,255,255,.07)':'rgba(0,0,0,.07)' }}>
                                            <div key={`bar-${r.short}-${rankingExpandido}`} className="dst-bar-fill" style={{ '--bar-w':`${r.bar*100}%`, width:`${r.bar*100}%`, height:'100%', background:r.color, opacity:.65, animationDelay:`${0.30 + i*.10}s` }}/>
                                        </div>
                                        {/* métricas */}
                                        <div style={{ padding:'0 14px 10px' }}>
                                            {r.rows.map(([lbl,val]) => (
                                                <div key={lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
                                                    <span style={{ fontSize:8, color: modoNoturno?'rgba(255,255,255,.28)':'rgba(0,0,0,.32)', fontWeight:500, letterSpacing:'.04em' }}>{lbl}</span>
                                                    <span style={{ fontSize:11, fontWeight:800, color: modoNoturno?'rgba(255,255,255,.72)':'rgba(0,0,0,.65)' }}>{val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* chevron */}
                        <div style={{ display:'flex', alignItems:'center', padding:'0 12px', flexShrink:0, color: modoNoturno?'rgba(255,255,255,.28)':'rgba(0,0,0,.28)', transition:'transform 0.30s ease', transform: rankingExpandido?'rotate(180deg)':'rotate(0deg)' }}>
                            <ChevronDown size={14}/>
                        </div>
                    </div>
                </div>
                </div>{/* /rank-strip-wrap */}

                {(activeBrand === 'Direcional' || activeBrand === 'Riva') && (
                    <>
                        {filteredRevistas.length === 0 ? (
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
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeBrand === 'Utilitarios' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {utilitariosData.map((item, index) => (
                            <a key={index} href={item.link} target="_blank" rel="noopener noreferrer"
                                className={`card-entry p-5 rounded-xl border shadow-sm hover:shadow-md hover:border-orange-300 transition-all flex items-start gap-4 group ${modoNoturno ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                                style={{ animationDelay: `${index * 90}ms` }}>
                                <div className="bg-orange-100 p-3 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors shrink-0"><FileText size={24} /></div>
                                <div className="flex-1">
                                    <h3 className={`font-bold text-sm leading-snug group-hover:text-orange-700 transition-colors ${modoNoturno ? 'text-slate-200' : 'text-slate-700'}`}>{item.title}</h3>
                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">Acessar documento <ExternalLink size={12} /></p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

                {activeBrand === 'Guia' && (
                    <div className="max-w-4xl mx-auto space-y-4">
                        {/* ITEM 1: CÓDIGO DAS FAIXAS */}
                        <div className={`card-entry border rounded-xl overflow-hidden shadow-sm transition-colors ${modoNoturno ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} style={{ animationDelay: '0ms' }}>
                            <button onClick={() => { haptic(); setOpenGuiaIndex(openGuiaIndex === 0 ? null : 0); }} className={`w-full text-left p-5 flex justify-between items-center transition-colors ${modoNoturno ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-50'}`}>
                                <h3 className={`font-bold text-lg flex items-center gap-2 ${modoNoturno ? 'text-white' : 'text-slate-800'}`}><HelpCircle className="text-blue-500" size={20} /> CÓDIGO DAS FAIXAS DE RENDA</h3>
                                {openGuiaIndex === 0 ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                            </button>
                            {openGuiaIndex === 0 && (
                                <div className={`p-5 pt-0 border-t transition-colors ${modoNoturno ? 'border-slate-700 text-slate-300 bg-slate-800/50' : 'border-slate-100 text-slate-600 bg-slate-50/50'}`}>
                                    <div className="bg-blue-100 text-blue-800 p-3 rounded-lg font-bold flex items-center gap-2 my-4 w-fit text-sm uppercase tracking-wider">Simulador Caixa</div>
                                    <p className="mb-4">O simulador do Portal já está ajustado para o novo MCMV, podendo simular todas as faixas do programa.</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className={`p-4 rounded-xl border ${modoNoturno ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                                            <p className={`font-bold mb-2 uppercase text-xs text-blue-500 tracking-widest`}>MCMV:</p>
                                            <ul className="space-y-2">
                                                <li className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> <strong>FAIXA 1</strong> - código 3280</li>
                                                <li className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> <strong>FAIXA 2</strong> - código 3280</li>
                                                <li className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> <strong>FAIXA 3</strong> - código 3302</li>
                                                <li className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> <strong>FAIXA 4</strong> - código 3550</li>
                                            </ul>
                                        </div>
                                        <div className={`p-4 rounded-xl border ${modoNoturno ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                                            <p className={`font-bold mb-2 uppercase text-xs text-blue-500 tracking-widest`}>OUTROS:</p>
                                            <p className="text-sm"><strong>SBPE</strong> - código 1976</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ITEM 2: PROBLEMAS COM CADASTRO/OPORTUNIDADE */}
                        <div className={`card-entry border rounded-xl overflow-hidden shadow-sm transition-colors ${modoNoturno ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} style={{ animationDelay: '80ms' }}>
                            <button onClick={() => { haptic(); setOpenGuiaIndex(openGuiaIndex === 1 ? null : 1); }} className={`w-full text-left p-5 flex justify-between items-center transition-colors ${modoNoturno ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-50'}`}>
                                <h3 className={`font-bold text-lg flex items-center gap-2 ${modoNoturno ? 'text-white' : 'text-slate-800'}`}><AlertTriangle className="text-rose-500" size={20} /> PROBLEMAS COM CADASTRO OU OPORTUNIDADE</h3>
                                {openGuiaIndex === 1 ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                            </button>
                            {openGuiaIndex === 1 && (
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
                            )}
                        </div>

                        {/* ITEM 3: TERMOS TÉCNICOS */}
                        <div className={`card-entry border rounded-xl overflow-hidden shadow-sm transition-colors ${modoNoturno ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} style={{ animationDelay: '160ms' }}>
                            <button onClick={() => { haptic(); setOpenGuiaIndex(openGuiaIndex === 2 ? null : 2); }} className={`w-full text-left p-5 flex justify-between items-center transition-colors ${modoNoturno ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-50'}`}>
                                <h3 className={`font-bold text-lg flex items-center gap-2 ${modoNoturno ? 'text-white' : 'text-slate-800'}`}><Book className="text-emerald-500" size={20} /> TERMOS TÉCNICOS ATUALMENTE USADOS</h3>
                                {openGuiaIndex === 2 ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                            </button>
                            {openGuiaIndex === 2 && (
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
                            )}
                        </div>

                        {/* ITEM 4: CONTATOS DE CARTÓRIOS DE PROTESTOS */}
                        <div className={`card-entry border rounded-xl overflow-hidden shadow-sm transition-colors ${modoNoturno ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} style={{ animationDelay: '240ms' }}>
                            <button onClick={() => { haptic(); setOpenGuiaIndex(openGuiaIndex === 3 ? null : 3); }} className={`w-full text-left p-5 flex justify-between items-center transition-colors ${modoNoturno ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-50'}`}>
                                <h3 className={`font-bold text-lg flex items-center gap-2 ${modoNoturno ? 'text-white' : 'text-slate-800'}`}><Phone className="text-purple-500" size={20} /> CONTATOS DE CARTÓRIOS DE PROTESTOS DE MANAUS</h3>
                                {openGuiaIndex === 3 ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                            </button>
                            {openGuiaIndex === 3 && (
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
                            )}
                        </div>
                    </div>
                )}
            </main>

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
                            background: isDir
                                ? 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)'
                                : 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
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
                                        background: isDir ? '#f97316' : '#3b82f6',
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
                const driveViewUrl = pdfLeitor.url.replace('/preview', '/view');
                const whatsappMsg = `Olá!\nSegue a Revista Digital do ${pdfLeitor.title} para você conhecer melhor o empreendimento:\n${driveViewUrl}\nQualquer dúvida, estou à disposição!`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`;
                return (
                    <div className="fixed inset-0 z-[60]" style={{background:'#0f0f0f'}}>

                        {/* iframe — começa abaixo da status bar para o botão nativo do Drive ficar visível */}
                        <div className="absolute left-0 right-0 bottom-0 z-0"
                            style={{top:'env(safe-area-inset-top, 0px)', background:'#0f0f0f'}}>
                            {/* Loading atrás do iframe */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none" style={{background:'#0f0f0f', zIndex:0}}>
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDir ? 'bg-orange-500/20' : 'bg-blue-500/20'}`}>
                                    <BookOpen size={32} className={isDir ? 'text-orange-400' : 'text-blue-400'} />
                                </div>
                                <p className="text-white/60 text-sm">Carregando revista...</p>
                                <div className="flex gap-1.5">
                                    {[0,1,2].map(i => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${isDir ? 'bg-orange-400' : 'bg-blue-400'}`}
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
                    'Parque Ville Lírio Azul':      '-2.9759258,-60.0065576',
                    'Amazon Boulevard Classic':     '-3.060292,-60.0253649',
                    'Amazon Boulevard Prime':       '-3.060292,-60.0253649',
                    'Città Oasis Azzure':           '-3.0732449,-60.0158834',
                    'Zenith Condomínio Clube':      '-3.1040641,-59.9993555',
                    'Conquista Topázio':            '-3.01547,-60.018348',
                    'Conquista Rio Negro':          '-3.0401114,-60.0800979',
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
                    'Colégio Militar da PM VI':                'Colégio Militar da PM VI, Lago Azul, Manaus',
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
                    'Orla da Ponta Negra':                     'Orla da Ponta Negra, Manaus',
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
                    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${closingPoi ? 'poi-backdrop-out' : 'poi-backdrop'}`}
                        style={{ background: modoNoturno ? 'rgba(7,11,22,0.65)' : 'rgba(15,23,42,0.35)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                        onClick={closePoi}>
                        <div className={`w-full max-w-md overflow-hidden ${closingPoi ? 'poi-modal-close' : 'poi-modal-open'}`}
                            style={modoNoturno ? {
                                borderRadius:'24px', background:'rgba(10,15,30,0.72)', backdropFilter:'blur(40px) saturate(180%)', WebkitBackdropFilter:'blur(40px) saturate(180%)', border:'1.5px solid rgba(255,255,255,0.16)', outline:'1px solid rgba(99,179,248,0.12)', outlineOffset:'-2px', boxShadow:'0 8px 32px rgba(0,0,0,0.6), 0 32px 80px rgba(0,0,0,0.5), inset 0 1.5px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.2)'
                            } : {
                                borderRadius:'24px', background:'rgba(255,255,255,0.52)', backdropFilter:'blur(40px) saturate(220%) brightness(1.05)', WebkitBackdropFilter:'blur(40px) saturate(220%) brightness(1.05)', border:'1.5px solid rgba(255,255,255,0.92)', outline:'1.5px solid rgba(150,175,230,0.45)', outlineOffset:'-2px', boxShadow:'0 4px 16px rgba(80,110,200,0.12), 0 16px 48px rgba(80,110,200,0.18), inset 0 2px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(100,130,200,0.12)'
                            }}
                            onClick={e => e.stopPropagation()}>
                            <div className="p-4 flex justify-between items-center"
                                style={{ borderBottom: modoNoturno ? '1px solid rgba(99,179,248,0.12)' : '1px solid rgba(0,0,0,0.06)', background: modoNoturno ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)' }}>
                                <h3 className={`font-bold flex items-center gap-2 ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>
                                    <MapPin className="text-rose-500" size={20} /> Pontos de Referência
                                </h3>
                                <button onClick={closePoi} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/40 transition-colors"><X size={20} /></button>
                            </div>
                            <div className="p-5">
                                <h4 className={`font-bold text-lg mb-1 ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>{selectedPois.title}</h4>
                                <p className={`text-[10px] font-semibold mb-4 flex items-center gap-1.5 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>
                                    <span>👆</span> Toque em qualquer ponto para ver o caminho no mapa
                                </p>
                                <div className="rounded-xl overflow-hidden"
                                    style={{ border: modoNoturno ? '1px solid rgba(99,179,248,0.12)' : '1px solid rgba(0,0,0,0.06)', background: modoNoturno ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)' }}>
                                    {selectedPois.pois.map((poi, idx) => (
                                        <button key={idx} onClick={() => abrirMapa(poi)}
                                            style={{ animationDelay:`${idx * 0.05}s` }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all active:scale-[0.98] poi-item-in group ${modoNoturno ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50/60'}`}>
                                            <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:scale-110 ${modoNoturno ? 'bg-rose-500/15' : 'bg-rose-50/80'}`}>
                                                <MapPin size={13} className="text-rose-500" />
                                            </div>
                                            <span className={`flex-1 text-sm font-medium leading-snug transition-colors ${modoNoturno ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{poi}</span>
                                            <div className={`shrink-0 flex items-center gap-1 text-[9px] font-black uppercase tracking-wider transition-all opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 ${modoNoturno ? 'text-rose-400' : 'text-rose-500'}`}>
                                                <span>Ver rota</span><ExternalLink size={10} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => { haptic(); closePoi(); }}
                                    className={`w-full mt-4 py-2.5 font-semibold rounded-xl transition-all text-sm active:scale-[0.98] ${modoNoturno ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100/60'}`}
                                    style={{ border: modoNoturno ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)', background: modoNoturno ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)' }}>
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* --- ÍCONE DO ROBÔ E BALÃO AMIGÁVEL --- */}
            {/* ── HINT PILLS — renderizado como componente fixo ── */}
            <HintPills onPhaseChange={setHintPhase} />

            <div className={`fixed bottom-8 right-8 z-40 flex flex-col items-end gap-3 transition-all duration-500 ${isChatOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-0 opacity-0 pointer-events-none'}`}>
                {/* Botões movidos para o header */}

                {/* Botão Pasta flutuante */}
                <button
                    onClick={() => { haptic('medium'); setFolderSource('manual'); setIsCreatingFolder(true); setIsChatOpen(true); setTimeout(() => fileInputRef.current?.click(), 100); }}
                    className="w-14 h-14 text-white rounded-[1.75rem] hover:rounded-[1rem] hover:scale-110 active:scale-95 transition-all duration-500 flex items-center justify-center relative overflow-hidden border-2 border-white/20 shadow-2xl"
                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 60%, #7c3aed 100%)', boxShadow: '0 4px 20px rgba(99,102,241,0.5)' }}
                    title="Criar Pasta"
                >
                    <FolderPlus size={22} />
                </button>

                {/* Balão de frase + botão chatbot */}
                <div className="flex flex-row items-end gap-3">
                <div 
                    className={`px-5 py-3 rounded-2xl shadow-xl border relative flex items-center gap-2 group cursor-pointer transition-all duration-500 origin-bottom-right ${
                        isScrolling 
                        ? 'scale-0 opacity-0 translate-y-8 pointer-events-none' 
                        : 'scale-100 opacity-100 translate-y-0 animate-float'
                    } ${modoNoturno ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-100'}`}
                    onClick={() => setIsChatOpen(true)}
                >
                    <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600 shrink-0">
                        <Sparkles size={14} className="animate-pulse" />
                    </div>
                    <span className={`font-bold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${modoNoturno ? 'text-white' : 'text-slate-700'} ${isScrolling ? 'max-w-0' : 'max-w-xs'}`}>
                        {robotFloatingPhrases[robotPhraseIndex]}
                    </span>
                    <div className={`absolute -right-2 bottom-4 w-4 h-4 border-r border-b rotate-[-45deg] ${modoNoturno ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-100'}`}></div>
                </div>

                <button
                    onClick={() => { haptic('medium'); setIsChatOpen(true); }}
                    className={`w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-800 text-white rounded-[1.75rem] hover:rounded-[1rem] hover:scale-110 active:scale-95 transition-all duration-500 flex items-center justify-center relative group overflow-hidden border-2 border-white/20 ${hintPhase === 'show' ? 'chat-btn-calling' : ''} ${hintPhase === 'fly' ? 'chat-btn-absorb' : ''}`}
                    style={{ animation: 'ia-btn-enter 0.6s cubic-bezier(0.34,1.56,0.64,1) both' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {/* smooth sweep shine */}
                    <div className="btn-shine-layer absolute inset-0"></div>
                    <div className="ia-ring" aria-hidden="true"></div>
                    <div className="relative z-10 w-7 h-7 flex items-center justify-center" style={{opacity: chatBtnIconVisible ? 1 : 0, transition: 'opacity 1.1s ease'}}>
                        {chatBtnIcon === 'chat' ? (
                            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" style={{animation:'icon-pop 0.35s cubic-bezier(0.34,1.6,0.64,1)'}} xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.477 2 2 6.254 2 11.5c0 2.576 1.086 4.91 2.857 6.614L4 22l4.23-1.394A10.456 10.456 0 0012 21c5.523 0 10-4.254 10-9.5S17.523 2 12 2z" fill="white" fillOpacity="0.95"/>
                                <circle cx="8.5" cy="11.5" r="1.2" fill="#3b82f6"/>
                                <circle cx="12" cy="11.5" r="1.2" fill="#3b82f6"/>
                                <circle cx="15.5" cy="11.5" r="1.2" fill="#3b82f6"/>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" style={{animation:'icon-pop 0.35s cubic-bezier(0.34,1.6,0.64,1)'}} xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 7a2 2 0 012-2h3.586a1 1 0 01.707.293L10.707 6.7A1 1 0 0011.414 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" fill="white" fillOpacity="0.95" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
                                <path d="M7 13h10M7 16h6" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        )}
                    </div>
                </button>
                </div>{/* fim flex-row chatbot */}
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
                    .search-input-premium { transition: box-shadow 0.3s ease, background 0.3s ease; }
                    .search-input-premium:focus {
                        box-shadow: 0 0 0 2px rgba(99,102,241,0.25), 0 4px 16px rgba(99,102,241,0.1);
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
                    @keyframes badge-pulse { 0%,100% { box-shadow:0 0 0 0 rgba(249,115,22,0.6), 0 0 0 0 rgba(249,115,22,0.3); } 50% { box-shadow:0 0 0 5px rgba(249,115,22,0.0), 0 0 0 10px rgba(249,115,22,0.0); } }
                    
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
                    .poi-item-in      { animation: poi-item-in 0.3s ease both; opacity:0; }
                    .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                    html { scroll-behavior: smooth; }
                    @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.34,1.2,0.64,1) both; }
                    @keyframes thumbsup { 0% { transform: scale(0) rotate(-20deg); opacity: 0; } 30% { transform: scale(1.3) rotate(8deg); opacity: 1; } 60% { transform: scale(1.1) rotate(-4deg); } 80% { transform: scale(1.15) rotate(2deg); opacity: 1; } 100% { transform: scale(1) rotate(0deg) translateY(-40px); opacity: 0; } }
                    .animate-thumbsup { animation: thumbsup 2.6s cubic-bezier(0.34,1.2,0.64,1) forwards; }
                    @keyframes lightning-bolt { 0% { transform: scale(0) rotate(-15deg); opacity: 0; filter: brightness(1); } 15% { transform: scale(1.4) rotate(5deg); opacity: 1; filter: brightness(2.5) drop-shadow(0 0 30px #fbbf24) drop-shadow(0 0 60px #f97316); } 35% { transform: scale(1.1) rotate(-3deg); opacity: 1; filter: brightness(3) drop-shadow(0 0 40px #fbbf24) drop-shadow(0 0 80px #ef4444); } 55% { transform: scale(1.25) rotate(8deg); opacity: 1; filter: brightness(2) drop-shadow(0 0 50px #f59e0b); } 80% { transform: scale(1.15) rotate(0deg); opacity: 0.9; filter: brightness(2.5) drop-shadow(0 0 60px #fbbf24); } 100% { transform: scale(0.8) rotate(-5deg) translateY(-60px); opacity: 0; filter: brightness(1); } }
                    .animate-lightning { animation: lightning-bolt 2.4s cubic-bezier(0.34,1.2,0.64,1) forwards; }
                    @keyframes flash-bg { 0%, 100% { opacity: 0; } 10% { opacity: 0.35; } 20% { opacity: 0; } 30% { opacity: 0.25; } 45% { opacity: 0; } 60% { opacity: 0.15; } 75% { opacity: 0; } }
                    .animate-flash { animation: flash-bg 2.4s ease-out forwards; }
                    @keyframes light-sweep { 0% { left: -60%; opacity: 0; } 10% { opacity: 1; } 60% { left: 130%; opacity: 0.7; } 100% { left: 130%; opacity: 0; } }
                    .pasta-rapida-btn::after { content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent); transform: skewX(-20deg); animation: light-sweep 1.4s ease-in-out infinite; pointer-events: none; border-radius: inherit; }
                    @keyframes pr-pulse { 0%, 100% { box-shadow: 0 0 0 3px rgba(249,115,22,0.35), 0 0 20px 6px rgba(249,115,22,0.45), 0 2px 8px rgba(0,0,0,0.2); transform: scale(1); } 50% { box-shadow: 0 0 0 5px rgba(249,115,22,0.2), 0 0 28px 10px rgba(249,115,22,0.6), 0 2px 8px rgba(0,0,0,0.2); transform: scale(1.04); } }
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    @keyframes pr-pulse { 0%, 100% { box-shadow: 0 0 0 2px rgba(249,115,22,0.4), 0 0 12px rgba(249,115,22,0.5); transform: scale(1); } 50% { box-shadow: 0 0 0 4px rgba(249,115,22,0.25), 0 0 22px rgba(249,115,22,0.7); transform: scale(1.04); } }

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
                    /* Padding do main para compensar o header fixed (inclui notch no PWA) */
                    .main-content { padding-top: calc(136px + env(safe-area-inset-top, 0px)); }
                    @media (min-width: 640px) { .main-content { padding-top: calc(80px + env(safe-area-inset-top, 0px)); } }
                    /* Folder → Chat collapse/expand */
                    @keyframes folder-collapse-kf { 0% { opacity:1; transform: scaleY(1) translateY(0); } 40% { opacity:0.6; transform: scaleY(0.85) translateY(8px); } 100% { opacity:0; transform: scaleY(0.55) translateY(20px); } }
                    @keyframes folder-expand-kf  { 0% { opacity:0; transform: scaleY(0.55) translateY(20px); } 60% { opacity:1; transform: scaleY(1.03) translateY(-3px); } 100% { opacity:1; transform: scaleY(1) translateY(0); } }
                    .folder-collapsing { animation: folder-collapse-kf 0.30s cubic-bezier(0.4,0,0.6,1) both; transform-origin: bottom center; }
                    .folder-expanding  { animation: folder-expand-kf  0.36s cubic-bezier(0.34,1.3,0.64,1) both; transform-origin: bottom center; }
                    /* === CARD ANIMATIONS DURING AI ANALYSIS === */
                    @keyframes card-pulse-fade {
                        0%,100% { opacity: 1; transform: scale(1); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                        50%     { opacity: 0.45; transform: scale(0.97); box-shadow: 0 0 0 2px rgba(249,115,22,0.4), 0 4px 16px rgba(249,115,22,0.25); }
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

            {/* CHATBOT CONTAINER */}
            <div className={`fixed z-50 overflow-hidden flex flex-col shadow-2xl
                ${isCreatingFolder ? 'chat-folder-full' : 'chat-mobile-full'}
                ${isChatOpen ? (closingChat ? 'chat-closing' : 'chat-opening') : 'scale-0 opacity-0 pointer-events-none'}
                ${isCreatingFolder
                    ? 'left-0 right-0 bottom-0 rounded-none'
                    : 'left-0 right-0 bottom-0 rounded-none md:bottom-6 md:right-6 md:left-auto md:rounded-3xl md:w-[350px] lg:w-[420px] md:h-[600px] md:max-h-[85vh] origin-bottom-right'}
                ${modoNoturno ? 'bg-[#0B1120]' : 'bg-slate-50'}`}>

                {/* ── HEADER CHATBOT ── */}
                <div className="relative overflow-hidden shrink-0"
                    style={{
                        background: isCreatingFolder && folderSource === 'rapida'
                            ? 'linear-gradient(135deg, #f97316 0%, #ef4444 45%, #f59e0b 100%)'
                            : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 40%, #7c3aed 100%)',
                        boxShadow: isCreatingFolder && folderSource === 'rapida'
                            ? '0 4px 32px rgba(249,115,22,0.45)'
                            : '0 4px 32px rgba(99,102,241,0.45)',
                    }}>
                    {/* shimmer sweep */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div style={{ position:'absolute', top:'-20%', left:0, width:'60%', height:'140%', background:'linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.16) 50%, transparent 90%)', animation: isCreatingFolder && folderSource === 'rapida' ? 'light-sweep 1.8s ease-in-out infinite' : 'none', transform:'skewX(-18deg)' }}></div>
                    </div>
                    <div className="relative z-10 px-5 pt-5 pb-4 flex items-center justify-between pasta-header-safe">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-inner">
                                {isCreatingFolder && folderSource === 'rapida' ? (
                                    <Sparkles size={20} className="text-white" style={{filter:'drop-shadow(0 0 6px rgba(255,255,255,0.8))', animation:'spin 3s linear infinite'}} />
                                ) : isCreatingFolder ? (
                                    <FolderPlus size={20} className="text-white" />
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.477 2 2 6.254 2 11.5c0 2.576 1.086 4.91 2.857 6.614L4 22l4.23-1.394A10.456 10.456 0 0012 21c5.523 0 10-4.254 10-9.5S17.523 2 12 2z" fill="white" fillOpacity="0.95"/>
                                        <circle cx="8.5" cy="11.5" r="1.2" fill="#a5b4fc"/>
                                        <circle cx="12" cy="11.5" r="1.2" fill="#a5b4fc"/>
                                        <circle cx="15.5" cy="11.5" r="1.2" fill="#a5b4fc"/>
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h3 className="font-black text-white text-lg uppercase tracking-widest drop-shadow-md">
                                    {isCreatingFolder && folderSource === 'rapida' ? 'Pasta Rápida IA' : isCreatingFolder ? 'Pasta do Cliente' : 'IA Destemidos'}
                                </h3>
                                <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5">
                                    {isCreatingFolder && folderSource === 'rapida' ? (
                                        <><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse"></span>IA Organizando Documentos</>
                                    ) : isCreatingFolder ? (
                                        <><span className="w-1.5 h-1.5 rounded-full bg-indigo-300 animate-pulse"></span>Organizar · PDF · Arrastar</>
                                    ) : (
                                        <><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>Online para te apoiar</>
                                    )}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => { haptic(); closeChat(); }} className="bg-white/10 hover:bg-white/25 active:scale-95 text-white p-2.5 rounded-2xl border border-white/20 transition-all backdrop-blur-sm">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {!isCreatingFolder && (
                    <div ref={chatScrollRef} className={`overflow-y-auto px-4 py-5 space-y-4 custom-scrollbar flex-1 transition-colors ${modoNoturno ? 'bg-[#0B1120]' : 'bg-slate-50'}`}>
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'bot' && (
                                    <div className="w-7 h-7 rounded-2xl shrink-0 mr-2 mt-0.5 flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }}>
                                        <Sparkles size={12} className="text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                    msg.role === 'user'
                                    ? 'rounded-tr-sm text-white'
                                    : (modoNoturno ? 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-sm shadow-sm' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm')
                                }`}
                                style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 60%, #7c3aed 100%)', boxShadow: '0 2px 12px rgba(99,102,241,0.35)' } : {}}>
                                    {msg.role === 'bot' ? renderChatMessage(msg.content) : msg.content}
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div className="flex justify-start items-end gap-2">
                                <div className="w-7 h-7 rounded-2xl shrink-0 flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }}>
                                    <Sparkles size={12} className="text-white" style={{animation:'spin 2s linear infinite'}} />
                                </div>
                                <div className={`border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1.5 items-center ${modoNoturno ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-100'}`}>
                                    <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{background:'#818cf8'}}></div>
                                    <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{background:'#818cf8', animationDelay:'0.2s'}}></div>
                                    <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{background:'#818cf8', animationDelay:'0.4s'}}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {isCreatingFolder && (
                    <div className={`flex-1 overflow-hidden flex flex-col transition-colors ${closingFolder ? 'folder-collapsing' : 'folder-expanding'} ${modoNoturno ? 'bg-[#0B1120]' : 'bg-slate-50'}`}>

                        {/* Subheader da pasta */}
                        <div className={`shrink-0 border-b backdrop-blur-xl transition-colors ${modoNoturno ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
                            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${modoNoturno ? 'border-slate-800' : 'border-slate-100/80'}`}>
                                <div className="flex items-center gap-2">
                                    {pendingDocs.length > 0 && !isOrganizingDocs && (
                                        <button
                                            onClick={() => { haptic('medium'); handleOrganizeAll(); }}
                                            className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 text-white relative overflow-hidden"
                                            style={folderSource === 'rapida'
                                                ? { background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)', borderColor: 'transparent', boxShadow: '0 2px 8px rgba(249,115,22,0.4)' }
                                                : { background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)', borderColor: 'transparent', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }
                                            }>
                                            {folderSource === 'rapida' && <span className="absolute inset-0 pasta-rapida-btn pointer-events-none" style={{borderRadius:'0.75rem'}}></span>}
                                            <Sparkles size={11} className="relative z-10" style={folderSource === 'rapida' ? {filter:'drop-shadow(0 0 4px rgba(255,255,255,0.8))'} : {}} />
                                            <span className="relative z-10">Organizar IA</span>
                                        </button>
                                    )}
                                    <button onClick={() => { haptic(); backToChat(); }}
                                        className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 ${
                                            folderSource === 'rapida'
                                                ? (modoNoturno ? 'bg-slate-800 border-slate-700 text-orange-300 hover:bg-slate-700' : 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100')
                                                : (modoNoturno ? 'bg-slate-800 border-slate-700 text-indigo-300 hover:bg-slate-700' : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100')
                                        }`}>
                                        ← Chat
                                    </button>
                                </div>
                            </div>
                            <div className={`px-4 py-1.5 text-[9px] flex flex-wrap gap-x-2 gap-y-0.5 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>
                                <span className="font-black uppercase tracking-widest">📋 Ordem:</span>
                                <span><b>1º</b> RG · CPF · Certidão · Residência</span>
                                <span><b>2º</b> CTPS · Contracheque · Extrato · FGTS</span>
                                <span className="opacity-60">💡 Arraste para reordenar</span>
                            </div>
                        </div>

                        <div ref={cardGridRef} className="flex-1 overflow-y-auto custom-scrollbar p-3 relative">
                            {isOrganizingDocs && (
                                <div className="flex flex-col items-center justify-center gap-3 py-6">
                                    <div className="relative w-14 h-14">
                                        <div className="w-14 h-14 rounded-full border-4 animate-spin"
                                            style={{ borderColor: folderSource === 'rapida' ? 'rgba(249,115,22,0.15)' : 'rgba(99,102,241,0.15)', borderTopColor: folderSource === 'rapida' ? '#f97316' : '#6366f1' }}></div>
                                        <Sparkles size={20} className="absolute inset-0 m-auto"
                                            style={{ color: folderSource === 'rapida' ? '#f97316' : '#6366f1' }} />
                                    </div>
                                    <p className="font-black text-sm uppercase tracking-wider"
                                        style={{ color: folderSource === 'rapida' ? '#f97316' : '#6366f1' }}>IA analisando...</p>
                                    {organizeProgress.total > 0 && (
                                        <div className="w-56 flex flex-col items-center gap-2">
                                            <div className={`w-full h-2 rounded-full overflow-hidden ${modoNoturno ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                                <div className="h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${(organizeProgress.current / organizeProgress.total) * 100}%`, background: folderSource === 'rapida' ? '#f97316' : '#6366f1' }} />
                                            </div>
                                            <p className={`text-[10px] font-bold text-center ${modoNoturno ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {organizeProgress.current}/{organizeProgress.total} — {organizeProgress.label}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1.5" id="docs-grid">
                                {pendingDocs.map((doc, index) => {
                                    const total = pendingDocs.length;
                                    const scatterDelay = cardAnimPhase === 'scatter' ? index * 0.07 : 0;
                                    const pulseDelay = (index * 0.12) % 1.2; // stagger pulse so they don't all blink at once

                                    let cardStyle = {};
                                    let extraClass = '';
                                    if (cardAnimPhase === 'pulse' || isOrganizingDocs) {
                                        cardStyle = { animationDelay: `${pulseDelay}s` };
                                        extraClass = 'card-analyzing';
                                    } else if (cardAnimPhase === 'scatter') {
                                        cardStyle = { animationDelay: `${scatterDelay}s` };
                                        extraClass = 'card-scatter';
                                    }

                                    return (
                                    <div
                                        key={doc.id}
                                        data-doc-index={index}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onTouchStart={(e) => handleTouchStart(e, index)}
                                        onTouchMove={handleDragTouchMove}
                                        onTouchEnd={handleDragTouchEnd}
                                        onClick={() => { if (!isDraggingActive) { haptic('light'); setFullscreenDoc(doc); } }}
                                        style={cardStyle}
                                        className={`relative group border-2 border-dashed ${extraClass} ${draggedItemIndex === index ? 'border-orange-400 scale-90 opacity-30 rotate-3' : (modoNoturno ? `border-transparent bg-slate-800 ${folderSource === 'rapida' ? 'hover:border-orange-500' : 'hover:border-indigo-500'}` : `border-transparent bg-white ${folderSource === 'rapida' ? 'hover:border-orange-300' : 'hover:border-indigo-300'}`)} rounded-xl overflow-hidden shadow-sm aspect-[3/4] flex flex-col cursor-move`}>
                                        <div className="absolute top-1 left-1 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-md z-10 backdrop-blur-sm"
                                            style={{ background: folderSource === 'rapida' ? 'rgba(124,58,27,0.85)' : 'rgba(67,56,202,0.85)' }}>{index + 1}</div>
                                        <button onClick={(e) => { e.stopPropagation(); haptic('heavy'); removeDoc(doc.id); }} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 active:opacity-100 transition-all z-10 hover:bg-red-600 shadow-lg"><Trash2 size={11} /></button>
                                        {/* Botões de rotação — sempre visíveis na parte inferior do card */}
                                        <div className="absolute bottom-7 left-0 right-0 flex justify-center gap-2 z-10">
                                            <button onClick={(e) => { e.stopPropagation(); haptic('light'); rotateDoc(doc.id, 'ccw'); }}
                                                className="bg-black/70 backdrop-blur-sm text-white rounded-lg hover:bg-black/90 active:scale-90 transition-all shadow-lg"
                                                style={{ padding: '5px 10px' }}
                                                title="Girar esquerda">
                                                <RotateCcw size={15} />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); haptic('light'); rotateDoc(doc.id, 'cw'); }}
                                                className="bg-black/70 backdrop-blur-sm text-white rounded-lg hover:bg-black/90 active:scale-90 transition-all shadow-lg"
                                                style={{ padding: '5px 10px' }}
                                                title="Girar direita">
                                                <RotateCw size={15} />
                                            </button>
                                        </div>
                                        <div className={`flex-1 flex items-center justify-center overflow-hidden relative ${modoNoturno ? 'bg-slate-950' : 'bg-slate-100'}`} style={{ isolation: 'isolate' }}>
                                            {doc.previewUrl ? (
                                                <>
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', willChange: 'transform' }}>
                                                        <img src={doc.previewUrl} alt="preview" className="w-full h-full object-cover" style={{ transform: `rotate(${doc.rotation || 0}deg)`, transformOrigin: 'center center' }} />
                                                    </div>
                                                    {doc.file.type === 'application/pdf' && (
                                                        <div className="absolute bottom-1 right-1 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-md">PDF</div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1 text-slate-400">
                                                    <FileIcon size={28} className="text-red-400" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">PDF</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className={`p-1.5 border-t text-[8px] font-bold truncate text-center uppercase tracking-tight ${modoNoturno ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50'} ${doc.aiLabel && doc.aiLabel !== 'Outro Documento' && doc.aiLabel !== '⏳' && doc.aiLabel !== '🔍' ? (folderSource === 'rapida' ? 'text-orange-500' : 'text-indigo-500') : (modoNoturno ? 'text-slate-400' : 'text-slate-500')}`}>
                                            {doc.aiLabel || doc.name}
                                        </div>
                                    </div>
                                    );
                                })}
                                <button onClick={() => { haptic(); fileInputRef.current?.click(); }}
                                    className={`aspect-[3/4] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm ${
                                        folderSource === 'rapida'
                                            ? (modoNoturno ? 'bg-slate-800 border-slate-700 text-slate-500 hover:border-orange-500 hover:bg-slate-700 hover:text-orange-400' : 'bg-white border-orange-200 text-orange-400 hover:border-orange-500 hover:bg-orange-50/50')
                                            : (modoNoturno ? 'bg-slate-800 border-slate-700 text-slate-500 hover:border-indigo-500 hover:bg-slate-700 hover:text-indigo-400' : 'bg-white border-indigo-200 text-indigo-400 hover:border-indigo-500 hover:bg-indigo-50/50')
                                    }`}>
                                    <Plus size={20} className="mb-1" />
                                    <span className="text-[9px] font-black text-center leading-tight uppercase tracking-widest">Adicionar<br/>Arquivo</span>
                                </button>
                            </div>
                        </div>

                        {pendingDocs.length > 0 && (
                            <div className={`shrink-0 border-t flex justify-end transition-colors ${modoNoturno ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-100'}`}
                                style={{ padding: '10px 12px', paddingBottom: 'max(10px, calc(env(safe-area-inset-bottom) + 6px))' }}>
                                <button onClick={() => { haptic('medium'); setIsFinalizingFolder(true); }}
                                    className="text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 relative overflow-hidden active:scale-95"
                                    style={folderSource === 'rapida'
                                        ? { background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #f59e0b 100%)', boxShadow: '0 4px 20px rgba(249,115,22,0.4)' }
                                        : { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 40%, #7c3aed 100%)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }
                                    }>
                                    {folderSource === 'rapida' && <span className="absolute inset-0 pasta-rapida-btn pointer-events-none" style={{borderRadius:'1rem'}}></span>}
                                    {folderSource !== 'rapida' && <span className="absolute inset-0 btn-shine-anim pointer-events-none" style={{borderRadius:'1rem'}}></span>}
                                    <Wand2 size={16} className="relative z-10" />
                                    <span className="relative z-10">Finalizar PDF</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className={`border-t rounded-b-3xl shrink-0 flex flex-col transition-colors ${isCreatingFolder ? 'hidden' : ''} ${modoNoturno ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-100'}`}>
                    <input type="file" ref={quickFolderInputRef} onChange={handleQuickFolderUpload} multiple accept="image/*,application/pdf" className="hidden" />
                    <div className="px-3 pb-3" style={{ paddingBottom: 'max(12px, calc(env(safe-area-inset-bottom) + 8px))' }}>
                        {/* ── PÍLULAS ACIMA DO INPUT — só desktop (sm+) ── */}
                        <div className="flex gap-1.5 items-center overflow-x-auto pb-2 pt-2" style={{scrollbarWidth:'none', msOverflowStyle:'none'}}>
                            {/* Pasta */}
                            <button onClick={() => { haptic(); setFolderSource('manual'); setIsCreatingFolder(true); fileInputRef.current?.click(); }}
                                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 text-white relative overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 2px 8px rgba(99,102,241,0.35)' }}>
                                <FolderPlus size={11} className="relative z-10" />
                                <span className="relative z-10">Pasta</span>
                            </button>
                            {/* Separador */}
                            <div className={`shrink-0 w-px h-3.5 ${modoNoturno ? 'bg-slate-600' : 'bg-slate-200'}`}/>
                            {/* Taxas Docs */}
                            <button
                                onClick={() => { haptic('medium'); setShowTaxasDocsModal(true); }}
                                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 text-white relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 60%, #0369a1 100%)',
                                    boxShadow: '0 0 0 2px rgba(14,165,233,0.3), 0 0 14px 3px rgba(14,165,233,0.35)',
                                }}>
                                <FileText size={11} className="shrink-0 relative z-10" />
                                <span className="relative z-10" style={{letterSpacing:'0.06em'}}>Taxas Docs</span>
                            </button>
                            {/* Nome do cliente */}
                            {clientName && (
                                <span className={`shrink-0 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-full border ${modoNoturno ? 'bg-slate-700 border-slate-600 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                    👤 {clientName}
                                </span>
                            )}
                            {/* DEV reset */}
                            <button onClick={() => { pastaRapidaClicksRef.current = 0; localStorage.setItem('dst_pr_clicks', '0'); }}
                                title="DEV: reset PR" className="shrink-0 text-[9px] font-bold px-2 py-1 rounded-full border border-dashed border-slate-300 text-slate-300 hover:border-orange-400 hover:text-orange-400 transition-all">
                                ↺ PR
                            </button>
                        </div>
                        <div className="relative flex items-center">
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple accept="image/*,application/pdf" className="hidden" />
                            <input 
                                ref={chatInputRef}
                                type="text" 
                                value={chatInput} 
                                onChange={(e) => setChatInput(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()} 
                                placeholder="Posso te ajudar com algo?" 
                                className={`w-full rounded-2xl px-5 py-3 pr-14 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all ${modoNoturno ? 'bg-slate-800/80 text-white border border-slate-700/60 placeholder-slate-500' : 'bg-slate-100/80 text-slate-800 placeholder-slate-400 border border-slate-200/60'}`} 
                                disabled={isChatLoading} 
                            />
                            <button onClick={() => { haptic('medium'); handleSendChatMessage(); }} disabled={!chatInput.trim() || isChatLoading}
                                className="absolute right-2 text-white p-2.5 rounded-xl transition-all flex items-center justify-center shadow-md active:scale-95 disabled:opacity-30"
                                style={{ background: !chatInput.trim() || isChatLoading ? undefined : 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)', backgroundColor: !chatInput.trim() || isChatLoading ? (modoNoturno ? '#334155' : '#e2e8f0') : undefined }}>
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* MODAL PARA FINALIZAR */}
            {isFinalizingFolder && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
                    style={{ background: 'rgba(7,11,22,0.65)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}
                    onClick={() => { setIsFinalizingFolder(false); setCompressionInfo(null); }}>
                    <div
                        className="animate-slide-up w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                        style={modoNoturno ? {
                            background: 'rgba(15,23,42,0.95)',
                            backdropFilter: 'blur(28px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                            border: '1px solid rgba(249,115,22,0.2)',
                            boxShadow: '0 -8px 48px rgba(249,115,22,0.15), 0 24px 64px rgba(0,0,0,0.5)',
                        } : {
                            background: 'rgba(255,255,255,0.97)',
                            backdropFilter: 'blur(28px) saturate(200%)',
                            WebkitBackdropFilter: 'blur(28px) saturate(200%)',
                            border: '1px solid rgba(255,255,255,0.95)',
                            boxShadow: '0 -8px 48px rgba(249,115,22,0.12), 0 24px 64px rgba(0,0,0,0.1)',
                        }}
                        onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="relative overflow-hidden px-5 pt-5 pb-4"
                            style={folderSource === 'rapida'
                                ? { background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #f59e0b 100%)', boxShadow: '0 4px 24px rgba(249,115,22,0.4)' }
                                : { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 40%, #7c3aed 100%)', boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }
                            }>
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <div style={{ position:'absolute', top:'-20%', left:0, width:'60%', height:'140%', background:'linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.22) 50%, transparent 90%)', animation: folderSource === 'rapida' ? 'light-sweep 1.6s ease-in-out infinite' : 'none', transform:'skewX(-18deg)' }}></div>
                            </div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/15 p-2.5 rounded-2xl border border-white/25 backdrop-blur-md">
                                        <FileIcon size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black text-xl uppercase tracking-widest drop-shadow-md">Salvar Pasta</h3>
                                        <p className="text-orange-200 text-[10px] font-black uppercase tracking-[0.15em]">Dê um nome ao seu PDF</p>
                                    </div>
                                </div>
                                <button onClick={() => { setIsFinalizingFolder(false); setCompressionInfo(null); }} className="bg-white/10 hover:bg-white/25 text-white p-2.5 rounded-2xl border border-white/20 transition-all backdrop-blur-sm">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Drag pill (mobile) */}
                        <div className="sm:hidden flex justify-center pt-2">
                            <div className={`w-10 h-1 rounded-full ${modoNoturno ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                        </div>

                        {/* Body */}
                        <div className="px-5 pt-4 pb-2">
                            <label className={`text-[9px] font-black uppercase tracking-[0.18em] mb-2 block ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>Nome do Arquivo</label>
                            <div className={`rounded-2xl overflow-hidden border ${modoNoturno ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <input 
                                    type="text" 
                                    value={pdfFileName} 
                                    onChange={(e) => setPdfFileName(e.target.value)} 
                                    className={`w-full text-base px-5 py-4 font-bold bg-transparent border-none outline-none transition-all ${modoNoturno ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'}`}
                                    placeholder="Ex: Pasta_Joao_Silva" 
                                    autoFocus 
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 pb-6 pt-3" style={{ paddingBottom: 'max(24px, calc(env(safe-area-inset-bottom) + 16px))' }}>
                            {/* Card de resultado de compressão */}
                            {compressionInfo && (
                                <div className={`mb-3 rounded-2xl p-4 border flex items-center gap-3 ${modoNoturno ? 'bg-slate-800/60 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                                    <div className="text-2xl">🗜️</div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${modoNoturno ? 'text-indigo-400' : 'text-indigo-600'}`}>Resultado da Compressão</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-sm font-black ${modoNoturno ? 'text-slate-300' : 'text-slate-700'}`}>{compressionInfo.before} MB</span>
                                            <span className={`text-xs ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>→</span>
                                            <span className={`text-sm font-black ${modoNoturno ? 'text-green-400' : 'text-green-600'}`}>{compressionInfo.after} MB</span>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${modoNoturno ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                                                -{compressionInfo.saved}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <button onClick={() => { haptic('success'); generateClientPDF(); }} disabled={isChatLoading || isCompressing}
                                className="w-full text-xs text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest transition-all disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden active:scale-[0.98]"
                                style={folderSource === 'rapida'
                                    ? { background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #f59e0b 100%)', boxShadow: '0 4px 24px rgba(249,115,22,0.45)' }
                                    : { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 40%, #7c3aed 100%)', boxShadow: '0 4px 24px rgba(99,102,241,0.45)' }
                                }>
                                {folderSource === 'rapida'
                                    ? <span className="absolute inset-0 pasta-rapida-btn pointer-events-none" style={{borderRadius:'1rem'}}></span>
                                    : <span className="absolute inset-0 btn-shine-anim pointer-events-none" style={{borderRadius:'1rem'}}></span>
                                }
                                {isChatLoading ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-80"></div>
                                        <div className="absolute inset-0 pdf-loading-bar"></div>
                                        <span className="relative z-10 font-black text-xs uppercase tracking-widest text-white/90 flex items-center gap-2">
                                            <span className="flex gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{animationDelay:'0s'}}></span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{animationDelay:'0.15s'}}></span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{animationDelay:'0.3s'}}></span>
                                            </span>
                                            Gerando PDF...
                                        </span>
                                    </div>
                                ) : (
                                    <><Wand2 size={20} className="relative z-10" style={{filter:'drop-shadow(0 0 6px rgba(255,255,255,0.8))'}} /><span className="relative z-10" style={{textShadow:'0 1px 6px rgba(0,0,0,0.3)'}}>Baixar PDF Unificado</span></>
                                )}
                            </button>

                            {/* Botão Comprimir PDF — apenas na pasta normal */}
                            {folderSource !== 'rapida' && (
                                <button
                                    onClick={() => { haptic('medium'); compressClientPDF(); }}
                                    disabled={isChatLoading || isCompressing}
                                    className={`mt-3 w-full text-xs px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden active:scale-[0.98] border-2 ${modoNoturno ? 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20' : 'border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100'}`}>
                                    {isCompressing ? (
                                        <>
                                            <span className="flex gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{animationDelay:'0s'}}></span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{animationDelay:'0.15s'}}></span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{animationDelay:'0.3s'}}></span>
                                            </span>
                                            <span>Comprimindo...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-base leading-none">🗜️</span>
                                            <span>Baixar PDF Comprimido</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ANIMAÇÃO ⚡ RELÂMPAGO PÓS-DOWNLOAD */}
            {showLightning && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none">
                    {/* Flash de fundo laranja */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 via-orange-500/30 to-red-500/20 animate-flash"></div>
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
                        style={{background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(249,115,22,0.2) 50%, transparent 70%)'}}
                    />
                    {/* Relâmpago principal */}
                    <div className="animate-lightning select-none" style={{fontSize: '140px', filter: 'drop-shadow(0 0 20px #fbbf24) drop-shadow(0 0 40px #f97316) drop-shadow(0 0 80px #ef4444)'}}>
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
                    <div className="w-16 h-20 rounded-xl overflow-hidden shadow-2xl border-2 border-orange-400 bg-white"
                        style={{ boxShadow: '0 12px 40px rgba(249,115,22,0.45), 0 2px 8px rgba(0,0,0,0.25)' }}
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
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-3 rounded-full bg-orange-500/30 blur-md animate-pulse"></div>
                </div>
            )}

            {/* MODAL FULLSCREEN DE VISUALIZAÇÃO DE DOCUMENTO */}
            {fullscreenDoc && (
                <div
                    className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md"
                    onClick={() => setFullscreenDoc(null)}
                >
                    <div
                        className="relative w-full h-full flex flex-col items-center justify-center p-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 bg-gradient-to-b from-black/80 to-transparent z-10">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-600 p-2 rounded-xl">
                                    <FileIcon size={16} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-sm uppercase tracking-wide truncate max-w-[200px] sm:max-w-xs">{fullscreenDoc.name}</p>
                                    <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">
                                        {fullscreenDoc.file.type === 'application/pdf' ? 'PDF' : 'Imagem'}
                                        {' · '}{(fullscreenDoc.file.size / 1024).toFixed(0)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setFullscreenDoc(null)}
                                className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-2xl transition-all border border-white/10 backdrop-blur-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="w-full h-full flex items-center justify-center pt-16 pb-4">
                            {fullscreenDoc.previewUrl ? (
                                <img
                                    src={fullscreenDoc.previewUrl}
                                    alt={fullscreenDoc.name}
                                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                                    style={{ maxHeight: 'calc(100vh - 100px)', transform: `rotate(${fullscreenDoc.rotation || 0}deg)` }}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-6 text-white/60">
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

                        <p className="absolute bottom-5 left-0 right-0 text-center text-white/30 text-xs font-bold uppercase tracking-widest pointer-events-none">Toque fora para fechar</p>
                    </div>
                </div>
            )}

            {/* MODAL PASTA RÁPIDA — ATENÇÃO, LEIA! (5 primeiros cliques) */}
            {showPastaRapidaInfo && (
                <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
                    style={{ background: 'rgba(7,11,22,0.65)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)' }}>
                    <div className={`animate-slide-up w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl`}
                        style={modoNoturno ? {
                            background: 'rgba(15,23,42,0.95)',
                            backdropFilter: 'blur(28px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                            border: '1px solid rgba(99,102,241,0.2)',
                            boxShadow: '0 -8px 48px rgba(99,102,241,0.2), 0 24px 64px rgba(0,0,0,0.5)',
                        } : {
                            background: 'rgba(255,255,255,0.96)',
                            backdropFilter: 'blur(28px) saturate(200%)',
                            WebkitBackdropFilter: 'blur(28px) saturate(200%)',
                            border: '1px solid rgba(255,255,255,0.95)',
                            boxShadow: '0 -8px 48px rgba(99,102,241,0.15), 0 24px 64px rgba(0,0,0,0.1)',
                        }}
                        onClick={e => e.stopPropagation()}>

                        {/* Header com shimmer */}
                        <div className="relative overflow-hidden px-5 pt-5 pb-4"
                            style={{ background: 'linear-gradient(135deg, #f97316 0%, #ef4444 45%, #f59e0b 100%)', boxShadow: '0 4px 24px rgba(249,115,22,0.4)' }}>
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <div style={{ position:'absolute', top:'-20%', left:0, width:'60%', height:'140%', background:'linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.22) 50%, transparent 90%)', animation:'light-sweep 1.6s ease-in-out infinite', transform:'skewX(-18deg)' }}></div>
                            </div>
                            <div className="relative z-10 flex items-center gap-3">
                                <div className="bg-white/15 p-2.5 rounded-2xl border border-white/25 backdrop-blur-md">
                                    <Sparkles size={20} className="text-white" style={{filter:'drop-shadow(0 0 8px rgba(255,255,255,0.8))', animation:'spin 3s linear infinite'}} />
                                </div>
                                <div>
                                    <h2 className="text-white font-black text-xl uppercase tracking-widest drop-shadow-md">Pasta Rápida IA</h2>
                                    <p className="text-orange-200 text-[10px] font-black uppercase tracking-[0.15em]">Leia antes de continuar</p>
                                </div>
                            </div>
                        </div>

                        {/* Drag pill (mobile) */}
                        <div className="sm:hidden flex justify-center pt-2">
                            <div className={`w-10 h-1 rounded-full ${modoNoturno ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                        </div>

                        {/* Conteúdo */}
                        <div className="px-5 pt-4 pb-2">
                            <div className={`rounded-2xl p-4 border ${modoNoturno ? 'bg-slate-800/60 border-orange-500/20' : 'bg-orange-50 border-orange-100'}`}>
                                <p className={`font-black text-sm mb-2 uppercase tracking-widest ${modoNoturno ? 'text-orange-400' : 'text-orange-600'}`}>O que é a Pasta Rápida?</p>
                                <p className={`text-sm leading-relaxed ${modoNoturno ? 'text-slate-300' : 'text-slate-700'}`}>
                                    Envie os documentos em <strong>qualquer formato</strong> e a IA <strong>identifica e organiza</strong> tudo automaticamente na ordem certa.
                                </p>
                                <p className={`text-sm leading-relaxed mt-2 ${modoNoturno ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Precisa mover algo? Só <strong>arrastar</strong> antes de gerar o PDF.
                                </p>
                            </div>
                        </div>

                        {/* Barra de progresso + botão */}
                        <div className="px-5 pb-6 pt-3 flex flex-col gap-3" style={{ paddingBottom: 'max(24px, calc(env(safe-area-inset-bottom) + 16px))' }}>
                            {pastaRapidaCountdown > 0 && (
                                <div className="flex flex-col gap-1.5">
                                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${modoNoturno ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                        <div className="h-full rounded-full transition-all duration-1000 ease-linear"
                                            style={{ width: `${((10 - pastaRapidaCountdown) / 10) * 100}%`, background: 'linear-gradient(90deg, #f97316, #ef4444)' }} />
                                    </div>
                                    <p className={`text-center text-[10px] font-black uppercase tracking-widest ${modoNoturno ? 'text-slate-600' : 'text-slate-400'}`}>
                                        leia antes de continuar — {pastaRapidaCountdown}s
                                    </p>
                                </div>
                            )}
                            <button
                                disabled={pastaRapidaCountdown > 0}
                                onClick={() => { setShowPastaRapidaInfo(false); setFolderSource('rapida'); setTimeout(() => quickFolderInputRef.current?.click(), 150); }}
                                className={`w-full font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition-all flex items-center justify-center gap-2 relative overflow-hidden active:scale-[0.98] ${pastaRapidaCountdown > 0 ? (modoNoturno ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-300 cursor-not-allowed') : 'text-white'}`}
                                style={pastaRapidaCountdown > 0 ? {} : { background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #f59e0b 100%)', boxShadow: '0 4px 20px rgba(249,115,22,0.45)' }}>
                                {pastaRapidaCountdown > 0 ? (
                                    <span>Aguarde...</span>
                                ) : (
                                    <>
                                        <span className="absolute inset-0 pasta-rapida-btn pointer-events-none" style={{borderRadius:'1rem'}}></span>
                                        <Sparkles size={15} className="relative z-10" style={{filter:'drop-shadow(0 0 6px rgba(255,255,255,0.9))', animation:'spin 3s linear infinite'}} />
                                        <span className="relative z-10" style={{textShadow:'0 1px 6px rgba(0,0,0,0.3)'}}>Entendi, vamos lá!</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}




            {showTaxasDocsModal && (
                <div className="fixed inset-0 z-[70] flex flex-col"
                    style={{ background: modoNoturno ? 'rgba(7,11,22,0.82)' : 'rgba(15,23,42,0.55)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
                    <div className="modal-slide-open flex flex-col w-full"
                        style={{ height: '100%', background: modoNoturno ? '#0B1120' : '#f8fafc' }}>
                        <div className="shrink-0 relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 40%, #0369a1 100%)',
                                boxShadow: '0 4px 32px rgba(14,165,233,0.45)',
                                paddingTop: 'env(safe-area-inset-top, 0px)',
                            }}>
                            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.12) 0%, transparent 60%)' }}/>
                            <div className="relative z-10 flex items-center gap-3 px-5 pt-4 pb-4">
                                <button onClick={() => setShowTaxasDocsModal(false)}
                                    className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-90 shrink-0"
                                    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                                    <ChevronLeft size={20} color="white" />
                                </button>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-white font-black text-xl uppercase tracking-widest drop-shadow-md truncate">📄 Taxas Docs</h2>
                                    <p className="text-sky-100 text-xs font-medium mt-0.5">Previsão de despesas de transmissão</p>
                                </div>
                                <a
                                    href="https://drive.google.com/drive/u/1/folders/14mYfQkNaSc9APr6hpOTKKTFQ02oq3uOf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all active:scale-90"
                                    style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
                                    <FileText size={18} color="white" />
                                    <span className="text-white text-xs font-black uppercase tracking-wide">Abrir Tabelas</span>
                                </a>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden relative">
                            <iframe
                                src={taxasIframeSrc}
                                className="w-full h-full border-0"
                                title="Taxas de Transmissão de Imóvel"
                                allow="autoplay"
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
        </>
    );
}
