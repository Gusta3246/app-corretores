import React, { useState, useEffect } from 'react';
import { Search, Building, ExternalLink, MapPin, BookOpen, Maximize, Bed, LayoutGrid, Trophy, Quote, Sparkles, Rocket, Bot, X, MessageCircle, Copy, CheckCircle2, Edit3, Save, Image as ImageIcon, Upload, Plus, Calculator } from 'lucide-react';

// === DADOS DAS REVISTAS ===
const revistasData = [
  {
    id: 1,
    title: "Brisas do Horizonte",
    brand: "Direcional",
    region: "Coroado - Zona Leste",
    size: "43m² a 45m²",
    bedrooms: "2 quartos",
    flooring: "Todo o apê",
    cover: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400", 
    link: "https://drive.google.com/file/d/18IXtAt9PLVjIsk2PkXIHXnVCaduVkGu2/view?usp=drive_link" 
  },
  {
    id: 2,
    title: "Parque Ville Orquídea",
    brand: "Direcional",
    region: "Lago Azul - Zona Norte",
    size: "41m²",
    bedrooms: "2 quartos",
    flooring: "Todo o apê",
    cover: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400", 
    link: "https://drive.google.com/file/d/1F_BeT2jceDM8u4kCbSXN8kp2rk7boQTG/view?usp=drive_link" 
  },
  {
    id: 3,
    title: "Village Torres",
    brand: "Direcional",
    region: "Lago Azul - Zona Norte",
    size: "36m²",
    bedrooms: "2 quartos",
    flooring: "Cozinha, banheiro e lavatório",
    cover: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400", 
    link: "https://drive.google.com/file/d/1blVconA5fjODxvXB7s8KT6dSlX8KpLLv/view?usp=drive_link" 
  },
  {
    id: 4,
    title: "Conquista Jardim Botânico",
    brand: "Direcional",
    region: "Nova Cidade - Zona Norte",
    size: "40m²",
    bedrooms: "2 quartos",
    flooring: "Cozinha, banheiro e lavatório",
    cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400", 
    link: "https://drive.google.com/file/d/1TYzIq8RuGORXfxQpH8CGZejTjF_GlUz0/view?usp=drive_link" 
  },
  {
    id: 5,
    title: "Viva Vida Coral",
    brand: "Direcional",
    region: "Colônia Terra Nova - Zona Norte",
    size: "41m² a 51m²",
    bedrooms: "2 quartos",
    flooring: "Cozinha, banheiro e lavatório",
    cover: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&q=80&w=400",
    link: "https://drive.google.com/file/d/1lYo3otquzwdnD0r5f6JobBbW-6KmGOF4/view?usp=drive_link" 
  },
  {
    id: 6,
    title: "Conquista Jardim Norte",
    brand: "Direcional",
    region: "Santa Etelvina - Zona Norte",
    size: "36m²",
    bedrooms: "2 quartos",
    flooring: "Cozinha, banheiro e lavatório",
    cover: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400",
    link: "https://drive.google.com/file/d/1_Hyb72NWl1HjEiabKLL9m5ZMutHExesY/view?usp=drive_link" 
  },
  {
    id: 7,
    title: "Viva Vida Rio Amazonas",
    brand: "Direcional",
    region: "Tarumã - Zona Oeste",
    size: "36m²",
    bedrooms: "2 quartos",
    flooring: "Cozinha, banheiro e lavatório",
    cover: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
    link: "https://drive.google.com/" 
  },
  {
    id: 8,
    title: "Bosque das Torres",
    brand: "Direcional",
    region: "Lago Azul - Zona Norte",
    size: "36m²",
    bedrooms: "2 quartos",
    flooring: "Cozinha, banheiro e lavatório",
    cover: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
    link: "https://drive.google.com/file/d/1lPnNQuxlPkKOcW2JqOB7KEWsaQVpZzcU/view?usp=drive_link" 
  },
  {
    id: 9,
    title: "Parque Ville Lírio Azul",
    brand: "Direcional",
    region: "Lago Azul - Zona Norte",
    size: "41m²",
    bedrooms: "2 quartos",
    flooring: "Cozinha, banheiro e lavatório",
    cover: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400",
    link: "https://drive.google.com/file/d/1fc7AXap6nhkpTlxONsm46WJCKxIWIhwe/view?usp=drive_link" 
  },
  {
    id: 10,
    title: "Amazon Boulevard Classic",
    brand: "Riva",
    region: "Bairro da Paz - Zona Centro-Oeste",
    size: "36m² a 48m²",
    bedrooms: "2 quartos",
    flooring: "Todo o apê",
    cover: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
    link: "https://drive.google.com/file/d/1ZX37T2S8FlHnSiO-yeAjlFyqq_5-dVzx/view?usp=drive_link" 
  },
  {
    id: 11,
    title: "Amazon Boulevard Prime",
    brand: "Riva",
    region: "Novo Israel - Zona Norte",
    size: "51m² a 70m²",
    bedrooms: "2 e 3 quartos",
    flooring: "Todo o apê",
    cover: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
    link: "https://drive.google.com/file/d/1aIuBlwLYGStUm7DNE3gCbfu3Ty2JmkGM/view?usp=drive_link" 
  },
  {
    id: 12,
    title: "Città Oasis Azzure",
    brand: "Riva",
    region: "Flores - Zona Centro-Sul",
    size: "48m² a 49m²",
    bedrooms: "2 e 3 quartos",
    flooring: "Todo o apê",
    // Teste com o link do drive que você enviou
    cover: "https://drive.google.com/uc?export=view&id=1ofMBN2ITgF_BzMtvXp3j4FKex2SHFe_R",
    link: "https://drive.google.com/" 
  },
  {
    id: 13,
    title: "Zenith Condomínio Clube",
    brand: "Riva",
    region: "São Francisco - Zona Sul",
    size: "48m² a 49m²",
    bedrooms: "2 e 3 quartos",
    flooring: "Todo o apê",
    cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400",
    link: "https://drive.google.com/file/d/1wv_v56T2ACEHtPZF-iRBvEWY2VVdUXxu/view?usp=drive_link" 
  },
  {
    id: 14,
    title: "Conquista Topázio",
    brand: "Direcional",
    region: "Colônia Terra Nova - Zona Norte",
    size: "41m² a 51m²",
    bedrooms: "1 e 2 quartos",
    flooring: "Todo o apê",
    cover: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&q=80&w=400",
    link: "https://drive.google.com/file/d/1SMIfr9HbfLd06UaDLKbMUxxtuh4cPPEM/view?usp=drive_link"
  },
  {
    id: 16,
    title: "Conquista Rio Negro",
    brand: "Direcional",
    region: "Zona Oeste",
    size: "36m²",
    bedrooms: "2 quartos",
    flooring: "Cozinha, banheiro e lavatório",
    cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400",
    link: "https://drive.google.com/file/d/1pHLQwUSn6BDMfLo7fFGonyyWlgtXwNmy/view?usp=drive_link"
  },
  {
    id: 17,
    title: "Viva Vida Rio Tapajós",
    brand: "Direcional",
    region: "Tarumã - Zona Oeste",
    size: "40m²",
    bedrooms: "2 quartos",
    flooring: "Cozinha, banheiro e lavatório",
    cover: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400",
    link: "https://drive.google.com/file/d/1k3TOypf5bm_zXPfc-ulb7vY9e7MKxmlk/view?usp=drive_link"
  }
];

// === FRASES MOTIVACIONAIS DIÁRIAS ===
const frasesMotivacionais = [
  { texto: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", autor: "Robert Collier" },
  { texto: "Não vendemos apenas imóveis, nós entregamos as chaves para novos sonhos e recomeços.", autor: "Equipe Águia" },
  { texto: "A oportunidade não bate à porta, ela se apresenta quando você a constrói com muito trabalho.", autor: "Chris Grosser" },
  { texto: "Seu limite não é o mercado, é a sua própria mente. Voe alto!", autor: "Motivação Águia" },
  { texto: "Um cliente satisfeito é a melhor estratégia de negócios que existe.", autor: "Michael LeBoeuf" },
  { texto: "Não espere por condições perfeitas. O momento de fazer acontecer é agora.", autor: "George Bernard Shaw" },
  { texto: "O " + '"' + "não" + '"' + " você já tem. O " + '"' + "sim" + '"' + " está na próxima ligação, na próxima visita, no próximo cliente.", autor: "Sabedoria de Vendas" },
  { texto: "Vender é construir uma ponte de confiança entre a necessidade do cliente e a solução que você oferece.", autor: "Equipe Águia" },
  { texto: "A sorte acompanha quem trabalha duro. Que hoje seja um dia de muitos fechamentos!", autor: "Motivação Águia" },
  { texto: "Corretor de sucesso é aquele que escuta mais do que fala e resolve mais do que promete.", autor: "Anônimo" }
];

export default function App() {
  const [properties, setProperties] = useState(() => {
    const savedProperties = localStorage.getItem('aguiaHubProperties');
    if (savedProperties) {
      return JSON.parse(savedProperties);
    }
    return revistasData;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeBrand, setActiveBrand] = useState('Direcional');
  const [fraseDoDia, setFraseDoDia] = useState(frasesMotivacionais[0]);

  // Novos Estados para a Capa de Inspiração
  const [heroImage, setHeroImage] = useState(() => {
    return localStorage.getItem('aguiaHubHero') || "https://drive.google.com/uc?export=view&id=1HquUICaxy9RcexJM1TLp8FkZQXegsn-I";
  });
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [newHeroUrl, setNewHeroUrl] = useState('');

  // Novos Estados para Adicionar Revista
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRevista, setNewRevista] = useState({
    title: '', brand: 'Direcional', region: '', size: '', bedrooms: '', flooring: '', cover: '', link: ''
  });

  // Novos Estados para Edição de Capa das Revistas
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [isEditCoverModalOpen, setIsEditCoverModalOpen] = useState(false);
  const [editCoverUrl, setEditCoverUrl] = useState('');

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [clientProfile, setClientProfile] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('aguiaHubProperties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('aguiaHubHero', heroImage);
  }, [heroImage]);

  useEffect(() => {
    const diaAtual = new Date().getDate();
    const indiceFrase = diaAtual % frasesMotivacionais.length;
    setFraseDoDia(frasesMotivacionais[indiceFrase]);
  }, []);

  const filteredRevistas = properties.filter(revista => {
    const matchesSearch = revista.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          revista.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = revista.brand === activeBrand;
    return matchesSearch && matchesBrand;
  });

  const generateAiMessage = async () => {
    if (!clientProfile.trim()) {
      alert("Por favor, digite um breve perfil do cliente.");
      return;
    }

    setIsGenerating(true);
    setAiMessage('');
    setCopySuccess(false);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const prompt = `Você é um corretor de imóveis de alta performance da 'Equipe Águia' em Manaus, vendendo imóveis das construtoras Direcional e Riva. 
    Sua missão é escrever uma mensagem de WhatsApp altamente persuasiva, amigável e focada em conversão para enviar a um cliente.
    
    Dados do Imóvel que você está oferecendo:
    - Nome: ${selectedProperty.title}
    - Construtora: ${selectedProperty.brand}
    - Região: ${selectedProperty.region}
    - Quartos: ${selectedProperty.bedrooms}
    - Tamanho: ${selectedProperty.size}
    - Acabamento: ${selectedProperty.flooring}

    Perfil ou necessidade do Cliente:
    "${clientProfile}"

    Regras para a mensagem:
    1. Seja natural, caloroso e use gatilhos mentais.
    2. Conecte os benefícios diretamente com a necessidade.
    3. Use emojis adequados.
    4. Termine com uma chamada para ação clara (simulação ou visita).
    5. Não crie informações falsas de preço.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: "Você é um assistente de vendas especialista." }] }
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        setAiMessage(data.candidates[0].content.parts[0].text);
      } else {
        setAiMessage("Ops! A IA teve um pequeno tropeço. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro:", error);
      setAiMessage("Erro de conexão. Verifique a internet.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiMessage);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const openAiModal = (property) => {
    setSelectedProperty(property);
    setClientProfile('');
    setAiMessage('');
    setCopySuccess(false);
    setIsAiModalOpen(true);
  };

  // Funções para Editar a Capa de Inspiração
  const openHeroModal = () => {
    setNewHeroUrl(heroImage);
    setIsHeroModalOpen(true);
  };

  const handleHeroUrlChange = (e) => {
    setNewHeroUrl(e.target.value);
  };

  const handleHeroImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200; // Maior para a capa principal
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setNewHeroUrl(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const saveHeroImage = () => {
    setHeroImage(newHeroUrl);
    setIsHeroModalOpen(false);
  };

  // Funções para Adicionar Nova Revista
  const handleAddRevistaChange = (field, value) => {
    setNewRevista(prev => ({ ...prev, [field]: value }));
  };

  const handleAddRevistaImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        handleAddRevistaChange('cover', canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const saveNewRevista = () => {
    if (!newRevista.title || !newRevista.link) {
      alert("Por favor, preencha pelo menos o Título e o Link do PDF.");
      return;
    }
    
    const newId = properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1;
    const revistaToAdd = { 
      ...newRevista, 
      id: newId,
      cover: newRevista.cover || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400"
    };
    
    setProperties([revistaToAdd, ...properties]);
    setIsAddModalOpen(false);
    setNewRevista({ title: '', brand: 'Direcional', region: '', size: '', bedrooms: '', flooring: '', cover: '', link: '' });
  };

  // Funções para Editar Capa de uma Revista Específica
  const openEditCoverModal = (property) => {
    setEditingPropertyId(property.id);
    setEditCoverUrl(property.cover);
    setIsEditCoverModalOpen(true);
  };

  const handleEditCoverUrlChange = (e) => {
    setEditCoverUrl(e.target.value);
  };

  const handleEditCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setEditCoverUrl(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const saveCoverImage = () => {
    setProperties(properties.map(p => 
      p.id === editingPropertyId ? { ...p, cover: editCoverUrl } : p
    ));
    setIsEditCoverModalOpen(false);
    setEditingPropertyId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-900 p-2 rounded-lg text-white shadow-md">
                <Rocket size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">Equipe Águia</h1>
                <p className="text-sm font-medium text-slate-500">Gerente Rafa Mourão</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nome ou bairro..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 sm:px-4 sm:py-2 rounded-lg font-bold transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
                title="Adicionar Nova Revista"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Adicionar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="mb-10 relative rounded-2xl overflow-hidden shadow-lg group">
          <button
            onClick={openHeroModal}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2.5 rounded-full shadow-md transition-all z-20 backdrop-blur-sm border border-white/20"
            title="Editar Imagem de Inspiração"
          >
            <Edit3 size={20} />
          </button>
          <img 
            src={heroImage} 
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200' }}
            alt="Equipe Águia Celebrando" 
            className="w-full h-64 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-1000 bg-slate-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end p-6 sm:p-8">
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

        <div className="border-b border-gray-200 mb-8 overflow-x-auto">
          <nav className="-mb-px flex space-x-6 sm:space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveBrand('Direcional')}
              className={`whitespace-nowrap py-4 px-2 border-b-2 transition-colors flex items-center ${
                activeBrand === 'Direcional'
                  ? 'border-blue-900'
                  : 'border-transparent hover:border-gray-300'
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
                activeBrand === 'Riva'
                  ? 'border-indigo-950'
                  : 'border-transparent hover:border-gray-300'
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
              className="whitespace-nowrap py-4 px-2 border-b-2 border-transparent hover:border-gray-300 transition-colors flex items-center"
              title="Abrir Simulador da Caixa"
            >
              <div className="flex items-center transition-all opacity-50 grayscale hover:grayscale-0 hover:opacity-100">
                <span className="text-emerald-700 font-black text-lg tracking-tight">SIMULADOR</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 ml-1 rounded-sm"></span>
              </div>
            </a>
          </nav>
        </div>

        {filteredRevistas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-900">Nenhum material encontrado</h3>
            <p className="text-slate-500">Tente buscar por outro nome ou bairro.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRevistas.map((revista) => (
            <div 
              key={revista.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  src={revista.cover} 
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400';
                  }}
                  alt={`Capa do empreendimento ${revista.title}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditCoverModal(revista);
                  }}
                  className="absolute top-3 left-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="Editar Capa da Revista"
                >
                  <Edit3 size={16} />
                </button>

                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                    revista.brand === 'Direcional' 
                      ? 'bg-blue-900 text-white' 
                      : 'bg-indigo-950 text-white'
                  }`}>
                    {revista.brand}
                  </span>
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
                      revista.brand === 'Direcional'
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-indigo-950 hover:bg-indigo-900 text-white' 
                    }`}
                  >
                    Acessar Revista (PDF)
                    <ExternalLink size={18} />
                  </a>
                  
                  <button 
                    onClick={() => openAiModal(revista)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors duration-200 shadow-sm"
                  >
                    <Sparkles size={18} className="text-amber-500" />
                    Gerar Mensagem de Venda com IA
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* MODAL DA INTELIGÊNCIA ARTIFICIAL */}
      {isAiModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Assistente IA da Equipe Águia</h3>
                  <p className="text-amber-100 text-sm">Criando script para: {selectedProperty.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAiModalOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Qual o perfil ou necessidade do cliente?
                </label>
                <textarea 
                  className="w-full border border-slate-300 rounded-xl p-3 text-slate-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
                  rows="3"
                  placeholder="Ex: Casal recém-casado, buscando o primeiro imóvel com segurança."
                  value={clientProfile}
                  onChange={(e) => setClientProfile(e.target.value)}
                />
              </div>

              <button
                onClick={generateAiMessage}
                disabled={isGenerating || !clientProfile.trim()}
                className={`w-full py-3 rounded-xl font-bold text-white flex justify-center items-center gap-2 shadow-md transition-all ${
                  isGenerating || !clientProfile.trim() 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-500 hover:from-amber-600 to-orange-500 hover:to-orange-600 hover:shadow-lg'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    A IA está digitando...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Gerar Mensagem Matadora
                  </>
                )}
              </button>

              {aiMessage && (
                <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl p-4 relative">
                  <div className="flex items-center gap-2 mb-3 text-emerald-700 font-semibold border-b border-slate-200 pb-2">
                    <MessageCircle size={18} />
                    Mensagem Pronta para o WhatsApp:
                  </div>
                  
                  <div className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed pb-12">
                    {aiMessage}
                  </div>

                  <button
                    onClick={copyToClipboard}
                    className={`absolute bottom-4 right-4 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition-colors shadow-sm ${
                      copySuccess 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {copySuccess ? (
                      <>
                        <CheckCircle2 size={16} />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copiar Texto
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO DA IMAGEM DE INSPIRAÇÃO */}
      {isHeroModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <ImageIcon size={24} className="text-amber-400" />
                <div>
                  <h3 className="font-bold text-lg">Alterar Imagem de Inspiração</h3>
                </div>
              </div>
              <button 
                onClick={() => setIsHeroModalOpen(false)}
                className="text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                <label className="flex items-center gap-2 text-sm font-bold text-green-800 mb-3">
                  <Upload size={18} />
                  Faça Upload da Galeria
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer"
                />
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">OU USAR LINK</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">URL (Link) da imagem:</label>
                <input 
                  type="text"
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Cole o link aqui..."
                  value={newHeroUrl}
                  onChange={handleHeroUrlChange}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsHeroModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveHeroImage}
                  className="px-5 py-2.5 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
                >
                  <Save size={18} />
                  Guardar Imagem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ADICIONAR NOVA REVISTA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-blue-900 px-6 py-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <Plus size={24} className="text-blue-200" />
                <div>
                  <h3 className="font-bold text-lg">Adicionar Nova Revista</h3>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Título do Empreendimento *</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500" placeholder="Ex: Residencial Flores" value={newRevista.title} onChange={(e) => handleAddRevistaChange('title', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Construtora</label>
                  <select className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500" value={newRevista.brand} onChange={(e) => handleAddRevistaChange('brand', e.target.value)}>
                    <option value="Direcional">Direcional</option>
                    <option value="Riva">Riva</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Região / Bairro</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500" placeholder="Ex: Flores - Zona Centro-Sul" value={newRevista.region} onChange={(e) => handleAddRevistaChange('region', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tamanho</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500" placeholder="Ex: 48m² a 49m²" value={newRevista.size} onChange={(e) => handleAddRevistaChange('size', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Quartos</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500" placeholder="Ex: 2 e 3 quartos" value={newRevista.bedrooms} onChange={(e) => handleAddRevistaChange('bedrooms', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Acabamento</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500" placeholder="Ex: Todo o apê" value={newRevista.flooring} onChange={(e) => handleAddRevistaChange('flooring', e.target.value)} />
                </div>
              </div>

              <div className="mt-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Link do PDF da Revista *</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-700 outline-none focus:border-blue-500" placeholder="Cole o link do Drive/PDF aqui" value={newRevista.link} onChange={(e) => handleAddRevistaChange('link', e.target.value)} />
              </div>

              <div className="mt-2 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <label className="block text-sm font-bold text-slate-700 mb-2">Foto da Capa (Opcional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleAddRevistaImageUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {newRevista.cover && (
                  <div className="mt-3 h-32 w-full rounded-lg overflow-hidden border border-slate-200">
                    <img src={newRevista.cover} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveNewRevista}
                  className="px-5 py-2.5 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
                >
                  <Save size={18} />
                  Adicionar Revista
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO DE CAPA DA REVISTA */}
      {isEditCoverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <ImageIcon size={24} className="text-amber-400" />
                <div>
                  <h3 className="font-bold text-lg">Alterar Capa do Imóvel</h3>
                </div>
              </div>
              <button 
                onClick={() => setIsEditCoverModalOpen(false)}
                className="text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <label className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-3">
                  <Upload size={18} />
                  Faça Upload da Galeria
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleEditCoverImageUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                />
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">OU USAR LINK</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">URL (Link) da imagem:</label>
                <input 
                  type="text"
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Cole o link aqui..."
                  value={editCoverUrl}
                  onChange={handleEditCoverUrlChange}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsEditCoverModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveCoverImage}
                  className="px-5 py-2.5 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
                >
                  <Save size={18} />
                  Salvar Nova Capa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );

}

