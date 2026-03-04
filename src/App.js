import React, { useState, useEffect, useRef } from 'react';
    import { Search, Building, ExternalLink, MapPin, BookOpen, Maximize, Bed, LayoutGrid, Rocket, Quote, Sparkles, ChevronDown, ChevronUp, FileText, TableProperties, BookMarked, HelpCircle, Calculator, Bot, X, Send, Wand2 } from 'lucide-react';

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

// Exemplo de como usar o dayIndex para pegar a imagem do dia:
// const imagemDoDia = imagensEquipeDiarias[dayIndex % imagensEquipeDiarias.length];

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
        { role: 'bot', content: 'Olá, Destemido! Sou a IA de apoio ao Corretor. Posso ajudar com detalhes dos imóveis da Direcional e Riva, pontos de referência ou links de revistas. Como posso ajudar seu cliente hoje?' }
    ]);
    const [chatInput, setChatInput] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // === LÓGICA DE PROCESSAMENTO DE LINGUAGEM NATURAL (OFFLINE) ===
    const normalizeString = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const processChatMessage = (inputMsg) => {
        const input = normalizeString(inputMsg);
        let matchedProperties = [];

        // 1. Detectar propriedades específicas por apelidos/chaves
        revistasData.forEach(prop => {
            if (prop.aliases.some(alias => input.includes(normalizeString(alias)))) {
                if (!matchedProperties.some(p => p.id === prop.id)) {
                    matchedProperties.push(prop);
                }
            }
        });

        // 2. Se não encontrou nome específico, procurar por região
        if (matchedProperties.length === 0) {
            const regions = ["zona leste", "zona norte", "zona oeste", "zona sul", "centro-sul", "centro-oeste", "taruma", "flores", "coroado"];
            let detectedRegion = regions.find(r => input.includes(r));
            
            if (detectedRegion) {
                // Mapear termos normalizados para a região real cadastrada
                matchedProperties = revistasData.filter(p => normalizeString(p.region).includes(detectedRegion));
            }
        }

        // 3. Identificar se o corretor quer a revista/link
        const wantsMagazine = ["revista", "pdf", "link", "material", "apresentacao", "enviar", "mande", "mandar", "baixe", "baixar"].some(w => input.includes(w));
        const wantsPois = ["referencia", "referência", "perto", "proximo", "próximo", "localizacao", "localização", "onde fica"].some(w => input.includes(w));

        // 4. Formular a Resposta
        let botResponse = "";

        if (matchedProperties.length > 0) {
            if (matchedProperties.length === 1) {
                const p = matchedProperties[0];
                
                if (wantsPois) {
                    botResponse = `O **${p.title}** fica super bem localizado na região de ${p.region}.\n\n📍 **Principais Pontos de Referência:**\n`;
                    p.pois.forEach(poi => botResponse += `• ${poi}\n`);
                    botResponse += `\nQuer que eu te mande a revista dele para mostrar pro cliente?`;
                } else {
                    botResponse = `Entendi! Você está falando do **${p.title}** (${p.brand}).\n\n📍 **Onde Fica:** ${p.region}\n📏 **Planta:** ${p.size} com ${p.bedrooms}\n🏢 **Referências próximas:** ${p.pois.slice(0, 3).join(', ')}.\n\n`;
                    
                    if (wantsMagazine || input.includes("revista")) {
                        botResponse += `Aqui está a revista em PDF que você pediu: [Acessar Material do ${p.title}](${p.link})`;
                    } else {
                        botResponse += `Se o cliente se interessar, posso te enviar o link da revista PDF ou detalhar os pontos de referência. É só pedir!`;
                    }
                }
            } else {
                botResponse = `Legal! Encontrei ${matchedProperties.length} opções que combinam com o que o seu cliente procura:\n\n`;
                matchedProperties.forEach(p => {
                    botResponse += `🔹 **${p.title}** (${p.region}) - ${p.size} (${p.brand})\n`;
                    if(wantsMagazine) botResponse += `  🔗 [Baixar Revista PDF](${p.link})\n`;
                });
                
                if (!wantsMagazine) botResponse += `\nQuer que eu envie o PDF de algum desses para você mandar pro cliente?`;
            }
        } else {
            // Fallbacks e perguntas genéricas
            if (input.includes("ola") || input.includes("bom dia") || input.includes("boa tarde") || input.includes("boa noite")) {
                botResponse = "Olá, bora vender muito! 🚀 O que o seu cliente está procurando hoje? Pode me dar dicas como 'apê na zona leste' ou o nome de um empreendimento como 'Brisas' ou 'Zenith'.";
            } else if (input.includes("financiamento") || input.includes("renda") || input.includes("mcmv") || input.includes("codigo")) {
                botResponse = "Para dúvidas sobre faixas de renda e códigos do Minha Casa Minha Vida, dá uma olhadinha na nossa aba **GUIA** ali no menu principal! Lá tem os códigos certinhos (ex: Faixa 1 é 3280).";
            } else if (input.includes("amml") || input.includes("amazonas meu lar")) {
                botResponse = "Para o Amazonas Meu Lar, você pode encontrar os modelos de declarações e documentos necessários na aba **UTILITÁRIOS**. Temos a Declaração de Tempo de Residência e Estado Civil lá.";
            } else {
                botResponse = "Poxa, não consegui identificar um empreendimento específico ou região nessa mensagem. 😅 \n\nVocê pode se expressar como: 'Meu cliente quer um apartamento na zona norte' ou 'Me manda a revista do Lírio Azul'. Pode tentar de novo?";
            }
        }

        return botResponse;
    };

    // Função 1: Enviar mensagem no Chat (Offline)
    const handleSendChatMessage = () => {
        if (!chatInput.trim() || isChatLoading) return;

        const userMessage = chatInput;
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsChatLoading(true);

        // Simulando um tempo de digitação natural da IA (500ms a 1500ms)
        setTimeout(() => {
            const responseText = processChatMessage(userMessage);
            setChatMessages(prev => [...prev, { role: 'bot', content: responseText }]);
            setIsChatLoading(false);
        }, 800 + Math.random() * 700);
    };

    // Função Auxiliar para renderizar Links de Markdown [Texto](url) nas mensagens do chat
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

    // Auto-scroll para o Chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isChatOpen]);

    const filteredRevistas = revistasData.filter(revista => {
        const matchesSearch = revista.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            revista.region.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = revista.brand === activeBrand;
        return matchesSearch && matchesBrand;
    });

    const toggleGuia = (index) => {
        setOpenGuiaIndex(openGuiaIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12 relative">
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                
                {/* --- O SEU LOGÓTIPO AQUI --- */}
                <img 
                    src="https://i.postimg.cc/XpWRf9pj/logo.png" 
                    alt="O meu logótipo" 
                    className="h-10 w-auto object-contain rounded shrink-0"
                />
                
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Destemidos</h1>
                    <p className="text-sm font-semibold text-slate-370 tracking-wide uppercase">A sorte favorece os ousados</p>
                </div>
                </div>

                {(activeBrand === 'Direcional' || activeBrand === 'Riva') && (
                <div className="w-full sm:w-auto relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    type="text"
                    placeholder="Buscar por nome ou bairro..."
                    className="block w-full sm:w-80 pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-slate-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                )}
            </div>
            </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            
            {/* BANNER INSPIRAÇÃO DIÁRIA */}
            <div className="mb-8 relative rounded-2xl overflow-hidden shadow-lg group">
            <img 
                src={imagemDoDia} 
                onError={(e) => { e.target.src = '' }}
                alt="Equipe Destemidos" 
                className="w-full h-64 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-1000 bg-slate-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                <span className="bg-amber-500 text-amber-950 text-xs font-black uppercase tracking-wider py-1.5 px-3 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles size={14} />
                    Inspiração do Dia
                </span>
                </div>
                
                <div className="flex gap-3">
                <Quote size={32} className="text-amber-500/50 shrink-0 mt-1" />
                <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight max-w-3xl drop-shadow-md">
                    "{fraseDoDia.texto}"
                    </h2>
                    <p className="text-amber-400 font-medium mt-3 flex items-center gap-2">
                    <span className="w-6 h-[1px] bg-amber-400/50 block"></span>
                    {fraseDoDia.autor}
                    </p>
                </div>
                </div>
            </div>
            </div>

            {/* NAVEGAÇÃO DE ABAS */}
            <div className="border-b border-gray-200 mb-8 overflow-x-auto custom-scrollbar">
            <nav className="-mb-px flex space-x-6 sm:space-x-8 min-w-max" aria-label="Tabs">
                <button
                onClick={() => setActiveBrand('Direcional')}
                className={`whitespace-nowrap py-4 px-2 border-b-2 transition-colors flex items-center ${
                    activeBrand === 'Direcional' ? 'border-blue-900' : 'border-transparent hover:border-gray-300'
                }`}
                >
                <div className={`flex items-center transition-all ${activeBrand === 'Direcional' ? 'opacity-100' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                    <span className="text-blue-900 font-black text-lg tracking-tight">DIRECIONAL</span>
                    <span className="w-1.5 h-1.5 bg-red-600 ml-1 rounded-sm"></span>
                </div>
                </button>
                
                <button
                onClick={() => setActiveBrand('Riva')}
                className={`whitespace-nowrap py-4 px-2 border-b-2 transition-colors flex items-center ${
                    activeBrand === 'Riva' ? 'border-indigo-950' : 'border-transparent hover:border-gray-300'
                }`}
                >
                <div className={`flex items-center transition-all ${activeBrand === 'Riva' ? 'opacity-100' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                    <span className="text-indigo-950 font-black text-lg tracking-tight">RIVA</span>
                    <span className="w-1.5 h-1.5 bg-indigo-950 ml-1 rounded-sm"></span>
                </div>
                </button>

                <a
                href="https://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso&isVoltar=true"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap py-4 px-2 border-b-2 border-transparent hover:border-gray-300 transition-colors flex items-center group"
                >
                <div className="flex items-center transition-all opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100">
                    <span className="text-emerald-700 font-black text-lg tracking-tight">SIMULADOR</span>
                    <Calculator size={16} className="ml-1.5 text-emerald-600" />
                </div>
                </a>

                <a
                href="https://drive.google.com/drive/folders/14mYfQkNaSc9APr6hpOTKKTFQ02oq3uOf?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap py-4 px-2 border-b-2 border-transparent hover:border-gray-300 transition-colors flex items-center group"
                >
                <div className="flex items-center transition-all opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100">
                    <span className="text-violet-700 font-black text-lg tracking-tight">TABELAS</span>
                    <TableProperties size={16} className="ml-1.5 text-violet-600" />
                </div>
                </a>

                <button
                onClick={() => setActiveBrand('Utilitarios')}
                className={`whitespace-nowrap py-4 px-2 border-b-2 transition-colors flex items-center ${
                    activeBrand === 'Utilitarios' ? 'border-orange-600' : 'border-transparent hover:border-gray-300'
                }`}
                >
                <div className={`flex items-center transition-all ${activeBrand === 'Utilitarios' ? 'opacity-100' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                    <span className="text-orange-600 font-black text-lg tracking-tight">UTILITÁRIOS</span>
                    <BookMarked size={16} className="ml-1.5 text-orange-600" />
                </div>
                </button>

                <button
                onClick={() => setActiveBrand('Guia')}
                className={`whitespace-nowrap py-4 px-2 border-b-2 transition-colors flex items-center ${
                    activeBrand === 'Guia' ? 'border-rose-600' : 'border-transparent hover:border-gray-300'
                }`}
                >
                <div className={`flex items-center transition-all ${activeBrand === 'Guia' ? 'opacity-100' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                    <span className="text-rose-600 font-black text-lg tracking-tight">GUIA</span>
                    <HelpCircle size={16} className="ml-1.5 text-rose-600" />
                </div>
                </button>
            </nav>
            </div>

            {/* ============================== */}
            {/* CONTEÚDO: DIRECIONAL & RIVA */}
            {/* ============================== */}
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
                        <img 
                            src={revista.cover} 
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400'; }}
                            alt={`Capa ${revista.title}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 z-10">
                            <div className="bg-white px-3 py-1.5 rounded-lg shadow-md flex items-center justify-center h-10 min-w-[100px]">
                            <img 
                                src={revista.brand === 'Direcional' 
                                    ? 'https://i.postimg.cc/crYQS8mh/image.png' 
                                    : 'https://i.postimg.cc/R3Q9f9Bc/image.png'
                                } 
                                alt={revista.brand}
                                className="h-full max-h-[22px] w-auto max-w-[85px] object-contain"
                            />
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
                            <div className="flex items-center text-slate-500 text-sm gap-1.5">
                                <Maximize size={16} className="text-slate-400 shrink-0" />
                                <span>{revista.size}</span>
                            </div>
                            <div className="flex items-center text-slate-500 text-sm gap-1.5">
                                <Bed size={16} className="text-slate-400 shrink-0" />
                                <span>{revista.bedrooms}</span>
                            </div>
                            <div className="flex items-center text-slate-500 text-sm gap-1.5">
                                <LayoutGrid size={16} className="text-slate-400 shrink-0" />
                                <span>{revista.flooring}</span>
                            </div>
                            </div>
                        </div>

                        <div className="mt-auto flex flex-col gap-2">
                            <a 
                            href={revista.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                                revista.brand === 'Direcional' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-indigo-950 hover:bg-indigo-900 text-white'
                            }`}
                            >
                            Acessar Revista (PDF)
                            <ExternalLink size={18} />
                            </a>
                            
                            <button
                                onClick={() => setSelectedPois(revista)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-colors duration-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm border border-slate-200"
                            >
                                <MapPin size={16} className="text-rose-500" />
                                Ver Pontos de Referência
                            </button>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </>
            )}

            {/* ============================== */}
            {/* CONTEÚDO: UTILITÁRIOS */}
            {/* ============================== */}
            {activeBrand === 'Utilitarios' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {utilitariosData.map((item, index) => (
                <a 
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all flex items-start gap-4 group"
                >
                    <div className="bg-orange-100 p-3 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors shrink-0">
                    <FileText size={24} />
                    </div>
                    <div className="flex-1">
                    <h3 className="font-bold text-slate-700 text-sm leading-snug group-hover:text-orange-700 transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        Acessar documento <ExternalLink size={12} />
                    </p>
                    </div>
                </a>
                ))}
            </div>
            )}

            {/* ============================== */}
            {/* CONTEÚDO: GUIA (FAQ) */}
            {/* ============================== */}
            {activeBrand === 'Guia' && (
            <div className="max-w-3xl mx-auto space-y-4">
                
                {/* Sanfona 1 */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button 
                    onClick={() => toggleGuia(0)}
                    className="w-full text-left p-5 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
                >
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <HelpCircle className="text-rose-500" size={20} />
                    Perguntas Frequentes: CÓDIGO DAS FAIXAS DE RENDA
                    </h3>
                    {openGuiaIndex === 0 ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </button>
                {openGuiaIndex === 0 && (
                    <div className="p-5 pt-0 border-t border-slate-100 text-slate-600 bg-slate-50/50">
                    <div className="bg-rose-100 text-rose-800 p-3 rounded-lg font-bold flex items-center gap-2 mb-4 w-fit text-sm">
                        ATENÇÃO
                    </div>
                    <p className="mb-4">
                        O simulador do Portal já está ajustado para o novo MCMV, podendo simular todas as faixas do programa.
                    </p>
                    <p className="font-bold text-slate-800 mb-2">Códigos para simulação MCMV:</p>
                    <ul className="space-y-2 mb-4">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> <strong>FAIXA 1</strong> - código 3280</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> <strong>FAIXA 2</strong> - código 3280</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> <strong>FAIXA 3</strong> - código 3302</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> <strong>FAIXA 4</strong> - código 3550</li>
                    </ul>
                    <p className="pt-2 border-t border-slate-200">
                        <strong>SBPE</strong> - código 1976
                    </p>
                    </div>
                )}
                </div>

                {/* Sanfona 2 */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button 
                    onClick={() => toggleGuia(1)}
                    className="w-full text-left p-5 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
                >
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <HelpCircle className="text-rose-500" size={20} />
                    Não consigo criar oportunidade nem cadastro
                    </h3>
                    {openGuiaIndex === 1 ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </button>
                {openGuiaIndex === 1 && (
                    <div className="p-5 pt-0 border-t border-slate-100 text-slate-600 bg-slate-50/50">
                    <div className="space-y-4 mt-4">
                        <div className="flex items-start gap-3">
                        <div className="bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm shrink-0">1</div>
                        <p>Primeiro identifique a mensagem que o sistema apresenta (Ex: "Fase acima da visita", "CPF cadastrado", etc).</p>
                        </div>
                        <div className="flex items-start gap-3">
                        <div className="bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm shrink-0">2</div>
                        <p>Segundo, mande para seu gerente na seguinte estrutura, nesta exata ordem:</p>
                        </div>
                    </div>
                    
                    <div className="bg-white border border-slate-200 rounded-lg p-4 mt-4 font-mono text-sm shadow-inner text-slate-700">
                    <p>NOME:</p>
                    <p>TELEFONE:</p>
                    <p>E-MAIL:</p>
                    <p>CPF:</p>
                </div>
                
                <div className="mt-4 text-sm text-slate-500 italic flex items-center gap-1">
                    <div className="w-1 h-4 bg-rose-500 rounded"></div>
                    Obs.: Algumas vezes será necessário o envio da documentação.
                </div>
                </div>
            )}
            </div>

            {/* Sanfona 3 */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button 
                    onClick={() => toggleGuia(2)}
                    className="w-full text-left p-5 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
                >
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <HelpCircle className="text-rose-500" size={20} />
                    Termos Técnicos Atualmente Usados
                    </h3>
                    {openGuiaIndex === 2 ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </button>
                {openGuiaIndex === 2 && (
                    <div className="p-5 pt-0 border-t border-slate-100 text-slate-600 bg-slate-50/50">
                    <ul className="space-y-4 mt-4 text-sm leading-relaxed">
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">AC</strong>: Análise de Crédito</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">AMML</strong>: Amazonas Meu Lar, é um programa do governo Estadual, com foco em ajudar o cliente na entrada do imóvel.</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">AMORTIZAÇÃO</strong>: Redução da dívida principal ao longo do tempo. Pode ser feita de forma SAC (parcelas decrescentes) ou Price (parcelas fixas).</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">ANALISE DE CRÉDITO</strong>: Processo para avaliar se o cliente tem condições de financiar, baseado na renda, CPF e histórico bancário.</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">BORA VENDER</strong>: Sistema de vendas da Direcional, onde o corretor pode cadastrar, acompanhar seu cliente e vender.</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">CCA</strong>: São os CORRESPONDENTES BANCÁRIOS, eles são responsáveis em fazer a análise de Crédito. E o corretor pode escolher o CCA que melhor atende a necessidade.</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">FID</strong>: Numeração gerada da ANÁLISE DE CRÉDITO, esse número deve ser copiado e mandado no Grupo do CCA para que seja feita a ANÁLISE DE CRÉDITO.</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">ITBI + REGISTRO</strong>: O ITBI é o Imposto de a Transferência de Bens Imóveis. É um IMPOSTO MUNICIPAL na qual a Direcional Paga e o cliente repassa para Direcional de maneira parcelada. REGISTRO se trata do Registro do imóvel no cartório. Esses valores a Direcional Parcela em até 40x em até 120 dias Depois do fechamento.</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">LINHA DE CRÉDITO</strong>: Modalidade de financiamento (ex: SBPE, MCMV).</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">MCMV</strong>: Sigla pro Programa MINHA CASA MINHA VIDA.</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">PODE MORAR</strong>: App do Cliente, para que ele possa acompanhar a evolução da obra, baixar boletos e efetuar pagamentos.</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">PROSOLUTO</strong>: É o saldo da ENTRADA que será parcelado APÓS OS SINAIS. O Pro-soluto pode ser parcelado em até 52x sem deflator de comissão.</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">SAFI</strong>: Sistema interno da CAIXA que gerencia as propostas de financiamento. Corretores não têm acesso direto, mas o banco usa ele pra análise e liberação.</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">SALES FORCE</strong>: Sistema usado pelos gerentes para acompanhamento geral.</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">SBPE</strong>: Sistema Brasileiro de Poupança e Empréstimo – Linha de crédito da CAIXA para quem tem renda maior ou não se enquadra no MCMV. Taxas variam conforme o perfil do cliente.</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">SICAQ</strong>: Status e resultado real da Análise. Pode estar APROVADO, REPROVADO, CONDICIONADO, NÃO SE APLICA. Etc…</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">SIRIC</strong>: Prestação máxima, ou Parcela Aprovada para aquela análise.</li>
                        <li><strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded">SUBSÍDIO</strong>: Benefício do MCMV ou AMML que são aplicados como DESCONTOS NA ENTRADA DO APARTAMENTO.</li>
                    </ul>
                    </div>
                )}
                </div>

            </div>
            )}

        </main>

        {/* --- MODAL PONTOS DE REFERÊNCIA --- */}
        {selectedPois && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPois(null)}>
                <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <MapPin className="text-rose-500" size={20} />
                            Pontos de Referência
                        </h3>
                        <button onClick={() => setSelectedPois(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200">
                            <X size={20} />
                        </button>
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
                        <button 
                            onClick={() => setSelectedPois(null)}
                            className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-sm"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* --- INTEGRAÇÃO IA: CHATBOT DO CORRETOR --- */}
        <button
            onClick={() => setIsChatOpen(true)}
            className={`fixed bottom-6 right-6 w-14 h-14 bg-indigo-900 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-800 hover:scale-105 transition-all duration-300 flex items-center justify-center z-40 ${isChatOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        >
            <Bot className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
            </span>
        </button>

        <div className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
            <div className="bg-gradient-to-r from-indigo-900 to-blue-900 p-4 rounded-t-2xl flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">IA Destemidos</h3>
                        <p className="text-blue-100 text-xs flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Online para apoiar
                        </p>
                    </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm text-sm leading-relaxed ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-sm' 
                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                        }`}>
                            {msg.role === 'bot' ? renderChatMessage(msg.content) : msg.content}
                        </div>
                    </div>
                ))}
                {isChatLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-slate-100 rounded-b-2xl shrink-0">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                        placeholder="Pergunte sobre regras, imóveis..."
                        className="w-full bg-slate-100 text-slate-800 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-shadow"
                        disabled={isChatLoading}
                    />
                    <button
                        onClick={handleSendChatMessage}
                        disabled={!chatInput.trim() || isChatLoading}
                        className="absolute right-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-2 rounded-full transition-colors flex items-center justify-center"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
        
        </div>
    );
    }







