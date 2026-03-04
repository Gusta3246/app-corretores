import React, { useState, useEffect, useRef } from 'react';
    import { Search, Building, ExternalLink, MapPin, BookOpen, Maximize, Bed, LayoutGrid, Rocket, Quote, Sparkles, ChevronDown, ChevronUp, FileText, TableProperties, BookMarked, HelpCircle, Calculator, Bot, X, Send, Wand2 } from 'lucide-react';

    // === DADOS DAS REVISTAS ===
    const revistasData = [
    { id: 1, title: "Brisas do Horizonte", brand: "Direcional", region: "Coroado - Zona Leste", size: "43m² a 45m²", bedrooms: "2 quartos", flooring: "Todo o apê", cover: "https://www.direcional.com.br/wp-content/uploads/2025/06/Perspectiva-Guarita-BrisasdoHorizonte.jpg.webp", link: "https://drive.google.com/file/d/18IXtAt9PLVjIsk2PkXIHXnVCaduVkGu2/view?usp=drive_link" },
    { id: 2, title: "Parque Ville Orquídea", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "41m²", bedrooms: "2 quartos", flooring: "Todo o apê", cover: "https://www.direcional.com.br/wp-content/uploads/2024/05/Perspectiva_PARQUEVILLEORQUIDEA_GUARITA.jpg.webp", link: "https://drive.google.com/file/d/1F_BeT2jceDM8u4kCbSXN8kp2rk7boQTG/view?usp=drive_link" },
    { id: 3, title: "Village Torres", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2024/09/Perspectiva-Guarita-VillageTorres.jpg.webp", link: "https://drive.google.com/file/d/1blVconA5fjODxvXB7s8KT6dSlX8KpLLv/view?usp=drive_link" },
    { id: 4, title: "Conquista Jardim Botânico", brand: "Direcional", region: "Nova Cidade - Zona Norte", size: "40m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2024/03/Conquista-Jardim-Botanico-Guarita.jpg.webp", link: "https://drive.google.com/file/d/1TYzIq8RuGORXfxQpH8CGZejTjF_GlUz0/view?usp=drive_link" },
    { id: 5, title: "Viva Vida Coral", brand: "Direcional", region: "Colônia Terra Nova - Zona Norte", size: "41m² a 51m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2025/05/Perspectiva-Guarita-VivaVidaCoral.jpg.webp", link: "https://drive.google.com/file/d/1lYo3otquzwdnD0r5f6JobBbW-6KmGOF4/view?usp=drive_link" },
    { id: 6, title: "Conquista Jardim Norte", brand: "Direcional", region: "Santa Etelvina - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2024/12/Perspectiva-Guarita-ConquistaJardimNorte.jpg.webp", link: "https://drive.google.com/file/d/1_Hyb72NWl1HjEiabKLL9m5ZMutHExesY/view?usp=drive_link" },
    { id: 7, title: "Viva Vida Rio Amazonas", brand: "Direcional", region: "Tarumã - Zona Oeste", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2023/07/Guarita-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp", link: "https://drive.google.com/" },
    { id: 8, title: "Bosque das Torres", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2025/10/portaria-bosque-das-torres.jpg.webp", link: "https://drive.google.com/file/d/1lPnNQuxlPkKOcW2JqOB7KEWsaQVpZzcU/view?usp=drive_link" },
    { id: 9, title: "Parque Ville Lírio Azul", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "41m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2025/11/fachada-noturna-parque-ville-lirio-azul.jpg.webp", link: "https://drive.google.com/file/d/1fc7AXap6nhkpTlxONsm46WJCKxIWIhwe/view?usp=drive_link" },
    { id: 10, title: "Amazon Boulevard Classic", brand: "Riva", region: "Bairro da Paz - Zona Centro-Oeste", size: "36m² a 48m²", bedrooms: "2 quartos", flooring: "Todo o apê", cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2023/11/fachada-noturna_amazon-boulevard-classic.jpg.webp", link: "https://drive.google.com/file/d/1ZX37T2S8FlHnSiO-yeAjlFyqq_5-dVzx/view?usp=drive_link" },
    { id: 11, title: "Amazon Boulevard Prime", brand: "Riva", region: "Novo Israel - Zona Norte", size: "51m² a 70m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2025/06/guarita-Amazon-prime-boulevard-riva.jpg.webp", link: "https://drive.google.com/file/d/1aIuBlwLYGStUm7DNE3gCbfu3Ty2JmkGM/view?usp=drive_link" },
    { id: 12, title: "Città Oasis Azzure", brand: "Riva", region: "Flores - Zona Centro-Sul", size: "48m² a 49m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2025/08/citta-azzure_GUARITA.jpg.webp", link: "https://drive.google.com/" },
    { id: 13, title: "Zenith Condomínio Clube", brand: "Riva", region: "São Francisco - Zona Sul", size: "48m² a 49m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2024/08/Perspectiva-Guarita-ZenithCondominioClube.webp", link: "https://drive.google.com/file/d/1wv_v56T2ACEHtPZF-iRBvEWY2VVdUXxu/view?usp=drive_link" },
    { id: 14, title: "Conquista Topázio", brand: "Direcional", region: "Colônia Terra Nova - Zona Norte", size: "41m² a 51m²", bedrooms: "1 e 2 quartos", flooring: "Todo o apê", cover: "https://www.direcional.com.br/wp-content/uploads/2023/04/Guarita-Conquista-Topazio-Direcional.jpg.webp", link: "https://drive.google.com/file/d/1SMIfr9HbfLd06UaDLKbMUxxtuh4cPPEM/view?usp=drive_link" },
    { id: 16, title: "Conquista Rio Negro", brand: "Direcional", region: "Zona Oeste", size: "41m²", bedrooms: "2 quartos", flooring: "Todo o apê", cover: "https://www.direcional.com.br/wp-content/uploads/2022/11/Guarita-Conquista-Rio-Negro-Direcional.jpg.webp", link: "https://drive.google.com/file/d/1pHLQwUSn6BDMfLo7fFGonyyWlgtXwNmy/view?usp=drive_link" },
    { id: 17, title: "Viva Vida Rio Tapajós", brand: "Direcional", region: "Tarumã - Zona Oeste", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2025/02/Perspectiva-Guarita-VivaVidaRioTapajos.jpg.webp", link: "https://drive.google.com/file/d/1k3TOypf5bm_zXPfc-ulb7vY9e7MKxmlk/view?usp=drive_link" }
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
    { texto: "Corretor de sucesso é aquele que escuta mais do que fala e resolve mais do que promete.", autor: "Anônimo" }
    ];

    // === IMAGENS DE EQUIPE (Muda Diariamente) ===
    const imagensEquipeDiarias = [
    "https://classic.exame.com/wp-content/uploads/2025/06/Riva6.jpg",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1332&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1074&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=1147&auto=format&fit=crop"
    ];

    export default function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeBrand, setActiveBrand] = useState('Direcional'); // Tabs: Direcional, Riva, Utilitarios, Guia
    const [fraseDoDia, setFraseDoDia] = useState(frasesMotivacionais[0]);
    const [imagemDoDia, setImagemDoDia] = useState(imagensEquipeDiarias[0]);
    
    // Estados para a aba Guia
    const [openGuiaIndex, setOpenGuiaIndex] = useState(null);

    // === ESTADOS DA IA (GEMINI) ===
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { role: 'bot', content: 'Olá! Sou a IA de apoio aos Destemidos. Como o posso ajudar hoje com detalhes de imóveis ou regras?' }
    ]);
    const [chatInput, setChatInput] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const [generatingPitchId, setGeneratingPitchId] = useState(null);
    const [pitches, setPitches] = useState({});

    // === LÓGICA DE API DA IA (GEMINI) COM RETRY AUTOMÁTICO ===
    const fetchWithRetry = async (url, options, maxRetries = 3) => {
        let delay = 1000;
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(url, options);
                if (response.ok) return response;
                
                // Se a resposta NÃO for ok (ex: 403 Forbidden, 400 Bad Request)
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || `Erro do Google: ${response.status}`;
                
                // Se for erro de permissão ou chave, não tentamos de novo, paramos logo e mostramos o erro!
                if (response.status >= 400 && response.status < 500) {
                    throw new Error(errorMessage);
                }
            } catch (error) {
                // Se o erro já for a mensagem do Google, passamos para a frente
                if (error.message.includes("API key") || i === maxRetries - 1) {
                    throw error;
                }
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
        throw new Error("Falha após várias tentativas de comunicação com a API.");
    };

    // Função 1: Enviar mensagem no Chat
    const handleSendChatMessage = async () => {
        if (!chatInput.trim() || isChatLoading) return;

        const userMessage = chatInput;
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsChatLoading(true);

        const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
        
        // Verificação imediata se a chave está a chegar do Vercel
        if (!apiKey || apiKey === 'undefined') {
            setChatMessages(prev => [...prev, { role: 'bot', content: "❌ ERRO DO VERCEL: A chave 'REACT_APP_GEMINI_API_KEY' está vazia. Verifique as Environment Variables." }]);
            setIsChatLoading(false);
            return;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const systemPrompt = `Você é um assistente virtual especialista em vendas de imóveis da Direcional e Riva, exclusivo para corretores.
        Responda em português. Use estes dados do catálogo para responder: ${JSON.stringify(revistasData)}.
        Seja prestativo, dê respostas curtas e focadas nas dúvidas do corretor.`;

        const formattedContents = chatMessages.slice(1).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));
        formattedContents.push({ role: 'user', parts: [{ text: userMessage }] });

        try {
            const response = await fetchWithRetry(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: formattedContents,
                    systemInstruction: { parts: [{ text: systemPrompt }] }
                })
            });
            const data = await response.json();
            const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui obter uma resposta.";
            setChatMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
        } catch (error) {
            console.error("Erro na API:", error);
            // Agora a IA vai mostrar o ERRO REAL DO GOOGLE!
            setChatMessages(prev => [...prev, { role: 'bot', content: `⚠️ ERRO: ${error.message}` }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    // Função 2: Gerar Argumento de Venda (Pitch)
    const generatePitch = async (revista) => {
        setGeneratingPitchId(revista.id);
        const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
        
        if (!apiKey || apiKey === 'undefined') {
            setPitches(prev => ({ ...prev, [revista.id]: "❌ Erro: Chave da API ausente." }));
            setGeneratingPitchId(null);
            return;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const prompt = `Atue como um especialista em marketing imobiliário. Crie um argumento de venda rápido para o corretor usar com o cliente sobre o imóvel "${revista.title}".
        Região: ${revista.region}. Tamanho: ${revista.size}.
        Forneça exatamente 3 pontos de destaque (bullet points) usando emojis. Seja super conciso e persuasivo. Não inclua textos introdutórios ou conclusões, apenas os 3 tópicos.`;

        try {
            const response = await fetchWithRetry(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                })
            });
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro ao gerar.";
            setPitches(prev => ({ ...prev, [revista.id]: text }));
        } catch (error) {
            console.error("Erro ao gerar pitch:", error);
            // Mostrar o erro REAL do Google
            setPitches(prev => ({ ...prev, [revista.id]: `⚠️ Falha: ${error.message}` }));
        } finally {
            setGeneratingPitchId(null);
        }
    };

    // Auto-scroll para o Chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isChatOpen]);


    useEffect(() => {
        // Inicializa com uma imagem e frase aleatórias
        const randomIndex = Math.floor(Math.random() * imagensEquipeDiarias.length);
        setImagemDoDia(imagensEquipeDiarias[randomIndex]);
        setFraseDoDia(frasesMotivacionais[randomIndex % frasesMotivacionais.length]);

        // Configura o intervalo para trocar de foto e frase a cada 6 segundos
        const interval = setInterval(() => {
        setImagemDoDia(prev => {
            const currIdx = imagensEquipeDiarias.indexOf(prev);
            const nextIdx = (currIdx + 1) % imagensEquipeDiarias.length;
            return imagensEquipeDiarias[nextIdx];
        });
        setFraseDoDia(prev => {
            const currIdx = frasesMotivacionais.indexOf(prev);
            const nextIdx = (currIdx + 1) % frasesMotivacionais.length;
            return frasesMotivacionais[nextIdx];
        });
        }, 6000);

        return () => clearInterval(interval);
    }, []);

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
                    <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase">suporte para o corretor</p>
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

                        {/* --- INTEGRAÇÃO IA: GERADOR DE PITCH --- */}
                        <div className="mb-6 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                            <button 
                                onClick={() => generatePitch(revista)} 
                                disabled={generatingPitchId === revista.id}
                                className="w-full text-sm font-bold text-blue-600 flex items-center justify-center gap-2 hover:text-blue-700 transition-colors disabled:opacity-50"
                            >
                                <Wand2 size={16} className={generatingPitchId === revista.id ? 'animate-spin' : ''} />
                                {generatingPitchId === revista.id ? 'A gerar magia...' : '✨ Gerar Pitch de Venda'}
                            </button>
                            
                            {pitches[revista.id] && (
                                <div className="mt-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed border-t border-slate-200 pt-3">
                                    {pitches[revista.id]}
                                </div>
                            )}
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
                            {msg.content}
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
