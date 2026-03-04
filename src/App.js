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
    cover: "https://www.direcional.com.br/wp-content/uploads/2025/06/Perspectiva-Guarita-BrisasdoHorizonte.jpg.webp", 
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
    cover: "https://www.direcional.com.br/wp-content/uploads/2024/05/Perspectiva_PARQUEVILLEORQUIDEA_GUARITA.jpg.webp", 
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
    cover: "https://www.direcional.com.br/wp-content/uploads/2024/09/Perspectiva-Guarita-VillageTorres.jpg.webp", 
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
    cover: "https://www.direcional.com.br/wp-content/uploads/2024/03/Conquista-Jardim-Botanico-Guarita.jpg.webp", 
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
    cover: "https://www.direcional.com.br/wp-content/uploads/2025/05/Perspectiva-Guarita-VivaVidaCoral.jpg.webp",
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
    cover: "https://www.direcional.com.br/wp-content/uploads/2024/12/Perspectiva-Guarita-ConquistaJardimNorte.jpg.webp",
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
    cover: "https://www.direcional.com.br/wp-content/uploads/2023/07/Guarita-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp",
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
    cover: "https://www.direcional.com.br/wp-content/uploads/2025/11/fachada-noturna-parque-ville-lirio-azul.jpg.webp",
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
    cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2023/11/fachada-noturna_amazon-boulevard-classic.jpg.webp",
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
    cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2025/06/guarita-Amazon-prime-boulevard-riva.jpg.webp",
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
    cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2025/08/citta-azzure_GUARITA.jpg.webp",
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
    cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2024/08/Perspectiva-Guarita-ZenithCondominioClube.webp",
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
    cover: "https://www.direcional.com.br/wp-content/uploads/2023/04/Guarita-Conquista-Topazio-Direcional.jpg.webp",
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
    cover: "https://www.direcional.com.br/wp-content/uploads/2022/11/Guarita-Conquista-Rio-Negro-Direcional.jpg.webp",
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
    cover: "https://www.direcional.com.br/wp-content/uploads/2025/02/Perspectiva-Guarita-VivaVidaRioTapajos.jpg.webp",
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
    return localStorage.getItem('aguiaHubHero') || "https://drive.google.com/file/d/1HquUICaxy9RcexJM1TLp8FkZQXegsn-I/view?usp=sharing";
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
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

