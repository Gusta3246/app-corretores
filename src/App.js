import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Search, Building, ExternalLink, MapPin, BookOpen, Maximize, Bed, LayoutGrid, Sparkles, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, FileText, TableProperties, BookMarked, HelpCircle, Calculator, Bot, X, Send, Wand2, Paperclip, File as FileIcon, Trash2, FolderPlus, GripVertical, Plus, MessageCircle, Moon, Sun, AlertTriangle, Book, Clock, Trophy } from 'lucide-react';
import { buscarRespostaDoRobo, buscarRespostaGemini } from './bot/dadosFinanciamento.js';

const LOGOS_EMPREENDIMENTO = {
  brisas: "https://i.postimg.cc/CxkWjBFf/Copia-de-LOGO-COLORIDO-PREFERENCIAL.png",
  orquidea: "https://i.postimg.cc/nhbz1mt3/Copia-de-DIR-Orquidea-Logo-FINAL.png",
  village_torres: "https://i.postimg.cc/fyVL8jL3/Logo-Village-Torres.png",
  conquista_jb: "https://i.postimg.cc/7h56KM6G/Ativo-1.png",
  viva_coral: "https://i.postimg.cc/3RSNjbKh/Copia-de-Logo-Viva-Vida-Coral.png",
  jardim_norte: "https://i.postimg.cc/zv4f6bbp/Copia-de-DIR-Jd-Norte-Logo-FINAL-Prancheta-1.png",
  rio_amazonas: "https://i.postimg.cc/D0SZxdZP/DIR-Rio-AM-logo-AZUL.png",
  bosque_torres: "https://i.postimg.cc/Kj1z0rzs/Copia-de-Logo-Bosque-das-Torres-Prancheta-1.png",
  lirio_azul: "https://i.postimg.cc/Wzd3563y/Copia-de-DIR-PVLirio-Azul-Logo.png",
  boulevard_classic: "https://i.postimg.cc/6qbHXwBJ/Logo-AMAZOM-BOULEVARD-CLASSIC.png",
  boulevard_prime: "https://i.postimg.cc/PJV6jhdG/Copia-de-LOGO-AMAZON-BOULEVARD-PRIME-OK-01.png",
  oasis_azzure: "https://i.postimg.cc/bJCr0Fzk/Copia-de-LOGO-OASIS-AZZURE-BRANCA.png",
  zenith: "https://i.postimg.cc/gjtMWdGb/ZENITH-LOGO-ORIGINAL.png",
  topazio: "https://i.postimg.cc/qqNR1XRR/DIR-CTopazio-Logo-Prancheta-1.png",
  rio_negro: "https://i.postimg.cc/NFKMd7M6/DIR-Conquista-Rio-Negro-Logo.png",
  rio_tapajos: "https://i.postimg.cc/xCx8GF0c/Copia-de-DIR-Rio-Tapajos-logo.png",
  moratta: "https://i.postimg.cc/bvTVQqdd/248-3-LOGO-MORATTA-FIORE-PRETO-V1F.png",
};

const REVISTA_LOGO_MAP = {
  1: 'brisas',
  2: 'orquidea',
  3: 'village_torres',
  4: 'conquista_jb',
  5: 'viva_coral',
  6: 'jardim_norte',
  7: 'rio_amazonas',
  8: 'bosque_torres',
  9: 'lirio_azul',
  10: 'boulevard_classic',
  11: 'boulevard_prime',
  12: 'oasis_azzure',
  13: 'zenith',
  14: 'topazio',
  16: 'rio_negro',
  17: 'rio_tapajos',
  18: 'moratta',
};

const D = 'https://www.direcional.com.br/wp-content/uploads';
const R = 'https://www.rivaincorporadora.com.br/wp-content/uploads';

const revistasDataLocal = [
    { id: 1, title: "Brisas do Horizonte", brand: "Direcional", region: "Coroado - Zona Leste", size: "43m² a 45m²", bedrooms: "2 quartos", flooring: "Todo o apê", entrega: "08/2028",
      cover: `${D}/2025/06/Perspectiva-Guarita-BrisasdoHorizonte.jpg.webp`,
            fotosExtras: [
        `https://api.apto.vc/images/realties/9440/brisas-do-horizonte-condominio-2.webp`,
        `https://api.apto.vc/images/realties/9440/brisas-do-horizonte-condominio-3.webp`,
        `https://api.apto.vc/images/realties/9440/brisas-do-horizonte-condominio-4.webp`,
        `https://api.apto.vc/images/realties/9440/brisas-do-horizonte-condominio-5.webp`,
        `https://api.apto.vc/images/realties/9440/brisas-do-horizonte-condominio-6.webp`,
      ],
      link: "https://drive.google.com/file/d/18IXtAt9PLVjIsk2PkXIHXnVCaduVkGu2/view?usp=drive_link", aliases: ["brisas", "brisas do horizonte", "horizonte"], pois: ["Supermercado Vitória (1 min)", "Escola Mun. Profª Maria Rodrigues Tapajós (2 min)", "SPA Coroado (3 min)", "Estádio Carlos Zamith (5 min)", "Park Mall Ephigênio Salles (6 min)", "UFAM - Universidade Federal do Amazonas (7 min)", "Hospital Dr. João Lúcio (7 min)", "Samel São José Medical Center (7 min)", "Sesi Clube do Trabalhador (8 min)", "Manauara Shopping (14 min)"] },

    { id: 2, title: "Parque Ville Orquídea", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "41m²", bedrooms: "2 quartos", flooring: "Todo o apê", entrega: "04/2027",
      cover: `${D}/2024/05/Perspectiva_PARQUEVILLEORQUIDEA_GUARITA.jpg.webp`,
            fotosExtras: [
        `https://api.apto.vc/images/realties/7259/parque-ville-orquidea-condominio-2.webp`,
        `https://api.apto.vc/images/realties/7259/parque-ville-orquidea-condominio-3.webp`,
        `https://api.apto.vc/images/realties/7259/parque-ville-orquidea-condominio-4.webp`,
        `https://api.apto.vc/images/realties/7259/parque-ville-orquidea-condominio-5.webp`,
        `https://api.apto.vc/images/realties/7259/parque-ville-orquidea-condominio-6.webp`,
      ],
      link: "https://drive.google.com/file/d/1F_BeT2jceDM8u4kCbSXN8kp2rk7boQTG/view?usp=drive_link", aliases: ["orquidea", "orquídea", "parque ville", "parque ville orquidea"], pois: ["Escola Mun. Viviane Estrela (1-2 min)", "Clínica da Família C. Nicolau (1-2 min)", "Veneza Express (3-4 min)", "Nova Era Supermercado (3-4 min)", "Terminal 6 (3-4 min)", "Colégio Militar da PM VI (3-4 min)", "Shopping Via Norte (7 min)", "Hospital Delphina Aziz (10 min)", "Sumaúma Park Shopping (12 min)"] },

    { id: 3, title: "Village Torres", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "04/2027",
      cover: `${D}/2024/09/Perspectiva-Guarita-VillageTorres.jpg.webp`,
            fotosExtras: [
        `https://api.apto.vc/images/realties/7672/village-torres-condominio-2.webp`,
        `https://api.apto.vc/images/realties/7672/village-torres-condominio-3.webp`,
        `https://api.apto.vc/images/realties/7672/village-torres-condominio-4.webp`,
        `https://api.apto.vc/images/realties/7672/village-torres-condominio-5.webp`,
        `https://api.apto.vc/images/realties/7672/village-torres-condominio-6.webp`,
      ],
      link: "https://drive.google.com/file/d/1blVconA5fjODxvXB7s8KT6dSlX8KpLLv/view?usp=drive_link", aliases: ["village", "village torres", "torres"], pois: ["Supermercado Nova Era", "Shopping Via Norte", "Sumaúma Park Shopping", "Atacadão"] },

    { id: 4, title: "Conquista Jardim Botânico", brand: "Direcional", region: "Nova Cidade - Zona Norte", size: "40m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "11/2026",
      cover: `${D}/2024/03/Conquista-Jardim-Botanico-Guarita.jpg.webp`,
            fotosExtras: [
        `https://api.apto.vc/images/realties/7260/conquista-jardim-botanico-condominio-2.webp`,
        `https://api.apto.vc/images/realties/7260/conquista-jardim-botanico-condominio-3.webp`,
        `https://api.apto.vc/images/realties/7260/conquista-jardim-botanico-condominio-4.webp`,
        `https://api.apto.vc/images/realties/7260/conquista-jardim-botanico-condominio-5.webp`,
        `https://api.apto.vc/images/realties/7260/conquista-jardim-botanico-condominio-6.webp`,
      ],
      link: "https://drive.google.com/file/d/1TYzIq8RuGORXfxQpH8CGZejTjF_GlUz0/view?usp=drive_link", aliases: ["botanico", "botânico", "jardim botanico", "conquista jardim"], pois: ["MUSA (Museu da Amazônia / Jardim Botânico)", "Shopping Via Norte", "Supermercado DB Nova Cidade", "SPA Galiléia"] },

    { id: 5, title: "Viva Vida Coral", brand: "Direcional", region: "Colônia Terra Nova - Zona Norte", size: "41m² a 51m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "03/2028",
      cover: `${D}/2025/05/Perspectiva-Guarita-VivaVidaCoral.jpg.webp`,
            fotosExtras: [
        `https://api.apto.vc/images/realties/8667/viva-vida-coral-condominio-2.webp`,
        `https://api.apto.vc/images/realties/8667/viva-vida-coral-condominio-3.webp`,
        `https://api.apto.vc/images/realties/8667/viva-vida-coral-condominio-4.webp`,
        `https://api.apto.vc/images/realties/8667/viva-vida-coral-condominio-5.webp`,
        `https://api.apto.vc/images/realties/8667/viva-vida-coral-condominio-6.webp`,
      ],
      link: "https://drive.google.com/file/d/1lYo3otquzwdnD0r5f6JobBbW-6KmGOF4/view?usp=drive_link", aliases: ["coral", "viva vida coral", "viva vida"], pois: ["Shopping Via Norte", "Loja Havan", "Atacadão", "Hospital Delphina Aziz", "Posto Atem (famoso na entrada do bairro)"] },

    { id: 6, title: "Conquista Jardim Norte", brand: "Direcional", region: "Santa Etelvina - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "06/2027",
      cover: `${D}/2024/12/Perspectiva-Guarita-ConquistaJardimNorte.jpg.webp`,
            fotosExtras: [
        `https://api.apto.vc/images/realties/8191/conquista-jardim-norte-condominio-2.webp`,
        `https://api.apto.vc/images/realties/8191/conquista-jardim-norte-condominio-3.webp`,
        `https://api.apto.vc/images/realties/8191/conquista-jardim-norte-condominio-4.webp`,
        `https://api.apto.vc/images/realties/8191/conquista-jardim-norte-condominio-5.webp`,
        `https://api.apto.vc/images/realties/8191/conquista-jardim-norte-condominio-6.webp`,
      ],
      link: "https://drive.google.com/file/d/1_Hyb72NWl1HjEiabKLL9m5ZMutHExesY/view?usp=drive_link", aliases: ["jardim norte", "santa etelvina", "conquista norte"], pois: ["Shopping Via Norte (1 min)", "Havan (1 min)", "Fun Park (1 min)", "Nova Era Supermercado (1 min)", "UBS Sálvio Belota (2 min)", "Feira do Santa Etelvina (2 min)", "Terminal 06 (5 min)", "15º Distrito Policial (5-7 min)", "Hiper DB (5-7 min)", "Hospital Delphina Aziz", "Escola Dra. Viviane Estrela"] },

    { id: 7, title: "Viva Vida Rio Amazonas", brand: "Direcional", region: "Tarumã - Zona Oeste", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "03/2026",
      cover: `${D}/2023/07/Guarita-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp`,
      fotosExtras: [
        `${D}/2023/07/Fachada-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp`,
        `${D}/2023/07/Lazer-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp`,
        `${D}/2023/07/Piscina-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp`,
        `${D}/2023/07/Fitness-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp`,
        `${D}/2023/07/Playground-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp`,
      ],
      link: "https://drive.google.com/", aliases: ["amazonas", "rio amazonas", "viva vida rio amazonas"], pois: ["Aeroporto Internacional Eduardo Gomes", "Orla da Ponta Negra", "Sivam (Sistema de Vigilância da Amazônia)", "Sipam", "Supermercado Veneza"] },

    { id: 8, title: "Bosque das Torres", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "06/2028",
      cover: `${D}/2025/10/portaria-bosque-das-torres.jpg.webp`,
            fotosExtras: [
        `https://api.apto.vc/images/realties/11153/bosque-das-torres-condominio-2.webp`,
        `https://api.apto.vc/images/realties/11153/bosque-das-torres-condominio-3.webp`,
        `https://api.apto.vc/images/realties/11153/bosque-das-torres-condominio-4.webp`,
        `https://api.apto.vc/images/realties/11153/bosque-das-torres-condominio-5.webp`,
        `https://api.apto.vc/images/realties/11153/bosque-das-torres-condominio-6.webp`,
      ],
      link: "https://drive.google.com/file/d/1lPnNQuxlPkKOcW2JqOB7KEWsaQVpZzcU/view?usp=drive_link", aliases: ["bosque", "bosque das torres"], pois: ["Supermercado Nova Era (Torres)", "Sumaúma Park Shopping", "Parque do Mindu", "Faculdade Estácio (polo próximo)"] },

    { id: 9, title: "Parque Ville Lírio Azul", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "41m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "11/2028",
      cover: `${D}/2025/11/fachada-noturna-parque-ville-lirio-azul.jpg.webp`,
            fotosExtras: [
        `https://api.apto.vc/images/realties/12749/parque-ville-lirio-azul-condominio-2.webp`,
        `https://api.apto.vc/images/realties/12749/parque-ville-lirio-azul-condominio-3.webp`,
        `https://api.apto.vc/images/realties/12749/parque-ville-lirio-azul-condominio-4.webp`,
        `https://api.apto.vc/images/realties/12749/parque-ville-lirio-azul-condominio-5.webp`,
        `https://api.apto.vc/images/realties/12749/parque-ville-lirio-azul-condominio-6.webp`,
      ],
      link: "https://drive.google.com/file/d/1fc7AXap6nhkpTlxONsm46WJCKxIWIhwe/view?usp=drive_link", aliases: ["lirio", "lírio", "lirio azul", "parque ville lirio"], pois: ["Escola Integral João S. Braga (1 min)", "Colégio Militar da PM VI (2 min)", "Escola Est. Eliana Braga (2 min)", "Nova Era Supermercado (2 min)", "Clínica da Família C. Gracie (2 min)", "UBS José Fligliuolo (4 min)", "Clínica da Família C. Nicolau (4 min)", "Terminal 6 e 7 (4 min)", "Shopping Via Norte / Havan / Fun Park (7 min)", "Hospital Delphina Aziz (8 min)"] },

    { id: 10, title: "Amazon Boulevard Classic", brand: "Riva", region: "Bairro da Paz - Zona Centro-Oeste", size: "44m² a 69,78m²", bedrooms: "2 quartos", flooring: "Todo o apê", entrega: "12/2026",
      cover: `${R}/2023/11/fachada-noturna_amazon-boulevard-classic.jpg.webp`,
            fotosExtras: [
        `https://api.apto.vc/images/realties/6845/amazon-boulevard-classic-condominio-2.webp`,
        `https://api.apto.vc/images/realties/6845/amazon-boulevard-classic-condominio-3.webp`,
        `https://api.apto.vc/images/realties/6845/amazon-boulevard-classic-condominio-4.webp`,
        `https://api.apto.vc/images/realties/6845/amazon-boulevard-classic-condominio-5.webp`,
        `https://api.apto.vc/images/realties/6845/amazon-boulevard-classic-condominio-6.webp`,
      ],
      link: "https://drive.google.com/file/d/1ZX37T2S8FlHnSiO-yeAjlFyqq_5-dVzx/view?usp=drive_link", aliases: ["classic", "amazon boulevard", "boulevard", "boulevard classic"], pois: ["Arena da Amazônia", "Amazonas Shopping", "Carrefour Hipermercado", "UNIP (Universidade Paulista)", "Terminal Rodoviário de Manaus", "Hospital Tropical (Fundação de Medicina Tropical)"] },

    { id: 11, title: "Amazon Boulevard Prime", brand: "Riva", region: "Bairro da Paz - Zona Centro-Oeste", size: "51m² a 90,39m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", entrega: "06/2028",
      cover: `${R}/2025/06/guarita-Amazon-prime-boulevard-riva.jpg.webp`,
            fotosExtras: [
        `https://api.apto.vc/images/realties/9089/amazon-boulevard-prime-condominio-2.webp`,
        `https://api.apto.vc/images/realties/9089/amazon-boulevard-prime-condominio-3.webp`,
        `https://api.apto.vc/images/realties/9089/amazon-boulevard-prime-condominio-4.webp`,
        `https://api.apto.vc/images/realties/9089/amazon-boulevard-prime-condominio-5.webp`,
        `https://api.apto.vc/images/realties/9089/amazon-boulevard-prime-condominio-6.webp`,
      ],
      link: "https://drive.google.com/file/d/1aIuBlwLYGStUm7DNE3gCbfu3Ty2JmkGM/view?usp=drive_link", aliases: ["prime", "amazon prime", "boulevard prime"], pois: ["Arena da Amazônia", "Sambódromo", "Hipermercado Carrefour", "La Parilla Restaurante", "Aeroclub", "Petz", "Clube Municipal (ao lado)", "Vila Olímpica", "Drogaria Bom Preço", "Drogaria Santo Remédio"] },

    { id: 12, title: "Città Oasis Azzure", brand: "Riva", region: "Flores - Zona Centro-Sul", size: "48m² a 75m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", entrega: "11/2028",
      cover: `${R}/2025/08/citta-azzure_GUARITA.jpg.webp`,
            fotosExtras: [
        `https://api.apto.vc/images/realties/10744/citta-oasis-azzure-home-riva-condominio-2.webp`,
        `https://api.apto.vc/images/realties/10744/citta-oasis-azzure-home-riva-condominio-3.webp`,
        `https://api.apto.vc/images/realties/10744/citta-oasis-azzure-home-riva-condominio-4.webp`,
        `https://api.apto.vc/images/realties/10744/citta-oasis-azzure-home-riva-condominio-5.webp`,
        `https://api.apto.vc/images/realties/10744/citta-oasis-azzure-home-riva-condominio-6.webp`,
      ],
      link: "https://drive.google.com/file/d/1Y-fT6UbQ-OopqVaV0POgHRIdlayMXMOB/view?usp=sharing", aliases: ["citta", "città", "azzure", "oasis", "oasis azzure"], pois: ["Universidade Nilton Lins", "Laranjeiras Restaurante (polo gastronômico)", "Sushi Ponta Negra", "Domes Burgers", "Di Fiori - Casa de Massas e Pizzas", "Na Lenha Pizzaria", "Drogaria Santo Remédio", "Supermercado Atack (Laranjeiras)", "Sollarium Mall"] },

    { id: 13, title: "Zenith Condomínio Clube", brand: "Riva", region: "São Francisco - Zona Sul", size: "48m² a 49m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", entrega: "03/2028",
      cover: `${R}/2024/08/Perspectiva-Guarita-ZenithCondominioClube.webp`,
            fotosExtras: [
        `https://api.apto.vc/images/realties/7605/zenith-condominio-clube-condominio-2.webp`,
        `https://api.apto.vc/images/realties/7605/zenith-condominio-clube-condominio-3.webp`,
        `https://api.apto.vc/images/realties/7605/zenith-condominio-clube-condominio-4.webp`,
        `https://api.apto.vc/images/realties/7605/zenith-condominio-clube-condominio-5.webp`,
        `https://api.apto.vc/images/realties/7605/zenith-condominio-clube-condominio-6.webp`,
      ],
      link: "https://drive.google.com/file/d/1wv_v56T2ACEHtPZF-iRBvEWY2VVdUXxu/view?usp=drive_link", aliases: ["zenith", "zenith condominio"], pois: ["Manauara Shopping", "Fórum Ministro Henoch Reis", "Tribunal de Justiça (TJ-AM)", "Hospital Check Up", "Colégio Martha Falcão", "Faculdade Martha Falcão", "Faculdade Estácio"] },

    { id: 14, title: "Conquista Topázio", brand: "Direcional", region: "Colônia Terra Nova - Zona Norte", size: "41m² a 51m²", bedrooms: "1 e 2 quartos", flooring: "Todo o apê", entrega: "Entregue",
      cover: `${D}/2023/04/Guarita-Conquista-Topazio-Direcional.jpg.webp`,
            fotosExtras: [
        `https://api.apto.vc/images/realties/6507/conquista-topazio-condominio-2.webp`,
        `https://api.apto.vc/images/realties/6507/conquista-topazio-condominio-3.webp`,
        `https://api.apto.vc/images/realties/6507/conquista-topazio-condominio-4.webp`,
        `https://api.apto.vc/images/realties/6507/conquista-topazio-condominio-5.webp`,
        `https://api.apto.vc/images/realties/6507/conquista-topazio-condominio-6.webp`,
      ],
      link: "https://drive.google.com/file/d/1SMIfr9HbfLd06UaDLKbMUxxtuh4cPPEM/view?usp=drive_link", aliases: ["topazio", "topázio", "conquista topazio"], pois: ["Allegro Mall (vizinho)", "Shopping Via Norte", "Atacadão", "Loja Havan", "SPA da Colônia Terra Nova"] },

    { id: 16, title: "Conquista Rio Negro", brand: "Direcional", region: "Ponta Negra - Zona Oeste", size: "41m²", bedrooms: "2 quartos", flooring: "Todo o apê", entrega: "Entregue",
      cover: `${D}/2022/11/Guarita-Conquista-Rio-Negro-Direcional.jpg.webp`,
            fotosExtras: [
        `https://api.apto.vc/images/realties/6070/conquista-rio-negro-condominio-2.webp`,
        `https://api.apto.vc/images/realties/6070/conquista-rio-negro-condominio-3.webp`,
        `https://api.apto.vc/images/realties/6070/conquista-rio-negro-condominio-4.webp`,
        `https://api.apto.vc/images/realties/6070/conquista-rio-negro-condominio-5.webp`,
        `https://api.apto.vc/images/realties/6070/conquista-rio-negro-condominio-6.webp`,
      ],
      link: "https://drive.google.com/file/d/1pHLQwUSn6BDMfLo7fFGonyyWlgtXwNmy/view?usp=drive_link", aliases: ["negro", "rio negro", "conquista rio negro"], pois: ["Shopping Ponta Negra", "DB Ponta Negra", "Orla 92 Mall", "Supermercado Veneza", "Orla da Ponta Negra", "Praia Dourada", "Marina Tauá", "Balneário do SESC", "Aeroporto Eduardo Gomes", "Policlínica José Lins", "Colégio Século"] },

    { id: 17, title: "Viva Vida Rio Tapajós", brand: "Direcional", region: "Tarumã - Zona Oeste", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "08/2027",
      cover: `${D}/2025/02/Perspectiva-Guarita-VivaVidaRioTapajos.jpg.webp`,
      fotosExtras: [
        `${D}/2025/02/Perspectiva-Fachada-VivaVidaRioTapajos.jpg.webp`,
        `${D}/2025/02/Perspectiva-Lazer-VivaVidaRioTapajos.jpg.webp`,
        `${D}/2025/02/Perspectiva-Piscina-VivaVidaRioTapajos.jpg.webp`,
        `${D}/2025/02/Perspectiva-Fitness-VivaVidaRioTapajos.jpg.webp`,
        `${D}/2025/02/Perspectiva-Playground-VivaVidaRioTapajos.jpg.webp`,
      ],
      link: "https://drive.google.com/file/d/1k3TOypf5bm_zXPfc-ulb7vY9e7MKxmlk/view?usp=drive_link", aliases: ["tapajos", "tapajós", "rio tapajos", "viva vida rio tapajos"], pois: ["Aeroporto Internacional de Manaus", "Tarumã (área de balneários famosos)", "Sivam", "proximidade com a entrada da Ponta Negra"] },

    { id: 18, title: "Moratta Home Riva", brand: "Riva", region: "Flores - Zona Centro-Sul", size: "43,41m² a 59,35m²", bedrooms: "2 dormitórios", flooring: "Todo o apê", entrega: "04/2029", pinned: true,
      cover: `https://i.postimg.cc/vmFwP8QX/IMG-1577.png`,
      fotosExtras: [
        `https://i.postimg.cc/Wzn0y4L5/DIRECIONAL-CARREFOUR-TORRE-DETALHE-FINAL.jpg`,
        `https://i.postimg.cc/ryCGsf0r/DIRECIONAL-CARREFOUR-TORRE-DIURNA-FINAL.jpg`,
        `https://i.postimg.cc/x8tbRFMb/DIRECIONAL-CARREFOUR-ACADEMIA-FINAL.jpg`,
        `https://i.postimg.cc/5N2z0bWR/DIRECIONAL-CARREFOUR-INTERNA-SALA-FINAL.jpg`,
        `https://i.postimg.cc/jdSf5tY9/DIRECIONAL-CARREFOUR-LAVANDERIA-FINAL.jpg`,
      ],
      link: "https://drive.google.com/file/d/16Umi4PJlL2-yHR1Ye_nqtv_EOggbBCwk/view?usp=drive_link", aliases: ["moratta", "moratta home", "moratta riva"], pois: ["Carrefour Flores (ao lado)", "Amazonas Shopping (próximo)", "Arena da Amazônia (próximo)", "Manauara Shopping (poucos min)", "Millennium Shopping (poucos min)", "UNIP - Universidade Paulista", "Nilton Lins", "Hospital 28 de Agosto", "Vila Olímpica", "Mirage Park", "Pátio Gourmet", "Supermercado Nova Era"] },

    ];

const utilitariosData = [
    { title: "RESERVA DE UNIDADE DE LANÇAMENTO", link: "https://docs.google.com/document/d/17QoIEhahikPda2zjSQ3esclqu-YS9j81/edit?usp=sharing&ouid=115657243229938792991&rtpof=true&sd=true" },
    { title: "CARTA DE CANCELAMENTO", link: "https://drive.google.com/file/d/1tlibpT-9XGQIDGTrvp3Zcb9sDep1CldF/view?usp=sharing" },
    { title: "M.O", link: "https://drive.google.com/file/d/1exQM1G9KFAHfRgOMIlZwc1rnsAFYRrZd/view?usp=sharing" },
    { title: "MONTAR PLANO", link: "https://drive.google.com/file/d/1nLpqHMlmSwx7h9azIGW4JbWwDdNrFvsg/view?usp=sharing" },
    { title: "ANALISE INTERNA", link: "https://drive.google.com/file/d/1shaF3OEZnX0y4M9OhSCWZMXAXb9CbAVf/view?usp=sharing" },
    { title: "DECLARAÇÃO DE ESCLARECIMENTO", link: "https://docs.google.com/document/d/1tBS_JyaYVJtLP4uZil7hrKQIbO8t6YUo/edit?usp=sharing&ouid=115657243229938792991&rtpof=true&sd=true" },
    { title: "DECLARAÇÃO DEPENDENTE - SOLTEIRO/DIVORCIADO", link: "https://docs.google.com/document/d/1ZvZGt5G9aV-WwG7HH3H55RZVGlNqUP-q/edit?usp=sharing" },
    { title: "DECLARAÇÃO DEPENDENTE - CASADO", link: "https://docs.google.com/document/d/19VBTkk3Z4E2elG3LXvUZVoSOiAVNpBiW/edit?usp=sharing" },
    { title: "AMML - DECLA. PROPRIETÁRIO DE RESIDÊNCIA", link: "https://drive.google.com/file/d/1Qp19k2BaqiR6kuWqmju3qd_GMlUYuxrX/view?usp=sharing" },
    { title: "AMML- DECLA. TEMPO DE RESIDÊNCIA", link: "https://drive.google.com/file/d/1sJdAyDwVBvOauW9EK0XBJIHoIHL6nhAX/view?usp=sharing" },
    { title: "AMML - DECLA. ESTADO CIVIL", link: "https://drive.google.com/file/d/1f5aC4XStNfCKuu6NK2_EetP2DHpbF_0p/view?usp=sharing" },
    { title: "FICHA CADASTRO PF - CLIENTE INFORMAL", link: "https://drive.google.com/file/d/1Y5h9B3oe8HdoU7EGJwkcEerQACIaGAAG/view?usp=drive_link" }
];


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

const imagensEquipeDiarias = [
    "https://i.postimg.cc/QCxjYhBj/Copia-de-IMG-9585.jpg",
    "https://i.postimg.cc/2SJ3qb1V/Copia-de-IMG-5622-(1).jpg",
    "https://i.postimg.cc/mgqhczP5/Copia-de-IMG-3054.jpg",
    "https://i.postimg.cc/YSW0QrF3/Copia-de-IMG-3049.jpg",
    "https://i.postimg.cc/1zqXDmFK/Copia-de-IMG-3048.jpg",
    "https://i.postimg.cc/bvtr1yb8/Copia-de-IMG-2830.jpg",
    "https://i.postimg.cc/fbzc1rWb/Copia-de-IMG-1659.jpg",
    "https://i.postimg.cc/KzhzN6r5/Copia-de-IMG-1515.jpg",
    "https://i.postimg.cc/fLvwvJRq/Copia-de-IMG-1017.jpg",
    "https://i.postimg.cc/VL86Lg4H/Copia-de-IMG-9690.jpg",
    "https://i.postimg.cc/tCc9D09Q/Copia-de-IMG-0779-(1).jpg",
    "https://i.postimg.cc/sXP20TwK/Copia-de-IMG-1504.jpg",
    "https://i.postimg.cc/4xMnK7YP/Copia-de-IMG-3117.jpg",
    "https://i.postimg.cc/hGT4fCWS/Copia-de-IMG-2336.jpg",
    "https://i.postimg.cc/fWKLcg3X/Copia-de-IMG-9919.avif",
];

const today = new Date();
const dayIndex = Math.floor((today.getTime() - today.getTimezoneOffset() * 60000) / (1000 * 60 * 60 * 24));

function RippleButton({ onClick, className, children, style }) {
    const btnRef = useRef(null);
    const handleClick = (e) => {
        const btn = btnRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width / 2) - rect.left;
        const y = (e.clientY || e.touches?.[0]?.clientY || rect.top + rect.height / 2) - rect.top;
        const ripple = document.createElement('span');
        ripple.style.cssText = `position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,-50%) scale(0);width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.35);animation:ripple-anim 0.55s ease-out forwards;pointer-events:none;`;
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
        onClick?.(e);
    };
    return (
        <button ref={btnRef} className={className} style={{ ...style, position: 'relative', overflow: 'hidden' }} onClick={handleClick}>
            {children}
        </button>
    );
}

function BannerExpandido({ revista, onClose, modoNoturno, onVerRevista, onVerPois }) {
    const [phase, setPhase] = useState('entering');

    const [fotos, setFotos] = useState([revista.cover]);
    const checkedRef = useRef(false);
    useEffect(() => {
        if (checkedRef.current) return;
        checkedRef.current = true;
        (revista.fotosExtras || []).forEach(url => {
            const img = new Image();
            img.onload = () => setFotos(prev => prev.includes(url) ? prev : [...prev, url]);
            img.src = url;
        });
    }, []);

    const [idx, setIdx] = useState(0);
    const [prevIdx, setPrevIdx] = useState(null);
    const [dir, setDir] = useState(null);
    const sliding = useRef(false);

    const goTo = (newIdx, d) => {
        if (sliding.current || newIdx === idx) return;
        sliding.current = true;
        setPrevIdx(idx);
        setDir(d);
        setIdx(newIdx);
        setTimeout(() => {
            setPrevIdx(null);
            setDir(null);
            sliding.current = false;
        }, 380);
    };
    const goPrev = (e) => { e.stopPropagation(); goTo((idx - 1 + fotos.length) % fotos.length, 'right'); };
    const goNext = (e) => { e.stopPropagation(); goTo((idx + 1) % fotos.length, 'left'); };
    const goDot  = (i, e) => { e.stopPropagation(); if (i !== idx) goTo(i, i > idx ? 'left' : 'right'); };

    const isDir = revista.brand === 'Direcional';
    const accent     = isDir ? '#f97316' : '#2563eb';
    const accentDark = isDir ? '#c2410c' : '#1d4ed8';
    const bg      = modoNoturno ? '#0f172a' : '#ffffff';
    const bgSub   = modoNoturno ? '#1e293b' : '#f1f5f9';
    const text    = modoNoturno ? '#f1f5f9' : '#1e293b';
    const sub     = modoNoturno ? '#94a3b8' : '#64748b';
    const divider = modoNoturno ? '#1e293b' : '#e2e8f0';

    const triggerClose = () => { setPhase('out'); setTimeout(onClose, 280); };

    useEffect(() => {
        const r1 = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('in')));
        const onKey = (e) => {
            if (e.key === 'Escape') { triggerClose(); return; }
            if (e.key === 'ArrowLeft')  { goPrev(Object.assign(new Event('k'), { stopPropagation: () => {} })); return; }
            if (e.key === 'ArrowRight') { goNext(Object.assign(new Event('k'), { stopPropagation: () => {} })); return; }
        };
        window.addEventListener('keydown', onKey);
        return () => { cancelAnimationFrame(r1); window.removeEventListener('keydown', onKey); };
    }, [idx]);

    const Chip = ({ icon, label }) => (
        <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:99,
            background:bgSub, border:`1px solid ${divider}`, color:sub, fontSize:12, fontWeight:600 }}>
            <span style={{ color:accent, display:'flex', alignItems:'center' }}>{icon}</span>{label}
        </div>
    );

    const outX = dir === 'left' ? '-100%' : '100%';
    const DUR = '0.38s';
    const EASE = 'cubic-bezier(0.4,0,0.2,1)';

    return (
        <>
            {/* Backdrop com blur */}
            <div onClick={triggerClose} style={{
                position:'fixed', inset:0, zIndex:200,
                background:'rgba(0,0,0,0.48)',
                backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
                opacity: phase === 'in' ? 1 : 0,
                transition: phase === 'entering' ? 'none' : 'opacity 0.28s ease',
            }}/>

            {/* Container centralizado */}
            <div style={{ position:'fixed', inset:0, zIndex:201, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px', pointerEvents:'none' }}>
                <div
                    onMouseLeave={triggerClose}
                    onClick={e => e.stopPropagation()}
                    style={{
                        pointerEvents:'auto',
                        width:'100%', maxWidth:1160,
                        height:'min(90vh, 720px)',
                        borderRadius:26, overflow:'hidden', display:'flex',
                        background:bg,
                        boxShadow:'0 32px 100px rgba(0,0,0,0.40), 0 8px 32px rgba(0,0,0,0.20)',
                        opacity: phase === 'in' ? 1 : 0,
                        transform: phase === 'in' ? 'scale(1) translateY(0)' : 'scale(0.93) translateY(28px)',
                        transition: phase === 'entering' ? 'none' : `opacity 0.32s cubic-bezier(0.22,1,0.36,1), transform 0.32s cubic-bezier(0.22,1,0.36,1)`,
                    }}
                >
                    {/* ── ESQUERDA — foto (58%) ── */}
                    <div style={{ flex:'0 0 58%', position:'relative', overflow:'hidden' }}>

                        {dir && prevIdx !== null && (
                            <img key={`out-${prevIdx}`} src={fotos[prevIdx]} alt="" style={{
                                position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover',
                                transform:`translateX(${outX})`,
                                transition:`transform ${DUR} ${EASE}`,
                                zIndex:1,
                            }}/>
                        )}
                        <img key={`in-${idx}`} src={fotos[idx]} alt={revista.title} style={{
                            position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover',
                            transform: dir ? `translateX(0)` : 'translateX(0)',
                            animation: dir ? `slideIn-${dir} ${DUR} ${EASE} forwards` : 'none',
                            zIndex:2,
                        }}/>

                        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:3,
                            background:'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.06) 50%, transparent 100%)' }}/>

                        {/* Badge logo empreendimento */}
                        {(() => {
                            const logoKey = REVISTA_LOGO_MAP[revista.id];
                            const logoSrc = logoKey ? LOGOS_EMPREENDIMENTO[logoKey] : null;
                            if (!logoSrc) return null;
                            return (
                                <div style={{ position:'absolute', top:16, left:16, zIndex:6, width:150, height:90, display:'flex', alignItems:'flex-start', justifyContent:'flex-start' }}>
                                    <img src={logoSrc} alt={revista.title} style={{ maxHeight: logoKey === 'brisas' ? 76 : 88, maxWidth: logoKey === 'brisas' ? 148 : 145, width:'auto', height:'auto', objectFit:'contain', objectPosition:'top left', filter:'drop-shadow(0 0 10px rgba(0,0,0,0.95)) drop-shadow(0 3px 16px rgba(0,0,0,0.8)) drop-shadow(0 0 4px rgba(255,255,255,0.3))' }}/>
                                </div>
                            );
                        })()}

                        {fotos.length > 1 && (<>
                            <button onClick={goPrev} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', zIndex:7, width:38, height:38, borderRadius:'50%', border:'none', cursor:'pointer', background:'rgba(0,0,0,0.36)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.15s' }}
                                onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,0.62)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(0,0,0,0.36)'}><ChevronLeft size={20} color="#fff"/></button>
                            <button onClick={goNext} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', zIndex:7, width:38, height:38, borderRadius:'50%', border:'none', cursor:'pointer', background:'rgba(0,0,0,0.36)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.15s' }}
                                onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,0.62)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(0,0,0,0.36)'}><ChevronRight size={20} color="#fff"/></button>
                            <div style={{ position:'absolute', bottom:18, left:0, right:0, display:'flex', justifyContent:'center', gap:5, zIndex:7 }}>
                                {fotos.map((_,i) => <button key={i} onClick={e=>goDot(i,e)} style={{ width:i===idx?22:6, height:6, borderRadius:99, padding:0, border:'none', cursor:'pointer', background:i===idx?'#fff':'rgba(255,255,255,0.36)', transition:'width 0.25s, background 0.25s' }}/>)}
                            </div>
                        </>)}

                        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'0 24px 24px', zIndex:5 }}>
                            <h2 style={{ margin:0, fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.2, textShadow:'0 2px 14px rgba(0,0,0,0.6)' }}>{revista.title}</h2>
                            <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:6 }}>
                                <MapPin size={13} color="rgba(255,255,255,0.68)"/>
                                <span style={{ fontSize:13, color:'rgba(255,255,255,0.76)', fontWeight:500 }}>{revista.region}</span>
                            </div>
                        </div>
                    </div>

                    {/* ── DIREITA — infos ── */}
                    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

                        {/* Cabeçalho */}
                        <div style={{ padding:'22px 24px 14px', borderBottom:`1px solid ${divider}`, flexShrink:0 }}>
                            <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:text, lineHeight:1.2 }}>{revista.title}</h3>
                            <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:5 }}>
                                <MapPin size={12} color={accent}/>
                                <span style={{ fontSize:12, color:sub, fontWeight:500 }}>{revista.region}</span>
                            </div>
                        </div>

                        {/* Chips */}
                        <div style={{ display:'flex', flexWrap:'wrap', gap:6, padding:'14px 24px 12px', borderBottom:`1px solid ${divider}`, flexShrink:0 }}>
                            <Chip icon={<Maximize size={12}/>} label={revista.size}/>
                            <Chip icon={<Bed size={12}/>} label={revista.bedrooms}/>
                            <Chip icon={<LayoutGrid size={12}/>} label={revista.flooring}/>
                            {revista.entrega && <Chip icon={<Clock size={12}/>} label={revista.entrega === 'Entregue' ? '✅ Entregue' : `Entrega ${revista.entrega}`}/>}
                        </div>

                        {/* POIs */}
                        <div style={{ flex:1, overflowY:'auto', padding:'14px 24px 10px', scrollbarWidth:'thin' }}>
                            {revista.pois?.length > 0 && (<>
                                <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:10 }}>
                                    <MapPin size={11} color={accent}/>
                                    <span style={{ fontSize:10, fontWeight:800, color:sub, textTransform:'uppercase', letterSpacing:'0.12em' }}>Pontos de referência</span>
                                </div>
                                <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                                    {revista.pois.map((poi,i) => (
                                        <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:9 }}>
                                            <div style={{ width:6, height:6, borderRadius:'50%', background:accent, flexShrink:0, marginTop:5 }}/>
                                            <span style={{ fontSize:13, color:text, lineHeight:1.45 }}>{poi}</span>
                                        </div>
                                    ))}
                                </div>
                            </>)}
                        </div>

                        {/* Botões */}
                        <div style={{ padding:'14px 24px 20px', display:'flex', flexDirection:'column', gap:9, flexShrink:0, borderTop:`1px solid ${divider}` }}>
                            <button onClick={()=>{triggerClose();setTimeout(onVerRevista,300);}} style={{
                                width:'100%', padding:'13px 0', borderRadius:16, border:'none', cursor:'pointer',
                                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                                background:accent, color:'#fff', fontSize:14, fontWeight:800,
                                boxShadow:`0 4px 16px ${accent}44`,
                                transition:'background 0.15s, transform 0.12s',
                            }}
                                onMouseEnter={e=>{e.currentTarget.style.background=accentDark;e.currentTarget.style.transform='scale(1.01)';}}
                                onMouseLeave={e=>{e.currentTarget.style.background=accent;e.currentTarget.style.transform='scale(1)';}}
                            ><BookOpen size={16}/> Ver Revista Digital</button>

                            <button onClick={()=>{triggerClose();setTimeout(onVerPois,300);}} style={{
                                width:'100%', padding:'11px 0', borderRadius:16, cursor:'pointer',
                                display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                                background:'transparent', border:`1.5px solid ${divider}`,
                                color:sub, fontSize:13, fontWeight:700,
                                transition:'border-color 0.15s, color 0.15s, transform 0.12s',
                            }}
                                onMouseEnter={e=>{e.currentTarget.style.borderColor=accent;e.currentTarget.style.color=accent;e.currentTarget.style.transform='scale(1.01)';}}
                                onMouseLeave={e=>{e.currentTarget.style.borderColor=divider;e.currentTarget.style.color=sub;e.currentTarget.style.transform='scale(1)';}}
                            ><MapPin size={14} color="#f43f5e"/> Ver pontos de referência</button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideIn-left  { from { transform: translateX(100%);  } to { transform: translateX(0); } }
                @keyframes slideIn-right { from { transform: translateX(-100%); } to { transform: translateX(0); } }
            `}</style>
        </>
    );
}

// ── CardRevista — hover 1.7s desktop apenas abre modal ───────────────────────
function CardRevista({ revista, cardIdx, modoNoturno, haptic, setPdfLeitor, setSelectedPois, setPdfLeitorLogoAnim }) {
    const DELAY = 1700;
    const [expanded, setExpanded] = useState(false);
    const timerRef = useRef(null);
    const isDir = revista.brand === 'Direcional';

    // Detecta se é touch device — não ativa o hover expand no mobile
    const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const startHover = () => {
        if (isTouchDevice()) return;
        timerRef.current = setTimeout(() => { haptic('medium'); setExpanded(true); }, DELAY);
    };
    const stopHover = () => { clearTimeout(timerRef.current); };

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const handleVerRevista = () => {
        haptic('medium');
        const previewUrl = revista.link.replace(/\/view(\?.*)?$/, '/preview');
        const logoKey = REVISTA_LOGO_MAP[revista.id];
        const logoSrc = logoKey ? LOGOS_EMPREENDIMENTO[logoKey] : null;
        if (logoSrc && setPdfLeitorLogoAnim) {
            setPdfLeitorLogoAnim({ logoSrc, brand: revista.brand, title: revista.title });
            setTimeout(() => {
                setPdfLeitorLogoAnim(null);
                setPdfLeitor({ title: revista.title, url: previewUrl, brand: revista.brand });
            }, 2200);
        } else {
            setPdfLeitor({ title: revista.title, url: previewUrl, brand: revista.brand });
        }
    };
    const handleVerPois = () => { haptic(); setSelectedPois(revista); };

    return (
        <>
            {expanded && (
                <BannerExpandido
                    revista={revista}
                    onClose={() => setExpanded(false)}
                    modoNoturno={modoNoturno}
                    onVerRevista={handleVerRevista}
                    onVerPois={handleVerPois}
                />
            )}

            <div
                className="card-entry overflow-hidden flex flex-col group"
                style={{
                    animationDelay:`${cardIdx*90}ms`,
                    position:'relative',
                    borderRadius:'24px',
                    background: modoNoturno ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.55)',
                    backdropFilter:'blur(28px) saturate(200%) brightness(1.02)',
                    WebkitBackdropFilter:'blur(28px) saturate(200%) brightness(1.02)',
                    border: modoNoturno ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.90)',
                    outline: modoNoturno ? '1px solid rgba(99,179,248,0.08)' : '1.5px solid rgba(160,185,230,0.40)',
                    outlineOffset:'-1px',
                    boxShadow: modoNoturno
                        ? '0 2px 8px rgba(0,0,0,0.30), 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.14)'
                        : '0 2px 6px rgba(100,130,200,0.10), 0 8px 28px rgba(100,130,200,0.14), inset 0 1.5px 0 rgba(255,255,255,1)',
                    transition:'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.45s ease',
                }}
                onMouseEnter={e => {
                    if (isTouchDevice()) return;
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = modoNoturno
                        ? '0 8px 24px rgba(0,0,0,0.40), 0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)'
                        : '0 8px 24px rgba(100,130,200,0.18), 0 24px 64px rgba(100,130,200,0.22), inset 0 1.5px 0 rgba(255,255,255,1)';
                    startHover();
                }}
                onMouseLeave={e => {
                    if (isTouchDevice()) return;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = modoNoturno
                        ? '0 2px 8px rgba(0,0,0,0.30), 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.14)'
                        : '0 2px 6px rgba(100,130,200,0.10), 0 8px 28px rgba(100,130,200,0.14), inset 0 1.5px 0 rgba(255,255,255,1)';
                    stopHover();
                }}
            >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img src={revista.cover}
                        onError={(e)=>{e.target.onerror=null;e.target.src='https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400';}}
                        alt={`Capa ${revista.title}`}
                        className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
                        style={{ transformOrigin:'center center', willChange:'transform' }}/>
                    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                        <div className="card-shimmer-sweep" style={{ position:'absolute', top:0, left:0, width:'55%', height:'100%', background:'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.38) 50%, transparent 100%)', transform:'translateX(-150%) skewX(-18deg)' }}/>
                    </div>
                    <div style={{ position:'absolute', top:10, left:10, zIndex:10, width:110, height:70, display:'flex', alignItems:'flex-start', justifyContent:'flex-start' }}>
                        {(() => {
                            const logoKey = REVISTA_LOGO_MAP[revista.id];
                            const logoSrc = logoKey ? LOGOS_EMPREENDIMENTO[logoKey] : null;
                            if (!logoSrc) return null;
                            return (
                                <img src={logoSrc} alt={revista.title} style={{ maxHeight: logoKey === 'brisas' ? 62 : 68, maxWidth: logoKey === 'brisas' ? 108 : 105, width:'auto', height:'auto', objectFit:'contain', objectPosition:'top left', filter:'drop-shadow(0 0 8px rgba(0,0,0,0.9)) drop-shadow(0 2px 12px rgba(0,0,0,0.7)) drop-shadow(0 0 3px rgba(255,255,255,0.25))' }}/>
                            );
                        })()}
                    </div>
                    {/* Overlay entrega */}
                    {revista.entrega && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background:'rgba(255,255,255,0.18)', backdropFilter:'blur(18px) saturate(180%)', WebkitBackdropFilter:'blur(18px) saturate(180%)' }}>
                            {(()=>{
                                const meses=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
                                if(revista.entrega==='Entregue') return(<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}><span style={{fontSize:24,fontWeight:900,color:'#fff',textShadow:'0 2px 16px rgba(0,0,0,0.6)',lineHeight:1.1}}>Entregue!</span><span style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.8)',letterSpacing:'0.15em',textTransform:'uppercase'}}>pronto pra morar</span></div>);
                                const p=revista.entrega.split('/');
                                const mes=meses[parseInt(p[0])-1]||'';
                                const ano=p[1]||p[0];
                                const hoje=new Date();
                                const diff=(parseInt(p[1])-hoje.getFullYear())*12+(parseInt(p[0])-(hoje.getMonth()+1));
                                const restante=diff>0?`faltam ${diff} ${diff===1?'mês':'meses'}`:'chegando!';
                                return(<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:1}}><span style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.55)',letterSpacing:'0.3em',textTransform:'uppercase'}}>entrega</span><span style={{fontSize:46,fontWeight:900,color:'#fff',letterSpacing:'-0.04em',textShadow:'0 4px 24px rgba(0,0,0,0.5)',lineHeight:0.95}}>{ano}</span><span style={{fontSize:14,fontWeight:800,color:'rgba(255,255,255,0.9)',letterSpacing:'0.08em',textTransform:'uppercase'}}>{mes}</span><div style={{marginTop:10,padding:'4px 12px',borderRadius:999,background:'rgba(255,255,255,0.22)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,0.3)'}}><span style={{fontSize:11,fontWeight:800,color:'#fff'}}>{restante}</span></div></div>);
                            })()}
                        </div>
                    )}
                </div>

                {/* ── INFOS ── */}
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className={`text-xl font-bold mb-2 ${modoNoturno?'text-white':'text-slate-800'}`}>{revista.title}</h3>
                    <div className="flex flex-col gap-2 mb-6">
                        <div className="flex items-center text-slate-500 text-sm gap-2">
                            <MapPin size={16} className="text-slate-400 shrink-0"/>
                            <span className={`line-clamp-1 ${modoNoturno?'text-slate-400':''}`}>{revista.region}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                            <div className="flex items-center text-slate-500 text-sm gap-1.5"><Maximize size={16} className="text-slate-400 shrink-0"/><span className={modoNoturno?'text-slate-400':''}>{revista.size}</span></div>
                            <div className="flex items-center text-slate-500 text-sm gap-1.5"><Bed size={16} className="text-slate-400 shrink-0"/><span className={modoNoturno?'text-slate-400':''}>{revista.bedrooms}</span></div>
                            <div className="flex items-center text-slate-500 text-sm gap-1.5"><LayoutGrid size={16} className="text-slate-400 shrink-0"/><span className={modoNoturno?'text-slate-400':''}>{revista.flooring}</span></div>
                        </div>
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                        <RippleButton onClick={handleVerRevista}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${isDir?'bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:to-red-600 shadow-orange-300/30 text-white':'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-blue-300/30 text-white'}`}>
                            <BookOpen size={18}/> Ver Revista
                        </RippleButton>
                        <RippleButton onClick={handleVerPois}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold transition-colors duration-200 border text-sm ${modoNoturno?'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600':'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}>
                            <MapPin size={16} className="text-rose-500"/> Ver Pontos de Referência
                        </RippleButton>
                    </div>
                </div>
            </div>
        </>
    );
}

const HINT_PILLS_DATA = [
    {
        label: 'Pasta',
        color: 'linear-gradient(135deg,#6366f1,#4f46e5)',
        glow: 'rgba(99,102,241,0.7)',
        icon: <path d="M3 7a2 2 0 012-2h3.586a1 1 0 01.707.293L10.707 6.7A1 1 0 0011.414 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" fill="white"/>,
    },
    {
        label: 'Pasta Rápida IA',
        color: 'linear-gradient(135deg,#f97316,#ef4444)',
        glow: 'rgba(249,115,22,0.7)',
        icon: <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="white"/>,
    },
    {
        label: 'Taxas Docs',
        color: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
        glow: 'rgba(14,165,233,0.7)',
        icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white"/><polyline points="14,2 14,8 20,8" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/></>,
    },
];

function HintPills({ onPhaseChange }) {
    const [phase, setPhase] = useState('idle');

    useEffect(() => {
        if (sessionStorage.getItem('dst_hint_done')) return;
        const t1 = setTimeout(() => { setPhase('show'); onPhaseChange && onPhaseChange('show'); }, 5800);
        const t2 = setTimeout(() => { setPhase('fly'); onPhaseChange && onPhaseChange('fly'); }, 8500);
        const t3 = setTimeout(() => {
            setPhase('gone');
            onPhaseChange && onPhaseChange('gone');
            sessionStorage.setItem('dst_hint_done', '1');
        }, 9400);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    if (phase === 'idle' || phase === 'gone') return null;

    const pillAnims = HINT_PILLS_DATA.map((_, i) => ({
        enter: `hint-enter-${i}`,
        delay: `${i * 0.18}s`,
    }));

    return (
        <>
            <style>{`
                @keyframes hint-enter-0 {
                    0%   { opacity:0; transform: translateX(120px) translateY(-30px) rotate(12deg) scale(0.4); }
                    55%  { opacity:1; transform: translateX(-8px)  translateY(4px)   rotate(-2deg) scale(1.08); }
                    75%  { transform: translateX(4px) translateY(-2px) rotate(1deg)  scale(0.97); }
                    100% { opacity:1; transform: translateX(0)      translateY(0)     rotate(0deg)  scale(1); }
                }
                @keyframes hint-enter-1 {
                    0%   { opacity:0; transform: translateX(140px) translateY(-20px) rotate(8deg)  scale(0.35); }
                    55%  { opacity:1; transform: translateX(-6px)  translateY(3px)   rotate(-2deg) scale(1.06); }
                    75%  { transform: translateX(3px) translateY(-1px) rotate(1deg)  scale(0.98); }
                    100% { opacity:1; transform: translateX(0)      translateY(0)     rotate(0deg)  scale(1); }
                }
                @keyframes hint-enter-2 {
                    0%   { opacity:0; transform: translateX(160px) translateY(-10px) rotate(5deg)  scale(0.3); }
                    55%  { opacity:1; transform: translateX(-5px)  translateY(2px)   rotate(-1deg) scale(1.05); }
                    75%  { transform: translateX(2px) translateY(-1px) rotate(0deg)  scale(0.98); }
                    100% { opacity:1; transform: translateX(0)      translateY(0)     rotate(0deg)  scale(1); }
                }
                @keyframes hint-fly-0 {
                    0%   { opacity:1; transform: translateX(0)    translateY(0)    scale(1);    filter: brightness(1); }
                    30%  {            transform: translateX(10px) translateY(-8px) scale(1.1);  filter: brightness(1.4); }
                    100% { opacity:0; transform: translateX(60px) translateY(90px) scale(0.05); filter: brightness(2); }
                }
                @keyframes hint-fly-1 {
                    0%   { opacity:1; transform: translateX(0)    translateY(0)    scale(1);    filter: brightness(1); }
                    30%  {            transform: translateX(8px)  translateY(-5px) scale(1.08); filter: brightness(1.4); }
                    100% { opacity:0; transform: translateX(55px) translateY(75px) scale(0.05); filter: brightness(2); }
                }
                @keyframes hint-fly-2 {
                    0%   { opacity:1; transform: translateX(0)    translateY(0)    scale(1);    filter: brightness(1); }
                    30%  {            transform: translateX(6px)  translateY(-4px) scale(1.06); filter: brightness(1.4); }
                    100% { opacity:0; transform: translateX(50px) translateY(60px) scale(0.05); filter: brightness(2); }
                }
                @keyframes hint-shine {
                    0%   { left: -80%; }
                    100% { left: 160%; }
                }
            `}</style>

            <div style={{
                position: 'fixed',
                bottom: 108,
                right: 36,
                zIndex: 44,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 10,
                pointerEvents: 'none',
            }}>
                {HINT_PILLS_DATA.map((p, i) => (
                    <div key={i} style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '9px 16px 9px 10px',
                        borderRadius: 99,
                        background: p.color,
                        color: '#fff',
                        fontSize: 11.5,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        boxShadow: `0 0 0 1.5px rgba(255,255,255,0.15), 0 4px 20px ${p.glow}, 0 2px 6px rgba(0,0,0,0.3)`,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        // Animação: entrada ou saída dependendo da fase
                        animation: phase === 'show'
                            ? `hint-enter-${i} 0.65s cubic-bezier(0.22,1,0.36,1) ${pillAnims[i].delay} both`
                            : `hint-fly-${i} 0.65s cubic-bezier(0.55,0,1,0.45) ${i * 0.07}s both`,
                    }}>
                        <div style={{
                            width: 22, height: 22, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.22)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <svg width="11" height="11" viewBox="0 0 24 24">{p.icon}</svg>
                        </div>
                        {p.label}
                        <div style={{
                            position: 'absolute', top: 0, width: '45%', height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
                            transform: 'skewX(-18deg)',
                            animation: `hint-shine 2.2s ease-in-out ${0.8 + i * 0.4}s infinite`,
                            pointerEvents: 'none',
                        }}/>
                    </div>
                ))}
            </div>
        </>
    );
}

function RevistaCloseButton({ onClose }) {
    useEffect(() => {
        const blockZoom = (e) => {
            if (e.ctrlKey || e.metaKey) { e.preventDefault(); e.stopPropagation(); }
        };
        const blockGesture = (e) => { e.preventDefault(); };
        document.addEventListener('wheel',         blockZoom,    { passive: false, capture: true });
        document.addEventListener('gesturestart',  blockGesture, { passive: false, capture: true });
        document.addEventListener('gesturechange', blockGesture, { passive: false, capture: true });
        document.addEventListener('gestureend',    blockGesture, { passive: false, capture: true });
        return () => {
            document.removeEventListener('wheel',         blockZoom,    { capture: true });
            document.removeEventListener('gesturestart',  blockGesture, { capture: true });
            document.removeEventListener('gesturechange', blockGesture, { capture: true });
            document.removeEventListener('gestureend',    blockGesture, { capture: true });
        };
    }, []);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0,
            width: '100vw', height: '0',
            pointerEvents: 'none',
            zIndex: 99999,
        }}>
            <button
                onClick={onClose}
                style={{
                    pointerEvents: 'all',
                    position: 'absolute',
                    top: 'calc(env(safe-area-inset-top, 0px) + 14px)',
                    left: '14px',
                    width: 48, height: 48,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255,255,255,0.30)',
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff',
                    transition: 'background 0.15s, transform 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,30,30,0.75)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.55)'; }}
                onMouseDown={e  => { e.currentTarget.style.transform = 'scale(0.90)'; }}
                onMouseUp={e    => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
                <X size={22} strokeWidth={2.5} />
            </button>
        </div>
    );
}

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
    const [revistasData] = useState(revistasDataLocal);
    const [activeBrand, setActiveBrand] = useState('Direcional');
    const [fraseDoDia] = useState(frasesMotivacionais[dayIndex % frasesMotivacionais.length]);
    const [imagemDoDia] = useState(() => {
        const shuffled = [...imagensEquipeDiarias].sort(() => Math.random() - 0.5);
        return shuffled[0];
    });
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
    const cardGridRef = useRef(null);

    // === ESTADOS PARA CRIAÇÃO DE PASTA DO CLIENTE ===
    const fileInputRef = useRef(null);
    const quickFolderInputRef = useRef(null);
    const [isOrganizingDocs, setIsOrganizingDocs] = useState(false);
    const [organizeProgress, setOrganizeProgress] = useState({ current: 0, total: 0, label: '' });
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [folderSource, setFolderSource] = useState('manual'); // 'manual' | 'rapida'
    const [isFinalizingFolder, setIsFinalizingFolder] = useState(false);
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
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        page.cleanup();
        return canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
    };

    const fileToBase64 = (arrayBuffer) => {
        const bytes = new Uint8Array(arrayBuffer);
        const chunkSize = 8192;
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        return btoa(binary);
    };

    const resizeImageForAI = async (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);
                const MAX = 1280;
                let w = img.width, h = img.height;
                if (w > MAX || h > MAX) {
                    if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
                    else { w = Math.round(w * MAX / h); h = MAX; }
                }
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                const b64 = canvas.toDataURL('image/jpeg', 0.88).split(',')[1];
                resolve(b64);
            };
            img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
            img.src = url;
        });
    };

    
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
                
                await sleep(2000);
                return null;
            }
            if (!res.ok) {
                const err = await res.text();
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
            } else {
            }
            return null;
        }
    };

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

    const classifyByFilename = (filename) => {
        const name = filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[_\-\.]/g, ' ');
        const result = matchKeywords(name);
        if (result) {
            return result;
        }
        return null;
    };

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
                return result;
            }
        } catch {}
        return null;
    };

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
                return result;
            }
        } catch {}
        return null;
    };

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
                return result;
            }
        } catch {}
        return null;
    };

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
                return result;
            }
        } catch {}
        return null;
    };

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
                mime = 'image/jpeg';
                b64 = await resizeImageForAI(file);
                if (!b64) return { category: 'outros', order: 99, label: 'Outro Documento' };

                // ── Arma 4: OCR em imagens (usa cópia fresca do buffer) ──
                const arm4img = await classifyByOCR(masterBuffer.slice(0), mime);
                if (arm4img) return arm4img;
            } else {
                return { category: 'outros', order: 99, label: 'Outro Documento' };
            }

            // ── IA (último recurso) ──
            
            for (const model of VISION_MODELS) {
                const result = await tryModel(model, b64, mime);
                if (result) {
                    return result;
                }
                await sleep(300);
            }

            return { category: 'outros', order: 99, label: 'Outro Documento' };
        } catch (err) {
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
            setShowLightning(true);
            setTimeout(() => setShowLightning(false), 2800);
        } catch (error) {
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
                                    { id: 'Ranking',     label: 'VER RANKING',  icon: <Trophy size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, href: 'https://ranking-direcional.streamlit.app/' },
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
                            { id: 'Ranking',     label: 'VER RANKING',     icon: <Trophy size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, href: 'https://ranking-direcional.streamlit.app/' },
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

            <main className="main-content max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: `${headerHeight}px` }}>
                {/* BANNER INSPIRAÇÃO DIÁRIA */}
                {/* ── BANNER + ABAS ── */}
                <div className="relative shadow-lg banner-reveal" style={{
                    borderRadius: 24,
                    clipPath: 'inset(0 round 24px)',
                    marginTop: 12,
                    marginBottom: 8,
                }}>
                    <img src={imagemDoDia} onError={(e) => { e.target.src = '' }} alt="Equipe Destemidos" className="w-full h-72 sm:h-96 object-cover bg-slate-200 banner-ken-burns" style={{ objectPosition: `center ${bannerFocusY}`, display: 'block' }} />
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
                        <div className="px-4 sm:px-8 pt-4 sm:pt-8">
                            <div className="flex items-center gap-2 mb-2 sm:mb-3 banner-text-1">
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10 }}>
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
                        <div className="mt-3 sm:mt-5 pb-4">
                            {(() => {
                                const TABS = [
                                    { id: 'Direcional',  label: 'DIRECIONAL', icon: <span style={{width:5,height:5,borderRadius:2,background:'rgba(255,255,255,0.7)',flexShrink:0,display:'inline-block'}}/>, action: () => setActiveBrand('Direcional'), isBtn: true },
                                    { id: 'Riva',        label: 'RIVA',        icon: <span style={{width:5,height:5,borderRadius:2,background:'rgba(255,255,255,0.7)',flexShrink:0,display:'inline-block'}}/>, action: () => setActiveBrand('Riva'),        isBtn: true },
                                    { id: 'Ranking',     label: 'VER RANKING',     icon: <Trophy size={13} style={{color:'rgba(255,255,255,0.6)',flexShrink:0}}/>, href: 'https://ranking-direcional.streamlit.app/' },
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredRevistas.filter(r => r.pinned).map((revista, cardIdx) => (
                                        <div key={`pinned-${revista.id}`} style={{ position: 'relative' }}>
                                            <span style={{
                                                position: 'absolute', top: 12, right: 12, zIndex: 30,
                                                background: 'linear-gradient(135deg, #8b1c3a 0%, #c2185b 100%)',
                                                color: '#fff', fontSize: 9, fontWeight: 900,
                                                letterSpacing: '0.16em', padding: '4px 11px',
                                                borderRadius: 999, textTransform: 'uppercase',
                                                boxShadow: '0 2px 10px rgba(139,28,58,0.5)',
                                                border: '1px solid rgba(255,255,255,0.25)',
                                                pointerEvents: 'none',
                                            }}>✦ NOVA</span>
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
                                        </div>
                                    ))}
                                    {filteredRevistas.filter(r => !r.pinned).map((revista, cardIdx) => (
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
                    'Moratta Home Riva':            '-3.077458,-60.020785',
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
                                        onTouchMove={handleDragTouchMove}
                                        onTouchEnd={handleDragTouchEnd}
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
                            {/* Pasta Rápida IA */}
                            <button
                                onClick={(e) => {
                                    haptic('medium');
                                    const clicks = pastaRapidaClicksRef.current;
                                    if (clicks < 5) {
                                        e.preventDefault(); e.stopPropagation();
                                        pastaRapidaClicksRef.current = clicks + 1;
                                        localStorage.setItem('dst_pr_clicks', String(clicks + 1));
                                        setShowPastaRapidaInfo(true);
                                    } else {
                                        setFolderSource('rapida');
                                        quickFolderInputRef.current?.click();
                                    }
                                }}
                                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 text-white relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #f97316 0%, #ef4444 60%, #f59e0b 100%)',
                                    boxShadow: '0 0 0 2px rgba(249,115,22,0.3), 0 0 14px 3px rgba(249,115,22,0.35)',
                                    animation: 'pr-pulse 1.6s ease-in-out infinite',
                                }}>
                                <span className="absolute inset-0 pasta-rapida-btn pointer-events-none" style={{borderRadius:'9999px'}}></span>
                                <Sparkles size={11} className="shrink-0 relative z-10" style={{filter:'drop-shadow(0 0 4px rgba(255,255,255,0.9))', animation:'spin 3s linear infinite'}} />
                                <span className="relative z-10" style={{letterSpacing:'0.06em'}}>Pasta Rápida IA</span>
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
