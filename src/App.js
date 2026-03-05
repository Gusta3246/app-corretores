import React, { useState, useEffect, useRef } from 'react';
import { Search, Building, ExternalLink, MapPin, BookOpen, Maximize, Bed, LayoutGrid, Rocket, Quote, Sparkles, ChevronDown, ChevronUp, FileText, TableProperties, BookMarked, HelpCircle, Calculator, Bot, X, Send, Wand2, Paperclip, File as FileIcon, Trash2, FolderPlus, GripVertical, Plus, MessageCircle } from 'lucide-react';

// === DADOS DAS REVISTAS E BASE DE CONHECIMENTO DO CHATBOT ===
    const revistasData = [
    { id: 1, title: "Brisas do Horizonte", brand: "Direcional", region: "Coroado - Zona Leste", size: "43m² a 45m²", bedrooms: "2 quartos", flooring: "Todo o apê", cover: "https://www.direcional.com.br/wp-content/uploads/2025/06/Perspectiva-Guarita-BrisasdoHorizonte.jpg.webp", link: "https://drive.google.com/file/d/18IXtAt9PLVjIsk2PkXIHXnVCaduVkGu2/view?usp=drive_link", aliases: ["brisas", "brisas do horizonte", "horizonte"], pois: ["UFAM (Universidade Federal do Amazonas)", "INPA (Instituto Nacional de Pesquisas da Amazônia)", "Hospital Adventista de Manaus", "Sesi Clube", "Centro de Convenções Studio 5", "Distrito Industrial"] },
    { id: 2, title: "Parque Ville Orquídea", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "41m²", bedrooms: "2 quartos", flooring: "Todo o apê", cover: "https://www.direcional.com.br/wp-content/uploads/2024/05/Perspectiva_PARQUEVILLEORQUIDEA_GUARITA.jpg.webp", link: "https://drive.google.com/file/d/1F_BeT2jceDM8u4kCbSXN8kp2rk7boQTG/view?usp=drive_link", aliases: ["orquidea", "orquídea", "parque ville", "parque ville orquidea"], pois: ["Hospital Delphina Aziz", "Barreira da AM-010", "Supermercado DB Nova Cidade", "Sumaúma Park Shopping (principal da região)", "Supermercado Atack"] },
    { id: 3, title: "Village Torres", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2024/09/Perspectiva-Guarita-VillageTorres.jpg.webp", link: "https://drive.google.com/file/d/1blVconA5fjODxvXB7s8KT6dSlX8KpLLv/view?usp=drive_link", aliases: ["village", "village torres", "torres"], pois: ["Supermercado Nova Era", "Shopping Via Norte", "Sumaúma Park Shopping", "Atacadão"] },
    { id: 4, title: "Conquista Jardim Botânico", brand: "Direcional", region: "Nova Cidade - Zona Norte", size: "40m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2024/03/Conquista-Jardim-Botanico-Guarita.jpg.webp", link: "https://drive.google.com/file/d/1TYzIq8RuGORXfxQpH8CGZejTjF_GlUz0/view?usp=drive_link", aliases: ["botanico", "botânico", "jardim botanico", "conquista jardim"], pois: ["MUSA (Museu da Amazônia / Jardim Botânico)", "Shopping Via Norte", "Supermercado DB Nova Cidade", "SPA Galiléia"] },
    { id: 5, title: "Viva Vida Coral", brand: "Direcional", region: "Colônia Terra Nova - Zona Norte", size: "41m² a 51m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2025/05/Perspectiva-Guarita-VivaVidaCoral.jpg.webp", link: "https://drive.google.com/file/d/1lYo3otquzwdnD0r5f6JobBbW-6KmGOF4/view?usp=drive_link", aliases: ["coral", "viva vida coral", "viva vida"], pois: ["Shopping Via Norte", "Loja Havan", "Atacadão", "Hospital Delphina Aziz", "Posto Atem (famoso na entrada do bairro)"] },
    { id: 6, title: "Conquista Jardim Norte", brand: "Direcional", region: "Santa Etelvina - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2024/12/Perspectiva-Guarita-ConquistaJardimNorte.jpg.webp", link: "https://drive.google.com/file/d/1_Hyb72NWl1HjEiabKLL9m5ZMutHExesY/view?usp=drive_link", aliases: ["jardim norte", "santa etelvina", "conquista norte"], pois: ["Hospital Delphina Aziz", "Atacadão (Torquato Tapajós)", "Shopping Via Norte", "Centro de Treinamento do Manaus FC"] },
    { id: 7, title: "Viva Vida Rio Amazonas", brand: "Direcional", region: "Tarumã - Zona Oeste", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2023/07/Guarita-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp", link: "https://drive.google.com/", aliases: ["amazonas", "rio amazonas", "viva vida rio amazonas"], pois: ["Aeroporto Internacional Eduardo Gomes", "Orla da Ponta Negra", "Sivam (Sistema de Vigilância da Amazônia)", "Sipam", "Supermercado Veneza"] },
    { id: 8, title: "Bosque das Torres", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2025/10/portaria-bosque-das-torres.jpg.webp", link: "https://drive.google.com/file/d/1lPnNQuxlPkKOcW2JqOB7KEWsaQVpZzcU/view?usp=drive_link", aliases: ["bosque", "bosque das torres"], pois: ["Supermercado Nova Era (Torres)", "Sumaúma Park Shopping", "Parque do Mindu", "Faculdade Estácio (polo próximo)"] },
    { id: 9, title: "Parque Ville Lírio Azul", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "41m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2025/11/fachada-noturna-parque-ville-lirio-azul.jpg.webp", link: "https://drive.google.com/file/d/1fc7AXap6nhkpTlxONsm46WJCKxIWIhwe/view?usp=drive_link", aliases: ["lirio", "lírio", "lirio azul", "parque ville lirio"], pois: ["Hospital Delphina Aziz", "Barreira de Fiscalização Rodoviária", "Supermercado DB Nova Cidade", "Posto Equador (referência local)"] },
    { id: 10, title: "Amazon Boulevard Classic", brand: "Riva", region: "Bairro da Paz - Zona Centro-Oeste", size: "44m² a 69,78m²", bedrooms: "2 quartos", flooring: "Todo o apê", cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2023/11/fachada-noturna_amazon-boulevard-classic.jpg.webp", link: "https://drive.google.com/file/d/1ZX37T2S8FlHnSiO-yeAjlFyqq_5-dVzx/view?usp=drive_link", aliases: ["classic", "amazon boulevard", "boulevard", "boulevard classic"], pois: ["Arena da Amazônia", "Amazonas Shopping", "Carrefour Hipermercado", "UNIP (Universidade Paulista)", "Terminal Rodoviário de Manaus", "Hospital Tropical (Fundação de Medicina Tropical)"] },
    { id: 11, title: "Amazon Boulevard Prime", brand: "Riva", region: "Bairro da Paz - Zona Centro-Oeste", size: "51m² a 90,39m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2025/06/guarita-Amazon-prime-boulevard-riva.jpg.webp", link: "https://drive.google.com/file/d/1aIuBlwLYGStUm7DNE3gCbfu3Ty2JmkGM/view?usp=drive_link", aliases: ["prime", "amazon prime", "boulevard prime"], pois: ["Clube Municipal (ao lado)", "Arena da Amazônia", "Vila Olímpica", "Hospital de Sangue (Hemoam)", "acesso rápido ao Shopping Millennium"] },
    { id: 12, title: "Città Oasis Azzure", brand: "Riva", region: "Flores - Zona Centro-Sul", size: "48m² a 75m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2025/08/citta-azzure_GUARITA.jpg.webp", link: "https://drive.google.com/file/d/1Y-fT6UbQ-OopqVaV0POgHRIdlayMXMOB/view?usp=sharing", aliases: ["citta", "città", "azzure", "oasis", "oasis azzure"], pois: ["Universidade Nilton Lins", "Sollarium Mall", "Supermercado Atack (Laranjeiras)", "Praça de Alimentação do Parque das Laranjeiras", "Singular Educacional"] },
    { id: 13, title: "Zenith Condomínio Clube", brand: "Riva", region: "São Francisco - Zona Sul", size: "48m² a 49m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2024/08/Perspectiva-Guarita-ZenithCondominioClube.webp", link: "https://drive.google.com/file/d/1wv_v56T2ACEHtPZF-iRBvEWY2VVdUXxu/view?usp=drive_link", aliases: ["zenith", "zenith condominio"], pois: ["Manauara Shopping", "Fórum Ministro Henoch Reis", "Tribunal de Justiça (TJ-AM)", "Hospital Check Up", "Colégio Martha Falcão", "Faculdade Martha Falcão", "Faculdade Estácio"] },
    { id: 14, title: "Conquista Topázio", brand: "Direcional", region: "Colônia Terra Nova - Zona Norte", size: "41m² a 51m²", bedrooms: "1 e 2 quartos", flooring: "Todo o apê", cover: "https://www.direcional.com.br/wp-content/uploads/2023/04/Guarita-Conquista-Topazio-Direcional.jpg.webp", link: "https://drive.google.com/file/d/1SMIfr9HbfLd06UaDLKbMUxxtuh4cPPEM/view?usp=drive_link", aliases: ["topazio", "topázio", "conquista topazio"], pois: ["Shopping Via Norte", "Atacadão", "Loja Havan", "SPA da Colônia Terra Nova"] },
    { id: 16, title: "Conquista Rio Negro", brand: "Direcional", region: "Ponta Negra - Zona Oeste", size: "41m²", bedrooms: "2 quartos", flooring: "Todo o apê", cover: "https://www.direcional.com.br/wp-content/uploads/2022/11/Guarita-Conquista-Rio-Negro-Direcional.jpg.webp", link: "https://drive.google.com/file/d/1pHLQwUSn6BDMfLo7fFGonyyWlgtXwNmy/view?usp=drive_link", aliases: ["negro", "rio negro", "conquista rio negro"], pois: ["Ponte Rio Negro", "Orla da Ponta Negra", "Shopping Ponta Negra", "Sede do Governo do Amazonas", "Comando Militar da Amazônia (CMA)"] },
    { id: 17, title: "Viva Vida Rio Tapajós", brand: "Direcional", region: "Tarumã - Zona Oeste", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2025/02/Perspectiva-Guarita-VivaVidaRioTapajos.jpg.webp", link: "https://drive.google.com/file/d/1k3TOypf5bm_zXPfc-ulb7vY9e7MKxmlk/view?usp=drive_link", aliases: ["tapajos", "tapajós", "rio tapajos", "viva vida rio tapajos"], pois: ["Aeroporto Internacional de Manaus", "Tarumã (área de balneários famosos)", "Sivam", "proximidade com a entrada da Ponta Negra"] }
    ];

    // === DADOS DE UTILITÁRIOS ===
    const utilitariosData = [
    { title: "RESERVA DE UNIDADE DE LANÇAMENTO", link: "https://docs.google.com/document/d/17QoIEhahikPda2zjSQ3esclqu-YS9j81/edit?usp=sharing&ouid=115657243229938792991&rtpof=true&sd=true" },
    { title: "CARTA DE CANCELAMENTO", link: "https://drive.google.com/file/d/1tlibpT-9XGQIDGTrvp3Zcb9sDep1CldF/view?usp=sharing" },
    { title: "M.O", link: "https://drive.google.com/file/d/1exQM1G9KFAHfRgOMIlZwc1rnsAFYRrZd/view?usp=sharing" },
    { title: "MONTAR PLANO", link: "https://drive.google.com/file/d/1nLpqHMlmSwx7h9azIGW4JbWwDdNrFvsg/view?usp=sharing" },
    { title: "ANALISE INTERNA", link: "https://drive.google.com/file/d/1shaF3OEZnX0y4M9OhSCWZMXAXb9CbAVf/view?usp=sharing" },
    { title: "DECLARAÇÃO DE ESCLARECIMENTO", link: "https://docs.google.com/document/d/1tBS_JyaYVJtLP4uZil7hrKQIbO8t6YUo/edit?usp=sharing&ouid=115657243229938792991&rtpof=true&sd=true" },
    { title: "DECLARAÇÃO DEPENDENTE", link: "https://drive.google.com/file/d/1WUXhNWN9aH-A-gL0Kxzh5wB2ClO961WK/view?usp=sharing" },
    { title: "AMML - DECLA. PROPRIETÁRIO DE RESIDÊNCIA", link: "https://drive.google.com/file/d/1Qp19k2BaqiR6kuWqmju3qd_GMlUYuxrX/view?usp=sharing" },
    { title: "AMML- DECLA. TEMPO DE RESIDÊNCIA", link: "https://drive.google.com/file/d/1sJdAyDwVBvOauW9EK0XBJIHoIHL6nhAX/view?usp=sharing" },
    { title: "AMML - DECLA. ESTADO CIVIL", link: "https://drive.google.com/file/d/1f5aC4XStNfCKuu6NK2_EetP2DHpbF_0p/view?usp=sharing" }
    ];

   // === FRASES MOTIVACIONAIS DIÁRIAS ===
    const frasesMotivacionais = [
    { texto: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", autor: "Robert Collier" },
    { texto: "Não vendemos apenas imóveis, nós entregamos as chaves para novos sonhos e recomeços.", autor: "Equipe Destemidos" },
    { texto: "A oportunidade não bate à porta, ela se apresenta quando você a constrói com muito trabalho.", autor: "Chris Grosser" },
    { texto: "Seu limite não é o mercado, é a sua própria mente. Voe alto!", autor: "Motivação Destemidos" },
    { texto: "Um cliente satisfeito é a melhor estratégia de negócios que existe.", autor: "Michael LeBoeuf" },
    { texto: "Não espere por condições perfeitas. O momento de fazer acontecer é agora.", autor: "George Bernard Shaw" },
    { texto: "O 'não' você já tem. O 'sim' está na próxima ligação, na próxima visita, no próximo cliente.", autor: "Sabedoria de Vendas" },
    { texto: "Vender é construir uma ponte de confiança entre a necessidade do cliente e a solução que você oferece.", autor: "Equipe Destemidos" },
    { texto: "A sorte acompanha quem trabalha duro. Que hoje seja um dia de muitos fechamentos!", autor: "Motivação Destemidos" },
    { texto: "Corretor de sucesso é aquele que escuta mais do que fala e resolve mais do que promete.", autor: "Anônimo" },
    { texto: "Cada 'não' recebido é um degrau a mais na escada que leva ao seu próximo 'sim'.", autor: "Sabedoria de Vendas" },
    { texto: "Não se trata apenas de vender uma casa, mas de apresentar o palco onde a vida do cliente vai acontecer.", autor: "Equipe Destemidos" },
    { texto: "O melhor corretor não é aquele que mais fala, mas aquele que faz as melhores perguntas.", autor: "Jeffrey Gitomer" },
    { texto: "A excelência em vendas não é um ato isolado, é um hábito construído a cada novo atendimento.", autor: "Aristóteles (Adaptado)" },
    { texto: "Transformar dúvidas em certezas é a verdadeira arte de quem vende com propósito.", autor: "Motivação Destemidos" },
    { texto: "As pessoas compram confiança antes de comprarem tijolos e cimento.", autor: "Anônimo" },
    { texto: "A sua energia de hoje determina a sua comissão de amanhã. Vá com tudo!", autor: "Motivação Destemidos" },
    { texto: "Nenhum obstáculo é grande demais quando a vontade de bater a meta é inabalável.", autor: "Equipe Destemidos" },
    { texto: "Foque em ajudar o seu cliente a realizar um sonho, e a venda será a consequência natural.", autor: "Sabedoria de Vendas" },
    { texto: "Grandes resultados exigem grandes dedicações. Dê o seu melhor em cada visita de hoje.", autor: "Motivação Destemidos" },
    { texto: "Para ser um corretor de sucesso, apaixone-se por resolver o problema do seu cliente.", autor: "Equipe Destemidos" },
    { texto: "A motivação nos faz começar o mês, mas é a disciplina nos atendimentos que nos faz fechar contratos.", autor: "Jim Rohn (Adaptado)" },
    { texto: "Todo campeão de vendas começou apenas com a coragem de pegar o telefone e tentar.", autor: "Anônimo" },
    { texto: "Mostre o valor antes de falar o preço, e veja a mágica da negociação acontecer.", autor: "Sabedoria de Vendas" },
    { texto: "O seu entusiasmo é contagiante. Vista o seu melhor sorriso e vá fechar negócios!", autor: "Motivação Destemidos" },
    { texto: "Não existe cliente impossível, existe cliente que ainda não compreendeu o valor da sua oferta.", autor: "Equipe Destemidos" },
    { texto: "Acredite no projeto que você está apresentando e o cliente acreditará em você.", autor: "Sabedoria de Vendas" },
    { texto: "Comemore cada pequeno avanço. Uma assinatura de contrato sempre começa com um bom 'bom dia'.", autor: "Motivação Destemidos" },
    { texto: "A diferença entre o corretor mediano e o de excelência está na atenção aos detalhes e ao cliente.", autor: "Equipe Destemidos" },
    { texto: "Nosso trabalho é transformar alicerces e plantas arquitetônicas em lares inesquecíveis.", autor: "Anônimo" },
    { texto: "Faça de cada atendimento uma obra-prima. O seu sucesso é a sua principal assinatura.", autor: "Motivação Destemidos" }
    ];
// === IMAGENS DE EQUIPE (Muda Diariamente) ===
const imagensEquipeDiarias = [
    "https://i.postimg.cc/tCc9D09Q/Copia-de-IMG-0779-(1).jpg",
    "https://i.postimg.cc/fLvwvJRq/Copia-de-IMG-1017.jpg",
    "https://i.postimg.cc/sXP20TwK/Copia-de-IMG-1504.jpg",
    "https://i.postimg.cc/KzhzN6r5/Copia-de-IMG-1515.jpg",
    "https://i.postimg.cc/hGT4fCWS/Copia-de-IMG-2336.jpg",
    "https://i.postimg.cc/bvtr1yb8/Copia-de-IMG-2830.jpg",
    "https://i.postimg.cc/1zqXDmFK/Copia-de-IMG-3048.jpg",
    "https://i.postimg.cc/YSW0QrF3/Copia-de-IMG-3049.jpg",
    "https://i.postimg.cc/mgqhczP5/Copia-de-IMG-3054.jpg",
    "https://i.postimg.cc/4xMnK7YP/Copia-de-IMG-3117.jpg",
    "https://i.postimg.cc/2SJ3qb1V/Copia-de-IMG-5622-(1).jpg",
    "https://i.postimg.cc/QCxjYhBj/Copia-de-IMG-9585.jpg",
    "https://i.postimg.cc/fWKLcg3X/Copia-de-IMG-9919.avif"
];

// Cálculos para manter a mesma imagem e frase durante todo o dia
const today = new Date();
const dayIndex = Math.floor((today.getTime() - today.getTimezoneOffset() * 60000) / (1000 * 60 * 60 * 24));

    export default function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeBrand, setActiveBrand] = useState('Direcional'); // Tabs: Direcional, Riva, Utilitarios, Guia
    const [fraseDoDia] = useState(frasesMotivacionais[dayIndex % frasesMotivacionais.length]);
    const [imagemDoDia] = useState(imagensEquipeDiarias[dayIndex % imagensEquipeDiarias.length]);
    
    // Estados para a aba Guia e Modal de POIs
    const [openGuiaIndex, setOpenGuiaIndex] = useState(null);
    const [selectedPois, setSelectedPois] = useState(null);

    // === ESTADOS DA IA OFFLINE ===
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { role: 'bot', content: 'Olá, Destemido! Sou a sua IA de apoio. Posso te ajudar com detalhes dos imóveis, pontos de referência ou criar a sua pasta de documentos rapidinho. Como posso facilitar sua venda hoje? ✨' }
    ]);
    const [chatInput, setChatInput] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);
    const messagesEndRef = useRef(null);
    
    // ESTADO PARA AS FRASES AMIGÁVEIS DO ROBÔ
    const [robotPhraseIndex, setRobotPhraseIndex] = useState(0);
    const robotFloatingPhrases = [
        "Posso te ajudar? 😊",
        "Vamos subir uma pasta? 📂",
        "Bora bater a meta? 🚀",
        "Dúvida em algum apê? 🏠",
        "Tô aqui, Destemido! ✨",
        "Quer criar um PDF agora? 📄",
        "Precisando de algo? 👋"
    ];

    // Efeito para alternar as frases do robô a cada 10 segundos (10000ms)
    useEffect(() => {
        const interval = setInterval(() => {
            setRobotPhraseIndex(prev => (prev + 1) % robotFloatingPhrases.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [robotFloatingPhrases.length]);

    // === ESTADOS PARA CRIAÇÃO DE PASTA DO CLIENTE ===
    const fileInputRef = useRef(null);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [isFinalizingFolder, setIsFinalizingFolder] = useState(false); 
    const [pendingDocs, setPendingDocs] = useState([]);
    const [pdfFileName, setPdfFileName] = useState("Pasta_do_Cliente");
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);

    // Carregar a biblioteca pdf-lib dinamicamente
    useEffect(() => {
        if (!document.getElementById('pdf-lib-script')) {
            const script = document.createElement('script');
            script.id = 'pdf-lib-script';
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    // === LÓGICA DE PROCESSAMENTO DE LINGUAGEM NATURAL (OFFLINE) ===
    const normalizeString = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const processChatMessage = (inputMsg) => {
        const input = normalizeString(inputMsg);
        let matchedProperties = [];

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
                    botResponse += `🔹 **${p.title}** (${p.region}) - ${p.size} (${p.brand})\n`;
                    if(wantsMagazine) botResponse += `  🔗 [Baixar Revista PDF](${p.link})\n`;
                });
                
                if (!wantsMagazine) botResponse += `\nQual desses você gostaria de ver o PDF agora?`;
            }
        } else {
            if (input.includes("ola") || input.includes("bom dia") || input.includes("boa tarde") || input.includes("boa noite")) {
                botResponse = "Olá, Destemido! Bora bater essa meta? 🚀 Como posso te ajudar agora? Posso buscar empreendimentos por bairro, nome ou te ajudar a criar aquela pasta do cliente rapidinho.";
            } else if (input.includes("financiamento") || input.includes("renda") || input.includes("mcmv") || input.includes("codigo")) {
                botResponse = "Entendi! Sobre códigos do MCMV ou SBPE, você encontra tudo detalhado na aba **GUIA** ali em cima. (Dica rápida: Faixa 1 e 2 é o código 3280). Quer saber mais alguma coisa?";
            } else if (input.includes("amml") || input.includes("amazonas meu lar")) {
                botResponse = "Para o **Amazonas Meu Lar**, temos todos os modelos de declarações que você precisa na aba **UTILITÁRIOS**. É só baixar e usar!";
            } else {
                botResponse = "Hmm, não consegui entender exatamente o que você precisa. 😅\n\nPode tentar algo como: 'Me mostra o Brisas', 'Qual apê tem na zona norte?' ou 'Vamos criar uma pasta'.";
            }
        }

        return botResponse;
    };

    const handleSendChatMessage = () => {
        if (!chatInput.trim() || isChatLoading) return;

        const userMessage = chatInput;
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsChatLoading(true);

        setTimeout(() => {
            const responseText = processChatMessage(userMessage);
            setChatMessages(prev => [...prev, { role: 'bot', content: responseText }]);
            setIsChatLoading(false);
        }, 800 + Math.random() * 700);
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newDocs = files.map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            name: file.name,
            previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        }));

        setPendingDocs(prev => [...prev, ...newDocs]);
        
        if (!isCreatingFolder) {
            setIsCreatingFolder(true);
            setChatMessages(prev => [...prev, { role: 'bot', content: "Ótimo! Já abri a área de organização. 📂\n\nAgora você pode **arrastar os documentos** para colocar na ordem certa e depois clicar em Gerar PDF." }]);
        }
        
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDragStart = (e, index) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = "move";
        setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedItemIndex(null);
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
                    const loadedPdf = await PDFDocument.load(arrayBuffer);
                    const copiedPages = await mergedPdf.copyPages(loadedPdf, loadedPdf.getPageIndices());
                    copiedPages.forEach((page) => mergedPdf.addPage(page));
                } else if (doc.file.type.startsWith('image/')) {
                    let image;
                    if (doc.file.type === 'image/jpeg' || doc.file.type === 'image/jpg') {
                        image = await mergedPdf.embedJpg(arrayBuffer);
                    } else if (doc.file.type === 'image/png') {
                        image = await mergedPdf.embedPng(arrayBuffer);
                    } else { continue; }
                    const page = mergedPdf.addPage();
                    const { width, height } = page.getSize();
                    const imgDims = image.scale(1);
                    const scale = Math.min((width - 40) / imgDims.width, (height - 40) / imgDims.height, 1);
                    const drawWidth = imgDims.width * scale;
                    const drawHeight = imgDims.height * scale;
                    page.drawImage(image, {
                        x: width / 2 - drawWidth / 2, y: height / 2 - drawHeight / 2,
                        width: drawWidth, height: drawHeight,
                    });
                }
            }
            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${pdfFileName || 'Pasta_do_Cliente'}.pdf`;
            link.click();
            setChatMessages(prev => [...prev, { role: 'bot', content: "✅ **Missão cumprida!** Seu PDF foi gerado e o download começou.\n\nSua pasta está prontinha e organizada. Mais algum desafio para hoje?" }]);
            setIsCreatingFolder(false);
            setPendingDocs([]);
            setIsFinalizingFolder(false);
        } catch (error) {
            setChatMessages(prev => [...prev, { role: 'bot', content: "Ops, algo não deu certo ao gerar o arquivo. 😕 Tente conferir se as imagens estão legíveis." }]);
        }
        setIsChatLoading(false);
    };

    const removeDoc = (id) => {
        setPendingDocs(prev => {
            const doc = prev.find(d => d.id === id);
            if (doc?.previewUrl) URL.revokeObjectURL(doc.previewUrl);
            return prev.filter(d => d.id !== id);
        });
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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isChatOpen]);

    const filteredRevistas = revistasData.filter(revista => {
        const matchesSearch = revista.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            revista.region.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = revista.brand === activeBrand;
        return matchesSearch && matchesBrand;
    });

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12 relative">
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                <img src="https://i.postimg.cc/XpWRf9pj/logo.png" alt="Logo" className="h-10 w-auto object-contain rounded shrink-0" />
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Destemidos</h1>
                    <p className="text-sm font-semibold text-slate-300 tracking-wide uppercase">A sorte favorece os ousados</p>
                </div>
                </div>
                {(activeBrand === 'Direcional' || activeBrand === 'Riva') && (
                <div className="w-full sm:w-auto relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" placeholder="Buscar por nome ou bairro..." className="block w-full sm:w-80 pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-slate-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all sm:text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                )}
            </div>
            </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            {/* BANNER INSPIRAÇÃO DIÁRIA */}
            <div className="mb-8 relative rounded-2xl overflow-hidden shadow-lg group">
            <img src={imagemDoDia} onError={(e) => { e.target.src = '' }} alt="Equipe Destemidos" className="w-full h-64 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-1000 bg-slate-200" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                <span className="bg-amber-500 text-amber-950 text-xs font-black uppercase tracking-wider py-1.5 px-3 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles size={14} /> Inspiração do Dia
                </span>
                </div>
                <div className="flex gap-3">
                <Quote size={32} className="text-amber-500/50 shrink-0 mt-1" />
                <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight max-w-3xl drop-shadow-md">"{fraseDoDia.texto}"</h2>
                    <p className="text-amber-400 font-medium mt-3 flex items-center gap-2">
                    <span className="w-6 h-[1px] bg-amber-400/50 block"></span> {fraseDoDia.autor}
                    </p>
                </div>
                </div>
            </div>
            </div>

            {/* NAVEGAÇÃO DE ABAS */}
            <div className="border-b border-gray-200 mb-8 overflow-x-auto custom-scrollbar">
            <nav className="-mb-px flex space-x-6 sm:space-x-8 min-w-max" aria-label="Tabs">
                <button onClick={() => setActiveBrand('Direcional')} className={`whitespace-nowrap py-4 px-2 border-b-2 transition-colors flex items-center ${activeBrand === 'Direcional' ? 'border-blue-900' : 'border-transparent hover:border-gray-300'}`}>
                <div className={`flex items-center transition-all ${activeBrand === 'Direcional' ? 'opacity-100' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                    <span className="text-blue-900 font-black text-lg tracking-tight">DIRECIONAL</span>
                    <span className="w-1.5 h-1.5 bg-red-600 ml-1 rounded-sm"></span>
                </div>
                </button>
                <button onClick={() => setActiveBrand('Riva')} className={`whitespace-nowrap py-4 px-2 border-b-2 transition-colors flex items-center ${activeBrand === 'Riva' ? 'border-indigo-950' : 'border-transparent hover:border-gray-300'}`}>
                <div className={`flex items-center transition-all ${activeBrand === 'Riva' ? 'opacity-100' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                    <span className="text-indigo-950 font-black text-lg tracking-tight">RIVA</span>
                    <span className="w-1.5 h-1.5 bg-indigo-950 ml-1 rounded-sm"></span>
                </div>
                </button>
                <a href="https://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso&isVoltar=true" target="_blank" rel="noopener noreferrer" className="whitespace-nowrap py-4 px-2 border-b-2 border-transparent hover:border-gray-300 transition-colors flex items-center group">
                <div className="flex items-center transition-all opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100">
                    <span className="text-emerald-700 font-black text-lg tracking-tight">SIMULADOR</span>
                    <Calculator size={16} className="ml-1.5 text-emerald-600" />
                </div>
                </a>
                <a href="https://drive.google.com/drive/folders/14mYfQkNaSc9APr6hpOTKKTFQ02oq3uOf?usp=sharing" target="_blank" rel="noopener noreferrer" className="whitespace-nowrap py-4 px-2 border-b-2 border-transparent hover:border-gray-300 transition-colors flex items-center group">
                <div className="flex items-center transition-all opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100">
                    <span className="text-violet-700 font-black text-lg tracking-tight">TABELAS</span>
                    <TableProperties size={16} className="ml-1.5 text-violet-600" />
                </div>
                </a>
                <button onClick={() => setActiveBrand('Utilitarios')} className={`whitespace-nowrap py-4 px-2 border-b-2 transition-colors flex items-center ${activeBrand === 'Utilitarios' ? 'border-orange-600' : 'border-transparent hover:border-gray-300'}`}>
                <div className={`flex items-center transition-all ${activeBrand === 'Utilitarios' ? 'opacity-100' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                    <span className="text-orange-600 font-black text-lg tracking-tight">UTILITÁRIOS</span>
                    <BookMarked size={16} className="ml-1.5 text-orange-600" />
                </div>
                </button>
                <button onClick={() => setActiveBrand('Guia')} className={`whitespace-nowrap py-4 px-2 border-b-2 transition-colors flex items-center ${activeBrand === 'Guia' ? 'border-rose-600' : 'border-transparent hover:border-gray-300'}`}>
                <div className={`flex items-center transition-all ${activeBrand === 'Guia' ? 'opacity-100' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                    <span className="text-rose-600 font-black text-lg tracking-tight">GUIA</span>
                    <HelpCircle size={16} className="ml-1.5 text-rose-600" />
                </div>
                </button>
            </nav>
            </div>

            {(activeBrand === 'Direcional' || activeBrand === 'Riva') && (
            <>
                {filteredRevistas.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
                    <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-lg font-medium text-slate-900">Nenhum material encontrado</h3>
                    <p className="text-slate-500">Tente buscar por outro nome ou bairro.</p>
                </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRevistas.map((revista) => (
                    <div key={revista.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 flex flex-col group">
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img src={revista.cover} onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400'; }} alt={`Capa ${revista.title}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 z-10">
                            <div className="bg-white px-3 py-1.5 rounded-lg shadow-md flex items-center justify-center h-10 min-w-[100px]">
                            <img src={revista.brand === 'Direcional' ? 'https://i.postimg.cc/crYQS8mh/image.png' : 'https://i.postimg.cc/R3Q9f9Bc/image.png'} alt={revista.brand} className="h-full max-h-[22px] w-auto max-w-[85px] object-contain" />
                            </div>
                        </div>
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{revista.title}</h3>
                        <div className="flex flex-col gap-2 mb-6">
                            <div className="flex items-center text-slate-500 text-sm gap-2">
                            <MapPin size={16} className="text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{revista.region}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                            <div className="flex items-center text-slate-500 text-sm gap-1.5"><Maximize size={16} className="text-slate-400 shrink-0" /><span>{revista.size}</span></div>
                            <div className="flex items-center text-slate-500 text-sm gap-1.5"><Bed size={16} className="text-slate-400 shrink-0" /><span>{revista.bedrooms}</span></div>
                            <div className="flex items-center text-slate-500 text-sm gap-1.5"><LayoutGrid size={16} className="text-slate-400 shrink-0" /><span>{revista.flooring}</span></div>
                            </div>
                        </div>
                        <div className="mt-auto flex flex-col gap-2">
                            <a href={revista.link} target="_blank" rel="noopener noreferrer" className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors duration-200 ${revista.brand === 'Direcional' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-indigo-950 hover:bg-indigo-900 text-white'}`}>
                            Acessar Revista (PDF) <ExternalLink size={18} />
                            </a>
                            <button onClick={() => setSelectedPois(revista)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-colors duration-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm border border-slate-200">
                                <MapPin size={16} className="text-rose-500" /> Ver Pontos de Referência
                            </button>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </>
            )}

            {activeBrand === 'Utilitarios' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {utilitariosData.map((item, index) => (
                <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all flex items-start gap-4 group">
                    <div className="bg-orange-100 p-3 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors shrink-0"><FileText size={24} /></div>
                    <div className="flex-1">
                    <h3 className="font-bold text-slate-700 text-sm leading-snug group-hover:text-orange-700 transition-colors">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">Acessar documento <ExternalLink size={12} /></p>
                    </div>
                </a>
                ))}
            </div>
            )}

            {activeBrand === 'Guia' && (
            <div className="max-w-3xl mx-auto space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button onClick={() => setOpenGuiaIndex(openGuiaIndex === 0 ? null : 0)} className="w-full text-left p-5 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><HelpCircle className="text-rose-500" size={20} /> Perguntas Frequentes: CÓDIGO DAS FAIXAS DE RENDA</h3>
                    {openGuiaIndex === 0 ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </button>
                {openGuiaIndex === 0 && (
                    <div className="p-5 pt-0 border-t border-slate-100 text-slate-600 bg-slate-50/50">
                    <div className="bg-rose-100 text-rose-800 p-3 rounded-lg font-bold flex items-center gap-2 mb-4 w-fit text-sm">ATENÇÃO</div>
                    <p className="mb-4">O simulador do Portal já está ajustado para o novo MCMV, podendo simular todas as faixas do programa.</p>
                    <p className="font-bold text-slate-800 mb-2">Códigos para simulação MCMV:</p>
                    <ul className="space-y-2 mb-4">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> <strong>FAIXA 1</strong> - código 3280</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> <strong>FAIXA 2</strong> - código 3280</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> <strong>FAIXA 3</strong> - código 3302</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> <strong>FAIXA 4</strong> - código 3550</li>
                    </ul>
                    <p className="pt-2 border-t border-slate-200"><strong>SBPE</strong> - código 1976</p>
                    </div>
                )}
                </div>
            </div>
            )}
        </main>

        {/* MODAL PONTOS DE REFERÊNCIA */}
        {selectedPois && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPois(null)}>
                <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><MapPin className="text-rose-500" size={20} /> Pontos de Referência</h3>
                        <button onClick={() => setSelectedPois(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200"><X size={20} /></button>
                    </div>
                    <div className="p-6">
                        <h4 className="font-bold text-lg mb-4 text-slate-800 border-b border-slate-100 pb-2">{selectedPois.title}</h4>
                        <ul className="space-y-3">
                            {selectedPois.pois.map((poi, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0 shadow-sm"></div>
                                    <span className="font-medium">{poi}</span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setSelectedPois(null)} className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-sm">Fechar</button>
                    </div>
                </div>
            </div>
        )}

        {/* --- ÍCONE DO ROBÔ E BALÃO AMIGÁVEL --- */}
        <div className={`fixed bottom-8 right-8 z-40 flex flex-col items-end transition-all duration-500 ${isChatOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
            {/* Balão de Fala Amigável */}
            <div 
                className="mb-4 bg-white px-5 py-3 rounded-2xl shadow-xl border border-blue-100 relative animate-float flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setIsChatOpen(true)}
            >
                <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600">
                    <Sparkles size={14} className="animate-pulse" />
                </div>
                <span className="text-slate-700 font-bold text-sm whitespace-nowrap">
                    {robotFloatingPhrases[robotPhraseIndex]}
                </span>
                {/* Seta do Balão */}
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-blue-100 rotate-45"></div>
            </div>

            {/* Ícone do Robô com Visual Amigável */}
            <button
                onClick={() => setIsChatOpen(true)}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-800 text-white rounded-[2.5rem] shadow-2xl shadow-blue-500/30 hover:rounded-[1.5rem] hover:scale-110 transition-all duration-500 flex items-center justify-center relative group overflow-hidden border-2 border-white/20"
            >
                {/* Brilho Interno */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex flex-col items-center">
                    <Bot className="w-10 h-10 relative z-10 transition-transform group-hover:-translate-y-1" strokeWidth={1.5} />
                    <div className="h-1.5 w-6 bg-white/30 rounded-full mt-1.5 group-hover:w-8 transition-all blur-[1px]"></div>
                </div>
                
                {/* Indicador de Status "Estou Aqui" */}
                <span className="absolute top-4 right-4 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-white"></span>
                </span>
            </button>

            {/* Estilo para animação personalizada */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}} />
        </div>

        {/* CHATBOT CONTAINER */}
        <div className={`fixed bottom-6 right-6 bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col z-50 transition-all duration-500 border-none overflow-hidden origin-bottom-right ${isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'} ${isCreatingFolder ? 'w-[95vw] sm:w-[90vw] md:w-[85vw] h-[90vh]' : 'w-[350px] sm:w-[420px] h-[600px] max-h-[85vh]'}`}>
            <div className="bg-gradient-to-r from-indigo-900 to-blue-800 p-5 flex items-center justify-between shrink-0 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md border border-white/20">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white tracking-tight">IA Destemidos {isCreatingFolder && "✨"}</h3>
                        <p className="text-blue-100 text-[10px] font-medium flex items-center gap-1.5 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            Online para te apoiar
                        </p>
                    </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {!isCreatingFolder && (
                <div className="overflow-y-auto p-5 space-y-5 bg-slate-50/50 custom-scrollbar flex-1">
                    {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                            }`}>
                                {msg.role === 'bot' ? renderChatMessage(msg.content) : msg.content}
                            </div>
                        </div>
                    ))}
                    {isChatLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex gap-1.5 items-center">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}

            {isCreatingFolder && (
                <div className="bg-slate-50 p-4 sm:p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 relative">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 relative overflow-hidden">
                        <button onClick={() => setIsCreatingFolder(false)} className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                            Voltar ao Chat
                        </button>
                        <h3 className="font-black text-xl text-slate-800 flex items-center gap-3">
                            <FolderPlus className="text-indigo-600" size={24} />
                            Criar Pasta do Cliente
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {pendingDocs.map((doc, index) => (
                            <div key={doc.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index)} className={`relative group bg-white border-2 border-dashed ${draggedItemIndex === index ? 'border-indigo-400 scale-95 opacity-50' : 'border-transparent hover:border-indigo-300'} rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all aspect-[3/4] flex flex-col cursor-move`}>
                                <div className="absolute top-2 left-2 bg-indigo-900/80 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-lg z-10 backdrop-blur-sm">{index + 1}</div>
                                <button onClick={(e) => { e.stopPropagation(); removeDoc(doc.id); }} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-10 hover:bg-red-600 shadow-lg"><Trash2 size={14} /></button>
                                <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-hidden">
                                    {doc.previewUrl ? <img src={doc.previewUrl} alt="preview" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center gap-2 text-slate-400"><FileIcon size={40} className="text-red-400" /><span className="text-[10px] font-black uppercase tracking-widest">PDF</span></div>}
                                </div>
                                <div className="p-3 bg-white border-t border-slate-50 text-[10px] font-bold text-slate-500 truncate text-center uppercase tracking-tight">{doc.name}</div>
                            </div>
                        ))}
                        <button onClick={() => fileInputRef.current?.click()} className="aspect-[3/4] rounded-2xl border-2 border-dashed border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50 bg-white flex flex-col items-center justify-center cursor-pointer transition-all text-indigo-400 shadow-sm">
                            <Plus size={32} className="mb-2" />
                            <span className="text-[10px] font-black text-center leading-tight uppercase tracking-widest">Adicionar<br/>Arquivo</span>
                        </button>
                    </div>
                    
                    {pendingDocs.length > 0 && (
                        <div className="mt-auto flex justify-end sticky bottom-0 z-20 pt-4">
                            <button onClick={() => setIsFinalizingFolder(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-1 transition-all flex items-center gap-2">
                                <Wand2 size={18} /> Finalizar PDF
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className={`p-4 bg-white border-t border-slate-50 rounded-b-3xl shrink-0 flex flex-col gap-3 ${isCreatingFolder ? 'hidden' : ''}`}>
                <div className="flex gap-2">
                    <button onClick={() => { setIsCreatingFolder(true); fileInputRef.current?.click(); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-indigo-100 border border-indigo-100 transition-all shadow-sm">
                        <FolderPlus size={16} /> Vamos subir uma pasta?
                    </button>
                </div>
                <div className="relative flex items-center gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple accept="image/png, image/jpeg, image/jpg, application/pdf" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="p-3 rounded-2xl transition-all shrink-0 text-slate-400 hover:bg-slate-50 hover:text-indigo-600" title="Anexar algo"><Paperclip size={20} /></button>
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()} placeholder="Posso te ajudar com algo?" className="w-full bg-slate-100 text-slate-800 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all" disabled={isChatLoading} />
                    <button onClick={handleSendChatMessage} disabled={!chatInput.trim() || isChatLoading} className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white p-2.5 rounded-xl transition-all flex items-center justify-center shadow-md"><Send className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
        
        {/* MODAL PARA FINALIZAR */}
        {isFinalizingFolder && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setIsFinalizingFolder(false)}>
                <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-7 relative flex flex-col gap-5 transform transition-all" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setIsFinalizingFolder(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl transition-all"><X size={20} /></button>
                    <div className="flex items-center gap-4 mb-2 border-b border-slate-50 pb-5">
                        <div className="bg-indigo-100 p-3 rounded-2xl"><FileIcon className="text-indigo-600" size={24} /></div>
                        <div>
                            <h3 className="font-black text-lg text-slate-800 leading-tight uppercase tracking-tight">Salvar Pasta</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dê um nome ao seu PDF</p>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">Nome do Arquivo:</label>
                        <input type="text" value={pdfFileName} onChange={(e) => setPdfFileName(e.target.value)} className="w-full text-sm border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 bg-slate-50 font-bold transition-all" placeholder="Ex: Pasta_Joao_Silva" autoFocus />
                    </div>
                    <button onClick={generateClientPDF} disabled={isChatLoading} className="w-full mt-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-3">
                        {isChatLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Wand2 size={20} /> Baixar PDF Unificado</>}
                    </button>
                </div>
            </div>
        )}
        </div>
    );
    }
