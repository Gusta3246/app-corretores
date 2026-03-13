import React, { useState, useEffect, useRef } from 'react';
import { Search, Building, ExternalLink, MapPin, BookOpen, Maximize, Bed, LayoutGrid, Rocket, Quote, Sparkles, ChevronDown, ChevronUp, ChevronLeft, FileText, TableProperties, BookMarked, HelpCircle, Calculator, Bot, X, Send, Wand2, Paperclip, File as FileIcon, Trash2, FolderPlus, GripVertical, Plus, MessageCircle, Moon, Sun, AlertTriangle, Book } from 'lucide-react';
import { buscarRespostaDoRobo, buscarRespostaGemini } from './bot/dadosFinanciamento.js';
// === DADOS DAS REVISTAS E BASE DE CONHECIMENTO DO CHATBOT ===
const revistasData = [
    { id: 1, title: "Brisas do Horizonte", brand: "Direcional", region: "Coroado - Zona Leste", size: "43m² a 45m²", bedrooms: "2 quartos", flooring: "Todo o apê", cover: "https://www.direcional.com.br/wp-content/uploads/2025/06/Perspectiva-Guarita-BrisasdoHorizonte.jpg.webp", link: "https://drive.google.com/file/d/18IXtAt9PLVjIsk2PkXIHXnVCaduVkGu2/view?usp=drive_link", aliases: ["brisas", "brisas do horizonte", "horizonte"], pois: ["Supermercado Vitória (1 min)", "Escola Mun. Profª Maria Rodrigues Tapajós (2 min)", "SPA Coroado (3 min)", "Estádio Carlos Zamith (5 min)", "Park Mall Ephigênio Salles (6 min)", "UFAM - Universidade Federal do Amazonas (7 min)", "Hospital Dr. João Lúcio (7 min)", "Samel São José Medical Center (7 min)", "Sesi Clube do Trabalhador (8 min)", "Manauara Shopping (14 min)"] },
    { id: 2, title: "Parque Ville Orquídea", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "41m²", bedrooms: "2 quartos", flooring: "Todo o apê", cover: "https://www.direcional.com.br/wp-content/uploads/2024/05/Perspectiva_PARQUEVILLEORQUIDEA_GUARITA.jpg.webp", link: "https://drive.google.com/file/d/1F_BeT2jceDM8u4kCbSXN8kp2rk7boQTG/view?usp=drive_link", aliases: ["orquidea", "orquídea", "parque ville", "parque ville orquidea"], pois: ["Escola Mun. Viviane Estrela (1-2 min)", "Clínica da Família C. Nicolau (1-2 min)", "Veneza Express (3-4 min)", "Nova Era Supermercado (3-4 min)", "Terminal 6 (3-4 min)", "Colégio Militar da PM VI (3-4 min)", "Shopping Via Norte (7 min)", "Hospital Delphina Aziz (10 min)", "Sumaúma Park Shopping (12 min)"] },
    { id: 3, title: "Village Torres", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2024/09/Perspectiva-Guarita-VillageTorres.jpg.webp", link: "https://drive.google.com/file/d/1blVconA5fjODxvXB7s8KT6dSlX8KpLLv/view?usp=drive_link", aliases: ["village", "village torres", "torres"], pois: ["Supermercado Nova Era", "Shopping Via Norte", "Sumaúma Park Shopping", "Atacadão"] },
    { id: 4, title: "Conquista Jardim Botânico", brand: "Direcional", region: "Nova Cidade - Zona Norte", size: "40m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2024/03/Conquista-Jardim-Botanico-Guarita.jpg.webp", link: "https://drive.google.com/file/d/1TYzIq8RuGORXfxQpH8CGZejTjF_GlUz0/view?usp=drive_link", aliases: ["botanico", "botânico", "jardim botanico", "conquista jardim"], pois: ["MUSA (Museu da Amazônia / Jardim Botânico)", "Shopping Via Norte", "Supermercado DB Nova Cidade", "SPA Galiléia"] },
    { id: 5, title: "Viva Vida Coral", brand: "Direcional", region: "Colônia Terra Nova - Zona Norte", size: "41m² a 51m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2025/05/Perspectiva-Guarita-VivaVidaCoral.jpg.webp", link: "https://drive.google.com/file/d/1lYo3otquzwdnD0r5f6JobBbW-6KmGOF4/view?usp=drive_link", aliases: ["coral", "viva vida coral", "viva vida"], pois: ["Shopping Via Norte", "Loja Havan", "Atacadão", "Hospital Delphina Aziz", "Posto Atem (famoso na entrada do bairro)"] },
    { id: 6, title: "Conquista Jardim Norte", brand: "Direcional", region: "Santa Etelvina - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2024/12/Perspectiva-Guarita-ConquistaJardimNorte.jpg.webp", link: "https://drive.google.com/file/d/1_Hyb72NWl1HjEiabKLL9m5ZMutHExesY/view?usp=drive_link", aliases: ["jardim norte", "santa etelvina", "conquista norte"], pois: ["Shopping Via Norte (1 min)", "Havan (1 min)", "Fun Park (1 min)", "Nova Era Supermercado (1 min)", "UBS Sálvio Belota (2 min)", "Feira do Santa Etelvina (2 min)", "Terminal 06 (5 min)", "15º Distrito Policial (5-7 min)", "Hiper DB (5-7 min)", "Hospital Delphina Aziz", "Escola Dra. Viviane Estrela"] },
    { id: 7, title: "Viva Vida Rio Amazonas", brand: "Direcional", region: "Tarumã - Zona Oeste", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2023/07/Guarita-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp", link: "https://drive.google.com/", aliases: ["amazonas", "rio amazonas", "viva vida rio amazonas"], pois: ["Aeroporto Internacional Eduardo Gomes", "Orla da Ponta Negra", "Sivam (Sistema de Vigilância da Amazônia)", "Sipam", "Supermercado Veneza"] },
    { id: 8, title: "Bosque das Torres", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2025/10/portaria-bosque-das-torres.jpg.webp", link: "https://drive.google.com/file/d/1lPnNQuxlPkKOcW2JqOB7KEWsaQVpZzcU/view?usp=drive_link", aliases: ["bosque", "bosque das torres"], pois: ["Supermercado Nova Era (Torres)", "Sumaúma Park Shopping", "Parque do Mindu", "Faculdade Estácio (polo próximo)"] },
    { id: 9, title: "Parque Ville Lírio Azul", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "41m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", cover: "https://www.direcional.com.br/wp-content/uploads/2025/11/fachada-noturna-parque-ville-lirio-azul.jpg.webp", link: "https://drive.google.com/file/d/1fc7AXap6nhkpTlxONsm46WJCKxIWIhwe/view?usp=drive_link", aliases: ["lirio", "lírio", "lirio azul", "parque ville lirio"], pois: ["Escola Integral João S. Braga (1 min)", "Colégio Militar da PM VI (2 min)", "Escola Est. Eliana Braga (2 min)", "Nova Era Supermercado (2 min)", "Clínica da Família C. Gracie (2 min)", "UBS José Fligliuolo (4 min)", "Clínica da Família C. Nicolau (4 min)", "Terminal 6 e 7 (4 min)", "Shopping Via Norte / Havan / Fun Park (7 min)", "Hospital Delphina Aziz (8 min)"] },
    { id: 10, title: "Amazon Boulevard Classic", brand: "Riva", region: "Bairro da Paz - Zona Centro-Oeste", size: "44m² a 69,78m²", bedrooms: "2 quartos", flooring: "Todo o apê", cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2023/11/fachada-noturna_amazon-boulevard-classic.jpg.webp", link: "https://drive.google.com/file/d/1ZX37T2S8FlHnSiO-yeAjlFyqq_5-dVzx/view?usp=drive_link", aliases: ["classic", "amazon boulevard", "boulevard", "boulevard classic"], pois: ["Arena da Amazônia", "Amazonas Shopping", "Carrefour Hipermercado", "UNIP (Universidade Paulista)", "Terminal Rodoviário de Manaus", "Hospital Tropical (Fundação de Medicina Tropical)"] },
    { id: 11, title: "Amazon Boulevard Prime", brand: "Riva", region: "Bairro da Paz - Zona Centro-Oeste", size: "51m² a 90,39m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2025/06/guarita-Amazon-prime-boulevard-riva.jpg.webp", link: "https://drive.google.com/file/d/1aIuBlwLYGStUm7DNE3gCbfu3Ty2JmkGM/view?usp=drive_link", aliases: ["prime", "amazon prime", "boulevard prime"], pois: ["Arena da Amazônia", "Sambódromo", "Hipermercado Carrefour", "La Parilla Restaurante", "Aeroclub", "Petz", "Clube Municipal (ao lado)", "Vila Olímpica", "Drogaria Bom Preço", "Drogaria Santo Remédio"] },
    { id: 12, title: "Città Oasis Azzure", brand: "Riva", region: "Flores - Zona Centro-Sul", size: "48m² a 75m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2025/08/citta-azzure_GUARITA.jpg.webp", link: "https://drive.google.com/file/d/1Y-fT6UbQ-OopqVaV0POgHRIdlayMXMOB/view?usp=sharing", aliases: ["citta", "città", "azzure", "oasis", "oasis azzure"], pois: ["Universidade Nilton Lins", "Laranjeiras Restaurante (polo gastronômico)", "Sushi Ponta Negra", "Domes Burgers", "Di Fiori - Casa de Massas e Pizzas", "Na Lenha Pizzaria", "Drogaria Santo Remédio", "Supermercado Atack (Laranjeiras)", "Sollarium Mall"] },
    { id: 13, title: "Zenith Condomínio Clube", brand: "Riva", region: "São Francisco - Zona Sul", size: "48m² a 49m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", cover: "https://www.rivaincorporadora.com.br/wp-content/uploads/2024/08/Perspectiva-Guarita-ZenithCondominioClube.webp", link: "https://drive.google.com/file/d/1wv_v56T2ACEHtPZF-iRBvEWY2VVdUXxu/view?usp=drive_link", aliases: ["zenith", "zenith condominio"], pois: ["Manauara Shopping", "Fórum Ministro Henoch Reis", "Tribunal de Justiça (TJ-AM)", "Hospital Check Up", "Colégio Martha Falcão", "Faculdade Martha Falcão", "Faculdade Estácio"] },
    { id: 14, title: "Conquista Topázio", brand: "Direcional", region: "Colônia Terra Nova - Zona Norte", size: "41m² a 51m²", bedrooms: "1 e 2 quartos", flooring: "Todo o apê", cover: "https://www.direcional.com.br/wp-content/uploads/2023/04/Guarita-Conquista-Topazio-Direcional.jpg.webp", link: "https://drive.google.com/file/d/1SMIfr9HbfLd06UaDLKbMUxxtuh4cPPEM/view?usp=drive_link", aliases: ["topazio", "topázio", "conquista topazio"], pois: ["Allegro Mall (vizinho)", "Shopping Via Norte", "Atacadão", "Loja Havan", "SPA da Colônia Terra Nova"] },
    { id: 16, title: "Conquista Rio Negro", brand: "Direcional", region: "Ponta Negra - Zona Oeste", size: "41m²", bedrooms: "2 quartos", flooring: "Todo o apê", cover: "https://www.direcional.com.br/wp-content/uploads/2022/11/Guarita-Conquista-Rio-Negro-Direcional.jpg.webp", link: "https://drive.google.com/file/d/1pHLQwUSn6BDMfLo7fFGonyyWlgtXwNmy/view?usp=drive_link", aliases: ["negro", "rio negro", "conquista rio negro"], pois: ["Shopping Ponta Negra", "DB Ponta Negra", "Orla 92 Mall", "Supermercado Veneza", "Orla da Ponta Negra", "Praia Dourada", "Marina Tauá", "Balneário do SESC", "Aeroporto Eduardo Gomes", "Policlínica José Lins", "Colégio Século"] },
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
    { title: "AMML - DECLA. ESTADO CIVIL", link: "https://drive.google.com/file/d/1f5aC4XStNfCKuu6NK2_EetP2DHpbF_0p/view?usp=sharing" },
    { title: "FICHA CADASTRO PF - CLIENTE INFORMAL", link: "https://drive.google.com/file/d/1Y5h9B3oe8HdoU7EGJwkcEerQACIaGAAG/view?usp=drive_link" }
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
    "https://i.postimg.cc/fWKLcg3X/Copia-de-IMG-9919.avif",
    "https://i.postimg.cc/3NHYhYXz/Copia-de-IMG-1227.jpg",
    "https://i.postimg.cc/gkCrJbYL/Copia-de-IMG-5647.jpg",
    "https://i.postimg.cc/52Gc1f1z/Chat-GPT-Image-12-de-mar-de-2026-12-31-34-(1).jpg",
    "https://i.postimg.cc/2SJpmCmT/Copia-de-IMG-9690.jpg",
    "https://i.postimg.cc/3x6M737F/IMG-0459.jpg",
    "https://i.postimg.cc/NjKVdZTC/c8a258dc-090d-4c52-957f-529a2dc897ca.jpg",
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
    const haptic = (style = 'light') => {
        if (!navigator.vibrate) return;
        const p = { light: 10, medium: 25, heavy: 40, success: [10, 50, 10] };
        navigator.vibrate(p[style] || 10);
    };
    // --- LÓGICA DO ROBÔ DE VENDAS ---
  const obterRespostaDoBot = (mensagem) => {
    const texto = mensagem.toLowerCase();

    // Resposta para DOCUMENTOS (Baseado nas fotos que você enviou)
    if (texto.includes("documento") || texto.includes("papel") || texto.includes("precisa")) {
      if (texto.includes("autonomo")) {
        return "Para Autônomos, os documentos são: RG/CPF, Estado Civil, Residência, Carteira Digital, 6 últimos extratos bancários e Imposto de Renda.";
      }
      if (texto.includes("servidor")) {
        return "Para Servidor Público: RG/CPF, Certidão de Nascimento/Casamento, Residência atualizado, 3 últimos contracheques e Imposto de Renda (se houver).";
      }
      return "Para CLT (Carteira Assinada): RG/CPF, Estado Civil, Residência, Carteira Digital, 3 últimos contracheques e Imposto de Renda.";
    }

    // Resposta para TABELAS
    if (texto.includes("investidor")) {
      return "Na Tabela Investidor, o ato é facilitado e o saldo é parcelado sem juros ou correção durante a obra!";
    }
    
    if (texto.includes("financiamento") || texto.includes("direto")) {
      return "Temos a opção de Financiamento Direto com a construtora em até 120 meses após a obra!";
    }

    // Resposta padrão caso ele não entenda
    return "Ainda estou aprendendo sobre esse detalhe. Posso te ajudar com documentos para análise ou informações das tabelas?";
  };
    const [searchTerm, setSearchTerm] = useState('');
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
    const headerRef = useRef(null);
    const [activeZone, setActiveZone] = useState(null);
    const [clientName, setClientName] = useState(() => localStorage.getItem('dst_client') || '');
    const [showPastaRapidaInfo, setShowPastaRapidaInfo] = useState(false);
    const [showCotacaoModal, setShowCotacaoModal] = useState(false);
    const [showCotacaoGate, setShowCotacaoGate] = useState(false);
    const [showCotacaoSenha, setShowCotacaoSenha] = useState(false);
    const [cotacaoSenhaInput, setCotacaoSenhaInput] = useState('');
    const [cotacaoSenhaErro, setCotacaoSenhaErro] = useState(false);
    const isCotacaoUnlocked = () => {
        const ts = parseInt(localStorage.getItem('dst_cot_unlock') || '0');
        return Date.now() - ts < 60 * 60 * 1000; // 1 hora
    };

    // Modal boas vindas — mostra no máximo 3x (total, entre sessões)
    const [showBemVindo, setShowBemVindo] = useState(() => {
        const views = parseInt(localStorage.getItem('dst_bv_count') || '0');
        return views < 3;
    });
    const [cotacaoGateSenha, setCotacaoGateSenha] = useState("");
    const [cotacaoGateErro, setCotacaoGateErro] = useState(false);
    const cotacaoUnlockedAtRef = useRef(null);
    const [cotacaoData, setCotacaoData] = useState({ perfil: '', empreendimento: '', valorImovel: '', renda: '', financiamentoBanco: '', subsidio: '', fgts: '', atoCliente: '', parcelaFinanciamento: '', entrega: '', mesesCorrecao: '' });
    const [cotacaoFile, setCotacaoFile] = useState(null);
    const [cotacaoLoading, setCotacaoLoading] = useState(false);
    const [cotacaoResult, setCotacaoResult] = useState(null);
    const [openRegra, setOpenRegra] = useState(null); // 'planIdx-regraIdx'
    const cotacaoFileRef = useRef(null);
    const [perfilSelecionado, setPerfilSelecionado] = useState(null); // 'diamante'|'ouro'|'prata'|'bronze'|'aco'
    const [perfilExpandido, setPerfilExpandido] = useState(null);
    const [pastaRapidaCountdown, setPastaRapidaCountdown] = useState(10);
    const pastaRapidaClicksRef = useRef(parseInt(localStorage.getItem('dst_pr_clicks') || '0'));
    const [showCotacaoInfo, setShowCotacaoInfo] = useState(false);
    const [pdfLeitor, setPdfLeitor] = useState(null); // { title, url, brand } — leitor de revista in-app
    const [cotacaoInfoCountdown, setCotacaoInfoCountdown] = useState(10);
    const cotacaoClicksRef = useRef(parseInt(localStorage.getItem('dst_cot_clicks') || '0'));

    // Hide search bar on mobile scroll down, show on scroll up
    const [searchBarVisible, setSearchBarVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const isMobile = () => window.innerWidth < 768;
        const onScroll = () => {
            if (!isMobile()) { setSearchBarVisible(true); return; }
            const current = window.scrollY;
            if (current > lastScrollY.current + 8 && current > 60) {
                setSearchBarVisible(false);
            } else if (current < lastScrollY.current - 8) {
                setSearchBarVisible(true);
            }
            lastScrollY.current = current;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Trava scroll do body quando modais/chat estão abertos
    // Quando pdfLeitor está aberto NÃO trava touchAction — o iframe precisa de scroll livre
    useEffect(() => {
        const shouldLock = isChatOpen || !!selectedPois || showPastaRapidaInfo || showCotacaoModal || !!pdfLeitor;
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
    }, [isChatOpen, selectedPois, showPastaRapidaInfo, showCotacaoModal, pdfLeitor]);

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

    // Countdown de 10s para o botão "Entendi" do modal Cotação
    useEffect(() => {
        if (!showCotacaoInfo) { setCotacaoInfoCountdown(10); return; }
        setCotacaoInfoCountdown(10);
        const interval = setInterval(() => {
            setCotacaoInfoCountdown(prev => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [showCotacaoInfo]);

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

    // Versão para cotação: renderiza TODAS as páginas empilhadas num único canvas
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

    // =========================================================
    // PASTA RÁPIDA — OpenRouter com roteador automático
    // =========================================================
    const OPENROUTER_KEY = process.env.REACT_APP_OPENROUTER_KEY;

    // Modelos tentados em ordem — fallbacks caso o primeiro falhe
    const VISION_MODELS = [
        'google/gemini-2.0-flash-001',
        'google/gemini-flash-1.5',
        'meta-llama/llama-3.2-90b-vision-instruct',
    ];

    const ORDER_MAP = {
        // ── Documentos urgentes / administrativos (vão na frente de tudo) ──
        cancelamento: 0, autorizacao: 0, reserva: 0,

        // ── Documentos de identificação (todos equivalentes ao RG) ──
        rg_frente: 1,   // frente do RG — sempre antes do verso
        rg_verso: 2,    // verso do RG
        rg: 1,          // RG genérico (sem distinção frente/verso)
        cnh: 3,         // CNH equivale a RG como identidade
        oab: 3,         // OAB equivale a RG como identidade
        creci: 3,       // CRECI equivale a RG como identidade
        cpf: 4,         // CPF vem logo após o documento de identidade

        // ── Documentos de estado civil / certidões ──
        certidao_nascimento: 5,
        certidao_casamento: 6,
        certidao_obito: 7,

        // ── Comprovante de residência ──
        residencia: 8,

        // ── Documentos de trabalho / renda ──
        ctps: 9,
        contracheque: 10,
        imposto_renda: 11,
        extrato_bancario: 12,
        fgts: 13,

        outros: 99
    };

    const CLASSIFY_PROMPT = `Você é especialista em classificar documentos brasileiros. Analise esta imagem com atenção — pode ser foto de celular, com ângulo ou parcialmente visível.

Responda APENAS com JSON válido, sem texto adicional: {"category":"CATEGORIA","label":"NOME DO DOCUMENTO"}

CATEGORIAS POSSÍVEIS:
- "rg" → RG ou Identidade (quando não dá para distinguir frente/verso): tem campos de identificação, número do RG
- "cnh" → CNH: tem foto do motorista, logo DETRAN, letras de categoria (A B C D E), validade
- "cpf" → CPF: tem número no formato XXX.XXX.XXX-XX, texto "Cadastro de Pessoas Físicas" ou "Receita Federal"
- "oab" → OAB: tem logo da OAB, texto "Ordem dos Advogados do Brasil"
- "creci" → CRECI: tem logo CRECI, texto "Conselho Regional de Corretores de Imóveis"
- "rg_frente" → RG Frente: lado com foto 3x4, nome, data de nascimento, número do RG
- "rg_verso" → RG Verso: lado com impressão digital, filiação (nome dos pais), órgão emissor
- "residencia" → Comprovante de Residência: conta de luz, água, gás, internet, telefone, TV por assinatura, fatura de celular — qualquer documento que tenha endereço completo com CEP e valor/vencimento
- "certidao_casamento" → Certidão de Casamento: tem texto "CERTIDÃO DE CASAMENTO", nome do cartório, nomes dos cônjuges
- "certidao_nascimento" → Certidão de Nascimento: tem texto "CERTIDÃO DE NASCIMENTO", nome do cartório
- "certidao_obito" → Certidão de Óbito: tem texto "CERTIDÃO DE ÓBITO", data de falecimento
- "ctps" → Carteira de Trabalho: tem texto "CARTEIRA DE TRABALHO E PREVIDÊNCIA SOCIAL" ou "CTPS Digital", logo Governo Federal
- "contracheque" → Contracheque ou Holerite: tem tabela com colunas Vencimentos e Descontos, valores de INSS, FGTS, salário base, total líquido
- "imposto_renda" → Imposto de Renda: tem texto "DECLARAÇÃO DE AJUSTE ANUAL" ou "DIRPF", logo Receita Federal
- "extrato_bancario" → Extrato Bancário: tem logo de banco (Caixa, Bradesco, Itaú, Nubank, Banco do Brasil, Santander, Inter), lista de transações, saldo, agência e conta
- "fgts" → FGTS: tem logo "CAIXA" junto com "FGTS", número PIS/PASEP, tabela de depósitos mensais, "Valor para Fins Rescisórios"
- "outros" → use apenas se não se encaixar em nenhuma categoria acima

IMPORTANTE: Seja generoso na classificação. Se há qualquer indicação visual de uma categoria, classifique nela. Só use "outros" se realmente não der para identificar.

Responda SOMENTE o JSON. Exemplo: {"category":"rg","label":"RG / Identidade"}`;

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const pdfFirstPageToBase64 = async (arrayBuffer) => {
        await waitForPdfJs();
        const copy = arrayBuffer.slice(0);
        const pdfDoc = await window.pdfjsLib.getDocument({ data: new Uint8Array(copy), password: '', disableRange: true, disableStream: true }).promise;
        const page = await pdfDoc.getPage(1);
        // Escala 2.0 original — necessária para a IA identificar o documento corretamente
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        page.cleanup();
        // Qualidade 0.85 original — necessária para a IA ler o texto do documento
        return canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
    };

    const fileToBase64 = (arrayBuffer) => {
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    };

    // ✅ OTIMIZAÇÃO: timeout de 12s por modelo para não travar indefinidamente
    const tryModel = async (model, b64, mime) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        try {
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENROUTER_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Destemidos Imoveis'
                },
                body: JSON.stringify({
                    model,
                    max_tokens: 100,
                    temperature: 0.1,
                    messages: [{
                        role: 'user',
                        content: [
                            { type: 'image_url', image_url: { url: `data:${mime};base64,${b64}` } },
                            { type: 'text', text: CLASSIFY_PROMPT }
                        ]
                    }]
                })
            });

            clearTimeout(timeoutId);

            if (res.status === 429) {
                // ✅ OTIMIZAÇÃO: aguarda apenas 2s em rate limit (era 8s)
                console.warn(`Rate limit no modelo ${model}, aguardando 2s...`);
                await sleep(2000);
                return null;
            }
            if (!res.ok) {
                const err = await res.text();
                console.warn(`Modelo ${model} falhou (${res.status}):`, err.substring(0, 80));
                return null;
            }

            const json = await res.json();
            const text = json.choices?.[0]?.message?.content || '';
            const match = text.match(/\{[^}]+\}/);
            if (!match) { console.warn('Sem JSON na resposta:', text.substring(0, 80)); return null; }

            const parsed = JSON.parse(match[0]);
            const cat = parsed.category || 'outros';
            return { category: cat, order: ORDER_MAP[cat] ?? 99, label: parsed.label || 'Outro Documento' };
        } catch (err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                console.warn(`Modelo ${model} ultrapassou timeout de 12s`);
            } else {
                console.warn(`Modelo ${model} erro:`, err.message);
            }
            return null;
        }
    };

    // =========================================================
    // DICIONÁRIO COMPARTILHADO — usado pelas Armas 1, 2, 4 e 5/6
    // =========================================================
    const KEYWORD_MAP = [
        // ── Documentos urgentes / administrativos — vão na frente de tudo ──
        { keywords: ['cancelamento','carta de cancelamento','distrato'], category: 'cancelamento', label: 'Carta de Cancelamento' },
        { keywords: ['autorizacao cadastral','autorização cadastral','autorizacao','autorização','declaracao de esclarecimento','declaração de esclarecimento'], category: 'autorizacao', label: 'Autorização / Declaração' },
        { keywords: ['reserva de unidade','reserva','proposta de compra'], category: 'reserva', label: 'Reserva de Unidade' },

        // ── RG frente e verso (nome do arquivo com "frente" ou "verso") ──
        { keywords: ['rg frente','rg_frente','identidade frente','frente rg','frente identidade','rg frente'], category: 'rg_frente', label: 'RG / Identidade (Frente)' },
        { keywords: ['rg verso','rg_verso','identidade verso','verso rg','verso identidade'], category: 'rg_verso', label: 'RG / Identidade (Verso)' },

        // ── Documentos de renda / trabalho ──
        { keywords: ['holerite','contracheque','folha de pagamento','folha pagamento','salario','salário','vencimentos','descontos','liquido','líquido','inss','cbo','competencia','competência'], category: 'contracheque', label: 'Contracheque / Holerite' },
        { keywords: ['declaracao de ajuste anual','declaração de ajuste anual','dirpf','imposto de renda','irpf','ajuste anual','rendimentos tributaveis','rendimentos tributáveis'], category: 'imposto_renda', label: 'Imposto de Renda' },
        { keywords: ['extrato bancario','extrato bancário','extrato','saldo','movimentacao','movimentação','deposito','depósito','saque','transferencia','transferência','agencia','agência','conta corrente','poupanca','poupança','nubank','bradesco','itau','itaú','santander','caixa economica','banco do brasil','inter','sicoob'], category: 'extrato_bancario', label: 'Extrato Bancário' },
        { keywords: ['fgts','fundo de garantia','pis','pasep','caixa fgts','depositos mensais','depósitos mensais','fins rescisórios','fins rescisorios'], category: 'fgts', label: 'FGTS' },
        // CTPS deve vir ANTES de certidão de nascimento para evitar confusão
        { keywords: ['carteira de trabalho','ctps','carteira profissional','previdencia social','previdência social','ctps digital','numero ctps','número ctps','ministerio do trabalho','ministério do trabalho'], category: 'ctps', label: 'Carteira de Trabalho (CTPS)' },

        // ── Certidões de estado civil ──
        { keywords: ['certidao de casamento','certidão de casamento','casamento','contraentes','registro de casamento'], category: 'certidao_casamento', label: 'Certidão de Casamento' },
        // certidao_nascimento deve vir DEPOIS de ctps para não confundir
        { keywords: ['certidao de nascimento','certidão de nascimento','registro de nascimento'], category: 'certidao_nascimento', label: 'Certidão de Nascimento' },
        { keywords: ['certidao de obito','certidão de óbito','obito','óbito','falecimento'], category: 'certidao_obito', label: 'Certidão de Óbito' },

        // ── CPF ──
        { keywords: ['cadastro de pessoas fisicas','cadastro de pessoas físicas','cpf','receita federal do brasil'], category: 'cpf', label: 'CPF' },

        // ── Documentos de identidade (todos equivalem ao RG) ──
        { keywords: ['carteira nacional de habilitacao','carteira nacional de habilitação','cnh','detran','habilitacao','habilitação','registro nacional'], category: 'cnh', label: 'CNH' },
        { keywords: ['ordem dos advogados','oab','advogado'], category: 'oab', label: 'OAB' },
        { keywords: ['conselho regional de corretores','creci','corretor de imoveis','corretor de imóveis'], category: 'creci', label: 'CRECI' },
        { keywords: ['registro geral','identidade','instituto de identificacao','instituto de identificação','filiacao','filiação','naturalidade'], category: 'rg', label: 'RG / Identidade' },
        // "rg" como palavra sozinha vem por último para não capturar palavras que contenham "rg"
        { keywords: [' rg ','_rg_','-rg-'], category: 'rg', label: 'RG / Identidade' },

        // ── Comprovante de residência — qualquer conta serve ──
        { keywords: [
            'comprovante de residencia','comprovante de residência','residencia','residência',
            'endereco','endereço','cep','codigo de barras','código de barras',
            // contas de consumo
            'conta de luz','energia eletrica','energia elétrica','eletrobras','amazonas energia','cemig','copel','light ',
            'conta de agua','água tratada','saneamento','cosama','saae',
            'conta de gas','gas encanado','gás encanado','comgas','cegás',
            // telecomunicações
            'fatura','conta de telefone','fatura telefone','celular','tim ','vivo ','claro ','oi ','net ','sky ','amazon fibra','brisanet',
            'internet','banda larga','tv por assinatura','tv a cabo',
            // genérico
            'vencimento','valor a pagar'
        ], category: 'residencia', label: 'Comprovante de Residência' },
    ];

    const matchKeywords = (text) => {
        const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        for (const entry of KEYWORD_MAP) {
            if (entry.keywords.some(kw => normalized.includes(kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()))) {
                return { category: entry.category, order: ORDER_MAP[entry.category] ?? 99, label: entry.label };
            }
        }
        return null;
    };

    // =========================================================
    // ARMA 1 — Nome do arquivo (0ms, sem API)
    // =========================================================
    const classifyByFilename = (filename) => {
        const name = filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[_\-\.]/g, ' ');
        const result = matchKeywords(name);
        if (result) {
            console.log(`🏷️ Arma 1 (nome) → ${result.label}`);
            return result;
        }
        return null;
    };

    // =========================================================
    // ARMA 5 — Metadados do PDF: Title, Subject, Keywords (~0ms)
    // =========================================================
    const classifyByPdfMetadata = async (arrayBuffer) => {
        try {
            if (!window.pdfjsLib) return null;
            const copy = arrayBuffer.slice(0);
            const pdfDoc = await window.pdfjsLib.getDocument({ data: new Uint8Array(copy), password: '', disableRange: true, disableStream: true }).promise;
            const meta = await pdfDoc.getMetadata().catch(() => null);
            if (!meta) return null;
            const info = meta.info || {};
            const combined = [info.Title, info.Subject, info.Keywords, info.Author].filter(Boolean).join(' ');
            if (!combined.trim()) return null;
            const result = matchKeywords(combined);
            if (result) {
                console.log(`📋 Arma 5 (metadados) → ${result.label}`);
                return result;
            }
        } catch {}
        return null;
    };

    // =========================================================
    // ARMA 6 — Producer/Creator do PDF (~0ms)
    // =========================================================
    const classifyByPdfProducer = async (arrayBuffer) => {
        try {
            if (!window.pdfjsLib) return null;
            const copy = arrayBuffer.slice(0);
            const pdfDoc = await window.pdfjsLib.getDocument({ data: new Uint8Array(copy), password: '', disableRange: true, disableStream: true }).promise;
            const meta = await pdfDoc.getMetadata().catch(() => null);
            if (!meta) return null;
            const info = meta.info || {};
            const combined = [info.Producer, info.Creator].filter(Boolean).join(' ').toLowerCase();
            if (!combined.trim()) return null;
            // Regras específicas por produtor/criador
            if (/serpro|receita federal|dirpf|rfb/.test(combined)) return { category: 'imposto_renda', order: ORDER_MAP['imposto_renda'] ?? 99, label: 'Imposto de Renda' };
            if (/detran/.test(combined)) return { category: 'cnh', order: ORDER_MAP['cnh'] ?? 99, label: 'CNH' };
            if (/caixa|cef|fgts/.test(combined)) return { category: 'fgts', order: ORDER_MAP['fgts'] ?? 99, label: 'FGTS' };
            if (/esocial|ministerio do trabalho|mte/.test(combined)) return { category: 'ctps', order: ORDER_MAP['ctps'] ?? 99, label: 'Carteira de Trabalho (CTPS)' };
            // Fallback: tenta o dicionário geral
            const result = matchKeywords(combined);
            if (result) {
                console.log(`🏭 Arma 6 (producer) → ${result.label}`);
                return result;
            }
        } catch {}
        return null;
    };

    // =========================================================
    // ARMA 2 — Texto embutido do PDF (~100ms, sem API)
    // =========================================================
    const classifyByPdfText = async (arrayBuffer) => {
        try {
            if (!window.pdfjsLib) return null;
            const copy = arrayBuffer.slice(0);
            const pdfDoc = await window.pdfjsLib.getDocument({ data: new Uint8Array(copy), password: '', disableRange: true, disableStream: true }).promise;
            const numPages = Math.min(pdfDoc.numPages, 3);
            let fullText = '';
            for (let p = 1; p <= numPages; p++) {
                const page = await pdfDoc.getPage(p);
                const content = await page.getTextContent();
                fullText += content.items.map(i => i.str).join(' ') + ' ';
                page.cleanup();
            }
            if (fullText.trim().length < 20) return null; // PDF escaneado — sem texto
            const result = matchKeywords(fullText);
            if (result) {
                console.log(`📄 Arma 2 (texto PDF) → ${result.label}`);
                return result;
            }
        } catch {}
        return null;
    };

    // =========================================================
    // ARMA 4 — Tesseract OCR (1-4s, sem API)
    // =========================================================
    const loadTesseract = () => new Promise((resolve, reject) => {
        if (window.Tesseract) { resolve(window.Tesseract); return; }
        const existing = document.getElementById('tesseract-script');
        if (existing) { existing.addEventListener('load', () => resolve(window.Tesseract)); return; }
        const s = document.createElement('script');
        s.id = 'tesseract-script';
        s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        s.onload = () => resolve(window.Tesseract);
        s.onerror = reject;
        document.body.appendChild(s);
    });

    const classifyByOCR = async (arrayBuffer, mime) => {
        try {
            const Tesseract = await loadTesseract();
            let imageData;
            if (mime === 'image/jpeg') {
                // É o resultado do pdfFirstPageToBase64 — já é base64 JPEG
                imageData = `data:image/jpeg;base64,${arrayBuffer}`;
            } else {
                const blob = new Blob([arrayBuffer], { type: mime });
                imageData = URL.createObjectURL(blob);
            }
            const { data: { text } } = await Tesseract.recognize(imageData, 'por', { logger: () => {} });
            if (imageData.startsWith('blob:')) URL.revokeObjectURL(imageData);
            if (!text || text.trim().length < 15) return null;
            const result = matchKeywords(text);
            if (result) {
                console.log(`🔬 Arma 4 (OCR) → ${result.label}`);
                return result;
            }
        } catch {}
        return null;
    };

    // =========================================================
    // classifyDoc — Ordem: 1 → 5 → 6 → 2 → 4 → IA
    // =========================================================
    const classifyDoc = async (file) => {
        try {
            // ── Arma 1: Nome do arquivo ──
            const arm1 = classifyByFilename(file.name);
            if (arm1) return arm1;

            // Lê o buffer UMA vez e faz cópias para cada uso
            const masterBuffer = await file.arrayBuffer();
            let b64, mime;

            if (file.type === 'application/pdf') {
                // ── Arma 5: Metadados (Title/Subject/Keywords/Author) ──
                const arm5 = await classifyByPdfMetadata(masterBuffer.slice(0));
                if (arm5) return arm5;

                // ── Arma 6: Producer/Creator ──
                const arm6 = await classifyByPdfProducer(masterBuffer.slice(0));
                if (arm6) return arm6;

                // ── Arma 2: Texto embutido ──
                const arm2 = await classifyByPdfText(masterBuffer.slice(0));
                if (arm2) return arm2;

                // Prepara imagem para Arma 4 e IA (usa cópia fresca)
                b64 = await pdfFirstPageToBase64(masterBuffer.slice(0));
                mime = 'image/jpeg';

                // ── Arma 4: OCR (recebe b64 já pronto, não consome buffer) ──
                const arm4 = await classifyByOCR(b64, 'image/jpeg');
                if (arm4) return arm4;

            } else if (file.type.startsWith('image/')) {
                mime = ['image/jpeg','image/png','image/webp','image/gif'].includes(file.type) ? file.type : 'image/jpeg';
                b64 = fileToBase64(masterBuffer.slice(0));

                // ── Arma 4: OCR em imagens (usa cópia fresca do buffer) ──
                const arm4img = await classifyByOCR(masterBuffer.slice(0), mime);
                if (arm4img) return arm4img;
            } else {
                return { category: 'outros', order: 99, label: 'Outro Documento' };
            }

            // ── IA (último recurso) ──
            // ✅ OTIMIZAÇÃO: delay entre modelos reduzido (era 1000ms, agora 300ms)
            for (const model of VISION_MODELS) {
                const result = await tryModel(model, b64, mime);
                if (result) {
                    console.log(`✅ Modelo usado: ${model} → ${result.label}`);
                    return result;
                }
                await sleep(300);
            }

            return { category: 'outros', order: 99, label: 'Outro Documento' };
        } catch (err) {
            console.error('Classify error:', err);
            return { category: 'outros', order: 99, label: 'Outro Documento' };
        }
    };

    const classifyInBatches = async (docs, batchSize = 3) => {
        const results = new Array(docs.length);
        for (let i = 0; i < docs.length; i += batchSize) {
            const batch = docs.slice(i, i + batchSize);
            const batchResults = await Promise.all(
                batch.map(async (doc, batchIdx) => {
                    // Find this doc by ID in current pendingDocs (not by index)
                    setPendingDocs(prev => prev.map(d => d.id === doc.id ? { ...d, aiLabel: '🔍' } : d));
                    setOrganizeProgress(prev => ({ ...prev, current: i + batchIdx + 1, label: doc.name.length > 22 ? doc.name.substring(0, 22) + '…' : doc.name }));
                    const result = await classifyDoc(doc.file);
                    const done = { ...doc, aiLabel: result.label, aiOrder: result.order };
                    setPendingDocs(prev => prev.map(d => d.id === doc.id ? done : d));
                    return done;
                })
            );
            batchResults.forEach((r, batchIdx) => { results[i + batchIdx] = r; });
            if (i + batchSize < docs.length) await sleep(500);
        }
        return results;
    };

    const handleQuickFolderUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        if (quickFolderInputRef.current) quickFolderInputRef.current.value = '';

        if (!OPENROUTER_KEY) {
            setIsChatOpen(true);
            setChatMessages(prev => [...prev, {
                role: 'bot',
                content: '⚠️ **Pasta Rápida precisa da chave do OpenRouter.**\n\n1. Acesse: https://openrouter.ai\n2. Crie conta gratuita (sem cartão)\n3. Vá em **Settings → Keys** e crie uma chave\n4. Adicione no `.env`:\n```\nREACT_APP_OPENROUTER_KEY=sk-or-...\n```\n5. Reinicie com `npm start` 🔑'
            }]);
            return;
        }

        setIsCreatingFolder(true);
        setFolderSource('rapida');
        setIsOrganizingDocs(true);
        setOrganizeProgress({ current: 0, total: files.length, label: 'Preparando...' });
        setCardAnimPhase('pulse');
        setChatMessages(prev => [...prev, {
            role: 'bot',
            content: `🧠 **Pasta Rápida ativada!** ${files.length} documento${files.length > 1 ? 's' : ''} recebido${files.length > 1 ? 's' : ''}.\n\nAnalisando com IA... ✨`
        }]);

        // Gera previews dos NOVOS arquivos
        const newDocsBase = await Promise.all(files.map(async (file) => {
            let previewUrl = null;
            if (file.type.startsWith('image/')) previewUrl = URL.createObjectURL(file);
            else if (file.type === 'application/pdf') previewUrl = await generatePdfPreview(file);
            return { id: Math.random().toString(36).substring(7), file, name: file.name, previewUrl, aiLabel: '⏳', aiOrder: 99 };
        }));

        // Adiciona os novos ao final dos existentes (sem apagar os já organizados)
        setPendingDocs(prev => [...prev, ...newDocsBase]);

        // Classifica SOMENTE os novos documentos
        const classified = await classifyInBatches(newDocsBase, 3);

        // Mescla TODOS os docs existentes + os novos classificados e re-ordena tudo junto
        setPendingDocs(prev => {
            // Existing docs that are NOT part of the new batch (keep their aiOrder)
            const existing = prev.filter(d => !newDocsBase.some(n => n.id === d.id));
            const merged = [...existing, ...classified];
            return merged.sort((a, b) => (a.aiOrder ?? 99) - (b.aiOrder ?? 99));
        });

        // Fase final: scatter — cards reaparecem nos seus lugares
        setCardAnimPhase('scatter');
        setTimeout(() => { setCardAnimPhase('idle'); }, 800);

        setIsOrganizingDocs(false);
        setOrganizeProgress({ current: 0, total: 0, label: '' });

        const resumo = classified.map((d, i) => `${i + 1}. ${d.aiLabel}`).join('\n');
        setChatMessages(prev => [...prev, {
            role: 'bot',
            content: `✅ **Novos documentos adicionados e organizados:**\n\n${resumo}\n\nAjuste arrastando se precisar e clique em **Finalizar PDF**! 📄`
        }]);
    };

    // Reorganiza TODOS os documentos já presentes na pasta
    const handleOrganizeAll = async () => {
        if (!OPENROUTER_KEY || pendingDocs.length === 0 || isOrganizingDocs) return;

        setIsOrganizingDocs(true);
        setOrganizeProgress({ current: 0, total: pendingDocs.length, label: 'Preparando...' });
        setCardAnimPhase('pulse');

        setChatMessages(prev => [...prev, {
            role: 'bot',
            content: `🔄 **Reorganizando ${pendingDocs.length} documento${pendingDocs.length > 1 ? 's' : ''}...**\n\nAnalisando tudo com IA... ✨`
        }]);

        // Re-classifica TODOS os docs
        const allDocs = [...pendingDocs];
        const classified = await classifyInBatches(allDocs, 3);

        // Ordena tudo
        const sorted = [...classified].sort((a, b) => (a.aiOrder ?? 99) - (b.aiOrder ?? 99));
        setPendingDocs(sorted);

        setCardAnimPhase('scatter');
        setTimeout(() => { setCardAnimPhase('idle'); }, 800);

        setIsOrganizingDocs(false);
        setOrganizeProgress({ current: 0, total: 0, label: '' });

        const resumo = sorted.map((d, i) => `${i + 1}. ${d.aiLabel}`).join('\n');
        setChatMessages(prev => [...prev, {
            role: 'bot',
            content: `✅ **Tudo organizado na ordem certa:**\n\n${resumo}\n\nAjuste arrastando se precisar e clique em **Finalizar PDF**! 📄`
        }]);
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

    const handleTouchMove = (e) => {
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

    const handleTouchEnd = () => {
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
            // scale 1.2 + JPEG 0.82 = muito mais rápido que 2.0 + PNG, qualidade suficiente para documentos
            const viewport = page.getViewport({ scale: 1.2 });
            const canvas = document.createElement('canvas');
            canvas.width  = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvasContext: ctx, viewport }).promise;
            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            const base64  = dataUrl.split(',')[1];
            const binaryStr = atob(base64);
            const bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
            pages.push({ bytes, widthPt: canvas.width / 1.2, heightPt: canvas.height / 1.2, isJpeg: true });
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
                    let image;
                    if (doc.file.type === 'image/png') {
                        image = await mergedPdf.embedPng(arrayBuffer);
                    } else {
                        // JPEG, WEBP and others — convert to JPEG for speed
                        try {
                            image = await mergedPdf.embedJpg(arrayBuffer);
                        } catch {
                            image = await mergedPdf.embedPng(arrayBuffer);
                        }
                    }
                    const page = mergedPdf.addPage();
                    const { width, height } = page.getSize();
                    const imgDims = image.scale(1);
                    const scale = Math.min((width - 40) / imgDims.width, (height - 40) / imgDims.height, 1);
                    const drawWidth  = imgDims.width  * scale;
                    const drawHeight = imgDims.height * scale;
                    page.drawImage(image, {
                        x: width  / 2 - drawWidth  / 2,
                        y: height / 2 - drawHeight / 2,
                        width:  drawWidth,
                        height: drawHeight,
                    });
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

    // Ctrl+V no modal de cotação — captura imagem da área de transferência
    useEffect(() => {
        if (!showCotacaoModal) return;
        const handlePaste = async (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    const blob = item.getAsFile();
                    if (!blob) continue;
                    const file = new File([blob], 'print_colado.png', { type: item.type });
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    if (cotacaoFileRef.current) {
                        cotacaoFileRef.current.files = dt.files;
                        cotacaoFileRef.current.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    return;
                }
            }
        };
        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [showCotacaoModal]);

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
    });

    return (
        <div className={`min-h-screen font-sans pb-12 relative transition-colors duration-500 ${modoNoturno ? 'bg-[#0B1120] text-slate-100' : 'bg-slate-50 text-slate-800'}`}
            onMouseMove={handleGlobalDragOver}
        >
            {/* ── SAFE AREA + HEADER — camada única de vidro ────────────────
                Um único elemento fixed parte do top:0 (cobre o notch) e tem
                padding-top = env(safe-area-inset-top) para o conteúdo começar
                abaixo do notch. Assim backdrop-filter é UMA camada só. ───── */}
            <header
                ref={headerRef}
                className="fixed left-0 right-0 z-30 transition-colors duration-500"
                style={{
                    top: 0,
                    paddingTop: 'env(safe-area-inset-top, 0px)',
                    background: modoNoturno ? 'rgba(15,23,42,0.70)' : 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    borderBottom: modoNoturno ? '1px solid rgba(51,65,85,0.6)' : '1px solid rgba(226,232,240,0.6)',
                    boxShadow: modoNoturno ? '0 1px 8px rgba(0,0,0,0.25)' : '0 1px 8px rgba(148,163,184,0.3)',
                }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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

                        {/* Linha 2 mobile — Busca + Botão noturno */}
                        <div className={`flex items-center gap-2 pb-3 sm:pb-0 sm:flex-1 transition-all duration-300 ${
                            searchBarVisible
                            ? 'opacity-100 max-h-20'
                            : 'opacity-0 max-h-0 overflow-hidden pointer-events-none sm:opacity-100 sm:max-h-none sm:pointer-events-auto'
                        }`}>
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar por nome ou bairro..."
                                    className={`block w-full pl-9 pr-3 py-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all ${
                                        modoNoturno
                                        ? 'bg-white/10 border border-white/15 text-white placeholder-white/40 focus:bg-white/15'
                                        : 'bg-black/6 border border-black/8 text-slate-800 placeholder-slate-400 focus:bg-white/90'
                                    }`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
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
                        </div>

                    </div>
                </div>
            </header>

            <main className="main-content max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* BANNER INSPIRAÇÃO DIÁRIA */}
                <div className="mb-8 relative rounded-2xl overflow-hidden shadow-lg group">
                    <img src={imagemDoDia} onError={(e) => { e.target.src = '' }} alt="Equipe Destemidos" className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-1000 bg-slate-200" style={{ objectPosition: `center ${bannerFocusY}` }} />
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
                <div className={`border-b overflow-x-auto custom-scrollbar transition-colors duration-500 ${modoNoturno ? 'border-slate-800' : 'border-gray-200'}`}>
                    <nav className="-mb-px flex space-x-6 sm:space-x-8 min-w-max" aria-label="Tabs">
                        <button onClick={() => { haptic(); setActiveBrand('Direcional'); }} className={`whitespace-nowrap py-4 px-2 border-b-2 transition-colors flex items-center ${activeBrand === 'Direcional' ? (modoNoturno ? 'border-blue-500' : 'border-blue-900') : 'border-transparent hover:border-gray-300'}`}>
                            <div className={`flex items-center transition-all ${activeBrand === 'Direcional' ? 'opacity-100' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                                <span className={`font-black text-lg tracking-tight ${modoNoturno ? 'text-blue-400' : 'text-blue-900'}`}>DIRECIONAL</span>
                                <span className="w-1.5 h-1.5 bg-red-600 ml-1 rounded-sm"></span>
                            </div>
                        </button>
                        <button onClick={() => { haptic(); setActiveBrand('Riva'); }} className={`whitespace-nowrap py-4 px-2 border-b-2 transition-colors flex items-center ${activeBrand === 'Riva' ? (modoNoturno ? 'border-indigo-400' : 'border-indigo-950') : 'border-transparent hover:border-gray-300'}`}>
                            <div className={`flex items-center transition-all ${activeBrand === 'Riva' ? 'opacity-100' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                                <span className={`font-black text-lg tracking-tight ${modoNoturno ? 'text-indigo-400' : 'text-indigo-950'}`}>RIVA</span>
                                <span className={`w-1.5 h-1.5 ml-1 rounded-sm ${modoNoturno ? 'bg-indigo-400' : 'bg-indigo-950'}`}></span>
                            </div>
                        </button>
                        <a href="https://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso&isVoltar=true" target="_blank" rel="noopener noreferrer" className="whitespace-nowrap py-4 px-2 border-b-2 border-transparent hover:border-gray-300 transition-colors flex items-center group">
                            <div className="flex items-center transition-all opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100">
                                <span className={`font-black text-lg tracking-tight ${modoNoturno ? 'text-emerald-400' : 'text-emerald-700'}`}>SIMULADOR</span>
                                <Calculator size={16} className={`ml-1.5 ${modoNoturno ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            </div>
                        </a>
                        <a href="https://drive.google.com/drive/folders/14mYfQkNaSc9APr6hpOTKKTFQ02oq3uOf?usp=sharing" target="_blank" rel="noopener noreferrer" className="whitespace-nowrap py-4 px-2 border-b-2 border-transparent hover:border-gray-300 transition-colors flex items-center group">
                            <div className="flex items-center transition-all opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100">
                                <span className={`font-black text-lg tracking-tight ${modoNoturno ? 'text-violet-400' : 'text-violet-700'}`}>TABELAS</span>
                                <TableProperties size={16} className={`ml-1.5 ${modoNoturno ? 'text-violet-400' : 'text-violet-600'}`} />
                            </div>
                        </a>
                        <button onClick={() => { haptic(); setActiveBrand('Utilitarios'); }} className={`whitespace-nowrap py-4 px-2 border-b-2 transition-colors flex items-center ${activeBrand === 'Utilitarios' ? 'border-orange-600' : 'border-transparent hover:border-gray-300'}`}>
                            <div className={`flex items-center transition-all ${activeBrand === 'Utilitarios' ? 'opacity-100' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                                <span className="text-orange-600 font-black text-lg tracking-tight">UTILITÁRIOS</span>
                                <BookMarked size={16} className="ml-1.5 text-orange-600" />
                            </div>
                        </button>
                        <button onClick={() => { haptic(); setActiveBrand('Guia'); }} className={`whitespace-nowrap py-4 px-2 border-b-2 transition-colors flex items-center ${activeBrand === 'Guia' ? 'border-rose-600' : 'border-transparent hover:border-gray-300'}`}>
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
                            <div className={`text-center py-12 rounded-xl shadow-sm border transition-colors ${modoNoturno ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-900'}`}>
                                <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                <h3 className="text-lg font-medium">Nenhum material encontrado</h3>
                                <p className="text-slate-500">Tente buscar por outro nome ou bairro.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredRevistas.map((revista) => (
                                    <div key={revista.id} className={`rounded-2xl overflow-hidden shadow-sm border hover:shadow-md transition-all duration-300 flex flex-col group ${modoNoturno ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                        <div className="relative h-48 overflow-hidden bg-slate-100">
                                            <img src={revista.cover} onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400'; }} alt={`Capa ${revista.title}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-3 left-3 z-10">
                                                <div className="px-3 py-1.5 rounded-lg flex items-center justify-center h-10 min-w-[100px]"
                                                    style={{
                                                        background: 'rgba(255,255,255,0.82)',
                                                        backdropFilter: 'blur(8px) saturate(140%)',
                                                        WebkitBackdropFilter: 'blur(8px) saturate(140%)',
                                                        border: '1px solid rgba(255,255,255,0.9)',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                    }}>
                                                    <img src={revista.brand === 'Direcional' ? 'https://i.postimg.cc/crYQS8mh/image.png' : 'https://i.postimg.cc/R3Q9f9Bc/image.png'} alt={revista.brand} className="h-full max-h-[22px] w-auto max-w-[85px] object-contain" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className={`text-xl font-bold mb-2 ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>{revista.title}</h3>
                                            <div className="flex flex-col gap-2 mb-6">
                                                <div className="flex items-center text-slate-500 text-sm gap-2">
                                                    <MapPin size={16} className="text-slate-400 shrink-0" />
                                                    <span className={`line-clamp-1 ${modoNoturno ? 'text-slate-400' : ''}`}>{revista.region}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                                                    <div className="flex items-center text-slate-500 text-sm gap-1.5"><Maximize size={16} className="text-slate-400 shrink-0" /><span className={modoNoturno ? 'text-slate-400' : ''}>{revista.size}</span></div>
                                                    <div className="flex items-center text-slate-500 text-sm gap-1.5"><Bed size={16} className="text-slate-400 shrink-0" /><span className={modoNoturno ? 'text-slate-400' : ''}>{revista.bedrooms}</span></div>
                                                    <div className="flex items-center text-slate-500 text-sm gap-1.5"><LayoutGrid size={16} className="text-slate-400 shrink-0" /><span className={modoNoturno ? 'text-slate-400' : ''}>{revista.flooring}</span></div>
                                                </div>
                                            </div>
                                            <div className="mt-auto flex flex-col gap-2">
                                                <button
                                                    onClick={() => {
                                                        haptic('medium');
                                                        const previewUrl = revista.link
                                                            .replace(/\/view(\?.*)?$/, '/preview');
                                                        setPdfLeitor({ title: revista.title, url: previewUrl, brand: revista.brand });
                                                    }}
                                                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${revista.brand === 'Direcional' ? 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:to-red-600 shadow-orange-300/30 text-white' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-blue-300/30 text-white'}`}>
                                                    <BookOpen size={18} /> Ver Revista
                                                </button>
                                                <button onClick={() => { haptic(); setSelectedPois(revista); }} className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-colors duration-200 border text-sm ${modoNoturno ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}>
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
                            <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className={`p-5 rounded-xl border shadow-sm hover:shadow-md hover:border-orange-300 transition-all flex items-start gap-4 group ${modoNoturno ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
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
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* ITEM 1: CÓDIGO DAS FAIXAS */}
                        <div className={`border rounded-xl overflow-hidden shadow-sm transition-colors ${modoNoturno ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
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
                        <div className={`border rounded-xl overflow-hidden shadow-sm transition-colors ${modoNoturno ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
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
                        <div className={`border rounded-xl overflow-hidden shadow-sm transition-colors ${modoNoturno ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
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
                    </div>
                )}
            </main>

            {/* MODAL LEITOR DE REVISTA (PDF via Google Drive preview) */}
            {pdfLeitor && (() => {
                const isDir = pdfLeitor.brand === 'Direcional';
                const driveViewUrl = pdfLeitor.url.replace('/preview', '/view');
                const whatsappMsg = `Olá!\nSegue a Revista Digital do ${pdfLeitor.title} para você conhecer melhor o empreendimento:\n${driveViewUrl}\nQualquer dúvida, estou à disposição!`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`;
                return (
                    <div className="fixed inset-0 z-[60]" style={{background:'#0f0f0f'}}>

                        {/* Botão X flutuante sobre o notch */}
                        <button
                            onClick={() => setPdfLeitor(null)}
                            className="absolute z-20 w-9 h-9 flex items-center justify-center rounded-full text-white active:scale-95 transition-all"
                            style={{
                                top: 'calc(env(safe-area-inset-top, 0px) + 8px)',
                                left: '12px',
                                background:'rgba(0,0,0,0.55)',
                                backdropFilter:'blur(10px)',
                                WebkitBackdropFilter:'blur(10px)',
                                border:'1px solid rgba(255,255,255,0.18)'
                            }}
                        >
                            <X size={18} />
                        </button>

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
                    'Brisas do Horizonte':         'Rua Ivailândia, 485, Coroado, Manaus, AM',
                    'Parque Ville Orquídea':        'Av. Comendador José Cruz, 1026, Jardim Manaus, Manaus, AM',
                    'Village Torres':               'Rua Dona Debla Henriques, 400, Lago Azul, Manaus, AM',
                    'Conquista Jardim Botânico':    'Av. Monsenhor Amâncio de Miranda, 200, Nova Cidade, Manaus, AM',
                    'Viva Vida Coral':              'Av. Tude Moutinho, 1053, Colônia Terra Nova, Manaus, AM',
                    'Conquista Jardim Norte':       'Rua Vicente Martins, 900, Santa Etelvina, Manaus, AM',
                    'Viva Vida Rio Amazonas':       'Av. do Turismo, 12686, Tarumã, Manaus, AM',
                    'Bosque das Torres':            'Rua Dona Debla Henriques, 450, Lago Azul, Manaus, AM',
                    'Parque Ville Lírio Azul':      'Av. Santa Tereza D\'Avila, 1096, Lago Azul, Manaus, AM',
                    'Amazon Boulevard Classic':     'Av. Torquato Tapajós, 1357, Bairro da Paz, Manaus, AM',
                    'Amazon Boulevard Prime':       'Av. Torquato Tapajós, 1357, Bairro da Paz, Manaus, AM',
                    'Città Oasis Azzure':           'Rua Santa Bárbara, 200, Flores, Manaus, AM',
                    'Zenith Condomínio Clube':      'Rua Rio Amazonas, 409, São Francisco, Manaus, AM',
                    'Conquista Topázio':            'Av. Tude Moutinho, 945, Colônia Terra Nova, Manaus, AM',
                    'Conquista Rio Negro':          'Rua Frederico Baird, 2990, Ponta Negra, Manaus, AM',
                    'Viva Vida Rio Tapajós':        'Av. do Turismo, 12850, Tarumã, Manaus, AM',
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
                    <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${closingPoi ? 'poi-backdrop-out' : 'poi-backdrop'}`} onClick={closePoi}>
                        <div className={`rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border ${closingPoi ? 'poi-modal-close' : 'poi-modal-open'} ${modoNoturno ? 'bg-slate-800/80 border-slate-700/60 backdrop-blur-xl' : 'bg-white/80 border-slate-200/60 backdrop-blur-xl'}`} onClick={e => e.stopPropagation()}>
                            {/* Header */}
                            <div className={`p-4 border-b flex justify-between items-center ${modoNoturno ? 'bg-slate-900/40 border-slate-700/60' : 'bg-white/60 border-slate-200/60'}`}>
                                <h3 className={`font-bold flex items-center gap-2 ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>
                                    <MapPin className="text-rose-500" size={20} /> Pontos de Referência
                                </h3>
                                <button onClick={closePoi} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"><X size={20} /></button>
                            </div>
                            <div className="p-5">
                                <h4 className={`font-bold text-lg mb-1 ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>{selectedPois.title}</h4>
                                {/* Dica de toque */}
                                <p className={`text-[10px] font-semibold mb-4 flex items-center gap-1.5 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>
                                    <span>👆</span> Toque em qualquer ponto para ver o caminho no mapa
                                </p>
                                <div className={`rounded-xl overflow-hidden border divide-y ${modoNoturno ? 'border-slate-700/60 divide-slate-700/60' : 'border-slate-100 divide-slate-100'}`}>
                                    {selectedPois.pois.map((poi, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => abrirMapa(poi)}
                                            style={{animationDelay:`${idx * 0.05}s`}}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all active:scale-[0.98] poi-item-in group
                                                ${modoNoturno
                                                    ? 'hover:bg-rose-500/10 active:bg-rose-500/15'
                                                    : 'hover:bg-rose-50 active:bg-rose-100'
                                                }`}
                                        >
                                            {/* Ícone de pin */}
                                            <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:scale-110
                                                ${modoNoturno ? 'bg-rose-500/15' : 'bg-rose-50'}`}>
                                                <MapPin size={13} className="text-rose-500" />
                                            </div>
                                            {/* Nome do POI */}
                                            <span className={`flex-1 text-sm font-medium leading-snug transition-colors
                                                ${modoNoturno
                                                    ? 'text-slate-300 group-hover:text-white'
                                                    : 'text-slate-600 group-hover:text-slate-900'
                                                }`}>
                                                {poi}
                                            </span>
                                            {/* Seta de rota */}
                                            <div className={`shrink-0 flex items-center gap-1 text-[9px] font-black uppercase tracking-wider transition-all opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0
                                                ${modoNoturno ? 'text-rose-400' : 'text-rose-500'}`}>
                                                <span>Ver rota</span>
                                                <ExternalLink size={10} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => { haptic(); closePoi(); }} className={`w-full mt-4 py-2.5 font-semibold rounded-xl transition-colors text-sm ${modoNoturno ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Fechar</button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* --- ÍCONE DO ROBÔ E BALÃO AMIGÁVEL --- */}
            <div className={`fixed bottom-8 right-8 z-40 flex flex-row items-end gap-3 transition-all duration-500 ${isChatOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
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
                    className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-800 text-white rounded-[1.75rem] hover:rounded-[1rem] hover:scale-110 active:scale-95 transition-all duration-500 flex items-center justify-center relative group overflow-hidden border-2 border-white/20"
                    style={{ animation: 'btn-glow-pulse 2s ease-in-out infinite' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {/* smooth sweep shine */}
                    <div className="btn-shine-layer absolute inset-0"></div>
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
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                    .animate-float { animation: float 4s ease-in-out infinite; }
                    @keyframes logo-flip {
                        0%   { transform: rotateY(0deg);   }
                        25%  { transform: rotateY(180deg); }
                        50%  { transform: rotateY(360deg); }
                        75%  { transform: rotateY(360deg); }
                        100% { transform: rotateY(360deg); }
                    }
                    @keyframes btn-glow-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0), 0 8px 32px rgba(59,130,246,0.45); transform: scale(1); } 50% { box-shadow: 0 0 0 8px rgba(99,102,241,0.18), 0 8px 40px rgba(59,130,246,0.7); transform: scale(1.03); } }
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
                    @keyframes cotacao-glow { 0%, 100% { box-shadow: 0 0 0 2px rgba(99,102,241,0.4), 0 0 12px rgba(99,102,241,0.5); } 50% { box-shadow: 0 0 0 4px rgba(99,102,241,0.2), 0 0 22px rgba(99,102,241,0.7); } }
                    .cotacao-btn { animation: cotacao-glow 2.2s ease-in-out infinite; }
                    @keyframes cotacao-shine { 0% { transform: translateX(-180%) skewX(-18deg); opacity:0; } 10% { opacity:1; } 55% { transform: translateX(280%) skewX(-18deg); opacity:0.8; } 100% { transform: translateX(280%) skewX(-18deg); opacity:0; } }
                    .cotacao-btn-shine { position:absolute; inset:0; overflow:hidden; border-radius:inherit; pointer-events:none; }
                    .cotacao-btn-shine::after { content:''; position:absolute; top:-20%; left:0; width:60%; height:140%; background: linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.28) 50%, transparent 90%); animation: cotacao-shine 3.2s ease-in-out infinite; }
                    @keyframes cotacao-modal-in { 0% { opacity:0; transform: translateY(100%); } 60% { opacity:1; transform: translateY(-4px); } 100% { opacity:1; transform: translateY(0); } }
                    @keyframes cotacao-modal-out { 0% { opacity:1; transform: translateY(0); } 100% { opacity:0; transform: translateY(100%); } }
                    .cotacao-modal-open { animation: cotacao-modal-in 0.45s cubic-bezier(0.34,1.2,0.64,1) both; }
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
                        .chat-folder-full { top: 12px !important; left: 12px !important; right: 12px !important; bottom: 12px !important; height: auto !important; border-radius: 1.5rem !important; }
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
                        <div style={{ position:'absolute', top:'-20%', left:0, width:'60%', height:'140%', background:'linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.16) 50%, transparent 90%)', animation: isCreatingFolder && folderSource === 'rapida' ? 'light-sweep 1.8s ease-in-out infinite' : 'cotacao-shine 3.5s ease-in-out infinite', transform:'skewX(-18deg)' }}></div>
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
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5" id="docs-grid">
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
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                        onClick={() => { if (!isDraggingActive) { haptic('light'); setFullscreenDoc(doc); } }}
                                        style={cardStyle}
                                        className={`relative group border-2 border-dashed ${extraClass} ${draggedItemIndex === index ? 'border-orange-400 scale-90 opacity-30 rotate-3' : (modoNoturno ? `border-transparent bg-slate-800 ${folderSource === 'rapida' ? 'hover:border-orange-500' : 'hover:border-indigo-500'}` : `border-transparent bg-white ${folderSource === 'rapida' ? 'hover:border-orange-300' : 'hover:border-indigo-300'}`)} rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-colors aspect-[3/4] flex flex-col cursor-move`}>
                                        <div className="absolute top-1 left-1 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-md z-10 backdrop-blur-sm"
                                            style={{ background: folderSource === 'rapida' ? 'rgba(124,58,27,0.85)' : 'rgba(67,56,202,0.85)' }}>{index + 1}</div>
                                        <button onClick={(e) => { e.stopPropagation(); haptic('heavy'); removeDoc(doc.id); }} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 active:opacity-100 transition-all z-10 hover:bg-red-600 shadow-lg"><Trash2 size={11} /></button>
                                        <div className={`flex-1 flex items-center justify-center overflow-hidden relative ${modoNoturno ? 'bg-slate-950' : 'bg-slate-100'}`}>
                                            {doc.previewUrl ? (
                                                <>
                                                    <img src={doc.previewUrl} alt="preview" className="w-full h-full object-cover" />
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
                                    {folderSource !== 'rapida' && <span className="absolute inset-0 cotacao-btn-shine pointer-events-none" style={{borderRadius:'1rem'}}></span>}
                                    <Wand2 size={16} className="relative z-10" />
                                    <span className="relative z-10">Finalizar PDF</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className={`border-t rounded-b-3xl shrink-0 flex flex-col transition-colors ${isCreatingFolder ? 'hidden' : ''} ${modoNoturno ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className="px-3 pt-2.5 pb-2 flex gap-1.5 items-center overflow-x-auto custom-scrollbar">
                        <button onClick={() => { haptic(); setFolderSource('manual'); setIsCreatingFolder(true); fileInputRef.current?.click(); }}
                            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all text-white relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }}>
                            <FolderPlus size={12} className="relative z-10" />
                            <span className="relative z-10">Pasta</span>
                        </button>
                        <button
                            onClick={(e) => {
                                haptic('medium');
                                const clicks = pastaRapidaClicksRef.current;
                                if (clicks < 5) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    pastaRapidaClicksRef.current = clicks + 1;
                                    localStorage.setItem('dst_pr_clicks', String(clicks + 1));
                                    setShowPastaRapidaInfo(true);
                                } else {
                                    setFolderSource('rapida');
                                    quickFolderInputRef.current?.click();
                                }
                            }}
                            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all text-white relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #f59e0b 100%)',
                                boxShadow: '0 0 0 3px rgba(249,115,22,0.35), 0 0 20px 6px rgba(249,115,22,0.45), 0 2px 8px rgba(0,0,0,0.2)',
                                animation: 'pr-pulse 1.6s ease-in-out infinite',
                            }}>
                            <span className="absolute inset-0 pasta-rapida-btn pointer-events-none" style={{borderRadius:'9999px'}}></span>
                            <Sparkles size={13} className="shrink-0 relative z-10" style={{filter:'drop-shadow(0 0 5px rgba(255,255,255,0.9))', animation:'spin 3s linear infinite'}} />
                            <span className="relative z-10" style={{textShadow:'0 1px 6px rgba(0,0,0,0.35)', letterSpacing:'0.08em'}}>Pasta Rápida IA</span>
                        </button>
                        <input type="file" ref={quickFolderInputRef} onChange={handleQuickFolderUpload} multiple accept="image/*,application/pdf" className="hidden" />
                        <div className={`shrink-0 w-px h-4 ${modoNoturno ? 'bg-slate-600' : 'bg-slate-200'}`}></div>
                        <button
                            onClick={() => {
                                haptic('medium');
                                if (isCotacaoUnlocked()) {
                                    setShowCotacaoModal(true);
                                } else {
                                    setCotacaoSenhaInput('');
                                    setCotacaoSenhaErro(false);
                                    setShowCotacaoSenha(true);
                                }
                            }}
                            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all text-white relative overflow-hidden cotacao-btn"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 45%, #7c3aed 100%)',
                                boxShadow: '0 0 0 2px rgba(99,102,241,0.4), 0 0 18px 4px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.2)',
                            }}>
                            <span className="absolute inset-0 cotacao-btn-shine pointer-events-none" style={{borderRadius:'9999px'}}></span>
                            <Calculator size={12} className="shrink-0 relative z-10" />
                            <span className="relative z-10" style={{textShadow:'0 1px 6px rgba(0,0,0,0.3)', letterSpacing:'0.08em'}}>$ Cotação</span>
                        </button>
                        {clientName && (
                            <span className={`shrink-0 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-full border ${modoNoturno ? 'bg-slate-700 border-slate-600 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                👤 {clientName}
                            </span>
                        )}
                        {/* DEV: reset contador pasta rápida — remova em produção */}
                        <button
                            onClick={() => { pastaRapidaClicksRef.current = 0; localStorage.setItem('dst_pr_clicks', '0'); }}
                            title="DEV: resetar contador pasta rápida"
                            className="shrink-0 text-[9px] font-bold px-2 py-1 rounded-full border border-dashed border-slate-300 text-slate-300 hover:border-orange-400 hover:text-orange-400 transition-all">
                            ↺ PR
                        </button>
                        {/* DEV: reset contador cotação — remova em produção */}
                        <button
                            onClick={() => { cotacaoClicksRef.current = 0; localStorage.setItem('dst_cot_clicks', '0'); }}
                            title="DEV: resetar contador cotação"
                            className="shrink-0 text-[9px] font-bold px-2 py-1 rounded-full border border-dashed border-slate-300 text-slate-300 hover:border-indigo-400 hover:text-indigo-400 transition-all">
                            ↺ COT
                        </button>
                    </div>
                    <div className="px-3 pb-3" style={{ paddingBottom: 'max(12px, calc(env(safe-area-inset-bottom) + 8px))' }}>
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
                    onClick={() => setIsFinalizingFolder(false)}>
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
                                <div style={{ position:'absolute', top:'-20%', left:0, width:'60%', height:'140%', background:'linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.22) 50%, transparent 90%)', animation: folderSource === 'rapida' ? 'light-sweep 1.6s ease-in-out infinite' : 'cotacao-shine 3.5s ease-in-out infinite', transform:'skewX(-18deg)' }}></div>
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
                                <button onClick={() => setIsFinalizingFolder(false)} className="bg-white/10 hover:bg-white/25 text-white p-2.5 rounded-2xl border border-white/20 transition-all backdrop-blur-sm">
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
                            <button onClick={() => { haptic('success'); generateClientPDF(); }} disabled={isChatLoading}
                                className="w-full text-xs text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest transition-all disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden active:scale-[0.98]"
                                style={folderSource === 'rapida'
                                    ? { background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #f59e0b 100%)', boxShadow: '0 4px 24px rgba(249,115,22,0.45)' }
                                    : { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 40%, #7c3aed 100%)', boxShadow: '0 4px 24px rgba(99,102,241,0.45)' }
                                }>
                                {folderSource === 'rapida'
                                    ? <span className="absolute inset-0 pasta-rapida-btn pointer-events-none" style={{borderRadius:'1rem'}}></span>
                                    : <span className="absolute inset-0 cotacao-btn-shine pointer-events-none" style={{borderRadius:'1rem'}}></span>
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
                                    style={{ maxHeight: 'calc(100vh - 100px)' }}
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

            {/* MODAL INFO COTAÇÃO — exibido nas 5 primeiras vezes */}
            {showCotacaoInfo && (
                <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
                    style={{ background: 'rgba(7,11,22,0.72)', backdropFilter: 'blur(18px) saturate(180%)', WebkitBackdropFilter: 'blur(18px) saturate(180%)' }}>
                    <div className={`animate-slide-up w-full sm:max-w-md flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl`}
                        style={{
                            maxHeight: '92dvh',
                            ...(modoNoturno ? {
                                background: 'rgba(13,18,36,0.97)',
                                backdropFilter: 'blur(28px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                                border: '1px solid rgba(99,102,241,0.25)',
                                boxShadow: '0 -8px 48px rgba(99,102,241,0.25), 0 24px 64px rgba(0,0,0,0.6)',
                            } : {
                                background: 'rgba(255,255,255,0.97)',
                                backdropFilter: 'blur(28px) saturate(200%)',
                                WebkitBackdropFilter: 'blur(28px) saturate(200%)',
                                border: '1px solid rgba(255,255,255,0.95)',
                                boxShadow: '0 -8px 48px rgba(99,102,241,0.18), 0 24px 64px rgba(0,0,0,0.12)',
                            })
                        }}
                        onClick={e => e.stopPropagation()}>

                        {/* Header fixo com shimmer */}
                        <div className="shrink-0 relative overflow-hidden rounded-t-3xl sm:rounded-t-3xl"
                            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 45%, #7c3aed 100%)', boxShadow: '0 4px 24px rgba(99,102,241,0.45)' }}>
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <div style={{ position:'absolute', top:'-20%', left:0, width:'60%', height:'140%', background:'linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.22) 50%, transparent 90%)', animation:'cotacao-shine 3.5s ease-in-out infinite', transform:'skewX(-18deg)' }}></div>
                            </div>
                            <div className="relative z-10 px-5 pt-5 pb-4 flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/15 p-2.5 rounded-2xl border border-white/25 backdrop-blur-md">
                                        <Calculator size={22} className="text-white" style={{filter:'drop-shadow(0 0 8px rgba(255,255,255,0.8))'}} />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-black text-xl uppercase tracking-widest drop-shadow-md">$ Cotação</h2>
                                        <p className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.15em]">Como funciona · Leia antes de usar</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Drag pill (mobile) */}
                        <div className="sm:hidden shrink-0 flex justify-center pt-2.5 pb-0.5">
                            <div className={`w-10 h-1 rounded-full ${modoNoturno ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                        </div>

                        {/* Conteúdo scrollável */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pt-4 pb-3 flex flex-col gap-3">

                            {/* O que é */}
                            <div className={`rounded-2xl p-4 border ${modoNoturno ? 'bg-indigo-950/50 border-indigo-500/25' : 'bg-indigo-50 border-indigo-100'}`}>
                                <p className={`font-black text-[11px] mb-2 uppercase tracking-widest flex items-center gap-1.5 ${modoNoturno ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                    💡 O que é a Cotação?
                                </p>
                                <p className={`text-[12.5px] leading-relaxed ${modoNoturno ? 'text-slate-300' : 'text-slate-700'}`}>
                                    A <strong>Cotação</strong> é o <strong>plano de parcelamento da entrada</strong> do imóvel — mostra ao cliente o <strong>ato, os sinais e as mensais</strong> que ele vai pagar durante as obras, respeitando as regras do perfil comercial escolhido.
                                </p>
                            </div>

                            {/* Passo a passo */}
                            <div className={`rounded-2xl p-4 border ${modoNoturno ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white border-slate-100'}`}>
                                <p className={`font-black text-[11px] mb-3 uppercase tracking-widest ${modoNoturno ? 'text-slate-300' : 'text-slate-600'}`}>📋 Como fazer</p>
                                <div className="flex flex-col gap-3.5">
                                    {[
                                        {
                                            n: '1', icon: '📎',
                                            label: 'Anexe a aprovação bancária (opcional)',
                                            desc: 'Cole prints ou PDF da aprovação — a IA lê e preenche automaticamente: valor do imóvel, parcela de financiamento, prazo e data de entrega.'
                                        },
                                        {
                                            n: '2', icon: '👤',
                                            label: 'Escolha o perfil comercial do cliente',
                                            desc: 'Selecione Diamante, Ouro, Prata, Bronze ou Aço. O perfil define as condições de PS, parcelas e comprometimento — não é baseado na renda do cliente.'
                                        },
                                        {
                                            n: '3', icon: '💰',
                                            label: 'Preencha os dados financeiros',
                                            desc: 'Informe o valor do imóvel, renda familiar, FGTS disponível, ato e parcela de financiamento. Se a aprovação foi anexada, os campos já estarão preenchidos.'
                                        },
                                        {
                                            n: '4', icon: '📊',
                                            label: 'Clique em "Calcular Cotação"',
                                            desc: 'A ferramenta gera 2 planos completos mostrando ato, sinais e mensais — tudo calculado dentro das regras do perfil selecionado.'
                                        },
                                    ].map(({ n, icon, label, desc }) => (
                                        <div key={n} className="flex items-start gap-3">
                                            <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white mt-0.5"
                                                style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
                                                {n}
                                            </div>
                                            <div>
                                                <p className={`text-[12px] font-black leading-tight ${modoNoturno ? 'text-slate-200' : 'text-slate-800'}`}>{icon} {label}</p>
                                                <p className={`text-[11.5px] leading-snug mt-0.5 ${modoNoturno ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dica extra */}
                            <div className={`rounded-2xl px-4 py-3 border flex items-start gap-3 ${modoNoturno ? 'bg-emerald-950/40 border-emerald-500/25' : 'bg-emerald-50 border-emerald-100'}`}>
                                <span className="text-base leading-none mt-0.5">✅</span>
                                <p className={`text-[11.5px] leading-snug ${modoNoturno ? 'text-emerald-300' : 'text-emerald-800'}`}>
                                    Pode calcular <strong>sem anexar</strong> nenhum documento — basta preencher os campos manualmente direto na tela de cotação.
                                </p>
                            </div>

                            {/* Aviso Bora Vender */}
                            <div className={`rounded-2xl px-4 py-3.5 border flex items-start gap-3 ${modoNoturno ? 'bg-amber-950/40 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
                                <span className="text-lg leading-none mt-0.5 shrink-0">⚠️</span>
                                <div>
                                    <p className={`font-black text-[11px] uppercase tracking-widest mb-1 ${modoNoturno ? 'text-amber-400' : 'text-amber-600'}`}>Sempre confirme no Bora Vender</p>
                                    <p className={`text-[11.5px] leading-snug ${modoNoturno ? 'text-amber-200/80' : 'text-amber-800'}`}>
                                        Os valores gerados aqui são uma <strong>estimativa de apoio à venda</strong>. Antes de apresentar ao cliente, <strong>confira os valores finais no Bora Vender</strong> — tabelas, subsídios e regras do MCMV podem variar por empreendimento.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Barra de progresso + botão — fixo no rodapé */}
                        <div className="shrink-0 px-5 pb-6 pt-3 flex flex-col gap-3 border-t"
                            style={{
                                paddingBottom: 'max(24px, calc(env(safe-area-inset-bottom) + 16px))',
                                borderColor: modoNoturno ? 'rgba(99,102,241,0.12)' : 'rgba(226,232,240,1)',
                            }}>
                            {cotacaoInfoCountdown > 0 && (
                                <div className="flex flex-col gap-1.5">
                                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${modoNoturno ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                        <div className="h-full rounded-full transition-all duration-1000 ease-linear"
                                            style={{ width: `${((10 - cotacaoInfoCountdown) / 10) * 100}%`, background: 'linear-gradient(90deg, #6366f1, #7c3aed)' }} />
                                    </div>
                                    <p className={`text-center text-[10px] font-black uppercase tracking-widest ${modoNoturno ? 'text-slate-600' : 'text-slate-400'}`}>
                                        leia antes de continuar — {cotacaoInfoCountdown}s
                                    </p>
                                </div>
                            )}
                            <button
                                disabled={cotacaoInfoCountdown > 0}
                                onClick={() => { setShowCotacaoInfo(false); setTimeout(() => setShowCotacaoModal(true), 150); }}
                                className={`w-full font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition-all flex items-center justify-center gap-2 relative overflow-hidden active:scale-[0.98] ${cotacaoInfoCountdown > 0 ? (modoNoturno ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-300 cursor-not-allowed') : 'text-white'}`}
                                style={cotacaoInfoCountdown > 0 ? {} : { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 45%, #7c3aed 100%)', boxShadow: '0 4px 20px rgba(99,102,241,0.45)' }}>
                                {cotacaoInfoCountdown > 0 ? (
                                    <span>Aguarde...</span>
                                ) : (
                                    <>
                                        <span className="absolute inset-0 cotacao-btn-shine pointer-events-none" style={{borderRadius:'1rem'}}></span>
                                        <Calculator size={15} className="relative z-10" style={{filter:'drop-shadow(0 0 6px rgba(255,255,255,0.9))'}} />
                                        <span className="relative z-10" style={{textShadow:'0 1px 6px rgba(0,0,0,0.3)'}}>Entendi, vamos calcular!</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL SENHA COTAÇÃO */}
            {showCotacaoSenha && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-5"
                    style={{ background: 'rgba(7,11,22,0.75)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
                    onClick={(e) => { if (e.target === e.currentTarget) { setShowCotacaoSenha(false); setCotacaoSenhaInput(''); setCotacaoSenhaErro(false); } }}>
                    <div className={`w-full max-w-xs rounded-3xl p-7 flex flex-col gap-5 shadow-2xl ${modoNoturno ? 'bg-[#0f1829] border border-slate-700/50' : 'bg-white border border-slate-200'}`}
                        style={{ animation: 'poi-modal-in 0.35s cubic-bezier(0.34,1.3,0.64,1) both' }}>
                        {/* Ícone */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1"
                                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </div>
                            <h2 className={`text-base font-black tracking-wide text-center ${modoNoturno ? 'text-white' : 'text-slate-900'}`}>ACESSO RESTRITO</h2>
                            <p className={`text-xs text-center leading-relaxed ${modoNoturno ? 'text-slate-400' : 'text-slate-500'}`}>
                                O gerador de cotação está em fase de testes e disponível apenas para administradores.
                            </p>
                        </div>
                        {/* Input senha */}
                        <div className="flex flex-col gap-2">
                            <input
                                type="password"
                                maxLength={6}
                                placeholder="Digite a senha"
                                value={cotacaoSenhaInput}
                                onChange={e => { setCotacaoSenhaInput(e.target.value); setCotacaoSenhaErro(false); }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        if (cotacaoSenhaInput === '6658') {
                                            localStorage.setItem('dst_cot_unlock', String(Date.now()));
                                            setShowCotacaoSenha(false);
                                            setCotacaoSenhaInput('');
                                            setTimeout(() => setShowCotacaoModal(true), 200);
                                        } else {
                                            setCotacaoSenhaErro(true);
                                        }
                                    }
                                }}
                                className={`w-full text-center text-xl font-black tracking-[0.4em] rounded-2xl px-4 py-4 outline-none border-2 transition-all ${
                                    cotacaoSenhaErro
                                        ? 'border-red-500 bg-red-50 text-red-600'
                                        : modoNoturno
                                            ? 'border-slate-600 bg-slate-800 text-white focus:border-indigo-500'
                                            : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-400'
                                }`}
                                autoFocus
                            />
                            {cotacaoSenhaErro && (
                                <p className="text-xs text-red-500 text-center font-bold animate-pulse">Senha incorreta. Tente novamente.</p>
                            )}
                        </div>
                        {/* Botões */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowCotacaoSenha(false); setCotacaoSenhaInput(''); setCotacaoSenhaErro(false); }}
                                className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${modoNoturno ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    if (cotacaoSenhaInput === '6658') {
                                        localStorage.setItem('dst_cot_unlock', String(Date.now()));
                                        setShowCotacaoSenha(false);
                                        setCotacaoSenhaInput('');
                                        setTimeout(() => setShowCotacaoModal(true), 200);
                                    } else {
                                        setCotacaoSenhaErro(true);
                                    }
                                }}
                                className="flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95"
                                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
                                Entrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL BOAS VINDAS */}
            {showBemVindo && (
                <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4 sm:p-6"
                    style={{ background: 'rgba(7,11,22,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
                    <div className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl ${modoNoturno ? 'bg-[#0f1829] border border-slate-700/60' : 'bg-white border border-slate-200'}`}
                        style={{ animation: 'poi-modal-in 0.4s cubic-bezier(0.34,1.2,0.64,1) both' }}>
                        {/* Header gradiente */}
                        <div className="relative overflow-hidden px-6 pt-7 pb-5"
                            style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1e2d4f 50%, #2d1b69 100%)' }}>
                            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(99,102,241,0.3) 0%, transparent 60%)' }}/>
                            <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                                <img src="https://i.postimg.cc/XpWRf9pj/logo.png" alt="Logo" className="w-12 h-12 object-contain rounded-xl mb-1"/>
                                <h2 className="text-white text-lg font-black tracking-widest uppercase">Bem-vindo!</h2>
                                <p className="text-slate-300 text-xs leading-relaxed">Confira as novidades da plataforma</p>
                            </div>
                        </div>
                        {/* Novidades */}
                        <div className="px-5 py-5 flex flex-col gap-3">
                            {/* Item 1 */}
                            <div className={`flex items-start gap-3 p-3.5 rounded-2xl ${modoNoturno ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#0ea5e9,#0284c7)' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                </div>
                                <div>
                                    <p className={`text-xs font-black uppercase tracking-wide ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>Pontos de Referência</p>
                                    <p className={`text-[11px] leading-relaxed mt-0.5 ${modoNoturno ? 'text-slate-400' : 'text-slate-500'}`}>Clique e veja a rota do ponto de referência em relação ao local do emprendimento no Google Maps.</p>
                                </div>
                            </div>
                            {/* Item 2 */}
                            <div className={`flex items-start gap-3 p-3.5 rounded-2xl ${modoNoturno ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                                </div>
                                <div>
                                    <p className={`text-xs font-black uppercase tracking-wide ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>Pasta Rápida</p>
                                    <p className={`text-[11px] leading-relaxed mt-0.5 ${modoNoturno ? 'text-slate-400' : 'text-slate-500'}`}>Coloque os documentos em qualquer formato e a IA irá organizar para você na ordem correta para o CCA. </p>
                                </div>
                            </div>
                            {/* Item 3 */}
                            <div className={`flex items-start gap-3 p-3.5 rounded-2xl ${modoNoturno ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                </div>
                                <div>
                                    <p className={`text-xs font-black uppercase tracking-wide ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>Chatbot Destemidos</p>
                                    <p className={`text-[11px] leading-relaxed mt-0.5 ${modoNoturno ? 'text-slate-400' : 'text-slate-500'}`}>Tire dúvidas sobre os empreendimentos com nosso assistente de IA treinado para te ajudar a vender mais.</p>
                                </div>
                            </div>
                            {/* Item 4 — Em breve */}
                            <div className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 border-dashed ${modoNoturno ? 'bg-indigo-950/40 border-indigo-700/50' : 'bg-indigo-50/60 border-indigo-200'}`}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className={`text-xs font-black uppercase tracking-wide ${modoNoturno ? 'text-indigo-300' : 'text-indigo-700'}`}>Cotação com IA</p>
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>Em breve</span>
                                    </div>
                                    <p className={`text-[11px] leading-relaxed mt-0.5 ${modoNoturno ? 'text-slate-400' : 'text-slate-500'}`}>Em breve você só vai precisar colar um <strong>print da sua aprovação</strong> e a cotação será gerada em segundos pela IA. 🚀</p>
                                </div>
                            </div>
                        </div>
                        {/* Botão fechar */}
                        <div className="px-5 pb-6">
                            <button
                                onClick={() => { setShowBemVindo(false); const v = parseInt(localStorage.getItem('dst_bv_count') || '0'); localStorage.setItem('dst_bv_count', String(v + 1)); }}
                                className="w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-white active:scale-95 transition-all"
                                style={{ background: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 45%,#7c3aed 100%)', boxShadow: '0 4px 20px rgba(99,102,241,0.45)' }}>
                                Entendido, vamos vender! 🔥
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL COTAÇÃO */}
            {showCotacaoModal && (
                <div className="fixed inset-0 z-[70] flex flex-col"
                    style={{ background: modoNoturno ? 'rgba(7,11,22,0.82)' : 'rgba(15,23,42,0.55)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
                    <div className={`cotacao-modal-open flex flex-col h-full w-full ${modoNoturno ? 'bg-[#0B1120]' : 'bg-slate-50'}`}
                        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>

                        {/* ── HEADER ── */}
                        <div className="shrink-0 relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 40%, #7c3aed 100%)',
                                boxShadow: '0 4px 32px rgba(99,102,241,0.45)',
                            }}>
                            {/* shimmer sweep */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <div style={{ position:'absolute', top:'-20%', left:0, width:'60%', height:'140%', background:'linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.18) 50%, transparent 90%)', animation:'cotacao-shine 3.5s ease-in-out infinite', transform:'skewX(-18deg)' }}></div>
                            </div>
                            <div className="relative z-10 px-5 pt-5 pb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-inner">
                                        <Calculator size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-black text-xl uppercase tracking-widest drop-shadow-md">$ Cotação</h2>
                                        <p className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.15em]">Plano de Entrada · IA</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { haptic(); setShowCotacaoModal(false); setCotacaoResult(null); setCotacaoFile(null); setPerfilSelecionado(null); setPerfilExpandido(null); setCotacaoData({ perfil:'', empreendimento:'', valorImovel:'', renda:'', financiamentoBanco:'', subsidio:'', fgts:'', atoCliente:'', parcelaFinanciamento:'', entrega:'' }); }}
                                    className="bg-white/10 hover:bg-white/25 active:scale-95 text-white p-2.5 rounded-2xl border border-white/20 transition-all backdrop-blur-sm">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* ── BODY ── */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-5 space-y-3">

                            {/* CARD: Anexar aprovação */}
                            <div
                                className={`rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                                    cotacaoFile
                                    ? (modoNoturno ? 'bg-indigo-900/30 border border-indigo-500/40 shadow-lg shadow-indigo-900/30' : 'bg-indigo-50 border border-indigo-200 shadow-lg shadow-indigo-100')
                                    : (modoNoturno ? 'bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500/50' : 'bg-white border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-md')
                                }`}
                                onClick={() => cotacaoFileRef.current?.click()}>
                                <input ref={cotacaoFileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setCotacaoFile(file);
                                    setCotacaoLoading(true);
                                    setCotacaoResult(null);
                                    try {
                                        // Converte para base64
                                        const toBase64 = (f) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(',')[1]); r.onerror = rej; r.readAsDataURL(f); });
                                        const b64 = await toBase64(file);
                                        // PDFs: converte para imagem via canvas (mesmo truque da Pasta Rápida)
                                        let mime = file.type.startsWith('image/') ? file.type : 'image/jpeg';
                                        let imgB64 = b64;
                                        if (file.type === 'application/pdf') {
                                            try {
                                                // Usa todas as páginas empilhadas — entrega/parcela costumam estar em pág 2+
                                                const preview = await generatePdfAllPages(file);
                                                if (preview) { imgB64 = preview.split(',')[1]; mime = 'image/jpeg'; }
                                                else {
                                                    const pg1 = await generatePdfPreview(file);
                                                    if (pg1) { imgB64 = pg1.split(',')[1]; mime = 'image/jpeg'; }
                                                }
                                            } catch { /* usa b64 original */ }
                                        }

                                        const PROMPT_COTACAO = `Você é um extrator de dados de documentos imobiliários brasileiros (Caixa Econômica Federal, Direcional, Riva). Analise TODO o documento visível e extraia os campos abaixo com máxima precisão.

CAMPO "parcelaFinanciamento" — ATENÇÃO: este é o campo mais difícil, leia com cuidado:
- É o valor MENSAL da prestação do financiamento bancário
- Nos documentos da CAIXA ECONÔMICA aparece como:
  • "Prestação" (coluna em tabela de amortização, use o valor do mês 1)
  • "Prestação Aprovada" ou "Prestação Máxima"
  • "Valor da Prestação" ou "Prestação do Financiamento"
  • "SIRIC" (sistema de análise de crédito — é o valor da prestação aprovada)
  • "1ª Prestação" ou "Primeira Prestação"
  • "Encargo Mensal" ou "Parcela Mensal"
  • "Comprometimento de Renda" — NÃO é isso, mas a prestação aparece próxima
- O valor geralmente está entre R$ 300 e R$ 5.000
- Se aparecer numa tabela com colunas, pegue o valor da linha do MÊS 1 ou PERÍODO 1
- Exemplo: "R$ 1.240,56" ou "1240,56"

CAMPO "entrega":
- Data prevista de conclusão/entrega do imóvel ao comprador
- Procure por: "previsão de entrega", "prazo de entrega", "conclusão prevista", "habite-se previsto", "data prevista de entrega", "entrega prevista"
- Pode estar no rodapé, notas de rodapé, ou corpo do documento
- Formato desejado: "Dez/2026", "Mar/2027", "06/2027"

CAMPO "empreendimento":
- Apenas o nome do condomínio/empreendimento (SEM endereço, SEM número)
- Procure no título, cabeçalho, logo, nome da unidade
- Exemplos: "Brisas do Horizonte", "Village Torres", "Parque Ville Lírio Azul"

DEMAIS CAMPOS:
- "valorImovel": "Valor final com desconto" > "Valor da unidade" > "Valor do imóvel" (número sem R$)
- "financiamentoBanco": valor TOTAL financiado pelo banco (não a parcela mensal)
- "renda": renda bruta familiar mensal
- "subsidio": subsídio MCMV / Governo Federal
- "fgts": FGTS a ser utilizado
- Campos não encontrados: ""

Responda SOMENTE com JSON puro (sem markdown, sem texto antes ou depois):
{"empreendimento":"","valorImovel":"","renda":"","financiamentoBanco":"","subsidio":"","fgts":"","parcelaFinanciamento":"","entrega":""}`;

                                        // Tenta modelos gratuitos com visão em cascata (igual Pasta Rápida)
                                        const modelos = [
                                            'google/gemini-2.0-flash-001',
                                            'google/gemini-flash-1.5',
                                            'meta-llama/llama-3.2-90b-vision-instruct',
                                        ];

                                        let parsed = null;
                                        for (const modelo of modelos) {
                                            try {
                                                const controller = new AbortController();
                                                const tid = setTimeout(() => controller.abort(), 20000);
                                                const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                                                    method: 'POST',
                                                    signal: controller.signal,
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${OPENROUTER_KEY}`,
                                                        'HTTP-Referer': window.location.origin,
                                                        'X-Title': 'Destemidos Imoveis'
                                                    },
                                                    body: JSON.stringify({
                                                        model: modelo,
                                                        max_tokens: 600,
                                                        temperature: 0.0,
                                                        messages: [{ role: 'user', content: [
                                                            { type: 'image_url', image_url: { url: `data:${mime};base64,${imgB64}` } },
                                                            { type: 'text', text: PROMPT_COTACAO }
                                                        ]}]
                                                    })
                                                });
                                                clearTimeout(tid);
                                                if (!resp.ok) { console.warn(`Cotação: modelo ${modelo} retornou ${resp.status}`); continue; }
                                                const data = await resp.json();
                                                const text = data.choices?.[0]?.message?.content || '';
                                                console.log(`📄 Cotação raw [${modelo}]:`, text);
                                                const clean = text.replace(/```json|```/g, '').trim();
                                                const match = clean.match(/\{[\s\S]*\}/);
                                                if (!match) { console.warn(`Cotação: sem JSON em ${modelo}`); continue; }
                                                parsed = JSON.parse(match[0]);
                                                console.log(`✅ Cotação extraída [${modelo}]:`, parsed);
                                                break;
                                            } catch (err) {
                                                console.warn(`Cotação: erro em ${modelo}:`, err.message);
                                            }
                                        }

                                        if (parsed) {
                                            // perfil NÃO é definido pelo documento — só o usuário clica
                                            const { perfil: _ignorado, ...dadosSemPerfil } = parsed;

                                            // Se a IA não trouxe entrega mas trouxe empreendimento,
                                            // busca a data no mapa interno
                                            if (!dadosSemPerfil.entrega && dadosSemPerfil.empreendimento) {
                                                const nomeDoc = dadosSemPerfil.empreendimento.toLowerCase();
                                                const EMPREEND_ENTREGA = {
                                                    'topazio':'Abr/2026','jardim botanico':'Nov/2026','jardim botânico':'Nov/2026',
                                                    'village':'Abr/2027','orquidea':'Abr/2027','orquídea':'Abr/2027',
                                                    'jardim norte':'Jun/2027','tapajos':'Ago/2027','tapajós':'Ago/2027',
                                                    'coral':'Mar/2028','marinas':'Mar/2028','bosque':'Jun/2028',
                                                    'brisas':'Ago/2028','lirio':'Nov/2028','lírio':'Nov/2028',
                                                    'rio negro':'Dez/2030',
                                                };
                                                for (const [chave, data] of Object.entries(EMPREEND_ENTREGA)) {
                                                    if (nomeDoc.includes(chave)) { dadosSemPerfil.entrega = data; break; }
                                                }
                                            }

                                            // Formata campos monetários vindos da IA
                                            const CAMPOS_BRL = ['valorImovel','renda','financiamentoBanco','subsidio','fgts','atoCliente','parcelaFinanciamento'];
                                            const formatBRL = (v) => {
                                                if (!v) return '';
                                                const digits = String(v).replace(/\D/g, '');
                                                if (!digits) return String(v);
                                                const num = parseInt(digits, 10);
                                                return (num / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                                            };
                                            const dadosFormatados = { ...dadosSemPerfil };
                                            CAMPOS_BRL.forEach(campo => {
                                                if (dadosFormatados[campo]) dadosFormatados[campo] = formatBRL(dadosFormatados[campo]);
                                            });
                                            setCotacaoData(prev => ({ ...prev, ...dadosFormatados }));
                                        }
                                    } catch (err) { console.error('Cotação IA error:', err); }
                                    finally { setCotacaoLoading(false); }
                                }} />
                                <div className="p-4 flex items-center gap-3.5">
                                    <div className={`p-3 rounded-2xl shrink-0 ${cotacaoFile ? 'bg-indigo-500/20' : (modoNoturno ? 'bg-slate-700' : 'bg-slate-100')}`}>
                                        {cotacaoLoading
                                            ? <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full" style={{animation:'spin 0.8s linear infinite'}}></div>
                                            : <Paperclip size={20} className={cotacaoFile ? 'text-indigo-400' : 'text-slate-400'} />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {cotacaoLoading ? (
                                            <div>
                                                <p className={`font-black text-sm ${modoNoturno ? 'text-indigo-300' : 'text-indigo-600'}`}>IA lendo documento...</p>
                                                <p className={`text-[10px] font-bold mt-0.5 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>Extraindo dados automaticamente</p>
                                            </div>
                                        ) : cotacaoFile ? (
                                            <div>
                                                <p className={`font-black text-sm truncate ${modoNoturno ? 'text-indigo-300' : 'text-indigo-700'}`}>✓ {cotacaoFile.name}</p>
                                                <p className={`text-[10px] font-bold mt-0.5 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>Toque para trocar o arquivo</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className={`font-black text-sm ${modoNoturno ? 'text-white' : 'text-slate-800'}`}>Anexar Aprovação do Cliente</p>
                                                <p className={`text-[10px] font-bold mt-0.5 ${modoNoturno ? 'text-slate-400' : 'text-slate-500'}`}>Cole prints ou PDF da aprovação · IA extrai os dados</p>
                                            </div>
                                        )}
                                    </div>
                                    {/* Botão Colar (Ctrl+V) */}
                                    <button
                                        onClick={async (ev) => {
                                            ev.stopPropagation();
                                            haptic('light');
                                            try {
                                                const items = await navigator.clipboard.read();
                                                for (const item of items) {
                                                    const imgType = item.types.find(t => t.startsWith('image/'));
                                                    if (imgType) {
                                                        const blob = await item.getType(imgType);
                                                        const file = new File([blob], 'print_colado.png', { type: imgType });
                                                        // Dispara o mesmo handler do input file
                                                        const dt = new DataTransfer();
                                                        dt.items.add(file);
                                                        cotacaoFileRef.current.files = dt.files;
                                                        cotacaoFileRef.current.dispatchEvent(new Event('change', { bubbles: true }));
                                                        return;
                                                    }
                                                }
                                                alert('Nenhuma imagem encontrada na área de transferência.');
                                            } catch { alert('Permissão negada ou área de transferência vazia.'); }
                                        }}
                                        className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${modoNoturno ? 'bg-slate-700 text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-300' : 'bg-slate-100 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600'}`}
                                        title="Colar print (Ctrl+V)">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                        </svg>
                                        Colar
                                    </button>
                                    <div className={`shrink-0 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${modoNoturno ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>IA</div>
                                </div>
                            </div>

                            {/* DIVIDER */}
                            <div className={`flex items-center gap-3 py-1`}>
                                <div className={`flex-1 h-px ${modoNoturno ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                                <span className={`text-[9px] font-black uppercase tracking-[0.18em] ${modoNoturno ? 'text-slate-600' : 'text-slate-400'}`}>ou preencha manualmente</span>
                                <div className={`flex-1 h-px ${modoNoturno ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                            </div>

                            {/* CAMPOS — agrupados em cards iOS */}

                            {/* LINHA 1: Perfil do Cliente */}
                            {(() => {
                                const PERFIS = [
                                    { id: 'diamante', label: 'Diamante', emoji: '💎', ativo: { bg: 'linear-gradient(135deg, #bae6fd 0%, #38bdf8 40%, #0284c7 100%)', shadow: '0 4px 16px rgba(56,189,248,0.5)' }, porcentagens: [{ l: 'PS', v: '25%' }, { l: 'Parcelas', v: '84x' }, { l: 'Fin.+PS', v: '≤50%' }, { l: 'PS solo', v: '≤20%' }] },
                                    { id: 'ouro',     label: 'Ouro',     emoji: '🥇', ativo: { bg: 'linear-gradient(135deg, #fef08a 0%, #fbbf24 40%, #b45309 100%)', shadow: '0 4px 16px rgba(251,191,36,0.5)' },  porcentagens: [{ l: 'PS', v: '20%' }, { l: 'Parcelas', v: '84x' }, { l: 'Fin.+PS', v: '≤50%' }, { l: 'PS solo', v: '≤20%' }] },
                                    { id: 'prata',    label: 'Prata',    emoji: '🥈', ativo: { bg: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 40%, #475569 100%)', shadow: '0 4px 16px rgba(148,163,184,0.5)' }, porcentagens: [{ l: 'PS', v: '18%' }, { l: 'Parcelas', v: '84x' }, { l: 'Fin.+PS', v: '≤48%' }, { l: 'PS solo', v: '≤18%' }] },
                                    { id: 'bronze',   label: 'Bronze',   emoji: '🥉', ativo: { bg: 'linear-gradient(135deg, #fcd9b6 0%, #b87333 40%, #7c3a1e 100%)', shadow: '0 4px 16px rgba(184,115,51,0.5)' },  porcentagens: [{ l: 'PS', v: '15%' }, { l: 'Parcelas', v: '84x' }, { l: 'Fin.+PS', v: '≤45%' }, { l: 'PS solo', v: '≤15%' }] },
                                    { id: 'aco',      label: 'Aço',      emoji: '⚙️', ativo: { bg: 'linear-gradient(135deg, #e2e8f0 0%, #4b5563 40%, #111827 100%)', shadow: '0 4px 16px rgba(75,85,99,0.5)' },    porcentagens: [{ l: 'PS', v: '12%' }, { l: 'Parcelas', v: '84x' }, { l: 'Fin.+PS', v: '≤40%' }, { l: 'PS solo', v: '≤10%' }] },
                                ];
                                return (
                                    <div>

                                        {/* Card Perfil */}
                                        <div className="flex flex-col">
                                            <p className={`text-[9px] font-black uppercase tracking-[0.18em] mb-2 ml-1 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>Perfil Comercial</p>
                                            <div className={`flex-1 rounded-3xl border transition-colors flex flex-col justify-center px-4 py-4 ${modoNoturno ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-100 shadow-sm'}`}>
                                                <label className={`block text-[9px] font-black uppercase tracking-widest mb-1 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>👤 Perfil Comercial do Cliente</label>
                                                <p className={`text-[9px] mb-3 ${modoNoturno ? 'text-slate-600' : 'text-slate-400'}`}>Define as condições de PS e comprometimento — não é baseado na renda</p>
                                                {/* Pílulas de perfil — overflow:hidden no container, cada pílula cresce/encolhe */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
                                                    {PERFIS.map(p => {
                                                        const sel = perfilSelecionado === p.id;
                                                        const empurrado = perfilSelecionado !== null && !sel;
                                                        return (
                                                            <div key={p.id}
                                                                onClick={() => { haptic('light'); setPerfilSelecionado(sel ? null : p.id); }}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center',
                                                                    flexShrink: empurrado ? 1 : 0,
                                                                    flexGrow: sel ? 1 : 0,
                                                                    flexBasis: empurrado ? '0px' : '40px',
                                                                    minWidth: empurrado ? '0px' : '40px',
                                                                    maxWidth: empurrado ? '0px' : sel ? '9999px' : '40px',
                                                                    height: '40px',
                                                                    borderRadius: '999px',
                                                                    overflow: 'clip',
                                                                    opacity: empurrado ? 0 : 1,
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.42s cubic-bezier(0.34,1.05,0.64,1)',
                                                                    background: sel ? p.ativo.bg : (modoNoturno ? '#1e293b' : '#f1f5f9'),
                                                                    boxShadow: sel ? p.ativo.shadow : 'none',
                                                                    border: `2px solid ${sel ? 'transparent' : (modoNoturno ? '#334155' : '#e2e8f0')}`,
                                                                    paddingLeft: sel ? '10px' : '0',
                                                                    paddingRight: sel ? '12px' : '0',
                                                                    gap: sel ? '8px' : '0',
                                                                    whiteSpace: 'nowrap',
                                                                    backgroundSize: '200% 100%',
                                                                    backgroundPosition: 'left center',
                                                                }}>
                                                                {/* Emoji — sempre centrado quando fechado, à esquerda quando aberto */}
                                                                <span style={{
                                                                    fontSize: '18px', lineHeight: 1,
                                                                    width: sel ? 'auto' : '40px',
                                                                    flexShrink: 0,
                                                                    textAlign: 'center',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    filter: sel ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' : 'none',
                                                                    transition: 'filter 0.3s, width 0.42s cubic-bezier(0.34,1.05,0.64,1)',
                                                                }}>{p.emoji}</span>

                                                                {/* Conteúdo expandido */}
                                                                <div style={{
                                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                                    overflow: 'hidden',
                                                                    opacity: sel ? 1 : 0,
                                                                    maxWidth: sel ? '600px' : '0px',
                                                                    transition: `opacity ${sel ? '0.18s ease 0.22s' : '0.1s'}, max-width ${sel ? '0.42s cubic-bezier(0.34,1.05,0.64,1)' : '0.2s'}`,
                                                                    pointerEvents: 'none',
                                                                }}>
                                                                    <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.95)', textShadow: '0 1px 3px rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>{p.label}</span>
                                                                    <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                                                                    <div style={{ display: 'flex', gap: '3px' }}>
                                                                        {p.porcentagens.map((pc, i) => (
                                                                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2px 5px', borderRadius: '6px', background: 'rgba(0,0,0,0.25)', flexShrink: 0 }}>
                                                                                <span style={{ fontSize: '6px', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{pc.l}</span>
                                                                                <span style={{ fontSize: '9px', fontWeight: 900, color: '#fff', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{pc.v}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                );
                            })()}

                            {/* CARD EMPREENDIMENTO */}
                            <div>
                                <p className={`text-[9px] font-black uppercase tracking-[0.18em] mb-2 ml-1 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>Empreendimento</p>
                                <div className={`rounded-3xl overflow-hidden border ${modoNoturno ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <div className="px-4 pt-3.5 pb-2 flex items-center gap-3">
                                        <span className="text-base shrink-0 w-6 text-center">🏗️</span>
                                        <div className="flex-1 min-w-0">
                                            <label className={`block text-[9px] font-black uppercase tracking-widest mb-0.5 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>Nome do Empreendimento</label>
                                            <input
                                                type="text"
                                                value={cotacaoData.empreendimento || ''}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    setCotacaoData(p => ({ ...p, empreendimento: val }));
                                                    // Auto-preenche entrega ao digitar
                                                    const low = val.toLowerCase();
                                                    const EMAP = {
                                                        'topazio':{'entrega':'04/2026'},'jardim botanico':{'entrega':'11/2026'},'jardim botânico':{'entrega':'11/2026'},
                                                        'village':{'entrega':'04/2027'},'orquidea':{'entrega':'04/2027'},'orquídea':{'entrega':'04/2027'},
                                                        'jardim norte':{'entrega':'06/2027'},'tapajos':{'entrega':'08/2027'},'tapajós':{'entrega':'08/2027'},
                                                        'coral':{'entrega':'03/2028'},'marinas':{'entrega':'03/2028'},'bosque':{'entrega':'06/2028'},
                                                        'brisas':{'entrega':'08/2028'},'lirio':{'entrega':'11/2028'},'lírio':{'entrega':'11/2028'},
                                                        'rio negro':{'entrega':'12/2030'},
                                                    };
                                                    for (const [chave, dados] of Object.entries(EMAP)) {
                                                        if (low.includes(chave)) {
                                                            setCotacaoData(p => ({ ...p, empreendimento: val, entrega: dados.entrega }));
                                                            break;
                                                        }
                                                    }
                                                }}
                                                placeholder="Ex: Brisas do Horizonte"
                                                className={`w-full text-sm font-semibold bg-transparent border-none outline-none placeholder-slate-400/60 ${modoNoturno ? 'text-white' : 'text-slate-800'}`}
                                            />
                                        </div>
                                        {cotacaoData.empreendimento ? (
                                            <button onClick={() => setCotacaoData(p => ({ ...p, empreendimento: '', entrega: '' }))}
                                                className={`shrink-0 p-1.5 rounded-full transition-all ${modoNoturno ? 'text-slate-500 hover:text-red-400' : 'text-slate-300 hover:text-red-400'}`}>
                                                <X size={13} />
                                            </button>
                                        ) : null}
                                    </div>
                                    {/* Chips de seleção rápida */}
                                    <div className="px-4 pb-3.5 flex flex-wrap gap-1.5">
                                        {[
                                            { label: 'Topázio',        nome: 'Conquista Topázio',        entrega: '04/2026' },
                                            { label: 'Jd. Botânico',   nome: 'Conquista Jardim Botânico', entrega: '11/2026' },
                                            { label: 'Village Torres', nome: 'Village Torres',            entrega: '04/2027' },
                                            { label: 'Orquídea',       nome: 'Parque Ville Orquídea',     entrega: '04/2027' },
                                            { label: 'Jd. Norte',      nome: 'Conquista Jardim Norte',    entrega: '06/2027' },
                                            { label: 'Tapajós',        nome: 'Viva Vida Rio Tapajós',     entrega: '08/2027' },
                                            { label: 'Coral',          nome: 'Viva Vida Coral',           entrega: '03/2028' },
                                            { label: 'Bosque Torres',  nome: 'Bosque das Torres',         entrega: '06/2028' },
                                            { label: 'Brisas',         nome: 'Brisas do Horizonte',       entrega: '08/2028' },
                                            { label: 'Lírio Azul',     nome: 'Parque Ville Lírio Azul',   entrega: '11/2028' },
                                            { label: 'Rio Negro',      nome: 'Conquista Rio Negro',       entrega: '12/2030' },
                                        ].map(ape => {
                                            const sel = cotacaoData.empreendimento === ape.nome;
                                            return (
                                                <button
                                                    key={ape.label}
                                                    onClick={() => {
                                                        haptic('light');
                                                        if (sel) {
                                                            setCotacaoData(p => ({ ...p, empreendimento: '', entrega: '' }));
                                                        } else {
                                                            setCotacaoData(p => ({ ...p, empreendimento: ape.nome, entrega: ape.entrega }));
                                                        }
                                                    }}
                                                    className="text-[10px] font-black px-2.5 py-1 rounded-full transition-all active:scale-95"
                                                    style={sel ? {
                                                        background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                                                        color: 'white',
                                                        boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
                                                    } : {
                                                        background: modoNoturno ? '#1e293b' : '#f1f5f9',
                                                        color: modoNoturno ? '#94a3b8' : '#64748b',
                                                        border: `1px solid ${modoNoturno ? '#334155' : '#e2e8f0'}`,
                                                    }}>
                                                    {sel ? '✓ ' : ''}{ape.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {/* Indicador de entrega auto-preenchida */}
                                    {cotacaoData.empreendimento && cotacaoData.entrega && (
                                        <div className={`mx-4 mb-3.5 px-3 py-2 rounded-xl flex items-center gap-2 ${modoNoturno ? 'bg-indigo-950/60 border border-indigo-700/40' : 'bg-indigo-50 border border-indigo-100'}`}>
                                            <span className="text-sm">🔑</span>
                                            <p className={`text-[11px] font-bold ${modoNoturno ? 'text-indigo-300' : 'text-indigo-600'}`}>
                                                Entrega preenchida automaticamente: <strong>{cotacaoData.entrega}</strong>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* LINHA 2: Financeiro e Benefícios lado a lado */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '12px', alignItems: 'start' }}>
                                    {/* GRUPO: FINANCEIRO */}
                                    <div>
                                        <p className={`text-[9px] font-black uppercase tracking-[0.18em] mb-2 ml-1 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>Financeiro</p>
                                        <div className={`rounded-3xl overflow-hidden border ${modoNoturno ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-100 shadow-sm'}`}>

                                            {/* ATO DO CLIENTE — destaque no topo */}
                                            <div className={`px-4 py-3 ${modoNoturno ? 'bg-indigo-950/60 border-b border-indigo-800/40' : 'bg-indigo-50 border-b border-indigo-100'}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-base shrink-0 w-6 text-center">💵</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5 mb-0.5">
                                                            <label className={`text-[9px] font-black uppercase tracking-widest ${modoNoturno ? 'text-indigo-400' : 'text-indigo-500'}`}>Ato do Cliente</label>
                                                            <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${modoNoturno ? 'bg-indigo-800/60 text-indigo-300' : 'bg-indigo-100 text-indigo-500'}`}>negocia</span>
                                                        </div>
                                                        <input type="text" inputMode="numeric" value={cotacaoData.atoCliente || ''} onChange={e => { const maskBRL = (v) => { const d=v.replace(/\D/g,''); if(!d) return ''; return (parseInt(d,10)/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }; setCotacaoData(p => ({...p, atoCliente: maskBRL(e.target.value)})); }} placeholder="R$ 1.000,00 (padrão)" className={`w-full text-sm font-bold bg-transparent border-none outline-none placeholder-slate-400/60 ${modoNoturno ? 'text-indigo-200' : 'text-indigo-700'}`} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Demais campos financeiros */}
                                            <div className={`divide-y ${modoNoturno ? 'divide-slate-700/60' : 'divide-slate-100'}`}>
                                                {[
                                                    { key: 'valorImovel',        label: 'Valor do Imóvel',       placeholder: 'R$ 230.000,00',    icon: '🏠' },
                                                    { key: 'renda',              label: 'Renda',                 placeholder: 'R$ 3.500,00',      icon: '📊' },
                                                    { key: 'financiamentoBanco', label: 'Financiamento Banco',   placeholder: 'Caixa, Bradesco...', icon: '🏦' },
                                                ].map(field => (
                                                    <div key={field.key} className="flex items-center px-4 py-3 gap-3">
                                                        <span className="text-base shrink-0 w-6 text-center">{field.icon}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <label className={`block text-[9px] font-black uppercase tracking-widest mb-0.5 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>{field.label}</label>
                                                            <input type="text" inputMode={['valorImovel','renda'].includes(field.key)?'numeric':'text'} value={cotacaoData[field.key] || ''} onChange={e => { const mkBRL=(v)=>{const d=v.replace(/\D/g,'');if(!d)return '';return (parseInt(d,10)/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}; const val=['valorImovel','renda'].includes(field.key)?mkBRL(e.target.value):e.target.value; setCotacaoData(p => ({...p, [field.key]: val})); }} placeholder={field.placeholder} className={`w-full text-sm font-semibold bg-transparent border-none outline-none placeholder-slate-400/60 ${modoNoturno ? 'text-white' : 'text-slate-800'}`} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* GRUPO: BENEFÍCIOS & PARCELA */}
                                    <div>
                                        <p className={`text-[9px] font-black uppercase tracking-[0.18em] mb-2 ml-1 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>Benefícios & Parcela</p>
                                        <div className={`rounded-3xl overflow-hidden border divide-y ${modoNoturno ? 'bg-slate-800/80 border-slate-700/60 divide-slate-700/60' : 'bg-white border-slate-100 divide-slate-100 shadow-sm'}`}>
                                            {[
                                                { key: 'subsidio',            label: 'Subsídio',                  placeholder: 'R$ 55.000,00',    icon: '🎁' },
                                                { key: 'fgts',                label: 'FGTS',                      placeholder: 'R$ 12.000,00',    icon: '📋' },
                                                { key: 'parcelaFinanciamento', label: 'Prestação Financiamento',   placeholder: 'R$ 780,00/mês',   icon: '📅' },
                                                { key: 'entrega',             label: 'Entrega',                   placeholder: 'Dezembro/2026',   icon: '🔑' },

                                            ].map(field => (
                                                <div key={field.key} className="flex items-center px-4 py-3 gap-3">
                                                    <span className="text-base shrink-0 w-6 text-center">{field.icon}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <label className={`block text-[9px] font-black uppercase tracking-widest mb-0.5 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>{field.label}</label>
                                                        <input type="text" inputMode={['subsidio','fgts','parcelaFinanciamento'].includes(field.key)?'numeric':'text'} value={cotacaoData[field.key] || ''} onChange={e => { const mkBRL=(v)=>{const d=v.replace(/\D/g,'');if(!d)return '';return (parseInt(d,10)/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}; const val=['subsidio','fgts','parcelaFinanciamento'].includes(field.key)?mkBRL(e.target.value):e.target.value; setCotacaoData(p => ({...p, [field.key]: val})); }} placeholder={field.placeholder} className={`w-full text-sm font-semibold bg-transparent border-none outline-none placeholder-slate-400/60 ${modoNoturno ? 'text-white' : 'text-slate-800'}`} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>{/* fim grid formulário */}

                            {/* RESULTADO — 3 PLANOS EM CARDS */}
                            {Array.isArray(cotacaoResult) && (() => {
                                const CORES = [
                                    { bg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 40%, #7c3aed 100%)', shadow: '0 8px 28px rgba(99,102,241,0.30)' },
                                    { bg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 40%, #0369a1 100%)', shadow: '0 8px 28px rgba(14,165,233,0.30)' },
                                    { bg: 'linear-gradient(135deg, #10b981 0%, #059669 40%, #047857 100%)', shadow: '0 8px 28px rgba(16,185,129,0.30)' },
                                ];
                                const planos = cotacaoResult.slice(0, 2); // 2 cards: + Anuais e Ato à Vista
                                const meta   = cotacaoResult[2] || {};
                                const todosReprovados = planos.every(pl => !pl.aprovado);
                                return (
                                    <div>
                                        <p className={`text-[9px] font-black uppercase tracking-[0.18em] mb-3 ml-1 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>Planos de Pagamento</p>
                                        {/* Banner renda mínima quando todos reprovam */}
                                        {todosReprovados && meta.rendaMinima && (
                                            <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-3" style={{background: modoNoturno ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)'}}>
                                                <span className="text-xl shrink-0">📊</span>
                                                <div>
                                                    <p className="text-xs font-black text-red-500 uppercase tracking-wide mb-0.5">Renda insuficiente para este perfil</p>
                                                    <p className={`text-xs font-semibold ${modoNoturno ? 'text-slate-300' : 'text-slate-600'}`}>
                                                        Renda mínima necessária: <span className="font-black text-red-400">{meta.rendaMinima.toLocaleString('pt-BR', {style:'currency',currency:'BRL'})}</span>
                                                        <span className={`ml-1 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>(renda informada: {meta.renda.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})})</span>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {/* Análise da IA */}
                                        {meta.analiseIA ? (
                                            <div className="mb-4 rounded-2xl px-4 py-3 flex items-start gap-3" style={{background: modoNoturno ? 'rgba(99,102,241,0.10)' : 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.20)'}}>
                                                <span className="text-lg shrink-0 mt-0.5">🤖</span>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-wide mb-1" style={{color:'#818cf8'}}>Análise da IA</p>
                                                    <p className={`text-xs leading-relaxed ${modoNoturno ? 'text-slate-300' : 'text-slate-600'}`}>{meta.analiseIA}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-4 rounded-2xl px-4 py-2 flex items-center gap-2" style={{background: modoNoturno ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)'}}>
                                                <span className="text-sm shrink-0">🤖</span>
                                                <p className={`text-[10px] ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>Analisando cotação com IA…</p>
                                            </div>
                                        )}
                                        {/* Grid: 1 col mobile, 3 col desktop */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '12px' }}>
                                            {planos.map((plano, idx) => {
                                                const cor = CORES[plano.cor ?? idx] ?? CORES[2];
                                                return (
                                                    <div key={idx} className="rounded-3xl overflow-hidden flex flex-col"
                                                        style={{ boxShadow: cor.shadow, background: modoNoturno ? '#1e293b' : '#fff', border: modoNoturno ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}>

                                                        {/* Header */}
                                                        <div className="px-4 py-3 flex items-center justify-between" style={{ background: cor.bg }}>
                                                            <span className="text-white font-black text-sm tracking-wide">{plano.label}</span>
                                                            <span className={`text-xs font-black px-2.5 py-1 rounded-full ${plano.aprovado ? 'bg-white/25 text-white' : 'bg-black/20 text-white/80'}`}>
                                                                {plano.aprovado ? '✅ Aprovado' : '❌ Reprovado'}
                                                            </span>
                                                        </div>

                                                        <div className="p-4 flex flex-col gap-3 flex-1">
                                                            {/* Composição */}
                                                            <div>
                                                                <p className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>🏠 Composição</p>
                                                                <div className={`rounded-2xl px-3 py-2 text-xs space-y-1 ${modoNoturno ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                                                    <div className="flex justify-between"><span className={modoNoturno?'text-slate-400':'text-slate-500'}>Imóvel</span><span className={`font-bold ${modoNoturno?'text-white':'text-slate-800'}`}>{plano.valorImovel}</span></div>
                                                                    {plano.financBanco && <div className="flex justify-between"><span className={modoNoturno?'text-slate-400':'text-slate-500'}>Financiamento banco</span><span className={`font-bold ${modoNoturno?'text-white':'text-slate-800'}`}>{plano.financBanco}</span></div>}
                                                                    {plano.subsidio && <div className="flex justify-between"><span className={modoNoturno?'text-slate-400':'text-slate-500'}>Subsídio</span><span className="font-bold text-emerald-500">{plano.subsidio}</span></div>}
                                                                    {plano.fgts && <div className="flex justify-between"><span className={modoNoturno?'text-slate-400':'text-slate-500'}>FGTS</span><span className="font-bold text-emerald-500">{plano.fgts}</span></div>}
                                                                    <div className="flex justify-between pt-1 border-t" style={{borderColor:modoNoturno?'#334155':'#e2e8f0'}}>
                                                                        <span className={modoNoturno?'text-slate-400':'text-slate-500'}>Entrada bruta</span>
                                                                        <span className={`font-bold ${modoNoturno?'text-white':'text-slate-800'}`}>{plano.entradaBruta}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className={`font-medium ${modoNoturno?'text-indigo-300':'text-indigo-600'}`}>Benefício PS (Direcional parcela)</span>
                                                                        <span className={`font-bold ${modoNoturno?'text-indigo-300':'text-indigo-600'}`}>{plano.benePS}</span>
                                                                    </div>
                                                                    {plano.excessoAto && (
                                                                        <div className="flex justify-between">
                                                                            <span className={`text-[10px] ${modoNoturno?'text-emerald-400':'text-emerald-600'}`}>↳ ato abateu PS em</span>
                                                                            <span className={`text-[10px] font-bold ${modoNoturno?'text-emerald-300':'text-emerald-600'}`}>−{plano.excessoAto}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex justify-between pt-1 border-t" style={{borderColor:modoNoturno?'#334155':'#e2e8f0'}}>
                                                                        <span className={`font-bold ${modoNoturno?'text-amber-300':'text-amber-600'}`}>
                                                                            {plano.sinais ? 'Ato + Sinais (cliente paga)' : 'Ato paga entrada'}
                                                                        </span>
                                                                        <span className={`font-bold ${modoNoturno?'text-amber-300':'text-amber-600'}`}>{plano.atoSinaisTotal}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Como o cliente paga */}
                                                            <div>
                                                                <p className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>💰 Como o cliente paga</p>
                                                                <div className={`rounded-2xl px-3 py-2 text-xs space-y-1.5 ${modoNoturno ? 'bg-slate-800' : 'bg-slate-50'}`}>

                                                                    {/* Ato */}
                                                                    <div className="flex justify-between items-center">
                                                                        <span className={modoNoturno?'text-slate-400':'text-slate-500'}>✍️ Ato <span className={`text-[9px] ${modoNoturno?'text-slate-600':'text-slate-400'}`}>(assinatura)</span></span>
                                                                        <span className={`font-black ${modoNoturno?'text-white':'text-slate-800'}`}>{plano.ato}</span>
                                                                    </div>

                                                                    {/* Sinais — só se necessário */}
                                                                    {plano.sinais && (
                                                                        <div className="flex justify-between items-center">
                                                                            <span className={modoNoturno?'text-amber-400':'text-amber-600'}>📅 Sinais <span className="font-black">({plano.sinais.qtd}×)</span></span>
                                                                            <span className={`font-black ${modoNoturno?'text-amber-300':'text-amber-600'}`}>{plano.sinais.valor}/mês</span>
                                                                        </div>
                                                                    )}

                                                                    {/* PS 84x = entrada parcelada */}
                                                                    <div className="flex justify-between items-center pt-1 border-t" style={{borderColor:modoNoturno?'#334155':'#e2e8f0'}}>
                                                                        <span style={{color:'#818cf8'}}>🏠 PS <span className="font-black">84×</span> <span className={`text-[9px] font-normal`}>(entrada parcelada)</span></span>
                                                                        <span className="font-black" style={{color:'#818cf8'}}>{plano.parcelaPS}</span>
                                                                    </div>

                                                                    {/* Anuais */}
                                                                    {plano.anuais && (
                                                                        <div className="flex justify-between items-center">
                                                                            <span className={modoNoturno?'text-amber-400':'text-amber-600'}>🗓️ Anuais <span className={`text-[9px] font-normal`}>(todo dez)</span></span>
                                                                            <span className="font-black text-amber-500">{plano.anuais}</span>
                                                                        </div>
                                                                    )}

                                                                </div>
                                                            </div>

                                                            {/* 3 Regras */}
                                                            <div>
                                                                <p className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${modoNoturno ? 'text-slate-500' : 'text-slate-400'}`}>📋 3 Regras</p>
                                                                <div className="space-y-1.5">
                                                                    {plano.regras.map((r, ri) => {
                                                                        const rKey = `${idx}-${ri}`;
                                                                        const isOpen = openRegra === rKey;
                                                                        return (
                                                                        <div key={ri} className={`rounded-xl overflow-hidden ${r.ok ? (modoNoturno?'bg-emerald-900/30':'bg-emerald-50') : (modoNoturno?'bg-red-900/30':'bg-red-50')}`}>
                                                                            <button onClick={() => setOpenRegra(isOpen ? null : rKey)} className="w-full px-2.5 py-2 text-left">
                                                                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                                                                    <span className="text-[10px] font-black">{r.ok ? '✅' : '❌'} {r.rotulo} <span className={`text-[9px] font-normal ${modoNoturno?'text-slate-500':'text-slate-400'}`}>{isOpen ? '▲' : '▼'}</span></span>
                                                                                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${r.ok ? (modoNoturno?'bg-emerald-700/50 text-emerald-200':'bg-emerald-200 text-emerald-800') : (modoNoturno?'bg-red-700/50 text-red-200':'bg-red-200 text-red-800')}`}>
                                                                                        {r.pctAtual} / {r.pctLimite}
                                                                                    </span>
                                                                                </div>
                                                                                <span className={`text-[10px] ${r.ok ? (modoNoturno?'text-emerald-400':'text-emerald-600') : (modoNoturno?'text-red-400':'text-red-600')}`}>{r.detalhe}</span>
                                                                            </button>
                                                                            {isOpen && (
                                                                                <div className={`px-2.5 pb-2.5 pt-0 text-[10px] leading-relaxed border-t ${r.ok ? (modoNoturno?'border-emerald-800/40 text-emerald-300':'border-emerald-200 text-emerald-700') : (modoNoturno?'border-red-800/40 text-red-300':'border-red-200 text-red-700')}`}>
                                                                                    {r.descricao}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>

                                                            <p className={`text-[9px] ${modoNoturno?'text-slate-600':'text-slate-400'}`}>📌 Fator comercial 1.47146 × 84 parcelas{plano.fatorLabel ? ` · ${plano.fatorLabel}` : ''}</p>
                                                            {plano.rebalance && (
                                                                <div className={`mt-2 p-2 rounded-lg text-[10px] font-semibold ${modoNoturno?'bg-amber-900/30 text-amber-300':'bg-amber-50 text-amber-700'}`}>
                                                                    ⚖️ {plano.rebalance}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );                                            })}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Aviso Bora Vender nos resultados */}
                            {Array.isArray(cotacaoResult) && (
                                <div className={`rounded-2xl px-4 py-3.5 border flex items-start gap-3 ${modoNoturno ? 'bg-amber-950/40 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
                                    <span className="text-lg leading-none mt-0.5 shrink-0">⚠️</span>
                                    <div>
                                        <p className={`font-black text-[10px] uppercase tracking-widest mb-1 ${modoNoturno ? 'text-amber-400' : 'text-amber-600'}`}>Confirme no Bora Vender</p>
                                        <p className={`text-[11px] leading-snug ${modoNoturno ? 'text-amber-200/80' : 'text-amber-800'}`}>
                                            Estes valores são uma <strong>estimativa de apoio à venda</strong>. Sempre confirme os valores finais no <strong>Bora Vender</strong> antes de apresentar ao cliente.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="h-2"></div>
                        </div>

                        {/* ── FOOTER ── */}
                        <div className={`shrink-0 px-4 pt-3 border-t transition-colors ${modoNoturno ? 'border-slate-800 bg-[#0B1120]' : 'border-slate-100 bg-slate-50'}`}
                            style={{ paddingBottom: 'max(20px, calc(env(safe-area-inset-bottom) + 12px))' }}>
                            <button
                                onClick={() => {
                                    haptic('medium');
                                    setCotacaoResult(null);
                                    try {
                                        const PARAMS = {
                                            diamante: { psLimite: 0.25, condicao: 0.50, comprometimento: 0.20 },
                                            ouro:     { psLimite: 0.20, condicao: 0.50, comprometimento: 0.20 },
                                            prata:    { psLimite: 0.18, condicao: 0.48, comprometimento: 0.18 },
                                            bronze:   { psLimite: 0.15, condicao: 0.45, comprometimento: 0.15 },
                                            aco:      { psLimite: 0.12, condicao: 0.40, comprometimento: 0.10 },
                                        };

                                        // Mapa de empreendimentos: chave (substring) → { fator, entrega: 'MM/AAAA' }
                                        // Anuais = quantos dezembros há entre hoje e a entrega (exclusive)
                                        const EMPREEND_MAP = {
                                            'topazio':        { fator: 1.85,   entrega: '04/2026' },
                                            'jardim botanico':{ fator: 1.72,   entrega: '11/2026' },
                                            'jardim botânico':{ fator: 1.72,   entrega: '11/2026' },
                                            'village':        { fator: 1.6033, entrega: '04/2027' },
                                            'orquidea':       { fator: 1.6033, entrega: '04/2027' },
                                            'orquídea':       { fator: 1.6033, entrega: '04/2027' },
                                            'jardim norte':   { fator: 1.58,   entrega: '06/2027' },
                                            'tapajos':        { fator: 1.56,   entrega: '08/2027' },
                                            'tapajós':        { fator: 1.56,   entrega: '08/2027' },
                                            'coral':          { fator: 1.50,   entrega: '03/2028' },
                                            'marinas':        { fator: 1.50,   entrega: '03/2028' },
                                            'bosque':         { fator: 1.4579, entrega: '06/2028' },
                                            'brisas':         { fator: 1.44,   entrega: '08/2028' },
                                            'lirio':          { fator: 1.41,   entrega: '11/2028' },
                                            'lírio':          { fator: 1.41,   entrega: '11/2028' },
                                            'rio negro':      { fator: 1.25,   entrega: '12/2030' },
                                        };

                                        // Calcula quantos dezembros futuros há antes de uma data de entrega (MM/AAAA ou texto)
                                        const contarAnuais = (dataStr) => {
                                            if (!dataStr) return 0;
                                            // Tenta extrair MM/AAAA ou AAAA
                                            const matchMY = dataStr.match(/(\d{1,2})[\/\-](\d{4})/);
                                            const matchY  = dataStr.match(/\b(20\d{2})\b/);
                                            let mesEntrega, anoEntrega;
                                            if (matchMY) { mesEntrega = parseInt(matchMY[1]); anoEntrega = parseInt(matchMY[2]); }
                                            else if (matchY) { mesEntrega = 12; anoEntrega = parseInt(matchY[1]); }
                                            else return 0;
                                            const hoje = new Date();
                                            const anoHoje = hoje.getFullYear();
                                            const mesHoje = hoje.getMonth() + 1; // 1-12
                                            let count = 0;
                                            // Conta dezembros de (anoHoje) até (anoEntrega), exclusive o mês de entrega
                                            for (let ano = anoHoje; ano <= anoEntrega; ano++) {
                                                // Dezembro desse ano
                                                const dezMes = 12, dezAno = ano;
                                                // Já passou? (dezembro já foi esse ano)
                                                if (dezAno < anoHoje || (dezAno === anoHoje && dezMes <= mesHoje)) continue;
                                                // Depois da entrega?
                                                if (dezAno > anoEntrega || (dezAno === anoEntrega && dezMes >= mesEntrega)) continue;
                                                count++;
                                            }
                                            return count;
                                        };

                                        const toNum = (s) => s ? parseFloat(s.replace(/[R$\s.]/g, '').replace(',', '.')) || 0 : 0;
                                        const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                                        const pct = (v) => `${(v * 100).toFixed(0)}%`;

                                        const perfil        = perfilSelecionado;
                                        const p             = PARAMS[perfil];
                                        const valorImovel   = toNum(cotacaoData.valorImovel);
                                        const renda         = toNum(cotacaoData.renda);
                                        const financBanco   = toNum(cotacaoData.financiamentoBanco);
                                        const subsidio      = toNum(cotacaoData.subsidio);
                                        const fgts          = toNum(cotacaoData.fgts);
                                        // parcelaFinanc: valor digitado (aprovado pela Caixa) ou estimativa de 30% da renda
                                        const parcelaFinancDigitada = toNum(cotacaoData.parcelaFinanciamento);
                                        // Nos cálculos dos planos usa-se sempre o valor digitado (ou zero se não informado)
                                        const parcelaFinanc = parcelaFinancDigitada;
                                        const atoCliente    = toNum(cotacaoData.atoCliente) || 1000;
                                        const empreendNome  = (cotacaoData.empreendimento || '').toLowerCase();

                                        if (!perfil || !p)  { setCotacaoResult('⚠️ Selecione o perfil do cliente.'); throw new Error('sem perfil'); }
                                        if (!valorImovel)   { setCotacaoResult('⚠️ Informe o valor do imóvel.'); throw new Error('sem valor'); }
                                        if (!renda)         { setCotacaoResult('⚠️ Informe a renda do cliente.'); throw new Error('sem renda'); }

                                        // Detecta empreendimento pelo nome (fator fixo removido — usa Price dinâmico)
                                        let fatorLabel = null;
                                        let entregaDetectada = null;
                                        for (const [chave, dados] of Object.entries(EMPREEND_MAP)) {
                                            if (empreendNome.includes(chave)) {
                                                fatorLabel = cotacaoData.empreendimento;
                                                entregaDetectada = dados.entrega;
                                                break;
                                            }
                                        }

                                        // Anuais: usa data do campo entrega se preenchida, senão usa do mapa
                                        const dataEntregaFinal = cotacaoData.entrega || entregaDetectada || '';
                                        const nAnuais = contarAnuais(dataEntregaFinal);

                                        const valorAnual = renda * 0.5; // cada anual = 50% da renda do cliente
                                        const PARCELA_MIN = 300;

                                        // ══════════════════════════════════════════════════════════
                                        // FATOR COMERCIAL DINÂMICO (descoberto por engenharia reversa)
                                        // Fórmula: Parcela = Saldo PS × FATOR(meses) ÷ 84
                                        // Dois fatores validados contra o sistema oficial:
                                        //   Sem sinais (m=1): FATOR_BASE=1.471466 → parcela = PS × 1.471466 / 84
                                        //   Com sinais (m=1+N): FATOR_BASE=1.4582, incr=1.01106 → parcela = PS × 1.4582 × 1.01106^N / 84
                                        // ══════════════════════════════════════════════════════════
                                        const FATOR_BASE_SEM_SINAIS = 1.471466;
                                        const FATOR_BASE_COM_SINAIS = 1.4582;
                                        const FATOR_INCR  = 1.01106;
                                        const PARCELAS_PS = 84;
                                        const calcFator   = (sinais) => sinais === 0
                                            ? FATOR_BASE_SEM_SINAIS
                                            : FATOR_BASE_COM_SINAIS * Math.pow(FATOR_INCR, sinais);

                                        const calcPlano = ({ anuaisUsados = 0, atoExtra = 0, label = '', cor = 0, atoDisplay = null, atoNecessario = null }) => {
                                            // ══════════════════════════════════════════════════════════
                                            // CÁLCULO CORRETO — TOP-DOWN (igual ao sistema oficial)
                                            // NUNCA subtrair o teto do PS da Entrada Bruta
                                            // Sinais = Ato parcelado em 3x (cliente não tem o ato cheio)
                                            // ══════════════════════════════════════════════════════════

                                            // PASSO 1: Dívida real
                                            const entradaBruta = Math.max(0, valorImovel - financBanco - subsidio - fgts);

                                            // PASSO 2: Ato efetivo (o que o cliente realmente vai pagar como entrada total)
                                            // atoNecessario = ato cheio necessário (ex: R$ 10.000)
                                            // atoCliente    = o que o cliente tem no dia (ex: R$ 1.000)
                                            // Se atoNecessario > atoCliente → diferença vai para sinais (3x)
                                            const atoEfetivo = atoDisplay !== null ? atoDisplay
                                                             : atoNecessario !== null ? atoNecessario
                                                             : Math.max(0, atoCliente + atoExtra);

                                            // Sinais = ato parcelado: diferença entre o ato necessário e o que o cliente tem
                                            const diferencaAto = Math.max(0, atoEfetivo - atoCliente);
                                            const sinaisQtd    = diferencaAto > 0.01 ? 3 : 0;
                                            const sinaisValor  = sinaisQtd > 0 ? diferencaAto / 3 : 0;

                                            // PASSO 3: Saldo PS = Entrada Bruta - Ato EFETIVO
                                            const saldoPSbruto = Math.max(0, entradaBruta - atoEfetivo);

                                            // Carência: meses = 1 (ato) + sinaisQtd
                                            const mesesCarenciaR1 = 1 + sinaisQtd;
                                            const TAXA_CARENCIA   = 0.005; // 0.5% ao mês
                                            const psComCarencia   = saldoPSbruto * Math.pow(1 + TAXA_CARENCIA, mesesCarenciaR1);

                                            // R1: PS com carência não pode ultrapassar psLimite% do imóvel
                                            const psTetoR1 = p.psLimite * valorImovel;
                                            const r1ok     = psComCarencia <= psTetoR1 + 0.01;

                                            // Lógica do fator e PS base (validada contra o site oficial):
                                            // Se PS com carência >= teto → o site desconta a carência do teto
                                            //   PS_base = teto / (1.005)^meses → fator = 1.471466 (FATOR_BASE_SEM_SINAIS)
                                            // Se PS com carência < teto → PS livre
                                            //   PS_base = PS_bruto → fator = 1.4582 × 1.01106^sinaisQtd
                                            let saldoPSbase, fatorPS;
                                            if (sinaisQtd === 0) {
                                                // Sem sinais: PS bruto direto, fator base sem sinais
                                                saldoPSbase = Math.min(saldoPSbruto, psTetoR1);
                                                fatorPS = FATOR_BASE_SEM_SINAIS;
                                            } else if (psComCarencia >= psTetoR1 - 0.02) {
                                                // Com sinais, PS toca o teto: desconta a carência do teto
                                                saldoPSbase = psTetoR1 / Math.pow(1 + TAXA_CARENCIA, mesesCarenciaR1);
                                                fatorPS = FATOR_BASE_SEM_SINAIS;
                                            } else {
                                                // Com sinais, PS abaixo do teto: PS bruto com fator cheio
                                                saldoPSbase = saldoPSbruto;
                                                fatorPS = calcFator(sinaisQtd);
                                            }

                                            // PASSO 4: Abate anuais do saldo PS
                                            const abateAnual = anuaisUsados * valorAnual;
                                            const saldoPSliq  = Math.max(0, saldoPSbase - abateAnual);

                                            // PASSO 5: Parcela = Saldo PS × fator ÷ 84
                                            const parcelaPS = (saldoPSliq * fatorPS) / PARCELAS_PS;

                                            // R2: Financ + PS ≤ condicao% × renda
                                            const r2ok = (parcelaFinanc + parcelaPS) <= p.condicao * renda + 0.01;

                                            // R3: parcelaPS ≤ comprometimento% × renda
                                            const r3ok = parcelaPS <= p.comprometimento * renda + 0.01;

                                            const aprovado = r1ok && r2ok && r3ok;

                                            // Aviso de reprovação
                                            let rebalance = null;
                                            if (!r1ok) {
                                                rebalance = `❌ Reprovado por R1: PS com carência (${brl(psComCarencia)}) ultrapassa o teto de ${(p.psLimite*100).toFixed(0)}% do imóvel (máx ${brl(psTetoR1)}).`;
                                            } else if (!r2ok) {
                                                rebalance = `❌ Reprovado por R2: Financiamento + PS (${brl(parcelaFinanc + parcelaPS)}/mês) ultrapassa ${(p.condicao*100).toFixed(0)}% da renda (máx ${brl(p.condicao * renda)}/mês).`;
                                            } else if (!r3ok) {
                                                rebalance = `❌ Reprovado por R3: Parcela PS (${brl(parcelaPS)}/mês) ultrapassa ${(p.comprometimento*100).toFixed(0)}% da renda (máx ${brl(p.comprometimento * renda)}/mês).`;
                                            }

                                            // % para exibição
                                            const pctR2atual = renda > 0 ? ((parcelaFinanc + parcelaPS) / renda) * 100 : 0;
                                            const pctR3atual = renda > 0 ? (parcelaPS / renda) * 100 : 0;
                                            const pctR1atual = valorImovel > 0 ? (psComCarencia / valorImovel) * 100 : 0;

                                            return {
                                                aprovado,
                                                label, cor,
                                                valorImovel:    brl(valorImovel),
                                                financBanco:    financBanco ? brl(financBanco) : null,
                                                subsidio:       subsidio    ? brl(subsidio)    : null,
                                                fgts:           fgts        ? brl(fgts)        : null,
                                                entradaBruta:   brl(entradaBruta),
                                                benePS:         brl(psTetoR1),
                                                benePSTeto:     brl(psTetoR1),
                                                // atoSinaisTotal = ato na assinatura + total dos sinais (= atoEfetivo completo)
                                                atoSinaisTotal: brl(atoEfetivo),
                                                ato:            brl(atoCliente), // o que o cliente paga na assinatura
                                                excessoAto:     null,
                                                // Sinais = ato parcelado em 3x (só aparece se cliente não tem o ato cheio)
                                                sinais: sinaisQtd > 0 ? { qtd: sinaisQtd, valor: brl(sinaisValor) } : null,
                                                parcelaPS:      `${brl(parcelaPS)}/mês`,
                                                anuais:         anuaisUsados > 0 ? `${brl(valorAnual)} × ${anuaisUsados}` : null,
                                                rebalance,
                                                regras: [
                                                    {
                                                        ok: r1ok,
                                                        rotulo: 'R1 Percentual pró soluto',
                                                        pctAtual: pctR1atual.toFixed(1) + '%',
                                                        pctLimite: pct(p.psLimite),
                                                        detalhe: `PS c/ carência ${brl(psComCarencia)} · teto máximo ${brl(psTetoR1)} — não pode ultrapassar`,
                                                        descricao: `R1 verifica se o PS com carência (${brl(psComCarencia)}) não ultrapassa ${pct(p.psLimite)} do imóvel = ${brl(psTetoR1)}. O PS base é ${brl(saldoPSbruto)}, acrescido de juros de 0,5%/mês × ${mesesCarenciaR1} meses.`,
                                                    },
                                                    {
                                                        ok: r2ok,
                                                        rotulo: 'R2 — Financ.+PS / Renda',
                                                        pctAtual: pctR2atual.toFixed(1) + '%',
                                                        pctLimite: pct(p.condicao),
                                                        detalhe: `${brl(parcelaFinanc + parcelaPS)}/mês · máx ${brl(p.condicao * renda)}`,
                                                        descricao: `R2 controla o comprometimento total da renda com moradia. A soma da parcela do financiamento bancário (${brl(parcelaFinanc)}/mês) mais a parcela do PS (${brl(parcelaPS)}/mês) não pode ultrapassar ${pct(p.condicao)} da renda bruta do cliente. Limite: ${brl(p.condicao * renda)}/mês.`,
                                                    },
                                                    {
                                                        ok: r3ok,
                                                        rotulo: 'R3 — PS / Renda',
                                                        pctAtual: pctR3atual.toFixed(1) + '%',
                                                        pctLimite: pct(p.comprometimento),
                                                        detalhe: `${brl(parcelaPS)}/mês · máx ${brl(p.comprometimento * renda)}`,
                                                        descricao: `R3 controla o comprometimento específico com o PS parcelado. A parcela mensal do PS sozinha não pode ultrapassar ${pct(p.comprometimento)} da renda bruta. Limite: ${brl(p.comprometimento * renda)}/mês.`,
                                                    },
                                                ],
                                                coefEfetivo: `÷ 84 parcelas`,
                                                fatorLabel,
                                            };
                                        };

                                        // ══════════════════════════════════════════════════════════
                                        // MOTOR DE BUSCA DE APROVAÇÃO — LÓGICA TOP-DOWN CORRETA
                                        // Saldo PS = Entrada Bruta - Ato (nunca subtrai teto PS)
                                        // ══════════════════════════════════════════════════════════
                                        const buscarAprovacao = ({ label = '', cor = 0 }) => {
                                            const entradaBruta  = Math.max(0, valorImovel - financBanco - subsidio - fgts);
                                            const saldoPSbruto  = Math.max(0, entradaBruta - atoCliente);
                                            // R1: saldo PS nunca ultrapassa o teto do perfil
                                            const psTetoR1busca = p.psLimite * valorImovel;
                                            const saldoPSbase   = Math.min(saldoPSbruto, psTetoR1busca);
                                            const maxAnuaisDisp = nAnuais;

                                            // Limites REAIS de renda
                                            const maxParcelaR3 = p.comprometimento * renda;
                                            const maxParcelaR2 = Math.max(0, p.condicao * renda - parcelaFinanc);
                                            const maxParcela   = Math.min(maxParcelaR3, maxParcelaR2);

                                            // Card 1: usa fator base sem sinais para estimar se aprova
                                            const fatorCard1 = FATOR_BASE_SEM_SINAIS;

                                            // CAMINHO FELIZ: sem anuais, parcela já cabe na renda
                                            const parcelaSemAnuais = (saldoPSbase * fatorCard1) / PARCELAS_PS;
                                            if (parcelaSemAnuais <= maxParcela + 0.01) {
                                                return calcPlano({ anuaisUsados: 0, label, cor });
                                            }

                                            // Parcela alta: escala anuais até aprovar
                                            for (let a = 1; a <= maxAnuaisDisp; a++) {
                                                const saldoComAnuais   = Math.max(0, saldoPSbase - a * valorAnual);
                                                const parcelaComAnuais = (saldoComAnuais * fatorCard1) / PARCELAS_PS;
                                                if (parcelaComAnuais <= maxParcela + 0.01) {
                                                    return calcPlano({ anuaisUsados: a, label, cor });
                                                }
                                            }

                                            // Anuais não bastam: retorna reprovado com o melhor resultado possível
                                            // NÃO marca como aprovado — deixa as regras R2/R3 reprovarem corretamente
                                            return calcPlano({ anuaisUsados: maxAnuaisDisp, label, cor });
                                        };

                                        // Card 1: Plano com ato informado pelo corretor
                                        const plano1 = buscarAprovacao({
                                            label: nAnuais > 0 ? '+ Anuais' : 'Ato Informado',
                                            cor: 1,
                                        });

                                        // Card 2: "Ato à Vista" — ato mínimo necessário para aprovar sem anuais
                                        // Se o cliente não tiver o ato cheio → mostra sinais (ato parcelado em 3x)
                                        const calcAtoVista = () => {
                                            const entradaBrutaV = Math.max(0, valorImovel - financBanco - subsidio - fgts);
                                            const maxParR3   = p.comprometimento * renda;
                                            const maxParR2   = Math.max(0, p.condicao * renda - parcelaFinanc);
                                            const maxParcela = Math.min(maxParR3, maxParR2);
                                            // R1: teto do PS para este perfil
                                            const psTetoR1vista = p.psLimite * valorImovel;
                                            // Card 2 (Ato à Vista): sem sinais = fator 1 mês; com sinais = fator 4 meses
                                            // Calculamos primeiro sem sinais para achar o ato necessário
                                            const TAXA_CAR = 0.005;
                                            // Sem sinais (m=1): PS_max = teto/(1.005)^1, fator=1.471466
                                            const psMaxSemS  = psTetoR1vista / Math.pow(1 + TAXA_CAR, 1);
                                            const saldoPSmaxSemS = Math.min((maxParcela * PARCELAS_PS) / FATOR_BASE_SEM_SINAIS, psMaxSemS);
                                            const atoNecSemS = entradaBrutaV - saldoPSmaxSemS;
                                            if (atoNecSemS <= atoCliente + 0.01) {
                                                return calcPlano({ anuaisUsados: 0, label: 'Ato à Vista', cor: 2, atoNecessario: Math.max(atoCliente, atoNecSemS) });
                                            }
                                            // Com sinais (m=4): calcular ato necessário
                                            // Primeiro tentar com PS no teto (fator=1.471466, PS=teto/(1.005)^4)
                                            const psMaxComS_teto = psTetoR1vista / Math.pow(1 + TAXA_CAR, 4);
                                            const parcelaComTeto = psMaxComS_teto * FATOR_BASE_SEM_SINAIS / PARCELAS_PS;
                                            if (parcelaComTeto <= maxParcela + 0.01) {
                                                // Teto garante aprovação → ato necessário para PS tocar o teto
                                                const atoNecComTeto = Math.max(atoCliente, entradaBrutaV - psMaxComS_teto);
                                                return calcPlano({ anuaisUsados: 0, label: 'Ato à Vista', cor: 2, atoNecessario: atoNecComTeto });
                                            }
                                            // PS abaixo do teto com fator cheio (m=4)
                                            const fatorComSinais = calcFator(3);
                                            const saldoPSmaxComS = (maxParcela * PARCELAS_PS) / fatorComSinais;
                                            const atoNecessarioVista = Math.max(atoCliente, entradaBrutaV - saldoPSmaxComS);
                                            return calcPlano({ anuaisUsados: 0, label: 'Ato à Vista', cor: 2, atoNecessario: atoNecessarioVista });
                                        };
                                        const plano2 = calcAtoVista();
                                        const plano3 = plano2; // placeholder — só 2 cards

                                        // Renda mínima para aprovar com o Saldo PS REAL do cliente (limitado pelo teto R1)
                                        const entradaBrutaCalc = Math.max(0, valorImovel - financBanco - subsidio - fgts);
                                        const saldoPSrealCalc  = Math.min(Math.max(0, entradaBrutaCalc - atoCliente), p.psLimite * valorImovel);
                                        const parcelaPSCalc    = (saldoPSrealCalc * FATOR_BASE_SEM_SINAIS) / PARCELAS_PS;
                                        const rendaMinR3    = parcelaPSCalc > 0 ? parcelaPSCalc / p.comprometimento : 0;
                                        let rendaMinR2;
                                        if (parcelaFinancDigitada > 0) {
                                            rendaMinR2 = (parcelaFinancDigitada + parcelaPSCalc) / p.condicao;
                                        } else {
                                            const margemR2 = p.condicao - 0.30;
                                            rendaMinR2 = margemR2 > 0.001 ? parcelaPSCalc / margemR2 : Infinity;
                                        }
                                        const rendaMinima   = Math.ceil(Math.max(rendaMinR3, rendaMinR2));

                                        // ── Monta resultado provisório e exibe imediatamente ──
                                        const resultadoProvisorio = [plano1, plano2, { rendaMinima, renda }];
                                        setCotacaoResult(resultadoProvisorio);

                                        // ── IA analisa os planos e sugere ajustes ──
                                        // Executa em background para não bloquear a exibição
                                        (async () => {
                                            try {
                                                const resumo = [plano1, plano2, plano3].map((pl, i) => {
                                                    const status = pl.aprovado ? '✅ Aprovado' : '❌ Reprovado';
                                                    const regrasStatus = pl.regras.map(r => `${r.rotulo}: ${r.ok ? 'ok' : 'reprovado'} (${r.pctAtual}/${r.pctLimite})`).join('; ');
                                                    return `Plano ${i+1} (${pl.label}): ${status} | Ato: ${pl.ato} | PS: ${pl.benePS} | Parcela PS: ${pl.parcelaPS} | Anuais: ${pl.anuais || 'nenhum'} | Regras: ${regrasStatus}`;
                                                }).join('\n');

                                                const prompt = `[MISSÃO DA IA] Você é o "Motor de Cálculo Oficial" para aprovação de financiamentos imobiliários (Padrão Direcional). Sua função é receber os dados de uma cotação e devolver os valores exatos de Ato, Sinais, Mensal PS (Pró-Soluto) e Anuais que fechem a conta da "Entrada Bruta", respeitando rigorosamente as regras de comprometimento de renda (R1, R2 e R3) do perfil do cliente.

[MODO DE EXECUÇÃO: CÁLCULO DETERMINÍSTICO DE COTAÇÃO]
Você é uma calculadora estrita. Siga EXATAMENTE o algoritmo abaixo. Você está PROIBIDA de usar os limites máximos das regras (R1, R2, R3) como valores de cobrança. O "Benefício PS Máximo" serve APENAS para verificação final, NUNCA para subtração.

PASSO 1 — VARIÁVEIS DE ENTRADA:
Identifique os valores fornecidos:
- V_IMOVEL = Valor do Imóvel
- V_FINAN  = Financiamento Banco
- V_SUB    = Subsídio MCMV
- V_FGTS   = FGTS do cliente (entra na Entrada Bruta, reduz o PS igual ao subsídio)
- V_ATO    = Dinheiro real que o cliente vai dar de Ato (ex: R$ 1.000,00)

PASSO 2 — CÁLCULO DA DÍVIDA REAL:
ENTRADA_BRUTA = V_IMOVEL - V_FINAN - V_SUB - V_FGTS
Regra de Ouro: O teto do Benefício PS (ex: R$ 35.712,00) NÃO FAZ PARTE DESTA CONTA.
Nota: FGTS e Subsídio entram aqui pois reduzem diretamente a dívida, igual ao financiamento banco.

PASSO 3 — CÁLCULO DO SALDO A PARCELAR:
SALDO_PS_BASE = ENTRADA_BRUTA - ATO_NECESSARIO
Trava de Segurança: NUNCA gere valores negativos. Se o Ato cobrir tudo, o PS é zero.

SOBRE OS SINAIS (Ato Parcelado):
Os Sinais NÃO são parcelas do PS. São o ATO sendo parcelado em 3x para o cliente que não tem o valor cheio na hora da assinatura.
- ATO_NECESSARIO = valor total que precisa entrar como Ato para o PS caber na renda
- ATO_CLIENTE    = o que o cliente tem disponível no dia da assinatura
- Se ATO_CLIENTE < ATO_NECESSARIO → SINAIS = (ATO_NECESSARIO - ATO_CLIENTE) ÷ 3
- Exemplo: Ato necessário R$ 10.000, cliente tem R$ 1.000 → Sinais = 3x de R$ 3.000
- Os Sinais NÃO alteram o Saldo PS — o PS já foi calculado com o ATO_NECESSARIO completo

PASSO 4 — TENTATIVA 1 (O CAMINHO FELIZ — SEM SINAIS E SEM ANUAIS):
PARCELA_MENSAL_TESTE = SALDO_PS_BASE ÷ 84

PASSO 5 — VALIDAÇÃO DAS REGRAS R2 E R3:
Compare a PARCELA_MENSAL_TESTE com o limite máximo permitido pela renda do cliente.

✅ SE PARCELA_MENSAL_TESTE <= Limite da Renda (R3 e R2):
PARE O CÁLCULO AQUI! A COTAÇÃO ESTÁ APROVADA. Retorne imediatamente:
- Ato: V_ATO
- Sinais: 0
- Anuais: 0
- Mensal PS: 84x de PARCELA_MENSAL_TESTE

❌ SE PARCELA_MENSAL_TESTE > Limite da Renda:
APENAS NESTE CASO, inicie a adição de parcelas ANUAIS (valor fixo = 50% da renda bruta, vencimento todo dezembro) para abater o SALDO_PS_BASE até que a divisão por 84 caiba na renda. Escale 1, 2, 3... anuais até aprovar. Se mesmo com todos os anuais disponíveis não couber, adicione SINAIS. Cada Sinal adiciona 1% de juros ao SALDO_PS_BASE no cálculo (1 mês base + 1 mês por sinal).

[AS 3 REGRAS DE OURO (VALIDAÇÃO)] Após calcular a Parcela Mensal PS, valide o perfil do cliente:
- R1 (Benefício PS / Imóvel): O PS não pode ultrapassar o teto do imóvel (Diamante 25%, Ouro 20%, Prata 18%, Bronze 15%, Aço 12%). Assuma sempre aprovado no limite.
- R2 (Financ. + PS / Renda): A soma (Parcela do Financiamento + Parcela Mensal PS) NÃO PODE ultrapassar o limite da renda bruta (Diamante/Ouro 50%, Prata 48%, Bronze 45%, Aço 40%).
- R3 (PS / Renda - A MAIS RESTRITIVA): A Parcela Mensal PS sozinha NÃO PODE ultrapassar o teto da renda bruta (Diamante/Ouro 20%, Prata 18%, Bronze 15%, Aço 10%).

[SISTEMA DE SALVAMENTO (AUTO-ESCALA DE ANUAIS)] Se a Parcela Mensal PS calculada REPROVAR nas regras R2 ou R3, NÃO reprove imediatamente. Use a Válvula de Escape:
1. Adicione parcelas Anuais (vencimento todo mês de dezembro).
2. O valor de cada parcela Anual é travado em 50% da renda bruta do cliente.
3. Subtraia o valor total dessas Anuais do Saldo PS e recalcule a divisão por 84x.
4. Repita escalando a quantidade de Anuais (1, 2, 3...) até a Parcela Mensal PS ser APROVADA nas regras R2 e R3.
5. Fator comercial fixo: 1.47146 × 84 parcelas.

[DADOS DO CLIENTE]
- Perfil: ${perfil}
- Imóvel: ${brl(valorImovel)}
- Renda: ${brl(renda)}
- Financ. banco: ${brl(financBanco)}
- Parcela financiamento: ${parcelaFinanc ? brl(parcelaFinanc) : 'estimativa 30% da renda'}
- Subsídio: ${brl(subsidio)}
- FGTS: ${brl(fgts)}
- Ato do cliente: ${brl(atoCliente)}
- Anuais disponíveis: ${nAnuais}

[PLANOS CALCULADOS PELO SISTEMA]
${resumo}

[SAÍDA ESPERADA] Analise os planos acima e entregue um comentário CURTO e DIRETO (máx 3 linhas) para o corretor, destacando:
- Qual plano aprovar e por quê
- Os valores finais: Ato, Sinais (qtd e valor), PS (84x - valor da parcela), Anuais (qtd e valor se usadas)
- Se reprovado, o que precisa ajustar
Responda em português, direto ao ponto.`;

                                                const resp = await fetch('https://api.anthropic.com/v1/messages', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        model: 'claude-sonnet-4-20250514',
                                                        max_tokens: 200,
                                                        messages: [{ role: 'user', content: prompt }]
                                                    })
                                                });
                                                const data = await resp.json();
                                                const analise = data?.content?.[0]?.text || null;
                                                if (analise) {
                                                    setCotacaoResult([plano1, plano2, { rendaMinima, renda, analiseIA: analise }]);
                                                }
                                            } catch(err) {
                                                console.warn('Análise IA falhou:', err);
                                            }
                                        })();

                                    } catch(e) { console.error(e); if (!['sem perfil','sem valor','sem renda'].includes(e.message)) setCotacaoResult('⚠️ Erro: ' + e.message); }
                                }}
                                disabled={false}
                                className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 relative overflow-hidden active:scale-[0.98]"
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 40%, #7c3aed 100%)',
                                    boxShadow: '0 4px 24px rgba(99,102,241,0.45), 0 0 0 2px rgba(99,102,241,0.2)',
                                }}>
                                <span className="absolute inset-0 cotacao-btn-shine pointer-events-none" style={{borderRadius:'1rem'}}></span>
                                <Calculator size={16} className="relative z-10" style={{filter:'drop-shadow(0 0 6px rgba(255,255,255,0.9))'}} />
                                <span className="relative z-10" style={{textShadow:'0 1px 6px rgba(0,0,0,0.3)'}}>Gerar Plano</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
}
